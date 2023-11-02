import { firestore } from '@/app/firebase';
import {
  getAveragePrice,
  getEmailNotifType,
  getHighestPrice,
  getLowestPrice,
} from '@/lib/actions/client';
import { generateEmailBody, sendEmail } from '@/lib/nodemailer';

import { scrapeAmazonProduct } from '@/lib/scraper';
import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import { createSearchParamsBailoutProxy } from 'next/dist/client/components/searchparams-bailout-proxy';
import { NextResponse } from 'next/server';
import { before } from 'node:test';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
const delay = (ms: any) => new Promise((resolve) => setTimeout(resolve, ms));

export async function GET() {
  try {
    const allItemsDoc = collection(firestore, 'items');
    const products = await getDocs(allItemsDoc);

    if (!products) throw new Error('No products found');

    // Scrape latest product details and update firebase
    const updatedProducts = await Promise.all(
      products.docs.map(async (currentProduct) => {
        const scrapedProduct = await scrapeAmazonProduct(
          currentProduct.data().url
        );

        if (!scrapedProduct) {
          return;
        }

        const updatedPriceHistory = [
          ...currentProduct.data().price_history,
          { price: scrapedProduct.current_price },
        ];
        console.log(updatedPriceHistory);
        const product = {
          ...scrapedProduct,
          price_history: updatedPriceHistory,
          highest_price: getHighestPrice(updatedPriceHistory),
          lowest_price: getLowestPrice(updatedPriceHistory),
          average_price: getAveragePrice(updatedPriceHistory),
          id: currentProduct.id,
        };
        console.log(product);
        const beforeProduct = {
          url: currentProduct.data().url,
          title: currentProduct.data().title,
          current_price: currentProduct.data().current_price,
          highest_price: currentProduct.data().highest_price,
          lowest_price: currentProduct.data().lowest_price,
          average_price: currentProduct.data().average_price,
          rating: currentProduct.data().rating,
          rating_count: currentProduct.data().rating_count,
          amazons_choice: currentProduct.data().amazons_choice,
          recommend: currentProduct.data().recommend,
          image: currentProduct.data().image,
          id: currentProduct.id,
          price_history: updatedPriceHistory,
          category: currentProduct.data().category,
        };
        console.log('before product', beforeProduct);
        const emailNotifType = getEmailNotifType(scrapedProduct, beforeProduct);
        console.log('email type is ', emailNotifType);
        const id = currentProduct.id;
        console.log('after id assign');
        if (!id) return;
        console.log('after id');
        console.log(id);
        const productDocRef = doc(firestore, 'items', id);
        const updatedProduct = await updateDoc(productDocRef, product);

        if (emailNotifType && scrapedProduct.users_tracking.length > 0) {
          const productInfo = {
            title: scrapedProduct.title,
            url: scrapedProduct.url,
          };
          // Construct emailContent
          const emailContent = await generateEmailBody(
            productInfo,
            emailNotifType
          );
          // Get array of user emails
          const userEmails = scrapedProduct.users_tracking.map(
            (user: any) => user.email
          );
          // Send email notification
          await sendEmail(emailContent, userEmails);
        }

        // await delay(1000);
        return updatedProduct;
      })
    );
    return NextResponse.json({
      message: 'Ok',
      data: updatedProducts,
    });
  } catch (error) {
    throw new Error(`ERROR IN GET: ${error}`);
  }
}

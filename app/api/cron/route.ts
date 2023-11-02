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
import { NextResponse } from 'next/server';

export const maxDuration = 10;
export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

        if (!scrapedProduct) throw new Error('No product found');

        const updatedPriceHistory = [
          ...currentProduct.data().price_history,
          { price: scrapedProduct.current_price },
        ];

        const product = {
          ...scrapedProduct,
          price_history: updatedPriceHistory,
          highest_price: getHighestPrice(updatedPriceHistory),
          lowest_price: getLowestPrice(updatedPriceHistory),
          average_price: getAveragePrice(updatedPriceHistory),
        };
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
          price_history: currentProduct.data().price_history,
          category: currentProduct.data().category,
        };
        const emailNotifType = getEmailNotifType(scrapedProduct, beforeProduct);

        const id = scrapedProduct.id;

        if (!id) return;
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

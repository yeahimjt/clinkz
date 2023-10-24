'use server';

import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { scrapeAmazonProduct } from '../scraper';
import { app, firestore } from '@/app/firebase';
import { redirect } from 'next/navigation';
import { Product } from '@/app/constants';

export async function handleScrapeAndStore(url: string) {
  if (!url) return false;
  const productStoredId = await checkProductStored(url);
  if (productStoredId) {
    redirect(`/product/${productStoredId}`);
  } else {
    const productData = await scrapeAmazonProduct(url);
    if (!productData) return false;
    const productStoredData = await storeProduct(productData);
    // Implement check for product being stored?
    return productStoredData;
  }
}

export async function storeProduct(product: Product) {
  const db = firestore;
  const docRef = doc(db, 'products', generateUniqueId());
  return await setDoc(docRef, {
    url: product.url,
    title: product.title,
    current_price: product.current_price,
    highest_price: product.highest_price,
    lowest_price: product.lowest_price,
    average_price: product.average_price,
    rating: product.rating,
    rating_count: product.rating_count,
    amazons_choice: product.amazons_choice,
    recommend: product.recommend,
    image: product.image,
    timestamp: serverTimestamp(),
  });
}

export async function checkProductStored(url: string) {
  const db = firestore;
  const productsCollection = collection(db, 'products');
  const q = query(productsCollection, where('url', '==', url));

  try {
    const querySnapshot = await getDocs(q);
    if (querySnapshot.size > 0) {
      return querySnapshot.docs[0].id;
    }
  } catch (error: any) {
    console.log('Error getting documents by URL', error.message);
  }
}

function generateUniqueId() {
  // Generate a unique ID by combining a timestamp and a random number
  const timestamp = Date.now().toString(36); // Convert timestamp to base36
  const random = (Math.random() * 100000000).toString(36); // Generate random number and convert to base36
  const uniqueId = timestamp + random;

  return uniqueId;
}

export async function grabRecent() {
  const products: Product[] = [];
  const db = firestore;
  const productsCollection = collection(db, 'products');
  const q = query(productsCollection, limit(8));
  const limitedProducts = await getDocs(q);

  if (limitedProducts) {
    limitedProducts.forEach((product) => {
      products.push({
        url: product.data().url,
        title: product.data().title,
        current_price: product.data().current_price,
        highest_price: product.data().highest_price,
        lowest_price: product.data().lowest_price,
        average_price: product.data().average_price,
        rating: product.data().rating,
        rating_count: product.data().rating_count,
        amazons_choice: product.data().amazons_choice,
        recommend: product.data().recommend,
        image: product.data().image,
        id: product.id,
      });
    });
    return products;
  }
}

export async function getProduct(id: string) {
  const productsDocRef = doc(firestore, 'products', id);
  const productSnapshot = await getDoc(productsDocRef);

  if (productSnapshot.exists()) {
    return {
      url: productSnapshot.data().url,
      title: productSnapshot.data().title,
      current_price: productSnapshot.data().current_price,
      highest_price: productSnapshot.data().highest_price,
      lowest_price: productSnapshot.data().lowest_price,
      average_price: productSnapshot.data().average_price,
      rating: productSnapshot.data().rating,
      rating_count: productSnapshot.data().rating_count,
      amazons_choice: productSnapshot.data().amazons_choice,
      recommend: productSnapshot.data().recommend,
      image: productSnapshot.data().image,
      id: productSnapshot.id,
    };
  }
}

export async function updateProductWithUserEmail(
  user_id: string,
  user_email: string,
  product_id: string
) {
  const productDocRef = doc(firestore, 'products', product_id);
  const productSnapshot = await getDoc(productDocRef);
  if (productSnapshot.exists()) {
    await updateDoc(productDocRef, {
      users_tracking: arrayUnion(user_email),
    });
    const userDocRef = doc(firestore, 'users', user_id);
    await updateDoc(userDocRef, {
      products_tracking: arrayUnion({
        ...productSnapshot.data(),
        id: productSnapshot.id,
      }),
    });
    return true;
  } else {
    return false;
  }
}
export async function updateProductWithoutUserEmail(
  user_id: string,
  user_email: string,
  product_id: string
) {
  const productDocRef = doc(firestore, 'products', product_id);
  const productSnapshot = await getDoc(productDocRef);
  if (productSnapshot.exists()) {
    await updateDoc(productDocRef, {
      users_tracking: arrayRemove(user_email),
    });
    const userDocRef = doc(firestore, 'users', user_id);
    const userSnapshot = await getDoc(userDocRef);
    if (userSnapshot.exists()) {
      const tracking_array = userSnapshot.data().products_tracking;
      const updated_tracking_array: any = tracking_array.filter(
        (tracking_item: any) => tracking_item.id !== product_id
      );
      await updateDoc(userDocRef, {
        products_tracking: updated_tracking_array,
      });
    }
    return true;
  } else {
    return false;
  }
}
function truncateTextWithEllipsis(text: string, maxLength: number) {
  if (text.length <= maxLength) {
    // If the text is shorter than or equal to maxLength, no truncation needed
    return text;
  } else {
    // Otherwise, truncate and add an ellipsis
    return text.substring(0, maxLength) + '...';
  }
}

export async function getUserTracking(user_id: string) {
  console.log(user_id);
  const userDocRef = doc(firestore, 'users', user_id);
  const userSnapshot = await getDoc(userDocRef);
  if (userSnapshot.exists()) {
    const temp: any = [];
    userSnapshot.data().products_tracking?.forEach((product_tracking: any) =>
      temp.push({
        title: truncateTextWithEllipsis(product_tracking.title, 30),
        id: product_tracking.id,
        current_price: product_tracking.current_price,
        rating: product_tracking.rating,
        url: product_tracking.url,
      })
    );
    return temp;
  } else {
    return false;
  }
}

export async function updateUser(
  user_id: string,
  displayName: string,
  email: string
) {
  const userDocRef = doc(firestore, 'users', user_id);
  const userSnapshot = await getDoc(userDocRef);
  if (userSnapshot.exists()) {
    await updateDoc(userDocRef, {
      ...userSnapshot.data(),
      displayName: displayName,
      email: email,
    });
    return true;
  } else {
    return false;
  }
}

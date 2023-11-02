'use server';

import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  endAt,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  startAt,
  updateDoc,
  where,
} from 'firebase/firestore';
import { scrapeAmazonProduct } from '../scraper';
import { app, firestore } from '@/app/firebase';

import { PriceHistoryItem, Product } from '@/app/constants';

export async function handleScrapeAndStore(url: string, user_id: string) {
  // No URL passed
  if (!url) return false;
  console.log('in here scrape and store');
  // Check if this specific amazon product link has already been stored to prevent repetitive scraping
  const productStoredId = await checkProductStored(url);

  // Product has already been stored, return true
  if (productStoredId) {
    return productStoredId;
  } else {
    // Scrape the amazon product link
    const productData = await scrapeAmazonProduct(url);
    console.log('productData before check', productData);

    // Scrape unsuccessful (amazon prevented it, brightdata has not switched ip)
    if (productData == null) return false;

    // Scrape successful, now store the scraped data in the database for future use
    const productIdStored = await storeProduct(productData, user_id);
    console.log('returning true');
    if (productIdStored) {
      return productIdStored;
    }
  }
}

export async function storeProduct(product: Product, user_id: string) {
  const db = firestore;
  const id = generateUniqueId();
  const docRef = doc(db, 'items', id);
  await setDoc(docRef, {
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
    owner: user_id,
    price_history: product.price_history,
    category: product.category,
  });
  return id;
}

export async function checkProductStored(url: string) {
  const productsCollection = collection(firestore, 'items');
  const q = query(productsCollection, where('url', '==', url));

  try {
    const querySnapshot = await getDocs(q);
    if (querySnapshot.size > 0) {
      console.log(querySnapshot.docs[0].data());
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

export async function getProduct(id: string) {
  const productsDocRef = doc(firestore, 'items', id);
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
      price_history: productSnapshot.data().price_history,
      category: productSnapshot.data().category,
    };
  }
}

export async function updateProductWithUserEmail(
  user_id: string,
  user_email: string,
  product_id: string
) {
  const itemsDocRef = doc(firestore, 'items', product_id);
  try {
    await updateDoc(itemsDocRef, { users_tracking: arrayUnion(user_email) });
    return true;
  } catch (error) {
    console.log('Error adding user product tracking', error);
    return false;
  }
}
export async function updateProductWithoutUserEmail(
  user_id: string,
  user_email: string,
  product_id: string
) {
  console.log(product_id);
  const productDocRef = doc(firestore, 'items', product_id);
  const productSnapshot = await getDoc(productDocRef);
  if (productSnapshot.exists()) {
    await updateDoc(productDocRef, {
      users_tracking: arrayRemove(user_email),
    });

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

export async function getUserTracking(user_email: string) {
  const itemsCollection = collection(firestore, 'items');
  const q = query(
    itemsCollection,
    where('users_tracking', 'array-contains', user_email)
  );
  try {
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return false;
    const items: any = [];
    querySnapshot.forEach((doc) => {
      const itemData = doc.data();
      items.push({
        title: truncateTextWithEllipsis(itemData.title, 30),
        id: doc.id,
        current_price: itemData.current_price,
        rating: itemData.rating,
        url: itemData.url,
      });
    });
    console.log(items);
    return items;
  } catch (error) {
    console.log('Error fetching items: ', error);
    return;
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

export async function updateList(id: string, item_id: string) {
  const listDocRef = doc(firestore, 'lists', id);
  try {
    await updateDoc(listDocRef, {
      items: arrayUnion(item_id),
    });
    return id;
  } catch (error: any) {
    console.log(`failed to create new list ${error}`);
    return null;
  }
}

export async function createNewList(
  name: string,
  owner: string,
  items?: string[]
) {
  const id = generateUniqueId();
  const listDocRef = doc(firestore, 'lists', id);
  try {
    await setDoc(listDocRef, {
      name: name,
      owner: owner,
      items: items || [],
      timestamp: serverTimestamp(),
    });
    return id;
  } catch (error: any) {
    console.log(`failed to create new list ${error}`);
    return null;
  }
}

export async function getLists(owner: string) {
  const listsCollection = collection(firestore, 'lists');
  const q = query(listsCollection, where('owner', '==', owner));
  try {
    const listsSnapshot = await getDocs(q);
    if (listsSnapshot.empty) return null;

    const temp: {
      items: string[];
      name: string;
      owner: string;
      id: string;
    }[] = [];
    listsSnapshot.forEach((list) => {
      temp.push({
        items: list.data().items,
        name: list.data().name,
        owner: list.data().owner,
        id: list.id,
      });
    });
    console.log(temp);
    return temp;
  } catch (error: any) {
    console.log(`failed to get lists ${error}`);
  }
}

export async function getListsItems(list_array: string[]) {
  if (!list_array) return;
  const itemData = [];
  for (const item of list_array) {
    const itemDocRef = doc(firestore, 'items', item);
    const itemSnapshot = await getDoc(itemDocRef);
    if (!itemSnapshot.exists()) return;

    itemData.push({
      id: item,
      current_price: itemSnapshot.data().current_price,
      highest_price: itemSnapshot.data().highest_price,
      average_price: itemSnapshot.data().average_price,
      best_price: itemSnapshot.data().lowest_price,
      name: itemSnapshot.data().title,
    });
  }
  console.log(itemData);
  return itemData;
}

export async function grabAllItems() {
  const itemsCollection = collection(firestore, 'items');
  const products: Product[] = [];
  try {
    const itemsDocSnapshot = await getDocs(itemsCollection);
    if (!itemsDocSnapshot.empty) {
      itemsDocSnapshot.forEach((product) => {
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
          price_history: product.data().price_history,
          category: product.data().category,
        });
      });
    }
    return products;
  } catch (error) {
    console.log(`failed to get all items ${error}`);
    return null;
  }
}

export async function searchForItems(queryString: string) {
  const products: Product[] = [];
  if (queryString === '') return null;
  const itemsCollection = collection(firestore, 'items');
  const q = query(
    itemsCollection,
    orderBy('title'),
    startAt(queryString),
    endAt(queryString + '\uf8ff')
  );
  try {
    const itemsSnapshot = await getDocs(q);
    if (!itemsSnapshot.empty) {
      itemsSnapshot.forEach((product) => {
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
          price_history: product.data().price_history,
          category: product.data().category,
        });
      });

      return products;
    }
  } catch (error) {
    console.log(`failed to get items with query ${queryString} ${error}`);
    return null;
  }
}

export async function updateProduct(product: Product) {}
// export const getEmailNotifType = (
//   scrapedProduct: Product,
//   currentProduct: Product
// ) => {
//   const lowestPrice = getLowestPrice(currentProduct.priceHistory);

//   if (scrapedProduct.currentPrice < lowestPrice) {
//     return Notification.LOWEST_PRICE as keyof typeof Notification;
//   }
//   if (!scrapedProduct.isOutOfStock && currentProduct.isOutOfStock) {
//     return Notification.CHANGE_OF_STOCK as keyof typeof Notification;
//   }
//   if (scrapedProduct.discountRate >= THRESHOLD_PERCENTAGE) {
//     return Notification.THRESHOLD_MET as keyof typeof Notification;
//   }

//   return null;
// };

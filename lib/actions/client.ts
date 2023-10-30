import { Product, Subscription } from '@/app/constants';
import { firestore } from '@/app/firebase';
import {
  collection,
  doc,
  getDocs,
  limit,
  query,
  where,
} from 'firebase/firestore';

export async function grabRecent() {
  try {
    const products: Product[] = [];
    const db = firestore;
    const productsCollection = collection(db, 'items');
    const q = query(productsCollection, limit(8));
    const limitedProducts = await getDocs(q);

    if (limitedProducts) {
      console.log('inside');
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
        console.log(products);
      });
      console.log('returning');
      return products;
    } else {
      console.log('in error');
      throw new Error('No products found in Firestore.');
    }
  } catch (error) {
    console.error('Error fetching recent products:', error);
    return null;
  }
}

export async function checkMonthlyLinks(user_id: string) {
  try {
    const itemsCollection = collection(firestore, 'items');
    const q = query(itemsCollection, where('owner', '==', user_id));
    const usersTracking = await getDocs(q);
    return usersTracking.size;
  } catch (error) {
    console.log('An error occurred while fetching user tracking:', error);
    throw error;
  }
}

export async function getTrack(user_id: string) {
  console.log(user_id);
  try {
    const itemsCollection = collection(firestore, 'items');
    const q = query(
      itemsCollection,
      where('users_tracking', 'array-contains', user_id)
    );
    const usersTracking = await getDocs(q);
    console.log(usersTracking);
    return usersTracking;
  } catch (error) {
    console.log('An error occurred while fetching user tracking:', error);
    throw error;
  }
}

// Based on users subscription, check if they are at the limit for # of tracks.
// True - They are at their limit, prevent them from creating another
// False - They have tracks remaining
export async function checkTrack(user_id: string, subscription: Subscription) {
  const limit = subscription ? 20 : 5;
  const usersTracking = await getTrack(user_id);
  if (!usersTracking.empty) {
    if (usersTracking.size !== limit) {
      return false;
    } else {
      return true;
    }
  } else {
    return false;
  }
}

export async function getListCount(user_email: string) {
  try {
    const listsCollection = collection(firestore, 'lists');
    const q = query(listsCollection, where('owner', '==', user_email));
    const usersLists = await getDocs(q);
    return usersLists.size;
  } catch (error) {
    console.log('An error occurred while fetching user tracking:', error);
    throw error;
  }
}

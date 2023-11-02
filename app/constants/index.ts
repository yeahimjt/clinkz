import { DocumentData, DocumentReference, Timestamp } from 'firebase/firestore';
import Stripe from 'stripe';
export interface Product {
  url: string;
  title: string;
  current_price: number;
  price_history: PriceHistoryItem[];
  highest_price: number;
  lowest_price: number;
  average_price: number;
  rating: string;
  rating_count: string;
  amazons_choice: boolean;
  recommend: string;
  image: string | undefined;
  id: string | undefined;
  category: string;
  users_tracking?: string[];
}
export interface ProductTable {
  title: string;
  id: string;
  current_price: number;
  rating: string;
  url: string;
}

export type PriceHistoryItem = {
  price: number;
};

export const FIREBASE_ERRORS: { [key: string]: string } = {
  'auth/email-already-in-use': 'Email Address is already in use.',
  'auth/invalid-login-credentials': 'Invalid credentials.',
  'auth/invalid-email': 'Invalid email.',
};

export interface Subscription {
  id?: string;
  metadata: {
    [name: string]: string;
  };
  stripeLink: string;
  role: string | null;
  quantity: number;
  items: Stripe.SubscriptionItem[];

  product: DocumentReference<DocumentData>;
  price: DocumentReference<DocumentData>;
  prices: Array<DocumentReference<DocumentData>>;
  payment_method?: string;
  latest_invoice?: string;

  status:
    | 'active'
    | 'canceled'
    | 'incomplete'
    | 'incomplete_expired'
    | 'past_due'
    | 'trialing'
    | 'unpaid';

  cancel_at_period_end: boolean;
  created: Timestamp;
  current_period_start: Timestamp;
  current_period_end: Timestamp;
  ended_at: Timestamp | null;
  cancel_at: Timestamp | null;
  canceled_at: Timestamp | null;
  trial_start: Timestamp | null;
  trial_end: Timestamp | null;
}

export type NotificationType =
  | 'WELCOME'
  | 'CHANGE_OF_STOCK'
  | 'LOWEST_PRICE'
  | 'THRESHOLD_MET';

export type EmailContent = {
  subject: string;
  body: string;
};

export type EmailProductInfo = {
  title: string;
  url: string;
};

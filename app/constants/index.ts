export interface Product {
  url: string;
  title: string;
  current_price: number;
  highest_price: number;
  lowest_price: number;
  average_price: number;
  rating: string;
  rating_count: string;
  amazons_choice: boolean;
  recommend: string;
  image: string | undefined;
  id: string | undefined;
}

export const FIREBASE_ERRORS: { [key: string]: string } = {
  'auth/email-already-in-use': 'Email Address is already in use.',
  'auth/invalid-login-credentials': 'Invalid credentials.',
  'auth/invalid-email': 'Invalid email.',
};

export interface ProductTable {
  title: string;
  id: string;
  current_price: number;
  rating: string;
  url: string;
}

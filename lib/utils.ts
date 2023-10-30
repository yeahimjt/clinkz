import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: string) {
  // Remove non-numeric characters (except '.') and convert to a number with two decimal places.
  const numericPrice = parseFloat(price.replace(/[^0-9.]/g, '')).toFixed(2);

  // Parse the numeric price string to a number.
  return parseFloat(numericPrice);
}

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a value as HKD currency string.
 * Handles Prisma Decimal (serialised as string), undefined, null, and number inputs.
 */
export function formatHKD(amount: number | string | null | undefined): string {
  const num = Number(amount) || 0;
  return `HK$ ${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

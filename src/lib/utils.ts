import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { differenceInDays, parseISO } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isStale(lastActivityAt?: string | null): boolean {
  if (!lastActivityAt) return true; // Never active -> stale
  const lastActiveDate = parseISO(lastActivityAt);
  const diff = differenceInDays(new Date(), lastActiveDate);
  return diff > 1; // More than 1 day of inactivity -> stale
}

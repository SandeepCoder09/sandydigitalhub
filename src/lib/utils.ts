import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatOrderId(id: string, dateStr?: string | Date) {
  if (!id) return "SDH-ORDER";
  const dateObj = dateStr ? new Date(dateStr) : new Date();
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  const shortHash = id.toString().slice(-4).toUpperCase();
  return `SDH-${year}${month}${day}-${shortHash}`;
}

export function formatDateTime(dateStr: string | Date) {
  if (!dateStr) return "N/A";
  const dateObj = new Date(dateStr);
  return dateObj.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

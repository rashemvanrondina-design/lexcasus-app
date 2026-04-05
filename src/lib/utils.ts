import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge'; // Recommended for Tailwind safety
import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Utility for Tailwind CSS class merging
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 🟢 NEW: The "Court Reporter" (Activity Logger)
 * Call this function whenever a significant action occurs in the app.
 */
export const logActivity = async (
  action: string, 
  detail: string, 
  type: 'user' | 'subscription' | 'question' | 'case' | 'codal'
) => {
  try {
    await addDoc(collection(db, 'activity_logs'), {
      action,
      detail,
      type,
      timestamp: serverTimestamp(),
    });
  } catch (e) {
    console.error("Failed to record activity log:", e);
  }
};

/**
 * 🟢 NEW: Format timestamps to relative time (e.g., "5 mins ago")
 */
export function formatRelativeTime(date: Date | any): string {
  if (!date) return 'Just now';
  
  // Handle Firestore Timestamp objects
  const d = date.seconds ? new Date(date.seconds * 1000) : new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return d.toLocaleDateString();
}

export function getInitials(name: string): string {
  if (!name) return '??';
  return name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export function truncate(str: string, length: number): string {
  if (!str) return '';
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export function generateId(): string {
  return crypto.randomUUID();
}
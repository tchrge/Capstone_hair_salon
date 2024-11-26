import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { collection, addDoc, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const cnn = (...classes: (string | undefined)[]) => {
  return classes.filter(Boolean).join(" ");
};

const testPromotions = [
  {
    title: "Holiday Special",
    description: "Get 25% off any service this holiday season!",
    discount: 25,
    validUntil: Timestamp.fromDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)), // 30 days from now
  },
  {
    title: "New Client Offer",
    description: "First-time clients receive 20% off their first visit",
    discount: 20,
    validUntil: Timestamp.fromDate(new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)), // 60 days from now
  },
  {
    title: "Premium Package",
    description: "Book a haircut + style combo and save 15%",
    discount: 15,
    validUntil: Timestamp.fromDate(new Date(Date.now() + 45 * 24 * 60 * 60 * 1000)), // 45 days from now
  }
];

export const initializePromotions = async () => {
  try {
    // Check if promotions exist
    const snapshot = await getDocs(collection(db, 'promotions'));

    if (snapshot.empty) {
      // Add test promotions if collection is empty
      const promises = testPromotions.map(promotion =>
        addDoc(collection(db, 'promotions'), promotion)
      );

      await Promise.all(promises);
      console.log('Test promotions added successfully');
    }
  } catch (error) {
    console.error('Error initializing promotions:', error);
  }
};

import { Timestamp } from "firebase/firestore";

export interface Promotion {
    id: string;
    title: string;
    description: string;
    discount: number;
    validUntil: Timestamp;
    imageUrl?: string;
  }
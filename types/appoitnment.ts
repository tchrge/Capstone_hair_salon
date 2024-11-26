import { Timestamp } from "firebase/firestore";

export interface Appointment {
  id: String,
  barber: String,
  barberId: String,
  createdAt: Timestamp,
  end: Timestamp,
  services: { id: string; name: string; duration: number; cost: number }[];
  start: Timestamp,
  status: String,
  totalCost: number,
  duration: number
}
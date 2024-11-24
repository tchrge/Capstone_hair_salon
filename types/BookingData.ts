import { Service } from "./service";
export interface BookingData {
    barberId: string;
    barberName: string;
    services: Service[];
    date: Date;
    time: string;
    totalCost: number;
    totalDuration: number;
}
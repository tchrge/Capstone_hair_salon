import { Service } from "@/types/service"
export interface Barber {
    id: string;
    name: string;
    email: string;
    bio: string;
    experience: number;
    services: Service[];
    image?: string;
}
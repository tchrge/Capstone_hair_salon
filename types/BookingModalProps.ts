import { Appointment } from "./appoitnment";
import { BookingData } from "./BookingData";

export interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onBookAppointment: (data: Appointment) => Promise<void>;
}
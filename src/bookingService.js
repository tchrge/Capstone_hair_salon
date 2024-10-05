import { db } from "./firebaseConfig.js";
import { collection, addDoc, query, where, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";

// Create a booking
async function createBooking(barberId, customerName, startTime, endTime) {
    try {
        const bookingRef = await addDoc(collection(db, "bookings"), {
            barberId,
            customerName,
            startTime,
            endTime
        });
        console.log("Booking created with ID: ", bookingRef.id);
    } catch (error) {
        console.error("Error creating booking: ", error);
    }
}

// Check for double booking
async function checkDoubleBooking(barberId, startTime, endTime) {
    const bookingsRef = collection(db, "bookings");
    const q = query(bookingsRef, where("barberId", "==", barberId), where("startTime", "<=", endTime), where("endTime", ">=", startTime));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
}

// Update booking
async function updateBooking(bookingId, updatedData) {
    const bookingDocRef = doc(db, "bookings", bookingId);
    try {
        await updateDoc(bookingDocRef, updatedData);
        console.log("Booking updated successfully");
    } catch (error) {
        console.error("Error updating booking: ", error);
    }
}

// Delete booking
async function deleteBooking(bookingId) {
    const bookingDocRef = doc(db, "bookings", bookingId);
    try {
        await deleteDoc(bookingDocRef);
        console.log("Booking deleted successfully");
    } catch (error) {
        console.error("Error deleting booking: ", error);
    }
}

export { createBooking, checkDoubleBooking, updateBooking, deleteBooking };

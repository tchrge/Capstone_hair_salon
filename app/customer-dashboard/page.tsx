// pages/customer-dashboard.tsx
'use client'
import React, { useState, useEffect } from 'react';
import styles from './CustomerDashboard.module.css';
import { Button } from "@/components/ui/button";
import BarberServiceModal from './BarberServiceModal';
import { db } from '../../lib/firebase'; // Adjust the path as necessary
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';
import Slider from "react-slick"; // Import Slider from react-slick

const CustomerDashboard = () => {

  type Booking = {
    id: string;
    services: { name: string }[];
    barber: string;
    appointmentTime: Timestamp;
    start: Timestamp;
  };

  const [appointments, setAppointments] = useState<Booking[]>([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'appointments'));
        const fetchedAppointments: Booking[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Booking[];
        setAppointments(fetchedAppointments);
      } catch (error) {
        console.error("Error fetching appointments: ", error);
      }
    };

    fetchAppointments();
  }, []);

  const currentTime = new Date(); // Use the current time as is
  const upcomingBookings = appointments.filter(booking => {
    const startTime = booking.start.toDate(); // Use the start time directly
    console.log("Start Time:", startTime);
    console.log("Current Time:", currentTime);
    return startTime > currentTime; // Compare directly
  });
  const pastBookings = appointments.filter(booking => {
    const startTime = booking.start.toDate(); // Use the start time directly
    return startTime <= currentTime; // Compare directly
  });

  const BookingCard = ({ booking }: { booking: Booking }) => {
    // Extract the names from the services object
    const serviceValues = Object.values(booking.services)
      .flat() // Flatten the array of objects
      .map(service => service.name) // Map to get the 'name' property
      .join(', '); // Join the names into a string
    return (
      <div className={styles.bookingCard}>
        <h3><strong>Services Availed:</strong> {serviceValues}</h3> {/* Render the names as a comma-separated string */}
        <p><strong>Barber:</strong> {booking.barber}</p>
        <p><strong>Date:</strong> {booking.start.toDate().toString()}</p>
      </div>
    );
  };

  const handleLogout = () => {
    // Logic for logging out the user
    console.log("User logged out");
  };

  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const handleBookAppointment = () => {
    setIsModalOpen(true);
  };

  const handleConfirmAppointment = async (appointmentData: {
    barber: string;
    services: string[];
    appointmentTime: Date;
    start: Date; // Assuming you have these values
    end: Date;   // Assuming you have these values
    totalCost: number; // Assuming you have this value
  }) => {
    // Ensure that the required fields are present
    if (!appointmentData.barber || appointmentData.services.length === 0) {
      setErrorMessage("Please select a barber and at least one service.");
      return;
    }

    try {
      // Save appointment data to Firestore
      const docRef = await addDoc(collection(db, 'appointments'), appointmentData);
      console.log("Appointment confirmed with ID: ", docRef.id);

      // Reset the selected barber and services if needed
      setSelectedBarber(null);
      setSelectedServices([]);
      setIsModalOpen(false); // Close the modal after confirming
    } catch (error) {
      console.error("Error adding document: ", error);
      setErrorMessage("Failed to confirm appointment. Please try again.");
    }
  };

  const [visibleBookings, setVisibleBookings] = useState(2); // Start with 2 visible bookings

  const loadMoreBookings = () => {
    setVisibleBookings(prev => prev + 4); // Load 4 more bookings
  };

  const displayedUpcomingBookings = upcomingBookings.slice(0, visibleBookings);
  const displayedPastBookings = pastBookings.slice(0, visibleBookings);

  const [promotions, setPromotions] = useState<any[]>([]); // State to hold promotions data

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'promotions'));
        const fetchedPromotions = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPromotions(fetchedPromotions);
      } catch (error) {
        console.error("Error fetching promotions: ", error);
      }
    };

    fetchPromotions();
  }, []);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Customer Dashboard</h1>
        <Button onClick={handleLogout}>Log out</Button>
      </div>

      <p className="mb-6">Welcome back, Customer!</p>

      <div className="mb-6"> {/* Promotions Section */}
        <h2 className="text-xl font-bold mb-4">Promotions</h2>
        <Slider 
          dots={true} 
          infinite={true} 
          speed={500} 
          slidesToShow={3} 
          slidesToScroll={1} 
          autoplay={true}  
          autoplaySpeed={2000}  
        >
          {promotions.map(promotion => (
            <div key={promotion.id} className="border p-4 rounded-lg w-[250px] mx-4"> {/* Fixed width and margin */}
              <h3 className="font-semibold">{promotion.title}</h3>
              <p>{promotion.description}</p>
            </div>
          ))}
        </Slider>
      </div>

      <div className="flex justify-end mb-6"> {/* Flex container to align button to the right */}
        <Button onClick={handleBookAppointment}>Book Appointment</Button>
      </div>

      <div className={styles.section}>
        <h2 className="text-xl font-bold mb-4">Upcoming Bookings</h2>
        <div className="space-y-4">
          {displayedUpcomingBookings.map((booking) => (
            <div key={booking.id} className="border p-4 rounded-lg">
              <BookingCard booking={booking} />
            </div>
          ))}
        </div>
        {displayedUpcomingBookings.length < upcomingBookings.length && (
          <div className="flex justify-center mt-4">
            <Button onClick={loadMoreBookings}>Show More</Button>
          </div>
        )}
      </div>

      <div className={styles.section}>
      <h2 className="text-xl font-bold mb-4">Past Bookings</h2>
        <div className="space-y-4">
          {displayedPastBookings.map((booking) => (
            <div key={booking.id} className="border p-4 rounded-lg">
              <BookingCard booking={booking} />
            </div>
          ))}
        </div>
        {displayedPastBookings.length < pastBookings.length && (
          <div className="flex justify-center mt-4">
            <Button onClick={loadMoreBookings}>Show More</Button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className={styles.modal}> {/* Backdrop */}
          <div className={styles.modalContent}> {/* Modal content */}
            <BarberServiceModal
              onClose={() => setIsModalOpen(false)}
              onSelectBarber={setSelectedBarber}
              onSelectServices={setSelectedServices}
              onConfirmAppointment={handleConfirmAppointment}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;

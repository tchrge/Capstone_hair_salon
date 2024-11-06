// pages/customer-dashboard.tsx

import React from 'react';
import styles from './CustomerDashboard.module.css';

const CustomerDashboard = () => {

    type Booking = {
        id: string;
        service: string;
        barberName: string;
        date: string;
        time: string;
      };

  const pastBookings = [
    { id: '1', service: 'Haircut', barberName: 'John Doe', date: '2024-09-01', time: '2:00 PM' },
    { id: '2', service: 'Beard Trim', barberName: 'Jane Smith', date: '2024-08-25', time: '10:30 AM' },
  ];

  const upcomingBookings = [
    { id: '3', service: 'Shave', barberName: 'Paul Adams', date: '2024-10-20', time: '4:00 PM' },
    { id: '4', service: 'Haircut', barberName: 'Anna Johnson', date: '2024-11-02', time: '11:00 AM' },
  ];

  const BookingCard = ({ booking }: { booking: Booking }) => (
    <div className={styles.bookingCard}>
      <h3>{booking.service}</h3>
      <p><strong>Barber:</strong> {booking.barberName}</p>
      <p><strong>Date:</strong> {booking.date}</p>
      <p><strong>Time:</strong> {booking.time}</p>
    </div>
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Customer Dashboard</h1>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Upcoming Bookings</h2>
        <div className={styles.bookingList}>
          {upcomingBookings.length > 0 ? (
            upcomingBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))
          ) : (
            <p>No upcoming bookings.</p>
          )}
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Past Bookings</h2>
        <div className={styles.bookingList}>
          {pastBookings.length > 0 ? (
            pastBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))
          ) : (
            <p>No past bookings.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;

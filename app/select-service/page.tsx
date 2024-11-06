'use client'; // Add this line to mark the component as a Client Component

import React, { useState } from 'react';
import styles from './SelectServicePage.module.css';

const services = [
  { id: 1, name: 'Haircut', duration: '30 mins', price: '$20', image: '/images/haircut.jpg' },
  { id: 2, name: 'Beard Trim', duration: '15 mins', price: '$10', image: '/images/beard_trim.jpg' },
  { id: 3, name: 'Shave', duration: '20 mins', price: '$15', image: '/images/shave.jpg' },
  { id: 4, name: 'Hair Wash', duration: '10 mins', price: '$8', image: '/images/hair_wash.jpg' },
];

const SelectServicePage = () => {
  const [selectedService, setSelectedService] = useState<number | null>(null);

  const handleServiceSelect = (serviceId: number) => {
    setSelectedService(serviceId);
  };

  const handleConfirmBooking = () => {
    if (selectedService) {
      // Redirect to booking confirmation page or do something with the selected service
      alert(`You selected service ID: ${selectedService}`);
    } else {
      alert('Please select a service.');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Select Service</h1>
      <ul className={styles.serviceList}>
        {services.map((service) => (
          <li
            key={service.id}
            className={`${styles.serviceItem} ${
              selectedService === service.id ? styles.selected : ''
            }`}
            onClick={() => handleServiceSelect(service.id)}
          >
            <img src={service.image} alt={service.name} className={styles.serviceImage} />
            <h3>{service.name}</h3>
            <p>Duration: {service.duration}</p>
            <p>Price: {service.price}</p>
          </li>
        ))}
      </ul>
      <button className={styles.confirmButton} onClick={handleConfirmBooking}>
        Confirm Booking
      </button>
    </div>
  );
};

export default SelectServicePage;

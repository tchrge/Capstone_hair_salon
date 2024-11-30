# Barber CRM Solution

## Problem Statement

Barbers in Canada often rely on third-party applications like **Fresha** and **Calendly** to manage appointments. While these tools are practical, their high subscription costs challenge small businesses and independent barbers.  

This project addresses the need for a cost-effective, tailored solution specifically designed to meet the unique requirements of barbers and salon owners.

---

## Project Overview

A **Customer Relationship Management (CRM) platform** designed explicitly for the salon industry. This application provides a seamless experience for both barbers and customers by integrating key functionalities such as appointment management, promotion handling, and social media integration.

### Key Features

- **Customer Login:** Secure login via Google authentication.  
- **Appointment Booking:** User-friendly interface for booking and managing appointments.  
- **Barber Registration:** Simple registration process for barbers.  
- **Promotion Management:** Tools for creating and scheduling promotions.  
- **Social Media Integration:** Direct promotion posting to social media platforms.  

---

## System Architecture and Features

### 1. **Frontend (Next.js)**  
**Overview:**  
The user interface, built with **Next.js**, provides a responsive and intuitive experience for browsing services, booking appointments, and accessing information.  

**Features:**  
- **Authentication:** Enables login via Google and Facebook.  
- **Service Booking:** Simplifies service selection, booking, and confirmation.  
- **Dynamic Data Display:** Ensures real-time updates for services, bookings, and user information.  

---

### 2. **Backend (Node.js with Firestore)**  
**Overview:**  
The backend, built with **Node.js**, bridges the frontend  and the database, handling requests, applying business logic, and ensuring data integrity.  

**Features:**  
- **API Endpoints:** Offers routes such as `/login`, `/book`, and `/services`.  
- **Business Logic:** Manages appointment scheduling, slot availability checks, and request processing.  
- **Response Handling:** Processes requests and provides appropriate success or failure responses.  

---

### 3. **Authentication**  
**Overview:**  
Ensures secure user access and protects sensitive data.  

**Features:**  
- **User Verification:** Validates credentials during login.  
- **Third-Party Login:** Supports Google and Facebook for seamless authentication.  

---

### 4. **Appointment Management**  
**Overview:**  
Handles all operations related to appointment booking, rescheduling, and cancellations.  

**Features:**  
- **Booking System:** Facilitates appointment creation, updates, and cancellations.  
- **Availability Check:** Prevents double bookings by verifying service availability.  

---

### 5. **Service Management**  
**Overview:**  
Manages the catalog of services offered, allowing for efficient updates and modifications.  

**Features:**  
- **Service Listings:** Displays detailed descriptions, prices, and service availability.  
- **Admin Controls:** Enables service addition, modification, or removal.  

---

### 6. **Firewall**  
**Overview:**  
Provides a robust security layer to protect the application from unauthorized access and cyber threats.  

**Features:**  
- **Traffic Monitoring:** Filters network traffic based on security rules.  
- **Threat Prevention:** Detects and blocks suspicious activities to safeguard data.  

---

### 7. **Database (Firestore)**  
**Overview:**  
A centralized repository for securely storing and managing application data.  

**Features:**  
- **Data Storage:** Stores user credentials, booking records, and service details.  
- **Data Retrieval:** Ensures fast and reliable data access for user actions.  

---

## Getting Started

### Prerequisites
- **Node.js** (v16 or later)  
- **Firestore** (Google Cloud)  
- **Next.js** (v13 or later)

## Running Locally

### Steps to Run the Application
1. Clone the repository:
   ```bash
   git clone https://github.com/tchrge/Capstone_hair_salon.git

cd barber-crm

npm install

npm run dev

npm run build
npm start

http://localhost:3000


## Firebase Configuration

To configure Firebase for your project, follow these steps:

### 1. Set Up Firebase Project
- Visit the [Firebase Console](https://console.firebase.google.com/).
- Click on "Add Project" and follow the prompts to create a new project.

### 2. Install Firebase SDK
In  project directory, run the following command to install Firebase:

```bash
npm install firebase







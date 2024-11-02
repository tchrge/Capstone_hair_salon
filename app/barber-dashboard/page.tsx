'use client'

import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { db } from "@/lib/firebase"
import { collection, addDoc, getDocs, deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore"
import { storage } from "@/lib/firebase"; 
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; 

const mockAppointments = [
  { id: 1, customerName: "John Doe", date: "2023-05-15", time: "10:00 AM" },
  { id: 2, customerName: "Jane Smith", date: "2023-05-15", time: "2:00 PM" },
  { id: 3, customerName: "Bob Johnson", date: "2023-05-16", time: "11:30 AM" },
]

// Define the type for selectedAppointment
type Appointment = { id: string; customerEmail: string };

export default function BarberDashboardPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [offerTitle, setOfferTitle] = useState('')
  const [offerDescription, setOfferDescription] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [appointments, setAppointments] = useState<{ id: string; customerName: string; date: string; time: string; customerEmail: string; }[]>([]);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "appointments"));
        const appointmentsData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          const dateObject = new Date(data.datetime.seconds * 1000);
          const date = dateObject.toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' });
          const time = dateObject.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false });
          return { id: doc.id, customerName: data.customerName, date, time, customerEmail: data.customerEmail };
        });
        setAppointments(appointmentsData);
      } catch (error) {
        console.error("Error fetching appointments: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/')
    } catch (error) {
      console.error('Failed to log out', error)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleOfferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    try {
      if (!user) throw new Error("User not authenticated");
      if (!selectedFile) throw new Error("No file selected");

      const docRef = await addDoc(collection(db, "promotions"), {
        title: offerTitle,
        description: offerDescription,
        createdAt: new Date(),
        barberId: user.email,
      });

      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('caption', `${offerTitle}\n${offerDescription}`);

      const response = await fetch(`https://graph.instagram.com/me/media?access_token=YOUR_ACCESS_TOKEN`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to create Instagram post');

      const data = await response.json();
      console.log("Instagram post created with ID: ", data.id);
      setOfferTitle('');
      setOfferDescription('');
      setSelectedFile(null);
    } catch (error: any) {
      setErrorMessage(error.message);
      console.error("Error creating Instagram post: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId: string, userEmail: string) => {
    const appointmentDoc = await getDoc(doc(db, "appointments", appointmentId));
    const appointmentData = appointmentDoc.data();

    if (!appointmentData) {
      console.error("Appointment data not found");
      return;
    }

    const appointmentTime = new Date(appointmentData.date + ' ' + appointmentData.time);
    const now = new Date();
    const threeHoursBefore = new Date(appointmentTime.getTime() - 3 * 60 * 60 * 1000);

    if (now > threeHoursBefore) {
      alert("You can only cancel appointments 3 hours before the scheduled time.");
      return;
    }

    try {
      await deleteDoc(doc(db, "appointments", appointmentId));
      await notifyUser(userEmail, appointmentData);
      console.log("Appointment canceled and user notified.");
    } catch (error) {
      console.error("Error canceling appointment: ", error);
    }
  };

  const notifyUser = async (userEmail: string, appointmentData: any) => {
    console.log(`Notifying ${userEmail} about the cancellation of appointment: ${appointmentData.title}`);
  };

  const handleReschedule = async (appointmentId: string) => {
    setLoading(true);
    setErrorMessage('');
    try {
      await updateDoc(doc(db, "appointments", appointmentId), {
        date: newDate,
        time: newTime,
      });
      console.log("Appointment rescheduled successfully.");
      setIsRescheduleModalOpen(false);
    } catch (error: any) {
      setErrorMessage("Error rescheduling appointment: " + error.message);
      console.error("Error rescheduling appointment: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Barber Dashboard</h1>
        <Button onClick={handleLogout}>Log out</Button>
      </div>

      <p className="mb-6">
        Welcome back, {user ? user.email : 'Guest'}!
      </p>

      {loading && <p>Loading appointments...</p>}
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
        <div className="space-y-4">
          {appointments.map(appointment => (
            <div key={appointment.id} className="border p-4 rounded-lg">
              <p><strong>{appointment.customerName}</strong></p>
              <p>{appointment.date} {appointment.time}</p>
              <Button onClick={() => handleCancelAppointment(appointment.id, appointment.customerEmail)}>Cancel Appointment</Button>
              <Button onClick={() => { setSelectedAppointment({ id: appointment.id, customerEmail: appointment.customerEmail }); setIsRescheduleModalOpen(true); }}>
                Reschedule Appointment
              </Button>
            </div>
          ))}
        </div>
      </section>

      {isRescheduleModalOpen && (
        <div className="modal">
          <div className="modal-overlay" onClick={() => setIsRescheduleModalOpen(false)}></div>
          <div className="modal-content">
            <h2>Reschedule Appointment</h2>
            <label>
              New Date:
              <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} required />
            </label>
            <label>
              New Time:
              <input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} required />
            </label>
            <Button onClick={() => handleReschedule(selectedAppointment?.id!)}>Confirm Reschedule</Button>
            <Button onClick={() => setIsRescheduleModalOpen(false)}>Cancel</Button>
          </div>
        </div>
      )}

      <section>
        <h2 className="text-xl font-semibold mb-4">Create New Offer</h2>
        <form onSubmit={handleOfferSubmit} className="space-y-4">
          <div>
            <label htmlFor="offerTitle" className="block mb-2">Offer Title</label>
            <Input
              id="offerTitle"
              value={offerTitle}
              onChange={(e) => setOfferTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="offerDescription" className="block mb-2">Offer Description</label>
            <Textarea
              id="offerDescription"
              value={offerDescription}
              onChange={(e) => setOfferDescription(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="photoUpload" className="block mb-2">Upload Photo</label>
            <div className="relative">
              <input
                type="file"
                id="photoUpload"
                accept="image/*"
                onChange={handleFileChange}
                required
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <Button className="border border-gray-300 rounded-md p-2 hover:border-blue-500 transition duration-200 w-full text-left">
                Choose File
              </Button>
              <p className="text-gray-500 text-sm mt-1">Choose an image file (JPG, PNG, etc.)</p>
            </div>
            <div className="border border-gray-300 rounded-md p-2 mt-2">
              <p className="text-gray-700">Selected File: {selectedFile ? selectedFile.name : 'No file chosen'}</p>
              {selectedFile && (
                <div className="mt-4">
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt="Preview"
                    className="border border-gray-300 rounded-md mt-2 max-w-full h-auto"
                  />
                </div>
              )}
            </div>
          </div>
          <Button type="submit" disabled={loading}>Submit Offer</Button>
        </form>
      </section>
    </div>
  )
}
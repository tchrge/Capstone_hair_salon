'use client';

import React from 'react';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../lib/firebase';
import { useRouter } from 'next/navigation';
import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { collection, getDocs, Timestamp, query, where, orderBy } from 'firebase/firestore';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/Badge";
import { Calendar, Clock, DollarSign, LogOut, Loader2, X } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import BarberServiceModal from './BarberServiceModal'; // Adjust the path as necessary
import { Promotion } from '@/types/Promotion';
import { BookingData } from '@/types/BookingData';
import { Appointment } from '@/types/appoitnment';


// Constants
const APPOINTMENTS_PER_PAGE = 2;
const queryClient = new QueryClient();

// Components
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <Loader2 className="w-8 h-8 animate-spin text-primary" />
  </div>
);

const AppointmentCard = ({ appointment }: { appointment: Appointment }) => {
  console.log(appointment);
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-500" />
              <span>{appointment.start.toDate().toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-500" />
              <span>{appointment.start.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
          <Badge
            variant={appointment.status === 'active' ? 'default' : 'destructive'}
            className="capitalize"
          >
            {appointment.status}
          </Badge>
        </div>
        <p className="font-medium">Barber: {appointment.barber}</p>
        <div className="mt-2">
          <p className="text-sm text-gray-600">Services:</p>
          <ul className="list-disc list-inside">
            {Array.isArray(appointment.services) ? (
              appointment.services.map((service, index) => (
                <li key={index} className="text-sm">
                  {service.name}
                </li>
              ))
            ) : (
              <li className="text-sm text-gray-500">No services available</li>
            )}
          </ul>
        </div>
        <div className="mt-4 pt-4 border-t">
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline"
          >
            View Appointment Details
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

const PromotionCarousel = ({ promotions }: { promotions: Promotion[] }) => (
  <section className="mb-12">
    <h2 className="text-xl font-semibold mb-6">Current Promotions</h2>
    <Carousel className="w-full">
      <CarouselContent>
        {promotions.map(promotion => (
          <CarouselItem key={promotion.id} className="md:basis-1/2 lg:basis-1/3">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col h-full">
                  {promotion.imageUrl && (
                    <div className="relative w-full h-40 mb-4 overflow-hidden rounded-lg">
                      <img
                        src={promotion.imageUrl}
                        alt={promotion.title}
                        className="object-cover w-full h-full transition-transform hover:scale-105"
                      />
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{promotion.title}</h3>
                    <p className="text-gray-600 mb-4">{promotion.description}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {promotion.discount}% OFF
                      </Badge>
                      <span className="text-sm text-gray-500">
                        Valid until {promotion.validUntil.toDate().toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  </section>
);

function CustomerDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [upcomingPage, setUpcomingPage] = React.useState(1);
  const [pastPage, setPastPage] = React.useState(1);
  const [isBarberServiceModalOpen, setIsBarberServiceModalOpen] = React.useState(false);

  const { data: appointments = [], isLoading: appointmentsLoading } = useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      const appointmentsQuery = query(
        collection(db, 'appointments'),
        orderBy('start', 'desc')
      );
      const snapshot = await getDocs(appointmentsQuery);
      return snapshot.docs.map(doc => ({
        ...doc.data()
      })) as Appointment[];
    }
  });

  const { data: promotions = [], isLoading: promotionsLoading } = useQuery({
    queryKey: ['promotions'],
    queryFn: async () => {
      const now = Timestamp.fromDate(new Date());
      const promotionsQuery = query(
        collection(db, 'promotions'),
        where('validUntil', '>', now),
        orderBy('validUntil')
      );
      const snapshot = await getDocs(promotionsQuery);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Promotion[];
    }
  });

  const now = new Date();
  const upcomingAppointments = React.useMemo(() =>
    appointments
      .filter(app => app.start.toDate() > now && app.status === 'active')
      .sort((a, b) => a.start.toDate().getTime() - b.start.toDate().getTime()),
    [appointments, now]
  );

  const pastAppointments = React.useMemo(() =>
    appointments
      .filter(app => app.start.toDate() <= now || app.status === 'canceled')
      .sort((a, b) => b.start.toDate().getTime() - a.start.toDate().getTime()),
    [appointments, now]
  );

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
      toast({
        title: "Logged out successfully",
        duration: 3000,
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Error logging out",
        description: "Please try again",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const onBookAppointment = async (bookingData: Appointment) => {
    // API call to create an appointment in your system
    try {
      // Your logic to save the booking data
      toast({
        title: "Appointment booked successfully",
        description: `Your appointment with ${bookingData.barber} is confirmed`,
      });
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast({
        title: "Error booking appointment",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  if (appointmentsLoading || promotionsLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Customer Dashboard</h1>
        <div className="flex gap-4">
          <Button onClick={() => setIsBarberServiceModalOpen(true)}>Book Appointment</Button>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>

      {promotions.length > 0 && (
        <PromotionCarousel promotions={promotions} />
      )}

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-6">Upcoming Appointments</h2>
        {upcomingAppointments.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingAppointments
                .slice(0, upcomingPage * APPOINTMENTS_PER_PAGE)
                .map(appointment => (
                  <AppointmentCard key={String(appointment.id)} appointment={appointment} />
                ))}
            </div>
            {upcomingAppointments.length > upcomingPage * APPOINTMENTS_PER_PAGE && (
              <div className="mt-6 text-center">
                <Button
                  variant="outline"
                  onClick={() => setUpcomingPage(p => p + 1)}
                >
                  Show More
                </Button>
              </div>
            )}
          </>
        ) : (
          <Card>
            <CardContent className="p-6 text-center text-gray-500">
              No upcoming appointments. Book your next appointment now!
            </CardContent>
          </Card>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-6">Past Appointments</h2>
        {pastAppointments.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pastAppointments
                .slice(0, pastPage * APPOINTMENTS_PER_PAGE)
                .map(appointment => (
                  <AppointmentCard key={String(appointment.id)} appointment={appointment} />
                ))}
            </div>
            {pastAppointments.length > pastPage * APPOINTMENTS_PER_PAGE && (
              <div className="mt-6 text-center">
                <Button
                  variant="outline"
                  onClick={() => setPastPage(p => p + 1)}
                >
                  Show More
                </Button>
              </div>
            )}
          </>
        ) : (
          <Card>
            <CardContent className="p-6 text-center text-gray-500">
              No past appointments found.
            </CardContent>
          </Card>
        )}
      </section>

      <BarberServiceModal
        isOpen={isBarberServiceModalOpen}
        onClose={() => setIsBarberServiceModalOpen(false)}
        onBookAppointment={async (bookingData: Appointment) => {
          await onBookAppointment(bookingData);
        }}
      />
    </div>
  );
}

export default function CustomerDashboardWrapper() {
  return (
    <QueryClientProvider client={queryClient}>
      <CustomerDashboard />
    </QueryClientProvider>
  );
}
'use client';

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Carousel, CarouselContent, CarouselNext, CarouselPrevious, CarouselItem } from "@/components/ui/carousel";
import { db, auth } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, where, Timestamp, orderBy } from "firebase/firestore";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/Badge";
import { DollarSign, ExternalLink, Calendar, Clock } from "lucide-react";
import axios from 'axios';
import { signOut } from "firebase/auth";
import { toast } from "@/hooks/use-toast";
import { Appointment } from "@/types/appoitnment"

interface NewPromotion {
  title: string;
  description: string;
  discount: number;
  validUntil: Date;
  file: File | null;
  instagramCaption?: string;
}

const AppointmentsView = ({ appointments }: { appointments: Appointment[] }) => {
  const upcomingAppointments = appointments.filter(apt => apt.status === 'scheduled')
    .sort((a, b) => a.start.toMillis() - b.end.toMillis());

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Upcoming Appointments</h3>
        <Badge variant="outline" className="font-normal">
          {upcomingAppointments.length} appointments
        </Badge>
      </div>
      
      {upcomingAppointments.length > 0 ? (
        <div className="space-y-3">
          {upcomingAppointments.map((appointment) => (
            <Card key={String(appointment.id)}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{appointment.barber}</h4>
                    <p className="text-sm text-gray-500">
                      {appointment.services.map(service => (
                        <span key={service.id}>{service.name} ({service.duration} min, ${service.cost})</span>
                      ))}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">
                        {appointment.start.toDate().toLocaleDateString()}
                      </span>
                      <Clock className="w-4 h-4 text-gray-500 ml-2" />
                      <span className="text-sm">
                        {formatTime(appointment.start.toDate())} ({appointment.services.reduce((total, service) => total + service.duration, 0)} min)
                      </span>
                    </div>
                  </div>
                  <Badge 
                    variant={
                      appointment.status === 'Scheduled' ? 'default' :
                      appointment.status === 'completed' ? 'secondary' : 'destructive'
                    }
                  >
                    {appointment.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-6 text-center text-gray-500">
            No upcoming appointments
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Component for the new promotion form
const NewPromotionForm = ({
  promotion,
  setPromotion,
  onSubmit,
  loading
}: {
  promotion: NewPromotion;
  setPromotion: (promotion: NewPromotion) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  loading: boolean;
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPromotion({ ...promotion, file: e.target.files[0] });
    }
  };
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label htmlFor="promotionTitle" className="block text-sm font-medium mb-2">
          Promotion Title
        </label>
        <Input
          id="promotionTitle"
          value={promotion.title}
          onChange={(e) => setPromotion({ ...promotion, title: e.target.value })}
          required
          placeholder="e.g. Summer Special Haircut"
        />
      </div>

      <div>
        <label htmlFor="promotionDescription" className="block text-sm font-medium mb-2">
          Promotion Description
        </label>
        <Textarea
          id="promotionDescription"
          value={promotion.description}
          onChange={(e) => setPromotion({ ...promotion, description: e.target.value })}
          required
          placeholder="Describe your special offer..."
          className="h-32"
        />
      </div>

      <div>
        <label htmlFor="discount" className="block text-sm font-medium mb-2">
          Discount Percentage
        </label>
        <Input
          id="discount"
          type="number"
          min="0"
          max="100"
          value={promotion.discount}
          onChange={(e) => setPromotion({ ...promotion, discount: Number(e.target.value) })}
          required
          placeholder="Enter discount percentage"
        />
      </div>

      <div>
        <label htmlFor="validUntil" className="block text-sm font-medium mb-2">
          Valid Until
        </label>
        <Input
          id="validUntil"
          type="date"
          value={promotion.validUntil.toISOString().split('T')[0]}
          onChange={(e) => setPromotion({ ...promotion, validUntil: new Date(e.target.value) })}
          required
          min={new Date().toISOString().split('T')[0]}
        />
      </div>

      <div>
        <label htmlFor="instagramCaption" className="block text-sm font-medium mb-2">
          Instagram Caption
        </label>
        <Textarea
          id="instagramCaption"
          value={promotion.instagramCaption || ''}
          onChange={(e) => setPromotion({ ...promotion, instagramCaption: e.target.value })}
          placeholder="Write an engaging Instagram caption..."
          className="h-32"
        />
      </div>

      <div>
        <label htmlFor="photoUpload" className="block text-sm font-medium mb-2">
          Upload Photo
        </label>
        <div className="relative">
          <input
            type="file"
            id="photoUpload"
            accept="image/*"
            onChange={handleFileChange}
            required
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <Button type="button" variant="outline" className="w-full justify-start">
            {promotion.file ? promotion.file.name : 'Choose an image file'}
          </Button>
        </div>
        {promotion.file && (
          <img
            src={URL.createObjectURL(promotion.file)}
            alt="Preview"
            className="mt-4 rounded-lg max-h-48 object-cover"
          />
        )}
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Publishing...' : 'Publish Promotion'}
      </Button>
    </form>
  );
};

const PromotionsCarousel = ({ promotions }: { promotions: any[] }) => {
  const activePromotions = promotions.filter(
    promo => promo.validUntil.toDate() > new Date()
  );
  const pastPromotions = promotions.filter(
    promo => promo.validUntil.toDate() <= new Date()
  );

  return (
    <div className="space-y-6">
      {/* Active Promotions */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Active Promotions</h3>
        <Carousel className="w-full">
          <CarouselContent>
            {activePromotions.length > 0 ? (
              activePromotions.map((promotion) => (
                <CarouselItem key={promotion.id} className="md:basis-1/2 lg:basis-1/3">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col h-full">
                        {promotion.imageUrl && (
                          <div className="relative w-full h-40 mb-4">
                            <img
                              src={promotion.imageUrl}
                              alt={promotion.title}
                              className="rounded-lg object-cover w-full h-full"
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
              ))
            ) : (
              <CarouselItem>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-gray-500">No active promotions</p>
                  </CardContent>
                </Card>
              </CarouselItem>
            )}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>

      {/* Past Promotions */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Past Promotions</h3>
        <Carousel className="w-full">
          <CarouselContent>
            {pastPromotions.length > 0 ? (
              pastPromotions.map((promotion) => (
                <CarouselItem key={promotion.id} className="md:basis-1/2 lg:basis-1/3">
                  <Card className="opacity-75">
                    <CardContent className="p-6">
                      <div className="flex flex-col h-full">
                        {promotion.imageUrl && (
                          <div className="relative w-full h-40 mb-4">
                            <img
                              src={promotion.imageUrl}
                              alt={promotion.title}
                              className="rounded-lg object-cover w-full h-full grayscale"
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
                              Ended {promotion.validUntil.toDate().toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))
            ) : (
              <CarouselItem>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-gray-500">No past promotions</p>
                  </CardContent>
                </Card>
              </CarouselItem>
            )}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
};

export default function BarberDashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [promotions, setPromotions] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [promotion, setPromotion] = useState<NewPromotion>({
    title: '',
    description: '',
    discount: 0,
    validUntil: new Date(),
    file: null,
    instagramCaption: ''
  });

  useEffect(() => {
    if (user?.email) {
      fetchPromotions();
      fetchAppointments();
    }
  }, [user]);

  const fetchAppointments = async () => {
    try {
      const appointmentsQuery = query(
        collection(db, "appointments"),
        where("barberId", "==", user?.uid),
        where("status", "==", "scheduled"),
        orderBy("start", "asc")
      );
      const querySnapshot = await getDocs(appointmentsQuery);
      
      const appointmentsData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          barber: data.barber,
          barberId: data.barberId, 
          createdAt: data.createdAt,
          end: data.end,
          services: data.services,
          start: data.start,
          status: data.status,
          totalCost: data.totalCost,
          duration: data.duration
        } as Appointment;
       });
      setAppointments(appointmentsData);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setError("Failed to load appointments");
    }
  };

  const fetchPromotions = async () => {
    try {
      const promotionsQuery = query(
        collection(db, "promotions"),
        where("barberId", "==", user?.email)
      );
      const querySnapshot = await getDocs(promotionsQuery);
      const promotionsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPromotions(promotionsData);
    } catch (error) {
      console.error("Error fetching promotions:", error);
      setError("Failed to load promotions");
    }
  };

  const handlePromotionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!promotion.file) throw new Error("No file selected");

      // Upload image to Imgur
      const formData = new FormData();
      formData.append('image', promotion.file);

      const response = await axios.post('https://api.imgur.com/3/image', formData, {
        headers: {
          'Authorization': `Client-ID ${process.env.NEXT_PUBLIC_IMGUR_CLIENT_ID}`
        }
      });

      if (!response.data.success) throw new Error('Failed to upload image');

      // Save promotion to Firestore
      await addDoc(collection(db, "promotions"), {
        title: promotion.title,
        description: promotion.description,
        discount: promotion.discount,
        validUntil: Timestamp.fromDate(promotion.validUntil),
        imageUrl: response.data.data.link,
        createdAt: Timestamp.now(),
        barberId: user?.email
      });

      // Post to Instagram if caption is provided
      if (promotion.instagramCaption) {
        await axios.post('/api/post-to-instagram', {
          imageUrl: response.data.data.link,
          caption: promotion.instagramCaption
        });
      }

      // Refresh promotions list
      await fetchPromotions();

      // Reset form
      setPromotion({
        title: '',
        description: '',
        discount: 0,
        validUntil: new Date(),
        file: null,
        instagramCaption: ''
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create promotion');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/'); // Redirect to the homepage after logout
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

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Barber Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.email}</p>
        </div>
        <Button onClick={handleLogout}>
          Log out
        </Button>
      </header>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-8 md:grid-cols-2">
        <section>
          <h2 className="text-xl font-semibold mb-6">Your Schedule</h2>
          <Card>
            <CardContent className="p-6">
              <AppointmentsView appointments={appointments} />
            </CardContent>
          </Card>
        </section>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-6">Promotions Overview</h2>
            <PromotionsCarousel promotions={promotions} />
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Create New Promotion</h2>
            <Card>
              <CardContent className="p-6">
                <NewPromotionForm
                  promotion={promotion}
                  setPromotion={setPromotion}
                  onSubmit={handlePromotionSubmit}
                  loading={loading}
                />
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
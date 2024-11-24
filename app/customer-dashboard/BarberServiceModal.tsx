'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Scissors, User, Clock, DollarSign } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, Timestamp, DocumentData, addDoc } from "firebase/firestore";
import { toast } from "@/hooks/use-toast";
import { Appointment } from '@/types/appoitnment';
import { Barber } from '@/types/Barber';
import { BookingModalProps } from '@/types/BookingModalProps';
import { Service } from '@/types/service';
import { BookingData } from '@/types/BookingData';

function BarberServiceModal({ isOpen, onClose, onBookAppointment }: BookingModalProps) {
    const [step, setStep] = useState(1);
    const [barbers, setBarbers] = useState<Barber[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
    const [selectedServices, setSelectedServices] = useState<Service[]>([]);
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [existingAppointments, setExistingAppointments] = useState<AppointmentSlot[]>([]);

    // Calculate totals using useMemo
    const { totalCost, totalDuration } = useMemo(() => {
        return {
            totalCost: selectedServices.reduce((sum, service) => sum + service.cost, 0),
            totalDuration: selectedServices.reduce((sum, service) => sum + service.duration, 0)
        };
    }, [selectedServices]);

    // Reset state when modal is closed
    useEffect(() => {
        if (!isOpen) {
            setStep(1);
            setSelectedBarber(null);
            setSelectedServices([]);
            setDate(undefined);
            setSelectedTime(null);
        }
    }, [isOpen]);

    // Fetch barbers when component mounts
    useEffect(() => {
        if (isOpen) {
            fetchBarbers();
        }
    }, [isOpen]);

    // Fetch appointments when barber and date are selected
    useEffect(() => {
        if (selectedBarber && date) {
            fetchBarberAppointments(selectedBarber.id, date);
        }
    }, [selectedBarber, date]);

    const convertFirestoreTimestamp = (timestamp: DocumentData) => {
        if (timestamp && timestamp.seconds) {
            return new Date(timestamp.seconds * 1000);
        }
        return new Date();
    };

    const handleServiceToggle = (service: Service) => {
        setSelectedServices(prev => {
            const isSelected = prev.find(s => s.id === service.id);
            if (isSelected) {
                return prev.filter(s => s.id !== service.id);
            }
            return [...prev, service];
        });
    };

    const fetchBarbers = async () => {
        try {
            const barbersSnapshot = await getDocs(collection(db, "barbers"));
            const barbersData = barbersSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Barber[];
            setBarbers(barbersData);
        } catch (error) {
            console.error('Error fetching barbers:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchBarberAppointments = async (barberId: string, date: Date) => {
        try {
            const appointmentsSnapshot = await getDocs(query(collection(db, "appointments"), where("barberId", "==", barberId), where("date", "==", date)));
                const appointmentsData = appointmentsSnapshot.docs.map(doc => {
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

            // Map appointmentsData to AppointmentSlot[]
            const appointmentSlots = appointmentsData.map(appointment => ({
                start: convertFirestoreTimestamp(appointment.start), // Convert to Date
                end: new Date(convertFirestoreTimestamp(appointment.end).getTime() + appointment.duration * 60000) // Calculate end time
            }));

            setExistingAppointments(appointmentSlots);
        } catch (error) {
            console.error('Error fetching barber appointments:', error);
        }
    };

    const isTimeSlotAvailable = (timeSlot: string, duration: number): boolean => {
        if (!date) return false;

        // Parse the time slot
        const [hours, minutes] = timeSlot.match(/(\d+):(\d+)/)?.slice(1) || [];
        const isPM = timeSlot.includes('PM');
        let hour = parseInt(hours);
        if (isPM && hour !== 12) hour += 12;
        if (!isPM && hour === 12) hour = 0;

        // Create start and end times for the proposed appointment
        const startTime = new Date(date);
        startTime.setHours(hour, parseInt(minutes), 0, 0);
        const endTime = new Date(startTime.getTime() + duration * 60000);

        // Check if the proposed time slot overlaps with any existing appointment
        const hasOverlap = existingAppointments.some(appointment => {
            return !(endTime <= appointment.start || startTime >= appointment.end);
        });

        // Also check if the appointment falls within business hours
        const isWithinBusinessHours = hour >= 9 && (hour < 17 || (hour === 16 && parseInt(minutes) <= 30));

        return !hasOverlap && isWithinBusinessHours;
    };

    const getAvailableTimeSlots = () => {
        const timeSlots = [
            '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM',
            '11:30 AM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
            '3:00 PM', '3:30 PM', '4:00 PM'
        ];

        if (!date || !selectedBarber || totalDuration <= 0) return [];

        return timeSlots.filter(time => isTimeSlotAvailable(time, totalDuration));
    };

    const handleSubmit = async () => {
        if (!selectedBarber || !date || !selectedTime || selectedServices.length === 0) {
            return;
        }

        // Double-check availability before submitting
        if (!isTimeSlotAvailable(selectedTime, totalDuration)) {
            toast({
                title: "Time slot no longer available",
                description: "Please select a different time slot",
                variant: "destructive",
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const [hours, minutes] = selectedTime.match(/(\d+):(\d+)/)?.slice(1) || [];
            const isPM = selectedTime.includes('PM');
            let hour = parseInt(hours);
            if (isPM && hour !== 12) hour += 12;
            if (!isPM && hour === 12) hour = 0;

            const startTime = new Date(date);
            startTime.setHours(hour, parseInt(minutes), 0, 0);

            const bookingData: Appointment = {
                id: '',
                barber: selectedBarber.name,
                barberId: selectedBarber.id,
                createdAt: Timestamp.fromDate(new Date()),
                end: Timestamp.fromDate(new Date(date)),
                services: selectedServices,
                start: Timestamp.fromDate(startTime),
                status: 'Scheduled',
                totalCost,
                duration: totalDuration
            };

            await onBookAppointment(bookingData);
            toast({
                title: "Appointment booked successfully",
                description: `Your appointment with ${selectedBarber.name} is confirmed`,
            });
            onClose();
        } catch (error) {
            console.error('Error booking appointment:', error);
            toast({
                title: "Error booking appointment",
                description: "Please try again",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const getDisabledDates = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return {
            before: today,
        };
    };

    const availableTimeSlots = getAvailableTimeSlots();

    const handleNext = () => {
        setStep(prev => prev + 1);
    };

    const handleBack = () => {
        setStep(prev => prev - 1);
    };

    const renderServicesStep = () => (
        <div className="space-y-4">
            <h3 className="font-medium mb-4">Select Services</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedBarber?.services.map((service) => (
                    <Card
                        key={service.id}
                        className={`cursor-pointer transition-colors ${selectedServices.find(s => s.id === service.id)
                            ? 'border-primary'
                            : ''
                            }`}
                        onClick={() => handleServiceToggle(service)}
                    >
                        <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <Scissors className="w-4 h-4" />
                                    <p className="font-medium">{service.name}</p>
                                </div>
                                <DollarSign className="w-4 h-4" />
                            </div>
                            <div className="flex justify-between text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    <span>{service.duration} mins</span>
                                </div>
                                <span>${service.cost}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );

    // Update the calendar step to use dynamic time slots
    const renderDateTimeStep = () => (
        <div className="space-y-4">
            <h3 className="font-medium mb-4">Select Date & Time</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                    disabled={getDisabledDates()}
                />
                {date && (
                    <div className="space-y-2">
                        <h4 className="font-medium">Available Times</h4>
                        <div className="grid grid-cols-3 gap-2">
                            {availableTimeSlots.map((time) => (
                                <Button
                                    key={time}
                                    variant={selectedTime === time ? "default" : "outline"}
                                    className="w-full"
                                    onClick={() => setSelectedTime(time)}
                                >
                                    {time}
                                </Button>
                            ))}
                        </div>
                        {availableTimeSlots.length === 0 && (
                            <p className="text-center text-gray-500">
                                No available time slots for this date
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );

    // Update the case statement in renderStep()
    const renderStep = () => {
        switch (step) {
            case 1:
                return renderBarberSelection();
            case 2:
                return renderServicesStep();
            case 3:
                return renderDateTimeStep();
            case 4:
                return renderSummary();
        }
    };

    const renderBarberSelection = () => ( // Removed async
        <div className="space-y-4">
            <h3 className="font-medium mb-4">Select Your Barber</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {barbers.map((barber) => (
                    <Card
                        key={barber.id}
                        className={`cursor-pointer transition-colors ${selectedBarber?.id === barber.id ? 'border-primary' : ''
                            }`}
                        onClick={() => setSelectedBarber(barber)}
                    >
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="relative w-16 h-16 rounded-full overflow-hidden">
                                <img
                                    src={barber.image || "/api/placeholder/64/64"}
                                    alt={barber.name}
                                    className="object-cover"
                                />
                            </div>
                            <div>
                                <p className="font-medium">{barber.name}</p>
                                <p className="text-sm text-gray-500">{barber.experience} years experience</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );

    const renderSummary = () => ( // Removed async
        <div className="space-y-4">
            <h3 className="font-medium mb-4">Booking Summary</h3>
            <div className="space-y-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <p className="font-medium">Barber:</p>
                                <p>{selectedBarber?.name}</p>
                            </div>
                            <div className="flex justify-between items-center">
                                <p className="font-medium">Date:</p>
                                <p>{date?.toLocaleDateString()}</p>
                            </div>
                            <div className="flex justify-between items-center">
                                <p className="font-medium">Time:</p>
                                <p>{selectedTime}</p>
                            </div>
                            <div className="border-t pt-3">
                                <p className="font-medium mb-2">Selected Services:</p>
                                {selectedServices.map((service) => (
                                    <div key={service.id} className="flex justify-between text-sm">
                                        <span>{service.name}</span>
                                        <span>${service.cost}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t pt-3">
                                <div className="flex justify-between items-center font-medium">
                                    <p>Total Duration:</p>
                                    <p>{totalDuration} mins</p>
                                </div>
                                <div className="flex justify-between items-center font-medium">
                                    <p>Total Cost:</p>
                                    <p>${totalCost}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] md:max-w-[800px]">
                <DialogHeader>
                    <DialogTitle>Book an Appointment</DialogTitle>
                </DialogHeader>

                {loading ? (
                    <div className="flex items-center justify-center p-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                    </div>
                ) : (
                    <>
                        <div className="mt-4">
                            {renderStep()}
                        </div>

                        <div className="mt-6 flex justify-between">
                            {step > 1 && (
                                <Button variant="outline" onClick={handleBack}>
                                    Back
                                </Button>
                            )}
                            {step < 4 && (
                                <Button
                                    className="ml-auto"
                                    onClick={handleNext}
                                    disabled={
                                        (step === 1 && !selectedBarber) ||
                                        (step === 2 && selectedServices.length === 0) ||
                                        (step === 3 && (!date || !selectedTime))
                                    }
                                >
                                    Next
                                </Button>
                            )}
                            {step === 4 && (
                                <Button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Confirming...' : 'Confirm Appointment'}
                                </Button>
                            )}
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}

export default BarberServiceModal;
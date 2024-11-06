import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import './BarberServiceModal.css';

interface BarberServiceModalProps {
    onClose: () => void;
    onSelectBarber: (barber: any) => void;
    onSelectServices: (services: any[]) => void;
    onConfirmAppointment: (appointmentData: any) => void;
}

interface Service {
    name: string;
    duration: number;
    cost: number;
}

const BarberServiceModal: React.FC<BarberServiceModalProps> = ({ onClose, onSelectBarber, onSelectServices, onConfirmAppointment }) => {
    const barbers = [
        { name: 'John Doe', services: [{ name: 'Haircut', duration: 30, cost: 20 }, { name: 'Beard Trim', duration: 15, cost: 10 }] },
        { name: 'Jane Smith', services: [{ name: 'Shave', duration: 20, cost: 15 }, { name: 'Haircut', duration: 30, cost: 25 }] },
    ];

    const [selectedServices, setSelectedServices] = useState<{ [key: string]: Service[] }>({});
    const [selectedBarber, setSelectedBarber] = useState<string | null>(null);
    const [appointmentTime, setAppointmentTime] = useState<string | null>(null);

    const handleBarberSelect = (barberName: string) => {
        setSelectedBarber(barberName);
        onSelectBarber(barberName);
        setSelectedServices({ [barberName]: selectedServices[barberName] || [] });
    };

    const handleServiceSelect = (barberName: string, service: Service) => {
        setSelectedServices(prev => {
            const barberServices = prev[barberName] || [];
            const isSelected = barberServices.some(s => s.name === service.name);
            const newSelection = isSelected 
                ? barberServices.filter(s => s.name !== service.name) 
                : [...barberServices, service];

            return { ...prev, [barberName]: newSelection };
        });
        onSelectServices(selectedServices[selectedBarber || ''] || []);
    };

    const totalCost = selectedBarber ? selectedServices[selectedBarber].reduce((total, service) => total + service.cost, 0) : 0;
    const totalDuration = selectedBarber ? selectedServices[selectedBarber].reduce((total, service) => total + service.duration, 0) : 0;

    const availableTimes = Array.from({ length: 10 }, (_, i) => `${i + 1}:00 PM`); // Example times

    // Calculate start and end times based on selected appointment time and total duration
    const calculateAppointmentTimes = () => {
        if (!appointmentTime || totalDuration === 0) return { start: '', end: '' };

        const [hour, period] = appointmentTime.split(':');
        const startHour = parseInt(hour) + (period === 'PM' ? 12 : 0);
        const startTime = new Date();
        startTime.setHours(startHour, 0, 0, 0); // Set to the selected hour

        const endTime = new Date(startTime.getTime() + totalDuration * 60000); // Add duration in milliseconds

        return {
            start: startTime,
            end: endTime,
        };
    };

    const { start, end } = calculateAppointmentTimes();

    const calculateTotalCost = (services: { [key: string]: Service[] }) => {
        return Object.values(services).flat().reduce((total, service) => total + service.cost, 0);
    };

    const handleConfirm = () => {
        const { start, end } = calculateAppointmentTimes(); // Get actual start and end times

        const appointmentData = {
            barber: selectedBarber,
            services: selectedServices,
            appointmentTime: new Date(), // Set this to the actual appointment time
            start: start, // Replace with actual start time
            end: end,     // Replace with actual end time
            totalCost: calculateTotalCost(selectedServices), // Replace with your total cost calculation
        };
        onConfirmAppointment(appointmentData); 
    };

    return (
        <div className="modal">
            <button className="close-button" onClick={onClose}>&times;</button> {/* Close button as "X" */}
            <h2 className="modal-title mb-4">Select Barber and Services</h2>
            <div className="content">
                <div className="service-list mb-4">
                    {barbers.map(barber => (
                        <div className="barber-card mb-2" key={barber.name}>
                            <h3 className="barber-name" onClick={() => handleBarberSelect(barber.name)}>
                                {barber.name}
                            </h3>
                            <div className="services">
                                {barber.services.map(service => (
                                    <div 
                                        className={`service-item ${selectedServices[barber.name]?.some(s => s.name === service.name) ? 'selected' : ''}`} 
                                        key={service.name}
                                        onClick={() => selectedBarber === barber.name && handleServiceSelect(barber.name, service)}
                                        style={{ pointerEvents: selectedBarber === barber.name ? 'auto' : 'none', opacity: selectedBarber === barber.name ? 1 : 0.5 }}
                                    >
                                        {service.name} - Duration: {service.duration} mins - Cost: ${service.cost}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {totalDuration > 0 && (
                    <div className="time-selection border rounded-lg" style={{ width: '100%', maxWidth: '400px' }}>
                        <h4 className="mb-2">Select Appointment Time</h4>
                        <div className="time-list">
                            {availableTimes.map(time => (
                                <div 
                                    key={time} 
                                    className={`time-item ${appointmentTime === time ? 'selected' : ''}`} 
                                    onClick={() => setAppointmentTime(time)}
                                    style={{ padding: '8px', cursor: 'pointer', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '4px' }}
                                >
                                    {time}
                                </div>
                            ))}
                        </div>
                        {appointmentTime && (
                            <div className="appointment-times mt-2">
                                <p>From: {start.toLocaleString([])}</p>
                                <p>To: {end.toLocaleString([])}</p>
                            </div>
                        )}
                    </div>
                )}

                <div className="summary ml-4">
                    <h3 className="mb-2">Selected Barber: {selectedBarber || 'None'}</h3>
                    <h4 className="mb-2">Selected Services</h4>
                    {selectedBarber && selectedServices[selectedBarber].length === 0 ? (
                        <p>No services selected</p>
                    ) : (
                        <ul className="mb-2">
                            {selectedBarber && selectedServices[selectedBarber].map(service => (
                                <li key={service.name}>
                                    {service.name} - Duration: {service.duration} mins - Cost: ${service.cost}
                                </li>
                            ))}
                        </ul>
                    )}
                    <p>Total Cost: ${totalCost}</p>
                    <p>Total Duration: {totalDuration} mins</p>
                    <Button className="confirm-button mt-4" onClick={handleConfirm} disabled={!selectedBarber || totalDuration === 0 || !appointmentTime}>
                        Confirm Appointment
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default BarberServiceModal;
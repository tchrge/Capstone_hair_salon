'use client'

import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

// Mock appointment data (replace with actual data fetching logic)
const mockAppointments = [
  { id: 1, customerName: "John Doe", date: "2023-05-15", time: "10:00 AM" },
  { id: 2, customerName: "Jane Smith", date: "2023-05-15", time: "2:00 PM" },
  { id: 3, customerName: "Bob Johnson", date: "2023-05-16", time: "11:30 AM" },
]

export default function BarberDashboardPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [offerTitle, setOfferTitle] = useState('')
  const [offerDescription, setOfferDescription] = useState('')

  useEffect(() => {
    if (!user) {
      router.push('/barber-login')
    }
  }, [user, router])

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/')
    } catch (error) {
      console.error('Failed to log out', error)
    }
  }

  const handleOfferSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement logic to save and distribute the offer
    console.log('Offer submitted:', { offerTitle, offerDescription })
    // Reset form
    setOfferTitle('')
    setOfferDescription('')
  }

  if (!user) {
    return null // or a loading spinner
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Barber Dashboard</h1>
        <Button onClick={handleLogout}>Log out</Button>
      </div>

      <p className="mb-6">Welcome, {user.email}</p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
        <div className="space-y-4">
          {mockAppointments.map(appointment => (
            <div key={appointment.id} className="border p-4 rounded-lg">
              <p><strong>{appointment.customerName}</strong></p>
              <p>{appointment.date} at {appointment.time}</p>
            </div>
          ))}
        </div>
      </section>

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
          <Button type="submit">Submit Offer</Button>
        </form>
      </section>
    </div>
  )
}
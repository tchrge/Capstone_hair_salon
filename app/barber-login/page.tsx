'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { Spinner } from "@/components/ui/spinner"
import { db } from "@/lib/firebase"
import { collection, doc, setDoc } from "firebase/firestore"
import {toast } from "@/hooks/use-toast"

// Available services list
const availableServices = [
  { id: "haircut", name: "Haircut", duration: 30, cost: 30 },
  { id: "beard-trim", name: "Beard Trim", duration: 15, cost: 20 },
  { id: "hair-color", name: "Hair Color", duration: 90, cost: 80 },
  { id: "shave", name: "Shave", duration: 20, cost: 25 },
  { id: "styling", name: "Hair Styling", duration: 45, cost: 40 }
];

export default function BarberLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const router = useRouter()
  const { loading, login, register } = useAuth()

  // Register form states
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    bio: '',
    experience: '',
    services: [] as string[]
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      console.log("Attempting login...")
      await login(email, password)
      console.log("Login successful, redirecting to dashboard")
      router.push('/barber-dashboard')
    } catch (err) {
      console.error("Login failed:", err)
      setError('Failed to log in. Please check your credentials.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // Get selected services details
      const selectedServices = availableServices.filter(service =>
        registerData.services.includes(service.id)
      )

      const barberData = {
        name: registerData.name,
        email: registerData.email,
        services: selectedServices,
        bio: registerData.bio,
        experience: parseInt(registerData.experience),
      }

      await register(registerData.email, registerData.password, barberData)
      setIsRegisterOpen(false)
      router.push('/barber-dashboard')
    } catch (err) {
      console.error("Registration failed:", err)
      setError(err instanceof Error ? err.message : 'Failed to create account. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleService = (serviceId: string) => {
    setRegisterData(prev => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter(id => id !== serviceId)
        : [...prev.services, serviceId]
    }))
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen"><Spinner /></div>
  }

  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight">Barber Login</h2>
        </div>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Email address"
                className="mb-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Spinner className="mr-2" /> : null}
              Sign in
            </Button>
          </div>
        </form>
        <div className="text-center space-y-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setIsRegisterOpen(true)}
          >
            Register as a Barber
          </Button>
          <Link href="/" className="text-sm text-blue-600 hover:text-blue-500">
            Back to Home
          </Link>
        </div>
      </div>

      <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Register as a Barber</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <Label htmlFor="reg-name">Full Name</Label>
              <Input
                id="reg-name"
                value={registerData.name}
                onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <Label htmlFor="reg-email">Email</Label>
              <Input
                id="reg-email"
                type="email"
                value={registerData.email}
                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <Label htmlFor="reg-password">Password</Label>
              <Input
                id="reg-password"
                type="password"
                value={registerData.password}
                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                placeholder="Create a password"
                required
              />
            </div>

            <div>
              <Label>Services Offered</Label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                {availableServices.map((service) => (
                  <div key={service.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={service.id}
                      checked={registerData.services.includes(service.id)}
                      onCheckedChange={() => toggleService(service.id)}
                    />
                    <Label htmlFor={service.id} className="text-sm">
                      {service.name} - ${service.cost}
                      <br />
                      <span className="text-gray-500">({service.duration} mins)</span>
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="reg-bio">Bio</Label>
              <Textarea
                id="reg-bio"
                value={registerData.bio}
                onChange={(e) => setRegisterData({ ...registerData, bio: e.target.value })}
                placeholder="Tell us about your experience and expertise"
                required
              />
            </div>

            <div>
              <Label htmlFor="reg-experience">Years of Experience</Label>
              <Input
                id="reg-experience"
                type="number"
                min="0"
                value={registerData.experience}
                onChange={(e) => setRegisterData({ ...registerData, experience: e.target.value })}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Spinner className="mr-2" /> : null}
              Create Account
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
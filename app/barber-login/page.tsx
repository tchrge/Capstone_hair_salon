'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { Spinner } from "@/components/ui/spinner"

export default function BarberLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { user, login } = useAuth()

  useEffect(() => {
    if (!user) {
      console.log("User is already logged in, redirecting to dashboard")
      router.push('/barber-dashboard')
    }
  }, [user, router])

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

  if (user) {
    return <Spinner /> // Show spinner while redirecting
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
        <div className="text-center">
          <Link href="/" className="text-sm text-blue-600 hover:text-blue-500">Back to Home</Link>
        </div>
      </div>
    </div>
  )
}
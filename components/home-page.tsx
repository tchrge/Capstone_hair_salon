'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Scissors, Calendar, Users, BarChart, Star, UserCircle } from "lucide-react"
import Link from "next/link"

export function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="#">
          <Scissors className="h-6 w-6" />
          <span className="sr-only">Barber CRM</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Features
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Pricing
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            About
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Contact
          </Link>  
          <Link href="/customer-login" passHref>
            <Button variant="outline" size="sm" className="hidden sm:inline-flex">
              <UserCircle className="h-4 w-4 mr-2" />
              Customer Login
            </Button>
          </Link>
          <Link href="/barber-login" passHref>
            <Button size="sm" className="hidden sm:inline-flex">
              <Scissors className="h-4 w-4 mr-2" />
              Barber Login
            </Button>
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Revolutionize Your Barbershop Management
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Streamline appointments, boost client retention, and grow your business with our all-in-one Barber CRM solution.
                </p>
              </div>
              <div className="space-x-4">
                <Button className="bg-primary hover:bg-primary/90">Get Started</Button>
                <Button variant="outline">Learn More</Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Key Features</h2>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <Calendar className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Smart Scheduling</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Effortlessly manage appointments and reduce no-shows with automated reminders.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <Users className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Client Management</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Keep detailed client profiles, preferences, and history at your fingertips.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <BarChart className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Business Analytics</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Gain valuable insights into your business performance and growth opportunities.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">What Our Customers Say</h2>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 border p-4 rounded-lg">
                <Star className="h-6 w-6 text-yellow-500" />
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  "This CRM has transformed how I run my barbershop. I can't imagine working without it now!"
                </p>
                <p className="font-semibold">- John D., Master Barber</p>
              </div>
              <div className="flex flex-col items-center space-y-2 border p-4 rounded-lg">
                <Star className="h-6 w-6 text-yellow-500" />
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  "The scheduling feature alone has saved me hours each week. Highly recommended!"
                </p>
                <p className="font-semibold">- Sarah L., Salon Owner</p>
              </div>
              <div className="flex flex-col items-center space-y-2 border p-4 rounded-lg">
                <Star className="h-6 w-6 text-yellow-500" />
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  "Customer support is top-notch. They're always there to help with any questions."
                </p>
                <p className="font-semibold">- Mike R., Barber</p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Transform Your Barbershop?
                </h2>
                <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Join thousands of satisfied barbers and take your business to the next level.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <Input className="max-w-lg flex-1" placeholder="Enter your email" type="email" />
                  <Button className="bg-primary hover:bg-primary/90" type="submit">
                    Get Started
                  </Button>
                </form>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Start your 14-day free trial. No credit card required.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 Barber CRM. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}
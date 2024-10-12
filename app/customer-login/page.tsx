'use client'

import { Button } from "@/components/ui/button"
import { FcGoogle } from "react-icons/fc"
import { AiFillInstagram } from "react-icons/ai"
import { FaTiktok } from "react-icons/fa"
import Link from "next/link"

export default function CustomerLoginPage() {
  const handleLogin = (provider: string) => {
    window.location.href = `/api/auth/${provider}`
  }

  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight">Customer Login</h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in with your social media account to access your customer portal
          </p>
        </div>
        <div className="mt-8 space-y-4">
          <Button 
            className="w-full flex items-center justify-center"
            variant="outline"
            onClick={() => handleLogin('google')}
          >
            <FcGoogle className="w-5 h-5 mr-2" />
            Sign in with Google
          </Button>
          <Button 
            className="w-full flex items-center justify-center bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 hover:from-purple-600 hover:via-pink-600 hover:to-yellow-600"
            onClick={() => handleLogin('instagram')}
          >
            <AiFillInstagram className="w-5 h-5 mr-2" />
            Sign in with Instagram
          </Button>
          <Button 
            className="w-full flex items-center justify-center bg-black hover:bg-gray-800"
            onClick={() => handleLogin('tiktok')}
          >
            <FaTiktok className="w-5 h-5 mr-2" />
            Sign in with TikTok
          </Button>
        </div>
        <div className="text-center">
          <Link href="/" className="text-sm text-blue-600 hover:text-blue-500">Back to Home</Link>
        </div>
      </div>
    </div>
  )
}
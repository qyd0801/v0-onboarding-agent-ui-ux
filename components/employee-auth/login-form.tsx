"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LogIn, ArrowRight } from "lucide-react"

interface LoginFormProps {
  onLogin: (userData: any) => void
  onAdminAccess: () => void
}

export function LoginForm({ onLogin, onAdminAccess }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isAdmin, setIsAdmin] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email")
      return
    }

    try {
      // Call authentication API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Invalid email or password')
        return
      }

      // Login successful, pass user data to parent
      onLogin(data.user)
    } catch (error) {
      console.error('Login error:', error)
      setError('Failed to login. Please try again.')
    }
  }

  const handleAdminClick = () => {
    setEmail("")
    setPassword("")
    onAdminAccess()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md lg:max-w-lg">
        <Card className="p-8 lg:p-10 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 bg-primary rounded-xl mb-6 shadow-lg">
              <LogIn className="w-8 h-8 lg:w-10 lg:h-10 text-primary-foreground" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-3">Welcome Back</h1>
            <p className="text-base lg:text-lg text-muted-foreground">Access your employee portal</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="space-y-3">
              <Label htmlFor="email" className="text-foreground font-semibold text-base">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@company.com"
                className="bg-input border-border h-12 text-base"
              />
            </div>

            {/* Password */}
            <div className="space-y-3">
              <Label htmlFor="password" className="text-foreground font-semibold text-base">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-input border-border h-12 text-base"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-destructive/10 border border-destructive rounded-lg text-destructive text-sm font-medium">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-7 text-base lg:text-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
            >
              Sign In
              <ArrowRight className="w-5 h-5" />
            </Button>
          </form>

          {/* Admin Access */}
          <div className="mt-8 pt-6 text-center">
            <p className="text-sm text-muted-foreground mb-4">Are you an HR admin?</p>
            <Button
              type="button"
              onClick={handleAdminClick}
              variant="outline"
              className="w-full border-border text-primary hover:bg-primary/5 bg-transparent h-12 font-semibold"
            >
              Admin Dashboard
            </Button>
          </div>
        </Card>

        {/* Demo Credentials */}
        <div className="mt-6 p-5 lg:p-6 bg-card rounded-lg shadow-lg">
          <p className="text-sm text-muted-foreground font-bold mb-3">📋 Demo Credentials:</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-semibold">Email:</span>
              <code className="text-xs text-foreground bg-muted px-2 py-1 rounded">john@company.com</code>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-semibold">Password:</span>
              <code className="text-xs text-foreground bg-muted px-2 py-1 rounded">12345</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

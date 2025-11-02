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
      <div className="w-full max-w-md">
        <Card className="p-8 border border-border shadow-lg">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary rounded-lg mb-4">
              <LogIn className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h1>
            <p className="text-muted-foreground">Access your employee portal</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-semibold">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@company.com"
                className="bg-input border-border"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-semibold">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-input border-border"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive rounded-lg text-destructive text-sm font-medium">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 text-base flex items-center justify-center gap-2"
            >
              Sign In
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          {/* Admin Access */}
          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-sm text-muted-foreground mb-3">Are you an HR admin?</p>
            <Button
              type="button"
              onClick={handleAdminClick}
              variant="outline"
              className="w-full border-border text-primary hover:bg-primary/5 bg-transparent"
            >
              Admin Dashboard
            </Button>
          </div>
        </Card>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-card border border-border rounded-lg">
          <p className="text-xs text-muted-foreground font-semibold mb-2">Demo Credentials:</p>
          <p className="text-xs text-muted-foreground">Email: john@company.com</p>
          <p className="text-xs text-muted-foreground">Password: any password</p>
        </div>
      </div>
    </div>
  )
}

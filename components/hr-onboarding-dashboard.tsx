"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle2, Users, User } from "lucide-react"

interface Employee {
  id: string
  name: string
  email: string
  password: string
  project: string
  role: string
  addedAt: string
}

const PROJECTS = ["Project Nova", "The Aurora Design System", "Customer 360"]
const ROLES = ["Design System Intern", "Frontend Engineer Intern", "UX Designer Intern"]

export function HROnboardingDashboard() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [showForm, setShowForm] = useState(true)
  const [submitted, setSubmitted] = useState<Employee | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    project: "",
    role: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.password || !formData.project || !formData.role) {
      alert("Please fill in all fields")
      return
    }

    try {
      // Call API to create employee in Supabase
      const response = await fetch('/api/employees/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.error || 'Failed to create employee')
        return
      }

      const newEmployee: Employee = {
        id: data.employee.id,
        ...formData,
        addedAt: new Date().toLocaleDateString(),
      }

      setEmployees((prev) => [newEmployee, ...prev])
      setSubmitted(newEmployee)
      setFormData({ name: "", email: "", password: "", project: "", role: "" })

      setTimeout(() => {
        setShowForm(true)
        setSubmitted(null)
      }, 3000)
    } catch (error) {
      console.error('Error creating employee:', error)
      alert('Failed to create employee. Please try again.')
    }
  }

  return (
    <div className="min-h-screen px-4 py-12 sm:px-6 lg:px-8 xl:px-12">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center gap-2 mb-6">
            <div className="p-4 bg-primary rounded-xl shadow-lg">
              <Users className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-4">Employee Onboarding</h1>
          <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">Streamline your team's integration process</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 xl:gap-8">
          {/* Form Section */}
          <div className="lg:col-span-5 xl:col-span-4">
            <Card className="p-6 lg:p-8 border border-border shadow-lg sticky top-24">
              <h2 className="text-2xl font-bold text-foreground mb-6">Add New Employee</h2>

              {submitted ? (
                <div className="space-y-5 text-center py-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-accent rounded-full shadow-lg">
                    <CheckCircle2 className="w-10 h-10 text-accent-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Employee Created!</h3>
                  <p className="text-muted-foreground">{submitted.name} has been added to the system</p>
                  <div className="pt-4 space-y-3 text-sm">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <span className="font-semibold text-foreground">Email:</span>
                      <p className="text-muted-foreground mt-1">{submitted.email}</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <span className="font-semibold text-foreground">Project:</span>
                      <p className="text-muted-foreground mt-1">{submitted.project}</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <span className="font-semibold text-foreground">Role:</span>
                      <p className="text-muted-foreground mt-1">{submitted.role}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-foreground font-semibold">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className="bg-input border-border"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground font-semibold">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john@company.com"
                      className="bg-input border-border"
                    />
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-foreground font-semibold">
                      Temporary Password
                    </Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      className="bg-input border-border"
                    />
                  </div>

                  {/* Project */}
                  <div className="space-y-2">
                    <Label htmlFor="project" className="text-foreground font-semibold">
                      Project
                    </Label>
                    <Select value={formData.project} onValueChange={(value) => handleSelectChange("project", value)}>
                      <SelectTrigger className="bg-input border-border">
                        <SelectValue placeholder="Select project" />
                      </SelectTrigger>
                      <SelectContent>
                        {PROJECTS.map((project) => (
                          <SelectItem key={project} value={project}>
                            {project}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Role */}
                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-foreground font-semibold">
                      Role
                    </Label>
                    <Select value={formData.role} onValueChange={(value) => handleSelectChange("role", value)}>
                      <SelectTrigger className="bg-input border-border">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {ROLES.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-6 text-base"
                  >
                    Create Employee Profile
                  </Button>
                </form>
              )}
            </Card>
          </div>

          {/* Employees List Section */}
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">Recent Employees</h2>
                <div className="px-4 py-2 bg-accent/10 border border-accent/20 rounded-lg">
                  <span className="text-sm font-semibold text-accent">{employees.length} Total</span>
                </div>
              </div>

              {employees.length === 0 ? (
                <Card className="p-12 lg:p-16 text-center border border-border">
                  <div className="max-w-md mx-auto">
                    <div className="mb-4 inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full">
                      <Users className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground text-lg">
                      No employees added yet. Create your first employee profile using the form.
                    </p>
                  </div>
                </Card>
              ) : (
                <div className="grid gap-4 xl:gap-5">
                  {employees.map((employee) => (
                    <Card key={employee.id} className="p-6 lg:p-7 border border-border hover:shadow-lg transition-all">
                      <div className="flex items-start justify-between mb-5">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-bold text-foreground">{employee.name}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{employee.email}</p>
                          </div>
                        </div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full flex-shrink-0">
                          <CheckCircle2 className="w-4 h-4 text-accent" />
                          <span className="text-sm font-semibold text-accent">Active</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-5 border-t border-border">
                        <div>
                          <p className="text-xs text-muted-foreground uppercase font-semibold mb-1.5">Project</p>
                          <p className="text-foreground font-semibold">{employee.project}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground uppercase font-semibold mb-1.5">Role</p>
                          <p className="text-foreground font-semibold">{employee.role}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground uppercase font-semibold mb-1.5">Added On</p>
                          <p className="text-foreground font-semibold">{employee.addedAt}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground uppercase font-semibold mb-1.5">Status</p>
                          <p className="text-accent font-semibold">✓ Onboarded</p>
                        </div>
                      </div>

                      <div className="mt-5 grid sm:grid-cols-2 gap-3 pt-5 border-t border-border">
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">
                            <span className="font-semibold text-foreground">Slack Channels:</span>
                          </p>
                          <p className="text-sm text-foreground">#{employee.project.toLowerCase()}, #general, #random</p>
                        </div>
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">
                            <span className="font-semibold text-foreground">GitHub Access:</span>
                          </p>
                          <p className="text-sm text-foreground">{employee.project} repositories</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

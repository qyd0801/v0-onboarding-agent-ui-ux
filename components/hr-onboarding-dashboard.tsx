"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle2, Users } from "lucide-react"

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.password || !formData.project || !formData.role) {
      alert("Please fill in all fields")
      return
    }

    const newEmployee: Employee = {
      id: Date.now().toString(),
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
  }

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <div className="p-3 bg-primary rounded-xl">
              <Users className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-foreground mb-3">Employee Onboarding</h1>
          <p className="text-lg text-muted-foreground">Streamline your team's integration process</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <Card className="p-8 border border-border shadow-lg">
              <h2 className="text-2xl font-bold text-foreground mb-6">Add New Employee</h2>

              {submitted ? (
                <div className="space-y-4 text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-accent rounded-full">
                    <CheckCircle2 className="w-8 h-8 text-accent-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Employee Created!</h3>
                  <p className="text-muted-foreground">{submitted.name} has been added to the system</p>
                  <div className="pt-4 space-y-2 text-sm">
                    <p className="text-muted-foreground">
                      <span className="font-semibold text-foreground">Email:</span> {submitted.email}
                    </p>
                    <p className="text-muted-foreground">
                      <span className="font-semibold text-foreground">Project:</span> {submitted.project}
                    </p>
                    <p className="text-muted-foreground">
                      <span className="font-semibold text-foreground">Role:</span> {submitted.role}
                    </p>
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
          <div className="lg:col-span-2">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Recent Employees ({employees.length})</h2>

              {employees.length === 0 ? (
                <Card className="p-12 text-center border border-border">
                  <p className="text-muted-foreground text-lg">
                    No employees added yet. Create your first employee profile using the form.
                  </p>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {employees.map((employee) => (
                    <Card key={employee.id} className="p-6 border border-border hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-foreground">{employee.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{employee.email}</p>
                        </div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 rounded-full">
                          <CheckCircle2 className="w-4 h-4 text-accent" />
                          <span className="text-sm font-semibold text-accent">Active</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                        <div>
                          <p className="text-xs text-muted-foreground uppercase font-semibold">Project</p>
                          <p className="text-foreground font-semibold mt-1">{employee.project}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground uppercase font-semibold">Role</p>
                          <p className="text-foreground font-semibold mt-1">{employee.role}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground uppercase font-semibold">Added On</p>
                          <p className="text-foreground font-semibold mt-1">{employee.addedAt}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground uppercase font-semibold">Status</p>
                          <p className="text-accent font-semibold mt-1">✓ Onboarded</p>
                        </div>
                      </div>

                      <div className="mt-4 space-y-2 text-xs pt-4 border-t border-border">
                        <p className="text-muted-foreground">
                          <span className="font-semibold text-foreground">Slack Channels Added:</span> #
                          {employee.project.toLowerCase()}, #general, #random
                        </p>
                        <p className="text-muted-foreground">
                          <span className="font-semibold text-foreground">GitHub Access:</span> {employee.project}{" "}
                          repositories
                        </p>
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

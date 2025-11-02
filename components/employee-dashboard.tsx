"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { LogOut, User, Briefcase, Building2, Shield, FileText } from "lucide-react"
import { EmployeeProfile } from "./employee-profile"
import { OnboardingChecklist } from "./onboarding-checklist"
import { DualChatbotInterface } from "./dual-chatbot-interface"
import { IntegrationsPanel } from "./integrations-panel"
import { EmailTestPanel } from "./email-test-panel"

interface EmployeeDashboardProps {
  user: {
    id: string
    email: string
    name: string
    project: string
    role: string
    joinedDate: string
    manager_email?: string
  }
  onLogout: () => void
  onRoleChange: (role: "admin" | "employee" | null) => void
}

export function EmployeeDashboard({ user, onLogout, onRoleChange }: EmployeeDashboardProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-4 py-4 sm:px-6 lg:px-8 xl:px-12 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Employee Portal</h1>
              <p className="text-sm text-muted-foreground">Welcome back, {user.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => {
                onRoleChange("admin")
              }}
              className="border-border text-primary hover:bg-primary/5 hidden sm:flex"
            >
              <Shield className="w-4 h-4 mr-2" />
              Admin Panel
            </Button>
            <Button
              onClick={onLogout}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-4 py-8 sm:px-6 lg:px-8 xl:px-12">
        <div className="grid lg:grid-cols-12 gap-6 xl:gap-8">
          {/* Profile Section */}
          <div className="lg:col-span-4 xl:col-span-3">
            <EmployeeProfile user={user} />
          </div>

          {/* Onboarding & Info Section */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-6">
            {/* Quick Stats */}
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 xl:gap-6">
              <Card className="p-6 border border-border hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Current Project</p>
                    <p className="text-2xl font-bold text-foreground">{user.project}</p>
                  </div>
                  <Briefcase className="w-10 h-10 text-primary/30" />
                </div>
              </Card>

              <Card className="p-6 border border-border hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Role</p>
                    <p className="text-2xl font-bold text-foreground">{user.role.split(" ")[0]}</p>
                  </div>
                  <Building2 className="w-10 h-10 text-secondary/30" />
                </div>
              </Card>

              <Card className="p-6 border border-border hover:shadow-md transition-shadow sm:col-span-2 xl:col-span-1">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Onboarding</p>
                    <p className="text-2xl font-bold text-accent">29% Complete</p>
                  </div>
                  <FileText className="w-10 h-10 text-accent/30" />
                </div>
              </Card>
            </div>

            {/* Onboarding Checklist */}
            <OnboardingChecklist />

            {/* Integrations Panel */}
            <IntegrationsPanel />

            {/* AI Chatbot - Dual Interface */}
            <DualChatbotInterface 
              employeeName={user.name}
              employeeEmail={user.email}
              managerEmail={user.manager_email}
            />

            {/* Email System Test Panel */}
            <EmailTestPanel 
              employeeName={user.name}
              employeeEmail={user.email}
              managerEmail={user.manager_email}
            />

            {/* Documents Section */}
            <Card className="p-6 border border-border">
              <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Important Documents
              </h3>

              <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {[
                  { name: "Employee Handbook", date: "2024-01-15", type: "download" },
                  { name: "Code of Conduct", date: "2024-01-15", type: "download" },
                  { name: "Aurora Design System", date: "Updated", type: "link", url: "https://github.com/JieHan-eng/aurora-design-system" },
                  { name: "Company Policies", date: "2024-01-15", type: "download" },
                ].map((doc) => (
                  <div
                    key={doc.name}
                    className="flex flex-col p-4 bg-muted/50 rounded-lg hover:bg-muted hover:shadow-sm transition-all cursor-pointer border border-transparent hover:border-primary/20"
                    onClick={() => {
                      if (doc.type === "link" && doc.url) {
                        window.open(doc.url, "_blank")
                      }
                    }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground mb-1">{doc.name}</p>
                      <p className="text-xs text-muted-foreground mb-3">{doc.date}</p>
                    </div>
                    <Button size="sm" variant="ghost" className="text-primary hover:bg-primary/10 w-full justify-center">
                      {doc.type === "link" ? "View" : "Download"}
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}


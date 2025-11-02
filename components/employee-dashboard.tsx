"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Briefcase, Building2, FileText } from "lucide-react"
import { OnboardingChecklist } from "./onboarding-checklist"
import { IntegrationsPanel } from "./integrations-panel"
import { TextChatbot } from "./text-chatbot"
import { AnamAvatarChatbot } from "./anam-avatar-chatbot"
import { TopNav } from "./top-nav"

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
}

export function EmployeeDashboard({ user, onLogout }: EmployeeDashboardProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Pill Top Navigation matching Figma */}
      <TopNav
        user={user}
        onLogout={onLogout}
      />

      {/* Main Content: fixed 1280 width, 20px margins, 10px gaps */}
      <main className="max-w-[1280px] mx-auto px-[20px] py-6">
        <div className="grid grid-cols-[490px_1fr] gap-[10px] items-start">
          {/* Left column: Voice Avatar + Text Chat */}
          <div className="space-y-[10px]">
            <AnamAvatarChatbot
              employeeName={user.name}
              employeeEmail={user.email}
              managerEmail={user.manager_email}
            />

            <TextChatbot
              employeeName={user.name}
              employeeEmail={user.email}
              managerEmail={user.manager_email}
            />
          </div>

          {/* Right column: all other features as cards */}
          <div className="space-y-[10px]">
            <Card className="p-6 gap-0">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">Current Snapshot</h3>
                <span className="text-xs font-medium uppercase tracking-wider text-primary/70">Today</span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[18px] bg-primary/10 p-4 flex flex-col gap-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase text-primary/70">Current Project</p>
                      <p className="text-xl font-bold text-primary">{user.project}</p>
                    </div>
                    <Briefcase className="w-8 h-8 text-primary/80" />
                  </div>
                  <p className="text-xs text-primary/60">Stay aligned with project milestones.</p>
                </div>

                <div className="rounded-[18px] bg-primary/10 p-4 flex flex-col gap-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase text-primary/70">Role</p>
                      <p className="text-xl font-bold text-primary">{user.role.split(" ")[0]}</p>
                    </div>
                    <Building2 className="w-8 h-8 text-primary/80" />
                  </div>
                  <p className="text-xs text-primary/60">Access tailored resources for your role.</p>
                </div>
              </div>

              <div className="mt-5 rounded-[18px] bg-muted/60 p-4">
                <div className="flex items-center justify-between text-sm font-semibold text-foreground">
                  <span>Onboarding Progress</span>
                  <span className="text-primary">29% · 2 of 7</span>
                </div>
                <div className="mt-3 h-2 w-full rounded-full bg-muted">
                  <div className="h-2 rounded-full bg-primary" style={{ width: "29%" }} />
                </div>
              </div>
            </Card>

            <OnboardingChecklist />

            <IntegrationsPanel />

            {/* Documents Section */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Important Documents
              </h3>

              <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-[10px]">
                {[
                  { name: "Employee Handbook", date: "2024-01-15", type: "download" },
                  { name: "Code of Conduct", date: "2024-01-15", type: "download" },
                  { name: "Aurora Design System", date: "Updated", type: "link", url: "https://github.com/JieHan-eng/aurora-design-system" },
                  { name: "Company Policies", date: "2024-01-15", type: "download" },
                ].map((doc) => (
                  <div
                    key={doc.name}
                    className="flex flex-col p-4 bg-primary/5 rounded-xl transition-all cursor-pointer border border-transparent hover:border-primary/30 hover:bg-primary/10"
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


"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Briefcase, Calendar } from "lucide-react"

interface EmployeeProfileProps {
  user: {
    id: string
    email: string
    name: string
    project: string
    role: string
    joinedDate: string
  }
}

export function EmployeeProfile({ user }: EmployeeProfileProps) {
  return (
    <Card className="p-6 lg:p-8 sticky top-24">
      {/* Avatar */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-primary to-secondary rounded-full mb-4 shadow-lg">
          <User className="w-10 h-10 lg:w-12 lg:h-12 text-white" />
        </div>
        <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-3">{user.name}</h2>
        <Badge className="bg-primary/10 text-primary border-primary/30 px-3 py-1 text-sm">{user.role}</Badge>
      </div>

      {/* Info */}
      <div className="space-y-5">
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wide">Email</p>
          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg border border-transparent hover:border-primary/20 transition-colors">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Mail className="w-4 h-4 text-primary" />
            </div>
            <p className="text-sm text-foreground break-all">{user.email}</p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wide">Project</p>
          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg border border-transparent hover:border-secondary/20 transition-colors">
            <div className="p-2 bg-secondary/10 rounded-lg">
              <Briefcase className="w-4 h-4 text-secondary" />
            </div>
            <p className="text-sm text-foreground font-medium">{user.project}</p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wide">Joined</p>
          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg border border-transparent hover:border-primary/20 transition-colors">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Calendar className="w-4 h-4 text-primary" />
            </div>
            <p className="text-sm text-foreground font-medium">{user.joinedDate}</p>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="mt-8 p-4 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg text-center">
        <p className="text-sm font-bold text-primary">✓ Status: Onboarded</p>
      </div>
    </Card>
  )
}

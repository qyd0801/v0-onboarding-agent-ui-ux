"use client"

import { LogOut, Mail, Briefcase, Calendar } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface TopNavUser {
  name: string
  email?: string
  role?: string
  joinedDate?: string
  project?: string
}

interface TopNavProps {
  user: TopNavUser
  onLogout?: () => void
}

export function TopNav({ user, onLogout }: TopNavProps) {
  const welcomeName = user?.name ?? "Employee"

  return (
    <div className="w-full flex justify-center pt-6">
      <div className="max-w-[1280px] w-full px-[20px]">
        <div className="h-[60px] w-full bg-[#13544E] rounded-[40px] px-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-block w-3 h-3 rounded-full bg-white/80" />
            <span className="text-base tracking-tight">Onboarded Journey</span>
          </div>
          <div className="relative flex items-center gap-3 group">
            <button
              type="button"
              className="hidden sm:inline-flex items-center rounded-full px-3 py-1 text-sm font-medium text-white/90 transition-colors hover:bg-white/10 focus-visible:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              Welcome back, {welcomeName}
            </button>
            <div className="absolute right-0 top-[calc(100%+12px)] z-20 hidden min-w-[260px] flex-col gap-3 rounded-3xl bg-white/95 p-5 text-foreground shadow-xl backdrop-blur-md transition-all duration-200 group-hover:flex group-focus-within:flex">
              <div className="flex flex-col gap-1">
                <p className="text-sm text-muted-foreground">Employee</p>
                <p className="text-lg font-semibold text-foreground">{welcomeName}</p>
              </div>
              {user.project && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Briefcase className="size-4 text-[#13544E]" />
                  <span>{user.project}</span>
                </div>
              )}
              {user.email && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="size-4 text-[#13544E]" />
                  <span className="truncate">{user.email}</span>
                </div>
              )}
              {user.joinedDate && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="size-4 text-[#13544E]" />
                  <span>Joined {user.joinedDate}</span>
                </div>
              )}
            </div>
            <span className="text-sm sm:hidden">Hi, {welcomeName}</span>
            {onLogout && (
              <Button
                size="icon"
                variant="ghost"
                onClick={onLogout}
                aria-label="Log out"
                className="text-white/80 hover:text-white hover:bg-white/10"
              >
                <LogOut className="size-5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

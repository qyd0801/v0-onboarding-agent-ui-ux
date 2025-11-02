"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { CheckCircle2, Circle } from "lucide-react"

interface ChecklistItem {
  id: string
  title: string
  description: string
  completed: boolean
}

export function OnboardingChecklist() {
  const [items, setItems] = useState<ChecklistItem[]>([
    { id: "1", title: "Complete Profile Setup", description: "Update your personal information", completed: true },
    { id: "2", title: "Review Company Handbook", description: "Read and acknowledge our policies", completed: true },
    { id: "3", title: "Join Slack Workspace", description: "Connect with your team on Slack", completed: false },
    { id: "4", title: "Access Aurora Design System", description: "Review design tokens and components", completed: false },
    { id: "5", title: "Set Up Work Equipment", description: "Configure your laptop and tools", completed: false },
    { id: "6", title: "Attend Team Meeting", description: "Join your team's introduction session", completed: false },
    { id: "7", title: "Complete Training Modules", description: "Finish all mandatory training", completed: false },
  ])

  const handleToggle = (id: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)))
  }

  const completedCount = items.filter((item) => item.completed).length
  const totalCount = items.length
  const progressPercent = (completedCount / totalCount) * 100

  return (
    <Card className="p-6 lg:p-7 border border-border">
      <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
        <div className="p-2 bg-accent/10 rounded-lg">
          <CheckCircle2 className="w-5 h-5 text-accent" />
        </div>
        Onboarding Checklist
      </h3>

      {/* Progress */}
      <div className="mb-8 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-foreground">Your Progress</p>
          <p className="text-lg font-bold text-accent">
            {completedCount} of {totalCount}
          </p>
        </div>
        <div className="w-full bg-muted rounded-full h-3">
          <div
            className="bg-gradient-to-r from-accent to-accent/80 h-3 rounded-full transition-all duration-300 shadow-sm"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {progressPercent.toFixed(0)}% complete
        </p>
      </div>

      {/* Checklist Items */}
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/50 transition-all cursor-pointer border border-transparent hover:border-accent/20"
            onClick={() => handleToggle(item.id)}
          >
            {/* Checkbox */}
            <div className="mt-0.5 flex-shrink-0">
              {item.completed ? (
                <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-accent-foreground" />
                </div>
              ) : (
                <Circle className="w-6 h-6 text-muted-foreground" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p
                className={`font-semibold mb-1 ${item.completed ? "text-muted-foreground line-through" : "text-foreground"}`}
              >
                {item.title}
              </p>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

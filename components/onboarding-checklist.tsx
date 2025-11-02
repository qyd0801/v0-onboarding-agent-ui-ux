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
    <Card className="p-6 border border-border">
      <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
        <CheckCircle2 className="w-5 h-5 text-accent" />
        Onboarding Checklist
      </h3>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-muted-foreground">Progress</p>
          <p className="text-sm font-semibold text-foreground">
            {completedCount} of {totalCount}
          </p>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-accent h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Checklist Items */}
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
            onClick={() => handleToggle(item.id)}
          >
            {/* Checkbox */}
            <div className="mt-1">
              {item.completed ? (
                <CheckCircle2 className="w-5 h-5 text-accent" />
              ) : (
                <Circle className="w-5 h-5 text-muted-foreground" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p
                className={`font-semibold ${item.completed ? "text-muted-foreground line-through" : "text-foreground"}`}
              >
                {item.title}
              </p>
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

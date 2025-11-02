"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slack, Github, CheckCircle2, AlertCircle } from "lucide-react"

interface IntegrationStatus {
  name: string
  icon: React.ReactNode
  status: "connected" | "pending" | "failed"
  details: string[]
}

export function IntegrationsPanel() {
  const [integrations, setIntegrations] = useState<IntegrationStatus[]>([
    {
      name: "Slack",
      icon: <Slack className="w-5 h-5" />,
      status: "pending",
      details: [
        "Join the Raspberry Coffee workspace",
        "Connect with your team members",
        "Access important channels",
        "Get real-time updates",
      ],
    },
    {
      name: "GitHub",
      icon: <Github className="w-5 h-5" />,
      status: "connected",
      details: [
        "✓ Access granted to aurora-design-system",
        "✓ Added to Frontend team",
        "✓ SSH key configured",
        "✓ Repository access active",
      ],
    },
  ])

  const handleJoinSlack = () => {
    // Open Slack invite link in new tab
    window.open("https://join.slack.com/t/raspberrycoffee/shared_invite/zt-3hiynzzs1-bAQGFz3OE8DSXX8lpKEtBA", "_blank")
    
    // Update Slack status to connected after a short delay
    setTimeout(() => {
      setIntegrations((prev) =>
        prev.map((integration) =>
          integration.name === "Slack"
            ? {
                ...integration,
                status: "connected" as const,
                details: [
                  "✓ Joined Raspberry Coffee workspace",
                  "✓ Added to team channels",
                  "✓ Display name configured",
                  "✓ Ready to collaborate",
                ],
              }
            : integration,
        ),
      )
    }, 2000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "bg-primary/10 text-primary"
      case "pending":
        return "bg-primary/5 text-primary"
      case "failed":
        return "bg-destructive/10 text-destructive"
      default:
        return ""
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle2 className="w-4 h-4" />
      case "pending":
        return <AlertCircle className="w-4 h-4" />
      case "failed":
        return <AlertCircle className="w-4 h-4" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-foreground">Connected Services</h3>

      <div className="grid lg:grid-cols-2 gap-4 xl:gap-6">
        {integrations.map((integration) => (
          <Card key={integration.name} className="p-6 lg:p-7 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-muted rounded-xl shadow-sm">{integration.icon}</div>
                <div>
                  <h4 className="text-lg font-bold text-foreground">{integration.name}</h4>
                  <p className="text-xs text-muted-foreground mt-1">Onboarding Integration</p>
                </div>
              </div>
              <Badge
                variant="outline"
                className={`${getStatusColor(integration.status)} flex items-center gap-1 px-3 py-1.5 border-transparent hover:bg-transparent`}
              >
                {getStatusIcon(integration.status)}
                {integration.status === "connected" && "Connected"}
                {integration.status === "pending" && "Pending"}
                {integration.status === "failed" && "Failed"}
              </Badge>
            </div>

            {/* Integration Details */}
            <div className="space-y-2.5">
              {integration.details.map((detail, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                  <span>{detail}</span>
                </div>
              ))}
            </div>

            {/* Actions */}
            {integration.status === "connected" && (
              <div className="mt-4 pt-4 relative before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-foreground/10">
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full bg-transparent text-primary border-primary/30 hover:bg-primary/10"
                  onClick={() => {
                    if (integration.name === "Slack") {
                      window.open("https://raspberrycoffee.slack.com", "_blank")
                    } else if (integration.name === "GitHub") {
                      window.open("https://github.com/JieHan-eng/aurora-design-system", "_blank")
                    }
                  }}
                >
                  View in {integration.name}
                </Button>
              </div>
            )}

            {integration.status === "pending" && (
              <div className="mt-4 pt-4 flex gap-2 relative before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-foreground/10">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-primary hover:bg-primary/10 flex-1 bg-transparent border-primary/30"
                  onClick={integration.name === "Slack" ? handleJoinSlack : undefined}
                >
                  {integration.name === "Slack" ? "Join Slack Workspace" : "Complete Setup"}
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}

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
    <Card className="p-6 lg:p-7 space-y-6">
      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-bold text-foreground">Connected Services</h3>
        <p className="text-sm text-muted-foreground">Keep your onboarding tools in sync.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {integrations.map((integration) => (
          <div
            key={integration.name}
            className="flex h-full flex-col justify-between rounded-[24px] bg-primary/10 p-6 transition-shadow hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-white/80 p-3 shadow-sm">
                  {integration.icon}
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary/70">Onboarding Integration</p>
                  <h4 className="text-lg font-bold text-primary">{integration.name}</h4>
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

            <div className="mt-5 space-y-2.5">
              {integration.details.map((detail, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm text-primary/80">
                  <div className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                  <span>{detail}</span>
                </div>
              ))}
            </div>

            <div className="mt-6">
              {integration.status === "connected" ? (
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full bg-white/70 text-primary border-primary/30 hover:bg-white"
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
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full border-primary/30 bg-white/70 text-primary hover:bg-white"
                  onClick={integration.name === "Slack" ? handleJoinSlack : undefined}
                >
                  {integration.name === "Slack" ? "Join Slack Workspace" : "Complete Setup"}
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

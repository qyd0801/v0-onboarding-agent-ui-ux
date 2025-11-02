"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Loader2, CheckCircle, XCircle } from "lucide-react"

interface EmailTestPanelProps {
  employeeName?: string
  employeeEmail?: string
  managerEmail?: string
}

export function EmailTestPanel({ 
  employeeName = "Employee", 
  employeeEmail = "",
  managerEmail = ""
}: EmailTestPanelProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const [lastResult, setLastResult] = useState<{ success: boolean; message: string } | null>(null)

  const sendTestEmail = async (type: 'it' | 'hr' | 'manager') => {
    setLoading(type)
    setLastResult(null)

    try {
      const payload: any = {
        employee_name: employeeName,
        employee_email: employeeEmail,
        manager_email: managerEmail,
      }

      if (type === 'it') {
        payload.function_name = 'send_email_to_it'
        payload.parameters = {
          request_type: 'License Request',
          details: 'Need Adobe Creative Cloud license for design work',
          employee_name: employeeName,
        }
      } else if (type === 'hr') {
        payload.function_name = 'send_email_to_hr'
        payload.parameters = {
          question_type: 'Benefits',
          details: 'Question about health insurance coverage',
          employee_name: employeeName,
        }
      } else if (type === 'manager') {
        payload.function_name = 'send_email_to_manager'
        payload.parameters = {
          subject: 'Project Update',
          message: 'Need to discuss project timeline',
          employee_name: employeeName,
        }
      }

      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (response.ok) {
        setLastResult({
          success: true,
          message: `Email sent successfully to ${data.recipient}!`
        })
      } else {
        setLastResult({
          success: false,
          message: `Failed: ${data.error}`
        })
      }
    } catch (error) {
      setLastResult({
        success: false,
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      })
    } finally {
      setLoading(null)
    }
  }

  return (
    <Card className="p-6 lg:p-7 border border-border">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Mail className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-foreground">Email System Test</h3>
          <p className="text-sm text-muted-foreground">Test automated email functionality</p>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-6 p-4 bg-muted/50 rounded-lg">
        Test the automated email system. All emails will be sent to your Gmail.
      </p>

      <div className="grid sm:grid-cols-1 lg:grid-cols-3 gap-4">
        <Button
          onClick={() => sendTestEmail('it')}
          disabled={loading !== null}
          className="h-auto py-4 flex-col items-start text-left"
          variant="outline"
        >
          <div className="flex items-center gap-2 mb-1">
            {loading === 'it' ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Mail className="w-5 h-5" />
            )}
            <span className="font-bold">IT Support</span>
          </div>
          <span className="text-xs text-muted-foreground">License Request</span>
        </Button>

        <Button
          onClick={() => sendTestEmail('hr')}
          disabled={loading !== null}
          className="h-auto py-4 flex-col items-start text-left"
          variant="outline"
        >
          <div className="flex items-center gap-2 mb-1">
            {loading === 'hr' ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Mail className="w-5 h-5" />
            )}
            <span className="font-bold">HR Team</span>
          </div>
          <span className="text-xs text-muted-foreground">Benefits Question</span>
        </Button>

        <Button
          onClick={() => sendTestEmail('manager')}
          disabled={loading !== null}
          className="h-auto py-4 flex-col items-start text-left"
          variant="outline"
        >
          <div className="flex items-center gap-2 mb-1">
            {loading === 'manager' ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Mail className="w-5 h-5" />
            )}
            <span className="font-bold">Manager</span>
          </div>
          <span className="text-xs text-muted-foreground">Project Update</span>
        </Button>
      </div>

      {lastResult && (
        <div className={`mt-6 p-4 rounded-lg flex items-start gap-3 ${
          lastResult.success ? 'bg-green-500/10 text-green-600 border border-green-500/20' : 'bg-red-500/10 text-red-600 border border-red-500/20'
        }`}>
          {lastResult.success ? (
            <CheckCircle className="w-6 h-6 mt-0.5 flex-shrink-0" />
          ) : (
            <XCircle className="w-6 h-6 mt-0.5 flex-shrink-0" />
          )}
          <p className="text-sm font-medium">{lastResult.message}</p>
        </div>
      )}

      <div className="mt-6 p-4 bg-gradient-to-r from-accent/5 to-accent/10 border border-accent/20 rounded-lg">
        <p className="text-sm text-foreground">
          💡 <strong>Tip:</strong> Check your Gmail at <code className="bg-background px-2 py-1 rounded text-xs">kaikang0609@gmail.com</code> to see the emails!
        </p>
      </div>
    </Card>
  )
}


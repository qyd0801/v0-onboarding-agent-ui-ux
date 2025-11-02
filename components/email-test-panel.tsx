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
    <Card className="p-6 border border-border">
      <div className="flex items-center gap-2 mb-4">
        <Mail className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-bold text-foreground">Email System Test</h3>
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        Test the automated email system. All emails will be sent to your Gmail.
      </p>

      <div className="space-y-3">
        <Button
          onClick={() => sendTestEmail('it')}
          disabled={loading !== null}
          className="w-full justify-start"
          variant="outline"
        >
          {loading === 'it' ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Mail className="w-4 h-4 mr-2" />
          )}
          Send IT Support Email (License Request)
        </Button>

        <Button
          onClick={() => sendTestEmail('hr')}
          disabled={loading !== null}
          className="w-full justify-start"
          variant="outline"
        >
          {loading === 'hr' ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Mail className="w-4 h-4 mr-2" />
          )}
          Send HR Email (Benefits Question)
        </Button>

        <Button
          onClick={() => sendTestEmail('manager')}
          disabled={loading !== null}
          className="w-full justify-start"
          variant="outline"
        >
          {loading === 'manager' ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Mail className="w-4 h-4 mr-2" />
          )}
          Send Manager Email (Project Update)
        </Button>
      </div>

      {lastResult && (
        <div className={`mt-4 p-3 rounded-lg flex items-start gap-2 ${
          lastResult.success ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'
        }`}>
          {lastResult.success ? (
            <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          ) : (
            <XCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          )}
          <p className="text-sm">{lastResult.message}</p>
        </div>
      )}

      <div className="mt-4 p-3 bg-muted rounded-lg">
        <p className="text-xs text-muted-foreground">
          💡 <strong>Tip:</strong> Check your Gmail at kaikang0609@gmail.com to see the emails!
        </p>
      </div>
    </Card>
  )
}


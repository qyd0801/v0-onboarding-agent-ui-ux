"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MessageCircle, Send, Loader2 } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

interface TextChatbotProps {
  employeeName?: string
  employeeEmail?: string
  managerEmail?: string
}

export function TextChatbot({ 
  employeeName = "Employee", 
  employeeEmail = "",
  managerEmail = ""
}: TextChatbotProps = {}) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm your AI onboarding assistant. I can help answer questions and automatically send emails to IT, HR, or your manager.\n\n💡 Try: \"I need Adobe license\" or \"Ask HR about benefits\"",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Check if message needs email action
  const detectEmailIntent = (message: string): { type: 'it' | 'hr' | 'manager' | null; details: string } => {
    const lowerMessage = message.toLowerCase()
    
    // IT Support patterns
    const itPatterns = [
      'need', 'license', 'access', 'software', 'adobe', 'figma', 'slack',
      'install', 'setup', 'technical', 'computer', 'laptop', 'password'
    ]
    
    // HR patterns
    const hrPatterns = [
      'hr', 'human resources', 'benefits', 'insurance', 'health', 'vacation',
      'time off', 'policy', 'leave', 'payroll', 'salary'
    ]
    
    // Manager patterns
    const managerPatterns = [
      'manager', 'supervisor', 'boss', 'tell my manager', 'let manager know',
      'inform manager', 'notify manager'
    ]
    
    if (managerPatterns.some(pattern => lowerMessage.includes(pattern))) {
      return { type: 'manager', details: message }
    }
    
    if (hrPatterns.some(pattern => lowerMessage.includes(pattern))) {
      return { type: 'hr', details: message }
    }
    
    if (itPatterns.some(pattern => lowerMessage.includes(pattern))) {
      return { type: 'it', details: message }
    }
    
    return { type: null, details: '' }
  }

  const sendEmail = async (type: 'it' | 'hr' | 'manager', details: string) => {
    try {
      const payload: any = {
        employee_name: employeeName,
        employee_email: employeeEmail,
        manager_email: managerEmail,
      }

      if (type === 'it') {
        payload.function_name = 'send_email_to_it'
        payload.parameters = {
          request_type: 'License/Access Request',
          details: details,
          employee_name: employeeName,
        }
      } else if (type === 'hr') {
        payload.function_name = 'send_email_to_hr'
        payload.parameters = {
          question_type: 'General Question',
          details: details,
          employee_name: employeeName,
        }
      } else if (type === 'manager') {
        payload.function_name = 'send_email_to_manager'
        payload.parameters = {
          subject: 'Message from Employee',
          message: details,
          employee_name: employeeName,
        }
      }

      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()
      return { success: response.ok, data }
    } catch (error) {
      return { success: false, error }
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    const userInput = input
    setInput("")
    setIsLoading(true)

    try {
      // Check if message needs email action
      const emailIntent = detectEmailIntent(userInput)
      
      // Send email if detected
      if (emailIntent.type) {
        const emailResult = await sendEmail(emailIntent.type, emailIntent.details)
        
        if (emailResult.success) {
          const dept = emailIntent.type === 'it' ? 'IT Support' : 
                       emailIntent.type === 'hr' ? 'HR Team' : 'your manager'
          
          const confirmMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: `✅ I've sent your request to ${dept}! They typically respond within 24 hours. Your email was sent to ${emailResult.data.recipient}.`,
          }
          setMessages((prev) => [...prev, confirmMessage])
          setIsLoading(false)
          return
        }
      }

      // If no email or email failed, get AI response
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: messages.concat(userMessage),
          employeeName,
          employeeEmail,
          managerEmail,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response || data.text || "Sorry, I could not process that.",
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="p-6 border border-border flex flex-col h-96">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border">
        <MessageCircle className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-bold text-foreground">Text Chat Assistant</h3>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
              }`}
            >
              <p className="text-sm">{message.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted text-foreground px-4 py-2 rounded-lg flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <p className="text-sm">Thinking...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything..."
          disabled={isLoading}
          className="bg-input border-border flex-1"
        />
        <Button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
          size="icon"
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </Card>
  )
}


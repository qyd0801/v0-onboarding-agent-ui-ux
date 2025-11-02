"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageCircle, Video } from "lucide-react"
import { TextChatbot } from "./text-chatbot"
import { AnamAvatarChatbot } from "./anam-avatar-chatbot"

interface DualChatbotInterfaceProps {
  employeeName?: string
  employeeEmail?: string
  managerEmail?: string
}

export function DualChatbotInterface({ 
  employeeName, 
  employeeEmail,
  managerEmail 
}: DualChatbotInterfaceProps) {
  const [mode, setMode] = useState<'text' | 'avatar'>('text')

  return (
    <div className="space-y-6">
      {/* Mode Selector */}
      <Card className="p-4 lg:p-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-foreground mb-1">AI Assistant</h3>
            <p className="text-sm text-muted-foreground">Choose your preferred interaction mode</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant={mode === 'text' ? 'default' : 'outline'}
              onClick={() => setMode('text')}
              className={`flex items-center gap-2 px-6 h-10 ${
                mode === 'text' 
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md' 
                  : 'text-foreground hover:bg-muted/60'
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              Text Chat
            </Button>
            
            <Button
              variant={mode === 'avatar' ? 'default' : 'outline'}
              onClick={() => setMode('avatar')}
              className={`flex items-center gap-2 px-6 h-10 ${
                mode === 'avatar' 
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md' 
                  : 'text-foreground hover:bg-muted/60'
              }`}
            >
              <Video className="w-4 h-4" />
              Voice Avatar
            </Button>
          </div>
        </div>
      </Card>

      {/* Chatbot Display */}
      {mode === 'text' ? (
        <TextChatbot 
          employeeName={employeeName}
          employeeEmail={employeeEmail}
          managerEmail={managerEmail}
        />
      ) : (
        <AnamAvatarChatbot 
          employeeName={employeeName}
          employeeEmail={employeeEmail}
          managerEmail={managerEmail}
        />
      )}
    </div>
  )
}


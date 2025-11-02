"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Video, StopCircle, Loader2, PauseCircle, PlayCircle, Zap } from "lucide-react"

interface AnamAvatarChatbotProps {
  employeeName?: string
  employeeEmail?: string
  managerEmail?: string
}

export function AnamAvatarChatbot({ 
  employeeName = "Employee", 
  employeeEmail = "",
  managerEmail = ""
}: AnamAvatarChatbotProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [status, setStatus] = useState<'initializing' | 'connecting' | 'connected' | 'speaking' | 'paused' | 'stopped' | 'error'>('initializing')
  const [statusText, setStatusText] = useState('Initializing...')
  const [anamClient, setAnamClient] = useState<any>(null)
  const [showMicToast, setShowMicToast] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    initAnamChatbot()
    
    return () => {
      // Cleanup on unmount
      if (anamClient) {
        try {
          anamClient.stopStreaming()
        } catch (e) {
          console.log('Cleanup error:', e)
        }
      }
    }
  }, [])

  const initAnamChatbot = async () => {
    try {
      // Import Anam SDK
      const { createClient } = await import('@anam-ai/js-sdk')

      setStatus('connecting')
      setStatusText('Connecting to AI assistant...')
      setShowMicToast(true)

      // Create session token with persona configuration
      const sessionToken = await createSessionToken()

      // Create Anam client
      const client = createClient(sessionToken)

      // Register function calling handler
      console.log('🔧 Registering function call handler...')
      client.addListener('functionCall', handleFunctionCall)
      console.log('✅ Function call handler registered!')

      // Listen to connection events
      client.addListener('connectionStateChanged', (state: string) => {
        console.log('Connection state:', state)
        if (state === 'connected') {
          setStatus('connected')
          setStatusText('Ready to chat!')
          setShowMicToast(false)
        } else if (state === 'disconnected') {
          setStatus('stopped')
          setStatusText('Disconnected')
        }
      })

      // Listen to persona speaking events
      client.addListener('personaStartedSpeaking', () => {
        setStatus('speaking')
        setStatusText('Assistant is speaking...')
      })

      client.addListener('personaStoppedSpeaking', () => {
        if (!isPaused) {
          setStatus('connected')
          setStatusText('Ready to chat!')
        }
      })

      // Listen for errors
      client.addListener('error', (error: any) => {
        console.error('Anam error:', error)
        setStatus('error')
        setStatusText(`Error: ${error.message}`)
      })

      // Stream video to video element
      if (videoRef.current) {
        await client.streamToVideoElement('anam-video')
      }

      setAnamClient(client)

    } catch (error) {
      console.error('Failed to start Anam chat:', error)
      setStatus('error')
      setStatusText('Failed to initialize AI assistant')
    }
  }

  const createSessionToken = async () => {
    const API_KEY = process.env.NEXT_PUBLIC_ANAM_API_KEY || 'NDYwOTNkNjctODE2Zi00MjVlLWE5YjktNGI1NDA5NmUyZmQ4OlUyKy80QWhnS29GcUIySUdzOGNHOVF1RWdERmhhNGsrK3k1L1B3dE9KZXM9'
    const KNOWLEDGE_FOLDER_ID = process.env.NEXT_PUBLIC_ANAM_KNOWLEDGE_FOLDER_ID || '43eb9afc-86cc-474e-b856-54da9ab6ca8b'
    
    const personaConfig = {
      type: "ephemeral",
      name: "RaspberryCoffeeOnboardingAssistant",
      avatarId: process.env.NEXT_PUBLIC_ANAM_AVATAR_ID || "30fa96d0-26c4-4e55-94a0-517025942e18",
      voiceId: process.env.NEXT_PUBLIC_ANAM_VOICE_ID || "6bfbe25a-979d-40f3-a92b-5394170af54b",
      llmId: process.env.NEXT_PUBLIC_ANAM_LLM_ID || "0934d97d-0c3a-4f33-91b0-5e136a0ef466",
      knowledgeFolderId: KNOWLEDGE_FOLDER_ID,
      systemPrompt: `You are the onboarding assistant for Raspberry Coffee, a design-led technology company.

ABOUT RASPBERRY COFFEE:
We create beautifully intuitive, human-centered technology. Our tagline: "Design-led technology that enriches life without complicating it."

KEY PRODUCTS: Raspberry Handheld (smartphone), Raspberry Slate (laptop), Raspberry Watch, Bloom OS
MAJOR PROJECTS: Project Nova, Aurora Design System, Platform Re-Architecture

CURRENT EMPLOYEE:
Name: ${employeeName}
Email: ${employeeEmail}
Manager: ${managerEmail || 'Not assigned'}

[CRITICAL - FUNCTION CALLING RULES]
You MUST use function calls for requests needing action. NEVER say you sent an email unless you called the function!

REQUIRED function calls:
- License/software/IT → CALL send_email_to_it
- HR/benefits/policy → CALL send_email_to_hr
- Manager messages → CALL send_email_to_manager

Examples: "I need Figma license" → CALL send_email_to_it NOW

[YOUR ROLE]
- Answer questions about Raspberry Coffee, products, projects
- Help with Aurora Design System questions (GitHub: https://github.com/JieHan-eng/aurora-design-system)
- Call functions for license requests, IT support, HR questions
- Provide info about team members and departments

[SPEAKING STYLE]
- Concise (under 50 words unless explaining)
- Natural, conversational
- Warm and helpful
- ONLY confirm email AFTER calling function

Use the knowledge folder for detailed company information.`,
      maxSessionLengthSeconds: 1800,
      functions: [
        {
          name: "send_email_to_it",
          description: "Send email to IT support for license requests, software access, or technical issues",
          parameters: {
            type: "object",
            properties: {
              request_type: {
                type: "string",
                description: "Type of request (e.g., 'License Request', 'Access Request', 'Technical Issue')"
              },
              details: {
                type: "string",
                description: "Detailed description of what the employee needs"
              },
              employee_name: {
                type: "string",
                description: "Name of the employee making the request"
              }
            },
            required: ["request_type", "details", "employee_name"]
          }
        },
        {
          name: "send_email_to_hr",
          description: "Send email to HR for policy questions, benefits inquiries, or general HR matters",
          parameters: {
            type: "object",
            properties: {
              question_type: {
                type: "string",
                description: "Type of question (e.g., 'Benefits', 'Policy', 'Time Off')"
              },
              details: {
                type: "string",
                description: "Detailed description of the question or issue"
              },
              employee_name: {
                type: "string",
                description: "Name of the employee asking"
              }
            },
            required: ["question_type", "details", "employee_name"]
          }
        },
        {
          name: "send_email_to_manager",
          description: "Send email to the employee's manager",
          parameters: {
            type: "object",
            properties: {
              subject: {
                type: "string",
                description: "Subject of the message"
              },
              message: {
                type: "string",
                description: "The message content"
              },
              employee_name: {
                type: "string",
                description: "Name of the employee"
              }
            },
            required: ["subject", "message", "employee_name"]
          }
        }
      ]
    }

    console.log('📡 Creating Anam session with config:', {
      ...personaConfig,
      systemPrompt: personaConfig.systemPrompt.substring(0, 100) + '...',
      functions: personaConfig.functions.map((f: any) => f.name)
    })

    const response = await fetch('https://api.anam.ai/v1/auth/session-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({ personaConfig }),
    })

    console.log('📡 Session response status:', response.status)

    if (!response.ok) {
      const error = await response.text()
      console.error('❌ Session creation failed:', error)
      throw new Error(`Failed to create session (${response.status}): ${error}`)
    }

    const data = await response.json()
    console.log('✅ Session created successfully with token:', data.sessionToken?.substring(0, 20) + '...')
    return data.sessionToken
  }

  const handleFunctionCall = async (functionCall: any) => {
    console.log('🎯 Function called by Anam:', functionCall)
    console.log('📧 Function name:', functionCall.name)
    console.log('📝 Parameters:', functionCall.arguments)
    console.log('👤 Employee context:', { employeeName, employeeEmail, managerEmail })

    try {
      const payload = {
        function_name: functionCall.name,
        parameters: functionCall.arguments,
        employee_name: employeeName,
        employee_email: employeeEmail,
        manager_email: managerEmail,
      }
      
      console.log('📤 Sending to /api/send-email:', payload)

      // Call our email API
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      console.log('📨 Response status:', response.status)

      const data = await response.json()
      console.log('📬 Response data:', data)

      if (response.ok) {
        console.log('✅ Email sent successfully:', data)
        alert(`✅ Email sent successfully to ${data.recipient}!`) // Visual confirmation
        // Return success to Anam
        return {
          success: true,
          message: `Email sent to ${data.recipient}`,
        }
      } else {
        console.error('❌ Email sending failed:', data)
        alert(`❌ Email failed: ${data.error}`) // Visual error
        return {
          success: false,
          error: data.error,
        }
      }
    } catch (error) {
      console.error('💥 Error handling function call:', error)
      alert(`💥 Error: ${error}`) // Visual error
      return {
        success: false,
        error: 'Failed to process request',
      }
    }
  }

  const handleStop = async () => {
    if (anamClient) {
      try {
        await anamClient.stopStreaming()
        setStatus('stopped')
        setStatusText('Conversation stopped')
      } catch (error) {
        console.error('Error stopping:', error)
      }
    }
  }

  const handleInterrupt = async () => {
    if (!anamClient) return
    try {
      if (typeof anamClient.interrupt === 'function') {
        await anamClient.interrupt()
      } else if (typeof anamClient.sendCommand === 'function') {
        await anamClient.sendCommand({ type: 'interrupt' })
      } else if (typeof anamClient.command === 'function') {
        await anamClient.command('interrupt')
      } else {
        console.warn('Interrupt command not supported on client')
      }
      setStatus('connected')
      setStatusText('Interrupted. Listening...')
    } catch (error) {
      console.error('Error interrupting:', error)
    }
  }

  const handleTogglePause = async () => {
    if (!anamClient) return
    try {
      if (!isPaused) {
        if (typeof anamClient.pause === 'function') {
          await anamClient.pause()
        } else if (typeof anamClient.sendCommand === 'function') {
          await anamClient.sendCommand({ type: 'pause' })
        } else if (typeof anamClient.command === 'function') {
          await anamClient.command('pause')
        } else {
          console.warn('Pause command not supported on client')
        }
        setIsPaused(true)
        setStatus('paused')
        setStatusText('Paused')
      } else {
        if (typeof anamClient.resume === 'function') {
          await anamClient.resume()
        } else if (typeof anamClient.sendCommand === 'function') {
          await anamClient.sendCommand({ type: 'resume' })
        } else if (typeof anamClient.command === 'function') {
          await anamClient.command('resume')
        } else {
          console.warn('Resume command not supported on client')
        }
        setIsPaused(false)
        setStatus('connected')
        setStatusText('Ready to chat!')
      }
    } catch (error) {
      console.error('Error toggling pause:', error)
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'connected':
        return 'bg-green-500'
      case 'speaking':
        return 'bg-blue-500'
      case 'paused':
        return 'bg-yellow-500'
      case 'stopped':
        return 'bg-red-500'
      case 'error':
        return 'bg-red-500'
      default:
        return 'bg-yellow-500'
    }
  }

  return (
    <Card className="p-6 border border-border flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Video className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-bold text-foreground">AI Avatar Assistant</h3>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Status Indicator */}
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${getStatusColor()} animate-pulse`} />
            <span className="text-xs text-muted-foreground">{statusText}</span>
          </div>
          
          {/* Controls */}
          <div className="flex items-center gap-2">
            {/* Interrupt Button */}
            {(status === 'speaking' || status === 'connected') && !isPaused && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleInterrupt}
                className="h-8 border-border"
                title="Interrupt assistant and start talking"
              >
                <Zap className="w-4 h-4 mr-1" />
                Interrupt
              </Button>
            )}

            {/* Pause/Resume Button */}
            {status !== 'stopped' && status !== 'error' && (
              <Button
                size="sm"
                variant="secondary"
                onClick={handleTogglePause}
                className="h-8"
                title={isPaused ? 'Resume call' : 'Pause call'}
              >
                {isPaused ? (
                  <>
                    <PlayCircle className="w-4 h-4 mr-1" />
                    Resume
                  </>
                ) : (
                  <>
                    <PauseCircle className="w-4 h-4 mr-1" />
                    Pause
                  </>
                )}
              </Button>
            )}

            {/* Stop Button */}
            {status !== 'stopped' && status !== 'error' && (
              <Button
                size="sm"
                variant="destructive"
                onClick={handleStop}
                className="h-8"
              >
                <StopCircle className="w-4 h-4 mr-1" />
                Stop
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Video Container (16:9) */}
      <div className="relative w-full bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
        <video
          id="anam-video"
          ref={videoRef}
          autoPlay
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* Microphone Toast */}
        {showMicToast && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-full text-sm flex items-center gap-2 backdrop-blur-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Allow microphone access when prompted</span>
          </div>
        )}

        {/* Loading State */}
        {(status === 'initializing' || status === 'connecting') && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-center text-white">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-3" />
              <p>{statusText}</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {status === 'error' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80">
            <div className="text-center text-white p-6">
              <p className="mb-4">{statusText}</p>
              <Button onClick={initAnamChatbot} variant="secondary">
                Retry
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Helper Text */}
      {status === 'connected' && (
        <div className="mt-3 text-xs text-muted-foreground text-center">
          💬 Just start speaking - I'm listening!
        </div>
      )}
    </Card>
  )
}


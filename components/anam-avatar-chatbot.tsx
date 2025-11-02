"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StopCircle, Loader2, PlayCircle } from "lucide-react"

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
  const [status, setStatus] = useState<'initializing' | 'connecting' | 'connected' | 'speaking' | 'stopped' | 'error'>('initializing')
  const [statusText, setStatusText] = useState('Initializing...')
  const [anamClient, setAnamClient] = useState<any>(null)
  const [showMicToast, setShowMicToast] = useState(false)

  useEffect(() => {
    initAnamChatbot()

    return () => {
      if (anamClient) {
        teardownClient(anamClient)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const teardownClient = async (client: any) => {
    try {
      await client.stopStreaming()
    } catch (error) {
      console.error('Anam stop error:', error)
    }

    try {
      client.removeAllListeners?.()
    } catch (error) {
      console.error('Anam remove listeners error:', error)
    }

    try {
      client.destroy?.()
    } catch (error) {
      console.error('Anam destroy error:', error)
    }
  }

  const initAnamChatbot = async () => {
    try {
      // Import Anam SDK
      const { createClient } = await import('@anam-ai/js-sdk')

      setStatus('connecting')
      setStatusText('Connecting to AI assistant...')
      setShowMicToast(true)

      if (anamClient) {
        await teardownClient(anamClient)
        setAnamClient(null)
      }

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
        setStatus('connected')
        setStatusText('Ready to chat!')
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
      avatarId: process.env.NEXT_PUBLIC_ANAM_AVATAR_ID || "5282b930-c682-4eda-95a9-568ebd4f31a1",
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
          description: "Send email to IT support when user requests licenses (e.g., Figma, Adobe), software access, hardware setup, technical support, or reports technical issues. Use this when employee needs IT assistance or access to tools.",
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
          description: "Send email to HR when user asks about benefits, insurance, vacation policies, time off requests, company policies, payroll questions, or any human resources matters. Use this for policy questions and HR inquiries.",
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
          description: "Send email to the employee's manager when user wants to communicate with their manager, request time off, discuss work-related matters, or needs manager approval or notification. Use this when employee explicitly mentions manager or wants to talk to their supervisor.",
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
    if (!anamClient) {
      return
    }

    await teardownClient(anamClient)
    setAnamClient(null)
    setStatus('stopped')
    setStatusText('Conversation stopped')
    setShowMicToast(false)
  }

  

  const showStopButton = status !== 'stopped' && status !== 'error'

  return (
    <Card className="relative overflow-hidden p-0 gap-0 aspect-[16/9]">
      <video
        id="anam-video"
        ref={videoRef}
        autoPlay
        playsInline
        className="h-full w-full object-cover"
      />

      {/* Microphone Toast */}
      {showMicToast && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 transform bg-black/80 text-white px-5 py-3 rounded-full text-sm flex items-center gap-3 backdrop-blur-md shadow-lg">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Allow microphone access when prompted</span>
        </div>
      )}

      {/* Error State */}
      {status === 'error' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/85 backdrop-blur-sm">
          <div className="text-center text-white p-6 space-y-4">
            <div className="text-red-300 text-lg font-medium">{statusText}</div>
            <Button onClick={initAnamChatbot} size="sm" variant="secondary" className="mx-auto">
              Retry Connection
            </Button>
          </div>
        </div>
      )}

      {/* Stop action */}
      {showStopButton && (
        <Button
          size="icon"
          variant="ghost"
          onClick={handleStop}
          aria-label="Stop voice avatar"
          className="absolute bottom-4 right-4 rounded-full bg-[#13544E] text-white shadow-lg hover:bg-[#0f3f3a]"
        >
          <StopCircle className="size-5" />
        </Button>
      )}

      {status === 'stopped' && (
        <Button
          size="icon"
          variant="ghost"
          onClick={initAnamChatbot}
          aria-label="Restart voice avatar"
          className="absolute bottom-4 right-4 rounded-full bg-[#13544E] text-white shadow-lg hover:bg-[#0f3f3a]"
        >
          <PlayCircle className="size-5" />
        </Button>
      )}
    </Card>
  )
}


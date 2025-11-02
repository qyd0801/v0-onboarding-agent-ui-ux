import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

// Knowledge base for the chatbot
const KNOWLEDGE_BASE = `You are an AI onboarding assistant for Raspberry Coffee, a design-led technology company.

COMPANY OVERVIEW:
Raspberry Coffee creates beautifully intuitive, human-centered technology that empowers creativity and fosters connection.
Tagline: "Design-led technology that enriches life without complicating it"
Website: www.raspberry-coffee.com

CORE VALUES:
1. Simplicity is the ultimate sophistication
2. Privacy is a human right
3. Deeply integrated, not merely connected
4. Craft in every detail

PRODUCTS & ECOSYSTEM:
- Raspberry Handheld: Flagship smartphone with minimalist design
- Raspberry Slate: Laptop/desktop hybrid with haptic keyboard
- Raspberry Watch: Health and wellness companion
- Raspberry Buds & Beats: Premium wireless audio
- Bloom OS: Clean, minimalist operating system
- Raspberry Connect: Secure cloud service (end-to-end encrypted)
- Raspberry Arcade: Premium, ad-free games
- Raspberry Stream: Original creative content

KEY PROJECTS (FY25):
1. Project Nova: Raspberry Handheld 4 & Bloom OS 4.0 with "Mocha" chip
2. The Aurora Design System: Company-wide design language
3. Platform Re-Architecture with "Bean" chipset family
4. Health & Wellness Initiatives: Advanced Raspberry Watch features
5. Enterprise & Education Expansion
6. SOC2 Readiness & Privacy Infrastructure

THE AURORA DESIGN SYSTEM:
- GitHub: https://github.com/JieHan-eng/aurora-design-system
- Purpose: Next-gen design framework for cohesive, accessible experience
- Tech Stack: Figma + React components, design tokens, Storybook documentation
- Goals: Unify visuals, build responsive components, automated accessibility testing
- Team Lead: Rania Boutros (UX Lead) - rania.boutros@raspberry-coffee.com
- Project Manager: Marta Kowalska - marta.kowalska@raspberry-coffee.com
- Monorepo with pnpm + Turborepo
- Key packages: tokens, themes, components-react, icons, a11y

EXECUTIVE TEAM:
- CEO: Amelia Carter (amelia.carter@raspberry-coffee.com)
- CTO: Ravi Shah (ravi.shah@raspberry-coffee.com)
- CPO: Lena Müller (lena.mueller@raspberry-coffee.com)
- COO: Marcus O'Connor (marcus.oconnor@raspberry-coffee.com)
- CFO: Sophia Rossi (sophia.rossi@raspberry-coffee.com)
- Head of People: Daniel Okafor (daniel.okafor@raspberry-coffee.com)

DEPARTMENTS:
- Engineering: Platform, Applications, Data teams
- Product: Core Product, Growth, UX
- Sales: EMEA, NA, Sales Operations
- HR: Business Partners, Recruiting, People Ops
- Finance: FP&A, Accounting
- Operations: IT, Workplace

IT SUPPORT:
- Email: peter.adams@raspberry-coffee.com (IT Manager)
- Team: Aisha Bello (Systems Admin), Peter Adams
- Services: Endpoints, SSO, Device Management

HR CONTACT:
- Email: daniel.okafor@raspberry-coffee.com (Head of People)
- Team: Olivera Jovanović (HRBP), Jack Wilson (Recruiting), Fatima Khan (People Ops)

AURORA DESIGN SYSTEM WORKFLOW:
- Git branches: feature/<name>, fix/<id>, docs/<scope>
- Conventional Commits style
- pnpm commands: dev (Storybook), test, build, lint
- PR template includes context, screenshots, a11y notes
- Quality gates: type checks, unit tests, visual regression, a11y checks

DEVELOPMENT SETUP:
- Node LTS with pnpm ≥ 9
- VS Code with ESLint, Prettier extensions
- Commands: pnpm i, pnpm build, pnpm dev, pnpm test

ONBOARDING TIMELINE (30/60/90 days):
- Days 0-30: Learn foundational components (Button, Tag)
- Days 31-60: Responsive helpers, automation
- Days 61-90: Own complex components, contribute to minor release

Always be helpful, friendly, and professional. Keep responses concise and actionable.`

export async function POST(req: Request) {
  try {
    const { messages, employeeName, employeeEmail, managerEmail } = await req.json()

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY is not set in environment variables")
      return new Response(
        JSON.stringify({ 
          error: "OpenAI API key is not configured. Please add OPENAI_API_KEY to your .env.local file.",
          details: "Missing OPENAI_API_KEY environment variable"
        }), 
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      )
    }

    // Format messages for the AI model
    const formattedMessages = messages.map((msg: { role: string; content: string }) => ({
      role: msg.role,
      content: msg.content,
    }))

    // Generate response using OpenAI via Vercel AI SDK
    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      system: KNOWLEDGE_BASE,
      messages: formattedMessages,
      temperature: 0.7,
      maxTokens: 500,
    })

    return new Response(JSON.stringify({ response: text }), {
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Error processing chat request:", error)
    return new Response(
      JSON.stringify({ 
        error: "An error occurred while processing your request.",
        details: error instanceof Error ? error.message : "Unknown error"
      }), 
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    )
  }
}

// Alternative version with working function calling (commented out for now)
/*
async function generateWithTools(messages: any[], context: any) {
  const { text } = await generateText({
    model: openai("gpt-4o-mini"),
    system: KNOWLEDGE_BASE,
    messages,
    temperature: 0.7,
    maxTokens: 500,
    tools: {
        send_email_to_it: {
          description: "Send email to IT support for license requests, software access, or technical issues",
          parameters: z.object({
            request_type: z.string().describe("Type of request (e.g., 'License Request', 'Access Request', 'Technical Issue')"),
            details: z.string().describe("Detailed description of what the employee needs"),
            employee_name: z.string().describe("Name of the employee making the request"),
          }),
          execute: async ({ request_type, details, employee_name }) => {
            try {
              // Call the email API
              const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/send-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  function_name: 'send_email_to_it',
                  parameters: { request_type, details, employee_name },
                  employee_name: employeeName || employee_name,
                  employee_email: employeeEmail || 'employee@raspberry-coffee.com',
                  manager_email: managerEmail,
                }),
              })
              
              const data = await response.json()
              return data.success ? `Email sent to IT Support successfully` : `Failed to send email: ${data.error}`
            } catch (error) {
              console.error('Error sending email to IT:', error)
              return `Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}`
            }
          },
        },
        send_email_to_hr: {
          description: "Send email to HR for policy questions, benefits inquiries, or general HR matters",
          parameters: z.object({
            question_type: z.string().describe("Type of question (e.g., 'Benefits', 'Policy', 'Time Off')"),
            details: z.string().describe("Detailed description of the question or issue"),
            employee_name: z.string().describe("Name of the employee asking"),
          }),
          execute: async ({ question_type, details, employee_name }) => {
            try {
              const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/send-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  function_name: 'send_email_to_hr',
                  parameters: { question_type, details, employee_name },
                  employee_name: employeeName || employee_name,
                  employee_email: employeeEmail || 'employee@raspberry-coffee.com',
                  manager_email: managerEmail,
                }),
              })
              
              const data = await response.json()
              return data.success ? `Email sent to HR successfully` : `Failed to send email: ${data.error}`
            } catch (error) {
              console.error('Error sending email to HR:', error)
              return `Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}`
            }
          },
        },
        send_email_to_manager: {
          description: "Send email to the employee's manager",
          parameters: z.object({
            subject: z.string().describe("Subject of the message"),
            message: z.string().describe("The message content"),
            employee_name: z.string().describe("Name of the employee"),
          }),
          execute: async ({ subject, message, employee_name }) => {
            try {
              const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/send-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  function_name: 'send_email_to_manager',
                  parameters: { subject, message, employee_name },
                  employee_name: employeeName || employee_name,
                  employee_email: employeeEmail || 'employee@raspberry-coffee.com',
                  manager_email: managerEmail || 'manager@raspberry-coffee.com',
                }),
              })
              
              const data = await response.json()
              return data.success ? `Email sent to manager successfully` : `Failed to send email: ${data.error}`
            } catch (error) {
              console.error('Error sending email to manager:', error)
              return `Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}`
            }
          },
        },
      },
  })
  return text
}
*/

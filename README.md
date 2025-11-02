# AI-Powered Employee Onboarding Platform

An intelligent onboarding system that combines HR management, employee portal, and AI-powered assistance with automated email routing.

## 🌟 Features

### For HR Administrators
- **Quick Employee Registration**: Create new employee profiles with essential information
- **Real-time Dashboard**: View all onboarded employees and their status
- **Automatic Provisioning**: Employee credentials are instantly ready for use

### For New Employees
- **Personalized Portal**: Login with HR-created credentials
- **Interactive Onboarding Checklist**: Track progress through onboarding tasks
- **Integration Overview**: View connected services (Slack, GitHub, etc.)
- **AI Assistant**: Get help through text or video avatar chat

### AI-Powered Email Automation
- **Voice-Activated Avatar**: Talk naturally with an AI avatar
- **Intelligent Routing**: AI automatically sends emails to the right department
- **Context-Aware**: Understands license requests, HR questions, and manager communications
- **No Manual Process**: Employees simply ask, AI handles the rest

## 🛠 Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Custom authentication with Supabase
- **Email**: Resend API
- **AI**: Anam AI with GPT-4.1 and function calling
- **UI Components**: Radix UI with custom styling

## 📋 Prerequisites

- Node.js 18+ and pnpm
- Supabase account
- Resend account
- Anam AI API access

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Run this SQL in the SQL Editor:

```sql
CREATE TABLE employees (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  project TEXT NOT NULL,
  manager_email TEXT,
  onboarding_status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations" ON employees
FOR ALL USING (true) WITH CHECK (true);
```

3. Get your credentials from **Settings** → **API**

### 3. Set Up Resend

1. Create account at [resend.com](https://resend.com)
2. Create an API key in the dashboard
3. (Optional) Add and verify your domain

### 4. Configure Environment Variables

Create `.env.local` file:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Resend
RESEND_API_KEY=your_resend_api_key

# Anam AI (provided)
NEXT_PUBLIC_ANAM_API_KEY=NDYwOTNkNjctODE2Zi00MjVlLWE5YjktNGI1NDA5NmUyZmQ4OlUyKy80QWhnS29GcUIySUdzOGNHOVF1RWdERmhhNGsrK3k1L1B3dE9KZXM9
NEXT_PUBLIC_ANAM_KNOWLEDGE_FOLDER_ID=befa776a-c557-4846-b33b-620811e11327
NEXT_PUBLIC_ANAM_AVATAR_ID=30fa96d0-26c4-4e55-94a0-517025942e18
NEXT_PUBLIC_ANAM_VOICE_ID=6bfbe25a-979d-40f3-a92b-5394170af54b
NEXT_PUBLIC_ANAM_LLM_ID=0934d97d-0c3a-4f33-91b0-5e136a0ef466
```

### 5. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📖 Usage

### Creating an Employee (HR)

1. Click "Admin Dashboard"
2. Fill in the employee form
3. Click "Create Employee Profile"
4. Employee is added to database and can immediately log in

### Employee Login

1. Use email and password created by HR
2. Access personalized dashboard
3. View onboarding checklist and integrations
4. Chat with AI assistant

### Using AI Avatar

1. Click "Avatar" button in chatbot section
2. Allow microphone access
3. Wait for green "Ready to chat!" status
4. Speak naturally:
   - "I need access to Adobe Creative Cloud"
   - "I have a question about vacation policy"
   - "How do I contact my manager?"
5. AI automatically sends emails to appropriate department

## 🏗 Architecture

### API Routes

```
/api
├── employees/create    → Create new employee in database
├── auth/login         → Authenticate employee
├── send-email         → Send automated emails (called by Anam AI)
└── chat               → Text chatbot endpoint
```

### Components

```
components/
├── employee-auth/
│   └── login-form.tsx              → Employee login
├── hr-onboarding-dashboard.tsx     → HR admin interface
├── employee-dashboard.tsx          → Employee portal
├── dual-chatbot-interface.tsx      → Chat mode switcher
├── text-chatbot.tsx                → Text-based chat
├── anam-avatar-chatbot.tsx         → AI avatar with email automation
├── onboarding-checklist.tsx        → Task tracking
└── integrations-panel.tsx          → Connected services
```

### Database Schema

```
employees
├── id (UUID)
├── email (TEXT, UNIQUE)
├── password (TEXT)
├── name (TEXT)
├── role (TEXT)
├── project (TEXT)
├── manager_email (TEXT, optional)
├── onboarding_status (TEXT)
└── created_at (TIMESTAMP)
```

## 🎯 Key Features Explained

### Function Calling

Anam AI uses function calling to detect when employees need help:

```typescript
functions: [
  {
    name: "send_email_to_it",
    description: "Send email to IT support for licenses/access",
    parameters: { request_type, details, employee_name }
  },
  {
    name: "send_email_to_hr",
    description: "Send email to HR for policies/benefits",
    parameters: { question_type, details, employee_name }
  },
  {
    name: "send_email_to_manager",
    description: "Send email to employee's manager",
    parameters: { subject, message, employee_name }
  }
]
```

When employee speaks a request, Anam AI:
1. Understands the intent
2. Extracts relevant details
3. Calls the appropriate function
4. API sends email via Resend
5. Confirms to employee

### Email Routing

| Employee Request | AI Detects | Emails To |
|-----------------|------------|-----------|
| "I need a license" | send_email_to_it | it-support@raspberry-coffee.com |
| "Vacation policy question" | send_email_to_hr | hr@raspberry-coffee.com |
| "Talk to my manager" | send_email_to_manager | employee.manager_email |

## 📚 Documentation

- [Setup Instructions](./SETUP_INSTRUCTIONS.md) - Detailed setup guide
- [Demo Guide](./DEMO_GUIDE.md) - Live demo presentation script
- [Anam AI Docs](https://docs.anam.ai) - Anam AI documentation

## 🔐 Security Notes

⚠️ **This is a demo application with simplified security**

For production, implement:
- Password hashing (bcrypt)
- JWT authentication
- Environment variable validation
- Input sanitization
- Rate limiting
- CORS configuration
- Secure headers

## 🎨 Customization

### Change AI Avatar
Update `.env.local`:
```bash
NEXT_PUBLIC_ANAM_AVATAR_ID=new_avatar_id
```
Browse avatars: [Anam Avatar Gallery](https://docs.anam.ai/resources/avatar-gallery)

### Change AI Voice
Update `.env.local`:
```bash
NEXT_PUBLIC_ANAM_VOICE_ID=new_voice_id
```
Browse voices: [Anam Voice Gallery](https://docs.anam.ai/resources/voice-gallery)

### Add More Email Functions
Edit `components/anam-avatar-chatbot.tsx` and add new functions to the `functions` array.

### Update Email Templates
Edit `app/api/send-email/route.ts` to customize email content.

## 🧪 Testing

### Manual Test Flow

1. **HR Creates Employee**
   - Fill form → Submit → Verify in list

2. **Employee Logs In**
   - Use created credentials → Access dashboard

3. **AI Email Automation**
   - Switch to Avatar mode
   - Say: "I need Adobe Creative Cloud"
   - Check Resend logs for sent email

## 🐛 Troubleshooting

### Avatar not loading
- Check microphone permissions
- Verify Anam API keys
- Check browser console for errors

### Database errors
- Verify Supabase connection
- Check table exists
- Ensure .env.local is configured

### Email not sending
- Check Resend API key
- Verify sender domain
- Check Resend logs

## 📄 License

MIT

## 🤝 Contributing

This is a demo project. For production use, please implement proper security measures.

## 📞 Support

For issues:
1. Check [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md)
2. Review browser console errors
3. Check server logs
4. Verify all environment variables

---

Built with ❤️ using Next.js, Supabase, Resend, and Anam AI

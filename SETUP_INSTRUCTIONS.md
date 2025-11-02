# Setup Instructions

This guide will help you set up Supabase, Resend, and environment variables for the onboarding bot.

## 1. Install Dependencies

```bash
pnpm install
```

## 2. Set Up Supabase

### Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign up/login
2. Create a new project
3. Wait for the project to be provisioned (~2 minutes)

### Create the Employees Table

Go to the SQL Editor in your Supabase dashboard and run this SQL:

```sql
-- Create employees table
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

-- Enable Row Level Security (optional for demo, but recommended)
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow all operations (for demo purposes)
CREATE POLICY "Allow all operations" ON employees
FOR ALL
USING (true)
WITH CHECK (true);
```

### Get Your Supabase Credentials

1. Go to **Settings** → **API**
2. Copy the following:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public** key (under "Project API keys")
   - **service_role** key (under "Project API keys" - this is secret!)

## 3. Set Up Resend

### Create a Resend Account

1. Go to [https://resend.com](https://resend.com) and sign up
2. Verify your email address
3. Go to **API Keys** in the dashboard
4. Click **Create API Key**
5. Name it "Onboarding Bot" and copy the key

### Configure Email Domain (Optional for Testing)

For testing, you can use Resend's test mode which sends to your verified email.

For production:
1. Add your domain in Resend dashboard
2. Add the required DNS records
3. Verify domain ownership

**Note**: For demo purposes, you can send emails to any address if using test mode.

## 4. Set Up OpenAI (for Text Chatbot)

### Create an OpenAI Account

1. Go to [https://platform.openai.com](https://platform.openai.com) and sign up/login
2. Go to **API Keys** in your account settings
3. Click **Create new secret key**
4. Name it "Onboarding Bot Text Chat" and copy the key (starts with `sk-...`)

**Note**: The text chatbot uses OpenAI's GPT-4o-mini model. Make sure you have billing set up in your OpenAI account.

## 5. Configure Environment Variables

Create a `.env.local` file in the root of your project:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Resend Email API
RESEND_API_KEY=re_your_resend_api_key_here

# OpenAI API (for text chatbot)
OPENAI_API_KEY=sk-your-openai-api-key-here

# Anam AI Configuration (Already provided - Updated with Raspberry Coffee knowledge)
NEXT_PUBLIC_ANAM_API_KEY=NDYwOTNkNjctODE2Zi00MjVlLWE5YjktNGI1NDA5NmUyZmQ4OlUyKy80QWhnS29GcUIySUdzOGNHOVF1RWdERmhhNGsrK3k1L1B3dE9KZXM9
NEXT_PUBLIC_ANAM_KNOWLEDGE_FOLDER_ID=43eb9afc-86cc-474e-b856-54da9ab6ca8b
NEXT_PUBLIC_ANAM_AVATAR_ID=30fa96d0-26c4-4e55-94a0-517025942e18
NEXT_PUBLIC_ANAM_VOICE_ID=6bfbe25a-979d-40f3-a92b-5394170af54b
NEXT_PUBLIC_ANAM_LLM_ID=0934d97d-0c3a-4f33-91b0-5e136a0ef466
```

**Important**: Replace the placeholder values with your actual credentials from Supabase, Resend, and OpenAI.

## 6. Configure Resend Email Sender

Update the sender email in `app/api/send-email/route.ts` (line 75):

```typescript
from: 'Onboarding Assistant <onboarding@yourdomain.com>',
```

For testing, you can use:
```typescript
from: 'Onboarding Assistant <onboarding@resend.dev>',
```

## 7. Run the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 8. Test the Complete Flow

### Step 1: Create an Employee (HR Dashboard)

1. Navigate to the app
2. Click "Admin Dashboard" 
3. Fill in the form:
   - **Name**: Kai Yang
   - **Email**: kai.yang@raspberry-coffee.com
   - **Password**: password123
   - **Project**: The Aurora Design System
   - **Role**: Design System Intern
4. Click "Create Employee Profile"
5. Verify the employee appears in the list

### Step 2: Login as Employee

1. Click back or logout to return to login screen
2. Enter:
   - **Email**: kai.yang@raspberry-coffee.com
   - **Password**: password123
3. Click "Sign In"
4. You should see the employee dashboard

### Step 3: Test Anam AI Avatar with Email

1. Scroll down to the chatbot section
2. Click the "Avatar" button to switch to avatar mode
3. Allow microphone access when prompted
4. Wait for the avatar to connect (green status indicator)
5. Say: **"I need access to Adobe Creative Cloud license"**
6. The avatar should:
   - Understand your request
   - Automatically call the email API
   - Send an email to it-support@raspberry-coffee.com
   - Confirm: "I've sent your request to IT Support!"

### Step 4: Verify Email Sent

Check your Resend dashboard:
1. Go to **Logs** section
2. You should see the email that was sent
3. Click to view the email content

## Troubleshooting

### Supabase Connection Issues

- Verify your Supabase URL and keys are correct
- Check that the employees table exists
- Ensure RLS policies allow operations

### Email Not Sending

- Check your Resend API key is valid
- Verify the sender email domain
- Check Resend logs for error messages
- For testing, make sure you're using a verified email

### Anam Avatar Not Loading

- Check browser console for errors
- Ensure microphone permissions are granted
- Verify Anam API keys are set in `.env.local`
- Try refreshing the page

### Function Calling Not Working

- Check the `/api/send-email` endpoint is responding
- Look at browser network tab for failed requests
- Verify employee information is passed correctly
- Check server logs for errors

### Text Chatbot Not Working

- Verify your OpenAI API key is set in `.env.local`
- Check that the API key starts with `sk-` and is valid
- Ensure you have billing set up in your OpenAI account
- Check the browser console and network tab for error messages
- Verify the `/api/chat` endpoint is responding
- Make sure you've restarted the dev server after adding the API key

## Database Schema Reference

```
employees table:
├── id (UUID) - Primary key, auto-generated
├── email (TEXT) - Unique, required
├── password (TEXT) - Plain text for demo
├── name (TEXT) - Employee full name
├── role (TEXT) - Employee role/title
├── project (TEXT) - Assigned project
├── manager_email (TEXT) - Manager's email (optional)
├── onboarding_status (TEXT) - Default: 'active'
└── created_at (TIMESTAMP) - Auto-generated timestamp
```

## API Endpoints Reference

- `POST /api/employees/create` - Create new employee
- `POST /api/auth/login` - Authenticate employee
- `POST /api/send-email` - Send automated emails (called by Anam AI)
- `POST /api/chat` - Text chatbot endpoint (requires OpenAI API key)

## Security Notes

⚠️ **This is a demo application with simplified security:**

- Passwords are stored in plain text
- No password hashing
- Simple authentication without JWT tokens
- Service role key exposed in API routes

**For production, implement:**
- Password hashing (bcrypt)
- Proper authentication (Supabase Auth or JWT)
- Secure API routes
- Environment variable validation
- Input sanitization

## Support

For issues or questions:
- Check browser console for errors
- Review server logs (`pnpm dev` output)
- Verify all environment variables are set
- Ensure all dependencies are installed


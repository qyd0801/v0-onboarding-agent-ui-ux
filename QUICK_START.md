# 🚀 Quick Start Guide

Get your onboarding bot running in 15 minutes!

## ⚡ Setup Checklist

### 1. Supabase (5 minutes)
1. Go to [supabase.com](https://supabase.com) → Create project
2. SQL Editor → Paste this:
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
3. Settings → API → Copy URL and keys

### 2. Resend (3 minutes)
1. Go to [resend.com](https://resend.com) → Sign up
2. API Keys → Create API Key → Copy it

### 3. Environment Variables (2 minutes)
Create `.env.local`:
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxx

# Resend
RESEND_API_KEY=re_xxx

# Anam AI (already configured)
NEXT_PUBLIC_ANAM_API_KEY=NDYwOTNkNjctODE2Zi00MjVlLWE5YjktNGI1NDA5NmUyZmQ4OlUyKy80QWhnS29GcUIySUdzOGNHOVF1RWdERmhhNGsrK3k1L1B3dE9KZXM9
NEXT_PUBLIC_ANAM_KNOWLEDGE_FOLDER_ID=befa776a-c557-4846-b33b-620811e11327
NEXT_PUBLIC_ANAM_AVATAR_ID=30fa96d0-26c4-4e55-94a0-517025942e18
NEXT_PUBLIC_ANAM_VOICE_ID=6bfbe25a-979d-40f3-a92b-5394170af54b
NEXT_PUBLIC_ANAM_LLM_ID=0934d97d-0c3a-4f33-91b0-5e136a0ef466
```

### 4. Run (1 minute)
```bash
pnpm dev
```
Open http://localhost:3000

---

## 🎯 Quick Test

### Create Employee
1. Click "Admin Dashboard"
2. Fill form:
   - Name: `Kai Yang`
   - Email: `kai.yang@raspberry-coffee.com`
   - Password: `demo123`
   - Project: `The Aurora Design System`
   - Role: `Design System Intern`
3. Submit

### Login
- Email: `kai.yang@raspberry-coffee.com`
- Password: `demo123`

### Test AI Email
1. Scroll to chatbot
2. Click "Avatar"
3. Allow microphone
4. Say: **"I need Adobe Creative Cloud license"**
5. Check Resend dashboard for email!

---

## 📚 Full Documentation

- **Detailed Setup**: [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md)
- **Demo Script**: [DEMO_GUIDE.md](./DEMO_GUIDE.md)
- **Overview**: [README.md](./README.md)
- **Implementation Details**: [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)

---

## 🆘 Troubleshooting

**Avatar not loading?**
```bash
# Check microphone permission
# Verify ANAM keys in .env.local
# Refresh page
```

**Database error?**
```bash
# Verify Supabase keys
# Check employees table exists
# Try SQL query in Supabase dashboard
```

**Email not sending?**
```bash
# Check Resend API key
# View Resend logs
# Verify sender email in send-email/route.ts
```

---

**Ready in 15 minutes! 🎉**


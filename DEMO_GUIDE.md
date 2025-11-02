# Demo Guide - Onboarding Bot with AI Email Automation

This guide will help you present the onboarding bot in a live demo.

## Pre-Demo Setup Checklist

Before starting your demo, ensure:

- [ ] Supabase project is created and `employees` table exists
- [ ] `.env.local` file is configured with all keys
- [ ] Resend account is set up and API key is active
- [ ] Development server is running (`pnpm dev`)
- [ ] Browser has microphone permissions enabled
- [ ] You have the demo credentials ready

## Demo Script

### Part 1: HR Creates New Employee (2-3 minutes)

**What to say:**
> "Let me show you how HR can quickly onboard a new employee into our system."

**Steps:**
1. Open the application at `http://localhost:3000`
2. Click **"Admin Dashboard"** button
3. Fill in the employee creation form:
   ```
   Name: Kai Yang
   Email: kai.yang@raspberry-coffee.com
   Password: demo123
   Project: The Aurora Design System
   Role: Design System Intern
   ```
4. Click **"Create Employee Profile"**
5. Show the success message and the employee appearing in the list

**Key points to highlight:**
- ✅ Data is automatically stored in Supabase database
- ✅ Employee can immediately log in with these credentials
- ✅ Real-time display of all onboarded employees

---

### Part 2: Employee Login (1 minute)

**What to say:**
> "Now let's see the employee experience. The new hire logs in with the credentials HR just created."

**Steps:**
1. Click back or refresh to return to login screen
2. Enter credentials:
   ```
   Email: kai.yang@raspberry-coffee.com
   Password: demo123
   ```
3. Click **"Sign In"**
4. Show the personalized employee dashboard

**Key points to highlight:**
- ✅ Secure authentication against database
- ✅ Personalized dashboard with employee info
- ✅ Access to onboarding checklist and integrations

---

### Part 3: AI Avatar Chatbot with Email Automation (3-4 minutes)

**What to say:**
> "Here's where it gets exciting. Our AI assistant can understand requests and automatically send emails to the right people. Let me show you."

**Steps:**
1. Scroll down to the chatbot section
2. Click the **"Avatar"** button to switch to avatar mode
3. Allow microphone access when prompted
4. Wait for status to show "Ready to chat!" (green dot)
5. Speak clearly into microphone:
   ```
   "Hi! I need access to Adobe Creative Cloud license. Can you help me with that?"
   ```
6. Watch the avatar respond and process the request
7. Open Resend dashboard in a new tab to show the email was sent

**Key points to highlight:**
- ✅ Natural voice conversation with AI avatar
- ✅ AI automatically detects the intent (license request)
- ✅ Function calling triggers email to IT department
- ✅ Email includes all relevant details (employee name, request type)
- ✅ No manual email writing needed!

**Alternative demo phrases to try:**
- "I have a question about my vacation policy" → Emails HR
- "I need to discuss my project timeline" → Emails manager
- "How do I get access to GitHub?" → Emails IT

---

### Part 4: Dual Interface (1 minute)

**What to say:**
> "Employees can also use a traditional text chat if they prefer. The text chatbot has the same email automation capabilities!"

**Steps:**
1. Click the **"Chatbot"** button (to switch from avatar to text mode)
2. Type a question: "What are the company work hours?"
3. Show the text-based response
4. **(Optional) Test email automation in text mode**: Type "I need Figma license"
5. Watch the AI send the email automatically via text chat

**Key points to highlight:**
- ✅ Flexible interface - text or avatar
- ✅ Same AI intelligence in both modes
- ✅ **Both modes can send automated emails**
- ✅ Text mode uses OpenAI function calling, Avatar uses Anam function calling
- ✅ User choice for preferred interaction

---

## Demo Timeline

| Time | Section | Duration |
|------|---------|----------|
| 0:00 | Introduction & HR Dashboard | 2-3 min |
| 2:30 | Employee Login | 1 min |
| 3:30 | AI Avatar with Email Automation | 3-4 min |
| 7:00 | Dual Interface Demo | 1 min |
| **Total** | | **~8 minutes** |

---

## What Makes This Special

### 1. **Intelligent Email Automation**
- AI detects when employee needs help
- Automatically routes to correct department (IT, HR, Manager)
- No manual process needed
- **Works in both text and avatar modes**

### 2. **Natural Interaction**
- Voice-based conversation with realistic avatar
- Context-aware responses
- Professional and helpful personality

### 3. **Complete Integration**
- Database-backed authentication
- Real-time email delivery via Resend
- Seamless HR → Employee → Support flow

### 4. **Flexible Interface**
- Text chat for quick questions (with full email automation)
- Avatar mode for natural conversation (with voice + email automation)
- Both modes have identical capabilities
- Employee chooses their preference

---

## Common Questions & Answers

**Q: How does the AI know who to email?**
> The AI has been trained with function calling capabilities. When it detects specific intents like "license request" or "HR question", it calls our API which routes the email to the appropriate department.

**Q: What if the AI doesn't understand?**
> The AI is powered by GPT-4.1 and is quite robust. It can handle various phrasings. If it's unsure, it will ask for clarification before sending an email.

**Q: Can this scale to more departments?**
> Absolutely! We can easily add more function definitions for Finance, Legal, Facilities, etc. It's just adding new email functions and training data.

**Q: What about email deliverability?**
> We use Resend, which has excellent deliverability. For production, we'd add domain verification and SPF/DKIM records.

**Q: Is the password secure?**
> For this demo, we use plain text for simplicity. In production, we'd implement bcrypt hashing and Supabase Auth for secure authentication.

---

## Troubleshooting During Demo

### Avatar Not Loading
- Check microphone permission in browser
- Refresh the page
- Verify Anam API keys in .env.local

### Text Chatbot Not Working
- Verify OpenAI API key is set in .env.local
- Ensure billing is set up in OpenAI account
- Check browser console for error messages
- Restart the dev server after adding API key

### Email Not Sending
- Check Resend API key is valid
- Verify the sender domain in send-email/route.ts
- Check Resend logs for errors

### Database Errors
- Verify Supabase connection is active
- Check that employees table exists
- Ensure .env.local has correct credentials

---

## Post-Demo Discussion Points

### Technical Stack
- **Frontend**: Next.js 16, React 19, TypeScript
- **Database**: Supabase (PostgreSQL)
- **Email**: Resend API
- **AI**: Anam AI with GPT-4.1
- **Styling**: Tailwind CSS

### Implementation Highlights
1. **Function Calling**: Anam AI's native function calling for email automation
2. **API Architecture**: Clean separation of concerns with Next.js API routes
3. **Real-time Communication**: WebRTC video streaming for avatar
4. **Type Safety**: Full TypeScript implementation

### Potential Enhancements
- [ ] Add email templates with company branding
- [ ] Implement email confirmation/preview before sending
- [ ] Track email status and responses
- [ ] Add analytics dashboard for HR
- [ ] Multi-language support
- [ ] Integration with Slack/Teams for notifications
- [ ] Calendar integration for scheduling meetings
- [ ] Document upload and parsing

---

## Quick Reset for Multiple Demos

If you need to reset between demos:

```bash
# Delete test employees from Supabase (optional)
# Go to Supabase dashboard → Table Editor → employees → Delete rows

# Or use SQL:
DELETE FROM employees WHERE email = 'kai.yang@raspberry-coffee.com';
```

---

## Demo Success Tips

1. **Test beforehand**: Run through the entire flow 2-3 times
2. **Have backup**: Keep Supabase and Resend dashboards open
3. **Speak clearly**: For avatar demo, enunciate clearly into microphone
4. **Show real emails**: Display the actual emails sent in Resend logs
5. **Be ready for questions**: Know the technical stack and architecture

---

## Contact Information Display

During the demo, you can show these are the configured contacts:
- **IT Support**: it-support@raspberry-coffee.com
- **HR Team**: hr@raspberry-coffee.com
- **Manager**: (Dynamically assigned per employee)

---

Good luck with your demo! 🚀


# Email Integration with Resend

**Status**: ✅ Implemented (Nov 11, 2025)

## Overview

The Tary app now includes email functionality for sending estimates to customers using **Resend** with **React Email** for beautiful email templates.

---

## Features

- ✅ Send estimate emails to customers with one click
- ✅ Beautiful, responsive email templates built with React
- ✅ Automatic status tracking (project moves to "sent" status)
- ✅ Email tracking (sent timestamp, recipient, send count)
- ✅ Professional layout matching the app design
- ✅ Includes all project details: floor specs, measurements, pricing

---

## How It Works

### User Flow
1. Contractor creates a project and generates an estimate
2. On the estimate page, clicks "Send Email" button
3. System sends professional email to customer with all details
4. Project status automatically updates to "sent"
5. Email tracking data is saved (timestamp, recipient, count)

### Technical Flow
1. **Frontend** ([src/app/estimate/page.tsx](src/app/estimate/page.tsx))
   - "Send Email" button triggers `handleSendEmail()` function
   - Shows loading state while sending
   - Shows success state when complete

2. **API Route** ([src/app/api/projects/[id]/send-estimate/route.ts](src/app/api/projects/[id]/send-estimate/route.ts))
   - Fetches project and customer data
   - Fetches contractor info for "from" address
   - Formats data for email template
   - Calls Resend API to send email
   - Updates project with tracking data

3. **Email Template** ([src/emails/EstimateEmail.tsx](src/emails/EstimateEmail.tsx))
   - React component using `@react-email/components`
   - Professional layout with contractor branding
   - All project specifications and pricing
   - Responsive design (looks great on mobile)

---

## Database Changes

**Migration**: [supabase/migrations/005_add_email_tracking.sql](supabase/migrations/005_add_email_tracking.sql)

Added to `projects` table:
- `estimate_sent_at` (TIMESTAMPTZ) - When estimate was last emailed
- `estimate_sent_to` (TEXT) - Email address where estimate was sent
- `estimate_email_count` (INTEGER) - Number of times estimate has been emailed

**You need to run this migration:**
```sql
-- Run this in Supabase SQL Editor
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS estimate_sent_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS estimate_sent_to TEXT,
ADD COLUMN IF NOT EXISTS estimate_email_count INTEGER DEFAULT 0;
```

---

## Environment Setup

### Required Environment Variable

Add to `.env.local`:
```bash
RESEND_API_KEY=re_your_api_key_here
```

You already added this! ✅

### Current Configuration

**From Address**: Currently using `onboarding@resend.dev` (Resend's test email)
- ✅ Works immediately for testing
- ❌ Not professional for production

**Production Setup** (When Ready):
1. Buy a domain for Tary (e.g., `tary.app` or `usetary.com`)
2. Add domain in Resend dashboard
3. Update DNS records at your domain registrar
4. Change "from" address in API route to: `Tary <noreply@yourdomain.com>`

---

## Email Domain Strategy

### How Email Domains Work in SaaS Apps

**Option 1: App sends from its own domain** (RECOMMENDED)
- Emails come from: `Tary <noreply@tary.app>`
- Reply-to set to: `contractor-email@example.com`
- ✅ One domain for all contractors
- ✅ Easy setup and management
- ✅ Consistent branding
- ✅ No DNS setup required per user

**Option 2: App sends from user's domain** (Complex)
- Emails come from: `jason@thebesthardwoodfloor.com`
- ❌ Requires DNS verification for EVERY user
- ❌ Complex onboarding process
- ❌ Not scalable

**Most SaaS apps use Option 1**, including:
- Stripe (emails from `stripe.com`)
- GitHub (emails from `github.com`)
- Notion (emails from `notion.so`)
- Figma (emails from `figma.com`)

### What You'll Do

When Tary has its own domain:
1. Add domain to Resend (one-time setup)
2. Update API route line 133:
   ```typescript
   from: 'Tary <noreply@tary.app>',  // Your domain
   ```
3. Customer receives email from Tary, but sees contractor's name in the body
4. Reply-to can be set to contractor's email if needed

**You only need ONE domain** - not one per contractor!

---

## Files Created/Modified

### New Files
- `src/emails/EstimateEmail.tsx` - React email template
- `src/app/api/projects/[id]/send-estimate/route.ts` - API endpoint
- `supabase/migrations/005_add_email_tracking.sql` - Database migration
- `EMAIL_SETUP.md` - This file

### Modified Files
- `src/app/estimate/page.tsx` - Added "Send Email" button and handler
- `package.json` - Added Resend and React Email dependencies

---

## Testing

### Test Sending an Email

1. Make sure dev server is running: `npm run dev`
2. Log in to the app
3. Go to a project's estimate page
4. Click "Send Email" button
5. Check the customer's email inbox
6. Email should arrive from `onboarding@resend.dev`

### What to Check
- ✅ Email arrives in inbox (not spam)
- ✅ All project details are correct
- ✅ Formatting looks professional
- ✅ Responsive on mobile
- ✅ Project status updates to "sent"

---

## Future Enhancements

### Contract Email (Phase 2B)
- Same setup as estimate email
- Different template with contract details
- Send from contract tab

### Email Customization (Phase 3)
- Custom email messages/intro
- Contractor's email signature from settings
- Attach PDF to email (requires PDF generation first)
- Email open tracking
- Customer email confirmation/reply tracking

---

## Troubleshooting

### "Failed to send email"
- Check that `RESEND_API_KEY` is set in `.env.local`
- Check Resend dashboard for API key status
- Check Resend logs for errors
- Verify customer email is valid

### Email goes to spam
- Currently using test domain (`resend.dev`)
- Will be better with your own domain
- Make sure you verify domain with proper DNS records

### Status not updating
- Check that database migration was applied
- Check browser console for errors
- Verify RLS policies allow updates

---

## Cost & Limits

**Resend Free Tier:**
- 3,000 emails/month free
- 100 emails/day max
- Perfect for Jason's current volume

**Paid Tier** (if needed later):
- $20/month for 50,000 emails
- Scales with usage

For a single contractor sending ~5-10 estimates per day, free tier is plenty!

---

## Dependencies

```json
{
  "resend": "^4.0.0",
  "react-email": "^3.0.0",
  "@react-email/components": "^0.0.25"
}
```

All installed! ✅

---

**Status**: Ready for testing! Try sending an estimate email now. 📧

# Tary - Contractor Management Platform

**Client**: Jason Dixon, The Best Hardwood Flooring Co.
**Stack**: Next.js 15, Supabase, TypeScript, Tailwind

## Quick Start

```bash
npm install
cp .env.example .env.local  # Add Supabase credentials
npm run dev                  # http://localhost:3000
```

## What It Does

Flooring contractor workflow: Customer intake → Floor selection → Measurements → Estimate → Contract → Signature → Email

## Current Features

| Feature | Status |
|---------|--------|
| Contractor auth | ✅ |
| Customer CRUD | ✅ |
| Project wizard | ✅ |
| Dynamic pricing | ✅ |
| PDF generation | ✅ |
| Digital signatures | ✅ |
| Email estimates | ✅ |
| **Customer portal** | ❌ Not built |
| **Online payments** | ❌ Not built |

## Role Structure

**Single role: Contractor** - Customers are data records, not users.

Jason wants: Send link to customer → Customer views estimate → Signs contract → Pays online

This customer-facing portal is the next priority.

## Key Directories

```
src/app/           # Pages and API routes
src/components/    # UI components
src/lib/           # Utilities (Supabase, PDF, pricing)
memory-bank/       # AI development context
documentation/     # Reference materials
```

## Documentation

- [memory-bank/context.md](memory-bank/context.md) - Current state and architecture
- [memory-bank/roadmap.md](memory-bank/roadmap.md) - Planned features
- [documentation/](documentation/) - Reference materials

## Environment

```env
NEXT_PUBLIC_SUPABASE_URL=https://eonnbueqowenorscxugz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
RESEND_API_KEY=your_key
```

Test account: jason@thebesthardwoodfloor.com

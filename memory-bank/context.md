# Tary - AI Development Context

**Client**: Jason Dixon, The Best Hardwood Flooring Co.
**Stack**: Next.js 15, React 19, TypeScript, Tailwind, Supabase
**Status**: Phase 2D Complete - Production ready contractor app

## Current Architecture

### Role Structure (SINGLE ROLE)
- **Contractor** (Jason Dixon) - Only user type implemented
- Customers are data records, NOT users (no login)
- Row Level Security isolates contractor data

### Database Schema
```
contractors     → auth user, company info, subscription
customers       → belongs to contractor, contact info
projects        → belongs to contractor + customer, floor specs, measurements, signatures
contractor_templates → per-contractor pricing/product config
contractor_settings  → preferences (email sig, notifications, etc.)
```

### Implemented Features
- Auth (email/password via Supabase)
- Customer CRUD with search/filter
- Project wizard: customer → floor selection → measurements → estimate
- Dynamic pricing from contractor templates
- Contract generation with legal terms
- PDF generation (jsPDF, client-side)
- Digital signatures (react-signature-canvas)
- Email estimates (Resend API)
- Project editing with auto-price recalculation
- Profile/settings management

### Key Files
- `src/app/estimate/page.tsx` - Estimate + contract + signatures
- `src/lib/pdf/` - PDF generators
- `src/lib/pricing/calculateProjectCost.ts` - Pricing logic
- `src/app/api/projects/[id]/route.ts` - Project CRUD + auto-pricing
- `src/components/contracts/ContractTemplate.tsx` - Legal contract

### Patterns
- Server components by default, `'use client'` when needed
- Supabase: `client.ts` for browser, `server.ts` for API routes
- Mobile-first: 44px touch targets, safe areas, responsive breakpoints
- All routes protected via middleware except `/`, `/login`

## What's NOT Built

### Customer Portal (Priority)
- No customer login/authentication
- No public estimate viewing links
- No customer self-service forms
- No online contract signing
- No customer payment submission

### Other Missing
- Stripe payment processing
- Photo uploads (Supabase Storage not configured)
- Multi-contractor platform UI
- Template editor UI (API exists)

## Environment
```bash
npm run dev          # localhost:3000
npm run type-check   # TypeScript validation
npm run build        # Production build
```

Test account: jason@thebesthardwoodfloor.com
Supabase: eonnbueqowenorscxugz.supabase.co

# Customer Portal Implementation Plan

## Overview

Enable customers to view estimates, sign contracts, and pay online via shareable links. Supports optional customer accounts and multi-contractor relationships.

## User Types

| Type | Description | Auth Required |
|------|-------------|---------------|
| **Contractor** | Pays for app, creates estimates | Yes (Supabase Auth) |
| **Customer** | Receives estimates from contractors | Optional |

## Architecture Decisions

### Token-Based Access (Phase 1-3)
- Contractor shares link: `/view/[projectToken]`
- Token is unique per project
- No auth required - anyone with link can view
- Simple, no friction for customers

### Customer Accounts (Phase 5)
- Optional - customer can create account to see all their projects
- Login via email magic link (no password)
- Dashboard shows projects from ALL contractors they've worked with
- Each contractor's projects displayed separately

### Multi-Contractor Customer Architecture

**Vision**: A customer (homeowner) can work with multiple contractors (flooring, painting, plumbing). Each contractor uses Tary. The customer sees all their projects organized by contractor.

**Database Schema Change (Future)**:
```sql
-- Current: customers belong to ONE contractor
customers.contractor_id → contractors.id

-- Future: Many-to-many relationship
CREATE TABLE contractor_customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contractor_id UUID REFERENCES contractors(id),
  customer_id UUID REFERENCES customers(id),
  relationship TEXT DEFAULT 'client', -- 'client' | 'lead' | 'past'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(contractor_id, customer_id)
);

-- Customers get their own auth
ALTER TABLE customers ADD COLUMN auth_user_id UUID REFERENCES auth.users(id);
ALTER TABLE customers ADD COLUMN has_account BOOLEAN DEFAULT false;
```

**Customer Portal View**:
```
┌─────────────────────────────────────────────────┐
│  My Projects                        [Settings]  │
├─────────────────────────────────────────────────┤
│                                                 │
│  The Best Hardwood Flooring Co.                 │
│  ├── Living Room Refinish      [Completed] ✓   │
│  └── Kitchen Hardwood Install  [In Progress]   │
│                                                 │
│  ABC Painting & Decorating                      │
│  └── Interior Repaint          [Quoted]        │
│                                                 │
│  Smith Plumbing                                 │
│  └── Bathroom Remodel          [Draft]         │
│                                                 │
└─────────────────────────────────────────────────┘
```

## Implementation Phases

### Phase 1: Public Estimate View (2-3 days)

**Database changes:**
```sql
ALTER TABLE projects ADD COLUMN public_token TEXT UNIQUE;
ALTER TABLE projects ADD COLUMN token_created_at TIMESTAMPTZ;
ALTER TABLE projects ADD COLUMN customer_viewed_at TIMESTAMPTZ;
ALTER TABLE projects ADD COLUMN customer_signed_at TIMESTAMPTZ;
CREATE INDEX idx_projects_public_token ON projects(public_token);
```

**Files to create:**
- `src/app/view/[token]/page.tsx` - Public estimate page
- `src/app/api/public/[token]/route.ts` - Fetch project by token
- `src/lib/tokens.ts` - Token generation

**Features:**
- View estimate details (read-only)
- See contractor branding
- View contract terms

### Phase 2: Public Contract Signing (1-2 days)

- Add signature capture to public page
- Email notification to contractor on signature
- Auto-update project status to "approved"

### Phase 3: Payment Integration (3-5 days)

- Stripe Checkout integration
- Support deposit/progress/final payments
- Webhook for payment confirmation
- Payment tracking in database

### Phase 4: Customer Self-Service Form (2-3 days)

**Contractor initiates with minimal info:**
1. Contractor has phone number only
2. Creates customer with just phone
3. Texts them a link: `/intake/[customerToken]`
4. Customer fills out their own info:
   - Name, email, address
   - Room names and rough dimensions
   - Preferred contact method
5. Creates draft project for contractor to review

**Or contractor has email only:**
1. Creates customer with just email
2. Emails them the intake link
3. Same flow as above

### Phase 5: Customer Accounts (3-5 days)

**Customer registration flow:**
1. Customer receives estimate link
2. Below estimate: "Create account to track all your projects"
3. Enter email → receive magic link
4. Account created, linked to customer record

**Customer dashboard:**
- List all projects from all contractors
- Grouped by contractor
- Payment history across all
- Document storage (contracts, receipts)

**Matching existing customers:**
- When contractor creates customer with email
- Check if that email has an account
- Auto-link if exists (with notification)

### Phase 6: Multi-Contractor Support (Future)

**When same customer works with new contractor:**
1. New contractor creates customer with same email
2. System detects existing customer account
3. Links new contractor to existing customer
4. Customer sees new contractor in their dashboard

**Privacy:**
- Contractors can only see their own projects with customer
- Customer sees all their contractors
- No cross-contractor data sharing

## Contractor Workflow Changes

### Share Estimate Button
- Added to estimate page
- Generates token if needed
- Options:
  - Copy link
  - Send via text (opens SMS with link)
  - Send via email (uses existing email feature)
  - Generate QR code

### Dashboard Updates
- "Awaiting Signature" filter
- "Payment Outstanding" filter
- Notifications when customer views/signs/pays

## Security

1. **Token entropy**: 32-char hex = 128 bits
2. **Rate limiting**: Public endpoints rate limited
3. **Token expiration**: Optional X-day expiry
4. **Audit trail**: Log access with IP, timestamp
5. **Customer auth**: Magic link only (no passwords to manage)

## Environment Variables

```env
# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# App URL
NEXT_PUBLIC_URL=https://app.tary.com
```

## Effort Summary

| Phase | Description | Effort |
|-------|-------------|--------|
| 1 | Public estimate view | 2-3 days |
| 2 | Online signing | 1-2 days |
| 3 | Stripe payments | 3-5 days |
| 4 | Customer self-service form | 2-3 days |
| 5 | Customer accounts | 3-5 days |
| 6 | Multi-contractor | 2-3 days |
| **Total** | | **13-21 days** |

## Questions for Jason (See CLIENT_QUESTIONNAIRE.md)

1. Should customers create accounts, or just use links?
2. Do customers ever need to fill out their own info/measurements?
3. Which payment types should be online vs in-person?
4. Should customers be able to message through the app?

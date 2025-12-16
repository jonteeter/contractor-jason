# Customer Portal Implementation Plan

## Overview

Enable customers to view estimates, sign contracts, and pay online via shareable links. No customer login required for basic flow.

## Architecture Decision

**Token-based public access** (not customer accounts):
- Contractor shares link: `/view/[projectToken]`
- Token is unique per project, stored in `projects.public_token`
- No auth required - anyone with link can view
- Optional: Add customer accounts later for history/dashboard

## Database Changes

```sql
-- Add to projects table
ALTER TABLE projects ADD COLUMN public_token TEXT UNIQUE;
ALTER TABLE projects ADD COLUMN token_created_at TIMESTAMPTZ;
ALTER TABLE projects ADD COLUMN customer_viewed_at TIMESTAMPTZ;
ALTER TABLE projects ADD COLUMN customer_signed_at TIMESTAMPTZ;

-- Index for fast token lookups
CREATE INDEX idx_projects_public_token ON projects(public_token);
```

## Implementation Steps

### Phase 1: Public Estimate View

**Files to create:**
- `src/app/view/[token]/page.tsx` - Public estimate page
- `src/app/api/public/[token]/route.ts` - Fetch project by token (no auth)
- `src/lib/tokens.ts` - Token generation utility

**Token generation:**
```typescript
// src/lib/tokens.ts
import { randomBytes } from 'crypto'

export function generateProjectToken(): string {
  return randomBytes(16).toString('hex') // 32 char hex string
}
```

**API route (no auth):**
```typescript
// src/app/api/public/[token]/route.ts
export async function GET(req, { params }) {
  const { token } = params

  // Use service role to bypass RLS
  const supabase = createServiceClient()

  const { data: project } = await supabase
    .from('projects')
    .select(`
      *,
      customers (name, email, phone, address, city, state, zip_code),
      contractors (company_name, contact_name, phone, email)
    `)
    .eq('public_token', token)
    .single()

  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Update viewed timestamp
  await supabase
    .from('projects')
    .update({ customer_viewed_at: new Date().toISOString() })
    .eq('id', project.id)

  return NextResponse.json(project)
}
```

**Public page:**
- Display estimate details (read-only)
- Show contractor info and branding
- Display contract terms
- "Sign Contract" button (Phase 2)
- "Pay Now" button (Phase 3)

### Phase 2: Public Contract Signing

**Modify existing signature flow:**
- `src/app/view/[token]/page.tsx` - Add signature capture
- `src/app/api/public/[token]/sign/route.ts` - Save signature without auth

**Sign API:**
```typescript
// src/app/api/public/[token]/sign/route.ts
export async function POST(req, { params }) {
  const { token } = params
  const { signature } = await req.json()

  const supabase = createServiceClient()

  const { data: project } = await supabase
    .from('projects')
    .select('id, contractor_id')
    .eq('public_token', token)
    .single()

  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Save customer signature
  await supabase
    .from('projects')
    .update({
      customer_signature: signature,
      customer_signature_date: new Date().toISOString(),
      customer_signed_at: new Date().toISOString(),
      status: 'approved'
    })
    .eq('id', project.id)

  // Email notification to contractor
  await sendContractorNotification(project.contractor_id, project.id)

  return NextResponse.json({ success: true })
}
```

### Phase 3: Payment Integration

**Stripe Checkout approach:**
```typescript
// src/app/api/public/[token]/checkout/route.ts
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(req, { params }) {
  const { token } = params
  const { paymentType } = await req.json() // 'deposit' | 'progress' | 'final'

  const supabase = createServiceClient()
  const { data: project } = await supabase
    .from('projects')
    .select('*, customers(*), contractors(*)')
    .eq('public_token', token)
    .single()

  // Calculate amount based on payment type
  const amounts = {
    deposit: project.estimated_cost * 0.6,
    progress: project.estimated_cost * 0.3,
    final: project.estimated_cost * 0.1
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: `${project.project_name} - ${paymentType} payment`,
        },
        unit_amount: Math.round(amounts[paymentType] * 100),
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_URL}/view/${token}?paid=${paymentType}`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/view/${token}`,
    metadata: {
      project_id: project.id,
      payment_type: paymentType,
    },
  })

  return NextResponse.json({ url: session.url })
}
```

**Webhook for payment confirmation:**
```typescript
// src/app/api/webhooks/stripe/route.ts
export async function POST(req) {
  const payload = await req.text()
  const sig = req.headers.get('stripe-signature')

  const event = stripe.webhooks.constructEvent(
    payload,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET
  )

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const { project_id, payment_type } = session.metadata

    // Record payment in database
    await supabase.from('payments').insert({
      project_id,
      amount: session.amount_total / 100,
      payment_type,
      payment_date: new Date().toISOString(),
      stripe_session_id: session.id,
    })

    // Notify contractor
    await sendPaymentNotification(project_id, payment_type)
  }

  return NextResponse.json({ received: true })
}
```

### Phase 4: Customer Self-Service Form (Optional)

Allow customer to input room measurements before contractor visit:

**Flow:**
1. Contractor creates customer record
2. System generates form link: `/intake/[customerToken]`
3. Customer fills in room names, rough dimensions
4. Creates draft project for contractor to review

## UI Components Needed

1. **PublicEstimateView** - Read-only estimate display
2. **PublicContractView** - Contract with signature capture
3. **PublicPaymentSection** - Payment buttons and status
4. **ShareLinkModal** - For contractor to copy/send link

## Contractor-Side Changes

**Add to estimate page:**
- "Share with Customer" button
- Generates token if not exists
- Copy link / Send via email
- Track: viewed, signed, paid status

**Dashboard updates:**
- Show projects pending customer signature
- Show projects with outstanding payments
- Notification when customer signs/pays

## Security Considerations

1. **Token entropy**: 32-char hex = 128 bits, computationally infeasible to guess
2. **Rate limiting**: Add rate limits to public endpoints
3. **Token expiration**: Optional - expire tokens after X days
4. **Audit trail**: Log all access with IP, timestamp

## Environment Variables

```env
# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# App URL for callbacks
NEXT_PUBLIC_URL=https://app.tary.com
```

## Migration Plan

1. Add database columns (migration 009)
2. Build public view page (Phase 1)
3. Add signature to public page (Phase 2)
4. Integrate Stripe (Phase 3)
5. Add share button to contractor UI
6. Test full flow

## Effort Estimate

| Phase | Effort |
|-------|--------|
| Phase 1: Public view | 2-3 days |
| Phase 2: Signing | 1-2 days |
| Phase 3: Payments | 3-5 days |
| Phase 4: Self-service | 2-3 days |
| **Total** | **8-13 days** |

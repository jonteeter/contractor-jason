# Tary - Development Roadmap

## Phase 3: Customer Portal (NEXT PRIORITY)

Jason's vision: Contractor sends link to customer who can view estimate, manage rooms, sign contract, pay.

### 3.1 Public Estimate Links
- Generate unique tokens for projects
- Public route `/view/[token]` - no auth required
- Display estimate details (read-only)
- Include contractor branding

### 3.2 Customer Self-Service Form
- Customer can input their own room measurements
- Optional: customer creates rooms before contractor visit
- Links to existing project or creates new one

### 3.3 Online Contract Signing
- Customer views contract at public URL
- Signature capture works on public page
- Email notification to contractor when signed
- Status auto-updates to "approved"

### 3.4 Payment Integration
- Stripe Checkout or Payment Links
- Track payments against project
- Support 60/30/10 or custom schedules
- Payment status visible to both parties

### 3.5 Customer Account (Optional)
- Customer can create account to track their projects
- View payment history
- Access all past estimates/contracts

## Phase 4: Platform Expansion

### Template Editor UI
- Settings page tab for product catalog
- Edit floor types, sizes, finishes, stains
- API already exists at `/api/contractor-templates`

### Photo Uploads
- Configure Supabase Storage bucket
- Before/after room photos
- Attach to projects

### Multi-Contractor
- Registration flow
- Subscription tiers (Stripe)
- Admin dashboard

## Out of Scope
- Accounting integration
- Inventory management
- CRM email campaigns
- Project scheduling/calendar

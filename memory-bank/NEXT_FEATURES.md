# Next Features Roadmap

**Project**: Tary Contractor App
**Last Updated**: November 10, 2025
**Current Phase**: Phase 1 Complete → Phase 2 Planning

This document outlines the prioritized roadmap for future development.

---

## 🎯 Phase 2: Core Enhancements (Next 2-3 Months)

### 1. PDF Generation (HIGH PRIORITY) ⭐

**Status**: Buttons exist but non-functional
**Estimated Effort**: 1-2 weeks
**Impact**: HIGH - Enables offline distribution of estimates/contracts

**Requirements**:
- Download estimate as formatted PDF
- Download contract as formatted PDF
- Professional layout matching screen design
- Company logo included
- Print-optimized formatting

**Technical Approach**:
- Library options: `jsPDF`, `react-pdf`, or `pdfmake`
- Create PDF templates matching current HTML structure
- Add download endpoint or client-side generation
- Test across devices and browsers

**Acceptance Criteria**:
- [ ] Click "Download PDF" button → saves estimate PDF
- [ ] Click "Download PDF" button → saves contract PDF
- [ ] PDF includes all customer and project data
- [ ] PDF format is professional and print-ready
- [ ] Works on mobile devices

**Files to Create/Modify**:
- `src/lib/pdf/generateEstimate.ts` (new)
- `src/lib/pdf/generateContract.ts` (new)
- `src/app/estimate/page.tsx` (modify)

---

### 2. Email Integration (HIGH PRIORITY) ⭐

**Status**: Email buttons exist but non-functional
**Estimated Effort**: 1-2 weeks
**Impact**: HIGH - Customers can receive estimates remotely

**Requirements**:
- Send estimate to customer email
- Send contract to customer email
- Attach PDF automatically
- Professional email template
- Track sent status

**Technical Approach**:
- Email service options: **Resend** (recommended), SendGrid, AWS SES
- Create email templates with company branding
- API route for sending emails
- Store "email_sent" status in projects table

**Acceptance Criteria**:
- [ ] Click "Email to Customer" → sends email with PDF
- [ ] Email includes professional message
- [ ] Customer receives estimate/contract attachment
- [ ] System tracks when emails were sent
- [ ] Error handling for failed sends

**Files to Create/Modify**:
- `src/lib/email/sendEstimate.ts` (new)
- `src/app/api/projects/[id]/send-email/route.ts` (new)
- `src/app/estimate/page.tsx` (modify)
- Add `email_sent_at` column to projects table

**Dependencies**:
- Requires PDF generation feature (above)

---

### 3. Digital Signatures (MEDIUM PRIORITY) ⭐

**Status**: Not started
**Estimated Effort**: 2-3 weeks
**Impact**: MEDIUM - Enables fully digital contract workflow

**Requirements**:
- Capture customer signature on mobile/desktop
- Capture contractor signature
- Store signatures as images
- Display signatures on contract
- Track signature dates
- Optional: Email link for customer to sign remotely

**Technical Approach**:
- Library: `react-signature-canvas`
- Add signature fields to contracts table
- Signature capture modal component
- Store as base64 or upload to Supabase Storage

**Acceptance Criteria**:
- [ ] "Sign Contract" button opens signature modal
- [ ] Can draw signature with mouse/touch
- [ ] Clear and save signature options
- [ ] Signature appears on contract PDF
- [ ] Track signature date and name
- [ ] Works on mobile devices

**Files to Create/Modify**:
- `src/components/contracts/SignatureCapture.tsx` (new)
- `src/app/estimate/page.tsx` (modify)
- Add `customer_signature`, `contractor_signature` to projects table

---

### 4. Customer List Page (MEDIUM PRIORITY)

**Status**: Dashboard has placeholder link
**Estimated Effort**: 1 week
**Impact**: MEDIUM - Better customer management

**Requirements**:
- View all customers in list/grid
- Search by name, email, phone
- Filter by customer type (new/existing)
- Click customer → see all their projects
- Edit customer information
- Delete customer (with confirmation)

**Technical Approach**:
- New route: `/customers`
- API endpoint: `GET /api/customers`
- Search and filter UI
- Customer detail modal or page
- Link to customer's projects

**Acceptance Criteria**:
- [ ] Dashboard "Customers" link goes to `/customers`
- [ ] Shows all customers for logged-in contractor
- [ ] Search by name works
- [ ] Click customer → shows detail
- [ ] Can edit customer info
- [ ] Can view all projects for customer

**Files to Create**:
- `src/app/customers/page.tsx` (new)
- `src/app/api/customers/route.ts` (enhance existing)

---

### 5. Payment Tracking (MEDIUM PRIORITY) 💰

**Status**: Not started
**Estimated Effort**: 2 weeks
**Impact**: MEDIUM - Track payment schedule

**Requirements**:
- Track 60% deposit payment
- Track 30% mid-project payment
- Track 10% final payment
- Mark payments as received
- Calculate outstanding balance
- Payment history log

**Technical Approach**:
- Add payments table to database
- Payment status UI on project page
- Payment recording modal
- Outstanding balance calculation

**Database Schema**:
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY,
  project_id UUID REFERENCES projects(id),
  amount NUMERIC NOT NULL,
  payment_type TEXT, -- 'deposit', 'mid', 'final'
  payment_date DATE,
  payment_method TEXT, -- 'check', 'cash', 'card', etc.
  notes TEXT,
  created_at TIMESTAMPTZ
);
```

**Acceptance Criteria**:
- [ ] Project page shows payment schedule
- [ ] Can mark payment as received
- [ ] Shows outstanding balance
- [ ] Payment history visible
- [ ] Calculates amounts automatically (60/30/10)

---

### 6. Photo Uploads (LOW PRIORITY) 📸

**Status**: Not started
**Estimated Effort**: 2 weeks
**Impact**: LOW - Nice to have for project documentation

**Requirements**:
- Upload before/after photos
- Store in Supabase Storage
- Gallery view for project
- Photo captions
- Image compression

**Technical Approach**:
- Use Supabase Storage buckets
- Image upload component
- Compress images before upload
- Store references in database

**Acceptance Criteria**:
- [ ] Can upload photos to project
- [ ] Photos displayed in gallery
- [ ] Before/after categorization
- [ ] Works on mobile camera
- [ ] Image compression working

---

## 🚀 Phase 3: Platform Expansion (Future - 6+ Months)

### Multi-Contractor Support 🏢

**Impact**: TRANSFORMATIVE - Turns single-user app into SaaS platform

**Major Changes Required**:
- Multi-tenant data isolation (already mostly done with RLS)
- Contractor registration and onboarding
- Subscription management (Stripe integration)
- Billing system
- Super admin dashboard
- Contractor switching UI
- Different pricing tiers (Basic, Professional, Enterprise)

**Estimated Effort**: 2-3 months

---

### Sales Team Management 👥

**Impact**: HIGH - Allows contractors to add team members

**Requirements**:
- Invite team members to contractor account
- Role-based permissions (admin, sales person)
- Project assignment to team members
- Team member activity tracking
- Performance metrics

**Estimated Effort**: 1-2 months

**Dependencies**:
- Requires multi-contractor support

---

### Mobile Native App 📱

**Impact**: MEDIUM - Better mobile experience, offline support

**Requirements**:
- iOS and Android apps using Capacitor
- Offline data storage with sync
- Push notifications
- Native camera integration
- App store distribution

**Estimated Effort**: 2-3 months

**Technical Approach**:
- Install Capacitor
- Configure for iOS and Android
- Implement offline storage (SQLite)
- Build and test on real devices
- Submit to app stores

---

### GPS Time Tracking ⏱️

**Impact**: MEDIUM - For contractors with mobile teams

**Requirements**:
- Clock in/out at jobsites
- GPS verification
- Geofencing for jobsite boundaries
- Time tracking reports
- Location history

**Estimated Effort**: 3-4 weeks

**Dependencies**:
- Requires mobile app or browser location permissions

---

### Digital Business Cards 🎴

**Impact**: LOW - Marketing/lead generation tool

**Requirements**:
- Business card templates
- QR code generation
- Auto-populate contractor info
- Social media sharing
- Lead capture

**Estimated Effort**: 2-3 weeks

---

## 📊 Priority Matrix

| Feature | Priority | Effort | Impact | Phase |
|---------|----------|--------|--------|-------|
| PDF Generation | ⭐⭐⭐ | 1-2w | HIGH | 2 |
| Email Integration | ⭐⭐⭐ | 1-2w | HIGH | 2 |
| Digital Signatures | ⭐⭐ | 2-3w | MEDIUM | 2 |
| Customer List | ⭐⭐ | 1w | MEDIUM | 2 |
| Payment Tracking | ⭐⭐ | 2w | MEDIUM | 2 |
| Photo Uploads | ⭐ | 2w | LOW | 2 |
| Multi-Contractor | ⭐⭐⭐ | 2-3m | TRANS | 3 |
| Sales Team Mgmt | ⭐⭐⭐ | 1-2m | HIGH | 3 |
| Mobile App | ⭐⭐ | 2-3m | MEDIUM | 3 |
| GPS Tracking | ⭐⭐ | 3-4w | MEDIUM | 3 |
| Business Cards | ⭐ | 2-3w | LOW | 3 |

---

## 🎯 Recommended Sprint Plan

### Sprint 1 (2 weeks): PDF + Email
- Week 1: PDF generation for estimates and contracts
- Week 2: Email integration with PDF attachments

**Deliverable**: Customer can receive estimates/contracts via email

---

### Sprint 2 (2 weeks): Signatures + Customers
- Week 1: Digital signature capture
- Week 2: Customer list page

**Deliverable**: Fully digital contract workflow + better customer management

---

### Sprint 3 (2 weeks): Payment Tracking
- Week 1: Payment schema and API
- Week 2: Payment tracking UI

**Deliverable**: Track 60/30/10 payment schedule

---

### Sprint 4 (2 weeks): Polish & Photos
- Week 1: Bug fixes and UI improvements
- Week 2: Photo upload feature

**Deliverable**: Phase 2 complete, production-ready enhancements

---

## 💭 Feature Requests Log

Track user-requested features here:

| Date | Feature | Requested By | Priority | Status |
|------|---------|--------------|----------|--------|
| TBD | TBD | TBD | TBD | TBD |

---

## 🚫 Out of Scope (Not Planned)

Features we've decided NOT to build:

- Accounting/bookkeeping integration
- Inventory management
- Purchase order system
- CRM with email campaigns
- Project scheduling/calendar
- Material supplier integrations

**Reason**: Focus on core estimate/contract workflow. These features would significantly increase complexity.

---

**Next Review Date**: TBD (update after Sprint 1 completion)
**Status**: Ready to begin Sprint 1 (PDF + Email)

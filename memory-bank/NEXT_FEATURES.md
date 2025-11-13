# Next Features Roadmap

**Project**: Tary Contractor App
**Last Updated**: November 11, 2025
**Current Phase**: Phase 2C Complete → Phase 3 Planning

This document outlines the prioritized roadmap for future development.

---

## ✅ Phase 2: Core Enhancements (COMPLETE!)

### 1. PDF Generation ✅ COMPLETE

**Status**: Fully implemented (Nov 11, 2025)
**Impact**: HIGH - Enables offline distribution of estimates/contracts

**What Was Built**:
- ✅ Professional estimate PDFs with jsPDF
- ✅ Contract PDFs with full legal formatting
- ✅ Client-side generation (instant, no server)
- ✅ Auto-generated filenames
- ✅ Works on all devices
- ✅ Signatures embedded in PDFs

---

### 2. Email Integration ✅ COMPLETE

**Status**: Fully implemented (Nov 11, 2025)
**Impact**: HIGH - Customers can receive estimates remotely

**What Was Built**:
- ✅ Send estimates to customer email
- ✅ Beautiful React Email templates
- ✅ Resend API integration (free tier)
- ✅ Email tracking and status updates
- ✅ Project status transitions (draft → quoted → sent)
- ✅ One-click email sending from estimate page

---

### 3. Digital Signatures ✅ COMPLETE

**Status**: Fully implemented (Nov 11, 2025)
**Impact**: MEDIUM - Enables fully digital contract workflow

**What Was Built**:
- ✅ Canvas-based signature capture
- ✅ Works with mouse, trackpad, or touch
- ✅ Customer and contractor signatures
- ✅ Signatures stored as base64 PNG in database
- ✅ Automatic timestamp on signing
- ✅ Update/replace signatures anytime
- ✅ Signatures embedded in contract PDFs

---

### 4. Contractor Templates System ✅ COMPLETE (Backend)

**Status**: API complete, UI missing (Nov 11, 2025)
**Impact**: HIGH - Makes app truly multi-contractor ready

**What Was Built**:
- ✅ Fully configurable floor types with custom pricing
- ✅ Configurable floor sizes with multipliers
- ✅ Configurable finishes and stains
- ✅ Auto-generated default hardwood template on first login
- ✅ Templates stored per contractor (multi-tenant ready)
- ✅ `/api/contractor-templates` API (GET, POST, PATCH)
- ✅ Floor selection page loads from contractor template
- ✅ Zero hardcoded values in floor selection

**Missing**: ❌ Settings UI to edit templates (API ready, UI not built)

---

### 5. Room Naming & History ✅ COMPLETE

**Status**: Fully implemented (Nov 11, 2025)
**Impact**: MEDIUM - Valuable for repeat business tracking

**What Was Built**:
- ✅ Custom room names in measurement flow
- ✅ Room data persists in project history
- ✅ Customer detail view shows room-by-room breakdown
- ✅ Dimensions and square footage per room displayed
- ✅ Editable room names (e.g., "Master Bedroom", "Kitchen")

---

## 🎯 Phase 3: Polish & Scale (Next Priority)

### 1. Template Editor UI (HIGH PRIORITY) ⭐

**Status**: Not started (API ready)
**Estimated Effort**: 1 week
**Impact**: HIGH - Complete the template system

**Requirements**:
- Settings page tab for "Product Catalog"
- Edit floor types (name, description, price, features, icon)
- Edit floor sizes (name, description, multiplier)
- Edit finishes (name, description, price)
- Edit stains (name, description, price, color picker)
- Add/remove items from each category
- Preview changes before saving
- Restore default hardwood template button

**Technical Approach**:
- New tab in `/src/app/settings/page.tsx`
- Form component for editing template JSON
- Use existing `/api/contractor-templates` endpoints
- Client-side validation
- Optimistic UI updates

**Acceptance Criteria**:
- [ ] Contractor can view current template
- [ ] Contractor can edit all fields
- [ ] Contractor can add/remove items
- [ ] Changes save to database
- [ ] Floor selection page immediately reflects changes
- [ ] Can restore default template

---

### 2. Logo Upload & Storage (MEDIUM PRIORITY)

**Status**: Database field exists, storage not configured
**Estimated Effort**: 3-4 days
**Impact**: MEDIUM - Professional branding

**Requirements**:
- Upload company logo in profile or settings
- Store in Supabase Storage
- Display logo on estimates and contracts
- Display logo in PDFs
- Image size/format validation
- Crop/resize functionality

**Technical Approach**:
- Configure Supabase Storage bucket
- Add upload component to settings page
- Image optimization before upload
- Update `logo_url` field in contractors table
- Modify PDF generation to include logo

---

### 3. Payment Tracking (HIGH PRIORITY) ⭐

**Status**: Requested by user
**Estimated Effort**: 2-3 weeks
**Impact**: HIGH - Critical for cash flow management

**Requirements**:
- Track payment schedule (60/30/10 or custom)
- Record payment received dates
- Calculate outstanding balance
- Mark projects as "paid in full"
- Payment history view per project
- Dashboard widget showing outstanding payments

**Technical Approach**:
- New `payments` table (project_id, amount, date, type, method)
- Update project detail page with payment section
- Add payment schedule field to projects
- Dashboard summary of receivables
- Optional: Automatic payment reminders

**Acceptance Criteria**:
- [ ] Set custom payment schedule per project
- [ ] Record payment received
- [ ] View payment history
- [ ] See total outstanding across all projects
- [ ] Filter projects by payment status

---

### 4. Photo Uploads (MEDIUM PRIORITY)

**Status**: Not started
**Estimated Effort**: 1-2 weeks
**Impact**: MEDIUM - Document work quality

**Requirements**:
- Upload before photos
- Upload after photos
- Attach photos to specific projects
- Display in project timeline
- Include in estimate/contract PDFs (optional)
- Gallery view in project detail

**Technical Approach**:
- Supabase Storage for images
- Image optimization and compression
- New `project_photos` table
- Photo gallery component
- Mobile camera integration

---

### 5. Custom Email Domain (LOW PRIORITY)

**Status**: Currently using resend.dev domain
**Estimated Effort**: 2-3 days
**Impact**: LOW - Professional appearance

**Requirements**:
- Configure custom sending domain in Resend
- DNS configuration guide
- Email from contractor's domain
- Maintain deliverability

---

## 🚀 Phase 4: Advanced Features (Future)

### Multi-Contractor Types

**Vision**: Support contractors beyond hardwood floors
- Painters (wall measurements, paint types, colors)
- Electricians (outlets, fixtures, labor hours)
- Plumbers (fixtures, materials, time estimates)
- General contractors (room-agnostic templates)

**Key Insight from User**:
> "He wants it to work for any type of contractor but I think those goals are at odds.
> If we stay focused on jobs that are square footage based to leverage the room creation
> stuff we've done that would be a good place to start."

**Recommended Approach**:
- Phase 1: Painters (similar to flooring - walls have sqft)
- Phase 2: Other sqft-based trades
- Phase 3: Time-based trades (electricians, plumbers)

---

### Recurring Service Scheduling

**Vision**: Predict when customers need repeat services

Based on room history data:
- "John's kitchen floor was refinished 3 years ago"
- "Typical refinishing interval is 5-7 years"
- "Send reminder email in 2024"

**Requirements**:
- Service interval settings per floor type
- Automatic reminder scheduling
- Customer communication opt-in
- CRM-lite features

---

### Team & Multi-User Support

**Vision**: Contractors with employees

**Requirements**:
- Sub-accounts for employees
- Role-based permissions
- Assign projects to team members
- Time tracking per project
- Payroll integration (future)

---

## 📊 User Feedback & Priorities

### From User (Nov 11, 2025):

**Core Philosophy**:
- Keep it "stupid simple" (user's words)
- Sensible defaults so contractors can start immediately
- Everything customizable but not required
- Focus on square footage-based contractor work

**Immediate Needs**:
1. ✅ Room naming → DONE
2. ✅ Configurable templates → DONE (API only)
3. ❌ Template editor UI → NEXT PRIORITY
4. ❌ Payment tracking → HIGH PRIORITY

**Long-term Vision**:
- Multi-contractor support (different trades)
- Stay focused on sqft-based work
- Leverage room/dimension tracking for repeat business
- "Know when they should want the next floor or painting"

---

## 🔄 Active Development Notes

### Database Migrations Pending

User needs to run these migrations in Supabase:

```sql
-- Migration 007: Room names
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS room_1_name TEXT,
ADD COLUMN IF NOT EXISTS room_2_name TEXT,
ADD COLUMN IF NOT EXISTS room_3_name TEXT;

-- Migration 008: Contractor templates
-- See file: supabase/migrations/008_create_contractor_templates.sql
-- (Full migration creates contractor_templates table with RLS)
```

### TypeScript Status
✅ Zero errors (as of Nov 11, 2025)

### Production Status
- Phase 2C complete and ready for production
- User (Jason Dixon) actively using app
- All core features functional

---

## 📝 Notes for Next Session

### Lowest Hanging Fruit:
1. **Template Editor UI** - API is ready, just need forms
2. **Logo Upload** - Field exists, just need Supabase Storage config
3. **Payment Tracking** - Most requested, high value

### Technical Debt:
- None identified - codebase is clean and well-structured
- All TypeScript errors resolved
- Mobile-optimized and responsive

### User Education Needed:
- How to customize templates (once UI is built)
- Payment tracking workflow (when built)
- Email domain configuration (when ready)

---

**End of Roadmap**

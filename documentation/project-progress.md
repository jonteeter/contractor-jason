# Lotus - Contractor Estimate & Contract App - Project Progress

**Client:** Jason (The Best Hardwood Flooring Co.)
**Payment:** $1k/month
**Last Updated:** 2025-11-03

## Current Status: Phase 1 Complete ✅

The application successfully allows Jason to:
- Log in securely
- Create customer records
- Select floor specifications
- Enter room measurements
- Generate estimates with editable costs
- Create and edit professional contracts
- View all projects in a searchable list

---

## Completed Features

### 1. Authentication & Security ✅
- **Login System** - Server-side authentication with Supabase
- **Protected Routes** - Middleware enforces authentication
- **RLS Policies** - Row Level Security on all database tables
- **Session Management** - Cookie-based sessions using @supabase/ssr

**Key Files:**
- `/src/app/login/page.tsx` - Login UI
- `/src/app/api/auth/login/route.ts` - Server-side login handler
- `/src/middleware.ts` - Route protection
- `/supabase/migrations/001_setup_schema.sql` - Database schema with RLS

### 2. Database Schema ✅
**Tables:**
- `contractors` - User accounts (linked to auth.users)
- `customers` - Customer information with address fields
- `projects` - Project details, floor specs, measurements, contract fields

**Key Fields Added in Phase 1:**
- `intro_message` TEXT - Editable intro message with default
- `work_description` TEXT - Detailed work description for Exhibit A
- `estimated_days` INTEGER - Timeline estimation
- `start_date` DATE - Project start date
- `completion_date` DATE - Expected completion date

**Migration Files:**
- `/supabase/migrations/001_setup_schema.sql` - Initial schema
- `/supabase/migrations/002_add_contract_fields.sql` - Contract fields

### 3. Customer Wizard ✅
**Route:** `/customer-wizard`

Creates new customers and draft projects. Saves data to database and stores project ID in localStorage for the workflow.

**Features:**
- Customer name, email, phone
- Full address (street, city, state, zip)
- Creates draft project automatically
- Navigates to floor selection

**Key Files:**
- `/src/app/customer-wizard/page.tsx`
- `/src/app/api/customers/route.ts` - POST endpoint

### 4. Floor Selection ✅
**Route:** `/floor-selection`

Captures floor specifications and updates the project in the database.

**Features:**
- Floor type (Red Oak, White Oak, Linoleum)
- Floor size (2", 2.5", 3")
- Finish type (Stain, Gloss, Semi-Gloss, Custom)
- Stain type (Natural, Golden Oak, Spice Brown)
- Proper enum mapping to database values

**Key Files:**
- `/src/app/floor-selection/page.tsx`
- `/src/app/api/projects/[id]/route.ts` - PATCH endpoint

### 5. Measurements ✅
**Route:** `/measurements`

Captures room dimensions and stair counts, calculates total square footage.

**Features:**
- Up to 3 rooms (length × width)
- Stair treads and risers count
- Automatic square footage calculation
- Cost estimation ($10/sqft base rate)
- Updates project status to 'quoted'

**Key Files:**
- `/src/app/measurements/page.tsx`

### 6. Projects List ✅
**Route:** `/projects`

Displays all projects with search and filter capabilities.

**Features:**
- Search by customer name or project name
- Filter by status (All, Draft, Quoted, Active, Completed)
- Click project to view estimate
- Real-time data from database

**Key Files:**
- `/src/app/projects/page.tsx`
- `/src/app/api/projects/route.ts` - GET all projects

### 7. Dashboard ✅
**Route:** `/dashboard`

Main hub showing statistics and quick actions.

**Features:**
- Project count statistics
- Customer count statistics
- Quick action cards (New Project, Projects List, Customers - coming soon)
- Real-time stats from database

**Key Files:**
- `/src/app/dashboard/page.tsx`

### 8. Estimate & Contract Page ✅
**Route:** `/estimate?projectId=xxx`

**Main Features:**
- Two tabs: Estimate and Contract
- Editable cost with inline editing
- Full contract with exact verbiage from Jason's template
- Editable contract details
- Modular component architecture

**Estimate Tab:**
- Company header with contact info
- Customer information display
- Project address
- Floor specifications
- Room measurements breakdown
- Total square footage
- Editable total cost (click to edit)
- Estimate disclaimer

**Contract Tab:**
- Editable intro message (outside legal contract)
- Full 8-Article contract matching Jason's template:
  - Article 1: Scope of the Work
  - Article 2: Time of Completion (uses actual dates)
  - Article 3: The Contract Price
  - Article 4: Progress Payments
  - Article 5: General Provisions (12 bullet points)
  - Article 6: Indemnification
  - Article 7: Insurance
  - Article 8: Additional Terms
- Exhibit A with editable work description
- Payment breakdown (60/30/10 split)
- Signature section
- Edit button to modify contract details

**Modular Components:**
- `/src/components/contracts/ContractEditor.tsx` - Form for editing contract details
- `/src/components/contracts/ContractTemplate.tsx` - Complete contract display

**Key Files:**
- `/src/app/estimate/page.tsx` - Main estimate/contract page (wrapped in Suspense)
- `/src/components/contracts/ContractEditor.tsx` - 118 lines
- `/src/components/contracts/ContractTemplate.tsx` - 239 lines

---

## Recent Bug Fixes

### Fix 1: localStorage SSR Error ✅
**Problem:** `localStorage is not defined` error when accessing estimate page

**Solution:**
- Moved localStorage access inside useEffect with `typeof window !== 'undefined'` check
- Changed projectId state initial value from `null` to `undefined` to distinguish between "not checked yet" vs "checked and not found"

**File:** `/src/app/estimate/page.tsx:81-96`

### Fix 2: Customer Data Missing After Save ✅
**Problem:** `Cannot read properties of undefined (reading 'name')` after saving contract details

**Solution:**
- Updated PATCH endpoint to include customer relationship data in response
- Added `.select('*, customer:customers(*)')` to the update query

**File:** `/src/app/api/projects/[id]/route.ts:27-30`

### Fix 3: Build Error - Suspense Boundary ✅
**Problem:** Next.js 15 requires `useSearchParams()` to be wrapped in Suspense boundary

**Solution:**
- Renamed component to `EstimatePageContent()`
- Created wrapper `EstimatePage()` with Suspense boundary
- Added loading fallback UI

**File:** `/src/app/estimate/page.tsx:572-585`

### Fix 4: TypeScript Build Error ✅
**Problem:** `.catch()` doesn't exist on Supabase RPC type

**Solution:**
- Replaced `.catch()` with proper try-catch block

**File:** `/scripts/fix-rls-policies.ts:32-38`

### Fix 5: Invalid Route in Dashboard ✅
**Problem:** Link to `/dashboard/customers` (route doesn't exist)

**Solution:**
- Removed Link component
- Made it a disabled placeholder with "Coming soon" text
- Added opacity-50 and cursor-not-allowed styling

**File:** `/src/app/dashboard/page.tsx:157-171`

---

## Technical Architecture

### Tech Stack
- **Framework:** Next.js 15.4.7 (App Router)
- **Language:** TypeScript 5.7.3
- **Database:** Supabase PostgreSQL
- **Auth:** Supabase Auth with @supabase/ssr
- **UI:** TailwindCSS + shadcn/ui components
- **Icons:** Lucide React

### Key Patterns
- **Server-Side API Routes** - All database operations go through API routes
- **Client Components** - Form pages use 'use client' directive
- **Type Safety** - Interfaces for all data models
- **Modular Components** - Long files split into reusable components
- **Suspense Boundaries** - Required for useSearchParams() in Next.js 15

### Database Access Pattern
```typescript
// Server-side only
import { createClient } from '@/lib/supabase/server'

// In API route
const supabase = await createClient()
const { data, error } = await supabase
  .from('projects')
  .select('*, customer:customers(*)')
  .eq('contractor_id', user.id)
```

### Next.js 15 Dynamic Routes
```typescript
// Must await params as Promise
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: projectId } = await params
  // ...
}
```

---

## Known Issues / Tech Debt

### Warnings (Non-Breaking)
- ⚠️ Metadata viewport/themeColor deprecation warnings across all pages
  - Recommendation: Move to viewport export (not urgent, just deprecation warnings)

### Missing Features
- **PDF Export** - Download button exists but not yet functional
- **Customers Page** - Placeholder on dashboard, not yet built
- **Contract Signature** - No digital signature capture yet
- **Email Sending** - No email functionality yet

---

## Workflow Overview

### Creating a New Project
1. **Dashboard** - Click "New Project"
2. **Customer Wizard** (`/customer-wizard`) - Enter customer info → Creates customer + draft project
3. **Floor Selection** (`/floor-selection`) - Choose floor specs → Updates project
4. **Measurements** (`/measurements`) - Enter room sizes → Calculates cost, sets status to 'quoted'
5. **Estimate** (`/estimate`) - Redirects automatically → View and edit estimate/contract

### Viewing Existing Projects
1. **Dashboard** or **Projects List** - Browse projects
2. Click project → Navigate to `/estimate?projectId=xxx`
3. **Estimate Tab** - Review specs, edit cost
4. **Contract Tab** - View contract, click "Edit Contract Details" to modify

---

## Database Schema Reference

### Contractors Table
```sql
CREATE TABLE contractors (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  company_name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Customers Table
```sql
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contractor_id UUID NOT NULL REFERENCES contractors(id),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Projects Table
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contractor_id UUID NOT NULL REFERENCES contractors(id),
  customer_id UUID NOT NULL REFERENCES customers(id),
  project_name TEXT NOT NULL,
  status project_status DEFAULT 'draft',

  -- Floor specifications
  floor_type floor_type_enum,
  floor_size floor_size_enum,
  finish_type finish_type_enum,
  stain_type stain_type_enum,

  -- Measurements
  room_1_length NUMERIC,
  room_1_width NUMERIC,
  room_2_length NUMERIC,
  room_2_width NUMERIC,
  room_3_length NUMERIC,
  room_3_width NUMERIC,
  stair_treads INTEGER DEFAULT 0,
  stair_risers INTEGER DEFAULT 0,
  total_square_feet NUMERIC,

  -- Pricing
  estimated_cost NUMERIC,

  -- Contract fields (added in migration 002)
  work_description TEXT,
  intro_message TEXT DEFAULT 'Thank you for choosing The Best Hardwood Flooring Co...',
  estimated_days INTEGER,
  start_date DATE,
  completion_date DATE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Environment Setup

### Required Environment Variables
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Test Account
- **Email:** jason@bestflooring.com
- **Password:** (user should have this)

---

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login handler (sets cookies)

### Customers
- `POST /api/customers` - Create customer + draft project
- Returns: `{ customer, project }`

### Projects
- `GET /api/projects` - Get all projects for logged-in contractor
- `GET /api/projects/[id]` - Get single project with customer data
- `PATCH /api/projects/[id]` - Update project (returns project with customer data)

---

## Build & Deployment

### Development
```bash
npm run dev
# Runs on http://localhost:3000
```

### Production Build
```bash
npm run build
# Builds successfully with warnings (viewport deprecation - non-breaking)
```

### Build Output (Latest)
```
Route (app)                              Size     First Load JS
├ ○ /                                    6.52 kB  153 kB
├ ○ /customer-wizard                     4.77 kB  112 kB
├ ○ /dashboard                           6.88 kB  153 kB
├ ○ /estimate                            9.73 kB  117 kB
├ ○ /floor-selection                     5.08 kB  112 kB
├ ○ /measurements                        5.16 kB  112 kB
├ ○ /projects                            3.89 kB  111 kB
└ ○ /login                               1.94 kB  109 kB
```

All pages build successfully and are statically pre-rendered.

---

## Next Steps (Future Work)

### High Priority
1. **PDF Export** - Generate downloadable PDF of estimate/contract
2. **Email Functionality** - Send estimates to customers
3. **Digital Signatures** - Capture customer signature on contracts

### Medium Priority
4. **Customers List Page** - Dedicated page to view/manage all customers
5. **Project Status Updates** - Mark projects as Active/Completed
6. **Payment Tracking** - Track the 60/30/10 payment schedule
7. **Search Improvements** - Filter by date range, cost range

### Low Priority
8. **Fix Metadata Warnings** - Move viewport/themeColor to viewport export
9. **Contract Templates** - Allow multiple contract templates
10. **Photo Upload** - Before/after photos for projects

---

## Key Learnings & Decisions

### Why Modular Components?
User requested better organization for long files. Split estimate page into:
- `ContractEditor.tsx` - 118 lines, handles form inputs
- `ContractTemplate.tsx` - 239 lines, displays full contract
- `estimate/page.tsx` - Main orchestrator

### Why Server-Side API Routes?
Security and proper cookie handling. Client-side Supabase calls don't properly set httpOnly cookies needed for authentication.

### Why Suspense Boundary?
Next.js 15 requires Suspense around components using `useSearchParams()` for proper SSR/SSG handling.

### Why Separate Intro Message?
User clarified that intro message (lines 1-7 of Jason's sample) is separate from the legal contract and should be editable with default text.

### Why No Blanks in Contract?
User requirement: "No blanks left on the contract." All fields either show actual data or say "To be determined."

---

## Contract Template Source

The contract verbiage comes from `/documentation/sample-contract-from-jason.md` which contains Jason's actual contract with 8 Articles plus Exhibit A.

**Key Sections:**
- Intro message (editable, outside contract)
- Article 1-8 (legal contract, uses exact verbiage)
- Exhibit A (editable work description)
- Payment breakdown (60% down, 30% second coat, 10% final)
- Signature section

---

## Important Notes

1. **Always include customer data** when fetching/updating projects via API
2. **Use server-side Supabase client** for all database operations
3. **Await dynamic route params** in Next.js 15 API routes
4. **Wrap useSearchParams()** in Suspense boundary
5. **Check localStorage only on client** using `typeof window !== 'undefined'`
6. **Default values everywhere** - Never show blank fields in contract

---

## File Structure

```
/lotus
├── /src/app
│   ├── /api
│   │   ├── /auth/login/route.ts
│   │   ├── /customers/route.ts
│   │   └── /projects
│   │       ├── route.ts
│   │       └── /[id]/route.ts
│   ├── /customer-wizard/page.tsx
│   ├── /dashboard/page.tsx
│   ├── /estimate/page.tsx (with Suspense)
│   ├── /floor-selection/page.tsx
│   ├── /login/page.tsx
│   ├── /measurements/page.tsx
│   └── /projects/page.tsx
├── /src/components
│   ├── /contracts
│   │   ├── ContractEditor.tsx
│   │   └── ContractTemplate.tsx
│   └── /ui (shadcn components)
├── /src/lib/supabase
│   ├── client.ts
│   ├── middleware.ts
│   └── server.ts
├── /supabase/migrations
│   ├── 001_setup_schema.sql
│   └── 002_add_contract_fields.sql
├── /documentation
│   ├── database-setup-instructions.md
│   ├── sample-contract-from-jason.md
│   └── project-progress.md (this file)
└── middleware.ts
```

---

**Status:** Production ready for Phase 1 features. Build passes. All core workflows functional.

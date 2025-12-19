# Tary - Development Roadmap

## Long-Term Vision

Tary is a **multi-level platform** connecting three core entities:

1. **Contractors** - Pay for platform, create estimates, track projects
2. **Customers** - Receive estimates, sign contracts, pay, rate contractors
3. **Properties** - Physical addresses with room data, job history, digital blueprints

### The Bigger Picture
- A customer (homeowner) works with multiple contractors (flooring, painting, plumbing)
- Each contractor using Tary contributes data about the property
- Properties accumulate a "digital blueprint" over time
- **Two-way reputation**: Contractors rate customers AND customers rate contractors
- Bad reviews from multiple contractors flag problematic clients
- Good contractor reviews attract better clients

### Industry Expansion
While initially built for **hardwood flooring contractors**, the platform generalizes to any contractor who:
- Bills by square foot or room dimensions
- Needs room measurements
- Creates estimates with configurable products/pricing
- Examples: painters, carpet installers, tile contractors, concrete finishers

---

## Phase 3: Customer Portal (NEXT PRIORITY)

See [CUSTOMER_PORTAL.md](../documentation/CUSTOMER_PORTAL.md) for detailed implementation plan.

### 3.1 Public Estimate Links
- Generate unique tokens for projects
- Public route `/view/[token]` - no auth required
- Display estimate details (read-only)
- Include contractor branding

### 3.2 Customer Self-Service Form
- Customer inputs their own info (name, address, phone, email)
- Optional: customer creates rooms before contractor visit
- Links to existing project or creates new one

### 3.3 Online Contract Signing
- Customer views contract at public URL
- Signature capture works on public page
- Email notification to contractor when signed
- Status auto-updates to "approved"

### 3.4 Payment Integration
- Stripe Checkout
- Track payments against project
- Support 60/30/10 or custom schedules
- Payment status visible to both parties

### 3.5 Customer Accounts (Optional)
- Customer can create account (magic link, no password)
- Dashboard shows projects from ALL contractors they've worked with
- View payment history across contractors
- Grouped by contractor for privacy

---

## Phase 4: Properties & Blueprints

### Properties as First-Class Entity
```sql
-- Future schema
CREATE TABLE properties (
  id UUID PRIMARY KEY,
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  property_type TEXT, -- 'residential' | 'commercial'
  year_built INTEGER,
  total_sqft INTEGER,
  created_at TIMESTAMPTZ
);

-- Link projects to properties (not just customers)
ALTER TABLE projects ADD COLUMN property_id UUID REFERENCES properties(id);

-- Room data becomes property-level, reusable across projects
CREATE TABLE property_rooms (
  id UUID PRIMARY KEY,
  property_id UUID REFERENCES properties(id),
  name TEXT,
  length DECIMAL,
  width DECIMAL,
  sqft DECIMAL,
  notes TEXT
);
```

### Digital Blueprint Vision
- Accumulate room data from every job at a property
- Show job history: "Flooring done 2024, Painting done 2025"
- Contractors can see previous work (if customer approves)
- Eventually: floor plans, photos, condition notes

---

## Phase 5: Reputation System

### Two-Way Ratings
```sql
CREATE TABLE ratings (
  id UUID PRIMARY KEY,
  project_id UUID REFERENCES projects(id),
  rater_type TEXT, -- 'contractor' | 'customer'
  rater_id UUID,
  ratee_type TEXT,
  ratee_id UUID,
  score INTEGER CHECK (score >= 1 AND score <= 5),
  review TEXT,
  created_at TIMESTAMPTZ
);
```

### Contractor Rates Customer
- Payment reliability (paid on time?)
- Communication quality
- Property access/readiness
- Overall experience

### Customer Rates Contractor
- Work quality
- Timeliness
- Communication
- Would recommend?

### Aggregate Scoring
- Customers with poor ratings from multiple contractors = red flag
- Contractors see customer score before accepting job
- Builds trust and accountability both directions

---

## Phase 6: Multi-Industry Templates

### Template System Enhancement
- "Floor Types" becomes generic "Product Types"
- Each industry gets a starter template
- Configurable measurement units (sqft, linear ft, etc.)

### Industry Templates
| Industry | Products | Measurement |
|----------|----------|-------------|
| Flooring | Wood species, finishes, stains | Square feet |
| Painting | Paint types, primers, finishes | Square feet |
| Carpet | Carpet types, padding, installation | Square feet |
| Tile | Tile types, grout, patterns | Square feet |
| Concrete | Finish types, staining, sealing | Square feet |

---

## Current Status

### Implemented
- Contractor auth & onboarding
- Customer management
- Room measurements with stairs
- Configurable product catalog (Settings)
- Estimate generation
- Contract signatures
- PDF generation & email
- Project workflow (draft → completed)
- Feedback widget for bug reports
- Admin dashboard

### In Settings Now
Jason can already customize floor types via:
**Settings → Product Catalog → Edit Catalog → + Add Floor Type**

Default now includes: Red Oak, White Oak, Cherry, Maple, Walnut, Hickory, Ash, Brazilian Cherry, Bamboo, Engineered Hardwood

---

## Out of Scope (For Now)
- Full accounting/invoicing
- Inventory management
- CRM email campaigns
- Project scheduling/calendar
- Real-time messaging

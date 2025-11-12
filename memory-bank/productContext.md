# Tary - Product Context and Business Requirements

## Application Overview
Tary is a production mobile-first flooring contractor management application serving Jason Dixon (The Best Hardwood Flooring Co.). The app streamlines the estimate-to-contract workflow, replacing manual processes with automated calculations and professional document generation.

## Real-World Usage
Jason uses Tary daily to:
- Create customer records with full contact information
- Generate instant flooring estimates with material and labor costs
- Produce legally compliant contracts matching his existing template
- Track all projects in a searchable dashboard
- Access everything from mobile devices at jobsites

## Core Problems Solved
1. ✅ **Time-Consuming Manual Estimates**: Automated calculations save 2+ hours per estimate
2. ✅ **Inconsistent Contract Quality**: Professional template ensures every contract is complete
3. ✅ **Mobile Accessibility**: Full functionality on phones/tablets for jobsite use
4. ✅ **Customer Data Management**: Organized storage with easy search and retrieval
5. ✅ **Pricing Transparency**: Real-time cost updates as selections are made

## Current Feature Set (Phase 1 & 2A - Implemented)

### Customer Management
- Full contact information (name, email, phone, address)
- Customer type tracking (new/existing)
- Automatic customer-project linking
- Search and filter capabilities

### Floor Specifications
- **Types**: Red Oak, White Oak, Linoleum (with pricing differentials)
- **Sizes**: 2", 2.5", 3" (premium pricing for larger planks)
- **Finishes**: Stain, Gloss, Semi-Gloss, Custom
- **Stains**: Natural, Golden Oak, Spice Brown (conditional on finish selection)
- Real-time pricing calculator showing running totals

### Measurements
- **Rooms**: Up to 3 rooms with length × width input
- **Stairs**: Tread and riser counts
- Automatic square footage calculations
- Mobile-optimized number inputs (prevents iOS zoom)

### Contract Generation
- Uses Jason's actual contract template (8 Articles + Exhibit A)
- Auto-populates all customer and project data
- Editable intro message
- Editable work description
- Timeline fields (start date, completion date, estimated days)
- Payment breakdown (60% down, 30% mid, 10% final)
- Signature sections for both parties

### Project Management
- Dashboard with statistics (project counts, customer counts)
- Projects list with search and status filters
- Status tracking (Draft, Quoted, Approved, In Progress, Completed)
- Individual project view with estimate and contract tabs

### Security & Authentication
- Supabase authentication (email/password)
- Row Level Security (RLS) on all database tables
- Server-side middleware for protected routes
- Cookie-based sessions using `@supabase/ssr`

### Foundational App Pages (Phase 2A - Implemented) ✅
- **Profile Management**: View and edit contractor information (company, contact, address)
- **Password Management**: Change password securely via Supabase Auth
- **Settings**: Configure email signature, default pricing, notifications, regional preferences
- **Customer Management**: Full CRUD operations on customers with search and filters
- **Customer Details**: View customer information with complete project history
- **Navigation System**: Profile dropdown menu with quick access to all pages
- **Consistent UX**: Back buttons and navigation patterns established across all pages

## Planned Features (Phase 2B - Not Yet Built)

### High Priority
- **PDF Export**: Download estimates and contracts as PDF
- **Email Integration**: Send estimates directly to customers
- **Digital Signatures**: Capture customer signatures on contracts
- **Payment Tracking**: Monitor 60/30/10 payment schedule
- **Customer List Page**: Dedicated customer management interface
- **Photo Uploads**: Before/after project photos

### Medium Priority
- **Multi-Contractor Support**: Platform for multiple companies
- **Sales Team Management**: Assign projects to team members
- **Subscription Tiers**: Basic, Professional, Enterprise plans
- **GPS Time Tracking**: Location-verified clock-in
- **Project Templates**: Reusable configurations

### Low Priority
- **Digital Business Cards**: QR code generation
- **Social Media Integration**: Share to Facebook, LinkedIn, etc.
- **Advanced Reporting**: Revenue tracking, project analytics
- **Mobile App**: Native iOS/Android using Capacitor

## Technical Requirements Met

### Mobile-First Design ✅
- Touch targets minimum 44×44px
- Safe area support for notched devices (iPhone X+)
- High contrast colors for outdoor visibility
- Responsive typography (mobile → tablet → desktop)
- Active states for tactile feedback
- Icon-only buttons on mobile to save space

### Performance ✅
- Next.js 15 App Router for optimal performance
- Server components for faster initial loads
- Real-time calculations without lag
- Production build size: ~150KB First Load JS
- Zero TypeScript compilation errors

### Data Management ✅
- PostgreSQL via Supabase
- Real-time subscriptions capability (not yet used)
- Automatic timestamp updates
- Foreign key relationships
- Database indexes for performance

### Security ✅
- Row Level Security (contractors can only see their own data)
- JWT authentication tokens
- HTTP-only cookies for session storage
- Server-side validation
- Protected API routes

## Outstanding Business Requirements

### Phase 2A Complete ✅
- ✅ **Profile Page**: Edit contractor information
- ✅ **Settings Page**: Configure app preferences
- ✅ **Customer Management**: Full CRUD with search/filter
- ✅ **Navigation System**: Profile dropdown and consistent back buttons

### Not Yet Implemented (Phase 2B)
- ❌ **PDF Generation**: Buttons exist but not functional
- ❌ **Email Delivery**: No email service integration (email signature field ready in settings)
- ❌ **Digital Signatures**: No signature capture component
- ❌ **Logo Upload**: Field exists but Supabase Storage not configured

### Future (Phase 3)
- ❌ **Offline Capability**: Requires service worker and local storage
- ❌ **Multi-Tenant**: Single contractor only (Jason)
- ❌ **Payment Processing**: No Stripe/payment integration
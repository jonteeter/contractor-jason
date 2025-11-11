# Technical Context and Setup

**Last Updated:** November 10, 2025
**Current Versions:** Next.js 15.4.7, React 19, TypeScript 5.7.3

---

## Technology Stack

### Frontend
- **Framework**: Next.js 15.4.7 (App Router)
- **UI Library**: React 19.0.0
- **Language**: TypeScript 5.7.3
- **Styling**: Tailwind CSS 3.4.17
- **Components**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React 0.469.0
- **Forms**: React Hook Form 7.54.2 + Zod 3.24.1
- **Animations**: Framer Motion 11.15.0

### Backend & Database
- **Database**: Supabase (PostgreSQL 17)
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Real-time (not yet used)
- **Storage**: Supabase Storage (not yet used)
- **Client Library**: @supabase/supabase-js 2.48.1
- **SSR Support**: @supabase/ssr 0.7.0

### Mobile Optimization
- **PWA Ready**: Configured for Progressive Web App
- **Mobile-First**: All components designed for mobile-up
- **Touch Optimization**: 44px minimum touch targets
- **Safe Areas**: iPhone notch and home bar support
- **No Native App Yet**: Capacitor planned for Phase 3

### Deployment
- **Hosting**: Vercel-ready
- **Build**: Static Site Generation (SSG) where possible
- **Environment**: .env.local for secrets

### Development Tools
- **Editor**: VS Code (recommended)
- **AI Assistant**: Claude Code (active)
- **Version Control**: Git
- **Package Manager**: npm
- **Node Version**: 20+

---

## Supabase Configuration

### Project Details
- **Project Name**: lotus
- **Project ID**: eonnbueqowenorscxugz
- **Project URL**: https://eonnbueqowenorscxugz.supabase.co
- **Dashboard**: https://supabase.com/dashboard/project/eonnbueqowenorscxugz

### API Keys
- **Anon Key**: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (in .env.local)
- **Service Role Key**: Stored securely in .env.local (admin operations only)

### Authentication Configuration
- **Provider**: Email/Password
- **Session Duration**: 7 days (default)
- **Cookie Storage**: HTTP-only cookies via @supabase/ssr
- **RLS**: Enabled on all tables

---

## Environment Setup

### Required Files

**`.env.local`** (not committed to Git):
```env
NEXT_PUBLIC_SUPABASE_URL=https://eonnbueqowenorscxugz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

**`.env.example`** (committed to Git):
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### Installation Steps

```bash
# Clone repository
git clone <repo-url>
cd lotus

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Then edit .env.local with actual values

# Run development server
npm run dev
# → http://localhost:3000

# Type check
npm run type-check

# Build for production
npm run build

# Start production server
npm run start
```

---

## Key Dependencies (Full List)

From [package.json](../package.json):

```json
{
  "dependencies": {
    "@hookform/resolvers": "^3.9.1",
    "@radix-ui/react-dialog": "^1.1.4",
    "@radix-ui/react-dropdown-menu": "^2.1.4",
    "@radix-ui/react-select": "^2.1.4",
    "@radix-ui/react-slot": "^1.1.1",
    "@radix-ui/react-toast": "^1.2.4",
    "@supabase/ssr": "^0.7.0",
    "@supabase/supabase-js": "^2.48.1",
    "@types/node": "^22.10.5",
    "@types/react": "^19.0.2",
    "@types/react-dom": "^19.0.2",
    "autoprefixer": "^10.4.20",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "eslint": "^9.18.0",
    "eslint-config-next": "^15.4.7",
    "framer-motion": "^11.15.0",
    "lucide-react": "^0.469.0",
    "next": "^15.4.7",
    "postcss": "^8.5.1",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-hook-form": "^7.54.2",
    "tailwind-merge": "^2.6.0",
    "tailwindcss": "^3.4.17",
    "tailwindcss-animate": "^1.0.7",
    "typescript": "^5.7.3",
    "zod": "^3.24.1"
  },
  "devDependencies": {
    "tsx": "^4.20.6"
  }
}
```

---

## Database Schema

### Tables

**contractors**
- id (UUID, PK, references auth.users)
- email (TEXT, unique)
- company_name (TEXT)
- contact_name (TEXT)
- phone (TEXT)
- address, city, state, zip_code (TEXT)
- subscription_plan (TEXT: basic, professional, enterprise)
- is_active (BOOLEAN)
- created_at, updated_at (TIMESTAMPTZ)

**customers**
- id (UUID, PK)
- contractor_id (UUID, FK → contractors)
- name (TEXT)
- email (TEXT)
- phone (TEXT)
- address, city, state, zip_code (TEXT)
- customer_type (TEXT: new, existing)
- created_at, updated_at (TIMESTAMPTZ)

**projects**
- id (UUID, PK)
- contractor_id (UUID, FK → contractors)
- customer_id (UUID, FK → customers)
- project_name (TEXT)
- floor_type (TEXT: red_oak, white_oak, linoleum)
- floor_size (TEXT: 2_inch, 2_5_inch, 3_inch)
- finish_type (TEXT: stain, gloss, semi_gloss, option)
- stain_type (TEXT: natural, golden_oak, spice_brown)
- stair_treads, stair_risers (INTEGER)
- room_1_length, room_1_width (NUMERIC)
- room_2_length, room_2_width (NUMERIC)
- room_3_length, room_3_width (NUMERIC)
- total_square_feet (NUMERIC)
- estimated_cost (NUMERIC)
- status (TEXT: draft, quoted, approved, in_progress, completed)
- work_description (TEXT)
- intro_message (TEXT)
- estimated_days (INTEGER)
- start_date, completion_date (DATE)
- created_at, updated_at (TIMESTAMPTZ)

### RLS Policies
All tables have Row Level Security enabled:
- Contractors can only see their own data
- Customers belong to specific contractors
- Projects belong to specific contractors

---

## Architecture Patterns

### Server vs Client Components

**Server Components (Default)**:
- Use `async` functions
- Fetch data directly
- No interactivity needed
- Examples: Layout, static pages

**Client Components** (`'use client'`):
- Need useState, useEffect, event handlers
- Browser-only APIs (localStorage, window)
- Interactive forms
- Examples: Dashboard, wizards, forms

### Authentication Pattern

**Client-side** ([src/lib/supabase/client.ts](../src/lib/supabase/client.ts)):
```typescript
import { createBrowserClient } from '@supabase/ssr'

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

**Server-side** ([src/lib/supabase/server.ts](../src/lib/supabase/server.ts)):
```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookies) => {
          cookies.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        }
      }
    }
  )
}
```

**Middleware** ([src/middleware.ts](../src/middleware.ts)):
- Protects routes: /dashboard, /customer-wizard, /floor-selection, /measurements, /estimate
- Redirects unauthenticated users to /login
- Redirects authenticated users away from /login

### Mobile-First CSS

From [src/app/globals.css](../src/app/globals.css):

```css
/* Safe area support for notched devices */
.safe-area-top { padding-top: env(safe-area-inset-top); }
.safe-area-bottom { padding-bottom: env(safe-area-inset-bottom); }
.safe-area-x {
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}

/* Mobile-first container */
.mobile-container {
  @apply w-full px-4 safe-area-x;
}

/* Touch targets (44px minimum for accessibility) */
.touch-target {
  @apply min-h-[44px] min-w-[44px];
}
```

**Responsive Breakpoints**:
- `default`: < 640px (mobile)
- `sm:`: 640px+ (large phone / small tablet)
- `md:`: 768px+ (tablet)
- `lg:`: 1024px+ (desktop)
- `xl:`: 1280px+ (large desktop)

---

## Build Configuration

### Next.js Config ([next.config.js](../next.config.js))

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false, // Strict type checking
  },
  eslint: {
    ignoreDuringBuilds: false, // Strict linting
  },
}

module.exports = nextConfig
```

### TypeScript Config ([tsconfig.json](../tsconfig.json))

- Strict mode enabled
- Path aliases: `@/*` → `./src/*`
- Target: ES2022

### Tailwind Config ([tailwind.config.js](../tailwind.config.js))

- Content paths include src/**/*.{ts,tsx}
- Custom theme extensions
- Animation plugin enabled

---

## Development Workflow

### Starting Development

```bash
# Start dev server with hot reload
npm run dev

# Open browser to http://localhost:3000
# Login with: jason@thebesthardwoodfloor.com
```

### Code Quality Checks

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build test
npm run build
```

### Database Management

```bash
# Test database connection
npm run db:test

# Access Supabase dashboard
open https://supabase.com/dashboard/project/eonnbueqowenorscxugz
```

### Common Tasks

**Add new page:**
1. Create `src/app/new-page/page.tsx`
2. Add to middleware if protected
3. Link from relevant pages

**Add new API route:**
1. Create `src/app/api/endpoint/route.ts`
2. Use server Supabase client
3. Return NextResponse.json()

**Add new database table:**
1. Create migration in `supabase/migrations/`
2. Run via Supabase dashboard SQL editor
3. Add RLS policies
4. Update TypeScript types

---

## Performance Optimization

### Current Metrics
- **First Load JS**: ~150KB
- **Build Time**: < 30 seconds
- **TypeScript Compilation**: Zero errors
- **Pages**: 8 routes, all SSG-ready

### Optimization Techniques Used
- Server components by default
- Lazy loading with Suspense
- Image optimization (not yet implemented - no images)
- Code splitting automatic via Next.js
- CSS-in-JS avoided (using Tailwind)

---

## Security Considerations

### Implemented
- ✅ Row Level Security on all tables
- ✅ HTTP-only cookies for sessions
- ✅ Server-side validation
- ✅ Protected API routes
- ✅ Environment variables for secrets
- ✅ TypeScript for type safety

### Not Yet Implemented
- ❌ Rate limiting
- ❌ CSRF protection
- ❌ Input sanitization library
- ❌ Security headers
- ❌ 2FA

---

## Testing Strategy

### Current State
- **Unit Tests**: None yet
- **Integration Tests**: None yet
- **E2E Tests**: None yet
- **Manual Testing**: Extensive on mobile devices

### Planned Testing
- Jest for unit tests
- Playwright for E2E tests
- Testing Library for component tests

---

## Deployment Process

### Production Readiness
- ✅ Build succeeds
- ✅ Zero TypeScript errors
- ✅ All pages SSG-compatible
- ✅ Environment variables documented
- ⚠️ Not yet deployed to public URL

### Vercel Deployment (When Ready)
1. Connect GitHub repo to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main
4. Domain: TBD

---

## Troubleshooting

### Common Issues

**"localStorage is not defined"**
- Cause: Accessing browser API in server component
- Fix: Use `'use client'` directive and `useEffect`

**"Middleware redirect loop"**
- Cause: Middleware config matching wrong routes
- Fix: Check matcher in src/middleware.ts

**"Supabase RLS error"**
- Cause: Missing or incorrect RLS policies
- Fix: Check policies in Supabase dashboard

**"Build fails with TypeScript errors"**
- Cause: Strict mode catches type issues
- Fix: Run `npm run type-check` and fix errors

### Debug Mode

Enable debug logging:
```typescript
// In browser console
localStorage.setItem('debug', 'supabase:*')
```

---

## Future Technical Improvements

### Phase 2
- Add PDF generation library
- Integrate email service
- Implement signature capture
- Add image uploads to Supabase Storage

### Phase 3
- Migrate to Capacitor for native apps
- Implement offline support with service worker
- Add real-time subscriptions for multi-user
- Set up Stripe for payments

---

**Last Review**: November 10, 2025
**Status**: All systems operational, ready for Phase 2 development

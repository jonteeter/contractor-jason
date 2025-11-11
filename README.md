# Tary - Contractor Management Platform

**Status**: Phase 1 Complete | **Client**: Jason Dixon | **Stack**: Next.js 15 + Supabase

Professional flooring contractor management application with mobile-first design, real-time cost calculations, and automated contract generation.

---

## 🚀 Quick Start

```bash
# Clone repository
git clone <repo-url>
cd lotus

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Run development server
npm run dev
# → Open http://localhost:3000

# Type check
npm run type-check

# Build for production
npm run build
```

---

## 📋 What This App Does

Tary streamlines the entire contractor workflow:

1. **Customer Intake** → Capture contact info and project type
2. **Floor Selection** → Choose materials with real-time pricing
3. **Measurements** → Input room dimensions and calculate square footage
4. **Cost Estimation** → Generate itemized estimates
5. **Contract Generation** → Create professional contracts with legal terms
6. **Project Management** → Track all estimates in searchable dashboard

---

## 💻 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript 5.7](https://www.typescriptlang.org/)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Auth**: Supabase Authentication
- **Styling**: [Tailwind CSS 3.4](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)

---

## 🗄️ Database Setup

See [DATABASE_SETUP.md](./DATABASE_SETUP.md) for detailed instructions.

**Quick Steps:**
1. Create Supabase project (or use existing: `eonnbueqowenorscxugz`)
2. Run migration from `supabase/migrations/001_initial_schema.sql`
3. Create contractor auth user + contractor record
4. Test connection with `npm run db:test`

**Tables:**
- `contractors` - Contractor companies
- `customers` - Customer contact info
- `projects` - Estimates and contracts

---

## 📱 Mobile-First Design

Every page optimized for mobile devices:

- ✅ Touch targets minimum 44×44px
- ✅ Safe area support for iPhone notches
- ✅ Responsive breakpoints (mobile → tablet → desktop)
- ✅ Icon-only buttons on mobile
- ✅ Active states for tactile feedback
- ✅ High contrast for outdoor visibility

---

## 🏗️ Project Structure

```
/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Landing page
│   │   ├── login/             # Authentication
│   │   ├── dashboard/         # Main hub
│   │   ├── customer-wizard/   # Customer intake
│   │   ├── floor-selection/   # Material picker
│   │   ├── measurements/      # Room measurements
│   │   ├── estimate/          # Estimate & contract
│   │   ├── projects/          # Projects list
│   │   └── api/               # API routes
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   └── contracts/         # Contract components
│   ├── contexts/              # React contexts (Auth)
│   └── lib/
│       ├── supabase/          # Supabase clients
│       └── utils/             # Utility functions
├── supabase/
│   └── migrations/            # Database migrations
├── memory-bank/               # Claude Code context docs
└── documentation/             # Reference materials
```

---

## 🔐 Authentication

Uses [Supabase Auth](https://supabase.com/docs/guides/auth) with Row Level Security (RLS):

- Email/password authentication
- HTTP-only cookies for sessions
- Server-side middleware protecting routes
- RLS policies ensure data isolation

**Test Account:**
- Email: `jason@thebesthardwoodfloor.com`
- Password: [User has credentials]

---

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server (port 3000)
npm run build        # Build for production
npm run start        # Start production server
npm run type-check   # TypeScript type checking
npm run lint         # ESLint code linting
npm run db:test      # Test database connection
```

### Adding New Features

1. Update [memory-bank/activeContext.md](./memory-bank/activeContext.md) with current work
2. Create feature branch (if using Git workflow)
3. Implement feature with tests
4. Update [memory-bank/progress.md](./memory-bank/progress.md)
5. Deploy and verify

### Code Standards

- **TypeScript**: Strict mode enabled
- **Linting**: ESLint with Next.js config
- **Formatting**: Prettier (if configured)
- **Mobile-First**: Design for mobile, then scale up
- **Accessibility**: WCAG 2.1 AA standards

---

## 📂 Key Files

| File | Purpose |
|------|---------|
| [src/app/page.tsx](./src/app/page.tsx) | Landing page with "Tary" branding |
| [src/app/dashboard/page.tsx](./src/app/dashboard/page.tsx) | Main dashboard with stats |
| [src/app/estimate/page.tsx](./src/app/estimate/page.tsx) | Estimate & contract generation |
| [src/components/contracts/ContractTemplate.tsx](./src/components/contracts/ContractTemplate.tsx) | Legal contract display |
| [src/middleware.ts](./src/middleware.ts) | Route protection |
| [src/lib/supabase/client.ts](./src/lib/supabase/client.ts) | Browser Supabase client |
| [src/lib/supabase/server.ts](./src/lib/supabase/server.ts) | Server Supabase client |

---

## 📖 Documentation

Comprehensive documentation in `/memory-bank/`:

- **[projectBrief.md](./memory-bank/projectBrief.md)** - Project overview and vision
- **[productContext.md](./memory-bank/productContext.md)** - Features and requirements
- **[techContext.md](./memory-bank/techContext.md)** - Technical details and setup
- **[activeContext.md](./memory-bank/activeContext.md)** - Current development state
- **[progress.md](./memory-bank/progress.md)** - Complete progress tracker
- **[NEXT_FEATURES.md](./memory-bank/NEXT_FEATURES.md)** - Roadmap (Phase 2+)
- **[TECHNICAL_DEBT.md](./memory-bank/TECHNICAL_DEBT.md)** - Known issues

---

## 🚢 Deployment

### Vercel (Recommended)

1. Connect GitHub repo to [Vercel](https://vercel.com/)
2. Add environment variables in project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Deploy automatically on push to main branch

### Other Platforms

The app is a standard Next.js application and can be deployed to:
- [Netlify](https://netlify.com/)
- [AWS Amplify](https://aws.amazon.com/amplify/)
- [Cloudflare Pages](https://pages.cloudflare.com/)
- Any Node.js hosting

---

## ✅ Phase 1 Complete (Current Status)

### Implemented Features
- ✅ Authentication with Supabase
- ✅ Customer intake wizard
- ✅ Floor selection with real-time pricing
- ✅ Room & stair measurements
- ✅ Cost estimation
- ✅ Professional contract generation
- ✅ Projects dashboard
- ✅ Mobile-optimized UI
- ✅ Row Level Security

### Production Ready
- Zero TypeScript errors
- All pages mobile-responsive
- Build succeeds without warnings
- Database schema stable
- RLS policies enforced

---

## 🚧 Phase 2 Roadmap

### High Priority (Next Sprint)
- [ ] PDF generation (estimate + contract)
- [ ] Email integration (send to customers)
- [ ] Digital signatures
- [ ] Customer list page
- [ ] Payment tracking (60/30/10 split)

### Medium Priority
- [ ] Photo uploads (before/after)
- [ ] Advanced search and filters
- [ ] Project templates
- [ ] Reporting & analytics

### Low Priority (Phase 3)
- [ ] Multi-contractor platform
- [ ] Sales team management
- [ ] Mobile app (Capacitor)
- [ ] Digital business cards
- [ ] GPS time tracking

See [memory-bank/NEXT_FEATURES.md](./memory-bank/NEXT_FEATURES.md) for detailed roadmap.

---

## 🐛 Known Issues

- ⚠️ Next.js 15 viewport deprecation warnings (cosmetic only)
- ❌ PDF download buttons non-functional (planned Phase 2)
- ❌ Email buttons non-functional (planned Phase 2)
- ❌ No signature capture yet (planned Phase 2)

See [memory-bank/TECHNICAL_DEBT.md](./memory-bank/TECHNICAL_DEBT.md) for complete list.

---

## 📝 Environment Variables

Required in `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://eonnbueqowenorscxugz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Optional (for admin operations)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

See `.env.example` for template.

---

## 🤝 Contributing

This is a client project for Jason Dixon (The Best Hardwood Flooring Co.).

For internal development:
1. Create feature branch from `main`
2. Make changes with tests
3. Update documentation
4. Submit for review
5. Merge to `main` after approval

---

## 📄 License

Proprietary - All rights reserved.

---

## 📞 Support

For issues or questions:
- Check [memory-bank/activeContext.md](./memory-bank/activeContext.md) for current status
- Review [memory-bank/progress.md](./memory-bank/progress.md) for completed features
- See [DATABASE_SETUP.md](./DATABASE_SETUP.md) for database issues

---

## 🎉 Credits

**Client**: Jason Dixon (The Best Hardwood Flooring Co.)
**Development**: Claude Code assisted development
**Framework**: Built with Next.js and Supabase
**Inspiration**: Modern contractor management needs

---

**Current Status**: ✅ Phase 1 Production-Ready | 🚧 Phase 2 Planning | 💭 Phase 3 Future

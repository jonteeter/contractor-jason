# Technical Context and Setup

## Technology Stack
- **Frontend**: Next.js 15, React 18, TypeScript 5+
- **Styling**: Tailwind CSS 3.4+, Tailwind UI components, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Real-time)
- **Mobile**: Capacitor 6+ for iOS/Android app wrapper
- **Deployment**: Vercel for web, native app stores for mobile
- **AI Development**: Cline with Claude 3.5 Sonnet

## Development Environment
- Node.js 20+
- VS Code with Cline extension
- Git version control
- Supabase CLI for local development
- Capacitor CLI for mobile builds

## Key Dependencies
```json
{
  "next": "^15.0.0",
  "react": "^18.0.0",
  "typescript": "^5.0.0",
  "@supabase/supabase-js": "^2.0.0",
  "@capacitor/core": "^6.0.0",
  "tailwindcss": "^3.4.0",
  "framer-motion": "^11.0.0"
}

## Supabase Configuration
- **Project URL**: https://eonnbueqowenorscxugz.supabase.co
- **Anon Key**: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvbm5idWVxb3dlbm9yc2N4dWd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NTU3MzUsImV4cCI6MjA3MTEzMTczNX0.Vqwr9rr3D6a0h1RX5XE_2eeJaoW19HN7sVtyaYSEgWE
- **Service Role Key**: your_service_role_key_here (for admin operations)
- **Project ID**: your-project-ref
- **Database Password**: [stored in .env.local]

## Environment Variables Required
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
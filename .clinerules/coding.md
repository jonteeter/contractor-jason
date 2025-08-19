# Core Coding Standards

## Code Quality Requirements
- Use TypeScript for all new code with strict mode enabled
- Follow ESLint configuration strictly, no warnings allowed
- Write unit tests for all business logic functions
- Use Prettier for consistent code formatting
- Implement proper error handling with try-catch blocks

## Architecture Guidelines
- Server Components first, Client Components only when necessary
- Use Next.js App Router exclusively (no Pages Router)
- Implement loading states and error boundaries for all async operations
- Use Supabase client-side and server-side patterns appropriately
- Follow atomic design principles for components

## Performance Standards
- Maintain Lighthouse score above 90 for all metrics
- Implement proper image optimization with next/image
- Use dynamic imports for code splitting where beneficial
- Minimize bundle size through tree shaking
- Implement proper caching strategies

## Mobile-First Requirements
- All designs must work perfectly on mobile devices first
- Touch targets minimum 44px for accessibility
- Implement proper offline functionality with service workers
- Use responsive design patterns with Tailwind breakpoints
- Test on actual devices, not just browser simulation
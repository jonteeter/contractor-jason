**memory-bank/systemPatterns.md**
```markdown
# System Architecture and Design Patterns

## Architecture Decisions
- **Server Components First**: Use Next.js 15 Server Components for optimal performance
- **Progressive Web App**: PWA capabilities for offline functionality
- **Mobile-First Design**: All components designed for mobile first, then desktop
- **Component-Driven Development**: Atomic design system with reusable components

## Key Design Patterns
- **Repository Pattern**: Centralized data access through Supabase client
- **Component Composition**: Build complex UIs from simple, reusable components
- **Error Boundaries**: Graceful error handling with user-friendly messages
- **Optimistic Updates**: Immediate UI updates with background synchronization

## State Management
- **Server State**: Supabase real-time subscriptions
- **Client State**: React useState/useReducer for local UI state
- **Form State**: React Hook Form for complex forms
- **Global State**: Context API for user authentication and preferences

## Security Patterns
- **Row Level Security**: Supabase RLS for data access control
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access**: Different permissions for contractors, workers, clients
- **Input Validation**: Comprehensive validation on both client and server
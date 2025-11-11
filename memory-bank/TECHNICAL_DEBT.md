# Technical Debt & Known Issues

**Project**: Tary Contractor App
**Last Updated**: November 10, 2025
**Review Frequency**: Monthly or before major releases

This document tracks technical debt, known bugs, and improvement opportunities.

---

## 🐛 Known Bugs (Active)

### None Currently Identified ✅

All known bugs have been resolved. The application is stable and production-ready.

---

## ⚠️ Non-Blocking Warnings

### 1. Next.js 15 Metadata Deprecation Warnings

**Issue**: Viewport and themeColor in metadata objects are deprecated

**Impact**: None - cosmetic warnings only, functionality works fine

**Warning Message**:
```
Warning: The metadata viewport, themeColor, etc. should be moved to a viewport export
```

**Affected Files**:
- All pages with metadata exports

**Fix** (Low Priority):
```typescript
// Current (deprecated)
export const metadata = {
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#0f172a'
}

// Recommended
export const viewport = {
  width: 'device-width',
  initialScale: 1,
}
export const themeColor = '#0f172a'
```

**Priority**: 🟡 Low - Cosmetic warning only
**Estimated Effort**: 30 minutes
**Recommended**: Fix before Next.js 16 release

---

## 🚧 Incomplete Features

### 1. PDF Download Functionality

**Status**: Buttons exist but non-functional

**Issue**: "Download PDF" buttons on estimate page don't actually generate PDFs

**Impact**: Users cannot save estimates/contracts offline

**Current Behavior**: Button exists but clicking does nothing

**Required Work**:
- Implement PDF generation library
- Create PDF templates for estimate and contract
- Wire up download functionality

**Priority**: ⭐⭐⭐ High - Blocking Phase 2
**Estimated Effort**: 1-2 weeks
**Tracked In**: [NEXT_FEATURES.md](./NEXT_FEATURES.md#1-pdf-generation-high-priority)

---

### 2. Email Functionality

**Status**: Email buttons exist but non-functional

**Issue**: Cannot send estimates/contracts to customers via email

**Impact**: Users must manually share estimates

**Current Behavior**: Button exists but clicking does nothing

**Required Work**:
- Set up email service (Resend recommended)
- Create email templates
- Implement send functionality
- Track email sent status

**Priority**: ⭐⭐⭐ High - Blocking Phase 2
**Estimated Effort**: 1-2 weeks
**Tracked In**: [NEXT_FEATURES.md](./NEXT_FEATURES.md#2-email-integration-high-priority)

---

### 3. Customer List Page Missing

**Status**: Dashboard link exists but page doesn't

**Issue**: "Customers" button on dashboard goes to non-existent route

**Impact**: No dedicated customer management interface

**Current Behavior**: Link is disabled with opacity

**Required Work**:
- Create `/customers` route
- Build customer list UI
- Implement search and filter
- Customer detail view

**Priority**: ⭐⭐ Medium
**Estimated Effort**: 1 week
**Tracked In**: [NEXT_FEATURES.md](./NEXT_FEATURES.md#4-customer-list-page-medium-priority)

---

### 4. No Digital Signature Capture

**Status**: Not started

**Issue**: Contracts require manual signatures

**Impact**: Cannot complete fully digital workflow

**Current Behavior**: Contract displays signature areas but no capture mechanism

**Required Work**:
- Implement signature capture component
- Store signatures in database
- Display signatures on contract

**Priority**: ⭐⭐ Medium
**Estimated Effort**: 2-3 weeks
**Tracked In**: [NEXT_FEATURES.md](./NEXT_FEATURES.md#3-digital-signatures-medium-priority)

---

## 🔧 Code Quality Improvements

### 1. No Unit Tests

**Issue**: Zero test coverage

**Impact**: Refactoring is risky, harder to catch regressions

**Recommendation**:
- Add Jest and React Testing Library
- Test utility functions first
- Add component tests for critical flows
- Aim for 70%+ coverage

**Priority**: 🟡 Medium - Becomes critical as codebase grows
**Estimated Effort**: 2-3 weeks
**Target Coverage**: 70%

**Files to Test First**:
- `src/lib/utils/index.ts` - Utility functions
- `src/app/api/**/route.ts` - API endpoints
- `src/components/contracts/*` - Contract components

---

### 2. No Integration Tests

**Issue**: API routes have no automated tests

**Impact**: Database operations not verified

**Recommendation**:
- Add Supertest for API testing
- Test CRUD operations
- Test RLS policies
- Mock Supabase client

**Priority**: 🟡 Medium
**Estimated Effort**: 1-2 weeks

---

### 3. No E2E Tests

**Issue**: Critical user flows not tested end-to-end

**Impact**: Manual testing required for each release

**Recommendation**:
- Add Playwright or Cypress
- Test complete workflows:
  - Login → Dashboard
  - Create customer → Create project → Generate contract
  - Search projects
  - Edit estimate

**Priority**: 🟡 Medium
**Estimated Effort**: 2 weeks

---

### 4. Shared Form Components Not Extracted

**Issue**: Form input patterns repeated across pages

**Impact**: Harder to maintain consistency

**Current State**:
- Similar input styling in customer-wizard, floor-selection, measurements
- Copy-pasted validation logic

**Recommendation**:
- Create reusable form components:
  - `FormInput.tsx` - Text inputs with validation
  - `FormSelect.tsx` - Dropdown selects
  - `FormTextarea.tsx` - Text areas
- Use with React Hook Form

**Priority**: 🟢 Low - Works fine, just not DRY
**Estimated Effort**: 3-4 days

---

### 5. No Error Boundaries

**Issue**: Unhandled errors crash entire page

**Impact**: Poor user experience when errors occur

**Recommendation**:
- Add error boundaries to:
  - Root layout
  - Each major page
  - API routes (server-side)
- Show user-friendly error messages
- Log errors for debugging

**Priority**: 🟡 Medium
**Estimated Effort**: 2-3 days

---

### 6. Loading States Use Spinners Not Skeletons

**Issue**: Generic loading spinners instead of content placeholders

**Impact**: Perceived performance could be better

**Recommendation**:
- Replace spinners with skeleton loaders
- Match skeleton shape to actual content
- Improve perceived loading time

**Priority**: 🟢 Low - Nice to have
**Estimated Effort**: 2-3 days

---

## 🔐 Security Considerations

### 1. No Rate Limiting

**Issue**: API routes have no rate limiting

**Impact**: Vulnerable to abuse/DoS attacks

**Recommendation**:
- Add rate limiting middleware
- Limit requests per IP/user
- Different limits for different endpoints

**Priority**: 🟡 Medium - Important for production
**Estimated Effort**: 2-3 days

**Libraries**: `upstash/ratelimit` or `express-rate-limit`

---

### 2. No CSRF Protection

**Issue**: Forms don't have CSRF tokens

**Impact**: Vulnerable to cross-site request forgery

**Recommendation**:
- Add CSRF token generation and validation
- Next.js middleware for CSRF protection

**Priority**: 🟡 Medium - Important for production
**Estimated Effort**: 1-2 days

---

### 3. Input Sanitization Not Comprehensive

**Issue**: Relying on database constraints, not input sanitization

**Impact**: Potential for injection attacks

**Recommendation**:
- Add input sanitization library (DOMPurify)
- Sanitize all user inputs before storage
- Validate with Zod schemas everywhere

**Priority**: 🟡 Medium
**Estimated Effort**: 1 week

---

### 4. No 2FA Support

**Issue**: Only email/password authentication

**Impact**: Less secure for contractors

**Recommendation**:
- Add Supabase 2FA/MFA
- Optional for users
- SMS or authenticator app

**Priority**: 🟢 Low - Future enhancement
**Estimated Effort**: 1-2 weeks

---

## ⚡ Performance Optimizations

### 1. No Image Optimization

**Issue**: No images used yet, but will need optimization

**Impact**: Not applicable yet

**Recommendation**:
- Use Next.js Image component when adding images
- Set up Supabase Storage for images
- Implement image compression

**Priority**: 🟢 Low - Not needed yet
**Estimated Effort**: N/A

---

### 2. No Query Caching

**Issue**: Supabase queries fetch fresh data every time

**Impact**: Unnecessary network requests

**Recommendation**:
- Add SWR or React Query
- Cache frequently accessed data
- Revalidate on mutation

**Priority**: 🟢 Low - App is fast enough
**Estimated Effort**: 1 week

---

### 3. No Code Splitting Beyond Default

**Issue**: Relying only on Next.js automatic code splitting

**Impact**: First load JS could be smaller

**Recommendation**:
- Dynamic imports for heavy components
- Lazy load modals and dialogs
- Route-based splitting (already done)

**Priority**: 🟢 Low - Bundle size acceptable (~150KB)
**Estimated Effort**: 2-3 days

---

### 4. No Service Worker / Offline Support

**Issue**: App doesn't work offline

**Impact**: Cannot use at jobsites with poor connectivity

**Recommendation**:
- Add service worker for PWA
- Cache static assets
- IndexedDB for offline data
- Background sync when online

**Priority**: 🟡 Medium - Important for jobsite use
**Estimated Effort**: 2-3 weeks

**Note**: User previously removed service worker due to redirect issues. Needs careful implementation.

---

## 📐 Architecture Improvements

### 1. No Centralized Error Handling

**Issue**: Error handling scattered across components

**Impact**: Inconsistent error messages

**Recommendation**:
- Create error handling utility
- Standardize error responses
- Toast notifications for errors

**Priority**: 🟡 Medium
**Estimated Effort**: 3-4 days

---

### 2. No API Response Types

**Issue**: API responses not typed beyond basic interfaces

**Impact**: Type safety gaps between frontend/backend

**Recommendation**:
- Create shared types for API responses
- Use Zod for runtime validation
- Generate types from database schema

**Priority**: 🟡 Medium
**Estimated Effort**: 1 week

---

### 3. Environment-Specific Configurations

**Issue**: Only one environment (.env.local)

**Impact**: No staging environment

**Recommendation**:
- Add .env.development, .env.staging, .env.production
- Environment-specific Supabase projects
- Deployment pipelines for each environment

**Priority**: 🟢 Low - Single user app currently
**Estimated Effort**: 1-2 days

---

## 📱 Mobile-Specific Issues

### 1. No Native Camera Integration

**Issue**: Using browser file picker for photos

**Impact**: Suboptimal mobile photo experience

**Recommendation**:
- Capacitor camera plugin
- Direct camera access
- Native gallery picker

**Priority**: 🟢 Low - No photos yet
**Estimated Effort**: Included in mobile app work

---

### 2. No Push Notifications

**Issue**: No way to notify users of updates

**Impact**: Limited engagement

**Recommendation**:
- Add push notification support
- Notify when estimate is approved
- Remind about payment due

**Priority**: 🟢 Low - Future enhancement
**Estimated Effort**: 1 week

---

## 🗄️ Database Improvements

### 1. No Database Backups Documented

**Issue**: Unclear backup strategy

**Impact**: Data loss risk

**Recommendation**:
- Document Supabase backup settings
- Test restore process
- Consider additional backups

**Priority**: 🟡 Medium - Critical for production
**Estimated Effort**: 1 day (documentation)

---

### 2. No Database Migrations Strategy

**Issue**: Migrations run manually via SQL editor

**Impact**: Error-prone, no rollback

**Recommendation**:
- Use Supabase CLI for migrations
- Version control migrations
- Automated migration testing

**Priority**: 🟡 Medium
**Estimated Effort**: 2-3 days

---

### 3. No Soft Deletes

**Issue**: Records deleted permanently

**Impact**: Cannot recover accidentally deleted data

**Recommendation**:
- Add `deleted_at` column to tables
- Filter queries to exclude deleted
- Admin UI to restore deleted records

**Priority**: 🟢 Low - Can implement as needed
**Estimated Effort**: 1 week

---

## 📊 Monitoring & Observability

### 1. No Error Tracking

**Issue**: No visibility into production errors

**Impact**: Don't know when things break

**Recommendation**:
- Add Sentry or similar
- Track errors and crashes
- Alert on critical errors

**Priority**: 🟡 Medium - Critical for production
**Estimated Effort**: 1 day

---

### 2. No Analytics

**Issue**: No usage metrics

**Impact**: Don't know how app is used

**Recommendation**:
- Add privacy-friendly analytics (Plausible, PostHog)
- Track key metrics:
  - Projects created
  - Contracts generated
  - User retention

**Priority**: 🟢 Low - Nice to have
**Estimated Effort**: 2 days

---

### 3. No Performance Monitoring

**Issue**: No visibility into performance issues

**Impact**: Slow pages go unnoticed

**Recommendation**:
- Add performance monitoring
- Track Core Web Vitals
- Monitor API response times

**Priority**: 🟢 Low
**Estimated Effort**: 2 days

---

## 📝 Documentation Gaps

### 1. No API Documentation

**Issue**: API routes not documented

**Impact**: Hard for other developers to understand

**Recommendation**:
- Document all API endpoints
- Request/response examples
- Error codes and handling

**Priority**: 🟢 Low - Single developer currently
**Estimated Effort**: 2-3 days

---

### 2. No Component Storybook

**Issue**: Components not catalogued

**Impact**: Hard to see available components

**Recommendation**:
- Add Storybook
- Document all shared components
- Include usage examples

**Priority**: 🟢 Low - Nice to have
**Estimated Effort**: 1 week

---

## 🎯 Prioritization Summary

### Fix Immediately (Before Production Launch)
- ❌ None - app is production-ready

### Fix Soon (Next Sprint)
- Rate limiting
- CSRF protection
- Error boundaries
- Error tracking (Sentry)

### Fix Eventually (Low Priority)
- Unit/integration/E2E tests
- Code splitting
- Shared form components
- Soft deletes
- Analytics

### Future Considerations
- 2FA support
- Offline support
- Push notifications
- Storybook

---

## 🔄 Review Process

**Monthly Review**: Check this document, update priorities, close resolved items

**Before Major Releases**: Review High/Medium priority items, fix blocking issues

**After User Feedback**: Add new items reported by Jason or other users

---

**Last Review**: November 10, 2025
**Next Review**: December 2025
**Status**: Application is stable, no critical issues

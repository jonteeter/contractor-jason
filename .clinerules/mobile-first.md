# Mobile-First Development Rules

## Design Principles
- Design for thumb navigation and one-handed use
- Use high contrast colors for outdoor visibility
- Implement large touch targets (minimum 44px)
- Provide immediate visual feedback for all interactions
- Use progressive disclosure to avoid information overload

## Offline-First Development
- All critical features must work offline
- Implement proper data synchronization when connection restored
- Show clear indicators for online/offline status
- Provide meaningful error messages for connectivity issues
- Cache essential data and images locally

## Performance on Mobile
- Target sub-3 second load times on 3G connections
- Implement lazy loading for images and non-critical content
- Use proper image compression and WebP format
- Minimize JavaScript bundle size for faster parsing
- Implement proper loading states and skeleton screens

## Capacitor Integration
- Use native device features appropriately (camera, GPS, push notifications)
- Test on actual iOS and Android devices regularly
- Implement proper native navigation patterns
- Handle device-specific considerations (safe areas, status bars)
- Use native performance monitoring tools
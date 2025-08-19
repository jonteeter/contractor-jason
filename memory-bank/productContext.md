# Lotus Contractor App - Product Context and Business Requirements

## Industry Context
The flooring industry relies heavily on accurate measurements, clear communication of options, and professional contract presentation. The original 2017 specification addressed these needs but used outdated native development approaches that were expensive and hard to maintain.

## Core User Problems (from PDF Analysis)
1. **Customer Option Complexity**: Need clear interface for floor types, sizes, finishes, and stains
2. **Measurement Accuracy**: Critical measurements for stairs (treads/risers) and multiple rooms
3. **Contract Generation**: Professional contracts with auto-populated customer and project data
4. **Multi-User Management**: (Phase 2) Multiple contractors with sales team assignment
5. **Time Tracking**: (Phase 2) GPS-enabled clock-in for sales persons
6. **Business Development**: (Phase 3) Digital business cards for lead generation

## Specific Requirements from PDF

### Phase 1 Features
- **Customer Selection**: New customer (contact form) vs Existing customer (estimate/refinishing options)
- **Floor Options**: 
  - Types: Red Oak, White Oak, Linoleum
  - Sizes: 2", 2.5", 3" (predefined dropdown)
  - Finishes: Stain, Gloss, Semi-gloss, Option
  - Stains: Natural, Golden Oak, Spice Brown
- **Measurements**: 
  - Stairs: Number of treads and risers
  - Rooms: Manual entry for Room 1, Room 2, Room 3 (length x width)
- **Contract Generation**: Auto-populate customer info and measurements into contract template

### Phase 2 Features  
- **Multi-Contractor Support**: Multiple companies can use the platform
- **Sales Team Management**: Contractors assign projects to sales persons
- **Subscription Packages**: Limit number of sales persons based on plan
- **Digital Signatures**: Contractors can sign contracts digitally
- **GPS Time Tracking**: Clock-in functionality with location verification
- **Project Assignment**: Contractors assign specific projects to sales team members

### Phase 3 Features
- **Digital Business Cards**: 3-5 templates with contractor branding
- **Auto-Population**: Contact info automatically fills template fields
- **QR Code Generation**: Business card info stored as QR code
- **Social Media Sharing**: Facebook, Twitter, LinkedIn, Instagram integration

## Key Business Requirements
- **Mobile-First Design**: Must work perfectly on tablets and phones (jobsite use)
- **Professional Appearance**: Compete with $100k native app quality
- **Offline Capability**: Essential for jobsites with poor connectivity
- **Real-time Sync**: Multi-user updates when connected
- **Scalable Architecture**: Support growth from single contractor to multiple companies
- **Contract Integration**: Professional PDF generation and email delivery
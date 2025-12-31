# Billing Module

## Overview

The Billing Module is a comprehensive ERP feature that automates client invoice generation based on attendance data and pre-configured rate cards.

## Folder Structure

```
Features/Billing/
├── Components/
│   ├── BillingSidebar.jsx          # Dedicated sidebar for billing module
│   ├── BillingLayout.jsx           # Layout wrapper (sidebar + content)
│   ├── DashboardStats.jsx          # Revenue, invoices, margin stats cards
│   ├── QuickActions.jsx            # Quick action buttons
│   └── RecentActivity.jsx          # Activity feed component
├── Pages/
│   ├── BillingDashboard.jsx        # Main dashboard page
│   └── AutoBilling/                # (To be implemented)
├── Services/
│   └── billingService.js           # localStorage CRUD operations
└── data/
    └── billingConstants.js         # Constants, dummy data, enums
```

## Features Implemented

### ✅ Phase 1: Dashboard & Navigation (COMPLETE)

1. **Dashboard**
   - 4 stat cards: Revenue, Pending Invoices, Profit Margin, Active Clients
   - Quick Actions section with navigation
   - Recent Activity feed
   - Getting Started guide
   - Fully responsive design

2. **Navigation**
   - Special sidebar behavior: Clicking "Billing Module" from main sidebar shows dedicated billing sidebar
   - Back button returns to main accounts module
   - Hierarchical menu with collapsible sections:
     - Billing (Auto, Manual, Arrear, Bonus)
     - Management (Proforma, IRN, Invoice List)

3. **Service Layer**
   - localStorage-based CRUD operations
   - Invoice management
   - Rate card operations
   - Activity logging
   - Dashboard stats calculation

## Routes

Base path: `/dashboard/billing-manager/`

- `billing-dashboard` - Main dashboard
- `auto-billing` - Auto billing wizard (placeholder)
- `manual-billing` - Manual billing form (placeholder)
- `arrear-billing` - Arrear billing (placeholder)
- `bonus-billing` - Bonus/leave encashment (placeholder)
- `proforma-invoices` - Proforma invoices list (placeholder)
- `irn-invoices` - IRN generated invoices (placeholder)
- `invoice-list` - Complete invoice history (placeholder)

## Design System

**Colors:**

- Primary: Green (`green-600`, `green-700`)
- Background: Gray 50
- Cards: White with shadows
- Gradient cards for stats

**Typography:**

- Headers: Bold, 2xl-3xl
- Body: Regular, sm-base
- Stats: Bold, 3xl

**Responsive Breakpoints:**

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## Next Steps

### Phase 2: Auto Billing Wizard (IN PROGRESS)

- Step 1: Client & Scope Selection
- Step 2: Invoice Configuration + Billing Cycle
- Step 3: Billing Calculation
- Step 4: Review & Generate

### Future Phases:

- Manual Billing
- Arrear Billing
- Bonus/Leave Encashment
- Invoice Management Pages
- Reports & Analytics

## Development Guidelines

1. **Component Structure:**
   - Keep components small and focused
   - Use props for data passing
   - Implement loading and error states

2. **Styling:**
   - Use Tailwind utility classes
   - Maintain green theme consistency
   - Ensure mobile responsiveness

3. **Data Management:**
   - All operations through billingService.js
   - Use localStorage for persistence
   - Implement proper error handling

4. **User Experience:**
   - Toast notifications for actions
   - Loading spinners for async operations
   - Clear validation messages
   - Responsive design across devices

## Testing Checklist

- [ ] Dashboard loads with correct stats
- [ ] Navigation between pages works
- [ ] Sidebar collapsible sections work
- [ ] Quick actions navigate correctly
- [ ] Mobile responsive (hamburger menu)
- [ ] Back button returns to main sidebar
- [ ] Activity feed displays correctly
- [ ] Stats cards are responsive

## Known Issues & TODOs

- [ ] Implement actual backend API integration
- [ ] Add authentication checks
- [ ] Implement search and filter functionality
- [ ] Add export to Excel/PDF features
- [ ] Add data validation and error boundaries
- [ ] Implement real-time updates

## Version

v1.0.0 - Initial Dashboard Implementation

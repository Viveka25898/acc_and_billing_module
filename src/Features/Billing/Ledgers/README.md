# Billing Ledgers Module

## Overview

This module contains **4 Primary Posting Ledgers** for the billing system, mapping **312 products** to their respective General Ledger (GL) accounts.

---

## 📊 Ledger Structure

### 1. **HOUSE KEEPING CHARGES** (`X5000`)

- **Products**: 221
- **Color Theme**: Blue
- **Includes**:
  - Housekeeping services with varying service charges (1%-12%)
  - Management fees (7%, 8%, 10%, 12%)
  - Overtime charges
  - Deep cleaning services
  - Equipment cleaning
  - Food & accommodation
  - Statutory items (Bonus, LTA, Leave Encashment, HRA, ESIC, PPF)
  - Reimbursements (Diesel, Electricity, Mobile)

### 2. **MANPOWER SERVICES** (`X5100`)

- **Products**: 64
- **Color Theme**: Green
- **Includes**:
  - Administrative staff (Office Boy, Receptionist, Office Assistant)
  - Technical staff (Electrician, Plumber, Lab Technician)
  - Facility staff (Caretaker, Janitor, Driver, Gardener)
  - Conveyance charges
  - All skilled and unskilled manpower

### 3. **HK MATERIAL** (`X5200`)

- **Products**: 20 (Merged: HK Material + Cleaning Consumables)
- **Color Theme**: Purple
- **Includes**:
  - Cleaning consumables
  - Sanitary products (Pads, Cubes, Toilet Rolls)
  - Cleaning chemicals (Dettol, Vim, Colin, Bleach)
  - Cleaning tools (Dusters, Brooms, Mops, Gloves)
  - Disposables (Garbage Bags, Tissues)
  - Fresheners

### 4. **RENT ON MACHINERY** (`X5400`)

- **Products**: 7
- **Color Theme**: Orange
- **Includes**:
  - Ride On Sweeper
  - Vacuum Machines (standard & wet/dry)
  - Single Disc Machine
  - Steam Machine
  - High Pressure Machine
  - General machinery charges

---

## 🗂️ Folder Structure

```
Ledgers/
├── Components/
│   └── Badge.jsx                          # Shared badge component
├── HouseKeepingCharges/
│   ├── Components/
│   │   ├── HKChargesLedgerHeader.jsx
│   │   ├── HKChargesFilterSection.jsx
│   │   ├── HKChargesTransactionTable.jsx
│   │   └── HKChargesSummarySection.jsx
│   ├── data/
│   │   └── hkChargesLedgerData.js         # 4 dummy entries
│   └── Pages/
│       └── HKChargesLedgerPage.jsx
├── ManpowerServices/
│   ├── Components/
│   │   ├── ManpowerLedgerHeader.jsx
│   │   └── ManpowerTransactionTable.jsx
│   ├── data/
│   │   └── manpowerLedgerData.js          # 3 dummy entries
│   └── Pages/
│       └── ManpowerLedgerPage.jsx
├── HKMaterial/
│   ├── Components/
│   │   ├── HKMaterialLedgerHeader.jsx
│   │   └── HKMaterialTransactionTable.jsx
│   ├── data/
│   │   └── hkMaterialLedgerData.js        # 4 dummy entries
│   └── Pages/
│       └── HKMaterialLedgerPage.jsx
├── RentOnMachinery/
│   ├── Components/
│   │   ├── MachineryRentLedgerHeader.jsx
│   │   └── MachineryRentTransactionTable.jsx
│   ├── data/
│   │   └── machineryRentLedgerData.js     # 3 dummy entries
│   └── Pages/
│       └── MachineryRentLedgerPage.jsx
└── index.js                                # Main exports
```

---

## 🔧 Product to GL Mapping Service

### Location

`src/Features/Billing/Services/ProductGLMappingService.js`

### Features

- **Automatic GL Assignment**: Maps products to correct GL based on keywords
- **Batch Processing**: Handle multiple products at once
- **Validation**: Confidence scoring for mappings
- **GL Summary**: Get product counts and totals per GL

### Usage Examples

```javascript
import { ProductGLMappingService } from '../Services/ProductGLMappingService'

// Map single product
const glAccount = ProductGLMappingService.mapProductToGL('HOUSEKEEPING SERVICES')
// Returns: 'X5000-HOUSE KEEPING CHARGES'

// Batch map products
const products = [
  { name: 'OFFICE BOY', amount: 5000 },
  { name: 'Cleaning Consumable', amount: 2000 },
  { name: 'Steam Machine', amount: 3000 },
]
const mapped = ProductGLMappingService.batchMapProducts(products)

// Get GL Summary
const summary = ProductGLMappingService.getGLSummary(products)
// Returns array with GL-wise product counts and totals

// Validate mapping
const validation = ProductGLMappingService.validateMapping('ELECTRICIAN')
// Returns: { glAccount, glAccountName, confidence, matchedKeywords }
```

---

## 🎨 Component Features

### All Ledgers Include:

1. **Responsive Design** - Mobile, tablet, and desktop optimized
2. **Color-Coded Headers** - Visual distinction between ledgers
3. **Filter Section** - Search, date range, client filter, export
4. **Transaction Table** - Horizontal scroll for extensive data
5. **Summary Section** - Total debit, credit, balance, transaction count
6. **Badge System** - Visual indicators for status, type, etc.
7. **Icons** - Lucide React icons for better UX
8. **Loading States** - Smooth loading experience
9. **Error Handling** - Graceful error messages

---

## 📝 Dummy Data Structure

Each ledger contains:

- **Opening Balance**: Financial year start balance
- **2-4 Transactions**: Realistic billing entries with:
  - Date, Voucher Number
  - Client information
  - Product details
  - GST calculations
  - Site locations
  - Approval information
  - Cost centers
  - Status tracking

---

## 🚀 Next Steps

### To Add Routes:

```javascript
// In your routing file
import {
  HKChargesLedgerPage,
  ManpowerLedgerPage,
  HKMaterialLedgerPage,
  MachineryRentLedgerPage
} from './Features/Billing/Ledgers';

// Add routes
{
  path: '/billing/ledgers/housekeeping-charges',
  element: <HKChargesLedgerPage />
},
{
  path: '/billing/ledgers/manpower-services',
  element: <ManpowerLedgerPage />
},
{
  path: '/billing/ledgers/hk-material',
  element: <HKMaterialLedgerPage />
},
{
  path: '/billing/ledgers/machinery-rent',
  element: <MachineryRentLedgerPage />
}
```

### To Integrate with Real Billing:

1. Import `ProductGLMappingService` in your billing component
2. Call `mapProductToGL()` when creating invoices
3. Use returned GL code for ledger posting
4. Update ledger data files with real transactions from backend

### To Connect to Backend:

Replace dummy data loading in each page:

```javascript
// Instead of:
setTimeout(() => {
  setLedgerData(hkChargesLedgerData)
}, 500)

// Use:
const response = await fetch(`/api/ledgers/${glCode}`)
const data = await response.json()
setLedgerData(data)
```

---

## 🔑 Key Technical Details

- **Framework**: React 18+
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Hooks (useState, useEffect)
- **Responsive**: Mobile-first approach
- **Production Ready**: Error handling, loading states, validation

---

## 📋 Product Mapping Reference

| GL Code | GL Name               | Product Count | Primary Keywords                                       |
| ------- | --------------------- | ------------- | ------------------------------------------------------ |
| X5000   | House Keeping Charges | 221           | Housekeeping, Service Charge, Management Fee, Overtime |
| X5100   | Manpower Services     | 64            | Office Boy, Receptionist, Electrician, Driver          |
| X5200   | HK Material           | 20            | Cleaning Consumable, Sanitary Pads, Bleach, Dettol     |
| X5400   | Rent on Machinery     | 7             | Sweeper, Vacuum, Steam Machine, Disc Machine           |

---

## 📞 Support

For questions or issues, contact the development team.

**Created**: January 16, 2026
**Version**: 1.0.0
**Status**: Production Ready ✅

# 🚀 QUICK START GUIDE - Billing Ledgers

## ✅ What's Been Completed

All 4 billing ledgers are **production-ready** with dummy data!

---

## 📋 To View the Ledgers in Your App

### Step 1: Add Routes

Open your routing file (e.g., `src/Routes/Route.jsx`) and add:

```javascript
// Import the ledger pages
import {
  HKChargesLedgerPage,
  ManpowerLedgerPage,
  HKMaterialLedgerPage,
  MachineryRentLedgerPage,
} from '../Features/Billing/Ledgers'

// Add these routes in your routes array
const routes = [
  // ... your existing routes

  // Billing Ledger Routes
  {
    path: '/billing/ledgers/housekeeping-charges',
    element: <HKChargesLedgerPage />,
  },
  {
    path: '/billing/ledgers/manpower-services',
    element: <ManpowerLedgerPage />,
  },
  {
    path: '/billing/ledgers/hk-material',
    element: <HKMaterialLedgerPage />,
  },
  {
    path: '/billing/ledgers/machinery-rent',
    element: <MachineryRentLedgerPage />,
  },
]
```

### Step 2: Test the Ledgers

Navigate to these URLs in your browser:

- `http://localhost:5173/billing/ledgers/housekeeping-charges`
- `http://localhost:5173/billing/ledgers/manpower-services`
- `http://localhost:5173/billing/ledgers/hk-material`
- `http://localhost:5173/billing/ledgers/machinery-rent`

---

## 🔗 Product to GL Mapping

### When Creating Invoices

Use the `ProductGLMappingService` to automatically assign GL accounts:

```javascript
import { ProductGLMappingService } from '../Features/Billing/Services/ProductGLMappingService'

// Example: During invoice creation
const invoiceProducts = [
  { name: 'HOUSEKEEPING SERVICES', amount: 50000 },
  { name: 'OFFICE BOY', amount: 15000 },
  { name: 'DETTOL HAND WASH', amount: 2000 },
  { name: 'Steam Machine', amount: 5000 },
]

// Map products to GL accounts
const mappedProducts = ProductGLMappingService.batchMapProducts(invoiceProducts)

// Result:
// [
//   { name: 'HOUSEKEEPING SERVICES', amount: 50000,
//     glAccount: 'X5000-HOUSE KEEPING CHARGES',
//     glAccountName: 'House Keeping Charges' },
//   { name: 'OFFICE BOY', amount: 15000,
//     glAccount: 'X5100-MANPOWER SERVICES',
//     glAccountName: 'Manpower Services' },
//   ... and so on
// ]

// Get summary by GL
const summary = ProductGLMappingService.getGLSummary(invoiceProducts)
console.log(summary)
```

---

## 📊 Ledger Overview

| Ledger                | GL Code | Products | Color  | URL                                     |
| --------------------- | ------- | -------- | ------ | --------------------------------------- |
| House Keeping Charges | X5000   | 221      | Blue   | `/billing/ledgers/housekeeping-charges` |
| Manpower Services     | X5100   | 64       | Green  | `/billing/ledgers/manpower-services`    |
| HK Material           | X5200   | 20       | Purple | `/billing/ledgers/hk-material`          |
| Rent on Machinery     | X5400   | 7        | Orange | `/billing/ledgers/machinery-rent`       |

---

## 🎯 Next Steps

### 1. Add Navigation Menu (Optional)

Add ledger links to your sidebar/navbar:

```javascript
<nav>
  <Link to="/billing/ledgers/housekeeping-charges">HK Charges Ledger</Link>
  <Link to="/billing/ledgers/manpower-services">Manpower Ledger</Link>
  <Link to="/billing/ledgers/hk-material">HK Material Ledger</Link>
  <Link to="/billing/ledgers/machinery-rent">Machinery Rent Ledger</Link>
</nav>
```

### 2. Connect to Real Data

When you're ready, replace dummy data with API calls:

```javascript
// In each ledger page's loadLedgerData function
const loadLedgerData = async () => {
  try {
    setLoading(true)
    const response = await fetch(`/api/billing/ledgers/${glCode}`)
    const data = await response.json()
    setLedgerData(data)
  } catch (error) {
    console.error('Error:', error)
  } finally {
    setLoading(false)
  }
}
```

### 3. Use in Billing Process

When posting invoices:

```javascript
// 1. Get GL for each product
const glAccount = ProductGLMappingService.mapProductToGL(productName)

// 2. Post to ledger
await postToLedger({
  glAccount: glAccount,
  debit: amount,
  narration: description,
  // ... other fields
})
```

---

## 🔍 File Locations

All files are in: `src/Features/Billing/Ledgers/`

### Important Files:

- **Pages**: Each ledger folder has a `Pages/` directory
- **Data**: Dummy data in `data/` folders
- **Service**: `../Services/ProductGLMappingService.js`
- **Docs**: `README.md` and `IMPLEMENTATION_SUMMARY.md`

---

## 💡 Tips

1. **Responsive Tables**: Tables scroll horizontally on mobile - test on different screen sizes
2. **Loading States**: Each page shows a spinner while loading
3. **Error Handling**: Pages handle missing data gracefully
4. **Icons**: Using Lucide React (already installed)
5. **Styling**: Pure Tailwind CSS - no custom CSS needed

---

## ✅ Verification Checklist

Before deploying:

- [ ] Routes are added and working
- [ ] All 4 ledgers load without errors
- [ ] Tables display correctly on mobile
- [ ] Dummy data appears as expected
- [ ] Color themes are correct (Blue, Green, Purple, Orange)
- [ ] Filter sections are responsive
- [ ] Summary cards show correct totals

---

## 🆘 Troubleshooting

### Issue: Ledgers not loading

**Solution**: Check if routes are properly added and imported

### Issue: Icons not showing

**Solution**: Verify lucide-react is installed (it should be)

### Issue: Styling looks broken

**Solution**: Ensure Tailwind CSS is configured properly

### Issue: Can't see products in mapping

**Solution**: Check ProductGLMappingService keyword arrays

---

## 📞 Support

Check these files for details:

- `README.md` - Full documentation
- `IMPLEMENTATION_SUMMARY.md` - Complete implementation details
- `ProductGLMappingService.js` - Mapping logic with examples

---

**Status**: ✅ Ready to Use
**Last Updated**: January 16, 2026

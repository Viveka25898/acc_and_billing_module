# Invoice Management System - Documentation

## Overview

This module provides a complete invoice management solution with localStorage persistence, filtering, viewing, and downloading capabilities.

## Features

### ✅ Completed Features

1. **Save Invoice** - Save invoices to localStorage with complete metadata
2. **Proforma Invoices Page** - View all proforma invoices in a table
3. **Advanced Filtering** - Filter by status, date range, and search term
4. **Invoice Statistics** - Display counts for different invoice statuses
5. **View Invoice** - Modal to view complete invoice details
6. **Download PDF** - Download invoice as PDF
7. **Track Metrics** - View count and download count tracking
8. **Responsive Design** - Works on desktop, tablet, and mobile
9. **Error Handling** - Try-catch blocks and user-friendly error messages
10. **Loading States** - Loaders for better UX

### 🔄 Pending Features (To be implemented)

- **Convert to IRN** - Functionality placeholder ready

## File Structure

```
src/Features/Billing/
├── Components/
│   ├── InvoiceFilters.jsx       # Search and filter component
│   ├── InvoiceTable.jsx          # Responsive table with actions
│   └── InvoiceViewModal.jsx      # Modal for viewing invoices
├── Pages/
│   ├── ProformaInvoices.jsx     # Main proforma invoices page
│   └── AutoBilling/
│       └── Step5InvoicePreview.jsx  # Updated with save functionality
└── utils/
    └── invoiceStorage.js         # localStorage utility functions
```

## Components

### 1. InvoiceFilters

**Purpose**: Provides search and filtering capabilities with statistics display

**Features**:

- Real-time search across invoice number, customer, branch
- Filter by status (Draft, Sent, Received, Converted)
- Date range filtering
- Statistics cards showing invoice counts
- Reset filters functionality

**Props**:

- `onFilterChange`: Function called when filters change
- `stats`: Object containing invoice statistics

### 2. InvoiceTable

**Purpose**: Displays invoices in a responsive table/card layout

**Features**:

- Desktop: Full table view with all columns
- Mobile: Card-based layout
- Action buttons: View, Download, Convert to IRN
- Status badges with color coding
- Hover effects and tooltips
- Loading and empty states

**Props**:

- `invoices`: Array of invoice objects
- `onView`: Function to view invoice
- `onDownload`: Function to download invoice
- `onConvertToIRN`: Function to convert to IRN
- `isLoading`: Boolean for loading state

### 3. InvoiceViewModal

**Purpose**: Full-screen modal to view invoice details

**Features**:

- Shows complete invoice with Step5InvoicePreview
- Metadata display (creator, date, customer, amount)
- Download button
- Responsive design

**Props**:

- `invoice`: Invoice object to display
- `isOpen`: Boolean to control visibility
- `onClose`: Function to close modal
- `onDownload`: Function to download invoice

### 4. ProformaInvoices (Main Page)

**Purpose**: Main page for managing proforma invoices

**Features**:

- Load and display all proforma invoices
- Integration with filters and table
- Create new invoice button
- Refresh functionality
- Error handling with user feedback
- View count and download count tracking

## Utility Functions (invoiceStorage.js)

### Core Functions

#### `saveInvoice(invoiceData, type)`

Saves invoice to localStorage with metadata

```javascript
const result = saveInvoice(
  {
    formData,
    billingLines,
    calculations,
    createdBy: 'User Name',
  },
  'proforma'
)
```

#### `getInvoices(type)`

Retrieves all invoices of specified type

```javascript
const invoices = getInvoices('proforma')
```

#### `getInvoiceById(invoiceId, type)`

Gets single invoice by ID

```javascript
const invoice = getInvoiceById('INV-123', 'proforma')
```

#### `updateInvoice(invoiceId, updates, type)`

Updates invoice with new data

```javascript
updateInvoice('INV-123', { metadata: { status: 'sent' } }, 'proforma')
```

#### `deleteInvoice(invoiceId, type)`

Deletes invoice from storage

```javascript
deleteInvoice('INV-123', 'proforma')
```

#### `filterInvoices(filters, type)`

Filters invoices based on criteria

```javascript
const filtered = filterInvoices(
  {
    searchTerm: 'ABC',
    status: 'draft',
    dateFrom: '2026-01-01',
    dateTo: '2026-01-31',
  },
  'proforma'
)
```

#### `getInvoiceStats(type)`

Gets statistics for invoices

```javascript
const stats = getInvoiceStats('proforma')
// Returns: { total, draft, sent, received, converted }
```

### Helper Functions

- `incrementViewCount(invoiceId, type)` - Tracks views
- `incrementDownloadCount(invoiceId, type)` - Tracks downloads
- `markInvoiceAsSent(invoiceId, type)` - Updates status to sent
- `generateInvoiceId()` - Generates unique ID

## Invoice Data Structure

```javascript
{
  id: "INV-1736190123456-abc123xyz",
  formData: {
    invoiceSeries: "proforma",
    poWoNumber: "PO-123",
    customer: "ABC Company",
    branch: "Mumbai Branch",
    selectedBillingCycle: { ... },
    selectedSites: [ ... ],
    ...
  },
  billingLines: [ ... ],
  calculations: {
    subtotal: 100000,
    cgst: 9000,
    sgst: 9000,
    grandTotal: 118000,
    ...
  },
  metadata: {
    createdAt: "2026-01-06T10:30:00.000Z",
    createdBy: "Billing Manager",
    lastModified: "2026-01-06T10:30:00.000Z",
    status: "draft", // draft | sent | received | converted
    sentToClient: false,
    clientFeedback: null,
    viewCount: 0,
    downloadCount: 0
  },
  type: "proforma"
}
```

## Status Flow

1. **Draft** → Initial state when invoice is saved
2. **Sent** → After sending email to client
3. **Received** → When client confirms receipt
4. **Converted** → After converting to IRN

## Usage Guide

### 1. Creating and Saving Invoice

In Auto Bill Wizard Step 5:

```javascript
// User clicks Save button
// Invoice is saved to localStorage
// User is redirected to /billing/proforma-invoices
```

### 2. Viewing Invoices

Navigate to Proforma Invoices page:

- View statistics at the top
- Use filters to search/filter
- Click eye icon to view details
- Click download icon to get PDF

### 3. Converting to IRN

Button is ready but functionality to be implemented later:

```javascript
const handleConvertToIRN = (invoice) => {
  // Future implementation
  // Will convert proforma to tax invoice with IRN
}
```

## Responsive Breakpoints

- **Desktop (lg)**: Full table view with all columns
- **Tablet (md)**: Simplified table
- **Mobile (sm)**: Card-based layout

## Error Handling

All functions use try-catch blocks:

```javascript
try {
  // Operation
} catch (error) {
  console.error('Error:', error)
  setError('User-friendly message')
}
```

## localStorage Keys

- `proforma_invoices` - All proforma invoices
- `tax_invoices` - All tax invoices (future)

## Performance Considerations

- **Lazy Loading**: Components load on demand
- **Debounced Search**: Real-time search without lag
- **Efficient Filtering**: In-memory filtering for fast results
- **Pagination**: Can be added for large datasets

## Future Enhancements

1. **Backend Integration**: Replace localStorage with API calls
2. **Pagination**: For large invoice lists
3. **Export**: Bulk export to Excel/CSV
4. **Email Integration**: Direct email from table
5. **Audit Trail**: Complete history of changes
6. **Advanced Analytics**: Charts and reports
7. **Bulk Operations**: Select multiple and perform actions
8. **Templates**: Save and reuse invoice templates

## Testing Checklist

- [x] Save invoice
- [x] View invoice list
- [x] Filter by search term
- [x] Filter by status
- [x] Filter by date range
- [x] View invoice in modal
- [x] Download invoice PDF
- [x] Track view count
- [x] Track download count
- [x] Responsive on mobile
- [x] Error handling
- [x] Loading states
- [ ] Convert to IRN (pending)

## Support

For issues or questions, contact the development team.

---

**Last Updated**: January 6, 2026  
**Version**: 1.0.0  
**Status**: Production Ready ✅

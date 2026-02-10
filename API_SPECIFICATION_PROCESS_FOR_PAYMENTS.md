# API SPECIFICATION: PROCESS FOR PAYMENTS

## OVERVIEW

This document specifies the APIs required for the **Process for Payments** workflow, which serves as the centralized payment processing system for all company payments. The system handles:

- **Vendor Payments** (Material invoices, Fixed Assets, Prepaid/Uniform, Rent vouchers)
- **Reliever Payments** (Approved reliever requests)
- **Conveyance Payments** (Approved conveyance claims)

**Important Business Rule**: All company/vendor payments MUST be processed ONLY through this feature — no payments are allowed outside this system.

---

## PART 1: VENDOR PAYMENTS WORKFLOW

### 1. API TO FETCH PENDING INVOICES FOR PAYMENT

**Endpoint**: `GET /api/payments/vendor/pending-invoices`

**Authorization**: Account Executive role required

**Description**: Fetches all approved invoices from multiple sources that are pending payment processing

**Query Parameters**

| Parameter   | Type   | Required | Description                                           |
| ----------- | ------ | -------- | ----------------------------------------------------- |
| vendorName  | String | No       | Filter by vendor name                                 |
| invoiceType | String | No       | Filter by type (Material, Fixed Asset, Prepaid, Rent) |
| fromDate    | String | No       | Filter by approval date (YYYY-MM-DD)                  |
| toDate      | String | No       | Filter by approval date (YYYY-MM-DD)                  |
| page        | Number | No       | Page number for pagination                            |
| limit       | Number | No       | Items per page (default: 20)                          |

**Invoice Sources**

The API aggregates invoices from the following sources:

1. **Account Manager Approved Invoices**
   - Source: Material invoices, Fixed Asset invoices
   - Status: `Approved by AM`, `GL Posted - Completed`
   - Storage: `processed_invoices`

2. **Billing Manager Approved Invoices**
   - Source: Procurement Prepaid (Uniform) invoices
   - Status: `Final Approved by BM`, `GL Posted`
   - Storage: `final_processed_invoices`

3. **Finance Head Approved Invoices**
   - Source: One-time PO invoices with TDS
   - Status: `Approved`, `paymentStatus: pending`
   - Storage: `oneTimeFinalProcessedInvoice`

4. **Rent Vouchers**
   - Source: Approved rent agreement vouchers
   - Status: `Approved`, `paymentStatus: Pending Payment`
   - Storage: `vendorVouchers`

**Success Response (200 OK)**

```json
{
  "success": true,
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalItems": 45,
    "pageSize": 20
  },
  "summary": {
    "totalVendors": 12,
    "totalInvoices": 45,
    "totalAmount": 2850000.0,
    "breakdown": {
      "materialInvoices": 18,
      "fixedAssets": 5,
      "prepaidInvoices": 8,
      "rentVouchers": 14
    }
  },
  "vendors": [
    {
      "id": "VENDOR-1734447000000-abc123",
      "vendorName": "ABC Enterprises",
      "debitAmount": 450000.0,
      "totalInvoices": 3,
      "currency": "INR",
      "beneficiaryAccountNumber": "987654321001",
      "ifscCode": "HDFC0001234",
      "source": "am_approval",
      "invoices": [
        {
          "id": "INV-1734447000000-xyz789-0",
          "invoiceNumber": "INV-2024-001",
          "amount": 125000.0,
          "type": "Material",
          "invoiceTypeLabel": "Material Invoice",
          "documentUrl": "https://storage.example.com/invoices/inv-2024-001.pdf",
          "gstRate": 18,
          "hsnCode": "998314",
          "processedAt": "2024-12-17T16:00:00.000Z",
          "vendorGLCode": "L2005002_001_ABC_Enterprises",
          "voucherNo": "HK-PUR-20241217-0001",
          "source": "am_bm_approval",
          "tdsApplicable": false,
          "tdsAmount": 0,
          "netPayable": 125000.0
        },
        {
          "id": "INV-1734447000000-xyz789-1",
          "invoiceNumber": "INV-2024-002",
          "amount": 250000.0,
          "type": "Fixed Asset",
          "invoiceTypeLabel": "Fixed Asset",
          "documentUrl": "https://storage.example.com/invoices/inv-2024-002.pdf",
          "gstRate": 18,
          "hsnCode": "847330",
          "processedAt": "2024-12-18T14:30:00.000Z",
          "vendorGLCode": "L2005002_001_ABC_Enterprises",
          "voucherNo": "FA-PUR-20241218-0001",
          "source": "am_bm_approval",
          "tdsApplicable": false,
          "tdsAmount": 0,
          "netPayable": 250000.0
        },
        {
          "id": "INV-1734447000000-xyz789-2",
          "invoiceNumber": "INV-2024-003",
          "amount": 75000.0,
          "type": "Procurement Prepaid",
          "invoiceTypeLabel": "Uniform Prepaid",
          "documentUrl": "https://storage.example.com/invoices/inv-2024-003.pdf",
          "gstRate": 12,
          "hsnCode": "621142",
          "processedAt": "2024-12-19T11:00:00.000Z",
          "vendorGLCode": "L2005002_001_ABC_Enterprises",
          "voucherNo": "PP-20241219-0001",
          "source": "am_bm_approval",
          "tdsApplicable": false,
          "tdsAmount": 0,
          "netPayable": 75000.0
        }
      ]
    },
    {
      "id": "RENT-1734533400000-def456-0",
      "vendorName": "Property Owner - Site A",
      "debitAmount": 150000.0,
      "totalInvoices": 2,
      "currency": "INR",
      "beneficiaryAccountNumber": "987654555001",
      "ifscCode": "ICIC0001234",
      "source": "rent_voucher",
      "isRentVoucher": true,
      "invoices": [
        {
          "id": "RENT-INV-1734533400000-ghi789-0",
          "invoiceNumber": "RENT-DEC-2024",
          "amount": 75000.0,
          "type": "Rent Payment",
          "invoiceTypeLabel": "Rent Voucher",
          "documentUrl": null,
          "gstRate": 18,
          "hsnCode": null,
          "processedAt": "2024-12-15T10:00:00.000Z",
          "vendorGLCode": "L2005003_001_Property_Owner_Site_A",
          "voucherNo": "RENT-JV-20241215-0001",
          "isRentVoucher": true,
          "rentDetails": {
            "month": "December 2024",
            "siteName": "Site A - Mumbai",
            "siteLocation": "Andheri East, Mumbai",
            "agreementId": "AGR-2024-001",
            "baseRent": 63559.32,
            "gstAmount": 11440.68,
            "gstType": "CGST+SGST"
          }
        },
        {
          "id": "RENT-INV-1734533400000-ghi789-1",
          "invoiceNumber": "RENT-JAN-2025",
          "amount": 75000.0,
          "type": "Rent Payment",
          "invoiceTypeLabel": "Rent Voucher",
          "documentUrl": null,
          "gstRate": 18,
          "processedAt": "2025-01-15T10:00:00.000Z",
          "vendorGLCode": "L2005003_001_Property_Owner_Site_A",
          "voucherNo": "RENT-JV-20250115-0001",
          "isRentVoucher": true,
          "rentDetails": {
            "month": "January 2025",
            "siteName": "Site A - Mumbai",
            "siteLocation": "Andheri East, Mumbai",
            "agreementId": "AGR-2024-001",
            "baseRent": 63559.32,
            "gstAmount": 11440.68,
            "gstType": "CGST+SGST"
          }
        }
      ]
    },
    {
      "id": "VENDOR-1734620000000-jkl012",
      "vendorName": "Professional Services Ltd",
      "debitAmount": 94000.0,
      "totalInvoices": 1,
      "currency": "INR",
      "beneficiaryAccountNumber": "987654444001",
      "ifscCode": "SBIN0001234",
      "source": "finance_head_approval",
      "invoices": [
        {
          "id": "INV-1734620000000-mno345-0",
          "invoiceNumber": "PROF-2024-050",
          "amount": 100000.0,
          "type": "Professional Fees",
          "invoiceTypeLabel": "Professional Fees",
          "documentUrl": "https://storage.example.com/invoices/prof-2024-050.pdf",
          "gstRate": 18,
          "processedAt": "2024-12-20T09:00:00.000Z",
          "vendorGLCode": "L2005004_015_Professional_Services",
          "voucherNo": "ONETIME-20241220-0015",
          "source": "finance_head_approval",
          "tdsApplicable": true,
          "tdsSection": "194J",
          "tdsRate": 10,
          "tdsAmount": 10000.0,
          "netPayable": 90000.0,
          "accountingResult": {
            "voucherNo": "ONETIME-20241220-0015",
            "grossAmount": 100000.0,
            "tdsAmount": 10000.0,
            "netPayable": 90000.0
          }
        }
      ]
    }
  ]
}
```

**Notes**

- Invoices are grouped by vendor for easier payment processing
- `netPayable` field is critical for Finance Head approved invoices (after TDS deduction)
- For regular invoices without TDS, `netPayable` = `amount`
- Rent vouchers are identified by `isRentVoucher: true`
- Each vendor has unique `beneficiaryAccountNumber` and `ifscCode` for bank transfers

---

### 2. API TO SELECT INVOICES FOR PAYMENT

**Endpoint**: `POST /api/payments/vendor/select-invoices`

**Authorization**: Account Executive role required

**Description**: Allows AE to select specific invoices and specify full or partial payment

**Request Body (JSON)**

```json
{
  "selections": [
    {
      "vendorId": "VENDOR-1734447000000-abc123",
      "vendorName": "ABC Enterprises",
      "vendorGLCode": "L2005002_001_ABC_Enterprises",
      "invoiceSelections": [
        {
          "invoiceId": "INV-1734447000000-xyz789-0",
          "invoiceNumber": "INV-2024-001",
          "originalAmount": 125000.0,
          "paymentType": "full",
          "paidAmount": 125000.0
        },
        {
          "invoiceId": "INV-1734447000000-xyz789-1",
          "invoiceNumber": "INV-2024-002",
          "originalAmount": 250000.0,
          "paymentType": "partial",
          "paidAmount": 150000.0
        },
        {
          "invoiceId": "INV-1734447000000-xyz789-2",
          "invoiceNumber": "INV-2024-003",
          "originalAmount": 75000.0,
          "paymentType": "full",
          "paidAmount": 75000.0
        }
      ]
    },
    {
      "vendorId": "RENT-1734533400000-def456-0",
      "vendorName": "Property Owner - Site A",
      "vendorGLCode": "L2005003_001_Property_Owner_Site_A",
      "isRentVoucher": true,
      "invoiceSelections": [
        {
          "invoiceId": "RENT-INV-1734533400000-ghi789-0",
          "invoiceNumber": "RENT-DEC-2024",
          "originalAmount": 75000.0,
          "paymentType": "full",
          "paidAmount": 75000.0
        }
      ]
    }
  ],
  "selectedBy": "AE001",
  "selectedAt": "2024-12-21T10:30:00.000Z"
}
```

**Payment Type Options**

| Payment Type | Description                           | Behavior After Approval             |
| ------------ | ------------------------------------- | ----------------------------------- |
| `full`       | Complete payment of invoice           | Invoice removed from pending list   |
| `partial`    | Partial payment with specified amount | Invoice remains with reduced amount |

**Validation Rules**

1. `paidAmount` must be > 0 and ≤ `originalAmount`
2. For `paymentType: "full"`, `paidAmount` must equal `originalAmount`
3. For `paymentType: "partial"`, `paidAmount` must be < `originalAmount`
4. Vendor GL Code must exist in Chart of Accounts
5. Invoice must be in pending status

**Success Response (200 OK)**

```json
{
  "success": true,
  "message": "3 invoice(s) selected for payment successfully",
  "selectionSummary": {
    "totalVendors": 2,
    "totalInvoices": 4,
    "totalAmount": 425000.0,
    "fullPayments": 3,
    "partialPayments": 1,
    "breakdown": {
      "ABC Enterprises": {
        "invoices": 3,
        "amount": 350000.0
      },
      "Property Owner - Site A": {
        "invoices": 1,
        "amount": 75000.0
      }
    }
  },
  "nextStep": "Download payment files or process payment directly"
}
```

**Error Response (400 Bad Request)**

```json
{
  "success": false,
  "message": "Invalid payment selections",
  "errors": [
    "Invoice INV-2024-002: Paid amount (300000.00) exceeds original amount (250000.00)",
    "Invoice INV-2024-003: Payment type is 'full' but paid amount (50000.00) does not match original amount (75000.00)"
  ]
}
```

---

### 3. API TO DOWNLOAD PAYMENT FILES

**Endpoint**: `POST /api/payments/vendor/download-payment-files`

**Authorization**: Account Executive role required

**Description**: Generates and downloads two Excel files for payment processing:

1. **Bank Upload File** - For uploading to bank portal for payment execution
2. **System Upload File** - For recording payment details and UTR after bank processing

**Request Body (JSON)**

```json
{
  "approvedInvoices": [
    {
      "vendorId": "VENDOR-1734447000000-abc123",
      "vendorName": "ABC Enterprises",
      "debitBankAccountNumber": "123456789012",
      "beneficiaryAccountNumber": "987654321001",
      "ifscCode": "HDFC0001234",
      "currency": "INR",
      "narration": "ABC Enterprises",
      "invoices": [
        {
          "invoiceNumber": "INV-2024-001",
          "originalAmount": 125000.0,
          "paidAmount": 125000.0,
          "paymentType": "full"
        },
        {
          "invoiceNumber": "INV-2024-002",
          "originalAmount": 250000.0,
          "paidAmount": 150000.0,
          "paymentType": "partial"
        }
      ],
      "totalPaidAmount": 275000.0
    },
    {
      "vendorId": "RENT-1734533400000-def456-0",
      "vendorName": "Property Owner - Site A",
      "debitBankAccountNumber": "123456789012",
      "beneficiaryAccountNumber": "987654555001",
      "ifscCode": "ICIC0001234",
      "currency": "INR",
      "narration": "Rent Payment - Site A",
      "invoices": [
        {
          "invoiceNumber": "RENT-DEC-2024",
          "originalAmount": 75000.0,
          "paidAmount": 75000.0,
          "paymentType": "full"
        }
      ],
      "totalPaidAmount": 75000.0
    }
  ]
}
```

**Critical Backend Logic**

**Step 1: Generate Bank Upload File**

Group all approved invoices by vendor and create one payment line per vendor:

```javascript
// Bank Upload File Structure (Excel Format)
const bankUploadData = [
  {
    TYPE: 'NEFT',
    'DEBIT BANK A/C NO': '123456789012',
    'DEBIT AMT': 275000.0,
    CUR: 'INR',
    'BENEFICIARY A/C NO': '987654321001',
    'IFSC CODE': 'HDFC0001234',
    'NARRATION/NAME': 'ABC Enterprises',
  },
  {
    TYPE: 'NEFT',
    'DEBIT BANK A/C NO': '123456789012',
    'DEBIT AMT': 75000.0,
    CUR: 'INR',
    'BENEFICIARY A/C NO': '987654555001',
    'IFSC CODE': 'ICIC0001234',
    'NARRATION/NAME': 'Rent Payment - Site A',
  },
]
```

**Step 2: Generate System Upload File**

Show invoice-level details for UTR entry and tracking:

```javascript
// System Upload File Structure (Excel Format)
const systemUploadData = [
  {
    'Vendor Name': 'ABC Enterprises',
    'Invoice Numbers': 'INV-2024-001, INV-2024-002',
    'Total Amount': 375000.0,
    'Payment Done': 275000.0,
    'Remaining Payment': 100000.0,
    UTR: '', // Empty for AE to fill after bank processing
  },
  {
    'Vendor Name': 'Property Owner - Site A',
    'Invoice Numbers': 'RENT-DEC-2024',
    'Total Amount': 75000.0,
    'Payment Done': 75000.0,
    'Remaining Payment': 0,
    UTR: '',
  },
]
```

**Success Response (200 OK)**

Returns two file streams (Excel format):

**File 1: Bank*Payment_File*{timestamp}.xlsx**

- Content-Type: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- Content-Disposition: `attachment; filename="Bank_Payment_File_20241221103000.xlsx"`

**File 2: System*Upload_File*{timestamp}.xlsx**

- Content-Type: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- Content-Disposition: `attachment; filename="System_Upload_File_20241221103000.xlsx"`

**Response Body**

```json
{
  "success": true,
  "message": "Both files downloaded successfully",
  "fileDetails": {
    "bankFile": {
      "filename": "Bank_Payment_File_20241221103000.xlsx",
      "vendors": 2,
      "totalAmount": 350000.0,
      "recordCount": 2
    },
    "systemFile": {
      "filename": "System_Upload_File_20241221103000.xlsx",
      "vendors": 2,
      "invoices": 3,
      "paidAmount": 275000.0,
      "remainingAmount": 100000.0,
      "recordCount": 2
    }
  },
  "downloadedAt": "2024-12-21T10:30:00.000Z",
  "downloadedBy": "AE001"
}
```

**Post-Download Processing**

After successful download:

1. Clear approved invoices from selection state
2. Keep partial payment invoices in pending list with reduced amounts
3. Remove full payment invoices from pending list
4. Update invoice payment status to "Download Completed - Awaiting UTR"

**Notes**

- Bank file has ONE line per vendor (aggregated payment)
- System file has invoice-level details for tracking
- Timestamp format: `YYYYMMDDHHmmss`
- Both files use Excel format (.xlsx)
- Column widths are auto-adjusted based on content

---

### 4. API TO UPLOAD PAYMENT FILE WITH UTR

**Endpoint**: `POST /api/payments/vendor/upload-payment-file`

**Authorization**: Account Executive role required

**Description**: Uploads the completed System Upload File with UTR numbers filled in after bank processing

**Request Format**: `multipart/form-data`

**Request Body Parts**

| Field       | Type   | Required | Description                              |
| ----------- | ------ | -------- | ---------------------------------------- |
| paymentFile | File   | Yes      | Excel file (.xlsx, .xls) with UTR filled |
| uploadedBy  | String | Yes      | AE user ID                               |
| uploadedAt  | String | Yes      | ISO timestamp                            |

**Excel File Structure (Expected)**

The uploaded file must contain these columns with UTR filled:

| Vendor Name             | Invoice Numbers            | Total Amount | Payment Done | Remaining Payment | UTR             |
| ----------------------- | -------------------------- | ------------ | ------------ | ----------------- | --------------- |
| ABC Enterprises         | INV-2024-001, INV-2024-002 | 375000.00    | 275000.00    | 100000.00         | HDFC24122110001 |
| Property Owner - Site A | RENT-DEC-2024              | 75000.00     | 75000.00     | 0                 | ICIC24122110002 |

**Validation Rules**

1. File must be valid Excel format (.xlsx or .xls)
2. Must contain all required columns: `Vendor Name`, `Invoice Numbers`, `Payment Done`, `UTR`
3. UTR field must not be empty for processed payments
4. UTR must be alphanumeric, 10-30 characters
5. Vendor names must match original download file
6. Payment amounts must match original amounts

**Success Response (200 OK)**

```json
{
  "success": true,
  "message": "Payment file uploaded successfully",
  "uploadSummary": {
    "totalRecords": 2,
    "validRecords": 2,
    "invalidRecords": 0,
    "totalAmount": 350000.0,
    "uploadedAt": "2024-12-21T15:30:00.000Z"
  },
  "parsedData": [
    {
      "vendorName": "ABC Enterprises",
      "invoiceNumbers": "INV-2024-001, INV-2024-002",
      "totalAmount": 375000.0,
      "paymentDone": 275000.0,
      "remainingPayment": 100000.0,
      "utr": "HDFC24122110001"
    },
    {
      "vendorName": "Property Owner - Site A",
      "invoiceNumbers": "RENT-DEC-2024",
      "totalAmount": 75000.0,
      "paymentDone": 75000.0,
      "remainingPayment": 0,
      "utr": "ICIC24122110002"
    }
  ],
  "nextStep": "Review data and select bank for payment processing"
}
```

**Error Response (400 Bad Request - Missing UTR)**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Row 1: UTR is required for vendor 'ABC Enterprises'",
    "Row 2: UTR format invalid - must be alphanumeric, 10-30 characters"
  ]
}
```

**Error Response (400 Bad Request - Amount Mismatch)**

```json
{
  "success": false,
  "message": "Payment amount mismatch detected",
  "errors": ["Row 1: Payment amount in file (300000.00) does not match original amount (275000.00)"]
}
```

---

### 5. API TO PROCESS FINAL PAYMENT WITH BANK SELECTION

**Endpoint**: `POST /api/payments/vendor/process-payment`

**Authorization**: Account Executive role required

**Description**: Final approval with bank selection that triggers automatic payment entry and GL posting

**Request Body (JSON)**

```json
{
  "paymentData": [
    {
      "vendorName": "ABC Enterprises",
      "invoiceNumbers": "INV-2024-001, INV-2024-002",
      "totalAmount": 375000.0,
      "paymentDone": 275000.0,
      "remainingPayment": 100000.0,
      "utr": "HDFC24122110001"
    },
    {
      "vendorName": "Property Owner - Site A",
      "invoiceNumbers": "RENT-DEC-2024",
      "totalAmount": 75000.0,
      "paymentDone": 75000.0,
      "remainingPayment": 0,
      "utr": "ICIC24122110002"
    }
  ],
  "selectedBank": {
    "bankCode": "A3004003001",
    "bankName": "HDFC Bank - Main Account",
    "bankId": "BANK-001"
  },
  "processedBy": "AE001",
  "processedAt": "2024-12-21T15:45:00.000Z"
}
```

**Success Response (200 OK)**

```json
{
  "success": true,
  "message": "Vendor payments processed successfully and GL entries posted",
  "paymentSummary": {
    "totalVendors": 2,
    "totalInvoices": 3,
    "totalAmount": 350000.0,
    "voucherNo": "VPAY-20241221-0001",
    "transactionId": "TXN_VPAY_1734787500000",
    "processedAt": "2024-12-21T15:45:00.000Z",
    "processedBy": "AE001"
  },
  "glPostingDetails": {
    "voucherNo": "VPAY-20241221-0001",
    "voucherType": "Payment Voucher",
    "voucherDate": "2024-12-21",
    "totalDebit": 350000.0,
    "totalCredit": 350000.0,
    "entries": [
      {
        "lineNo": 1,
        "glCode": "L2005002_001_ABC_Enterprises",
        "glName": "VENDOR - ABC Enterprises",
        "debit": 275000.0,
        "credit": 0,
        "narration": "Payment for invoices: INV-2024-001, INV-2024-002",
        "costCenter": "HEAD OFFICE"
      },
      {
        "lineNo": 2,
        "glCode": "L2005003_001_Property_Owner_Site_A",
        "glName": "VENDOR - Property Owner - Site A",
        "debit": 75000.0,
        "credit": 0,
        "narration": "Payment for invoices: RENT-DEC-2024",
        "costCenter": "HEAD OFFICE"
      },
      {
        "lineNo": 3,
        "glCode": "A3004003001",
        "glName": "HDFC Bank - Main Account",
        "debit": 0,
        "credit": 350000.0,
        "narration": "Bank payment (vendor batch)",
        "costCenter": "HEAD OFFICE"
      }
    ]
  },
  "vendorPaymentDetails": [
    {
      "vendorName": "ABC Enterprises",
      "vendorGLCode": "L2005002_001_ABC_Enterprises",
      "totalAmount": 275000.0,
      "invoices": [
        {
          "invoiceNumber": "INV-2024-001",
          "amount": 125000.0,
          "status": "Paid",
          "utr": "HDFC24122110001"
        },
        {
          "invoiceNumber": "INV-2024-002",
          "amount": 150000.0,
          "status": "Paid",
          "utr": "HDFC24122110001"
        }
      ]
    },
    {
      "vendorName": "Property Owner - Site A",
      "vendorGLCode": "L2005003_001_Property_Owner_Site_A",
      "totalAmount": 75000.0,
      "invoices": [
        {
          "invoiceNumber": "RENT-DEC-2024",
          "amount": 75000.0,
          "status": "Paid",
          "utr": "ICIC24122110002"
        }
      ]
    }
  ],
  "invoicesRemoved": {
    "processed_invoices": 2,
    "final_processed_invoices": 0,
    "oneTimeFinalProcessedInvoice": 0,
    "vendorVouchers": 1,
    "total": 3
  }
}
```

**Error Response (400 Bad Request - Insufficient Bank Balance)**

```json
{
  "success": false,
  "message": "Insufficient bank balance",
  "error": "Bank account HDFC Bank - Main Account has balance ₹200,000.00 but payment requires ₹350,000.00",
  "requiredAmount": 350000.0,
  "availableBalance": 200000.0,
  "shortage": 150000.0
}
```

**Error Response (500 Internal Server Error - GL Posting Failed)**

```json
{
  "success": false,
  "message": "Failed to post GL entries",
  "error": "Payment entries do not balance! Debits: 350100.00, Credits: 350000.00",
  "debugInfo": {
    "totalDebits": 350100.0,
    "totalCredits": 350000.0,
    "difference": 100.0
  }
}
```

---

### 6. API TO VIEW PAYMENT VOUCHER DETAILS

**Endpoint**: `GET /api/payments/vendor/voucher/{voucherNo}`

**Authorization**: Account Executive role required

**Description**: Fetches complete payment voucher details including GL entries

**URL Parameter**

- `{voucherNo}` (string, required): Payment voucher number (e.g., VPAY-20241221-0001)

**Success Response (200 OK)**

```json
{
  "success": true,
  "voucherDetails": {
    "voucherNo": "VPAY-20241221-0001",
    "transactionId": "TXN_VPAY_1734787500000",
    "voucherType": "Payment Voucher",
    "voucherDate": "2024-12-21",
    "totalAmount": 350000.0,
    "status": "Posted",
    "entries": [
      {
        "lineNo": 1,
        "glCode": "L2005002_001_ABC_Enterprises",
        "glName": "VENDOR - ABC Enterprises",
        "debit": 275000.0,
        "credit": 0,
        "narration": "Payment for invoices: INV-2024-001, INV-2024-002"
      },
      {
        "lineNo": 2,
        "glCode": "L2005003_001_Property_Owner_Site_A",
        "glName": "VENDOR - Property Owner - Site A",
        "debit": 75000.0,
        "credit": 0,
        "narration": "Payment for invoices: RENT-DEC-2024"
      },
      {
        "lineNo": 3,
        "glCode": "A3004003001",
        "glName": "HDFC Bank - Main Account",
        "debit": 0,
        "credit": 350000.0,
        "narration": "Bank payment (vendor batch)"
      }
    ],
    "totals": {
      "totalDebit": 350000.0,
      "totalCredit": 350000.0,
      "difference": 0
    },
    "narration": "Vendor payments for 2 vendor(s), total ₹350,000",
    "processedBy": "AE001",
    "processedAt": "2024-12-21T15:45:00.000Z"
  }
}
```

---

## PART 2: RELIEVER PAYMENTS WORKFLOW

### 7. API TO FETCH PENDING RELIEVER PAYMENTS

**Endpoint**: `GET /api/payments/reliever/pending-requests`

**Authorization**: Account Executive role required

**Description**: Fetches all approved reliever requests pending payment

**Query Parameters**

| Parameter    | Type   | Required | Description                          |
| ------------ | ------ | -------- | ------------------------------------ |
| relieverName | String | No       | Filter by reliever name              |
| site         | String | No       | Filter by work site                  |
| fromDate     | String | No       | Filter by approval date (YYYY-MM-DD) |
| toDate       | String | No       | Filter by approval date (YYYY-MM-DD) |
| page         | Number | No       | Page number for pagination           |
| limit        | Number | No       | Items per page (default: 20)         |

**Success Response (200 OK)**

```json
{
  "success": true,
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalItems": 5,
    "pageSize": 20
  },
  "summary": {
    "totalRelievers": 5,
    "totalAmount": 45000.0,
    "totalDays": 15
  },
  "relieverRequests": [
    {
      "id": "REL-001",
      "relieverName": "Rajesh Kumar",
      "relieverId": "REL-001",
      "site": "Site A - Mumbai",
      "days": 5,
      "amount": 7500.0,
      "accountNo": "987654321001",
      "ifscCode": "HDFC0001234",
      "bankName": "HDFC Bank",
      "approvedDate": "2024-12-18T10:00:00.000Z",
      "voucherNo": "REL-JV-20241218-0001",
      "originalRequest": {
        "id": "REL-001",
        "name": "Rajesh Kumar",
        "site": "Site A - Mumbai",
        "days": 5,
        "ratePerDay": 1500.0,
        "amount": 7500.0,
        "bankDetails": {
          "accountNo": "987654321001",
          "ifscCode": "HDFC0001234",
          "bankName": "HDFC Bank"
        }
      }
    },
    {
      "id": "REL-002",
      "relieverName": "Sunita Sharma",
      "relieverId": "REL-002",
      "site": "Site B - Delhi",
      "days": 3,
      "amount": 4500.0,
      "accountNo": "987654321002",
      "ifscCode": "ICIC0001234",
      "bankName": "ICICI Bank",
      "approvedDate": "2024-12-19T11:00:00.000Z",
      "voucherNo": "REL-JV-20241219-0001"
    }
  ]
}
```

---

### 8. API TO UPLOAD RELIEVER PAYMENT FILE WITH UTR

**Endpoint**: `POST /api/payments/reliever/upload-payment-file`

**Authorization**: Account Executive role required

**Description**: Uploads Excel file with reliever payment details and UTR numbers

**Request Format**: `multipart/form-data`

**Excel File Structure (Expected)**

| Reliever Name | Employee ID | Amount  | Account No   | IFSC Code   | Site            | Days Worked | Bank Name  | UTR             |
| ------------- | ----------- | ------- | ------------ | ----------- | --------------- | ----------- | ---------- | --------------- |
| Rajesh Kumar  | REL-001     | 7500.00 | 987654321001 | HDFC0001234 | Site A - Mumbai | 5           | HDFC Bank  | HDFC24122110005 |
| Sunita Sharma | REL-002     | 4500.00 | 987654321002 | ICIC0001234 | Site B - Delhi  | 3           | ICICI Bank | ICIC24122110006 |

**Success Response (200 OK)**

```json
{
  "success": true,
  "message": "Reliever payment file uploaded successfully",
  "uploadSummary": {
    "totalRecords": 2,
    "validRecords": 2,
    "invalidRecords": 0,
    "totalAmount": 12000.0
  },
  "parsedData": [
    {
      "relieverName": "Rajesh Kumar",
      "employeeId": "REL-001",
      "amount": 7500.0,
      "accountNo": "987654321001",
      "ifscCode": "HDFC0001234",
      "site": "Site A - Mumbai",
      "daysWorked": 5,
      "bankName": "HDFC Bank",
      "utr": "HDFC24122110005"
    },
    {
      "relieverName": "Sunita Sharma",
      "employeeId": "REL-002",
      "amount": 4500.0,
      "accountNo": "987654321002",
      "ifscCode": "ICIC0001234",
      "site": "Site B - Delhi",
      "daysWorked": 3,
      "bankName": "ICICI Bank",
      "utr": "ICIC24122110006"
    }
  ]
}
```

---

### 9. API TO PROCESS RELIEVER PAYMENTS

**Endpoint**: `POST /api/payments/reliever/process-payment`

**Authorization**: Account Executive role required

**Description**: Process reliever payments with automatic GL posting

**Request Body (JSON)**

```json
{
  "paymentData": [
    {
      "relieverName": "Rajesh Kumar",
      "employeeId": "REL-001",
      "amount": 7500.0,
      "utr": "HDFC24122110005",
      "site": "Site A - Mumbai"
    },
    {
      "relieverName": "Sunita Sharma",
      "employeeId": "REL-002",
      "amount": 4500.0,
      "utr": "ICIC24122110006",
      "site": "Site B - Delhi"
    }
  ],
  "selectedBank": {
    "bankCode": "A3004003001",
    "bankName": "HDFC Bank - Main Account",
    "bankId": "BANK-001"
  },
  "processedBy": "AE001"
}
```

**Success Response (200 OK)**

```json
{
  "success": true,
  "message": "Reliever payments processed successfully",
  "paymentSummary": {
    "totalRelievers": 2,
    "totalAmount": 12000.0,
    "voucherNo": "RPAY-20241221-0001",
    "transactionId": "TXN_RPAY_1734787500000"
  },
  "glPostingDetails": {
    "voucherNo": "RPAY-20241221-0001",
    "voucherType": "Payment Voucher",
    "entries": [
      {
        "lineNo": 1,
        "glCode": "X2001004",
        "glName": "RELIEVER EXPENSES",
        "debit": 7500.0,
        "credit": 0,
        "narration": "Reliever payment - Rajesh Kumar - Site A - Mumbai"
      },
      {
        "lineNo": 2,
        "glCode": "X2001004",
        "glName": "RELIEVER EXPENSES",
        "debit": 4500.0,
        "credit": 0,
        "narration": "Reliever payment - Sunita Sharma - Site B - Delhi"
      },
      {
        "lineNo": 3,
        "glCode": "A3004003001",
        "glName": "HDFC Bank - Main Account",
        "debit": 0,
        "credit": 12000.0,
        "narration": "Reliever payment (batch)"
      }
    ]
  }
}
```

---

## PART 3: CONVEYANCE PAYMENTS WORKFLOW

### 10. API TO FETCH PENDING CONVEYANCE PAYMENTS

**Endpoint**: `GET /api/payments/conveyance/pending-requests`

**Authorization**: Account Executive role required

**Description**: Fetches all approved conveyance claims pending payment

**Query Parameters**

| Parameter    | Type   | Required | Description                       |
| ------------ | ------ | -------- | --------------------------------- |
| employeeName | String | No       | Filter by employee name           |
| department   | String | No       | Filter by department              |
| fromDate     | String | No       | Filter by claim date (YYYY-MM-DD) |
| toDate       | String | No       | Filter by claim date (YYYY-MM-DD) |
| page         | Number | No       | Page number for pagination        |
| limit        | Number | No       | Items per page (default: 20)      |

**Success Response (200 OK)**

```json
{
  "success": true,
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalItems": 8,
    "pageSize": 20
  },
  "summary": {
    "totalEmployees": 6,
    "totalClaims": 8,
    "totalAmount": 12450.0,
    "totalDistance": 245
  },
  "conveyanceRequests": [
    {
      "id": "CONV-001",
      "employeeName": "Amit Sharma",
      "employeeId": "EMP001",
      "date": "2024-12-15",
      "client": "Client A",
      "purpose": "Client meeting",
      "distance": 45,
      "amount": 2250.0,
      "transport": "Own Vehicle",
      "department": "Sales",
      "voucherNo": "CONV-JV-20241215-0001",
      "approvedDate": "2024-12-18T14:00:00.000Z",
      "paymentStatus": "Pending Payment",
      "originalRequest": {
        "id": "CONV-001",
        "employeeName": "Amit Sharma",
        "employeeId": "EMP001",
        "date": "2024-12-15",
        "client": "Client A",
        "purpose": "Client meeting",
        "distance": 45,
        "ratePerKm": 50,
        "amount": 2250.0,
        "transport": "Own Vehicle",
        "department": "Sales"
      }
    },
    {
      "id": "CONV-002",
      "employeeName": "Priya Singh",
      "employeeId": "EMP002",
      "date": "2024-12-16",
      "client": "Client B",
      "purpose": "Site visit",
      "distance": 30,
      "amount": 1500.0,
      "transport": "Own Vehicle",
      "department": "Operations",
      "voucherNo": "CONV-JV-20241216-0001",
      "approvedDate": "2024-12-19T10:00:00.000Z",
      "paymentStatus": "Pending Payment"
    }
  ]
}
```

---

### 11. API TO UPLOAD CONVEYANCE PAYMENT FILE WITH UTR

**Endpoint**: `POST /api/payments/conveyance/upload-payment-file`

**Authorization**: Account Executive role required

**Description**: Uploads Excel file with conveyance payment details and UTR numbers

**Request Format**: `multipart/form-data`

**Excel File Structure (Expected)**

| Employee Name | Employee ID | Amount  | UTR             | Client   | Purpose        |
| ------------- | ----------- | ------- | --------------- | -------- | -------------- |
| Amit Sharma   | EMP001      | 2250.00 | HDFC24122110007 | Client A | Client meeting |
| Priya Singh   | EMP002      | 1500.00 | ICIC24122110008 | Client B | Site visit     |

**Success Response (200 OK)**

```json
{
  "success": true,
  "message": "Conveyance payment file uploaded successfully",
  "uploadSummary": {
    "totalRecords": 2,
    "validRecords": 2,
    "invalidRecords": 0,
    "totalAmount": 3750.0
  },
  "parsedData": [
    {
      "employeeName": "Amit Sharma",
      "employeeId": "EMP001",
      "amount": 2250.0,
      "utr": "HDFC24122110007",
      "client": "Client A",
      "purpose": "Client meeting"
    },
    {
      "employeeName": "Priya Singh",
      "employeeId": "EMP002",
      "amount": 1500.0,
      "utr": "ICIC24122110008",
      "client": "Client B",
      "purpose": "Site visit"
    }
  ]
}
```

---

### 12. API TO PROCESS CONVEYANCE PAYMENTS

**Endpoint**: `POST /api/payments/conveyance/process-payment`

**Authorization**: Account Executive role required

**Description**: Process conveyance payments with automatic GL posting

**Request Body (JSON)**

```json
{
  "paymentData": [
    {
      "employeeName": "Amit Sharma",
      "employeeId": "EMP001",
      "amount": 2250.0,
      "utr": "HDFC24122110007",
      "client": "Client A",
      "purpose": "Client meeting"
    },
    {
      "employeeName": "Priya Singh",
      "employeeId": "EMP002",
      "amount": 1500.0,
      "utr": "ICIC24122110008",
      "client": "Client B",
      "purpose": "Site visit"
    }
  ],
  "selectedBank": {
    "bankCode": "A3004003001",
    "bankName": "HDFC Bank - Main Account",
    "bankId": "BANK-001"
  },
  "processedBy": "AE001"
}
```

**Success Response (200 OK)**

```json
{
  "success": true,
  "message": "Conveyance payments processed successfully",
  "paymentSummary": {
    "totalEmployees": 2,
    "totalClaims": 2,
    "totalAmount": 3750.0,
    "voucherNo": "CPAY-20241221-0001",
    "transactionId": "TXN_CPAY_1734787500000"
  },
  "glPostingDetails": {
    "voucherNo": "CPAY-20241221-0001",
    "voucherType": "Payment Voucher",
    "entries": [
      {
        "lineNo": 1,
        "glCode": "X2001003",
        "glName": "CONVEYANCE EXPENSES",
        "debit": 2250.0,
        "credit": 0,
        "narration": "Conveyance - Amit Sharma - Client A"
      },
      {
        "lineNo": 2,
        "glCode": "X2001003",
        "glName": "CONVEYANCE EXPENSES",
        "debit": 1500.0,
        "credit": 0,
        "narration": "Conveyance - Priya Singh - Client B"
      },
      {
        "lineNo": 3,
        "glCode": "A3004003001",
        "glName": "HDFC Bank - Main Account",
        "debit": 0,
        "credit": 3750.0,
        "narration": "Conveyance payment (batch)"
      }
    ]
  }
}
```

---

## COMMON ERROR RESPONSES

### 401 Unauthorized

```json
{
  "success": false,
  "message": "Authentication required"
}
```

### 403 Forbidden

```json
{
  "success": false,
  "message": "You do not have permission to perform this action",
  "requiredRole": "Account Executive"
}
```

### 404 Not Found

```json
{
  "success": false,
  "message": "Payment data not found",
  "requestId": "VPAY-20241221-0001"
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "message": "An error occurred while processing payment",
  "error": "Database connection failed"
}
```

---

## WORKFLOW STATUS TRANSITIONS

### Vendor Payment Flow

1. **Invoice Approval** → Invoice added to pending payment queue
2. **Invoice Selection** → AE selects invoices for payment (full/partial)
3. **Download Files** → Bank Upload File + System Upload File generated
4. **Bank Processing** → AE uploads file to bank portal
5. **Upload with UTR** → AE fills UTR and uploads System Upload File
6. **Bank Selection** → AE selects payment bank account
7. **Final Processing** → Automatic GL posting
8. **Payment Complete** → Invoice marked as Paid, removed from queues

### Reliever Payment Flow

1. **Request Approval** → Reliever request approved and added to payment queue
2. **Upload with UTR** → AE uploads Excel with reliever details and UTR
3. **Bank Selection** → AE selects payment bank account
4. **Final Processing** → Automatic GL posting
5. **Payment Complete** → Request marked as Paid, removed from queue

### Conveyance Payment Flow

1. **Claim Approval** → Conveyance claim approved and added to payment queue
2. **Upload with UTR** → AE uploads Excel with conveyance details and UTR
3. **Bank Selection** → AE selects payment bank account
4. **Final Processing** → Automatic GL posting
5. **Payment Complete** → Claim marked as Paid, removed from queue

---

## GL CODE REFERENCE

### Vendor Payments

| Account Type        | GL Code      | GL Name                   | Parent GL                |
| ------------------- | ------------ | ------------------------- | ------------------------ |
| Vendor Ledgers      | L2005002_xxx | Vendor - [Vendor Name]    | L2005 (Sundry Creditors) |
| Rent Vendor Ledgers | L2005003_xxx | Vendor - [Property Owner] | L2005 (Sundry Creditors) |
| Bank Account        | A3004003xxx  | [Bank Name]               | A3004003 (Bank Accounts) |

### Reliever Payments

| Account Type | GL Code     | GL Name           | Parent GL                |
| ------------ | ----------- | ----------------- | ------------------------ |
| Expense      | X2001004    | RELIEVER EXPENSES | X2001 (Branch Expenses)  |
| Bank Account | A3004003xxx | [Bank Name]       | A3004003 (Bank Accounts) |

### Conveyance Payments

| Account Type | GL Code     | GL Name             | Parent GL                |
| ------------ | ----------- | ------------------- | ------------------------ |
| Expense      | X2001003    | CONVEYANCE EXPENSES | X2001 (Branch Expenses)  |
| Bank Account | A3004003xxx | [Bank Name]         | A3004003 (Bank Accounts) |

---

## SAMPLE DATA FLOW

### Complete Vendor Payment Lifecycle

**Step 1: Invoice Approval (Day 1)**

- AM/BM/Finance Head approves invoices
- Invoices added to respective queues
- Status: `Pending Payment`

**Step 2: Payment Selection (Day 2)**

- AE logs into Process of Payments
- Views all pending invoices grouped by vendor
- Selects invoices for payment:
  - INV-2024-001: Full payment ₹125,000
  - INV-2024-002: Partial payment ₹150,000 (of ₹250,000)
  - RENT-DEC-2024: Full payment ₹75,000

**Step 3: File Download (Day 2)**

- AE clicks "Download Payment Files"
- Two Excel files generated:
  - `Bank_Payment_File_20241221103000.xlsx` (2 vendors)
  - `System_Upload_File_20241221103000.xlsx` (3 invoices)
- Partial payment invoice remains in table with ₹100,000

**Step 4: Bank Processing (Day 3)**

- AE uploads Bank Upload File to bank portal
- Bank processes payments
- AE receives UTR numbers

**Step 5: UTR Entry (Day 3)**

- AE fills UTR in System Upload File:
  - ABC Enterprises: HDFC24122110001
  - Property Owner: ICIC24122110002
- Uploads completed file

**Step 6: Final Processing (Day 3)**

- Modal shows payment summary
- AE selects bank: HDFC Bank - Main Account
- Clicks "Process Payment"
- Automatic GL posting:
  ```
  Dr. L2005002_001_ABC_Enterprises  ₹275,000
  Dr. L2005003_001_Property_Owner   ₹75,000
  Cr. A3004003001 (HDFC Bank)       ₹350,000
  ```
- Voucher: VPAY-20241221-0001

**Result:**

- 3 invoices processed (2 full, 1 partial)
- 1 invoice remains (INV-2024-002 with ₹100,000)
- GL entries posted
- Payment complete

---

## END OF DOCUMENT

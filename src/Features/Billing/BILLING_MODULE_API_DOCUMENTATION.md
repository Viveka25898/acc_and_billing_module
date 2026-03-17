# Billing Module - API Documentation

**Version:** 1.0  
**Last Updated:** March 4, 2026  
**Module:** iSmart Accounts and Billing - Billing Module

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Base URL & Common Headers](#base-url--common-headers)
4. [Error Handling](#error-handling)
5. [Auto Billing APIs](#auto-billing-apis)
6. [Manual Billing APIs](#manual-billing-apis)
7. [Arrear Billing APIs](#arrear-billing-apis)
8. [Bonus & Leave Encashment Billing APIs](#bonus--leave-encashment-billing-apis)
9. [Rate Card Management APIs](#rate-card-management-apis)
10. [Proforma Invoice APIs](#proforma-invoice-apis)
11. [IRN Generated Invoice APIs](#irn-generated-invoice-apis)
12. [Master Data APIs](#master-data-apis)
13. [Notification & Dashboard APIs](#notification--dashboard-apis)
14. [E-Invoice Integration APIs](#e-invoice-integration-apis)
15. [Accounting & GL Posting APIs](#accounting--gl-posting-apis)

---

## Overview

The Billing Module APIs provide comprehensive endpoints for automated and manual billing operations, integrating with Commercial, Payroll, and Operations modules. All billing operations follow double-entry accounting principles and comply with GST E-Invoicing regulations.

**Key Features:**
- Auto Billing with Attendance Integration
- Manual Billing for Ad-hoc Services
- Arrear Billing for Rate Revisions
- Statutory Billing (Bonus/Leave Encashment)
- Proforma to IRN Conversion
- Real-time GL Posting
- E-Invoice API Integration

---

## Authentication

All API endpoints require Bearer Token authentication.

**Header:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Token Payload:**
```json
{
  "userId": "string",
  "role": "BILLING_MANAGER | COMMERCIAL_TEAM | FINANCIAL_HEAD",
  "permissions": ["string"],
  "state": "string",
  "branch": "string",
  "exp": "timestamp"
}
```

---

## Base URL & Common Headers

**Base URL:**
```
https://api.ismart-billing.com/v1
```

**Common Headers:**
```
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>
X-Request-ID: <UUID>
X-State-Code: <STATE_CODE>
X-Branch-Code: <BRANCH_CODE>
```

---

## Error Handling

### Standard Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": "Detailed error description",
    "field": "fieldName",
    "timestamp": "2026-03-04T10:30:00Z"
  }
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `AUTH_INVALID_TOKEN` | 401 | Invalid or expired token |
| `AUTH_INSUFFICIENT_PERMISSIONS` | 403 | User lacks required permissions |
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `RESOURCE_NOT_FOUND` | 404 | Requested resource not found |
| `BUSINESS_LOGIC_ERROR` | 422 | Business rule violation |
| `RATE_CARD_NOT_FOUND` | 404 | Rate card not configured for client |
| `ATTENDANCE_DATA_MISSING` | 404 | No attendance data available |
| `INVOICE_ALREADY_FINALIZED` | 409 | Invoice already has IRN |
| `E_INVOICE_API_ERROR` | 502 | E-Invoice portal API error |
| `INTERNAL_SERVER_ERROR` | 500 | Server error |

---

## Auto Billing APIs

### 1. Get Client Scope Data

**Endpoint:** `GET /billing/auto/step1/client-scope`

**Description:** Retrieves master data for client selection including states, cities, branches, and customers from Commercial Module.

**Query Parameters:**
- `state` (optional): Filter by state code
- `city` (optional): Filter by city code
- `branch` (optional): Filter by branch code

**Response:**
```json
{
  "success": true,
  "data": {
    "states": [
      {
        "code": "MH",
        "name": "Maharashtra",
        "cities": ["Mumbai", "Pune", "Nagpur"]
      }
    ],
    "branches": [
      {
        "id": "BR001",
        "name": "Mumbai HQ",
        "city": "Mumbai",
        "state": "MH"
      }
    ],
    "customers": [
      {
        "id": "CUST001",
        "name": "ABC Mall",
        "branch": "BR001",
        "totalSites": 3,
        "activeRateCards": 8,
        "lastInvoiceAmount": 245000,
        "lastInvoiceDate": "2026-02-15",
        "gstin": "27AABCU9603R1ZX"
      }
    ]
  }
}
```

---

### 2. Get Customer Sites

**Endpoint:** `GET /billing/auto/step1/customer-sites/{customerId}`

**Description:** Retrieves all sites/locations for a selected customer.

**Path Parameters:**
- `customerId` (required): Customer ID

**Query Parameters:**
- `state` (optional): Filter sites by state
- `status` (optional): `active` | `inactive` | `all` (default: `active`)

**Response:**
```json
{
  "success": true,
  "data": {
    "customer": {
      "id": "CUST001",
      "name": "ABC Mall"
    },
    "sites": [
      {
        "id": "SITE001",
        "name": "ABC Mall - Andheri",
        "state": "Maharashtra",
        "city": "Mumbai",
        "address": "Andheri West, Mumbai - 400058",
        "hasRateCard": true,
        "activeFrom": "2025-01-01",
        "siteType": "Mall",
        "gstin": "27AABCU9603R1ZX"
      },
      {
        "id": "SITE002",
        "name": "ABC Mall - Bandra",
        "state": "Maharashtra",
        "city": "Mumbai",
        "address": "Bandra West, Mumbai - 400050",
        "hasRateCard": true,
        "activeFrom": "2025-03-01",
        "siteType": "Mall",
        "gstin": "27AABCU9603R1ZX"
      }
    ]
  }
}
```

---

### 3. Get Billing Cycle Configuration

**Endpoint:** `POST /billing/auto/step2/billing-cycle`

**Description:** Retrieves or suggests billing cycle options for selected customer and month.

**Request Body:**
```json
{
  "customerId": "CUST001",
  "billingMonth": "2026-03",
  "sites": ["SITE001", "SITE002"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "isFirstTimeBilling": false,
    "fixedCycle": {
      "cycleId": "CYCLE001",
      "name": "16th to 15th",
      "cycleFrom": 16,
      "cycleTo": 15,
      "totalDays": 30,
      "divisionBy": 30,
      "dateRange": {
        "from": "2026-02-16",
        "to": "2026-03-15"
      },
      "isLocked": true
    },
    "availableCycles": null
  }
}
```

**Response (First Time Billing):**
```json
{
  "success": true,
  "data": {
    "isFirstTimeBilling": true,
    "fixedCycle": null,
    "availableCycles": [
      {
        "cycleId": "CYCLE_16_15",
        "name": "16th Previous Month to 15th Current Month",
        "cycleFrom": 16,
        "cycleTo": 15,
        "totalDays": 30,
        "divisionBy": 30,
        "example": "16th Feb to 15th Mar"
      },
      {
        "cycleId": "CYCLE_21_20",
        "name": "21st Previous Month to 20th Current Month",
        "cycleFrom": 21,
        "cycleTo": 20,
        "totalDays": 30,
        "divisionBy": 30,
        "example": "21st Feb to 20th Mar"
      },
      {
        "cycleId": "CYCLE_25_25",
        "name": "25th Previous Month to 25th Current Month",
        "cycleFrom": 25,
        "cycleTo": 25,
        "totalDays": 31,
        "divisionBy": 31,
        "example": "25th Feb to 25th Mar"
      },
      {
        "cycleId": "CYCLE_01_EOM",
        "name": "1st Current Month to End of Month",
        "cycleFrom": 1,
        "cycleTo": "EOM",
        "totalDays": 31,
        "divisionBy": 31,
        "example": "1st Mar to 31st Mar"
      }
    ]
  }
}
```

**Business Rules:**
- If billing cycle exists in Payroll Module for this customer, return `fixedCycle` with `isLocked: true`
- If first time billing, return all `availableCycles`
- Once cycle is selected for first time, it must be stored in Payroll Module as permanent cycle for that customer

---

### 4. Set Billing Cycle (First Time Only)

**Endpoint:** `POST /billing/auto/step2/set-billing-cycle`

**Description:** Sets the billing cycle for a customer (first time only). This becomes permanent for future bills.

**Request Body:**
```json
{
  "customerId": "CUST001",
  "cycleId": "CYCLE_16_15",
  "effectiveFrom": "2026-03-01"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Billing cycle set successfully",
    "customerId": "CUST001",
    "cycle": {
      "cycleId": "CYCLE_16_15",
      "name": "16th to 15th",
      "cycleFrom": 16,
      "cycleTo": 15,
      "totalDays": 30,
      "divisionBy": 30,
      "isPermanent": true,
      "effectiveFrom": "2026-03-01"
    }
  }
}
```

**Business Rules:**
- This API should only succeed if `isFirstTimeBilling: true`
- Once set, the cycle is permanent and stored in Payroll Module
- Future billing for this customer will automatically use this cycle

---

### 5. Calculate Billing Lines (Auto-Calculation Engine)

**Endpoint:** `POST /billing/auto/step4/calculate`

**Description:** Core calculation engine that computes billing amounts based on attendance data from Payroll and rates from Commercial Module.

**Request Body:**
```json
{
  "customerId": "CUST001",
  "sites": ["SITE001", "SITE002"],
  "billingMonth": "2026-03",
  "billingCycle": {
    "cycleFrom": 16,
    "cycleTo": 15,
    "dateRange": {
      "from": "2026-02-16",
      "to": "2026-03-15"
    },
    "totalDays": 30
  },
  "invoiceType": "REGULAR"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "poWoNumber": "PO/2025/ABCMall/001",
    "calculationSummary": {
      "totalSites": 2,
      "totalLineItems": 15,
      "subtotal": 425000.00,
      "cgst": 38250.00,
      "sgst": 38250.00,
      "igst": 0.00,
      "grandTotal": 501500.00
    },
    "billingLines": [
      {
        "lineNo": 1,
        "siteId": "SITE001",
        "siteName": "ABC Mall - Andheri",
        "category": "PERSONNEL",
        "designation": "Housekeeping Supervisor",
        "productCode": "HK_SUPERVISOR",
        "headcount": 2,
        "dutyDays": 30,
        "ratePerMonth": 18000.00,
        "ratePerDay": 600.00,
        "amount": 36000.00,
        "revenueLedger": "R1001001",
        "revenueLedgerName": "Housekeeping Charges",
        "gstRate": 18,
        "hsnSac": "998599",
        "dataSource": "PAYROLL"
      },
      {
        "lineNo": 2,
        "siteId": "SITE001",
        "siteName": "ABC Mall - Andheri",
        "category": "PERSONNEL",
        "designation": "Housekeeping Staff",
        "productCode": "HK_STAFF",
        "headcount": 12,
        "dutyDays": 28,
        "ratePerMonth": 15000.00,
        "ratePerDay": 500.00,
        "amount": 168000.00,
        "revenueLedger": "R1001001",
        "revenueLedgerName": "Housekeeping Charges",
        "gstRate": 18,
        "hsnSac": "998599",
        "dataSource": "PAYROLL",
        "remarks": "2 employees on leave for 2 days"
      },
      {
        "lineNo": 3,
        "siteId": "SITE001",
        "siteName": "ABC Mall - Andheri",
        "category": "MACHINERY",
        "designation": null,
        "productCode": "SCRUBBER_MACHINE",
        "productName": "Ride On Scrubber",
        "headcount": 1,
        "dutyDays": 30,
        "ratePerMonth": 12000.00,
        "ratePerDay": 400.00,
        "amount": 12000.00,
        "revenueLedger": "R1005400",
        "revenueLedgerName": "Rent on Machinery",
        "gstRate": 18,
        "hsnSac": "997212",
        "billingType": "FIXED",
        "dataSource": "COMMERCIAL"
      },
      {
        "lineNo": 4,
        "siteId": "SITE001",
        "siteName": "ABC Mall - Andheri",
        "category": "MATERIAL",
        "designation": null,
        "productCode": "CLEANING_MAT",
        "productName": "Cleaning Materials",
        "quantity": 45.5,
        "unit": "KG",
        "ratePerUnit": 150.00,
        "amount": 6825.00,
        "revenueLedger": "R1005200",
        "revenueLedgerName": "HK Material",
        "gstRate": 18,
        "hsnSac": "340290",
        "billingType": "AT_ACTUAL",
        "dataSource": "PROCUREMENT_GRN"
      },
      {
        "lineNo": 5,
        "siteId": "SITE001",
        "siteName": "ABC Mall - Andheri",
        "category": "OVERTIME",
        "designation": "Housekeeping Staff",
        "productCode": "HK_STAFF_OT",
        "headcount": 5,
        "otHours": 24,
        "hourlyRate": 75.00,
        "amount": 1800.00,
        "revenueLedger": "R1001001",
        "revenueLedgerName": "Housekeeping Charges - OT",
        "gstRate": 18,
        "hsnSac": "998599",
        "otType": "CLIENT_OT",
        "dataSource": "PAYROLL",
        "remarks": "Client requested overtime"
      }
    ],
    "variance": {
      "hasVariance": true,
      "expectedTotal": 420000.00,
      "actualTotal": 425000.00,
      "difference": 5000.00,
      "percentageChange": 1.19,
      "reason": "Additional overtime charges"
    },
    "previousMonthComparison": {
      "previousMonth": "2026-02",
      "previousTotal": 418000.00,
      "currentTotal": 425000.00,
      "difference": 7000.00,
      "percentageChange": 1.67
    }
  }
}
```

**Calculation Logic Requirements:**

1. **Personnel Calculation:**
   - Fetch duty days from Payroll Module for each employee/designation
   - Fetch CTC rate from Commercial Module
   - Calculate daily rate: `ratePerDay = ratePerMonth / totalDaysInCycle`
   - Calculate amount: `amount = ratePerDay * dutyDays * headcount`

2. **Material Calculation:**
   - **Fixed/Sq Ft:** Fetch rate from Commercial Module (monthly fixed rate)
   - **At Actual/Budgeted:** Fetch actual usage data from Procurement GRN
   - Calculate: `amount = ratePerMonth * (dutyDays / totalDaysInCycle)`

3. **Machinery Calculation:**
   - Fetch rate from Commercial Module
   - Check machine deployment date on the site
   - Calculate billing based on actual days machine was deployed
   - Calculate: `amount = ratePerMonth * (actualDeployedDays / totalDaysInCycle)`
   - If machine deployed mid-cycle, bill only for actual deployed days

4. **Overtime Calculation:**
   - **Client OT:** 
     - Fetch OT hours from Payroll
     - Fetch hourly rate from Commercial Module
     - Calculate: `amount = otHours * hourlyRate`
   - **Internal OT:**
     - Convert hours to days: `days = otHours / 8`
     - Add to regular duty days (no separate billing line)

5. **Revenue Mapping:**
   - Housekeeping → R1001001 (Housekeeping Charges)
   - Manpower Services → R1005100 (Manpower Services)
   - HK Material → R1005200 (HK Material)
   - Rent on Machinery → R1005400 (Rent on Machinery)

**Error Handling:**
- If attendance data missing: Return error `ATTENDANCE_DATA_MISSING`
- If rate card not found: Return error `RATE_CARD_NOT_FOUND`
- If GRN data missing for "At Actual" items: Return error `GRN_DATA_MISSING`

---

### 6. Save Billing Draft

**Endpoint:** `POST /billing/auto/draft`

**Description:** Saves billing calculation as draft/proforma invoice.

**Request Body:**
```json
{
  "customerId": "CUST001",
  "sites": ["SITE001", "SITE002"],
  "billingMonth": "2026-03",
  "billingCycle": {
    "cycleFrom": 16,
    "cycleTo": 15,
    "dateRange": {
      "from": "2026-02-16",
      "to": "2026-03-15"
    }
  },
  "invoiceSeries": "PROFORMA",
  "invoiceType": "REGULAR",
  "poWoNumber": "PO/2025/ABCMall/001",
  "billingLines": [...],
  "calculations": {
    "subtotal": 425000.00,
    "cgst": 38250.00,
    "sgst": 38250.00,
    "grandTotal": 501500.00
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "invoiceId": "PROF-2026-03-0001",
    "invoiceNumber": "PROF/MH/2026/0001",
    "status": "DRAFT",
    "createdAt": "2026-03-04T10:30:00Z",
    "createdBy": "USER123",
    "message": "Draft invoice saved successfully"
  }
}
```

---

### 7. Generate Invoice Preview

**Endpoint:** `GET /billing/auto/preview/{invoiceId}`

**Description:** Generates high-fidelity invoice preview with all details.

**Path Parameters:**
- `invoiceId` (required): Invoice ID

**Response:**
```json
{
  "success": true,
  "data": {
    "invoice": {
      "invoiceId": "PROF-2026-03-0001",
      "invoiceNumber": "PROF/MH/2026/0001",
      "invoiceDate": "2026-03-15",
      "dueDate": "2026-04-14",
      "status": "DRAFT",
      "seller": {
        "name": "iSmart Facility Services Pvt Ltd",
        "address": "Mumbai, Maharashtra - 400001",
        "gstin": "27AABCI9999R1Z5",
        "pan": "AABCI9999R",
        "state": "Maharashtra",
        "stateCode": "27"
      },
      "buyer": {
        "customerId": "CUST001",
        "name": "ABC Mall",
        "address": "Andheri West, Mumbai - 400058",
        "gstin": "27AABCU9603R1ZX",
        "state": "Maharashtra",
        "stateCode": "27",
        "contactPerson": "Mr. Sharma",
        "email": "accounts@abcmall.com",
        "phone": "+91-9876543210"
      },
      "billing": {
        "period": "16th Feb 2026 to 15th Mar 2026",
        "poWoNumber": "PO/2025/ABCMall/001",
        "poDate": "2025-12-01",
        "sites": ["ABC Mall - Andheri", "ABC Mall - Bandra"]
      },
      "lineItems": [...],
      "summary": {
        "subtotal": 425000.00,
        "cgst": 38250.00,
        "sgst": 38250.00,
        "igst": 0.00,
        "roundOff": 0.00,
        "grandTotal": 501500.00,
        "amountInWords": "Rupees Five Lakh One Thousand Five Hundred Only"
      },
      "taxSummary": [
        {
          "hsnSac": "998599",
          "taxableAmount": 360000.00,
          "cgstRate": 9,
          "cgstAmount": 32400.00,
          "sgstRate": 9,
          "sgstAmount": 32400.00,
          "totalTax": 64800.00,
          "total": 424800.00
        }
      ],
      "bankDetails": {
        "accountName": "iSmart Facility Services Pvt Ltd",
        "accountNumber": "1234567890",
        "ifscCode": "HDFC0001234",
        "bankName": "HDFC Bank",
        "branch": "Mumbai Main Branch"
      },
      "terms": [
        "Payment due within 30 days",
        "Subject to Mumbai Jurisdiction",
        "Interest @18% p.a. will be charged on delayed payments"
      ]
    }
  }
}
```

---

### 8. Convert to Final Invoice (IRN Generation)

**Endpoint:** `POST /billing/auto/convert-to-final/{invoiceId}`

**Description:** Converts proforma to final sales invoice with IRN generation and GL posting.

**Path Parameters:**
- `invoiceId` (required): Proforma Invoice ID

**Request Body:**
```json
{
  "invoiceDate": "2026-03-15",
  "dueDate": "2026-04-14",
  "remarks": "Final invoice for March 2026"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "invoiceId": "INV-2026-03-0001",
    "invoiceNumber": "INV/MH/2026/0001",
    "status": "IRN_GENERATED",
    "invoiceDate": "2026-03-15",
    "dueDate": "2026-04-14",
    "irnDetails": {
      "irnNumber": "ad69b476cf94a05152bd7fdfd93d98ff1bf53bb816c9b5ff0c8088e3f649f5d5",
      "acknowledgementNumber": "112026033015181",
      "acknowledgementDate": "2026-03-15T10:45:00Z",
      "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
    },
    "accounting": {
      "voucherNo": "JV/MH/2026/0156",
      "voucherDate": "2026-03-15",
      "posted": true,
      "entries": [
        {
          "lineNo": 1,
          "glCode": "L2001001",
          "glName": "ABC Mall - Sundry Debtors",
          "debit": 501500.00,
          "credit": 0.00,
          "narration": "Invoice INV/MH/2026/0001 for period 16th Feb to 15th Mar"
        },
        {
          "lineNo": 2,
          "glCode": "R1001001",
          "glName": "Housekeeping Charges",
          "debit": 0.00,
          "credit": 425000.00,
          "narration": "Revenue recognition - Housekeeping services"
        },
        {
          "lineNo": 3,
          "glCode": "L2003001",
          "glName": "Output CGST",
          "debit": 0.00,
          "credit": 38250.00,
          "narration": "CGST @ 9% on taxable value"
        },
        {
          "lineNo": 4,
          "glCode": "L2003002",
          "glName": "Output SGST",
          "debit": 0.00,
          "credit": 38250.00,
          "narration": "SGST @ 9% on taxable value"
        }
      ]
    },
    "message": "Invoice finalized successfully with IRN"
  }
}
```

**Backend Process Flow:**
1. Validate all mandatory e-invoice fields (HSN, GSTIN, Address)
2. Call E-Invoice API service to generate IRN
3. Receive IRN, QR Code, and Acknowledgement Number
4. Generate unique Voucher Number for accounting
5. Post GL Entries:
   - **Debit:** L2001 - {Client Ledger} (Sundry Debtors) - Grand Total
   - **Credit:** R1001001 - Revenue Ledger - Taxable Amount
   - **Credit:** L2003001 - Output CGST - CGST Amount
   - **Credit:** L2003002 - Output SGST - SGST Amount
6. Move invoice from Proforma storage to Tax Invoice storage
7. Update invoice status to "FINAL"
8. Send notification to Billing Manager
9. Trigger email to customer (optional)

---

## Manual Billing APIs

### 1. Get Service Categories

**Endpoint:** `GET /billing/manual/service-categories`

**Description:** Retrieves list of service categories with revenue ledger mapping.

**Response:**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "code": "ONE_TIME_SERVICE",
        "name": "One-Time Service",
        "revenueLedger": "R1004",
        "revenueLedgerName": "One Time Service Income",
        "defaultGstRate": 18,
        "defaultHsnSac": "998599"
      },
      {
        "code": "HOSPITAL_BILLING",
        "name": "Hospital Billing",
        "revenueLedger": "R1002",
        "revenueLedgerName": "Hospital Service Income",
        "defaultGstRate": 18,
        "defaultHsnSac": "998599"
      },
      {
        "code": "MST_MATERIAL",
        "name": "MST Material",
        "revenueLedger": "R1005200",
        "revenueLedgerName": "HK Material",
        "defaultGstRate": 18,
        "defaultHsnSac": "340290"
      },
      {
        "code": "RNM_MAINTENANCE",
        "name": "R&M Maintenance",
        "revenueLedger": "R1006",
        "revenueLedgerName": "Repair & Maintenance Income",
        "defaultGstRate": 18,
        "defaultHsnSac": "995414"
      },
      {
        "code": "DEEP_CLEANING",
        "name": "Deep Cleaning",
        "revenueLedger": "R1001001",
        "revenueLedgerName": "Housekeeping Charges",
        "defaultGstRate": 18,
        "defaultHsnSac": "998599"
      }
    ]
  }
}
```

---

### 2. Generate PO/WO Number

**Endpoint:** `POST /billing/manual/generate-po-number`

**Description:** Generates unique PO/WO number based on series and customer.

**Request Body:**
```json
{
  "customerId": "CUST001",
  "invoiceSeries": "PROFORMA",
  "serviceCategory": "ONE_TIME_SERVICE"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "poWoNumber": "MB/PROF/2026/0023",
    "series": "PROFORMA",
    "year": "2026",
    "sequenceNumber": 23
  }
}
```

---

### 3. Create Manual Invoice

**Endpoint:** `POST /billing/manual/create`

**Description:** Creates manual invoice with custom line items.

**Request Body:**
```json
{
  "customerId": "CUST001",
  "serviceCategory": "DEEP_CLEANING",
  "invoiceSeries": "PROFORMA",
  "poWoNumber": "MB/PROF/2026/0023",
  "invoiceDate": "2026-03-15",
  "dueDate": "2026-04-14",
  "lineItems": [
    {
      "description": "Deep Cleaning - Floor 1 to 5",
      "quantity": 5,
      "unit": "Floors",
      "rate": 5000.00,
      "amount": 25000.00,
      "hsnSac": "998599",
      "gstRate": 18
    },
    {
      "description": "Carpet Shampooing",
      "quantity": 200,
      "unit": "Sq Ft",
      "rate": 15.00,
      "amount": 3000.00,
      "hsnSac": "998599",
      "gstRate": 18
    }
  ],
  "discount": 0.00,
  "otherCharges": 0.00,
  "remarks": "Emergency deep cleaning service"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "invoiceId": "MB-2026-03-0023",
    "invoiceNumber": "MB/PROF/2026/0023",
    "status": "DRAFT",
    "calculations": {
      "subtotal": 28000.00,
      "cgst": 2520.00,
      "sgst": 2520.00,
      "discount": 0.00,
      "otherCharges": 0.00,
      "roundOff": 0.00,
      "grandTotal": 33040.00,
      "amountInWords": "Rupees Thirty Three Thousand Forty Only"
    },
    "createdAt": "2026-03-15T11:00:00Z",
    "message": "Manual invoice created successfully"
  }
}
```

---

## Arrear Billing APIs

### 1. Get Pending Arrears Dashboard

**Endpoint:** `GET /billing/arrear/pending`

**Description:** Retrieves list of clients with pending rate changes requiring arrear billing.

**Query Parameters:**
- `state` (optional): Filter by state
- `client` (optional): Filter by client ID
- `status` (optional): `pending` | `processed` | `all`

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalPending": 8,
      "totalProcessed": 15,
      "totalArrearAmount": 125000.00
    },
    "pendingArrears": [
      {
        "id": "ARR-REQ-001",
        "customerId": "CUST001",
        "customerName": "ABC Mall",
        "siteId": "SITE001",
        "siteName": "ABC Mall - Andheri",
        "rateChangeDate": "2026-02-01",
        "effectiveFromDate": "2026-01-01",
        "affectedMonths": ["2026-01", "2026-02"],
        "designation": "Housekeeping Staff",
        "oldRate": 15000.00,
        "newRate": 16000.00,
        "rateDifference": 1000.00,
        "estimatedArrearAmount": 24000.00,
        "status": "PENDING",
        "daysPending": 32,
        "createdAt": "2026-02-01T10:00:00Z",
        "notifiedAt": "2026-02-01T10:05:00Z"
      }
    ]
  }
}
```

---

### 2. Calculate Arrear Amount

**Endpoint:** `POST /billing/arrear/calculate`

**Description:** Calculates arrear billing amount based on rate difference and attendance data.

**Request Body:**
```json
{
  "arrearRequestId": "ARR-REQ-001",
  "customerId": "CUST001",
  "siteId": "SITE001",
  "effectiveFromDate": "2026-01-01",
  "rateChangeDate": "2026-02-01",
  "affectedMonths": ["2026-01", "2026-02"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "arrearRequestId": "ARR-REQ-001",
    "customer": {
      "id": "CUST001",
      "name": "ABC Mall"
    },
    "site": {
      "id": "SITE001",
      "name": "ABC Mall - Andheri"
    },
    "rateChange": {
      "effectiveFromDate": "2026-01-01",
      "rateChangeDate": "2026-02-01",
      "affectedPeriod": "1st Jan 2026 to 31st Jan 2026"
    },
    "calculationLines": [
      {
        "lineNo": 1,
        "month": "2026-01",
        "designation": "Housekeeping Staff",
        "oldRate": 15000.00,
        "newRate": 16000.00,
        "rateDifference": 1000.00,
        "employeeCount": 12,
        "workingDays": 30,
        "arrearAmount": 12000.00,
        "dataSource": "PAYROLL",
        "isEditable": true
      },
      {
        "lineNo": 2,
        "month": "2026-02",
        "designation": "Housekeeping Staff",
        "oldRate": 15000.00,
        "newRate": 16000.00,
        "rateDifference": 1000.00,
        "employeeCount": 12,
        "workingDays": 28,
        "arrearAmount": 11200.00,
        "dataSource": "PAYROLL",
        "isEditable": true
      }
    ],
    "manualLineItems": [],
    "summary": {
      "totalArrearAmount": 23200.00,
      "cgst": 2088.00,
      "sgst": 2088.00,
      "grandTotal": 27376.00
    }
  }
}
```

**Calculation Logic:**
```
Arrear Amount = (New Rate - Old Rate) * Employee Count * Working Days / Total Days in Month
```

---

### 3. Update Arrear Calculation

**Endpoint:** `PUT /billing/arrear/update-calculation`

**Description:** Allows editing of employee count or working days if exceptions apply.

**Request Body:**
```json
{
  "arrearRequestId": "ARR-REQ-001",
  "calculationLines": [
    {
      "lineNo": 1,
      "employeeCount": 11,
      "workingDays": 28,
      "remarks": "1 employee on leave for 2 days"
    }
  ],
  "manualLineItems": [
    {
      "description": "Arrear for Cleaning Material",
      "quantity": 1,
      "rate": 2000.00,
      "amount": 2000.00
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Arrear calculation updated",
    "updatedCalculation": {
      "totalArrearAmount": 22400.00,
      "cgst": 2016.00,
      "sgst": 2016.00,
      "grandTotal": 26432.00
    }
  }
}
```

---

### 4. Generate Arrear Invoice

**Endpoint:** `POST /billing/arrear/generate`

**Description:** Generates arrear invoice after calculation approval.

**Request Body:**
```json
{
  "arrearRequestId": "ARR-REQ-001",
  "invoiceSeries": "PROFORMA",
  "invoiceDate": "2026-03-15",
  "dueDate": "2026-04-14",
  "calculationLines": [...],
  "manualLineItems": [...]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "invoiceId": "ARR-2026-03-0001",
    "invoiceNumber": "ARR/PROF/2026/0001",
    "series": "ARR-YYYY-XXXX",
    "status": "DRAFT",
    "calculations": {
      "totalArrearAmount": 23200.00,
      "cgst": 2088.00,
      "sgst": 2088.00,
      "grandTotal": 27376.00
    },
    "message": "Arrear invoice generated successfully"
  }
}
```

**Important Notes:**
- Future invoices for this client should automatically use the new rate from Commercial Module
- Mark the arrear request as "PROCESSED"

---

## Bonus & Leave Encashment Billing APIs

### 1. Get Pending Bonus/Leave Dashboard

**Endpoint:** `GET /billing/bonus-leave/pending`

**Description:** Retrieves list of clients with pending bonus or leave encashment data from Payroll.

**Query Parameters:**
- `client` (optional): Filter by client ID
- `period` (optional): Filter by period (YYYY-MM)
- `component` (optional): `BONUS` | `LEAVE_ENCASHMENT` | `ALL`
- `status` (optional): `pending` | `billed` | `draft`

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalPending": 12,
      "totalBilled": 35,
      "totalAmount": 2500000.00
    },
    "pendingRecords": [
      {
        "id": "BL-REQ-001",
        "customerId": "CUST001",
        "customerName": "ABC Mall",
        "period": "2026-03",
        "components": {
          "hasBonus": true,
          "hasLeaveEncashment": true
        },
        "totalEmployees": 45,
        "bonusAmount": 185000.00,
        "leaveEncashmentAmount": 42000.00,
        "totalAmount": 227000.00,
        "status": "PENDING",
        "processedDate": "2026-03-20T10:00:00Z"
      }
    ]
  }
}
```

---

### 2. Validate Bonus/Leave Component

**Endpoint:** `POST /billing/bonus-leave/validate`

**Description:** Validates if selected components have data and checks LWW option for leave encashment.

**Request Body:**
```json
{
  "customerId": "CUST001",
  "period": "2026-03",
  "components": {
    "includeBonus": true,
    "includeLeaveEncashment": true
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "validation": {
      "bonus": {
        "hasData": true,
        "employeeCount": 45,
        "totalAmount": 185000.00,
        "canBill": true
      },
      "leaveEncashment": {
        "hasData": true,
        "employeeCount": 38,
        "totalAmount": 42000.00,
        "canBill": true,
        "lwwOption": false,
        "lwwCheckNote": "LWW option not present in salary structure - Leave encashment billing allowed"
      }
    },
    "warning": null
  }
}
```

**Business Rule:**
- If `lwwOption: true` in salary structure (Commercial Module), then `canBill: false` for leave encashment
- Warning message: "Leave With Wages (LWW) is enabled for this client. Leave Encashment billing is not applicable."

---

### 3. Get Bonus/Leave Calculation Data

**Endpoint:** `POST /billing/bonus-leave/calculation`

**Description:** Retrieves detailed employee-wise bonus and leave encashment data from Payroll.

**Request Body:**
```json
{
  "customerId": "CUST001",
  "period": "2026-03",
  "components": {
    "includeBonus": true,
    "includeLeaveEncashment": true
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "customer": {
      "id": "CUST001",
      "name": "ABC Mall"
    },
    "period": "2026-03",
    "poWoNumber": "BL-202603-0001",
    "bonusData": {
      "employees": [
        {
          "employeeId": "EMP001",
          "employeeName": "John Doe",
          "designation": "Housekeeping Supervisor",
          "siteId": "SITE001",
          "siteName": "ABC Mall - Andheri",
          "basic": 18000.00,
          "bonusPercentage": 8.33,
          "bonusAmount": 1499.40,
          "monthsWorked": 12
        }
      ],
      "totalEmployees": 45,
      "totalBonusAmount": 185000.00
    },
    "leaveEncashmentData": {
      "employees": [
        {
          "employeeId": "EMP001",
          "employeeName": "John Doe",
          "designation": "Housekeeping Supervisor",
          "siteId": "SITE001",
          "siteName": "ABC Mall - Andheri",
          "leaveDays": 5,
          "dailyRate": 600.00,
          "encashmentAmount": 3000.00
        }
      ],
      "totalEmployees": 38,
      "totalLeaveAmount": 42000.00
    },
    "summary": {
      "subtotal": 227000.00,
      "cgst": 20430.00,
      "sgst": 20430.00,
      "grandTotal": 267860.00
    }
  }
}
```

**Data Source:**
- Bonus: Fetched from Payroll Module (Bonus % from Commercial Module)
- Leave Encashment: Fetched from Payroll Module (Daily Rate from Commercial Module)
- All amounts are READ-ONLY to maintain data integrity

---

### 4. Generate Bonus/Leave Invoice

**Endpoint:** `POST /billing/bonus-leave/generate`

**Description:** Generates invoice for bonus and/or leave encashment.

**Request Body:**
```json
{
  "customerId": "CUST001",
  "period": "2026-03",
  "poWoNumber": "BL-202603-0001",
  "invoiceSeries": "PROFORMA",
  "components": {
    "includeBonus": true,
    "includeLeaveEncashment": true
  },
  "invoiceDate": "2026-03-25",
  "dueDate": "2026-04-24"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "invoiceId": "BL-2026-03-0001",
    "invoiceNumber": "BL/PROF/2026/0001",
    "status": "DRAFT",
    "calculations": {
      "bonusAmount": 185000.00,
      "leaveAmount": 42000.00,
      "subtotal": 227000.00,
      "cgst": 20430.00,
      "sgst": 20430.00,
      "grandTotal": 267860.00
    },
    "message": "Bonus & Leave Encashment invoice generated successfully"
  }
}
```

---

## Rate Card Management APIs

### 1. Get Rate Cards

**Endpoint:** `GET /billing/rate-card/list`

**Description:** Retrieves rate cards with filtering options. Read-only access for Billing Manager.

**Query Parameters:**
- `state` (optional): Filter by state code
- `clientId` (optional): Filter by client ID
- `siteId` (optional): Filter by site ID
- `designation` (optional): Search by designation
- `product` (optional): Search by product name
- `type` (optional): `PERSONNEL` | `MACHINERY` | `MATERIAL` | `ALL`

**Response:**
```json
{
  "success": true,
  "data": {
    "rateCards": [
      {
        "id": "RC-001",
        "clientId": "CUST001",
        "clientName": "ABC Mall",
        "state": "Maharashtra",
        "siteId": "SITE001",
        "siteName": "ABC Mall - Andheri",
        "type": "PERSONNEL",
        "designation": "Housekeeping Supervisor",
        "productCode": "HK_SUPERVISOR",
        "dailyRate": 600.00,
        "monthlyRate": 18000.00,
        "gstRate": 18,
        "hsnSac": "998599",
        "effectiveDate": "2026-01-01",
        "lastUpdatedBy": "COMMERCIAL_USER_01",
        "lastUpdatedAt": "2026-01-01T09:00:00Z",
        "isActive": true
      },
      {
        "id": "RC-002",
        "clientId": "CUST001",
        "clientName": "ABC Mall",
        "state": "Maharashtra",
        "siteId": "SITE001",
        "siteName": "ABC Mall - Andheri",
        "type": "MACHINERY",
        "designation": null,
        "productCode": "SCRUBBER_MACHINE",
        "productName": "Ride On Scrubber",
        "billingType": "FIXED",
        "monthlyRate": 12000.00,
        "gstRate": 18,
        "hsnSac": "997212",
        "effectiveDate": "2026-01-01",
        "lastUpdatedBy": "COMMERCIAL_USER_01",
        "lastUpdatedAt": "2026-01-01T09:00:00Z",
        "isActive": true
      }
    ]
  }
}
```

---

### 2. Get Rate Card History

**Endpoint:** `GET /billing/rate-card/history/{rateCardId}`

**Description:** Retrieves complete modification history of a rate card.

**Path Parameters:**
- `rateCardId` (required): Rate Card ID

**Response:**
```json
{
  "success": true,
  "data": {
    "rateCardId": "RC-001",
    "designation": "Housekeeping Supervisor",
    "currentRate": 18000.00,
    "history": [
      {
        "version": 3,
        "dailyRate": 600.00,
        "monthlyRate": 18000.00,
        "effectiveDate": "2026-01-01",
        "updatedBy": "COMMERCIAL_USER_01",
        "updatedByName": "Rahul Sharma",
        "updatedAt": "2026-01-01T09:00:00Z",
        "reason": "Annual increment"
      },
      {
        "version": 2,
        "dailyRate": 550.00,
        "monthlyRate": 16500.00,
        "effectiveDate": "2025-07-01",
        "updatedBy": "COMMERCIAL_USER_01",
        "updatedByName": "Rahul Sharma",
        "updatedAt": "2025-07-01T10:00:00Z",
        "reason": "Mid-year revision"
      },
      {
        "version": 1,
        "dailyRate": 500.00,
        "monthlyRate": 15000.00,
        "effectiveDate": "2025-01-01",
        "updatedBy": "COMMERCIAL_USER_01",
        "updatedByName": "Rahul Sharma",
        "updatedAt": "2025-01-01T11:00:00Z",
        "reason": "Initial rate card"
      }
    ]
  }
}
```

---

## Proforma Invoice APIs

### 1. Get Proforma Invoices

**Endpoint:** `GET /billing/proforma/list`

**Description:** Retrieves all proforma invoices with filtering and pagination.

**Query Parameters:**
- `search` (optional): Search by invoice number or client name
- `status` (optional): `DRAFT` | `SENT` | `RECEIVED` | `CONVERTED` | `ALL`
- `dateFrom` (optional): Filter by date range (from)
- `dateTo` (optional): Filter by date range (to)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Records per page (default: 20)

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "total": 156,
      "draft": 25,
      "sent": 42,
      "received": 18,
      "converted": 71
    },
    "invoices": [
      {
        "invoiceId": "PROF-2026-03-0001",
        "invoiceNumber": "PROF/MH/2026/0001",
        "invoiceDate": "2026-03-15",
        "customerId": "CUST001",
        "customerName": "ABC Mall",
        "grandTotal": 501500.00,
        "status": "SENT",
        "createdBy": "USER123",
        "createdByName": "Amit Patel",
        "createdAt": "2026-03-15T10:30:00Z",
        "sentAt": "2026-03-15T11:00:00Z",
        "billingType": "AUTO",
        "actions": ["VIEW", "DOWNLOAD", "MARK_RECEIVED", "CONVERT_TO_IRN"]
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 8,
      "totalRecords": 156,
      "recordsPerPage": 20
    }
  }
}
```

---

### 2. Get Proforma Invoice Detail

**Endpoint:** `GET /billing/proforma/{invoiceId}`

**Description:** Retrieves complete details of a proforma invoice.

**Path Parameters:**
- `invoiceId` (required): Proforma Invoice ID

**Response:** (Same structure as Auto Billing Preview API)

---

### 3. Mark Proforma as Sent

**Endpoint:** `PUT /billing/proforma/{invoiceId}/mark-sent`

**Description:** Updates invoice status to "Sent" for audit trail.

**Path Parameters:**
- `invoiceId` (required): Proforma Invoice ID

**Request Body:**
```json
{
  "sentTo": "accounts@abcmall.com",
  "sentVia": "EMAIL",
  "remarks": "Invoice sent via email to client accounts department"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "invoiceId": "PROF-2026-03-0001",
    "status": "SENT",
    "sentAt": "2026-03-15T11:00:00Z",
    "sentBy": "USER123",
    "message": "Invoice marked as sent"
  }
}
```

---

### 4. Mark Proforma as Received (Client Approved)

**Endpoint:** `PUT /billing/proforma/{invoiceId}/mark-received`

**Description:** Marks invoice as client approved and ready for IRN generation.

**Path Parameters:**
- `invoiceId` (required): Proforma Invoice ID

**Request Body:**
```json
{
  "approvedBy": "Mr. Sharma",
  "approvalDate": "2026-03-18",
  "remarks": "Client approved via email"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "invoiceId": "PROF-2026-03-0001",
    "status": "RECEIVED",
    "approvedAt": "2026-03-18T14:00:00Z",
    "message": "Invoice marked as received/approved. Ready for IRN generation."
  }
}
```

---

### 5. Convert Proforma to IRN

**Endpoint:** `POST /billing/proforma/{invoiceId}/convert-to-irn`

**Description:** Converts proforma invoice to final sales invoice with IRN generation.

**Path Parameters:**
- `invoiceId` (required): Proforma Invoice ID

**Request Body:**
```json
{
  "invoiceDate": "2026-03-20",
  "dueDate": "2026-04-19",
  "finalRemarks": "Final invoice for March 2026 billing"
}
```

**Response:** (Same as Auto Billing Convert to Final API)

**Backend Process:**
1. Validate all mandatory e-invoice fields
2. Call E-Invoice API to generate IRN
3. Generate accounting voucher number
4. Post GL entries
5. Move from Proforma to Tax Invoice storage
6. Update status to "CONVERTED"
7. Send notification

---

## IRN Generated Invoice APIs

### 1. Get IRN Invoices (Sales Register)

**Endpoint:** `GET /billing/irn/list`

**Description:** Retrieves all finalized invoices with IRN.

**Query Parameters:**
- `search` (optional): Search by invoice number, IRN, or customer name
- `dateFrom` (optional): Filter by date range (from)
- `dateTo` (optional): Filter by date range (to)
- `status` (optional): `FINAL` | `SENT` | `ALL`
- `page` (optional): Page number (default: 1)
- `limit` (optional): Records per page (default: 20)

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "total": 289,
      "totalRevenue": 12500000.00,
      "sent": 267,
      "pending": 22
    },
    "invoices": [
      {
        "invoiceId": "INV-2026-03-0001",
        "invoiceNumber": "INV/MH/2026/0001",
        "irnNumber": "ad69b476cf94a05152bd7fdfd93d98ff1bf53bb816c9b5ff0c8088e3f649f5d5",
        "acknowledgementNumber": "112026033015181",
        "invoiceDate": "2026-03-15",
        "customerId": "CUST001",
        "customerName": "ABC Mall",
        "branch": "Mumbai",
        "narration": "Invoice for period 16 Feb to 15 Mar 2026",
        "grandTotal": 501500.00,
        "status": "SENT",
        "createdBy": "USER123",
        "createdByName": "Amit Patel",
        "createdAt": "2026-03-15T10:45:00Z",
        "sentStatus": true,
        "sentAt": "2026-03-15T11:30:00Z",
        "viewCount": 3,
        "actions": ["VIEW", "DOWNLOAD", "EMAIL", "RESEND"]
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 15,
      "totalRecords": 289
    }
  }
}
```

---

### 2. Get IRN Invoice Detail

**Endpoint:** `GET /billing/irn/{invoiceId}`

**Description:** Retrieves complete invoice with IRN, QR code, and accounting details.

**Path Parameters:**
- `invoiceId` (required): Invoice ID

**Response:** (Same as Auto Billing Preview with additional IRN details)

---

### 3. Download IRN Invoice PDF

**Endpoint:** `GET /billing/irn/{invoiceId}/download-pdf`

**Description:** Generates official PDF with QR code and IRN.

**Path Parameters:**
- `invoiceId` (required): Invoice ID

**Response:** PDF file download

---

### 4. Send/Resend Invoice Email

**Endpoint:** `POST /billing/irn/{invoiceId}/send-email`

**Description:** Sends or resends invoice to customer via email.

**Path Parameters:**
- `invoiceId` (required): Invoice ID

**Request Body:**
```json
{
  "to": "accounts@abcmall.com",
  "cc": ["manager@abcmall.com"],
  "subject": "Invoice INV/MH/2026/0001 - ABC Mall",
  "message": "Dear Sir/Madam,\n\nPlease find attached tax invoice for the period 16th Feb to 15th Mar 2026.\n\nThank you.",
  "attachPDF": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "invoiceId": "INV-2026-03-0001",
    "emailSent": true,
    "sentTo": ["accounts@abcmall.com"],
    "sentAt": "2026-03-20T10:00:00Z",
    "message": "Invoice email sent successfully"
  }
}
```

**Backend Process:**
1. Load professional email template
2. Auto-fill invoice details
3. Attach PDF with QR code
4. Send via EmailJS integration
5. Update status to "SENT"
6. Increment view count (if tracking enabled)
7. Log email audit trail

---

## Master Data APIs

### 1. Get States

**Endpoint:** `GET /billing/masters/states`

**Description:** Retrieves list of states from Commercial Module.

**Response:**
```json
{
  "success": true,
  "data": {
    "states": [
      {
        "code": "MH",
        "name": "Maharashtra",
        "gstStateCode": "27"
      },
      {
        "code": "DL",
        "name": "Delhi",
        "gstStateCode": "07"
      }
    ]
  }
}
```

---

### 2. Get Cities

**Endpoint:** `GET /billing/masters/cities`

**Query Parameters:**
- `state` (required): State code

**Response:**
```json
{
  "success": true,
  "data": {
    "cities": [
      {
        "id": "CITY001",
        "name": "Mumbai",
        "state": "MH"
      },
      {
        "id": "CITY002",
        "name": "Pune",
        "state": "MH"
      }
    ]
  }
}
```

---

### 3. Get Branches

**Endpoint:** `GET /billing/masters/branches`

**Query Parameters:**
- `state` (optional): Filter by state
- `city` (optional): Filter by city

**Response:**
```json
{
  "success": true,
  "data": {
    "branches": [
      {
        "id": "BR001",
        "name": "Mumbai HQ",
        "code": "MH01",
        "city": "Mumbai",
        "state": "MH",
        "address": "Mumbai, Maharashtra - 400001",
        "gstin": "27AABCI9999R1Z5"
      }
    ]
  }
}
```

---

### 4. Get Customers

**Endpoint:** `GET /billing/masters/customers`

**Query Parameters:**
- `branch` (optional): Filter by branch
- `city` (optional): Filter by city
- `search` (optional): Search by customer name

**Response:**
```json
{
  "success": true,
  "data": {
    "customers": [
      {
        "id": "CUST001",
        "name": "ABC Mall",
        "code": "CUST001",
        "branch": "BR001",
        "city": "Mumbai",
        "state": "MH",
        "gstin": "27AABCU9603R1ZX",
        "address": "Andheri West, Mumbai - 400058",
        "contactPerson": "Mr. Sharma",
        "email": "accounts@abcmall.com",
        "phone": "+91-9876543210",
        "clientLedgerCode": "L2001001",
        "creditDays": 30
      }
    ]
  }
}
```

---

## Notification & Dashboard APIs

### 1. Get Billing Dashboard Stats

**Endpoint:** `GET /billing/dashboard/stats`

**Description:** Retrieves key metrics for billing dashboard.

**Response:**
```json
{
  "success": true,
  "data": {
    "monthlyRevenue": 12500000.00,
    "pendingInvoices": 25,
    "profitMargin": 18.5,
    "activeClients": 42,
    "currentMonth": {
      "invoicesGenerated": 45,
      "proformaCount": 12,
      "irnCount": 33,
      "totalRevenue": 5500000.00
    },
    "pendingActions": {
      "arrearBilling": 8,
      "bonusLeave": 12,
      "proformaApproval": 18
    }
  }
}
```

---

### 2. Get Recent Activities

**Endpoint:** `GET /billing/dashboard/activities`

**Query Parameters:**
- `limit` (optional): Number of activities (default: 10)

**Response:**
```json
{
  "success": true,
  "data": {
    "activities": [
      {
        "id": "ACT001",
        "type": "INVOICE_GENERATED",
        "message": "Invoice INV/MH/2026/0001 generated for ABC Mall",
        "invoiceId": "INV-2026-03-0001",
        "timestamp": "2026-03-15T10:45:00Z",
        "userId": "USER123",
        "userName": "Amit Patel"
      },
      {
        "id": "ACT002",
        "type": "RATE_CARD_UPDATED",
        "message": "Rate card updated for XYZ Hospital - Arrear notification sent",
        "timestamp": "2026-03-14T15:30:00Z",
        "userId": "COMMERCIAL_USER_01",
        "userName": "Rahul Sharma"
      }
    ]
  }
}
```

---

### 3. Get Notifications

**Endpoint:** `GET /billing/notifications`

**Query Parameters:**
- `type` (optional): `ARREAR` | `BONUS_LEAVE` | `RATE_CHANGE` | `ALL`
- `unreadOnly` (optional): true | false

**Response:**
```json
{
  "success": true,
  "data": {
    "unreadCount": 5,
    "notifications": [
      {
        "id": "NOTIF001",
        "type": "ARREAR",
        "title": "New Arrear Billing Required",
        "message": "Rate change detected for ABC Mall. Arrear billing required for period Jan-Feb 2026.",
        "priority": "HIGH",
        "data": {
          "customerId": "CUST001",
          "arrearRequestId": "ARR-REQ-001"
        },
        "isRead": false,
        "createdAt": "2026-03-15T08:00:00Z"
      },
      {
        "id": "NOTIF002",
        "type": "BONUS_LEAVE",
        "title": "Bonus/Leave Data Available",
        "message": "Bonus and Leave Encashment data ready for DEF Complex for March 2026.",
        "priority": "MEDIUM",
        "data": {
          "customerId": "CUST003",
          "period": "2026-03"
        },
        "isRead": false,
        "createdAt": "2026-03-14T16:00:00Z"
      }
    ]
  }
}
```

---

### 4. Mark Notification as Read

**Endpoint:** `PUT /billing/notifications/{notificationId}/mark-read`

**Path Parameters:**
- `notificationId` (required): Notification ID

**Response:**
```json
{
  "success": true,
  "data": {
    "notificationId": "NOTIF001",
    "isRead": true,
    "readAt": "2026-03-15T10:30:00Z"
  }
}
```

---

## E-Invoice Integration APIs

### 1. Get E-Invoice Credentials

**Endpoint:** `GET /billing/e-invoice/credentials`

**Description:** Retrieves GST portal credentials for specific state (for backend use).

**Query Parameters:**
- `state` (required): State code

**Response:**
```json
{
  "success": true,
  "data": {
    "state": "MH",
    "gstin": "27AABCI9999R1Z5",
    "username": "einvoice_mh_user",
    "apiUrl": "https://gst.gov.in/einvoice/api/v1",
    "authToken": "encrypted_token",
    "expiresAt": "2026-03-20T10:00:00Z"
  }
}
```

---

### 2. Generate IRN

**Endpoint:** `POST /billing/e-invoice/generate-irn`

**Description:** Calls GST E-Invoice Portal API to generate IRN.

**Request Body:**
```json
{
  "invoiceId": "INV-2026-03-0001",
  "invoiceNumber": "INV/MH/2026/0001",
  "invoiceDate": "2026-03-15",
  "invoiceType": "INV",
  "state": "MH",
  "seller": {
    "gstin": "27AABCI9999R1Z5",
    "legalName": "iSmart Facility Services Pvt Ltd",
    "address": "Mumbai, Maharashtra - 400001",
    "location": "Mumbai",
    "pincode": "400001",
    "stateCode": "27"
  },
  "buyer": {
    "gstin": "27AABCU9603R1ZX",
    "legalName": "ABC Mall",
    "address": "Andheri West, Mumbai - 400058",
    "location": "Mumbai",
    "pincode": "400058",
    "stateCode": "27"
  },
  "lineItems": [...],
  "totals": {
    "assessableValue": 425000.00,
    "cgstValue": 38250.00,
    "sgstValue": 38250.00,
    "igstValue": 0.00,
    "totalInvoiceValue": 501500.00
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "irnNumber": "ad69b476cf94a05152bd7fdfd93d98ff1bf53bb816c9b5ff0c8088e3f649f5d5",
    "acknowledgementNumber": "112026033015181",
    "acknowledgementDate": "2026-03-15T10:45:00Z",
    "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    "signedInvoice": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
    "signedQRCode": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
    "status": "SUCCESS",
    "message": "IRN generated successfully"
  }
}
```

**Backend Process:**
1. Login to GST E-Invoice Portal with state credentials
2. Prepare invoice JSON as per GST schema
3. Send POST request to /generateIRN endpoint
4. Parse response and extract IRN, QR Code, Acknowledgement Number
5. Return formatted response

**Error Handling:**
- If API fails, return error code: `E_INVOICE_API_ERROR`
- Log all requests and responses for audit

---

### 3. Cancel IRN

**Endpoint:** `POST /billing/e-invoice/cancel-irn`

**Description:** Cancels an already generated IRN (within 24 hours).

**Request Body:**
```json
{
  "irnNumber": "ad69b476cf94a05152bd7fdfd93d98ff1bf53bb816c9b5ff0c8088e3f649f5d5",
  "reason": "Duplicate invoice",
  "remarks": "Invoice generated by mistake"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "irnNumber": "ad69b476cf94a05152bd7fdfd93d98ff1bf53bb816c9b5ff0c8088e3f649f5d5",
    "status": "CANCELLED",
    "cancelledAt": "2026-03-15T12:00:00Z",
    "message": "IRN cancelled successfully"
  }
}
```

---

## Accounting & GL Posting APIs

### 1. Post Journal Entry

**Endpoint:** `POST /billing/accounting/post-journal`

**Description:** Posts journal entries to General Ledger for invoice.

**Request Body:**
```json
{
  "invoiceId": "INV-2026-03-0001",
  "invoiceNumber": "INV/MH/2026/0001",
  "voucherType": "JOURNAL",
  "voucherDate": "2026-03-15",
  "narration": "Invoice for period 16 Feb to 15 Mar 2026",
  "entries": [
    {
      "lineNo": 1,
      "glCode": "L2001001",
      "glName": "ABC Mall - Sundry Debtors",
      "debit": 501500.00,
      "credit": 0.00,
      "costCenter": "Mumbai",
      "narration": "Invoice INV/MH/2026/0001"
    },
    {
      "lineNo": 2,
      "glCode": "R1001001",
      "glName": "Housekeeping Charges",
      "debit": 0.00,
      "credit": 425000.00,
      "costCenter": "Mumbai",
      "narration": "Revenue recognition"
    },
    {
      "lineNo": 3,
      "glCode": "L2003001",
      "glName": "Output CGST",
      "debit": 0.00,
      "credit": 38250.00,
      "costCenter": "Mumbai",
      "narration": "CGST @ 9%"
    },
    {
      "lineNo": 4,
      "glCode": "L2003002",
      "glName": "Output SGST",
      "debit": 0.00,
      "credit": 38250.00,
      "costCenter": "Mumbai",
      "narration": "SGST @ 9%"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "voucherNo": "JV/MH/2026/0156",
    "voucherDate": "2026-03-15",
    "posted": true,
    "totalDebit": 501500.00,
    "totalCredit": 501500.00,
    "balanced": true,
    "postedAt": "2026-03-15T10:45:00Z",
    "message": "Journal entry posted successfully"
  }
}
```

**Validation Rules:**
- Total Debit must equal Total Credit
- All GL codes must exist in Chart of Accounts
- Narration is mandatory
- Voucher date cannot be in future

---

### 2. Get GL Balance

**Endpoint:** `GET /billing/accounting/gl-balance/{glCode}`

**Description:** Retrieves current balance of a GL account.

**Path Parameters:**
- `glCode` (required): GL Code

**Query Parameters:**
- `asOfDate` (optional): Date for balance (default: today)

**Response:**
```json
{
  "success": true,
  "data": {
    "glCode": "L2001001",
    "glName": "ABC Mall - Sundry Debtors",
    "accountType": "ASSET",
    "parentGL": "A3003001",
    "openingBalance": 450000.00,
    "debitTotal": 501500.00,
    "creditTotal": 0.00,
    "currentBalance": 951500.00,
    "balanceType": "DEBIT",
    "asOfDate": "2026-03-15"
  }
}
```

---

### 3. Get Client Ledger

**Endpoint:** `GET /billing/accounting/client-ledger/{clientId}`

**Description:** Retrieves complete ledger statement for a client.

**Path Parameters:**
- `clientId` (required): Customer ID

**Query Parameters:**
- `dateFrom` (optional): From date
- `dateTo` (optional): To date

**Response:**
```json
{
  "success": true,
  "data": {
    "clientId": "CUST001",
    "clientName": "ABC Mall",
    "glCode": "L2001001",
    "openingBalance": 450000.00,
    "transactions": [
      {
        "date": "2026-03-15",
        "voucherNo": "JV/MH/2026/0156",
        "invoiceNumber": "INV/MH/2026/0001",
        "narration": "Invoice for period 16 Feb to 15 Mar",
        "debit": 501500.00,
        "credit": 0.00,
        "balance": 951500.00
      }
    ],
    "closingBalance": 951500.00,
    "totalDebit": 501500.00,
    "totalCredit": 0.00
  }
}
```

---

## Integration Requirements

### Integration with Commercial Module

**Required Data:**
1. **Rate Cards:**
   - Personnel rates (Daily/Monthly CTC)
   - Machinery rates (Fixed/At Actual)
   - Material rates (Fixed/At Actual)
   - GST rates and HSN/SAC codes
   - Effective dates for rate changes

2. **Master Data:**
   - States, Cities, Branches
   - Customer/Client master
   - Site/Location master
   - Product master
   - Salary structure (LWW option)

3. **Notifications:**
   - Rate change notifications with past effective dates (for arrear billing)

---

### Integration with Payroll Module

**Required Data:**
1. **Attendance Data:**
   - Employee-wise duty days
   - Designation-wise headcount
   - Client OT hours
   - Internal OT hours

2. **Billing Cycle:**
   - Permanent billing cycle for each client
   - First-time cycle selection storage

3. **Statutory Components:**
   - Festival bonus data (employee-wise)
   - Leave encashment data (employee-wise)
   - Leave days and encashment amounts

---

### Integration with Procurement Module

**Required Data:**
1. **GRN Data:**
   - Material consumption for "At Actual" billing
   - Quantity and rates from GRN
   - Site-wise material usage

---

### Integration with Accounting Module

**Required Data:**
1. **GL Codes:**
   - Client ledger codes (Sundry Debtors)
   - Revenue ledger codes
   - Tax ledger codes (CGST/SGST/IGST)

2. **Voucher Numbers:**
   - Auto-generation of journal voucher numbers
   - Sequence management

---

## Data Flow Diagrams

### Auto Billing Data Flow

```
1. Billing Manager selects client → Fetch from Commercial Module
2. Select billing cycle → Check/Store in Payroll Module
3. Calculate billing lines:
   - Attendance data ← Payroll Module
   - Personnel rates ← Commercial Module
   - Machinery rates ← Commercial Module
   - Material data ← Procurement Module (if At Actual)
   - OT data ← Payroll Module
4. Generate invoice → Store in Billing Module
5. Convert to IRN → E-Invoice API
6. Post GL entries → Accounting Module
```

---

## API Security Requirements

1. **Authentication:**
   - JWT token-based authentication
   - Token expiry: 8 hours
   - Refresh token mechanism

2. **Authorization:**
   - Role-based access control (RBAC)
   - Billing Manager: Full billing operations
   - Commercial Team: Rate card management only
   - Financial Head: View-only access

3. **Data Encryption:**
   - TLS 1.3 for all API calls
   - Sensitive data encryption at rest

4. **Audit Trail:**
   - Log all API calls with user ID, timestamp
   - Log all data modifications
   - Maintain 7-year audit history

---

## Performance Requirements

1. **Response Time:**
   - GET APIs: < 500ms
   - POST APIs: < 2 seconds
   - IRN Generation: < 5 seconds

2. **Concurrent Users:**
   - Support 50+ concurrent users
   - No performance degradation

3. **Data Volume:**
   - Handle 10,000+ invoices per month
   - Support 500+ clients

---

## Testing Requirements

1. **Unit Testing:**
   - All calculation functions
   - GL posting logic
   - Rate mapping logic

2. **Integration Testing:**
   - Commercial Module integration
   - Payroll Module integration
   - E-Invoice API integration

3. **End-to-End Testing:**
   - Complete billing workflows
   - Multi-site billing
   - Arrear billing scenarios

---

## Error Scenarios & Handling

### Scenario 1: Missing Attendance Data
- **Error Code:** `ATTENDANCE_DATA_MISSING`
- **Response:** Return detailed error with missing dates/sites
- **Action:** Billing Manager contacts Payroll team

### Scenario 2: Rate Card Not Found
- **Error Code:** `RATE_CARD_NOT_FOUND`
- **Response:** List missing rate cards by site/designation
- **Action:** Billing Manager contacts Commercial team

### Scenario 3: E-Invoice API Failure
- **Error Code:** `E_INVOICE_API_ERROR`
- **Response:** Save invoice as proforma, retry later
- **Action:** System administrator checks API connectivity

### Scenario 4: GL Posting Failure
- **Error Code:** `GL_POSTING_ERROR`
- **Response:** Rollback invoice, keep as proforma
- **Action:** Accounting team verifies GL codes

---

## Appendix

### Sample Invoice JSON Schema

```json
{
  "invoice": {
    "id": "string",
    "number": "string",
    "date": "date",
    "dueDate": "date",
    "type": "REGULAR|ARREAR|BONUS|MANUAL",
    "series": "PROFORMA|SALES",
    "status": "DRAFT|SENT|RECEIVED|IRN_GENERATED",
    "seller": { ... },
    "buyer": { ... },
    "lineItems": [ ... ],
    "totals": { ... },
    "irn": {
      "irnNumber": "string",
      "acknowledgementNumber": "string",
      "qrCode": "string"
    },
    "accounting": {
      "voucherNo": "string",
      "entries": [ ... ]
    }
  }
}
```

---

## Change Log

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-03-04 | Backend Team | Initial API documentation |

---

## Contact & Support

**Backend Team Lead:** [Name]  
**Email:** backend@ismart.com  
**Slack Channel:** #billing-module-dev

---

**End of Document**

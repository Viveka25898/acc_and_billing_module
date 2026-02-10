# API SPECIFICATION DOCUMENT

## Process For Rent Expense Booking Module

---

### Document Information

- **Module Name:** Process For Rent Expense Booking
- **Version:** 1.0
- **Last Updated:** February 2026
- **Prepared By:** Technical Team
- **Status:** Active

---

## Table of Contents

1. [Module Overview](#module-overview)
2. [Business Process Flow](#business-process-flow)
3. [GL Code Structure](#gl-code-structure)
4. [API Specifications](#api-specifications)
   - [Part 1: Site Management](#part-1-site-management)
   - [Part 2: Rent Agreement Management](#part-2-rent-agreement-management)
   - [Part 3: Voucher Generation](#part-3-voucher-generation)
   - [Part 4: Vendor Management](#part-4-vendor-management)
5. [Accounting Integration](#accounting-integration)
6. [Error Codes](#error-codes)
7. [Business Rules](#business-rules)

---

## Module Overview

### Purpose

The Process For Rent Expense Booking module automates and streamlines the monthly rent booking process by enabling Billing Managers to add sites, upload rent agreements, ensure GST compliance, and generate recurring expense vouchers with minimal manual effort—ensuring accuracy, visibility, and timely accounting of rental obligations.

### Key Features

- **Site Management:** Add and manage rental sites with complete details (location, owner, GST configuration)
- **Automatic Vendor Ledger Creation:** Auto-creates vendor ledger in Chart of Accounts when site with owner is added
- **Rent Agreement Upload:** Upload agreements with start/end dates, GST selection, and automatic monthly breakdown
- **Automatic Monthly Voucher Generation (Backend Process):** System automatically generates monthly vouchers for all active agreements via backend scheduler - **No manual intervention required**
- **Automatic GL Posting:** GL entries (Rent Expense + GST Input + Vendor Payable) are automatically posted to Chart of Accounts during voucher generation
- **Automatic Ledger Updates:** Ledger balances automatically updated in real-time
- **GST Compliance:** Supports both GST (CGST+SGST/IGST) and Non-GST rent bookings with automatic determination
- **Payment Integration:** Approved vouchers automatically appear in Process of Payments for vendor payment processing

### User Roles

1. **Billing Manager:** Manages sites, uploads agreements, generates vouchers
2. **Finance Team:** Reviews vouchers, processes vendor payments
3. **Account Executive:** Approves GL postings (if approval workflow enabled)

---

## Business Process Flow

### Workflow Steps

```
Step 1: Billing Manager - Add New Site
         - Enter site details (name, location, city, state, PIN)
         - Auto-generate site code
         - Add owner/vendor details (name, PAN, GSTIN, contact)
         - System automatically creates Vendor Ledger (L2005_{code})
↓
Step 2: Billing Manager - Upload Rent Agreement
         - Select site
         - Upload agreement document (PDF/Image)
         - Enter agreement period (start date, end date)
         - Enter monthly rent amount
         - Select GST applicable (Yes/No)
         - System calculates:
           • Total vouchers = Months between start and end date
           • If GST Yes: Base Rent + 18% GST (CGST 9% + SGST 9%)
           • Monthly breakdown shown
↓
Step 3: System - Automatic Monthly Voucher Generation (Backend Process)
         - Backend scheduler runs automatically (daily/monthly)
         - System identifies all active agreements for current month
         - Automatically generates vouchers for eligible sites
         - System posts GL entries AUTOMATICALLY:
           • Dr X2001002002 (Branch Office Rent)
           • Dr A3007001001/002/003 (GST Input - if applicable)
           • Cr L2005_{vendor-code} (Vendor Payable)
         - GL entries AUTOMATICALLY updated in Chart of Accounts
         - Ledger balances AUTOMATICALLY updated
         - Voucher status: Approved (Auto)
         - Payment status: Pending Payment
         - NO MANUAL INTERVENTION REQUIRED
↓
Step 4: Process of Payments - Vendor Payment (Manual)
         - Approved vouchers automatically appear in vendor payments list
         - Finance team selects vendor
         - Download bank file (NEFT format)
         - Upload UTR after payment
         - Final GL posting:
           Dr L2005_{vendor-code} (Vendor Payable)
           Cr A3004003_{Bank} (Bank Account)
         - Payment status: Paid
```

### Automatic Features

1. **Site Code Auto-Generation:** Format: `{City-3}{SiteName-3}-{Random2}` (e.g., MUM-OFF-45)
2. **Vendor Ledger Auto-Creation:** When site with owner added, system creates:
   - GL Code: `L2005_{sequential}` (e.g., L2005_001, L2005_002)
   - GL Name: `VENDOR - {OwnerName}`
   - Parent: L2005 (SUNDRY CREDITORS)
3. **Automatic Monthly Voucher Generation and GL Posting (Backend Process):**
   - **Backend scheduler runs automatically** (daily/monthly)
   - System identifies all active agreements for current month
   - **Vouchers are automatically generated** for eligible sites
   - **GL entries are automatically posted** to Chart of Accounts:
     - Dr X2001002002 (Rent Expense)
     - Dr A3007001001/002/003 (GST Input - if applicable)
     - Cr L2005\_{code} (Vendor Payable)
   - **Ledger balances automatically updated**
   - **Vendor payables automatically created**
   - **No manual intervention required**
4. **Monthly Voucher Calculation:**
   - Total Months = (End Year - Start Year) × 12 + (End Month - Start Month) + 1
   - Monthly Base Rent = Total Rent ÷ Total Months
   - Monthly GST = Monthly Base Rent × 18% (if applicable)
   - Monthly Total = Monthly Base Rent + Monthly GST

---

## GL Code Structure

### Chart of Accounts - Rent Expense Booking

#### Expense Accounts

| GL Code     | Description        | Type    | Parent Code                      | Dr/Cr |
| ----------- | ------------------ | ------- | -------------------------------- | ----- |
| X2001002002 | BRANCH OFFICE RENT | Expense | X2001002 (Other Branch Expenses) | Debit |

#### Asset Accounts (GST Input)

| GL Code     | Description | Type  | Parent Code          | Dr/Cr |
| ----------- | ----------- | ----- | -------------------- | ----- |
| A3007001001 | CGST INPUT  | Asset | A3007001 (GST Input) | Debit |
| A3007001002 | SGST INPUT  | Asset | A3007001 (GST Input) | Debit |
| A3007001003 | IGST INPUT  | Asset | A3007001 (GST Input) | Debit |

#### Liability Accounts (Vendor Payable)

| GL Code Pattern | Description           | Type      | Parent Code              | Dr/Cr  |
| --------------- | --------------------- | --------- | ------------------------ | ------ |
| L2005\_{seq}    | VENDOR - {Owner Name} | Liability | L2005 (Sundry Creditors) | Credit |

**Examples:**

- L2005_001 → VENDOR - ABC Properties
- L2005_002 → VENDOR - XYZ Developers
- L2005_003 → VENDOR - John Doe

#### Bank Accounts (Variable)

| GL Code Pattern  | Description   | Type  | Parent Code              | Dr/Cr  |
| ---------------- | ------------- | ----- | ------------------------ | ------ |
| A3004003\_{Bank} | Bank Accounts | Asset | A3004003 (Bank Accounts) | Credit |

### Voucher Numbering Format

- **Rent Expense Voucher:** `REN/{SiteCode}/{Year}/{SequenceNo}`
  - Example: `REN/MUM/2026/0001`
- **Payment Voucher:** `PAY/VENDOR/{SiteCode}/{Year}/{SequenceNo}`
  - Example: `PAY/VENDOR/MUM/2026/0001`

---

## API Specifications

---

## PART 1: Site Management

---

### API 1.1: Add New Site

**Endpoint:** `POST /api/rent-expense/sites`

**Description:** Billing Manager creates a new rental site with complete details including owner information. System automatically creates vendor ledger in Chart of Accounts.

#### Request Headers

```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {token}",
  "User-Role": "BILLING_MANAGER"
}
```

#### Request Body

```json
{
  "siteName": "Mumbai Branch Office",
  "location": "Andheri East, Near Railway Station, Mumbai",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pinCode": "400069",
  "status": "active",
  "addOwnerNow": true,
  "ownerType": "individual",
  "ownerDetails": {
    "ownerName": "Rajesh Kumar Properties",
    "panNumber": "ABCDE1234F",
    "gstin": "27ABCDE1234F1Z5",
    "contactNumber": "9876543210",
    "email": "rajesh@properties.com",
    "address": "123, MG Road, Mumbai, Maharashtra - 400001"
  },
  "rentConfig": {
    "expectedMinRent": 25000,
    "expectedMaxRent": 35000,
    "gstExpected": "yes",
    "tdsApplicable": true
  }
}
```

#### Field Validations

| Field                      | Type    | Required    | Validation Rules                                           |
| -------------------------- | ------- | ----------- | ---------------------------------------------------------- |
| siteName                   | String  | Yes         | Min 2, max 100 characters                                  |
| location                   | String  | Yes         | Min 10, max 500 characters                                 |
| city                       | String  | Yes         | Valid city name                                            |
| state                      | String  | Yes         | Must be from Indian states list                            |
| pinCode                    | String  | Yes         | Exactly 6 digits                                           |
| status                     | Enum    | No          | active/inactive (default: active)                          |
| addOwnerNow                | Boolean | No          | Default: false                                             |
| ownerType                  | Enum    | Conditional | individual/company/multiple (required if addOwnerNow=true) |
| ownerDetails.ownerName     | String  | Conditional | Required if addOwnerNow=true, max 200 chars                |
| ownerDetails.panNumber     | String  | Conditional | Required if addOwnerNow=true, format: ABCDE1234F           |
| ownerDetails.gstin         | String  | No          | Format: 27ABCDE1234F1Z5 (15 chars)                         |
| ownerDetails.contactNumber | String  | No          | 10 digits                                                  |
| ownerDetails.email         | Email   | No          | Valid email format                                         |
| rentConfig.expectedMinRent | Decimal | No          | > 0                                                        |
| rentConfig.expectedMaxRent | Decimal | No          | >= expectedMinRent                                         |
| rentConfig.gstExpected     | Enum    | No          | yes/no/not_sure                                            |

#### Response (Success - 201 Created)

```json
{
  "success": true,
  "message": "Site added successfully and vendor ledger created",
  "data": {
    "siteId": "SITE-1736934123456",
    "siteName": "Mumbai Branch Office",
    "siteCode": "MUM-MUM-45",
    "location": "Andheri East, Near Railway Station, Mumbai",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pinCode": "400069",
    "status": "active",
    "owners": [
      {
        "ownerId": "OWN-1736934123456",
        "ownerName": "Rajesh Kumar Properties",
        "ownerType": "individual",
        "panNumber": "ABCDE1234F",
        "gstin": "27ABCDE1234F1Z5",
        "contactNumber": "9876543210",
        "email": "rajesh@properties.com",
        "address": "123, MG Road, Mumbai, Maharashtra - 400001",
        "isPrimary": true,
        "glCode": "L2005_001",
        "glName": "VENDOR - Rajesh Kumar Properties",
        "createdAt": "2026-02-05T10:30:00Z"
      }
    ],
    "rentConfig": {
      "expectedMinRent": 25000,
      "expectedMaxRent": 35000,
      "gstExpected": "yes",
      "tdsApplicable": true
    },
    "accounting": {
      "vendorLedgerCreated": true,
      "vendorGLCode": "L2005_001",
      "parentGLCode": "L2005",
      "parentGLName": "SUNDRY CREDITORS"
    },
    "createdAt": "2026-02-05T10:30:00Z",
    "createdBy": "billing_manager_001"
  }
}
```

#### Response (Error - 400 Bad Request)

```json
{
  "success": false,
  "error": "VALIDATION_ERROR",
  "message": "Invalid input data",
  "details": {
    "panNumber": "Invalid PAN format. Expected format: ABCDE1234F",
    "pinCode": "PIN code must be exactly 6 digits",
    "ownerName": "Owner name is required when addOwnerNow is true"
  }
}
```

#### Business Logic - Site Creation with Vendor Ledger

1. **Validate Site Details:**
   - Site name must be unique within same city
   - PIN code must match state
   - All required fields present

2. **Generate Site Code:**

   ```javascript
   const cityPrefix = city.substring(0, 3).toUpperCase()
   const namePrefix = siteName.substring(0, 3).toUpperCase()
   const randomSuffix = Math.floor(Math.random() * 100)
   const siteCode = `${cityPrefix}-${namePrefix}-${randomSuffix}`
   ```

   Example: Mumbai + Mumbai Branch Office → `MUM-MUM-45`

3. **Generate Unique Site ID:**
   - Format: `SITE-{timestamp}`
   - Example: `SITE-1736934123456`

4. **If addOwnerNow = true:**

   **Step 4a: Validate Owner Details**
   - PAN number: 10 characters, format ABCDE1234F
   - GSTIN (if provided): 15 characters, format 27ABCDE1234F1Z5
   - Contact: 10 digits
   - Email: Valid email format

   **Step 4b: Generate Owner ID**
   - Format: `OWN-{timestamp}`

   **Step 4c: Create Vendor Ledger in Chart of Accounts**

   ```javascript
   // Check if vendor ledger already exists for this owner
   const existing = checkVendorLedgerExists(ownerName)

   if (!existing) {
     // Generate next vendor GL code
     const vendorGLCode = generateVendorGLCode() // Returns L2005_001, L2005_002, etc.

     // Create ledger entry
     const vendorLedger = {
       id: `VENDOR_{timestamp}_{ownerId}`,
       code: vendorGLCode,
       name: `VENDOR - ${ownerName}`,
       type: 'ACCOUNT',
       parentAccount: 'SUNDRY CREDITORS',
       parentCode: 'L2005',
       accountCategory: 'LIABILITIES',
       debitCreditNature: 'CREDIT',
       openingBalance: 0,
       currentBalance: 0,
       isActive: true,
       vendorDetails: {
         ownerId: ownerId,
         ownerName: ownerName,
         panNumber: panNumber,
         gstin: gstin,
       },
     }

     // Add to Chart of Accounts
     chartOfAccounts.push(vendorLedger)
     saveToDatabase(chartOfAccounts)
   }
   ```

   **Step 4d: Link Vendor GL to Site Owner**

   ```javascript
   siteData.owners = [
     {
       ownerId: ownerId,
       ownerName: ownerName,
       ownerType: ownerType,
       panNumber: panNumber,
       gstin: gstin,
       contactNumber: contactNumber,
       email: email,
       address: address,
       isPrimary: true,
       glCode: vendorGLCode,
       glName: `VENDOR - ${ownerName}`,
       createdAt: new Date().toISOString(),
     },
   ]
   ```

5. **Save Site Data:**
   - Store site in `sites` database table
   - Include owner array with GL code linkage
   - Set status and metadata

6. **Return Success Response:**
   - Include site details
   - Include owner with GL code
   - Confirm vendor ledger creation

**Important Notes:**

- Vendor ledger is created immediately upon site creation with owner
- GL Code follows sequential pattern: L2005_001, L2005_002, L2005_003...
- If site added without owner, ledger can be created later when agreement is uploaded
- Duplicate owner names across sites will still create separate vendor ledgers (each site-owner combination is unique)

---

### API 1.2: Get All Sites

**Endpoint:** `GET /api/rent-expense/sites`

**Description:** Retrieve all rental sites with filters for state, city, and owner.

#### Request Headers

```json
{
  "Authorization": "Bearer {token}",
  "User-Role": "BILLING_MANAGER"
}
```

#### Query Parameters

```
?state=Maharashtra
&city=Mumbai
&owner=Rajesh
&status=active
&page=1
&limit=10
```

| Parameter | Type    | Required | Description                          |
| --------- | ------- | -------- | ------------------------------------ |
| state     | String  | No       | Filter by state                      |
| city      | String  | No       | Filter by city                       |
| owner     | String  | No       | Filter by owner name (partial match) |
| status    | String  | No       | active/inactive                      |
| page      | Integer | No       | Page number (default: 1)             |
| limit     | Integer | No       | Items per page (default: 10)         |

#### Response (Success - 200 OK)

```json
{
  "success": true,
  "data": {
    "sites": [
      {
        "siteId": "SITE-1736934123456",
        "siteName": "Mumbai Branch Office",
        "siteCode": "MUM-MUM-45",
        "location": "Andheri East, Near Railway Station",
        "city": "Mumbai",
        "state": "Maharashtra",
        "pinCode": "400069",
        "status": "active",
        "owners": [
          {
            "ownerId": "OWN-1736934123456",
            "ownerName": "Rajesh Kumar Properties",
            "glCode": "L2005_001",
            "panNumber": "ABCDE1234F",
            "gstin": "27ABCDE1234F1Z5"
          }
        ],
        "agreementStatus": "Active",
        "hasActiveAgreement": true,
        "currentAgreementId": "AGR-1736945678901",
        "monthlyRent": 30000,
        "rentConfig": {
          "gstExpected": "yes"
        },
        "createdAt": "2026-02-05T10:30:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalRecords": 25,
      "limit": 10
    },
    "summary": {
      "totalSites": 25,
      "activeSites": 20,
      "inactiveSites": 5,
      "sitesWithAgreements": 18,
      "totalMonthlyRent": 540000
    }
  }
}
```

#### Business Logic

1. Retrieve all sites from `sites` database table
2. Apply filters:
   - State filter: Exact match
   - City filter: Exact match
   - Owner filter: Partial match (case-insensitive) on owner name
   - Status filter: active/inactive
3. Join with `agreements` table to check for active agreements
4. Calculate summary statistics
5. Paginate results
6. Return sites with owner GL codes

---

### API 1.3: Get Site Details

**Endpoint:** `GET /api/rent-expense/sites/{siteId}`

**Description:** Retrieve complete details of a specific site including owners, agreements, and vouchers.

#### Request Headers

```json
{
  "Authorization": "Bearer {token}",
  "User-Role": "BILLING_MANAGER"
}
```

#### Path Parameters

- `siteId`: Site ID (e.g., SITE-1736934123456)

#### Response (Success - 200 OK)

```json
{
  "success": true,
  "data": {
    "siteId": "SITE-1736934123456",
    "siteName": "Mumbai Branch Office",
    "siteCode": "MUM-MUM-45",
    "location": "Andheri East, Near Railway Station, Mumbai",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pinCode": "400069",
    "status": "active",
    "owners": [
      {
        "ownerId": "OWN-1736934123456",
        "ownerName": "Rajesh Kumar Properties",
        "ownerType": "individual",
        "panNumber": "ABCDE1234F",
        "gstin": "27ABCDE1234F1Z5",
        "contactNumber": "9876543210",
        "email": "rajesh@properties.com",
        "glCode": "L2005_001",
        "glName": "VENDOR - Rajesh Kumar Properties",
        "isPrimary": true
      }
    ],
    "agreements": [
      {
        "agreementId": "AGR-1736945678901",
        "startDate": "2026-01-01",
        "endDate": "2026-12-31",
        "monthlyBaseRent": 30000,
        "monthlyGST": 5400,
        "monthlyTotal": 35400,
        "withGST": true,
        "totalVouchers": 12,
        "status": "active",
        "fileName": "rent_agreement_mumbai.pdf"
      }
    ],
    "vouchers": {
      "generated": 2,
      "approved": 2,
      "pending": 0,
      "paid": 1,
      "list": [
        {
          "voucherId": "VOUCH-1736956789012",
          "month": "2026-01",
          "amount": 35400,
          "status": "Paid",
          "voucherNo": "REN/MUM/2026/0001"
        },
        {
          "voucherId": "VOUCH-1736967890123",
          "month": "2026-02",
          "amount": 35400,
          "status": "Approved",
          "voucherNo": "REN/MUM/2026/0002"
        }
      ]
    },
    "rentConfig": {
      "expectedMinRent": 25000,
      "expectedMaxRent": 35000,
      "gstExpected": "yes",
      "tdsApplicable": true
    },
    "accounting": {
      "vendorGLCode": "L2005_001",
      "totalOutstanding": 35400,
      "totalPaid": 35400,
      "nextPaymentDue": "2026-03-05"
    },
    "createdAt": "2026-02-05T10:30:00Z",
    "createdBy": "billing_manager_001"
  }
}
```

#### Business Logic

1. Retrieve site from `sites` database table by siteId
2. Join with `owners` to get owner details with GL codes
3. Join with `agreements` to get active and past agreements
4. Join with `vouchers` to get voucher summary and list
5. Calculate accounting summary:
   - Total outstanding from vendor ledger (L2005\_{code})
   - Total paid from voucher history
   - Next payment due date
6. Return complete site information

---

### API 1.4: Update Site

**Endpoint:** `PUT /api/rent-expense/sites/{siteId}`

**Description:** Update site details. Note: Owner details and GL codes cannot be changed once created.

#### Request Headers

```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {token}",
  "User-Role": "BILLING_MANAGER"
}
```

#### Request Body

```json
{
  "siteName": "Mumbai Branch Office - Updated",
  "location": "Andheri East, Near Metro Station, Mumbai",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pinCode": "400069",
  "status": "active",
  "rentConfig": {
    "expectedMinRent": 28000,
    "expectedMaxRent": 38000,
    "gstExpected": "yes",
    "tdsApplicable": true
  }
}
```

#### Response (Success - 200 OK)

```json
{
  "success": true,
  "message": "Site updated successfully",
  "data": {
    "siteId": "SITE-1736934123456",
    "siteName": "Mumbai Branch Office - Updated",
    "siteCode": "MUM-MUM-45",
    "location": "Andheri East, Near Metro Station, Mumbai",
    "updatedAt": "2026-02-05T15:00:00Z",
    "updatedBy": "billing_manager_001"
  }
}
```

#### Business Logic

1. Validate siteId exists
2. Check if site has active agreements (if yes, restrict certain changes)
3. Update allowed fields:
   - Site name
   - Location
   - Status
   - Rent config (expected ranges)
4. **Do NOT allow changes to:**
   - Site code (auto-generated, permanent)
   - City/State (would affect GST calculations in active agreements)
   - Owner details (linked to vendor ledger)
   - Owner GL codes (permanent once created)
5. Update timestamp and updatedBy
6. Save changes to database

---

## PART 2: Rent Agreement Management

---

### API 2.1: Upload Rent Agreement

**Endpoint:** `POST /api/rent-expense/agreements`

**Description:** Billing Manager uploads rent agreement for a site with document, dates, amount, and GST selection. System automatically calculates monthly breakdown for entire agreement period.

#### Request Headers

```json
{
  "Content-Type": "multipart/form-data",
  "Authorization": "Bearer {token}",
  "User-Role": "BILLING_MANAGER"
}
```

#### Request Body (Form Data)

```json
{
  "siteId": "SITE-1736934123456",
  "owner": "Rajesh Kumar Properties",
  "agreementFile": "<FILE>",
  "startDate": "2026-01-01",
  "endDate": "2026-12-31",
  "amount": 360000,
  "withGST": true
}
```

#### Field Validations

| Field         | Type    | Required | Validation Rules                              |
| ------------- | ------- | -------- | --------------------------------------------- |
| siteId        | String  | Yes      | Must be valid site ID                         |
| owner         | String  | Yes      | Owner name (can be from site or new)          |
| agreementFile | File    | Yes      | PDF/Image, max 10MB                           |
| startDate     | Date    | Yes      | Cannot be in past (or within 30 days past)    |
| endDate       | Date    | Yes      | Must be after startDate, min 1 month duration |
| amount        | Decimal | Yes      | Total rent for entire period, > 0             |
| withGST       | Boolean | Yes      | true/false                                    |

#### Response (Success - 201 Created)

```json
{
  "success": true,
  "message": "Rent agreement uploaded successfully",
  "data": {
    "agreementId": "AGR-1736945678901",
    "siteId": "SITE-1736934123456",
    "siteName": "Mumbai Branch Office",
    "siteLocation": "Andheri East, Near Railway Station",
    "siteCity": "Mumbai",
    "siteState": "Maharashtra",
    "owner": "Rajesh Kumar Properties",
    "ownerDetails": [
      {
        "ownerId": "OWN-1736934123456",
        "ownerName": "Rajesh Kumar Properties",
        "glCode": "L2005_001"
      }
    ],
    "startDate": "2026-01-01",
    "endDate": "2026-12-31",
    "amount": 360000,
    "withGST": true,
    "fileName": "rent_agreement_mumbai.pdf",
    "fileUrl": "/uploads/agreements/AGR-1736945678901.pdf",
    "calculations": {
      "totalMonths": 12,
      "monthlyBaseRent": 30000,
      "monthlyGST": 5400,
      "monthlyTotal": 35400,
      "totalGST": 64800,
      "grandTotal": 424800,
      "gstBreakdown": {
        "type": "CGST+SGST",
        "cgstRate": 9,
        "sgstRate": 9,
        "monthlyCGST": 2700,
        "monthlySGST": 2700
      }
    },
    "status": "active",
    "createdAt": "2026-02-05T11:00:00Z",
    "createdBy": "billing_manager_001",
    "nextSteps": {
      "action": "Generate Monthly Vouchers",
      "description": "System will automatically generate 12 monthly vouchers",
      "expectedVouchers": 12
    }
  }
}
```

#### Response (Error - 400 Bad Request)

```json
{
  "success": false,
  "error": "VALIDATION_ERROR",
  "message": "Invalid agreement data",
  "details": {
    "endDate": "End date must be after start date",
    "amount": "Amount must be greater than zero",
    "agreementFile": "File size exceeds 10MB limit"
  }
}
```

#### Business Logic - Agreement Upload and Calculation

1. **Validate Site Exists:**
   - Check if siteId exists in `sites` table
   - Verify site has owner information
   - Get owner GL code from site

2. **Validate Agreement File:**
   - File type: PDF, JPG, JPEG, PNG
   - File size: Max 10MB
   - Scan for viruses (if applicable)

3. **Validate Dates:**

   ```javascript
   const start = new Date(startDate)
   const end = new Date(endDate)

   if (end <= start) {
     throw new Error('End date must be after start date')
   }

   const minDuration = 30 // days
   const daysDiff = (end - start) / (1000 * 60 * 60 * 24)
   if (daysDiff < minDuration) {
     throw new Error('Minimum agreement duration is 1 month')
   }
   ```

4. **Calculate Total Months:**

   ```javascript
   const totalMonths =
     (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + 1
   ```

   Example: Jan 2026 to Dec 2026 = 12 months

5. **Calculate Monthly Breakdown:**

   ```javascript
   const baseRentTotal = parseFloat(amount)
   const monthlyBaseRent = Math.round(baseRentTotal / totalMonths)

   if (withGST) {
     const totalGST = Math.round(baseRentTotal * 0.18)
     const monthlyGST = Math.round(totalGST / totalMonths)
     const monthlyTotal = monthlyBaseRent + monthlyGST
     const grandTotal = baseRentTotal + totalGST

     // Determine GST type based on site state vs company state
     const siteState = site.state
     const companyState = getCompanyState() // From company profile

     const gstType = siteState === companyState ? 'CGST+SGST' : 'IGST'

     const gstBreakdown = {
       type: gstType,
       cgstRate: gstType === 'CGST+SGST' ? 9 : 0,
       sgstRate: gstType === 'CGST+SGST' ? 9 : 0,
       igstRate: gstType === 'IGST' ? 18 : 0,
       monthlyCGST: gstType === 'CGST+SGST' ? Math.round(monthlyGST / 2) : 0,
       monthlySGST: gstType === 'CGST+SGST' ? Math.round(monthlyGST / 2) : 0,
       monthlyIGST: gstType === 'IGST' ? monthlyGST : 0,
     }
   } else {
     const monthlyTotal = monthlyBaseRent
     const grandTotal = baseRentTotal
     const totalGST = 0
     const monthlyGST = 0
   }
   ```

6. **Save Agreement File:**
   - Generate unique file name: `AGR-{agreementId}.{extension}`
   - Store in agreements folder: `/uploads/agreements/`
   - Save file URL to database

7. **Create Agreement Record:**

   ```javascript
   const agreementData = {
     agreementId: `AGR-{timestamp}`,
     siteId: siteId,
     siteName: site.siteName,
     siteLocation: site.location,
     siteCity: site.city,
     siteState: site.state,
     owner: owner,
     ownerDetails: site.owners,
     startDate: startDate,
     endDate: endDate,
     amount: amount,
     withGST: withGST,
     fileName: originalFileName,
     fileUrl: fileUrl,
     monthlyBaseRent: monthlyBaseRent,
     monthlyGST: monthlyGST,
     monthlyTotal: monthlyTotal,
     totalVouchers: totalMonths,
     totalGST: totalGST,
     grandTotal: grandTotal,
     gstBreakdown: gstBreakdown,
     status: 'active',
     createdAt: new Date().toISOString(),
     createdBy: currentUser.username,
   }
   ```

8. **Save to Database:**
   - Insert into `agreements` table
   - Link to site via siteId
   - Update site's currentAgreementId

9. **Return Success Response:**
   - Include agreement details
   - Include calculated monthly breakdown
   - Show next steps (voucher generation)

**Important Notes:**

- Agreement amount is total for entire period, NOT monthly
- Monthly amounts calculated by dividing total by number of months
- GST type (CGST+SGST vs IGST) determined by comparing site state with company state
- If site state = company state → CGST+SGST (9% + 9%)
- If site state ≠ company state → IGST (18%)

---

### API 2.2: Get Agreement Details

**Endpoint:** `GET /api/rent-expense/agreements/{agreementId}`

**Description:** Retrieve complete agreement details including calculated breakdowns and generated vouchers.

#### Request Headers

```json
{
  "Authorization": "Bearer {token}",
  "User-Role": "BILLING_MANAGER"
}
```

#### Path Parameters

- `agreementId`: Agreement ID (e.g., AGR-1736945678901)

#### Response (Success - 200 OK)

```json
{
  "success": true,
  "data": {
    "agreementId": "AGR-1736945678901",
    "siteId": "SITE-1736934123456",
    "siteName": "Mumbai Branch Office",
    "siteLocation": "Andheri East",
    "siteCity": "Mumbai",
    "siteState": "Maharashtra",
    "owner": "Rajesh Kumar Properties",
    "ownerGLCode": "L2005_001",
    "startDate": "2026-01-01",
    "endDate": "2026-12-31",
    "amount": 360000,
    "withGST": true,
    "fileName": "rent_agreement_mumbai.pdf",
    "fileUrl": "/uploads/agreements/AGR-1736945678901.pdf",
    "calculations": {
      "totalMonths": 12,
      "monthlyBaseRent": 30000,
      "monthlyGST": 5400,
      "monthlyTotal": 35400,
      "totalGST": 64800,
      "grandTotal": 424800,
      "gstBreakdown": {
        "type": "CGST+SGST",
        "cgstRate": 9,
        "sgstRate": 9,
        "monthlyCGST": 2700,
        "monthlySGST": 2700
      }
    },
    "voucherSummary": {
      "totalVouchers": 12,
      "generated": 2,
      "approved": 2,
      "paid": 1,
      "pending": 10,
      "list": [
        {
          "month": "2026-01",
          "voucherId": "VOUCH-1736956789012",
          "status": "Paid",
          "amount": 35400
        },
        {
          "month": "2026-02",
          "voucherId": "VOUCH-1736967890123",
          "status": "Approved",
          "amount": 35400
        }
      ]
    },
    "status": "active",
    "createdAt": "2026-02-05T11:00:00Z"
  }
}
```

---

## PART 3: Voucher Generation

---

### API 3.1: Automatic Monthly Voucher Generation (Backend Process)

**Endpoint:** `POST /api/rent-expense/vouchers/generate` (Internal - Triggered Automatically)

**Description:** This is an automatic backend process that runs daily/monthly to generate rent expense vouchers for all active agreements. When triggered, the system automatically:

- Identifies all active agreements for the current month
- Generates vouchers for sites where vouchers haven't been created yet
- Automatically posts GL entries (Rent Expense, GST Input, Vendor Payable)
- Creates vendor payable entries
- Makes vouchers ready for payment processing

**Note:** This process is automatic and does not require manual intervention. Vouchers are auto-generated and GL entries are automatically posted to the Chart of Accounts.

#### Request Headers

```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {token}",
  "User-Role": "BILLING_MANAGER"
}
```

#### Request Body

```json
{
  "siteId": "SITE-1736934123456",
  "agreementId": "AGR-1736945678901",
  "month": "2026-02",
  "amount": 35400
}
```

#### Field Validations

| Field       | Type    | Required | Validation                                       |
| ----------- | ------- | -------- | ------------------------------------------------ |
| siteId      | String  | Yes      | Must exist                                       |
| agreementId | String  | Yes      | Must be active agreement for site                |
| month       | String  | Yes      | Format: YYYY-MM, must be within agreement period |
| amount      | Decimal | Yes      | Should match agreement monthly total             |

#### Response (Success - 201 Created)

```json
{
  "success": true,
  "message": "Rent voucher for 2026-02 processed successfully - ₹35,400",
  "data": {
    "voucherId": "VOUCH-1736967890123",
    "siteId": "SITE-1736934123456",
    "siteName": "Mumbai Branch Office",
    "agreementId": "AGR-1736945678901",
    "month": "2026-02",
    "year": "2026",
    "amount": 35400,
    "breakdown": {
      "baseRent": 30000,
      "gst": 5400,
      "total": 35400
    },
    "gstDetails": {
      "applicable": true,
      "rate": 18,
      "type": "CGST+SGST",
      "cgst": 2700,
      "sgst": 2700,
      "igst": 0
    },
    "ownerName": "Rajesh Kumar Properties",
    "ownerGLCode": "L2005_001",
    "status": "Approved",
    "paymentStatus": "Pending Payment",
    "accounting": {
      "voucherNo": "REN/MUM/2026/0002",
      "transactionId": "TXN_RENT_1736967890123",
      "voucherType": "Payment Voucher",
      "date": "2026-02-05",
      "glEntries": [
        {
          "lineNo": 1,
          "glCode": "X2001002002",
          "glName": "BRANCH OFFICE RENT",
          "debit": 30000,
          "credit": 0,
          "narration": "Rent for 2026-02 - Mumbai Branch Office",
          "costCenter": "Andheri East"
        },
        {
          "lineNo": 2,
          "glCode": "A3007001001",
          "glName": "CGST INPUT",
          "debit": 2700,
          "credit": 0,
          "narration": "CGST on rent - 2026-02"
        },
        {
          "lineNo": 3,
          "glCode": "A3007001002",
          "glName": "SGST INPUT",
          "debit": 2700,
          "credit": 0,
          "narration": "SGST on rent - 2026-02"
        },
        {
          "lineNo": 4,
          "glCode": "L2005_001",
          "glName": "VENDOR - Rajesh Kumar Properties",
          "debit": 0,
          "credit": 35400,
          "narration": "Rent payable to Rajesh Kumar Properties for 2026-02",
          "vendorId": "OWN-1736934123456"
        }
      ],
      "totalDebit": 35400,
      "totalCredit": 35400,
      "processedAt": "2026-02-05T12:00:00Z"
    },
    "workflow": {
      "generatedBy": "billing_manager_001",
      "generatedAt": "2026-02-05T12:00:00Z",
      "approvedBy": "Auto-Approval System",
      "approvedAt": "2026-02-05T12:00:00Z"
    },
    "vendorDetails": {
      "vendorId": "OWN-1736934123456",
      "vendorName": "Rajesh Kumar Properties",
      "vendorGL": "L2005_001",
      "panNumber": "ABCDE1234F",
      "gstin": "27ABCDE1234F1Z5",
      "state": "Maharashtra"
    },
    "paymentReady": true,
    "dueDate": "2026-02-12",
    "createdAt": "2026-02-05T12:00:00Z"
  }
}
```

#### Response (Error - 400 Bad Request)

```json
{
  "success": false,
  "error": "VOUCHER_ALREADY_EXISTS",
  "message": "Voucher already exists for this month",
  "details": {
    "month": "2026-02",
    "existingVoucherId": "VOUCH-1736967890123",
    "existingVoucherStatus": "Approved"
  }
}
```

#### Business Logic - Automatic Voucher Generation and GL Posting

**This process runs automatically in the backend (daily/monthly scheduler) without manual user intervention.**

1. **Identify Active Agreements:**
   - System scans all agreements where current month falls between startDate and endDate
   - Filter agreements with status = 'active'
   - Check each site is active
2. **Validate Before Generation:**
   - Site exists and is active
   - Agreement exists and is active
   - Current month is within agreement period (between startDate and endDate)
   - No voucher already exists for this site + month combination

3. **Check for Duplicate:**

   ```javascript
   const existing = await Voucher.findOne({
     siteId: siteId,
     month: currentMonth,
   })

   if (existing) {
     // Skip this site, voucher already generated
     continue
   }
   ```

4. **Get Agreement Details:**
   - Retrieve agreement from database
   - Get monthly breakdown (baseRent, GST, total)
   - Get GST type (CGST+SGST or IGST)
   - Get owner GL code

5. **Generate Voucher Number (Auto):**

   ```javascript
   const siteCode = site.siteCode.substring(0, 3).toUpperCase()
   const year = month.split('-')[0]

   const counters = await VoucherCounters.findOne({ type: 'rent' })
   const key = `REN/${siteCode}/${year}`
   counters[key] = (counters[key] || 0) + 1
   const voucherNo = `${key}/${String(counters[key]).padStart(4, '0')}`
   await counters.save()
   ```

   Example: `REN/MUM/2026/0002`

6. **Check if Vendor GL Exists (Auto-Create if Needed):**

   ```javascript
   let vendorGL = getVendorGLCode(ownerName)

   if (!vendorGL) {
     // Create vendor ledger if not exists
     vendorGL = await createVendorLedger(ownerId, ownerName)
   }
   ```

7. **Create GL Entries (Automatic Posting to Chart of Accounts):**

   **WITHOUT GST:**

   ```javascript
   const entries = [
     {
       lineNo: 1,
       glCode: 'X2001002002',
       glName: 'BRANCH OFFICE RENT',
       debit: amount,
       credit: 0,
       narration: `Rent for ${month} - ${siteName}`,
       costCenter: siteLocation,
     },
     {
       lineNo: 2,
       glCode: vendorGL,
       glName: `VENDOR - ${ownerName}`,
       debit: 0,
       credit: amount,
       narration: `Rent payable to ${ownerName} for ${month}`,
       vendorId: ownerId,
     },
   ]
   ```

   **WITH GST (CGST+SGST):**

   ```javascript
   const baseRent = agreement.monthlyBaseRent
   const cgst = Math.round(agreement.monthlyGST / 2)
   const sgst = Math.round(agreement.monthlyGST / 2)

   const entries = [
     {
       lineNo: 1,
       glCode: 'X2001002002',
       glName: 'BRANCH OFFICE RENT',
       debit: baseRent,
       credit: 0,
       narration: `Rent for ${month} - ${siteName}`,
       costCenter: siteLocation,
     },
     {
       lineNo: 2,
       glCode: 'A3007001001',
       glName: 'CGST INPUT',
       debit: cgst,
       credit: 0,
       narration: `CGST on rent - ${month}`,
     },
     {
       lineNo: 3,
       glCode: 'A3007001002',
       glName: 'SGST INPUT',
       debit: sgst,
       credit: 0,
       narration: `SGST on rent - ${month}`,
     },
     {
       lineNo: 4,
       glCode: vendorGL,
       glName: `VENDOR - ${ownerName}`,
       debit: 0,
       credit: amount,
       narration: `Rent payable to ${ownerName} for ${month}`,
       vendorId: ownerId,
     },
   ]
   ```

   **WITH GST (IGST):**

   ```javascript
   const baseRent = agreement.monthlyBaseRent
   const igst = agreement.monthlyGST

   const entries = [
     {
       lineNo: 1,
       glCode: 'X2001002002',
       glName: 'BRANCH OFFICE RENT',
       debit: baseRent,
       credit: 0,
       narration: `Rent for ${month} - ${siteName}`,
     },
     {
       lineNo: 2,
       glCode: 'A3007001003',
       glName: 'IGST INPUT',
       debit: igst,
       credit: 0,
       narration: `IGST on rent - ${month}`,
     },
     {
       lineNo: 3,
       glCode: vendorGL,
       glName: `VENDOR - ${ownerName}`,
       debit: 0,
       credit: amount,
       narration: `Rent payable to ${ownerName} for ${month}`,
     },
   ]
   ```

8. **Create Transaction (Auto):**

   ```javascript
   const transaction = {
     id: `TXN_RENT_{timestamp}_{voucherId}`,
     voucherNo: voucherNo,
     voucherType: 'Payment Voucher',
     date: getCurrentDate(),
     rentVoucherId: voucherId,
     entries: entries,
     totalDebit: amount,
     totalCredit: amount,
     narration: `Rent payment for ${siteName} - ${month}`,
     approvedBy: 'Billing Manager',
     approvedDate: new Date().toISOString(),
     siteDetails: {
       siteId: siteId,
       siteName: siteName,
       location: siteLocation,
     },
   }
   ```

9. **Post Transaction to GL (Automatic):**
   - Validate debits = credits
   - Save transaction to `transactions` table
   - **Automatically update ledger balances in Chart of Accounts:**
     - **Debit X2001002002:** Increase expense (Rent Expense)
     - **Debit A3007001001:** Increase CGST input (Asset - Recoverable)
     - **Debit A3007001002:** Increase SGST input (Asset - Recoverable)
     - **Credit L2005\_{code}:** Increase vendor payable (Liability)
   - **GL entries are immediately reflected in Chart of Accounts**

10. **Create Voucher Record (Auto):**

```javascript
const voucher = {
  voucherId: `VOUCH-{timestamp}`,
  siteId: siteId,
  siteName: siteName,
  agreementId: agreementId,
  month: month,
  year: year,
  amount: amount,
  breakdown: { baseRent, gst, total },
  gstDetails: { applicable, rate, type, cgst, sgst, igst },
  ownerName: ownerName,
  ownerGLCode: vendorGL,
  status: 'Approved',
  paymentStatus: 'Pending Payment',
  accounting: {
    voucherNo: voucherNo,
    transactionId: transactionId,
    vendorGL: vendorGL,
    processedAt: new Date().toISOString(),
    glPosted: true,
    glPostingDate: new Date().toISOString(),
  },
  workflow: {
    generatedBy: 'System - Auto Scheduler',
    generatedAt: new Date().toISOString(),
    approvedBy: 'Auto-Approval System',
    approvedAt: new Date().toISOString(),
    processingType: 'Automatic',
  },
  vendorDetails: {
    vendorId: ownerId,
    vendorName: ownerName,
    vendorGL: vendorGL,
    panNumber: panNumber,
    gstin: gstin,
    state: siteState,
  },
  paymentReady: true,
  dueDate: calculateDueDate(7), // 7 days from now
  createdAt: new Date().toISOString(),
}
```

11. **Store for Payment Processing (Auto):**
    - Add voucher to `vendorVouchers` table (for payment processing)
    - Set paymentReady = true
    - Voucher automatically appears in Process of Payments → Vendor Payments

12. **Log Processing and Notify:**
    - Log voucher generation event
    - Update agreement's voucher counter
    - (Optional) Send notification to Finance team about new vouchers ready for payment

**AUTOMATIC PROCESSING SUMMARY:**

✅ **System automatically identifies** all active agreements for current month  
✅ **System automatically generates** vouchers for eligible sites  
✅ **System automatically posts** GL entries to Chart of Accounts:

- Dr X2001002002 (Rent Expense)
- Dr A3007001001/002/003 (GST Input - if applicable)
- Cr L2005\_{code} (Vendor Payable)  
  ✅ **System automatically updates** ledger balances  
  ✅ **System automatically creates** vendor payable entries  
  ✅ **Vouchers automatically appear** in payment queue

**NO MANUAL INTERVENTION REQUIRED** - The entire process from voucher generation to GL posting is fully automated.

**Important Notes:**

- This is a **backend scheduled process** (runs daily/monthly)
- Vouchers are **auto-generated** for all active agreements
- GL entries are **automatically posted** to Chart of Accounts
- Vendor payables are **automatically created** in vendor's ledger (L2005\_{code})
- GST input (CGST/SGST/IGST) is automatically recorded as asset (recoverable)
- Vouchers are **auto-approved** (no separate approval workflow)
- Actual payment happens later through Process of Payments module (manual step)

---

### API 3.2: Get Vouchers for Site

**Endpoint:** `GET /api/rent-expense/sites/{siteId}/vouchers`

**Description:** Retrieve all rent vouchers generated for a specific site.

#### Query Parameters

```
?status=Approved
&paymentStatus=Pending Payment
&month=2026-02
&page=1
&limit=10
```

#### Response (Success - 200 OK)

```json
{
  "success": true,
  "data": {
    "siteId": "SITE-1736934123456",
    "siteName": "Mumbai Branch Office",
    "vouchers": [
      {
        "voucherId": "VOUCH-1736967890123",
        "month": "2026-02",
        "amount": 35400,
        "breakdown": {
          "baseRent": 30000,
          "gst": 5400
        },
        "status": "Approved",
        "paymentStatus": "Pending Payment",
        "voucherNo": "REN/MUM/2026/0002",
        "dueDate": "2026-02-12",
        "createdAt": "2026-02-05T12:00:00Z"
      },
      {
        "voucherId": "VOUCH-1736956789012",
        "month": "2026-01",
        "amount": 35400,
        "breakdown": {
          "baseRent": 30000,
          "gst": 5400
        },
        "status": "Approved",
        "paymentStatus": "Paid",
        "voucherNo": "REN/MUM/2026/0001",
        "paidDate": "2026-01-10",
        "utr": "NEFT260110123456"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalRecords": 2
    },
    "summary": {
      "totalVouchers": 2,
      "approvedVouchers": 2,
      "pendingPayment": 1,
      "paid": 1,
      "totalAmount": 70800,
      "totalPaid": 35400,
      "totalPending": 35400
    }
  }
}
```

---

### API 3.3: Get Voucher Details

**Endpoint:** `GET /api/rent-expense/vouchers/{voucherId}`

**Description:** Get complete details of a specific rent voucher including GL entries and payment status.

#### Response (Success - 200 OK)

```json
{
  "success": true,
  "data": {
    "voucherId": "VOUCH-1736967890123",
    "voucherNo": "REN/MUM/2026/0002",
    "voucherType": "Payment Voucher",
    "date": "2026-02-05",
    "siteDetails": {
      "siteId": "SITE-1736934123456",
      "siteName": "Mumbai Branch Office",
      "location": "Andheri East",
      "city": "Mumbai",
      "state": "Maharashtra"
    },
    "agreementDetails": {
      "agreementId": "AGR-1736945678901",
      "startDate": "2026-01-01",
      "endDate": "2026-12-31"
    },
    "month": "2026-02",
    "year": "2026",
    "amount": 35400,
    "breakdown": {
      "baseRent": 30000,
      "gst": 5400,
      "total": 35400
    },
    "gstDetails": {
      "applicable": true,
      "rate": 18,
      "type": "CGST+SGST",
      "cgst": 2700,
      "sgst": 2700
    },
    "ownerDetails": {
      "ownerName": "Rajesh Kumar Properties",
      "vendorGL": "L2005_001",
      "panNumber": "ABCDE1234F",
      "gstin": "27ABCDE1234F1Z5"
    },
    "glEntries": [
      {
        "lineNo": 1,
        "glCode": "X2001002002",
        "glName": "BRANCH OFFICE RENT",
        "debit": 30000,
        "credit": 0,
        "narration": "Rent for 2026-02 - Mumbai Branch Office"
      },
      {
        "lineNo": 2,
        "glCode": "A3007001001",
        "glName": "CGST INPUT",
        "debit": 2700,
        "credit": 0,
        "narration": "CGST on rent - 2026-02"
      },
      {
        "lineNo": 3,
        "glCode": "A3007001002",
        "glName": "SGST INPUT",
        "debit": 2700,
        "credit": 0,
        "narration": "SGST on rent - 2026-02"
      },
      {
        "lineNo": 4,
        "glCode": "L2005_001",
        "glName": "VENDOR - Rajesh Kumar Properties",
        "debit": 0,
        "credit": 35400,
        "narration": "Rent payable to Rajesh Kumar Properties for 2026-02"
      }
    ],
    "totalDebit": 35400,
    "totalCredit": 35400,
    "status": "Approved",
    "paymentStatus": "Pending Payment",
    "workflow": {
      "generatedBy": "billing_manager_001",
      "generatedAt": "2026-02-05T12:00:00Z",
      "approvedBy": "Auto-Approval System",
      "approvedAt": "2026-02-05T12:00:00Z"
    },
    "paymentDetails": null,
    "dueDate": "2026-02-12"
  }
}
```

---

## PART 4: Vendor Management

---

### API 4.1: Get All Vendors (Rent Owners)

**Endpoint:** `GET /api/rent-expense/vendors`

**Description:** Retrieve all vendors created from rent site owners with outstanding balances.

#### Query Parameters

```
?hasOutstanding=true
&state=Maharashtra
&page=1
&limit=10
```

#### Response (Success - 200 OK)

```json
{
  "success": true,
  "data": {
    "vendors": [
      {
        "vendorId": "OWN-1736934123456",
        "vendorName": "Rajesh Kumar Properties",
        "vendorGL": "L2005_001",
        "panNumber": "ABCDE1234F",
        "gstin": "27ABCDE1234F1Z5",
        "contactNumber": "9876543210",
        "email": "rajesh@properties.com",
        "state": "Maharashtra",
        "associatedSites": [
          {
            "siteId": "SITE-1736934123456",
            "siteName": "Mumbai Branch Office",
            "city": "Mumbai"
          }
        ],
        "accounting": {
          "glCode": "L2005_001",
          "glName": "VENDOR - Rajesh Kumar Properties",
          "currentBalance": 35400,
          "totalBilled": 70800,
          "totalPaid": 35400,
          "outstandingAmount": 35400
        },
        "payments": {
          "pendingPayments": 1,
          "paidPayments": 1,
          "totalPendingAmount": 35400
        },
        "lastPaymentDate": "2026-01-10",
        "nextPaymentDue": "2026-02-12"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalRecords": 1
    },
    "summary": {
      "totalVendors": 1,
      "totalOutstanding": 35400,
      "vendorsWithOutstanding": 1
    }
  }
}
```

---

### API 4.2: Get Vendor Ledger Statement

**Endpoint:** `GET /api/rent-expense/vendors/{vendorId}/ledger`

**Description:** Get complete ledger statement for a vendor showing all rent vouchers and payments.

#### Query Parameters

```
?fromDate=2026-01-01
&toDate=2026-02-28
```

#### Response (Success - 200 OK)

```json
{
  "success": true,
  "data": {
    "vendorId": "OWN-1736934123456",
    "vendorName": "Rajesh Kumar Properties",
    "vendorGL": "L2005_001",
    "period": {
      "fromDate": "2026-01-01",
      "toDate": "2026-02-28"
    },
    "openingBalance": 0,
    "transactions": [
      {
        "date": "2026-01-05",
        "voucherNo": "REN/MUM/2026/0001",
        "voucherId": "VOUCH-1736956789012",
        "particulars": "Rent for 2026-01 - Mumbai Branch Office",
        "debit": 0,
        "credit": 35400,
        "balance": 35400,
        "type": "Rent Voucher"
      },
      {
        "date": "2026-01-10",
        "voucherNo": "PAY/VENDOR/MUM/2026/0001",
        "paymentId": "PAY-1736978901234",
        "particulars": "Payment to Rajesh Kumar Properties",
        "debit": 35400,
        "credit": 0,
        "balance": 0,
        "type": "Payment",
        "utr": "NEFT260110123456",
        "bank": "HDFC Bank"
      },
      {
        "date": "2026-02-05",
        "voucherNo": "REN/MUM/2026/0002",
        "voucherId": "VOUCH-1736967890123",
        "particulars": "Rent for 2026-02 - Mumbai Branch Office",
        "debit": 0,
        "credit": 35400,
        "balance": 35400,
        "type": "Rent Voucher"
      }
    ],
    "closingBalance": 35400,
    "summary": {
      "totalDebits": 35400,
      "totalCredits": 70800,
      "netBalance": 35400
    }
  }
}
```

---

### API 4.3: Get Pending Vendor Payments

**Endpoint:** `GET /api/rent-expense/vendors/pending-payments`

**Description:** Get all vendors with pending rent payments (appears in Process of Payments module).

#### Response (Success - 200 OK)

```json
{
  "success": true,
  "data": {
    "pendingPayments": [
      {
        "vendorId": "OWN-1736934123456",
        "vendorName": "Rajesh Kumar Properties",
        "vendorGL": "L2005_001",
        "panNumber": "ABCDE1234F",
        "gstin": "27ABCDE1234F1Z5",
        "vouchers": [
          {
            "voucherId": "VOUCH-1736967890123",
            "voucherNo": "REN/MUM/2026/0002",
            "month": "2026-02",
            "siteName": "Mumbai Branch Office",
            "amount": 35400,
            "dueDate": "2026-02-12",
            "agingDays": 0,
            "priority": "Normal"
          }
        ],
        "totalPendingAmount": 35400,
        "totalVouchers": 1
      }
    ],
    "summary": {
      "totalVendors": 1,
      "totalVouchers": 1,
      "totalAmount": 35400
    }
  }
}
```

**Integration Note:** This API feeds data to Process of Payments → Vendor Payments section where Finance team can:

1. Select vendor
2. View pending vouchers
3. Download bank file (NEFT format)
4. Upload UTR after payment
5. System posts payment voucher (Dr Vendor, Cr Bank)

---

## Accounting Integration

### GL Posting - Rent Expense Voucher (WITH GST - CGST+SGST)

**Scenario:** Billing Manager generates monthly rent voucher for Mumbai site  
**Month:** February 2026  
**Base Rent:** ₹30,000  
**GST (18%):** ₹5,400 (CGST 9% + SGST 9%)  
**Total:** ₹35,400  
**Site State:** Maharashtra (same as company state)

#### Expense Voucher Entry

```
Voucher No: REN/MUM/2026/0002
Voucher Type: Payment Voucher
Date: 05-Feb-2026

Line 1:
  Dr X2001002002 - BRANCH OFFICE RENT              ₹30,000.00
  Narration: Rent for 2026-02 - Mumbai Branch Office
  Cost Center: Andheri East

Line 2:
  Dr A3007001001 - CGST INPUT                      ₹2,700.00
  Narration: CGST on rent - 2026-02

Line 3:
  Dr A3007001002 - SGST INPUT                      ₹2,700.00
  Narration: SGST on rent - 2026-02

Line 4:
  Cr L2005_001 - VENDOR - Rajesh Kumar Properties  ₹35,400.00
  Narration: Rent payable to Rajesh Kumar Properties for 2026-02

Total Debit:  ₹35,400.00
Total Credit: ₹35,400.00
```

**Impact on Ledgers:**

- **X2001002002 (Expense):** Increases by ₹30,000 (Debit) - Rent expense recognized
- **A3007001001 (Asset):** Increases by ₹2,700 (Debit) - CGST input credit available
- **A3007001002 (Asset):** Increases by ₹2,700 (Debit) - SGST input credit available
- **L2005_001 (Liability):** Increases by ₹35,400 (Credit) - Amount owed to vendor

**Business Meaning:**

- Company has incurred rent expense of ₹30,000
- Company has GST input credit of ₹5,400 (can offset against GST output)
- Company owes ₹35,400 to vendor (payable created)
- No cash movement yet

---

### GL Posting - Rent Expense Voucher (WITH GST - IGST)

**Scenario:** Billing Manager generates monthly rent voucher for Delhi site  
**Month:** February 2026  
**Base Rent:** ₹25,000  
**GST (18%):** ₹4,500 (IGST 18%)  
**Total:** ₹29,500  
**Site State:** Delhi (different from company state Maharashtra)

#### Expense Voucher Entry

```
Voucher No: REN/DEL/2026/0001
Voucher Type: Payment Voucher
Date: 05-Feb-2026

Line 1:
  Dr X2001002002 - BRANCH OFFICE RENT              ₹25,000.00
  Narration: Rent for 2026-02 - Delhi Branch Office

Line 2:
  Dr A3007001003 - IGST INPUT                      ₹4,500.00
  Narration: IGST on rent - 2026-02

Line 3:
  Cr L2005_002 - VENDOR - Delhi Properties Ltd     ₹29,500.00
  Narration: Rent payable to Delhi Properties Ltd for 2026-02

Total Debit:  ₹29,500.00
Total Credit: ₹29,500.00
```

**Impact on Ledgers:**

- **X2001002002 (Expense):** Increases by ₹25,000 (Debit)
- **A3007001003 (Asset):** Increases by ₹4,500 (Debit) - IGST input credit
- **L2005_002 (Liability):** Increases by ₹29,500 (Credit)

---

### GL Posting - Rent Expense Voucher (WITHOUT GST)

**Scenario:** Rent for residential property (no GST applicable)  
**Month:** February 2026  
**Rent:** ₹20,000  
**GST:** Not Applicable

#### Expense Voucher Entry

```
Voucher No: REN/PUNE/2026/0003
Voucher Type: Payment Voucher
Date: 05-Feb-2026

Line 1:
  Dr X2001002002 - BRANCH OFFICE RENT              ₹20,000.00
  Narration: Rent for 2026-02 - Pune Residence

Line 2:
  Cr L2005_003 - VENDOR - Amit Shah                ₹20,000.00
  Narration: Rent payable to Amit Shah for 2026-02

Total Debit:  ₹20,000.00
Total Credit: ₹20,000.00
```

**Impact on Ledgers:**

- **X2001002002 (Expense):** Increases by ₹20,000 (Debit)
- **L2005_003 (Liability):** Increases by ₹20,000 (Credit)

---

### GL Posting - Payment Voucher (Vendor Payment)

**Scenario:** Finance team processes payment to vendor after voucher approved  
**Vendor:** Rajesh Kumar Properties  
**Amount:** ₹35,400  
**Bank:** HDFC Bank  
**Payment Date:** 10-Feb-2026  
**UTR:** NEFT260210123456

#### Payment Voucher Entry

```
Voucher No: PAY/VENDOR/MUM/2026/0001
Voucher Type: Payment Voucher
Date: 10-Feb-2026

Line 1:
  Dr L2005_001 - VENDOR - Rajesh Kumar Properties  ₹35,400.00
  Narration: Payment to Rajesh Kumar Properties - REN/MUM/2026/0002

Line 2:
  Cr A3004003_HDFC - HDFC Bank - Current Account   ₹35,400.00
  Narration: Bank payment for rent - UTR: NEFT260210123456

Total Debit:  ₹35,400.00
Total Credit: ₹35,400.00
```

**Impact on Ledgers:**

- **L2005_001 (Liability):** Decreases by ₹35,400 (Debit) - Vendor payable cleared
- **A3004003_HDFC (Bank Asset):** Decreases by ₹35,400 (Credit) - Cash paid out

**Business Meaning:**

- Vendor payable liability is settled
- Cash paid from bank account
- UTR recorded for audit trail

---

### Complete Accounting Flow Example

**Example: Full lifecycle from voucher generation to payment**

**Step 1: Rent Voucher Generated (05-Feb-2026)**

```
Dr X2001002002 (Branch Office Rent)           ₹30,000
Dr A3007001001 (CGST Input)                   ₹2,700
Dr A3007001002 (SGST Input)                   ₹2,700
Cr L2005_001 (Vendor Payable)                 ₹35,400
```

**Step 2: Payment Processed (10-Feb-2026)**

```
Dr L2005_001 (Vendor Payable)                 ₹35,400
Cr A3004003_HDFC (HDFC Bank)                  ₹35,400
```

**Net Effect on Ledgers:**
| Account | Debit | Credit | Net Balance |
|---------|-------|--------|-------------|
| X2001002002 - Branch Office Rent | ₹30,000 | | ₹30,000 Dr (Expense) |
| A3007001001 - CGST Input | ₹2,700 | | ₹2,700 Dr (Asset) |
| A3007001002 - SGST Input | ₹2,700 | | ₹2,700 Dr (Asset) |
| L2005_001 - Vendor Payable | ₹35,400 | ₹35,400 | ₹0 (Cleared) |
| A3004003_HDFC - HDFC Bank | | ₹35,400 | ₹35,400 Cr (Cash Out) |

**Trial Balance Impact:**
| Account | Debit | Credit |
|---------|-------|--------|
| X2001002002 - Branch Office Rent | ₹30,000 | |
| A3007001001 - CGST Input | ₹2,700 | |
| A3007001002 - SGST Input | ₹2,700 | |
| A3004003_HDFC - HDFC Bank | | ₹35,400 |
| **Total** | **₹35,400** | **₹35,400** |

---

## Error Codes

### General Errors (1000-1099)

| Code | Message                  | HTTP Status |
| ---- | ------------------------ | ----------- |
| 1000 | Invalid request data     | 400         |
| 1001 | Missing required field   | 400         |
| 1002 | Invalid field format     | 400         |
| 1003 | Unauthorized access      | 401         |
| 1004 | Insufficient permissions | 403         |
| 1005 | Resource not found       | 404         |
| 1006 | Internal server error    | 500         |

### Site Management Errors (2000-2099)

| Code | Message                             | HTTP Status |
| ---- | ----------------------------------- | ----------- |
| 2000 | Site not found                      | 404         |
| 2001 | Duplicate site name in same city    | 400         |
| 2002 | Invalid PIN code for selected state | 400         |
| 2003 | Site already has active agreement   | 400         |
| 2004 | Cannot delete site with agreements  | 400         |
| 2005 | Invalid site code format            | 400         |

### Owner/Vendor Errors (2100-2199)

| Code | Message                                         | HTTP Status |
| ---- | ----------------------------------------------- | ----------- |
| 2100 | Owner details required when addOwnerNow is true | 400         |
| 2101 | Invalid PAN number format                       | 400         |
| 2102 | Invalid GSTIN format                            | 400         |
| 2103 | Vendor ledger creation failed                   | 500         |
| 2104 | Vendor GL code not found                        | 404         |
| 2105 | Duplicate vendor for same owner                 | 400         |

### Agreement Errors (2200-2299)

| Code | Message                                           | HTTP Status |
| ---- | ------------------------------------------------- | ----------- |
| 2200 | Agreement not found                               | 404         |
| 2201 | End date must be after start date                 | 400         |
| 2202 | Minimum agreement duration is 1 month             | 400         |
| 2203 | Agreement period overlaps with existing agreement | 400         |
| 2204 | Invalid agreement file format                     | 400         |
| 2205 | Agreement file size exceeds 10MB                  | 400         |
| 2206 | Agreement amount must be greater than zero        | 400         |
| 2207 | Cannot modify agreement after vouchers generated  | 400         |

### Voucher Errors (2300-2399)

| Code | Message                                         | HTTP Status |
| ---- | ----------------------------------------------- | ----------- |
| 2300 | Voucher not found                               | 404         |
| 2301 | Voucher already exists for this month           | 400         |
| 2302 | Month is outside agreement period               | 400         |
| 2303 | Voucher generation failed                       | 500         |
| 2304 | Invalid voucher month format (expected YYYY-MM) | 400         |
| 2305 | Cannot generate voucher for future month        | 400         |
| 2306 | Voucher already paid, cannot modify             | 400         |

### Accounting Errors (2400-2499)

| Code | Message                                      | HTTP Status |
| ---- | -------------------------------------------- | ----------- |
| 2400 | GL code not found in Chart of Accounts       | 404         |
| 2401 | Voucher number generation failed             | 500         |
| 2402 | Transaction posting failed                   | 500         |
| 2403 | Ledger update failed                         | 500         |
| 2404 | Debit-Credit mismatch in transaction         | 400         |
| 2405 | Invalid GL code format                       | 400         |
| 2406 | Vendor ledger balance negative (overpayment) | 400         |

### Payment Errors (2500-2599)

| Code | Message                                    | HTTP Status |
| ---- | ------------------------------------------ | ----------- |
| 2500 | No pending payments for this vendor        | 404         |
| 2501 | Payment amount exceeds outstanding balance | 400         |
| 2502 | Invalid UTR number format                  | 400         |
| 2503 | Payment already processed for this voucher | 400         |
| 2504 | Bank details not found                     | 404         |

---

## Business Rules

### General Rules

1. **Site Management:**
   - Site code is auto-generated and permanent
   - Site name must be unique within same city
   - PIN code must be valid for selected state
   - Cannot delete site if it has any agreements (active or historical)
   - Site can have multiple owners (but typically one for rent)

2. **Vendor Ledger Creation:**
   - Vendor ledger is automatically created when site is added with owner
   - GL Code format: L2005\_{sequential} (e.g., L2005_001, L2005_002)
   - Parent GL: L2005 (SUNDRY CREDITORS)
   - Once created, GL code is permanent and cannot be changed
   - If same owner has multiple sites, separate vendor ledgers may be created

3. **Rent Agreement:**
   - Agreement must have minimum duration of 1 month
   - End date must be after start date
   - Cannot have overlapping agreements for same site
   - Agreement file: PDF/Image, max 10MB
   - Agreement amount is total for entire period, NOT monthly
   - GST selection (Yes/No) determines monthly calculation

4. **GST Calculation:**
   - GST Rate: 18% on rent
   - **Same State (Company State = Site State):**
     - CGST: 9% (GL Code: A3007001001)
     - SGST: 9% (GL Code: A3007001002)
   - **Different State (Company State ≠ Site State):**
     - IGST: 18% (GL Code: A3007001003)
   - Residential rent (less than ₹1 lakh per month): Typically no GST
   - Commercial rent: GST applicable

5. **Monthly Breakdown Calculation:**

   ```
   Total Months = (End Year - Start Year) × 12 + (End Month - Start Month) + 1
   Monthly Base Rent = Total Rent Amount ÷ Total Months (rounded)

   If GST Applicable:
     Total GST = Total Rent × 18%
     Monthly GST = Total GST ÷ Total Months (rounded)
     Monthly Total = Monthly Base Rent + Monthly GST
   Else:
     Monthly Total = Monthly Base Rent
   ```

### Voucher Generation Rules

6. **Automatic Voucher Creation:**
   - **Process Type:** Automatic backend scheduler (runs daily/monthly)
   - **No Manual Intervention Required:** System automatically identifies active agreements and generates vouchers
   - Only one voucher per site per month allowed (system prevents duplicates)
   - Voucher generated only if current month is within agreement period
   - System processes all eligible sites in batch
   - Vouchers are **auto-approved** upon generation (no separate approval workflow)
   - Voucher number format: REN/{SiteCode}/{Year}/{SequenceNo}
   - **GL entries are automatically posted** to Chart of Accounts during generation

7. **Automatic GL Posting Rules:**
   - All entries must follow double-entry (Debits = Credits)
   - Rent expense **automatically posted** to X2001002002
   - GST input **automatically posted** to A3007001001 (CGST) / A3007001002 (SGST) / A3007001003 (IGST)
   - Vendor payable **automatically posted** to L2005\_{vendor-code}
   - Cost center = Site location
   - **Posting happens automatically and immediately** during voucher generation process
   - Ledger balances **automatically updated** in Chart of Accounts

8. **Payment Processing:**
   - Approved vouchers automatically appear in Process of Payments
   - Payment due date = Voucher date + 7 days (configurable)
   - Payment requires UTR number for audit trail
   - Payment posts: Dr Vendor Payable, Cr Bank
   - Payment clears vendor liability

### Validation Rules

9. **PAN Validation:**
   - Format: ABCDE1234F (5 letters + 4 digits + 1 letter)
   - All letters must be uppercase
   - Mandatory for all vendors

10. **GSTIN Validation:**
    - Format: 27ABCDE1234F1Z5 (2 digits state code + 10 char PAN + 1 digit + Z + 1 alphanumeric)
    - Total 15 characters
    - Optional (only if GST registered)
    - If provided, must be valid format

11. **Contact Validation:**
    - Mobile: Exactly 10 digits
    - Email: Valid email format
    - Both optional but recommended

12. **Amount Validation:**
    - Agreement amount: > 0, max 2 decimal places
    - Minimum rent: ₹1,000 per month (configurable)
    - Maximum rent: No limit (but flagged if > ₹10 lakhs/month for review)

### Security Rules

13. **Role-Based Access:**
    - **Billing Manager:** Can add sites, upload agreements, generate vouchers
    - **Finance Team:** Can view all data, process payments
    - **Accountant:** Can view GL postings, ledger statements
    - **Admin:** Full access to all features

14. **Data Privacy:**
    - Vendor PAN/GSTIN visible only to authorized roles
    - Bank details visible only during payment processing
    - Agreement documents access controlled

15. **Audit Trail:**
    - All actions logged with user, timestamp, IP address
    - Cannot delete or modify posted vouchers
    - Payment history immutable
    - GL postings logged separately

### Operational Rules

16. **Agreement Lifecycle:**
    - Agreement can be uploaded any time during its validity
    - System calculates months from start to end date
    - Expired agreements become read-only
    - Cannot generate vouchers for expired agreements
    - Can upload new agreement after old one expires

17. **Voucher Lifecycle:**
    - **Generated:** Voucher created, GL posted, awaiting payment
    - **Approved:** Ready for payment (same as Generated in this module)
    - **Pending Payment:** In payment queue
    - **Paid:** Payment completed with UTR
    - **Cancelled:** Reversed (requires reversal entries)

18. **Payment Processing:**
    - Batch payment supported (multiple vendors together)
    - Individual payment supported (one vendor at a time)
    - Download bank file in NEFT format
    - Upload UTR file after payment confirmation
    - System matches UTR to vouchers

---

## Summary

This API specification document provides comprehensive backend development guidelines for the **Process For Rent Expense Booking** module. It includes:

- **14 API endpoints** covering complete workflow from site addition to vendor payment
- **Automatic vendor ledger creation** when site with owner is added
- **Dual GL posting** (expense voucher + payment voucher)
- **GST compliance** (CGST+SGST for same state, IGST for inter-state)
- **Integration with Process of Payments** for vendor payment processing
- **Complete error codes** and business rules

### Key Features

1. **Automatic Vendor Ledger Creation:**
   - When site with owner is added → Vendor ledger auto-created in Chart of Accounts
   - GL Code: L2005\_{sequential} (e.g., L2005_001)
   - Parent: L2005 (SUNDRY CREDITORS)

2. **Smart GST Calculation:**
   - Same state: CGST 9% + SGST 9%
   - Different state: IGST 18%
   - Monthly breakdown automatically calculated

3. **Two-Stage GL Posting:**
   - **Stage 1 (Voucher Generation):** Dr Rent Expense + Dr GST Input, Cr Vendor Payable
   - **Stage 2 (Payment):** Dr Vendor Payable, Cr Bank

4. **Seamless Payment Integration:**
   - Approved vouchers appear in Process of Payments
   - Finance team processes payment with UTR
   - Vendor liability cleared automatically

### Implementation Notes

- All GL codes must exist in Chart of Accounts before use
- Voucher counters maintained per site per year
- Agreement amount is total for period, NOT monthly (monthly calculated automatically)
- GST type determined by comparing site state with company state
- Payment processing integrated with existing Process of Payments module

---

**End of API Specification Document**

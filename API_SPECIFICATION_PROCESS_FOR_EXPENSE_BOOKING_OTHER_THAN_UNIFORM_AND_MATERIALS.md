# API SPECIFICATION DOCUMENT

## Process For Expense Booking Other Than Uniform and Materials

---

### Document Information

- **Module Name:** Process For Expense Booking Other Than Uniform and Materials
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
   - [Part 1: Purchase Order Management](#part-1-purchase-order-management)
   - [Part 2: Invoice Verification (Billing Manager)](#part-2-invoice-verification-billing-manager)
   - [Part 3: Financial Head Approval](#part-3-financial-head-approval)
   - [Part 4: Vendor Operations](#part-4-vendor-operations)
5. [Accounting Integration](#accounting-integration)
6. [Error Codes](#error-codes)
7. [Business Rules](#business-rules)

---

## Module Overview

### Purpose

The Process For Expense Booking Other Than Uniform and Materials module streamlines the booking and approval of one-time or recurring vendor expenses, including professional fees, with necessary tax validations (GST, TDS) and compliance. The system automates accounting entries, TDS calculations, and integrates seamlessly with the payment processing workflow.

### Key Features

- **Purchase Order Management:** Create and track one-time and yearly POs with auto-generated PO numbers
- **Expense Type Classification:** Professional Fees and Other Fees with dedicated GL accounts
- **TDS Integration:** Automatic TDS calculation and journal entry creation based on section selection (194C, 194J, etc.)
- **Procurement Module Integration:** Invoice upload and Procurement Head approval handled in Procurement Portal
- **Multi-Level Approval:** Procurement Head → Billing Manager → Financial Head approval workflow
- **Automatic GL Posting:** Expense voucher + TDS journal entry automatically posted to Chart of Accounts
- **GST Validation:** Vendor GSTIN verification and compliance
- **Automatic Vendor Ledger Creation:** Creates vendor payable ledger (L2005*VEN*{code}) automatically
- **Payment Integration:** Approved invoices automatically appear in Process of Payments with net payable amount (after TDS deduction)
- **Document Management:** Upload and store PO documents and invoice attachments

### User Roles

1. **Billing Manager:** Creates POs, reviews invoices (after Procurement approval), verifies GST, forwards to Finance
2. **Procurement Head:** Reviews and approves vendor invoices in Procurement Portal (upstream process)
3. **Financial Head:** Final approval, posts GL entries, creates TDS journal
4. **Vendor:** Views POs, uploads invoices in Procurement Portal
5. **Finance Team:** Processes vendor payments (downstream process)

---

## Business Process Flow

### Workflow Steps

```
Step 1: Billing Manager - Create Purchase Order
         - Login as Billing Manager
         - Access PO Creation Form
         - Select vendor from master or add new vendor
         - PO Number: Auto-generated (Format: PO-YYYY-XXXX)
         - PO Type: One-Time or Yearly
         - Expense Type: Professional Fees or Others
         - Enter description (min 10 characters)
         - Enter amount (validate range: ₹1 - ₹1 crore)
         - Select TDS Section (194C, 194J, etc.) from dropdown
         - Upload supporting document (PDF/Image, max 5MB)
         - Submit PO
         - PO status: Submitted
↓
Step 2: Vendor - Upload Invoice (Procurement Module)
         - Login as Vendor in Procurement Portal
         - View assigned POs
         - Upload invoice document with PO reference
         - Invoice status: Pending Procurement Head Approval
↓
Step 2A: Procurement Head - Invoice Approval
         - Login as Procurement Head
         - Review vendor invoice against PO
         - Verify invoice details and documentation
         - Approve invoice
         - Invoice forwarded to Billing Manager bucket
         - Invoice status: Pending Billing Manager Review
↓
Step 3: Billing Manager - Invoice Verification
         - Login as Billing Manager
         - View pending invoices in table
         - Filter by vendor name, status, date
         - Review invoice details:
           • Invoice Number
           • PO Number
           • Vendor Name
           • Amount
           • TDS Section & Rate (from PO)
           • Uploaded Document
         - Verify GST details (GSTIN validation)
         - Action:
           • Approve: Forward to Financial Head
           • Reject: Return to Vendor with mandatory remarks
         - Invoice status: Forwarded to Finance
↓
Step 4: Financial Head - Final Approval and GL Posting
         - Login as Financial Head
         - Navigate to Invoice Approval tab
         - View pending invoices with complete details
         - Filter by vendor name, PO reference
         - Review:
           • Invoice details
           • PO reference
           • Amount
           • TDS details (Section, Rate, Amount)
           • Supporting documents
         - Action: Approve or Reject

         IF APPROVED:
         System Automatically:

         A) Create Expense Voucher and Post to GL:
            Entry 1: Dr X2002002002 (Professional Fees) OR
                     Dr X2002002003 (Other Fees)
                     Amount: Invoice Amount

            Entry 2: Cr L2003001 (TDS Payable)
                     Amount: TDS Amount (Invoice × TDS Rate)

            Entry 3: Cr L2005_VEN_{code} (Vendor Payable)
                     Amount: Net Payable (Invoice - TDS)

         B) Create Auto Journal Voucher for TDS Effect:
            Entry 1: Dr A3007 (TDS Receivable)
                     Amount: TDS Amount

            Entry 2: Cr L2003001 (TDS Payable to Government)
                     Amount: TDS Amount

         C) Save Processed Invoice for Payment:
            - Invoice saved to payment processing queue
            - Status: Pending Payment
            - Net Payable Amount (after TDS) available
            - Vendor bank details to be added

         - Invoice status: Finance Approved
         - GL entries posted to Chart of Accounts
         - Ledger balances automatically updated

         IF REJECTED:
         - Request returned to Vendor
         - Mandatory rejection remarks
         - Invoice status: Rejected by Finance
↓
Step 5: Process of Payments - Vendor Payment (Manual)
         - Approved invoice appears in vendor payments list
         - Finance team selects vendor
         - Download bank file (NEFT format)
         - Upload UTR after payment
         - Final GL posting:
           Dr L2005_VEN_{code} (Vendor Payable)
           Cr A3004003_{Bank} (Bank Account)
         - Payment status: Paid
```

### Automatic Features

1. **PO Number Auto-Generation:** Format: `PO-YYYY-XXXX` (e.g., PO-2026-5432)
2. **Invoice Upload in Procurement Module:** Vendor uploads invoice → Procurement Head approves → Invoice appears in Billing Manager bucket
3. **TDS Automatic Calculation:** Based on selected section (194C: 2%, 194J: 10%, etc.)
4. **Vendor Ledger Auto-Creation:** Creates L2005*VEN*{code} when first expense posted
5. **Dual GL Posting:** Expense voucher + TDS journal automatically created and posted
6. **Net Payable Calculation:** Invoice Amount - TDS Amount (auto-calculated)
7. **Voucher Number Auto-Generation:**
   - Expense Voucher: `PAY/MH01/YYYY/XXXX`
   - TDS Journal: `JV-TDS/YYYY/XXXX`

---

## GL Code Structure

### Chart of Accounts - Expense Booking Other Than Uniform and Materials

#### Expense Accounts

| GL Code     | Description       | Type    | Parent Code | Parent Name             | Dr/Cr |
| ----------- | ----------------- | ------- | ----------- | ----------------------- | ----- |
| X2002002002 | PROFESSIONAL FEES | Expense | X2002002    | Corporate Other Expense | Debit |
| X2002002003 | OTHER FEES        | Expense | X2002002    | Corporate Other Expense | Debit |

#### Asset Accounts (TDS Receivable)

| GL Code | Description    | Type  | Parent Code | Parent Name    | Dr/Cr |
| ------- | -------------- | ----- | ----------- | -------------- | ----- |
| A3007   | TDS RECEIVABLE | Asset | A3007       | TDS Receivable | Debit |

#### Liability Accounts (TDS & Vendor Payable)

| GL Code Pattern  | Description            | Type      | Parent Code | Parent Name      | Dr/Cr  |
| ---------------- | ---------------------- | --------- | ----------- | ---------------- | ------ |
| L2003001         | TDS PAYABLE            | Liability | L2003       | TDS Payable      | Credit |
| L2005*VEN*{code} | VENDOR - {Vendor Name} | Liability | L2005       | Sundry Creditors | Credit |

**Examples:**

- L2005_VEN_010 → VENDOR - ABC Solutions Pvt Ltd
- L2005_VEN_011 → VENDOR - XYZ Consultancy Services

#### Bank Accounts (Variable)

| GL Code Pattern  | Description   | Type  | Parent Code | Parent Name   | Dr/Cr  |
| ---------------- | ------------- | ----- | ----------- | ------------- | ------ |
| A3004003\_{Bank} | Bank Accounts | Asset | A3004003    | Bank Accounts | Credit |

### Voucher Numbering Format

- **Purchase Order:** `PO-{Year}-{4DigitRandom}` (e.g., PO-2026-5432)
- **Invoice:** `INV-{Year}-{4DigitRandom}` (e.g., INV-2026-7891)
- **Expense Voucher:** `PAY/MH01/{Year}/{4DigitSequence}` (e.g., PAY/MH01/2026/0001)
- **TDS Journal:** `JV-TDS/{Year}/{4DigitSequence}` (e.g., JV-TDS/2026/0001)
- **Payment Voucher:** `PAY/VENDOR/{Code}/{Year}/{Sequence}` (e.g., PAY/VENDOR/VEN010/2026/0001)

---

## API Specifications

---

## PART 1: Purchase Order Management

---

### API 1.1: Create Purchase Order

**Endpoint:** `POST /api/expense-booking/purchase-orders`

**Description:** Billing Manager creates a new Purchase Order for vendor expenses (Professional Fees or Other Fees). System auto-generates PO number and stores TDS section details.

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
  "vendorName": "ABC Solutions Pvt Ltd",
  "isNewVendor": false,
  "poType": "one-time",
  "expenseType": "professional-fees",
  "description": "Legal consultation services for company registration and compliance",
  "amount": 50000,
  "startDate": "2026-02-10",
  "endDate": "2026-02-28",
  "tdsSection": "194J",
  "attachment": "<FILE>"
}
```

#### Field Validations

| Field       | Type    | Required | Validation Rules                             |
| ----------- | ------- | -------- | -------------------------------------------- |
| vendorName  | String  | Yes      | Min 3 chars, from Vendor Master or new entry |
| isNewVendor | Boolean | No       | Default: false                               |
| poType      | Enum    | Yes      | one-time, yearly                             |
| expenseType | Enum    | Yes      | professional-fees, others                    |
| description | String  | Yes      | Min 10 characters, max 500                   |
| amount      | Decimal | Yes      | > 0, <= 10000000 (1 crore)                   |
| startDate   | Date    | Yes      | Cannot be in past (or max 30 days past)      |
| endDate     | Date    | No       | Must be after startDate if provided          |
| tdsSection  | String  | Yes      | Valid TDS section (194C, 194J, etc.)         |
| attachment  | File    | Yes      | PDF/JPG/PNG, max 5MB                         |

#### Response (Success - 201 Created)

```json
{
  "success": true,
  "message": "Purchase Order created successfully",
  "data": {
    "poId": "PO-1736934567890",
    "poNumber": "PO-2026-5432",
    "vendorName": "ABC Solutions Pvt Ltd",
    "vendorId": "VND-000123",
    "isNewVendor": false,
    "poType": "one-time",
    "expenseType": "professional-fees",
    "expenseTypeDisplay": "Professional Fees",
    "description": "Legal consultation services for company registration and compliance",
    "amount": 50000,
    "startDate": "2026-02-10",
    "endDate": "2026-02-28",
    "tdsDetails": {
      "section": "194J",
      "rate": "10%",
      "description": "Fees for Professional or Technical Services",
      "applicableFrom": "2024-04-01",
      "estimatedTdsAmount": 5000
    },
    "tdsApplicable": true,
    "attachment": {
      "fileName": "po_document_2026_5432.pdf",
      "fileSize": 245678,
      "fileType": "application/pdf",
      "uploadedAt": "2026-02-05T10:30:00Z",
      "fileUrl": "/uploads/po-documents/PO-2026-5432.pdf"
    },
    "status": "submitted",
    "workflow": {
      "currentStage": "PO Created",
      "nextStage": "Invoice Upload",
      "createdBy": "m1",
      "createdAt": "2026-02-05T10:30:00Z"
    }
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
    "amount": "Amount must be between ₹1 and ₹1,00,00,000",
    "description": "Description must be at least 10 characters",
    "attachment": "File size must be less than 5MB"
  }
}
```

#### Business Logic - PO Creation

1. **Auto-Generate PO Number:**

   ```javascript
   const generatePONumber = () => {
     const currentYear = new Date().getFullYear()
     const randomNum = Math.floor(Math.random() * 9000) + 1000 // 4-digit
     return `PO-${currentYear}-${randomNum}`
   }
   ```

   Example: `PO-2026-5432`

2. **Generate Unique PO ID:**
   - Format: `PO-{timestamp}`
   - Example: `PO-1736934567890`

3. **Validate Vendor:**
   - If `isNewVendor === false`: Check vendor exists in Vendor Master
   - If `isNewVendor === true`: Create basic vendor record (full onboarding later)
   - Extract vendor details: name, GSTIN, PAN, contact

4. **Retrieve TDS Section Details:**

   ```javascript
   const getTdsDetails = (tdsSection) => {
     const statutoryData = getStatutoryData() // From Statutory Master
     const tdsInfo = statutoryData.find((item) => item.section === tdsSection)

     if (!tdsInfo) {
       throw new Error('Invalid TDS section')
     }

     // Extract rate from description or use default
     let rate = tdsInfo.rate || '10%'
     if (tdsSection === '194C') rate = '2%'
     if (tdsSection === '194J') rate = '10%'

     const estimatedTdsAmount = (amount * parseFloat(rate.replace('%', ''))) / 100

     return {
       section: tdsInfo.section,
       rate: rate,
       description: tdsInfo.description,
       applicableFrom: tdsInfo.applicableFrom,
       remarks: tdsInfo.remarks,
       estimatedTdsAmount: Math.round(estimatedTdsAmount),
     }
   }
   ```

5. **Validate Amount:**
   - Must be > 0
   - Must be <= ₹10,000,000 (1 crore)
   - 2 decimal places maximum

6. **Validate Dates:**

   ```javascript
   const today = new Date().toISOString().split('T')[0]
   const grace = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

   if (startDate < grace) {
     throw new Error('Start date cannot be more than 30 days in past')
   }

   if (endDate && endDate <= startDate) {
     throw new Error('End date must be after start date')
   }
   ```

7. **Process Attachment:**
   - Validate file type: PDF, JPG, JPEG, PNG
   - Validate file size: max 5MB
   - Generate unique file name: `po_document_{year}_{random}.{ext}`
   - Store in: `/uploads/po-documents/`
   - Save file URL to database

8. **Create PO Record:**

   ```javascript
   const poData = {
     id: `PO-${Date.now()}`,
     poNumber: poNumber,
     vendorName: vendorName,
     vendorId: vendorId,
     isNewVendor: isNewVendor,
     poType: poType,
     expenseType: expenseType,
     description: description,
     amount: parseFloat(amount),
     startDate: startDate,
     endDate: endDate,
     attachment: {
       fileName: attachmentFileName,
       fileSize: attachmentSize,
       fileType: attachmentType,
       uploadedAt: new Date().toISOString(),
       fileUrl: fileUrl,
     },
     tdsSection: tdsSection,
     tdsDetails: tdsDetails,
     tdsApplicable: true,
     status: 'submitted',
     createdAt: new Date().toISOString(),
     createdBy: currentUser.username,
   }
   ```

9. **Save to Database:**
   - Insert into `purchase_orders` table
   - Update vendor's PO list
   - Set status: 'submitted'

10. **Return Success Response:**
    - Include PO details
    - Include TDS calculation
    - Show next workflow stage

**Important Notes:**

- PO number is auto-generated and unique
- TDS section must be selected (mandatory for tax compliance)
- TDS amount is estimated at PO stage, actual calculation happens at invoice approval
- Attachment is mandatory for audit trail
- PO can be one-time or yearly (recurring)

---

### API 1.2: Get All Purchase Orders

**Endpoint:** `GET /api/expense-booking/purchase-orders`

**Description:** Retrieve all Purchase Orders with filters for vendor, status, expense type, and date range.

#### Request Headers

```json
{
  "Authorization": "Bearer {token}",
  "User-Role": "BILLING_MANAGER"
}
```

#### Query Parameters

```
?vendorName=ABC Solutions
&status=submitted
&expenseType=professional-fees
&poType=one-time
&fromDate=2026-01-01
&toDate=2026-02-28
&page=1
&limit=10
```

| Parameter   | Type    | Required | Description                               |
| ----------- | ------- | -------- | ----------------------------------------- |
| vendorName  | String  | No       | Filter by vendor name (partial match)     |
| status      | String  | No       | submitted, invoiced, completed, cancelled |
| expenseType | String  | No       | professional-fees, others                 |
| poType      | String  | No       | one-time, yearly                          |
| fromDate    | Date    | No       | Filter POs from this date                 |
| toDate      | Date    | No       | Filter POs until this date                |
| page        | Integer | No       | Page number (default: 1)                  |
| limit       | Integer | No       | Items per page (default: 10)              |

#### Response (Success - 200 OK)

```json
{
  "success": true,
  "data": {
    "purchaseOrders": [
      {
        "poId": "PO-1736934567890",
        "poNumber": "PO-2026-5432",
        "vendorName": "ABC Solutions Pvt Ltd",
        "vendorId": "VND-000123",
        "poType": "one-time",
        "expenseType": "professional-fees",
        "description": "Legal consultation services",
        "amount": 50000,
        "tdsSection": "194J",
        "tdsRate": "10%",
        "estimatedTds": 5000,
        "netPayable": 45000,
        "status": "submitted",
        "hasInvoice": false,
        "createdAt": "2026-02-05T10:30:00Z",
        "createdBy": "m1"
      },
      {
        "poId": "PO-1736923456789",
        "poNumber": "PO-2026-4321",
        "vendorName": "XYZ Consultancy Services",
        "vendorId": "VND-000124",
        "poType": "yearly",
        "expenseType": "others",
        "description": "Maintenance and support services",
        "amount": 120000,
        "tdsSection": "194C",
        "tdsRate": "2%",
        "estimatedTds": 2400,
        "netPayable": 117600,
        "status": "invoiced",
        "hasInvoice": true,
        "invoiceNumber": "INV-2026-7891",
        "createdAt": "2026-02-04T14:20:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalRecords": 45,
      "limit": 10
    },
    "summary": {
      "totalPOs": 45,
      "submittedPOs": 15,
      "invoicedPOs": 20,
      "completedPOs": 8,
      "cancelledPOs": 2,
      "totalPOAmount": 2250000,
      "totalEstimatedTDS": 150000,
      "totalNetPayable": 2100000
    }
  }
}
```

#### Business Logic

1. Retrieve all POs from `purchase_orders` table
2. Apply filters:
   - Vendor name: Partial match (case-insensitive)
   - Status: Exact match
   - Expense type: Exact match
   - PO type: Exact match
   - Date range: Between fromDate and toDate
3. Join with `invoices` table to check if invoice exists
4. Calculate summary statistics
5. Paginate results
6. Return PO list with invoice status

---

### API 1.3: Get Purchase Order Details

**Endpoint:** `GET /api/expense-booking/purchase-orders/{poNumber}`

**Description:** Retrieve complete details of a specific Purchase Order including TDS details, attachment, and invoice status.

#### Request Headers

```json
{
  "Authorization": "Bearer {token}",
  "User-Role": "BILLING_MANAGER"
}
```

#### Path Parameters

- `poNumber`: PO Number (e.g., PO-2026-5432)

#### Response (Success - 200 OK)

```json
{
  "success": true,
  "data": {
    "poId": "PO-1736934567890",
    "poNumber": "PO-2026-5432",
    "vendorDetails": {
      "vendorId": "VND-000123",
      "vendorName": "ABC Solutions Pvt Ltd",
      "vendorType": "Professional Services",
      "gstin": "27AAAAA1234A1Z5",
      "pan": "AAAAA1234A",
      "contactNumber": "9876543210",
      "email": "contact@abcsolutions.com",
      "address": "123, Business Park, Mumbai - 400001"
    },
    "poType": "one-time",
    "expenseType": "professional-fees",
    "expenseTypeDisplay": "Professional Fees",
    "description": "Legal consultation services for company registration and compliance",
    "amount": 50000,
    "startDate": "2026-02-10",
    "endDate": "2026-02-28",
    "tdsDetails": {
      "section": "194J",
      "rate": "10%",
      "description": "Fees for Professional or Technical Services",
      "applicableFrom": "2024-04-01",
      "remarks": "Rate as per Income Tax Act",
      "estimatedTdsAmount": 5000,
      "netPayableAmount": 45000
    },
    "attachment": {
      "fileName": "po_document_2026_5432.pdf",
      "fileSize": 245678,
      "fileType": "application/pdf",
      "uploadedAt": "2026-02-05T10:30:00Z",
      "fileUrl": "/uploads/po-documents/PO-2026-5432.pdf"
    },
    "status": "submitted",
    "invoiceDetails": {
      "hasInvoice": false,
      "invoiceNumber": null,
      "invoiceStatus": null,
      "invoiceDate": null
    },
    "workflow": {
      "stages": [
        {
          "stage": "PO Created",
          "status": "completed",
          "completedBy": "m1",
          "completedAt": "2026-02-05T10:30:00Z"
        },
        {
          "stage": "Invoice Upload",
          "status": "pending",
          "completedBy": null,
          "completedAt": null
        },
        {
          "stage": "Invoice Verification",
          "status": "pending"
        },
        {
          "stage": "Finance Approval",
          "status": "pending"
        },
        {
          "stage": "Payment Processing",
          "status": "pending"
        }
      ]
    },
    "createdAt": "2026-02-05T10:30:00Z",
    "createdBy": "m1",
    "updatedAt": "2026-02-05T10:30:00Z"
  }
}
```

---

### API 1.4: Update Purchase Order Status

**Endpoint:** `PUT /api/expense-booking/purchase-orders/{poNumber}/status`

**Description:** Update PO status (used internally when invoice is uploaded or PO is cancelled).

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
  "status": "cancelled",
  "remarks": "Vendor unavailable, services not required"
}
```

#### Field Validations

| Field   | Type   | Required    | Validation                                |
| ------- | ------ | ----------- | ----------------------------------------- |
| status  | Enum   | Yes         | submitted, invoiced, completed, cancelled |
| remarks | String | Conditional | Required if status = cancelled            |

#### Response (Success - 200 OK)

```json
{
  "success": true,
  "message": "PO status updated successfully",
  "data": {
    "poNumber": "PO-2026-5432",
    "previousStatus": "submitted",
    "currentStatus": "cancelled",
    "remarks": "Vendor unavailable, services not required",
    "updatedBy": "m1",
    "updatedAt": "2026-02-05T15:00:00Z"
  }
}
```

---

## PART 2: Invoice Verification (Billing Manager)

**Note:** Invoices are uploaded by vendors in the **Procurement Module**. Once the Procurement Head approves the invoice, it automatically appears in the Billing Manager's bucket for verification.

---

### API 2.1: Get Invoices for Billing Manager Review

**Endpoint:** `GET /api/expense-booking/invoices/billing-manager-review`

**Description:** Get all invoices pending Billing Manager verification with GST details.

#### Request Headers

```json
{
  "Authorization": "Bearer {token}",
  "User-Role": "BILLING_MANAGER"
}
```

#### Query Parameters

```
?vendorName=ABC Solutions
&status=pending
&fromDate=2026-01-01
&toDate=2026-02-28
```

#### Response (Success - 200 OK)

```json
{
  "success": true,
  "data": {
    "invoices": [
      {
        "invoiceId": "INV-1736945678901",
        "invoiceNumber": "INV-2026-7891",
        "poNumber": "PO-2026-5432",
        "vendorName": "ABC Solutions Pvt Ltd",
        "vendorGstin": "27AAAAA1234A1Z5",
        "amount": 50000,
        "expenseType": "professional-fees",
        "tdsDetails": {
          "section": "194J",
          "rate": "10%",
          "tdsAmount": 5000,
          "netPayable": 45000
        },
        "gstDetails": {
          "gstinValid": true,
          "gstinVerifiedAt": "2026-02-15T11:05:00Z",
          "vendorState": "Maharashtra",
          "companyState": "Maharashtra",
          "gstApplicable": true
        },
        "documentUrl": "/uploads/invoices/INV-2026-7891.pdf",
        "uploadedAt": "2026-02-15T11:00:00Z",
        "status": "pending",
        "ageDays": 0
      }
    ],
    "summary": {
      "pendingCount": 8,
      "totalAmount": 400000
    }
  }
}
```

---

### API 2.2: Approve Invoice (Billing Manager)

**Endpoint:** `POST /api/expense-booking/invoices/{invoiceId}/billing-manager-approve`

**Description:** Billing Manager approves invoice after GST verification and forwards to Financial Head.

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
  "gstVerified": true,
  "gstVerificationRemarks": "GSTIN verified with government portal. Valid registration.",
  "remarks": "Invoice verified. All details match PO. Forwarding to Finance for approval."
}
```

#### Response (Success - 200 OK)

```json
{
  "success": true,
  "message": "Invoice approved and forwarded to Financial Head",
  "data": {
    "invoiceId": "INV-1736945678901",
    "invoiceNumber": "INV-2026-7891",
    "status": "approved_by_billing_manager",
    "billingManagerStatus": "approved",
    "financialHeadStatus": "pending",
    "billingManagerApproval": {
      "approvedBy": "m1",
      "approvedAt": "2026-02-15T14:00:00Z",
      "gstVerified": true,
      "remarks": "Invoice verified. All details match PO. Forwarding to Finance for approval."
    },
    "workflow": {
      "currentStage": "Pending Financial Head Approval",
      "previousStage": "Billing Manager Review",
      "nextStage": "Financial Head Review"
    }
  }
}
```

#### Business Logic

1. Validate invoice exists and is in 'pending' status
2. Verify current user has BILLING_MANAGER role
3. Update invoice status:
   - `billingManagerStatus`: 'approved'
   - `financialHeadStatus`: 'pending'
4. Store approval details:
   - Approved by user
   - Approval timestamp
   - GST verification status
   - Remarks
5. Add to Finance Head's review queue (`invoicesForFinance` table)
6. Update PO workflow stage
7. (Optional) Send notification to Financial Head
8. Return success response

---

### API 2.3: Reject Invoice (Billing Manager)

**Endpoint:** `POST /api/expense-booking/invoices/{invoiceId}/billing-manager-reject`

**Description:** Billing Manager rejects invoice with mandatory remarks and returns to vendor.

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
  "rejectionReason": "GSTIN mismatch with vendor master records. Invoice amount exceeds PO amount by 8%.",
  "actionRequired": "Please resubmit invoice with correct GSTIN and amount as per PO."
}
```

#### Field Validations

| Field           | Type   | Required | Validation                 |
| --------------- | ------ | -------- | -------------------------- |
| rejectionReason | String | Yes      | Min 20 characters, max 500 |
| actionRequired  | String | Yes      | Min 10 characters, max 300 |

#### Response (Success - 200 OK)

```json
{
  "success": true,
  "message": "Invoice rejected and returned to vendor",
  "data": {
    "invoiceId": "INV-1736945678901",
    "invoiceNumber": "INV-2026-7891",
    "status": "rejected_by_billing_manager",
    "billingManagerStatus": "rejected",
    "rejection": {
      "rejectedBy": "m1",
      "rejectedAt": "2026-02-15T14:00:00Z",
      "rejectionReason": "GSTIN mismatch with vendor master records. Invoice amount exceeds PO amount by 8%.",
      "actionRequired": "Please resubmit invoice with correct GSTIN and amount as per PO."
    },
    "workflow": {
      "currentStage": "Returned to Vendor",
      "previousStage": "Billing Manager Review",
      "action": "Resubmit Invoice"
    }
  }
}
```

#### Business Logic

1. Validate invoice exists and is in 'pending' status
2. Validate rejection reason is provided (mandatory)
3. Update invoice status:
   - `status`: 'rejected_by_billing_manager'
   - `billingManagerStatus`: 'rejected'
4. Store rejection details:
   - Rejected by user
   - Rejection timestamp
   - Rejection reason
   - Action required
5. Return invoice to vendor's queue
6. (Optional) Send notification to vendor
7. Update PO status if needed
8. Return success response

---

## PART 3: Financial Head Approval

---

### API 3.1: Get Invoices for Financial Head Review

**Endpoint:** `GET /api/expense-booking/invoices/financial-head-review`

**Description:** Get all invoices forwarded by Billing Manager for Financial Head's final approval.

#### Request Headers

```json
{
  "Authorization": "Bearer {token}",
  "User-Role": "FINANCIAL_HEAD"
}
```

#### Query Parameters

```
?vendorName=ABC Solutions
&status=pending
&expenseType=professional-fees
&fromDate=2026-01-01
&toDate=2026-02-28
&page=1
&limit=10
```

#### Response (Success - 200 OK)

```json
{
  "success": true,
  "data": {
    "invoices": [
      {
        "invoiceId": "INV-1736945678901",
        "invoiceNumber": "INV-2026-7891",
        "poNumber": "PO-2026-5432",
        "poId": "PO-1736934567890",
        "vendorName": "ABC Solutions Pvt Ltd",
        "vendorId": "VND-000123",
        "vendorGstin": "27AAAAA1234A1Z5",
        "amount": 50000,
        "invoiceDate": "2026-02-15",
        "expenseType": "professional-fees",
        "expenseTypeDisplay": "Professional Fees",
        "tdsDetails": {
          "section": "194J",
          "rate": "10%",
          "description": "Fees for Professional or Technical Services",
          "tdsAmount": 5000,
          "netPayable": 45000
        },
        "documentUrl": "/uploads/invoices/INV-2026-7891.pdf",
        "billingManagerApproval": {
          "approvedBy": "m1",
          "approvedAt": "2026-02-15T14:00:00Z",
          "gstVerified": true,
          "remarks": "Invoice verified. All details match PO."
        },
        "status": "pending_finance",
        "financialHeadStatus": "pending",
        "ageDays": 1
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 2,
      "totalRecords": 12
    },
    "summary": {
      "pendingCount": 12,
      "totalAmount": 600000,
      "totalTdsAmount": 60000,
      "totalNetPayable": 540000
    }
  }
}
```

---

### API 3.2: Approve Invoice and Post GL Entries (Financial Head)

**Endpoint:** `POST /api/expense-booking/invoices/{invoiceId}/financial-head-approve`

**Description:** Financial Head approves invoice. System automatically creates and posts:

1. Expense Voucher (Dr Expense, Cr TDS Payable, Cr Vendor Payable)
2. TDS Journal Entry (Dr TDS Receivable, Cr TDS Payable)
3. Saves processed invoice for payment processing

#### Request Headers

```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {token}",
  "User-Role": "FINANCIAL_HEAD"
}
```

#### Request Body

```json
{
  "approvalRemarks": "Approved for payment. All documentation verified.",
  "dueDate": "2026-02-20"
}
```

#### Response (Success - 200 OK)

```json
{
  "success": true,
  "message": "Invoice approved and GL entries posted successfully",
  "data": {
    "invoiceId": "INV-1736945678901",
    "invoiceNumber": "INV-2026-7891",
    "status": "finance_approved",
    "financialHeadStatus": "approved",
    "approvalDetails": {
      "approvedBy": "fh1",
      "approvedAt": "2026-02-15T16:00:00Z",
      "approvalRemarks": "Approved for payment. All documentation verified."
    },
    "accounting": {
      "expenseVoucher": {
        "voucherNo": "PAY/MH01/2026/0001",
        "transactionId": "TXN_FIN_1736956789012",
        "voucherType": "Payment Voucher",
        "date": "2026-02-15",
        "glEntries": [
          {
            "lineNo": 1,
            "glCode": "X2002002002",
            "glName": "PROFESSIONAL FEES",
            "debit": 50000,
            "credit": 0,
            "narration": "Professional Fees - Invoice INV-2026-7891 - ABC Solutions Pvt Ltd",
            "costCenter": "Operations"
          },
          {
            "lineNo": 2,
            "glCode": "L2003001",
            "glName": "TDS PAYABLE",
            "debit": 0,
            "credit": 5000,
            "narration": "TDS @10% on Invoice INV-2026-7891 - Section 194J"
          },
          {
            "lineNo": 3,
            "glCode": "L2005_VEN_010",
            "glName": "VENDOR - ABC Solutions Pvt Ltd",
            "debit": 0,
            "credit": 45000,
            "narration": "Invoice INV-2026-7891 - Payable (Net of TDS)",
            "vendorId": "VND-000123"
          }
        ],
        "totalDebit": 50000,
        "totalCredit": 50000,
        "postedAt": "2026-02-15T16:00:00Z"
      },
      "tdsJournal": {
        "voucherNo": "JV-TDS/2026/0001",
        "transactionId": "TXN_TDS_1736956789013",
        "voucherType": "Journal Voucher",
        "date": "2026-02-15",
        "glEntries": [
          {
            "lineNo": 1,
            "glCode": "A3007",
            "glName": "TDS RECEIVABLE",
            "debit": 5000,
            "credit": 0,
            "narration": "TDS @10% on Invoice INV-2026-7891 - Section 194J"
          },
          {
            "lineNo": 2,
            "glCode": "L2003001",
            "glName": "TDS PAYABLE",
            "debit": 0,
            "credit": 5000,
            "narration": "TDS liability for ABC Solutions Pvt Ltd - Invoice INV-2026-7891"
          }
        ],
        "totalDebit": 5000,
        "totalCredit": 5000,
        "postedAt": "2026-02-15T16:00:00Z"
      }
    },
    "payment": {
      "paymentStatus": "pending",
      "netPayable": 45000,
      "dueDate": "2026-02-20",
      "vendorGLCode": "L2005_VEN_010",
      "savedForPayment": true,
      "paymentQueueId": "PAY_QUEUE_1736956789014"
    },
    "workflow": {
      "currentStage": "Pending Payment",
      "previousStage": "Financial Head Approval",
      "nextStage": "Payment Processing"
    }
  }
}
```

#### Response (Error - 500 Internal Server Error)

```json
{
  "success": false,
  "error": "GL_POSTING_FAILED",
  "message": "Failed to post GL entries",
  "details": {
    "stage": "expense_voucher_posting",
    "error": "GL code X2002002002 not found in Chart of Accounts",
    "timestamp": "2026-02-15T16:00:00Z"
  }
}
```

#### Business Logic - Finance Approval and GL Posting

**This is the most critical API in the workflow. It performs multiple automatic operations:**

1. **Validate Invoice:**
   - Check invoice exists
   - Verify status is 'pending_finance'
   - Verify billingManagerStatus is 'approved'
   - Check not already approved

2. **Retrieve Complete Invoice Data:**

   ```javascript
   const invoice = getInvoiceById(invoiceId)
   const po = getPOByNumber(invoice.poNumber)
   const vendor = getVendorById(invoice.vendorId)

   // Calculate amounts
   const invoiceAmount = parseFloat(invoice.amount)
   const tdsRate = parseFloat(invoice.tdsRate.replace('%', ''))
   const tdsAmount = Math.round((invoiceAmount * tdsRate) / 100)
   const netPayable = invoiceAmount - tdsAmount
   ```

3. **Determine GL Codes:**

   ```javascript
   // Expense GL based on expense type
   const expenseGL =
     invoice.expenseType === 'professional-fees'
       ? 'X2002002002' // PROFESSIONAL FEES
       : 'X2002002003' // OTHER FEES

   // TDS GL codes
   const tdsPayableGL = 'L2003001' // TDS PAYABLE
   const tdsReceivableGL = 'A3007' // TDS RECEIVABLE

   // Vendor GL code
   const vendorGL = getOrCreateVendorGL(invoice.vendorId, invoice.vendorName)
   // Returns: L2005_VEN_010, L2005_VEN_011, etc.
   ```

4. **Check/Create Vendor Ledger:**

   ```javascript
   let vendorGLCode = getVendorGLCode(vendorId)

   if (!vendorGLCode) {
     // Auto-create vendor ledger
     vendorGLCode = createVendorLedger(vendorId, vendorName)
     // Creates L2005_VEN_{sequential} under L2005 (Sundry Creditors)
   }
   ```

5. **Generate Expense Voucher Number:**

   ```javascript
   const generateExpenseVoucherNumber = () => {
     const year = new Date().getFullYear()
     const counters = getVoucherCounters('expense')
     const key = `PAY/MH01/${year}`
     counters[key] = (counters[key] || 0) + 1
     const voucherNo = `${key}/${String(counters[key]).padStart(4, '0')}`
     updateVoucherCounters('expense', counters)
     return voucherNo
   }
   ```

   Example: `PAY/MH01/2026/0001`

6. **Create Expense Voucher Transaction:**

   ```javascript
   const expenseTransaction = {
     id: `TXN_FIN_${Date.now()}_${invoiceId}`,
     voucherNo: expenseVoucherNo,
     voucherType: 'Payment Voucher',
     date: getCurrentDate(),
     invoiceId: invoice.id,
     invoiceNumber: invoice.invoiceNumber,
     poNumber: invoice.poNumber,
     entries: [
       {
         lineNo: 1,
         glCode: expenseGL,
         glName: expenseGL === 'X2002002002' ? 'PROFESSIONAL FEES' : 'OTHER FEES',
         debit: invoiceAmount,
         credit: 0,
         narration: `${expenseType} - Invoice ${invoice.invoiceNumber} - ${invoice.vendorName}`,
         costCenter: invoice.department || 'Operations',
       },
       {
         lineNo: 2,
         glCode: tdsPayableGL,
         glName: 'TDS PAYABLE',
         debit: 0,
         credit: tdsAmount,
         narration: `TDS @${tdsRate}% on Invoice ${invoice.invoiceNumber} - Section ${invoice.tdsSection}`,
       },
       {
         lineNo: 3,
         glCode: vendorGLCode,
         glName: `VENDOR - ${invoice.vendorName}`,
         debit: 0,
         credit: netPayable,
         narration: `Invoice ${invoice.invoiceNumber} - Payable (Net of TDS)`,
         vendorId: invoice.vendorId,
       },
     ],
     totalDebit: invoiceAmount,
     totalCredit: invoiceAmount,
     narration: `Finance approval posting for Invoice ${invoice.invoiceNumber}`,
     approvedBy: currentUser.username,
     approvedDate: new Date().toISOString(),
   }
   ```

7. **Post Expense Transaction to GL:**

   ```javascript
   const expensePostResult = postTransaction(expenseTransaction)

   if (!expensePostResult.success) {
     throw new Error('Failed to post expense voucher: ' + expensePostResult.error)
   }

   // Update ledger balances automatically
   updateLedgerBalances(expenseTransaction.entries)
   // - Increases X2002002002 (Expense) by invoiceAmount (Debit)
   // - Increases L2003001 (TDS Payable) by tdsAmount (Credit)
   // - Increases L2005_VEN_010 (Vendor Payable) by netPayable (Credit)
   ```

8. **Generate TDS Journal Voucher Number:**

   ```javascript
   const generateTDSJVNumber = () => {
     const year = new Date().getFullYear()
     const counters = getVoucherCounters('tds_journal')
     const key = `JV-TDS/${year}`
     counters[key] = (counters[key] || 0) + 1
     const voucherNo = `${key}/${String(counters[key]).padStart(4, '0')}`
     updateVoucherCounters('tds_journal', counters)
     return voucherNo
   }
   ```

   Example: `JV-TDS/2026/0001`

9. **Create TDS Journal Transaction:**

   ```javascript
   const tdsTransaction = {
     id: `TXN_TDS_${Date.now()}_${invoiceId}`,
     voucherNo: tdsJVNumber,
     voucherType: 'Journal Voucher',
     date: getCurrentDate(),
     invoiceId: invoice.id,
     invoiceNumber: invoice.invoiceNumber,
     relatedVoucher: expenseVoucherNo,
     entries: [
       {
         lineNo: 1,
         glCode: tdsReceivableGL,
         glName: 'TDS RECEIVABLE',
         debit: tdsAmount,
         credit: 0,
         narration: `TDS @${tdsRate}% on Invoice ${invoice.invoiceNumber} - Section ${invoice.tdsSection}`,
       },
       {
         lineNo: 2,
         glCode: tdsPayableGL,
         glName: 'TDS PAYABLE',
         debit: 0,
         credit: tdsAmount,
         narration: `TDS liability for ${invoice.vendorName} - Invoice ${invoice.invoiceNumber}`,
       },
     ],
     totalDebit: tdsAmount,
     totalCredit: tdsAmount,
     narration: `TDS Journal Entry for Invoice ${invoice.invoiceNumber} (${invoice.vendorName}). TDS @${tdsRate}% = ₹${tdsAmount}. Section ${invoice.tdsSection}.`,
     autoGenerated: true,
     generatedBy: 'System',
     approvedBy: currentUser.username,
     approvedDate: new Date().toISOString(),
   }
   ```

10. **Post TDS Transaction to GL:**

    ```javascript
    const tdsPostResult = postTransaction(tdsTransaction)

    if (!tdsPostResult.success) {
      // Attempt to reverse expense transaction
      console.error('Failed to post TDS journal, reversing expense transaction')
      // Implement reversal logic if needed
      throw new Error('Failed to post TDS journal: ' + tdsPostResult.error)
    }

    // Update ledger balances automatically
    updateLedgerBalances(tdsTransaction.entries)
    // - Increases A3007 (TDS Receivable) by tdsAmount (Debit)
    // - Increases L2003001 (TDS Payable) by tdsAmount (Credit)
    ```

11. **Save Processed Invoice for Payment:**

    ```javascript
    const processedInvoiceForPayment = {
      // Invoice details
      id: invoice.id,
      invoiceNo: invoice.invoiceNumber,
      vendorId: invoice.vendorId,
      vendorName: invoice.vendorName,
      poNo: invoice.poNumber,
      amount: invoiceAmount,
      invoiceDate: invoice.invoiceDate,
      dueDate: dueDate || calculateDueDate(30), // 30 days from approval

      // Accounting details
      transactionId: expensePostResult.transaction.id,
      voucherNo: expenseVoucherNo,
      tdsJournalVoucherNo: tdsJVNumber,
      glEntries: expenseTransaction.entries,
      accountingDate: new Date().toISOString(),

      // TDS details
      tdsApplicable: true,
      tdsSection: invoice.tdsSection,
      tdsRate: invoice.tdsRate,
      tdsAmount: tdsAmount,
      netPayable: netPayable,

      // Payment status
      paymentStatus: 'pending', // pending, scheduled, paid
      paymentMethod: null,
      paymentDate: null,
      paymentReference: null,
      paymentRemarks: null,

      // Vendor bank details (to be filled later)
      vendorBankDetails: {
        bankName: vendor.bankName || null,
        accountNumber: vendor.accountNumber || null,
        ifscCode: vendor.ifscCode || null,
        accountName: vendor.accountName || null,
        upiId: vendor.upiId || null,
      },

      // Vendor GL code
      vendorGLCode: vendorGLCode,

      // Document references
      documentUrl: invoice.documentUrl,
      expenseType: invoice.expenseType,
      department: invoice.department || 'Operations',

      // Timestamps
      processedAt: new Date().toISOString(),
      financeApprovedAt: new Date().toISOString(),

      // Metadata
      source: 'finance_head_approval',
      financeUserId: currentUser.username,
    }

    // Save to payment queue
    const paymentQueue = getPaymentQueue('oneTimeFinalProcessedInvoice')
    paymentQueue.push(processedInvoiceForPayment)
    savePaymentQueue('oneTimeFinalProcessedInvoice', paymentQueue)
    ```

12. **Update Invoice Records:**

    ```javascript
    // Update master invoices list
    const allInvoices = getAllInvoices()
    const updatedInvoices = allInvoices.map((inv) =>
      inv.id === invoice.id
        ? {
            ...inv,
            status: 'finance_approved',
            financialHeadStatus: 'approved',
            financeApprovedAt: new Date().toISOString(),
            accountingResult: {
              transactionId: expensePostResult.transaction.id,
              voucherNo: expenseVoucherNo,
              tdsJournalVoucherNo: tdsJVNumber,
            },
          }
        : inv
    )
    saveInvoices(updatedInvoices)

    // Update invoicesForFinance
    const financeInvoices = getInvoicesForFinance()
    const updatedFinanceInvoices = financeInvoices.map((inv) =>
      inv.id === invoice.id ? { ...inv, financialHeadStatus: 'approved' } : inv
    )
    saveInvoicesForFinance(updatedFinanceInvoices)

    // Add to processed_invoices for unified vendor ledger
    const processedInvoices = getProcessedInvoices()
    processedInvoices.unshift({
      ...invoice,
      status: 'finance_approved',
      voucherNo: expenseVoucherNo,
      tdsJournalVoucherNo: tdsJVNumber,
      transactionId: expensePostResult.transaction.id,
      accountingEntries: expenseTransaction.entries,
      processedAt: new Date().toISOString(),
    })
    saveProcessedInvoices(processedInvoices)
    ```

13. **Update PO Status:**
    - If all invoices for PO are approved/paid, mark PO as 'completed'

14. **Create Audit Log:**

    ```javascript
    createAuditLog({
      module: 'expense_booking',
      action: 'finance_approval',
      invoiceId: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      userId: currentUser.username,
      timestamp: new Date().toISOString(),
      details: {
        expenseVoucherNo: expenseVoucherNo,
        tdsJournalVoucherNo: tdsJVNumber,
        amount: invoiceAmount,
        tdsAmount: tdsAmount,
        netPayable: netPayable,
        vendorGLCode: vendorGLCode,
      },
    })
    ```

15. **Return Success Response:**
    - Include all voucher details
    - Include GL entries posted
    - Include payment queue information

**NET EFFECT ON LEDGERS (Chart of Accounts):**

After Expense Voucher + TDS Journal:

| Account                         | Debit   | Credit                    | Net Balance | Impact                                                                            |
| ------------------------------- | ------- | ------------------------- | ----------- | --------------------------------------------------------------------------------- |
| X2002002002 - Professional Fees | ₹50,000 |                           | ₹50,000 Dr  | Expense recognized                                                                |
| L2003001 - TDS Payable          |         | ₹5,000 + ₹5,000 = ₹10,000 | ₹10,000 Cr  | TDS liability (both entries net out in reality, but shown separately for clarity) |
| L2005_VEN_010 - Vendor Payable  |         | ₹45,000                   | ₹45,000 Cr  | Amount owed to vendor                                                             |
| A3007 - TDS Receivable          | ₹5,000  |                           | ₹5,000 Dr   | TDS recoverable from govt                                                         |

**Business Meaning:**

- Company has recognized expense of ₹50,000
- Company will deduct TDS of ₹5,000 and remit to government
- Company owes net ₹45,000 to vendor (after TDS deduction)
- TDS of ₹5,000 is recoverable from government (shown as asset)
- No cash movement yet (payment happens later)

**Important Notes:**

- This is a **fully automated process** - one API call creates both vouchers and posts to GL
- GL entries are **immediately reflected** in Chart of Accounts
- Ledger balances are **automatically updated**
- Invoice is **automatically saved** to payment queue
- Vendor ledger is **automatically created** if doesn't exist
- Both expense voucher and TDS journal are **atomically posted** (all or nothing)

---

### API 3.3: Reject Invoice (Financial Head)

**Endpoint:** `POST /api/expense-booking/invoices/{invoiceId}/financial-head-reject`

**Description:** Financial Head rejects invoice with mandatory remarks and returns to vendor.

#### Request Headers

```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {token}",
  "User-Role": "FINANCIAL_HEAD"
}
```

#### Request Body

```json
{
  "rejectionReason": "Invoice documentation incomplete. Missing signed agreement copy.",
  "actionRequired": "Please submit complete documentation including signed service agreement.",
  "returnTo": "vendor"
}
```

#### Field Validations

| Field           | Type   | Required | Validation                                |
| --------------- | ------ | -------- | ----------------------------------------- |
| rejectionReason | String | Yes      | Min 20 characters, max 500                |
| actionRequired  | String | Yes      | Min 10 characters, max 300                |
| returnTo        | Enum   | No       | vendor, billing_manager (default: vendor) |

#### Response (Success - 200 OK)

```json
{
  "success": true,
  "message": "Invoice rejected and returned to vendor",
  "data": {
    "invoiceId": "INV-1736945678901",
    "invoiceNumber": "INV-2026-7891",
    "status": "rejected_by_finance",
    "financialHeadStatus": "rejected",
    "rejection": {
      "rejectedBy": "fh1",
      "rejectedAt": "2026-02-15T16:00:00Z",
      "rejectionReason": "Invoice documentation incomplete. Missing signed agreement copy.",
      "actionRequired": "Please submit complete documentation including signed service agreement.",
      "returnedTo": "vendor"
    },
    "workflow": {
      "currentStage": "Returned to Vendor",
      "previousStage": "Financial Head Review",
      "action": "Resubmit Invoice"
    }
  }
}
```

---

## PART 4: Vendor Operations

**Note:** Vendor invoice upload and initial approval happens in the **Procurement Module**. These APIs are for vendors to track their POs and invoice status in the billing system.

---

### API 4.1: Get Vendor's POs

**Endpoint:** `GET /api/expense-booking/vendors/my-pos`

**Description:** Vendor views their assigned Purchase Orders.

#### Request Headers

```json
{
  "Authorization": "Bearer {token}",
  "User-Role": "VENDOR"
}
```

#### Query Parameters

```
?status=submitted
&expenseType=professional-fees
&fromDate=2026-01-01
&toDate=2026-02-28
```

#### Response (Success - 200 OK)

```json
{
  "success": true,
  "data": {
    "vendorId": "VND-000123",
    "vendorName": "ABC Solutions Pvt Ltd",
    "purchaseOrders": [
      {
        "poId": "PO-1736934567890",
        "poNumber": "PO-2026-5432",
        "poType": "one-time",
        "expenseType": "professional-fees",
        "description": "Legal consultation services",
        "amount": 50000,
        "startDate": "2026-02-10",
        "endDate": "2026-02-28",
        "tdsSection": "194J",
        "tdsRate": "10%",
        "estimatedTds": 5000,
        "netPayable": 45000,
        "status": "submitted",
        "hasInvoice": false,
        "createdAt": "2026-02-05T10:30:00Z"
      }
    ],
    "summary": {
      "totalPOs": 5,
      "totalPOAmount": 250000,
      "invoicesSubmitted": 3,
      "invoicesPending": 2
    }
  }
}
```

---

### API 4.2: Get Vendor's Invoices

**Endpoint:** `GET /api/expense-booking/vendors/my-invoices`

**Description:** Vendor views their submitted invoices with status tracking.

#### Request Headers

```json
{
  "Authorization": "Bearer {token}",
  "User-Role": "VENDOR"
}
```

#### Response (Success - 200 OK)

```json
{
  "success": true,
  "data": {
    "vendorId": "VND-000123",
    "vendorName": "ABC Solutions Pvt Ltd",
    "invoices": [
      {
        "invoiceId": "INV-1736945678901",
        "invoiceNumber": "INV-2026-7891",
        "poNumber": "PO-2026-5432",
        "amount": 50000,
        "tdsAmount": 5000,
        "netPayable": 45000,
        "status": "pending_finance",
        "billingManagerStatus": "approved",
        "financialHeadStatus": "pending",
        "uploadedAt": "2026-02-15T11:00:00Z",
        "currentStage": "Pending Financial Head Approval"
      }
    ],
    "summary": {
      "totalInvoices": 8,
      "pendingReview": 2,
      "approved": 5,
      "rejected": 1,
      "totalInvoiceAmount": 400000,
      "totalNetPayable": 360000
    }
  }
}
```

---

## Accounting Integration

### GL Posting - Expense Voucher (WITH TDS)

**Scenario:** Financial Head approves professional fees invoice  
**Vendor:** ABC Solutions Pvt Ltd  
**Invoice Amount:** ₹50,000  
**TDS Section:** 194J (10%)  
**TDS Amount:** ₹5,000  
**Net Payable:** ₹45,000

#### Expense Voucher Entry

```
Voucher No: PAY/MH01/2026/0001
Voucher Type: Payment Voucher
Date: 15-Feb-2026

Line 1:
  Dr X2002002002 - PROFESSIONAL FEES                  ₹50,000.00
  Narration: Professional Fees - Invoice INV-2026-7891 - ABC Solutions Pvt Ltd
  Cost Center: Operations

Line 2:
  Cr L2003001 - TDS PAYABLE                          ₹5,000.00
  Narration: TDS @10% on Invoice INV-2026-7891 - Section 194J

Line 3:
  Cr L2005_VEN_010 - VENDOR - ABC Solutions Pvt Ltd  ₹45,000.00
  Narration: Invoice INV-2026-7891 - Payable (Net of TDS)

Total Debit:  ₹50,000.00
Total Credit: ₹50,000.00
```

**Impact on Ledgers:**

- **X2002002002 (Expense):** Increases by ₹50,000 (Debit) - Expense recognized
- **L2003001 (Liability):** Increases by ₹5,000 (Credit) - TDS liability created
- **L2005_VEN_010 (Liability):** Increases by ₹45,000 (Credit) - Amount owed to vendor

**Business Meaning:**

- Company has incurred professional fees expense of ₹50,000
- Company will deduct TDS of ₹5,000 and remit to government
- Company owes net ₹45,000 to vendor (after TDS deduction)
- No cash movement yet

---

### GL Posting - TDS Journal Entry (AUTO GENERATED)

**Scenario:** Auto-generated TDS journal immediately after expense voucher  
**Purpose:** Record TDS effect and create TDS receivable asset

#### TDS Journal Entry

```
Voucher No: JV-TDS/2026/0001
Voucher Type: Journal Voucher
Date: 15-Feb-2026
Reference: TDS Effect for INV-2026-7891

Line 1:
  Dr A3007 - TDS RECEIVABLE                          ₹5,000.00
  Narration: TDS @10% on Invoice INV-2026-7891 - Section 194J

Line 2:
  Cr L2003001 - TDS PAYABLE                          ₹5,000.00
  Narration: TDS liability for ABC Solutions Pvt Ltd - Invoice INV-2026-7891

Total Debit:  ₹5,000.00
Total Credit: ₹5,000.00
```

**Impact on Ledgers:**

- **A3007 (Asset):** Increases by ₹5,000 (Debit) - TDS recoverable from government
- **L2003001 (Liability):** Increases by ₹5,000 (Credit) - TDS liability to government

**Business Meaning:**

- Company has TDS receivable of ₹5,000 (asset - will be adjusted when filing returns)
- Company has TDS payable of ₹5,000 to government
- This entry balances the TDS treatment in books

---

### GL Posting - Payment Voucher (Vendor Payment)

**Scenario:** Finance team processes payment to vendor after invoice approval  
**Vendor:** ABC Solutions Pvt Ltd  
**Net Payable:** ₹45,000 (after TDS deduction)  
**Bank:** HDFC Bank  
**Payment Date:** 20-Feb-2026  
**UTR:** NEFT260220123456

#### Payment Voucher Entry

```
Voucher No: PAY/VENDOR/VEN010/2026/0001
Voucher Type: Payment Voucher
Date: 20-Feb-2026

Line 1:
  Dr L2005_VEN_010 - VENDOR - ABC Solutions Pvt Ltd  ₹45,000.00
  Narration: Payment to ABC Solutions Pvt Ltd - Invoice INV-2026-7891

Line 2:
  Cr A3004003_HDFC - HDFC Bank - Current Account     ₹45,000.00
  Narration: Bank payment - UTR: NEFT260220123456

Total Debit:  ₹45,000.00
Total Credit: ₹45,000.00
```

**Impact on Ledgers:**

- **L2005_VEN_010 (Liability):** Decreases by ₹45,000 (Debit) - Vendor payable cleared
- **A3004003_HDFC (Bank Asset):** Decreases by ₹45,000 (Credit) - Cash paid out

**Business Meaning:**

- Vendor payable liability is settled
- Cash paid from bank account
- UTR recorded for audit trail

---

### Complete Accounting Flow Example

**Example: Full lifecycle from PO creation to payment**

**Initial State (Before PO):**

- No transactions

**Step 1: PO Created (05-Feb-2026)**

- No GL impact (PO is commitment, not transaction)
- PO saved for reference

**Step 2: Invoice Uploaded (15-Feb-2026)**

- No GL impact (invoice pending approval)
- Invoice in queue for verification

**Step 3: Financial Head Approves (15-Feb-2026)**

**3a. Expense Voucher Posted:**

```
Dr X2002002002 (Professional Fees)              ₹50,000
Cr L2003001 (TDS Payable)                       ₹5,000
Cr L2005_VEN_010 (Vendor Payable)               ₹45,000
```

**3b. TDS Journal Posted:**

```
Dr A3007 (TDS Receivable)                       ₹5,000
Cr L2003001 (TDS Payable)                       ₹5,000
```

**Step 4: Payment Processed (20-Feb-2026)**

```
Dr L2005_VEN_010 (Vendor Payable)               ₹45,000
Cr A3004003_HDFC (HDFC Bank)                    ₹45,000
```

**Net Effect on Ledgers:**
| Account | Debit | Credit | Net Balance | Meaning |
|---------|-------|--------|-------------|---------|
| X2002002002 - Professional Fees | ₹50,000 | | ₹50,000 Dr | Expense recognized |
| A3007 - TDS Receivable | ₹5,000 | | ₹5,000 Dr | TDS recoverable |
| L2003001 - TDS Payable | | ₹5,000 + ₹5,000 = ₹10,000 | ₹10,000 Cr | TDS liability |
| L2005_VEN_010 - Vendor Payable | ₹45,000 | ₹45,000 | ₹0 | Cleared |
| A3004003_HDFC - HDFC Bank | | ₹45,000 | ₹45,000 Cr | Cash out |

**Trial Balance Impact:**
| Account | Debit | Credit |
|---------|-------|--------|
| X2002002002 - Professional Fees | ₹50,000 | |
| A3007 - TDS Receivable | ₹5,000 | |
| L2003001 - TDS Payable | | ₹10,000 |
| A3004003_HDFC - HDFC Bank | | ₹45,000 |
| **Total** | **₹55,000** | **₹55,000** |

**Final Balances:**

- Professional Fees Expense: ₹50,000 (P&L)
- TDS Receivable: ₹5,000 (Balance Sheet - Asset)
- TDS Payable: ₹10,000 (Balance Sheet - Liability)
- Bank: Reduced by ₹45,000 (Balance Sheet - Asset)
- Net Vendor Payable: ₹0 (cleared)

---

### GL Posting - Other Fees Example

**Scenario:** Financial Head approves maintenance services invoice  
**Vendor:** XYZ Services Ltd  
**Invoice Amount:** ₹30,000  
**TDS Section:** 194C (2%)  
**TDS Amount:** ₹600  
**Net Payable:** ₹29,400

#### Expense Voucher Entry

```
Voucher No: PAY/MH01/2026/0002
Voucher Type: Payment Voucher
Date: 16-Feb-2026

Line 1:
  Dr X2002002003 - OTHER FEES                         ₹30,000.00
  Narration: Other Fees - Invoice INV-2026-7892 - XYZ Services Ltd

Line 2:
  Cr L2003001 - TDS PAYABLE                          ₹600.00
  Narration: TDS @2% on Invoice INV-2026-7892 - Section 194C

Line 3:
  Cr L2005_VEN_011 - VENDOR - XYZ Services Ltd       ₹29,400.00
  Narration: Invoice INV-2026-7892 - Payable (Net of TDS)

Total Debit:  ₹30,000.00
Total Credit: ₹30,000.00
```

**Note:** Different expense GL code (X2002002003) used for "Other Fees" category.

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

### Purchase Order Errors (2000-2099)

| Code | Message                                | HTTP Status |
| ---- | -------------------------------------- | ----------- |
| 2000 | PO not found                           | 404         |
| 2001 | Duplicate PO number                    | 400         |
| 2002 | Invalid PO type                        | 400         |
| 2003 | Invalid expense type                   | 400         |
| 2004 | Amount exceeds maximum limit           | 400         |
| 2005 | Start date cannot be in past           | 400         |
| 2006 | End date must be after start date      | 400         |
| 2007 | Invalid TDS section                    | 400         |
| 2008 | Attachment file size exceeds limit     | 400         |
| 2009 | Invalid attachment file type           | 400         |
| 2010 | Description too short                  | 400         |
| 2011 | PO already has invoice                 | 400         |
| 2012 | Cannot cancel PO with approved invoice | 400         |

### Vendor Errors (2100-2199)

| Code | Message                       | HTTP Status |
| ---- | ----------------------------- | ----------- |
| 2100 | Vendor not found              | 404         |
| 2101 | Invalid vendor name           | 400         |
| 2102 | Vendor GSTIN invalid          | 400         |
| 2103 | Vendor PAN invalid            | 400         |
| 2104 | Vendor already exists         | 400         |
| 2105 | Vendor ledger creation failed | 500         |

### Invoice Errors (2200-2299)

| Code | Message                             | HTTP Status |
| ---- | ----------------------------------- | ----------- |
| 2200 | Invoice not found                   | 404         |
| 2201 | Invoice already exists for this PO  | 400         |
| 2202 | Invoice amount mismatch with PO     | 400         |
| 2203 | Invoice date before PO start date   | 400         |
| 2204 | Invalid invoice document            | 400         |
| 2205 | Invoice document size exceeds limit | 400         |
| 2206 | Invoice already approved            | 400         |
| 2207 | Invoice already rejected            | 400         |
| 2208 | Cannot approve rejected invoice     | 400         |
| 2209 | Rejection remarks required          | 400         |

### Billing Manager Errors (2300-2399)

| Code | Message                         | HTTP Status |
| ---- | ------------------------------- | ----------- |
| 2300 | Invoice not in pending status   | 400         |
| 2301 | GST verification required       | 400         |
| 2302 | GSTIN validation failed         | 400         |
| 2303 | Cannot forward rejected invoice | 400         |

### Finance Approval Errors (2400-2499)

| Code | Message                                  | HTTP Status |
| ---- | ---------------------------------------- | ----------- |
| 2400 | Invoice not forwarded by billing manager | 400         |
| 2401 | GL code not found in Chart of Accounts   | 404         |
| 2402 | Voucher number generation failed         | 500         |
| 2403 | Transaction posting failed               | 500         |
| 2404 | Ledger update failed                     | 500         |
| 2405 | Debit-Credit mismatch in transaction     | 400         |
| 2406 | TDS journal creation failed              | 500         |
| 2407 | Vendor ledger not found                  | 404         |
| 2408 | Expense voucher creation failed          | 500         |
| 2409 | Payment queue save failed                | 500         |

### Payment Errors (2500-2599)

| Code | Message                      | HTTP Status |
| ---- | ---------------------------- | ----------- |
| 2500 | Invoice not finance approved | 400         |
| 2501 | Payment already processed    | 400         |
| 2502 | Invalid UTR number format    | 400         |
| 2503 | Bank details not found       | 404         |
| 2504 | Payment amount mismatch      | 400         |

---

## Business Rules

### General Rules

1. **Purchase Order Management:**
   - PO number is auto-generated and unique (Format: PO-YYYY-XXXX)
   - PO amount: Min ₹1, Max ₹1 crore (₹10,000,000)
   - Start date: Cannot be more than 30 days in past
   - End date: Must be after start date (if provided)
   - Attachment: Mandatory, PDF/Image, max 5MB
   - TDS section: Mandatory for tax compliance
   - Once invoice is uploaded, PO cannot be cancelled

2. **TDS Section Rules:**
   - **194C:** Works Contract / Payment to Contractors - Rate: 2%
   - **194J:** Fees for Professional or Technical Services - Rate: 10%
   - TDS rate retrieved from Statutory Master
   - TDS section selected at PO stage
   - TDS automatically calculated at invoice approval
   - TDS amount deducted from vendor payment

3. **Expense Type Classification:**
   - **Professional Fees:** Legal, Audit, Consultancy, Professional Services
     - GL Code: X2002002002
     - Parent: X2002002 (Corporate Other Expense)
   - **Other Fees:** Maintenance, Support, Miscellaneous Services
     - GL Code: X2002002003
     - Parent: X2002002 (Corporate Other Expense)

4. **Vendor Management:**
   - Can select existing vendor from Vendor Master
   - Can add new vendor (basic details, full onboarding later)
   - Vendor GSTIN validated if provided
   - Vendor ledger auto-created on first expense posting:
     - GL Code: L2005*VEN*{sequential} (e.g., L2005_VEN_010, L2005_VEN_011)
     - Parent: L2005 (Sundry Creditors)
     - Nature: Credit

5. **Invoice Upload and Procurement Approval (Handled in Procurement Module):**
   - **Invoice Upload:** Vendor uploads invoice in Procurement Portal against submitted PO
   - **Procurement Head Approval:** Procurement Head reviews and approves invoice
   - **Invoice Transfer:** After Procurement approval, invoice appears in Billing Manager's bucket
   - **Invoice Validation Rules:**
     - Invoice amount should match PO amount (tolerance: ±5%)
     - Invoice date cannot be before PO start date
     - Invoice document: PDF/Image, max 5MB
     - Invoice number auto-generated: INV-YYYY-XXXX
     - TDS details inherited from PO
   - **Note:** This expense booking module receives invoices AFTER Procurement Head approval

### Approval Workflow Rules

6. **Billing Manager Verification:**
   - **Receives invoices:** After Procurement Head approval in Procurement Module
   - **Must verify:**
     - Invoice details match PO
     - GSTIN validation (if applicable)
     - Document quality and completeness
     - Amount correctness
   - **Actions:**
     - Approve: Forward to Financial Head
     - Reject: Return to vendor with mandatory remarks
   - **Cannot modify:**
     - Invoice amount
     - TDS section
     - Vendor details

7. **Financial Head Approval:**
   - **Must review:**
     - Complete invoice details
     - PO reference
     - TDS calculation
     - Supporting documents
   - **Actions:**
     - Approve: System auto-posts GL entries (Expense Voucher + TDS Journal)
     - Reject: Return to vendor with mandatory remarks
   - **Automatic processes on approval:**
     - Expense Voucher creation and posting
     - TDS Journal creation and posting
     - Vendor ledger creation (if doesn't exist)
     - Payment queue entry creation
     - Ledger balance updates

8. **GL Posting Rules (Automatic):**

   **Expense Voucher (Created automatically on approval):**

   ```
   Dr Expense GL (X2002002002 or X2002002003)  - Invoice Amount
   Cr TDS Payable GL (L2003001)                - TDS Amount
   Cr Vendor GL (L2005_VEN_{code})             - Net Payable Amount
   ```

   **TDS Journal (Created automatically immediately after expense voucher):**

   ```
   Dr TDS Receivable GL (A3007)                - TDS Amount
   Cr TDS Payable GL (L2003001)                - TDS Amount
   ```

   **Business Meaning:**
   - All entries must balance (Debits = Credits)
   - Expense posted to correct GL based on expense type
   - TDS deducted and liability created
   - Vendor payable = Invoice Amount - TDS Amount
   - TDS receivable shows company's claim against future tax
   - Posting happens immediately upon approval
   - Ledger balances automatically updated

9. **Net Payable Calculation:**

   ```
   Net Payable = Invoice Amount - TDS Amount

   TDS Amount = Invoice Amount × TDS Rate

   Example:
   Invoice: ₹50,000
   TDS Rate: 10% (Section 194J)
   TDS Amount: ₹50,000 × 10% = ₹5,000
   Net Payable: ₹50,000 - ₹5,000 = ₹45,000
   ```

10. **Payment Processing (Downstream):**
    - Approved invoices automatically saved to payment queue
    - Finance team processes payment via "Process of Payments" module
    - Payment amount = Net Payable (after TDS deduction)
    - UTR recording mandatory for audit
    - Payment posts:
      - Dr Vendor Payable GL
      - Cr Bank GL
    - Vendor liability cleared after payment

### Validation Rules

11. **PO Validation:**
    - Vendor name: Min 3 characters
    - Description: Min 10 characters, max 500
    - Amount: > 0, <= ₹10,000,000, max 2 decimals
    - Start date: Not more than 30 days in past
    - End date: > start date (if provided)
    - TDS section: Must exist in Statutory Master

12. **Invoice Validation:**
    - PO must exist and be in 'submitted' status
    - Invoice amount variance: Max ±5% from PO amount
    - Invoice date: >= PO start date, <= PO end date (if specified)
    - Document: Required, PDF/JPG/PNG, max 5MB
    - Cannot upload duplicate invoice for same PO

13. **GST Validation:**
    - GSTIN format: 15 characters (if provided)
    - Format: 2 digits state code + 10 char PAN + 1 digit + Z + 1 alphanumeric
    - Example: 27AAAAA1234A1Z5
    - Optional but recommended for compliance

14. **Amount Validation:**
    - All amounts: 2 decimal places maximum
    - PO amount: ₹1 to ₹1,00,00,000
    - Invoice variance: ±5% of PO amount
    - TDS calculation: Rounded to nearest rupee

### Security Rules

15. **Role-Based Access:**
    - **Billing Manager:**
      - Create POs
      - Verify invoices
      - Forward to Finance
      - Cannot approve financial transactions
    - **Financial Head:**
      - Final approval
      - GL posting authority
      - Cannot create POs
    - **Vendor:**
      - View assigned POs
      - Upload invoices
      - Cannot modify PO details
    - **Finance Team:**
      - Process payments
      - View all approved invoices
      - Cannot approve invoices

16. **Data Privacy:**
    - Vendor bank details visible only during payment
    - TDS details visible to authorized roles only
    - Invoice documents access controlled
    - PO attachments restricted to creator and approvers

17. **Audit Trail:**
    - All actions logged with user, timestamp, IP
    - Cannot delete posted vouchers
    - Cannot modify approved invoices
    - GL postings immutable
    - Payment history tracked with UTR

### Operational Rules

18. **Voucher Numbering:**
    - PO: `PO-{Year}-{4DigitRandom}` (e.g., PO-2026-5432)
    - Invoice: `INV-{Year}-{4DigitRandom}` (e.g., INV-2026-7891)
    - Expense Voucher: `PAY/MH01/{Year}/{4DigitSequence}` (e.g., PAY/MH01/2026/0001)
    - TDS Journal: `JV-TDS/{Year}/{4DigitSequence}` (e.g., JV-TDS/2026/0001)
    - Payment: `PAY/VENDOR/{Code}/{Year}/{Sequence}` (e.g., PAY/VENDOR/VEN010/2026/0001)
    - All sequences maintained per year

19. **Document Management:**
    - All PO attachments stored in `/uploads/po-documents/`
    - All invoice documents stored in `/uploads/invoices/`
    - File naming: `{type}_{year}_{random}.{ext}`
    - Retention: Minimum 7 years for tax compliance
    - Access via secure URLs with authentication

20. **Payment Integration:**
    - Approved invoices automatically appear in payment queue
    - Payment details:
      - Invoice number
      - Vendor name and bank details
      - Net payable amount (after TDS)
      - Due date
      - Voucher references
    - Payment posting through "Process of Payments" module
    - UTR recording mandatory
    - Final GL posting: Dr Vendor Payable, Cr Bank

---

## Summary

This API specification document provides comprehensive backend development guidelines for the **Process For Expense Booking Other Than Uniform and Materials** module. It includes:

- **11 API endpoints** covering complete workflow from PO creation to payment processing
- **Integration with Procurement Module:** Vendor invoice upload → Procurement Head approval → Billing Manager bucket
- **Multi-level approval workflow:** Procurement Head → Billing Manager → Financial Head
- **Automatic dual GL posting:** Expense Voucher + TDS Journal Entry
- **Automatic vendor ledger creation** under L2005 (Sundry Creditors)
- **Automatic TDS calculation** based on section selection
- **Complete TDS treatment:** Expense deduction + Journal entry for TDS effect
- **Integration with Process of Payments** for vendor payment processing
- **Complete error codes** and business rules

### Key Features

1. **Automatic Vendor Ledger Creation:**
   - When first expense is approved → Vendor ledger auto-created in Chart of Accounts
   - GL Code: L2005*VEN*{sequential} (e.g., L2005_VEN_010, L2005_VEN_011)
   - Parent: L2005 (SUNDRY CREDITORS)

2. **Dual GL Posting on Approval:**
   - **Expense Voucher:**
     - Dr X2002002002/003 (Expense)
     - Cr L2003001 (TDS Payable)
     - Cr L2005*VEN*{code} (Vendor Payable)
   - **TDS Journal (Auto):**
     - Dr A3007 (TDS Receivable)
     - Cr L2003001 (TDS Payable)

3. **TDS Automation:**
   - TDS section selected at PO stage
   - Rate retrieved from Statutory Master
   - Amount auto-calculated at approval
   - Journal entry auto-created
   - Net payable auto-calculated

4. **Seamless Payment Integration:**
   - Approved invoices → Payment queue
   - Net payable amount (after TDS) available
   - Vendor bank details linked
   - Payment via "Process of Payments" module
   - UTR recording for audit

### Implementation Notes

- All GL codes must exist in Chart of Accounts before use
- Voucher counters maintained per year per type
- TDS section must be valid from Statutory Master
- Both expense voucher and TDS journal posted atomically (all or nothing)
- Ledger balances updated automatically after posting
- Vendor ledger created on first expense (if doesn't exist)
- Payment amount = Invoice Amount - TDS Amount

---

**End of API Specification Document**

# **API SPECIFICATION – PROCESS FOR PREPAID ENTRY (UNIFORM PROCUREMENT)**

---

## **TABLE OF CONTENTS**

1. [Overview](#1-overview)
2. [Workflow Summary](#2-workflow-summary)
3. [GL Code Structure](#3-gl-code-structure)
4. [API Endpoints](#4-api-endpoints)
   - [Part 1: Account Executive Review](#part-1-account-executive-review)
   - [Part 2: Account Manager Final Approval](#part-2-account-manager-final-approval)
   - [Part 3: Monthly Amortization Management](#part-3-monthly-amortization-management)
   - [Part 4: Transaction & Reporting](#part-4-transaction--reporting)

---

## **1. OVERVIEW**

### **Objective**

To ensure proper booking of uniform expenses and systematic recognition of prepaid expenses through multi-level approvals, accurate GST validation, and automated monthly amortization over the uniform lifecycle period.

### **Process Flow**

1. **Account Executive (AE)**: Reviews and approves/rejects Prepaid Uniform invoices
2. **Account Manager (AM)**: Final approval with prepaid period selection (uniform lifecycle)
3. **System**: Auto-creates vendor ledger and posts two vouchers:
   - **Purchase Voucher**: Books prepaid uniform expense with GST
   - **Journal Voucher**: Monthly amortization based on selected period
4. **Monthly Amortization**: Systematic expense recognition over the prepaid period

### **Key Features**

- Two-level invoice approval workflow (AE → AM)
- One-time prepaid period selection modal (6, 12, 18, or 24 months)
- Automatic Purchase Voucher and Journal Voucher posting
- Monthly amortization tracking and execution
- Auto-creation of vendor ledger under L2005 (Sundry Creditors)
- Separate GST input credit (CGST/SGST) from prepaid amortization
- Visual dashboards for amortization status tracking

---

## **2. WORKFLOW SUMMARY**

### **Step 1: Account Executive Review**

1. After Project Head approves uniform invoices → It comes to Account Executive (AE)
2. AE sees invoice list where:
   - **Type = "Procurement Prepaid"** → Indicates Prepaid Entry (Uniform)
   - Invoice details fetched from Purchase Booking (HK Materials)
3. AE verifies:
   - HSN Code & Summary (auto-fetched)
   - Uploaded invoice PDF
   - Vendor details and amount
4. AE Actions:
   - **Approve**: Invoice moves to Account Manager bucket
   - **Reject**: Sent back to Vendor with mandatory remarks

### **Step 2: Account Manager Final Approval**

1. AM views invoices approved by AE
2. AM verifies invoice, vendor, amount, PO links
3. On **Approve** → One-time modal opens:
   - Select number of months for prepaid amortization (uniform lifecycle)
   - Options: 6, 12, 18, or 24 months
   - Select start month for amortization
4. Two posting actions triggered together automatically:

| Action                  | Posting Purpose                          | Voucher Type                             |
| ----------------------- | ---------------------------------------- | ---------------------------------------- |
| **Purchase Voucher**    | Books prepaid uniform expense + GST      | Purchase Voucher (PREPAID/PUR/YYYY/nnnn) |
| **Prepaid Entry Setup** | Sets up prepaid expense for amortization | System Configuration                     |

5. If **Rejected**:
   - Reason mandatory
   - Invoice goes back to Vendor Bucket for correction

### **Step 3: Monthly Amortization (Post-Approval)**

1. After AM approval, invoice remains in AM dashboard with "Approved" status
2. AM can view three modals for the approved invoice:
   - **Purchase Voucher**: View initial purchase booking GL entries
   - **Journal Voucher**: Preview monthly amortization JV format
   - **Monthly Amortization**: Execute monthly amortization JVs
3. **Monthly Amortization Modal** features:
   - Shows passed amortizations (already posted)
   - Shows remaining amortizations (pending)
   - Allows posting of next month's amortization JV
   - Tracks amortization progress (Passed/Remaining/Total)

### **GL Entries Overview**

#### **At Time of Purchase Entry (Automatic on AM Approval)**

| Sr No | Account Type    | GL Code          | GL Name                | Debit (₹)             | Credit (₹)           | Description                         |
| ----- | --------------- | ---------------- | ---------------------- | --------------------- | -------------------- | ----------------------------------- |
| 1     | Prepaid Expense | A3005001         | UNIFORM EXPENSE        | Base Amount (Taxable) | -                    | Prepaid asset (excludes GST)        |
| 2     | GST Input       | A3007001001      | CGST INPUT             | CGST Amount           | -                    | GST input credit (50% of total GST) |
| 3     | GST Input       | A3007001002      | SGST INPUT             | SGST Amount           | -                    | GST input credit (50% of total GST) |
| 4     | Sundry Creditor | L2005*VEN*{code} | VENDOR - {Vendor Name} | -                     | Total Invoice Amount | Vendor payable                      |

**Parent GL Codes:**

- A3005: Prepaid Expense (Parent)
- A3007001: GST Input (Parent)
- L2005: Sundry Creditors (Parent)

**Note:** GST is claimed immediately as input credit and is NOT amortized. Only the base (taxable) amount is amortized monthly.

#### **Monthly Amortization JV (Manual Execution via Button Click)**

| Sr No | Account Type  | GL Code  | GL Name         | Debit (₹)      | Credit (₹)     | Description                         |
| ----- | ------------- | -------- | --------------- | -------------- | -------------- | ----------------------------------- |
| 1     | Expense       | X2001004 | UNIFORM EXPENSE | Monthly Amount | -              | Monthly uniform expense recognition |
| 2     | Prepaid Asset | A3005001 | UNIFORM EXPENSE | -              | Monthly Amount | Reduction of prepaid asset          |

**Parent GL Codes:**

- X2001: Branch Management (Parent for X2001004)
- A3005: Prepaid Expense (Parent for A3005001)

**Monthly Calculation:**

```
Monthly Amortization Amount = Taxable Amount ÷ Prepaid Period (in months)
```

**Example:**

- Total Invoice Amount: ₹118,000
- GST Rate: 18%
- Taxable Amount: ₹118,000 ÷ 1.18 = ₹100,000
- CGST: ₹9,000 | SGST: ₹9,000
- Prepaid Period: 12 months
- Monthly Amortization: ₹100,000 ÷ 12 = ₹8,333

---

## **3. GL CODE STRUCTURE**

### **3.1 Prepaid Expense GL Codes**

| GL Code  | GL Name         | Parent Code | Parent Name     | Nature | Description                                 |
| -------- | --------------- | ----------- | --------------- | ------ | ------------------------------------------- |
| A3005001 | UNIFORM EXPENSE | A3005       | PREPAID EXPENSE | ASSET  | Prepaid uniform asset (before amortization) |

**Usage:**

- **DR** on purchase (creates prepaid asset)
- **CR** monthly (reduces prepaid asset through amortization)

### **3.2 Expense GL Codes (Monthly Amortization)**

| GL Code  | GL Name         | Parent Code | Parent Name       | Nature  | Description                         |
| -------- | --------------- | ----------- | ----------------- | ------- | ----------------------------------- |
| X2001004 | UNIFORM EXPENSE | X2001       | BRANCH MANAGEMENT | EXPENSE | Monthly uniform expense recognition |

**Usage:**

- **DR** monthly (recognizes uniform expense for the month)

### **3.3 GST Input GL Codes**

| GL Code     | GL Name    | Parent Code | Parent Name | Nature | Description                                 |
| ----------- | ---------- | ----------- | ----------- | ------ | ------------------------------------------- |
| A3007001001 | CGST INPUT | A3007001    | GST INPUT   | ASSET  | Central GST Input Credit (50% of total GST) |
| A3007001002 | SGST INPUT | A3007001    | GST INPUT   | ASSET  | State GST Input Credit (50% of total GST)   |

**Important Note:** GST input credit is claimed immediately at the time of purchase and is NOT subject to amortization. Only the taxable (base) amount is amortized over the prepaid period.

### **3.4 Vendor Ledger GL Code (Auto-Created)**

**Format:** `L2005_VEN_{counter}_{VendorName}`

**Example:**

- `L2005_VEN_001_ABC_Uniforms`
- `L2005_VEN_002_XYZ_Garments_Ltd`

**Parent Code:** L2005 (SUNDRY CREDITORS)

**Note:**

- System checks if vendor ledger already exists before creating a new one
- If vendor ledger exists, it reuses the same GL code
- Vendor ledger name format: `VENDOR - {Vendor Name}`

### **3.5 Voucher Number Formats**

| Voucher Type                   | Format                        | Example               | Purpose                         |
| ------------------------------ | ----------------------------- | --------------------- | ------------------------------- |
| Purchase Voucher               | PREPAID/PUR/{Year}/{Sequence} | PREPAID/PUR/2026/0001 | Initial prepaid expense booking |
| Journal Voucher (Amortization) | PREPAID/JV/{Year}/{Sequence}  | PREPAID/JV/2026/0001  | Monthly amortization entry      |

---

## **4. API ENDPOINTS**

---

## **PART 1: ACCOUNT EXECUTIVE REVIEW**

---

### **1. API TO FETCH ALL PENDING PREPAID UNIFORM INVOICES FOR AE**

**Endpoint:** `GET /api/invoices/ae/pending`

**Description:** Retrieves all Prepaid Uniform (Procurement Prepaid) invoices pending AE review.

#### **Request**

**Headers:**

```json
{
  "Authorization": "Bearer {token}",
  "Content-Type": "application/json"
}
```

**Query Parameters:**

| Parameter     | Type                | Required | Description                                                            |
| ------------- | ------------------- | -------- | ---------------------------------------------------------------------- |
| type          | String              | No       | Filter by invoice type. Use "Procurement Prepaid" for Uniform invoices |
| vendorName    | String              | No       | Filter by vendor name (partial match)                                  |
| invoiceNumber | String              | No       | Filter by invoice number (partial match)                               |
| date          | String (YYYY-MM-DD) | No       | Filter by submission date                                              |
| page          | Integer             | No       | Page number (default: 1)                                               |
| limit         | Integer             | No       | Records per page (default: 5)                                          |

**Example Request:**

```
GET /api/invoices/ae/pending?type=Procurement Prepaid&page=1&limit=5
```

#### **Response**

**Success (200 OK):**

```json
{
  "success": true,
  "data": {
    "invoices": [
      {
        "id": "INV-003",
        "invoiceNumber": "INV-003",
        "vendorName": "Delta Solutions",
        "type": "Procurement Prepaid",
        "totalAmount": 230000,
        "status": "Pending GST Verification",
        "gstRate": 18,
        "hsnCode": "998223",
        "hsnSummary": "Uniform Supply Services",
        "documentUrl": "/public/DxotBTxfHn.png",
        "submittedBy": "procurement",
        "submittedAt": "2026-02-04T10:30:00.000Z",
        "processedBy": null,
        "processedAt": null,
        "remarks": "",
        "poDocuments": [
          {
            "name": "PO-001",
            "url": "https://example.com/po-001.pdf"
          },
          {
            "name": "PO-002",
            "url": "https://example.com/po-002.pdf"
          }
        ],
        "vendor_gl_mappings": {
          "expense_gl_code": "X1001004001",
          "payable_gl_code": "L2005_VEN_003_Delta_Solutions",
          "vendor_number": "003"
        }
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 2,
      "totalRecords": 8,
      "recordsPerPage": 5
    }
  },
  "message": "Prepaid Uniform invoices retrieved successfully"
}
```

**Error (400 Bad Request):**

```json
{
  "success": false,
  "error": "Invalid query parameters",
  "message": "Invalid date format provided"
}
```

**Error (401 Unauthorized):**

```json
{
  "success": false,
  "error": "Unauthorized",
  "message": "Invalid or expired token"
}
```

---

### **2. API TO APPROVE PREPAID UNIFORM INVOICE (BY AE)**

**Endpoint:** `POST /api/invoices/ae/approve`

**Description:** Account Executive approves a Prepaid Uniform invoice and forwards it to Account Manager for final approval and period selection.

#### **Request**

**Headers:**

```json
{
  "Authorization": "Bearer {token}",
  "Content-Type": "application/json"
}
```

**Body:**

```json
{
  "invoiceId": "INV-003",
  "gstRate": 18,
  "hsnCode": "998223",
  "hsnSummary": "Uniform Supply Services - Security Guard Uniforms",
  "remarks": "Invoice verified against PO. All details match. HSN code confirmed."
}
```

**Body Parameters:**

| Parameter  | Type   | Required | Description                           |
| ---------- | ------ | -------- | ------------------------------------- |
| invoiceId  | String | Yes      | Unique invoice ID                     |
| gstRate    | Number | Yes      | GST rate percentage (e.g., 5, 12, 18) |
| hsnCode    | String | Yes      | HSN/SAC code from invoice             |
| hsnSummary | String | No       | Description of HSN code               |
| remarks    | String | No       | AE's approval remarks                 |

#### **Response**

**Success (200 OK):**

```json
{
  "success": true,
  "data": {
    "invoiceId": "INV-003",
    "invoiceNumber": "INV-003",
    "status": "Approved by AE - Pending AM Review",
    "processedBy": "ae1",
    "processedAt": "2026-02-04T14:20:00.000Z",
    "nextApprover": "Account Manager",
    "vendorName": "Delta Solutions",
    "amount": 230000,
    "type": "Procurement Prepaid"
  },
  "message": "Invoice INV-003 approved and sent to Account Manager for final processing!"
}
```

**Error (400 Bad Request):**

```json
{
  "success": false,
  "error": "Validation Error",
  "message": "GST rate is required"
}
```

**Error (404 Not Found):**

```json
{
  "success": false,
  "error": "Invoice Not Found",
  "message": "Invoice with ID INV-003 does not exist"
}
```

**Error (401 Unauthorized):**

```json
{
  "success": false,
  "error": "Unauthorized",
  "message": "Invalid or expired token"
}
```

---

### **3. API TO REJECT PREPAID UNIFORM INVOICE (BY AE)**

**Endpoint:** `POST /api/invoices/ae/reject`

**Description:** Account Executive rejects a Prepaid Uniform invoice and sends it back to vendor with rejection remarks.

#### **Request**

**Headers:**

```json
{
  "Authorization": "Bearer {token}",
  "Content-Type": "application/json"
}
```

**Body:**

```json
{
  "invoiceId": "INV-003",
  "remarks": "Invoice amount does not match with PO. HSN code is incorrect. Please verify and resubmit."
}
```

**Body Parameters:**

| Parameter | Type   | Required | Description                                            |
| --------- | ------ | -------- | ------------------------------------------------------ |
| invoiceId | String | Yes      | Unique invoice ID                                      |
| remarks   | String | Yes      | Mandatory rejection reason/remarks (must not be empty) |

#### **Response**

**Success (200 OK):**

```json
{
  "success": true,
  "data": {
    "invoiceId": "INV-003",
    "invoiceNumber": "INV-003",
    "status": "Rejected by AE",
    "processedBy": "ae1",
    "processedAt": "2026-02-04T14:25:00.000Z",
    "rejectedAt": "2026-02-04T14:25:00.000Z",
    "remarks": "Invoice amount does not match with PO. HSN code is incorrect. Please verify and resubmit.",
    "vendorName": "Delta Solutions",
    "amount": 230000
  },
  "message": "Invoice INV-003 rejected and sent back to vendor with remarks."
}
```

**Error (400 Bad Request):**

```json
{
  "success": false,
  "error": "Validation Error",
  "message": "Rejection remarks are mandatory"
}
```

**Error (404 Not Found):**

```json
{
  "success": false,
  "error": "Invoice Not Found",
  "message": "Invoice with ID INV-003 does not exist"
}
```

---

## **PART 2: ACCOUNT MANAGER FINAL APPROVAL**

---

### **4. API TO FETCH ALL PENDING PREPAID UNIFORM INVOICES FOR AM**

**Endpoint:** `GET /api/invoices/am/pending`

**Description:** Retrieves all Prepaid Uniform invoices approved by AE and pending final approval from Account Manager.

#### **Request**

**Headers:**

```json
{
  "Authorization": "Bearer {token}",
  "Content-Type": "application/json"
}
```

**Query Parameters:**

| Parameter     | Type                | Required | Description                                       |
| ------------- | ------------------- | -------- | ------------------------------------------------- |
| type          | String              | No       | Filter by invoice type. Use "Procurement Prepaid" |
| vendorName    | String              | No       | Filter by vendor name (partial match)             |
| invoiceNumber | String              | No       | Filter by invoice number (partial match)          |
| date          | String (YYYY-MM-DD) | No       | Filter by submission date                         |
| page          | Integer             | No       | Page number (default: 1)                          |
| limit         | Integer             | No       | Records per page (default: 5)                     |

**Example Request:**

```
GET /api/invoices/am/pending?type=Procurement Prepaid&page=1&limit=5
```

#### **Response**

**Success (200 OK):**

```json
{
  "success": true,
  "data": {
    "invoices": [
      {
        "id": "INV-003",
        "invoiceNumber": "INV-003",
        "vendorName": "Delta Solutions",
        "type": "Procurement Prepaid",
        "totalAmount": 230000,
        "status": "Approved by AE - Pending AM Review",
        "gstRate": 18,
        "hsnCode": "998223",
        "hsnSummary": "Uniform Supply Services - Security Guard Uniforms",
        "documentUrl": "/public/DxotBTxfHn.png",
        "submittedBy": "procurement",
        "submittedAt": "2026-02-04T10:30:00.000Z",
        "processedBy": "ae1",
        "processedAt": "2026-02-04T14:20:00.000Z",
        "remarks": "Invoice verified against PO. All details match. HSN code confirmed.",
        "poDocuments": [
          {
            "name": "PO-001",
            "url": "https://example.com/po-001.pdf"
          }
        ],
        "accountManagerStatus": null,
        "finalStatus": null
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 2,
      "totalRecords": 6,
      "recordsPerPage": 5
    }
  },
  "message": "Pending AM invoices retrieved successfully"
}
```

**Error (401 Unauthorized):**

```json
{
  "success": false,
  "error": "Unauthorized",
  "message": "Invalid or expired token"
}
```

---

### **5. API TO APPROVE PREPAID UNIFORM INVOICE WITH PERIOD SELECTION (BY AM)**

**Endpoint:** `POST /api/invoices/am/approve-prepaid`

**Description:** Account Manager gives final approval to Prepaid Uniform invoice with prepaid period selection. System automatically posts Purchase Voucher and sets up monthly amortization configuration.

#### **Request**

**Headers:**

```json
{
  "Authorization": "Bearer {token}",
  "Content-Type": "application/json"
}
```

**Body:**

```json
{
  "invoiceId": "INV-003",
  "prepaidPeriod": 12,
  "prepaidStartMonth": "2026-02",
  "remarks": "Final approval - Prepaid period set to 12 months"
}
```

**Body Parameters:**

| Parameter         | Type             | Required | Description                                          |
| ----------------- | ---------------- | -------- | ---------------------------------------------------- |
| invoiceId         | String           | Yes      | Unique invoice ID                                    |
| prepaidPeriod     | Integer          | Yes      | Number of months for amortization (6, 12, 18, or 24) |
| prepaidStartMonth | String (YYYY-MM) | Yes      | Month to start amortization (format: YYYY-MM)        |
| remarks           | String           | No       | AM's approval remarks                                |

#### **Backend Processing Flow:**

1. **Validate Invoice Data**
   - Check invoice exists and is in "Approved by AE" status
   - Validate vendor name, amount, GST rate
   - Validate prepaid period (must be 6, 12, 18, or 24)

2. **Vendor Ledger Management**
   - Check if vendor ledger exists under L2005
   - If exists: Retrieve existing GL code
   - If not exists: Auto-create new vendor ledger with format `L2005_VEN_{counter}_{VendorName}`

3. **GST Calculation (CRITICAL - GST NOT Amortized)**
   - Calculate taxable amount (base amount before GST):
     ```
     Taxable Amount = (Total Invoice Amount × 100) ÷ (100 + GST Rate)
     ```
   - Calculate total GST:
     ```
     Total GST = Total Invoice Amount - Taxable Amount
     ```
   - Split GST equally:
     ```
     CGST Amount = Total GST ÷ 2
     SGST Amount = Total GST - CGST Amount
     ```
   - **Important**: GST is claimed immediately as input credit and is NOT included in monthly amortization

4. **Monthly Amortization Calculation**
   - Calculate monthly amortization amount (ONLY on taxable amount):
     ```
     Monthly Amortization = Taxable Amount ÷ Prepaid Period
     ```
   - Example:
     - Total Amount: ₹118,000
     - GST Rate: 18%
     - Taxable Amount: ₹100,000
     - Total GST: ₹18,000 (CGST: ₹9,000 + SGST: ₹9,000)
     - Prepaid Period: 12 months
     - Monthly Amortization: ₹100,000 ÷ 12 = ₹8,333 (GST excluded)

5. **Create Purchase Voucher Transaction**
   - Generate voucher number: `PREPAID/PUR/{Year}/{sequence}` (e.g., PREPAID/PUR/2026/0001)
   - Create transaction with 4 entries:
     - **Entry 1 (Debit):** A3005001 UNIFORM EXPENSE (Prepaid) - Taxable Amount
     - **Entry 2 (Debit):** A3007001001 CGST Input - CGST Amount
     - **Entry 3 (Debit):** A3007001002 SGST Input - SGST Amount
     - **Entry 4 (Credit):** L2005_VEN_xxx VENDOR - Total Invoice Amount

6. **Post Transaction**
   - Validate transaction balance (Total Debit = Total Credit)
   - Save transaction to `transactions` localStorage
   - Update ledger balances in `chartOfAccounts`

7. **Setup Prepaid Configuration**
   - Store prepaid period, start month, and monthly amortization details
   - Invoice remains in AM queue with "Approved" status for monthly JV posting

8. **Update Invoice Status**
   - Mark invoice as "GL Posted - Completed"
   - Store Purchase Voucher details in invoice
   - Keep invoice in `pending_am_invoices` (not moved to processed) for amortization tracking

#### **Response**

**Success (200 OK):**

```json
{
  "success": true,
  "data": {
    "invoiceId": "INV-003",
    "invoiceNumber": "INV-003",
    "status": "GL Posted - Completed",
    "accountManagerStatus": "Approved",
    "finalStatus": "GL Posted - Completed",
    "processedByAM": "am1",
    "processedAtAM": "2026-02-04T15:00:00.000Z",
    "vendorName": "Delta Solutions",
    "amount": 230000,
    "purchaseVoucherNo": "PREPAID/PUR/2026/0001",
    "purchaseTransactionId": "TXN_PREPAID_UNIFORM_1707057600000_INV-003",
    "vendorGLCode": "L2005_VEN_003_Delta_Solutions",
    "uniformPrepaidGLCode": "A3005001",
    "uniformPrepaidGLName": "UNIFORM EXPENSE",
    "breakdown": {
      "taxable": 194915,
      "cgst": 17542,
      "sgst": 17543,
      "total": 230000
    },
    "prepaidDetails": {
      "prepaidPeriod": 12,
      "prepaidStartMonth": "2026-02",
      "monthlyAmortization": 16243,
      "taxableAmount": 194915,
      "totalGST": 35085
    },
    "glEntries": [
      {
        "lineNo": 1,
        "glCode": "A3005001",
        "glName": "UNIFORM EXPENSE",
        "debit": 194915,
        "credit": 0,
        "narration": "Prepaid Uniform purchase - Delta Solutions"
      },
      {
        "lineNo": 2,
        "glCode": "A3007001001",
        "glName": "CGST Input",
        "debit": 17542,
        "credit": 0,
        "narration": "CGST @9% on Prepaid Uniform"
      },
      {
        "lineNo": 3,
        "glCode": "A3007001002",
        "glName": "SGST Input",
        "debit": 17543,
        "credit": 0,
        "narration": "SGST @9% on Prepaid Uniform"
      },
      {
        "lineNo": 4,
        "glCode": "L2005_VEN_003_Delta_Solutions",
        "glName": "VENDOR - Delta Solutions",
        "debit": 0,
        "credit": 230000,
        "narration": "Invoice INV-003 - Prepaid Uniform"
      }
    ],
    "amortizationSchedule": {
      "totalMonths": 12,
      "monthlyAmount": 16243,
      "startMonth": "2026-02",
      "endMonth": "2027-01",
      "amortizationStatus": {
        "passed": 0,
        "remaining": 12,
        "total": 12
      }
    }
  },
  "message": "Prepaid Uniform invoice INV-003 approved and GL entries posted successfully! Purchase Voucher: PREPAID/PUR/2026/0001"
}
```

**Error (400 Bad Request - Validation):**

```json
{
  "success": false,
  "error": "Validation Error",
  "message": "Prepaid period must be 6, 12, 18, or 24 months"
}
```

**Error (400 Bad Request - Invalid Start Month):**

```json
{
  "success": false,
  "error": "Validation Error",
  "message": "Invalid prepaid start month format. Use YYYY-MM"
}
```

**Error (400 Bad Request - Transaction Balance):**

```json
{
  "success": false,
  "error": "Transaction Validation Failed",
  "message": "Total Debit (230000) does not match Total Credit (230001)"
}
```

**Error (404 Not Found):**

```json
{
  "success": false,
  "error": "Invoice Not Found",
  "message": "Invoice with ID INV-003 does not exist in AM queue"
}
```

**Error (500 Internal Server Error):**

```json
{
  "success": false,
  "error": "GL Posting Failed",
  "message": "Failed to process Prepaid Uniform invoice: Database connection error"
}
```

---

### **6. API TO REJECT PREPAID UNIFORM INVOICE (BY AM)**

**Endpoint:** `POST /api/invoices/am/reject`

**Description:** Account Manager rejects a Prepaid Uniform invoice and sends it back to vendor with rejection remarks.

#### **Request**

**Headers:**

```json
{
  "Authorization": "Bearer {token}",
  "Content-Type": "application/json"
}
```

**Body:**

```json
{
  "invoiceId": "INV-003",
  "remarks": "Vendor GL code mismatch. Please verify vendor details and resubmit."
}
```

**Body Parameters:**

| Parameter | Type   | Required | Description                                            |
| --------- | ------ | -------- | ------------------------------------------------------ |
| invoiceId | String | Yes      | Unique invoice ID                                      |
| remarks   | String | Yes      | Mandatory rejection reason/remarks (must not be empty) |

#### **Response**

**Success (200 OK):**

```json
{
  "success": true,
  "data": {
    "invoiceId": "INV-003",
    "invoiceNumber": "INV-003",
    "status": "Rejected by Account Manager",
    "accountManagerStatus": "Rejected",
    "finalStatus": "Rejected - Return to Vendor",
    "processedByAM": "am1",
    "processedAtAM": "2026-02-04T15:10:00.000Z",
    "rejectedAtAM": "2026-02-04T15:10:00.000Z",
    "amRemarks": "Vendor GL code mismatch. Please verify vendor details and resubmit.",
    "vendorName": "Delta Solutions",
    "amount": 230000
  },
  "message": "Invoice INV-003 rejected by Account Manager and returned to vendor."
}
```

**Error (400 Bad Request):**

```json
{
  "success": false,
  "error": "Validation Error",
  "message": "Rejection remarks are mandatory"
}
```

**Error (404 Not Found):**

```json
{
  "success": false,
  "error": "Invoice Not Found",
  "message": "Invoice with ID INV-003 does not exist"
}
```

---

## **PART 3: MONTHLY AMORTIZATION MANAGEMENT**

---

### **7. API TO GET AMORTIZATION STATUS FOR AN INVOICE**

**Endpoint:** `GET /api/invoices/amortization/status/:invoiceNumber`

**Description:** Retrieves amortization status for a specific Prepaid Uniform invoice including passed and remaining amortizations.

#### **Request**

**Headers:**

```json
{
  "Authorization": "Bearer {token}",
  "Content-Type": "application/json"
}
```

**Path Parameters:**

| Parameter     | Type   | Required | Description           |
| ------------- | ------ | -------- | --------------------- |
| invoiceNumber | String | Yes      | Unique invoice number |

**Example Request:**

```
GET /api/invoices/amortization/status/INV-003
```

#### **Response**

**Success (200 OK):**

```json
{
  "success": true,
  "data": {
    "invoiceNumber": "INV-003",
    "vendorName": "Delta Solutions",
    "totalAmount": 230000,
    "taxableAmount": 194915,
    "prepaidDetails": {
      "prepaidPeriod": 12,
      "prepaidStartMonth": "2026-02",
      "monthlyAmortization": 16243
    },
    "amortizationStatus": {
      "passed": 3,
      "remaining": 9,
      "total": 12,
      "percentageComplete": 25
    },
    "passedAmortizations": [
      {
        "monthYear": "2026-02",
        "voucherNo": "PREPAID/JV/2026/0001",
        "amount": 16243,
        "date": "2026-02-28",
        "transactionId": "TXN_PREPAID_JV_1709164800000_INV-003"
      },
      {
        "monthYear": "2026-03",
        "voucherNo": "PREPAID/JV/2026/0002",
        "amount": 16243,
        "date": "2026-03-31",
        "transactionId": "TXN_PREPAID_JV_1711843200000_INV-003"
      },
      {
        "monthYear": "2026-04",
        "voucherNo": "PREPAID/JV/2026/0003",
        "amount": 16243,
        "date": "2026-04-30",
        "transactionId": "TXN_PREPAID_JV_1714435200000_INV-003"
      }
    ],
    "remainingMonths": [
      "2026-05",
      "2026-06",
      "2026-07",
      "2026-08",
      "2026-09",
      "2026-10",
      "2026-11",
      "2026-12",
      "2027-01"
    ],
    "summary": {
      "totalAmortized": 48729,
      "remainingToAmortize": 146186,
      "nextAmortizationMonth": "2026-05"
    }
  },
  "message": "Amortization status retrieved successfully"
}
```

**Error (404 Not Found):**

```json
{
  "success": false,
  "error": "Invoice Not Found",
  "message": "Prepaid invoice with number INV-003 does not exist"
}
```

**Error (400 Bad Request):**

```json
{
  "success": false,
  "error": "Invalid Invoice",
  "message": "Invoice INV-003 is not a prepaid invoice"
}
```

---

### **8. API TO POST MONTHLY AMORTIZATION JV**

**Endpoint:** `POST /api/invoices/amortization/post`

**Description:** Posts monthly amortization Journal Voucher for a specific month. This creates the JV entry that transfers expense from prepaid asset to monthly expense account.

#### **Request**

**Headers:**

```json
{
  "Authorization": "Bearer {token}",
  "Content-Type": "application/json"
}
```

**Body:**

```json
{
  "invoiceNumber": "INV-003",
  "monthYear": "2026-05"
}
```

**Body Parameters:**

| Parameter     | Type             | Required | Description                                            |
| ------------- | ---------------- | -------- | ------------------------------------------------------ |
| invoiceNumber | String           | Yes      | Unique invoice number                                  |
| monthYear     | String (YYYY-MM) | Yes      | Month for which to post amortization (format: YYYY-MM) |

#### **Backend Processing Flow:**

1. **Validate Invoice and Month**
   - Check invoice exists and is prepaid type
   - Verify month is within prepaid period range
   - Check if amortization for this month already exists (prevent duplicate)

2. **Retrieve Prepaid Details**
   - Get taxable amount, prepaid period, monthly amortization amount
   - Verify invoice has been approved by AM

3. **Create Journal Voucher Transaction**
   - Generate voucher number: `PREPAID/JV/{Year}/{sequence}` (e.g., PREPAID/JV/2026/0004)
   - Create transaction with 2 entries:
     - **Entry 1 (Debit):** X2001004 UNIFORM EXPENSE - Monthly Amortization Amount
     - **Entry 2 (Credit):** A3005001 UNIFORM EXPENSE (Prepaid) - Monthly Amortization Amount

4. **Post Transaction**
   - Validate transaction balance (Total Debit = Total Credit)
   - Save transaction to `transactions` localStorage with monthYear reference
   - Update ledger balances in `chartOfAccounts`

5. **Track Amortization Progress**
   - Increment amortization count for this invoice
   - Calculate remaining amortizations

#### **Response**

**Success (200 OK):**

```json
{
  "success": true,
  "data": {
    "invoiceNumber": "INV-003",
    "monthYear": "2026-05",
    "voucherNo": "PREPAID/JV/2026/0004",
    "transactionId": "TXN_PREPAID_JV_1717027200000_INV-003",
    "amount": 16243,
    "glEntries": [
      {
        "lineNo": 1,
        "glCode": "X2001004",
        "glName": "UNIFORM EXPENSE",
        "debit": 16243,
        "credit": 0,
        "narration": "Monthly amortization for Prepaid Uniform - Invoice INV-003 - May 2026"
      },
      {
        "lineNo": 2,
        "glCode": "A3005001",
        "glName": "UNIFORM EXPENSE",
        "debit": 0,
        "credit": 16243,
        "narration": "Monthly amortization for Prepaid Uniform - Invoice INV-003 - May 2026"
      }
    ],
    "amortizationStatus": {
      "passed": 4,
      "remaining": 8,
      "total": 12,
      "percentageComplete": 33.33
    },
    "summary": {
      "totalAmortized": 64972,
      "remainingToAmortize": 129943,
      "nextAmortizationMonth": "2026-06"
    }
  },
  "message": "Monthly amortization of ₹16,243 posted for May 2026"
}
```

**Error (400 Bad Request - Duplicate):**

```json
{
  "success": false,
  "error": "Duplicate Amortization",
  "message": "Monthly amortization for 2026-05 already exists for this invoice"
}
```

**Error (400 Bad Request - Invalid Month):**

```json
{
  "success": false,
  "error": "Invalid Month",
  "message": "Month 2026-05 is outside the prepaid period (2026-02 to 2027-01)"
}
```

**Error (404 Not Found):**

```json
{
  "success": false,
  "error": "Invoice Not Found",
  "message": "Prepaid invoice with number INV-003 does not exist"
}
```

**Error (500 Internal Server Error):**

```json
{
  "success": false,
  "error": "JV Posting Failed",
  "message": "Failed to process monthly amortization: Database connection error"
}
```

---

### **9. API TO GET AVAILABLE MONTHS FOR AMORTIZATION**

**Endpoint:** `GET /api/invoices/amortization/available-months/:invoiceNumber`

**Description:** Retrieves list of months that are available for amortization (not yet posted) for a specific prepaid invoice.

#### **Request**

**Headers:**

```json
{
  "Authorization": "Bearer {token}",
  "Content-Type": "application/json"
}
```

**Path Parameters:**

| Parameter     | Type   | Required | Description           |
| ------------- | ------ | -------- | --------------------- |
| invoiceNumber | String | Yes      | Unique invoice number |

**Example Request:**

```
GET /api/invoices/amortization/available-months/INV-003
```

#### **Response**

**Success (200 OK):**

```json
{
  "success": true,
  "data": {
    "invoiceNumber": "INV-003",
    "prepaidPeriod": 12,
    "prepaidStartMonth": "2026-02",
    "availableMonths": [
      {
        "value": "2026-05",
        "label": "May 2026",
        "isAvailable": true,
        "status": "Not Posted"
      },
      {
        "value": "2026-06",
        "label": "Jun 2026",
        "isAvailable": true,
        "status": "Not Posted"
      },
      {
        "value": "2026-07",
        "label": "Jul 2026",
        "isAvailable": true,
        "status": "Not Posted"
      },
      {
        "value": "2026-08",
        "label": "Aug 2026",
        "isAvailable": true,
        "status": "Not Posted"
      },
      {
        "value": "2026-09",
        "label": "Sep 2026",
        "isAvailable": true,
        "status": "Not Posted"
      },
      {
        "value": "2026-10",
        "label": "Oct 2026",
        "isAvailable": true,
        "status": "Not Posted"
      },
      {
        "value": "2026-11",
        "label": "Nov 2026",
        "isAvailable": true,
        "status": "Not Posted"
      },
      {
        "value": "2026-12",
        "label": "Dec 2026",
        "isAvailable": true,
        "status": "Not Posted"
      },
      {
        "value": "2027-01",
        "label": "Jan 2027",
        "isAvailable": true,
        "status": "Not Posted"
      }
    ],
    "totalAvailable": 9,
    "nextRecommendedMonth": "2026-05"
  },
  "message": "Available amortization months retrieved successfully"
}
```

**Error (404 Not Found):**

```json
{
  "success": false,
  "error": "Invoice Not Found",
  "message": "Prepaid invoice with number INV-003 does not exist"
}
```

---

### **10. API TO VIEW PURCHASE VOUCHER DETAILS**

**Endpoint:** `GET /api/invoices/purchase-voucher/:invoiceNumber`

**Description:** Retrieves Purchase Voucher details for a specific Prepaid Uniform invoice showing initial GL posting.

#### **Request**

**Headers:**

```json
{
  "Authorization": "Bearer {token}",
  "Content-Type": "application/json"
}
```

**Path Parameters:**

| Parameter     | Type   | Required | Description           |
| ------------- | ------ | -------- | --------------------- |
| invoiceNumber | String | Yes      | Unique invoice number |

**Example Request:**

```
GET /api/invoices/purchase-voucher/INV-003
```

#### **Response**

**Success (200 OK):**

```json
{
  "success": true,
  "data": {
    "invoiceNumber": "INV-003",
    "vendorName": "Delta Solutions",
    "voucherNo": "PREPAID/PUR/2026/0001",
    "voucherType": "Purchase Voucher",
    "date": "2026-02-04",
    "totalAmount": 230000,
    "vendorGLCode": "L2005_VEN_003_Delta_Solutions",
    "breakdown": {
      "taxable": 194915,
      "cgst": 17542,
      "sgst": 17543,
      "total": 230000,
      "gstRate": 18
    },
    "glEntries": [
      {
        "lineNo": 1,
        "glCode": "A3005001",
        "glName": "UNIFORM EXPENSE",
        "debit": 194915,
        "credit": 0,
        "narration": "Prepaid Uniform purchase - Delta Solutions",
        "costCenter": "Operations",
        "prepaidPeriod": 12,
        "prepaidStartMonth": "2026-02"
      },
      {
        "lineNo": 2,
        "glCode": "A3007001001",
        "glName": "CGST Input",
        "debit": 17542,
        "credit": 0,
        "narration": "CGST @9% on Prepaid Uniform"
      },
      {
        "lineNo": 3,
        "glCode": "A3007001002",
        "glName": "SGST Input",
        "debit": 17543,
        "credit": 0,
        "narration": "SGST @9% on Prepaid Uniform"
      },
      {
        "lineNo": 4,
        "glCode": "L2005_VEN_003_Delta_Solutions",
        "glName": "VENDOR - Delta Solutions",
        "debit": 0,
        "credit": 230000,
        "narration": "Invoice INV-003 - Prepaid Uniform"
      }
    ],
    "prepaidDetails": {
      "prepaidPeriod": 12,
      "prepaidStartMonth": "2026-02",
      "monthlyAmortization": 16243,
      "note": "Base amount of ₹194,915 will be amortized over 12 months starting from Feb 2026. Monthly amortization: ₹16,243. GST is claimed immediately and not amortized."
    }
  },
  "message": "Purchase Voucher details retrieved successfully"
}
```

**Error (404 Not Found):**

```json
{
  "success": false,
  "error": "Voucher Not Found",
  "message": "Purchase Voucher not found for invoice INV-003"
}
```

---

### **11. API TO VIEW JOURNAL VOUCHER PREVIEW**

**Endpoint:** `GET /api/invoices/journal-voucher-preview/:invoiceNumber`

**Description:** Retrieves Journal Voucher preview showing the format and GL entries for monthly amortization.

#### **Request**

**Headers:**

```json
{
  "Authorization": "Bearer {token}",
  "Content-Type": "application/json"
}
```

**Path Parameters:**

| Parameter     | Type   | Required | Description           |
| ------------- | ------ | -------- | --------------------- |
| invoiceNumber | String | Yes      | Unique invoice number |

**Example Request:**

```
GET /api/invoices/journal-voucher-preview/INV-003
```

#### **Response**

**Success (200 OK):**

```json
{
  "success": true,
  "data": {
    "invoiceNumber": "INV-003",
    "vendorName": "Delta Solutions",
    "voucherType": "Journal Voucher (Monthly Amortization)",
    "prepaidDetails": {
      "prepaidPeriod": 12,
      "prepaidStartMonth": "2026-02",
      "monthlyAmortization": 16243,
      "totalAmortizableAmount": 194915
    },
    "glEntriesFormat": [
      {
        "lineNo": 1,
        "glCode": "X2001004",
        "glName": "UNIFORM EXPENSE",
        "debit": 16243,
        "credit": 0,
        "narration": "Monthly amortization for Prepaid Uniform - Invoice INV-003"
      },
      {
        "lineNo": 2,
        "glCode": "A3005001",
        "glName": "UNIFORM EXPENSE",
        "debit": 0,
        "credit": 16243,
        "narration": "Monthly amortization for Prepaid Uniform - Invoice INV-003"
      }
    ],
    "description": "This is a preview of the monthly amortization Journal Voucher. Monthly amortization of ₹16,243 will be posted each month for 12 months starting from Feb 2026 until the prepaid asset is fully amortized.",
    "note": "Monthly amortization JV will be created via button click in the Monthly Amortization modal. GST is NOT included in amortization."
  },
  "message": "Journal Voucher preview retrieved successfully"
}
```

**Error (404 Not Found):**

```json
{
  "success": false,
  "error": "Invoice Not Found",
  "message": "Prepaid invoice with number INV-003 does not exist"
}
```

---

## **PART 4: TRANSACTION & REPORTING**

---

### **12. API TO GET ALL PROCESSED PREPAID UNIFORM INVOICES**

**Endpoint:** `GET /api/invoices/processed`

**Description:** Retrieves all successfully processed Prepaid Uniform invoices with Purchase Voucher posting completed.

#### **Request**

**Headers:**

```json
{
  "Authorization": "Bearer {token}",
  "Content-Type": "application/json"
}
```

**Query Parameters:**

| Parameter          | Type                | Required | Description                                                              |
| ------------------ | ------------------- | -------- | ------------------------------------------------------------------------ |
| type               | String              | No       | Filter by invoice type. Use "Procurement Prepaid"                        |
| vendorName         | String              | No       | Filter by vendor name                                                    |
| fromDate           | String (YYYY-MM-DD) | No       | Filter from date                                                         |
| toDate             | String (YYYY-MM-DD) | No       | Filter to date                                                           |
| amortizationStatus | String              | No       | Filter by amortization status ("complete", "in-progress", "not-started") |
| page               | Integer             | No       | Page number (default: 1)                                                 |
| limit              | Integer             | No       | Records per page (default: 10)                                           |

**Example Request:**

```
GET /api/invoices/processed?type=Procurement Prepaid&amortizationStatus=in-progress&page=1&limit=10
```

#### **Response**

**Success (200 OK):**

```json
{
  "success": true,
  "data": {
    "invoices": [
      {
        "id": "INV-003",
        "invoiceNumber": "INV-003",
        "vendorName": "Delta Solutions",
        "type": "Procurement Prepaid",
        "totalAmount": 230000,
        "accountManagerStatus": "Approved",
        "finalStatus": "GL Posted - Completed",
        "amRemarks": "Prepaid Uniform invoice processed - Period: 12 months",
        "processedByAM": "am1",
        "processedAtAM": "2026-02-04T15:00:00.000Z",
        "purchaseVoucherNo": "PREPAID/PUR/2026/0001",
        "purchaseTransactionId": "TXN_PREPAID_UNIFORM_1707057600000_INV-003",
        "vendorGLCode": "L2005_VEN_003_Delta_Solutions",
        "uniformPrepaidGLCode": "A3005001",
        "uniformPrepaidGLName": "UNIFORM EXPENSE",
        "breakdown": {
          "taxable": 194915,
          "cgst": 17542,
          "sgst": 17543,
          "total": 230000
        },
        "prepaidDetails": {
          "prepaidPeriod": 12,
          "prepaidStartMonth": "2026-02",
          "monthlyAmortization": 16243,
          "taxableAmount": 194915,
          "totalGST": 35085
        },
        "amortizationStatus": {
          "passed": 3,
          "remaining": 9,
          "total": 12,
          "percentageComplete": 25,
          "status": "in-progress"
        }
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalRecords": 28,
      "recordsPerPage": 10
    },
    "summary": {
      "totalProcessedInvoices": 28,
      "totalAmount": 6440000,
      "totalTaxableAmount": 5457627,
      "totalGSTAmount": 982373,
      "byAmortizationStatus": {
        "complete": 10,
        "inProgress": 15,
        "notStarted": 3
      }
    }
  },
  "message": "Processed Prepaid Uniform invoices retrieved successfully"
}
```

**Error (401 Unauthorized):**

```json
{
  "success": false,
  "error": "Unauthorized",
  "message": "Invalid or expired token"
}
```

---

### **13. API TO GET PREPAID UNIFORM EXPENSE REGISTER**

**Endpoint:** `GET /api/prepaid-uniform/register`

**Description:** Retrieves complete Prepaid Uniform expense register with all invoices, amortization schedules, and current status.

#### **Request**

**Headers:**

```json
{
  "Authorization": "Bearer {token}",
  "Content-Type": "application/json"
}
```

**Query Parameters:**

| Parameter          | Type                | Required | Description                                                 |
| ------------------ | ------------------- | -------- | ----------------------------------------------------------- |
| vendorName         | String              | No       | Filter by vendor name                                       |
| fromDate           | String (YYYY-MM-DD) | No       | Filter from purchase date                                   |
| toDate             | String (YYYY-MM-DD) | No       | Filter to purchase date                                     |
| amortizationStatus | String              | No       | Filter by status ("complete", "in-progress", "not-started") |
| page               | Integer             | No       | Page number (default: 1)                                    |
| limit              | Integer             | No       | Records per page (default: 20)                              |

**Example Request:**

```
GET /api/prepaid-uniform/register?amortizationStatus=in-progress&page=1&limit=20
```

#### **Response**

**Success (200 OK):**

```json
{
  "success": true,
  "data": {
    "prepaidExpenses": [
      {
        "invoiceNumber": "INV-003",
        "vendorName": "Delta Solutions",
        "purchaseDate": "2026-02-04",
        "totalAmount": 230000,
        "taxableAmount": 194915,
        "gstAmount": 35085,
        "gstRate": 18,
        "purchaseVoucherNo": "PREPAID/PUR/2026/0001",
        "vendorGLCode": "L2005_VEN_003_Delta_Solutions",
        "prepaidDetails": {
          "prepaidPeriod": 12,
          "prepaidStartMonth": "2026-02",
          "prepaidEndMonth": "2027-01",
          "monthlyAmortization": 16243
        },
        "amortizationStatus": {
          "passed": 3,
          "remaining": 9,
          "total": 12,
          "percentageComplete": 25,
          "totalAmortized": 48729,
          "remainingToAmortize": 146186,
          "status": "in-progress"
        },
        "recentAmortizations": [
          {
            "monthYear": "2026-04",
            "voucherNo": "PREPAID/JV/2026/0003",
            "amount": 16243,
            "date": "2026-04-30"
          },
          {
            "monthYear": "2026-03",
            "voucherNo": "PREPAID/JV/2026/0002",
            "amount": 16243,
            "date": "2026-03-31"
          },
          {
            "monthYear": "2026-02",
            "voucherNo": "PREPAID/JV/2026/0001",
            "amount": 16243,
            "date": "2026-02-28"
          }
        ],
        "nextAmortizationMonth": "2026-05"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 2,
      "totalRecords": 28,
      "recordsPerPage": 20
    },
    "summary": {
      "totalPrepaidExpenses": 28,
      "totalPrepaidValue": 5457627,
      "totalAmortized": 2186305,
      "totalRemainingToAmortize": 3271322,
      "byStatus": {
        "complete": 10,
        "inProgress": 15,
        "notStarted": 3
      }
    }
  },
  "message": "Prepaid Uniform expense register retrieved successfully"
}
```

**Error (401 Unauthorized):**

```json
{
  "success": false,
  "error": "Unauthorized",
  "message": "Invalid or expired token"
}
```

---

### **14. API TO GET MONTHLY AMORTIZATION REPORT**

**Endpoint:** `GET /api/prepaid-uniform/monthly-report`

**Description:** Retrieves monthly amortization report showing all JV postings for a specific month or date range.

#### **Request**

**Headers:**

```json
{
  "Authorization": "Bearer {token}",
  "Content-Type": "application/json"
}
```

**Query Parameters:**

| Parameter  | Type             | Required | Description                                |
| ---------- | ---------------- | -------- | ------------------------------------------ |
| monthYear  | String (YYYY-MM) | No       | Filter by specific month (format: YYYY-MM) |
| fromMonth  | String (YYYY-MM) | No       | Filter from month                          |
| toMonth    | String (YYYY-MM) | No       | Filter to month                            |
| vendorName | String           | No       | Filter by vendor name                      |
| page       | Integer          | No       | Page number (default: 1)                   |
| limit      | Integer          | No       | Records per page (default: 20)             |

**Example Request:**

```
GET /api/prepaid-uniform/monthly-report?monthYear=2026-04&page=1&limit=20
```

#### **Response**

**Success (200 OK):**

```json
{
  "success": true,
  "data": {
    "month": "2026-04",
    "monthLabel": "April 2026",
    "amortizations": [
      {
        "invoiceNumber": "INV-003",
        "vendorName": "Delta Solutions",
        "voucherNo": "PREPAID/JV/2026/0003",
        "transactionId": "TXN_PREPAID_JV_1714435200000_INV-003",
        "amount": 16243,
        "date": "2026-04-30",
        "glEntries": [
          {
            "glCode": "X2001004",
            "glName": "UNIFORM EXPENSE",
            "debit": 16243,
            "credit": 0
          },
          {
            "glCode": "A3005001",
            "glName": "UNIFORM EXPENSE",
            "debit": 0,
            "credit": 16243
          }
        ]
      },
      {
        "invoiceNumber": "INV-007",
        "vendorName": "ABC Uniforms",
        "voucherNo": "PREPAID/JV/2026/0006",
        "transactionId": "TXN_PREPAID_JV_1714435800000_INV-007",
        "amount": 12500,
        "date": "2026-04-30",
        "glEntries": [
          {
            "glCode": "X2001004",
            "glName": "UNIFORM EXPENSE",
            "debit": 12500,
            "credit": 0
          },
          {
            "glCode": "A3005001",
            "glName": "UNIFORM EXPENSE",
            "debit": 0,
            "credit": 12500
          }
        ]
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalRecords": 2,
      "recordsPerPage": 20
    },
    "summary": {
      "totalAmortizations": 2,
      "totalAmortizationAmount": 28743,
      "totalDebit": 28743,
      "totalCredit": 28743
    }
  },
  "message": "Monthly amortization report for April 2026 retrieved successfully"
}
```

**Error (400 Bad Request):**

```json
{
  "success": false,
  "error": "Invalid Month",
  "message": "Invalid month format. Use YYYY-MM"
}
```

**Error (401 Unauthorized):**

```json
{
  "success": false,
  "error": "Unauthorized",
  "message": "Invalid or expired token"
}
```

---

### **15. API TO GET REJECTED PREPAID UNIFORM INVOICES**

**Endpoint:** `GET /api/invoices/rejected`

**Description:** Retrieves all rejected Prepaid Uniform invoices (rejected by either AE or AM).

#### **Request**

**Headers:**

```json
{
  "Authorization": "Bearer {token}",
  "Content-Type": "application/json"
}
```

**Query Parameters:**

| Parameter  | Type                | Required | Description                                       |
| ---------- | ------------------- | -------- | ------------------------------------------------- |
| type       | String              | No       | Filter by invoice type. Use "Procurement Prepaid" |
| vendorName | String              | No       | Filter by vendor name                             |
| rejectedBy | String              | No       | Filter by who rejected ("AE" or "AM")             |
| fromDate   | String (YYYY-MM-DD) | No       | Filter from date                                  |
| toDate     | String (YYYY-MM-DD) | No       | Filter to date                                    |
| page       | Integer             | No       | Page number (default: 1)                          |
| limit      | Integer             | No       | Records per page (default: 10)                    |

**Example Request:**

```
GET /api/invoices/rejected?type=Procurement Prepaid&rejectedBy=AM&page=1&limit=10
```

#### **Response**

**Success (200 OK):**

```json
{
  "success": true,
  "data": {
    "invoices": [
      {
        "id": "INV-008",
        "invoiceNumber": "INV-008",
        "vendorName": "Delta Solutions",
        "type": "Procurement Prepaid",
        "totalAmount": 230000,
        "accountManagerStatus": "Rejected",
        "finalStatus": "Rejected by Account Manager",
        "status": "Rejected - Return to Vendor",
        "amRemarks": "Vendor GL code mismatch. Please verify vendor details and resubmit.",
        "processedByAM": "am1",
        "processedAtAM": "2026-02-03T15:10:00.000Z",
        "rejectedAtAM": "2026-02-03T15:10:00.000Z"
      },
      {
        "id": "INV-012",
        "invoiceNumber": "INV-012",
        "vendorName": "ABC Uniforms",
        "type": "Procurement Prepaid",
        "totalAmount": 175000,
        "status": "Rejected by AE",
        "processedBy": "ae1",
        "processedAt": "2026-02-02T14:25:00.000Z",
        "rejectedAt": "2026-02-02T14:25:00.000Z",
        "remarks": "Invoice amount does not match with PO. HSN code is incorrect. Please verify and resubmit."
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 2,
      "totalRecords": 12,
      "recordsPerPage": 10
    },
    "summary": {
      "totalRejected": 12,
      "rejectedByAE": 7,
      "rejectedByAM": 5,
      "totalRejectedAmount": 2760000
    }
  },
  "message": "Rejected Prepaid Uniform invoices retrieved successfully"
}
```

**Error (401 Unauthorized):**

```json
{
  "success": false,
  "error": "Unauthorized",
  "message": "Invalid or expired token"
}
```

---

## **APPENDIX A: SAMPLE DATA FLOW**

### **Example 1: Complete Prepaid Uniform Invoice Flow - 12 Month Amortization**

#### **Step 1: Invoice Submission (From Procurement)**

```json
{
  "id": "INV-003",
  "invoiceNumber": "INV-003",
  "vendorName": "Delta Solutions",
  "type": "Procurement Prepaid",
  "totalAmount": 230000,
  "status": "Pending GST Verification",
  "gstRate": 18,
  "hsnCode": "998223",
  "hsnSummary": "Uniform Supply Services",
  "documentUrl": "/public/DxotBTxfHn.png",
  "submittedBy": "procurement",
  "submittedAt": "2026-02-04T10:30:00.000Z",
  "poDocuments": [
    {
      "name": "PO-001",
      "url": "https://example.com/po-001.pdf"
    }
  ]
}
```

#### **Step 2: AE Approval**

```json
POST /api/invoices/ae/approve
{
  "invoiceId": "INV-003",
  "gstRate": 18,
  "hsnCode": "998223",
  "hsnSummary": "Uniform Supply Services - Security Guard Uniforms",
  "remarks": "Invoice verified against PO. All details match."
}
```

**Result:** Invoice status updated to "Approved by AE - Pending AM Review"

#### **Step 3: AM Approval with Prepaid Period Selection**

```json
POST /api/invoices/am/approve-prepaid
{
  "invoiceId": "INV-003",
  "prepaidPeriod": 12,
  "prepaidStartMonth": "2026-02",
  "remarks": "Final approval - Prepaid period set to 12 months"
}
```

**Backend Processing:**

1. **Vendor Ledger Check:**
   - Vendor: "Delta Solutions"
   - Found/Created: L2005_VEN_003_Delta_Solutions

2. **GST Calculation:**
   - Total Amount: ₹230,000
   - GST Rate: 18%
   - Taxable Amount: (230000 × 100) ÷ 118 = ₹194,915
   - Total GST: 230000 - 194915 = ₹35,085
   - CGST (9%): ₹17,542
   - SGST (9%): ₹17,543

3. **Monthly Amortization Calculation:**
   - Prepaid Period: 12 months
   - Monthly Amortization: ₹194,915 ÷ 12 = ₹16,243 (ONLY taxable amount, GST excluded)

4. **Purchase Voucher Generation:**
   - Voucher No: PREPAID/PUR/2026/0001

5. **GL Entries Created (Purchase Voucher):**

| Line      | GL Code                       | GL Name                   | Debit (₹)   | Credit (₹)  |
| --------- | ----------------------------- | ------------------------- | ----------- | ----------- |
| 1         | A3005001                      | UNIFORM EXPENSE (Prepaid) | 194,915     | -           |
| 2         | A3007001001                   | CGST INPUT                | 17,542      | -           |
| 3         | A3007001002                   | SGST INPUT                | 17,543      | -           |
| 4         | L2005_VEN_003_Delta_Solutions | VENDOR - Delta Solutions  | -           | 230,000     |
| **Total** |                               |                           | **230,000** | **230,000** |

**Result:**

- Invoice processed successfully
- Purchase Voucher posted
- Prepaid configuration saved
- Invoice stays in AM dashboard for monthly amortization tracking

#### **Step 4: Monthly Amortization Execution (Month 1 - February 2026)**

```json
POST /api/invoices/amortization/post
{
  "invoiceNumber": "INV-003",
  "monthYear": "2026-02"
}
```

**Backend Processing:**

1. **Validate Month:**
   - Check if within prepaid period (2026-02 to 2027-01)
   - Check if not already posted

2. **Journal Voucher Generation:**
   - Voucher No: PREPAID/JV/2026/0001

3. **GL Entries Created (Journal Voucher - Monthly Amortization):**

| Line      | GL Code  | GL Name                   | Debit (₹)  | Credit (₹) |
| --------- | -------- | ------------------------- | ---------- | ---------- |
| 1         | X2001004 | UNIFORM EXPENSE           | 16,243     | -          |
| 2         | A3005001 | UNIFORM EXPENSE (Prepaid) | -          | 16,243     |
| **Total** |          |                           | **16,243** | **16,243** |

**Result:**

- Monthly amortization JV posted
- Expense recognized for February 2026
- Prepaid asset reduced by ₹16,243
- Amortization count: 1 passed, 11 remaining

#### **Step 5: Subsequent Monthly Amortizations (Month 2 to Month 12)**

Same process repeats for each month until all 12 months are complete:

- March 2026: PREPAID/JV/2026/0002
- April 2026: PREPAID/JV/2026/0003
- ...
- January 2027: PREPAID/JV/2026/0012 (Final amortization)

---

### **Example 2: GST Calculation and Amortization Breakdown**

| Scenario | Total Amount | GST Rate | Taxable Amount | Total GST | CGST    | SGST    | Prepaid Period | Monthly Amortization |
| -------- | ------------ | -------- | -------------- | --------- | ------- | ------- | -------------- | -------------------- |
| 1        | ₹118,000     | 18%      | ₹100,000       | ₹18,000   | ₹9,000  | ₹9,000  | 12 months      | ₹8,333               |
| 2        | ₹230,000     | 18%      | ₹194,915       | ₹35,085   | ₹17,542 | ₹17,543 | 12 months      | ₹16,243              |
| 3        | ₹56,000      | 12%      | ₹50,000        | ₹6,000    | ₹3,000  | ₹3,000  | 6 months       | ₹8,333               |
| 4        | ₹175,000     | 18%      | ₹148,305       | ₹26,695   | ₹13,347 | ₹13,348 | 24 months      | ₹6,179               |

**Key Points:**

- GST is NEVER amortized (claimed immediately as input credit)
- Only taxable (base) amount is spread over prepaid period
- Monthly amortization = Taxable Amount ÷ Prepaid Period (in months)

---

### **Example 3: Amortization Schedule for 12-Month Period**

**Invoice:** INV-003 | **Vendor:** Delta Solutions | **Amount:** ₹230,000 | **Taxable:** ₹194,915 | **Period:** 12 months

| Month     | Month/Year | Monthly JV Amount | Cumulative Amortized | Remaining Prepaid Asset | JV Voucher No        | Status          |
| --------- | ---------- | ----------------- | -------------------- | ----------------------- | -------------------- | --------------- |
| 1         | Feb 2026   | ₹16,243           | ₹16,243              | ₹178,672                | PREPAID/JV/2026/0001 | Posted          |
| 2         | Mar 2026   | ₹16,243           | ₹32,486              | ₹162,429                | PREPAID/JV/2026/0002 | Posted          |
| 3         | Apr 2026   | ₹16,243           | ₹48,729              | ₹146,186                | PREPAID/JV/2026/0003 | Posted          |
| 4         | May 2026   | ₹16,243           | ₹64,972              | ₹129,943                | PREPAID/JV/2026/0004 | Pending         |
| 5         | Jun 2026   | ₹16,243           | ₹81,215              | ₹113,700                | -                    | Pending         |
| 6         | Jul 2026   | ₹16,243           | ₹97,458              | ₹97,457                 | -                    | Pending         |
| 7         | Aug 2026   | ₹16,243           | ₹113,701             | ₹81,214                 | -                    | Pending         |
| 8         | Sep 2026   | ₹16,243           | ₹129,944             | ₹64,971                 | -                    | Pending         |
| 9         | Oct 2026   | ₹16,243           | ₹146,187             | ₹48,728                 | -                    | Pending         |
| 10        | Nov 2026   | ₹16,243           | ₹162,430             | ₹32,485                 | -                    | Pending         |
| 11        | Dec 2026   | ₹16,243           | ₹178,673             | ₹16,242                 | -                    | Pending         |
| 12        | Jan 2027   | ₹16,242           | ₹194,915             | ₹0                      | -                    | Pending         |
| **Total** |            | **₹194,915**      |                      |                         |                      | **3/12 Posted** |

**Progress:** 25% Complete (3 out of 12 months amortized)

---

## **APPENDIX B: ERROR CODES REFERENCE**

| Error Code | HTTP Status | Description                   | Resolution                                 |
| ---------- | ----------- | ----------------------------- | ------------------------------------------ |
| AUTH_001   | 401         | Invalid or expired token      | Re-authenticate and obtain new token       |
| AUTH_002   | 403         | Insufficient permissions      | Contact admin for role assignment          |
| VAL_001    | 400         | Missing required fields       | Check request body for required parameters |
| VAL_002    | 400         | Invalid GST rate              | GST rate must be 5, 12, 18, or 28          |
| VAL_003    | 400         | Invalid prepaid period        | Period must be 6, 12, 18, or 24 months     |
| VAL_004    | 400         | Invalid month format          | Use YYYY-MM format for month               |
| VAL_005    | 400         | Empty rejection remarks       | Provide mandatory rejection reason         |
| INV_001    | 404         | Invoice not found             | Verify invoice ID/number exists            |
| INV_002    | 400         | Invoice already processed     | Cannot modify processed invoice            |
| INV_003    | 400         | Invoice not in correct status | Check workflow status before operation     |
| AMOR_001   | 400         | Duplicate amortization        | Amortization for this month already posted |
| AMOR_002   | 400         | Invalid amortization month    | Month outside prepaid period range         |
| AMOR_003   | 400         | All amortizations complete    | No remaining months to amortize            |
| VEN_001    | 404         | Vendor not found              | Vendor must be registered in system        |
| VEN_002    | 400         | Duplicate vendor ledger       | Vendor ledger already exists               |
| GL_001     | 500         | GL posting failed             | Check transaction balance validation       |
| GL_002     | 500         | Ledger creation failed        | Database error - contact support           |
| SYS_001    | 500         | Internal server error         | Unexpected error - contact support         |

---

## **APPENDIX C: BUSINESS RULES**

### **1. Invoice Approval Rules**

| Rule   | Description                                                   | Enforced By            |
| ------ | ------------------------------------------------------------- | ---------------------- |
| BR-001 | All Prepaid Uniform invoices must be reviewed by AE before AM | System workflow        |
| BR-002 | Rejection remarks are mandatory for both AE and AM            | API validation         |
| BR-003 | Invoice amount must match PO amount (within tolerance)        | AE manual verification |
| BR-004 | Prepaid period must be 6, 12, 18, or 24 months only           | System validation      |
| BR-005 | GST rate must be valid rate (5, 12, 18, 28)                   | API validation         |

### **2. GL Posting Rules**

| Rule   | Description                                            | Enforced By          |
| ------ | ------------------------------------------------------ | -------------------- |
| BR-101 | Total Debit must equal Total Credit in all vouchers    | System validation    |
| BR-102 | Vendor ledger must exist before posting                | System auto-creation |
| BR-103 | GST is claimed immediately, NOT amortized              | Calculation logic    |
| BR-104 | Only taxable amount is subject to amortization         | Calculation logic    |
| BR-105 | Taxable amount + GST = Total invoice amount            | Math validation      |
| BR-106 | Monthly amortization = Taxable Amount ÷ Prepaid Period | Formula validation   |

### **3. Amortization Rules**

| Rule   | Description                                              | Enforced By       |
| ------ | -------------------------------------------------------- | ----------------- |
| BR-201 | Monthly amortization cannot exceed prepaid period        | System validation |
| BR-202 | Duplicate monthly amortization not allowed               | Duplicate check   |
| BR-203 | Amortization must be within prepaid period range         | Date validation   |
| BR-204 | Final month amortization may differ for rounding         | Calculation logic |
| BR-205 | GST input credit is NOT included in monthly amortization | Business logic    |

### **4. Vendor Ledger Rules**

| Rule   | Description                                        | Enforced By         |
| ------ | -------------------------------------------------- | ------------------- |
| BR-301 | All vendor ledgers created under L2005 parent      | System design       |
| BR-302 | Vendor GL code format: L2005*VEN*{counter}\_{name} | Code generation     |
| BR-303 | Vendor name must be unique                         | Duplicate check     |
| BR-304 | Opening balance for new vendor = 0                 | System default      |
| BR-305 | Credit balance increases on purchase posting       | Ledger update logic |

### **5. Prepaid Period Rules**

| Rule   | Description                                                  | Enforced By           |
| ------ | ------------------------------------------------------------ | --------------------- |
| BR-401 | Prepaid period selection is mandatory on AM approval         | Modal validation      |
| BR-402 | Start month cannot be in the past                            | Date validation       |
| BR-403 | Once set, prepaid period cannot be changed                   | System lock           |
| BR-404 | Monthly JVs must be posted chronologically                   | Sequential validation |
| BR-405 | Invoice remains in AM queue until all amortizations complete | Dashboard logic       |

---

## **DOCUMENT REVISION HISTORY**

| Version | Date       | Author         | Changes                                                                                    |
| ------- | ---------- | -------------- | ------------------------------------------------------------------------------------------ |
| 1.0     | 2026-02-04 | System Analyst | Initial API specification document created for Prepaid Entry (Uniform Procurement) process |

---

**END OF DOCUMENT**

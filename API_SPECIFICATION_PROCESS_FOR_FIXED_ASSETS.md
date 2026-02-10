# **API SPECIFICATION – PROCESS FOR FIXED ASSETS**

---

## **TABLE OF CONTENTS**

1. [Overview](#1-overview)
2. [Workflow Summary](#2-workflow-summary)
3. [GL Code Structure](#3-gl-code-structure)
4. [API Endpoints](#4-api-endpoints)
   - [Part 1: Account Executive Review](#part-1-account-executive-review)
   - [Part 2: Account Manager Final Approval](#part-2-account-manager-final-approval)
   - [Part 3: Vendor Ledger Management](#part-3-vendor-ledger-management)
   - [Part 4: Transaction & Reporting](#part-4-transaction--reporting)

---

## **1. OVERVIEW**

### **Objective**
To ensure accurate booking of Fixed Asset purchases by validating vendor invoices against approved Purchase Orders. This process enables financial control, ensures compliance with procurement protocols, and automates the entry of fixed assets into the accounting system upon approval.

### **Process Flow**
1. **Account Executive (AE)**: Reviews and approves/rejects Fixed Asset invoices from vendors
2. **Account Manager (AM)**: Final approval and automatic GL posting with Fixed Asset categorization
3. **System**: Auto-creates vendor ledgers and posts accounting entries upon approval

### **Key Features**
- Two-level invoice approval workflow (AE → AM)
- Automatic Fixed Asset ledger determination based on asset category
- Auto-creation of vendor ledger under L2005 (Sundry Creditors)
- Automatic GL posting with GST calculation (CGST/SGST split)
- Fixed Asset tracking with asset tags, serial numbers, warranty, and location
- Voucher number generation with year-wise sequence

---

## **2. WORKFLOW SUMMARY**

### **Step 1: Account Executive Review**
1. AE logs into the portal and navigates to the Invoice Approval section
2. AE can see invoices with Type = "Fixed Asset"
3. AE can filter invoices by Vendor Name (dropdown from vendor master)
4. AE reviews each invoice against the corresponding Purchase Order
5. AE has two options:
   - **Approve**: Invoice is forwarded to Account Manager for final approval
   - **Reject**: Invoice is sent back to vendor with rejection remarks

### **Step 2: Account Manager Final Approval**
1. After AE approval, invoice appears in Account Manager Dashboard
2. AM sees a table view of all AE-approved invoices
3. AM can filter invoices by:
   - Invoice Number
   - Vendor Name
   - Date
4. AM reviews the request and either:
   - **Rejects** (with mandatory reason): Sent back to vendor
   - **Approves**: 
     - Fixed Asset entry is processed in the system
     - Saved in the appropriate Fixed Asset GL code based on asset category
     - Purchase booking process is completed

### **GL Entries (Auto-Posted on AM Approval)**

| Sr No | Account Type | GL Code | GL Name | Debit (₹) | Credit (₹) | Description |
|-------|-------------|---------|---------|-----------|------------|-------------|
| 1 | Fixed Asset | A1{xxx} | FA {Category Name} | Base Amount | - | Asset Category-based GL (e.g., A1001 FA COMPUTERS) |
| 2 | GST Input | A3007001001 | CGST INPUT | CGST Amount | - | Calculated based on GST % (half of total GST) |
| 3 | GST Input | A3007001002 | SGST INPUT | SGST Amount | - | Calculated based on GST % (half of total GST) |
| 4 | Sundry Creditor | L2005_VEN_{code} | VENDOR - {Vendor Name} | - | Total Invoice Amount | Vendor-specific payable ledger |

**Parent GL Codes:**
- A1: Fixed Asset (Parent)
- A3007001: GST Input (Parent)
- L2005: Sundry Creditors (Parent)

---

## **3. GL CODE STRUCTURE**

### **3.1 Fixed Asset GL Codes (Auto-Selected Based on Asset Category)**

| Asset Category | GL Code | GL Name | Parent Code |
|----------------|---------|---------|-------------|
| Computer / Computers / Laptop / Desktop | A1001 | FA COMPUTERS | A1 |
| Furniture / Furniture & Fixtures / Furniture and Fixtures | A1002 | FA FURNITURE & FIXTURES | A1 |
| Motor Car / Motor Cars / Vehicle / Vehicles | A1003 | FA MOTOR CARS | A1 |
| Software / Softwares | A1004 | FA SOFTWARES | A1 |
| Office Equipment / Office Equipments / Equipment | A1005 | FA OFFICE EQUIPMENTS | A1 |
| Building / Premises / Building & Premises / Building and Premises | A1006 | FA BUILDING & PREMISES | A1 |
| Machinery / Machineries / Machine | A1007 | FA MACHINERIES | A1 |

**Default Fallback:** If asset category is not recognized, system defaults to **A1001 (FA COMPUTERS)**

### **3.2 GST Input GL Codes**

| GL Code | GL Name | Parent Code | Description |
|---------|---------|-------------|-------------|
| A3007001001 | CGST INPUT | A3007001 | Central GST Input Credit (50% of total GST) |
| A3007001002 | SGST INPUT | A3007001 | State GST Input Credit (50% of total GST) |

### **3.3 Vendor Ledger GL Code (Auto-Created)**

**Format:** `L2005_VEN_{counter}_{VendorName}`

**Example:**
- `L2005_VEN_001_ABC_Enterprises`
- `L2005_VEN_002_XYZ_Pvt_Ltd`

**Parent Code:** L2005 (SUNDRY CREDITORS)

**Note:** 
- System checks if vendor ledger already exists before creating a new one
- If vendor ledger exists, it reuses the same GL code
- Vendor ledger name format: `VENDOR - {Vendor Name}`

---

## **4. API ENDPOINTS**

---

## **PART 1: ACCOUNT EXECUTIVE REVIEW**

---

### **1. API TO FETCH ALL PENDING FIXED ASSET INVOICES FOR AE**

**Endpoint:** `GET /api/invoices/ae/pending`

**Description:** Retrieves all Fixed Asset invoices pending AE review (submitted from Procurement).

#### **Request**

**Headers:**
```json
{
  "Authorization": "Bearer {token}",
  "Content-Type": "application/json"
}
```

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| type | String | No | Filter by invoice type. Use "Fixed Asset" to get only Fixed Asset invoices |
| vendorName | String | No | Filter by vendor name (partial match) |
| invoiceNumber | String | No | Filter by invoice number (partial match) |
| date | String (YYYY-MM-DD) | No | Filter by submission date |
| page | Integer | No | Page number (default: 1) |
| limit | Integer | No | Records per page (default: 5) |

**Example Request:**
```
GET /api/invoices/ae/pending?type=Fixed Asset&page=1&limit=5
```

#### **Response**

**Success (200 OK):**
```json
{
  "success": true,
  "data": {
    "invoices": [
      {
        "id": "INV-002",
        "invoiceNumber": "INV-002",
        "vendorName": "XYZ Pvt Ltd",
        "type": "Fixed Asset",
        "totalAmount": 82000,
        "status": "Pending GST Verification",
        "gstRate": 12,
        "hsnCode": "847130",
        "hsnSummary": "Computer Systems",
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
        "assetDetails": {
          "assetCategory": "Computer",
          "assetTag": "FA-2024-001",
          "serialNumber": "SN-AX2390",
          "warranty": "3 Years",
          "location": "Main Office, Pune"
        },
        "vendor_gl_mappings": {
          "expense_gl_code": "X1001004001",
          "payable_gl_code": "L2005_VEN_001_XYZ_Pvt_Ltd",
          "vendor_number": "001"
        }
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalRecords": 12,
      "recordsPerPage": 5
    }
  },
  "message": "Fixed Asset invoices retrieved successfully"
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

### **2. API TO GET VENDOR LIST FOR FILTER DROPDOWN**

**Endpoint:** `GET /api/vendors/list`

**Description:** Retrieves list of all vendors for dropdown filter in AE dashboard.

#### **Request**

**Headers:**
```json
{
  "Authorization": "Bearer {token}",
  "Content-Type": "application/json"
}
```

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| search | String | No | Search vendor by name (partial match) |
| active | Boolean | No | Filter only active vendors (default: true) |

**Example Request:**
```
GET /api/vendors/list?active=true
```

#### **Response**

**Success (200 OK):**
```json
{
  "success": true,
  "data": {
    "vendors": [
      {
        "vendor_id": "VEND_001",
        "vendor_name": "ABC Enterprises",
        "vendor_number": "001",
        "payable_gl_code": "L2005_VEN_001_ABC_Enterprises",
        "total_invoices": 5,
        "total_amount": 425000,
        "created_date": "2026-01-15T08:00:00.000Z"
      },
      {
        "vendor_id": "VEND_002",
        "vendor_name": "XYZ Pvt Ltd",
        "vendor_number": "002",
        "payable_gl_code": "L2005_VEN_002_XYZ_Pvt_Ltd",
        "total_invoices": 3,
        "total_amount": 256000,
        "created_date": "2026-01-20T09:15:00.000Z"
      }
    ],
    "count": 2
  },
  "message": "Vendor list retrieved successfully"
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

### **3. API TO APPROVE FIXED ASSET INVOICE (BY AE)**

**Endpoint:** `POST /api/invoices/ae/approve`

**Description:** Account Executive approves a Fixed Asset invoice and forwards it to Account Manager for final approval.

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
  "invoiceId": "INV-002",
  "gstRate": 12,
  "hsnCode": "847130",
  "hsnSummary": "Computer Systems - Desktop with Keyboard and Mouse",
  "remarks": "Invoice verified against PO. All details match."
}
```

**Body Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| invoiceId | String | Yes | Unique invoice ID |
| gstRate | Number | Yes | GST rate percentage (e.g., 5, 12, 18) |
| hsnCode | String | Yes | HSN/SAC code from invoice |
| hsnSummary | String | No | Description of HSN code |
| remarks | String | No | AE's approval remarks |

#### **Response**

**Success (200 OK):**
```json
{
  "success": true,
  "data": {
    "invoiceId": "INV-002",
    "invoiceNumber": "INV-002",
    "status": "Approved by AE - Pending AM Review",
    "processedBy": "ae1",
    "processedAt": "2026-02-04T14:20:00.000Z",
    "nextApprover": "Account Manager",
    "vendorName": "XYZ Pvt Ltd",
    "amount": 82000
  },
  "message": "Invoice INV-002 approved and sent to Account Manager for final processing!"
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
  "message": "Invoice with ID INV-002 does not exist"
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

### **4. API TO REJECT FIXED ASSET INVOICE (BY AE)**

**Endpoint:** `POST /api/invoices/ae/reject`

**Description:** Account Executive rejects a Fixed Asset invoice and sends it back to vendor with rejection remarks.

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
  "invoiceId": "INV-002",
  "remarks": "Invoice amount does not match with PO. GST calculation is incorrect. Please resubmit with correct details."
}
```

**Body Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| invoiceId | String | Yes | Unique invoice ID |
| remarks | String | Yes | Mandatory rejection reason/remarks (must not be empty) |

#### **Response**

**Success (200 OK):**
```json
{
  "success": true,
  "data": {
    "invoiceId": "INV-002",
    "invoiceNumber": "INV-002",
    "status": "Rejected by AE",
    "processedBy": "ae1",
    "processedAt": "2026-02-04T14:25:00.000Z",
    "rejectedAt": "2026-02-04T14:25:00.000Z",
    "remarks": "Invoice amount does not match with PO. GST calculation is incorrect. Please resubmit with correct details.",
    "vendorName": "XYZ Pvt Ltd",
    "amount": 82000
  },
  "message": "Invoice INV-002 rejected and sent back to vendor with remarks."
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
  "message": "Invoice with ID INV-002 does not exist"
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

## **PART 2: ACCOUNT MANAGER FINAL APPROVAL**

---

### **5. API TO FETCH ALL PENDING FIXED ASSET INVOICES FOR AM**

**Endpoint:** `GET /api/invoices/am/pending`

**Description:** Retrieves all Fixed Asset invoices approved by AE and pending final approval from Account Manager.

#### **Request**

**Headers:**
```json
{
  "Authorization": "Bearer {token}",
  "Content-Type": "application/json"
}
```

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| type | String | No | Filter by invoice type. Use "Fixed Asset" |
| vendorName | String | No | Filter by vendor name (partial match) |
| invoiceNumber | String | No | Filter by invoice number (partial match) |
| date | String (YYYY-MM-DD) | No | Filter by submission date |
| page | Integer | No | Page number (default: 1) |
| limit | Integer | No | Records per page (default: 5) |

**Example Request:**
```
GET /api/invoices/am/pending?type=Fixed Asset&page=1&limit=5
```

#### **Response**

**Success (200 OK):**
```json
{
  "success": true,
  "data": {
    "invoices": [
      {
        "id": "INV-002",
        "invoiceNumber": "INV-002",
        "vendorName": "XYZ Pvt Ltd",
        "type": "Fixed Asset",
        "totalAmount": 82000,
        "status": "Approved by AE - Pending AM Review",
        "gstRate": 12,
        "hsnCode": "847130",
        "hsnSummary": "Computer Systems - Desktop with Keyboard and Mouse",
        "documentUrl": "/public/DxotBTxfHn.png",
        "submittedBy": "procurement",
        "submittedAt": "2026-02-04T10:30:00.000Z",
        "processedBy": "ae1",
        "processedAt": "2026-02-04T14:20:00.000Z",
        "remarks": "Invoice verified against PO. All details match.",
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
        "assetDetails": {
          "assetCategory": "Computer",
          "assetTag": "FA-2024-001",
          "serialNumber": "SN-AX2390",
          "warranty": "3 Years",
          "location": "Main Office, Pune"
        },
        "accountManagerStatus": null,
        "finalStatus": null
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 2,
      "totalRecords": 8,
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

### **6. API TO APPROVE FIXED ASSET INVOICE AND POST GL ENTRIES (BY AM)**

**Endpoint:** `POST /api/invoices/am/approve`

**Description:** Account Manager gives final approval to Fixed Asset invoice. System automatically posts GL entries and creates/updates vendor ledger.

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
  "invoiceId": "INV-002",
  "remarks": "Final approval - All documents verified"
}
```

**Body Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| invoiceId | String | Yes | Unique invoice ID |
| remarks | String | No | AM's approval remarks |

#### **Backend Processing Flow:**

1. **Validate Invoice Data**
   - Check invoice exists and is in "Approved by AE" status
   - Validate vendor name, amount, GST rate

2. **Determine Fixed Asset GL Code**
   - Extract asset category from `assetDetails.assetCategory`
   - Map category to Fixed Asset GL Code (A1001 to A1007)
   - Default to A1001 (FA COMPUTERS) if category not recognized

3. **Vendor Ledger Management**
   - Check if vendor ledger exists under L2005
   - If exists: Retrieve existing GL code
   - If not exists: Auto-create new vendor ledger with format `L2005_VEN_{counter}_{VendorName}`

4. **GST Calculation**
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

5. **Create Purchase Voucher Transaction**
   - Generate voucher number: `FA/PUR/{Year}/{sequence}` (e.g., FA/PUR/2026/0001)
   - Create transaction with 4 entries:
     - **Entry 1 (Debit):** Fixed Asset GL - Taxable Amount
     - **Entry 2 (Debit):** CGST Input (A3007001001) - CGST Amount
     - **Entry 3 (Debit):** SGST Input (A3007001002) - SGST Amount
     - **Entry 4 (Credit):** Vendor GL (L2005_VEN_xxx) - Total Invoice Amount

6. **Post Transaction**
   - Validate transaction balance (Total Debit = Total Credit)
   - Save transaction to `transactions` localStorage
   - Update ledger balances in `chartOfAccounts`

7. **Update Invoice Status**
   - Move invoice from `pending_am_invoices` to `processed_invoices`
   - Mark status as "GL Posted - Completed"

#### **Response**

**Success (200 OK):**
```json
{
  "success": true,
  "data": {
    "invoiceId": "INV-002",
    "invoiceNumber": "INV-002",
    "status": "GL Posted - Completed",
    "processedByAM": "am1",
    "processedAtAM": "2026-02-04T15:00:00.000Z",
    "vendorName": "XYZ Pvt Ltd",
    "amount": 82000,
    "voucherNo": "FA/PUR/2026/0001",
    "transactionId": "TXN_FA_1707057600000_INV-002",
    "assetCategory": "Computer",
    "fixedAssetGLCode": "A1001",
    "fixedAssetGLName": "FA COMPUTERS",
    "vendorGLCode": "L2005_VEN_002_XYZ_Pvt_Ltd",
    "breakdown": {
      "taxable": 73214,
      "cgst": 4393,
      "sgst": 4393,
      "total": 82000
    },
    "glEntries": [
      {
        "lineNo": 1,
        "glCode": "A1001",
        "glName": "FA COMPUTERS",
        "debit": 73214,
        "credit": 0,
        "narration": "Fixed Asset purchase - XYZ Pvt Ltd"
      },
      {
        "lineNo": 2,
        "glCode": "A3007001001",
        "glName": "CGST Input",
        "debit": 4393,
        "credit": 0,
        "narration": "CGST @6% on Fixed Asset"
      },
      {
        "lineNo": 3,
        "glCode": "A3007001002",
        "glName": "SGST Input",
        "debit": 4393,
        "credit": 0,
        "narration": "SGST @6% on Fixed Asset"
      },
      {
        "lineNo": 4,
        "glCode": "L2005_VEN_002_XYZ_Pvt_Ltd",
        "glName": "VENDOR - XYZ Pvt Ltd",
        "debit": 0,
        "credit": 82000,
        "narration": "Invoice INV-002 - Fixed Asset"
      }
    ],
    "assetDetails": {
      "assetCategory": "Computer",
      "assetTag": "FA-2024-001",
      "serialNumber": "SN-AX2390",
      "warranty": "3 Years",
      "location": "Main Office, Pune"
    }
  },
  "message": "Fixed Asset invoice INV-002 approved and GL entries posted successfully!"
}
```

**Error (400 Bad Request - Validation):**
```json
{
  "success": false,
  "error": "Validation Error",
  "message": "Invalid GST rate"
}
```

**Error (400 Bad Request - Transaction Balance):**
```json
{
  "success": false,
  "error": "Transaction Validation Failed",
  "message": "Total Debit (82000) does not match Total Credit (82001)"
}
```

**Error (404 Not Found):**
```json
{
  "success": false,
  "error": "Invoice Not Found",
  "message": "Invoice with ID INV-002 does not exist in AM queue"
}
```

**Error (500 Internal Server Error):**
```json
{
  "success": false,
  "error": "GL Posting Failed",
  "message": "Failed to create Fixed Asset transaction: Database connection error"
}
```

---

### **7. API TO REJECT FIXED ASSET INVOICE (BY AM)**

**Endpoint:** `POST /api/invoices/am/reject`

**Description:** Account Manager rejects a Fixed Asset invoice and sends it back to vendor with rejection remarks.

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
  "invoiceId": "INV-002",
  "remarks": "Asset tag number does not match with our Fixed Asset register. Please verify and resubmit."
}
```

**Body Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| invoiceId | String | Yes | Unique invoice ID |
| remarks | String | Yes | Mandatory rejection reason/remarks (must not be empty) |

#### **Response**

**Success (200 OK):**
```json
{
  "success": true,
  "data": {
    "invoiceId": "INV-002",
    "invoiceNumber": "INV-002",
    "status": "Rejected by Account Manager",
    "accountManagerStatus": "Rejected",
    "finalStatus": "Rejected - Return to Vendor",
    "processedByAM": "am1",
    "processedAtAM": "2026-02-04T15:10:00.000Z",
    "rejectedAtAM": "2026-02-04T15:10:00.000Z",
    "amRemarks": "Asset tag number does not match with our Fixed Asset register. Please verify and resubmit.",
    "vendorName": "XYZ Pvt Ltd",
    "amount": 82000
  },
  "message": "Invoice INV-002 rejected by Account Manager and returned to vendor."
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
  "message": "Invoice with ID INV-002 does not exist"
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

## **PART 3: VENDOR LEDGER MANAGEMENT**

---

### **8. API TO CHECK IF VENDOR LEDGER EXISTS**

**Endpoint:** `GET /api/vendors/ledger/check`

**Description:** Checks if a vendor ledger already exists in the GL Master under L2005 (Sundry Creditors).

#### **Request**

**Headers:**
```json
{
  "Authorization": "Bearer {token}",
  "Content-Type": "application/json"
}
```

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| vendorName | String | Yes | Vendor name to check |

**Example Request:**
```
GET /api/vendors/ledger/check?vendorName=XYZ Pvt Ltd
```

#### **Response**

**Success (200 OK - Ledger Exists):**
```json
{
  "success": true,
  "data": {
    "exists": true,
    "vendorName": "XYZ Pvt Ltd",
    "ledgerDetails": {
      "id": "VENDOR_1706942400000_VEND_002",
      "code": "L2005_VEN_002_XYZ_Pvt_Ltd",
      "name": "VENDOR - XYZ Pvt Ltd",
      "type": "ACCOUNT",
      "parentAccount": "SUNDRY CREDITORS",
      "parentCode": "L2005",
      "accountCategory": "LIABILITIES",
      "debitCreditNature": "CREDIT",
      "openingBalance": 0,
      "currentBalance": 256000,
      "isActive": true
    }
  },
  "message": "Vendor ledger exists"
}
```

**Success (200 OK - Ledger Does Not Exist):**
```json
{
  "success": true,
  "data": {
    "exists": false,
    "vendorName": "New Vendor Corp",
    "message": "Vendor ledger does not exist. Will be created on first invoice approval."
  },
  "message": "Vendor ledger not found"
}
```

**Error (400 Bad Request):**
```json
{
  "success": false,
  "error": "Validation Error",
  "message": "Vendor name is required"
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

### **9. API TO CREATE VENDOR LEDGER**

**Endpoint:** `POST /api/vendors/ledger/create`

**Description:** Creates a new vendor ledger under L2005 (Sundry Creditors). This is automatically triggered during invoice approval if vendor ledger doesn't exist.

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
  "vendorId": "VEND_003",
  "vendorName": "New Vendor Corp"
}
```

**Body Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| vendorId | String | Yes | Unique vendor identifier |
| vendorName | String | Yes | Vendor name |

#### **Backend Processing:**

1. **Generate Vendor GL Code**
   - Increment vendor counter in localStorage
   - Format: `L2005_VEN_{counter}_{VendorName with underscores}`
   - Example: `L2005_VEN_003_New_Vendor_Corp`

2. **Create Ledger Entry**
   - Create new ledger object with:
     - Unique ID: `VENDOR_{timestamp}_{vendorId}`
     - GL Code: Generated vendor GL code
     - Name: `VENDOR - {Vendor Name}`
     - Parent: L2005 (SUNDRY CREDITORS)
     - Opening Balance: 0
     - Current Balance: 0

3. **Save to Chart of Accounts**
   - Add new ledger to `chartOfAccounts` in localStorage
   - Update vendor counter

#### **Response**

**Success (201 Created):**
```json
{
  "success": true,
  "data": {
    "vendorId": "VEND_003",
    "vendorName": "New Vendor Corp",
    "ledgerDetails": {
      "id": "VENDOR_1707057900000_VEND_003",
      "code": "L2005_VEN_003_New_Vendor_Corp",
      "name": "VENDOR - New Vendor Corp",
      "type": "ACCOUNT",
      "parentAccount": "SUNDRY CREDITORS",
      "parentCode": "L2005",
      "accountCategory": "LIABILITIES",
      "debitCreditNature": "CREDIT",
      "openingBalance": 0,
      "currentBalance": 0,
      "isActive": true
    }
  },
  "message": "Vendor ledger created successfully under L2005"
}
```

**Error (400 Bad Request - Already Exists):**
```json
{
  "success": false,
  "error": "Duplicate Ledger",
  "message": "Vendor ledger already exists for New Vendor Corp"
}
```

**Error (400 Bad Request - Validation):**
```json
{
  "success": false,
  "error": "Validation Error",
  "message": "Vendor name is required"
}
```

**Error (500 Internal Server Error):**
```json
{
  "success": false,
  "error": "Ledger Creation Failed",
  "message": "Failed to save chart of accounts: Database error"
}
```

---

### **10. API TO FETCH VENDOR LEDGER DETAILS**

**Endpoint:** `GET /api/vendors/ledger/:vendorName`

**Description:** Retrieves complete ledger details for a specific vendor.

#### **Request**

**Headers:**
```json
{
  "Authorization": "Bearer {token}",
  "Content-Type": "application/json"
}
```

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| vendorName | String | Yes | Vendor name (URL encoded) |

**Example Request:**
```
GET /api/vendors/ledger/XYZ%20Pvt%20Ltd
```

#### **Response**

**Success (200 OK):**
```json
{
  "success": true,
  "data": {
    "vendorName": "XYZ Pvt Ltd",
    "ledgerDetails": {
      "id": "VENDOR_1706942400000_VEND_002",
      "code": "L2005_VEN_002_XYZ_Pvt_Ltd",
      "name": "VENDOR - XYZ Pvt Ltd",
      "type": "ACCOUNT",
      "parentAccount": "SUNDRY CREDITORS",
      "parentCode": "L2005",
      "accountCategory": "LIABILITIES",
      "debitCreditNature": "CREDIT",
      "openingBalance": 0,
      "currentBalance": 256000,
      "isActive": true
    },
    "transactions": [
      {
        "id": "TXN_FA_1707057600000_INV-002",
        "date": "2026-02-04",
        "voucherNo": "FA/PUR/2026/0001",
        "voucherType": "Purchase Voucher",
        "invoiceNumber": "INV-002",
        "debit": 0,
        "credit": 82000,
        "narration": "Invoice INV-002 - Fixed Asset",
        "runningBalance": 82000
      },
      {
        "id": "TXN_FA_1707058800000_INV-005",
        "date": "2026-02-03",
        "voucherNo": "FA/PUR/2026/0002",
        "voucherType": "Purchase Voucher",
        "invoiceNumber": "INV-005",
        "debit": 0,
        "credit": 174000,
        "narration": "Invoice INV-005 - Fixed Asset",
        "runningBalance": 256000
      }
    ],
    "summary": {
      "totalPurchases": 256000,
      "totalPayments": 0,
      "outstandingBalance": 256000,
      "transactionCount": 2
    }
  },
  "message": "Vendor ledger details retrieved successfully"
}
```

**Error (404 Not Found):**
```json
{
  "success": false,
  "error": "Ledger Not Found",
  "message": "Vendor ledger does not exist for XYZ Pvt Ltd"
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

## **PART 4: TRANSACTION & REPORTING**

---

### **11. API TO GET FIXED ASSET TRANSACTION DETAILS**

**Endpoint:** `GET /api/transactions/fixed-asset/:transactionId`

**Description:** Retrieves complete details of a Fixed Asset purchase transaction including all GL entries.

#### **Request**

**Headers:**
```json
{
  "Authorization": "Bearer {token}",
  "Content-Type": "application/json"
}
```

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| transactionId | String | Yes | Unique transaction ID |

**Example Request:**
```
GET /api/transactions/fixed-asset/TXN_FA_1707057600000_INV-002
```

#### **Response**

**Success (200 OK):**
```json
{
  "success": true,
  "data": {
    "transaction": {
      "id": "TXN_FA_1707057600000_INV-002",
      "voucherNo": "FA/PUR/2026/0001",
      "voucherType": "Purchase Voucher",
      "date": "2026-02-04",
      "invoiceNumber": "INV-002",
      "totalDebit": 82000,
      "totalCredit": 82000,
      "narration": "Fixed Asset purchase from XYZ Pvt Ltd - Computer",
      "approvedBy": "am1",
      "approvedDate": "2026-02-04T15:00:00.000Z",
      "assetDetails": {
        "assetCategory": "Computer",
        "assetTag": "FA-2024-001",
        "serialNumber": "SN-AX2390",
        "warranty": "3 Years",
        "location": "Main Office, Pune"
      },
      "entries": [
        {
          "lineNo": 1,
          "glCode": "A1001",
          "glName": "FA COMPUTERS",
          "debit": 73214,
          "credit": 0,
          "narration": "Fixed Asset purchase - XYZ Pvt Ltd",
          "vendorId": "XYZ Pvt Ltd",
          "costCenter": "Main Office, Pune",
          "assetTag": "FA-2024-001",
          "assetCategory": "Computer"
        },
        {
          "lineNo": 2,
          "glCode": "A3007001001",
          "glName": "CGST Input",
          "debit": 4393,
          "credit": 0,
          "narration": "CGST @6% on Fixed Asset"
        },
        {
          "lineNo": 3,
          "glCode": "A3007001002",
          "glName": "SGST Input",
          "debit": 4393,
          "credit": 0,
          "narration": "SGST @6% on Fixed Asset"
        },
        {
          "lineNo": 4,
          "glCode": "L2005_VEN_002_XYZ_Pvt_Ltd",
          "glName": "VENDOR - XYZ Pvt Ltd",
          "debit": 0,
          "credit": 82000,
          "narration": "Invoice INV-002 - Fixed Asset"
        }
      ]
    },
    "breakdown": {
      "taxableAmount": 73214,
      "cgstAmount": 4393,
      "sgstAmount": 4393,
      "totalAmount": 82000,
      "gstRate": 12
    },
    "invoiceDetails": {
      "invoiceNumber": "INV-002",
      "vendorName": "XYZ Pvt Ltd",
      "invoiceDate": "2026-02-04",
      "totalAmount": 82000
    }
  },
  "message": "Fixed Asset transaction retrieved successfully"
}
```

**Error (404 Not Found):**
```json
{
  "success": false,
  "error": "Transaction Not Found",
  "message": "Transaction with ID TXN_FA_1707057600000_INV-002 does not exist"
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

### **12. API TO GET ALL PROCESSED FIXED ASSET INVOICES**

**Endpoint:** `GET /api/invoices/processed`

**Description:** Retrieves all successfully processed Fixed Asset invoices with GL posting completed.

#### **Request**

**Headers:**
```json
{
  "Authorization": "Bearer {token}",
  "Content-Type": "application/json"
}
```

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| type | String | No | Filter by invoice type. Use "Fixed Asset" |
| vendorName | String | No | Filter by vendor name |
| fromDate | String (YYYY-MM-DD) | No | Filter from date |
| toDate | String (YYYY-MM-DD) | No | Filter to date |
| assetCategory | String | No | Filter by asset category (e.g., "Computer", "Furniture") |
| page | Integer | No | Page number (default: 1) |
| limit | Integer | No | Records per page (default: 10) |

**Example Request:**
```
GET /api/invoices/processed?type=Fixed Asset&assetCategory=Computer&page=1&limit=10
```

#### **Response**

**Success (200 OK):**
```json
{
  "success": true,
  "data": {
    "invoices": [
      {
        "id": "INV-002",
        "invoiceNumber": "INV-002",
        "vendorName": "XYZ Pvt Ltd",
        "type": "Fixed Asset",
        "totalAmount": 82000,
        "accountManagerStatus": "Approved",
        "finalStatus": "GL Posted - Completed",
        "amRemarks": "Fixed Asset invoice processed with auto-GL posting - Computer",
        "processedByAM": "am1",
        "processedAtAM": "2026-02-04T15:00:00.000Z",
        "voucherNo": "FA/PUR/2026/0001",
        "transactionId": "TXN_FA_1707057600000_INV-002",
        "vendorGLCode": "L2005_VEN_002_XYZ_Pvt_Ltd",
        "fixedAssetGLCode": "A1001",
        "fixedAssetGLName": "FA COMPUTERS",
        "assetCategory": "Computer",
        "assetDetails": {
          "assetCategory": "Computer",
          "assetTag": "FA-2024-001",
          "serialNumber": "SN-AX2390",
          "warranty": "3 Years",
          "location": "Main Office, Pune"
        },
        "breakdown": {
          "taxable": 73214,
          "cgst": 4393,
          "sgst": 4393,
          "total": 82000
        }
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalRecords": 45,
      "recordsPerPage": 10
    },
    "summary": {
      "totalProcessedInvoices": 45,
      "totalAmount": 3420000,
      "byAssetCategory": {
        "Computer": { "count": 18, "amount": 1476000 },
        "Furniture": { "count": 12, "amount": 840000 },
        "Machinery": { "count": 8, "amount": 768000 },
        "Office Equipment": { "count": 5, "amount": 230000 },
        "Software": { "count": 2, "amount": 106000 }
      }
    }
  },
  "message": "Processed Fixed Asset invoices retrieved successfully"
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

### **13. API TO GET REJECTED FIXED ASSET INVOICES**

**Endpoint:** `GET /api/invoices/rejected`

**Description:** Retrieves all rejected Fixed Asset invoices (rejected by either AE or AM).

#### **Request**

**Headers:**
```json
{
  "Authorization": "Bearer {token}",
  "Content-Type": "application/json"
}
```

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| type | String | No | Filter by invoice type. Use "Fixed Asset" |
| vendorName | String | No | Filter by vendor name |
| rejectedBy | String | No | Filter by who rejected ("AE" or "AM") |
| fromDate | String (YYYY-MM-DD) | No | Filter from date |
| toDate | String (YYYY-MM-DD) | No | Filter to date |
| page | Integer | No | Page number (default: 1) |
| limit | Integer | No | Records per page (default: 10) |

**Example Request:**
```
GET /api/invoices/rejected?type=Fixed Asset&rejectedBy=AM&page=1&limit=10
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
        "type": "Fixed Asset",
        "totalAmount": 230000,
        "accountManagerStatus": "Rejected",
        "finalStatus": "Rejected by Account Manager",
        "status": "Rejected - Return to Vendor",
        "amRemarks": "Asset tag number does not match with our Fixed Asset register. Please verify and resubmit.",
        "processedByAM": "am1",
        "processedAtAM": "2026-02-04T15:10:00.000Z",
        "rejectedAtAM": "2026-02-04T15:10:00.000Z",
        "assetDetails": {
          "assetCategory": "Machinery",
          "assetTag": "FA-2024-002",
          "serialNumber": "SN-BX4591",
          "warranty": "2 Years",
          "location": "Factory Unit B"
        }
      },
      {
        "id": "INV-007",
        "invoiceNumber": "INV-007",
        "vendorName": "ABC Enterprises",
        "type": "Fixed Asset",
        "totalAmount": 125000,
        "status": "Rejected by AE",
        "processedBy": "ae1",
        "processedAt": "2026-02-03T14:25:00.000Z",
        "rejectedAt": "2026-02-03T14:25:00.000Z",
        "remarks": "Invoice amount does not match with PO. GST calculation is incorrect. Please resubmit with correct details.",
        "assetDetails": {
          "assetCategory": "Furniture",
          "assetTag": "FA-2024-010",
          "serialNumber": "SN-FX7721",
          "warranty": "1 Year",
          "location": "Branch Office, Delhi"
        }
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 2,
      "totalRecords": 15,
      "recordsPerPage": 10
    },
    "summary": {
      "totalRejected": 15,
      "rejectedByAE": 8,
      "rejectedByAM": 7,
      "totalRejectedAmount": 1875000
    }
  },
  "message": "Rejected Fixed Asset invoices retrieved successfully"
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

### **14. API TO GET FIXED ASSET REGISTER**

**Endpoint:** `GET /api/fixed-assets/register`

**Description:** Retrieves complete Fixed Asset register with all assets purchased through the system.

#### **Request**

**Headers:**
```json
{
  "Authorization": "Bearer {token}",
  "Content-Type": "application/json"
}
```

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| assetCategory | String | No | Filter by asset category |
| location | String | No | Filter by asset location |
| assetTag | String | No | Search by asset tag |
| serialNumber | String | No | Search by serial number |
| vendorName | String | No | Filter by vendor name |
| fromDate | String (YYYY-MM-DD) | No | Filter from purchase date |
| toDate | String (YYYY-MM-DD) | No | Filter to purchase date |
| page | Integer | No | Page number (default: 1) |
| limit | Integer | No | Records per page (default: 20) |

**Example Request:**
```
GET /api/fixed-assets/register?assetCategory=Computer&location=Main Office, Pune&page=1&limit=20
```

#### **Response**

**Success (200 OK):**
```json
{
  "success": true,
  "data": {
    "assets": [
      {
        "assetId": "FA-2024-001",
        "assetTag": "FA-2024-001",
        "assetCategory": "Computer",
        "serialNumber": "SN-AX2390",
        "warranty": "3 Years",
        "warrantyExpiryDate": "2029-02-04",
        "location": "Main Office, Pune",
        "purchaseDetails": {
          "invoiceNumber": "INV-002",
          "vendorName": "XYZ Pvt Ltd",
          "purchaseDate": "2026-02-04",
          "voucherNo": "FA/PUR/2026/0001",
          "transactionId": "TXN_FA_1707057600000_INV-002",
          "purchaseAmount": 82000,
          "taxableAmount": 73214,
          "gstAmount": 8786,
          "gstRate": 12
        },
        "glDetails": {
          "fixedAssetGLCode": "A1001",
          "fixedAssetGLName": "FA COMPUTERS",
          "vendorGLCode": "L2005_VEN_002_XYZ_Pvt_Ltd"
        },
        "status": "Active",
        "addedDate": "2026-02-04T15:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalRecords": 45,
      "recordsPerPage": 20
    },
    "summary": {
      "totalAssets": 45,
      "totalValue": 3420000,
      "byCategory": {
        "Computer": { "count": 18, "value": 1476000 },
        "Furniture": { "count": 12, "value": 840000 },
        "Machinery": { "count": 8, "value": 768000 },
        "Office Equipment": { "count": 5, "value": 230000 },
        "Software": { "count": 2, "value": 106000 }
      },
      "byLocation": {
        "Main Office, Pune": { "count": 25, "value": 1920000 },
        "Factory Unit B": { "count": 12, "value": 936000 },
        "Branch Office, Mumbai": { "count": 8, "value": 564000 }
      }
    }
  },
  "message": "Fixed Asset register retrieved successfully"
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

### **15. API TO GET INVOICE PROCESSING SUMMARY**

**Endpoint:** `GET /api/invoices/summary`

**Description:** Retrieves overall summary of invoice processing status across all stages.

#### **Request**

**Headers:**
```json
{
  "Authorization": "Bearer {token}",
  "Content-Type": "application/json"
}
```

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| type | String | No | Filter by invoice type. Use "Fixed Asset" for Fixed Asset only |
| fromDate | String (YYYY-MM-DD) | No | Summary from date |
| toDate | String (YYYY-MM-DD) | No | Summary to date |

**Example Request:**
```
GET /api/invoices/summary?type=Fixed Asset&fromDate=2026-01-01&toDate=2026-02-04
```

#### **Response**

**Success (200 OK):**
```json
{
  "success": true,
  "data": {
    "summary": {
      "pendingAEApproval": {
        "count": 12,
        "totalAmount": 984000
      },
      "pendingAMApproval": {
        "count": 8,
        "totalAmount": 656000
      },
      "processed": {
        "count": 45,
        "totalAmount": 3420000
      },
      "rejected": {
        "count": 15,
        "totalAmount": 1875000,
        "rejectedByAE": 8,
        "rejectedByAM": 7
      },
      "totalInvoices": 80,
      "totalInvoiceAmount": 6935000
    },
    "byAssetCategory": {
      "Computer": {
        "processed": 18,
        "pending": 5,
        "rejected": 3,
        "totalAmount": 1476000
      },
      "Furniture": {
        "processed": 12,
        "pending": 3,
        "rejected": 2,
        "totalAmount": 840000
      },
      "Machinery": {
        "processed": 8,
        "pending": 2,
        "rejected": 1,
        "totalAmount": 768000
      },
      "Office Equipment": {
        "processed": 5,
        "pending": 1,
        "rejected": 1,
        "totalAmount": 230000
      },
      "Software": {
        "processed": 2,
        "pending": 1,
        "rejected": 0,
        "totalAmount": 106000
      }
    },
    "processingTrend": [
      {
        "month": "2026-01",
        "processed": 28,
        "rejected": 9,
        "totalAmount": 2145000
      },
      {
        "month": "2026-02",
        "processed": 17,
        "rejected": 6,
        "totalAmount": 1275000
      }
    ],
    "averageProcessingTime": {
      "aeToAm": "2.5 hours",
      "amToGLPosting": "1.8 hours",
      "totalEndToEnd": "4.3 hours"
    }
  },
  "message": "Invoice processing summary retrieved successfully"
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

### **Example 1: Complete Fixed Asset Invoice Flow - Computer Purchase**

#### **Step 1: Invoice Submission (From Procurement)**
```json
{
  "id": "INV-002",
  "invoiceNumber": "INV-002",
  "vendorName": "XYZ Pvt Ltd",
  "type": "Fixed Asset",
  "totalAmount": 82000,
  "status": "Pending GST Verification",
  "gstRate": 12,
  "hsnCode": "847130",
  "hsnSummary": "Computer Systems",
  "documentUrl": "/public/DxotBTxfHn.png",
  "submittedBy": "procurement",
  "submittedAt": "2026-02-04T10:30:00.000Z",
  "assetDetails": {
    "assetCategory": "Computer",
    "assetTag": "FA-2024-001",
    "serialNumber": "SN-AX2390",
    "warranty": "3 Years",
    "location": "Main Office, Pune"
  },
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
  "invoiceId": "INV-002",
  "gstRate": 12,
  "hsnCode": "847130",
  "hsnSummary": "Computer Systems - Desktop with Keyboard and Mouse",
  "remarks": "Invoice verified against PO. All details match."
}
```

**Result:** Invoice status updated to "Approved by AE - Pending AM Review"

#### **Step 3: AM Approval & GL Posting**
```json
POST /api/invoices/am/approve
{
  "invoiceId": "INV-002",
  "remarks": "Final approval - All documents verified"
}
```

**Backend Processing:**
1. **Asset Category Mapping:**
   - Input: "Computer"
   - Output: A1001 (FA COMPUTERS)

2. **Vendor Ledger Check:**
   - Vendor: "XYZ Pvt Ltd"
   - Found: L2005_VEN_002_XYZ_Pvt_Ltd

3. **GST Calculation:**
   - Total Amount: ₹82,000
   - GST Rate: 12%
   - Taxable Amount: (82000 × 100) ÷ 112 = ₹73,214
   - Total GST: 82000 - 73214 = ₹8,786
   - CGST (6%): ₹4,393
   - SGST (6%): ₹4,393

4. **Voucher Generation:**
   - Voucher No: FA/PUR/2026/0001

5. **GL Entries Created:**

| Line | GL Code | GL Name | Debit (₹) | Credit (₹) |
|------|---------|---------|-----------|------------|
| 1 | A1001 | FA COMPUTERS | 73,214 | - |
| 2 | A3007001001 | CGST INPUT | 4,393 | - |
| 3 | A3007001002 | SGST INPUT | 4,393 | - |
| 4 | L2005_VEN_002_XYZ_Pvt_Ltd | VENDOR - XYZ Pvt Ltd | - | 82,000 |
| **Total** | | | **82,000** | **82,000** |

**Result:** Invoice processed successfully, GL entries posted, Fixed Asset added to register

---

### **Example 2: Asset Category Mapping Examples**

| Input (assetCategory) | Mapped GL Code | GL Name | Example Asset |
|----------------------|----------------|---------|---------------|
| "Computer" | A1001 | FA COMPUTERS | Desktop PC |
| "Laptop" | A1001 | FA COMPUTERS | Laptop Computer |
| "Furniture" | A1002 | FA FURNITURE & FIXTURES | Office Desk |
| "Furniture & Fixtures" | A1002 | FA FURNITURE & FIXTURES | Conference Table |
| "Motor Car" | A1003 | FA MOTOR CARS | Company Vehicle |
| "Vehicle" | A1003 | FA MOTOR CARS | Delivery Van |
| "Software" | A1004 | FA SOFTWARES | Microsoft Office License |
| "Office Equipment" | A1005 | FA OFFICE EQUIPMENTS | Printer Machine |
| "Machinery" | A1007 | FA MACHINERIES | Manufacturing Equipment |
| "Unknown Category" | A1001 (Default) | FA COMPUTERS | Default fallback |

---

## **APPENDIX B: ERROR CODES REFERENCE**

| Error Code | HTTP Status | Description | Resolution |
|------------|-------------|-------------|------------|
| AUTH_001 | 401 | Invalid or expired token | Re-authenticate and obtain new token |
| AUTH_002 | 403 | Insufficient permissions | Contact admin for role assignment |
| VAL_001 | 400 | Missing required fields | Check request body for required parameters |
| VAL_002 | 400 | Invalid GST rate | GST rate must be 5, 12, 18, or 28 |
| VAL_003 | 400 | Invalid amount | Amount must be positive number |
| VAL_004 | 400 | Empty rejection remarks | Provide mandatory rejection reason |
| INV_001 | 404 | Invoice not found | Verify invoice ID exists |
| INV_002 | 400 | Invoice already processed | Cannot modify processed invoice |
| INV_003 | 400 | Invoice not in correct status | Check workflow status before operation |
| VEN_001 | 404 | Vendor not found | Vendor must be registered in system |
| VEN_002 | 400 | Duplicate vendor ledger | Vendor ledger already exists |
| GL_001 | 500 | GL posting failed | Check transaction balance validation |
| GL_002 | 500 | Ledger creation failed | Database error - contact support |
| SYS_001 | 500 | Internal server error | Unexpected error - contact support |

---

## **APPENDIX C: BUSINESS RULES**

### **1. Invoice Approval Rules**

| Rule | Description | Enforced By |
|------|-------------|-------------|
| BR-001 | All Fixed Asset invoices must be reviewed by AE before AM | System workflow |
| BR-002 | Rejection remarks are mandatory for both AE and AM | API validation |
| BR-003 | Invoice amount must match PO amount (within tolerance) | AE manual verification |
| BR-004 | Asset tag must be unique in Fixed Asset register | System validation |
| BR-005 | GST rate must be valid rate (5, 12, 18, 28) | API validation |

### **2. GL Posting Rules**

| Rule | Description | Enforced By |
|------|-------------|-------------|
| BR-101 | Total Debit must equal Total Credit | System validation |
| BR-102 | Vendor ledger must exist before posting | System auto-creation |
| BR-103 | Fixed Asset GL code must be valid | Category mapping |
| BR-104 | GST split must be exactly 50-50 for CGST/SGST | Calculation logic |
| BR-105 | Taxable amount + GST = Total invoice amount | Math validation |

### **3. Vendor Ledger Rules**

| Rule | Description | Enforced By |
|------|-------------|-------------|
| BR-201 | All vendor ledgers created under L2005 parent | System design |
| BR-202 | Vendor GL code format: L2005_VEN_{counter}_{name} | Code generation |
| BR-203 | Vendor name must be unique | Duplicate check |
| BR-204 | Opening balance for new vendor = 0 | System default |
| BR-205 | Credit balance increases on purchase posting | Ledger update logic |

### **4. Fixed Asset Tracking Rules**

| Rule | Description | Enforced By |
|------|-------------|-------------|
| BR-301 | Asset tag must follow format: FA-YYYY-NNN | System generation |
| BR-302 | Serial number is mandatory for Fixed Assets | Invoice validation |
| BR-303 | Location must be specified for all assets | Form validation |
| BR-304 | Warranty period must be captured | Data entry |
| BR-305 | Asset category determines GL code | Category mapping |

---

## **DOCUMENT REVISION HISTORY**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-02-04 | System Analyst | Initial API specification document created for Fixed Asset process |

---

**END OF DOCUMENT**

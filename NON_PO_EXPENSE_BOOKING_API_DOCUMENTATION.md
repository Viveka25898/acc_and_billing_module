# API SPECIFICATION: NON-PO EMERGENCY EXPENSE BOOKING (PHASE 1)

---

## 1. Executive Summary & Architectural Overview

### 1.1 What is Non-PO Emergency Expense? (Simple Language Explanation)
In daily site operations (facilities management, security services, technical building operations, housekeeping), unexpected breakdowns or emergency situations happen. For example:
- A water supply pump or transformer busbar burns out.
- Metro / municipal digging cuts the local water line, requiring immediate water tankers.
- Bulk diesel is urgently required for emergency DG power backup.
- An urgent third-party structural audit is demanded by government inspectors within 24 hours.

In standard corporate procurement, a **Purchase Order (PO)** must be issued days or weeks in advance before buying. But in site emergencies, operational teams cannot wait for standard PO approval. They procure goods/services immediately or hire local vendors who demand payment via immediate bank transfer/cheque.

This **Non-PO Emergency Expense Booking Module** allows:
1. Operational team members on the ground to raise an emergency expense claim along with:
   - Invoice / Cash Memo
   - Incident reason & Non-PO justification
   - Beneficiary bank details with cancelled cheque / passbook copy
   - Optional GST details (GSTIN, Invoice No)
2. Strict multi-stage review through **Regional Head (RH) ➔ AVP Operations ➔ VP Operations ➔ Account Executive (AE)**.
3. Final financial validation and Double-Entry GL Journal Voucher generation by the **Accounts Manager (AM)**:
   - AM enters the **Total GST Amount** directly from the bill.
   - System automatically splits tax 50/50 to **CGST Input** (`A3007001001`) + **SGST Input** (`A3007001002`) for Intra-State or 100% to **IGST Input** (`A3007001003`) for Inter-State under Parent GL `A3007001`.
   - Debits **Non PO Expense Ledger** (`X2003001` - Parent `X2003`) with the Base Amount.
   - Credits **Non PO Liability Ledger** (`L2001003` - Parent `L2001`) with the Total Payable Amount.
   - Atomically generates and posts a balanced **Expense Journal Voucher (EV-YYYY-XXXX)**.

---

## 2. Updated Hierarchy — 5-Stage Approval & Booking Chain

### Approval Hierarchy

```
[ Level 1 — Requesters ]
  • Operation Executive (East / West / North / South)
  • Operation Manager (East / West / North / South)
  • Supervisor / Site In-charge (East / West / North / South)
  • Regional Head (South / North / East / West) — Direct Raising
            │
            ▼
[ Level 2 — Regional Head (RH) ]
  • Regional Head (South)
  • Regional Head (North)
  • Regional Head (East)
  • Regional Head (West)
            │
            ▼
[ Level 3 — AVP Operations ]
  • AVP Operations (West & South)
  • AVP Operations (North & East)
            │
            ▼
[ Level 4 — VP Operations ]
  • VP Operations (Enterprise Head)
            │
            ▼
[ Level 5 — Account Executive (AE) ]
  • Account Executive (Audit of Bills, Cost Centre, Compliance, TDS Check)
            │
            ▼
[ Level 6 — Accounts Manager (AM) ]
  • Accounts Manager (GST Input Entry, Journal Voucher Posting & Final Authorization)
```

### Region Routing Rules
- **Supervisor / Operation Executive / Operation Manager** ➔ Regional Head of their assigned region (e.g. West site ➔ Regional Head West).
- **Regional Head (South / West)** ➔ AVP Operations (West & South).
- **Regional Head (North / East)** ➔ AVP Operations (North & East).
- **AVP Operations (both groups)** ➔ VP Operations.
- **VP Operations** ➔ Account Executive (AE).
- **Account Executive** ➔ Accounts Manager (AM).
- **Accounts Manager** ➔ Generates Expense Voucher ➔ Claim status transitions to `Approved - Awaiting Accounts Processing` / `Ready for Payment` (Phase 2 Payment Disbursement).

---

## 3. General Architecture & Request Standards

1. **Authentication**: All endpoints require Bearer Token (`Authorization: Bearer <jwt_token>`).
2. **Employee Context**: User ID, Name, Role, and Region are extracted server-side from the authenticated token.
3. **Data Source**: **100% of master data** (Sites, Cost Centres, Categories, Clients, Banks, Ledger COA) must be fetched from backend endpoints. No hardcoded frontend lists.
4. **File Storage**: Attachments (supporting bills, incident photos, bank passbook copies) are uploaded via `multipart/form-data`, validated server-side (Max 5MB per file, allowed: PDF, JPG, PNG, DOCX, XLSX), stored in object storage (e.g. S3 / GCS / Azure Blob), and returned as secure, absolute URLs.
5. **Exact General Ledger (GL) Codes**:
   - **Expense Ledger (Debit Base Expense)**: `X2003001` (Non PO Expense Ledger), Parent: `X2003`
   - **CGST Input Credit (Debit 50% GST)**: `A3007001001` (CGST input), Parent: `A3007001` (GST input accounts)
   - **SGST Input Credit (Debit 50% GST)**: `A3007001002` (SGST input), Parent: `A3007001` (GST input accounts)
   - **IGST Input Credit (Debit 100% GST)**: `A3007001003` (IGST input), Parent: `A3007001` (GST input accounts)
   - **Liability Ledger (Credit Total Amount)**: `L2001003` (Non PO Liability Ledger), Parent: `L2001`

---

## 4. Master Data APIs

### 4.1 Fetch Master Metadata for Non-PO Form
**Endpoint:** `GET /api/non-po-expenses/master-data`  
**Authorization:** All Authenticated Users  
**Description:** Fetches all drop-down options: Operational Sites mapped to requester's region, Clients mapped to sites, Expense Types, Categories, and Financial Year.

#### Query Parameters:
| Parameter | Type | Required | Description |
|---|---|---|---|
| `region` | String | No | Filter sites by region (`W`, `E`, `N`, `S`). If omitted, backend defaults to requester's region. |

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "data": {
    "financialYear": "FY 2026-27",
    "expenseTypes": [
      {
        "id": "site-operational",
        "name": "Site Operational Expense",
        "requiresIncidentDate": false
      },
      {
        "id": "equipment-emergency",
        "name": "Equipment / Emergency Breakdown",
        "requiresIncidentDate": true
      },
      {
        "id": "reliever-consultant",
        "name": "Reliever / Consultant",
        "requiresIncidentDate": false
      }
    ],
    "categories": [
      {
        "id": "cat_ee_electrical",
        "name": "Emergency Electrical & DG Breakdown",
        "expenseTypeId": "equipment-emergency"
      },
      {
        "id": "cat_ee_plumbing",
        "name": "Emergency Plumbing & Water Pipeline Failure",
        "expenseTypeId": "equipment-emergency"
      },
      {
        "id": "cat_so_diesel",
        "name": "Generator / Diesel Refueling",
        "expenseTypeId": "site-operational"
      },
      {
        "id": "cat_so_water",
        "name": "Emergency Water Tanker Supply",
        "expenseTypeId": "site-operational"
      },
      {
        "id": "cat_rc_reliever",
        "name": "Emergency Reliever Staff",
        "expenseTypeId": "reliever-consultant"
      }
    ],
    "sites": [
      {
        "siteId": "site-mh01",
        "siteCode": "MH01",
        "siteName": "Godrej One - Vikhroli, Mumbai",
        "region": "W",
        "costCentre": "CC-MH01-OPS",
        "clients": [
          { "clientId": "client-godrej", "clientName": "Godrej Properties" },
          { "clientId": "client-tata", "clientName": "Tata Consultancy Services" }
        ]
      },
      {
        "siteId": "site-mh02",
        "siteCode": "MH02",
        "siteName": "BKC Financial Center, Mumbai",
        "region": "W",
        "costCentre": "CC-MH02-BKC",
        "clients": [
          { "clientId": "client-hdfc", "clientName": "HDFC Asset Management" }
        ]
      }
    ]
  }
}
```

---

## 5. Claim Submission & Employee Request APIs

### 5.1 API to Submit / Raise Non-PO Expense Request
**Endpoint:** `POST /api/non-po-expenses`  
**Authorization:** Operation Executive, Operation Manager, Supervisor, Regional Head  
**Description:** Called when an employee submits the Non-PO Expense Request form.  
**Request Header:** `Content-Type: multipart/form-data`  

#### Request Body (Multipart Form-Data):
| Field | Type | Required | Validation / Rule |
|---|---|---|---|
| `employeeId` | String | Yes | Auto-verified against token |
| `employeeName` | String | Yes | Minimum 2 characters |
| `requesterRole` | String | Yes | E.g. Operation Executive |
| `region` | String | Yes | `W`, `E`, `N`, `S` |
| `expenseType` | String | Yes | Selected expense type name |
| `urgency` | String | Yes | `normal`, `high`, `critical` |
| `incidentDate` | String | Cond. | Required if expenseType = 'Equipment / Emergency Breakdown' (YYYY-MM-DD) |
| `categoryId` | String | Yes | Valid category ID |
| `categoryName` | String | Yes | Category display name |
| `billable` | String | Yes | `Yes` or `No` |
| `clientId` | String | Cond. | Required if `billable` = `Yes` |
| `clientName` | String | Cond. | Required if `billable` = `Yes` |
| `siteId` | String | Yes | Valid site ID |
| `siteName` | String | Yes | Site display name |
| `costCentre` | String | Yes | Cost Centre code (e.g. `CC-MH01-OPS`) |
| `expenseDate` | String | Yes | Date expense occurred (Max 30 days past) |
| `claimReason` | String | Yes | Description / Purpose (Min 20, max 1000 chars) |
| `nonPoJustification` | String | Yes | Emergency justification for bypassing PO (Min 20 chars) |
| `amountRequested` | Number | Yes | Greater than 0 (e.g. `24500.00`) |
| `accountHolderName` | String | Yes | Beneficiary payee name |
| `bankName` | String | Yes | Bank & branch name |
| `bankAccountNo` | String | Yes | 9 to 18 digits |
| `ifscCode` | String | Yes | 11-char alphanumeric IFSC |
| `isGstBill` | String | Yes | `Yes` or `No` |
| `vendorGstin` | String | Cond. | Required if `isGstBill` = `Yes` (15-char GSTIN) |
| `invoiceNumber` | String | No | Vendor Tax Invoice / Bill number |
| `passbookImage` | Binary File | Yes | Cancelled cheque or passbook copy (Max 5MB) |
| `attachments` | Binary File[]| Yes | Array of supporting bills/invoices (Min 1, Max 10 files) |

#### Success Response (`201 Created`):
```json
{
  "success": true,
  "message": "Non-PO expense claim submitted successfully",
  "claimId": "NPO-2026-W-000001",
  "status": "Pending with Regional Head",
  "currentStage": "Regional Head",
  "assignedToRole": "regional-head",
  "assignedToName": "Vikram Singh",
  "amountRequested": 24500.00,
  "financialYear": "FY 2026-27",
  "submittedAt": "2026-11-20T03:30:00.000Z",
  "passbookImage": {
    "fileName": "Cancelled_Cheque_Apex.jpg",
    "fileUrl": "https://storage.ismart.com/non-po/cheques/cheque_001.jpg",
    "fileSize": "680 KB"
  },
  "attachments": [
    {
      "id": "att-1",
      "fileName": "Apex_Emergency_Invoice_9921.pdf",
      "fileUrl": "https://storage.ismart.com/non-po/bills/inv_9921.pdf",
      "fileSize": "1.4 MB",
      "type": "Invoice"
    },
    {
      "id": "att-2",
      "fileName": "Damaged_Busbar_Photo.jpg",
      "fileUrl": "https://storage.ismart.com/non-po/bills/photo_busbar.jpg",
      "fileSize": "2.1 MB",
      "type": "Incident Photo"
    }
  ]
}
```

---

### 5.2 API to Fetch Employee's Own Claims
**Endpoint:** `GET /api/non-po-expenses/my-requests`  
**Authorization:** Operation Executive, Operation Manager, Supervisor, Regional Head  
**Description:** Fetches all Non-PO expense claims raised by the logged-in user with filters and pagination.

#### Query Parameters:
| Parameter | Type | Required | Description |
|---|---|---|---|
| `search` | String | No | Search by Claim ID, Site Name, Beneficiary, or Expense Type |
| `status` | String | No | Filter by workflow status (`Draft`, `Pending with Regional Head`, etc.) |
| `urgency` | String | No | Filter by urgency (`normal`, `high`, `critical`) |
| `date` | String | No | Filter by claim date (YYYY-MM-DD) |
| `page` | Number | No | Page number (Default: 1) |
| `pageSize` | Number | No | Page size (Default: 10) |

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "pagination": {
    "currentPage": 1,
    "pageSize": 10,
    "totalItems": 4,
    "totalPages": 1
  },
  "stats": {
    "total": 4,
    "drafts": 1,
    "pending": 2,
    "approved": 1,
    "rejected": 0
  },
  "requests": [
    {
      "claimId": "NPO-2026-W-000001",
      "claimDate": "2026-11-20",
      "financialYear": "FY 2026-27",
      "workflowStatus": "Pending with Regional Head",
      "currentStage": "Regional Head",
      "expenseType": "Equipment / Emergency Breakdown",
      "categoryName": "Emergency Electrical & DG Breakdown",
      "urgency": "critical",
      "amountRequested": 24500.00,
      "siteName": "Godrej One - Vikhroli, Mumbai",
      "costCentre": "CC-MH01-OPS",
      "billable": "No",
      "accountHolderName": "Apex Power Controls & Services",
      "bankName": "HDFC Bank, Kanjurmarg West Branch",
      "bankAccountNo": "50200012345678",
      "ifscCode": "HDFC0000123",
      "isGstBill": "Yes",
      "vendorGstin": "27AAACA1234F1Z5",
      "invoiceNumber": "INV-9921",
      "hasExpenseVoucher": false,
      "submittedAt": "2026-11-20T03:30:00.000Z"
    }
  ]
}
```

---

### 5.3 API to Fetch Full Claim Details
**Endpoint:** `GET /api/non-po-expenses/{claimId}`  
**Authorization:** All Roles (Requester, RH, AVP, VP, AE, AM)  
**Description:** Returns full claim information including passbook document, all attachments, and the complete 5-stage approval history timeline.

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "claim": {
    "claimId": "NPO-2026-W-000001",
    "claimDate": "2026-11-20",
    "financialYear": "FY 2026-27",
    "workflowStatus": "Pending with Regional Head",
    "currentStage": "Regional Head",
    "employeeCode": "EMP0000012",
    "employeeName": "Karan Malhotra",
    "requesterRole": "Operation Executive",
    "region": "W",
    "expenseType": "Equipment / Emergency Breakdown",
    "urgency": "critical",
    "incidentDate": "2026-11-19",
    "categoryId": "cat_ee_electrical",
    "categoryName": "Emergency Electrical & DG Breakdown",
    "billable": "No",
    "siteId": "site-mh01",
    "siteName": "Godrej One - Vikhroli, Mumbai",
    "costCentre": "CC-MH01-OPS",
    "expenseDate": "2026-11-19",
    "claimReason": "Main busbar flashed over due to catastrophic surge in HT sub-station breaker panel.",
    "nonPoJustification": "Critical sub-station supplying whole tower stopped. Immediate replacement required within 4 hours.",
    "amountRequested": 24500.00,
    "accountHolderName": "Apex Power Controls & Services",
    "bankName": "HDFC Bank, Kanjurmarg West Branch",
    "bankAccountNo": "50200012345678",
    "ifscCode": "HDFC0000123",
    "isGstBill": "Yes",
    "vendorGstin": "27AAACA1234F1Z5",
    "invoiceNumber": "INV-9921",
    "passbookImage": {
      "fileName": "Cancelled_Cheque_Apex.jpg",
      "fileUrl": "https://storage.ismart.com/non-po/cheques/cheque_001.jpg",
      "fileSize": "680 KB",
      "type": "Bank Passbook / Cheque Proof"
    },
    "attachments": [
      {
        "id": "att-1",
        "fileName": "Apex_Emergency_Invoice_9921.pdf",
        "fileUrl": "https://storage.ismart.com/non-po/bills/inv_9921.pdf",
        "type": "Invoice",
        "size": "1.4 MB"
      }
    ],
    "approvalTimeline": [
      { "stage": "RH", "role": "Regional Head", "approverName": null, "decision": "Pending", "date": null, "comments": null },
      { "stage": "AVP", "role": "AVP Operations", "approverName": null, "decision": null, "date": null, "comments": null },
      { "stage": "VP", "role": "VP Operations", "approverName": null, "decision": null, "date": null, "comments": null },
      { "stage": "AE", "role": "Account Executive", "approverName": null, "decision": null, "date": null, "comments": null },
      { "stage": "AM", "role": "Accounts Manager", "approverName": null, "decision": null, "date": null, "comments": null }
    ],
    "expenseVoucher": null
  }
}
```

---

## 6. Approver Inboxes & Action APIs (Stages 1 to 4)

### 6.1 Generic Approver Inbox Query Contract
All approver inboxes (`/regional-head-inbox`, `/avp-inbox`, `/vp-inbox`, `/ae-inbox`, `/am-inbox`) adhere to the standard filtering contract:

#### Query Parameters:
| Parameter | Type | Required | Description |
|---|---|---|---|
| `tab` | String | No | `pending` (Default: only actionable items) or `all` (Historical + pending) |
| `search` | String | No | Search by Claim ID, Requester Name, Site Name, Cost Centre, Beneficiary |
| `urgency` | String | No | `all`, `critical`, `high`, `normal` |
| `expenseType` | String | No | `all` or specific type |
| `sortBy` | String | No | `newest` (Default), `oldest`, `amount_desc`, `amount_asc`, `urgency` |
| `page` | Number | No | Page number (Default: 1) |
| `pageSize` | Number | No | Items per page (Default: 10) |

---

### 6.2 STAGE 1: REGIONAL HEAD (RH)

#### 6.2.1 Fetch Claims for Regional Head
**Endpoint:** `GET /api/non-po-expenses/regional-head-inbox`  
**Authorization:** `Regional Head (South)`, `Regional Head (North)`, `Regional Head (East)`, `Regional Head (West)`  
**Description:** Fetches all claims for the authenticated Regional Head's assigned region where status is `Pending with Regional Head`.

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "kpis": {
    "pendingCount": 3,
    "pendingTotalAmount": 78500.00,
    "criticalCount": 1,
    "totalProcessed": 14
  },
  "pagination": { "currentPage": 1, "pageSize": 10, "totalItems": 3, "totalPages": 1 },
  "requests": [
    {
      "claimId": "NPO-2026-W-000001",
      "claimDate": "2026-11-20",
      "employeeName": "Karan Malhotra",
      "requesterRole": "Operation Executive",
      "region": "W",
      "siteName": "Godrej One - Vikhroli, Mumbai",
      "costCentre": "CC-MH01-OPS",
      "expenseType": "Equipment / Emergency Breakdown",
      "categoryName": "Emergency Electrical & DG Breakdown",
      "urgency": "critical",
      "amountRequested": 24500.00,
      "accountHolderName": "Apex Power Controls & Services",
      "bankAccountNo": "50200012345678",
      "workflowStatus": "Pending with Regional Head"
    }
  ]
}
```

#### 6.2.2 Approve Claim by Regional Head
**Endpoint:** `POST /api/non-po-expenses/{claimId}/regional-head-approve`  
**Authorization:** `Regional Head`  
**Description:** Approves the claim and advances workflow to **AVP Operations**.

#### Request Body (JSON):
```json
{
  "comments": "Sub-station breakdown verified with site engineer. Approved."
}
```

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "message": "Claim approved by Regional Head and forwarded to AVP Operations",
  "claimId": "NPO-2026-W-000001",
  "status": "Pending with AVP",
  "currentStage": "AVP Operations",
  "approvedBy": "Vikram Singh",
  "approvedAt": "2026-11-20T04:00:00.000Z"
}
```

#### 6.2.3 Reject Claim by Regional Head
**Endpoint:** `POST /api/non-po-expenses/{claimId}/regional-head-reject`  
**Authorization:** `Regional Head`  
**Description:** Rejects the claim with mandatory remarks (Minimum 10 characters).

#### Request Body (JSON):
```json
{
  "rejectionReason": "Work was not emergency in nature; standard PO must be created for scheduled preventive overhaul."
}
```

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "message": "Claim rejected successfully",
  "claimId": "NPO-2026-W-000001",
  "status": "Rejected",
  "currentStage": "Rejected by Regional Head",
  "rejectedBy": "Vikram Singh",
  "rejectedAt": "2026-11-20T04:05:00.000Z",
  "rejectionReason": "Work was not emergency in nature; standard PO must be created for scheduled preventive overhaul."
}
```

---

### 6.3 STAGE 2: AVP OPERATIONS

#### 6.3.1 Fetch Claims for AVP Operations
**Endpoint:** `GET /api/non-po-expenses/avp-inbox`  
**Authorization:** `AVP Operations (West & South)`, `AVP Operations (North & East)`  
**Description:** Fetches claims pending AVP approval matching AVP's region group.

#### 6.3.2 Approve Claim by AVP Operations
**Endpoint:** `POST /api/non-po-expenses/{claimId}/avp-approve`  
**Authorization:** `AVP Operations`  
**Request Body (JSON):**
```json
{
  "comments": "Emergency outage confirmed. Concurred."
}
```

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "message": "Claim approved by AVP Operations and forwarded to VP Operations",
  "claimId": "NPO-2026-W-000001",
  "status": "Pending with VP",
  "currentStage": "VP Operations",
  "approvedBy": "Arjun Desai",
  "approvedAt": "2026-11-20T04:15:00.000Z"
}
```

#### 6.3.3 Reject Claim by AVP Operations
**Endpoint:** `POST /api/non-po-expenses/{claimId}/avp-reject`  
**Authorization:** `AVP Operations`  
**Request Body (JSON):**
```json
{
  "rejectionReason": "Quotation amount is significantly above standard rate contract for emergency spares."
}
```

---

### 6.4 STAGE 3: VP OPERATIONS

#### 6.4.1 Fetch Claims for VP Operations
**Endpoint:** `GET /api/non-po-expenses/vp-inbox`  
**Authorization:** `VP Operations`  
**Description:** Fetches all claims across all regions where status is `Pending with VP`.

#### 6.4.2 Approve Claim by VP Operations
**Endpoint:** `POST /api/non-po-expenses/{claimId}/vp-approve`  
**Authorization:** `VP Operations`  
**Request Body (JSON):**
```json
{
  "comments": "Executive authorization granted. Forwarded to Accounts Executive."
}
```

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "message": "Claim approved by VP Operations and forwarded to Account Executive",
  "claimId": "NPO-2026-W-000001",
  "status": "Pending with Account Executive",
  "currentStage": "Account Executive",
  "approvedBy": "Suresh Menon",
  "approvedAt": "2026-11-20T04:30:00.000Z"
}
```

#### 6.4.3 Reject Claim by VP Operations
**Endpoint:** `POST /api/non-po-expenses/{claimId}/vp-reject`  
**Authorization:** `VP Operations`  
**Request Body (JSON):**
```json
{
  "rejectionReason": "Cost must be borne by vendor as warranty defect under existing AMC contract."
}
```

---

### 6.5 STAGE 4: ACCOUNT EXECUTIVE (AE)

#### 6.5.1 Fetch Claims for Account Executive
**Endpoint:** `GET /api/non-po-expenses/ae-inbox`  
**Authorization:** `Account Executive`  
**Description:** Fetches claims pending AE verification. The AE audits the supporting bills, verifies vendor GSTIN, IFSC, cost centre, and withholding tax compliance.

#### 6.5.2 Approve Claim by Account Executive
**Endpoint:** `POST /api/non-po-expenses/{claimId}/ae-approve`  
**Authorization:** `Account Executive`  
**Request Body (JSON):**
```json
{
  "comments": "Tax invoice, GSTIN active on portal, bank IFSC validated. Ready for AM voucher booking."
}
```

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "message": "Claim verified by Account Executive and forwarded to Accounts Manager for voucher booking",
  "claimId": "NPO-2026-W-000001",
  "status": "Pending with Accounts Manager",
  "currentStage": "Accounts Manager",
  "approvedBy": "Ramesh Agarwal",
  "approvedAt": "2026-11-20T04:45:00.000Z"
}
```

#### 6.5.3 Reject Claim by Account Executive
**Endpoint:** `POST /api/non-po-expenses/{claimId}/ae-reject`  
**Authorization:** `Account Executive`  
**Request Body (JSON):**
```json
{
  "rejectionReason": "Vendor GSTIN is cancelled/inactive on GST portal. Fresh B2C memo or registered invoice required."
}
```

---

## 7. STAGE 5: ACCOUNTS MANAGER (AM) — EXPENSE VOUCHER BOOKING

This is the pivotal accounting step. When the Accounts Manager reviews a claim, they review the attached bill and execute the 2-step Expense Voucher booking flow.

```
Step 1: AM enters Total GST Amount (₹) & Supply Type (Intra / Inter)
   │
   ▼
Step 2: Backend calculates and previews the Journal Voucher
   │
   ▼
Step 3: AM confirms and posts Voucher (Atomic Double-Entry GL Ledger Creation)
```

---

### 7.1 Fetch Claims for Accounts Manager
**Endpoint:** `GET /api/non-po-expenses/am-inbox`  
**Authorization:** `Accounts Manager`  
**Description:** Fetches all claims where `workflowStatus = 'Pending with Accounts Manager'`.

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "kpis": {
    "pendingCount": 1,
    "pendingTotalAmount": 24500.00,
    "criticalCount": 1,
    "totalProcessed": 22
  },
  "pagination": { "currentPage": 1, "pageSize": 10, "totalItems": 1, "totalPages": 1 },
  "requests": [
    {
      "claimId": "NPO-2026-W-000001",
      "claimDate": "2026-11-20",
      "employeeName": "Karan Malhotra",
      "siteName": "Godrej One - Vikhroli, Mumbai",
      "costCentre": "CC-MH01-OPS",
      "expenseType": "Equipment / Emergency Breakdown",
      "categoryName": "Emergency Electrical & DG Breakdown",
      "amountRequested": 24500.00,
      "isGstBill": "Yes",
      "vendorGstin": "27AAACA1234F1Z5",
      "invoiceNumber": "INV-9921",
      "accountHolderName": "Apex Power Controls & Services",
      "workflowStatus": "Pending with Accounts Manager"
    }
  ]
}
```

---

### 7.2 API to Generate Expense Voucher Preview (Step 1 ➔ Step 2)
**Endpoint:** `POST /api/non-po-expenses/{claimId}/generate-voucher-preview`  
**Authorization:** `Accounts Manager`  
**Description:** Validates the total GST amount entered by the AM, computes base taxable expense and GST split (50/50 for Intra-State or 100% for Inter-State), checks double-entry mathematical balancing, and returns the formal journal preview.

#### Request Body (JSON):
```json
{
  "totalGstAmount": 3737.28,
  "gstType": "intra",
  "voucherDate": "2026-11-20"
}
```

#### Backend Validation & Mathematical Rules:
1. `totalGstAmount >= 0`.
2. `totalGstAmount < amountRequested`.
3. `baseExpense = amountRequested - totalGstAmount`.
4. If `gstType === 'intra'`:
   - `cgstAmount = totalGstAmount / 2`
   - `sgstAmount = totalGstAmount / 2`
   - `igstAmount = 0`
5. If `gstType === 'inter'`:
   - `igstAmount = totalGstAmount`
   - `cgstAmount = 0`
   - `sgstAmount = 0`
6. `Total Debit = baseExpense + cgstAmount + sgstAmount + igstAmount` MUST EQUAL `Total Credit = amountRequested`.

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "voucherPreview": {
    "voucherNo": "EV-2026-000001",
    "voucherDate": "2026-11-20",
    "claimId": "NPO-2026-W-000001",
    "financialYear": "FY 2026-27",
    "siteName": "Godrej One - Vikhroli, Mumbai",
    "costCentre": "CC-MH01-OPS",
    "beneficiaryName": "Apex Power Controls & Services",
    "vendorGstin": "27AAACA1234F1Z5",
    "vendorInvoiceNo": "INV-9921",
    "totalAmount": 24500.00,
    "baseExpense": 20762.72,
    "totalGstAmount": 3737.28,
    "gstType": "intra",
    "cgstAmount": 1868.64,
    "sgstAmount": 1868.64,
    "igstAmount": 0.00,
    "isBalanced": true,
    "lines": [
      {
        "lineNo": 1,
        "particulars": "Non PO Expense Ledger",
        "ledgerCode": "X2003001",
        "parentGl": "X2003",
        "parentGlName": "DIRECT EXPENSES",
        "costCentre": "CC-MH01-OPS",
        "debit": 20762.72,
        "credit": 0.00,
        "accountType": "Expense (P&L)",
        "narration": "Site Emergency Expense - Equipment / Emergency Breakdown (Godrej One - Vikhroli, Mumbai)"
      },
      {
        "lineNo": 2,
        "particulars": "CGST input",
        "ledgerCode": "A3007001001",
        "parentGl": "A3007001",
        "parentGlName": "GST input accounts",
        "costCentre": "CC-MH01-OPS",
        "debit": 1868.64,
        "credit": 0.00,
        "accountType": "Asset / ITC",
        "narration": "Central GST Input @ 50% of ₹3,737.28 (Parent: A3007001 - GST input accounts)"
      },
      {
        "lineNo": 3,
        "particulars": "SGST input",
        "ledgerCode": "A3007001002",
        "parentGl": "A3007001",
        "parentGlName": "GST input accounts",
        "costCentre": "CC-MH01-OPS",
        "debit": 1868.64,
        "credit": 0.00,
        "accountType": "Asset / ITC",
        "narration": "State GST Input @ 50% of ₹3,737.28 (Parent: A3007001 - GST input accounts)"
      },
      {
        "lineNo": 4,
        "particulars": "Non PO Liability Ledger",
        "ledgerCode": "L2001003",
        "parentGl": "L2001",
        "parentGlName": "CURRENT LIABILITIES",
        "costCentre": "—",
        "debit": 0.00,
        "credit": 24500.00,
        "accountType": "Current Liability",
        "narration": "Payable to: Apex Power Controls & Services (HDFC Bank, Kanjurmarg West Branch)"
      }
    ],
    "totalDebit": 24500.00,
    "totalCredit": 24500.00,
    "narration": "Being Non-PO Emergency Expense claim NPO-2026-W-000001 booked for site Godrej One - Vikhroli, Mumbai towards Equipment / Emergency Breakdown (Emergency Electrical & DG Breakdown). Approved by Accounts Manager."
  }
}
```

---

### 7.3 API to Post Expense Voucher & Final Approve Claim
**Endpoint:** `POST /api/non-po-expenses/{claimId}/post-expense-voucher`  
**Authorization:** `Accounts Manager`  
**Description:** Atomically commits the Journal Voucher to the database, updates the General Ledger tables, sets claim status to `Approved - Awaiting Accounts Processing`, and prepares the record for Phase 2 Payment Disbursement.

#### Request Body (JSON):
```json
{
  "voucherNo": "EV-2026-000001",
  "voucherDate": "2026-11-20",
  "totalAmount": 24500.00,
  "baseExpense": 20762.72,
  "totalGstAmount": 3737.28,
  "gstType": "intra",
  "cgstAmount": 1868.64,
  "sgstAmount": 1868.64,
  "igstAmount": 0.00,
  "customNarration": "Being Non-PO Emergency Expense claim NPO-2026-W-000001 booked for site Godrej One - Vikhroli, Mumbai."
}
```

#### Critical Backend Atomic Operations:
1. **Concurrency Check**: Verify claim is still at `Pending with Accounts Manager`.
2. **Double-Entry Balance Verification**: Ensure `SUM(debit) == SUM(credit)`.
3. **GL Transaction Insertion**:
   - Debit record in `journal_entries` table for `X2003001` (Non PO Expense Ledger).
   - Debit record in `journal_entries` table for `A3007001001` (CGST input) & `A3007001002` (SGST input), or `A3007001003` (IGST input).
   - Credit record in `journal_entries` table for `L2001003` (Non PO Liability Ledger).
4. **Claim State Transition**:
   - `workflowStatus = "Approved - Awaiting Accounts Processing"`
   - `paymentStatus = "Ready for Payment"`
   - `currentStage = "Approved - Accounts Processing"`
5. **Audit Trail**: Add AM step with timestamp and approver name.

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "message": "Expense Voucher EV-2026-000001 posted successfully. Claim approved and ready for payment disbursement.",
  "claimId": "NPO-2026-W-000001",
  "status": "Approved - Awaiting Accounts Processing",
  "paymentStatus": "Ready for Payment",
  "approvedBy": "Ashok Mehta",
  "approvedAt": "2026-11-20T05:00:00.000Z",
  "expenseVoucher": {
    "voucherId": "VCH-2026-11-0091",
    "voucherNo": "EV-2026-000001",
    "voucherDate": "2026-11-20",
    "totalDebit": 24500.00,
    "totalCredit": 24500.00,
    "postedAt": "2026-11-20T05:00:00.000Z",
    "postedBy": "Ashok Mehta",
    "glSummary": {
      "expenseGL": "X2003001",
      "liabilityGL": "L2001003",
      "gstParentGL": "A3007001",
      "cgstGL": "A3007001001",
      "sgstGL": "A3007001002",
      "igstGL": null
    }
  }
}
```

---

### 7.4 API to Fetch Formatted Expense Voucher (For View / Print)
**Endpoint:** `GET /api/non-po-expenses/{claimId}/expense-voucher`  
**Authorization:** All Authorized Roles (AM, AE, Requester, Auditors)  
**Description:** Fetches the immutable posted Expense Voucher for viewing or printing.

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "voucher": {
    "voucherNo": "EV-2026-000001",
    "voucherDate": "2026-11-20",
    "claimId": "NPO-2026-W-000001",
    "financialYear": "FY 2026-27",
    "siteName": "Godrej One - Vikhroli, Mumbai",
    "costCentre": "CC-MH01-OPS",
    "beneficiary": {
      "name": "Apex Power Controls & Services",
      "bankName": "HDFC Bank, Kanjurmarg West Branch",
      "accountNo": "50200012345678",
      "ifsc": "HDFC0000123",
      "gstin": "27AAACA1234F1Z5"
    },
    "kpiSummary": {
      "totalVoucherAmount": 24500.00,
      "taxableBaseAmount": 20762.72,
      "totalGstInputCredit": 3737.28,
      "balanceStatus": "BALANCED (₹0.00 Diff)"
    },
    "entries": [
      {
        "lineNo": 1,
        "particulars": "Non PO Expense Ledger",
        "ledgerCode": "X2003001",
        "parentGl": "X2003",
        "costCentre": "CC-MH01-OPS",
        "debit": 20762.72,
        "credit": 0.00
      },
      {
        "lineNo": 2,
        "particulars": "CGST input",
        "ledgerCode": "A3007001001",
        "parentGl": "A3007001",
        "costCentre": "CC-MH01-OPS",
        "debit": 1868.64,
        "credit": 0.00
      },
      {
        "lineNo": 3,
        "particulars": "SGST input",
        "ledgerCode": "A3007001002",
        "parentGl": "A3007001",
        "costCentre": "CC-MH01-OPS",
        "debit": 1868.64,
        "credit": 0.00
      },
      {
        "lineNo": 4,
        "particulars": "Non PO Liability Ledger",
        "ledgerCode": "L2001003",
        "parentGl": "L2001",
        "costCentre": "—",
        "debit": 0.00,
        "credit": 24500.00
      }
    ],
    "narration": "Being Non-PO Emergency Expense claim NPO-2026-W-000001 booked for site Godrej One - Vikhroli, Mumbai towards Equipment / Emergency Breakdown. Approved by Accounts Manager."
  }
}
```

---

### 7.5 API to Reject Claim by Accounts Manager
**Endpoint:** `POST /api/non-po-expenses/{claimId}/am-reject`  
**Authorization:** `Accounts Manager`  
**Description:** Rejects the claim at the final stage with mandatory rejection remarks.

#### Request Body (JSON):
```json
{
  "rejectionReason": "Bill amount does not match bank proof details. Requires operational resubmission."
}
```

---

## 8. Summary Table: Endpoints at a Glance

| # | Method | Endpoint URL | Role / Authorization | Purpose |
|---|---|---|---|---|
| **1** | `GET` | `/api/non-po-expenses/master-data` | All Roles | Fetch Sites, Clients, Categories, Types |
| **2** | `POST` | `/api/non-po-expenses` | Requesters (Level 1) | Submit Non-PO claim (multipart) |
| **3** | `GET` | `/api/non-po-expenses/my-requests` | Requesters (Level 1) | View employee's submitted claims |
| **4** | `GET` | `/api/non-po-expenses/{claimId}` | All Roles | View full claim details & timeline |
| **5** | `GET` | `/api/non-po-expenses/regional-head-inbox` | Regional Head | Fetch claims pending RH review |
| **6** | `POST` | `/api/non-po-expenses/{claimId}/regional-head-approve` | Regional Head | Approve claim ➔ Forward to AVP |
| **7** | `POST` | `/api/non-po-expenses/{claimId}/regional-head-reject` | Regional Head | Reject claim with remarks |
| **8** | `GET` | `/api/non-po-expenses/avp-inbox` | AVP Operations | Fetch claims pending AVP review |
| **9** | `POST` | `/api/non-po-expenses/{claimId}/avp-approve` | AVP Operations | Approve claim ➔ Forward to VP |
| **10**| `POST` | `/api/non-po-expenses/{claimId}/avp-reject` | AVP Operations | Reject claim with remarks |
| **11**| `GET` | `/api/non-po-expenses/vp-inbox` | VP Operations | Fetch claims pending VP review |
| **12**| `POST` | `/api/non-po-expenses/{claimId}/vp-approve` | VP Operations | Approve claim ➔ Forward to AE |
| **13**| `POST` | `/api/non-po-expenses/{claimId}/vp-reject` | VP Operations | Reject claim with remarks |
| **14**| `GET` | `/api/non-po-expenses/ae-inbox` | Account Executive | Fetch claims pending AE audit |
| **15**| `POST` | `/api/non-po-expenses/{claimId}/ae-approve` | Account Executive | Audit claim ➔ Forward to AM |
| **16**| `POST` | `/api/non-po-expenses/{claimId}/ae-reject` | Account Executive | Reject claim with remarks |
| **17**| `GET` | `/api/non-po-expenses/am-inbox` | Accounts Manager | Fetch claims pending AM voucher |
| **18**| `POST` | `/api/non-po-expenses/{claimId}/generate-voucher-preview` | Accounts Manager | Calculate Base & GST split, preview journal |
| **19**| `POST` | `/api/non-po-expenses/{claimId}/post-expense-voucher` | Accounts Manager | Post journal voucher (`X2003001` / `A3007001` / `L2001003`) & approve |
| **20**| `GET` | `/api/non-po-expenses/{claimId}/expense-voucher` | All Roles | Fetch posted voucher for view/print |
| **21**| `POST` | `/api/non-po-expenses/{claimId}/am-reject` | Accounts Manager | Reject claim with remarks |

# **API SPECIFICATION – PROCESS FOR CONVEYANCE BOOKING**

---

## **TABLE OF CONTENTS**

1. [Overview](#1-overview)
2. [Workflow Summary](#2-workflow-summary)
3. [GL Code Structure](#3-gl-code-structure)
4. [API Endpoints](#4-api-endpoints)
   - [Part 1: Employee Conveyance Submission](#part-1-employee-conveyance-submission)
   - [Part 2: Line Manager Approval](#part-2-line-manager-approval)
   - [Part 3: VP Operations Approval](#part-3-vp-operations-approval)
   - [Part 4: Account Executive Final Approval](#part-4-account-executive-final-approval)
   - [Part 5: Payment Processing](#part-5-payment-processing)
   - [Part 6: Reporting & Status Tracking](#part-6-reporting--status-tracking)

---

## **1. OVERVIEW**

### **Objective**

To automate and streamline the reimbursement of conveyance expenses incurred by employees during client visits, ensuring proper approvals and accurate expense tracking.

### **Process Flow**

1. **Employee**: Fills conveyance claim form with visit details and uploads visit report
2. **Line Manager**: First-level approval - verifies visit details and amount claimed
3. **VP Operations**: Second-level approval - validates manager-approved claims
4. **Account Executive**: Final approval - GL entries automatically posted (Dr Expense, Cr Payable)
5. **Payment Processing**: Batch payment execution through banking system

### **Key Features**

- Multi-level approval hierarchy (Employee → Line Manager → VP → Account Executive)
- Automatic assignment to reporting manager based on employee hierarchy
- Claim window validation (must submit within 7 days after month-end)
- Designation-based claim limits (Junior: ₹5,000 | Senior: ₹10,000 | Manager: ₹15,000)
- Automatic GL posting on final approval
- Batch payment processing with bank file upload/download
- Receipt upload for specific transport modes (Cab, Bus, Auto, Train)
- Real-time status tracking and rejection reason capture

---

## **2. WORKFLOW SUMMARY**

### **Step 1: Employee Submits Conveyance Claim**

1. Employee logs into system and navigates to Conveyance Booking Form
2. Fills out claim details:
   - **Date of Visit**: Date when client visit happened
   - **Purpose**: Reason for visit (e.g., "Client meeting", "Site inspection")
   - **Client/Site Name**: Selected from Site Master dropdown or enter custom client
   - **Transport Mode**: Bike, Cab, Bus, Auto, Train (Receipt mandatory for Cab/Bus/Auto/Train)
   - **Distance**: Distance traveled in kilometers
   - **Amount Claimed**: Reimbursement amount (future: auto-calculation for Bike based on distance)
   - **Visit Report**: PDF upload (max 2 MB) - mandatory proof of client visit
   - **Receipt**: PDF upload (max 2 MB) - mandatory for paid transport modes
   - **Remarks**: Additional notes/comments
3. System validates:
   - Claim window (within 7 days after month-end for production; relaxed for testing)
   - Designation limit (total amount ≤ employee designation limit)
   - Mandatory fields and file uploads
4. On submit → Claim sent to employee's **Line Manager** (reportsTo field from user data)

**Note**: All employees including Managers, Operation Heads can raise requests. Hierarchy is auto-detected.

### **Step 2: Line Manager First-Level Approval**

1. Line Manager sees all claims from team members (assignedTo = Manager's username)
2. Manager verifies:
   - Visit report PDF attachment
   - Client/site name and purpose alignment
   - Distance reasonableness
   - Amount claimed vs transport mode
3. Manager Actions:
   - **Approve**: Claim moves to VP Operations (manager's reportsTo)
   - **Reject**: Sent back to employee with mandatory rejection remarks

### **Step 3: VP Operations Second-Level Approval**

1. VP sees all manager-approved claims (assignedTo = VP's username)
2. VP validates:
   - Overall claim validity
   - Amount reasonableness
   - Transport mode appropriateness
3. VP Actions:
   - **Approve**: Claim moves to Account Executive (status: "Pending AE Approval")
   - **Reject**: Sent back to employee with mandatory rejection remarks

### **Step 4: Account Executive Final Approval & GL Posting**

1. AE sees all VP-approved claims
2. AE performs final verification:
   - Cross-check visit report and client details
   - Verify amount calculation
   - Ensure all approvals are proper
3. AE Actions:
   - **Approve**:
     - System automatically posts GL entries (Expense Voucher)
     - Expense Voucher generated with format: `EXP/CONV/{Site}/{Year}/nnnn`
     - Transaction posted to ledger
     - Status: "Approved" + "Pending Payment"
     - Request moved to `processedConveyanceRequests` for payment processing
   - **Reject**: Sent back to employee with mandatory rejection remarks

#### **GL Entries Posted on AE Approval:**

| Line | GL Code  | GL Name                   | Debit (₹)    | Credit (₹)   | Description                    |
| ---- | -------- | ------------------------- | ------------ | ------------ | ------------------------------ |
| 1    | X2001003 | BRANCH CONVEYANCE EXPENSE | Claim Amount | -            | Conveyance expense recognition |
| 2    | L2001001 | CONVEYANCE PAYABLE        | -            | Claim Amount | Liability to employee          |

**Parent GL Codes:**

- X2001: Branch Management (Parent for X2001003)
- L2001: Liability - Employees (Parent for L2001001)

### **Step 5: Payment Execution (Through Process of Payments Feature)**

1. AE navigates to **Process of Payments** → **Conveyance Tab**
2. System displays all approved conveyance requests with `paymentStatus = "Pending Payment"`
3. AE selects requests for payment
4. **Download Bank Upload File** (Excel format for bank portal):
   - Employee Name, Employee ID, Amount, Bank Account Details
5. **Download System Upload File** (Template for UTR entry):
   - Same as Bank file + additional column for UTR Number
6. After processing payment in bank portal:
   - AE enters UTR numbers in System Upload File
   - Uploads updated file back to ERP
7. AE selects Bank from Bank Master dropdown
8. System automatically posts **Payment GL Entries**:
   - Dr L2001001 (Conveyance Payable) - reduces liability
   - Cr A3004001\_{BankCode} (Bank Account) - reduces bank balance
9. Payment status updated to "Paid"
10. Payment history recorded with UTR, date, bank details

#### **GL Entries Posted on Payment Execution:**

| Line | GL Code          | GL Name            | Debit (₹)          | Credit (₹)         | Description               |
| ---- | ---------------- | ------------------ | ------------------ | ------------------ | ------------------------- |
| 1    | L2001001         | CONVEYANCE PAYABLE | Total Batch Amount | -                  | Clears employee liability |
| 2    | A3004001\_{Bank} | {Bank Name}        | -                  | Total Batch Amount | Bank payment              |

**Parent GL Codes:**

- L2001: Liability - Employees (Parent for L2001001)
- A3004001: Bank Accounts (Parent for bank GL codes)

**Payment Voucher Format:** `PAY/CONV/BANK/{Year}/nnnn`

---

## **3. GL CODE STRUCTURE**

### **3.1 Conveyance Expense GL Code**

| GL Code  | GL Name                   | Parent Code | Parent Name       | Nature  | Description                               |
| -------- | ------------------------- | ----------- | ----------------- | ------- | ----------------------------------------- |
| X2001003 | BRANCH CONVEYANCE EXPENSE | X2001       | BRANCH MANAGEMENT | EXPENSE | Employee conveyance reimbursement expense |

**Usage:**

- **DR** on AE approval (recognizes conveyance expense)
- Increases expense account balance

### **3.2 Conveyance Payable GL Code**

| GL Code  | GL Name            | Parent Code | Parent Name           | Nature    | Description                                |
| -------- | ------------------ | ----------- | --------------------- | --------- | ------------------------------------------ |
| L2001001 | CONVEYANCE PAYABLE | L2001       | LIABILITY - EMPLOYEES | LIABILITY | Amount payable to employees for conveyance |

**Usage:**

- **CR** on AE approval (creates liability to employee)
- **DR** on payment execution (clears liability)
- Shared liability account for all employees (no individual employee ledgers)

### **3.3 Bank GL Codes (Payment Stage)**

**Format:** `A3004001_{BankCode}` (e.g., A3004001_HDFC, A3004001_ICICI)

**Parent Code:** A3004001 (BANK ACCOUNTS)

**Usage:**

- **CR** on payment execution (reduces bank balance)
- Each bank has unique GL code under parent A3004001

### **3.4 Voucher Number Formats**

| Voucher Type    | Format                            | Example                 | Purpose                                           |
| --------------- | --------------------------------- | ----------------------- | ------------------------------------------------- |
| Expense Voucher | EXP/CONV/{Site}/{Year}/{Sequence} | EXP/CONV/MH01/2026/0001 | Initial conveyance expense booking on AE approval |
| Payment Voucher | PAY/CONV/BANK/{Year}/{Sequence}   | PAY/CONV/BANK/2026/0001 | Batch bank payment for multiple conveyance claims |

**Note:**

- Expense Voucher: One per claim (individual employee)
- Payment Voucher: One per batch (multiple employees paid together)

---

## **4. API ENDPOINTS**

---

## **PART 1: EMPLOYEE CONVEYANCE SUBMISSION**

---

### **1. API TO SUBMIT CONVEYANCE CLAIM**

**Endpoint:** `POST /api/conveyance/submit`

**Description:** Employee submits a new conveyance claim for reimbursement. Automatically assigns to employee's reporting manager.

#### **Request**

**Headers:**

```json
{
  "Authorization": "Bearer {token}",
  "Content-Type": "multipart/form-data"
}
```

**Body (Form Data):**

| Field        | Type                | Required | Description                                                  |
| ------------ | ------------------- | -------- | ------------------------------------------------------------ |
| date         | String (YYYY-MM-DD) | Yes      | Date of client visit                                         |
| purpose      | String              | Yes      | Purpose of visit (e.g., "Client meeting", "Site inspection") |
| client       | String              | Yes      | Client/Site name from dropdown or custom entry               |
| customClient | String              | No       | Custom client name if "Other" selected in dropdown           |
| transport    | String              | Yes      | Transport mode: "Bike", "Cab", "Bus", "Auto", "Train"        |
| distance     | Number              | Yes      | Distance traveled in kilometers                              |
| amount       | Number              | Yes      | Reimbursement amount claimed                                 |
| reports      | File[]              | Yes      | Visit report PDF(s) - max 2 MB per file                      |
| receipts     | File[]              | No       | Receipt PDF(s) - mandatory for Cab/Bus/Auto/Train            |
| remarks      | String              | No       | Additional comments/notes                                    |

**Example Request:**

```
POST /api/conveyance/submit

Form Data:
- date: 2026-02-01
- purpose: Client site inspection and requirement gathering
- client: ABC Corporation
- transport: Cab
- distance: 35
- amount: 850
- reports: [visit_report.pdf]
- receipts: [cab_receipt.pdf]
- remarks: Traffic was heavy, took longer route
```

#### **Backend Processing Flow:**

1. **User Validation**
   - Verify user is authenticated
   - Get user details from `users` localStorage
   - Check if user has `reportsTo` field (reporting manager assigned)

2. **Claim Window Validation**
   - **Production Logic**: Must submit within 7 days after month-end

     ```javascript
     // Claims can only be submitted between 1st-7th of month
     // For previous month's expenses
     const today = new Date()
     const todayDay = today.getDate()
     const inClaimWeek = todayDay >= 1 && todayDay <= 7

     const visitMonth = visitDate.getMonth()
     const visitYear = visitDate.getFullYear()
     const visitBeforeCurrentMonth =
       visitYear < todayYear || (visitYear === todayYear && visitMonth < todayMonth)

     if (!inClaimWeek || !visitBeforeCurrentMonth) {
       return error
     }
     ```

   - **Testing Mode**: Relaxed validation (last 30 days to next 7 days allowed)

3. **Designation Limit Validation**
   - Get employee designation from user data
   - Designation limits:
     ```javascript
     const designationLimits = {
       Junior: 5000,
       Senior: 10000,
       Manager: 15000,
     }
     ```
   - Total amount must not exceed designation limit

4. **Form Validation**
   - All required fields present
   - Date format valid (YYYY-MM-DD)
   - Distance and amount are positive numbers
   - At least one visit report uploaded
   - If transport is Cab/Bus/Auto/Train → Receipt mandatory
   - File size check: Each file ≤ 2 MB
   - File type check: Only PDF allowed

5. **File Processing**
   - Store file metadata (name, type, size, lastModified)
   - In production: Upload to file server and store URL
   - In current implementation: Store file metadata in localStorage

6. **Request Creation**
   - Generate unique request ID (timestamp-based)
   - Set initial status: "Pending Manager Approval"
   - Assign to reporting manager (userData.reportsTo)
   - Set current approval level: "line-manager"
   - Initialize approvers array (empty)
   - Initialize rejections array (empty)

7. **Save to Storage**
   - Append to `conveyanceRequests` array in localStorage
   - Structure:
     ```javascript
     {
       id: "timestamp_unique_id",
       date: "2026-02-01",
       purpose: "...",
       client: "...",
       transport: "Cab",
       distance: 35,
       amount: 850,
       reports: [{name, type, size, lastModified}],
       receipts: [{name, type, size, lastModified}],
       remarks: "...",
       submittedAt: "2026-02-04T10:30:00.000Z",
       submittedBy: "emp5",
       employeeId: "5",
       employeeName: "John Doe",
       status: "Pending Manager Approval",
       assignedTo: "manager1",
       currentLevel: "line-manager",
       approvers: [],
       rejections: []
     }
     ```

#### **Response**

**Success (201 Created):**

```json
{
  "success": true,
  "data": {
    "requestId": "1738659000000",
    "submittedAt": "2026-02-04T10:30:00.000Z",
    "status": "Pending Manager Approval",
    "assignedTo": "manager1",
    "employeeId": "5",
    "employeeName": "John Doe",
    "claimDetails": {
      "date": "2026-02-01",
      "client": "ABC Corporation",
      "amount": 850,
      "transport": "Cab",
      "distance": 35
    }
  },
  "message": "Conveyance request submitted successfully!"
}
```

**Error (400 Bad Request - Claim Window):**

```json
{
  "success": false,
  "error": "Claim Window Violation",
  "message": "Date 2026-02-01 is outside the allowed claim window (1st-7th of month for previous month's expenses)"
}
```

**Error (400 Bad Request - Designation Limit):**

```json
{
  "success": false,
  "error": "Designation Limit Exceeded",
  "message": "Total amount (₹12,000) exceeds your designation limit (₹10,000 for Senior)"
}
```

**Error (400 Bad Request - Missing Receipt):**

```json
{
  "success": false,
  "error": "Receipt Required",
  "message": "Receipt is mandatory for transport mode: Cab"
}
```

**Error (400 Bad Request - No Reporting Manager):**

```json
{
  "success": false,
  "error": "No Reporting Manager",
  "message": "No reporting manager assigned. Cannot submit request."
}
```

**Error (413 Payload Too Large):**

```json
{
  "success": false,
  "error": "File Too Large",
  "message": "Visit report file exceeds 2 MB limit"
}
```

---

### **2. API TO GET MY CONVEYANCE REQUESTS**

**Endpoint:** `GET /api/conveyance/my-requests`

**Description:** Retrieves all conveyance requests submitted by the logged-in employee.

#### **Request**

**Headers:**

```json
{
  "Authorization": "Bearer {token}",
  "Content-Type": "application/json"
}
```

**Query Parameters:**

| Parameter | Type                | Required | Description                                                                                 |
| --------- | ------------------- | -------- | ------------------------------------------------------------------------------------------- |
| status    | String              | No       | Filter by status (e.g., "Pending Manager Approval", "Approved", "Rejected by Line Manager") |
| client    | String              | No       | Filter by client name (partial match)                                                       |
| date      | String (YYYY-MM-DD) | No       | Filter by visit date                                                                        |
| page      | Integer             | No       | Page number (default: 1)                                                                    |
| limit     | Integer             | No       | Records per page (default: 5)                                                               |

**Example Request:**

```
GET /api/conveyance/my-requests?status=Pending Manager Approval&page=1&limit=5
```

#### **Response**

**Success (200 OK):**

```json
{
  "success": true,
  "data": {
    "requests": [
      {
        "id": "1738659000000",
        "date": "2026-02-01",
        "purpose": "Client site inspection and requirement gathering",
        "client": "ABC Corporation",
        "transport": "Cab",
        "distance": 35,
        "amount": 850,
        "status": "Pending Manager Approval",
        "submittedAt": "2026-02-04T10:30:00.000Z",
        "assignedTo": "manager1",
        "currentLevel": "line-manager",
        "hasReports": true,
        "hasReceipts": true,
        "remarks": "Traffic was heavy, took longer route"
      },
      {
        "id": "1738572600000",
        "date": "2026-01-28",
        "purpose": "Client meeting for new project discussion",
        "client": "XYZ Industries",
        "transport": "Bike",
        "distance": 22,
        "amount": 220,
        "status": "Approved",
        "submittedAt": "2026-02-03T15:20:00.000Z",
        "assignedTo": null,
        "currentLevel": "completed",
        "voucherNumber": "EXP/CONV/MH01/2026/0001",
        "aeApprovedAt": "2026-02-04T09:15:00.000Z",
        "aeApprovedBy": "ae1",
        "paymentStatus": "Pending Payment"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 2,
      "totalRecords": 8,
      "recordsPerPage": 5
    },
    "summary": {
      "totalRequests": 8,
      "pendingApproval": 3,
      "approved": 4,
      "rejected": 1,
      "totalAmountClaimed": 6420
    }
  },
  "message": "Conveyance requests retrieved successfully"
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

### **3. API TO VIEW REJECTION REASON**

**Endpoint:** `GET /api/conveyance/rejection-reason/:requestId`

**Description:** Retrieves detailed rejection reason for a rejected conveyance request.

#### **Request**

**Headers:**

```json
{
  "Authorization": "Bearer {token}",
  "Content-Type": "application/json"
}
```

**Path Parameters:**

| Parameter | Type   | Required | Description       |
| --------- | ------ | -------- | ----------------- |
| requestId | String | Yes      | Unique request ID |

**Example Request:**

```
GET /api/conveyance/rejection-reason/1738572600000
```

#### **Response**

**Success (200 OK):**

```json
{
  "success": true,
  "data": {
    "requestId": "1738572600000",
    "status": "Rejected by Line Manager",
    "rejectedBy": "manager1",
    "rejectedAt": "2026-02-04T11:30:00.000Z",
    "rejectionLevel": "line-manager",
    "rejectionReason": "Visit report does not clearly show client signature. Distance claimed (35 km) seems excessive for this client location. Please resubmit with proper documentation.",
    "requestDetails": {
      "date": "2026-02-01",
      "client": "ABC Corporation",
      "amount": 850,
      "transport": "Cab"
    }
  },
  "message": "Rejection details retrieved successfully"
}
```

**Error (404 Not Found):**

```json
{
  "success": false,
  "error": "Request Not Found",
  "message": "Conveyance request with ID 1738572600000 does not exist"
}
```

---

## **PART 2: LINE MANAGER APPROVAL**

---

### **4. API TO GET PENDING CONVEYANCE REQUESTS FOR MANAGER**

**Endpoint:** `GET /api/conveyance/manager/pending`

**Description:** Retrieves all conveyance requests pending approval from Line Manager.

#### **Request**

**Headers:**

```json
{
  "Authorization": "Bearer {token}",
  "Content-Type": "application/json"
}
```

**Query Parameters:**

| Parameter | Type                | Required | Description                                                                                                           |
| --------- | ------------------- | -------- | --------------------------------------------------------------------------------------------------------------------- |
| status    | String              | No       | Filter: "Pending" (Pending Manager Approval), "Approved" (Pending VP Approval), "Rejected" (Rejected by Line Manager) |
| employee  | String              | No       | Filter by employee name (partial match)                                                                               |
| date      | String (YYYY-MM-DD) | No       | Filter by visit date                                                                                                  |
| transport | String              | No       | Filter by transport mode                                                                                              |
| page      | Integer             | No       | Page number (default: 1)                                                                                              |
| limit     | Integer             | No       | Records per page (default: 5)                                                                                         |

**Example Request:**

```
GET /api/conveyance/manager/pending?status=Pending&page=1&limit=5
```

#### **Response**

**Success (200 OK):**

```json
{
  "success": true,
  "data": {
    "requests": [
      {
        "id": "1738659000000",
        "employeeId": "5",
        "employeeName": "John Doe",
        "designation": "Senior Executive",
        "department": "Sales",
        "date": "2026-02-01",
        "purpose": "Client site inspection and requirement gathering",
        "client": "ABC Corporation",
        "transport": "Cab",
        "distance": 35,
        "amount": 850,
        "status": "Pending Manager Approval",
        "submittedAt": "2026-02-04T10:30:00.000Z",
        "reports": [
          {
            "name": "visit_report.pdf",
            "type": "application/pdf",
            "size": 524288
          }
        ],
        "receipts": [
          {
            "name": "cab_receipt.pdf",
            "type": "application/pdf",
            "size": 102400
          }
        ],
        "remarks": "Traffic was heavy, took longer route"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 2,
      "totalRecords": 7,
      "recordsPerPage": 5
    },
    "summary": {
      "totalPending": 7,
      "totalAmount": 5240,
      "byTransportMode": {
        "Bike": 3,
        "Cab": 2,
        "Bus": 1,
        "Train": 1
      }
    }
  },
  "message": "Pending manager approvals retrieved successfully"
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

### **5. API TO APPROVE CONVEYANCE REQUEST (BY LINE MANAGER)**

**Endpoint:** `POST /api/conveyance/manager/approve`

**Description:** Line Manager approves a conveyance request and forwards it to VP Operations.

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
  "requestId": "1738659000000"
}
```

**Body Parameters:**

| Parameter | Type   | Required | Description                  |
| --------- | ------ | -------- | ---------------------------- |
| requestId | String | Yes      | Unique request ID to approve |

#### **Backend Processing Flow:**

1. **Request Validation**
   - Check request exists and is in "Pending Manager Approval" status
   - Verify current user is the assigned manager (assignedTo = currentUser.username)

2. **Get VP Assignment**
   - Fetch manager's user data from `users` localStorage
   - Get manager's reporting VP: `manager.reportsTo`
   - If no VP found → Error

3. **Update Request**
   - Change status: "Pending VP Approval"
   - Set assignedTo: VP's username
   - Set currentLevel: "vp"
   - Update approvedAt: current timestamp
   - Update approvedBy: manager's username
   - Add to approvers array:
     ```javascript
     approvers: [
       {
         level: 'line-manager',
         user: 'manager1',
         action: 'approved',
         date: '2026-02-04T12:15:00.000Z',
       },
     ]
     ```

4. **Save Update**
   - Update `conveyanceRequests` localStorage
   - Dispatch `conveyanceUpdated` event for real-time updates

#### **Response**

**Success (200 OK):**

```json
{
  "success": true,
  "data": {
    "requestId": "1738659000000",
    "previousStatus": "Pending Manager Approval",
    "newStatus": "Pending VP Approval",
    "approvedBy": "manager1",
    "approvedAt": "2026-02-04T12:15:00.000Z",
    "assignedTo": "vp_operations",
    "employeeName": "John Doe",
    "amount": 850,
    "client": "ABC Corporation"
  },
  "message": "Sent to VP vp_operations for approval"
}
```

**Error (400 Bad Request - Invalid Status):**

```json
{
  "success": false,
  "error": "Invalid Status",
  "message": "Request is not in 'Pending Manager Approval' status"
}
```

**Error (403 Forbidden):**

```json
{
  "success": false,
  "error": "Unauthorized Approval",
  "message": "You are not assigned to approve this request"
}
```

**Error (404 Not Found):**

```json
{
  "success": false,
  "error": "Request Not Found",
  "message": "Conveyance request with ID 1738659000000 does not exist"
}
```

---

### **6. API TO REJECT CONVEYANCE REQUEST (BY LINE MANAGER)**

**Endpoint:** `POST /api/conveyance/manager/reject`

**Description:** Line Manager rejects a conveyance request and sends it back to employee with rejection reason.

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
  "requestId": "1738659000000",
  "reason": "Visit report does not clearly show client signature. Distance claimed (35 km) seems excessive for this client location. Please resubmit with proper documentation."
}
```

**Body Parameters:**

| Parameter | Type   | Required | Description                                            |
| --------- | ------ | -------- | ------------------------------------------------------ |
| requestId | String | Yes      | Unique request ID to reject                            |
| reason    | String | Yes      | Mandatory rejection reason/remarks (must not be empty) |

#### **Backend Processing Flow:**

1. **Validation**
   - Check request exists
   - Verify rejection reason is not empty (trim whitespace)
   - Verify current user is assigned manager

2. **Update Request**
   - Change status: "Rejected by Line Manager"
   - Set rejectedAt: current timestamp
   - Set rejectedBy: manager's username
   - Set rejectionReason: provided reason
   - Set currentLevel: "rejected"
   - Add to rejections array:
     ```javascript
     rejections: [
       {
         level: 'line-manager',
         user: 'manager1',
         reason: 'Visit report does not clearly show...',
         date: '2026-02-04T12:20:00.000Z',
         rejectedBy: 'manager1',
       },
     ]
     ```

3. **Save and Notify**
   - Update `conveyanceRequests` localStorage
   - Dispatch `conveyanceUpdated` event

#### **Response**

**Success (200 OK):**

```json
{
  "success": true,
  "data": {
    "requestId": "1738659000000",
    "status": "Rejected by Line Manager",
    "rejectedBy": "manager1",
    "rejectedAt": "2026-02-04T12:20:00.000Z",
    "rejectionReason": "Visit report does not clearly show client signature. Distance claimed (35 km) seems excessive for this client location. Please resubmit with proper documentation.",
    "employeeName": "John Doe",
    "amount": 850
  },
  "message": "Request rejected"
}
```

**Error (400 Bad Request - Missing Reason):**

```json
{
  "success": false,
  "error": "Validation Error",
  "message": "Rejection reason is mandatory"
}
```

**Error (404 Not Found):**

```json
{
  "success": false,
  "error": "Request Not Found",
  "message": "Conveyance request with ID 1738659000000 does not exist"
}
```

---

## **PART 3: VP OPERATIONS APPROVAL**

---

### **7. API TO GET PENDING CONVEYANCE REQUESTS FOR VP**

**Endpoint:** `GET /api/conveyance/vp/pending`

**Description:** Retrieves all conveyance requests pending approval from VP Operations.

#### **Request**

**Headers:**

```json
{
  "Authorization": "Bearer {token}",
  "Content-Type": "application/json"
}
```

**Query Parameters:**

| Parameter | Type                | Required | Description                                                                                   |
| --------- | ------------------- | -------- | --------------------------------------------------------------------------------------------- |
| status    | String              | No       | Filter: "Pending" (Pending VP Approval), "Approved" (Sent to AE), "Rejected" (Rejected by VP) |
| employee  | String              | No       | Filter by employee name (partial match)                                                       |
| date      | String (YYYY-MM-DD) | No       | Filter by visit date                                                                          |
| manager   | String              | No       | Filter by approving manager name                                                              |
| page      | Integer             | No       | Page number (default: 1)                                                                      |
| limit     | Integer             | No       | Records per page (default: 5)                                                                 |

**Example Request:**

```
GET /api/conveyance/vp/pending?status=Pending&page=1&limit=5
```

#### **Response**

**Success (200 OK):**

```json
{
  "success": true,
  "data": {
    "requests": [
      {
        "id": "1738659000000",
        "employeeId": "5",
        "employeeName": "John Doe",
        "designation": "Senior Executive",
        "date": "2026-02-01",
        "client": "ABC Corporation",
        "transport": "Cab",
        "distance": 35,
        "amount": 850,
        "status": "Pending VP Approval",
        "submittedAt": "2026-02-04T10:30:00.000Z",
        "approvedByManager": "manager1",
        "managerApprovedAt": "2026-02-04T12:15:00.000Z",
        "reports": [
          {
            "name": "visit_report.pdf",
            "type": "application/pdf",
            "size": 524288
          }
        ],
        "receipts": [
          {
            "name": "cab_receipt.pdf",
            "type": "application/pdf",
            "size": 102400
          }
        ]
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalRecords": 4,
      "recordsPerPage": 5
    },
    "summary": {
      "totalPending": 4,
      "totalAmount": 3120
    }
  },
  "message": "Pending VP approvals retrieved successfully"
}
```

---

### **8. API TO APPROVE CONVEYANCE REQUEST (BY VP)**

**Endpoint:** `POST /api/conveyance/vp/approve`

**Description:** VP Operations approves a conveyance request and forwards it to Account Executive for final approval and GL posting.

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
  "requestId": "1738659000000"
}
```

**Body Parameters:**

| Parameter | Type   | Required | Description                  |
| --------- | ------ | -------- | ---------------------------- |
| requestId | String | Yes      | Unique request ID to approve |

#### **Backend Processing Flow:**

1. **Request Validation**
   - Check request exists and is in "Pending VP Approval" status
   - Verify current user is the assigned VP

2. **Update Request**
   - Change status: "Pending AE Approval"
   - Set assignedTo: null (moves to AE queue, no specific assignment)
   - Set currentLevel: "account-executive"
   - Update vpApprovedAt: current timestamp
   - Update vpApprovedBy: VP's username
   - Add to approvers array:
     ```javascript
     approvers: [
       {
         level: 'line-manager',
         user: 'manager1',
         action: 'approved',
         date: '2026-02-04T12:15:00.000Z',
       },
       {
         level: 'vp',
         user: 'vp_operations',
         action: 'approved',
         date: '2026-02-04T14:30:00.000Z',
       },
     ]
     ```

3. **Save Update**
   - Update `conveyanceRequests` localStorage
   - Dispatch `conveyanceUpdated` event

#### **Response**

**Success (200 OK):**

```json
{
  "success": true,
  "data": {
    "requestId": "1738659000000",
    "previousStatus": "Pending VP Approval",
    "newStatus": "Pending AE Approval",
    "approvedBy": "vp_operations",
    "approvedAt": "2026-02-04T14:30:00.000Z",
    "employeeName": "John Doe",
    "amount": 850,
    "nextApprover": "Account Executive"
  },
  "message": "Sent to Account Executive for final approval"
}
```

**Error (400 Bad Request):**

```json
{
  "success": false,
  "error": "Invalid Status",
  "message": "Request is not in 'Pending VP Approval' status"
}
```

---

### **9. API TO REJECT CONVEYANCE REQUEST (BY VP)**

**Endpoint:** `POST /api/conveyance/vp/reject`

**Description:** VP Operations rejects a conveyance request and sends it back to employee with rejection reason.

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
  "requestId": "1738659000000",
  "reason": "Amount claimed is not justified for the client location. Standard cab fare for this distance should be around ₹500. Please resubmit with correct amount."
}
```

**Body Parameters:**

| Parameter | Type   | Required | Description                        |
| --------- | ------ | -------- | ---------------------------------- |
| requestId | String | Yes      | Unique request ID to reject        |
| reason    | String | Yes      | Mandatory rejection reason/remarks |

#### **Response**

**Success (200 OK):**

```json
{
  "success": true,
  "data": {
    "requestId": "1738659000000",
    "status": "Rejected by VP",
    "rejectedBy": "vp_operations",
    "rejectedAt": "2026-02-04T14:35:00.000Z",
    "rejectionReason": "Amount claimed is not justified for the client location. Standard cab fare for this distance should be around ₹500. Please resubmit with correct amount.",
    "employeeName": "John Doe",
    "amount": 850
  },
  "message": "Request rejected by VP"
}
```

---

## **PART 4: ACCOUNT EXECUTIVE FINAL APPROVAL**

---

### **10. API TO GET PENDING CONVEYANCE REQUESTS FOR AE**

**Endpoint:** `GET /api/conveyance/ae/pending`

**Description:** Retrieves all conveyance requests pending final approval from Account Executive.

#### **Request**

**Headers:**

```json
{
  "Authorization": "Bearer {token}",
  "Content-Type": "application/json"
}
```

**Query Parameters:**

| Parameter | Type                | Required | Description                           |
| --------- | ------------------- | -------- | ------------------------------------- |
| client    | String              | No       | Filter by client name (partial match) |
| date      | String (YYYY-MM-DD) | No       | Filter by visit date                  |
| employee  | String              | No       | Filter by employee name               |
| page      | Integer             | No       | Page number (default: 1)              |
| limit     | Integer             | No       | Records per page (default: 5)         |

**Example Request:**

```
GET /api/conveyance/ae/pending?page=1&limit=5
```

#### **Response**

**Success (200 OK):**

```json
{
  "success": true,
  "data": {
    "requests": [
      {
        "id": "1738659000000",
        "employeeId": "5",
        "employeeName": "John Doe",
        "designation": "Senior Executive",
        "department": "Sales",
        "date": "2026-02-01",
        "purpose": "Client site inspection and requirement gathering",
        "client": "ABC Corporation",
        "transport": "Cab",
        "distance": 35,
        "amount": 850,
        "status": "Pending AE Approval",
        "submittedAt": "2026-02-04T10:30:00.000Z",
        "approvers": [
          {
            "level": "line-manager",
            "user": "manager1",
            "action": "approved",
            "date": "2026-02-04T12:15:00.000Z"
          },
          {
            "level": "vp",
            "user": "vp_operations",
            "action": "approved",
            "date": "2026-02-04T14:30:00.000Z"
          }
        ],
        "reports": [
          {
            "name": "visit_report.pdf",
            "type": "application/pdf",
            "size": 524288
          }
        ],
        "receipts": [
          {
            "name": "cab_receipt.pdf",
            "type": "application/pdf",
            "size": 102400
          }
        ]
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalRecords": 3,
      "recordsPerPage": 5
    },
    "summary": {
      "totalPending": 3,
      "totalAmount": 2650
    }
  },
  "message": "Pending AE approvals retrieved successfully"
}
```

---

### **11. API TO APPROVE CONVEYANCE REQUEST WITH GL POSTING (BY AE)**

**Endpoint:** `POST /api/conveyance/ae/approve`

**Description:** Account Executive gives final approval to conveyance request. System automatically posts GL entries (Expense Voucher) and generates voucher.

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
  "requestId": "1738659000000"
}
```

**Body Parameters:**

| Parameter | Type   | Required | Description                  |
| --------- | ------ | -------- | ---------------------------- |
| requestId | String | Yes      | Unique request ID to approve |

#### **Backend Processing Flow:**

1. **Request Validation**
   - Check request exists and is in "Pending AE Approval" status
   - Retrieve employee details from `users` localStorage

2. **GL Code Resolution**
   - Expense GL: X2001003 (BRANCH CONVEYANCE EXPENSE)
   - Payable GL: L2001001 (CONVEYANCE PAYABLE)
   - Retrieve GL names from `chartOfAccounts`

3. **Voucher Number Generation**
   - Get employee's site code (e.g., MH01, DL01, BLR01)
   - Format: `EXP/CONV/{Site}/{Year}/{Sequence}`
   - Example: `EXP/CONV/MH01/2026/0001`
   - Auto-increment counter in `voucherCounters` localStorage

4. **Create Transaction**
   - Transaction ID: `TXN_CONV_{timestamp}_{requestId}`
   - Voucher Type: "Expense Voucher"
   - Date: Current date (approval date, not claim date)
   - Entries:
     ```javascript
     ;[
       {
         lineNo: 1,
         glCode: 'X2001003',
         glName: 'BRANCH CONVEYANCE EXPENSE',
         debit: 850,
         credit: 0,
         narration: 'Conveyance claim - John Doe',
         employeeId: '5',
         costCenter: 'MH01',
       },
       {
         lineNo: 2,
         glCode: 'L2001001',
         glName: 'CONVEYANCE PAYABLE',
         debit: 0,
         credit: 850,
         narration: 'Conveyance payable - John Doe',
         employeeId: '5',
         costCenter: 'MH01',
       },
     ]
     ```

5. **Post Transaction**
   - Save transaction to `transactions` localStorage
   - Validate balance: totalDebit = totalCredit

6. **Update Ledger Balances**
   - Update X2001003 balance: Increase by debit amount
   - Update L2001001 balance: Increase by credit amount
   - Save updated `chartOfAccounts`

7. **Create Expense Voucher**
   - Generate voucher data structure with:
     - Header info (company, voucher no, date, reference)
     - Employee details (ID, name, designation, department)
     - Conveyance details (date, client, purpose, transport, distance, amount)
     - Approval chain (Manager → VP → AE)
     - GL entries (expense and payable)
   - Save to `conveyanceVouchers` localStorage

8. **Update Request Status**
   - Change status: "Approved"
   - Set aeApprovedAt: current timestamp
   - Set aeApprovedBy: AE's username
   - Set currentLevel: "completed"
   - Set voucherNumber: generated voucher number
   - Set transactionId: transaction ID
   - Set paymentStatus: "Pending Payment"
   - Add to approvers array:
     ```javascript
     {
       level: "account-executive",
       user: "ae1",
       action: "approved",
       date: "2026-02-04T16:00:00.000Z"
     }
     ```

9. **Move to Processed Queue**
   - Save to `processedConveyanceRequests` localStorage
   - Keep in `conveyanceRequests` for history
   - Structure includes:
     - Original request data
     - All approval details
     - Voucher number
     - Transaction ID
     - Payment status: "Pending Payment"
     - Payment history: [] (empty initially)
     - GL entries

10. **Dispatch Events**
    - Dispatch `conveyanceUpdated` event for real-time UI updates

#### **Response**

**Success (200 OK):**

```json
{
  "success": true,
  "data": {
    "requestId": "1738659000000",
    "status": "Approved",
    "aeApprovedBy": "ae1",
    "aeApprovedAt": "2026-02-04T16:00:00.000Z",
    "voucherNumber": "EXP/CONV/MH01/2026/0001",
    "transactionId": "TXN_CONV_1738688400000_1738659000000",
    "paymentStatus": "Pending Payment",
    "employeeDetails": {
      "employeeId": "5",
      "employeeName": "John Doe",
      "designation": "Senior Executive",
      "department": "Sales"
    },
    "conveyanceDetails": {
      "date": "2026-02-01",
      "client": "ABC Corporation",
      "purpose": "Client site inspection and requirement gathering",
      "transport": "Cab",
      "distance": 35,
      "amount": 850
    },
    "glEntries": [
      {
        "lineNo": 1,
        "glCode": "X2001003",
        "glName": "BRANCH CONVEYANCE EXPENSE",
        "debit": 850,
        "credit": 0,
        "narration": "Conveyance claim - John Doe"
      },
      {
        "lineNo": 2,
        "glCode": "L2001001",
        "glName": "CONVEYANCE PAYABLE",
        "debit": 0,
        "credit": 850,
        "narration": "Conveyance payable - John Doe"
      }
    ],
    "voucher": {
      "voucherNo": "EXP/CONV/MH01/2026/0001",
      "voucherType": "Expense Voucher",
      "date": "2026-02-04",
      "totalDebit": 850,
      "totalCredit": 850
    }
  },
  "message": "Request approved, GL posted and voucher generated"
}
```

**Error (400 Bad Request):**

```json
{
  "success": false,
  "error": "Invalid Status",
  "message": "Request is not in 'Pending AE Approval' status"
}
```

**Error (500 Internal Server Error - GL Posting Failed):**

```json
{
  "success": false,
  "error": "GL Posting Failed",
  "message": "Failed to post transaction: Total Debit (850) does not match Total Credit (860)"
}
```

---

### **12. API TO REJECT CONVEYANCE REQUEST (BY AE)**

**Endpoint:** `POST /api/conveyance/ae/reject`

**Description:** Account Executive rejects a conveyance request and sends it back to employee with rejection reason.

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
  "requestId": "1738659000000",
  "reason": "Visit report is not clear enough. Client signature is missing. Amount calculation does not match with standard conveyance rates. Please resubmit with proper documentation."
}
```

**Body Parameters:**

| Parameter | Type   | Required | Description                        |
| --------- | ------ | -------- | ---------------------------------- |
| requestId | String | Yes      | Unique request ID to reject        |
| reason    | String | Yes      | Mandatory rejection reason/remarks |

#### **Response**

**Success (200 OK):**

```json
{
  "success": true,
  "data": {
    "requestId": "1738659000000",
    "status": "Rejected by AE",
    "rejectedBy": "ae1",
    "rejectedAt": "2026-02-04T16:05:00.000Z",
    "rejectionReason": "Visit report is not clear enough. Client signature is missing. Amount calculation does not match with standard conveyance rates. Please resubmit with proper documentation.",
    "employeeName": "John Doe",
    "amount": 850
  },
  "message": "Request rejected by Account Executive"
}
```

---

### **13. API TO VIEW EXPENSE VOUCHER**

**Endpoint:** `GET /api/conveyance/voucher/:requestId`

**Description:** Retrieves the Expense Voucher generated for an approved conveyance request.

#### **Request**

**Headers:**

```json
{
  "Authorization": "Bearer {token}",
  "Content-Type": "application/json"
}
```

**Path Parameters:**

| Parameter | Type   | Required | Description                              |
| --------- | ------ | -------- | ---------------------------------------- |
| requestId | String | Yes      | Unique request ID (or can use voucherNo) |

**Example Request:**

```
GET /api/conveyance/voucher/1738659000000
```

#### **Response**

**Success (200 OK):**

```json
{
  "success": true,
  "data": {
    "header": {
      "company": "ISmart",
      "voucherNo": "EXP/CONV/MH01/2026/0001",
      "financialYear": "2026-2027",
      "date": "2026-02-04",
      "reference": "Conveyance Reimbursement - John Doe",
      "preparedBy": "ae1",
      "expenseType": "Conveyance Expense",
      "department": "Sales",
      "approvalChain": "Manager → VP → Account Executive",
      "voucherType": "Expense Voucher",
      "transactionId": "TXN_CONV_1738688400000_1738659000000"
    },
    "employeeDetails": {
      "employeeId": "5",
      "employeeName": "John Doe",
      "designation": "Senior Executive",
      "department": "Sales",
      "manager": "manager1",
      "submissionDate": "2026-02-04",
      "approvalDate": "2026-02-04"
    },
    "conveyanceDetails": [
      {
        "id": 1,
        "date": "2026-02-01",
        "clientName": "ABC Corporation",
        "fromLocation": "Office",
        "toLocation": "Client Location",
        "purpose": "Client site inspection and requirement gathering",
        "modeOfTransport": "Cab",
        "distance": "35 km",
        "amount": 850,
        "billAttached": "Yes"
      }
    ],
    "approvals": {
      "preparer": "ae1",
      "reviewer": "manager1",
      "approver": "vp_operations",
      "date": "2026-02-04"
    },
    "glEntries": [
      {
        "lineNo": 1,
        "glCode": "X2001003",
        "glName": "BRANCH CONVEYANCE EXPENSE",
        "debit": 850,
        "credit": 0,
        "costCenter": "MH01",
        "narration": "Conveyance claim - John Doe"
      },
      {
        "lineNo": 2,
        "glCode": "L2001001",
        "glName": "CONVEYANCE PAYABLE",
        "debit": 0,
        "credit": 850,
        "costCenter": "MH01",
        "narration": "Conveyance payable - John Doe"
      }
    ],
    "totals": {
      "debit": 850,
      "credit": 850,
      "balanced": true
    }
  },
  "message": "Expense Voucher retrieved successfully"
}
```

**Error (404 Not Found):**

```json
{
  "success": false,
  "error": "Voucher Not Found",
  "message": "Expense Voucher not found for request ID 1738659000000"
}
```

---

## **PART 5: PAYMENT PROCESSING**

---

### **14. API TO GET APPROVED CONVEYANCE REQUESTS FOR PAYMENT**

**Endpoint:** `GET /api/conveyance/payment/pending`

**Description:** Retrieves all approved conveyance requests pending payment processing. Used in Process of Payments → Conveyance Tab.

#### **Request**

**Headers:**

```json
{
  "Authorization": "Bearer {token}",
  "Content-Type": "application/json"
}
```

**Query Parameters:**

| Parameter  | Type                | Required | Description                             |
| ---------- | ------------------- | -------- | --------------------------------------- |
| employee   | String              | No       | Filter by employee name (partial match) |
| date       | String (YYYY-MM-DD) | No       | Filter by approval date                 |
| fromAmount | Number              | No       | Filter minimum amount                   |
| toAmount   | Number              | No       | Filter maximum amount                   |
| page       | Integer             | No       | Page number (default: 1)                |
| limit      | Integer             | No       | Records per page (default: 20)          |

**Example Request:**

```
GET /api/conveyance/payment/pending?page=1&limit=20
```

#### **Response**

**Success (200 OK):**

```json
{
  "success": true,
  "data": {
    "requests": [
      {
        "id": "1738659000000",
        "employeeId": "5",
        "employeeName": "John Doe",
        "designation": "Senior Executive",
        "department": "Sales",
        "date": "2026-02-01",
        "client": "ABC Corporation",
        "purpose": "Client site inspection and requirement gathering",
        "distance": 35,
        "amount": 850,
        "transport": "Cab",
        "voucherNo": "EXP/CONV/MH01/2026/0001",
        "approvedDate": "2026-02-04T16:00:00.000Z",
        "paymentStatus": "Pending Payment",
        "bankDetails": {
          "accountNumber": "1234567890",
          "ifscCode": "HDFC0001234",
          "bankName": "HDFC Bank"
        }
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 2,
      "totalRecords": 28,
      "recordsPerPage": 20
    },
    "summary": {
      "totalPendingPayment": 28,
      "totalAmount": 24650,
      "byDepartment": {
        "Sales": 12,
        "Operations": 8,
        "Marketing": 5,
        "IT": 3
      }
    }
  },
  "message": "Pending payment requests retrieved successfully"
}
```

---

### **15. API TO DOWNLOAD BANK UPLOAD FILE**

**Endpoint:** `POST /api/conveyance/payment/download-bank-file`

**Description:** Generates and downloads Excel file for bank payment portal upload.

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
  "requestIds": ["1738659000000", "1738572600000", "1738486200000"]
}
```

**Body Parameters:**

| Parameter  | Type             | Required | Description                                     |
| ---------- | ---------------- | -------- | ----------------------------------------------- |
| requestIds | Array of Strings | Yes      | List of request IDs to include in payment batch |

#### **Response**

**Success (200 OK):**
Returns Excel file (application/vnd.openxmlformats-officedocument.spreadsheetml.sheet)

**File Name:** `Conveyance_Bank_Upload_YYYYMMDD_HHMMSS.xlsx`

**Excel Structure:**

| Employee Name | Employee ID | Amount | Bank Account | IFSC Code    | Bank Name  | Purpose                  | Date       |
| ------------- | ----------- | ------ | ------------ | ------------ | ---------- | ------------------------ | ---------- |
| John Doe      | 5           | 850    | 1234567890   | HDFC0001234  | HDFC Bank  | Conveyance Reimbursement | 2026-02-04 |
| Jane Smith    | 8           | 1200   | 9876543210   | ICICI0005678 | ICICI Bank | Conveyance Reimbursement | 2026-02-04 |

---

### **16. API TO DOWNLOAD SYSTEM UPLOAD FILE (WITH UTR COLUMN)**

**Endpoint:** `POST /api/conveyance/payment/download-system-file`

**Description:** Generates and downloads Excel template for UTR entry after bank payment.

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
  "requestIds": ["1738659000000", "1738572600000", "1738486200000"]
}
```

**Body Parameters:**

| Parameter  | Type             | Required | Description                                     |
| ---------- | ---------------- | -------- | ----------------------------------------------- |
| requestIds | Array of Strings | Yes      | List of request IDs to include in payment batch |

#### **Response**

**Success (200 OK):**
Returns Excel file (application/vnd.openxmlformats-officedocument.spreadsheetml.sheet)

**File Name:** `Conveyance_System_Upload_YYYYMMDD_HHMMSS.xlsx`

**Excel Structure:**

| Employee Name | Employee ID | Amount | UTR | Client          | Purpose                | Payment Date | Remarks |
| ------------- | ----------- | ------ | --- | --------------- | ---------------------- | ------------ | ------- |
| John Doe      | 5           | 850    |     | ABC Corporation | Client site inspection | 2026-02-04   |         |
| Jane Smith    | 8           | 1200   |     | XYZ Industries  | Client meeting         | 2026-02-04   |         |

**Note:** UTR column is empty - AE will fill this after bank payment and upload back.

---

### **17. API TO UPLOAD SYSTEM FILE WITH UTR DETAILS**

**Endpoint:** `POST /api/conveyance/payment/upload-system-file`

**Description:** Uploads the System Upload File with UTR numbers filled in after bank payment. Parses and validates UTR data.

#### **Request**

**Headers:**

```json
{
  "Authorization": "Bearer {token}",
  "Content-Type": "multipart/form-data"
}
```

**Body (Form Data):**

| Field | Type | Required | Description                        |
| ----- | ---- | -------- | ---------------------------------- |
| file  | File | Yes      | Excel file with UTR numbers filled |

**Example Request:**

```
POST /api/conveyance/payment/upload-system-file

Form Data:
- file: Conveyance_System_Upload_20260204_160000_filled.xlsx
```

#### **Backend Processing Flow:**

1. **File Validation**
   - Check file is Excel format (.xlsx)
   - File size limit: 10 MB

2. **Parse Excel File**
   - Read Excel using XLSX library
   - Extract data from first sheet
   - Expected columns:
     - Employee Name (required)
     - Employee ID (required)
     - Amount (required)
     - UTR (required)
     - Client (optional)
     - Purpose (optional)
     - Payment Date (optional)
     - Remarks (optional)

3. **Column Name Normalization**
   - Handle variations: "Employee Name", "EmployeeName", "Name" → "Employee Name"
   - Handle variations: "Employee ID", "EmployeeID", "Emp ID" → "Employee ID"
   - Handle variations: "UTR", "UTR Number", "Transaction ID" → "UTR"

4. **Data Validation**
   - Check all essential columns present (Employee Name, Employee ID, Amount, UTR)
   - Validate UTR is not empty for each row
   - Validate amount matches with pending payment request

5. **Return Parsed Data**
   - Return structured array of payment data with UTR details
   - Ready for bank selection and final GL posting

#### **Response**

**Success (200 OK):**

```json
{
  "success": true,
  "data": {
    "parsedData": [
      {
        "employeeName": "John Doe",
        "employeeId": "5",
        "amount": 850,
        "utr": "UTR123456789012",
        "client": "ABC Corporation",
        "purpose": "Conveyance Reimbursement",
        "paymentDate": "2026-02-04",
        "remarks": "Paid via NEFT"
      },
      {
        "employeeName": "Jane Smith",
        "employeeId": "8",
        "amount": 1200,
        "utr": "UTR234567890123",
        "client": "XYZ Industries",
        "purpose": "Conveyance Reimbursement",
        "paymentDate": "2026-02-04",
        "remarks": "Paid via RTGS"
      }
    ],
    "summary": {
      "totalRecords": 2,
      "totalAmount": 2050,
      "validRecords": 2,
      "invalidRecords": 0
    }
  },
  "message": "System file uploaded and parsed successfully"
}
```

**Error (400 Bad Request - Missing Columns):**

```json
{
  "success": false,
  "error": "Missing Columns",
  "message": "Missing essential columns: UTR\n\nAvailable columns: Employee Name, Employee ID, Amount, Client"
}
```

**Error (400 Bad Request - Empty UTR):**

```json
{
  "success": false,
  "error": "Validation Error",
  "message": "Row 3: UTR is required but empty for employee John Doe"
}
```

---

### **18. API TO PROCESS CONVEYANCE BANK PAYMENT (FINAL GL POSTING)**

**Endpoint:** `POST /api/conveyance/payment/process-bank-payment`

**Description:** Processes batch bank payment for selected conveyance requests. Posts Payment GL entries (Dr Payable, Cr Bank).

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
  "payments": [
    {
      "employeeName": "John Doe",
      "employeeId": "5",
      "amount": 850,
      "utr": "UTR123456789012",
      "client": "ABC Corporation",
      "requestId": "1738659000000"
    },
    {
      "employeeName": "Jane Smith",
      "employeeId": "8",
      "amount": 1200,
      "utr": "UTR234567890123",
      "client": "XYZ Industries",
      "requestId": "1738572600000"
    }
  ],
  "bankData": {
    "bankCode": "A3004001_HDFC",
    "bankName": "HDFC Bank"
  }
}
```

**Body Parameters:**

| Parameter               | Type             | Required | Description                        |
| ----------------------- | ---------------- | -------- | ---------------------------------- |
| payments                | Array of Objects | Yes      | List of payments with UTR details  |
| payments[].employeeName | String           | Yes      | Employee name                      |
| payments[].employeeId   | String           | Yes      | Employee ID                        |
| payments[].amount       | Number           | Yes      | Payment amount                     |
| payments[].utr          | String           | Yes      | UTR/Transaction reference          |
| payments[].client       | String           | No       | Client name                        |
| payments[].requestId    | String           | Yes      | Original request ID                |
| bankData                | Object           | Yes      | Bank selection details             |
| bankData.bankCode       | String           | Yes      | Bank GL code (e.g., A3004001_HDFC) |
| bankData.bankName       | String           | Yes      | Bank name                          |

#### **Backend Processing Flow:**

1. **Validation**
   - Verify all payments have valid UTR
   - Verify bank GL code exists in chart of accounts
   - Verify all request IDs exist in `processedConveyanceRequests`
   - Verify all requests have `paymentStatus = "Pending Payment"`

2. **Calculate Total Amount**
   - Sum all payment amounts
   - Total = 850 + 1200 = 2050

3. **Generate Payment Voucher Number**
   - Format: `PAY/CONV/BANK/{Year}/{Sequence}`
   - Example: `PAY/CONV/BANK/2026/0001`
   - Auto-increment counter in `voucherCounters`

4. **Create Bank Payment Transaction**
   - Transaction ID: `TXN_CONV_BANK_{timestamp}`
   - Voucher Type: "Payment Voucher"
   - Date: Current date
   - Entries:
     ```javascript
     ;[
       {
         lineNo: 1,
         glCode: 'L2001001',
         glName: 'CONVEYANCE PAYABLE',
         debit: 2050,
         credit: 0,
         narration: 'Conveyance payments batch - 2 employees',
         costCenter: 'HEAD OFFICE',
       },
       {
         lineNo: 2,
         glCode: 'A3004001_HDFC',
         glName: 'HDFC Bank',
         debit: 0,
         credit: 2050,
         narration: 'Bank payment for conveyance',
         costCenter: 'HEAD OFFICE',
       },
     ]
     ```

5. **Post Transaction**
   - Save transaction to `transactions` localStorage
   - Validate balance: totalDebit = totalCredit

6. **Update Ledger Balances**
   - Update L2001001 balance: Decrease by debit amount (liability cleared)
   - Update A3004001_HDFC balance: Decrease by credit amount (bank reduced)
   - Save updated `chartOfAccounts`

7. **Update Payment Status of Requests**
   - For each request in batch:
     - Change paymentStatus: "Paid"
     - Add payment history entry:
       ```javascript
       paymentHistory: [
         {
           paymentDate: '2026-02-04T17:00:00.000Z',
           utr: 'UTR123456789012',
           amount: 850,
           bank: 'HDFC Bank',
           bankCode: 'A3004001_HDFC',
           paymentVoucher: 'PAY/CONV/BANK/2026/0001',
           transactionId: 'TXN_CONV_BANK_1738695600000',
           paidBy: 'ae1',
         },
       ]
       ```
   - Update in `processedConveyanceRequests`

8. **Dispatch Events**
   - Dispatch `conveyancePaymentProcessed` event

#### **Response**

**Success (200 OK):**

```json
{
  "success": true,
  "data": {
    "paymentVoucherNo": "PAY/CONV/BANK/2026/0001",
    "transactionId": "TXN_CONV_BANK_1738695600000",
    "totalAmount": 2050,
    "employeeCount": 2,
    "bank": {
      "bankCode": "A3004001_HDFC",
      "bankName": "HDFC Bank"
    },
    "glEntries": [
      {
        "lineNo": 1,
        "glCode": "L2001001",
        "glName": "CONVEYANCE PAYABLE",
        "debit": 2050,
        "credit": 0,
        "narration": "Conveyance payments batch - 2 employees"
      },
      {
        "lineNo": 2,
        "glCode": "A3004001_HDFC",
        "glName": "HDFC Bank",
        "debit": 0,
        "credit": 2050,
        "narration": "Bank payment for conveyance"
      }
    ],
    "payments": [
      {
        "employeeName": "John Doe",
        "employeeId": "5",
        "amount": 850,
        "utr": "UTR123456789012",
        "requestId": "1738659000000",
        "paymentStatus": "Paid"
      },
      {
        "employeeName": "Jane Smith",
        "employeeId": "8",
        "amount": 1200,
        "utr": "UTR234567890123",
        "requestId": "1738572600000",
        "paymentStatus": "Paid"
      }
    ],
    "paymentDate": "2026-02-04T17:00:00.000Z"
  },
  "message": "Bank payments processed successfully for 2 employees (₹2,050)"
}
```

**Error (400 Bad Request - Missing UTR):**

```json
{
  "success": false,
  "error": "Validation Error",
  "message": "UTR is required for employee John Doe"
}
```

**Error (400 Bad Request - Already Paid):**

```json
{
  "success": false,
  "error": "Already Paid",
  "message": "Request 1738659000000 has already been paid"
}
```

**Error (500 Internal Server Error - GL Posting Failed):**

```json
{
  "success": false,
  "error": "GL Posting Failed",
  "message": "Failed to post bank payment transaction: Total Debit (2050) does not match Total Credit (2060)"
}
```

---

## **PART 6: REPORTING & STATUS TRACKING**

---

### **19. API TO GET ALL CONVEYANCE REQUESTS WITH STATUS**

**Endpoint:** `GET /api/conveyance/all-requests`

**Description:** Retrieves all conveyance requests across all statuses with filtering and pagination.

#### **Request**

**Headers:**

```json
{
  "Authorization": "Bearer {token}",
  "Content-Type": "application/json"
}
```

**Query Parameters:**

| Parameter     | Type                | Required | Description                                                                                                                                                  |
| ------------- | ------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| status        | String              | No       | Filter: "Pending Manager Approval", "Pending VP Approval", "Pending AE Approval", "Approved", "Rejected by Line Manager", "Rejected by VP", "Rejected by AE" |
| employee      | String              | No       | Filter by employee name (partial match)                                                                                                                      |
| client        | String              | No       | Filter by client name (partial match)                                                                                                                        |
| fromDate      | String (YYYY-MM-DD) | No       | Filter from visit date                                                                                                                                       |
| toDate        | String (YYYY-MM-DD) | No       | Filter to visit date                                                                                                                                         |
| paymentStatus | String              | No       | Filter: "Pending Payment", "Paid" (only for approved requests)                                                                                               |
| page          | Integer             | No       | Page number (default: 1)                                                                                                                                     |
| limit         | Integer             | No       | Records per page (default: 20)                                                                                                                               |

**Example Request:**

```
GET /api/conveyance/all-requests?status=Approved&paymentStatus=Pending Payment&page=1&limit=20
```

#### **Response**

**Success (200 OK):**

```json
{
  "success": true,
  "data": {
    "requests": [
      {
        "id": "1738659000000",
        "employeeId": "5",
        "employeeName": "John Doe",
        "date": "2026-02-01",
        "client": "ABC Corporation",
        "amount": 850,
        "status": "Approved",
        "paymentStatus": "Pending Payment",
        "voucherNumber": "EXP/CONV/MH01/2026/0001",
        "submittedAt": "2026-02-04T10:30:00.000Z",
        "aeApprovedAt": "2026-02-04T16:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 2,
      "totalRecords": 35,
      "recordsPerPage": 20
    },
    "summary": {
      "totalRequests": 35,
      "byStatus": {
        "Pending Manager Approval": 5,
        "Pending VP Approval": 3,
        "Pending AE Approval": 2,
        "Approved": 20,
        "Rejected by Line Manager": 3,
        "Rejected by VP": 1,
        "Rejected by AE": 1
      },
      "byPaymentStatus": {
        "Pending Payment": 15,
        "Paid": 5
      },
      "totalAmount": 38450,
      "totalPendingPayment": 16250,
      "totalPaid": 5200
    }
  },
  "message": "All conveyance requests retrieved successfully"
}
```

---

### **20. API TO GET CONVEYANCE PAYMENT HISTORY**

**Endpoint:** `GET /api/conveyance/payment-history`

**Description:** Retrieves payment history for all paid conveyance requests.

#### **Request**

**Headers:**

```json
{
  "Authorization": "Bearer {token}",
  "Content-Type": "application/json"
}
```

**Query Parameters:**

| Parameter | Type                | Required | Description                    |
| --------- | ------------------- | -------- | ------------------------------ |
| employee  | String              | No       | Filter by employee name        |
| bank      | String              | No       | Filter by bank name            |
| fromDate  | String (YYYY-MM-DD) | No       | Filter from payment date       |
| toDate    | String (YYYY-MM-DD) | No       | Filter to payment date         |
| page      | Integer             | No       | Page number (default: 1)       |
| limit     | Integer             | No       | Records per page (default: 20) |

**Example Request:**

```
GET /api/conveyance/payment-history?bank=HDFC Bank&page=1&limit=20
```

#### **Response**

**Success (200 OK):**

```json
{
  "success": true,
  "data": {
    "payments": [
      {
        "requestId": "1738659000000",
        "employeeId": "5",
        "employeeName": "John Doe",
        "claimDate": "2026-02-01",
        "client": "ABC Corporation",
        "amount": 850,
        "expenseVoucher": "EXP/CONV/MH01/2026/0001",
        "paymentVoucher": "PAY/CONV/BANK/2026/0001",
        "paymentDate": "2026-02-04T17:00:00.000Z",
        "utr": "UTR123456789012",
        "bank": "HDFC Bank",
        "bankCode": "A3004001_HDFC",
        "paidBy": "ae1"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalRecords": 5,
      "recordsPerPage": 20
    },
    "summary": {
      "totalPayments": 5,
      "totalAmount": 5200,
      "byBank": {
        "HDFC Bank": 3,
        "ICICI Bank": 2
      }
    }
  },
  "message": "Payment history retrieved successfully"
}
```

---

### **21. API TO GET CONVEYANCE EXPENSE REPORT**

**Endpoint:** `GET /api/conveyance/expense-report`

**Description:** Generates comprehensive conveyance expense report with aggregations by department, employee, transport mode, etc.

#### **Request**

**Headers:**

```json
{
  "Authorization": "Bearer {token}",
  "Content-Type": "application/json"
}
```

**Query Parameters:**

| Parameter  | Type                | Required | Description                                     |
| ---------- | ------------------- | -------- | ----------------------------------------------- |
| fromDate   | String (YYYY-MM-DD) | No       | Report from date (default: current month start) |
| toDate     | String (YYYY-MM-DD) | No       | Report to date (default: current date)          |
| department | String              | No       | Filter by department                            |
| employee   | String              | No       | Filter by employee name                         |
| status     | String              | No       | Filter by status (Approved/Rejected/All)        |

**Example Request:**

```
GET /api/conveyance/expense-report?fromDate=2026-02-01&toDate=2026-02-28
```

#### **Response**

**Success (200 OK):**

```json
{
  "success": true,
  "data": {
    "reportPeriod": {
      "fromDate": "2026-02-01",
      "toDate": "2026-02-28"
    },
    "summary": {
      "totalClaims": 35,
      "totalAmount": 38450,
      "approvedClaims": 25,
      "approvedAmount": 32150,
      "rejectedClaims": 5,
      "rejectedAmount": 4200,
      "pendingClaims": 5,
      "pendingAmount": 2100,
      "paidClaims": 5,
      "paidAmount": 5200,
      "pendingPayment": 20,
      "pendingPaymentAmount": 26950
    },
    "byDepartment": [
      {
        "department": "Sales",
        "totalClaims": 15,
        "totalAmount": 16250,
        "averageAmount": 1083
      },
      {
        "department": "Operations",
        "totalClaims": 10,
        "totalAmount": 12800,
        "averageAmount": 1280
      },
      {
        "department": "Marketing",
        "totalClaims": 7,
        "totalAmount": 7200,
        "averageAmount": 1029
      },
      {
        "department": "IT",
        "totalClaims": 3,
        "totalAmount": 2200,
        "averageAmount": 733
      }
    ],
    "byEmployee": [
      {
        "employeeId": "5",
        "employeeName": "John Doe",
        "department": "Sales",
        "totalClaims": 4,
        "totalAmount": 3650,
        "approvedAmount": 3650,
        "paidAmount": 850
      }
    ],
    "byTransportMode": [
      {
        "transport": "Bike",
        "totalClaims": 18,
        "totalAmount": 12600,
        "averageAmount": 700,
        "averageDistance": 25
      },
      {
        "transport": "Cab",
        "totalClaims": 10,
        "totalAmount": 15200,
        "averageAmount": 1520,
        "averageDistance": 35
      },
      {
        "transport": "Bus",
        "totalClaims": 4,
        "totalAmount": 6450,
        "averageAmount": 1613,
        "averageDistance": 45
      },
      {
        "transport": "Train",
        "totalClaims": 2,
        "totalAmount": 3200,
        "averageAmount": 1600,
        "averageDistance": 120
      },
      {
        "transport": "Auto",
        "totalClaims": 1,
        "totalAmount": 1000,
        "averageAmount": 1000,
        "averageDistance": 15
      }
    ],
    "topClaimants": [
      {
        "employeeName": "John Doe",
        "totalAmount": 3650,
        "claimCount": 4
      },
      {
        "employeeName": "Jane Smith",
        "totalAmount": 3200,
        "claimCount": 3
      }
    ]
  },
  "message": "Conveyance expense report generated successfully"
}
```

---

## **APPENDIX A: SAMPLE DATA FLOW**

### **Example 1: Complete Conveyance Flow - Bike Transport**

#### **Step 1: Employee Submission**

```json
POST /api/conveyance/submit
{
  "date": "2026-02-01",
  "purpose": "Client meeting for new project discussion",
  "client": "XYZ Industries",
  "transport": "Bike",
  "distance": 22,
  "amount": 220,
  "reports": [visit_report.pdf],
  "remarks": "Routine client visit"
}
```

**Result:** Request created with ID `1738572600000`, status: "Pending Manager Approval", assigned to `manager1`

#### **Step 2: Manager Approval**

```json
POST /api/conveyance/manager/approve
{
  "requestId": "1738572600000"
}
```

**Result:** Status changed to "Pending VP Approval", assigned to `vp_operations`

#### **Step 3: VP Approval**

```json
POST /api/conveyance/vp/approve
{
  "requestId": "1738572600000"
}
```

**Result:** Status changed to "Pending AE Approval", no assignment (moves to AE queue)

#### **Step 4: AE Approval with GL Posting**

```json
POST /api/conveyance/ae/approve
{
  "requestId": "1738572600000"
}
```

**Backend Processing:**

1. Employee site: MH01 (Mumbai)
2. Voucher generated: `EXP/CONV/MH01/2026/0002`
3. GL Entries posted:

| Line | GL Code  | GL Name                   | Debit (₹) | Credit (₹) |
| ---- | -------- | ------------------------- | --------- | ---------- |
| 1    | X2001003 | BRANCH CONVEYANCE EXPENSE | 220       | -          |
| 2    | L2001001 | CONVEYANCE PAYABLE        | -         | 220        |

4. Request status: "Approved", paymentStatus: "Pending Payment"
5. Moved to `processedConveyanceRequests`

#### **Step 5: Payment Processing**

```json
POST /api/conveyance/payment/process-bank-payment
{
  "payments": [
    {
      "employeeName": "John Doe",
      "employeeId": "5",
      "amount": 220,
      "utr": "UTR345678901234",
      "requestId": "1738572600000"
    }
  ],
  "bankData": {
    "bankCode": "A3004001_HDFC",
    "bankName": "HDFC Bank"
  }
}
```

**Backend Processing:**

1. Payment voucher generated: `PAY/CONV/BANK/2026/0001`
2. GL Entries posted:

| Line | GL Code       | GL Name            | Debit (₹) | Credit (₹) |
| ---- | ------------- | ------------------ | --------- | ---------- |
| 1    | L2001001      | CONVEYANCE PAYABLE | 220       | -          |
| 2    | A3004001_HDFC | HDFC Bank          | -         | 220        |

3. Payment status: "Paid"
4. Payment history updated with UTR and payment details

---

### **Example 2: Rejection at Manager Level**

#### **Employee Submission**

```json
POST /api/conveyance/submit
{
  "date": "2026-02-01",
  "purpose": "Client site inspection",
  "client": "ABC Corporation",
  "transport": "Cab",
  "distance": 35,
  "amount": 1500,
  "reports": [visit_report.pdf],
  "receipts": [cab_receipt.pdf]
}
```

**Result:** Request created, assigned to manager

#### **Manager Rejection**

```json
POST /api/conveyance/manager/reject
{
  "requestId": "1738659000000",
  "reason": "Amount claimed (₹1500) is excessive for 35 km cab ride. Standard rate should be around ₹800-900. Please resubmit with correct amount and proper receipt."
}
```

**Result:**

- Status: "Rejected by Line Manager"
- Employee can see rejection reason in My Requests
- Can resubmit a new request with corrected details

---

### **Example 3: Batch Payment Processing**

**Scenario:** AE processes payment for 5 employees in one batch

```json
POST /api/conveyance/payment/process-bank-payment
{
  "payments": [
    {"employeeName": "John Doe", "employeeId": "5", "amount": 850, "utr": "UTR123", "requestId": "REQ001"},
    {"employeeName": "Jane Smith", "employeeId": "8", "amount": 1200, "utr": "UTR124", "requestId": "REQ002"},
    {"employeeName": "Bob Wilson", "employeeId": "12", "amount": 650, "utr": "UTR125", "requestId": "REQ003"},
    {"employeeName": "Alice Brown", "employeeId": "15", "amount": 920, "utr": "UTR126", "requestId": "REQ004"},
    {"employeeName": "Charlie Davis", "employeeId": "20", "amount": 780, "utr": "UTR127", "requestId": "REQ005"}
  ],
  "bankData": {
    "bankCode": "A3004001_ICICI",
    "bankName": "ICICI Bank"
  }
}
```

**Processing:**

- Total Amount: ₹4,400
- Payment Voucher: `PAY/CONV/BANK/2026/0002`
- Single GL Entry: Dr L2001001 (₹4,400), Cr A3004001_ICICI (₹4,400)
- All 5 requests marked as "Paid" with individual UTRs

---

## **APPENDIX B: ERROR CODES REFERENCE**

| Error Code | HTTP Status | Description                   | Resolution                                                         |
| ---------- | ----------- | ----------------------------- | ------------------------------------------------------------------ |
| AUTH_001   | 401         | Invalid or expired token      | Re-authenticate and obtain new token                               |
| AUTH_002   | 403         | Insufficient permissions      | Contact admin for role assignment                                  |
| VAL_001    | 400         | Missing required fields       | Check request body for required parameters                         |
| VAL_002    | 400         | Claim window violation        | Submit within allowed window (1st-7th of month for previous month) |
| VAL_003    | 400         | Designation limit exceeded    | Reduce claim amount or split into multiple months                  |
| VAL_004    | 400         | Receipt required              | Upload receipt for Cab/Bus/Auto/Train                              |
| VAL_005    | 400         | Empty rejection remarks       | Provide mandatory rejection reason                                 |
| VAL_006    | 400         | File too large                | Reduce file size to ≤ 2 MB                                         |
| VAL_007    | 400         | Invalid file type             | Upload only PDF files                                              |
| VAL_008    | 400         | Missing reporting manager     | Contact admin to assign reporting manager                          |
| REQ_001    | 404         | Request not found             | Verify request ID exists                                           |
| REQ_002    | 400         | Request already processed     | Cannot modify completed request                                    |
| REQ_003    | 400         | Request not in correct status | Check workflow status before operation                             |
| REQ_004    | 403         | Unauthorized approval         | You are not assigned to approve this request                       |
| PAY_001    | 400         | Already paid                  | Request has already been paid                                      |
| PAY_002    | 400         | Missing UTR                   | Provide UTR number for payment                                     |
| PAY_003    | 400         | Payment amount mismatch       | Payment amount does not match request amount                       |
| GL_001     | 500         | GL posting failed             | Check transaction balance validation                               |
| GL_002     | 500         | Ledger update failed          | Database error - contact support                                   |
| FILE_001   | 400         | Excel parsing failed          | Check Excel file format and columns                                |
| FILE_002   | 400         | Missing columns               | Ensure all required columns present in Excel                       |
| SYS_001    | 500         | Internal server error         | Unexpected error - contact support                                 |

---

## **APPENDIX C: BUSINESS RULES**

### **1. Claim Submission Rules**

| Rule   | Description                                           | Enforced By                            |
| ------ | ----------------------------------------------------- | -------------------------------------- |
| BR-001 | Claim must be submitted within 7 days after month-end | System validation (claim window check) |
| BR-002 | Receipt mandatory for Cab/Bus/Auto/Train              | Form validation                        |
| BR-003 | Visit report PDF mandatory for all claims             | Form validation                        |
| BR-004 | File size limit: 2 MB per file                        | File upload validation                 |
| BR-005 | Only PDF files allowed                                | File type validation                   |
| BR-006 | Total claim amount must not exceed designation limit  | Designation limit check                |
| BR-007 | Employee must have reporting manager assigned         | User data validation                   |

### **2. Approval Hierarchy Rules**

| Rule   | Description                                          | Enforced By         |
| ------ | ---------------------------------------------------- | ------------------- |
| BR-101 | Approval follows strict hierarchy: Manager → VP → AE | Workflow logic      |
| BR-102 | Rejection remarks are mandatory at all levels        | API validation      |
| BR-103 | Only assigned approver can approve/reject            | Authorization check |
| BR-104 | Cannot skip approval levels                          | Status validation   |
| BR-105 | Rejected request goes back to employee               | Status update       |

### **3. GL Posting Rules**

| Rule   | Description                                                          | Enforced By            |
| ------ | -------------------------------------------------------------------- | ---------------------- |
| BR-201 | GL entries posted only on AE approval                                | Approval workflow      |
| BR-202 | Total Debit must equal Total Credit                                  | Transaction validation |
| BR-203 | Expense GL: X2001003 (Branch Conveyance Expense)                     | GL code mapping        |
| BR-204 | Payable GL: L2001001 (Conveyance Payable - shared for all employees) | GL code mapping        |
| BR-205 | Voucher format: EXP/CONV/{Site}/{Year}/{Sequence}                    | Voucher generation     |
| BR-206 | Site code derived from employee master                               | Employee data lookup   |

### **4. Payment Processing Rules**

| Rule   | Description                                             | Enforced By          |
| ------ | ------------------------------------------------------- | -------------------- |
| BR-301 | Payment only for approved requests                      | Payment queue filter |
| BR-302 | UTR mandatory for payment processing                    | Payment validation   |
| BR-303 | Batch payment creates single Payment Voucher            | Payment logic        |
| BR-304 | Payment GL: Dr L2001001 (Payable), Cr Bank              | GL entry structure   |
| BR-305 | Payment voucher format: PAY/CONV/BANK/{Year}/{Sequence} | Voucher generation   |
| BR-306 | Cannot pay same request twice                           | Payment status check |
| BR-307 | Payment history maintained with UTR details             | Payment tracking     |

### **5. Designation Limit Rules**

| Rule   | Description                        | Limit (₹)            |
| ------ | ---------------------------------- | -------------------- |
| BR-401 | Junior designation monthly limit   | 5,000                |
| BR-402 | Senior designation monthly limit   | 10,000               |
| BR-403 | Manager designation monthly limit  | 15,000               |
| BR-404 | Limit applies to single submission | Per submission check |

---

## **DOCUMENT REVISION HISTORY**

| Version | Date       | Author         | Changes                                                                      |
| ------- | ---------- | -------------- | ---------------------------------------------------------------------------- |
| 1.0     | 2026-02-04 | System Analyst | Initial API specification document created for Process of Conveyance Booking |

---

**END OF DOCUMENT**

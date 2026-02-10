# API SPECIFICATION DOCUMENT

## Process For Reliever Payments Module

---

### Document Information

- **Module Name:** Process For Reliever Payments
- **Version:** 1.0
- **Last Updated:** January 2025
- **Prepared By:** Technical Team
- **Status:** Active

---

## Table of Contents

1. [Module Overview](#module-overview)
2. [Business Process Flow](#business-process-flow)
3. [GL Code Structure](#gl-code-structure)
4. [API Specifications](#api-specifications)
   - [Part 1: Operation Executive Submission](#part-1-operation-executive-submission)
   - [Part 2: Line Manager Approval](#part-2-line-manager-approval)
   - [Part 3: VP Operations Approval](#part-3-vp-operations-approval)
   - [Part 4: Account Executive Approval](#part-4-account-executive-approval)
   - [Part 5: Payment Processing](#part-5-payment-processing)
   - [Part 6: Reporting & Tracking](#part-6-reporting--tracking)
5. [Accounting Integration](#accounting-integration)
6. [Error Codes](#error-codes)
7. [Business Rules](#business-rules)

---

## Module Overview

### Purpose

The Process For Reliever Payments module manages the complete lifecycle of reliever (temporary replacement worker) payment processing, from submission by Operation Executive through multi-level approvals (Line Manager → VP Operations → Account Executive) to final payment execution with bank integration.

### Key Features

- Multi-level approval workflow with automatic routing
- Time-based approval logic (VP approval before/after 7:00 PM determines same-day vs next-day processing)
- Automatic GL posting upon AE approval (creates expense and liability entries)
- Document upload support (ID Proof, Passbook PDF)
- Batch payment processing with bank file generation
- UTR tracking for payment confirmation
- Comprehensive audit trail

### User Roles

1. **Operation Executive (OE):** Submits reliever payment requests
2. **Line Manager:** First-level approver, validates reliever details
3. **VP Operations:** Second-level approver, time-sensitive approval (before/after 7:00 PM)
4. **Account Executive (AE):** Final approver, posts accounting entries
5. **Finance Team:** Processes actual bank payments

---

## Business Process Flow

### Workflow Steps

```
Step 1: Operation Executive Submission
↓
Step 2: Line Manager Approval (First Level)
↓
Step 3: VP Operations Approval (Second Level)
         - Before 7:00 PM → Same-day processing flag
         - After 7:00 PM → Next-day processing flag
↓
Step 4: Account Executive Approval (Final Level)
         - Posts GL Entries:
           Dr X2002002001 (Reliever Payments Expense)
           Cr L2001002 (Employee Reliever Account - Liability)
         - Generates Voucher Number
         - Creates Transaction Record
↓
Step 5: Payment Processing
         - Download Bank Upload File (NEFT format)
         - Download System Upload File (tracking)
         - Upload UTR after payment
         - Final GL Posting:
           Dr L2001002 (Reliever Payable)
           Cr A3004003_{Bank} (Bank Account)
```

### Time-Based Business Logic

- **VP Approval Before 7:00 PM (19:00):**
  - Request marked for same-day processing
  - Flag: `delayed = false`
  - Payment can be processed same day

- **VP Approval After 7:00 PM (19:00):**
  - Request marked for next-day processing
  - Flag: `delayed = true`
  - Payment scheduled for next business day
  - Warning displayed to user

---

## GL Code Structure

### Chart of Accounts - Reliever Payments

#### Expense Accounts

| GL Code     | Description       | Type    | Parent Code                      | Dr/Cr |
| ----------- | ----------------- | ------- | -------------------------------- | ----- |
| X2002002001 | RELIEVER PAYMENTS | Expense | X2002002 (Other Direct Expenses) | Debit |

#### Liability Accounts

| GL Code  | Description               | Type      | Parent Code                 | Dr/Cr  |
| -------- | ------------------------- | --------- | --------------------------- | ------ |
| L2001002 | EMPLOYEE RELIEVER ACCOUNT | Liability | L2001 (Liability-Employees) | Credit |

#### Bank Accounts (Variable)

| GL Code Pattern  | Description              | Type  | Parent Code              | Dr/Cr  |
| ---------------- | ------------------------ | ----- | ------------------------ | ------ |
| A3004003\_{Bank} | Bank Accounts (Selected) | Asset | A3004003 (Bank Accounts) | Credit |

### Voucher Numbering Format

- **Expense Voucher (AE Approval):** `PAY/REL/{Site}/{Year}/{SequenceNo}`
  - Example: `PAY/REL/Site A/2025/0001`
- **Payment Voucher (Bank Payment):** `PAY/BANK/REL/{Site}/{Year}/{SequenceNo}`
  - Example: `PAY/BANK/REL/Site A/2025/0001`

---

## API Specifications

---

## PART 1: Operation Executive Submission

---

### API 1.1: Submit Reliever Payment Request

**Endpoint:** `POST /api/reliever-payments/submit`

**Description:** Operation Executive submits a new reliever payment request with all required details and document uploads.

#### Request Headers

```json
{
  "Content-Type": "multipart/form-data",
  "Authorization": "Bearer {token}",
  "User-Role": "OPERATION_EXECUTIVE"
}
```

#### Request Body (Form Data)

```json
{
  "name": "Rajesh Kumar",
  "relieverEmpCode": "REL2025001",
  "relieverFor": "Amit Sharma",
  "absentEmpCode": "EMP001234",
  "reason": "Medical leave - Fever",
  "date": "2025-01-15",
  "shift": "Morning",
  "type": "Security",
  "site": "Site A",
  "amount": 1500.0,
  "accountNo": "123456789012",
  "ifscCode": "SBIN0001234",
  "idProof": "<FILE>",
  "passbookFile": "<FILE>",
  "remarks": "Urgent requirement for security shift coverage"
}
```

#### Field Validations

| Field           | Type    | Required | Validation Rules                   |
| --------------- | ------- | -------- | ---------------------------------- |
| name            | String  | Yes      | Max 100 characters                 |
| relieverEmpCode | String  | Yes      | Unique, alphanumeric               |
| relieverFor     | String  | No       | Employee name being relieved       |
| absentEmpCode   | String  | Yes      | Valid employee code                |
| reason          | String  | Yes      | Max 500 characters                 |
| date            | Date    | Yes      | Cannot be future date              |
| shift           | Enum    | Yes      | Morning/Evening/Night              |
| type            | Enum    | Yes      | Security/Housekeeping/Electrician  |
| site            | Enum    | Yes      | Site A/Site B/Site C               |
| amount          | Decimal | Yes      | > 0, max 2 decimal places          |
| accountNo       | String  | Yes      | 10-18 digits                       |
| ifscCode        | String  | Yes      | 11 characters, format: XXXX0XXXXXX |
| idProof         | File    | Yes      | PDF/JPG/PNG, max 5MB               |
| passbookFile    | File    | Yes      | PDF/JPG/PNG, max 5MB               |
| remarks         | String  | No       | Max 1000 characters                |

#### Response (Success - 201 Created)

```json
{
  "success": true,
  "message": "Reliever payment request submitted successfully",
  "data": {
    "requestId": "1736934123456",
    "status": "Pending Line Manager Approval",
    "currentApprover": "manager1",
    "approvalHierarchy": {
      "lineManager": "manager1",
      "vpOperations": "vp_ops1",
      "accountExecutive": "ae1"
    },
    "submittedBy": "oe1",
    "submittedAt": "2025-01-15T10:30:00Z",
    "files": {
      "idProof": "idproof_1736934123456.pdf",
      "passbookFile": "passbook_1736934123456.pdf"
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
    "amount": "Amount must be greater than 0",
    "ifscCode": "Invalid IFSC code format",
    "idProof": "File size exceeds 5MB limit"
  }
}
```

#### Business Logic

1. Validate all required fields and file uploads
2. Retrieve current user (Operation Executive) from session
3. Determine approval hierarchy:
   - Get Line Manager from `currentUser.reportsTo`
   - Get VP Operations from `lineManager.reportsTo`
   - Set Account Executive as `ae1` (hardcoded)
4. Generate unique request ID using timestamp
5. Store files with unique names (filename + timestamp)
6. Create request object with initial status and approvers
7. Initialize history array with submission action
8. Save to `relieverRequests` database table
9. Return request details with approval hierarchy

---

### API 1.2: Get My Reliever Requests

**Endpoint:** `GET /api/reliever-payments/my-requests`

**Description:** Retrieve all reliever payment requests submitted by the logged-in Operation Executive.

#### Request Headers

```json
{
  "Authorization": "Bearer {token}",
  "User-Role": "OPERATION_EXECUTIVE"
}
```

#### Query Parameters

```
?page=1
&limit=5
&status=Pending Line Manager Approval
&name=Rajesh
&sortBy=createdAt
&sortOrder=desc
```

| Parameter | Type    | Required | Description                     |
| --------- | ------- | -------- | ------------------------------- |
| page      | Integer | No       | Page number (default: 1)        |
| limit     | Integer | No       | Items per page (default: 5)     |
| status    | String  | No       | Filter by status                |
| name      | String  | No       | Filter by reliever name         |
| sortBy    | String  | No       | Sort field (default: createdAt) |
| sortOrder | String  | No       | asc/desc (default: desc)        |

#### Response (Success - 200 OK)

```json
{
  "success": true,
  "data": {
    "requests": [
      {
        "id": "1736934123456",
        "name": "Rajesh Kumar",
        "relieverEmpCode": "REL2025001",
        "relieverFor": "Amit Sharma",
        "absentEmpCode": "EMP001234",
        "reason": "Medical leave - Fever",
        "date": "2025-01-15",
        "shift": "Morning",
        "type": "Security",
        "site": "Site A",
        "amount": 1500.0,
        "accountNo": "123456789012",
        "ifscCode": "SBIN0001234",
        "status": "Pending Line Manager Approval",
        "currentApprover": "manager1",
        "submittedBy": "oe1",
        "submittedAt": "2025-01-15T10:30:00Z",
        "history": [
          {
            "action": "Submitted by Operation Executive",
            "by": "oe1",
            "at": "2025-01-15T10:30:00Z",
            "comments": "Initial submission"
          }
        ],
        "files": {
          "idProof": "idproof_1736934123456.pdf",
          "passbookFile": "passbook_1736934123456.pdf"
        }
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalRecords": 12,
      "limit": 5
    }
  }
}
```

#### Business Logic

1. Retrieve logged-in user from session
2. Get all requests from `relieverRequests` database table
3. Filter requests where `submittedBy === currentUser.username`
4. Apply additional filters (status, name) if provided
5. Sort by specified field and order
6. Paginate results (default: 5 per page)
7. Return sorted and paginated results

---

## PART 2: Line Manager Approval

---

### API 2.1: Get Pending Reliever Requests (Line Manager)

**Endpoint:** `GET /api/reliever-payments/line-manager/pending`

**Description:** Retrieve all reliever payment requests pending approval by the logged-in Line Manager.

#### Request Headers

```json
{
  "Authorization": "Bearer {token}",
  "User-Role": "LINE_MANAGER"
}
```

#### Query Parameters

```
?name=Rajesh
&site=Site A
&type=Security
```

#### Response (Success - 200 OK)

```json
{
  "success": true,
  "data": {
    "pendingRequests": [
      {
        "id": "1736934123456",
        "name": "Rajesh Kumar",
        "relieverEmpCode": "REL2025001",
        "relieverFor": "Amit Sharma",
        "absentEmpCode": "EMP001234",
        "reason": "Medical leave - Fever",
        "date": "2025-01-15",
        "shift": "Morning",
        "type": "Security",
        "site": "Site A",
        "amount": 1500.0,
        "status": "Pending Line Manager Approval",
        "currentApprover": "manager1",
        "submittedBy": "oe1",
        "submittedAt": "2025-01-15T10:30:00Z"
      }
    ],
    "count": 1
  }
}
```

#### Business Logic

1. Get logged-in Line Manager from session
2. Retrieve all requests from `relieverRequests` database table
3. Filter requests where:
   - `status === "Pending Line Manager Approval"`
   - `currentApprover === currentUser.username`
4. Apply additional filters (name, site, type) if provided
5. Return filtered results

---

### API 2.2: Approve Reliever Request (Line Manager)

**Endpoint:** `POST /api/reliever-payments/line-manager/approve`

**Description:** Line Manager approves a reliever payment request, moving it to VP Operations approval.

#### Request Headers

```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {token}",
  "User-Role": "LINE_MANAGER"
}
```

#### Request Body

```json
{
  "requestId": "1736934123456",
  "comments": "Verified reliever details and shift requirements"
}
```

#### Response (Success - 200 OK)

```json
{
  "success": true,
  "message": "Request #123456 approved successfully",
  "data": {
    "requestId": "1736934123456",
    "previousStatus": "Pending Line Manager Approval",
    "newStatus": "Pending VP Operations Approval",
    "currentApprover": "vp_ops1",
    "approvedBy": "manager1",
    "approvedAt": "2025-01-15T11:00:00Z",
    "nextApprover": {
      "role": "VP Operations",
      "username": "vp_ops1"
    }
  }
}
```

#### Business Logic

1. Validate request exists and is in "Pending Line Manager Approval" status
2. Verify current user is the assigned approver
3. Create history entry:
   - Action: "Approved by Line Manager"
   - By: Current user username
   - At: Current timestamp
   - Comments: User-provided comments or "Approved"
4. Update request:
   - Status: "Pending VP Operations Approval"
   - CurrentApprover: `request.approvers.vpOperations`
   - History: Append new history entry
5. Save updated request to database
6. Return success response with next approver details

---

### API 2.3: Reject Reliever Request (Line Manager)

**Endpoint:** `POST /api/reliever-payments/line-manager/reject`

**Description:** Line Manager rejects a reliever payment request with a reason.

#### Request Headers

```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {token}",
  "User-Role": "LINE_MANAGER"
}
```

#### Request Body

```json
{
  "requestId": "1736934123456",
  "reason": "Reliever not authorized for this site. Please verify with site manager."
}
```

#### Field Validations

| Field     | Required | Validation                 |
| --------- | -------- | -------------------------- |
| requestId | Yes      | Must exist and be pending  |
| reason    | Yes      | Min 10 characters, max 500 |

#### Response (Success - 200 OK)

```json
{
  "success": true,
  "message": "Request #123456 rejected",
  "data": {
    "requestId": "1736934123456",
    "previousStatus": "Pending Line Manager Approval",
    "newStatus": "Rejected by Line Manager",
    "rejectedBy": "manager1",
    "rejectedAt": "2025-01-15T11:15:00Z",
    "rejectionReason": "Reliever not authorized for this site. Please verify with site manager.",
    "returnedTo": "oe1"
  }
}
```

#### Business Logic

1. Validate request exists and is pending
2. Validate reason is provided (minimum 10 characters)
3. Create history entry:
   - Action: "Rejected by Line Manager"
   - By: Current user username
   - At: Current timestamp
   - Comments: Rejection reason
4. Update request:
   - Status: "Rejected by Line Manager"
   - CurrentApprover: `request.submittedBy` (return to OE)
   - RejectionReason: User-provided reason
   - History: Append rejection entry
5. Save to database
6. Send notification to submitter (OE)

---

### API 2.4: Bulk Approve Reliever Requests (Line Manager)

**Endpoint:** `POST /api/reliever-payments/line-manager/bulk-approve`

**Description:** Line Manager approves multiple reliever payment requests in a single operation.

#### Request Headers

```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {token}",
  "User-Role": "LINE_MANAGER"
}
```

#### Request Body

```json
{
  "requestIds": ["1736934123456", "1736934234567", "1736934345678"],
  "comments": "Bulk approved - All relievers verified"
}
```

#### Response (Success - 200 OK)

```json
{
  "success": true,
  "message": "3 request(s) approved successfully",
  "data": {
    "approvedCount": 3,
    "requestIds": ["1736934123456", "1736934234567", "1736934345678"],
    "newStatus": "Pending VP Operations Approval",
    "nextApprover": "vp_ops1",
    "approvedBy": "manager1",
    "approvedAt": "2025-01-15T11:30:00Z"
  }
}
```

#### Business Logic

1. Validate all request IDs exist and are pending
2. Verify current user is approver for all requests
3. Create history entry for each request:
   - Action: "Approved by Line Manager"
   - Comments: "Bulk approved"
4. Update all requests:
   - Status: "Pending VP Operations Approval"
   - CurrentApprover: VP Operations username
   - History: Append approval entry
5. Save all updated requests to database
6. Return summary of bulk operation

---

## PART 3: VP Operations Approval

---

### API 3.1: Get Pending Reliever Requests (VP Operations)

**Endpoint:** `GET /api/reliever-payments/vp-operations/pending`

**Description:** Retrieve all reliever payment requests pending approval by the logged-in VP Operations.

#### Request Headers

```json
{
  "Authorization": "Bearer {token}",
  "User-Role": "VP_OPERATIONS"
}
```

#### Query Parameters

```
?name=Rajesh
&site=Site A
&delayed=false
```

#### Response (Success - 200 OK)

```json
{
  "success": true,
  "data": {
    "pendingRequests": [
      {
        "id": "1736934123456",
        "name": "Rajesh Kumar",
        "relieverEmpCode": "REL2025001",
        "amount": 1500.0,
        "site": "Site A",
        "status": "Pending VP Operations Approval",
        "currentApprover": "vp_ops1",
        "submittedAt": "2025-01-15T10:30:00Z",
        "approvedByLineManager": "manager1",
        "lineManagerApprovalAt": "2025-01-15T11:00:00Z"
      }
    ],
    "count": 1,
    "currentTime": "2025-01-15T18:30:00Z",
    "canApproveForSameDay": true,
    "cutoffTime": "19:00:00"
  }
}
```

#### Response Fields

| Field                | Description                                          |
| -------------------- | ---------------------------------------------------- |
| canApproveForSameDay | True if current time < 19:00 (7 PM), false otherwise |
| cutoffTime           | Time cutoff for same-day processing (19:00)          |

#### Business Logic

1. Get logged-in VP Operations from session
2. Retrieve all requests from `relieverRequests` database table
3. Filter requests where:
   - `status === "Pending VP Operations Approval"`
   - `currentApprover === currentUser.username`
4. Calculate `canApproveForSameDay` based on current time (< 19:00)
5. Return filtered results with time-based flags

---

### API 3.2: Approve Reliever Request (VP Operations)

**Endpoint:** `POST /api/reliever-payments/vp-operations/approve`

**Description:** VP Operations approves a reliever payment request with time-based processing flag, moving it to Account Executive approval.

#### Request Headers

```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {token}",
  "User-Role": "VP_OPERATIONS"
}
```

#### Request Body

```json
{
  "requestId": "1736934123456",
  "comments": "Approved for payment processing"
}
```

#### Response (Success - 200 OK - Before 7 PM)

```json
{
  "success": true,
  "message": "Request #123456 approved successfully",
  "data": {
    "requestId": "1736934123456",
    "previousStatus": "Pending VP Operations Approval",
    "newStatus": "Pending Account Executive Approval",
    "currentApprover": "ae1",
    "approvedBy": "vp_ops1",
    "approvedAt": "2025-01-15T18:45:00Z",
    "delayed": false,
    "processingDay": "Same Day",
    "nextApprover": {
      "role": "Account Executive",
      "username": "ae1"
    }
  }
}
```

#### Response (Success - 200 OK - After 7 PM)

```json
{
  "success": true,
  "message": "Request #123456 approved (will process next day)",
  "data": {
    "requestId": "1736934123456",
    "previousStatus": "Pending VP Operations Approval",
    "newStatus": "Pending Account Executive Approval",
    "currentApprover": "ae1",
    "approvedBy": "vp_ops1",
    "approvedAt": "2025-01-15T20:15:00Z",
    "delayed": true,
    "processingDay": "Next Day",
    "warningMessage": "Approval after 7:00 PM - Payment will be processed next business day",
    "nextApprover": {
      "role": "Account Executive",
      "username": "ae1"
    }
  }
}
```

#### Business Logic

1. Validate request exists and is in "Pending VP Operations Approval" status
2. Verify current user is the assigned approver
3. **Check current time for processing day determination:**
   - If `currentTime.hours < 19` (before 7 PM):
     - Set `delayed = false` (same-day processing)
     - Comments: "Approved"
   - If `currentTime.hours >= 19` (after 7 PM):
     - Set `delayed = true` (next-day processing)
     - Comments: "Approved (after deadline)"
     - Show warning message
4. Create history entry:
   - Action: "Approved by VP Operations"
   - By: Current user username
   - At: Current timestamp
   - Comments: Appropriate message based on time
5. Update request:
   - Status: "Pending Account Executive Approval"
   - CurrentApprover: `request.approvers.accountExecutive`
   - Delayed: Time-based flag
   - History: Append approval entry
6. Save to database
7. Return response with processing day information

---

### API 3.3: Reject Reliever Request (VP Operations)

**Endpoint:** `POST /api/reliever-payments/vp-operations/reject`

**Description:** VP Operations rejects a reliever payment request with a reason.

#### Request Headers

```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {token}",
  "User-Role": "VP_OPERATIONS"
}
```

#### Request Body

```json
{
  "requestId": "1736934123456",
  "reason": "Budget constraints for this month. Please resubmit next month."
}
```

#### Response (Success - 200 OK)

```json
{
  "success": true,
  "message": "Request #123456 rejected",
  "data": {
    "requestId": "1736934123456",
    "previousStatus": "Pending VP Operations Approval",
    "newStatus": "Rejected by VP Operations",
    "rejectedBy": "vp_ops1",
    "rejectedAt": "2025-01-15T19:00:00Z",
    "rejectionReason": "Budget constraints for this month. Please resubmit next month.",
    "returnedTo": "oe1"
  }
}
```

#### Business Logic

1. Validate request exists and is pending VP approval
2. Validate reason is provided (minimum 10 characters)
3. Create history entry:
   - Action: "Rejected by VP Operations"
   - By: Current user username
   - At: Current timestamp
   - Comments: Rejection reason
4. Update request:
   - Status: "Rejected by VP Operations"
   - CurrentApprover: `request.submittedBy` (return to OE)
   - RejectionReason: User-provided reason
   - History: Append rejection entry
5. Save to database
6. Send notification to submitter

---

### API 3.4: Bulk Approve Reliever Requests (VP Operations)

**Endpoint:** `POST /api/reliever-payments/vp-operations/bulk-approve`

**Description:** VP Operations approves multiple reliever payment requests with time-based processing flag.

#### Request Headers

```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {token}",
  "User-Role": "VP_OPERATIONS"
}
```

#### Request Body

```json
{
  "requestIds": ["1736934123456", "1736934234567", "1736934345678"],
  "comments": "Bulk approved for payment processing"
}
```

#### Response (Success - 200 OK - Before 7 PM)

```json
{
  "success": true,
  "message": "3 request(s) approved successfully",
  "data": {
    "approvedCount": 3,
    "requestIds": ["1736934123456", "1736934234567", "1736934345678"],
    "newStatus": "Pending Account Executive Approval",
    "nextApprover": "ae1",
    "approvedBy": "vp_ops1",
    "approvedAt": "2025-01-15T18:30:00Z",
    "delayed": false,
    "processingDay": "Same Day"
  }
}
```

#### Response (Success - 200 OK - After 7 PM)

```json
{
  "success": true,
  "message": "3 request(s) approved (will process next day)",
  "data": {
    "approvedCount": 3,
    "requestIds": ["1736934123456", "1736934234567", "1736934345678"],
    "newStatus": "Pending Account Executive Approval",
    "nextApprover": "ae1",
    "approvedBy": "vp_ops1",
    "approvedAt": "2025-01-15T20:00:00Z",
    "delayed": true,
    "processingDay": "Next Day",
    "warningMessage": "Approvals after 7:00 PM will be processed next business day"
  }
}
```

#### Business Logic

1. Validate all request IDs exist and are pending VP approval
2. Verify current user is approver for all requests
3. Check current time for delayed flag (same logic as single approval)
4. Create history entry for each request:
   - Action: "Approved by VP Operations"
   - Comments: "Bulk approved" or "Bulk approved (after deadline)"
5. Update all requests:
   - Status: "Pending Account Executive Approval"
   - CurrentApprover: Account Executive username
   - Delayed: Time-based flag
   - History: Append approval entry
6. Save all updated requests to database
7. Return summary with processing day information

---

## PART 4: Account Executive Approval

---

### API 4.1: Get Pending Reliever Requests (Account Executive)

**Endpoint:** `GET /api/reliever-payments/account-executive/pending`

**Description:** Retrieve all reliever payment requests pending approval by the logged-in Account Executive, including already approved/rejected requests for history.

#### Request Headers

```json
{
  "Authorization": "Bearer {token}",
  "User-Role": "ACCOUNT_EXECUTIVE"
}
```

#### Query Parameters

```
?status=Pending Account Executive Approval
&name=Rajesh
&site=Site A
&delayed=false
```

#### Response (Success - 200 OK)

```json
{
  "success": true,
  "data": {
    "pendingRequests": [
      {
        "id": "1736934123456",
        "name": "Rajesh Kumar",
        "relieverEmpCode": "REL2025001",
        "amount": 1500.0,
        "site": "Site A",
        "status": "Pending Account Executive Approval",
        "currentApprover": "ae1",
        "delayed": false,
        "submittedAt": "2025-01-15T10:30:00Z",
        "approvedByLineManager": "manager1",
        "approvedByVP": "vp_ops1",
        "vpApprovalAt": "2025-01-15T18:45:00Z"
      }
    ],
    "approvedRequests": [
      {
        "id": "1736934111111",
        "name": "Suresh Patil",
        "amount": 1800.0,
        "status": "Approved",
        "approvedAt": "2025-01-14T15:00:00Z",
        "voucherNo": "PAY/REL/Site A/2025/0001",
        "transactionId": "TXN_REL_1736851200000"
      }
    ],
    "rejectedRequests": [],
    "counts": {
      "pending": 1,
      "approved": 1,
      "rejected": 0
    }
  }
}
```

#### Business Logic

1. Get logged-in Account Executive from session
2. Retrieve all requests from `relieverRequests` database table
3. Filter and categorize requests:
   - **Pending:** `status === "Pending Account Executive Approval"` AND `currentApprover === currentUser.username`
   - **Approved:** `status === "Approved"` AND history contains approval by current user
   - **Rejected:** `status === "Rejected by Account Executive"` AND history contains rejection by current user
4. Sort each category (pending first, then approved, then rejected)
5. Apply additional filters if provided
6. Return categorized results with counts

---

### API 4.2: Approve Reliever Request (Account Executive)

**Endpoint:** `POST /api/reliever-payments/account-executive/approve`

**Description:** Account Executive gives final approval, posts accounting entries (Dr X2002002001, Cr L2001002), generates voucher, and moves request to approved status.

#### Request Headers

```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {token}",
  "User-Role": "ACCOUNT_EXECUTIVE"
}
```

#### Request Body

```json
{
  "requestId": "1736934123456",
  "comments": "Approved - Liability created for payment processing"
}
```

#### Response (Success - 200 OK)

```json
{
  "success": true,
  "message": "Request #123456 approved - Liability created",
  "data": {
    "requestId": "1736934123456",
    "previousStatus": "Pending Account Executive Approval",
    "newStatus": "Approved",
    "approvedBy": "ae1",
    "approvedAt": "2025-01-15T19:00:00Z",
    "accounting": {
      "voucherNo": "PAY/REL/Site A/2025/0001",
      "transactionId": "TXN_REL_1736967600000_1736934123456",
      "voucherType": "Journal Voucher",
      "date": "2025-01-15",
      "totalAmount": 1500.0,
      "glEntries": [
        {
          "lineNo": 1,
          "glCode": "X2002002001",
          "glName": "RELIEVER PAYMENTS",
          "debit": 1500.0,
          "credit": 0,
          "narration": "Reliever payment - Rajesh Kumar - Temporary staff coverage",
          "costCenter": "Site A"
        },
        {
          "lineNo": 2,
          "glCode": "L2001002",
          "glName": "EMPLOYEE RELIEVER ACCOUNT",
          "debit": 0,
          "credit": 1500.0,
          "narration": "Reliever liability created - Rajesh Kumar",
          "costCenter": "Site A"
        }
      ]
    },
    "paymentDetails": {
      "relieverName": "Rajesh Kumar",
      "accountNo": "123456789012",
      "ifscCode": "SBIN0001234",
      "amount": 1500.0,
      "readyForPayment": true
    }
  }
}
```

#### Response (Error - 500 Internal Server Error)

```json
{
  "success": false,
  "error": "ACCOUNTING_ERROR",
  "message": "Failed to post accounting entries",
  "details": {
    "reason": "Ledger update failed for GL Code X2002002001",
    "requestId": "1736934123456"
  }
}
```

#### Business Logic - Accounting Processing

1. **Validate Request:**
   - Request exists and is in "Pending Account Executive Approval"
   - Current user is assigned approver
   - Amount is valid (> 0)

2. **Generate Voucher Number:**
   - Format: `PAY/REL/{Site}/{Year}/{SequenceNo}`
   - Example: `PAY/REL/Site A/2025/0001`
   - Increment counter in `voucherCounters` database table

3. **Create Transaction Object:**

   ```javascript
   {
     id: `TXN_REL_{timestamp}_{requestId}`,
     voucherNo: voucherNo,
     voucherType: "Journal Voucher",
     date: getCurrentDate(),
     relieverRequestId: requestId,
     entries: [
       {
         lineNo: 1,
         glCode: 'X2002002001',
         glName: "RELIEVER PAYMENTS",
         debit: amount,
         credit: 0,
         narration: `Reliever payment - ${relieverName}`,
         costCenter: site,
         employeeId: relieverEmpCode,
         days: 1,
         ratePerDay: amount
       },
       {
         lineNo: 2,
         glCode: 'L2001002',
         glName: "EMPLOYEE RELIEVER ACCOUNT",
         debit: 0,
         credit: amount,
         narration: `Reliever liability created - ${relieverName}`,
         costCenter: site
       }
     ],
     totalDebit: amount,
     totalCredit: amount,
     narration: `Reliever payment approved for ${relieverName}`,
     approvedBy: currentUser.username,
     approvedDate: new Date().toISOString()
   }
   ```

4. **Post Transaction:**
   - Validate debits equal credits
   - Save transaction to `transactions` database table
   - Update ledger balances for X2002002001 and L2001002

5. **Update Request:**
   - Status: "Approved"
   - ApprovedAt: Current timestamp
   - AeApprovedBy: Current user username
   - VoucherNo: Generated voucher number
   - TransactionId: Generated transaction ID
   - ExpenseGLCode: "X2002002001"
   - LiabilityGLCode: "L2001002"
   - History: Append approval entry

6. **Store for Payment Processing:**
   - Add request to `relieverapprovedRequests` database table
   - This makes it available for payment processing page

7. **Return Success Response** with:
   - Voucher details
   - GL entries posted
   - Payment ready confirmation

---

### API 4.3: Reject Reliever Request (Account Executive)

**Endpoint:** `POST /api/reliever-payments/account-executive/reject`

**Description:** Account Executive rejects a reliever payment request with a reason (no accounting entries posted).

#### Request Headers

```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {token}",
  "User-Role": "ACCOUNT_EXECUTIVE"
}
```

#### Request Body

```json
{
  "requestId": "1736934123456",
  "reason": "Invalid bank account details. Please verify IFSC code and account number."
}
```

#### Response (Success - 200 OK)

```json
{
  "success": true,
  "message": "Request #123456 rejected",
  "data": {
    "requestId": "1736934123456",
    "previousStatus": "Pending Account Executive Approval",
    "newStatus": "Rejected by Account Executive",
    "rejectedBy": "ae1",
    "rejectedAt": "2025-01-15T19:30:00Z",
    "rejectionReason": "Invalid bank account details. Please verify IFSC code and account number.",
    "returnedTo": "oe1"
  }
}
```

#### Business Logic

1. Validate request exists and is pending AE approval
2. Validate reason is provided (minimum 10 characters)
3. Create history entry:
   - Action: "Rejected by Account Executive"
   - By: Current user username
   - At: Current timestamp
   - Comments: Rejection reason
4. Update request:
   - Status: "Rejected by Account Executive"
   - CurrentApprover: `request.submittedBy` (return to OE)
   - RejectionReason: User-provided reason
   - RejectedAt: Current timestamp
   - History: Append rejection entry
5. Save to database (do NOT add to approvedRequests)
6. Send notification to submitter

---

### API 4.4: Bulk Approve Reliever Requests (Account Executive)

**Endpoint:** `POST /api/reliever-payments/account-executive/bulk-approve`

**Description:** Account Executive approves multiple reliever payment requests in batch, posting accounting entries for each.

#### Request Headers

```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {token}",
  "User-Role": "ACCOUNT_EXECUTIVE"
}
```

#### Request Body

```json
{
  "requestIds": ["1736934123456", "1736934234567", "1736934345678"],
  "comments": "Bulk approved - All reliever payments verified"
}
```

#### Response (Success - 200 OK)

```json
{
  "success": true,
  "message": "✅ 3 reliever payments approved - Liability created",
  "data": {
    "approvedCount": 3,
    "requestIds": ["1736934123456", "1736934234567", "1736934345678"],
    "accounting": {
      "voucherNumbers": [
        "PAY/REL/Site A/2025/0001",
        "PAY/REL/Site A/2025/0002",
        "PAY/REL/Site B/2025/0001"
      ],
      "totalAmount": 4500.0,
      "glSummary": {
        "X2002002001": {
          "description": "RELIEVER PAYMENTS",
          "debit": 4500.0
        },
        "L2001002": {
          "description": "EMPLOYEE RELIEVER ACCOUNT",
          "credit": 4500.0
        }
      }
    },
    "payments": [
      {
        "relieverName": "Rajesh Kumar",
        "amount": 1500.0,
        "voucherNo": "PAY/REL/Site A/2025/0001",
        "transactionId": "TXN_REL_1736967600000_1736934123456"
      },
      {
        "relieverName": "Suresh Patil",
        "amount": 1800.0,
        "voucherNo": "PAY/REL/Site A/2025/0002",
        "transactionId": "TXN_REL_1736967601000_1736934234567"
      },
      {
        "relieverName": "Mohan Yadav",
        "amount": 1200.0,
        "voucherNo": "PAY/REL/Site B/2025/0001",
        "transactionId": "TXN_REL_1736967602000_1736934345678"
      }
    ],
    "approvedBy": "ae1",
    "approvedAt": "2025-01-15T19:00:00Z",
    "readyForPayment": true
  }
}
```

#### Business Logic

1. Validate all request IDs exist and are pending AE approval
2. Verify current user is approver for all requests
3. **Process Each Request:**
   - Call `processRelieverPaymentApproval()` for each request
   - Generate unique voucher number
   - Create transaction with GL entries
   - Post transaction to ledger
   - Update request status to "Approved"
4. **Aggregate Results:**
   - Collect all voucher numbers
   - Calculate total amount
   - Create GL summary (total debits/credits by account)
5. **Store Approved Requests:**
   - Add all approved requests to `relieverapprovedRequests` database table
6. **Update All Requests:**
   - Status: "Approved"
   - ApprovedAt: Current timestamp
   - VoucherNo, TransactionId: Individual values
   - ExpenseGLCode, LiabilityGLCode: Standard codes
   - History: Append "Bulk approved" entry
7. Return comprehensive summary with all vouchers and payment details

---

### API 4.5: View Voucher Details

**Endpoint:** `GET /api/reliever-payments/account-executive/voucher/{voucherNo}`

**Description:** Retrieve complete voucher details including GL entries for a reliever payment.

#### Request Headers

```json
{
  "Authorization": "Bearer {token}",
  "User-Role": "ACCOUNT_EXECUTIVE"
}
```

#### Path Parameters

- `voucherNo`: Voucher number (e.g., PAY/REL/Site A/2025/0001)

#### Response (Success - 200 OK)

```json
{
  "success": true,
  "data": {
    "voucherNo": "PAY/REL/Site A/2025/0001",
    "voucherType": "Journal Voucher",
    "date": "2025-01-15",
    "transactionId": "TXN_REL_1736967600000_1736934123456",
    "relieverDetails": {
      "name": "Rajesh Kumar",
      "relieverEmpCode": "REL2025001",
      "replacedEmployee": "Amit Sharma",
      "site": "Site A",
      "days": 1,
      "ratePerDay": 1500.0
    },
    "amount": 1500.0,
    "approvedBy": "ae1",
    "approvedDate": "2025-01-15T19:00:00Z",
    "glEntries": [
      {
        "lineNo": 1,
        "glCode": "X2002002001",
        "glName": "RELIEVER PAYMENTS",
        "debit": 1500.0,
        "credit": 0,
        "narration": "Reliever payment - Rajesh Kumar - Temporary staff coverage",
        "costCenter": "Site A",
        "employeeId": "REL2025001"
      },
      {
        "lineNo": 2,
        "glCode": "L2001002",
        "glName": "EMPLOYEE RELIEVER ACCOUNT",
        "debit": 0,
        "credit": 1500.0,
        "narration": "Reliever liability created - Rajesh Kumar",
        "costCenter": "Site A"
      }
    ],
    "totalDebit": 1500.0,
    "totalCredit": 1500.0,
    "status": "Posted"
  }
}
```

#### Business Logic

1. Parse voucher number from path parameter
2. Search `transactions` database table for matching voucherNo
3. Retrieve associated reliever request details
4. Return complete voucher with GL entries
5. If not found, return 404 error

---

## PART 5: Payment Processing

---

### API 5.1: Get Approved Reliever Payments

**Endpoint:** `GET /api/reliever-payments/payment-processing/approved`

**Description:** Retrieve all approved reliever payments ready for bank payment processing (liability has been created, awaiting actual payment).

#### Request Headers

```json
{
  "Authorization": "Bearer {token}",
  "User-Role": "FINANCE_TEAM"
}
```

#### Query Parameters

```
?site=Site A
&fromDate=2025-01-01
&toDate=2025-01-31
&minAmount=1000
&maxAmount=5000
```

#### Response (Success - 200 OK)

```json
{
  "success": true,
  "data": {
    "approvedPayments": [
      {
        "id": "1736934123456",
        "relieverName": "Rajesh Kumar",
        "relieverEmpCode": "REL2025001",
        "employeeId": "EMP-001",
        "site": "Site A",
        "days": 1,
        "amount": 1500.0,
        "accountNo": "123456789012",
        "ifscCode": "SBIN0001234",
        "bankName": "State Bank of India",
        "approvedDate": "2025-01-15T19:00:00Z",
        "voucherNo": "PAY/REL/Site A/2025/0001",
        "transactionId": "TXN_REL_1736967600000_1736934123456",
        "expenseGLCode": "X2002002001",
        "liabilityGLCode": "L2001002"
      },
      {
        "id": "1736934234567",
        "relieverName": "Suresh Patil",
        "relieverEmpCode": "REL2025002",
        "employeeId": "EMP-002",
        "site": "Site A",
        "days": 1,
        "amount": 1800.0,
        "accountNo": "234567890123",
        "ifscCode": "HDFC0001234",
        "bankName": "HDFC Bank",
        "approvedDate": "2025-01-15T19:00:00Z",
        "voucherNo": "PAY/REL/Site A/2025/0002",
        "transactionId": "TXN_REL_1736967601000_1736934234567",
        "expenseGLCode": "X2002002001",
        "liabilityGLCode": "L2001002"
      }
    ],
    "summary": {
      "totalPayments": 2,
      "totalAmount": 3300.0,
      "bySite": {
        "Site A": {
          "count": 2,
          "amount": 3300.0
        }
      }
    }
  }
}
```

#### Business Logic

1. Retrieve all approved requests from `relieverapprovedRequests` database table
2. Transform data for payment processing display
3. Apply filters (site, date range, amount range) if provided
4. Calculate summary statistics:
   - Total count and amount
   - Breakdown by site
5. Return approved payments list with summary

---

### API 5.2: Download Bank Upload File

**Endpoint:** `POST /api/reliever-payments/payment-processing/download-bank-file`

**Description:** Generate and download NEFT-format bank upload file for selected reliever payments.

#### Request Headers

```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {token}",
  "User-Role": "FINANCE_TEAM"
}
```

#### Request Body

```json
{
  "paymentIds": ["1736934123456", "1736934234567"],
  "companyBankAccount": "987654321098",
  "companyBankIfsc": "ICIC0001234"
}
```

#### Response (Success - 200 OK)

```json
{
  "success": true,
  "message": "Bank upload file generated successfully",
  "data": {
    "fileName": "Reliever_Bank_Payment_File_20250115_190000.xlsx",
    "downloadUrl": "/downloads/bank-files/reliever/20250115_190000.xlsx",
    "recordCount": 2,
    "totalAmount": 3300.0,
    "generatedAt": "2025-01-15T19:00:00Z",
    "expiresAt": "2025-01-15T23:00:00Z"
  }
}
```

#### File Format (Excel)

| Column             | Description              | Example      |
| ------------------ | ------------------------ | ------------ |
| TYPE               | Transfer type            | NEFT         |
| DEBIT BANK A/C NO  | Company bank account     | 987654321098 |
| DEBIT AMT          | Payment amount           | 1500.00      |
| CUR                | Currency                 | INR          |
| BENEFICIARY A/C NO | Reliever account number  | 123456789012 |
| IFSC CODE          | Beneficiary IFSC         | SBIN0001234  |
| NARRATION/NAME     | Reliever name (20 chars) | Rajesh Kumar |

#### Business Logic

1. Validate selected payment IDs exist in approved payments
2. Retrieve company bank account details
3. Generate Excel file with NEFT format:
   - One row per reliever payment
   - Company account as debit
   - Reliever account as beneficiary
4. Auto-size columns for readability
5. Generate unique filename with timestamp
6. Save file to temporary storage
7. Return download URL (file expires after 4 hours)

---

### API 5.3: Download System Upload File

**Endpoint:** `POST /api/reliever-payments/payment-processing/download-system-file`

**Description:** Generate and download system tracking file with complete reliever payment details including GL codes.

#### Request Headers

```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {token}",
  "User-Role": "FINANCE_TEAM"
}
```

#### Request Body

```json
{
  "paymentIds": ["1736934123456", "1736934234567"]
}
```

#### Response (Success - 200 OK)

```json
{
  "success": true,
  "message": "System upload file generated successfully",
  "data": {
    "fileName": "Reliever_System_Upload_File_20250115_190000.xlsx",
    "downloadUrl": "/downloads/system-files/reliever/20250115_190000.xlsx",
    "recordCount": 2,
    "totalAmount": 3300.0,
    "generatedAt": "2025-01-15T19:00:00Z"
  }
}
```

#### File Format (Excel)

| Column         | Description                  | Example                  |
| -------------- | ---------------------------- | ------------------------ |
| Reliever Name  | Reliever full name           | Rajesh Kumar             |
| Employee ID    | Reliever employee code       | REL2025001               |
| Site           | Work location                | Site A                   |
| Days Worked    | Number of days               | 1                        |
| Amount         | Payment amount               | 1500.00                  |
| Account Number | Reliever bank account        | 123456789012             |
| IFSC Code      | Bank IFSC code               | SBIN0001234              |
| Bank Name      | Bank name                    | State Bank of India      |
| Payment Date   | Payment date                 | 2025-01-15               |
| UTR            | UTR number (empty initially) |                          |
| Voucher No     | Expense voucher              | PAY/REL/Site A/2025/0001 |
| Expense GL     | Expense GL code              | X2002002001              |
| Liability GL   | Liability GL code            | L2001002                 |

#### Business Logic

1. Validate selected payment IDs
2. Retrieve complete reliever payment details
3. Generate Excel file with all tracking columns
4. Include GL codes for accounting reference
5. UTR column left blank (to be filled after payment)
6. Auto-size columns
7. Generate unique filename with timestamp
8. Return download URL

---

### API 5.4: Upload UTR and Process Payment

**Endpoint:** `POST /api/reliever-payments/payment-processing/upload-utr`

**Description:** Upload UTR details after bank payment, post final payment voucher (Dr L2001002, Cr Bank), and mark payments as complete.

#### Request Headers

```json
{
  "Content-Type": "multipart/form-data",
  "Authorization": "Bearer {token}",
  "User-Role": "FINANCE_TEAM"
}
```

#### Request Body (Form Data)

```json
{
  "bankCode": "A3004003_ICICI",
  "utrFile": "<EXCEL_FILE>",
  "paymentDate": "2025-01-16",
  "remarks": "Reliever payments processed via NEFT"
}
```

#### UTR File Format (Excel Upload)

| Column         | Required | Description                  |
| -------------- | -------- | ---------------------------- |
| Reliever Name  | Yes      | Must match approved payment  |
| Employee ID    | Yes      | Must match reliever code     |
| Amount         | Yes      | Must match approved amount   |
| UTR            | Yes      | Unique transaction reference |
| Account Number | Yes      | Must match reliever account  |

#### Response (Success - 200 OK)

```json
{
  "success": true,
  "message": "Processed 2 reliever bank payments totaling ₹3,300.00",
  "data": {
    "voucherNo": "PAY/BANK/REL/Site A/2025/0001",
    "transactionId": "TXN_REL_BANK_1737024000000",
    "totalAmount": 3300.0,
    "paymentCount": 2,
    "bankDetails": {
      "bankCode": "A3004003_ICICI",
      "bankName": "ICICI Bank - Current Account"
    },
    "glEntries": [
      {
        "lineNo": 1,
        "glCode": "L2001002",
        "glName": "EMPLOYEE RELIEVER ACCOUNT",
        "debit": 3300.0,
        "credit": 0,
        "narration": "Reliever payments batch - 2 relievers",
        "costCenter": "HEAD OFFICE"
      },
      {
        "lineNo": 2,
        "glCode": "A3004003_ICICI",
        "glName": "ICICI Bank - Current Account",
        "debit": 0,
        "credit": 3300.0,
        "narration": "Bank payment for 2 reliever payments",
        "costCenter": "HEAD OFFICE"
      }
    ],
    "payments": [
      {
        "relieverName": "Rajesh Kumar",
        "amount": 1500.0,
        "utr": "NEFT251601234567",
        "accountNo": "123456789012",
        "status": "Paid"
      },
      {
        "relieverName": "Suresh Patil",
        "amount": 1800.0,
        "utr": "NEFT251607654321",
        "accountNo": "234567890123",
        "status": "Paid"
      }
    ],
    "processedAt": "2025-01-16T10:00:00Z"
  }
}
```

#### Response (Error - 400 Bad Request)

```json
{
  "success": false,
  "error": "UTR_MISMATCH",
  "message": "UTR file validation failed",
  "details": {
    "errors": [
      {
        "relieverName": "Rajesh Kumar",
        "issue": "Amount mismatch: Expected 1500.00, Found 1400.00"
      },
      {
        "relieverName": "Unknown Reliever",
        "issue": "No matching approved payment found"
      }
    ]
  }
}
```

#### Business Logic - UTR Processing and Payment Posting

1. **Parse UTR Excel File:**
   - Read uploaded Excel file
   - Extract columns: Reliever Name, Employee ID, Amount, UTR, Account Number
   - Validate all required columns present

2. **Match with Approved Payments:**
   - For each UTR entry, find matching approved payment:
     - Match by Reliever Name + Employee ID + Amount
     - Validate account number matches
   - Track unmatched entries as errors

3. **Validate Bank Selection:**
   - Verify bank code exists in Chart of Accounts
   - Parent code must be A3004003 (Bank Accounts)
   - Type must be ACCOUNT

4. **Generate Payment Voucher Number:**
   - Format: `PAY/BANK/REL/{Site}/{Year}/{SequenceNo}`
   - Example: `PAY/BANK/REL/Site A/2025/0001`
   - Increment counter in `voucherCounters` database table

5. **Create Payment Transaction:**

   ```javascript
   {
     id: `TXN_REL_BANK_{timestamp}`,
     voucherNo: voucherNo,
     voucherType: "Payment Voucher",
     date: paymentDate,
     relieverPaymentBatch: true,
     entries: [
       {
         lineNo: 1,
         glCode: 'L2001002',
         glName: "EMPLOYEE RELIEVER ACCOUNT",
         debit: totalAmount,
         credit: 0,
         narration: `Reliever payments batch - ${count} relievers`,
         costCenter: 'HEAD OFFICE'
       },
       {
         lineNo: 2,
         glCode: selectedBankCode,
         glName: selectedBankName,
         debit: 0,
         credit: totalAmount,
         narration: `Bank payment for ${count} reliever payments`,
         costCenter: 'HEAD OFFICE'
       }
     ],
     totalDebit: totalAmount,
     totalCredit: totalAmount
   }
   ```

6. **Post Transaction:**
   - Validate debits equal credits
   - Save transaction to `transactions` database table
   - Update ledger balances:
     - Debit L2001002 (reduce liability)
     - Credit A3004003\_{Bank} (reduce bank balance)

7. **Update Reliever Payment Records:**
   - For each matched payment:
     - Status: "Paid"
     - UTR: From uploaded file
     - PaymentDate: From request
     - PaymentVoucherNo: Generated voucher
     - PaymentTransactionId: Generated transaction ID
     - BankCode: Selected bank
     - PaidAt: Current timestamp

8. **Remove from Approved Payments:**
   - Remove processed payments from `relieverapprovedRequests` database table
   - Prevents duplicate processing

9. **Update Original Requests:**
   - Update status in `relieverRequests` database table to "Paid"
   - Add payment history entry

10. **Return Success Response** with:
    - Payment voucher details
    - GL entries posted
    - List of payments with UTR numbers
    - Processing summary

---

### API 5.5: Get Payment History

**Endpoint:** `GET /api/reliever-payments/payment-processing/history`

**Description:** Retrieve history of all processed reliever payments with UTR details.

#### Request Headers

```json
{
  "Authorization": "Bearer {token}",
  "User-Role": "FINANCE_TEAM"
}
```

#### Query Parameters

```
?fromDate=2025-01-01
&toDate=2025-01-31
&site=Site A
&utr=NEFT251601234567
&page=1
&limit=20
```

#### Response (Success - 200 OK)

```json
{
  "success": true,
  "data": {
    "payments": [
      {
        "id": "1736934123456",
        "relieverName": "Rajesh Kumar",
        "relieverEmpCode": "REL2025001",
        "site": "Site A",
        "amount": 1500.0,
        "status": "Paid",
        "accountNo": "123456789012",
        "ifscCode": "SBIN0001234",
        "bankName": "State Bank of India",
        "approvedDate": "2025-01-15T19:00:00Z",
        "paidDate": "2025-01-16",
        "utr": "NEFT251601234567",
        "expenseVoucherNo": "PAY/REL/Site A/2025/0001",
        "paymentVoucherNo": "PAY/BANK/REL/Site A/2025/0001",
        "expenseGLCode": "X2002002001",
        "liabilityGLCode": "L2001002",
        "bankCode": "A3004003_ICICI"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalRecords": 1,
      "limit": 20
    },
    "summary": {
      "totalAmount": 1500.0,
      "totalPayments": 1
    }
  }
}
```

#### Business Logic

1. Search all reliever requests with status "Paid"
2. Apply filters:
   - Date range (paidDate between fromDate and toDate)
   - Site
   - UTR number (exact match)
3. Sort by payment date (newest first)
4. Paginate results
5. Calculate summary statistics
6. Return payment history with pagination

---

## PART 6: Reporting & Tracking

---

### API 6.1: Get All Reliever Requests (Admin)

**Endpoint:** `GET /api/reliever-payments/admin/all-requests`

**Description:** Retrieve all reliever payment requests across all statuses for administrative reporting.

#### Request Headers

```json
{
  "Authorization": "Bearer {token}",
  "User-Role": "ADMIN"
}
```

#### Query Parameters

```
?status=Approved
&site=Site A
&submittedBy=oe1
&fromDate=2025-01-01
&toDate=2025-01-31
&minAmount=1000
&maxAmount=5000
&page=1
&limit=20
```

#### Response (Success - 200 OK)

```json
{
  "success": true,
  "data": {
    "requests": [
      {
        "id": "1736934123456",
        "name": "Rajesh Kumar",
        "relieverEmpCode": "REL2025001",
        "site": "Site A",
        "type": "Security",
        "amount": 1500.0,
        "status": "Paid",
        "submittedBy": "oe1",
        "submittedAt": "2025-01-15T10:30:00Z",
        "approvedByLineManager": "manager1",
        "approvedByVP": "vp_ops1",
        "approvedByAE": "ae1",
        "aeApprovalAt": "2025-01-15T19:00:00Z",
        "paidAt": "2025-01-16T10:00:00Z",
        "voucherNo": "PAY/REL/Site A/2025/0001",
        "utr": "NEFT251601234567"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalRecords": 1,
      "limit": 20
    },
    "summary": {
      "totalRequests": 1,
      "byStatus": {
        "Paid": 1
      },
      "bySite": {
        "Site A": 1
      },
      "totalAmount": 1500.0
    }
  }
}
```

#### Business Logic

1. Retrieve all requests from `relieverRequests` database table
2. Apply all filters (status, site, submitter, date range, amount)
3. Sort by submission date (newest first)
4. Paginate results
5. Calculate comprehensive summary:
   - Total count
   - Breakdown by status
   - Breakdown by site
   - Total amount (for approved/paid requests)
6. Return filtered and paginated results with summary

---

### API 6.2: Get Reliever Payment Statistics

**Endpoint:** `GET /api/reliever-payments/reports/statistics`

**Description:** Get comprehensive statistics on reliever payments for dashboard and reporting.

#### Request Headers

```json
{
  "Authorization": "Bearer {token}",
  "User-Role": "ADMIN"
}
```

#### Query Parameters

```
?fromDate=2025-01-01
&toDate=2025-01-31
&site=Site A
```

#### Response (Success - 200 OK)

```json
{
  "success": true,
  "data": {
    "period": {
      "fromDate": "2025-01-01",
      "toDate": "2025-01-31"
    },
    "overview": {
      "totalRequests": 25,
      "totalAmount": 37500.0,
      "approvedRequests": 20,
      "approvedAmount": 30000.0,
      "paidRequests": 15,
      "paidAmount": 22500.0,
      "pendingRequests": 3,
      "pendingAmount": 4500.0,
      "rejectedRequests": 2,
      "rejectedAmount": 3000.0
    },
    "byStatus": {
      "Pending Line Manager Approval": {
        "count": 1,
        "amount": 1500.0
      },
      "Pending VP Operations Approval": {
        "count": 1,
        "amount": 1500.0
      },
      "Pending Account Executive Approval": {
        "count": 1,
        "amount": 1500.0
      },
      "Approved": {
        "count": 5,
        "amount": 7500.0
      },
      "Paid": {
        "count": 15,
        "amount": 22500.0
      },
      "Rejected by Line Manager": {
        "count": 1,
        "amount": 1500.0
      },
      "Rejected by VP Operations": {
        "count": 0,
        "amount": 0
      },
      "Rejected by Account Executive": {
        "count": 1,
        "amount": 1500.0
      }
    },
    "bySite": {
      "Site A": {
        "count": 15,
        "amount": 22500.0
      },
      "Site B": {
        "count": 8,
        "amount": 12000.0
      },
      "Site C": {
        "count": 2,
        "amount": 3000.0
      }
    },
    "byType": {
      "Security": {
        "count": 18,
        "amount": 27000.0
      },
      "Housekeeping": {
        "count": 5,
        "amount": 7500.0
      },
      "Electrician": {
        "count": 2,
        "amount": 3000.0
      }
    },
    "byShift": {
      "Morning": {
        "count": 10,
        "amount": 15000.0
      },
      "Evening": {
        "count": 8,
        "amount": 12000.0
      },
      "Night": {
        "count": 7,
        "amount": 10500.0
      }
    },
    "approvalMetrics": {
      "averageApprovalTime": {
        "lineManager": "2.5 hours",
        "vpOperations": "1.8 hours",
        "accountExecutive": "3.2 hours",
        "total": "7.5 hours"
      },
      "approvalRate": {
        "lineManager": 92,
        "vpOperations": 95,
        "accountExecutive": 90,
        "overall": 80
      },
      "delayedApprovals": {
        "count": 5,
        "percentage": 20
      }
    },
    "paymentMetrics": {
      "averagePaymentTime": "1.5 days",
      "paymentSuccessRate": 100,
      "averagePaymentAmount": 1500.0
    }
  }
}
```

#### Business Logic

1. Retrieve all requests from `relieverRequests` database table
2. Filter by date range and site if provided
3. Calculate overview statistics:
   - Total, approved, paid, pending, rejected counts and amounts
4. Group and aggregate by:
   - Status
   - Site
   - Type (Security/Housekeeping/Electrician)
   - Shift (Morning/Evening/Night)
5. Calculate approval metrics:
   - Average approval time at each level
   - Approval rate (% approved vs rejected)
   - Delayed approvals count (VP approved after 7 PM)
6. Calculate payment metrics:
   - Average time from approval to payment
   - Payment success rate
   - Average payment amount
7. Return comprehensive statistics

---

### API 6.3: Export Reliever Payment Report

**Endpoint:** `POST /api/reliever-payments/reports/export`

**Description:** Generate and download comprehensive Excel report of reliever payments with all details.

#### Request Headers

```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {token}",
  "User-Role": "ADMIN"
}
```

#### Request Body

```json
{
  "reportType": "detailed",
  "fromDate": "2025-01-01",
  "toDate": "2025-01-31",
  "site": "Site A",
  "status": ["Approved", "Paid"],
  "includeGLEntries": true,
  "includeApprovalHistory": true
}
```

#### Field Validations

| Field                  | Required | Options                         |
| ---------------------- | -------- | ------------------------------- |
| reportType             | Yes      | summary / detailed / accounting |
| fromDate               | Yes      | Valid date                      |
| toDate                 | Yes      | Valid date, >= fromDate         |
| site                   | No       | Site A / Site B / Site C        |
| status                 | No       | Array of status values          |
| includeGLEntries       | No       | true / false                    |
| includeApprovalHistory | No       | true / false                    |

#### Response (Success - 200 OK)

```json
{
  "success": true,
  "message": "Report generated successfully",
  "data": {
    "fileName": "Reliever_Payment_Report_20250101_20250131.xlsx",
    "downloadUrl": "/downloads/reports/reliever/20250115_190000.xlsx",
    "reportType": "detailed",
    "recordCount": 15,
    "generatedAt": "2025-01-15T19:00:00Z",
    "expiresAt": "2025-01-16T19:00:00Z"
  }
}
```

#### Report Format (Detailed Type - Excel Sheets)

**Sheet 1: Summary**
| Metric | Value |
|--------|-------|
| Report Period | 01-Jan-2025 to 31-Jan-2025 |
| Total Requests | 25 |
| Total Amount | ₹37,500.00 |
| Approved Requests | 20 |
| Paid Requests | 15 |
| Pending Requests | 3 |
| Rejected Requests | 2 |

**Sheet 2: Reliever Payments**
| Columns |
|---------|
| Request ID, Reliever Name, Reliever Emp Code, Replaced Employee, Absent Emp Code, Reason, Date, Shift, Type, Site, Amount, Account No, IFSC Code, Bank Name, Status, Submitted By, Submitted At, Approved By LM, Approved By VP, Approved By AE, Paid Date, Expense Voucher, Payment Voucher, UTR |

**Sheet 3: GL Entries** (if includeGLEntries = true)
| Columns |
|---------|
| Voucher No, Voucher Type, Date, GL Code, GL Name, Debit, Credit, Narration, Cost Center |

**Sheet 4: Approval History** (if includeApprovalHistory = true)
| Columns |
|---------|
| Request ID, Reliever Name, Action, Performed By, Performed At, Comments |

#### Business Logic

1. Validate date range and filters
2. Retrieve filtered reliever requests
3. Based on reportType, generate appropriate sheets:
   - **Summary:** Overview statistics
   - **Detailed:** All request details + GL entries + approval history
   - **Accounting:** Focus on GL entries and voucher details
4. Format data for Excel:
   - Currency columns with ₹ symbol
   - Date formatting (DD-MMM-YYYY)
   - Auto-sized columns
   - Header row with bold formatting
5. Generate unique filename with parameters
6. Save to temporary storage
7. Return download URL (expires after 24 hours)

---

## Accounting Integration

### GL Posting - Expense Voucher (AE Approval)

**Scenario:** Account Executive approves reliever payment request  
**Amount:** ₹1,500  
**Site:** Site A  
**Reliever Name:** Rajesh Kumar

#### Journal Voucher Entry

```
Voucher No: PAY/REL/Site A/2025/0001
Voucher Type: Journal Voucher
Date: 15-Jan-2025

Line 1:
  Dr X2002002001 - RELIEVER PAYMENTS           ₹1,500.00
  Narration: Reliever payment - Rajesh Kumar
  Cost Center: Site A

Line 2:
  Cr L2001002 - EMPLOYEE RELIEVER ACCOUNT      ₹1,500.00
  Narration: Reliever liability created - Rajesh Kumar
  Cost Center: Site A

Total Debit:  ₹1,500.00
Total Credit: ₹1,500.00
```

**Impact on Ledgers:**

- **X2002002001 (Expense):** Increases by ₹1,500 (Debit)
- **L2001002 (Liability):** Increases by ₹1,500 (Credit)

**Business Meaning:**

- Company recognizes reliever expense
- Liability created for amount owed to reliever
- No cash movement yet

---

### GL Posting - Payment Voucher (Bank Payment with UTR)

**Scenario:** Finance team processes payment after UTR upload  
**Total Amount:** ₹3,300 (2 relievers: Rajesh ₹1,500 + Suresh ₹1,800)  
**Bank:** ICICI Bank (A3004003_ICICI)  
**Payment Date:** 16-Jan-2025

#### Payment Voucher Entry

```
Voucher No: PAY/BANK/REL/Site A/2025/0001
Voucher Type: Payment Voucher
Date: 16-Jan-2025

Line 1:
  Dr L2001002 - EMPLOYEE RELIEVER ACCOUNT      ₹3,300.00
  Narration: Reliever payments batch - 2 relievers
  Cost Center: HEAD OFFICE

Line 2:
  Cr A3004003_ICICI - ICICI Bank Current A/c   ₹3,300.00
  Narration: Bank payment for 2 reliever payments
  Cost Center: HEAD OFFICE

Total Debit:  ₹3,300.00
Total Credit: ₹3,300.00
```

**Impact on Ledgers:**

- **L2001002 (Liability):** Decreases by ₹3,300 (Debit) - liability cleared
- **A3004003_ICICI (Bank Asset):** Decreases by ₹3,300 (Credit) - cash paid out

**Business Meaning:**

- Liability to relievers is settled
- Cash paid from bank account
- UTR numbers recorded for each reliever for tracking

---

### Complete Accounting Flow Example

**Example: Single Reliever Payment - Full Lifecycle**

**Step 1: AE Approval (15-Jan-2025)**

```
Dr X2002002001 (Reliever Payments)          ₹1,500
Cr L2001002 (Employee Reliever Account)     ₹1,500
```

**Step 2: Bank Payment (16-Jan-2025)**

```
Dr L2001002 (Employee Reliever Account)     ₹1,500
Cr A3004003_ICICI (ICICI Bank)              ₹1,500
```

**Net Effect on Ledgers:**

- **X2002002001:** +₹1,500 (Expense recognized)
- **L2001002:** +₹1,500 - ₹1,500 = ₹0 (Liability created then cleared)
- **A3004003_ICICI:** -₹1,500 (Cash paid)

**Trial Balance Impact:**
| Account | Debit | Credit |
|---------|-------|--------|
| X2002002001 - RELIEVER PAYMENTS | ₹1,500 | |
| A3004003_ICICI - ICICI Bank | | ₹1,500 |

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

### Validation Errors (1100-1199)

| Code | Message                          | HTTP Status |
| ---- | -------------------------------- | ----------- |
| 1100 | Invalid amount value             | 400         |
| 1101 | Amount must be greater than zero | 400         |
| 1102 | Invalid IFSC code format         | 400         |
| 1103 | Invalid account number           | 400         |
| 1104 | Invalid date format              | 400         |
| 1105 | Future date not allowed          | 400         |
| 1106 | Invalid file format              | 400         |
| 1107 | File size exceeds limit (5MB)    | 400         |
| 1108 | Invalid shift selection          | 400         |
| 1109 | Invalid reliever type            | 400         |
| 1110 | Invalid site selection           | 400         |

### Request Errors (1200-1299)

| Code | Message                                     | HTTP Status |
| ---- | ------------------------------------------- | ----------- |
| 1200 | Request not found                           | 404         |
| 1201 | Request already processed                   | 400         |
| 1202 | Invalid request status                      | 400         |
| 1203 | Request not in pending status               | 400         |
| 1204 | User not authorized to approve this request | 403         |
| 1205 | Request already approved                    | 400         |
| 1206 | Request already rejected                    | 400         |
| 1207 | Cannot reject approved request              | 400         |
| 1208 | Rejection reason required                   | 400         |
| 1209 | Duplicate request ID                        | 400         |

### Approval Errors (1300-1399)

| Code | Message                               | HTTP Status |
| ---- | ------------------------------------- | ----------- |
| 1300 | Approval hierarchy not found          | 404         |
| 1301 | Line Manager not assigned             | 404         |
| 1302 | VP Operations not assigned            | 404         |
| 1303 | Account Executive not assigned        | 404         |
| 1304 | Invalid approval sequence             | 400         |
| 1305 | Previous approval pending             | 400         |
| 1306 | Approval deadline exceeded            | 400         |
| 1307 | Bulk approval limit exceeded (max 50) | 400         |

### Accounting Errors (1400-1499)

| Code | Message                    | HTTP Status |
| ---- | -------------------------- | ----------- |
| 1400 | GL code not found          | 404         |
| 1401 | Invalid GL code            | 400         |
| 1402 | Voucher generation failed  | 500         |
| 1403 | Transaction posting failed | 500         |
| 1404 | Ledger update failed       | 500         |
| 1405 | Debit-Credit mismatch      | 400         |
| 1406 | Voucher already exists     | 400         |
| 1407 | Transaction already posted | 400         |
| 1408 | Invalid cost center        | 400         |

### Payment Errors (1500-1599)

| Code | Message                        | HTTP Status |
| ---- | ------------------------------ | ----------- |
| 1500 | Bank code not found            | 404         |
| 1501 | Invalid bank selection         | 400         |
| 1502 | Payment already processed      | 400         |
| 1503 | UTR file validation failed     | 400         |
| 1504 | UTR amount mismatch            | 400         |
| 1505 | UTR already exists             | 400         |
| 1506 | No approved payments found     | 404         |
| 1507 | Payment file generation failed | 500         |
| 1508 | UTR upload failed              | 500         |
| 1509 | Duplicate UTR number           | 400         |

### File Errors (1600-1699)

| Code | Message                  | HTTP Status |
| ---- | ------------------------ | ----------- |
| 1600 | File upload failed       | 500         |
| 1601 | Invalid file type        | 400         |
| 1602 | File too large           | 400         |
| 1603 | File corrupted           | 400         |
| 1604 | Excel parsing failed     | 400         |
| 1605 | Missing required columns | 400         |
| 1606 | Invalid Excel format     | 400         |

---

## Business Rules

### General Rules

1. **Request Submission:**
   - All fields except `relieverFor` and `remarks` are mandatory
   - Amount must be greater than zero
   - Date cannot be in the future
   - ID Proof and Passbook PDF must be uploaded (max 5MB each)
   - Accepted file formats: PDF, JPG, PNG

2. **Approval Hierarchy:**
   - Fixed sequence: Line Manager → VP Operations → Account Executive
   - Each level can approve or reject
   - Rejection returns request to Operation Executive
   - Cannot skip approval levels

3. **Time-Based Processing (VP Operations):**
   - Approval before 19:00 (7 PM): Same-day processing flag
   - Approval after 19:00 (7 PM): Next-day processing flag
   - Warning displayed to VP for after-hours approvals
   - Does not block approval, only sets processing flag

4. **Account Executive Approval:**
   - Automatically posts GL entries upon approval
   - Creates expense (Dr X2002002001) and liability (Cr L2001002)
   - Generates voucher number in format: PAY/REL/{Site}/{Year}/{SequenceNo}
   - Adds approved request to payment processing queue
   - Cannot be undone once posted

5. **Payment Processing:**
   - Only approved requests available for payment
   - Supports batch processing (multiple relievers in one payment)
   - Requires bank selection from master
   - UTR mandatory for payment confirmation
   - Payment posts final voucher (Dr L2001002, Cr Bank)
   - Removes from approved queue after successful payment

### Validation Rules

6. **Amount Validations:**
   - Must be numeric with max 2 decimal places
   - Minimum: ₹100
   - Maximum: ₹10,000 (configurable)
   - UTR amount must match approved amount exactly

7. **Bank Account Validations:**
   - Account number: 10-18 digits only
   - IFSC code: Exactly 11 characters, format: XXXX0XXXXXX
   - Bank name: Max 100 characters

8. **File Upload Rules:**
   - Maximum file size: 5MB per file
   - Supported formats: PDF, JPG, JPEG, PNG
   - Files stored with unique names: {fieldName}\_{requestId}.{extension}
   - Files must be scanned for viruses (if applicable)

9. **Bulk Operations:**
   - Maximum 50 requests per bulk approval
   - All requests must be in same pending status
   - All requests must have same current approver
   - Partial success not allowed (all or nothing)

### Accounting Rules

10. **GL Posting Rules:**
    - Debits must equal credits
    - Cost center mandatory for all entries
    - Voucher number must be unique
    - Transaction ID must be unique
    - All GL codes must exist in Chart of Accounts

11. **Voucher Numbering:**
    - Expense Voucher: PAY/REL/{Site}/{Year}/{Seq}
    - Payment Voucher: PAY/BANK/REL/{Site}/{Year}/{Seq}
    - Sequence resets yearly per site
    - No gaps allowed in sequence

12. **Ledger Update Rules:**
    - Updates must be atomic (all or nothing)
    - Balance cannot go negative for asset/expense accounts
    - Liability balances can be negative (overpayment scenario)
    - All updates logged in audit trail

### Security Rules

13. **Role-Based Access:**
    - Operation Executive: Submit and view own requests only
    - Line Manager: View and approve assigned requests only
    - VP Operations: View and approve assigned requests only
    - Account Executive: View all, approve assigned, post GL entries
    - Finance Team: Process payments, upload UTR
    - Admin: View all, generate reports

14. **Data Privacy:**
    - Bank details visible only to authorized users (AE, Finance)
    - Document files accessible only by approvers and submitter
    - Payment history visible only to Finance and Admin
    - Personal details (account numbers) masked in logs

15. **Audit Trail:**
    - All actions logged with user, timestamp, comments
    - History cannot be edited or deleted
    - GL postings logged separately
    - Payment confirmations logged with UTR

### Operational Rules

16. **Request Lifecycle:**
    - Request can be rejected at any approval level
    - Rejected requests return to Operation Executive
    - Cannot resubmit rejected request (must create new)
    - Approved requests cannot be cancelled
    - Paid requests cannot be reversed (requires separate adjustment entry)

17. **Payment Processing:**
    - Bank file download triggers 4-hour expiry timer
    - UTR upload must happen within 3 business days
    - Failed payments require manual intervention
    - Duplicate UTR numbers not allowed
    - Payment confirmation sends notification to reliever (if contact available)

18. **Reporting:**
    - Reports generated on-demand with 24-hour retention
    - Export formats: Excel (XLSX)
    - Maximum date range: 1 year
    - Large reports (>10,000 records) generated asynchronously

---

## Summary

This API specification document provides comprehensive backend development guidelines for the **Process For Reliever Payments** module. It includes:

- **21 API endpoints** covering complete workflow from submission to payment
- **5 approval levels** with time-based business logic
- **Dual GL posting** (expense voucher + payment voucher)
- **Bank integration** with NEFT file generation and UTR tracking
- **Comprehensive reporting** with statistics and export capabilities
- **Complete error codes** and business rules

### Key Differentiators from Other Modules

1. **Time-Based Approval Logic:** VP Operations approval before/after 7 PM determines processing day
2. **Two-Stage GL Posting:**
   - Stage 1 (AE Approval): Dr Expense, Cr Liability
   - Stage 2 (Payment): Dr Liability, Cr Bank
3. **Document Requirements:** ID Proof and Passbook PDF mandatory
4. **Batch Payment Processing:** Multiple relievers paid together with single payment voucher

### Implementation Notes

- All GL codes must exist in Chart of Accounts before use
- Voucher counters maintained per site per year
- Bank master required for payment bank selection
- UTR tracking critical for payment reconciliation
- Approval hierarchy dynamically determined from user relationships
- Payment processing separate from approval workflow

---

**End of API Specification Document**

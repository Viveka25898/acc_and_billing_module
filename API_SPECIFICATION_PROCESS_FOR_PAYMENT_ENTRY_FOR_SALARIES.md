# API Specification: Process for Payment Entry for Salaries

## Overview

This document provides backend API specifications for the **Salary Payment Entry Process**. This process handles payroll batch submissions from the Payroll Team, review and approval by Account Executives (AE), and automatic GL posting for salary transactions.

### Key Features

- **38 Salary Heads Mapping**: Automatic GL mapping for earnings, employee deductions, and employer contributions
- **Employee-Level Aggregation**: Individual employee salary data aggregated by GL codes before posting
- **Automatic GL Posting**: On AE approval, system generates and posts complete journal voucher
- **Bulk Processing**: Support for approving multiple salary batches simultaneously
- **Excel Integration**: Upload, download, edit, and re-upload payroll data
- **Three Accounting Categories**:
  1. **Earnings** (23 heads): Dr Salaries & Wages, Cr Salary Payable
  2. **Employee Deductions** (13 heads): Dr Salaries & Wages, Cr specific payable accounts
  3. **Employer Contributions** (3 heads): Dr Employer expense, Cr Employer payable

### Process Workflow

```
Payroll Team (Upload Excel)
    ↓
Account Executive (Review & Approve)
    ↓
System (Auto GL Generation & Posting)
    ↓
Journal Voucher Created (JVF00 series)
```

### Roles

- **Payroll Team**: Upload monthly salary Excel files, view submission status
- **Account Executive (AE)**: Review batches, edit amounts, approve/reject with auto GL posting

---

## Data Models

### 1. Salary Batch Object

```json
{
  "id": "BATCH_1738742400000",
  "batchId": "BATCH_1738742400000",
  "payrollPeriod": "Jan 2026",
  "month": "January",
  "year": 2026,
  "employeeCount": 450,
  "totalAmount": 42500000,
  "grossAmount": 45000000,
  "totalDeductions": 2500000,
  "netPayable": 42500000,
  "pfEmployee": 1350000,
  "esicEmployee": 337500,
  "pt": 90000,
  "status": "Pending Approval",
  "assignedTo": "ae_user1",
  "submittedBy": "payroll_user1",
  "submittedAt": "2026-02-01T10:30:00Z",
  "approvedBy": null,
  "approvedAt": null,
  "rejectionReason": null,
  "fileName": "Salary_Jan2026.xlsx",
  "employeeDetails": [],
  "bankFile": {
    "TYPE": "NEFT",
    "DEBIT BANK A/C NO": "123456789012",
    "DEBIT AMT": 42500000,
    "CUR": "INR",
    "NARRATION/NAME": "Jan 2026 Salary"
  },
  "history": []
}
```

### 2. Employee Salary Detail Object

```json
{
  "MONTHATTENDANCEID": "ATT202601001234",
  "EMPCODE": "EMP1001",
  "FULLNAME": "Rajesh Kumar",
  "DESIGNATIONNAME": "Software Engineer",
  "DOJ": "2023-01-15",
  "BRANCHNAME": "Mumbai HQ",
  "SITECODE": "SITE001",
  "SITENAME": "Client Site ABC",
  "STATENAME": "Maharashtra",

  "BASIC": 25000,
  "DA": 6000,
  "HRA": 10000,
  "CONVEYANCE": 1600,
  "WASHING ALLOWANCE": 500,
  "OTHER ALLOWANCE": 1000,
  "MEDICAL ALLOWANCE": 1250,
  "SPL ALLOWANCE": 2000,
  "OT AMOUNT": 1200,
  "GROSS AMT": 48550,

  "PF": 3000,
  "ESIC": 168,
  "PT": 200,
  "TDS": 2000,
  "ADVANCE": 0,
  "TOTALDEDUCTION": 5368,

  "NETPAYABLE": 43182,

  "PF COMPANY": 3723,
  "ESIC COMPANY": 890,
  "LWF COMPANY": 20,

  "PF WAGES": 25000,
  "ESI WAGES": 21000,
  "PF NO": "MH/MUM/0012345",
  "ESIC NO": "1234567890",
  "UAN NO": "100123456789",

  "BANK NAME AS PER PAYMENT": "HDFC Bank",
  "BANK ACCOUNT NO AS PER PAYMENT": "12345678901",
  "IFS CODE AS PER PAYMENT": "HDFC0001234"
}
```

### 3. GL Entry Object

```json
{
  "glCode": "X2001001001",
  "accountName": "SALARIES & WAGES",
  "amount": 45000000,
  "type": "Debit",
  "salaryHead": "BASIC, DA, HRA, etc.",
  "category": "Earnings"
}
```

### 4. Transaction Object

```json
{
  "id": "TXN_SALARY_1738742500000",
  "voucherNo": "JVF00/42500/2602",
  "voucherType": "Journal Voucher",
  "transactionType": "Salary Payment",
  "date": "2026-02-05",
  "batchId": "BATCH_1738742400000",
  "payrollPeriod": "Jan 2026",
  "employeeCount": 450,
  "entries": [
    {
      "lineNo": 1,
      "glCode": "X2001001001",
      "glName": "SALARIES & WAGES",
      "accountName": "SALARIES & WAGES",
      "debit": 45000000,
      "credit": 0,
      "narration": "Salary for Jan 2026 - 450 employees",
      "category": "Earnings"
    }
  ],
  "totalDebit": 50613500,
  "totalCredit": 50613500,
  "narration": "Salary payment for Jan 2026 - 450 employees",
  "status": "Posted",
  "postedDate": "2026-02-05T11:45:00Z",
  "approvedBy": "AE User Name",
  "createdBy": "System",
  "createdAt": "2026-02-05T11:45:00Z"
}
```

---

## GL Account Master Reference

### Expense Accounts (Debit Side)

| GL Code     | Account Name               | Used For                                                    |
| ----------- | -------------------------- | ----------------------------------------------------------- |
| X2001001001 | SALARIES & WAGES           | All earnings (BASIC, DA, HRA, etc.) and employee deductions |
| X2001001002 | EMPLOYER PF CONTRIBUTION   | Employer's PF contribution (13.61%)                         |
| X2001001003 | EMPLOYER ESIC CONTRIBUTION | Employer's ESIC contribution (3.25%)                        |
| X2001001004 | EMPLOYER LWF CONTRIBUTION  | Employer's LWF contribution                                 |
| X2001001005 | LEAVE WAGES                | Leave with wages component                                  |
| X2001001007 | BONUS                      | Bonus payments                                              |

### Liability/Payable Accounts (Credit Side)

| GL Code  | Account Name                 | Used For                               |
| -------- | ---------------------------- | -------------------------------------- |
| L2002001 | SALARY PAYABLE               | Gross salary payable (consolidated)    |
| L2002002 | Employer PF Payable          | Employer's PF contribution payable     |
| L2002003 | Employer ESIC Payable        | Employer's ESIC contribution payable   |
| L2002004 | LWF PAYABLE - EMPLOYER SHARE | Employer's LWF payable                 |
| L2002006 | Employee PF Payable          | Employee's PF deduction                |
| L2002007 | Employee ESIC Payable        | Employee's ESIC deduction              |
| L2002008 | Employee LWF Payable         | Employee's LWF deduction               |
| L2002009 | Professional Tax Payable     | PT deduction                           |
| L2002010 | Staff Welfare Fund Payable   | Staff welfare deduction                |
| L2002011 | TDS Payable                  | TDS deduction                          |
| L2002012 | Other Deductions Payable     | Other deductions (uniform, mess, etc.) |

### Asset Account

| GL Code | Account Name      | Used For                     |
| ------- | ----------------- | ---------------------------- |
| A2001   | Employee Advances | Advance recovery from salary |

---

## Complete Salary Head to GL Mapping (38 Heads)

### Category 1: Earnings (23 Heads)

**All Earnings**: Dr X2001001001 (SALARIES & WAGES) | Cr L2002001 (SALARY PAYABLE)

| Salary Head           | Debit Account | Credit Account |
| --------------------- | ------------- | -------------- |
| BASIC                 | X2001001001   | L2002001       |
| DA                    | X2001001001   | L2002001       |
| HRA                   | X2001001001   | L2002001       |
| CONVEYANCE            | X2001001001   | L2002001       |
| WASHING ALLOWANCE     | X2001001001   | L2002001       |
| OTHER ALLOWANCE       | X2001001001   | L2002001       |
| LEAVE WITH WAGES      | X2001001005   | L2002001       |
| CCA                   | X2001001001   | L2002001       |
| EDUCATIONAL ALLOWANCE | X2001001001   | L2002001       |
| MEDICAL ALLOWANCE     | X2001001001   | L2002001       |
| OT AMOUNT             | X2001001001   | L2002001       |
| SPL ALLOWANCE         | X2001001001   | L2002001       |
| REIMBURSEMENT         | X2001001001   | L2002001       |
| BONUS                 | X2001001007   | L2002001       |
| MEAL                  | X2001001001   | L2002001       |
| SITE ALLOWANCE        | X2001001001   | L2002001       |
| CONY                  | X2001001001   | L2002001       |
| PERFORMANCE ALLOWANCE | X2001001001   | L2002001       |
| CASH RISK ALLOWANCE   | X2001001001   | L2002001       |
| INCENTIVE             | X2001001001   | L2002001       |
| FOOD                  | X2001001001   | L2002001       |
| METRO CITY ALLOWANCE  | X2001001001   | L2002001       |
| STIPEND               | X2001001001   | L2002001       |

### Category 2: Employee Deductions (13 Heads)

**All Deductions**: Dr X2001001001 (SALARIES & WAGES) | Cr Specific Payable

| Salary Head             | Debit Account | Credit Account                        |
| ----------------------- | ------------- | ------------------------------------- |
| PF                      | X2001001001   | L2002006 (Employee PF Payable)        |
| ESIC                    | X2001001001   | L2002007 (Employee ESIC Payable)      |
| PT                      | X2001001001   | L2002009 (Professional Tax Payable)   |
| LWF                     | X2001001001   | L2002008 (Employee LWF Payable)       |
| TDS                     | X2001001001   | L2002011 (TDS Payable)                |
| ADVANCE                 | X2001001001   | A2001 (Employee Advances - Asset)     |
| UNIFORM                 | X2001001001   | L2002012 (Other Deductions Payable)   |
| OTHER DEDUCTION         | X2001001001   | L2002012                              |
| MESS DEDUCTION          | X2001001001   | L2002012                              |
| UNIFORM DEDUCTION       | X2001001001   | L2002012                              |
| HRA DEDUCTION           | X2001001001   | L2002012                              |
| STAFF WELFARE FUND      | X2001001001   | L2002010 (Staff Welfare Fund Payable) |
| BACKGROUND VERIFICATION | X2001001001   | L2002012                              |

### Category 3: Employer Contributions (3 Heads)

**Employer Contributions**: Dr Employer Expense | Cr Employer Payable

| Salary Head  | Debit Account                            | Credit Account                    |
| ------------ | ---------------------------------------- | --------------------------------- |
| PF COMPANY   | X2001001002 (Employer PF Contribution)   | L2002002 (Employer PF Payable)    |
| ESIC COMPANY | X2001001003 (Employer ESIC Contribution) | L2002003 (Employer ESIC Payable)  |
| LWF COMPANY  | X2001001004 (Employer LWF Contribution)  | L2002004 (LWF Payable - Employer) |

---

## Excluded Fields (80+ Fields - No GL Posting)

These fields are present in the Excel upload but are NOT processed for GL posting:

### Employee Master Data

- MONTHATTENDANCEID, EMPMASTERID, EMPCODE, EMPOLDCODE
- FULLNAME, DOJ, DOB, GENDERNAME
- DESIGNATIONMASTERID, DESIGNATIONNAME
- DUTYMASTERID, DUTYNAME
- GROUPMASTERID, GROUP
- BRANCHNAME, SITECODE, SITENAME, STATENAME
- CLIENTGROUPCODE, CLIENTGROUPNAME

### Fixed Salary Structure (Master Data)

- FIXED_BASIC, FIXED_DA, FIXED_HRA, FIXED_CONVEYANCE
- FIXED_WASHING ALLOWANCE, FIXED_OTHER ALLOWANCE
- FIXED_LEAVE WITH WAGES, FIXED_CCA
- FIXED_EDUCATIONAL ALLOWANCE, FIXED_MEDICAL ALLOWANCE
- FIXED_SPL ALLOWANCE, FIXED_BONUS, FIXED_MEAL
- FIXED_SITE ALLOWANCE, FIXED_PERFORMANCE ALLOWANCE
- FIXED_FOOD, FIXED_METRO CITY ALLOWANCE, FIXED_STIPEND
- FIXEDGROSS

### Bank Details

- BANK NAME, BANK NAME AS PER EMPLOYEE, BANK NAME AS PER PAYMENT
- BANK BRANCH NAME AS PER EMPLOYEE, BANK BRANCH NAME AS PER PAYMENT
- IFS CODE AS PER EMPLOYEE, IFS CODE AS PER PAYMENT
- BANK ACCOUNT NO AS PER EMPLOYEE, BANK ACCOUNT NO AS PER PAYMENT
- PAYMENTMODENAME

### Attendance & Leave

- NORMALDAYS, WEEKLYOFF, OTHOURS, SPLOTHOURS
- PL_AVAILED, CL_AVAILED, SL_AVAILED
- SITEDIVISIONDAYS, PL, CL, SL

### Statutory IDs

- PF NO, ESIC NO, UAN NO, AADHAR CARD
- SALARY STATUS

### Calculated Totals (Computed from components)

- PF WAGES, ESI WAGES
- GROSS AMT, TOTALDEDUCTION, NETPAYABLE, CTC

### Provisions (Separate provisioning process)

- LEAVE_PROVISION, BONUS_PROVISION, GRATUITY_PROVISION

### Bank File Metadata

- DEBIT BANK A/C NO, DEBIT AMT

---

## API Endpoints

## PART 1: PAYROLL TEAM OPERATIONS

### API 1.1: Upload Salary Batch (Excel)

**Endpoint**: `POST /api/salary-payment/upload`

**Purpose**: Upload monthly salary Excel file with employee salary details

**Request Headers**:

```json
{
  "Authorization": "Bearer <token>",
  "Content-Type": "multipart/form-data"
}
```

**Request Body** (FormData):

```
file: <Excel file>
payrollPeriod: "Jan 2026"
month: "January"
year: 2026
```

**Excel Structure**:

- **Minimum Required Columns**: EMPCODE, FULLNAME, GROSS AMT, NETPAYABLE
- **38 Salary Head Columns**: All earnings, deductions, employer contributions
- **Employee Master Columns**: 20+ fields (EMPCODE, FULLNAME, DOJ, DOB, etc.)
- **Bank Details**: BANK NAME AS PER PAYMENT, BANK ACCOUNT NO, IFSC CODE
- **Statutory Details**: PF NO, ESIC NO, UAN NO, PF WAGES, ESI WAGES

**Processing Logic**:

1. Parse Excel file and validate structure
2. Validate required columns exist
3. For each employee row:
   - Validate EMPCODE, FULLNAME not empty
   - Validate numeric fields (amounts)
   - Calculate batch-level aggregations:
     - Total employee count
     - Sum of GROSS AMT → grossAmount
     - Sum of TOTALDEDUCTION → totalDeductions
     - Sum of NETPAYABLE → netPayable (totalAmount)
     - Sum of PF → pfEmployee
     - Sum of ESIC → esicEmployee
     - Sum of PT → pt
4. Generate unique batch ID: `BATCH_{timestamp}`
5. Create batch object with status "Pending Approval"
6. Assign to Account Executive (AE) based on round-robin or workload
7. Save batch to database

**Success Response** (201 Created):

```json
{
  "success": true,
  "message": "Salary batch uploaded successfully",
  "data": {
    "batchId": "BATCH_1738742400000",
    "payrollPeriod": "Jan 2026",
    "employeeCount": 450,
    "totalAmount": 42500000,
    "grossAmount": 45000000,
    "totalDeductions": 2500000,
    "netPayable": 42500000,
    "status": "Pending Approval",
    "assignedTo": "ae_user1",
    "submittedBy": "payroll_user1",
    "submittedAt": "2026-02-01T10:30:00Z"
  }
}
```

**Error Responses**:

```json
// 400 Bad Request - Invalid File
{
  "success": false,
  "message": "Invalid file format. Please upload Excel file (.xlsx, .xls)",
  "errorCode": "INVALID_FILE_FORMAT"
}

// 400 Bad Request - Missing Required Columns
{
  "success": false,
  "message": "Missing required columns: EMPCODE, FULLNAME, NETPAYABLE",
  "errorCode": "MISSING_REQUIRED_COLUMNS",
  "missingColumns": ["EMPCODE", "FULLNAME", "NETPAYABLE"]
}

// 400 Bad Request - Invalid Data
{
  "success": false,
  "message": "Invalid salary data found",
  "errorCode": "INVALID_SALARY_DATA",
  "errors": [
    { "row": 5, "field": "NETPAYABLE", "error": "Must be a positive number" },
    { "row": 12, "field": "EMPCODE", "error": "Cannot be empty" }
  ]
}

// 409 Conflict - Duplicate Batch
{
  "success": false,
  "message": "Salary batch for Jan 2026 already exists",
  "errorCode": "DUPLICATE_BATCH",
  "existingBatchId": "BATCH_1738640000000"
}
```

---

### API 1.2: Get My Submitted Batches

**Endpoint**: `GET /api/salary-payment/my-submissions`

**Purpose**: Get all salary batches submitted by current payroll user

**Request Headers**:

```json
{
  "Authorization": "Bearer <token>"
}
```

**Query Parameters**:

```
status: string (optional) - Filter by status: "Pending Approval", "Approved", "Rejected", "All"
period: string (optional) - Filter by payroll period (e.g., "Jan 2026")
search: string (optional) - Search by batch ID or period
page: number (optional, default: 1)
limit: number (optional, default: 10)
```

**Success Response** (200 OK):

```json
{
  "success": true,
  "data": {
    "batches": [
      {
        "id": "BATCH_1738742400000",
        "batchId": "BATCH_1738742400000",
        "payrollPeriod": "Jan 2026",
        "employeeCount": 450,
        "totalAmount": 42500000,
        "status": "Approved",
        "submittedBy": "payroll_user1",
        "submittedAt": "2026-02-01T10:30:00Z",
        "approvedBy": "AE User",
        "approvedAt": "2026-02-05T11:45:00Z",
        "voucherNo": "JVF00/42500/2602"
      },
      {
        "id": "BATCH_1738655800000",
        "batchId": "BATCH_1738655800000",
        "payrollPeriod": "Dec 2025",
        "employeeCount": 445,
        "totalAmount": 41000000,
        "status": "Rejected",
        "submittedBy": "payroll_user1",
        "submittedAt": "2025-12-28T09:00:00Z",
        "rejectedBy": "AE User",
        "rejectedAt": "2025-12-29T14:20:00Z",
        "rejectionReason": "PF calculations incorrect for 5 employees. Please recheck and reupload."
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalRecords": 25,
      "limit": 10
    }
  }
}
```

**Error Responses**:

```json
// 401 Unauthorized
{
  "success": false,
  "message": "Authentication required",
  "errorCode": "UNAUTHORIZED"
}
```

---

### API 1.3: Re-upload Corrected Batch

**Endpoint**: `PUT /api/salary-payment/batch/{batchId}/reupload`

**Purpose**: Re-upload corrected salary Excel file for a rejected batch

**Request Headers**:

```json
{
  "Authorization": "Bearer <token>",
  "Content-Type": "multipart/form-data"
}
```

**Request Body** (FormData):

```
file: <Corrected Excel file>
```

**Processing Logic**:

1. Validate batch exists and status is "Rejected"
2. Validate user is the original submitter
3. Parse new Excel file
4. Validate structure and data
5. Update batch with new employee details
6. Reset status to "Pending Approval"
7. Clear rejection reason
8. Add history entry: "Batch re-uploaded after correction"
9. Reassign to original AE or new AE

**Success Response** (200 OK):

```json
{
  "success": true,
  "message": "Batch re-uploaded successfully and reassigned for approval",
  "data": {
    "batchId": "BATCH_1738655800000",
    "payrollPeriod": "Dec 2025",
    "employeeCount": 445,
    "totalAmount": 41250000,
    "status": "Pending Approval",
    "assignedTo": "ae_user1",
    "reuploadedAt": "2026-01-05T10:00:00Z"
  }
}
```

**Error Responses**:

```json
// 403 Forbidden - Not original submitter
{
  "success": false,
  "message": "Only the original submitter can reupload this batch",
  "errorCode": "FORBIDDEN"
}

// 400 Bad Request - Batch not rejected
{
  "success": false,
  "message": "Only rejected batches can be re-uploaded. Current status: Approved",
  "errorCode": "INVALID_STATUS"
}
```

---

### API 1.4: Delete Pending Batch

**Endpoint**: `DELETE /api/salary-payment/batch/{batchId}`

**Purpose**: Delete a salary batch that is pending approval

**Request Headers**:

```json
{
  "Authorization": "Bearer <token>"
}
```

**Processing Logic**:

1. Validate batch exists
2. Validate user is the original submitter
3. Validate status is "Pending Approval" (cannot delete approved/rejected)
4. Soft delete or hard delete batch
5. Add audit entry

**Success Response** (200 OK):

```json
{
  "success": true,
  "message": "Batch deleted successfully",
  "data": {
    "batchId": "BATCH_1738742400000"
  }
}
```

**Error Responses**:

```json
// 400 Bad Request - Cannot delete
{
  "success": false,
  "message": "Cannot delete batch with status: Approved",
  "errorCode": "INVALID_STATUS_FOR_DELETE"
}
```

---

## PART 2: ACCOUNT EXECUTIVE (AE) OPERATIONS

### API 2.1: Get Pending Approval Batches

**Endpoint**: `GET /api/salary-payment/pending-approval`

**Purpose**: Get all salary batches assigned to current AE for approval

**Request Headers**:

```json
{
  "Authorization": "Bearer <token>"
}
```

**Query Parameters**:

```
status: string (optional, default: "Pending Approval")
period: string (optional) - Filter by payroll period
search: string (optional) - Search by batch ID, period, or submitter
page: number (optional, default: 1)
limit: number (optional, default: 10)
sortBy: string (optional) - "submittedAt", "totalAmount", "employeeCount"
sortOrder: string (optional) - "asc", "desc" (default: "desc")
```

**Success Response** (200 OK):

```json
{
  "success": true,
  "data": {
    "batches": [
      {
        "id": "BATCH_1738742400000",
        "batchId": "BATCH_1738742400000",
        "payrollPeriod": "Jan 2026",
        "month": "January",
        "year": 2026,
        "employeeCount": 450,
        "totalAmount": 42500000,
        "grossAmount": 45000000,
        "totalDeductions": 2500000,
        "netPayable": 42500000,
        "pfEmployee": 1350000,
        "esicEmployee": 337500,
        "pt": 90000,
        "status": "Pending Approval",
        "assignedTo": "ae_user1",
        "submittedBy": "payroll_user1",
        "submittedAt": "2026-02-01T10:30:00Z",
        "fileName": "Salary_Jan2026.xlsx",
        "bankFile": {
          "TYPE": "NEFT",
          "DEBIT BANK A/C NO": "123456789012",
          "DEBIT AMT": 42500000,
          "CUR": "INR"
        }
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 2,
      "totalRecords": 15,
      "limit": 10
    },
    "summary": {
      "totalPendingBatches": 15,
      "totalEmployees": 6750,
      "totalAmount": 637500000
    }
  }
}
```

---

### API 2.2: Get Batch Details with Employee Data

**Endpoint**: `GET /api/salary-payment/batch/{batchId}`

**Purpose**: Get complete batch details including all employee salary data

**Request Headers**:

```json
{
  "Authorization": "Bearer <token>"
}
```

**Query Parameters**:

```
includeEmployees: boolean (optional, default: true) - Include employee details array
```

**Success Response** (200 OK):

```json
{
  "success": true,
  "data": {
    "batchInfo": {
      "id": "BATCH_1738742400000",
      "batchId": "BATCH_1738742400000",
      "payrollPeriod": "Jan 2026",
      "month": "January",
      "year": 2026,
      "employeeCount": 450,
      "totalAmount": 42500000,
      "grossAmount": 45000000,
      "totalDeductions": 2500000,
      "netPayable": 42500000,
      "pfEmployee": 1350000,
      "esicEmployee": 337500,
      "pt": 90000,
      "status": "Pending Approval",
      "assignedTo": "ae_user1",
      "submittedBy": "payroll_user1",
      "submittedAt": "2026-02-01T10:30:00Z",
      "fileName": "Salary_Jan2026.xlsx"
    },
    "employeeDetails": [
      {
        "EMPCODE": "EMP1001",
        "FULLNAME": "Rajesh Kumar",
        "DESIGNATIONNAME": "Software Engineer",
        "BASIC": 25000,
        "DA": 6000,
        "HRA": 10000,
        "CONVEYANCE": 1600,
        "MEDICAL ALLOWANCE": 1250,
        "GROSS AMT": 48550,
        "PF": 3000,
        "ESIC": 168,
        "PT": 200,
        "TDS": 2000,
        "TOTALDEDUCTION": 5368,
        "NETPAYABLE": 43182,
        "PF COMPANY": 3723,
        "ESIC COMPANY": 890,
        "BANK ACCOUNT NO AS PER PAYMENT": "12345678901",
        "IFS CODE AS PER PAYMENT": "HDFC0001234"
      }
      // ... 449 more employees
    ],
    "summary": {
      "grossAmount": 45000000,
      "totalDeductions": 2500000,
      "netPayable": 42500000,
      "pfEmployee": 1350000,
      "pfEmployer": 1530450,
      "esicEmployee": 337500,
      "esicEmployer": 1462500,
      "pt": 90000,
      "tds": 900000,
      "employeeCount": 450
    },
    "history": []
  }
}
```

**Error Responses**:

```json
// 404 Not Found
{
  "success": false,
  "message": "Batch not found",
  "errorCode": "BATCH_NOT_FOUND"
}

// 403 Forbidden - Not assigned to user
{
  "success": false,
  "message": "This batch is not assigned to you",
  "errorCode": "NOT_ASSIGNED"
}
```

---

### API 2.3: Edit Net Payable Amount

**Endpoint**: `PUT /api/salary-payment/batch/{batchId}/amount`

**Purpose**: Edit the net payable amount for a batch and proportionally recalculate employee amounts

**Request Headers**:

```json
{
  "Authorization": "Bearer <token>",
  "Content-Type": "application/json"
}
```

**Request Body**:

```json
{
  "newNetPayable": 42000000,
  "remarks": "Adjusted for tax deduction variance"
}
```

**Processing Logic**:

1. Validate batch exists and status is "Pending Approval"
2. Calculate adjustment factor: `newAmount / oldAmount`
3. For each employee in batch:
   - Recalculate: `employee.NETPAYABLE = employee.NETPAYABLE * adjustmentFactor`
   - Round to 2 decimal places
4. Update batch totalAmount and netPayable
5. Add history entry with remarks

**Success Response** (200 OK):

```json
{
  "success": true,
  "message": "Net payable amount updated successfully. Employee amounts recalculated proportionally.",
  "data": {
    "batchId": "BATCH_1738742400000",
    "oldNetPayable": 42500000,
    "newNetPayable": 42000000,
    "adjustmentFactor": 0.9882,
    "employeesAffected": 450,
    "remarks": "Adjusted for tax deduction variance"
  }
}
```

**Error Responses**:

```json
// 400 Bad Request - Invalid amount
{
  "success": false,
  "message": "New net payable amount must be greater than zero",
  "errorCode": "INVALID_AMOUNT"
}

// 400 Bad Request - Already approved
{
  "success": false,
  "message": "Cannot edit approved batch",
  "errorCode": "BATCH_ALREADY_APPROVED"
}
```

---

### API 2.4: Approve Salary Batch (with Auto GL Posting)

**Endpoint**: `POST /api/salary-payment/batch/{batchId}/approve`

**Purpose**: Approve salary batch and automatically generate and post GL journal voucher

**Request Headers**:

```json
{
  "Authorization": "Bearer <token>",
  "Content-Type": "application/json"
}
```

**Request Body**:

```json
{
  "approverName": "AE User Full Name",
  "remarks": "Verified and approved - all calculations correct"
}
```

**Processing Logic**:

**Step 1: Generate GL Entries (Employee-level to GL-level Aggregation)**

For each employee in batch:

- Loop through each field in employee object
- Skip if field is in EXCLUDED_FIELDS list (80+ fields)
- Skip if field is not in GL_MAPPING configuration (38 salary heads)
- Skip if amount is zero
- Get GL mapping: { debit: {account, code}, credit: {account, code}, category }
- Create debit entry: { glCode, accountName, amount, type: "Debit", salaryHead, category }
- Create credit entry: { glCode, accountName, amount, type: "Credit", salaryHead, category }
- Aggregate by key = `${glCode}-${type}` (keeps debits and credits separate)
- Accumulate amounts in Map

Result: Instead of 450 employees × 38 heads = 17,100 raw entries
→ Aggregated to ~40-50 consolidated GL entries

**Example Aggregation**:

```
Employee 1: BASIC = 25000
Employee 2: BASIC = 28000
Employee 3: BASIC = 30000
...
Employee 450: BASIC = 27000

Aggregated GL Entry:
Dr X2001001001 (SALARIES & WAGES) - ₹11,250,000 (sum of all BASIC)
```

**Step 2: Calculate Summary**

```javascript
{
  totalDebit: sum of all debit amounts,
  totalCredit: sum of all credit amounts,
  difference: totalDebit - totalCredit,
  isBalanced: Math.abs(difference) < 0.01,
  employeeCount: 450
}
```

**Step 3: Validate GL Entries**

- Check debitEntries.length > 0
- Check creditEntries.length > 0
- Check isBalanced = true (totalDebit === totalCredit)
- Check no negative amounts
- If validation fails, return error and do NOT approve

**Step 4: Generate Voucher Number**

```javascript
voucherNo = `JVF00/${Date.now().slice(-5)}/${YYMM}`
// Example: JVF00/42500/2602
// Format: JVF00 (prefix) / 5-digit timestamp / YYMM (year-month)
```

**Step 5: Create Transaction Object**

```javascript
{
  id: `TXN_SALARY_{timestamp}`,
  voucherNo: "JVF00/42500/2602",
  voucherType: "Journal Voucher",
  transactionType: "Salary Payment",
  date: "2026-02-05",
  batchId: "BATCH_1738742400000",
  payrollPeriod: "Jan 2026",
  employeeCount: 450,
  entries: [
    // All debit entries first
    {
      lineNo: 1,
      glCode: "X2001001001",
      glName: "SALARIES & WAGES",
      accountName: "SALARIES & WAGES",
      debit: 45000000,
      credit: 0,
      narration: "Salary for Jan 2026 - Earnings",
      category: "Earnings"
    },
    {
      lineNo: 2,
      glCode: "X2001001002",
      glName: "EMPLOYER PF CONTRIBUTION",
      accountName: "EMPLOYER PF CONTRIBUTION",
      debit: 1530450,
      credit: 0,
      narration: "Employer PF contribution",
      category: "Employer Contribution"
    },
    // ... more debit entries
    // Then all credit entries
    {
      lineNo: 15,
      glCode: "L2002001",
      glName: "SALARY PAYABLE",
      accountName: "SALARY PAYABLE",
      debit: 0,
      credit: 45000000,
      narration: "Gross salary payable",
      category: "Liability"
    }
    // ... more credit entries
  ],
  totalDebit: 50613500,
  totalCredit: 50613500,
  narration: "Salary payment for Jan 2026 - 450 employees",
  status: "Posted",
  postedDate: "2026-02-05T11:45:00Z",
  approvedBy: "AE User Name",
  createdBy: "System",
  createdAt: "2026-02-05T11:45:00Z"
}
```

**Step 6: Post Transaction**

- Save transaction to database (transactions table)
- Update batch status to "Approved"
- Set approvedBy, approvedAt
- Add history entry with voucher number

**Success Response** (200 OK):

```json
{
  "success": true,
  "message": "Salary batch approved successfully. GL voucher posted.",
  "data": {
    "batchId": "BATCH_1738742400000",
    "status": "Approved",
    "voucherNo": "JVF00/42500/2602",
    "approvedBy": "AE User Name",
    "approvedAt": "2026-02-05T11:45:00Z",
    "glSummary": {
      "totalDebit": 50613500,
      "totalCredit": 50613500,
      "isBalanced": true,
      "entriesCount": 42,
      "employeeCount": 450
    },
    "transaction": {
      "id": "TXN_SALARY_1738742500000",
      "voucherNo": "JVF00/42500/2602",
      "voucherType": "Journal Voucher",
      "transactionType": "Salary Payment",
      "date": "2026-02-05",
      "status": "Posted"
    }
  }
}
```

**Sample GL Posting for 450 Employees (Aggregated)**:

```
DEBIT ENTRIES:
Dr X2001001001 - SALARIES & WAGES: ₹45,000,000
  (Sum of all earnings: BASIC, DA, HRA, Conveyance, Allowances, OT, etc.)
  (Also includes value of deductions: PF, ESIC, PT, TDS, Advance, etc.)

Dr X2001001002 - EMPLOYER PF CONTRIBUTION: ₹1,530,450
  (Employer's 13.61% PF contribution)

Dr X2001001003 - EMPLOYER ESIC CONTRIBUTION: ₹1,462,500
  (Employer's 3.25% ESIC contribution)

Dr X2001001004 - EMPLOYER LWF CONTRIBUTION: ₹9,000
  (Employer's LWF contribution)

Total Debits: ₹48,001,950

CREDIT ENTRIES:
Cr L2002001 - SALARY PAYABLE: ₹45,000,000
  (Gross salary payable - consolidated)

Cr L2002006 - Employee PF Payable: ₹1,350,000
  (Employee's PF deduction 12%)

Cr L2002007 - Employee ESIC Payable: ₹337,500
  (Employee's ESIC deduction 0.75%)

Cr L2002009 - Professional Tax Payable: ₹90,000
  (PT deduction)

Cr L2002011 - TDS Payable: ₹900,000
  (TDS deduction)

Cr L2002002 - Employer PF Payable: ₹1,530,450
  (Employer's PF contribution payable)

Cr L2002003 - Employer ESIC Payable: ₹1,462,500
  (Employer's ESIC contribution payable)

Cr L2002004 - LWF Payable - Employer: ₹9,000
  (Employer's LWF payable)

Cr A2001 - Employee Advances: ₹225,000
  (Advance recovery - reduces asset)

Total Credits: ₹50,904,450

NET SALARY PAYABLE TO EMPLOYEES: ₹42,500,000
(Gross ₹45,000,000 - Deductions ₹2,500,000)
```

**Error Responses**:

```json
// 400 Bad Request - GL Not Balanced
{
  "success": false,
  "message": "GL entries are not balanced. Cannot approve batch.",
  "errorCode": "GL_NOT_BALANCED",
  "details": {
    "totalDebit": 50613500,
    "totalCredit": 50613450,
    "difference": 50,
    "isBalanced": false
  }
}

// 400 Bad Request - Already Approved
{
  "success": false,
  "message": "Batch already approved",
  "errorCode": "BATCH_ALREADY_APPROVED",
  "existingVoucherNo": "JVF00/42500/2602"
}

// 400 Bad Request - Validation Error
{
  "success": false,
  "message": "Salary data validation failed",
  "errorCode": "VALIDATION_ERROR",
  "errors": [
    "Employee EMP1025: NETPAYABLE is negative (-500)",
    "Employee EMP1130: PF amount exceeds maximum limit"
  ]
}
```

---

### API 2.5: Bulk Approve Salary Batches

**Endpoint**: `POST /api/salary-payment/bulk-approve`

**Purpose**: Approve multiple salary batches at once with consolidated GL posting

**Request Headers**:

```json
{
  "Authorization": "Bearer <token>",
  "Content-Type": "application/json"
}
```

**Request Body**:

```json
{
  "batchIds": ["BATCH_1738742400000", "BATCH_1738828800000", "BATCH_1738915200000"],
  "approverName": "AE User Full Name",
  "remarks": "Bulk approval for Jan 2026 salary batches"
}
```

**Processing Logic**:

1. Validate all batches exist and status is "Pending Approval"
2. For each batch:
   - Generate GL entries (same as single approval)
   - Validate GL entries
3. Create separate transaction for each batch (separate voucher numbers)
4. Update all batch statuses to "Approved"
5. Add history entries

**Success Response** (200 OK):

```json
{
  "success": true,
  "message": "3 salary batches approved successfully. GL vouchers posted.",
  "data": {
    "approvedBatches": [
      {
        "batchId": "BATCH_1738742400000",
        "payrollPeriod": "Jan 2026",
        "employeeCount": 450,
        "totalAmount": 42500000,
        "voucherNo": "JVF00/42500/2602",
        "status": "Approved"
      },
      {
        "batchId": "BATCH_1738828800000",
        "payrollPeriod": "Jan 2026",
        "employeeCount": 380,
        "totalAmount": 35000000,
        "voucherNo": "JVF00/42501/2602",
        "status": "Approved"
      },
      {
        "batchId": "BATCH_1738915200000",
        "payrollPeriod": "Jan 2026",
        "employeeCount": 420,
        "totalAmount": 40000000,
        "voucherNo": "JVF00/42502/2602",
        "status": "Approved"
      }
    ],
    "summary": {
      "totalBatches": 3,
      "totalEmployees": 1250,
      "totalAmount": 117500000,
      "approvedBy": "AE User Name",
      "approvedAt": "2026-02-05T14:30:00Z"
    }
  }
}
```

**Error Responses**:

```json
// 400 Bad Request - Some batches failed
{
  "success": false,
  "message": "Bulk approval failed for some batches",
  "errorCode": "PARTIAL_FAILURE",
  "data": {
    "successful": [
      {
        "batchId": "BATCH_1738742400000",
        "voucherNo": "JVF00/42500/2602",
        "status": "Approved"
      }
    ],
    "failed": [
      {
        "batchId": "BATCH_1738828800000",
        "error": "GL entries not balanced. Difference: ₹150",
        "errorCode": "GL_NOT_BALANCED"
      },
      {
        "batchId": "BATCH_1738915200000",
        "error": "Batch already approved",
        "errorCode": "BATCH_ALREADY_APPROVED"
      }
    ]
  }
}
```

---

### API 2.6: Reject Salary Batch

**Endpoint**: `POST /api/salary-payment/batch/{batchId}/reject`

**Purpose**: Reject salary batch with mandatory rejection remarks

**Request Headers**:

```json
{
  "Authorization": "Bearer <token>",
  "Content-Type": "application/json"
}
```

**Request Body**:

```json
{
  "rejectionReason": "PF calculations incorrect for employees EMP1025, EMP1130, EMP1245. Please recheck PF WAGES and PF amount. Also verify ESIC calculations for Mumbai employees.",
  "rejectedBy": "AE User Name"
}
```

**Validation**:

- rejectionReason must be at least 10 characters
- rejectionReason cannot be empty

**Processing Logic**:

1. Validate batch exists and status is "Pending Approval"
2. Update batch:
   - status = "Rejected"
   - rejectionReason = provided reason
   - rejectedBy = AE username
   - rejectedAt = current timestamp
3. Add history entry: "Batch rejected by {AE Name}"
4. Send notification to original submitter (Payroll Team user)

**Success Response** (200 OK):

```json
{
  "success": true,
  "message": "Salary batch rejected successfully. Payroll team notified.",
  "data": {
    "batchId": "BATCH_1738742400000",
    "status": "Rejected",
    "rejectionReason": "PF calculations incorrect for employees EMP1025, EMP1130, EMP1245...",
    "rejectedBy": "AE User Name",
    "rejectedAt": "2026-02-05T11:20:00Z"
  }
}
```

**Error Responses**:

```json
// 400 Bad Request - Empty rejection reason
{
  "success": false,
  "message": "Rejection reason is mandatory and must be at least 10 characters",
  "errorCode": "INVALID_REJECTION_REASON"
}

// 400 Bad Request - Already approved
{
  "success": false,
  "message": "Cannot reject approved batch",
  "errorCode": "BATCH_ALREADY_APPROVED"
}
```

---

## PART 3: VOUCHER & TRANSACTION OPERATIONS

### API 3.1: Get Journal Voucher for Batch

**Endpoint**: `GET /api/salary-payment/batch/{batchId}/voucher`

**Purpose**: Get complete journal voucher details for an approved salary batch

**Request Headers**:

```json
{
  "Authorization": "Bearer <token>"
}
```

**Success Response** (200 OK):

```json
{
  "success": true,
  "data": {
    "header": {
      "company": "I SMART FACTECH PRIVATE LIMITED",
      "address": "317, 3RD FLOOR, J/2, NILGIRI MANDLA TRUCK TERMINAL, MUMBAI - 400037",
      "gstNo": "27AACCD4328112E",
      "state": "Maharashtra (27)",
      "voucherNo": "JVF00/42500/2602",
      "date": "2026-02-05",
      "reference": "Salary Payment",
      "preparedBy": "System"
    },
    "entries": [
      {
        "lineNo": 1,
        "accountName": "SALARIES & WAGES",
        "glCode": "X2001001001",
        "debit": 45000000,
        "credit": 0,
        "narration": "Salary for Jan 2026 - 450 employees"
      },
      {
        "lineNo": 2,
        "accountName": "EMPLOYER PF CONTRIBUTION",
        "glCode": "X2001001002",
        "debit": 1530450,
        "credit": 0,
        "narration": "Employer PF contribution"
      },
      {
        "lineNo": 3,
        "accountName": "EMPLOYER ESIC CONTRIBUTION",
        "glCode": "X2001001003",
        "debit": 1462500,
        "credit": 0,
        "narration": "Employer ESIC contribution"
      },
      {
        "lineNo": 4,
        "accountName": "EMPLOYER LWF CONTRIBUTION",
        "glCode": "X2001001004",
        "debit": 9000,
        "credit": 0,
        "narration": "Employer LWF contribution"
      },
      {
        "lineNo": 5,
        "accountName": "SALARY PAYABLE",
        "glCode": "L2002001",
        "debit": 0,
        "credit": 45000000,
        "narration": "Gross salary payable"
      },
      {
        "lineNo": 6,
        "accountName": "Employee PF Payable",
        "glCode": "L2002006",
        "debit": 0,
        "credit": 1350000,
        "narration": "Employee PF deduction"
      },
      {
        "lineNo": 7,
        "accountName": "Employee ESIC Payable",
        "glCode": "L2002007",
        "debit": 0,
        "credit": 337500,
        "narration": "Employee ESIC deduction"
      },
      {
        "lineNo": 8,
        "accountName": "Professional Tax Payable",
        "glCode": "L2002009",
        "debit": 0,
        "credit": 90000,
        "narration": "PT deduction"
      },
      {
        "lineNo": 9,
        "accountName": "TDS Payable",
        "glCode": "L2002011",
        "debit": 0,
        "credit": 900000,
        "narration": "TDS deduction"
      },
      {
        "lineNo": 10,
        "accountName": "Employer PF Payable",
        "glCode": "L2002002",
        "debit": 0,
        "credit": 1530450,
        "narration": "Employer PF payable"
      },
      {
        "lineNo": 11,
        "accountName": "Employer ESIC Payable",
        "glCode": "L2002003",
        "debit": 0,
        "credit": 1462500,
        "narration": "Employer ESIC payable"
      },
      {
        "lineNo": 12,
        "accountName": "LWF PAYABLE - EMPLOYER SHARE",
        "glCode": "L2002004",
        "debit": 0,
        "credit": 9000,
        "narration": "Employer LWF payable"
      },
      {
        "lineNo": 13,
        "accountName": "Employee Advances",
        "glCode": "A2001",
        "debit": 0,
        "credit": 225000,
        "narration": "Advance recovery (reduces asset)"
      }
    ],
    "totals": {
      "debit": 48001950,
      "credit": 48001950
    },
    "narration": "Salary payment for Jan 2026 - 450 employees",
    "approvals": {
      "preparedBy": "System",
      "checkedBy": "Pending",
      "authorizedBy": "AE User Name",
      "date": "2026-02-05"
    },
    "batchInfo": {
      "batchId": "BATCH_1738742400000",
      "payrollPeriod": "Jan 2026",
      "employeeCount": 450,
      "netSalaryPayable": 42500000
    }
  }
}
```

**Error Responses**:

```json
// 404 Not Found
{
  "success": false,
  "message": "Journal voucher not found for this batch",
  "errorCode": "VOUCHER_NOT_FOUND"
}

// 400 Bad Request - Batch not approved
{
  "success": false,
  "message": "Batch not yet approved. Voucher not generated.",
  "errorCode": "BATCH_NOT_APPROVED",
  "batchStatus": "Pending Approval"
}
```

---

### API 3.2: Get All Salary Transactions

**Endpoint**: `GET /api/salary-payment/transactions`

**Purpose**: Get all posted salary payment transactions with filters

**Request Headers**:

```json
{
  "Authorization": "Bearer <token>"
}
```

**Query Parameters**:

```
startDate: string (optional) - Filter from date (YYYY-MM-DD)
endDate: string (optional) - Filter to date (YYYY-MM-DD)
period: string (optional) - Filter by payroll period
voucherNo: string (optional) - Search by voucher number
status: string (optional) - Filter by transaction status
page: number (optional, default: 1)
limit: number (optional, default: 20)
```

**Success Response** (200 OK):

```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "TXN_SALARY_1738742500000",
        "voucherNo": "JVF00/42500/2602",
        "voucherType": "Journal Voucher",
        "transactionType": "Salary Payment",
        "date": "2026-02-05",
        "batchId": "BATCH_1738742400000",
        "payrollPeriod": "Jan 2026",
        "employeeCount": 450,
        "totalDebit": 48001950,
        "totalCredit": 48001950,
        "narration": "Salary payment for Jan 2026 - 450 employees",
        "status": "Posted",
        "postedDate": "2026-02-05T11:45:00Z",
        "approvedBy": "AE User Name",
        "createdAt": "2026-02-05T11:45:00Z"
      },
      {
        "id": "TXN_SALARY_1738656000000",
        "voucherNo": "JVF00/40000/2601",
        "voucherType": "Journal Voucher",
        "transactionType": "Salary Payment",
        "date": "2026-01-28",
        "batchId": "BATCH_1738569600000",
        "payrollPeriod": "Dec 2025",
        "employeeCount": 445,
        "totalDebit": 47500000,
        "totalCredit": 47500000,
        "narration": "Salary payment for Dec 2025 - 445 employees",
        "status": "Posted",
        "postedDate": "2026-01-28T10:30:00Z",
        "approvedBy": "AE User Name",
        "createdAt": "2026-01-28T10:30:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalRecords": 96,
      "limit": 20
    },
    "summary": {
      "totalTransactions": 96,
      "totalAmount": 4560000000,
      "totalEmployees": 43200
    }
  }
}
```

---

## PART 4: UTILITY OPERATIONS

### API 4.1: Download Batch Excel

**Endpoint**: `GET /api/salary-payment/batch/{batchId}/download`

**Purpose**: Download salary batch as Excel file for offline editing

**Request Headers**:

```json
{
  "Authorization": "Bearer <token>"
}
```

**Response**: Excel file (.xlsx)

**Response Headers**:

```
Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
Content-Disposition: attachment; filename="Salary_Jan2026_BATCH_1738742400000.xlsx"
```

**Excel Structure**:

- All 38 salary head columns
- All employee master data columns
- Bank details columns
- Statutory details columns
- Calculated totals columns

**Error Responses**:

```json
// 404 Not Found
{
  "success": false,
  "message": "Batch not found",
  "errorCode": "BATCH_NOT_FOUND"
}
```

---

## Business Rules & Validations

### 1. GL Aggregation Logic

**Employee-Level to GL-Level Aggregation**:

```
Input: 450 employees × 38 salary heads = 17,100 individual amounts
↓
Process: Aggregate by GL Code and Type (Debit/Credit)
↓
Output: ~40-50 consolidated GL entries

Example:
Employee 1: BASIC = ₹25,000 → Dr X2001001001
Employee 2: BASIC = ₹28,000 → Dr X2001001001
Employee 3: BASIC = ₹30,000 → Dr X2001001001
...
Employee 450: BASIC = ₹27,000 → Dr X2001001001
───────────────────────────────────────────
Aggregated: Dr X2001001001 = ₹11,250,000 (sum of all)
```

**Aggregation Algorithm**:

```javascript
// Use Map with key = `${glCode}-${type}`
const processedAccounts = new Map()

for (const employee of employeeDetails) {
  for (const salaryHead of Object.keys(employee)) {
    if (isExcluded(salaryHead)) continue

    const amount = parseFloat(employee[salaryHead])
    if (amount === 0) continue

    const mapping = GL_MAPPING[salaryHead]

    // Debit entry
    const debitKey = `${mapping.debit.code}-Debit`
    if (processedAccounts.has(debitKey)) {
      processedAccounts.get(debitKey).amount += amount
    } else {
      processedAccounts.set(debitKey, {
        glCode: mapping.debit.code,
        accountName: mapping.debit.account,
        amount: amount,
        type: 'Debit',
      })
    }

    // Credit entry
    const creditKey = `${mapping.credit.code}-Credit`
    if (processedAccounts.has(creditKey)) {
      processedAccounts.get(creditKey).amount += amount
    } else {
      processedAccounts.set(creditKey, {
        glCode: mapping.credit.code,
        accountName: mapping.credit.account,
        amount: amount,
        type: 'Credit',
      })
    }
  }
}

// Convert Map to arrays
const debitEntries = [...processedAccounts.values()].filter((e) => e.type === 'Debit')
const creditEntries = [...processedAccounts.values()].filter((e) => e.type === 'Credit')
```

### 2. Voucher Number Format

**Format**: `JVF00/{5digitTimestamp}/{YYMM}`

**Generation Logic**:

```javascript
const timestamp = Date.now().toString().slice(-5) // Last 5 digits
const date = new Date()
const yy = date.getFullYear().toString().slice(-2) // Last 2 digits of year
const mm = (date.getMonth() + 1).toString().padStart(2, '0') // Month (01-12)

const voucherNo = `JVF00/${timestamp}/${yy}${mm}`
// Example: JVF00/42500/2602 (Generated on Feb 2026)
```

**Prefix Explanation**:

- **JVF00**: Journal Voucher Format 00 (Salary specific)
- **42500**: Last 5 digits of timestamp (uniqueness)
- **2602**: Year 26 (2026), Month 02 (February)

### 3. GL Balance Validation

**Rule**: Total Debits MUST equal Total Credits

**Validation Logic**:

```javascript
const totalDebit = debitEntries.reduce((sum, entry) => sum + entry.amount, 0)
const totalCredit = creditEntries.reduce((sum, entry) => sum + entry.amount, 0)
const difference = Math.abs(totalDebit - totalCredit)
const isBalanced = difference < 0.01 // Allow 1 paisa tolerance for rounding

if (!isBalanced) {
  throw new Error(`GL not balanced. Difference: ₹${difference.toFixed(2)}`)
}
```

### 4. Amount Editing and Recalculation

**Rule**: When net payable is edited, proportionally adjust all employee amounts

**Recalculation Logic**:

```javascript
const adjustmentFactor = newNetPayable / oldNetPayable

for (const employee of employeeDetails) {
  employee.NETPAYABLE = Math.round(employee.NETPAYABLE * adjustmentFactor * 100) / 100
  // Round to 2 decimal places
}

// Recalculate batch totals
batch.netPayable = newNetPayable
batch.totalAmount = newNetPayable
```

### 5. Batch Status Workflow

**Status Transitions**:

```
Pending Approval
    ↓ (approve)
Approved ──→ Cannot edit or delete
    ↓ (reject)
Rejected ──→ Can reupload
    ↓ (reupload)
Pending Approval (new review cycle)
```

**Rules**:

- **Pending Approval**: Can edit amount, approve, reject, delete
- **Approved**: Cannot edit, cannot delete, can view voucher
- **Rejected**: Cannot edit, cannot approve, can reupload, can view rejection reason

### 6. Statutory Calculations

**PF Calculation**:

```
PF Wages = min(BASIC + DA, 15000)  // Capped at ₹15,000
Employee PF = PF Wages × 12% = PF Wages × 0.12
Employer PF = PF Wages × 13.61% = PF Wages × 0.1361
```

**ESIC Calculation**:

```
ESI Wages = min(BASIC + DA + HRA + other allowances, 21000)  // Capped at ₹21,000
Employee ESIC = ESI Wages × 0.75% = ESI Wages × 0.0075
Employer ESIC = ESI Wages × 3.25% = ESI Wages × 0.0325
```

**Professional Tax** (State-specific):

- Maharashtra: ₹200/month
- Karnataka: ₹200/month
- Gujarat: ₹0 (no PT)
- Delhi: ₹0 (no PT)

**LWF** (State-specific):

- Maharashtra:
  - Employee: ₹6/month
  - Employer: ₹20/month
- Karnataka: No LWF
- Gujarat:
  - Employee: ₹6/month
  - Employer: ₹20/month

### 7. Excluded Fields Logic

**Why Exclude 80+ Fields?**

1. **Employee Master Data**: Already stored in employee master, no GL impact
2. **Fixed Salary Structure**: Used for comparison only, not for actual payment
3. **Bank Details**: Used for payment processing, not GL posting
4. **Attendance Data**: Used for calculation, not GL posting
5. **Statutory IDs**: Reference only
6. **Calculated Totals**: Derived fields (GROSS AMT, TOTALDEDUCTION, NETPAYABLE, CTC)
7. **Provisions**: Separate provisioning process with different GL mapping

**Only Process 38 Salary Heads** that have direct GL mapping defined.

### 8. Dual Transaction Entry (Earnings vs Deductions)

**Earnings** (BASIC, DA, HRA, etc.):

```
Dr X2001001001 (Salaries & Wages) - Expense increases
Cr L2002001 (Salary Payable) - Liability increases
```

**Employee Deductions** (PF, ESIC, PT, TDS):

```
Dr X2001001001 (Salaries & Wages) - Expense increases (still part of salary cost)
Cr L2002006/07/09/11 (Specific Payables) - Liability increases
```

**Key Insight**:

- Gross salary is debited to Salaries & Wages
- Deductions are ALSO debited to Salaries & Wages (they are salary cost to company)
- Credits go to different liability accounts based on deduction type
- This creates proper matching: Total expense = Gross + Employer contributions

### 9. Employer Contributions

**Separate Expense and Payable Accounts**:

```
PF Employer:
Dr X2001001002 (Employer PF Contribution Expense)
Cr L2002002 (Employer PF Payable)

ESIC Employer:
Dr X2001001003 (Employer ESIC Contribution Expense)
Cr L2002003 (Employer ESIC Payable)

LWF Employer:
Dr X2001001004 (Employer LWF Contribution Expense)
Cr L2002004 (LWF Payable - Employer Share)
```

**Why Separate?**

- Employer contributions are additional expenses beyond employee salary
- Need separate P&L tracking for compliance and costing
- Separate payable accounts for payment tracking

---

## Sample Complete GL Voucher

### Scenario: Jan 2026 Salary - 450 Employees

**Batch Summary**:

- Employee Count: 450
- Gross Salary: ₹45,000,000
- Total Deductions: ₹2,500,000
- Net Payable: ₹42,500,000
- Employee PF: ₹1,350,000
- Employee ESIC: ₹337,500
- PT: ₹90,000
- TDS: ₹900,000
- Advance Recovery: ₹225,000
- Employer PF: ₹1,530,450
- Employer ESIC: ₹1,462,500
- Employer LWF: ₹9,000

**Generated Voucher**: JVF00/42500/2602

### JOURNAL VOUCHER - JVF00/42500/2602

**Date**: 05-Feb-2026  
**Narration**: Salary payment for Jan 2026 - 450 employees

| Line | Account Name                 | GL Code     | Debit (₹)      | Credit (₹)     |
| ---- | ---------------------------- | ----------- | -------------- | -------------- |
| 1    | SALARIES & WAGES             | X2001001001 | 45,000,000     | -              |
| 2    | EMPLOYER PF CONTRIBUTION     | X2001001002 | 1,530,450      | -              |
| 3    | EMPLOYER ESIC CONTRIBUTION   | X2001001003 | 1,462,500      | -              |
| 4    | EMPLOYER LWF CONTRIBUTION    | X2001001004 | 9,000          | -              |
| 5    | SALARY PAYABLE               | L2002001    | -              | 45,000,000     |
| 6    | Employee PF Payable          | L2002006    | -              | 1,350,000      |
| 7    | Employee ESIC Payable        | L2002007    | -              | 337,500        |
| 8    | Professional Tax Payable     | L2002009    | -              | 90,000         |
| 9    | TDS Payable                  | L2002011    | -              | 900,000        |
| 10   | Employer PF Payable          | L2002002    | -              | 1,530,450      |
| 11   | Employer ESIC Payable        | L2002003    | -              | 1,462,500      |
| 12   | LWF PAYABLE - EMPLOYER SHARE | L2002004    | -              | 9,000          |
| 13   | Employee Advances (Asset)    | A2001       | -              | 225,000        |
|      | **TOTALS**                   |             | **48,001,950** | **48,001,950** |

**Balance Check**: ✅ Balanced (Debits = Credits)

---

## Error Code Reference

| Error Code                | HTTP Status | Message                    | Resolution                                |
| ------------------------- | ----------- | -------------------------- | ----------------------------------------- |
| INVALID_FILE_FORMAT       | 400         | File format not supported  | Upload .xlsx or .xls file                 |
| MISSING_REQUIRED_COLUMNS  | 400         | Required columns missing   | Add EMPCODE, FULLNAME, NETPAYABLE columns |
| INVALID_SALARY_DATA       | 400         | Invalid data in rows       | Fix data validation errors                |
| DUPLICATE_BATCH           | 409         | Batch already exists       | Use different period or delete existing   |
| BATCH_NOT_FOUND           | 404         | Batch not found            | Verify batch ID                           |
| NOT_ASSIGNED              | 403         | Not assigned to you        | Contact admin for reassignment            |
| INVALID_AMOUNT            | 400         | Invalid amount value       | Enter positive number                     |
| BATCH_ALREADY_APPROVED    | 400         | Already approved           | Cannot edit approved batch                |
| GL_NOT_BALANCED           | 400         | Debit ≠ Credit             | Fix salary calculations                   |
| VALIDATION_ERROR          | 400         | Data validation failed     | Fix validation errors in data             |
| INVALID_REJECTION_REASON  | 400         | Rejection reason too short | Enter at least 10 characters              |
| VOUCHER_NOT_FOUND         | 404         | Voucher not generated      | Batch not yet approved                    |
| BATCH_NOT_APPROVED        | 400         | Batch pending approval     | Approve batch first                       |
| FORBIDDEN                 | 403         | Access denied              | Insufficient permissions                  |
| UNAUTHORIZED              | 401         | Authentication required    | Login required                            |
| INVALID_STATUS            | 400         | Invalid batch status       | Check batch status                        |
| INVALID_STATUS_FOR_DELETE | 400         | Cannot delete              | Only pending batches can be deleted       |
| PARTIAL_FAILURE           | 400         | Some operations failed     | Check individual batch errors             |

---

## Testing Scenarios

### Scenario 1: Happy Path - Single Batch Approval

1. Payroll Team uploads Excel with 450 employees
2. Batch created: BATCH_1738742400000, Status: Pending Approval
3. AE reviews batch, verifies calculations
4. AE approves batch
5. System generates GL entries (aggregates 450 × 38 = 17,100 → 42 consolidated entries)
6. System validates: Total Debit = Total Credit ✅
7. System posts transaction with voucher: JVF00/42500/2602
8. Batch status updated: Approved
9. JV modal displays complete voucher

**Expected Result**: ✅ Batch approved, GL posted, voucher generated

### Scenario 2: GL Imbalance Error

1. Batch has data error: Employee EMP1025 has negative NETPAYABLE
2. AE tries to approve
3. System generates GL entries
4. Validation fails: Total Debit ≠ Total Credit
5. System returns error: GL_NOT_BALANCED

**Expected Result**: ❌ Approval blocked, error message shown

### Scenario 3: Rejection and Reupload

1. AE finds PF calculation error in batch
2. AE rejects with reason: "PF calculations incorrect for 5 employees"
3. Payroll Team receives notification
4. Payroll Team fixes Excel and re-uploads
5. Batch status changes: Rejected → Pending Approval
6. AE reviews again and approves

**Expected Result**: ✅ Batch corrected and approved

### Scenario 4: Bulk Approval

1. AE selects 3 batches: BATCH_001, BATCH_002, BATCH_003
2. AE clicks "Bulk Approve"
3. System generates GL entries for each batch separately
4. System validates all 3 batches
5. BATCH_001 ✅, BATCH_002 ✅, BATCH_003 ❌ (GL imbalance)
6. System returns partial success response

**Expected Result**: ⚠️ 2 approved, 1 failed with error details

### Scenario 5: Amount Editing

1. AE reviews batch with Net Payable: ₹42,500,000
2. AE edits to ₹42,000,000 (adjustment for tax correction)
3. System calculates adjustment factor: 42000000 / 42500000 = 0.9882
4. System recalculates all 450 employee NETPAYABLE amounts proportionally
5. Batch totalAmount updated: ₹42,000,000
6. AE approves batch
7. GL entries generated with new amounts

**Expected Result**: ✅ Amount adjusted, all employees recalculated, GL posted

---

## Performance Considerations

### 1. Large Batch Processing

**Challenge**: 450 employees × 38 salary heads = 17,100 individual amounts

**Optimization**:

- Use aggregation Map to reduce to ~40-50 GL entries
- Process employee-level aggregation in memory
- Batch insert GL entries in single transaction
- Use database indexing on batchId, status, assignedTo

### 2. Excel Parsing

**Challenge**: Parse large Excel files (10MB+, 1000+ employees)

**Optimization**:

- Stream parse Excel in chunks
- Validate in batches (100 rows at a time)
- Use background job for large files (queue)
- Show progress indicator to user

### 3. Bulk Approval

**Challenge**: Approve 10 batches × 500 employees = 5000 employees simultaneously

**Optimization**:

- Process batches sequentially (fail-fast on error)
- Use database transactions for atomicity
- Generate vouchers in parallel if independent
- Return partial success with detailed error for failed batches

### 4. GL Entry Storage

**Challenge**: Store 50 entries × 100 batches = 5000 entries per month

**Optimization**:

- Use indexed table: transactions, entries
- Partition by month/year
- Archive old transactions (> 3 years)
- Compress historical data

---

## Integration Points

### 1. Employee Master

**Purpose**: Validate EMPCODE, fetch employee details

**Endpoint**: `GET /api/employee/validate/{empCode}`

**Usage**: During Excel upload, validate each EMPCODE exists in master

### 2. Bank Payment Gateway

**Purpose**: Generate bank payment file for net salary transfer

**Endpoint**: `POST /api/payment/generate-neft`

**Usage**: After batch approval, generate NEFT file for bank upload

**Request**:

```json
{
  "batchId": "BATCH_1738742400000",
  "paymentMode": "NEFT",
  "debitAccount": "123456789012",
  "employees": [
    {
      "empCode": "EMP1001",
      "name": "Rajesh Kumar",
      "accountNo": "12345678901",
      "ifsc": "HDFC0001234",
      "amount": 43182,
      "narration": "Jan 2026 Salary"
    }
    // ... 449 more
  ]
}
```

### 3. Statutory Compliance System

**Purpose**: Generate statutory reports (PF, ESIC, PT, TDS)

**Endpoints**:

- `POST /api/compliance/pf-report` - PF ECR
- `POST /api/compliance/esic-report` - ESIC Challan
- `POST /api/compliance/tds-report` - Form 24Q

**Usage**: After batch approval, submit data to compliance system for return filing

### 4. General Ledger System

**Purpose**: Post salary transactions to main GL

**Endpoint**: `POST /api/gl/post-transaction`

**Usage**: Post generated transaction to centralized GL system

---

## Audit Trail

### Required Audit Logs

1. **Batch Upload**: User, timestamp, file name, employee count, total amount
2. **Batch Approval**: AE name, timestamp, batch ID, voucher number
3. **Batch Rejection**: AE name, timestamp, batch ID, rejection reason
4. **Amount Editing**: User, timestamp, old amount, new amount, adjustment factor
5. **Reupload**: User, timestamp, batch ID, new employee count, new total amount
6. **GL Posting**: Timestamp, transaction ID, voucher number, total debit, total credit
7. **Bulk Operations**: User, timestamp, batch IDs, success count, failure count

### History Object Structure

```json
{
  "action": "Approved",
  "performedBy": "AE User Name",
  "timestamp": "2026-02-05T11:45:00Z",
  "details": {
    "voucherNo": "JVF00/42500/2602",
    "totalAmount": 42500000,
    "remarks": "Verified and approved"
  }
}
```

---

## Database Schema Suggestions

### Table: salary_batches

```sql
CREATE TABLE salary_batches (
  id VARCHAR(50) PRIMARY KEY,
  batch_id VARCHAR(50) UNIQUE NOT NULL,
  payroll_period VARCHAR(20) NOT NULL,
  month VARCHAR(20),
  year INT,
  employee_count INT NOT NULL,
  total_amount DECIMAL(15,2) NOT NULL,
  gross_amount DECIMAL(15,2),
  total_deductions DECIMAL(15,2),
  net_payable DECIMAL(15,2),
  pf_employee DECIMAL(12,2),
  esic_employee DECIMAL(12,2),
  pt DECIMAL(12,2),
  status VARCHAR(20) NOT NULL DEFAULT 'Pending Approval',
  assigned_to VARCHAR(50),
  submitted_by VARCHAR(50) NOT NULL,
  submitted_at TIMESTAMP NOT NULL,
  approved_by VARCHAR(50),
  approved_at TIMESTAMP,
  rejected_by VARCHAR(50),
  rejected_at TIMESTAMP,
  rejection_reason TEXT,
  file_name VARCHAR(255),
  voucher_no VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_assigned_to (assigned_to),
  INDEX idx_submitted_by (submitted_by),
  INDEX idx_period (payroll_period),
  INDEX idx_voucher (voucher_no)
);
```

### Table: salary_employee_details

```sql
CREATE TABLE salary_employee_details (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  batch_id VARCHAR(50) NOT NULL,
  emp_code VARCHAR(20) NOT NULL,
  full_name VARCHAR(100),
  designation VARCHAR(50),
  basic DECIMAL(10,2),
  da DECIMAL(10,2),
  hra DECIMAL(10,2),
  conveyance DECIMAL(10,2),
  medical_allowance DECIMAL(10,2),
  other_allowances JSON,  -- Store other 18 allowances
  gross_amount DECIMAL(10,2),
  pf DECIMAL(10,2),
  esic DECIMAL(10,2),
  pt DECIMAL(10,2),
  tds DECIMAL(10,2),
  advance DECIMAL(10,2),
  other_deductions JSON,  -- Store other 8 deductions
  total_deduction DECIMAL(10,2),
  net_payable DECIMAL(10,2),
  pf_company DECIMAL(10,2),
  esic_company DECIMAL(10,2),
  lwf_company DECIMAL(10,2),
  bank_account_no VARCHAR(30),
  ifsc_code VARCHAR(15),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (batch_id) REFERENCES salary_batches(batch_id) ON DELETE CASCADE,
  INDEX idx_batch_emp (batch_id, emp_code)
);
```

### Table: salary_transactions

```sql
CREATE TABLE salary_transactions (
  id VARCHAR(50) PRIMARY KEY,
  voucher_no VARCHAR(20) UNIQUE NOT NULL,
  voucher_type VARCHAR(20) DEFAULT 'Journal Voucher',
  transaction_type VARCHAR(30) DEFAULT 'Salary Payment',
  date DATE NOT NULL,
  batch_id VARCHAR(50) NOT NULL,
  payroll_period VARCHAR(20),
  employee_count INT,
  total_debit DECIMAL(15,2) NOT NULL,
  total_credit DECIMAL(15,2) NOT NULL,
  narration TEXT,
  status VARCHAR(20) DEFAULT 'Posted',
  posted_date TIMESTAMP,
  approved_by VARCHAR(50),
  created_by VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (batch_id) REFERENCES salary_batches(batch_id),
  INDEX idx_voucher (voucher_no),
  INDEX idx_batch (batch_id),
  INDEX idx_date (date),
  INDEX idx_period (payroll_period)
);
```

### Table: salary_transaction_entries

```sql
CREATE TABLE salary_transaction_entries (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  transaction_id VARCHAR(50) NOT NULL,
  line_no INT NOT NULL,
  gl_code VARCHAR(20) NOT NULL,
  gl_name VARCHAR(100),
  account_name VARCHAR(100),
  debit DECIMAL(12,2) DEFAULT 0,
  credit DECIMAL(12,2) DEFAULT 0,
  narration TEXT,
  category VARCHAR(30),  -- Earnings, Deductions, Employer Contribution
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (transaction_id) REFERENCES salary_transactions(id) ON DELETE CASCADE,
  INDEX idx_transaction (transaction_id),
  INDEX idx_gl_code (gl_code),
  INDEX idx_category (category)
);
```

### Table: salary_batch_history

```sql
CREATE TABLE salary_batch_history (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  batch_id VARCHAR(50) NOT NULL,
  action VARCHAR(50) NOT NULL,  -- Uploaded, Approved, Rejected, Reupload, etc.
  performed_by VARCHAR(50) NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  details JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (batch_id) REFERENCES salary_batches(batch_id) ON DELETE CASCADE,
  INDEX idx_batch (batch_id),
  INDEX idx_action (action)
);
```

---

## Summary

This API specification provides complete backend requirements for the **Process for Payment Entry for Salaries**. Key highlights:

1. **13 RESTful APIs** covering complete workflow:
   - 4 Payroll Team operations (upload, view, reupload, delete)
   - 6 AE operations (review, approve, bulk approve, reject, edit)
   - 2 Voucher operations (view JV, list transactions)
   - 1 Utility operation (download Excel)

2. **Automatic GL Posting** with:
   - 38 salary heads mapped to GL codes
   - Employee-level aggregation to GL-level
   - Dual-entry validation (Debit = Credit)
   - Three accounting categories (Earnings, Deductions, Contributions)

3. **Robust Validation**:
   - Excel structure validation
   - Data type validation
   - GL balance validation
   - Status workflow validation

4. **Comprehensive Audit Trail**:
   - All actions logged
   - History maintained
   - Voucher traceability

5. **Performance Optimized**:
   - Aggregation reduces entries by 99.7% (17,100 → 42)
   - Bulk processing support
   - Indexed database design

This document provides backend developers with complete information to implement the salary payment process APIs with automatic GL posting functionality.

---

**Document Version**: 1.0  
**Last Updated**: February 5, 2026  
**Author**: System Analyst  
**Review Status**: Ready for Backend Implementation

# API Specification Document - Process For Bank Reconciliation

**Document Version:** 1.0  
**Prepared For:** Backend Development Team  
**Process:** Bank Reconciliation Process  
**Role:** Billing Manager  
**Date:** January 2025

---

## Table of Contents

1. [Process Overview](#process-overview)
2. [Complete Workflow](#complete-workflow)
3. [API Endpoints Summary](#api-endpoints-summary)
4. [Part 1: Master Data & Configuration APIs](#part-1-master-data--configuration-apis)
5. [Part 2: Statement Upload & Parsing APIs](#part-2-statement-upload--parsing-apis)
6. [Part 3: Reconciliation Process APIs](#part-3-reconciliation-process-apis)
7. [Part 4: Reports & History APIs](#part-4-reports--history-apis)
8. [Data Structures](#data-structures)
9. [Matching Algorithm Specifications](#matching-algorithm-specifications)
10. [Error Codes](#error-codes)
11. [Business Rules & Validations](#business-rules--validations)

---

## Process Overview

### Objective

Automate the bank reconciliation process by comparing bank statement transactions with book entries to identify matched and unmatched transactions, ensuring accurate financial reporting and compliance.

### Main Actor

- **Billing Manager** - Responsible for uploading bank statements, executing reconciliation, and reviewing results

### Key Features

- Upload bank statements (Excel/CSV format, future: PDF support)
- Automatic parsing of bank statement files
- Intelligent matching algorithm with scoring system
- Clear categorization of Matched vs Unmatched transactions
- Historical reconciliation tracking
- Export and reporting capabilities

### Sample Date Range

Currently using sample data from: **01-May-2024 to 31-May-2024**

---

## Complete Workflow

### Step 1: Setup and Selection

1. Billing Manager logs in and navigates to Bank Reconciliation page
2. System displays Bank Account dropdown (from master data)
3. Billing Manager selects Bank Account
4. System displays Cash Ledger dropdown (filtered/all ledgers)
5. Billing Manager selects Cash Ledger
6. Billing Manager enters date range (From Date, To Date)

### Step 2: Statement Upload and Preview

7. System enables file upload box after bank account and ledger selection
8. Billing Manager downloads bank statement from bank portal
9. Billing Manager uploads Excel/CSV file (future: PDF)
10. System validates file type, size, and format
11. System parses file and extracts transactions
12. System validates date range in file matches selected date range
13. System displays parsed transactions in preview table

### Step 3: Reconciliation Execution

14. System retrieves book entries for selected ledger and date range
15. Billing Manager clicks "Reconcile" button
16. System executes intelligent matching algorithm with scoring
17. System categorizes transactions:
    - **Matched** (Green): Found in both bank and books
    - **Only in Bank** (Red): In bank statement but not in books
    - **Only in Books** (Yellow): In books but not in bank statement

### Step 4: Review and Actions

18. System displays reconciliation results in unified table
19. Billing Manager reviews matched and unmatched transactions
20. Billing Manager can double-click "Only in Bank" entries to add them to books
21. Billing Manager can generate reconciliation statement
22. System saves reconciliation report to history

### Step 5: Historical Tracking

23. Billing Manager can view reconciliation history
24. System provides filtering, searching, and sorting capabilities
25. Billing Manager can view specific past reconciliation reports
26. Billing Manager can export reports to CSV/PDF

---

## API Endpoints Summary

| #   | Method | Endpoint                                                | Description                         | Actor           |
| --- | ------ | ------------------------------------------------------- | ----------------------------------- | --------------- |
| 1   | GET    | `/api/bank-reconciliation/bank-accounts`                | Get list of bank accounts           | Billing Manager |
| 2   | GET    | `/api/bank-reconciliation/ledgers`                      | Get list of cash ledgers            | Billing Manager |
| 3   | GET    | `/api/bank-reconciliation/ledgers/{ledgerId}/balance`   | Get ledger balance and details      | Billing Manager |
| 4   | POST   | `/api/bank-reconciliation/upload-statement`             | Upload bank statement file          | Billing Manager |
| 5   | POST   | `/api/bank-reconciliation/parse-statement`              | Parse and validate uploaded file    | System          |
| 6   | GET    | `/api/bank-reconciliation/statement-preview/{uploadId}` | Get preview of parsed transactions  | Billing Manager |
| 7   | GET    | `/api/bank-reconciliation/book-entries`                 | Get book entries for reconciliation | Billing Manager |
| 8   | POST   | `/api/bank-reconciliation/reconcile`                    | Execute reconciliation matching     | Billing Manager |
| 9   | POST   | `/api/bank-reconciliation/add-to-books`                 | Add unmatched bank entry to books   | Billing Manager |
| 10  | GET    | `/api/bank-reconciliation/history`                      | Get reconciliation history          | Billing Manager |
| 11  | GET    | `/api/bank-reconciliation/report/{reportId}`            | Get specific reconciliation report  | Billing Manager |
| 12  | GET    | `/api/bank-reconciliation/report/{reportId}/export`     | Export report to CSV/PDF            | Billing Manager |

---

## Part 1: Master Data & Configuration APIs

### API 1: Get Bank Accounts List

**Purpose:** Retrieve all available bank accounts for the organization

**Endpoint:** `GET /api/bank-reconciliation/bank-accounts`

**Request Headers:**

```json
{
  "Authorization": "Bearer <token>",
  "Content-Type": "application/json"
}
```

**Request Parameters:** None

**Response (Success - 200):**

```json
{
  "success": true,
  "message": "Bank accounts retrieved successfully",
  "data": {
    "bankAccounts": [
      {
        "id": "bank_a",
        "name": "CitiBank - Main Operating Account",
        "accountNumber": "1234",
        "maskedAccountNumber": "****1234",
        "bankName": "CitiBank",
        "branch": "Mumbai Branch",
        "ifscCode": "CITI0001234",
        "accountType": "Current Account",
        "currency": "INR",
        "isActive": true
      },
      {
        "id": "bank_b",
        "name": "JPMorgan Chase - Payroll Account",
        "accountNumber": "5678",
        "maskedAccountNumber": "****5678",
        "bankName": "JPMorgan Chase",
        "branch": "Delhi Branch",
        "ifscCode": "JPMC0005678",
        "accountType": "Current Account",
        "currency": "INR",
        "isActive": true
      }
    ]
  }
}
```

**Response (Error - 401):**

```json
{
  "success": false,
  "message": "Unauthorized access",
  "errorCode": "AUTH_ERROR"
}
```

**Frontend Usage:** Populate Bank Account dropdown in UploadStatementPage.jsx

---

### API 2: Get Cash Ledgers List

**Purpose:** Retrieve all available cash ledgers for reconciliation

**Endpoint:** `GET /api/bank-reconciliation/ledgers`

**Request Headers:**

```json
{
  "Authorization": "Bearer <token>",
  "Content-Type": "application/json"
}
```

**Request Parameters:**

```
Query Parameters (Optional):
- bankAccountId: string (filter ledgers by bank account)
```

**Response (Success - 200):**

```json
{
  "success": true,
  "message": "Ledgers retrieved successfully",
  "data": {
    "ledgers": [
      {
        "id": "ledger_main",
        "name": "Main Company Cash Ledger",
        "ledgerCode": "CASH001",
        "ledgerType": "Cash/Bank",
        "associatedBankAccount": "bank_a",
        "openingBalance": 500000.0,
        "currentBalance": 750000.0,
        "lastReconciliationDate": "2024-04-30",
        "isActive": true
      },
      {
        "id": "ledger_sales",
        "name": "Sales Department Cash Book",
        "ledgerCode": "CASH002",
        "ledgerType": "Cash/Bank",
        "associatedBankAccount": "bank_a",
        "openingBalance": 200000.0,
        "currentBalance": 350000.0,
        "lastReconciliationDate": "2024-04-30",
        "isActive": true
      },
      {
        "id": "ledger_ops",
        "name": "Operations Petty Cash Ledger",
        "ledgerCode": "CASH003",
        "ledgerType": "Petty Cash",
        "associatedBankAccount": null,
        "openingBalance": 50000.0,
        "currentBalance": 45000.0,
        "lastReconciliationDate": "2024-04-30",
        "isActive": true
      }
    ]
  }
}
```

**Response (Error - 404):**

```json
{
  "success": false,
  "message": "No ledgers found",
  "errorCode": "NO_LEDGERS_FOUND"
}
```

**Frontend Usage:** Populate Cash Ledger dropdown in UploadStatementPage.jsx

---

### API 3: Get Ledger Balance and Details

**Purpose:** Get detailed balance information for a specific ledger

**Endpoint:** `GET /api/bank-reconciliation/ledgers/{ledgerId}/balance`

**Request Headers:**

```json
{
  "Authorization": "Bearer <token>",
  "Content-Type": "application/json"
}
```

**Request Parameters:**

```
Path Parameters:
- ledgerId: string (required) - Ledger ID

Query Parameters:
- asOnDate: string (optional) - Date in YYYY-MM-DD format
```

**Response (Success - 200):**

```json
{
  "success": true,
  "message": "Ledger balance retrieved successfully",
  "data": {
    "ledgerId": "ledger_main",
    "ledgerName": "Main Company Cash Ledger",
    "ledgerCode": "CASH001",
    "asOnDate": "2024-05-31",
    "openingBalance": 500000.0,
    "totalDebit": 250000.0,
    "totalCredit": 500000.0,
    "closingBalance": 750000.0,
    "totalTransactions": 1520,
    "lastReconciliationDate": "2024-04-30",
    "unreconciledTransactions": 25
  }
}
```

**Response (Error - 404):**

```json
{
  "success": false,
  "message": "Ledger not found",
  "errorCode": "LEDGER_NOT_FOUND"
}
```

**Frontend Usage:** Display ledger balance information (if needed) before reconciliation

---

## Part 2: Statement Upload & Parsing APIs

### API 4: Upload Bank Statement File

**Purpose:** Upload bank statement file (Excel/CSV) for reconciliation

**Endpoint:** `POST /api/bank-reconciliation/upload-statement`

**Request Headers:**

```json
{
  "Authorization": "Bearer <token>",
  "Content-Type": "multipart/form-data"
}
```

**Request Body (Form Data):**

```
Fields:
- file: File (required) - Bank statement file (Excel/CSV, max 10MB)
- bankAccountId: string (required) - Selected bank account ID
- ledgerId: string (required) - Selected ledger ID
- fromDate: string (required) - Start date (YYYY-MM-DD)
- toDate: string (required) - End date (YYYY-MM-DD)
- statementType: string (optional) - 'excel' or 'csv' or 'pdf'
```

**Sample Request:**

```javascript
const formData = new FormData()
formData.append('file', selectedFile)
formData.append('bankAccountId', 'bank_a')
formData.append('ledgerId', 'ledger_main')
formData.append('fromDate', '2024-05-01')
formData.append('toDate', '2024-05-31')
formData.append('statementType', 'excel')
```

**Response (Success - 200):**

```json
{
  "success": true,
  "message": "Bank statement uploaded successfully",
  "data": {
    "uploadId": "upload_1234567890",
    "fileName": "bank_statement_may_2024.xlsx",
    "fileSize": 245678,
    "uploadedAt": "2024-05-31T10:30:00Z",
    "bankAccountId": "bank_a",
    "ledgerId": "ledger_main",
    "fromDate": "2024-05-01",
    "toDate": "2024-05-31",
    "status": "uploaded",
    "filePath": "/uploads/statements/upload_1234567890.xlsx"
  }
}
```

**Response (Error - 400):**

```json
{
  "success": false,
  "message": "Invalid file format. Only Excel and CSV files are allowed",
  "errorCode": "INVALID_FILE_FORMAT"
}
```

**Response (Error - 413):**

```json
{
  "success": false,
  "message": "File size exceeds maximum limit of 10MB",
  "errorCode": "FILE_TOO_LARGE"
}
```

**Frontend Usage:** FileUploadBox.jsx handles file upload with FormData

---

### API 5: Parse Bank Statement

**Purpose:** Parse uploaded bank statement file and extract transactions

**Endpoint:** `POST /api/bank-reconciliation/parse-statement`

**Request Headers:**

```json
{
  "Authorization": "Bearer <token>",
  "Content-Type": "application/json"
}
```

**Request Body:**

```json
{
  "uploadId": "upload_1234567890",
  "parseOptions": {
    "skipRows": 0,
    "dateFormat": "DD/MM/YYYY",
    "columnMapping": {
      "date": "Transaction Date",
      "description": "Description",
      "reference": "Reference No",
      "debit": "Debit",
      "credit": "Credit",
      "balance": "Balance"
    }
  }
}
```

**Business Logic - Excel/CSV Parsing:**

The system should parse the uploaded file with the following logic (as implemented in excelParser.js):

1. **Column Normalization:** Convert all column headers to lowercase and remove special characters
   - Accepted date columns: 'date', 'transaction_date', 'value_date', 'txn_date', 'posting_date', 'dt'
   - Accepted description columns: 'description', 'particulars', 'transaction_description', 'narration', 'details', 'desc'
   - Accepted reference columns: 'reference', 'ref_no', 'ref_number', 'transaction_id', 'chq_no', 'cheque_no', 'ref'
   - Accepted debit columns: 'debit', 'debit*amount', 'withdrawal', 'dr', 'debit*', 'withdrawl'
   - Accepted credit columns: 'credit', 'credit*amount', 'deposit', 'cr', 'credit*', 'deposits'
   - Accepted balance columns: 'balance', 'running*balance', 'account_balance', 'bal', 'balance*'

2. **Date Parsing:**
   - Support Excel date serial numbers (> 25569)
   - Support string dates: DD/MM/YYYY, DD-MM-YYYY, YYYY-MM-DD
   - Convert all dates to YYYY-MM-DD format
   - Allow ±3 days tolerance for date matching

3. **Number Cleaning:**
   - Remove currency symbols: ₹, $, £, €
   - Remove commas and parentheses
   - Parse both positive and negative numbers
   - Default to 0 if invalid

4. **Transaction Type Detection:**
   - If Debit > 0: type = 'debit', amount = debit value
   - If Credit > 0: type = 'credit', amount = credit value
   - Only include rows with valid amount > 0

5. **Date Range Filtering:**
   - Filter transactions to match selected fromDate to toDate
   - Show error if no transactions found in date range
   - Display actual date range in file if mismatch

**Response (Success - 200):**

```json
{
  "success": true,
  "message": "Bank statement parsed successfully",
  "data": {
    "uploadId": "upload_1234567890",
    "totalRows": 150,
    "parsedTransactions": 145,
    "skippedRows": 5,
    "dateRange": {
      "minDate": "2024-05-01",
      "maxDate": "2024-05-31"
    },
    "summary": {
      "totalDebit": 250000.0,
      "totalCredit": 500000.0,
      "closingBalance": 750000.0
    },
    "parsingStatus": "completed",
    "parsedAt": "2024-05-31T10:31:00Z"
  }
}
```

**Response (Error - 400):**

```json
{
  "success": false,
  "message": "No transactions found in the selected date range (2024-05-01 to 2024-05-31). Your file contains transactions from 2024-04-01 to 2024-04-30. Please adjust your date range.",
  "errorCode": "DATE_RANGE_MISMATCH",
  "details": {
    "selectedRange": {
      "from": "2024-05-01",
      "to": "2024-05-31"
    },
    "fileRange": {
      "from": "2024-04-01",
      "to": "2024-04-30"
    }
  }
}
```

**Response (Error - 400):**

```json
{
  "success": false,
  "message": "Failed to parse file: No valid transaction rows found. Please check if the file has proper Date, Debit, and Credit columns.",
  "errorCode": "INVALID_FILE_STRUCTURE"
}
```

**Frontend Usage:** Called automatically after file upload in UploadStatementPage.jsx

---

### API 6: Get Statement Preview

**Purpose:** Get preview of parsed bank statement transactions

**Endpoint:** `GET /api/bank-reconciliation/statement-preview/{uploadId}`

**Request Headers:**

```json
{
  "Authorization": "Bearer <token>",
  "Content-Type": "application/json"
}
```

**Request Parameters:**

```
Path Parameters:
- uploadId: string (required)

Query Parameters:
- page: number (optional, default: 1)
- limit: number (optional, default: 50)
```

**Response (Success - 200):**

```json
{
  "success": true,
  "message": "Statement preview retrieved successfully",
  "data": {
    "uploadId": "upload_1234567890",
    "fileName": "bank_statement_may_2024.xlsx",
    "totalTransactions": 145,
    "currentPage": 1,
    "totalPages": 3,
    "transactions": [
      {
        "date": "2024-05-02",
        "description": "Invoice Payment from ABC Corp",
        "ref_no": "NEFT123456789",
        "debit": 0.0,
        "credit": 50000.0,
        "balance": 550000.0
      },
      {
        "date": "2024-05-05",
        "description": "Cash Withdrawal for office expenses",
        "ref_no": "ATM987654",
        "debit": 10000.0,
        "credit": 0.0,
        "balance": 540000.0
      },
      {
        "date": "2024-05-10",
        "description": "Payment to John Electronics",
        "ref_no": "IMPS987654321",
        "debit": 12500.0,
        "credit": 0.0,
        "balance": 527500.0
      }
    ]
  }
}
```

**Response (Error - 404):**

```json
{
  "success": false,
  "message": "Upload not found or parsing not completed",
  "errorCode": "UPLOAD_NOT_FOUND"
}
```

**Frontend Usage:** Display parsed transactions in StatementPreviewTable.jsx

---

## Part 3: Reconciliation Process APIs

### API 7: Get Book Entries

**Purpose:** Retrieve book entries (GL transactions) for the selected ledger and date range

**Endpoint:** `GET /api/bank-reconciliation/book-entries`

**Request Headers:**

```json
{
  "Authorization": "Bearer <token>",
  "Content-Type": "application/json"
}
```

**Request Parameters:**

```
Query Parameters:
- ledgerId: string (required) - Ledger ID
- fromDate: string (required) - Start date (YYYY-MM-DD)
- toDate: string (required) - End date (YYYY-MM-DD)
- includeOpeningBalance: boolean (optional, default: false)
```

**Response (Success - 200):**

```json
{
  "success": true,
  "message": "Book entries retrieved successfully",
  "data": {
    "ledgerId": "ledger_main",
    "ledgerName": "Main Company Cash Ledger",
    "dateRange": {
      "from": "2024-05-01",
      "to": "2024-05-31"
    },
    "openingBalance": 500000.0,
    "totalEntries": 120,
    "bookEntries": [
      {
        "id": "l_m1",
        "date": "2024-05-02",
        "voucherNo": "JV/2024/001",
        "voucherType": "Journal Voucher",
        "description": "Invoice Payment from ABC Corp",
        "reference": "NEFT123456789",
        "amount": 50000.0,
        "type": "credit",
        "debitAmount": 0.0,
        "creditAmount": 50000.0,
        "balanceAfter": 550000.0,
        "contraLedger": "ABC Corp - Receivables",
        "narration": "Payment received against invoice INV/2024/045"
      },
      {
        "id": "l_m2",
        "date": "2024-05-05",
        "voucherNo": "PV/2024/012",
        "voucherType": "Payment Voucher",
        "description": "Cash Withdrawal for office expenses",
        "reference": "ATM987654",
        "amount": 10000.0,
        "type": "debit",
        "debitAmount": 10000.0,
        "creditAmount": 0.0,
        "balanceAfter": 540000.0,
        "contraLedger": "Office Expenses",
        "narration": "Cash withdrawal for petty expenses"
      },
      {
        "id": "l_m3",
        "date": "2024-05-10",
        "voucherNo": "PV/2024/015",
        "voucherType": "Payment Voucher",
        "description": "Payment to John Electronics",
        "reference": "IMPS987654321",
        "amount": 12500.0,
        "type": "debit",
        "debitAmount": 12500.0,
        "creditAmount": 0.0,
        "balanceAfter": 527500.0,
        "contraLedger": "John Electronics - Payables",
        "narration": "Payment for office equipment"
      }
    ],
    "summary": {
      "totalDebit": 125000.0,
      "totalCredit": 225000.0,
      "closingBalance": 600000.0
    }
  }
}
```

**Response (Error - 400):**

```json
{
  "success": false,
  "message": "Invalid date range. From date must be before to date.",
  "errorCode": "INVALID_DATE_RANGE"
}
```

**Response (Error - 404):**

```json
{
  "success": false,
  "message": "No book entries found for the selected ledger and date range",
  "errorCode": "NO_BOOK_ENTRIES_FOUND"
}
```

**Frontend Usage:** Called automatically when "Reconcile" button is clicked in UploadStatementPage.jsx

---

### API 8: Execute Reconciliation (Match Transactions)

**Purpose:** Execute intelligent matching algorithm to reconcile bank and book entries

**Endpoint:** `POST /api/bank-reconciliation/reconcile`

**Request Headers:**

```json
{
  "Authorization": "Bearer <token>",
  "Content-Type": "application/json"
}
```

**Request Body:**

```json
{
  "uploadId": "upload_1234567890",
  "ledgerId": "ledger_main",
  "bankAccountId": "bank_a",
  "fromDate": "2024-05-01",
  "toDate": "2024-05-31",
  "matchingOptions": {
    "matchThreshold": 70,
    "dateTolerance": 3,
    "amountTolerancePercentage": 1,
    "amountToleranceFixed": 100,
    "enableDescriptionMatching": true,
    "enableReferenceMatching": true
  }
}
```

**Business Logic - Matching Algorithm:**

The system should implement the following intelligent matching algorithm (as implemented in MatchTransactions.jsx):

**1. Score Calculation (0-100 points):**

- **Date Match (40 points max):**
  - Exact date match: 40 points
  - Within 1 day: 35 points
  - Within 2 days: 30 points
  - Within 3 days: 25 points
  - Beyond 3 days: 0 points

- **Amount Match (50 points max):**
  - Exact amount match: 50 points
  - Within tolerance (1% or ₹100, whichever smaller): 30 points
  - Beyond tolerance: 0 points

- **Description Similarity (10 points max):**
  - Common keywords found: 3 points per keyword (max 10)
  - Ignore words with less than 3 characters
  - Case-insensitive comparison

- **Reference Match (15 points bonus):**
  - Exact reference match: 15 points
  - Contains reference: 15 points
  - No reference match: 0 points

**2. Matching Process:**

**First Pass - High Confidence Matches (Score ≥ 70):**

- Compare each bank transaction with all unmatched book entries
- Calculate match score for each combination
- Select best match if score ≥ 70
- Mark both bank and book entries as matched
- Store match score with result

**Second Pass - Unmatched Bank Entries:**

- Add remaining bank transactions as "Only in Bank"
- Mark inBank=true, inBooks=false
- Match score = 0

**Third Pass - Unmatched Book Entries:**

- Add remaining book entries as "Only in Books"
- Mark inBank=false, inBooks=true
- Match score = 0

**3. Result Categorization:**

- **Matched (Green):** inBank=true AND inBooks=true, matchScore ≥ 70
- **Only in Bank (Red):** inBank=true AND inBooks=false, matchScore = 0
- **Only in Books (Yellow):** inBank=false AND inBooks=true, matchScore = 0

**Response (Success - 200):**

```json
{
  "success": true,
  "message": "Reconciliation completed successfully",
  "data": {
    "reconciliationId": "recon_1234567890",
    "uploadId": "upload_1234567890",
    "executedAt": "2024-05-31T11:00:00Z",
    "reconciliationStatus": "completed",
    "summary": {
      "totalBankTransactions": 145,
      "totalBookEntries": 120,
      "matchedTransactions": 110,
      "unmatchedBankTransactions": 35,
      "unmatchedBookEntries": 10,
      "matchPercentage": 75.86,
      "totalBankAmount": 500000.0,
      "totalBookAmount": 475000.0,
      "matchedAmount": 450000.0,
      "differenceAmount": 25000.0
    },
    "results": [
      {
        "id": "match_0_0",
        "date": "2024-05-02",
        "amount": 50000.0,
        "description": "Invoice Payment from ABC Corp",
        "reference": "NEFT123456789",
        "inBank": true,
        "inBooks": true,
        "matchScore": 100,
        "matchType": "exact",
        "bankEntry": {
          "id": "bank_0",
          "date": "2024-05-02",
          "description": "Invoice Payment from ABC Corp",
          "reference": "NEFT123456789",
          "amount": 50000.0,
          "type": "credit"
        },
        "bookEntry": {
          "id": "l_m1",
          "date": "2024-05-02",
          "voucherNo": "JV/2024/001",
          "description": "Invoice Payment from ABC Corp",
          "reference": "NEFT123456789",
          "amount": 50000.0,
          "type": "credit"
        }
      },
      {
        "id": "bank_only_15",
        "date": "2024-05-25",
        "amount": 5000.0,
        "description": "Bank Charges and Service Fees",
        "reference": "SYS5000",
        "inBank": true,
        "inBooks": false,
        "matchScore": 0,
        "matchType": "unmatched",
        "bankEntry": {
          "id": "bank_15",
          "date": "2024-05-25",
          "description": "Bank Charges and Service Fees",
          "reference": "SYS5000",
          "amount": 5000.0,
          "type": "debit"
        },
        "bookEntry": null
      },
      {
        "id": "book_only_8",
        "date": "2024-05-31",
        "amount": 25000.0,
        "description": "Salary advance to employee",
        "reference": "SADV001",
        "inBank": false,
        "inBooks": true,
        "matchScore": 0,
        "matchType": "unmatched",
        "bankEntry": null,
        "bookEntry": {
          "id": "l_m8",
          "date": "2024-05-31",
          "voucherNo": "PV/2024/089",
          "description": "Salary advance to employee",
          "reference": "SADV001",
          "amount": 25000.0,
          "type": "debit"
        }
      }
    ]
  }
}
```

**Response (Error - 400):**

```json
{
  "success": false,
  "message": "No book entries found for the selected ledger and date range",
  "errorCode": "NO_BOOK_ENTRIES_FOUND"
}
```

**Response (Error - 404):**

```json
{
  "success": false,
  "message": "Upload not found or parsing not completed",
  "errorCode": "UPLOAD_NOT_FOUND"
}
```

**Frontend Usage:**

- Called when "Reconcile" button clicked
- Results displayed in UnifiedReconciliationTable.jsx
- Summary shown in SummeryCard.jsx
- Matched transactions in MatchedTransactionTable.jsx
- Unmatched transactions in UnMatchedTransactionTable.jsx

---

### API 9: Add Unmatched Bank Entry to Books

**Purpose:** Add an unmatched bank transaction to books (manual reconciliation)

**Endpoint:** `POST /api/bank-reconciliation/add-to-books`

**Request Headers:**

```json
{
  "Authorization": "Bearer <token>",
  "Content-Type": "application/json"
}
```

**Request Body:**

```json
{
  "reconciliationId": "recon_1234567890",
  "bankTransactionId": "bank_15",
  "ledgerId": "ledger_main",
  "voucherType": "Journal Voucher",
  "contraLedgerCode": "MISC_EXP",
  "contraLedgerName": "Miscellaneous Expenses",
  "narration": "Bank charges for May 2024 (added during reconciliation)",
  "date": "2024-05-25",
  "amount": 5000.0,
  "type": "debit"
}
```

**Response (Success - 201):**

```json
{
  "success": true,
  "message": "Transaction added to books successfully",
  "data": {
    "voucherNo": "JV/2024/125",
    "voucherType": "Journal Voucher",
    "date": "2024-05-25",
    "amount": 5000.0,
    "ledgerId": "ledger_main",
    "contraLedgerId": "MISC_EXP",
    "narration": "Bank charges for May 2024 (added during reconciliation)",
    "createdAt": "2024-05-31T11:15:00Z",
    "createdBy": "billing_manager_user_id",
    "reconciliationId": "recon_1234567890",
    "bankTransactionId": "bank_15",
    "status": "posted"
  }
}
```

**Response (Error - 400):**

```json
{
  "success": false,
  "message": "Transaction already exists in books",
  "errorCode": "DUPLICATE_ENTRY"
}
```

**Frontend Usage:** Called when user double-clicks "Only in Bank" entry in UnifiedReconciliationTable.jsx

---

## Part 4: Reports & History APIs

### API 10: Get Reconciliation History

**Purpose:** Retrieve list of past reconciliation records with filtering and sorting

**Endpoint:** `GET /api/bank-reconciliation/history`

**Request Headers:**

```json
{
  "Authorization": "Bearer <token>",
  "Content-Type": "application/json"
}
```

**Request Parameters:**

```
Query Parameters:
- page: number (optional, default: 1)
- limit: number (optional, default: 10)
- sortBy: string (optional, default: 'date') - Options: 'date', 'fileName', 'matched', 'unmatched'
- sortOrder: string (optional, default: 'desc') - Options: 'asc', 'desc'
- filterStatus: string (optional, default: 'all') - Options: 'all', 'perfect', 'issues', 'recent'
- searchTerm: string (optional) - Search in file name or reconciler name
- bankAccountId: string (optional) - Filter by bank account
- fromDate: string (optional) - Filter by reconciliation date (YYYY-MM-DD)
- toDate: string (optional) - Filter by reconciliation date (YYYY-MM-DD)
```

**Response (Success - 200):**

```json
{
  "success": true,
  "message": "Reconciliation history retrieved successfully",
  "data": {
    "totalRecords": 45,
    "currentPage": 1,
    "totalPages": 5,
    "statistics": {
      "totalRecords": 45,
      "perfectMatches": 32,
      "totalTransactions": 6500,
      "matchedTransactions": 5850,
      "matchRate": 90
    },
    "history": [
      {
        "id": "recon_1234567890",
        "date": "2024-05-31T11:00:00Z",
        "fileName": "bank_statement_may_2024.xlsx",
        "bankAccount": {
          "id": "bank_a",
          "name": "CitiBank - Main Operating Account",
          "accountNumber": "****1234"
        },
        "ledger": {
          "id": "ledger_main",
          "name": "Main Company Cash Ledger"
        },
        "period": {
          "from": "2024-05-01",
          "to": "2024-05-31"
        },
        "reconciler": {
          "id": "user_123",
          "name": "John Doe",
          "email": "john.doe@company.com"
        },
        "summary": {
          "totalBankTransactions": 145,
          "totalBookEntries": 120,
          "matchedTransactions": 110,
          "unmatchedBankTransactions": 35,
          "unmatchedBookEntries": 10,
          "matchPercentage": 75.86,
          "matchedAmount": 450000.0,
          "differenceAmount": 25000.0
        },
        "status": "completed",
        "notes": "Bank charges need to be booked",
        "statusBadge": "issues"
      },
      {
        "id": "recon_0987654321",
        "date": "2024-04-30T14:30:00Z",
        "fileName": "bank_statement_april_2024.xlsx",
        "bankAccount": {
          "id": "bank_a",
          "name": "CitiBank - Main Operating Account",
          "accountNumber": "****1234"
        },
        "ledger": {
          "id": "ledger_main",
          "name": "Main Company Cash Ledger"
        },
        "period": {
          "from": "2024-04-01",
          "to": "2024-04-30"
        },
        "reconciler": {
          "id": "user_123",
          "name": "John Doe",
          "email": "john.doe@company.com"
        },
        "summary": {
          "totalBankTransactions": 128,
          "totalBookEntries": 128,
          "matchedTransactions": 128,
          "unmatchedBankTransactions": 0,
          "unmatchedBookEntries": 0,
          "matchPercentage": 100,
          "matchedAmount": 520000.0,
          "differenceAmount": 0
        },
        "status": "completed",
        "notes": "Perfect reconciliation - no discrepancies",
        "statusBadge": "perfect"
      }
    ]
  }
}
```

**Response (Error - 401):**

```json
{
  "success": false,
  "message": "Unauthorized access",
  "errorCode": "AUTH_ERROR"
}
```

**Frontend Usage:** Display reconciliation history in ReconcilationHistoryPage.jsx with filters and sorting

---

### API 11: Get Specific Reconciliation Report

**Purpose:** Get detailed report for a specific reconciliation

**Endpoint:** `GET /api/bank-reconciliation/report/{reportId}`

**Request Headers:**

```json
{
  "Authorization": "Bearer <token>",
  "Content-Type": "application/json"
}
```

**Request Parameters:**

```
Path Parameters:
- reportId: string (required) - Reconciliation ID

Query Parameters:
- includeTransactions: boolean (optional, default: true)
- includeMatched: boolean (optional, default: true)
- includeUnmatched: boolean (optional, default: true)
```

**Response (Success - 200):**

```json
{
  "success": true,
  "message": "Reconciliation report retrieved successfully",
  "data": {
    "reconciliationId": "recon_1234567890",
    "reportDate": "2024-05-31T11:00:00Z",
    "reportGenerated": "2024-05-31T11:05:00Z",
    "fileName": "bank_statement_may_2024.xlsx",
    "bankAccount": {
      "id": "bank_a",
      "name": "CitiBank - Main Operating Account",
      "accountNumber": "1234567890",
      "maskedAccountNumber": "****1234",
      "bankName": "CitiBank",
      "branch": "Mumbai Branch"
    },
    "ledger": {
      "id": "ledger_main",
      "name": "Main Company Cash Ledger",
      "ledgerCode": "CASH001"
    },
    "period": {
      "from": "2024-05-01",
      "to": "2024-05-31"
    },
    "reconciler": {
      "id": "user_123",
      "name": "John Doe",
      "email": "john.doe@company.com",
      "role": "Billing Manager"
    },
    "summary": {
      "totalBankTransactions": 145,
      "totalBookEntries": 120,
      "matchedTransactions": 110,
      "unmatchedBankTransactions": 35,
      "unmatchedBookEntries": 10,
      "matchPercentage": 75.86,
      "bankOpeningBalance": 500000.0,
      "bankClosingBalance": 750000.0,
      "bookOpeningBalance": 500000.0,
      "bookClosingBalance": 725000.0,
      "difference": 25000.0,
      "totalBankDebit": 250000.0,
      "totalBankCredit": 500000.0,
      "totalBookDebit": 225000.0,
      "totalBookCredit": 450000.0,
      "matchedAmount": 450000.0
    },
    "matchedTransactions": [
      {
        "id": "match_0_0",
        "date": "2024-05-02",
        "amount": 50000.0,
        "description": "Invoice Payment from ABC Corp",
        "reference": "NEFT123456789",
        "matchScore": 100,
        "matchType": "exact",
        "bankDate": "2024-05-02",
        "bookDate": "2024-05-02",
        "bankAmount": 50000.0,
        "bookAmount": 50000.0,
        "voucherNo": "JV/2024/001"
      }
    ],
    "unmatchedTransactions": {
      "onlyInBank": [
        {
          "id": "bank_only_15",
          "date": "2024-05-25",
          "amount": 5000.0,
          "description": "Bank Charges and Service Fees",
          "reference": "SYS5000",
          "type": "debit",
          "reason": "Not recorded in books",
          "actionRequired": "Book bank charges entry"
        }
      ],
      "onlyInBooks": [
        {
          "id": "book_only_8",
          "date": "2024-05-31",
          "amount": 25000.0,
          "description": "Salary advance to employee",
          "reference": "SADV001",
          "type": "debit",
          "voucherNo": "PV/2024/089",
          "reason": "Cheque not cleared in bank",
          "actionRequired": "Follow up on cheque clearance"
        }
      ]
    },
    "reconciliationStatement": {
      "balanceAsPerBooks": 725000.0,
      "addOnlyInBank": 35000.0,
      "lessOnlyInBooks": 10000.0,
      "adjustedBankBalance": 750000.0,
      "actualBankBalance": 750000.0,
      "finalDifference": 0
    },
    "notes": "Bank charges need to be booked. Follow up on pending cheques.",
    "status": "completed"
  }
}
```

**Response (Error - 404):**

```json
{
  "success": false,
  "message": "Reconciliation report not found",
  "errorCode": "REPORT_NOT_FOUND"
}
```

**Frontend Usage:**

- Display detailed report in ReconcilationReportPage.jsx
- Show reconciliation statement in ReconciliationStatement.jsx
- Display matched/unmatched transactions in respective tables

---

### API 12: Export Reconciliation Report

**Purpose:** Export reconciliation report to CSV or PDF format

**Endpoint:** `GET /api/bank-reconciliation/report/{reportId}/export`

**Request Headers:**

```json
{
  "Authorization": "Bearer <token>",
  "Content-Type": "application/json"
}
```

**Request Parameters:**

```
Path Parameters:
- reportId: string (required) - Reconciliation ID

Query Parameters:
- format: string (required) - Options: 'csv', 'pdf', 'excel'
- includeMatched: boolean (optional, default: true)
- includeUnmatched: boolean (optional, default: true)
- includeStatement: boolean (optional, default: true)
```

**Response (Success - 200):**

```
Content-Type: application/octet-stream (for CSV/Excel)
Content-Type: application/pdf (for PDF)
Content-Disposition: attachment; filename="reconciliation_report_may_2024.csv"

[File content as binary data]
```

**Response (Error - 404):**

```json
{
  "success": false,
  "message": "Reconciliation report not found",
  "errorCode": "REPORT_NOT_FOUND"
}
```

**Frontend Usage:**

- Export button in ReconcilationHistoryPage.jsx
- Download link in ReconciliationReport.jsx
- Print functionality for reconciliation statement

---

## Data Structures

### Bank Statement Transaction Structure

**Expected Excel/CSV Columns (flexible column names):**

```
Date | Description/Particulars | Reference/Chq No | Debit/Withdrawal | Credit/Deposit | Balance
```

**Parsed Bank Transaction Object:**

```json
{
  "id": "bank_0",
  "date": "2024-05-02",
  "description": "Invoice Payment from ABC Corp",
  "reference": "NEFT123456789",
  "amount": 50000.0,
  "type": "credit",
  "debit": 0.0,
  "credit": 50000.0,
  "balance": 550000.0
}
```

**Field Descriptions:**

- `id`: Unique identifier (bank_X where X is index)
- `date`: Transaction date in YYYY-MM-DD format
- `description`: Transaction description/particulars
- `reference`: Reference number, cheque number, UTR, etc.
- `amount`: Absolute transaction amount
- `type`: 'debit' or 'credit'
- `debit`: Debit amount (0 if credit transaction)
- `credit`: Credit amount (0 if debit transaction)
- `balance`: Running balance after transaction

---

### Book Entry Structure

**Book Entry (GL Transaction) Object:**

```json
{
  "id": "l_m1",
  "date": "2024-05-02",
  "voucherNo": "JV/2024/001",
  "voucherType": "Journal Voucher",
  "description": "Invoice Payment from ABC Corp",
  "reference": "NEFT123456789",
  "amount": 50000.0,
  "type": "credit",
  "debitAmount": 0.0,
  "creditAmount": 50000.0,
  "balanceAfter": 550000.0,
  "contraLedger": "ABC Corp - Receivables",
  "narration": "Payment received against invoice INV/2024/045"
}
```

**Field Descriptions:**

- `id`: Unique book entry identifier
- `date`: Entry date in YYYY-MM-DD format
- `voucherNo`: Voucher number (JV/PV/RV/etc.)
- `voucherType`: Type of voucher (Journal Voucher, Payment Voucher, Receipt Voucher)
- `description`: Brief description
- `reference`: Payment reference (NEFT/RTGS/Cheque number)
- `amount`: Absolute transaction amount
- `type`: 'debit' or 'credit'
- `debitAmount`: Debit amount (0 if credit)
- `creditAmount`: Credit amount (0 if debit)
- `balanceAfter`: Balance after this entry
- `contraLedger`: Opposite account in double-entry
- `narration`: Detailed narration/explanation

---

### Reconciliation Result Structure

**Matched Transaction Object:**

```json
{
  "id": "match_0_0",
  "date": "2024-05-02",
  "amount": 50000.0,
  "description": "Invoice Payment from ABC Corp",
  "reference": "NEFT123456789",
  "inBank": true,
  "inBooks": true,
  "matchScore": 100,
  "matchType": "exact",
  "bankEntry": {
    "id": "bank_0",
    "date": "2024-05-02",
    "description": "Invoice Payment from ABC Corp",
    "reference": "NEFT123456789",
    "amount": 50000.0,
    "type": "credit"
  },
  "bookEntry": {
    "id": "l_m1",
    "date": "2024-05-02",
    "voucherNo": "JV/2024/001",
    "description": "Invoice Payment from ABC Corp",
    "reference": "NEFT123456789",
    "amount": 50000.0,
    "type": "credit"
  }
}
```

**Unmatched Transaction (Only in Bank) Object:**

```json
{
  "id": "bank_only_15",
  "date": "2024-05-25",
  "amount": 5000.0,
  "description": "Bank Charges and Service Fees",
  "reference": "SYS5000",
  "inBank": true,
  "inBooks": false,
  "matchScore": 0,
  "matchType": "unmatched",
  "bankEntry": {
    "id": "bank_15",
    "date": "2024-05-25",
    "description": "Bank Charges and Service Fees",
    "reference": "SYS5000",
    "amount": 5000.0,
    "type": "debit"
  },
  "bookEntry": null,
  "reason": "Not recorded in books",
  "actionRequired": "Book bank charges entry"
}
```

**Unmatched Transaction (Only in Books) Object:**

```json
{
  "id": "book_only_8",
  "date": "2024-05-31",
  "amount": 25000.0,
  "description": "Salary advance to employee",
  "reference": "SADV001",
  "inBank": false,
  "inBooks": true,
  "matchScore": 0,
  "matchType": "unmatched",
  "bankEntry": null,
  "bookEntry": {
    "id": "l_m8",
    "date": "2024-05-31",
    "voucherNo": "PV/2024/089",
    "description": "Salary advance to employee",
    "reference": "SADV001",
    "amount": 25000.0,
    "type": "debit"
  },
  "reason": "Cheque not cleared in bank",
  "actionRequired": "Follow up on cheque clearance"
}
```

---

## Matching Algorithm Specifications

### Overview

The matching algorithm uses a scoring system (0-100 points) to determine if a bank transaction matches a book entry. Matches with score ≥ 70 are considered matched.

### Score Components

#### 1. Date Match (40 points maximum)

```
Scoring Logic:
- Exact date match: 40 points
- Date difference ≤ 1 day: 35 points (40 - 5)
- Date difference ≤ 2 days: 30 points (40 - 10)
- Date difference ≤ 3 days: 25 points (40 - 15)
- Date difference > 3 days: 0 points

Formula:
if (bankDate === bookDate):
  score += 40
else:
  daysDiff = abs(bankDate - bookDate)
  if (daysDiff <= 3):
    score += max(20, 40 - (daysDiff * 5))
```

**Example:**

- Bank: 2024-05-05, Book: 2024-05-05 → 40 points
- Bank: 2024-05-05, Book: 2024-05-06 → 35 points
- Bank: 2024-05-05, Book: 2024-05-07 → 30 points
- Bank: 2024-05-05, Book: 2024-05-10 → 0 points

---

#### 2. Amount Match (50 points maximum)

```
Scoring Logic:
- Exact amount match: 50 points
- Within tolerance: 30 points
  - Tolerance = 1% of amount OR ₹100, whichever is smaller
- Beyond tolerance: 0 points

Formula:
if (bankAmount === bookAmount):
  score += 50
else:
  difference = abs(bankAmount - bookAmount)
  tolerance = min(max(bankAmount, bookAmount) * 0.01, 100)
  if (difference <= tolerance):
    score += 30
```

**Example:**

- Bank: ₹50,000, Book: ₹50,000 → 50 points
- Bank: ₹50,000, Book: ₹50,050 → 30 points (within ₹100 tolerance)
- Bank: ₹50,000, Book: ₹50,600 → 30 points (within 1% = ₹500 tolerance)
- Bank: ₹50,000, Book: ₹60,000 → 0 points (beyond tolerance)

---

#### 3. Description Similarity (10 points maximum)

```
Scoring Logic:
- Find common keywords between bank and book descriptions
- Ignore words with less than 3 characters
- Case-insensitive comparison
- 3 points per common keyword (max 10 points)

Formula:
bankWords = bankDescription.toLowerCase().split().filter(word.length > 2)
bookWords = bookDescription.toLowerCase().split().filter(word.length > 2)
commonWords = 0
for each bankWord:
  if bookWords contains bankWord or similar:
    commonWords++
score += min(10, commonWords * 3)
```

**Example:**

- Bank: "Invoice Payment from ABC Corp"
- Book: "Invoice Payment from ABC Corp"
- Common keywords: invoice, payment, from, abc, corp
- Score: min(10, 5 \* 3) = 10 points

---

#### 4. Reference Match (15 points bonus)

```
Scoring Logic:
- Exact reference match: 15 points
- Reference contains other: 15 points
- No match: 0 points

Formula:
if (bankRef === bookRef):
  score += 15
else if (bankRef.includes(bookRef) OR bookRef.includes(bankRef)):
  score += 15
```

**Example:**

- Bank: "NEFT123456789", Book: "NEFT123456789" → 15 points
- Bank: "NEFT123456789", Book: "NEFT123" → 15 points
- Bank: "NEFT123456789", Book: "RTGS987654321" → 0 points

---

### Total Score Calculation

```
Total Score = Date Match + Amount Match + Description Similarity + Reference Match
Total Score is capped at 100 points

Match Threshold: 70 points
- Score ≥ 70: Matched transaction
- Score < 70: Unmatched transaction
```

### Match Score Categories

| Score Range | Category        | Color  | Description                          |
| ----------- | --------------- | ------ | ------------------------------------ |
| 100         | Perfect Match   | Green  | Exact match on all parameters        |
| 90-99       | Excellent Match | Green  | Very high confidence match           |
| 70-89       | Good Match      | Yellow | Acceptable match, review recommended |
| Below 70    | No Match        | Red    | Unmatched transaction                |

---

### Matching Process Flow

```
Step 1: Initialize
- Create empty matched results array
- Create sets for matched bank indices and book indices

Step 2: First Pass - High Confidence Matches (Score ≥ 70)
for each bankTransaction in bankData:
  if bankTransaction already matched:
    skip

  bestMatch = null
  bestScore = 0
  bestBookIndex = -1

  for each bookEntry in bookData:
    if bookEntry already matched:
      skip

    score = calculateMatchScore(bankTransaction, bookEntry)

    if score > bestScore AND score ≥ 70:
      bestMatch = bookEntry
      bestScore = score
      bestBookIndex = index

  if bestMatch found:
    add to matched results with:
      - inBank: true
      - inBooks: true
      - matchScore: bestScore
      - both bank and book entries
    mark both as matched

Step 3: Second Pass - Add Unmatched Bank Entries
for each bankTransaction not matched:
  add to results with:
    - inBank: true
    - inBooks: false
    - matchScore: 0
    - bankEntry only

Step 4: Third Pass - Add Unmatched Book Entries
for each bookEntry not matched:
  add to results with:
    - inBank: false
    - inBooks: true
    - matchScore: 0
    - bookEntry only

Step 5: Sort and Return
- Sort all results by date
- Calculate summary statistics
- Return complete reconciliation result
```

---

## Error Codes

### Authentication & Authorization Errors (401-403)

| Code              | HTTP Status | Message             | Description                     |
| ----------------- | ----------- | ------------------- | ------------------------------- |
| AUTH_ERROR        | 401         | Unauthorized access | User not authenticated          |
| PERMISSION_DENIED | 403         | Access denied       | User lacks required permissions |
| TOKEN_EXPIRED     | 401         | Token has expired   | Authentication token expired    |

### Validation Errors (400)

| Code                   | HTTP Status | Message                 | Description                           |
| ---------------------- | ----------- | ----------------------- | ------------------------------------- |
| INVALID_FILE_FORMAT    | 400         | Invalid file format     | File is not Excel/CSV/PDF             |
| FILE_TOO_LARGE         | 413         | File size exceeds limit | File > 10MB                           |
| INVALID_DATE_RANGE     | 400         | Invalid date range      | From date ≥ To date                   |
| DATE_RANGE_MISMATCH    | 400         | Date range mismatch     | File dates don't match selected range |
| MISSING_REQUIRED_FIELD | 400         | Required field missing  | Required parameters not provided      |
| INVALID_FILE_STRUCTURE | 400         | Invalid file structure  | Excel/CSV missing required columns    |
| INVALID_LEDGER         | 400         | Invalid ledger ID       | Ledger not found or inactive          |
| INVALID_BANK_ACCOUNT   | 400         | Invalid bank account    | Bank account not found or inactive    |
| DUPLICATE_ENTRY        | 400         | Duplicate entry         | Transaction already exists            |

### Resource Not Found Errors (404)

| Code                       | HTTP Status | Message                 | Description                     |
| -------------------------- | ----------- | ----------------------- | ------------------------------- |
| UPLOAD_NOT_FOUND           | 404         | Upload not found        | Upload ID invalid or expired    |
| REPORT_NOT_FOUND           | 404         | Report not found        | Reconciliation report not found |
| LEDGER_NOT_FOUND           | 404         | Ledger not found        | Ledger ID not found             |
| BANK_ACCOUNT_NOT_FOUND     | 404         | Bank account not found  | Bank account not found          |
| NO_LEDGERS_FOUND           | 404         | No ledgers found        | No ledgers available            |
| NO_BOOK_ENTRIES_FOUND      | 404         | No book entries found   | No GL entries for date range    |
| NO_BANK_TRANSACTIONS_FOUND | 404         | No transactions in file | Parsed file has no transactions |

### Processing Errors (500)

| Code                  | HTTP Status | Message                 | Description                  |
| --------------------- | ----------- | ----------------------- | ---------------------------- |
| PARSING_FAILED        | 500         | Failed to parse file    | Excel/CSV/PDF parsing error  |
| RECONCILIATION_FAILED | 500         | Reconciliation failed   | Matching algorithm error     |
| DATABASE_ERROR        | 500         | Database error occurred | Database query/update failed |
| EXPORT_FAILED         | 500         | Export failed           | Report export error          |

---

## Business Rules & Validations

### File Upload Validations

1. **File Type**
   - Allowed: .xlsx, .xls, .csv (future: .pdf)
   - Reject other file types with error code: INVALID_FILE_FORMAT

2. **File Size**
   - Maximum: 10MB
   - Reject larger files with error code: FILE_TOO_LARGE

3. **File Structure**
   - Must have at least 3 columns: Date, Debit/Credit, Description
   - Must have at least 1 data row (excluding header)
   - Reject invalid structure with error code: INVALID_FILE_STRUCTURE

---

### Date Range Validations

1. **Date Selection**
   - From Date must be before To Date
   - Date range should not exceed 1 year
   - Reject invalid ranges with error code: INVALID_DATE_RANGE

2. **File Date Range**
   - Parsed transactions must fall within selected date range
   - If no transactions in range, show actual file date range
   - Error code: DATE_RANGE_MISMATCH

3. **Date Tolerance in Matching**
   - Allow ±3 days tolerance for matching
   - Reduce score for date differences
   - No match beyond 3 days

---

### Amount Validations

1. **Amount Parsing**
   - Remove currency symbols: ₹, $, £, €
   - Remove commas and spaces
   - Support negative numbers in parentheses: (500) = -500
   - Default to 0 if parsing fails

2. **Amount Matching Tolerance**
   - Tolerance = 1% of amount OR ₹100, whichever is SMALLER
   - Example: ₹50,000 → ±₹100 (not ±₹500)
   - Example: ₹5,000 → ±₹50
   - Exact match: 50 points
   - Within tolerance: 30 points
   - Beyond tolerance: 0 points

---

### Ledger and Bank Account Validations

1. **Ledger Selection**
   - Ledger must be active
   - Ledger must be of type Cash/Bank
   - Ledger must have opening balance
   - Error code: INVALID_LEDGER

2. **Bank Account Selection**
   - Bank account must be active
   - Bank account must belong to organization
   - Error code: INVALID_BANK_ACCOUNT

3. **Book Entries Retrieval**
   - Must have at least 1 book entry for reconciliation
   - Filter by ledger ID and date range
   - Include only posted vouchers (exclude draft/pending)
   - Error code: NO_BOOK_ENTRIES_FOUND

---

### Reconciliation Rules

1. **Minimum Match Score**
   - Threshold: 70 points out of 100
   - Score < 70: Unmatched
   - Score ≥ 70: Matched

2. **One-to-One Matching**
   - Each bank transaction can match at most one book entry
   - Once matched, both are excluded from further matching
   - Manual matching can override auto-matching

3. **Match Type Classification**
   - **Matched**: inBank=true AND inBooks=true (Green)
   - **Only in Bank**: inBank=true AND inBooks=false (Red)
   - **Only in Books**: inBank=false AND inBooks=true (Yellow)

4. **Required Action for Unmatched**
   - Only in Bank → Book the missing entry
   - Only in Books → Verify bank clearance/follow-up

---

### Historical Data Rules

1. **Reconciliation History Storage**
   - Store complete reconciliation results
   - Include all matched and unmatched transactions
   - Store match scores for audit trail
   - Retain for minimum 7 years (compliance)

2. **Report Generation**
   - Generate report immediately after reconciliation
   - Store report ID for future reference
   - Allow export to CSV, Excel, PDF

3. **Reconciliation Re-run**
   - Allow re-running reconciliation for same period
   - Mark previous reconciliation as superseded
   - Maintain audit trail of all reconciliations

---

### Status Management

1. **Reconciliation Status**
   - `uploaded`: File uploaded, not parsed
   - `parsing`: Parsing in progress
   - `parsed`: Parsing completed
   - `reconciling`: Reconciliation in progress
   - `completed`: Reconciliation completed
   - `failed`: Error occurred
   - `superseded`: Replaced by new reconciliation

2. **Transaction Status in Report**
   - `matched`: Found in both bank and books
   - `unmatched_bank`: Only in bank statement
   - `unmatched_book`: Only in books
   - `manually_matched`: Manually matched by user
   - `under_review`: Flagged for review

---

### Export and Reporting Rules

1. **CSV Export Format**
   - Include all columns: Date, Amount, Description, Reference, In Bank, In Books, Status, Match Score
   - Use comma as delimiter
   - Quote text fields containing commas
   - UTF-8 encoding

2. **PDF Report Format**
   - Company header with logo
   - Reconciliation period and bank account details
   - Summary statistics
   - Detailed matched transactions table
   - Detailed unmatched transactions table
   - Reconciliation statement
   - Footer with page numbers and generation timestamp

3. **Excel Export Format**
   - Multiple sheets: Summary, Matched, Unmatched Bank, Unmatched Books
   - Formatted with colors: Green for matched, Red/Yellow for unmatched
   - Include formulas for totals
   - Freeze header row

---

### Performance and Scalability

1. **Transaction Limits**
   - Maximum 10,000 bank transactions per reconciliation
   - Maximum 10,000 book entries per reconciliation
   - Paginate preview tables (50 records per page)
   - Implement lazy loading for large datasets

2. **Processing Timeout**
   - File parsing: Maximum 2 minutes
   - Reconciliation matching: Maximum 5 minutes
   - Return error if timeout exceeded

3. **Caching**
   - Cache parsed bank data for 24 hours
   - Cache book entries for same period
   - Invalidate cache on new GL posting

---

## Sample API Flow Sequences

### Flow 1: Complete Reconciliation Process

```
1. User Opens Page → GET /api/bank-reconciliation/bank-accounts
   Response: List of bank accounts

2. User Selects Bank → GET /api/bank-reconciliation/ledgers?bankAccountId=bank_a
   Response: List of ledgers

3. User Selects Ledger and Date Range → No API call (frontend state)

4. User Uploads File → POST /api/bank-reconciliation/upload-statement
   Request: FormData with file, bankAccountId, ledgerId, fromDate, toDate
   Response: uploadId, fileName, status

5. System Auto-Parses → POST /api/bank-reconciliation/parse-statement
   Request: uploadId, parseOptions
   Response: totalRows, parsedTransactions, summary

6. User Views Preview → GET /api/bank-reconciliation/statement-preview/{uploadId}
   Response: List of parsed bank transactions

7. User Clicks Reconcile → GET /api/bank-reconciliation/book-entries
   Request: ledgerId, fromDate, toDate
   Response: List of book entries

8. System Executes Matching → POST /api/bank-reconciliation/reconcile
   Request: uploadId, ledgerId, bankAccountId, matchingOptions
   Response: reconciliationId, summary, matched, unmatched results

9. User Views Results → Display in UnifiedReconciliationTable

10. User Double-Clicks Unmatched → POST /api/bank-reconciliation/add-to-books
    Request: reconciliationId, bankTransactionId, ledgerId, contraLedger, narration
    Response: voucherNo, status

11. User Generates Statement → Navigate to ReconciliationStatementPage (frontend only)

12. User Views History → GET /api/bank-reconciliation/history
    Response: List of past reconciliations

13. User Views Specific Report → GET /api/bank-reconciliation/report/{reportId}
    Response: Detailed report with all transactions

14. User Exports Report → GET /api/bank-reconciliation/report/{reportId}/export?format=pdf
    Response: PDF file download
```

---

### Flow 2: Error Handling - Date Range Mismatch

```
1. User uploads file with transactions from April 2024
2. User selected date range: May 2024
3. System parses file successfully
4. System filters transactions for May → 0 transactions found
5. System returns error:
   {
     "success": false,
     "message": "No transactions found in the selected date range (2024-05-01 to 2024-05-31). Your file contains transactions from 2024-04-01 to 2024-04-30. Please adjust your date range.",
     "errorCode": "DATE_RANGE_MISMATCH",
     "details": {
       "selectedRange": { "from": "2024-05-01", "to": "2024-05-31" },
       "fileRange": { "from": "2024-04-01", "to": "2024-04-30" }
     }
   }
6. Frontend displays error with actual file date range
7. User adjusts date range and re-uploads
```

---

### Flow 3: Manual Matching - Add to Books

```
1. User views reconciliation results
2. Sees transaction "Bank Charges - ₹5,000" marked as "Only in Bank" (Red)
3. User double-clicks the transaction
4. Frontend shows confirmation dialog
5. User confirms
6. Frontend calls: POST /api/bank-reconciliation/add-to-books
   Request:
   {
     "reconciliationId": "recon_1234567890",
     "bankTransactionId": "bank_15",
     "ledgerId": "ledger_main",
     "voucherType": "Journal Voucher",
     "contraLedgerCode": "MISC_EXP",
     "contraLedgerName": "Miscellaneous Expenses",
     "narration": "Bank charges for May 2024",
     "date": "2024-05-25",
     "amount": 5000.00,
     "type": "debit"
   }
7. Backend creates GL journal voucher
8. Backend returns: voucherNo: "JV/2024/125"
9. Frontend updates transaction status to "Matched" (Green)
10. User sees updated reconciliation table
```

---

## Implementation Notes for Backend Developer

### 1. Excel/CSV Parsing Implementation

**Library Recommendations:**

- **Node.js**: Use `xlsx` or `exceljs` library
- **Python**: Use `openpyxl` or `pandas` library
- **Java**: Use Apache POI library

**Key Implementation Points:**

```javascript
// Normalize column headers (remove special characters, lowercase)
const normalizeHeader = (header) => {
  return header
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\(\)■\[\]]/g, '_')
    .replace(/[^\w]/g, '')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
}

// Parse date handling various formats
const parseDate = (dateValue) => {
  // Handle Excel serial date numbers
  if (typeof dateValue === 'number' && dateValue > 25569) {
    return new Date((dateValue - 25569) * 86400 * 1000)
  }
  // Handle DD/MM/YYYY format
  if (typeof dateValue === 'string') {
    const match = dateValue.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/)
    if (match) {
      return new Date(match[3], match[2] - 1, match[1])
    }
  }
  return new Date(dateValue)
}

// Clean amount (remove currency symbols)
const cleanNumber = (value) => {
  if (typeof value === 'number') return value
  return parseFloat(value.toString().replace(/[₹$£€,\s()]/g, '')) || 0
}
```

---

### 2. Matching Algorithm Implementation

**Pseudo-code for Match Score Calculation:**

```javascript
function calculateMatchScore(bankEntry, bookEntry) {
  let score = 0

  // 1. Date Match (40 points max)
  const bankDate = new Date(bankEntry.date)
  const bookDate = new Date(bookEntry.date)
  const daysDiff = Math.abs((bankDate - bookDate) / (1000 * 60 * 60 * 24))

  if (daysDiff === 0) {
    score += 40
  } else if (daysDiff <= 3) {
    score += Math.max(20, 40 - daysDiff * 5)
  }

  // 2. Amount Match (50 points max)
  const bankAmount = Math.abs(bankEntry.amount)
  const bookAmount = Math.abs(bookEntry.amount)

  if (bankAmount === bookAmount) {
    score += 50
  } else {
    const difference = Math.abs(bankAmount - bookAmount)
    const tolerance = Math.min(Math.max(bankAmount, bookAmount) * 0.01, 100)
    if (difference <= tolerance) {
      score += 30
    }
  }

  // 3. Description Similarity (10 points max)
  const bankWords = bankEntry.description
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 2)
  const bookWords = bookEntry.description
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 2)

  let commonWords = 0
  bankWords.forEach((bw) => {
    if (bookWords.some((bkw) => bkw.includes(bw) || bw.includes(bkw))) {
      commonWords++
    }
  })
  score += Math.min(10, commonWords * 3)

  // 4. Reference Match (15 points bonus)
  const bankRef = (bankEntry.reference || '').toLowerCase()
  const bookRef = (bookEntry.reference || '').toLowerCase()

  if (bankRef && bookRef) {
    if (bankRef === bookRef || bankRef.includes(bookRef) || bookRef.includes(bankRef)) {
      score += 15
    }
  }

  return Math.min(score, 100)
}

function matchTransactions(bankData, bookData) {
  const results = []
  const matchedBankIndices = new Set()
  const matchedBookIndices = new Set()

  // First Pass: High confidence matches (score >= 70)
  bankData.forEach((bankEntry, bankIndex) => {
    if (matchedBankIndices.has(bankIndex)) return

    let bestMatch = null
    let bestScore = 0
    let bestBookIndex = -1

    bookData.forEach((bookEntry, bookIndex) => {
      if (matchedBookIndices.has(bookIndex)) return

      const score = calculateMatchScore(bankEntry, bookEntry)

      if (score > bestScore && score >= 70) {
        bestMatch = bookEntry
        bestScore = score
        bestBookIndex = bookIndex
      }
    })

    if (bestMatch) {
      results.push({
        id: `match_${bankIndex}_${bestBookIndex}`,
        inBank: true,
        inBooks: true,
        matchScore: bestScore,
        bankEntry,
        bookEntry: bestMatch,
      })
      matchedBankIndices.add(bankIndex)
      matchedBookIndices.add(bestBookIndex)
    }
  })

  // Second Pass: Unmatched bank entries
  bankData.forEach((bankEntry, bankIndex) => {
    if (!matchedBankIndices.has(bankIndex)) {
      results.push({
        id: `bank_only_${bankIndex}`,
        inBank: true,
        inBooks: false,
        matchScore: 0,
        bankEntry,
        bookEntry: null,
      })
    }
  })

  // Third Pass: Unmatched book entries
  bookData.forEach((bookEntry, bookIndex) => {
    if (!matchedBookIndices.has(bookIndex)) {
      results.push({
        id: `book_only_${bookIndex}`,
        inBank: false,
        inBooks: true,
        matchScore: 0,
        bankEntry: null,
        bookEntry,
      })
    }
  })

  return results.sort((a, b) => new Date(a.date) - new Date(b.date))
}
```

---

### 3. Database Schema Suggestions

**Table: bank_reconciliations**

```sql
CREATE TABLE bank_reconciliations (
  id VARCHAR(50) PRIMARY KEY,
  upload_id VARCHAR(50),
  bank_account_id VARCHAR(50),
  ledger_id VARCHAR(50),
  file_name VARCHAR(255),
  file_path VARCHAR(500),
  from_date DATE,
  to_date DATE,
  reconciled_by VARCHAR(50),
  reconciled_at TIMESTAMP,
  status VARCHAR(20),
  total_bank_transactions INT,
  total_book_entries INT,
  matched_count INT,
  unmatched_bank_count INT,
  unmatched_book_count INT,
  match_percentage DECIMAL(5,2),
  total_bank_amount DECIMAL(15,2),
  total_book_amount DECIMAL(15,2),
  difference_amount DECIMAL(15,2),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Table: reconciliation_results**

```sql
CREATE TABLE reconciliation_results (
  id VARCHAR(50) PRIMARY KEY,
  reconciliation_id VARCHAR(50),
  result_type VARCHAR(20), -- 'matched', 'unmatched_bank', 'unmatched_book'
  date DATE,
  amount DECIMAL(15,2),
  description TEXT,
  reference VARCHAR(100),
  match_score INT,
  bank_transaction_id VARCHAR(50),
  book_entry_id VARCHAR(50),
  bank_data JSON,
  book_data JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (reconciliation_id) REFERENCES bank_reconciliations(id)
);
```

**Table: bank_statement_uploads**

```sql
CREATE TABLE bank_statement_uploads (
  id VARCHAR(50) PRIMARY KEY,
  file_name VARCHAR(255),
  file_size BIGINT,
  file_path VARCHAR(500),
  file_type VARCHAR(20),
  bank_account_id VARCHAR(50),
  ledger_id VARCHAR(50),
  from_date DATE,
  to_date DATE,
  uploaded_by VARCHAR(50),
  uploaded_at TIMESTAMP,
  parsing_status VARCHAR(20),
  parsed_at TIMESTAMP,
  total_rows INT,
  parsed_rows INT,
  skipped_rows INT,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### 4. Performance Optimization Tips

1. **Batch Processing:**
   - Process large files in chunks (1000 transactions at a time)
   - Use background jobs for files > 5000 transactions
   - Implement progress tracking

2. **Database Indexing:**
   - Index on: reconciliation_id, date, bank_account_id, ledger_id
   - Composite index on (ledger_id, from_date, to_date) for book entries query

3. **Caching Strategy:**
   - Cache parsed bank data for 24 hours (Redis)
   - Cache book entries for same date range
   - Cache reconciliation history with pagination

4. **API Response Optimization:**
   - Implement pagination (default 50 records)
   - Use lazy loading for large datasets
   - Return summary first, then detailed results

---

### 5. Security Considerations

1. **File Upload Security:**
   - Validate file extension and MIME type
   - Scan for malware/viruses
   - Store files in secure location (not publicly accessible)
   - Implement file size limits

2. **Data Access Control:**
   - Verify user has access to selected bank account and ledger
   - Implement role-based access control (RBAC)
   - Log all reconciliation activities for audit

3. **API Security:**
   - Implement rate limiting (max 100 requests per hour per user)
   - Validate all input parameters
   - Sanitize file content to prevent CSV injection
   - Use HTTPS for all API calls

---

## Testing Scenarios

### Scenario 1: Perfect Reconciliation

- **Given:** 100 bank transactions, 100 book entries, all exact matches
- **Expected:** 100 matched, 0 unmatched, 100% match rate

### Scenario 2: Date Variance

- **Given:** Bank transaction on 05-May, Book entry on 07-May
- **Expected:** Matched with score 30 (date diff = 2 days)

### Scenario 3: Amount Tolerance

- **Given:** Bank ₹50,000, Book ₹50,050
- **Expected:** Matched with score 30 (within ₹100 tolerance)

### Scenario 4: Only in Bank

- **Given:** Bank transaction with no matching book entry
- **Expected:** Unmatched (Red), inBank=true, inBooks=false

### Scenario 5: Only in Books

- **Given:** Book entry with no matching bank transaction
- **Expected:** Unmatched (Yellow), inBank=false, inBooks=true

### Scenario 6: File Parsing Error

- **Given:** Excel file with no valid transactions
- **Expected:** Error code INVALID_FILE_STRUCTURE

### Scenario 7: Date Range Mismatch

- **Given:** File has April data, user selected May
- **Expected:** Error with actual file date range displayed

---

## Conclusion

This API specification document provides complete details for implementing the Bank Reconciliation process backend APIs. All endpoints, data structures, matching algorithms, business rules, and error handling are documented with examples.

**Key Implementation Priorities:**

1. Excel/CSV parsing with flexible column mapping
2. Intelligent matching algorithm with scoring system
3. Clear categorization of matched vs unmatched transactions
4. Comprehensive error handling and validation
5. Historical tracking and reporting capabilities

**Backend Developer Next Steps:**

1. Set up database schema
2. Implement file upload and parsing endpoints
3. Develop matching algorithm with scoring
4. Create reconciliation execution endpoint
5. Build history and reporting endpoints
6. Implement export functionality
7. Add comprehensive error handling
8. Write unit tests for matching algorithm
9. Performance testing with large datasets
10. Security review and implementation

---

**Document End**

For any clarifications or additional requirements, please contact the Product Team or Frontend Development Team.

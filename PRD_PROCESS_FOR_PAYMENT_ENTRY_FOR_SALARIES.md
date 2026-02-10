# Product Requirements Document (PRD)

## Process for Payment Entry for Salaries

---

## Objective

To ensure accurate and compliant monthly salary processing for all employees, including automatic GL posting with proper accounting treatment for earnings, deductions, and statutory contributions, while maintaining segregation of duties between Payroll Team and Account Executives with complete audit trail and voucher generation.

---

## Flow

### Step 1: Payroll Team - Upload Monthly Salary Batch

**Flow and User Action:**

**1] Login: Payroll Team**

1. **Access Salary Payment Entry Page**
   - Navigate to "Payment Entry for Salaries" module
   - Click on "Upload New Salary Batch" button

2. **Form Fields - Batch Information:**
   - **Payroll Period**: Dropdown (e.g., "Jan 2026", "Feb 2026")
     - Format: `{Month} {Year}`
     - Auto-populated with current month or selectable from list
   - **Month**: Auto-filled from Payroll Period selection
   - **Year**: Auto-filled from Payroll Period selection
   - **Excel File Upload**:
     - Accept file types: `.xlsx`, `.xls`
     - File size limit: 10 MB
     - File validation: System checks for required columns
   - **Assignment**: Dropdown - Select Account Executive for approval
     - Fetched from User Master (Role: Account Executive)
     - Round-robin or manual selection

3. **Excel File Structure Requirements:**

   **Mandatory Columns (Must be present):**
   - `EMPCODE` - Employee code (text/number)
   - `FULLNAME` - Employee full name (text)
   - `GROSS AMT` - Gross salary amount (number)
   - `NETPAYABLE` - Net payable amount (number)

   **Employee Master Data Columns (20+ fields):**
   - `MONTHATTENDANCEID` - Month attendance ID
   - `BRANCHNAME` - Branch name
   - `CLIENTGROUPCODE` - Client group code
   - `CLIENTGROUPNAME` - Client group name
   - `SITECODE` - Site code
   - `SITENAME` - Site name
   - `STATENAME` - State name (for PT, LWF calculations)
   - `EMPOLDCODE` - Old employee code
   - `EMPMASTERID` - Employee master ID
   - `DOJ` - Date of joining
   - `DOB` - Date of birth
   - `GENDERNAME` - Gender
   - `DUTYMASTERID` - Duty master ID
   - `DUTYNAME` - Duty name
   - `GROUPMASTERID` - Group master ID
   - `GROUP` - Group name
   - `DESIGNATIONMASTERID` - Designation master ID
   - `DESIGNATIONNAME` - Designation name

   **Attendance & Leave Columns:**
   - `NORMALDAYS` - Normal working days
   - `WEEKLYOFF` - Weekly off days
   - `OTHOURS` - Overtime hours
   - `SPLOTHOURS` - Special overtime hours
   - `PL_AVAILED` - Privilege leave availed
   - `CL_AVAILED` - Casual leave availed
   - `SL_AVAILED` - Sick leave availed
   - `SITEDIVISIONDAYS` - Site division days
   - `PL` - PL balance
   - `CL` - CL balance
   - `SL` - SL balance

   **Salary Components - Earnings (23 Columns):**
   - `BASIC` - Basic salary
   - `DA` - Dearness allowance
   - `HRA` - House rent allowance
   - `CONVEYANCE` - Conveyance allowance
   - `WASHING ALLOWANCE` - Washing allowance
   - `OTHER ALLOWANCE` - Other allowance
   - `LEAVE WITH WAGES` - Leave with wages
   - `CCA` - City compensatory allowance
   - `EDUCATIONAL ALLOWANCE` - Educational allowance
   - `MEDICAL ALLOWANCE` - Medical allowance
   - `OT AMOUNT` - Overtime amount
   - `SPL ALLOWANCE` - Special allowance
   - `REIMBURSEMENT` - Reimbursement
   - `BONUS` - Bonus
   - `MEAL` - Meal allowance
   - `SITE ALLOWANCE` - Site allowance
   - `CONY` - Cony allowance
   - `PERFORMANCE ALLOWANCE` - Performance allowance
   - `CASH RISK ALLOWANCE` - Cash risk allowance
   - `INCENTIVE` - Incentive
   - `FOOD` - Food allowance
   - `METRO CITY ALLOWANCE` - Metro city allowance
   - `STIPEND` - Stipend

   **Salary Components - Deductions (13 Columns):**
   - `PF` - Provident fund (employee contribution)
   - `ESIC` - ESIC (employee contribution)
   - `PT` - Professional tax
   - `LWF` - Labour welfare fund (employee)
   - `TDS` - Tax deducted at source
   - `ADVANCE` - Advance recovery
   - `UNIFORM` - Uniform deduction
   - `OTHER DEDUCTION` - Other deduction
   - `MESS DEDUCTION` - Mess deduction
   - `UNIFORM DEDUCTION` - Uniform deduction
   - `HRA DEDUCTION` - HRA deduction
   - `STAFF WELFARE FUND` - Staff welfare fund
   - `BACKGROUND VERIFICATION` - Background verification charges

   **Employer Contributions (3 Columns):**
   - `PF COMPANY` - Employer PF contribution (13.61%)
   - `ESIC COMPANY` - Employer ESIC contribution (3.25%)
   - `LWF COMPANY` - Employer LWF contribution

   **Calculated Totals:**
   - `GROSS AMT` - Total gross amount
   - `TOTALDEDUCTION` - Total deduction amount
   - `NETPAYABLE` - Net payable amount
   - `CTC` - Cost to company

   **Statutory Details:**
   - `PF WAGES` - PF calculation wages (capped at ₹15,000)
   - `ESI WAGES` - ESIC calculation wages (capped at ₹21,000)
   - `PF NO` - PF account number
   - `ESIC NO` - ESIC number
   - `UAN NO` - Universal account number
   - `AADHAR CARD` - Aadhar card number
   - `SALARY STATUS` - Salary processing status

   **Bank Details (10 Columns):**
   - `BANK NAME` - Bank name
   - `PAYMENTMODENAME` - Payment mode (Bank Transfer, Cash, Cheque)
   - `BANK NAME AS PER EMPLOYEE` - Bank name as per employee record
   - `BANK BRANCH NAME AS PER EMPLOYEE` - Branch name
   - `IFS CODE AS PER EMPLOYEE` - IFSC code
   - `BANK ACCOUNT NO AS PER EMPLOYEE` - Account number
   - `BANK NAME AS PER PAYMENT` - Bank name for payment
   - `BANK BRANCH NAME AS PER PAYMENT` - Branch for payment
   - `IFS CODE AS PER PAYMENT` - IFSC for payment
   - `BANK ACCOUNT NO AS PER PAYMENT` - Account for payment

   **Fixed Salary Structure (Master Values - 18 Columns):**
   - `FIXED_BASIC` - Fixed basic salary
   - `FIXED_DA` - Fixed DA
   - `FIXED_HRA` - Fixed HRA
   - `FIXED_CONVEYANCE` - Fixed conveyance
   - `FIXED_WASHING ALLOWANCE` - Fixed washing allowance
   - `FIXED_OTHER ALLOWANCE` - Fixed other allowance
   - `FIXED_LEAVE WITH WAGES` - Fixed leave with wages
   - `FIXED_CCA` - Fixed CCA
   - `FIXED_EDUCATIONAL ALLOWANCE` - Fixed educational allowance
   - `FIXED_MEDICAL ALLOWANCE` - Fixed medical allowance
   - `FIXED_SPL ALLOWANCE` - Fixed special allowance
   - `FIXED_BONUS` - Fixed bonus
   - `FIXED_MEAL` - Fixed meal
   - `FIXED_SITE ALLOWANCE` - Fixed site allowance
   - `FIXED_PERFORMANCE ALLOWANCE` - Fixed performance allowance
   - `FIXED_FOOD` - Fixed food
   - `FIXED_METRO CITY ALLOWANCE` - Fixed metro city allowance
   - `FIXED_STIPEND` - Fixed stipend
   - `FIXEDGROSS` - Fixed gross total

   **Provisions (3 Columns - for reference only):**
   - `LEAVE_PROVISION` - Leave encashment provision
   - `BONUS_PROVISION` - Bonus provision
   - `GRATUITY_PROVISION` - Gratuity provision

   **Bank Payment File Columns:**
   - `DEBIT BANK A/C NO` - Company debit account number
   - `DEBIT AMT` - Total debit amount

   **Total Excel Columns: 112+ columns**

4. **File Upload Process:**
   - Click "Browse" or drag-and-drop Excel file
   - System validates file format (.xlsx or .xls)
   - System validates file size (max 10 MB)
   - System reads and parses Excel data
   - System validates structure and mandatory columns

5. **Automatic Validations on Upload:**

   **Column Validation:**
   - Check all mandatory columns present (EMPCODE, FULLNAME, GROSS AMT, NETPAYABLE)
   - Alert if missing columns with error message

   **Data Type Validation:**
   - EMPCODE: Text/Number
   - All amount fields: Numeric values only
   - Date fields: Valid date format
   - Text fields: No special characters in critical fields

   **Business Rule Validation:**
   - No empty EMPCODE or FULLNAME
   - GROSS AMT must be positive number
   - NETPAYABLE must be positive number
   - NETPAYABLE should be less than GROSS AMT
   - All deduction amounts should be positive or zero
   - PF, ESIC calculations should match PF WAGES and ESI WAGES

   **Duplicate Check:**
   - Check for duplicate EMPCODE within same batch
   - Alert if duplicate found

6. **Batch Summary Calculation (Auto-calculated by system):**
   - **Employee Count**: Count of rows (employees) in Excel
   - **Total Gross Amount**: Sum of all `GROSS AMT`
   - **Total Deductions**: Sum of all `TOTALDEDUCTION`
   - **Net Payable**: Sum of all `NETPAYABLE`
   - **Total PF (Employee)**: Sum of all `PF`
   - **Total ESIC (Employee)**: Sum of all `ESIC`
   - **Total PT**: Sum of all `PT`
   - **Total TDS**: Sum of all `TDS`
   - **Total Advance Recovery**: Sum of all `ADVANCE`
   - **Total PF (Employer)**: Sum of all `PF COMPANY`
   - **Total ESIC (Employer)**: Sum of all `ESIC COMPANY`
   - **Total LWF (Employer)**: Sum of all `LWF COMPANY`

7. **Preview Screen After Upload:**
   - Display batch summary with calculated totals
   - Show first 10 employee rows in table format
   - Display validation results (success or errors)
   - Show file name and upload timestamp
   - Option to "Edit" or "Delete" if errors found
   - Option to "Download Excel" for offline verification

8. **Submission:**
   - Click "Submit Batch" button
   - System generates unique Batch ID: `BATCH_{timestamp}`
     - Example: `BATCH_1738742400000`
   - System assigns batch to selected Account Executive
   - Batch status set to: **"Pending Approval"**
   - System stores:
     - Batch metadata (ID, period, employee count, totals, status)
     - Complete employee details array (all 112 columns per employee)
     - Bank file summary
     - Uploader details (username, timestamp)
     - Assigned AE details
   - Success message displayed: "Salary batch uploaded successfully! Batch ID: BATCH_1738742400000. Assigned to: [AE Name]"
   - Option to "View My Submissions" or "Upload Another Batch"

9. **My Submissions Page:**
   - Payroll Team can view all their submitted batches
   - Table columns:
     - Batch ID (last 8 characters displayed)
     - Payroll Period
     - Employee Count
     - Total Amount
     - Bank Account (Debit A/C No)
     - Status (Badge: Pending/Approved/Rejected)
     - Submitted On (Date and time)
     - Actions (View Details button)

   **Filters Available:**
   - Status: All / Pending Approval / Approved / Rejected
   - Period: Text search (e.g., "Jan 2026")
   - Search: Search by Batch ID or period

   **Pagination:**
   - 10 entries per page
   - Previous / Next buttons

   **Status Badges:**
   - **Pending Approval**: Yellow badge
   - **Approved**: Green badge with voucher number
   - **Rejected**: Red badge with eye icon to view rejection reason

   **View Details Modal:**
   - Shows complete batch information
   - For rejected batches: Displays rejection reason
   - For approved batches: Displays voucher number and approval details

10. **Download Excel Feature:**
    - Click "Download" button on any batch row
    - System generates Excel file with all employee data
    - File name: `Salary_{Period}_BATCH_{ID}.xlsx`
    - Can be edited and re-uploaded (if status is Rejected)

11. **Re-upload Corrected Batch (Only for Rejected Batches):**
    - If batch is rejected, "Re-upload" button appears
    - Click "Re-upload" to upload corrected Excel file
    - System validates new file same as initial upload
    - Batch status changes from "Rejected" to "Pending Approval"
    - Rejection reason cleared
    - Reassigned to Account Executive (original or new)
    - History entry added: "Batch re-uploaded after correction"

---

### Step 2: Account Executive - Review and Approve/Reject Salary Batch

**Flow and User Action:**

**1] Login: Account Executive (AE)**

1. **Access Pending Approval Page**
   - Navigate to "Payment Entry for Salaries" module
   - Land on "Pending Approval" tab (default view)
   - See summary cards at top:
     - Total Pending Batches: [Count]
     - Total Employees: [Sum]
     - Total Amount: ₹[Sum]

2. **Pending Batches Table View:**

   **Table displays two tabs:**
   - **Month Lock Tab**: For salary payment entries (main workflow)
   - **Salary Tab**: For other salary-related operations

   **Table Columns (Month Lock Tab):**
   - Checkbox (for bulk selection)
   - Batch ID
   - Emp (Employee count)
   - Gross (Gross amount)
   - Ded (Total deductions)
   - Net (Net payable amount)
   - PF (PF employee)
   - ESIC (ESIC employee)
   - PT (Professional tax)
   - Period (Payroll period)
   - File (Download Excel icon)
   - Status (Pending Approval badge)
   - Actions (Approve, Reject, View JV buttons)

3. **Filters Available:**
   - **Status Filter**: Dropdown
     - All
     - Pending Approval (default)
     - Approved
     - Rejected
   - **Period Filter**: Dropdown
     - All
     - Jan 2026
     - Feb 2026
     - etc.
   - **Search**: Text input
     - Search by Batch ID, Period, or Employee name

4. **Batch Row Actions:**

   **Click on Batch Row to Expand:**
   - Shows complete employee list in nested table
   - Employee columns:
     - Emp Code
     - Full Name
     - Designation
     - Basic
     - DA
     - HRA
     - Gross Amount
     - PF
     - ESIC
     - PT
     - TDS
     - Total Deduction
     - Net Payable
     - Bank Account
     - IFSC Code

   **Action Buttons on Each Batch:**

   a) **Edit Net Payable Amount:**
   - Click "Edit" icon next to Net amount
   - Input field appears with current amount
   - Enter new net payable amount
   - Click "Save" (✓) or "Cancel" (✗)
   - **On Save:**
     - System calculates adjustment factor: `newAmount / oldAmount`
     - System recalculates all employee NETPAYABLE proportionally:
       - `employee.NETPAYABLE = employee.NETPAYABLE × adjustmentFactor`
     - System rounds to 2 decimal places
     - Batch totalAmount updated
     - Success message: "Net payable updated. Employee amounts recalculated."

   b) **Download Excel:**
   - Click "Download" icon
   - System exports batch data to Excel
   - File downloaded: `Salary_{Period}_BATCH_{ID}.xlsx`
   - Can be used for offline verification

   c) **Delete Batch:**
   - Click "Delete" icon (trash icon)
   - Confirmation modal appears: "Are you sure you want to delete this batch?"
   - Click "Confirm" to delete
   - Batch removed from list
   - Audit log entry created
   - Only allowed if status is "Pending Approval"

5. **Bulk Selection and Bulk Approve:**

   **Select Multiple Batches:**
   - Check individual batch checkboxes
   - Or click "Select All" checkbox in table header (selects all on current page)
   - Selected batches highlighted
   - Counter shows: "3 batches selected"

   **Bulk Approve Button:**
   - Appears when 1+ batches selected
   - Click "Bulk Approve" button
   - System validates all selected batches
   - System generates GL entries for each batch
   - **GL Mapping Modal appears** showing consolidated GL summary:
     - Total batches: 3
     - Total employees: 1,250
     - Total debit: ₹117,500,000
     - Total credit: ₹117,500,000
     - GL entries preview table with account names and amounts
   - Modal actions:
     - "Approve All" button: Confirms bulk approval
     - "Cancel" button: Closes modal without action

   **On Bulk Approve Confirmation:**
   - System creates separate transaction for each batch
   - Each batch gets unique voucher number
   - All batch statuses updated to "Approved"
   - Success toast: "3 batches approved successfully. GL vouchers posted."
   - Summary modal displays:
     - Batch IDs with voucher numbers
     - Total employees: 1,250
     - Total amount: ₹117,500,000

6. **Single Batch Approval (Main Workflow):**

   **Click "Approve" Button on Batch Row:**

   **Step 6.1: System Generates GL Entries**

   **Employee-Level to GL-Level Aggregation:**
   - System processes each employee in batch
   - For each employee:
     - Loop through all 38 salary head fields
     - Skip fields in EXCLUDED_FIELDS list (80+ fields like EMPCODE, DOJ, bank details, fixed values, provisions, etc.)
     - Skip fields not in GL_MAPPING configuration
     - Skip if amount is zero
     - Get GL mapping for each salary head:
       - `{ debit: {account, code}, credit: {account, code}, category }`
     - Create debit entry: `{ glCode, accountName, amount, type: "Debit", salaryHead, category }`
     - Create credit entry: `{ glCode, accountName, amount, type: "Credit", salaryHead, category }`
     - **Aggregate by key**: `${glCode}-${type}` (keeps debits and credits separate)
     - Accumulate amounts in Map

   **Aggregation Example:**

   ```
   Employee 1: BASIC = ₹25,000 → Dr X2001001001
   Employee 2: BASIC = ₹28,000 → Dr X2001001001
   Employee 3: BASIC = ₹30,000 → Dr X2001001001
   ...
   Employee 450: BASIC = ₹27,000 → Dr X2001001001
   ───────────────────────────────────────────
   Aggregated: Dr X2001001001 = ₹11,250,000 (sum of all BASIC)
   ```

   **Result:**
   - Input: 450 employees × 38 salary heads = 17,100 raw entries
   - Output: ~40-50 consolidated GL entries
   - Reduction: 99.7% fewer entries (17,100 → 42)

   **GL Entries Structure:**
   - `debitEntries[]`: Array of debit GL entries
   - `creditEntries[]`: Array of credit GL entries
   - `summary`: Object with totals and validation
     - `totalDebit`: Sum of all debit amounts
     - `totalCredit`: Sum of all credit amounts
     - `difference`: `totalDebit - totalCredit`
     - `isBalanced`: `Math.abs(difference) < 0.01` (1 paisa tolerance)
     - `employeeCount`: Number of employees processed

   **Step 6.2: Validate GL Entries**

   **Validation Checks:**
   - ✅ Check `debitEntries.length > 0`
   - ✅ Check `creditEntries.length > 0`
   - ✅ Check `summary.isBalanced === true`
   - ✅ Check no negative amounts in debit entries
   - ✅ Check no negative amounts in credit entries
   - ✅ Check `Math.abs(totalDebit - totalCredit) < 0.01`

   **If Validation Fails:**
   - Show error modal: "GL entries are not balanced. Cannot approve batch."
   - Display error details:
     - Total Debit: ₹50,613,500
     - Total Credit: ₹50,613,450
     - Difference: ₹50
     - Error: "GL not balanced"
   - Approval blocked
   - AE must review salary data for errors

   **If Validation Passes:**
   - Proceed to Step 6.3

   **Step 6.3: Generate Voucher Number**

   **Voucher Number Format:** `JVF00/{5digitTimestamp}/{YYMM}`

   **Generation Logic:**

   ```
   timestamp = Last 5 digits of Date.now()
   yy = Last 2 digits of current year
   mm = Current month (01-12, padded)
   voucherNo = JVF00/{timestamp}/{yymm}
   ```

   **Examples:**
   - Generated on Feb 5, 2026: `JVF00/42500/2602`
   - Generated on Jan 28, 2026: `JVF00/40000/2601`

   **Prefix Explanation:**
   - **JVF00**: Journal Voucher Format 00 (Salary specific)
   - **42500**: Unique identifier (last 5 digits of timestamp)
   - **2602**: Year 26 (2026), Month 02 (February)

   **Step 6.4: Create Transaction Object**

   **Transaction Structure:**

   ```json
   {
     "id": "TXN_SALARY_{timestamp}",
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
         "narration": "Salary for Jan 2026 - Earnings",
         "category": "Earnings"
       }
       // ... all GL entries (debits first, then credits)
     ],
     "totalDebit": 48001950,
     "totalCredit": 48001950,
     "narration": "Salary payment for Jan 2026 - 450 employees",
     "status": "Posted",
     "postedDate": "2026-02-05T11:45:00Z",
     "approvedBy": "AE User Full Name",
     "createdBy": "System",
     "createdAt": "2026-02-05T11:45:00Z"
   }
   ```

   **Step 6.5: Post Transaction to Database**
   - Save transaction to `transactions` table in database
   - Each entry saved to `transaction_entries` table
   - Transaction ID linked to Batch ID

   **Step 6.6: Update Batch Status**
   - Batch status changed from "Pending Approval" to **"Approved"**
   - Fields updated:
     - `status`: "Approved"
     - `approvedBy`: AE username
     - `approvedAt`: Current timestamp
     - `voucherNo`: Generated voucher number

   **Step 6.7: Add History Entry**
   - History entry added to batch:

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

   **Step 6.8: Display Journal Voucher Modal**
   - **Salary JV Modal** automatically opens
   - Modal displays complete journal voucher

   **Modal Content:**

   **Header Section:**
   - Company Name: **I SMART FACTECH PRIVATE LIMITED**
   - Address: 317, 3RD FLOOR, J/2, NILGIRI MANDLA TRUCK TERMINAL, MUMBAI - 400037
   - GST No: 27AACCD4328112E
   - GST State: Maharashtra (27)

   **Voucher Details:**
   - Voucher Title: **JOURNAL VOUCHER**
   - Voucher No: JVF00/42500/2602
   - Voucher Date: 05-Feb-2026
   - Batch ID: BATCH_1738742400000
   - Pay Period: Jan 2026
   - Reference: Salary Payment

   **GL Entries Table:**
   | S.No | Account Name | GL Code | Debit (₹) | Credit (₹) |
   |------|-------------|---------|-----------|------------|
   | 1 | SALARIES & WAGES | X2001001001 | 45,000,000 | - |
   | 2 | EMPLOYER PF CONTRIBUTION | X2001001002 | 1,530,450 | - |
   | 3 | EMPLOYER ESIC CONTRIBUTION | X2001001003 | 1,462,500 | - |
   | 4 | EMPLOYER LWF CONTRIBUTION | X2001001004 | 9,000 | - |
   | 5 | SALARY PAYABLE | L2002001 | - | 45,000,000 |
   | 6 | Employee PF Payable | L2002006 | - | 1,350,000 |
   | 7 | Employee ESIC Payable | L2002007 | - | 337,500 |
   | 8 | Professional Tax Payable | L2002009 | - | 90,000 |
   | 9 | TDS Payable | L2002011 | - | 900,000 |
   | 10 | Employer PF Payable | L2002002 | - | 1,530,450 |
   | 11 | Employer ESIC Payable | L2002003 | - | 1,462,500 |
   | 12 | LWF PAYABLE - EMPLOYER SHARE | L2002004 | - | 9,000 |
   | 13 | Employee Advances | A2001 | - | 225,000 |
   | **TOTALS** | | | **48,001,950** | **48,001,950** |

   **Narration:**
   - "Salary payment for Jan 2026 - 450 employees"

   **Amount in Words:**
   - RUPEES FOUR CRORE EIGHTY LAKH ONE THOUSAND NINE HUNDRED FIFTY ONLY

   **Approval Signatures Section:**
   - Prepared By: System
   - Checked By: Pending
   - Authorised By: AE User Name
   - Date: 05-Feb-2026

   **Footer:**
   - "This is a computer-generated document. No signature is required."

   **Modal Actions:**
   - **Download Button**: Downloads voucher as PDF or prints
   - **Close Button**: Closes modal

   **Step 6.9: Success Notification**
   - Green toast notification appears:
   - "✅ Batch approved successfully! Voucher No: JVF00/42500/2602 posted."
   - Batch row updates in table with green "Approved" badge
   - Voucher number displayed in batch row

7. **Rejection Workflow:**

   **Click "Reject" Button on Batch Row:**

   **Step 7.1: Rejection Modal Opens**
   - Modal title: "Reject Entry"
   - Text area input: "Enter rejection reason"
   - Minimum characters: 10
   - Placeholder: "Please provide detailed reason for rejection..."

   **Step 7.2: Enter Rejection Reason**
   - AE types detailed rejection reason
   - Example: "PF calculations incorrect for employees EMP1025, EMP1130, EMP1245. Please recheck PF WAGES and PF amount. Also verify ESIC calculations for Mumbai employees."

   **Step 7.3: Validation**
   - System checks rejection reason not empty
   - System checks minimum 10 characters
   - If validation fails: Error message "Rejection reason must be at least 10 characters"

   **Step 7.4: Confirm Rejection**
   - Click "Confirm Reject" button (red button)
   - Or "Cancel" to close modal without action

   **On Confirm:**
   - Batch status changed to **"Rejected"**
   - Fields updated:
     - `status`: "Rejected"
     - `rejectedBy`: AE username
     - `rejectedAt`: Current timestamp
     - `rejectionReason`: Entered text
   - History entry added:

   ```json
   {
     "action": "Rejected",
     "performedBy": "AE User Name",
     "timestamp": "2026-02-05T11:20:00Z",
     "details": {
       "rejectionReason": "PF calculations incorrect for employees EMP1025, EMP1130..."
     }
   }
   ```

   - Notification sent to Payroll Team user (original submitter)
   - Red toast notification: "❌ Batch rejected. Payroll team notified."
   - Batch status in table shows red "Rejected" badge

8. **View Journal Voucher (For Approved Batches):**

   **Click "View JV" Button on Approved Batch Row:**
   - System retrieves transaction from database using batch ID
   - System retrieves posted GL entries
   - **Salary JV Modal** opens (same as Step 6.8)
   - Displays complete journal voucher with all details
   - Shows voucher number, date, GL entries, totals, approvals
   - Can be downloaded or printed

9. **Download Batch Excel:**
   - Click "Download" icon on any batch row
   - System generates Excel file from stored employee details
   - File name: `Salary_{Period}_BATCH_{ID}.xlsx`
   - Excel contains all 112 columns for all employees
   - Can be used for offline review or corrections

10. **Pagination:**
    - Shows 10 batches per page
    - Previous / Next buttons
    - Page numbers displayed
    - Current page highlighted

---

### Step 3: System - Automatic GL Posting (Backend Process)

**Automatic Processing on Batch Approval:**

**1] Complete GL Mapping Configuration (38 Salary Heads)**

**Category 1: Earnings (23 Heads)**
**Accounting Treatment:** Dr Salaries & Wages | Cr Salary Payable

| Salary Head           | Debit Account    | Debit GL Code | Credit Account | Credit GL Code | Category |
| --------------------- | ---------------- | ------------- | -------------- | -------------- | -------- |
| BASIC                 | SALARIES & WAGES | X2001001001   | SALARY PAYABLE | L2002001       | Earnings |
| DA                    | SALARIES & WAGES | X2001001001   | SALARY PAYABLE | L2002001       | Earnings |
| HRA                   | SALARIES & WAGES | X2001001001   | SALARY PAYABLE | L2002001       | Earnings |
| CONVEYANCE            | SALARIES & WAGES | X2001001001   | SALARY PAYABLE | L2002001       | Earnings |
| WASHING ALLOWANCE     | SALARIES & WAGES | X2001001001   | SALARY PAYABLE | L2002001       | Earnings |
| OTHER ALLOWANCE       | SALARIES & WAGES | X2001001001   | SALARY PAYABLE | L2002001       | Earnings |
| LEAVE WITH WAGES      | LEAVE WAGES      | X2001001005   | SALARY PAYABLE | L2002001       | Earnings |
| CCA                   | SALARIES & WAGES | X2001001001   | SALARY PAYABLE | L2002001       | Earnings |
| EDUCATIONAL ALLOWANCE | SALARIES & WAGES | X2001001001   | SALARY PAYABLE | L2002001       | Earnings |
| MEDICAL ALLOWANCE     | SALARIES & WAGES | X2001001001   | SALARY PAYABLE | L2002001       | Earnings |
| OT AMOUNT             | SALARIES & WAGES | X2001001001   | SALARY PAYABLE | L2002001       | Earnings |
| SPL ALLOWANCE         | SALARIES & WAGES | X2001001001   | SALARY PAYABLE | L2002001       | Earnings |
| REIMBURSEMENT         | SALARIES & WAGES | X2001001001   | SALARY PAYABLE | L2002001       | Earnings |
| BONUS                 | BONUS            | X2001001007   | SALARY PAYABLE | L2002001       | Earnings |
| MEAL                  | SALARIES & WAGES | X2001001001   | SALARY PAYABLE | L2002001       | Earnings |
| SITE ALLOWANCE        | SALARIES & WAGES | X2001001001   | SALARY PAYABLE | L2002001       | Earnings |
| CONY                  | SALARIES & WAGES | X2001001001   | SALARY PAYABLE | L2002001       | Earnings |
| PERFORMANCE ALLOWANCE | SALARIES & WAGES | X2001001001   | SALARY PAYABLE | L2002001       | Earnings |
| CASH RISK ALLOWANCE   | SALARIES & WAGES | X2001001001   | SALARY PAYABLE | L2002001       | Earnings |
| INCENTIVE             | SALARIES & WAGES | X2001001001   | SALARY PAYABLE | L2002001       | Earnings |
| FOOD                  | SALARIES & WAGES | X2001001001   | SALARY PAYABLE | L2002001       | Earnings |
| METRO CITY ALLOWANCE  | SALARIES & WAGES | X2001001001   | SALARY PAYABLE | L2002001       | Earnings |
| STIPEND               | SALARIES & WAGES | X2001001001   | SALARY PAYABLE | L2002001       | Earnings |

**Category 2: Employee Deductions (13 Heads)**
**Accounting Treatment:** Dr Salaries & Wages | Cr Specific Payable Account

| Salary Head             | Debit Account    | Debit GL Code | Credit Account             | Credit GL Code | Category           |
| ----------------------- | ---------------- | ------------- | -------------------------- | -------------- | ------------------ |
| PF                      | SALARIES & WAGES | X2001001001   | Employee PF Payable        | L2002006       | Employee Deduction |
| ESIC                    | SALARIES & WAGES | X2001001001   | Employee ESIC Payable      | L2002007       | Employee Deduction |
| PT                      | SALARIES & WAGES | X2001001001   | Professional Tax Payable   | L2002009       | Employee Deduction |
| LWF                     | SALARIES & WAGES | X2001001001   | Employee LWF Payable       | L2002008       | Employee Deduction |
| TDS                     | SALARIES & WAGES | X2001001001   | TDS Payable                | L2002011       | Employee Deduction |
| ADVANCE                 | SALARIES & WAGES | X2001001001   | Employee Advances (Asset)  | A2001          | Employee Deduction |
| UNIFORM                 | SALARIES & WAGES | X2001001001   | Other Deductions Payable   | L2002012       | Employee Deduction |
| OTHER DEDUCTION         | SALARIES & WAGES | X2001001001   | Other Deductions Payable   | L2002012       | Employee Deduction |
| MESS DEDUCTION          | SALARIES & WAGES | X2001001001   | Other Deductions Payable   | L2002012       | Employee Deduction |
| UNIFORM DEDUCTION       | SALARIES & WAGES | X2001001001   | Other Deductions Payable   | L2002012       | Employee Deduction |
| HRA DEDUCTION           | SALARIES & WAGES | X2001001001   | Other Deductions Payable   | L2002012       | Employee Deduction |
| STAFF WELFARE FUND      | SALARIES & WAGES | X2001001001   | Staff Welfare Fund Payable | L2002010       | Employee Deduction |
| BACKGROUND VERIFICATION | SALARIES & WAGES | X2001001001   | Other Deductions Payable   | L2002012       | Employee Deduction |

**Category 3: Employer Contributions (3 Heads)**
**Accounting Treatment:** Dr Employer Expense | Cr Employer Payable

| Salary Head  | Debit Account              | Debit GL Code | Credit Account               | Credit GL Code | Category              |
| ------------ | -------------------------- | ------------- | ---------------------------- | -------------- | --------------------- |
| PF COMPANY   | EMPLOYER PF CONTRIBUTION   | X2001001002   | Employer PF Payable          | L2002002       | Employer Contribution |
| ESIC COMPANY | EMPLOYER ESIC CONTRIBUTION | X2001001003   | Employer ESIC Payable        | L2002003       | Employer Contribution |
| LWF COMPANY  | EMPLOYER LWF CONTRIBUTION  | X2001001004   | LWF PAYABLE - EMPLOYER SHARE | L2002004       | Employer Contribution |

**2] GL Account Master Reference**

**Parent GL Codes:**

**Expense Accounts (Debit Side):**

- **X2001001**: PERSONNEL COST (Parent)
  - **X2001001001**: SALARIES & WAGES (Child)
  - **X2001001002**: EMPLOYER PF CONTRIBUTION (Child)
  - **X2001001003**: EMPLOYER ESIC CONTRIBUTION (Child)
  - **X2001001004**: EMPLOYER LWF CONTRIBUTION (Child)
  - **X2001001005**: LEAVE WAGES (Child)
  - **X2001001007**: BONUS (Child)

**Liability Accounts (Credit Side):**

- **L2002**: SALARY & STATUTORY PAYABLES (Parent)
  - **L2002001**: SALARY PAYABLE (Child)
  - **L2002002**: Employer PF Payable (Child)
  - **L2002003**: Employer ESIC Payable (Child)
  - **L2002004**: LWF PAYABLE - EMPLOYER SHARE (Child)
  - **L2002006**: Employee PF Payable (Child)
  - **L2002007**: Employee ESIC Payable (Child)
  - **L2002008**: Employee LWF Payable (Child)
  - **L2002009**: Professional Tax Payable (Child)
  - **L2002010**: Staff Welfare Fund Payable (Child)
  - **L2002011**: TDS Payable (Child)
  - **L2002012**: Other Deductions Payable (Child)

**Asset Account:**

- **A2001**: Employee Advances (for advance recovery)

**3] Excluded Fields (80+ Fields - No GL Posting)**

These fields are present in Excel but **NOT processed** for GL posting:

**Employee Master Data (20+ fields):**

- MONTHATTENDANCEID, EMPMASTERID, EMPCODE, EMPOLDCODE
- FULLNAME, DOJ, DOB, GENDERNAME
- DESIGNATIONMASTERID, DESIGNATIONNAME
- DUTYMASTERID, DUTYNAME
- GROUPMASTERID, GROUP
- BRANCHNAME, SITECODE, SITENAME, STATENAME
- CLIENTGROUPCODE, CLIENTGROUPNAME

**Fixed Salary Structure (18 fields):**

- All FIXED\_\* fields (FIXED_BASIC, FIXED_DA, FIXED_HRA, etc.)
- FIXEDGROSS

**Bank Details (10 fields):**

- BANK NAME, BANK NAME AS PER EMPLOYEE, BANK NAME AS PER PAYMENT
- BANK BRANCH NAME AS PER EMPLOYEE, BANK BRANCH NAME AS PER PAYMENT
- IFS CODE AS PER EMPLOYEE, IFS CODE AS PER PAYMENT
- BANK ACCOUNT NO AS PER EMPLOYEE, BANK ACCOUNT NO AS PER PAYMENT
- PAYMENTMODENAME

**Attendance & Leave (11 fields):**

- NORMALDAYS, WEEKLYOFF, OTHOURS, SPLOTHOURS
- PL_AVAILED, CL_AVAILED, SL_AVAILED
- SITEDIVISIONDAYS, PL, CL, SL

**Statutory IDs (5 fields):**

- PF NO, ESIC NO, UAN NO, AADHAR CARD, SALARY STATUS

**Calculated Totals (5 fields):**

- PF WAGES, ESI WAGES
- GROSS AMT, TOTALDEDUCTION, NETPAYABLE, CTC

**Provisions (3 fields - separate process):**

- LEAVE_PROVISION, BONUS_PROVISION, GRATUITY_PROVISION

**Bank File Metadata (2 fields):**

- DEBIT BANK A/C NO, DEBIT AMT

**Total Excluded:** 80+ fields

**4] Aggregation Logic (Employee-Level → GL-Level)**

**Input:** 450 employees × 38 salary heads = 17,100 individual line items

**Processing Algorithm:**

```
Initialize:
  debitMap = new Map()
  creditMap = new Map()

For each employee in batch:
  For each field in employee object:

    // Skip excluded fields
    If field in EXCLUDED_FIELDS:
      Continue to next field

    // Skip if not in GL mapping
    If field not in GL_MAPPING:
      Continue to next field

    // Skip zero amounts
    amount = employee[field]
    If amount === 0:
      Continue to next field

    // Get GL mapping
    mapping = GL_MAPPING[field]

    // Create debit entry
    debitKey = mapping.debit.code + "-Debit"
    If debitMap.has(debitKey):
      debitMap.get(debitKey).amount += amount
    Else:
      debitMap.set(debitKey, {
        glCode: mapping.debit.code,
        accountName: mapping.debit.account,
        amount: amount,
        type: "Debit",
        category: mapping.category
      })

    // Create credit entry
    creditKey = mapping.credit.code + "-Credit"
    If creditMap.has(creditKey):
      creditMap.get(creditKey).amount += amount
    Else:
      creditMap.set(creditKey, {
        glCode: mapping.credit.code,
        accountName: mapping.credit.account,
        amount: amount,
        type: "Credit",
        category: mapping.category
      })

// Convert Maps to arrays
debitEntries = Array.from(debitMap.values())
creditEntries = Array.from(creditMap.values())

// Calculate summary
totalDebit = sum(debitEntries.map(e => e.amount))
totalCredit = sum(creditEntries.map(e => e.amount))
difference = totalDebit - totalCredit
isBalanced = Math.abs(difference) < 0.01
```

**Output:** ~40-50 consolidated GL entries

**Aggregation Example:**

```
Employee 1: BASIC = ₹25,000 → Dr X2001001001
Employee 2: BASIC = ₹28,000 → Dr X2001001001
Employee 3: BASIC = ₹30,000 → Dr X2001001001
...
Employee 450: BASIC = ₹27,000 → Dr X2001001001
───────────────────────────────────────────
Aggregated GL Entry:
Dr X2001001001 (SALARIES & WAGES) = ₹11,250,000
```

**5] Sample Complete GL Posting**

**Scenario:** Jan 2026 Salary - 450 Employees

**Batch Summary:**

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

**Generated Journal Voucher: JVF00/42500/2602**
**Date:** 05-Feb-2026

**GL ENTRIES:**

**DEBIT ENTRIES:**
| Line | Account Name | GL Code | Amount (₹) | Narration |
|------|-------------|---------|-----------|-----------|
| 1 | SALARIES & WAGES | X2001001001 | 45,000,000 | Gross salary + deductions for 450 employees |
| 2 | EMPLOYER PF CONTRIBUTION | X2001001002 | 1,530,450 | Employer PF 13.61% |
| 3 | EMPLOYER ESIC CONTRIBUTION | X2001001003 | 1,462,500 | Employer ESIC 3.25% |
| 4 | EMPLOYER LWF CONTRIBUTION | X2001001004 | 9,000 | Employer LWF |

**CREDIT ENTRIES:**
| Line | Account Name | GL Code | Amount (₹) | Narration |
|------|-------------|---------|-----------|-----------|
| 5 | SALARY PAYABLE | L2002001 | 45,000,000 | Gross salary payable (consolidated) |
| 6 | Employee PF Payable | L2002006 | 1,350,000 | Employee PF 12% |
| 7 | Employee ESIC Payable | L2002007 | 337,500 | Employee ESIC 0.75% |
| 8 | Professional Tax Payable | L2002009 | 90,000 | PT deduction |
| 9 | TDS Payable | L2002011 | 900,000 | TDS deduction |
| 10 | Employer PF Payable | L2002002 | 1,530,450 | Employer PF payable |
| 11 | Employer ESIC Payable | L2002003 | 1,462,500 | Employer ESIC payable |
| 12 | LWF PAYABLE - EMPLOYER SHARE | L2002004 | 9,000 | Employer LWF payable |
| 13 | Employee Advances (Asset) | A2001 | 225,000 | Advance recovery (reduces asset) |

**TOTALS:**

- **Total Debit:** ₹48,001,950
- **Total Credit:** ₹48,001,950
- **Balance:** ✅ Balanced

**Narration:** "Salary payment for Jan 2026 - 450 employees"

**6] Accounting Logic Explanation**

**Earnings (BASIC, DA, HRA, etc.):**

```
Dr X2001001001 (SALARIES & WAGES) - Expense increases
Cr L2002001 (SALARY PAYABLE) - Liability increases
```

**Employee Deductions (PF, ESIC, PT, TDS):**

```
Dr X2001001001 (SALARIES & WAGES) - Expense increases (still part of salary cost)
Cr L2002006/07/09/11 (Specific Payables) - Liabilities increase
```

**Note:** Deductions are ALSO debited to Salaries & Wages because they represent salary cost to the company. The credits go to different liability accounts based on deduction type.

**Employer Contributions (PF, ESIC, LWF - Company Share):**

```
Dr X2001001002/003/004 (Employer Contribution Expense) - Additional expense
Cr L2002002/003/004 (Employer Payables) - Liabilities increase
```

**Note:** Employer contributions are separate expenses beyond employee salary and need distinct expense GL codes for P&L tracking.

**Net Impact on Financial Statements:**

**Profit & Loss (Expense Side):**

- Salaries & Wages: ₹45,000,000
- Employer PF Contribution: ₹1,530,450
- Employer ESIC Contribution: ₹1,462,500
- Employer LWF Contribution: ₹9,000
- **Total Salary Cost:** ₹48,001,950

**Balance Sheet (Liability Side):**

- Salary Payable: ₹45,000,000 (will be paid to employees)
- Employee PF Payable: ₹1,350,000 (will be paid to EPFO)
- Employee ESIC Payable: ₹337,500 (will be paid to ESIC)
- PT Payable: ₹90,000 (will be paid to state govt)
- TDS Payable: ₹900,000 (will be paid to Income Tax dept)
- Employer PF Payable: ₹1,530,450 (will be paid to EPFO)
- Employer ESIC Payable: ₹1,462,500 (will be paid to ESIC)
- Employer LWF Payable: ₹9,000 (will be paid to state govt)

**Balance Sheet (Asset Side - Reduction):**

- Employee Advances: -₹225,000 (advance recovered from salary, asset decreases)

**Net Payable to Employees:**

```
Gross Salary: ₹45,000,000
Less: Deductions: ₹2,500,000
Net Payable: ₹42,500,000
```

**7] Statutory Calculation Rules**

**PF (Provident Fund):**

```
PF Wages = min(BASIC + DA, ₹15,000) [capped at ₹15,000]
Employee PF = PF Wages × 12% = PF Wages × 0.12
Employer PF = PF Wages × 13.61% = PF Wages × 0.1361
  (12% contribution + 1.61% admin charges)
```

**ESIC (Employee State Insurance):**

```
ESI Wages = min(BASIC + DA + HRA + allowances, ₹21,000) [capped at ₹21,000]
Employee ESIC = ESI Wages × 0.75% = ESI Wages × 0.0075
Employer ESIC = ESI Wages × 3.25% = ESI Wages × 0.0325
```

**Professional Tax (State-specific):**

- Maharashtra: ₹200/month
- Karnataka: ₹200/month
- Gujarat: ₹0 (no PT)
- Delhi: ₹0 (no PT)
- Tamil Nadu: ₹0-₹2,500 (slab-based)

**Labour Welfare Fund (State-specific):**

- Maharashtra:
  - Employee: ₹6/month
  - Employer: ₹20/month
- Karnataka: No LWF
- Gujarat:
  - Employee: ₹6/month
  - Employer: ₹20/month
- Kerala:
  - Employee: ₹10/month
  - Employer: ₹20/month

---

## GL Entries Summary

**Main Voucher Type:** Journal Voucher (JV)
**Voucher Series:** JVF00 (Journal Voucher Format 00 - Salary)
**Voucher Numbering:** `JVF00/{5digitTimestamp}/{YYMM}`

**Debit Accounts (Expense):**

1. **X2001001001** - SALARIES & WAGES
   - Parent GL: X2001001 - PERSONNEL COST
   - Used for: All 23 earnings + 13 employee deductions
   - Amount: Sum of gross salary

2. **X2001001002** - EMPLOYER PF CONTRIBUTION
   - Parent GL: X2001001 - PERSONNEL COST
   - Used for: PF COMPANY (employer's 13.61%)
   - Amount: Sum of employer PF

3. **X2001001003** - EMPLOYER ESIC CONTRIBUTION
   - Parent GL: X2001001 - PERSONNEL COST
   - Used for: ESIC COMPANY (employer's 3.25%)
   - Amount: Sum of employer ESIC

4. **X2001001004** - EMPLOYER LWF CONTRIBUTION
   - Parent GL: X2001001 - PERSONNEL COST
   - Used for: LWF COMPANY (employer's share)
   - Amount: Sum of employer LWF

5. **X2001001005** - LEAVE WAGES
   - Parent GL: X2001001 - PERSONNEL COST
   - Used for: LEAVE WITH WAGES component
   - Amount: Sum of leave wages (if any)

6. **X2001001007** - BONUS
   - Parent GL: X2001001 - PERSONNEL COST
   - Used for: BONUS component
   - Amount: Sum of bonus paid (if any)

**Credit Accounts (Liability):**

1. **L2002001** - SALARY PAYABLE
   - Parent GL: L2002 - SALARY & STATUTORY PAYABLES
   - Used for: Gross salary (all 23 earnings consolidated)
   - Amount: Sum of gross amounts

2. **L2002002** - Employer PF Payable
   - Parent GL: L2002 - SALARY & STATUTORY PAYABLES
   - Used for: Employer PF contribution payable
   - Amount: Sum of PF COMPANY

3. **L2002003** - Employer ESIC Payable
   - Parent GL: L2002 - SALARY & STATUTORY PAYABLES
   - Used for: Employer ESIC contribution payable
   - Amount: Sum of ESIC COMPANY

4. **L2002004** - LWF PAYABLE - EMPLOYER SHARE
   - Parent GL: L2002 - SALARY & STATUTORY PAYABLES
   - Used for: Employer LWF payable
   - Amount: Sum of LWF COMPANY

5. **L2002006** - Employee PF Payable
   - Parent GL: L2002 - SALARY & STATUTORY PAYABLES
   - Used for: Employee PF deduction
   - Amount: Sum of PF (employee)

6. **L2002007** - Employee ESIC Payable
   - Parent GL: L2002 - SALARY & STATUTORY PAYABLES
   - Used for: Employee ESIC deduction
   - Amount: Sum of ESIC (employee)

7. **L2002008** - Employee LWF Payable
   - Parent GL: L2002 - SALARY & STATUTORY PAYABLES
   - Used for: Employee LWF deduction
   - Amount: Sum of LWF (employee)

8. **L2002009** - Professional Tax Payable
   - Parent GL: L2002 - SALARY & STATUTORY PAYABLES
   - Used for: PT deduction
   - Amount: Sum of PT

9. **L2002010** - Staff Welfare Fund Payable
   - Parent GL: L2002 - SALARY & STATUTORY PAYABLES
   - Used for: Staff welfare fund deduction
   - Amount: Sum of STAFF WELFARE FUND

10. **L2002011** - TDS Payable
    - Parent GL: L2002 - SALARY & STATUTORY PAYABLES
    - Used for: TDS deduction
    - Amount: Sum of TDS

11. **L2002012** - Other Deductions Payable
    - Parent GL: L2002 - SALARY & STATUTORY PAYABLES
    - Used for: UNIFORM, OTHER DEDUCTION, MESS DEDUCTION, etc.
    - Amount: Sum of all other deductions

**Credit Account (Asset - Reduction):** 12. **A2001** - Employee Advances - Parent GL: A2 - CURRENT ASSETS - Used for: ADVANCE recovery (reduces asset) - Amount: Sum of ADVANCE

**After this, Further Process:**

- Salary payable (L2002001 - ₹45,000,000) needs to be paid to employees
- This triggers **"Process for Payment"** workflow
- Payment voucher will be:
  - Dr L2002001 (Salary Payable) - ₹42,500,000 (net payable)
  - Cr Bank Account - ₹42,500,000
- Statutory payables (PF, ESIC, PT, TDS, LWF) will be paid separately through respective statutory payment processes

---

## Business Rules and Validations

### 1. Upload Validations

- File format: Only .xlsx and .xls allowed
- File size: Maximum 10 MB
- Mandatory columns: EMPCODE, FULLNAME, GROSS AMT, NETPAYABLE must exist
- No duplicate EMPCODE within same batch
- All amount fields must be numeric
- EMPCODE and FULLNAME cannot be empty
- GROSS AMT must be positive
- NETPAYABLE must be positive and ≤ GROSS AMT

### 2. Business Logic Validations

- Employee count must be > 0
- Total amounts must match sum of employee amounts
- PF calculations should match PF WAGES
- ESIC calculations should match ESI WAGES
- State-specific PT and LWF amounts should be correct
- Net payable = Gross - Total deductions (with ±₹1 tolerance)

### 3. GL Posting Validations

- Total Debit must equal Total Credit
- Tolerance: ₹0.01 (1 paisa) for rounding differences
- All GL codes must exist in Chart of Accounts
- No negative amounts in GL entries
- Minimum 1 debit entry and 1 credit entry required

### 4. Status Workflow Rules

- **Pending Approval:**
  - Can edit amounts
  - Can approve or reject
  - Can delete batch
  - Can download Excel
  - Cannot view JV (not yet generated)

- **Approved:**
  - Cannot edit
  - Cannot delete
  - Cannot re-approve
  - Can view JV
  - Can download Excel
  - Voucher generated

- **Rejected:**
  - Cannot edit
  - Cannot approve directly (must reupload)
  - Can reupload corrected file
  - Can view rejection reason
  - Can download Excel

### 5. User Role Permissions

**Payroll Team:**

- Upload salary batch
- View own submissions
- Reupload rejected batches
- Delete pending batches (own submissions only)
- View rejection reasons

**Account Executive:**

- View assigned pending batches
- Approve batches
- Reject batches with remarks
- Edit net payable amounts
- Download batch Excel
- View generated JV
- Bulk approve multiple batches

### 6. Voucher Number Uniqueness

- System ensures no duplicate voucher numbers
- Format: JVF00/{timestamp}/{YYMM}
- Timestamp uses milliseconds for uniqueness
- If duplicate detected, retry with new timestamp

### 7. Audit Trail Requirements

- All actions logged with user and timestamp
- History maintained for:
  - Batch upload
  - Status changes
  - Amount edits
  - Approvals
  - Rejections
  - Reuploads
- Immutable audit log (cannot be deleted/edited)

### 8. Data Retention

- Active batches: Stored in main database
- Approved batches: Retained for 7 years (statutory requirement)
- Transactions: Never deleted (permanent record)
- Excel files: Stored for 3 years
- Audit logs: Retained for 7 years

---

## Error Handling and Notifications

### 1. Upload Errors

**File Format Error:**

- Message: "Invalid file format. Please upload Excel file (.xlsx or .xls)"
- Action: Clear file input, show error message

**Missing Columns Error:**

- Message: "Missing required columns: EMPCODE, FULLNAME, NETPAYABLE"
- Show: List of missing columns
- Action: Block upload, show detailed error

**Data Validation Error:**

- Message: "Invalid salary data found in rows"
- Show: Table with row numbers and specific errors
- Examples:
  - Row 5: NETPAYABLE must be a positive number
  - Row 12: EMPCODE cannot be empty
  - Row 25: GROSS AMT is negative
- Action: Block upload, allow correction

**Duplicate Employee Error:**

- Message: "Duplicate EMPCODE found: EMP1025, EMP1130"
- Show: List of duplicate EMPCODEs
- Action: Block upload, ask to fix duplicates

### 2. Approval Errors

**GL Imbalance Error:**

- Message: "GL entries are not balanced. Cannot approve batch."
- Show:
  - Total Debit: ₹50,613,500
  - Total Credit: ₹50,613,450
  - Difference: ₹50
- Action: Block approval, show error modal
- Resolution: Review salary data, fix calculation errors

**Negative Amount Error:**

- Message: "Negative amounts found in employee salary data"
- Show: List of employees with negative amounts
- Action: Block approval
- Resolution: Fix negative amounts in data

**Already Approved Error:**

- Message: "Batch already approved. Voucher No: JVF00/42500/2602"
- Action: Block re-approval, show existing voucher details

### 3. Rejection Errors

**Empty Rejection Reason:**

- Message: "Rejection reason is mandatory and must be at least 10 characters"
- Action: Block rejection, highlight text field

### 4. Success Notifications

**Upload Success:**

- Message: "✅ Salary batch uploaded successfully! Batch ID: BATCH_1738742400000. Assigned to: [AE Name]"
- Toast: Green notification, 5 seconds

**Approval Success:**

- Message: "✅ Batch approved successfully! Voucher No: JVF00/42500/2602 posted."
- Toast: Green notification, 5 seconds
- Action: Open JV modal automatically

**Rejection Success:**

- Message: "❌ Batch rejected. Payroll team notified."
- Toast: Red notification, 5 seconds

**Bulk Approval Success:**

- Message: "✅ 3 batches approved successfully. GL vouchers posted."
- Toast: Green notification, 5 seconds
- Action: Show summary modal with all voucher numbers

**Reupload Success:**

- Message: "✅ Batch re-uploaded successfully and reassigned for approval"
- Toast: Green notification, 5 seconds

### 5. Email Notifications

**To Payroll Team:**

- When batch is approved: "Your salary batch [Batch ID] for [Period] has been approved by [AE Name]. Voucher No: [Voucher No]"
- When batch is rejected: "Your salary batch [Batch ID] for [Period] has been rejected. Reason: [Rejection Reason]. Please correct and reupload."

**To Account Executive:**

- When new batch is assigned: "New salary batch [Batch ID] for [Period] with [Employee Count] employees has been assigned to you for approval."

---

## Reports and Downloads

### 1. Batch Excel Download

**Content:**

- All 112 columns
- All employee rows
- Original formatting preserved
- File name: `Salary_{Period}_BATCH_{ID}.xlsx`

### 2. Journal Voucher PDF

**Content:**

- Company header with logo
- Voucher number and date
- Complete GL entries table
- Totals and narration
- Approval signatures section
- Footer with generation timestamp
- File name: `JV_{VoucherNo}.pdf`

### 3. Batch Summary Report

**Content:**

- Batch metadata
- Employee count and totals
- Statutory summary (PF, ESIC, PT, TDS)
- Employer contribution summary
- Net payable breakdown
- File name: `Batch_Summary_{BatchID}.pdf`

### 4. Monthly Salary Register

**Content:**

- All batches for selected month
- Employee-wise salary details
- Statutory deduction summary
- Total cost summary
- File name: `Salary_Register_{Month}_{Year}.xlsx`

### 5. Statutory Reports

**PF Report (ECR Format):**

- UAN, Name, Gross, EPF Wages, EPS Wages, EPF Contribution, EPS Contribution

**ESIC Report (Challan Format):**

- ESIC No, Name, Gross, ESI Wages, Employee Contribution, Employer Contribution

**PT Report (State-wise):**

- Employee Code, Name, PT Amount, State

**TDS Report (Form 24Q):**

- PAN, Name, Gross Salary, TDS Deducted, Quarter

---

## Performance Optimization

### 1. File Processing

- Stream parse Excel files (don't load entire file in memory)
- Process in chunks of 100 employees
- Show progress indicator for large files (>200 employees)
- Background processing for files with >1000 employees

### 2. GL Aggregation

- Use Map data structure for O(1) lookups
- Single pass through employee data
- Memory-efficient: Store only aggregated entries
- Significant reduction: 17,100 entries → 42 entries (99.7%)

### 3. Database Optimization

- Index on: batchId, status, assignedTo, payrollPeriod
- Partition transactions table by month/year
- Archive batches older than 3 years to separate table
- Compress large Excel files stored in database

### 4. UI Performance

- Pagination: 10 entries per page (configurable)
- Lazy load employee details on batch expansion
- Virtualized tables for >100 rows
- Debounce search inputs (300ms delay)
- Cache batch summary calculations

---

## Security and Compliance

### 1. Access Control

- Role-based access (Payroll Team, Account Executive)
- User can only view own submissions (Payroll Team)
- User can only view assigned batches (Account Executive)
- Audit trail of all actions with user identification

### 2. Data Security

- Sensitive fields encrypted in database (Bank Account No, Aadhar, PAN)
- Excel files stored in encrypted format
- HTTPS for all API communications
- Session timeout after 30 minutes of inactivity

### 3. Statutory Compliance

- PF calculations as per EPFO guidelines
- ESIC calculations as per ESIC Act
- PT calculations as per state-specific rules
- TDS calculations as per Income Tax Act
- 7-year data retention for audit purposes

### 4. Audit Requirements

- Complete audit trail of all transactions
- Immutable transaction records (no edit/delete)
- User action logs with timestamp and IP address
- GL posting audit with transaction IDs
- Downloadable audit reports

---

## Integration Points

### 1. Employee Master Integration

**Purpose:** Validate employee codes and fetch employee details

**API:** `GET /api/employee/validate/{empCode}`

**Usage:** During Excel upload, validate each EMPCODE exists in employee master

### 2. Bank Payment Integration

**Purpose:** Generate bank payment file for net salary transfer

**API:** `POST /api/payment/generate-neft`

**Usage:** After batch approval, generate NEFT file for net payable amount

**Request:**

```json
{
  "batchId": "BATCH_1738742400000",
  "paymentMode": "NEFT",
  "debitAccount": "123456789012",
  "totalAmount": 42500000,
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

### 3. Statutory Compliance System Integration

**Purpose:** Generate statutory reports and challans

**APIs:**

- `POST /api/compliance/pf-report` - Generate PF ECR
- `POST /api/compliance/esic-report` - Generate ESIC Challan
- `POST /api/compliance/pt-report` - Generate PT Challan
- `POST /api/compliance/tds-report` - Generate Form 24Q

**Usage:** After batch approval, submit data to compliance system for statutory filing

### 4. General Ledger System Integration

**Purpose:** Post salary transactions to central GL

**API:** `POST /api/gl/post-transaction`

**Usage:** Post generated journal voucher to main accounting system

### 5. Email Notification Service

**Purpose:** Send notifications to users

**API:** `POST /api/notification/send-email`

**Usage:** Send approval/rejection notifications to Payroll Team and AE

---

## Future Enhancements

### Phase 2 Features

1. **Salary Revision Management:**
   - Track increment history
   - Compare month-over-month changes
   - Revision approval workflow

2. **Arrears Processing:**
   - Handle salary arrears posting
   - Separate GL entries for arrears
   - Arrears tax calculation

3. **Hold Salary:**
   - Mark employee salary on hold
   - Partial hold (percentage or fixed amount)
   - Hold approval and release workflow

4. **Loan Deduction Management:**
   - Track loan deductions
   - EMI calculation
   - Loan balance tracking

5. **Variable Pay Processing:**
   - Incentive/bonus calculations
   - Performance-based pay
   - Separate GL treatment

6. **Final Settlement:**
   - FnF (Full and Final) calculations
   - Leave encashment
   - Gratuity calculation

### Phase 3 Features

1. **Mobile App:**
   - View salary slips
   - Download tax computation
   - Raise queries

2. **AI-Powered Validation:**
   - Predict calculation errors
   - Suggest corrections
   - Anomaly detection

3. **Advanced Analytics:**
   - Department-wise cost analysis
   - Trend analysis
   - Cost forecasting

4. **Integration with HRMS:**
   - Auto-fetch attendance
   - Leave integration
   - Performance data integration

---

## Technical Specifications

### Frontend

- **Framework:** React 18
- **State Management:** Redux / Context API
- **UI Library:** Tailwind CSS
- **Excel Library:** xlsx (SheetJS)
- **File Upload:** react-dropzone
- **Notifications:** react-toastify
- **Tables:** react-table / virtualized tables

### Backend

- **Runtime:** Node.js / Python / Java (as per stack)
- **Framework:** Express / FastAPI / Spring Boot
- **Database:** PostgreSQL / MySQL
- **File Storage:** AWS S3 / Azure Blob / Local storage
- **Queue:** Redis / RabbitMQ (for large file processing)

### Database Schema

**Table: salary_batches**

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

**Table: salary_employee_details**

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
  other_allowances JSON,
  gross_amount DECIMAL(10,2),
  pf DECIMAL(10,2),
  esic DECIMAL(10,2),
  pt DECIMAL(10,2),
  tds DECIMAL(10,2),
  other_deductions JSON,
  total_deduction DECIMAL(10,2),
  net_payable DECIMAL(10,2),
  pf_company DECIMAL(10,2),
  esic_company DECIMAL(10,2),
  bank_account_no VARCHAR(30),
  ifsc_code VARCHAR(15),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (batch_id) REFERENCES salary_batches(batch_id) ON DELETE CASCADE,
  INDEX idx_batch_emp (batch_id, emp_code)
);
```

**Table: salary_transactions**

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

**Table: salary_transaction_entries**

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
  category VARCHAR(30),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (transaction_id) REFERENCES salary_transactions(id) ON DELETE CASCADE,
  INDEX idx_transaction (transaction_id),
  INDEX idx_gl_code (gl_code),
  INDEX idx_category (category)
);
```

**Table: salary_batch_history**

```sql
CREATE TABLE salary_batch_history (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  batch_id VARCHAR(50) NOT NULL,
  action VARCHAR(50) NOT NULL,
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

## Success Metrics

### 1. Process Efficiency

- **Target:** Reduce salary processing time by 70%
- **Current:** Manual GL entries take 4-5 hours per month
- **Expected:** Auto GL posting takes 5-10 minutes per month

### 2. Accuracy

- **Target:** 99.9% accuracy in GL posting
- **Measure:** Zero GL imbalance errors
- **Validation:** Automated balance checks before posting

### 3. User Adoption

- **Target:** 100% of Payroll Team using system within 1 month
- **Training:** 2-hour training session for each user
- **Support:** Dedicated help desk for first month

### 4. Compliance

- **Target:** 100% statutory compliance
- **Measure:** No penalties from PF/ESIC/PT/TDS authorities
- **Audit:** Quarterly compliance audit

### 5. Time Savings

- **Payroll Team:** Save 2 hours per batch (no manual GL entry)
- **Account Executive:** Save 1 hour per batch (auto validation)
- **Accounts Team:** Save 3 hours per month (no manual voucher creation)

---

## Glossary

| Term               | Description                                                            |
| ------------------ | ---------------------------------------------------------------------- |
| **Batch**          | A collection of employee salary records for a specific payroll period  |
| **GL**             | General Ledger - Accounting system with chart of accounts              |
| **JV**             | Journal Voucher - Accounting document for non-cash transactions        |
| **PF**             | Provident Fund - Retirement benefit scheme                             |
| **ESIC**           | Employee State Insurance Corporation - Medical insurance scheme        |
| **PT**             | Professional Tax - State-level tax on salaried individuals             |
| **TDS**            | Tax Deducted at Source - Income tax deducted from salary               |
| **LWF**            | Labour Welfare Fund - State-level welfare contribution                 |
| **Net Payable**    | Gross salary minus all deductions (amount paid to employee)            |
| **Gross Salary**   | Total of all earning components before deductions                      |
| **CTC**            | Cost to Company - Total cost including salary + employer contributions |
| **Aggregation**    | Combining employee-level data to GL-level summary                      |
| **Voucher Number** | Unique identifier for accounting transaction                           |
| **Debit Entry**    | Increase in expense or asset account                                   |
| **Credit Entry**   | Increase in liability or income account                                |

---

## Document Control

| Version | Date        | Author         | Changes              |
| ------- | ----------- | -------------- | -------------------- |
| 1.0     | 06-Feb-2026 | System Analyst | Initial PRD creation |

---

**Document Status:** ✅ Ready for Development

**Approval Required From:**

- Finance Head
- HR Head
- IT Head
- Compliance Manager

**Next Steps:**

1. Review and approval of PRD
2. Technical design document creation
3. Database schema finalization
4. API specification documentation
5. UI/UX wireframes
6. Development sprint planning

---

**End of PRD**

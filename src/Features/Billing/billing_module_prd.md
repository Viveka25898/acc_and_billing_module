# Product Requirement Document: Billing Module - Auto Billing

## Objective of the Auto Billing Feature
The **Auto Billing Feature** is the core engine of the Billing Module, designed to automate the monthly generation of invoices for Housekeeping, Manpower, and other services. Its main goal is to eliminate manual calculation errors by integrating **Commercial Rate Cards** with **Operational Attendance Data**.
The system ensures that invoices are generated accurately based on pre-approved rates, statutory compliances (GST, HSN/SAC), and specific client configurations. It allows for a seamless flow from client selection to final invoice generation, providing a digital, transparent, and auditable billing process.

---

## Roles and Access Matrix

| Role | Access & Functional Rights |
| :--- | :--- |
| **1] Billing Manager** | - Initiate Auto Billing Wizard <br> - Configure Client & Billing Cycles <br> - Approve/Modify Calculated Lines <br> - Generate Final Invoices |

---

## Workflow

### 1] Process for Auto Billing
**Objective**: To automate the end-to-end invoice generation process, ensuring accurate revenue recognition, statutory compliance, and timely billing for all clients.

#### Step 1: Client Scope Selection
**User Action**:
**1] Login**: Billing Manager

**Flow**:
1.  Billing Manager logs in and navigates to the **Auto Billing** tab.
2.  The system presents `Step 1: Select Client & Billing Scope`.
3.  The Manager selects the geographical scope (State > City > Branch).
4.  Based on the branch, a filtered list of Customers is displayed.
5.  After selecting a Customer, the Manager defines the **Billing Scope**:
    *   **Bill Entire State**: Automatically selects all active sites for that customer in the state.
    *   **Bill Specific Sites**: Allows manual selection of specific sites/branches to bill.
6.  The system displays a summary of the selected customer (Total Sites, Active Rate Cards, Last Invoice Amount) for verification.

**Form Fields**:
*   **State**: Dropdown (Source: State Master)
*   **City**: Dropdown (Source: City Master, filtered by State)
*   **Branch**: Dropdown (Source: Branch Master)
*   **Customer**: Dropdown (Source: Customer Master, filtered by Branch/City)
*   **Billing Scope**: Radio Button (Entire State / Specific Sites)
*   **Select Sites**: Checkbox List (Visible only if "Specific Sites" is selected)

---

#### Step 2: Billing Cycle Configuration
**User Action**:
**1] Login**: Billing Manager

**Flow**:
1.  After defining scope, the Manager proceeds to `Step 2`.
2.  The Manager selects the **Billing Month** (e.g., January 2026).
3.  **Automatic Cycle Logic**:
    *   **IF** a billing cycle is already fixed for this client in the backend, the system **automatically displays and locks** that cycle (e.g., "16th Dec to 15th Jan").
    *   **IF** this is the first time billing for this client, the system presents standard business logic options for selection:
        *   16th Previous Month to 15th Current Month (Total Days: 30, Division By: 30)
        *   21st Previous Month to 20th Current Month (Total Days: 30, Division By: 30)
        *   25th Previous Month to 25th Current Month (Total Days: 31, Division By: 31)
        *   1st Current Month to 31st Current Month (Total Days: 31, Division By: 31)
    *   *Note*: Once a cycle is selected for the first time, it becomes **fixed** for that client for future bills.

**Form Fields**:
*   **Select Billing Month**: Dropdown (Current + Future Months)
*   **Select Billing Cycle**: Radio Selection Table (Visible only for first-time selection).

---

#### Step 3: Invoice Configuration
**User Action**:
**1] Login**: Billing Manager

**Flow**:
1.  Manager proceeds to `Step 3` to configure invoice metadata.
2.  **Invoice Series Selection**: Choice between "Proforma Invoice" (Draft) or "Sales Invoice" (Final).
3.  **Invoice Type Selection**: Choice between Regular, Advance, Adjustment, or Credit Note.
4.  **Site Filter**: Optional filter to generate invoice for a subset of the previously selected sites.

**Form Fields**:
*   **Invoice Series**: Radio Cards (Proforma / Sales Invoice)
*   **Invoice Type**: Dropdown (Regular, Advance, Adjustment, Credit Note)
*   **Additional Filter**: Dropdown (All Sites / Specific Site)

---

#### Step 4: Billing Calculation (The Calculation Engine)
**User Action**:
**1] Login**: Billing Manager

**Flow**:
1.  System triggers the **Auto-Calculation Engine**.
2.  **Consolidated Calculation**:
    *   **Personnel**: Calculates wages based on Attendance x Rates.
    *   **Machinery & Materials**: Automatically calculated in the **same step** based on the Rate Card for the site.
    *   **Logic**: `(Monthly Rate / Total Days) * Duty Days * Headcount`.
    *   **Revenue Mapping**: Auto-maps each line item to its specific Revenue Ledger (e.g., Housekeeping -> `R1001001`).
3.  Manager reviews the generated **Billing Lines** in a detailed table.
4.  **Variance Check**: System compares "Actual Bill" vs "Expected Bill" (from Rate Card) and highlights variance.
5.  **Previous Month Check**: System compares Current Total vs Previous Month Total to flag anomalies.
6.  **PO/WO Number**: This field is **Auto-Filled** from the backend (fetched from the client's master contract/PO details).

**Form Fields**:
*   **PO/WO Number**: Text Input (Read-only/Auto-filled)
*   **Adjust for Leave Days**: Checkbox Toggle
*   **Billing Lines Table** (Read/Edit):
    *   Location, Product, Designation, Count, Duty Days, Rate/Month, Rate/Day, Amount.
*   **Buttons**: "Rate Card" (View Modal), "Save as Draft", "Review & Generate".

---

#### Step 5: Preview & Final Generation
**User Action**:
**1] Login**: Billing Manager

**Flow**:
1.  Manager views the **High-Fidelity Invoice Preview**.
2.  **Actions**:
    *   **Save**: The invoice is saved as "Proforma Invoice" (if not final). The Manager can view this later in the Proforma Invoice Dashboard.
    *   **Send Mail**: Automatically triggers an email to the Client's registered email ID with the Invoice PDF attached.
    *   **Convert to Final (IRN Generation)**:
        *   When clicked, the system triggers the **E-Invoice API Service**.
        *   **Backend Process**:
            1.  Logs into the GST E-Invoice Portal (using specific state credentials).
            2.  Sends invoice data payload.
            3.  Receives **IRN Number**, **QR Code**, and **Acknowledgement Number**.
        *   **Frontend Update**: The invoice is updated with these details and status changes to "IRN Generated".
        *   The final invoice is visible in the Sales Invoice Dashboard.

**GL Entries (Auto-Posted upon Generation)**:

*   **Debit Entry:**
    *   **L2001 - {Client Ledger Code}** (Sundry Debtors)
    *   *Parent GL*: `A3003001` (Sundry Debtors - Client Accounts)
    *   *Amount*: Grand Total (Receivable Amount)

*   **Credit Entry (Revenue):**
    *   **R1001001 - {Revenue Head Code}** (e.g., Housekeeping Charges)
    *   *Parent GL*: `R1001` (Direct Incomes)
    *   *Amount*: Taxable Value (Base Amount)

*   **Credit Entry (Tax):**
    *   **L2003001 - Output CGST**
    *   **L2003002 - Output SGST**
    *   *(Or IGST based on State)*
    *   *Parent GL*: `L2003` (Duties & Taxes)
    *   *Amount*: Tax Amount

**Flowchart**:

[Flowchart Placeholder: Scope Selection -> Cycle Config -> Invoice Config -> Calculation Engine -> Final Review -> E-Invoice API -> Auto Email -> GL Posting]

### 2] Process for Manual Billing
**Objective**: To facilitate ad-hoc, one-time, or supplementary billing scenarios (e.g., Deep Cleaning, Extra Duty, Material Supply) that are not covered by the monthly Auto Billing cycle.

#### Step 1: Client & Invoice Configuration
**User Action**:
**1] Login**: Billing Manager

**Flow**:
1.  Manager navigates to **Manual Billing**.
2.  **Client Selection**: Selects the Client from the master list.
3.  **Service Category**: Selects the nature of the bill (e.g., One-Time Service, MST Material, R&M, Hospital Billing).
    *   *Impact*: This selection determines the default **Revenue Ledger** for accounting.
4.  **Invoice Series**: Selects "Proforma" (Draft) or "Sales/Tax" (Final).
5.  **Metadata**: System auto-generates a PO/Reference Number (or allows manual override if based on external PO). Selects Invoice Date and Due Date.

**Form Fields**:
*   **Client**: Dropdown (Source: Client Master)
*   **Service Category**: Dropdown (Options: One-Time Service, Hospital Billing, MST-Material, R&M-Maintenance, Deep Cleaning, Extra Duty, Per Day Service, PO-Based)
*   **Invoice Series**: Radio (Proforma / Sales Invoice)
*   **PO/WO Number**: Text Input (Auto-suggested based on series, editable)
*   **Invoice Date**: Date Picker (Default: Today)
*   **Due Date**: Date Picker

---

#### Step 2: Line Item Entry & Calculation
**User Action**:
**1] Login**: Billing Manager

**Flow**:
1.  Manager interacts with the **Service Details** section.
2.  **Add Item**: Clicks "Add Line Item" to insert rows.
3.  **Data Entry**: Manually enters Description, Quantity, and Rate per unit.
4.  **Auto-Calculation**: System calculates `Amount = Quantity * Rate` in real-time.
5.  **Summary Calculation**:
    *   **Subtotal**: Sum of all line items.
    *   **Tax Configuration**: Manager confirms/edits GST Rate (Default: 18%).
    *   **Discount/Other Charges**: Optional fields to adjust the final value.
    *   **Grand Total**: Auto-calculated (`Subtotal + GST - Discount + Other Charges`).
    *   **Amount in Words**: Auto-converted for validation.

**Form Fields**:
*   **Line Items Table**:
    *   *Description*: Text Area (Free text service details)
    *   *Quantity*: Numeric
    *   *Rate*: Numeric
    *   *Total*: Read-only (Auto-calc)
    *   *Action*: Remove Row Checkbox/Button
*   **GST Rate**: Numeric Input (Default: 18%)
*   **Discount**: Numeric Input
*   **Other Charges**: Numeric Input

---

#### Step 3: Preview & Generation
**User Action**:
**1] Login**: Billing Manager

**Flow**:
1.  Manager clicks "**Generate Invoice**" to view the **High-Fidelity Preview**.
2.  **Verification**: Visual check of Client details, Line items, HSN/SAC Summary (Default HSN: 998599 or mapped to Category), and Totals.
3.  **Actions**:
    *   **Save**: Saves as "Proforma Invoice" (Draft).
    *   **Send Mail**: Triggers automatic email with PDF attachment to client.
    *   **Convert to Final**:
        *   Triggers **E-Invoice API**.
        *   Generates **IRN/QR Code**.
        *   Locks the invoice as "Final".

**GL Entries (Auto-Posted upon Generation)**:

*   **Debit Entry:**
    *   **L2001 - {Client Ledger Code}** (Sundry Debtors)
    *   *Parent GL*: `A3003001`
    *   *Amount*: Grand Total

*   **Credit Entry (Revenue):**
    *   **{Mapped Revenue GL}** (Based on Service Category, e.g., R1004 - One Time Service)
    *   *Parent GL*: `R1001` (Direct Incomes)
    *   *Amount*: Taxable Value

*   **Credit Entry (Tax):**
    *   **L2003001 - Output CGST**
    *   **L2003002 - Output SGST**
    *   *(Or IGST)*
    *   *Parent GL*: `L2003`
    *   *Amount*: Tax Amount

**Flowchart**:

[Flowchart Placeholder: Manual Setup -> Add Line Items -> Calculate Limits -> Preview -> Generate IRN -> Post GL]

### 3] Process for Arrear Billing
**Objective**: To automate the calculation and billing of **Differential Amounts** arising from retroactive rate revisions (e.g., Minimum Wage hikes, Contract renegotations) that are effective from a past date.

#### Step 1: Rate Change Notification & Dashboard
**User Action**:
**1] Login**: Billing Manager

**Flow**:
1.  **Trigger**: The **Commercial Module** updates a rate card for a Client/Site with a **Past Effective Date**.
2.  **Notification**: The System automatically flags this as a "Pending Arrear" in the Billing Dashboard.
3.  **Dashboard View**: Manager sees a list of Clients with pending rate changes.
    *   *Columns*: Client, Site, Old Rate, New Rate, Effective Date, Days Pending.
4.  **Action**: Manager clicks "Start Billing" for a specific Client.

**Form Fields (Dashboard)**:
*   **Filters**: State, Site, Search
*   **Status Indicators**: Pending (Yellow), Processed (Green)

---

#### Step 2: Arrear Calculation Engine
**User Action**:
**1] Login**: Billing Manager

**Flow**:
1.  **Auto-Population**: System retrieves:
    *   **Rate Data**: Old Rate vs. New Rate (from Commercial Module).
    *   **Attendance Data**: Employee Counts & Actual Working Days for the affected period (from Operations/Payroll).
2.  **Calculation Logic**:
    *   `Rate Difference = New Rate - Old Rate`
    *   `Arrear Amount = Rate Difference * Employee Count * Actual Working Days`
3.  **Verification**: Manager reviews the calculated amounts per Designation/Site.
    *   *Editability*: Manager can manually adjust "Days Worked" or "Employee Count" if specific exceptions apply.
4.  **Manual Additions**: Option to add manual line items (e.g., "Arrears for Material").

**Form Fields**:
*   **Header**: Client, Rate Change Date (Past), Effective Date (Current).
*   **Calculation Table**:
    *   *Designation*: Read-only
    *   *Old Rate / New Rate*: Read-only
    *   *Difference*: Read-only (Auto-calc)
    *   *Employee Count*: Editable (Pre-filled from Deployment)
    *   *Working Days*: Editable (Pre-filled from Attendance)
    *   *Line Total*: Auto-calc
*   **Manual Line Items**: Description, Rate, Qty.

---

#### Step 3: Generation & Accounting
**User Action**:
**1] Login**: Billing Manager

**Flow**:
1.  Manager clicks "**Generate Invoice**".
2.  **Preview**: Checks the "Arrear Bill" (Format: Standard Tax Invoice).
3.  **Actions**:
    *   **Save**: Stores as "Proforma Invoice" (Series: `ARR-YYYY-XXXX`).
    *   **Send Mail**: Auto-emails Client.
    *   **Convert to Final**: Generates IRN via E-Invoice Portal.

**GL Entries (Auto-Posted)**:

*   **Debit Entry:**
    *   **L2001 - {Client Ledger Code}**
    *   *Amount*: Grand Total

*   **Credit Entry (Revenue):**
    *   **R100X - {Service/Arrears Income GL}** (e.g., Manpower Supply Arrears)
    *   *Amount*: Taxable Value

*   **Credit Entry (Tax):**
    *   **L2003 - Output GST**
    *   *Amount*: Tax Amount (18%)

**Flowchart**:

[Flowchart Placeholder: Rate Change (Commercial) -> Notification (Billing) -> Auto-Calculation (Diff * Days) -> Verify -> Generate Arrear Invoice]

### 4] Process for Bonus & Leave Encashment Billing
**Objective**: To automate the billing of statutory Bonus and Leave Encashment payments. The system integrates with **Payroll** to fetch eligible employee data and applies **Commercial Module** rates to calculate the final billable amount.

#### Step 1: Dashboard & Notification
**User Action**:
**1] Login**: Billing Manager

**Flow**:
1.  **Trigger**: Payroll Module processes Bonus/Leave data for a specific period.
2.  **Dashboard View**: Manager sees a list of Clients with "Pending" Bonus or Leave Encashment data.
    *   *Columns*: Client, Period, Components (Bonus/Leave), Total Employees, Total Amount, Status.
3.  **Action**: Manager clicks "Generate Invoice" for a specific Client.

**Form Fields**:
*   **Filters**: Search by Client/Period, Status (Pending, Billed, Draft).
*   **Stats**: Total Records, Pending Count, Total Amount.

---

#### Step 2: Configuration & Validation
**User Action**:
**1] Login**: Billing Manager

**Flow**:
1.  **Selection**: Manager selects which components to bill:
    *   **Festival Bonus** (Integrates with Commercial Rate for Bonus %)
    *   **Leave Encashment** (Integrates with Commercial Rate for Leave Days & Encashment calculation)
2.  **Validation**:
    *   System checks if data exists for the selected component.
    *   Displays a summary of eligible employees and total billable amount.
    *   *Warning*: Alerts if data is missing for a selected component.
3.  **Action**: Clicks "Generate Invoice" to proceed to calculation.

**Form Fields**:
*   **Billing Type**: Checkboxes (Festival Bonus, Leave Encashment).
*   **Summary**: Auto-calculated Subtotal, CGST, SGST, Grand Total.

---

#### Step 3: Calculation Review (The Engine)
**User Action**:
**1] Login**: Billing Manager

**Flow**:
1.  **Data Retrieval**:
    *   **Bonus**: Fetches `Employee Name`, `Designation`, `Site`, and `Bonus Amount` (Calculated based on Commercial % of Basic/Gross).
    *   **Leave Encashment**: Fetches `Leave Days`, `Daily Rate` (from Commercial), and `Encashment Amount`.
2.  **Review**: Manager views a detailed employee-wise table.
    *   *Note*: Amounts are read-only to ensure integrity with Payroll/Commercial data.
3.  **Metadata**: System auto-generates a **PO/WO Number** (Series: `BL-YYMMXXX`), which is editable.
4.  **Action**: Clicks "Proceed to Preview".

**Form Fields**:
*   **PO/WO Number**: Text Input (Auto-generated).
*   **Bonus Table**: Employee Details, Site, Amount.
*   **Leave Table**: Employee Details, Leave Days, Daily Rate, Encashment Amount.

---

#### Step 4: Final Generation & Accounting
**User Action**:
**1] Login**: Billing Manager

**Flow**:
1.  **Preview**: Manager checks the final invoice (Standard Tax Invoice format).
2.  **Actions**:
    *   **Save**: Stores as "Proforma Invoice".
    *   **Send Mail**: Auto-emails Client.
    *   **Convert to Final**: Generates IRN via E-Invoice Portal.

**GL Entries (Auto-Posted)**:

*   **Debit Entry:**
    *   **L2001 - {Client Ledger Code}**
    *   *Amount*: Grand Total

*   **Credit Entry (Liability/Income):**
    *   **L200X - Bonus Payable / R100X - Service Income** (Depending on accounting treatment)
    *   *Amount*: Taxable Value

*   **Credit Entry (Tax):**
    *   **L2003 - Output GST**
    *   *Amount*: Tax Amount (18%)

**Flowchart**:

[Flowchart Placeholder: Payroll Data -> Billing Notification -> Select Component -> Review Calculation -> Generate Invoice -> Post GL]

---

## Billing Masters & Configuration

### 1] Rate Card Management Page
**Objective**: To provide a central, auditable view of all active **Commercial Rates** utilized for billing. This ensures that the Billing Team invoices clients based *strictly* on approved commercial terms without manual manipulation.

**Governance Note**:
*   **Billing Manager**: **View Only** access. Cannot modify rates.
*   **Commercial Team**: **Edit/Manage** access (Source of Truth).
*   *Testing Phase Exception*: Currently, edit capability is enabled for Billing Managers to facilitate **Arrear Billing Testing** (simulating backdated rate changes).

#### Interface Overview
**User Action**:
**1] Login**: Billing Manager -> **Masters** -> **Rate Card**

**Features & Flow**:
1.  **Global Search & Filter**:
    *   **Filters**: State -> Client -> Site.
    *   **Search**: Free text search for Designation or Product.
2.  **Rate Grid View**:
    *   Displays a comprehensive table of all billable line items for the selected scope.
    *   **Columns**:
        *   *Context*: Client, State, Site.
        *   *Item Details*: Type (Personnel/Machinery/Consumable), Designation/Product.
        *   *Commercials*: **Daily Rate**, **Monthly Rate** (Auto-calc: Daily * 30), **GST %**, **HSN/SAC**.
        *   *Audit*: **Effective Date**, **Last Updated By**, **Last Updated On**.
3.  **Audit Trail & History**:
    *   The system tracks every rate change.
    *   **Modification Log**: Hovering/Clicking on "Last Updated" reveals the history of modification (User ID + Timestamp).

**Form Fields (Read-Only)**:
*   **Designation**: Text
*   **Daily Rate**: Currency
*   **Monthly Rate**: Currency
*   **Employee Count**: Numeric (Live fetch from Payroll)
*   **GST Rate**: Percentage
*   **HSN/SAC**: Alphanumeric code

### 2] Proforma Invoices Dashboard
**Objective**: To serve as a holding area for all invoices generated in **Step 1 (Draft Stage)** from Auto/Manual/Arrear/Bonus billing. It allows the Billing Team to review, obtain client approval, and manage the transition to a Final Tax Invoice.

#### Interface Overview
**User Action**:
**1] Login**: Billing Manager -> **Invoices** -> **Proforma Invoices**

**Features & Flow**:
1.  **Dashboard Stats**:
    *   **Total**: Count of all proforma records.
    *   **Draft**: Created but not sent to client for approval.
    *   **Sent**: Emailed/Shared with client for approval.
    *   **Received**: Client approved (Ready for IRN).
    *   **Converted**: Successfully moved to Tax Invoices.
2.  **Filters**:
    *   **Search**: Free text (Invoice #, Client Name).
    *   **Status**: Dropdown (Draft, Sent, Received, Converted).
    *   **Date Range**: From/To filters for Invoice Date.
3.  **Invoice Grid**:
    *   **Columns**: Invoice No, Client, Date, Amount, Status, Actions.
    *   **Actions**:
        *   **View**: Opens high-fidelity modal.
        *   **Download**: Print/PDF export.
        *   **Mark as Sent**: Updates status (Audit trail for client communication).
        *   **Convert to IRN (Tax Invoice)**: The critical final step.

#### Detailed Action: Convert to IRN
**Trigger**: User clicks "Convert to Final" icon.

**System Workflow**:
1.  **Validation**: Checks if all mandatory E-Invoice fields (HSN, GSTIN, Address) are valid.
2.  **Generation**:
    *   Generates a unique **IRN (Invoice Reference Number)** & **QR Code** via API.
    *   Generates **Acknowledgement Number**.
    *   Assigns a final **Voucher Number** (Accounting Sequence).
3.  **Accounting Post**:
    *   Debit Client / Credit Revenue & Taxes.
4.  **Data Movement**:
    *   Moves record from `Proforma Storage` -> `Tax Invoice Storage`.
    *   Updates status to "Final".

**Form Fields (Filter)**:
*   **Search Term**: Text Input
*   **Status**: Dropdown
*   **Date Range**: Date Pickers

### 3] IRN Generated Invoices (Sales Register)
**Objective**: To serve as the final, immutable repository of all valid **Tax Invoices** issued by the organization. This module ensures that every invoice listed here is legally valid, compliant with GST E-Invoicing norms, and posted to the Accounts Ledger.

#### Interface Overview
**User Action**:
**1] Login**: Billing Manager -> **Invoices** -> **IRN Generated Invoices**

**Features & Flow**:
1.  **Dashboard View**:
    *   A central list of all finalized invoices.
    *   **Visual Indicators**: Status badges (Final, Sent, View Count).
2.  **Invoice Grid**:
    *   **Columns**:
        *   *Identity*: Invoice No, IRN Number (The 64-char hash), Customer.
        *   *Context*: Branch / Narration.
        *   *Financials*: Grand Total.
        *   *Audit*: Created By, Created Date.
        *   *Communication*: "Sent" Status (Yes/No), View Count.
3.  **Actions**:
    *   **View**: Full-screen high-fidelity preview.
    *   **Download**: Generates the official PDF with QR Code and IRN.
    *   **Email**: Integrated email client to send/resend the invoice to the customer directly from the portal.

#### Detailed Action: Email Integration
**Trigger**: User clicks "Send" or "Resend" button.

**System Workflow**:
1.  **Template**: Auto-loads a professional email template.
2.  **Context**: Auto-fills Invoice No, Customer Name, Month, and Amount.
3.  **Delivery**: Uses **EmailJS** integration to send the mail with the PDF link.
4.  **Audit**:
    *   Updates status to "Sent".
    *   Increments "View Count" when the client opens the link (if tracking enabled).

**Form Fields (Read-Only Columns)**:
*   **IRN Number**: Alphanumeric (Essential for GST audit).
*   **Status**: Final / Sent.

---

## Conclusion
This PRD covers the end-to-end Billing Module, from the automated monthly cycle to complex arrear handling and statutory bonus compliance. The integration with Commercial and Payroll modules ensures a "Single Source of Truth," minimizing revenue leakage and audit risks.

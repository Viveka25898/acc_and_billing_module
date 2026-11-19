/**
 * nonPoExpenseMockData.js
 * ─────────────────────────────────────────────────────────────
 * Complete mock dataset for Non-PO / Emergency Expense feature.
 *
 * Provides:
 * - Sites and Clients with region mapping
 * - Initial set of mock requests across all stages with verified Bank Details
 * - Read/Write mock functions ready to be swapped with API service calls
 */

import { WORKFLOW_STATUS, PAYMENT_STATUS, EXPENSE_CATEGORIES_MAP } from '../config/nonPoExpenseConfig'

// ─── MASTER: SITES ───────────────────────────────────────────────────────────
export const MOCK_SITES = [
  {
    id: 'site-mh01',
    code: 'MH01',
    name: 'Godrej One - Vikhroli, Mumbai',
    region: 'W',
    regionName: 'West',
    costCentre: 'CC-MH01-OPS',
    clientIds: ['client-godrej', 'client-tata'],
  },
  {
    id: 'site-mh02',
    code: 'MH02',
    name: 'BKC Financial Center, Mumbai',
    region: 'W',
    regionName: 'West',
    costCentre: 'CC-MH02-BKC',
    clientIds: ['client-hdfc', 'client-kotak'],
  },
  {
    id: 'site-dl01',
    code: 'DL01',
    name: 'Cyber City Tower B, Gurugram',
    region: 'N',
    regionName: 'North',
    costCentre: 'CC-DL01-CYBER',
    clientIds: ['client-airtel', 'client-maruti'],
  },
  {
    id: 'site-blr01',
    code: 'BLR01',
    name: 'Manyata Tech Park, Bengaluru',
    region: 'S',
    regionName: 'South',
    costCentre: 'CC-BLR01-TECH',
    clientIds: ['client-infosys', 'client-wipro'],
  },
  {
    id: 'site-kol01',
    code: 'KOL01',
    name: 'Salt Lake Sector V, Kolkata',
    region: 'E',
    regionName: 'East',
    costCentre: 'CC-KOL01-IT',
    clientIds: ['client-itc', 'client-tatasteel'],
  },
]

// ─── MASTER: CLIENTS ─────────────────────────────────────────────────────────
export const MOCK_CLIENTS = [
  { id: 'client-godrej', name: 'Godrej Properties Ltd', code: 'CL-GDRJ' },
  { id: 'client-tata', name: 'Tata Communications', code: 'CL-TATA' },
  { id: 'client-hdfc', name: 'HDFC Asset Management', code: 'CL-HDFC' },
  { id: 'client-kotak', name: 'Kotak Mahindra Capital', code: 'CL-KTK' },
  { id: 'client-airtel', name: 'Bharti Airtel Ltd', code: 'CL-ARTL' },
  { id: 'client-maruti', name: 'Maruti Suzuki India', code: 'CL-MSIL' },
  { id: 'client-infosys', name: 'Infosys BPM', code: 'CL-INFY' },
  { id: 'client-wipro', name: 'Wipro Enterprises', code: 'CL-WPRO' },
  { id: 'client-itc', name: 'ITC Infotech Ltd', code: 'CL-ITC' },
  { id: 'client-tatasteel', name: 'Tata Steel Downstream', code: 'CL-TSDL' },
]

// ─── INITIAL EXPENSE REQUESTS ───────────────────────────────────────────────
export let mockExpenseRequests = [
  {
    id: 'req-001',
    claimId: 'NPO-2026-W-000001',
    claimDate: '2026-11-14',
    financialYear: 'FY 2026-27',
    workflowStatus: WORKFLOW_STATUS.PENDING_RH,
    paymentStatus: PAYMENT_STATUS.NOT_APPLICABLE,
    // Requester
    employeeCode: 'EMP0000012',
    employeeName: 'Karan Malhotra',
    requesterRole: 'Operation Executive',
    region: 'W',
    // Expense
    expenseType: 'Emergency Repair',
    urgency: 'critical',
    incidentDate: '2026-11-13',
    categoryId: 'cat_er_elec',
    categoryName: 'Electrical Failure & Urgent Fixes',
    billable: 'No',
    clientId: null,
    clientName: null,
    siteId: 'site-mh01',
    siteName: 'Godrej One - Vikhroli, Mumbai',
    costCentre: 'CC-MH01-OPS',
    expenseDate: '2026-11-14',
    claimReason: 'Main power busbar overheating caused critical line outage at building sector 3. Immediate contractor replacement was essential.',
    nonPoJustification: 'Unplanned fire hazard safety shutdown occurred on weekend. Waiting for standard 5-day PO turnaround would have left entire facility dark.',
    amountRequested: 38500.00,
    // Bank Details for Disbursement
    accountHolderName: 'Apex Power Controls & Services',
    bankName: 'HDFC Bank, Kanjurmarg West Branch',
    bankAccountNo: '50200012345678',
    ifscCode: 'HDFC0000123',
    passbookImage: {
      fileName: 'Apex_Cancelled_Cheque.jpg',
      size: '1.2 MB',
      type: 'Bank Passbook / Cheque Proof',
    },
    // Supporting Attachments
    attachments: [
      { id: 'att-1', fileName: 'Apex_Invoice_9921.pdf', type: 'Invoice', size: '1.4 MB' },
      { id: 'att-2', fileName: 'Damaged_Busbar_Photo.jpg', type: 'Photo', size: '2.1 MB' },
    ],
    // Timeline
    approvalTimeline: [
      { stage: 'RH', role: 'Regional Head', approverName: 'Vikram Singh', decision: 'Pending', date: null, comments: null },
      { stage: 'AVP', role: 'AVP Operations', approverName: null, decision: null, date: null, comments: null },
      { stage: 'VP', role: 'VP Operations', approverName: null, decision: null, date: null, comments: null },
      { stage: 'AE', role: 'Account Executive', approverName: null, decision: null, date: null, comments: null },
      { stage: 'AM', role: 'Accounts Manager', approverName: null, decision: null, date: null, comments: null },
    ],
    currentStage: 'Regional Head',
    ageDays: 2,
    createdAt: '2026-11-14T10:30:00Z',
  },
  {
    id: 'req-002',
    claimId: 'NPO-2026-W-000002',
    claimDate: '2026-11-12',
    financialYear: 'FY 2026-27',
    workflowStatus: WORKFLOW_STATUS.PENDING_AVP,
    paymentStatus: PAYMENT_STATUS.NOT_APPLICABLE,
    employeeCode: 'EMP0000012',
    employeeName: 'Karan Malhotra',
    requesterRole: 'Operation Executive',
    region: 'W',
    expenseType: 'Emergency Repair',
    urgency: 'high',
    incidentDate: '2026-11-11',
    categoryId: 'cat_er_plumb',
    categoryName: 'Plumbing & Drainage Leaks',
    billable: 'Yes',
    clientId: 'client-godrej',
    clientName: 'Godrej Properties Ltd',
    siteId: 'site-mh01',
    siteName: 'Godrej One - Vikhroli, Mumbai',
    costCentre: 'CC-MH01-OPS',
    expenseDate: '2026-11-12',
    claimReason: 'Main drain riser leakage on basement 2 flooded pump room requiring urgent pipe section replacement.',
    nonPoJustification: 'Emergency pipe rupture threatened basement server infrastructure. Vendor mobilized on spot without waiting for PO issuance.',
    amountRequested: 24000.00,
    accountHolderName: 'Rapid Pipe Solutions Pvt Ltd',
    bankName: 'ICICI Bank, Powai Branch',
    bankAccountNo: '002105009988',
    ifscCode: 'ICIC0000021',
    passbookImage: {
      fileName: 'RapidPipe_Passbook_FrontPage.pdf',
      size: '890 KB',
      type: 'Bank Passbook / Cheque Proof',
    },
    attachments: [
      { id: 'att-3', fileName: 'Pipe_Replacement_Bill.pdf', type: 'Invoice', size: '940 KB' },
    ],
    approvalTimeline: [
      { stage: 'RH', role: 'Regional Head', approverName: 'Vikram Singh', decision: 'Approved', date: '2026-11-13 14:15', comments: 'Verified genuine site emergency. Approved.' },
      { stage: 'AVP', role: 'AVP Operations', approverName: 'Arjun Desai', decision: 'Pending', date: null, comments: null },
      { stage: 'VP', role: 'VP Operations', approverName: null, decision: null, date: null, comments: null },
      { stage: 'AE', role: 'Account Executive', approverName: null, decision: null, date: null, comments: null },
      { stage: 'AM', role: 'Accounts Manager', approverName: null, decision: null, date: null, comments: null },
    ],
    currentStage: 'AVP Operations',
    ageDays: 4,
    createdAt: '2026-11-12T09:00:00Z',
  },
  {
    id: 'req-003',
    claimId: 'NPO-2026-W-000003',
    claimDate: '2026-11-10',
    financialYear: 'FY 2026-27',
    workflowStatus: WORKFLOW_STATUS.APPROVED_ACCOUNTS,
    paymentStatus: PAYMENT_STATUS.PENDING_PROCESSING,
    employeeCode: 'EMP0000012',
    employeeName: 'Karan Malhotra',
    requesterRole: 'Operation Executive',
    region: 'W',
    expenseType: 'Site Operational Expense',
    urgency: 'normal',
    incidentDate: null,
    categoryId: 'cat_so_diesel',
    categoryName: 'Generator / Diesel Refueling',
    billable: 'No',
    clientId: null,
    clientName: null,
    siteId: 'site-mh02',
    siteName: 'BKC Financial Center, Mumbai',
    costCentre: 'CC-MH02-BKC',
    expenseDate: '2026-11-09',
    claimReason: 'Bulk diesel procured during grid transformer breakdown for uninterrupted backup power.',
    nonPoJustification: 'Local bunk supplier insisted on immediate payment due to state holiday regulations.',
    amountRequested: 52000.00,
    accountHolderName: 'Metro Diesel Supplies',
    bankName: 'State Bank of India, BKC Branch',
    bankAccountNo: '30998877665',
    ifscCode: 'SBIN0001234',
    passbookImage: {
      fileName: 'SBI_Passbook_Copy.pdf',
      size: '640 KB',
      type: 'Bank Passbook / Cheque Proof',
    },
    attachments: [
      { id: 'att-4', fileName: 'Fuel_Voucher.pdf', type: 'Invoice', size: '610 KB' },
    ],
    approvalTimeline: [
      { stage: 'RH', role: 'Regional Head', approverName: 'Vikram Singh', decision: 'Approved', date: '2026-11-10 11:00', comments: 'Approved' },
      { stage: 'AVP', role: 'AVP Operations', approverName: 'Arjun Desai', decision: 'Approved', date: '2026-11-11 15:30', comments: 'Backup fuel validated.' },
      { stage: 'VP', role: 'VP Operations', approverName: 'Suresh Menon', decision: 'Approved', date: '2026-11-12 10:45', comments: 'Approved' },
      { stage: 'AE', role: 'Account Executive', approverName: 'Ramesh Agarwal', decision: 'Approved', date: '2026-11-13 14:00', comments: 'Checked bills and tax calculations.' },
      { stage: 'AM', role: 'Accounts Manager', approverName: 'Ashok Mehta', decision: 'Approved', date: '2026-11-14 16:30', comments: 'Final authorization granted. Forwarded to Accounts Processing.' },
    ],
    currentStage: 'Approved - Accounts Processing',
    ageDays: 6,
    createdAt: '2026-11-10T11:00:00Z',
  },
  {
    id: 'req-004',
    claimId: 'NPO-2026-W-000004',
    claimDate: '2026-11-16',
    financialYear: 'FY 2026-27',
    workflowStatus: WORKFLOW_STATUS.DRAFT,
    paymentStatus: PAYMENT_STATUS.NOT_APPLICABLE,
    employeeCode: 'EMP0000012',
    employeeName: 'Karan Malhotra',
    requesterRole: 'Operation Executive',
    region: 'W',
    expenseType: 'Reliever / Consultant',
    urgency: 'normal',
    incidentDate: null,
    categoryId: 'cat_rc_reliever',
    categoryName: 'Emergency Reliever Staff',
    billable: 'No',
    clientId: null,
    clientName: null,
    siteId: 'site-mh01',
    siteName: 'Godrej One - Vikhroli, Mumbai',
    costCentre: 'CC-MH01-OPS',
    expenseDate: '2026-11-16',
    claimReason: 'Temporary reliever staff arranged for night shifts during unexpected festive team crunch.',
    nonPoJustification: 'Staffing agency supplied immediate relievers; awaiting final timesheets before formal submit.',
    amountRequested: 15000.00,
    accountHolderName: 'Apex Staffing Solutions',
    bankName: 'Axis Bank, Thane Branch',
    bankAccountNo: '912010044556677',
    ifscCode: 'UTIB0000123',
    passbookImage: null,
    attachments: [],
    approvalTimeline: [],
    currentStage: 'Draft',
    ageDays: 0,
    createdAt: '2026-11-16T08:00:00Z',
  },
  {
    id: 'req-005',
    claimId: 'NPO-2026-W-000005',
    claimDate: '2026-11-05',
    financialYear: 'FY 2026-27',
    workflowStatus: WORKFLOW_STATUS.REJECTED,
    paymentStatus: PAYMENT_STATUS.NOT_APPLICABLE,
    employeeCode: 'EMP0000012',
    employeeName: 'Karan Malhotra',
    requesterRole: 'Operation Executive',
    region: 'W',
    expenseType: 'Other',
    urgency: 'normal',
    incidentDate: null,
    categoryId: 'cat_ot_gen',
    categoryName: 'Miscellaneous Unplanned Expense',
    billable: 'No',
    clientId: null,
    clientName: null,
    siteId: 'site-mh01',
    siteName: 'Godrej One - Vikhroli, Mumbai',
    costCentre: 'CC-MH01-OPS',
    expenseDate: '2026-11-05',
    claimReason: 'Office pantry emergency appliance breakdown replacement.',
    nonPoJustification: 'Item was urgent.',
    amountRequested: 12000.00,
    accountHolderName: 'Modern Home Appliances',
    bankName: 'Punjab National Bank, Vikhroli',
    bankAccountNo: '1899000100023456',
    ifscCode: 'PUNB0018900',
    passbookImage: {
      fileName: 'PNB_Cheque.jpg',
      size: '510 KB',
      type: 'Bank Passbook / Cheque Proof',
    },
    attachments: [
      { id: 'att-5', fileName: 'Bill.pdf', type: 'Invoice', size: '420 KB' },
    ],
    approvalTimeline: [
      {
        stage: 'RH',
        role: 'Regional Head',
        approverName: 'Vikram Singh',
        decision: 'Rejected',
        date: '2026-11-06 12:20',
        comments: 'Pantry appliances do not qualify as genuine site emergency. Please raise routine PO via admin procurement.',
      },
    ],
    currentStage: 'Rejected',
    ageDays: 11,
    createdAt: '2026-11-05T09:00:00Z',
  },
  {
    id: 'req-006',
    claimId: 'NPO-2026-W-000006',
    claimDate: '2026-11-15',
    financialYear: 'FY 2026-27',
    workflowStatus: WORKFLOW_STATUS.PENDING_VP,
    paymentStatus: PAYMENT_STATUS.NOT_APPLICABLE,
    employeeCode: 'EMP0000012',
    employeeName: 'Karan Malhotra',
    requesterRole: 'Operation Executive',
    region: 'W',
    expenseType: 'Emergency Repair',
    urgency: 'critical',
    incidentDate: '2026-11-14',
    categoryId: 'cat_er_fire',
    categoryName: 'Fire Safety & Damaged Equipment',
    billable: 'No',
    clientId: null,
    clientName: null,
    siteId: 'site-mh01',
    siteName: 'Godrej One - Vikhroli, Mumbai',
    costCentre: 'CC-MH01-OPS',
    expenseDate: '2026-11-15',
    claimReason: 'Fire sprinkler line joint burst in Basement B1. Immediate pressure welding required to avoid major water damage to electrical substation.',
    nonPoJustification: 'Critical life-safety issue on Sunday. Contractor called on emergency standby rates.',
    amountRequested: 64500.00,
    accountHolderName: 'FireShield Engineering Works',
    bankName: 'Axis Bank, Vikhroli West',
    bankAccountNo: '918020033445566',
    ifscCode: 'UTIB0000543',
    passbookImage: {
      fileName: 'FireShield_Cancelled_Cheque.jpg',
      size: '1.1 MB',
      type: 'Bank Passbook / Cheque Proof',
    },
    attachments: [
      { id: 'att-6a', fileName: 'Welding_Job_Sheet.pdf', type: 'Invoice', size: '1.2 MB' },
      { id: 'att-6b', fileName: 'Burst_Joint_Photo.jpg', type: 'Photo', size: '3.4 MB' },
    ],
    approvalTimeline: [
      { stage: 'RH', role: 'Regional Head', approverName: 'Vikram Singh', decision: 'Approved', date: '2026-11-15 11:30', comments: 'Critical safety repair approved urgently.' },
      { stage: 'AVP', role: 'AVP Operations', approverName: 'Arjun Desai', decision: 'Approved', date: '2026-11-15 16:45', comments: 'Verified site photo. Escalated to VP for high-value signoff.' },
      { stage: 'VP', role: 'VP Operations', approverName: null, decision: 'Pending', date: null, comments: null },
      { stage: 'AE', role: 'Account Executive', approverName: null, decision: null, date: null, comments: null },
      { stage: 'AM', role: 'Accounts Manager', approverName: null, decision: null, date: null, comments: null },
    ],
    currentStage: 'VP Operations',
    ageDays: 1,
    createdAt: '2026-11-15T08:30:00Z',
  },
  {
    id: 'req-007',
    claimId: 'NPO-2026-W-000007',
    claimDate: '2026-11-13',
    financialYear: 'FY 2026-27',
    workflowStatus: WORKFLOW_STATUS.PENDING_AE,
    paymentStatus: PAYMENT_STATUS.NOT_APPLICABLE,
    employeeCode: 'EMP0000045',
    employeeName: 'Rahul Deshmukh',
    requesterRole: 'Operation Manager',
    region: 'W',
    expenseType: 'Site Operational Expense',
    urgency: 'high',
    incidentDate: null,
    categoryId: 'cat_so_water',
    categoryName: 'Emergency Water Tanker Supply',
    billable: 'Yes',
    clientId: 'client-hdfc',
    clientName: 'HDFC Asset Management',
    siteId: 'site-mh02',
    siteName: 'BKC Financial Center, Mumbai',
    costCentre: 'CC-MH02-BKC',
    expenseDate: '2026-11-13',
    claimReason: 'Municipal water supply line broken by metro construction. 8 emergency water tankers hired for business continuity.',
    nonPoJustification: 'Local water tanker vendors do not accept PO terms. Immediate cash/NEFT disbursement required on delivery.',
    amountRequested: 42000.00,
    accountHolderName: 'Shree Krishna Water Suppliers',
    bankName: 'Kotak Mahindra Bank, Bandra Kurla Complex',
    bankAccountNo: '881122334455',
    ifscCode: 'KKBK0000678',
    passbookImage: {
      fileName: 'KrishnaWater_Passbook.jpg',
      size: '950 KB',
      type: 'Bank Passbook / Cheque Proof',
    },
    attachments: [
      { id: 'att-7a', fileName: 'Tanker_Log_Sheet.pdf', type: 'Invoice', size: '820 KB' },
    ],
    approvalTimeline: [
      { stage: 'RH', role: 'Regional Head', approverName: 'Vikram Singh', decision: 'Approved', date: '2026-11-13 15:00', comments: 'Approved due to metro outage.' },
      { stage: 'AVP', role: 'AVP Operations', approverName: 'Arjun Desai', decision: 'Approved', date: '2026-11-14 10:15', comments: 'Tanker slips verified.' },
      { stage: 'VP', role: 'VP Operations', approverName: 'Suresh Menon', decision: 'Approved', date: '2026-11-14 14:20', comments: 'Concurred. Sent to AE for tax validation.' },
      { stage: 'AE', role: 'Account Executive', approverName: null, decision: 'Pending', date: null, comments: null },
      { stage: 'AM', role: 'Accounts Manager', approverName: null, decision: null, date: null, comments: null },
    ],
    currentStage: 'Account Executive',
    ageDays: 3,
    createdAt: '2026-11-13T12:00:00Z',
  },
  {
    id: 'req-008',
    claimId: 'NPO-2026-W-000008',
    claimDate: '2026-11-11',
    financialYear: 'FY 2026-27',
    workflowStatus: WORKFLOW_STATUS.PENDING_AM,
    paymentStatus: PAYMENT_STATUS.NOT_APPLICABLE,
    employeeCode: 'EMP0000012',
    employeeName: 'Karan Malhotra',
    requesterRole: 'Operation Executive',
    region: 'W',
    expenseType: 'Reliever / Consultant',
    urgency: 'normal',
    incidentDate: null,
    categoryId: 'cat_rc_safety',
    categoryName: 'Third-party Safety Inspector',
    billable: 'No',
    clientId: null,
    clientName: null,
    siteId: 'site-mh01',
    siteName: 'Godrej One - Vikhroli, Mumbai',
    costCentre: 'CC-MH01-OPS',
    expenseDate: '2026-11-11',
    claimReason: 'Mandatory third-party structural stability safety inspection post monsoon ground movement audit.',
    nonPoJustification: 'Audit compliance report was due to municipal inspectorate within 48 hours to prevent site work stoppage order.',
    amountRequested: 35000.00,
    accountHolderName: 'Apex Structural Audits LLP',
    bankName: 'Canara Bank, Vikhroli West',
    bankAccountNo: '0234101088990',
    ifscCode: 'CNRB0000234',
    passbookImage: {
      fileName: 'ApexAudits_Cancelled_Cheque.jpg',
      size: '720 KB',
      type: 'Bank Passbook / Cheque Proof',
    },
    attachments: [
      { id: 'att-8', fileName: 'Structural_Audit_Report.pdf', type: 'Invoice', size: '2.5 MB' },
    ],
    approvalTimeline: [
      { stage: 'RH', role: 'Regional Head', approverName: 'Vikram Singh', decision: 'Approved', date: '2026-11-11 16:00', comments: 'Approved.' },
      { stage: 'AVP', role: 'AVP Operations', approverName: 'Arjun Desai', decision: 'Approved', date: '2026-11-12 11:30', comments: 'Approved.' },
      { stage: 'VP', role: 'VP Operations', approverName: 'Suresh Menon', decision: 'Approved', date: '2026-11-12 17:00', comments: 'Approved.' },
      { stage: 'AE', role: 'Account Executive', approverName: 'Ramesh Agarwal', decision: 'Approved', date: '2026-11-13 12:45', comments: 'TDS section 194J verified. Ready for AM final signoff.' },
      { stage: 'AM', role: 'Accounts Manager', approverName: null, decision: 'Pending', date: null, comments: null },
    ],
    currentStage: 'Accounts Manager',
    ageDays: 5,
    createdAt: '2026-11-11T14:30:00Z',
  },
]

// ─── DATA SERVICE FUNCTIONS ──────────────────────────────────────────────────
export const getSitesList = async () => {
  return [...MOCK_SITES]
}

export const getClientsList = async () => {
  return [...MOCK_CLIENTS]
}

export const getExpenseCategoriesByType = (expenseType) => {
  return EXPENSE_CATEGORIES_MAP[expenseType] || []
}

/**
 * Fetch all requests for the logged-in user's role.
 */
export const getMyExpenseRequests = async (userEmpCode) => {
  if (userEmpCode) {
    return mockExpenseRequests.filter((r) => r.employeeCode === userEmpCode)
  }
  return [...mockExpenseRequests]
}

/**
 * Fetch single claim by ID
 */
export const getExpenseRequestById = async (claimId) => {
  const req = mockExpenseRequests.find((r) => r.claimId === claimId || r.id === claimId)
  if (!req) throw new Error(`Claim not found with ID: ${claimId}`)
  return { ...req }
}

/**
 * Save draft or submit a new Non-PO Request
 */
export const createExpenseRequest = async (payload, isDraft = false) => {
  const newNum = String(mockExpenseRequests.length + 1).padStart(6, '0')
  const regionCode = payload.region || 'W'
  const yearStr = new Date().getFullYear()
  const claimNo = isDraft ? `DRAFT-${Date.now().toString().slice(-6)}` : `NPO-${yearStr}-${regionCode}-${newNum}`

  const newRecord = {
    id: `req-${Date.now()}`,
    claimId: claimNo,
    claimDate: new Date().toISOString().slice(0, 10),
    financialYear: `FY ${yearStr}-${String(yearStr + 1).slice(-2)}`,
    workflowStatus: isDraft ? WORKFLOW_STATUS.DRAFT : WORKFLOW_STATUS.PENDING_RH,
    paymentStatus: PAYMENT_STATUS.NOT_APPLICABLE,
    ...payload,
    approvalTimeline: isDraft
      ? []
      : [
          { stage: 'RH', role: 'Regional Head', approverName: null, decision: 'Pending', date: null, comments: null },
          { stage: 'AVP', role: 'AVP Operations', approverName: null, decision: null, date: null, comments: null },
          { stage: 'VP', role: 'VP Operations', approverName: null, decision: null, date: null, comments: null },
          { stage: 'AE', role: 'Account Executive', approverName: null, decision: null, date: null, comments: null },
          { stage: 'AM', role: 'Accounts Manager', approverName: null, decision: null, date: null, comments: null },
        ],
    currentStage: isDraft ? 'Draft' : 'Regional Head',
    ageDays: 0,
    createdAt: new Date().toISOString(),
  }

  mockExpenseRequests = [newRecord, ...mockExpenseRequests]
  return newRecord
}

/**
 * Update an existing draft request
 */
export const updateExpenseDraft = async (claimId, payload, submitNow = false) => {
  const idx = mockExpenseRequests.findIndex((r) => r.claimId === claimId || r.id === claimId)
  if (idx === -1) throw new Error('Claim draft not found')

  const existing = mockExpenseRequests[idx]
  const updated = {
    ...existing,
    ...payload,
    workflowStatus: submitNow ? WORKFLOW_STATUS.PENDING_RH : WORKFLOW_STATUS.DRAFT,
    currentStage: submitNow ? 'Regional Head' : 'Draft',
  }

  if (submitNow && existing.claimId.startsWith('DRAFT-')) {
    const yearStr = new Date().getFullYear()
    const newNum = String(idx + 1).padStart(6, '0')
    updated.claimId = `NPO-${yearStr}-${payload.region || 'W'}-${newNum}`
    updated.approvalTimeline = [
      { stage: 'RH', role: 'Regional Head', approverName: null, decision: 'Pending', date: null, comments: null },
      { stage: 'AVP', role: 'AVP Operations', approverName: null, decision: null, date: null, comments: null },
      { stage: 'VP', role: 'VP Operations', approverName: null, decision: null, date: null, comments: null },
      { stage: 'AE', role: 'Account Executive', approverName: null, decision: null, date: null, comments: null },
      { stage: 'AM', role: 'Accounts Manager', approverName: null, decision: null, date: null, comments: null },
    ]
  }

  mockExpenseRequests[idx] = updated
  return updated
}

/**
 * Approve a claim by current approver role
 * Sequence:
 * Pending RH -> Pending AVP
 * Pending AVP -> Pending VP
 * Pending VP -> Pending AE
 * Pending AE -> Pending AM
 * Pending AM -> Approved - Awaiting Accounts Processing
 */
export const approveExpenseRequest = async (claimId, approverRole = '', approverName = 'Authorized Approver', comments = 'Approved') => {
  // simulate realistic 1-second server action
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const idx = mockExpenseRequests.findIndex((r) => r.claimId === claimId || r.id === claimId)
  if (idx === -1) throw new Error(`Claim not found with ID: ${claimId}`)

  const claim = mockExpenseRequests[idx]
  let nextStatus = claim.workflowStatus
  let nextStage = claim.currentStage
  let stageCode = 'RH'

  if (claim.workflowStatus === WORKFLOW_STATUS.PENDING_RH) {
    nextStatus = WORKFLOW_STATUS.PENDING_AVP
    nextStage = 'AVP Operations'
    stageCode = 'RH'
  } else if (claim.workflowStatus === WORKFLOW_STATUS.PENDING_AVP) {
    nextStatus = WORKFLOW_STATUS.PENDING_VP
    nextStage = 'VP Operations'
    stageCode = 'AVP'
  } else if (claim.workflowStatus === WORKFLOW_STATUS.PENDING_VP) {
    nextStatus = WORKFLOW_STATUS.PENDING_AE
    nextStage = 'Account Executive'
    stageCode = 'VP'
  } else if (claim.workflowStatus === WORKFLOW_STATUS.PENDING_AE) {
    nextStatus = WORKFLOW_STATUS.PENDING_AM
    nextStage = 'Accounts Manager'
    stageCode = 'AE'
  } else if (claim.workflowStatus === WORKFLOW_STATUS.PENDING_AM) {
    nextStatus = WORKFLOW_STATUS.APPROVED_ACCOUNTS
    nextStage = 'Approved - Accounts Processing'
    stageCode = 'AM'
  }

  const now = new Date()
  const nowFormatted = `${now.toISOString().slice(0, 10)} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`

  const updatedTimeline = (claim.approvalTimeline || []).map((step) => {
    if (step.stage === stageCode) {
      return {
        ...step,
        approverName: approverName || 'Authorized Approver',
        decision: 'Approved',
        date: nowFormatted,
        comments: comments || 'Approved',
      }
    }
    // Mark next step as pending if applicable
    const nextStages = { RH: 'AVP', AVP: 'VP', VP: 'AE', AE: 'AM' }
    if (nextStages[stageCode] && step.stage === nextStages[stageCode]) {
      return {
        ...step,
        decision: 'Pending',
      }
    }
    return step
  })

  const updated = {
    ...claim,
    workflowStatus: nextStatus,
    currentStage: nextStage,
    approvalTimeline: updatedTimeline,
  }

  mockExpenseRequests[idx] = updated
  return updated
}

/**
 * Reject a claim with mandatory rejection reason
 */
export const rejectExpenseRequest = async (claimId, approverRole = '', approverName = 'Authorized Approver', rejectionReason = '') => {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const idx = mockExpenseRequests.findIndex((r) => r.claimId === claimId || r.id === claimId)
  if (idx === -1) throw new Error(`Claim not found with ID: ${claimId}`)

  const claim = mockExpenseRequests[idx]
  const now = new Date()
  const nowFormatted = `${now.toISOString().slice(0, 10)} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`

  let stageCode = 'RH'
  if (claim.workflowStatus === WORKFLOW_STATUS.PENDING_AVP) stageCode = 'AVP'
  else if (claim.workflowStatus === WORKFLOW_STATUS.PENDING_VP) stageCode = 'VP'
  else if (claim.workflowStatus === WORKFLOW_STATUS.PENDING_AE) stageCode = 'AE'
  else if (claim.workflowStatus === WORKFLOW_STATUS.PENDING_AM) stageCode = 'AM'

  const updatedTimeline = (claim.approvalTimeline || []).map((step) => {
    if (step.stage === stageCode) {
      return {
        ...step,
        approverName: approverName || 'Authorized Approver',
        decision: 'Rejected',
        date: nowFormatted,
        comments: rejectionReason,
      }
    }
    return step
  })

  const updated = {
    ...claim,
    workflowStatus: WORKFLOW_STATUS.REJECTED,
    currentStage: 'Rejected',
    rejectionReason,
    approvalTimeline: updatedTimeline,
  }

  mockExpenseRequests[idx] = updated
  return updated
}

/**
 * Fetch approvals relevant to the current role
 */
export const getPendingApprovalsForRole = async (role) => {
  let targetStatus = null
  if (role === 'regional-head' || role === 'line-manager') targetStatus = WORKFLOW_STATUS.PENDING_RH
  else if (role === 'avp-operations') targetStatus = WORKFLOW_STATUS.PENDING_AVP
  else if (role === 'vp-operations') targetStatus = WORKFLOW_STATUS.PENDING_VP
  else if (role === 'ae') targetStatus = WORKFLOW_STATUS.PENDING_AE
  else if (role === 'account-manager') targetStatus = WORKFLOW_STATUS.PENDING_AM

  return {
    pending: mockExpenseRequests.filter((r) => !targetStatus || r.workflowStatus === targetStatus),
    all: [...mockExpenseRequests],
  }
}

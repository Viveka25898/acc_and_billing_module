// Billing Module Constants and Dummy Data

export const INVOICE_TYPES = {
    REGULAR: 'REGULAR',
    ARREAR: 'ARREAR',
    BONUS: 'BONUS',
    R_AND_M: 'R&M',
    LEAVE_ENCASHMENT: 'LEAVE_ENCASHMENT'
};

export const INVOICE_SERIES = {
    PROFORMA: 'Proforma Invoice',
    SALES: 'Sales Invoice'
};

export const INVOICE_STATUS = {
    DRAFT: 'Draft',
    PENDING_APPROVAL: 'Pending Approval',
    APPROVED: 'Approved',
    IRN_GENERATED: 'IRN Generated',
    PAID: 'Paid',
    REJECTED: 'Rejected'
};

// Dummy Dashboard Stats
export const DASHBOARD_STATS = {
    monthlyRevenue: 1245000,
    pendingInvoices: 25,
    profitMargin: 18,
    activeClients: 42
};

// Dummy Recent Activities
export const RECENT_ACTIVITIES = [
    {
        id: 1,
        message: 'Invoice #INV-2024-045 generated for ABC Mall',
        timestamp: new Date().toISOString(),
        type: 'invoice_generated'
    },
    {
        id: 2,
        message: 'Rate card updated for XYZ Hospital',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        type: 'rate_card_updated'
    },
    {
        id: 3,
        message: 'Manual bill created for DEF Complex',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        type: 'manual_bill_created'
    }
];

// Dummy Clients
export const DUMMY_CLIENTS = [
    { id: 1, name: 'ABC Mall', branch: 'Mumbai', sites: 3, activeRateCards: 8, lastInvoiceAmount: 245000 },
    { id: 2, name: 'XYZ Hospital', branch: 'Delhi', sites: 5, activeRateCards: 12, lastInvoiceAmount: 385000 },
    { id: 3, name: 'DEF Complex', branch: 'Pune', sites: 2, activeRateCards: 5, lastInvoiceAmount: 145000 },
    { id: 4, name: 'GHI Shopping Center', branch: 'Mumbai', sites: 4, activeRateCards: 10, lastInvoiceAmount: 298000 }
];

// Dummy Branches
export const BRANCHES = [
    { id: 1, name: 'Mumbai', code: 'MH01' },
    { id: 2, name: 'Delhi', code: 'DL01' },
    { id: 3, name: 'Pune', code: 'MH02' },
    { id: 4, name: 'Bangalore', code: 'KA01' }
];

// Dummy Billing Cycles
export const BILLING_CYCLES = [
    { id: 1, name: '16th to 15th', cycleFrom: 16, cycleTo: 15 },
    { id: 2, name: '21st to 20th', cycleFrom: 21, cycleTo: 20 },
    { id: 3, name: '25th to 25th', cycleFrom: 25, cycleTo: 25 },
    { id: 4, name: '1st to End of Month', cycleFrom: 1, cycleTo: 'EOM' }
];

// Dummy Designations with Rates
export const DESIGNATIONS = [
    { id: 1, name: 'Housekeeper', category: 'Personnel', baseRate: 20000 },
    { id: 2, name: 'Office Boy', category: 'Personnel', baseRate: 20000 },
    { id: 3, name: 'Supervisor', category: 'Personnel', baseRate: 30000 },
    { id: 4, name: 'Security Guard', category: 'Personnel', baseRate: 20000 },
    { id: 5, name: 'Floor Scrubbing Machine', category: 'Machinery', baseRate: 5000 },
    { id: 6, name: 'Vacuum Cleaner (Industrial)', category: 'Machinery', baseRate: 2500 }
];

// GST Configuration
export const GST_CONFIG = {
    CGST: 9,
    SGST: 9,
    IGST: 18,
    total: 18
};

// HSN Codes
export const HSN_CODES = {
    SECURITY_SERVICES: '94903',
    CLEANING_SERVICES: '96090',
    MACHINERY_RENT: '99731'
};

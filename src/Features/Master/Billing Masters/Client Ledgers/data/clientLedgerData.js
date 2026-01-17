// Client Ledger Data - ABC Mall (D001)
export const abcMallLedgerData = {
    headerInfo: {
        clientCode: 'D001',
        clientName: 'ABC Mall',
        glAccountCode: 'A3003001',
        glAccountName: 'SUNDRY DEBTORS',
        location: 'Pune, India',
        gstin: '27AABCU9603R1ZX',
        pan: 'AABCU9603R',
        contactPerson: 'Rajesh Kumar',
        email: 'accounts@abcmall.com',
        phone: '+91 98765 43210',
        paymentTerms: 'Net 30 Days',
        creditLimit: '₹50,00,000',
        outstandingBalance: '₹3,85,420',
        openingBalance: '₹0',
        openingDate: '01-Apr-2025',
    },
    ledgerDetails: {
        totalInvoices: '₹8,45,600',
        totalPayments: '₹4,60,180',
        currentOutstanding: '₹3,85,420',
        entries: [
            {
                id: '1',
                date: '15-Nov-25',
                voucherNo: 'INV/ABC/2025/0001',
                entryType: 'Invoice',
                debit: '₹1,42,560.00',
                credit: '-',
                balance: '₹1,42,560.00 DR',
                narration: 'Invoice for Housekeeping Services - Nov 2025',
                refNo: 'PO/ABC/2025/001',
                counterparty: 'ABC Mall - Pune',
                type: 'HK Services',
                approvedBy: 'Amit Sharma',
                attachments: 'INV-001.pdf',
                costCenter: 'CC-PUNE-001',
            },
            {
                id: '2',
                date: '20-Nov-25',
                voucherNo: 'PAY/ABC/2025/0001',
                entryType: 'Payment',
                debit: '-',
                credit: '₹1,42,560.00',
                balance: '₹0.00',
                narration: 'Payment received via NEFT - INV-0001',
                refNo: 'NEFT234567890',
                counterparty: 'ABC Mall - Pune',
                type: 'Bank Transfer',
                approvedBy: 'Priya Mehta',
                attachments: 'Payment-001.pdf',
                costCenter: 'CC-PUNE-001',
            },
            {
                id: '3',
                date: '05-Dec-25',
                voucherNo: 'INV/ABC/2025/0002',
                entryType: 'Invoice',
                debit: '₹2,18,340.00',
                credit: '-',
                balance: '₹2,18,340.00 DR',
                narration: 'Invoice for HK Services + Manpower - Dec 2025',
                refNo: 'PO/ABC/2025/002',
                counterparty: 'ABC Mall - Pune',
                type: 'HK Services + Manpower',
                approvedBy: 'Amit Sharma',
                attachments: 'INV-002.pdf',
                costCenter: 'CC-PUNE-001',
            },
            {
                id: '4',
                date: '12-Dec-25',
                voucherNo: 'INV/ABC/2025/0003',
                entryType: 'Invoice',
                debit: '₹1,67,080.00',
                credit: '-',
                balance: '₹3,85,420.00 DR',
                narration: 'Invoice for Additional Cleaning Materials - Dec 2025',
                refNo: 'PO/ABC/2025/003',
                counterparty: 'ABC Mall - Pune',
                type: 'HK Materials',
                approvedBy: 'Amit Sharma',
                attachments: 'INV-003.pdf',
                costCenter: 'CC-PUNE-001',
            },
            {
                id: '5',
                date: '18-Dec-25',
                voucherNo: 'PAY/ABC/2025/0002',
                entryType: 'Payment',
                debit: '-',
                credit: '₹3,17,620.00',
                balance: '₹67,800.00 DR',
                narration: 'Partial payment received via RTGS - INV-0002, INV-0003',
                refNo: 'RTGS876543210',
                counterparty: 'ABC Mall - Pune',
                type: 'Bank Transfer',
                approvedBy: 'Priya Mehta',
                attachments: 'Payment-002.pdf',
                costCenter: 'CC-PUNE-001',
            },
        ],
    },
    summary: {
        totalDebit: '₹8,45,600.00',
        totalCredit: '₹4,60,180.00',
        closingBalance: '₹3,85,420.00 DR',
        agingAnalysis: {
            current: '₹67,800.00',
            days_30: '₹1,67,080.00',
            days_60: '₹1,50,540.00',
            above_60: '₹0.00',
        },
    },
}

// Function to get client ledger from localStorage
export const getClientLedgerData = (clientCode) => {
    try {
        const clientLedgers = JSON.parse(localStorage.getItem('clientLedgers')) || {}
        return clientLedgers[clientCode] || null
    } catch (error) {
        console.error('Error loading client ledger:', error)
        return null
    }
}

// Function to save client ledger to localStorage
export const saveClientLedgerData = (clientCode, ledgerData) => {
    try {
        const clientLedgers = JSON.parse(localStorage.getItem('clientLedgers')) || {}
        clientLedgers[clientCode] = ledgerData
        localStorage.setItem('clientLedgers', JSON.stringify(clientLedgers))
        return true
    } catch (error) {
        console.error('Error saving client ledger:', error)
        return false
    }
}

// Initialize ABC Mall ledger in localStorage
export const initializeABCMallLedger = () => {
    const existing = getClientLedgerData('D001')
    if (!existing) {
        saveClientLedgerData('D001', abcMallLedgerData)
    }
}

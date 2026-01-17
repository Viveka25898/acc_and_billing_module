// House Keeping Charges Revenue Ledger Data - R1001001
export const houseKeepingRevenueData = {
    headerInfo: {
        accountCode: 'R1001001',
        accountName: 'HOUSE KEEPING CHARGES',
        accountType: 'REVENUE',
        parentAccount: 'REVENUE',
        parentCode: 'R1001',
        category: 'Direct Income',
        description: 'Revenue from housekeeping services provided to clients',
        openingBalance: '₹0.00',
        openingDate: '01-Apr-2025',
    },
    ledgerDetails: {
        totalCredit: '₹15,25,400.00',
        totalDebit: '₹2,18,500.00',
        netRevenue: '₹13,06,900.00',
        entries: [
            {
                id: '1',
                date: '10-Nov-25',
                voucher: 'INV/ABC/2025/0001',
                entryType: 'Sales Invoice',
                credit: '₹2,45,800.00',
                debit: '-',
                balance: '₹2,45,800.00 CR',
                narration: 'Housekeeping services provided to ABC Mall - November 2025',
                refNo: 'INV-ABC-001',
                counterparty: 'ABC Mall - Pune',
                type: 'Service Revenue',
                approvedBy: 'Amit Sharma',
                attachments: 'INV-ABC-001.pdf',
                costCenter: 'CC-PUNE-001',
            },
            {
                id: '2',
                date: '15-Nov-25',
                voucher: 'JV/REV/2025/0045',
                entryType: 'Journal Entry',
                credit: '-',
                debit: '₹45,800.00',
                balance: '₹2,00,000.00 CR',
                narration: 'Reversal of over-billed amount - Invoice correction',
                refNo: 'JV-2025-045',
                counterparty: 'ABC Mall - Pune',
                type: 'Reversal',
                approvedBy: 'Priya Mehta',
                attachments: 'JV-045.pdf',
                costCenter: 'CC-PUNE-001',
            },
            {
                id: '3',
                date: '22-Nov-25',
                voucher: 'INV/XYZ/2025/0102',
                entryType: 'Sales Invoice',
                credit: '₹3,78,200.00',
                debit: '-',
                balance: '₹5,78,200.00 CR',
                narration: 'Monthly HK services - XYZ Corporate Tower - November 2025',
                refNo: 'INV-XYZ-102',
                counterparty: 'XYZ Corporate Tower - Mumbai',
                type: 'Service Revenue',
                approvedBy: 'Amit Sharma',
                attachments: 'INV-XYZ-102.pdf',
                costCenter: 'CC-MUM-002',
            },
            {
                id: '4',
                date: '05-Dec-25',
                voucher: 'INV/PQR/2025/0215',
                entryType: 'Sales Invoice',
                credit: '₹4,56,900.00',
                debit: '-',
                balance: '₹10,35,100.00 CR',
                narration: 'HK services + Deep cleaning - PQR Mall - December 2025',
                refNo: 'INV-PQR-215',
                counterparty: 'PQR Mall - Delhi',
                type: 'Service Revenue',
                approvedBy: 'Amit Sharma',
                attachments: 'INV-PQR-215.pdf',
                costCenter: 'CC-DEL-003',
            },
            {
                id: '5',
                date: '12-Dec-25',
                voucher: 'CN/ABC/2025/0008',
                entryType: 'Credit Note',
                credit: '-',
                debit: '₹1,72,700.00',
                balance: '₹8,62,400.00 CR',
                narration: 'Credit note issued for service quality issues - ABC Mall',
                refNo: 'CN-2025-008',
                counterparty: 'ABC Mall - Pune',
                type: 'Credit Note',
                approvedBy: 'Vinod Pandey',
                attachments: 'CN-008.pdf',
                costCenter: 'CC-PUNE-001',
            },
            {
                id: '6',
                date: '18-Dec-25',
                voucher: 'INV/LMN/2025/0324',
                entryType: 'Sales Invoice',
                credit: '₹4,44,500.00',
                debit: '-',
                balance: '₹13,06,900.00 CR',
                narration: 'Housekeeping services - LMN IT Park - December 2025',
                refNo: 'INV-LMN-324',
                counterparty: 'LMN IT Park - Bangalore',
                type: 'Service Revenue',
                approvedBy: 'Amit Sharma',
                attachments: 'INV-LMN-324.pdf',
                costCenter: 'CC-BLR-004',
            },
        ],
    },
    summary: {
        totalCredit: '₹15,25,400.00',
        totalDebit: '₹2,18,500.00',
        netRevenue: '₹13,06,900.00',
        transactionCount: 6,
        averageTransaction: '₹2,17,900.00',
        monthlyStats: {
            november: '₹5,78,200.00',
            december: '₹7,28,700.00',
        },
    },
}

// Function to get revenue ledger from localStorage
export const getRevenueLedgerData = (accountCode) => {
    try {
        const revenueLedgers = JSON.parse(localStorage.getItem('revenueLedgers')) || {}
        return revenueLedgers[accountCode] || null
    } catch (error) {
        console.error('Error loading revenue ledger:', error)
        return null
    }
}

// Function to save revenue ledger to localStorage
export const saveRevenueLedgerData = (accountCode, ledgerData) => {
    try {
        const revenueLedgers = JSON.parse(localStorage.getItem('revenueLedgers')) || {}
        revenueLedgers[accountCode] = ledgerData
        localStorage.setItem('revenueLedgers', JSON.stringify(revenueLedgers))
        return true
    } catch (error) {
        console.error('Error saving revenue ledger:', error)
        return false
    }
}

// Initialize House Keeping Charges ledger in localStorage
export const initializeHouseKeepingRevenueLedger = () => {
    try {
        const existing = getRevenueLedgerData('R1001001')
        if (!existing) {
            saveRevenueLedgerData('R1001001', houseKeepingRevenueData)
            console.log('✅ House Keeping Charges Revenue Ledger initialized')
            return true
        }
        return false
    } catch (error) {
        console.error('Error initializing House Keeping Revenue Ledger:', error)
        return false
    }
}

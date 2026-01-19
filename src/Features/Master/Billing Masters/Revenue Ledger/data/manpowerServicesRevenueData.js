// Manpower Services Revenue Ledger Data - R1001009
export const manpowerServicesRevenueData = {
    headerInfo: {
        accountCode: 'R1001009',
        accountName: 'MANPOWER SERVICES',
        accountType: 'REVENUE',
        parentAccount: 'REVENUE',
        parentCode: 'R1001',
        category: 'Direct Income - Manpower Services',
        description: 'Revenue from manpower supply and staffing services',
        openingBalance: '₹0.00',
        openingDate: '01-Apr-2025',
    },
    ledgerDetails: {
        totalCredit: '₹15,85,400.00',
        totalDebit: '₹95,600.00',
        netRevenue: '₹14,89,800.00',
        entries: [
            {
                id: '1',
                date: '03-Nov-25',
                voucher: 'INV/MP/2025/0011',
                entryType: 'Sales Invoice',
                credit: '₹3,45,800.00',
                debit: '-',
                balance: '₹3,45,800.00 CR',
                narration: 'Manpower supply services - 25 housekeeping staff - ABC Mall November 2025',
                refNo: 'INV-MP-011',
                counterparty: 'ABC Mall - Pune',
                type: 'Manpower Services Revenue',
                approvedBy: 'Suresh Patil',
                attachments: 'INV-MP-011.pdf',
                costCenter: 'CC-PUNE-001',
            },
            {
                id: '2',
                date: '08-Nov-25',
                voucher: 'INV/MP/2025/0023',
                entryType: 'Sales Invoice',
                credit: '₹4,85,600.00',
                debit: '-',
                balance: '₹8,31,400.00 CR',
                narration: 'Manpower services - 35 cleaning & maintenance staff - PQR Complex November 2025',
                refNo: 'INV-MP-023',
                counterparty: 'PQR Complex - Mumbai',
                type: 'Manpower Services Revenue',
                approvedBy: 'Priya Desai',
                attachments: 'INV-MP-023.pdf',
                costCenter: 'CC-MUM-002',
            },
            {
                id: '3',
                date: '14-Nov-25',
                voucher: 'JV/REV/2025/0071',
                entryType: 'Journal Entry',
                credit: '-',
                debit: '₹55,600.00',
                balance: '₹7,75,800.00 CR',
                narration: 'Staff absence penalty deduction - ABC Mall',
                refNo: 'JV-2025-071',
                counterparty: 'ABC Mall - Pune',
                type: 'Deduction',
                approvedBy: 'Rajesh Kumar',
                attachments: 'JV-071.pdf',
                costCenter: 'CC-PUNE-001',
            },
            {
                id: '4',
                date: '19-Nov-25',
                voucher: 'INV/MP/2025/0037',
                entryType: 'Sales Invoice',
                credit: '₹3,95,200.00',
                debit: '-',
                balance: '₹11,71,000.00 CR',
                narration: 'Manpower supply - 28 housekeeping & supervisor staff - XYZ Tower November 2025',
                refNo: 'INV-MP-037',
                counterparty: 'XYZ Tower - Bangalore',
                type: 'Manpower Services Revenue',
                approvedBy: 'Lakshmi Rao',
                attachments: 'INV-MP-037.pdf',
                costCenter: 'CC-BLR-003',
            },
            {
                id: '5',
                date: '23-Nov-25',
                voucher: 'JV/REV/2025/0083',
                entryType: 'Journal Entry',
                credit: '-',
                debit: '₹40,000.00',
                balance: '₹11,31,000.00 CR',
                narration: 'Performance penalty - Quality issues - PQR Complex',
                refNo: 'JV-2025-083',
                counterparty: 'PQR Complex - Mumbai',
                type: 'Adjustment',
                approvedBy: 'Amit Joshi',
                attachments: 'JV-083.pdf',
                costCenter: 'CC-MUM-002',
            },
            {
                id: '6',
                date: '28-Nov-25',
                voucher: 'INV/MP/2025/0049',
                entryType: 'Sales Invoice',
                credit: '₹3,58,800.00',
                debit: '-',
                balance: '₹14,89,800.00 CR',
                narration: 'Manpower services - 30 cleaning staff & 2 supervisors - LMN Plaza November 2025',
                refNo: 'INV-MP-049',
                counterparty: 'LMN Plaza - Delhi',
                type: 'Manpower Services Revenue',
                approvedBy: 'Neha Gupta',
                attachments: 'INV-MP-049.pdf',
                costCenter: 'CC-DEL-001',
            },
        ],
    },
}

// Initialize Manpower Services Revenue Ledger in localStorage
export const initializeManpowerServicesRevenueLedger = () => {
    try {
        const existingData = localStorage.getItem('revenueLedgers')
        const revenueLedgers = existingData ? JSON.parse(existingData) : {}

        if (!revenueLedgers['R1001009']) {
            revenueLedgers['R1001009'] = manpowerServicesRevenueData
            localStorage.setItem('revenueLedgers', JSON.stringify(revenueLedgers))
            console.log('✅ Manpower Services Revenue Ledger (R1001009) initialized in localStorage')
        } else {
            console.log('ℹ️ Manpower Services Revenue Ledger (R1001009) already exists in localStorage')
        }
    } catch (error) {
        console.error('❌ Error initializing Manpower Services Revenue ledger:', error)
    }
}

// Get Revenue Ledger Data from localStorage
export const getRevenueLedgerData = (accountCode) => {
    try {
        const existingData = localStorage.getItem('revenueLedgers')
        if (existingData) {
            const revenueLedgers = JSON.parse(existingData)
            return revenueLedgers[accountCode]
        }
        return null
    } catch (error) {
        console.error('❌ Error fetching revenue ledger data:', error)
        return null
    }
}

// Update Revenue Ledger Data in localStorage
export const updateRevenueLedgerData = (accountCode, updatedData) => {
    try {
        const existingData = localStorage.getItem('revenueLedgers')
        const revenueLedgers = existingData ? JSON.parse(existingData) : {}
        revenueLedgers[accountCode] = updatedData
        localStorage.setItem('revenueLedgers', JSON.stringify(revenueLedgers))
        console.log(`✅ Revenue Ledger ${accountCode} updated in localStorage`)
        return true
    } catch (error) {
        console.error('❌ Error updating revenue ledger data:', error)
        return false
    }
}

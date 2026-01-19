// Pest Control Charges Revenue Ledger Data - R1001010
export const pestControlRevenueData = {
    headerInfo: {
        accountCode: 'R1001010',
        accountName: 'PEST CONTROL CHARGES',
        accountType: 'REVENUE',
        parentAccount: 'REVENUE',
        parentCode: 'R1001',
        category: 'Direct Income - Pest Control Services',
        description: 'Revenue from pest control and fumigation services',
        openingBalance: '₹0.00',
        openingDate: '01-Apr-2025',
    },
    ledgerDetails: {
        totalCredit: '₹6,75,800.00',
        totalDebit: '₹35,400.00',
        netRevenue: '₹6,40,400.00',
        entries: [
            {
                id: '1',
                date: '06-Nov-25',
                voucher: 'INV/PC/2025/0009',
                entryType: 'Sales Invoice',
                credit: '₹1,25,600.00',
                debit: '-',
                balance: '₹1,25,600.00 CR',
                narration: 'Monthly pest control services - General pest treatment - ABC Mall November 2025',
                refNo: 'INV-PC-009',
                counterparty: 'ABC Mall - Pune',
                type: 'Pest Control Revenue',
                approvedBy: 'Suresh Patil',
                attachments: 'INV-PC-009.pdf',
                costCenter: 'CC-PUNE-001',
            },
            {
                id: '2',
                date: '12-Nov-25',
                voucher: 'INV/PC/2025/0018',
                entryType: 'Sales Invoice',
                credit: '₹1,85,400.00',
                debit: '-',
                balance: '₹3,11,000.00 CR',
                narration: 'Pest control & fumigation services - Rodent & termite control - PQR Complex November 2025',
                refNo: 'INV-PC-018',
                counterparty: 'PQR Complex - Mumbai',
                type: 'Pest Control Revenue',
                approvedBy: 'Priya Desai',
                attachments: 'INV-PC-018.pdf',
                costCenter: 'CC-MUM-002',
            },
            {
                id: '3',
                date: '17-Nov-25',
                voucher: 'JV/REV/2025/0075',
                entryType: 'Journal Entry',
                credit: '-',
                debit: '₹18,400.00',
                balance: '₹2,92,600.00 CR',
                narration: 'Service quality complaint adjustment - ABC Mall',
                refNo: 'JV-2025-075',
                counterparty: 'ABC Mall - Pune',
                type: 'Adjustment',
                approvedBy: 'Rajesh Kumar',
                attachments: 'JV-075.pdf',
                costCenter: 'CC-PUNE-001',
            },
            {
                id: '4',
                date: '21-Nov-25',
                voucher: 'INV/PC/2025/0029',
                entryType: 'Sales Invoice',
                credit: '₹1,45,300.00',
                debit: '-',
                balance: '₹4,37,900.00 CR',
                narration: 'Comprehensive pest control - Cockroach & ant treatment - XYZ Tower November 2025',
                refNo: 'INV-PC-029',
                counterparty: 'XYZ Tower - Bangalore',
                type: 'Pest Control Revenue',
                approvedBy: 'Lakshmi Rao',
                attachments: 'INV-PC-029.pdf',
                costCenter: 'CC-BLR-003',
            },
            {
                id: '5',
                date: '25-Nov-25',
                voucher: 'JV/REV/2025/0087',
                entryType: 'Journal Entry',
                credit: '-',
                debit: '₹17,000.00',
                balance: '₹4,20,900.00 CR',
                narration: 'Re-treatment charges waiver - PQR Complex',
                refNo: 'JV-2025-087',
                counterparty: 'PQR Complex - Mumbai',
                type: 'Deduction',
                approvedBy: 'Amit Joshi',
                attachments: 'JV-087.pdf',
                costCenter: 'CC-MUM-002',
            },
            {
                id: '6',
                date: '29-Nov-25',
                voucher: 'INV/PC/2025/0041',
                entryType: 'Sales Invoice',
                credit: '₹2,19,500.00',
                debit: '-',
                balance: '₹6,40,400.00 CR',
                narration: 'Pest control services - Mosquito fogging & termite control - LMN Plaza November 2025',
                refNo: 'INV-PC-041',
                counterparty: 'LMN Plaza - Delhi',
                type: 'Pest Control Revenue',
                approvedBy: 'Neha Gupta',
                attachments: 'INV-PC-041.pdf',
                costCenter: 'CC-DEL-001',
            },
        ],
    },
}

// Initialize Pest Control Revenue Ledger in localStorage
export const initializePestControlRevenueLedger = () => {
    try {
        const existingData = localStorage.getItem('revenueLedgers')
        const revenueLedgers = existingData ? JSON.parse(existingData) : {}

        if (!revenueLedgers['R1001010']) {
            revenueLedgers['R1001010'] = pestControlRevenueData
            localStorage.setItem('revenueLedgers', JSON.stringify(revenueLedgers))
            console.log('✅ Pest Control Revenue Ledger (R1001010) initialized in localStorage')
        } else {
            console.log('ℹ️ Pest Control Revenue Ledger (R1001010) already exists in localStorage')
        }
    } catch (error) {
        console.error('❌ Error initializing Pest Control Revenue ledger:', error)
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

// House Keeping Charges (Exempt) Revenue Ledger Data - R1001002
export const houseKeepingExemptRevenueData = {
    headerInfo: {
        accountCode: 'R1001002',
        accountName: 'HOUSE KEEPING CHARGES (EXEMPT)',
        accountType: 'REVENUE',
        parentAccount: 'REVENUE',
        parentCode: 'R1001',
        category: 'Direct Income - Exempt',
        description: 'Revenue from housekeeping services (GST Exempt)',
        openingBalance: '₹0.00',
        openingDate: '01-Apr-2025',
    },
    ledgerDetails: {
        totalCredit: '₹8,45,600.00',
        totalDebit: '₹1,12,300.00',
        netRevenue: '₹7,33,300.00',
        entries: [
            {
                id: '1',
                date: '05-Nov-25',
                voucher: 'INV/XYZ/2025/0015',
                entryType: 'Sales Invoice',
                credit: '₹1,85,400.00',
                debit: '-',
                balance: '₹1,85,400.00 CR',
                narration: 'Housekeeping services (Exempt) - XYZ Complex November 2025',
                refNo: 'INV-XYZ-015',
                counterparty: 'XYZ Complex - Mumbai',
                type: 'Service Revenue - Exempt',
                approvedBy: 'Rajesh Kumar',
                attachments: 'INV-XYZ-015.pdf',
                costCenter: 'CC-MUM-002',
            },
            {
                id: '2',
                date: '12-Nov-25',
                voucher: 'INV/PQR/2025/0022',
                entryType: 'Sales Invoice',
                credit: '₹2,25,800.00',
                debit: '-',
                balance: '₹4,11,200.00 CR',
                narration: 'Exempt housekeeping services - PQR Mall November 2025',
                refNo: 'INV-PQR-022',
                counterparty: 'PQR Mall - Delhi',
                type: 'Service Revenue - Exempt',
                approvedBy: 'Neha Sharma',
                attachments: 'INV-PQR-022.pdf',
                costCenter: 'CC-DEL-001',
            },
            {
                id: '3',
                date: '18-Nov-25',
                voucher: 'JV/REV/2025/0067',
                entryType: 'Journal Entry',
                credit: '-',
                debit: '₹55,400.00',
                balance: '₹3,55,800.00 CR',
                narration: 'Discount provided - Early payment incentive XYZ Complex',
                refNo: 'JV-2025-067',
                counterparty: 'XYZ Complex - Mumbai',
                type: 'Discount',
                approvedBy: 'Vikram Patel',
                attachments: 'JV-067.pdf',
                costCenter: 'CC-MUM-002',
            },
            {
                id: '4',
                date: '22-Nov-25',
                voucher: 'INV/LMN/2025/0031',
                entryType: 'Sales Invoice',
                credit: '₹3,15,200.00',
                debit: '-',
                balance: '₹6,71,000.00 CR',
                narration: 'Housekeeping services (Exempt) - LMN Tower November 2025',
                refNo: 'INV-LMN-031',
                counterparty: 'LMN Tower - Bangalore',
                type: 'Service Revenue - Exempt',
                approvedBy: 'Anjali Reddy',
                attachments: 'INV-LMN-031.pdf',
                costCenter: 'CC-BLR-003',
            },
            {
                id: '5',
                date: '25-Nov-25',
                voucher: 'JV/REV/2025/0072',
                entryType: 'Journal Entry',
                credit: '-',
                debit: '₹56,900.00',
                balance: '₹6,14,100.00 CR',
                narration: 'Service quality penalty deduction - PQR Mall',
                refNo: 'JV-2025-072',
                counterparty: 'PQR Mall - Delhi',
                type: 'Penalty',
                approvedBy: 'Suresh Verma',
                attachments: 'JV-072.pdf',
                costCenter: 'CC-DEL-001',
            },
            {
                id: '6',
                date: '28-Nov-25',
                voucher: 'INV/STU/2025/0048',
                entryType: 'Sales Invoice',
                credit: '₹1,19,200.00',
                debit: '-',
                balance: '₹7,33,300.00 CR',
                narration: 'Exempt housekeeping services - STU Plaza November 2025',
                refNo: 'INV-STU-048',
                counterparty: 'STU Plaza - Hyderabad',
                type: 'Service Revenue - Exempt',
                approvedBy: 'Priya Singh',
                attachments: 'INV-STU-048.pdf',
                costCenter: 'CC-HYD-004',
            },
        ],
    },
}

// Initialize House Keeping Exempt Revenue Ledger in localStorage
export const initializeHouseKeepingExemptRevenueLedger = () => {
    try {
        const existingData = localStorage.getItem('revenueLedgers')
        const revenueLedgers = existingData ? JSON.parse(existingData) : {}

        if (!revenueLedgers['R1001002']) {
            revenueLedgers['R1001002'] = houseKeepingExemptRevenueData
            localStorage.setItem('revenueLedgers', JSON.stringify(revenueLedgers))
            console.log('✅ House Keeping Exempt Revenue Ledger (R1001002) initialized in localStorage')
        } else {
            console.log('ℹ️ House Keeping Exempt Revenue Ledger (R1001002) already exists in localStorage')
        }
    } catch (error) {
        console.error('❌ Error initializing House Keeping Exempt Revenue ledger:', error)
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

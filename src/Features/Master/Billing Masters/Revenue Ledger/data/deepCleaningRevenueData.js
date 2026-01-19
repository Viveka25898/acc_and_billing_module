// Deep Cleaning Charges Revenue Ledger Data - R1001007
export const deepCleaningRevenueData = {
    headerInfo: {
        accountCode: 'R1001007',
        accountName: 'DEEP CLEANING CHARGES',
        accountType: 'REVENUE',
        parentAccount: 'REVENUE',
        parentCode: 'R1001',
        category: 'Direct Income - Deep Cleaning',
        description: 'Revenue from deep cleaning services',
        openingBalance: '₹0.00',
        openingDate: '01-Apr-2025',
    },
    ledgerDetails: {
        totalCredit: '₹11,45,900.00',
        totalDebit: '₹1,35,200.00',
        netRevenue: '₹10,10,700.00',
        entries: [
            {
                id: '1',
                date: '10-Nov-25',
                voucher: 'INV/DC/2025/0014',
                entryType: 'Sales Invoice',
                credit: '₹2,65,400.00',
                debit: '-',
                balance: '₹2,65,400.00 CR',
                narration: 'Deep cleaning services - ABC Mall November 2025',
                refNo: 'INV-DC-014',
                counterparty: 'ABC Mall - Pune',
                type: 'Deep Cleaning Revenue',
                approvedBy: 'Suresh Patil',
                attachments: 'INV-DC-014.pdf',
                costCenter: 'CC-PUNE-001',
            },
            {
                id: '2',
                date: '15-Nov-25',
                voucher: 'INV/DC/2025/0027',
                entryType: 'Sales Invoice',
                credit: '₹3,25,800.00',
                debit: '-',
                balance: '₹5,91,200.00 CR',
                narration: 'Deep cleaning and sanitization - PQR Complex November 2025',
                refNo: 'INV-DC-027',
                counterparty: 'PQR Complex - Mumbai',
                type: 'Deep Cleaning Revenue',
                approvedBy: 'Priya Desai',
                attachments: 'INV-DC-027.pdf',
                costCenter: 'CC-MUM-002',
            },
            {
                id: '3',
                date: '20-Nov-25',
                voucher: 'JV/REV/2025/0086',
                entryType: 'Journal Entry',
                credit: '-',
                debit: '₹75,200.00',
                balance: '₹5,16,000.00 CR',
                narration: 'Service quality issue adjustment - ABC Mall',
                refNo: 'JV-2025-086',
                counterparty: 'ABC Mall - Pune',
                type: 'Adjustment',
                approvedBy: 'Rajesh Kumar',
                attachments: 'JV-086.pdf',
                costCenter: 'CC-PUNE-001',
            },
            {
                id: '4',
                date: '24-Nov-25',
                voucher: 'INV/DC/2025/0039',
                entryType: 'Sales Invoice',
                credit: '₹2,85,600.00',
                debit: '-',
                balance: '₹8,01,600.00 CR',
                narration: 'Comprehensive deep cleaning - XYZ Tower November 2025',
                refNo: 'INV-DC-039',
                counterparty: 'XYZ Tower - Bangalore',
                type: 'Deep Cleaning Revenue',
                approvedBy: 'Lakshmi Rao',
                attachments: 'INV-DC-039.pdf',
                costCenter: 'CC-BLR-003',
            },
            {
                id: '5',
                date: '27-Nov-25',
                voucher: 'JV/REV/2025/0097',
                entryType: 'Journal Entry',
                credit: '-',
                debit: '₹60,000.00',
                balance: '₹7,41,600.00 CR',
                narration: 'Rework charges deduction - PQR Complex',
                refNo: 'JV-2025-097',
                counterparty: 'PQR Complex - Mumbai',
                type: 'Deduction',
                approvedBy: 'Amit Joshi',
                attachments: 'JV-097.pdf',
                costCenter: 'CC-MUM-002',
            },
            {
                id: '6',
                date: '30-Nov-25',
                voucher: 'INV/DC/2025/0054',
                entryType: 'Sales Invoice',
                credit: '₹2,69,100.00',
                debit: '-',
                balance: '₹10,10,700.00 CR',
                narration: 'Deep cleaning and disinfection - LMN Plaza November 2025',
                refNo: 'INV-DC-054',
                counterparty: 'LMN Plaza - Delhi',
                type: 'Deep Cleaning Revenue',
                approvedBy: 'Neha Gupta',
                attachments: 'INV-DC-054.pdf',
                costCenter: 'CC-DEL-001',
            },
        ],
    },
}

// Initialize Deep Cleaning Revenue Ledger in localStorage
export const initializeDeepCleaningRevenueLedger = () => {
    try {
        const existingData = localStorage.getItem('revenueLedgers')
        const revenueLedgers = existingData ? JSON.parse(existingData) : {}

        if (!revenueLedgers['R1001007']) {
            revenueLedgers['R1001007'] = deepCleaningRevenueData
            localStorage.setItem('revenueLedgers', JSON.stringify(revenueLedgers))
            console.log('✅ Deep Cleaning Revenue Ledger (R1001007) initialized in localStorage')
        } else {
            console.log('ℹ️ Deep Cleaning Revenue Ledger (R1001007) already exists in localStorage')
        }
    } catch (error) {
        console.error('❌ Error initializing Deep Cleaning Revenue ledger:', error)
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

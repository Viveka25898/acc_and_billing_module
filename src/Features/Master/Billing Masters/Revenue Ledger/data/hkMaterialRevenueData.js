// HK Material Revenue Ledger Data - R1001005001
export const hkMaterialRevenueData = {
    headerInfo: {
        accountCode: 'R1001005001',
        accountName: 'HK MATERIAL',
        accountType: 'REVENUE',
        parentAccount: 'CLEANING MATERIAL',
        parentCode: 'R1001006',
        category: 'Direct Income - Material Sales',
        description: 'Revenue from housekeeping material sales',
        openingBalance: '₹0.00',
        openingDate: '01-Apr-2025',
    },
    ledgerDetails: {
        totalCredit: '₹9,85,300.00',
        totalDebit: '₹1,25,400.00',
        netRevenue: '₹8,59,900.00',
        entries: [
            {
                id: '1',
                date: '07-Nov-25',
                voucher: 'INV/MAT/2025/0021',
                entryType: 'Sales Invoice',
                credit: '₹1,85,600.00',
                debit: '-',
                balance: '₹1,85,600.00 CR',
                narration: 'HK material supply - ABC Mall November 2025',
                refNo: 'INV-MAT-021',
                counterparty: 'ABC Mall - Pune',
                type: 'Material Revenue',
                approvedBy: 'Manoj Patil',
                attachments: 'INV-MAT-021.pdf',
                costCenter: 'CC-PUNE-001',
            },
            {
                id: '2',
                date: '12-Nov-25',
                voucher: 'INV/MAT/2025/0029',
                entryType: 'Sales Invoice',
                credit: '₹2,45,800.00',
                debit: '-',
                balance: '₹4,31,400.00 CR',
                narration: 'Housekeeping materials - PQR Complex November 2025',
                refNo: 'INV-MAT-029',
                counterparty: 'PQR Complex - Mumbai',
                type: 'Material Revenue',
                approvedBy: 'Sneha Deshmukh',
                attachments: 'INV-MAT-029.pdf',
                costCenter: 'CC-MUM-002',
            },
            {
                id: '3',
                date: '17-Nov-25',
                voucher: 'JV/REV/2025/0078',
                entryType: 'Journal Entry',
                credit: '-',
                debit: '₹65,200.00',
                balance: '₹3,66,200.00 CR',
                narration: 'Material return adjustment - ABC Mall',
                refNo: 'JV-2025-078',
                counterparty: 'ABC Mall - Pune',
                type: 'Return',
                approvedBy: 'Rajesh Kulkarni',
                attachments: 'JV-078.pdf',
                costCenter: 'CC-PUNE-001',
            },
            {
                id: '4',
                date: '22-Nov-25',
                voucher: 'INV/MAT/2025/0038',
                entryType: 'Sales Invoice',
                credit: '₹3,15,700.00',
                debit: '-',
                balance: '₹6,81,900.00 CR',
                narration: 'HK material supply - XYZ Tower November 2025',
                refNo: 'INV-MAT-038',
                counterparty: 'XYZ Tower - Bangalore',
                type: 'Material Revenue',
                approvedBy: 'Kavita Nair',
                attachments: 'INV-MAT-038.pdf',
                costCenter: 'CC-BLR-003',
            },
            {
                id: '5',
                date: '26-Nov-25',
                voucher: 'JV/REV/2025/0095',
                entryType: 'Journal Entry',
                credit: '-',
                debit: '₹60,200.00',
                balance: '₹6,21,700.00 CR',
                narration: 'Damaged material credit note - PQR Complex',
                refNo: 'JV-2025-095',
                counterparty: 'PQR Complex - Mumbai',
                type: 'Credit Note',
                approvedBy: 'Amit Joshi',
                attachments: 'JV-095.pdf',
                costCenter: 'CC-MUM-002',
            },
            {
                id: '6',
                date: '29-Nov-25',
                voucher: 'INV/MAT/2025/0052',
                entryType: 'Sales Invoice',
                credit: '₹2,38,200.00',
                debit: '-',
                balance: '₹8,59,900.00 CR',
                narration: 'HK material supply - LMN Plaza November 2025',
                refNo: 'INV-MAT-052',
                counterparty: 'LMN Plaza - Delhi',
                type: 'Material Revenue',
                approvedBy: 'Priya Gupta',
                attachments: 'INV-MAT-052.pdf',
                costCenter: 'CC-DEL-001',
            },
        ],
    },
}

// Initialize HK Material Revenue Ledger in localStorage
export const initializeHKMaterialRevenueLedger = () => {
    try {
        const existingData = localStorage.getItem('revenueLedgers')
        const revenueLedgers = existingData ? JSON.parse(existingData) : {}

        if (!revenueLedgers['R1001005001']) {
            revenueLedgers['R1001005001'] = hkMaterialRevenueData
            localStorage.setItem('revenueLedgers', JSON.stringify(revenueLedgers))
            console.log('✅ HK Material Revenue Ledger (R1001005001) initialized in localStorage')
        } else {
            console.log('ℹ️ HK Material Revenue Ledger (R1001005001) already exists in localStorage')
        }
    } catch (error) {
        console.error('❌ Error initializing HK Material Revenue ledger:', error)
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

// Rent on Machinery Revenue Ledger Data - R1001008
export const rentOnMachineryRevenueData = {
    headerInfo: {
        accountCode: 'R1001008',
        accountName: 'RENT ON MACHINERY',
        accountType: 'REVENUE',
        parentAccount: 'REVENUE',
        parentCode: 'R1001',
        category: 'Direct Income - Equipment Rental',
        description: 'Revenue from machinery and equipment rental services',
        openingBalance: '₹0.00',
        openingDate: '01-Apr-2025',
    },
    ledgerDetails: {
        totalCredit: '₹8,95,600.00',
        totalDebit: '₹45,000.00',
        netRevenue: '₹8,50,600.00',
        entries: [
            {
                id: '1',
                date: '05-Nov-25',
                voucher: 'INV/RM/2025/0008',
                entryType: 'Sales Invoice',
                credit: '₹1,85,400.00',
                debit: '-',
                balance: '₹1,85,400.00 CR',
                narration: 'Machinery rental charges - Scrubber and polisher - ABC Mall November 2025',
                refNo: 'INV-RM-008',
                counterparty: 'ABC Mall - Pune',
                type: 'Equipment Rental Revenue',
                approvedBy: 'Suresh Patil',
                attachments: 'INV-RM-008.pdf',
                costCenter: 'CC-PUNE-001',
            },
            {
                id: '2',
                date: '10-Nov-25',
                voucher: 'INV/RM/2025/0015',
                entryType: 'Sales Invoice',
                credit: '₹2,45,800.00',
                debit: '-',
                balance: '₹4,31,200.00 CR',
                narration: 'Heavy duty cleaning equipment rental - PQR Complex November 2025',
                refNo: 'INV-RM-015',
                counterparty: 'PQR Complex - Mumbai',
                type: 'Equipment Rental Revenue',
                approvedBy: 'Priya Desai',
                attachments: 'INV-RM-015.pdf',
                costCenter: 'CC-MUM-002',
            },
            {
                id: '3',
                date: '18-Nov-25',
                voucher: 'JV/REV/2025/0078',
                entryType: 'Journal Entry',
                credit: '-',
                debit: '₹25,000.00',
                balance: '₹4,06,200.00 CR',
                narration: 'Equipment damage compensation - ABC Mall',
                refNo: 'JV-2025-078',
                counterparty: 'ABC Mall - Pune',
                type: 'Deduction',
                approvedBy: 'Rajesh Kumar',
                attachments: 'JV-078.pdf',
                costCenter: 'CC-PUNE-001',
            },
            {
                id: '4',
                date: '22-Nov-25',
                voucher: 'INV/RM/2025/0024',
                entryType: 'Sales Invoice',
                credit: '₹1,95,300.00',
                debit: '-',
                balance: '₹6,01,500.00 CR',
                narration: 'Floor cleaning machinery rental - XYZ Tower November 2025',
                refNo: 'INV-RM-024',
                counterparty: 'XYZ Tower - Bangalore',
                type: 'Equipment Rental Revenue',
                approvedBy: 'Lakshmi Rao',
                attachments: 'INV-RM-024.pdf',
                costCenter: 'CC-BLR-003',
            },
            {
                id: '5',
                date: '26-Nov-25',
                voucher: 'JV/REV/2025/0089',
                entryType: 'Journal Entry',
                credit: '-',
                debit: '₹20,000.00',
                balance: '₹5,81,500.00 CR',
                narration: 'Late return penalty adjustment - PQR Complex',
                refNo: 'JV-2025-089',
                counterparty: 'PQR Complex - Mumbai',
                type: 'Adjustment',
                approvedBy: 'Amit Joshi',
                attachments: 'JV-089.pdf',
                costCenter: 'CC-MUM-002',
            },
            {
                id: '6',
                date: '29-Nov-25',
                voucher: 'INV/RM/2025/0032',
                entryType: 'Sales Invoice',
                credit: '₹2,69,100.00',
                debit: '-',
                balance: '₹8,50,600.00 CR',
                narration: 'Industrial vacuum and scrubbing machine rental - LMN Plaza November 2025',
                refNo: 'INV-RM-032',
                counterparty: 'LMN Plaza - Delhi',
                type: 'Equipment Rental Revenue',
                approvedBy: 'Neha Gupta',
                attachments: 'INV-RM-032.pdf',
                costCenter: 'CC-DEL-001',
            },
        ],
    },
}

// Initialize Rent on Machinery Revenue Ledger in localStorage
export const initializeRentOnMachineryRevenueLedger = () => {
    try {
        const existingData = localStorage.getItem('revenueLedgers')
        const revenueLedgers = existingData ? JSON.parse(existingData) : {}

        if (!revenueLedgers['R1001008']) {
            revenueLedgers['R1001008'] = rentOnMachineryRevenueData
            localStorage.setItem('revenueLedgers', JSON.stringify(revenueLedgers))
            console.log('✅ Rent on Machinery Revenue Ledger (R1001008) initialized in localStorage')
        } else {
            console.log('ℹ️ Rent on Machinery Revenue Ledger (R1001008) already exists in localStorage')
        }
    } catch (error) {
        console.error('❌ Error initializing Rent on Machinery Revenue ledger:', error)
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

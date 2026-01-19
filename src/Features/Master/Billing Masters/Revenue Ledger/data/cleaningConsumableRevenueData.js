// Cleaning Consumable Revenue Ledger Data - R1001005002
export const cleaningConsumableRevenueData = {
    headerInfo: {
        accountCode: 'R1001005002',
        accountName: 'CLEANING CONSUMABLE',
        accountType: 'REVENUE',
        parentAccount: 'CLEANING MATERIAL',
        parentCode: 'R1001006',
        category: 'Direct Income - Consumables',
        description: 'Revenue from cleaning consumables sales',
        openingBalance: '₹0.00',
        openingDate: '01-Apr-2025',
    },
    ledgerDetails: {
        totalCredit: '₹7,65,800.00',
        totalDebit: '₹95,300.00',
        netRevenue: '₹6,70,500.00',
        entries: [
            {
                id: '1',
                date: '09-Nov-25',
                voucher: 'INV/CON/2025/0016',
                entryType: 'Sales Invoice',
                credit: '₹1,45,200.00',
                debit: '-',
                balance: '₹1,45,200.00 CR',
                narration: 'Cleaning consumables supply - DEF Mall November 2025',
                refNo: 'INV-CON-016',
                counterparty: 'DEF Mall - Chennai',
                type: 'Consumable Revenue',
                approvedBy: 'Sanjay Kumar',
                attachments: 'INV-CON-016.pdf',
                costCenter: 'CC-CHE-001',
            },
            {
                id: '2',
                date: '13-Nov-25',
                voucher: 'INV/CON/2025/0024',
                entryType: 'Sales Invoice',
                credit: '₹1,85,600.00',
                debit: '-',
                balance: '₹3,30,800.00 CR',
                narration: 'Cleaning consumables - GHI Complex November 2025',
                refNo: 'INV-CON-024',
                counterparty: 'GHI Complex - Kolkata',
                type: 'Consumable Revenue',
                approvedBy: 'Ritu Sen',
                attachments: 'INV-CON-024.pdf',
                costCenter: 'CC-KOL-002',
            },
            {
                id: '3',
                date: '18-Nov-25',
                voucher: 'JV/REV/2025/0083',
                entryType: 'Journal Entry',
                credit: '-',
                debit: '₹45,300.00',
                balance: '₹2,85,500.00 CR',
                narration: 'Consumable return - DEF Mall',
                refNo: 'JV-2025-083',
                counterparty: 'DEF Mall - Chennai',
                type: 'Return',
                approvedBy: 'Lakshmi Iyer',
                attachments: 'JV-083.pdf',
                costCenter: 'CC-CHE-001',
            },
            {
                id: '4',
                date: '24-Nov-25',
                voucher: 'INV/CON/2025/0042',
                entryType: 'Sales Invoice',
                credit: '₹2,25,400.00',
                debit: '-',
                balance: '₹5,10,900.00 CR',
                narration: 'Cleaning consumables supply - JKL Tower November 2025',
                refNo: 'INV-CON-042',
                counterparty: 'JKL Tower - Ahmedabad',
                type: 'Consumable Revenue',
                approvedBy: 'Vishal Shah',
                attachments: 'INV-CON-042.pdf',
                costCenter: 'CC-AHM-003',
            },
            {
                id: '5',
                date: '27-Nov-25',
                voucher: 'JV/REV/2025/0098',
                entryType: 'Journal Entry',
                credit: '-',
                debit: '₹50,000.00',
                balance: '₹4,60,900.00 CR',
                narration: 'Quality issue credit note - GHI Complex',
                refNo: 'JV-2025-098',
                counterparty: 'GHI Complex - Kolkata',
                type: 'Credit Note',
                approvedBy: 'Deepak Bose',
                attachments: 'JV-098.pdf',
                costCenter: 'CC-KOL-002',
            },
            {
                id: '6',
                date: '30-Nov-25',
                voucher: 'INV/CON/2025/0058',
                entryType: 'Sales Invoice',
                credit: '₹2,09,600.00',
                debit: '-',
                balance: '₹6,70,500.00 CR',
                narration: 'Cleaning consumables supply - MNO Plaza November 2025',
                refNo: 'INV-CON-058',
                counterparty: 'MNO Plaza - Jaipur',
                type: 'Consumable Revenue',
                approvedBy: 'Anita Sharma',
                attachments: 'INV-CON-058.pdf',
                costCenter: 'CC-JAI-004',
            },
        ],
    },
}

// Initialize Cleaning Consumable Revenue Ledger in localStorage
export const initializeCleaningConsumableRevenueLedger = () => {
    try {
        const existingData = localStorage.getItem('revenueLedgers')
        const revenueLedgers = existingData ? JSON.parse(existingData) : {}

        if (!revenueLedgers['R1001005002']) {
            revenueLedgers['R1001005002'] = cleaningConsumableRevenueData
            localStorage.setItem('revenueLedgers', JSON.stringify(revenueLedgers))
            console.log('✅ Cleaning Consumable Revenue Ledger (R1001005002) initialized in localStorage')
        } else {
            console.log('ℹ️ Cleaning Consumable Revenue Ledger (R1001005002) already exists in localStorage')
        }
    } catch (error) {
        console.error('❌ Error initializing Cleaning Consumable Revenue ledger:', error)
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

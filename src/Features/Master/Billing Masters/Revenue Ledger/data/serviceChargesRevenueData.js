// Service Charges Revenue Ledger Data - R1001003
export const serviceChargesRevenueData = {
    headerInfo: {
        accountCode: 'R1001003',
        accountName: 'SERVICE CHARGES',
        accountType: 'REVENUE',
        parentAccount: 'REVENUE',
        parentCode: 'R1001',
        category: 'Direct Income',
        description: 'Revenue from service charges billed to clients',
        openingBalance: '₹0.00',
        openingDate: '01-Apr-2025',
    },
    ledgerDetails: {
        totalCredit: '₹12,85,750.00',
        totalDebit: '₹1,45,200.00',
        netRevenue: '₹11,40,550.00',
        entries: [
            {
                id: '1',
                date: '08-Nov-25',
                voucher: 'INV/DEF/2025/0012',
                entryType: 'Sales Invoice',
                credit: '₹2,15,650.00',
                debit: '-',
                balance: '₹2,15,650.00 CR',
                narration: 'Service charges for facility management - DEF Complex November 2025',
                refNo: 'INV-DEF-012',
                counterparty: 'DEF Complex - Chennai',
                type: 'Service Charges',
                approvedBy: 'Karthik Raman',
                attachments: 'INV-DEF-012.pdf',
                costCenter: 'CC-CHE-001',
            },
            {
                id: '2',
                date: '14-Nov-25',
                voucher: 'INV/GHI/2025/0028',
                entryType: 'Sales Invoice',
                credit: '₹3,45,800.00',
                debit: '-',
                balance: '₹5,61,450.00 CR',
                narration: 'Monthly service charges - GHI Tower November 2025',
                refNo: 'INV-GHI-028',
                counterparty: 'GHI Tower - Kolkata',
                type: 'Service Charges',
                approvedBy: 'Sanjay Bose',
                attachments: 'INV-GHI-028.pdf',
                costCenter: 'CC-KOL-002',
            },
            {
                id: '3',
                date: '19-Nov-25',
                voucher: 'JV/REV/2025/0082',
                entryType: 'Journal Entry',
                credit: '-',
                debit: '₹65,400.00',
                balance: '₹4,96,050.00 CR',
                narration: 'Service charge adjustment - Quality issue DEF Complex',
                refNo: 'JV-2025-082',
                counterparty: 'DEF Complex - Chennai',
                type: 'Adjustment',
                approvedBy: 'Meera Nair',
                attachments: 'JV-082.pdf',
                costCenter: 'CC-CHE-001',
            },
            {
                id: '4',
                date: '23-Nov-25',
                voucher: 'INV/JKL/2025/0041',
                entryType: 'Sales Invoice',
                credit: '₹2,85,900.00',
                debit: '-',
                balance: '₹7,81,950.00 CR',
                narration: 'Service charges for maintenance services - JKL Plaza November 2025',
                refNo: 'INV-JKL-041',
                counterparty: 'JKL Plaza - Ahmedabad',
                type: 'Service Charges',
                approvedBy: 'Ravi Shah',
                attachments: 'INV-JKL-041.pdf',
                costCenter: 'CC-AHM-003',
            },
            {
                id: '5',
                date: '27-Nov-25',
                voucher: 'JV/REV/2025/0089',
                entryType: 'Journal Entry',
                credit: '-',
                debit: '₹79,800.00',
                balance: '₹7,02,150.00 CR',
                narration: 'Late delivery penalty deduction - GHI Tower',
                refNo: 'JV-2025-089',
                counterparty: 'GHI Tower - Kolkata',
                type: 'Penalty',
                approvedBy: 'Anil Kumar',
                attachments: 'JV-089.pdf',
                costCenter: 'CC-KOL-002',
            },
            {
                id: '6',
                date: '30-Nov-25',
                voucher: 'INV/MNO/2025/0056',
                entryType: 'Sales Invoice',
                credit: '₹4,38,400.00',
                debit: '-',
                balance: '₹11,40,550.00 CR',
                narration: 'Service charges for comprehensive facility services - MNO Mall November 2025',
                refNo: 'INV-MNO-056',
                counterparty: 'MNO Mall - Jaipur',
                type: 'Service Charges',
                approvedBy: 'Pooja Sharma',
                attachments: 'INV-MNO-056.pdf',
                costCenter: 'CC-JAI-004',
            },
        ],
    },
}

// Initialize Service Charges Revenue Ledger in localStorage
export const initializeServiceChargesRevenueLedger = () => {
    try {
        const existingData = localStorage.getItem('revenueLedgers')
        const revenueLedgers = existingData ? JSON.parse(existingData) : {}

        if (!revenueLedgers['R1001003']) {
            revenueLedgers['R1001003'] = serviceChargesRevenueData
            localStorage.setItem('revenueLedgers', JSON.stringify(revenueLedgers))
            console.log('✅ Service Charges Revenue Ledger (R1001003) initialized in localStorage')
        } else {
            console.log('ℹ️ Service Charges Revenue Ledger (R1001003) already exists in localStorage')
        }
    } catch (error) {
        console.error('❌ Error initializing Service Charges Revenue ledger:', error)
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

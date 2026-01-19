// Overseas Consultancy Service Fees (Export) Revenue Ledger Data - R1001004
export const overseasConsultancyRevenueData = {
    headerInfo: {
        accountCode: 'R1001004',
        accountName: 'OVERSEAS CONSULTANCY SERVICE FEES (EXPORT)',
        accountType: 'REVENUE',
        parentAccount: 'REVENUE',
        parentCode: 'R1001',
        category: 'Direct Income - Export',
        description: 'Revenue from overseas consultancy and export services',
        openingBalance: '₹0.00',
        openingDate: '01-Apr-2025',
    },
    ledgerDetails: {
        totalCredit: '₹18,95,400.00',
        totalDebit: '₹1,85,600.00',
        netRevenue: '₹17,09,800.00',
        entries: [
            {
                id: '1',
                date: '06-Nov-25',
                voucher: 'INV/EXP/2025/0018',
                entryType: 'Sales Invoice',
                credit: '₹4,25,800.00',
                debit: '-',
                balance: '₹4,25,800.00 CR',
                narration: 'Overseas consultancy services - Singapore Client November 2025',
                refNo: 'INV-EXP-018',
                counterparty: 'Global Facilities Pte Ltd - Singapore',
                type: 'Export Revenue',
                approvedBy: 'Ramesh Iyer',
                attachments: 'INV-EXP-018.pdf',
                costCenter: 'CC-EXPORT-001',
            },
            {
                id: '2',
                date: '11-Nov-25',
                voucher: 'INV/EXP/2025/0023',
                entryType: 'Sales Invoice',
                credit: '₹5,65,200.00',
                debit: '-',
                balance: '₹9,91,000.00 CR',
                narration: 'Facility management consultancy - Dubai Project November 2025',
                refNo: 'INV-EXP-023',
                counterparty: 'Middle East Services LLC - UAE',
                type: 'Export Revenue',
                approvedBy: 'Deepak Menon',
                attachments: 'INV-EXP-023.pdf',
                costCenter: 'CC-EXPORT-002',
            },
            {
                id: '3',
                date: '16-Nov-25',
                voucher: 'JV/REV/2025/0094',
                entryType: 'Journal Entry',
                credit: '-',
                debit: '₹95,600.00',
                balance: '₹8,95,400.00 CR',
                narration: 'Currency exchange adjustment - Singapore Client',
                refNo: 'JV-2025-094',
                counterparty: 'Global Facilities Pte Ltd - Singapore',
                type: 'Forex Adjustment',
                approvedBy: 'Lakshmi Prasad',
                attachments: 'JV-094.pdf',
                costCenter: 'CC-EXPORT-001',
            },
            {
                id: '4',
                date: '21-Nov-25',
                voucher: 'INV/EXP/2025/0037',
                entryType: 'Sales Invoice',
                credit: '₹3,85,600.00',
                debit: '-',
                balance: '₹12,81,000.00 CR',
                narration: 'Technical consultancy services - London Client November 2025',
                refNo: 'INV-EXP-037',
                counterparty: 'UK Facility Solutions Ltd - UK',
                type: 'Export Revenue',
                approvedBy: 'Anita Desai',
                attachments: 'INV-EXP-037.pdf',
                costCenter: 'CC-EXPORT-003',
            },
            {
                id: '5',
                date: '26-Nov-25',
                voucher: 'JV/REV/2025/0101',
                entryType: 'Journal Entry',
                credit: '-',
                debit: '₹90,000.00',
                balance: '₹11,91,000.00 CR',
                narration: 'Service credit note - Dubai Project partial reversal',
                refNo: 'JV-2025-101',
                counterparty: 'Middle East Services LLC - UAE',
                type: 'Credit Note',
                approvedBy: 'Vijay Kumar',
                attachments: 'JV-101.pdf',
                costCenter: 'CC-EXPORT-002',
            },
            {
                id: '6',
                date: '29-Nov-25',
                voucher: 'INV/EXP/2025/0049',
                entryType: 'Sales Invoice',
                credit: '₹5,18,800.00',
                debit: '-',
                balance: '₹17,09,800.00 CR',
                narration: 'Overseas facility management consultancy - Australia November 2025',
                refNo: 'INV-EXP-049',
                counterparty: 'Sydney Property Services Pty - Australia',
                type: 'Export Revenue',
                approvedBy: 'Sunita Rao',
                attachments: 'INV-EXP-049.pdf',
                costCenter: 'CC-EXPORT-004',
            },
        ],
    },
}

// Initialize Overseas Consultancy Revenue Ledger in localStorage
export const initializeOverseasConsultancyRevenueLedger = () => {
    try {
        const existingData = localStorage.getItem('revenueLedgers')
        const revenueLedgers = existingData ? JSON.parse(existingData) : {}

        if (!revenueLedgers['R1001004']) {
            revenueLedgers['R1001004'] = overseasConsultancyRevenueData
            localStorage.setItem('revenueLedgers', JSON.stringify(revenueLedgers))
            console.log('✅ Overseas Consultancy Revenue Ledger (R1001004) initialized in localStorage')
        } else {
            console.log('ℹ️ Overseas Consultancy Revenue Ledger (R1001004) already exists in localStorage')
        }
    } catch (error) {
        console.error('❌ Error initializing Overseas Consultancy Revenue ledger:', error)
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

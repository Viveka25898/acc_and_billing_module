// Round Off Revenue Ledger Data - R2001001
export const roundOffRevenueData = {
    headerInfo: {
        accountCode: 'R2001001',
        accountName: 'ROUND OFF',
        accountType: 'REVENUE',
        parentAccount: 'REVENUE',
        parentCode: 'R2001',
        category: 'Indirect Income',
        description: 'Round off amounts collected from invoice rounding differences',
        openingBalance: '₹0.00',
        openingDate: '01-Apr-2025',
    },
    ledgerDetails: {
        totalCredit: '₹0.00',
        totalDebit: '₹0.00',
        netRevenue: '₹0.00',
        entries: [
            {
                id: 'RO-1',
                date: '21-Jan-2026',
                voucher: 'INV/2026/RO/0001',
                entryType: 'Invoice Round Off',
                credit: '₹0.18',
                debit: '-',
                balance: '₹0.18 CR',
                narration: 'Round off from invoice INV/2026/1001 - Book total ₹1,000.1824 rounded to ₹1,000.00',
                refNo: 'INV-2026-1001',
                counterparty: 'C010-CLIENT-DEMOS',
                type: 'Round Off',
                approvedBy: 'System Auto',
                attachments: '-',
                costCenter: 'HEAD OFFICE'
            },
            {
                id: 'RO-2',
                date: '22-Jan-2026',
                voucher: 'INV/2026/RO/0002',
                entryType: 'Invoice Round Off',
                credit: '₹0.40',
                debit: '-',
                balance: '₹0.58 CR',
                narration: 'Round off from invoice INV/2026/1002 - Book total ₹2,500.4024 rounded to ₹2,500.00',
                refNo: 'INV-2026-1002',
                counterparty: 'C011-CLIENT-SAMPLE',
                type: 'Round Off',
                approvedBy: 'System Auto',
                attachments: '-',
                costCenter: 'HEAD OFFICE'
            }
        ],
    },
    summary: {
        totalCredit: '₹0.58',
        totalDebit: '₹0.00',
        netRevenue: '₹0.58',
        transactionCount: 2,
        averageTransaction: '₹0.29'
    }
}

// LocalStorage helpers
export const getRoundOffRevenueLedger = (accountCode) => {
    try {
        const revenueLedgers = JSON.parse(localStorage.getItem('revenueLedgers')) || {}
        return revenueLedgers[accountCode] || null
    } catch (error) {
        console.error('Error loading round off revenue ledger:', error)
        return null
    }
}

export const saveRoundOffRevenueLedger = (accountCode, ledgerData) => {
    try {
        const revenueLedgers = JSON.parse(localStorage.getItem('revenueLedgers')) || {}
        revenueLedgers[accountCode] = ledgerData
        localStorage.setItem('revenueLedgers', JSON.stringify(revenueLedgers))
        return true
    } catch (error) {
        console.error('Error saving round off ledger:', error)
        return false
    }
}

export const initializeRoundOffRevenueLedger = () => {
    try {
        const existing = getRoundOffRevenueLedger('R2001001')
        if (!existing) {
            saveRoundOffRevenueLedger('R2001001', roundOffRevenueData)
            console.log('✅ Round Off Revenue Ledger initialized (R2001001)')
            return true
        }
        return false
    } catch (error) {
        console.error('Error initializing Round Off Revenue Ledger:', error)
        return false
    }
}

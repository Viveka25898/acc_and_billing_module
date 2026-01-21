// src/data/transactions.js
// Central source of truth for Transactions
// Note: You should extract your actual transaction data here

export const INITIAL_TRANSACTIONS = [
    // Example structure - replace with your actual transactions from document 2
    {
        id: "TXN_1763705001401_1",
        voucherNo: "PAY/MH01/2025/0001",
        voucherType: "Payment Voucher",
        date: "2025-01-15",
        // ... other transaction fields
    },
    // Sample Round Off transactions so the Round Off ledger (R2001001) shows entries
    {
        id: 'TXN_RO_2026_1',
        voucherNo: 'INV/2026/1001',
        voucherType: 'Sales Invoice',
        date: '2026-01-21',
        invoiceNumber: 'INV-2026-1001',
        customer: 'C010-CLIENT-DEMOS',
        entries: [
            { glCode: 'R2001001', glName: 'ROUND OFF', debit: 0, credit: 0.18, narration: 'Round off on invoice INV-2026-1001', invoiceNumber: 'INV-2026-1001', costCenter: 'HEAD OFFICE' },
            { glCode: 'D010', glName: 'C010-CLIENT-DEMOS', debit: 0.18, credit: 0, narration: 'Customer due for INV-2026-1001', invoiceNumber: 'INV-2026-1001', costCenter: 'HEAD OFFICE' }
        ],
    },
    {
        id: 'TXN_RO_2026_2',
        voucherNo: 'INV/2026/1002',
        voucherType: 'Sales Invoice',
        date: '2026-01-22',
        invoiceNumber: 'INV-2026-1002',
        customer: 'C011-CLIENT-SAMPLE',
        entries: [
            { glCode: 'R2001001', glName: 'ROUND OFF', debit: 0, credit: 0.40, narration: 'Round off on invoice INV-2026-1002', invoiceNumber: 'INV-2026-1002', costCenter: 'HEAD OFFICE' },
            { glCode: 'D011', glName: 'C011-CLIENT-SAMPLE', debit: 0.40, credit: 0, narration: 'Customer due for INV-2026-1002', invoiceNumber: 'INV-2026-1002', costCenter: 'HEAD OFFICE' }
        ],
    },
    // Add all your other transactions here...
]

// If you have a lot of transactions, you might want to organize them by type:
export const PAYMENT_VOUCHERS = []
export const PURCHASE_VOUCHERS = []
export const JOURNAL_VOUCHERS = []
// etc.
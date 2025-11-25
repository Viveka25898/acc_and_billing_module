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
    // Add all your other transactions here...
]

// If you have a lot of transactions, you might want to organize them by type:
export const PAYMENT_VOUCHERS = []
export const PURCHASE_VOUCHERS = []
export const JOURNAL_VOUCHERS = []
// etc.
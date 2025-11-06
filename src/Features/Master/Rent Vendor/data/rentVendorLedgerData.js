// rentVendorLedgers.js
export const rentVendorLedgerData = [
  {
    accountCode: "L2005001001",
    vendorInfo: {
      ledgerCode: "L2005001001",
      displayName: "Ramesh Kumar (Owner)",
      type: "Current Liability",
      parent: "L2005 - Sundry Creditors",
      period: "Oct 2024",
      openingBalanceLabel: "₹ 0.00"
    },
    summaryData: { openingBalance: 0, totalDebit: 59000, totalCredit: 59000, closingBalance: 0 },
    entries: [
      {
        date: "2024-10-05",
        displayDate: "05-Oct-2024",
        voucherNo: "JV/2024/1234",
        entryType: "Journal",
        debit: 0,
        credit: 59000,
        balance: "59,000.00 Cr",
        narration: "Rent payable for Oct-2024 | Amount: ₹50,000 + GST: ₹9,000 | Mumbai Office",
        refNo: "AGR-2024-MUM-001",
        counterparty: "X2003-RENT EXPENSE\nA3007001-GST INPUT",
        type: "Multiple",
        approvedBy: "Amit Sharma (BM)",
        attachments: 1,
        costCenter: "CC-MUM-001",
        status: "Posted"
      },
      {
        date: "2024-10-12",
        displayDate: "12-Oct-2024",
        voucherNo: "PAY/2024/5678",
        entryType: "Payment",
        debit: 59000,
        credit: 0,
        balance: "0.00",
        narration: "Payment made to Ramesh Kumar via NEFT | Ref: TXN9876543210",
        refNo: "NEFT-2024-9876",
        counterparty: "A3004003-HDFC BANK",
        type: "Bank",
        approvedBy: "Priya Verma (AM)",
        attachments: 2,
        costCenter: "CC-MUM-001",
        status: "Paid"
      }
    ]
  },
  // add other rent vendor ledgers here...
];

// Dummy data for TDS Receivable Ledger (GL Code: A3006001)
// In production, this will come from the backend / payment entries module

/**
 * Helper: compute running balance progressively from entries
 */
const withRunningBalance = (entries) => {
  let balance = 0
  return entries.map((e) => {
    balance += (Number(e.tdsDebit) || 0) - (Number(e.credit) || 0)
    return { ...e, runningBalance: balance }
  })
}

const rawEntries = [
  {
    id: 'TDR001',
    date: '05-Apr-2025',
    particulars: 'TDS deducted by Acme Corp on Invoice #INV-2025-001',
    clientName: 'Acme Corp Pvt Ltd',
    clientTAN: 'MUMR12345A',
    clientPAN: 'AAACC1234D',
    section: '194C',
    voucherNo: 'VCH/0001/25-26',
    quarter: 'Q1 (Apr–Jun 2025)',
    grossAmount: 500000,
    tdsDebit: 10000,
    credit: 0,
    status26AS: 'Matched',
  },
  {
    id: 'TDR002',
    date: '18-Apr-2025',
    particulars: 'TDS deducted by Global Tech Ltd on Invoice #INV-2025-002',
    clientName: 'Global Tech Ltd',
    clientTAN: 'DELR98765B',
    clientPAN: 'BBBCC9876E',
    section: '194J',
    voucherNo: 'VCH/0002/25-26',
    quarter: 'Q1 (Apr–Jun 2025)',
    grossAmount: 200000,
    tdsDebit: 20000,
    credit: 0,
    status26AS: 'Matched',
  },
  {
    id: 'TDR003',
    date: '02-May-2025',
    particulars: 'TDS deducted by Sunrise Industries on Invoice #INV-2025-003',
    clientName: 'Sunrise Industries Ltd',
    clientTAN: 'BLRR55432C',
    clientPAN: 'CCCCC5678F',
    section: '194C',
    voucherNo: 'VCH/0003/25-26',
    quarter: 'Q1 (Apr–Jun 2025)',
    grossAmount: 300000,
    tdsDebit: 6000,
    credit: 0,
    status26AS: 'Pending',
  },
  {
    id: 'TDR004',
    date: '15-May-2025',
    particulars: 'TDS deducted by Metro Builders on Invoice #INV-2025-004',
    clientName: 'Metro Builders Pvt Ltd',
    clientTAN: 'PUNR33221D',
    clientPAN: 'DDDCC2345G',
    section: '194I',
    voucherNo: 'VCH/0004/25-26',
    quarter: 'Q1 (Apr–Jun 2025)',
    grossAmount: 150000,
    tdsDebit: 15000,
    credit: 0,
    status26AS: 'Unmatched',
  },
  {
    id: 'TDR005',
    date: '10-Jun-2025',
    particulars: 'TDS deducted by Tech Solutions on Invoice #INV-2025-005',
    clientName: 'Tech Solutions Inc.',
    clientTAN: 'HYDER44321E',
    clientPAN: 'EEECC3456H',
    section: '194J',
    voucherNo: 'VCH/0005/25-26',
    quarter: 'Q1 (Apr–Jun 2025)',
    grossAmount: 400000,
    tdsDebit: 40000,
    credit: 0,
    status26AS: 'Matched',
  },
  {
    id: 'TDR006',
    date: '20-Jun-2025',
    particulars: 'TDS credit claimed in ITR — Q1 adjustment',
    clientName: '—',
    clientTAN: '—',
    clientPAN: '—',
    section: 'Adjustment',
    voucherNo: 'ADJ/0001/25-26',
    quarter: 'Q1 (Apr–Jun 2025)',
    grossAmount: 0,
    tdsDebit: 0,
    credit: 30000,
    status26AS: 'Claimed',
  },
  {
    id: 'TDR007',
    date: '08-Jul-2025',
    particulars: 'TDS deducted by Horizon Group on Invoice #INV-2025-006',
    clientName: 'Horizon Group Ltd',
    clientTAN: 'CHENR77654F',
    clientPAN: 'FFFCC4567I',
    section: '194C',
    voucherNo: 'VCH/0006/25-26',
    quarter: 'Q2 (Jul–Sep 2025)',
    grossAmount: 250000,
    tdsDebit: 5000,
    credit: 0,
    status26AS: 'Pending',
  },
  {
    id: 'TDR008',
    date: '22-Aug-2025',
    particulars: 'TDS deducted by Infinity Corp on Invoice #INV-2025-007',
    clientName: 'Infinity Corp Pvt Ltd',
    clientTAN: 'KOLKR11234G',
    clientPAN: 'GGGCC5678J',
    section: '194J',
    voucherNo: 'VCH/0007/25-26',
    quarter: 'Q2 (Jul–Sep 2025)',
    grossAmount: 500000,
    tdsDebit: 50000,
    credit: 0,
    status26AS: 'Matched',
  },
]

export const tdsReceivableEntries = withRunningBalance(rawEntries)

export const tdsReceivableLedgerInfo = {
  glCode: 'A3006001',
  ledgerName: 'TDS RECEIVABLE',
  parentAccount: 'A3006',
  category: 'Current Asset',
  financialYear: '2025-26',
  openingBalance: 0,
}

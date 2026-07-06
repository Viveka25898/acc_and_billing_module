import React from 'react';
import Badge from './Badge';

const TransactionTable = ({ transactions = [] }) => {
  if (transactions.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500 bg-white">
        <p>No bank transactions found.</p>
        <p className="text-sm mt-2">Transactions will appear here when payments are processed.</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    try {
      if (!dateString || dateString === '-') return '-'
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: '2-digit'
      })
    } catch {
      return dateString;
    }
  }

  const formatAmount = (amount) => {
    if (amount === undefined || amount === null || amount === 'N/A' || amount === '-') return '-'
    const num = typeof amount === 'string' ? parseFloat(amount) : amount
    if (isNaN(num)) return '-'
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  }

  const formatBalance = (amount) => {
    if (amount === undefined || amount === null || amount === 'N/A' || amount === '-') return '-'
    const strAmount = String(amount)
    if (strAmount.includes('DR') || strAmount.includes('CR')) return strAmount
    
    const num = parseFloat(strAmount)
    if (isNaN(num)) return strAmount
    
    const formatted = new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
    return formatted + ' DR'
  }

  const getRowClass = (txn) => {
    const type = String(txn.entryType || '').toLowerCase()
    if (type === 'payment') return 'bg-red-50'
    if (type === 'receipt') return 'bg-green-50'
    if (type === 'opening' || txn.voucherNo === 'OB-2024' || txn.id === 'opening-balance-sys') return 'bg-orange-50'
    return ''
  }

  return (
    <div className="p-6 overflow-x-auto bg-white">
      <table className="w-full min-w-[2200px]">
        <thead className="bg-slate-100 sticky top-0 z-10">
          <tr>
            <th className="px-2 py-3 text-left text-xs font-semibold text-slate-600 uppercase border-b-2 border-slate-200 w-20">Date</th>
            <th className="px-2 py-3 text-left text-xs font-semibold text-slate-600 uppercase border-b-2 border-slate-200 w-28">Voucher No</th>
            <th className="px-2 py-3 text-left text-xs font-semibold text-slate-600 uppercase border-b-2 border-slate-200 w-24">Entry Type</th>
            <th className="px-2 py-3 text-left text-xs font-semibold text-slate-600 uppercase border-b-2 border-slate-200 w-28">Debit (₹)</th>
            <th className="px-2 py-3 text-left text-xs font-semibold text-slate-600 uppercase border-b-2 border-slate-200 w-28">Credit (₹)</th>
            <th className="px-2 py-3 text-left text-xs font-semibold text-slate-600 uppercase border-b-2 border-slate-200 w-32">Balance (₹)</th>
            <th className="px-2 py-3 text-left text-xs font-semibold text-slate-600 uppercase border-b-2 border-slate-200 w-80">Narration</th>
            <th className="px-2 py-3 text-left text-xs font-semibold text-slate-600 uppercase border-b-2 border-slate-200 w-36">Ref No</th>
            <th className="px-2 py-3 text-left text-xs font-semibold text-slate-600 uppercase border-b-2 border-slate-200 w-48">Counterparty</th>
            <th className="px-2 py-3 text-left text-xs font-semibold text-slate-600 uppercase border-b-2 border-slate-200 w-36">Type</th>
            <th className="px-2 py-3 text-left text-xs font-semibold text-slate-600 uppercase border-b-2 border-slate-200 w-32">Approved By</th>
            <th className="px-2 py-3 text-left text-xs font-semibold text-slate-600 uppercase border-b-2 border-slate-200 w-40">Instrument</th>
            <th className="px-2 py-3 text-left text-xs font-semibold text-slate-600 uppercase border-b-2 border-slate-200 w-24">Value Date</th>
            <th className="px-2 py-3 text-left text-xs font-semibold text-slate-600 uppercase border-b-2 border-slate-200 w-32">TDS Details</th>
            <th className="px-2 py-3 text-left text-xs font-semibold text-slate-600 uppercase border-b-2 border-slate-200 w-24">Status</th>
            <th className="px-2 py-3 text-left text-xs font-semibold text-slate-600 uppercase border-b-2 border-slate-200 w-32">Cost Center</th>
            <th className="px-2 py-3 text-left text-xs font-semibold text-slate-600 uppercase border-b-2 border-slate-200 w-36">Customer</th>
            <th className="px-2 py-3 text-left text-xs font-semibold text-slate-600 uppercase border-b-2 border-slate-200 w-32">Site</th>
            <th className="px-2 py-3 text-left text-xs font-semibold text-slate-600 uppercase border-b-2 border-slate-200 w-28">State</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => {
            const entryTypeLower = String(transaction.entryType || '').toLowerCase();
            const txnType = entryTypeLower === 'payment' ? 'vendor' : (entryTypeLower === 'receipt' ? 'advance' : 'opening_type');
            
            return (
              <tr key={transaction.id || index} className={`hover:bg-slate-50 ${getRowClass(transaction)}`}>
                <td className="px-2 py-3 text-sm">{formatDate(transaction.date)}</td>
                <td className="px-2 py-3 text-sm">
                  <span className="text-orange-500 font-semibold cursor-pointer hover:underline">
                    {transaction.voucherNo || '-'}
                  </span>
                </td>
                <td className="px-2 py-3 text-sm">
                  <Badge type={entryTypeLower}>
                    {entryTypeLower === 'receipt' ? 'Receipt' : 
                     entryTypeLower === 'payment' ? 'Payment' : 'Opening'}
                  </Badge>
                </td>
                <td className={`px-2 py-3 text-sm font-semibold font-mono text-right ${
                  transaction.debit !== null && transaction.debit !== '-' ? 'text-red-600' : ''
                }`}>
                  {formatAmount(transaction.debit)}
                </td>
                <td className={`px-2 py-3 text-sm font-semibold font-mono text-right ${
                  transaction.credit !== null && transaction.credit !== '-' ? 'text-green-600' : ''
                }`}>
                  {formatAmount(transaction.credit)}
                </td>
                <td className="px-2 py-3 text-sm font-bold font-mono text-right text-blue-800">
                  {formatBalance(transaction.balance)}
                </td>
                <td className="px-2 py-3 text-sm">{transaction.narration || '-'}</td>
                <td className="px-2 py-3 text-sm">{transaction.refNo || '-'}</td>
                <td className="px-2 py-3 text-sm">
                  <Badge type={txnType}>
                    {transaction.counterparty || '-'}
                  </Badge>
                </td>
                <td className="px-2 py-3 text-sm">
                  <Badge type={txnType}>
                    {entryTypeLower === 'payment' ? 'Vendor Payment' :
                     entryTypeLower === 'receipt' ? 'Advance' : 'Opening'}
                  </Badge>
                </td>
                <td className="px-2 py-3 text-sm">{transaction.approvedBy || '-'}</td>
                <td className="px-2 py-3 text-sm">{transaction.instrument || '-'}</td>
                <td className="px-2 py-3 text-sm">{formatDate(transaction.date)}</td>
                <td className="px-2 py-3 text-sm">{transaction.tdsDetails || '-'}</td>
                <td className="px-2 py-3 text-sm">
                  <Badge type={String(transaction.status || '').toLowerCase()}>
                    {transaction.status || '-'}
                  </Badge>
                </td>
                <td className="px-2 py-3 text-sm">{transaction.costCenter || '-'}</td>
                <td className="px-2 py-3 text-sm">{transaction.customer || '-'}</td>
                <td className="px-2 py-3 text-sm">{transaction.site || '-'}</td>
                <td className="px-2 py-3 text-sm">{transaction.state || '-'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
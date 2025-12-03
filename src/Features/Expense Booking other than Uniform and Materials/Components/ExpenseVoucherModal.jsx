/* eslint-disable no-unused-vars */
import React from 'react'

const ExpenseVoucherModal = ({ data = {}, onClose }) => {
  // Use provided payload, otherwise produce sensible defaults
  const header = data.header || {
    company: 'iSmart Facitech',
    voucherNo: `EXP-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
    financialYear: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
    date: new Date().toISOString().split('T')[0],
    reference: data.header?.reference || 'Vendor Invoice Processing',
    preparedBy: data.header?.preparedBy || 'Finance Head',
    expenseType: data.header?.expenseType || 'Vendor Expense',
    department: data.header?.department || 'Operations',
  }

  const vendorDetails = data.vendorDetails || {
    vendorId: `VND-${Math.floor(Math.random() * 10000)}`,
    vendorName: data.vendorName || 'Vendor Name',
    vendorType: 'External Service Provider',
    department: data.vendorDetails?.department || 'External Services',
    poNumber:
      data.vendorDetails?.poNumber || data.header?.reference?.split('/')[0] || 'PO-2025-001',
    invoiceNumber:
      data.vendorDetails?.invoiceNumber || data.header?.reference?.split('/')[1] || 'INV-001',
    submissionDate: data.vendorDetails?.submissionDate || new Date().toISOString().split('T')[0],
    approvalDate: data.vendorDetails?.approvalDate || new Date().toISOString().split('T')[0],
  }

  const expenseDetails = data.conveyanceDetails || [
    {
      id: 1,
      date: new Date().toISOString().split('T')[0],
      serviceProvider: vendorDetails.vendorName,
      expenseCategory: header.expenseType,
      description: `${header.expenseType} as per PO`,
      poReference: vendorDetails.poNumber,
      invoiceReference: vendorDetails.invoiceNumber,
      gstApplicable: 'Yes',
      amount: data.conveyanceDetails?.[0]?.amount || data.entries?.[0]?.debit || 0,
      documentAttached:
        data.conveyanceDetails?.[0]?.billAttached || (data.documentUrl ? 'Yes' : 'No'),
    },
  ]

  const totalExpenseAmount = expenseDetails.reduce((sum, item) => sum + Number(item.amount || 0), 0)
  const tdsAmount = Math.round((totalExpenseAmount * 10) / 100)
  const netPayable = totalExpenseAmount - tdsAmount

  const lines = data.entries || [
    {
      id: 1,
      particulars: `${header.expenseType} Expense`,
      gl: '5000',
      costCenter: header.department || 'GENERAL',
      debit: totalExpenseAmount,
      credit: 0,
      note: `Vendor: ${vendorDetails.vendorName}, PO: ${vendorDetails.poNumber}`,
    },
    {
      id: 2,
      particulars: `Vendor Payable - ${vendorDetails.vendorName}`,
      gl: '2000',
      costCenter: '',
      debit: 0,
      credit: totalExpenseAmount - tdsAmount,
      note: 'Net amount payable after TDS deduction',
    },
    {
      id: 3,
      particulars: 'TDS Payable',
      gl: '2100',
      costCenter: '',
      debit: 0,
      credit: tdsAmount,
      note: 'TDS liability to government @ 10%',
    },
  ]

  const approvals = data.approvals || {
    billingExecutive: 'Billing Manager',
    financeHead: 'Finance Head',
    approver: 'Completed',
    date: new Date().toISOString().split('T')[0],
  }

  const totals = {
    debit: lines.reduce((sum, l) => sum + (Number(l.debit) || 0), 0),
    credit: lines.reduce((sum, l) => sum + (Number(l.credit) || 0), 0),
  }

  const isBalanced = totals.debit === totals.credit

  const formatAmount = (amount) => {
    if (amount === null || amount === undefined) return '-'
    return `₹${Number(amount).toLocaleString()}`
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-green-600 text-white p-3 sm:p-4 flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-semibold">Expense Voucher - Vendor Payment</h2>
          <div>
            <button onClick={onClose} className="text-white text-xl font-bold">
              &times;
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {/* Header Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 bg-gray-50 p-3 rounded">
            <div>
              <p className="text-xs text-gray-500">Company</p>
              <p className="font-medium">{header.company}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Voucher No</p>
              <p className="font-medium">{header.voucherNo}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Date</p>
              <p className="font-medium">{header.date}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Financial Year</p>
              <p className="font-medium">{header.financialYear}</p>
            </div>

            <div className="md:col-span-2">
              <p className="text-xs text-gray-500">Reference</p>
              <p className="font-medium">{header.reference}</p>
            </div>
          </div>

          {/* Vendor Details */}
          <div className="bg-blue-50 p-3 rounded mb-4">
            <h3 className="font-semibold text-blue-800 mb-2">Vendor Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div>
                <div className="text-xs text-gray-500">Vendor ID</div>
                <div className="font-medium">{vendorDetails.vendorId}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Vendor Name</div>
                <div className="font-medium">{vendorDetails.vendorName}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">PO Number</div>
                <div className="font-medium">{vendorDetails.poNumber}</div>
              </div>
            </div>
          </div>

          {/* Totals */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <div className="bg-teal-50 p-3 rounded text-center">
              <div className="text-xs text-gray-500">Invoice Amount</div>
              <div className="font-bold text-lg">{formatAmount(totalExpenseAmount)}</div>
            </div>
            <div className="bg-red-50 p-3 rounded text-center">
              <div className="text-xs text-gray-500">TDS (10%)</div>
              <div className="font-bold text-lg text-red-600">{formatAmount(tdsAmount)}</div>
            </div>
            <div className="bg-green-50 p-3 rounded text-center">
              <div className="text-xs text-gray-500">Net Payable</div>
              <div className="font-bold text-lg text-green-600">{formatAmount(netPayable)}</div>
            </div>
          </div>

          {/* Expense Details Table */}
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Expense Details</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border text-sm">
                <thead className="bg-teal-50">
                  <tr>
                    <th className="p-2 border text-left">Date</th>
                    <th className="p-2 border text-left">Service Provider</th>
                    <th className="p-2 border text-left">Category</th>
                    <th className="p-2 border text-left">Description</th>
                    <th className="p-2 border text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {expenseDetails.map((it, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="p-2 border">{it.date}</td>
                      <td className="p-2 border">{it.serviceProvider}</td>
                      <td className="p-2 border">{it.expenseCategory}</td>
                      <td className="p-2 border text-xs">{it.description}</td>
                      <td className="p-2 border text-right font-semibold">
                        {formatAmount(it.amount)}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-teal-50 font-bold">
                    <td colSpan={4} className="p-2 border text-right">
                      Total
                    </td>
                    <td className="p-2 border text-right">{formatAmount(totalExpenseAmount)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Accounting Entries */}
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Accounting Entries</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-2 border text-left">Particulars</th>
                    <th className="p-2 border text-left hidden sm:table-cell">GL</th>
                    <th className="p-2 border text-left hidden sm:table-cell">Cost Center</th>
                    <th className="p-2 border text-right">Debit</th>
                    <th className="p-2 border text-right">Credit</th>
                  </tr>
                </thead>
                <tbody>
                  {lines.map((ln, idx) => (
                    <tr key={ln.id || idx} className="hover:bg-gray-50">
                      <td className="p-2 border">
                        <div className="font-medium">{ln.particulars}</div>
                        {ln.note && <div className="text-xs text-gray-500 mt-1">{ln.note}</div>}
                      </td>
                      <td className="p-2 border hidden sm:table-cell">{ln.gl}</td>
                      <td className="p-2 border hidden sm:table-cell">{ln.costCenter || '-'}</td>
                      <td className="p-2 border text-right">{formatAmount(ln.debit)}</td>
                      <td className="p-2 border text-right">{formatAmount(ln.credit)}</td>
                    </tr>
                  ))}
                  <tr className="bg-indigo-50 font-bold">
                    <td colSpan={3} className="p-2 border text-right hidden sm:table-cell">
                      Total
                    </td>
                    <td className="p-2 border text-right">{formatAmount(totals.debit)}</td>
                    <td className="p-2 border text-right">{formatAmount(totals.credit)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Approval, narration & footer */}
          <div className="mb-4">
            <p className="text-xs font-medium text-gray-700 mb-2">Narration</p>
            <div className="bg-gray-50 p-2 text-sm rounded border">{data.narration || ''}</div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExpenseVoucherModal

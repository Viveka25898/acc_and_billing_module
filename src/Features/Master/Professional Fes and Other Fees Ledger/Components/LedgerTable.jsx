/* eslint-disable no-unused-vars */
export const LedgerTable = ({ data, ledgerName }) => {
  const totalExpense = data.reduce((sum, item) => sum + item.expenseAmount, 0)
  const closingBalance = data[data.length - 1]?.runningBalance || 0

  return (
    <section className="p-4 overflow-x-auto">
      <div className="min-w-max">
        <table className="w-full text-xs bg-white rounded-lg overflow-hidden shadow-md">
          <thead className="bg-gradient-to-r from-green-600 to-green-600 text-white">
            <tr>
              <th className="px-2 py-3 text-left font-semibold uppercase tracking-wide">
                Posting Date
              </th>
              <th className="px-2 py-3 text-left font-semibold uppercase tracking-wide">
                Document Date
              </th>
              <th className="px-2 py-3 text-left font-semibold uppercase tracking-wide">
                Voucher Type
              </th>
              <th className="px-2 py-3 text-left font-semibold uppercase tracking-wide">
                Voucher No.
              </th>
              <th className="px-2 py-3 text-left font-semibold uppercase tracking-wide">
                Vendor Code
              </th>
              <th className="px-2 py-3 text-left font-semibold uppercase tracking-wide">
                Vendor Name
              </th>
              <th className="px-2 py-3 text-left font-semibold uppercase tracking-wide">
                Invoice No.
              </th>
              <th className="px-2 py-3 text-left font-semibold uppercase tracking-wide">
                Invoice Date
              </th>
              <th className="px-2 py-3 text-left font-semibold uppercase tracking-wide">PO No.</th>
              <th className="px-2 py-3 text-left font-semibold uppercase tracking-wide">
                Cost Center / Department
              </th>
              <th className="px-2 py-3 text-left font-semibold uppercase tracking-wide">
                Customer
              </th>
              <th className="px-2 py-3 text-left font-semibold uppercase tracking-wide">
                Site
              </th>
              <th className="px-2 py-3 text-left font-semibold uppercase tracking-wide">
                State
              </th>
              <th className="px-2 py-3 text-right font-semibold uppercase tracking-wide">
                Expense Amount (Dr)
              </th>
              <th className="px-2 py-3 text-left font-semibold uppercase tracking-wide">Remarks</th>
              <th className="px-2 py-3 text-right font-semibold uppercase tracking-wide">
                Running Balance
              </th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              <>
                {data.map((item, index) => (
                  <tr
                    key={index}
                    className={`border-b border-gray-200 hover:bg-indigo-50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    <td className="px-2 py-2 whitespace-nowrap">{item.postingDate}</td>
                    <td className="px-2 py-2 whitespace-nowrap">{item.documentDate}</td>
                    <td className="px-2 py-2 whitespace-nowrap">{item.voucherType}</td>
                    <td className="px-2 py-2 whitespace-nowrap">{item.voucherNo}</td>
                    <td className="px-2 py-2 whitespace-nowrap">{item.vendorCode}</td>
                    <td className="px-2 py-2 whitespace-nowrap">{item.vendorName}</td>
                    <td className="px-2 py-2 whitespace-nowrap">{item.invoiceNo}</td>
                    <td className="px-2 py-2 whitespace-nowrap">{item.invoiceDate}</td>
                    <td className="px-2 py-2 whitespace-nowrap">{item.poNo}</td>
                    <td className="px-2 py-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                        {item.costCenter}
                      </span>
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap">{item.customer || '-'}</td>
                    <td className="px-2 py-2 whitespace-nowrap">{item.site || '-'}</td>
                    <td className="px-2 py-2 whitespace-nowrap">{item.state || '-'}</td>
                    <td className="px-2 py-2 text-right font-semibold whitespace-nowrap">
                      ₹
                      {item.expenseAmount.toLocaleString('en-IN', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-2 py-2">{item.remarks}</td>
                    <td className="px-2 py-2 text-right font-semibold whitespace-nowrap">
                      ₹
                      {item.runningBalance.toLocaleString('en-IN', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{' '}
                      Dr
                    </td>
                  </tr>
                ))}

                {/* Total Row */}
                <tr className="bg-gray-300 font-bold">
                  <td colSpan="13" className="px-2 py-2 text-right pr-4">
                    Total:
                  </td>
                  <td className="px-2 py-2 text-right">
                    ₹
                    {totalExpense.toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="px-2 py-2"></td>
                  <td className="px-2 py-2 text-right">
                    ₹
                    {closingBalance.toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{' '}
                    Dr
                  </td>
                </tr>
              </>
            ) : (
              <tr>
                <td colSpan="16" className="px-4 py-8 text-center text-gray-500">
                  No transactions found for this ledger
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

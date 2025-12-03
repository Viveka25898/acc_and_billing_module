/* eslint-disable no-unused-vars */
import React from 'react'
import { SectionBadge } from './SectionBadge'
import StatusBadge from './StatusBadge'

export const DesktopTable = ({ data = [] }) => {
  // Helper to format INR values consistently
  const formatINR = (val) => {
    const num = Number(val || 0)
    return `₹${num.toLocaleString('en-IN')}`
  }

  // Totals computed from the passed-in data (defensive)
  const totals = data.reduce(
    (acc, e) => {
      acc.gross += Number(e.grossAmount || 0)
      acc.taxable += Number(e.taxableAmount || 0)
      acc.tdsDr += Number(e.tdsAmountDr || 0)
      acc.tdsCr += Number(e.tdsAmountCr || 0)
      acc.netPayable += Number(e.netPayable || 0)
      return acc
    },
    { gross: 0, taxable: 0, tdsDr: 0, tdsCr: 0, netPayable: 0 }
  )

  const lastCumulative = data.length ? Number(data[data.length - 1].cumulativeBalance || 0) : 0

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-max">
        <thead className="bg-green-600  sticky top-0">
          <tr>
            <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide">
              Line
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide">
              Posting Date
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide">
              Document Date
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide">
              Voucher Type
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide">
              Voucher No
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide">
              Reference
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide">
              Particulars
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide">
              Invoice No
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide">
              Invoice Date
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide">
              PO No
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide">
              TDS Section
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide">
              Nature of Payment
            </th>

            <th className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wide">
              Gross Amount (₹)
            </th>
            <th className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wide">
              Taxable Amount (₹)
            </th>

            <th className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wide">
              TDS Rate (%)
            </th>
            <th className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wide">
              Surcharge (%)
            </th>
            <th className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wide">
              Cess (%)
            </th>

            <th className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wide bg-red-50">
              TDS Debit (₹)
            </th>
            <th className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wide bg-green-50">
              TDS Credit (₹)
            </th>

            <th className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wide">
              Net Payable (₹)
            </th>
            <th className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wide">
              Cumulative Balance (₹)
            </th>

            <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide">
              Vendor Code
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide">
              Vendor Name
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide">
              PAN
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide">
              Deductee Type
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide">
              Challan No
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide">
              Challan Date
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide">
              Status
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide">
              Remarks
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, index) => (
            <tr
              key={entry.lineNo ?? index}
              className={`border-b hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
            >
              <td className="px-3 py-3 text-xs text-center">{entry.lineNo}</td>
              <td className="px-3 py-3 text-xs whitespace-nowrap">{entry.postingDate}</td>
              <td className="px-3 py-3 text-xs whitespace-nowrap">{entry.documentDate}</td>
              <td className="px-3 py-3 text-xs whitespace-nowrap">{entry.voucherType}</td>
              <td className="px-3 py-3 text-xs whitespace-nowrap">{entry.voucherNo}</td>
              <td className="px-3 py-3 text-xs">{entry.reference}</td>
              <td className="px-3 py-3 text-xs">{entry.particulars}</td>
              <td className="px-3 py-3 text-xs whitespace-nowrap">{entry.invoiceNo}</td>
              <td className="px-3 py-3 text-xs whitespace-nowrap">{entry.invoiceDate}</td>
              <td className="px-3 py-3 text-xs whitespace-nowrap">{entry.poNo}</td>
              <td className="px-3 py-3 text-xs">
                <SectionBadge section={entry.tdsSection} />
              </td>
              <td className="px-3 py-3 text-xs">{entry.natureOfPayment}</td>

              <td className="px-3 py-3 text-xs text-right font-semibold">
                {formatINR(entry.grossAmount)}
              </td>
              <td className="px-3 py-3 text-xs text-right font-semibold">
                {formatINR(entry.taxableAmount)}
              </td>

              <td className="px-3 py-3 text-xs text-center">
                {(Number(entry.tdsRate) || 0).toFixed(2)}%
              </td>
              <td className="px-3 py-3 text-xs text-center">
                {(Number(entry.surcharge) || 0).toFixed(2)}%
              </td>
              <td className="px-3 py-3 text-xs text-center">
                {(Number(entry.cess) || 0).toFixed(2)}%
              </td>

              <td className="px-3 py-3 text-xs text-right font-semibold bg-red-50">
                {formatINR(entry.tdsAmountDr)}
              </td>
              <td className="px-3 py-3 text-xs text-right font-semibold bg-green-50">
                {entry.tdsAmountCr ? formatINR(entry.tdsAmountCr) : '-'}
              </td>

              <td className="px-3 py-3 text-xs text-right font-semibold">
                {formatINR(entry.netPayable)}
              </td>
              <td className="px-3 py-3 text-xs text-right font-semibold">
                {formatINR(entry.cumulativeBalance)}
              </td>

              <td className="px-3 py-3 text-xs">{entry.vendorCode}</td>
              <td className="px-3 py-3 text-xs whitespace-nowrap">{entry.vendorName}</td>
              <td className="px-3 py-3 text-xs">{entry.pan}</td>
              <td className="px-3 py-3 text-xs">{entry.deducteeType}</td>
              <td className="px-3 py-3 text-xs">{entry.challanNo}</td>
              <td className="px-3 py-3 text-xs">{entry.challanDate}</td>
              <td className="px-3 py-3 text-xs">
                <StatusBadge status={entry.paymentStatus} />
              </td>
              <td className="px-3 py-3 text-xs">{entry.remarks}</td>
            </tr>
          ))}

          <tr className="bg-indigo-100 font-bold border-t-2 border-indigo-300">
            <td colSpan="12" className="px-3 py-3 text-xs text-right">
              TOTAL:
            </td>

            <td className="px-3 py-3 text-xs text-right font-bold">{formatINR(totals.gross)}</td>
            <td className="px-3 py-3 text-xs text-right font-bold">{formatINR(totals.taxable)}</td>

            <td colSpan="3"></td>

            <td className="px-3 py-3 text-xs text-right font-bold bg-red-100">
              {formatINR(totals.tdsDr)}
            </td>
            <td className="px-3 py-3 text-xs text-right font-bold bg-green-100">
              {totals.tdsCr ? formatINR(totals.tdsCr) : '-'}
            </td>

            <td className="px-3 py-3 text-xs text-right font-bold">
              {formatINR(totals.netPayable)}
            </td>
            <td className="px-3 py-3 text-xs text-right font-bold">{formatINR(lastCumulative)}</td>

            <td colSpan="8"></td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

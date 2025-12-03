import { FaChevronDown, FaChevronUp } from 'react-icons/fa'
import StatusBadge from './StatusBadge'
import { SectionBadge } from './SectionBadge'

export const MobileCard = ({ entry, isExpanded, onToggle }) => {
  // Safe number formatting
  const safeFormatNumber = (value) => {
    if (value === null || value === undefined || value === '' || isNaN(value)) {
      return '0'
    }
    return Number(value).toLocaleString('en-IN')
  }

  // Safe display values
  const tdsAmount = entry.tdsAmountDr || entry.tdsAmountCr || 0
  const grossAmount = entry.grossAmount || 0
  const netPayable = entry.netPayable || 0

  // Determine TDS type
  const tdsType = entry.tdsAmountCr > 0 ? 'Deduction' : 'Payment'
  const tdsTypeColor = entry.tdsAmountCr > 0 ? 'text-purple-600' : 'text-green-600'

  return (
    <div className="bg-white border border-gray-200 rounded-lg mb-3 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="p-4 cursor-pointer" onClick={onToggle}>
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <div className="text-sm font-semibold text-gray-900 truncate">{entry.vendorName}</div>
              <div className={`text-xs px-2 py-0.5 rounded-full ${tdsTypeColor} bg-opacity-10`}>
                {tdsType}
              </div>
            </div>
            <div className="text-xs text-gray-600 flex items-center gap-2">
              <span>Voucher: {entry.voucherNo}</span>
              <span>•</span>
              <span>Invoice: {entry.invoiceNo}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={entry.paymentStatus} />
            {isExpanded ? (
              <FaChevronUp size={20} className="text-gray-500" />
            ) : (
              <FaChevronDown size={20} className="text-gray-500" />
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <div className="text-gray-600 text-xs">Date</div>
            <div className="font-medium">{entry.postingDate || entry.documentDate || '-'}</div>
          </div>
          <div className="text-right">
            <div className="text-gray-600 text-xs">TDS Amount</div>
            <div className={`font-semibold ${tdsTypeColor}`}>₹{safeFormatNumber(tdsAmount)}</div>
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          {entry.particulars || entry.narration || 'TDS Transaction'}
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-100 pt-3 bg-gray-50">
          <div className="grid grid-cols-1 gap-3 text-sm">
            <DetailRow label="Transaction Type" value={tdsType} />
            <DetailRow label="Voucher Type" value={entry.voucherType} />
            <DetailRow label="Invoice No" value={entry.invoiceNo} />
            <DetailRow label="Invoice Date" value={entry.invoiceDate} />
            <DetailRow label="PO No" value={entry.poNo} />
            <DetailRow label="TDS Section" value={<SectionBadge section={entry.tdsSection} />} />
            <DetailRow label="Nature of Payment" value={entry.natureOfPayment} />
            <DetailRow label="Gross Amount" value={`₹${safeFormatNumber(grossAmount)}`} />
            <DetailRow
              label="Taxable Amount"
              value={`₹${safeFormatNumber(entry.taxableAmount || grossAmount)}`}
            />
            <DetailRow label="TDS Rate" value={`${entry.tdsRate || 0}%`} />
            <DetailRow label="Surcharge" value={`${entry.surcharge || 0}%`} />
            <DetailRow label="Cess" value={`${entry.cess || 0}%`} />
            <DetailRow
              label="TDS Deduction"
              value={entry.tdsAmountCr ? `₹${safeFormatNumber(entry.tdsAmountCr)}` : '-'}
            />
            <DetailRow
              label="TDS Payment"
              value={entry.tdsAmountDr ? `₹${safeFormatNumber(entry.tdsAmountDr)}` : '-'}
            />
            <DetailRow label="Net Payable" value={`₹${safeFormatNumber(netPayable)}`} />
            <DetailRow
              label="Cumulative Balance"
              value={`₹${safeFormatNumber(entry.cumulativeBalance || 0)}`}
            />
            <DetailRow label="PAN" value={entry.pan} />
            <DetailRow label="Vendor Code" value={entry.vendorCode} />
            <DetailRow label="Deductee Type" value={entry.deducteeType} />
            {entry.challanNo && entry.challanNo !== '-' && (
              <>
                <DetailRow label="Challan No" value={entry.challanNo} />
                <DetailRow label="Challan Date" value={entry.challanDate} />
              </>
            )}
            <DetailRow label="Remarks" value={entry.remarks || '-'} />
            {entry.approvedBy && <DetailRow label="Approved By" value={entry.approvedBy} />}
          </div>
        </div>
      )}
    </div>
  )
}

export const DetailRow = ({ label, value }) => {
  return (
    <div className="flex justify-between">
      <span className="text-gray-600">{label}:</span>
      <span className="font-medium text-gray-900 text-right max-w-[60%] break-words">{value}</span>
    </div>
  )
}

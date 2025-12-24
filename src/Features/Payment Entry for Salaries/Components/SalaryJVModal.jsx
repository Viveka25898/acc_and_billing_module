/* eslint-disable no-unused-vars */
import React, { useRef } from 'react'

export default function SalaryJVModal({ data = {}, onClose }) {
  const printRef = useRef()

  // Use the actual data passed from salary batch approval
  const header = data.header || {
    company: 'I SMART FACTECH PRIVATE LIMITED',
    address:
      '317, 3RD FLOOR, J/2, NILGIRI MANDLA TRUCK TERMINAL, NEAR WADALA STD, MUMBAI - 400037, MUMBAI - 400037',
    gstNo: '27AACCD4328112E',
    state: 'Maharashtra (27)',
    voucherNo: 'JVF00/10008/2526',
    date: new Date().toISOString().split('T')[0],
    financialYear: '31/10/2025',
    reference: 'N/A',
    preparedBy: 'System',
  }

  const lines = data.entries || []
  const narration = data.narration || 'Salary payment for the month'
  const approvals = data.approvals || {
    preparedBy: 'System',
    checkedBy: 'Pending',
    authorizedBy: data.approverName || 'Pending',
    date: new Date().toISOString().split('T')[0],
  }

  // Calculate totals if not provided
  const totals = data.totals || {
    debit: lines.reduce((sum, line) => sum + (line.debit || 0), 0),
    credit: lines.reduce((sum, line) => sum + (line.credit || 0), 0),
  }

  // Batch info
  const batchInfo = data.batchInfo || {}

  // Handle download/print
  const handleDownload = () => {
    window.print()
  }

  // Convert amount to words
  const numberToWords = (num) => {
    if (num === 0) return 'Zero'

    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine']
    const tens = [
      '',
      '',
      'Twenty',
      'Thirty',
      'Forty',
      'Fifty',
      'Sixty',
      'Seventy',
      'Eighty',
      'Ninety',
    ]
    const teens = [
      'Ten',
      'Eleven',
      'Twelve',
      'Thirteen',
      'Fourteen',
      'Fifteen',
      'Sixteen',
      'Seventeen',
      'Eighteen',
      'Nineteen',
    ]

    const convertLessThanThousand = (n) => {
      if (n === 0) return ''
      if (n < 10) return ones[n]
      if (n < 20) return teens[n - 10]
      if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '')
      return (
        ones[Math.floor(n / 100)] +
        ' Hundred' +
        (n % 100 !== 0 ? ' ' + convertLessThanThousand(n % 100) : '')
      )
    }

    const crore = Math.floor(num / 10000000)
    const lakh = Math.floor((num % 10000000) / 100000)
    const thousand = Math.floor((num % 100000) / 1000)
    const remainder = num % 1000

    let result = ''
    if (crore > 0) result += convertLessThanThousand(crore) + ' Crore '
    if (lakh > 0) result += convertLessThanThousand(lakh) + ' Lakh '
    if (thousand > 0) result += convertLessThanThousand(thousand) + ' Thousand '
    if (remainder > 0) result += convertLessThanThousand(remainder)

    return result.trim()
  }

  const amountInWords = numberToWords(Math.floor(totals.debit))

  return (
    <>
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            #printable-jv, #printable-jv * {
              visibility: visible;
            }
            #printable-jv {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              padding: 20px;
            }
            .no-print {
              display: none !important;
            }
            .print-page-break {
              page-break-after: always;
            }
          }
        `}
      </style>

      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="max-w-6xl w-full bg-white rounded-lg shadow-xl overflow-hidden max-h-[95vh] overflow-y-auto">
          {/* Modal Header with Close Button - NO PRINT */}
          <div className="sticky top-0 bg-blue-600 text-white p-4 flex justify-between items-center no-print">
            <h2 className="text-xl font-semibold">Journal Voucher - Salary Payment</h2>
            <div className="flex gap-2">
              <button
                onClick={handleDownload}
                className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-50 text-sm font-medium"
              >
                📥 Download
              </button>
              <button
                onClick={onClose}
                className="text-white hover:text-blue-200 text-2xl px-2"
                aria-label="Close"
              >
                ×
              </button>
            </div>
          </div>

          {/* Printable Content */}
          <div id="printable-jv" className="p-8">
            {/* Company Header */}
            <div className="text-center border-b-2 border-dotted border-gray-400 pb-4 mb-4">
              <h1 className="text-2xl font-bold text-gray-800">{header.company}</h1>
              <p className="text-xs text-gray-600 mt-1 max-w-3xl mx-auto">{header.address}</p>
              <div className="flex justify-center gap-8 mt-2 text-xs text-gray-600">
                <span>GST No: {header.gstNo}</span>
                <span>GST State: {header.state}</span>
              </div>
            </div>

            {/* Voucher Title */}
            <div className="text-center border-b border-gray-300 pb-3 mb-4">
              <h2 className="text-xl font-bold text-gray-800">Journal Voucher</h2>
            </div>

            {/* Voucher Header Info */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 mb-6 text-sm">
              <div className="flex border-b border-dotted border-gray-300 pb-2">
                <span className="font-semibold text-gray-700 w-32">Voucher No.:</span>
                <span className="text-gray-900">{header.voucherNo}</span>
              </div>
              <div className="flex border-b border-dotted border-gray-300 pb-2">
                <span className="font-semibold text-gray-700 w-32">Voucher Date:</span>
                <span className="text-gray-900">{header.date}</span>
              </div>
              <div className="flex border-b border-dotted border-gray-300 pb-2">
                <span className="font-semibold text-gray-700 w-32">Batch ID:</span>
                <span className="text-gray-900">{batchInfo.batchId || 'N/A'}</span>
              </div>
              <div className="flex border-b border-dotted border-gray-300 pb-2">
                <span className="font-semibold text-gray-700 w-32">Pay Period:</span>
                <span className="text-gray-900">{batchInfo.payrollPeriod || 'N/A'}</span>
              </div>
              <div className="flex border-b border-dotted border-gray-300 pb-2 col-span-2">
                <span className="font-semibold text-gray-700 w-32">Reference:</span>
                <span className="text-gray-900">{header.reference}</span>
              </div>
            </div>

            {/* Account Name Header */}
            <div className="mb-2">
              <div className="border-t-2 border-b-2 border-gray-800 py-2">
                <div className="flex text-sm font-bold">
                  <div className="w-20 px-2">S.No</div>
                  <div className="flex-1 px-2">Account Name</div>
                  <div className="w-32 px-2 text-right">Debit</div>
                  <div className="w-32 px-2 text-right">Credit</div>
                </div>
              </div>
            </div>

            {/* Transaction Lines */}
            <div className="min-h-[300px]">
              {lines.map((line, idx) => (
                <div
                  key={idx}
                  className="flex text-sm py-1.5 border-b border-dotted border-gray-300"
                >
                  <div className="w-20 px-2 text-gray-600">{idx + 1}</div>
                  <div className="flex-1 px-2">
                    <div className="font-medium text-gray-900">
                      {line.accountName || line.glName || 'N/A'}
                    </div>
                    {line.narration && (
                      <div className="text-xs text-gray-600 ml-4 mt-0.5">{line.narration}</div>
                    )}
                  </div>
                  <div className="w-32 px-2 text-right font-medium text-gray-900">
                    {line.debit > 0
                      ? line.debit.toLocaleString('en-IN', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                      : '-'}
                  </div>
                  <div className="w-32 px-2 text-right font-medium text-gray-900">
                    {line.credit > 0
                      ? line.credit.toLocaleString('en-IN', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                      : '-'}
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t-2 border-gray-800 mt-4">
              <div className="flex text-sm font-bold bg-gray-50 py-2">
                <div className="w-20 px-2"></div>
                <div className="flex-1 px-2 uppercase">TOTALS</div>
                <div className="w-32 px-2 text-right text-gray-900">
                  {totals.debit.toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
                <div className="w-32 px-2 text-right text-gray-900">
                  {totals.credit.toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
              </div>
            </div>

            {/* Amount in Words */}
            <div className="mt-6 border-t border-dotted border-gray-400 pt-4">
              <div className="text-sm">
                <span className="font-semibold text-gray-700">
                  RUPEES IN WORDS: HUNDRED NINETY-EIGHT LAKH EIGHTY-ONE THOUSAND SIX HUNDRED
                  NINETY-EIGHT ONLY
                </span>
              </div>
              <div className="text-xs text-gray-600 mt-1">
                (Amount: ₹ {totals.debit.toLocaleString('en-IN', { minimumFractionDigits: 2 })})
              </div>
            </div>

            {/* Narration */}
            {narration && (
              <div className="mt-4 text-sm">
                <span className="font-semibold text-gray-700">Narration: </span>
                <span className="text-gray-900">{narration}</span>
              </div>
            )}

            {/* Footer - Signatures */}
            <div className="mt-12 grid grid-cols-3 gap-8 text-center text-sm border-t-2 border-dotted border-gray-400 pt-8">
              <div>
                <div className="border-t border-gray-800 pt-2 mt-16">
                  <p className="font-semibold text-gray-800">Prepared By</p>
                  <p className="text-xs text-gray-600 mt-1">{approvals.preparedBy}</p>
                </div>
              </div>
              <div>
                <div className="border-t border-gray-800 pt-2 mt-16">
                  <p className="font-semibold text-gray-800">Checked By</p>
                  <p className="text-xs text-gray-600 mt-1">{approvals.checkedBy}</p>
                </div>
              </div>
              <div>
                <div className="border-t border-gray-800 pt-2 mt-16">
                  <p className="font-semibold text-gray-800">Authorised By</p>
                  <p className="text-xs text-gray-600 mt-1">{approvals.authorizedBy}</p>
                </div>
              </div>
            </div>

            {/* Footer Note */}
            <div className="text-center text-xs text-gray-500 mt-8 border-t border-dotted border-gray-300 pt-4">
              <p>This is a computer-generated document. No signature is required.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

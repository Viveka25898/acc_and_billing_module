import React, { useState } from 'react'
import { Download, Edit, Send, ArrowLeft, Check, CheckCircle, XCircle } from 'lucide-react'
import emailjs from '@emailjs/browser'
import EmailModal from './EmailModal'

const Step5InvoicePreview = ({
  formData,
  billingLines,
  calculations,
  onPrevious,
  onConvertToFinal,
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  const [isEmailSending, setIsEmailSending] = useState(false)
  const [emailStatus, setEmailStatus] = useState(null) // { type: 'success' | 'error', message: '' }

  // EmailJS Configuration
  const EMAILJS_SERVICE_ID = 'service_4eqrbpn'
  const EMAILJS_TEMPLATE_ID = 'template_o3siur5'
  const EMAILJS_PUBLIC_KEY = '1_eh922Ifu06Mv7Cb'

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const [day, month, year] = dateStr.split('/')
    return `${day}/${month}/${year}`
  }

  const numberToWords = (num) => {
    const ones = ['', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE']
    const tens = [
      '',
      '',
      'TWENTY',
      'THIRTY',
      'FORTY',
      'FIFTY',
      'SIXTY',
      'SEVENTY',
      'EIGHTY',
      'NINETY',
    ]
    const teens = [
      'TEN',
      'ELEVEN',
      'TWELVE',
      'THIRTEEN',
      'FOURTEEN',
      'FIFTEEN',
      'SIXTEEN',
      'SEVENTEEN',
      'EIGHTEEN',
      'NINETEEN',
    ]

    if (num === 0) return 'ZERO ONLY'

    const crores = Math.floor(num / 10000000)
    const lakhs = Math.floor((num % 10000000) / 100000)
    const thousands = Math.floor((num % 100000) / 1000)
    const hundreds = Math.floor((num % 1000) / 100)
    const remainder = Math.floor(num % 100)

    let words = 'RUPEES '

    if (crores > 0) {
      if (crores < 10) words += ones[crores] + ' '
      else if (crores < 20) words += teens[crores - 10] + ' '
      else {
        words += tens[Math.floor(crores / 10)] + ' '
        if (crores % 10 > 0) words += ones[crores % 10] + ' '
      }
      words += 'CRORE '
    }

    if (lakhs > 0) {
      if (lakhs < 10) words += ones[lakhs] + ' '
      else if (lakhs < 20) words += teens[lakhs - 10] + ' '
      else {
        words += tens[Math.floor(lakhs / 10)] + ' '
        if (lakhs % 10 > 0) words += ones[lakhs % 10] + ' '
      }
      words += 'LAKH '
    }

    if (thousands > 0) {
      if (thousands < 10) words += ones[thousands] + ' '
      else if (thousands < 20) words += teens[thousands - 10] + ' '
      else {
        words += tens[Math.floor(thousands / 10)] + ' '
        if (thousands % 10 > 0) words += ones[thousands % 10] + ' '
      }
      words += 'THOUSAND '
    }

    if (hundreds > 0) words += ones[hundreds] + ' HUNDRED '

    if (remainder >= 20) {
      words += tens[Math.floor(remainder / 10)] + ' '
      if (remainder % 10 > 0) words += ones[remainder % 10] + ' '
    } else if (remainder >= 10) {
      words += teens[remainder - 10] + ' '
    } else if (remainder > 0) {
      words += ones[remainder] + ' '
    }

    return words.trim() + ' ONLY'
  }

  const handleDownloadPDF = () => window.print()
  const handleEdit = () => setIsEditing(!isEditing)

  const handleSendToClient = () => {
    setIsEmailModalOpen(true)
    setEmailStatus(null) // Reset status when opening modal
  }

  const handleSendEmail = async (emailData) => {
    setIsEmailSending(true)
    setEmailStatus(null)

    try {
      // Initialize EmailJS
      emailjs.init(EMAILJS_PUBLIC_KEY)

      // Prepare invoice data for email
      const invoiceType = formData.invoiceSeries === 'proforma' ? 'Proforma Invoice' : 'Tax Invoice'
      const invoiceNumber = formData.poWoNumber || 'N/A'
      const invoiceDate = new Date().toLocaleDateString('en-IN')
      const invoiceAmount = formatCurrency(calculations.grandTotal)
      const billingMonth = getBillingMonth()

      // Prepare template parameters - text only, no attachments
      const templateParams = {
        to_email: emailData.recipientEmail,
        to_name: emailData.recipientName,
        reply_to: 'vivekawari50@gmail.com',
        from_name: 'iSmart Facitech Private Limited',
        invoice_type: invoiceType,
        invoice_number: invoiceNumber,
        invoice_date: invoiceDate,
        invoice_amount: invoiceAmount,
        billing_month: billingMonth,
        customer_name: formData.customer || 'N/A',
        branch_name: formData.branch || 'N/A',
        message: emailData.message || 'Please review the invoice details below.',
      }

      // Send email using EmailJS
      const response = await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)

      if (response.status === 200) {
        setEmailStatus({
          type: 'success',
          message: `Invoice sent successfully to ${emailData.recipientEmail}!`,
        })

        // Close modal after 2 seconds
        setTimeout(() => {
          setIsEmailModalOpen(false)
          // Clear status after 5 seconds
          setTimeout(() => setEmailStatus(null), 5000)
        }, 2000)
      } else {
        throw new Error('Failed to send email')
      }
    } catch (error) {
      console.error('Email sending error:', error)
      setEmailStatus({
        type: 'error',
        message: error.text || error.message || 'Failed to send email. Please try again.',
      })
    } finally {
      setIsEmailSending(false)
    }
  }

  const getBillingMonth = () => {
    if (!formData.selectedBillingCycle?.cycleFrom) return ''
    const [, month, year] = formData.selectedBillingCycle.cycleFrom.split('/')
    const months = [
      '',
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ]
    return `${months[parseInt(month)]} ${year}`
  }

  return (
    <div className="min-h-screen bg-gray-100 py-4 px-2">
      {/* Action Buttons */}
      <div className="max-w-[210mm] mx-auto mb-3 flex flex-wrap gap-2 justify-between print:hidden">
        <button
          onClick={onPrevious}
          className="px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </button>
        <div className="flex gap-2">
          <button
            onClick={handleDownloadPDF}
            className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm flex items-center"
          >
            <Download className="w-4 h-4 mr-1" />
            PDF
          </button>
          <button
            onClick={handleEdit}
            className="px-3 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 text-sm flex items-center"
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </button>
          <button
            onClick={handleSendToClient}
            className="px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm flex items-center"
          >
            <Send className="w-4 h-4 mr-1" />
            Send
          </button>
          <button
            onClick={onConvertToFinal}
            className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm flex items-center"
          >
            <Check className="w-4 h-4 mr-1" />
            Convert
          </button>
        </div>
      </div>

      {/* Invoice */}
      <div className="max-w-[210mm] mx-auto bg-white shadow-lg" id="invoice-content">
        <div className="border-2 border-black">
          {/* Header */}
          <div className="flex justify-between items-start p-4 border-b-2 border-black">
            <div className="w-48">
              <svg viewBox="0 0 200 80" className="w-full">
                <style>{`.logo-green{fill:#1a5f3f}.logo-text{font-family:Arial,sans-serif;font-weight:bold}`}</style>
                <circle cx="25" cy="35" r="22" className="logo-green" />
                <circle cx="25" cy="35" r="15" fill="white" />
                <g className="logo-green">
                  {[0, 1, 2, 3].map((i) =>
                    [0, 1, 2, 3].map((j) => (
                      <rect key={`${i}${j}`} x={15 + i * 4} y={28 + j * 4} width="3" height="3" />
                    ))
                  )}
                </g>
                <text x="55" y="40" className="logo-text logo-green" fontSize="28">
                  iSmart
                </text>
                <text x="55" y="55" className="logo-green" fontSize="10" fontStyle="italic">
                  Efficiency that sustains
                </text>
                <text x="195" y="12" fontSize="8" textAnchor="end">
                  TM
                </text>
              </svg>
            </div>
            <div className="text-right">
              <h1 className="text-xl font-bold">
                {formData.invoiceSeries === 'proforma' ? 'Proforma Invoice' : 'Tax Invoice'}
              </h1>
              <p className="text-xs">(ORIGINAL)</p>
            </div>
          </div>

          {/* Company Details */}
          <div className="flex justify-between p-3 border-b border-black">
            <div className="flex-1 text-center">
              <h2 className="text-lg font-bold mb-1">I SMART FACITECH PRIVATE LIMITED</h2>
              <p className="text-xs">
                317,3rd Floor, A/2, Nilgiri, Wadala Truck Terminal, Near Wadala RTO, Mumbai-400037
              </p>
              <p className="text-xs">Tel No. : 9152729982 | Email : vinayak.b@ismartfacitech.com</p>
              <p className="text-xs font-semibold">
                GST No. : 27AAKCC4528J1ZE, GST State : Maharashtra (27)
              </p>
            </div>
            <div className="w-24 h-24 border border-gray-400 flex items-center justify-center ml-3">
              <svg viewBox="0 0 100 100" className="w-full h-full p-1">
                <rect fill="white" width="100" height="100" />
                {[...Array(10)].map((_, i) =>
                  [...Array(10)].map((_, j) =>
                    (i + j) % 2 === 0 ? (
                      <rect
                        key={`${i}-${j}`}
                        x={i * 10}
                        y={j * 10}
                        width="10"
                        height="10"
                        fill="black"
                      />
                    ) : null
                  )
                )}
              </svg>
            </div>
          </div>

          {/* Invoice Details */}
          <div className="grid grid-cols-2 border-b border-black text-xs">
            <div className="border-r border-black">
              {[
                ['Inv. No.:', formData.poWoNumber],
                ['Inv. Date:', new Date().toLocaleDateString('en-GB')],
                ['Ack. No:', ''],
                ['IRN No:', ''],
              ].map(([label, value], i) => (
                <div
                  key={i}
                  className={`grid grid-cols-3 ${i < 3 ? 'border-b border-gray-400' : ''}`}
                >
                  <div className="p-1 bg-gray-100 font-semibold border-r border-gray-400">
                    {label}
                  </div>
                  <div className={`p-1 col-span-2 ${i === 0 ? 'font-bold' : ''}`}>{value}</div>
                </div>
              ))}
            </div>
            <div>
              {[
                ['Bill For Month:', getBillingMonth()],
                [
                  'Invoice Period:',
                  `${formatDate(formData.selectedBillingCycle?.cycleFrom)} to ${formatDate(formData.selectedBillingCycle?.cycleTo)}`,
                ],
              ].map(([label, value], i) => (
                <div
                  key={i}
                  className={`grid grid-cols-3 ${i === 0 ? 'border-b border-gray-400' : ''}`}
                >
                  <div className="p-1 bg-gray-100 font-semibold border-r border-gray-400">
                    {label}
                  </div>
                  <div className={`p-1 col-span-2 ${i === 0 ? 'font-bold' : ''}`}>{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Bill To / Ship To */}
          <div className="grid grid-cols-2 border-b border-black text-xs">
            {['Bill To:', 'Ship/Service Provided To:'].map((title, idx) => (
              <div key={idx} className={`p-2 ${idx === 0 ? 'border-r border-black' : ''}`}>
                <p className="font-bold mb-1">{title}</p>
                <p className="font-semibold">{formData.customer}</p>
                <p>{formData.branch}</p>
                {formData.selectedSites?.map((site, i) => (
                  <p key={i}>
                    {site.name}, {site.location}
                  </p>
                ))}
                <p className="mt-1 font-semibold">GST No.: </p>
              </div>
            ))}
          </div>

          {/* Services Table */}
          <table className="w-full text-[10px] border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-400 p-1 text-center" style={{ width: '30px' }}>
                  Sr. No.
                </th>
                <th className="border border-gray-400 p-1 text-left" style={{ width: '200px' }}>
                  Particulars
                </th>
                <th className="border border-gray-400 p-1 text-center" style={{ width: '60px' }}>
                  HSN/SAC
                </th>
                <th className="border border-gray-400 p-1 text-center" style={{ width: '40px' }}>
                  Qty
                </th>
                <th className="border border-gray-400 p-1 text-right" style={{ width: '70px' }}>
                  Rate
                </th>
                <th className="border border-gray-400 p-1 text-right" style={{ width: '50px' }}>
                  Rate Day
                </th>
                <th className="border border-gray-400 p-1 text-right" style={{ width: '50px' }}>
                  Duties
                </th>
                <th className="border border-gray-400 p-1 text-right" style={{ width: '80px' }}>
                  Amount
                </th>
                <th className="border border-gray-400 p-1" colSpan="2">
                  CGST
                </th>
                <th className="border border-gray-400 p-1" colSpan="2">
                  SGST
                </th>
              </tr>
              <tr className="bg-gray-50">
                {[...Array(8)].map((_, i) => (
                  <th key={i} className="border border-gray-400 p-1"></th>
                ))}
                <th className="border border-gray-400 p-1 text-center">Rate</th>
                <th className="border border-gray-400 p-1 text-center">Amount</th>
                <th className="border border-gray-400 p-1 text-center">Rate</th>
                <th className="border border-gray-400 p-1 text-center">Amount</th>
              </tr>
            </thead>
            <tbody>
              {billingLines.map((line, i) => (
                <tr key={i}>
                  <td className="border border-gray-400 p-1 text-center">{i + 1}</td>
                  <td className="border border-gray-400 p-1">{line.designation}</td>
                  <td className="border border-gray-400 p-1 text-center">{line.hsnCode}</td>
                  <td className="border border-gray-400 p-1 text-center">
                    {line.count.toFixed(2)}
                  </td>
                  <td className="border border-gray-400 p-1 text-right">
                    {formatCurrency(line.monthlyRate)}
                  </td>
                  <td className="border border-gray-400 p-1 text-right">
                    {formatCurrency(line.ratePerDay)}
                  </td>
                  <td className="border border-gray-400 p-1 text-right">
                    {line.dutyDays.toFixed(2)}
                  </td>
                  <td className="border border-gray-400 p-1 text-right">
                    {formatCurrency(line.amount)}
                  </td>
                  <td className="border border-gray-400 p-1 text-right">9.00</td>
                  <td className="border border-gray-400 p-1 text-right">
                    {formatCurrency(line.amount * 0.09)}
                  </td>
                  <td className="border border-gray-400 p-1 text-right">9.00</td>
                  <td className="border border-gray-400 p-1 text-right">
                    {formatCurrency(line.amount * 0.09)}
                  </td>
                </tr>
              ))}
              {[...Array(Math.max(0, 7 - billingLines.length))].map((_, i) => (
                <tr key={`e${i}`}>
                  {[...Array(12)].map((_, j) => (
                    <td key={j} className="border border-gray-400 p-1 h-6"></td>
                  ))}
                </tr>
              ))}
              <tr className="font-bold bg-gray-100">
                <td colSpan="7" className="border border-gray-400 p-1 text-right">
                  TOTAL AMOUNT
                </td>
                <td className="border border-gray-400 p-1 text-right">
                  {formatCurrency(calculations.subtotal)}
                </td>
                <td className="border border-gray-400 p-1"></td>
                <td className="border border-gray-400 p-1 text-right">
                  {formatCurrency(calculations.cgst)}
                </td>
                <td className="border border-gray-400 p-1"></td>
                <td className="border border-gray-400 p-1 text-right">
                  {formatCurrency(calculations.sgst)}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Bank & Total */}
          <div className="grid grid-cols-2 border-t border-black text-xs">
            <div className="p-2 border-r border-black">
              <p className="font-bold mb-1">Our Bank Details</p>
              <p>Punjab National Bank</p>
              <p>A/c. No. 1045108700000064</p>
              <p>RTGS/NEFT IFSC : PUNB0104510</p>
            </div>
            <div className="p-2">
              <div className="flex justify-between mb-1">
                <span>Net Total</span>
                <span className="font-semibold">{formatCurrency(calculations.totalBeforeTax)}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span>Round Off</span>
                <span className="font-semibold">0.00</span>
              </div>
              <div className="flex justify-between font-bold text-base pt-1 border-t border-gray-400">
                <span>Grand Total</span>
                <span>{formatCurrency(calculations.grandTotal)}</span>
              </div>
            </div>
          </div>

          {/* Amount in Words */}
          <div className="p-2 border-t border-black text-xs">
            <span className="font-bold">{numberToWords(Math.round(calculations.grandTotal))}</span>
          </div>

          {/* Narration */}
          <div className="p-2 border-t border-black text-xs">
            <p className="font-semibold">Narration:</p>
            <p>
              Towards bill for Housekeeping Services rendered at {formData.customer} Location For
              the month of {formatDate(formData.selectedBillingCycle?.cycleFrom)} to{' '}
              {formatDate(formData.selectedBillingCycle?.cycleTo)}.
            </p>
          </div>

          {/* HSN Summary */}
          <div className="p-2 border-t border-black">
            <table className="w-full text-[10px] border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-400 p-1">HSN/SAC Code</th>
                  <th className="border border-gray-400 p-1">Taxable Value</th>
                  <th className="border border-gray-400 p-1" colSpan="2">
                    Central Tax
                  </th>
                  <th className="border border-gray-400 p-1" colSpan="2">
                    State Tax
                  </th>
                  <th className="border border-gray-400 p-1" colSpan="2">
                    IntegratedTax
                  </th>
                  <th className="border border-gray-400 p-1">Total Tax Amt.</th>
                </tr>
                <tr className="bg-gray-50">
                  <th className="border border-gray-400 p-1"></th>
                  <th className="border border-gray-400 p-1"></th>
                  <th className="border border-gray-400 p-1">Rate</th>
                  <th className="border border-gray-400 p-1">Amount</th>
                  <th className="border border-gray-400 p-1">Rate</th>
                  <th className="border border-gray-400 p-1">Amount</th>
                  <th className="border border-gray-400 p-1">Rate</th>
                  <th className="border border-gray-400 p-1">Amount</th>
                  <th className="border border-gray-400 p-1"></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-400 p-1">998539</td>
                  <td className="border border-gray-400 p-1 text-right">
                    {formatCurrency(calculations.subtotal)}
                  </td>
                  <td className="border border-gray-400 p-1 text-center">9.00</td>
                  <td className="border border-gray-400 p-1 text-right">
                    {formatCurrency(calculations.cgst)}
                  </td>
                  <td className="border border-gray-400 p-1 text-center">9.00</td>
                  <td className="border border-gray-400 p-1 text-right">
                    {formatCurrency(calculations.sgst)}
                  </td>
                  <td className="border border-gray-400 p-1 text-center">0.00</td>
                  <td className="border border-gray-400 p-1 text-right">0.00</td>
                  <td className="border border-gray-400 p-1 text-right">
                    {formatCurrency(calculations.totalTax)}
                  </td>
                </tr>
                <tr className="font-bold bg-gray-100">
                  <td className="border border-gray-400 p-1">TOTAL</td>
                  <td className="border border-gray-400 p-1 text-right">
                    {formatCurrency(calculations.subtotal)}
                  </td>
                  <td className="border border-gray-400 p-1"></td>
                  <td className="border border-gray-400 p-1 text-right">
                    {formatCurrency(calculations.cgst)}
                  </td>
                  <td className="border border-gray-400 p-1"></td>
                  <td className="border border-gray-400 p-1 text-right">
                    {formatCurrency(calculations.sgst)}
                  </td>
                  <td className="border border-gray-400 p-1"></td>
                  <td className="border border-gray-400 p-1 text-right">0.00</td>
                  <td className="border border-gray-400 p-1 text-right">
                    {formatCurrency(calculations.totalTax)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* GST Declaration */}
          <div className="p-2 border-t border-black text-xs">
            <p className="font-semibold">Issued Under Section 31(1) of GST ACT 2017</p>
          </div>

          {/* Footer */}
          <div className="grid grid-cols-2 border-t-2 border-black text-xs">
            <div className="p-3 border-r border-black">
              <p className="font-bold mb-2">Invoice Terms</p>
              <p className="mb-1">
                <strong>1.</strong> All Payments are to be made in the Favour of 'I Smart Facitech
                Private Limited'.
              </p>
              <p className="mb-1">
                <strong>2.</strong> Payment to be done within 7 days of receipt of invoice.
              </p>
              <p className="mb-1">
                <strong>3.</strong> Interest @24% p.a. shall be charged, if payment is not made
                within 15 days from the date of receipt.
              </p>
              <p className="mb-1">
                <strong>4.</strong> As per the provision of MSME and registered under MSME act,
                delay in payment of 45 days can lead to Interest claim at a rate which is 3 times
                the existing bank rate as notified by RBI along with filing litigation proceedings
                as per the said act.
              </p>
              <p className="mb-1">
                <strong>5.</strong> Any queries /Corrections will be entertained only within 3 days
                from the date of submission of the bill, No Corrections will be entertained
                thereafter.
              </p>
              <p className="mb-1">
                <strong>6.</strong> All disputes are subject to Mumbai jurisdiction only.
              </p>
            </div>
            <div className="p-3">
              <p className="text-center mb-8">
                <span className="font-semibold">Created by: </span>TEJAS SUTHAR
              </p>
              <p className="text-center mb-2 font-bold">For I SMART FACITECH PRIVATE LIMITED</p>
              <div className="flex justify-between items-end px-8">
                <div className="text-center">
                  <div className="border-t-2 border-dashed border-gray-400 pt-2 mb-16"></div>
                  <p className="font-bold text-base">MANOJ KAMBLI</p>
                  <p className="text-xs">Date: {new Date().toLocaleDateString('en-IN')}</p>
                  <p className="text-xs">{new Date().toLocaleTimeString('en-IN')}</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 border-2 border-gray-400 mb-2 flex items-center justify-center">
                    <span className="text-[8px] text-gray-400">Stamp</span>
                  </div>
                  <p className="font-semibold">Authorised Signatory</p>
                </div>
              </div>
            </div>
          </div>

          {/* Page Footer */}
          <div className="p-1 text-center text-xs border-t border-gray-400">page # 1</div>
        </div>
      </div>

      {/* Email Modal */}
      <EmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        onSend={handleSendEmail}
        isLoading={isEmailSending}
      />

      {/* Email Status Toast */}
      {emailStatus && (
        <div
          className={`fixed bottom-4 right-4 z-50 max-w-md p-4 rounded-lg shadow-lg flex items-center gap-3 animate-slide-up ${
            emailStatus.type === 'success'
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}
        >
          {emailStatus.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          ) : (
            <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          )}
          <p
            className={`text-sm font-medium ${
              emailStatus.type === 'success' ? 'text-green-800' : 'text-red-800'
            }`}
          >
            {emailStatus.message}
          </p>
        </div>
      )}

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #invoice-content,
          #invoice-content * {
            visibility: visible;
          }
          #invoice-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}

export default Step5InvoicePreview

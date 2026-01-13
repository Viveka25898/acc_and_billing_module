import React, { useState } from 'react'
import { Download, Send, ArrowLeft, Check, CheckCircle, XCircle, Save } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { saveInvoice } from '../../utils/invoiceStorage'

const BonusLeaveEncashmentInvoicePreview = ({
  formData: propFormData,
  bonusEmployees: propBonusEmployees,
  leaveEmployees: propLeaveEmployees,
  calculations: propCalculations,
  isModalView = false,
}) => {
  const navigate = useNavigate()
  const location = useLocation()

  // Use props if in modal view, otherwise use location state
  const {
    formData: stateFormData,
    bonusEmployees: stateBonusEmployees,
    leaveEmployees: stateLeaveEmployees,
    calculations: stateCalculations,
  } = location.state || {}

  const formData = isModalView ? propFormData : stateFormData
  const bonusEmployees = isModalView ? propBonusEmployees : stateBonusEmployees
  const leaveEmployees = isModalView ? propLeaveEmployees : stateLeaveEmployees
  const calculations = isModalView ? propCalculations : stateCalculations
  const [isSaving, setIsSaving] = useState(false)
  const [emailStatus, setEmailStatus] = useState(null)

  // EmailJS Configuration
  const EMAILJS_SERVICE_ID = 'service_4eqrbpn'
  const EMAILJS_TEMPLATE_ID = 'template_o3siur5'
  const EMAILJS_PUBLIC_KEY = '1_eh922Ifu06Mv7Cb'

  // Validation
  React.useEffect(() => {
    if (!formData || !calculations) {
      alert('Invoice data is missing')
      navigate(-1)
    }
  }, [formData, calculations, navigate])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount || 0)
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

    if (hundreds > 0) {
      words += ones[hundreds] + ' HUNDRED '
    }

    if (remainder >= 10 && remainder < 20) {
      words += teens[remainder - 10] + ' '
    } else {
      if (Math.floor(remainder / 10) > 0) {
        words += tens[Math.floor(remainder / 10)] + ' '
      }
      if (remainder % 10 > 0) {
        words += ones[remainder % 10] + ' '
      }
    }

    return words.trim() + ' ONLY'
  }

  const handleDownloadPDF = () => {
    window.print()
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)

      // Create billing type string
      let billingTypeString = 'Bonus/Leave'
      if (formData?.billingType) {
        const types = []
        if (formData.billingType.bonus || bonusEmployees?.length > 0) types.push('Bonus')
        if (formData.billingType.leaveEncashment || leaveEmployees?.length > 0) types.push('Leave')
        billingTypeString = types.join('/')
      }

      const invoiceData = {
        ...formData,
        source: 'bonus-leave',
        billingType: billingTypeString,
        bonusEmployees,
        leaveEmployees,
        calculations,
        invoiceDate: new Date().toLocaleDateString('en-GB'),
      }

      const result = saveInvoice(invoiceData, 'proforma')

      if (result.success) {
        setEmailStatus({
          type: 'success',
          message: `Invoice saved successfully! ID: ${result.invoiceId}`,
        })
        setTimeout(() => {
          setEmailStatus(null)
          navigate('/dashboard/billing-manager/proforma-invoices')
        }, 2000)
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      console.error('Save error:', error)
      setEmailStatus({ type: 'error', message: error.message || 'Failed to save invoice' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleConvertToFinal = async () => {
    try {
      // Create billing type string
      let billingTypeString = 'Bonus/Leave'
      if (formData?.billingType) {
        const types = []
        if (formData.billingType.bonus || bonusEmployees?.length > 0) types.push('Bonus')
        if (formData.billingType.leaveEncashment || leaveEmployees?.length > 0) types.push('Leave')
        billingTypeString = types.join('/')
      }

      const invoiceData = {
        ...formData,
        source: 'bonus-leave',
        billingType: billingTypeString,
        bonusEmployees,
        leaveEmployees,
        calculations,
        invoiceType: 'final',
        invoiceDate: new Date().toLocaleDateString('en-GB'),
      }

      const result = saveInvoice(invoiceData, 'final')

      if (result.success) {
        setEmailStatus({ type: 'success', message: 'Invoice converted to final!' })
        setTimeout(() => navigate('/dashboard/billing-manager/irn-invoices'), 2000)
      }
    } catch (error) {
      setEmailStatus(error,{ type: 'error', message: 'Failed to convert invoice' })
    }
  }

  // Prepare line items from bonus and leave data
  const getLineItems = () => {
    const items = []
    let srNo = 1

    if (bonusEmployees && bonusEmployees.length > 0) {
      items.push({
        srNo: srNo++,
        particulars: `Bonus Payment - ${formData.period} (${bonusEmployees.length} Employees)`,
        hsnSac: '998539',
        qty: bonusEmployees.length,
        amount: bonusEmployees.reduce((sum, emp) => sum + (emp.bonusAmount || 0), 0),
      })
    }

    if (leaveEmployees && leaveEmployees.length > 0) {
      items.push({
        srNo: srNo++,
        particulars: `Leave Encashment - ${formData.period} (${leaveEmployees.length} Employees)`,
        hsnSac: '998539',
        qty: leaveEmployees.length,
        amount: leaveEmployees.reduce((sum, emp) => sum + (emp.encashmentAmount || 0), 0),
      })
    }

    return items
  }

  const lineItems = getLineItems()

  if (!formData) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 px-4">
      {/* Action Buttons */}
      {!isModalView && (
        <div className="max-w-[210mm] mx-auto mb-4 flex flex-wrap gap-3 justify-between print:hidden">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2.5 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-lg hover:from-gray-800 hover:to-gray-900 text-sm font-medium flex items-center shadow-md transition-all duration-200 hover:shadow-lg"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
          <div className="flex gap-3">
            <button
              onClick={handleDownloadPDF}
              className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 text-sm font-medium flex items-center shadow-md transition-all duration-200 hover:shadow-lg"
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 text-sm font-medium flex items-center shadow-md transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </>
              )}
            </button>
            <button
              onClick={handleConvertToFinal}
              className="px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 text-sm font-medium flex items-center shadow-md transition-all duration-200 hover:shadow-lg"
            >
              <Check className="w-4 h-4 mr-2" />
              Convert to Final
            </button>
          </div>
        </div>
      )}

      {/* Invoice */}
      <div className="max-w-[210mm] mx-auto bg-white overflow-hidden" id="invoice-content">
        <div className="border-2 border-gray-300">
          {/* Header */}
          <div className="header-gradient p-6">
            <div className="flex justify-between items-start">
              <div className="w-56 bg-white rounded-lg p-3">
                <img
                  src="/iSmart Logo.jpg"
                  alt="iSmart Facitech Logo"
                  className="w-full h-auto object-contain"
                />
              </div>
              <div className="text-right text-white">
                <h1 className="text-3xl font-bold tracking-wide mb-1 drop-shadow-md">
                  PROFORMA INVOICE
                </h1>
                <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full">
                  <p className="text-sm font-semibold">(ORIGINAL)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Company Details */}
          <div className="bg-gradient-to-b from-gray-50 to-white p-6 border-b-2 border-emerald-600">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-emerald-800 mb-3 tracking-wide">
                  I SMART FACITECH PRIVATE LIMITED
                </h2>
                <div className="space-y-1.5 text-gray-700">
                  <div className="flex items-start">
                    <svg
                      className="w-4 h-4 mr-2 mt-0.5 text-emerald-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="text-sm leading-relaxed">
                      317, 3rd Floor, A/2, Nilgiri, Wadala Truck Terminal,
                      <br />
                      Near Wadala RTO, Mumbai-400037
                    </p>
                  </div>
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-emerald-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <p className="text-sm font-medium">9152729982</p>
                    <span className="mx-3 text-gray-400">|</span>
                    <svg
                      className="w-4 h-4 mr-2 text-emerald-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <p className="text-sm">vinayak.b@ismartfacitech.com</p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="inline-block bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
                      <p className="text-xs font-semibold text-emerald-800">
                        <span className="text-gray-600">GST No:</span> 27AAKCC4528J1ZE
                      </p>
                      <p className="text-xs text-emerald-700">
                        <span className="text-gray-600">State:</span> Maharashtra (27)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="ml-6 flex flex-col items-center">
                <div className="w-28 h-28 border-2 border-emerald-600 rounded-lg shadow-md bg-white p-1.5">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
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
                            fill="#059669"
                          />
                        ) : null
                      )
                    )}
                  </svg>
                </div>
                <p className="text-[10px] text-gray-500 mt-1">QR Code</p>
              </div>
            </div>
          </div>

          {/* Invoice Details */}
          <div className="grid grid-cols-2 gap-0 text-xs bg-gray-50">
            <div className="border-r border-gray-300">
              <div className="bg-emerald-600 text-white px-4 py-2 font-bold text-sm">
                Invoice Information
              </div>
              {[
                ['Invoice No.', formData.poWoNumber, true],
                ['Invoice Date', new Date().toLocaleDateString('en-GB'), false],
                ['Acknowledgment No.', '—', false],
                ['IRN No.', '—', false],
              ].map(([label, value, highlight], i) => (
                <div
                  key={i}
                  className={`grid grid-cols-3 ${i < 3 ? 'border-b border-gray-200' : ''} hover:bg-gray-100 transition-colors`}
                >
                  <div className="p-2.5 font-semibold text-gray-700 border-r border-gray-200 bg-white">
                    {label}
                  </div>
                  <div
                    className={`p-2.5 col-span-2 ${highlight ? 'font-bold text-emerald-700 text-sm' : 'text-gray-800'}`}
                  >
                    {value}
                  </div>
                </div>
              ))}
            </div>
            <div>
              <div className="bg-emerald-600 text-white px-4 py-2 font-bold text-sm">
                Billing Period
              </div>
              {[
                ['Bill For Month', formData.period, true],
                [
                  'Billing Type',
                  `${bonusEmployees?.length > 0 ? 'Bonus' : ''} ${bonusEmployees?.length > 0 && leaveEmployees?.length > 0 ? '&' : ''} ${leaveEmployees?.length > 0 ? 'Leave Encashment' : ''}`,
                  false,
                ],
              ].map(([label, value, highlight], i) => (
                <div
                  key={i}
                  className={`grid grid-cols-3 ${i === 0 ? 'border-b border-gray-200' : ''} hover:bg-gray-100 transition-colors`}
                >
                  <div className="p-2.5 font-semibold text-gray-700 border-r border-gray-200 bg-white">
                    {label}
                  </div>
                  <div
                    className={`p-2.5 col-span-2 ${highlight ? 'font-bold text-emerald-700 text-sm' : 'text-gray-800'}`}
                  >
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bill To / Ship To */}
          <div className="grid grid-cols-2 gap-0 text-xs border-t-2 border-emerald-600">
            {[
              {
                title: 'Bill To',
                icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
              },
              {
                title: 'Ship/Service Provided To',
                icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
              },
            ].map((section, idx) => (
              <div key={idx} className={`${idx === 0 ? 'border-r border-gray-300' : ''} bg-white`}>
                <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 px-4 py-3 border-b border-emerald-200 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-emerald-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d={section.icon} clipRule="evenodd" />
                  </svg>
                  <p className="font-bold text-emerald-800">{section.title}</p>
                </div>
                <div className="p-4 space-y-1">
                  <p className="font-bold text-gray-800 text-sm mb-2">{formData.client}</p>
                  <p className="text-gray-700">{formData.period} - Bonus & Leave Encashment</p>
                  <div className="mt-3 pt-2 border-t border-gray-200">
                    <p className="text-gray-600">
                      <span className="font-semibold text-gray-700">GST No.:</span> —
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Services Table */}
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-[10px] border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-emerald-700 to-emerald-600 text-white">
                  <th
                    className="border border-emerald-800 p-2 text-center font-bold"
                    style={{ width: '30px' }}
                  >
                    Sr.
                    <br />
                    No.
                  </th>
                  <th
                    className="border border-emerald-800 p-2 text-left font-bold"
                    style={{ width: '300px' }}
                  >
                    Particulars
                  </th>
                  <th
                    className="border border-emerald-800 p-2 text-center font-bold"
                    style={{ width: '60px' }}
                  >
                    HSN/SAC
                  </th>
                  <th
                    className="border border-emerald-800 p-2 text-center font-bold"
                    style={{ width: '40px' }}
                  >
                    Qty
                  </th>
                  <th
                    className="border border-emerald-800 p-2 text-right font-bold"
                    style={{ width: '80px' }}
                  >
                    Amount
                  </th>
                  <th className="border border-emerald-800 p-2 font-bold" colSpan="2">
                    CGST
                  </th>
                  <th className="border border-emerald-800 p-2 font-bold" colSpan="2">
                    SGST
                  </th>
                </tr>
                <tr className="bg-emerald-100 text-gray-700">
                  {[...Array(5)].map((_, i) => (
                    <th key={i} className="border border-gray-300 p-1"></th>
                  ))}
                  <th className="border border-gray-300 p-1 text-center font-semibold">Rate</th>
                  <th className="border border-gray-300 p-1 text-center font-semibold">Amount</th>
                  <th className="border border-gray-300 p-1 text-center font-semibold">Rate</th>
                  <th className="border border-gray-300 p-1 text-center font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {lineItems.map((line, i) => (
                  <tr
                    key={i}
                    className={`${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-emerald-50 transition-colors`}
                  >
                    <td className="border border-gray-300 p-2 text-center font-medium">
                      {line.srNo}
                    </td>
                    <td className="border border-gray-300 p-2 text-gray-800">{line.particulars}</td>
                    <td className="border border-gray-300 p-2 text-center text-gray-700">
                      {line.hsnSac}
                    </td>
                    <td className="border border-gray-300 p-2 text-center font-medium">
                      {line.qty}
                    </td>
                    <td className="border border-gray-300 p-2 text-right font-semibold text-gray-800">
                      {formatCurrency(line.amount)}
                    </td>
                    <td className="border border-gray-300 p-2 text-right text-blue-700">9.00</td>
                    <td className="border border-gray-300 p-2 text-right text-blue-700">
                      {formatCurrency(line.amount * 0.09)}
                    </td>
                    <td className="border border-gray-300 p-2 text-right text-purple-700">9.00</td>
                    <td className="border border-gray-300 p-2 text-right text-purple-700">
                      {formatCurrency(line.amount * 0.09)}
                    </td>
                  </tr>
                ))}
                {[...Array(Math.max(0, 7 - lineItems.length))].map((_, i) => (
                  <tr
                    key={`e${i}`}
                    className={`${(lineItems.length + i) % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                  >
                    {[...Array(9)].map((_, j) => (
                      <td key={j} className="border border-gray-300 p-1 h-6"></td>
                    ))}
                  </tr>
                ))}
                <tr className="font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
                  <td colSpan="4" className="border border-emerald-800 p-2 text-right text-sm">
                    TOTAL AMOUNT
                  </td>
                  <td className="border border-emerald-800 p-2 text-right text-sm">
                    {formatCurrency(calculations.subtotal)}
                  </td>
                  <td className="border border-emerald-800 p-2"></td>
                  <td className="border border-emerald-800 p-2 text-right text-sm">
                    {formatCurrency(calculations.cgst)}
                  </td>
                  <td className="border border-emerald-800 p-2"></td>
                  <td className="border border-emerald-800 p-2 text-right text-sm">
                    {formatCurrency(calculations.sgst)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Bank & Total */}
          <div className="grid grid-cols-2 gap-0 mt-4 text-xs border-t-2 border-emerald-600">
            <div className="p-6 border-r border-gray-300 bg-gradient-to-br from-blue-50 to-blue-100">
              <div className="flex items-center mb-3">
                <svg className="w-6 h-6 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                  <path
                    fillRule="evenodd"
                    d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="font-bold text-blue-800 text-sm">Our Bank Details</p>
              </div>
              <div className="space-y-2 bg-white rounded-lg p-4 shadow-sm border border-blue-200">
                <div className="flex justify-between">
                  <span className="text-gray-600">Bank Name:</span>
                  <span className="font-semibold text-gray-800">Punjab National Bank</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">A/c. No.:</span>
                  <span className="font-semibold text-gray-800">1045108700000064</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">IFSC Code:</span>
                  <span className="font-semibold text-gray-800">PUNB0104510</span>
                </div>
              </div>
            </div>
            <div className="p-6 bg-gradient-to-br from-emerald-50 to-emerald-100">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                  <span className="text-gray-700">Net Total</span>
                  <span className="font-bold text-gray-800 text-base">
                    {formatCurrency(calculations.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                  <span className="text-gray-700">Round Off</span>
                  <span className="font-bold text-gray-800 text-base">0.00</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-lg shadow-md">
                  <span className="font-bold text-white text-lg">Grand Total</span>
                  <span className="font-bold text-white text-xl">
                    {formatCurrency(calculations.grandTotal)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Amount in Words */}
          <div className="p-4 bg-gradient-to-r from-amber-50 to-amber-100 border-t-2 border-amber-400 text-xs">
            <div className="flex items-start">
              <svg
                className="w-5 h-5 mr-2 text-amber-600 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="font-semibold text-amber-800 mb-1">Amount in Words:</p>
                <p className="font-bold text-amber-900 text-sm leading-relaxed">
                  {numberToWords(Math.round(calculations.grandTotal))}
                </p>
              </div>
            </div>
          </div>

          {/* Narration */}
          <div className="p-4 bg-white border-t border-gray-300 text-xs">
            <div className="flex items-start">
              <svg
                className="w-5 h-5 mr-2 text-emerald-600 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="font-bold text-emerald-800 mb-1">Narration:</p>
                <p className="text-gray-700 leading-relaxed">
                  Towards bill for {bonusEmployees?.length > 0 ? 'Bonus Payment' : ''}{' '}
                  {bonusEmployees?.length > 0 && leaveEmployees?.length > 0 ? 'and' : ''}{' '}
                  {leaveEmployees?.length > 0 ? 'Leave Encashment' : ''} for{' '}
                  <span className="font-semibold">{formData.client}</span> for the month of{' '}
                  <span className="font-semibold">{formData.period}</span>.
                </p>
              </div>
            </div>
          </div>

          {/* HSN Summary */}
          <div className="p-4 bg-gray-50 border-t-2 border-emerald-600">
            <div className="flex items-center mb-3">
              <svg
                className="w-5 h-5 mr-2 text-emerald-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path
                  fillRule="evenodd"
                  d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="font-bold text-emerald-800 text-sm">HSN/SAC Summary</p>
            </div>
            <table className="w-full text-[10px] border-collapse shadow-sm">
              <thead>
                <tr className="bg-gradient-to-r from-emerald-700 to-emerald-600 text-white">
                  <th className="border border-emerald-800 p-2 font-bold">HSN/SAC Code</th>
                  <th className="border border-emerald-800 p-2 font-bold">Taxable Value</th>
                  <th className="border border-emerald-800 p-2 font-bold" colSpan="2">
                    Central Tax
                  </th>
                  <th className="border border-emerald-800 p-2 font-bold" colSpan="2">
                    State Tax
                  </th>
                  <th className="border border-emerald-800 p-2 font-bold" colSpan="2">
                    Integrated Tax
                  </th>
                  <th className="border border-emerald-800 p-2 font-bold">Total Tax Amt.</th>
                </tr>
                <tr className="bg-emerald-100 text-gray-700">
                  <th className="border border-gray-300 p-1"></th>
                  <th className="border border-gray-300 p-1"></th>
                  <th className="border border-gray-300 p-1 font-semibold">Rate</th>
                  <th className="border border-gray-300 p-1 font-semibold">Amount</th>
                  <th className="border border-gray-300 p-1 font-semibold">Rate</th>
                  <th className="border border-gray-300 p-1 font-semibold">Amount</th>
                  <th className="border border-gray-300 p-1 font-semibold">Rate</th>
                  <th className="border border-gray-300 p-1 font-semibold">Amount</th>
                  <th className="border border-gray-300 p-1"></th>
                </tr>
              </thead>
              <tbody className="bg-white">
                <tr className="hover:bg-emerald-50 transition-colors">
                  <td className="border border-gray-300 p-2 font-semibold text-gray-800">998539</td>
                  <td className="border border-gray-300 p-2 text-right font-medium">
                    {formatCurrency(calculations.subtotal)}
                  </td>
                  <td className="border border-gray-300 p-2 text-center text-blue-700">9.00</td>
                  <td className="border border-gray-300 p-2 text-right text-blue-700">
                    {formatCurrency(calculations.cgst)}
                  </td>
                  <td className="border border-gray-300 p-2 text-center text-purple-700">9.00</td>
                  <td className="border border-gray-300 p-2 text-right text-purple-700">
                    {formatCurrency(calculations.sgst)}
                  </td>
                  <td className="border border-gray-300 p-2 text-center text-gray-500">0.00</td>
                  <td className="border border-gray-300 p-2 text-right text-gray-500">0.00</td>
                  <td className="border border-gray-300 p-2 text-right font-bold text-emerald-700">
                    {formatCurrency(calculations.totalTax)}
                  </td>
                </tr>
                <tr className="font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
                  <td className="border border-emerald-800 p-2">TOTAL</td>
                  <td className="border border-emerald-800 p-2 text-right">
                    {formatCurrency(calculations.subtotal)}
                  </td>
                  <td className="border border-emerald-800 p-2"></td>
                  <td className="border border-emerald-800 p-2 text-right">
                    {formatCurrency(calculations.cgst)}
                  </td>
                  <td className="border border-emerald-800 p-2"></td>
                  <td className="border border-emerald-800 p-2 text-right">
                    {formatCurrency(calculations.sgst)}
                  </td>
                  <td className="border border-emerald-800 p-2"></td>
                  <td className="border border-emerald-800 p-2 text-right">0.00</td>
                  <td className="border border-emerald-800 p-2 text-right">
                    {formatCurrency(calculations.totalTax)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* GST Declaration */}
          <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-blue-200 text-xs">
            <div className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="font-bold text-blue-800">Issued Under Section 31(1) of GST ACT 2017</p>
            </div>
          </div>

          {/* Footer */}
          <div className="grid grid-cols-2 gap-0 border-t-2 border-emerald-600 text-xs bg-gray-50">
            <div className="p-6 border-r border-gray-300 bg-white">
              <div className="flex items-center mb-4">
                <svg
                  className="w-6 h-6 mr-2 text-emerald-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="font-bold text-emerald-800 text-sm">Terms & Conditions</p>
              </div>
              <div className="space-y-2 text-[10px] leading-relaxed text-gray-700">
                <div className="flex">
                  <span className="font-bold text-emerald-600 mr-2 flex-shrink-0">1.</span>
                  <p>
                    All Payments are to be made in the Favour of{' '}
                    <span className="font-semibold">'I Smart Facitech Private Limited'</span>.
                  </p>
                </div>
                <div className="flex">
                  <span className="font-bold text-emerald-600 mr-2 flex-shrink-0">2.</span>
                  <p>
                    Payment to be done within <span className="font-semibold">7 days</span> of
                    receipt of invoice.
                  </p>
                </div>
                <div className="flex">
                  <span className="font-bold text-emerald-600 mr-2 flex-shrink-0">3.</span>
                  <p>
                    Interest <span className="font-semibold">@24% p.a.</span> shall be charged, if
                    payment is not made within 15 days from the date of receipt.
                  </p>
                </div>
                <div className="flex">
                  <span className="font-bold text-emerald-600 mr-2 flex-shrink-0">4.</span>
                  <p>
                    As per the provision of MSME and registered under MSME act, delay in payment of
                    45 days can lead to Interest claim at a rate which is 3 times the existing bank
                    rate as notified by RBI along with filing litigation proceedings as per the said
                    act.
                  </p>
                </div>
                <div className="flex">
                  <span className="font-bold text-emerald-600 mr-2 flex-shrink-0">5.</span>
                  <p>
                    Any queries/Corrections will be entertained only within{' '}
                    <span className="font-semibold">3 days</span> from the date of submission of the
                    bill, No Corrections will be entertained thereafter.
                  </p>
                </div>
                <div className="flex">
                  <span className="font-bold text-emerald-600 mr-2 flex-shrink-0">6.</span>
                  <p>
                    All disputes are subject to{' '}
                    <span className="font-semibold">Mumbai jurisdiction</span> only.
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6 bg-gradient-to-br from-gray-50 to-white">
              <div className="mb-6 text-center pb-4 border-b border-gray-300">
                <p className="text-gray-600">
                  <span className="font-semibold text-gray-800">Created by:</span> TEJAS SUTHAR
                </p>
              </div>
              <p className="text-center mb-6 font-bold text-emerald-800 text-sm">
                For I SMART FACITECH PRIVATE LIMITED
              </p>
              <div className="flex justify-between items-end">
                <div className="text-center">
                  <div className="mb-20">
                    <div className="border-b-2 border-gray-400 w-32 mx-auto"></div>
                  </div>
                  <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                    <p className="font-bold text-gray-800 text-sm mb-1">MANOJ KAMBLI</p>
                    <p className="text-[10px] text-gray-600">
                      <span className="font-semibold">Date:</span>{' '}
                      {new Date().toLocaleDateString('en-IN')}
                    </p>
                    <p className="text-[10px] text-gray-600">
                      <span className="font-semibold">Time:</span>{' '}
                      {new Date().toLocaleTimeString('en-IN')}
                    </p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="w-24 h-24 border-2 border-emerald-600 rounded-lg mb-2 flex items-center justify-center bg-white shadow-sm">
                    <svg
                      className="w-8 h-8 text-emerald-300"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p className="font-bold text-gray-800 text-[11px]">Authorised Signatory</p>
                </div>
              </div>
            </div>
          </div>

          {/* Page Footer */}
          <div className="p-2 text-center text-xs bg-gradient-to-r from-gray-100 to-gray-200 border-t border-gray-300">
            <p className="text-gray-600 font-medium">Page 1 of 1</p>
          </div>
        </div>
      </div>

      {/* Email Status Toast */}
      {emailStatus && (
        <div
          className={`fixed bottom-4 right-4 z-50 max-w-md p-4 rounded-lg shadow-lg flex items-center gap-3 animate-slide-up ${emailStatus.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}
        >
          {emailStatus.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          ) : (
            <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          )}
          <p
            className={`text-sm font-medium ${emailStatus.type === 'success' ? 'text-green-800' : 'text-red-800'}`}
          >
            {emailStatus.message}
          </p>
        </div>
      )}

      <style>{`
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        
        .header-gradient {
          background: linear-gradient(to right, #047857, #059669, #047857);
        }
        
        @media print {
          @page {
            size: A4;
            margin: 5mm;
          }
          
          body * {
            visibility: hidden;
          }
          #invoice-content,
          #invoice-content * {
            visibility: visible;
          }
          #invoice-content {
            position: absolute;
            left: 50%;
            top: 0;
            transform: translateX(-50%) scale(0.88);
            transform-origin: top center;
            width: 210mm;
          }
          
          * {
            box-shadow: none !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          
          .header-gradient {
            background: #059669 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          .bg-gradient-to-r,
          .bg-emerald-700,
          .bg-emerald-600 {
            background-color: #059669 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          .bg-emerald-50 { background-color: #ecfdf5 !important; }
          .bg-emerald-100 { background-color: #d1fae5 !important; }
          .bg-gray-50 { background-color: #f9fafb !important; }
          .bg-blue-50 { background-color: #eff6ff !important; }
          .bg-amber-50 { background-color: #fffbeb !important; }
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
        
        tr {
          transition: background-color 0.2s ease;
        }
      `}</style>
    </div>
  )
}

export default BonusLeaveEncashmentInvoicePreview

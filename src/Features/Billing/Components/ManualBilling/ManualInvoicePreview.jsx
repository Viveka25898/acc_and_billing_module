import React, { useState } from 'react'
import { Download, ArrowLeft, Save, Send, Check, CheckCircle, XCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { formatCurrency, convertAmountToWords } from '../../utils/manualBillingCalculations'
// Use public folder path for logo to avoid bundling/import path issues
const iSmartLogo = '/iSmart Logo.jpg'
import emailjs from '@emailjs/browser'
import EmailModal from '../../Pages/AutoBilling/EmailModal'

const ManualInvoicePreview = ({
  formData,
  lineItems,
  calculations,
  irnDetails: propIrnDetails,
  onBack,
  isPreviewMode = false,
}) => {
  const navigate = useNavigate()
  const [isSaving, setIsSaving] = useState(false)
  const [isConverting, setIsConverting] = useState(false)
  const [saveStatus, setSaveStatus] = useState(null)
  const [irnDetails, setIrnDetails] = useState(
    propIrnDetails || {
      irnNumber: '',
      acknowledgementNumber: '',
    }
  )

  // Email functionality states
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  const [isEmailSending, setIsEmailSending] = useState(false)
  const [emailStatus, setEmailStatus] = useState(null)

  // Check if it's a Sales/Tax Invoice (support both 'sales' and 'tax' values)
  const isSalesInvoice = formData.invoiceSeries === 'sales' || formData.invoiceSeries === 'tax'

  // EmailJS Configuration (read from environment - set VITE_... vars in .env)
  const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || ''
  const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || ''
  const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || ''

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const handleDownloadPDF = () => {
    try {
      window.print()
    } catch (error) {
      console.error('Error printing:', error)
      alert('Failed to open print dialog. Please try again.')
    }
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      setSaveStatus(null)

      // Generate invoice number based on series
      const timestamp = Date.now().toString().slice(-6)
      const randomNum = Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, '0')
      const invoiceNumber =
        formData.invoiceSeries === 'proforma'
          ? `PO-MH01-${timestamp}${randomNum}`
          : `INV-${timestamp}${randomNum}`

      // Get current month and year for billing period
      const currentDate = new Date()
      const monthNames = [
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
      const billingMonth = monthNames[currentDate.getMonth()]
      const billingYear = currentDate.getFullYear()

      // Calculate invoice period
      const invoiceStartDate = new Date(formData.invoiceDate)
      const invoiceEndDate = formData.dueDate
        ? new Date(formData.dueDate)
        : new Date(invoiceStartDate.getTime() + 30 * 24 * 60 * 60 * 1000)

      const startDay = String(invoiceStartDate.getDate()).padStart(2, '0')
      const startMonth = String(invoiceStartDate.getMonth() + 1).padStart(2, '0')
      const startYear = invoiceStartDate.getFullYear()
      const endDay = String(invoiceEndDate.getDate()).padStart(2, '0')
      const endMonth = String(invoiceEndDate.getMonth() + 1).padStart(2, '0')
      const endYear = invoiceEndDate.getFullYear()

      const invoicePeriod = `${startDay}/${startMonth}/${startYear} to ${endDay}/${endMonth}/${endYear}`

      // Prepare client info
      const clientInfo = {
        name: formData.client,
        address: 'Client Address',
        gstin: '',
      }

      // Get service category label for narration
      const invoiceTypes = [
        { value: 'one-time-service', label: 'One-Time Service' },
        { value: 'hospital-billing', label: 'Hospital Billing' },
        { value: 'mst-material', label: 'MST (Material)' },
        { value: 'rm-maintenance', label: 'R&M (Repairs & Maintenance)' },
        { value: 'deep-cleaning', label: 'Deep Cleaning' },
        { value: 'extra-duty', label: 'Extra Duty' },
        { value: 'per-day-service', label: 'Per Day Service' },
        { value: 'po-based', label: 'PO-Based Billing' },
        { value: 'other', label: 'Other' },
      ]

      const serviceCategoryLabel =
        invoiceTypes.find((type) => type.value === formData.invoiceType)?.label ||
        formData.invoiceType

      // Prepare invoice data for storage - following the same structure as auto-billing
      const invoiceData = {
        id: invoiceNumber,
        invoiceNumber: invoiceNumber,
        invoiceType: formData.invoiceSeries,
        formData: {
          customer: formData.client,
          branch: formData.client, // For manual invoices, use client name
          poWoNumber: formData.poWoNumber,
          invoiceDate: formData.invoiceDate,
          dueDate: formData.dueDate,
          invoiceSeries: formData.invoiceSeries,
        },
        clientInfo: clientInfo,
        billingPeriod: {
          month: billingMonth,
          year: billingYear,
          period: invoicePeriod,
        },
        serviceCategory: serviceCategoryLabel,
        narration: `Towards bill for ${serviceCategoryLabel} rendered at ${formData.client} for the period ${invoicePeriod}`,
        lineItems: lineItems,
        calculations: calculations,
        amountInWords: convertAmountToWords(calculations.grandTotal),
        notes: formData.notes,
        gstRate: formData.gstRate,
        discount: formData.discount,
        otherCharges: formData.otherCharges,
        source: 'manual',
        createdBy: 'Billing Manager',
        irnDetails: isSalesInvoice ? irnDetails : null,
        status: isSalesInvoice ? 'draft' : 'generated',
        metadata: {
          createdAt: new Date().toISOString(),
          createdBy: 'Billing Manager',
          lastModified: new Date().toISOString(),
          status: isSalesInvoice ? 'draft' : 'generated',
          sentToClient: false,
          clientFeedback: null,
          viewCount: 0,
          downloadCount: 0,
        },
        type: isSalesInvoice ? 'tax' : 'proforma',
      }

      // Determine storage key based on invoice type
      const storageKey = isSalesInvoice ? 'tax_invoices' : 'proforma_invoices'

      // Get existing invoices from localStorage
      const existingInvoices = JSON.parse(localStorage.getItem(storageKey) || '[]')

      // Add new invoice
      existingInvoices.push(invoiceData)

      // Save to localStorage
      localStorage.setItem(storageKey, JSON.stringify(existingInvoices))

      setSaveStatus({
        type: 'success',
        message: 'Invoice saved successfully!',
      })

      // Navigate to appropriate page based on invoice type
      setTimeout(() => {
        const targetRoute = isSalesInvoice
          ? '/dashboard/billing-manager/irn-invoices'
          : '/dashboard/billing-manager/proforma-invoices'
        navigate(targetRoute)
      }, 2000)
    } catch (error) {
      console.error('Error saving invoice:', error)
      setSaveStatus({
        type: 'error',
        message: 'Failed to save invoice: ' + error.message,
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleConvertToFinalInvoice = async () => {
    try {
      setIsConverting(true)
      setSaveStatus(null)

      // Simulate IRN generation process with loader (2 seconds)
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Generate dummy IRN and Acknowledgement numbers
      const generatedIRN = `IRN${Date.now()}${Math.floor(Math.random() * 1000)}`
      const generatedAck = `ACK${Date.now()}${Math.floor(Math.random() * 1000)}`

      // IRN and Acknowledgement generated (not logged for production)

      setIrnDetails({
        irnNumber: generatedIRN,
        acknowledgementNumber: generatedAck,
      })

      // Generate invoice number
      const timestamp = Date.now().toString().slice(-6)
      const randomNum = Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, '0')
      const invoiceNumber = `INV-${timestamp}${randomNum}`

      // Prepare complete invoice data
      const currentDate = new Date()
      const monthNames = [
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
      const billingMonth = monthNames[currentDate.getMonth()]
      const billingYear = currentDate.getFullYear()

      const invoiceStartDate = new Date(formData.invoiceDate)
      const invoiceEndDate = formData.dueDate
        ? new Date(formData.dueDate)
        : new Date(invoiceStartDate.getTime() + 30 * 24 * 60 * 60 * 1000)

      const startDay = String(invoiceStartDate.getDate()).padStart(2, '0')
      const startMonth = String(invoiceStartDate.getMonth() + 1).padStart(2, '0')
      const startYear = invoiceStartDate.getFullYear()
      const endDay = String(invoiceEndDate.getDate()).padStart(2, '0')
      const endMonth = String(invoiceEndDate.getMonth() + 1).padStart(2, '0')
      const endYear = invoiceEndDate.getFullYear()

      const invoicePeriod = `${startDay}/${startMonth}/${startYear} to ${endDay}/${endMonth}/${endYear}`

      const serviceCategoryLabel =
        invoiceTypes.find((type) => type.value === formData.invoiceType)?.label ||
        formData.invoiceType

      const invoiceData = {
        id: invoiceNumber,
        invoiceNumber: invoiceNumber,
        invoiceType: 'sales',
        formData: {
          customer: formData.client,
          branch: formData.client,
          poWoNumber: formData.poWoNumber,
          invoiceDate: formData.invoiceDate,
          dueDate: formData.dueDate,
          invoiceSeries: 'sales',
        },
        clientInfo: {
          name: formData.client,
          address: 'Client Address',
          gstin: '',
        },
        billingPeriod: {
          month: billingMonth,
          year: billingYear,
          period: invoicePeriod,
        },
        serviceCategory: serviceCategoryLabel,
        narration: `Towards bill for ${serviceCategoryLabel} rendered at ${formData.client} for the period ${invoicePeriod}`,
        lineItems: lineItems,
        calculations: calculations,
        amountInWords: convertAmountToWords(calculations.grandTotal),
        notes: formData.notes,
        gstRate: formData.gstRate,
        discount: formData.discount,
        otherCharges: formData.otherCharges,
        source: 'manual',
        createdBy: 'Billing Manager',
        irnDetails: {
          irnNumber: generatedIRN,
          acknowledgementNumber: generatedAck,
        },
        status: 'final',
        metadata: {
          createdAt: new Date().toISOString(),
          createdBy: 'Billing Manager',
          lastModified: new Date().toISOString(),
          status: 'final',
          sentToClient: false,
          clientFeedback: null,
          viewCount: 0,
          downloadCount: 0,
        },
        type: 'tax',
      }

      // Save to tax storage
      const storageKey = 'tax_invoices'
      const existingInvoices = JSON.parse(localStorage.getItem(storageKey) || '[]')
      existingInvoices.push(invoiceData)
      localStorage.setItem(storageKey, JSON.stringify(existingInvoices))

      setSaveStatus({
        type: 'success',
        message: `Invoice converted to final with IRN successfully!`,
      })

      // Navigate to IRN invoices after 3 seconds to show the IRN on page
      setTimeout(() => {
        navigate('/dashboard/billing-manager/irn-invoices')
      }, 3000)
    } catch (error) {
      console.error('Error converting to final invoice:', error)
      setSaveStatus({
        type: 'error',
        message: 'Failed to convert invoice: ' + error.message,
      })
    } finally {
      setIsConverting(false)
    }
  }

  const handleSendEmail = () => {
    setIsEmailModalOpen(true)
    setEmailStatus(null) // Reset status when opening modal
  }

  const handleEmailSend = async (emailData) => {
    setIsEmailSending(true)
    setEmailStatus(null)

    try {
      // Initialize EmailJS
      emailjs.init(EMAILJS_PUBLIC_KEY)

      // Prepare invoice data for email
      const invoiceType = formData.invoiceSeries === 'proforma' ? 'Proforma Invoice' : 'Tax Invoice'
      const invoiceNumber = formData.poWoNumber || 'N/A'
      const invoiceDate = formatDate(formData.invoiceDate)
      const invoiceAmount = formatCurrency(calculations.grandTotal)

      // Calculate billing month from invoice date
      const invoiceDateObj = new Date(formData.invoiceDate)
      const monthNames = [
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
      const billingMonth = `${monthNames[invoiceDateObj.getMonth()]} ${invoiceDateObj.getFullYear()}`

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
        customer_name: formData.client || 'N/A',
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

  // Calculate HSN/SAC summary
  const calculateHSNSummary = () => {
    const defaultHSN = '998599'

    return [
      {
        hsnCode: defaultHSN,
        taxableValue: calculations.subtotal,
        cgstRate: calculations.gst.type === 'CGST+SGST' ? calculations.gst.rate / 2 : 0,
        cgstAmount: calculations.gst.type === 'CGST+SGST' ? calculations.gst.amount / 2 : 0,
        sgstRate: calculations.gst.type === 'CGST+SGST' ? calculations.gst.rate / 2 : 0,
        sgstAmount: calculations.gst.type === 'CGST+SGST' ? calculations.gst.amount / 2 : 0,
        igstRate: calculations.gst.type === 'IGST' ? calculations.gst.rate : 0,
        igstAmount: calculations.gst.type === 'IGST' ? calculations.gst.amount : 0,
        totalTax: calculations.gst.amount,
      },
    ]
  }

  const hsnSummary = calculateHSNSummary()

  // Get service category label
  const invoiceTypes = [
    { value: 'one-time-service', label: 'One-Time Service' },
    { value: 'hospital-billing', label: 'Hospital Billing' },
    { value: 'mst-material', label: 'MST (Material)' },
    { value: 'rm-maintenance', label: 'R&M (Repairs & Maintenance)' },
    { value: 'deep-cleaning', label: 'Deep Cleaning' },
    { value: 'extra-duty', label: 'Extra Duty' },
    { value: 'per-day-service', label: 'Per Day Service' },
    { value: 'po-based', label: 'PO-Based Billing' },
    { value: 'other', label: 'Other' },
  ]

  const serviceCategoryLabel =
    invoiceTypes.find((type) => type.value === formData.invoiceType)?.label || formData.invoiceType

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-4 sm:py-6 px-2 sm:px-4">
      {/* Action Buttons - Hide in preview mode */}
      {!isPreviewMode && (
        <div className="max-w-[210mm] mx-auto mb-4 print:hidden">
          {/* Status Message */}
          {saveStatus && (
            <div
              className={`mb-4 rounded-lg p-4 ${
                saveStatus.type === 'success'
                  ? 'bg-green-50 border border-green-200 text-green-800'
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}
            >
              <p className="text-sm font-medium flex items-center gap-2">
                {saveStatus.type === 'success' && <Check className="w-5 h-5" />}
                {saveStatus.message}
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-2 sm:gap-3 justify-between">
            <button
              onClick={onBack}
              disabled={isSaving}
              className="px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-lg hover:from-gray-800 hover:to-gray-900 text-xs sm:text-sm font-medium flex items-center shadow-md transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Back to Form</span>
              <span className="sm:hidden">Back</span>
            </button>

            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={handleDownloadPDF}
                disabled={isSaving}
                className="px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 text-xs sm:text-sm font-medium flex items-center shadow-md transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Download PDF</span>
                <span className="sm:hidden">PDF</span>
              </button>

              <button
                onClick={handleSendEmail}
                disabled={isSaving}
                className="px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 text-xs sm:text-sm font-medium flex items-center shadow-md transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Send Email</span>
                <span className="sm:hidden">Email</span>
              </button>

              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-800 text-xs sm:text-sm font-medium flex items-center shadow-md transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 mr-1 sm:mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Save Invoice</span>
                    <span className="sm:hidden">Save</span>
                  </>
                )}
              </button>

              {isSalesInvoice && (
                <button
                  onClick={handleConvertToFinalInvoice}
                  disabled={isConverting}
                  className="px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 text-xs sm:text-sm font-medium flex items-center shadow-md transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isConverting ? (
                    <>
                      <div className="w-4 h-4 mr-1 sm:mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Generating IRN...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">Convert to Final</span>
                      <span className="sm:hidden">Convert</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Invoice Content - A4 Size */}
      <div className="max-w-[210mm] mx-auto bg-white shadow-2xl print:shadow-none">
        {/* Header Section with Green Background */}
        <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 px-8 py-6 flex items-start justify-between">
          {/* Logo Section */}
          <div className="bg-white rounded-lg p-4 shadow-lg">
            <img src={iSmartLogo} alt="iSmart Logo" className="h-12 w-auto" />
          </div>

          {/* Invoice Type Badge */}
          <div className="text-right">
            <h1 className="text-3xl font-bold text-white tracking-wide">
              {irnDetails.irnNumber || propIrnDetails?.irnNumber
                ? 'TAX INVOICE'
                : formData.invoiceSeries === 'proforma'
                  ? 'PROFORMA INVOICE'
                  : 'TAX INVOICE'}
            </h1>
            <p className="text-white text-sm mt-1 font-medium">
              {irnDetails.irnNumber || propIrnDetails?.irnNumber
                ? '(TAX INVOICE)'
                : formData.invoiceSeries === 'proforma'
                  ? '(ORIGINAL)'
                  : '(TAX INVOICE)'}
            </p>
          </div>
        </div>

        {/* Company Details */}
        <div className="px-8 py-6 border-b-2 border-gray-200">
          <h2 className="text-xl font-bold text-emerald-800 mb-3">
            I SMART FACITECH PRIVATE LIMITED
          </h2>
          <div className="text-sm text-gray-700 space-y-1">
            <p className="flex items-start">
              <span className="text-emerald-600 mr-2">📍</span>
              <span>
                317, 3rd Floor, A/2, Nilgiri, Wadala Truck Terminal,
                <br />
                Near Wadala RTO, Mumbai-400037
              </span>
            </p>
            <p className="flex items-center">
              <span className="text-emerald-600 mr-2">📞</span>
              <span>9152729982</span>
              <span className="mx-3">|</span>
              <span className="text-emerald-600 mr-2">✉</span>
              <span>vinayak.b@ismartindia.com</span>
            </p>
            <p className="flex items-center pt-2">
              <span className="font-semibold mr-2">GST No:</span>
              <span className="text-emerald-700 font-medium">27AAKCC4528JUZ6</span>
              <span className="mx-4">|</span>
              <span className="font-semibold mr-2">State:</span>
              <span className="text-emerald-700 font-medium">Maharashtra (27)</span>
            </p>
          </div>
        </div>

        {/* Invoice Information and Billing Period Grid */}
        <div className="grid grid-cols-2 border-b-2 border-gray-200">
          {/* Invoice Information */}
          <div className="border-r border-gray-200 p-6 bg-emerald-50">
            <h3 className="text-sm font-bold text-emerald-800 mb-3 flex items-center">
              <span className="mr-2">📄</span>
              Invoice Information
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Invoice No.:</span>
                <span className="font-semibold text-emerald-700">{formData.poWoNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Invoice Date:</span>
                <span className="font-semibold">{formatDate(formData.invoiceDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Acknowledgment No.:</span>
                <span className="font-semibold">
                  {irnDetails.acknowledgementNumber || propIrnDetails?.acknowledgementNumber || '—'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">IRN No.:</span>
                <span className="font-semibold">
                  {irnDetails.irnNumber || propIrnDetails?.irnNumber || '—'}
                </span>
              </div>
            </div>
          </div>

          {/* Billing Period */}
          <div className="p-6 bg-emerald-50">
            <h3 className="text-sm font-bold text-emerald-800 mb-3 flex items-center">
              <span className="mr-2">📅</span>
              Billing Period
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Bill For Month:</span>
                <span className="font-semibold text-emerald-700">
                  {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Invoice Period:</span>
                <span className="font-semibold">
                  {formatDate(formData.invoiceDate)} to{' '}
                  {formatDate(formData.dueDate || formData.invoiceDate)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bill To and Ship/Service Provided To */}
        <div className="grid grid-cols-2 border-b-2 border-gray-200">
          {/* Bill To */}
          <div className="border-r border-gray-200 p-6 bg-white">
            <h3 className="text-sm font-bold text-emerald-800 mb-3 flex items-center">
              <span className="mr-2">🏢</span>
              Bill To
            </h3>
            <div className="text-sm space-y-1">
              <p className="font-bold text-gray-900">{formData.client}</p>
              <p className="text-gray-600">Client Address</p>
              <p className="text-gray-600">Location Details</p>
              <p className="text-gray-600 mt-2">
                <span className="font-semibold">GST No.:</span> —
              </p>
            </div>
          </div>

          {/* Ship/Service Provided To */}
          <div className="p-6 bg-white">
            <h3 className="text-sm font-bold text-emerald-800 mb-3 flex items-center">
              <span className="mr-2">🚚</span>
              Ship/Service Provided To
            </h3>
            <div className="text-sm space-y-1">
              <p className="font-bold text-gray-900">{formData.client}</p>
              <p className="text-gray-600">Service Location</p>
              <p className="text-gray-600">Location Details</p>
              <p className="text-gray-600 mt-2">
                <span className="font-semibold">GST No.:</span> —
              </p>
            </div>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-emerald-700 text-white">
              <tr>
                <th className="px-4 py-3 text-left font-semibold border-r border-emerald-600">
                  SL
                </th>
                <th className="px-4 py-3 text-left font-semibold border-r border-emerald-600">
                  Description
                </th>
                <th className="px-4 py-3 text-center font-semibold border-r border-emerald-600">
                  HSN/SAC
                </th>
                <th className="px-4 py-3 text-center font-semibold border-r border-emerald-600">
                  Qty
                </th>
                <th className="px-4 py-3 text-right font-semibold border-r border-emerald-600">
                  Rate
                </th>
                <th className="px-4 py-3 text-right font-semibold border-r border-emerald-600">
                  Rate (Day)
                </th>
                <th className="px-4 py-3 text-right font-semibold border-r border-emerald-600">
                  Duty Days
                </th>
                <th className="px-4 py-3 text-right font-semibold border-r border-emerald-600">
                  Amount
                </th>
                <th className="px-4 py-3 text-right font-semibold">CGST / SGST</th>
              </tr>
              <tr className="bg-emerald-600 text-white text-xs">
                <th className="px-4 py-2 border-r border-emerald-500"></th>
                <th className="px-4 py-2 border-r border-emerald-500"></th>
                <th className="px-4 py-2 border-r border-emerald-500"></th>
                <th className="px-4 py-2 border-r border-emerald-500"></th>
                <th className="px-4 py-2 border-r border-emerald-500"></th>
                <th className="px-4 py-2 border-r border-emerald-500"></th>
                <th className="px-4 py-2 border-r border-emerald-500"></th>
                <th className="px-4 py-2 text-right border-r border-emerald-500">Rate / Amount</th>
                <th className="px-4 py-2 text-right">Rate / Amount</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {lineItems.map((item, index) => (
                <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3 border-r border-gray-200">{index + 1}</td>
                  <td className="px-4 py-3 border-r border-gray-200">{item.description}</td>
                  <td className="px-4 py-3 text-center border-r border-gray-200">998599</td>
                  <td className="px-4 py-3 text-center border-r border-gray-200">
                    {item.quantity}
                  </td>
                  <td className="px-4 py-3 text-right border-r border-gray-200">
                    {formatCurrency(item.rate)}
                  </td>
                  <td className="px-4 py-3 text-right border-r border-gray-200">
                    {formatCurrency(item.rate)}
                  </td>
                  <td className="px-4 py-3 text-right border-r border-gray-200">{item.quantity}</td>
                  <td className="px-4 py-3 text-right border-r border-gray-200">
                    {formatCurrency(item.total)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="text-emerald-700">
                      {calculations.gst.type === 'CGST+SGST' ? (
                        <>
                          <div>{calculations.gst.rate / 2}%</div>
                          <div className="text-xs text-gray-600">
                            {formatCurrency((item.total * (calculations.gst.rate / 2)) / 100)}
                          </div>
                        </>
                      ) : (
                        <>
                          <div>{calculations.gst.rate}%</div>
                          <div className="text-xs text-gray-600">
                            {formatCurrency((item.total * calculations.gst.rate) / 100)}
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {/* Total Row */}
              <tr className="bg-emerald-700 text-white font-bold">
                <td colSpan="7" className="px-4 py-3 text-right border-r border-emerald-600">
                  TOTAL AMOUNT
                </td>
                <td className="px-4 py-3 text-right border-r border-emerald-600">
                  {formatCurrency(calculations.subtotal)}
                </td>
                <td className="px-4 py-3 text-right">
                  {calculations.gst.type === 'CGST+SGST' ? (
                    <div>
                      <div>{formatCurrency(calculations.gst.amount / 2)}</div>
                      <div className="text-xs">+{formatCurrency(calculations.gst.amount / 2)}</div>
                    </div>
                  ) : (
                    formatCurrency(calculations.gst.amount)
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Bank Details and Totals Section */}
        <div className="grid grid-cols-5 border-t-2 border-gray-200">
          {/* Bank Details */}
          <div className="col-span-3 border-r border-gray-200 p-6 bg-blue-50">
            <h3 className="text-sm font-bold text-blue-900 mb-3 flex items-center">
              <span className="mr-2">🏦</span>
              Our Bank Details
            </h3>
            <div className="text-sm space-y-2">
              <div className="flex">
                <span className="text-gray-600 w-32">Bank Name:</span>
                <span className="font-semibold text-blue-900">Punjab National Bank</span>
              </div>
              <div className="flex">
                <span className="text-gray-600 w-32">A/c No.:</span>
                <span className="font-semibold text-blue-900">1043108700000064</span>
              </div>
              <div className="flex">
                <span className="text-gray-600 w-32">IFSC Code:</span>
                <span className="font-semibold text-blue-900">PUNB0104510</span>
              </div>
            </div>
          </div>

          {/* Totals */}
          <div className="col-span-2 p-6 bg-white">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between pb-2 border-b border-gray-200">
                <span className="text-gray-700">Net Total:</span>
                <span className="font-bold text-gray-900">
                  {formatCurrency(calculations.subtotal + calculations.gst.amount)}
                </span>
              </div>
              <div className="flex justify-between pb-2 border-b border-gray-200">
                <span className="text-gray-700">Round Off:</span>
                <span className="font-bold text-gray-900">0.00</span>
              </div>
              <div className="flex justify-between pt-2 bg-emerald-700 text-white px-4 py-3 -mx-6 mt-4 rounded-lg">
                <span className="font-bold text-lg">Grand Total:</span>
                <span className="font-bold text-xl">{formatCurrency(calculations.grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Amount in Words */}
        <div className="px-8 py-4 bg-yellow-50 border-t border-b border-yellow-200">
          <div className="flex items-start">
            <span className="text-yellow-700 mr-2">⚠</span>
            <div>
              <span className="font-semibold text-gray-800">Amount in Words:</span>
              <p className="text-gray-900 font-medium uppercase mt-1">
                {convertAmountToWords(calculations.grandTotal)}
              </p>
            </div>
          </div>
        </div>

        {/* Narration */}
        <div className="px-8 py-4 bg-blue-50 border-b border-blue-200">
          <div className="flex items-start">
            <span className="text-blue-700 mr-2">ℹ</span>
            <div>
              <span className="font-semibold text-blue-900">Narration:</span>
              <p className="text-gray-800 mt-1">
                {formData.notes ||
                  `Towards bill for ${serviceCategoryLabel} rendered at ${formData.client} Location for the period from ${formatDate(formData.invoiceDate)} to ${formatDate(formData.dueDate || formData.invoiceDate)}.`}
              </p>
            </div>
          </div>
        </div>

        {/* HSN/SAC Summary */}
        <div className="px-8 py-6 border-b border-gray-200">
          <h3 className="text-sm font-bold text-emerald-800 mb-3 flex items-center">
            <span className="mr-2">📊</span>
            HSN/SAC Summary
          </h3>
          <table className="w-full text-sm">
            <thead className="bg-emerald-700 text-white">
              <tr>
                <th className="px-3 py-2 text-left font-semibold border-r border-emerald-600">
                  HSN/SAC Code
                </th>
                <th className="px-3 py-2 text-right font-semibold border-r border-emerald-600">
                  Taxable Value
                </th>
                <th
                  className="px-3 py-2 text-center font-semibold border-r border-emerald-600"
                  colSpan="2"
                >
                  Central Tax
                </th>
                <th
                  className="px-3 py-2 text-center font-semibold border-r border-emerald-600"
                  colSpan="2"
                >
                  State Tax
                </th>
                <th
                  className="px-3 py-2 text-center font-semibold border-r border-emerald-600"
                  colSpan="2"
                >
                  Integrated Tax
                </th>
                <th className="px-3 py-2 text-right font-semibold">Total Tax Amt.</th>
              </tr>
              <tr className="bg-emerald-600 text-white text-xs">
                <th className="px-3 py-1 border-r border-emerald-500"></th>
                <th className="px-3 py-1 border-r border-emerald-500"></th>
                <th className="px-3 py-1 text-center border-r border-emerald-500">Rate</th>
                <th className="px-3 py-1 text-center border-r border-emerald-500">Amount</th>
                <th className="px-3 py-1 text-center border-r border-emerald-500">Rate</th>
                <th className="px-3 py-1 text-center border-r border-emerald-500">Amount</th>
                <th className="px-3 py-1 text-center border-r border-emerald-500">Rate</th>
                <th className="px-3 py-1 text-center border-r border-emerald-500">Amount</th>
                <th className="px-3 py-1"></th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {hsnSummary.map((hsn, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="px-3 py-2 border-r border-gray-200 font-medium">{hsn.hsnCode}</td>
                  <td className="px-3 py-2 text-right border-r border-gray-200">
                    {formatCurrency(hsn.taxableValue)}
                  </td>
                  <td className="px-3 py-2 text-center border-r border-gray-200 text-emerald-700">
                    {hsn.cgstRate > 0 ? `${hsn.cgstRate}%` : '0.00'}
                  </td>
                  <td className="px-3 py-2 text-right border-r border-gray-200 text-emerald-700">
                    {formatCurrency(hsn.cgstAmount)}
                  </td>
                  <td className="px-3 py-2 text-center border-r border-gray-200 text-emerald-700">
                    {hsn.sgstRate > 0 ? `${hsn.sgstRate}%` : '0.00'}
                  </td>
                  <td className="px-3 py-2 text-right border-r border-gray-200 text-emerald-700">
                    {formatCurrency(hsn.sgstAmount)}
                  </td>
                  <td className="px-3 py-2 text-center border-r border-gray-200 text-emerald-700">
                    {hsn.igstRate > 0 ? `${hsn.igstRate}%` : '0.00'}
                  </td>
                  <td className="px-3 py-2 text-right border-r border-gray-200 text-emerald-700">
                    {formatCurrency(hsn.igstAmount)}
                  </td>
                  <td className="px-3 py-2 text-right font-semibold text-emerald-700">
                    {formatCurrency(hsn.totalTax)}
                  </td>
                </tr>
              ))}
              <tr className="bg-emerald-700 text-white font-bold">
                <td className="px-3 py-2 text-right border-r border-emerald-600">TOTAL</td>
                <td className="px-3 py-2 text-right border-r border-emerald-600">
                  {formatCurrency(calculations.subtotal)}
                </td>
                <td className="px-3 py-2 border-r border-emerald-600"></td>
                <td className="px-3 py-2 text-right border-r border-emerald-600">
                  {formatCurrency(hsnSummary[0].cgstAmount)}
                </td>
                <td className="px-3 py-2 border-r border-emerald-600"></td>
                <td className="px-3 py-2 text-right border-r border-emerald-600">
                  {formatCurrency(hsnSummary[0].sgstAmount)}
                </td>
                <td className="px-3 py-2 border-r border-emerald-600"></td>
                <td className="px-3 py-2 text-right border-r border-emerald-600">
                  {formatCurrency(hsnSummary[0].igstAmount)}
                </td>
                <td className="px-3 py-2 text-right">{formatCurrency(calculations.gst.amount)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer with Section 31(1) */}
        <div className="px-8 py-4 bg-gray-100 text-center border-b border-gray-200">
          <div className="inline-flex items-center justify-center bg-blue-100 border border-blue-300 rounded-full px-4 py-2">
            <span className="text-blue-700 text-sm font-medium">
              📜 Issued Under Section 31(1) of GST ACT 2017
            </span>
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className="px-8 py-6 border-b border-gray-200 bg-gray-50">
          <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center">
            <span className="mr-2">📋</span>
            Terms & Conditions
          </h3>
          <ol className="text-xs text-gray-700 space-y-2 list-decimal pl-5">
            <li>All Payments are to be made in the favour of I Smart Facitech Private Limited.</li>
            <li>Payment to be done within 7 days of receipt of invoice.</li>
            <li>
              Interest @24% p.a. shall be charged, if payment is not made within 15 days from the
              date of receipt.
            </li>
            <li>
              As per the provision of MSME act, registered under MSME act, delay in payment of 45
              days from the date of bill, an interest which is 3 times more than the bank rate
              notified by RBI along with filing litigation proceedings as per the act shall be
              applied.
            </li>
            <li>
              All cheques/DD should be crossed and drawn exclusively only within 3 days from the
              date of submission of the bill. No compensation to be entertained thereafter.
            </li>
            <li>All disputes are subject to Mumbai jurisdiction only.</li>
          </ol>
        </div>

        {/* Signature Section */}
        <div className="px-8 py-8 flex justify-between items-end">
          <div className="text-sm text-gray-600">
            <p className="mb-1">
              Created by: <span className="font-semibold text-gray-800">TEJAS SUTHAR</span>
            </p>
            <p className="text-xs text-gray-500">
              Date: {formatDate(new Date().toISOString().split('T')[0])}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              For <span className="font-semibold">I SMART FACITECH PRIVATE LIMITED</span>
            </p>
          </div>

          <div className="text-center">
            <div className="mb-16">
              <div className="w-48 h-20 border-2 border-dashed border-emerald-300 rounded-lg flex items-center justify-center mb-2">
                <div className="w-32 h-16 bg-green-100 rounded flex items-center justify-center">
                  <Check className="w-12 h-12 text-emerald-600" />
                </div>
              </div>
            </div>
            <div className="border-t-2 border-gray-800 pt-2 w-48">
              <p className="font-bold text-gray-900">MANOJ KAMBLE</p>
              <p className="text-sm text-gray-600 font-semibold mt-1">Authorised Signatory</p>
            </div>
          </div>
        </div>

        {/* Footer - Page Number */}
        <div className="px-8 py-3 bg-gray-100 text-center text-xs text-gray-600 border-t border-gray-200">
          Page 1 of 1
        </div>
      </div>

      {/* Email Modal */}
      <EmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        onSend={handleEmailSend}
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

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
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

export default ManualInvoicePreview

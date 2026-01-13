import React, { useState } from 'react'
import { Eye, Download, FileText, CheckCircle2, Send, Mail, Check } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import emailjs from '@emailjs/browser'
import EmailModal from '../Pages/AutoBilling/EmailModal'

const IRNInvoiceTable = ({
  invoices,
  onView,
  onDownload,
  onConvertToFinal,
  isLoading,
  isConverting,
  onEmailSent,
}) => {
  // Email functionality states
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  const [isEmailSending, setIsEmailSending] = useState(false)
  const [emailStatus, setEmailStatus] = useState(null)
  const [selectedInvoiceForEmail, setSelectedInvoiceForEmail] = useState(null)

  // EmailJS Configuration
  const EMAILJS_SERVICE_ID = 'service_4eqrbpn'
  const EMAILJS_TEMPLATE_ID = 'template_o3siur5'
  const EMAILJS_PUBLIC_KEY = '1_eh922Ifu06Mv7Cb'

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: {
        bg: 'bg-gray-100',
        text: 'text-gray-700',
        border: 'border-gray-300',
        label: 'Draft',
      },
      final: {
        bg: 'bg-green-100',
        text: 'text-green-700',
        border: 'border-green-300',
        label: 'Final',
      },
      generated: {
        bg: 'bg-emerald-100',
        text: 'text-emerald-700',
        border: 'border-emerald-300',
        label: 'Generated',
      },
      sent: {
        bg: 'bg-purple-100',
        text: 'text-purple-700',
        border: 'border-purple-300',
        label: 'Sent',
      },
      received: {
        bg: 'bg-amber-100',
        text: 'text-amber-700',
        border: 'border-amber-300',
        label: 'Received',
      },
      converted: {
        bg: 'bg-blue-100',
        text: 'text-blue-700',
        border: 'border-blue-300',
        label: 'Converted',
      },
    }

    const config = statusConfig[status] || statusConfig.draft

    return (
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}
      >
        {config.label}
      </span>
    )
  }

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString)
      return (
        <>
          <div className="font-medium text-gray-900">
            {date.toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </div>
          <div className="text-xs text-gray-500">
            {formatDistanceToNow(date, { addSuffix: true })}
          </div>
        </>
      )
    } catch {
      return 'Invalid date'
    }
  }

  const handleResendClick = (invoice) => {
    setSelectedInvoiceForEmail(invoice)
    setIsEmailModalOpen(true)
    setEmailStatus(null)
  }

  const handleEmailSend = async (emailData) => {
    setIsEmailSending(true)
    setEmailStatus(null)

    try {
      emailjs.init(EMAILJS_PUBLIC_KEY)

      const invoice = selectedInvoiceForEmail
      const isManual = invoice.source === 'manual'
      const invoiceType = 'Tax Invoice'
      const invoiceNumber = invoice.invoiceNumber || invoice.formData?.poWoNumber || 'N/A'
      const invoiceDate = invoice.metadata?.createdAt || invoice.createdAt
      const invoiceAmount = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
      }).format(invoice.calculations?.grandTotal || 0)

      const invoiceDateObj = new Date(invoiceDate)
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

      const customerName = isManual
        ? invoice.formData?.customer || invoice.client
        : invoice.formData?.customer
      const branchName = isManual ? invoice.formData?.branch : invoice.formData?.branch

      const templateParams = {
        to_email: emailData.recipientEmail,
        to_name: emailData.recipientName,
        reply_to: 'vivekawari50@gmail.com',
        from_name: 'iSmart Facitech Private Limited',
        invoice_type: invoiceType,
        invoice_number: invoiceNumber,
        invoice_date: invoiceDateObj.toLocaleDateString('en-IN'),
        invoice_amount: invoiceAmount,
        billing_month: billingMonth,
        customer_name: customerName || 'N/A',
        branch_name: branchName || 'N/A',
        message: emailData.message || 'Please review the invoice details below.',
      }

      const response = await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)

      if (response.status === 200) {
        setEmailStatus({
          type: 'success',
          message: `Invoice sent successfully to ${emailData.recipientEmail}!`,
        })

        // Update invoice status to sent
        if (onEmailSent) {
          onEmailSent(invoice.id)
        }

        setTimeout(() => {
          setIsEmailModalOpen(false)
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

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
        <div className="flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mb-4"></div>
          <p className="text-gray-600 font-medium">Loading invoices...</p>
        </div>
      </div>
    )
  }

  if (invoices.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
        <div className="flex flex-col items-center justify-center text-center">
          <FileText className="w-16 h-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Invoices Found</h3>
          <p className="text-gray-600 mb-6 max-w-md">
            No IRN invoices match your current filters. Try adjusting your search criteria or create
            a new invoice.
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden w-full">
        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full min-w-full border border-black">
            <thead className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white border border-black">
              <tr className=" border border-black">
                <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider border border-black">
                  Invoice No.
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider border border-black">
                  Type
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider border border-black">
                  Customer
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider border border-black">
                  Branch/Narration
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider border border-black">
                  IRN No.
                </th>
                <th className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wider border border-black">
                  Amount
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider border border-black">
                  Created By
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider border border-black">
                  Created Date
                </th>
                <th className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider border border-black">
                  Status
                </th>
                <th className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider border border-black">
                  Sent
                </th>
                <th className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider border border-black">
                  Views
                </th>
                <th className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider border border-black">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className=" border border-black">
              {invoices.map((invoice, index) => {
                const isManual = invoice.source === 'manual'
                const isArrear = invoice.source === 'arrear'
                const isBonusLeave = invoice.source === 'bonus-leave'
                const customerName = isManual
                  ? invoice.formData?.customer || invoice.client
                  : isBonusLeave
                    ? invoice.formData?.client || invoice.formData?.customer
                    : invoice.formData?.customer
                const branchOrNarration = isManual
                  ? invoice.narration
                  : isArrear
                    ? invoice.formData?.branch || 'Arrear Billing'
                    : isBonusLeave
                      ? `Bonus/Leave Encashment - ${invoice.formData?.period || ''}`
                      : invoice.formData?.branch
                const createdBy = isManual
                  ? invoice.metadata?.createdBy || invoice.createdBy
                  : invoice.metadata?.createdBy
                const createdAt = isManual
                  ? invoice.metadata?.createdAt || invoice.createdAt
                  : invoice.metadata?.createdAt
                const status = invoice.metadata?.status || invoice.status || 'draft'
                const sentToClient = isManual
                  ? invoice.metadata?.sentToClient
                  : invoice.metadata?.sentToClient
                const viewCount = isManual
                  ? invoice.metadata?.viewCount !== undefined
                    ? invoice.metadata.viewCount
                    : invoice.viewCount
                  : invoice.metadata?.viewCount

                const irnNumber = invoice.irnDetails?.irnNumber || '—'
                const isDraft = status === 'draft'
                const isConvertingThis = isConverting === invoice.id

                return (
                  <tr
                    key={invoice.id}
                    className={`hover:bg-emerald-50 transition-colors border border-black ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    <td className="px-3 py-4 whitespace-nowrap border border-black">
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 text-emerald-600 mr-2" />
                        <span className="text-sm font-medium text-gray-900">
                          {invoice.invoiceNumber || invoice.formData?.poWoNumber || 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap border border-black">
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-700 border border-blue-300">
                        Sales
                      </span>
                    </td>
                    <td className="px-3 py-4 border border-black">
                      <div className="text-sm text-gray-900 font-medium">
                        {customerName || 'N/A'}
                      </div>
                    </td>
                    <td className="px-3 py-4 max-w-xs border border-black">
                      <div className="text-sm text-gray-700 truncate" title={branchOrNarration}>
                        {branchOrNarration || 'N/A'}
                      </div>
                    </td>
                    <td className="px-3 py-4 border border-black">
                      <div className="text-xs text-gray-700 font-mono truncate" title={irnNumber}>
                        {irnNumber}
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-right border border-black">
                      <div className="text-sm font-semibold text-gray-900">
                        {formatCurrency(invoice.calculations?.grandTotal || 0)}
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap border border-black">
                      <div className="text-sm text-gray-700">{createdBy || 'Unknown'}</div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap border border-black">
                      <div className="text-sm">{formatDate(createdAt)}</div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap border border-black text-center">
                      {getStatusBadge(status)}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap border border-black text-center">
                      {sentToClient ? (
                        <button
                          onClick={() => handleResendClick(invoice)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 text-xs font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                          title="Resend email"
                        >
                          <Send className="w-3 h-3" />
                          Resend
                        </button>
                      ) : (
                        <button
                          onClick={() => handleResendClick(invoice)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 text-xs font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                          title="Send email"
                        >
                          <Mail className="w-3 h-3" />
                          Send
                        </button>
                      )}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap border border-black text-center">
                      <span className="text-sm font-medium text-gray-700">{viewCount || 0}</span>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap border border-black">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => onView(invoice)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors group relative"
                          title="View Invoice"
                        >
                          <Eye className="w-4 h-4" />
                          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            View
                          </span>
                        </button>
                        <button
                          onClick={() => onDownload(invoice)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors group relative"
                          title="Download PDF"
                        >
                          <Download className="w-4 h-4" />
                          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            Download
                          </span>
                        </button>
                        {isDraft && (
                          <button
                            onClick={() => onConvertToFinal(invoice)}
                            disabled={isConvertingThis}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                              isConvertingThis
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                            }`}
                            title="Convert to Final with IRN"
                          >
                            {isConvertingThis ? (
                              <div className="flex items-center gap-1">
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-emerald-700"></div>
                                <span>Converting...</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1">
                                <Check className="w-3 h-3" />
                                <span>Convert to Final</span>
                              </div>
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards - Responsive */}
        <div className="lg:hidden space-y-4 p-4">
          {invoices.map((invoice) => {
            const status = invoice.metadata?.status || invoice.status || 'draft'
            const isDraft = status === 'draft'
            const isConvertingThis = isConverting === invoice.id
            const irnNumber = invoice.irnDetails?.irnNumber || '—'

            return (
              <div
                key={invoice.id}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm font-bold text-gray-900">
                        {invoice.invoiceNumber || invoice.formData?.poWoNumber || 'N/A'}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">
                      {invoice.formData?.customer || 'N/A'}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {getStatusBadge(status)}
                    <span className="text-xs font-semibold text-emerald-700">
                      {formatCurrency(invoice.calculations?.grandTotal || 0)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                  <div>
                    <span className="text-gray-500">IRN:</span>
                    <div className="font-mono text-gray-700 truncate" title={irnNumber}>
                      {irnNumber}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Created:</span>
                    <div className="text-gray-700">
                      {new Date(invoice.metadata?.createdAt).toLocaleDateString('en-IN')}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => onView(invoice)}
                    className="flex-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded text-xs font-medium flex items-center justify-center gap-1"
                  >
                    <Eye className="w-3 h-3" />
                    View
                  </button>
                  <button
                    onClick={() => onDownload(invoice)}
                    className="flex-1 px-3 py-1.5 bg-green-50 text-green-700 rounded text-xs font-medium flex items-center justify-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    Download
                  </button>
                  {isDraft && (
                    <button
                      onClick={() => onConvertToFinal(invoice)}
                      disabled={isConvertingThis}
                      className={`flex-1 px-3 py-1.5 rounded text-xs font-medium flex items-center justify-center gap-1 ${
                        isConvertingThis
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {isConvertingThis ? (
                        <>
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-emerald-700"></div>
                          Converting
                        </>
                      ) : (
                        <>
                          <Check className="w-3 h-3" />
                          Convert
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Email Modal */}
      {isEmailModalOpen && selectedInvoiceForEmail && (
        <EmailModal
          isOpen={isEmailModalOpen}
          onClose={() => setIsEmailModalOpen(false)}
          onSend={handleEmailSend}
          isSending={isEmailSending}
          emailStatus={emailStatus}
        />
      )}
    </>
  )
}

export default IRNInvoiceTable

/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { Eye, Download, FileText, CheckCircle2, Send, Mail } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import emailjs from '@emailjs/browser'
import EmailModal from '../Pages/AutoBilling/EmailModal'

const InvoiceTable = ({ invoices, onView, onDownload, onConvertToIRN, isLoading, onEmailSent }) => {
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
        bg: 'bg-green-100',
        text: 'text-green-700',
        border: 'border-green-300',
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
      const invoiceType =
        (invoice.formData?.invoiceSeries || invoice.invoiceSeries) === 'proforma'
          ? 'Proforma Invoice'
          : 'Tax Invoice'
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
            No invoices match your current filters. Try adjusting your search criteria or create a
            new invoice.
          </p>
        </div>
      </div>
    )
  }

  return (
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
              const customerName = isManual
                ? invoice.formData?.customer || invoice.client
                : invoice.formData?.customer
              const branchOrNarration = isManual ? invoice.narration : invoice.formData?.branch
              const createdBy = isManual
                ? invoice.metadata?.createdBy || invoice.createdBy
                : invoice.metadata?.createdBy
              const createdAt = isManual
                ? invoice.metadata?.createdAt || invoice.createdAt
                : invoice.metadata?.createdAt
              const status = isManual
                ? invoice.metadata?.status || invoice.status
                : invoice.metadata?.status
              const sentToClient = isManual
                ? invoice.metadata?.sentToClient
                : invoice.metadata?.sentToClient
              const viewCount = isManual
                ? invoice.metadata?.viewCount !== undefined
                  ? invoice.metadata.viewCount
                  : invoice.viewCount
                : invoice.metadata?.viewCount

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
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                        isManual
                          ? 'bg-purple-100 text-purple-700 border border-purple-300'
                          : 'bg-blue-100 text-blue-700 border border-blue-300'
                      }`}
                    >
                      {isManual ? 'Manual' : 'Auto'}
                    </span>
                  </td>
                  <td className="px-3 py-4 border border-black">
                    <div className="text-sm text-gray-900 font-medium">{customerName || 'N/A'}</div>
                  </td>
                  <td className="px-3 py-4 max-w-xs border border-black">
                    <div className="text-sm text-gray-700 truncate" title={branchOrNarration}>
                      {branchOrNarration || 'N/A'}
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
                      <button
                        onClick={() => onConvertToIRN(invoice)}
                        disabled={status === 'converted'}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                          status === 'converted'
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                        }`}
                        title={status === 'converted' ? 'Already converted' : 'Convert to IRN'}
                      >
                        {status === 'converted' ? 'Converted' : 'Convert to IRN'}
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden divide-y divide-gray-200">
        {invoices.map((invoice) => {
          const isManual = invoice.source === 'manual'
          const customerName = isManual
            ? invoice.formData?.customer || invoice.client
            : invoice.formData?.customer
          const branchOrNarration = isManual ? invoice.narration : invoice.formData?.branch
          const createdBy = isManual
            ? invoice.metadata?.createdBy || invoice.createdBy
            : invoice.metadata?.createdBy
          const createdAt = isManual
            ? invoice.metadata?.createdAt || invoice.createdAt
            : invoice.metadata?.createdAt
          const status = isManual
            ? invoice.metadata?.status || invoice.status
            : invoice.metadata?.status
          const sentToClient = isManual
            ? invoice.metadata?.sentToClient
            : invoice.metadata?.sentToClient
          const viewCount = isManual
            ? invoice.metadata?.viewCount !== undefined
              ? invoice.metadata.viewCount
              : invoice.viewCount
            : invoice.metadata?.viewCount

          return (
            <div key={invoice.id} className="p-3 sm:p-4 hover:bg-emerald-50 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <div className="min-w-0 flex-1 mr-2">
                  <div className="flex items-center mb-1 gap-2">
                    <FileText className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span className="text-sm font-semibold text-gray-900 truncate">
                      {invoice.invoiceNumber || invoice.formData?.poWoNumber || 'N/A'}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${
                        isManual
                          ? 'bg-purple-100 text-purple-700 border border-purple-300'
                          : 'bg-blue-100 text-blue-700 border border-blue-300'
                      }`}
                    >
                      {isManual ? 'Manual' : 'Auto'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 truncate">{customerName || 'N/A'}</p>
                  {isManual && branchOrNarration && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{branchOrNarration}</p>
                  )}
                </div>
                {getStatusBadge(status)}
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(invoice.calculations?.grandTotal || 0)}
                  </span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Created:</span>
                  <span className="text-gray-700">{formatDate(createdAt)}</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Views:</span>
                  <span className="text-gray-700">{viewCount || 0}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t border-gray-200">
                <button
                  onClick={() => onView(invoice)}
                  className="flex-1 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  View
                </button>
                <button
                  onClick={() => onDownload(invoice)}
                  className="flex-1 px-3 py-2 bg-green-50 text-green-700 rounded-lg text-xs sm:text-sm font-medium hover:bg-green-100 transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button
                  onClick={() => handleResendClick(invoice)}
                  className={`flex-1 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                    sentToClient
                      ? 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                      : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                  }`}
                >
                  {sentToClient ? (
                    <>
                      <Send className="w-4 h-4" />
                      Resend
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      Send
                    </>
                  )}
                </button>
                <button
                  onClick={() => onConvertToIRN(invoice)}
                  disabled={status === 'converted'}
                  className={`flex-1 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                    status === 'converted'
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  }`}
                >
                  {status === 'converted' ? 'Converted' : 'Convert'}
                </button>
              </div>
            </div>
          )
        })}
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
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
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

export default InvoiceTable

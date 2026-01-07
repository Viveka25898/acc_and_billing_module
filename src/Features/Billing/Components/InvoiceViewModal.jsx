import React from 'react'
import { X, Download, Calendar, User, Building2, MapPin } from 'lucide-react'
import Step5InvoicePreview from '../Pages/AutoBilling/Step5InvoicePreview'
import ManualInvoicePreview from './ManualBilling/ManualInvoicePreview'

const InvoiceViewModal = ({ invoice, isOpen, onClose, onDownload }) => {
  if (!isOpen || !invoice) return null

  // Check if this is a manual invoice
  const isManual = invoice.source === 'manual'

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    } catch {
      return 'Invalid date'
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-2 sm:p-4">
        <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-full lg:max-w-6xl max-h-[90vh] overflow-hidden">
          {/* Modal Header */}
          <div className="sticky top-0 z-10 bg-gradient-to-r from-emerald-600 to-emerald-700 px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1 mr-2">
              <h2 className="text-base sm:text-xl font-bold text-white">Invoice Preview</h2>
              <span className="px-2 sm:px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs sm:text-sm text-white font-medium truncate">
                {invoice.invoiceNumber || invoice.formData?.poWoNumber || 'N/A'}
              </span>
              {isManual && (
                <span className="px-2 sm:px-3 py-1 bg-purple-500/90 backdrop-blur-sm rounded-full text-xs sm:text-sm text-white font-medium">
                  Manual
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <button
                onClick={onDownload}
                className="px-3 sm:px-4 py-2 bg-white text-emerald-700 rounded-lg hover:bg-emerald-50 font-medium text-xs sm:text-sm flex items-center gap-1 sm:gap-2 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Download PDF</span>
                <span className="sm:hidden">PDF</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Invoice Metadata */}
          <div className="bg-gray-50 px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-500">Created By</p>
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {invoice.metadata?.createdBy || invoice.createdBy || 'Unknown'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-500">Created Date</p>
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {formatDate(invoice.metadata?.createdAt || invoice.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-500">Customer</p>
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {invoice.formData?.customer || invoice.client || 'N/A'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-500">Total Amount</p>
                  <p className="text-sm font-bold text-emerald-700 truncate">
                    {formatCurrency(invoice.calculations?.grandTotal || 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Body - Invoice Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-3 sm:p-6">
            {isManual ? (
              <ManualInvoicePreview
                formData={{
                  client: invoice.formData?.customer || invoice.client,
                  invoiceType: invoice.serviceCategory || 'one-time-service',
                  invoiceSeries: invoice.invoiceType || 'proforma',
                  poWoNumber: invoice.invoiceNumber || invoice.formData?.poWoNumber,
                  invoiceDate: invoice.formData?.invoiceDate || invoice.invoiceDate,
                  dueDate: invoice.formData?.dueDate || invoice.dueDate,
                  notes: invoice.notes,
                  gstRate: invoice.gstRate,
                  discount: invoice.discount,
                  otherCharges: invoice.otherCharges,
                }}
                lineItems={invoice.lineItems || []}
                calculations={invoice.calculations || {}}
                onBack={null}
                isPreviewMode={true}
              />
            ) : (
              <Step5InvoicePreview
                formData={invoice.formData}
                billingLines={invoice.billingLines}
                calculations={invoice.calculations}
                onPrevious={() => {}}
                onConvertToFinal={() => {}}
                isPreviewMode={true}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default InvoiceViewModal

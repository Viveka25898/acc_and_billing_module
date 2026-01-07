import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react'
import ManualBillingForm from '../../Components/ManualBilling/ManualBillingForm'
import ManualInvoicePreview from '../../Components/ManualBilling/ManualInvoicePreview'

const ManualBilling = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [notification, setNotification] = useState(null)
  const [showPreview, setShowPreview] = useState(false)
  const [invoiceData, setInvoiceData] = useState(null)

  // Handle form submission
  const handleSubmit = async (data) => {
    try {
      setIsLoading(true)
      setNotification(null)

      // Simulate validation delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      console.log('Invoice Data:', data)

      // Store invoice data and show preview
      setInvoiceData(data)
      setShowPreview(true)
    } catch (error) {
      console.error('Error generating invoice:', error)
      setNotification({
        type: 'error',
        title: 'Error Generating Invoice',
        message: error.message || 'An unexpected error occurred. Please try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle back from preview
  const handleBackToForm = () => {
    setShowPreview(false)
    // Optionally keep the invoiceData to pre-fill the form
  }

  // Handle cancel
  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All unsaved data will be lost.')) {
      navigate('/dashboard/billing-manager/billing-dashboard')
    }
  }

  // If showing preview, render the invoice preview
  if (showPreview && invoiceData) {
    return (
      <ManualInvoicePreview
        formData={invoiceData}
        lineItems={invoiceData.lineItems}
        calculations={invoiceData.calculations}
        onBack={handleBackToForm}
      />
    )
  }

  // Otherwise, show the form
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-4 sm:py-6 lg:py-8">
      <div className="max-w-full mx-auto px-2 sm:px-4 lg:px-6">
        {/* Back Button */}
        <button
          onClick={() => navigate('/dashboard/billing-manager/billing-dashboard')}
          className="mb-4 sm:mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm sm:text-base font-medium">Back to Dashboard</span>
        </button>

        {/* Success/Error Notification */}
        {notification && (
          <div
            className={`mb-4 sm:mb-6 rounded-lg shadow-lg p-4 sm:p-6 border-l-4 transition-all ${
              notification.type === 'success'
                ? 'bg-green-50 border-green-500'
                : 'bg-red-50 border-red-500'
            }`}
          >
            <div className="flex items-start gap-3">
              {notification.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1 min-w-0">
                <h3
                  className={`text-sm sm:text-base font-semibold mb-1 ${
                    notification.type === 'success' ? 'text-green-900' : 'text-red-900'
                  }`}
                >
                  {notification.title}
                </h3>
                <p
                  className={`text-xs sm:text-sm ${
                    notification.type === 'success' ? 'text-green-700' : 'text-red-700'
                  }`}
                >
                  {notification.message}
                </p>
              </div>
              <button
                onClick={() => setNotification(null)}
                className={`text-sm font-medium ${
                  notification.type === 'success'
                    ? 'text-green-600 hover:text-green-800'
                    : 'text-red-600 hover:text-red-800'
                }`}
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Manual Billing Form */}
        <div className="bg-white rounded-xl shadow-lg">
          <ManualBillingForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isLoading}
          />
        </div>

        {/* Help Text */}
        <div className="mt-4 sm:mt-6 bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
          <div className="flex items-start gap-2 sm:gap-3">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-blue-900 mb-1">
                Manual Billing Guidelines
              </h4>
              <ul className="text-xs sm:text-sm text-blue-700 space-y-1">
                <li>
                  • Use this form for one-time services, exceptional billing scenarios, or PO-based
                  billing
                </li>
                <li>• Select invoice series: Proforma (preliminary) or Sales/Tax (final)</li>
                <li>• All fields marked with * are mandatory</li>
                <li>• Add multiple line items for different services in the same invoice</li>
                <li>• Total amount is calculated automatically in real-time</li>
                <li>• Click "Generate Invoice" to preview before saving</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManualBilling

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, RefreshCw, AlertCircle } from 'lucide-react'
import InvoiceFilters from '../Components/InvoiceFilters'
import IRNInvoiceTable from '../Components/IRNInvoiceTable'
import InvoiceViewModal from '../Components/InvoiceViewModal'
import {
  getInvoices,
  filterInvoices,
  getInvoiceStats,
  incrementViewCount,
  incrementDownloadCount,
  markInvoiceAsSent,
  updateInvoice,
} from '../utils/invoiceStorage'

const IRNInvoices = () => {
  const navigate = useNavigate()
  const [invoices, setInvoices] = useState([])
  const [filteredInvoices, setFilteredInvoices] = useState([])
  const [stats, setStats] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isConverting, setIsConverting] = useState(null) // Track which invoice is being converted
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)

  // Load invoices on mount
  useEffect(() => {
    loadInvoices()
  }, [])

  const loadInvoices = async () => {
    try {
      setIsLoading(true)
      setError(null)

      console.log('Loading IRN invoices...')

      // Simulate API delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 500))

      const allInvoices = getInvoices('tax')
      console.log('Loaded IRN invoices:', allInvoices)

      const invoiceStats = getInvoiceStats('tax')
      console.log('IRN Invoice stats:', invoiceStats)

      setInvoices(allInvoices)
      setFilteredInvoices(allInvoices)
      setStats(invoiceStats)
    } catch (err) {
      console.error('Error loading IRN invoices:', err)
      setError('Failed to load IRN invoices. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFilterChange = (filters) => {
    try {
      const filtered = filterInvoices(filters, 'tax')
      setFilteredInvoices(filtered)
    } catch (err) {
      console.error('Error filtering invoices:', err)
      setError('Failed to filter invoices.')
    }
  }

  const handleViewInvoice = async (invoice) => {
    try {
      setSelectedInvoice(invoice)
      setIsViewModalOpen(true)

      // Increment view count
      await incrementViewCount(invoice.id, 'tax')

      // Reload invoices to update view count
      loadInvoices()
    } catch (err) {
      console.error('Error viewing invoice:', err)
      setError('Failed to open invoice.')
    }
  }

  const handleDownloadInvoice = async (invoice) => {
    try {
      // Increment download count
      await incrementDownloadCount(invoice.id, 'tax')

      // Store the invoice data in sessionStorage for the print page
      sessionStorage.setItem('invoiceToPrint', JSON.stringify(invoice))

      // Open print window
      window.print()

      // Reload invoices to update download count
      loadInvoices()
    } catch (err) {
      console.error('Error downloading invoice:', err)
      setError('Failed to download invoice.')
    }
  }

  const handleConvertToFinal = async (invoice) => {
    try {
      setIsConverting(invoice.id)
      setError(null)
      setSuccess(null)

      console.log('Converting invoice to final:', invoice.id)

      // Simulate IRN generation process with loader
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Generate dummy IRN and Acknowledgement numbers
      const generatedIRN = `IRN${Date.now()}${Math.floor(Math.random() * 1000)}`
      const generatedAck = `ACK${Date.now()}${Math.floor(Math.random() * 1000)}`

      // Update invoice with IRN details and final status
      const result = updateInvoice(
        invoice.id,
        {
          irnDetails: {
            irnNumber: generatedIRN,
            acknowledgementNumber: generatedAck,
          },
          status: 'final',
        },
        'tax'
      )

      if (result.success) {
        setSuccess(
          `Invoice ${invoice.formData?.poWoNumber} converted to final with IRN successfully!`
        )
        // Reload invoices immediately to update status
        await loadInvoices()
        // Clear converting state after reload completes
        setIsConverting(null)
        // Clear success message after 2 seconds
        setTimeout(() => {
          setSuccess(null)
        }, 2000)
      } else {
        throw new Error(result.message)
      }
    } catch (err) {
      console.error('Error converting to final invoice:', err)
      setError('Failed to convert invoice: ' + err.message)
      setIsConverting(null)
    }
  }

  const handleEmailSent = async (invoiceId) => {
    try {
      // Mark invoice as sent
      const result = markInvoiceAsSent(invoiceId, 'tax')

      if (result.success) {
        // Reload invoices to show updated status
        loadInvoices()
      } else {
        console.error('Failed to update invoice status:', result.message)
      }
    } catch (err) {
      console.error('Error marking invoice as sent:', err)
    }
  }

  const handleCreateNew = () => {
    try {
      navigate('/dashboard/billing-manager/auto-billing')
    } catch (err) {
      console.error('Navigation error:', err)
      // Fallback navigation
      window.location.href = '/dashboard/billing-manager/auto-billing'
    }
  }

  const handleRefresh = () => {
    loadInvoices()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-2 sm:p-4 lg:p-6">
      <div className="max-w-[61rem] mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
            <div className="w-full sm:w-auto">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
                IRN Generated Invoices
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Manage and track all your sales/tax invoices with IRN in one place
              </p>
            </div>
            <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <button
                onClick={handleCreateNew}
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-800 font-medium text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                Create New
              </button>
            </div>
          </div>
        </div>

        {/* Success Alert */}
        {success && (
          <div className="mb-4 sm:mb-6 bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 flex items-start gap-2 sm:gap-3">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <h3 className="text-xs sm:text-sm font-semibold text-green-900 mb-1">Success</h3>
              <p className="text-xs sm:text-sm text-green-700 break-words">{success}</p>
            </div>
            <button
              onClick={() => setSuccess(null)}
              className="ml-auto text-green-600 hover:text-green-800 flex-shrink-0"
            >
              <span className="sr-only">Dismiss</span>×
            </button>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-4 sm:mb-6 bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 flex items-start gap-2 sm:gap-3">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <h3 className="text-xs sm:text-sm font-semibold text-red-900 mb-1">Error</h3>
              <p className="text-xs sm:text-sm text-red-700 break-words">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-600 hover:text-red-800 flex-shrink-0"
            >
              <span className="sr-only">Dismiss</span>×
            </button>
          </div>
        )}

        {/* Filters */}
        <InvoiceFilters onFilterChange={handleFilterChange} stats={stats} />

        {/* Invoice Table */}
        <IRNInvoiceTable
          invoices={filteredInvoices}
          onView={handleViewInvoice}
          onDownload={handleDownloadInvoice}
          onConvertToFinal={handleConvertToFinal}
          onEmailSent={handleEmailSent}
          isLoading={isLoading}
          isConverting={isConverting}
        />

        {/* Results Count */}
        {!isLoading && filteredInvoices.length > 0 && (
          <div className="mt-3 sm:mt-4 text-center">
            <p className="text-xs sm:text-sm text-gray-600">
              Showing <span className="font-semibold">{filteredInvoices.length}</span> of{' '}
              <span className="font-semibold">{invoices.length}</span> invoice
              {invoices.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>

      {/* View Invoice Modal */}
      {isViewModalOpen && selectedInvoice && (
        <InvoiceViewModal
          invoice={selectedInvoice}
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false)
            setSelectedInvoice(null)
          }}
          onDownload={() => handleDownloadInvoice(selectedInvoice)}
        />
      )}
    </div>
  )
}

export default IRNInvoices

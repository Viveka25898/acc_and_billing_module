import React, { useState, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import {
  CheckCircle2,
  RotateCw,
  Inbox,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FileText,
  AlertCircle
} from 'lucide-react'
import AEInvoiceFilter from './Components/AEInvoiceFilter'
import InvoiceVerifyModal from './InvoiceVerifyModal'
import {
  fetchAEPendingInvoices,
  approveAEInvoice,
  rejectAEInvoice
} from '../../store/slices/aeInvoiceSlice'

const InvoiceReviewPage = () => {
  const dispatch = useDispatch()
  const { invoices, pagination, loading, errors } = useSelector((state) => state.aeInvoice)

  const [filters, setFilters] = useState({
    invoiceNumber: '',
    vendorName: '',
    date: '',
  })
  const hasActiveFilters = Boolean(filters.invoiceNumber || filters.vendorName || filters.date)
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Fetch pending queue on mount and whenever currentPage changes
  useEffect(() => {
    dispatch(fetchAEPendingInvoices({ page: currentPage, limit: itemsPerPage }))
  }, [dispatch, currentPage])

  // Helper to format ISO submission date (e.g. "2026-10-29T15:04:16.980784Z")
  const formatSubmittedDate = (dateStr) => {
    if (!dateStr) return { date: '-', time: '' }
    try {
      const d = new Date(dateStr)
      if (isNaN(d.getTime())) return { date: String(dateStr), time: '' }
      return {
        date: d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        time: d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
      }
    } catch {
      return { date: String(dateStr), time: '' }
    }
  }

  // Filtered invoices matching invoiceNumber, vendorName, or submission date (100% frontend)
  const filteredInvoices = useMemo(() => {
    if (!Array.isArray(invoices)) return []
    return invoices.filter((inv) => {
      // 1. Invoice Number or ID filter (e.g. "INV-MAT-2024-124", "124", "INV")
      if (filters.invoiceNumber && filters.invoiceNumber.trim()) {
        const query = filters.invoiceNumber.trim().toLowerCase()
        const invNum = String(inv.invoiceNumber || '').toLowerCase()
        const invId = String(inv.id || '').toLowerCase()
        if (!invNum.includes(query) && !invId.includes(query)) {
          return false
        }
      }

      // 2. Vendor Name filter (supports vendorName, vendorGLMappings, payableGLCode)
      if (filters.vendorName && filters.vendorName.trim()) {
        const query = filters.vendorName.trim().toLowerCase()
        const vName = String(
          inv.vendorName ||
          inv.vendor_name ||
          inv.vendor ||
          inv.vendorGLMappings?.payableGLCode ||
          inv.vendorGLMappings?.vendorName ||
          inv.vendor_gl_mappings?.vendor_name ||
          ''
        ).toLowerCase()
        if (!vName.includes(query)) {
          return false
        }
      }

      // 3. Submission Date filter (matches YYYY-MM-DD)
      if (filters.date) {
        const targetDate = filters.date.trim()
        const rawDate =
          inv.submittedAt ||
          inv.submitted_at ||
          inv.createdAt ||
          inv.created_at ||
          inv.date ||
          ''
        let invDateStr = ''
        if (typeof rawDate === 'string' && rawDate.length >= 10) {
          invDateStr = rawDate.slice(0, 10)
        } else {
          try {
            invDateStr = new Date(rawDate).toISOString().slice(0, 10)
          } catch {
            invDateStr = ''
          }
        }
        if (invDateStr !== targetDate) {
          return false
        }
      }

      return true
    })
  }, [invoices, filters])

  // Total pages and records calculation:
  // When filters are active, use filtered records count
  // When no filters are active, use backend pagination (e.g. 49 total records, 10 total pages)
  const effectiveTotalPages = hasActiveFilters
    ? Math.max(1, Math.ceil(filteredInvoices.length / itemsPerPage))
    : (pagination.totalPages || Math.max(1, Math.ceil((pagination.totalRecords || invoices.length) / itemsPerPage)))

  const effectiveTotalRecords = hasActiveFilters
    ? filteredInvoices.length
    : (pagination.totalRecords || pagination.totalItems || invoices.length)

  // Invoices to display:
  // When filtering client-side and list is longer than itemsPerPage: slice
  // Otherwise display filteredInvoices directly
  const displayInvoices = useMemo(() => {
    if (hasActiveFilters && filteredInvoices.length > itemsPerPage) {
      const startIndex = (currentPage - 1) * itemsPerPage
      return filteredInvoices.slice(startIndex, startIndex + itemsPerPage)
    }
    return filteredInvoices
  }, [filteredInvoices, hasActiveFilters, currentPage, itemsPerPage])

  const handlePageChange = (page) => {
    if (page < 1 || page > effectiveTotalPages || page === currentPage) return
    setCurrentPage(page)
  }

  const openModal = (invoice) => {
    setSelectedInvoice(invoice)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setSelectedInvoice(null)
    setIsModalOpen(false)
  }

  // Handle AE Decision (Approve or Reject) triggering Redux Thunks
  const handleUpdateInvoice = async (id, status, decisionData) => {
    try {
      if (status === 'Approved') {
        const payload = {
          gstRate: parseFloat(decisionData.gstRate),
          hsnCode: decisionData.hsnCode,
          hsnSummary: decisionData.hsnSummary,
          site_state: decisionData.siteState,
          company_state: decisionData.companyState,
          remarks: decisionData.remarks
        }
        await dispatch(approveAEInvoice({ invoiceId: id, payload })).unwrap()
        toast.success(`Invoice Approved and forwarded to Account Manager!`)
      } else {
        const payload = {
          gst_rate: parseFloat(decisionData.gstRate || 0),
          remarks: decisionData.remarks
        }
        await dispatch(rejectAEInvoice({ invoiceId: id, payload })).unwrap()
        toast.error(`Invoice Rejected and returned to vendor.`)
      }
      closeModal()
      
      // Edge Case: If we just approved/rejected the last item on page > 1, go back one page.
      const targetPage = (invoices.length === 1 && currentPage > 1) ? currentPage - 1 : currentPage
      setCurrentPage(targetPage)

      // Refresh active page queue
      dispatch(fetchAEPendingInvoices({ page: targetPage, limit: itemsPerPage }))
    } catch (error) {
      toast.error(`Decision Submission Failed: ${error}`)
    }
  }

  const handleFilter = (newFilters) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }

  const handleRefresh = () => {
    dispatch(fetchAEPendingInvoices({ page: currentPage, limit: itemsPerPage }))
    toast.info('Refreshing invoices list...')
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto bg-gray-50/50 min-h-screen">
      {/* Header section styled like Advance Settlement */}
      <div className="bg-gradient-to-r from-green-700 via-green-600 to-emerald-600 rounded-2xl p-6 mb-6 shadow-lg shadow-green-900/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-white">
        <div className="flex items-center gap-3.5">
          <div className="bg-white/15 backdrop-blur-md p-3 rounded-2xl shadow-inner text-white">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Invoice Processing – Account Executive Review
            </h1>
            <p className="text-green-100 text-sm mt-0.5">
              Review and verify / reject invoices for your queue
            </p>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading.fetch}
          className="bg-white hover:bg-green-50 text-green-700 font-semibold px-4 py-2.5 rounded-xl text-sm transition-all duration-200 shadow-sm border border-green-200 flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-60"
          title="Refresh invoices list"
        >
          <RotateCw className={`w-4 h-4 ${loading.fetch ? 'animate-spin text-green-600' : ''}`} />
          <span>Refresh Queue</span>
        </button>
      </div>

      <AEInvoiceFilter filters={filters} setFilters={handleFilter} />

      {errors.fetch && (
        <div className="bg-red-50 text-red-600 border border-red-200 p-4 rounded-xl mb-4 text-sm font-medium flex items-center gap-2.5 shadow-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500" />
          <span>Error loading invoices: {errors.fetch}</span>
        </div>
      )}

      {/* Loading state spinner */}
      {loading.fetch && (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm my-4">
          <div className="animate-spin rounded-full h-10 w-10 border-3 border-gray-200 border-b-green-600 mb-3" />
          <p className="text-sm font-medium text-gray-500">Loading invoices queue...</p>
        </div>
      )}

      {/* Empty State matching Advance Settlement */}
      {!loading.fetch && displayInvoices.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 px-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-50 text-green-600 mb-4">
            <Inbox className="w-8 h-8 stroke-[1.5]" />
          </div>
          <p className="text-gray-700 font-semibold text-lg">No material invoices found</p>
          <p className="text-sm text-gray-400 mt-1 max-w-md mx-auto">
            {hasActiveFilters
              ? 'No invoices match your current search criteria. Try modifying or clearing your filters.'
              : 'Material invoices pending your review will appear here once submitted.'}
          </p>
          {hasActiveFilters && (
            <button
              onClick={() => handleFilter({ invoiceNumber: '', vendorName: '', date: '' })}
              className="mt-4 px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-xl text-xs font-semibold transition-colors"
            >
              Clear Search Filters
            </button>
          )}
        </div>
      )}

      {/* Table block */}
      {!loading.fetch && displayInvoices.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mt-4">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-green-600 text-white text-left text-xs uppercase tracking-wider">
                  <th className="px-4 py-3.5 font-semibold whitespace-nowrap">Sr No</th>
                  <th className="px-4 py-3.5 font-semibold whitespace-nowrap">Invoice Number</th>
                  <th className="px-4 py-3.5 font-semibold whitespace-nowrap">Vendor Name</th>
                  <th className="px-4 py-3.5 font-semibold whitespace-nowrap text-right">Amount (₹)</th>
                  <th className="px-4 py-3.5 font-semibold whitespace-nowrap">PO References</th>
                  <th className="px-4 py-3.5 font-semibold whitespace-nowrap">Submission Date</th>
                  <th className="px-4 py-3.5 font-semibold whitespace-nowrap">Invoice Type</th>
                  <th className="px-4 py-3.5 font-semibold whitespace-nowrap">Status</th>
                  <th className="px-4 py-3.5 font-semibold text-center whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {displayInvoices.map((inv, index) => (
                  <tr key={inv.id} className="hover:bg-green-50/40 transition-colors duration-150">
                    <td className="px-4 py-3.5 font-medium text-gray-500 whitespace-nowrap">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-4 py-3.5 font-medium text-gray-800 whitespace-nowrap">
                      <div className="font-semibold text-gray-900">{inv.invoiceNumber || inv.id}</div>
                      <div className="text-xs text-gray-400 font-normal">{inv.id}</div>
                    </td>
                    <td className="px-4 py-3.5 text-gray-700 font-medium">
                      {inv.vendorName || '-'}
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-gray-900 whitespace-nowrap text-right">
                      ₹{parseFloat(inv.totalAmount || 0).toLocaleString('en-IN', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </td>
                    <td className="px-4 py-3.5 text-xs">
                      {inv.poDocuments && inv.poDocuments.length > 0 ? (
                        <div className="space-y-1">
                          {inv.poDocuments.map((doc, docIndex) => (
                            <div key={docIndex} className="truncate max-w-[200px]">
                              <a
                                href={doc.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-green-700 hover:text-green-800 underline font-medium"
                                title={doc.po_number || doc.name}
                              >
                                <span>{doc.po_number || doc.name || `PO-${docIndex + 1}`}</span>
                                <ExternalLink className="w-3 h-3 flex-shrink-0" />
                              </a>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">No PO References</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      {(() => {
                        const { date, time } = formatSubmittedDate(inv.submittedAt || inv.submitted_at || inv.createdAt)
                        return (
                          <div>
                            <div className="font-semibold text-gray-800 text-xs">{date}</div>
                            {time && <div className="text-[11px] text-gray-400 font-normal">{time}</div>}
                          </div>
                        )
                      })()}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap text-gray-600">
                      <span className="bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-full font-medium">
                        {inv.type ? (inv.type.charAt(0).toUpperCase() + inv.type.slice(1).toLowerCase()) : 'Material'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 border ${
                          inv.status === 'Pending GST Verification'
                            ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                            : inv.status === 'Approved' || inv.status?.includes('Approved')
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : inv.status === 'Rejected' || inv.status?.includes('Rejected')
                                ? 'bg-red-50 text-red-700 border-red-200'
                                : 'bg-gray-50 text-gray-700 border-gray-200'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          inv.status === 'Pending GST Verification'
                            ? 'bg-yellow-500'
                            : inv.status === 'Approved' || inv.status?.includes('Approved')
                              ? 'bg-green-500'
                              : 'bg-red-500'
                        }`} />
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center whitespace-nowrap">
                      <button
                        onClick={() => openModal(inv)}
                        className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-xl text-xs md:text-sm shadow-sm transition-all duration-150 active:scale-95 cursor-pointer"
                      >
                        View & Verify
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer with Summary and Pagination */}
          <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
            <div>
              Showing{' '}
              <span className="font-semibold text-gray-700">
                {displayInvoices.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}
              </span>{' '}
              to{' '}
              <span className="font-semibold text-gray-700">
                {Math.min(currentPage * itemsPerPage, effectiveTotalRecords)}
              </span>{' '}
              of{' '}
              <span className="font-semibold text-gray-700">
                {effectiveTotalRecords}
              </span>{' '}
              invoices
              {hasActiveFilters && (
                <span className="ml-1 text-gray-400">
                  (filtered from {pagination.totalRecords || invoices.length} total)
                </span>
              )}
            </div>

            {effectiveTotalPages > 1 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1 font-medium cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Prev</span>
                </button>
                {Array.from({ length: effectiveTotalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`min-w-[32px] h-8 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      page === currentPage
                        ? 'bg-green-600 text-white shadow-sm'
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === effectiveTotalPages}
                  className="px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1 font-medium cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal */}
      {selectedInvoice && (
        <InvoiceVerifyModal
          isOpen={isModalOpen}
          onClose={closeModal}
          invoice={selectedInvoice}
          handleUpdateInvoice={handleUpdateInvoice}
          isSubmitting={loading.approve || loading.reject}
        />
      )}
    </div>
  )
}

export default InvoiceReviewPage

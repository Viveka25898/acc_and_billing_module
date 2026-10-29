import React, { useState, useEffect } from 'react'
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
import AMInvoiceFilter from './AccountManagerInvoiceFilter'
import AMInvoiceVerifyModal from './AccountManagerInvoiceVerifyModal'
import PurchaseVoucherModal from '../Components/PurchaseVoucherModal'
import {
  fetchAMPendingInvoices,
  approveAMInvoice,
  rejectAMInvoice,
  fetchPurchaseVoucherDetails
} from '../../../store/slices/amInvoiceSlice'

const AMInvoiceReviewPage = () => {
  const dispatch = useDispatch()
  
  // Select values from Redux store
  const { invoices, pagination, loading, vouchers, errors } = useSelector((state) => state.amInvoice)

  const [filters, setFilters] = useState({
    invoiceNumber: '',
    vendorName: '',
    date: '',
  })
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPurchaseVoucherModalOpen, setIsPurchaseVoucherModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Fetch pending invoices when page or filters change
  useEffect(() => {
    dispatch(fetchAMPendingInvoices({
      page: currentPage,
      limit: itemsPerPage,
      invoiceNumber: filters.invoiceNumber || undefined,
      vendorName: filters.vendorName || undefined,
      date: filters.date || undefined,
    }))
  }, [dispatch, currentPage, filters])

  // Refresh queue helper
  const handleRefresh = () => {
    dispatch(fetchAMPendingInvoices({
      page: currentPage,
      limit: itemsPerPage,
      invoiceNumber: filters.invoiceNumber || undefined,
      vendorName: filters.vendorName || undefined,
      date: filters.date || undefined,
    }))
    toast.info('Refreshing pending queue...')
  }

  // Open Modal
  const openModal = (invoice) => {
    setSelectedInvoice(invoice)
    setIsModalOpen(true)
  }

  // Close Modal
  const closeModal = () => {
    setSelectedInvoice(null)
    setIsModalOpen(false)
  }

  // Handle final approval / rejection decisions
  const handleUpdateInvoice = async (id, status, remark = '') => {
    if (status === 'Approved') {
      try {
        const approvedInv = invoices.find((inv) => inv.id === id)
        const resultAction = await dispatch(approveAMInvoice({ 
          invoiceId: id, 
          payload: { remarks: remark || 'Payment approved for processing' } 
        }))
        if (approveAMInvoice.fulfilled.match(resultAction)) {
          toast.success('Invoice approved and GL entries posted successfully!')
          
          // Page transition helper
          if (invoices.length === 1 && currentPage > 1) {
            setCurrentPage((prev) => prev - 1)
          } else {
            dispatch(fetchAMPendingInvoices({
              page: currentPage,
              limit: itemsPerPage,
              invoiceNumber: filters.invoiceNumber || undefined,
              vendorName: filters.vendorName || undefined,
              date: filters.date || undefined,
            }))
          }
          closeModal()

          // Automatically fetch and open purchase voucher modal
          if (approvedInv) {
            setSelectedInvoice(approvedInv)
            setIsPurchaseVoucherModalOpen(true)
            dispatch(fetchPurchaseVoucherDetails(id))
          }
        } else {
          toast.error(resultAction.payload || 'Approval request failed')
        }
      } catch (err) {
        toast.error('An error occurred during invoice approval.')
      }
    } else if (status === 'Rejected') {
      try {
        const resultAction = await dispatch(rejectAMInvoice({ 
          invoiceId: id, 
          payload: { remarks: remark } 
        }))
        if (rejectAMInvoice.fulfilled.match(resultAction)) {
          toast.error('Invoice rejected and returned to vendor!')
          
          if (invoices.length === 1 && currentPage > 1) {
            setCurrentPage((prev) => prev - 1)
          } else {
            dispatch(fetchAMPendingInvoices({
              page: currentPage,
              limit: itemsPerPage,
              invoiceNumber: filters.invoiceNumber || undefined,
              vendorName: filters.vendorName || undefined,
              date: filters.date || undefined,
            }))
          }
          closeModal()
        } else {
          toast.error(resultAction.payload || 'Rejection request failed')
        }
      } catch (err) {
        toast.error('An error occurred during invoice rejection.')
      }
    }
  }

  // Load purchase voucher journal entries
  const handleViewJV = async (invoice) => {
    setSelectedInvoice(invoice)
    setIsPurchaseVoucherModalOpen(true)
    try {
      const resultAction = await dispatch(fetchPurchaseVoucherDetails(invoice.id))
      if (!fetchPurchaseVoucherDetails.fulfilled.match(resultAction)) {
        toast.error(resultAction.payload || 'Failed to load purchase voucher')
      }
    } catch (e) {
      toast.error('An error occurred loading journal entries')
    }
  }

  // Filter apply hook
  const handleFilter = (newFilters) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }

  const activeVoucher = selectedInvoice ? vouchers[selectedInvoice.id] : null
  const isVoucherLoading = selectedInvoice ? !!loading.voucher[selectedInvoice.id] : false
  const voucherError = selectedInvoice ? errors?.voucher?.[selectedInvoice.id] : null
  const hasActiveFilters = Boolean(filters.invoiceNumber || filters.vendorName || filters.date)

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto bg-gray-50/50 min-h-screen">
      {/* Header section matching Account Executive & Advance Settlement standard styling */}
      <div className="bg-gradient-to-r from-green-700 via-green-600 to-emerald-600 rounded-2xl p-6 mb-6 shadow-lg shadow-green-900/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-white">
        <div className="flex items-center gap-3.5">
          <div className="bg-white/15 backdrop-blur-md p-3 rounded-2xl shadow-inner text-white">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Invoice Processing – Account Manager Review
            </h1>
            <p className="text-green-100 text-sm mt-0.5">
              Review and approve / reject material invoices for final posting
            </p>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading.fetch}
          className="bg-white hover:bg-green-50 text-green-700 font-semibold px-4 py-2.5 rounded-xl text-sm transition-all duration-200 shadow-sm border border-green-200 flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-60"
          title="Refresh queue"
        >
          <RotateCw className={`w-4 h-4 ${loading.fetch ? 'animate-spin text-green-600' : ''}`} />
          <span>Refresh Queue</span>
        </button>
      </div>

      <AMInvoiceFilter filters={filters} setFilters={handleFilter} />

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

      {/* Empty State */}
      {!loading.fetch && invoices.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 px-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-50 text-green-600 mb-4">
            <Inbox className="w-8 h-8 stroke-[1.5]" />
          </div>
          <p className="text-gray-700 font-semibold text-lg">No material invoices found</p>
          <p className="text-sm text-gray-400 mt-1 max-w-md mx-auto">
            {hasActiveFilters
              ? 'No invoices match your current search criteria. Try modifying or clearing your filters.'
              : 'Material invoices forwarded from Account Executive will appear here for your review.'}
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
      {!loading.fetch && invoices.length > 0 && (
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
                  <th className="px-4 py-3.5 font-semibold whitespace-nowrap">Type</th>
                  <th className="px-4 py-3.5 font-semibold whitespace-nowrap">AE Remarks</th>
                  <th className="px-4 py-3.5 font-semibold whitespace-nowrap">Status</th>
                  <th className="px-4 py-3.5 font-semibold text-center whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {invoices.map((inv, index) => {
                  const isApproved = inv.accountManagerStatus === 'Approved' || inv.finalStatus === 'GL Posted - Completed'
                  const isRejected = inv.accountManagerStatus === 'Rejected' || inv.finalStatus === 'Rejected by Account Manager'
                  
                  return (
                    <tr key={inv.id} className="hover:bg-green-50/40 transition-colors duration-150">
                      <td className="px-4 py-3.5 font-medium text-gray-500 whitespace-nowrap">
                        {(pagination.currentPage - 1) * (pagination.pageSize || pagination.recordsPerPage || 5) + index + 1}
                      </td>
                      <td className="px-4 py-3.5 font-medium text-gray-800 whitespace-nowrap">
                        <div className="font-semibold text-gray-900">{inv.invoiceNumber || inv.id || '-'}</div>
                        <div className="text-xs text-gray-400 font-normal">{inv.id}</div>
                      </td>
                      <td className="px-4 py-3.5 text-gray-700 font-medium">
                        {inv.vendorName || '-'}
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-gray-900 whitespace-nowrap text-right">
                        {inv.totalAmount ? `₹${parseFloat(inv.totalAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '-'}
                      </td>
                      <td className="px-4 py-3.5 text-xs">
                        {inv.poDocuments && inv.poDocuments.length > 0 ? (
                          <div className="space-y-1">
                            {inv.poDocuments.map((doc, idx) => (
                              <div key={idx} className="truncate max-w-[200px]">
                                <a
                                  href={doc.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-green-700 hover:text-green-800 underline font-medium"
                                  title={doc.po_number || doc.name}
                                >
                                  <span>{doc.po_number || doc.name || `PO-${idx + 1}`}</span>
                                  <ExternalLink className="w-3 h-3 flex-shrink-0" />
                                </a>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">No PO</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-gray-600">
                        <span className="bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-full font-medium">
                          {inv.type || 'Material'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-gray-600 max-w-[180px] truncate text-xs" title={inv.aeRemarks || '-'}>
                        {inv.aeRemarks || '-'}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {isApproved ? (
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 bg-green-50 text-green-700 border border-green-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            Approved (Final)
                          </span>
                        ) : isRejected ? (
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 bg-red-50 text-red-700 border border-red-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                            Rejected by AM
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 bg-yellow-50 text-yellow-700 border border-yellow-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                            Pending AM Review
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-center whitespace-nowrap">
                        {isApproved ? (
                          <button
                            onClick={() => handleViewJV(inv)}
                            className="bg-green-600 hover:bg-green-700 text-white font-medium px-3.5 py-1.5 rounded-xl text-xs shadow-sm transition-all duration-150 active:scale-95 cursor-pointer inline-flex items-center gap-1.5"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>View Purchase Voucher</span>
                          </button>
                        ) : isRejected ? (
                          <span className="text-xs text-gray-400 font-medium italic">No action needed</span>
                        ) : (
                          <button
                            onClick={() => openModal(inv)}
                            className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-xl text-xs md:text-sm shadow-sm transition-all duration-150 active:scale-95 cursor-pointer"
                          >
                            Review & Approve
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Table Footer with Summary and Pagination */}
          <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
            <div>
              Showing{' '}
              <span className="font-semibold text-gray-700">
                {(pagination.currentPage - 1) * (pagination.pageSize || pagination.recordsPerPage || 5) + 1}
              </span>{' '}
              to{' '}
              <span className="font-semibold text-gray-700">
                {Math.min(
                  pagination.currentPage * (pagination.pageSize || pagination.recordsPerPage || 5),
                  pagination.totalRecords || pagination.totalItems || invoices.length
                )}
              </span>{' '}
              of{' '}
              <span className="font-semibold text-gray-700">
                {pagination.totalRecords || pagination.totalItems || invoices.length}
              </span>{' '}
              invoices
            </div>

            {pagination.totalPages > 1 && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={pagination.currentPage === 1}
                  className="px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1 font-medium"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Prev</span>
                </button>
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`min-w-[32px] h-8 px-2 rounded-lg text-xs font-semibold transition-all ${
                      page === pagination.currentPage
                        ? 'bg-green-600 text-white shadow-sm'
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pagination.totalPages))}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1 font-medium"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Verification modal */}
      {selectedInvoice && isModalOpen && (
        <AMInvoiceVerifyModal
          isOpen={isModalOpen}
          onClose={closeModal}
          invoice={selectedInvoice}
          handleUpdateInvoice={handleUpdateInvoice}
          isSubmitting={loading.approve || loading.reject}
        />
      )}

      {/* Purchase Voucher Modal */}
      <PurchaseVoucherModal
        isOpen={isPurchaseVoucherModalOpen}
        onClose={() => {
          setIsPurchaseVoucherModalOpen(false)
          setSelectedInvoice(null)
        }}
        voucher={activeVoucher}
        isLoading={isVoucherLoading}
        error={voucherError}
      />
    </div>
  )
}

export default AMInvoiceReviewPage

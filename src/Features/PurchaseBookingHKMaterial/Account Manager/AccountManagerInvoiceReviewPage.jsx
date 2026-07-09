import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import AMInvoiceFilter from './AccountManagerInvoiceFilter'
import AMInvoiceVerifyModal from './AccountManagerInvoiceVerifyModal'
import InvoiceJVDisplay from '../Components/InvoiceJVDisplay'
import {
  fetchAMPendingInvoices,
  approveAMInvoice,
  rejectAMInvoice,
  fetchPurchaseVoucherDetails
} from '../../../store/slices/amInvoiceSlice'

// Mappings from live backend voucher format to local JVDisplay format
const mapVoucherToJVDisplay = (voucher) => {
  if (!voucher) return {}
  return {
    header: {
      company: 'iSmart Facitech',
      voucherNo: voucher.voucherNo || '-',
      financialYear: voucher.financialYear || '-',
      date: voucher.voucherDate || '-',
      reference: voucher.invoiceRef || '-',
      preparedBy: voucher.postedBy || 'Account Manager'
    },
    entries: (voucher.entries || []).map((ent, idx) => ({
      id: ent.lineNo || idx + 1,
      particulars: ent.glName || '-',
      gl: ent.glCode || '-',
      costCenter: '-',
      debit: parseFloat(ent.debit || 0),
      credit: parseFloat(ent.credit || 0),
      note: ent.narration || ''
    })),
    narration: voucher.narration || '-',
    totals: {
      debit: parseFloat(voucher.totals?.totalDebit || 0),
      credit: parseFloat(voucher.totals?.totalCredit || 0)
    }
  }
}

const AMInvoiceReviewPage = () => {
  const dispatch = useDispatch()
  
  // Select values from Redux store
  const { invoices, pagination, loading, vouchers } = useSelector(state => state.amInvoice)

  const [filters, setFilters] = useState({
    invoiceNumber: '',
    vendorName: '',
    date: '',
  })
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isJVModalOpen, setIsJVModalOpen] = useState(false)
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
        const resultAction = await dispatch(approveAMInvoice({ 
          invoiceId: id, 
          payload: { remarks: remark || 'Payment approved for processing' } 
        }))
        if (approveAMInvoice.fulfilled.match(resultAction)) {
          toast.success('Invoice approved and GL entries posted successfully!')
          
          // Page transition helper
          if (invoices.length === 1 && currentPage > 1) {
            setCurrentPage(prev => prev - 1)
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
            setCurrentPage(prev => prev - 1)
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
    try {
      const resultAction = await dispatch(fetchPurchaseVoucherDetails(invoice.id))
      if (fetchPurchaseVoucherDetails.fulfilled.match(resultAction)) {
        setIsJVModalOpen(true)
      } else {
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
  const isVoucherLoading = selectedInvoice ? loading.voucher[selectedInvoice.id] : false

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto bg-white shadow-sm rounded-2xl border border-gray-100">
      
      {/* Header section matching Account Executive & Advance Settlement standard styling */}
      <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-2xl px-6 py-5 mb-6 shadow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <span>✅</span> HK Material Invoice Processing – Account Manager Review
          </h1>
          <p className="text-green-100 text-sm mt-0.5">
            Review and approve / reject material invoices for final posting
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="bg-white hover:bg-green-50 text-green-700 font-semibold px-4 py-2 rounded-xl text-sm transition-colors duration-200 shadow-sm border border-green-200"
          title="Refresh queue"
        >
          Refresh Queue
        </button>
      </div>

      <AMInvoiceFilter filters={filters} setFilters={handleFilter} />

      {/* Loader indicator for entire queue fetch */}
      {loading.fetch ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
          <p className="text-gray-500 text-sm mt-4 font-medium">Fetching invoices queue...</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-100 mt-4 shadow-sm">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-700 uppercase font-semibold text-xs border-b border-gray-100">
              <tr>
                <th className="p-4">Sr No</th>
                <th className="p-4">Invoice ID</th>
                <th className="p-4">Invoice #</th>
                <th className="p-4">Vendor Name</th>
                <th className="p-4 text-right">Amount (₹)</th>
                <th className="p-4">PO Code</th>
                <th className="p-4">Type</th>
                <th className="p-4">AE Remarks</th>
                <th className="p-4">AM Status</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan="10" className="p-8 text-center text-gray-400 font-medium">
                    No pending invoices found.
                  </td>
                </tr>
              ) : (
                invoices.map((inv, index) => (
                  <tr key={inv.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="p-4 font-medium text-gray-500">
                      {(pagination.currentPage - 1) * pagination.pageSize + index + 1}
                    </td>
                    <td className="p-4 font-semibold text-gray-800">{inv.id || '-'}</td>
                    <td className="p-4 text-gray-600">{inv.invoiceNumber || '-'}</td>
                    <td className="p-4 text-gray-600 font-medium">{inv.vendorName || '-'}</td>
                    <td className="p-4 text-right font-semibold text-gray-900">
                      {inv.totalAmount ? `₹${parseFloat(inv.totalAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '-'}
                    </td>
                    <td className="p-4">
                      {inv.poDocuments && inv.poDocuments.length > 0 ? (
                        inv.poDocuments.map((doc, idx) => (
                          <div key={idx} className="text-xs text-green-700 hover:underline">
                            <a href={doc.url} target="_blank" rel="noopener noreferrer">
                              {doc.po_number || doc.name || `PO-${idx + 1}`}
                            </a>
                          </div>
                        ))
                      ) : (
                        <span className="text-gray-400 italic text-xs">No PO</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="bg-green-50 text-green-800 text-xs px-2.5 py-1 rounded-full font-semibold">
                        {inv.type || '-'}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500 max-w-xs truncate" title={inv.aeRemarks || ''}>
                      {inv.aeRemarks || '-'}
                    </td>
                    <td className="p-4">
                      {inv.accountManagerStatus === 'Approved' || inv.finalStatus === 'GL Posted - Completed' ? (
                        <div className="flex flex-col gap-1.5 items-start">
                          <span className="bg-green-100 text-green-800 px-2.5 py-1 rounded-full text-xs font-semibold">
                            ✅ Approved (Final)
                          </span>
                          <button
                            className="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-3 py-1.5 rounded-xl shadow-sm transition-colors duration-150"
                            onClick={() => handleViewJV(inv)}
                          >
                            View Purchase Voucher
                          </button>
                        </div>
                      ) : inv.accountManagerStatus === 'Rejected' ? (
                        <span className="bg-red-100 text-red-800 px-2.5 py-1 rounded-full text-xs font-semibold">
                          ❌ Rejected by AM
                        </span>
                      ) : (
                        <span className="bg-yellow-100 text-yellow-800 px-2.5 py-1 rounded-full text-xs font-semibold">
                          ⏳ Pending AM Review
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => openModal(inv)}
                        className={`px-4 py-2 rounded-xl text-white text-xs font-semibold transition-all duration-150 ${
                          inv.accountManagerStatus === 'Approved' ||
                          inv.accountManagerStatus === 'Rejected'
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-green-600 hover:bg-green-700 shadow-sm'
                        }`}
                        disabled={
                          inv.accountManagerStatus === 'Approved' ||
                          inv.accountManagerStatus === 'Rejected'
                        }
                      >
                        Review & Approve
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={pagination.currentPage === 1}
            className="px-3.5 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            Prev
          </button>
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-all ${
                page === pagination.currentPage 
                  ? 'bg-green-600 text-white shadow-sm' 
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
            disabled={pagination.currentPage === pagination.totalPages}
            className="px-3.5 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            Next
          </button>
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

      {/* Journal entries double entry display */}
      {isJVModalOpen && selectedInvoice && (
        <div className="relative">
          {isVoucherLoading ? (
            <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-2xl flex items-center shadow-lg">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-700 mr-3"></div>
                <span className="text-gray-700 text-sm font-medium">Fetching journal entries...</span>
              </div>
            </div>
          ) : (
            <InvoiceJVDisplay
              data={mapVoucherToJVDisplay(activeVoucher)}
              onClose={() => {
                setIsJVModalOpen(false)
                setSelectedInvoice(null)
              }}
            />
          )}
        </div>
      )}
    </div>
  )
}

export default AMInvoiceReviewPage

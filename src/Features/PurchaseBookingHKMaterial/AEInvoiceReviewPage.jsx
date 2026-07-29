import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AEInvoiceFilter from './Components/AEInvoiceFilter'
import InvoiceVerifyModal from './InvoiceVerifyModal'
import {
  fetchAEPendingInvoices,
  approveAEInvoice,
  rejectAEInvoice
} from '../../store/slices/aeInvoiceSlice'
import { toast } from 'react-toastify'

const InvoiceReviewPage = () => {
  const dispatch = useDispatch()
  const { invoices, pagination, loading, errors } = useSelector((state) => state.aeInvoice)

  const [filters, setFilters] = useState({
    invoiceNumber: '',
    vendorName: '',
    date: '',
  })
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Fetch pending invoices when page or filters change
  useEffect(() => {
    const fetchParams = {
      page: currentPage,
      limit: itemsPerPage,
      invoiceNumber: filters.invoiceNumber || undefined,
      vendorName: filters.vendorName || undefined,
      date: filters.date || undefined,
    }
    dispatch(fetchAEPendingInvoices(fetchParams))
  }, [dispatch, currentPage, filters])

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
      const targetPage = (invoices.length === 1 && currentPage > 1) ? currentPage - 1 : currentPage;
      setCurrentPage(targetPage);

      // Refresh active page queue
      dispatch(fetchAEPendingInvoices({
        page: targetPage,
        limit: itemsPerPage,
        invoiceNumber: filters.invoiceNumber || undefined,
        vendorName: filters.vendorName || undefined,
        date: filters.date || undefined,
      }))
    } catch (error) {
      toast.error(`Decision Submission Failed: ${error}`)
    }
  }

  const handleFilter = (newFilters) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }

  const handleRefresh = () => {
    dispatch(fetchAEPendingInvoices({
      page: currentPage,
      limit: itemsPerPage,
      invoiceNumber: filters.invoiceNumber || undefined,
      vendorName: filters.vendorName || undefined,
      date: filters.date || undefined,
    }))
    toast.info('Refreshing invoices list...')
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      {/* Header section styled like Advance Settlement */}
      <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-2xl px-6 py-5 mb-6 shadow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <span>✅</span>Invoice Processing – Account Executive Review
          </h1>
          <p className="text-green-100 text-sm mt-0.5">
            Review and verify / reject invoices for your queue
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="bg-white hover:bg-green-50 text-green-700 font-semibold px-4 py-2 rounded-xl text-sm transition-colors duration-200 shadow-sm border border-green-200"
          title="Refresh invoices list"
        >
          Refresh Queue
        </button>
      </div>

      <AEInvoiceFilter filters={filters} setFilters={handleFilter} />

      {errors.fetch && (
        <div className="bg-red-50 text-red-600 border border-red-200 p-4 rounded-xl mb-4 text-sm font-medium">
          Error loading invoices: {errors.fetch}
        </div>
      )}

      {/* Loading state spinner */}
      {loading.fetch && (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
        </div>
      )}

      {/* Empty State matching Advance Settlement */}
      {!loading.fetch && invoices.length === 0 && (
        <div className="bg-white rounded-xl border border-green-100 shadow-sm py-16 text-center">
          <p className="text-4xl mb-3">📭</p>
          <p className="text-gray-500 font-medium">No material invoices found.</p>
          <p className="text-sm text-gray-400 mt-1">
            {filters.invoiceNumber || filters.vendorName || filters.date
              ? 'Try changing your search filters.'
              : 'Material invoices pending your review will appear here.'}
          </p>
        </div>
      )}

      {/* Table block matching Advance Settlement styling */}
      {!loading.fetch && invoices.length > 0 && (
        <div className="bg-white rounded-xl border border-green-100 shadow-sm overflow-hidden mt-4">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-green-600 text-white text-left">
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">Invoice ID</th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">Vendor Name</th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">Amount (₹)</th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">PO References</th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">Invoice Type</th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">Status</th>
                  <th className="px-4 py-3 font-semibold text-center whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-green-50">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-green-50/30 transition-colors duration-150">
                    <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">
                      <div className="font-semibold">{inv.id}</div>
                      <div className="text-xs text-gray-400 font-normal">{inv.invoiceNumber}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {inv.vendorName}
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-800 whitespace-nowrap">
                      ₹{parseFloat(inv.totalAmount || 0).toLocaleString('en-IN', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {inv.poDocuments && inv.poDocuments.length > 0 ? (
                        <div className="space-y-1">
                          {inv.poDocuments.map((doc, index) => (
                            <div key={index} className="truncate max-w-[200px]">
                              {index + 1}.{' '}
                              <a
                                href={doc.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-green-600 underline hover:text-green-800 font-medium"
                                title={doc.po_number || doc.name}
                              >
                                {doc.po_number || doc.name || `PO-${index + 1}`}
                              </a>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">No PO References</span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                      {inv.type ? (inv.type.charAt(0).toUpperCase() + inv.type.slice(1).toLowerCase()) : 'Material'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold inline-block border ${
                          inv.status === 'Pending GST Verification'
                            ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                            : inv.status === 'Approved' || inv.status.includes('Approved')
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : inv.status === 'Rejected' || inv.status.includes('Rejected')
                                ? 'bg-red-50 text-red-700 border-red-200'
                                : 'bg-gray-50 text-gray-700 border-gray-200'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      <button
                        onClick={() => openModal(inv)}
                        className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-xl text-xs md:text-sm shadow-sm transition-colors duration-200"
                      >
                        View & Verify
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center mt-4 flex-wrap gap-2">
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded border text-xs md:text-sm font-medium transition-colors duration-200 ${
                page === currentPage ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
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

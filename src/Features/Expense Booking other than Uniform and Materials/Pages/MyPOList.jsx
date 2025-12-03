/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import POSearchFilter from '../Components/POSearchFilter'
import POListTable from '../Components/POListTable'

export default function MyPOsList() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [vendorStatusFilter, setVendorStatusFilter] = useState('all')
  const [poTypeFilter, setPoTypeFilter] = useState('all')
  const [filteredPOs, setFilteredPOs] = useState([])
  const [poData, setPoData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  // Load POs from localStorage (key: "oneTimePo") and normalize structure to what's expected by the table
  useEffect(() => {
    const loadFromStorage = () => {
      try {
        const raw = JSON.parse(localStorage.getItem('oneTimePo') || '[]')
        const normalized = raw.map((po) => {
          const status = po.status || 'submitted'
          const financeApproval =
            po.financeApproval || (status === 'submitted' ? 'pending' : status)
          const vendorStatus =
            po.vendorStatus ||
            (status === 'submitted'
              ? { status: 'po-sent', label: 'PO Sent' }
              : { status: 'invoice-pending', label: 'Invoice Pending' })

          return {
            id: po.id || po.poNumber || Date.now().toString(),
            poNumber: po.poNumber || '',
            vendorName: po.vendorName || 'Unknown Vendor',
            description: po.description || '',
            createdDate: po.createdAt || po.createdDate || new Date().toISOString(),
            amount: typeof po.amount === 'number' ? po.amount : parseFloat(po.amount || 0),
            poType: po.poType || 'one-time',
            expenseType: po.expenseType || '',
            invoiceAmount: po.invoiceAmount || null,
            vendorStatus,
            financeApproval,
            rejectionReason: po.rejectionReason || null,
            status: status,
            startDate: po.startDate || null,
            endDate: po.endDate || null,
          }
        })

        // Sort newest first by default
        normalized.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))

        setPoData(normalized)
      } catch (err) {
        console.error('Error reading oneTimePo from localStorage:', err)
        setPoData([])
      }
    }

    loadFromStorage()

    // Update when storage changes in other tabs
    const handleStorage = (e) => {
      if (e.key === 'oneTimePo') loadFromStorage()
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  // Enhanced filtering logic (uses poData instead of fake data)
  useEffect(() => {
    const result = poData.filter((po) => {
      // Search filter - check multiple fields safely
      const searchLower = search.toLowerCase()
      const vendorName = (po.vendorName || '').toString().toLowerCase()
      const poNumber = (po.poNumber || '').toString().toLowerCase()
      const description = (po.description || '').toString().toLowerCase()

      const matchSearch =
        search === '' ||
        vendorName.includes(searchLower) ||
        poNumber.includes(searchLower) ||
        description.includes(searchLower)

      // Finance Head Status filter
      const matchStatus =
        statusFilter === 'all' || (po.financeApproval || '').toString() === statusFilter

      // Vendor status filter
      const matchVendorStatus =
        vendorStatusFilter === 'all' ||
        (po.vendorStatus?.status || '').toString() === vendorStatusFilter

      // PO Type filter
      const matchPoType = poTypeFilter === 'all' || (po.poType || '').toString() === poTypeFilter

      return matchSearch && matchStatus && matchVendorStatus && matchPoType
    })

    // Sort by creation date (newest first)
    const sortedResult = result.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))

    setFilteredPOs(sortedResult)
    setCurrentPage(1) // Reset to first page when filters change
  }, [search, statusFilter, vendorStatusFilter, poTypeFilter, poData])

  // Pagination
  const paginatedPOs = filteredPOs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const totalPages = Math.ceil(filteredPOs.length / itemsPerPage)

  // Statistics (derived from real data)
  const stats = {
    total: poData.length,
    pending: poData.filter((po) => po.financeApproval === 'pending').length,
    approved: poData.filter((po) => po.financeApproval === 'approved').length,
    rejected: poData.filter((po) => po.financeApproval === 'rejected').length,
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header with Statistics */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-green-600">My Purchase Orders</h1>
          <div className="text-sm text-gray-600">
            Total POs: {filteredPOs.length} of {stats.total}
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-gray-700">{stats.total}</div>
            <div className="text-xs text-gray-600">Total POs</div>
          </div>
          <div className="bg-yellow-50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-yellow-700">{stats.pending}</div>
            <div className="text-xs text-yellow-600">Finance Pending</div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-700">{stats.approved}</div>
            <div className="text-xs text-green-600">Finance Approved</div>
          </div>
          <div className="bg-red-50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-red-700">{stats.rejected}</div>
            <div className="text-xs text-red-600">Finance Rejected</div>
          </div>
        </div>
      </div>

      {/* Enhanced Search and Filters */}
      <div className="bg-white shadow-md rounded-lg">
        <POSearchFilter
          search={search}
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          vendorStatusFilter={vendorStatusFilter}
          setVendorStatusFilter={setVendorStatusFilter}
          poTypeFilter={poTypeFilter}
          setPoTypeFilter={setPoTypeFilter}
        />
      </div>

      {/* Enhanced Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <POListTable pos={paginatedPOs} />
      </div>

      {/* Enhanced Pagination */}
      {totalPages > 1 && (
        <div className="bg-white shadow-md rounded-lg p-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Page Info */}
            <div className="text-sm text-gray-600">
              Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredPOs.length)} to{' '}
              {Math.min(currentPage * itemsPerPage, filteredPOs.length)} of {filteredPOs.length}{' '}
              entries
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-2">
              <button
                className="px-3 py-2 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                First
              </button>

              <button
                className="px-3 py-2 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>

              {/* Page Numbers */}
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (currentPage <= 3) {
                    pageNum = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = currentPage - 2 + i
                  }

                  return (
                    <button
                      key={pageNum}
                      className={`px-3 py-2 text-sm rounded ${
                        currentPage === pageNum
                          ? 'bg-green-600 text-white'
                          : 'border hover:bg-gray-50'
                      }`}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  )
                })}
              </div>

              <button
                className="px-3 py-2 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>

              <button
                className="px-3 py-2 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                Last
              </button>
            </div>

            {/* Items per page */}
          </div>
        </div>
      )}

      {/* Empty State Message */}
      {filteredPOs.length === 0 && (
        <div className="bg-white shadow-md rounded-lg p-8 text-center">
          <div className="text-gray-400 text-6xl mb-4">📋</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No POs Found</h3>
          <p className="text-gray-600 mb-4">
            {search ||
            statusFilter !== 'all' ||
            vendorStatusFilter !== 'all' ||
            poTypeFilter !== 'all'
              ? 'No purchase orders match your current search and filter criteria.'
              : "You haven't created any purchase orders yet."}
          </p>
          {(search ||
            statusFilter !== 'all' ||
            vendorStatusFilter !== 'all' ||
            poTypeFilter !== 'all') && (
            <button
              onClick={() => {
                setSearch('')
                setStatusFilter('all')
                setVendorStatusFilter('all')
                setPoTypeFilter('all')
              }}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Clear All Filters
            </button>
          )}
        </div>
      )}
    </div>
  )
}

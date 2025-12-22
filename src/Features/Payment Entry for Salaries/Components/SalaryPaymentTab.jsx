/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from 'react'
import { toast } from 'react-toastify'
import * as XLSX from 'xlsx'
import AERejectionModal from './AERejectionModal'
import SalaryPaymentEntryModal from './SalaryPaymentEntryModal'
import { processSalaryBatchApproval } from '../../Master/utils/accountingHelpers'

const SalaryPaymentTab = () => {
  const [requests, setRequests] = useState([])
  const [filters, setFilters] = useState({ batchId: '', date: '', status: 'All' })
  const [currentPage, setCurrentPage] = useState(1)
  const entriesPerPage = 10
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [currentRejectId, setCurrentRejectId] = useState(null)

  // Payment Entry Modal states
  const [showPaymentEntryModal, setShowPaymentEntryModal] = useState(false)
  const [currentApprovalBatch, setCurrentApprovalBatch] = useState(null)

  // Load salary payment requests from localStorage on component mount
  useEffect(() => {
    try {
      const savedRequests = localStorage.getItem('salaryPaymentRequests')
      if (savedRequests) {
        const parsed = JSON.parse(savedRequests)
        setRequests(parsed)
        console.log('✅ Loaded salary payment requests from localStorage:', parsed.length)
      }
    } catch (error) {
      console.error('Error loading salary payment requests:', error)
      toast.error('Failed to load saved requests')
    }
  }, [])

  // Save requests to localStorage whenever they change
  useEffect(() => {
    if (requests.length > 0) {
      try {
        localStorage.setItem('salaryPaymentRequests', JSON.stringify(requests))
        console.log('💾 Saved salary payment requests to localStorage')
      } catch (error) {
        console.error('Error saving salary payment requests:', error)
      }
    }
  }, [requests])

  // Load Excel file from public folder
  const loadExcelFromPublic = async () => {
    try {
      const response = await fetch('/dummy-files/salary-data.xlsx')
      const arrayBuffer = await response.arrayBuffer()
      const data = new Uint8Array(arrayBuffer)
      const workbook = XLSX.read(data, { type: 'array' })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' })
      return jsonData
    } catch (error) {
      toast.error('Error loading Excel file: ' + error.message)
      return []
    }
  }

  // Add dummy request using real Excel data
  const handleAddDummyRequest = async () => {
    const employeeData = await loadExcelFromPublic()

    if (employeeData.length === 0) {
      toast.error('No data found in Excel file!')
      return
    }

    // Calculate total salary from DEBIT AMT column
    const totalSalary = employeeData.reduce((sum, emp) => {
      const debitAmt = Number(emp['DEBIT AMT']) || 0
      return sum + debitAmt
    }, 0)

    const batchId = `BATCH-${Date.now()}`
    const submittedBy = 'Payroll Team'
    const submittedAt = new Date().toISOString()

    const newRequest = {
      id: batchId,
      batchId,
      submittedBy,
      submittedAt,
      employeeCount: employeeData.length,
      totalSalary,
      status: 'Pending Approval',
      employeeData,
      history: [
        {
          action: 'created',
          by: submittedBy,
          date: submittedAt,
          comments: 'Salary batch created by Payroll Team',
        },
      ],
    }

    setRequests((prev) => [newRequest, ...prev])
    toast.success(`Dummy request ${batchId} added successfully!`)
  }

  // Download Excel file
  const handleDownloadExcel = (request) => {
    const ws = XLSX.utils.json_to_sheet(request.employeeData)
    ws['!cols'] = Array(Object.keys(request.employeeData[0] || {}).length).fill({ wch: 15 })

    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Salary_Data')

    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const file = new Blob([excelBuffer], { type: 'application/octet-stream' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(file)
    link.download = `${request.batchId}_salary.xlsx`
    link.click()

    toast.success('Excel file downloaded successfully!')
  }

  // Approve request - show payment entry modal first
  const handleApprove = (id) => {
    try {
      // Find the request to approve
      const request = requests.find((req) => req.id === id)
      if (!request) {
        toast.error('Request not found')
        return
      }

      // Store the batch and show payment entry modal
      setCurrentApprovalBatch(request)
      setShowPaymentEntryModal(true)
    } catch (error) {
      console.error('Error in handleApprove:', error)
      toast.error('Failed to open payment entry modal: ' + error.message)
    }
  }

  // Confirm approval after viewing payment entry modal
  const confirmApproval = () => {
    try {
      if (!currentApprovalBatch) {
        toast.error('No batch selected')
        return
      }

      // Get current user
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
      const approvedBy = currentUser.username || 'ae1'

      // Process accounting transaction
      const result = processSalaryBatchApproval(currentApprovalBatch, approvedBy)

      if (!result.success) {
        toast.error(result.message || 'Failed to process salary payment')
        console.error('Salary approval error:', result.error)
        setShowPaymentEntryModal(false)
        setCurrentApprovalBatch(null)
        return
      }

      // Update local state
      setRequests((prev) =>
        prev.map((req) => {
          if (req.id === currentApprovalBatch.id) {
            return {
              ...req,
              status: 'Approved',
              approvedBy: approvedBy,
              approvedAt: new Date().toISOString(),
              voucherNo: result.voucherNo,
              transactionId: result.transactionId,
              history: [
                ...(req.history || []),
                {
                  action: 'approved',
                  by: 'Account Executive',
                  date: new Date().toISOString(),
                  comments: `Approved - ${result.message}`,
                  voucherNo: result.voucherNo,
                },
              ],
            }
          }
          return req
        })
      )

      // Close modal and reset state
      setShowPaymentEntryModal(false)
      setCurrentApprovalBatch(null)

      toast.success(result.message)
      console.log('✅ Salary batch approved:', result)
    } catch (error) {
      console.error('Error in confirmApproval:', error)
      toast.error('Failed to approve request: ' + error.message)
      setShowPaymentEntryModal(false)
      setCurrentApprovalBatch(null)
    }
  }

  // Reject request - open modal
  const handleReject = (id) => {
    setCurrentRejectId(id)
    setShowRejectModal(true)
  }

  // Confirm rejection with reason
  const confirmReject = () => {
    setRequests((prev) =>
      prev.map((req) => {
        if (req.id === currentRejectId) {
          return {
            ...req,
            status: 'Rejected',
            reason: rejectionReason,
            history: [
              ...(req.history || []),
              {
                action: 'rejected',
                by: 'Account Executive',
                date: new Date().toISOString(),
                comments: rejectionReason,
              },
            ],
          }
        }
        return req
      })
    )

    setShowRejectModal(false)
    setRejectionReason('')
    setCurrentRejectId(null)
    toast.error('Request rejected!')
  }

  // Filter requests
  const filteredRequests = requests.filter((req) => {
    const matchBatchId = req.batchId.toLowerCase().includes(filters.batchId.toLowerCase())
    const matchDate = filters.date
      ? new Date(req.submittedAt).toLocaleDateString() ===
        new Date(filters.date).toLocaleDateString()
      : true
    const matchStatus = filters.status === 'All' || req.status === filters.status

    return matchBatchId && matchDate && matchStatus
  })

  // Pagination
  const totalPages = Math.ceil(filteredRequests.length / entriesPerPage)
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  )

  // Format date and time
  const formatDateTime = (isoString) => {
    const date = new Date(isoString)
    return {
      date: date.toLocaleDateString('en-IN'),
      time: date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Header with Add Button */}
      <div className="p-4 md:p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 truncate">
              Salary Payment Requests
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Review and approve salary payment batches from Payroll Team
            </p>
          </div>
          <button
            onClick={handleAddDummyRequest}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 whitespace-nowrap flex-shrink-0"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Add Dummy Request
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 md:p-6 bg-gray-50 border-b border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Batch ID</label>
            <input
              type="text"
              placeholder="Search by Batch ID"
              value={filters.batchId}
              onChange={(e) => setFilters({ ...filters, batchId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={filters.date}
              onChange={(e) => setFilters({ ...filters, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="All">All Status</option>
              <option value="Pending Approval">Pending Approval</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="p-4 md:p-6 max-w-5xl">
        {paginatedRequests.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
            <p className="text-gray-600 mb-4">
              Click "Add Dummy Request" to create a sample salary payment request
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto border-t border-gray-200">
              <table className="max-w-5xl divide-y divide-gray-200 border border-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap border-r border-gray-300">
                      Sr No
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap border-r border-gray-300">
                      Batch ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap border-r border-gray-300">
                      Submitted By
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap border-r border-gray-300">
                      Submitted At
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap border-r border-gray-300">
                      Employees
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap border-r border-gray-300">
                      Total Salary
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap border-r border-gray-300">
                      Excel File
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap border-r border-gray-300">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedRequests.map((request, index) => {
                    const { date, time } = formatDateTime(request.submittedAt)
                    const srNo = (currentPage - 1) * entriesPerPage + index + 1

                    return (
                      <tr key={request.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-300">
                          {srNo}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap border-r border-gray-300">
                          <div className="text-sm font-medium text-blue-600">{request.batchId}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap border-r border-gray-300">
                          <div className="text-sm text-gray-900">{request.submittedBy}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap border-r border-gray-300">
                          <div className="text-sm text-gray-900">{date}</div>
                          <div className="text-xs text-gray-500">{time}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-center border-r border-gray-300">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {request.employeeCount}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap border-r border-gray-300">
                          <div className="text-sm font-semibold text-green-600">
                            ₹{request.totalSalary.toLocaleString('en-IN')}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap border-r border-gray-300">
                          <button
                            onClick={() => handleDownloadExcel(request)}
                            className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                            Download
                          </button>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap border-r border-gray-300">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              request.status === 'Pending Approval'
                                ? 'bg-yellow-100 text-yellow-800'
                                : request.status === 'Approved'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {request.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          {request.status === 'Pending Approval' ? (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleApprove(request.id)}
                                className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleReject(request.id)}
                                className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-gray-500 italic text-xs">Action taken</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4 px-4 md:px-6 py-4">
              {paginatedRequests.map((request, index) => {
                const { date, time } = formatDateTime(request.submittedAt)
                const srNo = (currentPage - 1) * entriesPerPage + index + 1

                return (
                  <div
                    key={request.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">#{srNo}</div>
                        <div className="text-sm font-medium text-blue-600">{request.batchId}</div>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          request.status === 'Pending Approval'
                            ? 'bg-yellow-100 text-yellow-800'
                            : request.status === 'Approved'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {request.status}
                      </span>
                    </div>

                    <div className="space-y-2 mb-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Submitted By:</span>
                        <span className="font-medium">{request.submittedBy}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Date & Time:</span>
                        <span className="font-medium">
                          {date} {time}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Employees:</span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {request.employeeCount}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total Salary:</span>
                        <span className="font-semibold text-green-600">
                          ₹{request.totalSalary.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleDownloadExcel(request)}
                        className="w-full inline-flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        Download Excel
                      </button>

                      {request.status === 'Pending Approval' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(request.id)}
                            className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded text-white bg-green-600 hover:bg-green-700"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(request.id)}
                            className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded text-white bg-red-600 hover:bg-red-700"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between px-4 md:px-6 py-4 gap-4 border-t border-gray-200">
              <div className="text-sm text-gray-700">
                Showing{' '}
                <span className="font-medium">{(currentPage - 1) * entriesPerPage + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * entriesPerPage, filteredRequests.length)}
                </span>{' '}
                of <span className="font-medium">{filteredRequests.length}</span> results
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg ${
                        currentPage === page
                          ? 'bg-green-600 text-white'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Rejection Modal */}
      <AERejectionModal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onSubmit={{
          reasonChange: setRejectionReason,
          confirm: confirmReject,
        }}
      />

      {/* Payment Entry Modal */}
      <SalaryPaymentEntryModal
        isOpen={showPaymentEntryModal}
        onClose={() => {
          setShowPaymentEntryModal(false)
          setCurrentApprovalBatch(null)
        }}
        onConfirm={confirmApproval}
        batchData={currentApprovalBatch}
      />
    </div>
  )
}
export default SalaryPaymentTab

import React, { useEffect, useState } from 'react'
import { FaEye } from 'react-icons/fa'
import { toast } from 'react-toastify'
import ManagerFilter from './ManagerFilter'
import { useSelector } from 'react-redux'

const VPApproval = () => {
  const loggedInUser = useSelector((state) => state.auth.user)
  const [requests, setRequests] = useState([])
  const [filters, setFilters] = useState({ name: '', employeeId: '', date: '', requestId: '' })
  const [modalData, setModalData] = useState(null)
  const [remarks, setRemarks] = useState('')
  const [rejectId, setRejectId] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)

  const itemsPerPage = 5

  // Helper function to format multiple reasons
  const formatReasons = (reason, customReason) => {
    const reasons = []

    if (reason) {
      // Handle case where reason might be an array or comma-separated string
      if (Array.isArray(reason)) {
        reasons.push(...reason.filter((r) => r && r.toString().trim()))
      } else if (typeof reason === 'string' && reason.trim()) {
        // Split by comma and clean up each reason
        const splitReasons = reason
          .split(',')
          .map((r) => r.trim())
          .filter((r) => r)
        reasons.push(...splitReasons)
      } else if (reason && typeof reason === 'object') {
        // Handle case where reason might be an object
        reasons.push(reason.toString().trim())
      } else if (reason) {
        // Handle any other type
        reasons.push(reason.toString().trim())
      }
    }

    if (customReason && customReason.toString().trim()) {
      reasons.push(customReason.toString().trim())
    }

    // Remove duplicates and join with comma and space
    const uniqueReasons = [...new Set(reasons.filter((r) => r))]
    return uniqueReasons.length > 0 ? uniqueReasons.join(', ') : 'No reason provided'
  }

  useEffect(() => {
    const allRequests = JSON.parse(localStorage.getItem('advanceRequests')) || []
    const allUsers = JSON.parse(localStorage.getItem('users')) || []

    // Find all line managers who report to this VP
    const lineManagersUnderThisVP = allUsers.filter(
      (user) => user.reportsTo === loggedInUser && user.role === 'line-manager'
    )

    // Get the usernames of these line managers
    const lineManagerUsernames = lineManagersUnderThisVP.map((lm) => lm.username)

    // Filter requests that VP should see
    const filteredRequests = allRequests.filter((req) => {
      // Type 1: Employee requests approved by line managers under this VP
      const isEmployeeRequestApprovedByMyLM =
        lineManagerUsernames.includes(req.assignedTo) &&
        (req.status === 'Pending VP Approval' ||
          req.status === 'Pending AE Approval' ||
          (req.status === 'Rejected by VP Operations' && req.clarification))

      // Type 2: Line Manager's own requests that are assigned to this VP
      const isLineManagerRequestForThisVP =
        req.assignedTo === loggedInUser &&
        lineManagerUsernames.includes(req.submittedBy) &&
        (req.status === 'Pending VP Approval' ||
          req.status === 'Pending AE Approval' ||
          (req.status === 'Rejected by VP Operations' && req.clarification))

      return isEmployeeRequestApprovedByMyLM || isLineManagerRequestForThisVP
    })

    setRequests(filteredRequests)
  }, [loggedInUser])

  // Helper function to get employee O/S balance
  const getEmployeeOSBalance = (employeeId) => {
    try {
      const users = JSON.parse(localStorage.getItem('users')) || []

      // Find the employee by employeeId
      const employee = users.find(
        (user) =>
          user.empId === employeeId ||
          user.username === employeeId ||
          (user.empId && user.empId.toString() === employeeId.toString())
      )

      return employee?.osBalance || 0
    } catch (error) {
      console.error('Error getting employee O/S balance:', error)
      return 0
    }
  }

  const handleApprove = (submittedAt) => {
    const allRequests = JSON.parse(localStorage.getItem('advanceRequests')) || []
    const approvalTime = new Date()

    // Check if approval is before 15:59 PM deadline
    const isBeforeDeadline =
      approvalTime.getHours() < 19 ||
      (approvalTime.getHours() === 19 && approvalTime.getMinutes() <= 59)

    const updatedAllRequests = allRequests.map((req) =>
      req.submittedAt === submittedAt
        ? {
            ...req,
            status: 'Pending AE Approval',
            remarks: '',
            vpApprovedBy: loggedInUser,
            vpApprovedAt: approvalTime.toISOString(), // Added timestamp
            isVPRequest: true, // Mark as VP request
            vpApprovedBeforeDeadline: isBeforeDeadline, // Track if approved before deadline
          }
        : req
    )

    localStorage.setItem('advanceRequests', JSON.stringify(updatedAllRequests))

    // Update local state with the same filtering logic as initial load
    const allUsers = JSON.parse(localStorage.getItem('users')) || []
    const lineManagersUnderThisVP = allUsers.filter(
      (user) => user.reportsTo === loggedInUser && user.role === 'line-manager'
    )
    const lineManagerUsernames = lineManagersUnderThisVP.map((lm) => lm.username)

    const filtered = updatedAllRequests.filter((req) => {
      const isEmployeeRequestApprovedByMyLM =
        lineManagerUsernames.includes(req.assignedTo) &&
        (req.status === 'Pending VP Approval' ||
          req.status === 'Pending AE Approval' ||
          (req.status === 'Rejected by VP Operations' && req.clarification))

      const isLineManagerRequestForThisVP =
        req.assignedTo === loggedInUser &&
        lineManagerUsernames.includes(req.submittedBy) &&
        (req.status === 'Pending VP Approval' ||
          req.status === 'Pending AE Approval' ||
          (req.status === 'Rejected by VP Operations' && req.clarification))

      return isEmployeeRequestApprovedByMyLM || isLineManagerRequestForThisVP
    })

    setRequests(filtered)

    // Show different messages based on timing
    if (isBeforeDeadline) {
      toast.success(
        'Request Approved - Sent to Account Executive (Eligible for same-day processing)'
      )
    } else {
      toast.warning(
        'Request Approved - Sent to Account Executive (Will be processed next working day - approved after 15:59)'
      )
    }
  }

  const handleReject = () => {
    if (!remarks.trim()) return alert('Please provide rejection remarks')

    const allRequests = JSON.parse(localStorage.getItem('advanceRequests')) || []
    const rejectionTime = new Date()

    const updatedAllRequests = allRequests.map((req) =>
      req.submittedAt === rejectId
        ? {
            ...req,
            status: 'Rejected by VP Operations',
            remarks,
            clarification: '',
            vpRejectedBy: loggedInUser,
            vpRejectedAt: rejectionTime.toISOString(), // Added rejection timestamp
          }
        : req
    )

    localStorage.setItem('advanceRequests', JSON.stringify(updatedAllRequests))

    // Update local state with the same filtering logic
    const allUsers = JSON.parse(localStorage.getItem('users')) || []
    const lineManagersUnderThisVP = allUsers.filter(
      (user) => user.reportsTo === loggedInUser && user.role === 'line-manager'
    )
    const lineManagerUsernames = lineManagersUnderThisVP.map((lm) => lm.username)

    const filtered = updatedAllRequests.filter((req) => {
      const isEmployeeRequestApprovedByMyLM =
        lineManagerUsernames.includes(req.assignedTo) &&
        (req.status === 'Pending VP Approval' ||
          req.status === 'Pending AE Approval' ||
          (req.status === 'Rejected by VP Operations' && req.clarification))

      const isLineManagerRequestForThisVP =
        req.assignedTo === loggedInUser &&
        lineManagerUsernames.includes(req.submittedBy) &&
        (req.status === 'Pending VP Approval' ||
          req.status === 'Pending AE Approval' ||
          (req.status === 'Rejected by VP Operations' && req.clarification))

      return isEmployeeRequestApprovedByMyLM || isLineManagerRequestForThisVP
    })

    setRequests(filtered)
    setRemarks('')
    setRejectId(null)
    toast.error('Request Rejected by VP Operations')
  }

  const filteredRequests = requests
    .filter(
      (req) =>
        req.employeeName.toLowerCase().includes(filters.name.toLowerCase()) &&
        req.employeeId.toLowerCase().includes(filters.employeeId.toLowerCase()) &&
        (filters.date === '' || req.requestDate === filters.date) &&
        (filters.requestId === '' ||
          (req.requestId && req.requestId.toLowerCase().includes(filters.requestId.toLowerCase())))
    )
    .sort((a, b) => {
      // Sort by status priority first (Pending VP Approval at top)
      const statusPriority = {
        'Pending VP Approval': 1,
        'Rejected by VP Operations': 2,
        'Pending AE Approval': 3,
      }

      const aPriority = statusPriority[a.status] || 4
      const bPriority = statusPriority[b.status] || 4

      if (aPriority !== bPriority) {
        return aPriority - bPriority
      }

      // Then sort by request date - newest first
      return new Date(b.requestDate) - new Date(a.requestDate)
    })

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage)
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const isActionAllowed = (req) => {
    return (
      req.status === 'Pending VP Approval' ||
      (req.status === 'Rejected by VP Operations' && req.clarification)
    )
  }

  // Helper function to check if current time is before deadline
  const isCurrentlyBeforeDeadline = () => {
    const now = new Date()
    return now.getHours() < 15 || (now.getHours() === 19 && now.getMinutes() <= 59)
  }

  return (
    <div className="px-4 py-6">
      <div className="max-w-full mx-auto">

        {/* Header with deadline badge */}
        <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-2xl px-6 py-5 mb-5 shadow flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">✅ Advance Requests – VP Operations Approval</h1>
            <p className="text-green-100 text-sm mt-0.5">Review and approve/reject advance requests from employees and managers</p>
          </div>
          <div className={`text-sm px-4 py-1.5 rounded-full font-semibold border ${
            isCurrentlyBeforeDeadline()
              ? 'bg-white text-green-700 border-green-200'
              : 'bg-red-100 text-red-700 border-red-200'
          }`}>
            {isCurrentlyBeforeDeadline()
              ? '🟢 Before 15:59 – Same day processing'
              : '🔴 After 15:59 – Next day processing only'}
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-xl border border-green-100 shadow-sm px-4 py-3 mb-5">
          <ManagerFilter filters={filters} setFilters={setFilters} />
        </div>

        {/* Table */}
        {paginatedRequests.length === 0 ? (
          <div className="bg-white rounded-xl border border-green-100 shadow-sm py-16 text-center">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-gray-500 font-medium">No requests pending VP approval.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-green-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-green-600 text-white">
                    <th className="px-3 py-3 text-left font-semibold whitespace-nowrap">Request ID</th>
                    <th className="px-3 py-3 text-left font-semibold whitespace-nowrap">Name</th>
                    <th className="px-3 py-3 text-left font-semibold whitespace-nowrap">Emp ID</th>
                    <th className="px-3 py-3 text-left font-semibold whitespace-nowrap">Amount</th>
                    <th className="px-3 py-3 text-left font-semibold whitespace-nowrap">Date</th>
                    <th className="px-3 py-3 text-left font-semibold whitespace-nowrap">O/S Bal</th>
                    <th className="px-3 py-3 text-left font-semibold whitespace-nowrap">Reason</th>
                    <th className="px-3 py-3 text-left font-semibold whitespace-nowrap">Submitted By</th>
                    <th className="px-3 py-3 text-left font-semibold whitespace-nowrap">Type</th>
                    <th className="px-3 py-3 text-left font-semibold whitespace-nowrap">Status</th>
                    <th className="px-3 py-3 text-left font-semibold whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-green-50">
                  {paginatedRequests.map((req) => (
                    <tr key={req.submittedAt} className="hover:bg-green-50 transition-colors">
                      <td className="px-3 py-3 font-mono text-xs text-gray-600 whitespace-nowrap">{req.requestId || '—'}</td>
                      <td className="px-3 py-3 font-medium text-gray-800 whitespace-nowrap">{req.employeeName}</td>
                      <td className="px-3 py-3 text-gray-600 whitespace-nowrap">{req.employeeId}</td>
                      <td className="px-3 py-3 font-semibold text-green-700 whitespace-nowrap">₹{Number(req.amount).toLocaleString('en-IN')}</td>
                      <td className="px-3 py-3 text-gray-600 whitespace-nowrap">{req.requestDate}</td>
                      <td className="px-3 py-3 text-gray-700 whitespace-nowrap">₹{(getEmployeeOSBalance(req.employeeId) || 0).toFixed(2)}</td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <button
                          onClick={() => setModalData({
                            reason: req.reason,
                            customReason: req.customReason,
                            formattedReason: formatReasons(req.reason, req.customReason),
                          })}
                          className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-full hover:bg-green-100 transition"
                        >
                          <FaEye className="text-xs" /> View
                        </button>
                      </td>
                      <td className="px-3 py-3 text-gray-700 whitespace-nowrap text-xs">{req.submittedBy || req.employeeName}</td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                          req.assignedTo === loggedInUser
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {req.assignedTo === loggedInUser ? 'Manager' : 'Employee'}
                        </span>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            req.status.includes('Rejected') ? 'bg-red-100 text-red-700' :
                            req.status.includes('Pending') ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {req.status}
                          </span>
                          {req.status === 'Rejected by VP Operations' && req.clarification && (
                            <button
                              onClick={() => setModalData({
                                reason: req.remarks || req.reason,
                                clarification: req.clarification,
                                formattedReason: formatReasons(req.remarks || req.reason, req.customReason),
                              })}
                              title="View Clarification"
                              className="text-blue-500 hover:text-blue-700"
                            >
                              <FaEye className="text-xs" />
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="flex gap-2">
                          <button
                            disabled={!isActionAllowed(req)}
                            onClick={() => handleApprove(req.submittedAt)}
                            title={isCurrentlyBeforeDeadline() ? 'Same-day processing' : 'Next-day processing'}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                              isActionAllowed(req)
                                ? 'bg-green-600 text-white hover:bg-green-700 shadow-sm'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            Approve
                          </button>
                          <button
                            disabled={!isActionAllowed(req)}
                            onClick={() => setRejectId(req.submittedAt)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                              isActionAllowed(req)
                                ? 'bg-red-500 text-white hover:bg-red-600 shadow-sm'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 px-4 py-4 border-t border-green-100">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-full text-sm font-semibold transition ${
                      page === currentPage
                        ? 'bg-green-600 text-white shadow'
                        : 'bg-white text-green-700 border border-green-300 hover:bg-green-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Reason / Clarification Modal */}
      {modalData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">📋 Request Details</h3>
            {(modalData.reason || modalData.customReason || modalData.formattedReason) && (
              <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3">
                <h4 className="font-semibold text-green-700 mb-1 text-sm">Reason(s)</h4>
                <p className="text-gray-700 text-sm">
                  {modalData.formattedReason || formatReasons(modalData.reason, modalData.customReason)}
                </p>
              </div>
            )}
            {modalData.clarification && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <h4 className="font-semibold text-yellow-700 mb-1 text-sm">Employee Clarification</h4>
                <p className="text-gray-700 text-sm">{modalData.clarification}</p>
              </div>
            )}
            <div className="text-right mt-5">
              <button
                onClick={() => setModalData(null)}
                className="bg-green-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectId !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-1">❌ VP Rejection Remarks</h3>
            <p className="text-sm text-gray-500 mb-4">Provide a detailed reason for rejecting this advance request.</p>
            <textarea
              className="w-full border border-gray-300 px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none mb-4"
              rows="4"
              placeholder="Enter detailed reason for rejection as VP Operations..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => { setRejectId(null); setRemarks('') }}
                className="px-4 py-2 rounded-lg text-sm border border-gray-300 text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="px-5 py-2 rounded-lg text-sm bg-red-600 text-white font-semibold hover:bg-red-700 transition"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default VPApproval

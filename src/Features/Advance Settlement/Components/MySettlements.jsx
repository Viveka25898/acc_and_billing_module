import React, { useState, useEffect } from 'react'
import { AiOutlineEye } from 'react-icons/ai'
import RejectionReasonModal from './RejectionReasonModal'

const statuses = ['All', 'Pending', 'Approved', 'Rejected']

const FilterBar = ({ selectedStatus, onStatusChange, selectedDate, onDateChange }) => (
  <div className="w-full flex flex-col md:flex-row gap-6 mb-6 px-6">
    <div className="w-full md:w-1/3">
      <label className="block text-sm font-medium mb-2">Filter by Date</label>
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => onDateChange(e.target.value)}
        className="w-full border p-2 rounded"
      />
    </div>
    <div className="w-full md:w-1/3">
      <label className="block text-sm font-medium mb-2">Filter by Status</label>
      <select
        value={selectedStatus}
        onChange={(e) => onStatusChange(e.target.value)}
        className="w-full border p-2 rounded"
      >
        {statuses.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
    </div>
  </div>
)

const MySettlements = () => {
  const [currentUser, setCurrentUser] = useState(null)
  const [settlements, setSettlements] = useState([])
  const [selectedReason, setSelectedReason] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [clarificationModalOpen, setClarificationModalOpen] = useState(false)
  const [clarificationText, setClarificationText] = useState('')
  const [clarificationId, setClarificationId] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [selectedDate, setSelectedDate] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [osBalance, setOsBalance] = useState(0)
  const rowsPerPage = 5

  // ✅ FIXED: Function to generate employee GL code - CORRECT FORMAT
  const generateEmployeeGLCode = (employeeId) => {
    if (!employeeId) return null
    const normalizedId = String(employeeId).replace('emp', '')
    return `A3001001001-EMP-${normalizedId.padStart(3, '0')}` // Changed from A3002
  }

  // CORRECT O/S Balance calculation from GL transactions
  const calculateRealOSBalance = (employeeId) => {
    try {
      const transactions = JSON.parse(localStorage.getItem('transactions')) || []
      const employeeGLCode = generateEmployeeGLCode(employeeId)

      if (!employeeGLCode) return 0

      console.log('🔍 Calculating O/S balance for:', employeeGLCode)

      let totalDebits = 0
      let totalCredits = 0

      transactions.forEach((txn) => {
        if (txn.entries && Array.isArray(txn.entries)) {
          txn.entries.forEach((entry) => {
            if (entry.glCode === employeeGLCode) {
              totalDebits += entry.debit || 0
              totalCredits += entry.credit || 0
              console.log(`📝 Found: Dr ${entry.debit}, Cr ${entry.credit} in ${txn.voucherNo}`)
            }
          })
        }
      })

      const balance = totalDebits - totalCredits
      console.log(`💰 O/S Balance: ₹${balance} (Dr: ${totalDebits}, Cr: ${totalCredits})`)

      return balance
    } catch (error) {
      console.error('❌ Error calculating O/S balance:', error)
      return 0
    }
  }

  // Get current user from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    const allUsers = JSON.parse(localStorage.getItem('users')) || []
    const fullUser = allUsers.find((u) => u.username === user?.username)
    setCurrentUser(fullUser)
  }, [])

  useEffect(() => {
    if (currentUser) {
      const storedSettlements = JSON.parse(localStorage.getItem('settlements')) || []

      // Filter by employeeId
      const userSettlements = storedSettlements
        .filter((s) => s.employeeId === currentUser.empId)
        .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))

      setSettlements(userSettlements)

      // Calculate O/S balance from actual GL transactions
      const realBalance = calculateRealOSBalance(currentUser.empId)
      setOsBalance(realBalance)
    }
  }, [currentUser])

  const openClarificationModal = (id) => {
    setClarificationId(id)
    setClarificationModalOpen(true)
  }

  const submitClarification = () => {
    if (!clarificationText.trim()) {
      alert('Please enter clarification details')
      return
    }

    if (!currentUser) return

    const updatedSettlements = settlements.map((settlement) => {
      if (settlement.id === clarificationId) {
        const rejectionHistory = settlement.history.find(
          (h) => h.action.includes('rejected') && !h.action.includes('after-clarification')
        )

        let assignedTo = null
        let currentLevel = ''
        let status = ''

        if (rejectionHistory?.by) {
          const allUsers = JSON.parse(localStorage.getItem('users')) || []
          const rejector = allUsers.find((u) => u.username === rejectionHistory.by)

          if (rejector?.role === 'line-manager') {
            assignedTo = rejector.username
            currentLevel = 'line-manager'
            status = 'Clarification Submitted to Line Manager'
          } else if (rejector?.role === 'vp-operations') {
            assignedTo = rejector.username
            currentLevel = 'vp-operations'
            status = 'Clarification Submitted to VP Operations'
          } else if (rejector?.role === 'account-executive') {
            assignedTo = rejector.username
            currentLevel = 'account-executive'
            status = 'Clarification Submitted to Account Executive'
          }
        }

        return {
          ...settlement,
          status,
          assignedTo,
          currentLevel,
          clarificationText,
          clarificationSubmittedAt: new Date().toISOString(),
          history: [
            ...settlement.history,
            {
              action: 'clarification-submitted',
              by: currentUser.username,
              date: new Date().toISOString(),
              comments: clarificationText,
            },
          ],
        }
      }
      return settlement
    })

    setSettlements(updatedSettlements)
    const allSettlements = JSON.parse(localStorage.getItem('settlements')) || []
    const updatedAllSettlements = allSettlements.map((settlement) => {
      const updated = updatedSettlements.find((s) => s.id === settlement.id)
      return updated || settlement
    })
    localStorage.setItem('settlements', JSON.stringify(updatedAllSettlements))

    setClarificationModalOpen(false)
    setClarificationText('')
    setClarificationId(null)

    alert('Clarification submitted successfully!')
  }

  const openModal = (reason) => {
    setSelectedReason(reason)
    setModalOpen(true)
  }

  const getStatusBadgeClass = (status) => {
    if (status.includes('Rejected')) return 'bg-red-100 text-red-800'
    if (status.includes('Approved')) return 'bg-green-100 text-green-800'
    if (status.includes('Clarification')) return 'bg-purple-100 text-purple-800'
    return 'bg-yellow-100 text-yellow-800'
  }

  const canSubmitClarification = (settlement) => {
    return (
      settlement.status.includes('Rejected') &&
      (!settlement.clarificationText || settlement.status.includes('Rejected After Clarification'))
    )
  }

  const calculateTotalAmount = (expenseItems) => {
    return expenseItems.reduce((sum, item) => {
      const amount = Number(item['Amount (₹)']) || 0
      return sum + amount
    }, 0)
  }

  const filteredRequests = settlements.filter((req) => {
    const normalizedStatus = req.status.toLowerCase()

    let matchStatus = false
    if (selectedStatus === 'All') {
      matchStatus = true
    } else if (selectedStatus === 'Pending') {
      matchStatus = normalizedStatus.includes('pending')
    } else if (selectedStatus === 'Approved') {
      matchStatus = normalizedStatus.includes('approved')
    } else if (selectedStatus === 'Rejected') {
      matchStatus = normalizedStatus.includes('rejected')
    }

    const matchDate =
      !selectedDate || new Date(req.submittedAt).toISOString().split('T')[0] === selectedDate

    return matchStatus && matchDate
  })

  const totalPages = Math.ceil(filteredRequests.length / rowsPerPage)
  const paginatedData = filteredRequests.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  )

  if (!currentUser) {
    return <div className="text-center p-8">Loading...</div>
  }

  return (
    <div className="bg-white shadow-md rounded-md pb-8">
      <div className="bg-green-50 p-4 border-b">
        <h3 className="text-2xl font-bold text-green-600">My Settlement Requests</h3>
        <div className="mt-2 flex items-center gap-4">
          <span className="text-lg font-semibold">O/S Balance:</span>
          <span className="text-2xl font-bold text-green-700">₹{osBalance.toFixed(2)}</span>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Based on actual GL transactions (Advances - Settlements)
        </p>
      </div>

      <FilterBar
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />

      <div className="overflow-x-auto px-6">
        <table className="min-w-full border text-sm bg-white shadow-md rounded">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3 border">#</th>
              <th className="p-3 border">Date</th>
              <th className="p-3 border">Amount</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((req, idx) => {
              const amount = calculateTotalAmount(req.expenseItems)
              return (
                <tr key={req.id}>
                  <td className="p-3 border">{(currentPage - 1) * rowsPerPage + idx + 1}</td>
                  <td className="p-3 border">{new Date(req.submittedAt).toLocaleDateString()}</td>
                  <td className="p-3 border">
                    <div>
                      <span className="font-medium">₹ {amount.toFixed(2)}</span>
                      {req.status === 'Approved by Account Executive' && (
                        <div className="text-xs text-red-600 mt-1">- Deducted from O/S Balance</div>
                      )}
                    </div>
                  </td>
                  <td className="p-3 border">
                    <span
                      className={`px-2 py-1 rounded text-xs ${getStatusBadgeClass(req.status)}`}
                    >
                      {req.status}
                    </span>
                    {req.rejectionReason && (
                      <div className="text-xs text-gray-500 mt-1">
                        Click eye icon to view reason
                      </div>
                    )}
                  </td>
                  <td className="p-3 border">
                    {req.rejectionReason && (
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => openModal(req.rejectionReason || 'No reason provided')}
                          className="text-blue-600 hover:text-blue-800"
                          title="View Rejection Reason"
                        >
                          <AiOutlineEye size={20} />
                        </button>
                        {req.status.includes('Clarification Submitted') ? (
                          <span className="text-purple-600 text-xs font-semibold">
                            Clarification Under Review
                          </span>
                        ) : canSubmitClarification(req) ? (
                          <button
                            onClick={() => openClarificationModal(req.id)}
                            className="bg-yellow-500 text-white text-xs px-2 py-1 rounded hover:bg-yellow-600"
                          >
                            Submit Clarification
                          </button>
                        ) : null}
                      </div>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {paginatedData.length === 0 && (
        <div className="text-center p-8 text-gray-500">
          No settlements found matching your criteria.
        </div>
      )}

      {filteredRequests.length > rowsPerPage && (
        <div className="flex justify-end mt-6 px-6 gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-3 py-1">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      <RejectionReasonModal
        isOpen={modalOpen}
        reason={selectedReason}
        onClose={() => setModalOpen(false)}
      />

      {clarificationModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-[90%] max-w-lg">
            <h2 className="text-lg font-semibold mb-4">Submit Clarification</h2>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Explain why this expense should be approved or provide additional details:
              </p>
              <textarea
                className="w-full border border-gray-300 rounded p-3 mb-4"
                rows="5"
                placeholder="Enter clarification details..."
                value={clarificationText}
                onChange={(e) => setClarificationText(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setClarificationModalOpen(false)
                  setClarificationText('')
                  setClarificationId(null)
                }}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={submitClarification}
                disabled={!clarificationText.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                Submit Clarification
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MySettlements

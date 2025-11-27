import React, { useState, useEffect } from 'react'
import { AiOutlineEye, AiOutlineCheck, AiOutlineClose } from 'react-icons/ai'
import * as XLSX from 'xlsx'
import RemarkModal from '../Components/RemarkModal'
import ManagerFilter from '../Components/ManagerFilter'
import ManagerClarificationModal from '../Components/ManagerClarificationModal'

const VPReview = () => {
  const [currentUser, setCurrentUser] = useState(null)
  const [settlements, setSettlements] = useState([])
  const [remarkInput, setRemarkInput] = useState('')
  const [selectedRejectId, setSelectedRejectId] = useState(null)
  const [clarificationData, setClarificationData] = useState(null)
  const [filter, setFilter] = useState({
    employee: '',
    status: 'All',
    date: '',
  })
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 5

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

      const vpRequests = storedSettlements.filter((settlement) => {
        const isAssignedToVP = settlement.assignedTo === currentUser.username
        const isClarificationForVP =
          settlement.status.includes('Clarification Submitted') &&
          settlement.history.some((h) => h.action === 'rejected' && h.by === currentUser.username)
        return isAssignedToVP || isClarificationForVP
      })

      setSettlements(vpRequests)
    }
  }, [currentUser])

  // ✅ Function to open Excel file as HTML in new tab
  const viewExcelFile = (excelFile) => {
    if (!excelFile || !excelFile.data) {
      alert('Excel file not found')
      return
    }

    try {
      const base64Data = excelFile.data.split(',')[1]
      const byteCharacters = atob(base64Data)
      const byteNumbers = new Array(byteCharacters.length)

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }

      const byteArray = new Uint8Array(byteNumbers)
      const workbook = XLSX.read(byteArray, { type: 'array' })
      const firstSheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[firstSheetName]
      const html = XLSX.utils.sheet_to_html(worksheet, {
        header:
          '<style>table{border-collapse:collapse;width:100%;font-family:Arial,sans-serif;}th,td{border:1px solid #ddd;padding:8px;text-align:left;}th{background-color:#4CAF50;color:white;font-weight:bold;}tr:nth-child(even){background-color:#f2f2f2;}</style>',
        footer: '',
      })

      const newWindow = window.open('', '_blank')
      newWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${excelFile.name || 'Settlement Expenses'}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              background-color: #f5f5f5;
            }
            .container {
              background-color: white;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            h1 {
              color: #333;
              border-bottom: 2px solid #4CAF50;
              padding-bottom: 10px;
            }
            table {
              border-collapse: collapse;
              width: 100%;
              margin-top: 20px;
              font-size: 14px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 12px;
              text-align: left;
            }
            th {
              background-color: #4CAF50;
              color: white;
              font-weight: bold;
            }
            tr:nth-child(even) {
              background-color: #f9f9f9;
            }
            tr:hover {
              background-color: #f5f5f5;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>📊 ${excelFile.name || 'Settlement Expenses'}</h1>
            ${html}
          </div>
        </body>
        </html>
      `)
      newWindow.document.close()
    } catch (error) {
      console.error('Error opening Excel file:', error)
      alert('Failed to open Excel file')
    }
  }

  // ✅ Function to view/download attachment
  const viewAttachment = (attachment) => {
    if (!attachment || !attachment.data) {
      alert('Attachment not found')
      return
    }

    try {
      if (attachment.type === 'application/pdf') {
        const pdfWindow = window.open('')
        pdfWindow.document.write(
          `<iframe width='100%' height='100%' src='${attachment.data}'></iframe>`
        )
      } else {
        const base64Data = attachment.data.split(',')[1]
        const byteCharacters = atob(base64Data)
        const byteNumbers = new Array(byteCharacters.length)

        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i)
        }

        const byteArray = new Uint8Array(byteNumbers)
        const blob = new Blob([byteArray], { type: attachment.type })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = attachment.name
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Error opening attachment:', error)
      alert('Failed to open attachment')
    }
  }

  const handleApprove = (id) => {
    if (!currentUser) return

    const updated = settlements.map((settlement) => {
      if (settlement.id === id) {
        const nextApprover = getNextApprover()
        const newStatus = nextApprover
          ? `Pending ${nextApprover.title} Approval`
          : 'Approved by Account Executive'

        return {
          ...settlement,
          status: newStatus,
          currentLevel: nextApprover?.level || 'completed',
          assignedTo: nextApprover?.username || null,
          rejectionReason: null,
          history: [
            ...settlement.history,
            {
              action: settlement.status.includes('Clarification')
                ? 'approved-after-clarification'
                : 'approved',
              by: currentUser.username,
              date: new Date().toISOString(),
              comments: '',
            },
          ],
        }
      }
      return settlement
    })

    updateSettlements(updated)
    setClarificationData(null)
  }

  const handleReject = (id) => {
    if (!remarkInput.trim()) return alert('Please enter a rejection reason.')
    if (!currentUser) return

    const updated = settlements.map((settlement) => {
      if (settlement.id === id) {
        const isClarification = settlement.status.includes('Clarification')
        const status = isClarification
          ? 'Rejected After Clarification by VP'
          : 'Rejected by VP Operations'

        return {
          ...settlement,
          status,
          rejectionReason: remarkInput,
          history: [
            ...settlement.history,
            {
              action: isClarification ? 'rejected-after-clarification' : 'rejected',
              by: currentUser.username,
              date: new Date().toISOString(),
              comments: remarkInput,
            },
          ],
        }
      }
      return settlement
    })

    updateSettlements(updated)
    setSelectedRejectId(null)
    setRemarkInput('')
  }

  const getNextApprover = () => {
    const users = JSON.parse(localStorage.getItem('users')) || []
    const accountExecutive = users.find((u) => u.role === 'account-executive')
    return accountExecutive
      ? {
          level: 'account-executive',
          title: 'Account Executive',
          username: accountExecutive.username,
        }
      : null
  }

  const updateSettlements = (updatedSettlements) => {
    setSettlements(updatedSettlements)
    const allSettlements = JSON.parse(localStorage.getItem('settlements')) || []
    const updatedAll = allSettlements.map((settlement) => {
      const updated = updatedSettlements.find((s) => s.id === settlement.id)
      return updated || settlement
    })
    localStorage.setItem('settlements', JSON.stringify(updatedAll))
  }

  const filtered = settlements.filter((settlement) => {
    const matchesName = settlement.employeeName
      .toLowerCase()
      .includes(filter.employee.toLowerCase())
    const matchesStatus =
      filter.status === 'All' ||
      settlement.status.toLowerCase().includes(filter.status.toLowerCase())
    const matchesDate =
      !filter.date || new Date(settlement.submittedAt).toISOString().split('T')[0] === filter.date
    return matchesName && matchesStatus && matchesDate
  })

  const sortedRequests = filtered.sort((a, b) => {
    if (a.status.includes('Pending') && !b.status.includes('Pending')) return -1
    if (!a.status.includes('Pending') && b.status.includes('Pending')) return 1
    return new Date(b.submittedAt) - new Date(a.submittedAt)
  })

  const paginatedRequests = sortedRequests.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  )

  const calculateTotalAmount = (expenseItems) => {
    return expenseItems.reduce((sum, item) => {
      const amount = Number(item['Amount (₹)']) || 0
      return sum + amount
    }, 0)
  }

  const getStatusBadgeClass = (status) => {
    if (status.includes('Rejected')) return 'bg-red-100 text-red-800'
    if (status.includes('Approved')) return 'bg-green-100 text-green-800'
    if (status.includes('Clarification')) return 'bg-purple-100 text-purple-800'
    return 'bg-yellow-100 text-yellow-800'
  }

  const shouldShowActions = (settlement) => {
    return (
      settlement.status.includes('Pending VP Operations Approval') ||
      settlement.status.includes('Clarification Submitted')
    )
  }

  if (!currentUser) {
    return <div className="text-center p-8">Loading...</div>
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-6 text-green-600">
        VP Operations Review - {currentUser.username}
      </h2>

      <div className="overflow-x-auto">
        <ManagerFilter filter={filter} setFilter={setFilter} />
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3 border">#</th>
              <th className="p-3 border">Employee</th>
              <th className="p-3 border">Date</th>
              <th className="p-3 border">Excel File</th>
              <th className="p-3 border">Attachments</th>
              <th className="p-3 border">Amount</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Remarks</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedRequests.map((req, index) => (
              <tr key={req.id} className="border">
                <td className="p-3 border">{(currentPage - 1) * rowsPerPage + index + 1}</td>
                <td className="p-3 border">{req.employeeName}</td>
                <td className="p-3 border">{new Date(req.submittedAt).toLocaleDateString()}</td>

                {/* ✅ Excel File Column */}
                <td className="p-3 border">
                  {req.excelFile ? (
                    <button
                      onClick={() => viewExcelFile(req.excelFile)}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                      title="Open Excel File in New Tab"
                    >
                      <AiOutlineEye size={18} />
                      <span className="underline">{req.excelFile.name || 'Excel File'}</span>
                    </button>
                  ) : (
                    <span className="text-gray-400">No file</span>
                  )}
                </td>

                {/* ✅ Attachments Column */}
                <td className="p-3 border">
                  <div className="space-y-1">
                    {req.attachments && req.attachments.length > 0 ? (
                      req.attachments.map((attachment, idx) => (
                        <button
                          key={idx}
                          onClick={() => viewAttachment(attachment)}
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 w-full text-left"
                          title={`View ${attachment.name}`}
                        >
                          <AiOutlineEye size={16} />
                          <span className="underline text-sm truncate">
                            {attachment.name || `Attachment ${idx + 1}`}
                          </span>
                        </button>
                      ))
                    ) : (
                      <span className="text-gray-400">No attachments</span>
                    )}
                  </div>
                </td>

                <td className="p-3 border">₹{calculateTotalAmount(req.expenseItems).toFixed(2)}</td>
                <td className="p-3 border">
                  <span className={`px-2 py-1 rounded text-xs ${getStatusBadgeClass(req.status)}`}>
                    {req.status}
                  </span>
                  {req.rejectionReason && (
                    <AiOutlineEye
                      className="inline ml-2 text-blue-600 cursor-pointer"
                      onClick={() => setClarificationData(req)}
                      title="View Details"
                    />
                  )}
                </td>
                <td className="p-3 border text-sm">{req.rejectionReason || '-'}</td>
                <td className="p-3 border">
                  {shouldShowActions(req) && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(req.id)}
                        className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded text-xs"
                        title="Approve"
                      >
                        <AiOutlineCheck size={14} /> Approve
                      </button>
                      <button
                        onClick={() => setSelectedRejectId(req.id)}
                        className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded text-xs"
                        title="Reject"
                      >
                        <AiOutlineClose size={14} /> Reject
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {paginatedRequests.length === 0 && (
          <div className="text-center p-8 text-gray-500">No settlements found for review.</div>
        )}

        {filtered.length > rowsPerPage && (
          <div className="flex justify-end items-center mt-4 gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {Math.ceil(filtered.length / rowsPerPage)}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(prev + 1, Math.ceil(filtered.length / rowsPerPage))
                )
              }
              disabled={currentPage === Math.ceil(filtered.length / rowsPerPage)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}

        <RemarkModal
          isOpen={selectedRejectId !== null}
          onClose={() => {
            setSelectedRejectId(null)
            setRemarkInput('')
          }}
          onSubmit={() => handleReject(selectedRejectId)}
          remark={remarkInput}
          setRemark={setRemarkInput}
          title="Enter Rejection Reason"
        />

        <ManagerClarificationModal
          isOpen={!!clarificationData}
          onClose={() => setClarificationData(null)}
          data={{
            ...clarificationData,
            rejectionHistory: clarificationData?.history?.find(
              (h) => h.action.includes('rejected') && !h.action.includes('after-clarification')
            ),
            clarificationHistory: clarificationData?.history?.find((h) =>
              h.action.includes('clarification')
            ),
          }}
          onApprove={() => handleApprove(clarificationData.id)}
          onReject={() => {
            setSelectedRejectId(clarificationData.id)
            setClarificationData(null)
          }}
        />
      </div>
    </div>
  )
}

export default VPReview

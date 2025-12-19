import React, { useRef, useState, useEffect } from 'react'
import PaymentEntriesFilter from '../Components/PaymentEntriesFilter'
import AERejectionModal from '../Components/AERejectionModal'
import GLMappingModal from '../Components/GLMappingModal'
import { toast } from 'react-toastify'
import * as XLSX from 'xlsx'
import SalaryPaymentTab from '../Components/SalaryPaymentTab'
import AETabNavigation from '../Components/AETabNavigation'
import MonthLockTabContent from '../Components/MonthLockTabContent'

export default function AEPendingRequestsPage() {
  // Tab state
  const [activeTab, setActiveTab] = useState('monthLock')

  // Initialize state with data from localStorage
  const [payrollBatches, setPayrollBatches] = useState([])
  const currentUser = JSON.parse(localStorage.getItem('user')) || { username: 'ae1', role: 'ae' }

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedBatches = JSON.parse(localStorage.getItem('salaryPayments')) || []
    const filteredBatches = savedBatches
      .filter((batch) => batch.assignedTo === currentUser.username)
      .map((batch) => ({ ...batch, history: batch.history || [] }))
    setPayrollBatches(filteredBatches)
  }, [currentUser.username])

  // Save to localStorage whenever payrollBatches changes
  useEffect(() => {
    const allPayments = JSON.parse(localStorage.getItem('salaryPayments')) || []
    const updatedPayments = allPayments.map((payment) => {
      const updatedBatch = payrollBatches.find((b) => b.id === payment.id)
      return updatedBatch || payment
    })
    localStorage.setItem('salaryPayments', JSON.stringify(updatedPayments))
  }, [payrollBatches])

  // Rest of your existing state
  const [filters, setFilters] = useState({ name: '', code: '', status: 'All' })
  const [currentPage, setCurrentPage] = useState(1)
  const entriesPerPage = 5
  const [expandedBatch, setExpandedBatch] = useState(null)
  const [editingAmount, setEditingAmount] = useState({})
  const fileInputRef = useRef(null)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [currentRejectId, setCurrentRejectId] = useState(null)
  const [selectedIds, setSelectedIds] = useState([])

  // GL MAPPING MODAL STATE
  const [showGLMappingModal, setShowGLMappingModal] = useState(false)
  const [approvedBatchData, setApprovedBatchData] = useState(null)
  const [approvedBatches, setApprovedBatches] = useState([])

  // For Sorting
  const getStatusOrder = (status) => {
    switch (status) {
      case 'Pending Approval':
        return 1
      case 'Approved':
        return 2
      case 'Rejected':
        return 3
      default:
        return 4
    }
  }

  // Function to calculate payroll summary from employee details
  const calculatePayrollSummary = (employeeDetails) => {
    if (!employeeDetails || employeeDetails.length === 0) {
      return {
        grossAmount: 0,
        totalDeductions: 0,
        netPayable: 0,
        pfEmployee: 0,
        esicEmployee: 0,
        pt: 0,
        employeeCount: 0,
      }
    }

    let grossAmount = 0
    let totalDeductions = 0
    let netPayable = 0
    let pfEmployee = 0
    let esicEmployee = 0
    let pt = 0
    const employeeCount = employeeDetails.length

    employeeDetails.forEach((emp) => {
      grossAmount += Number(emp['GROSS AMT']) || 0
      totalDeductions += Number(emp['TOTALDEDUCTION']) || 0
      netPayable += Number(emp['NETPAYABLE']) || 0
      pfEmployee += Number(emp['PF']) || 0
      esicEmployee += Number(emp['ESIC']) || 0
      pt += Number(emp['PT']) || 0
    })

    return {
      grossAmount,
      totalDeductions,
      netPayable,
      pfEmployee,
      esicEmployee,
      pt,
      employeeCount,
    }
  }

  // Filter by payroll period and status
  const filteredBatches = payrollBatches.filter((batch) => {
    const matchStatus = filters.status === 'All' || batch.status === filters.status
    const matchName = batch.payrollPeriod.toLowerCase().includes(filters.name.toLowerCase())
    const matchCode = batch.id.toLowerCase().includes(filters.code.toLowerCase())
    return matchStatus && matchName && matchCode
  })

  // Sort the filtered batches by status order before paginating
  const sortedBatches = [...filteredBatches].sort((a, b) => {
    return getStatusOrder(a.status) - getStatusOrder(b.status)
  })

  const totalPages = Math.ceil(sortedBatches.length / entriesPerPage)
  const paginatedBatches = sortedBatches.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  )

  // Convert your data structure to match the table display with payroll GL data
  const getTableData = (batch) => {
    const summary = calculatePayrollSummary(batch.employeeDetails)

    return {
      id: batch.id,
      batchName: `${batch.payrollPeriod} - ${batch.id.slice(-4)}`,
      employeeCount: summary.employeeCount,
      grossAmount: summary.grossAmount,
      totalDeductions: summary.totalDeductions,
      netPayable: summary.netPayable,
      pfEmployee: summary.pfEmployee,
      esicEmployee: summary.esicEmployee,
      pt: summary.pt,
      status: batch.status,
      excelFileName: `salary_batch_${batch.id}.xlsx`,
      employees:
        batch.employeeDetails?.map((emp) => ({
          empCode: emp['EMPCODE'] || emp['BENEFICIARY A/C NO']?.slice(-6),
          name: emp['FULLNAME'] || emp['NARRATION/NAME (NOT MORE THAN 20)'],
          grossAmount: emp['GROSS AMT'] || 0,
          totalDeductions: emp['TOTALDEDUCTION'] || 0,
          netPayable: emp['NETPAYABLE'] || emp['DEBIT AMT'] || 0,
          basic: emp['BASIC'] || 0,
          hra: emp['HRA'] || 0,
          conveyance: emp['CONVEYANCE'] || 0,
          pf: emp['PF'] || 0,
          esic: emp['ESIC'] || 0,
          pt: emp['PT'] || 0,
          account: emp['BANK ACCOUNT NO AS PER EMPLOYEE'] || emp['BENEFICIARY A/C NO'],
          ifsc: emp['IFS CODE AS PER EMPLOYEE'] || emp['IFSC CODE'],
          designation: emp['DESIGNATIONNAME'] || '',
        })) || [],
    }
  }

  // Handle batch expansion
  const handleBatchClick = (batchId) => {
    setExpandedBatch(expandedBatch === batchId ? null : batchId)
  }

  // Handle amount editing
  const handleAmountEdit = (batchId, newAmount) => {
    setEditingAmount((prev) => ({
      ...prev,
      [batchId]: newAmount,
    }))
  }

  const saveAmountEdit = (batchId) => {
    const newNetPayable = parseFloat(editingAmount[batchId])
    if (isNaN(newNetPayable) || newNetPayable <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    setPayrollBatches((prev) =>
      prev.map((batch) => {
        if (batch.id === batchId) {
          const currentTableData = getTableData(batch)

          // Guard against divide-by-zero
          if (currentTableData.netPayable <= 0) {
            toast.error('Cannot update amount: current net payable is zero or invalid')
            return batch
          }

          const ratio = newNetPayable / currentTableData.netPayable
          const updatedEmployeeDetails = batch.employeeDetails.map((emp) => {
            const currentNetPayable = emp['NETPAYABLE'] || emp['DEBIT AMT'] || 0
            return {
              ...emp,
              NETPAYABLE: currentNetPayable * ratio,
              'DEBIT AMT': (emp['DEBIT AMT'] || 0) * ratio,
            }
          })

          return {
            ...batch,
            totalAmount: newNetPayable,
            employeeDetails: updatedEmployeeDetails,
            bankFile: {
              ...batch.bankFile,
              'DEBIT AMT': newNetPayable,
            },
          }
        }
        return batch
      })
    )

    setEditingAmount((prev) => {
      const updated = { ...prev }
      delete updated[batchId]
      return updated
    })

    toast.success('Net payable amount updated successfully!')
  }

  const cancelAmountEdit = (batchId) => {
    setEditingAmount((prev) => {
      const updated = { ...prev }
      delete updated[batchId]
      return updated
    })
  }

  // Download Excel file for editing with all salary heads
  const handleDownloadExcel = (batch) => {
    const employeeData = batch.employeeDetails || []

    const ws = XLSX.utils.json_to_sheet(employeeData)
    ws['!cols'] = Array(Object.keys(employeeData[0] || {}).length).fill({ wch: 15 })

    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Employee_Data')

    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const file = new Blob([excelBuffer], { type: 'application/octet-stream' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(file)
    link.download = `salary_batch_${batch.id}.xlsx`
    link.click()

    toast.success('Payroll Excel file downloaded for editing!')
  }

  // Delete batch functionality
  const handleDeleteBatch = (batchId) => {
    if (
      window.confirm(
        'Are you sure you want to delete this payroll batch?  This action cannot be undone.'
      )
    ) {
      setPayrollBatches((prev) => prev.filter((batch) => batch.id !== batchId))
      toast.success('Payroll batch deleted successfully!')
    }
  }

  // File reupload functionality
  const handleReupload = (batchId) => {
    fileInputRef.current.dataset.batchId = batchId
    fileInputRef.current.click()
  }

  const handleFileReupload = (e) => {
    const file = e.target.files[0]
    const batchId = e.target.dataset.batchId

    if (!file) return

    const reader = new FileReader()
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target.result)
        const wb = XLSX.read(data, { type: 'array' })
        const wsname = wb.SheetNames[0]
        const ws = wb.Sheets[wsname]
        const parsedData = XLSX.utils.sheet_to_json(ws, { defval: '' })

        const summary = calculatePayrollSummary(parsedData)

        setPayrollBatches((prev) =>
          prev.map((batch) => {
            if (batch.id === batchId) {
              return {
                ...batch,
                employeeDetails: parsedData,
                employeeCount: summary.employeeCount,
                totalAmount: summary.netPayable,
                bankFile: {
                  ...batch.bankFile,
                  'DEBIT AMT': summary.netPayable,
                },
                history: [
                  ...batch.history,
                  {
                    action: 'reuploaded',
                    by: currentUser.username,
                    date: new Date().toISOString(),
                    comments: 'Payroll file reuploaded',
                  },
                ],
              }
            }
            return batch
          })
        )

        toast.success('Payroll Excel file reuploaded successfully!')
      } catch (error) {
        toast.error('Error processing the payroll file: ' + error.message)
      }
    }
    reader.readAsArrayBuffer(file)

    e.target.value = ''
  }

  // Multiple Select and Approve
  const handleSelect = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]))
  }

  const handleSelectAll = () => {
    const allIds = paginatedBatches.map((batch) => batch.id)
    const allSelected = allIds.every((id) => selectedIds.includes(id))
    setSelectedIds(allSelected ? [] : allIds)
  }

  // Handle bulk approve with GL Mapping Modal
  const handleBulkApprove = () => {
    if (selectedIds.length === 0) {
      toast.warn('Please select at least one payroll batch to approve.')
      return
    }

    const approvedBatchesData = payrollBatches.filter((batch) => selectedIds.includes(batch.id))

    setApprovedBatches(approvedBatchesData)
    setApprovedBatchData(null)
    setShowGLMappingModal(true)

    toast.info(
      `Open GL Mapping for ${selectedIds.length} batches. Click "Approve" in the modal to confirm approval.`
    )
  }

  // Handle single approval with GL Mapping Modal
  const handleApprove = (id) => {
    const approvedBatch = payrollBatches.find((batch) => batch.id === id)

    setApprovedBatchData(approvedBatch)
    setApprovedBatches([])
    setShowGLMappingModal(true)

    toast.info('Open GL Mapping modal.  Click "Approve" in the modal to confirm the approval.')
  }

  // Callback invoked by the modal when user explicitly clicks Approve inside the modal
  const handleApproveFromModal = (batchIds = []) => {
    if (!Array.isArray(batchIds) || batchIds.length === 0) {
      toast.warn('No batches provided to approve.')
      return
    }

    setPayrollBatches((prev) =>
      prev.map((batch) => {
        if (batchIds.includes(batch.id)) {
          return {
            ...batch,
            status: 'Approved',
            history: [
              ...(batch.history || []),
              {
                action: 'approved',
                by: currentUser.username,
                date: new Date().toISOString(),
                comments: 'Approved by AE via GL Modal',
              },
            ],
          }
        }
        return batch
      })
    )

    setSelectedIds((prev) => prev.filter((id) => !batchIds.includes(id)))

    toast.success(`${batchIds.length} payroll batch(es) marked as Approved.`)
  }

  const openRejectModal = (id) => {
    setCurrentRejectId(id)
    setShowRejectModal(true)
  }

  const confirmReject = () => {
    setPayrollBatches((prev) =>
      prev.map((batch) => {
        if (batch.id === currentRejectId) {
          return {
            ...batch,
            status: 'Rejected',
            reason: rejectionReason,
            history: [
              ...batch.history,
              {
                action: 'rejected',
                by: currentUser.username,
                date: new Date().toISOString(),
                comments: rejectionReason,
              },
            ],
          }
        }
        return batch
      })
    )

    setShowRejectModal(false)
    setRejectionReason('')
    setCurrentRejectId(null)
    toast.error('Payroll Batch Rejected!')
  }

  // Close GL Mapping modal
  const closeGLMappingModal = () => {
    setShowGLMappingModal(false)
    setApprovedBatchData(null)
    setApprovedBatches([])
  }

  // Handle GL Mapping Save
  const handleGLMappingSave = () => {
    const savedBatches = JSON.parse(localStorage.getItem('salaryPayments')) || []
    const filteredBatches = savedBatches.filter(
      (batch) => batch.assignedTo === currentUser.username
    )
    setPayrollBatches(filteredBatches)

    toast.success('GL Mapping completed successfully!')
    closeGLMappingModal()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 md:py-6">
      <div className="max-w-7xl mx-auto px-3 md:px-4 lg:px-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-4 md:mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-green-700 mb-2">
            Account Executive Dashboard
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Review and manage payment requests and month locks
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-4 md:mb-6">
          <AETabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Tab Content */}
        {activeTab === 'salary' ? (
          <SalaryPaymentTab />
        ) : (
          <MonthLockTabContent
            filters={filters}
            setFilters={setFilters}
            paginatedBatches={paginatedBatches}
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            selectedIds={selectedIds}
            handleSelectAll={handleSelectAll}
            handleSelect={handleSelect}
            getTableData={getTableData}
            expandedBatch={expandedBatch}
            handleBatchClick={handleBatchClick}
            editingAmount={editingAmount}
            handleAmountEdit={handleAmountEdit}
            saveAmountEdit={saveAmountEdit}
            cancelAmountEdit={cancelAmountEdit}
            handleDownloadExcel={handleDownloadExcel}
            handleReupload={handleReupload}
            handleDeleteBatch={handleDeleteBatch}
            handleFileReupload={handleFileReupload}
            fileInputRef={fileInputRef}
            handleApprove={handleApprove}
            openRejectModal={openRejectModal}
            handleBulkApprove={handleBulkApprove}
            showRejectModal={showRejectModal}
            setShowRejectModal={setShowRejectModal}
            setRejectionReason={setRejectionReason}
            confirmReject={confirmReject}
            showGLMappingModal={showGLMappingModal}
            closeGLMappingModal={closeGLMappingModal}
            handleApproveFromModal={handleApproveFromModal}
            handleGLMappingSave={handleGLMappingSave}
            approvedBatchData={approvedBatchData}
            approvedBatches={approvedBatches}
          />
        )}
      </div>
    </div>
  )
}

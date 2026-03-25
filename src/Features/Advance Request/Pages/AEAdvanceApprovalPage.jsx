/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from 'react'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import AEFilter from '../Components/AEFilter'
import AERequestTable from '../Components/AERequestTable'
import AdvanceRequestPaymentEntryModal from '../Components/AdvanceRequestPaymentEntryModal'
import AEBankSelectionModal from '../Components/AEBankSelectionModal'
// Import accounting helper functions
import {
  processAdvanceApproval,
  processMultipleAdvanceApprovals,
} from '../../Master/utils/accountingHelpers'

export default function AEAdvanceApprovalPage() {
  const [requests, setRequests] = useState([])
  const [filter, setFilter] = useState({ name: '', empId: '', date: '', requestId: '' })

  // Modal states
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [isBankModalOpen, setIsBankModalOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [approvedRequests, setApprovedRequests] = useState([])
  const [pendingApprovalData, setPendingApprovalData] = useState(null)
  const [accountingResult, setAccountingResult] = useState(null)

  // Add loading state
  const [isProcessing, setIsProcessing] = useState(false)

  // Component mount tracking for cleanup
  const isMounted = useRef(true)

  useEffect(() => {
    // Set mounted flag
    isMounted.current = true

    loadRequests()

    // Cleanup on unmount
    return () => {
      isMounted.current = false
    }
  }, [])

  const loadRequests = () => {
    try {
      const allRequests = JSON.parse(localStorage.getItem('advanceRequests')) || []
      const aeRequests = allRequests.filter(
        (req) =>
          req.status === 'Pending AE Approval' ||
          req.status === 'Approved' ||
          req.status === 'Rejected by AE'
      )

      if (isMounted.current) {
        setRequests(aeRequests)
      }
    } catch (error) {
      console.error('Error loading requests:', error)
      toast.error('Failed to load requests')
    }
  }

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

  // Opens bank selection modal first
  const handleApprove = (submittedAt) => {
    try {
      const allRequests = JSON.parse(localStorage.getItem('advanceRequests')) || []
      const requestIndex = allRequests.findIndex((req) => req.submittedAt === submittedAt)

      if (requestIndex === -1) {
        toast.error('Request not found')
        return
      }

      const request = allRequests[requestIndex]

      // Check VP deadline
      if (request.isVPRequest && !request.vpApprovedBeforeDeadline) {
        toast.error('Cannot approve: VP request was approved after 15:59 deadline')
        return
      }

      // Store request data and open bank selection modal
      setPendingApprovalData({ type: 'single', request, requestIndex })
      setIsBankModalOpen(true)
    } catch (error) {
      console.error('Error in handleApprove:', error)
      toast.error('Failed to initiate approval process')
    }
  }

  // Handle multiple approvals
  const handleApproveMultiple = (requestsData) => {
    try {
      const allRequests = JSON.parse(localStorage.getItem('advanceRequests')) || []

      const requestsToApprove = requestsData
        .map((submittedAt) => {
          const index = allRequests.findIndex((req) => req.submittedAt === submittedAt)
          return index !== -1 ? { request: allRequests[index], index } : null
        })
        .filter((item) => item !== null)
        .filter((item) => !item.request.isVPRequest || item.request.vpApprovedBeforeDeadline)

      if (requestsToApprove.length === 0) {
        toast.error('No eligible requests to approve')
        return
      }

      // Store multiple requests and open bank selection modal
      setPendingApprovalData({ type: 'multiple', requests: requestsToApprove })
      setIsBankModalOpen(true)
    } catch (error) {
      console.error('Error in handleApproveMultiple:', error)
      toast.error('Failed to initiate batch approval')
    }
  }

  // Called after bank is selected - WITH PROPER ERROR HANDLING
  const handleBankSelected = async (bankData) => {
    if (!pendingApprovalData) return

    setIsProcessing(true)

    try {
      const allRequests = JSON.parse(localStorage.getItem('advanceRequests')) || []
      const approvalTime = new Date()
      const isBeforeDeadline =
        approvalTime.getHours() < 19 ||
        (approvalTime.getHours() === 19 && approvalTime.getMinutes() <= 59)

      let updatedRequests = [...allRequests]
      const approvedRequestsData = []
      let accountingProcessingResult = null

      if (pendingApprovalData.type === 'single') {
        // ========================================
        // SINGLE APPROVAL WITH PROPER TRANSACTION HANDLING
        // ========================================
        const { request, requestIndex } = pendingApprovalData

        console.log('🔄 Processing single approval...')
        console.log('Request:', request)
        console.log('Bank:', bankData)

        // Step 1: Process accounting FIRST (before changing status)
        accountingProcessingResult = await processAdvanceApproval(
          {
            ...request,
            status: 'Approved', // Temporary for validation
            approvedAt: approvalTime.toISOString(),
            aeApprovedBy: JSON.parse(localStorage.getItem('user')).username,
            aeApprovedBeforeDeadline: isBeforeDeadline,
            bankCode: bankData.bankCode,
            bankName: bankData.bankName,
            bankId: bankData.bankId,
          },
          bankData
        )

        // Step 2: Check if accounting succeeded
        if (!accountingProcessingResult.success) {
          throw new Error(accountingProcessingResult.message)
        }

        console.log('✅ Accounting processed successfully:', accountingProcessingResult)

        // Step 3: NOW update request status (only after successful accounting)
        updatedRequests[requestIndex] = {
          ...request,
          status: 'Approved',
          approvedAt: approvalTime.toISOString(),
          aeApprovedBy: JSON.parse(localStorage.getItem('user')).username,
          aeApprovedBeforeDeadline: isBeforeDeadline,
          bankCode: bankData.bankCode,
          bankName: bankData.bankName,
          bankId: bankData.bankId,
          // Add accounting details
          voucherNo: accountingProcessingResult.voucherNo,
          transactionId: accountingProcessingResult.transactionId,
          glCode: accountingProcessingResult.employeeGLCode,
        }

        approvedRequestsData.push(updatedRequests[requestIndex])

        // Step 4: Save to localStorage
        try {
          localStorage.setItem('advanceRequests', JSON.stringify(updatedRequests))
        } catch (storageError) {
          console.error('❌ Failed to save to localStorage:', storageError)
          throw new Error('Failed to save approval. Please try again.')
        }

        // Step 5: Update local state (only if component is still mounted)
        if (isMounted.current) {
          const filteredRequests = updatedRequests.filter(
            (req) =>
              req.status === 'Pending AE Approval' ||
              req.status === 'Approved' ||
              req.status === 'Rejected by AE'
          )
          setRequests(filteredRequests)

          // Store accounting result and show payment modal
          setAccountingResult(accountingProcessingResult)
          setSelectedRequest(updatedRequests[requestIndex])
          setApprovedRequests([])
        }

        toast.success(
          isBeforeDeadline
            ? `✅ ${accountingProcessingResult.message} (Same-day processing)`
            : `✅ ${accountingProcessingResult.message} (Next working day)`
        )
      } else if (pendingApprovalData.type === 'multiple') {
        // ========================================
        // BATCH APPROVAL WITH PROPER TRANSACTION HANDLING
        // ========================================
        console.log(
          `🔄 Processing batch approval for ${pendingApprovalData.requests.length} requests...`
        )

        // Step 1: Prepare requests for batch processing
        const requestsArray = pendingApprovalData.requests.map((r) => ({
          ...r.request,
          status: 'Approved', // Temporary for validation
          approvedAt: approvalTime.toISOString(),
          aeApprovedBy: JSON.parse(localStorage.getItem('user')).username,
          aeApprovedBeforeDeadline: isBeforeDeadline,
          bankCode: bankData.bankCode,
          bankName: bankData.bankName,
          bankId: bankData.bankId,
        }))

        // Step 2: Process batch accounting FIRST
        accountingProcessingResult = await processMultipleAdvanceApprovals(requestsArray, bankData)

        // Step 3: Check if batch accounting succeeded
        if (!accountingProcessingResult.success) {
          throw new Error(accountingProcessingResult.message)
        }

        console.log('✅ Batch accounting processed:', accountingProcessingResult)

        // Step 4: Update all requests (only after successful accounting)
        pendingApprovalData.requests.forEach(({ request, index }) => {
          updatedRequests[index] = {
            ...request,
            status: 'Approved',
            approvedAt: approvalTime.toISOString(),
            aeApprovedBy: JSON.parse(localStorage.getItem('user')).username,
            aeApprovedBeforeDeadline: isBeforeDeadline,
            bankCode: bankData.bankCode,
            bankName: bankData.bankName,
            bankId: bankData.bankId,
            // Add accounting details
            voucherNo: accountingProcessingResult.voucherNo,
            transactionId: accountingProcessingResult.transactionId,
          }

          approvedRequestsData.push(updatedRequests[index])
        })

        // Step 5: Save to localStorage
        try {
          localStorage.setItem('advanceRequests', JSON.stringify(updatedRequests))
        } catch (storageError) {
          console.error('❌ Failed to save to localStorage:', storageError)
          throw new Error('Failed to save batch approval. Please try again.')
        }

        // Step 6: Update local state (only if component is still mounted)
        if (isMounted.current) {
          const filteredRequests = updatedRequests.filter(
            (req) =>
              req.status === 'Pending AE Approval' ||
              req.status === 'Approved' ||
              req.status === 'Rejected by AE'
          )
          setRequests(filteredRequests)

          // Store accounting result and show payment modal
          setAccountingResult(accountingProcessingResult)
          setSelectedRequest(null)
          setApprovedRequests(approvedRequestsData)
        }

        toast.success(
          `✅ ${approvedRequestsData.length} requests approved - ${accountingProcessingResult.message}`
        )
      }

      // Close bank modal and open payment modal
      if (isMounted.current) {
        setIsBankModalOpen(false)
        setIsPaymentModalOpen(true)
        setPendingApprovalData(null)
      }
    } catch (error) {
      console.error('❌ Error during approval process:', error)
      toast.error(`Approval failed: ${error.message}`)

      // Reset states on error (only if component is mounted)
      if (isMounted.current) {
        setIsBankModalOpen(false)
        setPendingApprovalData(null)
        setAccountingResult(null)
      }
    } finally {
      if (isMounted.current) {
        setIsProcessing(false)
      }
    }
  }

  const handleReject = (submittedAt, reason) => {
    try {
      const allRequests = JSON.parse(localStorage.getItem('advanceRequests')) || []
      const requestIndex = allRequests.findIndex((req) => req.submittedAt === submittedAt)

      if (requestIndex === -1) {
        toast.error('Request not found')
        return
      }

      const updatedRequests = [...allRequests]
      updatedRequests[requestIndex] = {
        ...updatedRequests[requestIndex],
        status: 'Rejected by AE',
        remarks: reason,
        rejectedAt: new Date().toISOString(),
        aeRejectedBy: JSON.parse(localStorage.getItem('user')).username,
      }

      localStorage.setItem('advanceRequests', JSON.stringify(updatedRequests))

      const filteredRequests = updatedRequests.filter(
        (req) =>
          req.status === 'Pending AE Approval' ||
          (req.status === 'Rejected by AE' && req.clarification) ||
          (req.status === 'Approved' && req.currentLevel === 'account-executive')
      )

      if (isMounted.current) {
        setRequests(filteredRequests)
      }

      toast.error('Request Rejected')
    } catch (error) {
      console.error('Error in handleReject:', error)
      toast.error('Failed to reject request')
    }
  }

  const handleDownloadComplete = (downloadedRequestIds) => {
    try {
      const allRequests = JSON.parse(localStorage.getItem('advanceRequests')) || []
      const remainingRequests = allRequests.filter(
        (req) => !downloadedRequestIds.includes(req.submittedAt)
      )

      localStorage.setItem('advanceRequests', JSON.stringify(remainingRequests))

      const filteredRequests = remainingRequests.filter(
        (req) =>
          req.status === 'Pending AE Approval' ||
          req.status === 'Approved' ||
          req.status === 'Rejected by AE'
      )

      if (isMounted.current) {
        setRequests(filteredRequests)
      }

      toast.success(
        `${downloadedRequestIds.length} approved requests downloaded and removed from table`
      )
    } catch (error) {
      console.error('Error in handleDownloadComplete:', error)
      toast.error('Failed to process download')
    }
  }

  const filteredRequests = requests.filter(
    (r) =>
      r.employeeName.toLowerCase().includes(filter.name.toLowerCase()) &&
      r.employeeId.toLowerCase().includes(filter.empId.toLowerCase()) &&
      (filter.date === '' || r.requestDate.includes(filter.date)) &&
      (filter.requestId === '' ||
        (r.requestId && r.requestId.toLowerCase().includes(filter.requestId.toLowerCase())))
  )

  const getCurrentTimeStatus = () => {
    const now = new Date()
    const isBeforeDeadline =
      now.getHours() < 15 || (now.getHours() === 15 && now.getMinutes() <= 59)
    return isBeforeDeadline
  }

  const closePaymentModal = () => {
    if (isMounted.current) {
      setIsPaymentModalOpen(false)
      setSelectedRequest(null)
      setApprovedRequests([])
      setAccountingResult(null)
    }
  }

  const closeBankModal = () => {
    if (isMounted.current) {
      setIsBankModalOpen(false)
      setPendingApprovalData(null)
    }
  }

  return (
    <div className="px-4 py-6">

      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-2xl px-6 py-5 mb-5 shadow flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">💳 AE Dashboard – Advance Requests</h1>
          <p className="text-green-100 text-sm mt-0.5">Approve or reject advance requests from all roles</p>
        </div>
        <div className={`text-sm px-4 py-1.5 rounded-full font-semibold border ${
          getCurrentTimeStatus() ? 'bg-white text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'
        }`}>
          {getCurrentTimeStatus()
            ? '🟢 Before 15:59 – Same day processing'
            : '🔴 After 15:59 – Next day processing only'}
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-xl border border-green-100 shadow-sm px-4 py-3 mb-5">
        <AEFilter filter={filter} setFilter={setFilter} />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-green-100 shadow-sm overflow-hidden">
        <AERequestTable
          data={filteredRequests}
          onApprove={handleApprove}
          onReject={handleReject}
          onDownloadComplete={handleDownloadComplete}
          onApproveMultiple={handleApproveMultiple}
          getEmployeeOSBalance={getEmployeeOSBalance}
        />
      </div>

      {/* Bank Selection Modal */}
      <AEBankSelectionModal
        isOpen={isBankModalOpen}
        onClose={closeBankModal}
        onBankSelect={handleBankSelected}
        requestData={
          pendingApprovalData?.type === 'single'
            ? pendingApprovalData.request
            : pendingApprovalData?.requests.map((r) => r.request)
        }
      />

      {/* Payment Entry Modal */}
      <AdvanceRequestPaymentEntryModal
        isOpen={isPaymentModalOpen}
        onClose={closePaymentModal}
        requestData={selectedRequest}
        approvedRequests={approvedRequests}
        accountingResult={accountingResult}
      />

      {/* Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[70] flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-4 shadow-xl">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            <p className="text-gray-700 font-semibold">Processing approval...</p>
            <p className="text-sm text-gray-400">Please wait, posting accounting entries</p>
          </div>
        </div>
      )}
    </div>
  )
}

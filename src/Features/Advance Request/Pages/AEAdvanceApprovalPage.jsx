/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from 'react'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useDispatch, useSelector } from 'react-redux'
import AEFilter from '../Components/AEFilter'
import AERequestTable from '../Components/AERequestTable'
import AdvanceRequestPaymentEntryModal from '../Components/AdvanceRequestPaymentEntryModal'
import AEBankSelectionModal from '../Components/AEBankSelectionModal'
import {
  fetchAEApprovalRequests,
  aeApprove,
  aeApproveBatchThunk,
  aeReject,
  selectAERequests,
  selectIsBeforeDeadline,
  selectLoading,
  selectErrors,
} from '../../../store/slices/advanceRequestSlice'

export default function AEAdvanceApprovalPage() {
  const dispatch = useDispatch()
  const aeRequestsFromStore = useSelector(selectAERequests)
  const isBeforeDeadline = useSelector(selectIsBeforeDeadline)
  const loading = useSelector(selectLoading)
  const errors = useSelector(selectErrors)

  const [filter, setFilter] = useState({ name: '', empId: '', date: '', requestId: '' })

  // Modal states (kept local — UI logic, not business state)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [isBankModalOpen, setIsBankModalOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [approvedRequests, setApprovedRequests] = useState([])
  const [pendingApprovalData, setPendingApprovalData] = useState(null)
  const [accountingResult, setAccountingResult] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const isMounted = useRef(true)

  // ── Load on mount ─────────────────────────────────────────────────────────
  useEffect(() => {
    isMounted.current = true
    dispatch(fetchAEApprovalRequests())
    return () => { isMounted.current = false }
  }, [dispatch])

  // ── Toast on errors ────────────────────────────────────────────────────────
  useEffect(() => {
    if (errors.fetchAERequests) toast.error(errors.fetchAERequests)
    if (errors.reject) toast.error(errors.reject)
  }, [errors.fetchAERequests, errors.reject])

  // ── O/S balance helper (from users localStorage — will come from API response)
  const getEmployeeOSBalance = (employeeId) => {
    try {
      const users = JSON.parse(localStorage.getItem('users')) || []
      const employee = users.find(
        (user) =>
          user.empId === employeeId ||
          user.username === employeeId ||
          (user.empId && user.empId.toString() === employeeId.toString())
      )
      return employee?.osBalance || 0
    } catch {
      return 0
    }
  }

  // ── Single approve → open bank modal ─────────────────────────────────────
  const handleApprove = (id) => {
    try {
      const request = aeRequestsFromStore.find((req) => req.id === id)
      if (!request) { toast.error('Request not found'); return }

      if (request.isVPRequest && !request.vpApprovedBeforeDeadline) {
        toast.error('Cannot approve: VP request was approved after 15:59 deadline')
        return
      }

      setPendingApprovalData({ type: 'single', request })
      setIsBankModalOpen(true)
    } catch (error) {
      toast.error('Failed to initiate approval process')
    }
  }

  // ── Batch approve → open bank modal ──────────────────────────────────────
  const handleApproveMultiple = (ids) => {
    try {
      const requestsToApprove = ids
        .map((id) => {
          const request = aeRequestsFromStore.find((req) => req.id === id)
          return request ? { request } : null
        })
        .filter(Boolean)
        .filter((item) => !item.request.isVPRequest || item.request.vpApprovedBeforeDeadline)

      if (requestsToApprove.length === 0) {
        toast.error('No eligible requests to approve')
        return
      }

      setPendingApprovalData({ type: 'multiple', requests: requestsToApprove })
      setIsBankModalOpen(true)
    } catch {
      toast.error('Failed to initiate batch approval')
    }
  }

  // ── Bank selected → run accounting → save → show payment modal ────────────
  const handleBankSelected = async (bankData) => {
    if (!pendingApprovalData) return
    setIsProcessing(true)

    try {
      const approvalTime = new Date()
      const aeIsBeforeDeadline =
        approvalTime.getHours() < 15 ||
        (approvalTime.getHours() === 15 && approvalTime.getMinutes() <= 59)

      const currentUser = JSON.parse(localStorage.getItem('user')) || {}
      const approvedRequestsData = []

      if (pendingApprovalData.type === 'single') {
        const { request } = pendingApprovalData

        const actionResult = await dispatch(aeApprove({
          id: request.id,
          bankId: bankData.bankId,
          bankCode: bankData.bankCode,
          bankName: bankData.bankName,
          comments: `Disbursing from ${bankData.bankName}`,
          costCenterId: 1
        })).unwrap()

        const approvedRequest = {
          ...request,
          status: 'Approved',
          approvedAt: approvalTime.toISOString(),
          aeApprovedBy: currentUser.emp_name || currentUser.username || 'Ankit Verma',
          aeApprovedBeforeDeadline: aeIsBeforeDeadline,
          bankCode: bankData.bankCode,
          bankName: bankData.bankName,
          bankId: bankData.bankId,
          voucherNo: actionResult.updatedRequest?.accountingDetails?.voucherNo || actionResult.updatedRequest?.voucherNo || actionResult.voucherNo,
          transactionId: actionResult.updatedRequest?.accountingDetails?.transactionId || actionResult.updatedRequest?.transactionId || actionResult.transactionId,
          accountingDetails: actionResult.updatedRequest?.accountingDetails || actionResult.updatedRequest
        }
        approvedRequestsData.push(approvedRequest)

        if (isMounted.current) {
          setSelectedRequest(approvedRequest)
          setApprovedRequests([])
        }

        toast.success(
          aeIsBeforeDeadline
            ? `✅ Advance Approved (Same-day processing)`
            : `✅ Advance Approved (Next working day)`
        )
      } else if (pendingApprovalData.type === 'multiple') {
        const idsToApprove = pendingApprovalData.requests.map((r) => r.request.id)

        const actionResult = await dispatch(aeApproveBatchThunk({
          requestIds: idsToApprove,
          bankId: bankData.bankId,
          bankCode: bankData.bankCode,
          bankName: bankData.bankName,
          comments: 'Batch disbursement approved',
          costCenterId: 1
        })).unwrap()

        pendingApprovalData.requests.forEach(({ request }) => {
          const approvedItem = (actionResult.approvedRequests || []).find(
            (r) =>
              (r.id && request.id && r.id.toString() === request.id.toString()) ||
              (r.requestId && request.requestId && r.requestId.toString().toLowerCase() === request.requestId.toString().toLowerCase())
          )
          approvedRequestsData.push({
            ...request,
            status: 'Approved',
            approvedAt: approvalTime.toISOString(),
            aeApprovedBy: currentUser.emp_name || currentUser.username || 'Ankit Verma',
            aeApprovedBeforeDeadline: aeIsBeforeDeadline,
            bankCode: bankData.bankCode,
            bankName: bankData.bankName,
            bankId: bankData.bankId,
            voucherNo: approvedItem?.voucherNo || approvedItem?.accountingDetails?.voucherNo || request.voucherNo,
            transactionId: approvedItem?.transactionId || approvedItem?.accountingDetails?.transactionId || request.transactionId,
            accountingDetails: approvedItem?.accountingDetails,
          })
        })

        if (isMounted.current) {
          setSelectedRequest(null)
          setApprovedRequests(approvedRequestsData)
        }

        toast.success(`✅ ${approvedRequestsData.length} requests approved successfully`)
      }

      dispatch(fetchAEApprovalRequests())

      if (isMounted.current) {
        setIsBankModalOpen(false)
        setIsPaymentModalOpen(true)
        setPendingApprovalData(null)
      }
    } catch (error) {
      toast.error(`Approval failed: ${error.message || error}`)
      if (isMounted.current) {
        setIsBankModalOpen(false)
        setPendingApprovalData(null)
      }
    } finally {
      if (isMounted.current) setIsProcessing(false)
    }
  }

  // ── Reject → dispatch thunk ────────────────────────────────────────────────
  const handleReject = async (id, reason) => {
    try {
      const request = aeRequestsFromStore.find((req) => req.id === id)
      if (!request) { toast.error('Request not found'); return }

      await dispatch(aeReject({ id: request.id, reason })).unwrap()
      toast.success('Request Rejected by Account Executive')
      dispatch(fetchAEApprovalRequests())
    } catch (error) {
      toast.error(error || 'Failed to reject request')
    }
  }

  // ── Download complete → refresh ────────────────────────────────────────────
  const handleDownloadComplete = (downloadedRequestIds) => {
    dispatch(fetchAEApprovalRequests())
    if (downloadedRequestIds && Array.isArray(downloadedRequestIds)) {
      toast.success(`${downloadedRequestIds.length} requests downloaded and processed`)
    } else {
      toast.success(`Bank upload file downloaded successfully`)
    }
  }

  // ── Filter ─────────────────────────────────────────────────────────────────
  const filteredRequests = aeRequestsFromStore.filter(
    (r) =>
      (r.employeeName || '').toLowerCase().includes(filter.name.toLowerCase()) &&
      (r.employeeId || '').toLowerCase().includes(filter.empId.toLowerCase()) &&
      (filter.date === '' || (r.requestDate || '').includes(filter.date)) &&
      (filter.requestId === '' ||
        (r.requestId && r.requestId.toLowerCase().includes(filter.requestId.toLowerCase())))
  )

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

  const isLoading = loading.fetchAERequests

  return (
    <div className="px-4 py-6">

      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-2xl px-6 py-5 mb-5 shadow flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">💳 AE Dashboard – Advance Requests</h1>
          <p className="text-green-100 text-sm mt-0.5">Approve or reject advance requests from all roles</p>
        </div>
        <div className={`text-sm px-4 py-1.5 rounded-full font-semibold border ${
          isBeforeDeadline ? 'bg-white text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'
        }`}>
          {isBeforeDeadline ? '🟢 Before 15:59 – Same day processing' : '🔴 After 15:59 – Next day processing only'}
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-xl border border-green-100 shadow-sm px-4 py-3 mb-5">
        <AEFilter filter={filter} setFilter={setFilter} />
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600" />
        </div>
      )}

      {/* Table */}
      {!isLoading && (
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
      )}

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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600" />
            <p className="text-gray-700 font-semibold">Processing approval...</p>
            <p className="text-sm text-gray-400">Please wait, posting accounting entries</p>
          </div>
        </div>
      )}
    </div>
  )
}

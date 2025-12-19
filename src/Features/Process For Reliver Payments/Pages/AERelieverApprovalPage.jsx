// pages/AERelieverApprovalPage.jsx
import React, { useEffect, useState, useRef } from 'react'
import { toast } from 'react-toastify'
import FilterBar from '../Components/Filter'
import AEApprovalTable from '../Components/AEApprovalTable'
import RelieverPaymentEntryModal from '../Components/RelieverPaymentEntryModal'
import {
  processRelieverPaymentApproval,
  processMultipleRelieverPayments,
} from '../../Master/utils/accountingHelpers'

export default function AERelieverApprovalPage() {
  const [requests, setRequests] = useState([])
  const [filtered, setFiltered] = useState([])
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedApprovedRequests, setSelectedApprovedRequests] = useState([])
  const [accountingResult, setAccountingResult] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const currentUser = JSON.parse(localStorage.getItem('user'))
  const isMounted = useRef(true)

  useEffect(() => {
    isMounted.current = true
    loadRequests()

    return () => {
      isMounted.current = false
    }
  }, [currentUser?.username])

  const loadRequests = () => {
    try {
      const allRequests = JSON.parse(localStorage.getItem('relieverRequests')) || []

      // Filter requests that are either pending for current user or already processed by current user
      const relevantRequests = allRequests.filter((req) => {
        // Pending requests for current user
        if (
          req.status === 'Pending Account Executive Approval' &&
          req.currentApprover === currentUser.username
        ) {
          return true
        }

        // Approved or rejected requests by current user
        if (
          (req.status === 'Approved' || req.status.includes('Rejected by Account Executive')) &&
          req.history?.some(
            (h) =>
              h.by === currentUser.username &&
              (h.action === 'Approved by Account Executive' ||
                h.action === 'Rejected by Account Executive')
          )
        ) {
          return true
        }

        return false
      })

      // Sort requests: Pending first, then Approved, then Rejected
      const sortedRequests = relevantRequests.sort((a, b) => {
        const getStatusPriority = (status) => {
          if (status === 'Pending Account Executive Approval') return 1
          if (status === 'Approved') return 2
          if (status.includes('Rejected')) return 3
          return 4
        }

        return getStatusPriority(a.status) - getStatusPriority(b.status)
      })

      if (isMounted.current) {
        setRequests(sortedRequests)
        setFiltered(sortedRequests)
      }
    } catch (error) {
      console.error('Error loading requests:', error)
      toast.error('Failed to load requests')
    }
  }

  // Store approved requests in localStorage for Process Payments page
  const storeApprovedRequests = (approvedRequests) => {
    try {
      // Get existing approved requests
      const existingApproved = JSON.parse(localStorage.getItem('relieverapprovedRequests')) || []

      // Add new approved requests
      const updatedApproved = [...existingApproved, ...approvedRequests]

      // Remove duplicates based on request ID
      const uniqueApproved = updatedApproved.filter(
        (req, index, self) => index === self.findIndex((r) => r.id === req.id)
      )

      // Store in localStorage
      localStorage.setItem('relieverapprovedRequests', JSON.stringify(uniqueApproved))

      console.log(`✅ Stored ${approvedRequests.length} approved requests for Process Payments`)
      console.log('Total approved requests in storage:', uniqueApproved.length)
    } catch (error) {
      console.error('Error storing approved requests:', error)
    }
  }

  const updateLocalStorage = (updatedRequests) => {
    const allRequests = JSON.parse(localStorage.getItem('relieverRequests')) || []
    const updatedAllRequests = allRequests.map((req) => {
      const updatedReq = updatedRequests.find((ur) => ur.id === req.id)
      return updatedReq || req
    })
    localStorage.setItem('relieverRequests', JSON.stringify(updatedAllRequests))
  }

  const handleStatusChange = async (id, newStatus, reason = null) => {
    const now = new Date()
    const request = requests.find((req) => req.id === id)

    if (!request) return

    // For rejections, process immediately
    if (newStatus.includes('Rejected')) {
      const historyEntry = {
        action: 'Rejected by Account Executive',
        by: currentUser.username,
        at: now.toISOString(),
        comments: reason || 'Rejected',
      }

      const updatedRequest = {
        ...request,
        status: newStatus,
        currentApprover: request.submittedBy,
        history: [...request.history, historyEntry],
        rejectionReason: reason || null,
        rejectedAt: now.toISOString(),
      }

      const updated = requests.map((req) => (req.id === id ? updatedRequest : req))

      // Re-sort after status change
      const sortedUpdated = updated.sort((a, b) => {
        const getStatusPriority = (status) => {
          if (status === 'Pending Account Executive Approval') return 1
          if (status === 'Approved') return 2
          if (status.includes('Rejected')) return 3
          return 4
        }

        return getStatusPriority(a.status) - getStatusPriority(b.status)
      })

      setRequests(sortedUpdated)
      setFiltered(sortedUpdated)
      updateLocalStorage(sortedUpdated)

      toast.error(`Request #${id.slice(-6)} rejected`)
      return
    }

    // For approvals - process immediately without bank selection
    if (newStatus === 'Approved') {
      setIsProcessing(true)

      try {
        const approvedRequest = requests.find((req) => req.id === id)

        // Process accounting immediately (no bank selection)
        const accountingProcessingResult = await processRelieverPaymentApproval({
          ...approvedRequest,
          approvedAt: now.toISOString(),
          aeApprovedBy: currentUser.username,
        })

        // Check if accounting succeeded
        if (!accountingProcessingResult.success) {
          throw new Error(accountingProcessingResult.message)
        }

        console.log('✅ Reliever accounting processed successfully:', accountingProcessingResult)

        // Update request status to Approved in ALL requests
        const allRequests = JSON.parse(localStorage.getItem('relieverRequests')) || []
        const requestIndexInAll = allRequests.findIndex((r) => r.id === id)

        if (requestIndexInAll !== -1) {
          const historyEntry = {
            action: 'Approved by Account Executive',
            by: currentUser.username,
            at: now.toISOString(),
            comments: 'Approved - Liability created',
          }

          const updatedRequestData = {
            ...allRequests[requestIndexInAll],
            status: 'Approved',
            approvedAt: now.toISOString(),
            aeApprovedBy: currentUser.username,
            history: [...allRequests[requestIndexInAll].history, historyEntry],
            voucherNo: accountingProcessingResult.voucherNo,
            transactionId: accountingProcessingResult.transactionId,
            expenseGLCode: accountingProcessingResult.expenseGLCode,
            liabilityGLCode: accountingProcessingResult.liabilityGLCode,
          }

          allRequests[requestIndexInAll] = updatedRequestData

          // Save back to localStorage
          localStorage.setItem('relieverRequests', JSON.stringify(allRequests))

          // ✅ STORE APPROVED REQUEST FOR PROCESS PAYMENTS
          storeApprovedRequests([updatedRequestData])

          // Update local state
          const updatedLocalRequests = allRequests.filter(
            (req) =>
              req.status === 'Pending Account Executive Approval' ||
              req.status === 'Approved' ||
              req.status.includes('Rejected by Account Executive')
          )

          const sortedUpdated = updatedLocalRequests.sort((a, b) => {
            const getStatusPriority = (status) => {
              if (status === 'Pending Account Executive Approval') return 1
              if (status === 'Approved') return 2
              if (status.includes('Rejected')) return 3
              return 4
            }
            return getStatusPriority(a.status) - getStatusPriority(b.status)
          })

          setRequests(sortedUpdated)
          setFiltered(sortedUpdated)

          // Show success and open payment modal
          setSelectedApprovedRequests([updatedRequestData])
          setAccountingResult(accountingProcessingResult)
          setShowPaymentModal(true)

          toast.success(`Request #${id.slice(-6)} approved - Liability created`)
        }
      } catch (error) {
        console.error('❌ Error during reliever approval:', error)
        toast.error(`Approval failed: ${error.message}`)
      } finally {
        setIsProcessing(false)
      }
    }
  }

  const handleBulkApprove = async (ids) => {
    setIsProcessing(true)

    try {
      const approvedRequests = requests.filter((req) => ids.includes(req.id))

      // Process batch accounting immediately (no bank selection)
      const accountingProcessingResult = await processMultipleRelieverPayments(
        approvedRequests.map((req) => ({
          ...req,
          approvedAt: new Date().toISOString(),
          aeApprovedBy: currentUser.username,
        }))
      )

      // Check if batch accounting succeeded
      if (!accountingProcessingResult.success) {
        throw new Error(accountingProcessingResult.message)
      }

      console.log('✅ Batch reliever accounting processed:', accountingProcessingResult)

      // Update all requests to Approved in ALL requests
      const allRequests = JSON.parse(localStorage.getItem('relieverRequests')) || []
      const approvedRequestsData = []

      approvedRequests.forEach((request) => {
        const requestIndexInAll = allRequests.findIndex((r) => r.id === request.id)

        if (requestIndexInAll !== -1) {
          const paymentResult = accountingProcessingResult.payments?.find(
            (p) => p.relieverName === request.name
          )
          const historyEntry = {
            action: 'Approved by Account Executive',
            by: currentUser.username,
            at: new Date().toISOString(),
            comments: 'Bulk approved - Liability created',
          }

          const updatedRequestData = {
            ...allRequests[requestIndexInAll],
            status: 'Approved',
            approvedAt: new Date().toISOString(),
            aeApprovedBy: currentUser.username,
            history: [...allRequests[requestIndexInAll].history, historyEntry],
            voucherNo: paymentResult?.voucherNo,
            transactionId: paymentResult?.transactionId,
            expenseGLCode: 'X2002002001',
            liabilityGLCode: 'L2001002',
          }

          allRequests[requestIndexInAll] = updatedRequestData
          approvedRequestsData.push(updatedRequestData)
        }
      })

      // Save back to localStorage
      localStorage.setItem('relieverRequests', JSON.stringify(allRequests))

      // ✅ STORE APPROVED REQUESTS FOR PROCESS PAYMENTS
      storeApprovedRequests(approvedRequestsData)

      // Update local state
      const updatedLocalRequests = allRequests.filter(
        (req) =>
          req.status === 'Pending Account Executive Approval' ||
          req.status === 'Approved' ||
          req.status.includes('Rejected by Account Executive')
      )

      const sortedUpdated = updatedLocalRequests.sort((a, b) => {
        const getStatusPriority = (status) => {
          if (status === 'Pending Account Executive Approval') return 1
          if (status === 'Approved') return 2
          if (status.includes('Rejected')) return 3
          return 4
        }
        return getStatusPriority(a.status) - getStatusPriority(b.status)
      })

      setRequests(sortedUpdated)
      setFiltered(sortedUpdated)

      // Show success and open payment modal
      setSelectedApprovedRequests(approvedRequestsData)
      setAccountingResult(accountingProcessingResult)
      setShowPaymentModal(true)

      toast.success(
        `✅ ${approvedRequestsData.length} reliever payments approved - Liability created`
      )
    } catch (error) {
      console.error('❌ Error during batch reliever approval:', error)
      toast.error(`Batch approval failed: ${error.message}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false)
    setSelectedApprovedRequests([])
    setAccountingResult(null)

    // Reload requests to ensure UI is in sync
    loadRequests()
  }

  const handleFilter = (filters) => {
    let temp = [...requests]
    if (filters.name?.trim()) {
      temp = temp.filter((req) => req.name.toLowerCase().includes(filters.name.toLowerCase()))
    }

    // Maintain sorting after filtering
    temp.sort((a, b) => {
      const getStatusPriority = (status) => {
        if (status === 'Pending Account Executive Approval') return 1
        if (status === 'Approved') return 2
        if (status.includes('Rejected')) return 3
        return 4
      }

      return getStatusPriority(a.status) - getStatusPriority(b.status)
    })

    setFiltered(temp)
  }

  return (
    <div className="max-w-6xl mx-auto p-4 bg-white shadow-md rounded-md">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-green-600">
          Account Executive - Reliever Payment Approvals
        </h1>
      </div>

      <FilterBar onFilter={handleFilter} />
      <AEApprovalTable
        requests={filtered}
        onStatusChange={handleStatusChange}
        onBulkApprove={handleBulkApprove}
        showActions={true}
      />

      {/* Payment Entry Modal */}
      <RelieverPaymentEntryModal
        isOpen={showPaymentModal}
        onClose={handleClosePaymentModal}
        approvedRequests={selectedApprovedRequests}
        accountingResult={accountingResult}
      />

      {/* Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[70] flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            <p className="text-gray-700 font-medium">Processing approval...</p>
            <p className="text-sm text-gray-500">Please wait, posting accounting entries</p>
          </div>
        </div>
      )}
    </div>
  )
}

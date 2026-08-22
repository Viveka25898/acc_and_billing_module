import React, { useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

import UploadPaymentFile from './UploadPaymentFile'
import RelieverPaymentTable from './RelieverPaymentTable'
import RelieverPaymentPreviewModal from './RelieverPaymentPreviewModal'
import PaymentBankSelectionModal from './PaymentBankSelectionModal'
import RelieverPaymentEntryModal from './RelieverPaymentEntryModal'

import { parseRelieverExcelFile } from '../utils/excelHelpers'
import { transformPendingRelieverApiResponse } from '../utils/paymentHelpers'
import {
  fetchPendingRelieverRequests,
  generateRelieverPaymentFiles,
} from '../../../store/slices/relieverSlice'
import { downloadRelieverFileBlob } from '../services/relieverPaymentService'
import { processRelieverBankPayments } from '../../Master/utils/accountingHelpers'

const Spinner = ({ size = 'md' }) => {
  const size_cls = size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-10 w-10' : 'h-6 w-6'
  return (
    <div
      className={`${size_cls} animate-spin rounded-full border-2 border-gray-200 border-t-blue-500`}
      role="status"
      aria-label="Loading"
    />
  )
}

const RelieverPaymentSection = () => {
  const dispatch = useDispatch()
  const {
    pendingPaymentRelievers,
    pendingPaymentPagination,
    loading: { pendingPayments: apiLoading },
    errors: { pendingPayments: apiError },
    relieverFileGenerating,
    relieverBatchId,
    relieverDownloads,
  } = useSelector((state) => state.reliever || {})

  const [relieverData, setRelieverData] = useState([])
  const [parsedData, setParsedData] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isBankModalOpen, setIsBankModalOpen] = useState(false)
  const [pendingAcceptedData, setPendingAcceptedData] = useState(null)
  const [showPaymentEntry, setShowPaymentEntry] = useState(false)
  const [paymentEntryData, setPaymentEntryData] = useState(null)

  // Tracking Download Actions
  const [filesDownloaded, setFilesDownloaded] = useState(false)
  const [downloadingFiles, setDownloadingFiles] = useState(false)

  // Local Page State — Backend controls pagination
  const [currentPage, setCurrentPage] = useState(1)

  // Fetch pending reliever requests from backend API
  const loadPendingRelieverRequests = useCallback(
    async (targetPage = currentPage) => {
      try {
        const resultAction = await dispatch(
          fetchPendingRelieverRequests({ page: targetPage })
        ).unwrap()
        const rawRequests = resultAction?.relieverRequests || []
        const transformed = transformPendingRelieverApiResponse(rawRequests)
        setRelieverData(transformed)
      } catch (err) {
        toast.error(typeof err === 'string' ? err : 'Failed to load pending reliever payment requests')
      }
    },
    [dispatch, currentPage]
  )

  useEffect(() => {
    loadPendingRelieverRequests(currentPage)
  }, [currentPage, loadPendingRelieverRequests])

  // Sync Redux state into local component state if updated externally
  useEffect(() => {
    if (Array.isArray(pendingPaymentRelievers) && pendingPaymentRelievers.length > 0) {
      setRelieverData(transformPendingRelieverApiResponse(pendingPaymentRelievers))
    }
  }, [pendingPaymentRelievers])

  // Pagination Change Handler
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > (pendingPaymentPagination?.totalPages || 1) || apiLoading) return
    setCurrentPage(newPage)
    loadPendingRelieverRequests(newPage)
  }

  const handleFileUpload = async (file) => {
    try {
      const data = await parseRelieverExcelFile(file)
      setParsedData(data)
      setIsModalOpen(true)
    } catch (err) {
      toast.error(err.message || 'Error processing file')
    }
  }

  // Manual download handler — Downloads files ONLY when user clicks "Download Files" button
  const handleDownloadGeneratedFiles = async () => {
    if (filesDownloaded) {
      toast.info('Files have already been downloaded for this batch.')
      return
    }
    if (!relieverDownloads?.bankFileUrl && !relieverDownloads?.systemFileUrl) {
      toast.warning('No generated payment files available. Please approve selected requests first.')
      return
    }

    setDownloadingFiles(true)
    try {
      const batchTag = relieverBatchId || 'Batch'
      if (relieverDownloads.bankFileUrl) {
        toast.info('Downloading Bank Payment File…')
        await downloadRelieverFileBlob(relieverDownloads.bankFileUrl, `Reliever_Bank_File_${batchTag}.xlsx`)
      }
      if (relieverDownloads.systemFileUrl) {
        toast.info('Downloading System Payment File…')
        await downloadRelieverFileBlob(relieverDownloads.systemFileUrl, `Reliever_System_File_${batchTag}.xlsx`)
      }
      toast.success('Downloaded generated payment files successfully.')
      setFilesDownloaded(true) // Disable button after successful download
    } catch (err) {
      toast.error('Failed to download payment files from backend')
    } finally {
      setDownloadingFiles(false)
    }
  }

  // Generate Reliever Payment Files API Trigger
  const handleRelieverApproval = async (selectedRequests = []) => {
    if (!Array.isArray(selectedRequests) || selectedRequests.length === 0) {
      toast.warning('Please select at least one reliever request to approve')
      return
    }

    const selections = selectedRequests.map((r) => r.requestId || r.id)

    try {
      // 1. Call Generate Reliever Payment Files API (POST /accounts/payments/reliever/generate-payment-files)
      const res = await dispatch(generateRelieverPaymentFiles({ selections })).unwrap()
      setFilesDownloaded(false) // Enable download button for the new generated batch

      toast.success(
        res.message || 'Payment files generated successfully. Click "Download Files" to save them.'
      )

      // 2. Refresh pending reliever request list from backend
      loadPendingRelieverRequests(currentPage)
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Failed to generate reliever payment files')
    }
  }

  const handleBankConfirm = (bank) => {
    setIsBankModalOpen(false)

    try {
      const accepted = pendingAcceptedData || []
      const paymentsToProcess = accepted.map((row) => ({
        relieverName: row['Reliever Name'] || row.relieverName || '-',
        amount: parseFloat(row.Amount || row.amount || row['Total Amount'] || 0),
        requestId: row.id || row.requestId || `REQ-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        employeeId: row['Employee ID'] || row.employeeId || '-',
      }))

      const result = processRelieverBankPayments(paymentsToProcess, bank)
      if (!result.success) {
        toast.error(result.message || 'Error posting reliever entries')
        return
      }

      toast.success(result.message)

      // Remove paid entries from screen table
      try {
        const processedIds = new Set((result.payments || []).map((r) => r.requestId || r.id))
        setRelieverData((prev) => prev.filter((r) => !processedIds.has(r.id || r.requestId)))
      } catch {
        // non-critical
      }

      // Build specific Reliever Entry Data
      setPaymentEntryData({
        entryNo:
          result.voucherNo ||
          `RPE-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`,
        date: new Date().toISOString().split('T')[0],
        totalAmount: result.totalAmount,
        bankAccount: `${bank.bankName} (${bank.bankCode})`,
        paymentMethod: 'Bank Transfer',
        particulars: `Reliever payments for ${(result.payments || []).length} employee(s)`,
        relieversProcessed: (result.payments || []).length,
        status: 'Posted',
        preparedBy: 'Account Executive',
        approvedBy: 'System',
        relieverDetails: (result.payments || []).map((r) => ({
          relieverName: r.relieverName || r.name,
          employeeId: r.employeeId,
          amount: r.amount,
        })),
        glEntries: result.glEntries || [],
      })

      setShowPaymentEntry(true)
      setPendingAcceptedData(null)
    } catch (err) {
      console.error(err)
      toast.error('Error processing reliever payments')
    }
  }

  // Calculated Summary Metrics
  const activePage = pendingPaymentPagination?.currentPage || currentPage
  const totalPages = pendingPaymentPagination?.totalPages || 1
  const totalItems = pendingPaymentPagination?.totalItems || relieverData.length
  const totalAmountPayable = relieverData.reduce(
    (sum, r) => sum + (parseFloat(r.Amount || r.amount) || 0),
    0
  )

  // Download Button State Logic
  const hasFilesToDownload = relieverDownloads?.bankFileUrl || relieverDownloads?.systemFileUrl
  const isDownloadBtnDisabled =
    !hasFilesToDownload || filesDownloaded || downloadingFiles || relieverFileGenerating

  return (
    <div className="space-y-4">
      {/* Top Banner & Excel Upload */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white">Process Reliever Payments</h2>
            <p className="text-blue-100 text-xs mt-0.5">
              Upload a bank file or approve from the pending request list below
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => loadPendingRelieverRequests(activePage)}
              disabled={apiLoading || relieverFileGenerating}
              className="text-xs font-semibold px-3 py-1.5 rounded-full bg-blue-700/60 hover:bg-blue-700 text-white border border-blue-400/40 transition flex items-center gap-1"
              title="Refresh Pending Requests"
            >
              <span>🔄</span> Refresh
            </button>
            <button
              onClick={handleDownloadGeneratedFiles}
              disabled={isDownloadBtnDisabled}
              className={`flex items-center gap-1.5 text-xs sm:text-sm font-semibold px-3.5 py-1.5 sm:py-2 rounded-full transition shadow-sm ${
                !isDownloadBtnDisabled
                  ? 'bg-white text-blue-700 hover:bg-blue-50 border border-blue-200 cursor-pointer active:scale-95'
                  : 'bg-blue-400/70 text-blue-100 cursor-not-allowed border border-blue-300/40 opacity-80'
              }`}
            >
              {relieverFileGenerating ? (
                <>
                  <Spinner size="sm" />
                  Generating Files…
                </>
              ) : downloadingFiles ? (
                <>
                  <Spinner size="sm" />
                  Downloading…
                </>
              ) : filesDownloaded ? (
                <>
                  <span>✓</span> Files Downloaded
                </>
              ) : (
                <>
                  ⬇ Download Files
                  {hasFilesToDownload && (
                    <span className="bg-blue-600 text-white text-[10px] sm:text-xs rounded-full px-2 py-0.5 animate-pulse">
                      Ready
                    </span>
                  )}
                </>
              )}
            </button>
          </div>
        </div>
        <div className="p-4">
          <UploadPaymentFile onFileUpload={handleFileUpload} />
        </div>
      </div>

      {/* Metric Cards Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
              Total Pending Requests
            </span>
            <p className="text-lg font-bold text-gray-800 mt-0.5">{totalItems}</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm">
            👥
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
              Page Amount Payable
            </span>
            <p className="text-lg font-bold text-blue-700 mt-0.5">
              ₹{totalAmountPayable.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-sm">
            💰
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        <div className="p-3 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-700">
            Pending Reliever Payment Requests
            {!apiLoading && (
              <span className="text-xs font-normal text-gray-400 ml-2">
                (Page {activePage} of {totalPages} — {relieverData.length} items)
              </span>
            )}
          </h3>
          {apiLoading && <Spinner size="sm" />}
        </div>

        <div className="min-h-[320px]">
          {apiLoading ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400 space-y-3">
              <Spinner size="lg" />
              <p className="text-xs sm:text-sm text-gray-500">Loading reliever requests…</p>
            </div>
          ) : apiError ? (
            <div className="p-8 text-center space-y-3">
              <div className="text-3xl text-red-400">⚠️</div>
              <p className="text-xs sm:text-sm font-medium text-red-600">{apiError}</p>
              <button
                onClick={() => loadPendingRelieverRequests(activePage)}
                className="text-xs font-semibold px-4 py-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
              >
                Retry Loading
              </button>
            </div>
          ) : (
            <RelieverPaymentTable
              data={relieverData}
              onApprove={handleRelieverApproval}
            />
          )}
        </div>

        {/* Backend-Controlled Responsive Pagination Bar */}
        <div className="border-t border-gray-100 p-3 bg-gray-50/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-gray-600">
            Showing Page <strong className="text-gray-800">{activePage}</strong> of{' '}
            <strong className="text-gray-800">{totalPages}</strong> ({totalItems} total requests)
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handlePageChange(activePage - 1)}
              disabled={activePage <= 1 || apiLoading}
              className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${
                activePage > 1 && !apiLoading
                  ? 'bg-white border border-gray-200 text-gray-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 shadow-sm'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-100'
              }`}
            >
              ◄ Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => handlePageChange(p)}
                disabled={apiLoading}
                className={`w-7 h-7 text-xs rounded-lg font-semibold transition-all ${
                  p === activePage
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(activePage + 1)}
              disabled={activePage >= totalPages || apiLoading}
              className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${
                activePage < totalPages && !apiLoading
                  ? 'bg-white border border-gray-200 text-gray-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 shadow-sm'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-100'
              }`}
            >
              Next ►
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {isModalOpen && (
        <RelieverPaymentPreviewModal
          data={parsedData}
          onClose={() => setIsModalOpen(false)}
          onAccept={(accepted) => {
            setPendingAcceptedData(accepted)
            setIsModalOpen(false)
            setIsBankModalOpen(true)
          }}
        />
      )}

      {isBankModalOpen && (
        <PaymentBankSelectionModal
          isOpen={isBankModalOpen}
          onClose={() => setIsBankModalOpen(false)}
          onBankSelect={handleBankConfirm}
          requestData={pendingAcceptedData}
          paymentType="reliever"
        />
      )}

      {showPaymentEntry && paymentEntryData && (
        <RelieverPaymentEntryModal
          isOpen={showPaymentEntry}
          onClose={() => setShowPaymentEntry(false)}
          paymentData={paymentEntryData}
        />
      )}
    </div>
  )
}

export default RelieverPaymentSection

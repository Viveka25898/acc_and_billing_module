import React, { useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

import UploadPaymentFile from './UploadPaymentFile'
import ConveyancePaymentTable from './ConveyancePaymentTable'
import ConveyancePaymentPreviewModal from './ConveyancePaymentPreviewModal'
import PaymentBankSelectionModal from './PaymentBankSelectionModal'
import ConveyancePaymentEntryModal from './ConveyancePaymentEntryModal'

import { parseConveyanceExcelFile } from '../utils/excelHelpers'
import { transformPendingConveyanceApiResponse } from '../utils/paymentHelpers'
import { fetchPendingConveyancePayments } from '../../../store/slices/conveyanceSlice'
import { processConveyanceBankPayments } from '../../Master/utils/accountingHelpers'

const Spinner = ({ size = 'md' }) => {
  const size_cls = size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-10 w-10' : 'h-6 w-6'
  return (
    <div
      className={`${size_cls} animate-spin rounded-full border-2 border-gray-200 border-t-purple-500`}
      role="status"
      aria-label="Loading"
    />
  )
}

const ConveyancePaymentsSection = () => {
  const dispatch = useDispatch()
  const {
    pendingPaymentConveyances,
    pendingPaymentPagination,
    pendingPaymentSummary,
    pendingPaymentsLoading: apiLoading,
    pendingPaymentsError: apiError,
  } = useSelector((state) => state.conveyance || {})

  const [conveyanceData, setConveyanceData] = useState([])
  const [parsedData, setParsedData] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isBankModalOpen, setIsBankModalOpen] = useState(false)
  const [pendingAcceptedData, setPendingAcceptedData] = useState(null)
  const [showPaymentEntry, setShowPaymentEntry] = useState(false)
  const [paymentEntryData, setPaymentEntryData] = useState(null)
  const [approvedPayments, setApprovedPayments] = useState([])

  // Local Page State — Backend controls pagination
  const [currentPage, setCurrentPage] = useState(1)

  // Fetch pending conveyance payment requests from backend API
  const loadPendingConveyancePayments = useCallback(
    async (targetPage = currentPage) => {
      try {
        const resultAction = await dispatch(
          fetchPendingConveyancePayments({ page: targetPage })
        ).unwrap()
        const rawRequests = resultAction?.data?.requests || resultAction?.requests || []
        const transformed = transformPendingConveyanceApiResponse(rawRequests)
        setConveyanceData(transformed)
      } catch (err) {
        toast.error(typeof err === 'string' ? err : 'Failed to load pending conveyance payment requests')
      }
    },
    [dispatch, currentPage]
  )

  useEffect(() => {
    loadPendingConveyancePayments(currentPage)
  }, [currentPage, loadPendingConveyancePayments])

  // Sync Redux state into local component state if updated externally
  useEffect(() => {
    if (Array.isArray(pendingPaymentConveyances) && pendingPaymentConveyances.length > 0) {
      setConveyanceData(transformPendingConveyanceApiResponse(pendingPaymentConveyances))
    }
  }, [pendingPaymentConveyances])

  // Pagination Change Handler
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > (pendingPaymentPagination?.totalPages || 1) || apiLoading) return
    setCurrentPage(newPage)
    loadPendingConveyancePayments(newPage)
  }

  const handleFileUpload = async (file) => {
    try {
      const data = await parseConveyanceExcelFile(file)
      setParsedData(data)
      setIsModalOpen(true)
    } catch (err) {
      toast.error(err.message || 'Error processing file')
    }
  }

  const handleDownloadTemplate = () => {
    if (approvedPayments.length === 0) {
      toast.warning('No approved conveyance payments to download.')
      return
    }

    try {
      const ts = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '')

      const bankData = approvedPayments.map((r) => ({
        'BENEFICIARY NAME': r['Employee Name'] || r.employeeName || '-',
        'ACCOUNT NUMBER': r['Account No'] || r.accountNo || 'N/A',
        'IFSC CODE': r['IFSC Code'] || r.ifscCode || 'N/A',
        AMOUNT: r.Amount || r.amount || 0,
        NARRATION: `Conveyance - ${r.Purpose || r.purpose || 'Payment'}`,
      }))

      const systemData = approvedPayments.map((r) => ({
        'Employee Name': r['Employee Name'] || r.employeeName || '-',
        'Employee ID': r['Employee ID'] || r.employeeId || '-',
        'Paid Amount': r.Amount || r.amount || 0,
        Client: r.Client || r.client || '-',
        Purpose: r.Purpose || r.purpose || '-',
        'UTR Number': '',
        'Payment Date': new Date().toISOString().split('T')[0],
      }))

      const wb1 = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb1, XLSX.utils.json_to_sheet(bankData), 'Bank_Upload')
      saveAs(
        new Blob([XLSX.write(wb1, { bookType: 'xlsx', type: 'array' })], {
          type: 'application/octet-stream',
        }),
        `Conveyance_Bank_File_${ts}.xlsx`
      )

      const wb2 = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb2, XLSX.utils.json_to_sheet(systemData), 'System_Upload')
      saveAs(
        new Blob([XLSX.write(wb2, { bookType: 'xlsx', type: 'array' })], {
          type: 'application/octet-stream',
        }),
        `Conveyance_System_File_${ts}.xlsx`
      )

      setApprovedPayments([])
      toast.success('Downloaded Bank + System files successfully.')
    } catch (err) {
      toast.error('Failed to generate download files')
    }
  }

  const handleBankConfirm = (bank) => {
    setIsBankModalOpen(false)

    try {
      const accepted = pendingAcceptedData || []
      const paymentsToProcess = accepted.map((row) => ({
        employeeName: row['Employee Name'] || row.employeeName || '-',
        amount: parseFloat(row.Amount || row.amount || row['Payment Amount'] || 0),
        requestId: row.id || `CONV-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        employeeId: row['Employee ID'] || row.employeeId || '-',
        utr: row.UTR || row['UTR Number'] || '',
      }))

      const result = processConveyanceBankPayments(paymentsToProcess, bank)
      if (!result.success) {
        toast.error(result.message || 'Error posting conveyance entries')
        return
      }

      toast.success(result.message)

      // Remove paid entries from screen table
      try {
        const processedIds = new Set((result.payments || []).map((r) => r.requestId || r.id))
        setConveyanceData((prev) => prev.filter((r) => !processedIds.has(r.id)))
      } catch {
        // non-critical
      }

      // Build specific Conveyance Entry Data
      setPaymentEntryData({
        entryNo:
          result.voucherNo ||
          `CPE-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`,
        date: new Date().toISOString().split('T')[0],
        totalAmount: result.totalAmount,
        bankAccount: `${bank.bankName} (${bank.bankCode})`,
        paymentMethod: 'Bank Transfer',
        particulars: `Conveyance reimbursements for ${(result.payments || []).length} employee(s)`,
        employeesProcessed: (result.payments || []).length,
        status: 'Posted',
        preparedBy: 'Account Executive',
        approvedBy: 'System',
        employeeDetails: (result.payments || []).map((r) => ({
          employeeName: r.employeeName || r.name,
          employeeId: r.employeeId,
          amount: r.amount,
          utr: r.utr,
        })),
        glEntries: result.glEntries || [],
      })

      setShowPaymentEntry(true)
      setPendingAcceptedData(null)
    } catch (err) {
      console.error(err)
      toast.error('Error processing conveyance payments')
    }
  }

  // Calculated Summary Metrics
  const activePage = pendingPaymentPagination?.currentPage || currentPage
  const totalPages = pendingPaymentPagination?.totalPages || 1
  const totalItems =
    pendingPaymentSummary?.totalPendingPayment ||
    pendingPaymentPagination?.totalRecords ||
    conveyanceData.length ||
    0
  const totalAmountPayable =
    parseFloat(pendingPaymentSummary?.totalAmount) ||
    conveyanceData.reduce((sum, r) => sum + (parseFloat(r.Amount || r.amount) || 0), 0)
  const totalDepartments = Object.keys(pendingPaymentSummary?.byDepartment || {}).length

  return (
    <div className="space-y-4">
      {/* Top Banner & Excel Upload */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-purple-500 px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white">Process Conveyance Payments</h2>
            <p className="text-purple-100 text-xs mt-0.5">
              Upload a bank file or approve from the pending request list below
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => loadPendingConveyancePayments(activePage)}
              disabled={apiLoading}
              className="text-xs font-semibold px-3 py-1.5 rounded-full bg-purple-700/60 hover:bg-purple-700 text-white border border-purple-400/40 transition flex items-center gap-1"
              title="Refresh Pending Requests"
            >
              <span>🔄</span> Refresh
            </button>
            <button
              onClick={handleDownloadTemplate}
              disabled={approvedPayments.length === 0}
              className={`flex items-center gap-1.5 text-xs sm:text-sm font-semibold px-3.5 py-1.5 sm:py-2 rounded-full transition shadow-sm ${
                approvedPayments.length > 0
                  ? 'bg-white text-purple-700 hover:bg-purple-50 border border-purple-200'
                  : 'bg-purple-400 text-purple-100 cursor-not-allowed border border-purple-300'
              }`}
            >
              ⬇ Download Files
              {approvedPayments.length > 0 && (
                <span className="bg-purple-600 text-white text-[10px] sm:text-xs rounded-full px-2 py-0.5">
                  {approvedPayments.length}
                </span>
              )}
            </button>
          </div>
        </div>
        <div className="p-4">
          <UploadPaymentFile onFileUpload={handleFileUpload} />
        </div>
      </div>

      {/* Metric Cards Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
              Total Pending Claims
            </span>
            <p className="text-lg font-bold text-gray-800 mt-0.5">{totalItems}</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 font-bold text-sm">
            🚗
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
              Total Amount Payable
            </span>
            <p className="text-lg font-bold text-purple-700 mt-0.5">
              ₹{totalAmountPayable.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold text-sm">
            💰
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
              Active Departments
            </span>
            <p className="text-lg font-bold text-gray-800 mt-0.5">
              {totalDepartments > 0 ? totalDepartments : 1}
            </p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-violet-50 flex items-center justify-center text-violet-600 font-bold text-sm">
            🏢
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        <div className="p-3 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-700">
            Pending Conveyance Payment Requests
            {!apiLoading && (
              <span className="text-xs font-normal text-gray-400 ml-2">
                (Page {activePage} of {totalPages} — {conveyanceData.length} items)
              </span>
            )}
          </h3>
          {apiLoading && <Spinner size="sm" />}
        </div>

        <div className="min-h-[320px]">
          {apiLoading ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400 space-y-3">
              <Spinner size="lg" />
              <p className="text-xs sm:text-sm text-gray-500">Loading conveyance requests…</p>
            </div>
          ) : apiError ? (
            <div className="p-8 text-center space-y-3">
              <div className="text-3xl text-red-400">⚠️</div>
              <p className="text-xs sm:text-sm font-medium text-red-600">{apiError}</p>
              <button
                onClick={() => loadPendingConveyancePayments(activePage)}
                className="text-xs font-semibold px-4 py-1.5 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition"
              >
                Retry Loading
              </button>
            </div>
          ) : (
            <ConveyancePaymentTable
              data={conveyanceData}
              onApprove={(selected) => {
                setApprovedPayments((prev) => {
                  const map = new Map(prev.map((p) => [p.id, p]))
                  selected.forEach((s) => map.set(s.id, s))
                  return Array.from(map.values())
                })
              }}
            />
          )}
        </div>

        {/* Backend-Controlled Responsive Pagination Bar */}
        <div className="border-t border-gray-100 p-3 bg-gray-50/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-gray-600">
            Showing Page <strong className="text-gray-800">{activePage}</strong> of{' '}
            <strong className="text-gray-800">{totalPages}</strong> ({totalItems} total claims)
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handlePageChange(activePage - 1)}
              disabled={activePage <= 1 || apiLoading}
              className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${
                activePage > 1 && !apiLoading
                  ? 'bg-white border border-gray-200 text-gray-700 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300 shadow-sm'
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
                    ? 'bg-purple-600 text-white shadow-sm'
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
                  ? 'bg-white border border-gray-200 text-gray-700 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300 shadow-sm'
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
        <ConveyancePaymentPreviewModal
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
          paymentType="conveyance"
        />
      )}

      {showPaymentEntry && paymentEntryData && (
        <ConveyancePaymentEntryModal
          isOpen={showPaymentEntry}
          onClose={() => setShowPaymentEntry(false)}
          paymentData={paymentEntryData}
        />
      )}
    </div>
  )
}

export default ConveyancePaymentsSection

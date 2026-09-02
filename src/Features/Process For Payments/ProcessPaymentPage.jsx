import React, { useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

import UploadPaymentFile from './Components/UploadPaymentFile'
import PaymentPreviewModal from './Components/PaymentPreviewModal'
import EditPaymentDetails from './Components/EditPaymentDetails'
import VendorInvoiceTable from './Components/VendorInvoiceTable'
import InvoiceViewer from './Components/InvoiceReviewer'
import PaymentEntryModal from './Components/PaymentEntryModal'
import RelieverPaymentsSection from './Components/RelieverPaymentSection'
import ConveyancePaymentsSection from './Components/ConveyancePaymentsSection'
import PaymentBankSelectionModal from './Components/PaymentBankSelectionModal'

import { parseVendorExcelFile } from './utils/excelHelpers'
import { transformPendingVendorApiResponse } from './utils/paymentHelpers'
import {
  fetchPendingVendorPayments,
  generateVendorPaymentFiles,
} from '../../store/slices/vendorPaymentSlice'
import { downloadPaymentFileBlob } from './services/vendorPaymentService'
import { processVendorPayments } from '../Master/utils/accountingHelpers'

// ─── Constants ────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'vendor', label: 'Vendor Payments', color: 'green' },
  { id: 'reliever', label: 'Reliever Payments', color: 'blue' },
  { id: 'conveyance', label: 'Conveyance Payments', color: 'purple' },
]

const TAB_ACTIVE_CLASSES = {
  green: 'border-green-500 text-green-700 bg-green-50',
  blue: 'border-blue-500 text-blue-700 bg-blue-50',
  purple: 'border-purple-500 text-purple-700 bg-purple-50',
}

// ─── Spinner ──────────────────────────────────────────────────────────────────
const Spinner = ({ size = 'md', color = 'green' }) => {
  const size_cls = size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-10 w-10' : 'h-6 w-6'
  const borderColors = {
    green: 'border-green-500',
    blue: 'border-blue-500',
    purple: 'border-purple-500',
  }
  const border_cls = borderColors[color] || 'border-green-500'
  return (
    <div
      className={`${size_cls} animate-spin rounded-full border-2 border-gray-200 ${border_cls} border-t-transparent`}
      role="status"
      aria-label="Loading"
    />
  )
}

// ─── Tab Bar ──────────────────────────────────────────────────────────────────
const PaymentTypeTabs = ({ activeTab, onTabChange }) => (
  <div className="flex gap-1 sm:gap-2 bg-gray-100 p-1 rounded-xl overflow-x-auto">
    {TABS.map((tab) => {
      const isActive = activeTab === tab.id
      return (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 min-w-max whitespace-nowrap py-2 px-3 sm:px-5 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 ${
            isActive
              ? `${TAB_ACTIVE_CLASSES[tab.color]} shadow-sm border`
              : 'text-gray-500 hover:text-gray-700 hover:bg-white'
          }`}
        >
          {tab.label}
        </button>
      )
    })}
  </div>
)

// ─── Vendor Payments Section ──────────────────────────────────────────────────
const VendorPaymentsSection = ({
  vendorData,
  setVendorData,
  approvedInvoices,
  setApprovedInvoices,
  parsedData,
  setParsedData,
  isModalOpen,
  setIsModalOpen,
  editMode,
  setEditMode,
  editableData,
  setEditableData,
  selectedInvoice,
  setSelectedInvoice,
  invoicePayments,
  setInvoicePayments,
  showPaymentEntry,
  setShowPaymentEntry,
  currentPaymentEntryData,
  setCurrentPaymentEntryData,
  isBankModalOpen,
  setIsBankModalOpen,
  pendingAcceptedData,
  setPendingAcceptedData,
}) => {
  const dispatch = useDispatch()
  const {
    summary,
    pagination,
    loading: apiLoading,
    error: apiError,
    fileGenerating,
    currentBatchId,
    downloads,
  } = useSelector((state) => state.vendorPayment || {})
  const [bankProcessing, setBankProcessing] = useState(false)
  const [bankModalMode, setBankModalMode] = useState('excel')
  const [pendingApproveSelections, setPendingApproveSelections] = useState(null)

  // Tracking Download Actions
  const [filesDownloaded, setFilesDownloaded] = useState(false)
  const [downloadingFiles, setDownloadingFiles] = useState(false)

  // Local Page State — Backend controls pageSize via response.pagination.pageSize
  const [currentPage, setCurrentPage] = useState(1)

  // Fetch pending vendor payments from backend API using backend-controlled pagination
  const loadPendingVendorPayments = useCallback(
    async (targetPage = currentPage) => {
      try {
        const resultAction = await dispatch(
          fetchPendingVendorPayments({ page: targetPage })
        ).unwrap()
        const rawVendors = resultAction?.vendors || []
        const transformed = transformPendingVendorApiResponse(rawVendors)
        setVendorData(transformed)
      } catch (err) {
        toast.error(typeof err === 'string' ? err : 'Failed to load pending vendor payments')
      }
    },
    [dispatch, currentPage, setVendorData]
  )

  useEffect(() => {
    loadPendingVendorPayments(currentPage)
  }, [currentPage, loadPendingVendorPayments])

  // Pagination Change Handler
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > (pagination?.totalPages || 1) || apiLoading) return
    setCurrentPage(newPage)
    loadPendingVendorPayments(newPage)
  }

  // File upload handler
  const handleFileUpload = async (file) => {
    try {
      const data = await parseVendorExcelFile(file)
      setParsedData(data)
      setIsModalOpen(true)
    } catch (err) {
      toast.error(err.message || 'Failed to parse Excel file')
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditMode(false)
    setParsedData([])
  }

  const handleRequestChanges = (data) => {
    setEditableData(data)
    setEditMode(true)
    setIsModalOpen(false)
  }

  const handleInvoiceSelect = (invoice) => setSelectedInvoice(invoice)

  const handlePaymentUpdate = useCallback((invoiceId, amount, paymentType) => {
    setInvoicePayments((prev) => ({
      ...prev,
      [invoiceId]: { amount, paymentType, updatedAt: new Date().toISOString() },
    }))
  }, [])

  // Manual download handler — Downloads files ONLY when user clicks "Download Files" button
  const handleDownloadGeneratedFiles = async () => {
    if (filesDownloaded) {
      toast.info('Files have already been downloaded for this batch.')
      return
    }
    if (!downloads?.bankFileUrl && !downloads?.systemFileUrl) {
      toast.warning('No generated payment files available. Please approve selected invoices first.')
      return
    }

    setDownloadingFiles(true)
    try {
      const batchTag = currentBatchId || 'Batch'
      if (downloads.bankFileUrl) {
        toast.info('Downloading Bank Payment File…')
        await downloadPaymentFileBlob(downloads.bankFileUrl, `Bank_Payment_${batchTag}.xlsx`)
      }
      if (downloads.systemFileUrl) {
        toast.info('Downloading System Payment File…')
        await downloadPaymentFileBlob(downloads.systemFileUrl, `System_Payment_${batchTag}.xlsx`)
      }
      toast.success('Downloaded generated payment files successfully.')
      setFilesDownloaded(true) // Disable button after successful download
    } catch (err) {
      toast.error(typeof err === 'string' ? err : err?.message || 'Failed to download payment files from backend')
    } finally {
      setDownloadingFiles(false)
    }
  }

  // Generate Vendor Payment Files API Trigger - Prompts for Bank Selection first
  const handleInvoiceApproval = async (selectedVendors, currentPayments = {}) => {
    const selectedIds = Object.keys(selectedVendors).filter((id) => selectedVendors[id])
    if (selectedIds.length === 0) {
      toast.warning('Please select at least one vendor to approve and generate payment files')
      return
    }

    // Build payload matching backend contract:
    // { selectedBankCode, selections: [ { vendorId, invoiceSelections: [ { invoiceId, paymentType, paidAmount } ] } ] }
    const selections = []
    const summaryRows = []

    vendorData.forEach((vendor) => {
      if (selectedVendors[vendor.id]) {
        const invoiceSelections = (vendor.invoices || []).map((invoice) => {
          const payment =
            currentPayments[invoice.id] ||
            invoicePayments[invoice.id] || { amount: invoice.amount, paymentType: 'full' }
          const paymentType = payment?.paymentType === 'partial' ? 'partial' : 'full'
          let paidAmount = paymentType === 'full' ? invoice.amount : Number(payment?.amount || 0)

          if (paidAmount > invoice.amount) {
            paidAmount = invoice.amount
          }

          return {
            invoiceId: invoice.id || invoice.invoiceId,
            paymentType,
            paidAmount,
          }
        })

        if (invoiceSelections.length > 0) {
          selections.push({
            vendorId: vendor.vendorId || vendor.id,
            invoiceSelections,
          })

          const vendorTotal = invoiceSelections.reduce((s, i) => s + i.paidAmount, 0)
          summaryRows.push({
            'Vendor Name': vendor.vendorName || vendor.id,
            'Invoice Numbers': (vendor.invoices || []).map((i) => i.invoiceNumber).join(', '),
            'Payment Done': vendorTotal,
          })
        }
      }
    })

    if (selections.length === 0) {
      toast.warning('No valid invoice selections found')
      return
    }

    setPendingApproveSelections(selections)
    setPendingAcceptedData(summaryRows)
    setBankModalMode('approval')
    setIsBankModalOpen(true)
  }

  // ── Bank selection confirm handler ─────────────────────────────────────────
  const handleBankConfirm = async (bank) => {
    setIsBankModalOpen(false)

    if (bankModalMode === 'approval') {
      if (!pendingApproveSelections || pendingApproveSelections.length === 0) {
        toast.error('No selections found for payment file generation')
        return
      }
      try {
        const res = await dispatch(
          generateVendorPaymentFiles({
            selectedBankCode: bank.bankCode,
            selections: pendingApproveSelections,
          })
        ).unwrap()
        setFilesDownloaded(false) // Enable download button for the new generated batch

        toast.success(
          res.message || 'Payment files generated successfully. Click "Download Files" to save them.'
        )

        // Refresh pending vendor list from backend
        loadPendingVendorPayments(currentPage)
      } catch (err) {
        toast.error(typeof err === 'string' ? err : 'Failed to generate vendor payment files')
      } finally {
        setPendingApproveSelections(null)
        setPendingAcceptedData(null)
      }
      return
    }

    // Handle Excel upload bank confirmation (local GL posting)
    setBankProcessing(true)
    try {
      const payments = []
      const approved = approvedInvoices || []

      ;(pendingAcceptedData || []).forEach((row) => {
        const vendorName = row['Vendor Name'] || '-'
        const invoiceNumbers = String(row['Invoice Numbers'] || '')
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)

        invoiceNumbers.forEach((invNo) => {
          const match = approved.find(
            (a) => a.vendorName === vendorName && a.invoiceNumber === invNo
          )
          const amount = match
            ? parseFloat(match.paidAmount || 0)
            : parseFloat(row['Payment Done'] || row['Total Amount'] || 0) /
              Math.max(invoiceNumbers.length, 1)

          payments.push({
            vendorName,
            invoiceNumber: invNo,
            amount,
            type: match?.type || match?.invoiceTypeLabel || 'Material',
            vendorGLCode: match?.vendorGLCode || '-',
          })
        })
      })

      const result = processVendorPayments(payments, bank)
      if (!result.success) {
        toast.error(result.message || 'Failed to post vendor payments')
        return
      }
      toast.success(result.message)

      // Build payment entry display data
      const totalAmount = result.totalPaid
      const vendorDetails = result.groups.map((g) => ({
        vendorName: g.vendorName || '-',
        vendorGLCode: g.vendorGLCode || '-',
        totalAmount: g.totalAmount,
        invoices: g.invoices.map((inv) => ({
          invoiceNumber: inv.invoiceNumber || '-',
          originalAmount: inv.amount,
          paidAmount: inv.amount,
          paymentType: 'full',
        })),
      }))

      setCurrentPaymentEntryData({
        entryNo: `PE-${new Date().getFullYear()}-${String(
          Math.floor(Math.random() * 999999)
        ).padStart(6, '0')}`,
        date: new Date().toISOString().split('T')[0],
        vendor:
          vendorDetails.length > 1
            ? `Multiple Vendors (${vendorDetails.length})`
            : vendorDetails[0]?.vendorName || '-',
        vendorCode: vendorDetails.length > 1 ? 'MULTIPLE' : '-',
        amount: totalAmount,
        paymentMethod: 'Bank Transfer',
        bankAccount: `${bank.bankName || '-'} (${bank.bankCode || '-'})`,
        invoiceNo: result.results.map((r) => r.invoiceNumber || '-').join(', '),
        particulars: `Payment for invoices: ${result.results
          .map((r) => r.invoiceNumber || '-')
          .join(', ')}`,
        gstAmount: 0,
        netAmount: totalAmount,
        status: 'Posted',
        preparedBy: 'Account Executive',
        approvedBy: 'System',
        remarks: 'Auto-posted via Process of Payments',
        vendorDetails,
        glEntries: [
          ...result.groups.map((g) => ({
            glCode: g.vendorGLCode || '-',
            glDescription: `VENDOR - ${g.vendorName || '-'}`,
            costCenter: 'HEAD OFFICE',
            department: 'Finance',
            debitAmount: g.totalAmount,
            creditAmount: 0,
          })),
          {
            glCode: bank.bankCode || '-',
            glDescription: bank.bankName || '-',
            costCenter: 'HEAD OFFICE',
            department: 'Finance',
            debitAmount: 0,
            creditAmount: totalAmount,
          },
        ],
      })
      setShowPaymentEntry(true)

      // Remove paid entries from on-screen vendor list
      try {
        const toRemove = new Set(result.results.map((r) => r.invoiceNumber))
        setVendorData((prev) =>
          prev
            .map((v) => ({
              ...v,
              invoices: (v.invoices || []).filter((inv) => !toRemove.has(inv.invoiceNumber)),
            }))
            .filter((v) => v.invoices.length > 0)
        )
      } catch {
        // non-critical
      }

      setPendingAcceptedData(null)
    } catch (err) {
      toast.error(err.message || 'Error processing payments')
    } finally {
      setBankProcessing(false)
    }
  }

  // Calculated Summary Metrics
  const totalVendorsCount = summary?.totalVendors || pagination?.totalItems || vendorData.length || 0
  const totalPayableVal =
    parseFloat(summary?.totalAmount) ||
    vendorData.reduce((s, v) => s + (v.debitAmount || 0), 0)
  const totalInvoicesCount = vendorData.reduce((s, v) => s + (v.invoices?.length || 0), 0)

  // Backend-Driven Pagination Values
  const activePage = pagination?.currentPage || currentPage
  const totalPages = pagination?.totalPages || 1
  const totalItems = pagination?.totalItems || vendorData.length

  // Download Button State Logic
  const hasFilesToDownload = downloads?.bankFileUrl || downloads?.systemFileUrl
  const isDownloadBtnDisabled =
    !hasFilesToDownload || filesDownloaded || downloadingFiles || fileGenerating

  return (
    <div className="space-y-4">
      {/* Top Banner & Excel Upload / Download */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-green-500 px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white">Process Vendor Payments</h2>
            <p className="text-green-100 text-xs mt-0.5">
              Select vendor invoices below or upload a settlement payment file
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => loadPendingVendorPayments(activePage)}
              disabled={apiLoading || fileGenerating}
              className="text-xs font-semibold px-3 py-1.5 rounded-full bg-green-700/60 hover:bg-green-700 text-white border border-green-400/40 transition flex items-center gap-1"
              title="Refresh Pending Payments"
            >
              <span>🔄</span> Refresh
            </button>
            <button
              onClick={handleDownloadGeneratedFiles}
              disabled={isDownloadBtnDisabled}
              className={`flex items-center gap-1.5 text-xs sm:text-sm font-semibold px-3.5 py-1.5 sm:py-2 rounded-full transition shadow-sm ${
                !isDownloadBtnDisabled
                  ? 'bg-white text-green-700 hover:bg-green-50 border border-green-200 cursor-pointer active:scale-95'
                  : 'bg-green-400/70 text-green-100 cursor-not-allowed border border-green-300/40 opacity-80'
              }`}
            >
              {fileGenerating ? (
                <>
                  <Spinner size="sm" color="green" />
                  Generating Files…
                </>
              ) : downloadingFiles ? (
                <>
                  <Spinner size="sm" color="green" />
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
                    <span className="bg-green-600 text-white text-[10px] sm:text-xs rounded-full px-2 py-0.5 animate-pulse">
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
              Total Vendors
            </span>
            <p className="text-lg font-bold text-gray-800 mt-0.5">{totalVendorsCount}</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center text-green-600 font-bold text-sm">
            🏢
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
              Pending Invoices
            </span>
            <p className="text-lg font-bold text-gray-800 mt-0.5">{totalInvoicesCount}</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm">
            📑
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
              Total Amount Payable
            </span>
            <p className="text-lg font-bold text-green-700 mt-0.5">
              ₹{totalPayableVal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold text-sm">
            💰
          </div>
        </div>
      </div>

      {/* Invoice Management Grid */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        <div className="p-3 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center gap-2">
            Vendor Invoice Management
            {!apiLoading && (
              <span className="text-xs font-normal text-gray-400">
                (Page {activePage} of {totalPages} — {vendorData.length} vendors)
              </span>
            )}
          </h3>
          {apiLoading && <Spinner size="sm" color="green" />}
        </div>

        {apiLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center space-y-3">
              <Spinner size="lg" color="green" />
              <p className="text-xs sm:text-sm text-gray-500">Loading pending vendor payments…</p>
            </div>
          </div>
        ) : apiError ? (
          <div className="p-8 text-center space-y-3">
            <div className="text-3xl text-red-400">⚠️</div>
            <p className="text-xs sm:text-sm font-medium text-red-600">{apiError}</p>
            <button
              onClick={() => loadPendingVendorPayments(activePage)}
              className="text-xs font-semibold px-4 py-1.5 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
            >
              Retry Loading
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[420px]">
            {/* Left: Invoice Table */}
            <div className="border-r border-gray-100 h-full overflow-y-auto">
              <VendorInvoiceTable
                vendorData={vendorData}
                onInvoiceSelect={handleInvoiceSelect}
                onPaymentUpdate={handlePaymentUpdate}
                invoicePayments={invoicePayments}
                onVendorDataUpdate={setVendorData}
                onInvoiceApprove={handleInvoiceApproval}
              />
            </div>
            {/* Right: Invoice Viewer */}
            <div className="bg-gray-50 h-full">
              <div className="p-3 border-b border-gray-100">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Invoice Preview
                </h4>
              </div>
              <div className="max-h-[420px] overflow-y-auto">
                <InvoiceViewer selectedInvoice={selectedInvoice} />
              </div>
            </div>
          </div>
        )}

        {/* Backend-Controlled Responsive Pagination Bar */}
        <div className="border-t border-gray-100 p-3 bg-gray-50/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-gray-600">
            Showing Page <strong className="text-gray-800">{activePage}</strong> of{' '}
            <strong className="text-gray-800">{totalPages}</strong> ({totalItems} total vendors)
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handlePageChange(activePage - 1)}
              disabled={activePage <= 1 || apiLoading}
              className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${
                activePage > 1 && !apiLoading
                  ? 'bg-white border border-gray-200 text-gray-700 hover:bg-green-50 hover:text-green-700 hover:border-green-300 shadow-sm'
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
                    ? 'bg-green-600 text-white shadow-sm'
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
                  ? 'bg-white border border-gray-200 text-gray-700 hover:bg-green-50 hover:text-green-700 hover:border-green-300 shadow-sm'
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
        <PaymentPreviewModal
          data={parsedData}
          onClose={handleCloseModal}
          onRequestChanges={handleRequestChanges}
          onAccept={(acceptedData) => {
            setPendingAcceptedData(acceptedData)
            setIsModalOpen(false)
            setIsBankModalOpen(true)
          }}
        />
      )}

      {editMode && (
        <EditPaymentDetails
          data={editableData}
          setData={setParsedData}
          onCancel={handleCloseModal}
        />
      )}

      <PaymentBankSelectionModal
        isOpen={isBankModalOpen}
        onClose={() => {
          setIsBankModalOpen(false)
          setPendingAcceptedData(null)
        }}
        onBankSelect={handleBankConfirm}
        requestData={pendingAcceptedData}
        paymentType="vendor"
        loading={bankProcessing}
      />

      {showPaymentEntry && currentPaymentEntryData && (
        <PaymentEntryModal
          isOpen={showPaymentEntry}
          onClose={() => setShowPaymentEntry(false)}
          paymentData={currentPaymentEntryData}
        />
      )}
    </div>
  )
}

// ─── Root Page ────────────────────────────────────────────────────────────────
export default function ProcessPaymentPage() {
  const [activeTab, setActiveTab] = useState('vendor')

  // Shared vendor state
  const [parsedData, setParsedData] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editableData, setEditableData] = useState([])
  const [showPaymentEntry, setShowPaymentEntry] = useState(false)
  const [currentPaymentEntryData, setCurrentPaymentEntryData] = useState(null)
  const [vendorData, setVendorData] = useState([])
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [invoicePayments, setInvoicePayments] = useState({})
  const [approvedInvoices, setApprovedInvoices] = useState([])
  const [isBankModalOpen, setIsBankModalOpen] = useState(false)
  const [pendingAcceptedData, setPendingAcceptedData] = useState(null)

  const activeTabMeta = TABS.find((t) => t.id === activeTab)
  const headerColor = {
    green: 'from-green-600 to-green-500',
    blue: 'from-blue-600 to-blue-500',
    purple: 'from-purple-600 to-purple-500',
  }[activeTabMeta?.color || 'green']

  const renderContent = () => {
    switch (activeTab) {
      case 'vendor':
        return (
          <VendorPaymentsSection
            vendorData={vendorData}
            setVendorData={setVendorData}
            approvedInvoices={approvedInvoices}
            setApprovedInvoices={setApprovedInvoices}
            parsedData={parsedData}
            setParsedData={setParsedData}
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            editMode={editMode}
            setEditMode={setEditMode}
            editableData={editableData}
            setEditableData={setEditableData}
            selectedInvoice={selectedInvoice}
            setSelectedInvoice={setSelectedInvoice}
            invoicePayments={invoicePayments}
            setInvoicePayments={setInvoicePayments}
            showPaymentEntry={showPaymentEntry}
            setShowPaymentEntry={setShowPaymentEntry}
            currentPaymentEntryData={currentPaymentEntryData}
            setCurrentPaymentEntryData={setCurrentPaymentEntryData}
            isBankModalOpen={isBankModalOpen}
            setIsBankModalOpen={setIsBankModalOpen}
            pendingAcceptedData={pendingAcceptedData}
            setPendingAcceptedData={setPendingAcceptedData}
          />
        )
      case 'reliever':
        return <RelieverPaymentsSection />
      case 'conveyance':
        return <ConveyancePaymentsSection />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className={`bg-gradient-to-r ${headerColor} px-4 sm:px-6 py-5`}>
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl sm:text-3xl font-bold text-white tracking-tight">
            💳 Process Payments
          </h1>
          <p className="text-white/80 text-xs sm:text-sm mt-1">
            Manage and process vendor, reliever, and conveyance payments
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-5 space-y-5">
        {/* Tab Switcher */}
        <PaymentTypeTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Content */}
        {renderContent()}
      </div>
    </div>
  )
}

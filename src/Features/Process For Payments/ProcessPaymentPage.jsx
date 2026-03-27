import React, { useState, useEffect, useCallback } from 'react'
import { toast } from 'react-toastify'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

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
import {
  loadInvoicesFromLocalStorage,
  loadRentVouchersFromLocalStorage,
} from './utils/paymentHelpers'
import { processVendorPayments } from '../Master/utils/accountingHelpers'

// ─── Constants ────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'vendor',     label: 'Vendor Payments',     color: 'green'  },
  { id: 'reliever',   label: 'Reliever Payments',   color: 'blue'   },
  { id: 'conveyance', label: 'Conveyance Payments', color: 'purple' },
]

const TAB_ACTIVE_CLASSES = {
  green:  'border-green-500 text-green-700 bg-green-50',
  blue:   'border-blue-500 text-blue-700 bg-blue-50',
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
          className={`flex-1 min-w-max whitespace-nowrap py-2 px-3 sm:px-5 text-sm font-semibold rounded-lg transition-all duration-200 ${
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
  const [loading, setLoading] = useState(false)
  const [bankProcessing, setBankProcessing] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const invoiceData = loadInvoicesFromLocalStorage()
        const rentData = loadRentVouchersFromLocalStorage()
        const combined = [...invoiceData, ...rentData]
        setVendorData(combined)

        if (combined.length > 0) {
          const totalInv = combined.reduce((s, v) => s + v.invoices.length, 0)
          toast.info(`Loaded ${invoiceData.length} vendors (${totalInv} invoices) + ${rentData.length} rent vouchers`)
        } else {
          toast.info('No pending vendor payments found')
        }
      } catch (err) {
        toast.error('Failed to load vendor data')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

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

  // Generate bank upload data grouped by vendor
  const buildBankUploadRows = (approvedList) => {
    const groups = {}
    approvedList.forEach((inv) => {
      if (!groups[inv.vendorId]) {
        groups[inv.vendorId] = {
          debitBankAccountNumber: inv.debitBankAccountNumber,
          totalPaidAmount: 0,
          currency: inv.currency || 'INR',
          beneficiaryAccountNumber: inv.beneficiaryAccountNumber,
          ifscCode: inv.ifscCode,
          narration: inv.narration,
        }
      }
      groups[inv.vendorId].totalPaidAmount += inv.paidAmount
    })
    return Object.values(groups).map((v) => ({
      'DEBIT BANK A/C NO': v.debitBankAccountNumber,
      'DEBIT AMT': v.totalPaidAmount,
      CUR: v.currency,
      'BENEFICIARY A/C NO': v.beneficiaryAccountNumber,
      'IFSC CODE': v.ifscCode,
      'NARRATION/NAME': v.narration,
    }))
  }

  const buildSystemUploadRows = (approvedList) => {
    const groups = {}
    approvedList.forEach((inv) => {
      if (!groups[inv.vendorId]) {
        groups[inv.vendorId] = {
          vendorName: inv.vendorName,
          invoices: [],
          totalOrig: 0,
          totalPaid: 0,
        }
      }
      groups[inv.vendorId].invoices.push(inv.invoiceNumber)
      groups[inv.vendorId].totalOrig += inv.originalAmount
      groups[inv.vendorId].totalPaid += inv.paidAmount
    })
    return Object.values(groups).map((g) => ({
      'Vendor Name': g.vendorName,
      'Invoice Numbers': g.invoices.join(', '),
      'Total Amount': g.totalOrig,
      'Payment Done': g.totalPaid,
      'Remaining Payment': g.totalOrig - g.totalPaid,
      UTR: '',
    }))
  }

  const handleDownloadTemplate = () => {
    if (approvedInvoices.length === 0) {
      toast.warning('No approved invoices. Please approve some invoices first.')
      return
    }
    try {
      const ts = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '')

      const bankRows = buildBankUploadRows(approvedInvoices)
      const bankWb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(bankWb, XLSX.utils.json_to_sheet(bankRows), 'Bank_Payment_File')
      saveAs(
        new Blob([XLSX.write(bankWb, { bookType: 'xlsx', type: 'array' })], {
          type: 'application/octet-stream',
        }),
        `Bank_Payment_File_${ts}.xlsx`
      )

      const sysRows = buildSystemUploadRows(approvedInvoices)
      const sysWb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(sysWb, XLSX.utils.json_to_sheet(sysRows), 'System_Upload_File')
      saveAs(
        new Blob([XLSX.write(sysWb, { bookType: 'xlsx', type: 'array' })], {
          type: 'application/octet-stream',
        }),
        `System_Upload_File_${ts}.xlsx`
      )

      setApprovedInvoices([])
      toast.success(`Downloaded Bank + System files for ${approvedInvoices.length} invoice(s).`)
    } catch (err) {
      toast.error('Failed to generate download files')
    }
  }

  const handleInvoiceApproval = (selectedVendors, currentPayments = {}) => {
    const selectedIds = Object.keys(selectedVendors).filter((id) => selectedVendors[id])
    if (selectedIds.length === 0) {
      toast.warning('Please select at least one vendor to approve')
      return
    }

    const updatedVendors = []
    const newlyApproved = []
    let processedCount = 0

    vendorData.forEach((vendor) => {
      if (!selectedVendors[vendor.id]) {
        updatedVendors.push(vendor)
        return
      }
      const updatedInvoices = []

      vendor.invoices.forEach((invoice) => {
        const payment = currentPayments[invoice.id] ||
          invoicePayments[invoice.id] || { amount: invoice.amount, paymentType: 'full' }
        const paymentType = payment?.paymentType || 'full'
        let paidAmount = paymentType === 'full' ? invoice.amount : Number(payment?.amount || 0)

        if (paidAmount > invoice.amount) {
          toast.warning(`Payment exceeds invoice amount for ${invoice.invoiceNumber}. Using full amount.`)
          paidAmount = invoice.amount
        }

        if (paidAmount > 0) {
          newlyApproved.push({
            vendorId: vendor.id,
            vendorName: vendor.vendorName,
            debitBankAccountNumber: vendor.debitBankAccountNumber,
            currency: vendor.currency || 'INR',
            beneficiaryAccountNumber: vendor.beneficiaryAccountNumber,
            ifscCode: vendor.ifscCode,
            narration: (vendor.narration || vendor.vendorName).substring(0, 20),
            invoiceId: invoice.id,
            invoiceNumber: invoice.invoiceNumber,
            originalAmount: invoice.amount,
            paidAmount,
            paymentType,
            type: invoice.type,
            invoiceTypeLabel: invoice.invoiceTypeLabel,
            approvedDate: new Date().toISOString(),
            source: invoice.source,
          })
          processedCount++
        }

        if (paymentType === 'full' || paidAmount >= invoice.amount) return
        if (paymentType === 'partial' && paidAmount > 0 && paidAmount < invoice.amount) {
          updatedInvoices.push({ ...invoice, amount: invoice.amount - paidAmount })
        } else if (paymentType === 'partial' && paidAmount <= 0) {
          updatedInvoices.push(invoice)
        }
      })

      if (updatedInvoices.length > 0) {
        updatedVendors.push({
          ...vendor,
          invoices: updatedInvoices,
          debitAmount: updatedInvoices.reduce((s, i) => s + i.amount, 0),
        })
      }
    })

    setApprovedInvoices((prev) => [...prev, ...newlyApproved])

    // Data is directly synced in component state for this session

    if (processedCount === 0) {
      toast.warning('No valid payments processed. Check amounts and selections.')
    } else {
      toast.success(`${processedCount} invoice(s) processed successfully.`)
    }
    setVendorData(updatedVendors)

    // Clear payment state for approved invoices
    const clearedPayments = { ...invoicePayments }
    vendorData.forEach((vendor) => {
      if (selectedVendors[vendor.id]) {
        vendor.invoices.forEach((inv) => delete clearedPayments[inv.id])
      }
    })
    setInvoicePayments(clearedPayments)
  }

  // ── Bank selection confirm handler ─────────────────────────────────────────
  const handleBankConfirm = async (bank) => {
    setIsBankModalOpen(false)
    setBankProcessing(true)
    try {
      const payments = []
      const approved = approvedInvoices || []

      ;(pendingAcceptedData || []).forEach((row) => {
        const vendorName = row['Vendor Name']
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
            vendorGLCode: match?.vendorGLCode,
          })
        })
      })

      const result = processVendorPayments(payments, bank)
      if (!result.success) {
        toast.error(result.message || 'Failed to post vendor payments')
        return
      }
      toast.success(result.message)

      // Remove paid invoices from localStorage sources
      try {
        const paidNos = new Set(result.results.map((r) => r.invoiceNumber))
        ;['processed_invoices', 'final_processed_invoices', 'oneTimeFinalProcessedInvoice'].forEach(
          (key) => {
            const arr = JSON.parse(localStorage.getItem(key) || '[]')
            localStorage.setItem(
              key,
              JSON.stringify(arr.filter((inv) => !paidNos.has(inv.invoiceNo || inv.invoiceNumber)))
            )
          }
        )
        toast.info(`Removed ${paidNos.size} invoice(s) from approval queues`)
      } catch {
        // non-critical cleanup
      }

      // Build payment entry display data
      const totalAmount = result.totalPaid
      const vendorDetails = result.groups.map((g) => ({
        vendorName: g.vendorName,
        vendorGLCode: g.vendorGLCode,
        totalAmount: g.totalAmount,
        invoices: g.invoices.map((inv) => ({
          invoiceNumber: inv.invoiceNumber,
          originalAmount: inv.amount,
          paidAmount: inv.amount,
          paymentType: 'full',
        })),
      }))

      setCurrentPaymentEntryData({
        entryNo: `PE-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`,
        date: new Date().toISOString().split('T')[0],
        vendor:
          vendorDetails.length > 1
            ? `Multiple Vendors (${vendorDetails.length})`
            : vendorDetails[0]?.vendorName || '',
        vendorCode: vendorDetails.length > 1 ? 'MULTIPLE' : '',
        amount: totalAmount,
        paymentMethod: 'Bank Transfer',
        bankAccount: `${bank.bankName} (${bank.bankCode})`,
        invoiceNo: result.results.map((r) => r.invoiceNumber).join(', '),
        particulars: `Payment for invoices: ${result.results.map((r) => r.invoiceNumber).join(', ')}`,
        gstAmount: 0,
        netAmount: totalAmount,
        status: 'Posted',
        preparedBy: 'Account Executive',
        approvedBy: 'System',
        remarks: 'Auto-posted via Process of Payments',
        vendorDetails,
        glEntries: [
          ...result.groups.map((g) => ({
            glCode: g.vendorGLCode,
            glDescription: `VENDOR - ${g.vendorName}`,
            costCenter: 'HEAD OFFICE',
            department: 'Finance',
            debitAmount: g.totalAmount,
            creditAmount: 0,
          })),
          {
            glCode: bank.bankCode,
            glDescription: bank.bankName,
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

  return (
    <div className="space-y-4">
      {/* Top Card: Upload + Download */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-green-500 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white">Process Vendor Payments</h2>
            <p className="text-green-100 text-xs mt-0.5">
              Upload a payment file or approve from the invoice list below
            </p>
          </div>
          <button
            onClick={handleDownloadTemplate}
            disabled={approvedInvoices.length === 0}
            className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full transition shadow-sm ${
              approvedInvoices.length > 0
                ? 'bg-white text-green-700 hover:bg-green-50 border border-green-200'
                : 'bg-green-400 text-green-100 cursor-not-allowed border border-green-300'
            }`}
          >
            ⬇ Download Files
            {approvedInvoices.length > 0 && (
              <span className="bg-green-600 text-white text-xs rounded-full px-2 py-0.5">
                {approvedInvoices.length}
              </span>
            )}
          </button>
        </div>
        <div className="p-4">
          <UploadPaymentFile onFileUpload={handleFileUpload} />
        </div>
      </div>

      {/* Invoice Management */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-3 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700">
            Vendor Invoice Management
            {!loading && (
              <span className="ml-2 text-xs font-normal text-gray-400">
                ({vendorData.length} vendors)
              </span>
            )}
          </h3>
          {loading && <Spinner size="sm" color="green" />}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center space-y-3">
              <Spinner size="lg" color="green" />
              <p className="text-sm text-gray-500">Loading vendor invoices…</p>
            </div>
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

  // Shared vendor state (lifted from VendorPaymentsSection)
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
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            💳 Process Payments
          </h1>
          <p className="text-white/80 text-sm mt-1">
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

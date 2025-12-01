/* eslint-disable no-debugger */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import UploadPaymentFile from './Components/UploadPaymentFile'
import PaymentPreviewModal from './Components/PaymentPreviewModal'
import EditPaymentDetails from './Components/EditPaymentDetails'
import { parseExcelFile } from './utils/excelParser'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import VendorInvoiceTable from './Components/VendorInvoiceTable'
import InvoiceViewer from './Components/InvoiceReviewer'
import { toast } from 'react-toastify'
import PaymentEntryModal from './Components/PaymentEntryModal'
// import AEBankSelectionModal from '../Advance Request/Components/AEBankSelectionModal'
import { processVendorPayments } from '../Master/utils/accountingHelpers'
import RelieverPaymentsSection from './Components/RelieverPaymentSection'
import ConveyancePaymentsSection from './Components/ConveyancePaymentsSection'
import { processConveyanceBankPayments } from '../Master/utils/accountingHelpers'
import PaymentBankSelectionModal from './Components/PaymentBankSelectonModal'

// Function to load and transform invoices from localStorage
// ✅ FIXED: More flexible filtering for approved invoices
const loadInvoicesFromLocalStorage = () => {
  try {
    const processedInvoicesStr = localStorage.getItem('processed_invoices')
    const processedInvoices = processedInvoicesStr ? JSON.parse(processedInvoicesStr) : []

    const finalProcessedInvoicesStr = localStorage.getItem('final_processed_invoices')
    const finalProcessedInvoices = finalProcessedInvoicesStr
      ? JSON.parse(finalProcessedInvoicesStr)
      : []

    const allInvoices = [...processedInvoices, ...finalProcessedInvoices]

    console.log('🔍 DEBUG: All invoices loaded:', allInvoices)

    // ✅ Filter invoices based on YOUR approval workflow
    const filteredInvoices = allInvoices.filter((invoice) => {
      const approvalStatus = invoice.approvalStatus || invoice.status || invoice.approval_status

      // ✅ Include invoices that are either:
      // 1. Fully approved (various possible statuses)
      // 2. Approved by AM/BM (ready for payment)
      // 3. OR any invoice processed by AM/BM (in processed_invoices or final_processed_invoices)

      const isApproved =
        approvalStatus === 'Approved' ||
        approvalStatus === 'Approved by AM' ||
        approvalStatus === 'Approved by BM' ||
        approvalStatus === 'Processed by AM' ||
        approvalStatus === 'Processed by BM' ||
        approvalStatus?.includes('Final Approved') ||
        invoice.processedAtAM || // Has been processed by AM
        invoice.processedAtBM // Has been processed by BM

      console.log('🔍 Invoice check:', {
        invoiceNumber: invoice.invoiceNumber,
        approvalStatus,
        processedAtAM: invoice.processedAtAM,
        processedAtBM: invoice.processedAtBM,
        willInclude: isApproved,
      })

      return isApproved
    })

    console.log('✅ Filtered invoices:', filteredInvoices.length, 'out of', allInvoices.length)

    const vendorMap = {}

    filteredInvoices.forEach((invoice, index) => {
      const vendorName = invoice.vendorName

      if (!vendorMap[vendorName]) {
        const uniqueId = `VENDOR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

        vendorMap[vendorName] = {
          id: uniqueId,
          vendorName: vendorName,
          debitBankAccountNumber: generateBankAccount(vendorName),
          debitAmount: 0,
          currency: 'INR',
          beneficiaryAccountNumber: extractBeneficiaryAccount(invoice),
          ifscCode: extractIFSCCode(invoice),
          narration: vendorName.substring(0, 20),
          invoices: [],
        }
      }

      let invoiceTypeLabel = ''
      if (invoice.type === 'Material') {
        invoiceTypeLabel = 'Material Invoice'
      } else if (invoice.type === 'Fixed Asset') {
        invoiceTypeLabel = 'Fixed Asset'
      } else if (invoice.type === 'Procurement Prepaid') {
        invoiceTypeLabel = 'Uniform Prepaid'
      } else {
        invoiceTypeLabel = invoice.type || 'Invoice'
      }

      const invoiceId = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${index}`

      vendorMap[vendorName].invoices.push({
        id: invoiceId,
        invoiceNumber: invoice.invoiceNumber,
        amount: invoice.totalAmount,
        documentUrl: invoice.documentUrl || '/public/DxotBTxfHn.png',
        type: invoice.type,
        invoiceTypeLabel: invoiceTypeLabel,
        gstRate: invoice.gstRate,
        hsnCode: invoice.hsnCode,
        processedAt: invoice.processedAt || invoice.processedAtAM || invoice.processedAtBM,
        vendorGLCode: invoice.vendor_gl_code || invoice.vendorGLCode,
        voucherNo: invoice.voucher_id || invoice.purchaseVoucherNo,
      })

      vendorMap[vendorName].debitAmount += invoice.totalAmount
    })

    const vendorData = Object.values(vendorMap)
    console.log('✅ Final vendor data:', vendorData)

    return vendorData
  } catch (error) {
    console.error('Error loading invoices from localStorage:', error)
    toast.error('Failed to load invoices from storage')
    return []
  }
}

const loadRentVouchersFromLocalStorage = () => {
  try {
    const rentVouchersStr = localStorage.getItem('vendorVouchers')
    const rentVouchers = rentVouchersStr ? JSON.parse(rentVouchersStr) : []

    console.log('Loaded rent vouchers from localStorage:', rentVouchers)

    // Transform rent vouchers to match vendor data structure
    const vendorMap = {}

    rentVouchers.forEach((voucher, index) => {
      if (voucher.status === 'Approved' && voucher.paymentStatus === 'Pending Payment') {
        const vendorName = voucher.vendorDetails?.vendorName || voucher.ownerName

        // ✅ FIX: Create TRULY unique vendor ID using timestamp + random
        const vendorId = `RENT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${index}`

        if (!vendorMap[vendorId]) {
          vendorMap[vendorId] = {
            id: vendorId, // ✅ Use unique ID
            vendorName: vendorName,
            debitBankAccountNumber: generateBankAccount(vendorName),
            debitAmount: 0,
            currency: 'INR',
            beneficiaryAccountNumber: extractBeneficiaryAccount(voucher),
            ifscCode: extractIFSCCode(voucher),
            narration: `Rent Payment - ${voucher.siteName}`,
            invoices: [],
            isRentVoucher: true,
          }
        }

        // ✅ FIX: Create unique invoice ID
        const invoiceId = `RENT-INV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${index}`

        vendorMap[vendorId].invoices.push({
          id: invoiceId, // ✅ Use unique invoice ID
          invoiceNumber: voucher.accounting?.voucherNo || `RENT-${voucher.month}`,
          amount: voucher.amount,
          documentUrl: null,
          type: 'Rent Payment',
          invoiceTypeLabel: 'Rent Voucher',
          gstRate: voucher.gstDetails?.rate || 0,
          hsnCode: null,
          processedAt: voucher.workflow?.generatedAt,
          vendorGLCode: voucher.vendorDetails?.vendorGL,
          voucherNo: voucher.accounting?.voucherNo,
          isRentVoucher: true,
          rentDetails: {
            month: voucher.month,
            siteName: voucher.siteName,
            siteLocation: voucher.siteLocation,
            agreementId: voucher.agreementId,
            baseRent: voucher.breakdown?.baseRent,
            gstAmount: voucher.breakdown?.gst,
            gstType: voucher.gstType,
          },
          vendorDetails: voucher.vendorDetails,
        })

        vendorMap[vendorId].debitAmount += voucher.amount
      }
    })

    return Object.values(vendorMap)
  } catch (error) {
    console.error('Error loading rent vouchers:', error)
    return []
  }
}

// Helper function to generate bank account number (for debit account)
const generateBankAccount = (vendorName) => {
  // Generate a pseudo-random bank account based on vendor name
  const hash = vendorName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return `${123456789000 + (hash % 10000)}`
}

// Helper function to extract beneficiary account
// Update extractBeneficiaryAccount to handle rent vouchers
const extractBeneficiaryAccount = (invoiceOrVoucher) => {
  // For rent vouchers
  if (invoiceOrVoucher.vendorDetails?.vendorGL) {
    const glCode = invoiceOrVoucher.vendorDetails.vendorGL
    const match = glCode.match(/\d+/)
    if (match) {
      return `987654${match[0].substring(0, 6)}`
    }
  }

  // For regular invoices (existing logic)
  if (invoiceOrVoucher.vendor_gl_mappings && invoiceOrVoucher.vendor_gl_mappings.payable_gl_code) {
    const glCode = invoiceOrVoucher.vendor_gl_mappings.payable_gl_code
    const match = glCode.match(/\d+/)
    if (match) {
      return `987654${match[0].substring(0, 6)}`
    }
  }

  // Generate based on vendor name
  const vendorName = invoiceOrVoucher.vendorName || invoiceOrVoucher.vendorDetails?.vendorName
  if (vendorName) {
    const hash = vendorName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return `987654${String(321000 + (hash % 10000))}`
  }

  return '987654321000'
}

// Helper function to extract IFSC code
const extractIFSCCode = (invoiceOrVoucher) => {
  const vendorName = invoiceOrVoucher.vendorName || invoiceOrVoucher.vendorDetails?.vendorName
  if (vendorName) {
    const vendorHash = vendorName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const banks = ['HDFC', 'ICIC', 'SBIN', 'YESB', 'AXIS']
    const bankIndex = vendorHash % banks.length
    const branchCode = String(1000 + (vendorHash % 9000)).padStart(4, '0')
    return `${banks[bankIndex]}0${branchCode}`
  }
  return 'HDFC0000123'
}

// Add this function to validate and clean vendor data
const validateAndCleanVendorData = (data) => {
  if (!Array.isArray(data)) return []

  return data
    .filter(
      (vendor) =>
        vendor && vendor.vendorName && Array.isArray(vendor.invoices) && vendor.invoices.length > 0
    )
    .map((vendor) => ({
      ...vendor,
      invoices: vendor.invoices.filter(
        (invoice) =>
          invoice &&
          invoice.invoiceNumber &&
          typeof invoice.amount === 'number' &&
          invoice.amount >= 0
      ),
    }))
    .filter((vendor) => vendor.invoices.length > 0)
}

// New Tab Components (Placeholders for now)
const RelieverPayments = () => {
  return <RelieverPaymentsSection />
}

const ConveyancePayments = () => {
  return <ConveyancePaymentsSection />
}

// Payment Type Tabs Component
const PaymentTypeTabs = ({ activeTab, onTabChange }) => {
  const getTabClass = (tabId) => {
    const baseClass = 'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'

    if (activeTab === tabId) {
      switch (tabId) {
        case 'vendor':
          return `${baseClass} border-green-500 text-green-600`
        case 'reliever':
          return `${baseClass} border-blue-500 text-blue-600`
        case 'conveyance':
          return `${baseClass} border-purple-500 text-purple-600`
        default:
          return `${baseClass} border-green-500 text-green-600`
      }
    } else {
      return `${baseClass} border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300`
    }
  }

  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="-mb-px flex space-x-8">
        <button onClick={() => onTabChange('vendor')} className={getTabClass('vendor')}>
          Vendor Payments
        </button>
        <button onClick={() => onTabChange('reliever')} className={getTabClass('reliever')}>
          Reliever Payments
        </button>
        <button onClick={() => onTabChange('conveyance')} className={getTabClass('conveyance')}>
          Conveyance Payments
        </button>
      </nav>
    </div>
  )
}

// Vendor Payments Component (your existing functionality)
const VendorPaymentsSection = ({
  vendorData,
  setVendorData,
  approvedInvoices,
  setApprovedInvoices,
  onFileUpload,
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
  selectedBankForPayment,
  setSelectedBankForPayment,
}) => {
  // Load vendor data on component mount
  useEffect(() => {
    const loadInitialData = () => {
      try {
        // ✅ Load ONLY from fresh sources (no persisted data loading)
        const loadedVendorData = loadInvoicesFromLocalStorage()
        const rentVouchersData = loadRentVouchersFromLocalStorage()

        // Combine fresh data only
        const combinedVendorData = [...loadedVendorData, ...rentVouchersData]

        setVendorData(combinedVendorData)

        if (combinedVendorData.length > 0) {
          const regularCount = loadedVendorData.length
          const rentCount = rentVouchersData.length
          const totalInvoices = combinedVendorData.reduce(
            (sum, vendor) => sum + vendor.invoices.length,
            0
          )

          toast.info(
            `Loaded ${regularCount} vendors (${totalInvoices} invoices) + ${rentCount} rent vouchers`
          )
        } else {
          toast.info('No pending payments found')
        }
      } catch (error) {
        console.error('Error loading initial data:', error)
        toast.error('Failed to load vendor data')
      }
    }

    loadInitialData()
  }, [])

  // Add this function to persist vendor data
  const persistVendorDataToLocalStorage = (vendorData) => {
    try {
      // Store the current state of vendor data
      localStorage.setItem('vendor_payment_data', JSON.stringify(vendorData))
      console.log('Vendor data persisted to localStorage:', vendorData.length, 'vendors')
    } catch (error) {
      console.error('Error persisting vendor data:', error)
    }
  }

  // Add this cleanup function to VendorPaymentsSection
  const clearAllPersistedData = () => {
    try {
      localStorage.removeItem('vendor_payment_data')
      localStorage.removeItem('vendor_payment_selections')
      localStorage.removeItem('vendor_selection_state')
      setVendorData([])
      setApprovedInvoices([])
      setInvoicePayments({})
      toast.info('Cleared all persisted vendor data')
    } catch (error) {
      console.error('Error clearing persisted data:', error)
      toast.error('Failed to clear persisted data')
    }
  }

  const handleFileUpload = async (file) => {
    const data = await parseExcelFile(file)
    setParsedData(data)
    setIsModalOpen(true)
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

  // Handle invoice selection for viewing
  const handleInvoiceSelect = (invoice) => {
    setSelectedInvoice(invoice)
  }

  // Handle payment amount updates
  const handlePaymentUpdate = (invoiceId, amount, paymentType) => {
    setInvoicePayments((prev) => ({
      ...prev,
      [invoiceId]: {
        amount: amount,
        paymentType: paymentType,
        updatedAt: new Date().toISOString(),
      },
    }))
  }

  // Generate System Upload File
  const generateSystemUploadFile = (approvedInvoices) => {
    // Group approved invoices by vendor
    const vendorGroups = {}

    approvedInvoices.forEach((invoice) => {
      if (!vendorGroups[invoice.vendorId]) {
        vendorGroups[invoice.vendorId] = {
          vendorName: invoice.vendorName,
          invoices: [],
        }
      }
      vendorGroups[invoice.vendorId].invoices.push(invoice)
    })

    // Create system upload data
    const systemUploadData = []

    Object.values(vendorGroups).forEach((vendor) => {
      const totalOriginalAmount = vendor.invoices.reduce((sum, inv) => sum + inv.originalAmount, 0)
      const totalPaidAmount = vendor.invoices.reduce((sum, inv) => sum + inv.paidAmount, 0)
      const totalRemainingAmount = totalOriginalAmount - totalPaidAmount

      const invoiceNumbers = vendor.invoices.map((inv) => inv.invoiceNumber).join(', ')

      systemUploadData.push({
        'Vendor Name': vendor.vendorName,
        'Invoice Numbers': invoiceNumbers,
        'Total Amount': totalOriginalAmount,
        'Payment Done': totalPaidAmount,
        'Remaining Payment': totalRemainingAmount,
        UTR: '',
      })
    })

    return systemUploadData
  }

  // Download function - generates both files
  const handleDownloadTemplate = () => {
    if (approvedInvoices.length === 0) {
      toast.warning('No approved invoices found. Please approve some invoices first.')
      return
    }

    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '')

    // 1. Generate Bank Upload File - GROUP BY VENDOR
    const vendorPaymentGroups = {}

    // Group approved invoices by vendor for bank file
    approvedInvoices.forEach((invoice) => {
      const vendorKey = invoice.vendorId

      if (!vendorPaymentGroups[vendorKey]) {
        vendorPaymentGroups[vendorKey] = {
          debitBankAccountNumber: invoice.debitBankAccountNumber,
          totalPaidAmount: 0,
          currency: invoice.currency,
          beneficiaryAccountNumber: invoice.beneficiaryAccountNumber,
          ifscCode: invoice.ifscCode,
          narration: invoice.narration,
          vendorName: invoice.vendorName,
        }
      }

      // Add this invoice's paid amount to vendor total
      vendorPaymentGroups[vendorKey].totalPaidAmount += invoice.paidAmount
    })

    // Convert grouped data to bank upload format
    const bankUploadData = Object.values(vendorPaymentGroups).map((vendor) => ({
      'DEBIT BANK A/C NO': vendor.debitBankAccountNumber,
      'DEBIT AMT': vendor.totalPaidAmount,
      CUR: vendor.currency,
      'BENEFICIARY A/C NO': vendor.beneficiaryAccountNumber,
      'IFSC CODE': vendor.ifscCode,
      'NARRATION/NAME': vendor.narration,
    }))

    // Create Bank Upload Excel file
    const bankWorksheet = XLSX.utils.json_to_sheet(bankUploadData)
    const bankWorkbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(bankWorkbook, bankWorksheet, 'Bank_Payment_File')

    // Auto-size columns for bank file
    const bankColWidths = []
    const bankHeaders = Object.keys(bankUploadData[0] || {})
    bankHeaders.forEach((header, index) => {
      const maxLength = Math.max(
        header.length,
        ...bankUploadData.map((row) => String(row[header] || '').length)
      )
      bankColWidths[index] = { width: Math.min(maxLength + 2, 30) }
    })
    bankWorksheet['!cols'] = bankColWidths

    const bankExcelBuffer = XLSX.write(bankWorkbook, {
      bookType: 'xlsx',
      type: 'array',
    })

    const bankBlob = new Blob([bankExcelBuffer], {
      type: 'application/octet-stream',
    })

    saveAs(bankBlob, `Bank_Payment_File_${timestamp}.xlsx`)

    // 2. Generate System Upload File (new functionality)
    const systemUploadData = generateSystemUploadFile(approvedInvoices)

    // Create System Upload Excel file
    const systemWorksheet = XLSX.utils.json_to_sheet(systemUploadData)
    const systemWorkbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(systemWorkbook, systemWorksheet, 'System_Upload_File')

    // Auto-size columns for system file
    const systemColWidths = []
    const systemHeaders = Object.keys(systemUploadData[0] || {})
    systemHeaders.forEach((header, index) => {
      const maxLength = Math.max(
        header.length,
        ...systemUploadData.map((row) => String(row[header] || '').length)
      )
      systemColWidths[index] = { width: Math.min(maxLength + 2, 40) }
    })
    systemWorksheet['!cols'] = systemColWidths

    const systemExcelBuffer = XLSX.write(systemWorkbook, {
      bookType: 'xlsx',
      type: 'array',
    })

    const systemBlob = new Blob([systemExcelBuffer], {
      type: 'application/octet-stream',
    })

    saveAs(systemBlob, `System_Upload_File_${timestamp}.xlsx`)

    const downloadedCount = approvedInvoices.length
    const vendorCount = Object.keys(vendorPaymentGroups).length // Use actual vendor count from bank file

    // 🔥 CLEAR approved invoices after successful download
    setApprovedInvoices([])

    toast.success(
      `Both files downloaded successfully! Bank file: ${vendorCount} vendors (${downloadedCount} invoices), System file: ${vendorCount} vendors. Ready for new approvals.`
    )

    console.log('Approved invoices cleared after download')
  }

  // Store approved invoices before deleting them
  const handleInvoiceApproval = (selectedVendors, currentPayments = {}) => {
    // Check if any vendors are selected
    const selectedVendorIds = Object.keys(selectedVendors).filter((id) => selectedVendors[id])
    if (selectedVendorIds.length === 0) {
      toast.warning('Please select at least one vendor to approve')
      return
    }

    const updatedVendors = []
    const newlyApprovedInvoices = []
    let processedCount = 0

    vendorData.forEach((vendor) => {
      const isVendorSelected = selectedVendors[vendor.id]
      if (!isVendorSelected) {
        updatedVendors.push(vendor)
        return
      }

      const updatedInvoices = []

      vendor.invoices.forEach((invoice) => {
        const payment = currentPayments[invoice.id] ||
          invoicePayments[invoice.id] || { amount: invoice.amount, paymentType: 'full' }

        const fullAmount = invoice.amount
        const paymentType = payment?.paymentType || 'full'

        // FIXED: Handle partial payment with 0 amount - keep the invoice
        let paidAmount = paymentType === 'full' ? fullAmount : Number(payment?.amount || 0)

        // Validate payment amount
        if (paidAmount > fullAmount) {
          toast.warning(
            `Payment amount (${paidAmount}) exceeds invoice amount (${fullAmount}) for invoice ${invoice.invoiceNumber}. Using full amount.`
          )
          paidAmount = fullAmount
        }

        console.log(`Processing Invoice ${invoice.invoiceNumber}:`, {
          originalAmount: fullAmount,
          paidAmount,
          paymentType,
          payment,
        })

        // Store approved invoice data only if payment is made
        if (paidAmount > 0) {
          newlyApprovedInvoices.push({
            vendorId: vendor.id,
            vendorName: vendor.vendorName,
            debitBankAccountNumber: vendor.debitBankAccountNumber,
            debitAmount: paidAmount,
            currency: vendor.currency || 'INR',
            beneficiaryAccountNumber: vendor.beneficiaryAccountNumber,
            ifscCode: vendor.ifscCode,
            narration: vendor.narration
              ? vendor.narration.substring(0, 20)
              : vendor.vendorName.substring(0, 20),
            invoiceId: invoice.id,
            invoiceNumber: invoice.invoiceNumber,
            originalAmount: fullAmount,
            paidAmount: paidAmount,
            paymentType: paymentType,
            type: invoice.type,
            invoiceTypeLabel: invoice.invoiceTypeLabel,
            approvedDate: new Date().toISOString(),
            utr: 'Bank',
          })
          processedCount++
        }

        // Full payment → remove invoice completely
        if (paymentType === 'full' || paidAmount >= fullAmount) {
          console.log(`Full payment for ${invoice.invoiceNumber} - removing from table`)
          return
        }

        // Partial payment with amount > 0 → keep with reduced amount
        if (paymentType === 'partial' && paidAmount > 0 && paidAmount < fullAmount) {
          const remainingAmount = fullAmount - paidAmount
          console.log(
            `Partial payment for ${invoice.invoiceNumber} - keeping with remaining amount: ${remainingAmount}`
          )

          updatedInvoices.push({
            ...invoice,
            amount: remainingAmount,
          })
        }
        // FIXED: Partial payment with 0 amount → keep original invoice unchanged
        else if (paymentType === 'partial' && paidAmount <= 0) {
          console.log(
            `Partial payment with 0 amount for ${invoice.invoiceNumber} - keeping original`
          )
          updatedInvoices.push(invoice)
        }
      })

      // If there are still invoices left → vendor stays
      if (updatedInvoices.length > 0) {
        const newDebitAmount = updatedInvoices.reduce((sum, inv) => sum + inv.amount, 0)

        updatedVendors.push({
          ...vendor,
          invoices: updatedInvoices,
          debitAmount: newDebitAmount,
        })
      }
      // If no invoices left, vendor is completely removed from the table
    })

    // Update approved invoices state
    setApprovedInvoices((prev) => [...prev, ...newlyApprovedInvoices])

    // FIXED: Persist the updated vendor data to localStorage
    persistVendorDataToLocalStorage(updatedVendors)

    if (processedCount === 0) {
      toast.warning('No valid payments processed. Check payment amounts and selections.')
    } else {
      toast.success(`${processedCount} invoice(s) processed successfully.`)
    }

    setVendorData(updatedVendors)

    // Clear payment data for processed invoices
    const newInvoicePayments = { ...invoicePayments }
    vendorData.forEach((vendor) => {
      if (selectedVendors[vendor.id]) {
        vendor.invoices.forEach((invoice) => {
          delete newInvoicePayments[invoice.id]
        })
      }
    })
    setInvoicePayments(newInvoicePayments)

    console.log('Updated vendor data:', updatedVendors)
    console.log('Newly approved invoices:', newlyApprovedInvoices)
  }

  return (
    <>
      {/* Original Payment Processing Section */}
      <div className="p-4 max-w-6xl mx-auto bg-white shadow-md rounded-md mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-green-600">Process Vendor Payments</h1>
          <button
            onClick={handleDownloadTemplate}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-200"
          >
            ⬇️ Download Payment Files ({approvedInvoices.length})
          </button>
          {/* Optional: Add clear data button */}
          {/* <button
            onClick={clearAllPersistedData}
            className="bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700 transition-colors duration-200"
          >
            Clear All Data
          </button> */}
        </div>

        <UploadPaymentFile onFileUpload={handleFileUpload} />

        {isModalOpen && (
          <PaymentPreviewModal
            data={parsedData}
            onClose={handleCloseModal}
            onRequestChanges={handleRequestChanges}
            onAccept={(acceptedData) => {
              // Store accepted data and open bank selection
              setPendingAcceptedData(acceptedData)
              setIsModalOpen(false)
              setIsBankModalOpen(true)
            }} // bank first
          />
        )}

        {editMode && (
          <EditPaymentDetails
            data={editableData}
            setData={setParsedData}
            onCancel={handleCloseModal}
          />
        )}
      </div>

      {/* New Vendor Invoice Management Section */}
      <div className="max-w-7xl mx-auto px-2 pb-4">
        <div className="bg-white overflow-hidden rounded shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[400px] gap-0">
            {/* Left Part - Vendor Invoice Table */}
            <div className="border-r border-gray-200 h-full">
              <div className="p-2 bg-gray-100 border-b border-gray-200">
                <h2 className="text-sm font-semibold text-gray-800">
                  Vendor Invoice Management ({vendorData.length} vendors)
                </h2>
              </div>
              <div className="h-full overflow-y-auto">
                <VendorInvoiceTable
                  vendorData={vendorData}
                  onInvoiceSelect={handleInvoiceSelect}
                  onPaymentUpdate={handlePaymentUpdate}
                  invoicePayments={invoicePayments}
                  onVendorDataUpdate={setVendorData}
                  onInvoiceApprove={handleInvoiceApproval}
                />
              </div>
            </div>
            {/* Right Part - Invoice Viewer */}
            <div className="bg-gray-50 h-full">
              <div className="p-2 border-b border-gray-200">
                <h2 className="text-sm font-semibold text-gray-800">Invoice Display</h2>
              </div>
              <div className="h-full max-h-[calc(400px-40px)] overflow-y-auto">
                <InvoiceViewer selectedInvoice={selectedInvoice} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bank Selection Modal - opens after Accept */}
      <PaymentBankSelectionModal
        isOpen={isBankModalOpen}
        onClose={() => {
          setIsBankModalOpen(false)
          setPendingAcceptedData(null)
        }}
        onBankSelect={(bank) => {
          setSelectedBankForPayment(bank)
          setIsBankModalOpen(false)

          try {
            // Build per-invoice payments from acceptedData by matching approvedInvoices
            const payments = []
            const approved = approvedInvoices || []

            ;(pendingAcceptedData || []).forEach((row) => {
              const vendorName = row['Vendor Name']
              const invoiceNumbers = String(row['Invoice Numbers'] || '')
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean)

              invoiceNumbers.forEach((invNo) => {
                // Try to find approved invoice with exact paidAmount
                const match = approved.find(
                  (a) => a.vendorName === vendorName && a.invoiceNumber === invNo
                )
                const amount = match ? parseFloat(match.paidAmount || 0) : 0
                const type = match?.type || match?.invoiceTypeLabel || 'Material'
                const vendorGLCode = match?.vendorGLCode

                // If no explicit match amount, fallback to even split (as earlier estimate)
                const fallbackAmount =
                  amount > 0
                    ? amount
                    : parseFloat(row['Payment Done'] || row['Total Amount'] || 0) /
                      Math.max(invoiceNumbers.length, 1)

                payments.push({
                  vendorName,
                  invoiceNumber: invNo,
                  amount: fallbackAmount,
                  type,
                  vendorGLCode,
                })
              })
            })

            const result = processVendorPayments(payments, bank)
            if (!result.success) {
              toast.error(result.message || 'Failed to post vendor payments')
              return
            }

            toast.success(result.message)

            // Delete processed invoices from localStorage stores
            try {
              const paidInvoiceNumbers = new Set(result.results.map((r) => r.invoiceNumber))
              const removePaid = (key) => {
                const arr = JSON.parse(localStorage.getItem(key) || '[]')
                const filtered = arr.filter((inv) => !paidInvoiceNumbers.has(inv.invoiceNumber))
                localStorage.setItem(key, JSON.stringify(filtered))
              }
              removePaid('processed_invoices') // AM processed (Material/Fixed Asset)
              removePaid('final_processed_invoices') // BM final processed (Prepaid/Uniform)
              toast.info(`Removed ${paidInvoiceNumbers.size} invoice(s) from approval queues`)
            } catch (e) {
              console.error('Error cleaning localStorage invoices:', e)
            }

            // Prepare a display payload for PaymentEntryModal with real GLs
            const totalAmount = result.totalPaid
            const allInvoiceNumbers = result.results.map((r) => r.invoiceNumber).join(', ')

            // Build vendor details from returned groups (real GL view per vendor ledger)
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

            const paymentEntryData = {
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
              invoiceNo: allInvoiceNumbers,
              particulars: `Payment for invoices: ${allInvoiceNumbers}`,
              gstAmount: 0,
              netAmount: totalAmount,
              status: 'Posted',
              preparedBy: 'Account Executive',
              approvedBy: 'System',
              remarks: 'Auto-posted via Process of Payments',
              vendorDetails,
              glEntries: [
                // Show each vendor ledger line
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
            }

            setCurrentPaymentEntryData(paymentEntryData)
            setShowPaymentEntry(true)

            // Update on-screen vendor list to remove paid invoices
            try {
              setVendorData((prev) => {
                const toRemove = new Set(result.results.map((r) => r.invoiceNumber))
                const updated = prev
                  .map((v) => ({
                    ...v,
                    invoices: (v.invoices || []).filter((inv) => !toRemove.has(inv.invoiceNumber)),
                  }))
                  .filter((v) => (v.invoices || []).length > 0)
                return updated
              })
            } catch (e) {
              console.error('Error updating vendorData after payment:', e)
            }

            // Clear modal states
            setPendingAcceptedData(null)
          } catch (e) {
            console.error(e)
            toast.error(e.message || 'Error processing payments')
          }
        }}
        requestData={pendingAcceptedData}
        paymentType="vendor"
      />

      {/* Payment Entry Modal */}
      {showPaymentEntry && (
        <PaymentEntryModal
          isOpen={showPaymentEntry}
          onClose={() => setShowPaymentEntry(false)}
          paymentData={currentPaymentEntryData}
        />
      )}
    </>
  )
}

export default function ProcessPaymentPage() {
  const [activePaymentTab, setActivePaymentTab] = useState('vendor')

  // Existing state variables (keep all your existing state)
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
  const [selectedBankForPayment, setSelectedBankForPayment] = useState(null)
  const [conveyanceData, setConveyanceData] = useState([])
  const [approvedConveyances, setApprovedConveyances] = useState([])
  const [conveyancePayments, setConveyancePayments] = useState({})

  // Render active tab content
  const renderActiveTab = () => {
    switch (activePaymentTab) {
      case 'vendor':
        return (
          <VendorPaymentsSection
            vendorData={vendorData}
            setVendorData={setVendorData}
            approvedInvoices={approvedInvoices}
            setApprovedInvoices={setApprovedInvoices}
            onFileUpload={async (file) => {
              const data = await parseExcelFile(file)
              setParsedData(data)
              setIsModalOpen(true)
            }}
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
            selectedBankForPayment={selectedBankForPayment}
            setSelectedBankForPayment={setSelectedBankForPayment}
          />
        )
      case 'reliever':
        return <RelieverPayments />
      case 'conveyance':
        return (
          <ConveyancePaymentsSection
            conveyanceData={conveyanceData}
            setConveyanceData={setConveyanceData}
            approvedConveyances={approvedConveyances}
            setApprovedConveyances={setApprovedConveyances}
            conveyancePayments={conveyancePayments}
            setConveyancePayments={setConveyancePayments}
          />
        )
      default:
        return (
          <VendorPaymentsSection
            vendorData={vendorData}
            setVendorData={setVendorData}
            approvedInvoices={approvedInvoices}
            setApprovedInvoices={setApprovedInvoices}
            onFileUpload={async (file) => {
              const data = await parseExcelFile(file)
              setParsedData(data)
              setIsModalOpen(true)
            }}
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
            selectedBankForPayment={selectedBankForPayment}
            setSelectedBankForPayment={setSelectedBankForPayment}
          />
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Process Payments</h1>
          <p className="text-gray-600 mt-2">Manage and process different types of payments</p>
        </div>

        {/* Payment Type Tabs */}
        <PaymentTypeTabs activeTab={activePaymentTab} onTabChange={setActivePaymentTab} />

        {/* Active Tab Content */}
        {renderActiveTab()}
      </div>
    </div>
  )
}

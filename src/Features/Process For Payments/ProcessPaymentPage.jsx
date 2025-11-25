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
import AEBankSelectionModal from '../Advance Request/Components/AEBankSelectionModal'
import { processVendorPayments } from '../Master/utils/accountingHelpers'
import RelieverPaymentsSection from './Components/RelieverPaymentSection'

// Function to load and transform invoices from localStorage
const loadInvoicesFromLocalStorage = () => {
  try {
    // Load invoices processed by AM (Material and Fixed Asset)
    const processedInvoicesStr = localStorage.getItem('processed_invoices')
    const processedInvoices = processedInvoicesStr ? JSON.parse(processedInvoicesStr) : []

    // Load invoices processed by BM (Procurement Prepaid)
    const finalProcessedInvoicesStr = localStorage.getItem('final_processed_invoices')
    const finalProcessedInvoices = finalProcessedInvoicesStr
      ? JSON.parse(finalProcessedInvoicesStr)
      : []

    // Combine both arrays
    const allInvoices = [...processedInvoices, ...finalProcessedInvoices]

    console.log('Loaded invoices from localStorage:', allInvoices)

    // Group invoices by vendor
    const vendorMap = {}

    allInvoices.forEach((invoice) => {
      const vendorName = invoice.vendorName

      if (!vendorMap[vendorName]) {
        // Create new vendor entry
        vendorMap[vendorName] = {
          id: Object.keys(vendorMap).length + 1,
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

      // Determine invoice type label
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

      // Add invoice to vendor
      vendorMap[vendorName].invoices.push({
        id: invoice.id || invoice.invoiceNumber,
        invoiceNumber: invoice.invoiceNumber,
        amount: invoice.totalAmount,
        documentUrl: invoice.documentUrl || '/public/DxotBTxfHn.png',
        type: invoice.type,
        invoiceTypeLabel: invoiceTypeLabel, // NEW: Add type label for display
        gstRate: invoice.gstRate,
        hsnCode: invoice.hsnCode,
        processedAt: invoice.processedAt || invoice.processedAtAM || invoice.processedAtBM,
        vendorGLCode: invoice.vendor_gl_code || invoice.vendorGLCode,
        voucherNo: invoice.voucher_id || invoice.purchaseVoucherNo,
      })

      // Update total debit amount for vendor
      vendorMap[vendorName].debitAmount += invoice.totalAmount
    })

    // Convert map to array
    const vendorData = Object.values(vendorMap)

    console.log('Transformed vendor data:', vendorData)

    return vendorData
  } catch (error) {
    console.error('Error loading invoices from localStorage:', error)
    toast.error('Failed to load invoices from storage')
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
const extractBeneficiaryAccount = (invoice) => {
  // Try to extract from vendor GL mappings or generate one
  if (invoice.vendor_gl_mappings && invoice.vendor_gl_mappings.payable_gl_code) {
    const glCode = invoice.vendor_gl_mappings.payable_gl_code
    const match = glCode.match(/\d+/)
    if (match) {
      return `987654${match[0].substring(0, 6)}`
    }
  }

  // Generate based on vendor name
  const hash = invoice.vendorName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return `987654${String(321000 + (hash % 10000))}`
}

// Helper function to extract IFSC code
const extractIFSCCode = (invoice) => {
  // Generate IFSC code based on vendor
  const vendorHash = invoice.vendorName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const banks = ['HDFC', 'ICIC', 'SBIN', 'YESB', 'AXIS']
  const bankIndex = vendorHash % banks.length
  const branchCode = String(1000 + (vendorHash % 9000)).padStart(4, '0')

  return `${banks[bankIndex]}0${branchCode}`
}

// New Tab Components (Placeholders for now)
const RelieverPayments = () => {
  return <RelieverPaymentsSection />
}

const ConveyancePayments = () => {
  return (
    <div className="p-6 text-center">
      <h2 className="text-xl font-bold text-green-600 mb-4">Conveyance Payments</h2>
      <p className="text-gray-600">Conveyance payment functionality will be implemented here.</p>
      <div className="mt-4 p-4 bg-green-50 rounded-lg">
        <p className="text-sm text-green-700">
          This section will handle employee conveyance and travel expense payments.
        </p>
      </div>
    </div>
  )
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
    const loadedVendorData = loadInvoicesFromLocalStorage()
    setVendorData(loadedVendorData)

    if (loadedVendorData.length > 0) {
      toast.info(`Loaded ${loadedVendorData.length} vendors with invoices from storage`)
    } else {
      toast.warning('No invoices found in storage')
    }
  }, [])

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
    const updatedVendors = []
    const newlyApprovedInvoices = [] // 🔥 Store newly approved invoices

    vendorData.forEach((vendor) => {
      const isVendorSelected = selectedVendors[vendor.id]
      if (!isVendorSelected) {
        updatedVendors.push(vendor)
        return
      }

      const updatedInvoices = []

      vendor.invoices.forEach((invoice) => {
        // Use currentPayments passed from VendorInvoiceTable, fallback to invoicePayments, then default
        const payment = currentPayments[invoice.id] ||
          invoicePayments[invoice.id] || { amount: invoice.amount, paymentType: 'full' }

        const fullAmount = invoice.amount
        const paymentType = payment?.paymentType || 'full'

        // FIXED: If payment type is 'full', always use the full invoice amount
        const paidAmount = paymentType === 'full' ? fullAmount : Number(payment?.amount || 0)

        console.log(`Processing Invoice ${invoice.invoiceNumber}:`, {
          originalAmount: fullAmount,
          paidAmount,
          paymentType,
          payment,
          calculationNote: paymentType === 'full' ? 'Using full amount' : 'Using payment amount',
        })

        // 🔥 STORE approved invoice data BEFORE processing
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
            type: invoice.type, // preserve invoice type for GL mapping
            invoiceTypeLabel: invoice.invoiceTypeLabel,
            approvedDate: new Date().toISOString(),
            utr: 'Bank',
          })
        }

        // Full payment → don't keep this invoice (remove completely)
        if (paymentType === 'full' || paidAmount >= fullAmount) {
          console.log(`Full payment for ${invoice.invoiceNumber} - removing from table`)
          return // Invoice is fully paid, remove it
        }

        // Partial payment → keep with reduced amount
        if (paymentType === 'partial' && paidAmount < fullAmount && paidAmount > 0) {
          const remainingAmount = fullAmount - paidAmount
          console.log(
            `Partial payment for ${invoice.invoiceNumber} - keeping with remaining amount: ${remainingAmount}`
          )

          updatedInvoices.push({
            ...invoice,
            amount: remainingAmount,
          })
        } else if (paymentType === 'partial' && paidAmount <= 0) {
          // Invalid partial payment, keep original invoice
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

    // 🔥 UPDATE approved invoices state
    setApprovedInvoices((prev) => [...prev, ...newlyApprovedInvoices])

    const processedInvoices = newlyApprovedInvoices.length

    if (processedInvoices === 0) {
      toast.warning('No valid invoices approved. Check vendor selection and payment details.')
    } else {
      toast.success(`${processedInvoices} invoice(s) processed successfully.`)
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
      <AEBankSelectionModal
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
        return <ConveyancePayments />
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

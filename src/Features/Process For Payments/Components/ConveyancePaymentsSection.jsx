/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import ConveyancePaymentPreviewModal from './ConveyancePaymentPreviewModal'
import ConveyancePaymentTable from './ConveyancePaymentTable'
import { processConveyanceBankPayments } from '../../Master/utils/accountingHelpers'
import ConveyancePaymentEntryModal from './ConveyancePaymentEntryModal'
import UploadPaymentFile from './UploadPaymentFile'
import PaymentBankSelectionModal from './PaymentBankSelectonModal'

const ConveyancePaymentsSection = () => {
  const [conveyanceData, setConveyanceData] = useState([])
  const [approvedConveyances, setApprovedConveyances] = useState([])
  const [parsedData, setParsedData] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editableData, setEditableData] = useState([])
  const [showPaymentEntry, setShowPaymentEntry] = useState(false)
  const [currentPaymentEntryData, setCurrentPaymentEntryData] = useState(null)
  const [isBankModalOpen, setIsBankModalOpen] = useState(false)
  const [pendingAcceptedData, setPendingAcceptedData] = useState(null)
  const [selectedBankForPayment, setSelectedBankForPayment] = useState(null)

  // Load approved conveyance requests from localStorage
  useEffect(() => {
    loadConveyanceData()
  }, [])

  const loadConveyanceData = () => {
    try {
      const processedRequests =
        JSON.parse(localStorage.getItem('processedConveyanceRequests')) || []

      // Filter only pending payment requests
      const pendingPaymentRequests = processedRequests.filter(
        (request) => request.paymentStatus === 'Pending Payment'
      )

      console.log(`📋 Found ${pendingPaymentRequests.length} conveyance requests pending payment`)

      // Transform data for table display
      const transformedData = pendingPaymentRequests.map((request, index) => ({
        id: request.id || `conv-${index + 1}`,
        employeeName: request.employeeName,
        employeeId: request.employeeId,
        date: request.date,
        client: request.client,
        purpose: request.purpose,
        distance: request.distance,
        amount: parseFloat(request.amount) || 0,
        transport: request.transport,
        department: request.department,
        voucherNo: request.voucherNumber,
        approvedDate: request.aeApprovedAt,
        originalRequest: request,
      }))

      setConveyanceData(transformedData)

      if (transformedData.length > 0) {
        toast.info(`Loaded ${transformedData.length} conveyance requests pending payment`)
      }
    } catch (error) {
      console.error('Error loading conveyance data:', error)
      toast.error('Failed to load conveyance requests')
    }
  }

  // Handle Excel file upload
  const handleFileUpload = async (file) => {
    try {
      const data = await parseConveyanceExcelFile(file)
      setParsedData(data)
      setIsModalOpen(true)
    } catch (error) {
      toast.error('Failed to parse Excel file')
    }
  }

  const parseConveyanceExcelFile = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = (e) => {
        try {
          const binaryStr = e.target.result
          const workbook = XLSX.read(binaryStr, { type: 'binary' })
          const firstSheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[firstSheetName]
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' })

          if (jsonData.length === 0) {
            alert('Excel file is empty')
            reject([])
            return
          }

          // Get all column names from the first row
          const columnNames = Object.keys(jsonData[0])
          console.log('Excel columns found:', columnNames)

          // Map common column name variations to standard names
          const columnMapping = {
            // Employee Name variations
            'Employee Name': 'Employee Name',
            EmployeeName: 'Employee Name',
            Name: 'Employee Name',
            Employee: 'Employee Name',

            // Employee ID variations
            'Employee ID': 'Employee ID',
            EmployeeID: 'Employee ID',
            'Emp ID': 'Employee ID',
            EmployeeId: 'Employee ID',
            EmpId: 'Employee ID',

            // Amount variations
            Amount: 'Amount',
            'Payment Amount': 'Amount',
            'Paid Amount': 'Amount',
            'Total Amount': 'Amount',

            // UTR variations
            UTR: 'UTR',
            'UTR Number': 'UTR',
            'Transaction ID': 'UTR',
            TransactionID: 'UTR',

            // Client variations
            Client: 'Client',
            'Client Name': 'Client',
            Customer: 'Client',

            // Purpose variations
            Purpose: 'Purpose',
            'Visit Purpose': 'Purpose',
            Description: 'Purpose',
          }

          // Normalize column names
          const normalizedData = jsonData.map((row) => {
            const normalizedRow = {}
            Object.keys(row).forEach((key) => {
              const normalizedKey = columnMapping[key] || key
              normalizedRow[normalizedKey] = row[key]
            })
            return normalizedRow
          })

          console.log('Normalized data:', normalizedData)

          // Check if we have the essential columns
          const essentialColumns = ['Employee Name', 'Amount', 'UTR']
          const availableColumns = Object.keys(normalizedData[0])

          const missingEssential = essentialColumns.filter((col) => !availableColumns.includes(col))

          if (missingEssential.length > 0) {
            alert(
              `Missing essential columns: ${missingEssential.join(', ')}\n\nAvailable columns: ${availableColumns.join(', ')}`
            )
            reject([])
            return
          }

          // Fill in missing optional columns with defaults
          const completeData = normalizedData.map((row) => ({
            'Employee Name': row['Employee Name'] || 'Unknown Employee',
            'Employee ID': row['Employee ID'] || `EMP-${Math.random().toString(36).substr(2, 5)}`,
            Amount: parseFloat(row['Amount']) || 0,
            UTR: row['UTR'] || '',
            Client: row['Client'] || 'N/A',
            Purpose: row['Purpose'] || 'Conveyance Reimbursement',
            'Payment Date': row['Payment Date'] || new Date().toISOString().split('T')[0],
            Remarks: row['Remarks'] || row['Narration'] || '',
          }))

          resolve(completeData)
        } catch (error) {
          console.error('Error parsing Excel:', error)
          alert('Failed to parse the Excel file. Please check the format and try again.')
          reject(error)
        }
      }

      reader.onerror = (error) => {
        console.error('File reading error:', error)
        reject(error)
      }
      reader.readAsBinaryString(file)
    })
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

  // Handle conveyance selection for approval
  const handleConveyanceApproval = (selectedConveyances, currentPayments = {}) => {
    const updatedConveyances = []
    const newlyApprovedConveyances = []

    conveyanceData.forEach((conveyance) => {
      const isConveyanceSelected = selectedConveyances[conveyance.id]
      if (!isConveyanceSelected) {
        updatedConveyances.push(conveyance)
        return
      }

      const payment = currentPayments[conveyance.id] || {
        amount: conveyance.amount,
        paymentType: 'full',
      }
      const paidAmount =
        payment.paymentType === 'full' ? conveyance.amount : Number(payment.amount || 0)

      if (paidAmount > 0) {
        newlyApprovedConveyances.push({
          ...conveyance,
          paidAmount: paidAmount,
          paymentType: payment.paymentType,
          approvedDate: new Date().toISOString(),
        })
      } else {
        // If no payment amount, keep the conveyance in the table
        updatedConveyances.push(conveyance)
      }
    })

    // Only update state if there are actually approved conveyances
    if (newlyApprovedConveyances.length > 0) {
      setApprovedConveyances((prev) => [...prev, ...newlyApprovedConveyances])
      setConveyanceData(updatedConveyances)

      const processedCount = newlyApprovedConveyances.length
      toast.success(`${processedCount} conveyance request(s) approved for payment`)
    } else {
      toast.warning('No conveyance requests selected for payment or invalid payment amounts')
    }
  }

  // Generate Bank Upload File
  const generateBankUploadFile = (approvedConveyances) => {
    const bankUploadData = approvedConveyances.map((conveyance) => ({
      TYPE: 'NEFT',
      'DEBIT BANK A/C NO': '123456789012', // Your company's bank account
      'DEBIT AMT': conveyance.paidAmount || conveyance.amount,
      CUR: 'INR',
      'BENEFICIARY A/C NO': generateEmployeeAccount(conveyance.employeeId),
      'IFSC CODE': generateEmployeeIFSC(conveyance.employeeId),
      'NARRATION/NAME': conveyance.employeeName.substring(0, 20),
    }))

    return bankUploadData
  }

  // Generate System Upload File
  const generateSystemUploadFile = (approvedConveyances) => {
    const systemUploadData = approvedConveyances.map((conveyance) => ({
      'Employee Name': conveyance.employeeName,
      'Employee ID': conveyance.employeeId,
      'Client Name': conveyance.client,
      Purpose: conveyance.purpose,
      Distance: conveyance.distance,
      Amount: conveyance.paidAmount || conveyance.amount,
      UTR: '', // Empty for user to fill
      'Payment Date': new Date().toISOString().split('T')[0],
      'Voucher No': conveyance.voucherNo,
      'Expense GL': 'X2001003',
      'Payable GL': 'L2001001',
      Department: conveyance.department,
    }))

    return systemUploadData
  }

  // Helper functions for bank details
  const generateEmployeeAccount = (employeeId) => {
    const hash = employeeId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return `987654${String(321000 + (hash % 10000))}`
  }

  const generateEmployeeIFSC = (employeeId) => {
    const hash = employeeId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const banks = ['HDFC', 'ICIC', 'SBIN', 'YESB', 'AXIS']
    const bankIndex = hash % banks.length
    const branchCode = String(1000 + (hash % 9000)).padStart(4, '0')
    return `${banks[bankIndex]}0${branchCode}`
  }

  // Download both files
  const handleDownloadTemplate = () => {
    if (approvedConveyances.length === 0) {
      toast.warning('No approved conveyance requests found. Please approve some requests first.')
      return
    }

    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '')

    // 1. Generate Bank Upload File
    const bankUploadData = generateBankUploadFile(approvedConveyances)
    const bankWorksheet = XLSX.utils.json_to_sheet(bankUploadData)
    const bankWorkbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(bankWorkbook, bankWorksheet, 'Bank_Payment_File')

    // Auto-size columns
    const bankColWidths = Object.keys(bankUploadData[0] || {}).map((header, index) => {
      const maxLength = Math.max(
        header.length,
        ...bankUploadData.map((row) => String(row[header] || '').length)
      )
      return { width: Math.min(maxLength + 2, 30) }
    })
    bankWorksheet['!cols'] = bankColWidths

    const bankExcelBuffer = XLSX.write(bankWorkbook, { bookType: 'xlsx', type: 'array' })
    const bankBlob = new Blob([bankExcelBuffer], { type: 'application/octet-stream' })
    saveAs(bankBlob, `Conveyance_Bank_Payment_File_${timestamp}.xlsx`)

    // 2. Generate System Upload File
    const systemUploadData = generateSystemUploadFile(approvedConveyances)
    const systemWorksheet = XLSX.utils.json_to_sheet(systemUploadData)
    const systemWorkbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(systemWorkbook, systemWorksheet, 'System_Upload_File')

    const systemColWidths = Object.keys(systemUploadData[0] || {}).map((header, index) => {
      const maxLength = Math.max(
        header.length,
        ...systemUploadData.map((row) => String(row[header] || '').length)
      )
      return { width: Math.min(maxLength + 2, 25) }
    })
    systemWorksheet['!cols'] = systemColWidths

    const systemExcelBuffer = XLSX.write(systemWorkbook, { bookType: 'xlsx', type: 'array' })
    const systemBlob = new Blob([systemExcelBuffer], { type: 'application/octet-stream' })
    saveAs(systemBlob, `Conveyance_System_Upload_File_${timestamp}.xlsx`)

    toast.success(
      `Both files downloaded successfully! Processed ${approvedConveyances.length} conveyance payments.`
    )
  }

  // Process conveyance payments and show Payment Entry Modal
  const processConveyancePaymentsAndShowModal = (payments, bank) => {
    try {
      console.log('🔍 DEBUG - Input payments:', payments)
      console.log('🔍 DEBUG - Input bank:', bank)

      const result = processConveyanceBankPayments(payments, bank)
      console.log('🔍 DEBUG - processConveyanceBankPayments result:', result)

      if (!result.success) {
        toast.error(result.message || 'Failed to process conveyance bank payments')
        return false
      }

      toast.success(result.message)

      // Prepare data for Conveyance Payment Entry Modal
      const paymentEntryData = {
        entryNo:
          result.voucherNo ||
          `PE-CONV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`,
        date: new Date().toISOString().split('T')[0],
        vendor:
          payments.length > 1
            ? `Multiple Employees (${payments.length})`
            : payments[0]?.employeeName,
        amount: result.totalAmount,
        paymentMethod: 'Bank Transfer',
        bankAccount: `${bank.bankName} (${bank.bankCode})`,
        invoiceNo: payments.map((p) => p.employeeName).join(', '),
        particulars: `Conveyance reimbursement for ${payments.length} employee(s)`,
        gstAmount: 0,
        netAmount: result.totalAmount,
        status: 'Posted',
        preparedBy: 'Account Executive',
        approvedBy: 'System',
        remarks: 'Auto-posted via Conveyance Payments System',
        paymentCount: payments.length,
        totalAmount: result.totalAmount,
        // GL Entries: Debit L2001001, Credit Bank
        glEntries: result.glEntries || [
          {
            glCode: 'L2001001',
            glDescription: 'CONVEYANCE PAYABLE',
            costCenter: 'HEAD OFFICE',
            department: 'Finance',
            debitAmount: result.totalAmount,
            creditAmount: 0,
            narration: `Conveyance payments batch - ${payments.length} employees`,
          },
          {
            glCode: bank.bankCode,
            glDescription: bank.bankName,
            costCenter: 'HEAD OFFICE',
            department: 'Finance',
            debitAmount: 0,
            creditAmount: result.totalAmount,
            narration: `Bank payment for conveyance`,
          },
        ],
        // Employee details specifically formatted for conveyance modal
        employeeDetails: payments.map((payment, index) => ({
          employeeName: payment.employeeName,
          employeeId: payment.employeeId,
          client: payment.client || 'N/A',
          purpose: payment.purpose || 'Conveyance Reimbursement',
          totalAmount: payment.amount,
          invoices: [
            {
              invoiceNumber: `CONV-${payment.employeeId || String(index + 1).padStart(3, '0')}`,
              originalAmount: payment.amount,
              paidAmount: payment.amount,
              paymentType: 'full',
              distance: payment.distance || 'N/A',
            },
          ],
        })),
      }

      console.log('🔍 DEBUG - Final paymentEntryData for Conveyance Modal:', paymentEntryData)

      setCurrentPaymentEntryData(paymentEntryData)
      setShowPaymentEntry(true)
      return true
    } catch (error) {
      console.error('Error processing conveyance payments:', error)
      toast.error(error.message || 'Error processing payments')
      return false
    }
  }

  return (
    <>
      {/* Conveyance Payment Processing Section */}
      <div className="p-4 max-w-6xl mx-auto bg-white shadow-md rounded-md mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-purple-600">Process Conveyance Payments</h1>
          <button
            onClick={handleDownloadTemplate}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors duration-200"
          >
            ⬇️ Download Payment Files ({approvedConveyances.length})
          </button>
        </div>

        <UploadPaymentFile onFileUpload={handleFileUpload} />

        {isModalOpen && (
          <ConveyancePaymentPreviewModal
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
      </div>

      {/* Conveyance Payment Management Section */}
      <div className="max-w-7xl mx-auto px-2 pb-4">
        <div className="bg-white overflow-hidden rounded shadow-sm">
          <ConveyancePaymentTable
            conveyanceData={conveyanceData}
            onConveyanceApprove={handleConveyanceApproval}
          />
        </div>
      </div>

      {/* Bank Selection Modal */}
      <PaymentBankSelectionModal
        isOpen={isBankModalOpen}
        onClose={() => {
          setIsBankModalOpen(false)
          setPendingAcceptedData(null)
        }}
        onBankSelect={(bank) => {
          setSelectedBankForPayment(bank)
          setIsBankModalOpen(false)

          // Process bank payments for conveyance from uploaded file
          try {
            const payments = (pendingAcceptedData || []).map((row) => ({
              employeeName: row['Employee Name'],
              employeeId: row['Employee ID'],
              amount: parseFloat(row['Amount'] || 0),
              client: row['Client'] || 'N/A',
              purpose: row['Purpose'] || 'Conveyance Reimbursement',
              distance: row['Distance'] || 'N/A',
              utr: row['UTR'] || '',
            }))

            const success = processConveyancePaymentsAndShowModal(payments, bank)
            if (success) {
              setPendingAcceptedData(null)
              // Remove processed conveyances from localStorage
              removeProcessedConveyances(payments)
            }
          } catch (error) {
            console.error('Error processing conveyance payments:', error)
            toast.error(error.message || 'Error processing payments')
          }
        }}
        requestData={pendingAcceptedData}
        paymentType="conveyance"
      />

      {/* Payment Entry Modal - Shows after Accept button is clicked */}
      {showPaymentEntry && (
        <ConveyancePaymentEntryModal
          isOpen={showPaymentEntry}
          onClose={() => setShowPaymentEntry(false)}
          paymentData={currentPaymentEntryData}
        />
      )}
    </>
  )
}

// Helper function to remove processed conveyances
const removeProcessedConveyances = (processedPayments) => {
  try {
    const existingProcessed = JSON.parse(localStorage.getItem('processedConveyanceRequests')) || []
    const processedEmployeeIds = processedPayments.map((p) => p.employeeId)

    const updatedProcessed = existingProcessed.filter(
      (request) => !processedEmployeeIds.includes(request.employeeId)
    )

    localStorage.setItem('processedConveyanceRequests', JSON.stringify(updatedProcessed))
  } catch (error) {
    console.error('Error removing processed conveyances:', error)
  }
}

export default ConveyancePaymentsSection

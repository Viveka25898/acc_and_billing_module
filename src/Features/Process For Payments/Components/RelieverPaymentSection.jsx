/* eslint-disable no-unused-vars */
// Components/RelieverPaymentsSection.jsx
import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import RelieverPaymentPreviewModal from './RelieverPaymentPreviewModal'
import RelieverPaymentTable from './RelieverPaymentTable'
// import AEBankSelectionModal from '../../Advance Request/Components/AEBankSelectionModal'
import { processRelieverBankPayments } from '../../Master/utils/accountingHelpers'
import PaymentEntryModal from '../../Process For Payments/Components/PaymentEntryModal' // Use the main PaymentEntryModal
import UploadPaymentFile from './UploadPaymentFile'
import RelieverPaymentEntryModal from './RelieverPaymentEntryModal'
import PaymentBankSelectionModal from './PaymentBankSelectonModal'

const RelieverPaymentsSection = () => {
  const [relieverData, setRelieverData] = useState([])
  const [approvedRelievers, setApprovedRelievers] = useState([])
  const [parsedData, setParsedData] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editableData, setEditableData] = useState([])
  const [showPaymentEntry, setShowPaymentEntry] = useState(false)
  const [currentPaymentEntryData, setCurrentPaymentEntryData] = useState(null)
  const [isBankModalOpen, setIsBankModalOpen] = useState(false)
  const [pendingAcceptedData, setPendingAcceptedData] = useState(null)
  const [selectedBankForPayment, setSelectedBankForPayment] = useState(null)

  // Load approved reliever requests from localStorage
  useEffect(() => {
    loadRelieverData()
  }, [])

  const loadRelieverData = () => {
    try {
      const approvedRequests = JSON.parse(localStorage.getItem('relieverapprovedRequests')) || []

      // Transform data for table display
      const transformedData = approvedRequests.map((request, index) => ({
        id: request.id || `rel-${index + 1}`,
        relieverName: request.name,
        employeeId: request.relieverId || `EMP-${String(index + 1).padStart(3, '0')}`,
        site: request.site || 'General',
        days: request.days || 1,
        amount: parseFloat(request.amount) || 0,
        accountNo: request.accountNo,
        ifscCode: request.ifscCode,
        bankName: request.bankName,
        approvedDate: request.approvedAt,
        voucherNo: request.voucherNo,
        originalRequest: request,
      }))

      setRelieverData(transformedData)

      if (transformedData.length > 0) {
        toast.info(`Loaded ${transformedData.length} approved reliever requests`)
      }
    } catch (error) {
      console.error('Error loading reliever data:', error)
      toast.error('Failed to load reliever requests')
    }
  }

  // Handle Excel file upload
  const handleFileUpload = async (file) => {
    try {
      const data = await parseRelieverExcelFile(file)
      setParsedData(data)
      setIsModalOpen(true)
    } catch (error) {
      toast.error('Failed to parse Excel file')
    }
  }

  const parseRelieverExcelFile = async (file) => {
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
            // Reliever Name variations
            'Reliever Name': 'Reliever Name',
            RelieverName: 'Reliever Name',
            Name: 'Reliever Name',
            Reliever: 'Reliever Name',

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

            // Account No variations
            'Account No': 'Account No',
            AccountNo: 'Account No',
            'Account Number': 'Account No',
            AccountNumber: 'Account No',
            'Bank Account': 'Account No',
            'Bank Account No': 'Account No',

            // IFSC Code variations
            'IFSC Code': 'IFSC Code',
            IFSCCode: 'IFSC Code',
            IFSC: 'IFSC Code',
            'Bank Code': 'IFSC Code',

            // Site variations
            Site: 'Site',
            Location: 'Site',
            Branch: 'Site',
            'Work Location': 'Site',
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

          // Check if we have the essential columns (be more flexible)
          const essentialColumns = ['Reliever Name', 'Amount', 'Account No', 'IFSC Code']
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
            'Reliever Name': row['Reliever Name'] || 'Unknown Reliever',
            'Employee ID': row['Employee ID'] || `EMP-${Math.random().toString(36).substr(2, 5)}`,
            Amount: parseFloat(row['Amount']) || 0,
            'Account No': row['Account No'] || 'N/A',
            'IFSC Code': row['IFSC Code'] || 'N/A',
            Site: row['Site'] || 'General',
            'Days Worked': row['Days Worked'] || row['Days'] || 1,
            'Bank Name': row['Bank Name'] || 'Unknown Bank',
            'Payment Date': row['Payment Date'] || new Date().toISOString().split('T')[0],
            UTR: row['UTR'] || '',
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

  // Handle reliever selection for approval
  const handleRelieverApproval = (selectedRelievers, currentPayments = {}) => {
    const updatedRelievers = []
    const newlyApprovedRelievers = []

    relieverData.forEach((reliever) => {
      const isRelieverSelected = selectedRelievers[reliever.id]
      if (!isRelieverSelected) {
        updatedRelievers.push(reliever)
        return
      }

      const payment = currentPayments[reliever.id] || {
        amount: reliever.amount,
        paymentType: 'full',
      }
      const paidAmount =
        payment.paymentType === 'full' ? reliever.amount : Number(payment.amount || 0)

      if (paidAmount > 0) {
        newlyApprovedRelievers.push({
          ...reliever,
          paidAmount: paidAmount,
          paymentType: payment.paymentType,
          approvedDate: new Date().toISOString(),
        })
      }
    })

    setApprovedRelievers((prev) => [...prev, ...newlyApprovedRelievers])
    setRelieverData(updatedRelievers)

    const processedCount = newlyApprovedRelievers.length
    if (processedCount === 0) {
      toast.warning('No relievers selected for payment')
    } else {
      toast.success(`${processedCount} reliever(s) approved for payment`)
    }
  }

  // Generate Bank Upload File
  const generateBankUploadFile = (approvedRelievers) => {
    const bankUploadData = approvedRelievers.map((reliever) => ({
      TYPE: 'NEFT',
      'DEBIT BANK A/C NO': '123456789012', // Your company's bank account
      'DEBIT AMT': reliever.paidAmount || reliever.amount,
      CUR: 'INR',
      'BENEFICIARY A/C NO': reliever.accountNo,
      'IFSC CODE': reliever.ifscCode,
      'NARRATION/NAME': reliever.relieverName.substring(0, 20),
    }))

    return bankUploadData
  }

  // Generate System Upload File
  const generateSystemUploadFile = (approvedRelievers) => {
    const systemUploadData = approvedRelievers.map((reliever) => ({
      'Reliever Name': reliever.relieverName,
      'Employee ID': reliever.employeeId,
      Site: reliever.site,
      'Days Worked': reliever.days,
      Amount: reliever.paidAmount || reliever.amount,
      'Account Number': reliever.accountNo,
      'IFSC Code': reliever.ifscCode,
      'Bank Name': reliever.bankName,
      'Payment Date': new Date().toISOString().split('T')[0],
      UTR: '',
      'Voucher No': reliever.voucherNo,
      'Expense GL': 'X2002002001',
      'Liability GL': 'L2001002',
    }))

    return systemUploadData
  }

  // Download both files
  const handleDownloadTemplate = () => {
    if (approvedRelievers.length === 0) {
      toast.warning('No approved relievers found. Please approve some relievers first.')
      return
    }

    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '')

    // 1. Generate Bank Upload File
    const bankUploadData = generateBankUploadFile(approvedRelievers)
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
    saveAs(bankBlob, `Reliever_Bank_Payment_File_${timestamp}.xlsx`)

    // 2. Generate System Upload File
    const systemUploadData = generateSystemUploadFile(approvedRelievers)
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
    saveAs(systemBlob, `Reliever_System_Upload_File_${timestamp}.xlsx`)

    // Remove approved relievers from localStorage and table
    removeProcessedRelievers(approvedRelievers)

    // Clear approved relievers
    setApprovedRelievers([])

    toast.success(
      `Both files downloaded successfully! Processed ${approvedRelievers.length} reliever payments.`
    )
  }

  // Remove processed relievers from localStorage
  const removeProcessedRelievers = (processedRelievers) => {
    try {
      const existingApproved = JSON.parse(localStorage.getItem('relieverapprovedRequests')) || []
      const processedIds = processedRelievers.map((r) => r.originalRequest?.id || r.id)

      const updatedApproved = existingApproved.filter(
        (request) => !processedIds.includes(request.id)
      )

      localStorage.setItem('relieverapprovedRequests', JSON.stringify(updatedApproved))

      // Reload data to reflect changes
      loadRelieverData()
    } catch (error) {
      console.error('Error removing processed relievers:', error)
    }
  }

  // Process reliever payments and show Payment Entry Modal
  const processRelieverPaymentsAndShowModal = (payments, bank) => {
    try {
      console.log('🔍 DEBUG - Input payments:', payments)
      console.log('🔍 DEBUG - Input bank:', bank)

      const result = processRelieverBankPayments(payments, bank)
      console.log('🔍 DEBUG - processRelieverBankPayments result:', result)

      if (!result.success) {
        toast.error(result.message || 'Failed to process reliever bank payments')
        return false
      }

      toast.success(result.message)

      // Prepare data specifically for Reliever Payment Entry Modal
      const paymentEntryData = {
        entryNo:
          result.voucherNo ||
          `PE-REL-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`,
        date: new Date().toISOString().split('T')[0],
        vendor:
          payments.length > 1
            ? `Multiple Relievers (${payments.length})`
            : payments[0]?.relieverName,
        amount: result.totalAmount,
        paymentMethod: 'Bank Transfer',
        bankAccount: `${bank.bankName} (${bank.bankCode})`,
        invoiceNo: payments.map((p) => p.relieverName).join(', '),
        particulars: `Reliever bank payment for ${payments.length} reliever(s)`,
        gstAmount: 0,
        netAmount: result.totalAmount,
        status: 'Posted',
        preparedBy: 'Account Executive',
        approvedBy: 'System',
        remarks: 'Auto-posted via Reliever Payments System',
        paymentCount: payments.length,
        totalAmount: result.totalAmount,
        // GL Entries as specified: Debit L2001002, Credit Bank
        glEntries: result.glEntries || [
          {
            glCode: 'L2001002',
            glDescription: 'EMPLOYEE RELIEVER ACCOUNT',
            costCenter: 'HEAD OFFICE',
            department: 'Finance',
            debitAmount: result.totalAmount,
            creditAmount: 0,
            narration: `Reliever payments batch - ${payments.length} relievers`,
          },
          {
            glCode: bank.bankCode,
            glDescription: bank.bankName,
            costCenter: 'HEAD OFFICE',
            department: 'Finance',
            debitAmount: 0,
            creditAmount: result.totalAmount,
            narration: `Bank payment for relievers`,
          },
        ],
        // Reliever details specifically formatted for reliever modal
        relieverDetails: payments.map((payment, index) => ({
          vendorName: payment.relieverName,
          employeeId: payment.employeeId,
          site: payment.site || 'General',
          accountNo: payment.accountNo,
          ifscCode: payment.ifscCode,
          totalAmount: payment.amount,
          invoices: [
            {
              invoiceNumber: `REL-${payment.employeeId || String(index + 1).padStart(3, '0')}`,
              originalAmount: payment.amount,
              paidAmount: payment.amount,
              paymentType: 'full',
              days: payment.days || 1,
            },
          ],
        })),
      }

      console.log('🔍 DEBUG - Final paymentEntryData for Reliever Modal:', paymentEntryData)

      setCurrentPaymentEntryData(paymentEntryData)
      setShowPaymentEntry(true)
      return true
    } catch (error) {
      console.error('Error processing reliever payments:', error)
      toast.error(error.message || 'Error processing payments')
      return false
    }
  }
  return (
    <>
      {/* Reliever Payment Processing Section */}
      <div className="p-4 max-w-6xl mx-auto bg-white shadow-md rounded-md mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-blue-600">Process Reliever Payments</h1>
          <button
            onClick={handleDownloadTemplate}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-200"
          >
            ⬇️ Download Payment Files ({approvedRelievers.length})
          </button>
        </div>

        <UploadPaymentFile onFileUpload={handleFileUpload} />

        {isModalOpen && (
          <RelieverPaymentPreviewModal
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

      {/* Reliever Payment Management Section */}
      <div className="max-w-7xl mx-auto px-2 pb-4">
        <div className="bg-white overflow-hidden rounded shadow-sm">
          <RelieverPaymentTable
            relieverData={relieverData}
            onRelieverApprove={handleRelieverApproval}
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

          // Process bank payments for relievers from uploaded file
          try {
            const payments = (pendingAcceptedData || []).map((row) => ({
              relieverName: row['Reliever Name'],
              employeeId: row['Employee ID'],
              amount: parseFloat(row['Amount'] || 0),
              accountNo: row['Account No'],
              ifscCode: row['IFSC Code'],
              site: row['Site'] || 'General',
            }))

            const success = processRelieverPaymentsAndShowModal(payments, bank)
            if (success) {
              setPendingAcceptedData(null)
            }
          } catch (error) {
            console.error('Error processing reliever payments:', error)
            toast.error(error.message || 'Error processing payments')
          }
        }}
        requestData={pendingAcceptedData}
        paymentType="reliever"
      />

      {/* Payment Entry Modal - Shows after Accept button is clicked */}
      {showPaymentEntry && (
        <RelieverPaymentEntryModal
          isOpen={showPaymentEntry}
          onClose={() => setShowPaymentEntry(false)}
          paymentData={currentPaymentEntryData}
        />
      )}
    </>
  )
}

export default RelieverPaymentsSection

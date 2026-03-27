import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

import UploadPaymentFile from './UploadPaymentFile'
import ConveyancePaymentTable from './ConveyancePaymentTable'
import ConveyancePaymentPreviewModal from './ConveyancePaymentPreviewModal'
import PaymentBankSelectionModal from './PaymentBankSelectionModal'
import ConveyancePaymentEntryModal from './ConveyancePaymentEntryModal'

import { parseConveyanceExcelFile } from '../utils/excelHelpers'
import { processConveyanceBankPayments } from '../../Master/utils/accountingHelpers'

const Spinner = () => (
  <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-purple-500" />
)

const ConveyancePaymentsSection = () => {
  const [conveyanceData, setConveyanceData] = useState([])
  const [parsedData, setParsedData] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isBankModalOpen, setIsBankModalOpen] = useState(false)
  const [pendingAcceptedData, setPendingAcceptedData] = useState(null)
  const [showPaymentEntry, setShowPaymentEntry] = useState(false)
  const [paymentEntryData, setPaymentEntryData] = useState(null)
  const [approvedPayments, setApprovedPayments] = useState([])
  const [loading, setLoading] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const loadConveyances = () => {
      setLoading(true)
      try {
        const stored = JSON.parse(localStorage.getItem('processedConveyanceRequests') || '[]')
        
        // Filter pending payments and map to expected format
        const pending = stored.filter((req) => req.paymentStatus === 'Pending Payment')
        
        let modified = false
        const mapped = pending.map((req, i) => {
          if (!req.id) {
            req.id = `CONV-${Date.now()}-${i}`
            modified = true
          }
          return {
            'Employee Name': req.employeeName,
            'Employee ID': req.employeeId || `EMP-${Date.now().toString().slice(-4)}${i}`,
            Amount: req.approvedAmount || req.amount || 0,
            Client: req.clientName || 'N/A',
            Purpose: req.purpose || req.visitPurpose || 'Conveyance Reimbursement',
            'Account No': req.bankAccount || req.accountNo || 'N/A',
            'IFSC Code': req.ifsc || req.ifscCode || 'N/A',
            id: req.id,
            requestDate: req.date || req.requestDate || new Date().toISOString().split('T')[0],
          }
        })
        
        if (modified) {
          localStorage.setItem('processedConveyanceRequests', JSON.stringify(stored))
        }
        
        setConveyanceData(mapped)
        if (mapped.length > 0) {
          toast.info(`Loaded ${mapped.length} pending conveyance payments`)
        } else {
          toast.info('No pending conveyance payments found')
        }
      } catch (err) {
        toast.error('Failed to load conveyance data')
      } finally {
        setLoading(false)
      }
    }
    loadConveyances()
  }, [])

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
        'BENEFICIARY NAME': r['Employee Name'],
        'ACCOUNT NUMBER': r['Account No'] || 'N/A',
        'IFSC CODE': r['IFSC Code'] || 'N/A',
        AMOUNT: r.Amount,
        NARRATION: `Conveyance - ${r.Purpose || 'Payment'}`,
      }))

      const systemData = approvedPayments.map((r) => ({
        'Employee Name': r['Employee Name'],
        'Employee ID': r['Employee ID'],
        'Paid Amount': r.Amount,
        'Client': r.Client,
        'Purpose': r.Purpose,
        'UTR Number': '',
        'Payment Date': new Date().toISOString().split('T')[0],
      }))

      const wb1 = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb1, XLSX.utils.json_to_sheet(bankData), 'Bank_Upload')
      saveAs(
        new Blob([XLSX.write(wb1, { bookType: 'xlsx', type: 'array' })], { type: 'application/octet-stream' }),
        `Conveyance_Bank_File_${ts}.xlsx`
      )

      const wb2 = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb2, XLSX.utils.json_to_sheet(systemData), 'System_Upload')
      saveAs(
        new Blob([XLSX.write(wb2, { bookType: 'xlsx', type: 'array' })], { type: 'application/octet-stream' }),
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
        employeeName: row['Employee Name'],
        amount: parseFloat(row.Amount) || parseFloat(row['Payment Amount']) || 0,
        requestId: row.id || `CONV-${Date.now()}-${Math.random().toString(36).substr(2,9)}`,
        employeeId: row['Employee ID'],
        utr: row.UTR || row['UTR Number'] || '',
      }))

      const result = processConveyanceBankPayments(paymentsToProcess, bank)
      if (!result.success) {
        toast.error(result.message || 'Error posting conveyance entries')
        return
      }

      toast.success(result.message)

      // Cleanup localStorage
      try {
        const processedIds = new Set((result.payments || []).map((r) => r.requestId || r.id))
        const existing = JSON.parse(localStorage.getItem('processedConveyanceRequests') || '[]')
        
        // Mark as paid instead of deleting completely (keeps history for user dashboard)
        const updated = existing.map((req) => {
          if (processedIds.has(req.id)) {
            const foundPayment = (result.payments || []).find(r => (r.requestId || r.id) === req.id)
            return {
              ...req,
              paymentStatus: 'Paid',
              paymentMode: 'Bank Transfer',
              paymentDate: new Date().toISOString(),
              utrNumber: foundPayment?.utr || '',
              workflow: {
                ...req.workflow,
                paymentProcessedAt: new Date().toISOString(),
                paymentProcessedBy: 'Account Executive'
              }
            }
          }
          return req
        })
        localStorage.setItem('processedConveyanceRequests', JSON.stringify(updated))
        
        // Remove from screen table
        setConveyanceData((prev) => prev.filter((r) => !processedIds.has(r.id)))
      } catch {
        // non-critical
      }

      // Build specific Conveyance Entry Data
      setPaymentEntryData({
        entryNo: result.voucherNo || `CPE-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`,
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

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-purple-500 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white">Process Conveyance Payments</h2>
            <p className="text-purple-100 text-xs mt-0.5">Upload a bank file or approve from the pending request list below</p>
          </div>
          <button
            onClick={handleDownloadTemplate}
            disabled={approvedPayments.length === 0}
            className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full transition shadow-sm ${
              approvedPayments.length > 0
                ? 'bg-white text-purple-700 hover:bg-purple-50 border border-purple-200'
                : 'bg-purple-400 text-purple-100 cursor-not-allowed border border-purple-300'
            }`}
          >
            ⬇ Download Files
            {approvedPayments.length > 0 && (
              <span className="bg-purple-600 text-white text-xs rounded-full px-2 py-0.5">
                {approvedPayments.length}
              </span>
            )}
          </button>
        </div>
        <div className="p-4">
          <UploadPaymentFile onFileUpload={handleFileUpload} />
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-3 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-sm font-semibold text-gray-700">Pending Conveyance Payment Requests</h3>
          {loading && <Spinner />}
        </div>
        <div className="min-h-[300px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <Spinner />
              <p className="mt-3 text-sm">Loading conveyances...</p>
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

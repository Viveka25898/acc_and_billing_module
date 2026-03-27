import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

import UploadPaymentFile from './UploadPaymentFile'
import RelieverPaymentTable from './RelieverPaymentTable'
import RelieverPaymentPreviewModal from './RelieverPaymentPreviewModal'
import PaymentBankSelectionModal from './PaymentBankSelectionModal'
import RelieverPaymentEntryModal from './RelieverPaymentEntryModal'

import { parseRelieverExcelFile } from '../utils/excelHelpers'
import { processRelieverBankPayments } from '../../Master/utils/accountingHelpers'

const Spinner = () => (
  <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-blue-500" />
)

const RelieverPaymentSection = () => {
  const [relieverData, setRelieverData] = useState([])
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
    const loadRelievers = () => {
      setLoading(true)
      try {
        const stored = JSON.parse(localStorage.getItem('relieverapprovedRequests') || '[]')
        
        let modified = false
        // Map to expected format and ensure ID exists
        const mapped = stored.map((req, i) => {
          if (!req.id) {
            req.id = `REQ-${Date.now()}-${i}`
            modified = true
          }
          return {
            'Reliever Name': req.name || req.relieverName,
            'Employee ID': req.empId || req.relieverId || `EMP-${Date.now().toString().slice(-4)}${i}`,
            Amount: req.approvedAmount || req.amount || 0,
            'Account No': req.bankAccount || req.accountNo || 'N/A',
            'IFSC Code': req.ifsc || req.ifscCode || 'N/A',
            Site: req.site || 'General',
            'Days Worked': req.daysWorked || 1,
            id: req.id,
          }
        })

        if (modified) {
          localStorage.setItem('relieverapprovedRequests', JSON.stringify(stored))
        }
        
        setRelieverData(mapped)
        if (mapped.length > 0) {
          toast.info(`Loaded ${mapped.length} pending reliever payments`)
        } else {
          toast.info('No pending reliever payments found')
        }
      } catch (err) {
        toast.error('Failed to load reliever data')
      } finally {
        setLoading(false)
      }
    }
    loadRelievers()
  }, [])

  const handleFileUpload = async (file) => {
    try {
      const data = await parseRelieverExcelFile(file)
      setParsedData(data)
      setIsModalOpen(true)
    } catch (err) {
      toast.error(err.message || 'Error processing file')
    }
  }

  const handleDownloadTemplate = () => {
    if (approvedPayments.length === 0) {
      toast.warning('No approved reliever payments to download.')
      return
    }

    try {
      const ts = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '')
      
      const bankData = approvedPayments.map((r) => ({
        'BENEFICIARY NAME': r['Reliever Name'],
        'ACCOUNT NUMBER': r['Account No'],
        'IFSC CODE': r['IFSC Code'],
        AMOUNT: r.Amount,
        NARRATION: `Reliever Payment - ${r.Site} - ${r['Days Worked']} days`,
      }))

      const systemData = approvedPayments.map((r) => ({
        'Reliever Name': r['Reliever Name'],
        'Employee ID': r['Employee ID'],
        'Paid Amount': r.Amount,
        UTR: '',
        'Payment Date': new Date().toISOString().split('T')[0],
      }))

      const wb1 = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb1, XLSX.utils.json_to_sheet(bankData), 'Bank_Upload')
      saveAs(
        new Blob([XLSX.write(wb1, { bookType: 'xlsx', type: 'array' })], { type: 'application/octet-stream' }),
        `Reliever_Bank_File_${ts}.xlsx`
      )

      const wb2 = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb2, XLSX.utils.json_to_sheet(systemData), 'System_Upload')
      saveAs(
        new Blob([XLSX.write(wb2, { bookType: 'xlsx', type: 'array' })], { type: 'application/octet-stream' }),
        `Reliever_System_File_${ts}.xlsx`
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
        relieverName: row['Reliever Name'],
        amount: parseFloat(row.Amount) || parseFloat(row['Total Amount']) || 0,
        requestId: row.id || `REQ-${Date.now()}-${Math.random().toString(36).substr(2,9)}`,
        employeeId: row['Employee ID'],
      }))

      const result = processRelieverBankPayments(paymentsToProcess, bank)
      if (!result.success) {
        toast.error(result.message || 'Error posting reliever entries')
        return
      }

      toast.success(result.message)

      // Cleanup localStorage
      try {
        const processedIds = new Set((result.payments || []).map((r) => r.requestId || r.id))
        const existing = JSON.parse(localStorage.getItem('relieverapprovedRequests') || '[]')
        const remaining = existing.filter((req) => !processedIds.has(req.id))
        localStorage.setItem('relieverapprovedRequests', JSON.stringify(remaining))
        
        // Remove from screen table
        setRelieverData((prev) => prev.filter((r) => !processedIds.has(r.id)))
      } catch {
        // non-critical
      }

      // Build specific Reliever Entry Data
      setPaymentEntryData({
        entryNo: result.voucherNo || `RPE-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`,
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

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white">Process Reliever Payments</h2>
            <p className="text-blue-100 text-xs mt-0.5">Upload a bank file or approve from the pending request list below</p>
          </div>
          <button
            onClick={handleDownloadTemplate}
            disabled={approvedPayments.length === 0}
            className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full transition shadow-sm ${
              approvedPayments.length > 0
                ? 'bg-white text-blue-700 hover:bg-blue-50 border border-blue-200'
                : 'bg-blue-400 text-blue-100 cursor-not-allowed border border-blue-300'
            }`}
          >
            ⬇ Download Files
            {approvedPayments.length > 0 && (
              <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
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
          <h3 className="text-sm font-semibold text-gray-700">Pending Reliever Payment Requests</h3>
          {loading && <Spinner />}
        </div>
        <div className="min-h-[300px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <Spinner />
              <p className="mt-3 text-sm">Loading relievers...</p>
            </div>
          ) : (
            <RelieverPaymentTable
              data={relieverData}
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

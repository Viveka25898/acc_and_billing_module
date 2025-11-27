/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AMInvoiceFilter from './AccountManagerInvoiceFilter'
import AMInvoiceVerifyModal from './AccountManagerInvoiceVerifyModal'
import InvoiceJVDisplay from '../Components/InvoiceJVDisplay'
import {
  processHKMaterialInvoice,
  processFixedAssetInvoice,
  processPrepaidUniformInvoice,
} from '../../Master/utils/accountingHelpers'
import PurchaseVoucherModal from '../../Process For Prepaid Entry/Components/PurchaseVoucherModal'
import JournalVoucherModal from '../../Process For Prepaid Entry/Components/JournalVoucherModal'
import MonthlyAmortizationModal from '../../Process For Prepaid Entry/Components/MonthlyAmortizationModal'

// Prepaid Period Selection Modal Component
const PrepaidPeriodModal = ({ invoice, onClose, onConfirm }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('12')
  const [startMonth, setStartMonth] = useState('')

  useEffect(() => {
    // Set default start month to current month
    const now = new Date()
    const currentMonth = now.toISOString().slice(0, 7)
    setStartMonth(currentMonth)
  }, [])

  const handleConfirm = () => {
    const periodData = {
      period: parseInt(selectedPeriod),
      startMonth: startMonth,
      // monthlyAmount removed - will be calculated from taxable amount in helper
    }
    onConfirm(invoice.id, periodData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center px-2">
      <div className="bg-white w-full max-w-lg p-6 rounded-xl shadow-xl relative">
        <h2 className="text-xl font-semibold text-purple-700 mb-4">
          Prepaid Period Selection - {invoice.invoiceNumber}
        </h2>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">
            <strong>Invoice Amount:</strong> ₹{invoice.totalAmount.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 mb-4">
            <strong>Vendor:</strong> {invoice.vendorName}
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prepaid Period (Months)
          </label>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="6">6 Months</option>
            <option value="12">12 Months</option>
            <option value="18">18 Months</option>
            <option value="24">24 Months</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Start Month</label>
          <input
            type="month"
            value={startMonth}
            onChange={(e) => setStartMonth(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
          />
        </div>

        <div className="bg-purple-50 p-3 rounded mb-4">
          <p className="text-sm text-purple-800">
            <strong>Monthly Amortization (estimated):</strong> ₹
            {Math.round(
              (invoice.totalAmount * 100) /
                (100 + (invoice.gstRate || 18)) /
                parseInt(selectedPeriod)
            ).toLocaleString()}
          </p>
          <p className="text-xs text-purple-600 mt-1">
            Base amount (excluding GST) will be expensed each month for {selectedPeriod} months
            starting from {startMonth}
          </p>
          <p className="text-xs text-purple-500 mt-1">
            Note: GST input credit is claimed separately and not amortized
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
          >
            Confirm Period
          </button>
        </div>
      </div>
    </div>
  )
}

const AMInvoiceReviewPage = () => {
  const [invoices, setInvoices] = useState([])
  const [filters, setFilters] = useState({
    invoiceNumber: '',
    vendorName: '',
    date: '',
  })
  const [filteredInvoices, setFilteredInvoices] = useState([])
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isJVModalOpen, setIsJVModalOpen] = useState(false)
  const [isPrepaidModalOpen, setIsPrepaidModalOpen] = useState(false)
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)
  const [showJournalModal, setShowJournalModal] = useState(false)
  const [showAmortizationModal, setShowAmortizationModal] = useState(false)
  const [jvData, setJvData] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const navigate = useNavigate()

  // Load Invoice Data from localStorage (AE Approved invoices)
  const loadInvoiceData = () => {
    try {
      // Get invoices approved by AE
      const pendingAMInvoices = localStorage.getItem('pending_am_invoices')

      if (pendingAMInvoices) {
        const parsedInvoices = JSON.parse(pendingAMInvoices)
        setInvoices(parsedInvoices)
        setFilteredInvoices(parsedInvoices)
      } else {
        // No invoices from AE yet
        setInvoices([])
        setFilteredInvoices([])
      }
    } catch (error) {
      console.error('Error loading AM invoice data:', error)
      setInvoices([])
      setFilteredInvoices([])
    }
  }

  // Refresh data from localStorage
  const refreshData = () => {
    loadInvoiceData()
    alert('Data refreshed from localStorage!')
  }

  // Clear processed invoices (for demo purposes)
  const clearProcessedInvoices = () => {
    if (window.confirm('Clear all processed invoices from Account Manager queue?')) {
      localStorage.setItem('pending_am_invoices', JSON.stringify([]))
      setInvoices([])
      setFilteredInvoices([])
      alert('AM queue cleared.')
    }
  }

  // View processed invoices summary
  const viewProcessedSummary = () => {
    const processedInvoices = JSON.parse(localStorage.getItem('processed_invoices') || '[]')
    const rejectedInvoices = JSON.parse(localStorage.getItem('rejected_invoices') || '[]')
    const pendingAE = JSON.parse(localStorage.getItem('pending_ae_invoices') || '[]')

    const summary = `
Invoice Processing Summary:
- Pending AE Approval: ${pendingAE.length}
- Pending AM Approval: ${invoices.length}  
- Total Processed (Material/Fixed Asset/Prepaid): ${processedInvoices.length}
- Total Rejected: ${rejectedInvoices.length}
    `

    alert(summary)
  }

  // Load data on component mount
  useEffect(() => {
    loadInvoiceData()
  }, [])

  // Auto-refresh to check for new AE approvals
  useEffect(() => {
    const interval = setInterval(() => {
      const pendingAMInvoices = localStorage.getItem('pending_am_invoices')
      if (pendingAMInvoices) {
        const parsedInvoices = JSON.parse(pendingAMInvoices)
        setInvoices(parsedInvoices)
        setFilteredInvoices(parsedInvoices)
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  // Open Modal
  const openModal = (invoice) => {
    setSelectedInvoice(invoice)
    setIsModalOpen(true)
  }

  // Close Modal
  const closeModal = () => {
    setSelectedInvoice(null)
    setIsModalOpen(false)
  }

  // ✅ UPDATED: Handle Prepaid Period Confirmation - KEEP IN AM QUEUE
  const handlePrepaidPeriodConfirm = async (invoiceId, periodData) => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
    const timestamp = new Date().toISOString()

    const currentAMInvoices = JSON.parse(localStorage.getItem('pending_am_invoices') || '[]')
    const invoiceToUpdate = currentAMInvoices.find((inv) => inv.id === invoiceId)

    if (!invoiceToUpdate) return

    // ✅ PROCESS PREPAID UNIFORM INVOICE - AUTO GL POSTING
    try {
      invoiceToUpdate.prepaidPeriod = periodData.period
      invoiceToUpdate.prepaidStartMonth = periodData.startMonth

      const glResult = processPrepaidUniformInvoice(invoiceToUpdate)

      if (glResult.success) {
        // ✅ KEEP IN AM QUEUE BUT MARK AS APPROVED (Don't move to processed queue)
        const updatedAMQueue = currentAMInvoices.map((inv) => {
          if (inv.id === invoiceId) {
            return {
              ...inv,
              accountManagerStatus: 'Approved',
              finalStatus: 'GL Posted - Completed',
              amRemarks: `Prepaid Uniform invoice processed - Period: ${periodData.period} months`,
              processedByAM: currentUser.username || 'am1',
              processedAtAM: timestamp,
              prepaidPeriod: periodData.period,
              prepaidStartMonth: periodData.startMonth,
              monthlyAmortization: periodData.monthlyAmount,
              purchaseVoucherNo: glResult.purchaseVoucherNo,
              purchaseTransactionId: glResult.purchaseTransactionId,
              vendorGLCode: glResult.vendorGLCode,
              uniformPrepaidGLCode: glResult.uniformPrepaidGLCode,
              accountingResult: glResult,
            }
          }
          return inv
        })

        // Save updated AM queue (invoice stays here)
        localStorage.setItem('pending_am_invoices', JSON.stringify(updatedAMQueue))

        // Also add to processed queue for record keeping (optional)
        const processedInvoices = JSON.parse(localStorage.getItem('processed_invoices') || '[]')
        const processedInvoice = {
          ...invoiceToUpdate,
          accountManagerStatus: 'Approved',
          finalStatus: 'GL Posted - Completed',
          amRemarks: `Prepaid Uniform invoice processed - Period: ${periodData.period} months`,
          processedByAM: currentUser.username || 'am1',
          processedAtAM: timestamp,
          prepaidPeriod: periodData.period,
          prepaidStartMonth: periodData.startMonth,
          monthlyAmortization: periodData.monthlyAmount,
          purchaseVoucherNo: glResult.purchaseVoucherNo,
          purchaseTransactionId: glResult.purchaseTransactionId,
          vendorGLCode: glResult.vendorGLCode,
          uniformPrepaidGLCode: glResult.uniformPrepaidGLCode,
          accountingResult: glResult,
        }

        const updatedProcessedQueue = [...processedInvoices, processedInvoice]
        localStorage.setItem('processed_invoices', JSON.stringify(updatedProcessedQueue))

        // Update local state
        setInvoices(updatedAMQueue)
        setFilteredInvoices(updatedAMQueue)

        // Close modals
        setIsPrepaidModalOpen(false)
        closeModal()

        alert(
          `✅ Prepaid Uniform invoice ${invoiceToUpdate.invoiceNumber} approved and GL entries posted!\nPurchase Voucher: ${glResult.purchaseVoucherNo}\nVendor GL: ${glResult.vendorGLCode}\nPrepaid Period: ${periodData.period} months`
        )
      } else {
        alert(
          `❌ Failed to process Prepaid Uniform invoice: ${glResult.message}\nInvoice remains in queue.`
        )
      }
    } catch (error) {
      console.error('❌ Error in Prepaid Uniform approval:', error)
      alert(
        `❌ Failed to process Prepaid Uniform invoice: ${error.message}\nInvoice remains in queue.`
      )
    }
  }

  // Handle Update Invoice (Modified for different invoice types)
  const handleUpdateInvoice = async (id, status, remark = '') => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
    const timestamp = new Date().toISOString()

    const currentAMInvoices = JSON.parse(localStorage.getItem('pending_am_invoices') || '[]')
    const invoiceToUpdate = currentAMInvoices.find((inv) => inv.id === id)

    if (!invoiceToUpdate) return

    if (status === 'Approved') {
      // Check invoice type and handle differently
      if (invoiceToUpdate.type === 'Procurement Prepaid') {
        // ✅ For Procurement Prepaid: Open prepaid period selection
        setIsPrepaidModalOpen(true)
        return // Don't close modal yet
      } else if (invoiceToUpdate.type === 'Material') {
        // HK MATERIAL INVOICE - AUTO GL POSTING (Move to processed queue)
        try {
          const glResult = await processHKMaterialInvoice(invoiceToUpdate, {
            bankCode: 'A3004003001',
            bankName: 'SBI Current Account',
          })

          if (glResult.success) {
            const processedInvoices = JSON.parse(localStorage.getItem('processed_invoices') || '[]')
            const processedInvoice = {
              ...invoiceToUpdate,
              accountManagerStatus: 'Approved',
              finalStatus: 'GL Posted - Completed',
              amRemarks: remark || 'HK Material invoice processed with auto-GL posting',
              processedByAM: currentUser.username || 'am1',
              processedAtAM: timestamp,
              voucher_id: glResult.voucherNo,
              vendor_gl_code: glResult.vendorGLCode,
              gl_entries: glResult.transactionId,
              accounting_result: glResult,
            }

            const updatedProcessedQueue = [...processedInvoices, processedInvoice]
            localStorage.setItem('processed_invoices', JSON.stringify(updatedProcessedQueue))

            // Remove from AM queue (Material invoices move out)
            const updatedAMQueue = currentAMInvoices.filter((inv) => inv.id !== id)
            localStorage.setItem('pending_am_invoices', JSON.stringify(updatedAMQueue))

            setInvoices(updatedAMQueue)
            setFilteredInvoices(updatedAMQueue)

            alert(
              `✅ HK Material invoice ${invoiceToUpdate.invoiceNumber} approved and GL entries posted!\nVoucher: ${glResult.voucherNo}\nVendor GL: ${glResult.vendorGLCode}`
            )

            closeModal()
            return
          } else {
            alert(
              `❌ HK Material invoice approval failed: ${glResult.message}\nInvoice remains in queue for retry.`
            )
            return
          }
        } catch (error) {
          console.error('❌ Error in HK Material approval:', error)
          alert(
            `❌ HK Material invoice approval failed: ${error.message}\nInvoice remains in queue.`
          )
          return
        }
      } else if (invoiceToUpdate.type === 'Fixed Asset') {
        // FIXED ASSET - AUTO GL POSTING (Move to processed queue)
        try {
          const glResult = await processFixedAssetInvoice(invoiceToUpdate)

          if (glResult.success) {
            const processedInvoices = JSON.parse(localStorage.getItem('processed_invoices') || '[]')
            const processedInvoice = {
              ...invoiceToUpdate,
              accountManagerStatus: 'Approved',
              finalStatus: 'GL Posted - Completed',
              amRemarks:
                remark ||
                `Fixed Asset invoice processed with auto-GL posting - ${glResult.assetCategory}`,
              processedByAM: currentUser.username || 'am1',
              processedAtAM: timestamp,
              voucher_id: glResult.voucherNo,
              vendor_gl_code: glResult.vendorGLCode,
              fixed_asset_gl_code: glResult.fixedAssetGLCode,
              fixed_asset_gl_name: glResult.fixedAssetGLName,
              asset_category: glResult.assetCategory,
              gl_entries: glResult.transactionId,
              accounting_result: glResult,
            }

            const updatedProcessedQueue = [...processedInvoices, processedInvoice]
            localStorage.setItem('processed_invoices', JSON.stringify(updatedProcessedQueue))

            // Remove from AM queue (Fixed Asset invoices move out)
            const updatedAMQueue = currentAMInvoices.filter((inv) => inv.id !== id)
            localStorage.setItem('pending_am_invoices', JSON.stringify(updatedAMQueue))

            setInvoices(updatedAMQueue)
            setFilteredInvoices(updatedAMQueue)

            alert(
              `✅ Fixed Asset invoice ${invoiceToUpdate.invoiceNumber} approved and GL entries posted!\nVoucher: ${glResult.voucherNo}\nFixed Asset GL: ${glResult.fixedAssetGLCode} (${glResult.fixedAssetGLName})\nVendor GL: ${glResult.vendorGLCode}`
            )

            closeModal()
            return
          } else {
            alert(
              `❌ Fixed Asset invoice approval failed: ${glResult.message}\nInvoice remains in queue for retry.`
            )
            return
          }
        } catch (error) {
          console.error('❌ Error in Fixed Asset approval:', error)
          alert(
            `❌ Fixed Asset invoice approval failed: ${error.message}\nInvoice remains in queue.`
          )
          return
        }
      }
    } else if (status === 'Rejected') {
      // AM Rejected - Move to rejected queue
      const rejectedInvoices = JSON.parse(localStorage.getItem('rejected_invoices') || '[]')
      const rejectedInvoice = {
        ...invoiceToUpdate,
        accountManagerStatus: status,
        finalStatus: 'Rejected by Account Manager',
        status: 'Rejected - Return to Vendor',
        amRemarks: remark,
        processedByAM: currentUser.username || 'am1',
        processedAtAM: timestamp,
        rejectedAtAM: timestamp,
      }

      const updatedRejectedQueue = [...rejectedInvoices, rejectedInvoice]
      localStorage.setItem('rejected_invoices', JSON.stringify(updatedRejectedQueue))

      const updatedAMQueue = currentAMInvoices.filter((inv) => inv.id !== id)
      localStorage.setItem('pending_am_invoices', JSON.stringify(updatedAMQueue))

      setInvoices(updatedAMQueue)
      setFilteredInvoices(updatedAMQueue)

      alert(
        `Invoice ${invoiceToUpdate.invoiceNumber} rejected by Account Manager and returned to vendor.`
      )

      closeModal()
    }
  }

  // Handle Filter
  const handleFilter = (newFilters) => {
    setFilters(newFilters)

    const { invoiceNumber, vendorName, date } = newFilters
    const filtered = invoices.filter((inv) => {
      return (
        (!invoiceNumber || inv.invoiceNumber.includes(invoiceNumber)) &&
        (!vendorName || inv.vendorName.toLowerCase().includes(vendorName.toLowerCase())) &&
        (!date || inv.submittedAt?.includes(date))
      )
    })
    setFilteredInvoices(filtered)
    setCurrentPage(1)
  }

  // Close prepaid modal handler
  const closePrepaidModal = () => {
    setIsPrepaidModalOpen(false)
  }

  // Pagination logic
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage)
  const currentInvoices = filteredInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto bg-white shadow rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-green-700">
          Invoice Review (Account Manager) - Final Approval
        </h1>

        <div className="flex gap-2">
          <button
            onClick={refreshData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
          >
            Refresh
          </button>
          <button
            onClick={viewProcessedSummary}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
          >
            Summary
          </button>
          <button
            onClick={clearProcessedInvoices}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
          >
            Clear Queue
          </button>
        </div>
      </div>

      <AMInvoiceFilter filters={filters} setFilters={handleFilter} />

      <div className="overflow-x-auto rounded border mt-4">
        <table className="w-full text-sm md:text-base">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3 border">Sr No</th>
              <th className="p-3 border">Invoice #</th>
              <th className="p-3 border">Vendor Name</th>
              <th className="p-3 border">Amount (₹)</th>
              <th className="p-3 border">PO</th>
              <th className="p-3 border">Type</th>
              <th className="p-3 border">AE Status</th>
              <th className="p-3 border">AM Status</th>
              <th className="p-3 border text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentInvoices.length === 0 ? (
              <tr>
                <td colSpan="9" className="p-4 text-center text-gray-500">
                  No invoices approved by Account Executive yet.
                  <br />
                  <span className="text-xs">Invoices will appear here after AE approval.</span>
                </td>
              </tr>
            ) : (
              currentInvoices.map((inv, index) => (
                <tr key={inv.id} className="hover:bg-gray-50">
                  <td className="p-3 border">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td className="p-3 border">{inv.invoiceNumber}</td>
                  <td className="p-3 border">{inv.vendorName}</td>
                  <td className="p-3 border">₹{inv.totalAmount.toLocaleString()}</td>
                  <td className="p-3 border text-sm space-y-1">
                    {inv.poDocuments && inv.poDocuments.length > 0 ? (
                      inv.poDocuments.map((doc, index) => (
                        <div key={index}>
                          {index + 1}]{' '}
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline hover:text-blue-800"
                          >
                            {doc.name}
                          </a>
                        </div>
                      ))
                    ) : (
                      <span className="text-gray-500 italic">No PO</span>
                    )}
                  </td>
                  <td className="p-3 border">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        inv.type === 'Procurement Prepaid'
                          ? 'bg-purple-100 text-purple-800'
                          : inv.type === 'Fixed Asset'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {inv.type || 'Material'}
                    </span>
                  </td>
                  <td className="p-3 border">
                    <span className="bg-green-200 text-green-800 px-2 py-1 rounded text-xs">
                      Approved by AE
                    </span>
                    {inv.processedBy && (
                      <div className="text-xs text-gray-500 mt-1">by {inv.processedBy}</div>
                    )}
                  </td>
                  <td className="p-3 border">
                    {inv.accountManagerStatus === 'Approved' ? (
                      <div className="flex flex-col gap-2">
                        <span className="bg-green-200 text-green-800 px-2 py-1 rounded text-xs inline-block">
                          ✅ Approved (Final)
                        </span>

                        {/* ✅ SHOW BUTTONS FOR PROCUREMENT PREPAID AFTER APPROVAL - LIKE BILLING MANAGER */}
                        {inv.type === 'Procurement Prepaid' && (
                          <div className="mt-1 space-x-2 flex flex-wrap gap-1">
                            <button
                              className="bg-green-500 text-white text-xs px-2 py-1 rounded cursor-pointer hover:bg-green-600"
                              onClick={() => {
                                setSelectedInvoice(inv)
                                setShowPurchaseModal(true)
                              }}
                            >
                              View Purchase Voucher
                            </button>
                            <button
                              className="bg-blue-500 text-white text-xs px-2 py-1 rounded cursor-pointer hover:bg-blue-600"
                              onClick={() => {
                                setSelectedInvoice(inv)
                                setShowJournalModal(true)
                              }}
                            >
                              View Journal Voucher
                            </button>
                            <button
                              className="bg-purple-500 text-white text-xs px-2 py-1 rounded cursor-pointer hover:bg-purple-600"
                              onClick={() => {
                                setSelectedInvoice(inv)
                                setShowAmortizationModal(true)
                              }}
                            >
                              Monthly Amortization
                            </button>
                          </div>
                        )}

                        {inv.type === 'Fixed Asset' && (
                          <span className="bg-purple-200 text-purple-800 px-2 py-1 rounded text-xs">
                            GL Posted
                          </span>
                        )}
                      </div>
                    ) : inv.accountManagerStatus === 'Rejected' ? (
                      <span className="bg-red-200 text-red-800 px-2 py-1 rounded text-xs">
                        Rejected by AM
                      </span>
                    ) : (
                      <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded text-xs">
                        Pending AM Approval
                      </span>
                    )}
                  </td>
                  <td className="p-3 border text-center">
                    <button
                      onClick={() => openModal(inv)}
                      className={`px-3 py-1.5 rounded text-white text-sm ${
                        inv.accountManagerStatus === 'Approved' ||
                        inv.accountManagerStatus === 'Rejected'
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                      disabled={
                        inv.accountManagerStatus === 'Approved' ||
                        inv.accountManagerStatus === 'Rejected'
                      }
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded border text-sm font-medium ${
                page === currentPage ? 'bg-blue-600 text-white' : 'bg-white'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedInvoice && (
        <AMInvoiceVerifyModal
          isOpen={isModalOpen}
          onClose={closeModal}
          invoice={selectedInvoice}
          handleUpdateInvoice={handleUpdateInvoice}
        />
      )}

      {/* Prepaid Period Selection Modal */}
      {isPrepaidModalOpen && selectedInvoice && (
        <PrepaidPeriodModal
          invoice={selectedInvoice}
          onClose={closePrepaidModal}
          onConfirm={handlePrepaidPeriodConfirm}
        />
      )}

      {/* Purchase Voucher Modal */}
      {showPurchaseModal && selectedInvoice && (
        <PurchaseVoucherModal
          invoice={selectedInvoice}
          onClose={() => setShowPurchaseModal(false)}
        />
      )}

      {/* Journal Voucher Modal */}
      {showJournalModal && selectedInvoice && (
        <JournalVoucherModal invoice={selectedInvoice} onClose={() => setShowJournalModal(false)} />
      )}

      {/* Monthly Amortization Modal */}
      {showAmortizationModal && selectedInvoice && (
        <MonthlyAmortizationModal
          invoice={selectedInvoice}
          onClose={() => {
            setShowAmortizationModal(false)
            setSelectedInvoice(null)
          }}
        />
      )}

      {/* JV Modal (if still needed) */}
      {isJVModalOpen && jvData && (
        <InvoiceJVDisplay
          data={jvData}
          onClose={() => {
            setIsJVModalOpen(false)
            setJvData(null)
          }}
        />
      )}
    </div>
  )
}

export default AMInvoiceReviewPage

/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { FaEye } from 'react-icons/fa'
import { toast } from 'react-toastify'
import ViewInvoiceModal from '../Components/ViewInvoiceModal'
import RejectInvoiceModal from '../Components/RejectInvoiceModal'
import VoucherPreviewModal from '../Components/VoucherPreviewModal' // JV Modal
import ExpenseVoucherModal from '../Components/ExpenseVoucherModal'
import { processFinanceHeadApproval } from '../../Master/utils/accountingHelpers' // <- new import

/* ---------- Helpers ---------- */
const safeParse = (raw) => {
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

const persistArray = (key, arr) => {
  try {
    localStorage.setItem(key, JSON.stringify(arr || []))
  } catch (err) {
    console.error(`Failed to persist ${key}`, err)
  }
}

// Helper to get TDS display info
const getTdsDisplayInfo = (invoice) => {
  if (!invoice.tdsSection && !invoice.tdsApplicable) {
    return {
      display: <span className="text-gray-400">No TDS</span>,
      section: null,
      rate: null,
      amount: 0,
    }
  }

  const section = invoice.tdsSection || 'N/A'
  const rate =
    invoice.tdsRate ||
    invoice.tdsDetails?.rate ||
    (section.includes('194C') ? '2%' : section.includes('194J') ? '10%' : 'N/A')
  const amount =
    invoice.tdsAmount ||
    (invoice.amount && rate
      ? (parseFloat(invoice.amount) * parseFloat(rate.replace('%', ''))) / 100
      : 0)

  const display = (
    <div className="text-xs text-left">
      <div className="font-medium">{section}</div>
      <div className="text-gray-600">{rate}</div>
      {amount > 0 && <div className="text-green-600 font-medium">₹{amount.toFixed(2)}</div>}
    </div>
  )

  return { display, section, rate, amount }
}

/* ---------- Voucher Preparation Functions ---------- */
const prepareExpenseVoucherData = (invoice) => {
  const tdsInfo = getTdsDisplayInfo(invoice)
  const tdsRate = tdsInfo.rate ? parseFloat(tdsInfo.rate.replace('%', '')) : 0
  const invoiceAmount = Number(invoice.amount || 0)
  const tdsAmount = tdsInfo.amount || Math.round((invoiceAmount * tdsRate) / 100)
  const payableAmount = invoiceAmount - tdsAmount

  // ✅ YOUR REAL GL CODES
  const EXPENSE_GL = 'X2002002003' // INDIRECT EXPENSE (from your transactions)
  const TDS_PAYABLE_GL = 'L2003001' // TDS PAYABLE (from your transactions)

  // ✅ Get Vendor GL Code (L2005_XXX format from your system)
  const getVendorGL = (vendorName) => {
    // Extract vendor number from vendor name or use a mapping
    // Your system uses L2005_010, L2005_011 format
    const vendorMap = {
      'Vendor 1': 'L2005_011',
      'Vendor 2': 'L2005_010',
    }
    return (
      vendorMap[vendorName] || `L2005_${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`
    )
  }

  const vendorGL = getVendorGL(invoice.vendorName)

  return {
    header: {
      company: 'ABC Industries Pvt Ltd',
      voucherNo: `PAY/MH01/${new Date().getFullYear()}/${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
      financialYear: '2025-26',
      date: new Date().toISOString().split('T')[0],
      reference: `${invoice.poNo || 'N/A'}/${invoice.invoiceNo || 'N/A'}`,
      preparedBy: 'Finance Head',
      expenseType: invoice.expenseType || 'Indirect Expense',
      department: invoice.department || 'Operations',
    },

    vendorDetails: {
      vendorId:
        invoice.vendorId ||
        `VND-${String(invoice.id || Math.floor(Math.random() * 10000)).padStart(6, '0')}`,
      vendorName: invoice.vendorName || 'Unknown Vendor',
      vendorType: 'External Vendor',
      vendorGL: vendorGL,
      department: invoice.department || 'Operations',
      poNumber: invoice.poNo,
      invoiceNumber: invoice.invoiceNo,
      tdsSection: invoice.tdsSection || '194J',
      tdsRate: tdsRate,
      tdsAmount: tdsAmount,
      submissionDate: invoice.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0],
      approvalDate: new Date().toISOString().split('T')[0],
    },

    expenseDetails: [
      {
        id: 1,
        date: invoice.invoiceDate || new Date().toISOString().split('T')[0],
        serviceProvider: invoice.vendorName || 'Vendor',
        expenseCategory: invoice.expenseType || 'Indirect Expense',
        description: `${invoice.expenseType || 'Indirect Expense'} as per Invoice ${invoice.invoiceNo}`,
        poReference: invoice.poNo,
        invoiceReference: invoice.invoiceNo,
        gstApplicable: invoice.gstin ? 'Yes' : 'No',
        amount: invoiceAmount,
        documentAttached: invoice.documentUrl ? 'Yes' : 'No',
      },
    ],

    entries: [
      {
        id: 1,
        lineNo: 1,
        particulars: 'INDIRECT EXPENSE',
        gl: EXPENSE_GL,
        glCode: EXPENSE_GL,
        glName: 'INDIRECT EXPENSE',
        costCenter: invoice.department || 'Operations',
        debit: invoiceAmount,
        credit: 0,
        note: `Expense - Invoice ${invoice.invoiceNo}`,
        narration: `Expense - Invoice ${invoice.invoiceNo}`,
      },
      {
        id: 2,
        lineNo: 2,
        particulars: `TDS PAYABLE`,
        gl: TDS_PAYABLE_GL,
        glCode: TDS_PAYABLE_GL,
        glName: 'TDS PAYABLE',
        costCenter: '',
        debit: 0,
        credit: tdsAmount,
        note: `TDS @${tdsRate}% on Invoice ${invoice.invoiceNo} - Section ${invoice.tdsSection || '194J'}`,
        narration: `TDS @${tdsRate}% on Invoice ${invoice.invoiceNo} - Section ${invoice.tdsSection || '194J'}`,
      },
      {
        id: 3,
        lineNo: 3,
        particulars: `VENDOR - ${invoice.vendorName}`,
        gl: vendorGL,
        glCode: vendorGL,
        glName: `VENDOR - ${invoice.vendorName}`,
        costCenter: '',
        debit: 0,
        credit: payableAmount,
        note: `Invoice ${invoice.invoiceNo} - Payable (Net of TDS)`,
        narration: `Invoice ${invoice.invoiceNo} - Payable (Net of TDS)`,
      },
    ],

    meta: {
      totalAmount: invoiceAmount,
      gstRate: invoice.gstRate || 0,
      taxableAmount: invoiceAmount,
      totalGST: 0,
      tdsApplicable: true,
      tdsRate: tdsRate,
      tdsSection: invoice.tdsSection || '194J',
      tdsAmount: tdsAmount,
      netPayable: payableAmount,
    },

    narration: `Finance approval posting for Invoice ${invoice.invoiceNo} - ${invoice.vendorName} (TDS: ₹${tdsAmount} @${tdsRate}%)`,

    totals: {
      debit: invoiceAmount,
      credit: invoiceAmount,
    },

    approvals: {
      preparer: 'Finance Head',
      reviewer: 'Approved',
      approver: 'Completed',
      date: new Date().toISOString().split('T')[0],
    },
  }
}

const prepareJVData = (invoice) => {
  const tdsInfo = getTdsDisplayInfo(invoice)
  const tdsRate = tdsInfo.rate ? parseFloat(tdsInfo.rate.replace('%', '')) : 10
  const invoiceAmount = Number(invoice.amount || 0)
  const tdsAmount = tdsInfo.amount || Math.round((invoiceAmount * tdsRate) / 100)

  // ✅ YOUR REAL GL CODES for TDS Journal
  const TDS_RECEIVABLE_GL = 'A3007' // TDS Receivable (Asset)
  const TDS_PAYABLE_GL = 'L2003001' // TDS PAYABLE (from your transactions)

  return {
    header: {
      company: 'ABC Industries Pvt Ltd',
      voucherNo: `JV-TDS/${new Date().getFullYear()}/${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
      financialYear: '2025-26',
      date: new Date().toISOString().split('T')[0],
      reference: `TDS Effect for ${invoice.invoiceNo}`,
      preparedBy: 'Finance Head',
      tdsSection: invoice.tdsSection || '194J',
      tdsRate: tdsRate + '%',
    },

    entries: [
      {
        id: 1,
        lineNo: 1,
        particulars: 'TDS Receivable',
        gl: TDS_RECEIVABLE_GL,
        glCode: TDS_RECEIVABLE_GL,
        glName: 'TDS RECEIVABLE',
        costCenter: '',
        debit: tdsAmount,
        credit: 0,
        note: `TDS @ ${tdsRate}% on Invoice ${invoice.invoiceNo} - ${invoice.vendorName}`,
        narration: `TDS @ ${tdsRate}% on Invoice ${invoice.invoiceNo} - Section ${invoice.tdsSection || '194J'}`,
      },
      {
        id: 2,
        lineNo: 2,
        particulars: 'TDS Payable to Government',
        gl: TDS_PAYABLE_GL,
        glCode: TDS_PAYABLE_GL,
        glName: 'TDS PAYABLE',
        costCenter: '',
        debit: 0,
        credit: tdsAmount,
        note: `TDS liability for ${invoice.vendorName} - Invoice ${invoice.invoiceNo}`,
        narration: `TDS @${tdsRate}% on Invoice ${invoice.invoiceNo} - Section ${invoice.tdsSection || '194J'}`,
      },
    ],

    meta: {
      totalAmount: invoiceAmount,
      tdsApplicable: true,
      tdsRate: tdsRate,
      tdsSection: invoice.tdsSection || '194J',
      tdsAmount: tdsAmount,
    },

    narration: `TDS Journal Entry for Invoice ${invoice.invoiceNo} (${invoice.vendorName}). TDS @ ${tdsRate}% = ₹${tdsAmount}. Section ${invoice.tdsSection || '194J'}.`,

    totals: {
      debit: tdsAmount,
      credit: tdsAmount,
    },

    approvals: {
      preparer: 'Finance Head',
      reviewer: 'Auto Generated',
      approver: 'System',
      date: new Date().toISOString().split('T')[0],
    },

    // Additional invoice details for display
    invoiceNo: invoice.invoiceNo,
    vendorName: invoice.vendorName,
    amount: invoiceAmount,
    poNo: invoice.poNo,
    tdsAmount: tdsAmount,
  }
}

/* ---------- Component ---------- */
export default function FinancialHeadInvoiceApprovalPage() {
  const [invoices, setInvoices] = useState([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [viewInvoice, setViewInvoice] = useState(null)
  const [rejectInvoice, setRejectInvoice] = useState(null)

  // Voucher modals
  const [expenseVoucherData, setExpenseVoucherData] = useState(null)
  const [jvVoucherData, setJvVoucherData] = useState(null)
  const [showExpenseVoucher, setShowExpenseVoucher] = useState(false)
  const [showJVVoucher, setShowJVVoucher] = useState(false)

  const itemsPerPage = 5

  // Load invoices for finance from localStorage on mount
  useEffect(() => {
    const load = () => {
      // Primary: invoicesForFinance (forwarded by Billing)
      let financeArr = safeParse(localStorage.getItem('invoicesForFinance'))
      if (!Array.isArray(financeArr)) {
        // Fallback: use invoices with financialHeadStatus === 'pending'
        const allInvoices = safeParse(localStorage.getItem('invoices')) || []
        financeArr = Array.isArray(allInvoices)
          ? allInvoices.filter(
              (i) => (i.financialHeadStatus || i.financeApproval || 'pending') === 'pending'
            )
          : []
      }

      // Augment documentUrl fallback & ensure GST present
      const DUMMY_DOC = '/public/DxotBTxfHn.png'
      const vendors = safeParse(localStorage.getItem('vendors')) || []

      const normalized = (financeArr || []).map((inv) => {
        const vendorRecord = vendors.find(
          (v) =>
            (v.name &&
              v.name.toString().toLowerCase() ===
                (inv.vendorName || '').toString().toLowerCase()) ||
            (v.companyName &&
              v.companyName.toString().toLowerCase() ===
                (inv.vendorName || '').toString().toLowerCase())
        )

        // Ensure TDS data is properly extracted
        let tdsData = {}
        if (inv.tdsSection || inv.tdsApplicable) {
          tdsData = {
            tdsSection: inv.tdsSection,
            tdsRate: inv.tdsRate,
            tdsAmount: inv.tdsAmount,
            tdsApplicable: inv.tdsApplicable,
            tdsDetails: inv.tdsDetails,
          }
        } else if (inv.poNo) {
          // Try to get TDS from PO data
          try {
            const oneTimePo = safeParse(localStorage.getItem('oneTimePo')) || []
            const po = oneTimePo.find((p) => p.poNumber === inv.poNo)
            if (po && po.tdsSection) {
              tdsData = {
                tdsSection: po.tdsSection,
                tdsRate: po.tdsDetails?.rate || (po.tdsSection.includes('194C') ? '2%' : '10%'),
                tdsAmount: po.amount
                  ? (parseFloat(po.amount) *
                      parseFloat((po.tdsDetails?.rate || '10').replace('%', ''))) /
                    100
                  : 0,
                tdsApplicable: true,
                tdsDetails: po.tdsDetails,
              }
            }
          } catch (error) {
            console.error('Error loading TDS from PO:', error)
          }
        }

        return {
          ...inv,
          ...tdsData,
          documentUrl:
            inv.documentUrl && typeof inv.documentUrl === 'string' && inv.documentUrl.trim() !== ''
              ? inv.documentUrl
              : DUMMY_DOC,
          gstin: inv.gstin || vendorRecord?.gstin || vendorRecord?.GSTIN || '27AAAAP0267H2ZN',
          financialHeadStatus: inv.financialHeadStatus || inv.financeApproval || 'pending',
        }
      })

      setInvoices(normalized)
    }

    load()

    const handleStorage = (e) => {
      if (
        e.key === 'invoicesForFinance' ||
        e.key === 'invoices' ||
        e.key === 'vendors' ||
        e.key === 'oneTimePo'
      ) {
        load()
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  // Approve at Finance level (now performs full accounting posting)
  const handleApprove = async (id) => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
    // Optimistic UI update
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === id ? { ...inv, status: 'processing', financialHeadStatus: 'processing' } : inv
      )
    )

    // Find the invoice object (fresh from state/localStorage)
    const masterInvoices = safeParse(localStorage.getItem('invoices')) || []
    const invoice =
      masterInvoices.find((i) => i.id === id) || invoices.find((i) => i.id === id) || null

    if (!invoice) {
      toast.error('Invoice not found for approval.')
      // revert optimistic update
      setInvoices((prev) =>
        prev.map((inv) =>
          inv.id === id ? { ...inv, status: 'pending', financialHeadStatus: 'pending' } : inv
        )
      )
      return
    }

    try {
      // Call accounting helper to create/post transaction and persist results
      const result = await processFinanceHeadApproval(invoice, {
        financeUser: currentUser.username || 'fh1',
        persistProcessedInvoice: true,
      })

      if (result.success) {
        // Update UI state to approved
        setInvoices((prev) =>
          prev.map((inv) =>
            inv.id === id
              ? {
                  ...inv,
                  status: 'approved',
                  financialHeadStatus: 'approved',
                  approvedAt: new Date().toISOString(),
                  accountingResult: {
                    transactionId: result.transactionId,
                    voucherNo: result.voucherNo,
                  },
                }
              : inv
          )
        )

        // Ensure invoicesForFinance and invoices master reflect approval (processFinanceHeadApproval already attempts this)
        // But we persist here defensively
        const financeArr = safeParse(localStorage.getItem('invoicesForFinance')) || []
        const newFinance = Array.isArray(financeArr)
          ? financeArr.map((f) =>
              f.id === id ? { ...f, status: 'approved', financialHeadStatus: 'approved' } : f
            )
          : []
        persistArray('invoicesForFinance', newFinance)

        const master = safeParse(localStorage.getItem('invoices')) || []
        const masterUpdated = Array.isArray(master)
          ? master.map((m) =>
              m.id === id
                ? {
                    ...m,
                    status: 'approved',
                    financialHeadStatus: 'approved',
                    accountingResult: {
                      transactionId: result.transactionId,
                      voucherNo: result.voucherNo,
                    },
                  }
                : m
            )
          : master
        persistArray('invoices', masterUpdated)

        toast.success(`Invoice ${invoice.invoiceNumber} posted to GL (Voucher ${result.voucherNo})`)
      } else {
        // result.success false
        throw new Error(result.error || 'Unknown error during posting')
      }
    } catch (error) {
      console.error('❌ Error approving invoice at finance level:', error)
      // revert optimistic update to pending so user can retry
      setInvoices((prev) =>
        prev.map((inv) =>
          inv.id === id ? { ...inv, status: 'pending', financialHeadStatus: 'pending' } : inv
        )
      )
      toast.error(`Failed to post invoice: ${error.message}`)
    }
  }

  // Reject at Finance level (open modal to capture reason then confirm)
  const handleReject = (id, reason) => {
    const updated = invoices.map((inv) =>
      inv.id === id
        ? {
            ...inv,
            status: 'rejected',
            financialHeadStatus: 'rejected',
            rejectionReason: reason,
            rejectedAt: new Date().toISOString(),
          }
        : inv
    )
    setInvoices(updated)

    // Persist changes to storage
    const financeStored = safeParse(localStorage.getItem('invoicesForFinance')) || []
    const newFinance = Array.isArray(financeStored)
      ? financeStored.map((f) =>
          f.id === id
            ? { ...f, status: 'rejected', financialHeadStatus: 'rejected', rejectionReason: reason }
            : f
        )
      : updated
    persistArray('invoicesForFinance', newFinance)

    const master = safeParse(localStorage.getItem('invoices')) || []
    const masterUpdated = Array.isArray(master)
      ? master.map((m) =>
          m.id === id
            ? { ...m, status: 'rejected', financialHeadStatus: 'rejected', rejectionReason: reason }
            : m
        )
      : master
    persistArray('invoices', masterUpdated)

    setRejectInvoice(null)
  }

  // Show voucher flow: when expense closed, show JV
  const handleExpenseVoucherClose = () => {
    setShowExpenseVoucher(false)
    setExpenseVoucherData(null)
    // small delay then show JV
    setTimeout(() => {
      setShowJVVoucher(true)
    }, 300)
  }

  const handleJVVoucherClose = () => {
    setShowJVVoucher(false)
    setJvVoucherData(null)
  }

  // Table filtering & pagination
  const filtered = invoices.filter((inv) => {
    const q = (search || '').toString().toLowerCase()
    const matchSearch =
      !q ||
      (inv.invoiceNo && inv.invoiceNo.toString().toLowerCase().includes(q)) ||
      (inv.poNo && inv.poNo.toString().toLowerCase().includes(q)) ||
      (inv.vendorName && inv.vendorName.toString().toLowerCase().includes(q))

    const matchStatus = statusFilter === 'all' || (inv.status || '').toString() === statusFilter
    return matchSearch && matchStatus
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage))
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const getStatusTag = (status) => {
    const base = 'px-2 py-1 rounded text-xs font-semibold'
    switch (status) {
      case 'approved':
        return `${base} bg-green-100 text-green-700`
      case 'rejected':
        return `${base} bg-red-100 text-red-700`
      case 'accepted':
      case 'pending':
      default:
        return `${base} bg-yellow-100 text-yellow-700`
    }
  }

  return (
    <div className="p-4 max-w-7xl mx-auto space-y-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold text-green-600">Financial Head Invoice Approval</h1>

      {/* Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setCurrentPage(1)
          }}
          placeholder="Search by vendor, invoice or PO number"
          className="border rounded px-4 py-2 w-full md:w-1/2"
        />
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value)
            setCurrentPage(1)
          }}
          className="border rounded px-4 py-2 w-full md:w-1/4"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border text-sm mt-4">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">Invoice No</th>
              <th className="border p-2">Vendor</th>
              <th className="border p-2">PO No</th>
              <th className="border p-2">Expense Type</th>
              <th className="border p-2">Amount</th>
              <th className="border p-2">TDS</th> {/* NEW COLUMN */}
              <th className="border p-2">Manager Status</th>
              <th className="border p-2">Finance Status</th>
              <th className="border p-2">Invoice View</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((inv) => {
              const tdsInfo = getTdsDisplayInfo(inv)

              return (
                <tr key={inv.id} className="text-center hover:bg-gray-50">
                  <td className="border p-2">{inv.invoiceNo}</td>
                  <td className="border p-2">{inv.vendorName}</td>
                  <td className="border p-2">{inv.poNo}</td>
                  <td className="border p-2">{inv.expenseType || '—'}</td>
                  <td className="border p-2 font-medium">
                    ₹{Number(inv.amount || 0).toLocaleString()}
                  </td>

                  {/* TDS Column */}
                  <td className="border p-2">{tdsInfo.display}</td>

                  <td className="border p-2 text-green-700 font-semibold">
                    {inv.managerApproval || inv.status || 'Approved'}
                  </td>
                  <td className="border p-2">
                    <span
                      className={getStatusTag(inv.financialHeadStatus || inv.status || 'pending')}
                    >
                      {(inv.financialHeadStatus || inv.status || 'pending').toString()}
                    </span>
                  </td>
                  <td className="border p-2">
                    <FaEye
                      onClick={() => setViewInvoice(inv)}
                      className="text-blue-600 cursor-pointer mx-auto hover:text-blue-800"
                      title="View Invoice"
                    />
                  </td>
                  <td className="border p-2">
                    <div className="flex flex-col gap-1 items-center">
                      {(inv.financialHeadStatus || inv.status) === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(inv.id)}
                            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-xs w-24"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => setRejectInvoice(inv)}
                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-xs w-24"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {((inv.financialHeadStatus || inv.status) === 'approved' ||
                        (inv.financialHeadStatus || inv.status) === 'accepted') && (
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => {
                              const expenseData = prepareExpenseVoucherData(inv)
                              setExpenseVoucherData(expenseData)
                              setShowExpenseVoucher(true)
                            }}
                            className="bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700 text-xs"
                          >
                            Expense Voucher
                          </button>
                          <button
                            onClick={() => {
                              const jvData = prepareJVData(inv)
                              setJvVoucherData(jvData)
                              setShowJVVoucher(true)
                            }}
                            className="bg-purple-600 text-white px-2 py-1 rounded hover:bg-purple-700 text-xs"
                          >
                            TDS Journal
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 flex-wrap">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 border rounded ${
              currentPage === i + 1
                ? 'bg-blue-600 text-white'
                : 'bg-white text-blue-600 hover:bg-blue-100'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Modals */}
      {viewInvoice && (
        <ViewInvoiceModal
          invoice={{
            ...viewInvoice,
            documentUrl: viewInvoice.documentUrl || '/public/DxotBTxfHn.png',
          }}
          onClose={() => setViewInvoice(null)}
        />
      )}

      {rejectInvoice && (
        <RejectInvoiceModal
          invoice={rejectInvoice}
          onClose={() => setRejectInvoice(null)}
          onConfirm={(reason) => handleReject(rejectInvoice.id, reason)}
        />
      )}

      {/* Expense Voucher Modal */}
      {showExpenseVoucher && expenseVoucherData && (
        <ExpenseVoucherModal data={expenseVoucherData} onClose={handleExpenseVoucherClose} />
      )}

      {/* TDS Journal Voucher Modal */}
      {showJVVoucher && jvVoucherData && (
        <VoucherPreviewModal invoice={jvVoucherData} onClose={handleJVVoucherClose} />
      )}
    </div>
  )
}

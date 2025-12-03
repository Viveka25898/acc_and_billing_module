/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import InvoiceFilters from '../Components/InvoiceFilter'
import InvoiceTable from '../Components/InvoiceTable'
import RejectInvoiceModal from '../Components/RejectInvoiceModal'
import VerifyInvoiceModal from '../Components/ViewInvoiceModal'

const safeParse = (raw) => {
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

const findVendorRecord = (vendorName) => {
  try {
    const vendorsRaw = safeParse(localStorage.getItem('vendors')) || []
    if (!Array.isArray(vendorsRaw)) return null
    const lower = (vendorName || '').toString().toLowerCase()
    return vendorsRaw.find(
      (v) =>
        (v.name && v.name.toString().toLowerCase() === lower) ||
        (v.companyName && v.companyName.toString().toLowerCase() === lower)
    )
  } catch {
    return null
  }
}

// Helper to get PO data and extract TDS
const getPOTdsData = (poNumber) => {
  try {
    const oneTimePo = safeParse(localStorage.getItem('oneTimePo')) || []
    const po = oneTimePo.find((p) => p.poNumber === poNumber)

    if (po && po.tdsSection) {
      // FIXED: Added parentheses around ternary operator
      const tdsRate = po.tdsDetails?.rate || (po.tdsSection.includes('194C') ? '2%' : '10%')

      const tdsAmount = po.amount
        ? (parseFloat(po.amount) * parseFloat(tdsRate.replace('%', ''))) / 100
        : 0

      return {
        tdsSection: po.tdsSection,
        tdsRate: tdsRate,
        tdsAmount: tdsAmount,
      }
    }
    return null
  } catch (error) {
    console.error('Error getting PO TDS data:', error)
    return null
  }
}

const DUMMY_INVOICE_URL = '/public/DxotBTxfHn.png'

const generateInvoiceFromPO = (po, idx) => {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 9000) + 1000
  const year = new Date().getFullYear()
  const invoiceNo = `INV-${year}-${random}`

  const vendorRecord = findVendorRecord(po.vendorName)
  const vendorGstin = po.gstin || vendorRecord?.gstin || vendorRecord?.GSTIN || '27AAAAP0267H2ZN'
  const docUrl = DUMMY_INVOICE_URL

  // Get TDS data from PO
  const tdsData = getPOTdsData(po.poNumber) || {}

  return {
    id: `inv_${timestamp}_${random}_${idx}`,
    invoiceNo,
    vendorName: po.vendorName || 'Unknown Vendor',
    poNo: po.poNumber || 'N/A',
    gstin: vendorGstin,
    amount: Number(po.amount || 0),
    tdsSection: tdsData.tdsSection || null,
    tdsRate: tdsData.tdsRate || null,
    tdsAmount: tdsData.tdsAmount || 0,
    status: 'pending',
    documentUrl: docUrl,
    financialHeadStatus: 'pending',
    createdAt: new Date().toISOString(),
    poRef: {
      id: po.id || null,
      poNumber: po.poNumber || null,
    },
  }
}

export default function InvoiceVerificationPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('')
  const [invoices, setInvoices] = useState([])

  const [selectedInvoiceForView, setSelectedInvoiceForView] = useState(null)
  const [selectedInvoiceForReject, setSelectedInvoiceForReject] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Load and initialize invoices on mount (and on custom events)
  useEffect(() => {
    const loadInvoices = () => {
      const stored = safeParse(localStorage.getItem('invoices')) || []
      const oneTimePo = safeParse(localStorage.getItem('oneTimePo')) || []

      const invoicesFromStorage = Array.isArray(stored) ? stored : []
      const poMap = new Map()
      if (Array.isArray(oneTimePo)) {
        oneTimePo.forEach((po) => {
          const key = po.poNumber || `PO_AUTO_${po.id || Date.now()}`
          poMap.set(key, { ...po, poNumber: key })
        })
      }

      // generate invoices for POs without invoices
      const missingInvoices = []
      if (poMap.size > 0) {
        const existingPoNos = new Set(invoicesFromStorage.map((inv) => inv.poNo))
        let idx = 0
        poMap.forEach((po, poNumber) => {
          if (!existingPoNos.has(poNumber)) {
            missingInvoices.push(generateInvoiceFromPO(po, idx))
            idx += 1
          }
        })
      }

      const augmentedStored = invoicesFromStorage.map((inv) => {
        const vendorRecord = findVendorRecord(inv.vendorName)
        const gstin = inv.gstin || vendorRecord?.gstin || vendorRecord?.GSTIN || '27AAAAP0267H2ZN'
        const documentUrl =
          inv.documentUrl && typeof inv.documentUrl === 'string' && inv.documentUrl.trim() !== ''
            ? inv.documentUrl
            : DUMMY_INVOICE_URL

        // Ensure TDS data exists
        if (!inv.tdsSection && inv.poNo) {
          const tdsData = getPOTdsData(inv.poNo) || {}
          return {
            ...inv,
            gstin,
            documentUrl,
            tdsSection: inv.tdsSection || tdsData.tdsSection || null,
            tdsRate: inv.tdsRate || tdsData.tdsRate || null,
            tdsAmount: inv.tdsAmount || tdsData.tdsAmount || 0,
          }
        }

        return {
          ...inv,
          gstin,
          documentUrl,
        }
      })

      // IMPORTANT: save merged invoices to the "invoices" key
      const merged = [...missingInvoices, ...augmentedStored]

      if (
        missingInvoices.length > 0 ||
        JSON.stringify(merged) !== JSON.stringify(invoicesFromStorage)
      ) {
        try {
          localStorage.setItem('invoices', JSON.stringify(merged))
        } catch (err) {
          console.error('Failed to persist invoices to localStorage', err)
        }
      }

      setInvoices(merged)
    }

    loadInvoices()

    // React to localStorage changes
    const handleStorage = (e) => {
      if (e.key === 'invoices' || e.key === 'oneTimePo' || e.key === 'vendors') {
        loadInvoices()
      }
    }

    const handlePoCreated = () => {
      loadInvoices()
    }

    window.addEventListener('storage', handleStorage)
    window.addEventListener('poCreated', handlePoCreated)
    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener('poCreated', handlePoCreated)
    }
  }, [])

  // Approve by Billing Exec/Manager - forward to finance
  const handleApprove = (invoiceId) => {
    setInvoices((prev) => {
      const updated = prev.map((inv) => {
        if (inv.id === invoiceId) {
          // Get the full invoice with TDS data
          const invoice = inv

          return {
            ...invoice,
            status: 'accepted',
            financialHeadStatus: 'pending',
            billingApprovedAt: new Date().toISOString(),
            // Keep TDS data as is
          }
        }
        return inv
      })

      // persist invoices to the canonical 'invoices' key
      try {
        localStorage.setItem('invoices', JSON.stringify(updated))
      } catch (err) {
        console.error('Error saving invoices to localStorage', err)
      }

      // Add to invoicesForFinance with TDS data
      try {
        const financeRaw = safeParse(localStorage.getItem('invoicesForFinance')) || []
        const financeArr = Array.isArray(financeRaw) ? financeRaw : []

        const invoiceToPush = updated.find((i) => i.id === invoiceId)
        const existsInFinance = financeArr.some((f) => f.id === invoiceToPush.id)
        if (!existsInFinance) {
          // Include TDS data when forwarding to finance
          financeArr.unshift({
            ...invoiceToPush,
            tdsApplicable: !!invoiceToPush.tdsSection,
            tdsSection: invoiceToPush.tdsSection || null,
            tdsRate: invoiceToPush.tdsRate || null,
            tdsAmount: invoiceToPush.tdsAmount || 0,
            forwardedAt: new Date().toISOString(),
          })
          localStorage.setItem('invoicesForFinance', JSON.stringify(financeArr))
        }
      } catch (err) {
        console.error('Error updating invoicesForFinance in localStorage', err)
      }

      return updated
    })
  }

  // Reject by Billing Exec/Manager
  const handleReject = (invoiceId, remarks) => {
    setInvoices((prev) => {
      const updated = prev.map((inv) =>
        inv.id === invoiceId
          ? {
              ...inv,
              status: 'rejected',
              rejectionRemarks: String(remarks || ''),
              rejectedAt: new Date().toISOString(),
            }
          : inv
      )

      try {
        localStorage.setItem('invoices', JSON.stringify(updated))
      } catch (err) {
        console.error('Error saving rejected invoice to localStorage', err)
      }

      return updated
    })

    setSelectedInvoiceForReject(null)
  }

  // Filter logic
  const filtered = invoices.filter((inv) => {
    const q = (search || '').toString().toLowerCase()
    const matchSearch =
      !q ||
      (inv.invoiceNo && inv.invoiceNo.toString().toLowerCase().includes(q)) ||
      (inv.poNo && inv.poNo.toString().toLowerCase().includes(q)) ||
      (inv.vendorName && inv.vendorName.toString().toLowerCase().includes(q))

    const matchStatus = statusFilter === 'all' || inv.status === statusFilter
    const matchDate = dateFilter
      ? inv.invoiceDate === dateFilter || inv.createdAt?.split('T')[0] === dateFilter
      : true
    return matchSearch && matchStatus && matchDate
  })

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage))
  const paginatedInvoices = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1)
  }, [totalPages, currentPage])

  return (
    <div className="p-4 max-w-7xl mx-auto space-y-6 bg-white rounded-md shadow-md">
      <h1 className="text-2xl font-bold text-green-600">Invoice Verification</h1>

      <InvoiceFilters
        search={search}
        setSearch={(v) => {
          setSearch(v)
          setCurrentPage(1)
        }}
        statusFilter={statusFilter}
        setStatusFilter={(v) => {
          setStatusFilter(v)
          setCurrentPage(1)
        }}
        dateFilter={dateFilter}
        setDateFilter={(v) => {
          setDateFilter(v)
          setCurrentPage(1)
        }}
      />

      <InvoiceTable
        invoices={paginatedInvoices}
        onView={(inv) => setSelectedInvoiceForView(inv)}
        onReject={(inv) => setSelectedInvoiceForReject(inv)}
        onApprove={(id) => handleApprove(id)}
      />

      {/* Pagination */}
      <div className="flex justify-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-3 py-1 rounded border ${
              page === currentPage
                ? 'bg-blue-600 text-white'
                : 'bg-white text-blue-600 hover:bg-blue-100'
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* View Modal */}
      {selectedInvoiceForView && (
        <VerifyInvoiceModal
          isOpen={!!selectedInvoiceForView}
          onClose={() => setSelectedInvoiceForView(null)}
          invoice={{
            ...selectedInvoiceForView,
            documentUrl: selectedInvoiceForView.documentUrl || DUMMY_INVOICE_URL,
          }}
        />
      )}

      {/* Reject Modal */}
      {selectedInvoiceForReject && (
        <RejectInvoiceModal
          invoice={selectedInvoiceForReject}
          onClose={() => setSelectedInvoiceForReject(null)}
          onConfirm={(id, remarks) => handleReject(id, remarks)}
        />
      )}
    </div>
  )
}

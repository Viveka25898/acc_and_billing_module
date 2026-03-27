// ─── paymentHelpers.js ────────────────────────────────────────────────────────
// Centralised helper functions for the Process For Payments feature.
// All localStorage keys and data structures are preserved as-is so that
// other modules that write to these keys (AM, BM, Finance Head, Rent, etc.)
// are not affected.
// When the API is ready, replace the localStorage reads in each loader with
// an API call — the callers stay the same.
// ─────────────────────────────────────────────────────────────────────────────
import { toast } from 'react-toastify'

// ─── Bank / IFSC Generators ───────────────────────────────────────────────────
// NOTE: These generate deterministic pseudo-values from vendor name until the
// vendor master API provides real bank details.
const stringHash = (str) => {
  let hash = 0
  const s = String(str)
  for (let i = 0; i < s.length; i++) hash = Math.imul(31, hash) + s.charCodeAt(i) | 0
  return Math.abs(hash).toString(36)
}

export const generateBankAccount = (vendorName = '') => {
  const hash = vendorName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return `${123456789000 + (hash % 10000)}`
}

export const extractBeneficiaryAccount = (invoiceOrVoucher) => {
  if (invoiceOrVoucher?.vendorDetails?.vendorGL) {
    const match = invoiceOrVoucher.vendorDetails.vendorGL.match(/\d+/)
    if (match) return `987654${match[0].substring(0, 6)}`
  }
  if (invoiceOrVoucher?.vendor_gl_mappings?.payable_gl_code) {
    const match = invoiceOrVoucher.vendor_gl_mappings.payable_gl_code.match(/\d+/)
    if (match) return `987654${match[0].substring(0, 6)}`
  }
  const vendorName =
    invoiceOrVoucher?.vendorName || invoiceOrVoucher?.vendorDetails?.vendorName
  if (vendorName) {
    const hash = vendorName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return `987654${String(321000 + (hash % 10000))}`
  }
  return '987654321000'
}

export const extractIFSCCode = (invoiceOrVoucher) => {
  const vendorName =
    invoiceOrVoucher?.vendorName || invoiceOrVoucher?.vendorDetails?.vendorName
  if (vendorName) {
    const hash = vendorName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const banks = ['HDFC', 'ICIC', 'SBIN', 'YESB', 'AXIS']
    const branchCode = String(1000 + (hash % 9000)).padStart(4, '0')
    return `${banks[hash % banks.length]}0${branchCode}`
  }
  return 'HDFC0000123'
}

// ─── Vendor Data Loader ───────────────────────────────────────────────────────
/**
 * Loads all approved invoices from every upstream source in localStorage and
 * groups them by vendor.
 * Sources:
 *   - processed_invoices          (AM processed)
 *   - final_processed_invoices    (BM final processed)
 *   - oneTimeFinalProcessedInvoice (Finance Head approved)
 */
export const loadInvoicesFromLocalStorage = () => {
  try {
    const processedInvoices = JSON.parse(localStorage.getItem('processed_invoices') || '[]')
    const finalProcessedInvoices = JSON.parse(
      localStorage.getItem('final_processed_invoices') || '[]'
    )
    const oneTimeFinalProcessed = JSON.parse(
      localStorage.getItem('oneTimeFinalProcessedInvoice') || '[]'
    )

    const allInvoices = [...processedInvoices, ...finalProcessedInvoices, ...oneTimeFinalProcessed]

    const filteredInvoices = allInvoices.filter((invoice) => {
      const approvalStatus = invoice.approvalStatus || invoice.status || invoice.approval_status
      const paymentStatus = invoice.paymentStatus || 'pending'

      return (
        approvalStatus === 'Approved' ||
        approvalStatus === 'Approved by AM' ||
        approvalStatus === 'Approved by BM' ||
        approvalStatus === 'Processed by AM' ||
        approvalStatus === 'Processed by BM' ||
        approvalStatus?.includes('Final Approved') ||
        invoice.processedAtAM ||
        invoice.processedAtBM ||
        (invoice.source === 'finance_head_approval' && paymentStatus === 'pending')
      )
    })

    const vendorMap = {}

    filteredInvoices.forEach((invoice, index) => {
      const invoiceNo = invoice.invoiceNo || invoice.invoiceNumber
      const vendorName = invoice.vendorName

      if (!vendorName) return

      if (!vendorMap[vendorName]) {
        vendorMap[vendorName] = {
          id: `VENDOR-${stringHash(vendorName)}`,
          vendorName,
          debitBankAccountNumber: generateBankAccount(vendorName),
          debitAmount: 0,
          currency: 'INR',
          beneficiaryAccountNumber: extractBeneficiaryAccount(invoice),
          ifscCode: extractIFSCCode(invoice),
          narration: vendorName.substring(0, 20),
          invoices: [],
          source: invoice.source || 'am_bm_approval',
        }
      }

      let invoiceTypeLabel = ''
      if (invoice.type === 'Material') invoiceTypeLabel = 'Material Invoice'
      else if (invoice.type === 'Fixed Asset') invoiceTypeLabel = 'Fixed Asset'
      else if (invoice.type === 'Procurement Prepaid') invoiceTypeLabel = 'Uniform Prepaid'
      else if (invoice.expenseType) invoiceTypeLabel = invoice.expenseType
      else invoiceTypeLabel = invoice.type || 'Invoice'

      // Priority: netPayable > amount > totalAmount
      let amount = 0
      if (invoice.netPayable !== undefined && invoice.netPayable !== null) {
        amount = invoice.netPayable
      } else if (invoice.amount) {
        amount = invoice.amount
      } else if (invoice.totalAmount) {
        amount = invoice.totalAmount
      }

      const invoiceId = invoice.id || invoice._id || `INV-${stringHash(invoiceNo + '-' + amount + '-' + index)}`

      vendorMap[vendorName].invoices.push({
        id: invoiceId,
        invoiceNumber: invoiceNo,
        amount,
        documentUrl: invoice.documentUrl || null,
        type: invoice.type || invoice.expenseType,
        invoiceTypeLabel,
        gstRate: invoice.gstRate,
        hsnCode: invoice.hsnCode,
        processedAt:
          invoice.processedAt ||
          invoice.processedAtAM ||
          invoice.processedAtBM ||
          invoice.financeApprovedAt,
        vendorGLCode:
          invoice.vendorGLCode || invoice.vendor_gl_code || invoice.vendorGL,
        voucherNo:
          invoice.voucherNo ||
          invoice.voucher_id ||
          invoice.purchaseVoucherNo ||
          invoice.accountingResult?.voucherNo,
        tdsApplicable: invoice.tdsApplicable,
        tdsSection: invoice.tdsSection,
        tdsRate: invoice.tdsRate,
        tdsAmount: invoice.tdsAmount,
        netPayable: invoice.netPayable,
        accountingResult: invoice.accountingResult,
        source: invoice.source || 'am_bm_approval',
      })

      vendorMap[vendorName].debitAmount += amount
    })

    return Object.values(vendorMap)
  } catch (error) {
    toast.error('Failed to load vendor invoices from storage')
    return []
  }
}

// ─── Rent Voucher Loader ──────────────────────────────────────────────────────
export const loadRentVouchersFromLocalStorage = () => {
  try {
    const rentVouchers = JSON.parse(localStorage.getItem('vendorVouchers') || '[]')
    const vendorMap = {}

    rentVouchers.forEach((voucher, index) => {
      if (voucher.status !== 'Approved' || voucher.paymentStatus !== 'Pending Payment') return

      const vendorName = voucher.vendorDetails?.vendorName || voucher.ownerName
      const vendorId = `RENT-VND-${stringHash(vendorName)}`

      vendorMap[vendorId] = {
        id: vendorId,
        vendorName,
        debitBankAccountNumber: generateBankAccount(vendorName),
        debitAmount: 0,
        currency: 'INR',
        beneficiaryAccountNumber: extractBeneficiaryAccount(voucher),
        ifscCode: extractIFSCCode(voucher),
        narration: `Rent Payment - ${voucher.siteName}`,
        invoices: [],
        isRentVoucher: true,
      }

      const invoiceId = voucher.id || voucher._id || `RENT-INV-${stringHash(voucher.month + '-' + voucher.amount + '-' + index)}`

      vendorMap[vendorId].invoices.push({
        id: invoiceId,
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
    })

    return Object.values(vendorMap)
  } catch (error) {
    toast.error('Failed to load rent vouchers')
    return []
  }
}

// ─── Data Validation ──────────────────────────────────────────────────────────
export const validateAndCleanVendorData = (data) => {
  if (!Array.isArray(data)) return []
  return data
    .filter(
      (vendor) =>
        vendor &&
        vendor.vendorName &&
        Array.isArray(vendor.invoices) &&
        vendor.invoices.length > 0
    )
    .map((vendor) => ({
      ...vendor,
      invoices: vendor.invoices.filter(
        (inv) =>
          inv && inv.invoiceNumber && typeof inv.amount === 'number' && inv.amount >= 0
      ),
    }))
    .filter((vendor) => vendor.invoices.length > 0)
}

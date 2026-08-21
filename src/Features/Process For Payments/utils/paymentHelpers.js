// ─── paymentHelpers.js ────────────────────────────────────────────────────────
// Centralised helper functions and data transformers for Process For Payments
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Transforms raw API response array of vendors into component state format.
 * Handles numeric conversions, label formatting, fallback defaults, and unique keys.
 * 
 * @param {Array} apiVendors Raw vendors array from API
 * @returns {Array} Standardized vendor list for UI
 */
export const transformPendingVendorApiResponse = (apiVendors = []) => {
  if (!Array.isArray(apiVendors)) return []

  return apiVendors.map((vendor, vIdx) => {
    const vendorId = vendor.vendorId || vendor.id || `VND-TMP-${vIdx}`
    const vendorName = vendor.vendorName ? vendor.vendorName.trim() : '-'
    const isRentVoucher =
      vendorId.startsWith('OWN-') ||
      (Array.isArray(vendor.invoices) && vendor.invoices.some((i) => i.type === 'RENT'))

    const invoices = (vendor.invoices || []).map((inv, iIdx) => {
      const rawAmt = inv.netPayable !== undefined && inv.netPayable !== null ? inv.netPayable : inv.amount
      const parsedAmount = parseFloat(rawAmt) || 0

      let typeLabel = '-'
      if (inv.type) {
        const uType = String(inv.type).toUpperCase()
        if (uType === 'MATERIAL') typeLabel = 'Material Invoice'
        else if (uType === 'FIXED_ASSET') typeLabel = 'Fixed Asset'
        else if (uType === 'RENT') typeLabel = 'Rent Voucher'
        else if (uType.includes('PREPAID') || uType.includes('UNIFORM')) typeLabel = 'Uniform Prepaid'
        else typeLabel = inv.type
      }

      return {
        id: inv.invoiceId || inv.id || `INV-TMP-${vendorId}-${iIdx}`,
        invoiceNumber: inv.invoiceNumber || inv.invoiceNo || '-',
        amount: parsedAmount,
        netPayable: parseFloat(inv.netPayable) || parsedAmount,
        originalAmount: parseFloat(inv.amount) || parsedAmount,
        documentUrl: inv.documentUrl || null,
        type: inv.type || 'MATERIAL',
        invoiceTypeLabel: typeLabel,
        vendorGLCode: inv.vendorGlCode || inv.vendorGLCode || inv.vendor_gl_code || '-',
        paymentStatus: inv.paymentStatus || 'PENDING_PAYMENT',
        isRentVoucher: inv.type === 'RENT' || vendorId.startsWith('OWN-'),
        source: 'api_pending_list',
      }
    })

    const computedDebitAmount =
      parseFloat(vendor.debitAmount) ||
      invoices.reduce((sum, i) => sum + i.amount, 0)

    return {
      id: vendorId,
      vendorId,
      vendorName,
      debitAmount: computedDebitAmount,
      currency: vendor.currency || 'INR',
      debitBankAccountNumber: vendor.debitBankAccountNumber || 'N/A',
      beneficiaryAccountNumber: vendor.beneficiaryAccountNumber || 'N/A',
      ifscCode: vendor.ifscCode || 'N/A',
      narration: vendorName !== '-' ? vendorName.substring(0, 20) : '-',
      invoices,
      isRentVoucher,
    }
  })
}

/**
 * Transforms raw API response array of pending reliever requests into component state format.
 * Handles numeric string conversions, label formatting, default fallbacks, and unique keys.
 * 
 * @param {Array} apiRequests Raw reliever requests from API
 * @returns {Array} Standardized reliever requests list for UI
 */
export const transformPendingRelieverApiResponse = (apiRequests = []) => {
  if (!Array.isArray(apiRequests)) return []

  return apiRequests.map((req, idx) => {
    const requestId = req.requestId || req.id || `REL-TMP-${idx}`
    const parsedAmount = parseFloat(req.amount) || 0
    const documentUrl = req.documentUrl
      ? req.documentUrl.startsWith('http')
        ? req.documentUrl
        : `/${req.documentUrl}`
      : null

    return {
      id: requestId,
      requestId,
      'Reliever Name': req.relieverName ? req.relieverName.trim() : '-',
      'Employee ID': req.employeeId ? String(req.employeeId).trim() : '-',
      relieverName: req.relieverName ? req.relieverName.trim() : '-',
      employeeId: req.employeeId ? String(req.employeeId).trim() : '-',
      Site: req.site ? req.site.trim() : '-',
      site: req.site ? req.site.trim() : '-',
      Amount: parsedAmount,
      amount: parsedAmount,
      'Account No': req.accountNo || req.bankAccount || 'N/A',
      'IFSC Code': req.ifscCode || req.ifsc || 'N/A',
      'Days Worked': req.daysWorked || 1,
      documentUrl,
      paymentStatus: req.paymentStatus || 'PENDING_PAYMENT',
    }
  })
}

// ─── Bank / IFSC Generators (Fallback for mock entries) ───────────────────────
const stringHash = (str) => {
  let hash = 0
  const s = String(str)
  for (let i = 0; i < s.length; i++) hash = (Math.imul(31, hash) + s.charCodeAt(i)) | 0
  return Math.abs(hash).toString(36)
}

export const generateBankAccount = (vendorName = '') => {
  if (!vendorName || vendorName === '-') return 'N/A'
  const hash = vendorName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return `${123456789000 + (hash % 10000)}`
}

export const extractBeneficiaryAccount = (invoiceOrVoucher) => {
  if (invoiceOrVoucher?.vendorDetails?.vendorGL) {
    const match = invoiceOrVoucher.vendorDetails.vendorGL.match(/\d+/)
    if (match) return `987654${match[0].substring(0, 6)}`
  }
  const vendorName = invoiceOrVoucher?.vendorName || invoiceOrVoucher?.vendorDetails?.vendorName
  if (vendorName && vendorName !== '-') {
    const hash = vendorName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return `987654${String(321000 + (hash % 10000))}`
  }
  return 'N/A'
}

export const extractIFSCCode = (invoiceOrVoucher) => {
  const vendorName = invoiceOrVoucher?.vendorName || invoiceOrVoucher?.vendorDetails?.vendorName
  if (vendorName && vendorName !== '-') {
    const code = stringHash(vendorName).toUpperCase().substring(0, 4)
    return `HDFC0${code.padStart(6, '0')}`
  }
  return 'HDFC0001234'
}

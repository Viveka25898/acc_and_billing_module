import axiosInstance from '../../../api/axiosInstance'

/**
 * UNIFIED VENDOR LEDGER SERVICE
 * Fetches actual ledger data from the backend APIs for a selected Vendor account.
 */
export class UnifiedVendorLedgerService {

  /**
   * Safe date parsing helper
   */
  static parseDate(dateString) {
    try {
      if (!dateString) return null
      if (dateString.includes('-')) {
        const parts = dateString.split('-')
        if (parts[0].length === 4) {
          return new Date(dateString)
        } else {
          const year = parts[2].length === 2 ? `20${parts[2]}` : parts[2]
          return new Date(`${year}-${parts[1]}-${parts[0]}`)
        }
      }
      return new Date(dateString)
    } catch {
      return null
    }
  }

  /**
   * Date formatting helper (DD-MM-YY)
   */
  static formatDate(dateString) {
    try {
      if (!dateString) return '-'
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return dateString

      const day = String(date.getDate()).padStart(2, '0')
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const year = String(date.getFullYear()).slice(-2)
      return `${day}-${month}-${year}`
    } catch {
      return dateString
    }
  }

  /**
   * Categorize the expense category based on counterparty GL code or entry type
   */
  static getExpenseCategory(type, counterparty) {
    const checkType = String(type || '').toLowerCase()
    if (checkType === 'hk materials' || checkType === 'hk material') return 'HK Materials'
    if (checkType === 'fixed assets' || checkType === 'fixed asset') return 'Fixed Assets'
    if (checkType === 'uniforms' || checkType === 'uniform') return 'Prepaid Expenses'
    if (checkType === 'rent') return 'Rent'

    const checkCp = String(counterparty || '')
    if (checkCp.includes('X1001004')) return 'HK Materials'
    if (checkCp.includes('A100')) return 'Fixed Assets'
    if (checkCp.includes('A3005001')) return 'Prepaid Expenses'
    if (checkCp.includes('X2001002002')) return 'Rent'

    return 'Other'
  }

  /**
   * Get all entries for a specific vendor GL account
   */
  static async getVendorLedgerEntries(accountCode) {
    try {
      console.log(`📊 Fetching entries for vendor account: ${accountCode}`)
      
      // Request vendor entries from API
      const res = await axiosInstance.get(`/account-master/ledger/vendor/${accountCode}/entries`, {
        params: { page: 1, limit: 500 }
      })

      const entriesList = res.data?.results?.entries || res.data?.data?.entries || res.data?.entries || []
      
      return entriesList.map(entry => {
        const debit = entry.debit !== null && entry.debit !== undefined && entry.debit !== '-' ? parseFloat(entry.debit) : 0
        const credit = entry.credit !== null && entry.credit !== undefined && entry.credit !== '-' ? parseFloat(entry.credit) : 0

        // Handle balance string like "58800.00 CR" or format number if needed
        let balanceStr = entry.balance || '-'
        if (typeof balanceStr === 'number') {
          balanceStr = `${balanceStr.toLocaleString('en-IN', { minimumFractionDigits: 2 })} CR`
        }

        const expenseCategory = this.getExpenseCategory(entry.type, entry.counterparty)

        return {
          date: this.formatDate(entry.date),
          originalDate: entry.date,
          voucherNo: entry.voucherNo || '-',
          entryType: entry.entryType || 'Journal',
          debit: debit > 0 ? debit.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-',
          credit: credit > 0 ? credit.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-',
          balance: balanceStr,
          balanceType: entry.balanceType || (balanceStr.includes('DR') ? 'DR' : 'CR'),
          narration: entry.narration || '-',
          refNo: entry.refNo || entry.invoice || '-',
          counterparty: entry.counterparty || '-',
          type: entry.type || 'Other',
          approvedBy: entry.approvedBy || '-',
          attachments: entry.attachments !== null && entry.attachments !== undefined ? entry.attachments : '-',
          costCenter: entry.costCenter || 'General',
          customer: entry.customer || '-',
          site: entry.site || '-',
          state: entry.state || '-',
          expenseCategory: expenseCategory,
          status: entry.status || 'Posted'
        }
      })

    } catch (error) {
      console.error(`❌ Error fetching vendor entries for ${accountCode}:`, error)
      throw error
    }
  }

  /**
   * Get vendor metadata details and balances/statistics
   */
  static async getVendorAccountDetails(accountCode) {
    try {
      console.log(`🔍 Fetching metadata for vendor account: ${accountCode}`)

      // Load header and footer details in parallel
      const [resHeader, resFooter] = await Promise.all([
        axiosInstance.get(`/account-master/ledger/vendor/${accountCode}/header`),
        axiosInstance.get(`/account-master/ledger/vendor/${accountCode}/footer`)
      ])

      const headerResults = resHeader.data?.results || resHeader.data?.data || {}
      const footerResults = resFooter.data?.results || resFooter.data?.data || {}

      const vendorInfo = headerResults.vendorInfo || {}
      const balances = headerResults.balances || {}
      const headerSummary = headerResults.summary || {}

      // Clean up prefix text for UI display
      const rawName = vendorInfo.vendorName || vendorInfo.accountName || accountCode
      const cleanName = rawName
        .replace('VENDOR - ', '')
        .replace('HK MATERIAL VENDOR - ', '')
        .replace('FIXED ASSET VENDOR - ', '')
        .replace('UNIFORM VENDOR - ', '')
        .replace('PREPAID VENDOR - ', '')

      const openingBalanceVal = parseFloat(balances.openingBalance || 0)
      const currentOutstandingVal = parseFloat(balances.currentOutstanding || footerResults.closingBalance || 0)

      const totalInvoicesVal = parseFloat(headerSummary.totalInvoices || footerResults.totalCredit || 0)
      const totalPaymentsVal = parseFloat(headerSummary.totalPayments || footerResults.totalDebit || 0)
      
      const pendingInvoices = headerSummary.pendingInvoicesCount !== undefined
        ? `${headerSummary.pendingInvoicesCount} Invoices`
        : '0 Invoices'

      const breakdown = footerResults.transactionCategoryBreakdown || {}
      
      const transactionTypes = {
        hkMaterial: parseFloat(breakdown.hkMaterials || 0),
        fixedAsset: parseFloat(breakdown.fixedAssets || 0),
        prepaidUniform: parseFloat(breakdown.uniforms || 0),
        rent: parseFloat(breakdown.rent || 0),
        payments: totalPaymentsVal,
        other: 0
      }

      return {
        vendorCode: vendorInfo.vendorCode || accountCode,
        vendorName: cleanName,
        glAccountCode: vendorInfo.glAccountCode || accountCode,
        accountName: vendorInfo.accountName || rawName,
        gstin: vendorInfo.gstin || '-',
        pan: vendorInfo.pan || '-',
        tdsSection: vendorInfo.tdsSection || '-',
        paymentTerms: vendorInfo.paymentTerms || '-',
        balances: [
          {
            label: "Opening Balance (01-Apr-2025)",
            amount: `₹${openingBalanceVal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
            type: `${balances.openingBalanceType || 'CR'} Balance`,
          },
          {
            label: "Current Outstanding",
            amount: `₹${currentOutstandingVal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
            type: `${balances.currentOutstandingType || footerResults.closingBalanceType || 'CR'} Balance`,
          }
        ],
        summary: {
          totalInvoices: `₹${totalInvoicesVal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
          totalPayments: `₹${totalPaymentsVal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
          pendingInvoices: pendingInvoices,
          transactionTypes: transactionTypes
        }
      }

    } catch (error) {
      console.error(`❌ Error fetching vendor details for ${accountCode}:`, error)
      throw error
    }
  }
}
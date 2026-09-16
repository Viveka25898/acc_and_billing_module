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
      
      if (!Array.isArray(entriesList) || entriesList.length === 0) {
        // Fallback to local storage if API returns empty array
        const localEntries = this.getLocalVendorLedgerEntries(accountCode)
        if (localEntries.length > 0) return localEntries
      }

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
      console.warn(`⚠️ API call failed for vendor entries (${accountCode}), using local storage fallback:`, error)
      return this.getLocalVendorLedgerEntries(accountCode)
    }
  }

  /**
   * Local storage fallback for vendor entries
   */
  static getLocalVendorLedgerEntries(accountCode) {
    try {
      const transactions = JSON.parse(localStorage.getItem('transactions') || '[]')
      const chartOfAccounts = JSON.parse(localStorage.getItem('chartOfAccounts') || '[]')
      
      const vendorAccount = chartOfAccounts.find(acc => acc.code === accountCode) || {}
      const cleanVendorName = (vendorAccount.name || accountCode)
        .replace('VENDOR - ', '')
        .replace('HK MATERIAL VENDOR - ', '')
        .replace('FIXED ASSET VENDOR - ', '')
        .replace('UNIFORM VENDOR - ', '')
        .replace('PREPAID VENDOR - ', '')

      // Filter transactions that involve this vendor
      const vendorTxns = transactions.filter(txn =>
        txn.entries?.some(entry =>
          entry.glCode === accountCode ||
          entry.vendorId === accountCode ||
          (entry.glName && cleanVendorName && entry.glName.toLowerCase().includes(cleanVendorName.toLowerCase())) ||
          (txn.vendorName && cleanVendorName && txn.vendorName.toLowerCase().includes(cleanVendorName.toLowerCase()))
        )
      )

      vendorTxns.sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0))

      let runningBalance = 0
      let balanceType = 'CR'

      return vendorTxns.map(txn => {
        const vendorEntry = txn.entries?.find(e => e.glCode === accountCode || e.glCode?.startsWith('L2005')) || {}
        const debit = vendorEntry.debit || 0
        const credit = vendorEntry.credit || 0

        runningBalance += credit - debit
        balanceType = runningBalance >= 0 ? 'CR' : 'DR'

        const entryType = credit > 0 && debit === 0 ? 'Invoice' : debit > 0 && credit === 0 ? 'Payment' : 'Journal'
        const expenseCategory = this.getExpenseCategory(txn.vendorType || txn.type, vendorEntry.glName || txn.narration)

        return {
          date: this.formatDate(txn.date),
          originalDate: txn.date,
          voucherNo: txn.voucherNo || txn.id || '-',
          entryType,
          debit: debit > 0 ? debit.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-',
          credit: credit > 0 ? credit.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-',
          balance: `${Math.abs(runningBalance).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${balanceType}`,
          balanceType,
          narration: vendorEntry.narration || txn.narration || '-',
          refNo: txn.invoiceNumber || txn.id || '-',
          counterparty: vendorEntry.glName || txn.narration || 'Expense Account',
          type: txn.vendorType || 'Sundry Creditor',
          approvedBy: txn.approvedBy || 'System',
          attachments: vendorEntry.attachments || '-',
          costCenter: vendorEntry.costCenter || txn.costCenter || 'Operations',
          customer: txn.customer || '-',
          site: txn.site || '-',
          state: txn.state || '-',
          expenseCategory,
          status: txn.status || 'Posted'
        }
      })
    } catch (e) {
      console.error('❌ Local vendor entries fallback failed:', e)
      return []
    }
  }

  /**
   * Get vendor metadata details and balances/statistics
   */
  static async getVendorAccountDetails(accountCode) {
    try {
      console.log(`🔍 Fetching metadata for vendor account: ${accountCode}`)

      let headerResults = null
      let footerResults = null

      try {
        const resHeader = await axiosInstance.get(`/account-master/ledger/vendor/${accountCode}/header`)
        headerResults = resHeader.data?.results || resHeader.data?.data || resHeader.data || {}
      } catch (err) {
        console.warn(`⚠️ Header API endpoint failed for ${accountCode}:`, err)
      }

      try {
        const resFooter = await axiosInstance.get(`/account-master/ledger/vendor/${accountCode}/footer`)
        footerResults = resFooter.data?.results || resFooter.data?.data || resFooter.data || {}
      } catch (err) {
        console.warn(`⚠️ Footer API endpoint failed for ${accountCode}:`, err)
      }

      // If header API call failed, attempt local storage fallback
      if (!headerResults || (typeof headerResults === 'object' && Object.keys(headerResults).length === 0)) {
        console.warn(`⚠️ No header results from API for vendor details (${accountCode}), using local storage fallback`)
        return this.getLocalVendorAccountDetails(accountCode)
      }

      const vendorInfo = headerResults.vendorInfo || headerResults || {}
      const balances = headerResults.balances || {}
      const headerSummary = headerResults.summary || {}
      const footerData = footerResults || {}

      // Clean up prefix text for UI display
      const rawName = vendorInfo.vendorName || vendorInfo.accountName || accountCode
      const cleanName = String(rawName)
        .replace('VENDOR - ', '')
        .replace('HK MATERIAL VENDOR - ', '')
        .replace('FIXED ASSET VENDOR - ', '')
        .replace('UNIFORM VENDOR - ', '')
        .replace('PREPAID VENDOR - ', '')

      const openingBalanceVal = parseFloat(balances.openingBalance || 0)
      const currentOutstandingVal = parseFloat(balances.currentOutstanding || footerData.closingBalance || 0)

      const totalInvoicesVal = parseFloat(headerSummary.totalInvoices || footerData.totalCredit || 0)
      const totalPaymentsVal = parseFloat(headerSummary.totalPayments || footerData.totalDebit || 0)
      
      const pendingInvoices = headerSummary.pendingInvoicesCount !== undefined
        ? `${headerSummary.pendingInvoicesCount} Invoices`
        : (headerSummary.pendingInvoices || '0 Invoices')

      const breakdown = footerData.transactionCategoryBreakdown || {}
      
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
        glAccountCode: vendorInfo.glAccountCode || vendorInfo.glCode || accountCode,
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
            type: `${balances.currentOutstandingType || footerData.closingBalanceType || 'CR'} Balance`,
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
      console.warn(`⚠️ API call failed for vendor details (${accountCode}), using local storage fallback:`, error)
      return this.getLocalVendorAccountDetails(accountCode)
    }
  }

  /**
   * Local storage fallback for vendor account metadata
   */
  static getLocalVendorAccountDetails(accountCode) {
    try {
      const chartOfAccounts = JSON.parse(localStorage.getItem('chartOfAccounts') || '[]')
      const ledgerBalances = JSON.parse(localStorage.getItem('ledgerBalances') || '{}')
      const vendorLedgers = JSON.parse(localStorage.getItem('vendorLedgers') || '{}')

      const account = chartOfAccounts.find(acc => acc.code === accountCode) || {}
      const storedLedger = vendorLedgers[accountCode] || {}

      const rawName = account.name || storedLedger.vendorName || accountCode
      const cleanName = rawName
        .replace('VENDOR - ', '')
        .replace('HK MATERIAL VENDOR - ', '')
        .replace('FIXED ASSET VENDOR - ', '')
        .replace('UNIFORM VENDOR - ', '')
        .replace('PREPAID VENDOR - ', '')

      const balanceObj = ledgerBalances[accountCode] || storedLedger.ledgerDetails || { balance: 0 }
      const currentOutstanding = Math.abs(typeof balanceObj.balance === 'number' ? balanceObj.balance : parseFloat(String(balanceObj.closingBalance || 0).replace(/[₹,]/g, '')) || 0)

      const entries = this.getLocalVendorLedgerEntries(accountCode)
      let totalInvoices = 0
      let totalPayments = 0
      let pendingCount = 0

      entries.forEach(e => {
        if (e.credit !== '-') {
          totalInvoices += parseFloat(e.credit.replace(/,/g, '')) || 0
          pendingCount++
        }
        if (e.debit !== '-') {
          totalPayments += parseFloat(e.debit.replace(/,/g, '')) || 0
        }
      })

      return {
        vendorCode: accountCode,
        vendorName: cleanName,
        glAccountCode: accountCode,
        accountName: rawName,
        gstin: account.gstin || storedLedger.gstin || '27AABCU9603R1ZM',
        pan: account.pan || storedLedger.pan || 'AABCU9603R',
        tdsSection: account.tdsSection || '194C',
        paymentTerms: account.paymentTerms || 'Net 30 Days',
        balances: [
          {
            label: "Opening Balance (01-Apr-2025)",
            amount: `₹0.00`,
            type: "Credit Balance",
          },
          {
            label: "Current Outstanding",
            amount: `₹${currentOutstanding.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
            type: "Credit Balance",
          }
        ],
        summary: {
          totalInvoices: `₹${totalInvoices.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
          totalPayments: `₹${totalPayments.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
          pendingInvoices: `${pendingCount} Invoices`,
          transactionTypes: {
            hkMaterial: totalInvoices,
            fixedAsset: 0,
            prepaidUniform: 0,
            rent: 0,
            payments: totalPayments,
            other: 0
          }
        }
      }
    } catch (e) {
      console.error('❌ Local vendor details fallback failed:', e)
      return {
        vendorCode: accountCode,
        vendorName: accountCode,
        glAccountCode: accountCode,
        accountName: accountCode,
        gstin: '-',
        pan: '-',
        tdsSection: '-',
        paymentTerms: 'Net 30 Days',
        balances: [
          { label: "Opening Balance", amount: "₹0.00", type: "Credit Balance" },
          { label: "Current Outstanding", amount: "₹0.00", type: "Credit Balance" }
        ],
        summary: {
          totalInvoices: "₹0.00",
          totalPayments: "₹0.00",
          pendingInvoices: "0 Invoices",
          transactionTypes: { hkMaterial: 0, fixedAsset: 0, prepaidUniform: 0, rent: 0, payments: 0, other: 0 }
        }
      }
    }
  }
}
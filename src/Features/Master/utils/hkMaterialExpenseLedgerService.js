/* eslint-disable no-unused-vars */
// utils/hkMaterialsExpenseLedgerService.js

import axiosInstance from '../../../api/axiosInstance'

export class HKMaterialsExpenseLedgerService {
  /**
   * Formats API Date string (YYYY-MM-DD) to UI display (DD-MMM-YYYY)
   */
  static formatDate(dateString) {
    try {
      if (!dateString) return '-'
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return dateString

      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      const day = String(date.getDate()).padStart(2, '0')
      const month = months[date.getMonth()]
      const year = date.getFullYear()
      return `${day}-${month}-${year}`
    } catch {
      return dateString
    }
  }

  /**
   * Safe date parsing helper for filtering
   */
  static parseDate(dateString) {
    try {
      if (!dateString) return null
      return new Date(dateString)
    } catch {
      return null
    }
  }

  /**
   * Fetches actual HK materials expense ledger from the backend APIs
   */
  static async getHKMaterialsExpenseLedger(filters = {}) {
    try {
      console.log(`📊 Fetching HK Materials Expense Ledger from APIs with filters:`, filters)

      // Prepare request parameters for the entries endpoint (omit empty parameters to avoid 422 validation errors)
      const params = {
        page: filters.page || 1,
        limit: filters.limit || 20,
      }
      if (filters.fromDate) params.fromDate = filters.fromDate
      if (filters.toDate) params.toDate = filters.toDate
      if (filters.entryType) params.entryType = filters.entryType
      if (filters.vendorName) {
        params.vendorName = filters.vendorName
        params.search = filters.vendorName
      }

      // Fetch header and entries in parallel
      const [headerRes, entriesRes] = await Promise.all([
        axiosInstance.get('/account-master/ledger/expense/hk-materials/header'),
        axiosInstance.get('/account-master/ledger/expense/hk-materials/entries', { params })
      ])

      const headerData = headerRes.data?.results || {}
      const entriesResults = entriesRes.data?.results || {}
      const rawEntries = entriesResults.entries || []
      const totalsData = entriesResults.totals || {}
      const paginationData = entriesResults.pagination || {}

      // Map entries to match the table rendering properties
      const entries = rawEntries.map((entry) => {
        const debit = entry.debit !== null && entry.debit !== undefined && entry.debit !== '-' ? parseFloat(entry.debit) : 0
        const credit = entry.credit !== null && entry.credit !== undefined && entry.credit !== '-' ? parseFloat(entry.credit) : 0

        const debitStr = debit > 0 ? debit.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-'
        const creditStr = credit > 0 ? credit.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-'

        // Balance formatting (the API returns it as "111864.41 DR")
        let balanceStr = entry.balance || '-'
        if (typeof balanceStr === 'number') {
          balanceStr = `${balanceStr.toLocaleString('en-IN', { minimumFractionDigits: 2 })} DR`
        }

        return {
          date: this.formatDate(entry.date),
          originalDate: entry.date,
          voucherNo: entry.voucherNo || '-',
          entryType: entry.entryType || 'Expense',
          particulars: entry.particulars || '-',
          voucherType: entry.voucherType || '-',
          debit: debitStr,
          credit: creditStr,
          balance: balanceStr,
          vendorName: entry.vendorName || '-',
          invoiceNumber: entry.invoiceNumber || '-',
          costCenter: entry.costCenter || '-',
          customer: entry.customer || '-',
          site: entry.site || '-',
          state: entry.state || '-'
        }
      })

      // Generate the vendor wise summary dynamically from the entries list
      const vendorSummary = this.getVendorWiseSummary(entries)

      // Normalize current balance formatting
      let currentBalanceStr = headerData.currentBalance || '0.00 DR'
      let balanceVal = parseFloat(currentBalanceStr.replace(/[^\d.]/g, '')) || 0
      let balanceType = currentBalanceStr.includes('CR') ? 'CR' : 'DR'

      const summary = headerData.summary || {}

      return {
        accountDetails: {
          accountCode: headerData.accountCode || 'X1001004001',
          accountName: headerData.accountName || 'HK materials',
          accountType: headerData.accountType || 'Expense Account',
          category: headerData.category || 'Direct Expenses',
          parentAccount: headerData.parentAccount || 'MATERIALS FOR PRODUCTION',
          currentBalance: currentBalanceStr,
          balanceAmount: balanceVal,
          balanceType: balanceType,
          summary: {
            totalExpenses: summary.totalExpenses || '₹0',
            totalReversals: summary.totalReversals || '₹0',
            netExpense: summary.netExpense || '₹0',
            transactionCount: summary.transactionCount || 0
          }
        },
        entries,
        vendorSummary,
        totals: {
          totalDebit: parseFloat(totalsData.totalDebit || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
          totalCredit: parseFloat(totalsData.totalCredit || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
          closingBalance: totalsData.closingBalance || '0.00 DR'
        },
        pagination: {
          page: paginationData.page || 1,
          limit: paginationData.limit || 20,
          totalItems: paginationData.totalItems || rawEntries.length,
          totalPages: paginationData.totalPages || 1,
          hasNextPage: paginationData.hasNextPage !== undefined ? paginationData.hasNextPage : false,
          hasPreviousPage: paginationData.hasPreviousPage !== undefined ? paginationData.hasPreviousPage : false
        }
      }
    } catch (e) {
      console.error('Error fetching HK Materials Expense Ledger:', e)
      throw e
    }
  }

  /**
   * Get vendor-wise expense summary from the entries
   */
  static getVendorWiseSummary(entries) {
    try {
      const vendorMap = new Map()

      entries.forEach(entry => {
        // Group by vendorName if present; if it is '-' (unmapped), group under 'Unmapped'
        const vendorName = entry.vendorName !== '-' ? entry.vendorName : 'Unmapped'
        const debitVal = entry.debit !== '-' ? parseFloat(entry.debit.replace(/,/g, '')) : 0

        if (debitVal <= 0) return

        if (!vendorMap.has(vendorName)) {
          vendorMap.set(vendorName, {
            vendorName: vendorName,
            totalExpense: 0,
            transactionCount: 0,
            invoices: []
          })
        }

        const vendor = vendorMap.get(vendorName)
        vendor.totalExpense += debitVal
        vendor.transactionCount++
        if (entry.invoiceNumber && entry.invoiceNumber !== '-') {
          vendor.invoices.push(entry.invoiceNumber)
        }
      })

      return Array.from(vendorMap.values())
        .sort((a, b) => b.totalExpense - a.totalExpense)
    } catch (error) {
      console.error('Error calculating vendor-wise summary:', error)
      return []
    }
  }
}
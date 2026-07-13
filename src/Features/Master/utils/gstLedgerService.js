/* eslint-disable no-unused-vars */
// utils/gstLedgerService.js

import axiosInstance from '../../../api/axiosInstance'

export class GSTLedgerService {
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
   * Fetches actual ledger data from the backend APIs for a selected GST Input GL code.
   */
  static async getLedgerFor(glCode, ledgerName) {
    try {
      console.log(`📊 Fetching GST Ledger for: ${ledgerName} (${glCode})`)

      // Fetch header, entries, and footer in parallel for performance optimization
      const [headerRes, entriesRes, footerRes] = await Promise.all([
        axiosInstance.get(`/account-master/ledger/gst-input/${glCode}/header`),
        axiosInstance.get(`/account-master/ledger/gst-input/${glCode}/entries`, { params: { page: 1, limit: 500 } }),
        axiosInstance.get(`/account-master/ledger/gst-input/${glCode}/footer`)
      ])

      const headerData = headerRes.data?.results || {}
      const rawEntries = entriesRes.data?.results?.entries || []
      const footerData = footerRes.data?.results || {}

      // Map entries to match the table rendering properties
      const entries = rawEntries.map((entry) => {
        const debit = entry.debit !== null && entry.debit !== undefined && entry.debit !== '-' ? parseFloat(entry.debit) : 0
        const credit = entry.credit !== null && entry.credit !== undefined && entry.credit !== '-' ? parseFloat(entry.credit) : 0

        const balanceVal = entry.balance !== null && entry.balance !== undefined && entry.balance !== '-' ? parseFloat(entry.balance) : 0
        const balanceStr = `₹${balanceVal.toLocaleString('en-IN', { minimumFractionDigits: 2 })} Dr`

        return {
          date: this.formatDate(entry.date),
          originalDate: entry.date,
          voucherNo: entry.voucherNo || '-',
          description: entry.description || ledgerName,
          debit,
          credit,
          balance: balanceStr,
          counterparty: entry.counterparty || '-',
          refNo: entry.refNo || entry.id || '-',
          costCenter: entry.costCenter || 'General',
          customer: entry.customer || '-',
          site: entry.site || '-',
          state: entry.state || '-',
          approvedBy: entry.approvedBy || '-',
          attachments: entry.attachmentBundleUrl ? 1 : 0,
          status: entry.status || 'Posted'
        }
      })

      const openingBalanceVal = parseFloat(headerData.openingBalance || 0)
      const openingBalanceStr = `₹${openingBalanceVal.toLocaleString('en-IN', { minimumFractionDigits: 2 })} (Dr)`

      return {
        ledgerName: headerData.ledgerName || ledgerName,
        ledgerCode: headerData.glCode || glCode,
        type: headerData.category || 'Asset',
        financialYear: headerData.financialYear || 'FY2024-25',
        period: 'Full Year',
        openingBalance: openingBalanceStr,
        totalDebit: parseFloat(footerData.totalDebit || 0),
        totalCredit: parseFloat(footerData.totalCredit || 0),
        closingTotalTaxAsset: parseFloat(footerData.closingTotalTaxAsset || 0),
        entries
      }
    } catch (e) {
      console.error('Error building GST ledger from API:', e)
      throw e
    }
  }
}




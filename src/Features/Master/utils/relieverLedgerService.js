/* eslint-disable no-unused-vars */
// services/RelieverLedgerService.js
import axiosInstance from '../../../api/axiosInstance'

/**
 * Reliever Ledger Service - Converts transactions to reliever ledger entries
 */
export class RelieverLedgerService {

  /**
   * Get all ledger entries for Reliever Wages account (X1001001003)
   */
  static getRelieverLedgerEntries() {
    try {
      const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
      const chartOfAccounts = JSON.parse(localStorage.getItem('chartOfAccounts')) || [];

      console.log(`📊 Generating reliever ledger for: X1001001003`);

      // Filter transactions that involve Reliever Wages account
      // Add safety check for entries array
      const relevantTransactions = transactions.filter(txn => {
        if (!txn.entries || !Array.isArray(txn.entries)) {
          console.warn(`⚠️ Transaction ${txn.id || 'unknown'} missing entries array`);
          return false;
        }
        return txn.entries.some(entry => entry.glCode === 'X1001001003');
      });

      console.log(`📋 Found ${relevantTransactions.length} relevant reliever transactions`);

      // Convert transactions to ledger entries
      const ledgerEntries = [];
      let runningBalance = 0;
      let balanceType = 'DR';

      relevantTransactions.forEach(txn => {
        const relieverEntry = txn.entries.find(entry => entry.glCode === 'X1001001003');
        const bankEntry = txn.entries.find(entry => entry.glCode !== 'X1001001003');

        if (relieverEntry) {
          const debit = relieverEntry.debit || 0;
          const credit = relieverEntry.credit || 0;

          // Calculate running balance
          runningBalance += debit - credit;
          balanceType = runningBalance >= 0 ? 'DR' : 'CR';

          // Get bank and reliever info
          const bankInfo = this.getBankInfo(bankEntry, chartOfAccounts);
          const relieverInfo = this.getRelieverInfo(relieverEntry);

          ledgerEntries.push({
            date: txn.date,
            voucherNo: txn.voucherNo,
            type: this.getEntryType(debit, credit),
            debit: debit,
            credit: credit,
            balance: Math.abs(runningBalance),
            balanceType: balanceType,
            narration: relieverEntry.narration,
            relieverName: relieverInfo.name,
            replacedEmployee: relieverInfo.replacedEmployee,
            site: relieverEntry.site || txn.site || 'General',
            costCenter: relieverEntry.costCenter || txn.costCenter || 'General',
            customer: txn.customer || txn.clientName || '-',
            state: txn.state || '-',
            city: txn.city || '-',
            branch: txn.branch || '-',
            days: relieverEntry.days || 1,
            ratePerDay: relieverEntry.ratePerDay || debit,
            approvedBy: txn.approvedBy,
            bankName: bankInfo.name,
            bankCode: bankInfo.code,
            transactionId: txn.id,
            hasAttachment: false
          });
        }
      });

      console.log(`✅ Generated ${ledgerEntries.length} reliever ledger entries`);
      return ledgerEntries;

    } catch (error) {
      console.error('❌ Error generating reliever ledger entries:', error);
      return [];
    }
  }

  /**
   * Get bank information for ledger display
   */
  static getBankInfo(bankEntry, chartOfAccounts) {
    if (!bankEntry) return { name: 'N/A', code: 'N/A' };

    const bank = chartOfAccounts.find(acc => acc.code === bankEntry.glCode);
    return {
      name: bank?.name || bankEntry.glName || 'Bank Account',
      code: bankEntry.glCode
    };
  }

  /**
   * Extract reliever information from transaction entry
   */
  static getRelieverInfo(relieverEntry) {
    // Parse reliever details from narration or use default
    const narration = relieverEntry.narration || '';

    // Extract reliever name from narration (format: "Reliever payment - [Name] - ...")
    let name = 'Unknown Reliever';
    let replacedEmployee = 'N/A';

    if (narration.includes('Reliever payment -')) {
      const parts = narration.split(' - ');
      if (parts.length >= 2) {
        name = parts[1]; // Second part should be the reliever name
      }
    }

    // Extract replaced employee if available in entry data
    if (relieverEntry.employeeName) {
      replacedEmployee = relieverEntry.employeeName;
    }

    return {
      name: name,
      replacedEmployee: replacedEmployee
    };
  }

  /**
   * Determine entry type based on debit/credit
   */
  static getEntryType(debit, credit) {
    if (debit > 0) return 'Payment';
    if (credit > 0) return 'Receipt';
    return 'Journal';
  }

  /**
   * Get Reliever Wages account details for header
   */
  static getRelieverAccountDetails() {
    try {
      const chartOfAccounts = JSON.parse(localStorage.getItem('chartOfAccounts')) || [];
      const ledgerBalances = JSON.parse(localStorage.getItem('ledgerBalances')) || {};

      // Try both codes: X100101003 and X1001001003
      let relieverAccount = chartOfAccounts.find(acc => acc.code === 'X100101003');

      if (!relieverAccount) {
        relieverAccount = chartOfAccounts.find(acc => acc.code === 'X1001001003');
      }

      if (!relieverAccount) {
        console.log('❌ Reliever Wages account not found in chart of accounts');
        return this.getDefaultRelieverDetails();
      }

      // Try to get balance using both possible codes
      const currentBalance = ledgerBalances['X100101003']?.balance ||
        ledgerBalances['X1001001003']?.balance ||
        0;
      const financialYear = this.getCurrentFinancialYear();
      const period = this.getCurrentFinancialPeriod();
      const openingBalanceDate = this.getOpeningBalanceDate();

      return {
        ledgerCode: relieverAccount.code,
        accountName: relieverAccount.name || 'RELIEVER WAGES',
        accountType: 'Expense Account (Profit & Loss)',
        description: 'Temporary Staff Replacement Payments',
        period: period,
        financialYear: financialYear,
        openingBalance: '₹0.00',
        openingBalanceDate: openingBalanceDate,
        totalSites: this.getTotalSites(),
        totalRelievers: this.getTotalRelievers(),
        totalTransactions: this.getTotalTransactions(),
        status: 'Active',
        currency: 'INR (₹)',
        costCenter: 'Operations - Staff Management',
        budgetAllocated: '₹200,000.00',
        budgetUtilized: this.calculateBudgetUtilization(currentBalance)
      };

    } catch (error) {
      console.error('Error getting reliever account details:', error);
      return this.getDefaultRelieverDetails();
    }
  }

  /**
   * Get current financial year (April to March)
   */
  static getCurrentFinancialYear() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // January is 0

    // Financial year runs from April to March
    // If current month is April (4) or later, FY is currentYear-nextYear
    // If current month is January-March (1-3), FY is previousYear-currentYear
    if (currentMonth >= 4) {
      return `${currentYear}-${(currentYear + 1).toString().slice(-2)}`;
    } else {
      return `${currentYear - 1}-${currentYear.toString().slice(-2)}`;
    }
  }

  /**
   * Get current financial period
   */
  static getCurrentFinancialPeriod() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    if (currentMonth >= 4) {
      return `Apr ${currentYear} - Mar ${currentYear + 1}`;
    } else {
      return `Apr ${currentYear - 1} - Mar ${currentYear}`;
    }
  }

  /**
   * Get opening balance date for current financial year
   */
  static getOpeningBalanceDate() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    // Opening balance is always April 1st of the financial year
    if (currentMonth >= 4) {
      return `01-Apr-${currentYear}`;
    } else {
      return `01-Apr-${currentYear - 1}`;
    }
  }

  /**
   * Get default details if account not found
   */
  static getDefaultRelieverDetails() {
    const financialYear = this.getCurrentFinancialYear();
    const period = this.getCurrentFinancialPeriod();
    const openingBalanceDate = this.getOpeningBalanceDate();

    return {
      ledgerCode: 'X1001001003',
      accountName: 'RELIEVER WAGES',
      accountType: 'Expense Account (Profit & Loss)',
      description: 'Temporary Staff Replacement Payments',
      period: period,
      financialYear: financialYear,
      openingBalance: '₹0.00',
      openingBalanceDate: openingBalanceDate,
      totalSites: 8,
      totalRelievers: 15,
      totalTransactions: 20,
      status: 'Active',
      currency: 'INR (₹)',
      costCenter: 'Operations - Staff Management',
      budgetAllocated: '₹200,000.00',
      budgetUtilized: '62.5%'
    };
  }

  /**
   * Calculate total unique sites from transactions
   */
  static getTotalSites() {
    try {
      const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
      const relieverTransactions = transactions.filter(txn => {
        if (!txn.entries || !Array.isArray(txn.entries)) return false;
        return txn.entries.some(entry => entry.glCode === 'X1001001003');
      });

      const sites = new Set();
      relieverTransactions.forEach(txn => {
        const relieverEntry = txn.entries.find(entry => entry.glCode === 'X1001001003');
        if (relieverEntry?.site) {
          sites.add(relieverEntry.site);
        }
      });

      return sites.size > 0 ? sites.size : 8;
    } catch (error) {
      return 8;
    }
  }

  /**
   * Calculate total unique relievers from transactions
   */
  static getTotalRelievers() {
    try {
      const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
      const relieverTransactions = transactions.filter(txn => {
        if (!txn.entries || !Array.isArray(txn.entries)) return false;
        return txn.entries.some(entry => entry.glCode === 'X1001001003');
      });

      const relievers = new Set();
      relieverTransactions.forEach(txn => {
        const relieverEntry = txn.entries.find(entry => entry.glCode === 'X1001001003');
        if (relieverEntry?.employeeId) {
          relievers.add(relieverEntry.employeeId);
        }
      });

      return relievers.size > 0 ? relievers.size : 15;
    } catch (error) {
      return 15;
    }
  }

  /**
   * Get total number of reliever transactions
   */
  static getTotalTransactions() {
    try {
      const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
      const relieverTransactions = transactions.filter(txn => {
        if (!txn.entries || !Array.isArray(txn.entries)) return false;
        return txn.entries.some(entry => entry.glCode === 'X1001001003');
      });

      return relieverTransactions.length > 0 ? relieverTransactions.length : 20;
    } catch (error) {
      return 20;
    }
  }

  /**
   * Calculate budget utilization percentage
   */
  static calculateBudgetUtilization(currentBalance) {
    const budget = 200000; // ₹200,000
    const utilized = Math.abs(currentBalance); // Expense is negative balance
    const percentage = (utilized / budget) * 100;
    return `${percentage.toFixed(1)}%`;
  }

  /**
   * Filter ledger entries by date range
   */
  static filterByDateRange(entries, fromDate, toDate) {
    if (!fromDate && !toDate) return entries;

    return entries.filter(entry => {
      const entryDate = new Date(entry.date);
      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : null;

      if (from && entryDate < from) return false;
      if (to && entryDate > to) return false;

      return true;
    });
  }

  /**
   * Filter by entry type
   */
  static filterByEntryType(entries, entryType) {
    if (!entryType || entryType === 'All') return entries;
    return entries.filter(entry => entry.type === entryType);
  }

  /**
   * Filter by site
   */
  static filterBySite(entries, site) {
    if (!site || site === 'All') return entries;
    return entries.filter(entry => entry.site === site);
  }

  /**
   * Filter by reliever name
   */
  static filterByReliever(entries, reliever) {
    if (!reliever || reliever === 'All') return entries;
    return entries.filter(entry => entry.relieverName === reliever);
  }

  /**
   * Search entries by text
   */
  static searchEntries(entries, searchText) {
    if (!searchText.trim()) return entries;

    const searchLower = searchText.toLowerCase();
    return entries.filter(entry =>
      entry.relieverName?.toLowerCase().includes(searchLower) ||
      entry.narration?.toLowerCase().includes(searchLower) ||
      entry.voucherNo?.toLowerCase().includes(searchLower) ||
      entry.site?.toLowerCase().includes(searchLower) ||
      entry.replacedEmployee?.toLowerCase().includes(searchLower)
    );
  }

  /**
   * Get summary data for footer
   */
  static getSummaryData(entries) {
    const totalDebit = entries.reduce((sum, entry) => sum + (entry.debit || 0), 0);
    const totalCredit = entries.reduce((sum, entry) => sum + (entry.credit || 0), 0);

    // For expense account, closing balance is total debit minus total credit
    const closingBalance = totalDebit - totalCredit;

    return {
      openingBalance: 0, // Reliever wages starts from 0 each period
      totalDebit: totalDebit,
      totalCredit: totalCredit,
      closingBalance: closingBalance
    };
  }

  /**
   * Get all ledger entries for Reliever Liability account (L2001002)
   */
  static getRelieverLiabilityLedgerEntries() {
    try {
      const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
      const chartOfAccounts = JSON.parse(localStorage.getItem('chartOfAccounts')) || [];

      console.log(`📊 Generating reliever liability ledger for: L2001002`);

      const relevantTransactions = transactions.filter(txn => {
        if (!txn.entries || !Array.isArray(txn.entries)) return false;
        return txn.entries.some(entry => entry.glCode === 'L2001002');
      });

      console.log(`📋 Found ${relevantTransactions.length} relevant reliever liability transactions`);

      const ledgerEntries = [];
      let runningBalance = 0;
      let balanceType = 'CR'; // Liabilities have credit balance normally

      relevantTransactions.forEach(txn => {
        const liabilityEntry = txn.entries.find(entry => entry.glCode === 'L2001002');
        const offsetEntry = txn.entries.find(entry => entry.glCode !== 'L2001002');

        if (liabilityEntry) {
          const debit = liabilityEntry.debit || 0;
          const credit = liabilityEntry.credit || 0;

          // Running balance formula for Liabilities: Credit increases, Debit decreases
          runningBalance += credit - debit;
          balanceType = runningBalance >= 0 ? 'CR' : 'DR';

          const offsetInfo = this.getBankInfo(offsetEntry, chartOfAccounts);
          const relieverInfo = this.getRelieverInfo(liabilityEntry);

          ledgerEntries.push({
            date: txn.date,
            voucherNo: txn.voucherNo,
            type: this.getEntryType(debit, credit),
            debit: debit,
            credit: credit,
            balance: Math.abs(runningBalance),
            balanceType: balanceType,
            narration: liabilityEntry.narration,
            relieverName: relieverInfo.name || '-',
            replacedEmployee: relieverInfo.replacedEmployee || '-',
            site: liabilityEntry.site || txn.site || 'General',
            costCenter: liabilityEntry.costCenter || txn.costCenter || 'General',
            customer: txn.customer || txn.clientName || '-',
            state: txn.state || '-',
            city: txn.city || '-',
            branch: txn.branch || '-',
            days: liabilityEntry.days || 1,
            ratePerDay: liabilityEntry.ratePerDay || (credit > 0 ? credit : debit),
            approvedBy: txn.approvedBy || '-',
            bankName: offsetInfo.name,
            bankCode: offsetInfo.code,
            transactionId: txn.id,
            hasAttachment: false
          });
        }
      });

      console.log(`✅ Generated ${ledgerEntries.length} reliever liability ledger entries`);
      return ledgerEntries;
    } catch (error) {
      console.error('❌ Error generating reliever liability ledger entries:', error);
      return [];
    }
  }

  /**
   * Get Reliever Liability account details for header
   */
  static getRelieverLiabilityAccountDetails() {
    try {
      const chartOfAccounts = JSON.parse(localStorage.getItem('chartOfAccounts')) || [];
      const ledgerBalances = JSON.parse(localStorage.getItem('ledgerBalances')) || {};

      let relieverAccount = chartOfAccounts.find(acc => acc.code === 'L2001002');

      if (!relieverAccount) {
        console.log('❌ Reliever Liability account not found in chart of accounts');
        return this.getDefaultRelieverLiabilityDetails();
      }

      const currentBalance = ledgerBalances['L2001002']?.balance || 0;
      const financialYear = this.getCurrentFinancialYear();
      const period = this.getCurrentFinancialPeriod();
      const openingBalanceDate = this.getOpeningBalanceDate();

      return {
        ledgerCode: relieverAccount.code,
        accountName: relieverAccount.name || 'EMPLOYEE RELIEVER ACCOUNT',
        accountType: 'Liability Account (Balance Sheet)',
        description: 'Liability Created for Reliever Wages',
        period: period,
        financialYear: financialYear,
        openingBalance: '₹0.00',
        openingBalanceDate: openingBalanceDate,
        totalSites: this.getTotalSitesForLiability(),
        totalRelievers: this.getTotalRelieversForLiability(),
        totalTransactions: this.getTotalTransactionsForLiability(),
        status: 'Active',
        currency: 'INR (₹)',
        costCenter: 'Operations - Staff Management',
        budgetAllocated: 'N/A',
        budgetUtilized: 'N/A'
      };
    } catch (error) {
      console.error('Error getting reliever liability account details:', error);
      return this.getDefaultRelieverLiabilityDetails();
    }
  }

  static getTotalSitesForLiability() {
    try {
      const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
      const relieverTransactions = transactions.filter(txn => {
        if (!txn.entries || !Array.isArray(txn.entries)) return false;
        return txn.entries.some(entry => entry.glCode === 'L2001002');
      });

      const sites = new Set();
      relieverTransactions.forEach(txn => {
        const relieverEntry = txn.entries.find(entry => entry.glCode === 'L2001002');
        if (relieverEntry?.site) {
          sites.add(relieverEntry.site);
        }
      });

      return sites.size > 0 ? sites.size : 8;
    } catch (error) {
      return 8;
    }
  }

  static getTotalRelieversForLiability() {
    try {
      const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
      const relieverTransactions = transactions.filter(txn => {
        if (!txn.entries || !Array.isArray(txn.entries)) return false;
        return txn.entries.some(entry => entry.glCode === 'L2001002');
      });

      const relievers = new Set();
      relieverTransactions.forEach(txn => {
        const relieverEntry = txn.entries.find(entry => entry.glCode === 'L2001002');
        if (relieverEntry?.employeeId) {
          relievers.add(relieverEntry.employeeId);
        }
      });

      return relievers.size > 0 ? relievers.size : 15;
    } catch (error) {
      return 15;
    }
  }

  static getTotalTransactionsForLiability() {
    try {
      const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
      const relieverTransactions = transactions.filter(txn => {
        if (!txn.entries || !Array.isArray(txn.entries)) return false;
        return txn.entries.some(entry => entry.glCode === 'L2001002');
      });

      return relieverTransactions.length > 0 ? relieverTransactions.length : 20;
    } catch (error) {
      return 20;
    }
  }

  static getDefaultRelieverLiabilityDetails() {
    const financialYear = this.getCurrentFinancialYear();
    const period = this.getCurrentFinancialPeriod();
    const openingBalanceDate = this.getOpeningBalanceDate();

    return {
      ledgerCode: 'L2001002',
      accountName: 'EMPLOYEE RELIEVER ACCOUNT',
      accountType: 'Liability Account (Balance Sheet)',
      description: 'Liability Created for Reliever Wages',
      period: period,
      financialYear: financialYear,
      openingBalance: '₹0.00',
      openingBalanceDate: openingBalanceDate,
      totalSites: 8,
      totalRelievers: 15,
      totalTransactions: 20,
      status: 'Active',
      currency: 'INR (₹)',
      costCenter: 'Operations - Staff Management',
      budgetAllocated: 'N/A',
      budgetUtilized: 'N/A'
    };
  }

  static getLiabilitySummaryData(entries) {
    const totalDebit = entries.reduce((sum, entry) => sum + (entry.debit || 0), 0);
    const totalCredit = entries.reduce((sum, entry) => sum + (entry.credit || 0), 0);
    const closingBalance = totalCredit - totalDebit;

    return {
      openingBalance: 0,
      totalDebit: totalDebit,
      totalCredit: totalCredit,
      closingBalance: closingBalance
    };
  }

  /**
   * Get employee reliever liability header from API
   * Endpoint: GET /account-master/ledger/employee-reliever/{relieverGl}/header
   */
  static async getLiabilityHeaderApi(relieverGl) {
    try {
      const res = await axiosInstance.get(`/account-master/ledger/employee-reliever/${relieverGl}/header`)
      return res.data?.results || res.data || null
    } catch (error) {
      console.error(`❌ Error in getLiabilityHeaderApi for ${relieverGl}:`, error)
      throw error
    }
  }

  /**
   * Get paginated and filtered transactions for employee reliever liability ledger
   * Endpoint: GET /account-master/ledger/employee-reliever/{relieverGl}/entries
   */
  static async getLiabilityEntriesApi(relieverGl, params = {}) {
    try {
      const res = await axiosInstance.get(`/account-master/ledger/employee-reliever/${relieverGl}/entries`, { params })
      return res.data?.results || res.data || { entries: [], pagination: {} }
    } catch (error) {
      console.error(`❌ Error in getLiabilityEntriesApi for ${relieverGl}:`, error)
      throw error
    }
  }

  /**
   * Get employee reliever liability footer summary from API
   * Endpoint: GET /account-master/ledger/employee-reliever/{relieverGl}/footer
   */
  static async getLiabilityFooterApi(relieverGl, params = {}) {
    try {
      const res = await axiosInstance.get(`/account-master/ledger/employee-reliever/${relieverGl}/footer`, { params })
      return res.data?.results || res.data || null
    } catch (error) {
      console.error(`❌ Error in getLiabilityFooterApi for ${relieverGl}:`, error)
      throw error
    }
  }

  /**
   * Get reliever expense ledger header from API (GL: X2002002001)
   * Endpoints: GET /account-master/ledger/expense/reliever/header or /ledger/expense/reliever/header
   */
  static async getExpenseHeaderApi(glCode = 'X2002002001') {
    const endpoints = [
      `/account-master/ledger/expense/reliever/header`,
      `/ledger/expense/reliever/header`,
      `/account-master/ledger/expense/reliever/${glCode}/header`,
    ]

    let lastError = null
    for (const endpoint of endpoints) {
      try {
        const res = await axiosInstance.get(endpoint)
        return res.data?.results || res.data?.data || res.data || null
      } catch (err) {
        lastError = err
        if (err.response && err.response.status === 404) continue
        throw err
      }
    }
    throw lastError
  }

  /**
   * Get paginated & filtered reliever expense entries from API (GL: X2002002001)
   * Endpoints: GET /account-master/ledger/expense/reliever/entries or /ledger/expense/reliever/entries
   */
  static async getExpenseEntriesApi(glCode = 'X2002002001', params = {}) {
    const cleanParams = {}
    if (params.page) cleanParams.page = params.page
    if (params.limit) cleanParams.limit = params.limit
    if (params.fromDate && params.fromDate.trim()) cleanParams.fromDate = params.fromDate.trim()
    if (params.toDate && params.toDate.trim()) cleanParams.toDate = params.toDate.trim()
    if (params.entryType && params.entryType !== 'All') cleanParams.entryType = params.entryType
    if (params.status && params.status !== 'All') cleanParams.status = params.status
    if (params.site && params.site !== 'All') cleanParams.site = params.site
    if (params.reliever && params.reliever !== 'All') cleanParams.reliever = params.reliever
    if (params.searchText && params.searchText.trim()) cleanParams.search = params.searchText.trim()

    const endpoints = [
      `/account-master/ledger/expense/reliever/entries`,
      `/ledger/expense/reliever/entries`,
      `/account-master/ledger/expense/reliever/${glCode}/entries`,
    ]

    let lastError = null
    for (const endpoint of endpoints) {
      try {
        const res = await axiosInstance.get(endpoint, { params: cleanParams })
        return res.data?.results || res.data?.data || res.data || { entries: [], pagination: {} }
      } catch (err) {
        lastError = err
        if (err.response && err.response.status === 404) continue
        throw err
      }
    }
    throw lastError
  }

  /**
   * Get reliever expense ledger footer summary from API (GL: X2002002001)
   * Endpoints: GET /account-master/ledger/expense/reliever/footer or /ledger/expense/reliever/footer
   */
  static async getExpenseFooterApi(glCode = 'X2002002001', params = {}) {
    const cleanParams = {}
    if (params.fromDate && params.fromDate.trim()) cleanParams.fromDate = params.fromDate.trim()
    if (params.toDate && params.toDate.trim()) cleanParams.toDate = params.toDate.trim()

    const endpoints = [
      `/account-master/ledger/expense/reliever/footer`,
      `/ledger/expense/reliever/footer`,
      `/account-master/ledger/expense/reliever/${glCode}/footer`,
    ]

    let lastError = null
    for (const endpoint of endpoints) {
      try {
        const res = await axiosInstance.get(endpoint, { params: cleanParams })
        return res.data?.results || res.data?.data || res.data || null
      } catch (err) {
        lastError = err
        if (err.response && err.response.status === 404) continue
        throw err
      }
    }
    throw lastError
  }
}
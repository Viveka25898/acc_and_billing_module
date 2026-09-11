/* eslint-disable no-unused-vars */
import axiosInstance from '../../../api/axiosInstance';

/**
 * Helper to GET request with endpoint fallback routes
 */
const getWithFallback = async (endpoints, config = {}) => {
  let lastError = null;
  for (const endpoint of endpoints) {
    try {
      const response = await axiosInstance.get(endpoint, config);
      if (response && (response.status === 200 || response.status === 201)) {
        return response;
      }
    } catch (err) {
      lastError = err;
      if (err.response && err.response.status === 404) {
        continue;
      }
      throw err;
    }
  }
  throw lastError;
};

export class RentLedgerService {
  /**
   * Formats ISO or YYYY-MM-DD date string to UI display (DD-MMM-YYYY)
   */
  static formatDate(dateString) {
    try {
      if (!dateString || dateString === '-') return '-';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;

      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const day = String(date.getDate()).padStart(2, '0');
      const month = months[date.getMonth()];
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    } catch {
      return dateString || '-';
    }
  }

  /**
   * Safely formats currency numbers to Indian Rupees string
   */
  static formatCurrency(value, defaultSymbol = '₹') {
    if (value === null || value === undefined || value === '' || value === '-') return '-';
    const num = typeof value === 'number' ? value : parseFloat(String(value).replace(/[^\d.-]/g, ''));
    if (isNaN(num)) return String(value);
    return `${defaultSymbol}${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  /**
   * Fetches Rent Expense Ledger Header, Entries, and Footer from backend APIs
   * 
   * @param {string} glCode Default GL Code (X2001002002)
   * @param {Object} filters Query parameters (page, limit, fromDate, toDate, entryType, status)
   * @returns {Promise<Object>} { headerInfo, entries, footerInfo, pagination }
   */
  static async getRentExpenseLedger(glCode = 'X2001002002', filters = {}) {
    try {
      const activeGlCode = glCode || 'X2001002002';
      const queryParams = {
        page: filters.page || 1,
      };
      if (filters.limit) queryParams.limit = filters.limit;


      if (filters.fromDate) queryParams.fromDate = filters.fromDate;
      if (filters.toDate) queryParams.toDate = filters.toDate;

      // Endpoint fallback options
      const headerEndpoints = [
        `/ledger/expense/internal/${activeGlCode}/header`,
        `/accounts/ledger/expense/internal/${activeGlCode}/header`,
        `/account-master/ledger/expense/internal/${activeGlCode}/header`,
      ];

      const entriesEndpoints = [
        `/ledger/expense/internal/${activeGlCode}/entries`,
        `/accounts/ledger/expense/internal/${activeGlCode}/entries`,
        `/account-master/ledger/expense/internal/${activeGlCode}/entries`,
      ];

      const footerEndpoints = [
        `/ledger/expense/internal/${activeGlCode}/footer`,
        `/accounts/ledger/expense/internal/${activeGlCode}/footer`,
        `/account-master/ledger/expense/internal/${activeGlCode}/footer`,
      ];

      // Execute parallel API requests
      const [headerRes, entriesRes, footerRes] = await Promise.all([
        getWithFallback(headerEndpoints),
        getWithFallback(entriesEndpoints, { params: queryParams }),
        getWithFallback(footerEndpoints),
      ]);

      const headerResults = headerRes.data?.results || headerRes.data?.data || {};
      const entriesResults = entriesRes.data?.results || entriesRes.data?.data || {};
      const footerResults = footerRes.data?.results || footerRes.data?.data || {};

      const rawEntries = entriesResults.entries || (Array.isArray(entriesResults) ? entriesResults : []);
      const paginationData = entriesResults.pagination || {};

      // Transform raw entries to structured UI row format with '-' fallbacks
      const entries = rawEntries.map((item, idx) => {
        const debitNum = item.debit !== null && item.debit !== undefined && item.debit !== '-' ? parseFloat(item.debit) : 0;
        const creditNum = item.credit !== null && item.credit !== undefined && item.credit !== '-' ? parseFloat(item.credit) : 0;

        let balanceStr = item.balance || '-';
        if (typeof balanceStr === 'number') {
          balanceStr = `${balanceStr.toLocaleString('en-IN', { minimumFractionDigits: 2 })} ${item.balanceType || 'DR'}`;
        } else if (balanceStr !== '-' && !balanceStr.includes('DR') && !balanceStr.includes('CR')) {
          balanceStr = `${balanceStr} ${item.balanceType || 'DR'}`;
        }

        const vendorName = item.vendor?.name || (typeof item.vendor === 'string' ? item.vendor : null) || item.counterparty || '-';

        return {
          id: item.id || `row-${idx}`,
          rawDate: item.date,
          date: this.formatDate(item.date),
          voucherNo: item.voucherNo || '-',
          voucherLink: item.voucherLink || null,
          entryType: item.entryType || 'Expense',
          debit: debitNum,
          debitStr: debitNum > 0 ? debitNum.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-',
          credit: creditNum,
          creditStr: creditNum > 0 ? creditNum.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-',
          balance: balanceStr,
          balanceType: item.balanceType || 'DR',
          narration: item.narration || '-',
          refNo: item.claimId || item.refNo || '-',
          counterparty: vendorName,
          vendorName: vendorName,
          approvedBy: item.approvedBy || '-',
          costCenter: item.costCenter || 'All',
          customer: item.customer || '-',
          site: item.site || '-',
          state: item.state || '-',
          status: item.status || 'Posted',
          rowType: item.rowType || 'normal',
          period: item.period || '-',
          attachmentBundleUrl: item.attachmentBundleUrl || null,
        };
      });

      // Construct Header object
      const headerInfo = {
        glAccount: headerResults.glCode || activeGlCode,
        accountCode: headerResults.glCode || activeGlCode,
        ledgerName: headerResults.ledgerName || 'BRANCH OFFICE RENT',
        description: headerResults.ledgerName || 'BRANCH OFFICE RENT',
        parentAccount: headerResults.parentAccount || 'OTHER BRANCH EXPENSES',
        parentCode: headerResults.parentCode || 'X2001002',
        accountCategory: headerResults.accountCategory || 'EXPENSE',
        accountType: headerResults.accountType || 'Operating Expense',
        debitCreditNature: headerResults.debitCreditNature || 'DEBIT',
        financialYear: headerResults.financialYear || 'FY2024-25',
        period: headerResults.period || '01-Apr-2024 to 31-Mar-2025',
        costCenter: headerResults.costCenter || 'All Cost Centers',
        department: headerResults.department || 'Operations & Property Management',
        company: 'iSmart',
        openingBalance: headerResults.openingBalance || '0.00',
        openingBalanceType: headerResults.openingBalanceType || 'Debit Balance',
        periodExpenses: headerResults.periodExpenses || '0.00',
        closingBalance: headerResults.closingBalance || '0.00',
        stats: headerResults.stats || {
          totalTransactions: entries.length,
          settlements: 0,
          avgPerTransaction: '₹0.00',
          sitesUtilized: 0,
        },
      };

      // Construct Footer object
      const footerInfo = {
        totalDebit: parseFloat(footerResults.totalDebit || 0),
        totalCredit: parseFloat(footerResults.totalCredit || 0),
        netExpenseAmount: parseFloat(footerResults.netExpenseAmount || 0),
        closingBalance: footerResults.closingBalance || '0.00 DR',
        totalVouchersProcessed: footerResults.totalVouchersProcessed || entries.length,
        totalReversals: footerResults.totalReversals || 0,
      };

      const pagination = {
        page: paginationData.page || 1,
        limit: paginationData.limit || 50,
        totalItems: paginationData.totalItems || entries.length,
        totalPages: paginationData.totalPages || 1,
        hasNextPage: Boolean(paginationData.hasNextPage),
        hasPreviousPage: Boolean(paginationData.hasPreviousPage),
      };

      return {
        headerInfo,
        entries,
        footerInfo,
        pagination,
      };
    } catch (error) {
      console.error('❌ Error fetching Rent Expense Ledger from APIs:', error);
      throw error;
    }
  }

  // Deprecated legacy helpers kept safely without localStorage
  static getBranchRentAccountDetails() {
    return {
      accountCode: 'X2001002002',
      accountName: 'BRANCH OFFICE RENT',
      description: 'Rent Expenses for All Branch Offices',
      financialYear: 'FY2024-25',
      period: '01-Apr-2024 to 31-Mar-2025',
      openingBalance: { amount: 0, date: '2024-04-01', type: 'DR' },
    };
  }

  static getBranchRentLedgerEntries() {
    return [];
  }

  static getVendorAccountDetails() {
    return null;
  }

  static getVendorLedgerEntries() {
    return [];
  }
}
/**
 * salaryJVService.js
 * Service for fetching Salary Journal Vouchers list (API 3) and Detailed Voucher (API 2).
 * Currently powered by in-memory dummy data with simulated async delay.
 * Ready for drop-in backend API swap.
 */

import {
  MOCK_SALARY_VOUCHERS_LIST,
  MOCK_DETAILED_JVS,
} from "../data/salaryJVDummyData";

// Set to true when backend API endpoints are deployed
const USE_REAL_API = false;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/legacy/api/v1";

export const salaryJVService = {
  /**
   * API 3: Get All Posted Salary JVs (AE & AM Audit Dashboard)
   * GET /api/v1/salary/journal-vouchers
   */
  async fetchJournalVouchers({
    branch = "",
    siteId = "",
    period = "",
    fromDate = "",
    toDate = "",
    page = 1,
    limit = 10,
  } = {}) {
    if (USE_REAL_API) {
      // Future Axios call:
      // const params = new URLSearchParams();
      // if (branch) params.append('branch', branch);
      // if (siteId) params.append('siteId', siteId);
      // if (period) params.append('period', period);
      // if (fromDate) params.append('fromDate', fromDate);
      // if (toDate) params.append('toDate', toDate);
      // params.append('page', page);
      // params.append('limit', limit);
      // const res = await axios.get(`${API_BASE_URL}/salary/journal-vouchers?${params.toString()}`);
      // return res.data;
    }

    // Simulated network delay (300ms)
    await new Promise((resolve) => setTimeout(resolve, 300));

    try {
      let filtered = [...MOCK_SALARY_VOUCHERS_LIST];

      // Branch filter
      if (branch && branch !== "All" && branch !== "ALL") {
        filtered = filtered.filter(
          (v) => v.branchName.toLowerCase() === branch.toLowerCase()
        );
      }

      // Site filter (ID or Name match)
      if (siteId && siteId.trim()) {
        const query = siteId.trim().toLowerCase();
        filtered = filtered.filter(
          (v) =>
            v.siteId.toLowerCase().includes(query) ||
            v.siteName.toLowerCase().includes(query)
        );
      }

      // Period filter (MM-YYYY)
      if (period && period.trim()) {
        filtered = filtered.filter((v) =>
          v.payrollPeriod.toLowerCase().includes(period.trim().toLowerCase())
        );
      }

      // Date range filter
      if (fromDate) {
        filtered = filtered.filter((v) => new Date(v.voucherDate) >= new Date(fromDate));
      }
      if (toDate) {
        filtered = filtered.filter((v) => new Date(v.voucherDate) <= new Date(toDate));
      }

      const totalRecords = filtered.length;
      const parsedLimit = Math.min(Math.max(Number(limit) || 10, 1), 100);
      const totalPages = Math.ceil(totalRecords / parsedLimit) || 1;
      const currentPage = Math.min(Math.max(Number(page) || 1, 1), totalPages);

      const startIndex = (currentPage - 1) * parsedLimit;
      const paginatedVouchers = filtered.slice(startIndex, startIndex + parsedLimit);

      const totalAmountSum = filtered.reduce(
        (sum, v) => sum + (parseFloat(v.totalAmount) || 0),
        0
      );

      const uniqueSitesCount = new Set(filtered.map((v) => v.siteId)).size;
      const uniqueBranchesCount = new Set(filtered.map((v) => v.branchName)).size;

      // Determine Financial Year based on filtered vouchers or current FY
      const financialYear = "FY 2026-27";

      return {
        success: true,
        data: {
          vouchers: paginatedVouchers,
          pagination: {
            currentPage,
            totalPages,
            totalRecords,
            limit: parsedLimit,
          },
          summary: {
            totalVouchers: totalRecords,
            totalAmount: totalAmountSum.toFixed(2),
            financialYear: financialYear,
            totalSites: uniqueSitesCount,
            totalBranches: uniqueBranchesCount,
          },
        },
      };
    } catch (error) {
      console.error("Error fetching salary journal vouchers:", error);
      return {
        success: false,
        message: error.message || "Failed to load salary journal vouchers",
        data: {
          vouchers: [],
          pagination: { currentPage: 1, totalPages: 1, totalRecords: 0, limit },
          summary: {
            totalVouchers: 0,
            totalAmount: "0.00",
            financialYear: "FY 2026-27",
            totalSites: 0,
            totalBranches: 0,
          },
        },
      };
    }
  },

  /**
   * API: Get Salary JV Summary Metrics
   * GET /api/v1/salary/journal-vouchers/summary
   */
  async fetchSummaryMetrics({ branch = "", period = "", financialYear = "2026-27" } = {}) {
    if (USE_REAL_API) {
      // Future Axios call:
      // const res = await axios.get(`${API_BASE_URL}/salary/journal-vouchers/summary`, { params: { branch, period, financialYear } });
      // return res.data;
    }

    await new Promise((resolve) => setTimeout(resolve, 200));

    let filtered = [...MOCK_SALARY_VOUCHERS_LIST];
    if (branch && branch !== "All" && branch !== "ALL") {
      filtered = filtered.filter((v) => v.branchName.toLowerCase() === branch.toLowerCase());
    }
    if (period && period.trim()) {
      filtered = filtered.filter((v) => v.payrollPeriod.includes(period.trim()));
    }

    const totalAmountSum = filtered.reduce(
      (sum, v) => sum + (parseFloat(v.totalAmount) || 0),
      0
    );

    return {
      success: true,
      data: {
        financialYear: `FY ${financialYear}`,
        totalVouchers: filtered.length,
        totalAmount: totalAmountSum.toFixed(2),
        totalSites: new Set(filtered.map((v) => v.siteId)).size,
        totalBranches: new Set(filtered.map((v) => v.branchName)).size,
      },
    };
  },

  /**
   * API 2: Get Detailed Journal Voucher by Voucher Number
   * GET /api/v1/salary/journal-vouchers/:voucherNo
   */
  async fetchJournalVoucherDetails(voucherNo) {
    if (USE_REAL_API) {
      // Future Axios call:
      // const res = await axios.get(`${API_BASE_URL}/salary/journal-vouchers/${encodeURIComponent(voucherNo)}`);
      // return res.data;
    }

    // Simulated network delay (350ms)
    await new Promise((resolve) => setTimeout(resolve, 350));

    try {
      const detailed = MOCK_DETAILED_JVS[voucherNo];
      if (detailed) {
        return {
          success: true,
          data: detailed,
        };
      }

      // Fallback generator if voucherNo is from list but not explicitly in detail map
      const foundInList = MOCK_SALARY_VOUCHERS_LIST.find((v) => v.voucherNo === voucherNo);
      if (foundInList) {
        const amountNum = parseFloat(foundInList.totalAmount) || 500000;
        const basicAmt = (amountNum * 0.6).toFixed(2);
        const daAmt = (amountNum * 0.25).toFixed(2);
        const hraAmt = (amountNum * 0.15).toFixed(2);

        return {
          success: true,
          data: {
            voucherNo: foundInList.voucherNo,
            voucherDate: foundInList.voucherDate,
            voucherType: "Journal Voucher",
            status: foundInList.status || "POSTED",
            branchName: foundInList.branchName,
            branchNo: "001",
            site: {
              siteId: foundInList.siteId,
              siteName: foundInList.siteName,
            },
            payrollPeriod: foundInList.payrollPeriod,
            employeeCount: foundInList.employeeCount,
            auditTrail: {
              lockedBy: "payroll_lead_01",
              lockedAt: foundInList.postedAt || "2026-10-23T20:15:00+05:30",
              createdBy: "SYSTEM_AUTO_TRIGGER",
              createdAt: foundInList.postedAt || "2026-10-23T20:15:02+05:30",
            },
            entries: [
              {
                lineNo: 1,
                head: "Basic",
                debit: { glCode: `X1002001`, glName: `${foundInList.branchName} - BASIC SALARY EXPENSE`, amount: basicAmt },
                credit: { glCode: `L2002001`, glName: `${foundInList.branchName} - BASIC SALARY LIABILITY`, amount: basicAmt },
              },
              {
                lineNo: 2,
                head: "DA",
                debit: { glCode: `X1002002`, glName: `${foundInList.branchName} - DA EXPENSE`, amount: daAmt },
                credit: { glCode: `L2002002`, glName: `${foundInList.branchName} - DA LIABILITY`, amount: daAmt },
              },
              {
                lineNo: 3,
                head: "HRA",
                debit: { glCode: `X1002003`, glName: `${foundInList.branchName} - HRA EXPENSE`, amount: hraAmt },
                credit: { glCode: `L2002003`, glName: `${foundInList.branchName} - HRA LIABILITY`, amount: hraAmt },
              },
            ],
            totals: {
              totalDebit: amountNum.toFixed(2),
              totalCredit: amountNum.toFixed(2),
              difference: "0.00",
              isBalanced: true,
            },
            zeroHeadsSkipped: 50,
          },
        };
      }

      return {
        success: false,
        message: `Voucher ${voucherNo} not found`,
      };
    } catch (error) {
      console.error("Error fetching voucher details:", error);
      return {
        success: false,
        message: error.message || "Failed to load voucher details",
      };
    }
  },
};

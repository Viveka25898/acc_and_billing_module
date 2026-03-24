/**
 * BS Report Dummy Data
 * I SMART FACITECH PRIVATE LIMITED
 *
 * PURPOSE: This file is the ONLY file that needs to change when backend API is ready.
 * The service (BSReportExcelService.js) consumes this data contract and never needs to change.
 *
 * API INTEGRATION GUIDE:
 *   Replace the exported constants below with async fetchers, e.g.:
 *     export const getBSData = async () => await api.get('/reports/balance-sheet')
 *   Then update BSReportExcelService.js to await those calls.
 */

// ─── COMPANY META ──────────────────────────────────────────────────────────────
export const COMPANY_META = {
  name: 'I SMART FACITECH PRIVATE LIMITED',
  formerly1: '(Formerly known as "Comfort Facility Management Services Private Limited")',
  formerly2: '(and before that "Comfort Facility Management Services LLP")',
  reportDate: '31st March 2024',
  prevDate: '31st March 2023',
  cinNo: '',
}

// ─── BALANCE SHEET MAIN (Sheet 1: BS) ──────────────────────────────────────────
export const BS_DATA = {
  equityAndLiabilities: {
    shareholdersFunds: {
      shareCapital: { note: 2, cy: 16500000, py: 16500000 },
      reservesAndSurplus: { note: 3, cy: 8491268, py: 1010891 },
      totalShareholdersFunds: { cy: 24991268, py: 17510891 },
    },
    nonCurrentLiabilities: {
      longTermBorrowings: { note: 4, cy: 4100000, py: 20633906 },
      deferredTaxLiabilities: { note: null, cy: 0, py: 15227 },
      otherLongTermLiabilities: { note: null, cy: 0, py: 0 },
      longTermProvisions: { note: null, cy: 0, py: 0 },
      totalNonCurrentLiabilities: { cy: 4100000, py: 20649133 },
    },
    currentLiabilities: {
      shortTermBorrowings: { note: 5, cy: 63362724, py: 19974903 },
      tradePayablesMSME: { note: 6, cy: 0, py: 0 },
      tradePayablesOthers: { note: 6, cy: 7472986, py: 6559365 },
      otherCurrentLiabilities: { note: 7, cy: 105218524, py: 45021242 },
      shortTermProvisions: { note: 8, cy: 5553903, py: 1437198 },
      totalCurrentLiabilities: { cy: 181608137, py: 72992707 },
    },
    grandTotal: { cy: 210699405, py: 111152731 },
  },
  assets: {
    nonCurrentAssets: {
      ppe: { note: 9, cy: 5420336, py: 5799449 },
      intangibleAssets: { note: 9, cy: 449399, py: 545277 },
      nonCurrentInvestments: { note: null, cy: 0, py: 0 },
      deferredTaxAssetsNet: { note: 10, cy: 448299, py: 0 },
      longTermLoansAndAdvances: { note: null, cy: 0, py: 0 },
    },
    currentAssets: {
      inventories: { note: null, cy: 0, py: 0 },
      tradeReceivables: { note: 11, cy: 144367558, py: 56033060 },
      cashAndCashEquivalents: { note: 12, cy: 2341712, py: 8786407 },
      shortTermLoansAndAdvances: { note: 13, cy: 44949803, py: 35456438 },
      otherCurrentAssets: { note: 14, cy: 12722300, py: 4532101 },
    },
    grandTotal: { cy: 210699405, py: 111152731 },
  },
}

// ─── PROFIT & LOSS (Sheet 3: PL) ───────────────────────────────────────────────
export const PL_DATA = {
  revenue: {
    revenueFromOperations: { note: 15, cy: 707124186, py: 189592750 },
    otherIncome: { note: 16, cy: 1261494, py: 6125719 },
    totalRevenue: { cy: 708385680, py: 195718469 },
  },
  expenses: {
    costOfMaterialsConsumed: { note: 17, cy: 24143804, py: 4957530 },
    changesInInventories: { note: null, cy: 0, py: 0 },
    employeeBenefitExpenses: { note: 18, cy: 612819960, py: 163077243 },
    financeCosts: { note: 19, cy: 5320245, py: 2205245 },
    depreciationAndAmortization: { note: 9, cy: 3627887, py: 1434460 },
    otherExpenses: { note: 20, cy: 49903030, py: 22202914 },
    totalExpenses: { cy: 695814926, py: 193877392 },
  },
  profitBeforeTax: { cy: 12570754, py: 1841077 },
  taxExpense: {
    currentTax: { cy: 5553903, py: 1437198 },
    deferredTax: { cy: -463527, py: 15227 },
    earlierYearTaxAdjustment: { cy: 0, py: 0 },
    totalTax: { cy: 5090376, py: 1452425 },
  },
  profitAfterTax: { cy: 7480378, py: 388652 },
  earningsPerShare: {
    basic: { cy: 4.53, py: 0.24 },
    diluted: { cy: 4.53, py: 0.24 },
  },
}

// ─── BS SCHEDULES (Sheet 2: BS Schedule) ───────────────────────────────────────
export const BS_SCHEDULE_DATA = {
  note2_shareCapital: {
    title: 'Note 2: Share Capital',
    authorisedCapital: {
      description: '2000000 Equity Shares of Rs.10/- each',
      cyNumber: 2000000, cyAmount: 200000000,
      pyNumber: 2000000, pyAmount: 200000000,
    },
    issuedSubscribedPaidUp: {
      description: '1650000 Equity Shares of Rs.10/- each',
      cyNumber: 1650000, cyAmount: 165000000,
      pyNumber: 1650000, pyAmount: 165000000,
    },
    total: { cyNumber: 1650000, cyAmount: 165000000, pyNumber: 1650000, pyAmount: 165000000 },
    reconciliation: [
      { particulars: 'Shares outstanding at the beginning of the year', cyNumber: 165000, cyAmount: 1650000, pyNumber: 50000, pyAmount: 500000 },
      { particulars: 'Add: Shares Issued during the year', cyNumber: 0, cyAmount: 0, pyNumber: 1600000, pyAmount: 160000000 },
      { particulars: 'Shares outstanding at the end of the year', cyNumber: 165000, cyAmount: 1650000, pyNumber: 1650000, pyAmount: 165000000 },
    ],
    termsRights: 'The Company has only one class of equity shares having par value of Rs.10/- per share having equal rights. Each holder of equity shares is entitled to one vote per share. In the event of liquidation of the company, the holders of equity shares will be entitled to receive remaining assets of the company, after distribution of all liabilities. The distribution will be in proportion to the number of equity shares held by the shareholders.',
    shareholdersAbove5Percent: [
      { name: 'Sanjay T. Khanvilkar', cyShares: 1138750, cyPercent: '69.02%', pyShares: 1138750, pyPercent: '69.02%' },
      { name: 'Vinayak Bhise', cyShares: 505000, cyPercent: '30.61%', pyShares: 505000, pyPercent: '30.61%' },
    ],
    totalShares: { cy: 1650000, py: 1650000 },
  },

  note3_reserveAndSurplus: {
    title: 'Note 3: Reserve & Surplus',
    profitAndLoss: {
      openingBalance: { cy: 1010891, py: 622239 },
      addProfitLoss: { cy: 7480378, py: 388652 },
      total: { cy: 8491268, py: 1010891 },
    },
  },

  note4_longTermBorrowings: {
    title: 'Note 4: Long Term Borrowings',
    items: [
      { name: 'Keita Pharma Pvt Ltd', cy: 2990000, py: 4580000 },
      { name: 'Sanjay Khanvilkar', cy: 0, py: 5907800 },
      { name: 'Shobhana Bagwe', cy: 410000, py: 110000 },
      { name: 'Vinayak Bhise', cy: 700000, py: 6536106 },
      { name: 'Amarjit Rai', cy: 0, py: 3500000 },
    ],
    total: { cy: 4100000, py: 20633906 },
  },

  note5_shortTermBorrowings: {
    title: 'Note 5: Short Term Borrowings',
    label: 'Unsecured Loans - Repayable within one year',
    items: [
      { name: 'Shree Satya Minerals Pvt Ltd Loan', cy: 0, py: 4567500 },
      { name: 'Loan From Other', cy: 22924, py: 22924 },
      { name: 'PNB CC A/c 1045108700000064', cy: 60839800, py: 15384479 },
      { name: 'Deposit from Vendors', cy: 2500000, py: 0 },
    ],
    total: { cy: 63362724, py: 19974903 },
  },

  note6_tradePayables: {
    title: 'Note 6: Trade Payables',
    msmeNote: 'There are no dues to Micro and Small Enterprises under the Micro, Small and Medium Enterprises Development Act, 2006.',
    currentYear: {
      label: 'Figures For the Current Year',
      rows: [
        { category: 'MSME', lt6: 0, m6to1y: 0, m1to2y: 0, gt2y: 0, total: 0 },
        { category: 'Others', lt6: 7262084, m6to1y: 92399.98, m1to2y: 118503, gt2y: 0, total: 7472986 },
        { category: 'Dispute dues-MSME', lt6: 0, m6to1y: 0, m1to2y: 0, gt2y: 0, total: 0 },
        { category: 'Dispute dues-Others', lt6: 0, m6to1y: 0, m1to2y: 0, gt2y: 0, total: 0 },
      ],
    },
    previousYear: {
      label: 'Figures For Previous Year',
      rows: [
        { category: 'MSME', lt6: 0, m6to1y: 0, m1to2y: 0, gt2y: 0, total: 0 },
        { category: 'Others', lt6: 5997054, m6to1y: 562311.29, m1to2y: 0, gt2y: 0, total: 6559365 },
        { category: 'Dispute dues-MSME', lt6: 0, m6to1y: 0, m1to2y: 0, gt2y: 0, total: 0 },
        { category: 'Dispute dues-Others', lt6: 0, m6to1y: 0, m1to2y: 0, gt2y: 0, total: 0 },
      ],
    },
  },

  note7_otherCurrentLiabilities: {
    title: 'Note 7: Other Current Liabilities',
    items: [
      { name: 'Statutory dues payable', cy: 49040834, py: 7327095 },
      { name: 'Dues to Employees', cy: 49728592, py: 36939159 },
      { name: 'Other Expenses', cy: 6449098, py: 754988 },
    ],
    total: { cy: 105218524, py: 45021242 },
  },

  note8_shortTermProvisions: {
    title: 'Note 8: Short Term Provisions',
    items: [
      { name: 'Provision for Tax', cy: 5553903, py: 1437198 },
    ],
    total: { cy: 5553903, py: 1437198 },
  },

  note10_deferredTaxAssets: {
    title: 'Note 10: Deferred Tax Assets',
    items: [
      { name: 'Depreciation', cy: 448299, py: 0 },
    ],
    total: { cy: 448299, py: 0 },
  },

  note11_tradeReceivables: {
    title: 'Note 11: Trade Receivable',
    debtsExceedingSixMonths: {
      unsecuredGood: { cy: 6354695, py: 3862082 },
      provisionDoubtful: { cy: 0, py: 0 },
      unsecuredDoubtful: { cy: 0, py: 0 },
      provision: { cy: 0, py: 0 },
      subtotal: { cy: 6354695, py: 3862082 },
    },
    otherDebts: {
      unsecuredGood: { cy: 138012862, py: 52170978 },
      unsecuredDoubtful: { cy: 0, py: 0 },
      subtotal: { cy: 138012862, py: 52170978 },
      lessProvision: { cy: 0, py: 0 },
      net: { cy: 138012862, py: 52170978 },
    },
    total: { cy: 144367558, py: 56033060 },

    currentYearAgeing: [
      { category: 'Disputed, considered good', lt6: 0, m6to1y: 0, m1to2y: 0, gt2y: 0, total: 0 },
      { category: 'Less: Provision', lt6: 0, m6to1y: 0, m1to2y: 0, gt2y: 0, total: 0 },
      { category: 'Disputed, considered doubtful', lt6: 0, m6to1y: 0, m1to2y: 0, gt2y: 0, total: 0 },
      { category: 'Less: Provision for doubtful debts', lt6: 0, m6to1y: 0, m1to2y: 0, gt2y: 0, total: 0 },
      { category: 'Undisputed, considered good', lt6: 138012862, m6to1y: 2402248, m1to2y: 1246739, gt2y: 2705709, total: 144367558 },
      { category: 'Undisputed, considered doubtful', lt6: 0, m6to1y: 0, m1to2y: 0, gt2y: 0, total: 0 },
    ],
    cyAgeingTotal: { lt6: 138012862, m6to1y: 2402248, m1to2y: 1246739, gt2y: 2705709, total: 144367558 },

    previousYearAgeing: [
      { category: 'Disputed, considered good', lt6: 0, m6to1y: 0, m1to2y: 0, gt2y: 0, total: 0 },
      { category: 'Less: Provision', lt6: 0, m6to1y: 0, m1to2y: 0, gt2y: 0, total: 0 },
      { category: 'Disputed, considered doubtful', lt6: 0, m6to1y: 0, m1to2y: 0, gt2y: 0, total: 0 },
      { category: 'Less: Provision for doubtful debts', lt6: 0, m6to1y: 0, m1to2y: 0, gt2y: 0, total: 0 },
      { category: 'Undisputed, considered good', lt6: 52170978, m6to1y: 1156374, m1to2y: 0, gt2y: 2705709, total: 56033060 },
      { category: 'Undisputed, considered doubtful', lt6: 0, m6to1y: 0, m1to2y: 0, gt2y: 0, total: 0 },
    ],
    pyAgeingTotal: { lt6: 52170978, m6to1y: 1156374, m1to2y: 0, gt2y: 2705709, total: 56033060 },
  },

  note12_cashAndCashEquivalents: {
    title: 'Note 12: Cash & Cash Equivalents',
    items: [
      { name: 'Cash on hand', cy: 21672, py: 5312 },
      { name: 'Balances with banks in current accounts', cy: 306856, py: 8503095 },
    ],
    otherBankBalances: [
      { name: 'Bank deposits*', cy: 2013183, py: 278000 },
    ],
    total: { cy: 2341712, py: 8786407 },
  },

  note13_shortTermLoansAndAdvances: {
    title: 'Note 13: Short Term Loans & Advances',
    label: 'Unsecured, considered good',
    items: [
      { name: 'Security Deposits', cy: 7440214, py: 8817750 },
      { name: 'Advances to Employees', cy: 15001828, py: 13047668 },
      { name: 'Advance to Vendors/Staff for Projects', cy: 8798254, py: 8445003 },
      { name: 'Statutory Dues Receivable', cy: 105904, py: 328090 },
      { name: 'Advance Income Tax Paid (TDS)', cy: 13603603, py: 4817927 },
    ],
    total: { cy: 44949803, py: 35456438 },
  },

  note14_otherCurrentAssets: {
    title: 'Note 14: Other Current Assets',
    items: [
      { name: 'Prepaid Expenses', cy: 12594119, py: 4532101 },
      { name: 'Accrued Interest Received', cy: 128181, py: 0 },
    ],
    total: { cy: 12722300, py: 4532101 },
  },
}

// ─── PL SCHEDULES (Sheet 4: PL Schedule) ───────────────────────────────────────
export const PL_SCHEDULE_DATA = {
  note15_revenueFromOperations: {
    title: 'Note 15: Revenue from operations',
    items: [
      { name: 'Facility Management Contractual charges', cy: 707124186, py: 189592750 },
    ],
    total: { cy: 707124186, py: 189592750 },
  },

  note16_otherIncome: {
    title: 'Note 16: Other Income',
    items: [
      { name: 'Miscellaneous Income', cy: 1261494, py: 6125719 },
    ],
    total: { cy: 1261494, py: 6125719 },
  },

  note17_costOfMaterials: {
    title: 'Note 17: Cost of materials consumed',
    items: [
      { name: 'Material consumed', cy: 17670195, py: 3989920 },
      { name: 'Uniform consumed', cy: 6473609, py: 967610 },
    ],
    total: { cy: 24143804, py: 4957530 },
  },

  note18_employeeBenefits: {
    title: 'Note 18: Employee benefits expense',
    items: [
      { name: 'Salaries and wages', cy: 544905102, py: 144445313 },
      { name: 'Contributions to provident and other funds', cy: 66927303, py: 17969817 },
      { name: 'Staff Welfare', cy: 987555, py: 662113 },
    ],
    total: { cy: 612819960, py: 163077243 },
  },

  note19_financeCost: {
    title: 'Note 19: Finance Cost',
    label: 'Interest expense on :-',
    items: [
      { name: 'Borrowings', cy: 4254465, py: 780004 },
      { name: 'Other borrowing Cost', cy: 1065780, py: 1425241 },
    ],
    total: { cy: 5320245, py: 2205245 },
  },

  note20_otherExpenses: {
    title: 'Note 20: Other Expenses',
    items: [
      { name: 'Telephone & Internet Expenses', cy: 551801, py: 138715 },
      { name: 'Bad Debts', cy: 31712, py: 295053 },
      { name: 'Donation', cy: 32500, py: 119060 },
      { name: 'Professional Fees', cy: 3968847, py: 2705447 },
      { name: 'Audit Fees', cy: 25000, py: 0 },
      { name: 'ROC Filling Fees', cy: 3000, py: 47186 },
      { name: 'Conference & Seminar Expenses', cy: 0, py: 494321 },
      { name: 'Loss by Business Fraud', cy: 576230, py: 0 },
      { name: 'Advertisement', cy: 12550, py: 40000 },
      { name: 'Insurance', cy: 1625553, py: 297120 },
      { name: 'Sub Contract Charges', cy: 4537580, py: 483433 },
      { name: 'Electricity Charges', cy: 445415, py: 128642 },
      { name: 'Rent Expenses', cy: 2986682, py: 1138163 },
      { name: 'Office Expenses', cy: 624111, py: 333595 },
      { name: 'Printing & Stationery', cy: 930615, py: 404141 },
      { name: 'Repairs & Maintenance', cy: 3340269, py: 257809 },
      { name: 'Travelling Expenses', cy: 9413125, py: 4845072 },
      { name: 'Commission & Brokerage', cy: 58500, py: 101500 },
      { name: 'Business Promotion Expenses', cy: 3199620, py: 1678749 },
      { name: 'Penalty, Interest and late Filing fees', cy: 1252276, py: 946091 },
      { name: 'Site Expenses', cy: 14131476, py: 6119154 },
      { name: 'Postage & Courier', cy: 795485, py: 323573 },
      { name: 'Registration & Renewal Fees', cy: 336615, py: 46955 },
      { name: 'Misc Expenses', cy: 289819, py: 248408 },
      { name: 'Computer Expenses', cy: 734248, py: 189412 },
      { name: 'Consultancy Charges - Overseas', cy: 0, py: 821307 },
    ],
    total: { cy: 49903030, py: 22202914 },
  },
}

// ─── FA NOTE 9 (Sheet 5: FA Note 9) ────────────────────────────────────────────
export const FA_NOTE_DATA = {
  title: 'Note 9: Depreciation as per Companies Act, 2013',
  assets: [
    {
      name: 'FA Computer & Laptop',
      grossBlock: { opening: 1172823, additions: 817282, deletions: 0, closing: 1990105 },
      depreciation: { opening: 291762, forYear: 766240, deletions: 0, closing: 1058002 },
      netBlock: { cy: 932103, py: 881061 },
    },
    {
      name: 'FA Office Equipment',
      grossBlock: { opening: 1001614, additions: 194084, deletions: 0, closing: 1195698 },
      depreciation: { opening: 106070, forYear: 451148, deletions: 0, closing: 557218 },
      netBlock: { cy: 638481, py: 895544 },
    },
    {
      name: 'FA Furniture & Fixture',
      grossBlock: { opening: 668772, additions: 91733, deletions: 0, closing: 760504 },
      depreciation: { opening: 25807, forYear: 186641, deletions: 0, closing: 212448 },
      netBlock: { cy: 548057, py: 642965 },
    },
    {
      name: 'FA Machinery',
      grossBlock: { opening: 4316411, additions: 2151491, deletions: 101695, closing: 6366207 },
      depreciation: { opening: 936531, forYear: 2127980, deletions: 0, closing: 3064511 },
      netBlock: { cy: 3301696, py: 3379880 },
    },
    {
      name: 'FA Software',
      grossBlock: { opening: 619567, additions: 0, deletions: 0, closing: 619567 },
      depreciation: { opening: 74290, forYear: 95879, deletions: 0, closing: 170168 },
      netBlock: { cy: 449399, py: 545277 },
    },
  ],
  totals: {
    grossBlock: { opening: 7779186, additions: 3254590, deletions: 101695, closing: 10932081 },
    depreciation: { opening: 1434460, forYear: 3627887, deletions: 0, closing: 5062346 },
    netBlock: { cy: 5869734, py: 6344726 },
  },
}

export default {
  COMPANY_META,
  BS_DATA,
  PL_DATA,
  BS_SCHEDULE_DATA,
  PL_SCHEDULE_DATA,
  FA_NOTE_DATA,
}

/**
 * salaryJVDummyData.js
 * In-memory realistic dataset for Salary Journal Vouchers
 * Strictly NO localStorage usage.
 * Modeled after API 2 (Detail) and API 3 (List) specifications.
 */

export const MOCK_BRANCHES = [
  "ANDHRA PRADESH",
  "ASSAM",
  "BANGALORE",
  "BIHAR",
  "CHANDIGARH",
  "CHENNAI",
  "CHHATTISGARH",
  "DAMAN AND DIU",
  "DELHI",
  "GOA",
  "GUJARAT",
  "HARYANA",
  "HIMACHAL PRADESH",
  "HYDERABAD",
  "INDORE",
  "JAIPUR",
  "JAMMU AND KASHMIR",
  "JHARKHAND",
  "KERALA",
  "MUMBAI",
  "ODISHA",
  "PUNE",
  "PUNJAB",
  "TRIPURA",
  "UTTAR PRADESH",
  "UTTARAKHAND",
  "WEST BENGAL"
];

// Helper to convert number to Indian Currency Words
export function numberToWordsIndian(num) {
  if (!num || isNaN(num)) return "ZERO ONLY";
  const a = [
    "", "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT", "NINE", "TEN",
    "ELEVEN", "TWELVE", "THIRTEEN", "FOURTEEN", "FIFTEEN", "SIXTEEN", "SEVENTEEN", "EIGHTEEN", "NINETEEN"
  ];
  const b = ["", "", "TWENTY", "THIRTY", "FORTY", "FIFTY", "SIXTY", "SEVENTY", "EIGHTY", "NINETY"];

  function inWords(n) {
    if (n < 20) return a[n];
    const digit = n % 10;
    return b[Math.floor(n / 10)] + (digit ? " " + a[digit] : "");
  }

  const integerPart = Math.floor(Number(num));
  if (integerPart === 0) return "ZERO RUPEES ONLY";

  let str = "";
  const crore = Math.floor(integerPart / 10000000);
  let rem = integerPart % 10000000;
  const lakh = Math.floor(rem / 100000);
  rem = rem % 100000;
  const thousand = Math.floor(rem / 1000);
  rem = rem % 1000;
  const hundred = Math.floor(rem / 100);
  rem = rem % 100;

  if (crore > 0) str += inWords(crore) + " CRORE ";
  if (lakh > 0) str += inWords(lakh) + " LAKH ";
  if (thousand > 0) str += inWords(thousand) + " THOUSAND ";
  if (hundred > 0) str += inWords(hundred) + " HUNDRED ";
  if (rem > 0) {
    if (str !== "") str += "AND ";
    str += inWords(rem) + " ";
  }

  return "RUPEES " + str.trim() + " ONLY";
}

// 10 Detailed Vouchers for API 2
export const MOCK_DETAILED_JVS = {
  "JVF00/MUM/SITE-101/2610": {
    voucherNo: "JVF00/MUM/SITE-101/2610",
    voucherDate: "2026-10-31",
    voucherType: "Journal Voucher",
    status: "POSTED",
    branchName: "MUMBAI",
    branchNo: "001",
    site: {
      siteId: "SITE-101",
      siteName: "Powai IT Park - Building B"
    },
    payrollPeriod: "10-2026",
    employeeCount: 20,
    auditTrail: {
      lockedBy: "payroll_lead_01",
      lockedAt: "2026-10-23T20:15:00+05:30",
      createdBy: "SYSTEM_AUTO_TRIGGER",
      createdAt: "2026-10-23T20:15:02+05:30"
    },
    entries: [
      {
        lineNo: 1,
        head: "Basic",
        debit: {
          glCode: "X1002020001",
          glName: "MUMBAI BRANCH - BASIC SALARY EXPENSE",
          parentCode: "X1002020",
          parentName: "MUMBAI BRANCH",
          amount: "500000.00"
        },
        credit: {
          glCode: "L2002020001",
          glName: "MUMBAI BRANCH - BASIC SALARY LIABILITY",
          parentCode: "L2002020",
          parentName: "MUMBAI BRANCH",
          amount: "500000.00"
        }
      },
      {
        lineNo: 2,
        head: "DA",
        debit: {
          glCode: "X1002020002",
          glName: "MUMBAI BRANCH - DA EXPENSE",
          parentCode: "X1002020",
          parentName: "MUMBAI BRANCH",
          amount: "200000.00"
        },
        credit: {
          glCode: "L2002020002",
          glName: "MUMBAI BRANCH - DA LIABILITY",
          parentCode: "L2002020",
          parentName: "MUMBAI BRANCH",
          amount: "200000.00"
        }
      },
      {
        lineNo: 3,
        head: "HRA",
        debit: {
          glCode: "X1002020003",
          glName: "MUMBAI BRANCH - HRA EXPENSE",
          parentCode: "X1002020",
          parentName: "MUMBAI BRANCH",
          amount: "150000.00"
        },
        credit: {
          glCode: "L2002020003",
          glName: "MUMBAI BRANCH - HRA LIABILITY",
          parentCode: "L2002020",
          parentName: "MUMBAI BRANCH",
          amount: "150000.00"
        }
      },
      {
        lineNo: 4,
        head: "CCA",
        debit: {
          glCode: "X1002020004",
          glName: "MUMBAI BRANCH - CCA EXPENSE",
          parentCode: "X1002020",
          parentName: "MUMBAI BRANCH",
          amount: "40000.00"
        },
        credit: {
          glCode: "L2002020004",
          glName: "MUMBAI BRANCH - CCA LIABILITY",
          parentCode: "L2002020",
          parentName: "MUMBAI BRANCH",
          amount: "40000.00"
        }
      },
      {
        lineNo: 5,
        head: "Other",
        debit: {
          glCode: "X1002020005",
          glName: "MUMBAI BRANCH - OTHER SALARY EXPENSE",
          parentCode: "X1002020",
          parentName: "MUMBAI BRANCH",
          amount: "15000.00"
        },
        credit: {
          glCode: "L2002020005",
          glName: "MUMBAI BRANCH - OTHER SALARY LIABILITY",
          parentCode: "L2002020",
          parentName: "MUMBAI BRANCH",
          amount: "15000.00"
        }
      },
      {
        lineNo: 6,
        head: "Bonus (M)",
        debit: {
          glCode: "X1002020007",
          glName: "MUMBAI BRANCH - BONUS MONTHLY EXPENSE",
          parentCode: "X1002020",
          parentName: "MUMBAI BRANCH",
          amount: "35000.00"
        },
        credit: {
          glCode: "L2002020007",
          glName: "MUMBAI BRANCH - BONUS MONTHLY LIABILITY",
          parentCode: "L2002020",
          parentName: "MUMBAI BRANCH",
          amount: "35000.00"
        }
      },
      {
        lineNo: 7,
        head: "LWW (M)",
        debit: {
          glCode: "X1002020008",
          glName: "MUMBAI BRANCH - LWW MONTHLY EXPENSE",
          parentCode: "X1002020",
          parentName: "MUMBAI BRANCH",
          amount: "30000.00"
        },
        credit: {
          glCode: "L2002020008",
          glName: "MUMBAI BRANCH - LWW MONTHLY LIABILITY",
          parentCode: "L2002020",
          parentName: "MUMBAI BRANCH",
          amount: "30000.00"
        }
      },
      {
        lineNo: 8,
        head: "Food Allowance",
        debit: {
          glCode: "X1002020024",
          glName: "MUMBAI BRANCH - FOOD ALLOWANCE EXPENSE",
          parentCode: "X1002020",
          parentName: "MUMBAI BRANCH",
          amount: "10000.00"
        },
        credit: {
          glCode: "L2002020024",
          glName: "MUMBAI BRANCH - FOOD ALLOWANCE LIABILITY",
          parentCode: "L2002020",
          parentName: "MUMBAI BRANCH",
          amount: "10000.00"
        }
      },
      {
        lineNo: 9,
        head: "PF (12%)",
        debit: {
          glCode: "L2002020061",
          glName: "MUMBAI BRANCH - SALARY DEDUCTION CLEARING",
          parentCode: "L2002020",
          parentName: "MUMBAI BRANCH",
          amount: "60000.00"
        },
        credit: {
          glCode: "L2002020056",
          glName: "MUMBAI BRANCH - PF PAYABLE - EMPLOYEE SHARE",
          parentCode: "L2002020",
          parentName: "MUMBAI BRANCH",
          amount: "60000.00"
        }
      },
      {
        lineNo: 10,
        head: "PT",
        debit: {
          glCode: "L2002020061",
          glName: "MUMBAI BRANCH - SALARY DEDUCTION CLEARING",
          parentCode: "L2002020",
          parentName: "MUMBAI BRANCH",
          amount: "200.00"
        },
        credit: {
          glCode: "L2002020058",
          glName: "MUMBAI BRANCH - PT PAYABLE - EMPLOYEE SHARE",
          parentCode: "L2002020",
          parentName: "MUMBAI BRANCH",
          amount: "200.00"
        }
      },
      {
        lineNo: 11,
        head: "PF (13%)",
        debit: {
          glCode: "X1002020027",
          glName: "MUMBAI BRANCH - EMPLOYER PF EXPENSE",
          parentCode: "X1002020",
          parentName: "MUMBAI BRANCH",
          amount: "65000.00"
        },
        credit: {
          glCode: "L2002020027",
          glName: "MUMBAI BRANCH - PF PAYABLE - EMPLOYER SHARE",
          parentCode: "L2002020",
          parentName: "MUMBAI BRANCH",
          amount: "65000.00"
        }
      },
      {
        lineNo: 12,
        head: "LWF",
        debit: {
          glCode: "X1002020029",
          glName: "MUMBAI BRANCH - EMPLOYER LWF EXPENSE",
          parentCode: "X1002020",
          parentName: "MUMBAI BRANCH",
          amount: "1000.00"
        },
        credit: {
          glCode: "L2002020029",
          glName: "MUMBAI BRANCH - LWF PAYABLE - EMPLOYER SHARE",
          parentCode: "L2002020",
          parentName: "MUMBAI BRANCH",
          amount: "1000.00"
        }
      },
      {
        lineNo: 13,
        head: "Gratuity (4.81%)",
        debit: {
          glCode: "X1002020034",
          glName: "MUMBAI BRANCH - EMPLOYER GRATUITY EXPENSE",
          parentCode: "X1002020",
          parentName: "MUMBAI BRANCH",
          amount: "24050.00"
        },
        credit: {
          glCode: "L2002020034",
          glName: "MUMBAI BRANCH - GRATUITY PAYABLE",
          parentCode: "L2002020",
          parentName: "MUMBAI BRANCH",
          amount: "24050.00"
        }
      },
      {
        lineNo: 14,
        head: "WC Policy",
        debit: {
          glCode: "X1002020046",
          glName: "MUMBAI BRANCH - EMPLOYER WC POLICY EXPENSE",
          parentCode: "X1002020",
          parentName: "MUMBAI BRANCH",
          amount: "4500.00"
        },
        credit: {
          glCode: "L2002020046",
          glName: "MUMBAI BRANCH - WC POLICY PAYABLE",
          parentCode: "L2002020",
          parentName: "MUMBAI BRANCH",
          amount: "4500.00"
        }
      }
    ],
    totals: {
      totalDebit: "1134750.00",
      totalCredit: "1134750.00",
      difference: "0.00",
      isBalanced: true
    },
    zeroHeadsSkipped: 46
  },

  "JVF00/MUM/SITE-102/2610": {
    voucherNo: "JVF00/MUM/SITE-102/2610",
    voucherDate: "2026-10-31",
    voucherType: "Journal Voucher",
    status: "POSTED",
    branchName: "MUMBAI",
    branchNo: "001",
    site: {
      siteId: "SITE-102",
      siteName: "Worli Financial Hub"
    },
    payrollPeriod: "10-2026",
    employeeCount: 18,
    auditTrail: {
      lockedBy: "payroll_lead_01",
      lockedAt: "2026-10-24T11:05:38+05:30",
      createdBy: "SYSTEM_AUTO_TRIGGER",
      createdAt: "2026-10-24T11:05:40+05:30"
    },
    entries: [
      {
        lineNo: 1,
        head: "Basic",
        debit: { glCode: "X1002020001", glName: "MUMBAI BRANCH - BASIC SALARY EXPENSE", parentCode: "X1002020", parentName: "MUMBAI BRANCH", amount: "420000.00" },
        credit: { glCode: "L2002020001", glName: "MUMBAI BRANCH - BASIC SALARY LIABILITY", parentCode: "L2002020", parentName: "MUMBAI BRANCH", amount: "420000.00" }
      },
      {
        lineNo: 2,
        head: "DA",
        debit: { glCode: "X1002020002", glName: "MUMBAI BRANCH - DA EXPENSE", parentCode: "X1002020", parentName: "MUMBAI BRANCH", amount: "160000.00" },
        credit: { glCode: "L2002020002", glName: "MUMBAI BRANCH - DA LIABILITY", parentCode: "L2002020", parentName: "MUMBAI BRANCH", amount: "160000.00" }
      },
      {
        lineNo: 3,
        head: "HRA",
        debit: { glCode: "X1002020003", glName: "MUMBAI BRANCH - HRA EXPENSE", parentCode: "X1002020", parentName: "MUMBAI BRANCH", amount: "120000.00" },
        credit: { glCode: "L2002020003", glName: "MUMBAI BRANCH - HRA LIABILITY", parentCode: "L2002020", parentName: "MUMBAI BRANCH", amount: "120000.00" }
      },
      {
        lineNo: 4,
        head: "CCA",
        debit: { glCode: "X1002020004", glName: "MUMBAI BRANCH - CCA EXPENSE", parentCode: "X1002020", parentName: "MUMBAI BRANCH", amount: "30000.00" },
        credit: { glCode: "L2002020004", glName: "MUMBAI BRANCH - CCA LIABILITY", parentCode: "L2002020", parentName: "MUMBAI BRANCH", amount: "30000.00" }
      },
      {
        lineNo: 5,
        head: "PF (12%)",
        debit: { glCode: "L2002020061", glName: "MUMBAI BRANCH - SALARY DEDUCTION CLEARING", parentCode: "L2002020", parentName: "MUMBAI BRANCH", amount: "50400.00" },
        credit: { glCode: "L2002020056", glName: "MUMBAI BRANCH - PF PAYABLE - EMPLOYEE SHARE", parentCode: "L2002020", parentName: "MUMBAI BRANCH", amount: "50400.00" }
      },
      {
        lineNo: 6,
        head: "PT",
        debit: { glCode: "L2002020061", glName: "MUMBAI BRANCH - SALARY DEDUCTION CLEARING", parentCode: "L2002020", parentName: "MUMBAI BRANCH", amount: "3600.00" },
        credit: { glCode: "L2002020058", glName: "MUMBAI BRANCH - PT PAYABLE - EMPLOYEE SHARE", parentCode: "L2002020", parentName: "MUMBAI BRANCH", amount: "3600.00" }
      },
      {
        lineNo: 7,
        head: "PF (13%)",
        debit: { glCode: "X1002020027", glName: "MUMBAI BRANCH - EMPLOYER PF EXPENSE", parentCode: "X1002020", parentName: "MUMBAI BRANCH", amount: "54600.00" },
        credit: { glCode: "L2002020027", glName: "MUMBAI BRANCH - PF PAYABLE - EMPLOYER SHARE", parentCode: "L2002020", parentName: "MUMBAI BRANCH", amount: "54600.00" }
      },
      {
        lineNo: 8,
        head: "ESIC (3.25%)",
        debit: { glCode: "X1002020028", glName: "MUMBAI BRANCH - EMPLOYER ESIC EXPENSE", parentCode: "X1002020", parentName: "MUMBAI BRANCH", amount: "23725.00" },
        credit: { glCode: "L2002020028", glName: "MUMBAI BRANCH - ESIC PAYABLE - EMPLOYER SHARE", parentCode: "L2002020", parentName: "MUMBAI BRANCH", amount: "23725.00" }
      },
      {
        lineNo: 9,
        head: "Gratuity (4.81%)",
        debit: { glCode: "X1002020034", glName: "MUMBAI BRANCH - EMPLOYER GRATUITY EXPENSE", parentCode: "X1002020", parentName: "MUMBAI BRANCH", amount: "20202.00" },
        credit: { glCode: "L2002020034", glName: "MUMBAI BRANCH - GRATUITY PAYABLE", parentCode: "L2002020", parentName: "MUMBAI BRANCH", amount: "20202.00" }
      },
      {
        lineNo: 10,
        head: "WC Policy",
        debit: { glCode: "X1002020046", glName: "MUMBAI BRANCH - EMPLOYER WC POLICY EXPENSE", parentCode: "X1002020", parentName: "MUMBAI BRANCH", amount: "22473.00" },
        credit: { glCode: "L2002020046", glName: "MUMBAI BRANCH - WC POLICY PAYABLE", parentCode: "L2002020", parentName: "MUMBAI BRANCH", amount: "22473.00" }
      }
    ],
    totals: {
      totalDebit: "905000.00",
      totalCredit: "905000.00",
      difference: "0.00",
      isBalanced: true
    },
    zeroHeadsSkipped: 50
  },

  "JVF00/PUN/SITE-201/2610": {
    voucherNo: "JVF00/PUN/SITE-201/2610",
    voucherDate: "2026-10-31",
    voucherType: "Journal Voucher",
    status: "POSTED",
    branchName: "PUNE",
    branchNo: "022",
    site: {
      siteId: "SITE-201",
      siteName: "Hinjawadi IT SEZ - Phase 1"
    },
    payrollPeriod: "10-2026",
    employeeCount: 35,
    auditTrail: {
      lockedBy: "payroll_pune_02",
      lockedAt: "2026-10-24T16:20:00+05:30",
      createdBy: "SYSTEM_AUTO_TRIGGER",
      createdAt: "2026-10-24T16:20:04+05:30"
    },
    entries: [
      { lineNo: 1, head: "Basic", debit: { glCode: "X1002022001", glName: "PUNE BRANCH - BASIC SALARY EXPENSE", parentCode: "X1002022", parentName: "PUNE BRANCH", amount: "750000.00" }, credit: { glCode: "L2002022001", glName: "PUNE BRANCH - BASIC SALARY LIABILITY", parentCode: "L2002022", parentName: "PUNE BRANCH", amount: "750000.00" } },
      { lineNo: 2, head: "DA", debit: { glCode: "X1002022002", glName: "PUNE BRANCH - DA EXPENSE", parentCode: "X1002022", parentName: "PUNE BRANCH", amount: "280000.00" }, credit: { glCode: "L2002022002", glName: "PUNE BRANCH - DA LIABILITY", parentCode: "L2002022", parentName: "PUNE BRANCH", amount: "280000.00" } },
      { lineNo: 3, head: "HRA", debit: { glCode: "X1002022003", glName: "PUNE BRANCH - HRA EXPENSE", parentCode: "X1002022", parentName: "PUNE BRANCH", amount: "210000.00" }, credit: { glCode: "L2002022003", glName: "PUNE BRANCH - HRA LIABILITY", parentCode: "L2002022", parentName: "PUNE BRANCH", amount: "210000.00" } },
      { lineNo: 4, head: "Conveyance", debit: { glCode: "X1002022020", glName: "PUNE BRANCH - CONVEYANCE EXPENSE", parentCode: "X1002022", parentName: "PUNE BRANCH", amount: "56000.00" }, credit: { glCode: "L2002022020", glName: "PUNE BRANCH - CONVEYANCE LIABILITY", parentCode: "L2002022", parentName: "PUNE BRANCH", amount: "56000.00" } },
      { lineNo: 5, head: "Special Allowance", debit: { glCode: "X1002022019", glName: "PUNE BRANCH - SPECIAL ALLOWANCE EXPENSE", parentCode: "X1002022", parentName: "PUNE BRANCH", amount: "70000.00" }, credit: { glCode: "L2002022019", glName: "PUNE BRANCH - SPECIAL ALLOWANCE LIABILITY", parentCode: "L2002022", parentName: "PUNE BRANCH", amount: "70000.00" } },
      { lineNo: 6, head: "Bonus (M)", debit: { glCode: "X1002022007", glName: "PUNE BRANCH - BONUS MONTHLY EXPENSE", parentCode: "X1002022", parentName: "PUNE BRANCH", amount: "42000.00" }, credit: { glCode: "L2002022007", glName: "PUNE BRANCH - BONUS MONTHLY LIABILITY", parentCode: "L2002022", parentName: "PUNE BRANCH", amount: "42000.00" } },
      { lineNo: 7, head: "LWW (M)", debit: { glCode: "X1002022008", glName: "PUNE BRANCH - LWW MONTHLY EXPENSE", parentCode: "X1002022", parentName: "PUNE BRANCH", amount: "35000.00" }, credit: { glCode: "L2002022008", glName: "PUNE BRANCH - LWW MONTHLY LIABILITY", parentCode: "L2002022", parentName: "PUNE BRANCH", amount: "35000.00" } },
      { lineNo: 8, head: "PF (12%)", debit: { glCode: "L2002022061", glName: "PUNE BRANCH - SALARY DEDUCTION CLEARING", parentCode: "L2002022", parentName: "PUNE BRANCH", amount: "90000.00" }, credit: { glCode: "L2002022056", glName: "PUNE BRANCH - PF PAYABLE - EMPLOYEE SHARE", parentCode: "L2002022", parentName: "PUNE BRANCH", amount: "90000.00" } },
      { lineNo: 9, head: "PT", debit: { glCode: "L2002022061", glName: "PUNE BRANCH - SALARY DEDUCTION CLEARING", parentCode: "L2002022", parentName: "PUNE BRANCH", amount: "7000.00" }, credit: { glCode: "L2002022058", glName: "PUNE BRANCH - PT PAYABLE - EMPLOYEE SHARE", parentCode: "L2002022", parentName: "PUNE BRANCH", amount: "7000.00" } },
      { lineNo: 10, head: "PF (13%)", debit: { glCode: "X1002022027", glName: "PUNE BRANCH - EMPLOYER PF EXPENSE", parentCode: "X1002022", parentName: "PUNE BRANCH", amount: "97500.00" }, credit: { glCode: "L2002022027", glName: "PUNE BRANCH - PF PAYABLE - EMPLOYER SHARE", parentCode: "L2002022", parentName: "PUNE BRANCH", amount: "97500.00" } },
      { lineNo: 11, head: "Gratuity (4.81%)", debit: { glCode: "X1002022034", glName: "PUNE BRANCH - EMPLOYER GRATUITY EXPENSE", parentCode: "X1002022", parentName: "PUNE BRANCH", amount: "36075.00" }, credit: { glCode: "L2002022034", glName: "PUNE BRANCH - GRATUITY PAYABLE", parentCode: "L2002022", parentName: "PUNE BRANCH", amount: "36075.00" } },
      { lineNo: 12, head: "Stipend", debit: { glCode: "X1002022051", glName: "PUNE BRANCH - NAPS STIPEND EXPENSE", parentCode: "X1002022", parentName: "PUNE BRANCH", amount: "45000.00" }, credit: { glCode: "L2002022051", glName: "PUNE BRANCH - NAPS STIPEND PAYABLE", parentCode: "L2002022", parentName: "PUNE BRANCH", amount: "45000.00" } },
      { lineNo: 13, head: "Training Charges", debit: { glCode: "X1002022052", glName: "PUNE BRANCH - NAPS TRAINING EXPENSE", parentCode: "X1002022", parentName: "PUNE BRANCH", amount: "6000.00" }, credit: { glCode: "L2002022052", glName: "PUNE BRANCH - NAPS TRAINING PAYABLE", parentCode: "L2002022", parentName: "PUNE BRANCH", amount: "6000.00" } }
    ],
    totals: {
      totalDebit: "1724575.00",
      totalCredit: "1724575.00",
      difference: "0.00",
      isBalanced: true
    },
    zeroHeadsSkipped: 47
  },

  "JVF00/BLR/SITE-301/2610": {
    voucherNo: "JVF00/BLR/SITE-301/2610",
    voucherDate: "2026-10-31",
    voucherType: "Journal Voucher",
    status: "POSTED",
    branchName: "BANGALORE",
    branchNo: "003",
    site: {
      siteId: "SITE-301",
      siteName: "Electronic City Campus"
    },
    payrollPeriod: "10-2026",
    employeeCount: 28,
    auditTrail: {
      lockedBy: "payroll_blr_01",
      lockedAt: "2026-10-25T09:40:12+05:30",
      createdBy: "SYSTEM_AUTO_TRIGGER",
      createdAt: "2026-10-25T09:40:15+05:30"
    },
    entries: [
      { lineNo: 1, head: "Basic", debit: { glCode: "X1002003001", glName: "BANGALORE BRANCH - BASIC SALARY EXPENSE", parentCode: "X1002003", parentName: "BANGALORE BRANCH", amount: "620000.00" }, credit: { glCode: "L2002003001", glName: "BANGALORE BRANCH - BASIC SALARY LIABILITY", parentCode: "L2002003", parentName: "BANGALORE BRANCH", amount: "620000.00" } },
      { lineNo: 2, head: "DA", debit: { glCode: "X1002003002", glName: "BANGALORE BRANCH - DA EXPENSE", parentCode: "X1002003", parentName: "BANGALORE BRANCH", amount: "220000.00" }, credit: { glCode: "L2002003002", glName: "BANGALORE BRANCH - DA LIABILITY", parentCode: "L2002003", parentName: "BANGALORE BRANCH", amount: "220000.00" } },
      { lineNo: 3, head: "HRA", debit: { glCode: "X1002003003", glName: "BANGALORE BRANCH - HRA EXPENSE", parentCode: "X1002003", parentName: "BANGALORE BRANCH", amount: "180000.00" }, credit: { glCode: "L2002003003", glName: "BANGALORE BRANCH - HRA LIABILITY", parentCode: "L2002003", parentName: "BANGALORE BRANCH", amount: "180000.00" } },
      { lineNo: 4, head: "PF (12%)", debit: { glCode: "L2002003061", glName: "BANGALORE BRANCH - SALARY DEDUCTION CLEARING", parentCode: "L2002003", parentName: "BANGALORE BRANCH", amount: "74400.00" }, credit: { glCode: "L2002003056", glName: "BANGALORE BRANCH - PF PAYABLE - EMPLOYEE SHARE", parentCode: "L2002003", parentName: "BANGALORE BRANCH", amount: "74400.00" } },
      { lineNo: 5, head: "PT", debit: { glCode: "L2002003061", glName: "BANGALORE BRANCH - SALARY DEDUCTION CLEARING", parentCode: "L2002003", parentName: "BANGALORE BRANCH", amount: "5600.00" }, credit: { glCode: "L2002003058", glName: "BANGALORE BRANCH - PT PAYABLE - EMPLOYEE SHARE", parentCode: "L2002003", parentName: "BANGALORE BRANCH", amount: "5600.00" } },
      { lineNo: 6, head: "PF (13%)", debit: { glCode: "X1002003027", glName: "BANGALORE BRANCH - EMPLOYER PF EXPENSE", parentCode: "X1002003", parentName: "BANGALORE BRANCH", amount: "80600.00" }, credit: { glCode: "L2002003027", glName: "BANGALORE BRANCH - PF PAYABLE - EMPLOYER SHARE", parentCode: "L2002003", parentName: "BANGALORE BRANCH", amount: "80600.00" } },
      { lineNo: 7, head: "Gratuity (4.81%)", debit: { glCode: "X1002003034", glName: "BANGALORE BRANCH - EMPLOYER GRATUITY EXPENSE", parentCode: "X1002003", parentName: "BANGALORE BRANCH", amount: "29822.00" }, credit: { glCode: "L2002003034", glName: "BANGALORE BRANCH - GRATUITY PAYABLE", parentCode: "L2002003", parentName: "BANGALORE BRANCH", amount: "29822.00" } }
    ],
    totals: {
      totalDebit: "1210422.00",
      totalCredit: "1210422.00",
      difference: "0.00",
      isBalanced: true
    },
    zeroHeadsSkipped: 53
  },

  "JVF00/DEL/SITE-401/2610": {
    voucherNo: "JVF00/DEL/SITE-401/2610",
    voucherDate: "2026-10-31",
    voucherType: "Journal Voucher",
    status: "POSTED",
    branchName: "DELHI",
    branchNo: "009",
    site: {
      siteId: "SITE-401",
      siteName: "Connaught Place Office Hub"
    },
    payrollPeriod: "10-2026",
    employeeCount: 15,
    auditTrail: {
      lockedBy: "payroll_delhi_01",
      lockedAt: "2026-10-25T14:10:00+05:30",
      createdBy: "SYSTEM_AUTO_TRIGGER",
      createdAt: "2026-10-25T14:10:03+05:30"
    },
    entries: [
      { lineNo: 1, head: "Basic", debit: { glCode: "X1002009001", glName: "DELHI BRANCH - BASIC SALARY EXPENSE", parentCode: "X1002009", parentName: "DELHI BRANCH", amount: "350000.00" }, credit: { glCode: "L2002009001", glName: "DELHI BRANCH - BASIC SALARY LIABILITY", parentCode: "L2002009", parentName: "DELHI BRANCH", amount: "350000.00" } },
      { lineNo: 2, head: "DA", debit: { glCode: "X1002009002", glName: "DELHI BRANCH - DA EXPENSE", parentCode: "X1002009", parentName: "DELHI BRANCH", amount: "140000.00" }, credit: { glCode: "L2002009002", glName: "DELHI BRANCH - DA LIABILITY", parentCode: "L2002009", parentName: "DELHI BRANCH", amount: "140000.00" } },
      { lineNo: 3, head: "HRA", debit: { glCode: "X1002009003", glName: "DELHI BRANCH - HRA EXPENSE", parentCode: "X1002009", parentName: "DELHI BRANCH", amount: "105000.00" }, credit: { glCode: "L2002009003", glName: "DELHI BRANCH - HRA LIABILITY", parentCode: "L2002009", parentName: "DELHI BRANCH", amount: "105000.00" } },
      { lineNo: 4, head: "PF (12%)", debit: { glCode: "L2002009061", glName: "DELHI BRANCH - SALARY DEDUCTION CLEARING", parentCode: "L2002009", parentName: "DELHI BRANCH", amount: "42000.00" }, credit: { glCode: "L2002009056", glName: "DELHI BRANCH - PF PAYABLE - EMPLOYEE SHARE", parentCode: "L2002009", parentName: "DELHI BRANCH", amount: "42000.00" } },
      { lineNo: 5, head: "PF (13%)", debit: { glCode: "X1002009027", glName: "DELHI BRANCH - EMPLOYER PF EXPENSE", parentCode: "X1002009", parentName: "DELHI BRANCH", amount: "45500.00" }, credit: { glCode: "L2002009027", glName: "DELHI BRANCH - PF PAYABLE - EMPLOYER SHARE", parentCode: "L2002009", parentName: "DELHI BRANCH", amount: "45500.00" } },
      { lineNo: 6, head: "WC Policy", debit: { glCode: "X1002009046", glName: "DELHI BRANCH - EMPLOYER WC POLICY EXPENSE", parentCode: "X1002009", parentName: "DELHI BRANCH", amount: "3500.00" }, credit: { glCode: "L2002009046", glName: "DELHI BRANCH - WC POLICY PAYABLE", parentCode: "L2002009", parentName: "DELHI BRANCH", amount: "3500.00" } }
    ],
    totals: {
      totalDebit: "686000.00",
      totalCredit: "686000.00",
      difference: "0.00",
      isBalanced: true
    },
    zeroHeadsSkipped: 54
  },

  "JVF00/HYD/SITE-501/2610": {
    voucherNo: "JVF00/HYD/SITE-501/2610",
    voucherDate: "2026-10-31",
    voucherType: "Journal Voucher",
    status: "POSTED",
    branchName: "HYDERABAD",
    branchNo: "014",
    site: {
      siteId: "SITE-501",
      siteName: "HITEC City Towers"
    },
    payrollPeriod: "10-2026",
    employeeCount: 22,
    auditTrail: {
      lockedBy: "payroll_hyd_01",
      lockedAt: "2026-10-25T17:30:45+05:30",
      createdBy: "SYSTEM_AUTO_TRIGGER",
      createdAt: "2026-10-25T17:30:47+05:30"
    },
    entries: [
      { lineNo: 1, head: "Basic", debit: { glCode: "X1002014001", glName: "HYDERABAD BRANCH - BASIC SALARY EXPENSE", parentCode: "X1002014", parentName: "HYDERABAD BRANCH", amount: "480000.00" }, credit: { glCode: "L2002014001", glName: "HYDERABAD BRANCH - BASIC SALARY LIABILITY", parentCode: "L2002014", parentName: "HYDERABAD BRANCH", amount: "480000.00" } },
      { lineNo: 2, head: "DA", debit: { glCode: "X1002014002", glName: "HYDERABAD BRANCH - DA EXPENSE", parentCode: "X1002014", parentName: "HYDERABAD BRANCH", amount: "192000.00" }, credit: { glCode: "L2002014002", glName: "HYDERABAD BRANCH - DA LIABILITY", parentCode: "L2002014", parentName: "HYDERABAD BRANCH", amount: "192000.00" } },
      { lineNo: 3, head: "HRA", debit: { glCode: "X1002014003", glName: "HYDERABAD BRANCH - HRA EXPENSE", parentCode: "X1002014", parentName: "HYDERABAD BRANCH", amount: "144000.00" }, credit: { glCode: "L2002014003", glName: "HYDERABAD BRANCH - HRA LIABILITY", parentCode: "L2002014", parentName: "HYDERABAD BRANCH", amount: "144000.00" } },
      { lineNo: 4, head: "PF (12%)", debit: { glCode: "L2002014061", glName: "HYDERABAD BRANCH - SALARY DEDUCTION CLEARING", parentCode: "L2002014", parentName: "HYDERABAD BRANCH", amount: "57600.00" }, credit: { glCode: "L2002014056", glName: "HYDERABAD BRANCH - PF PAYABLE - EMPLOYEE SHARE", parentCode: "L2002014", parentName: "HYDERABAD BRANCH", amount: "57600.00" } },
      { lineNo: 5, head: "PT", debit: { glCode: "L2002014061", glName: "HYDERABAD BRANCH - SALARY DEDUCTION CLEARING", parentCode: "L2002014", parentName: "HYDERABAD BRANCH", amount: "4400.00" }, credit: { glCode: "L2002014058", glName: "HYDERABAD BRANCH - PT PAYABLE - EMPLOYEE SHARE", parentCode: "L2002014", parentName: "HYDERABAD BRANCH", amount: "4400.00" } },
      { lineNo: 6, head: "PF (13%)", debit: { glCode: "X1002014027", glName: "HYDERABAD BRANCH - EMPLOYER PF EXPENSE", parentCode: "X1002014", parentName: "HYDERABAD BRANCH", amount: "62400.00" }, credit: { glCode: "L2002014027", glName: "HYDERABAD BRANCH - PF PAYABLE - EMPLOYER SHARE", parentCode: "L2002014", parentName: "HYDERABAD BRANCH", amount: "62400.00" } },
      { lineNo: 7, head: "Gratuity (4.81%)", debit: { glCode: "X1002014034", glName: "HYDERABAD BRANCH - EMPLOYER GRATUITY EXPENSE", parentCode: "X1002014", parentName: "HYDERABAD BRANCH", amount: "23088.00" }, credit: { glCode: "L2002014034", glName: "HYDERABAD BRANCH - GRATUITY PAYABLE", parentCode: "L2002014", parentName: "HYDERABAD BRANCH", amount: "23088.00" } }
    ],
    totals: {
      totalDebit: "963488.00",
      totalCredit: "963488.00",
      difference: "0.00",
      isBalanced: true
    },
    zeroHeadsSkipped: 53
  },

  "JVF00/CHE/SITE-601/2610": {
    voucherNo: "JVF00/CHE/SITE-601/2610",
    voucherDate: "2026-10-31",
    voucherType: "Journal Voucher",
    status: "POSTED",
    branchName: "CHENNAI",
    branchNo: "006",
    site: {
      siteId: "SITE-601",
      siteName: "OMR IT Corridor Complex"
    },
    payrollPeriod: "10-2026",
    employeeCount: 16,
    auditTrail: {
      lockedBy: "payroll_che_01",
      lockedAt: "2026-10-25T18:15:20+05:30",
      createdBy: "SYSTEM_AUTO_TRIGGER",
      createdAt: "2026-10-25T18:15:22+05:30"
    },
    entries: [
      { lineNo: 1, head: "Basic", debit: { glCode: "X1002006001", glName: "CHENNAI BRANCH - BASIC SALARY EXPENSE", parentCode: "X1002006", parentName: "CHENNAI BRANCH", amount: "360000.00" }, credit: { glCode: "L2002006001", glName: "CHENNAI BRANCH - BASIC SALARY LIABILITY", parentCode: "L2002006", parentName: "CHENNAI BRANCH", amount: "360000.00" } },
      { lineNo: 2, head: "DA", debit: { glCode: "X1002006002", glName: "CHENNAI BRANCH - DA EXPENSE", parentCode: "X1002006", parentName: "CHENNAI BRANCH", amount: "144000.00" }, credit: { glCode: "L2002006002", glName: "CHENNAI BRANCH - DA LIABILITY", parentCode: "L2002006", parentName: "CHENNAI BRANCH", amount: "144000.00" } },
      { lineNo: 3, head: "HRA", debit: { glCode: "X1002006003", glName: "CHENNAI BRANCH - HRA EXPENSE", parentCode: "X1002006", parentName: "CHENNAI BRANCH", amount: "108000.00" }, credit: { glCode: "L2002006003", glName: "CHENNAI BRANCH - HRA LIABILITY", parentCode: "L2002006", parentName: "CHENNAI BRANCH", amount: "108000.00" } },
      { lineNo: 4, head: "PF (12%)", debit: { glCode: "L2002006061", glName: "CHENNAI BRANCH - SALARY DEDUCTION CLEARING", parentCode: "L2002006", parentName: "CHENNAI BRANCH", amount: "43200.00" }, credit: { glCode: "L2002006056", glName: "CHENNAI BRANCH - PF PAYABLE - EMPLOYEE SHARE", parentCode: "L2002006", parentName: "CHENNAI BRANCH", amount: "43200.00" } },
      { lineNo: 5, head: "PF (13%)", debit: { glCode: "X1002006027", glName: "CHENNAI BRANCH - EMPLOYER PF EXPENSE", parentCode: "X1002006", parentName: "CHENNAI BRANCH", amount: "46800.00" }, credit: { glCode: "L2002006027", glName: "CHENNAI BRANCH - PF PAYABLE - EMPLOYER SHARE", parentCode: "L2002006", parentName: "CHENNAI BRANCH", amount: "46800.00" } }
    ],
    totals: {
      totalDebit: "702000.00",
      totalCredit: "702000.00",
      difference: "0.00",
      isBalanced: true
    },
    zeroHeadsSkipped: 55
  },

  "JVF00/WB/SITE-701/2610": {
    voucherNo: "JVF00/WB/SITE-701/2610",
    voucherDate: "2026-10-31",
    voucherType: "Journal Voucher",
    status: "POSTED",
    branchName: "WEST BENGAL",
    branchNo: "027",
    site: {
      siteId: "SITE-701",
      siteName: "Salt Lake Sector V"
    },
    payrollPeriod: "10-2026",
    employeeCount: 19,
    auditTrail: {
      lockedBy: "payroll_wb_01",
      lockedAt: "2026-10-25T19:00:10+05:30",
      createdBy: "SYSTEM_AUTO_TRIGGER",
      createdAt: "2026-10-25T19:00:12+05:30"
    },
    entries: [
      { lineNo: 1, head: "Basic", debit: { glCode: "X1002027001", glName: "WEST BENGAL BRANCH - BASIC SALARY EXPENSE", parentCode: "X1002027", parentName: "WEST BENGAL BRANCH", amount: "410000.00" }, credit: { glCode: "L2002027001", glName: "WEST BENGAL BRANCH - BASIC SALARY LIABILITY", parentCode: "L2002027", parentName: "WEST BENGAL BRANCH", amount: "410000.00" } },
      { lineNo: 2, head: "DA", debit: { glCode: "X1002027002", glName: "WEST BENGAL BRANCH - DA EXPENSE", parentCode: "X1002027", parentName: "WEST BENGAL BRANCH", amount: "164000.00" }, credit: { glCode: "L2002027002", glName: "WEST BENGAL BRANCH - DA LIABILITY", parentCode: "L2002027", parentName: "WEST BENGAL BRANCH", amount: "164000.00" } },
      { lineNo: 3, head: "HRA", debit: { glCode: "X1002027003", glName: "WEST BENGAL BRANCH - HRA EXPENSE", parentCode: "X1002027", parentName: "WEST BENGAL BRANCH", amount: "123000.00" }, credit: { glCode: "L2002027003", glName: "WEST BENGAL BRANCH - HRA LIABILITY", parentCode: "L2002027", parentName: "WEST BENGAL BRANCH", amount: "123000.00" } },
      { lineNo: 4, head: "PF (12%)", debit: { glCode: "L2002027061", glName: "WEST BENGAL BRANCH - SALARY DEDUCTION CLEARING", parentCode: "L2002027", parentName: "WEST BENGAL BRANCH", amount: "49200.00" }, credit: { glCode: "L2002027056", glName: "WEST BENGAL BRANCH - PF PAYABLE - EMPLOYEE SHARE", parentCode: "L2002027", parentName: "WEST BENGAL BRANCH", amount: "49200.00" } },
      { lineNo: 5, head: "PT", debit: { glCode: "L2002027061", glName: "WEST BENGAL BRANCH - SALARY DEDUCTION CLEARING", parentCode: "L2002027", parentName: "WEST BENGAL BRANCH", amount: "3800.00" }, credit: { glCode: "L2002027058", glName: "WEST BENGAL BRANCH - PT PAYABLE - EMPLOYEE SHARE", parentCode: "L2002027", parentName: "WEST BENGAL BRANCH", amount: "3800.00" } },
      { lineNo: 6, head: "PF (13%)", debit: { glCode: "X1002027027", glName: "WEST BENGAL BRANCH - EMPLOYER PF EXPENSE", parentCode: "X1002027", parentName: "WEST BENGAL BRANCH", amount: "53300.00" }, credit: { glCode: "L2002027027", glName: "WEST BENGAL BRANCH - PF PAYABLE - EMPLOYER SHARE", parentCode: "L2002027", parentName: "WEST BENGAL BRANCH", amount: "53300.00" } }
    ],
    totals: {
      totalDebit: "803300.00",
      totalCredit: "803300.00",
      difference: "0.00",
      isBalanced: true
    },
    zeroHeadsSkipped: 54
  },

  "JVF00/GUJ/SITE-801/2610": {
    voucherNo: "JVF00/GUJ/SITE-801/2610",
    voucherDate: "2026-10-31",
    voucherType: "Journal Voucher",
    status: "POSTED",
    branchName: "GUJARAT",
    branchNo: "011",
    site: {
      siteId: "SITE-801",
      siteName: "GIFT City Tower One"
    },
    payrollPeriod: "10-2026",
    employeeCount: 25,
    auditTrail: {
      lockedBy: "payroll_guj_01",
      lockedAt: "2026-10-25T20:10:00+05:30",
      createdBy: "SYSTEM_AUTO_TRIGGER",
      createdAt: "2026-10-25T20:10:04+05:30"
    },
    entries: [
      { lineNo: 1, head: "Basic", debit: { glCode: "X1002011001", glName: "GUJARAT BRANCH - BASIC SALARY EXPENSE", parentCode: "X1002011", parentName: "GUJARAT BRANCH", amount: "550000.00" }, credit: { glCode: "L2002011001", glName: "GUJARAT BRANCH - BASIC SALARY LIABILITY", parentCode: "L2002011", parentName: "GUJARAT BRANCH", amount: "550000.00" } },
      { lineNo: 2, head: "DA", debit: { glCode: "X1002011002", glName: "GUJARAT BRANCH - DA EXPENSE", parentCode: "X1002011", parentName: "GUJARAT BRANCH", amount: "220000.00" }, credit: { glCode: "L2002011002", glName: "GUJARAT BRANCH - DA LIABILITY", parentCode: "L2002011", parentName: "GUJARAT BRANCH", amount: "220000.00" } },
      { lineNo: 3, head: "HRA", debit: { glCode: "X1002011003", glName: "GUJARAT BRANCH - HRA EXPENSE", parentCode: "X1002011", parentName: "GUJARAT BRANCH", amount: "165000.00" }, credit: { glCode: "L2002011003", glName: "GUJARAT BRANCH - HRA LIABILITY", parentCode: "L2002011", parentName: "GUJARAT BRANCH", amount: "165000.00" } },
      { lineNo: 4, head: "PF (12%)", debit: { glCode: "L2002011061", glName: "GUJARAT BRANCH - SALARY DEDUCTION CLEARING", parentCode: "L2002011", parentName: "GUJARAT BRANCH", amount: "66000.00" }, credit: { glCode: "L2002011056", glName: "GUJARAT BRANCH - PF PAYABLE - EMPLOYEE SHARE", parentCode: "L2002011", parentName: "GUJARAT BRANCH", amount: "66000.00" } },
      { lineNo: 5, head: "PT", debit: { glCode: "L2002011061", glName: "GUJARAT BRANCH - SALARY DEDUCTION CLEARING", parentCode: "L2002011", parentName: "GUJARAT BRANCH", amount: "5000.00" }, credit: { glCode: "L2002011058", glName: "GUJARAT BRANCH - PT PAYABLE - EMPLOYEE SHARE", parentCode: "L2002011", parentName: "GUJARAT BRANCH", amount: "5000.00" } },
      { lineNo: 6, head: "PF (13%)", debit: { glCode: "X1002011027", glName: "GUJARAT BRANCH - EMPLOYER PF EXPENSE", parentCode: "X1002011", parentName: "GUJARAT BRANCH", amount: "71500.00" }, credit: { glCode: "L2002011027", glName: "GUJARAT BRANCH - PF PAYABLE - EMPLOYER SHARE", parentCode: "L2002011", parentName: "GUJARAT BRANCH", amount: "71500.00" } }
    ],
    totals: {
      totalDebit: "1077500.00",
      totalCredit: "1077500.00",
      difference: "0.00",
      isBalanced: true
    },
    zeroHeadsSkipped: 54
  },

  "JVF00/HAR/SITE-901/2610": {
    voucherNo: "JVF00/HAR/SITE-901/2610",
    voucherDate: "2026-10-31",
    voucherType: "Journal Voucher",
    status: "POSTED",
    branchName: "HARYANA",
    branchNo: "012",
    site: {
      siteId: "SITE-901",
      siteName: "DLF Cyber City Building 10"
    },
    payrollPeriod: "10-2026",
    employeeCount: 30,
    auditTrail: {
      lockedBy: "payroll_har_01",
      lockedAt: "2026-10-25T21:00:00+05:30",
      createdBy: "SYSTEM_AUTO_TRIGGER",
      createdAt: "2026-10-25T21:00:03+05:30"
    },
    entries: [
      { lineNo: 1, head: "Basic", debit: { glCode: "X1002012001", glName: "HARYANA BRANCH - BASIC SALARY EXPENSE", parentCode: "X1002012", parentName: "HARYANA BRANCH", amount: "650000.00" }, credit: { glCode: "L2002012001", glName: "HARYANA BRANCH - BASIC SALARY LIABILITY", parentCode: "L2002012", parentName: "HARYANA BRANCH", amount: "650000.00" } },
      { lineNo: 2, head: "DA", debit: { glCode: "X1002012002", glName: "HARYANA BRANCH - DA EXPENSE", parentCode: "X1002012", parentName: "HARYANA BRANCH", amount: "260000.00" }, credit: { glCode: "L2002012002", glName: "HARYANA BRANCH - DA LIABILITY", parentCode: "L2002012", parentName: "HARYANA BRANCH", amount: "260000.00" } },
      { lineNo: 3, head: "HRA", debit: { glCode: "X1002012003", glName: "HARYANA BRANCH - HRA EXPENSE", parentCode: "X1002012", parentName: "HARYANA BRANCH", amount: "195000.00" }, credit: { glCode: "L2002012003", glName: "HARYANA BRANCH - HRA LIABILITY", parentCode: "L2002012", parentName: "HARYANA BRANCH", amount: "195000.00" } },
      { lineNo: 4, head: "PF (12%)", debit: { glCode: "L2002012061", glName: "HARYANA BRANCH - SALARY DEDUCTION CLEARING", parentCode: "L2002012", parentName: "HARYANA BRANCH", amount: "78000.00" }, credit: { glCode: "L2002012056", glName: "HARYANA BRANCH - PF PAYABLE - EMPLOYEE SHARE", parentCode: "L2002012", parentName: "HARYANA BRANCH", amount: "78000.00" } },
      { lineNo: 5, head: "PF (13%)", debit: { glCode: "X1002012027", glName: "HARYANA BRANCH - EMPLOYER PF EXPENSE", parentCode: "X1002012", parentName: "HARYANA BRANCH", amount: "84500.00" }, credit: { glCode: "L2002012027", glName: "HARYANA BRANCH - PF PAYABLE - EMPLOYER SHARE", parentCode: "L2002012", parentName: "HARYANA BRANCH", amount: "84500.00" } }
    ],
    totals: {
      totalDebit: "1267500.00",
      totalCredit: "1267500.00",
      difference: "0.00",
      isBalanced: true
    },
    zeroHeadsSkipped: 55
  }
};

// 10 Vouchers for the API 3 List View
export const MOCK_SALARY_VOUCHERS_LIST = [
  {
    voucherNo: "JVF00/MUM/SITE-101/2610",
    voucherDate: "2026-10-31",
    branchName: "MUMBAI",
    siteId: "SITE-101",
    siteName: "Powai IT Park - Building B",
    payrollPeriod: "10-2026",
    employeeCount: 20,
    totalAmount: "1134750.00",
    status: "POSTED",
    postedAt: "2026-10-23T20:15:02+05:30"
  },
  {
    voucherNo: "JVF00/MUM/SITE-102/2610",
    voucherDate: "2026-10-31",
    branchName: "MUMBAI",
    siteId: "SITE-102",
    siteName: "Worli Financial Hub",
    payrollPeriod: "10-2026",
    employeeCount: 18,
    totalAmount: "905000.00",
    status: "POSTED",
    postedAt: "2026-10-24T11:05:40+05:30"
  },
  {
    voucherNo: "JVF00/PUN/SITE-201/2610",
    voucherDate: "2026-10-31",
    branchName: "PUNE",
    siteId: "SITE-201",
    siteName: "Hinjawadi IT SEZ - Phase 1",
    payrollPeriod: "10-2026",
    employeeCount: 35,
    totalAmount: "1724575.00",
    status: "POSTED",
    postedAt: "2026-10-24T16:20:04+05:30"
  },
  {
    voucherNo: "JVF00/BLR/SITE-301/2610",
    voucherDate: "2026-10-31",
    branchName: "BANGALORE",
    siteId: "SITE-301",
    siteName: "Electronic City Campus",
    payrollPeriod: "10-2026",
    employeeCount: 28,
    totalAmount: "1210422.00",
    status: "POSTED",
    postedAt: "2026-10-25T09:40:15+05:30"
  },
  {
    voucherNo: "JVF00/DEL/SITE-401/2610",
    voucherDate: "2026-10-31",
    branchName: "DELHI",
    siteId: "SITE-401",
    siteName: "Connaught Place Office Hub",
    payrollPeriod: "10-2026",
    employeeCount: 15,
    totalAmount: "686000.00",
    status: "POSTED",
    postedAt: "2026-10-25T14:10:03+05:30"
  },
  {
    voucherNo: "JVF00/HYD/SITE-501/2610",
    voucherDate: "2026-10-31",
    branchName: "HYDERABAD",
    siteId: "SITE-501",
    siteName: "HITEC City Towers",
    payrollPeriod: "10-2026",
    employeeCount: 22,
    totalAmount: "963488.00",
    status: "POSTED",
    postedAt: "2026-10-25T17:30:47+05:30"
  },
  {
    voucherNo: "JVF00/CHE/SITE-601/2610",
    voucherDate: "2026-10-31",
    branchName: "CHENNAI",
    siteId: "SITE-601",
    siteName: "OMR IT Corridor Complex",
    payrollPeriod: "10-2026",
    employeeCount: 16,
    totalAmount: "702000.00",
    status: "POSTED",
    postedAt: "2026-10-25T18:15:22+05:30"
  },
  {
    voucherNo: "JVF00/WB/SITE-701/2610",
    voucherDate: "2026-10-31",
    branchName: "WEST BENGAL",
    siteId: "SITE-701",
    siteName: "Salt Lake Sector V",
    payrollPeriod: "10-2026",
    employeeCount: 19,
    totalAmount: "803300.00",
    status: "POSTED",
    postedAt: "2026-10-25T19:00:12+05:30"
  },
  {
    voucherNo: "JVF00/GUJ/SITE-801/2610",
    voucherDate: "2026-10-31",
    branchName: "GUJARAT",
    siteId: "SITE-801",
    siteName: "GIFT City Tower One",
    payrollPeriod: "10-2026",
    employeeCount: 25,
    totalAmount: "1077500.00",
    status: "POSTED",
    postedAt: "2026-10-25T20:10:04+05:30"
  },
  {
    voucherNo: "JVF00/HAR/SITE-901/2610",
    voucherDate: "2026-10-31",
    branchName: "HARYANA",
    siteId: "SITE-901",
    siteName: "DLF Cyber City Building 10",
    payrollPeriod: "10-2026",
    employeeCount: 30,
    totalAmount: "1267500.00",
    status: "POSTED",
    postedAt: "2026-10-25T21:00:03+05:30"
  }
];

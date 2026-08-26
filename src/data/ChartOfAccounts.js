// src/data/chartOfAccounts.js
// Central source of truth for Chart of Accounts

export const INITIAL_CHART_OF_ACCOUNTS = [
    { id: "1", code: "A", name: "ASSETS", type: "ROOT", parentAccount: null, parentCode: null },
    { id: "2", code: "L", name: "SOURCES OF FUNDS", type: "ROOT", parentAccount: null, parentCode: null },
    { id: "3", code: "R", name: "INCOME", type: "ROOT", parentAccount: null, parentCode: null },
    { id: "4", code: "X", name: "EXPENSES", type: "ROOT", parentAccount: null, parentCode: null },

    // ASSETS - Fixed Asset
    { code: "A1", name: "FIXED ASSET", type: "FOLDER", parentAccount: "ASSETS", parentCode: "A" },
    { code: "A1001", name: "FA COMPUTERS", type: "ACCOUNT", parentAccount: "FIXED ASSET", parentCode: "A1" },
    { code: "A1002", name: "FA FURNITURE & FIXTURES", type: "ACCOUNT", parentAccount: "FIXED ASSET", parentCode: "A1" },
    { code: "A1003", name: "FA MOTOR CARS", type: "ACCOUNT", parentAccount: "FIXED ASSET", parentCode: "A1" },
    { code: "A1004", name: "FA SOFTWARES", type: "ACCOUNT", parentAccount: "FIXED ASSET", parentCode: "A1" },
    { code: "A1005", name: "FA OFFICE EQUIPMENTS", type: "ACCOUNT", parentAccount: "FIXED ASSET", parentCode: "A1" },
    { code: "A1006", name: "FA BUILDING & PREMISES", type: "ACCOUNT", parentAccount: "FIXED ASSET", parentCode: "A1" },
    { code: "A1007", name: "FA MACHINERIES", type: "ACCOUNT", parentAccount: "FIXED ASSET", parentCode: "A1" },
    { code: "A1008", name: "ACCUM DEPRICIATION", type: "ACCOUNT", parentAccount: "FIXED ASSET", parentCode: "A1" },

    // ASSETS - Current Assets
    { code: "A3", name: "CURRENT ASSETS", type: "FOLDER", parentAccount: "ASSETS", parentCode: "A" },

    // Loans & Advances
    { code: "A3001", name: "LOANS & ADVANCES (ASSETS)", type: "SUB_FOLDER", parentAccount: "CURRENT ASSETS", parentCode: "A3" },
    { code: "A3001001", name: "EMPLOYEE ADVANCE", type: "SUB_SUB_FOLDER", parentAccount: "LOANS & ADVANCES (ASSETS)", parentCode: "A3001" },

    // Cash and Bank Balances
    { code: "A3004", name: "CASH AND BANK BALANCES", type: "SUB_FOLDER", parentAccount: "ASSETS", parentCode: "A" },
    { code: "A3004001", name: "BANK ACCOUNTS", type: "SUB_SUB_FOLDER", parentAccount: "CASH AND BANK BALANCES", parentCode: "A3004" },
    { code: "A3004001001", name: "HDFC Bank", type: "ACCOUNT", parentAccount: "BANK ACCOUNTS", parentCode: "A3004001" },
    { code: "A3004001002", name: "Punjab Bank", type: "ACCOUNT", parentAccount: "BANK ACCOUNTS", parentCode: "A3004001" },

    // Duties & Taxes
    { code: "A3007", name: "DUTIES & TAXES (ASSETS)", type: "SUB_FOLDER", parentAccount: "CURRENT ASSETS", parentCode: "A3" },
    { code: "A3007001", name: "GST Input", type: "SUB_SUB_FOLDER", parentAccount: "DUTIES & TAXES (ASSETS)", parentCode: "A3007" },
    { code: "A3007001001", name: "CGST INPUT", type: "ACCOUNT", parentAccount: "GST Input", parentCode: "A3007001" },
    { code: "A3007001002", name: "SGST INPUT", type: "ACCOUNT", parentAccount: "GST Input", parentCode: "A3007001" },

    // Prepaid Expense
    { code: "A3005", name: "PREPAID EXPENSE", type: "SUB_FOLDER", parentAccount: "CURRENT ASSETS", parentCode: "A3" },
    { code: "A3005001", name: "UNIFORM EXPENSE", type: "ACCOUNT", parentAccount: "PREPAID EXPENSE", parentCode: "A3005" },

    // LIABILITIES
    { code: "L1", name: "SHARE CAPITAL", type: "FOLDER", parentAccount: "SOURCES OF FUNDS", parentCode: "L" },
    { code: "L2", name: "CURRENT LIABILITIES", type: "FOLDER", parentAccount: "SOURCES OF FUNDS", parentCode: "L" },

    // Employee Liabilities
    { code: "L2001", name: "LIABILITY-EMPLOYEES", type: "SUB_FOLDER", parentAccount: "CURRENT LIABILITIES", parentCode: "L2" },
    { code: "L200101", name: "CONVEYANCE PAYABLE", type: "ACCOUNT", parentAccount: "LIABILITY-EMPLOYEES", parentCode: "L2001" },
    { id: "AUTO_1763965560748_L2001001", code: "L2001001", name: "CONVEYANCE PAYABLE", type: "ACCOUNT", parentAccount: "LIABILITY-EMPLOYEES", parentCode: "L2001" },
    { code: "L2001002", name: "EMPLOYEE RELIEVER ACCOUNT", type: "ACCOUNT", parentAccount: "LIABILITY-EMPLOYEES", parentCode: "L2001" },

    // Sundry Creditors
    { code: "L2005", name: "SUNDRY CREDITORS", type: "FOLDER", parentAccount: "SOURCES OF FUNDS", parentCode: "L" },

    // Statutory Liabilities - GST
    { code: "L3", name: "STATUTORY LIABILITIES", type: "FOLDER", parentAccount: "SOURCES OF FUNDS", parentCode: "L" },
    { code: "L3001", name: "CGST PAYABLE", type: "ACCOUNT", parentAccount: "STATUTORY LIABILITIES", parentCode: "L3" },
    { code: "L3002", name: "SGST PAYABLE", type: "ACCOUNT", parentAccount: "STATUTORY LIABILITIES", parentCode: "L3" },
    { code: "L3003", name: "IGST PAYABLE", type: "ACCOUNT", parentAccount: "STATUTORY LIABILITIES", parentCode: "L3" },
    { code: "L3004", name: "SERVICE TAX PAYABLE", type: "ACCOUNT", parentAccount: "STATUTORY LIABILITIES", parentCode: "L3" },

    // EXPENSES - Direct
    { code: "X1", name: "EXPENSE DIRECT", type: "FOLDER", parentAccount: "EXPENSES", parentCode: "X" },
    { code: "X1001", name: "DIRECT PRODUCTION COST", type: "SUB_FOLDER", parentAccount: "EXPENSE DIRECT", parentCode: "X1" },

    // Wage Cost
    { code: "X1001001", name: "TOTAL WAGE COST", type: "SUB_SUB_FOLDER", parentAccount: "DIRECT PRODUCTION COST", parentCode: "X1001" },
    { code: "X1001001002", name: "SUB CONTRACTORS", type: "ACCOUNT_SUBCATEGORY", parentAccount: "TOTAL WAGE COST", parentCode: "X1001001" },
    { code: "X1001001003", name: "RELIEVER PAYMENTS", type: "ACCOUNT", parentAccount: "SUB CONTRACTORS", parentCode: "X1001001002" },
    { code: "X2002002001", name: "RELIEVER PAYMENTS", type: "ACCOUNT", parentAccount: "SUB CONTRACTORS", parentCode: "X2002002" },

    // Other Production Cost
    { code: "X1001002", name: "OTHER PRODUCTION COST", type: "SUB_SUB_FOLDER", parentAccount: "DIRECT PRODUCTION COST", parentCode: "X1001" },
    { code: "X1001002001", name: "TRAVEL", type: "ACCOUNT", parentAccount: "OTHER PRODUCTION COST", parentCode: "X1001002" },
    { code: "X1001002002", name: "HOTEL ACCOMODATION", type: "ACCOUNT", parentAccount: "OTHER PRODUCTION COST", parentCode: "X1001002" },
    { code: "X1001002003", name: "PARKING CHARGES", type: "ACCOUNT", parentAccount: "OTHER PRODUCTION COST", parentCode: "X1001002" },

    // Food Cost
    { code: "X1001003", name: "FOOD COST", type: "SUB_SUB_FOLDER", parentAccount: "DIRECT PRODUCTION COST", parentCode: "X1001" },
    { code: "X1001003001", name: "FOOD & REFRESHMENT", type: "ACCOUNT", parentAccount: "FOOD COST", parentCode: "X1001003" },

    // Materials
    { code: "X1001004", name: "MATERIALS FOR PRODUCTION", type: "SUB_SUB_FOLDER", parentAccount: "DIRECT PRODUCTION COST", parentCode: "X1001" },
    { code: "X1001004001", name: "HK MATERIALS", type: "ACCOUNT", parentAccount: "MATERIALS FOR PRODUCTION", parentCode: "X1001004" },

    // EXPENSES - Indirect
    { code: "X2", name: "EXPENSES INDIRECT", type: "FOLDER", parentAccount: "EXPENSES", parentCode: "X" },

    // Branch Management
    { code: "X2001", name: "BRANCH MANAGEMENT", type: "SUB_FOLDER", parentAccount: "EXPENSES INDIRECT", parentCode: "X2" },
    { code: "X2001001", name: "BRANCH MANAGEMENT SALARY COST", type: "SUB_FOLDER", parentAccount: "BRANCH MANAGEMENT", parentCode: "X2001" },
    { code: "X2001002", name: "OTHER BRANCH EXPENSES", type: "SUB_FOLDER", parentAccount: "BRANCH MANAGEMENT", parentCode: "X2001" },
    { code: "X2001002001", name: "OFFICE SUPPLIES", type: "ACCOUNT", parentAccount: "OTHER BRANCH EXPENSES", parentCode: "X2001002" },
    { code: "X2001002002", name: "BRANCH OFFICE RENT", type: "ACCOUNT", parentAccount: "OTHER BRANCH EXPENSES", parentCode: "X2001002" },
    { code: "X2001003", name: "Branch conveyance expense", type: "ACCOUNT", parentAccount: "BRANCH MANAGEMENT", parentCode: "X2001" },
    { code: "X2001004", name: "UNIFORM EXPENSE", type: "ACCOUNT", parentAccount: "BRANCH MANAGEMENT", parentCode: "X2001" },

    // Corporate Expenses
    { code: "X2002", name: "CORPORATE EXPENSES", type: "SUB_FOLDER", parentAccount: "EXPENSES INDIRECT", parentCode: "X2" },
    { code: "X2002001", name: "CORPORATE SALARY COST", type: "SUB_SUB_FOLDER", parentAccount: "CORPORATE EXPENSES", parentCode: "X2002" },
    { code: "X2002002", name: "CORPORATE OTHER COST", type: "SUB_SUB_FOLDER", parentAccount: "CORPORATE EXPENSES", parentCode: "X2002" },
    { code: "X2002002001", name: "RELIEVER PAYMENTS", type: "ACCOUNT", parentAccount: "CORPORATE OTHER COST", parentCode: "X2002002" },
]

// Revenue / Income - add Round Off under Indirect Income
INITIAL_CHART_OF_ACCOUNTS.push(
    // Direct Income - Revenue from Operations
    { code: "R1", name: "DIRECT INCOME", type: "FOLDER", parentAccount: "INCOME", parentCode: "R" },
    { code: "R1001", name: "REVENUE FROM OPERATIONS", type: "SUB_FOLDER", parentAccount: "DIRECT INCOME", parentCode: "R1" },

    // Revenue Ledgers
    { code: "R1001001", name: "HOUSE KEEPING CHARGES", type: "ACCOUNT", parentAccount: "REVENUE FROM OPERATIONS", parentCode: "R1001" },
    { code: "R1001002", name: "HOUSE KEEPING CHARGES (EXEMPT)", type: "ACCOUNT", parentAccount: "REVENUE FROM OPERATIONS", parentCode: "R1001" },
    { code: "R1001003", name: "SERVICE CHARGES", type: "ACCOUNT", parentAccount: "REVENUE FROM OPERATIONS", parentCode: "R1001" },
    { code: "R1001004", name: "OVERSEAS CONSULTANCY SERVICE FEES (EXPORT)", type: "ACCOUNT", parentAccount: "REVENUE FROM OPERATIONS", parentCode: "R1001" },
    { code: "R1001005001", name: "HK MATERIAL", type: "ACCOUNT", parentAccount: "REVENUE FROM OPERATIONS", parentCode: "R1001" },
    { code: "R1001005002", name: "CLEANING CONSUMABLE", type: "ACCOUNT", parentAccount: "REVENUE FROM OPERATIONS", parentCode: "R1001" },
    { code: "R1001007", name: "DEEP CLEANING CHARGES", type: "ACCOUNT", parentAccount: "REVENUE FROM OPERATIONS", parentCode: "R1001" },
    { code: "R1001008", name: "RENT ON MACHINERY", type: "ACCOUNT", parentAccount: "REVENUE FROM OPERATIONS", parentCode: "R1001" },
    { code: "R1001009", name: "MANPOWER SERVICES", type: "ACCOUNT", parentAccount: "REVENUE FROM OPERATIONS", parentCode: "R1001" },
    { code: "R1001010", name: "PEST CONTROL CHARGES", type: "ACCOUNT", parentAccount: "REVENUE FROM OPERATIONS", parentCode: "R1001" },

    // Indirect Income
    { code: "R2", name: "INDIRECT INCOME", type: "FOLDER", parentAccount: "INCOME", parentCode: "R" },
    { code: "R2001", name: "OTHER INCOME", type: "SUB_FOLDER", parentAccount: "INDIRECT INCOME", parentCode: "R2" },
    { code: "R2001001", name: "ROUND OFF", type: "ACCOUNT", parentAccount: "OTHER INCOME", parentCode: "R2001" }
)
/* eslint-disable no-unused-vars */
// SalaryLedgerService.js - Comprehensive Ledger Service for Salary-related Accounts
// Production-Ready Service for displaying real transaction entries in ledgers

export class SalaryLedgerService {
    /**
     * GL Code Configuration - All Salary-Related Ledgers
     */
    static LEDGER_CONFIG = {
        // EXPENSE ACCOUNTS
        X2001001001: {
            name: 'Salaries & Wages',
            type: 'Expense',
            category: 'Personnel Expenses',
            subcategory: 'Direct Salaries',
            normalBalance: 'DR',
        },
        X2001001002: {
            name: 'Employer PF Contribution',
            type: 'Expense',
            category: 'Personnel Expenses',
            subcategory: 'Statutory Benefits',
            normalBalance: 'DR',
        },
        X2001001003: {
            name: 'Employer ESIC Contribution',
            type: 'Expense',
            category: 'Personnel Expenses',
            subcategory: 'Statutory Benefits',
            normalBalance: 'DR',
        },
        X2001001005: {
            name: 'Leave Wages',
            type: 'Expense',
            category: 'Personnel Expenses',
            subcategory: 'Employee Benefits',
            normalBalance: 'DR',
        },
        X2001001007: {
            name: 'Bonus',
            type: 'Expense',
            category: 'Personnel Expenses',
            subcategory: 'Employee Benefits',
            normalBalance: 'DR',
        },

        // LIABILITY ACCOUNTS
        L2002001: {
            name: 'SALARY PAYABLE',
            type: 'Current Liability',
            category: 'Employee Payables',
            subcategory: 'Salary Provisions',
            normalBalance: 'CR',
        },
        L2002002: {
            name: 'Employer PF Payable',
            type: 'Current Liability',
            category: 'Statutory Liabilities',
            subcategory: 'PF Contributions',
            normalBalance: 'CR',
        },
        L2002003: {
            name: 'Employer ESIC Payable',
            type: 'Current Liability',
            category: 'Statutory Liabilities',
            subcategory: 'ESIC Contributions',
            normalBalance: 'CR',
        },
        L2002006: {
            name: 'Employee PF Payable',
            type: 'Current Liability',
            category: 'Statutory Liabilities',
            subcategory: 'PF Deductions',
            normalBalance: 'CR',
        },
        L2002007: {
            name: 'Employee ESIC Payable',
            type: 'Current Liability',
            category: 'Statutory Liabilities',
            subcategory: 'ESIC Deductions',
            normalBalance: 'CR',
        },
        L2002009: {
            name: 'Professional Tax Payable',
            type: 'Current Liability',
            category: 'Statutory Liabilities',
            subcategory: 'PT Deductions',
            normalBalance: 'CR',
        },
        L2002010: {
            name: 'Staff Welfare Fund Payable',
            type: 'Current Liability',
            category: 'Employee Payables',
            subcategory: 'Welfare Deductions',
            normalBalance: 'CR',
        },
        L2002011: {
            name: 'TDS Payable',
            type: 'Current Liability',
            category: 'Statutory Liabilities',
            subcategory: 'TDS Deductions',
            normalBalance: 'CR',
        },
        L2002012: {
            name: 'Other Deductions Payable',
            type: 'Current Liability',
            category: 'Employee Payables',
            subcategory: 'Other Deductions',
            normalBalance: 'CR',
        },
    }

    /**
     * Get ledger account details
     * @param {string} glCode - GL Code
     * @returns {Object} - Ledger details
     */
    static getLedgerDetails(glCode) {
        try {
            const config = this.LEDGER_CONFIG[glCode]
            if (!config) {
                console.warn(`⚠️ Unknown GL Code: ${glCode}`)
                return null
            }

            const chartOfAccounts = JSON.parse(localStorage.getItem('chartOfAccounts')) || []
            const ledgerAccount = chartOfAccounts.find((acc) => acc.code === glCode)

            return {
                glAccountCode: glCode,
                accountName: ledgerAccount?.name || config.name,
                accountType: config.type,
                category: config.category,
                subcategory: config.subcategory,
                normalBalance: config.normalBalance,
                financialYear: this.getCurrentFinancialYear(),
            }
        } catch (error) {
            console.error('❌ Error getting ledger details:', error)
            return null
        }
    }

    /**
     * Get all transactions for a specific ledger
     * @param {string} glCode - GL Code
     * @returns {Array} - Array of ledger entries
     */
    static getLedgerTransactions(glCode) {
        try {
            const transactions = JSON.parse(localStorage.getItem('transactions')) || []
            const chartOfAccounts = JSON.parse(localStorage.getItem('chartOfAccounts')) || []

            console.log(`💰 Loading transactions for: ${glCode}`)
            console.log(`📋 Total transactions in system: ${transactions.length}`)

            // Filter transactions that involve this ledger
            const ledgerTransactions = transactions.filter((txn) => {
                if (!txn.entries || !Array.isArray(txn.entries)) {
                    console.warn('⚠️ Transaction missing entries array:', txn.id)
                    return false
                }
                return txn.entries.some((entry) => entry.glCode === glCode)
            })

            console.log(`✅ Found ${ledgerTransactions.length} transactions for ${glCode}`)

            // Convert to ledger format
            const ledgerEntries = []
            const config = this.LEDGER_CONFIG[glCode]
            const isExpense = config?.type === 'Expense'
            const isLiability = config?.type === 'Current Liability'

            let runningBalance = 0 // Opening balance

            // Sort transactions by date
            ledgerTransactions.sort((a, b) => new Date(a.date) - new Date(b.date))

            ledgerTransactions.forEach((txn) => {
                const ledgerEntry = txn.entries.find((entry) => entry.glCode === glCode)
                if (!ledgerEntry) return

                const debit = ledgerEntry.debit || 0
                const credit = ledgerEntry.credit || 0

                // Calculate running balance based on account type
                if (isExpense) {
                    // For expense accounts: Debit increases, Credit decreases
                    runningBalance += debit - credit
                } else if (isLiability) {
                    // For liability accounts: Credit increases, Debit decreases
                    runningBalance += credit - debit
                }

                const balanceType = runningBalance >= 0 ? config.normalBalance : (config.normalBalance === 'DR' ? 'CR' : 'DR')

                // Get counterparty info (other accounts in the transaction)
                const counterparties = txn.entries
                    .filter((e) => e.glCode !== glCode)
                    .map((e) => e.accountName || e.glName || e.glCode)
                    .join(', ')

                // Determine entry type
                const entryType = this.getEntryType(txn, ledgerEntry, isExpense, isLiability)

                ledgerEntries.push({
                    id: txn.id || `TXN-${ledgerEntries.length + 1}`,
                    srNo: ledgerEntries.length + 1,
                    date: this.formatDate(txn.date),
                    voucherType: txn.voucherType || 'Journal Voucher',
                    voucherNo: txn.voucherNo || '-',
                    batchId: txn.batchId || '-',
                    payrollPeriod: txn.payrollPeriod || '-',
                    employeeCount: txn.employeeCount || '-',
                    transactionType: txn.transactionType || 'General Entry',
                    costCenter: ledgerEntry.costCenter || 'HEAD OFFICE',
                    department: ledgerEntry.department || 'Payroll',
                    referenceDoc: txn.batchId || txn.id,
                    referenceDocNo: txn.batchId || txn.id,
                    narration: ledgerEntry.narration || txn.narration || 'Transaction Entry',
                    particulars: counterparties || 'Various Accounts',
                    status: txn.status || 'Posted',
                    postedBy: txn.approvedBy || txn.createdBy || 'System',
                    postedDate: this.formatDate(txn.postedDate || txn.date),
                    debit: debit > 0 ? debit : 0,
                    debitFormatted: debit > 0 ? this.formatAmount(debit) : '-',
                    credit: credit > 0 ? credit : 0,
                    creditFormatted: credit > 0 ? this.formatAmount(credit) : '-',
                    runningBalance: Math.abs(runningBalance),
                    runningBalanceFormatted: this.formatAmount(Math.abs(runningBalance)) + ' ' + balanceType,
                    balance: Math.abs(runningBalance),
                    balanceFormatted: this.formatAmount(Math.abs(runningBalance)) + ' ' + balanceType,
                    balanceType: balanceType,
                    entryType: entryType,
                    category: ledgerEntry.category || config?.category || '',
                    rowClass: this.getRowClass(entryType, isExpense, isLiability),
                })
            })

            // Add opening balance as first entry
            if (ledgerEntries.length > 0) {
                ledgerEntries.unshift(this.createOpeningBalance(config))
                // Renumber entries
                ledgerEntries.forEach((entry, index) => {
                    entry.srNo = index
                })
            }

            return ledgerEntries
        } catch (error) {
            console.error('❌ Error getting ledger transactions:', error)
            return []
        }
    }

    /**
     * Get ledger summary statistics
     * @param {Array} transactions - Ledger transactions
     * @param {string} glCode - GL Code
     * @returns {Object} - Summary statistics
     */
    static getLedgerSummary(transactions, glCode) {
        if (!transactions || transactions.length === 0) {
            return {
                openingBalance: 0,
                totalDebit: 0,
                totalCredit: 0,
                closingBalance: 0,
                transactionCount: 0,
                balanceType: this.LEDGER_CONFIG[glCode]?.normalBalance || 'DR',
            }
        }

        // Exclude opening balance from calculations
        const actualTransactions = transactions.filter((t) => t.entryType !== 'opening')

        const totalDebit = actualTransactions.reduce((sum, t) => sum + (t.debit || 0), 0)
        const totalCredit = actualTransactions.reduce((sum, t) => sum + (t.credit || 0), 0)

        const lastEntry = transactions[transactions.length - 1]
        const closingBalance = lastEntry?.balance || 0
        const balanceType = lastEntry?.balanceType || this.LEDGER_CONFIG[glCode]?.normalBalance || 'DR'

        return {
            openingBalance: 0,
            totalDebit: totalDebit,
            totalCredit: totalCredit,
            closingBalance: closingBalance,
            transactionCount: actualTransactions.length,
            balanceType: balanceType,
            openingBalanceFormatted: '0.00',
            totalDebitFormatted: this.formatAmount(totalDebit),
            totalCreditFormatted: this.formatAmount(totalCredit),
            closingBalanceFormatted: this.formatAmount(closingBalance) + ' ' + balanceType,
        }
    }

    /**
     * Get all salary-related ledgers with their current balances
     * @returns {Array} - Array of ledger summaries
     */
    static getAllSalaryLedgers() {
        const ledgers = []

        Object.keys(this.LEDGER_CONFIG).forEach((glCode) => {
            const config = this.LEDGER_CONFIG[glCode]
            const transactions = this.getLedgerTransactions(glCode)
            const summary = this.getLedgerSummary(transactions, glCode)

            ledgers.push({
                glCode: glCode,
                accountName: config.name,
                accountType: config.type,
                category: config.category,
                subcategory: config.subcategory,
                normalBalance: config.normalBalance,
                currentBalance: summary.closingBalance,
                currentBalanceFormatted: summary.closingBalanceFormatted,
                transactionCount: summary.transactionCount,
                totalDebit: summary.totalDebit,
                totalCredit: summary.totalCredit,
            })
        })

        // Sort by type and then by GL Code
        return ledgers.sort((a, b) => {
            if (a.accountType !== b.accountType) {
                return a.accountType.localeCompare(b.accountType)
            }
            return a.glCode.localeCompare(b.glCode)
        })
    }

    // ==========================================
    // HELPER FUNCTIONS
    // ==========================================

    /**
     * Determine entry type for display
     */
    static getEntryType(txn, entry, isExpense, isLiability) {
        const debit = entry.debit || 0
        const credit = entry.credit || 0

        if (txn.transactionType === 'Salary Payment') {
            if (isExpense && debit > 0) return 'expense-booking'
            if (isLiability && credit > 0) return 'provision'
            if (isLiability && debit > 0) return 'payment'
        }

        if (debit > 0) return isExpense ? 'expense' : 'payment'
        if (credit > 0) return isLiability ? 'liability' : 'reversal'

        return 'general'
    }

    /**
     * Get row class for styling
     */
    static getRowClass(entryType, isExpense, isLiability) {
        const classes = {
            'expense-booking': 'bg-red-50',
            provision: 'bg-yellow-50',
            payment: 'bg-green-50',
            expense: 'bg-red-50',
            liability: 'bg-yellow-50',
            reversal: 'bg-blue-50',
            opening: 'bg-gray-50',
            general: 'bg-white',
        }
        return classes[entryType] || 'bg-white'
    }

    /**
     * Create opening balance entry
     */
    static createOpeningBalance(config) {
        return {
            id: 'OB-2024',
            srNo: 0,
            date: '01-Apr-24',
            voucherType: 'Opening Balance',
            voucherNo: 'OB-2024',
            batchId: '-',
            payrollPeriod: '-',
            employeeCount: '-',
            transactionType: 'Opening Balance',
            costCenter: 'HEAD OFFICE',
            department: '-',
            referenceDoc: '-',
            referenceDocNo: '-',
            narration: `Opening Balance B/F FY ${this.getCurrentFinancialYear()}`,
            particulars: 'Balance B/F',
            status: 'Posted',
            postedBy: 'System',
            postedDate: '01-Apr-24',
            debit: 0,
            debitFormatted: '-',
            credit: 0,
            creditFormatted: '-',
            runningBalance: 0,
            runningBalanceFormatted: '0.00 ' + config.normalBalance,
            balance: 0,
            balanceFormatted: '0.00 ' + config.normalBalance,
            balanceType: config.normalBalance,
            entryType: 'opening',
            category: 'Opening Balance',
            rowClass: 'bg-gray-100 font-semibold',
        }
    }

    /**
     * Format date to DD-MMM-YY
     */
    static formatDate(dateString) {
        if (!dateString) return '-'
        try {
            const date = new Date(dateString)
            const day = date.getDate().toString().padStart(2, '0')
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            const month = months[date.getMonth()]
            const year = date.getFullYear().toString().slice(-2)
            return `${day}-${month}-${year}`
        } catch (error) {
            return dateString
        }
    }

    /**
     * Format amount with Indian numbering system
     */
    static formatAmount(amount) {
        if (amount === null || amount === undefined) return '0.00'
        return parseFloat(amount).toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })
    }

    /**
     * Get current financial year
     */
    static getCurrentFinancialYear() {
        const today = new Date()
        const currentYear = today.getFullYear()
        const currentMonth = today.getMonth() + 1 // 1-12

        if (currentMonth >= 4) {
            // April or later
            return `${currentYear}-${(currentYear + 1).toString().slice(-2)}`
        } else {
            // January to March
            return `${currentYear - 1}-${currentYear.toString().slice(-2)}`
        }
    }

    /**
     * Export ledger to Excel format
     * @param {string} glCode - GL Code
     * @param {Array} transactions - Ledger transactions
     * @returns {Object} - Excel data structure
     */
    static exportLedgerToExcel(glCode, transactions) {
        const config = this.LEDGER_CONFIG[glCode]
        const summary = this.getLedgerSummary(transactions, glCode)

        const excelData = transactions.map((t) => ({
            'Sr No': t.srNo,
            Date: t.date,
            'Voucher Type': t.voucherType,
            'Voucher No': t.voucherNo,
            'Batch ID': t.batchId,
            'Payroll Period': t.payrollPeriod,
            Particulars: t.particulars,
            Narration: t.narration,
            'Debit (₹)': t.debitFormatted,
            'Credit (₹)': t.creditFormatted,
            'Balance (₹)': t.balanceFormatted,
            Status: t.status,
            'Posted By': t.postedBy,
        }))

        return {
            sheetName: `${config.name}_Ledger`,
            data: excelData,
            summary: {
                accountName: config.name,
                glCode: glCode,
                financialYear: this.getCurrentFinancialYear(),
                openingBalance: summary.openingBalanceFormatted,
                totalDebit: summary.totalDebitFormatted,
                totalCredit: summary.totalCreditFormatted,
                closingBalance: summary.closingBalanceFormatted,
                transactionCount: summary.transactionCount,
            },
        }
    }
}

export default SalaryLedgerService

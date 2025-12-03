/* eslint-disable no-unused-vars */
// src/services/UnifiedFeesService.js

export class UnifiedFeesService {
    /**
     * Get unified ledger entries for Professional Fees (X2002002002) and Other Fees (X2002002003)
     */
    static getUnifiedFeesLedger(accountCode, filters = {}) {
        try {
            const transactions = JSON.parse(localStorage.getItem('transactions')) || [];

            console.log(`📊 Unified Fees Ledger for: ${accountCode}`);

            // Determine which GL codes to search for
            let searchCodes = [accountCode];

            // If it's Professional Fees, also search Other Fees
            if (accountCode === 'X2002002002') {
                searchCodes = ['X2002002002', 'X2002002003', 'INDIRECT EXPENSE'];
            }
            // If it's Other Fees, also search Professional Fees
            else if (accountCode === 'X2002002003') {
                searchCodes = ['X2002002003', 'X2002002002', 'INDIRECT EXPENSE'];
            }

            console.log('🔍 Searching GL codes:', searchCodes);

            // Filter transactions for these GL codes
            const feeTransactions = transactions.filter(txn =>
                txn.entries?.some(entry =>
                    searchCodes.includes(entry.glCode) ||
                    (entry.glName && searchCodes.some(code =>
                        entry.glName.toUpperCase().includes(code.toUpperCase())
                    ))
                )
            );

            console.log(`✅ Found ${feeTransactions.length} fee transactions`);

            if (feeTransactions.length === 0) {
                return { ledgerEntries: [], summary: null };
            }

            // Process transactions
            const ledgerEntries = [];
            let runningBalance = 0;
            let openingBalance = 0;

            // Sort by date
            feeTransactions.sort((a, b) => new Date(a.date) - new Date(b.date));

            feeTransactions.forEach(txn => {
                // Find the fee entry
                const feeEntry = txn.entries.find(entry =>
                    searchCodes.includes(entry.glCode) ||
                    (entry.glName && searchCodes.some(code =>
                        entry.glName.toUpperCase().includes(code.toUpperCase())
                    ))
                );

                if (!feeEntry) return;

                const debit = feeEntry.debit || 0;
                const credit = feeEntry.credit || 0;
                const amount = Math.max(debit, credit);

                // For expense accounts, debit increases balance
                runningBalance += debit - credit;
                const balanceType = runningBalance >= 0 ? 'Dr' : 'Cr';

                // Find vendor entry
                const vendorEntry = txn.entries.find(entry =>
                    entry.glCode?.startsWith('L2005_')
                );

                // Find TDS entry
                const tdsEntry = txn.entries.find(entry =>
                    entry.glCode === 'L2003001'
                );

                // Get invoice details
                const relatedInvoice = this.getInvoiceByTransaction(txn);

                // Apply date filters
                if (filters.fromDate && new Date(txn.date) < new Date(filters.fromDate)) {
                    return;
                }
                if (filters.toDate && new Date(txn.date) > new Date(filters.toDate)) {
                    return;
                }

                // Determine expense type
                const expenseType = this.getExpenseType(feeEntry.glName, feeEntry.glCode);

                ledgerEntries.push({
                    date: this.formatDate(txn.date),
                    voucherNo: txn.voucherNo,
                    voucherType: txn.voucherType || 'Purchase Voucher',
                    invoiceNo: txn.invoiceNumber || relatedInvoice?.invoiceNumber || '-',
                    transactionType: debit > 0 ? 'Expense' : 'Credit',
                    entryType: debit > 0 ? 'Debit' : 'Credit',
                    debit: debit,
                    credit: credit,
                    amount: amount,
                    balance: Math.abs(runningBalance),
                    balanceType: balanceType,
                    runningBalance: runningBalance,
                    narration: feeEntry.narration || txn.narration || '',
                    party: vendorEntry?.glName?.replace('VENDOR - ', '') || 'Unknown',
                    partyGL: vendorEntry?.glCode || '-',
                    expenseType: expenseType,
                    actualGLCode: feeEntry.glCode,
                    actualGLName: feeEntry.glName,
                    tdsAmount: tdsEntry ? Math.max(tdsEntry.debit, tdsEntry.credit) : 0,
                    tdsRate: txn.meta?.tdsRate ? `${txn.meta.tdsRate}%` : '-',
                    tdsSection: txn.meta?.tdsSection || '-',
                    approvedBy: txn.approvedBy || 'System',
                    costCenter: feeEntry.costCenter || 'General',
                    status: txn.status || 'Posted',
                    remarks: txn.remarks || ''
                });
            });

            // Get account details
            const accountDetails = this.getAccountDetails(accountCode);

            // Calculate summary
            const totalDebit = ledgerEntries.reduce((sum, entry) =>
                sum + (entry.entryType === 'Debit' ? entry.amount : 0), 0);
            const totalCredit = ledgerEntries.reduce((sum, entry) =>
                sum + (entry.entryType === 'Credit' ? entry.amount : 0), 0);

            const summary = {
                accountDetails: accountDetails,
                openingBalance: openingBalance,
                totalDebit: totalDebit,
                totalCredit: totalCredit,
                closingBalance: runningBalance,
                transactionCount: ledgerEntries.length,
                period: filters.fromDate && filters.toDate
                    ? `${this.formatDate(filters.fromDate)} to ${this.formatDate(filters.toDate)}`
                    : 'All Time',
                actualDataSources: this.getDataSources(ledgerEntries)
            };

            console.log(`✅ Generated ${ledgerEntries.length} unified ledger entries`);
            return { ledgerEntries, summary };

        } catch (error) {
            console.error('❌ Error in unified fees ledger:', error);
            return { ledgerEntries: [], summary: null };
        }
    }

    /**
     * Get account details
     */
    static getAccountDetails(accountCode) {
        try {
            const chartOfAccounts = JSON.parse(localStorage.getItem('chartOfAccounts')) || [];
            const account = chartOfAccounts.find(acc => acc.code === accountCode);

            if (!account) {
                return {
                    code: accountCode,
                    name: accountCode === 'X2002002002' ? 'Professional Fees' : 'Other Fees',
                    type: 'ACCOUNT',
                    category: 'Expense',
                    nature: 'Debit'
                };
            }

            return {
                code: account.code,
                name: account.name,
                type: account.type,
                parentCode: account.parentCode,
                parentAccount: account.parentAccount,
                category: 'Expense',
                nature: 'Debit'
            };
        } catch (error) {
            console.error('Error getting account details:', error);
            return null;
        }
    }

    /**
     * Get expense type from GL code/name
     */
    static getExpenseType(glName, glCode) {
        if (!glName) return 'Other Expense';

        const glNameUpper = glName.toUpperCase();

        if (glNameUpper.includes('PROFESSIONAL') || glCode === 'X2002002002') {
            return 'Professional Fees';
        }
        if (glNameUpper.includes('OTHER FEES') || glCode === 'X2002002003') {
            return 'Other Fees';
        }
        if (glNameUpper.includes('INDIRECT EXPENSE')) {
            return 'Indirect Expense';
        }

        return 'Other Expense';
    }

    /**
     * Format date
     */
    static formatDate(dateString) {
        try {
            if (!dateString) return '';
            const date = new Date(dateString);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}-${month}-${year}`;
        } catch {
            return dateString;
        }
    }

    /**
     * Get invoice by transaction
     */
    static getInvoiceByTransaction(transaction) {
        try {
            const invoices = JSON.parse(localStorage.getItem('processed_invoices')) || [];
            return invoices.find(inv =>
                inv.invoiceNumber === transaction.invoiceNumber ||
                inv.voucher_id === transaction.voucherNo
            );
        } catch {
            return null;
        }
    }

    /**
     * Get data sources (which GL codes were actually found)
     */
    static getDataSources(ledgerEntries) {
        const sources = {};
        ledgerEntries.forEach(entry => {
            if (entry.actualGLCode) {
                if (!sources[entry.actualGLCode]) {
                    sources[entry.actualGLCode] = {
                        name: entry.actualGLName || entry.actualGLCode,
                        count: 0,
                        amount: 0
                    };
                }
                sources[entry.actualGLCode].count++;
                sources[entry.actualGLCode].amount += entry.amount;
            }
        });

        return Object.entries(sources).map(([code, data]) => ({
            glCode: code,
            glName: data.name,
            transactionCount: data.count,
            totalAmount: data.amount
        }));
    }
    static getFormattedLedgerData(accountCode, filters = {}) {
        try {
            const { ledgerEntries } = this.getUnifiedFeesLedger(accountCode, filters);

            if (ledgerEntries.length === 0) {
                return [];
            }

            // Map to match your LedgerTable structure
            const formattedData = ledgerEntries.map((entry, index) => {
                return {
                    postingDate: entry.date || '-',
                    documentDate: entry.date || '-',
                    voucherType: entry.voucherType || 'Purchase Voucher',
                    voucherNo: entry.voucherNo || '-',
                    vendorCode: entry.partyGL || '-',
                    vendorName: entry.party || 'Unknown',
                    invoiceNo: entry.invoiceNo || '-',
                    invoiceDate: entry.date || '-',
                    poNo: entry.poNo || '-',
                    costCenter: entry.costCenter || 'General',
                    expenseAmount: entry.amount || 0,
                    remarks: entry.remarks || entry.narration || '-',
                    runningBalance: entry.runningBalance || 0,
                    // Additional data for debugging
                    _originalEntry: entry
                };
            });

            return formattedData;
        } catch (error) {
            console.error('Error formatting ledger data:', error);
            return [];
        }
    }

    /**
     * Get fees statistics
     */
    static getFeesStatistics(accountCode) {
        try {
            const { ledgerEntries } = this.getUnifiedFeesLedger(accountCode);

            if (ledgerEntries.length === 0) {
                return {
                    totalAmount: 0,
                    transactionCount: 0,
                    averagePerTransaction: 0,
                    largestTransaction: 0,
                    smallestTransaction: 0,
                    byMonth: {}
                };
            }

            const stats = {
                totalAmount: 0,
                transactionCount: ledgerEntries.length,
                averagePerTransaction: 0,
                largestTransaction: 0,
                smallestTransaction: 0,
                byMonth: {},
                byVendor: {},
                withTDS: 0,
                tdsAmount: 0
            };

            ledgerEntries.forEach(entry => {
                stats.totalAmount += entry.amount;

                // Track largest/smallest
                if (entry.amount > stats.largestTransaction) {
                    stats.largestTransaction = entry.amount;
                }
                if (stats.smallestTransaction === 0 || entry.amount < stats.smallestTransaction) {
                    stats.smallestTransaction = entry.amount;
                }

                // Group by month
                const month = entry.date.substring(3, 10); // DD-MM-YYYY to MM-YYYY
                if (!stats.byMonth[month]) {
                    stats.byMonth[month] = { amount: 0, count: 0 };
                }
                stats.byMonth[month].amount += entry.amount;
                stats.byMonth[month].count++;

                // Group by vendor
                if (entry.party !== 'Unknown') {
                    if (!stats.byVendor[entry.party]) {
                        stats.byVendor[entry.party] = { amount: 0, count: 0 };
                    }
                    stats.byVendor[entry.party].amount += entry.amount;
                    stats.byVendor[entry.party].count++;
                }

                // Track TDS
                if (entry.tdsAmount > 0) {
                    stats.withTDS++;
                    stats.tdsAmount += entry.tdsAmount;
                }
            });

            stats.averagePerTransaction = stats.totalAmount / stats.transactionCount;

            return stats;
        } catch (error) {
            console.error('Error getting fees statistics:', error);
            return null;
        }
    }
}

export default UnifiedFeesService;
/* eslint-disable no-unused-vars */
// utils/hkMaterialsExpenseLedgerService.js

/**
 * HK MATERIALS EXPENSE LEDGER SERVICE
 * GL Code: X1001004001
 * Handles all HK Materials expense transactions
 */

export class HKMaterialsExpenseLedgerService {

    /**
     * Get all expense entries for HK Materials (X1001004001)
     */
    static getExpenseLedgerEntries() {
        try {
            const transactions = JSON.parse(localStorage.getItem('transactions')) || [];

            console.log('📊 Generating HK Materials Expense ledger for: X1001004001');

            // Filter transactions that have X1001004001 (HK Materials Expense) entries
            const hkExpenseTransactions = transactions.filter(txn =>
                txn.entries?.some(entry => entry.glCode === "X1001004001")
            );

            // Sort by date ascending
            hkExpenseTransactions.sort((a, b) => new Date(a.date) - new Date(b.date));

            console.log(`📋 Found ${hkExpenseTransactions.length} HK Materials Expense transactions`);

            // Convert to ledger entries with running balance
            const ledgerEntries = [];
            let runningBalance = 0;
            let balanceType = 'DR'; // Expenses have debit balance

            hkExpenseTransactions.forEach(txn => {
                const expenseEntry = txn.entries.find(entry => entry.glCode === "X1001004001");

                if (expenseEntry) {
                    const debit = expenseEntry.debit || 0;
                    const credit = expenseEntry.credit || 0;

                    // Calculate running balance (expense perspective)
                    // For expenses: Debit increases expense, Credit decreases
                    runningBalance += debit - credit;
                    balanceType = runningBalance >= 0 ? 'DR' : 'CR';

                    // Get vendor info from transaction
                    const vendorEntry = txn.entries.find(entry =>
                        entry.glCode.startsWith('L2005')
                    );
                    const vendorName = vendorEntry?.glName?.replace('VENDOR - ', '') ||
                        txn.vendorName || 'Unknown Vendor';

                    // Format date for display (DD-MM-YY format)
                    const displayDate = this.formatDate(txn.date);

                    // Format balance
                    const formattedBalance = `${Math.abs(runningBalance).toLocaleString('en-IN', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })} ${balanceType}`;

                    ledgerEntries.push({
                        date: displayDate,
                        originalDate: txn.date,
                        voucherNo: txn.voucherNo,
                        entryType: this.getExpenseEntryType(debit, credit),
                        particulars: this.getParticulars(txn, expenseEntry, vendorName),
                        voucherType: txn.voucherType || 'Purchase Voucher',
                        debit: debit > 0 ? debit.toLocaleString('en-IN', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        }) : '-',
                        credit: credit > 0 ? credit.toLocaleString('en-IN', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        }) : '-',
                        balance: formattedBalance,
                        balanceType: balanceType,
                        narration: expenseEntry.narration || txn.narration || '',
                        vendorName: vendorName,
                        invoiceNumber: txn.invoiceNumber || '-',
                        costCenter: expenseEntry.costCenter || txn.costCenter || 'Operations',
                        customer: txn.customer || txn.clientName || '-',
                        site: expenseEntry.site || txn.site || '-',
                        state: txn.state || '-',
                        city: txn.city || '-',
                        branch: txn.branch || '-',
                        status: txn.status || 'Posted',
                        approvedBy: txn.approvedBy || 'System'
                    });
                }
            });

            console.log(`✅ Generated ${ledgerEntries.length} HK Materials Expense ledger entries`);
            return ledgerEntries;

        } catch (error) {
            console.error('❌ Error generating HK Materials Expense ledger:', error);
            return [];
        }
    }

    /**
     * Get account details for header
     */
    static getAccountDetails() {
        try {
            const chartOfAccounts = JSON.parse(localStorage.getItem('chartOfAccounts')) || [];
            const ledgerBalances = JSON.parse(localStorage.getItem('ledgerBalances')) || {};

            const account = chartOfAccounts.find(acc => acc.code === "X1001004001");

            if (!account) {
                console.log('❌ HK Materials Expense account not found');
                return {
                    accountCode: "X1001004001",
                    accountName: "HK MATERIALS",
                    accountType: "Expense Account",
                    category: "Direct Expenses",
                    currentBalance: "0.00 DR"
                };
            }

            // Get current balance
            const balance = ledgerBalances["X1001004001"] || { debit: 0, credit: 0, balance: 0 };
            const currentBalance = Math.abs(balance.balance);
            const balanceType = balance.balance >= 0 ? 'DR' : 'CR';

            // Get transaction summary
            const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
            const hkExpenseTransactions = transactions.filter(txn =>
                txn.entries?.some(entry => entry.glCode === "X1001004001")
            );

            let totalExpenses = 0;
            let totalReversals = 0;
            let transactionCount = 0;

            hkExpenseTransactions.forEach(txn => {
                const expenseEntry = txn.entries.find(entry => entry.glCode === "X1001004001");
                if (expenseEntry) {
                    totalExpenses += expenseEntry.debit || 0;
                    totalReversals += expenseEntry.credit || 0;
                    transactionCount++;
                }
            });

            return {
                accountCode: "X1001004001",
                accountName: account.name || "HK MATERIALS",
                accountType: "Expense Account",
                category: "Direct Expenses",
                parentAccount: account.parentAccount || "DIRECT EXPENSES",
                currentBalance: `${currentBalance.toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                })} ${balanceType}`,
                balanceAmount: currentBalance,
                balanceType: balanceType,
                summary: {
                    totalExpenses: `₹${totalExpenses.toLocaleString('en-IN')}`,
                    totalReversals: `₹${totalReversals.toLocaleString('en-IN')}`,
                    netExpense: `₹${(totalExpenses - totalReversals).toLocaleString('en-IN')}`,
                    transactionCount: transactionCount
                }
            };

        } catch (error) {
            console.error('❌ Error getting account details:', error);
            return {
                accountCode: "X1001004001",
                accountName: "HK MATERIALS",
                accountType: "Expense Account",
                category: "Direct Expenses",
                currentBalance: "0.00 DR"
            };
        }
    }

    /**
     * Determine entry type based on debit/credit
     */
    static getExpenseEntryType(debit, credit) {
        if (debit > 0 && credit === 0) return 'Expense';
        if (credit > 0 && debit === 0) return 'Reversal';
        return 'Journal';
    }

    /**
     * Get particulars text for ledger entry
     */
    static getParticulars(txn, expenseEntry, vendorName) {
        // For expense entries, show the vendor name
        if (expenseEntry.debit > 0) {
            return `To ${vendorName}`;
        } else {
            return `By ${vendorName}`;
        }
    }

    /**
     * Format date for display (DD-MM-YY format)
     */
    static formatDate(dateString) {
        try {
            let date;
            if (dateString.includes('-')) {
                const parts = dateString.split('-');
                if (parts[0].length === 4) {
                    // YYYY-MM-DD format
                    date = new Date(dateString);
                } else {
                    // DD-MM-YY format - convert to YYYY-MM-DD
                    const year = parts[2].length === 2 ? `20${parts[2]}` : parts[2];
                    date = new Date(`${year}-${parts[1]}-${parts[0]}`);
                }
            } else {
                date = new Date(dateString);
            }

            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = String(date.getFullYear()).slice(-2);
            return `${day}-${month}-${year}`;
        } catch (error) {
            return dateString;
        }
    }

    /**
     * Parse date for filtering (convert DD-MM-YY to Date object)
     */
    static parseDate(dateString) {
        try {
            if (!dateString) return null;
            if (dateString.includes('-')) {
                const parts = dateString.split('-');
                if (parts[0].length === 4) {
                    // YYYY-MM-DD format
                    return new Date(dateString);
                } else {
                    // DD-MM-YY format
                    const year = parts[2].length === 2 ? `20${parts[2]}` : parts[2];
                    return new Date(`${year}-${parts[1]}-${parts[0]}`);
                }
            }
            return new Date(dateString);
        } catch (error) {
            return null;
        }
    }

    /**
     * Get vendor-wise expense summary
     */
    static getVendorWiseSummary() {
        try {
            const transactions = JSON.parse(localStorage.getItem('transactions')) || [];

            const vendorMap = new Map();

            transactions.forEach(txn => {
                const expenseEntry = txn.entries?.find(entry => entry.glCode === "X1001004001");
                const vendorEntry = txn.entries?.find(entry => entry.glCode.startsWith('L2005'));

                if (expenseEntry && vendorEntry) {
                    const vendorName = vendorEntry.glName?.replace('VENDOR - ', '') ||
                        txn.vendorName || 'Unknown';
                    const amount = expenseEntry.debit || 0;

                    if (!vendorMap.has(vendorName)) {
                        vendorMap.set(vendorName, {
                            vendorName: vendorName,
                            totalExpense: 0,
                            transactionCount: 0,
                            invoices: []
                        });
                    }

                    const vendor = vendorMap.get(vendorName);
                    vendor.totalExpense += amount;
                    vendor.transactionCount++;
                    if (txn.invoiceNumber) {
                        vendor.invoices.push(txn.invoiceNumber);
                    }
                }
            });

            return Array.from(vendorMap.values())
                .sort((a, b) => b.totalExpense - a.totalExpense);

        } catch (error) {
            console.error('Error getting vendor-wise summary:', error);
            return [];
        }
    }
}
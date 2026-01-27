// src/services/RealLedgerService.js

/* eslint-disable no-unused-vars */

/**
 * REAL LEDGER SERVICE
 * Fetches actual transactions from localStorage for ALL ledger types
 */

export class RealLedgerService {
    // ============================================
    // 1. CORE DATA FETCHING METHODS
    // ============================================

    /**
     * Get all transactions from storage
     */
    static getAllTransactions() {
        try {
            const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
            return transactions;
        } catch (error) {
            console.error('❌ Error fetching transactions:', error);
            return [];
        }
    }

    /**
     * Get all processed invoices
     */
    static getAllInvoices() {
        try {
            const invoices = JSON.parse(localStorage.getItem('processed_invoices')) || [];
            return invoices;
        } catch (error) {
            console.error('❌ Error fetching invoices:', error);
            return [];
        }
    }

    /**
     * Get all purchase orders
     */
    static getAllPOs() {
        try {
            const pos = JSON.parse(localStorage.getItem('purchaseOrders')) || [];
            return pos;
        } catch (error) {
            console.error('❌ Error fetching POs:', error);
            return [];
        }
    }

    // ============================================
    // 2. TDS LEDGER - REAL DATA
    // ============================================

    /**
     * Get real TDS ledger entries for a specific section or all
     */
    static getTDSLedgerEntries(sectionCode = null, filters = {}) {
        try {
            const transactions = this.getAllTransactions();

            console.log(`📊 Generating REAL TDS Ledger for section: ${sectionCode || 'ALL'}`);

            // Filter transactions with TDS entries
            const tdsTransactions = transactions.filter(txn =>
                txn.entries?.some(entry =>
                    entry.glCode === 'L2003001' || // TDS Ledger
                    entry.glName?.includes('TDS') ||
                    (txn.meta?.tdsApplicable && txn.meta.tdsAmount > 0)
                )
            );

            console.log(`📋 Found ${tdsTransactions.length} TDS transactions`);

            const ledgerEntries = [];
            let totalTDSCollected = 0;
            let totalTDSPaid = 0;
            let openingBalance = 0;

            // Sort by date
            tdsTransactions.sort((a, b) => new Date(a.date) - new Date(b.date));

            tdsTransactions.forEach(txn => {
                // Find TDS entry
                const tdsEntry = txn.entries.find(entry =>
                    entry.glCode === 'L2003001' ||
                    entry.glName?.includes('TDS PAYABLE')
                );

                if (!tdsEntry) return;

                const debit = tdsEntry.debit || 0;
                const credit = tdsEntry.credit || 0;
                const tdsAmount = Math.max(debit, credit);

                // Get related invoice details
                const relatedInvoice = this.getInvoiceByTransaction(txn);
                const poDetails = relatedInvoice ? this.getPODetails(relatedInvoice.poId) : null;

                // Calculate running totals
                if (credit > 0) {
                    totalTDSCollected += credit; // TDS deducted
                }
                if (debit > 0) {
                    totalTDSPaid += debit; // TDS paid to government
                }

                // Determine transaction type
                const transactionType = debit > 0 ? 'TDS Payment to Govt' : 'TDS Deducted';

                // Get vendor details
                const vendorEntry = txn.entries.find(entry =>
                    entry.glCode?.startsWith('L2005_')
                );
                const vendorName = vendorEntry?.glName?.replace('VENDOR - ', '') || 'Unknown Vendor';

                // Get expense category
                const expenseEntry = txn.entries.find(entry =>
                    entry.debit > 0 &&
                    !entry.glCode?.startsWith('L2005_') &&
                    entry.glCode !== 'L2003001'
                );

                // TDS Section from metadata or PO
                const tdsSection = txn.meta?.tdsSection ||
                    poDetails?.tdsSection ||
                    '194C';

                // Apply section filter
                if (sectionCode && tdsSection !== sectionCode) {
                    return;
                }

                // Apply date filters
                if (filters.fromDate && new Date(txn.date) < new Date(filters.fromDate)) {
                    return;
                }
                if (filters.toDate && new Date(txn.date) > new Date(filters.toDate)) {
                    return;
                }

                ledgerEntries.push({
                    date: this.formatDate(txn.date),
                    originalDate: txn.date,
                    voucherNo: txn.voucherNo,
                    voucherType: txn.voucherType,
                    invoiceNumber: txn.invoiceNumber || relatedInvoice?.invoiceNumber || '-',
                    transactionType: transactionType,
                    partyName: vendorName,
                    section: tdsSection,
                    tdsRate: txn.meta?.tdsRate || poDetails?.tdsDetails?.rate || '2%',
                    invoiceAmount: txn.meta?.totalAmount || expenseEntry?.debit || 0,
                    tdsAmount: tdsAmount,
                    tdsEntry: credit > 0 ? 'CREDIT' : 'DEBIT',
                    status: txn.status || 'Posted',
                    paidDate: debit > 0 ? this.formatDate(txn.date) : '-',
                    form26AS: debit > 0 ? 'To be Filed' : 'N/A',
                    certificateNo: `TDS${txn.voucherNo?.replace(/\D/g, '').slice(-6) || '000000'}`,
                    expenseCategory: expenseEntry?.glName || 'Expense',
                    expenseGLCode: expenseEntry?.glCode || '-',
                    costCenter: tdsEntry.costCenter || expenseEntry?.costCenter || txn.costCenter || 'General',
                    customer: txn.customer || txn.clientName || '-',
                    site: tdsEntry.site || expenseEntry?.site || txn.site || '-',
                    state: txn.state || '-',
                    city: txn.city || '-',
                    branch: txn.branch || '-',
                    approvedBy: txn.approvedBy || 'System',
                    narration: tdsEntry.narration || txn.narration || ''
                });
            });

            // Calculate summary data
            const currentBalance = totalTDSCollected - totalTDSPaid;
            const tdsSummary = {
                totalCollected: totalTDSCollected,
                totalPaid: totalTDSPaid,
                currentBalance: currentBalance,
                pendingPayment: Math.max(0, currentBalance),
                sectionBreakdown: this.getTDSSectionBreakdown(ledgerEntries)
            };

            console.log(`✅ Generated ${ledgerEntries.length} REAL TDS ledger entries`);

            return {
                ledgerEntries,
                summary: tdsSummary
            };
        } catch (error) {
            console.error('❌ Error generating TDS ledger:', error);
            return { ledgerEntries: [], summary: null };
        }
    }

    /**
     * Get TDS section summary breakdown
     */
    static getTDSSectionBreakdown(entries) {
        const breakdown = {
            '194C': { collected: 0, paid: 0, balance: 0 },
            '194J': { collected: 0, paid: 0, balance: 0 },
            'Other': { collected: 0, paid: 0, balance: 0 }
        };

        entries.forEach(entry => {
            const section = entry.section in breakdown ? entry.section : 'Other';
            const amount = entry.tdsAmount;

            if (entry.transactionType === 'TDS Deducted') {
                breakdown[section].collected += amount;
            } else if (entry.transactionType === 'TDS Payment to Govt') {
                breakdown[section].paid += amount;
            }

            breakdown[section].balance = breakdown[section].collected - breakdown[section].paid;
        });

        return breakdown;
    }

    /**
     * Get TDS payable summary by section
     */
    static getTDSSummaryBySection(sectionCode = null) {
        try {
            const { ledgerEntries, summary } = this.getTDSLedgerEntries(sectionCode);

            if (sectionCode) {
                // Filter for specific section
                const sectionEntries = ledgerEntries.filter(entry => entry.section === sectionCode);
                const sectionSummary = summary.sectionBreakdown[sectionCode] || {
                    collected: 0,
                    paid: 0,
                    balance: 0
                };

                return {
                    section: sectionCode,
                    ledgerEntries: sectionEntries,
                    summary: {
                        totalCollected: sectionSummary.collected,
                        totalPaid: sectionSummary.paid,
                        currentBalance: sectionSummary.balance,
                        pendingPayment: Math.max(0, sectionSummary.balance),
                        transactionCount: sectionEntries.length
                    }
                };
            }

            // Return all sections summary
            return {
                section: 'ALL',
                ledgerEntries: ledgerEntries.slice(0, 100), // Limit for display
                summary: summary
            };
        } catch (error) {
            console.error('❌ Error getting TDS summary:', error);
            return null;
        }
    }

    // ============================================
    // 3. GENERIC EXPENSE LEDGER - REAL DATA
    // ============================================

    /**
     * Get real ledger entries for ANY GL account
     */
    static getExpenseLedgerEntries(accountCode, filters = {}) {
        try {
            const transactions = this.getAllTransactions();

            console.log(`📊 Generating REAL Expense Ledger for GL: ${accountCode}`);

            // Filter transactions for this GL account
            const accountTransactions = transactions.filter(txn =>
                txn.entries?.some(entry => entry.glCode === accountCode)
            );

            console.log(`📋 Found ${accountTransactions.length} transactions for ${accountCode}`);

            // Get account details from COA
            const accountDetails = this.getAccountDetails(accountCode);

            const ledgerEntries = [];
            let runningBalance = 0;
            let openingBalance = 0;

            // Sort by date ascending
            accountTransactions.sort((a, b) => new Date(a.date) - new Date(b.date));

            accountTransactions.forEach(txn => {
                const accountEntry = txn.entries.find(entry => entry.glCode === accountCode);
                if (!accountEntry) return;

                const debit = accountEntry.debit || 0;
                const credit = accountEntry.credit || 0;
                const amount = Math.max(debit, credit);

                // Calculate running balance
                // For expense accounts (X series), debit increases balance
                if (accountCode.startsWith('X')) {
                    runningBalance += debit - credit;
                }
                // For liability accounts (L series), credit increases balance
                else if (accountCode.startsWith('L')) {
                    runningBalance += credit - debit;
                }
                // For asset accounts (A series), debit increases balance
                else if (accountCode.startsWith('A')) {
                    runningBalance += debit - credit;
                }

                // Determine balance type
                let balanceType = 'Dr';
                if (accountCode.startsWith('L') || accountCode.startsWith('R')) {
                    balanceType = runningBalance >= 0 ? 'Cr' : 'Dr';
                } else {
                    balanceType = runningBalance >= 0 ? 'Dr' : 'Cr';
                }

                // Get counterparty details
                const counterpartyEntry = txn.entries.find(entry =>
                    entry.glCode !== accountCode &&
                    (entry.debit > 0 || entry.credit > 0)
                );

                // Get related invoice
                const relatedInvoice = this.getInvoiceByTransaction(txn);

                // Determine transaction type
                const transactionType = this.getExpenseTransactionType(txn, accountEntry);

                // Apply filters
                if (filters.fromDate && new Date(txn.date) < new Date(filters.fromDate)) {
                    return;
                }
                if (filters.toDate && new Date(txn.date) > new Date(filters.toDate)) {
                    return;
                }
                if (filters.transactionType && transactionType !== filters.transactionType) {
                    return;
                }

                ledgerEntries.push({
                    date: this.formatDate(txn.date),
                    originalDate: txn.date,
                    voucherNo: txn.voucherNo,
                    voucherType: txn.voucherType,
                    invoiceNumber: txn.invoiceNumber || relatedInvoice?.invoiceNumber || '-',
                    transactionType: transactionType,
                    entryType: debit > 0 ? 'Debit' : 'Credit',
                    debit: debit > 0 ? debit.toLocaleString('en-IN', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    }) : '-',
                    credit: credit > 0 ? credit.toLocaleString('en-IN', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    }) : '-',
                    amount: amount,
                    balance: Math.abs(runningBalance).toLocaleString('en-IN', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    }),
                    balanceType: balanceType,
                    runningBalance: runningBalance,
                    narration: accountEntry.narration || txn.narration || '',
                    counterparty: counterpartyEntry?.glName || 'Unknown',
                    counterpartyGL: counterpartyEntry?.glCode || '-',
                    approvedBy: txn.approvedBy || 'System',
                    costCenter: accountEntry.costCenter || 'General',
                    department: accountEntry.department || 'Finance',
                    site: relatedInvoice?.site || txn.siteDetails?.siteName || '-',
                    remarks: txn.remarks || relatedInvoice?.remarks || '',
                    status: txn.status || 'Posted'
                });
            });

            // Calculate summary
            const totalDebit = ledgerEntries.reduce((sum, entry) => sum + (entry.entryType === 'Debit' ? entry.amount : 0), 0);
            const totalCredit = ledgerEntries.reduce((sum, entry) => sum + (entry.entryType === 'Credit' ? entry.amount : 0), 0);
            const closingBalance = runningBalance;

            const summary = {
                accountDetails: accountDetails,
                openingBalance: openingBalance,
                totalDebit: totalDebit,
                totalCredit: totalCredit,
                closingBalance: closingBalance,
                transactionCount: ledgerEntries.length,
                period: filters.fromDate && filters.toDate
                    ? `${this.formatDate(filters.fromDate)} to ${this.formatDate(filters.toDate)}`
                    : 'All Time'
            };

            console.log(`✅ Generated ${ledgerEntries.length} REAL expense ledger entries`);

            return {
                ledgerEntries,
                summary
            };
        } catch (error) {
            console.error('❌ Error generating expense ledger:', error);
            return { ledgerEntries: [], summary: null };
        }
    }
    /**
     * Smart GL code mapper - handles different GL code patterns
     */
    static getGLCodePatterns() {
        return {
            // Professional Fees - may be recorded as Other Fees or vice versa
            'X2002002002': ['X2002002002', 'X2002002003', 'PROFESSIONAL FEES', 'INDIRECT EXPENSE'],
            'X2002002003': ['X2002002003', 'X2002002002', 'OTHER FEES', 'INDIRECT EXPENSE'],

            // TDS - various patterns
            'L2003001': ['L2003001', 'TDS PAYABLE', 'TDS LEDGER', 'TDS'],

            // Expense categories
            'PROFESSIONAL_FEES': ['X2002002002', 'X2002002003'],
            'OTHER_FEES': ['X2002002003', 'X2002002002'],

            // Map common expense names to GL codes
            'INDIRECT EXPENSE': ['X2002002003', 'X2002002002'],
            'OTHER EXPENSE': ['X2002002003'],

            // Default exact match
            'DEFAULT': []
        };
    }

    /**
     * Find transactions for any GL code (smart matching)
     */
    static findTransactionsByGL(accountCode) {
        try {
            const transactions = this.getAllTransactions();

            console.log(`🔍 Smart search for GL: ${accountCode}`);

            if (!transactions || transactions.length === 0) {
                console.log('No transactions in storage');
                return [];
            }

            const patterns = this.getGLCodePatterns();
            const searchPatterns = patterns[accountCode] || [accountCode];

            console.log('Searching patterns:', searchPatterns);

            const matchingTransactions = transactions.filter(txn => {
                if (!txn.entries || !Array.isArray(txn.entries)) return false;

                return txn.entries.some(entry => {
                    // Check GL code
                    if (searchPatterns.includes(entry.glCode)) {
                        return true;
                    }

                    // Check GL name
                    if (entry.glName) {
                        const glNameUpper = entry.glName.toUpperCase();
                        return searchPatterns.some(pattern =>
                            glNameUpper.includes(pattern.toUpperCase())
                        );
                    }

                    return false;
                });
            });

            console.log(`✅ Found ${matchingTransactions.length} smart-matched transactions`);
            return matchingTransactions;

        } catch (error) {
            console.error('Error in smart GL search:', error);
            return [];
        }
    }

    /**
     * Enhanced expense ledger with smart GL matching
     */
    static getSmartExpenseLedgerEntries(accountCode, filters = {}) {
        try {
            console.log(`📊 Getting SMART Expense Ledger for: ${accountCode}`);

            // Use smart search to find transactions
            const transactions = this.findTransactionsByGL(accountCode);

            if (transactions.length === 0) {
                console.log(`⚠️ No transactions found for ${accountCode} even with smart search`);
                return { ledgerEntries: [], summary: null };
            }

            console.log(`📋 Found ${transactions.length} smart-matched transactions`);

            // Get account details
            const accountDetails = this.getAccountDetails(accountCode);

            const ledgerEntries = [];
            let runningBalance = 0;
            let openingBalance = 0;

            // Sort by date
            transactions.sort((a, b) => new Date(a.date) - new Date(b.date));

            transactions.forEach(txn => {
                // Find the entry for this account (using smart matching)
                const accountEntry = txn.entries.find(entry => {
                    const patterns = this.getGLCodePatterns();
                    const searchPatterns = patterns[accountCode] || [accountCode];

                    return searchPatterns.includes(entry.glCode) ||
                        (entry.glName && searchPatterns.some(pattern =>
                            entry.glName.toUpperCase().includes(pattern.toUpperCase())
                        ));
                });

                if (!accountEntry) return;

                const debit = accountEntry.debit || 0;
                const credit = accountEntry.credit || 0;
                const amount = Math.max(debit, credit);

                // Calculate running balance based on account nature
                if (accountCode.startsWith('X') || accountCode.startsWith('A')) {
                    // Debit accounts: Assets, Expenses
                    runningBalance += debit - credit;
                } else if (accountCode.startsWith('L') || accountCode.startsWith('R')) {
                    // Credit accounts: Liabilities, Revenue
                    runningBalance += credit - debit;
                }

                // Determine balance type
                let balanceType = runningBalance >= 0 ? 'Dr' : 'Cr';
                if (accountCode.startsWith('L') || accountCode.startsWith('R')) {
                    balanceType = runningBalance >= 0 ? 'Cr' : 'Dr';
                }

                // Get counterparty
                const counterpartyEntry = txn.entries.find(entry =>
                    entry.glCode !== accountEntry.glCode &&
                    (entry.debit > 0 || entry.credit > 0)
                );

                // Get related invoice
                const relatedInvoice = this.getInvoiceByTransaction(txn);

                // Apply date filters
                if (filters.fromDate && new Date(txn.date) < new Date(filters.fromDate)) {
                    return;
                }
                if (filters.toDate && new Date(txn.date) > new Date(filters.toDate)) {
                    return;
                }

                ledgerEntries.push({
                    date: this.formatDate(txn.date),
                    originalDate: txn.date,
                    voucherNo: txn.voucherNo,
                    voucherType: txn.voucherType,
                    invoiceNumber: txn.invoiceNumber || relatedInvoice?.invoiceNumber || '-',
                    transactionType: this.getExpenseTransactionType(txn, accountEntry),
                    entryType: debit > 0 ? 'Debit' : 'Credit',
                    debit: debit > 0 ? debit.toLocaleString('en-IN', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    }) : '-',
                    credit: credit > 0 ? credit.toLocaleString('en-IN', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    }) : '-',
                    amount: amount,
                    balance: Math.abs(runningBalance).toLocaleString('en-IN', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    }),
                    balanceType: balanceType,
                    runningBalance: runningBalance,
                    narration: accountEntry.narration || txn.narration || '',
                    counterparty: counterpartyEntry?.glName || 'Unknown',
                    counterpartyGL: counterpartyEntry?.glCode || '-',
                    approvedBy: txn.approvedBy || 'System',
                    costCenter: accountEntry.costCenter || txn.costCenter || 'General',
                    customer: txn.customer || txn.clientName || '-',
                    site: accountEntry.site || txn.site || '-',
                    state: txn.state || '-',
                    city: txn.city || '-',
                    branch: txn.branch || '-',
                    status: txn.status || 'Posted',
                    section: txn.meta?.tdsSection || '-',
                    tdsRate: txn.meta?.tdsRate ? `${txn.meta.tdsRate}%` : '-',
                    tdsAmount: txn.meta?.tdsAmount || 0
                });
            });

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
                    : 'All Time'
            };

            console.log(`✅ Generated ${ledgerEntries.length} smart ledger entries`);
            return { ledgerEntries, summary };

        } catch (error) {
            console.error('❌ Error in smart ledger:', error);
            return { ledgerEntries: [], summary: null };
        }
    }



    /**
 * Convert TDS transactions to ledger entries format
 */
    static convertTDSTransactionsToLedger(transactions) {
        try {
            const ledgerEntries = [];
            let runningBalance = 0;

            transactions.sort((a, b) => new Date(a.date) - new Date(b.date));

            transactions.forEach((txn, index) => {
                const tdsEntry = txn.entries.find(e => e.glCode === 'L2003001');
                const vendorEntry = txn.entries.find(e => e.glCode?.startsWith('L2005_'));
                const expenseEntry = txn.entries.find(e =>
                    e.debit > 0 && !e.glCode?.startsWith('L2005_') && e.glCode !== 'L2003001'
                );

                if (!tdsEntry) return;

                const debit = tdsEntry.debit || 0;
                const credit = tdsEntry.credit || 0;
                const tdsAmount = Math.max(debit, credit);

                // Calculate running balance
                if (credit > 0) {
                    runningBalance += tdsAmount; // TDS deducted (liability increases)
                } else if (debit > 0) {
                    runningBalance -= tdsAmount; // TDS paid (liability decreases)
                }

                const balanceType = runningBalance >= 0 ? 'Cr' : 'Dr';

                ledgerEntries.push({
                    id: `tds_${txn.id || index}`,
                    date: this.formatDate(txn.date),
                    voucherNo: txn.voucherNo,
                    entryType: credit > 0 ? 'deduction' : 'payment',
                    debit: debit,
                    credit: credit,
                    balance: Math.abs(runningBalance),
                    balanceType: balanceType,
                    narration: tdsEntry.narration || txn.narration || '',
                    vendor: vendorEntry?.glName?.replace('VENDOR - ', '') || 'Unknown',
                    pan: 'PANNOTAVL', // You can enhance this
                    paymentAmount: expenseEntry?.debit || txn.meta?.totalAmount || 0,
                    tdsRate: txn.meta?.tdsRate ? `${txn.meta.tdsRate}%` : '2%',
                    tdsAmount: tdsAmount,
                    quarter: this.getQuarter(new Date(txn.date)),
                    dueDate: this.calculateTDSDueDate(new Date(txn.date)),
                    dueStatus: 'pending',
                    attachments: 0,
                    section: txn.meta?.tdsSection || '194C',
                    invoiceNumber: txn.invoiceNumber || '-',
                    costCenter: tdsEntry.costCenter || expenseEntry?.costCenter || txn.costCenter || 'General',
                    customer: txn.customer || txn.clientName || '-',
                    site: tdsEntry.site || expenseEntry?.site || txn.site || '-',
                    state: txn.state || '-',
                    city: txn.city || '-',
                    branch: txn.branch || '-',
                    customer: txn.customer || txn.clientName || '-',
                    site: tdsEntry.site || expenseEntry?.site || txn.site || '-',
                    state: txn.state || '-',
                    city: txn.city || '-',
                    branch: txn.branch || '-'
                });
            });

            return ledgerEntries;
        } catch (error) {
            console.error('Error converting TDS transactions:', error);
            return [];
        }
    }


    /**
 * Calculate TDS summary from ledger entries
 */
    static calculateTDSSummary(ledgerEntries) {
        try {
            let totalDeductions = 0;
            let totalPayments = 0;

            ledgerEntries.forEach(entry => {
                if (entry.entryType === 'deduction') {
                    totalDeductions += entry.tdsAmount;
                } else if (entry.entryType === 'payment') {
                    totalPayments += entry.tdsAmount;
                }
            });

            const currentBalance = totalDeductions - totalPayments;

            return {
                totalDeductions,
                totalPayments,
                currentBalance,
                pendingPayment: Math.max(0, currentBalance),
                transactionCount: ledgerEntries.length
            };
        } catch (error) {
            console.error('Error calculating TDS summary:', error);
            return null;
        }
    }
    /**
     * Get account details from COA
     */
    static getAccountDetails(accountCode) {
        try {
            const chartOfAccounts = JSON.parse(localStorage.getItem('chartOfAccounts')) || [];
            const account = chartOfAccounts.find(acc => acc.code === accountCode);

            if (!account) {
                return {
                    code: accountCode,
                    name: 'Unknown Account',
                    type: 'ACCOUNT',
                    category: 'Unknown',
                    nature: 'Debit'
                };
            }

            return {
                code: account.code,
                name: account.name,
                type: account.type,
                parentCode: account.parentCode,
                parentAccount: account.parentAccount,
                category: account.accountCategory || this.getAccountCategory(accountCode),
                nature: account.debitCreditNature || (accountCode.startsWith('L') ? 'Credit' : 'Debit'),
                isActive: account.isActive !== false
            };
        } catch (error) {
            console.error('Error getting account details:', error);
            return null;
        }
    }

    // ============================================
    // 4. HELPER METHODS
    // ============================================

    /**
     * Get invoice by transaction
     */
    static getInvoiceByTransaction(transaction) {
        try {
            const invoices = this.getAllInvoices();
            return invoices.find(inv =>
                inv.invoiceNumber === transaction.invoiceNumber ||
                inv.voucher_id === transaction.voucherNo ||
                transaction.id?.includes(inv.id)
            );
        } catch (error) {
            return null;
        }
    }

    /**
     * Get PO details
     */
    static getPODetails(poId) {
        try {
            const pos = this.getAllPOs();
            return pos.find(po => po.id === poId || po.poNumber === poId);
        } catch (error) {
            return null;
        }
    }

    /**
     * Determine expense transaction type
     */
    static getExpenseTransactionType(transaction, accountEntry) {
        const voucherType = transaction.voucherType || '';

        if (voucherType.includes('Payment')) return 'Payment';
        if (voucherType.includes('Purchase')) return 'Purchase';
        if (voucherType.includes('Journal')) return 'Journal';
        if (voucherType.includes('Receipt')) return 'Receipt';

        // Check by account nature
        if (accountEntry.debit > 0) return 'Expense';
        if (accountEntry.credit > 0) return 'Income/Refund';

        return 'Adjustment';
    }

    /**
     * Format date to DD-MM-YYYY
     */
    static formatDate(dateString) {
        try {
            if (!dateString) return '-';
            const date = new Date(dateString);
            if (isNaN(date)) return dateString;

            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();

            return `${day}-${month}-${year}`;
        } catch (error) {
            return dateString;
        }
    }

    /**
     * Get account category from GL code
     */
    static getAccountCategory(glCode) {
        if (glCode.startsWith('A')) return 'Asset';
        if (glCode.startsWith('L')) return 'Liability';
        if (glCode.startsWith('X')) return 'Expense';
        if (glCode.startsWith('R')) return 'Revenue';
        return 'Other';
    }

    /**
     * Generate ledger report for any account
     */
    static generateLedgerReport(accountCode, startDate = null, endDate = null) {
        const filters = {};
        if (startDate) filters.fromDate = startDate;
        if (endDate) filters.toDate = endDate;

        return this.getExpenseLedgerEntries(accountCode, filters);
    }

    /**
     * Get all ledger accounts with balances
     */
    static getAllLedgerBalances() {
        try {
            const transactions = this.getAllTransactions();
            const balances = {};

            // Process all transactions
            transactions.forEach(txn => {
                txn.entries?.forEach(entry => {
                    const glCode = entry.glCode;
                    if (!glCode) return;

                    if (!balances[glCode]) {
                        balances[glCode] = {
                            glCode: glCode,
                            glName: entry.glName || glCode,
                            debit: 0,
                            credit: 0,
                            balance: 0
                        };
                    }

                    balances[glCode].debit += entry.debit || 0;
                    balances[glCode].credit += entry.credit || 0;

                    // Calculate balance based on account type
                    if (glCode.startsWith('L') || glCode.startsWith('R')) {
                        // Credit accounts
                        balances[glCode].balance = balances[glCode].credit - balances[glCode].debit;
                    } else {
                        // Debit accounts
                        balances[glCode].balance = balances[glCode].debit - balances[glCode].credit;
                    }
                });
            });

            return balances;
        } catch (error) {
            console.error('Error getting ledger balances:', error);
            return {};
        }
    }

    // ============================================
    // 5. ENHANCED TDS METHODS FOR TDS LEDGER PAGE
    // ============================================

    /**
     * Get enhanced TDS ledger entries matching your table structure
     */
    static getEnhancedTDSLedgerEntries(sectionCode = null, filters = {}) {
        try {
            const transactions = this.getAllTransactions();
            const invoices = this.getAllInvoices();
            const pos = this.getAllPOs();

            console.log(`📊 Generating Enhanced TDS Ledger for section: ${sectionCode || 'ALL'}`);

            // Filter transactions with TDS entries
            const tdsTransactions = transactions.filter(txn =>
                txn.entries?.some(entry =>
                    entry.glCode === 'L2003001' || // TDS Ledger
                    entry.glName?.includes('TDS') ||
                    (txn.meta?.tdsApplicable && txn.meta.tdsAmount > 0)
                )
            );

            console.log(`📋 Found ${tdsTransactions.length} TDS transactions`);

            const ledgerEntries = [];
            let runningBalance = 0;
            let openingBalance = 0;
            let entryCounter = 0;

            // Add opening balance entry
            if (tdsTransactions.length > 0) {
                const firstDate = new Date(tdsTransactions[0].date);
                const openingDate = new Date(firstDate);
                openingDate.setDate(1);

                ledgerEntries.push({
                    id: `tds_opening_${Date.now()}`,
                    date: this.formatDate(openingDate),
                    voucherNo: 'OPENING',
                    entryType: 'opening',
                    debit: 0,
                    credit: 0,
                    balance: openingBalance,
                    balanceType: 'cr',
                    narration: 'Opening Balance',
                    paymentVoucher: '',
                    vendor: '',
                    pan: '',
                    paymentAmount: 0,
                    tdsRate: '',
                    tdsAmount: 0,
                    quarter: this.getQuarter(openingDate),
                    dueDate: '',
                    dueStatus: '',
                    attachments: 0,
                    section: sectionCode || 'ALL',
                    vendorDetails: '',
                    originalDate: openingDate.toISOString()
                });

                entryCounter++;
            }

            // Sort by date
            tdsTransactions.sort((a, b) => new Date(a.date) - new Date(b.date));

            tdsTransactions.forEach(txn => {
                // Find TDS entry
                const tdsEntry = txn.entries.find(entry =>
                    entry.glCode === 'L2003001' ||
                    entry.glName?.includes('TDS PAYABLE')
                );

                if (!tdsEntry) return;

                const debit = tdsEntry.debit || 0;
                const credit = tdsEntry.credit || 0;
                const tdsAmount = Math.max(debit, credit);

                // Get related invoice
                const relatedInvoice = this.getInvoiceByTransaction(txn);
                const poDetails = relatedInvoice ? this.getPODetails(relatedInvoice.poId) : null;

                // Get vendor details
                const vendorEntry = txn.entries.find(entry =>
                    entry.glCode?.startsWith('L2005_')
                );

                const vendorName = vendorEntry?.glName?.replace('VENDOR - ', '') || 'Unknown Vendor';
                const vendorGL = vendorEntry?.glCode || '';

                // Get PAN from vendor account or PO
                const pan = this.extractPAN(vendorName, poDetails);

                // Get expense entry for payment amount
                const expenseEntry = txn.entries.find(entry =>
                    entry.debit > 0 &&
                    !entry.glCode?.startsWith('L2005_') &&
                    entry.glCode !== 'L2003001'
                );

                const paymentAmount = expenseEntry?.debit || txn.meta?.totalAmount || 0;

                // TDS Section from metadata or PO
                const tdsSection = txn.meta?.tdsSection ||
                    poDetails?.tdsSection ||
                    '194C';

                // Apply section filter
                if (sectionCode && tdsSection !== sectionCode) {
                    return;
                }

                // Apply date filters
                if (filters.fromDate && new Date(txn.date) < new Date(filters.fromDate)) {
                    return;
                }
                if (filters.toDate && new Date(txn.date) > new Date(filters.toDate)) {
                    return;
                }

                // Determine entry type
                const entryType = credit > 0 ? 'deduction' : 'payment';

                // Calculate running balance
                if (entryType === 'deduction') {
                    runningBalance += tdsAmount; // Increase TDS liability
                } else if (entryType === 'payment') {
                    runningBalance -= tdsAmount; // Decrease TDS liability
                }

                const balanceType = runningBalance >= 0 ? 'cr' : 'dr';

                // Get quarter and due date
                const txnDate = new Date(txn.date);
                const quarter = this.getQuarter(txnDate);
                const dueDate = this.calculateTDSDueDate(txnDate);
                const dueStatus = this.checkDueStatus(dueDate);

                // Get payment voucher if available
                const paymentVoucher = entryType === 'payment' ? txn.voucherNo : '';

                // Count attachments from invoice
                const attachments = relatedInvoice?.poDocuments?.length || 0;

                // Create enhanced ledger entry
                const ledgerEntry = {
                    id: `tds_${txn.id || Date.now()}_${entryCounter++}`,
                    date: this.formatDate(txn.date),
                    originalDate: txn.date,
                    voucherNo: txn.voucherNo,
                    entryType: entryType,
                    debit: debit,
                    credit: credit,
                    balance: Math.abs(runningBalance),
                    balanceType: balanceType,
                    narration: tdsEntry.narration || txn.narration || `${entryType === 'deduction' ? 'TDS Deducted' : 'TDS Paid to Govt'}`,
                    paymentVoucher: paymentVoucher,
                    vendor: vendorName,
                    pan: pan,
                    paymentAmount: paymentAmount,
                    tdsRate: txn.meta?.tdsRate ? `${txn.meta.tdsRate}%` : poDetails?.tdsDetails?.rate || '2%',
                    tdsAmount: tdsAmount,
                    quarter: quarter,
                    dueDate: dueDate,
                    dueStatus: dueStatus,
                    attachments: attachments,
                    section: tdsSection,
                    vendorDetails: this.getVendorDetails(vendorGL, vendorName),
                    invoiceNumber: txn.invoiceNumber || relatedInvoice?.invoiceNumber || '-',
                    voucherType: txn.voucherType,
                    status: txn.status || 'Posted',
                    expenseCategory: expenseEntry?.glName || 'Expense'
                };

                ledgerEntries.push(ledgerEntry);
            });

            console.log(`✅ Generated ${ledgerEntries.length} enhanced TDS ledger entries`);

            return ledgerEntries;
        } catch (error) {
            console.error('❌ Error generating enhanced TDS ledger:', error);
            return [];
        }
    }

    /**
     * Extract PAN from vendor name or PO details
     */
    static extractPAN(vendorName, poDetails) {
        // Try to extract PAN from vendor name (common patterns)
        const panPattern = /[A-Z]{5}[0-9]{4}[A-Z]{1}/;
        const match = vendorName.match(panPattern);

        if (match) {
            return match[0];
        }

        // Check PO details
        if (poDetails?.vendorPan) {
            return poDetails.vendorPan;
        }

        // Check if PAN is in vendor name after a dash
        const parts = vendorName.split('-');
        if (parts.length > 1) {
            const lastPart = parts[parts.length - 1].trim();
            if (panPattern.test(lastPart)) {
                return lastPart;
            }
        }

        return 'PANNOTAVL'; // Default if not found
    }

    /**
     * Get vendor details string
     */
    static getVendorDetails(vendorGL, vendorName) {
        if (!vendorGL) return vendorName;

        const vendorNumber = vendorGL.replace('L2005_', '');
        return `${vendorName} (Vendor #${vendorNumber})`;
    }

    /**
     * Get quarter from date
     */
    static getQuarter(date) {
        const month = date.getMonth() + 1;
        const year = date.getFullYear().toString().slice(-2);

        if (month >= 4 && month <= 6) return `Q1 ${year}`;
        if (month >= 7 && month <= 9) return `Q2 ${year}`;
        if (month >= 10 && month <= 12) return `Q3 ${year}`;
        return `Q4 ${year}`;
    }

    /**
     * Calculate TDS due date (7th of next month for TDS deposit)
     */
    static calculateTDSDueDate(transactionDate) {
        const dueDate = new Date(transactionDate);
        dueDate.setMonth(dueDate.getMonth() + 1);
        dueDate.setDate(7);

        return this.formatDate(dueDate);
    }

    /**
     * Check if TDS due date has passed
     */
    static checkDueStatus(dueDateStr) {
        try {
            const dueDate = new Date(dueDateStr.split('-').reverse().join('-'));
            const today = new Date();

            if (dueDate < today) {
                return 'overdue';
            }

            return 'pending';
        } catch {
            return 'unknown';
        }
    }

    /**
     * Get TDS summary data for cards
     */
    static getTDSSummaryCardsData(sectionCode = null) {
        try {
            const entries = this.getEnhancedTDSLedgerEntries(sectionCode);

            // Calculate summary
            let totalDeductions = 0;
            let totalPayments = 0;
            let pendingPayments = 0;

            entries.forEach(entry => {
                if (entry.entryType === 'deduction') {
                    totalDeductions += entry.tdsAmount;
                } else if (entry.entryType === 'payment') {
                    totalPayments += entry.tdsAmount;
                }
            });

            const currentBalance = totalDeductions - totalPayments;
            pendingPayments = Math.max(0, currentBalance);

            // Count overdue payments
            const overdueEntries = entries.filter(entry =>
                entry.dueStatus === 'overdue' && entry.entryType === 'deduction'
            );

            // Get section breakdown
            const sections = {};
            entries.forEach(entry => {
                if (entry.section && entry.entryType === 'deduction') {
                    if (!sections[entry.section]) {
                        sections[entry.section] = 0;
                    }
                    sections[entry.section] += entry.tdsAmount;
                }
            });

            return {
                totalDeductions: totalDeductions,
                totalPayments: totalPayments,
                currentBalance: currentBalance,
                pendingPayments: pendingPayments,
                overdueCount: overdueEntries.length,
                transactionCount: entries.filter(e => e.entryType !== 'opening').length,
                sectionBreakdown: sections
            };
        } catch (error) {
            console.error('Error getting TDS summary:', error);
            return null;
        }
    }

    /**
     * Get TDS section data for header
     */
    static getTDSSectionData(sectionCode) {
        const sections = {
            '194C': {
                description: 'Payment to Contractors/Sub-Contractors',
                rate: '2%',
                threshold: '₹30,000 per contract/single transaction',
                form: '26Q',
                dueDate: '7th of next month'
            },
            '194J': {
                description: 'Payment for Professional/Technical Services',
                rate: '10%',
                threshold: '₹30,000 per annum',
                form: '26Q',
                dueDate: '7th of next month'
            },
            '194I': {
                description: 'Payment of Rent',
                rate: '10%',
                threshold: '₹2,40,000 per annum',
                form: '26Q',
                dueDate: '7th of next month'
            },
            '194H': {
                description: 'Payment of Commission/Brokerage',
                rate: '10%',
                threshold: '₹15,000 per annum',
                form: '26Q',
                dueDate: '7th of next month'
            }
        };

        if (sectionCode && sections[sectionCode]) {
            return {
                section: sectionCode,
                ...sections[sectionCode]
            };
        }

        return {
            section: 'ALL',
            description: 'All TDS Sections',
            rate: 'Various',
            threshold: 'As per respective sections',
            form: '26Q',
            dueDate: '7th of next month'
        };
    }

    // ============================================
    // 6. ADDITIONAL UTILITY METHODS
    // ============================================

    /**
     * Get all vendor names for filter dropdown
     */
    static getAllVendorNames() {
        try {
            const chartOfAccounts = JSON.parse(localStorage.getItem('chartOfAccounts')) || [];
            const vendors = chartOfAccounts
                .filter(acc => acc.code.startsWith('L2005_'))
                .map(acc => acc.name.replace('VENDOR - ', ''));

            return [...new Set(vendors)]; // Remove duplicates
        } catch (error) {
            console.error('Error getting vendor names:', error);
            return [];
        }
    }

    /**
     * Get TDS ledger statistics
     */
    static getTDSStatistics(sectionCode = null) {
        try {
            const entries = this.getEnhancedTDSLedgerEntries(sectionCode);

            const stats = {
                totalEntries: entries.length,
                deductionCount: entries.filter(e => e.entryType === 'deduction').length,
                paymentCount: entries.filter(e => e.entryType === 'payment').length,
                totalTDSAmount: entries.reduce((sum, e) => sum + (e.tdsAmount || 0), 0),
                averageTDS: 0,
                maxTDS: 0,
                minTDS: 0
            };

            const tdsAmounts = entries
                .filter(e => e.tdsAmount > 0)
                .map(e => e.tdsAmount);

            if (tdsAmounts.length > 0) {
                stats.averageTDS = tdsAmounts.reduce((a, b) => a + b, 0) / tdsAmounts.length;
                stats.maxTDS = Math.max(...tdsAmounts);
                stats.minTDS = Math.min(...tdsAmounts);
            }

            return stats;
        } catch (error) {
            console.error('Error getting TDS statistics:', error);
            return null;
        }
    }

    /**
     * Export TDS ledger to CSV
     */
    static exportTDSLedgerToCSV(sectionCode = null, filters = {}) {
        try {
            const entries = this.getEnhancedTDSLedgerEntries(sectionCode, filters);

            // CSV header
            let csv = 'Date,Voucher No,Entry Type,Debit (₹),Credit (₹),Balance (₹),Balance Type,Narration,Vendor,PAN,Payment Amount (₹),TDS Rate,TDS Amount (₹),Quarter,Due Date,Section\n';

            // CSV rows
            entries.forEach(entry => {
                const row = [
                    `"${entry.date}"`,
                    `"${entry.voucherNo}"`,
                    `"${entry.entryType}"`,
                    entry.debit || '0',
                    entry.credit || '0',
                    entry.balance || '0',
                    `"${entry.balanceType}"`,
                    `"${entry.narration.replace(/"/g, '""')}"`,
                    `"${entry.vendor.replace(/"/g, '""')}"`,
                    `"${entry.pan}"`,
                    entry.paymentAmount || '0',
                    `"${entry.tdsRate}"`,
                    entry.tdsAmount || '0',
                    `"${entry.quarter}"`,
                    `"${entry.dueDate}"`,
                    `"${entry.section}"`
                ].join(',');

                csv += row + '\n';
            });

            return csv;
        } catch (error) {
            console.error('Error exporting TDS ledger:', error);
            return null;
        }
    }

    /**
     * Get TDS due dates summary
     */
    static getTDSDueDatesSummary() {
        try {
            const entries = this.getEnhancedTDSLedgerEntries();

            const dueDates = {};
            entries.forEach(entry => {
                if (entry.entryType === 'deduction' && entry.dueDate) {
                    if (!dueDates[entry.dueDate]) {
                        dueDates[entry.dueDate] = {
                            date: entry.dueDate,
                            count: 0,
                            amount: 0,
                            status: entry.dueStatus
                        };
                    }
                    dueDates[entry.dueDate].count++;
                    dueDates[entry.dueDate].amount += entry.tdsAmount;
                }
            });

            return Object.values(dueDates).sort((a, b) =>
                new Date(a.date.split('-').reverse().join('-')) -
                new Date(b.date.split('-').reverse().join('-'))
            );
        } catch (error) {
            console.error('Error getting TDS due dates:', error);
            return [];
        }
    }
}

// Export as default
export default RealLedgerService;
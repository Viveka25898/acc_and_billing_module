/* eslint-disable no-unused-vars */
// src/services/SeparatedFeesService.js

export class SeparatedFeesService {
    /**
     * Get ledger entries specifically for Professional Fees or Other Fees
     */
    static getSeparatedFeesLedger(accountCode, filters = {}) {
        try {
            const transactions = JSON.parse(localStorage.getItem('transactions')) || [];

            console.log(`📊 Separated Fees Ledger for: ${accountCode}`);

            // Define what each account code should include
            const accountMapping = {
                // Professional Fees (X2002002002)
                'X2002002002': {
                    primaryCode: 'X2002002002',
                    allowedNames: ['PROFESSIONAL FEES', 'PROFESSIONAL', 'FEES'],
                    description: 'Professional Fees'
                },
                // Other Fees (X2002002003)
                'X2002002003': {
                    primaryCode: 'X2002002003',
                    allowedNames: ['OTHER FEES', 'INDIRECT EXPENSE', 'OTHER'],
                    description: 'Other Fees'
                }
            };

            const mapping = accountMapping[accountCode];
            if (!mapping) {
                console.error(`❌ Unknown account code: ${accountCode}`);
                return { ledgerEntries: [], summary: null };
            }

            console.log(`🔍 Searching for: ${mapping.description}`);
            console.log(`Primary GL Code: ${mapping.primaryCode}`);
            console.log(`Allowed GL Names:`, mapping.allowedNames);

            // Filter transactions specifically for this account
            const filteredTransactions = transactions.filter(txn => {
                return txn.entries?.some(entry => {
                    // Check by GL code first (most precise)
                    if (entry.glCode === mapping.primaryCode) {
                        console.log(`✅ Found by GL code match: ${entry.glCode} = ${entry.glName}`);
                        return true;
                    }

                    // Check by GL name (secondary)
                    if (entry.glName) {
                        const glNameUpper = entry.glName.toUpperCase();
                        const hasMatch = mapping.allowedNames.some(name =>
                            glNameUpper.includes(name.toUpperCase())
                        );

                        if (hasMatch) {
                            console.log(`✅ Found by GL name match: ${entry.glCode} = ${entry.glName}`);
                            return true;
                        }
                    }

                    return false;
                });
            });

            console.log(`✅ Found ${filteredTransactions.length} ${mapping.description} transactions`);

            if (filteredTransactions.length === 0) {
                return { ledgerEntries: [], summary: null };
            }

            // Process transactions
            const ledgerEntries = [];
            let runningBalance = 0;
            let openingBalance = 0;

            // Sort by date
            filteredTransactions.sort((a, b) => new Date(a.date) - new Date(b.date));

            filteredTransactions.forEach(txn => {
                // Find the specific fee entry
                const feeEntry = txn.entries.find(entry =>
                    entry.glCode === mapping.primaryCode ||
                    (entry.glName && mapping.allowedNames.some(name =>
                        entry.glName.toUpperCase().includes(name.toUpperCase())
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

                ledgerEntries.push({
                    id: txn.id || Date.now(),
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
                    expenseType: mapping.description,
                    actualGLCode: feeEntry.glCode,
                    actualGLName: feeEntry.glName,
                    tdsAmount: tdsEntry ? Math.max(tdsEntry.debit, tdsEntry.credit) : 0,
                    tdsRate: txn.meta?.tdsRate ? `${txn.meta.tdsRate}%` : '-',
                    tdsSection: txn.meta?.tdsSection || '-',
                    approvedBy: txn.approvedBy || 'System',
                    costCenter: feeEntry.costCenter || txn.costCenter || 'General',
                    customer: txn.customer || txn.clientName || '-',
                    site: feeEntry.site || txn.site || '-',
                    state: txn.state || '-',
                    city: txn.city || '-',
                    branch: txn.branch || '-',
                    status: txn.status || 'Posted',
                    remarks: txn.remarks || ''
                });
            });

            // Get account details
            const accountDetails = this.getAccountDetails(accountCode, mapping.description);

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
                description: mapping.description,
                actualGLCode: ledgerEntries.length > 0 ? ledgerEntries[0].actualGLCode : accountCode
            };

            console.log(`✅ Generated ${ledgerEntries.length} ${mapping.description} ledger entries`);

            return { ledgerEntries, summary };

        } catch (error) {
            console.error('❌ Error in separated fees ledger:', error);
            return { ledgerEntries: [], summary: null };
        }
    }

    /**
     * Get formatted data for LedgerTable
     */
    static getFormattedLedgerData(accountCode, filters = {}) {
        try {
            const { ledgerEntries } = this.getSeparatedFeesLedger(accountCode, filters);

            if (!ledgerEntries || ledgerEntries.length === 0) {
                return [];
            }

            // Format data for LedgerTable component
            const formattedData = ledgerEntries.map((entry, index) => {
                // Get vendor details
                const vendorName = entry.party || 'Unknown';
                const vendorCode = entry.partyGL ?
                    entry.partyGL.replace('L2005_', 'V') :
                    (vendorName !== 'Unknown' ? 'VEND' : '-');

                return {
                    postingDate: entry.date || '-',
                    documentDate: entry.date || '-',
                    voucherType: entry.voucherType || 'Purchase Voucher',
                    voucherNo: entry.voucherNo || '-',
                    vendorCode: vendorCode,
                    vendorName: vendorName,
                    invoiceNo: entry.invoiceNo || '-',
                    invoiceDate: entry.date || '-',
                    poNo: entry.poNo || '-',
                    costCenter: entry.costCenter || 'General',
                    customer: entry.customer || entry.txn?.customer || entry.txn?.clientName || '-',
                    site: entry.site || entry.txn?.site || '-',
                    state: entry.state || entry.txn?.state || '-',
                    city: entry.city || entry.txn?.city || '-',
                    branch: entry.branch || entry.txn?.branch || '-',
                    expenseAmount: entry.amount || 0,
                    remarks: entry.remarks || entry.narration || '-',
                    runningBalance: entry.runningBalance || 0,
                    // Include TDS info if available
                    tdsAmount: entry.tdsAmount || 0,
                    tdsSection: entry.tdsSection || '-',
                    tdsRate: entry.tdsRate || '-',
                    // Original GL info for debugging
                    actualGLCode: entry.actualGLCode,
                    actualGLName: entry.actualGLName
                };
            });

            console.log(`📋 Formatted ${formattedData.length} entries for ${accountCode} LedgerTable`);
            return formattedData;

        } catch (error) {
            console.error('Error formatting ledger data:', error);
            return [];
        }
    }

    /**
     * Get account details
     */
    static getAccountDetails(accountCode, description = null) {
        try {
            const chartOfAccounts = JSON.parse(localStorage.getItem('chartOfAccounts')) || [];
            const account = chartOfAccounts.find(acc => acc.code === accountCode);

            const defaultName = description ||
                (accountCode === 'X2002002002' ? 'Professional Fees' : 'Other Fees');

            if (!account) {
                return {
                    code: accountCode,
                    name: defaultName,
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
     * Get fees statistics
     */
    static getFeesStatistics(accountCode) {
        try {
            const { ledgerEntries } = this.getSeparatedFeesLedger(accountCode);

            if (!ledgerEntries || ledgerEntries.length === 0) {
                return {
                    totalAmount: 0,
                    transactionCount: 0,
                    averagePerTransaction: 0,
                    largestTransaction: 0,
                    smallestTransaction: 0,
                    byMonth: {},
                    byVendor: {},
                    withTDS: 0,
                    tdsAmount: 0
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

    /**
     * Debug: Check what transactions exist for each fee type
     */
    static debugFeeTransactions() {
        try {
            const transactions = JSON.parse(localStorage.getItem('transactions')) || [];

            console.log('🔍 DEBUG: Analyzing fee transactions...');
            console.log(`Total transactions: ${transactions.length}`);

            // Check for X2002002002 (Professional Fees)
            const professionalFeesTxns = transactions.filter(txn =>
                txn.entries?.some(entry =>
                    entry.glCode === 'X2002002002' ||
                    (entry.glName && entry.glName.toUpperCase().includes('PROFESSIONAL'))
                )
            );

            // Check for X2002002003 (Other Fees/INDIRECT EXPENSE)
            const otherFeesTxns = transactions.filter(txn =>
                txn.entries?.some(entry =>
                    entry.glCode === 'X2002002003' ||
                    (entry.glName && (
                        entry.glName.toUpperCase().includes('OTHER FEES') ||
                        entry.glName.toUpperCase().includes('INDIRECT EXPENSE')
                    ))
                )
            );

            console.log('📊 Professional Fees (X2002002002) transactions:', professionalFeesTxns.length);
            if (professionalFeesTxns.length > 0) {
                professionalFeesTxns.forEach((txn, idx) => {
                    const feeEntry = txn.entries.find(e =>
                        e.glCode === 'X2002002002' ||
                        e.glName?.includes('PROFESSIONAL')
                    );
                    console.log(`  ${idx + 1}. ${txn.voucherNo} - ${feeEntry?.glName} (₹${feeEntry?.debit || 0})`);
                });
            }

            console.log('📊 Other Fees (X2002002003) transactions:', otherFeesTxns.length);
            if (otherFeesTxns.length > 0) {
                otherFeesTxns.forEach((txn, idx) => {
                    const feeEntry = txn.entries.find(e =>
                        e.glCode === 'X2002002003' ||
                        e.glName?.includes('OTHER FEES') ||
                        e.glName?.includes('INDIRECT EXPENSE')
                    );
                    console.log(`  ${idx + 1}. ${txn.voucherNo} - ${feeEntry?.glName} (₹${feeEntry?.debit || 0})`);
                });
            }

            // Show all GL codes used
            const allGLCodes = new Set();
            transactions.forEach(txn => {
                txn.entries?.forEach(entry => {
                    if (entry.glCode && (entry.glCode.startsWith('X2002002') || entry.glName?.includes('FEES'))) {
                        allGLCodes.add(`${entry.glCode} - ${entry.glName || 'No Name'}`);
                    }
                });
            });

            console.log('📋 All X2002002* GL Codes found:');
            Array.from(allGLCodes).sort().forEach(code => console.log(`  - ${code}`));

            return {
                professionalFees: professionalFeesTxns,
                otherFees: otherFeesTxns,
                allGLCodes: Array.from(allGLCodes)
            };

        } catch (error) {
            console.error('Debug error:', error);
            return null;
        }
    }
}

export default SeparatedFeesService;
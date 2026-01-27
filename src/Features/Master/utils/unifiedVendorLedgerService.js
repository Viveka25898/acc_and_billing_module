/* eslint-disable no-unused-vars */
// utils/unifiedVendorLedgerService.js

/**
 * UNIFIED VENDOR LEDGER SERVICE
 * Handles ALL vendor transactions regardless of invoice type
 * (HK Materials, Fixed Assets, Prepaid Uniforms, Rent, etc.)
 */

export class UnifiedVendorLedgerService {

    /**
     * Get all ledger entries for ANY vendor GL account (L2005*)
     * Shows ALL transaction types for that vendor
     */
    static getVendorLedgerEntries(accountCode) {
        try {
            const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
            const processedInvoices = JSON.parse(localStorage.getItem('processed_invoices')) || [];

            console.log(`📊 Generating UNIFIED vendor ledger for: ${accountCode}`);

            // Filter ALL transactions involving this vendor account
            const vendorTransactions = transactions.filter(txn =>
                txn.entries?.some(entry => entry.glCode === accountCode)
            );

            // Sort by date ascending
            vendorTransactions.sort((a, b) => new Date(a.date) - new Date(b.date));

            console.log(`📋 Found ${vendorTransactions.length} transactions for vendor ${accountCode}`);

            // Convert to ledger entries
            const ledgerEntries = [];
            let runningBalance = 0;
            let balanceType = 'CR'; // Vendors typically have credit balance

            vendorTransactions.forEach(txn => {
                const vendorEntry = txn.entries.find(entry => entry.glCode === accountCode);

                if (!vendorEntry) return;

                // Find the expense/asset entry to determine transaction type
                const expenseEntry = txn.entries.find(entry =>
                    entry.glCode !== accountCode &&
                    (entry.debit > 0 || entry.credit > 0)
                );

                const debit = vendorEntry.debit || 0;
                const credit = vendorEntry.credit || 0;

                // Calculate running balance (vendor perspective)
                // Credit = Invoice (increases liability/outstanding)
                // Debit = Payment (decreases liability/outstanding)
                runningBalance += credit - debit;
                balanceType = runningBalance >= 0 ? 'CR' : 'DR';

                // Determine transaction type based on voucher type and GL codes
                const transactionType = this.determineTransactionType(txn, expenseEntry);

                // Find related invoice for more details
                const relatedInvoice = processedInvoices.find(inv =>
                    inv.invoiceNumber === txn.invoiceNumber ||
                    inv.voucher_id === txn.voucherNo
                );

                // Get counterparty (what was purchased/paid)
                const counterparty = this.getCounterpartyDescription(expenseEntry, txn, relatedInvoice);

                // Format date for display
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
                    voucherType: txn.voucherType || 'Journal Voucher',
                    invoiceNumber: txn.invoiceNumber || relatedInvoice?.invoiceNumber || '-',
                    transactionType: transactionType,
                    entryType: this.getEntryType(debit, credit),
                    debit: debit > 0 ? debit.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-',
                    credit: credit > 0 ? credit.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-',
                    balance: formattedBalance,
                    balanceType: balanceType,
                    narration: vendorEntry.narration || txn.narration || '',
                    counterparty: counterparty,
                    counterpartyGL: expenseEntry?.glCode || '-',
                    expenseCategory: this.categorizeExpense(expenseEntry?.glCode),
                    approvedBy: txn.approvedBy || 'System',
                    costCenter: vendorEntry.costCenter || expenseEntry?.costCenter || txn.costCenter || 'General',
                    customer: txn.customer || txn.clientName || '-',
                    site: relatedInvoice?.site || txn.siteDetails?.siteName || vendorEntry.site || expenseEntry?.site || txn.site || '-',
                    state: txn.state || '-',
                    city: txn.city || '-',
                    branch: txn.branch || '-',
                    status: txn.status || 'Posted',
                    attachments: relatedInvoice?.poDocuments?.length || 0,
                    remarks: txn.remarks || relatedInvoice?.amRemarks || relatedInvoice?.bmRemarks || '',
                    // Additional details from invoice
                    gstRate: relatedInvoice?.gstRate || '-',
                    assetTag: relatedInvoice?.assetDetails?.assetTag || '-',
                    month: relatedInvoice?.month || this.extractMonth(txn)
                });
            });

            console.log(`✅ Generated ${ledgerEntries.length} unified vendor ledger entries`);
            return ledgerEntries;

        } catch (error) {
            console.error('❌ Error generating unified vendor ledger:', error);
            return [];
        }
    }

    /**
     * Get vendor account details from COA
     */
    static getVendorAccountDetails(accountCode) {
        try {
            const chartOfAccounts = JSON.parse(localStorage.getItem('chartOfAccounts')) || [];
            const ledgerBalances = JSON.parse(localStorage.getItem('ledgerBalances')) || {};
            const transactions = JSON.parse(localStorage.getItem('transactions')) || [];

            const account = chartOfAccounts.find(acc => acc.code === accountCode);

            if (!account) {
                console.log(`❌ Vendor account not found: ${accountCode}`);
                return null;
            }

            // Extract vendor name (remove "VENDOR - " prefix)
            const vendorName = account.name
                .replace('VENDOR - ', '')
                .replace('HK MATERIAL VENDOR - ', '')
                .replace('FIXED ASSET VENDOR - ', '')
                .replace('UNIFORM VENDOR - ', '')
                .replace('PREPAID VENDOR - ', '');

            // Get current balance
            const balance = ledgerBalances[accountCode] || { debit: 0, credit: 0, balance: 0 };
            const outstandingBalance = Math.abs(balance.balance);
            const balanceType = balance.balance >= 0 ? 'Credit' : 'Debit';

            // Calculate totals from transactions
            const vendorTransactions = transactions.filter(txn =>
                txn.entries?.some(entry => entry.glCode === accountCode)
            );

            let totalInvoices = 0;
            let totalPayments = 0;
            let invoiceCount = 0;

            vendorTransactions.forEach(txn => {
                const vendorEntry = txn.entries.find(entry => entry.glCode === accountCode);
                if (vendorEntry) {
                    if (vendorEntry.credit > 0) {
                        totalInvoices += vendorEntry.credit;
                        invoiceCount++;
                    }
                    if (vendorEntry.debit > 0) {
                        totalPayments += vendorEntry.debit;
                    }
                }
            });

            // Get transaction types breakdown
            const transactionTypes = this.getTransactionTypesBreakdown(vendorTransactions, accountCode);

            return {
                vendorCode: accountCode,
                vendorName: vendorName,
                glAccountCode: accountCode,
                accountName: account.name,
                gstin: account.gstin || 'N/A',
                pan: account.pan || 'N/A',
                tdsSection: account.tdsSection || 'N/A',
                paymentTerms: account.paymentTerms || 'Net 30 Days',
                balances: [
                    {
                        label: "Opening Balance (01-Apr-2025)",
                        amount: `₹${(0).toLocaleString('en-IN')}`,
                        type: "Credit (Outstanding)",
                    },
                    {
                        label: "Current Outstanding",
                        amount: `₹${outstandingBalance.toLocaleString('en-IN')}`,
                        type: `${balanceType} Balance`,
                    }
                ],
                summary: {
                    totalInvoices: `₹${totalInvoices.toLocaleString('en-IN')}`,
                    totalPayments: `₹${totalPayments.toLocaleString('en-IN')}`,
                    pendingInvoices: `${invoiceCount} Invoices`,
                    transactionTypes: transactionTypes
                }
            };

        } catch (error) {
            console.error('❌ Error getting vendor account details:', error);
            return null;
        }
    }

    /**
     * Determine transaction type from voucher and GL codes
     */
    static determineTransactionType(txn, expenseEntry) {
        if (!expenseEntry) return 'Journal Entry';

        const glCode = expenseEntry.glCode;

        // Check voucher type first
        if (txn.voucherType === 'Payment Voucher' && expenseEntry.debit > 0) {
            return 'Payment';
        }
        if (txn.voucherType === 'Purchase Voucher' && expenseEntry.debit > 0) {
            return 'Invoice';
        }

        // Determine by GL code
        if (glCode.startsWith('X1001004')) return 'HK Material Invoice';
        if (glCode.startsWith('A1001') || glCode.startsWith('A1002') || glCode.startsWith('A1003') ||
            glCode.startsWith('A1004') || glCode.startsWith('A1005') || glCode.startsWith('A1006') ||
            glCode.startsWith('A1007')) return 'Fixed Asset Invoice';
        if (glCode === 'A3005001') return 'Prepaid Uniform Invoice';
        if (glCode === 'X2001002002') return 'Rent Invoice';
        if (glCode.startsWith('A3004') || glCode.toLowerCase().includes('bank')) return 'Payment';

        return 'Invoice';
    }

    /**
     * Get counterparty description
     */
    static getCounterpartyDescription(expenseEntry, txn, invoice) {
        if (!expenseEntry) return txn.narration || 'Transaction';

        const glCode = expenseEntry.glCode;
        const glName = expenseEntry.glName || '';

        // Use GL name if available
        if (glName) return glName;

        // Otherwise determine from GL code
        if (glCode.startsWith('X1001004')) return 'HK Materials';
        if (glCode.startsWith('A100')) return `Fixed Asset - ${invoice?.assetDetails?.assetCategory || 'Asset'}`;
        if (glCode === 'A3005001') return 'Uniform (Prepaid)';
        if (glCode === 'X2001002002') return 'Office Rent';
        if (glCode.startsWith('A3004')) return 'Bank Payment';

        return glName || glCode || 'Expense';
    }

    /**
     * Categorize expense type
     */
    static categorizeExpense(glCode) {
        if (!glCode) return 'General';

        if (glCode.startsWith('X1001004')) return 'HK Materials';
        if (glCode.startsWith('A100')) return 'Fixed Assets';
        if (glCode === 'A3005001') return 'Prepaid Expenses';
        if (glCode === 'X2001002002') return 'Rent';
        if (glCode.startsWith('X1001002')) return 'Travel';
        if (glCode.startsWith('X1001003')) return 'Food & Refreshment';
        if (glCode.startsWith('X2001002001')) return 'Office Supplies';
        if (glCode.startsWith('A3007001')) return 'GST Input';
        if (glCode.startsWith('A3004')) return 'Bank';

        return 'Other';
    }

    /**
     * Get transaction types breakdown
     */
    static getTransactionTypesBreakdown(transactions, accountCode) {
        const breakdown = {
            hkMaterial: 0,
            fixedAsset: 0,
            prepaidUniform: 0,
            rent: 0,
            payments: 0,
            other: 0
        };

        transactions.forEach(txn => {
            const vendorEntry = txn.entries.find(entry => entry.glCode === accountCode);
            const expenseEntry = txn.entries.find(entry => entry.glCode !== accountCode);

            if (!vendorEntry || !expenseEntry) return;

            const glCode = expenseEntry.glCode;
            const amount = vendorEntry.credit || vendorEntry.debit || 0;

            if (glCode.startsWith('X1001004')) breakdown.hkMaterial += amount;
            else if (glCode.startsWith('A100')) breakdown.fixedAsset += amount;
            else if (glCode === 'A3005001') breakdown.prepaidUniform += amount;
            else if (glCode === 'X2001002002') breakdown.rent += amount;
            else if (vendorEntry.debit > 0) breakdown.payments += amount;
            else breakdown.other += amount;
        });

        return breakdown;
    }

    /**
     * Determine entry type (Invoice/Payment/Journal)
     */
    static getEntryType(debit, credit) {
        if (credit > 0 && debit === 0) return 'Invoice';
        if (debit > 0 && credit === 0) return 'Payment';
        return 'Journal';
    }

    /**
     * Format date for display (DD-MM-YY)
     */
    static formatDate(dateString) {
        try {
            if (!dateString) return '-';
            let date;
            if (dateString.includes('-')) {
                const parts = dateString.split('-');
                if (parts[0].length === 4) {
                    date = new Date(dateString);
                } else {
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
     * Extract month from transaction
     */
    static extractMonth(txn) {
        if (txn.monthYear) return txn.monthYear;
        if (txn.month) return txn.month;

        try {
            const date = new Date(txn.date);
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return `${monthNames[date.getMonth()]}-${date.getFullYear()}`;
        } catch {
            return '-';
        }
    }

    /**
     * Parse date for filtering
     */
    static parseDate(dateString) {
        try {
            if (!dateString) return null;
            if (dateString.includes('-')) {
                const parts = dateString.split('-');
                if (parts[0].length === 4) {
                    return new Date(dateString);
                } else {
                    const year = parts[2].length === 2 ? `20${parts[2]}` : parts[2];
                    return new Date(`${year}-${parts[1]}-${parts[0]}`);
                }
            }
            return new Date(dateString);
        } catch (error) {
            return null;
        }
    }
}
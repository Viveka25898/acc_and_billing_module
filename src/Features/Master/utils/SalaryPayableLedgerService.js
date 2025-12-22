// services/SalaryPayableLedgerService.js

export class SalaryPayableLedgerService {

    /**
     * Get salary payable ledger details for header
     */
    static getSalaryPayableLedgerDetails(glCode = 'L2002001') {
        try {
            const chartOfAccounts = JSON.parse(localStorage.getItem('chartOfAccounts')) || [];
            const ledgerAccount = chartOfAccounts.find(acc => acc.code === glCode);

            if (!ledgerAccount) {
                return {
                    glAccountCode: glCode,
                    accountName: 'SALARY PAYABLE',
                    accountType: 'Current Liability',
                    category: 'Employee Payables',
                    financialYear: '2024-25'
                };
            }

            return {
                glAccountCode: glCode,
                accountName: ledgerAccount.name || 'SALARY PAYABLE',
                accountType: 'Current Liability',
                category: 'Employee Payables',
                financialYear: '2024-25'
            };

        } catch (error) {
            console.error('Error getting salary payable ledger details:', error);
            return null;
        }
    }

    /**
     * Get all transactions for salary payable ledger
     */
    static getSalaryPayableTransactions(glCode = 'L2002001') {
        try {
            const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
            const chartOfAccounts = JSON.parse(localStorage.getItem('chartOfAccounts')) || [];

            console.log(`💰 Loading salary payable transactions for: ${glCode}`);
            console.log(`📋 Total transactions in system: ${transactions.length}`);

            // Filter transactions that involve salary payable ledger - WITH SAFETY CHECK
            const salaryTransactions = transactions.filter(txn => {
                // Check if txn.entries exists and is an array
                if (!txn.entries || !Array.isArray(txn.entries)) {
                    console.warn('⚠️ Transaction missing entries array:', txn.id);
                    return false;
                }
                return txn.entries.some(entry => entry.glCode === glCode);
            });

            console.log(`✅ Found ${salaryTransactions.length} salary payable transactions for ${glCode}`);

            // Convert to ledger format
            const ledgerEntries = [];
            let runningBalance = 0; // Opening balance

            salaryTransactions.forEach(txn => {
                const salaryEntry = txn.entries.find(entry => entry.glCode === glCode);
                const otherEntry = txn.entries.find(entry => entry.glCode !== glCode);

                if (salaryEntry) {
                    const debit = salaryEntry.debit || 0;
                    const credit = salaryEntry.credit || 0;

                    // Calculate running balance (for liabilities, credit increases balance, debit decreases)
                    runningBalance += credit - debit;
                    const balanceType = runningBalance >= 0 ? 'CR' : 'DR';

                    // Get counterparty info
                    const counterparty = this.getCounterpartyInfo(otherEntry, chartOfAccounts);

                    // Determine transaction type
                    const entryType = credit > 0 ? 'provision' : 'payment';
                    const transactionType = this.getTransactionType(txn, otherEntry);

                    ledgerEntries.push({
                        id: txn.id || `TXN-${ledgerEntries.length + 1}`,
                        srNo: ledgerEntries.length + 1,
                        date: this.formatDate(txn.date),
                        paymentDue: this.getPaymentDueDate(txn),
                        paymentDueDate: this.getPaymentDueDate(txn),
                        voucherType: txn.voucherType || 'Payment Entry',
                        voucherNo: txn.voucherNo,
                        batchId: txn.batchId || '-',
                        employeeId: '-',
                        employeeName: '-',
                        costCenter: salaryEntry.costCenter || 'HEAD OFFICE',
                        department: salaryEntry.department || 'Payroll',
                        referenceDoc: salaryEntry.referenceDoc || txn.batchId || txn.id,
                        referenceDocNo: salaryEntry.referenceDoc || txn.batchId || txn.id,
                        narration: salaryEntry.narration || txn.narration || 'Salary Transaction',
                        status: txn.status || 'Posted',
                        postedBy: txn.postedBy || txn.approvedBy || 'System',
                        paymentMethod: txn.paymentMethod || salaryEntry.paymentMethod || 'Bank Transfer',
                        debit: debit > 0 ? this.formatAmount(debit) : '-',
                        credit: credit > 0 ? this.formatAmount(credit) : '-',
                        runningBalance: this.formatAmount(Math.abs(runningBalance)) + ' ' + balanceType,
                        balance: this.formatAmount(Math.abs(runningBalance)) + ' ' + balanceType,
                        counterparty: counterparty.name,
                        type: transactionType,
                        entryType: entryType,
                        rowClass: entryType === 'payment' ? 'bg-green-50' : 'bg-yellow-50'
                    });
                }
            });

            // Add opening balance as first entry if there are transactions
            if (ledgerEntries.length > 0) {
                ledgerEntries.unshift({
                    id: 'OB-2024',
                    srNo: 0,
                    date: '01-Apr-24',
                    paymentDue: '-',
                    paymentDueDate: '-',
                    voucherType: 'Opening Balance',
                    voucherNo: 'OB-2024',
                    batchId: '-',
                    employeeId: '-',
                    employeeName: '-',
                    costCenter: 'HEAD OFFICE',
                    department: 'Payroll',
                    referenceDoc: '-',
                    referenceDocNo: '-',
                    narration: 'Opening Balance B/F FY 2024-25',
                    status: 'Posted',
                    postedBy: '-',
                    paymentMethod: '-',
                    debit: '-',
                    credit: '0.00',
                    runningBalance: '0.00 CR',
                    balance: '0.00 CR',
                    counterparty: '-',
                    type: 'opening',
                    entryType: 'opening',
                    rowClass: 'bg-blue-50'
                });

                // Renumber after adding opening balance
                ledgerEntries.forEach((entry, index) => {
                    entry.srNo = index;
                });
            }

            return ledgerEntries;

        } catch (error) {
            console.error('❌ Error getting salary payable transactions:', error);
            return [];
        }
    }

    /**
     * Get counterparty information
     */
    static getCounterpartyInfo(entry, chartOfAccounts) {
        if (!entry) return { name: 'N/A', type: 'Unknown' };

        // Bank account
        if (entry.glCode && entry.glCode.startsWith('A3004')) {
            const bank = chartOfAccounts.find(acc => acc.code === entry.glCode);
            return {
                name: bank?.name || entry.glName || 'Bank Account',
                type: 'bank'
            };
        }

        // Salary expense account
        if (entry.glCode && entry.glCode.startsWith('X2003')) {
            return {
                name: entry.glName || 'Salary Expense',
                type: 'expense'
            };
        }

        // Other accounts
        const account = chartOfAccounts.find(acc => acc.code === entry.glCode);
        return {
            name: account?.name || entry.glName || 'Account',
            type: 'other'
        };
    }

    /**
     * Determine transaction type
     */
    static getTransactionType(txn, entry) {
        if (!entry) return 'other';

        // Check voucher type first
        if (txn.voucherType === 'Payment Entry') {
            return 'salary_payment';
        }

        if (txn.voucherType === 'Journal Entry' || txn.voucherType === 'JV') {
            return 'salary_provision';
        }

        // Check GL code
        if (entry.glCode && entry.glCode.startsWith('A3004')) {
            return 'salary_payment';
        }

        if (entry.glCode && entry.glCode.startsWith('X2003')) {
            return 'salary_provision';
        }

        return 'other';
    }

    /**
     * Get payment due date (if applicable)
     */
    static getPaymentDueDate(txn) {
        // For salary payments, due date is typically 7th of next month
        // You can enhance this based on your business rules
        if (txn.paymentDueDate) {
            return this.formatDate(txn.paymentDueDate);
        }

        // Calculate based on transaction date if it's a provision
        if (txn.voucherType === 'Journal Entry' || txn.voucherType === 'JV') {
            try {
                const txnDate = new Date(txn.date);
                const dueDate = new Date(txnDate.getFullYear(), txnDate.getMonth() + 1, 7);
                return this.formatDate(dueDate.toISOString());
            } catch {
                return '-';
            }
        }

        return '-';
    }

    /**
     * Format date for display
     */
    static formatDate(dateString) {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: '2-digit'
            }).replace(/-/g, '-');
        } catch {
            return dateString;
        }
    }

    /**
     * Format amount for display
     */
    static formatAmount(amount) {
        return new Intl.NumberFormat('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    }

    /**
     * Get summary statistics
     */
    static getSalaryPayableSummary(transactions) {
        let totalProvision = 0;
        let totalPayment = 0;
        let closingBalance = 0;
        let balanceType = 'CR';

        transactions.forEach(txn => {
            if (txn.entryType !== 'opening') {
                const debit = txn.debit !== '-' ? parseFloat(txn.debit.replace(/,/g, '')) : 0;
                const credit = txn.credit !== '-' ? parseFloat(txn.credit.replace(/,/g, '')) : 0;

                totalProvision += credit; // Credit increases liability
                totalPayment += debit;   // Debit decreases liability
            }
        });

        // Calculate closing balance from last transaction
        if (transactions.length > 0) {
            const lastTxn = transactions[transactions.length - 1];
            const balanceParts = lastTxn.runningBalance.split(' ');
            closingBalance = parseFloat(balanceParts[0].replace(/,/g, ''));
            balanceType = balanceParts[1];
        }

        return {
            totalProvision: totalProvision,
            totalPayment: totalPayment,
            closingBalance: closingBalance,
            balanceType: balanceType,
            netLiability: closingBalance // Same as closing balance
        };
    }

    /**
     * Get monthly breakdown
     */
    static getMonthlyBreakdown(transactions) {
        const monthlyData = {};

        transactions.forEach(txn => {
            if (txn.entryType === 'opening') return;

            try {
                const date = new Date(txn.date);
                const monthKey = date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });

                if (!monthlyData[monthKey]) {
                    monthlyData[monthKey] = {
                        provision: 0,
                        payment: 0,
                        netChange: 0
                    };
                }

                const debit = txn.debit !== '-' ? parseFloat(txn.debit.replace(/,/g, '')) : 0;
                const credit = txn.credit !== '-' ? parseFloat(txn.credit.replace(/,/g, '')) : 0;

                monthlyData[monthKey].provision += credit;
                monthlyData[monthKey].payment += debit;
                monthlyData[monthKey].netChange += (credit - debit);

            } catch (error) {
                console.error('Error processing transaction for monthly breakdown:', error);
            }
        });

        return monthlyData;
    }
}

// GST Ledger Service - Manages GST liability accounts with transactions
// Handles CGST, SGST, IGST, and Service Tax ledgers

/**
 * Helper function to safely get items from localStorage
 */
const safeGetItem = (key, defaultValue = []) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error(`Error parsing ${key} from localStorage:`, error);
        return defaultValue;
    }
};

export class GSTLedgerService {
    /**
     * Get all GST ledgers from Chart of Accounts
     * @returns {Array} Array of GST ledger objects
     */
    static getAllGSTLedgers() {
        try {
            const chartOfAccounts = safeGetItem('chartOfAccounts', []);

            // Convert to array if it's an object
            const accountsArray = Array.isArray(chartOfAccounts)
                ? chartOfAccounts
                : Object.values(chartOfAccounts);

            // Filter GST ledgers (L3001, L3002, L3003, L3004)
            const gstLedgers = accountsArray.filter(account =>
                account.code && (
                    account.code === 'L3001' || // CGST PAYABLE
                    account.code === 'L3002' || // SGST PAYABLE
                    account.code === 'L3003' || // IGST PAYABLE
                    account.code === 'L3004'    // SERVICE TAX PAYABLE
                )
            );

            console.log('📋 All GST Ledgers:', gstLedgers.length);
            return gstLedgers;
        } catch (error) {
            console.error('❌ Error in getAllGSTLedgers:', error);
            return [];
        }
    }

    /**
     * Get GST ledger by GL code
     * @param {string} glCode - GST ledger GL code (L3001, L3002, L3003, L3004)
     * @returns {Object|null} GST ledger object
     */
    static getGSTLedgerByCode(glCode) {
        try {
            const chartOfAccounts = safeGetItem('chartOfAccounts', []);

            const accountsArray = Array.isArray(chartOfAccounts)
                ? chartOfAccounts
                : Object.values(chartOfAccounts);

            const ledger = accountsArray.find(account => account.code === glCode);

            if (!ledger) {
                console.warn(`⚠️ GST Ledger not found: ${glCode}`);
                return null;
            }

            return {
                glCode: ledger.code,
                ledgerName: ledger.name,
                accountName: ledger.name,
                ledgerType: 'Liability',
                category: 'Current Liabilities - Statutory Liabilities',
                parentCode: 'L3000',
                description: ledger.description || '',
                gstType: this.getGSTType(glCode),
                rate: this.getGSTRate(glCode)
            };
        } catch (error) {
            console.error(`❌ Error in getGSTLedgerByCode(${glCode}):`, error);
            return null;
        }
    }

    /**
     * Get GST type from GL code
     * @param {string} glCode - GST ledger GL code
     * @returns {string} GST type
     */
    static getGSTType(glCode) {
        const gstTypes = {
            'L3001': 'CGST',
            'L3002': 'SGST',
            'L3003': 'IGST',
            'L3004': 'SERVICE TAX'
        };
        return gstTypes[glCode] || 'Unknown';
    }

    /**
     * Get GST rate from GL code
     * @param {string} glCode - GST ledger GL code
     * @returns {number} GST rate percentage
     */
    static getGSTRate(glCode) {
        const gstRates = {
            'L3001': 9,  // CGST @ 9%
            'L3002': 9,  // SGST @ 9%
            'L3003': 18, // IGST @ 18%
            'L3004': 0   // SERVICE TAX (legacy)
        };
        return gstRates[glCode] || 0;
    }

    /**
     * Get GST ledger with full transaction history
     * @param {string} glCode - GST ledger GL code
     * @returns {Object} Ledger object with entries
     */
    static getGSTLedgerWithTransactions(glCode) {
        try {
            const ledger = this.getGSTLedgerByCode(glCode);
            if (!ledger) {
                throw new Error(`GST ledger not found: ${glCode}`);
            }

            const transactions = safeGetItem('transactions', []);

            // Filter transactions that involve this GST account
            const relevantTxns = transactions.filter(txn =>
                txn.entries?.some(e => e.glCode === glCode)
            );

            console.log(`\n💰 ============ GST LEDGER: ${glCode} (${ledger.ledgerName}) ============`);
            console.log(`📦 Total Transactions in localStorage:`, transactions.length);
            console.log(`✅ Relevant Transactions for ${glCode}:`, relevantTxns.length);

            // Sort by date ascending
            relevantTxns.sort((a, b) => new Date(a.date) - new Date(b.date));

            // Build ledger entries with running balance (Credit balance for liability)
            const entries = [];
            let runningBalance = 0;

            // Group entries by transaction ID and consolidate multiple entries for same GL code
            const consolidatedTxns = relevantTxns.map(txn => {
                // Find all entries for this GST GL code in the transaction
                const gstEntries = txn.entries.filter(e => e.glCode === glCode);

                console.log(`\n🔍 Transaction: ${txn.invoiceNumber || txn.voucherNo}`);
                console.log(`   Raw Entries with ${glCode}:`, gstEntries.length);
                gstEntries.forEach((entry, idx) => {
                    console.log(`   Entry ${idx + 1}: Debit: ₹${entry.debit || 0}, Credit: ₹${entry.credit || 0}, Narration: ${entry.narration}`);
                });

                if (gstEntries.length === 0) return null;

                // Consolidate multiple entries into one
                const totalDebit = gstEntries.reduce((sum, e) => sum + (e.debit || 0), 0);
                const totalCredit = gstEntries.reduce((sum, e) => sum + (e.credit || 0), 0);

                // Get client/customer info from transaction
                const clientEntry = txn.entries.find(e => e.glCode && e.glCode.startsWith('D'));

                // Build description showing count if multiple entries
                const description = gstEntries.length > 1
                    ? `${gstEntries[0].narration || txn.narration || 'GST Transaction'} (${gstEntries.length} items)`
                    : gstEntries[0].narration || txn.narration || 'GST Transaction';

                console.log(`   ✨ CONSOLIDATED: Debit: ₹${totalDebit}, Credit: ₹${totalCredit} (${gstEntries.length} entries combined)`);

                return {
                    date: txn.date,
                    voucherNo: txn.voucherNo,
                    voucherType: txn.voucherType || 'Journal',
                    description: description,
                    customer: txn.customer || clientEntry?.glName || '-',
                    invoiceNumber: txn.invoiceNumber || gstEntries[0].invoiceNumber || '-',
                    irnNumber: txn.irnNumber || '-',
                    debit: totalDebit,
                    credit: totalCredit,
                    costCenter: gstEntries[0].costCenter || 'HEAD OFFICE',
                    status: txn.status || 'Posted',
                    createdBy: txn.createdBy || 'System',
                    createdAt: txn.createdAt || txn.date,
                    transactionId: txn.id,
                    itemCount: gstEntries.length
                };
            }).filter(Boolean); // Remove nulls

            // Now build entries with running balance
            consolidatedTxns.forEach(entry => {
                // For GST Liability: Credit increases (payable), Debit decreases (paid)
                runningBalance += entry.credit - entry.debit;

                entries.push({
                    ...entry,
                    balance: runningBalance
                });
            });

            console.log(`\n📝 FINAL LEDGER ENTRIES: ${entries.length}`);
            entries.forEach((entry, idx) => {
                console.log(`${idx + 1}. ${entry.date} | ${entry.invoiceNumber} | Dr: ₹${entry.debit} | Cr: ₹${entry.credit} | Bal: ₹${entry.balance} ${entry.itemCount > 1 ? `(${entry.itemCount} items)` : ''}`);
            });
            console.log(`💰 Total Credit: ₹${entries.reduce((sum, e) => sum + e.credit, 0).toFixed(2)}`);
            console.log(`💸 Total Debit: ₹${entries.reduce((sum, e) => sum + e.debit, 0).toFixed(2)}`);
            console.log(`🎯 Outstanding Liability: ₹${runningBalance.toFixed(2)}`);
            console.log(`============================================================\n`);

            return {
                glCode: glCode,
                ledgerName: ledger.ledgerName,
                accountName: ledger.accountName,
                ledgerType: 'Liability',
                category: 'Current Liabilities - Statutory Liabilities',
                parentCode: 'L3000',
                gstType: ledger.gstType,
                rate: ledger.rate,
                financialYear: '2025-26',
                period: 'Jan 2026',
                openingBalance: 0,
                currentBalance: runningBalance,
                balanceType: runningBalance >= 0 ? 'Cr' : 'Dr',
                totalDebit: entries.reduce((sum, e) => sum + e.debit, 0),
                totalCredit: entries.reduce((sum, e) => sum + e.credit, 0),
                outstandingLiability: runningBalance,
                transactionCount: entries.length,
                entries: entries
            };
        } catch (error) {
            console.error(`❌ Error in getGSTLedgerWithTransactions(${glCode}):`, error);
            return {
                glCode: glCode,
                ledgerName: 'Unknown GST Ledger',
                ledgerType: 'Liability',
                category: 'Current Liabilities',
                entries: [],
                error: error.message
            };
        }
    }

    /**
     * Get GST summary across all GST ledgers
     * @returns {Object} Summary of GST liabilities
     */
    static getGSTSummary() {
        try {
            const gstLedgers = this.getAllGSTLedgers();
            const transactions = safeGetItem('transactions', []);

            const summary = {
                cgst: { code: 'L3001', name: 'CGST PAYABLE', amount: 0, count: 0 },
                sgst: { code: 'L3002', name: 'SGST PAYABLE', amount: 0, count: 0 },
                igst: { code: 'L3003', name: 'IGST PAYABLE', amount: 0, count: 0 },
                serviceTax: { code: 'L3004', name: 'SERVICE TAX PAYABLE', amount: 0, count: 0 },
                totalGST: 0,
                totalTransactions: 0
            };

            // Calculate amounts for each GST type
            gstLedgers.forEach(ledger => {
                const relevantTxns = transactions.filter(txn =>
                    txn.entries?.some(e => e.glCode === ledger.code)
                );

                let balance = 0;
                relevantTxns.forEach(txn => {
                    txn.entries
                        .filter(e => e.glCode === ledger.code)
                        .forEach(entry => {
                            balance += (entry.credit || 0) - (entry.debit || 0);
                        });
                });

                const key = ledger.code === 'L3001' ? 'cgst' :
                    ledger.code === 'L3002' ? 'sgst' :
                        ledger.code === 'L3003' ? 'igst' : 'serviceTax';

                summary[key].amount = balance;
                summary[key].count = relevantTxns.length;
                summary.totalGST += balance;
                summary.totalTransactions += relevantTxns.length;
            });

            return summary;
        } catch (error) {
            console.error('❌ Error in getGSTSummary:', error);
            return null;
        }
    }

    /**
     * Get monthly GST breakdown
     * @param {string} month - Month in format 'YYYY-MM'
     * @returns {Object} Monthly GST breakdown
     */
    static getMonthlyGSTBreakdown(month) {
        try {
            const transactions = safeGetItem('transactions', []);
            const gstLedgers = this.getAllGSTLedgers();

            const monthlyData = {
                month: month,
                cgst: 0,
                sgst: 0,
                igst: 0,
                serviceTax: 0,
                total: 0,
                invoices: []
            };

            gstLedgers.forEach(ledger => {
                const monthTxns = transactions.filter(txn => {
                    const txnMonth = new Date(txn.date).toISOString().substring(0, 7);
                    return txnMonth === month && txn.entries?.some(e => e.glCode === ledger.code);
                });

                monthTxns.forEach(txn => {
                    const gstAmount = txn.entries
                        .filter(e => e.glCode === ledger.code)
                        .reduce((sum, e) => sum + (e.credit || 0) - (e.debit || 0), 0);

                    const key = ledger.code === 'L3001' ? 'cgst' :
                        ledger.code === 'L3002' ? 'sgst' :
                            ledger.code === 'L3003' ? 'igst' : 'serviceTax';

                    monthlyData[key] += gstAmount;
                    monthlyData.total += gstAmount;

                    if (!monthlyData.invoices.includes(txn.invoiceNumber)) {
                        monthlyData.invoices.push(txn.invoiceNumber);
                    }
                });
            });

            return monthlyData;
        } catch (error) {
            console.error('❌ Error in getMonthlyGSTBreakdown:', error);
            return null;
        }
    }

    /**
     * Get GST ledger by type (CGST, SGST, IGST, SERVICE_TAX)
     * @param {string} gstType - Type of GST
     * @returns {Object|null} GST ledger
     */
    static getGSTLedgerByType(gstType) {
        const gstCodeMap = {
            'CGST': 'L3001',
            'SGST': 'L3002',
            'IGST': 'L3003',
            'SERVICE_TAX': 'L3004'
        };

        const glCode = gstCodeMap[gstType.toUpperCase()];
        return glCode ? this.getGSTLedgerByCode(glCode) : null;
    }

    /**
     * Validate GST calculation for an invoice
     * @param {string} invoiceNumber - Invoice number to validate
     * @returns {Object} Validation result
     */
    static validateGSTCalculation(invoiceNumber) {
        try {
            const transactions = safeGetItem('transactions', []);
            const invoice = transactions.find(txn => txn.invoiceNumber === invoiceNumber);

            if (!invoice) {
                return { valid: false, error: 'Invoice not found' };
            }

            // Get taxable amount (revenue entries)
            const taxableAmount = invoice.entries
                .filter(e => e.glCode && e.glCode.startsWith('R'))
                .reduce((sum, e) => sum + (e.credit || 0), 0);

            // Get GST amounts
            const cgst = invoice.entries
                .filter(e => e.glCode === 'L3001')
                .reduce((sum, e) => sum + (e.credit || 0), 0);

            const sgst = invoice.entries
                .filter(e => e.glCode === 'L3002')
                .reduce((sum, e) => sum + (e.credit || 0), 0);

            const igst = invoice.entries
                .filter(e => e.glCode === 'L3003')
                .reduce((sum, e) => sum + (e.credit || 0), 0);

            // Calculate expected GST
            const expectedCGST = taxableAmount * 0.09;
            const expectedSGST = taxableAmount * 0.09;
            const expectedIGST = taxableAmount * 0.18;

            const validation = {
                valid: true,
                invoiceNumber: invoiceNumber,
                taxableAmount: taxableAmount,
                actualGST: { cgst, sgst, igst, total: cgst + sgst + igst },
                expectedGST: { cgst: expectedCGST, sgst: expectedSGST, igst: expectedIGST },
                differences: {
                    cgst: Math.abs(cgst - expectedCGST),
                    sgst: Math.abs(sgst - expectedSGST),
                    igst: Math.abs(igst - expectedIGST)
                }
            };

            // Check if differences are within tolerance (₹1)
            validation.valid = validation.differences.cgst < 1 &&
                validation.differences.sgst < 1 &&
                validation.differences.igst < 1;

            return validation;
        } catch (error) {
            console.error('❌ Error in validateGSTCalculation:', error);
            return { valid: false, error: error.message };
        }
    }
}

export default GSTLedgerService;

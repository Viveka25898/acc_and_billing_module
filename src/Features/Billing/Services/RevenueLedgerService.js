/* eslint-disable no-unused-vars */
/**
 * Revenue Ledger Service
 * Handles all operations related to Revenue Accounts
 * GL Codes: R1001001 - R1001010 (10 revenue ledgers)
 */

import { safeGetItem, safeSetItem } from '../../Master/utils/accountingHelpers';
import { REVENUE_LEDGER_MAPPING } from '../data/billingCalculationData';

export class RevenueLedgerService {
    /**
     * Get all revenue ledgers
     * @returns {Array} Array of revenue ledger objects
     */
    static getAllRevenueLedgers() {
        try {
            let revenueLedgers = safeGetItem('revenueLedgers', []);
            // Ensure revenueLedgers is always an array
            if (!Array.isArray(revenueLedgers)) {
                revenueLedgers = Object.values(revenueLedgers || {});
            }
            const chartOfAccounts = safeGetItem('chartOfAccounts', []);

            // Get all revenue ledger codes from mapping
            const revenueCodes = Object.values(REVENUE_LEDGER_MAPPING).map(r => r.code);

            // Merge with chart of accounts data
            const ledgers = revenueCodes.map(code => {
                const ledgerData = revenueLedgers.find(r => r.glCode === code);
                const accountData = chartOfAccounts.find(acc => acc.code === code);
                const mappingData = Object.values(REVENUE_LEDGER_MAPPING).find(r => r.code === code);

                return {
                    glCode: code,
                    ledgerName: mappingData?.name || accountData?.name || 'Revenue',
                    accountName: accountData?.name || mappingData?.name,
                    balance: accountData?.balance || 0,
                    category: 'Revenue',
                    parentCode: 'R1001',
                    gstApplicable: mappingData?.gstApplicable !== false,
                    description: ledgerData?.description || '',
                    createdAt: ledgerData?.createdAt || accountData?.createdAt,
                    isActive: true
                };
            });

            return ledgers;
        } catch (error) {
            console.error('❌ Error in getAllRevenueLedgers:', error);
            return [];
        }
    }

    /**
     * Get revenue ledger by GL code
     * @param {string} glCode - Revenue GL code (e.g., R1001001)
     * @returns {Object|null} Revenue ledger object or null
     */
    static getRevenueLedgerByCode(glCode) {
        try {
            let revenueLedgers = safeGetItem('revenueLedgers', []);
            // Ensure revenueLedgers is always an array
            if (!Array.isArray(revenueLedgers)) {
                revenueLedgers = Object.values(revenueLedgers || {});
            }
            const chartOfAccounts = safeGetItem('chartOfAccounts', []);

            const ledgerData = revenueLedgers.find(r => r.glCode === glCode);
            const accountData = chartOfAccounts.find(acc => acc.code === glCode);
            const mappingData = Object.values(REVENUE_LEDGER_MAPPING).find(r => r.code === glCode);

            if (!accountData && !ledgerData && !mappingData) {
                return null;
            }

            return {
                glCode: glCode,
                ledgerName: mappingData?.name || accountData?.name || 'Revenue',
                accountName: accountData?.name || mappingData?.name,
                balance: accountData?.balance || 0,
                category: 'Revenue',
                parentCode: 'R1001',
                gstApplicable: mappingData?.gstApplicable !== false,
                description: ledgerData?.description || '',
                createdAt: ledgerData?.createdAt || accountData?.createdAt,
                isActive: true
            };
        } catch (error) {
            console.error(`❌ Error in getRevenueLedgerByCode(${glCode}):`, error);
            return null;
        }
    }

    /**
     * Get revenue ledger by name
     * @param {string} ledgerName - Revenue ledger name
     * @returns {Object|null} Revenue ledger object or null
     */
    static getRevenueLedgerByName(ledgerName) {
        try {
            const mappingData = Object.values(REVENUE_LEDGER_MAPPING).find(
                r => r.name.toLowerCase() === ledgerName.toLowerCase()
            );

            if (!mappingData) {
                return null;
            }

            return this.getRevenueLedgerByCode(mappingData.code);
        } catch (error) {
            console.error(`❌ Error in getRevenueLedgerByName(${ledgerName}):`, error);
            return null;
        }
    }

    /**
     * Get revenue ledger with full transaction history
     * @param {string} glCode - Revenue GL code
     * @returns {Object} Ledger object with entries
     */
    static getRevenueLedgerWithTransactions(glCode) {
        try {
            const ledger = this.getRevenueLedgerByCode(glCode);
            if (!ledger) {
                throw new Error(`Revenue ledger not found: ${glCode}`);
            }

            const transactions = safeGetItem('transactions', []);

            // Filter transactions that involve this revenue account
            const relevantTxns = transactions.filter(txn =>
                txn.entries?.some(e => e.glCode === glCode)
            );

            console.log(`\n📊 ============ REVENUE LEDGER: ${glCode} (${ledger.ledgerName}) ============`);
            console.log(`📦 Total Transactions in localStorage:`, transactions.length);
            console.log(`✅ Relevant Transactions for ${glCode}:`, relevantTxns.length);

            // Sort by date ascending
            relevantTxns.sort((a, b) => new Date(a.date) - new Date(b.date));

            // Build ledger entries with running balance (Credit balance for revenue)
            const entries = [];
            let runningBalance = 0;

            // Group entries by transaction ID and consolidate multiple entries for same GL code
            const consolidatedTxns = relevantTxns.map(txn => {
                // Find all entries for this revenue GL code in the transaction
                const revenueEntries = txn.entries.filter(e => e.glCode === glCode);

                console.log(`\n🔍 Transaction: ${txn.invoiceNumber || txn.voucherNo}`);
                console.log(`   Raw Entries with ${glCode}:`, revenueEntries.length);
                revenueEntries.forEach((entry, idx) => {
                    console.log(`   Entry ${idx + 1}: Debit: ₹${entry.debit || 0}, Credit: ₹${entry.credit || 0}, Narration: ${entry.narration}`);
                });

                if (revenueEntries.length === 0) return null;

                // Consolidate multiple entries into one
                const totalDebit = revenueEntries.reduce((sum, e) => sum + (e.debit || 0), 0);
                const totalCredit = revenueEntries.reduce((sum, e) => sum + (e.credit || 0), 0);

                // Get client/customer info from transaction
                const clientEntry = txn.entries.find(e => e.glCode && e.glCode.startsWith('D'));

                // Collect unique HSN codes and GST rates
                const hsnCodes = [...new Set(revenueEntries.map(e => e.hsnCode).filter(Boolean))];
                const gstRates = [...new Set(revenueEntries.map(e => e.gstRate).filter(Boolean))];

                // Build description showing count if multiple entries
                const description = revenueEntries.length > 1
                    ? `${revenueEntries[0].narration || txn.narration || 'Revenue'} (${revenueEntries.length} items)`
                    : revenueEntries[0].narration || txn.narration || 'Revenue';

                console.log(`   ✨ CONSOLIDATED: Debit: ₹${totalDebit}, Credit: ₹${totalCredit} (${revenueEntries.length} entries combined)`);

                return {
                    date: txn.date,
                    voucherNo: txn.voucherNo,
                    voucherType: txn.voucherType || 'Journal',
                    description: description,
                    customer: txn.customer || clientEntry?.glName || '-',
                    invoiceNumber: txn.invoiceNumber || revenueEntries[0].invoiceNumber || '-',
                    irnNumber: txn.irnNumber || '-',
                    debit: totalDebit,
                    credit: totalCredit,
                    costCenter: revenueEntries[0].costCenter || 'HEAD OFFICE',
                    hsnCode: hsnCodes.join(', ') || '-',
                    gstRate: gstRates.length > 0 ? gstRates[0] : 0,
                    status: txn.status || 'Posted',
                    createdBy: txn.createdBy || 'System',
                    createdAt: txn.createdAt || txn.date,
                    transactionId: txn.id,
                    itemCount: revenueEntries.length
                };
            }).filter(Boolean); // Remove nulls

            // Now build entries with running balance
            consolidatedTxns.forEach(entry => {
                // For Revenue (Income): Credit increases, Debit decreases
                runningBalance += entry.credit - entry.debit;

                entries.push({
                    ...entry,
                    balance: runningBalance
                });
                console.log(`\n📝 FINAL LEDGER ENTRIES: ${entries.length}`);
                entries.forEach((entry, idx) => {
                    console.log(`${idx + 1}. ${entry.date} | ${entry.invoiceNumber} | Dr: ₹${entry.debit} | Cr: ₹${entry.credit} | Bal: ₹${entry.balance} ${entry.itemCount > 1 ? `(${entry.itemCount} items)` : ''}`);
                });
                console.log(`💰 Total Credit: ₹${entries.reduce((sum, e) => sum + e.credit, 0).toFixed(2)}`);
                console.log(`💸 Total Debit: ₹${entries.reduce((sum, e) => sum + e.debit, 0).toFixed(2)}`);
                console.log(`🎯 Net Revenue: ₹${runningBalance.toFixed(2)}`);
                console.log(`============================================================\n`);

            });

            return {
                glCode: glCode,
                ledgerName: ledger.ledgerName,
                accountName: ledger.accountName,
                ledgerType: 'Income',
                category: 'Revenue - Operating Income',
                parentCode: 'R1001',
                gstApplicable: ledger.gstApplicable,
                financialYear: '2025-26',
                period: 'Jan 2026',
                openingBalance: 0,
                currentBalance: runningBalance,
                balanceType: runningBalance >= 0 ? 'Cr' : 'Dr',
                totalDebit: entries.reduce((sum, e) => sum + e.debit, 0),
                totalCredit: entries.reduce((sum, e) => sum + e.credit, 0),
                netRevenue: runningBalance,
                transactionCount: entries.length,
                entries: entries
            };
        } catch (error) {
            console.error(`❌ Error in getRevenueLedgerWithTransactions(${glCode}):`, error);
            return {
                glCode: glCode,
                ledgerName: 'Unknown Revenue',
                ledgerType: 'Income',
                category: 'Revenue',
                entries: [],
                error: error.message
            };
        }
    }

    /**
     * Get revenue summary for all ledgers
     * @returns {Object} Summary of all revenue ledgers
     */
    static getRevenueSummary() {
        try {
            const ledgers = this.getAllRevenueLedgers();
            const chartOfAccounts = safeGetItem('chartOfAccounts', []);

            const summary = ledgers.map(ledger => {
                const accountData = chartOfAccounts.find(acc => acc.code === ledger.glCode);
                const balance = accountData?.balance || 0;

                return {
                    glCode: ledger.glCode,
                    ledgerName: ledger.ledgerName,
                    revenue: Math.abs(balance), // Revenue is credit balance, show as positive
                    gstApplicable: ledger.gstApplicable,
                    percentage: 0 // Will be calculated after total
                };
            });

            const totalRevenue = summary.reduce((sum, s) => sum + s.revenue, 0);

            // Calculate percentages
            summary.forEach(s => {
                s.percentage = totalRevenue > 0 ? ((s.revenue / totalRevenue) * 100).toFixed(2) : 0;
            });

            return {
                totalRevenue: totalRevenue,
                ledgerCount: ledgers.length,
                activeLedgers: ledgers.filter(l => l.isActive).length,
                ledgers: summary.sort((a, b) => b.revenue - a.revenue),
                periodStart: '01/01/2026',
                periodEnd: '19/01/2026'
            };
        } catch (error) {
            console.error('❌ Error in getRevenueSummary:', error);
            return {
                totalRevenue: 0,
                ledgerCount: 0,
                activeLedgers: 0,
                ledgers: [],
                error: error.message
            };
        }
    }

    /**
     * Get revenue by service type
     * @returns {Object} Revenue grouped by service type
     */
    static getRevenueByServiceType() {
        try {
            const ledgers = this.getAllRevenueLedgers();
            const chartOfAccounts = safeGetItem('chartOfAccounts', []);

            const serviceTypes = {
                'Housekeeping': ['R1001001', 'R1001002', 'R1001005001', 'R1001005002', 'R1001007'],
                'Manpower': ['R1001009'],
                'Machinery': ['R1001008'],
                'Services': ['R1001003'],
                'Others': ['R1001004', 'R1001010']
            };

            const revenueByType = {};

            Object.keys(serviceTypes).forEach(type => {
                const codes = serviceTypes[type];
                const typeRevenue = codes.reduce((sum, code) => {
                    const accountData = chartOfAccounts.find(acc => acc.code === code);
                    return sum + Math.abs(accountData?.balance || 0);
                }, 0);

                revenueByType[type] = typeRevenue;
            });

            const totalRevenue = Object.values(revenueByType).reduce((sum, val) => sum + val, 0);

            return {
                revenueByType: revenueByType,
                totalRevenue: totalRevenue,
                chartData: Object.keys(revenueByType).map(type => ({
                    name: type,
                    value: revenueByType[type],
                    percentage: totalRevenue > 0 ? ((revenueByType[type] / totalRevenue) * 100).toFixed(2) : 0
                }))
            };
        } catch (error) {
            console.error('❌ Error in getRevenueByServiceType:', error);
            return {
                revenueByType: {},
                totalRevenue: 0,
                chartData: [],
                error: error.message
            };
        }
    }

    /**
     * Get monthly revenue trend
     * @param {number} months - Number of months to retrieve (default 6)
     * @returns {Array} Monthly revenue data
     */
    static getMonthlyRevenueTrend(months = 6) {
        try {
            const transactions = safeGetItem('transactions', []);
            const revenueCodes = Object.values(REVENUE_LEDGER_MAPPING).map(r => r.code);

            // Get revenue transactions
            const revenueTxns = transactions.filter(txn =>
                txn.voucherType === 'Sales Invoice' &&
                txn.entries?.some(e => revenueCodes.includes(e.glCode))
            );

            // Group by month
            const monthlyData = {};

            revenueTxns.forEach(txn => {
                const date = new Date(txn.date);
                const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

                if (!monthlyData[monthKey]) {
                    monthlyData[monthKey] = {
                        month: monthKey,
                        revenue: 0,
                        invoiceCount: 0
                    };
                }

                monthlyData[monthKey].revenue += txn.totalCredit || 0;
                monthlyData[monthKey].invoiceCount += 1;
            });

            // Convert to array and sort by month
            const trend = Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));

            return {
                trend: trend,
                averageMonthlyRevenue: trend.length > 0
                    ? trend.reduce((sum, m) => sum + m.revenue, 0) / trend.length
                    : 0,
                totalInvoices: trend.reduce((sum, m) => sum + m.invoiceCount, 0)
            };
        } catch (error) {
            console.error('❌ Error in getMonthlyRevenueTrend:', error);
            return {
                trend: [],
                averageMonthlyRevenue: 0,
                totalInvoices: 0,
                error: error.message
            };
        }
    }

    /**
     * Search revenue ledgers
     * @param {string} searchTerm - Search term
     * @returns {Array} Matching revenue ledgers
     */
    static searchRevenueLedgers(searchTerm) {
        try {
            if (!searchTerm || searchTerm.trim() === '') {
                return this.getAllRevenueLedgers();
            }

            const ledgers = this.getAllRevenueLedgers();
            const term = searchTerm.toLowerCase();

            return ledgers.filter(ledger =>
                ledger.glCode.toLowerCase().includes(term) ||
                ledger.ledgerName.toLowerCase().includes(term) ||
                ledger.description?.toLowerCase().includes(term)
            );
        } catch (error) {
            console.error(`❌ Error in searchRevenueLedgers(${searchTerm}):`, error);
            return [];
        }
    }

    /**
     * Get top revenue generating services
     * @param {number} limit - Number of top services to return
     * @returns {Array} Top revenue services
     */
    static getTopRevenueServices(limit = 5) {
        try {
            const summary = this.getRevenueSummary();
            return summary.ledgers.slice(0, limit);
        } catch (error) {
            console.error(`❌ Error in getTopRevenueServices:`, error);
            return [];
        }
    }
}

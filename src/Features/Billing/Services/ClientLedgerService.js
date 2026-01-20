/**
 * Client Ledger Service
 * Handles all operations related to Sundry Debtors (Client Accounts)
 * GL Codes: D001, D002, D003, etc. under A3003001 SUNDRY DEBTORS
 */

import { safeGetItem, safeSetItem } from '../../Master/utils/accountingHelpers';

export class ClientLedgerService {
    /**
     * Get all client ledgers
     * @returns {Array} Array of client ledger objects
     */
    static getAllClients() {
        try {
            let clientLedgers = safeGetItem('clientLedgers', []);
            // Ensure clientLedgers is always an array
            if (!Array.isArray(clientLedgers)) {
                clientLedgers = Object.values(clientLedgers || {});
            }
            const chartOfAccounts = safeGetItem('chartOfAccounts', []);

            // Merge with chart of accounts data
            return clientLedgers.map(client => {
                const accountData = chartOfAccounts.find(acc => acc.code === client.glCode);
                return {
                    ...client,
                    accountName: accountData?.name || client.clientName,
                    balance: accountData?.balance || 0,
                    category: 'Sundry Debtors',
                    parentCode: 'A3003001'
                };
            });
        } catch (error) {
            console.error('❌ Error in getAllClients:', error);
            return [];
        }
    }

    /**
     * Get client ledger by GL code
     * @param {string} glCode - Client GL code (e.g., D001)
     * @returns {Object|null} Client ledger object or null
     */
    static getClientByCode(glCode) {
        try {
            let clientLedgers = safeGetItem('clientLedgers', []);
            // Ensure clientLedgers is always an array
            if (!Array.isArray(clientLedgers)) {
                clientLedgers = Object.values(clientLedgers || {});
            }
            const chartOfAccounts = safeGetItem('chartOfAccounts', []);
            const accountData = chartOfAccounts.find(acc => acc.code === glCode);

            // If not found in clientLedgers but exists in chart of accounts, create entry
            let client = clientLedgers.find(c => c.glCode === glCode);

            if (!client && accountData) {
                // Client exists in chart of accounts but not in clientLedgers
                // Extract client name from account name and create basic entry
                client = {
                    glCode: glCode,
                    clientName: accountData.name,
                    createdAt: accountData.createdAt || new Date().toISOString(),
                    isActive: true
                };
            }

            if (!client) {
                return null;
            }

            return {
                ...client,
                accountName: accountData?.name || client.clientName,
                balance: accountData?.balance || 0,
                category: 'Sundry Debtors',
                parentCode: 'A3003001'
            };
        } catch (error) {
            console.error(`❌ Error in getClientByCode(${glCode}):`, error);
            return null;
        }
    }

    /**
     * Get client ledger by client name
     * @param {string} clientName - Client name
     * @returns {Object|null} Client ledger object or null
     */
    static getClientByName(clientName) {
        try {
            let clientLedgers = safeGetItem('clientLedgers', []);
            // Ensure clientLedgers is always an array
            if (!Array.isArray(clientLedgers)) {
                clientLedgers = Object.values(clientLedgers || {});
            }
            const client = clientLedgers.find(
                c => c.clientName?.toLowerCase() === clientName?.toLowerCase()
            );

            if (!client) {
                return null;
            }

            return this.getClientByCode(client.glCode);
        } catch (error) {
            console.error(`❌ Error in getClientByName(${clientName}):`, error);
            return null;
        }
    }

    /**
     * Get client ledger with full transaction history
     * @param {string} glCode - Client GL code
     * @returns {Object} Ledger object with entries
     */
    static getClientLedgerWithTransactions(glCode) {
        try {
            const client = this.getClientByCode(glCode);
            if (!client) {
                throw new Error(`Client ledger not found: ${glCode}`);
            }

            const transactions = safeGetItem('transactions', []);

            // Filter transactions that involve this client
            const relevantTxns = transactions.filter(txn =>
                txn.entries?.some(e => e.glCode === glCode)
            );

            console.log(`\n📋 ============ CLIENT LEDGER: ${glCode} (${client.clientName}) ============`);
            console.log(`📦 Total Transactions in localStorage:`, transactions.length);
            console.log(`✅ Relevant Transactions for ${glCode}:`, relevantTxns.length);

            // Sort by date ascending
            relevantTxns.sort((a, b) => new Date(a.date) - new Date(b.date));

            // Build ledger entries with running balance (Debit balance for asset/receivable)
            const entries = [];
            let runningBalance = 0;

            // Group entries by transaction ID and consolidate multiple entries for same GL code
            const consolidatedTxns = relevantTxns.map(txn => {
                // Find all entries for this client GL code in the transaction
                const clientEntries = txn.entries.filter(e => e.glCode === glCode);

                console.log(`\n🔍 Transaction: ${txn.invoiceNumber || txn.voucherNo}`);
                console.log(`   Raw Entries with ${glCode}:`, clientEntries.length);
                clientEntries.forEach((entry, idx) => {
                    console.log(`   Entry ${idx + 1}: Debit: ₹${entry.debit || 0}, Credit: ₹${entry.credit || 0}, Narration: ${entry.narration}`);
                });

                if (clientEntries.length === 0) return null;

                // Consolidate multiple entries into one
                const totalDebit = clientEntries.reduce((sum, e) => sum + (e.debit || 0), 0);
                const totalCredit = clientEntries.reduce((sum, e) => sum + (e.credit || 0), 0);

                // Build description showing count if multiple entries
                const description = clientEntries.length > 1
                    ? `${clientEntries[0].narration || txn.narration || 'Transaction'} (${clientEntries.length} items)`
                    : clientEntries[0].narration || txn.narration || 'Transaction';

                console.log(`   ✨ CONSOLIDATED: Debit: ₹${totalDebit}, Credit: ₹${totalCredit} (${clientEntries.length} entries combined)`);

                return {
                    date: txn.date,
                    voucherNo: txn.voucherNo,
                    voucherType: txn.voucherType || 'Journal',
                    description: description,
                    invoiceNumber: txn.invoiceNumber || clientEntries[0].invoiceNumber || '-',
                    irnNumber: txn.irnNumber || '-',
                    debit: totalDebit,
                    credit: totalCredit,
                    costCenter: clientEntries[0].costCenter || 'HEAD OFFICE',
                    status: txn.status || 'Posted',
                    createdBy: txn.createdBy || 'System',
                    createdAt: txn.createdAt || txn.date,
                    transactionId: txn.id,
                    itemCount: clientEntries.length
                };
            }).filter(Boolean); // Remove nulls

            // Now build entries with running balance
            consolidatedTxns.forEach(entry => {
                // For Sundry Debtors (Asset): Debit increases, Credit decreases
                runningBalance += entry.debit - entry.credit;

                entries.push({
                    ...entry,
                    balance: runningBalance
                });
            });

            console.log(`\n📝 FINAL LEDGER ENTRIES: ${entries.length}`);
            entries.forEach((entry, idx) => {
                console.log(`${idx + 1}. ${entry.date} | ${entry.invoiceNumber} | Dr: ₹${entry.debit} | Cr: ₹${entry.credit} | Bal: ₹${entry.balance} ${entry.itemCount > 1 ? `(${entry.itemCount} items)` : ''}`);
            });
            console.log(`💰 Total Debit: ₹${entries.reduce((sum, e) => sum + e.debit, 0).toFixed(2)}`);
            console.log(`💸 Total Credit: ₹${entries.reduce((sum, e) => sum + e.credit, 0).toFixed(2)}`);
            console.log(`🎯 Outstanding Balance: ₹${runningBalance.toFixed(2)} ${runningBalance >= 0 ? 'Dr' : 'Cr'}`);
            console.log(`============================================================\n`);

            return {
                glCode: glCode,
                ledgerName: client.clientName,
                accountName: client.accountName,
                ledgerType: 'Asset',
                category: 'Sundry Debtors - Current Assets',
                parentCode: 'A3003001',
                financialYear: '2025-26',
                period: 'Jan 2026',
                openingBalance: 0,
                currentBalance: runningBalance,
                balanceType: runningBalance >= 0 ? 'Dr' : 'Cr',
                totalDebit: entries.reduce((sum, e) => sum + e.debit, 0),
                totalCredit: entries.reduce((sum, e) => sum + e.credit, 0),
                transactionCount: entries.length,
                entries: entries,
                clientDetails: {
                    branch: client.branch,
                    contactPerson: client.contactPerson,
                    email: client.email,
                    phone: client.phone,
                    address: client.address
                }
            };
        } catch (error) {
            console.error(`❌ Error in getClientLedgerWithTransactions(${glCode}):`, error);
            return {
                glCode: glCode,
                ledgerName: 'Unknown Client',
                ledgerType: 'Asset',
                category: 'Sundry Debtors',
                entries: [],
                error: error.message
            };
        }
    }

    /**
     * Get client outstanding summary
     * @returns {Object} Summary of all client outstandings
     */
    static getClientOutstandingSummary() {
        try {
            const clients = this.getAllClients();
            const chartOfAccounts = safeGetItem('chartOfAccounts', []);

            const summary = clients.map(client => {
                const accountData = chartOfAccounts.find(acc => acc.code === client.glCode);
                const balance = accountData?.balance || 0;

                return {
                    glCode: client.glCode,
                    clientName: client.clientName,
                    branch: client.branch,
                    outstanding: balance,
                    overdueAmount: 0, // Can be calculated based on invoice due dates
                    status: balance > 0 ? 'Outstanding' : 'Clear'
                };
            });

            const totalOutstanding = summary.reduce((sum, s) => sum + s.outstanding, 0);
            const clientsWithOutstanding = summary.filter(s => s.outstanding > 0).length;

            return {
                totalClients: clients.length,
                clientsWithOutstanding: clientsWithOutstanding,
                totalOutstanding: totalOutstanding,
                clients: summary.sort((a, b) => b.outstanding - a.outstanding)
            };
        } catch (error) {
            console.error('❌ Error in getClientOutstandingSummary:', error);
            return {
                totalClients: 0,
                clientsWithOutstanding: 0,
                totalOutstanding: 0,
                clients: [],
                error: error.message
            };
        }
    }

    /**
     * Get client's invoice history
     * @param {string} glCode - Client GL code
     * @returns {Array} Array of invoice transactions
     */
    static getClientInvoices(glCode) {
        try {
            const transactions = safeGetItem('transactions', []);

            // Filter for invoice transactions only
            const invoices = transactions.filter(txn =>
                txn.voucherType === 'Sales Invoice' &&
                txn.entries?.some(e => e.glCode === glCode)
            );

            return invoices.map(inv => ({
                transactionId: inv.id,
                invoiceNumber: inv.invoiceNumber,
                invoiceDate: inv.date,
                irnNumber: inv.irnNumber,
                acknowledgementNumber: inv.acknowledgementNumber,
                amount: inv.totalDebit,
                status: inv.status || 'Posted',
                billingPeriod: inv.billingPeriod,
                voucherNo: inv.voucherNo
            })).sort((a, b) => new Date(b.invoiceDate) - new Date(a.invoiceDate));
        } catch (error) {
            console.error(`❌ Error in getClientInvoices(${glCode}):`, error);
            return [];
        }
    }

    /**
     * Get client's payment history
     * @param {string} glCode - Client GL code
     * @returns {Array} Array of payment transactions
     */
    static getClientPayments(glCode) {
        try {
            const transactions = safeGetItem('transactions', []);

            // Filter for payment transactions (where client account is credited)
            const payments = transactions.filter(txn =>
                (txn.voucherType === 'Receipt' || txn.voucherType === 'Bank Receipt') &&
                txn.entries?.some(e => e.glCode === glCode && e.credit > 0)
            );

            return payments.map(pmt => ({
                transactionId: pmt.id,
                paymentDate: pmt.date,
                voucherNo: pmt.voucherNo,
                amount: pmt.entries.find(e => e.glCode === glCode)?.credit || 0,
                paymentMode: pmt.paymentMode || 'Bank Transfer',
                referenceNumber: pmt.referenceNumber || '-',
                status: pmt.status || 'Posted'
            })).sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate));
        } catch (error) {
            console.error(`❌ Error in getClientPayments(${glCode}):`, error);
            return [];
        }
    }

    /**
     * Update client details
     * @param {string} glCode - Client GL code
     * @param {Object} updates - Fields to update
     * @returns {Object} Result object with success status
     */
    static updateClientDetails(glCode, updates) {
        try {
            let clientLedgers = safeGetItem('clientLedgers', []);
            // Ensure clientLedgers is always an array
            if (!Array.isArray(clientLedgers)) {
                clientLedgers = Object.values(clientLedgers || {});
            }
            const clientIndex = clientLedgers.findIndex(c => c.glCode === glCode);

            if (clientIndex === -1) {
                throw new Error(`Client not found: ${glCode}`);
            }

            // Update client details
            clientLedgers[clientIndex] = {
                ...clientLedgers[clientIndex],
                ...updates,
                updatedAt: new Date().toISOString()
            };

            const saved = safeSetItem('clientLedgers', clientLedgers);

            if (!saved) {
                throw new Error('Failed to save client details');
            }

            return {
                success: true,
                message: 'Client details updated successfully',
                client: clientLedgers[clientIndex]
            };
        } catch (error) {
            console.error(`❌ Error in updateClientDetails(${glCode}):`, error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Search clients by name or code
     * @param {string} searchTerm - Search term
     * @returns {Array} Matching clients
     */
    static searchClients(searchTerm) {
        try {
            if (!searchTerm || searchTerm.trim() === '') {
                return this.getAllClients();
            }

            const clients = this.getAllClients();
            const term = searchTerm.toLowerCase();

            return clients.filter(client =>
                client.glCode.toLowerCase().includes(term) ||
                client.clientName.toLowerCase().includes(term) ||
                client.branch?.toLowerCase().includes(term) ||
                client.email?.toLowerCase().includes(term)
            );
        } catch (error) {
            console.error(`❌ Error in searchClients(${searchTerm}):`, error);
            return [];
        }
    }
}

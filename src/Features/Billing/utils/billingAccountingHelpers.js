// Billing Accounting Helpers
// Functions to create accounting transactions for invoices

import {
    getOrCreateClientLedger,
    generateVoucherNumber,
    postTransaction,
    updateLedgerBalances,
    safeGetItem,
    safeSetItem,
    getCurrentDate
} from '../../Master/utils/accountingHelpers';
import { REVENUE_LEDGER_MAPPING } from '../data/billingCalculationData';

/**
 * Process invoice accounting - creates double-entry transaction
 * @param {Object} invoiceData - Complete invoice data with formData, billingLines, calculations
 * @param {Object} irnDetails - IRN and acknowledgement number
 * @returns {Object} - { success: boolean, transactionId: string, voucherNo: string, error: string }
 */
export const processInvoiceAccounting = (invoiceData, irnDetails) => {
    try {
        console.log('🔄 Starting invoice accounting process...');
        console.log('📋 Invoice Data:', invoiceData);
        console.log('📄 IRN Details:', irnDetails);

        // Validate required data
        if (!invoiceData || !invoiceData.formData || !invoiceData.billingLines || !invoiceData.calculations) {
            throw new Error('Invalid invoice data structure');
        }

        if (!irnDetails || !irnDetails.irnNumber) {
            throw new Error('IRN details required for invoice posting');
        }

        const { formData, billingLines, calculations } = invoiceData;

        // Step 1: Get or create client ledger
        console.log('📝 Step 1: Getting/Creating client ledger for:', formData.customer);
        const clientGLCode = getOrCreateClientLedger(
            formData.customer,
            {
                description: `Client Account - ${formData.customer}`,
                branch: formData.branch,
                contactPerson: formData.contactPerson || '',
                email: formData.clientEmail || '',
                phone: formData.clientPhone || ''
            }
        );
        console.log('✅ Client GL Code:', clientGLCode);

        // Step 2: Generate voucher number
        const site = formData.branch || 'HO';
        const year = new Date().getFullYear();
        const voucherNo = generateVoucherNumber(site, year);
        console.log('📄 Generated Voucher Number:', voucherNo);

        // Step 3: Create transaction entries
        console.log('💰 Step 3: Creating transaction entries...');
        const entries = [];
        let lineNo = 1;

        // Entry 1: Debit Sundry Debtors (Client) - Grand Total
        entries.push({
            lineNo: lineNo++,
            glCode: clientGLCode,
            glName: formData.customer,
            debit: calculations.grandTotal,
            credit: 0,
            narration: `Invoice ${formData.poWoNumber} for period ${formData.selectedBillingCycle?.cycleFrom} to ${formData.selectedBillingCycle?.cycleTo}`,
            costCenter: formData.branch || 'HEAD OFFICE',
            invoiceNumber: formData.poWoNumber,
            irnNumber: irnDetails.irnNumber
        });

        // Entries 2-N: Credit Revenue Ledgers - Per billing line (taxable amount only)
        console.log(`📊 Processing ${billingLines.length} billing lines...`);
        billingLines.forEach((line, index) => {
            // Get revenue ledger details
            const revenueLedgerKey = line.revenueLedger;
            if (!revenueLedgerKey) {
                console.warn(`⚠️ Line ${index + 1}: No revenue ledger mapping for ${line.designation}`);
                return;
            }

            const revenueLedger = REVENUE_LEDGER_MAPPING[revenueLedgerKey];
            if (!revenueLedger) {
                console.warn(`⚠️ Line ${index + 1}: Invalid revenue ledger key: ${revenueLedgerKey}`);
                return;
            }

            // Line amounts are already taxable (without GST)
            // calculations.subtotal is the sum of all line.amount values
            const gstRate = line.gstRate || 18;

            entries.push({
                lineNo: lineNo++,
                glCode: revenueLedger.code,
                glName: revenueLedger.name,
                debit: 0,
                credit: line.amount, // Already taxable amount
                narration: `${line.designation} - ${line.count} @ ₹${line.monthlyRate}`,
                costCenter: line.location || formData.branch || 'HEAD OFFICE',
                invoiceNumber: formData.poWoNumber,
                irnNumber: irnDetails.irnNumber,
                hsnCode: line.hsnCode,
                gstRate: gstRate
            });

            console.log(`  ✅ Line ${index + 1}: ${revenueLedger.name} - ₹${line.amount.toFixed(2)} (taxable)`);
        });

        // Entry for Management Fees (if applicable)
        if (calculations.managementFees && calculations.managementFees > 0) {
            // Management fees in calculations are already taxable (without GST)
            // They're added to subtotal to get totalBeforeTax
            entries.push({
                lineNo: lineNo++,
                glCode: 'R1001003', // SERVICE_CHARGES
                glName: 'SERVICE CHARGES',
                debit: 0,
                credit: calculations.managementFees, // Already taxable amount
                narration: `Management Fees for Invoice ${formData.poWoNumber}`,
                costCenter: formData.branch || 'HEAD OFFICE',
                invoiceNumber: formData.poWoNumber,
                irnNumber: irnDetails.irnNumber
            });
            console.log(`  ✅ Management Fees: ₹${calculations.managementFees.toFixed(2)} (taxable)`);
        }

        // Entry N+1: Credit CGST Payable (L3001)
        if (calculations.cgst > 0) {
            entries.push({
                lineNo: lineNo++,
                glCode: 'L3001',
                glName: 'CGST PAYABLE',
                debit: 0,
                credit: calculations.cgst,
                narration: `CGST @ 9% on Invoice ${formData.poWoNumber}`,
                costCenter: formData.branch || 'HEAD OFFICE',
                invoiceNumber: formData.poWoNumber,
                irnNumber: irnDetails.irnNumber
            });
            console.log(`  ✅ CGST: ₹${calculations.cgst.toFixed(2)}`);
        }

        // Entry N+2: Credit SGST Payable (L3002)
        if (calculations.sgst > 0) {
            entries.push({
                lineNo: lineNo++,
                glCode: 'L3002',
                glName: 'SGST PAYABLE',
                debit: 0,
                credit: calculations.sgst,
                narration: `SGST @ 9% on Invoice ${formData.poWoNumber}`,
                costCenter: formData.branch || 'HEAD OFFICE',
                invoiceNumber: formData.poWoNumber,
                irnNumber: irnDetails.irnNumber
            });
            console.log(`  ✅ SGST: ₹${calculations.sgst.toFixed(2)}`);
        }

        // Step 4: Create transaction object
        // Calculate actual debit and credit totals from entries
        const totalDebit = entries.reduce((sum, entry) => sum + entry.debit, 0);
        const totalCredit = entries.reduce((sum, entry) => sum + entry.credit, 0);

        const transaction = {
            id: `TXN_INV_${Date.now()}`,
            voucherNo: voucherNo,
            voucherType: 'Sales Invoice',
            date: getCurrentDate(),
            entries: entries,
            totalDebit: totalDebit,
            totalCredit: totalCredit,
            narration: `Sales Invoice ${formData.poWoNumber} - ${formData.customer}`,
            invoiceNumber: formData.poWoNumber,
            irnNumber: irnDetails.irnNumber,
            acknowledgementNumber: irnDetails.acknowledgementNumber,
            customer: formData.customer,
            branch: formData.branch,
            billingPeriod: {
                from: formData.selectedBillingCycle?.cycleFrom,
                to: formData.selectedBillingCycle?.cycleTo
            },
            createdBy: invoiceData.createdBy || 'Billing Manager',
            createdAt: new Date().toISOString(),
            status: 'Posted'
        };

        console.log('📝 Transaction created:', {
            voucherNo: transaction.voucherNo,
            entries: transaction.entries.length,
            totalDebit: transaction.totalDebit,
            totalCredit: transaction.totalCredit
        });

        // Step 5: Validate transaction
        if (Math.abs(transaction.totalDebit - transaction.totalCredit) > 0.01) {
            throw new Error(`Transaction not balanced! Debit: ${transaction.totalDebit}, Credit: ${transaction.totalCredit}`);
        }

        // Step 6: Post transaction
        console.log('💾 Step 6: Posting transaction to ledger...');
        const postResult = postTransaction(transaction);

        if (!postResult.success) {
            throw new Error(postResult.error || 'Failed to post transaction');
        }

        console.log('✅ Transaction posted successfully:', postResult.transaction.id);

        // Step 7: Update ledger balances
        console.log('🔄 Step 7: Updating ledger balances...');
        updateLedgerBalances(entries);
        console.log('✅ Ledger balances updated');

        // Step 8: Update client ledger with invoice details
        updateClientLedgerWithInvoice(clientGLCode, {
            invoiceNumber: formData.poWoNumber,
            invoiceDate: getCurrentDate(),
            amount: calculations.grandTotal,
            irnNumber: irnDetails.irnNumber,
            voucherNo: voucherNo,
            status: 'Outstanding'
        });

        console.log('🎉 Invoice accounting completed successfully!');

        return {
            success: true,
            transactionId: postResult.transaction.id,
            voucherNo: voucherNo,
            clientGLCode: clientGLCode,
            message: 'Invoice posted to accounts successfully'
        };

    } catch (error) {
        console.error('❌ Error in processInvoiceAccounting:', error);
        return {
            success: false,
            error: error.message,
            details: error.stack
        };
    }
};

/**
 * Update client ledger with invoice details
 */
const updateClientLedgerWithInvoice = (clientGLCode, invoiceDetails) => {
    try {
        const clientLedgersData = safeGetItem('clientLedgers', []);

        // Convert to array if it's an object
        const clientLedgers = Array.isArray(clientLedgersData)
            ? clientLedgersData
            : Object.values(clientLedgersData);

        let clientLedger = clientLedgers.find(l => l.glCode === clientGLCode);

        if (!clientLedger) {
            // Create new client ledger entry
            clientLedger = {
                id: `CL_${Date.now()}`,
                glCode: clientGLCode,
                clientName: invoiceDetails.clientName || 'Client',
                currentOutstanding: 0,
                totalInvoiced: 0,
                totalReceived: 0,
                invoices: [],
                receipts: [],
                createdAt: new Date().toISOString()
            };
            clientLedgers.push(clientLedger);
        }

        // Add invoice to client ledger
        clientLedger.invoices = clientLedger.invoices || [];
        clientLedger.invoices.push({
            invoiceNumber: invoiceDetails.invoiceNumber,
            invoiceDate: invoiceDetails.invoiceDate,
            amount: invoiceDetails.amount,
            irnNumber: invoiceDetails.irnNumber,
            voucherNo: invoiceDetails.voucherNo,
            status: invoiceDetails.status,
            postedAt: new Date().toISOString()
        });

        // Update totals
        clientLedger.totalInvoiced = (clientLedger.totalInvoiced || 0) + invoiceDetails.amount;
        clientLedger.currentOutstanding = clientLedger.totalInvoiced - (clientLedger.totalReceived || 0);
        clientLedger.lastInvoiceDate = invoiceDetails.invoiceDate;
        clientLedger.lastUpdated = new Date().toISOString();

        safeSetItem('clientLedgers', clientLedgers);
        console.log('✅ Client ledger updated with invoice details');

    } catch (error) {
        console.error('⚠️ Error updating client ledger:', error);
        // Non-critical error - don't throw
    }
};

/**
 * Validate invoice data before posting
 */
export const validateInvoiceData = (invoiceData, irnDetails) => {
    const errors = [];

    if (!invoiceData) {
        errors.push('Invoice data is required');
        return { valid: false, errors };
    }

    if (!invoiceData.formData) {
        errors.push('Form data is missing');
    } else {
        if (!invoiceData.formData.customer) errors.push('Customer name is required');
        if (!invoiceData.formData.poWoNumber) errors.push('Invoice number is required');
        if (!invoiceData.formData.selectedBillingCycle) errors.push('Billing cycle is required');
    }

    if (!invoiceData.billingLines || invoiceData.billingLines.length === 0) {
        errors.push('Billing lines are required');
    }

    if (!invoiceData.calculations) {
        errors.push('Calculations are missing');
    } else {
        if (!invoiceData.calculations.grandTotal || invoiceData.calculations.grandTotal <= 0) {
            errors.push('Grand total must be greater than zero');
        }
    }

    if (!irnDetails || !irnDetails.irnNumber) {
        errors.push('IRN details are required');
    }

    return {
        valid: errors.length === 0,
        errors
    };
};

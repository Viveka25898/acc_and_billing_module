// src/services/TDSRealDataService.js

export class TDSRealDataService {
    /**
     * Get real TDS data matching your table structure
     */
    static getRealTDSData() {
        try {
            const transactions = JSON.parse(localStorage.getItem('transactions')) || [];

            console.log(`📊 Fetching real TDS data from ${transactions.length} transactions`);

            // Filter TDS transactions
            const tdsTransactions = transactions.filter(txn =>
                txn.entries?.some(entry => entry.glCode === 'L2003001')
            );

            console.log(`✅ Found ${tdsTransactions.length} TDS transactions`);

            if (tdsTransactions.length === 0) {
                return { tdsData: [], companyInfo: null };
            }

            // Sort by date
            tdsTransactions.sort((a, b) => new Date(a.date) - new Date(b.date));

            // Process to match your table structure
            const tdsData = [];
            let cumulativeBalance = 0;

            tdsTransactions.forEach((txn, index) => {
                const tdsEntry = txn.entries.find(e => e.glCode === 'L2003001');
                const vendorEntry = txn.entries.find(e => e.glCode?.startsWith('L2005_'));
                const expenseEntry = txn.entries.find(e =>
                    e.debit > 0 && !e.glCode?.startsWith('L2005_') && e.glCode !== 'L2003001'
                );

                if (!tdsEntry) return;

                const debit = tdsEntry.debit || 0;
                const credit = tdsEntry.credit || 0;
                const tdsAmount = Math.max(debit, credit);
                const isDeduction = credit > 0; // TDS deduction is CREDIT

                // Get invoice details
                const relatedInvoice = this.getInvoiceByVoucher(txn.voucherNo);
                const poDetails = relatedInvoice ? this.getPODetails(relatedInvoice.poId) : null;

                // Extract amounts from meta data
                const meta = txn.meta || {};
                const grossAmount = meta.totalAmount || expenseEntry?.debit || 0;
                const taxableAmount = meta.taxableAmount || grossAmount;
                const netPayable = meta.netPayable || (grossAmount - tdsAmount);

                // Calculate TDS rate from meta or deduce from amount
                const tdsRate = meta.tdsRate || Math.round((tdsAmount / taxableAmount) * 100);

                // Update cumulative balance
                if (isDeduction) {
                    cumulativeBalance += tdsAmount; // TDS deducted increases liability
                } else {
                    cumulativeBalance -= tdsAmount; // TDS paid decreases liability
                }

                // Extract vendor details
                const vendorName = vendorEntry?.glName?.replace('VENDOR - ', '') || 'Unknown';
                const vendorCode = vendorEntry?.glCode?.replace('L2005_', 'V') || '';

                // Create entry matching your table structure
                const entry = {
                    lineNo: index + 1,
                    postingDate: this.formatDate(txn.date),
                    documentDate: this.formatDate(txn.date),
                    voucherType: txn.voucherType || 'Purchase Voucher',
                    voucherNo: txn.voucherNo,
                    reference: txn.invoiceNumber || '-',
                    particulars: tdsEntry.narration || `${isDeduction ? 'TDS Deducted' : 'TDS Paid'} on Invoice`,
                    invoiceNo: txn.invoiceNumber || '-',
                    invoiceDate: this.formatDate(txn.date),
                    poNo: relatedInvoice?.poNumber || '-',
                    tdsSection: meta.tdsSection || poDetails?.tdsSection || '194C',
                    natureOfPayment: this.getNatureOfPayment(expenseEntry?.glName),
                    grossAmount: grossAmount,
                    taxableAmount: taxableAmount,
                    tdsRate: tdsRate,
                    surcharge: 0,
                    cess: 4, // Health & Education Cess (4% of TDS)
                    tdsAmountDr: isDeduction ? 0 : tdsAmount, // Debit = Payment (when TDS is paid)
                    tdsAmountCr: isDeduction ? tdsAmount : 0, // Credit = Deduction (when TDS is deducted)
                    netPayable: netPayable,
                    cumulativeBalance: cumulativeBalance,
                    vendorCode: vendorCode,
                    vendorName: vendorName,
                    pan: this.extractPAN(vendorName, poDetails),
                    deducteeType: 'Company',
                    challanNo: `CHL${txn.voucherNo?.replace(/\D/g, '').slice(-6) || '000000'}`,
                    challanDate: isDeduction ? '' : this.formatDate(txn.date), // Only for payments
                    paymentStatus: this.getPaymentStatus(txn, isDeduction),
                    remarks: txn.remarks || relatedInvoice?.remarks || ''
                };

                console.log(`📝 Created TDS entry #${entry.lineNo}:`, {
                    voucher: entry.voucherNo,
                    invoice: entry.invoiceNo,
                    vendor: entry.vendorName,
                    tdsAmount: tdsAmount,
                    tdsType: isDeduction ? 'Deduction (Cr)' : 'Payment (Dr)',
                    tdsAmountCr: entry.tdsAmountCr,
                    tdsAmountDr: entry.tdsAmountDr
                });

                tdsData.push(entry);
            });

            // Debug: Show what we created
            console.log('📋 Final TDS Data:', tdsData);

            // Prepare company info
            const companyInfo = {
                companyName: 'ABC Industries Pvt Ltd',
                address: '123 Business Street, Mumbai - 400001',
                pan: 'AABCA1234F',
                tan: 'MUMB12345F',
                financialYear: '2025-26',
                ledgerName: 'TDS PAYABLE LEDGER',
                period: '01-Apr-2025 to 31-Dec-2025',
                glCode: 'L2003001',
                generatedOn: new Date().toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                })
            };

            return { tdsData, companyInfo };

        } catch (error) {
            console.error('❌ Error getting real TDS data:', error);
            return { tdsData: [], companyInfo: null };
        }
    }

    /**
     * Get invoice by voucher number
     */
    static getInvoiceByVoucher(voucherNo) {
        try {
            const invoices = JSON.parse(localStorage.getItem('processed_invoices')) || [];
            return invoices.find(inv => inv.voucher_id === voucherNo);
        } catch {
            return null;
        }
    }

    /**
     * Get PO details
     */
    static getPODetails(poId) {
        try {
            const pos = JSON.parse(localStorage.getItem('purchaseOrders')) || [];
            return pos.find(po => po.id === poId || po.poNumber === poId);
        } catch {
            return null;
        }
    }

    /**
     * Format date to DD-MMM-YYYY
     */
    static formatDate(dateString) {
        try {
            if (!dateString) return '';
            const date = new Date(dateString);
            const day = String(date.getDate()).padStart(2, '0');
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const month = monthNames[date.getMonth()];
            const year = date.getFullYear();
            return `${day}-${month}-${year}`;
        } catch {
            return dateString;
        }
    }

    /**
     * Determine nature of payment from GL name
     */
    static getNatureOfPayment(glName) {
        if (!glName) return 'Professional/Technical Fees';

        const glNameUpper = glName.toUpperCase();

        if (glNameUpper.includes('PROFESSIONAL') || glNameUpper.includes('OTHER FEES')) {
            return 'Professional/Technical Fees';
        }
        if (glNameUpper.includes('TRAVEL')) return 'Travel Expenses';
        if (glNameUpper.includes('RENT')) return 'Rent';
        if (glNameUpper.includes('CONVEYANCE')) return 'Conveyance';
        if (glNameUpper.includes('HK MATERIAL')) return 'Contractor/Sub-Contractor';
        if (glNameUpper.includes('UNIFORM')) return 'Other Expenses';
        if (glNameUpper.includes('INDIRECT EXPENSE')) return 'Professional/Technical Fees';

        return 'Other Expenses';
    }

    /**
     * Extract PAN from vendor name
     */
    static extractPAN(vendorName, poDetails) {
        const panPattern = /[A-Z]{5}[0-9]{4}[A-Z]{1}/;
        const match = vendorName.match(panPattern);

        if (match) return match[0];
        if (poDetails?.vendorPan) return poDetails.vendorPan;

        return 'PANNOTAVL';
    }

    /**
     * Determine payment status
     */
    static getPaymentStatus(transaction, isDeduction) {
        if (!isDeduction) return 'Paid'; // TDS Payment

        // For TDS deductions, check due date
        const txnDate = new Date(transaction.date);
        const dueDate = new Date(txnDate);
        dueDate.setMonth(dueDate.getMonth() + 1);
        dueDate.setDate(7); // TDS due by 7th of next month

        const today = new Date();

        if (today > dueDate) return 'Overdue';
        if (today > txnDate) return 'To be Paid';
        return 'Deducted';
    }

    /**
     * Calculate Cess amount (4% of TDS)
     */
    static calculateCess(tdsAmount) {
        return (tdsAmount * 0.04).toFixed(2);
    }

    /**
     * Get TDS summary statistics
     */
    static getTDSSummary() {
        try {
            const { tdsData } = this.getRealTDSData();

            if (tdsData.length === 0) {
                return {
                    totalDeductions: 0,
                    totalPayments: 0,
                    netBalance: 0,
                    transactionCount: 0,
                    sectionBreakdown: {}
                };
            }

            const summary = tdsData.reduce((acc, entry) => {
                acc.totalDeductions += entry.tdsAmountCr || 0;
                acc.totalPayments += entry.tdsAmountDr || 0;
                acc.transactionCount++;

                const section = entry.tdsSection;
                if (!acc.sectionBreakdown[section]) {
                    acc.sectionBreakdown[section] = {
                        deductions: 0,
                        payments: 0,
                        count: 0
                    };
                }

                if (entry.tdsAmountCr > 0) {
                    acc.sectionBreakdown[section].deductions += entry.tdsAmountCr;
                    acc.sectionBreakdown[section].count++;
                } else {
                    acc.sectionBreakdown[section].payments += entry.tdsAmountDr;
                }

                return acc;
            }, {
                totalDeductions: 0,
                totalPayments: 0,
                netBalance: 0,
                transactionCount: 0,
                sectionBreakdown: {}
            });

            summary.netBalance = summary.totalDeductions - summary.totalPayments;

            console.log('📊 TDS Summary:', summary);
            return summary;
        } catch (error) {
            console.error('Error getting TDS summary:', error);
            return null;
        }
    }

    /**
     * Export TDS data to CSV
     */
    static exportToCSV() {
        try {
            const { tdsData } = this.getRealTDSData();

            if (tdsData.length === 0) {
                return null;
            }

            // CSV headers matching your table columns
            const headers = [
                'Line No',
                'Posting Date',
                'Document Date',
                'Voucher Type',
                'Voucher No',
                'Reference',
                'Particulars',
                'Invoice No',
                'Invoice Date',
                'PO No',
                'TDS Section',
                'Nature of Payment',
                'Gross Amount',
                'Taxable Amount',
                'TDS Rate %',
                'Surcharge %',
                'Cess %',
                'TDS Debit',
                'TDS Credit',
                'Net Payable',
                'Cumulative Balance',
                'Vendor Code',
                'Vendor Name',
                'PAN',
                'Deductee Type',
                'Challan No',
                'Challan Date',
                'Status',
                'Remarks'
            ];

            // Convert data to CSV rows
            const rows = tdsData.map(entry => [
                entry.lineNo,
                `"${entry.postingDate}"`,
                `"${entry.documentDate}"`,
                `"${entry.voucherType}"`,
                `"${entry.voucherNo}"`,
                `"${entry.reference}"`,
                `"${entry.particulars}"`,
                `"${entry.invoiceNo}"`,
                `"${entry.invoiceDate}"`,
                `"${entry.poNo}"`,
                `"${entry.tdsSection}"`,
                `"${entry.natureOfPayment}"`,
                entry.grossAmount,
                entry.taxableAmount,
                entry.tdsRate,
                entry.surcharge,
                entry.cess,
                entry.tdsAmountDr,
                entry.tdsAmountCr,
                entry.netPayable,
                entry.cumulativeBalance,
                `"${entry.vendorCode}"`,
                `"${entry.vendorName}"`,
                `"${entry.pan}"`,
                `"${entry.deducteeType}"`,
                `"${entry.challanNo}"`,
                `"${entry.challanDate}"`,
                `"${entry.paymentStatus}"`,
                `"${entry.remarks}"`
            ]);

            // Combine headers and rows
            const csvContent = [
                headers.join(','),
                ...rows.map(row => row.join(','))
            ].join('\n');

            return csvContent;

        } catch (error) {
            console.error('Error exporting CSV:', error);
            return null;
        }
    }
}

export default TDSRealDataService;
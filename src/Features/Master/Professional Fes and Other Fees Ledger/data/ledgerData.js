export const generateLedgerData = (accountCode) => {
    const dataMap = {
        'X2002002002': [
            {
                postingDate: '01-Dec-2025',
                documentDate: '28-Nov-2025',
                voucherType: 'Purchase',
                voucherNo: 'PV/2025/0001',
                vendorCode: 'VEND-001',
                vendorName: 'ABC Consultants Pvt Ltd',
                invoiceNo: 'INV/2025/456',
                invoiceDate: '28-Nov-2025',
                poNo: 'PO/2025/789',
                costCenter: 'HO - IT Department',
                expenseAmount: 100000,
                remarks: 'Monthly consultancy charges',
                runningBalance: 100000
            },
            {
                postingDate: '05-Dec-2025',
                documentDate: '03-Dec-2025',
                voucherType: 'Purchase',
                voucherNo: 'PV/2025/0002',
                vendorCode: 'VEND-002',
                vendorName: 'XYZ Services Ltd',
                invoiceNo: 'INV/2025/512',
                invoiceDate: '03-Dec-2025',
                poNo: 'PO/2025/823',
                costCenter: 'Project A - Tech',
                expenseAmount: 250000,
                remarks: 'Project-based professional services',
                runningBalance: 350000
            },
            {
                postingDate: '10-Dec-2025',
                documentDate: '08-Dec-2025',
                voucherType: 'Journal',
                voucherNo: 'JV/2025/0012',
                vendorCode: 'VEND-003',
                vendorName: 'Legal Associates & Co',
                invoiceNo: 'INV/2025/678',
                invoiceDate: '08-Dec-2025',
                poNo: 'PO/2025/901',
                costCenter: 'Legal & Compliance',
                expenseAmount: 75000,
                remarks: 'Retainership - Legal advisory',
                runningBalance: 425000
            }
        ],
        'X2002002003': [
            {
                postingDate: '02-Dec-2025',
                documentDate: '01-Dec-2025',
                voucherType: 'Purchase',
                voucherNo: 'PV/2025/0005',
                vendorCode: 'VEND-005',
                vendorName: 'Digital Marketing Agency',
                invoiceNo: 'INV/2025/890',
                invoiceDate: '01-Dec-2025',
                poNo: 'PO/2025/1001',
                costCenter: 'Marketing - Digital',
                expenseAmount: 85000,
                remarks: 'SEO and content marketing services',
                runningBalance: 85000
            },
            {
                postingDate: '08-Dec-2025',
                documentDate: '07-Dec-2025',
                voucherType: 'Purchase',
                voucherNo: 'PV/2025/0008',
                vendorCode: 'VEND-008',
                vendorName: 'Event Management Co',
                invoiceNo: 'INV/2025/945',
                invoiceDate: '07-Dec-2025',
                poNo: 'PO/2025/1102',
                costCenter: 'HR - Events',
                expenseAmount: 150000,
                remarks: 'Annual day event organization',
                runningBalance: 235000
            },
            {
                postingDate: '15-Dec-2025',
                documentDate: '14-Dec-2025',
                voucherType: 'Journal',
                voucherNo: 'JV/2025/0020',
                vendorCode: 'VEND-012',
                vendorName: 'Training Institute Ltd',
                invoiceNo: 'INV/2025/1234',
                invoiceDate: '14-Dec-2025',
                poNo: 'PO/2025/1205',
                costCenter: 'L&D - Training',
                expenseAmount: 120000,
                remarks: 'Employee skill development training',
                runningBalance: 355000
            }
        ]
    };

    return dataMap[accountCode] || [];
};

// Get ledger name based on account code
export const getLedgerName = (accountCode) => {
    const nameMap = {
        'X2002002002': 'Professional Fees',
        'X2002002003': 'Other Fees'
    };
    return nameMap[accountCode] || 'Expense Ledger';
};
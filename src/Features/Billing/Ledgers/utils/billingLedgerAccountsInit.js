// Billing Ledgers - Chart of Accounts Initialization
// This file contains the 11 billing ledger accounts to be added to the Chart of Accounts

export const billingLedgerAccounts = [
    // ========================================
    // PRIMARY POSTING LEDGERS (4)
    // ========================================
    {
        id: 'X5000',
        code: 'X5000',
        name: 'HOUSE KEEPING CHARGES',
        type: 'ACCOUNT',
        parentAccount: 'EXPENSES',
        parentCode: 'X',
        description: 'Housekeeping services including cleaning, security, and management charges',
        products: 221,
    },
    {
        id: 'X5100',
        code: 'X5100',
        name: 'MANPOWER SERVICES',
        type: 'ACCOUNT',
        parentAccount: 'EXPENSES',
        parentCode: 'X',
        description: 'Manpower supply and labor services',
        products: 64,
    },
    {
        id: 'X5200',
        code: 'X5200',
        name: 'HK MATERIAL',
        type: 'ACCOUNT',
        parentAccount: 'EXPENSES',
        parentCode: 'X',
        description: 'Housekeeping materials, cleaning consumables, and sanitary supplies',
        products: 20,
    },
    {
        id: 'X5400',
        code: 'X5400',
        name: 'RENT ON MACHINERY',
        type: 'ACCOUNT',
        parentAccount: 'EXPENSES',
        parentCode: 'X',
        description: 'Machinery rental and equipment leasing charges',
        products: 7,
    },

    // ========================================
    // GST STATUTORY LEDGERS (3)
    // ========================================
    {
        id: 'L3001',
        code: 'L3001',
        name: 'CGST PAYABLE',
        type: 'ACCOUNT',
        parentAccount: 'SOURCES OF FUNDS',
        parentCode: 'L',
        description: 'Central GST Payable @ 9% (Intra-State Supplies)',
        taxRate: '9%',
    },
    {
        id: 'L3002',
        code: 'L3002',
        name: 'SGST PAYABLE',
        type: 'ACCOUNT',
        parentAccount: 'SOURCES OF FUNDS',
        parentCode: 'L',
        description: 'State GST Payable @ 9% (Intra-State Supplies)',
        taxRate: '9%',
    },
    {
        id: 'L3003',
        code: 'L3003',
        name: 'IGST PAYABLE',
        type: 'ACCOUNT',
        parentAccount: 'SOURCES OF FUNDS',
        parentCode: 'L',
        description: 'Integrated GST Payable @ 18% (Inter-State Supplies)',
        taxRate: '18%',
    },

    // ========================================
    // TDS STATUTORY LEDGERS (2)
    // ========================================
    {
        id: 'L3101',
        code: 'L3101',
        name: 'TDS PAYABLE (194C)',
        type: 'ACCOUNT',
        parentAccount: 'SOURCES OF FUNDS',
        parentCode: 'L',
        description: 'TDS Payable u/s 194C @ 2% on Contracts',
        taxRate: '2%',
        section: '194C',
    },
    {
        id: 'L3102',
        code: 'L3102',
        name: 'TDS RECEIVABLE (194J)',
        type: 'ACCOUNT',
        parentAccount: 'ASSETS',
        parentCode: 'A',
        description: 'TDS Receivable u/s 194J @ 10% on Professional Services',
        taxRate: '10%',
        section: '194J',
    },

    // ========================================
    // OTHER STATUTORY LEDGERS (2)
    // ========================================
    {
        id: 'L3004',
        code: 'L3004',
        name: 'SERVICE TAX PAYABLE',
        type: 'ACCOUNT',
        parentAccount: 'SOURCES OF FUNDS',
        parentCode: 'L',
        description: 'Service Tax Payable @ 15% (SEZ/EOU Services)',
        taxRate: '15%',
    },
    {
        id: 'X9999',
        code: 'X9999',
        name: 'ROUND OFF',
        type: 'ACCOUNT',
        parentAccount: 'EXPENSES',
        parentCode: 'X',
        description: 'Invoice rounding adjustments and minor decimal corrections',
    },
];

// Function to add billing ledger accounts to existing chart of accounts
export const addBillingLedgersToChartOfAccounts = () => {
    try {
        const existingAccounts = JSON.parse(localStorage.getItem('chartOfAccounts')) || [];

        // Check if billing ledgers already exist
        const existingCodes = existingAccounts.map(acc => acc.code);
        const billingCodesExist = billingLedgerAccounts.some(acc => existingCodes.includes(acc.code));

        if (billingCodesExist) {
            console.log('✅ Billing ledger accounts already exist in Chart of Accounts');
            return;
        }

        // Add billing ledger accounts
        const updatedAccounts = [...existingAccounts, ...billingLedgerAccounts];
        localStorage.setItem('chartOfAccounts', JSON.stringify(updatedAccounts));

        console.log('✅ Successfully added 11 billing ledger accounts to Chart of Accounts');
        console.log('   - 4 Primary Posting Ledgers (X5000, X5100, X5200, X5400)');
        console.log('   - 3 GST Ledgers (L3001, L3002, L3003)');
        console.log('   - 2 TDS Ledgers (L3101, L3102)');
        console.log('   - 2 Other Statutory Ledgers (L3004, X9999)');

        return updatedAccounts;
    } catch (error) {
        console.error('❌ Error adding billing ledgers to Chart of Accounts:', error);
        return null;
    }
};

// Function to get billing ledger by code
export const getBillingLedgerByCode = (code) => {
    return billingLedgerAccounts.find(acc => acc.code === code);
};

// Function to get all billing ledgers by type
export const getBillingLedgersByType = (type) => {
    const typeMap = {
        'primary': ['X5000', 'X5100', 'X5200', 'X5400'],
        'gst': ['L3001', 'L3002', 'L3003'],
        'tds': ['L3101', 'L3102'],
        'other': ['L3004', 'X9999']
    };

    const codes = typeMap[type.toLowerCase()] || [];
    return billingLedgerAccounts.filter(acc => codes.includes(acc.code));
};

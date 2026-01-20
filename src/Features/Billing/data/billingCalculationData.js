// Billing Calculation - Dummy Rate Cards and Payroll Data

// Revenue Ledger Mapping for Invoice Line Items
export const REVENUE_LEDGER_MAPPING = {
    'HOUSE_KEEPING_CHARGES': { code: 'R1001001', name: 'HOUSE KEEPING CHARGES', gstApplicable: true },
    'HOUSE_KEEPING_EXEMPT': { code: 'R1001002', name: 'HOUSE KEEPING CHARGES (EXEMPT)', gstApplicable: false },
    'SERVICE_CHARGES': { code: 'R1001003', name: 'SERVICE CHARGES', gstApplicable: true },
    'OVERSEAS_CONSULTANCY': { code: 'R1001004', name: 'OVERSEAS CONSULTANCY SERVICE FEES (EXPORT)', gstApplicable: false },
    'HK_MATERIAL': { code: 'R1001005001', name: 'HK MATERIAL', gstApplicable: true },
    'CLEANING_CONSUMABLE': { code: 'R1001005002', name: 'CLEANING CONSUMABLE', gstApplicable: true },
    'DEEP_CLEANING': { code: 'R1001007', name: 'DEEP CLEANING CHARGES', gstApplicable: true },
    'RENT_ON_MACHINERY': { code: 'R1001008', name: 'RENT ON MACHINERY', gstApplicable: true },
    'MANPOWER_SERVICES': { code: 'R1001009', name: 'MANPOWER SERVICES', gstApplicable: true },
    'PEST_CONTROL': { code: 'R1001010', name: 'PEST CONTROL CHARGES', gstApplicable: true }
};

// Rate Cards by Customer and Site
export const RATE_CARDS = {
    // ABC Mall - Mumbai
    'ABC Mall': {
        sites: {
            'Ground Floor': {
                location: 'Ground Floor',
                services: [
                    {
                        id: 1,
                        product: 'Security Services',
                        designation: 'Security Guard',
                        monthlyRate: 21355,
                        hsnCode: '998539',
                        gstRate: 18,
                        revenueLedger: 'MANPOWER_SERVICES' // R1001009
                    },
                    {
                        id: 2,
                        product: 'Security Services',
                        designation: 'Supervisor',
                        monthlyRate: 28500,
                        hsnCode: '998539',
                        gstRate: 18,
                        revenueLedger: 'MANPOWER_SERVICES' // R1001009
                    },
                    {
                        id: 3,
                        product: 'Housekeeping Services',
                        designation: 'Housekeeper',
                        monthlyRate: 19800,
                        hsnCode: '998539',
                        gstRate: 18,
                        revenueLedger: 'HOUSE_KEEPING_CHARGES' // R1001001
                    },
                    {
                        id: 'HKM1',
                        product: 'HK Material',
                        designation: 'Housekeeping Material Supply',
                        monthlyRate: 8000,
                        hsnCode: '998599',
                        gstRate: 18,
                        isMaterial: true,
                        revenueLedger: 'HK_MATERIAL' // R1001005001
                    },
                    {
                        id: 'EX1',
                        product: 'Housekeeping Services (Exempt)',
                        designation: 'Housekeeper (Exempt)',
                        monthlyRate: 15000,
                        hsnCode: '998539',
                        gstRate: 0,
                        isExempt: true,
                        revenueLedger: 'HOUSE_KEEPING_EXEMPT' // R1001002
                    },
                    {
                        id: 'M1',
                        product: 'Machinery',
                        designation: 'Floor Scrubber Machine',
                        monthlyRate: 5000,
                        hsnCode: '998599',
                        gstRate: 18,
                        isMachinery: true,
                        revenueLedger: 'RENT_ON_MACHINERY' // R1001008
                    },
                    {
                        id: 'C1',
                        product: 'Consumables',
                        designation: 'Cleaning Chemicals & Supplies',
                        monthlyRate: 3000,
                        hsnCode: '998599',
                        gstRate: 18,
                        isConsumable: true,
                        revenueLedger: 'CLEANING_CONSUMABLE' // R1001005002
                    }
                ]
            },
            'First Floor': {
                location: 'First Floor',
                services: [
                    {
                        id: 4,
                        product: 'Security Services',
                        designation: 'Security Guard',
                        monthlyRate: 21355,
                        hsnCode: '998539',
                        gstRate: 18,
                        revenueLedger: 'MANPOWER_SERVICES' // R1001009
                    },
                    {
                        id: 5,
                        product: 'Housekeeping Services',
                        designation: 'Housekeeper',
                        monthlyRate: 19800,
                        hsnCode: '998539',
                        gstRate: 18,
                        revenueLedger: 'HOUSE_KEEPING_CHARGES' // R1001001
                    },
                    {
                        id: 6,
                        product: 'Housekeeping Services',
                        designation: 'Cleaner',
                        monthlyRate: 17500,
                        hsnCode: '998539',
                        gstRate: 18,
                        revenueLedger: 'HOUSE_KEEPING_CHARGES' // R1001001
                    },
                    {
                        id: 'M1A',
                        product: 'Machinery',
                        designation: 'Vacuum Cleaner Machine',
                        monthlyRate: 4000,
                        hsnCode: '998599',
                        gstRate: 18,
                        isMachinery: true,
                        revenueLedger: 'RENT_ON_MACHINERY' // R1001008
                    },
                    {
                        id: 'C1A',
                        product: 'Consumables',
                        designation: 'Cleaning Consumables',
                        monthlyRate: 2500,
                        hsnCode: '998599',
                        gstRate: 18,
                        isConsumable: true,
                        revenueLedger: 'CLEANING_CONSUMABLE' // R1001005002
                    },
                    {
                        id: 'DC1A',
                        product: 'Deep Cleaning',
                        designation: 'Deep Cleaning Service',
                        monthlyRate: 8000,
                        hsnCode: '998539',
                        gstRate: 18,
                        revenueLedger: 'DEEP_CLEANING' // R1001007
                    },
                    {
                        id: 'PC1A',
                        product: 'Pest Control',
                        designation: 'Monthly Pest Control',
                        monthlyRate: 3500,
                        hsnCode: '998599',
                        gstRate: 18,
                        revenueLedger: 'PEST_CONTROL' // R1001010
                    },
                    {
                        id: 'SC1A',
                        product: 'Service Charges',
                        designation: 'Monthly Service Charges',
                        monthlyRate: 5000,
                        hsnCode: '998539',
                        gstRate: 18,
                        revenueLedger: 'SERVICE_CHARGES' // R1001003
                    },
                    {
                        id: 'HKM1A',
                        product: 'HK Material',
                        designation: 'Housekeeping Material',
                        monthlyRate: 6000,
                        hsnCode: '998599',
                        gstRate: 18,
                        revenueLedger: 'HK_MATERIAL' // R1001005001
                    }
                ]
            },
            'Parking Area': {
                location: 'Parking Area',
                services: [
                    {
                        id: 7,
                        product: 'Deep Cleaning Services',
                        designation: 'Deep Cleaner',
                        monthlyRate: 17500,
                        hsnCode: '998539',
                        gstRate: 18,
                        revenueLedger: 'DEEP_CLEANING' // R1001007
                    },
                    {
                        id: 8,
                        product: 'Security Services',
                        designation: 'Security Guard',
                        monthlyRate: 21355,
                        hsnCode: '998539',
                        gstRate: 18,
                        revenueLedger: 'MANPOWER_SERVICES' // R1001009
                    },
                    {
                        id: 'M2',
                        product: 'Machinery',
                        designation: 'Ride-On Floor Scrubber',
                        monthlyRate: 8000,
                        hsnCode: '998599',
                        gstRate: 18,
                        isMachinery: true,
                        revenueLedger: 'RENT_ON_MACHINERY' // R1001008
                    },
                    {
                        id: 'PC1',
                        product: 'Pest Control',
                        designation: 'Monthly Pest Control Service',
                        monthlyRate: 4500,
                        hsnCode: '998599',
                        gstRate: 18,
                        revenueLedger: 'PEST_CONTROL' // R1001010
                    },
                    {
                        id: 'OC1',
                        product: 'Overseas Consultancy',
                        designation: 'Management Consultancy (Export)',
                        monthlyRate: 25000,
                        hsnCode: '998313',
                        gstRate: 0,
                        isExport: true,
                        revenueLedger: 'OVERSEAS_CONSULTANCY' // R1001004
                    },
                    {
                        id: 'SC2',
                        product: 'Service Charges',
                        designation: 'Parking Maintenance Charges',
                        monthlyRate: 7000,
                        hsnCode: '998539',
                        gstRate: 18,
                        revenueLedger: 'SERVICE_CHARGES' // R1001003
                    },
                    {
                        id: 'C2A',
                        product: 'Consumables',
                        designation: 'Cleaning Consumables',
                        monthlyRate: 3500,
                        hsnCode: '998599',
                        gstRate: 18,
                        isConsumable: true,
                        revenueLedger: 'CLEANING_CONSUMABLE' // R1001005002
                    },
                    {
                        id: 'HKM2',
                        product: 'HK Material',
                        designation: 'Housekeeping Material',
                        monthlyRate: 5500,
                        hsnCode: '998599',
                        gstRate: 18,
                        revenueLedger: 'HK_MATERIAL' // R1001005001
                    },
                    {
                        id: 'EX2',
                        product: 'Housekeeping Services (Exempt)',
                        designation: 'Housekeeper (Exempt)',
                        monthlyRate: 12000,
                        hsnCode: '998539',
                        gstRate: 0,
                        isExempt: true,
                        revenueLedger: 'HOUSE_KEEPING_EXEMPT' // R1001002
                    }
                ]
            }
        },
        managementFees: 8 // 8% management fees
    },

    // TechCorp IT Park - Bangalore
    'TechCorp IT Park': {
        sites: {
            'Building A': {
                location: 'Building A',
                services: [
                    {
                        id: 9,
                        product: 'Housekeeping Services',
                        designation: 'Receptionist',
                        monthlyRate: 32007,
                        hsnCode: '998539',
                        gstRate: 18,
                        revenueLedger: 'HOUSE_KEEPING_CHARGES' // R1001001
                    },
                    {
                        id: 10,
                        product: 'Housekeeping Services',
                        designation: 'Janitor',
                        monthlyRate: 26960,
                        hsnCode: '998539',
                        gstRate: 18,
                        revenueLedger: 'HOUSE_KEEPING_CHARGES' // R1001001
                    },
                    {
                        id: 11,
                        product: 'Housekeeping Services',
                        designation: 'Office Boy',
                        monthlyRate: 24276,
                        hsnCode: '998539',
                        gstRate: 18,
                        revenueLedger: 'HOUSE_KEEPING_CHARGES' // R1001001
                    },
                    {
                        id: 12,
                        product: 'Housekeeping Services',
                        designation: 'House Keeper',
                        monthlyRate: 21443,
                        hsnCode: '998539',
                        gstRate: 18,
                        revenueLedger: 'HOUSE_KEEPING_CHARGES' // R1001001
                    },
                    {
                        id: 'HKM1',
                        product: 'HK Material',
                        designation: 'Cleaning Materials Supply',
                        monthlyRate: 4900,
                        hsnCode: '998599',
                        gstRate: 18,
                        revenueLedger: 'HK_MATERIAL' // R1001005001
                    },
                    {
                        id: 'M4',
                        product: 'Machinery',
                        designation: 'Floor Polishing Machine',
                        monthlyRate: 7000,
                        hsnCode: '998599',
                        gstRate: 18,
                        isMachinery: true,
                        revenueLedger: 'RENT_ON_MACHINERY' // R1001008
                    },
                    {
                        id: 'C3',
                        product: 'Consumables',
                        designation: 'Cleaning Consumables',
                        monthlyRate: 4000,
                        hsnCode: '998599',
                        gstRate: 18,
                        isConsumable: true,
                        revenueLedger: 'CLEANING_CONSUMABLE' // R1001005002
                    },
                    {
                        id: 'DC2',
                        product: 'Deep Cleaning',
                        designation: 'Deep Cleaning Service',
                        monthlyRate: 10000,
                        hsnCode: '998539',
                        gstRate: 18,
                        revenueLedger: 'DEEP_CLEANING' // R1001007
                    },
                    {
                        id: 'PC3',
                        product: 'Pest Control',
                        designation: 'Quarterly Pest Control',
                        monthlyRate: 5000,
                        hsnCode: '998599',
                        gstRate: 18,
                        revenueLedger: 'PEST_CONTROL' // R1001010
                    },
                    {
                        id: 'SC3',
                        product: 'Service Charges',
                        designation: 'Building Maintenance Charges',
                        monthlyRate: 12000,
                        hsnCode: '998539',
                        gstRate: 18,
                        revenueLedger: 'SERVICE_CHARGES' // R1001003
                    },
                    {
                        id: 'EX3',
                        product: 'Housekeeping Services (Exempt)',
                        designation: 'Housekeeper (Exempt)',
                        monthlyRate: 18000,
                        hsnCode: '998539',
                        gstRate: 0,
                        isExempt: true,
                        revenueLedger: 'HOUSE_KEEPING_EXEMPT' // R1001002
                    },
                    {
                        id: 'OC2',
                        product: 'Overseas Consultancy',
                        designation: 'IT Consultancy (Export)',
                        monthlyRate: 30000,
                        hsnCode: '998313',
                        gstRate: 0,
                        isExport: true,
                        revenueLedger: 'OVERSEAS_CONSULTANCY' // R1001004
                    },
                    {
                        id: 'MP1',
                        product: 'Manpower Services',
                        designation: 'General Manpower Services',
                        monthlyRate: 20000,
                        hsnCode: '998539',
                        gstRate: 18,
                        revenueLedger: 'MANPOWER_SERVICES' // R1001009
                    }
                ]
            },
            'Building B': {
                location: 'Building B',
                services: [
                    {
                        id: 13,
                        product: 'Security Services',
                        designation: 'Security Guard',
                        monthlyRate: 22500,
                        hsnCode: '998539',
                        gstRate: 18,
                        revenueLedger: 'MANPOWER_SERVICES' // R1001009
                    },
                    {
                        id: 14,
                        product: 'Housekeeping Services',
                        designation: 'Pantry Boy',
                        monthlyRate: 24486,
                        hsnCode: '998539',
                        gstRate: 18,
                        revenueLedger: 'HOUSE_KEEPING_CHARGES' // R1001001
                    },
                    {
                        id: 15,
                        product: 'Housekeeping Services',
                        designation: 'Chambermaid',
                        monthlyRate: 21443,
                        hsnCode: '998539',
                        gstRate: 18,
                        revenueLedger: 'HOUSE_KEEPING_CHARGES' // R1001001
                    },
                    {
                        id: 'DC1',
                        product: 'Deep Cleaning',
                        designation: 'Deep Cleaning Service',
                        monthlyRate: 12000,
                        hsnCode: '998539',
                        gstRate: 18,
                        revenueLedger: 'DEEP_CLEANING' // R1001007
                    },
                    {
                        id: 'PC2',
                        product: 'Pest Control',
                        designation: 'Quarterly Pest Control',
                        monthlyRate: 6000,
                        hsnCode: '998599',
                        gstRate: 18,
                        revenueLedger: 'PEST_CONTROL' // R1001010
                    },
                    {
                        id: 'SC1',
                        product: 'Service Charges',
                        designation: 'Monthly Service Charges',
                        monthlyRate: 15000,
                        hsnCode: '998539',
                        gstRate: 18,
                        revenueLedger: 'SERVICE_CHARGES' // R1001003
                    },
                    {
                        id: 'M5',
                        product: 'Machinery',
                        designation: 'Scrubbing Machine',
                        monthlyRate: 6500,
                        hsnCode: '998599',
                        gstRate: 18,
                        isMachinery: true,
                        revenueLedger: 'RENT_ON_MACHINERY' // R1001008
                    },
                    {
                        id: 'C4',
                        product: 'Consumables',
                        designation: 'Cleaning Consumables',
                        monthlyRate: 3800,
                        hsnCode: '998599',
                        gstRate: 18,
                        isConsumable: true,
                        revenueLedger: 'CLEANING_CONSUMABLE' // R1001005002
                    },
                    {
                        id: 'HKM3',
                        product: 'HK Material',
                        designation: 'Housekeeping Material',
                        monthlyRate: 5500,
                        hsnCode: '998599',
                        gstRate: 18,
                        revenueLedger: 'HK_MATERIAL' // R1001005001
                    },
                    {
                        id: 'EX4',
                        product: 'Housekeeping Services (Exempt)',
                        designation: 'Housekeeper (Exempt)',
                        monthlyRate: 16000,
                        hsnCode: '998539',
                        gstRate: 0,
                        isExempt: true,
                        revenueLedger: 'HOUSE_KEEPING_EXEMPT' // R1001002
                    },
                    {
                        id: 'OC3',
                        product: 'Overseas Consultancy',
                        designation: 'Management Consultancy (Export)',
                        monthlyRate: 28000,
                        hsnCode: '998313',
                        gstRate: 0,
                        isExport: true,
                        revenueLedger: 'OVERSEAS_CONSULTANCY' // R1001004
                    }
                ]
            }
        },
        managementFees: 10
    },

    // NeoSoft Pvt. Ltd. - Pune
    'NeoSoft Pvt. Ltd.': {
        sites: {
            'Main Office': {
                location: 'Main Office',
                services: [
                    {
                        id: 16,
                        product: 'Housekeeping Services',
                        designation: 'Housekeeper - 3 hrs shift',
                        monthlyRate: 21355,
                        hsnCode: '998539',
                        gstRate: 18,
                        revenueLedger: 'HOUSE_KEEPING_CHARGES' // R1001001
                    },
                    {
                        id: 17,
                        product: 'Security Services',
                        designation: 'Security Guard',
                        monthlyRate: 23000,
                        hsnCode: '998539',
                        gstRate: 18,
                        revenueLedger: 'MANPOWER_SERVICES' // R1001009
                    },
                    {
                        id: 'C2',
                        product: 'Consumables',
                        designation: 'Cleaning Consumables',
                        monthlyRate: 2500,
                        hsnCode: '998599',
                        gstRate: 18,
                        revenueLedger: 'CLEANING_CONSUMABLE' // R1001005002
                    },
                    {
                        id: 'M6',
                        product: 'Machinery',
                        designation: 'Vacuum Cleaner',
                        monthlyRate: 3500,
                        hsnCode: '998599',
                        gstRate: 18,
                        isMachinery: true,
                        revenueLedger: 'RENT_ON_MACHINERY' // R1001008
                    },
                    {
                        id: 'HKM4',
                        product: 'HK Material',
                        designation: 'Housekeeping Material',
                        monthlyRate: 4000,
                        hsnCode: '998599',
                        gstRate: 18,
                        revenueLedger: 'HK_MATERIAL' // R1001005001
                    },
                    {
                        id: 'DC3',
                        product: 'Deep Cleaning',
                        designation: 'Deep Cleaning Service',
                        monthlyRate: 7000,
                        hsnCode: '998539',
                        gstRate: 18,
                        revenueLedger: 'DEEP_CLEANING' // R1001007
                    },
                    {
                        id: 'PC4',
                        product: 'Pest Control',
                        designation: 'Monthly Pest Control',
                        monthlyRate: 3000,
                        hsnCode: '998599',
                        gstRate: 18,
                        revenueLedger: 'PEST_CONTROL' // R1001010
                    },
                    {
                        id: 'SC4',
                        product: 'Service Charges',
                        designation: 'Office Maintenance Charges',
                        monthlyRate: 8000,
                        hsnCode: '998539',
                        gstRate: 18,
                        revenueLedger: 'SERVICE_CHARGES' // R1001003
                    },
                    {
                        id: 'EX5',
                        product: 'Housekeeping Services (Exempt)',
                        designation: 'Housekeeper (Exempt)',
                        monthlyRate: 14000,
                        hsnCode: '998539',
                        gstRate: 0,
                        isExempt: true,
                        revenueLedger: 'HOUSE_KEEPING_EXEMPT' // R1001002
                    },
                    {
                        id: 'OC4',
                        product: 'Overseas Consultancy',
                        designation: 'Software Consultancy (Export)',
                        monthlyRate: 35000,
                        hsnCode: '998313',
                        gstRate: 0,
                        isExport: true,
                        revenueLedger: 'OVERSEAS_CONSULTANCY' // R1001004
                    }
                ]
            }
        },
        managementFees: 8
    },

    // Global Industries - Delhi
    'Global Industries': {
        sites: {
            'Factory Unit 1': {
                location: 'Factory Unit 1',
                services: [
                    {
                        id: 18,
                        product: 'Security Services',
                        designation: 'Security Guard',
                        monthlyRate: 20500,
                        hsnCode: '998539',
                        gstRate: 18,
                        revenueLedger: 'MANPOWER_SERVICES' // R1001009
                    },
                    {
                        id: 19,
                        product: 'Housekeeping Services',
                        designation: 'Cleaner',
                        monthlyRate: 18000,
                        hsnCode: '998539',
                        gstRate: 18,
                        revenueLedger: 'HOUSE_KEEPING_CHARGES' // R1001001
                    },
                    {
                        id: 20,
                        product: 'Housekeeping Services',
                        designation: 'Supervisor',
                        monthlyRate: 30000,
                        hsnCode: '998539',
                        gstRate: 18,
                        revenueLedger: 'MANPOWER_SERVICES' // R1001009
                    },
                    {
                        id: 'M3',
                        product: 'Machinery',
                        designation: 'Floor Cleaning Machine',
                        monthlyRate: 12000,
                        hsnCode: '998599',
                        gstRate: 18,
                        isMachinery: true,
                        revenueLedger: 'RENT_ON_MACHINERY' // R1001008
                    },
                    {
                        id: 'C5',
                        product: 'Consumables',
                        designation: 'Industrial Cleaning Consumables',
                        monthlyRate: 5000,
                        hsnCode: '998599',
                        gstRate: 18,
                        isConsumable: true,
                        revenueLedger: 'CLEANING_CONSUMABLE' // R1001005002
                    },
                    {
                        id: 'HKM5',
                        product: 'HK Material',
                        designation: 'Housekeeping Material',
                        monthlyRate: 7000,
                        hsnCode: '998599',
                        gstRate: 18,
                        revenueLedger: 'HK_MATERIAL' // R1001005001
                    },
                    {
                        id: 'DC4',
                        product: 'Deep Cleaning',
                        designation: 'Industrial Deep Cleaning',
                        monthlyRate: 15000,
                        hsnCode: '998539',
                        gstRate: 18,
                        revenueLedger: 'DEEP_CLEANING' // R1001007
                    },
                    {
                        id: 'PC5',
                        product: 'Pest Control',
                        designation: 'Industrial Pest Control',
                        monthlyRate: 8000,
                        hsnCode: '998599',
                        gstRate: 18,
                        revenueLedger: 'PEST_CONTROL' // R1001010
                    },
                    {
                        id: 'SC5',
                        product: 'Service Charges',
                        designation: 'Factory Maintenance Charges',
                        monthlyRate: 10000,
                        hsnCode: '998539',
                        gstRate: 18,
                        revenueLedger: 'SERVICE_CHARGES' // R1001003
                    },
                    {
                        id: 'EX6',
                        product: 'Housekeeping Services (Exempt)',
                        designation: 'Housekeeper (Exempt)',
                        monthlyRate: 17000,
                        hsnCode: '998539',
                        gstRate: 0,
                        isExempt: true,
                        revenueLedger: 'HOUSE_KEEPING_EXEMPT' // R1001002
                    },
                    {
                        id: 'OC5',
                        product: 'Overseas Consultancy',
                        designation: 'Industrial Consultancy (Export)',
                        monthlyRate: 40000,
                        hsnCode: '998313',
                        gstRate: 0,
                        isExport: true,
                        revenueLedger: 'OVERSEAS_CONSULTANCY' // R1001004
                    }
                ]
            },
            'Factory Unit 2': {
                location: 'Factory Unit 2',
                services: [
                    {
                        id: 21,
                        product: 'Security Services',
                        designation: 'Security Guard',
                        monthlyRate: 20500,
                        hsnCode: '998539',
                        gstRate: 18,
                        revenueLedger: 'MANPOWER_SERVICES' // R1001009
                    },
                    {
                        id: 22,
                        product: 'Housekeeping Services',
                        designation: 'Cleaner',
                        monthlyRate: 18000,
                        hsnCode: '998539',
                        gstRate: 18,
                        revenueLedger: 'HOUSE_KEEPING_CHARGES' // R1001001
                    },
                    {
                        id: 'M7',
                        product: 'Machinery',
                        designation: 'Floor Scrubbing Machine',
                        monthlyRate: 10000,
                        hsnCode: '998599',
                        gstRate: 18,
                        isMachinery: true,
                        revenueLedger: 'RENT_ON_MACHINERY' // R1001008
                    },
                    {
                        id: 'C6',
                        product: 'Consumables',
                        designation: 'Industrial Cleaning Consumables',
                        monthlyRate: 4500,
                        hsnCode: '998599',
                        gstRate: 18,
                        isConsumable: true,
                        revenueLedger: 'CLEANING_CONSUMABLE' // R1001005002
                    },
                    {
                        id: 'HKM6',
                        product: 'HK Material',
                        designation: 'Housekeeping Material',
                        monthlyRate: 6500,
                        hsnCode: '998599',
                        gstRate: 18,
                        revenueLedger: 'HK_MATERIAL' // R1001005001
                    },
                    {
                        id: 'DC5',
                        product: 'Deep Cleaning',
                        designation: 'Industrial Deep Cleaning',
                        monthlyRate: 13000,
                        hsnCode: '998539',
                        gstRate: 18,
                        revenueLedger: 'DEEP_CLEANING' // R1001007
                    },
                    {
                        id: 'PC6',
                        product: 'Pest Control',
                        designation: 'Industrial Pest Control',
                        monthlyRate: 7000,
                        hsnCode: '998599',
                        gstRate: 18,
                        revenueLedger: 'PEST_CONTROL' // R1001010
                    },
                    {
                        id: 'SC6',
                        product: 'Service Charges',
                        designation: 'Factory Maintenance Charges',
                        monthlyRate: 9000,
                        hsnCode: '998539',
                        gstRate: 18,
                        revenueLedger: 'SERVICE_CHARGES' // R1001003
                    },
                    {
                        id: 'EX7',
                        product: 'Housekeeping Services (Exempt)',
                        designation: 'Housekeeper (Exempt)',
                        monthlyRate: 16000,
                        hsnCode: '998539',
                        gstRate: 0,
                        isExempt: true,
                        revenueLedger: 'HOUSE_KEEPING_EXEMPT' // R1001002
                    },
                    {
                        id: 'OC6',
                        product: 'Overseas Consultancy',
                        designation: 'Industrial Consultancy (Export)',
                        monthlyRate: 38000,
                        hsnCode: '998313',
                        gstRate: 0,
                        isExport: true,
                        revenueLedger: 'OVERSEAS_CONSULTANCY' // R1001004
                    }
                ]
            }
        },
        managementFees: 7
    },

    // Retail Paradise - Hyderabad
    'Retail Paradise': {
        sites: {
            'Store 1': {
                location: 'Store 1',
                services: [
                    {
                        id: 23,
                        product: 'Security Services',
                        designation: 'Security Guard',
                        monthlyRate: 21000,
                        hsnCode: '998539',
                        gstRate: 18,
                        revenueLedger: 'MANPOWER_SERVICES' // R1001009
                    },
                    {
                        id: 24,
                        product: 'Housekeeping Services',
                        designation: 'Cleaner',
                        monthlyRate: 17800,
                        hsnCode: '998539',
                        gstRate: 18,
                        revenueLedger: 'HOUSE_KEEPING_CHARGES' // R1001001
                    },
                    {
                        id: 'M8',
                        product: 'Machinery',
                        designation: 'Floor Polisher',
                        monthlyRate: 4500,
                        hsnCode: '998599',
                        gstRate: 18,
                        isMachinery: true,
                        revenueLedger: 'RENT_ON_MACHINERY' // R1001008
                    },
                    {
                        id: 'C7',
                        product: 'Consumables',
                        designation: 'Retail Cleaning Consumables',
                        monthlyRate: 3000,
                        hsnCode: '998599',
                        gstRate: 18,
                        isConsumable: true,
                        revenueLedger: 'CLEANING_CONSUMABLE' // R1001005002
                    },
                    {
                        id: 'HKM7',
                        product: 'HK Material',
                        designation: 'Housekeeping Material',
                        monthlyRate: 5000,
                        hsnCode: '998599',
                        gstRate: 18,
                        revenueLedger: 'HK_MATERIAL' // R1001005001
                    },
                    {
                        id: 'DC6',
                        product: 'Deep Cleaning',
                        designation: 'Deep Cleaning Service',
                        monthlyRate: 9000,
                        hsnCode: '998539',
                        gstRate: 18,
                        revenueLedger: 'DEEP_CLEANING' // R1001007
                    },
                    {
                        id: 'PC7',
                        product: 'Pest Control',
                        designation: 'Monthly Pest Control',
                        monthlyRate: 4000,
                        hsnCode: '998599',
                        gstRate: 18,
                        revenueLedger: 'PEST_CONTROL' // R1001010
                    },
                    {
                        id: 'SC7',
                        product: 'Service Charges',
                        designation: 'Store Maintenance Charges',
                        monthlyRate: 6000,
                        hsnCode: '998539',
                        gstRate: 18,
                        revenueLedger: 'SERVICE_CHARGES' // R1001003
                    },
                    {
                        id: 'EX8',
                        product: 'Housekeeping Services (Exempt)',
                        designation: 'Housekeeper (Exempt)',
                        monthlyRate: 13000,
                        hsnCode: '998539',
                        gstRate: 0,
                        isExempt: true,
                        revenueLedger: 'HOUSE_KEEPING_EXEMPT' // R1001002
                    },
                    {
                        id: 'OC7',
                        product: 'Overseas Consultancy',
                        designation: 'Retail Consultancy (Export)',
                        monthlyRate: 22000,
                        hsnCode: '998313',
                        gstRate: 0,
                        isExport: true,
                        revenueLedger: 'OVERSEAS_CONSULTANCY' // R1001004
                    }
                ]
            }
        },
        managementFees: 8
    }
};

// Payroll Attendance Data by Customer and Site
export const PAYROLL_DATA = {
    'ABC Mall': {
        sites: {
            'Ground Floor': [
                { designation: 'Security Guard', totalDays: 90, numberOfWorkers: 3 }, // 3 guards × 30 days
                { designation: 'Supervisor', totalDays: 30, numberOfWorkers: 1 },
                { designation: 'Housekeeper', totalDays: 60, numberOfWorkers: 2 },
                { designation: 'Housekeeping Material Supply', totalDays: 1, numberOfWorkers: 1 },
                { designation: 'Housekeeper (Exempt)', totalDays: 30, numberOfWorkers: 1, isExempt: true },
                { designation: 'Floor Scrubber Machine', totalDays: 1, numberOfWorkers: 1, isMachinery: true },
                { designation: 'Cleaning Chemicals & Supplies', totalDays: 1, numberOfWorkers: 1, isConsumable: true }
            ],
            'First Floor': [
                { designation: 'Security Guard', totalDays: 60, numberOfWorkers: 2 },
                { designation: 'Housekeeper', totalDays: 30, numberOfWorkers: 1 },
                { designation: 'Cleaner', totalDays: 90, numberOfWorkers: 3 },
                { designation: 'Vacuum Cleaner Machine', totalDays: 1, numberOfWorkers: 1, isMachinery: true },
                { designation: 'Cleaning Consumables', totalDays: 1, numberOfWorkers: 1, isConsumable: true },
                { designation: 'Deep Cleaning Service', totalDays: 1, numberOfWorkers: 1 },
                { designation: 'Monthly Pest Control', totalDays: 1, numberOfWorkers: 1 },
                { designation: 'Monthly Service Charges', totalDays: 1, numberOfWorkers: 1 },
                { designation: 'Housekeeping Material', totalDays: 1, numberOfWorkers: 1 }
            ],
            'Parking Area': [
                { designation: 'Deep Cleaner', totalDays: 60, numberOfWorkers: 2 },
                { designation: 'Security Guard', totalDays: 30, numberOfWorkers: 1 },
                { designation: 'Ride-On Floor Scrubber', totalDays: 1, numberOfWorkers: 1, isMachinery: true },
                { designation: 'Monthly Pest Control Service', totalDays: 1, numberOfWorkers: 1 },
                { designation: 'Management Consultancy (Export)', totalDays: 1, numberOfWorkers: 1, isExport: true },
                { designation: 'Parking Maintenance Charges', totalDays: 1, numberOfWorkers: 1 },
                { designation: 'Cleaning Consumables', totalDays: 1, numberOfWorkers: 1, isConsumable: true },
                { designation: 'Housekeeping Material', totalDays: 1, numberOfWorkers: 1 },
                { designation: 'Housekeeper (Exempt)', totalDays: 30, numberOfWorkers: 1, isExempt: true }
            ]
        }
    },

    'TechCorp IT Park': {
        sites: {
            'Building A': [
                { designation: 'Receptionist', totalDays: 29, numberOfWorkers: 1 },
                { designation: 'Janitor', totalDays: 165, numberOfWorkers: 5.5 },
                { designation: 'Office Boy', totalDays: 82, numberOfWorkers: 2.7 },
                { designation: 'House Keeper', totalDays: 120, numberOfWorkers: 4 },
                { designation: 'Cleaning Materials Supply', totalDays: 1, numberOfWorkers: 1 },
                { designation: 'Floor Polishing Machine', totalDays: 1, numberOfWorkers: 1, isMachinery: true },
                { designation: 'Cleaning Consumables', totalDays: 1, numberOfWorkers: 1, isConsumable: true },
                { designation: 'Deep Cleaning Service', totalDays: 1, numberOfWorkers: 1 },
                { designation: 'Quarterly Pest Control', totalDays: 1, numberOfWorkers: 1 },
                { designation: 'Building Maintenance Charges', totalDays: 1, numberOfWorkers: 1 },
                { designation: 'Housekeeper (Exempt)', totalDays: 30, numberOfWorkers: 1, isExempt: true },
                { designation: 'IT Consultancy (Export)', totalDays: 1, numberOfWorkers: 1, isExport: true },
                { designation: 'General Manpower Services', totalDays: 30, numberOfWorkers: 1 }
            ],
            'Building B': [
                { designation: 'Security Guard', totalDays: 180, numberOfWorkers: 6 },
                { designation: 'Pantry Boy', totalDays: 90, numberOfWorkers: 3 },
                { designation: 'Chambermaid', totalDays: 60, numberOfWorkers: 2 },
                { designation: 'Deep Cleaning Service', totalDays: 1, numberOfWorkers: 1 },
                { designation: 'Quarterly Pest Control', totalDays: 1, numberOfWorkers: 1 },
                { designation: 'Monthly Service Charges', totalDays: 1, numberOfWorkers: 1 },
                { designation: 'Scrubbing Machine', totalDays: 1, numberOfWorkers: 1, isMachinery: true },
                { designation: 'Cleaning Consumables', totalDays: 1, numberOfWorkers: 1, isConsumable: true },
                { designation: 'Housekeeping Material', totalDays: 1, numberOfWorkers: 1 },
                { designation: 'Housekeeper (Exempt)', totalDays: 30, numberOfWorkers: 1, isExempt: true },
                { designation: 'Management Consultancy (Export)', totalDays: 1, numberOfWorkers: 1, isExport: true }
            ]
        }
    },

    'NeoSoft Pvt. Ltd.': {
        sites: {
            'Main Office': [
                { designation: 'Housekeeper - 3 hrs shift', totalDays: 30, numberOfWorkers: 1 },
                { designation: 'Security Guard', totalDays: 60, numberOfWorkers: 2 },
                { designation: 'Cleaning Consumables', totalDays: 1, numberOfWorkers: 1, isConsumable: true },
                { designation: 'Vacuum Cleaner', totalDays: 1, numberOfWorkers: 1, isMachinery: true },
                { designation: 'Housekeeping Material', totalDays: 1, numberOfWorkers: 1 },
                { designation: 'Deep Cleaning Service', totalDays: 1, numberOfWorkers: 1 },
                { designation: 'Monthly Pest Control', totalDays: 1, numberOfWorkers: 1 },
                { designation: 'Office Maintenance Charges', totalDays: 1, numberOfWorkers: 1 },
                { designation: 'Housekeeper (Exempt)', totalDays: 30, numberOfWorkers: 1, isExempt: true },
                { designation: 'Software Consultancy (Export)', totalDays: 1, numberOfWorkers: 1, isExport: true }
            ]
        }
    },

    'Global Industries': {
        sites: {
            'Factory Unit 1': [
                { designation: 'Security Guard', totalDays: 120, numberOfWorkers: 4 },
                { designation: 'Cleaner', totalDays: 150, numberOfWorkers: 5 },
                { designation: 'Supervisor', totalDays: 30, numberOfWorkers: 1 },
                { designation: 'Floor Cleaning Machine', totalDays: 1, numberOfWorkers: 1, isMachinery: true },
                { designation: 'Industrial Cleaning Consumables', totalDays: 1, numberOfWorkers: 1, isConsumable: true },
                { designation: 'Housekeeping Material', totalDays: 1, numberOfWorkers: 1 },
                { designation: 'Industrial Deep Cleaning', totalDays: 1, numberOfWorkers: 1 },
                { designation: 'Industrial Pest Control', totalDays: 1, numberOfWorkers: 1 },
                { designation: 'Factory Maintenance Charges', totalDays: 1, numberOfWorkers: 1 },
                { designation: 'Housekeeper (Exempt)', totalDays: 30, numberOfWorkers: 1, isExempt: true },
                { designation: 'Industrial Consultancy (Export)', totalDays: 1, numberOfWorkers: 1, isExport: true }
            ],
            'Factory Unit 2': [
                { designation: 'Security Guard', totalDays: 90, numberOfWorkers: 3 },
                { designation: 'Cleaner', totalDays: 60, numberOfWorkers: 2 },
                { designation: 'Floor Scrubbing Machine', totalDays: 1, numberOfWorkers: 1, isMachinery: true },
                { designation: 'Industrial Cleaning Consumables', totalDays: 1, numberOfWorkers: 1, isConsumable: true },
                { designation: 'Housekeeping Material', totalDays: 1, numberOfWorkers: 1 },
                { designation: 'Industrial Deep Cleaning', totalDays: 1, numberOfWorkers: 1 },
                { designation: 'Industrial Pest Control', totalDays: 1, numberOfWorkers: 1 },
                { designation: 'Factory Maintenance Charges', totalDays: 1, numberOfWorkers: 1 },
                { designation: 'Housekeeper (Exempt)', totalDays: 30, numberOfWorkers: 1, isExempt: true },
                { designation: 'Industrial Consultancy (Export)', totalDays: 1, numberOfWorkers: 1, isExport: true }
            ]
        }
    },

    'Retail Paradise': {
        sites: {
            'Store 1': [
                { designation: 'Security Guard', totalDays: 60, numberOfWorkers: 2 },
                { designation: 'Cleaner', totalDays: 30, numberOfWorkers: 1 },
                { designation: 'Floor Polisher', totalDays: 1, numberOfWorkers: 1, isMachinery: true },
                { designation: 'Retail Cleaning Consumables', totalDays: 1, numberOfWorkers: 1, isConsumable: true },
                { designation: 'Housekeeping Material', totalDays: 1, numberOfWorkers: 1 },
                { designation: 'Deep Cleaning Service', totalDays: 1, numberOfWorkers: 1 },
                { designation: 'Monthly Pest Control', totalDays: 1, numberOfWorkers: 1 },
                { designation: 'Store Maintenance Charges', totalDays: 1, numberOfWorkers: 1 },
                { designation: 'Housekeeper (Exempt)', totalDays: 30, numberOfWorkers: 1, isExempt: true },
                { designation: 'Retail Consultancy (Export)', totalDays: 1, numberOfWorkers: 1, isExport: true }
            ]
        }
    }
};

// Previous month billing data for comparison
export const PREVIOUS_MONTH_BILLING = {
    'ABC Mall': {
        'Ground Floor': 62000,
        'First Floor': 48000,
        'Parking Area': 35000
    },
    'TechCorp IT Park': {
        'Building A': 250000,
        'Building B': 180000
    },
    'NeoSoft Pvt. Ltd.': {
        'Main Office': 45000
    },
    'Global Industries': {
        'Factory Unit 1': 195000,
        'Factory Unit 2': 125000
    },
    'Retail Paradise': {
        'Store 1': 38000
    }
};

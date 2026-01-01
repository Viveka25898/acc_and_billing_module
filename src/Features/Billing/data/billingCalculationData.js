// Billing Calculation - Dummy Rate Cards and Payroll Data

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
                        gstRate: 18
                    },
                    {
                        id: 2,
                        product: 'Security Services',
                        designation: 'Supervisor',
                        monthlyRate: 28500,
                        hsnCode: '998539',
                        gstRate: 18
                    },
                    {
                        id: 3,
                        product: 'Housekeeping Services',
                        designation: 'Housekeeper',
                        monthlyRate: 19800,
                        hsnCode: '998539',
                        gstRate: 18
                    },
                    {
                        id: 'M1',
                        product: 'Machinery',
                        designation: 'Floor Scrubber Machine',
                        monthlyRate: 5000,
                        hsnCode: '998599',
                        gstRate: 18,
                        isMachinery: true
                    },
                    {
                        id: 'C1',
                        product: 'Consumables',
                        designation: 'Cleaning Chemicals & Supplies',
                        monthlyRate: 3000,
                        hsnCode: '998599',
                        gstRate: 18,
                        isConsumable: true
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
                        gstRate: 18
                    },
                    {
                        id: 5,
                        product: 'Housekeeping Services',
                        designation: 'Housekeeper',
                        monthlyRate: 19800,
                        hsnCode: '998539',
                        gstRate: 18
                    },
                    {
                        id: 6,
                        product: 'Housekeeping Services',
                        designation: 'Cleaner',
                        monthlyRate: 17500,
                        hsnCode: '998539',
                        gstRate: 18
                    }
                ]
            },
            'Parking Area': {
                location: 'Parking Area',
                services: [
                    {
                        id: 7,
                        product: 'Cleaning Services',
                        designation: 'Cleaner',
                        monthlyRate: 17500,
                        hsnCode: '998539',
                        gstRate: 18
                    },
                    {
                        id: 8,
                        product: 'Security Services',
                        designation: 'Security Guard',
                        monthlyRate: 21355,
                        hsnCode: '998539',
                        gstRate: 18
                    },
                    {
                        id: 'M2',
                        product: 'Machinery',
                        designation: 'Ride-On Floor Scrubber',
                        monthlyRate: 8000,
                        hsnCode: '998599',
                        gstRate: 18,
                        isMachinery: true
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
                        gstRate: 18
                    },
                    {
                        id: 10,
                        product: 'Housekeeping Services',
                        designation: 'Janitor',
                        monthlyRate: 26960,
                        hsnCode: '998539',
                        gstRate: 18
                    },
                    {
                        id: 11,
                        product: 'Housekeeping Services',
                        designation: 'Office Boy',
                        monthlyRate: 24276,
                        hsnCode: '998539',
                        gstRate: 18
                    },
                    {
                        id: 12,
                        product: 'Housekeeping Services',
                        designation: 'House Keeper',
                        monthlyRate: 21443,
                        hsnCode: '998539',
                        gstRate: 18
                    }
                ],
                machineryCharges: 4900
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
                        gstRate: 18
                    },
                    {
                        id: 14,
                        product: 'Housekeeping Services',
                        designation: 'Pantry Boy',
                        monthlyRate: 24486,
                        hsnCode: '998539',
                        gstRate: 18
                    },
                    {
                        id: 15,
                        product: 'Housekeeping Services',
                        designation: 'Chambermaid',
                        monthlyRate: 21443,
                        hsnCode: '998539',
                        gstRate: 18
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
                        gstRate: 18
                    },
                    {
                        id: 17,
                        product: 'Security Services',
                        designation: 'Security Guard',
                        monthlyRate: 23000,
                        hsnCode: '998539',
                        gstRate: 18
                    }
                ],
                consumables: 2500
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
                        gstRate: 18
                    },
                    {
                        id: 19,
                        product: 'Housekeeping Services',
                        designation: 'Cleaner',
                        monthlyRate: 18000,
                        hsnCode: '998539',
                        gstRate: 18
                    },
                    {
                        id: 20,
                        product: 'Housekeeping Services',
                        designation: 'Supervisor',
                        monthlyRate: 30000,
                        hsnCode: '998539',
                        gstRate: 18
                    }
                ],
                machineryCharges: 12000
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
                        gstRate: 18
                    },
                    {
                        id: 22,
                        product: 'Housekeeping Services',
                        designation: 'Cleaner',
                        monthlyRate: 18000,
                        hsnCode: '998539',
                        gstRate: 18
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
                        gstRate: 18
                    },
                    {
                        id: 24,
                        product: 'Housekeeping Services',
                        designation: 'Cleaner',
                        monthlyRate: 17800,
                        hsnCode: '998539',
                        gstRate: 18
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
                { designation: 'Floor Scrubber Machine', totalDays: 1, numberOfWorkers: 1, isMachinery: true },
                { designation: 'Cleaning Chemicals & Supplies', totalDays: 1, numberOfWorkers: 1, isConsumable: true }
            ],
            'First Floor': [
                { designation: 'Security Guard', totalDays: 60, numberOfWorkers: 2 },
                { designation: 'Housekeeper', totalDays: 30, numberOfWorkers: 1 },
                { designation: 'Cleaner', totalDays: 90, numberOfWorkers: 3 }
            ],
            'Parking Area': [
                { designation: 'Cleaner', totalDays: 60, numberOfWorkers: 2 },
                { designation: 'Security Guard', totalDays: 30, numberOfWorkers: 1 },
                { designation: 'Ride-On Floor Scrubber', totalDays: 1, numberOfWorkers: 1, isMachinery: true }
            ]
        }
    },

    'TechCorp IT Park': {
        sites: {
            'Building A': [
                { designation: 'Receptionist', totalDays: 29, numberOfWorkers: 1 },
                { designation: 'Janitor', totalDays: 165, numberOfWorkers: 5.5 },
                { designation: 'Office Boy', totalDays: 82, numberOfWorkers: 2.7 },
                { designation: 'House Keeper', totalDays: 120, numberOfWorkers: 4 }
            ],
            'Building B': [
                { designation: 'Security Guard', totalDays: 180, numberOfWorkers: 6 },
                { designation: 'Pantry Boy', totalDays: 90, numberOfWorkers: 3 },
                { designation: 'Chambermaid', totalDays: 60, numberOfWorkers: 2 }
            ]
        }
    },

    'NeoSoft Pvt. Ltd.': {
        sites: {
            'Main Office': [
                { designation: 'Housekeeper - 3 hrs shift', totalDays: 30, numberOfWorkers: 1 },
                { designation: 'Security Guard', totalDays: 60, numberOfWorkers: 2 }
            ]
        }
    },

    'Global Industries': {
        sites: {
            'Factory Unit 1': [
                { designation: 'Security Guard', totalDays: 120, numberOfWorkers: 4 },
                { designation: 'Cleaner', totalDays: 150, numberOfWorkers: 5 },
                { designation: 'Supervisor', totalDays: 30, numberOfWorkers: 1 }
            ],
            'Factory Unit 2': [
                { designation: 'Security Guard', totalDays: 90, numberOfWorkers: 3 },
                { designation: 'Cleaner', totalDays: 60, numberOfWorkers: 2 }
            ]
        }
    },

    'Retail Paradise': {
        sites: {
            'Store 1': [
                { designation: 'Security Guard', totalDays: 60, numberOfWorkers: 2 },
                { designation: 'Cleaner', totalDays: 30, numberOfWorkers: 1 }
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

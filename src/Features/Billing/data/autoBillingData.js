// Auto Billing Wizard - Extended Constants and Dummy Data

// Step titles for stepper
export const WIZARD_STEPS = [
    { id: 1, title: 'Client & Scope', shortTitle: 'Client & Scope' },
    { id: 2, title: 'Billing Cycle', shortTitle: 'Billing Cycle' },
    { id: 3, title: 'Invoice Config', shortTitle: 'Invoice Config' },
    { id: 4, title: 'Review & Generate', shortTitle: 'Review & Generate' }
];

// Branches with State and City mapping
export const BRANCHES = [
    {
        id: 1,
        name: 'Mumbai Branch',
        code: 'MH01',
        state: 'Maharashtra',
        city: 'Mumbai',
        region: 'West'
    },
    {
        id: 2,
        name: 'Delhi Branch',
        code: 'DL01',
        state: 'Delhi',
        city: 'New Delhi',
        region: 'North'
    },
    {
        id: 3,
        name: 'Pune Branch',
        code: 'MH02',
        state: 'Maharashtra',
        city: 'Pune',
        region: 'West'
    },
    {
        id: 4,
        name: 'Bangalore Branch',
        code: 'KA01',
        state: 'Karnataka',
        city: 'Bangalore',
        region: 'South'
    },
    {
        id: 5,
        name: 'Hyderabad Branch',
        code: 'TS01',
        state: 'Telangana',
        city: 'Hyderabad',
        region: 'South'
    }
];

// States
export const STATES = [
    { id: 1, name: 'Maharashtra', code: 'MH' },
    { id: 2, name: 'Delhi', code: 'DL' },
    { id: 3, name: 'Karnataka', code: 'KA' },
    { id: 4, name: 'Telangana', code: 'TS' },
    { id: 5, name: 'Tamil Nadu', code: 'TN' },
    { id: 6, name: 'Gujarat', code: 'GJ' }
];

// Cities by State
export const CITIES_BY_STATE = {
    'Maharashtra': [
        { id: 1, name: 'Mumbai', state: 'Maharashtra' },
        { id: 2, name: 'Pune', state: 'Maharashtra' },
        { id: 3, name: 'Nagpur', state: 'Maharashtra' },
        { id: 4, name: 'Nashik', state: 'Maharashtra' }
    ],
    'Delhi': [
        { id: 5, name: 'New Delhi', state: 'Delhi' },
        { id: 6, name: 'South Delhi', state: 'Delhi' },
        { id: 7, name: 'North Delhi', state: 'Delhi' }
    ],
    'Karnataka': [
        { id: 8, name: 'Bangalore', state: 'Karnataka' },
        { id: 9, name: 'Mysore', state: 'Karnataka' },
        { id: 10, name: 'Mangalore', state: 'Karnataka' }
    ],
    'Telangana': [
        { id: 11, name: 'Hyderabad', state: 'Telangana' },
        { id: 12, name: 'Warangal', state: 'Telangana' }
    ],
    'Tamil Nadu': [
        { id: 13, name: 'Chennai', state: 'Tamil Nadu' },
        { id: 14, name: 'Coimbatore', state: 'Tamil Nadu' }
    ],
    'Gujarat': [
        { id: 15, name: 'Ahmedabad', state: 'Gujarat' },
        { id: 16, name: 'Surat', state: 'Gujarat' }
    ]
};

// Customers with their sites
export const CUSTOMERS = [
    {
        id: 1,
        name: 'ABC Mall',
        branch: 'Mumbai Branch',
        state: 'Maharashtra',
        city: 'Mumbai',
        totalSites: 3,
        activeRateCards: 8,
        lastInvoice: {
            month: 'August 2025',
            amount: 245000
        },
        sites: [
            { id: 1, name: 'Ground Floor', location: 'ABC Mall - Ground Floor', address: 'Andheri, Mumbai' },
            { id: 2, name: 'First Floor', location: 'ABC Mall - First Floor', address: 'Andheri, Mumbai' },
            { id: 3, name: 'Parking Area', location: 'ABC Mall - Parking Area', address: 'Andheri, Mumbai' }
        ]
    },
    {
        id: 2,
        name: 'XYZ Hospital',
        branch: 'Delhi Branch',
        state: 'Delhi',
        city: 'New Delhi',
        totalSites: 5,
        activeRateCards: 12,
        lastInvoice: {
            month: 'August 2025',
            amount: 385000
        },
        sites: [
            { id: 4, name: 'Main Entrance', location: 'XYZ Hospital - Main Entrance', address: 'Connaught Place, Delhi' },
            { id: 5, name: 'Emergency Ward', location: 'XYZ Hospital - Emergency Ward', address: 'Connaught Place, Delhi' },
            { id: 6, name: 'ICU Floor', location: 'XYZ Hospital - ICU Floor', address: 'Connaught Place, Delhi' },
            { id: 7, name: 'OPD Block', location: 'XYZ Hospital - OPD Block', address: 'Connaught Place, Delhi' },
            { id: 8, name: 'Cafeteria', location: 'XYZ Hospital - Cafeteria', address: 'Connaught Place, Delhi' }
        ]
    },
    {
        id: 3,
        name: 'DEF Complex',
        branch: 'Pune Branch',
        state: 'Maharashtra',
        city: 'Pune',
        totalSites: 2,
        activeRateCards: 5,
        lastInvoice: {
            month: 'August 2025',
            amount: 145000
        },
        sites: [
            { id: 9, name: 'Lobby Area', location: 'DEF Complex - Lobby', address: 'Hinjewadi, Pune' },
            { id: 10, name: 'Parking Lot', location: 'DEF Complex - Parking', address: 'Hinjewadi, Pune' }
        ]
    },
    {
        id: 4,
        name: 'GHI Shopping Center',
        branch: 'Mumbai Branch',
        state: 'Maharashtra',
        city: 'Mumbai',
        totalSites: 4,
        activeRateCards: 10,
        lastInvoice: {
            month: 'August 2025',
            amount: 298000
        },
        sites: [
            { id: 11, name: 'Food Court', location: 'GHI Shopping Center - Food Court', address: 'Borivali, Mumbai' },
            { id: 12, name: 'Retail Zone A', location: 'GHI Shopping Center - Zone A', address: 'Borivali, Mumbai' },
            { id: 13, name: 'Retail Zone B', location: 'GHI Shopping Center - Zone B', address: 'Borivali, Mumbai' },
            { id: 14, name: 'Basement Parking', location: 'GHI Shopping Center - Parking', address: 'Borivali, Mumbai' }
        ]
    },
    {
        id: 5,
        name: 'Tech Park Bangalore',
        branch: 'Bangalore Branch',
        state: 'Karnataka',
        city: 'Bangalore',
        totalSites: 6,
        activeRateCards: 15,
        lastInvoice: {
            month: 'August 2025',
            amount: 520000
        },
        sites: [
            { id: 15, name: 'Building A', location: 'Tech Park - Building A', address: 'Whitefield, Bangalore' },
            { id: 16, name: 'Building B', location: 'Tech Park - Building B', address: 'Whitefield, Bangalore' },
            { id: 17, name: 'Building C', location: 'Tech Park - Building C', address: 'Whitefield, Bangalore' },
            { id: 18, name: 'Food Court', location: 'Tech Park - Food Court', address: 'Whitefield, Bangalore' },
            { id: 19, name: 'Gym Area', location: 'Tech Park - Gym', address: 'Whitefield, Bangalore' },
            { id: 20, name: 'Parking Complex', location: 'Tech Park - Parking', address: 'Whitefield, Bangalore' }
        ]
    }
];

// Billing Scope Options
export const BILLING_SCOPE_OPTIONS = {
    ENTIRE_STATE: 'entire_state',
    SPECIFIC_SITES: 'specific_sites'
};

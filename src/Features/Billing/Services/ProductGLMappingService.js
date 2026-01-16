// Product to GL Mapping Service
// This service maps products to their respective GL accounts (Primary Posting)

export class ProductGLMappingService {

    // GL Account Codes
    static GL_CODES = {
        HOUSEKEEPING_CHARGES: 'X5000-HOUSE KEEPING CHARGES',
        MANPOWER_SERVICES: 'X5100-MANPOWER SERVICES',
        HK_MATERIAL: 'X5200-HK MATERIAL',
        RENT_ON_MACHINERY: 'X5400-RENT ON MACHINERY'
    };

    // Product Keywords for HouseKeeping Charges (221 products)
    static HK_CHARGES_KEYWORDS = [
        'HOUSEKEEPING SERVICES',
        'Service Charge',
        'HOUSE KEEPER',
        'OVER TIME HK',
        'OVERTIME HK',
        'SUPERVISOR',
        'MST technician',
        'MULTI TASK',
        'Guest House',
        'Guesthouse',
        'Management Fees',
        'DEEP CLEANING',
        'GARDEN JOB',
        'ELECTRICAL SHIPPING',
        'PM SERVICES ELECTRICAL',
        'Mechanical Repair',
        'Carpet Shampooing',
        'Background Verification',
        'Bonus & LTA',
        'Full & Final Settlement',
        'Loyalty Bonus',
        'Annexure Charges',
        'Equipment Cleaning',
        'Boiler Suit',
        'Safety Equipment',
        'HRA',
        'ESIC',
        'PPF',
        'Leave Encashment',
        'Food Expenses',
        'Food & Accommodation',
        'Diesel',
        'Electricity',
        'Reimbursement',
        'Arrear Charges'
    ];

    // Product Keywords for Manpower Services (64 products)
    static MANPOWER_KEYWORDS = [
        'OFFICE BOY',
        'RECEPTIONIST',
        'CARETAKER',
        'ADMIN CHARGES',
        'CONVEYANCE',
        'UNSKILLED',
        'Skilled',
        'Loader',
        'Cargo Assistant',
        'Dispatch Person',
        'Electrician',
        'Plumber',
        'Steward',
        'Jr Supervisor',
        'Executive Office Assistant',
        'Facility Attendant',
        'Utility Boy',
        'Valet Services',
        'Sales Assistant',
        'Helper',
        'Lab Technician',
        'Office Assistant',
        'Gardener',
        'Driver',
        'Janitor',
        'Mail Room',
        'Pantry Women',
        'Pantry Boy',
        'Cook'
    ];

    // Product Keywords for HK Material (20 products)
    static HK_MATERIAL_KEYWORDS = [
        'Cleaning Consumable',
        'SANITARY PADS',
        'Cleaning Material',
        'ALA BLEACH',
        'ALL KLEAN',
        'COLIN SPRAY',
        'DETTOL HAND WASH',
        'GODREJ AIR POCKET',
        'HAND GLOVES',
        'MICROFIBER DUSTER',
        'ROOM FRESHNER',
        'SANITORY CUBES',
        'SOFT BROOM',
        'TOILET ROLL',
        'VIM LIQUID',
        'WET MOP REFILL',
        'GARBAGE BAGS',
        'M-FOLD TISSUE',
        'Human Consumables'
    ];

    // Product Keywords for Rent on Machinery (7 products)
    static MACHINERY_KEYWORDS = [
        'MACHINERY CHARGES',
        'RIDE ON SWEEPER',
        'Vaccume Machine',
        'Vacuum Machine',
        'Wet & Dry',
        'Single Disc Machine',
        'Steam Machine',
        'High Pressure Machine',
        'Equipment Rental'
    ];

    /**
     * Map product name to GL Account
     * @param {string} productName - The product name to map
     * @returns {string} - GL Account Code
     */
    static mapProductToGL(productName) {
        if (!productName) {
            console.warn('Product name is empty or undefined');
            return null;
        }

        const productUpper = productName.toUpperCase();

        // Check for Machinery Rental first (most specific)
        if (this.MACHINERY_KEYWORDS.some(keyword =>
            productUpper.includes(keyword.toUpperCase()))) {
            return this.GL_CODES.RENT_ON_MACHINERY;
        }

        // Check for HK Material (specific materials)
        if (this.HK_MATERIAL_KEYWORDS.some(keyword =>
            productUpper.includes(keyword.toUpperCase()))) {
            return this.GL_CODES.HK_MATERIAL;
        }

        // Check for Manpower Services
        if (this.MANPOWER_KEYWORDS.some(keyword =>
            productUpper.includes(keyword.toUpperCase()))) {
            return this.GL_CODES.MANPOWER_SERVICES;
        }

        // Check for HK Charges (catch-all for service-related items)
        if (this.HK_CHARGES_KEYWORDS.some(keyword =>
            productUpper.includes(keyword.toUpperCase()))) {
            return this.GL_CODES.HOUSEKEEPING_CHARGES;
        }

        // Default to HK Charges if no match (as it's the largest category)
        console.warn(`Product "${productName}" not explicitly mapped. Defaulting to HK Charges.`);
        return this.GL_CODES.HOUSEKEEPING_CHARGES;
    }

    /**
     * Batch map multiple products to their GL accounts
     * @param {Array} products - Array of product objects with 'name' property
     * @returns {Array} - Array of products with added 'glAccount' property
     */
    static batchMapProducts(products) {
        if (!Array.isArray(products)) {
            console.error('Products must be an array');
            return [];
        }

        return products.map(product => ({
            ...product,
            glAccount: this.mapProductToGL(product.name || product.productName),
            glAccountName: this.getGLAccountName(
                this.mapProductToGL(product.name || product.productName)
            )
        }));
    }

    /**
     * Get GL Account name from code
     * @param {string} glCode - GL Account Code
     * @returns {string} - GL Account Name
     */
    static getGLAccountName(glCode) {
        switch (glCode) {
            case this.GL_CODES.HOUSEKEEPING_CHARGES:
                return 'House Keeping Charges';
            case this.GL_CODES.MANPOWER_SERVICES:
                return 'Manpower Services';
            case this.GL_CODES.HK_MATERIAL:
                return 'HK Material & Cleaning Consumables';
            case this.GL_CODES.RENT_ON_MACHINERY:
                return 'Rent on Machinery';
            default:
                return 'Unknown GL Account';
        }
    }

    /**
     * Get all GL accounts with product counts
     * @param {Array} products - Array of product objects
     * @returns {Array} - Summary of GL accounts
     */
    static getGLSummary(products) {
        const mappedProducts = this.batchMapProducts(products);
        const summary = {};

        mappedProducts.forEach(product => {
            const gl = product.glAccount;
            if (!summary[gl]) {
                summary[gl] = {
                    glCode: gl,
                    glName: this.getGLAccountName(gl),
                    productCount: 0,
                    totalAmount: 0,
                    products: []
                };
            }
            summary[gl].productCount++;
            summary[gl].totalAmount += product.amount || 0;
            summary[gl].products.push(product.name || product.productName);
        });

        return Object.values(summary);
    }

    /**
     * Validate product mapping
     * @param {string} productName - Product name to validate
     * @returns {Object} - Validation result with GL and confidence
     */
    static validateMapping(productName) {
        const glAccount = this.mapProductToGL(productName);
        const productUpper = productName.toUpperCase();

        let confidence = 'LOW';
        let matchedKeywords = [];

        // Check confidence based on keyword matches
        const allKeywords = [
            ...this.MACHINERY_KEYWORDS,
            ...this.HK_MATERIAL_KEYWORDS,
            ...this.MANPOWER_KEYWORDS,
            ...this.HK_CHARGES_KEYWORDS
        ];

        matchedKeywords = allKeywords.filter(keyword =>
            productUpper.includes(keyword.toUpperCase())
        );

        if (matchedKeywords.length >= 2) {
            confidence = 'HIGH';
        } else if (matchedKeywords.length === 1) {
            confidence = 'MEDIUM';
        }

        return {
            productName,
            glAccount,
            glAccountName: this.getGLAccountName(glAccount),
            confidence,
            matchedKeywords,
            timestamp: new Date().toISOString()
        };
    }
}

// Example Usage:
// const glAccount = ProductGLMappingService.mapProductToGL('HOUSEKEEPING SERVICES');
// const mappedProducts = ProductGLMappingService.batchMapProducts(productArray);
// const summary = ProductGLMappingService.getGLSummary(productArray);

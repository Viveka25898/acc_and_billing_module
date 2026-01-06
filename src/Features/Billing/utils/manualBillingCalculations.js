/* eslint-disable no-const-assign */
/**
 * Manual Billing Calculations Utility
 * Handles all calculation logic for manual billing invoices
 */

/**
 * Calculate line item total
 * @param {number} quantity - Quantity of units
 * @param {number} rate - Rate per unit
 * @returns {number} Total amount for the line item
 */
export const calculateLineTotal = (quantity, rate) => {
    try {
        const qty = parseFloat(quantity) || 0
        const rateValue = parseFloat(rate) || 0
        return qty * rateValue
    } catch (error) {
        console.error('Error calculating line total:', error)
        return 0
    }
}

/**
 * Calculate subtotal from all line items
 * @param {Array} lineItems - Array of line items
 * @returns {number} Subtotal amount
 */
export const calculateSubtotal = (lineItems) => {
    try {
        if (!Array.isArray(lineItems) || lineItems.length === 0) {
            return 0
        }

        return lineItems.reduce((total, item) => {
            const lineTotal = calculateLineTotal(item.quantity, item.rate)
            return total + lineTotal
        }, 0)
    } catch (error) {
        console.error('Error calculating subtotal:', error)
        return 0
    }
}

/**
 * Calculate GST amount
 * @param {number} subtotal - Subtotal amount before GST
 * @param {number} gstRate - GST rate percentage (default: 18)
 * @returns {Object} Object containing CGST, SGST, IGST amounts
 */
export const calculateGST = (subtotal, gstRate = 18) => {
    try {
        const amount = parseFloat(subtotal) || 0
        const rate = parseFloat(gstRate) || 18

        const totalGST = (amount * rate) / 100

        // For intra-state: split into CGST and SGST (9% each for 18% GST)
        const cgst = totalGST / 2
        const sgst = totalGST / 2

        // For inter-state: IGST (full 18%)
        const igst = totalGST

        return {
            totalGST: parseFloat(totalGST.toFixed(2)),
            cgst: parseFloat(cgst.toFixed(2)),
            sgst: parseFloat(sgst.toFixed(2)),
            igst: parseFloat(igst.toFixed(2)),
            rate,
        }
    } catch (error) {
        console.error('Error calculating GST:', error)
        return {
            totalGST: 0,
            cgst: 0,
            sgst: 0,
            igst: 0,
            rate: 18,
        }
    }
}

/**
 * Calculate other charges amount from percentage
 * @param {number} subtotal - Subtotal amount
 * @param {number} otherChargesPercent - Other charges percentage
 * @returns {number} Other charges amount
 */
export const calculateOtherChargesAmount = (subtotal, otherChargesPercent = 0) => {
    try {
        const sub = parseFloat(subtotal) || 0
        const percent = parseFloat(otherChargesPercent) || 0
        const amount = (sub * percent) / 100
        return parseFloat(amount.toFixed(2))
    } catch (error) {
        console.error('Error calculating other charges:', error)
        return 0
    }
}

/**
 * Calculate grand total
 * @param {number} subtotal - Subtotal amount
 * @param {number} gstAmount - GST amount
 * @param {number} discount - Discount amount (optional)
 * @param {number} otherChargesAmount - Other charges amount (optional)
 * @returns {number} Grand total amount
 */
export const calculateGrandTotal = (subtotal, gstAmount, discount = 0, otherChargesAmount = 0) => {
    try {
        const sub = parseFloat(subtotal) || 0
        const gst = parseFloat(gstAmount) || 0
        const disc = parseFloat(discount) || 0
        const charges = parseFloat(otherChargesAmount) || 0

        const total = sub + gst - disc + charges
        return parseFloat(total.toFixed(2))
    } catch (error) {
        console.error('Error calculating grand total:', error)
        return 0
    }
}

/**
 * Calculate all totals for the invoice
 * @param {Array} lineItems - Array of line items
 * @param {number} gstRate - GST rate percentage
 * @param {number} discount - Discount amount
 * @param {number} otherChargesPercent - Other charges percentage
 * @param {boolean} isInterState - Whether transaction is inter-state
 * @returns {Object} Complete calculation object
 */
export const calculateInvoiceTotals = (
    lineItems,
    gstRate = 18,
    discount = 0,
    otherChargesPercent = 0,
    isInterState = false
) => {
    try {
        const subtotal = calculateSubtotal(lineItems)
        const gst = calculateGST(subtotal, gstRate)
        const otherChargesAmount = calculateOtherChargesAmount(subtotal, otherChargesPercent)
        const grandTotal = calculateGrandTotal(subtotal, gst.totalGST, discount, otherChargesAmount)

        return {
            subtotal: parseFloat(subtotal.toFixed(2)),
            gst: isInterState
                ? {
                    type: 'IGST',
                    rate: gst.rate,
                    amount: gst.igst,
                }
                : {
                    type: 'CGST+SGST',
                    rate: gst.rate,
                    cgst: gst.cgst,
                    sgst: gst.sgst,
                    amount: gst.totalGST,
                },
            discount: parseFloat(discount) || 0,
            otherChargesPercent: parseFloat(otherChargesPercent) || 0,
            otherChargesAmount: otherChargesAmount,
            grandTotal,
        }
    } catch (error) {
        console.error('Error calculating invoice totals:', error)
        return {
            subtotal: 0,
            gst: {
                type: 'CGST+SGST',
                rate: 18,
                cgst: 0,
                sgst: 0,
                amount: 0,
            },
            discount: 0,
            otherChargesPercent: 0,
            otherChargesAmount: 0,
            grandTotal: 0,
        }
    }
}

/**
 * Format currency to Indian Rupee format
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
    try {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount || 0)
    } catch (error) {
        console.error('Error formatting currency:', error)
        return '₹0.00'
    }
}

/**
 * Validate line item
 * @param {Object} lineItem - Line item to validate
 * @returns {Object} Validation result with isValid flag and errors
 */
export const validateLineItem = (lineItem) => {
    const errors = {}

    if (!lineItem.description || lineItem.description.trim() === '') {
        errors.description = 'Service description is required'
    }

    if (!lineItem.quantity || parseFloat(lineItem.quantity) <= 0) {
        errors.quantity = 'Quantity must be greater than 0'
    }

    if (!lineItem.rate || parseFloat(lineItem.rate) <= 0) {
        errors.rate = 'Rate must be greater than 0'
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    }
}

/**
 * Generate unique line item ID
 * @returns {string} Unique ID for line item
 */
export const generateLineItemId = () => {
    return `line-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Convert number to words (Indian numbering system)
 * @param {number} amount - Amount to convert
 * @returns {string} Amount in words
 */
export const convertAmountToWords = (amount) => {
    try {
        const ones = [
            '',
            'One',
            'Two',
            'Three',
            'Four',
            'Five',
            'Six',
            'Seven',
            'Eight',
            'Nine',
            'Ten',
            'Eleven',
            'Twelve',
            'Thirteen',
            'Fourteen',
            'Fifteen',
            'Sixteen',
            'Seventeen',
            'Eighteen',
            'Nineteen',
        ]

        const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']

        const convertTwoDigit = (num) => {
            if (num < 20) return ones[num]
            return tens[Math.floor(num / 10)] + (num % 10 ? ' ' + ones[num % 10] : '')
        }

        const convertThreeDigit = (num) => {
            if (num === 0) return ''
            if (num < 100) return convertTwoDigit(num)
            return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 ? ' ' + convertTwoDigit(num % 100) : '')
        }

        const num = Math.floor(amount)
        const paise = Math.round((amount - num) * 100)

        if (num === 0 && paise === 0) return 'Zero Rupees Only'

        let words = ''

        // Crores
        if (num >= 10000000) {
            words += convertThreeDigit(Math.floor(num / 10000000)) + ' Crore '
            num %= 10000000
        }

        // Lakhs
        if (num >= 100000) {
            words += convertTwoDigit(Math.floor(num / 100000)) + ' Lakh '
            num %= 100000
        }

        // Thousands
        if (num >= 1000) {
            words += convertTwoDigit(Math.floor(num / 1000)) + ' Thousand '
            num %= 1000
        }

        // Hundreds
        if (num >= 100) {
            words += ones[Math.floor(num / 100)] + ' Hundred '
            num %= 100
        }

        // Remaining
        if (num > 0) {
            words += convertTwoDigit(num)
        }

        words = words.trim() + ' Rupees'

        if (paise > 0) {
            words += ' and ' + convertTwoDigit(paise) + ' Paise'
        }

        return words + ' Only'
    } catch (error) {
        console.error('Error converting amount to words:', error)
        return 'Amount conversion error'
    }
}

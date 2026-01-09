// Invoice Storage Utility Functions
// Handles localStorage operations for invoices

const STORAGE_KEYS = {
    PROFORMA_INVOICES: 'proforma_invoices',
    TAX_INVOICES: 'tax_invoices',
}

/**
 * Generate unique invoice ID
 */
export const generateInvoiceId = () => {
    return `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Save invoice to localStorage
 * @param {Object} invoiceData - Complete invoice data
 * @param {String} type - 'proforma' or 'tax'
 * @returns {Object} - { success: boolean, message: string, invoiceId: string }
 */
export const saveInvoice = (invoiceData, type = 'proforma') => {
    try {
        const storageKey =
            type === 'proforma' ? STORAGE_KEYS.PROFORMA_INVOICES : STORAGE_KEYS.TAX_INVOICES

        // Get existing invoices
        const existingInvoices = getInvoices(type)

        // Create invoice with metadata
        const invoice = {
            id: generateInvoiceId(),
            ...invoiceData,
            metadata: {
                createdAt: new Date().toISOString(),
                createdBy: invoiceData.createdBy || 'System User',
                lastModified: new Date().toISOString(),
                status: 'draft', // draft, sent, received, converted
                sentToClient: false,
                clientFeedback: null,
                viewCount: 0,
                downloadCount: 0,
            },
            type: type,
        }

        // Add to existing invoices
        existingInvoices.push(invoice)

        // Save to localStorage
        localStorage.setItem(storageKey, JSON.stringify(existingInvoices))

        return {
            success: true,
            message: 'Invoice saved successfully',
            invoiceId: invoice.id,
            invoice: invoice,
        }
    } catch (error) {
        console.error('Error saving invoice:', error)
        return {
            success: false,
            message: 'Failed to save invoice: ' + error.message,
            invoiceId: null,
        }
    }
}

/**
 * Get all invoices by type
 * @param {String} type - 'proforma' or 'tax'
 * @returns {Array} - Array of invoices
 */
export const getInvoices = (type = 'proforma') => {
    try {
        const storageKey =
            type === 'proforma' ? STORAGE_KEYS.PROFORMA_INVOICES : STORAGE_KEYS.TAX_INVOICES
        const data = localStorage.getItem(storageKey)
        return data ? JSON.parse(data) : []
    } catch (error) {
        console.error('Error getting invoices:', error)
        return []
    }
}

/**
 * Get single invoice by ID
 * @param {String} invoiceId
 * @param {String} type - 'proforma' or 'tax'
 * @returns {Object|null} - Invoice object or null
 */
export const getInvoiceById = (invoiceId, type = 'proforma') => {
    try {
        const invoices = getInvoices(type)
        return invoices.find((inv) => inv.id === invoiceId) || null
    } catch (error) {
        console.error('Error getting invoice by ID:', error)
        return null
    }
}

/**
 * Update invoice
 * @param {String} invoiceId
 * @param {Object} updates
 * @param {String} type - 'proforma' or 'tax'
 * @returns {Object} - { success: boolean, message: string }
 */
export const updateInvoice = (invoiceId, updates, type = 'proforma') => {
    try {
        const storageKey =
            type === 'proforma' ? STORAGE_KEYS.PROFORMA_INVOICES : STORAGE_KEYS.TAX_INVOICES
        const invoices = getInvoices(type)
        const invoiceIndex = invoices.findIndex((inv) => inv.id === invoiceId)

        if (invoiceIndex === -1) {
            return {
                success: false,
                message: 'Invoice not found',
            }
        }

        // Update invoice
        invoices[invoiceIndex] = {
            ...invoices[invoiceIndex],
            ...updates,
            metadata: {
                ...invoices[invoiceIndex].metadata,
                lastModified: new Date().toISOString(),
            },
        }

        // Save to localStorage
        localStorage.setItem(storageKey, JSON.stringify(invoices))

        return {
            success: true,
            message: 'Invoice updated successfully',
            invoice: invoices[invoiceIndex],
        }
    } catch (error) {
        console.error('Error updating invoice:', error)
        return {
            success: false,
            message: 'Failed to update invoice: ' + error.message,
        }
    }
}

/**
 * Delete invoice
 * @param {String} invoiceId
 * @param {String} type - 'proforma' or 'tax'
 * @returns {Object} - { success: boolean, message: string }
 */
export const deleteInvoice = (invoiceId, type = 'proforma') => {
    try {
        const storageKey =
            type === 'proforma' ? STORAGE_KEYS.PROFORMA_INVOICES : STORAGE_KEYS.TAX_INVOICES
        const invoices = getInvoices(type)
        const filteredInvoices = invoices.filter((inv) => inv.id !== invoiceId)

        if (invoices.length === filteredInvoices.length) {
            return {
                success: false,
                message: 'Invoice not found',
            }
        }

        localStorage.setItem(storageKey, JSON.stringify(filteredInvoices))

        return {
            success: true,
            message: 'Invoice deleted successfully',
        }
    } catch (error) {
        console.error('Error deleting invoice:', error)
        return {
            success: false,
            message: 'Failed to delete invoice: ' + error.message,
        }
    }
}

/**
 * Mark invoice as sent to client
 */
export const markInvoiceAsSent = (invoiceId, type = 'proforma') => {
    try {
        const invoice = getInvoiceById(invoiceId, type)
        if (!invoice) {
            return {
                success: false,
                message: 'Invoice not found',
            }
        }

        return updateInvoice(
            invoiceId,
            {
                metadata: {
                    ...invoice.metadata,
                    sentToClient: true,
                    status: 'sent',
                    sentDate: new Date().toISOString(),
                },
            },
            type
        )
    } catch (error) {
        console.error('Error marking invoice as sent:', error)
        return {
            success: false,
            message: 'Failed to mark invoice as sent: ' + error.message,
        }
    }
}

/**
 * Increment view count
 */
export const incrementViewCount = (invoiceId, type = 'proforma') => {
    try {
        const invoice = getInvoiceById(invoiceId, type)
        if (invoice) {
            const newViewCount = (invoice.metadata.viewCount || 0) + 1
            return updateInvoice(
                invoiceId,
                {
                    metadata: {
                        ...invoice.metadata,
                        viewCount: newViewCount,
                    },
                },
                type
            )
        }
        return { success: false, message: 'Invoice not found' }
    } catch (error) {
        console.error('Error incrementing view count:', error)
        return { success: false, message: error.message }
    }
}

/**
 * Increment download count
 */
export const incrementDownloadCount = (invoiceId, type = 'proforma') => {
    try {
        const invoice = getInvoiceById(invoiceId, type)
        if (invoice) {
            const newDownloadCount = (invoice.metadata.downloadCount || 0) + 1
            return updateInvoice(
                invoiceId,
                {
                    metadata: {
                        ...invoice.metadata,
                        downloadCount: newDownloadCount,
                    },
                },
                type
            )
        }
        return { success: false, message: 'Invoice not found' }
    } catch (error) {
        console.error('Error incrementing download count:', error)
        return { success: false, message: error.message }
    }
}

/**
 * Search and filter invoices
 * @param {Object} filters - { searchTerm, status, dateFrom, dateTo }
 * @param {String} type - 'proforma' or 'tax'
 * @returns {Array} - Filtered invoices
 */
export const filterInvoices = (filters = {}, type = 'proforma') => {
    try {
        let invoices = getInvoices(type)

        // Search by invoice number, customer, or branch
        if (filters.searchTerm) {
            const term = filters.searchTerm.toLowerCase()
            invoices = invoices.filter(
                (inv) =>
                    inv.formData?.poWoNumber?.toLowerCase().includes(term) ||
                    inv.formData?.customer?.toLowerCase().includes(term) ||
                    inv.formData?.branch?.toLowerCase().includes(term)
            )
        }

        // Filter by status
        if (filters.status && filters.status !== 'all') {
            invoices = invoices.filter((inv) => inv.metadata?.status === filters.status)
        }

        // Filter by date range
        if (filters.dateFrom) {
            const fromDate = new Date(filters.dateFrom)
            invoices = invoices.filter((inv) => new Date(inv.metadata?.createdAt) >= fromDate)
        }

        if (filters.dateTo) {
            const toDate = new Date(filters.dateTo)
            toDate.setHours(23, 59, 59, 999) // End of day
            invoices = invoices.filter((inv) => new Date(inv.metadata?.createdAt) <= toDate)
        }

        // Sort by creation date (newest first)
        invoices.sort((a, b) => new Date(b.metadata?.createdAt) - new Date(a.metadata?.createdAt))

        return invoices
    } catch (error) {
        console.error('Error filtering invoices:', error)
        return []
    }
}

/**
 * Get invoice statistics
 * @param {String} type - 'proforma' or 'tax'
 * @returns {Object} - Statistics object
 */
export const getInvoiceStats = (type = 'proforma') => {
    try {
        const invoices = getInvoices(type)
        return {
            total: invoices.length,
            draft: invoices.filter((inv) => inv.metadata?.status === 'draft').length,
            sent: invoices.filter((inv) => inv.metadata?.status === 'sent').length,
            received: invoices.filter((inv) => inv.metadata?.status === 'received').length,
            converted: invoices.filter((inv) => inv.metadata?.status === 'converted').length,
        }
    } catch (error) {
        console.error('Error getting invoice stats:', error)
        return { total: 0, draft: 0, sent: 0, received: 0, converted: 0 }
    }
}

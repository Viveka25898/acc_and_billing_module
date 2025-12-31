// Billing Service - localStorage based operations

const STORAGE_KEYS = {
    INVOICES: 'billing_invoices',
    RATE_CARDS: 'billing_rate_cards',
    AGREEMENTS: 'billing_agreements',
    ATTENDANCE: 'billing_attendance',
    ACTIVITIES: 'billing_activities'
};

export class BillingService {
    // ========== Invoice Operations ==========
    static getInvoices() {
        try {
            const invoices = localStorage.getItem(STORAGE_KEYS.INVOICES);
            return invoices ? JSON.parse(invoices) : [];
        } catch (error) {
            console.error('Error fetching invoices:', error);
            return [];
        }
    }

    static saveInvoice(invoice) {
        try {
            const invoices = this.getInvoices();
            const newInvoice = {
                ...invoice,
                id: `INV_${Date.now()}`,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            invoices.push(newInvoice);
            localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
            return newInvoice;
        } catch (error) {
            console.error('Error saving invoice:', error);
            throw error;
        }
    }

    static updateInvoice(invoiceId, updates) {
        try {
            const invoices = this.getInvoices();
            const index = invoices.findIndex(inv => inv.id === invoiceId);
            if (index === -1) throw new Error('Invoice not found');

            invoices[index] = {
                ...invoices[index],
                ...updates,
                updatedAt: new Date().toISOString()
            };
            localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
            return invoices[index];
        } catch (error) {
            console.error('Error updating invoice:', error);
            throw error;
        }
    }

    static deleteInvoice(invoiceId) {
        try {
            const invoices = this.getInvoices();
            const filtered = invoices.filter(inv => inv.id !== invoiceId);
            localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(filtered));
            return true;
        } catch (error) {
            console.error('Error deleting invoice:', error);
            throw error;
        }
    }

    // ========== Rate Card Operations ==========
    static getRateCards() {
        try {
            const rateCards = localStorage.getItem(STORAGE_KEYS.RATE_CARDS);
            return rateCards ? JSON.parse(rateCards) : [];
        } catch (error) {
            console.error('Error fetching rate cards:', error);
            return [];
        }
    }

    static saveRateCard(rateCard) {
        try {
            const rateCards = this.getRateCards();
            const newRateCard = {
                ...rateCard,
                id: `RC_${Date.now()}`,
                createdAt: new Date().toISOString()
            };
            rateCards.push(newRateCard);
            localStorage.setItem(STORAGE_KEYS.RATE_CARDS, JSON.stringify(rateCards));
            return newRateCard;
        } catch (error) {
            console.error('Error saving rate card:', error);
            throw error;
        }
    }

    // ========== Activity Log ==========
    static logActivity(activity) {
        try {
            const activities = this.getActivities();
            const newActivity = {
                ...activity,
                id: `ACT_${Date.now()}`,
                timestamp: new Date().toISOString()
            };
            activities.unshift(newActivity); // Add to beginning
            // Keep only last 50 activities
            const limited = activities.slice(0, 50);
            localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(limited));
            return newActivity;
        } catch (error) {
            console.error('Error logging activity:', error);
            throw error;
        }
    }

    static getActivities(limit = 10) {
        try {
            const activities = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
            const parsed = activities ? JSON.parse(activities) : [];
            return parsed.slice(0, limit);
        } catch (error) {
            console.error('Error fetching activities:', error);
            return [];
        }
    }

    // ========== Invoice Number Generation ==========
    static generateInvoiceNumber(type = 'INV', site = 'MH01') {
        const year = new Date().getFullYear();
        const counters = JSON.parse(localStorage.getItem('billing_invoice_counters') || '{}');
        const key = `${type}/${site}/${year}`;

        counters[key] = (counters[key] || 0) + 1;
        localStorage.setItem('billing_invoice_counters', JSON.stringify(counters));

        return `${key}/${String(counters[key]).padStart(4, '0')}`;
    }

    // ========== Dashboard Stats ==========
    static getDashboardStats() {
        const invoices = this.getInvoices();
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const monthlyInvoices = invoices.filter(inv => {
            const invDate = new Date(inv.createdAt);
            return invDate.getMonth() === currentMonth && invDate.getFullYear() === currentYear;
        });

        const monthlyRevenue = monthlyInvoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
        const pendingInvoices = invoices.filter(inv => inv.status === 'Pending Approval').length;

        return {
            monthlyRevenue,
            pendingInvoices,
            profitMargin: 18, // Calculate from actual data in production
            activeClients: new Set(invoices.map(inv => inv.clientId)).size
        };
    }
}

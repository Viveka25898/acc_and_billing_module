// Small helper service to centralize ledger balance extraction
const parseNumber = (val) => {
    try {
        if (val === null || val === undefined) return 0
        const s = String(val).replace(/[₹,]/g, '')
        const n = parseFloat(s)
        return Number.isNaN(n) ? 0 : n
    } catch (err) {
        console.error('parseNumber error', err)
        return 0
    }
}

const getLedgerBalance = (glCode) => {
    try {
        if (!glCode) return 0

        // Revenue ledgers (R-prefix)
        if (glCode.startsWith('R')) {
            const revenueLedgers = JSON.parse(localStorage.getItem('revenueLedgers') || '{}')
            const ledger = revenueLedgers[glCode]
            if (ledger && ledger.ledgerDetails) {
                // Prefer explicit netRevenue if present, fall back to closingBalance
                const netRevenue = ledger.ledgerDetails.netRevenue ?? ledger.ledgerDetails.closingBalance ?? '0'
                return parseNumber(netRevenue)
            }
            return 0
        }


        // Fixed Asset ledgers (A1-prefix)
        if (glCode.startsWith('A1')) {
            try {
                const ledgerBalances = JSON.parse(localStorage.getItem('ledgerBalances') || '{}')
                const lb = ledgerBalances[glCode]
                if (lb && (lb.balance !== undefined || lb.closingBalance !== undefined)) {
                    const val = lb.balance ?? lb.closingBalance ?? lb.amount ?? 0
                    return parseNumber(val)
                }
            } catch (err) {
                // ignore and fallback
            }

            const fixedAssetsRaw = localStorage.getItem('fixedAssets') || '{}'
            let fixedAssets
            try {
                fixedAssets = JSON.parse(fixedAssetsRaw)
            } catch (err) {
                fixedAssets = {}
            }

            let assetLedger = null
            if (Array.isArray(fixedAssets)) {
                assetLedger = fixedAssets.find((a) => a.code === glCode || a.glCode === glCode)
            } else if (fixedAssets && typeof fixedAssets === 'object') {
                assetLedger = fixedAssets[glCode] || Object.values(fixedAssets).find((a) => a.code === glCode || a.glCode === glCode)
            }

            if (assetLedger) {
                const closing = assetLedger.closingBalance ?? assetLedger.closing_balance ?? assetLedger.balance ?? assetLedger.amount ?? '0'
                return parseNumber(closing)
            }

            return 0
        }

        // Employee Ledgers (A3-prefix), Client Ledgers (D-prefix), and Liability Ledgers (L-prefix)
        if (glCode.startsWith('A3') || glCode.startsWith('D') || glCode.startsWith('L')) {
            // Check ledgerBalances first (for all A3, D, and L codes)
            try {
                const ledgerBalances = JSON.parse(localStorage.getItem('ledgerBalances') || '{}')
                const lb = ledgerBalances[glCode]
                if (lb && (lb.balance !== undefined || lb.closingBalance !== undefined)) {
                    const val = lb.balance ?? lb.closingBalance ?? lb.amount ?? 0
                    console.info(`[A3/D/L] Found in ledgerBalances:`, glCode, val)
                    return parseNumber(val)
                } else {
                    console.warn(`[A3/D/L] Not found in ledgerBalances:`, glCode, lb)
                }
            } catch (err) {
                console.error(`[A3/D/L] Error reading ledgerBalances for`, glCode, err)
            }

            // If D-prefix or L-prefix, return 0 (no further fallbacks needed)
            if (glCode.startsWith('D') || glCode.startsWith('L')) {
                console.warn(`[D/L] No balance found for`, glCode)
                return 0
            }

            // Fallback to employeeAdvances (object or array)
            try {
                const empAdvRaw = localStorage.getItem('employeeAdvances') || '{}'
                let empAdv
                try {
                    empAdv = JSON.parse(empAdvRaw)
                } catch (err) {
                    empAdv = {}
                }
                let advLedger = null
                if (Array.isArray(empAdv)) {
                    advLedger = empAdv.find((a) => a.code === glCode || a.glCode === glCode)
                } else if (empAdv && typeof empAdv === 'object') {
                    advLedger = empAdv[glCode] || Object.values(empAdv).find((a) => a.code === glCode || a.glCode === glCode)
                }
                if (advLedger) {
                    const closing = advLedger.closingBalance ?? advLedger.closing_balance ?? advLedger.balance ?? advLedger.amount ?? '0'
                    console.info(`[A3] Found in employeeAdvances:`, glCode, closing)
                    return parseNumber(closing)
                } else {
                    console.warn(`[A3] Not found in employeeAdvances:`, glCode, advLedger)
                }
            } catch (err) {
                console.error(`[A3] Error reading employeeAdvances for`, glCode, err)
            }

            // Fallback to users array (for employee ledgers)
            try {
                const users = JSON.parse(localStorage.getItem('users') || '[]')
                const employee = users.find((u) => u.glCode === glCode)
                if (employee && employee.osBalance !== undefined) {
                    console.info(`[A3] Found in users:`, glCode, employee.osBalance)
                    return parseNumber(employee.osBalance)
                } else {
                    console.warn(`[A3] Not found in users:`, glCode, employee)
                }
            } catch (err) {
                console.error(`[A3] Error reading users for`, glCode, err)
            }
            console.warn(`[A3] No balance found for`, glCode)
            return 0
        }

        // Other ledger types can be added here later (Liabilities, Vendors, Clients, Banks, etc.)

        return null
    } catch (err) {
        console.error('getLedgerBalance error', err)
        return null
    }
}

export default { getLedgerBalance }

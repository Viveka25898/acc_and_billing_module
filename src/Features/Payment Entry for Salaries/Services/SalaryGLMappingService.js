/* eslint-disable no-unused-vars */
/**
 * Salary GL Mapping Service
 * Maps salary heads to their corresponding GL codes for accounting entries
 * Based on the complete GL structure with Debit/Credit mappings
 */

export class SalaryGLMappingService {
    /**
     * GL Code Configuration
     * Maps each salary head to its debit and credit GL accounts
     */
    static GL_MAPPING = {
        // ==========================================
        // SECTION 1: EARNINGS (23 Heads)
        // Dr Expense Accounts → Cr Salary Payable (L2002001)
        // Total Gross Salary credited to L2002001
        // ==========================================
        BASIC: {
            debit: { account: 'Salaries & Wages', code: 'X2001001001' },
            credit: { account: 'SALARY PAYABLE', code: 'L2002001' },
            category: 'Earnings',
        },
        DA: {
            debit: { account: 'Salaries & Wages', code: 'X2001001001' },
            credit: { account: 'SALARY PAYABLE', code: 'L2002001' },
            category: 'Earnings',
        },
        HRA: {
            debit: { account: 'Salaries & Wages', code: 'X2001001001' },
            credit: { account: 'SALARY PAYABLE', code: 'L2002001' },
            category: 'Earnings',
        },
        CONVEYANCE: {
            debit: { account: 'Salaries & Wages', code: 'X2001001001' },
            credit: { account: 'SALARY PAYABLE', code: 'L2002001' },
            category: 'Earnings',
        },
        'WASHING ALLOWANCE': {
            debit: { account: 'Salaries & Wages', code: 'X2001001001' },
            credit: { account: 'SALARY PAYABLE', code: 'L2002001' },
            category: 'Earnings',
        },
        'OTHER ALLOWANCE': {
            debit: { account: 'Salaries & Wages', code: 'X2001001001' },
            credit: { account: 'SALARY PAYABLE', code: 'L2002001' },
            category: 'Earnings',
        },
        'LEAVE WITH WAGES': {
            debit: { account: 'Leave Wages', code: 'X2001001005' },
            credit: { account: 'SALARY PAYABLE', code: 'L2002001' },
            category: 'Earnings',
        },
        CCA: {
            debit: { account: 'Salaries & Wages', code: 'X2001001001' },
            credit: { account: 'SALARY PAYABLE', code: 'L2002001' },
            category: 'Earnings',
        },
        'EDUCATIONAL ALLOWANCE': {
            debit: { account: 'Salaries & Wages', code: 'X2001001001' },
            credit: { account: 'SALARY PAYABLE', code: 'L2002001' },
            category: 'Earnings',
        },
        'MEDICAL ALLOWANCE': {
            debit: { account: 'Salaries & Wages', code: 'X2001001001' },
            credit: { account: 'SALARY PAYABLE', code: 'L2002001' },
            category: 'Earnings',
        },
        'OT AMOUNT': {
            debit: { account: 'Salaries & Wages', code: 'X2001001001' },
            credit: { account: 'SALARY PAYABLE', code: 'L2002001' },
            category: 'Earnings',
        },
        'SPL ALLOWANCE': {
            debit: { account: 'Salaries & Wages', code: 'X2001001001' },
            credit: { account: 'SALARY PAYABLE', code: 'L2002001' },
            category: 'Earnings',
        },
        REIMBURSEMENT: {
            debit: { account: 'Salaries & Wages', code: 'X2001001001' },
            credit: { account: 'SALARY PAYABLE', code: 'L2002001' },
            category: 'Earnings',
        },
        BONUS: {
            debit: { account: 'Bonus', code: 'X2001001007' },
            credit: { account: 'SALARY PAYABLE', code: 'L2002001' },
            category: 'Bonus Expense',
        },
        MEAL: {
            debit: { account: 'Salaries & Wages', code: 'X2001001001' },
            credit: { account: 'SALARY PAYABLE', code: 'L2002001' },
            category: 'Earnings',
        },
        'SITE ALLOWANCE': {
            debit: { account: 'Salaries & Wages', code: 'X2001001001' },
            credit: { account: 'SALARY PAYABLE', code: 'L2002001' },
            category: 'Earnings',
        },
        CONY: {
            debit: { account: 'Salaries & Wages', code: 'X2001001001' },
            credit: { account: 'SALARY PAYABLE', code: 'L2002001' },
            category: 'Earnings',
        },
        'PERFORMANCE ALLOWANCE': {
            debit: { account: 'Salaries & Wages', code: 'X2001001001' },
            credit: { account: 'SALARY PAYABLE', code: 'L2002001' },
            category: 'Earnings',
        },
        'CASH RISK ALLOWANCE': {
            debit: { account: 'Salaries & Wages', code: 'X2001001001' },
            credit: { account: 'SALARY PAYABLE', code: 'L2002001' },
            category: 'Earnings',
        },
        INCENTIVE: {
            debit: { account: 'Salaries & Wages', code: 'X2001001001' },
            credit: { account: 'SALARY PAYABLE', code: 'L2002001' },
            category: 'Earnings',
        },
        FOOD: {
            debit: { account: 'Salaries & Wages', code: 'X2001001001' },
            credit: { account: 'SALARY PAYABLE', code: 'L2002001' },
            category: 'Earnings',
        },
        'METRO CITY ALLOWANCE': {
            debit: { account: 'Salaries & Wages', code: 'X2001001001' },
            credit: { account: 'SALARY PAYABLE', code: 'L2002001' },
            category: 'Earnings',
        },
        STIPEND: {
            debit: { account: 'Salaries & Wages', code: 'X2001001001' },
            credit: { account: 'SALARY PAYABLE', code: 'L2002001' },
            category: 'Earnings',
        },

        // ==========================================
        // SECTION 2: EMPLOYEE DEDUCTIONS (12 Heads)
        // Dr Salaries & Wages → Cr Respective Payable (per new mapping)
        // ==========================================
        PF: {
            debit: { account: 'Salaries & Wages', code: 'X2001001001' },
            credit: { account: 'Employee PF Payable', code: 'L2002006' },
            category: 'Employee Deduction',
        },
        ESIC: {
            debit: { account: 'Salaries & Wages', code: 'X2001001001' },
            credit: { account: 'Employee ESIC Payable', code: 'L2002007' },
            category: 'Employee Deduction',
        },
        PT: {
            debit: { account: 'Salaries & Wages', code: 'X2001001001' },
            credit: { account: 'Professional Tax Payable', code: 'L2002009' },
            category: 'Employee Deduction',
        },
        LWF: {
            debit: { account: 'Salaries & Wages', code: 'X2001001001' },
            credit: { account: 'Employee LWF Payable', code: 'L2002008' },
            category: 'Employee Deduction',
        },
        UNIFORM: {
            debit: { account: 'Salaries & Wages', code: 'X2001001001' },
            credit: { account: 'Other Deductions Payable', code: 'L2002012' },
            category: 'Employee Deduction',
        },
        'OTHER DEDUCTION': {
            debit: { account: 'Salaries & Wages', code: 'X2001001001' },
            credit: { account: 'Other Deductions Payable', code: 'L2002012' },
            category: 'Employee Deduction',
        },
        'MESS DEDUCTION': {
            debit: { account: 'Salaries & Wages', code: 'X2001001001' },
            credit: { account: 'Other Deductions Payable', code: 'L2002012' },
            category: 'Employee Deduction',
        },
        'UNIFORM DEDUCTION': {
            debit: { account: 'Salaries & Wages', code: 'X2001001001' },
            credit: { account: 'Other Deductions Payable', code: 'L2002012' },
            category: 'Employee Deduction',
        },
        'HRA DEDUCTION': {
            debit: { account: 'Salaries & Wages', code: 'X2001001001' },
            credit: { account: 'Other Deductions Payable', code: 'L2002012' },
            category: 'Employee Deduction',
        },
        'STAFF WELFARE FUND': {
            debit: { account: 'Salaries & Wages', code: 'X2001001001' },
            credit: { account: 'Staff Welfare Fund Payable', code: 'L2002010' },
            category: 'Employee Deduction',
        },
        'BACKGROUND VERIFICATION': {
            debit: { account: 'Salaries & Wages', code: 'X2001001001' },
            credit: { account: 'Other Deductions Payable', code: 'L2002012' },
            category: 'Employee Deduction',
        },
        ADVANCE: {
            debit: { account: 'Salaries & Wages', code: 'X2001001001' },
            credit: { account: 'Employee Advances (Asset)', code: 'A2001' },
            category: 'Employee Deduction',
        },
        TDS: {
            debit: { account: 'Salaries & Wages', code: 'X2001001001' },
            credit: { account: 'TDS Payable', code: 'L2002011' },
            category: 'Employee Deduction',
        },

        // ==========================================
        // SECTION 3: EMPLOYER CONTRIBUTIONS (3 Heads)
        // Dr Employer Expense → Cr Employer Payable
        // ==========================================
        'PF COMPANY': {
            debit: { account: 'Employer PF Contribution', code: 'X2001001002' },
            credit: { account: 'Employer PF Payable', code: 'L2002002' },
            category: 'Employer Contribution',
        },
        'ESIC COMPANY': {
            debit: { account: 'Employer ESIC Contribution', code: 'X2001001003' },
            credit: { account: 'Employer ESIC Payable', code: 'L2002003' },
            category: 'Employer Contribution',
        },
        'LWF COMPANY': {
            debit: { account: 'Employer LWF Contribution', code: 'X2001001004' },
            credit: { account: 'LWF PAYABLE - EMPLOYER SHARE', code: 'L2002004' },
            category: 'Employer Contribution',
        },
    }

    /**
     * Fields that should be excluded from accounting entries
     */
    static EXCLUDED_FIELDS = [
        'MONTHATTENDANCEID',
        'BRANCHNAME',
        'CLIENTGROUPCODE',
        'CLIENTGROUPNAME',
        'SITECODE',
        'SITENAME',
        'STATENAME',
        'EMPOLDCODE',
        'EMPMASTERID',
        'EMPCODE',
        'FULLNAME',
        'DOJ',
        'DOB',
        'GENDERNAME',
        'DUTYMASTERID',
        'DUTYNAME',
        'GROUPMASTERID',
        'GROUP',
        'DESIGNATIONMASTERID',
        'DESIGNATIONNAME',
        'PF WAGES',
        'ESI WAGES',
        'NORMALDAYS',
        'WEEKLYOFF',
        'OTHOURS',
        'SPLOTHOURS',
        'PL_AVAILED',
        'CL_AVAILED',
        'SL_AVAILED',
        // FIXED_* fields (salary structure, not actual payables) - exclude these
        'FIXED_BASIC',
        'FIXED_DA',
        'FIXED_HRA',
        'FIXED_CONVEYANCE',
        'FIXED_WASHING ALLOWANCE',
        'FIXED_OTHER ALLOWANCE',
        'FIXED_OVERTIME',
        'FIXED_LEAVE WITH WAGES',
        'FIXED_EX-GRATIA',
        'FIXED_CCA',
        'FIXED_EDUCATIONAL ALLOWANCE',
        'FIXED_MEDICAL ALLOWANCE',
        'FIXED_PAID HOLIDAY',
        'FIXED_SPL ALLOWANCE',
        'FIXED_GRATUITY',
        'FIXED_LTC',
        'FIXED_BONUS',
        'FIXED_ATTIRE',
        'FIXED_MEAL',
        'FIXED_LTA',
        'FIXED_CONSOLIDATED WAGES 1',
        'FIXED_CONSOLIDATED WAGES 2',
        'FIXED_SITE ALLOWANCE',
        'FIXED_HOLIDAY ALLOWANCE',
        'FIXED_FIXED COMPENSATION',
        'FIXED_PERFORMANCE ALLOWANCE',
        'FIXED_FIXED_LTA  P.A',
        'FIXED_FIXED_MEAL CARD',
        'FIXED_FIXED_MEDICAL RMB',
        'FIXED_FIXED_PERFORMANCE LINK INCENTIVE PA',
        'FIXED_FIXED_MEDICAL INS_(REB)',
        'FIXED_FIXED_ CAR REPAIR RMB (CAR)',
        'FIXED_FIXED_BOOK & PERIODICAL RMB (BP)',
        'FIXED_FIXED_ TELEHONE RMB (BP)',
        'FIXED_BA & OT F D',
        'FIXED_FOOD',
        'FIXED_METRO CITY ALLOWANCE',
        'FIXED_MOBILE ALLOWANCE',
        'FIXED_STIPEND',
        'FIXEDGROSS',
        'GROSS AMT',
        'TOTALDEDUCTION',
        'NETPAYABLE',
        'LEAVE_PROVISION',
        'BONUS_PROVISION',
        'GRATUITY_PROVISION',
        'CTC',
        'BANK NAME',
        'PAYMENTMODENAME',
        'BANK NAME AS PER EMPLOYEE',
        'BANK BRANCH NAME AS PER EMPLOYEE',
        'IFS CODE AS PER EMPLOYEE',
        'BANK ACCOUNT NO AS PER EMPLOYEE',
        'BANK NAME AS PER PAYMENT',
        'BANK BRANCH NAME AS PER PAYMENT',
        'IFS CODE AS PER PAYMENT',
        'BANK ACCOUNT NO AS PER PAYMENT',
        'PF NO',
        'ESIC NO',
        'UAN NO',
        'SALARY STATUS',
        'AADHAR CARD',
        'SITEDIVISIONDAYS',
        'PL',
        'CL',
        'SL',
    ]

    /**
     * Generate GL entries for a single batch
     * @param {Object} batch - The payroll batch object with employeeDetails
     * @returns {Object} - Object with debitEntries and creditEntries arrays
     */
    static generateGLEntries(batch) {
        if (!batch || !batch.employeeDetails || !Array.isArray(batch.employeeDetails)) {
            console.error('Invalid batch data provided to generateGLEntries')
            return { debitEntries: [], creditEntries: [], summary: null }
        }

        const debitEntries = []
        const creditEntries = []
        const processedAccounts = new Map()

        // Helper function to add or accumulate amounts
        // Key includes both GL code AND type (debit/credit) to keep them separate
        const addEntry = (entry, isDebit) => {
            const key = `${entry.glCode}-${entry.type}` // Include type in key
            const existingEntry = processedAccounts.get(key)

            if (existingEntry) {
                existingEntry.amount += entry.amount
            } else {
                const newEntry = { ...entry }
                processedAccounts.set(key, newEntry)
                if (isDebit) {
                    debitEntries.push(newEntry)
                } else {
                    creditEntries.push(newEntry)
                }
            }
        }

        // Process each employee in the batch
        batch.employeeDetails.forEach((employee, index) => {
            // Iterate through all salary heads for this employee
            Object.keys(employee).forEach((fieldName) => {
                // Skip excluded fields and fields not in GL mapping
                if (
                    this.EXCLUDED_FIELDS.includes(fieldName) ||
                    !this.GL_MAPPING[fieldName]
                ) {
                    return
                }

                const amount = parseFloat(employee[fieldName]) || 0

                // Only process non-zero amounts
                if (amount === 0) {
                    return
                }

                const mapping = this.GL_MAPPING[fieldName]

                // Create debit entry
                addEntry(
                    {
                        glCode: mapping.debit.code,
                        accountName: mapping.debit.account,
                        amount: amount,
                        type: 'Debit',
                        salaryHead: fieldName,
                        category: mapping.category,
                    },
                    true
                )

                // Create credit entry
                addEntry(
                    {
                        glCode: mapping.credit.code,
                        accountName: mapping.credit.account,
                        amount: amount,
                        type: 'Credit',
                        salaryHead: fieldName,
                        category: mapping.category,
                    },
                    false
                )
            })
        })

        // Calculate summary
        const totalDebit = debitEntries.reduce((sum, entry) => sum + entry.amount, 0)
        const totalCredit = creditEntries.reduce((sum, entry) => sum + entry.amount, 0)
        const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01 // Allow small rounding differences

        const summary = {
            batchId: batch.id,
            batchName: batch.batchName || 'N/A',
            payrollPeriod: batch.payrollPeriod || 'N/A',
            totalDebit: parseFloat(totalDebit.toFixed(2)),
            totalCredit: parseFloat(totalCredit.toFixed(2)),
            difference: parseFloat((totalDebit - totalCredit).toFixed(2)),
            isBalanced: isBalanced,
            debitCount: debitEntries.length,
            creditCount: creditEntries.length,
            employeeCount: batch.employeeDetails.length,
        }

        return {
            debitEntries: debitEntries.map((entry) => ({
                ...entry,
                amount: parseFloat(entry.amount.toFixed(2)),
            })),
            creditEntries: creditEntries.map((entry) => ({
                ...entry,
                amount: parseFloat(entry.amount.toFixed(2)),
            })),
            summary,
        }
    }

    /**
     * Console log detailed salary head-wise GL entries
     * @param {Object} batch - The payroll batch object
     * @param {Object} glEntries - The GL entries object
     */
    static logSalaryHeadWiseEntries(batch, glEntries) {
        if (!batch || !batch.employeeDetails || !glEntries) {
            console.error('Invalid data for salary head-wise logging')
            return
        }

        console.group(
            `%c📊 SALARY HEAD-WISE JOURNAL ENTRIES - BATCH: ${batch.id}`,
            'color: #7c3aed; font-weight: bold; font-size: 16px; background: #f3e8ff; padding: 8px;'
        )

        console.log(
            `%c📋 Batch: ${batch.payrollPeriod || 'N/A'} | Employees: ${batch.employeeDetails.length}`,
            'color: #4b5563; font-size: 12px; font-weight: 600;'
        )

        // Aggregate amounts by salary head
        const headWiseTotals = new Map()

        // Process each employee
        batch.employeeDetails.forEach((employee) => {
            // Process all salary heads for this employee
            Object.keys(employee).forEach((fieldName) => {
                // Skip excluded fields and fields not in GL mapping
                if (
                    this.EXCLUDED_FIELDS.includes(fieldName) ||
                    !this.GL_MAPPING[fieldName]
                ) {
                    return
                }

                const amount = parseFloat(employee[fieldName]) || 0
                if (amount === 0) return

                const mapping = this.GL_MAPPING[fieldName]

                // Create unique key for this salary head
                const key = fieldName

                if (!headWiseTotals.has(key)) {
                    headWiseTotals.set(key, {
                        salaryHead: fieldName,
                        debitAccount: mapping.debit.account,
                        debitGLCode: mapping.debit.code,
                        creditAccount: mapping.credit.account,
                        creditGLCode: mapping.credit.code,
                        totalAmount: 0,
                        employeeCount: 0,
                        category: mapping.category,
                    })
                }

                const headData = headWiseTotals.get(key)
                headData.totalAmount += amount
                headData.employeeCount += 1
            })
        })

        // Convert to array and create table entries
        const headWiseEntries = []
        let entryNo = 1

        headWiseTotals.forEach((data) => {
            // Add debit entry
            headWiseEntries.push({
                '#': entryNo++,
                'Salary Head': data.salaryHead,
                'Type': 'Dr',
                'GL Code': data.debitGLCode,
                'Account Name': data.debitAccount,
                'Amount (₹)': data.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 }),
                'Emp Count': data.employeeCount,
                'Category': data.category,
            })

            // Add credit entry
            headWiseEntries.push({
                '#': entryNo++,
                'Salary Head': data.salaryHead,
                'Type': 'Cr',
                'GL Code': data.creditGLCode,
                'Account Name': data.creditAccount,
                'Amount (₹)': data.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 }),
                'Emp Count': data.employeeCount,
                'Category': data.category,
            })
        })

        console.log(
            `%c🔍 SALARY HEAD-WISE TOTALS (${headWiseEntries.length} entries from ${headWiseTotals.size} heads)`,
            'color: #059669; font-weight: bold; font-size: 14px; margin-top: 10px;'
        )
        console.table(headWiseEntries)

        console.log(
            `%c💡 Note: Each salary head shows total for all employees with 2 entries (Debit & Credit)`,
            'color: #f59e0b; font-style: italic; font-size: 11px;'
        )

        console.groupEnd()
    }

    /**
     * Generate GL entries for multiple batches
     * @param {Array} batches - Array of batch objects
     * @returns {Array} - Array of GL entry objects for each batch
     */
    static generateBulkGLEntries(batches) {
        if (!Array.isArray(batches) || batches.length === 0) {
            console.error('Invalid batches array provided to generateBulkGLEntries')
            return []
        }

        return batches.map((batch) => ({
            batchId: batch.id,
            entries: this.generateGLEntries(batch),
        }))
    }

    /**
     * Console log GL entries in a formatted manner for verification
     * @param {Object} glEntries - The GL entries object returned by generateGLEntries
     */
    static logGLEntries(glEntries) {
        if (!glEntries) {
            console.error('No GL entries to log')
            return
        }

        console.group(
            `%c� JOURNAL VOUCHER - BATCH: ${glEntries.summary?.batchId || 'N/A'}`,
            'color: #2563eb; font-weight: bold; font-size: 16px; background: #dbeafe; padding: 8px;'
        )

        console.log(
            `%c📋 Batch Details: ${glEntries.summary?.payrollPeriod || 'N/A'} | Employees: ${glEntries.summary?.employeeCount || 0}`,
            'color: #4b5563; font-size: 12px; font-weight: 600;'
        )

        // Create JV format table - All Debits first, then all Credits
        const jvEntries = []

        // Add all debit entries
        glEntries.debitEntries.forEach((entry) => {
            jvEntries.push({
                'GL Code': entry.glCode,
                'Account Name': entry.accountName,
                'Debit (₹)': entry.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                'Credit (₹)': '-',
                'Category': entry.category,
            })
        })

        // Add all credit entries
        glEntries.creditEntries.forEach((entry) => {
            jvEntries.push({
                'GL Code': entry.glCode,
                'Account Name': entry.accountName,
                'Debit (₹)': '-',
                'Credit (₹)': entry.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                'Category': entry.category,
            })
        })

        // Add totals row
        jvEntries.push({
            'GL Code': '───────',
            'Account Name': '🔢 TOTALS',
            'Debit (₹)': glEntries.summary.totalDebit.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            'Credit (₹)': glEntries.summary.totalCredit.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            'Category': 'Summary',
        })

        console.log(
            `%c📊 JOURNAL VOUCHER ENTRIES`,
            'color: #7c3aed; font-weight: bold; font-size: 14px; text-decoration: underline; margin-top: 10px;'
        )
        console.table(jvEntries)

        // Summary box
        console.log(
            `%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
            'color: #6b7280; font-weight: bold;'
        )
        console.log(
            `%c💰 Total Debit:  ₹${glEntries.summary.totalDebit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
            'color: #dc2626; font-weight: bold; font-size: 13px;'
        )
        console.log(
            `%c💰 Total Credit: ₹${glEntries.summary.totalCredit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
            'color: #16a34a; font-weight: bold; font-size: 13px;'
        )
        console.log(
            `%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
            'color: #6b7280; font-weight: bold;'
        )
        console.log(
            `%c📌 Difference:   ₹${Math.abs(glEntries.summary.difference).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
            glEntries.summary.isBalanced ? 'color: #059669; font-weight: bold; font-size: 12px;' : 'color: #ef4444; font-weight: bold; font-size: 12px;'
        )

        if (!glEntries.summary.isBalanced) {
            console.error(
                `%c⚠️ WARNING: JOURNAL VOUCHER NOT BALANCED!`,
                'color: #ef4444; font-weight: bold; font-size: 14px; background: #fee2e2; padding: 6px;'
            )
        } else {
            console.log(
                `%c✅ JOURNAL VOUCHER IS BALANCED - READY TO POST`,
                'color: #16a34a; font-weight: bold; font-size: 14px; background: #dcfce7; padding: 6px;'
            )
        }

        console.groupEnd()
    }

    /**
     * Validate GL entries before posting to transactions
     * @param {Object} glEntries - The GL entries object
     * @returns {Object} - Validation result with isValid and errors array
     */
    static validateGLEntries(glEntries) {
        const errors = []

        if (!glEntries) {
            errors.push('GL entries object is null or undefined')
            return { isValid: false, errors }
        }

        if (!glEntries.debitEntries || glEntries.debitEntries.length === 0) {
            errors.push('No debit entries found')
        }

        if (!glEntries.creditEntries || glEntries.creditEntries.length === 0) {
            errors.push('No credit entries found')
        }

        if (!glEntries.summary) {
            errors.push('Summary information is missing')
        } else if (!glEntries.summary.isBalanced) {
            errors.push(
                `Debit and Credit totals do not match. Difference: ₹${glEntries.summary.difference}`
            )
        }

        // Check for negative amounts
        const negativeDebits = glEntries.debitEntries?.filter((entry) => entry.amount < 0)
        const negativeCredits = glEntries.creditEntries?.filter((entry) => entry.amount < 0)

        if (negativeDebits?.length > 0) {
            errors.push(`Found ${negativeDebits.length} negative debit amounts`)
        }

        if (negativeCredits?.length > 0) {
            errors.push(`Found ${negativeCredits.length} negative credit amounts`)
        }

        return {
            isValid: errors.length === 0,
            errors,
        }
    }

    /**
     * Create and post salary payment transaction to localStorage
     * @param {Object} batch - The salary batch object
     * @param {Object} glEntries - The generated GL entries
     * @param {string} approverName - Name of the approver
     * @returns {Object} - Transaction result with success flag and transaction data
     */
    static createSalaryTransaction(batch, glEntries, approverName = 'System') {
        try {
            // Validate GL entries first
            const validation = this.validateGLEntries(glEntries)
            if (!validation.isValid) {
                throw new Error(`GL Entry Validation Failed: ${validation.errors.join(', ')}`)
            }

            // Generate voucher number
            const year = new Date().getFullYear()
            const month = (new Date().getMonth() + 1).toString().padStart(2, '0')
            const voucherNo = `JVF00/${Date.now().toString().slice(-5)}/${year.toString().slice(-2)}${month}`

            // Get current date
            const currentDate = new Date().toISOString().split('T')[0]

            // Prepare transaction entries - DEBIT entries first, then CREDIT entries
            const transactionEntries = []
            let lineNo = 1

            // Add all DEBIT entries first
            glEntries.debitEntries.forEach((entry) => {
                transactionEntries.push({
                    lineNo: lineNo++,
                    glCode: entry.glCode,
                    glName: entry.accountName,
                    accountName: entry.accountName,
                    debit: entry.amount,
                    credit: 0,
                    narration: `${entry.accountName} for ${batch.payrollPeriod || 'Salary Payment'}`,
                    category: entry.category,
                })
            })

            // Add all CREDIT entries after debits
            glEntries.creditEntries.forEach((entry) => {
                transactionEntries.push({
                    lineNo: lineNo++,
                    glCode: entry.glCode,
                    glName: entry.accountName,
                    accountName: entry.accountName,
                    debit: 0,
                    credit: entry.amount,
                    narration: `${entry.accountName} for ${batch.payrollPeriod || 'Salary Payment'}`,
                    category: entry.category,
                })
            })

            // Create transaction object
            const transaction = {
                id: `TXN_SALARY_${Date.now()}`,
                voucherNo: voucherNo,
                voucherType: 'Journal Voucher',
                transactionType: 'Salary Payment',
                date: currentDate,
                batchId: batch.id,
                payrollPeriod: batch.payrollPeriod,
                employeeCount: batch.employeeDetails?.length || 0,
                entries: transactionEntries,
                totalDebit: glEntries.summary.totalDebit,
                totalCredit: glEntries.summary.totalCredit,
                narration: `Salary payment for ${batch.payrollPeriod || 'the period'} - ${batch.employeeDetails?.length || 0} employees`,
                status: 'Posted',
                postedDate: new Date().toISOString(),
                approvedBy: approverName,
                createdBy: 'System',
                createdAt: new Date().toISOString(),
            }

            // Get existing transactions from localStorage
            const existingTransactions = JSON.parse(localStorage.getItem('transactions') || '[]')

            // Add new transaction
            existingTransactions.push(transaction)

            // Save back to localStorage
            localStorage.setItem('transactions', JSON.stringify(existingTransactions))

            console.log('✅ Salary transaction posted successfully:', transaction.voucherNo)
            console.log('📝 Transaction ID:', transaction.id)

            return {
                success: true,
                transaction: transaction,
                voucherNo: voucherNo,
            }
        } catch (error) {
            console.error('❌ Error creating salary transaction:', error)
            return {
                success: false,
                error: error.message,
            }
        }
    }

    /**
     * Prepare JV modal data from batch and GL entries
     * @param {Object} batch - The salary batch object
     * @param {Object} glEntries - The generated GL entries
     * @param {string} voucherNo - The voucher number
     * @param {string} approverName - Name of the approver
     * @returns {Object} - JV modal data object
     */
    static prepareJVModalData(batch, glEntries, voucherNo, approverName = 'System') {
        // Prepare entries array - DEBIT first, then CREDIT
        const entries = []

        // Add all DEBIT entries
        glEntries.debitEntries.forEach((entry) => {
            entries.push({
                accountName: entry.accountName,
                glCode: entry.glCode,
                glName: entry.accountName,
                debit: entry.amount,
                credit: 0,
                narration: `${entry.accountName} for ${batch.payrollPeriod || 'Salary Payment'}`,
            })
        })

        // Add all CREDIT entries
        glEntries.creditEntries.forEach((entry) => {
            entries.push({
                accountName: entry.accountName,
                glCode: entry.glCode,
                glName: entry.accountName,
                debit: 0,
                credit: entry.amount,
                narration: `${entry.accountName} for ${batch.payrollPeriod || 'Salary Payment'}`,
            })
        })

        const currentDate = new Date().toISOString().split('T')[0]

        return {
            header: {
                company: 'I SMART FACTECH PRIVATE LIMITED',
                address:
                    '317, 3RD FLOOR, J/2, NILGIRI MANDLA TRUCK TERMINAL, NEAR WADALA STD, MUMBAI - 400037',
                gstNo: '27AACCD4328112E',
                state: 'Maharashtra (27)',
                voucherNo: voucherNo,
                date: currentDate,
                reference: `Salary Payment - ${batch.id}`,
                preparedBy: 'System',
            },
            entries: entries,
            totals: {
                debit: glEntries.summary.totalDebit,
                credit: glEntries.summary.totalCredit,
            },
            narration: `Salary payment for ${batch.payrollPeriod || 'the period'} - ${batch.employeeDetails?.length || 0} employees`,
            approvals: {
                preparedBy: 'System',
                checkedBy: 'Pending',
                authorizedBy: approverName,
                date: currentDate,
            },
            batchInfo: {
                batchId: batch.id,
                payrollPeriod: batch.payrollPeriod,
                employeeCount: batch.employeeDetails?.length || 0,
            },
        }
    }
}

export default SalaryGLMappingService

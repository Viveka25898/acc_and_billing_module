import axiosInstance from '../../../api/axiosInstance'

/**
 * Unified Expense Ledger Service - Integrates real REST endpoints and maintains Conveyance compatibility
 */
export class ExpenseLedgerService {

  /**
   * Get ledger data for specific expense head
   */
  static async getExpenseLedgerData(expenseHeadCode, params = {}) {
    try {
      console.log(`📊 API call for expense head: ${expenseHeadCode}`, params)

      // Clean query params: omit empty/null/undefined fields
      const cleanParams = {}
      Object.keys(params).forEach(key => {
        const val = params[key]
        if (val !== undefined && val !== null && val !== '') {
          cleanParams[key] = val
        }
      })

      // Fetch header, entries, and footer in parallel
      const [headerRes, entriesRes, footerRes] = await Promise.all([
        axiosInstance.get(`/account-master/ledger/expense/internal/${expenseHeadCode}/header`),
        axiosInstance.get(`/account-master/ledger/expense/internal/${expenseHeadCode}/entries`, { params: cleanParams }),
        axiosInstance.get(`/account-master/ledger/expense/internal/${expenseHeadCode}/footer`, { params: cleanParams })
      ])

      const headerData = headerRes.data?.results || headerRes.data || {}
      const entriesData = entriesRes.data?.results || entriesRes.data || {}
      const footerData = footerRes.data?.results || footerRes.data || {}

      const rawEntries = entriesData.entries || []
      const transformedTransactions = rawEntries.map((txn, index) => {
        const dateFormatted = txn.date ? new Date(txn.date).toLocaleDateString('en-IN', {
          day: '2-digit', month: 'short', year: 'numeric'
        }) : '-'

        return {
          id: index + 2,
          date: dateFormatted,
          voucherNo: txn.voucherNo || '-',
          entryType: txn.entryType || 'expense',
          debit: txn.debit ? Number(txn.debit).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-',
          credit: txn.credit ? Number(txn.credit).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-',
          balance: txn.balance ? this.formatBalance(txn.balance) : '-',
          narration: txn.narration || '-',
          settlementRef: txn.settlementRef || '-',
          employee: txn.employee ? {
            name: txn.employee.name || '-',
            id: txn.employee.id || ''
          } : { name: '-', id: '' },
          glAccount: txn.glAccount || '-',
          costCenter: txn.costCenter || 'General',
          customer: txn.customer || '-',
          site: txn.site || '-',
          state: txn.state || '-',
          approvedBy: txn.approvedBy || '-',
          attachments: txn.attachments || 0,
          status: txn.status || 'posted',
          rowType: txn.rowType || 'normal'
        }
      })

      // Add Opening Balance Row if it is page 1
      const isPage1 = !params.page || Number(params.page) === 1
      const finalTransactions = []
      if (isPage1) {
        finalTransactions.push({
          id: 1,
          date: headerData.period?.split(' to ')[0] || '-',
          voucherNo: 'OB-FY',
          entryType: 'opening',
          debit: headerData.openingBalance ? Number(headerData.openingBalance).toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '0.00',
          credit: '-',
          balance: `${headerData.openingBalance ? Number(headerData.openingBalance).toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '0.00'} DR`,
          narration: 'Opening Balance B/F',
          settlementRef: '-',
          employee: { name: '-', id: '' },
          glAccount: '-',
          costCenter: 'All',
          approvedBy: 'System',
          attachments: 0,
          status: 'posted',
          rowType: 'opening'
        })
      }

      // Append standard transactions
      finalTransactions.push(...transformedTransactions)

      // Add Closing Balance Row if we are on the last page
      const hasNextPage = entriesData.pagination?.hasNextPage ?? false
      if (!hasNextPage && finalTransactions.length > 0) {
        finalTransactions.push({
          id: finalTransactions.length + 2,
          date: headerData.period?.split(' to ')[1] || '-',
          voucherNo: 'CL-FY',
          entryType: 'closing',
          debit: '-',
          credit: '-',
          balance: `${headerData.closingBalance ? Number(headerData.closingBalance).toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '0.00'} DR`,
          narration: 'Closing Balance C/F',
          settlementRef: '-',
          employee: { name: '-', id: '' },
          glAccount: '-',
          costCenter: 'All',
          approvedBy: 'System',
          attachments: 0,
          status: 'posted',
          rowType: 'closing'
        })
      }

      // Format Balances for Balance Cards
      const balances = {
        opening: {
          amount: headerData.openingBalance ? `₹${Number(headerData.openingBalance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '₹0.00',
          type: headerData.openingBalanceType || 'Debit Balance'
        },
        periodExpenses: {
          amount: headerData.periodExpenses ? `₹${Number(headerData.periodExpenses).toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '₹0.00',
          type: 'Total Expenses'
        },
        closing: {
          amount: headerData.closingBalance ? `₹${Number(headerData.closingBalance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '₹0.00',
          type: 'Debit Balance'
        }
      }

      // Format Stats
      const stats = [
        { label: 'Total Transactions', value: String(headerData.stats?.totalTransactions ?? 0) },
        { label: 'Settlements', value: String(headerData.stats?.settlements ?? 0) },
        { label: 'Average Per Transaction', value: headerData.stats?.avgPerTransaction || '₹0.00' },
        { label: 'Employees Utilized', value: String(headerData.stats?.employees ?? 0) }
      ]

      // Format Summary
      const summary = {
        totalDebit: footerData.totalDebit || '₹0.00',
        totalCredit: footerData.totalCredit || '₹0.00',
        closingBalance: footerData.closingBalance || '₹0.00 DR'
      }

      // Filter options
      const filterOptions = this.generateFilterOptionsFromEntries(rawEntries)

      return {
        header: {
          expenseHeadCode: headerData.expenseHeadCode || expenseHeadCode,
          expenseHeadName: headerData.expenseHeadName || '-',
          parentAccount: headerData.parentAccount || '-',
          accountType: headerData.accountType || '-',
          financialYear: headerData.financialYear || '-',
          period: headerData.period || '-',
          costCenter: headerData.costCenter || '-',
          department: headerData.department || '-'
        },
        balances,
        stats,
        transactions: finalTransactions,
        summary,
        filterOptions,
        pagination: entriesData.pagination || { page: 1, totalPages: 1 }
      }

    } catch (error) {
      console.error('❌ Error fetching expense ledger data:', error)
      return this.getEmptyLedgerData(expenseHeadCode, error.message)
    }
  }

  /**
   * Helper to format balance string safely
   */
  static formatBalance(balStr) {
    if (!balStr) return '-'
    const parts = String(balStr).trim().split(/\s+/)
    const num = parseFloat(parts[0])
    if (isNaN(num)) return balStr
    const formattedNum = num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    return parts[1] ? `${formattedNum} ${parts[1]}` : formattedNum
  }

  /**
   * Filter options generator
   */
  static generateFilterOptionsFromEntries(rawEntries) {
    const employeeOptions = [
      { value: '', label: 'All Employees' }
    ]
    const employeeMap = new Map()
    rawEntries.forEach(t => {
      if (t.employee && t.employee.id) {
        const empIdLower = String(t.employee.id).toLowerCase()
        if (!employeeMap.has(empIdLower)) {
          employeeMap.set(empIdLower, {
            value: empIdLower,
            label: `${t.employee.id} - ${t.employee.name || 'Unknown'}`
          })
        }
      }
    })
    employeeMap.forEach(emp => employeeOptions.push(emp))

    const costCenterOptions = [
      { value: '', label: 'All' }
    ]
    const costCenters = Array.from(new Set(rawEntries.map(e => e.costCenter).filter(Boolean)))
    costCenters.forEach(cc => {
      costCenterOptions.push({
        value: cc.toLowerCase().replace(/\s+/g, '-'),
        label: cc
      })
    })

    const entryTypeOptions = [
      { value: '', label: 'All' },
      { value: 'settlement', label: 'Settlement' },
      { value: 'purchase', label: 'Purchase' },
      { value: 'expense', label: 'Expense' },
      { value: 'journal', label: 'Journal' }
    ]

    return {
      employees: employeeOptions,
      costCenters: costCenterOptions,
      entryTypes: entryTypeOptions
    }
  }

  /**
   * =========================================================================
   * LEGACY COMPATIBILITY LAYER FOR X2001003 (Conveyance Ledger)
   * =========================================================================
   */

  static getLocalExpenseLedgerData(expenseHeadCode) {
    try {
      const allTransactions = JSON.parse(localStorage.getItem('transactions')) || []
      const chartOfAccounts = JSON.parse(localStorage.getItem('chartOfAccounts')) || []
      const users = JSON.parse(localStorage.getItem('users')) || []
      const conveyanceRequests = JSON.parse(localStorage.getItem('conveyanceRequests')) || []

      const expenseTransactions = allTransactions.filter(txn => {
        if (!txn || !Array.isArray(txn.entries) || txn.entries.length === 0) return false
        return txn.entries.some(entry => entry && entry.glCode === expenseHeadCode)
      })

      const expenseHead = chartOfAccounts.find(acc => acc.code === expenseHeadCode)
      const ledgerTransactions = this.transformTransactionsToLedgerFormat(
        expenseTransactions,
        expenseHeadCode,
        users,
        conveyanceRequests
      )

      const balances = this.calculateBalances(ledgerTransactions)
      const stats = this.calculateStats(ledgerTransactions, users)
      const summary = this.calculateSummary(ledgerTransactions)
      const filterOptions = this.generateFilterOptions(ledgerTransactions, users)

      return {
        header: this.getHeaderData(expenseHead, expenseHeadCode),
        balances,
        stats,
        transactions: ledgerTransactions,
        summary,
        filterOptions,
        pagination: { page: 1, totalPages: 1 }
      }
    } catch (error) {
      console.error('Error generating local expense ledger:', error)
      return this.getEmptyLedgerData(expenseHeadCode, error.message)
    }
  }

  static transformTransactionsToLedgerFormat(transactions, expenseHeadCode, users, conveyanceRequests = []) {
    const ledgerEntries = []
    let runningBalance = 0
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const periodStart = `01-Apr-${currentYear.toString().slice(-2)}`
    const periodEnd = this.calculatePeriodEnd(currentDate)

    ledgerEntries.push({
      id: 1,
      date: periodStart,
      voucherNo: `OB-${currentYear}`,
      entryType: 'opening',
      debit: '0.00',
      credit: '-',
      balance: '0.00 DR',
      narration: `Opening Balance B/F FY ${currentYear}-${(currentYear + 1).toString().slice(-2)}`,
      settlementRef: '-',
      employee: { name: '-', id: '' },
      glAccount: '-',
      costCenter: 'All',
      approvedBy: 'System',
      attachments: 0,
      status: 'posted',
      rowType: 'opening'
    })

    transactions.forEach((txn, index) => {
      if (!txn || !Array.isArray(txn.entries)) return

      const expenseEntry = txn.entries.find(entry => entry && entry.glCode === expenseHeadCode)
      const employeeEntry = txn.entries.find(entry => entry && entry.glCode && entry.glCode.startsWith('A3002-EMP-'))

      if (expenseEntry) {
        const amount = expenseEntry.debit || 0
        runningBalance += amount

        let employee = { name: 'System', id: '' }
        if (expenseEntry.employeeId) {
          const emp = users.find(u => u.empId === expenseEntry.employeeId || u.username === expenseEntry.employeeId)
          if (emp) {
            employee = {
              name: emp.fullName || emp.username,
              id: `EMP-${emp.empId}`
            }
          }
        } else {
          employee = this.getEmployeeDetails(employeeEntry, users)
        }

        let entryType = 'purchase'
        if (txn.voucherType?.includes('Journal')) {
          entryType = 'settlement'
        } else if (txn.voucherType?.includes('Expense') && txn.conveyanceClaimId) {
          entryType = 'expense'
        } else if (txn.voucherType?.includes('Expense')) {
          entryType = 'expense'
        }

        const settlementRef = txn.conveyanceClaimId
          ? `CONV-${txn.conveyanceClaimId?.slice(-6)}`
          : txn.settlementId || txn.advanceRequestId || `TXN-${txn.id?.slice(-6)}`

        let attachmentCount = 0
        if (txn.conveyanceClaimId || expenseHeadCode === 'X2001003') {
          const conveyanceReq = conveyanceRequests.find(req =>
            req.id === txn.conveyanceClaimId ||
            req.transactionId === txn.id ||
            req.voucherNumber === txn.voucherNo
          )
          if (conveyanceReq) {
            attachmentCount = (conveyanceReq.reports?.length || 0) + (conveyanceReq.receipts?.length || 0)
          }
        }

        ledgerEntries.push({
          id: index + 2,
          date: this.formatDateForDisplay(txn.date),
          voucherNo: txn.voucherNo,
          entryType,
          debit: amount.toFixed(2),
          credit: '-',
          balance: `${runningBalance.toFixed(2)} DR`,
          narration: expenseEntry.narration || txn.narration,
          settlementRef,
          employee,
          glAccount: employeeEntry?.glCode || (expenseEntry.employeeId ? `EMP-${expenseEntry.employeeId}` : '-'),
          costCenter: expenseEntry.costCenter || txn.costCenter || 'General',
          customer: txn.customer || txn.clientName || '-',
          site: expenseEntry.site || txn.site || '-',
          state: txn.state || '-',
          approvedBy: txn.approvedBy || 'System',
          attachments: attachmentCount,
          status: 'posted',
          rowType: 'normal'
        })
      }
    })

    if (ledgerEntries.length > 1) {
      ledgerEntries.push({
        id: ledgerEntries.length + 1,
        date: periodEnd,
        voucherNo: `CL-${currentYear}`,
        entryType: 'closing',
        debit: '-',
        credit: '-',
        balance: `${runningBalance.toFixed(2)} DR`,
        narration: `Closing Balance C/F to ${this.getNextPeriod(currentDate)}`,
        settlementRef: '-',
        employee: { name: '-', id: '' },
        glAccount: '-',
        costCenter: 'All',
        approvedBy: 'System',
        attachments: 0,
        status: 'posted',
        rowType: 'closing'
      })
    }

    return ledgerEntries
  }

  static calculatePeriodEnd(currentDate) {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const day = currentDate.getDate()
    const targetMonth = day > 25 ? month + 1 : month
    const targetYear = targetMonth > 11 ? year + 1 : year
    const adjustedMonth = targetMonth % 12
    const lastDay = new Date(targetYear, adjustedMonth + 1, 0).getDate()
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${lastDay}-${monthNames[adjustedMonth]}-${targetYear.toString().slice(-2)}`
  }

  static getNextPeriod(currentDate) {
    const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    return `${monthNames[nextMonth.getMonth()]} ${nextMonth.getFullYear()}`
  }

  static getEmployeeDetails(employeeEntry, users) {
    if (!employeeEntry || !employeeEntry.employeeId) return { name: 'System', id: '' }
    const employee = users.find(u => u.empId === employeeEntry.employeeId)
    if (employee) return { name: employee.fullName, id: `EMP-${employee.empId}` }
    if (employeeEntry.glCode && employeeEntry.glCode.startsWith('A3002-EMP-')) {
      const empId = employeeEntry.glCode.replace('A3002-EMP-', '')
      return { name: `Employee ${empId}`, id: `EMP-${empId}` }
    }
    return { name: 'Unknown', id: '' }
  }

  static calculateBalances(transactions) {
    const normalTransactions = transactions.filter(t => t.rowType === 'normal')
    const totalDebits = normalTransactions.reduce((sum, t) => sum + parseFloat(t.debit || 0), 0)
    const closingBalance = transactions.find(t => t.rowType === 'closing')?.balance || '0.00 DR'
    return {
      opening: { amount: '₹0.00', type: 'Debit Balance' },
      periodExpenses: { amount: `₹${totalDebits.toLocaleString('en-IN')}`, type: 'Total Debits' },
      closing: { amount: `₹${closingBalance.split(' ')[0]}`, type: 'Debit Balance' }
    }
  }

  static calculateStats(transactions, users) {
    const normalTransactions = transactions.filter(t => t.rowType === 'normal')
    const employeeIds = [...new Set(normalTransactions.map(t => t.employee.id).filter(id => id))]
    const totalAmount = normalTransactions.reduce((sum, t) => sum + parseFloat(t.debit || 0), 0)
    const avgPerTransaction = normalTransactions.length > 0 ? totalAmount / normalTransactions.length : 0
    const settlements = normalTransactions.filter(t => t.entryType === 'settlement').length
    return [
      { label: 'Total Transactions', value: normalTransactions.length.toString() },
      { label: 'Employees', value: employeeIds.length.toString() },
      { label: 'Avg per Transaction', value: `₹${Math.round(avgPerTransaction).toLocaleString('en-IN')}` },
      { label: 'Settlements', value: settlements.toString() }
    ]
  }

  static calculateSummary(transactions) {
    const normalTransactions = transactions.filter(t => t.rowType === 'normal')
    const totalDebit = normalTransactions.reduce((sum, t) => sum + parseFloat(t.debit || 0), 0)
    const closingBalance = transactions.find(t => t.rowType === 'closing')?.balance || '0.00 DR'
    return {
      totalDebit: `₹${totalDebit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
      totalCredit: '₹0.00',
      closingBalance: `₹${closingBalance}`
    }
  }

  static generateFilterOptions(transactions, users) {
    const normalTransactions = transactions.filter(t => t.rowType === 'normal')
    const employeeOptions = [
      { value: '', label: 'All Employees' }
    ]
    const employeeMap = new Map()
    normalTransactions.forEach(t => {
      if (t.employee.id) {
        const empIdLower = t.employee.id.toLowerCase()
        if (!employeeMap.has(empIdLower)) {
          employeeMap.set(empIdLower, {
            value: empIdLower,
            label: `${t.employee.id} - ${t.employee.name}`
          })
        }
      }
    })
    employeeMap.forEach(emp => employeeOptions.push(emp))

    const costCenterOptions = [
      { value: '', label: 'All' }
    ]
    const costCenterSet = new Set(
      normalTransactions.map(t => t.costCenter).filter(cc => cc && cc !== 'All')
    )
    costCenterSet.forEach(cc => {
      costCenterOptions.push({
        value: cc.toLowerCase().replace(/\s+/g, '-'),
        label: cc
      })
    })

    const entryTypeOptions = [
      { value: '', label: 'All' },
      { value: 'settlement', label: 'Settlement' },
      { value: 'purchase', label: 'Purchase' },
      { value: 'expense', label: 'Expense' },
      { value: 'journal', label: 'Journal' }
    ]

    return {
      employees: employeeOptions,
      costCenters: costCenterOptions,
      entryTypes: entryTypeOptions
    }
  }

  static getHeaderData(expenseHead, expenseHeadCode) {
    const currentYear = new Date().getFullYear()
    const nextYear = currentYear + 1
    const expenseHeadConfig = {
      'X1001002001': { name: 'TRAVEL EXPENSE', parent: 'OTHER PRODUCTION COST (X1001002)', department: 'Operations' },
      'X1001003001': { name: 'FOOD & REFRESHMENT EXPENSE', parent: 'FOOD COST (X1001003)', department: 'Operations' },
      'X2001002001': { name: 'OFFICE SUPPLIES EXPENSE', parent: 'OTHER BRANCH EXPENSES (X2001002)', department: 'Administration' },
      'X2001003': { name: 'BRANCH CONVEYANCE EXPENSE', parent: 'BRANCH MANAGEMENT (X2001)', department: 'Operations' }
    }
    const config = expenseHeadConfig[expenseHeadCode] || {
      name: expenseHead?.name || 'Expense Head',
      parent: expenseHead?.parentAccount || 'General Expenses',
      department: 'Various'
    }
    return {
      expenseHeadCode,
      expenseHeadName: config.name,
      parentAccount: config.parent,
      accountType: 'EXPENSE - DIRECT',
      financialYear: `${currentYear}-${nextYear.toString().slice(-2)}`,
      period: `Apr ${currentYear} to ${new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}`,
      costCenter: 'All Operations',
      department: config.department
    }
  }

  static formatDateForDisplay(dateString) {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' }).replace(/-/g, '-')
    } catch {
      return dateString
    }
  }

  static getEmptyLedgerData(expenseHeadCode, errorMessage = '') {
    const currentYear = new Date().getFullYear()
    const periodEnd = this.calculatePeriodEnd(new Date())
    const header = this.getHeaderData(null, expenseHeadCode)
    return {
      header,
      balances: {
        opening: { amount: '₹0.00', type: 'Debit Balance' },
        periodExpenses: { amount: '₹0.00', type: 'Total Debits' },
        closing: { amount: '₹0.00', type: 'Debit Balance' }
      },
      stats: [
        { label: 'Total Transactions', value: '0' },
        { label: 'Employees', value: '0' },
        { label: 'Avg per Transaction', value: '₹0' },
        { label: 'Settlements', value: '0' }
      ],
      transactions: [
        {
          id: 1,
          date: `01-Apr-${currentYear.toString().slice(-2)}`,
          voucherNo: `OB-${currentYear}`,
          entryType: 'opening',
          debit: '0.00',
          credit: '-',
          balance: '0.00 DR',
          narration: `Opening Balance B/F FY ${currentYear}-${(currentYear + 1).toString().slice(-2)}`,
          settlementRef: '-',
          employee: { name: '-', id: '' },
          glAccount: '-',
          costCenter: 'All',
          approvedBy: 'System',
          attachments: 0,
          status: 'posted',
          rowType: 'opening'
        },
        {
          id: 2,
          date: periodEnd,
          voucherNo: `CL-${currentYear}`,
          entryType: 'closing',
          debit: '-',
          credit: '-',
          balance: '0.00 DR',
          narration: errorMessage || 'No transactions found for this period',
          settlementRef: '-',
          employee: { name: '-', id: '' },
          glAccount: '-',
          costCenter: 'All',
          approvedBy: 'System',
          attachments: 0,
          status: 'posted',
          rowType: 'closing'
        }
      ],
      summary: {
        totalDebit: '₹0.00',
        totalCredit: '₹0.00',
        closingBalance: '₹0.00 DR'
      },
      filterOptions: {
        employees: [{ value: '', label: 'All Employees' }],
        costCenters: [{ value: '', label: 'All' }],
        entryTypes: [
          { value: '', label: 'All' },
          { value: 'settlement', label: 'Settlement' },
          { value: 'purchase', label: 'Purchase' }
        ]
      }
    }
  }
}
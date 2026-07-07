import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiChevronRight, FiChevronDown } from 'react-icons/fi'
import LedgerBalanceService from '../Services/LedgerBalanceService'

// Add: Import syncAllLedgerBalances utility
import { syncAllLedgerBalances } from '../Services/LedgerBalancesLocalStorageService'
// Add: Import reports ledger balances saver so reportsLedgersBalances is always updated
import { saveAllReportsLedgersBalances } from '../Services/ReportsLedgerBalancesService'

const AccountsTable = ({
  accounts,
  searchTerm,
  selectedFilter,
  onAccountClick,
  loadingStates = {},
  expandedAccounts = [],
  onExpandAccount,
}) => {
  const navigate = useNavigate()
  const [balances, setBalances] = useState({})
  const [balancesLoading, setBalancesLoading] = useState(true)

  // Function to get balance for a specific account from API/localStorage
  const getAccountBalance = (accountCode) => {
    try {
      // First check direct API balance
      const matchedAccount = accounts.find((acc) => acc.code === accountCode)
      if (matchedAccount && matchedAccount.balance !== undefined && matchedAccount.balance !== null) {
        return Number(matchedAccount.balance)
      }

      // Check Client Ledgers (D-prefix accounts)
      if (accountCode.startsWith('D')) {
        // First check via LedgerBalanceService (uses ledgerBalances from A3001BalanceSync)
        try {
          const val = LedgerBalanceService.getLedgerBalance(accountCode)
          if (val !== null && val !== undefined) return val
        } catch (error) {
          console.error(`Error extracting D ledger balance for ${accountCode}:`, error)
        }

        // Fallback: Check clientLedgers directly
        const clientLedgers = JSON.parse(localStorage.getItem('clientLedgers') || '{}')
        const ledger = clientLedgers[accountCode]
        if (ledger && ledger.ledgerDetails) {
          const balance =
            ledger.ledgerDetails.currentOutstanding || ledger.ledgerDetails.closingBalance || '₹0'
          return parseFloat(balance.replace(/[₹,]/g, ''))
        }
      }

      // Check Revenue Ledgers (R-prefix accounts) via LedgerBalanceService
      if (accountCode.startsWith('R')) {
        const val = LedgerBalanceService.getLedgerBalance(accountCode)
        if (val !== null && val !== undefined) return val
      }

      // Check Expense Ledgers (X-prefix accounts) via LedgerBalanceService
      if (accountCode.startsWith('X')) {
        // First check via LedgerBalanceService (uses ledgerBalances from ExpenseBalanceSync)
        try {
          const val = LedgerBalanceService.getLedgerBalance(accountCode)
          if (val !== null && val !== undefined) return val
        } catch (error) {
          console.error(`Error extracting X ledger balance for ${accountCode}:`, error)
        }

        // Fallback: Check expenseLedgers store
        const expenseLedgers = JSON.parse(localStorage.getItem('expenseLedgers') || '{}')
        const ledger = expenseLedgers[accountCode]
        if (ledger && ledger.ledgerDetails) {
          const balance =
            ledger.ledgerDetails.totalExpense || ledger.ledgerDetails.closingBalance || '₹0'
          return parseFloat(balance.replace(/[₹,]/g, ''))
        }
      }

      // Check Vendor Ledgers (L2005-prefix accounts)
      if (accountCode.startsWith('L2005')) {
        const vendorLedgers = JSON.parse(localStorage.getItem('vendorLedgers') || '{}')
        const ledger = vendorLedgers[accountCode]
        if (ledger && ledger.ledgerDetails) {
          const balance = ledger.ledgerDetails.closingBalance || '₹0'
          return parseFloat(balance.replace(/[₹,]/g, ''))
        }
      }

      // Check Liability Ledgers (L-prefix accounts) via LedgerBalanceService
      if (accountCode.startsWith('L')) {
        // First check via LedgerBalanceService (uses ledgerBalances from LiabilityBalanceSync)
        try {
          const val = LedgerBalanceService.getLedgerBalance(accountCode)
          if (val !== null && val !== undefined) return val
        } catch (error) {
          console.error(`Error extracting L ledger balance for ${accountCode}:`, error)
        }

        // Fallback: Check specific liability ledger stores
        // CGST Payable
        if (accountCode === 'L3001' || accountCode.startsWith('L3001')) {
          const cgstData = JSON.parse(localStorage.getItem('cgst_payable_ledger') || '{}')
          if (cgstData.closingBalance) {
            return parseFloat(cgstData.closingBalance.replace(/[₹,]/g, ''))
          }
        }
        // SGST Payable
        if (accountCode === 'L3002' || accountCode.startsWith('L3002')) {
          const sgstData = JSON.parse(localStorage.getItem('sgst_payable_ledger') || '{}')
          if (sgstData.closingBalance) {
            return parseFloat(sgstData.closingBalance.replace(/[₹,]/g, ''))
          }
        }
        // IGST Payable
        if (accountCode === 'L3003' || accountCode.startsWith('L3003')) {
          const igstData = JSON.parse(localStorage.getItem('igst_payable_ledger') || '{}')
          if (igstData.closingBalance) {
            return parseFloat(igstData.closingBalance.replace(/[₹,]/g, ''))
          }
        }
        // TDS Payable 194C
        if (accountCode === 'L3101' || accountCode.startsWith('L3101')) {
          const tdsData = JSON.parse(localStorage.getItem('tds_payable_194c_ledger') || '{}')
          if (tdsData.closingBalance) {
            return parseFloat(tdsData.closingBalance.replace(/[₹,]/g, ''))
          }
        }
        // TDS Receivable 194J
        if (accountCode === 'L3102' || accountCode.startsWith('L3102')) {
          const tdsData = JSON.parse(localStorage.getItem('tds_receivable_194j_ledger') || '{}')
          if (tdsData.closingBalance) {
            return parseFloat(tdsData.closingBalance.replace(/[₹,]/g, ''))
          }
        }
      }

      // Check Employee Ledgers (A3002-prefix accounts)
      if (accountCode.startsWith('A3002')) {
        const users = JSON.parse(localStorage.getItem('users') || '[]')
        const employee = users.find((u) => u.glCode === accountCode)
        if (employee && employee.osBalance !== undefined) {
          return parseFloat(employee.osBalance || 0)
        }
      }

      // Check Bank Ledgers (A3004-prefix accounts)
      if (accountCode.startsWith('A3004')) {
        const bankAccounts = JSON.parse(localStorage.getItem('bankAccounts') || '{}')
        const bankLedger = bankAccounts[accountCode]
        if (bankLedger && bankLedger.closingBalance !== undefined) {
          return parseFloat(bankLedger.closingBalance?.replace(/[₹,]/g, '') || 0)
        }
      }

      // Check Fixed Asset Ledgers (A1-prefix accounts) via LedgerBalanceService
      if (accountCode.startsWith('A1')) {
        try {
          const val = LedgerBalanceService.getLedgerBalance(accountCode)
          if (val !== null && val !== undefined) return val
        } catch (error) {
          console.error(`Error extracting A1 ledger balance for ${accountCode}:`, error)
        }
      }

      // Check Employee Ledgers (A3-prefix accounts) via LedgerBalanceService
      if (accountCode.startsWith('A3')) {
        try {
          const val = LedgerBalanceService.getLedgerBalance(accountCode)
          if (val !== null && val !== undefined) return val
        } catch (error) {
          console.error(`Error extracting A3 ledger balance for ${accountCode}:`, error)
        }
      }

      return 0
    } catch (error) {
      console.error(`Error fetching balance for ${accountCode}:`, error)
      return 0
    }
  }

  // Recursive function to calculate total balance for a folder (sum of all child ledgers)
  const calculateFolderBalance = (parentCode) => {
    try {
      // First check if direct API balance exists for parent
      const matchedAccount = accounts.find((acc) => acc.code === parentCode)
      if (matchedAccount && matchedAccount.balance !== undefined && matchedAccount.balance !== null) {
        return Number(matchedAccount.balance)
      }

      let total = 0

      // Find all children of this parent
      const children = accounts.filter((acc) => acc.parentCode === parentCode)

      for (const child of children) {
        if (child.type === 'ACCOUNT') {
          // If it's a ledger account, get its balance
          total += getAccountBalance(child.code)
        } else {
          // If it's a folder, recursively get balances of its children
          total += calculateFolderBalance(child.code)
        }
      }

      return total
    } catch (error) {
      console.error(`Error calculating folder balance for ${parentCode}:`, error)
      return 0
    }
  }

  // Calculate balances for all accounts
  useEffect(() => {
    const calculateBalances = async () => {
      try {
        setBalancesLoading(true)
        const balanceMap = {}

        for (const account of accounts) {
          if (account.type === 'ACCOUNT') {
            // For ledger accounts, get direct balance
            balanceMap[account.code] = getAccountBalance(account.code)
          } else {
            // For folders/roots, calculate sum of children
            balanceMap[account.code] = calculateFolderBalance(account.code)
          }
        }

        setBalances(balanceMap)
        // Patch: Sync all present ledger balances to localStorage (ledgerBalances)
        // Only for ledgers (type === 'ACCOUNT')
        const ledgerBalancesToSync = {}
        for (const account of accounts) {
          if (account.type === 'ACCOUNT') {
            ledgerBalancesToSync[account.code] = {
              balance: balanceMap[account.code],
            }
          }
        }
        syncAllLedgerBalances(ledgerBalancesToSync)

        // After syncing raw ledgerBalances, also refresh the aggregated reportsLedgersBalances
        try {
          saveAllReportsLedgersBalances()
        } catch (err) {
          console.error(
            '[Reports] Error while saving reportsLedgersBalances from AccountsTable:',
            err
          )
        }
      } catch (error) {
        console.error('Error calculating balances:', error)
      } finally {
        setBalancesLoading(false)
      }
    }
    calculateBalances()
  }, [accounts])

  // Format balance as currency
  const formatBalance = (balance) => {
    try {
      if (balance === 0 || balance === null || balance === undefined) {
        return '₹0.00'
      }
      return `₹${balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    } catch (error) {
      console.error('Error formatting balance:', error)
      return '₹0.00'
    }
  }

  // Toggle expansion for an account
  const toggleExpand = (accountCode, e) => {
    e.stopPropagation()
    if (onExpandAccount) {
      onExpandAccount(accountCode)
    }
  }

  // Check if account has children loaded locally
  const hasChildren = (accountCode) => {
    return accounts.some((acc) => acc.parentCode === accountCode)
  }

  // Function to sort accounts hierarchically
  const sortAccountsHierarchically = (accountsList) => {
    const accountMap = new Map()
    const roots = []

    // Create a map for quick lookup
    accountsList.forEach((account) => {
      accountMap.set(account.code, { ...account, children: [] })
    })

    // Build the hierarchy
    accountsList.forEach((account) => {
      if (account.parentCode) {
        const parent = accountMap.get(account.parentCode)
        if (parent) {
          parent.children.push(accountMap.get(account.code))
        }
      } else {
        roots.push(accountMap.get(account.code))
      }
    })

    // Flatten the hierarchy for display with expansion logic
    const flattened = []
    const flatten = (node, level = 0) => {
      flattened.push({ ...node, level })

      // Only show children if this node is expanded
      if (expandedAccounts.includes(node.code)) {
        const stateForNode = loadingStates[node.code]
        if (stateForNode === 'loading') {
          flattened.push({
            id: `loading-${node.code}`,
            code: `loading-${node.code}`,
            name: `Loading accounts under ${node.code}...`,
            type: 'LOADING',
            parentCode: node.code,
            level: level + 1,
          })
        } else if (stateForNode === 'failed') {
          flattened.push({
            id: `failed-${node.code}`,
            code: `failed-${node.code}`,
            name: `Failed to load accounts. Click to retry.`,
            type: 'FAILED',
            parentCode: node.code,
            level: level + 1,
          })
        } else if (stateForNode === 'succeeded' && node.children.length === 0) {
          flattened.push({
            id: `empty-${node.code}`,
            code: `empty-${node.code}`,
            name: `No accounts found under this level`,
            type: 'EMPTY',
            parentCode: node.code,
            level: level + 1,
          })
        } else {
          node.children
            .sort((a, b) => a.code.localeCompare(b.code))
            .forEach((child) => flatten(child, level + 1))
        }
      }
    }

    roots.sort((a, b) => a.code.localeCompare(b.code)).forEach((root) => flatten(root))

    return flattened
  }

  // Step 1: always build hierarchy first
  const hierarchicalAccounts = sortAccountsHierarchically(accounts)

  // Step 2: apply search + filter on flattened list
  const filteredAccounts = hierarchicalAccounts.filter((account) => {
    const matchesSearch =
      searchTerm === '' ||
      account.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (account.parentAccount &&
        account.parentAccount.toLowerCase().includes(searchTerm.toLowerCase()))

    let matchesFilter = true
    switch (selectedFilter) {
      case 'root':
        matchesFilter = account.type === 'ROOT'
        break
      case 'folders':
        matchesFilter = account.type === 'FOLDER'
        break
      case 'subfolders':
        matchesFilter = account.type === 'SUB_FOLDER'
        break
      case 'accountsubcategories':
        matchesFilter = account.type === 'ACCOUNT_SUBCATEGORY'
        break
      case 'accounttypes':
        matchesFilter = account.type === 'ACCOUNT_TYPE'
        break
      case 'accounts':
        matchesFilter = account.type === 'ACCOUNT'
        break
      default:
        matchesFilter = true
    }

    return matchesSearch && matchesFilter
  })

  // Helpers for UI styling
  const getTypeColor = (type) => {
    switch (type) {
      case 'ROOT':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'FOLDER':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'SUB_FOLDER':
        return 'bg-amber-100 text-amber-800 border-amber-200'
      case 'ACCOUNT_SUBCATEGORY':
        return 'bg-pink-100 text-pink-800 border-pink-200'
      case 'ACCOUNT_TYPE':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'ACCOUNT':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'ROOT':
        return '🏛️'
      case 'FOLDER':
        return '📁'
      case 'SUB_FOLDER':
        return '📂'
      case 'ACCOUNT_SUBCATEGORY':
        return '🗂️'
      case 'ACCOUNT_TYPE':
        return '📋'
      case 'ACCOUNT':
        return '📄'
      default:
        return '📄'
    }
  }



  // Handle row click - opens modal for ALL types (including ACCOUNT)
  const handleRowClick = (account) => {
    if (['LOADING', 'EMPTY', 'FAILED'].includes(account.type)) {
      if (account.type === 'FAILED' && onExpandAccount) {
        onExpandAccount(account.parentCode)
      }
      return
    }
    // Open details/edit modal for all account types
    if (onAccountClick) {
      onAccountClick(account)
    }
  }

  // Handle "View Ledger" link click - navigates to ledger (ACCOUNT types only)
  const handleViewLedgerClick = (account, e) => {
    e.stopPropagation() // Prevent row click from triggering
    handleAccountClick(account)
  }

  // Updated handleAccountClick function with unified vendor detection
  const handleAccountClick = (account) => {
    if (account.type === 'ACCOUNT') {
      console.log('🔍 Clicked Account:', account.code, account.name)

      // QUICK ROUTE: Ensure Round Off revenue ledger opens correctly
      if (
        account.code === 'R2001001' ||
        (account.code && account.code.startsWith && account.code.startsWith('R2001001')) ||
        (account.name &&
          account.name.toLowerCase &&
          account.name.toLowerCase().includes('round off'))
      ) {
        console.log('🔎 Directly routing Round Off revenue ledger')
        navigate(`/dashboard/account-manager/revenue-ledger/${account.code}`)
        return
      }

      // ========================================
      // NON-VENDOR ACCOUNT CHECKS
      // ========================================

      const isRelieverPaymentAccount =
        account.code === 'X100101003' ||
        account.code === 'X1001001003' ||
        (account.code.startsWith('X10010100') && account.name.toLowerCase().includes('reliever'))

      const isConveyanceExpenseAccount =
        account.code === 'X2001003' ||
        (account.code.startsWith('X2001003') &&
          account.name.toLowerCase().includes('conveyance expense'))

      const isConveyancePayableAccount =
        account.code === 'L2001001' ||
        (account.code.startsWith('L2001001') &&
          account.name.toLowerCase().includes('conveyance payable'))

      const isEmployeeAccount =
        account.code.startsWith('A3002') || account.name.toLowerCase().includes('employee advance')

      // TDS Receivable Ledger (Current Asset — A3006001)
      const isTDSReceivableAccount =
        account.code === 'A3006001' ||
        (account.code.startsWith('A3006001') &&
          account.name.toLowerCase().includes('tds') &&
          account.name.toLowerCase().includes('receivable'))

      const isTDSAccount =
        (account.code.startsWith('L2003') ||
          account.code.includes('TDS') ||
          account.name.toLowerCase().includes('tds')) &&
        !isTDSReceivableAccount

      const isBankAccount =
        account.code.startsWith('A3004') ||
        account.name.toLowerCase().includes('bank') ||
        account.name.toLowerCase().includes('hdfc') ||
        account.name.toLowerCase().includes('sbi') ||
        account.name.toLowerCase().includes('icici')

      const isTravelExpenseAccount =
        account.code.startsWith('X1001002') ||
        (account.code.includes('X1001002') && account.name.toLowerCase().includes('travel'))

      const isFoodRefreshmentAccount =
        account.code.startsWith('X1001003') ||
        (account.code.includes('X1001003') && account.name.toLowerCase().includes('food'))

      const isOfficeSuppliesAccount =
        account.code.startsWith('X2001002001') ||
        (account.code.includes('X2001002') &&
          account.name.toLowerCase().includes('office supplies'))

      const isRentExpenseAccount =
        account.code.startsWith('X2001002002') ||
        (account.code.includes('X2001002') &&
          account.name.toLowerCase().includes('branch office rent'))

      const isHKMaterialExpenseAccount =
        account.code === 'X1001004001' ||
        account.code.startsWith('X1001004') ||
        (account.code.includes('X1001004') && account.name.toLowerCase().includes('hk material'))

      const isCGSTInputAccount =
        account.code === 'A300701001' || account.name.toLowerCase().includes('cgst input')

      const isSGSTInputAccount =
        account.code === 'A300701002' || account.name.toLowerCase().includes('sgst input')

      const isIGSTInputAccount =
        account.code === 'A300701003' || account.name.toLowerCase().includes('igst input')

      const isFixedAssetAccount =
        account.code === 'A1001' ||
        account.code === 'A1002' ||
        account.code === 'A1003' ||
        account.code === 'A1004' ||
        account.code === 'A1005' ||
        account.code === 'A1006' ||
        account.code === 'A1007' ||
        (account.code.startsWith('A100') &&
          (account.name.toLowerCase().includes('fa computers') ||
            account.name.toLowerCase().includes('fa furniture') ||
            account.name.toLowerCase().includes('fa motor cars') ||
            account.name.toLowerCase().includes('fa softwares') ||
            account.name.toLowerCase().includes('fa office equipment') ||
            account.name.toLowerCase().includes('fa building') ||
            account.name.toLowerCase().includes('fa machineries') ||
            account.name.toLowerCase().includes('fixed asset')))

      const isUniformPrepaidExpenseAccount =
        account.code === 'A3005001' ||
        (account.code.startsWith('A3005') &&
          account.name.toLowerCase().includes('uniform') &&
          account.name.toLowerCase().includes('prepaid'))

      const isUniformExpenseAccount =
        account.code === 'X2001004' ||
        (account.code.startsWith('X2001') &&
          account.name.toLowerCase().includes('uniform expense') &&
          !account.name.toLowerCase().includes('prepaid'))

      // ADD THIS CHECK FOR SALARY EXPENSE
      const isSalaryExpenseAccount =
        account.code === 'X2001001001' || // Exact match
        (account.code.startsWith('X2001001001') && // Starts with exact code
          account.name.toLowerCase().includes('salary') &&
          !account.name.toLowerCase().includes('pf'))

      // ADD THIS CHECK FOR SALARY PAYABLE LIABILITY (GL Code: L2002001)
      const isSalaryPayableAccount =
        account.code === 'L2002001' ||
        account.code.startsWith('L2002001') ||
        (account.code.includes('L2002001') &&
          account.name.toLowerCase().includes('salary') &&
          account.name.toLowerCase().includes('payable'))
      //Employeer
      const isPFContributionAccount =
        account.code === 'X2001001002' || // Exact match
        (account.code.startsWith('X2001001002') && // Starts with exact code
          (account.name.toLowerCase().includes('pf') ||
            account.name.toLowerCase().includes('provident') ||
            account.name.toLowerCase().includes('employer')))

      //PF Payable:- Employeer
      const isPFPayableAccount =
        account.code === 'L2002002' ||
        account.code.startsWith('L2002002') ||
        (account.code.includes('L2002002') &&
          account.name.toLowerCase().includes('pf') &&
          account.name.toLowerCase().includes('payable'))

      //ESIC Employeer
      const isESICContributionAccount =
        account.code === 'X2001001003' ||
        account.code.startsWith('X2001001003') ||
        (account.code.includes('2001001003') &&
          (account.name.toLowerCase().includes('esic') ||
            account.name.toLowerCase().includes('esi') ||
            (account.name.toLowerCase().includes('employer') &&
              account.name.toLowerCase().includes('contribution'))))

      //ESIC employeer Liabilty
      const isESICPayableAccount =
        account.code === 'L2002003' ||
        account.code.startsWith('L2002003') ||
        (account.code.includes('L2002') &&
          account.name.toLowerCase().includes('esic') &&
          account.name.toLowerCase().includes('payable'))

      //LWF Employeer Expense
      const isLWFContributionAccount =
        account.code === 'X2001001004' ||
        account.code.startsWith('X2001001004') ||
        (account.code.includes('2001001004') &&
          (account.name.toLowerCase().includes('lwf') ||
            account.name.toLowerCase().includes('labour') ||
            account.name.toLowerCase().includes('welfare') ||
            (account.name.toLowerCase().includes('employer') &&
              account.name.toLowerCase().includes('contribution'))))

      //LWF employeer Liability
      const isLWFPayableAccount =
        account.code === 'L2002004' ||
        (account.code.startsWith('L2002004') &&
          account.name.toLowerCase().includes('lwf') &&
          account.name.toLowerCase().includes('payable') &&
          account.name.toLowerCase().includes('employer'))

      //Leave Provision Expense Account
      const isLeaveProvisionExpenseAccount =
        account.code === 'X2001001005' ||
        (account.code.startsWith('X2001001005') &&
          account.name.toLowerCase().includes('leave') &&
          account.name.toLowerCase().includes('provision'))

      //Leave Provision Encashment Liability Account
      const isLeaveEncashmentProvisionAccount =
        account.code === 'L2002005' ||
        (account.code.startsWith('L2002005') &&
          account.name.toLowerCase().includes('provision') &&
          account.name.toLowerCase().includes('leave encashment'))

      //Other Deductions Expense Ledger
      const isOtherDeductionsExpenseAccount =
        account.code === 'X2001001006' ||
        (account.code.startsWith('X2001001006') &&
          account.name.toLowerCase().includes('other deductions'))

      //Liability Employee PF
      const isEmployeePFPayableAccount =
        account.code === 'L2002006' ||
        (account.code.startsWith('L2002006') &&
          account.name.toLowerCase().includes('employee contribution') &&
          account.name.toLowerCase().includes('pf'))

      //Liability employee ESIC
      const isEmployeeESICPayableAccount =
        account.code === 'L2002007' ||
        (account.code.startsWith('L2002007') &&
          account.name.toLowerCase().includes('esic') &&
          account.name.toLowerCase().includes('employee'))

      //Liability Employee LWF
      const isEmployeeLWFPayableAccount =
        account.code === 'L2002008' ||
        (account.code.startsWith('L2002008') &&
          account.name.toLowerCase().includes('lwf') &&
          account.name.toLowerCase().includes('employee'))

      //Liability PT Employee Share
      const isProfessionalTaxPayableAccount =
        account.code === 'L2002009' ||
        (account.code.startsWith('L2002009') &&
          (account.name.toLowerCase().includes('pt') ||
            account.name.toLowerCase().includes('professional tax')) &&
          account.name.toLowerCase().includes('employee'))

      //Bonus Expense Ledger
      const isBonusExpenseLedger =
        account.code === 'X2001001007' ||
        (account.code.startsWith('X2001001007') && account.name.toLowerCase().includes('bonus'))

      //=============================================
      // Professional Fess and Other Fees Ledger
      //=============================================
      //=============================================
      // Professional Fees and Other Fees Ledger
      //=============================================

      const isProfessionalFeesAccount =
        account.code === 'X2002002002' ||
        (account.code.startsWith('X2002002002') &&
          account.name.toLowerCase().includes('professional fees'))

      const isOtherFeesAccount =
        account.code === 'X2002002003' ||
        (account.code.startsWith('X2002002003') &&
          account.name.toLowerCase().includes('other fees'))

      //=============================================
      // BILLING LEDGERS (11 Ledgers)
      //=============================================

      // Primary Posting Ledgers
      const isHouseKeepingChargesAccount =
        account.code === 'X5000' ||
        (account.code.startsWith('X5000') && account.name.toLowerCase().includes('housekeeping'))

      const isManpowerServicesAccount =
        account.code === 'X5100' ||
        (account.code.startsWith('X5100') && account.name.toLowerCase().includes('manpower'))

      const isHKMaterialAccount =
        account.code === 'X5200' ||
        (account.code.startsWith('X5200') &&
          (account.name.toLowerCase().includes('hk material') ||
            account.name.toLowerCase().includes('cleaning consumable')))

      const isRentOnMachineryAccount =
        account.code === 'X5400' ||
        (account.code.startsWith('X5400') && account.name.toLowerCase().includes('machinery'))

      // GST Statutory Ledgers
      const isCGSTPayableAccount =
        account.code === 'L3001' ||
        (account.code.startsWith('L3001') &&
          account.name.toLowerCase().includes('cgst') &&
          account.name.toLowerCase().includes('payable'))

      const isSGSTPayableAccount =
        account.code === 'L3002' ||
        (account.code.startsWith('L3002') &&
          account.name.toLowerCase().includes('sgst') &&
          account.name.toLowerCase().includes('payable'))

      const isIGSTPayableAccount =
        account.code === 'L3003' ||
        (account.code.startsWith('L3003') &&
          account.name.toLowerCase().includes('igst') &&
          account.name.toLowerCase().includes('payable'))

      // TDS Statutory Ledgers
      const isTDSPayable194CAccount =
        account.code === 'L3101' ||
        (account.code.startsWith('L3101') &&
          account.name.toLowerCase().includes('tds') &&
          account.name.toLowerCase().includes('payable') &&
          account.name.toLowerCase().includes('194c'))

      const isTDSReceivable194JAccount =
        account.code === 'L3102' ||
        (account.code.startsWith('L3102') &&
          account.name.toLowerCase().includes('tds') &&
          account.name.toLowerCase().includes('receivable') &&
          account.name.toLowerCase().includes('194j'))

      // Other Statutory Ledgers
      const isServiceTaxPayableAccount =
        account.code === 'L3004' ||
        (account.code.startsWith('L3004') &&
          account.name.toLowerCase().includes('service tax') &&
          account.name.toLowerCase().includes('payable'))

      const isRoundOffAccount =
        account.code === 'X9999' ||
        (account.code.startsWith('X9999') && account.name.toLowerCase().includes('round off'))

      // ========================================
      // CLIENT LEDGERS (Sundry Debtors - A3003001)
      // ========================================

      // Client accounts start with 'D' prefix (D001, D002, etc.)
      const isClientAccount =
        account.code.startsWith('D') ||
        (account.parentCode === 'A3003001' && account.type === 'ACCOUNT') ||
        (account.name.toLowerCase().includes('client') && account.code.startsWith('D'))

      // ========================================
      // REVENUE LEDGERS (Income - R1001)
      // ========================================

      // House Keeping Charges Revenue
      const isHouseKeepingRevenueAccount =
        account.code === 'R1001001' ||
        (account.code.startsWith('R1001001') &&
          account.name.toLowerCase().includes('house keeping'))

      // House Keeping Charges (Exempt) Revenue
      const isHouseKeepingExemptRevenueAccount =
        account.code === 'R1001002' ||
        (account.code.startsWith('R1001002') &&
          account.name.toLowerCase().includes('house keeping') &&
          account.name.toLowerCase().includes('exempt'))

      // Service Charges Revenue
      const isServiceChargesRevenueAccount =
        account.code === 'R1001003' ||
        (account.code.startsWith('R1001003') &&
          account.name.toLowerCase().includes('service charges'))

      // Overseas Consultancy Service Fees (Export) Revenue
      const isOverseasConsultancyRevenueAccount =
        account.code === 'R1001004' ||
        (account.code.startsWith('R1001004') &&
          account.name.toLowerCase().includes('overseas consultancy'))

      // HK Material Revenue
      const isHKMaterialRevenueAccount =
        account.code === 'R1001005001' ||
        (account.code.startsWith('R1001005001') &&
          account.name.toLowerCase().includes('hk material'))

      // Cleaning Consumable Revenue
      const isCleaningConsumableRevenueAccount =
        account.code === 'R1001005002' ||
        (account.code.startsWith('R1001005002') &&
          account.name.toLowerCase().includes('cleaning consumable'))

      // Deep Cleaning Charges Revenue
      const isDeepCleaningRevenueAccount =
        account.code === 'R1001007' ||
        (account.code.startsWith('R1001007') &&
          account.name.toLowerCase().includes('deep cleaning'))

      // Rent on Machinery Revenue
      const isRentOnMachineryRevenueAccount =
        account.code === 'R1001008' ||
        (account.code.startsWith('R1001008') &&
          account.name.toLowerCase().includes('rent on machinery'))

      // Manpower Services Revenue
      const isManpowerServicesRevenueAccount =
        account.code === 'R1001009' ||
        (account.code.startsWith('R1001009') && account.name.toLowerCase().includes('manpower'))

      // Pest Control Charges Revenue
      const isPestControlRevenueAccount =
        account.code === 'R1001010' ||
        (account.code.startsWith('R1001010') && account.name.toLowerCase().includes('pest control'))

      // Round Off Revenue (master-level round off ledger)
      const isRoundOffRevenueAccount =
        account.code === 'R2001001' ||
        (account.code.startsWith('R2001001') && account.name.toLowerCase().includes('round off'))

      // ========================================
      // ✅ UNIFIED VENDOR ACCOUNT CHECK
      // ========================================

      // ANY account under L2005 is a vendor - route to unified vendor ledger
      const isVendorAccount =
        account.code.startsWith('L2005') ||
        account.parentCode === 'L2005' ||
        (account.name.toUpperCase().includes('VENDOR') && account.code.startsWith('L2005'))

      console.log('🎯 Account Classification:', {
        code: account.code,
        name: account.name,
        parentCode: account.parentCode,
        isVendorAccount,
        isEmployeeAccount,
        isBankAccount,
        isFixedAssetAccount,
      })

      // ========================================
      // ROUTING LOGIC (Non-Vendor First, Then Vendor)
      // ========================================

      // Non-vendor accounts first
      if (isRelieverPaymentAccount) {
        console.log('✅ Navigating to Reliever Payment Page')
        navigate(`/dashboard/account-manager/reliever-payment-page`)
      } else if (isConveyanceExpenseAccount) {
        console.log('✅ Navigating to Conveyance Expense Ledger')
        navigate(`/dashboard/account-manager/conveyance-expense-ledger`)
      } else if (isConveyancePayableAccount) {
        console.log('✅ Navigating to Conveyance Payable Ledger')
        navigate(`/dashboard/account-manager/conveyance-payable-ledger`)
      } else if (isEmployeeAccount) {
        console.log('✅ Navigating to Employee Ledger')
        navigate(`/dashboard/account-manager/ledger/${account.code}`)
      } else if (isFixedAssetAccount) {
        console.log('✅ Navigating to Fixed Asset Ledger:', account.code)
        navigate(`/dashboard/account-manager/fixed-asset-ledger/${account.code}`)
      } else if (isTDSAccount) {
        const sectionCode = account.code.replace('L2003', '').replace(/^0+/, '') || '194C'
        console.log('✅ Navigating to TDS Ledger')
        navigate(`/dashboard/account-manager/tds-ledger/${sectionCode}`)
      } else if (isBankAccount) {
        console.log('✅ Navigating to Bank Ledger')
        navigate(`/dashboard/account-manager/bank-ledger/${account.code}`)
      } else if (isTravelExpenseAccount) {
        console.log('✅ Navigating to Travel Expense Ledger:', account.code)
        navigate(`/dashboard/account-manager/travel-expense-ledger/${account.code}`)
      } else if (isFoodRefreshmentAccount) {
        console.log('✅ Navigating to Food & Refreshment Ledger:', account.code)
        navigate(`/dashboard/account-manager/food-refreshment-ledger/${account.code}`)
      } else if (isOfficeSuppliesAccount) {
        console.log('✅ Navigating to Office Supplies Ledger:', account.code)
        navigate(`/dashboard/account-manager/office-supplies-ledger/${account.code}`)
      } else if (isRentExpenseAccount) {
        console.log('✅ Navigating to Rent Expense Ledger')
        navigate(`/dashboard/account-manager/rent-expense-account`)
      } else if (isCGSTInputAccount) {
        console.log('✅ Navigating to CGST Input Ledger')
        navigate(`/dashboard/account-manager/cgst-input-ledger`)
      } else if (isSGSTInputAccount) {
        console.log('✅ Navigating to SGST Input Ledger')
        navigate(`/dashboard/account-manager/sgst-input-ledger`)
      } else if (isIGSTInputAccount) {
        console.log('✅ Navigating to IGST Input Ledger')
        navigate(`/dashboard/account-manager/igst-input-ledger`)
      } else if (isUniformExpenseAccount) {
        console.log('✅ Navigating to Uniform Expense Ledger')
        navigate(`/dashboard/account-manager/uniform-expense-ledger`)
      } else if (isUniformPrepaidExpenseAccount) {
        console.log('✅ Navigating to Uniform Prepaid Expense Ledger')
        navigate(`/dashboard/account-manager/fa-uniform-expense`)
      } else if (isSalaryExpenseAccount) {
        console.log('✅ Navigating to Salary Expense Ledger')
        navigate(`/dashboard/account-manager/salary-expense-ledger`)
      } else if (isSalaryPayableAccount) {
        console.log('✅ Navigating to Salary Payable Ledger (Liability Account)')
        navigate(`/dashboard/account-manager/salary-payable-ledger`)
      } else if (isPFContributionAccount) {
        console.log('✅ Navigating to Employer PF Contribution Ledger')
        navigate(`/dashboard/account-manager/pf-contribution-ledger`)
      } else if (isPFPayableAccount) {
        console.log('✅ Navigating to PF Payable Liability Ledger')
        navigate(`/dashboard/account-manager/pf-payable-ledger`)
      } else if (isEmployeeESICPayableAccount) {
        console.log('✅ Navigating to Employee ESIC Payable Ledger')
        navigate(`/dashboard/account-manager/employee-esic-payable-ledger`)
      } else if (isESICContributionAccount) {
        console.log('✅ Navigating to Employer ESIC Contribution Ledger')
        navigate(`/dashboard/account-manager/esic-contribution-ledger`)
      } else if (isESICPayableAccount) {
        console.log('✅ Navigating to Employer ESIC Payable Liability Ledger')
        navigate(`/dashboard/account-manager/esic-payable-ledger`)
      } else if (isLWFContributionAccount) {
        console.log('✅ Navigating to Employer LWF Contribution Ledger')
        navigate(`/dashboard/account-manager/lwf-contribution-ledger`)
      } else if (isLWFPayableAccount) {
        console.log('✅ Navigating to LWF Payable - Employer Share Ledger')
        navigate(`/dashboard/account-manager/lwf-payable-ledger`)
      } else if (isLeaveProvisionExpenseAccount) {
        console.log('✅ Navigating to Leave Provision Expense Ledger')
        navigate(`/dashboard/account-manager/leave-provision-ledger`)
      } else if (isLeaveEncashmentProvisionAccount) {
        console.log('✅ Navigating to Leave Encashment Provision Ledger')
        navigate(`/dashboard/account-manager/leave-encashment-provision-ledger`)
      } else if (isOtherDeductionsExpenseAccount) {
        console.log('✅ Navigating to Other Deductions Expense Ledger')
        navigate(`/dashboard/account-manager/other-deductions-ledger`)
      } else if (isEmployeePFPayableAccount) {
        console.log('✅ Navigating to Employee PF Payable Ledger')
        navigate(`/dashboard/account-manager/employee-pf-payable-ledger`)
      } else if (isEmployeeLWFPayableAccount) {
        console.log('✅ Navigating to Employee LWF Payable Ledger')
        navigate(`/dashboard/account-manager/employee-lwf-payable-ledger`)
      } else if (isProfessionalTaxPayableAccount) {
        console.log('✅ Navigating to Professional Tax Payable Ledger')
        navigate(`/dashboard/account-manager/professional-tax-payable-ledger`)
      } else if (isBonusExpenseLedger) {
        console.log('✅ Navigating to Professional Tax Payable Ledger')
        navigate(`/dashboard/account-manager/bonus-expense-ledger`)
      } else if (isTDSReceivableAccount) {
        console.log('✅ Navigating to TDS Receivable Ledger (A3006001)')
        navigate(`/dashboard/account-manager/tds-receivable-ledger`)
      } else if (isVendorAccount) {
        // ✅ UNIFIED VENDOR ROUTING - ALL L2005* vendors go here
        console.log('✅ Navigating to UNIFIED Vendor Ledger:', account.code)
        console.log('   - This ledger will show ALL transactions (HK, FA, Uniform, Rent, etc.)')
        navigate(`/dashboard/account-manager/vendor-ledger/${account.code}`)
      } else if (isHKMaterialExpenseAccount) {
        console.log('✅ Navigating to HK Materials Expense Ledger')
        navigate(`/dashboard/account-manager/hk-materials-expense-ledger`)
      } else if (isProfessionalFeesAccount) {
        console.log('✅ Navigating to Professional Fees Ledger')
        navigate(`/dashboard/account-manager/expense-ledger/X2002002002`)
      } else if (isOtherFeesAccount) {
        console.log('✅ Navigating to Other Fees Ledger')
        navigate(`/dashboard/account-manager/expense-ledger/X2002002003`)
      }
      // ========================================
      // BILLING LEDGERS ROUTING (11 Ledgers)
      // ========================================
      else if (isHouseKeepingChargesAccount) {
        console.log('✅ Navigating to House Keeping Charges Ledger (X5000)')
        navigate(`/dashboard/account-manager/billing-ledger/hk-charges`)
      } else if (isManpowerServicesAccount) {
        console.log('✅ Navigating to Manpower Services Ledger (X5100)')
        navigate(`/dashboard/account-manager/billing-ledger/manpower-services`)
      } else if (isHKMaterialAccount) {
        console.log('✅ Navigating to HK Material Ledger (X5200)')
        navigate(`/dashboard/account-manager/billing-ledger/hk-material`)
      } else if (isRentOnMachineryAccount) {
        console.log('✅ Navigating to Rent on Machinery Ledger (X5400)')
        navigate(`/dashboard/account-manager/billing-ledger/machinery-rent`)
      } else if (isCGSTPayableAccount) {
        console.log('✅ Navigating to CGST Payable Ledger (L3001)')
        navigate(`/dashboard/account-manager/billing-ledger/cgst-payable`)
      } else if (isSGSTPayableAccount) {
        console.log('✅ Navigating to SGST Payable Ledger (L3002)')
        navigate(`/dashboard/account-manager/billing-ledger/sgst-payable`)
      } else if (isIGSTPayableAccount) {
        console.log('✅ Navigating to IGST Payable Ledger (L3003)')
        navigate(`/dashboard/account-manager/billing-ledger/igst-payable`)
      } else if (isTDSPayable194CAccount) {
        console.log('✅ Navigating to TDS Payable 194C Ledger (L3101)')
        navigate(`/dashboard/account-manager/billing-ledger/tds-payable-194c`)
      } else if (isTDSReceivable194JAccount) {
        console.log('✅ Navigating to TDS Receivable 194J Ledger (L3102)')
        navigate(`/dashboard/account-manager/billing-ledger/tds-receivable-194j`)
      } else if (isServiceTaxPayableAccount) {
        console.log('✅ Navigating to Service Tax Payable Ledger (L3004)')
        navigate(`/dashboard/account-manager/billing-ledger/service-tax-payable`)
      } else if (isRoundOffAccount) {
        console.log('✅ Navigating to Round Off Ledger (X9999)')
        navigate(`/dashboard/account-manager/billing-ledger/round-off`)
      }
      // ========================================
      // CLIENT LEDGERS ROUTING
      // ========================================
      else if (isClientAccount) {
        console.log('✅ Navigating to Client Ledger:', account.code)
        navigate(`/dashboard/account-manager/client-ledger/${account.code}`)
      }
      // ========================================
      // REVENUE LEDGERS ROUTING
      // ========================================
      else if (isHouseKeepingRevenueAccount) {
        console.log('✅ Navigating to House Keeping Charges Revenue Ledger (R1001001)')
        navigate(`/dashboard/account-manager/revenue-ledger/${account.code}`)
      } else if (isHouseKeepingExemptRevenueAccount) {
        console.log('✅ Navigating to House Keeping Charges (Exempt) Revenue Ledger (R1001002)')
        navigate(`/dashboard/account-manager/revenue-ledger/${account.code}`)
      } else if (isServiceChargesRevenueAccount) {
        console.log('✅ Navigating to Service Charges Revenue Ledger (R1001003)')
        navigate(`/dashboard/account-manager/revenue-ledger/${account.code}`)
      } else if (isOverseasConsultancyRevenueAccount) {
        console.log('✅ Navigating to Overseas Consultancy Revenue Ledger (R1001004)')
        navigate(`/dashboard/account-manager/revenue-ledger/${account.code}`)
      } else if (isHKMaterialRevenueAccount) {
        console.log('✅ Navigating to HK Material Revenue Ledger (R1001005001)')
        navigate(`/dashboard/account-manager/revenue-ledger/${account.code}`)
      } else if (isCleaningConsumableRevenueAccount) {
        console.log('✅ Navigating to Cleaning Consumable Revenue Ledger (R1001005002)')
        navigate(`/dashboard/account-manager/revenue-ledger/${account.code}`)
      } else if (isDeepCleaningRevenueAccount) {
        console.log('✅ Navigating to Deep Cleaning Revenue Ledger (R1001007)')
        navigate(`/dashboard/account-manager/revenue-ledger/${account.code}`)
      } else if (isRentOnMachineryRevenueAccount) {
        console.log('✅ Navigating to Rent on Machinery Revenue Ledger (R1001008)')
        navigate(`/dashboard/account-manager/revenue-ledger/${account.code}`)
      } else if (isManpowerServicesRevenueAccount) {
        console.log('✅ Navigating to Manpower Services Revenue Ledger (R1001009)')
        navigate(`/dashboard/account-manager/revenue-ledger/${account.code}`)
      } else if (isPestControlRevenueAccount) {
        console.log('✅ Navigating to Pest Control Revenue Ledger (R1001010)')
        navigate(`/dashboard/account-manager/revenue-ledger/${account.code}`)
      } else if (isRoundOffRevenueAccount) {
        console.log('✅ Navigating to Round Off Revenue Ledger (R2001001)')
        navigate(`/dashboard/account-manager/revenue-ledger/${account.code}`)
      } else {
        console.log('✅ Navigating to Generic Ledger')
        navigate(`/dashboard/account-manager/ledger/${account.code}`)
      }
    } else {
      if (onAccountClick) {
        onAccountClick(account)
      }
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Chart of Accounts Table</h2>
        <p className="text-sm text-gray-600 mt-1">
          Hierarchical listing of all accounts with hierarchy information
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">
                Account Code
              </th>
              <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">
                Account Name
              </th>
              <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">Type</th>
              <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">Parent</th>
              <th className="text-right py-3 px-6 text-sm font-medium text-gray-700">Balance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredAccounts.length > 0 ? (
              filteredAccounts.map((account, index) => {
                if (account.type === 'LOADING') {
                  return (
                    <tr key={account.id} className="bg-gray-50/50">
                      <td colSpan="5" className="py-3 px-6 text-sm text-gray-500 italic">
                        <div className="flex items-center gap-2" style={{ marginLeft: `${account.level * 20}px` }}>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-emerald-500 border-t-transparent"></div>
                          <span>Loading accounts...</span>
                        </div>
                      </td>
                    </tr>
                  )
                }

                if (account.type === 'EMPTY') {
                  return (
                    <tr key={account.id} className="bg-gray-50/50">
                      <td colSpan="5" className="py-3 px-6 text-sm text-gray-400 italic">
                        <div className="flex items-center gap-2" style={{ marginLeft: `${account.level * 20}px` }}>
                          <span>📂 No accounts under this level</span>
                        </div>
                      </td>
                    </tr>
                  )
                }

                if (account.type === 'FAILED') {
                  return (
                    <tr
                      key={account.id}
                      className="bg-red-50/40 hover:bg-red-50/80 cursor-pointer"
                      onClick={() => onExpandAccount && onExpandAccount(account.parentCode)}
                    >
                      <td colSpan="5" className="py-3 px-6 text-sm text-red-600 font-medium">
                        <div className="flex items-center gap-2" style={{ marginLeft: `${account.level * 20}px` }}>
                          <span>⚠️ Failed to load. Click to retry.</span>
                        </div>
                      </td>
                    </tr>
                  )
                }

                return (
                  <tr
                    key={account.id || index}
                    className={`hover:bg-gray-50 cursor-pointer transition-colors ${account.type === 'ROOT' ? 'bg-blue-50' : ''
                      } ${account.type === 'ACCOUNT' ? 'hover:bg-indigo-50' : ''}`}
                    onClick={() => handleRowClick(account)}
                  >
                    <td className="py-3 px-6 text-sm">
                      <div className="flex items-center gap-2">
                        {/* Expand/Collapse Arrow - Only for accounts with children or lazy-loading chevrons */}
                        {account.type !== 'ACCOUNT' && (account.hasChildren !== false || hasChildren(account.code)) && (
                          <button
                            onClick={(e) => toggleExpand(account.code, e)}
                            className="text-gray-600 hover:text-gray-900 focus:outline-none flex items-center justify-center"
                          >
                            {expandedAccounts.includes(account.code) ? (
                              <FiChevronDown className="w-4 h-4" />
                            ) : (
                              <FiChevronRight className="w-4 h-4" />
                            )}
                          </button>
                        )}
                        {/* Placeholder for alignment when no arrow */}
                        {(account.type === 'ACCOUNT' || (account.hasChildren === false && !hasChildren(account.code))) && (
                          <div className="w-4"></div>
                        )}
                        <span className="font-mono text-gray-900">{account.code}</span>
                      </div>
                    </td>
                    <td className="py-3 px-6 text-sm">
                      <div className="flex items-center gap-2">
                        <span
                          style={{ marginLeft: `${account.level * 20}px` }}
                          className="flex items-center gap-2"
                        >
                          <span className="text-lg">{getTypeIcon(account.type)}</span>
                          <span
                            className={`text-gray-900 ${account.type === 'ROOT'
                                ? 'font-bold text-blue-900'
                                : account.type === 'FOLDER'
                                  ? 'font-medium'
                                  : account.type === 'SUB_FOLDER'
                                    ? 'font-medium text-amber-700'
                                    : account.type === 'ACCOUNT_SUBCATEGORY'
                                      ? 'font-medium text-pink-700'
                                      : account.type === 'ACCOUNT_TYPE'
                                        ? 'font-medium text-purple-700'
                                        : ''
                              }`}
                          >
                            {account.name}
                          </span>
                          {account.type === 'ACCOUNT' && (
                            <button
                              onClick={(e) => handleViewLedgerClick(account, e)}
                              className="text-xs text-indigo-600 hover:text-indigo-800 hover:underline ml-2 transition-colors"
                            >
                              → View Ledger
                            </button>
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-6 text-sm">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-md border ${getTypeColor(
                          account.type
                        )}`}
                      >
                        {account.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-sm">
                      <span className="text-gray-600 text-xs">{account.parentAccount || 'None'}</span>
                    </td>
                    <td className="py-3 px-6 text-sm text-right">
                      {balancesLoading ? (
                        <div className="flex items-center justify-end gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                          <span className="text-gray-400 text-xs">Loading...</span>
                        </div>
                      ) : (
                        <span
                          className={`font-mono font-medium ${balances[account.code] > 0
                              ? 'text-green-700'
                              : balances[account.code] < 0
                                ? 'text-red-700'
                                : 'text-gray-600'
                            }`}
                        >
                          {formatBalance(balances[account.code])}
                        </span>
                      )}
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan="5" className="py-8 px-6 text-center text-gray-500">
                  No accounts found matching your criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filteredAccounts.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-600">Showing {filteredAccounts.length} accounts</p>
        </div>
      )}
    </div>
  )
}

export default AccountsTable

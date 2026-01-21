/* eslint-disable no-unused-vars */
import { RouterProvider } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import { router } from './Routes/Route.jsx'
import { useEffect } from 'react'
import { INITIAL_CHART_OF_ACCOUNTS } from './data/ChartOfAccounts'
import { INITIAL_TRANSACTIONS } from './data/Transactions.js'
import { initializeClientAccounts } from './Features/Master/Billing Masters/Client Ledgers/data/clientAccountsInit'
import { initializeABCMallLedger } from './Features/Master/Billing Masters/Client Ledgers/data/clientLedgerData'
import { initializeHouseKeepingRevenueLedger } from './Features/Master/Billing Masters/Revenue Ledger/data/houseKeepingRevenueData'
import { initializeHouseKeepingExemptRevenueLedger } from './Features/Master/Billing Masters/Revenue Ledger/data/houseKeepingExemptRevenueData'
import { initializeServiceChargesRevenueLedger } from './Features/Master/Billing Masters/Revenue Ledger/data/serviceChargesRevenueData'
import { initializeOverseasConsultancyRevenueLedger } from './Features/Master/Billing Masters/Revenue Ledger/data/overseasConsultancyRevenueData'
import { initializeHKMaterialRevenueLedger } from './Features/Master/Billing Masters/Revenue Ledger/data/hkMaterialRevenueData'
import { initializeCleaningConsumableRevenueLedger } from './Features/Master/Billing Masters/Revenue Ledger/data/cleaningConsumableRevenueData'
import { initializeDeepCleaningRevenueLedger } from './Features/Master/Billing Masters/Revenue Ledger/data/deepCleaningRevenueData'
import { initializeRentOnMachineryRevenueLedger } from './Features/Master/Billing Masters/Revenue Ledger/data/rentOnMachineryRevenueData'
import { initializeManpowerServicesRevenueLedger } from './Features/Master/Billing Masters/Revenue Ledger/data/manpowerServicesRevenueData'
import { initializePestControlRevenueLedger } from './Features/Master/Billing Masters/Revenue Ledger/data/pestControlRevenueData'
import { initializeRoundOffRevenueLedger } from './Features/Master/Billing Masters/Revenue Ledger/data/roundOffRevenueData'

function App() {
  // Application Version for Migration Management
  const APP_VERSION = '1.0.0'

  /**
   * Syncs Chart of Accounts between code and localStorage
   * - Adds new accounts from code to localStorage
   * - Updates existing accounts if code version is newer
   * - Preserves user-created accounts in localStorage
   */
  const syncChartOfAccounts = () => {
    try {
      const storedAccounts = JSON.parse(localStorage.getItem('chartOfAccounts') || '[]')
      const codeAccounts = INITIAL_CHART_OF_ACCOUNTS

      // Create a map for quick lookup
      const storedMap = new Map(storedAccounts.map((acc) => [acc.code, acc]))
      const codeMap = new Map(codeAccounts.map((acc) => [acc.code, acc]))

      let merged = [...storedAccounts]
      let hasChanges = false

      // Add or update accounts from code
      codeAccounts.forEach((codeAccount) => {
        const existingIndex = merged.findIndex((acc) => acc.code === codeAccount.code)

        if (existingIndex === -1) {
          // New account from code - add it
          merged.push(codeAccount)
          hasChanges = true
          console.log(`➕ Added new account: ${codeAccount.code} - ${codeAccount.name}`)
        } else {
          // Account exists - update if code version is different
          const existing = merged[existingIndex]
          const needsUpdate =
            existing.name !== codeAccount.name ||
            existing.type !== codeAccount.type ||
            existing.parentAccount !== codeAccount.parentAccount ||
            existing.parentCode !== codeAccount.parentCode

          if (needsUpdate) {
            merged[existingIndex] = {
              ...existing,
              ...codeAccount,
              // Preserve any dynamic fields (like balances) that might exist
              balance: existing.balance,
            }
            hasChanges = true
            console.log(`🔄 Updated account: ${codeAccount.code} - ${codeAccount.name}`)
          }
        }
      })

      // Check for accounts in localStorage that aren't in code (user-created)
      storedAccounts.forEach((storedAccount) => {
        if (!codeMap.has(storedAccount.code)) {
          console.log(
            `👤 User-created account preserved: ${storedAccount.code} - ${storedAccount.name}`
          )
        }
      })

      if (hasChanges) {
        localStorage.setItem('chartOfAccounts', JSON.stringify(merged))
        console.log('✅ Chart of Accounts synchronized')
        return { success: true, changes: true }
      } else {
        console.log('✅ Chart of Accounts already in sync')
        return { success: true, changes: false }
      }
    } catch (error) {
      console.error('❌ Error syncing Chart of Accounts:', error)
      return { success: false, error }
    }
  }

  /**
   * Syncs Transactions between code and localStorage
   * - Adds new transactions from code to localStorage
   * - Preserves all user-created transactions
   * - Updates transactions if they have the same ID but different data
   */
  const syncTransactions = () => {
    try {
      const storedTransactions = JSON.parse(localStorage.getItem('transactions') || '[]')
      const codeTransactions = INITIAL_TRANSACTIONS

      // Create a map for quick lookup by transaction ID
      const storedMap = new Map(storedTransactions.map((txn) => [txn.id, txn]))

      let merged = [...storedTransactions]
      let hasChanges = false

      // Add or update transactions from code
      codeTransactions.forEach((codeTxn) => {
        const existingIndex = merged.findIndex((txn) => txn.id === codeTxn.id)

        if (existingIndex === -1) {
          // New transaction from code - add it
          merged.push(codeTxn)
          hasChanges = true
          console.log(`➕ Added new transaction: ${codeTxn.voucherNo}`)
        } else {
          // Transaction exists - update if code version is different
          const existing = merged[existingIndex]
          const needsUpdate = JSON.stringify(existing) !== JSON.stringify(codeTxn)

          if (needsUpdate) {
            merged[existingIndex] = codeTxn
            hasChanges = true
            console.log(`🔄 Updated transaction: ${codeTxn.voucherNo}`)
          }
        }
      })

      // Sort transactions by date (newest first)
      merged.sort((a, b) => {
        const dateA = new Date(a.date || a.transactionDate)
        const dateB = new Date(b.date || b.transactionDate)
        return dateB - dateA
      })

      if (hasChanges) {
        localStorage.setItem('transactions', JSON.stringify(merged))
        console.log('✅ Transactions synchronized')
        return { success: true, changes: true }
      } else {
        console.log('✅ Transactions already in sync')
        return { success: true, changes: false }
      }
    } catch (error) {
      console.error('❌ Error syncing Transactions:', error)
      return { success: false, error }
    }
  }

  // Local Storage Initialization - Enhanced with Accounting Modules
  useEffect(() => {
    try {
      // Check version and handle migrations
      const storedVersion = localStorage.getItem('appVersion')
      if (storedVersion && storedVersion !== APP_VERSION) {
        console.log(`🔄 Upgrading from ${storedVersion} to ${APP_VERSION}`)
        // Handle data migration here if needed
      }
      localStorage.setItem('appVersion', APP_VERSION)

      // ========================================
      // 0. SYNC CHART OF ACCOUNTS & TRANSACTIONS
      // ========================================
      console.log('🔄 Starting data synchronization...')
      const accountsSync = syncChartOfAccounts()
      const transactionsSync = syncTransactions()

      if (accountsSync.changes || transactionsSync.changes) {
        toast.info('Data synchronized with latest version', {
          position: 'top-center',
          autoClose: 2000,
        })
      }

      // ========================================
      // 1. INITIALIZE USERS (Enhanced Structure)
      // ========================================
      const existingUsers = localStorage.getItem('users')
      let users
      if (
        !existingUsers ||
        !JSON.parse(existingUsers).some((user) => user.role === 'payroll-team')
      ) {
        users = [
          // Employees
          {
            username: 'emp1',
            role: 'employee',
            empId: '1',
            reportsTo: 'lm1',
            fullName: 'Rajesh Kumar',
            site: 'MH01',
            department: 'Operations',
            designation: 'Site Supervisor',
            glCode: 'A3002-EMP-001',
            osBalance: 0,
            email: 'rajesh.kumar@company.com',
            mobile: '9876543210',
            bankAccount: '1234567890',
            ifscCode: 'SBIN0001234',
            bankName: 'State Bank of India',
          },
          {
            username: 'emp2',
            role: 'employee',
            empId: '2',
            reportsTo: 'lm2',
            fullName: 'Priya Sharma',
            site: 'DL01',
            department: 'Operations',
            designation: 'Team Lead',
            glCode: 'A3002-EMP-002',
            osBalance: 0,
            email: 'priya.sharma@company.com',
            mobile: '9876543211',
            bankAccount: '2345678901',
            ifscCode: 'HDFC0001234',
            bankName: 'HDFC Bank',
          },
          {
            username: 'emp3',
            role: 'employee',
            empId: '3',
            reportsTo: 'lm1',
            fullName: 'Amit Patel',
            site: 'BLR01',
            department: 'Operations',
            designation: 'Field Executive',
            glCode: 'A3002-EMP-003',
            osBalance: 0,
            email: 'amit.patel@company.com',
            mobile: '9876543212',
            bankAccount: '3456789012',
            ifscCode: 'ICIC0001234',
            bankName: 'ICICI Bank',
          },
          {
            username: 'emp4',
            role: 'employee',
            empId: '4',
            reportsTo: 'lm3',
            fullName: 'Sneha Reddy',
            site: 'MH01',
            department: 'Operations',
            designation: 'Senior Executive',
            glCode: 'A3002-EMP-004',
            osBalance: 0,
            email: 'sneha.reddy@company.com',
            mobile: '9876543213',
            bankAccount: '4567890123',
            ifscCode: 'SBIN0005678',
            bankName: 'State Bank of India',
          },

          // Line Managers
          {
            username: 'lm1',
            role: 'line-manager',
            empId: '5',
            reportsTo: 'vp1',
            fullName: 'Vikram Singh',
            site: 'MH01',
            department: 'Operations',
            designation: 'Line Manager',
            glCode: 'A3002-EMP-005',
            osBalance: 0,
            email: 'vikram.singh@company.com',
            mobile: '9876543214',
          },
          {
            username: 'lm2',
            role: 'line-manager',
            empId: '6',
            reportsTo: 'vp1',
            fullName: 'Meera Nair',
            site: 'DL01',
            department: 'Operations',
            designation: 'Line Manager',
            glCode: 'A3002-EMP-006',
            osBalance: 0,
            email: 'meera.nair@company.com',
            mobile: '9876543215',
          },
          {
            username: 'lm3',
            role: 'line-manager',
            empId: '7',
            reportsTo: 'vp2',
            fullName: 'Arjun Desai',
            site: 'BLR01',
            department: 'Operations',
            designation: 'Line Manager',
            glCode: 'A3002-EMP-007',
            osBalance: 0,
            email: 'arjun.desai@company.com',
            mobile: '9876543216',
          },
          {
            username: 'lm4',
            role: 'line-manager',
            empId: '8',
            reportsTo: 'vp2',
            fullName: 'Kavita Iyer',
            site: 'MH01',
            department: 'Operations',
            designation: 'Line Manager',
            glCode: 'A3002-EMP-008',
            osBalance: 0,
            email: 'kavita.iyer@company.com',
            mobile: '9876543217',
          },

          // VPs
          {
            username: 'vp1',
            role: 'vp-operations',
            empId: '9',
            reportsTo: 'ae1',
            fullName: 'Suresh Menon',
            site: 'MH01',
            department: 'Operations',
            designation: 'VP Operations',
            glCode: 'A3002-EMP-009',
            osBalance: 0,
            email: 'suresh.menon@company.com',
            mobile: '9876543218',
          },
          {
            username: 'vp2',
            role: 'vp-operations',
            empId: '10',
            reportsTo: 'ae1',
            fullName: 'Deepa Krishnan',
            site: 'DL01',
            department: 'Operations',
            designation: 'VP Operations',
            glCode: 'A3002-EMP-010',
            osBalance: 0,
            email: 'deepa.krishnan@company.com',
            mobile: '9876543219',
          },

          // Account Executive
          {
            username: 'ae1',
            role: 'account-executive',
            empId: '11',
            reportsTo: 'am1',
            fullName: 'Ramesh Agarwal',
            site: 'MH01',
            department: 'Accounts',
            designation: 'Account Executive',
            glCode: null,
            osBalance: 0,
            email: 'ramesh.agarwal@company.com',
            mobile: '9876543220',
          },

          // Operation Executives
          {
            username: 'oe1',
            role: 'operation-executive',
            empId: '12',
            reportsTo: 'lm1',
            fullName: 'Karan Malhotra',
            site: 'MH01',
            department: 'Operations',
            designation: 'Operation Executive',
            glCode: 'A3002-EMP-012',
            osBalance: 0,
            email: 'karan.malhotra@company.com',
            mobile: '9876543221',
          },
          {
            username: 'oe2',
            role: 'operation-executive',
            empId: '13',
            reportsTo: 'lm2',
            fullName: 'Anjali Verma',
            site: 'DL01',
            department: 'Operations',
            designation: 'Operation Executive',
            glCode: 'A3002-EMP-013',
            osBalance: 0,
            email: 'anjali.verma@company.com',
            mobile: '9876543222',
          },
          {
            username: 'oe3',
            role: 'operation-executive',
            empId: '14',
            reportsTo: 'lm3',
            fullName: 'Rohit Kapoor',
            site: 'BLR01',
            department: 'Operations',
            designation: 'Operation Executive',
            glCode: 'A3002-EMP-014',
            osBalance: 0,
            email: 'rohit.kapoor@company.com',
            mobile: '9876543223',
          },
          {
            username: 'oe4',
            role: 'operation-executive',
            empId: '15',
            reportsTo: 'lm4',
            fullName: 'Pooja Gupta',
            site: 'MH01',
            department: 'Operations',
            designation: 'Operation Executive',
            glCode: 'A3002-EMP-015',
            osBalance: 0,
            email: 'pooja.gupta@company.com',
            mobile: '9876543224',
          },

          // Compliance Team
          {
            username: 'compliance1',
            role: 'compliance-team',
            empId: '16',
            reportsTo: 'compliance-manager1',
            fullName: 'Manish Joshi',
            site: 'MH01',
            department: 'Compliance',
            designation: 'Compliance Officer',
            glCode: null,
            osBalance: 0,
            email: 'manish.joshi@company.com',
            mobile: '9876543225',
          },
          {
            username: 'compliance2',
            role: 'compliance-team',
            empId: '17',
            reportsTo: 'compliance-manager2',
            fullName: 'Swati Rao',
            site: 'DL01',
            department: 'Compliance',
            designation: 'Compliance Officer',
            glCode: null,
            osBalance: 0,
            email: 'swati.rao@company.com',
            mobile: '9876543226',
          },

          // Compliance Managers
          {
            username: 'compliance-manager1',
            role: 'compliance-manager',
            empId: '18',
            reportsTo: 'ae1',
            fullName: 'Anil Bhatt',
            site: 'MH01',
            department: 'Compliance',
            designation: 'Compliance Manager',
            glCode: null,
            osBalance: 0,
            email: 'anil.bhatt@company.com',
            mobile: '9876543227',
          },
          {
            username: 'compliance-manager2',
            role: 'compliance-manager',
            empId: '19',
            reportsTo: 'ae1',
            fullName: 'Ritu Saxena',
            site: 'DL01',
            department: 'Compliance',
            designation: 'Compliance Manager',
            glCode: null,
            osBalance: 0,
            email: 'ritu.saxena@company.com',
            mobile: '9876543228',
          },

          // Payroll Team
          {
            username: 'payroll1',
            role: 'payroll-team',
            empId: '20',
            reportsTo: 'ae1',
            fullName: 'Sanjay Kulkarni',
            site: 'MH01',
            department: 'Accounts',
            designation: 'Payroll Executive',
            glCode: null,
            osBalance: 0,
            email: 'sanjay.kulkarni@company.com',
            mobile: '9876543229',
          },

          // Account Manager
          {
            username: 'am1',
            role: 'account-manager',
            empId: '21',
            reportsTo: 'bm1',
            fullName: 'Ashok Mehta',
            site: 'MH01',
            department: 'Accounts',
            designation: 'Account Manager',
            glCode: null,
            osBalance: 0,
            email: 'ashok.mehta@company.com',
            mobile: '9876543230',
          },

          // Billing Manager
          {
            username: 'bm1',
            role: 'billing-manager',
            empId: '22',
            reportsTo: null,
            fullName: 'Vinod Pandey',
            site: 'MH01',
            department: 'Accounts',
            designation: 'Billing Manager',
            glCode: null,
            osBalance: 0,
            email: 'vinod.pandey@company.com',
            mobile: '9876543231',
          },

          // === ADDED USER m1 (Manager) ===
          {
            username: 'm1',
            role: 'manager',
            empId: '23',
            reportsTo: 'fh1',
            fullName: 'Manoj Tiwari',
            site: 'MH01',
            department: 'Finance',
            designation: 'Manager',
            glCode: null,
            osBalance: 0,
            email: 'manoj.tiwari@company.com',
            mobile: '9876543232',
          },

          // === ADDED USER fh1 (Financial Head Manager) ===
          {
            username: 'fh1',
            role: 'financial-head',
            empId: '24',
            reportsTo: null,
            fullName: 'Farhan Hussain',
            site: 'MH01',
            department: 'Finance',
            designation: 'Financial Head Manager',
            glCode: null,
            osBalance: 0,
            email: 'farhan.hussain@company.com',
            mobile: '9876543233',
          },
        ]

        localStorage.setItem('users', JSON.stringify(users))
        console.log('✅ User roles initialized with accounting fields')
      } else {
        // Always ensure the two new users are present
        users = JSON.parse(existingUsers)
        const m1Exists = users.some((u) => u.username === 'm1')
        const fh1Exists = users.some((u) => u.username === 'fh1')
        let changed = false

        if (!m1Exists) {
          users.push({
            username: 'm1',
            role: 'manager',
            empId: '23',
            reportsTo: 'fh1',
            fullName: 'Manoj Tiwari',
            site: 'MH01',
            department: 'Finance',
            designation: 'Manager',
            glCode: null,
            osBalance: 0,
            email: 'manoj.tiwari@company.com',
            mobile: '9876543232',
          })
          changed = true
        }

        if (!fh1Exists) {
          users.push({
            username: 'fh1',
            role: 'financial-head',
            empId: '24',
            reportsTo: null,
            fullName: 'Farhan Hussain',
            site: 'MH01',
            department: 'Finance',
            designation: 'Financial Head Manager',
            glCode: null,
            osBalance: 0,
            email: 'farhan.hussain@company.com',
            mobile: '9876543233',
          })
          changed = true
        }

        if (changed) {
          localStorage.setItem('users', JSON.stringify(users))
          console.log('✅ Added Manager (m1) and Financial Head (fh1) to users')
        }
      }

      // ========================================
      // 2. INITIALIZE VOUCHER COUNTERS
      // ========================================
      if (!localStorage.getItem('voucherCounters')) {
        const voucherCounters = {
          'PAY/MH01/2025': 0,
          'PAY/DL01/2025': 0,
          'PAY/BLR01/2025': 0,
        }
        localStorage.setItem('voucherCounters', JSON.stringify(voucherCounters))
        console.log('✅ Voucher counters initialized')
      }

      // ========================================
      // 3. INITIALIZE LEDGER BALANCES
      // ========================================
      if (!localStorage.getItem('ledgerBalances')) {
        localStorage.setItem('ledgerBalances', JSON.stringify({}))
        console.log('✅ Ledger balances initialized')
      }

      // ========================================
      // 4. INITIALIZE BANK OPENING BALANCES
      // ========================================
      if (!localStorage.getItem('bankOpeningBalances')) {
        const bankOpeningBalances = {
          A3004001001: 500000, // HDFC Bank - ₹5,00,000
          A3004001002: 300000, // Punjab Bank - ₹3,00,000
        }
        localStorage.setItem('bankOpeningBalances', JSON.stringify(bankOpeningBalances))
        console.log('✅ Bank opening balances initialized')
      }

      // ========================================
      // 5. INITIALIZE CLIENT ACCOUNTS & LEDGERS
      // ========================================
      // Initialize client accounts in Chart of Accounts
      initializeClientAccounts()

      // Initialize ABC Mall ledger data
      initializeABCMallLedger()

      console.log('✅ Client accounts and ledgers initialized')

      // ========================================
      // 6. INITIALIZE REVENUE LEDGERS
      // ========================================
      // Initialize House Keeping Revenue ledger data
      initializeHouseKeepingRevenueLedger()
      // Initialize House Keeping Exempt Revenue ledger data
      initializeHouseKeepingExemptRevenueLedger()
      // Initialize Service Charges Revenue ledger data
      initializeServiceChargesRevenueLedger()
      // Initialize Overseas Consultancy Revenue ledger data
      initializeOverseasConsultancyRevenueLedger()
      // Initialize HK Material Revenue ledger data
      initializeHKMaterialRevenueLedger()
      // Initialize Cleaning Consumable Revenue ledger data
      initializeCleaningConsumableRevenueLedger()
      // Initialize Deep Cleaning Revenue ledger data
      initializeDeepCleaningRevenueLedger()
      // Initialize Rent on Machinery Revenue ledger data
      initializeRentOnMachineryRevenueLedger()
      // Initialize Manpower Services Revenue ledger data
      initializeManpowerServicesRevenueLedger()
      // Initialize Pest Control Revenue ledger data
      initializePestControlRevenueLedger()

      // Initialize Round Off Revenue ledger data
      initializeRoundOffRevenueLedger()

      console.log('✅ Revenue ledgers initialized')

      console.log('🎯 All accounting modules initialized successfully!')
    } catch (error) {
      console.error('❌ Error initializing accounting modules:', error)
      toast.error('Failed to initialize application. Please refresh the page.')
    }
  }, [])

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <RouterProvider router={router} />
    </>
  )
}

export default App

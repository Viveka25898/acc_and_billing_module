import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Header from '../Components/Header'
import StatsCards from '../Components/StatsCard'
import SearchAndFilter from '../Components/SearchAndFilter'
import AccountsTable from '../Components/AccountsTable'
import AddAccountModal from '../Components/AddAccountModal'
import EditAccountModal from '../Components/EditAccountModal'
import AccountDetailsModal from '../Components/AccountDetailsModal'

// Redux Thunks & Selectors
import {
  fetchAccountsByParent,
  toggleExpandAccount,
  addAccount,
  updateAccount,
  deleteAccount,
  selectAccounts,
  selectLoadingStates,
  selectExpandedAccounts,
  selectErrors,
} from '../../../store/slices/chartOfAccountsSlice'

// Import A3001 auto-sync utility
import {
  autoSyncA3001OnTransactionChange,
  updateA3001ClosingBalance,
} from '../Services/A3001BalanceSync'
// Import Liability balance sync utility
import {
  autoSyncLiabilityOnTransactionChange,
  updateLiabilityClosingBalance,
} from '../Services/LiabilityBalanceSync'
// Import Expense balance sync utility
import {
  autoSyncExpenseOnTransactionChange,
  updateExpenseClosingBalance,
} from '../Services/ExpenseBalanceSync'

const ChartOfAccountsDashboard = () => {
  const dispatch = useDispatch()

  // Selectors from Redux state
  const accounts = useSelector(selectAccounts)
  const loadingStates = useSelector(selectLoadingStates)
  const expandedAccountsList = useSelector(selectExpandedAccounts)
  const coaErrors = useSelector(selectErrors)

  // Local UI State
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingAccount, setEditingAccount] = useState(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState(null)

  // Auto-sync closing balances on transaction changes
  useEffect(() => {
    autoSyncA3001OnTransactionChange()
    updateA3001ClosingBalance()
    autoSyncLiabilityOnTransactionChange()
    updateLiabilityClosingBalance()
    autoSyncExpenseOnTransactionChange()
    updateExpenseClosingBalance()
  }, [])

  // Load root level accounts on mount if not already loaded
  useEffect(() => {
    if (!loadingStates['']) {
      dispatch(fetchAccountsByParent({ parentCode: '' }))
    }
  }, [dispatch, loadingStates])

  // Function to get all children of an account (recursive) — kept for delete logic
  const getAllChildren = (parentCode, accountsList = accounts) => {
    const directChildren = accountsList.filter((acc) => acc.parentCode === parentCode)
    let allChildren = [...directChildren]

    directChildren.forEach((child) => {
      allChildren = [...allChildren, ...getAllChildren(child.code, accountsList)]
    })

    return allChildren
  }

  const handleAddAccount = (newAccount) => {
    const accountWithId = {
      ...newAccount,
      id: Date.now().toString(),
    }
    dispatch(addAccount(accountWithId))

    // Save to localStorage for backward compatibility with other features
    try {
      const savedAccounts = localStorage.getItem('chartOfAccounts')
      const currentList = savedAccounts ? JSON.parse(savedAccounts) : []
      localStorage.setItem('chartOfAccounts', JSON.stringify([...currentList, accountWithId]))
    } catch (e) {
      console.warn('Failed to update local storage copy of chartOfAccounts', e)
    }
  }

  const handleAccountClick = (account) => {
    setSelectedAccount(account)
    setIsDetailsModalOpen(true)
  }

  const handleEditFromDetails = (account) => {
    setEditingAccount(account)
    setIsEditModalOpen(true)
    setIsDetailsModalOpen(false)
  }

  const handleDeleteAccount = (accountId) => {
    const accountToDelete = accounts.find((acc) => acc.id === accountId)
    if (!accountToDelete) return

    // Confirm deletion with user
    const confirmMessage =
      accountToDelete.type === 'ROOT' || accountToDelete.type === 'FOLDER'
        ? `Are you sure you want to delete "${accountToDelete.code} - ${accountToDelete.name}"?\n\nThis will also delete ALL accounts under this ${accountToDelete.type.toLowerCase()}.`
        : `Are you sure you want to delete "${accountToDelete.code} - ${accountToDelete.name}"?`

    const confirmed = window.confirm(confirmMessage)
    if (!confirmed) return

    // Get all children that need to be deleted
    const childrenToDelete = getAllChildren(accountToDelete.code)
    const idsToDelete = [accountId, ...childrenToDelete.map((child) => child.id)]

    dispatch(deleteAccount(idsToDelete))

    // Save to localStorage for backward compatibility
    try {
      const savedAccounts = localStorage.getItem('chartOfAccounts')
      const currentList = savedAccounts ? JSON.parse(savedAccounts) : []
      const updatedList = currentList.filter((a) => !idsToDelete.includes(a.id))
      localStorage.setItem('chartOfAccounts', JSON.stringify(updatedList))
    } catch (e) {
      console.warn('Failed to update local storage copy of chartOfAccounts during delete', e)
    }

    // Close details modal if open
    if (isDetailsModalOpen) {
      setIsDetailsModalOpen(false)
      setSelectedAccount(null)
    }
  }

  const handleUpdateAccount = (updatedAccount) => {
    dispatch(updateAccount(updatedAccount))

    // Save to localStorage for backward compatibility
    try {
      const savedAccounts = localStorage.getItem('chartOfAccounts')
      const currentList = savedAccounts ? JSON.parse(savedAccounts) : []
      const updatedList = currentList.map((a) => (a.id === updatedAccount.id ? updatedAccount : a))
      localStorage.setItem('chartOfAccounts', JSON.stringify(updatedList))
    } catch (e) {
      console.warn('Failed to update local storage copy of chartOfAccounts during update', e)
    }
  }

  const openAddModal = () => {
    setIsAddModalOpen(true)
  }

  const closeAddModal = () => {
    setIsAddModalOpen(false)
  }

  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false)
    setSelectedAccount(null)
  }

  const closeEditModal = () => {
    setIsEditModalOpen(false)
    setEditingAccount(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <Header onAddAccount={openAddModal} />
        <StatsCards accounts={accounts} />
        
        {coaErrors[''] && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-center justify-between">
            <span className="text-sm">⚠️ {coaErrors['']}</span>
            <button
              onClick={() => dispatch(fetchAccountsByParent({ parentCode: '' }))}
              className="text-xs font-semibold underline hover:text-red-900"
            >
              Retry
            </button>
          </div>
        )}

        <SearchAndFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
        />
        <AccountsTable
          accounts={accounts}
          searchTerm={searchTerm}
          selectedFilter={selectedFilter}
          onAccountClick={handleAccountClick}
          loadingStates={loadingStates}
          expandedAccounts={expandedAccountsList}
          onExpandAccount={(code) => {
            dispatch(toggleExpandAccount(code))
            // Lazy load from API if never requested before
            if (!loadingStates[code]) {
              dispatch(fetchAccountsByParent({ parentCode: code }))
            }
          }}
        />

        <AddAccountModal
          isOpen={isAddModalOpen}
          onClose={closeAddModal}
          onSubmit={handleAddAccount}
          accounts={accounts}
        />

        <AccountDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={closeDetailsModal}
          account={selectedAccount}
          accounts={accounts}
          onEdit={handleEditFromDetails}
          onDelete={handleDeleteAccount}
        />

        <EditAccountModal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          onSubmit={handleUpdateAccount}
          accounts={accounts}
          editingAccount={editingAccount}
        />
      </div>
    </div>
  )
}

export default ChartOfAccountsDashboard

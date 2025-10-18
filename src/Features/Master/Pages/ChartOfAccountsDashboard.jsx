import { useEffect, useState } from "react";
import Header from "../Components/Header";
import StatsCards from "../Components/StatsCard";
import SearchAndFilter from "../Components/SearchAndFilter";
import AccountsTable from "../Components/AccountsTable";
import AddAccountModal from "../Components/AddAccountModal";
import EditAccountModal from "../Components/EditAccountModal";
import AccountDetailsModal from "../Components/AccountDetailsModal";

const ChartOfAccountsDashboard = () => {
  const [accounts, setAccounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

  // Initialize with hierarchical structure from your Excel sheet
  const initializeAccounts = () => {
    const initialAccounts = [
      // ROOT LEVEL
      { 
        id: '1',
        code: 'A',
        name: 'ASSETS',
        type: 'ROOT',
        parentAccount: null,
        parentCode: null
      },
      { 
        id: '2',
        code: 'L',
        name: 'SOURCES OF FUNDS',
        type: 'ROOT',
        parentAccount: null,
        parentCode: null
      },
      { 
        id: '3',
        code: 'R',
        name: 'INCOME',
        type: 'ROOT',
        parentAccount: null,
        parentCode: null
      },
      { 
        id: '4',
        code: 'X',
        name: 'EXPENSES',
        type: 'ROOT',
        parentAccount: null,
        parentCode: null
      },
     
    ];
    
    return initialAccounts;
  };

  // Save accounts to localStorage
  const saveToLocalStorage = (accountsData) => {
    try {
      localStorage.setItem('chartOfAccounts', JSON.stringify(accountsData));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  // Load accounts from localStorage on component mount
  useEffect(() => {
    try {
      const savedAccounts = localStorage.getItem('chartOfAccounts');
      if (savedAccounts) {
        const parsedAccounts = JSON.parse(savedAccounts);
        // Check if we have the new hierarchical structure
        if (parsedAccounts.length > 0 && parsedAccounts[0].type === 'ROOT') {
          setAccounts(parsedAccounts);
        } else {
          // Initialize with new structure if old data exists
          const newAccounts = initializeAccounts();
          setAccounts(newAccounts);
          saveToLocalStorage(newAccounts);
        }
      } else {
        // Initialize with hierarchical structure
        const newAccounts = initializeAccounts();
        setAccounts(newAccounts);
        saveToLocalStorage(newAccounts);
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      // Initialize with default data if localStorage fails
      const newAccounts = initializeAccounts();
      setAccounts(newAccounts);
    }
  }, []);

  // Function to get all children of an account (recursive)
  const getAllChildren = (parentCode, accountsList = accounts) => {
    const directChildren = accountsList.filter(acc => acc.parentCode === parentCode);
    let allChildren = [...directChildren];
    
    directChildren.forEach(child => {
      allChildren = [...allChildren, ...getAllChildren(child.code, accountsList)];
    });
    
    return allChildren;
  };

  const handleAddAccount = (newAccount) => {
    const accountWithId = {
      ...newAccount,
      id: Date.now().toString()
    };
    const updatedAccounts = [...accounts, accountWithId];
    setAccounts(updatedAccounts);
    saveToLocalStorage(updatedAccounts);
  };

  const handleAccountClick = (account) => {
    // Only handle non-ACCOUNT types here (ROOT, FOLDER, etc.)
    // ACCOUNT type will be handled by AccountsTable navigation
    if (account.type !== 'ACCOUNT') {
      setSelectedAccount(account);
      setIsDetailsModalOpen(true);
    }
  };
  const handleEditFromDetails = (account) => {
    setEditingAccount(account);
    setIsEditModalOpen(true);
    setIsDetailsModalOpen(false);
  };

  const handleDeleteAccount = (accountId) => {
    const accountToDelete = accounts.find(acc => acc.id === accountId);
    if (!accountToDelete) return;

    // Confirm deletion with user
    const confirmMessage = accountToDelete.type === 'ROOT' || accountToDelete.type === 'FOLDER' 
      ? `Are you sure you want to delete "${accountToDelete.code} - ${accountToDelete.name}"?\n\nThis will also delete ALL accounts under this ${accountToDelete.type.toLowerCase()}.`
      : `Are you sure you want to delete "${accountToDelete.code} - ${accountToDelete.name}"?`;
    
    const confirmed = window.confirm(confirmMessage);
    if (!confirmed) return;

    // Get all children that need to be deleted
    const childrenToDelete = getAllChildren(accountToDelete.code);
    const idsToDelete = [accountId, ...childrenToDelete.map(child => child.id)];
    
    // Filter out the account and all its children
    const updatedAccounts = accounts.filter(account => !idsToDelete.includes(account.id));
    setAccounts(updatedAccounts);
    saveToLocalStorage(updatedAccounts);
    
    // Close details modal if open
    if (isDetailsModalOpen) {
      setIsDetailsModalOpen(false);
      setSelectedAccount(null);
    }
  };

  const handleUpdateAccount = (updatedAccount) => {
    const updatedAccounts = accounts.map(account => 
      account.id === updatedAccount.id ? updatedAccount : account
    );
    setAccounts(updatedAccounts);
    saveToLocalStorage(updatedAccounts);
  };

  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedAccount(null);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingAccount(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <Header onAddAccount={openAddModal} />
        <StatsCards accounts={accounts} />
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
  );
};

export default ChartOfAccountsDashboard;
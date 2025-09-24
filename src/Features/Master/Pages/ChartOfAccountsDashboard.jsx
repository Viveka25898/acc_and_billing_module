import { useEffect, useState } from "react";
import Header from "../Components/Header";
import StatsCards from "../Components/StatsCard";
import SearchAndFilter from "../Components/SearchAndFilter";
import AccountsTable from "../Components/AccountsTable";
import AddAccountModal from "../Components/AddAccountModal";
import EditAccountModal from "../Components/EditAccountModal"; // Add this import
import AccountDetailsModal from "../Components/AccountDetailsModal"; // Add this import

const ChartOfAccountsDashboard = () => {
  const [accounts, setAccounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Add these states for edit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  
  // Add these states for details modal
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

  // Load accounts from localStorage on component mount
  useEffect(() => {
    const savedAccounts = localStorage.getItem('chartOfAccounts');
    if (savedAccounts) {
      setAccounts(JSON.parse(savedAccounts));
    } else {
      // Initialize with some sample data if no data exists
      const initialAccounts = [
        { 
          id: '1',
          code: 'A1',
          name: 'FIXED ASSETS',
          type: 'Folder',
          parentAccount: null
        },
        { 
          id: '2',
          code: 'A1001',
          name: 'FA COMPUTERS',
          type: 'Account',
          parentAccount: 'A1'
        },
        { 
          id: '3',
          code: 'L1',
          name: 'LIABILITIES',
          type: 'Folder',
          parentAccount: null
        },
        { 
          id: '4',
          code: 'I1',
          name: 'INCOME',
          type: 'Folder',
          parentAccount: null
        },
        { 
          id: '5',
          code: 'E1',
          name: 'EXPENSES',
          type: 'Folder',
          parentAccount: null
        }
      ];
      setAccounts(initialAccounts);
      localStorage.setItem('chartOfAccounts', JSON.stringify(initialAccounts));
    }
  }, []);

  // Save accounts to localStorage whenever accounts state changes
  useEffect(() => {
    if (accounts.length > 0) {
      localStorage.setItem('chartOfAccounts', JSON.stringify(accounts));
    }
  }, [accounts]);

  const handleAddAccount = (newAccount) => {
    setAccounts(prevAccounts => [...prevAccounts, newAccount]);
  };

  // Update this function to open details modal instead of edit modal directly
  const handleAccountClick = (account) => {
    setSelectedAccount(account);
    setIsDetailsModalOpen(true);
  };

  // Add this function to handle edit from details modal
  const handleEditFromDetails = (account) => {
    setEditingAccount(account);
    setIsEditModalOpen(true);
    setIsDetailsModalOpen(false); // Close details modal
  };

  // Add this function to handle delete
  const handleDeleteAccount = (accountId) => {
    setAccounts(prevAccounts => 
      prevAccounts.filter(account => account.id !== accountId)
    );
  };

  // Add this function to handle account update
  const handleUpdateAccount = (updatedAccount) => {
    setAccounts(prevAccounts => 
      prevAccounts.map(account => 
        account.id === updatedAccount.id ? updatedAccount : account
      )
    );
  };

  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  // Add this function to close details modal
  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedAccount(null);
  };

  // Update this function to close edit modal
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
          onAccountClick={handleAccountClick} // Change prop name to onAccountClick
        />
        
        <AddAccountModal
          isOpen={isAddModalOpen}
          onClose={closeAddModal}
          onSubmit={handleAddAccount}
          accounts={accounts}
        />

        {/* Add the AccountDetailsModal */}
        <AccountDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={closeDetailsModal}
          account={selectedAccount}
          accounts={accounts}
          onEdit={handleEditFromDetails}
          onDelete={handleDeleteAccount}
        />

        {/* Add the EditAccountModal */}
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
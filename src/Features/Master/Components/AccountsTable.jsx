/* eslint-disable no-unused-vars */
import { useNavigate } from "react-router-dom";
import { RentLedgerService } from "../utils/rentLedgerService";

const AccountsTable = ({ accounts, searchTerm, selectedFilter, onAccountClick }) => {
  const navigate=useNavigate()
  // Function to sort accounts hierarchically
  const sortAccountsHierarchically = (accountsList) => {
    const accountMap = new Map();
    const roots = [];

    // Create a map for quick lookup
    accountsList.forEach(account => {
      accountMap.set(account.code, { ...account, children: [] });
    });

    // Build the hierarchy
    accountsList.forEach(account => {
      if (account.parentCode) {
        const parent = accountMap.get(account.parentCode);
        if (parent) {
          parent.children.push(accountMap.get(account.code));
        }
      } else {
        roots.push(accountMap.get(account.code));
      }
    });

    // Flatten the hierarchy for display
    const flattened = [];
    const flatten = (node, level = 0) => {
      flattened.push({ ...node, level });
      node.children
        .sort((a, b) => a.code.localeCompare(b.code))
        .forEach(child => flatten(child, level + 1));
    };

    roots
      .sort((a, b) => a.code.localeCompare(b.code))
      .forEach(root => flatten(root));

    return flattened;
  };

  // Step 1: always build hierarchy first
  const hierarchicalAccounts = sortAccountsHierarchically(accounts);

  // Step 2: apply search + filter on flattened list
  const filteredAccounts = hierarchicalAccounts.filter(account => {
    const matchesSearch =
      searchTerm === '' ||
      account.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (account.parentAccount && account.parentAccount.toLowerCase().includes(searchTerm.toLowerCase()));

    let matchesFilter = true;
    switch (selectedFilter) {
      case 'root':
        matchesFilter = account.type === 'ROOT';
        break;
      case 'folders':
        matchesFilter = account.type === 'FOLDER';
        break;
      case 'subfolders':
        matchesFilter = account.type === 'SUB_FOLDER';
        break;
      case 'accountsubcategories':
        matchesFilter = account.type === 'ACCOUNT_SUBCATEGORY';
        break;
      case 'accounttypes':
        matchesFilter = account.type === 'ACCOUNT_TYPE';
        break;
      case 'accounts':
        matchesFilter = account.type === 'ACCOUNT';
        break;
      default:
        matchesFilter = true;
    }

    return matchesSearch && matchesFilter;
  });

  // Helpers for UI styling
  const getTypeColor = (type) => {
    switch (type) {
      case 'ROOT':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'FOLDER':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'SUB_FOLDER':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'ACCOUNT_SUBCATEGORY':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'ACCOUNT_TYPE':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'ACCOUNT':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'ROOT':
        return '🏛️'; // Root
      case 'FOLDER':
        return '📁'; // Folder
      case 'SUB_FOLDER':
        return '📂'; // Sub Folder
      case 'ACCOUNT_SUBCATEGORY':
        return '🗂️'; // Account Subcategory
      case 'ACCOUNT_TYPE':
        return '📋'; // Account Type
      case 'ACCOUNT':
        return '📄'; // Leaf account
      default:
        return '📄';
    }
  };
 // Add this condition in the handleAccountClick function
const handleAccountClick = (account) => {
  if (account.type === 'ACCOUNT') {
    console.log('🔍 Clicked Account:', account.code, account.name); // Debug log
    
    // PRIORITY ORDER: Check most specific accounts first!
    
    // 1. Reliever Payment Account - CHECK FIRST (Most Specific)
    const isRelieverPaymentAccount = 
      account.code === 'X100101003' ||
      account.code === 'X1001001003' || // Alternative code format
      (account.code.startsWith('X10010100') && account.name.toLowerCase().includes('reliever'));
    
    // 2. Conveyance Expense Account
    const isConveyanceExpenseAccount = 
      account.code === 'X2001003' || 
      (account.code.startsWith('X2001003') && account.name.toLowerCase().includes('conveyance expense'));
    
    // 3. Conveyance Payable Account
    const isConveyancePayableAccount = 
      account.code === 'L2001001' || 
      (account.code.startsWith('L2001001') && account.name.toLowerCase().includes('conveyance payable'));
    
    // 4. Employee Account
    const isEmployeeAccount = 
      account.code.startsWith('A3002') || 
      account.name.toLowerCase().includes('employee advance');
    
    // 5. Vendor Account
    const isVendorAccount = 
      account.code.startsWith('L2005') || 
      account.code.includes('VEN') || 
      account.name.toLowerCase().includes('vendor');
    
    // 6. TDS Account
    const isTDSAccount = 
      account.code.startsWith('L2003') || 
      account.code.includes('TDS') || 
      account.name.toLowerCase().includes('tds');
    
    // 7. Bank Account
    const isBankAccount = 
      account.code.startsWith('A3004') || 
      account.name.toLowerCase().includes('bank') ||
      account.name.toLowerCase().includes('hdfc') ||
      account.name.toLowerCase().includes('sbi') ||
      account.name.toLowerCase().includes('icici');
    
    // 8. Travel Expense Account
    const isTravelExpenseAccount = 
      account.code.startsWith('X1001002') || 
      (account.code.includes('X1001002') && account.name.toLowerCase().includes('travel'));
    
    // 9. Food & Refreshment
    const isFoodRefreshmentAccount = 
      account.code.startsWith('X1001003') || // Changed from X1001001
      (account.code.includes('X1001003') && account.name.toLowerCase().includes('food'));
    
    // 10. Office Supplies  
    const isOfficeSuppliesAccount = 
      account.code.startsWith('X2001002001') || 
      (account.code.includes('X2001002') && account.name.toLowerCase().includes('office supplies'));
      // 11. Rent Expense  
    const isRentExpenseAccount = 
      account.code.startsWith('X2001002002') || 
      (account.code.includes('X2001002') && account.name.toLowerCase().includes('branch office rent'));

      // GST Input Accounts
          const isCGSTInputAccount = 
            account.code === 'A300701001' || 
            account.name.toLowerCase().includes('cgst input');

          const isSGSTInputAccount = 
            account.code === 'A300701002' || 
            account.name.toLowerCase().includes('sgst input');

          const isIGSTInputAccount = 
            account.code === 'A300701003' || 
            account.name.toLowerCase().includes('igst input');
      
      // 11. Rent Vendor (Owner) Ledger Account - robust detection
      const parentHasRent = (account.parentAccount || '').toLowerCase().includes('rent');
      const isRentVendorAccount =
        account.code.startsWith("L2005") &&
        (
          parentHasRent ||
          account.name.toLowerCase().includes("owner") ||
          account.name.toLowerCase().includes("landlord") ||
          account.name.toLowerCase().includes("rent vendor") ||
          account.name.toLowerCase().includes("rent -") ||
          account.name.toLowerCase().includes("branch office rent")
        );
            
            
    // NAVIGATION LOGIC - PRIORITY ORDER
    console.log('🎯 Account Classification:', {
      isRelieverPaymentAccount,
      isConveyanceExpenseAccount,
      isConveyancePayableAccount,
      isEmployeeAccount
    });
    
    // Check if this vendor has rent-specific entries to force rent vendor ledger
    const hasRentVendorEntries = (() => {
      try {
        return RentLedgerService.getVendorLedgerEntries(account.code).length > 0;
      } catch (e) {
        return false;
      }
    })();

    if (isRelieverPaymentAccount) {
      console.log('✅ Navigating to Reliever Payment Page');
      navigate(`/dashboard/account-manager/reliever-payment-page`);
    } 
    else if (isConveyanceExpenseAccount) {
      console.log('✅ Navigating to Conveyance Expense Ledger');
      navigate(`/dashboard/account-manager/conveyance-expense-ledger`);
    } 
    else if (isConveyancePayableAccount) {
      console.log('✅ Navigating to Conveyance Payable Ledger');
      navigate(`/dashboard/account-manager/conveyance-payable-ledger`);
    } 
    else if (isEmployeeAccount) {
      console.log('✅ Navigating to Employee Ledger');
      navigate(`/dashboard/account-manager/ledger/${account.code}`);
    } 
    else if (isRentVendorAccount || (isVendorAccount && hasRentVendorEntries)) {
      console.log('✅ Navigating to Rent Vendor Ledger');
      navigate(`/dashboard/account-manager/rent-vendor-ledger/${account.code}`);
    }
    else if (isVendorAccount) {
      console.log('✅ Navigating to Vendor Ledger');
      navigate(`/dashboard/account-manager/vendor-ledger/${account.code}`);
    } 
    else if (isTDSAccount) {
      const sectionCode = account.code.replace('L2003', '').replace(/^0+/, '') || '194C';
      console.log('✅ Navigating to TDS Ledger');
      navigate(`/dashboard/account-manager/tds-ledger/${sectionCode}`);
    } 
    else if (isBankAccount) {
      console.log('✅ Navigating to Bank Ledger');
      navigate(`/dashboard/account-manager/bank-ledger/${account.code}`);
    } 
    else if (isTravelExpenseAccount) {
      console.log('✅ Navigating to Travel Expense Ledger');
      navigate(`/dashboard/account-manager/travel-expense-ledger`);
    } 
    else if (isFoodRefreshmentAccount) {
      console.log('✅ Navigating to Food & Refreshment Ledger');
      navigate(`/dashboard/account-manager/food-refreshment-ledger`);
    } 
    else if (isOfficeSuppliesAccount) {
      console.log('✅ Navigating to Office Supplies Ledger');
      navigate(`/dashboard/account-manager/office-supplies-ledger`);
    }
    else if (isRentExpenseAccount){
      console.log("✅ Navigating to Rent Expense Ledger");
      navigate(`/dashboard/account-manager/rent-expense-account`)
    } 
    else if (isCGSTInputAccount) {
        console.log("✅ Navigating to CGST Input Ledger");
        navigate(`/dashboard/account-manager/cgst-input-ledger`);
      } 
      else if (isSGSTInputAccount) {
        console.log("✅ Navigating to SGST Input Ledger");
        navigate(`/dashboard/account-manager/sgst-input-ledger`);
      } 
      else if (isIGSTInputAccount) {
        console.log("✅ Navigating to IGST Input Ledger");
        navigate(`/dashboard/account-manager/igst-input-ledger`);
      }
     
    else {
      console.log('✅ Navigating to Generic Ledger');
      navigate(`/dashboard/account-manager/ledger/${account.code}`);
    }
  } else {
    // Non-ACCOUNT types
    if (onAccountClick) {
      onAccountClick(account);
    }
  }
};
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
              <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">Account Code</th>
              <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">Account Name</th>
              <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">Type</th>
              <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">Parent</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredAccounts.length > 0 ? (
              filteredAccounts.map((account, index) => (
                <tr
                  key={account.id || index}
                  className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                    account.type === 'ROOT' ? 'bg-blue-50' : ''
                  } ${account.type === 'ACCOUNT' ? 'hover:bg-indigo-50' : ''}`}
                  onClick={() => handleAccountClick(account)}
                >
                  <td className="py-3 px-6 text-sm">
                    <span className="font-mono text-gray-900">{account.code}</span>
                  </td>
                  <td className="py-3 px-6 text-sm">
                    <div className="flex items-center gap-2">
                      <span
                        style={{ marginLeft: `${account.level * 20}px` }}
                        className="flex items-center gap-2"
                      >
                        <span className="text-lg">{getTypeIcon(account.type)}</span>
                        <span
                          className={`text-gray-900 ${
                            account.type === 'ROOT'
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
                        {/* Add indicator for clickable ledger accounts */}
                        {account.type === 'ACCOUNT' && (
                          <span className="text-xs text-indigo-600 ml-2">→ View Ledger</span>
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
                    <span className="text-gray-600 text-xs">
                      {account.parentAccount || 'None'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-8 px-6 text-center text-gray-500">
                  No accounts found matching your criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filteredAccounts.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-600">
            Showing {filteredAccounts.length} of {accounts.length} accounts
          </p>
        </div>
      )}
    </div>
  );
};

export default AccountsTable;
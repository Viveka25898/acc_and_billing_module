const AccountsTable = ({ accounts, searchTerm, selectedFilter, onAccountClick }) => {
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
      case 'accounts':
        matchesFilter = account.type === 'Account';
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
      case 'Account':
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
      case 'Account':
        return '📄'; // Leaf account
      default:
        return '📄';
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
                  className={`hover:bg-gray-50 cursor-pointer ${account.type === 'ROOT' ? 'bg-blue-50' : ''}`}
                  onClick={() => {
                    if (onAccountClick) {
                      onAccountClick(account);
                    }
                  }}
                >
                  <td className="py-3 px-6 text-sm">
                    <span className="font-mono text-gray-900">{account.code}</span>
                  </td>
                  <td className="py-3 px-6 text-sm">
                    <div className="flex items-center gap-2">
                      {/* Indentation based on hierarchy level */}
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
                              : ''
                          }`}
                        >
                          {account.name}
                        </span>
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-6 text-sm">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-md border ${getTypeColor(
                        account.type
                      )}`}
                    >
                      {account.type}
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

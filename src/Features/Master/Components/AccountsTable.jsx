const AccountsTable = ({ accounts, searchTerm, selectedFilter, onAccountClick }) => {
  const filteredAccounts = accounts.filter(account => {
    // Search filter
    const matchesSearch = searchTerm === '' || 
      account.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.type.toLowerCase().includes(searchTerm.toLowerCase());

    // Type filter
    let matchesFilter = true;
    switch (selectedFilter) {
      case 'root':
        matchesFilter = !account.parentAccount || account.parentAccount === 'No Parent (Root Level)';
        break;
      case 'folders':
        matchesFilter = account.type === 'Folder';
        break;
      case 'accounts':
        matchesFilter = account.type === 'Account';
        break;
      default:
        matchesFilter = true;
    }

    return matchesSearch && matchesFilter;
  });

  const getTypeColor = (type) => {
    return type === 'Folder' 
      ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
      : 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Chart of Accounts Table</h2>
        <p className="text-sm text-gray-600 mt-1">Hierarchical listing of all accounts with hierarchy information</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">Account Code</th>
              <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">Account Name</th>
              <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">Type</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredAccounts.length > 0 ? (
              filteredAccounts.map((account, index) => (
                <tr 
                  key={account.id || index} 
                  className="hover:bg-gray-50 cursor-pointer" 
                  onClick={() => {
                    console.log('Row clicked:', account); // Debug log
                    if (onAccountClick) {
                      onAccountClick(account);
                    } else {
                      console.error('onAccountClick function not provided');
                    }
                  }}
                >
                  <td className="py-3 px-6 text-sm">
                    <span className="font-mono text-gray-900">{account.code}</span>
                  </td>
                  <td className={`py-3 px-6 text-sm`}>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-900">{account.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-6 text-sm">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md border ${getTypeColor(account.type)}`}>
                      {account.type}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="py-8 px-6 text-center text-gray-500">
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
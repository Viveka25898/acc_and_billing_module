import { FiFilter, FiSearch } from "react-icons/fi";

const SearchAndFilter = ({ searchTerm, setSearchTerm, selectedFilter, setSelectedFilter }) => {
  const filterOptions = [
    { value: 'all', label: 'All Levels', icon: '📋' },
    { value: 'root', label: 'Root Level', icon: '🏛️' },
    { value: 'folders', label: 'Folders Only', icon: '📁' },
    { value: 'accounts', label: 'Accounts Only', icon: '📄' }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search accounts by code, name, or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <FiFilter className="text-gray-400" />
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white"
            >
              {filterOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.icon} {option.label}
                </option>
              ))}
            </select>
          </div>
          <span className="text-sm text-gray-500">
            Chart of Accounts
          </span>
        </div>
      </div>
      
      {/* Filter Description */}
      <div className="mt-3 text-sm text-gray-600">
        {selectedFilter === 'all' && (
          <span>📋 Showing all account types in hierarchical order</span>
        )}
        {selectedFilter === 'root' && (
          <span>🏛️ Showing only root categories (ASSETS, SOURCES OF FUNDS, INCOME, EXPENSES)</span>
        )}
        {selectedFilter === 'folders' && (
          <span>📁 Showing only folder categories that can contain other accounts</span>
        )}
        {selectedFilter === 'accounts' && (
          <span>📄 Showing only final accounts used for transactions</span>
        )}
      </div>
    </div>
  );
};

export default SearchAndFilter;
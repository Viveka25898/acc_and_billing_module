import React from 'react';

const FilterSection = ({ filters, onFilterChange, onApplyFilter }) => {
  const handleInputChange = (field, value) => {
    onFilterChange({
      ...filters,
      [field]: value
    });
  };

  const handleClearFilters = () => {
    onFilterChange({
      fromDate: '',
      toDate: '',
      entryType: 'All',
      status: 'All',
      site: 'All',
      reliever: 'All'
    });
  };

  return (
    <div className="bg-gray-50 p-6 border-b border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
        {/* Date Filters */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            From Date
          </label>
          <input
            type="date"
            value={filters.fromDate}
            onChange={(e) => handleInputChange('fromDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          />
        </div>
        
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            To Date
          </label>
          <input
            type="date"
            value={filters.toDate}
            onChange={(e) => handleInputChange('toDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          />
        </div>
        
        {/* Entry Type Filter */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Entry Type
          </label>
          <select
            value={filters.entryType}
            onChange={(e) => handleInputChange('entryType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          >
            <option value="All">All Types</option>
            <option value="Payment">Payment</option>
            <option value="Bulk Payment">Bulk Payment</option>
            <option value="Opening">Opening</option>
            <option value="Closing">Closing</option>
          </select>
        </div>
        
        {/* Status Filter */}
        

        {/* Site Filter */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Site
          </label>
          <select
            value={filters.site}
            onChange={(e) => handleInputChange('site', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          >
            <option value="All">All Sites</option>
            <option value="Phoenix Mall">Phoenix Mall</option>
            <option value="City Center">City Center</option>
            <option value="Tech Park">Tech Park</option>
            <option value="Garden Plaza">Garden Plaza</option>
            <option value="Metro Station">Metro Station</option>
            <option value="Multiple">Multiple Sites</option>
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
        <div className="flex gap-2">
          <button
            onClick={onApplyFilter}
            className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-colors"
          >
            Apply Filters
          </button>
          <button
            onClick={handleClearFilters}
            className="bg-gray-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Active Filters Display */}
      {(filters.fromDate || filters.toDate || filters.entryType !== 'All' || filters.status !== 'All' || filters.site !== 'All' || filters.reliever !== 'All') && (
        <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-xs font-semibold text-blue-800 mb-2">Active Filters:</div>
          <div className="flex flex-wrap gap-2">
            {filters.fromDate && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                From: {filters.fromDate}
                <button 
                  onClick={() => handleInputChange('fromDate', '')}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            {filters.toDate && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                To: {filters.toDate}
                <button 
                  onClick={() => handleInputChange('toDate', '')}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            {filters.entryType !== 'All' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                Type: {filters.entryType}
                <button 
                  onClick={() => handleInputChange('entryType', 'All')}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            {filters.status !== 'All' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                Status: {filters.status}
                <button 
                  onClick={() => handleInputChange('status', 'All')}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            {filters.site !== 'All' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                Site: {filters.site}
                <button 
                  onClick={() => handleInputChange('site', 'All')}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            {filters.reliever !== 'All' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                Reliever: {filters.reliever}
                <button 
                  onClick={() => handleInputChange('reliever', 'All')}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterSection;
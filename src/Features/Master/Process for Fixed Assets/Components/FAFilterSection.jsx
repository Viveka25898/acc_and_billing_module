export const FAFilterSection = ({ filters, setFilters }) => {
  const handleChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex flex-wrap items-end gap-4 bg-gray-50 border-b border-gray-200 p-4">
      <div>
        <label className="block text-xs text-gray-600 mb-1 font-medium">From Date</label>
        <input
          type="date"
          className="border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={filters.fromDate}
          onChange={(e) => handleChange("fromDate", e.target.value)}
        />
      </div>
      <div>
        <label className="block text-xs text-gray-600 mb-1 font-medium">To Date</label>
        <input
          type="date"
          className="border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={filters.toDate}
          onChange={(e) => handleChange("toDate", e.target.value)}
        />
      </div>
      <div>
        <label className="block text-xs text-gray-600 mb-1 font-medium">Entry Type</label>
        <select
          className="border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={filters.entryType}
          onChange={(e) => handleChange("entryType", e.target.value)}
        >
          <option value="">All</option>
          <option value="Opening">Opening</option>
          <option value="Purchase">Purchase</option>
          <option value="Depreciation">Depreciation</option>
          <option value="Disposal">Disposal</option>
          <option value="Transfer">Transfer</option>
        </select>
      </div>
      <div>
        <label className="block text-xs text-gray-600 mb-1 font-medium">Status</label>
        <select
          className="border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={filters.status}
          onChange={(e) => handleChange("status", e.target.value)}
        >
          <option value="">All</option>
          <option value="Active">Active</option>
          <option value="Disposed">Disposed</option>
          <option value="Under Maintenance">Under Maintenance</option>
          <option value="Posted">Posted</option>
        </select>
      </div>
      <div>
        <label className="block text-xs text-gray-600 mb-1 font-medium">Asset Tag</label>
        <input
          type="text"
          placeholder="Search by Asset Tag"
          className="border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={filters.assetTag || ''}
          onChange={(e) => handleChange("assetTag", e.target.value)}
        />
      </div>
    </div>
  );
};
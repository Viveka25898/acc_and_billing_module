import React from 'react'

const StatsCards = ({ summary, loading, error }) => {
  const stats = [
    { label: 'Total Accounts', value: summary?.totalAccounts ?? 0, color: 'text-blue-600', bg: 'bg-blue-50/50', border: 'border-blue-100' },
    { label: 'Root Accounts', value: summary?.rootAccounts ?? 0, color: 'text-purple-600', bg: 'bg-purple-50/50', border: 'border-purple-100' },
    { label: 'Folder Accounts', value: summary?.folderAccounts ?? 0, color: 'text-emerald-600', bg: 'bg-emerald-50/50', border: 'border-emerald-100' },
    { label: 'Subfolder Accounts', value: summary?.subfolderAccounts ?? 0, color: 'text-indigo-600', bg: 'bg-indigo-50/50', border: 'border-indigo-100' },
    { label: 'Sub-Subfolder Accounts', value: summary?.subSubfolderAccounts ?? 0, color: 'text-pink-600', bg: 'bg-pink-50/50', border: 'border-pink-100' },
    { label: 'Leaf Accounts', value: summary?.leafAccounts ?? 0, color: 'text-amber-600', bg: 'bg-amber-50/50', border: 'border-amber-100' },
    { label: 'Active Accounts', value: summary?.activeAccounts ?? 0, color: 'text-green-600', bg: 'bg-green-50/50', border: 'border-green-100' },
    { label: 'Inactive Accounts', value: summary?.inactiveAccounts ?? 0, color: 'text-red-600', bg: 'bg-red-50/50', border: 'border-red-100' },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
        {[...Array(8)].map((_, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm animate-pulse"
          >
            <div className="h-3 bg-gray-200 rounded w-3/4 mb-3" />
            <div className="h-8 bg-gray-200 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center justify-between shadow-sm">
        <span>⚠️ Failed to load summary statistics: {error}</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`bg-white p-4 rounded-xl border ${stat.border} shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5`}
        >
          <div className="flex flex-col h-full justify-between">
            <span className="text-xs font-semibold text-gray-500 tracking-wide uppercase">
              {stat.label}
            </span>
            <span className={`text-2xl font-bold mt-2 ${stat.color}`}>
              {stat.value.toLocaleString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
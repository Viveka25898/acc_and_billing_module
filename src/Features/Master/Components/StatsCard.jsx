const StatsCards = ({ accounts }) => {
  const totalAccounts = accounts.length;
  const rootAccounts = accounts.filter(acc => acc.type?.toUpperCase() === 'ROOT').length;
  const folderAccounts = accounts.filter(acc => acc.type?.toUpperCase() === 'FOLDER').length;
  const accountsCount = accounts.filter(acc => acc.type?.toUpperCase() === 'ACCOUNT').length;

  const stats = [
    { label: 'Total Accounts', value: totalAccounts, color: 'text-blue-600' },
    { label: 'Root Accounts', value: rootAccounts, color: 'text-purple-600' },
    { label: 'Folder Accounts', value: folderAccounts, color: 'text-emerald-600' },
    { label: 'Account Entries', value: accountsCount, color: 'text-orange-600' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
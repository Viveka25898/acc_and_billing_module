export const FASummaryCards = ({ summary }) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white border-b border-gray-200 p-6">
    <div className="text-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-md border border-blue-200">
      <p className="text-xs text-gray-600 uppercase font-semibold">Total Assets</p>
      <p className="text-2xl font-bold text-blue-700">{summary.totalAssets}</p>
    </div>
    <div className="text-center bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-md border border-green-200">
      <p className="text-xs text-gray-600 uppercase font-semibold">Active Assets</p>
      <p className="text-2xl font-bold text-green-700">{summary.activeAssets}</p>
    </div>
    <div className="text-center bg-gradient-to-br from-red-50 to-rose-50 p-4 rounded-md border border-red-200">
      <p className="text-xs text-gray-600 uppercase font-semibold">Disposed Assets</p>
      <p className="text-2xl font-bold text-red-600">{summary.disposedAssets}</p>
    </div>
    <div className="text-center bg-gradient-to-br from-yellow-50 to-amber-50 p-4 rounded-md border border-yellow-200">
      <p className="text-xs text-gray-600 uppercase font-semibold">Under Maintenance</p>
      <p className="text-2xl font-bold text-orange-600">{summary.underMaintenance}</p>
    </div>
  </div>
);
export const FAFooterSummary = ({ totals }) => {
  const totalPurchase = totals?.totalPurchase || "0.00";
  const totalDepreciation = totals?.totalDepreciation || "0.00";
  const netBookValue = totals?.netBookValue || "0.00";

  return (
    <div className="flex flex-wrap justify-end gap-8 bg-gradient-to-r from-gray-50 to-blue-50 border-t-2 border-indigo-200 p-6">
      <div>
        <p className="text-xs text-gray-600 font-medium">Total Purchase Value</p>
        <p className="font-bold text-blue-700 text-lg">₹{totalPurchase}</p>
      </div>
      <div>
        <p className="text-xs text-gray-600 font-medium">Total Depreciation</p>
        <p className="font-bold text-orange-700 text-lg">₹{totalDepreciation}</p>
      </div>
      <div>
        <p className="text-xs text-gray-600 font-medium">Net Book Value</p>
        <p className="font-bold text-green-700 text-xl">₹{netBookValue}</p>
      </div>
    </div>
  );
};
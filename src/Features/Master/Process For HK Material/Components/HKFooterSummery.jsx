import React from "react";

const HKFooterSummary = () => (
  <div className="flex flex-wrap justify-end gap-8 bg-gray-50 border-t border-gray-200 p-6">
    <div>
      <p className="text-xs text-gray-600">Total Debit</p>
      <p className="font-bold text-green-700 text-lg">₹4,46,000.00</p>
    </div>
    <div>
      <p className="text-xs text-gray-600">Total Credit</p>
      <p className="font-bold text-red-700 text-lg">₹7,81,000.00</p>
    </div>
    <div>
      <p className="text-xs text-gray-600">Closing Balance</p>
      <p className="font-bold text-sky-700 text-lg">₹3,35,000.00 CR</p>
    </div>
  </div>
);

export default HKFooterSummary;

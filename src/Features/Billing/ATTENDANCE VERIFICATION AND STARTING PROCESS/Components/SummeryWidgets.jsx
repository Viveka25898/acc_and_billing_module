import React from "react";

export default function SummaryWidgets({ totalSites, totalStaff }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="bg-green-700 shadow rounded-xl p-6 text-white">
        <h3 className="text-xl font-semibold">Total Sites Pending Punching</h3>
        <p className="text-3xl mt-2">{totalSites}</p>
      </div>
      <div className="bg-green-700 shadow rounded-xl p-6 text-white">
        <h3 className="text-xl font-semibold">Total Staff to be Processed</h3>
        <p className="text-3xl mt-2">{totalStaff}</p>
      </div>
    </div>
  );
}
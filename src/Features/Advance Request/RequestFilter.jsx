import React from 'react';

const RequestFilter = ({ currentDate, onDateChange }) => {
  return (
    <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
      <div className="w-full sm:w-1/2">
        <label className="block mb-1 text-sm font-semibold text-gray-700">Filter by Date</label>
        <input
          type="date"
          value={currentDate}
          onChange={(e) => onDateChange(e.target.value)}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
        />
      </div>
    </div>
  );
};

export default RequestFilter;

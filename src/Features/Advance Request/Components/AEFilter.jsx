import React from 'react';

const AEFilter = ({ filter, setFilter }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-6">
      <div className="w-full sm:w-1/4">
        <label className="block mb-1 text-sm font-semibold text-gray-700">Request ID</label>
        <input
          type="text"
          name="requestId"
          value={filter.requestId}
          onChange={handleChange}
          placeholder="Search by Request ID"
          className="w-full px-3 py-2 border rounded text-sm focus:outline-none"
        />
      </div>

      <div className="w-full sm:w-1/4">
        <label className="block mb-1 text-sm font-semibold text-gray-700">Employee Name</label>
        <input
          type="text"
          name="name"
          value={filter.name}
          onChange={handleChange}
          placeholder="Search by name"
          className="w-full px-3 py-2 border rounded text-sm focus:outline-none"
        />
      </div>

      <div className="w-full sm:w-1/4">
        <label className="block mb-1 text-sm font-semibold text-gray-700">Employee ID</label>
        <input
          type="text"
          name="empId"
          value={filter.empId}
          onChange={handleChange}
          placeholder="Search by ID"
          className="w-full px-3 py-2 border rounded text-sm focus:outline-none"
        />
      </div>

      <div className="w-full sm:w-1/4">
        <label className="block mb-1 text-sm font-semibold text-gray-700">Request Date</label>
        <input
          type="date"
          name="date"
          value={filter.date}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded text-sm focus:outline-none"
        />
      </div>
    </div>
  );
};

export default AEFilter;
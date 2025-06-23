export default function PaymentEntriesFilter({ filters, onChange }) {
  const handleInputChange = (e) => {
    onChange({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="mb-4 w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {/* Status Filter */}
      <div className="w-full">
        <label className="text-sm font-medium block mb-1">Status</label>
        <select
          name="status"
          value={filters.status}
          onChange={handleInputChange}
          className="border px-3 py-2 rounded text-sm w-full"
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Employee Name Filter */}
      <div className="w-full">
        <label className="text-sm font-medium block mb-1">Employee Name</label>
        <input
          type="text"
          name="name"
          value={filters.name}
          onChange={handleInputChange}
          placeholder="Search by name"
          className="border px-3 py-2 rounded text-sm w-full"
        />
      </div>

      {/* Employee Code Filter */}
      <div className="w-full">
        <label className="text-sm font-medium block mb-1">Employee Code</label>
        <input
          type="text"
          name="code"
          value={filters.code}
          onChange={handleInputChange}
          placeholder="Search by code"
          className="border px-3 py-2 rounded text-sm w-full"
        />
      </div>
    </div>
  );
}

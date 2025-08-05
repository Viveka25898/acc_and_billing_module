export default function ConveyanceFilter({ filter, setFilter, showEmployeeFilter }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      {showEmployeeFilter && (
        <div>
          <label className="block text-sm font-medium mb-1">Employee</label>
          <input
            type="text"
            value={filter.employee}
            onChange={(e) => setFilter({...filter, employee: e.target.value})}
            className="w-full border px-3 py-2 rounded"
            placeholder="Filter by employee"
          />
        </div>
      )}
      <div>
        <label className="block text-sm font-medium mb-1">Date</label>
        <input
          type="date"
          value={filter.date}
          onChange={(e) => setFilter({...filter, date: e.target.value})}
          className="w-full border px-3 py-2 rounded"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Status</label>
        <select
          value={filter.status}
          onChange={(e) => setFilter({...filter, status: e.target.value})}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>
    </div>
  );
}
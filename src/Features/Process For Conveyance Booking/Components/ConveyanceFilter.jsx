export default function ConveyanceFilter({ filter, setFilter, showEmployeeFilter, showTransportFilter }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {showEmployeeFilter && (
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
            Employee
          </label>
          <input
            type="text"
            value={filter.employee || ""}
            onChange={(e) => setFilter({ ...filter, employee: e.target.value })}
            className="w-full border border-gray-300 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition"
            placeholder="Filter by employee"
          />
        </div>
      )}
      <div>
        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
          Date
        </label>
        <input
          type="date"
          value={filter.date || ""}
          onChange={(e) => setFilter({ ...filter, date: e.target.value })}
          className="w-full border border-gray-300 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
          Status
        </label>
        <select
          value={filter.status || ""}
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          className="w-full border border-gray-300 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition bg-white"
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>
      {showTransportFilter && (
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
            Transport
          </label>
          <select
            value={filter.transport || ""}
            onChange={(e) => setFilter({ ...filter, transport: e.target.value })}
            className="w-full border border-gray-300 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition bg-white"
          >
            <option value="">All Modes</option>
            <option value="AUTO">Auto</option>
            <option value="CAB">Cab</option>
            <option value="BUS">Bus</option>
            <option value="TRAIN">Train</option>
            <option value="FLIGHT">Flight</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
      )}
    </div>
  );
}
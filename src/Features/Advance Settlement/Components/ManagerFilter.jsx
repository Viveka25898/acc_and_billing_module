const ManagerFilter = ({ filter, setFilter }) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <input
        type="text"
        placeholder="Search by Employee"
        value={filter.employee}
        onChange={(e) => setFilter({ ...filter, employee: e.target.value })}
        className="border p-2 rounded w-full md:w-1/4"
      />
      <select
        value={filter.status}
        onChange={(e) => setFilter({ ...filter, status: e.target.value })}
        className="border p-2 rounded w-full md:w-1/4"
      >
        <option value="All">All Statuses</option>
        <option value="Pending">Pending</option>
        <option value="Approved">Approved</option>
        <option value="Rejected">Rejected</option>
      </select>
      <input
        type="date"
        value={filter.date}
        onChange={(e) => setFilter({ ...filter, date: e.target.value })}
        className="border p-2 rounded w-full md:w-1/4"
      />
    </div>
  );
};
export default ManagerFilter
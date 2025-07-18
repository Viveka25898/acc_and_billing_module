import React, { useState } from "react";
import { useParams } from "react-router-dom"; // ✅ import
import punchingListData from "../data/punchingListdata";
import PunchingTable from "../Components/PunchingTable";
import FilterBar from "../Components/FilterBar";


export default function AttendancePunchingList() {
  const { siteId, month } = useParams(); // ✅ get params

  const [filters, setFilters] = useState({
    month: month || "July 2025",
    client: "",
    status: "",
  });
  

  const filteredData = punchingListData.filter((item) => {
    return (
      (!siteId || item.siteId === siteId) &&
      (!filters.month || item.month === filters.month) &&
      (!filters.client || item.client.toLowerCase().includes(filters.client.toLowerCase())) &&
      (!filters.status || item.status === filters.status)
    );
  });
console.log(punchingListData);
console.log(filteredData);
  return (
    <div className="p-4 space-y-6 max-w-7xl mx-auto">
      <FilterBar filters={filters} setFilters={setFilters} />
      <PunchingTable data={filteredData} />
    </div>
  );
}

import React, { useState } from "react";
import dashboardData from "../data/dashboardData";
import MonthSelector from "../Components/MonthSelector";
import SummaryWidgets from "../Components/SummeryWidgets";
import AttendanceStatusTable from "../Components/AttendenceStatusTable";

export default function AttendencePayrollDashboard() {
  const [selectedMonth, setSelectedMonth] = useState("July 2025");

  const filteredData = dashboardData[selectedMonth] || {
    totalSites: 0,
    totalStaff: 0,
    statusBreakdown: [],
    punchedStats: {},
    errorStats: {},
  };

  return (
    <div className="p-4 space-y-6 max-w-7xl mx-auto bg-white shadow-md rounded-md">
        <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-green-600">
            Attendance Punching Dashboard
            </h1>
            <MonthSelector selected={selectedMonth} onChange={setSelectedMonth} />
        </div>
      <SummaryWidgets totalSites={filteredData.totalSites} totalStaff={filteredData.totalStaff} />
     <AttendanceStatusTable data={filteredData.statusBreakdown} selectedMonth={selectedMonth} />

    </div>
  );
}
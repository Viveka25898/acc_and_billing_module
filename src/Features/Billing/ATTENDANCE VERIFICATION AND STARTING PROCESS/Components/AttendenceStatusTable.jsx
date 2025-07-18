import React from "react";
import { useNavigate } from "react-router-dom";

export default function AttendanceStatusTable({ data, selectedMonth }) {
  const navigate = useNavigate();

  const handleSiteClick = (siteId) => {
    navigate(`/dashboard/payroll-team/attendence-puncing-list/${siteId}/${selectedMonth}`);
  };

  return (
    <div className="rounded-xl p-4 overflow-auto">
      <h3 className="text-xl font-bold mb-4">Sites Attendance Status :</h3>
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gray-100 border">
            <th className="p-2 text-left border">Site</th>
            <th className="p-2 text-left border">Client</th>
            <th className="p-2 text-left border">Pending</th>
            <th className="p-2 text-left border">Punched</th>
            <th className="p-2 text-left border">Rejected</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="border hover:bg-gray-50 transition">
              <td
                className="p-2 border text-blue-600 cursor-pointer hover:underline"
                onClick={() => handleSiteClick(row.siteId)}
              >
                {row.site}
              </td>
              <td className="p-2 border">{row.client}</td>
              <td className="p-2 border">{row.pending}</td>
              <td className="p-2 border">{row.punched}</td>
              <td className="p-2 border">{row.rejected}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

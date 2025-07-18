import React from "react";
import { useNavigate } from "react-router-dom";

export default function PunchingTable({ data }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white shadow rounded-xl p-4 overflow-auto">
      <h3 className="text-lg font-semibold mb-4">Attendance Punching List</h3>
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Site Name</th>
            <th className="p-2 text-left">Client</th>
            <th className="p-2 text-left">Month</th>
            <th className="p-2 text-left">Total Staff</th>
            <th className="p-2 text-left">Forwarded On</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="border-t">
              <td className="p-2">{row.site}</td>
              <td className="p-2">{row.client}</td>
              <td className="p-2">{row.month}</td>
              <td className="p-2">{row.totalStaff}</td>
              <td className="p-2">{row.forwardedOn}</td>
              <td className="p-2">{row.status}</td>
              <td className="p-2">
                <button
                  onClick={() => navigate(`/dashboard/payroll-team/punching-list/${row.siteId}/${row.month}`)}
                  className="text-blue-600 hover:underline"
                >
                  View / Punch
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
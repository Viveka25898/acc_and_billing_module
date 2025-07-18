// File: src/features/attendance-verification/pages/MyUploadedAttendance.jsx
import React, { useState } from "react";
import { FaFilePdf } from "react-icons/fa";

// Dummy data to simulate uploaded attendance records
const dummyAttendanceData = [
  { id: 1, client: "ABC Corp", site: "Mumbai Plant", month: "June 2025", file: "abc-june.pdf" },
  { id: 2, client: "XYZ Ltd", site: "Delhi Office", month: "May 2025", file: "xyz-may.pdf" },
  { id: 3, client: "ABC Corp", site: "Chennai Unit", month: "May 2025", file: "abc-may.pdf" },
  { id: 4, client: "DEF Group", site: "Pune Site", month: "April 2025", file: "def-april.pdf" },
  { id: 5, client: "XYZ Ltd", site: "Hyderabad", month: "June 2025", file: "xyz-june.pdf" },
  { id: 6, client: "ABC Corp", site: "Delhi HQ", month: "June 2025", file: "abc-delhi-june.pdf" }
];

const ITEMS_PER_PAGE = 3;

export default function MyUploadedAttendance() {
  const [searchClient, setSearchClient] = useState("");
  const [searchMonth, setSearchMonth] = useState("");
  const [page, setPage] = useState(1);

  const filteredData = dummyAttendanceData.filter((item) => {
    return (
      (!searchClient || item.client.toLowerCase().includes(searchClient.toLowerCase())) &&
      (!searchMonth || item.month.toLowerCase().includes(searchMonth.toLowerCase()))
    );
  });

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <div className="p-4 space-y-4 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold text-green-600">My Uploaded Attendance</h2>

      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Search by Client"
          className="border px-2 py-1 rounded"
          value={searchClient}
          onChange={(e) => setSearchClient(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search by Month"
          className="border px-2 py-1 rounded"
          value={searchMonth}
          onChange={(e) => setSearchMonth(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left px-4 py-2 border">Client</th>
              <th className="text-left px-4 py-2 border">Site</th>
              <th className="text-left px-4 py-2 border">Month</th>
              <th className="text-left px-4 py-2 border">File</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{record.client}</td>
                <td className="px-4 py-2 border">{record.site}</td>
                <td className="px-4 py-2 border">{record.month}</td>
                <td className="px-4 py-2 border flex items-center gap-2">
                  <FaFilePdf className="text-red-600" />
                  {record.file}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center pt-4">
        <span className="text-sm text-gray-600">
          Page {page} of {totalPages}
        </span>
        <div className="space-x-2">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}


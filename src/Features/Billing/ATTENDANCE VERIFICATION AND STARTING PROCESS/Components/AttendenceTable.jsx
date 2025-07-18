import React, { useState, useMemo } from "react";
import { FaDownload } from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function AttendanceTable({ data }) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filtered = useMemo(() => {
    return data.filter((item) =>
      item["Employee Name"].toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Attendance Report", 14, 15);
    doc.autoTable({
      head: [["Employee Name", "Designation", "Present Days", "Week Offs", "Holidays"]],
      body: data.map((item) => [
        item["Employee Name"],
        item["Designation"],
        item["Present Days"],
        item["Week Offs"],
        item["Holidays"],
      ]),
    });
    doc.save("Attendance_Report.pdf");
  };

  return (
    <div className="bg-white p-4 rounded shadow-md overflow-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-2">
        <input
          type="text"
          placeholder="Search by employee name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full md:w-64"
        />
        <button
          onClick={exportPDF}
          className="bg-indigo-600 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <FaDownload /> Export PDF
        </button>
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
              Employee Name
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
              Designation
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
              Present Days
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
              Week Offs
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
              Holidays
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {paginated.map((row, index) => (
            <tr key={index}>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                {row["Employee Name"]}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                {row["Designation"]}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                {row["Present Days"]}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                {row["Week Offs"]}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                {row["Holidays"]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

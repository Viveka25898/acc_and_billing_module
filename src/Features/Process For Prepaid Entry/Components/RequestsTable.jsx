// File: src/features/prepaidEntry/components/RequestTable.jsx
import React, { useState } from "react";
import Pagination from "./Pagination";

export default function RequestTable({ rows, columns, onApprove, onReject, onGeneratePO }) {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const paginatedRows = rows.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const renderCell = (row, accessor) => {
    if (accessor === "status") {
      return (
        <span
          className={`px-2 border py-1 rounded text-white text-xs ${
            row.status === "Approved"
              ? "bg-green-500"
              : row.status === "Rejected"
              ? "bg-red-500"
              : "bg-yellow-500"
          }`}
        >
          {row.status}
        </span>
      );
    }

    if (accessor === "cost") {
      return `₹${row.cost}`;
    }

    if (accessor === "action") {
      if (row.status === "Pending") {
        return (
          <div className="space-x-2">
            <button
              onClick={() => onApprove(row.id)}
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
            >
              Approve
            </button>
            <button
              onClick={() => onReject(row.id)}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
            >
              Reject
            </button>
          </div>
        );
      }

      if (row.status === "Approved" && !row.poGenerated) {
        return (
          <button
            onClick={() => onGeneratePO(row.id)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
          >
            Generate PO
          </button>
        );
      }

      if (row.status === "Approved" && row.poGenerated) {
        return <span className="text-green-600 font-semibold">PO Generated</span>;
      }

      return <span className="text-gray-500 italic">{row.status}</span>;
    }

    return row[accessor];
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow rounded-xl">
        <thead>
          <tr className="bg-gray-200 text-left border">
            {columns.map((col) => (
              <th
                key={col.accessor}
                className="px-4 py-2 text-sm font-medium border"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedRows.map((row) => (
            <tr
              key={row.id}
              className="border-t hover:bg-gray-50 text-sm transition"
            >
              {columns.map((col) => (
                <td key={col.accessor} className="px-4 py-2 border">
                  {renderCell(row, col.accessor)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        totalRows={rows.length}
        rowsPerPage={rowsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

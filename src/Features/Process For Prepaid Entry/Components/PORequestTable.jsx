// File: src/components/common/ReusableTable.jsx

import React from "react";

export default function PORequestTable({ columns, data }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full text-sm border border-gray-200 table-auto">
        <thead className="bg-gray-200 text-gray-700 border">
          <tr className="border">
            {columns.map((col) => (
              <th
                key={col.accessor}
                className="px-2 py-2 border text-left font-semibold whitespace-nowrap"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50 text-gray-800">
              {columns.map((col) => (
                <td
                  key={col.accessor}
                  className="px-2 py-2 border whitespace-nowrap"
                >
                  {col.render ? col.render(row) : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

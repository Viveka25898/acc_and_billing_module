// File: src/components/rent/SiteTable.jsx
import React, { useState } from "react";

const dummySites = [
  { id: 1, city: "Mumbai", siteName: "Site A", location: "Andheri", owner: "Mr. A", gst: true, startDate: "2024-04-01", endDate: "2025-03-31" },
  { id: 2, city: "Mumbai", siteName: "Site B", location: "Borivali", owner: "Mrs. B", gst: false, startDate: "2024-06-01", endDate: "2025-05-31" },
  { id: 3, city: "Delhi", siteName: "Site C", location: "Saket", owner: "Mr. C", gst: true, startDate: "2024-01-01", endDate: "2024-12-31" },
];

export default function SiteTable({ city, onUploadClick }) {
  const [page, setPage] = useState(1);
  const perPage = 2;

  const filtered = dummySites.filter((site) => site.city === city);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  return (
    <div className="bg-white rounded shadow-md p-4 mb-10">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Sites in {city}</h2>

      <table className="w-full table-auto border">
        <thead className="bg-gray-100 text-sm">
          <tr>
            <th className="border px-3 py-2">Site Name</th>
            <th className="border px-3 py-2">Location</th>
            <th className="border px-3 py-2">Owner Ledger</th>
            <th className="border px-3 py-2">GST</th>
            <th className="border px-3 py-2">Rent Period</th>
            <th className="border px-3 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((site) => (
            <tr key={site.id} className="text-sm text-center">
              <td className="border px-3 py-2">{site.siteName}</td>
              <td className="border px-3 py-2">{site.location}</td>
              <td className="border px-3 py-2">{site.owner}</td>
              <td className="border px-3 py-2">{site.gst ? "Yes" : "No"}</td>
              <td className="border px-3 py-2">
                {site.startDate} to {site.endDate}
              </td>
              <td className="border px-3 py-2">
                <button
                  onClick={onUploadClick}
                  className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  Upload Rent Agreement
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-center mt-4 gap-2">
        {Array.from({ length: totalPages }).map((_, idx) => (
          <button
            key={idx + 1}
            className={`px-3 py-1 rounded ${page === idx + 1 ? "bg-green-600 text-white" : "bg-gray-200"}`}
            onClick={() => setPage(idx + 1)}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

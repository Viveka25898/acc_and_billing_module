import React, { useState } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function UnifiedReconciliationTable({ data: initialData }) {
  const [data, setData] = useState(initialData);
  const navigate = useNavigate();

  const handleDoubleClick = (index) => {
    const entry = data[index];
    if (entry.inBank && !entry.inBooks) {
      const confirm = window.confirm("Are you sure you want to add this entry to your book?");
      if (confirm) {
        const newData = [...data];
        newData[index] = { ...newData[index], inBooks: true };
        setData(newData);
      }
    }
  };

  const handleViewStatement = () => {
    navigate("/dashboard/billing-manager/bank-reconciliation-page", { state: { data } });
  };

  return (
    <div className="space-y-6">
     

      <div className="overflow-auto border rounded-md shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Amount</th>
              <th className="px-4 py-2 text-left">Description</th>
              <th className="px-4 py-2 text-center">In Bank</th>
              <th className="px-4 py-2 text-center">In Books</th>
              <th className="px-4 py-2 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry, idx) => {
              const isMatched = entry.inBank && entry.inBooks;
              const statusColor = isMatched ? "text-green-600" : "text-red-600";
              const statusLabel = isMatched
                ? "Matched"
                : entry.inBank && !entry.inBooks
                ? "Only in Bank"
                : "Only in Books";

              return (
                <tr
                  key={idx}
                  className="border-t hover:bg-gray-50"
                  onDoubleClick={() => handleDoubleClick(idx)}
                >
                  <td className="px-4 py-2">{entry.date}</td>
                  <td className="px-4 py-2">₹{entry.amount}</td>
                  <td className="px-4 py-2">{entry.description}</td>
                  <td className="px-4 py-2 text-center">
                    {entry.inBank ? (
                      <FaCheckCircle className="text-green-600 w-4 h-4 mx-auto" />
                    ) : (
                      <FaTimesCircle className="text-red-600 w-4 h-4 mx-auto" />
                    )}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {entry.inBooks ? (
                      <FaCheckCircle className="text-green-600 w-4 h-4 mx-auto" />
                    ) : (
                      <FaTimesCircle className="text-red-600 w-4 h-4 mx-auto" />
                    )}
                  </td>
                  <td className={`px-4 py-2 text-center font-semibold ${statusColor}`}>{statusLabel}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
      </div>
       <div className="flex justify-end">
        <button
          onClick={handleViewStatement}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          See Reconciliation Statement
        </button>
      </div>
    </div>
  );
}

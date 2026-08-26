import React from "react";
import { FiEye, FiClock, FiCheckCircle, FiXCircle, FiFileText } from "react-icons/fi";

export default function ConveyanceTable({ requests, onViewReason, onViewFile }) {
  const getStatusBadge = (status) => {
    const statusLower = (status || "").toLowerCase();

    if (statusLower.includes("approved")) {
      return (
        <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-semibold bg-green-100 text-green-800 border border-green-200">
          <FiCheckCircle size={12} /> {status}
        </span>
      );
    }
    if (statusLower.includes("rejected")) {
      return (
        <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-semibold bg-red-100 text-red-800 border border-red-200">
          <FiXCircle size={12} /> {status}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200">
        <FiClock size={12} /> {status || "Pending Approval"}
      </span>
    );
  };

  return (
    <div className="overflow-x-auto border border-gray-200 rounded-2xl bg-white shadow-sm">
      <table className="w-full text-sm text-left border-collapse">
        <thead className="bg-gradient-to-r from-green-700 to-green-600 text-white text-xs font-semibold uppercase tracking-wider">
          <tr>
            <th className="px-4 py-3.5">Request ID / Date</th>
            <th className="px-4 py-3.5">Client / Site</th>
            <th className="px-4 py-3.5">Purpose</th>
            <th className="px-4 py-3.5">Transport</th>
            <th className="px-4 py-3.5">Distance</th>
            <th className="px-4 py-3.5">Amount (₹)</th>
            <th className="px-4 py-3.5">Status</th>
            <th className="px-4 py-3.5 text-center">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 text-gray-700">
          {requests.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center py-10 text-gray-500 font-medium">
                📭 No conveyance claims found.
              </td>
            </tr>
          ) : (
            requests.map((r) => {
              const formattedDate = r.date ? r.date.split("T")[0] : "N/A";
              const isRejected = (r.status || "").toLowerCase().includes("rejected");

              return (
                <tr key={r.id} className="hover:bg-gray-50/80 transition duration-150">
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="font-semibold text-gray-900 text-xs">{r.id}</div>
                    <div className="text-xs text-gray-500 font-medium">{formattedDate}</div>
                  </td>

                  <td className="px-4 py-3.5 font-medium text-gray-800">
                    {r.client || r.client_name || "N/A"}
                  </td>

                  <td className="px-4 py-3.5 max-w-[220px] truncate text-gray-600" title={r.purpose}>
                    {r.purpose || "N/A"}
                  </td>

                  <td className="px-4 py-3.5 font-semibold text-xs uppercase text-green-700">
                    {r.transport || r.transport_mode || "N/A"}
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap font-medium text-gray-700">
                    {r.distance ? `${r.distance} km` : "N/A"}
                  </td>

                  <td className="px-4 py-3.5 font-bold text-gray-900 whitespace-nowrap">
                    ₹{Number(r.amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap">
                    {getStatusBadge(r.status)}
                  </td>

                  <td className="px-4 py-3.5 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-2">
                      {isRejected && (
                        <button
                          onClick={() => onViewReason(r)}
                          type="button"
                          className="px-2.5 py-1 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition duration-150 flex items-center gap-1 cursor-pointer border border-red-200"
                          title="View Rejection Reason"
                        >
                          <FiEye size={12} /> Reason
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

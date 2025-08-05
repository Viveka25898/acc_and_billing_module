import React from "react";
import { FaEye } from "react-icons/fa";

export default function ConveyanceTable({ requests, onEyeClick }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border border-gray-200 bg-white rounded-lg text-sm">
        <thead className="bg-gray-100 text-gray-700 border">
          <tr>
            <th className="p-2 border text-left">Date</th>
            <th className="p-2 border text-left">Purpose</th>
            <th className="p-2 border text-left">Client</th>
            <th className="p-2 border text-left">Transport</th>
            <th className="p-2 border text-left">Distance</th>
            <th className="p-2 border text-left">Amount</th>
            <th className="p-2 border text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {requests.length === 0 && (
            <tr>
              <td colSpan="7" className="text-center p-4 text-gray-500">
                No requests found.
              </td>
            </tr>
          )}
          {requests.map((r) => (
            <tr key={r.id} className="border-t">
              <td className="p-2 border">{r.date}</td>
              <td className="p-2 border">{r.purpose}</td>
              <td className="p-2 border">{r.client}</td>
              <td className="p-2 border">{r.transport}</td>
              <td className="p-2 border">{r.distance} km</td>
              <td className="p-2 border">₹{r.amount}</td>
              <td className="p-2 border">
                <span
                className={`text-xs px-2 border py-1 rounded-full font-medium
                  ${r.status === "Approved"
                    ? "bg-green-100 text-green-700"
                    : r.status === "Pending VP Approval"
                    ? "bg-blue-100 text-blue-700"
                    : r.status.includes("Rejected")
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-800"}`}
              >
                {r.status}
              </span>
                {r.status === "Rejected" && r.rejectionReason && (
                  <button
                    className="ml-2 text-blue-600 hover:text-blue-800"
                    onClick={() => onEyeClick(r.rejectionReason)}
                    title="View Reason"
                  >
                    <FaEye />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

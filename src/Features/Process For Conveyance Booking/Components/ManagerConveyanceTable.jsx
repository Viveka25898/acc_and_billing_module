// File: src/features/conveyance/components/ManagerConveyanceTable.jsx

import React from "react";
import { FaEye } from "react-icons/fa";

export default function ManagerConveyanceTable({ claims, onApprove, onReject, onViewReceipt }) {
  return (
    <div className="overflow-x-auto border border-gray-200 bg-white">
      <table className="w-full text-sm border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border text-left">Employee</th>
            <th className="p-2 border text-left">Date</th>
            <th className="p-2 border text-left">Client</th>
            <th className="p-2 border text-left">Site</th>
            <th className="p-2 border text-left">Transport</th>
            <th className="p-2 border text-left">Distance</th>
            <th className="p-2 border text-left">Amount</th>
            <th className="p-2 border text-left">Status</th>
            <th className="p-2 border text-left">Receipt</th>
            <th className="p-2 border text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {claims.length === 0 && (
            <tr>
              <td colSpan="10" className="text-center p-4 text-gray-500">
                No pending requests.
              </td>
            </tr>
          )}
          {claims.map((claim) => (
            <tr key={claim.id}>
              <td className="p-2 border">{claim.employee}</td>
              <td className="p-2 border">{claim.date}</td>
              <td className="p-2 border">{claim.client}</td>
              <td className="p-2 border">{claim.site}</td>
              <td className="p-2 border">{claim.transport}</td>
              <td className="p-2 border">{claim.distance} km</td>
              <td className="p-2 border">₹{claim.amount}</td>
              <td className="p-2 border">
                <span
                  className={`text-xs px-2 border py-1 rounded-full font-medium
                    ${claim.status === "Approved"
                      ? "bg-green-100 text-green-700"
                      : claim.status === "Rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-800"}`}
                >
                  {claim.status}
                </span>
              </td>
              <td className="p-2 border">
                {claim.receiptUrl ? (
                  <button
                    title="View Receipt"
                    onClick={() => onViewReceipt(claim.receiptUrl)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FaEye />
                  </button>
                ) : (
                  <span className="text-gray-400">--</span>
                )}
              </td>
              <td className="p-2 border ">
                {claim.status === "Pending" ? (
                  <>
                    <button
                      onClick={() => onApprove(claim.id)}
                      className="text-white bg-green-600 px-2 py-1 rounded hover:bg-green-700 mb-1"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => onReject(claim.id)}
                      className="text-white bg-red-600 px-2 py-1 rounded hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <span className="text-gray-500 italic">No Action</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
// PaidComplianceTable.js
import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import AEPaidChallanPreviewModal from "./PaidChallanPreviewModal";

export default function PaidComplianceTable({ entries }) {
  const [previewFile, setPreviewFile] = useState(null);

  // Helper to get approval details
  const getApprovalDetails = (history) => {
    const aeApproval = history?.find(item => item.action.includes("Account Executive"));
    const managerApproval = history?.find(item => item.action.includes("Compliance Manager"));
    
    return {
      approvedByAE: aeApproval?.by || "N/A",
      approvedByManager: managerApproval?.by || "N/A",
      approvedAt: aeApproval?.at || "N/A"
    };
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Req ID</th>
            <th className="p-2 border">Type</th>
            <th className="p-2 border">Period</th>
            <th className="p-2 border">Amount</th>
            <th className="p-2 border">Challan</th>
            <th className="p-2 border">Remarks</th>
            <th className="p-2 border">Approved By</th>
            <th className="p-2 border">Payment Date</th>
            <th className="p-2 border">Status</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {entries.map((entry) => {
            const approvalDetails = getApprovalDetails(entry.history);
            
            return (
              <tr key={entry.id} className="hover:bg-gray-50">
                <td className="p-2 border">#{entry.id.slice(-6)}</td>
                <td className="p-2 border">{entry.type}</td>
                <td className="p-2 border">{entry.period}</td>
                <td className="p-2 border">₹{entry.amount}</td>
                <td className="p-2 border">
                  {entry.challanRef && (
                    <button
                      onClick={() => setPreviewFile(entry.challanRef)}
                      className="text-blue-600 hover:text-blue-800 cursor-pointer"
                      title="View Challan"
                    >
                      <FaEye/>
                    </button>
                  )}
                </td>
                <td className="p-2 border">{entry.remarks}</td>
                <td className="p-2 border">
                  <div className="text-xs">
                    <div>Manager: {approvalDetails.approvedByManager}</div>
                    <div>AE: {approvalDetails.approvedByAE}</div>
                  </div>
                </td>
                <td className="p-2 border">
                  {new Date(approvalDetails.approvedAt).toLocaleDateString()}
                </td>
                <td className="p-2 border">
                  <span className="text-green-600 font-medium">Paid</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {previewFile && (
        <AEPaidChallanPreviewModal 
          file={previewFile} 
          onClose={() => setPreviewFile(null)} 
        />
      )}
    </div>
  );
}
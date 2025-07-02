/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { FaEye, FaFilePdf } from "react-icons/fa";
import RejectionModal from "./RejectionModal";
import DocumentPreviewModal from "./DocumentPreviewModal";
export default function Table({ columns, data, onAccept, onReject }) {
  const [selectedId, setSelectedId] = useState(null);
const [showRejectModal, setShowRejectModal] = useState(false);
const [showDocModal, setShowDocModal] = useState(false);
const [documentData, setDocumentData] = useState(null);


  const handleRejectClick = (id) => {
    setSelectedId(id);
    setShowRejectModal(true);
  };

  const handleRejectSubmit = (reason) => {
    onReject(selectedId, reason);
    setShowRejectModal(false);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((col, index) => (
              <th key={index} className="border px-2 py-1 text-center">{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
                {data.map((row, idx) => (
                    <tr key={row.id || idx} className="text-center">
                            {columns.map((col, colIdx) => {
                            if (col.key === "invoice") {
                            return (
                            <td key={colIdx} className="border px-2 py-1 text-center">
                            <button
                                onClick={() => {
                                setDocumentData({
                                    documentType: "Invoice",
                                    documentNumber: row.invoiceNo,
                                    vendorName: row.vendorName,
                                    uploadedDate: row.uploadedDate,
                                    poNumbers: row.poNumbers,
                                    totalAmount: row.totalAmount,
                                    uploadedBy: "System",
                                    status: row.status,
                                    remarks: row.rejectionReason,
                                    documentUrl: row.invoiceUrl,
                                });
                                setShowDocModal(true);
                                }}
                                className="text-blue-600 hover:text-blue-800"
                            >
                                <FaEye 
                                />
                            </button>
                                    </td>
                                );
                                } else if (col.key === "dc") {
                                return (
                                    <td key={colIdx} className="border px-2 py-1 text-center">
                                    <button
                                        onClick={() => {
                                        setDocumentData({
                                            documentType: "DC",
                                            documentNumber: row.invoiceNo,
                                            vendorName: row.vendorName,
                                            uploadedDate: row.uploadedDate,
                                            poNumbers: row.poNumbers,
                                            totalAmount: row.totalAmount,
                                            uploadedBy: "System",
                                            status: row.status,
                                            remarks: row.rejectionReason,
                                            documentUrl: row.dcUrl,
                                        });
                                        setShowDocModal(true);
                                        }}
                                        className="text-green-600 hover:text-green-800"
                                    >
                                        <FaEye />
                                    </button>
                                    </td>
                                );
                                }else if (col.key === "action") {
                                    const isActionTaken = row.status !== "Pending";
                                return (
                                    <td key={colIdx} className="border px-2 py-1 space-x-2">
                                    <button
                                        onClick={() => onAccept(row.id)}
                                    className={`px-3 py-1 rounded text-xs mb-1 ${
                                        isActionTaken ? "bg-green-200 cursor-not-allowed" : "bg-green-500 text-white mb-2"
                                        }`}
                                        disabled={isActionTaken}
                                    >
                                        Accept
                                    </button>
                                    <button
                                        onClick={() => handleRejectClick(row.id)}
                                        className={`px-3 py-1 rounded text-xs ${
                                            isActionTaken ? "bg-green-200 cursor-not-allowed" : "bg-red-500 text-white"
                                            }`}
                                            disabled={isActionTaken}
                                    >
                                        Reject
                                    </button>
                                    </td>
                                );
                                }    
                                else {
                                return (
                                    <td key={colIdx} className="border px-2 py-1">
                                    {Array.isArray(row[col.key]) ? row[col.key].join(", ") : row[col.key]}
                                    </td>
                                );
                                }
                            })}
                            </tr>
                        ))}
        </tbody>
      </table>

      {/* Rejection Modal */}
                <RejectionModal
                isOpen={showRejectModal}
                onClose={() => setShowRejectModal(false)}
                onSubmit={handleRejectSubmit}
                />

{/* Document Preview Modal */}
                <DocumentPreviewModal
                isOpen={showDocModal}
                onClose={() => setShowDocModal(false)}
                document={documentData}
                type={documentData?.documentType}
                />

    </div>
  );
}

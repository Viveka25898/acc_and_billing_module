/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { FaEye, FaEdit, FaDownload, FaCalendar } from "react-icons/fa";

export default function POListTable({ pos }) {
  const [selectedReason, setSelectedReason] = useState(null);
  const [selectedPO, setSelectedPO] = useState(null);

  const getFinanceStatusColor = (status) => {
    const financeStatusColors = {
      "pending": "bg-yellow-100 text-yellow-800",
      "approved": "bg-green-100 text-green-800",
      "rejected": "bg-red-100 text-red-800"
    };
    return financeStatusColors[status] || "bg-gray-100 text-gray-800";
  };

  const getVendorStatusColor = (status) => {
    const vendorStatusColors = {
      "po-sent": "bg-purple-100 text-purple-800",
      "invoice-pending": "bg-orange-100 text-orange-800",
      "invoice-uploaded": "bg-blue-100 text-blue-800",
      "under-review": "bg-yellow-100 text-yellow-800",
      "approved": "bg-green-100 text-green-800", 
      "rejected": "bg-red-100 text-red-800"
    };
    return vendorStatusColors[status] || "bg-gray-100 text-gray-800";
  };

  const handleViewDetails = (po) => {
    setSelectedPO(po);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short', 
      year: 'numeric'
    });
  };

  if (pos.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <p className="text-gray-500 text-lg">No POs found matching your criteria</p>
        <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left font-medium text-gray-700 border-b">PO Details</th>
              <th className="p-3 text-left font-medium text-gray-700 border-b">Vendor Info</th>
              <th className="p-3 text-left font-medium text-gray-700 border-b">Type & Amount</th>
              <th className="p-3 text-center font-medium text-gray-700 border-b">Vendor Status</th>
              <th className="p-3 text-center font-medium text-gray-700 border-b">Finance Head Status</th>
              <th className="p-3 text-center font-medium text-gray-700 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pos.map((po, i) => (
              <tr key={po.id} className="hover:bg-gray-50 border-b">
                {/* PO Details */}
                <td className="p-3">
                  <div className="space-y-1">
                    <div className="font-semibold text-gray-900">{po.poNumber}</div>
                    <div className="text-xs text-gray-600 truncate max-w-40" title={po.description}>
                      {po.description}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <FaCalendar className="w-3 h-3" />
                      {formatDate(po.createdDate)}
                    </div>
                  </div>
                </td>

                {/* Vendor Info */}
                <td className="p-3">
                  <div className="space-y-1">
                    <div className="font-medium text-gray-900">{po.vendorName}</div>
                   
                  </div>
                </td>

                {/* Type & Amount */}
                <td className="p-3">
                  <div className="space-y-1">
                    <div className="font-semibold text-gray-900">₹{po.amount}</div>
                    <div className="text-xs capitalize text-gray-600">
                      {po.poType} • {po.expenseType.replace('-', ' ')}
                    </div>
                    {po.invoiceAmount && (
                      <div className="text-xs text-blue-600">
                        Invoice: ₹{po.invoiceAmount}
                      </div>
                    )}
                  </div>
                </td>

                {/* Vendor Status */}
                <td className="p-3 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getVendorStatusColor(po.vendorStatus.status)}`}>
                    {po.vendorStatus.label}
                  </span>
                  {po.vendorStatus.status === "rejected" && (
                    <button 
                      onClick={() => setSelectedReason(po.rejectionReason)}
                      className="ml-1 text-red-600 hover:text-red-800"
                      title="View rejection reason"
                    >
                      <FaEye className="w-3 h-3" />
                    </button>
                  )}
                </td>

                {/* Finance Head Status */}
                <td className="p-3 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getFinanceStatusColor(po.financeApproval)}`}>
                    {po.financeApproval.toUpperCase()}
                  </span>
                  {po.financeApproval === "rejected" && (
                    <button 
                      onClick={() => setSelectedReason(po.rejectionReason)}
                      className="ml-1 text-red-600 hover:text-red-800"
                      title="View rejection reason"
                    >
                      <FaEye className="w-3 h-3" />
                    </button>
                  )}
                </td>

                {/* Actions */}
                <td className="p-3">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => handleViewDetails(po)}
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                      title="View Details"
                    >
                      <FaEye className="w-4 h-4" />
                    </button>
                    
                    {po.status === "pending" && (
                      <button
                        className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
                        title="Edit PO"
                      >
                        <FaEdit className="w-4 h-4" />
                      </button>
                    )}
                    
                    <button
                      className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded"
                      title="Download PO"
                    >
                      <FaDownload className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PO Details Modal */}
      {selectedPO && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-900">PO Details</h3>
              <button
                className="text-gray-400 hover:text-gray-600"
                onClick={() => setSelectedPO(null)}
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <label className="font-medium text-gray-700">PO Number:</label>
                <p className="text-gray-900">{selectedPO.poNumber}</p>
              </div>
              
              <div>
                <label className="font-medium text-gray-700">Vendor Name:</label>
                <p className="text-gray-900">{selectedPO.vendorName}</p>
              </div>
              
              <div>
                <label className="font-medium text-gray-700">Amount:</label>
                <p className="text-gray-900">₹{selectedPO.amount}</p>
              </div>
              
              <div>
                <label className="font-medium text-gray-700">PO Type:</label>
                <p className="text-gray-900 capitalize">{selectedPO.poType}</p>
              </div>
              
              <div>
                <label className="font-medium text-gray-700">Expense Type:</label>
                <p className="text-gray-900 capitalize">{selectedPO.expenseType.replace('-', ' ')}</p>
              </div>
              
              <div>
                <label className="font-medium text-gray-700">Created Date:</label>
                <p className="text-gray-900">{formatDate(selectedPO.createdDate)}</p>
              </div>
              
              <div>
                <label className="font-medium text-gray-700">Start Date:</label>
                <p className="text-gray-900">{formatDate(selectedPO.startDate)}</p>
              </div>
              
              {selectedPO.endDate && (
                <div>
                  <label className="font-medium text-gray-700">End Date:</label>
                  <p className="text-gray-900">{formatDate(selectedPO.endDate)}</p>
                </div>
              )}
              
              <div className="md:col-span-2">
                <label className="font-medium text-gray-700">Description:</label>
                <p className="text-gray-900 mt-1">{selectedPO.description}</p>
              </div>

              <div>
                <label className="font-medium text-gray-700">Vendor Status:</label>
                <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${getVendorStatusColor(selectedPO.vendorStatus.status)}`}>
                  {selectedPO.vendorStatus.label}
                </span>
              </div>

              <div>
                <label className="font-medium text-gray-700">Finance Head Status:</label>
                <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${getFinanceStatusColor(selectedPO.financeApproval)}`}>
                  {selectedPO.financeApproval.toUpperCase()}
                </span>
              </div>

              {selectedPO.invoiceAmount && (
                <div>
                  <label className="font-medium text-gray-700">Invoice Amount:</label>
                  <p className="text-gray-900">₹{selectedPO.invoiceAmount}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                onClick={() => setSelectedPO(null)}
              >
                Close
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Download PO
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Reason Modal */}
      {selectedReason && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4 text-red-600">Rejection Reason</h3>
            <p className="text-sm text-gray-700 mb-4">{selectedReason}</p>
            <div className="text-right">
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={() => setSelectedReason(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
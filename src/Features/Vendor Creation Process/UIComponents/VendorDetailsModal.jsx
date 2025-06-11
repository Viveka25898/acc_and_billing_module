import React from "react";

export default function VendorDetailsModal({ vendor, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div className="bg-white w-full max-w-md mx-auto rounded-xl shadow-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-gray-500 hover:text-red-600 text-xl"
        >
          &times;
        </button>
        <h2 className="text-lg font-semibold mb-4 text-center">Vendor Details</h2>
        <div className="space-y-2 text-sm text-gray-700">
          <p><strong>PAN:</strong> {vendor.pan}</p>
          <p><strong>GSTIN:</strong> {vendor.gstin}</p>
          <p><strong>Nature of Expense:</strong> {vendor.expenseType}</p>
          <p><strong>TDS Rate:</strong> {vendor.tdsRate}%</p>
          <p><strong>Vendor Type:</strong> {vendor.vendorType}</p>
          <p><strong>Address:</strong> {vendor.address}</p>
          <p><strong>Contact Person:</strong> {vendor.contactPerson}</p>
          <p><strong>Contact No:</strong> {vendor.contactNumber}</p>
          <p><strong>Email:</strong> {vendor.email}</p>
        </div>
      </div>
    </div>
  );
}

import React from "react";

export default function VendorEditModal({ vendor, onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-xl text-gray-500 hover:text-red-600"
        >
          &times;
        </button>
        <h2 className="text-lg font-semibold mb-4">Edit Vendor (Coming Soon)</h2>
        <p className="text-sm text-gray-700">Edit form for "{vendor.vendorName}" will be added here.</p>
      </div>
    </div>
  );
}

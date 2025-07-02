// File: src/features/vendor/pages/VendorInvoicePreviewPage.jsx

import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function VendorInvoicePreviewPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state || !state.formData) {
    return <div className="text-center text-red-600 mt-10">No invoice data found. Please submit the form first.</div>;
  }

  const {
    invoiceDate,
    invoiceNumber,
    requesterName,
    companyName,
    address,
    cityStateZip,
    phone,
    email,
    billTo,
    shipTo,
    items,
    remarks,
    discount,
    taxRate,
    shipping,
  } = state.formData;

  const subtotal = items.reduce((sum, item) => sum + item.qty * item.price, 0);
  const taxAmount = ((subtotal - discount) * taxRate) / 100;
  const total = subtotal - discount + taxAmount + parseFloat(shipping);

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-md mt-6 divide-y divide-gray-300">
      <div className="flex justify-between items-center pb-4">
        <h2 className="text-2xl font-bold text-green-700">Invoice Preview</h2>
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-300 hover:bg-gray-400 text-sm px-4 py-2 rounded"
        >
          Back to Form
        </button>
      </div>

      {/* Company and Client Details */}
      <div className="grid grid-cols-2 gap-6 py-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-700 border-b pb-1 mb-2">Company / Seller Info</h3>
          <p className="text-sm">{companyName}</p>
          <p className="text-sm">{address}</p>
          <p className="text-sm">{cityStateZip}</p>
          <p className="text-sm">Phone: {phone}</p>
          <p className="text-sm">Email: {email}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-md font-semibold mb-1">Bill To</h3>
            <p className="text-sm">{billTo.contactName}</p>
            <p className="text-sm">{billTo.clientCompany}</p>
            <p className="text-sm">{billTo.address}</p>
            <p className="text-sm">{billTo.phone}</p>
            <p className="text-sm">{billTo.email}</p>
          </div>
          <div>
            <h3 className="text-md font-semibold mb-1">Shipping To</h3>
            <p className="text-sm">{shipTo.nameOrDept}</p>
            <p className="text-sm">{shipTo.clientCompany}</p>
            <p className="text-sm">{shipTo.address}</p>
            <p className="text-sm">{shipTo.phone}</p>
          </div>
        </div>
      </div>

      {/* Invoice Info */}
      <div className="grid grid-cols-3 gap-6 text-sm py-4">
        <p><strong>Invoice No:</strong> {invoiceNumber}</p>
        <p><strong>Date:</strong> {invoiceDate}</p>
        <p><strong>Requested By:</strong> {requesterName}</p>
      </div>

      {/* Items Table */}
      <div className="py-4 overflow-x-auto">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Itemized Breakdown</h3>
        <table className="w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1">#</th>
              <th className="border px-2 py-1">Item Name</th>
              <th className="border px-2 py-1">Qty</th>
              <th className="border px-2 py-1">Price</th>
              <th className="border px-2 py-1">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td className="border px-2 py-1 text-center">{index + 1}</td>
                <td className="border px-2 py-1">{item.itemName}</td>
                <td className="border px-2 py-1 text-center">{item.qty}</td>
                <td className="border px-2 py-1 text-right">₹{item.price.toFixed(2)}</td>
                <td className="border px-2 py-1 text-right">₹{item.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Financial Summary & Remarks */}
      <div className="grid grid-cols-2 gap-6 text-sm py-4">
        <div>
          <h4 className="font-semibold mb-2">Remarks / Instructions:</h4>
          <div className="border px-3 py-2 rounded bg-gray-50 text-gray-700">
            {remarks || "-"}
          </div>
        </div>

        <div className="space-y-1 bg-gray-50 border rounded p-4">
          <p><strong>Subtotal:</strong> ₹{subtotal.toFixed(2)}</p>
          <p><strong>Discount:</strong> ₹{discount}</p>
          <p><strong>Tax ({taxRate}%):</strong> ₹{taxAmount.toFixed(2)}</p>
          <p><strong>Shipping:</strong> ₹{parseFloat(shipping).toFixed(2)}</p>
          <hr />
          <p className="text-green-700 font-semibold text-lg">
            <strong>Total:</strong> ₹{total.toFixed(2)}
          </p>
        </div>
      </div>

      <p className="text-xs text-gray-500 mt-6">Company Seal and Signature</p>
    </div>
  );
}
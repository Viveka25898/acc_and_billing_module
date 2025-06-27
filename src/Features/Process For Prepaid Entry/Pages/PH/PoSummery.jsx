// File: src/features/prepaidEntry/components/POSummary.jsx
import React from "react";

export default function POSummary({ poData }) {
  const {
    supplierName,
    supplierAddress,
    supplierGST,
    supplierContact,
    supplierEmail,
    supplierCode,
    poNumber,
    poDate,
    expiryDays,
    billTo,
    shipTo,
    paymentDateTerm,
    paymentTerm,
    items,
    discount,
    total,
    grandTotal,
  } = poData || {};

  return (
    <div className="p-4 max-w-6xl mx-auto text-sm">
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold tracking-widest uppercase">Purchase Order</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-4">
        <div className="space-y-1">
          <h2 className="font-semibold text-gray-700">Supplier Details</h2>
          <p><strong>Name:</strong> {supplierName}</p>
          <p><strong>Address:</strong> {supplierAddress}</p>
          <p><strong>GSTIN:</strong> {supplierGST}</p>
          <p><strong>Contact:</strong> {supplierContact}</p>
          <p><strong>Email:</strong> {supplierEmail}</p>
        </div>
        <div className="space-y-1">
          <h2 className="font-semibold text-gray-700">PO Details</h2>
          <p><strong>Supplier Code:</strong> {supplierCode}</p>
          <p><strong>PO No:</strong> {poNumber}</p>
          <p><strong>PO Date:</strong> {poDate}</p>
          <p><strong>PO Expiry Days:</strong> {expiryDays}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-4">
        <div>
          <h3 className="font-semibold">Bill To:</h3>
          <p>{billTo}</p>
        </div>
        <div>
          <h3 className="font-semibold">Ship To:</h3>
          <p>{shipTo}</p>
        </div>
      </div>

      <div className="flex justify-between mb-4">
        <p><strong>Payment Date:</strong> {paymentDateTerm}</p>
        <p><strong>Payment Terms:</strong> {paymentTerm}</p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border text-xs">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1">S.No</th>
              <th className="border px-2 py-1">Product Code</th>
              <th className="border px-2 py-1">Product Name</th>
              <th className="border px-2 py-1">HSN Code</th>
              <th className="border px-2 py-1">Qty</th>
              <th className="border px-2 py-1">Units</th>
              <th className="border px-2 py-1">Rate</th>
              <th className="border px-2 py-1">Tax %</th>
              <th className="border px-2 py-1">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items?.map((item, index) => {
              const amount = item.quantity * item.rate + (item.quantity * item.rate * item.tax) / 100;
              return (
                <tr key={index} className="text-center">
                  <td className="border px-2 py-1">{index + 1}</td>
                  <td className="border px-2 py-1">{item.productCode}</td>
                  <td className="border px-2 py-1">{item.productName}</td>
                  <td className="border px-2 py-1">{item.hsnCode}</td>
                  <td className="border px-2 py-1">{item.quantity}</td>
                  <td className="border px-2 py-1">{item.units}</td>
                  <td className="border px-2 py-1">₹{item.rate}</td>
                  <td className="border px-2 py-1">{item.tax}%</td>
                  <td className="border px-2 py-1">₹{amount.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="text-right mt-4 space-y-1">
        <p><strong>Total:</strong> ₹{total?.toFixed(2)}</p>
        <p><strong>Discount:</strong> ₹{discount}</p>
        <p className="font-bold text-green-700 text-lg">Grand Total: ₹{grandTotal?.toFixed(2)}</p>
      </div>

      <div className="mt-6 text-xs text-gray-600 border-t pt-3">
        <p>1. We deserve the right to cancel the purchase order anytime before product shipment.</p>
        <p>2. Invoice raised should contain the details of PO with mentioned date.</p>
        <p>3. Adherence to product specs is a must. Any deviation may cancel PO.</p>
        <p>4. Packing/shipping to be borne by supplier.</p>
        <p>5. Delivery should be done within 5 days of PO date.</p>
      </div>

      <div className="mt-6 text-right text-sm italic">For Authorised Signatory</div>
    </div>
  );
}

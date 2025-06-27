import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function DCPreviewPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const data = state?.formData || {};
  const { challanNumber, orderDate, dispatchDate, challanDate, referenceNo, challanType, challanGSTIN, placeOfSupply, billTo, items, notes } = data;

  const calculateTotals = () => {
    let subTotal = 0, totalTax = 0;
    items?.forEach((item) => {
      const taxable = item.qty * item.price;
      const tax = (taxable * (item.cgstRate + item.sgstRate + item.igstRate)) / 100;
      subTotal += taxable;
      totalTax += tax;
    });
    const grandTotal = (subTotal + totalTax).toFixed(2);
    return { subTotal, totalTax, grandTotal };
  };

  const totals = calculateTotals();

  return (
    

    <div className="max-w-6xl mx-auto bg-white p-6 rounded shadow text-sm printable-area">
      <div className="text-right font-bold text-green-600 text-xl mb-4">DELIVERY CHALLAN</div>

      <div className="grid md:grid-cols-2 gap-4 text-sm">
        <div>
          <p><strong>Company Name:</strong>I Smart</p>
          <p><strong>Address:</strong> Mumbai</p>
          <p><strong>GSTIN:</strong> 33GSPTN0371G1ZD</p>
          <p><strong>Phone:</strong> 1234567899</p>
        </div>
        <div className="text-right">
          <p><strong>Delivery Challan #</strong> {challanNumber}</p>
          <p><strong>Order Date #</strong> {orderDate}</p>
          <p><strong>Dispatch Date #</strong> {dispatchDate}</p>
        </div>
      </div>

      <div className="border-t border-b my-4 py-2 grid md:grid-cols-2 gap-4 text-sm">
        <div>
          <p><strong>Bill To:</strong></p>
          <p>{billTo?.name}</p>
          <p>{billTo?.address}</p>
          <p>{billTo?.phone}</p>
          <p>{billTo?.gstin}</p>
          <p><strong>Place of Supply:</strong> {placeOfSupply}</p>
        </div>
        <div className="text-right">
          <p><strong>Challan Date:</strong> {challanDate}</p>
          <p><strong>Ref #:</strong> {referenceNo}</p>
          <p><strong>Challan Type:</strong> {challanType}</p>
          <p><strong>GSTIN:</strong> {challanGSTIN}</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border text-xs">
          <thead className="bg-gray-100">
            <tr className="text-left">
              <th className="border px-2 py-1">SR</th>
              <th className="border px-2 py-1">Item Description</th>
              <th className="border px-2 py-1">HSN/SAC</th>
              <th className="border px-2 py-1">Qty</th>
              <th className="border px-2 py-1">Price/Item</th>
              <th className="border px-2 py-1">Taxable Value</th>
              <th className="border px-2 py-1">CGST %</th>
              <th className="border px-2 py-1">CGST Amt</th>
              <th className="border px-2 py-1">SGST %</th>
              <th className="border px-2 py-1">SGST Amt</th>
              <th className="border px-2 py-1">IGST %</th>
              <th className="border px-2 py-1">IGST Amt</th>
            </tr>
          </thead>
          <tbody>
            {items?.map((item, i) => {
              const taxable = item.qty * item.price;
              const cgstAmt = (taxable * item.cgstRate) / 100;
              const sgstAmt = (taxable * item.sgstRate) / 100;
              const igstAmt = (taxable * item.igstRate) / 100;
              return (
                <tr key={i}>
                  <td className="border px-2 py-1">{i + 1}</td>
                  <td className="border px-2 py-1">{item.description}</td>
                  <td className="border px-2 py-1">{item.hsn}</td>
                  <td className="border px-2 py-1">{item.qty}</td>
                  <td className="border px-2 py-1">{item.price}</td>
                  <td className="border px-2 py-1">{taxable.toFixed(2)}</td>
                  <td className="border px-2 py-1">{item.cgstRate}%</td>
                  <td className="border px-2 py-1">{cgstAmt.toFixed(2)}</td>
                  <td className="border px-2 py-1">{item.sgstRate}%</td>
                  <td className="border px-2 py-1">{sgstAmt.toFixed(2)}</td>
                  <td className="border px-2 py-1">{item.igstRate}%</td>
                  <td className="border px-2 py-1">{igstAmt.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mt-4 text-sm">
        <div><strong>Sub Total:</strong> ₹{totals.subTotal.toFixed(2)}</div>
        <div><strong>Total Tax:</strong> ₹{totals.totalTax.toFixed(2)}</div>
        <div><strong>Grand Total:</strong> ₹{totals.grandTotal}</div>
      </div>

      {notes && (
        <div className="mt-4 text-sm">
          <strong>Notes:</strong> <p>{notes}</p>
        </div>
      )}

    <div className="flex justify-end mt-6 gap-3 print-hidden">
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Print / Save as PDF
        </button>

        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Back
        </button>
      </div>

    </div>
 
  );
}

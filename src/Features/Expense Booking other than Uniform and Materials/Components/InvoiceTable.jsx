// File: src/features/billing/components/InvoiceTable.jsx

import React from "react";

export default function InvoiceTable({ invoices, onView, onReject, onApprove }) {

 


  return (
    <div className="overflow-x-auto">
      <table className="w-full border text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">Invoice No</th>
            <th className="border p-2">Vendor Name</th>
            <th className="border p-2">PO No</th>
            <th className="border p-2">GSTIN</th>
            <th className="border p-2">Amount</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
            <th className="border p-2">Financial Head Status</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv) => (
            <tr key={inv.id} className="text-center">
              <td className="border p-2">{inv.invoiceNo}</td>
              <td className="border p-2">{inv.vendorName}</td>
              <td className="border p-2">{inv.poNo}</td>
              <td className="border p-2">{inv.gstin}</td>
              <td className="border p-2">₹{inv.amount}</td>
              <td className={`border p-2 capitalize `}>
                {inv.status}
              </td>
              <td className="border p-2 ">
                <button
                  onClick={() => onView(inv)}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 mr-1 mb-1"
                >
                  View
                </button>

                {inv.status === "pending" ? (
                  <>
                    <button
                      onClick={() => onApprove(inv.id)}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 mr-1 mb-1"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => onReject(inv)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <></>
                )}
              </td>
              <td className="border p-2 capitalize">{inv.financialHeadStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>


    </div>
  );
}

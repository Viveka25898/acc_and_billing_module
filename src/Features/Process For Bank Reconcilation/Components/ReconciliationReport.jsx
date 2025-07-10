// File: src/features/bankReconciliation/components/ReconciliationReport.jsx
import React, { useRef } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export default function ReconciliationReport({ records }) {
  const unmatchedRef = useRef();
  const matched = records.filter((r) => r.inBank && r.inBooks);
  const unmatched = records.filter((r) => !r.inBank || !r.inBooks);

  const handlePrintUnmatched = () => {
    const printContent = unmatchedRef.current.innerHTML;
    const printWindow = window.open("", "", "width=900,height=700");
    printWindow.document.write(`
      <html>
        <head>
          <title>Unmatched Transactions Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; font-size: 14px; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
            thead { background-color: #f3f4f6; }
            h3 { color: #dc2626; }
          </style>
        </head>
        <body>
          <h3>❌ Unmatched Transactions</h3>
          ${printContent}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const Table = ({ title, data, highlight, tableRef }) => (
    <div className="mb-10">
      <h3 className={`text-lg font-semibold mb-3 ${highlight}`}>{title}</h3>
      <div
        className="overflow-auto border rounded-lg shadow bg-white"
        ref={tableRef || null}
      >
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Amount</th>
              <th className="px-4 py-2 text-left">Description</th>
              <th className="px-4 py-2 text-center">In Bank</th>
              <th className="px-4 py-2 text-center">In Books</th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry, idx) => (
              <tr key={idx} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{entry.date}</td>
                <td className="px-4 py-2">₹{entry.amount}</td>
                <td className="px-4 py-2">{entry.description}</td>
                <td className="px-4 py-2 text-center">
                  {entry.inBank ? (
                    <FaCheckCircle className="text-green-600 w-4 h-4 mx-auto" />
                  ) : (
                    <FaTimesCircle className="text-red-600 w-4 h-4 mx-auto" />
                  )}
                </td>
                <td className="px-4 py-2 text-center">
                  {entry.inBooks ? (
                    <FaCheckCircle className="text-green-600 w-4 h-4 mx-auto" />
                  ) : (
                    <FaTimesCircle className="text-red-600 w-4 h-4 mx-auto" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="mt-10">
      <Table title="✅ Matched Transactions" data={matched} highlight="text-green-600" />

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-red-600">❌ Unmatched Transactions</h2>
       
      </div>

      <div ref={unmatchedRef}>
        <Table title="" data={unmatched} highlight="" tableRef={null} />
      </div>
       <button
          onClick={handlePrintUnmatched}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded shadow text-sm"
        >
          Print / Download
        </button>
    </div>
  );
}

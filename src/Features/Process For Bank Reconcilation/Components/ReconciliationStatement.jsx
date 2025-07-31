import React from "react";

export default function ReconciliationStatement({ data = [] }) {
  const matched = data.filter((entry) => entry.inBank && entry.inBooks);
  const onlyInBank = data.filter((entry) => entry.inBank && !entry.inBooks);
  const onlyInBooks = data.filter((entry) => !entry.inBank && entry.inBooks);

  const balanceInBooks =
    matched.reduce((sum, entry) => sum + entry.amount, 0) +
    onlyInBooks.reduce((sum, entry) => sum + entry.amount, 0);

  const adjustedBankBalance =
    balanceInBooks +
    onlyInBank.reduce((sum, entry) => sum + entry.amount, 0) -
    onlyInBooks.reduce((sum, entry) => sum + entry.amount, 0);

  return (
    <div className="max-w-5xl mx-auto text-sm sm:text-base print:bg-white print:shadow-none">
      <h2 className="text-center text-lg font-semibold mb-6">
        Bank Reconciliation Statement<br />
        <span className="text-sm font-normal">as on {new Date().toISOString().split("T")[0]}</span>
      </h2>

      <div className="overflow-auto">
        <table className="w-full border border-gray-300 rounded shadow text-xs sm:text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Amount (₹)</th>
              <th className="p-2 border">In Bank</th>
              <th className="p-2 border">In Books</th>
              <th className="p-2 border">Category</th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry, i) => {
              let category = "Matched";
              if (entry.inBank && !entry.inBooks) category = "Only in Bank";
              else if (!entry.inBank && entry.inBooks) category = "Only in Books";

              return (
                <tr key={i} className="text-gray-700">
                  <td className="p-2 border">{entry.date}</td>
                  <td className="p-2 border">{entry.description}</td>
                  <td className="p-2 border">₹{entry.amount}</td>
                  <td className="p-2 border text-center">{entry.inBank ? "✔" : ""}</td>
                  <td className="p-2 border text-center">{entry.inBooks ? "✔" : ""}</td>
                  <td className="p-2 border">{category}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-6 text-sm sm:text-base space-y-2">
        <p><strong>Balance as per Books:</strong> ₹{balanceInBooks}</p>
        <p><strong>Add: Only in Bank:</strong> ₹{onlyInBank.reduce((sum, entry) => sum + entry.amount, 0)}</p>
        <p><strong>Less: Only in Books:</strong> ₹{onlyInBooks.reduce((sum, entry) => sum + entry.amount, 0)}</p>
        <p className="font-semibold text-green-700"><strong>Adjusted Bank Balance:</strong> ₹{adjustedBankBalance}</p>
      </div>
    </div>
  );
}

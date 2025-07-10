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
    <div className=" p-6  print:shadow-none print:p-0 print:bg-white text-sm md:text-base">
      <h2 className="text-xl font-bold mb-4 text-center">
        Bank Reconciliation Statement
        <br />
        <span className="text-sm font-normal">as on {new Date().toISOString().split("T")[0]}</span>
      </h2>

      <ul className="list-disc ml-6 space-y-2">
        <li>
          <strong>Balance as per Books:</strong> ₹{balanceInBooks}
        </li>

        {onlyInBank.length > 0 && (
          <li>
            <strong>Add: Only in Bank</strong>
            <ul className="list-[circle] ml-6 mt-1">
              {onlyInBank.map((item, i) => (
                <li key={i}>
                  {item.description} ({item.date}) - ₹{item.amount}
                </li>
              ))}
            </ul>
          </li>
        )}

        {onlyInBooks.length > 0 && (
          <li>
            <strong>Less: Only in Books</strong>
            <ul className="list-[circle] ml-6 mt-1">
              {onlyInBooks.map((item, i) => (
                <li key={i}>
                  {item.description} ({item.date}) - ₹{item.amount}
                </li>
              ))}
            </ul>
          </li>
        )}

        <li>
          <strong>Adjusted Bank Balance:</strong> ₹{adjustedBankBalance}
        </li>
      </ul>
    </div>
  );
}

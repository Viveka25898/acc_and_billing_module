import React, { useRef } from "react";
import { useLocation } from "react-router-dom";
import ReconciliationStatement from "../Components/ReconciliationStatement";

export default function ReconciliationStatementPage() {
  const location = useLocation();
  const data = location.state?.data ?? [
    {
      description: "Cheque Deposit",
      date: "2025-07-01",
      amount: 10000,
      inBank: true,
      inBooks: true,
    },
    {
      description: "Bank Charges",
      date: "2025-07-03",
      amount: -500,
      inBank: true,
      inBooks: false,
    },
    {
      description: "Salary Paid",
      date: "2025-07-05",
      amount: -3000,
      inBank: false,
      inBooks: true,
    },
  ];

  const statementRef = useRef();

  const handlePrintStatement = () => {
    const content = statementRef.current?.innerHTML;

    if (!content) {
      alert("No content to print!");
      return;
    }

    const printWindow = window.open("", "_blank", "width=900,height=700");
    printWindow.document.open();
    printWindow.document.write(`
      <html>
        <head>
          <title>Reconciliation Statement</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              color: #111;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              border: 1px solid #ccc;
              padding: 8px;
              text-align: left;
              font-size: 14px;
            }
            h2 {
              text-align: center;
              font-size: 20px;
              margin-bottom: 20px;
            }
          </style>
        </head>
        <body>
          <h2>📄 Reconciliation Statement</h2>
          ${content}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="flex flex-col sm:flex-row justify-between items-center max-w-5xl mx-auto mb-4 gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-green-600">Reconciliation Statement</h1>
        <button
          onClick={handlePrintStatement}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Print / Download
        </button>
      </div>

      <div ref={statementRef}>
        <ReconciliationStatement data={data} />
      </div>
    </div>
  );
}

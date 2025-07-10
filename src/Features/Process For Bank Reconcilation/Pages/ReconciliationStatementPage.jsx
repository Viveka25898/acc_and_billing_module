import React, { useRef } from "react";
import { useLocation } from "react-router-dom";
import ReconciliationStatement from "../Components/ReconciliationStatement";

export default function ReconciliationStatementPage() {
  const location = useLocation();
  const data = location.state?.data ?? [];

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
            h2 {
              text-align: center;
              font-size: 20px;
              margin-bottom: 20px;
            }
            ul {
              margin-left: 20px;
              margin-bottom: 20px;
            }
            li {
              margin-bottom: 8px;
            }
            strong {
              color: #111827;
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
    <div className="min-h-screen bg-white ronded-md shadow-md p-4">
      <div className="flex justify-between items-center max-w-4xl mx-auto mb-4">
        <h1 className="text-2xl font-bold text-green-600">Reconciliation Statement</h1>
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

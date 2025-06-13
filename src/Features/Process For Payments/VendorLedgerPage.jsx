// src/features/processPayments/pages/VendorLedgerPage.jsx
import React, { useEffect, useState } from "react";
import VendorLedgerTable from "./Components/VendorLedgerTable";


export default function VendorLedgerPage() {
  const [ledgerData, setLedgerData] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("paymentEntries");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setLedgerData(parsed);
      } catch {
        setLedgerData([]);
      }
    }
  }, []);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4 text-center">
        Vendor Ledger
      </h1>

      <VendorLedgerTable data={ledgerData} />
    </div>
  );
}

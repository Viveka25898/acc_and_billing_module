// src/features/processPayments/pages/VendorLedgerPage.jsx
import React, { useEffect, useState } from "react";
import VendorLedgerTable from "./Components/VendorLedgerTable";

export default function VendorLedgerPage() {
  const [ledgerData, setLedgerData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    vendorName: "",
    invoiceNumber: "",
    paymentDate: "",
  });

  useEffect(() => {
    const stored = localStorage.getItem("paymentEntries");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setLedgerData(parsed);
        setFilteredData(parsed);
      } catch {
        setLedgerData([]);
        setFilteredData([]);
      }
    }
  }, []);

  const handleFilter = () => {
    let filtered = ledgerData;

    if (filters.vendorName) {
      filtered = filtered.filter((entry) =>
        entry["Vendor Name"]
          ?.toLowerCase()
          .includes(filters.vendorName.toLowerCase())
      );
    }

    if (filters.invoiceNumber) {
      filtered = filtered.filter((entry) =>
        entry["Invoice No"]
          ?.toLowerCase()
          .includes(filters.invoiceNumber.toLowerCase())
      );
    }

    if (filters.paymentDate) {
      filtered = filtered.filter((entry) => {
        const dateField = entry["Payment Date"] || entry["paymentDate"];
        if (!dateField) return false;
        return dateField.slice(0, 10) === filters.paymentDate;
      });
    }

    setFilteredData(filtered);
  };

  useEffect(() => {
    handleFilter();
  }, [filters, ledgerData]);

  return (
    <div className="p-4 max-w-7xl mx-auto bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4 text-green-600">Vendor Ledger</h1>

      {/* Filter Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <input
          type="text"
          placeholder="Filter by Vendor Name"
          value={filters.vendorName}
          onChange={(e) =>
            setFilters({ ...filters, vendorName: e.target.value })
          }
          className="border px-3 py-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="Filter by Invoice Number"
          value={filters.invoiceNumber}
          onChange={(e) =>
            setFilters({ ...filters, invoiceNumber: e.target.value })
          }
          className="border px-3 py-2 rounded w-full"
        />
        <input
          type="date"
          value={filters.paymentDate}
          onChange={(e) =>
            setFilters({ ...filters, paymentDate: e.target.value })
          }
          className="border px-3 py-2 rounded w-full"
        />
      </div>

      <VendorLedgerTable data={filteredData} />
    </div>
  );
}

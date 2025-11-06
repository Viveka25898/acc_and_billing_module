import React, { useState } from "react";
import { gstLedgerData } from "../data/gstLedgerData";
import GSTHeader from "../Components/GSTHeader";
import GSTFilterSection from "../Components/GSTFilterSection";
import GSTLedgerTable from "../Components/GSTLedgerTable";
const GSTLedgersPage = () => {
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    status: "All",
    search: "",
  });

  const handlePrint = () => window.print();

  const filterEntries = (entries) => {
    return entries.filter((e) => {
      const date = new Date(e.date.split("-").reverse().join("-"));
      const from = filters.fromDate ? new Date(filters.fromDate) : null;
      const to = filters.toDate ? new Date(filters.toDate) : null;
      const matchDate = (!from || date >= from) && (!to || date <= to);
      const matchStatus = filters.status === "All" || e.status === filters.status;
      const search =
        filters.search === "" ||
        e.voucherNo.toLowerCase().includes(filters.search.toLowerCase()) ||
        e.counterparty.toLowerCase().includes(filters.search.toLowerCase());
      return matchDate && matchStatus && search;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-[1600px] mx-auto space-y-8">
        {gstLedgerData.map((ledger, i) => (
          <div key={i} className="space-y-4">
            <GSTHeader data={ledger} />
            <GSTFilterSection
              filters={filters}
              onFilterChange={setFilters}
              onPrint={handlePrint}
            />
            <GSTLedgerTable ledger={{ ...ledger, entries: filterEntries(ledger.entries) }} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default GSTLedgersPage;

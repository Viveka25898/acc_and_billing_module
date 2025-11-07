import React, { useState, useMemo } from "react";
import { vendorLedgerData } from './../data/vendorLedgerData';
import HKVendorHeader from "../Components/HKVendorHeader";
import HKSummaryCards from "../Components/HKSummeryCards";
import HKFilterSection from "../Components/HKFilterSection";
import HKLedgerTable from "../Components/HKLedgerTable";
import HKFooterSummary from "../Components/HKFooterSummery";

const HKVendorLedgerPage = () => {
  const { vendorInfo, balances, summary, entries } = vendorLedgerData;

  const [filters, setFilters] = useState({
    fromDate: "2024-04-01",
    toDate: "2024-05-31",
    entryType: "",
    status: "",
  });

  // 🧩 Compute filtered entries
  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const entryDate = new Date(
        `20${entry.date.split("-")[2]}-${entry.date.split("-")[1]}-${entry.date.split("-")[0]}`
      );
      const from = filters.fromDate ? new Date(filters.fromDate) : null;
      const to = filters.toDate ? new Date(filters.toDate) : null;

      const withinRange =
        (!from || entryDate >= from) && (!to || entryDate <= to);

      const matchesType =
        !filters.entryType || entry.entryType === filters.entryType;

      const matchesStatus =
        !filters.status || entry.status === filters.status;

      return withinRange && matchesType && matchesStatus;
    });
  }, [entries, filters]);

  // 🧮 Compute totals dynamically
  const totals = useMemo(() => {
    let totalDebit = 0;
    let totalCredit = 0;

    filteredEntries.forEach((e) => {
      const debitVal = parseFloat(e.debit.replace(/,/g, "")) || 0;
      const creditVal = parseFloat(e.credit.replace(/,/g, "")) || 0;
      totalDebit += debitVal;
      totalCredit += creditVal;
    });

    const closingBalance = totalCredit - totalDebit;
    return {
      totalDebit: totalDebit.toLocaleString("en-IN"),
      totalCredit: totalCredit.toLocaleString("en-IN"),
      closingBalance: closingBalance.toLocaleString("en-IN"),
    };
  }, [filteredEntries]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-5xl mx-auto my-6 bg-white shadow-lg rounded-lg overflow-hidden">
        <HKVendorHeader info={vendorInfo} balances={balances} />
        <HKSummaryCards summary={summary} />
        <HKFilterSection filters={filters} setFilters={setFilters} />
        <HKLedgerTable entries={filteredEntries} />
        <HKFooterSummary totals={totals} />
      </div>
    </div>
  );
};

export default HKVendorLedgerPage;

/* eslint-disable no-unused-vars */
import { useState } from "react";
import { ledgerEntries } from "../data/LedgerDummyData";
import { toast } from "react-toastify";
import VendorLedgerFilter from "../Components/VendorLedgerFilter";


const vendorList = [
  { vendorCode: "V001", vendorName: "Vendor 1" },
  { vendorCode: "V002", vendorName: "Vendor 2" },
];

export default function VendorLedger() {
  const [selectedVendor, setSelectedVendor] = useState("");

  let filteredEntries = [];
  try {
    filteredEntries = selectedVendor
      ? ledgerEntries.filter((entry) => entry.vendorCode === selectedVendor)
      : ledgerEntries;
  } catch (error) {
    toast.error("Error loading ledger entries. Please try again.");
  }

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white min-h-screen rounded shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-green-600">Vendor Ledger</h1>
      <VendorLedgerFilter
        vendorList={vendorList}
        selectedVendor={selectedVendor}
        onChange={setSelectedVendor}
      />
      <VendorLedgerTable entries={filteredEntries} />
    </div>
  );
}

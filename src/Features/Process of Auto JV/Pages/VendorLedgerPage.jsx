import { NavLink } from "react-router-dom";
import VendorLedgerTable from "../components/VendorLedgerTable";

export default function VendorLedgerPagee() {
  return (
    <div className="p-6 bg-white text-green-800 max-w-6xl mx-auto overflow-x-auto">
       
      <h1 className="text-2xl font-bold mb-4">Vendor Ledger</h1>
      <VendorLedgerTable />
    </div>
  );
}
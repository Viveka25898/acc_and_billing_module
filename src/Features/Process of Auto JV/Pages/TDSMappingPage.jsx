import { NavLink } from "react-router-dom";
import VendorTDSMappingForm from "../components/VendorTDSMappingForm";

export default function TDSMappingPage() {
  return (
    <div className="p-6 bg-white text-green-800 max-w-4xl mx-auto">
      <NavLink to="/dashboard/ae/vendor-ledger-page">Vendor Ledger</NavLink>
       <NavLink to="/dashboard/ae/income-tax-details">Income Tax Details</NavLink>
      <h1 className="text-2xl font-bold mb-4">Vendor TDS Mapping</h1>
      <VendorTDSMappingForm />
    </div>
  );
}

// src/features/salaryPayment/pages/PayrollPaymentEntryPage.jsx

import { useNavigate } from "react-router-dom";
import PaymentFormTable from "../Components/PaymentFormTable";
import UploadPayrollFile from "../Components/UploadPayrollFile";



export default function PayrollPaymentEntryPage() {
  const navigate=useNavigate()
  return (
    <div className="p-4 max-w-7xl mx-auto bg-white shadow-md rounded-md">
      <div className="flex items-center justify-between mb-6">
    <h1 className="text-2xl font-bold text-green-600">Salary Payment Entry</h1>
    <button
      onClick={() => navigate("/dashboard/payroll-team/my-entries")}
      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition cursor-pointer"
    >
      My Entries
    </button>
  </div>

      {/* Upload Excel/CSV */}
      <UploadPayrollFile />
      <hr className="border-gray-400 mx-4" />

      {/* Manual Entry Form */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold mb-2">Or Fill Manually</h2>
        <PaymentFormTable />
      </div>
    </div>
  );
}

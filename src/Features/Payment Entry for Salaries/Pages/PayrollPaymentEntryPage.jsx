import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import UploadPayrollFile from "../Components/UploadPayrollFile";
import PaymentFormTable from "../Components/PaymentFormTable";

export default function PayrollPaymentEntryPage() {
  const navigate = useNavigate();

  // 🔽 Pre-formatted Excel download logic
  const handleDownloadTemplate = () => {
  const sampleData = [
    {
      "TYPE": "NEFT",
      "DEBIT BANK A/C NO": "1234567890",
      "DEBIT AMT": 25000,
      "CUR": "INR",
      "BENIFICARY A/C NO": "9876543210",
      "IFSC CODE": "SBIN0000123",
      "NARRTION/NAME (NOT MORE THAN 20)": "John Doe".slice(0, 20),
    },
  ];

  const ws = XLSX.utils.json_to_sheet(sampleData);
  ws["!cols"] = [
    { wch: 10 },  // TYPE
    { wch: 20 },  // DEBIT BANK A/C NO
    { wch: 12 },  // DEBIT AMT
    { wch: 8 },   // CUR
    { wch: 20 },  // BENIFICARY A/C NO
    { wch: 15 },  // IFSC
    { wch: 30 },  // NARRATION
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "BankPaymentFormat");

  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const file = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(file, "Bank_NEF_Payment_Format.xlsx");
};


  return (
    <div className="p-4 max-w-7xl mx-auto bg-white shadow-md rounded-md ">
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

      {/* Optional Manual Entry */}
      {/* <div className="mt-10">
        <h2 className="text-lg font-semibold mb-2">Or Fill Manually</h2>
        <PaymentFormTable />
      </div> */}

      {/* 🔽 Download Template Button */}
      <div className="flex justify-end mt-6">
        <button
          onClick={handleDownloadTemplate}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Download Pre-Formatted File
        </button>
      </div>
    </div>
  );
}

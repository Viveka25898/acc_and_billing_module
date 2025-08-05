// src/features/salaryPayment/components/UploadPayrollFile.jsx
import { useRef, useState } from "react";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";

export default function UploadPayrollFile() {
  const [data, setData] = useState([]);
  const [summaryData, setSummaryData] = useState(null); // 🔥 NEW: Store summary data
  const [error, setError] = useState("");
  const fileInputRef = useRef(null); // Ref to clear file input

  // 🔥 NEW: Function to process employee data into summary format
  const processEmployeeDataToSummary = (employeeData) => {
    if (!employeeData || employeeData.length === 0) return null;

    // Calculate total salary amount
    const totalAmount = employeeData.reduce((sum, employee) => {
      const amount = Number(employee['DEBIT AMT'] || 0);
      return sum + amount;
    }, 0);

    // Get common debit account (assuming all employees have same company account)
    const debitAccount = employeeData[0]['DEBIT BANK A/C NO'] || '';
    
    // Get current month for narration
    const currentDate = new Date();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentMonth = monthNames[currentDate.getMonth()];
    const currentYear = currentDate.getFullYear();
    
    // Create summary entry
    const summary = {
      "TYPE": "NEFT",
      "DEBIT BANK A/C NO": debitAccount,
      "DEBIT AMT": totalAmount,
      "CUR": "INR",
      "NARRATION/NAME": `${currentMonth} ${currentYear} Salary`
    };

    return {
      summary: summary,
      employeeCount: employeeData.length,
      totalAmount: totalAmount,
      month: `${currentMonth} ${currentYear}`
    };
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const parsedData = XLSX.utils.sheet_to_json(ws, { defval: "" });
      
      setData(parsedData);
      
      // 🔥 NEW: Process data into summary format
      const processedSummary = processEmployeeDataToSummary(parsedData);
      setSummaryData(processedSummary);
      
      setError("");
    };
    reader.readAsBinaryString(file);
  };

  const handleSubmit = () => {
    if (data.length === 0) {
      setError("Please upload a valid file before submitting.");
      return;
    }

    console.log("Submitted Excel Data:", data);
    console.log("Summary Data:", summaryData);

    // ✅ Clear everything after submit
    setData([]); // Hide table
    setSummaryData(null); // Clear summary
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear file input
    }
    toast.success("✅ File submitted to AE successfully!");
  };

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-2">Upload Excel/CSV File</h2>

      <input
        type="file"
        ref={fileInputRef}
        accept=".xlsx, .xls, .csv"
        onChange={handleFileUpload}
        className="mb-4 border p-2 rounded-2xl bg-green-400 text-white font-semibold w-56 cursor-pointer"
      />

      {error && <p className="text-red-600 text-sm">{error}</p>}

      {/* 🔥 NEW: Show Summary Table instead of detailed employee data */}
      {summaryData && (
        <>
          {/* Summary Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Payroll Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">Total Employees:</span>
                <p className="text-xl font-bold text-blue-600">{summaryData.employeeCount}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Total Amount:</span>
                <p className="text-xl font-bold text-green-600">₹{summaryData.totalAmount.toLocaleString()}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Payment Month:</span>
                <p className="text-lg font-semibold text-gray-800">{summaryData.month}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Payment Type:</span>
                <p className="text-lg font-semibold text-gray-800">NEFT</p>
              </div>
            </div>
          </div>

          {/* Summary Table for Bank Processing */}
          <div className="overflow-x-auto border mt-4 rounded">
            <h4 className="text-md font-semibold p-3 bg-gray-100 border-b">Bank Payment Summary</h4>
            <table className="min-w-full text-sm text-left border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 border font-medium">TYPE</th>
                  <th className="p-3 border font-medium">DEBIT BANK A/C NO</th>
                  <th className="p-3 border font-medium">DEBIT AMT</th>
                  <th className="p-3 border font-medium">CUR</th>
                  <th className="p-3 border font-medium">NARRATION/NAME</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t bg-green-50">
                  <td className="p-3 border font-medium">{summaryData.summary.TYPE}</td>
                  <td className="p-3 border">{summaryData.summary["DEBIT BANK A/C NO"]}</td>
                  <td className="p-3 border font-bold text-green-600">₹{summaryData.summary["DEBIT AMT"].toLocaleString()}</td>
                  <td className="p-3 border">{summaryData.summary.CUR}</td>
                  <td className="p-3 border font-medium">{summaryData.summary["NARRATION/NAME"]}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Original Employee Data (Collapsible) */}
          <details className="mt-4 border rounded">
            <summary className="cursor-pointer p-3 bg-gray-100 font-medium hover:bg-gray-200">
              📋 View Employee Details ({data.length} employees)
            </summary>
            <div className="p-3 max-h-60 overflow-y-auto">
              <table className="min-w-full text-sm text-left border-collapse">
                <thead className="bg-gray-50">
                  <tr>
                    {Object.keys(data[0]).map((key, idx) => (
                      <th key={idx} className="p-2 border font-medium text-xs">{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, idx) => (
                    <tr key={idx} className="border-t">
                      {Object.keys(data[0]).map((key, i) => (
                        <td key={i} className="p-2 border text-xs">{row[key]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>

          <button
            onClick={handleSubmit}
            className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
          >
            ✅ Submit to Accounts Executive
          </button>
        </>
      )}
    </div>
  );
}
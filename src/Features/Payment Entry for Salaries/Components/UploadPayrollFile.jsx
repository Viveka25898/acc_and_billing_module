// src/features/salaryPayment/components/UploadPayrollFile.jsx
import { useRef, useState } from "react";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";

export default function UploadPayrollFile() {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null); // Ref to clear file input

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

    // ✅ Clear everything after submit
    setData([]); // Hide table
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

      {data.length > 0 && (
        <>
          <div className="overflow-x-auto border mt-4 rounded">
            <table className="min-w-full text-sm text-left border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  {Object.keys(data[0]).map((key, idx) => (
                    <th key={idx} className="p-2 border font-medium">{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, idx) => (
                  <tr key={idx} className="border-t">
                    {Object.keys(data[0]).map((key, i) => (
                      <td key={i} className="p-2 border">{row[key]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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

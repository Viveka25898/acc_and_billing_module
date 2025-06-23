// src/features/salaryPayment/components/PaymentFormTable.jsx
import { useState } from "react";
import PaymentFormRow from "./PaymentFormRow";
import SubmitButton from "./SubmitButton";
import { toast } from "react-toastify";

export default function PaymentFormTable() {
  const [rows, setRows] = useState([
    {
      id: 1,
      code: "",
      name: "",
      account: "",
      ifsc: "",
      fixed: "",
      allowance: "",
      remarks: "",
    }
  ]);
  

  const addRow = () => {
    setRows([...rows, {
      id: Date.now(),
      code: "", name: "", account: "", ifsc: "",
      fixed: "", allowance: "", remarks: ""
    }]);
  };

  const updateRow = (id, updated) => {
    setRows(rows.map(row => row.id === id ? { ...row, ...updated } : row));
  };

  const deleteRow = (id) => {
    const filtered = rows.filter(row => row.id !== id);
    setRows(filtered.length > 0 ? filtered : rows); // at least one row
  };

  const [error, setError] = useState("");

  const handleSubmit = () => {
    for (const row of rows) {
      if (!row.name || !row.code || !row.account || !row.ifsc || row.fixed === "" || row.allowance === "") {
        setError("⚠️ Please fill all required fields before submitting.");
        return;
      }
      if (isNaN(row.fixed) || isNaN(row.allowance)) {
        setError("⚠️ Fixed and Allowance must be valid numbers.");
        return;
      }
    }

    setError("");
    console.log("Submitted Data:", rows);
   toast.success("Payment Entry Submitted Successfully!")
  };

  return (
    <div className="space-y-4">
      {error && <p className="text-red-600 font-medium">{error}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Emp Code</th>
              <th className="p-2 border">Emp Name</th>
              <th className="p-2 border">Account Number</th>
              <th className="p-2 border">IFSC</th>
              <th className="p-2 border">Fixed</th>
              <th className="p-2 border">Allowance</th>
              <th className="p-2 border">Gross Total</th>
              <th className="p-2 border">Remark</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <PaymentFormRow
                key={row.id}
                row={row}
                onChange={updateRow}
                onDelete={deleteRow}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap justify-between items-center mt-4 gap-4">
        <button
          onClick={addRow}
          className="bg-blue-100 text-blue-700 px-4 py-2 rounded hover:bg-blue-200"
        >
          + Add Another Employee
        </button>

        <SubmitButton onClick={handleSubmit} />
      </div>
    </div>
  );
}

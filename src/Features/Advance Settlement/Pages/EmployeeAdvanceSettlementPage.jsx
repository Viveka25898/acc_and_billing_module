// import { useState } from "react";
import ExpenseUploadForm from "../Components/ExpenseUploadForm";
import MySettlements from "../Components/MySettlements";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";


const EmployeeAdvanceSettlementPage = () => {
    const navigate = useNavigate();
//   const [showMySettlements, setShowMySettlements] = useState(false);

// 🔽 Export Blank Excel Template
  const exportTemplate = () => {
    const worksheetData = [
      [
        "S. No",
        "Date",
        "Expense Head",
        "Description",
        "Amount (₹)",
        "Invoice/Doc No.",
        "Vendor Name",
        "Remarks",
      ],
      [
        "", // Example row (optional, can be removed)
        "25/07/2025",
        "Travel",
        "Auto fare from office to client site",
        "350",
        "INV-123",
        "City Cab Services",
        "Paid via UPI",
      ],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    worksheet['!cols'] = [
      { wch: 8 },   // S. No
      { wch: 15 },  // Date
      { wch: 20 },  // Expense Head
      { wch: 40 },  // Description
      { wch: 15 },  // Amount
      { wch: 20 },  // Invoice/Doc No.
      { wch: 25 },  // Vendor Name
      { wch: 30 },  // Remarks
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Advance Expenses");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(data, "Advance_Settlement_Template.xlsx");
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-md p-6 rounded-lg">
        <div className="p-4 max-w-6xl mx-auto ">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-2xl font-bold text-green-600">
                    Advance Settlement Upload
                  </h2>
                  <button
                    onClick={() => navigate("/dashboard/employee/my-settelment-requests")}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    My Settlements
                  </button>
                </div>
                <div className="mb-6 text-right">
                  <button
                    type="button"
                    onClick={exportTemplate}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Download Pre-Formatted File
                  </button>
                </div>
              </div>

        <ExpenseUploadForm />

      </div>
    </div>
  );
};

export default EmployeeAdvanceSettlementPage;

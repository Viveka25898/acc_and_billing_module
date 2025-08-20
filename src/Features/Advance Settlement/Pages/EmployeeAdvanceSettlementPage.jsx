import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import ExpenseUploadForm from '../Components/ExpenseUploadForm';

const EmployeeAdvanceSettlementPage = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [osBalance, setOsBalance] = useState(5000); // Default O/S Balance

  // Get current user from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const allUsers = JSON.parse(localStorage.getItem("users")) || [];
    const fullUser = allUsers.find(u => u.username === user?.username);
    setCurrentUser(fullUser);

    // Initialize settlements if not exists
    if (!localStorage.getItem("settlements")) {
      localStorage.setItem("settlements", JSON.stringify([]));
    }
    // Load user's current O/S balance from localStorage if exists
    const userBalance = localStorage.getItem(`osBalance_${fullUser?.username}`);
    if (userBalance) {
      setOsBalance(parseFloat(userBalance));
    }
  }, []);

  

  // Export Blank Excel Template
  const exportTemplate = () => {
    try {
      const worksheetData = [
        ["S. No", "Date", "Expense Head", "Description", "Amount (₹)", "Remarks"],
        ["", "25/07/2025", "Travel", "Auto fare from office to client site", "350", "Paid via UPI"]
      ];

      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
      worksheet['!cols'] = [
        { wch: 8 }, { wch: 15 }, { wch: 20 }, { wch: 40 }, 
        { wch: 15 }, { wch: 20 }, { wch: 25 }, { wch: 30 }
      ];

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Advance Expenses");
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      });
      saveAs(data, "Advance_Settlement_Template.xlsx");
    } catch (err) {
      setError('Failed to generate template. Please try again.');
      console.error("Template generation error:", err);
    }
  };

   const handleSubmitSettlement = async (excelFile, attachments) => {
    try {
      console.log("Submitting settlement...");
      console.log("Current user:", currentUser);
      console.log("Current O/S Balance:", osBalance);
      
      if (!currentUser) {
        setError('User information not available. Please refresh the page.');
        return false;
      }

      if (!excelFile || attachments.length === 0) {
        setError('Please upload both Excel file and supporting documents.');
        return false;
      }

      // Parse Excel data
      const excelData = await parseExcelFile(excelFile);
      console.log("Parsed Excel data:", excelData);
      
      // Calculate total settlement amount
      const totalAmount = excelData.reduce((sum, item) => {
        const amount = Number(item['Amount (₹)']) || 0;
        return sum + amount;
      }, 0);

      console.log("Total settlement amount:", totalAmount);

      // Check if settlement amount exceeds available balance
      if (totalAmount > osBalance) {
        setError(`Settlement amount (₹${totalAmount}) exceeds available O/S Balance (₹${osBalance})`);
        return false;
      }

      const newSettlement = {
        id: Date.now().toString(),
        employeeName: currentUser.username,
        employeeId: currentUser.empId,
        expenseItems: excelData,
        totalAmount: totalAmount, // Store the total amount
        attachments: attachments.map(file => ({
          name: file.name,
          size: file.size,
          type: file.type
        })),
        status: 'Pending Line Manager Approval',
        submittedAt: new Date().toISOString(),
        assignedTo: currentUser.reportsTo,
        submittedBy: currentUser.username,
        currentLevel: 'line-manager',
        osBalanceBefore: osBalance, // Store balance before submission
        history: [{
          action: 'submitted',
          by: currentUser.username,
          date: new Date().toISOString(),
          comments: ''
        }]
      };

      console.log("New settlement:", newSettlement);

      const existingSettlements = JSON.parse(localStorage.getItem("settlements")) || [];
      console.log("Existing settlements before:", existingSettlements);
      
      const updatedSettlements = [...existingSettlements, newSettlement];
      localStorage.setItem("settlements", JSON.stringify(updatedSettlements));
      
      console.log("Updated settlements:", 
        JSON.parse(localStorage.getItem("settlements")));
      
      setSubmitted(true);
      return true;
    } catch (err) {
      console.error("Submission error:", err);
      setError('Failed to submit settlement. Please try again.');
      return false;
    }
  };

  const parseExcelFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          resolve(jsonData);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  if (!currentUser) return <div className="text-center p-8">Loading user data...</div>;

return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-gray-100">
      <div className="w-full max-w-4xl bg-white shadow rounded-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
            <h2 className="text-2xl font-bold text-green-600">
              {submitted ? 'Submission Successful' : 'Advance Settlement'}
            </h2>
            <NavLink to="/dashboard/employee/my-settelment-requests">
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                My Settlements
              </button>
            </NavLink>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-center">
              {error}
            </div>
          )}

          {submitted ? (
            <div className="text-center p-8">
              <div className="text-green-600 text-xl font-medium mb-4">
                ✅ Your settlement has been submitted successfully!
              </div>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setSubmitted(false)}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Submit Another
                </button>
                <button
                  onClick={() => navigate("/dashboard/employee/my-settelment-requests")}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  View My Settlements
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6 text-right">
                <button
                  type="button"
                  onClick={exportTemplate}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Download Pre-Formatted File
                </button>
              </div>

              <div className="bg-blue-50 p-4 rounded-md mb-6">
                <h3 className="font-semibold text-blue-800 mb-2">Instructions:</h3>
                <ol className="list-decimal list-inside space-y-1 text-sm text-blue-700">
                  <li>Download and fill the Excel template with your expenses</li>
                  <li>Upload the completed file along with supporting documents</li>
                  <li>Submit for manager approval</li>
                  <li>Available O/S Balance: <strong>₹{osBalance.toFixed(2)}</strong></li>
                </ol>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block mb-1 font-semibold">Employee Name</label>
                  <input
                    type="text"
                    value={currentUser.username}
                    readOnly
                    className="w-full border px-3 py-2 rounded bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-semibold">Employee ID</label>
                  <input
                    type="text"
                    value={currentUser.empId}
                    readOnly
                    className="w-full border px-3 py-2 rounded bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-semibold">O/S Balance</label>
                  <input
                    type="text"
                    value={`₹${osBalance.toFixed(2)}`}
                    readOnly
                    className="w-full border px-3 py-2 rounded bg-gray-100 font-bold text-green-700"
                  />
                </div>
              </div>

              <ExpenseUploadForm 
                onSubmit={handleSubmitSettlement}
                onError={(message) => setError(message)}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeAdvanceSettlementPage;
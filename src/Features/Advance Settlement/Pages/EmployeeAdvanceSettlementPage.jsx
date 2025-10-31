import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import ExpenseUploadForm from '../Components/ExpenseUploadForm';
import { toast } from 'react-toastify';

const EmployeeAdvanceSettlementPage = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [osBalance, setOsBalance] = useState(0);

  // Define expense heads with exact GL code mapping
  const expenseHeadsMaster = {
    "Travel": {
      code: "TRAVEL",
      name: "Travel",
      glCode: "X1001002001", // TRAVEL EXPENSE
      category: "DIRECT_EXPENSES",
      type: "DIRECT"
    },
    
    "Food & Refreshments": {
      code: "FOOD",
      name: "Food & Refreshments",
      glCode: "X1001003001", // FOOD & REFRESHMENT
      category: "DIRECT_EXPENSES",
      type: "DIRECT"
    },
    "Hotel Accommodation": {
      code: "ACCOMMODATION", 
      name: "Hotel Accommodation",
      glCode: "X1001002002", // ACCOMODATION
      category: "DIRECT_EXPENSES",
      type: "DIRECT"
    },
    "Parking Charges": {
      code: "PARKING",
      name: "Parking Charges",
      glCode: "X1001002003", // PARKING CHARGES
      category: "DIRECT_EXPENSES",
      type: "DIRECT"
    },
    
    "Office Supplies": {
      code: "OFFICE_SUPPLIES",
      name: "Office Supplies",
      glCode: "X2001002001", // OFFICE SUPPLIES
      category: "BRANCH_EXPENSES",
      type: "INDIRECT"
    },
    
    "Client Entertainment": {
      code: "CLIENT_ENTERTAINMENT",
      name: "Client Entertainment",
      glCode: "X2002002001", // OTHER EXPENSE
      category: "CORPORATE_EXPENSES",
      type: "INDIRECT"
    },
    "Other Expenses": {
      code: "OTHER",
      name: "Other Expenses", 
      glCode: "X2002002001", // OTHER EXPENSE
      category: "CORPORATE_EXPENSES",
      type: "INDIRECT"
    }
  };

  const updateUserOSBalance = (employeeId, newBalance) => {
    try {
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const updatedUsers = users.map(user => 
        user.empId === employeeId 
          ? { ...user, osBalance: newBalance }
          : user
      );
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      console.log(`Updated O/S balance for employee ${employeeId}: ₹${newBalance}`);
    } catch (error) {
      console.error('Error updating user O/S balance:', error);
    }
  };

  const generateEmployeeGLCode = (employeeId) => {
    if (!employeeId) return null;
    const normalizedId = String(employeeId).replace('emp', '');
    return `A3002-EMP-${normalizedId.padStart(3, '0')}`;
  };

  const calculateRealOSBalance = (employeeId) => {
    try {
      const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
      const employeeGLCode = generateEmployeeGLCode(employeeId);
      
      if (!employeeGLCode) return 0;

      let totalDebits = 0;
      let totalCredits = 0;

      transactions.forEach(txn => {
        if (txn.entries && Array.isArray(txn.entries)) {
          txn.entries.forEach(entry => {
            if (entry.glCode === employeeGLCode) {
              totalDebits += entry.debit || 0;
              totalCredits += entry.credit || 0;
            }
          });
        }
      });

      return totalDebits - totalCredits;
    } catch (error) {
      console.error('❌ Error calculating O/S balance:', error);
      return 0;
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const allUsers = JSON.parse(localStorage.getItem("users")) || [];
    const fullUser = allUsers.find(u => u.username === user?.username);
    setCurrentUser(fullUser);

    if (!localStorage.getItem("settlements")) {
      localStorage.setItem("settlements", JSON.stringify([]));
    }

    // Initialize expense heads if not exists
    if (!localStorage.getItem('expenseHeads')) {
      localStorage.setItem('expenseHeads', JSON.stringify(expenseHeadsMaster));
      console.log("✅ Expense heads master initialized");
    }

    if (fullUser) {
      const realOSBalance = calculateRealOSBalance(fullUser.empId);
      setOsBalance(realOSBalance);
      updateUserOSBalance(fullUser.empId, realOSBalance);
    }
  }, []);

  /**
   * 🎯 UPDATED: Excel template with exact expense head mapping
   */
  const exportTemplate = async () => {
    try {
      // Get expense heads from master
      const expenseHeads = Object.keys(expenseHeadsMaster);

      // Create workbook
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Advance Expenses');

      // Define columns with headers
      worksheet.columns = [
        { header: 'S. No', key: 'sno', width: 10 },
        { header: 'Date (DD/MM/YYYY)', key: 'date', width: 18 },
        { header: 'Expense Head', key: 'expenseHead', width: 25 },
        { header: 'Description', key: 'description', width: 45 },
        { header: 'Amount (₹)', key: 'amount', width: 15 },
        { header: 'Remarks', key: 'remarks', width: 30 }
      ];

      // Style header row
      worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF0066CC' }
      };
      worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

      // Add sample data
      worksheet.addRow({
        sno: '1',
        date: '25/01/2025',
        expenseHead: 'Travel',
        description: 'Auto fare from office to client site',
        amount: '350',
        remarks: 'Paid via UPI'
      });

      worksheet.addRow({
        sno: '2', 
        date: '26/01/2025',
        expenseHead: 'Food & Refreshments',
        description: 'Lunch during client meeting',
        amount: '250',
        remarks: 'Paid by cash'
      });

      // Add 20 empty rows with auto-numbered S.No
      for (let i = 3; i <= 22; i++) {
        worksheet.addRow({
          sno: i.toString(),
          date: '',
          expenseHead: '',
          description: '',
          amount: '',
          remarks: ''
        });
      }

      // 🎯 ADD DROPDOWN VALIDATION to Expense Head column (C3:C22)
      for (let rowNum = 3; rowNum <= 22; rowNum++) {
        const cell = worksheet.getCell(`C${rowNum}`);
        
        cell.dataValidation = {
          type: 'list',
          allowBlank: false,
          formulae: [`"${expenseHeads.join(',')}"`],
          showErrorMessage: true,
          errorStyle: 'error',
          errorTitle: 'Invalid Entry',
          error: 'Please select a valid expense head from the dropdown list',
          showInputMessage: true,
          promptTitle: 'Expense Head',
          prompt: 'Click the arrow to select an expense category'
        };
      }

      // Add border to all cells with data
      for (let rowNum = 1; rowNum <= 22; rowNum++) {
        for (let colNum = 1; colNum <= 6; colNum++) {
          const cell = worksheet.getCell(rowNum, colNum);
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
        }
      }

      // Freeze first row
      worksheet.views = [
        { state: 'frozen', xSplit: 0, ySplit: 1 }
      ];

      // Create Instructions sheet with GL code information
      const instructionSheet = workbook.addWorksheet('Instructions & GL Codes');
      instructionSheet.columns = [
        { header: 'EXPENSE SETTLEMENT INSTRUCTIONS', key: 'instructions', width: 80 }
      ];

      const instructions = [
        '',
        '📋 HOW TO USE THIS TEMPLATE:',
        '',
        '1️⃣ Fill in the expense details in the "Advance Expenses" sheet',
        '   • S. No: Already numbered (do not change)',
        '   • Date: Enter in DD/MM/YYYY format (e.g., 25/01/2025)',
        '   • Expense Head: CLICK THE CELL to see dropdown arrow, then select category',
        '   • Description: Brief description of the expense',
        '   • Amount: Enter amount in rupees (numbers only, no ₹ symbol)',
        '   • Remarks: Any additional notes (optional)',
        '',
        '2️⃣ Two sample rows are provided as examples',
        '',
        '3️⃣ Delete sample rows (row 2 & 3) before submitting your actual expenses',
        '',
        '4️⃣ Fill rows starting from row 4 onwards',
        '',
        '5️⃣ Save the file and upload along with supporting documents',
        '',
        '⚠️ IMPORTANT NOTES:',
        '   • Do not change column headers',
        '   • Each cell in Expense Head column has a dropdown - click to see arrow',
        '   • If dropdown doesn\'t appear, ensure you\'re using Microsoft Excel',
        '   • All mandatory fields must be filled',
        '   • Attach bills/receipts for all expenses',
        '',
        '📂 AVAILABLE EXPENSE CATEGORIES (With GL Codes):',
        ...Object.entries(expenseHeadsMaster).map(([head, details], idx) => 
          `   ${idx + 1}. ${head} → GL: ${details.glCode}`
        ),
        '',
        '💡 TIPS:',
        '   • Keep descriptions clear and specific',
        '   • Round off amounts to nearest rupee',
        '   • Group similar expenses on same date if possible',
        '   • Ensure total matches your submitted receipts'
      ];

      instructions.forEach((text, idx) => {
        const row = instructionSheet.getRow(idx + 1);
        row.getCell(1).value = text;
        
        if (text.includes('📋') || text.includes('📂')) {
          row.font = { bold: true, size: 14, color: { argb: 'FF0066CC' } };
        } else if (text.includes('️⃣')) {
          row.font = { bold: true, size: 11 };
        } else if (text.includes('→ GL:')) {
          row.font = { bold: false, size: 10, color: { argb: 'FF666666' } };
        }
      });

      // Generate Excel file
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      
      saveAs(blob, `Advance_Settlement_Template_${new Date().getTime()}.xlsx`);
      
      toast.success("✅ Template downloaded with exact GL mapping! Open in Excel to see dropdowns.", {
        autoClose: 6000
      });
      
    } catch (err) {
      console.error("Template error:", err);
      setError('Failed to generate template.');
      toast.error("Failed to download template. Please try again.");
    }
  };

  const handleSubmitSettlement = async (excelFile, attachments) => {
    try {
      if (!currentUser) {
        setError('User information not available. Please refresh the page.');
        return false;
      }

      if (!excelFile || attachments.length === 0) {
        setError('Please upload both Excel file and supporting documents.');
        return false;
      }

      const excelData = await parseExcelFile(excelFile);
      
      // Validate against exact expense heads
      const validExpenseHeads = Object.keys(expenseHeadsMaster);
      const invalidRows = excelData.filter(item => 
        item['Expense Head'] && !validExpenseHeads.includes(item['Expense Head'])
      );

      if (invalidRows.length > 0) {
        setError(`Invalid expense heads found: ${invalidRows.map(r => r['Expense Head']).join(', ')}. Please use only predefined expense heads.`);
        return false;
      }
      
      const totalAmount = excelData.reduce((sum, item) => {
        const amount = Number(item['Amount (₹)']) || 0;
        return sum + amount;
      }, 0);

      if (totalAmount > osBalance) {
        setError(`Note: Settlement exceeds O/S balance by ₹${(totalAmount - osBalance).toFixed(2)}. This will create employee liability.`);
      }

      // Add GL code mapping to each expense item
      const expenseItemsWithGL = excelData.map(item => ({
        ...item,
        glCode: expenseHeadsMaster[item['Expense Head']]?.glCode || 'X2002002001' // Default to Other Expense
      }));

      const newSettlement = {
        id: `SET-${Date.now()}`,
        employeeName: currentUser.fullName || currentUser.username,
        employeeId: currentUser.empId,
        expenseItems: expenseItemsWithGL, // Now includes GL codes
        totalAmount: totalAmount,
        attachments: attachments.map(file => ({
          name: file.name,
          size: file.size,
          type: file.type,
        })),
        status: 'Pending Line Manager Approval',
        submittedAt: new Date().toISOString(),
        assignedTo: currentUser.reportsTo,
        submittedBy: currentUser.username,
        currentLevel: 'line-manager',
        osBalanceBefore: osBalance,
        employeeGLCode: generateEmployeeGLCode(currentUser.empId),
        history: [{
          action: 'submitted',
          by: currentUser.username,
          date: new Date().toISOString(),
          comments: ''
        }]
      };

      const existingSettlements = JSON.parse(localStorage.getItem("settlements")) || [];
      const updatedSettlements = [...existingSettlements, newSettlement];
      localStorage.setItem("settlements", JSON.stringify(updatedSettlements));
      
      console.log("✅ Settlement saved with GL mapping:", newSettlement);
      setSubmitted(true);
      toast.success("✅ Settlement submitted successfully!");
      return true;
    } catch (err) {
      console.error("Submission error:", err);
      setError('Failed to submit settlement. Please try again.');
      toast.error("Failed to submit settlement.");
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
          
          const filteredData = jsonData.filter(row => 
            row['S. No'] && 
            row['S. No'] !== '1' && 
            row['S. No'] !== '2' &&
            row['Amount (₹)'] &&
            Number(row['Amount (₹)']) > 0
          );
          
          resolve(filteredData);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const refreshOSBalance = () => {
    if (currentUser) {
      const newBalance = calculateRealOSBalance(currentUser.empId);
      setOsBalance(newBalance);
      updateUserOSBalance(currentUser.empId, newBalance);
      toast.info(`🔄 O/S Balance refreshed: ₹${newBalance.toFixed(2)}`);
    }
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
            <div className="flex gap-2">
              <button
                onClick={refreshOSBalance}
                className="bg-gray-600 text-white px-3 py-2 rounded hover:bg-gray-700 text-sm"
                title="Refresh O/S Balance"
              >
                🔄 Refresh Balance
              </button>
              <NavLink to="/dashboard/employee/my-settelment-requests">
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  My Settlements
                </button>
              </NavLink>
            </div>
          </div>

          {error && (
            <div className={`mb-4 p-3 rounded-md text-center ${
              error.includes('exceeds') || error.includes('Note:') 
                ? 'bg-yellow-100 text-yellow-700' 
                : 'bg-red-100 text-red-700'
            }`}>
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
                  onClick={() => {
                    setSubmitted(false);
                    setError('');
                    refreshOSBalance();
                  }}
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
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2 ml-auto"
                >
                  <span>📥</span>
                  <span>Download Excel with Dropdowns</span>
                </button>
              </div>

              <div className="bg-blue-50 p-4 rounded-md mb-6">
                <h3 className="font-semibold text-blue-800 mb-2">📋 Instructions:</h3>
                <ol className="list-decimal list-inside space-y-1 text-sm text-blue-700">
                  <li>Click "Download Excel with Dropdowns" button above</li>
                  <li>Open file in Microsoft Excel (desktop version)</li>
                  <li><strong>Click any cell in "Expense Head" column to see dropdown arrow ⬇️</strong></li>
                  <li>Select category from dropdown (no typing needed!)</li>
                  <li>Fill other details and upload with supporting documents</li>
                  <li>
                    Available O/S Balance: <strong className="text-green-700">₹{osBalance.toFixed(2)}</strong>
                  </li>
                </ol>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block mb-1 font-semibold">Employee Name</label>
                  <input
                    type="text"
                    value={currentUser.fullName || currentUser.username}
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
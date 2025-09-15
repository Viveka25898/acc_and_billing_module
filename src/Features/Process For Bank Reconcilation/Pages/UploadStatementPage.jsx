/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { matchTransactions } from "../Components/MatchTransactions";
import FileUploadBox from "../Components/FileUploadBox";
import StatementPreviewTable from "../Components/StatementPreviewTable";
import { useNavigate } from "react-router-dom";
import UnifiedReconciliationTable from "../Components/UnifiedReconciliationTable";
import { dummyBankAccounts } from "../data/dummyBankData";
import { dummyCashLedgers, getDummyBookDataById } from "../data/dummyBookData";
import { parseExcelCSV } from "../utils/excelParser"; // Import Excel parser

export default function UploadStatementPage() {
  const [file, setFile] = useState(null);
  const [bankData, setBankData] = useState([]);
  const [transformedBankData, setTransformedBankData] = useState([]); // For reconciliation
  const [records, setRecords] = useState([]);
  const [selectedBank, setSelectedBank] = useState('');
  const [selectedLedger, setSelectedLedger] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [parsingProgress, setParsingProgress] = useState('');
  const [dateRange, setDateRange] = useState({ fromDate: "", toDate: "" });

  const navigate = useNavigate();

  const handleFileUpload = async (selectedFile, range) => {
    if (!selectedBank || !selectedLedger) {
      setError("Please select both bank account and ledger first");
      return;
    }

    if (!selectedFile) {
      setError("Please select a file");
      return;
    }

    // Store the date range
    setDateRange(range);

    // Validate file type - UPDATED FOR EXCEL/CSV
    const validTypes = [
      "text/csv",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel"
    ];
    
    if (!validTypes.includes(selectedFile.type) && !selectedFile.name.match(/\.(csv|xlsx|xls)$/i)) {
      setError("Please upload a CSV or Excel file only");
      return;
    }

    // Validate file size (10MB limit)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      return;
    }

    setIsLoading(true);
    setError('');
    setParsingProgress('Reading file...');
    
    try {
      setFile(selectedFile);
      
      setParsingProgress('Parsing Excel data...');
      
      // PARSE EXCEL/CSV FILE
      const parsedData = await parseExcelCSV(selectedFile);
      
      console.log("Raw parsed Excel data:", parsedData);

      if (!parsedData || parsedData.length === 0) {
        setError('No transactions found in the file. Please check the format.');
        return;
      }

      // Transform data for display table (keeping original format)
      const displayData = parsedData.map(row => ({
        date: row.date instanceof Date ? row.date.toLocaleDateString("en-IN") : row.date,
        description: row.description || '',
        ref_no: row.ref_no || '',
        debit_: row.debit || row.debit_ || 0,
        credit_: row.credit || row.credit_ || 0,
        balance_: row.balance || row.balance_ || 0
      }));

      // Transform data for reconciliation (standardized format)
      const reconciliationData = parsedData.map((row, index) => {
        let amount = 0;
        let type = '';

        // Determine amount and type
        const debitAmount = Number(row.debit || row.debit_ || 0);
        const creditAmount = Number(row.credit || row.credit_ || 0);

        if (debitAmount > 0) {
          amount = debitAmount;
          type = 'debit';
        } else if (creditAmount > 0) {
          amount = creditAmount;
          type = 'credit';
        }

        // Parse date properly
        let parsedDate = row.date;
        if (parsedDate instanceof Date) {
          parsedDate = parsedDate.toISOString().split('T')[0]; // YYYY-MM-DD format
        } else if (typeof parsedDate === 'string') {
          // Try to parse the date string
          const dateObj = new Date(parsedDate);
          if (!isNaN(dateObj.getTime())) {
            parsedDate = dateObj.toISOString().split('T')[0];
          }
        }

        return {
          id: `bank_${index}`,
          date: parsedDate,
          description: row.description || '',
          reference: row.ref_no || '',
          amount: amount,
          type: type
        };
      }).filter(row => row.amount > 0); // Only include rows with valid amounts

      // Filter by date range if provided
      let filteredData = reconciliationData;
      let filteredDisplayData = displayData;

      if (range.fromDate && range.toDate) {
        const fromDate = new Date(range.fromDate);
        const toDate = new Date(range.toDate);

        filteredData = reconciliationData.filter(row => {
          const rowDate = new Date(row.date);
          return rowDate >= fromDate && rowDate <= toDate;
        });

        filteredDisplayData = displayData.filter((row, index) => {
          const originalRow = reconciliationData[index];
          if (!originalRow) return false;
          const rowDate = new Date(originalRow.date);
          return rowDate >= fromDate && rowDate <= toDate;
        });

        console.log(`Filtered from ${reconciliationData.length} to ${filteredData.length} transactions based on date range`);
      }

      setBankData(filteredDisplayData); // For display
      setTransformedBankData(filteredData); // For reconciliation
      
      console.log("Display data:", filteredDisplayData);
      console.log("Reconciliation data:", filteredData);
      console.log("Selected bank:", selectedBank);
      console.log("Selected ledger:", selectedLedger);
      console.log("Date range:", range);
      
      setParsingProgress('');
      
      if (filteredData.length === 0) {
        if (range.fromDate && range.toDate) {
          // Show the actual date range in the data for debugging
          const actualDates = reconciliationData.map(row => {
            const date = new Date(row.date);
            return date.toISOString().split('T')[0];
          }).filter(Boolean).sort();
          
          const minDate = actualDates[0];
          const maxDate = actualDates[actualDates.length - 1];
          
          setError(`No transactions found in the selected date range (${range.fromDate} to ${range.toDate}). ` +
                  `Your Excel file contains transactions from ${minDate} to ${maxDate}. ` +
                  `Please adjust your date range accordingly.`);
        } else {
          setError('No transactions found in the file. Please check the format.');
        }
      }
      
    } catch (err) {
      console.error('Excel parsing error:', err);
      setError(err.message || 'Failed to parse Excel file');
      setParsingProgress('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReconcile = () => {
    if (transformedBankData.length === 0) {
      setError("Please upload and parse a bank statement first");
      return;
    }

    if (!selectedLedger) {
      setError("Please select a ledger account");
      return;
    }

    try {
      let bookDataToReconcile = getDummyBookDataById(selectedLedger);

      if (!bookDataToReconcile || bookDataToReconcile.length === 0) {
        setError("No book data found for the selected ledger");
        return;
      }

      console.log("Original book data:", bookDataToReconcile);

      // Filter book data by date range if provided
      if (dateRange.fromDate && dateRange.toDate) {
        const fromDate = new Date(dateRange.fromDate);
        const toDate = new Date(dateRange.toDate);

        bookDataToReconcile = bookDataToReconcile.filter(entry => {
          const entryDate = new Date(entry.date);
          return entryDate >= fromDate && entryDate <= toDate;
        });

        console.log(`Filtered book data from ${getDummyBookDataById(selectedLedger).length} to ${bookDataToReconcile.length} entries`);
      }

      console.log("Filtered book data:", bookDataToReconcile);
      console.log("Bank data for reconciliation:", transformedBankData);

      // Run reconciliation
      const result = matchTransactions(transformedBankData, bookDataToReconcile);
      console.log("Reconciliation result:", result);
      
      setRecords(result);
      setError("");
    } catch (err) {
      console.error("Reconciliation error:", err);
      setError("Failed to reconcile transactions: " + err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 bg-white rounded-md shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center text-green-700">Bank Reconciliation</h1>
      
      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          <div className="flex justify-between items-start">
            <span>{error}</span>
            <button 
              onClick={() => setError('')}
              className="text-red-700 hover:text-red-900 ml-2"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Success message */}
      {Array.isArray(bankData) && bankData.length > 0 && !error && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          Successfully parsed {bankData.length} transactions from the Excel file
          {dateRange.fromDate && dateRange.toDate && (
            <span> for the period {dateRange.fromDate} to {dateRange.toDate}</span>
          )}
        </div>
      )}

      <div className="flex justify-end mb-4">
        <button
          onClick={() => navigate("/dashboard/billing-manager/reconciliation-history")}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded shadow cursor-pointer"
        >
          My History
        </button>
      </div>

      {/* Dropdown Selection Section */}
      <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
        <h2 className="text-lg font-semibold mb-4">Select Accounts to Reconcile</h2>
        <div className="flex flex-wrap gap-4">
          {/* Bank Account Dropdown */}
          <div className="flex-1 min-w-[200px]">
            <label htmlFor="bank-account" className="block text-sm font-medium text-gray-700 mb-1">
              Bank Account
            </label>
            <select
              id="bank-account"
              value={selectedBank}
              onChange={(e) => setSelectedBank(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              disabled={isLoading}
            >
              <option value="">Select a Bank Account</option>
              {dummyBankAccounts.map((bank) => (
                <option key={bank.id} value={bank.id}>
                  {bank.name}
                </option>
              ))}
            </select>
          </div>

          {/* Cash Ledger Dropdown */}
          <div className="flex-1 min-w-[200px]">
            <label htmlFor="cash-ledger" className="block text-sm font-medium text-gray-700 mb-1">
              Cash Ledger
            </label>
            <select
              id="cash-ledger"
              value={selectedLedger}
              onChange={(e) => setSelectedLedger(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              disabled={isLoading}
            >
              <option value="">Select a Cash Ledger</option>
              {dummyCashLedgers.map((ledger) => (
                <option key={ledger.id} value={ledger.id}>
                  {ledger.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Conditionally show File Upload only after both selections are made */}
      {selectedBank && selectedLedger ? (
        <>
          <FileUploadBox onUpload={handleFileUpload} disabled={isLoading} />
          
          {isLoading && (
            <div className="mt-4 text-center">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
              <p className="text-gray-600 inline">
                {parsingProgress || "Processing Excel file... Please wait."}
              </p>
            </div>
          )}

          {bankData.length > 0 && !isLoading && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">Statement Preview (From Uploaded Excel File)</h2>
              <StatementPreviewTable data={bankData} />
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleReconcile}
                  className="px-6 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 disabled:bg-gray-400"
                  disabled={isLoading}
                >
                  Reconcile
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
          <p className="text-gray-500">Please select a Bank Account and a Cash Ledger to begin.</p>
        </div>
      )}

      {records.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-semibold mb-4">Reconciliation Results</h2>
          <UnifiedReconciliationTable data={records} />
        </div>
      )}
    </div>
  );
}
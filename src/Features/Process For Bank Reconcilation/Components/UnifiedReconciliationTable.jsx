import React, { useState } from "react";
import { FaCheckCircle, FaTimesCircle, FaInfoCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function UnifiedReconciliationTable({ data: initialData }) {
  const [data, setData] = useState(initialData);
  const navigate = useNavigate();

  const handleDoubleClick = (index) => {
    const entry = data[index];
    if (entry.inBank && !entry.inBooks) {
      const confirm = window.confirm(
        `Are you sure you want to add this entry to your books?\n\n` +
        `Date: ${entry.date}\n` +
        `Amount: ₹${entry.amount}\n` +
        `Description: ${entry.description}`
      );
      if (confirm) {
        const newData = [...data];
        newData[index] = { ...newData[index], inBooks: true };
        setData(newData);
      }
    }
  };

  const handleViewStatement = () => {
    navigate("/dashboard/billing-manager/bank-reconciliation-page", { state: { data } });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-IN');
    } catch {
      return dateStr;
    }
  };

  // Calculate summary statistics
  const matchedCount = data.filter(entry => entry.inBank && entry.inBooks).length;
  const onlyInBankCount = data.filter(entry => entry.inBank && !entry.inBooks).length;
  const onlyInBooksCount = data.filter(entry => !entry.inBank && entry.inBooks).length;
  
  const matchedAmount = data
    .filter(entry => entry.inBank && entry.inBooks)
    .reduce((sum, entry) => sum + entry.amount, 0);
  
  const unmatchedBankAmount = data
    .filter(entry => entry.inBank && !entry.inBooks)
    .reduce((sum, entry) => sum + entry.amount, 0);
  
  const unmatchedBookAmount = data
    .filter(entry => !entry.inBank && entry.inBooks)
    .reduce((sum, entry) => sum + entry.amount, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <FaCheckCircle className="text-green-600 text-lg mr-3" />
            <div>
              <h3 className="font-semibold text-green-800">Matched Transactions</h3>
              <p className="text-sm text-green-600">{matchedCount} transactions</p>
              <p className="text-lg font-bold text-green-800">{formatAmount(matchedAmount)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <FaTimesCircle className="text-red-600 text-lg mr-3" />
            <div>
              <h3 className="font-semibold text-red-800">Only in Bank</h3>
              <p className="text-sm text-red-600">{onlyInBankCount} transactions</p>
              <p className="text-lg font-bold text-red-800">{formatAmount(unmatchedBankAmount)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <FaInfoCircle className="text-yellow-600 text-lg mr-3" />
            <div>
              <h3 className="font-semibold text-yellow-800">Only in Books</h3>
              <p className="text-sm text-yellow-600">{onlyInBooksCount} transactions</p>
              <p className="text-lg font-bold text-yellow-800">{formatAmount(unmatchedBookAmount)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <div className="flex items-start">
          <FaInfoCircle className="text-blue-600 text-sm mt-0.5 mr-2" />
          <div className="text-sm text-blue-700">
            <p className="font-semibold mb-1">How to use this reconciliation table:</p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Green entries:</strong> Matched transactions (found in both bank statement and books)</li>
              <li><strong>Red entries:</strong> Only in bank statement - may need to be recorded in books</li>
              <li><strong>Yellow entries:</strong> Only in books - may be pending in bank or need investigation</li>
              <li><strong>Double-click</strong> on "Only in Bank" entries to add them to your books</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Reconciliation Table */}
      <div className="overflow-auto border rounded-md shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-right">Amount</th>
              <th className="px-4 py-3 text-left">Description</th>
              <th className="px-4 py-3 text-left">Reference</th>
              <th className="px-4 py-3 text-center">In Bank</th>
              <th className="px-4 py-3 text-center">In Books</th>
              <th className="px-4 py-3 text-center">Status</th>
              {data.some(entry => entry.matchScore > 0) && (
                <th className="px-4 py-3 text-center">Match Score</th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((entry, idx) => {
              const isMatched = entry.inBank && entry.inBooks;
              const onlyInBank = entry.inBank && !entry.inBooks;
              const onlyInBooks = !entry.inBank && entry.inBooks;
              
              let statusColor = "text-green-600";
              let statusLabel = "Matched";
              let rowBgColor = "";
              
              if (onlyInBank) {
                statusColor = "text-red-600";
                statusLabel = "Only in Bank";
                rowBgColor = "bg-red-50";
              } else if (onlyInBooks) {
                statusColor = "text-yellow-600";
                statusLabel = "Only in Books";
                rowBgColor = "bg-yellow-50";
              } else if (isMatched) {
                rowBgColor = "bg-green-50";
              }

              return (
                <tr
                  key={entry.id || idx}
                  className={`border-t hover:bg-opacity-70 ${rowBgColor} ${
                    onlyInBank ? 'cursor-pointer' : ''
                  }`}
                  onDoubleClick={() => handleDoubleClick(idx)}
                  title={onlyInBank ? "Double-click to add to books" : ""}
                >
                  <td className="px-4 py-3">{formatDate(entry.date)}</td>
                  <td className="px-4 py-3 text-right font-mono">
                    {formatAmount(entry.amount)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="max-w-xs truncate" title={entry.description}>
                      {entry.description}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {entry.reference || '-'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {entry.inBank ? (
                      <FaCheckCircle className="text-green-600 w-4 h-4 mx-auto" />
                    ) : (
                      <FaTimesCircle className="text-red-600 w-4 h-4 mx-auto" />
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {entry.inBooks ? (
                      <FaCheckCircle className="text-green-600 w-4 h-4 mx-auto" />
                    ) : (
                      <FaTimesCircle className="text-red-600 w-4 h-4 mx-auto" />
                    )}
                  </td>
                  <td className={`px-4 py-3 text-center font-semibold ${statusColor}`}>
                    {statusLabel}
                  </td>
                  {data.some(entry => entry.matchScore > 0) && (
                    <td className="px-4 py-3 text-center">
                      {entry.matchScore > 0 ? (
                        <span className={`px-2 py-1 rounded text-xs ${
                          entry.matchScore >= 90 ? 'bg-green-100 text-green-800' :
                          entry.matchScore >= 70 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {entry.matchScore}%
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* Action Button */}
      <div className="flex justify-end">
        <button
          onClick={handleViewStatement}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
        >
          Generate Reconciliation Statement
        </button>
      </div>
    </div>
  );
}
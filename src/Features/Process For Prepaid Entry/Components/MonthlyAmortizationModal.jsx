/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { toast } from "react-toastify";
import { 
  getMonthlyAmortizationCount, 
  processMonthlyAmortization 
} from "../../Master/utils/accountingHelpers";

export default function MonthlyAmortizationModal({ onClose, invoice }) {
  const [amortizationCount, setAmortizationCount] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [loading, setLoading] = useState(false);
  const [availableMonths, setAvailableMonths] = useState([]);

  if (!invoice) return null;

  // Get prepaid details
  const accountingResult = invoice.accountingResult;
  const prepaidDetails = accountingResult?.prepaidDetails || invoice.prepaidDetails || {};
  const prepaidPeriod = invoice.prepaidPeriod || prepaidDetails.prepaidPeriod || 12;
  const prepaidStartMonth = invoice.prepaidStartMonth || prepaidDetails.prepaidStartMonth || new Date().toISOString().slice(0, 7);
  
  // Calculate taxable amount and monthly amortization
  const gstPercentage = invoice.gstRate || 18;
  const baseAmount = accountingResult?.breakdown?.taxable || Math.round(invoice.totalAmount / (1 + gstPercentage/100));
  const monthlyExpense = invoice.monthlyAmortization || prepaidDetails.monthlyAmortization || Math.round(baseAmount / prepaidPeriod);
  const remainingMonths = prepaidPeriod - amortizationCount;

  // Load amortization count and generate available months
  useEffect(() => {
    if (invoice.invoiceNumber) {
      const count = getMonthlyAmortizationCount(invoice.invoiceNumber);
      setAmortizationCount(count);
      
      // Generate list of available months for amortization
      const months = [];
      const startDate = new Date(prepaidStartMonth + "-01");
      
      for (let i = 0; i < prepaidPeriod; i++) {
        const monthDate = new Date(startDate);
        monthDate.setMonth(startDate.getMonth() + i);
        const monthYear = monthDate.toISOString().slice(0, 7);
        
        // Check if this month already has amortization
        const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
        const hasAmortization = transactions.some(txn => 
          txn.invoiceNumber === invoice.invoiceNumber &&
          txn.monthYear === monthYear &&
          txn.entries?.some(entry => entry.glCode === "X2001004" && entry.debit > 0)
        );
        
        if (!hasAmortization) {
          months.push({
            value: monthYear,
            label: monthDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
          });
        }
      }
      
      setAvailableMonths(months);
      
      // Set default to first available month only if no month is selected
      if (months.length > 0 && !selectedMonth) {
        setSelectedMonth(months[0].value);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoice.invoiceNumber, prepaidStartMonth, prepaidPeriod]);

  const handleProcessAmortization = async () => {
    if (!selectedMonth) {
      toast.error("Please select a month for amortization");
      return;
    }

    setLoading(true);
    
    try {
      const result = processMonthlyAmortization(invoice, selectedMonth);
      
      if (result.success) {
        toast.success(result.message);
        
        // Refresh count
        const newCount = getMonthlyAmortizationCount(invoice.invoiceNumber);
        setAmortizationCount(newCount);
        
        // Remove processed month from available months and set next available
        setAvailableMonths(prev => {
          const remaining = prev.filter(m => m.value !== selectedMonth);
          if (remaining.length > 0) {
            setSelectedMonth(remaining[0].value);
          } else {
            setSelectedMonth("");
          }
          return remaining;
        });
      } else {
        toast.error(result.error || "Failed to process amortization");
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Get list of passed amortizations
  const getPassedAmortizations = () => {
    try {
      const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
      const amortizations = transactions
        .filter(txn => 
          txn.invoiceNumber === invoice.invoiceNumber &&
          txn.entries?.some(entry => entry.glCode === "X2001004" && entry.debit > 0)
        )
        .map(txn => ({
          monthYear: txn.monthYear || txn.date.slice(0, 7),
          voucherNo: txn.voucherNo,
          amount: txn.totalDebit || txn.entries?.find(e => e.glCode === "X2001004")?.debit || 0,
          date: txn.date
        }))
        .sort((a, b) => a.monthYear.localeCompare(b.monthYear));
      
      return amortizations;
    } catch (error) {
      console.error('Error getting passed amortizations:', error);
      return [];
    }
  };

  const passedAmortizations = getPassedAmortizations();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
      <div className="w-full max-w-4xl rounded-lg bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-blue-700">
            Monthly Amortization - Invoice {invoice.invoiceNumber}
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-800"
          >
            <AiOutlineClose size={24} />
          </button>
        </div>

        {/* Invoice Information */}
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <h3 className="font-semibold text-gray-700 mb-2">Invoice Information</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p><strong>Invoice #:</strong> {invoice.invoiceNumber}</p>
              <p><strong>Vendor:</strong> {invoice.vendorName}</p>
              <p><strong>Total Amount:</strong> ₹{invoice.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
            <div>
              <p><strong>Prepaid Period:</strong> {prepaidPeriod} months</p>
              <p><strong>Start Month:</strong> {new Date(prepaidStartMonth + "-01").toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
              <p><strong>Monthly Amount:</strong> ₹{monthlyExpense.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
          </div>
        </div>

        {/* Amortization Status */}
        <div className="bg-blue-50 p-4 rounded-lg mb-4">
          <h3 className="font-semibold text-blue-700 mb-2">Amortization Status</h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{amortizationCount}</p>
              <p className="text-gray-600">Passed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{remainingMonths}</p>
              <p className="text-gray-600">Remaining</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{prepaidPeriod}</p>
              <p className="text-gray-600">Total Period</p>
            </div>
          </div>
        </div>

        {/* Passed Amortizations List */}
        {passedAmortizations.length > 0 && (
          <div className="mb-4">
            <h3 className="font-semibold text-gray-700 mb-2">Passed Amortizations</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left border">Month/Year</th>
                    <th className="p-2 text-right border">Amount (₹)</th>
                    <th className="p-2 text-left border">Voucher No</th>
                    <th className="p-2 text-left border">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {passedAmortizations.map((amort, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="p-2 border">
                        {new Date(amort.monthYear + "-01").toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </td>
                      <td className="p-2 text-right border">
                        {amort.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="p-2 border">{amort.voucherNo}</td>
                      <td className="p-2 border">{new Date(amort.date).toLocaleDateString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Process New Amortization */}
        {remainingMonths > 0 && (
          <div className="bg-yellow-50 p-4 rounded-lg mb-4">
            <h3 className="font-semibold text-gray-700 mb-3">Process Monthly Amortization</h3>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Month/Year
                </label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading || availableMonths.length === 0}
                >
                  {availableMonths.length === 0 ? (
                    <option value="">No months available</option>
                  ) : (
                    <>
                      <option value="">Select a month</option>
                      {availableMonths.map(month => (
                        <option key={month.value} value={month.value}>
                          {month.label}
                        </option>
                      ))}
                    </>
                  )}
                </select>
              </div>
              <button
                onClick={handleProcessAmortization}
                disabled={loading || !selectedMonth || availableMonths.length === 0}
                className={`px-6 py-2 rounded-md text-white font-medium ${
                  loading || !selectedMonth || availableMonths.length === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading ? "Processing..." : "Process Amortization"}
              </button>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              This will create a Journal Voucher with DR X2001004 (X2-UNIFORM EXPENSE) and CR A3005001 (UNIFORM EXPENSE)
            </p>
          </div>
        )}

        {remainingMonths === 0 && (
          <div className="bg-green-50 p-4 rounded-lg mb-4 text-center">
            <p className="text-green-700 font-semibold">
              ✓ All monthly amortizations have been completed for this invoice.
            </p>
          </div>
        )}

        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}


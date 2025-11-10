import React from "react";
import { AiOutlineClose } from "react-icons/ai";

export default function JournalVoucherModal({ onClose, invoice }) {
  if (!invoice) return null;

  // Get prepaid details from invoice or accounting result
  const accountingResult = invoice.accountingResult;
  const prepaidDetails = accountingResult?.prepaidDetails || invoice.prepaidDetails || {};
  
  const prepaidPeriod = invoice.prepaidPeriod || prepaidDetails.prepaidPeriod || 12;
  const prepaidStartMonth = invoice.prepaidStartMonth || prepaidDetails.prepaidStartMonth || new Date().toISOString().slice(0, 7);
  
  // Calculate taxable amount (base amount before GST)
  const gstPercentage = invoice.gstRate || 18;
  const baseAmount = accountingResult?.breakdown?.taxable || Math.round(invoice.totalAmount / (1 + gstPercentage/100));
  const monthlyExpense = invoice.monthlyAmortization || prepaidDetails.monthlyAmortization || Math.round(baseAmount / prepaidPeriod);

  // GL Codes for amortization JV
  const uniformExpenseGLCode = "X2001004"; // Uniform Expense (X2-UNIFORM EXPENSE)
  const uniformPrepaidGLCode = invoice.uniformPrepaidGLCode || "A3005001"; // A3005-UNIFORM Prepaid

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
      <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-blue-700">
            Monthly Amortization Journal Voucher (Preview)
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <AiOutlineClose size={20} />
          </button>
        </div>

        <div className="mb-4">
          <p><strong>Invoice Ref:</strong> {invoice.invoiceNumber}</p>
          <p><strong>Vendor:</strong> {invoice.vendorName}</p>
          <p><strong>Period:</strong> {prepaidPeriod} months starting {prepaidStartMonth}</p>
          <p><strong>Narration:</strong> Monthly amortization for Prepaid Uniform Expense Invoice {invoice.invoiceNumber}</p>
          <p className="text-xs text-gray-600 mt-2">
            <strong>Note:</strong> This is a preview. Monthly amortization JV will be created via button click as per requirement.
          </p>
        </div>

        <div className="border rounded-lg overflow-hidden mb-4">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left border">Particulars</th>
                <th className="p-2 text-right border">Debit (₹)</th>
                <th className="p-2 text-right border">Credit (₹)</th>
                <th className="p-2 text-left border">GL Code</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 border">X2-UNIFORM EXPENSE</td>
                <td className="p-2 text-right border">{monthlyExpense.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td className="p-2 text-right border">-</td>
                <td className="p-2 border">{uniformExpenseGLCode}</td>
              </tr>
              <tr className="bg-gray-50 font-medium">
                <td className="p-2 border">A3005-UNIFORM Prepaid</td>
                <td className="p-2 text-right border">-</td>
                <td className="p-2 text-right border">{monthlyExpense.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td className="p-2 border">{uniformPrepaidGLCode}</td>
              </tr>
              <tr className="bg-blue-50 font-bold border-t-2">
                <td className="p-2 border">Total</td>
                <td className="p-2 text-right border">{monthlyExpense.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td className="p-2 text-right border">{monthlyExpense.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td className="p-2 border"></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-blue-50 p-3 rounded mb-4">
          <p className="text-sm">
            Monthly amortization of <strong>₹{monthlyExpense.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong> will be posted monthly. 
            This will continue for <strong>{prepaidPeriod} months</strong> until the prepaid asset is fully amortized.
          </p>
          <p className="text-xs text-gray-600 mt-2">
            Total prepaid amount: ₹{baseAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} | 
            Monthly amortization: ₹{monthlyExpense.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
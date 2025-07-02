// File: src/features/billingManager/components/JournalVoucherModal.jsx
import React from "react";
import { AiOutlineClose } from "react-icons/ai";

export default function JournalVoucherModal({  onClose, invoice }) {

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
      <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-blue-700">
            Journal Voucher Entry
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <AiOutlineClose size={20} />
          </button>
        </div>

        <div className="space-y-3 text-sm text-gray-700">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-medium text-gray-600">Invoice No:</p>
              <p>{invoice.invoiceNumber}</p>
            </div>
            <div>
              <p className="font-medium text-gray-600">Vendor Name:</p>
              <p>{invoice.vendorName}</p>
            </div>

            <div>
              <p className="font-medium text-gray-600">Total Amount:</p>
              <p>₹{invoice.totalAmount.toLocaleString()}</p>
            </div>
            <div>
              <p className="font-medium text-gray-600">Selected Period:</p>
              <p>{invoice.billingPeriod}</p>
            </div>
          </div>

          <div>
            <p className="font-medium text-gray-600 mb-1">Explanation:</p>
            <p>
              A <span className="font-semibold">Prepaid Expense Entry</span> is being
              passed for the selected billing period. This allocates the expense to
              the correct accounting period in compliance with accrual accounting.
            </p>
          </div>

          <div>
            <p className="font-medium text-gray-600 mb-1">Journal Entry Details:</p>
            <ul className="list-disc list-inside">
              <li>
                Debit: <span className="font-semibold">Prepaid Expense</span> ₹{invoice.totalAmount.toLocaleString()}
              </li>
              <li>
                Credit: <span className="font-semibold">Uniform Expense</span> ₹{invoice.totalAmount.toLocaleString()}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 text-right">
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

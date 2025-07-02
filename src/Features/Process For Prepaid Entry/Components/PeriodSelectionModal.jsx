// File: src/components/PeriodSelectionModal.jsx
import React, { useState } from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";

export default function PeriodSelectionModal({ isOpen, onClose, onSubmit }) {
  const [fromMonth, setFromMonth] = useState("");
  const [toMonth, setToMonth] = useState("");

  const handleConfirm = () => {
    if (fromMonth && toMonth && fromMonth <= toMonth) {
      onSubmit({ fromMonth, toMonth });
      onClose();
    } else {
      alert("Please select a valid From and To month.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-red-600">
          <IoMdCloseCircleOutline size={20} />
        </button>
        <h2 className="text-xl font-bold mb-4">Select Approval Period</h2>
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium">From Month</label>
            <input type="date" value={fromMonth} onChange={(e) => setFromMonth(e.target.value)} className="border p-2 w-full rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium">To Month</label>
            <input type="date" value={toMonth} onChange={(e) => setToMonth(e.target.value)} className="border p-2 w-full rounded" />
          </div>
        </div>
        <div className="mt-4 text-right">
          <button onClick={handleConfirm} className="bg-green-600 text-white px-4 py-2 rounded">
            Confirm & Approve
          </button>
        </div>
      </div>
    </div>
  );
}

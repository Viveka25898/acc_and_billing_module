/* eslint-disable no-unused-vars */
// src/features/processPayments/components/PaymentActions.jsx
import React from "react";
import { toast } from "react-toastify";

export default function PaymentActions({ data, onClose, onRequestChanges }) {
  const handleAccept = () => {
    try {
      const existing = JSON.parse(localStorage.getItem("paymentEntries")) || [];
      const updated = [...existing, ...data];
      localStorage.setItem("paymentEntries", JSON.stringify(updated));
      toast.success("Payment entries accepted and saved.");
      onClose();
    } catch (err) {
      toast.error("Failed to save payment data.");
    }
  };

  const handleRequestChanges = () => {
  toast.info("You can now edit payment details.");
  onRequestChanges(data); // 👈 call parent function
};


  const handleCancel = () => {
    toast.warn("Transaction cancelled.");
    onClose();
  };

  return (
    <div className="flex flex-col sm:flex-row justify-end items-center gap-4 mt-4">
      <button
        onClick={handleCancel}
        className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
      >
        Cancel
      </button>
      <button
        onClick={handleRequestChanges}
        className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
      >
        Request Changes
      </button>
      <button
        onClick={handleAccept}
        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
      >
        Accept
      </button>
    </div>
  );
}

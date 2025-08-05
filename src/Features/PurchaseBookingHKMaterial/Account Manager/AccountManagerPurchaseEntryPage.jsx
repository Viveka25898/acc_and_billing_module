/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import AMManualPurchaseEntryModal from "./AccountManagerManualPurchaseEntryModal";

export default function AMInvoiceApproval({ invoice: invoiceProp }) {
  const location = useLocation();
  const invoice = invoiceProp || location.state?.invoice;
  const initialStatus = invoice?.purchaseEntryStatus || "Pending";

  const [status, setStatus] = useState(initialStatus);
  const [showModal, setShowModal] = useState(false);
  const [isActionDone, setIsActionDone] = useState(
    initialStatus === "Auto Booked" || initialStatus === "Manual Entry Submitted"
  );
  const [entryType, setEntryType] = useState(
    initialStatus === "Auto Booked" ? "Auto Entry" : initialStatus === "Manual Entry Submitted" ? "Manual Entry" : ""
  );

  const handleAutoApproval = () => {
    try {
      setStatus("Auto Booked");
      setEntryType("Auto Entry");
      setIsActionDone(true);
      toast.success("✅ Invoice auto-approved and purchase entry created successfully.");
    } catch (error) {
      toast.error("❌ Failed to auto-approve invoice.");
    }
  };

  const handleManualEntry = () => {
    setShowModal(true);
  };

  // Manual Entry Submission Handler
  const handleManualEntrySubmit = (data) => {
    try {
      console.log("Manual Entry Data:", data);
      // Simulate successful submission
      setStatus("Manual Entry Submitted");
      setEntryType("Manual Entry");
      setIsActionDone(true);
      setShowModal(false);
      toast.success("✅ Manual purchase entry submitted successfully.");
    } catch (error) {
      console.error("Error submitting manual entry:", error);
      toast.error("❌ Failed to submit manual purchase entry.");
    }
  };

  if (!invoice) {
    return <div className="text-red-600 p-4">Invoice data not found.</div>;
  }

  return (
    <div className="w-full bg-white shadow rounded p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
          Invoice No: {invoice.invoiceNumber}
        </h3>
        <p className="text-sm text-blue-600 font-medium">Account Manager - Purchase Entry</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={handleAutoApproval}
          className={`text-white text-sm px-4 py-2 rounded ${
            isActionDone ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
          }`}
          disabled={isActionDone}
        >
          Approve (Auto Entry)
        </button>

        <button
          onClick={handleManualEntry}
          className={`text-white text-sm px-4 py-2 rounded ${
            isActionDone ? "bg-gray-400 cursor-not-allowed" : "bg-yellow-500 hover:bg-yellow-600"
          }`}
          disabled={isActionDone}
        >
          Manual Entry
        </button>
      </div>

      {isActionDone && (
        <p className="text-sm text-gray-700 mt-1 font-medium">{entryType}</p>
      )}

      {showModal && (
        <AMManualPurchaseEntryModal
          invoice={invoice}
          onClose={() => setShowModal(false)}
          onSubmit={handleManualEntrySubmit}
        />
      )}
    </div>
  );
}
import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import ConveyanceForm from "../Components/ConveyanceForm";
import { submitConveyanceClaim, selectConveyanceSubmitLoading } from "../../../store/slices/conveyanceSlice";
import { FiList } from "react-icons/fi";

export default function SubmitConveyancePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const submitLoading = useSelector(selectConveyanceSubmitLoading);

  const handleSubmit = async (formData) => {
    try {
      const result = await dispatch(submitConveyanceClaim(formData)).unwrap();
      toast.success(result.message || "Conveyance request submitted successfully!");
      return true;
    } catch (error) {
      console.error("Submission Error:", error);
      toast.error(error || "Submission failed. Please try again.");
      return false;
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
      {/* Header Container */}
      <div className="bg-gradient-to-r from-green-700 to-green-600 rounded-2xl shadow-lg p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Conveyance Claim Request</h1>
          <p className="text-green-100 text-sm mt-1 font-medium">
            Fill in details and upload visit reports/receipts to submit reimbursement claims.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/dashboard/employee/my-conveyance-requests")}
            className="flex items-center gap-2 bg-white text-green-700 hover:bg-green-50 px-4 py-2 rounded-xl text-sm font-semibold transition shadow-md cursor-pointer"
          >
            <FiList size={16} /> My Requests
          </button>
        </div>
      </div>

      {/* Conveyance Form Container */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <ConveyanceForm
          onSubmit={handleSubmit}
          submitLoading={submitLoading}
        />
      </div>
    </div>
  );
}
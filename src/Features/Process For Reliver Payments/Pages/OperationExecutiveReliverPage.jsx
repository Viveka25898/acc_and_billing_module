import React from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import RelieverForm from "../Components/ReliverForm";
import { submitRelieverRequest } from "../../../store/slices/relieverSlice";

export default function OperationExecutiveReliverPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleFormSubmit = async (formData) => {
    try {
      await dispatch(submitRelieverRequest(formData)).unwrap();
      toast.success("Request submitted successfully!");
      navigate("/dashboard/employee/my-reliver-requests");
    } catch (error) {
      console.error("Error submitting request:", error);
      toast.error(`Failed to submit request: ${error}`);
      throw error; // Propagate to let form reset state manage submission correctly
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
      {/* Premium Green Header Block */}
      <div className="bg-gradient-to-r from-green-700 to-green-600 px-6 py-5 text-white flex justify-between items-center shadow-sm">
        <h1 className="text-xl font-bold tracking-wide">Reliever Request Form</h1>
        <button
          className="bg-white hover:bg-gray-100 text-green-700 font-semibold px-4 py-2 rounded-xl text-sm transition-all shadow-sm cursor-pointer"
          onClick={() => navigate("/dashboard/employee/my-reliver-requests")}
        >
          My Requests
        </button>
      </div>

      <div className="p-2">
        <RelieverForm onSubmit={handleFormSubmit} />
      </div>
    </div>
  );
}
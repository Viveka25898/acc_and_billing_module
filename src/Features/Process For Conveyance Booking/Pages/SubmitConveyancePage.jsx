import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import ConveyanceForm from "../Components/ConveyanceForm";
import { submitConveyanceClaim, selectConveyanceSubmitLoading } from "../../../store/slices/conveyanceSlice";
import { selectRole } from "../../../Auth/authSlice";
import { FiList } from "react-icons/fi";

const getMyRequestsPath = (role) => {
  const normRole = (role || "").toLowerCase().replace(/_/g, "-");
  if (normRole === "regional-head") return "/dashboard/regional-head/my-conveyance-requests";
  if (normRole === "line-manager") return "/dashboard/line-manager/my-conveyance-requests";
  if (normRole === "manager" || normRole === "operation-manager" || normRole === "facility-manager") return "/dashboard/manager/my-conveyance-requests";
  if (normRole === "avp-operations" || normRole === "avp") return "/dashboard/avp-operations/my-conveyance-requests";
  if (normRole === "vp-operations" || normRole === "vp") return "/dashboard/vp-operations/my-conveyance-requests";
  if (normRole === "operation-executive") return "/dashboard/operation-executive/my-conveyance-requests";
  if (normRole === "account-executive" || normRole === "ae") return "/dashboard/ae/my-conveyance-requests";
  if (normRole === "supervisor" || normRole === "site-supervisor") return "/dashboard/supervisor/my-conveyance-requests";
  if (normRole === "compliance-team") return "/dashboard/compliance-team/my-conveyance-requests";
  if (normRole === "compliance-manager") return "/dashboard/compliance-manager/my-conveyance-requests";
  if (normRole === "payroll-team" || normRole === "payroll-executive") return "/dashboard/payroll-team/my-conveyance-requests";
  return "/dashboard/employee/my-conveyance-requests";
};

export default function SubmitConveyancePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const submitLoading = useSelector(selectConveyanceSubmitLoading);

  const rawRole = useSelector(selectRole);
  const localUser = JSON.parse(localStorage.getItem("user")) || {};
  const role = rawRole || localUser.role || "";

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

  const handleNavigateMyRequests = () => {
    const targetPath = getMyRequestsPath(role);
    navigate(targetPath);
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
            onClick={handleNavigateMyRequests}
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
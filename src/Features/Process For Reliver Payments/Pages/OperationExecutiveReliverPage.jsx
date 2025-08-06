import React from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import RelieverForm from "../Components/ReliverForm";

export default function OperationExecutiveReliverPage() {
  const navigate = useNavigate();



  const handleFormSubmit = async (formData) => {
  try {
    const existingRequests = JSON.parse(localStorage.getItem("relieverRequests")) || [];
    const users = JSON.parse(localStorage.getItem("users"));
    const currentUser = JSON.parse(localStorage.getItem("user"));
    console.log(currentUser);

    // Find the current user's details from users array
    const currentUserDetails = users.find(user => user.username === currentUser.username);
    
    if (!currentUserDetails) {
      throw new Error("Current user not found in system");
    }

    // Get the Line Manager this OE reports to
    const lineManager = users.find(user => user.username === currentUserDetails.reportsTo);
    console.log(lineManager);
    
    // Get VP Operations (the line manager's manager)
    const vpOperations = lineManager ? users.find(user => user.username === lineManager.reportsTo) : null;
    console.log(vpOperations);
    
    // Get Account Executive (the VP's manager - assuming this is always ae1)
    const accountExecutive = "ae1"; // or could be vpOperations?.reportsTo if dynamic

    const newRequest = {
      ...formData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: "Pending Line Manager Approval",
      submittedBy: currentUser.username,
      currentApprover: lineManager?.username || null,
      approvers: {
        lineManager: lineManager?.username || null,
        vpOperations: vpOperations?.username || null,
        accountExecutive: accountExecutive
      },
      history: [{
        action: "Submitted",
        by: currentUser.username,
        at: new Date().toISOString(),
        comments: "Initial submission"
      }],
      files: {
        idProof: formData.idProof?.name || null,
        passbookFile: formData.passbookFile?.name || null
      }
    };

    localStorage.setItem(
      "relieverRequests",
      JSON.stringify([...existingRequests, newRequest])
    );

    toast.success("Request submitted successfully!");
    navigate("/dashboard/operation-executive/my-requests");
  } catch (error) {
    console.error("Error submitting request:", error);
    toast.error(`Failed to submit request: ${error.message}`);
  }
};

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 bg-white rounded-md shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-green-600">Reliever Request Form</h1>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition cursor-pointer"
          onClick={() => navigate("/dashboard/operation-executive/my-requests")}
        >
          My Requests
        </button>
      </div>

      <RelieverForm onSubmit={handleFormSubmit} />
    </div>
  );
}
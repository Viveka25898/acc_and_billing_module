import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ConveyanceForm from "../Components/ConveyanceForm";

const initialEntry = {
  date: "",
  purpose: "",
  client: "",
  transport: "",
  distance: "",
  amount: "",
  reports: [null],  
  remarks: "",
};

export default function SubmitConveyancePage() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState([initialEntry]);
  const [errors, setErrors] = useState([]);
  
  const currentUser = JSON.parse(localStorage.getItem("user")) || {};
  const allUsers = JSON.parse(localStorage.getItem("users")) || [];
  const userData = allUsers.find(user => user.username === currentUser.username) || {};

  const resetForm = () => {
    setEntries([initialEntry]);
    setErrors([]);
  };

  const handleSubmit = async () => {
    try {
      // Check if user has a manager assigned
      if (!userData.reportsTo) {
        toast.error("No reporting manager assigned. Cannot submit request.");
        return false;
      }

      // Validate all entries
      const allValid = entries.every((entry, idx) => {
        const entryErrors = {};
        
        if (!entry.date) entryErrors.date = "Date is required";
        if (!entry.purpose) entryErrors.purpose = "Purpose is required";
        if (!entry.client) entryErrors.client = "Client is required";
        if (!entry.transport) entryErrors.transport = "Transport mode is required";
        if (!entry.distance || isNaN(entry.distance)) entryErrors.distance = "Valid distance required";
        if (!entry.amount || isNaN(entry.amount)) entryErrors.amount = "Valid amount required";

        if (!entry.reports || entry.reports.length === 0 || !entry.reports.some(f => f)) {
          entryErrors.report = "At least one visit report is required";
        }

        const updatedErrors = [...errors];
        updatedErrors[idx] = entryErrors;
        setErrors(updatedErrors);

        return Object.keys(entryErrors).length === 0;
      });

      if (!allValid) {
        toast.error("Please fix form errors before submitting.");
        return false;
      }

      // Get existing requests or initialize
      const allRequests = JSON.parse(localStorage.getItem("conveyanceRequests")) || [];
      
      // Create new requests with metadata
      const newRequests = entries.map(entry => {
        const reportFiles = entry.reports.map(file => {
          if (!file) return null;
          return {
            name: file.name,
            type: file.type,
            size: file.size,
            lastModified: file.lastModified
          };
        });

        const receiptFiles = entry.receipts?.map(file => {
          if (!file) return null;
          return {
            name: file.name,
            type: file.type,
            size: file.size,
            lastModified: file.lastModified
          };
        });

        return {
          ...entry,
          reports: reportFiles,
          receipts: receiptFiles,
          id: Date.now().toString(),
          submittedAt: new Date().toISOString(),
          submittedBy: currentUser.username,
          employeeId: userData.empId || currentUser.username,
          employeeName: currentUser.username,
          status: "Pending Manager Approval",
          assignedTo: userData.reportsTo,
          currentLevel: "line-manager",
          approvers: [],
          rejections: []
        };
      });

      // Save to localStorage
      localStorage.setItem(
        "conveyanceRequests",
        JSON.stringify([...allRequests, ...newRequests])
      );

      toast.success("Conveyance request submitted successfully!");
      return true;
    } catch (error) {
      console.error("Submission Error:", error);
      toast.error("Submission failed. Please try again.");
      return false;
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto bg-white rounded-md shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-green-600">Conveyance Booking Form</h2>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={() => navigate("/dashboard/employee/my-conveyance-requests")}
        >
          My Conveyance Requests
        </button>
      </div>
      <ConveyanceForm
        entries={entries}
        setEntries={setEntries}
        errors={errors}
        setErrors={setErrors}
        onSubmit={handleSubmit}
        resetForm={resetForm}
      />
    </div>
  );
}
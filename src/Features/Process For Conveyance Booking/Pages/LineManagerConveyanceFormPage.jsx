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
  report: null,
  remarks: "",
};

export default function LinemanagerConveyanceFormPage() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState([initialEntry]);
  const [errors, setErrors] = useState([]);

  const handleSubmit = async () => {
    try {
      const allValid = entries.every((entry, idx) => {
        const entryErrors = {};
        if (!entry.date) entryErrors.date = "Date is required";
        if (!entry.purpose) entryErrors.purpose = "Purpose is required";
        if (!entry.client) entryErrors.client = "Client is required";
        if (!entry.transport) entryErrors.transport = "Transport mode is required";
        if (!entry.distance || isNaN(entry.distance)) entryErrors.distance = "Valid distance required";
        if (!entry.amount || isNaN(entry.amount)) entryErrors.amount = "Valid amount required";
        if (!entry.report) entryErrors.report = "Report upload is required";
        else if (!["application/pdf", "image/jpeg", "image/png"].includes(entry.report.type)) {
          entryErrors.report = "Only PDF, JPG, PNG allowed";
        }
        const updatedErrors = [...errors];
        updatedErrors[idx] = entryErrors;
        setErrors(updatedErrors);
        return Object.keys(entryErrors).length === 0;
      });

      if (!allValid) {
        toast.error("Please fix form errors before submitting.");
        return;
      }

      console.log("Submitting entries:", entries);
      toast.success("Conveyance request submitted successfully!");
    } catch (error) {
      console.error("Submission Error:", error);
      toast.error("Something went wrong while submitting the form.");
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto bg-white rounded-md shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-green-600">Conveyance Booking Form - (Line Manager)</h2>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer"
          onClick={() => navigate("/dashboard/line-manager/my-conveyance-requests")}
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
      />
    </div>
  );
}

/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import RelieverForm from "../Components/ReliverForm";

export default function OperationExecutiveReliverPage() {
  const navigate = useNavigate();

  const handleFormSubmit = async (formData) => {
    try {
      // Simulate saving to localStorage or API in future
      const existing = JSON.parse(localStorage.getItem("relieverRequests")) || [];
      const updated = [
        ...existing,
        {
          ...formData,
          status: "Pending Line Manager Approval",
          id: Date.now(),
          createdAt: new Date().toISOString(),
        },
      ];
      localStorage.setItem("relieverRequests", JSON.stringify(updated));
      toast.success("Request submitted successfully!");
    } catch (error) {
      console.error("Error submitting request:", error);
      toast.error("Something went wrong!");
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

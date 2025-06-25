/* eslint-disable no-unused-vars */

import React, { useState } from "react";
import { toast } from "react-toastify";
import POForm from "../Components/POForm";
import { useNavigate } from "react-router-dom";

export default function GeneratePOPage() {
  const navigate=useNavigate()
  const handleSubmit = async (formData) => {
    try {
      // Simulate API call
      console.log("PO Submitted:", formData);
      toast.success("PO generated successfully!");
    } catch (error) {
      console.error("Error submitting PO:", error);
      toast.error("Failed to generate PO.");
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto w-full bg-white rounded-md shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-green-600">Generate Purchase Order</h1>
        <button
        onClick={()=>navigate("/dashboard/manager/my-po")}
        className=" bg-green-600 px-4 py-2 rounded-xl cursor-pointer text-white hover:bg-green-700"
        >My PO</button>
      </div>
      <POForm onSubmit={handleSubmit} />
    </div>
  );
}

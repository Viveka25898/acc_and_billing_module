/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import POForm from "./POForm";
import POSummary from "./PoSummery";

export default function PHGeneratePOPage() {
  const { state } = useLocation();
  const requestData = state?.requestData;

  const [poData, setPoData] = useState(null);
  const [showSummary, setShowSummary] = useState(false);

  const handleSubmit = (formData) => {
    setPoData(formData); // Only save form data
  };

  const handleShowSummary = () => {
    setShowSummary(true); // When Show Summary clicked
  };

  const handleBackToForm = () => {
    setShowSummary(false); // Optional: Back from summary
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <h1 className="text-xl font-bold mb-4 text-green-600">Generate Purchase Order</h1>

      {!showSummary ? (
        <>
          <POForm
            initialRequestData={requestData}
            onSubmit={handleSubmit}
            onCancel={() => window.history.back()}
            isSubmitted={!!poData}
          />

          {/* ✅ Show Button AFTER submission */}
          {poData && (
            <div className="mt-4 text-right">
              <button
                onClick={handleShowSummary}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Show Summary
              </button>
            </div>
          )}
        </>
      ) : (
        <>
          <POSummary poData={poData} />
          <div className="mt-4 text-right">
            <button
              onClick={handleBackToForm}
              className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
            >
              Back to Form
            </button>
          </div>
        </>
      )}
    </div>
  );
}

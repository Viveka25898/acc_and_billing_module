// File: src/features/vendor/pages/VendorInvoicePage.jsx

import React from "react";
import { useNavigate } from "react-router-dom";
import VendorInvoiceForm from "../../Components/VendorInvoiceForm";
import { toast } from "react-toastify";


export default function VendorInvoicePage() {
  const navigate = useNavigate();

  const handleSubmit = (formData) => {
    console.log("Submitted Invoice Data:", formData);
  toast.success("Invoice Submitted Successfully!");
  navigate("/dashboard/vendor/vendor-invoice-preview", { state: { formData } });
  
  };

  const handleCancel = () => {
    const confirmCancel = window.confirm("Are you sure you want to cancel?");
    if (confirmCancel) navigate(-1); // Go back
  };

  return (
    <div className="max-w-5xl mx-auto p-4 bg-white shadow-md rounded-md">
  <div className="flex justify-between items-center mb-6">
    <h1 className="text-2xl font-bold text-green-600">Upload Vendor Invoice</h1>
    <button 
    onClick={()=>navigate("/dashboard/vendor/procurement-my-invoiice-table")}
    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer">
      My Invoices
    </button>
  </div>
  <VendorInvoiceForm onSubmit={handleSubmit} onCancel={handleCancel} />
</div>

  );
}


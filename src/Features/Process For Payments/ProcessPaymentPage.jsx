/* eslint-disable no-debugger */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import UploadPaymentFile from "./Components/UploadPaymentFile";
import PaymentPreviewModal from "./Components/PaymentPreviewModal";
import EditPaymentDetails from "./Components/EditPaymentDetails";
import { parseExcelFile } from "./utils/excelParser";

export default function ProcessPaymentPage() {
  const [parsedData, setParsedData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editableData, setEditableData] = useState([]);

  const handleFileUpload = async (file) => {
    
    const data = await parseExcelFile(file);
    setParsedData(data);
    setIsModalOpen(true);
    console.log("Handle File Upload",data);
  };

  const handleCloseModal = () => {
    
    setIsModalOpen(false);
    setEditMode(false);
    setParsedData([]);
  };

  const handleRequestChanges = (data) => {
    
    setEditableData(data);       // ✅ correct value
    setEditMode(true);
    setIsModalOpen(false);
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4 text-center">Process for Payments</h1>

      <UploadPaymentFile onFileUpload={handleFileUpload} />

      {isModalOpen && (
        <PaymentPreviewModal
          data={parsedData}
          onClose={handleCloseModal}
          onRequestChanges={handleRequestChanges}
        />
      )}

      {editMode && (
        <EditPaymentDetails
          data={editableData}
          setData={setParsedData}
          onCancel={handleCloseModal}
        />
      )}
    </div>
  );
}

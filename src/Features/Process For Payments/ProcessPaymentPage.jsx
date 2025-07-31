/* eslint-disable no-debugger */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import UploadPaymentFile from "./Components/UploadPaymentFile";
import PaymentPreviewModal from "./Components/PaymentPreviewModal";
import EditPaymentDetails from "./Components/EditPaymentDetails";
import { parseExcelFile } from "./utils/excelParser";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";


export default function ProcessPaymentPage() {
  const [parsedData, setParsedData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editableData, setEditableData] = useState([]);

  const handleFileUpload = async (file) => {
    
    const data = await parseExcelFile(file);
    setParsedData(data);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    
    setIsModalOpen(false);
    setEditMode(false);
    setParsedData([]);
  };

  const handleRequestChanges = (data) => {
    
    setEditableData(data);       
    setEditMode(true);
    setIsModalOpen(false);
  };

  //Empty File Download Function
  const handleDownloadTemplate = () => {
  const sampleData = [
    {
      "TYPE": "NEFT",
      "DEBIT BANK A/C NO": "1234567890",
      "DEBIT AMT": "", // leave empty for user input
      "CUR": "INR",
      "BENIFICARY A/C NO": "9876543210",
      "IFSC CODE": "SBIN0000123",
      "NARRTION/NAME (NOT MORE THAN 20)": "", // to be filled with emp.employeeName.slice(0, 20)
    },
  ];
   

  const worksheet = XLSX.utils.json_to_sheet(sampleData, { skipHeader: false });
  worksheet["!cols"] = [
    { wch: 10 },  // TYPE
    { wch: 20 },  // DEBIT BANK A/C NO
    { wch: 12 },  // DEBIT AMT
    { wch: 8 },   // CUR
    { wch: 20 },  // BENIFICARY A/C NO
    { wch: 15 },  // IFSC
    { wch: 30 },  // NARRATION
  ];
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "PaymentTemplate");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(blob, "Pre-Formatted_Payment_Template.xlsx");
};


  return (
    <div className="p-4 max-w-6xl mx-auto bg-white shadow-md rounded-md">
      <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-green-600">
              Process for Payments
            </h1>
            <button
              onClick={handleDownloadTemplate}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              ⬇️ Download Pre-Formatted Payment File
            </button>
     </div>


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

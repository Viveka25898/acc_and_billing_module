import React from "react";

export default function ChallanPreviewModal({ file, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-red-500 font-bold">X</button>
        <h2 className="text-lg font-semibold mb-4">Challan Preview</h2>
        <iframe
          src={URL.createObjectURL(file)}
          title="Challan"
          className="w-full h-[400px] border"
        />
      </div>
    </div>
  );
}

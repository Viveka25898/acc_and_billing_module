import React, { useState, useEffect } from "react";

const ModifyRequestModal = ({ open, onClose, request, onSubmit }) => {
  const [modifiedRequest, setModifiedRequest] = useState({ ...request });
console.log("Requests in Modify",request);
useEffect(() => {
    if (request) {
      const deepCopiedRequest = JSON.parse(JSON.stringify(request));
      setModifiedRequest(deepCopiedRequest);
    }
  }, [request]);
  

  const handleChange = (e, field, index = null) => {
    const value = e.target.value;
    if (field.startsWith("items")) {
      const fieldName = field.split(".")[1];
      const updatedItems = [...modifiedRequest.items];
      updatedItems[index][fieldName] = value;
      setModifiedRequest((prev) => ({
        ...prev,
        items: updatedItems,
      }));
    } else {
      setModifiedRequest((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSubmit = () => {
    const updatedRequest = {
      ...modifiedRequest,
      status: "Pending Modification Acceptance",
      history: [
        ...(modifiedRequest.history || []),
        {
          actor: "Manager",
          time: new Date().toISOString(),
          remark: "Suggested modifications",
        },
      ],
    };
    onSubmit(updatedRequest);
    onClose();
  };

  if (!open || !request) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl overflow-y-auto max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-semibold">Modify Material Request</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-red-600 text-2xl font-bold">&times;</button>
        </div>

        {/* Modal Content */}
        <div className="p-4 space-y-6">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 border p-4 rounded-lg">
    <div>
      <label className="block mb-1 text-sm font-medium">Material</label>
      <input
        type="text"
        value={modifiedRequest.materialName || ""}
        onChange={(e) => handleChange(e, "materialName")}
        className="w-full border rounded px-3 py-2"
      />
    </div>
    <div>
      <label className="block mb-1 text-sm font-medium">Quantity</label>
      <input
        type="number"
        value={modifiedRequest.quantity || ""}
        onChange={(e) => handleChange(e, "quantity")}
        className="w-full border rounded px-3 py-2"
      />
    </div>
    <div>
      <label className="block mb-1 text-sm font-medium">Unit</label>
      <input
        type="text"
        value={modifiedRequest.uom || ""}
        onChange={(e) => handleChange(e, "uom")}
        className="w-full border rounded px-3 py-2"
      />
    </div>
    <div>
      <label className="block mb-1 text-sm font-medium">Remarks</label>
      <input
        type="text"
        value={modifiedRequest.remarks || ""}
        onChange={(e) => handleChange(e, "remarks")}
        className="w-full border rounded px-3 py-2"
      />
    </div>
  </div>
</div>


        {/* Modal Footer */}
        <div className="flex justify-end items-center gap-4 border-t p-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 text-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Submit Modifications
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModifyRequestModal;

import { useState, useRef } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ExpenseUploadForm = () => {
  const [attachments, setAttachments] = useState([{ id: 1, file: null }]);
  const excelRef = useRef(null);
  const attachmentRefs = useRef([]);

  const handleAttachmentChange = (index, file) => {
    const updated = [...attachments];
    updated[index].file = file;
    setAttachments(updated);
  };

  const addAttachmentField = () => {
    setAttachments([...attachments, { id: Date.now(), file: null }]);
  };

  const removeAttachmentField = (index) => {
    const updated = attachments.filter((_, i) => i !== index);
    setAttachments(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const excelFile = excelRef.current?.files[0];
    const hasEmptyAttachments = attachments.some((_, i) => !attachmentRefs.current[i]?.files[0]);

    if (!excelFile || hasEmptyAttachments) {
      toast.error("❗ Please upload Excel file and all attachments.");
      return;
    }

    console.log("Excel File:", excelFile);
    console.log("Attachments:", attachmentRefs.current.map(ref => ref?.files[0]));

    // Clear fields
    if (excelRef.current) excelRef.current.value = "";
    attachmentRefs.current.forEach(ref => {
      if (ref) ref.value = "";
    });
    setAttachments([{ id: 1, file: null }]); // Reset to 1 field

    toast.success("✅ Advance settlement submitted successfully");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6">
      {/* Excel File Upload */}
      <div className="mb-6">
        <label className="block font-medium mb-1">Excel File (.xls/.xlsx)</label>
        <input
          type="file"
          accept=".xlsx,.xls"
          ref={excelRef}
          className="w-full border p-2 rounded"
        />
      </div>

      {/* Attachments */}
      <div className="mb-6">
        <label className="block font-medium mb-2">Attachments (Bills/Receipts)</label>
        {attachments.map((item, index) => (
          <div key={item.id} className="flex items-center gap-2 mb-2">
            <input
              type="file"
              ref={(el) => (attachmentRefs.current[index] = el)}
              onChange={(e) => handleAttachmentChange(index, e.target.files[0])}
              className="flex-1 border p-2 rounded"
            />
            {attachments.length === 1 && attachments.length < 10 && (
              <button
                type="button"
                onClick={addAttachmentField}
                className="text-white bg-green-600 px-2 py-1 rounded"
              >
                +
              </button>
            )}
            {attachments.length > 1 && (
              <>
                {attachments.length < 10 && (
                  <button
                    type="button"
                    onClick={addAttachmentField}
                    className="text-white bg-green-600 px-2 py-1 rounded"
                  >
                    +
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeAttachmentField(index)}
                  className="text-white bg-red-600 px-2 py-1 rounded"
                >
                  -
                </button>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
      >
        Submit to Line Manager
      </button>
    </form>
  );
};

export default ExpenseUploadForm;

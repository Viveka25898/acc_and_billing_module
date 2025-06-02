// src/features/advanceSettlement/components/UploadForm.jsx
import { useState } from "react";

const ExpenseUploadForm = () => {
  const [excelFile, setExcelFile] = useState(null);
  const [attachments, setAttachments] = useState([{ id: 1, file: null }]);
  const [message, setMessage] = useState("");

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

    const hasEmptyAttachments = attachments.some((a) => a.file === null);
    if (!excelFile || hasEmptyAttachments) {
      setMessage("❗ Please upload Excel file and all attachments.");
      return;
    }

    console.log("Excel File:", excelFile);
    console.log("Attachments:", attachments.map((a) => a.file));
    setMessage("✅ Advance settlement submitted successfully (Dummy)");
  };

  return (
    <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto bg-white p-6 rounded shadow"
    >
                    <h2 className="text-2xl font-semibold mb-4 text-center text-gray-700">
                        Advance Settlement Upload
                    </h2>

                    {/* Excel File Upload */}
                    <div className="mb-6">
                        <label className="block font-medium mb-1">Excel File (.xls/.xlsx)</label>
                        <input
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={(e) => setExcelFile(e.target.files[0])}
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

                    {/* Message */}
                    {message && (
                        <p className="mt-4 text-center text-green-600 font-medium">{message}</p>
                    )}
    </form>
  );
};

export default ExpenseUploadForm;

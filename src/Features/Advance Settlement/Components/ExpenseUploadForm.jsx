import { useState, useRef } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ExpenseUploadForm = ({ onSubmit, onError }) => {
  const [attachments, setAttachments] = useState([{ id: 1, file: null }]);
  const [totalSize, setTotalSize] = useState(0); // Track total size in bytes
  const excelRef = useRef(null);
  const attachmentRefs = useRef([]);

  const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB in bytes
  const MAX_TOTAL_SIZE = 10 * 1024 * 1024; // 10MB in bytes

  const handleAttachmentChange = (index, file) => {
    if (!file) {
      const updated = [...attachments];
      updated[index].file = null;
      setAttachments(updated);
      return;
    }

    // Check individual file size
    if (file.size > MAX_FILE_SIZE) {
      toast.error(`❌ File "${file.name}" exceeds 1MB limit`);
      // Clear the file input
      if (attachmentRefs.current[index]) {
        attachmentRefs.current[index].value = "";
      }
      return;
    }

    // Calculate new total size
    const currentFileSize = attachments[index].file ? attachments[index].file.size : 0;
    const newTotalSize = totalSize - currentFileSize + file.size;

    // Check total size limit
    if (newTotalSize > MAX_TOTAL_SIZE) {
      toast.error(`❌ Total attachments size exceeds 10MB limit`);
      // Clear the file input
      if (attachmentRefs.current[index]) {
        attachmentRefs.current[index].value = "";
      }
      return;
    }

    const updated = [...attachments];
    updated[index].file = file;
    setAttachments(updated);
    setTotalSize(newTotalSize);
  };

  const addAttachmentField = () => {
    if (attachments.length >= 10) {
      toast.error("❌ Maximum 10 attachments allowed");
      return;
    }
    setAttachments([...attachments, { id: Date.now(), file: null }]);
  };

  const removeAttachmentField = (index) => {
    // Subtract the file size from total when removing
    const removedFileSize = attachments[index].file ? attachments[index].file.size : 0;
    setTotalSize(totalSize - removedFileSize);
    
    const updated = attachments.filter((_, i) => i !== index);
    setAttachments(updated);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const excelFile = excelRef.current?.files[0];
    const attachmentFiles = attachments
      .map(attachment => attachment.file)
      .filter(file => file);

    // Validate Excel file size
    if (excelFile && excelFile.size > MAX_FILE_SIZE) {
      onError('Excel file exceeds 1MB size limit');
      return;
    }

    if (!excelFile || attachmentFiles.length === 0) {
      onError('Please upload Excel file and at least one attachment.');
      return;
    }

    // Validate all attachments are within size limits
    const oversizedFiles = attachmentFiles.filter(file => file.size > MAX_FILE_SIZE);
    if (oversizedFiles.length > 0) {
      onError('Some attachments exceed the 1MB size limit');
      return;
    }

    if (totalSize > MAX_TOTAL_SIZE) {
      onError('Total attachments size exceeds 10MB limit');
      return;
    }

    try {
      const success = await onSubmit(excelFile, attachmentFiles);
      if (success) {
        toast.success("✅ Advance settlement submitted successfully");
        // Clear fields after successful submission
        if (excelRef.current) excelRef.current.value = "";
        attachmentRefs.current.forEach(ref => {
          if (ref) ref.value = "";
        });
        setAttachments([{ id: 1, file: null }]);
        setTotalSize(0); // Reset total size
      }
    } catch (error) {
      onError('Failed to submit settlement. Please try again.');
      console.error("Submission error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6">
      {/* Excel File Upload */}
      <div className="mb-6">
        <label className="block font-medium mb-1">Excel File (.xls/.xlsx) - Max 1MB</label>
        <input
          type="file"
          accept=".xlsx,.xls"
          ref={excelRef}
          className="w-full border p-2 rounded"
          required
        />
      </div>

      {/* Attachments */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label className="block font-medium">
            Attachments (Bills/Receipts) - Max 1MB each
          </label>
          <span className="text-sm text-gray-600">
            Total: {formatFileSize(totalSize)} / {formatFileSize(MAX_TOTAL_SIZE)}
          </span>
        </div>
        
        {attachments.map((item, index) => (
          <div key={item.id} className="flex items-center gap-2 mb-2">
            <input
              type="file"
              ref={(el) => (attachmentRefs.current[index] = el)}
              onChange={(e) => handleAttachmentChange(index, e.target.files[0])}
              className="flex-1 border p-2 rounded"
              required={index === 0}
            />
            {item.file && (
              <span className="text-xs text-gray-500">
                {formatFileSize(item.file.size)}
              </span>
            )}
            
            <div className="flex gap-1">
              {attachments.length < 10 && (
                <button
                  type="button"
                  onClick={addAttachmentField}
                  className="text-white bg-green-600 px-2 py-1 rounded text-sm"
                  title="Add another attachment"
                >
                  +
                </button>
              )}
              {attachments.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeAttachmentField(index)}
                  className="text-white bg-red-600 px-2 py-1 rounded text-sm"
                  title="Remove this attachment"
                >
                  -
                </button>
              )}
            </div>
          </div>
        ))}
        
        <p className="text-sm text-gray-600 mt-2">
          Maximum 10 attachments allowed (10MB total)
        </p>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded disabled:bg-gray-400"
        disabled={totalSize > MAX_TOTAL_SIZE}
      >
        Submit to Line Manager
      </button>
    </form>
  );
};

export default ExpenseUploadForm;
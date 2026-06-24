import { useState, useRef } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ExpenseUploadForm = ({ onSubmit, onError, isSubmitting = false }) => {
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
    <form onSubmit={handleSubmit} className="w-full p-4 sm:p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Excel File Upload */}
        <div className="bg-gray-50/50 border border-gray-200/60 rounded-2xl p-5 shadow-sm flex flex-col justify-between min-h-[160px]">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-1.5">
              📊 Excel File (.xls/.xlsx) - Max 1MB
            </label>
            <p className="text-xs text-gray-500 mb-4">
              Upload the formatted Excel sheet containing your expense ledger lines.
            </p>
          </div>
          <input
            type="file"
            accept=".xlsx,.xls"
            ref={excelRef}
            className="w-full border border-gray-200 bg-white px-3 py-2.5 rounded-xl text-sm file:mr-4 file:py-1.5 file:px-3.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 transition shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 disabled:opacity-60 disabled:cursor-not-allowed"
            required
            disabled={isSubmitting}
          />
        </div>

        {/* Right Column: Attachments */}
        <div className="bg-gray-50/50 border border-gray-200/60 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
            <label className="block text-sm font-bold text-gray-700 flex items-center gap-1.5">
              📎 Attachments (Max 1MB each)
            </label>
            <span className="text-xs font-semibold text-gray-500 bg-white px-2.5 py-1 rounded-full border border-gray-100 shadow-sm shrink-0">
              Total: {formatFileSize(totalSize)} / {formatFileSize(MAX_TOTAL_SIZE)}
            </span>
          </div>
          <p className="text-xs text-gray-500 mb-4">
            Upload supporting receipts/bills (Max 10 files allowed).
          </p>
          
          <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
            {attachments.map((item, index) => (
              <div key={item.id} className="flex items-center gap-2">
                <input
                  type="file"
                  ref={(el) => (attachmentRefs.current[index] = el)}
                  onChange={(e) => handleAttachmentChange(index, e.target.files[0])}
                  className="flex-1 border border-gray-200 bg-white px-3 py-2 rounded-xl text-sm file:mr-3 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                  required={index === 0}
                  disabled={isSubmitting}
                />
                {item.file && (
                  <span className="text-xs font-medium text-gray-500 bg-gray-150 px-2 py-0.5 rounded shrink-0">
                    {formatFileSize(item.file.size)}
                  </span>
                )}
                
                <div className="flex gap-1 shrink-0">
                  {attachments.length < 10 && (
                    <button
                      type="button"
                      onClick={addAttachmentField}
                      className="text-white bg-green-600 hover:bg-green-700 font-semibold px-2.5 py-1.5 rounded-lg text-xs transition active:scale-95 flex items-center justify-center w-7 h-7 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Add another attachment"
                      disabled={isSubmitting}
                    >
                      +
                    </button>
                  )}
                  {attachments.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeAttachmentField(index)}
                      className="text-white bg-red-500 hover:bg-red-650 font-semibold px-2.5 py-1.5 rounded-lg text-xs transition active:scale-95 flex items-center justify-center w-7 h-7 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Remove this attachment"
                      disabled={isSubmitting}
                    >
                      -
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="pt-4 border-t border-gray-100">
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-650 text-white font-bold py-3 rounded-xl shadow-md hover:shadow-lg transition transform active:scale-[0.99] disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-sm uppercase tracking-wider flex items-center justify-center gap-2"
          disabled={isSubmitting || totalSize > MAX_TOTAL_SIZE}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Uploading Settlement...</span>
            </>
          ) : (
            <span>Submit Settlement Request</span>
          )}
        </button>
      </div>
    </form>
  );
};

export default ExpenseUploadForm;
import React, { useRef, useState } from "react";
import { FiCalendar, FiMapPin, FiTruck, FiDollarSign, FiFileText, FiUploadCloud, FiTrash2, FiPlus, FiInfo } from "react-icons/fi";
import { toast } from "react-toastify";

const initialForm = {
  visit_date: "",
  purpose: "",
  client_name: "",
  custom_client: "",
  transport_mode: "",
  distance_km: "",
  amount: "",
  remarks: "",
};

export default function ConveyanceForm({ onSubmit, submitLoading }) {
  const [formData, setFormData] = useState(initialForm);
  const [reportFiles, setReportFiles] = useState([null]);
  const [receiptFiles, setReceiptFiles] = useState([null]);
  const [errors, setErrors] = useState({});

  const reportRefs = useRef([]);
  const receiptRefs = useRef([]);

  const isReceiptMandatory = (transport) => {
    return ["CAB", "BUS", "AUTO", "TRAIN"].includes((transport || "").toUpperCase());
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "client_name" && value !== "Other" ? { custom_client: "" } : {}),
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleReportFileChange = (index, file) => {
    if (file && file.size > 2 * 1024 * 1024) {
      toast.error("File size must be 2 MB or less");
      return;
    }
    const updated = [...reportFiles];
    updated[index] = file;
    setReportFiles(updated);
    if (errors.report_files) {
      setErrors((prev) => ({ ...prev, report_files: "" }));
    }
  };

  const handleReceiptFileChange = (index, file) => {
    if (file && file.size > 2 * 1024 * 1024) {
      toast.error("File size must be 2 MB or less");
      return;
    }
    const updated = [...receiptFiles];
    updated[index] = file;
    setReceiptFiles(updated);
    if (errors.receipt_files) {
      setErrors((prev) => ({ ...prev, receipt_files: "" }));
    }
  };

  const addReportFileInput = () => {
    if (reportFiles.length >= 5) {
      toast.info("Maximum 5 report files allowed");
      return;
    }
    setReportFiles((prev) => [...prev, null]);
  };

  const removeReportFileInput = (index) => {
    if (reportFiles.length === 1) {
      setReportFiles([null]);
      if (reportRefs.current[0]) reportRefs.current[0].value = "";
      return;
    }
    setReportFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const addReceiptFileInput = () => {
    if (receiptFiles.length >= 5) {
      toast.info("Maximum 5 receipt files allowed");
      return;
    }
    setReceiptFiles((prev) => [...prev, null]);
  };

  const removeReceiptFileInput = (index) => {
    if (receiptFiles.length === 1) {
      setReceiptFiles([null]);
      if (receiptRefs.current[0]) receiptRefs.current[0].value = "";
      return;
    }
    setReceiptFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.visit_date) {
      newErrors.visit_date = "Date of visit is required";
    }

    if (!formData.purpose.trim()) {
      newErrors.purpose = "Purpose of visit is required";
    }

    const selectedClient = formData.client_name === "Other" ? formData.custom_client : formData.client_name;
    if (!selectedClient || !selectedClient.trim()) {
      newErrors.client_name = "Client / Site name is required";
    }

    if (!formData.transport_mode) {
      newErrors.transport_mode = "Mode of transport is required";
    }

    if (!formData.distance_km || isNaN(formData.distance_km) || Number(formData.distance_km) <= 0) {
      newErrors.distance_km = "Valid distance (km) is required";
    }

    if (!formData.amount || isNaN(formData.amount) || Number(formData.amount) <= 0) {
      newErrors.amount = "Valid reimbursement amount is required";
    }

    // Check visit report files
    const validReports = reportFiles.filter(Boolean);
    if (validReports.length === 0) {
      newErrors.report_files = "At least one visit report PDF/image is required";
    }

    // Check receipt files if mandatory
    if (isReceiptMandatory(formData.transport_mode)) {
      const validReceipts = receiptFiles.filter(Boolean);
      if (validReceipts.length === 0) {
        newErrors.receipt_files = `Receipt file is mandatory for ${formData.transport_mode} transport mode`;
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fill in all required fields marked with *");
      return;
    }

    // Prepare FormData payload matching backend contract
    const data = new FormData();
    data.append("visit_date", formData.visit_date);
    data.append("purpose", formData.purpose.trim());

    const clientFinal = formData.client_name === "Other" ? formData.custom_client.trim() : formData.client_name.trim();
    data.append("client_name", clientFinal);
    data.append("transport_mode", formData.transport_mode.toUpperCase());
    data.append("distance_km", parseFloat(formData.distance_km).toString());
    data.append("amount", parseFloat(formData.amount).toString());

    if (formData.remarks.trim()) {
      data.append("remarks", formData.remarks.trim());
    }

    // Append report files
    reportFiles.forEach((file) => {
      if (file) data.append("report_files", file);
    });

    // Append receipt files
    receiptFiles.forEach((file) => {
      if (file) data.append("receipt_files", file);
    });

    const success = await onSubmit(data);
    if (success) {
      setFormData(initialForm);
      setReportFiles([null]);
      setReceiptFiles([null]);
      setErrors({});
      if (reportRefs.current[0]) reportRefs.current[0].value = "";
      if (receiptRefs.current[0]) receiptRefs.current[0].value = "";
    }
  };

  return (
    <form className="p-6 space-y-6 bg-white" onSubmit={handleSubmit}>
      {/* Information Banner */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3 text-sm text-green-800">
        <FiInfo className="text-green-600 mt-0.5 shrink-0" size={18} />
        <div>
          <span className="font-semibold text-green-900">Submission Guidelines:</span> Provide accurate visit details and distance. Visit report is mandatory. Transport receipt is required for <strong>Cab, Bus, Auto, & Train</strong>. Maximum file size is 2 MB per attachment.
        </div>
      </div>

      {/* Grid Inputs Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
        {/* Date of Visit */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
            <FiCalendar className="text-green-600" /> Date of Visit *
          </label>
          <input
            type="date"
            name="visit_date"
            value={formData.visit_date}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-all shadow-sm"
          />
          {errors.visit_date && <p className="text-red-600 text-xs mt-1 font-medium">{errors.visit_date}</p>}
        </div>

        {/* Client / Site Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
            <FiMapPin className="text-green-600" /> Client / Site Name *
          </label>
          <select
            name="client_name"
            value={formData.client_name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-all shadow-sm"
          >
            <option value="">-- Select Client / Site --</option>
            <option value="Jindal group">Jindal group</option>
            <option value="ABC Corporation">ABC Corporation</option>
            <option value="Site A">Site A</option>
            <option value="Site B">Site B</option>
            <option value="Site C">Site C</option>
            <option value="Site D">Site D</option>
            <option value="Other">Other (Custom Entry)</option>
          </select>
          {errors.client_name && <p className="text-red-600 text-xs mt-1 font-medium">{errors.client_name}</p>}

          {formData.client_name === "Other" && (
            <div className="mt-2">
              <input
                type="text"
                name="custom_client"
                placeholder="Enter custom client/site name *"
                value={formData.custom_client}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-all shadow-sm"
              />
            </div>
          )}
        </div>

        {/* Purpose of Visit */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
            <FiFileText className="text-green-600" /> Purpose of Visit *
          </label>
          <input
            type="text"
            name="purpose"
            placeholder="e.g. Client site inspection and security audit"
            value={formData.purpose}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-all shadow-sm"
          />
          {errors.purpose && <p className="text-red-600 text-xs mt-1 font-medium">{errors.purpose}</p>}
        </div>

        {/* Transport Mode */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
            <FiTruck className="text-green-600" /> Mode of Transport *
          </label>
          <select
            name="transport_mode"
            value={formData.transport_mode}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-all shadow-sm uppercase font-medium"
          >
            <option value="">-- Select Transport Mode --</option>
            <option value="AUTO">Auto</option>
            <option value="CAB">Cab</option>
            <option value="BIKE">Bike</option>
            <option value="BUS">Bus</option>
            <option value="TRAIN">Train</option>
          </select>
          {errors.transport_mode && <p className="text-red-600 text-xs mt-1 font-medium">{errors.transport_mode}</p>}
        </div>

        {/* Distance in KM */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
            <FiMapPin className="text-green-600" /> Distance Traveled (KM) *
          </label>
          <input
            type="number"
            name="distance_km"
            placeholder="e.g. 22"
            min="0.1"
            step="0.1"
            value={formData.distance_km}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-all shadow-sm"
          />
          {errors.distance_km && <p className="text-red-600 text-xs mt-1 font-medium">{errors.distance_km}</p>}
        </div>

        {/* Amount Claimed */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
            <FiDollarSign className="text-green-600" /> Amount Claimed (₹) *
          </label>
          <input
            type="number"
            name="amount"
            placeholder="e.g. 800"
            min="1"
            step="0.01"
            value={formData.amount}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-all shadow-sm font-semibold text-gray-800"
          />
          {errors.amount && <p className="text-red-600 text-xs mt-1 font-medium">{errors.amount}</p>}
        </div>

        {/* Remarks */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Remarks (Optional)
          </label>
          <input
            type="text"
            name="remarks"
            placeholder="e.g. Return journey included"
            value={formData.remarks}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Attachments Section */}
      <div className="border-t border-gray-200 pt-6 space-y-6">
        <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
          <FiUploadCloud className="text-green-600" size={20} /> Attachment Uploads
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Visit Reports */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-gray-800">
                Visit Report PDF(s) *
              </label>
              <span className="text-xs text-gray-500">Max 2MB per file</span>
            </div>

            {reportFiles.map((file, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="file"
                  accept="application/pdf,image/jpeg,image/png"
                  onChange={(e) => handleReportFileChange(idx, e.target.files[0])}
                  ref={(el) => (reportRefs.current[idx] = el)}
                  className="w-full text-xs text-gray-600 border border-gray-300 rounded-xl p-2 bg-white file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                />
                <button
                  type="button"
                  onClick={() => removeReportFileInput(idx)}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                  title="Remove file"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            ))}

            {reportFiles.length < 5 && (
              <button
                type="button"
                onClick={addReportFileInput}
                className="flex items-center gap-1 text-xs text-green-700 font-semibold hover:text-green-800 transition"
              >
                <FiPlus size={14} /> Add another report file
              </button>
            )}

            {errors.report_files && (
              <p className="text-red-600 text-xs font-medium">{errors.report_files}</p>
            )}
          </div>

          {/* Transport Receipts */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-gray-800">
                Transport Receipt PDF(s) {isReceiptMandatory(formData.transport_mode) ? "*" : "(Optional)"}
              </label>
              <span className="text-xs text-gray-500">Max 2MB per file</span>
            </div>

            {receiptFiles.map((file, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="file"
                  accept="application/pdf,image/jpeg,image/png"
                  onChange={(e) => handleReceiptFileChange(idx, e.target.files[0])}
                  ref={(el) => (receiptRefs.current[idx] = el)}
                  className="w-full text-xs text-gray-600 border border-gray-300 rounded-xl p-2 bg-white file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <button
                  type="button"
                  onClick={() => removeReceiptFileInput(idx)}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                  title="Remove file"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            ))}

            {receiptFiles.length < 5 && (
              <button
                type="button"
                onClick={addReceiptFileInput}
                className="flex items-center gap-1 text-xs text-blue-700 font-semibold hover:text-blue-800 transition"
              >
                <FiPlus size={14} /> Add another receipt file
              </button>
            )}

            {errors.receipt_files && (
              <p className="text-red-600 text-xs font-medium">{errors.receipt_files}</p>
            )}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex justify-end pt-4 border-t border-gray-100">
        <button
          type="submit"
          disabled={submitLoading}
          className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
        >
          {submitLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              <span>Submitting Claim...</span>
            </>
          ) : (
            <span>Submit Conveyance Claim</span>
          )}
        </button>
      </div>
    </form>
  );
}
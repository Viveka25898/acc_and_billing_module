/* eslint-disable no-unused-vars */
import React, { useRef, useState } from "react";

const initialState = {
  name: "",
  type: "",
  site: "",
  relieverFor: "",
  date: "",
  shift: "",
  amount: "",
  remarks: "",
  relieverEmpCode: "",
  absentEmpCode: "",
  reason: "",
  accountNo: "",
  ifscCode: "",
  idProof: null,
  passbookFile: null,
};

export default function RelieverForm({ onSubmit }) {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const idProofRef = useRef();
  const passbookRef = useRef();

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.site.trim()) newErrors.site = "Site is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.amount || isNaN(formData.amount)) newErrors.amount = "Valid amount is required";
    if (!formData.type) newErrors.type = "Reliever type is required";
    if (!formData.shift) newErrors.shift = "Shift timing is required";
    if (!formData.idProof) newErrors.idProof = "ID proof is required";
    if (!formData.relieverEmpCode.trim()) newErrors.relieverEmpCode = "Reliever Emp Code is required";
    if (!formData.absentEmpCode.trim()) newErrors.absentEmpCode = "Absent Emp Code is required";
    if (!formData.reason.trim()) newErrors.reason = "Reason is required";
    if (!formData.accountNo.trim()) newErrors.accountNo = "Account number is required";
    if (!formData.ifscCode.trim()) newErrors.ifscCode = "IFSC code is required";
    if (!formData.passbookFile) newErrors.passbookFile = "Passbook file is required";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      await onSubmit(formData);
      setFormData(initialState);
      idProofRef.current.value = null;
      passbookRef.current.value = null;
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <form className="p-6 space-y-6" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Site *</label>
          <select 
            name="site" 
            value={formData.site} 
            onChange={handleChange} 
            className="mt-1 block w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-all shadow-sm"
          >
            <option value="">-- Select Site --</option>
            <option value="Site A">Site A</option>
            <option value="Site B">Site B</option>
            <option value="Site C">Site C</option>
          </select>
          {errors.site && <p className="text-red-600 text-xs mt-1 font-medium">{errors.site}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Reliever Type *</label>
          <select 
            name="type" 
            value={formData.type} 
            onChange={handleChange} 
            className="mt-1 block w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-all shadow-sm"
          >
            <option value="">-- Select Type --</option>
            <option value="Security">Security</option>
            <option value="Housekeeping">Housekeeping</option>
            <option value="Electrician">Electrician</option>
          </select>
          {errors.type && <p className="text-red-600 text-xs mt-1 font-medium">{errors.type}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Reliever Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-all shadow-sm"
            placeholder="Search or type name"
          />
          {errors.name && <p className="text-red-600 text-xs mt-1 font-medium">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Reliever Emp Code *</label>
          <input
            type="text"
            name="relieverEmpCode"
            value={formData.relieverEmpCode}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-all shadow-sm"
            placeholder="Enter Reliever's Emp Code"
          />
          {errors.relieverEmpCode && <p className="text-red-600 text-xs mt-1 font-medium">{errors.relieverEmpCode}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Reliever For (Replaced Employee)</label>
          <input
            type="text"
            name="relieverFor"
            value={formData.relieverFor}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-all shadow-sm"
            placeholder="Enter name being replaced"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Absent Emp Code *</label>
          <input
            type="text"
            name="absentEmpCode"
            value={formData.absentEmpCode}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-all shadow-sm"
            placeholder="Enter Absent Employee's Emp Code"
          />
          {errors.absentEmpCode && <p className="text-red-600 text-xs mt-1 font-medium">{errors.absentEmpCode}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Reason *</label>
          <input
            type="text"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-all shadow-sm"
            placeholder="Enter reason for reliever"
          />
          {errors.reason && <p className="text-red-600 text-xs mt-1 font-medium">{errors.reason}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Reliever Date *</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-all shadow-sm"
          />
          {errors.date && <p className="text-red-600 text-xs mt-1 font-medium">{errors.date}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Shift Timing *</label>
          <select 
            name="shift" 
            value={formData.shift} 
            onChange={handleChange} 
            className="mt-1 block w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-all shadow-sm"
          >
            <option value="">-- Select Shift --</option>
            <option value="Morning">Morning</option>
            <option value="Evening">Evening</option>
            <option value="Night">Night</option>
          </select>
          {errors.shift && <p className="text-red-600 text-xs mt-1 font-medium">{errors.shift}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Amount *</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-all shadow-sm"
            placeholder="0.00"
          />
          {errors.amount && <p className="text-red-600 text-xs mt-1 font-medium">{errors.amount}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Account Number *</label>
          <input
            type="text"
            name="accountNo"
            value={formData.accountNo}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-all shadow-sm"
            placeholder="Enter Account Number"
          />
          {errors.accountNo && <p className="text-red-600 text-xs mt-1 font-medium">{errors.accountNo}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">IFSC Code *</label>
          <input
            type="text"
            name="ifscCode"
            value={formData.ifscCode}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-all shadow-sm"
            placeholder="Enter IFSC Code"
          />
          {errors.ifscCode && <p className="text-red-600 text-xs mt-1 font-medium">{errors.ifscCode}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">ID Proof *</label>
          <input
            type="file"
            name="idProof"
            ref={idProofRef}
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => setFormData((prev) => ({ ...prev, idProof: e.target.files[0] }))}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 transition-all cursor-pointer border border-gray-300 rounded-xl p-1.5 shadow-sm"
          />
          {errors.idProof && <p className="text-red-600 text-xs mt-1 font-medium">{errors.idProof}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Passbook File (PDF/Image) *</label>
          <input
            type="file"
            name="passbookFile"
            ref={passbookRef}
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => setFormData((prev) => ({ ...prev, passbookFile: e.target.files[0] }))}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 transition-all cursor-pointer border border-gray-300 rounded-xl p-1.5 shadow-sm"
          />
          {errors.passbookFile && <p className="text-red-600 text-xs mt-1 font-medium">{errors.passbookFile}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Remarks</label>
          <textarea
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
            rows="3"
            className="mt-1 block w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-all shadow-sm"
            placeholder="Any extra details..."
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-xl transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 cursor-pointer disabled:opacity-50 flex items-center justify-center min-w-[150px]"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Request"}
        </button>
      </div>
    </form>
  );
}

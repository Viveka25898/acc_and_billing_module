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

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSubmit(formData);
    setFormData(initialState);
    idProofRef.current.value = null;
    passbookRef.current.value = null;
  };

  return (
    <form className="p-6 space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="block font-medium">Site *</label>
        <select name="site" value={formData.site} onChange={handleChange} className="mt-1 block w-full border rounded p-2">
          <option value="">-- Select Site --</option>
          <option value="Site A">Site A</option>
          <option value="Site B">Site B</option>
          <option value="Site C">Site C</option>
        </select>
        {errors.site && <p className="text-red-500 text-sm">{errors.site}</p>}
      </div>

      <div>
        <label className="block font-medium">Reliever Type *</label>
        <select name="type" value={formData.type} onChange={handleChange} className="mt-1 block w-full border rounded p-2">
          <option value="">-- Select Type --</option>
          <option value="Security">Security</option>
          <option value="Housekeeping">Housekeeping</option>
          <option value="Electrician">Electrician</option>
        </select>
      </div>

      <div>
        <label className="block font-medium">Reliever Name *</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full border rounded p-2"
          placeholder="Search or type name"
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
      </div>

      <div>
        <label className="block font-medium">Reliever Emp Code *</label>
        <input
          type="text"
          name="relieverEmpCode"
          value={formData.relieverEmpCode}
          onChange={handleChange}
          className="mt-1 block w-full border rounded p-2"
          placeholder="Enter Reliever's Emp Code"
        />
        {errors.relieverEmpCode && <p className="text-red-500 text-sm">{errors.relieverEmpCode}</p>}
      </div>

      <div>
        <label className="block font-medium">Reliever For</label>
        <input
          type="text"
          name="relieverFor"
          value={formData.relieverFor}
          onChange={handleChange}
          className="mt-1 block w-full border rounded p-2"
          placeholder="Enter name being replaced"
        />
      </div>

      <div>
        <label className="block font-medium">Absent Emp Code *</label>
        <input
          type="text"
          name="absentEmpCode"
          value={formData.absentEmpCode}
          onChange={handleChange}
          className="mt-1 block w-full border rounded p-2"
          placeholder="Enter Absent Employee's Emp Code"
        />
        {errors.absentEmpCode && <p className="text-red-500 text-sm">{errors.absentEmpCode}</p>}
      </div>

      <div>
        <label className="block font-medium">Reason *</label>
        <input
          type="text"
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          className="mt-1 block w-full border rounded p-2"
          placeholder="Enter reason for reliever"
        />
        {errors.reason && <p className="text-red-500 text-sm">{errors.reason}</p>}
      </div>

      <div>
        <label className="block font-medium">Reliever Date *</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="mt-1 block w-full border rounded p-2"
        />
        {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
      </div>

      <div>
        <label className="block font-medium">Shift Timing *</label>
        <select name="shift" value={formData.shift} onChange={handleChange} className="mt-1 block w-full border rounded p-2">
          <option value="">-- Select Shift --</option>
          <option value="Morning">Morning</option>
          <option value="Evening">Evening</option>
          <option value="Night">Night</option>
        </select>
      </div>

      <div>
        <label className="block font-medium">Amount *</label>
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          className="mt-1 block w-full border rounded p-2"
        />
        {errors.amount && <p className="text-red-500 text-sm">{errors.amount}</p>}
      </div>

      <div>
        <label className="block font-medium">ID Proof *</label>
        <input
          type="file"
          name="idProof"
          ref={idProofRef}
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => setFormData((prev) => ({ ...prev, idProof: e.target.files[0] }))}
          className="mt-1 block w-full border rounded p-2"
        />
        {errors.idProof && <p className="text-red-500 text-sm">{errors.idProof}</p>}
      </div>

      <div>
        <label className="block font-medium">Remarks</label>
        <textarea
          name="remarks"
          value={formData.remarks}
          onChange={handleChange}
          className="mt-1 block w-full border rounded p-2"
        />
      </div>

      <div>
        <label className="block font-medium">Account Number *</label>
        <input
          type="text"
          name="accountNo"
          value={formData.accountNo}
          onChange={handleChange}
          className="mt-1 block w-full border rounded p-2"
          placeholder="Enter Account Number"
        />
        {errors.accountNo && <p className="text-red-500 text-sm">{errors.accountNo}</p>}
      </div>

      <div>
        <label className="block font-medium">IFSC Code *</label>
        <input
          type="text"
          name="ifscCode"
          value={formData.ifscCode}
          onChange={handleChange}
          className="mt-1 block w-full border rounded p-2"
          placeholder="Enter IFSC Code"
        />
        {errors.ifscCode && <p className="text-red-500 text-sm">{errors.ifscCode}</p>}
      </div>

      <div>
        <label className="block font-medium">Passbook File (PDF/Image) *</label>
        <input
          type="file"
          name="passbookFile"
          ref={passbookRef}
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => setFormData((prev) => ({ ...prev, passbookFile: e.target.files[0] }))}
          className="mt-1 block w-full border rounded p-2"
        />
        {errors.passbookFile && <p className="text-red-500 text-sm">{errors.passbookFile}</p>}
      </div>

      <button
        type="submit"
        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
      >
        Submit Request
      </button>
    </form>
  );
}

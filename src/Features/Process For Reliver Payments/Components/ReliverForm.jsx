import React, { useState } from "react";

const initialState = {
  name: "",
  site: "",
  date: "",
  amount: "",
  remarks: "",
};

export default function RelieverForm({ onSubmit }) {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});

  const validate = () => {
  const newErrors = {};
  if (!formData.name.trim()) newErrors.name = "Name is required";
  if (!formData.site.trim()) newErrors.site = "Site is required";
  if (!formData.date) newErrors.date = "Date is required";
  if (!formData.amount || isNaN(formData.amount)) newErrors.amount = "Valid amount is required";
  if (!formData.type) newErrors.type = "Reliever type is required";
  if (!formData.shift) newErrors.shift = "Shift timing is required";
  if (!formData.idProof) newErrors.idProof = "ID proof is required";
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
  };

  return (
    <form
      className=" p-6  space-y-4"
      onSubmit={handleSubmit}
    >
      <div>
        <label className="block font-medium">Reliever Name *</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full border rounded p-2"
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
      </div>
      <div>
        <label className="block font-medium">Reliever Type *</label>
        <select
        name="type"
        value={formData.type}
        onChange={handleChange}
        className="mt-1 block w-full border rounded p-2"
        >
        <option value="">-- Select Type --</option>
        <option value="Security">Security</option>
        <option value="Housekeeping">Housekeeping</option>
        <option value="Electrician">Electrician</option>
        </select>

      </div>

      <div>
        <label className="block font-medium">Site *</label>
        <input
          type="text"
          name="site"
          value={formData.site}
          onChange={handleChange}
          className="mt-1 block w-full border rounded p-2"
        />
        {errors.site && <p className="text-red-500 text-sm">{errors.site}</p>}
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
        <select
            name="shift"
            value={formData.shift}
            onChange={handleChange}
            className="mt-1 block w-full border rounded p-2"
            >
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
            accept=".pdf,.jpg,.png"
            onChange={(e) =>
                setFormData((prev) => ({ ...prev, idProof: e.target.files[0] }))
            }
            className="mt-1 block w-full border rounded p-2"
            />

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

      <button
        type="submit"
        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
      >
        Submit Request
      </button>
    </form>
  );
}

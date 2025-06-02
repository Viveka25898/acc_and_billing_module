import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const initialFormState = {
  materialName: '',
  category: '',
  quantity: '',
  uom: '',
  site: '',
  location: '',
  remarks: '',
  priority: '',
  expectedDelivery: '',
  attachment: null,
};

const MaterialRequestForm = () => {
  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);


  const validate = () => {
    const newErrors = {};
    if (!form.materialName.trim()) newErrors.materialName = 'Material Name is required';
    if (!form.category) newErrors.category = 'Category is required';
    if (!form.quantity || Number(form.quantity) <= 0) newErrors.quantity = 'Quantity must be greater than 0';
    if (!form.uom) newErrors.uom = 'Unit of Measurement is required';
    if (!form.site) newErrors.site = 'Site is required';
    if (!form.location) newErrors.location = 'Location is required';
    if (!form.priority) newErrors.priority = 'Priority is required';
    if (!form.expectedDelivery) newErrors.expectedDelivery = 'Expected Delivery Date is required';

    if (form.attachment) {
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      if (!allowedTypes.includes(form.attachment.type)) {
        newErrors.attachment = 'Only PDF, JPEG, PNG files allowed';
      }
      if (form.attachment.size > 5 * 1024 * 1024) {
        newErrors.attachment = 'File size must be less than 5MB';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'attachment') {
      setForm({ ...form, attachment: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    const id = uuidv4();
    const requestPayload = {
      ...form,
      id,
      requestedBy: 'CurrentUserID',
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };

    const existingRequests = JSON.parse(localStorage.getItem('materialRequests') || '[]');
    const updatedRequests = [requestPayload, ...existingRequests];
    localStorage.setItem('materialRequests', JSON.stringify(updatedRequests));

    setTimeout(() => {
      setSubmitted(true);
      setForm(initialFormState);
      setSubmitting(false);
    }, 1000);
  };

  const handleClear = () => {
    setForm(initialFormState);
    setErrors({});
  };

  if (submitted) {
    return (
      <div className="p-4 md:p-8 max-w-2xl mx-auto bg-white rounded shadow">
        <h2 className="text-xl font-semibold text-green-700 mb-4">Request Submitted Successfully!</h2>
        <p className="text-gray-700">You can view all your submitted requests on the Requests Page.</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto bg-white rounded shadow">
      <h2 className="text-xl font-bold text-green-800 mb-6">Material Request Form</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Material Name *</label>
          <input
            type="text"
            name="materialName"
            className="w-full border border-gray-300 rounded p-2"
            value={form.materialName}
            onChange={handleChange}
          />
          {errors.materialName && <p className="text-red-600 text-sm mt-1">{errors.materialName}</p>}
        </div>

        <div>
          <label className="block font-medium">Category *</label>
          <select
            name="category"
            className="w-full border border-gray-300 rounded p-2"
            value={form.category}
            onChange={handleChange}
          >
            <option value="">Select Category</option>
            <option value="HK">HK</option>
            <option value="Civil">Civil</option>
            <option value="Electrical">Electrical</option>
          </select>
          {errors.category && <p className="text-red-600 text-sm mt-1">{errors.category}</p>}
        </div>

        <div>
          <label className="block font-medium">Quantity *</label>
          <input
            type="number"
            name="quantity"
            className="w-full border border-gray-300 rounded p-2"
            value={form.quantity}
            onChange={handleChange}
          />
          {errors.quantity && <p className="text-red-600 text-sm mt-1">{errors.quantity}</p>}
        </div>

        <div>
          <label className="block font-medium">Unit of Measurement *</label>
          <select
            name="uom"
            className="w-full border border-gray-300 rounded p-2"
            value={form.uom}
            onChange={handleChange}
          >
            <option value="">Select UOM</option>
            <option value="kg">Kg</option>
            <option value="ltr">Litre</option>
            <option value="pcs">Pieces</option>
          </select>
          {errors.uom && <p className="text-red-600 text-sm mt-1">{errors.uom}</p>}
        </div>

        <div>
          <label className="block font-medium">Site *</label>
          <select
            name="site"
            className="w-full border border-gray-300 rounded p-2"
            value={form.site}
            onChange={handleChange}
          >
            <option value="">Select Site</option>
            <option value="Site A">Site A</option>
            <option value="Site B">Site B</option>
          </select>
          {errors.site && <p className="text-red-600 text-sm mt-1">{errors.site}</p>}
        </div>

        <div>
          <label className="block font-medium">Location *</label>
          <input
            type="text"
            name="location"
            className="w-full border border-gray-300 rounded p-2"
            value={form.location}
            onChange={handleChange}
          />
          {errors.location && <p className="text-red-600 text-sm mt-1">{errors.location}</p>}
        </div>

        <div>
          <label className="block font-medium">Priority *</label>
          <select
            name="priority"
            className="w-full border border-gray-300 rounded p-2"
            value={form.priority}
            onChange={handleChange}
          >
            <option value="">Select Priority</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          {errors.priority && <p className="text-red-600 text-sm mt-1">{errors.priority}</p>}
        </div>

        <div>
          <label className="block font-medium">Expected Delivery Date *</label>
          <input
            type="date"
            name="expectedDelivery"
            className="w-full border border-gray-300 rounded p-2"
            value={form.expectedDelivery}
            onChange={handleChange}
          />
          {errors.expectedDelivery && <p className="text-red-600 text-sm mt-1">{errors.expectedDelivery}</p>}
        </div>

        <div>
          <label className="block font-medium">Remarks</label>
          <textarea
            name="remarks"
            className="w-full border border-gray-300 rounded p-2"
            value={form.remarks}
            onChange={handleChange}
          ></textarea>
        </div>

        <div>
          <label className="block font-medium">Attachment (PDF/Image, max 5MB)</label>
          <input
            type="file"
            name="attachment"
            accept=".pdf, .jpg, .jpeg, .png"
            className="w-full"
            onChange={handleChange}
          />
          {errors.attachment && <p className="text-red-600 text-sm mt-1">{errors.attachment}</p>}
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="bg-white border border-green-600 text-green-600 hover:bg-green-50 font-semibold px-4 py-2 rounded"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
};

export default MaterialRequestForm;

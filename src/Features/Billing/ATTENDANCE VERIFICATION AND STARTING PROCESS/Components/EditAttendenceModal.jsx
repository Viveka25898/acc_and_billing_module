// File: components/EditAttendanceModal.jsx
import React, { useState } from "react";

export default function EditAttendanceModal({ data, onClose, onSave }) {
  const [form, setForm] = useState(data);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h3 className="text-xl font-bold mb-4">Edit Attendance</h3>
        <div className="space-y-3">
          <input name="presentDays" value={form.presentDays} onChange={handleChange} type="number" placeholder="Present Days" className="border p-2 w-full" />
          <input name="weekOffs" value={form.weekOffs} onChange={handleChange} type="number" placeholder="Week Offs" className="border p-2 w-full" />
          <input name="holidays" value={form.holidays} onChange={handleChange} type="number" placeholder="Holidays" className="border p-2 w-full" />
          <input name="issues" value={form.issues} onChange={handleChange} placeholder="Issues (if any)" className="border p-2 w-full" />
        </div>
        <div className="mt-4 flex justify-end space-x-3">
          <button className="px-4 py-2 bg-gray-200 rounded" onClick={onClose}>Cancel</button>
          <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={() => onSave(form.id, form)}>Save</button>
        </div>
      </div>
    </div>
  );
}

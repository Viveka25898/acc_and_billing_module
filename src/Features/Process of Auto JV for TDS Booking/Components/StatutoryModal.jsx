import { useState } from "react";

export default function StatutoryModal({ onClose, onSave, editData = null }) {
  const [form, setForm] = useState(
    editData || {
      section: "",
      description: "",
      rate: "",
      applicableFrom: "",
      remarks: "",
    }
  );
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    try {
      if (!form.section || !form.description || !form.rate || !form.applicableFrom) {
        setError("Please fill all mandatory fields.");
        return;
      }
      onSave({ ...form, id: editData?.id ?? Date.now() });
      onClose();
    } catch {
      setError("Something went wrong.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-xl">
        <h2 className="text-lg font-bold mb-4">
          {editData ? "Edit Statutory Detail" : "Add Statutory Detail"}
        </h2>
        <div className="grid grid-cols-1 gap-3">
          <input name="section" value={form.section} onChange={handleChange} placeholder="Section" className="border p-2 rounded" />
          <input name="description" value={form.description} onChange={handleChange} placeholder="Description" className="border p-2 rounded" />
          <input name="rate" value={form.rate} onChange={handleChange} placeholder="Rate (%)" className="border p-2 rounded" />
          <input name="applicableFrom" value={form.applicableFrom} onChange={handleChange} type="date" className="border p-2 rounded" />
          <input name="remarks" value={form.remarks} onChange={handleChange} placeholder="Remarks" className="border p-2 rounded" />
          {error && <p className="text-red-500">{error}</p>}
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
          <button onClick={handleSubmit} className="bg-green-600 text-white px-4 py-2 rounded">
            {editData ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

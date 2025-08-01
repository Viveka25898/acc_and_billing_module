import { useState } from "react";

export default function StatutoryModal({ onClose, onSave, editData = null }) {
  const [form, setForm] = useState(
    editData || {
      section: "",
      description: "",
      rate: "",
      applicableFrom: "",
      remarks: "",
      type: "",
    }
  );
  const [error, setError] = useState("");

  // Dummy rate data
  const sectionRateMap = {
    "194C": "1.00",
    "194J": "10.00",
    "194H": "5.00",
    "194I": "2.00",
    "194A": "7.50",
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Auto-fill rate based on section selection
    if (name === "section") {
      setForm((prevForm) => ({
        ...prevForm,
        [name]: value,
        rate: sectionRateMap[value] || "",
      }));
    } else {
      setForm({ ...form, [name]: value });
    }
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <label className="font-semibold">Type:</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="type"
                  value="Corporate"
                  checked={form.type === "Corporate"}
                  onChange={handleChange}
                />
                Corporate
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="type"
                  value="Non-Corporate"
                  checked={form.type === "Non-Corporate"}
                  onChange={handleChange}
                />
                Non-Corporate
              </label>
            </div>
          </div>

          <select
            name="section"
            value={form.section}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="">-- Select Section --</option>
            <option value="194C">Section 194C - Contractor</option>
            <option value="194J">Section 194J - Professional Fees</option>
            <option value="194H">Section 194H - Commission</option>
            <option value="194I">Section 194I - Rent</option>
            <option value="194A">Section 194A - Interest</option>
          </select>

          <input
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="border p-2 rounded"
          />
          <input
            name="rate"
            value={form.rate}
            onChange={handleChange}
            placeholder="Rate (%)"
            className="border p-2 rounded"
          />
          <input
            name="applicableFrom"
            value={form.applicableFrom}
            onChange={handleChange}
            type="date"
            className="border p-2 rounded"
          />
          <input
            name="remarks"
            value={form.remarks}
            onChange={handleChange}
            placeholder="Remarks"
            className="border p-2 rounded"
          />
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

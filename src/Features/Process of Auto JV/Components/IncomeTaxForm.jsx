import { useState } from "react";

export default function IncomeTaxForm() {
  const [section, setSection] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!section) newErrors.section = "Section is required.";
    if (!description) newErrors.description = "Description is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    alert(`Added Section ${section} - ${description}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-green-800">Section</label>
        <input
          type="text"
          value={section}
          onChange={(e) => setSection(e.target.value)}
          className="w-full border border-green-600 p-2 rounded text-green-900"
        />
        {errors.section && <p className="text-red-600 text-sm mt-1">{errors.section}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-green-800">Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-green-600 p-2 rounded text-green-900"
        />
        {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
      </div>
      <button type="submit" className="bg-green-700 text-white px-4 py-2 rounded">
        Add Detail
      </button>
    </form>
  );
}

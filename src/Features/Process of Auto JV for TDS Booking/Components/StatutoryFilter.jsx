import { useState } from "react";

export default function StatutoryFilter({ onFilter }) {
  const [section, setSection] = useState("");
  const [description, setDescription] = useState("");

  const handleFilter = () => {
    onFilter({ section, description });
  };

  return (
    <div className="flex flex-wrap gap-4 mb-4">
      <input
        type="text"
        value={section}
        onChange={(e) => setSection(e.target.value)}
        placeholder="Filter by Section"
        className="border border-green-300 p-2 rounded w-52"
      />
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Filter by Description"
        className="border border-green-300 p-2 rounded w-72"
      />
      <button
        onClick={handleFilter}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Filter
      </button>
    </div>
  );
}

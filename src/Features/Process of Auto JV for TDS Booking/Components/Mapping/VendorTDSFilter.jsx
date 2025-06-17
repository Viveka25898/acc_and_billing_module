import { useState } from "react";

export default function VendorTDSFilter({ onFilter }) {
  const [state, setState] = useState("");
  const [name, setName] = useState("");
  const [vendorCode, setVendorCode] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter({ state, name, vendorCode });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-green-50 p-4 rounded"
    >
      <input
        type="text"
        placeholder="State"
        value={state}
        onChange={(e) => setState(e.target.value)}
        className="p-2 border border-green-300 rounded"
      />
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="p-2 border border-green-300 rounded"
      />
      <input
        type="text"
        placeholder="Vendor Code"
        value={vendorCode}
        onChange={(e) => setVendorCode(e.target.value)}
        className="p-2 border border-green-300 rounded"
      />
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
        Filter
      </button>
    </form>
  );
}
import { useState } from "react";

export default function VendorTDSMappingForm() {
  const [vendor, setVendor] = useState("");
  const [tdsRate, setTdsRate] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!vendor) newErrors.vendor = "Vendor name is required.";
    if (!tdsRate) newErrors.tdsRate = "TDS rate is required.";
    else if (tdsRate < 1 || tdsRate > 30) newErrors.tdsRate = "TDS rate must be between 1% and 30%.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    alert(`Mapped ${vendor} with TDS Rate ${tdsRate}%`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-green-800">Vendor Name</label>
        <input
          type="text"
          value={vendor}
          onChange={(e) => setVendor(e.target.value)}
          className="w-full border border-green-600 p-2 rounded text-green-900"
        />
        {errors.vendor && <p className="text-red-600 text-sm mt-1">{errors.vendor}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-green-800">TDS Rate (%)</label>
        <input
          type="number"
          value={tdsRate}
          onChange={(e) => setTdsRate(e.target.value)}
          className="w-full border border-green-600 p-2 rounded text-green-900"
        />
        {errors.tdsRate && <p className="text-red-600 text-sm mt-1">{errors.tdsRate}</p>}
      </div>
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
        Map TDS
      </button>
    </form>
  );
}
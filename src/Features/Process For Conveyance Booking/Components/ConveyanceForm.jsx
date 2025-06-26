/* eslint-disable no-unused-vars */
// File: src/features/conveyance/components/ConveyanceForm.jsx

import React, { useRef } from "react";

import { toast } from "react-toastify";

export default function ConveyanceForm({ entries, setEntries, errors, onSubmit }) {
  const handleChange = (index, field, value) => {
    const updated = [...entries];
    updated[index][field] = value;
    setEntries(updated);
  };

  //Ref For Claering File Field
  const reportRefs = useRef([]);
  const receiptRefs = useRef([]);



  // ✅ Date check - only allow submission if visit is within 7 days after month end
  const isWithinClaimWindow = (visitDate) => {
  if (!visitDate) return false;

  const visit = new Date(visitDate);
  visit.setHours(0, 0, 0, 0);

  const nextMonthStart = new Date(visit.getFullYear(), visit.getMonth() + 1, 1);
  const nextMonthEnd = new Date(visit.getFullYear(), visit.getMonth() + 1, 7);

  nextMonthStart.setHours(0, 0, 0, 0);
  nextMonthEnd.setHours(0, 0, 0, 0);


  //For Testing
  // const today = new Date("2025-07-02");
    const today = new Date();
  today.setHours(0, 0, 0, 0);

  return today >= nextMonthStart && today <= nextMonthEnd;
};


  const shouldShowReceipt = (transport) => {
    return ["Cab", "Bus", "Auto", "Train"].includes(transport);
  };

  const resetForm = () => {
  setEntries([
    {
      date: "",
      purpose: "",
      client: "",
      transport: "",
      distance: "",
      amount: "",
      report: null,
      receipt: null,
      remarks: "",
    },
  ]);

  // Clear file inputs manually
  reportRefs.current.forEach((ref) => ref && (ref.value = ""));
  receiptRefs.current.forEach((ref) => ref && (ref.value = ""));
};


  const handleSubmit = (e) => {
    e.preventDefault();

    for (const entry of entries) {
      if (!isWithinClaimWindow(entry.date)) {
        toast.error(`Date ${entry.date} is outside the allowed claim window.`);
        return;
      }
    }

    onSubmit();
    resetForm();
  };

  return (
    <form onSubmit={handleSubmit}>
      {entries.map((entry, idx) => (
        <div key={idx} className="border rounded-lg p-4 mb-4 space-y-2 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-medium">Date of Visit</label>
              <input
                type="date"
                value={entry.date}
                onChange={(e) => handleChange(idx, "date", e.target.value)}
                className="w-full border px-2 py-1 rounded"
              />
              {errors[idx]?.date && <p className="text-red-600 text-sm">{errors[idx].date}</p>}
            </div>
            <div>
              <label className="font-medium">Purpose of Visit</label>
              <input
                type="text"
                value={entry.purpose}
                onChange={(e) => handleChange(idx, "purpose", e.target.value)}
                className="w-full border px-2 py-1 rounded"
              />
              {errors[idx]?.purpose && <p className="text-red-600 text-sm">{errors[idx].purpose}</p>}
            </div>
            <div>
              <label className="font-medium">Client Name / Site</label>
              <input
                type="text"
                value={entry.client}
                onChange={(e) => handleChange(idx, "client", e.target.value)}
                className="w-full border px-2 py-1 rounded"
              />
              {errors[idx]?.client && <p className="text-red-600 text-sm">{errors[idx].client}</p>}
            </div>
            <div>
              <label className="font-medium">Mode of Transport</label>
              <select
                value={entry.transport}
                onChange={(e) => handleChange(idx, "transport", e.target.value)}
                className="w-full border px-2 py-1 rounded"
              >
                <option value="">Select</option>
                <option>Bike</option>
                <option>Cab</option>
                <option>Auto</option>
                <option>Bus</option>
                <option>Train</option>
              </select>
              {errors[idx]?.transport && <p className="text-red-600 text-sm">{errors[idx].transport}</p>}
            </div>
            <div>
              <label className="font-medium">Distance (km)</label>
              <input
                type="number"
                value={entry.distance}
                onChange={(e) => handleChange(idx, "distance", e.target.value)}
                className="w-full border px-2 py-1 rounded"
              />
              {errors[idx]?.distance && <p className="text-red-600 text-sm">{errors[idx].distance}</p>}
            </div>
            <div>
              <label className="font-medium">Amount Claimed (₹)</label>
              <input
                type="number"
                value={entry.amount}
                onChange={(e) => handleChange(idx, "amount", e.target.value)}
                className="w-full border px-2 py-1 rounded"
              />
              {errors[idx]?.amount && <p className="text-red-600 text-sm">{errors[idx].amount}</p>}
            </div>
            <div>
              <label className="font-medium">Upload Visit Report</label>
             <input
              type="file"
              accept="application/pdf,image/jpeg,image/png"
              onChange={(e) => handleChange(idx, "report", e.target.files[0])}
              ref={(el) => (reportRefs.current[idx] = el)}
              className="w-full border rounded px-4 py-2"
            />

              {errors[idx]?.report && <p className="text-red-600 text-sm">{errors[idx].report}</p>}
            </div>
            {shouldShowReceipt(entry.transport) && (
              <div>
                <label className="font-medium">Upload Ticket/Receipt</label>
                <input
                  type="file"
                  accept="application/pdf,image/jpeg,image/png"
                  onChange={(e) => handleChange(idx, "receipt", e.target.files[0])}
                  ref={(el) => (receiptRefs.current[idx] = el)}
                  className="w-full border rounded px-4 py-2"
                />

              </div>
            )}
            <div>
              <label className="font-medium">Remarks (Optional)</label>
              <textarea
                value={entry.remarks}
                onChange={(e) => handleChange(idx, "remarks", e.target.value)}
                className="w-full border px-2 py-1 rounded"
              ></textarea>
            </div>
          </div>
        </div>
      ))}

      <div className="flex gap-4 justify-between">
        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 cursor-pointer"
        >
          Submit to Manager
        </button>
      </div>
    </form>
  );
}

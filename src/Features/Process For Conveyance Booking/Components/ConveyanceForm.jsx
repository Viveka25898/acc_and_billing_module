/* eslint-disable no-unused-vars */
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



  //  Date check - only allow submission if visit is within 7 days after month end
  const isWithinClaimWindow = (visitDateStr) => {
  if (!visitDateStr) return false;

  const visitDate = new Date(visitDateStr);
  const today = new Date();

  // Normalize both to midnight
  visitDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const todayDay = today.getDate();
  const todayMonth = today.getMonth();
  const todayYear = today.getFullYear();

  // Claim window: 1st to 7th of current month
  const inClaimWeek = todayDay >= 1 && todayDay <= 7;

  // Visit must have occurred in **previous month or earlier**
  const visitMonth = visitDate.getMonth();
  const visitYear = visitDate.getFullYear();

  const visitBeforeCurrentMonth =
    visitYear < todayYear ||
    (visitYear === todayYear && visitMonth < todayMonth);

  return inClaimWeek && visitBeforeCurrentMonth;
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
      reports: [null],  
      receipt: null,
      remarks: "",
    },
  ]);

  // Clear file inputs manually
  reportRefs.current.forEach(group =>
  group?.forEach(ref => {
    if (ref) ref.value = "";
  })
);

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
              <label className="font-medium">Upload Visit Report(s)</label>
              {entry.reports.map((file, reportIdx) => (
                <div key={reportIdx} className="flex items-center gap-2 mb-2">
                  <input
                    type="file"
                    accept="application/pdf,image/jpeg,image/png"
                    onChange={(e) => {
                      const updatedReports = [...entry.reports];
                      updatedReports[reportIdx] = e.target.files[0];
                      handleChange(idx, "reports", updatedReports);
                    }}
                    ref={(el) => {
                      if (!reportRefs.current[idx]) reportRefs.current[idx] = [];
                      reportRefs.current[idx][reportIdx] = el;
                    }}
                    className="w-full border rounded px-4 py-2"
                  />
                  {entry.reports.length > 1 && (
                    <button
                      type="button"
                      className="text-red-600 font-bold"
                      onClick={() => {
                        const updatedReports = entry.reports.filter((_, i) => i !== reportIdx);
                        handleChange(idx, "reports", updatedReports);
                        // Also clear the file input manually
                        if (reportRefs.current[idx]?.[reportIdx]) {
                          reportRefs.current[idx][reportIdx].value = "";
                        }
                      }}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}

             {entry.reports.length < 5 ? (
                <button
                  type="button"
                  onClick={() => {
                    const updatedReports = [...entry.reports, null];
                    handleChange(idx, "reports", updatedReports);
                  }}
                  className="text-blue-600 text-sm underline"
                >
                  + Add another file
                </button>
              ) : (
                <p className="text-gray-500 text-sm">Maximum 5 files allowed.</p>
              )}


              {errors[idx]?.report && (
                <p className="text-red-600 text-sm mt-1">{errors[idx].report}</p>
              )}
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

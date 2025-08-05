/* eslint-disable no-unused-vars */
import React, { useRef } from "react";
import { toast } from "react-toastify";

export default function ConveyanceForm({ entries, setEntries, errors, onSubmit, resetForm }) {
  const reportRefs = useRef([]);
  const receiptRefs = useRef([]);

  const handleChange = (index, field, value) => {
    const updated = [...entries];
    updated[index][field] = value;
    
    if (field === "transport" && shouldShowReceipt(value) && !updated[index].receipts) {
      updated[index].receipts = [null];
    }
    
    if (field === "client" && value !== "Other") {
      updated[index].customClient = "";
    }
    
    setEntries(updated);
  };

  const isWithinClaimWindow = (visitDateStr) => {
    if (!visitDateStr) return false;
    const visitDate = new Date(visitDateStr);
    const today = new Date();
    visitDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    const todayDay = today.getDate();
    const todayMonth = today.getMonth();
    const todayYear = today.getFullYear();
    const inClaimWeek = todayDay >= 1 && todayDay <= 7;
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

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    // Validate claim window first
    for (const entry of entries) {
      if (!isWithinClaimWindow(entry.date)) {
        toast.error(`Date ${entry.date} is outside the allowed claim window (1st-7th of month)`);
        return;
      }
    }
    
    // Validate designation limit
    const user = JSON.parse(localStorage.getItem("user")) || {};
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userData = users.find(u => u.username === user.username);
    
    if (userData?.designation) {
      const designationLimits = {
        'Junior': 5000,
        'Senior': 10000,
        'Manager': 15000
      };
      
      const totalAmount = entries.reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
      const limit = designationLimits[userData.designation] || 5000;
      
      if (totalAmount > limit) {
        toast.error(`Total amount (₹${totalAmount}) exceeds your designation limit (₹${limit})`);
        return;
      }
    }
    
    // Submit the form
    const submissionSuccess = await onSubmit();
    
    // Reset form only if submission was successful
    if (submissionSuccess) {
      setEntries([{
      date: "",
      purpose: "",
      client: "",
      transport: "",
      distance: "",
      amount: "",
      reports: [null],
      receipts: [null],
      remarks: ""
    }]);

    // Clear file inputs
    reportRefs.current.forEach(group => {
      group?.forEach(ref => ref && (ref.value = ""));
    });
    receiptRefs.current.forEach(group => {
      group?.forEach(ref => ref && (ref.value = ""));
    });
    }
  };

  return (
    <form onSubmit={handleFormSubmit}>
      {entries.map((entry, idx) => (
        <div key={idx} className="border rounded-lg p-4 mb-4 space-y-2 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date Field */}
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

            {/* Purpose Field */}
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

            {/* Client Field */}
            <div>
              <label className="font-medium">Client Name / Site</label>
              <select
                value={entry.client}
                onChange={(e) => handleChange(idx, "client", e.target.value)}
                className="w-full border px-2 py-1 rounded"
              >
                <option value="">Select Site</option>
                <option value="Site A">Site A</option>
                <option value="Site B">Site B</option>
                <option value="Site C">Site C</option>
                <option value="Site D">Site D</option>
                <option value="Site E">Site E</option>
                <option value="Other">Other</option>
              </select>
              {errors[idx]?.client && <p className="text-red-600 text-sm">{errors[idx].client}</p>}
              
              {entry.client === "Other" && (
                <div className="mt-2">
                  <input
                    type="text"
                    placeholder="Enter custom client/site name"
                    value={entry.customClient || ""}
                    onChange={(e) => handleChange(idx, "customClient", e.target.value)}
                    className="w-full border px-2 py-1 rounded"
                  />
                  {errors[idx]?.customClient && <p className="text-red-600 text-sm">{errors[idx].customClient}</p>}
                </div>
              )}
            </div>

            {/* Transport Field */}
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

            {/* Distance Field */}
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

            {/* Amount Field */}
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

            {/* Reports Field */}
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

            {/* Receipts Field (conditionally shown) */}
            {shouldShowReceipt(entry.transport) && (
              <div>
                <label className="font-medium">Upload Ticket/Receipt(s)</label>
                {(entry.receipts || [null]).map((file, receiptIdx) => (
                  <div key={receiptIdx} className="flex items-center gap-2 mb-2">
                    <input
                      type="file"
                      accept="application/pdf,image/jpeg,image/png"
                      onChange={(e) => {
                        const updatedReceipts = [...(entry.receipts || [null])];
                        updatedReceipts[receiptIdx] = e.target.files[0];
                        handleChange(idx, "receipts", updatedReceipts);
                      }}
                      ref={(el) => {
                        if (!receiptRefs.current[idx]) receiptRefs.current[idx] = [];
                        receiptRefs.current[idx][receiptIdx] = el;
                      }}
                      className="w-full border rounded px-4 py-2"
                    />
                    {(entry.receipts || [null]).length > 1 && (
                      <button
                        type="button"
                        className="text-red-600 font-bold"
                        onClick={() => {
                          const updatedReceipts = (entry.receipts || [null]).filter((_, i) => i !== receiptIdx);
                          handleChange(idx, "receipts", updatedReceipts);
                          if (receiptRefs.current[idx]?.[receiptIdx]) {
                            receiptRefs.current[idx][receiptIdx].value = "";
                          }
                        }}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}

                {(entry.receipts || [null]).length < 5 ? (
                  <button
                    type="button"
                    onClick={() => {
                      const updatedReceipts = [...(entry.receipts || [null]), null];
                      handleChange(idx, "receipts", updatedReceipts);
                    }}
                    className="text-blue-600 text-sm underline"
                  >
                    + Add another receipt
                  </button>
                ) : (
                  <p className="text-gray-500 text-sm">Maximum 5 receipts allowed.</p>
                )}

                {errors[idx]?.receipts && (
                  <p className="text-red-600 text-sm mt-1">{errors[idx].receipts}</p>
                )}
              </div>
            )}

            {/* Remarks Field */}
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
/* eslint-disable no-unused-vars */
import React from "react";

export default function ActionButtons({ comment, setStatus, attendanceData, status }) {
  const handleAction = (type) => {
    setStatus(type);
    alert(`Status set to: ${type}\nComment: ${comment}`);
    // Later: Update backend or localStorage
  };

  const handleDownload = () => {
    // Later: Add download logic
    alert("PDF/Excel downloaded (simulated)");
  };

  return (
    <div className="flex flex-wrap gap-4 mt-6">
      <button onClick={() => handleAction("Sent Back")} className="bg-yellow-500 text-white px-4 py-2 rounded">🔁 Send Back to Ops</button>
      <button onClick={() => handleAction("Rejected")} className="bg-red-600 text-white px-4 py-2 rounded">❌ Reject</button>
      <button onClick={() => handleAction("Confirmed")} className="bg-blue-600 text-white px-4 py-2 rounded">✅ Confirm</button>
      <button onClick={handleDownload} className="bg-gray-700 text-white px-4 py-2 rounded">📁 Download PDF</button>
      <button onClick={() => handleAction("Punched")} className="bg-green-600 text-white px-4 py-2 rounded">✅ Final Punch Attendance</button>
    </div>
  );
}

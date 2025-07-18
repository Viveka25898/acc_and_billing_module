import React from "react";

const months = ["May 2025", "June 2025", "July 2025", "August 2025"];

export default function MonthSelector({ selected, onChange }) {
  return (
    <div className="flex justify-end">
      <select
        className="border px-4 py-2 rounded shadow-sm"
        value={selected}
        onChange={(e) => onChange(e.target.value)}
      >
        {months.map((month) => (
          <option key={month} value={month}>{month}</option>
        ))}
      </select>
    </div>
  );
}
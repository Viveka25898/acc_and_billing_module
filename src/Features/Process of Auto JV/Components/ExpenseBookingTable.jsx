import { useState } from "react";
import AutoJVResultModal from "./AutoJVResultModal";

export default function ExpenseBookingTable() {
  const [showModal, setShowModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);

  const dummyData = [
    { id: 1, vendor: "ABC Pvt Ltd", amount: 10000, tdsRate: 10 },
    { id: 2, vendor: "XYZ Ltd", amount: 20000, tdsRate: 5 },
  ];

  const handlePreview = (entry) => {
    setSelectedEntry(entry);
    setShowModal(true);
  };

  return (
    <div>
      <table className="w-full border border-green-600">
        <thead>
          <tr className="bg-green-100">
            <th className="border p-2">Vendor</th>
            <th className="border p-2">Amount</th>
            <th className="border p-2">TDS Rate (%)</th>
            <th className="border p-2">TDS Amount</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {dummyData.map((entry) => (
            <tr key={entry.id}>
              <td className="border p-2">{entry.vendor}</td>
              <td className="border p-2">₹{entry.amount}</td>
              <td className="border p-2">{entry.tdsRate}%</td>
              <td className="border p-2">₹{(entry.amount * entry.tdsRate) / 100}</td>
              <td className="border p-2">
                <button
                  onClick={() => handlePreview(entry)}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Preview JV
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && selectedEntry && (
        <AutoJVResultModal
          data={selectedEntry}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
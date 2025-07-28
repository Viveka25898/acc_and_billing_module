import { useState } from "react";
import { statutoryData } from "../data/statutoryDummyData";
import StatutoryFilter from "../Components/StatutoryFilter";
import StatutoryModal from "../Components/StatutoryModal"
import { toast } from "react-toastify";

export default function StatutorySetup() {
  const [data, setData] = useState(statutoryData);
  const [filteredData, setFilteredData] = useState(statutoryData);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const handleFilter = ({ section, description }) => {
    try {
      const result = data.filter(
        (item) =>
          (!section || item.section.includes(section)) &&
          (!description || item.description.toLowerCase().includes(description.toLowerCase()))
      );
      setFilteredData(result);
    } catch {
      toast.error("Error filtering statutory data.");
    }
  };

  const handleSave = (newItem) => {
    try {
      let updated;
      if (editData) {
        // Edit existing
        updated = data.map((item) => (item.id === newItem.id ? newItem : item));
        toast.success("Statutory detail updated.");
      } else {
        // Add new
        updated = [...data, newItem];
        toast.success("Statutory detail added.");
      }
      setData(updated);
      setFilteredData(updated);
      setEditData(null);
    } catch {
      toast.error("Save operation failed.");
    }
  };

  const handleEdit = (item) => {
    setEditData(item);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    try {
      if (confirm("Are you sure you want to delete this entry?")) {
        const updated = data.filter((item) => item.id !== id);
        setData(updated);
        setFilteredData(updated);
        toast.success("Statutory detail deleted.");
      }
    } catch {
      toast.error("Failed to delete.");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white">
      <h1 className="text-2xl font-bold mb-4 text-green-700">Income Tax Statutory Setup</h1>
      <StatutoryFilter onFilter={handleFilter} />
      <button
        onClick={() => {
          setEditData(null);
          setShowModal(true);
        }}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mb-4"
      >
        + Add Statutory
      </button>

      <div className="overflow-x-auto">
        <table className="w-full border border-green-200">
          <thead>
            <tr className="bg-green-100 text-left">
              <th className="p-2 border">Section</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Rate</th>
              <th className="p-2 border">Applicable From</th>
              <th className="p-2 border">Remarks</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="p-2 border">{item.section}</td>
                <td className="p-2 border">{item.description}</td>
                <td className="p-2 border">{item.rate}</td>
                <td className="p-2 border">{item.applicableFrom}</td>
                <td className="p-2 border">{item.remarks}</td>
                <td className="p-2 border space-x-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="bg-yellow-400 px-2 py-1 rounded text-white hover:bg-yellow-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-500 px-2 py-1 rounded text-white hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <StatutoryModal
          onClose={() => {
            setShowModal(false);
            setEditData(null);
          }}
          onSave={handleSave}
          editData={editData}
        />
      )}
    </div>
  );
}

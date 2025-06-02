import { useState } from "react";
import { useNavigate } from "react-router-dom";


const mockDCs = [
  {
    id: 1,
    poNumber: "PO123456",
    dcDate: "2024-05-20",
    fromLocation: "Warehouse A",
    toLocation: "Site B",
    remarks: "Urgent Delivery",
    status: "Submitted",
  },
  {
    id: 2,
    poNumber: "PO654321",
    dcDate: "2024-05-22",
    fromLocation: "Warehouse X",
    toLocation: "Site Y",
    remarks: "Standard Delivery",
    status: "Pending",
  },
  {
    id: 3,
    poNumber: "PO654321",
    dcDate: "2024-05-22",
    fromLocation: "Warehouse X",
    toLocation: "Site Y",
    remarks: "Standard Delivery",
    status: "Pending",
  },
  {
    id: 4,
    poNumber: "PO654321",
    dcDate: "2024-05-22",
    fromLocation: "Warehouse X",
    toLocation: "Site Y",
    remarks: "Standard Delivery",
    status: "Pending",
  },
];

const VendorDCPage = () => {
  const [filter, setFilter] = useState({
    poNumber: "",
    dcDate: "",
    fromLocation: "",
    toLocation: "",
  });
  const navigate=useNavigate()

  const [selectedDC, setSelectedDC] = useState(null);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  const filteredDCs = mockDCs.filter((dc) => {
    return (
      dc.poNumber.toLowerCase().includes(filter.poNumber.toLowerCase()) &&
      dc.dcDate.includes(filter.dcDate) &&
      dc.fromLocation.toLowerCase().includes(filter.fromLocation.toLowerCase()) &&
      dc.toLocation.toLowerCase().includes(filter.toLocation.toLowerCase())
    );
  });



  return (
    <div className="p-6 max-w-7xl mx-auto bg-white shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-green-700">My Delivery Challans</h2>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <input
          name="poNumber"
          type="text"
          placeholder="Filter by PO Number"
          className="input border w-full border-gray-300 rounded px-4 py-2"
          value={filter.poNumber}
          onChange={handleFilterChange}
        />
        <input
          name="dcDate"
          type="date"
          className="input border w-full border-gray-300 rounded px-4 py-2"
          value={filter.dcDate}
          onChange={handleFilterChange}
        />
        <input
          name="fromLocation"
          type="text"
          placeholder="From Location"
          className="input border w-full border-gray-300 rounded px-4 py-2"
          value={filter.fromLocation}
          onChange={handleFilterChange}
        />
        <input
          name="toLocation"
          type="text"
          placeholder="To Location"
          className="input border w-full border-gray-300 rounded px-4 py-2"
          value={filter.toLocation}
          onChange={handleFilterChange}
        />
      </div>

      {/* Table */}
      <div id="dc-table" className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">PO Number</th>
              <th className="p-2 border">DC Date</th>
              <th className="p-2 border">From</th>
              <th className="p-2 border">To</th>
              <th className="p-2 border">Remarks</th>
              <th className="p-2 border">DC Upload Status</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDCs.length > 0 ? (
              filteredDCs.map((dc) => (
                <tr key={dc.id} className="text-center">
                  <td className="p-2 border">{dc.poNumber}</td>
                  <td className="p-2 border">{dc.dcDate}</td>
                  <td className="p-2 border">{dc.fromLocation}</td>
                  <td className="p-2 border">{dc.toLocation}</td>
                  <td className="p-2 border">{dc.remarks}</td>
                  <td className="p-2 border">
                    <span
                      className={`px-2 py-1 rounded text-white text-sm ${
                        dc.status === "Submitted"
                          ? "bg-green-500"
                          : dc.status === "Draft"
                          ? "bg-yellow-500"
                          : "bg-gray-400"
                      }`}
                    >
                      {dc.status}
                    </span>
                  </td>
                 <td className="p-2 border">
                  {
                    dc.status === "Submitted" ? (
                       <button
                      onClick={() => setSelectedDC(dc)}
                      className="text-blue-600 underline hover:text-blue-800"
                    >
                      View
                    </button>
                    )
                    : dc.status === "Pending" ?  (
                      <button
                      onClick={() => navigate("/dashboard/vendor/dc-upload") }
                      className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1 rounded"
                    >
                      Upload DC
                    </button>

                    ):(
                      <span className="text-gray-400 text-sm">No Action</span>
                    )
                  }
                 </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500">
                  No DCs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for View */}
      {selectedDC && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg p-6 rounded shadow-md relative">
            <h3 className="text-lg font-bold mb-4">DC Details</h3>
            <div className="space-y-2 text-sm">
              <p><strong>PO Number:</strong> {selectedDC.poNumber}</p>
              <p><strong>DC Date:</strong> {selectedDC.dcDate}</p>
              <p><strong>From:</strong> {selectedDC.fromLocation}</p>
              <p><strong>To:</strong> {selectedDC.toLocation}</p>
              <p><strong>Remarks:</strong> {selectedDC.remarks}</p>
              <p><strong>Status:</strong> {selectedDC.status}</p>
            </div>
            <button
              onClick={() => setSelectedDC(null)}
              className="absolute top-2 right-3 text-red-600 hover:text-red-800 text-xl"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorDCPage;

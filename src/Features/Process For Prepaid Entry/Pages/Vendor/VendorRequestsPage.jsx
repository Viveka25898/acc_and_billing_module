/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import FilterComponent from "../../Components/FilterComponent";
import PORequestTable from "../../Components/PORequestTable";
import { useNavigate } from "react-router-dom";

const dummyData = Array.from({ length: 37 }).map((_, index) => ({
  poNumber: `PO-${1000 + index}`,
  material: "Uniform Set",
  cost: 1200 + index * 10,
  quantity: 50 + index,
  requester: `Staff ${index + 1}`,
  site: `Site-${index % 5 + 1}`,
  deliveryLocation: `Warehouse ${index % 3 + 1}`,
  status:
    index % 3 === 0 ? "Pending" : index % 3 === 1 ? "Approved" : "Rejected",
}));

export default function VendorRequestsPage() {
  const [filterText, setFilterText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);

  const pageSize = 10;
  const navigate = useNavigate();

  const filteredData = dummyData.filter((item) => {
    const siteMatch = item.site.toLowerCase().includes(filterText.toLowerCase());
    const statusMatch = statusFilter ? item.status === statusFilter : true;
    return siteMatch && statusMatch;
  });

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleCheckboxChange = (row) => {
    setSelectedRows((prev) => {
      if (prev.find((r) => r.poNumber === row.poNumber)) {
        return prev.filter((r) => r.poNumber !== row.poNumber);
      } else {
        return [...prev, row];
      }
    });
  };
  const handleView = (row) => {
    navigate("/dashboard/vendor/po-preview");
  };

 const handleGenerateDC = (row) => {
  navigate("/dashboard/vendor/generate-dc-procurement", {
    state: { poDetails: [row] }  // Pass as array for consistency
  });
};


  

  const columns = [
       {
        label: "", // Checkbox column
        accessor: "checkbox",
        render: (row) => (
            <input
            type="checkbox"
            checked={selectedRows.includes(row)}
            onChange={() => handleCheckboxChange(row)}
            />
        ),
        },
    {
      label: "PO Number",
      accessor: "poNumber",
      render: (row) => (
        <div className="flex items-center gap-2">
          <span>{row.poNumber}</span>
          <button
            className="text-blue-600 hover:text-blue-800 cursor-pointer"
            onClick={() => handleView(row)}
          >
            <FaEye />
          </button>
        </div>
      ),
    },
    { label: "Material", accessor: "material" },
    { label: "Cost", accessor: "cost" },
    { label: "Quantity", accessor: "quantity" },
    { label: "Requester", accessor: "requester" },
    { label: "Site", accessor: "site" },
    { label: "Delivery Location", accessor: "deliveryLocation" },
    { label: "Status", accessor: "status" },
    {
      label: "Action",
      accessor: "action",
      render: (row) => (
        <button
          onClick={() => handleGenerateDC(row)}
          disabled={row.status === "Approved"}
          className={`text-xs px-3 py-1 rounded 
            ${row.status === "Approved" 
              ? "bg-gray-400 text-white cursor-not-allowed" 
              : "bg-green-600 text-white hover:bg-green-700 cursor-pointer"
            }`}
        >
          Generate DC
        </button>
      ),
    },
  ];

  return (
    <div className="p-4 bg-white rounded-md shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-green-600">
        Uniform / Material Requests
      </h1>

      <FilterComponent
        filterText={filterText}
        setFilterText={setFilterText}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      <PORequestTable columns={columns} data={paginatedData} />

      {/* Generate DC for multiple */}
     {selectedRows.length > 0 && (
        <div className="flex justify-end mb-3">
            <button
            onClick={() =>
                navigate("/dashboard/vendor/generate-dc-procurement", {
                state: { poDetails: selectedRows }
                })
            }
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
            Generate DC for {selectedRows.length} PO{selectedRows.length > 1 ? "s" : ""}
            </button>
        </div>
        )}


      <div className="flex justify-center mt-4 gap-2">
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          Previous
        </button>
        <span className="px-4 py-1 text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

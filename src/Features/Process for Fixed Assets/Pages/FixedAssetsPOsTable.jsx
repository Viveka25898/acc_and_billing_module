/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { FaEye } from "react-icons/fa";
import { fixedAssetPOs } from "../data/fixedAssetsPo"; // dummy data file
import { format } from "date-fns";
import FixedAssetPOsFilter from "../Components/FixedAssetPosFilter";
import { NavLink } from "react-router-dom";

const ITEMS_PER_PAGE = 5;

export default function FixedAssetPOsTable() {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
    assetName: "",
    poNumber: "",
    date: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPO, setSelectedPO] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        setTimeout(() => {
          setData(fixedAssetPOs);
          setLoading(false);
        }, 500);
      } catch (err) {
        setError("Failed to fetch Fixed Asset POs");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleViewDetails = (po) => {
    setSelectedPO(po);
  };

  const handleFilter = (filterValues) => {
    setFilters(filterValues);
    setCurrentPage(1); // Reset to first page on filter
  };

  const filteredPOs = data.filter((po) => {
  const assetMatch = (po.assetName || "").toLowerCase().includes(filters.assetName.toLowerCase());
  const poNumberMatch = (po.poNumber || "").toLowerCase().includes(filters.poNumber.toLowerCase());
  const dateMatch = filters.date ? po.date === filters.date : true;
  return assetMatch && poNumberMatch && dateMatch;
});


  const paginatedData = filteredPOs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredPOs.length / ITEMS_PER_PAGE);

  return (
    <div className="w-full px-2 md:px-6 py-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-green-600">Fixed Asset Purchase Orders</h2>

      <FixedAssetPOsFilter onFilter={handleFilter} />

      {loading ? (
        <p className="text-gray-500">Loading POs...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto rounded">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-700 border-b">
              <tr>
                <th className="px-4 py-2 text-left border">PO ID</th>
                <th className="px-4 py-2 text-left border">Asset Name</th>
                <th className="px-4 py-2 text-left border">PO</th>
                <th className="px-4 py-2 text-left border">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((po) => (
                <tr key={po.id} className="hover:bg-green-50 border-t">
                  <td className="px-4 py-2 border font-medium text-gray-900">{po.id}</td>
                  <td className="px-4 py-2 border">{po.assetName}</td>
                  <td className="px-4 py-2 border text-center">
                    <button
                      onClick={() => handleViewDetails(po)}
                      className="text-green-700 hover:text-green-900 cursor-pointer"
                      title="View PO"
                    >
                      <FaEye size={16} />
                    </button>
                  </td>
                  <td className="px-4 py-2 border">
                    {po.status === "invoice-uploaded" ? (
                      <span className="text-green-600 font-semibold">Uploaded</span>
                    ) : (
                      <button className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm cursor-pointer">
                        <NavLink to="/dashboard/vendor/dc-form">

                        Generate DC
                        </NavLink>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="flex justify-end mt-4 space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer bg-green-600 text-white"
            >
              Previous
            </button>
            <span className="px-3 py-1">Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer bg-green-600 text-white"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* PO Detail Modal */}
      {selectedPO && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-xl relative">
            <button
              onClick={() => setSelectedPO(null)}
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
            >
              ✖
            </button>
            <h3 className="text-lg font-bold mb-4">PO Details – {selectedPO.id}</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Asset Name:</strong> {selectedPO.assetName}</p>
              <p><strong>Vendor:</strong> {selectedPO.vendor}</p>
              <p><strong>PO Date:</strong> {format(new Date(selectedPO.date), "dd/MM/yyyy")}</p>
              <p><strong>Amount:</strong> ₹{selectedPO.amount.toLocaleString()}</p>
              <p><strong>Status:</strong> {selectedPO.status}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

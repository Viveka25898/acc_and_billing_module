/* eslint-disable no-unused-vars */
import { useState } from "react";
import VendorTDSModal from "../components/mapping/VendorTDSModal";
import {vendorData} from "../data/VendorDummyData"
import VendorTDSFilter from "../components/mapping/VendorTDSFilter";
import { toast } from "react-toastify";

const ITEMS_PER_PAGE = 5;

export default function TDSMapping() {
  const [filteredVendors, setFilteredVendors] = useState(vendorData);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const handleFilter = (filters) => {
    try {
      const filtered = vendorData.filter((vendor) => {
        return (
          (!filters.state || vendor.state === filters.state) &&
          (!filters.name || vendor.name.toLowerCase().includes(filters.name.toLowerCase())) &&
          (!filters.vendorCode || vendor.vendorCode === filters.vendorCode)
        );
      });
      setFilteredVendors(filtered);
      setCurrentPage(1);
    } catch (error) {
       toast.error("Error filtering vendors. Please try again.");
    }
  };

  const handleAction = (vendor) => {
    setSelectedVendor(vendor);
    setShowModal(true);
  };

  const totalPages = Math.ceil(filteredVendors.length / ITEMS_PER_PAGE);
  const paginatedVendors = filteredVendors.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="p-6 bg-white text-green-800 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Vendor TDS Mapping</h1>
      <VendorTDSFilter onFilter={handleFilter} />
      <div className="overflow-x-auto">
        <table className="w-full mt-4 border border-green-200">
          <thead>
            <tr className="bg-green-100 text-left">
              <th className="p-2 border">Vendor Code</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">State</th>
              <th className="p-2 border">TDS Rate</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedVendors.map((vendor) => (
              <tr key={vendor.id} className="border-t">
                <td className="p-2 border">{vendor.vendorCode}</td>
                <td className="p-2 border">{vendor.name}</td>
                <td className="p-2 border">{vendor.state}</td>
                <td className="p-2 border">{vendor.tdsRate ?? "Not Mapped"}</td>
                <td className="p-2 border">
                  <button
                    onClick={() => handleAction(vendor)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                  >
                    {vendor.tdsRate ? "View / Edit" : "Map TDS"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-green-700">Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {showModal && selectedVendor && (
        <VendorTDSModal
          vendor={selectedVendor}
          onClose={() => setShowModal(false)}
         updateVendor={(updated) => {
            setFilteredVendors((prev) =>
                prev.map((v) => (v.id === updated.id ? updated : v))
            );
            setShowModal(false);
            toast.success(
                `TDS ${selectedVendor.tdsRate ? "updated" : "mapped"} successfully for ${updated.name}`
            );
            }}
        />
      )}
    </div>
  );
}
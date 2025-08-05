/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import RentAgreementForm from "../Components/RentAgreementForm";
import MonthlyVoucherGenerator from "../Components/MonthlyVoucherGenerator"
import { toast } from "react-toastify";
import ViewVouchersModal from "../Components/ViewVouchersModal";


 const dummySites = [
  { id: 1, city: "Mumbai", state: "Maharashtra", siteName: "Site A", location: "Andheri", owner: "Mr. A", gst: true, agreementUrl: "https://example.com/agreement1.pdf" },
  { id: 2, city: "Mumbai", state: "Maharashtra", siteName: "Site B", location: "Borivali", owner: "Mrs. B", gst: false },
  { id: 3, city: "Delhi", state: "Delhi", siteName: "Site C", location: "Saket", owner: "Mr. C", gst: true },
  { id: 4, city: "Delhi", state: "Delhi", siteName: "Site D", location: "Dwarka", owner: "Mr. D", gst: true },
  { id: 5, city: "Pune", state: "Maharashtra", siteName: "Site E", location: "Baner", owner: "Mrs. E", gst: false },
  { id: 6, city: "Chennai", state: "Tamil Nadu", siteName: "Site F", location: "Velachery", owner: "Mr. F", gst: true },
];

export default function RentExpenseBookingPage() {
  const [selectedSite, setSelectedSite] = useState(null);
  const [agreements, setAgreements] = useState([
    { siteId: 1, startDate: "2024-01-01", endDate: "2025-01-01", withGST: true, fileUrl: "https://example.com/agreement1.pdf" }
  ]);
  const [vouchers, setVouchers] = useState([
                                            { siteId: 1, month: "2024-01", amount: 10000 },
                                            { siteId: 1, month: "2024-03", amount: 10000 },
                                            { siteId: 1, month: "2025-02", amount: 10000 }, 
                                            { siteId: 2, month: "2024-02", amount: 8000 },
                                            { siteId: 3, month: "2024-04", amount: 9500 },
                                            ]);
  const [filters, setFilters] = useState({ owner: "", city: "", state: "" });
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [voucherViewSite, setVoucherViewSite] = useState(null);
const [showViewVoucherModal, setShowViewVoucherModal] = useState(false);
const [showVoucherListModal, setShowVoucherListModal] = useState(false);


  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleAgreementSubmit = (agreementData) => {
  const newAgreement = { ...agreementData, siteId: selectedSite.id };
  setAgreements((prev) => [...prev, newAgreement]);
  console.log("Parent",agreements);

  // Clear modal + feedback
  setSelectedSite(null);
  setShowAgreementModal(false);
  toast.success("Rent agreement uploaded successfully");
};


   const handleVoucherSubmit = (voucherData) => {
    const newVoucher = { ...voucherData, siteId: selectedSite.id };
    setVouchers((prev) => [...prev, newVoucher]);

    // 👇 Open modal to view newly generated voucher
    setVoucherViewSite(selectedSite);
    setShowViewVoucherModal(true);

    setSelectedSite(null);
    setShowVoucherModal(false);
    toast.success("Voucher generated successfully");
  };

  const getAgreementForSite = (siteId) => agreements.find((a) => a.siteId === siteId);
  const getVouchersForSite = (siteId) => vouchers.filter((v) => v.siteId === siteId);

  const uniqueStates = [...new Set(dummySites.map((site) => site.state))];
  const uniqueCities = [...new Set(dummySites.map((site) => site.city))];

  const filteredSites = dummySites.filter((site) => {
    const { owner, city, state } = filters;
    return (
      (!owner || site.owner.toLowerCase().includes(owner.toLowerCase())) &&
      (!city || site.city === city) &&
      (!state || site.state === state)
    );
  });
  const totalPages = Math.ceil(filteredSites.length / itemsPerPage);
const paginatedSites = filteredSites.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
);


  return (
    <div className="min-h-screen bg-white shadow-md rounded-md px-4 py-6 md:px-6">
      <h1 className="text-2xl md:text-3xl font-bold text-center text-green-700 mb-6">
        Rent Expense Booking
      </h1>

      {/* Filter UI */}
      <div className=" p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Filter :-</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Owner Ledger Name"
            className="p-2 border rounded w-full"
            value={filters.owner}
            onChange={(e) => setFilters({ ...filters, owner: e.target.value })}
          />
          <select
            className="p-2 border rounded w-full"
            value={filters.state}
            onChange={(e) => setFilters({ ...filters, state: e.target.value })}
          >
            <option value="">Select State</option>
            {uniqueStates.map((state) => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
          <select
            className="p-2 border rounded w-full"
            value={filters.city}
            onChange={(e) => setFilters({ ...filters, city: e.target.value })}
          >
            <option value="">Select City</option>
            {uniqueCities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className=" p-4 mb-10 overflow-x-auto">
        <table className="min-w-full table-fixed border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1 w-10">#</th>
              <th className="border px-2 py-1 w-28">Site</th>
              <th className="border px-2 py-1 w-28">Location</th>
              <th className="border px-2 py-1 w-24">State</th>
              <th className="border px-2 py-1 w-24">City</th>
              <th className="border px-2 py-1 w-28">Owner</th>
              <th className="border px-2 py-1 w-14">GST</th>
              <th className="border px-2 py-1 w-20">Agreement</th>
              <th className="border px-2 py-1 w-32">Vouchers</th>
              <th className="border px-2 py-1 w-44">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedSites.map((site, index) => {
              const agreement = getAgreementForSite(site.id);
              return (
                <tr key={site.id} className="text-center">
                  <td className="border px-2 py-1">{index + 1}</td>
                  <td className="border px-2 py-1">{site.siteName}</td>
                  <td className="border px-2 py-1">{site.location}</td>
                  <td className="border px-2 py-1">{site.state}</td>
                  <td className="border px-2 py-1">{site.city}</td>
                  <td className="border px-2 py-1">{site.owner}</td>
                  <td className="border px-2 py-1">{site.gst ? "Yes" : "No"}</td>
                  <td className="border px-2 py-1">
                    {agreement ? (
                      <a
                        href={agreement.fileUrl || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline text-xs"
                      >
                        View
                      </a>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="border px-2 py-1">
                    {agreement ? (
                      <button
                        className="text-blue-600 underline text-xs"
                        onClick={() => {
                            setVoucherViewSite(site);
                            setShowViewVoucherModal(true);
                        }}
                        >
                        View Vouchers
                        </button>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="border px-2 py-1 space-x-2">
                    <button
                      onClick={() => {
                        setSelectedSite(site);
                        if (!agreement) setShowAgreementModal(true);
                        else setShowVoucherModal(true);
                      }}
                      className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                    >
                      {agreement ? "Generate Voucher" : "Upload Agreement"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
            {/* Pagination  */}
        {totalPages > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
            {[...Array(totalPages)].map((_, i) => (
            <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded border ${
                currentPage === i + 1 ? "bg-green-600 text-white" : "bg-white text-gray-800"
                }`}
            >
                {i + 1}
            </button>
            ))}
        </div>
        )}

      </div>

      {/* Modals */}
      {showAgreementModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-2">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md h-auto max-h-[90vh] overflow-y-auto p-4 sm:p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-red-600"
              onClick={() => setShowAgreementModal(false)}
            >
              ✕
            </button>
            <RentAgreementForm site={selectedSite} onSuccess={handleAgreementSubmit} />
          </div>
        </div>
      )}

      {showVoucherModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-2">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md h-auto max-h-[90vh] overflow-y-auto p-4 sm:p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-red-600"
              onClick={() => setShowVoucherModal(false)}
            >
              ✕
            </button>
           <MonthlyVoucherGenerator
            site={selectedSite}
            agreement={getAgreementForSite(selectedSite?.id)}
            onSuccess={handleVoucherSubmit}
          />

          </div>
        </div>
      )}

      {/* View Voucher List  */}

      {showViewVoucherModal && (
            <ViewVouchersModal
                site={voucherViewSite}
                agreement={getAgreementForSite(voucherViewSite?.id)}
                vouchers={getVouchersForSite(voucherViewSite?.id)}
                onClose={() => {
                setShowViewVoucherModal(false);
                setVoucherViewSite(null);
                }}
            />
            )}

    </div>
  );
}


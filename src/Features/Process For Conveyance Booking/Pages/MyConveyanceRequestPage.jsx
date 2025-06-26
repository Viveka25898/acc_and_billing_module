/* eslint-disable no-unused-vars */

import React, { useState } from "react";
import ConveyanceFilter from "../Components/ConveyanceFilter";
import ConveyanceTable from "../Components/ConveyanceTable";
import RejectReasonModal from "../Components/RejectionReasonModal";


const dummyRequests = [
  {
    id: 1,
    date: "2025-06-20",
    purpose: "Client meeting",
    client: "ABC Corp",
    transport: "Cab",
    distance: 12,
    amount: 240,
    status: "Approved",
  },
  {
    id: 2,
    date: "2025-06-18",
    purpose: "Follow-up",
    client: "XYZ Ltd",
    transport: "Bus",
    distance: 8,
    amount: 80,
    status: "Rejected",
    rejectionReason: "Missing visit report."
  },
  {
    id: 3,
    date: "2025-06-15",
    purpose: "Site audit",
    client: "LMN Infra",
    transport: "Bike",
    distance: 10,
    amount: 100,
    status: "Pending",
  },
  {
    id: 4,
    date: "2025-06-20",
    purpose: "Client meeting",
    client: "ABC Corp",
    transport: "Cab",
    distance: 12,
    amount: 240,
    status: "Approved",
  },
  {
    id: 5,
    date: "2025-06-18",
    purpose: "Follow-up",
    client: "XYZ Ltd",
    transport: "Bus",
    distance: 8,
    amount: 80,
    status: "Rejected",
    rejectionReason: "Missing visit report."
  },
  {
    id: 6,
    date: "2025-06-15",
    purpose: "Site audit",
    client: "LMN Infra",
    transport: "Bike",
    distance: 10,
    amount: 100,
    status: "Pending",
  },
  {
    id: 7,
    date: "2025-06-20",
    purpose: "Client meeting",
    client: "ABC Corp",
    transport: "Cab",
    distance: 12,
    amount: 240,
    status: "Approved",
  },
  {
    id: 8,
    date: "2025-06-18",
    purpose: "Follow-up",
    client: "XYZ Ltd",
    transport: "Bus",
    distance: 8,
    amount: 80,
    status: "Rejected",
    rejectionReason: "Missing visit report."
  },
  {
    id: 9,
    date: "2025-06-15",
    purpose: "Site audit",
    client: "LMN Infra",
    transport: "Bike",
    distance: 10,
    amount: 100,
    status: "Pending",
  },
];

export default function MyConveyanceRequestsPage() {
  const [requests, setRequests] = useState(dummyRequests);
  const [filter, setFilter] =useState({
  client: "",
  status: "",
  date: ""
});;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRejectReason, setSelectedRejectReason] = useState(null);

  const filteredRequests = requests.filter((r) => {
  return (
    (filter.client === "" || r.client.toLowerCase().includes(filter.client.toLowerCase())) &&
    (filter.status === "" || r.status === filter.status) &&
    (filter.date === "" || r.date === filter.date)
  );
});


  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const paginated = filteredRequests.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="p-4 max-w-7xl mx-auto bg-white rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-green-600">My Conveyance Requests</h2>

      <ConveyanceFilter filter={filter} setFilter={setFilter} />

      <ConveyanceTable
        requests={paginated}
        onEyeClick={(reason) => setSelectedRejectReason(reason)}
      />

      <div className="mt-4 flex justify-center gap-2">
        {[...Array(totalPages).keys()].map((i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 border rounded ${currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-white"}`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {selectedRejectReason && (
        <RejectReasonModal
          reason={selectedRejectReason}
          onClose={() => setSelectedRejectReason(null)}
        />
      )}
    </div>
  );
}

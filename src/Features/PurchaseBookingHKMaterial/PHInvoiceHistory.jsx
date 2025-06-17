import { useEffect, useState } from "react";

export default function PHInvoiceHistory() {
  const [invoices, setInvoices] = useState([]);
  const [filter, setFilter] = useState({
    phStatus: "",
    aeStatus: "",
    invoiceNumber: ""
  });

  useEffect(() => {
    const mockData = [
      {
        id: 1,
        invoiceNumber: "INV-001",
        vendorName: "ABC Ltd",
        uploadedDate: "2025-06-01",
        totalAmount: 120000,
        posCovered: ["PO-101", "PO-102"],
        phStatus: "Accepted",
        aeStatus: "Pending"
      },
      {
        id: 2,
        invoiceNumber: "INV-002",
        vendorName: "XYZ Enterprises",
        uploadedDate: "2025-06-02",
        totalAmount: 85000,
        posCovered: ["PO-103"],
        phStatus: "Accepted",
        aeStatus: "Approved"
      },
      {
        id: 3,
        invoiceNumber: "INV-003",
        vendorName: "QRS Traders",
        uploadedDate: "2025-06-03",
        totalAmount: 95000,
        posCovered: ["PO-104"],
        phStatus: "Rejected",
        aeStatus: "-"
      },
      {
        id: 4,
        invoiceNumber: "INV-004",
        vendorName: "TechBuild",
        uploadedDate: "2025-06-04",
        totalAmount: 102000,
        posCovered: ["PO-105"],
        phStatus: "Accepted",
        aeStatus: "Rejected"
      },
      {
        id: 5,
        invoiceNumber: "INV-005",
        vendorName: "Global Traders",
        uploadedDate: "2025-06-05",
        totalAmount: 112000,
        posCovered: ["PO-106"],
        phStatus: "Rejected",
        aeStatus: "-"
      },
      {
        id: 6,
        invoiceNumber: "INV-006",
        vendorName: "Futura Supplies",
        uploadedDate: "2025-06-06",
        totalAmount: 78000,
        posCovered: ["PO-107"],
        phStatus: "Accepted",
        aeStatus: "Pending"
      },
      {
        id: 7,
        invoiceNumber: "INV-007",
        vendorName: "MegaMart",
        uploadedDate: "2025-06-07",
        totalAmount: 134000,
        posCovered: ["PO-108"],
        phStatus: "Accepted",
        aeStatus: "Approved"
      },
      {
        id: 8,
        invoiceNumber: "INV-008",
        vendorName: "QuickServe",
        uploadedDate: "2025-06-08",
        totalAmount: 97000,
        posCovered: ["PO-109"],
        phStatus: "Rejected",
        aeStatus: "-"
      },
      {
        id: 9,
        invoiceNumber: "INV-009",
        vendorName: "InfraEdge",
        uploadedDate: "2025-06-09",
        totalAmount: 156000,
        posCovered: ["PO-110"],
        phStatus: "Accepted",
        aeStatus: "Pending"
      },
      {
        id: 10,
        invoiceNumber: "INV-010",
        vendorName: "Zenith Corp",
        uploadedDate: "2025-06-10",
        totalAmount: 66000,
        posCovered: ["PO-111"],
        phStatus: "Accepted",
        aeStatus: "Approved"
      }
    ];

    setInvoices(mockData);
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  const filteredData = invoices.filter((inv) => {
    return (
      inv.invoiceNumber.toLowerCase().includes(filter.invoiceNumber.toLowerCase()) &&
      (filter.phStatus ? inv.phStatus === filter.phStatus : true) &&
      (filter.aeStatus ? inv.aeStatus === filter.aeStatus : true)
    );
  });

  return (
    <div className="max-w-7xl mx-auto p-4 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center text-green-600">Invoice History - PH</h2>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <input
          name="invoiceNumber"
          type="text"
          placeholder="Filter by Invoice No"
          value={filter.invoiceNumber}
          onChange={handleFilterChange}
          className="border border-gray-300 rounded px-4 py-2 w-full"
        />

        <select
          name="phStatus"
          value={filter.phStatus}
          onChange={handleFilterChange}
          className="border border-gray-300 rounded px-4 py-2 w-full"
        >
          <option value="">All PH Status</option>
          <option value="Accepted">Accepted</option>
          <option value="Rejected">Rejected</option>
        </select>

        <select
          name="aeStatus"
          value={filter.aeStatus}
          onChange={handleFilterChange}
          className="border border-gray-300 rounded px-4 py-2 w-full"
        >
          <option value="">All AE Status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
          <option value="-">Not Sent</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">#</th>
              <th className="border p-2">Invoice No.</th>
              <th className="border p-2">Vendor</th>
              <th className="border p-2">Uploaded Date</th>
              <th className="border p-2">POs Covered</th>
              <th className="border p-2">Amount</th>
              <th className="border p-2">PH Status</th>
              <th className="border p-2">AE Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-6">No matching records found.</td>
              </tr>
            ) : (
              filteredData.map((invoice, index) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="border p-2">{index + 1}</td>
                  <td className="border p-2">{invoice.invoiceNumber}</td>
                  <td className="border p-2">{invoice.vendorName}</td>
                  <td className="border p-2">{invoice.uploadedDate}</td>
                  <td className="border p-2">{invoice.posCovered.join(", ")}</td>
                  <td className="border p-2">₹{invoice.totalAmount.toLocaleString()}</td>
                  <td className="border p-2">
                    <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                      invoice.phStatus === "Accepted"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {invoice.phStatus}
                    </span>
                  </td>
                  <td className="border p-2">
                    <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                      invoice.aeStatus === "Approved"
                        ? "bg-green-100 text-green-800"
                        : invoice.aeStatus === "Rejected"
                        ? "bg-red-100 text-red-800"
                        : invoice.aeStatus === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {invoice.aeStatus}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";

export default function MyInvoiceUploads() {
  const [invoices, setInvoices] = useState([]);
   const [filter, setFilter] = useState({
    poNumber: "",
    invoiceNumber: "",
    status: ""
  });

  useEffect(() => {
    // Mock data; in production, replace this with API call
    const mockData = [
      {
        id: 1,
        invoiceNumber: "INV-001",
        vendorName: "ABC Suppliers",
        uploadedDate: "2025-05-01",
        totalAmount: 120000,
        posCovered: ["PO-101", "PO-102"],
        status: "Pending",
        poNumber: "PO-101",
        
        
      },
      {
        id: 2,
        invoiceNumber: "INV-002",
        vendorName: "XYZ Enterprises",
        uploadedDate: "2025-05-15",
        totalAmount: 95000,
        posCovered: ["PO-103"],
        status: "Approved",
        poNumber: "PO-103",
       
      }
    ];

    setInvoices(mockData);
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
  };

  const filteredDCs = invoices.filter((dc) => {
    return (
      dc.poNumber.toLowerCase().includes(filter.poNumber.toLowerCase()) &&
      dc.invoiceNumber.toLowerCase().includes(filter.invoiceNumber.toLowerCase()) &&
      dc.status.toLowerCase().includes(filter.status.toLowerCase())
    );
  });
  

  return (
    <div className="max-w-7xl mx-auto p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-green-700">My Invoice Uploads</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <input
          name="poNumber"
          type="text"
          placeholder="Filter by PO Number"
          className="input border w-full border-gray-300 rounded px-4 py-2"
          value={filter.poNumber}
          onChange={handleFilterChange}
        />
        <input
          name="invoiceNumber"
          type="text"
          placeholder="Filter by Invoice Number"
          className="input border w-full border-gray-300 rounded px-4 py-2"
          value={filter.invoiceNumber}
          onChange={handleFilterChange}
        />
        <input
          name="status"
          type="text"
          placeholder="Filter by Status"
          className="input border w-full border-gray-300 rounded px-4 py-2"
          value={filter.status}
          onChange={handleFilterChange}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">#</th>
              <th className="border p-2">Invoice No.</th>
              <th className="border p-2">Vendor Name</th>
              <th className="border p-2">Uploaded Date</th>
              <th className="border p-2">POs Covered</th>
              <th className="border p-2">Total Amount</th>
              <th className="border p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredDCs.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-6">No invoices uploaded yet.</td>
              </tr>
            ) : (
              filteredDCs.map((invoice, index) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="border p-2">{index + 1}</td>
                  <td className="border p-2">{invoice.invoiceNumber}</td>
                  <td className="border p-2">{invoice.vendorName}</td>
                  <td className="border p-2">{invoice.uploadedDate}</td>
                  <td className="border p-2">{invoice.posCovered.join(", ")}</td>
                  <td className="border p-2">₹{invoice.totalAmount.toLocaleString()}</td>
                  <td className="border p-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      invoice.status === "Approved"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {invoice.status}
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

import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import VendorDetailsModal from "./UIComponents/VendorDetailsModal";
import VendorEditModal from "./UIComponents/VendorEditModal";

const initialVendors = [
   {
    id: 1,
    vendorName: "ABC Technologies",
    gstin: "27AACCT1234K1ZV",
    pan: "AACCT1234K",
    expenseType: "Software Services",
    tdsRate: "10",
    vendorType: "General",
    address: "Pune, Maharashtra",
    contactPerson: "Rahul Deshmukh",
    contactNumber: "9823012345",
    email: "rahul@abc.com",
    createdDate: "01/06/2025",
    status: "Approved",
  },
  {
    id: 2,
    vendorName: "XYZ Materials Pvt Ltd",
    gstin: "29AAACX1111Q1ZP",
    pan: "AAACX1111Q",
    expenseType: "Maintenance",
    tdsRate: "5",
    vendorType: "Material",
    address: "Bangalore, Karnataka",
    contactPerson: "Sunita Sharma",
    contactNumber: "9876543222",
    email: "sunita@xyz.com",
    createdDate: "08/06/2025",
    status: "Approved",
  },
  {
    id: 3,
    vendorName: "Greenfield Uniforms",
    gstin: "07AAAGU7654M1ZY",
    pan: "AAAGU7654M",
    expenseType: "Uniform Supply",
    tdsRate: "2",
    vendorType: "Uniform",
    address: "Delhi, India",
    contactPerson: "Vikram Joshi",
    contactNumber: "9811122233",
    email: "vikram@greenfield.com",
    createdDate: "03/06/2025",
    status: "Pending",
  },
  {
    id: 4,
    vendorName: "Reliable Constructions",
    gstin: "24AACR1234E1Z5",
    pan: "AACR1234E",
    expenseType: "Civil Work",
    tdsRate: "1",
    vendorType: "General",
    address: "Ahmedabad, Gujarat",
    contactPerson: "Ramesh Patel",
    contactNumber: "9876567890",
    email: "ramesh@reliable.com",
    createdDate: "05/06/2025",
    status: "Approved",
  },
  {
    id: 5,
    vendorName: "Softplus Technologies",
    gstin: "19AACFS9876H1ZF",
    pan: "AACFS9876H",
    expenseType: "IT Consulting",
    tdsRate: "10",
    vendorType: "General",
    address: "Kolkata, West Bengal",
    contactPerson: "Anita Ghosh",
    contactNumber: "9007034567",
    email: "anita@softplus.com",
    createdDate: "04/06/2025",
    status: "Pending",
  },
  {
    id: 6,
    vendorName: "Global Services Inc",
    gstin: "21AAGCS9987N1Z6",
    pan: "AAGCS9987N",
    expenseType: "Outsourcing",
    tdsRate: "5",
    vendorType: "General",
    address: "Bhubaneswar, Odisha",
    contactPerson: "Deepak Mehta",
    contactNumber: "9856123456",
    email: "deepak@global.com",
    createdDate: "02/06/2025",
    status: "Approved",
  },
  {
    id: 7,
    vendorName: "Kriti Industrial Supplies",
    gstin: "10AAACK7654J1ZX",
    pan: "AAACK7654J",
    expenseType: "Equipment",
    tdsRate: "2",
    vendorType: "Material",
    address: "Patna, Bihar",
    contactPerson: "Kriti Sharma",
    contactNumber: "9123456780",
    email: "kriti@kisupplies.com",
    createdDate: "06/06/2025",
    status: "Pending",
  },
  {
    id: 8,
    vendorName: "EcoUniform Pvt Ltd",
    gstin: "08AAAEC1234K1Z4",
    pan: "AAAEC1234K",
    expenseType: "Uniforms",
    tdsRate: "2",
    vendorType: "Uniform",
    address: "Jaipur, Rajasthan",
    contactPerson: "Manoj Saini",
    contactNumber: "9784563210",
    email: "manoj@ecouniform.com",
    createdDate: "07/06/2025",
    status: "Approved",
  },
  {
    id: 9,
    vendorName: "Urban Infra Projects",
    gstin: "09AACUI7865E1ZR",
    pan: "AACUI7865E",
    expenseType: "Infrastructure",
    tdsRate: "1",
    vendorType: "General",
    address: "Lucknow, Uttar Pradesh",
    contactPerson: "Priya Yadav",
    contactNumber: "8904561237",
    email: "priya@urbaninfra.com",
    createdDate: "09/06/2025",
    status: "Pending",
  },
  {
    id: 10,
    vendorName: "SysCare Solutions",
    gstin: "23AAASC3214P1ZZ",
    pan: "AAASC3214P",
    expenseType: "AMC",
    tdsRate: "10",
    vendorType: "General",
    address: "Bhopal, Madhya Pradesh",
    contactPerson: "Nitin Saxena",
    contactNumber: "9910456743",
    email: "nitin@syscare.com",
    createdDate: "09/06/2025",
    status: "Approved",
  },
];

export default function VendorTable() {
  const [vendors, setVendors] = useState(initialVendors);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);

  const ITEMS_PER_PAGE = 5;

  const filteredVendors = vendors.filter(v =>
    v.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedVendors = filteredVendors.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const openDetails = vendor => {
    setSelectedVendor(vendor);
    setShowDetails(true);
  };

  

  const deleteVendor = id => {
    if (confirm("Are you sure you want to delete this vendor?")) {
      setVendors(prev => prev.filter(v => v.id !== id));
    }
  };

  return (
    <div className="mt-8 px-4 max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4 text-green-600">Vendor List</h2>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by vendor name or email..."
        className="mb-4 w-full md:w-1/3 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />

      {/* Table */}
      <div className="overflow-hidden  shadow-md">
        <table className="w-full table-auto text-sm text-left text-gray-700 border">
          <thead className="bg-gray-200 text-xs uppercase font-medium text-green-800 border">
            <tr>
              <th className="px-4 py-2 border">Vendor</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Created</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedVendors.map(v => (
              <tr key={v.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 border">{v.vendorName}</td>
                <td className="px-4 py-2 border">{v.email}</td>
                <td className="px-4 py-2 border">{v.createdDate}</td>
                <td className="px-4 py-1 border">
                  <span className={`px-4  py-1 rounded text-xs font-semibold ${
                    v.status === "Pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-200 text-green-800"
                  }`}>
                    {v.status}
                  </span>
                </td>
                <td className="px-4 py-2 text-center flex items-center justify-center gap-2">
                  <AiOutlineEye
                    onClick={() => openDetails(v)}
                    className="text-lg text-green-600 cursor-pointer hover:scale-110"
                    title="View"
                  />
                 
                  <AiOutlineDelete
                    onClick={() => deleteVendor(v.id)}
                    className="text-lg text-red-500 cursor-pointer hover:scale-110"
                    title="Delete"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end items-center gap-2 mt-4">
        {Array.from({ length: Math.ceil(filteredVendors.length / ITEMS_PER_PAGE) }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded border ${
              currentPage === i + 1
                ? "bg-green-500 text-white"
                : "bg-white text-green-700 border-green-400"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Modals */}
      {showDetails && selectedVendor && (
        < VendorDetailsModal vendor={selectedVendor} onClose={() => setShowDetails(false)} />
      )}
     
    </div>
  );
}

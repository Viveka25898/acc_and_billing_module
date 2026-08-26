/* eslint-disable no-unused-vars */
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectRegion } from "../../../Auth/authSlice";

const AESidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const region = useSelector(selectRegion);

  const formatRegion = (reg) => {
    if (!reg) return '';
    if (Array.isArray(reg)) {
      return reg.map(r => {
        if (typeof r !== 'string') return '';
        return `${r.charAt(0).toUpperCase()}${r.slice(1).toLowerCase()}`;
      }).filter(Boolean).join(' & ') + ' Region';
    }
    if (typeof reg !== 'string') return '';
    return `${reg.charAt(0).toUpperCase()}${reg.slice(1).toLowerCase()} Region`;
  };

  const regionLabel = formatRegion(region);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 bg-green-600 text-white p-2 rounded-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-48 bg-green-700 text-white shadow-lg transform transition-transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:w-48 lg:block`}
      >
        {/* Header */}
        <div className="p-4 bg-green-800 text-center">
          <p className="text-base font-semibold">Account Executive</p>
          {regionLabel && <p className="text-xs text-green-200 mt-0.5">{regionLabel}</p>}
        </div>

        {/* Scrollable Menu */}
        <ul className="overflow-y-auto h-[calc(100vh-64px)] pr-2 custom-scrollbar">

          <li className="px-6 py-2 hover:bg-green-600 cursor-pointer text-sm">
            <NavLink to="/dashboard/ae">Dashboard</NavLink>
          </li>
          <hr className="border-white mx-4" />

           <li className="px-6 py-2 hover:bg-green-600 cursor-pointer text-sm">
            <NavLink to="/dashboard/ae/advance-approval-requests">Employee Advance Approval</NavLink>
          </li>
          <hr className="border-white mx-4" />

          <li className="px-6 py-2 hover:bg-green-600 cursor-pointer text-sm">
            <NavLink to="/dashboard/ae/advance-settlement-requests">Advance Settlement Requests</NavLink>
          </li>
          <hr className="border-white mx-4" />

           <li className="px-6 py-2 hover:bg-green-600 cursor-pointer text-sm">
            <NavLink to="/dashboard/ae/invoice-review">Invoices from PH</NavLink>
          </li>
          <hr className="border-white mx-4" />

          {/*<li className="px-6 py-2 hover:bg-green-600 cursor-pointer text-sm">
            <NavLink to="/dashboard/ae/vendor-creation">Create Vendor</NavLink>
          </li>
          <hr className="border-white mx-4" />

          <li className="px-6 py-2 hover:bg-green-600 cursor-pointer text-sm">
            <NavLink to="/dashboard/ae/process-payments">Process for Payments</NavLink>
          </li>
          <hr className="border-white mx-4" />



          <li className="px-6 py-2 hover:bg-green-600 cursor-pointer text-sm">
            <NavLink to="/dashboard/ae/map-tds">Map TDS to Vendor</NavLink>
          </li>
          <hr className="border-white mx-4" />

          <li className="px-6 py-2 hover:bg-green-600 cursor-pointer text-sm">
            <NavLink to="/dashboard/ae/expense-booking">Expense Booking Form</NavLink>
          </li>
          <hr className="border-white mx-4" />

          <li className="px-6 py-2 hover:bg-green-600 cursor-pointer text-sm">
            <NavLink to="/dashboard/ae/vendor-ledger-page">Vendor Ledger</NavLink>
          </li>
          <hr className="border-white mx-4" />

          <li className="px-6 py-2 hover:bg-green-600 cursor-pointer text-sm">
            <NavLink to="/dashboard/ae/pending-compliance-requests">Compliance Payments</NavLink>
          </li>
          <hr className="border-white mx-4" />

          <li className="px-6 py-2 hover:bg-green-600 cursor-pointer text-sm">
            <NavLink to="/dashboard/ae/salaries-pending-approvals">Salaries Pending Approvals</NavLink>
          </li>
          <hr className="border-white mx-4" />*/}

          <li className="px-6 py-2 hover:bg-green-600 cursor-pointer text-sm ">
            <NavLink to="/dashboard/ae/conveyance-approval">Conveyance Approval</NavLink>
          </li>
          <hr className="border-white mx-4" />

           <li className="px-6 py-2 hover:bg-green-600 cursor-pointer text-sm mb-10">
            <NavLink to="/dashboard/ae/reliever-approval">Reliever Approval</NavLink>
          </li> 
          <hr className="border-white mx-4" />
          
        </ul>
      </div>
    </>
  );
};

export default AESidebar;

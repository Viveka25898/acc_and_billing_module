/* eslint-disable no-unused-vars */
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { NavLink } from "react-router-dom";


const VendorSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Sidebar Toggle Button for Mobile */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 bg-green-600 text-white p-2 rounded-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Sidebar Container */}
      <div
        className={`fixed top-0 left-0 h-full w-48 bg-green-700 text-white shadow-lg transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform lg:translate-x-0 lg:w-48 lg:block`}
      >
        {/* Sidebar Header */}
        <div className="p-4 text-xl font-semibold bg-green-800 text-center">   
        Vendor
        </div>

        {/* Sidebar Menu */}
        <ul className="mt-6">
        <li className="px-6 py-2 hover:bg-green-600 cursor-pointer text-sm">
              <NavLink to="/dashboard/vendor">
                Dashboard
              </NavLink>
        </li>
        <hr className="border-white mx-4" />

        <li className="px-6 py-2 hover:bg-green-600 cursor-pointer text-sm">
              <NavLink to="/dashboard/vendor/material-requests">
                Material Requests
              </NavLink>
        </li>
        <hr className="border-white mx-4" />
         <li className="px-6 py-2 hover:bg-green-600 cursor-pointer text-sm">
              <NavLink to="/dashboard/vendor/dc-upload">
                DC Upload
              </NavLink>
        </li>
        <hr className="border-white mx-4" />

        <li className="px-6 py-2 hover:bg-green-600 cursor-pointer text-sm">
              <NavLink to="/dashboard/vendor/invoice-upload">
                Invoice Upload
              </NavLink>
        </li>
        <hr className="border-white mx-4" />

         <li className="px-6 py-2 hover:bg-green-600 cursor-pointer text-sm">
              <NavLink to="/dashboard/vendor/fixed-assets-purchase-orders">
                Fixed Assets POs
              </NavLink>
        </li>
        <hr className="border-white mx-4" />

        <li className="px-6 py-2 hover:bg-green-600 cursor-pointer text-sm">
              <NavLink to="/dashboard/vendor/onetime-expense-professional-fees-po">
                OneTime Expense/Professional Fees Po's
              </NavLink>
        </li>
        <hr className="border-white mx-4" />

        <li className="px-6 py-2 hover:bg-green-600 cursor-pointer text-sm">
              <NavLink to="/dashboard/vendor/procurement-po">
               Procurement Po's
              </NavLink>
        </li>
        <hr className="border-white mx-4" />
       <li className="px-6 py-2 hover:bg-green-600 cursor-pointer text-sm">
              <NavLink to="/dashboard/vendor/invoice-upload-form">
               Procurement Invoice Upload
              </NavLink>
        </li>
        <hr className="border-white mx-4" />
        </ul>
      </div>
    </>
  );
};

export default VendorSidebar;

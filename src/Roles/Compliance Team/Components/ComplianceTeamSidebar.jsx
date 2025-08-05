/* eslint-disable no-unused-vars */
import { useState } from "react";
import { FaBars, FaChevronDown, FaChevronUp, FaTimes } from "react-icons/fa";
import { NavLink } from "react-router-dom";


const ComplianceTeamSidebar = () => {
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
         
        Compliance-Team
        </div>

        {/* Sidebar Menu */}
        <ul className="mt-6">
        <li className="px-6 py-2 hover:bg-green-600 cursor-pointer text-sm">
              <NavLink to="/dashboard/compliance-team">
                Dashboard
              </NavLink>
        </li>
        <hr className="border-white mx-4" />
        <li className="px-6 py-2 hover:bg-green-600 cursor-pointer text-sm">
              <NavLink to="/dashboard/compliance-team/advance-request">
                Advance Request
              </NavLink>
        </li>
        <hr className="border-white mx-4" />

        

        <li className="px-6 py-2 hover:bg-green-600 cursor-pointer text-sm">
              <NavLink to="/dashboard/compliance-team/compliance-entry-form">
               Compliance Entry
              </NavLink>
        </li>
        <hr className="border-white mx-4" />
        
         
        </ul>
      </div>
    </>
  );
};

export default ComplianceTeamSidebar;

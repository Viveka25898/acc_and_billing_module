/* eslint-disable no-unused-vars */
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectRole, selectRegion } from "../../../Auth/authSlice";

// ─── Role Display Name Map ────────────────────────────────────────────────────
// Maps kebab-case role strings to human-readable titles for the sidebar header
const ROLE_DISPLAY_NAMES = {
  'employee':            'Employee',
  'operation-executive': 'Operation Executive',
  'operation-manager':   'Operation Manager',
  'supervisor':          'Supervisor',
}

// ─── Format Region ────────────────────────────────────────────────────────────
// Converts "SOUTH" → "South", "WEST" → "West" etc.
const formatRegion = (region) => {
  if (!region) return ''
  return region.charAt(0).toUpperCase() + region.slice(1).toLowerCase()
}

const EmployeeSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // ─── Get Role & Region from Redux ─────────────────────────────────────────
  const role   = useSelector(selectRole)
  const region = useSelector(selectRegion)

  const roleLabel   = ROLE_DISPLAY_NAMES[role] || 'Employee'
  const regionLabel = formatRegion(region)

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
        {/* Sidebar Header — Role + Region */}
        <div className="p-4 bg-green-800 text-center">
          <p className="text-sm font-semibold leading-tight">{roleLabel}</p>
          {regionLabel && (
            <p className="text-xs text-green-200 mt-0.5">{regionLabel}</p>
          )}
        </div>

        {/* Sidebar Menu */}
        <ul className="mt-6">
          <li className="px-6 py-2 hover:bg-green-600 cursor-pointer text-sm">
            <NavLink to="/dashboard/employee">
              Dashboard
            </NavLink>
          </li>
          <hr className="border-white mx-4" />
          <li className="px-6 py-2 hover:bg-green-600 cursor-pointer text-sm">
            <NavLink to="/dashboard/employee/advance-request">
              Advance Request
            </NavLink>
          </li>
          <hr className="border-white mx-4" />
          <li className="px-6 py-2 hover:bg-green-600 cursor-pointer text-sm">
            <NavLink to="/dashboard/employee/advance-settlement">
              Advance Settlement
            </NavLink>
          </li>
          <hr className="border-white mx-4" />
          {/* <li className="px-6 py-2 hover:bg-green-600 cursor-pointer text-sm">
            <NavLink to="/dashboard/employee/conveyance-form">
              Conveyance Form
            </NavLink>
          </li> */}
          <hr className="border-white mx-4" />
          <li className="px-6 py-2 hover:bg-green-600 cursor-pointer text-sm">
            <NavLink to="/dashboard/employee/reliver-form">
              Reliever Form
            </NavLink>
          </li>
          <hr className="border-white mx-4" />
        </ul>
      </div>
    </>
  );
};

export default EmployeeSidebar;

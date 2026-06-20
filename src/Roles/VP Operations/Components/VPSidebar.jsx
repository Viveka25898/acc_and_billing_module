/* eslint-disable no-unused-vars */
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectRegion } from "../../../Auth/authSlice";

const VPSidebar = () => {
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

  const links = [
    { to: "/dashboard/vp-operations", label: "Dashboard", end: true },
    // { to: "/dashboard/vp-operations/advance-request", label: "Advance Request" },
    { to: "/dashboard/vp-operations/vp-advance-approval", label: "Employee Advance Approval" },
    { to: "/dashboard/vp-operations/advance-settlement-approval", label: "Settlement Approvals" },
    { to: "/dashboard/vp-operations/submit-advance-settlement", label: "Submit Advance Settlement" },
    { to: "/dashboard/vp-operations/my-settelment-requests", label: "My Settlement Requests" },
    { to: "/dashboard/vp-operations/vp-conveyance-approval", label: "Conveyance Approval" },
    { to: "/dashboard/vp-operations/reliever-approval-vp-operation-page", label: "Reliver Requests Approval" },
  ];

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
        className={`fixed top-0 left-0 h-full w-48 bg-green-700 text-white shadow-lg transform ${isOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform lg:translate-x-0 lg:w-48 lg:block`}
      >
        {/* Sidebar Header */}
        <div className="p-4 bg-green-800 text-center">
          <p className="text-base font-semibold">VP Operations</p>
          {regionLabel && <p className="text-xs text-green-200 mt-0.5">{regionLabel}</p>}
        </div>

        {/* Sidebar Menu */}
        <ul className="mt-6">
          {links.map(({ to, label, end }, i) => (
            <li key={i}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  `block px-6 py-2 text-sm cursor-pointer hover:bg-green-600 transition ${isActive ? "bg-green-600 font-semibold" : ""
                  }`
                }
              >
                {label}
              </NavLink>
              <hr className="border-white mx-4" />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default VPSidebar;

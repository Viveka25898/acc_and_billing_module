import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout, selectEmpName, selectRegion } from "../../../Auth/authSlice";
import { toast } from "react-toastify";
import ProfileImage from "../../../Auth/assets/profile-picture.jpg"

// ─── Format Region ────────────────────────────────────────────────────────────
// Converts "SOUTH" → "South", "WEST" → "West" etc.
const formatRegion = (region) => {
  if (!region) return null
  return region.charAt(0).toUpperCase() + region.slice(1).toLowerCase()
}

const EmployeeNavbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navigate  = useNavigate()
  const dispatch  = useDispatch()

  // ─── Get Real User Data from Redux ────────────────────────────────────────
  const empName = useSelector(selectEmpName)
  const region  = useSelector(selectRegion)

  const displayName   = empName  || 'User'
  const displayRegion = formatRegion(region)

  // ─── Logout ───────────────────────────────────────────────────────────────
  const handleLogout = () => {
    dispatch(logout())
    toast.success("Logged out successfully!", {
      position: "top-right",
      autoClose: 3000,
    })
    navigate("/")
  }

  return (
    <nav className="bg-green-600 text-white h-14 flex items-center justify-between px-4 md:px-8 shadow-md">

      {/* Left: Spacer */}
      <div className="w-1/3"></div>

      {/* Center: Real Name & Region */}
      <div className="hidden sm:flex flex-col items-center text-center">
        <span className="text-base font-medium">Name:- {displayName}</span>
        {displayRegion && (
          <span className="text-xs">Region:- {displayRegion}</span>
        )}
      </div>

      {/* Right: Profile Image + Dropdown */}
      <div className="relative">
        <div
          className="flex items-center cursor-pointer"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <img
            src={ProfileImage}
            alt="Profile"
            className="w-9 h-9 rounded-full border-2 border-white"
          />
        </div>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white text-black shadow-lg rounded-md z-50">
            <ul className="py-1">
              <li className="px-4 py-2 text-xs text-gray-400 font-semibold border-b">{displayName}</li>
              <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">Profile</li>
              <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">Settings</li>
              <li
                className="px-4 py-2 hover:bg-red-500 hover:text-white cursor-pointer"
                onClick={handleLogout}
              >
                Logout
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default EmployeeNavbar;

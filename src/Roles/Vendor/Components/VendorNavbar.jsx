import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../Auth/authSlice";
import { toast } from "react-toastify";
import ProfileImage from "../../../Auth/assets/profile-picture.jpg"

const PHNavbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navigate=useNavigate()
  const dispatch=useDispatch()


  // ****************************Logout Handle Submit********************
  const handleLogout=()=>{
    localStorage.removeItem("user");
          dispatch(logout())
          toast.success("Logout Successfully! 🚀", {
                          position: "top-right",
                          autoClose: 3000, // Closes after 3 sec
                        });
          navigate("/")

  }



  return (
    <nav className="bg-green-600 text-white h-14 flex items-center justify-between px-4 md:px-8 shadow-md z-50 ">
    
      {/* Left: Role Name */}
      <div className="w-1/3"></div>

      {/* Center: Site Name & Location (Hidden on very small screens) */}
      <div className="hidden sm:flex flex-col items-center text-center">
            <span className="text-base font-medium"> Name:- ABC</span>
            <span className="text-xs">Location:- Pune, India</span>
      </div>

      {/* Right: Profile Image + Dropdown */}
      <div className="relative z-50">
        <div
          className="flex items-center cursor-pointer"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
                <img
                    src={ProfileImage} // Replace with actual image path
                    alt="Profile"
                    className="w-9 h-9 rounded-full border-2 border-white"
                />
          
        </div>



        {/* Dropdown Menu */}
        {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white text-black shadow-lg rounded-md z-50">
                    <ul className="py-1">
                            <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">Profile</li>
                            <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">Settings</li>
                            <li className="px-4 py-2 hover:bg-red-500  cursor-pointer" onClick={handleLogout}>Logout</li>
                    </ul>
            </div>
        )}
      </div>
    </nav>
  );
};

export default PHNavbar;
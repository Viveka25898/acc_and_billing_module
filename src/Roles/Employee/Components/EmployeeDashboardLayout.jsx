
import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";
import EmployeeSidebar from "./EmployeeSidebar";
import EmployeeNavbar from "./EmployeeNavbar";

const EmployeeDashboardLayout = () => {

  //Toaster
  useEffect(() => {
      // Check if login flag is set
      if (localStorage.getItem("showLoginToast") === "true") {
        toast.success("Login Successful! 🎉", {
          position: "top-right",
          autoClose: 3000,
        });
  
        // Remove flag so it doesn’t show again
        localStorage.removeItem("showLoginToast");
      }
    }, []);
  return (
    <div className="flex h-screen">
      {/* Sidebar (Fixed Left & Always on Top) */}
      <div className="w-48 flex-shrink-0">
        <EmployeeSidebar />
      </div>

      {/* Main Content Wrapper */}
      <div className="flex flex-col flex-1">
        {/* Navbar (Below Sidebar, but Fixed at Top) */}
        <EmployeeNavbar />

        {/* Page Content Area */}
        <div className="p-6 bg-gray-100 flex-1 overflow-auto">
          <Outlet/>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboardLayout;





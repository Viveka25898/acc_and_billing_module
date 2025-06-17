import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";
import VendorSidebar from "./VendorSidebar";
import VendorNavbar from "./VendorNavbar";

const VendorDashboardLayout = () => {
  useEffect(() => {
    if (localStorage.getItem("showLoginToast") === "true") {
      toast.success("Login Successful! 🎉", {
        position: "top-right",
        autoClose: 3000,
      });
      localStorage.removeItem("showLoginToast");
    }
  }, []);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-48 flex-shrink-0">
        <VendorSidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1">
        <VendorNavbar />

        <div className="pt-14 p-6 bg-gray-100 flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default VendorDashboardLayout;

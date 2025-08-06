/* eslint-disable no-unused-vars */
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useDispatch } from "react-redux";
import { login } from "./Auth/authSlice.jsx";
import { router } from "./Routes/Route.jsx";
import { useEffect } from "react";

function App() {
  // Local Storage Initialization - Only Role Assignment
  useEffect(() => {
    try {
      const existingUsers = localStorage.getItem("users");
      if (!existingUsers || !JSON.parse(existingUsers).some(user => user.role === "compliance-team")) {
        const users = [
          // Employees
          { username: "emp1", role: "employee", empId: "1", reportsTo: "lm1" },
          { username: "emp2", role: "employee", empId: "2", reportsTo: "lm2" },
          { username: "emp3", role: "employee", empId: "3", reportsTo: "lm1" },
          { username: "emp4", role: "employee", empId: "4", reportsTo: "lm3" },

          // Line Managers
          { username: "lm1", role: "line-manager", empId: "5", reportsTo: "vp1" },
          { username: "lm2", role: "line-manager", empId: "6", reportsTo: "vp1" },
          { username: "lm3", role: "line-manager", empId: "7", reportsTo: "vp2" },
          { username: "lm4", role: "line-manager", empId: "8", reportsTo: "vp2" },

          // VPs
          { username: "vp1", role: "vp-operations", empId: "9", reportsTo: "ae1" },
          { username: "vp2", role: "vp-operations", empId: "10", reportsTo: "ae1" },

          // Account Executive
          { username: "ae1", role: "account-executive", empId: "11", reportsTo: null },
          
          // Operation Executives
          { username: "oe1", role: "operation-executive", empId: "12", reportsTo: "lm1" },
          { username: "oe2", role: "operation-executive", empId: "13", reportsTo: "lm2" },
          { username: "oe3", role: "operation-executive", empId: "14", reportsTo: "lm3" },
          { username: "oe4", role: "operation-executive", empId: "15", reportsTo: "lm4" },
          
          // Compliance Team
          { username: "compliance1", role: "compliance-team", empId: "16", reportsTo: "compliance-manager1" },
          { username: "compliance2", role: "compliance-team", empId: "17", reportsTo: "compliance-manager2" },
          
          // Compliance Managers
          { username: "compliance-manager1", role: "compliance-manager", empId: "18", reportsTo: "ae1" },
          { username: "compliance-manager2", role: "compliance-manager", empId: "19", reportsTo: "ae1" }
        ];

        localStorage.setItem("users", JSON.stringify(users));
        console.log("User roles initialized in localStorage");
      }
    } catch (error) {
      console.error("Error initializing user roles:", error);
    }
  }, []);

  return (
    <>
      <ToastContainer />
      <RouterProvider router={router} />  
    </>
  );
}

export default App;
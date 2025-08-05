/* eslint-disable no-unused-vars */
import {RouterProvider} from "react-router-dom"

import { ToastContainer } from "react-toastify";

import { useDispatch } from "react-redux";
import { login } from "./Auth/authSlice.jsx";
import { router } from "./Routes/Route.jsx";
import { useEffect } from "react";
function App() {

  //Local Storage:-
  useEffect(() => {
    const existingUsers = JSON.parse(localStorage.getItem("users"));
    if (!existingUsers) {
      const users = [
        // Employees
        { username: "emp1", role: "employee", empId:"1", reportsTo: "lm1" },
        { username: "emp2", role: "employee", empId:"2", reportsTo: "lm2" },
        { username: "emp3", role: "employee", empId:"3", reportsTo: "lm1" },
        { username: "emp4", role: "employee", empId:"4", reportsTo: "lm3" },

        // Line Managers
        { username: "lm1", role: "line-manager", empId:"5", reportsTo: "vp1" },
        { username: "lm2", role: "line-manager", empId:"6", reportsTo: "vp1" },
        { username: "lm3", role: "line-manager", empId:"7", reportsTo: "vp2" },
        { username: "lm4", role: "line-manager", empId:"8", reportsTo: "vp2" },

        // VPs
        { username: "vp1", role: "vp-operations", empId:"9", reportsTo: "ae1" },
        { username: "vp2", role: "vp-operations", empId:"10", reportsTo: "ae1" },

        // Account Executive
        { username: "ae1", role: "account-executive", empId:"11", reportsTo: null },
      ];

      localStorage.setItem("users", JSON.stringify(users));
    }
  }, []);
  
   
  return <>
  <ToastContainer/>
    <RouterProvider router={router}/>  
  </>;
}

export default App;

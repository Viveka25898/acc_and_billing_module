/* eslint-disable no-unused-vars */
import {RouterProvider} from "react-router-dom"

import { ToastContainer } from "react-toastify";

import { useDispatch } from "react-redux";
import { login } from "./Auth/authSlice.jsx";
import { router } from "./Routes/Route.jsx";
function App() {
  
  return <>
  <ToastContainer/>
 <RouterProvider router={router}/>  
  </>;
}

export default App;

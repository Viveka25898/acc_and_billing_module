/* eslint-disable no-unused-vars */
;import "react-toastify/dist/ReactToastify.css";
import { useState } from "react"
import iSmartImg from "../assets/Web_Photo_Editor.jpg"
import {useNavigate} from "react-router-dom"
import { useDispatch } from "react-redux";
import { login } from "../authSlice";
const LoginForm=(props)=>{
  // Declearing All the States 

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role,setRoleValue]=useState("")


  const dispatch=useDispatch()
  const navigate=useNavigate()

  // Navigate To Dashboard 
  
  const handleLoginFormSubmit=(e)=>{
          e.preventDefault()
          if(!role){
            alert("Please Select the Role!")
            return
          }
          // 
          const userData = { username,
            role,
};
                  
              dispatch(login(userData));
              localStorage.setItem("userData",JSON.stringify(userData))
              localStorage.setItem("showLoginToast", "true");

             



          //Routing on the basis of Role.
            if(role==="employee") navigate("/dashboard/employee")
              else if(role==="line-manager") navigate("/dashboard/line-manager")
                else if(role==="vp-operations") navigate("/dashboard/vp-operations")
                  else if(role==="supervisor") navigate("/dashboard/supervisor") 
                    else if(role==="manager") navigate("/dashboard/manager")
                      else if(role==="ph") navigate("/dashboard/ph")
                        else if(role==="vendor") navigate("/dashboard/vendor")
                          else if(role==="ae") navigate("/dashboard/ae")
                            else if(role==="compliance-team") navigate("/dashboard/compliance-team")
                              else if(role==="compliance-manager") navigate("/dashboard/compliance-manager")
                                else if(role==="payroll-team") navigate("/dashboard/payroll-team")
                                  else if(role==="financial-head") navigate("/dashboard/financial-head")
                                    else if(role==="billing-manager") navigate("/dashboard/billing-manager")
                                      else if(role==="operation-executive") navigate("/dashboard/operation-executive")
                  //For Toaster
                  localStorage.setItem("showLoginToast", "true");

  }



    // return(
    //     <>
    //       {/* This is Main Div  */}

    //     <div className="flex flex-col lg:flex-row min-h-screen">
    //   {/* Left Part: Image Section (Hidden on Small Screens) */}
    //           <div className="w-full lg:w-1/2 h-64 lg:h-auto flex items-center justify-center bg-gray-200">
    //                     <img
    //                     src={iSmartImg}
    //                     alt="Login"
    //                     className="w-full h-full object-cover"
    //                     />
    //           </div>

    //   {/* Right Part: Login Form */}



    //   <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8">
    //         <div className="w-full max-w-sm text-center">
    //             <h2 className="text-5xl font-bold text-green-700 mb-8 font-mulish">{props.heading}</h2>
    //               <form className="space-y-4" onSubmit={handleLoginFormSubmit}>
    //                   <input
    //                     type="text"
    //                     placeholder="Username"
    //                     value={username}
    //                     onChange={(e)=>setUsername(e.target.value)}
    //                     required
    //                     className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mulish"
    //                   />

    //                   <input
    //                     type="password"
    //                     placeholder="Password"
    //                     value={password}
    //                     onChange={(e)=>setPassword(e.target.value)}
    //                     required
    //                     className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mulish"
    //                   />
    //                   <select
    //                   className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    //                   value={role} onChange={(e) => setRoleValue(e.target.value)} required>
    //                         <option value="" className="font-mulish">Select Role</option>
    //                         <option value="employee" className="font-mulish">Employee</option>
    //                         <option value="line-manager" className="font-mulish">Line Manager</option>
    //                         <option value="vp-operations" className="font-mulish">VP Operations</option>
    //                         <option value="supervisor" className="font-mulish">Supervisor</option>
    //                         <option value="manager" className="font-mulish">Manager</option>
    //                         <option value="ph" className="font-mulish">PH</option>
    //                         <option value="vendor" className="font-mulish">Vendor</option>
    //                         <option value="ae" className="font-mulish">Account Executive</option>
    //                         <option value="compliance-team" className="font-mulish">Compliance Team</option>
    //                         <option value="compliance-manager" className="font-mulish">Compliance Manager</option>
    //                         <option value="payroll-team" className="font-mulish">Payroll Team</option>
    //                         <option value="financial-head" className="font-mulish">Financial Head</option>
    //                         <option value="billing-manager" className="font-mulish">Billing Manager</option>
    //                         <option value="operation-executive" className="font-mulish">Operation Executive</option>
                           

                            
    //                   </select>

    //                   <button
    //                     type="submit"
    //                     className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-800 transition font-mulish"                       
    //                   >
    //                   Login
    //                   </button>
    //               </form>
    //         </div>
    //   </div>
    // </div>
    //     </>
    // )

    return (
  <>
    {/* Main Container */}
    <div className="flex flex-col lg:flex-row min-h-screen">

      {/* Left Part: Image Section */}
      <div className="hidden lg:flex lg:w-1/2 h-screen">
        <img
          src={iSmartImg}
          alt="Login"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Part: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-green-700 mb-8 font-mulish">
            {props.heading}
          </h2>
          <form className="space-y-4" onSubmit={handleLoginFormSubmit}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mulish"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mulish"
            />

            <select
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={role}
              onChange={(e) => setRoleValue(e.target.value)}
              required
            >
              <option value="">Select Role</option>
              <option value="employee">Employee</option>
              <option value="line-manager">Line Manager</option>
              <option value="vp-operations">VP Operations</option>
              <option value="supervisor">Supervisor</option>
              <option value="manager">Manager</option>
              <option value="ph">PH</option>
              <option value="vendor">Vendor</option>
              <option value="ae">Account Executive</option>
              <option value="compliance-team">Compliance Team</option>
              <option value="compliance-manager">Compliance Manager</option>
              <option value="payroll-team">Payroll Team</option>
              <option value="financial-head">Financial Head</option>
              <option value="billing-manager">Billing Manager</option>
              <option value="operation-executive">Operation Executive</option>
            </select>

            <button
              type="submit"
              className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-800 transition font-mulish"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  </>
);

}
export default LoginForm
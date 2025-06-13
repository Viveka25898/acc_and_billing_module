import {createBrowserRouter, Outlet} from "react-router-dom"
import AuthLayout from "../Auth/AuthLayout"
import Login from "../Auth/Pages/Login"
import ProtectedRoute from "./ProtectedRoute"
import EmployeeDashboard from "../Roles/Employee/Pages/EmployeeDashboard"
import EmployeeHome from "../Roles/Employee/Components/EmployeeHome"
import AdvanceRequestForm from "../Features/Advance Request/AdvanceRequestForm"
import LineManagerHome from "../Roles/Line Manager/Components/LineManagerHome"
import LineManagerDashboard from "../Roles/Line Manager/Pages/LineManagerDashboard"
import ManagerApproval from "../Features/Advance Request/ManagerApproal"
import VPDashboard from "../Roles/VP Operations/Pages/VPDashboard"
import VPHome from "../Roles/VP Operations/Components/VPHome"
import VPApproval from "../Features/Advance Request/VPApproval"
import MyRequests from "../Features/Advance Request/MyRequests"
import EmployeeAdvanceSettlementPage from "../Features/Advance Settlement/Pages/EmployeeAdvanceSettlementPage"
import ExpenseRequestsPage from "../Features/Advance Settlement/Pages/ExpenseRequestsPage"
import MySettlements from "../Features/Advance Settlement/Components/MySettlements"
import SupervisorDashboard from "../Roles/Supervisor/Pages/SupervisorDashboard"
import SupervisorHome from "../Roles/Supervisor/Components/SupervisorHome"
import MaterialRequestForm from "../Features/PurchaseBookingHKMaterial/MaterialRequestsForm"
import ManagerDashboard from "../Roles/Manager/Pages/ManagerDashboard"
import ManagerHome from "../Roles/Manager/Components/ManagerHome"
import MaterialRequestApprovalTable from "../Features/PurchaseBookingHKMaterial/MaterialRequestApproval"
import PHDashboard from "../Roles/PH/Pages/PHDashboard"
import PHHome from "../Roles/PH/Components/PHHome"
import ProjectHeadApprovalTable from "../Features/PurchaseBookingHKMaterial/ProjectHeadApprovalTable"
import PurchaseOrderForm from "../Features/PurchaseBookingHKMaterial/POForm"
import VendorDashboard from "../Roles/Vendor/Pages/VendorDashboard"
import VendorHome from "../Roles/Vendor/Components/VendorHome"
import MaterialRequestTable from "../Features/PurchaseBookingHKMaterial/MaterialRequestTable"
import GenerateDCForm from "../Features/PurchaseBookingHKMaterial/GenerateDCForm"
import VendorDCPage from "../Features/PurchaseBookingHKMaterial/VendorDCPage"
import DCUpload from "../Features/PurchaseBookingHKMaterial/DCUpload"
import VendorInvoiceUpload from "../Features/PurchaseBookingHKMaterial/VendorInvoiceUpload"
import MyInvoiceUpload from "../Features/PurchaseBookingHKMaterial/MyInvoiceUpload"
import PHInvoiceReview from "../Features/PurchaseBookingHKMaterial/PHInvoiceReview"
import AEDashboard from "../Roles/AE/Pages/AEDashboard"
import AEHome from "../Roles/AE/Components/AEHome"
import AEInvoiceReviewPage from "../Features/PurchaseBookingHKMaterial/AEInvoiceReviewPage"
import AEInvoiceApproval from "../Features/PurchaseBookingHKMaterial/AEInvoiceApproval"
import VendorCreationForm from "../Features/Vendor Creation Process/VendorCreationForm"
import VendorTable from "../Features/Vendor Creation Process/VendorsTable"
import ProcessPaymentPage from "../Features/Process For Payments/ProcessPaymentPage"
import VendorLedgerPage from "../Features/Process For Payments/VendorLedgerPage"
import ExpenseBookingPage from "../Features/Process of Auto JV/Pages/ExpenseBookingPage"
import TDSMappingPage from "../Features/Process of Auto JV/Pages/TDSMappingPage"
import  VendorLedgerPagee  from "../Features/Process of Auto JV/Pages/VendorLedgerPage"
import IncomeTaxDetailsPage from "../Features/Process of Auto JV/Pages/IncomeTaxDetailsPage"


export const router=createBrowserRouter([
    {
        path:"/login",
        element:(
            <AuthLayout>
                <Login/>
            </AuthLayout>
        ),
        errorElement: <h1>Page Not Found!</h1>, // Graceful error handling
    },
    // ***********************************Employee***************************************************************
    {
        path:"/dashboard/employee",
        element:(
            <ProtectedRoute allowedRoles={["employee"]}>
                <EmployeeDashboard/>
            </ProtectedRoute>
        ),
        children:[
            {
                index:true,
                element:<EmployeeHome/>
            },
            {
                path:"advance-request",
                element:<AdvanceRequestForm/>
            },
            {
                path:"my-requests",
                element:<MyRequests/>
            },
            {
                path:"advance-settlement",
                element:<EmployeeAdvanceSettlementPage/>
            },
            {
                path:"my-settelment-requests",
                element:<MySettlements/>
            }
        ]
    },

    // ****************************Line Manager*********************************
    {
        path:"/dashboard/line-manager",
        element:(
            <ProtectedRoute allowedRoles={["line-manager"]}>
                <LineManagerDashboard/>
            </ProtectedRoute>
        ),
        children:[
            {
                index:true,
                element:<LineManagerHome/>
            },
            {
                path:"advance-approval",
                element:<ManagerApproval/>
            },
            {
                path:"advance-settelment",
                element:<ExpenseRequestsPage/>
            }
        ]
    },
    // *******************************VP Operations***********************************
    {
        path:"/dashboard/vp-operations",
        element:(
            <ProtectedRoute allowedRoles={["vp-operations"]}>
                <VPDashboard/>
            </ProtectedRoute>
        ),
        children:[
            {
                index:true,
                element:<VPHome/>
            },
            {
                path:"vp-advance-approval",
                element:<VPApproval/>
            }
        ]
    },
    // ************************************Supervisor********************************************
    {
        path:"/dashboard/supervisor",
        element:(
            <ProtectedRoute allowedRoles={["supervisor"]}>
                <SupervisorDashboard/>
            </ProtectedRoute>
        ),
        children:[
            {
                index:true,
                element:<SupervisorHome/>
            },
            {
                path:"material-request-form",
                element:<MaterialRequestForm/>
            }
        ]
    },
    {
        path:"/dashboard/manager",
        element:(
            <ProtectedRoute allowedRoles={["manager"]}>
                <ManagerDashboard/>
            </ProtectedRoute>
        ),
        children:[
            {
                index:true,
                element:<ManagerHome/>
            },
            {
                path:"material-request-approval",
                element:<MaterialRequestApprovalTable/>
            }
        ]
    },
    {
        path:"/dashboard/ph",
        element:(
            <ProtectedRoute allowedRoles={["ph"]}>
                <PHDashboard/>
            </ProtectedRoute>
        ),
        children:[
            {
                index:true,
                element:<PHHome/>
            },
            {
                path:"material-approval-requests",
                element:<ProjectHeadApprovalTable/>
            },
            {
                path:"po-form",
                element:<PurchaseOrderForm/>
            },
            {
                path:"invoice-review",
                element:<PHInvoiceReview/>
            }
        ]
    },
    {
        path:"/dashboard/vendor",
        element:(
            <ProtectedRoute allowedRoles={["vendor"]}>
                <VendorDashboard/>
            </ProtectedRoute>
        ),
        children:[
            {
                index:true,
                element:<VendorHome/>
            },
            {
                path:"material-requests",
                element:<MaterialRequestTable/>
            },
            {
                path:"dc-form",
                element:<GenerateDCForm/>
           },
           {
            path:"my-dc",
            element:<VendorDCPage/>
             },
            {
                path:"dc-upload",
                element:<DCUpload/>
            },
            {
                path:"invoice-upload",
                element:<VendorInvoiceUpload/>
            },
            {
                path:"my-invoices",
                element:<MyInvoiceUpload/>
            },
            
        ]
    },
    // ****************************************AE************************************************************
    {
        path:"dashboard/ae",
        element:(
            <ProtectedRoute allowedRoles={["ae"]}>
                <AEDashboard/>
            </ProtectedRoute>
        ),
        children:[
            {
                index:true,
                element:<AEHome/>
            },
            {
                path:"invoice-review",
                element:<AEInvoiceReviewPage/>
            },
            {
                path:"invoice-purchase-entry/:id",
                element:<AEInvoiceApproval/>
            },
            {
                path:"vendor-creation",
                element:<VendorCreationForm/>
            },
            {
                path:"vendor-list",
                element:<VendorTable/>
            },
            {
                path:"process-payments",
                element:<ProcessPaymentPage/>
            },
            {
                path:"vendor-ledger",
                element:<VendorLedgerPage/>
            },
            {
                path:"auto-tds-booking",
                element:<ExpenseBookingPage/>
            },
            {
                path:"vendor-tax-mapping",
                element:<TDSMappingPage/>
            },
            {
                path:"vendor-ledger-page",
                element:<VendorLedgerPagee/>
            },
            {
                path:"income-tax-details",
                element:<IncomeTaxDetailsPage/>
            }
        ]
    }
])
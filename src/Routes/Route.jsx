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
import TDSMapping from "../Features/Process of Auto JV for TDS Booking/Pages/TDSMapping"
import StatutorySetup from "../Features/Process of Auto JV for TDS Booking/Pages/StatutorySetup"
import ExpenseBookingPage from "../Features/Process of Auto JV for TDS Booking/Pages/ExpenseBooking"
import VendorLedger from "../Features/Process of Auto JV for TDS Booking/Pages/VendorLedger"
import FixedAssetPOsTable from "../Features/Process for Fixed Assets/Pages/FixedAssetsPOsTable"
import PHInvoiceHistory from "../Features/PurchaseBookingHKMaterial/PHInvoiceHistory"
import FixedAssetEntryPage from "../Features/Process for Fixed Assets/Pages/FixedAssetEntryPage"
import ComplianceTeamDashboard from "../Roles/Compliance Team/Pages/ComplianceTeamDashboard"
import ComplianceTeamHome from "../Roles/Compliance Team/Components/ComplianceTeamHome"
import ComplianceEntryPage from "../Features/Payment Entry For Statutory Compliances/Pages/ComplianceEntryPage"
import ComplianceTeamSubmittedEntries from "../Features/Payment Entry For Statutory Compliances/Pages/ComplianceTeamSubmittedEntries"
import ComplianceManagerHome from "../Roles/Compliance Manager/Components/ComplianceManagerHome"
import ComplianceManagerDashboard from "../Roles/Compliance Manager/Pages/ComplianceManagerDashboard"
import ComplianceManagerApprovalPage from "../Features/Payment Entry For Statutory Compliances/Pages/ComplianceManagerAprovalPage"
import AEPendingCompliancePage from "../Features/Payment Entry For Statutory Compliances/Pages/AEPendingCompliancePage"
import AEPaidCompliancePage from "../Features/Payment Entry For Statutory Compliances/Pages/AEPaidCompliancePage"
import PayrollTeamDashboard from "../Roles/Payroll Team/Pages/PayrollTeamDashboard"
import PayrollTeamHome from "../Roles/Payroll Team/Components/PayrollTeamHome"
import PayrollPaymentEntryPage from "../Features/Payment Entry for Salaries/Pages/PayrollPaymentEntryPage"
import PayrollTeamSubmittedEntriesPage from "../Features/Payment Entry for Salaries/Components/PayrollTeamSubmittedEntriesPage"
import AEPendingRequestsPage from "../Features/Payment Entry for Salaries/Pages/AEPendingRequestPage"
import GeneratePOPage from "../Features/Expense Booking other than Uniform and Materials/Pages/GeneratePOPage"
import MyPOsList from "../Features/Expense Booking other than Uniform and Materials/Pages/MyPOList"
import VendorUploadInvoicePage from "../Features/Expense Booking other than Uniform and Materials/Pages/VendorUploadInvoicePage"
import VendorPOListPage from "../Features/Expense Booking other than Uniform and Materials/Pages/VendorPoListPage"
import VendorMyInvoicesPage from "../Features/Expense Booking other than Uniform and Materials/Pages/VendorMyInvoicePage"
import InvoiceVerificationPage from "../Features/Expense Booking other than Uniform and Materials/Pages/InvoiceVerificationPage"
import FinancialHeadDashboard from "../Roles/Financial Head/Pages/FinancialHeadDashboard"
import FinancialHeadHome from "../Roles/Financial Head/Components/FinancialHeadHome"
import FinancialHeadInvoiceApprovalPage from "../Features/Expense Booking other than Uniform and Materials/Pages/FinancialHeadInvoiceApprovalPage"


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
    // *************************************Manager********************************************
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
            },
            {
                path:"create-statutory-details",
                element:<StatutorySetup/>
            },
            {
                path:"generate-po",
                element:<GeneratePOPage/>
            },
            {
                path:"my-po",
                element:<MyPOsList/>
            },
            {
                path:"invoice-verification",
                element:<InvoiceVerificationPage/>
            }
        ]
    },
    // *************************************Project Head********************************************
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
            },
            {
                path:"invoice-history",
                element:<PHInvoiceHistory/>
            }
        ]
    },
    // *************************************Vendor********************************************
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
            {
                path:"fixed-assets-purchase-orders",
                element:<FixedAssetPOsTable/>
            },
            {
                path:"onetime-expense-professional-fees-po",
                element:<VendorPOListPage/>
            },
            {
                path:"onetime-expense-professional-fees-upload-invoice",
                element:<VendorUploadInvoicePage/>
            },
            {
                path:"my-invoice-page",
                element:<VendorMyInvoicesPage/>
            }
            
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
                path:"map-tds",
                element:<TDSMapping/>
            },
            {
                path:"expense-booking",
                element:<ExpenseBookingPage/>
            },
            {
                path:"vendor-ledger-page",
                element:<VendorLedger/>
            },
            {
                path:"fixed-asset-entry/:invoiceId",
                element:<FixedAssetEntryPage/>
            },
            {
                path:"pending-compliance-requests",
                element:<AEPendingCompliancePage/>
            },
            {
                path:"paid-compliance-page",
                element:<AEPaidCompliancePage/>
            },
            {
                path:"salaries-pending-approvals",
                element:<AEPendingRequestsPage/>
            }
        ]
    },

// *********************************************Compliance Team*********************************

    {
        path:"dashboard/compliance-team",
        element:(
            <ProtectedRoute allowedRoles={["compliance-team"]}>
                <ComplianceTeamDashboard/>
            </ProtectedRoute>
        ),
        children:[
                {
                    index:true,
                    element:<ComplianceTeamHome/>
                },
                {
                    path:"compliance-entry-form",
                    element:<ComplianceEntryPage/>
                },
                {
                    path:"submitted-entries",
                    element:<ComplianceTeamSubmittedEntries/>
                }
        ]

    },

    // *************************************Compliance Manager******************************************

     {
        path:"dashboard/compliance-manager",
        element:(
            <ProtectedRoute allowedRoles={["compliance-manager"]}>
                <ComplianceManagerDashboard/>
            </ProtectedRoute>
        ),
        children:[
                {
                    index:true,
                    element:<ComplianceManagerHome/>
                },
                {
                    path:"statutory-compliances-requests",
                    element:<ComplianceManagerApprovalPage/>
                }
               
        ]

    },
    // ******************************************Payroll Team***********************************************
    {
        path:"dashboard/payroll-team",
        element:(
            <ProtectedRoute allowedRoles={["payroll-team"]}>
                <PayrollTeamDashboard/>
            </ProtectedRoute>
        ),
        children:[
            {
                index:true,
                element:<PayrollTeamHome/>
            },
            {
                path:"payroll-payment-entry",
                element:<PayrollPaymentEntryPage/>
            },
            {
                path:"my-entries",
                element:<PayrollTeamSubmittedEntriesPage/>
            }
        ]
    },
    // ****************************************Financial Head*********************************************
    {
        path:"dashboard/financial-head",
        element:(
            <ProtectedRoute allowedRoles={["financial-head"]}>
                <FinancialHeadDashboard/>
            </ProtectedRoute>
        ),
        children:[
            {
                index:true,
                element:<FinancialHeadHome/>
            },
            {
                path:"invoice-approval",
                element:<FinancialHeadInvoiceApprovalPage/>
            }
        ]
    }
])
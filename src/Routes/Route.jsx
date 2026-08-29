import React, { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import AuthLayout from '../Auth/AuthLayout'
import Login from '../Auth/Pages/Login'
import ProtectedRoute from './ProtectedRoute'

// Component Loading Spinner Fallback for smooth route transitions
const PageLoader = () => (
  <div className="min-h-[400px] w-full flex items-center justify-center p-8 bg-gray-50/50">
    <div className="flex flex-col items-center space-y-3">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-emerald-600 border-t-transparent"></div>
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Loading Module...</span>
    </div>
  </div>
)

// Helper to load components lazily wrapped in Suspense
const load = (factory) => {
  const Component = lazy(factory)
  return (props) => (
    <Suspense fallback={<PageLoader />}>
      <Component {...props} />
    </Suspense>
  )
}

// ============== LAZY LOADED ROUTE COMPONENTS ==============
const EmployeeDashboard = load(() => import('../Roles/Employee/Pages/EmployeeDashboard'))
const EmployeeHome = load(() => import('../Roles/Employee/Components/EmployeeHome'))
const AdvanceRequestForm = load(() => import('../Features/Advance Request/AdvanceRequestForm'))
const LineManagerHome = load(() => import('../Roles/Line Manager/Components/LineManagerHome'))
const LineManagerDashboard = load(() => import('../Roles/Line Manager/Pages/LineManagerDashboard'))
const ManagerApproval = load(() => import('../Features/Advance Request/ManagerApproal'))
const VPDashboard = load(() => import('../Roles/VP Operations/Pages/VPDashboard'))
const VPHome = load(() => import('../Roles/VP Operations/Components/VPHome'))
const VPApproval = load(() => import('../Features/Advance Request/VPApproval'))
const EmployeeMyRequests = load(() => import('../Features/Advance Request/Pages/EmployeeMyRequests'))
const EmployeeAdvanceSettlementPage = load(() => import('../Features/Advance Settlement/Pages/EmployeeAdvanceSettlementPage'))
const ExpenseRequestsPage = load(() => import('../Features/Advance Settlement/Pages/ExpenseRequestsPage'))
const MySettlements = load(() => import('../Features/Advance Settlement/Components/MySettlements'))
const SupervisorDashboard = load(() => import('../Roles/Supervisor/Pages/SupervisorDashboard'))
const SupervisorHome = load(() => import('../Roles/Supervisor/Components/SupervisorHome'))
const MaterialRequestForm = load(() => import('../Features/PurchaseBookingHKMaterial/MaterialRequestsForm'))
const ManagerDashboard = load(() => import('../Roles/Manager/Pages/ManagerDashboard'))
const ManagerHome = load(() => import('../Roles/Manager/Components/ManagerHome'))
const MaterialRequestApprovalTable = load(() => import('../Features/PurchaseBookingHKMaterial/MaterialRequestApproval'))
const PHDashboard = load(() => import('../Roles/PH/Pages/PHDashboard'))
const PHHome = load(() => import('../Roles/PH/Components/PHHome'))
const ProjectHeadApprovalTable = load(() => import('../Features/PurchaseBookingHKMaterial/ProjectHeadApprovalTable'))
const PurchaseOrderForm = load(() => import('../Features/PurchaseBookingHKMaterial/POForm'))
const VendorDashboard = load(() => import('../Roles/Vendor/Pages/VendorDashboard'))
const VendorHome = load(() => import('../Roles/Vendor/Components/VendorHome'))
const MaterialRequestTable = load(() => import('../Features/PurchaseBookingHKMaterial/MaterialRequestTable'))
const GenerateDCForm = load(() => import('../Features/PurchaseBookingHKMaterial/GenerateDCForm'))
const VendorDCPage = load(() => import('../Features/PurchaseBookingHKMaterial/VendorDCPage'))
const DCUpload = load(() => import('../Features/PurchaseBookingHKMaterial/DCUpload'))
const VendorInvoiceUpload = load(() => import('../Features/PurchaseBookingHKMaterial/VendorInvoiceUpload'))
const MyInvoiceUpload = load(() => import('../Features/PurchaseBookingHKMaterial/MyInvoiceUpload'))
const PHInvoiceReview = load(() => import('../Features/PurchaseBookingHKMaterial/PHInvoiceReview'))
const AEDashboard = load(() => import('../Roles/AE/Pages/AEDashboard'))
const AEHome = load(() => import('../Roles/AE/Components/AEHome'))
const AEInvoiceReviewPage = load(() => import('../Features/PurchaseBookingHKMaterial/AEInvoiceReviewPage'))
const AEInvoiceApproval = load(() => import('../Features/PurchaseBookingHKMaterial/AEInvoiceApproval'))
const VendorCreationForm = load(() => import('../Features/Vendor Creation Process/VendorCreationForm'))
const VendorTable = load(() => import('../Features/Vendor Creation Process/VendorsTable'))
const ProcessPaymentPage = load(() => import('../Features/Process For Payments/ProcessPaymentPage'))
const TDSMapping = load(() => import('../Features/Process of Auto JV for TDS Booking/Pages/TDSMapping'))
const StatutorySetup = load(() => import('../Features/Process of Auto JV for TDS Booking/Pages/StatutorySetup'))
const ExpenseBookingPage = load(() => import('../Features/Process of Auto JV for TDS Booking/Pages/ExpenseBooking'))
const VendorLedger = load(() => import('../Features/Process of Auto JV for TDS Booking/Pages/VendorLedger'))
const FixedAssetPOsTable = load(() => import('../Features/Process for Fixed Assets/Pages/FixedAssetsPOsTable'))
const PHInvoiceHistory = load(() => import('../Features/PurchaseBookingHKMaterial/PHInvoiceHistory'))
const FixedAssetEntryPage = load(() => import('../Features/Process for Fixed Assets/Pages/FixedAssetEntryPage'))
const ComplianceTeamDashboard = load(() => import('../Roles/Compliance Team/Pages/ComplianceTeamDashboard'))
const ComplianceTeamHome = load(() => import('../Roles/Compliance Team/Components/ComplianceTeamHome'))
const ComplianceEntryPage = load(() => import('../Features/Payment Entry For Statutory Compliances/Pages/ComplianceEntryPage'))
const ComplianceTeamSubmittedEntries = load(() => import('../Features/Payment Entry For Statutory Compliances/Pages/ComplianceTeamSubmittedEntries'))
const ComplianceManagerHome = load(() => import('../Roles/Compliance Manager/Components/ComplianceManagerHome'))
const ComplianceManagerDashboard = load(() => import('../Roles/Compliance Manager/Pages/ComplianceManagerDashboard'))
const ComplianceManagerApprovalPage = load(() => import('../Features/Payment Entry For Statutory Compliances/Pages/ComplianceManagerAprovalPage'))
const AEPendingCompliancePage = load(() => import('../Features/Payment Entry For Statutory Compliances/Pages/AEPendingCompliancePage'))
const AEPaidCompliancePage = load(() => import('../Features/Payment Entry For Statutory Compliances/Pages/AEPaidCompliancePage'))
const PayrollTeamDashboard = load(() => import('../Roles/Payroll Team/Pages/PayrollTeamDashboard'))
const PayrollTeamHome = load(() => import('../Roles/Payroll Team/Components/PayrollTeamHome'))
const PayrollPaymentEntryPage = load(() => import('../Features/Payment Entry for Salaries/Pages/PayrollPaymentEntryPage'))
const PayrollTeamSubmittedEntriesPage = load(() => import('../Features/Payment Entry for Salaries/Components/PayrollTeamSubmittedEntriesPage'))
const AEPendingRequestsPage = load(() => import('../Features/Payment Entry for Salaries/Pages/AEPendingRequestPage'))
const GeneratePOPage = load(() => import('../Features/Expense Booking other than Uniform and Materials/Pages/GeneratePOPage'))
const MyPOsList = load(() => import('../Features/Expense Booking other than Uniform and Materials/Pages/MyPOList'))
const VendorUploadInvoicePage = load(() => import('../Features/Expense Booking other than Uniform and Materials/Pages/VendorUploadInvoicePage'))
const VendorPOListPage = load(() => import('../Features/Expense Booking other than Uniform and Materials/Pages/VendorPoListPage'))
const VendorMyInvoicesPage = load(() => import('../Features/Expense Booking other than Uniform and Materials/Pages/VendorMyInvoicePage'))
const InvoiceVerificationPage = load(() => import('../Features/Expense Booking other than Uniform and Materials/Pages/InvoiceVerificationPage'))
const FinancialHeadDashboard = load(() => import('../Roles/Financial Head/Pages/FinancialHeadDashboard'))
const FinancialHeadHome = load(() => import('../Roles/Financial Head/Components/FinancialHeadHome'))
const FinancialHeadInvoiceApprovalPage = load(() => import('../Features/Expense Booking other than Uniform and Materials/Pages/FinancialHeadInvoiceApprovalPage'))
const SubmitConveyancePage = load(() => import('../Features/Process For Conveyance Booking/Pages/SubmitConveyancePage'))
const MyConveyanceRequestsPage = load(() => import('../Features/Process For Conveyance Booking/Pages/MyConveyanceRequestPage'))
const ManagerConveyanceApprovalsPage = load(() => import('../Features/Process For Conveyance Booking/Pages/ConveyanceApprovalPage'))
const LinemanagerConveyanceFormPage = load(() => import('../Features/Process For Conveyance Booking/Pages/LineManagerConveyanceFormPage'))
const VPOperationsConveyanceApprovalPage = load(() => import('../Features/Process For Conveyance Booking/Pages/VPOperationsConveyanceApprovalPage'))
const VPConveyanceFormPage = load(() => import('../Features/Process For Conveyance Booking/Pages/VPConveyanceFormPage'))
const AEConveyanceApprovalPage = load(() => import('../Features/Process For Conveyance Booking/Pages/AEConveyanceApprovalPage'))
const AVPConveyanceApprovalPage = load(() => import('../Features/Process For Conveyance Booking/Pages/AVPConveyanceApprovalPage'))
const PHRequestApprovalPage = load(() => import('../Features/Process For Prepaid Entry/Pages/PH/PHRequestsAprovalPage'))
const POForm = load(() => import('../Features/Process For Prepaid Entry/Pages/PH/POForm'))
const PHGeneratePOPage = load(() => import('../Features/Process For Prepaid Entry/Pages/PH/PhGeneratePOPage'))
const InvoiceUploadForm = load(() => import('../Features/Process For Prepaid Entry/Pages/Vendor/InvoiceUploadForm'))
const VendorRequestsPage = load(() => import('../Features/Process For Prepaid Entry/Pages/Vendor/VendorRequestsPage'))
const VendorGenerateDCPage = load(() => import('../Features/Process For Prepaid Entry/Pages/Vendor/VendorGenerateDCPage'))
const DCPreviewPage = load(() => import('../Features/Process For Prepaid Entry/Pages/Vendor/DCPreviewPage'))
const POSummary = load(() => import('../Features/Process For Prepaid Entry/Pages/PH/PoSummery'))
const PInvoiceUploadForm = load(() => import('../Features/Process For Prepaid Entry/Pages/Vendor/InvoiceUploadForm'))
const VendorInvoiceForm = load(() => import('../Features/Process For Prepaid Entry/Components/VendorInvoiceForm'))
const VendorInvoicePage = load(() => import('../Features/Process For Prepaid Entry/Pages/Vendor/VendorInvoicePage'))
const VendorInvoicePreviewPage = load(() => import('../Features/Process For Prepaid Entry/Pages/Vendor/VendorInvoicePreviewPage'))
const MyInvoicesPage = load(() => import('../Features/Process For Prepaid Entry/Pages/Vendor/MyInvoiceTable'))
const PHInvoiceApprovalPage = load(() => import('../Features/Process For Prepaid Entry/Pages/PH/PHInvoiceApprovalPage'))
const BillingManagerHome = load(() => import('../Roles/Billing Manager/Components/BillingManagerHome'))
const BillngManagerDashboard = load(() => import('../Roles/Billing Manager/Pages/BillingManagerDashboard'))
const BillingManagerApprovalPage = load(() => import('../Features/Process For Prepaid Entry/Pages/Billing Manager/BillingMnagerApprovalPage'))

// ============== BILLING MODULE IMPORTS ==============
const BillingLayout = load(() => import('../Features/Billing/Components/BillingLayout'))
const BillingDashboard = load(() => import('../Features/Billing/Pages/BillingDashboard'))
const AutoBillingWizard = load(() => import('../Features/Billing/Pages/AutoBilling/AutoBillingWizard'))
const ProformaInvoices = load(() => import('../Features/Billing/Pages/ProformaInvoices'))
const ManualBilling = load(() => import('../Features/Billing/Pages/ManualBilling/ManualBilling'))
const RateCardPage = load(() => import('../Features/Billing/Pages/RateCardPage'))
const ArrearBillingPage = load(() => import('../Features/Billing/Pages/ArrearBillingPage'))
const ArrearBillingForm = load(() => import('../Features/Billing/Pages/ArrearBillingForm'))
const ArrearBillingInvoicePreview = load(() => import('../Features/Billing/Pages/ArrearBillingInvoicePreview'))
const BonusLeaveEncashmentList = load(() => import('../Features/Billing/Bonus Leave Encashment/Pages/BonusLeaveEncashmentList'))
const BonusLeaveEncashmentForm = load(() => import('../Features/Billing/Bonus Leave Encashment/Pages/BonusLeaveEncashmentForm'))
const BonusLeaveEncashmentCalculation = load(() => import('../Features/Billing/Bonus Leave Encashment/Pages/BonusLeaveEncashmentCalculation'))
const BonusLeaveEncashmentInvoicePreview = load(() => import('../Features/Billing/Bonus Leave Encashment/Pages/BonusLeaveEncashmentInvoicePreview'))
const IRNInvoices = load(() => import('../Features/Billing/Pages/IRNInvoices'))

const InvoiceListPage = () => <div className="p-6">Invoice List - Coming Soon</div>

const UploadStatementPage = load(() => import('../Features/Process For Bank Reconcilation/Pages/UploadStatementPage'))
const ReconciliationHistoryPage = load(() => import('../Features/Process For Bank Reconcilation/Pages/ReconcilationHistoryPage'))
const ViewReconciliationReportPage = load(() => import('../Features/Process For Bank Reconcilation/Pages/ViewReconciliationReportPage'))
const RentExpenseBookingPage = load(() => import('../Features/Process For Rent Expense Booking/Pages/RentExpenseBookingPage'))
const OperationExecutiveDashboard = load(() => import('../Roles/Operation Executive/Pages/OperationExecutiveDashboard'))
const OperationExecutiveHome = load(() => import('../Roles/Operation Executive/Components/OperationExecutiveHome'))
const OperationExecutiveReliverPage = load(() => import('../Features/Process For Reliver Payments/Pages/OperationExecutiveReliverPage'))
const OperationExecutiveMyRequestsPage = load(() => import('../Features/Process For Reliver Payments/Pages/OperationExecutiveMyRequestsPage'))
const LineManagerRelieverApprovalPage = load(() => import('../Features/Process For Reliver Payments/Pages/LineManagerRelieverApprovalPage'))
const AVPRelieverApprovalPage = load(() => import('../Features/Process For Reliver Payments/Pages/AVPRelieverApprovalPage'))
const VPRelieverApprovalPage = load(() => import('../Features/Process For Reliver Payments/Pages/VPRelieverApprovalPage'))
const AERelieverApprovalPage = load(() => import('../Features/Process For Reliver Payments/Pages/AERelieverApprovalPage'))
const GSTR2BRecoPage = load(() => import('../Features/Process for GSTR2B Reconciliation Process/Pages/GSTR2BReco'))
const GSTR2BRecoHistoryPage = load(() => import('../Features/Process for GSTR2B Reconciliation Process/Pages/GSTR2BHistory'))
const GSTR2BRecoReportPage = load(() => import('../Features/Process for GSTR2B Reconciliation Process/Pages/GSTR2BRecoReportPage'))
const ReconciliationStatement = load(() => import('../Features/Process For Bank Reconcilation/Components/ReconciliationStatement'))
const ReconciliationStatementPage = load(() => import('../Features/Process For Bank Reconcilation/Pages/ReconciliationStatementPage'))
const AttendanceUpload = load(() => import('../Features/Billing/ATTENDANCE VERIFICATION AND STARTING PROCESS/Components/AttendenceUpload'))
const AttendanceUploadPage = load(() => import('../Features/Billing/ATTENDANCE VERIFICATION AND STARTING PROCESS/Pages/AttendenceuploadPage'))
const MyUploadedAttendance = load(() => import('../Features/Billing/ATTENDANCE VERIFICATION AND STARTING PROCESS/Pages/MyUploadAttendence'))
const AttendencePayrollDashboard = load(() => import('../Features/Billing/ATTENDANCE VERIFICATION AND STARTING PROCESS/Pages/AttendencePayrollDashboard'))
const AttendancePunchingList = load(() => import('../Features/Billing/ATTENDANCE VERIFICATION AND STARTING PROCESS/Pages/AttendencePunchingList'))
const AttendanceDetails = load(() => import('../Features/Billing/ATTENDANCE VERIFICATION AND STARTING PROCESS/Pages/AttendenceDetails'))
const ManagerAdvanceRequest = load(() => import('../Features/Advance Request/Pages/ManagerAdvanceRequest'))
const ManagerMyRequests = load(() => import('../Features/Advance Request/Pages/ManagerMyRequests'))
const VPAdvanceRequestForm = load(() => import('../Features/Advance Request/Pages/VPAdvanceRequestForm'))
const VPMyRequest = load(() => import('../Features/Advance Request/Pages/VPMyRequest'))
const AEAdvanceApprovalPage = load(() => import('../Features/Advance Request/Pages/AEAdvanceApprovalPage'))
const VPReview = load(() => import('../Features/Advance Settlement/Pages/VPReview'))
const AEAdvanceSettlementApproval = load(() => import('../Features/Advance Settlement/Pages/AEAdvanaceSettlementApprovalPage'))
const AMAdvanceSettlementApproval = load(() => import('../Features/Advance Settlement/Pages/AMAdvanceSettlementApprovalPage'))
const LineManagerAdvanceSettlementForm = load(() => import('../Features/Advance Settlement/Pages/LineManagerAdvanceSettlementForm'))
const VPAdvanceSettlementForm = load(() => import('../Features/Advance Settlement/Pages/VPAdvanceSettlementForm'))
const ManagerAdvanceSettlementForm = load(() => import('../Features/Advance Settlement/Pages/ManagerAdvanceSettlementForm'))
const ComplianceTeamAdvanceSettlementForm = load(() => import('../Features/Advance Settlement/Pages/ComplianceTeamAdvanceSettlementForm'))
const ComplianceManagerAdvanceSettlementForm = load(() => import('../Features/Advance Settlement/Pages/ComplianceManagerAdvanceSettlementForm'))
const OperationExecutiveAdvanceSettlementForm = load(() => import('../Features/Advance Settlement/Pages/OperationExecutiveAdvanceSettlementForm'))
const AVPExpenseRequestsPage = load(() => import('../Features/Advance Settlement/Pages/AVPExpenseRequestsPage'))
const AVPAdvanceSettlementForm = load(() => import('../Features/Advance Settlement/Pages/AVPAdvanceSettlementForm'))
const ManagerAdvanceRequestForm = load(() => import('../Features/Advance Request/Pages/ManagerAdvanceRequestForm'))
const LineManagerMyRequests = load(() => import('../Features/Advance Request/Pages/LineManagerMyRequests'))
const ComplianceTeamAdvanceRequestForm = load(() => import('../Features/Advance Request/Pages/ComplainceTeamAdvanceRequestForm'))
const ComplianceTeamMyRequests = load(() => import('../Features/Advance Request/Pages/ComplianceTeamMyRequests'))
const ComplianceManagerAdvanceRequestForm = load(() => import('../Features/Advance Request/Pages/ComplainceManagerAdvanceRquestForm'))
const ComplianceManagerMyRequests = load(() => import('../Features/Advance Request/Pages/ComplianceManagerMyRequests'))
const PayrollTeamAdvanceRequestForm = load(() => import('../Features/Advance Request/Pages/PayrollTeamAdvanceRequestform'))
const PayrollTeamMyRequests = load(() => import('../Features/Advance Request/Pages/PayrollTeamMyRequests'))
const OperationExecutiveAdvanceRequestForm = load(() => import('../Features/Advance Request/Pages/OperationExecutiveAdvanceRequestForm'))
const OperationExecutiveMyRequests = load(() => import('../Features/Advance Request/Pages/OperationExecutiveMyRequests'))
const OperationExecutiveMyAdvanceRequests = load(() => import('../Features/Advance Request/Pages/OperationExecutiveMyRequests'))
const AccountManagerDashboard = load(() => import('../Roles/Account Manager/Pages/AccountManagerDashboard'))
const AccountManagerHome = load(() => import('../Roles/Account Manager/Components/AccountManagerHome'))

const ReportsDashboard = load(() => import('../Features/Reports/Pages/ReportsDashboard'))
const PLReportPage = load(() => import('../Features/Reports/ProfitAndLossReports/Pages/PLReportPage'))
const TDS26ASRecoPage = load(() => import('../Features/Reports/26 AS Reco/Pages/TDS26ASRecoPage'))
const AMInvoiceReviewPage = load(() => import('../Features/PurchaseBookingHKMaterial/Account Manager/AccountManagerInvoiceReviewPage'))
const AMInvoiceApproval = load(() => import('../Features/PurchaseBookingHKMaterial/Account Manager/AccountManagerPurchaseEntryPage'))
const AMFixedAssetEntryPage = load(() => import('../Features/PurchaseBookingHKMaterial/Account Manager/AccountManagerFixedAssetEntryPage'))
const ChartOfAccountsDashboard = load(() => import('../Features/Master/Pages/ChartOfAccountsDashboard'))
const ClientLedgerPage = load(() => import('../Features/Master/Billing Masters/Client Ledgers/Pages/ClientLedgerPage'))
const HouseKeepingRevenueLedgerPage = load(() => import('../Features/Master/Billing Masters/Revenue Ledger/Pages/HouseKeepingRevenueLedgerPage'))
const HouseKeepingExemptRevenueLedgerPage = load(() => import('../Features/Master/Billing Masters/Revenue Ledger/Pages/HouseKeepingExemptRevenueLedgerPage'))
const ServiceChargesRevenueLedgerPage = load(() => import('../Features/Master/Billing Masters/Revenue Ledger/Pages/ServiceChargesRevenueLedgerPage'))
const OverseasConsultancyRevenueLedgerPage = load(() => import('../Features/Master/Billing Masters/Revenue Ledger/Pages/OverseasConsultancyRevenueLedgerPage'))
const HKMaterialRevenueLedgerPage = load(() => import('../Features/Master/Billing Masters/Revenue Ledger/Pages/HKMaterialRevenueLedgerPage'))
const CleaningConsumableRevenueLedgerPage = load(() => import('../Features/Master/Billing Masters/Revenue Ledger/Pages/CleaningConsumableRevenueLedgerPage'))
const DeepCleaningRevenueLedgerPage = load(() => import('../Features/Master/Billing Masters/Revenue Ledger/Pages/DeepCleaningRevenueLedgerPage'))
const RentOnMachineryRevenueLedgerPage = load(() => import('../Features/Master/Billing Masters/Revenue Ledger/Pages/RentOnMachineryRevenueLedgerPage'))
const ManpowerServicesRevenueLedgerPage = load(() => import('../Features/Master/Billing Masters/Revenue Ledger/Pages/ManpowerServicesRevenueLedgerPage'))
const PestControlRevenueLedgerPage = load(() => import('../Features/Master/Billing Masters/Revenue Ledger/Pages/PestControlRevenueLedgerPage'))
const RoundOffRevenueLedgerPage = load(() => import('../Features/Master/Billing Masters/Revenue Ledger/Pages/RoundOffRevenueLedgerPage'))
const EmployeeLedgerPage = load(() => import('../Features/Master/EmployeeAdvanceAndSettlement/Pages/EmployeeLedgerPage'))
const ProcessOfPaymentVendorPage = load(() => import('../Features/Master/Process Of Payments/Pages/ProcessOfPaymentVendorPage'))
const TDSLedgerPage = load(() => import('../Features/Master/Auto JV for TDS Booking/Pages/TDSLedgerPage'))
const BankLedgerPage = load(() => import('../Features/Master/Bank Ledger/Pages/BankLedgerPage'))
const TravelExpenseLedgerPage = load(() => import('../Features/Master/EmployeeAdvanceAndSettlement/Expense Heads/Travel Expense/Pages/TravelExpenseLedgerPage'))
const FoodRefreshmentLedgerPage = load(() => import('../Features/Master/EmployeeAdvanceAndSettlement/Expense Heads/FoodsAndRefreshments/Pages/FoodRefreshmentLedgerPage'))
const OfficeSuppliesLedgerPage = load(() => import('../Features/Master/EmployeeAdvanceAndSettlement/Expense Heads/Office Supplies/Pages/OfficeSuppliesLedgerPage'))
const ConveyancePayblePage = load(() => import('../Features/Master/Conveyance/Pages/ConveyancePayblePage'))
const ConveyanceExpenseLedgerPage = load(() => import('../Features/Master/Conveyance/Pages/ConveyanceExpenseLedgerPage'))
const RelieverPaymentPage = load(() => import('../Features/Master/Reliever/Pages/RelieverPaymentPage'))
const RelieverLiabilityLedgerPage = load(() => import('../Features/Master/Reliever/Pages/RelieverLiabilityLedgerPage'))
const RentExpenseBookingLedgerPage = load(() => import('../Features/Master/Rent Expense/Pages/RentExpenseBookingLedgerPage'))
const GSTLedgersPage = load(() => import('../Features/Master/GST/Pages/GSTLedgerPage'))
const CGSTInputLedgerPage = load(() => import('../Features/Master/GST/Pages/CGSTInputLedgerPage'))
const SGSTInputLedgerPage = load(() => import('../Features/Master/GST/Pages/SGSTInputLedgerPage'))
const IGSTInputLedgerPage = load(() => import('../Features/Master/GST/Pages/IGSTInputLedgerPage'))
const RentVendorLedgerPage = load(() => import('../Features/Master/Rent Vendor/Pages/RentVendorLedgerPage'))
const HKVendorLedgerPage = load(() => import('../Features/Master/Process For HK Material/Pages/HKVendorLedgerPage'))
const FixedAssetLedgerPage = load(() => import('../Features/Master/Process for Fixed Assets/Pages/FixedAssetLedgerPage'))
const FAVendorLedgerPage = load(() => import('../Features/Master/Process for Fixed Assets/Pages/FAVendorLedgerPage'))
const UniformPrepaidExpenseLedger = load(() => import('../Features/Master/Process of Prepaid/Pages/UniformPrepaidExpenseLedgerPage'))
const UniformExpenseLedgerPage = load(() => import('../Features/Master/Process of Prepaid/Pages/UniformExpenseLedgerPage'))
const PrepaidUniformVendorLedgerPage = load(() => import('../Features/Master/Process of Prepaid/Pages/PrepaidUniformVendorLedgerPage'))
const UnifiedVendorLedgerPage = load(() => import('../Features/Master/Pages/UnifiedVendorLedgerPage'))
const HKMaterialsExpenseLedgerPage = load(() => import('../Features/Master/Components/HKMaterialExpenseLedgerPage'))
const TdsLedgerPage = load(() => import('../Features/Master/TDSLedger/Page/TDSLedgerPage'))
const GenericExpenseLedger = load(() => import('../Features/Master/Professional Fes and Other Fees Ledger/Pages/GenericLedgerPage'))
const SalaryWagesLedgerPage = load(() => import('../Features/Master/Payment Entry For Salaries/Expense/Pages/SalaryWagesLedger'))
const SalaryPayableLedger = load(() => import('../Features/Master/Payment Entry For Salaries/Liability/Pages/SalaryPaybleLedger'))
const PFContributionLedgerPage = load(() => import('../Features/Master/Payment Entry For Salaries/Expense/Pages/PFContributionLedgerPage'))
const PFPayableLedgerPage = load(() => import('../Features/Master/Payment Entry For Salaries/Liability/Pages/PFPayableLedgerPage'))
const ESICContributionLedgerPage = load(() => import('../Features/Master/Payment Entry For Salaries/Expense/Pages/ESICContributionLedgerPage'))
const ESICPayableLedgerPage = load(() => import('../Features/Master/Payment Entry For Salaries/Liability/Pages/ESICPayableLedgerPage'))
const LWFContributionLedgerPage = load(() => import('../Features/Master/Payment Entry For Salaries/Expense/Pages/LWFContributionLedgerPage'))
const LWFPayableLedgerPage = load(() => import('../Features/Master/Payment Entry For Salaries/Liability/Pages/LWFPayableLedgerPage'))
const LeaveProvisionExpenseLedgerPage = load(() => import('../Features/Master/Payment Entry For Salaries/Expense/Pages/LeaveProvisionExpenseLedgerPage'))
const LeaveEncashmentProvisionLedgerPage = load(() => import('../Features/Master/Payment Entry For Salaries/Liability/Pages/LeaveEncashmentProvisionLedger'))
const OtherDeductionsLedgerPage = load(() => import('../Features/Master/Payment Entry For Salaries/Expense/Pages/OtherDeductionsLedgerPage'))
const EmployeePFPayableLedgerPage = load(() => import('../Features/Master/Payment Entry For Salaries/Liability/Pages/EmployeePFPayableLedgerPage'))
const EmployeeESICPayableLedgerPage = load(() => import('../Features/Master/Payment Entry For Salaries/Liability/Pages/EmployeeESICPayableLedgerPage'))
const EmployeeLWFPayableLedgerPage = load(() => import('../Features/Master/Payment Entry For Salaries/Liability/Pages/EmployeeLWFPayableLedgerPage'))
const ProfessionalTaxPayableLedgerPage = load(() => import('../Features/Master/Payment Entry For Salaries/Liability/Pages/ProfessionalTaxPayableLedgerPage'))
const BonusProvisionExpenseLedgerPage = load(() => import('../Features/Master/Payment Entry For Salaries/Expense/Pages/BonusProvisionExpenseLedgerPage'))
const BonusExpenseLedgerPage = load(() => import('../Features/Master/Payment Entry For Salaries/Expense/Pages/BonusProvisionExpenseLedgerPage'))
const TDSReceivableAssetLedgerPage = load(() => import('../Features/Master/TDS Receivable/Pages/TDSReceivableLedgerPage'))
const AVPAdvanceRequestForm = load(() => import('../Features/Advance Request/Pages/AVPAdvanceRequestForm'))
const AVPMyAdvanceRequests = load(() => import('../Features/Advance Request/Pages/AVPMyAdvanceRequests'))
const AVPAdvanceRequestApproval = load(() => import('../Features/Advance Request/AVPAdvanceRequestApproval'))

// ============== BILLING LEDGERS (11 Ledgers) ==============
const HKChargesLedgerPage = load(() => import('../Features/Billing/Ledgers').then(m => ({ default: m.HKChargesLedgerPage })))
const ManpowerLedgerPage = load(() => import('../Features/Billing/Ledgers').then(m => ({ default: m.ManpowerLedgerPage })))
const HKMaterialLedgerPage = load(() => import('../Features/Billing/Ledgers').then(m => ({ default: m.HKMaterialLedgerPage })))
const MachineryRentLedgerPage = load(() => import('../Features/Billing/Ledgers').then(m => ({ default: m.MachineryRentLedgerPage })))
const CGSTLedgerPage = load(() => import('../Features/Billing/Ledgers').then(m => ({ default: m.CGSTLedgerPage })))
const SGSTLedgerPage = load(() => import('../Features/Billing/Ledgers').then(m => ({ default: m.SGSTLedgerPage })))
const IGSTLedgerPage = load(() => import('../Features/Billing/Ledgers').then(m => ({ default: m.IGSTLedgerPage })))
const TDSPayableLedgerPage = load(() => import('../Features/Billing/Ledgers').then(m => ({ default: m.TDSPayableLedgerPage })))
const TDSReceivableLedgerPage = load(() => import('../Features/Billing/Ledgers').then(m => ({ default: m.TDSReceivableLedgerPage })))
const ServiceTaxLedgerPage = load(() => import('../Features/Billing/Ledgers').then(m => ({ default: m.ServiceTaxLedgerPage })))
const RoundOffLedgerPage = load(() => import('../Features/Billing/Ledgers').then(m => ({ default: m.RoundOffLedgerPage })))

const AVPDashboard = load(() => import('../Roles/AVP Opearations/Pages/AVPDashboard'))
const AVPHome = load(() => import('../Roles/AVP Opearations/Components/AVPHome'))

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/login',
    element: (
      <AuthLayout>
        <Login />
      </AuthLayout>
    ),
    errorElement: <h1>Page Not Found!</h1>,
  },
  // ***********************************Employee***************************************************************
  {
    path: '/dashboard/employee',
    element: (
      <ProtectedRoute allowedRoles={['employee', 'operation-executive', 'operation-manager', 'supervisor']}>
        <EmployeeDashboard />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <EmployeeHome />,
      },
      {
        path: 'advance-request',
        element: <AdvanceRequestForm />,
      },
      {
        path: 'my-requests',
        element: <EmployeeMyRequests />,
      },
      {
        path: 'advance-settlement',
        element: <EmployeeAdvanceSettlementPage />,
      },
      {
        path: 'my-settelment-requests',
        element: <MySettlements />,
      },
      {
        path: 'conveyance-form',
        element: <SubmitConveyancePage />,
      },
      {
        path: 'my-conveyance-requests',
        element: <MyConveyanceRequestsPage />,
      },
      {
        path: 'reliver-form',
        element: <OperationExecutiveReliverPage />,
      },
      {
        path: 'reliever-form',
        element: <OperationExecutiveReliverPage />,
      },
      {
        path: 'my-reliver-requests',
        element: <OperationExecutiveMyRequestsPage />,
      },
      {
        path: 'my-reliever-requests',
        element: <OperationExecutiveMyRequestsPage />,
      },
    ],
  },

  // ****************************Line Manager & Regional Head*********************************
  {
    path: '/dashboard/line-manager',
    element: (
      <ProtectedRoute allowedRoles={['line-manager', 'manager', 'operation-manager', 'regional-head']}>
        <LineManagerDashboard />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <LineManagerHome />,
      },
      {
        path: 'manager-approval',
        element: <ManagerApproval />,
      },
      {
        path: 'advance-approval',
        element: <ManagerApproval />,
      },
      {
        path: 'advance-request',
        element: <AdvanceRequestForm />,
      },
      {
        path: 'my-requests',
        element: <LineManagerMyRequests />,
      },
      {
        path: 'advance-settlement',
        element: <LineManagerAdvanceSettlementForm />,
      },
      {
        path: 'submit-advance-settlement',
        element: <LineManagerAdvanceSettlementForm />,
      },
      {
        path: 'advance-settelment',
        element: <ExpenseRequestsPage />,
      },
      {
        path: 'my-settelment-requests',
        element: <ExpenseRequestsPage />,
      },
      {
        path: 'conveyance-approval',
        element: <ManagerConveyanceApprovalsPage />,
      },
      {
        path: 'conveyance-form',
        element: <LinemanagerConveyanceFormPage />,
      },
      {
        path: 'my-conveyance-requests',
        element: <MyConveyanceRequestsPage />,
      },
      {
        path: 'reliver-approval',
        element: <LineManagerRelieverApprovalPage />,
      },
      {
        path: 'reliever-approval',
        element: <LineManagerRelieverApprovalPage />,
      },
      {
        path: 'line-manager-reliever-approval',
        element: <LineManagerRelieverApprovalPage />,
      },
      {
        path: 'reliver-form',
        element: <OperationExecutiveReliverPage />,
      },
      {
        path: 'reliever-form',
        element: <OperationExecutiveReliverPage />,
      },
      {
        path: 'my-reliver-requests',
        element: <OperationExecutiveMyRequestsPage />,
      },
      {
        path: 'my-reliever-requests',
        element: <OperationExecutiveMyRequestsPage />,
      },
    ],
  },
  {
    path: '/dashboard/regional-head',
    element: (
      <ProtectedRoute allowedRoles={['regional-head', 'line-manager', 'manager', 'operation-manager']}>
        <LineManagerDashboard />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <LineManagerHome />,
      },
      {
        path: 'manager-approval',
        element: <ManagerApproval />,
      },
      {
        path: 'advance-approval',
        element: <ManagerApproval />,
      },
      {
        path: 'advance-request',
        element: <AdvanceRequestForm />,
      },
      {
        path: 'my-requests',
        element: <LineManagerMyRequests />,
      },
      {
        path: 'advance-settlement',
        element: <LineManagerAdvanceSettlementForm />,
      },
      {
        path: 'submit-advance-settlement',
        element: <LineManagerAdvanceSettlementForm />,
      },
      {
        path: 'advance-settelment',
        element: <ExpenseRequestsPage />,
      },
      {
        path: 'my-settelment-requests',
        element: <ExpenseRequestsPage />,
      },
      {
        path: 'conveyance-approval',
        element: <ManagerConveyanceApprovalsPage />,
      },
      {
        path: 'conveyance-form',
        element: <LinemanagerConveyanceFormPage />,
      },
      {
        path: 'my-conveyance-requests',
        element: <MyConveyanceRequestsPage />,
      },
      {
        path: 'reliver-approval',
        element: <LineManagerRelieverApprovalPage />,
      },
      {
        path: 'reliever-approval',
        element: <LineManagerRelieverApprovalPage />,
      },
      {
        path: 'line-manager-reliever-approval',
        element: <LineManagerRelieverApprovalPage />,
      },
      {
        path: 'reliver-form',
        element: <OperationExecutiveReliverPage />,
      },
      {
        path: 'reliever-form',
        element: <OperationExecutiveReliverPage />,
      },
      {
        path: 'my-reliver-requests',
        element: <OperationExecutiveMyRequestsPage />,
      },
      {
        path: 'my-reliever-requests',
        element: <OperationExecutiveMyRequestsPage />,
      },
    ],
  },

  // ****************************VP Operations*********************************
  {
    path: '/dashboard/vp-operations',
    element: (
      <ProtectedRoute allowedRoles={['vp-operations', 'vp', 'operation-head']}>
        <VPDashboard />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <VPHome />,
      },
      {
        path: 'vp-approval',
        element: <VPApproval />,
      },
      {
        path: 'vp-advance-approval',
        element: <VPApproval />,
      },
      {
        path: 'advance-approval',
        element: <VPApproval />,
      },
      {
        path: 'advance-request',
        element: <VPAdvanceRequestForm />,
      },
      {
        path: 'my-requests',
        element: <VPMyRequest />,
      },
      {
        path: 'advance-settlement-approval',
        element: <VPReview />,
      },
      {
        path: 'advance-settelment',
        element: <VPReview />,
      },
      {
        path: 'advance-settlement',
        element: <VPAdvanceSettlementForm />,
      },
      {
        path: 'submit-advance-settlement',
        element: <VPAdvanceSettlementForm />,
      },
      {
        path: 'my-settelment-requests',
        element: <ExpenseRequestsPage />,
      },
      {
        path: 'conveyance-approval',
        element: <VPOperationsConveyanceApprovalPage />,
      },
      {
        path: 'vp-conveyance-approval',
        element: <VPOperationsConveyanceApprovalPage />,
      },
      {
        path: 'conveyance-form',
        element: <VPConveyanceFormPage />,
      },
      {
        path: 'my-conveyance-requests',
        element: <MyConveyanceRequestsPage />,
      },
      {
        path: 'reliver-approval',
        element: <VPRelieverApprovalPage />,
      },
      {
        path: 'reliever-approval',
        element: <VPRelieverApprovalPage />,
      },
      {
        path: 'reliever-approval-vp-operation-page',
        element: <VPRelieverApprovalPage />,
      },
      {
        path: 'reliver-form',
        element: <OperationExecutiveReliverPage />,
      },
      {
        path: 'reliever-form',
        element: <OperationExecutiveReliverPage />,
      },
      {
        path: 'my-reliver-requests',
        element: <OperationExecutiveMyRequestsPage />,
      },
      {
        path: 'my-reliever-requests',
        element: <OperationExecutiveMyRequestsPage />,
      },
    ],
  },

  // ****************************AVP Operations*********************************
  {
    path: '/dashboard/avp-operations',
    element: (
      <ProtectedRoute allowedRoles={['avp-operations', 'avp']}>
        <AVPDashboard />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <AVPHome />,
      },
      {
        path: 'avp-approval',
        element: <AVPAdvanceRequestApproval />,
      },
      {
        path: 'advance-approval',
        element: <AVPAdvanceRequestApproval />,
      },
      {
        path: 'advance-request',
        element: <AVPAdvanceRequestForm />,
      },
      {
        path: 'my-requests',
        element: <AVPMyAdvanceRequests />,
      },
      {
        path: 'advance-settlement-approval',
        element: <AVPExpenseRequestsPage />,
      },
      {
        path: 'advance-settelment',
        element: <AVPExpenseRequestsPage />,
      },
      {
        path: 'advance-settlement',
        element: <AVPAdvanceSettlementForm />,
      },
      {
        path: 'submit-advance-settlement',
        element: <AVPAdvanceSettlementForm />,
      },
      {
        path: 'my-settelment-requests',
        element: <ExpenseRequestsPage />,
      },
      {
        path: 'conveyance-approval',
        element: <AVPConveyanceApprovalPage />,
      },
      {
        path: 'conveyance-form',
        element: <VPConveyanceFormPage />,
      },
      {
        path: 'my-conveyance-requests',
        element: <MyConveyanceRequestsPage />,
      },
      {
        path: 'reliver-approval',
        element: <AVPRelieverApprovalPage />,
      },
      {
        path: 'reliever-approval',
        element: <AVPRelieverApprovalPage />,
      },
      {
        path: 'avp-reliever-approval',
        element: <AVPRelieverApprovalPage />,
      },
      {
        path: 'reliver-form',
        element: <OperationExecutiveReliverPage />,
      },
      {
        path: 'reliever-form',
        element: <OperationExecutiveReliverPage />,
      },
      {
        path: 'my-reliver-requests',
        element: <OperationExecutiveMyRequestsPage />,
      },
      {
        path: 'my-reliever-requests',
        element: <OperationExecutiveMyRequestsPage />,
      },
    ],
  },

  // ****************************Supervisor*********************************
  {
    path: '/dashboard/supervisor',
    element: (
      <ProtectedRoute allowedRoles={['supervisor', 'site-supervisor']}>
        <SupervisorDashboard />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <SupervisorHome />,
      },
      {
        path: 'material-request',
        element: <MaterialRequestForm />,
      },
      {
        path: 'material-request-form',
        element: <MaterialRequestForm />,
      },
      {
        path: 'my-requests',
        element: <MaterialRequestTable />,
      },
      {
        path: 'dc-upload',
        element: <DCUpload />,
      },
      {
        path: 'my-invoices',
        element: <MyInvoiceUpload />,
      },
      {
        path: 'advance-request',
        element: <AdvanceRequestForm />,
      },
      {
        path: 'my-advance-requests',
        element: <EmployeeMyRequests />,
      },
      {
        path: 'advance-settlement',
        element: <EmployeeAdvanceSettlementPage />,
      },
      {
        path: 'submit-advance-settlement',
        element: <EmployeeAdvanceSettlementPage />,
      },
      {
        path: 'my-settelment-requests',
        element: <MySettlements />,
      },
      {
        path: 'conveyance-form',
        element: <SubmitConveyancePage />,
      },
      {
        path: 'my-conveyance-requests',
        element: <MyConveyanceRequestsPage />,
      },
      {
        path: 'reliver-form',
        element: <OperationExecutiveReliverPage />,
      },
      {
        path: 'reliever-form',
        element: <OperationExecutiveReliverPage />,
      },
      {
        path: 'my-reliver-requests',
        element: <OperationExecutiveMyRequestsPage />,
      },
      {
        path: 'my-reliever-requests',
        element: <OperationExecutiveMyRequestsPage />,
      },
    ],
  },

  // ****************************Manager*********************************
  {
    path: '/dashboard/manager',
    element: (
      <ProtectedRoute allowedRoles={['manager', 'operation-manager', 'facility-manager']}>
        <ManagerDashboard />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <ManagerHome />,
      },
      {
        path: 'material-approval',
        element: <MaterialRequestApprovalTable />,
      },
      {
        path: 'material-request-approval',
        element: <MaterialRequestApprovalTable />,
      },
      {
        path: 'material-request',
        element: <MaterialRequestForm />,
      },
      {
        path: 'my-requests',
        element: <MaterialRequestTable />,
      },
      {
        path: 'advance-request',
        element: <ManagerAdvanceRequestForm />,
      },
      {
        path: 'my-advance-requests',
        element: <ManagerMyRequests />,
      },
      {
        path: 'advance-request-approval',
        element: <ManagerApproval />,
      },
      {
        path: 'advance-settlement',
        element: <ManagerAdvanceSettlementForm />,
      },
      {
        path: 'submit-advance-settlement',
        element: <ManagerAdvanceSettlementForm />,
      },
      {
        path: 'my-settelment-requests',
        element: <ExpenseRequestsPage />,
      },
      {
        path: 'conveyance-form',
        element: <LinemanagerConveyanceFormPage />,
      },
      {
        path: 'my-conveyance-requests',
        element: <MyConveyanceRequestsPage />,
      },
      {
        path: 'conveyance-approval',
        element: <ManagerConveyanceApprovalsPage />,
      },
      {
        path: 'reliver-form',
        element: <OperationExecutiveReliverPage />,
      },
      {
        path: 'reliever-form',
        element: <OperationExecutiveReliverPage />,
      },
      {
        path: 'my-reliver-requests',
        element: <OperationExecutiveMyRequestsPage />,
      },
      {
        path: 'my-reliever-requests',
        element: <OperationExecutiveMyRequestsPage />,
      },
      {
        path: 'reliver-approval',
        element: <LineManagerRelieverApprovalPage />,
      },
      {
        path: 'reliever-approval',
        element: <LineManagerRelieverApprovalPage />,
      },
    ],
  },

  // ****************************PH (Project Head)*********************************
  {
    path: '/dashboard/ph',
    element: (
      <ProtectedRoute allowedRoles={['ph', 'project-head', 'operations-head']}>
        <PHDashboard />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <PHHome />,
      },
      {
        path: 'material-approval',
        element: <ProjectHeadApprovalTable />,
      },
      {
        path: 'material-approval-requests',
        element: <ProjectHeadApprovalTable />,
      },
      {
        path: 'procurement-approval-requests',
        element: <ProjectHeadApprovalTable />,
      },
      {
        path: 'create-po',
        element: <PurchaseOrderForm />,
      },
      {
        path: 'invoice-review',
        element: <PHInvoiceReview />,
      },
      {
        path: 'procurement-invoice-review',
        element: <PHInvoiceReview />,
      },
      {
        path: 'invoice-history',
        element: <PHInvoiceHistory />,
      },
      {
        path: 'prepaid-approval',
        element: <PHRequestApprovalPage />,
      },
      {
        path: 'create-prepaid-po',
        element: <PHGeneratePOPage />,
      },
      {
        path: 'po-summary',
        element: <POSummary />,
      },
      {
        path: 'prepaid-invoice-approval',
        element: <PHInvoiceApprovalPage />,
      },
    ],
  },

  // ****************************Vendor*********************************
  {
    path: '/dashboard/vendor',
    element: (
      <ProtectedRoute allowedRoles={['vendor', 'supplier']}>
        <VendorDashboard />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <VendorHome />,
      },
      {
        path: 'generate-dc',
        element: <VendorDCPage />,
      },
      {
        path: 'dc-upload',
        element: <VendorDCPage />,
      },
      {
        path: 'material-requests',
        element: <MaterialRequestTable />,
      },
      {
        path: 'upload-invoice',
        element: <VendorInvoiceUpload />,
      },
      {
        path: 'invoice-upload',
        element: <VendorInvoiceUpload />,
      },
      {
        path: 'invoice-upload-form',
        element: <VendorInvoiceUpload />,
      },
      {
        path: 'prepaid-upload-invoice',
        element: <InvoiceUploadForm />,
      },
      {
        path: 'prepaid-my-requests',
        element: <VendorRequestsPage />,
      },
      {
        path: 'prepaid-generate-dc',
        element: <VendorGenerateDCPage />,
      },
      {
        path: 'prepaid-dc-preview',
        element: <DCPreviewPage />,
      },
      {
        path: 'prepaid-invoice-form',
        element: <VendorInvoiceForm />,
      },
      {
        path: 'prepaid-invoice-page',
        element: <VendorInvoicePage />,
      },
      {
        path: 'prepaid-invoice-preview',
        element: <VendorInvoicePreviewPage />,
      },
      {
        path: 'prepaid-my-invoices',
        element: <MyInvoicesPage />,
      },
      {
        path: 'other-generate-po',
        element: <GeneratePOPage />,
      },
      {
        path: 'other-upload-invoice',
        element: <VendorUploadInvoicePage />,
      },
      {
        path: 'other-po-list',
        element: <VendorPOListPage />,
      },
      {
        path: 'other-my-invoices',
        element: <VendorMyInvoicesPage />,
      },
    ],
  },

  // ****************************AE (Accounts Executive)*********************************
  {
    path: '/dashboard/ae',
    element: (
      <ProtectedRoute allowedRoles={['ae', 'account-executive', 'finance-executive']}>
        <AEDashboard />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <AEHome />,
      },
      {
        path: 'invoice-review',
        element: <AEInvoiceReviewPage />,
      },
      {
        path: 'invoice-approval',
        element: <AEInvoiceApproval />,
      },
      {
        path: 'vendor-creation',
        element: <VendorCreationForm />,
      },
      {
        path: 'vendors-list',
        element: <VendorTable />,
      },
      {
        path: 'process-payments',
        element: <ProcessPaymentPage />,
      },
      {
        path: 'tds-mapping',
        element: <TDSMapping />,
      },
      {
        path: 'statutory-setup',
        element: <StatutorySetup />,
      },
      {
        path: 'expense-booking',
        element: <ExpenseBookingPage />,
      },
      {
        path: 'vendor-ledger',
        element: <VendorLedger />,
      },
      {
        path: 'fixed-assets-pos',
        element: <FixedAssetPOsTable />,
      },
      {
        path: 'fixed-assets-entry',
        element: <FixedAssetEntryPage />,
      },
      {
        path: 'compliance-pending',
        element: <AEPendingCompliancePage />,
      },
      {
        path: 'compliance-paid',
        element: <AEPaidCompliancePage />,
      },
      {
        path: 'payroll-pending',
        element: <AEPendingRequestsPage />,
      },
      {
        path: 'other-invoice-verification',
        element: <InvoiceVerificationPage />,
      },
      {
        path: 'advance-approval',
        element: <AEAdvanceApprovalPage />,
      },
      {
        path: 'advance-approval-requests',
        element: <AEAdvanceApprovalPage />,
      },
      {
        path: 'advance-settlement-approval',
        element: <AEAdvanceSettlementApproval />,
      },
      {
        path: 'advance-settlement-requests',
        element: <AEAdvanceSettlementApproval />,
      },
      {
        path: 'vendor-ledger-page',
        element: <VendorLedger />,
      },
      {
        path: 'map-tds',
        element: <TDSMapping />,
      },
      {
        path: 'pending-compliance-requests',
        element: <AEPendingCompliancePage />,
      },
      {
        path: 'salaries-pending-approvals',
        element: <AEPendingRequestsPage />,
      },
      {
        path: 'conveyance-approval',
        element: <AEConveyanceApprovalPage />,
      },
      {
        path: 'reliver-approval',
        element: <AERelieverApprovalPage />,
      },
      {
        path: 'reliever-approval',
        element: <AERelieverApprovalPage />,
      },
      {
        path: 'upload-bank-statement',
        element: <UploadStatementPage />,
      },
      {
        path: 'reconciliation-history',
        element: <ReconciliationHistoryPage />,
      },
      {
        path: 'reconciliation-report',
        element: <ViewReconciliationReportPage />,
      },
      {
        path: 'reconciliation-statement',
        element: <ReconciliationStatementPage />,
      },
      {
        path: 'gstr2b-reco',
        element: <GSTR2BRecoPage />,
      },
      {
        path: 'gstr2b-history',
        element: <GSTR2BRecoHistoryPage />,
      },
      {
        path: 'gstr2b-report',
        element: <GSTR2BRecoReportPage />,
      },

      // ================= MASTER PATHS =================
      {
        path: 'master/chart-of-accounts',
        element: <ChartOfAccountsDashboard />,
      },
      {
        path: 'master/billing/client-ledgers',
        element: <ClientLedgerPage />,
      },
      {
        path: 'master/billing/revenue/house-keeping',
        element: <HouseKeepingRevenueLedgerPage />,
      },
      {
        path: 'master/billing/revenue/house-keeping-exempt',
        element: <HouseKeepingExemptRevenueLedgerPage />,
      },
      {
        path: 'master/billing/revenue/service-charges',
        element: <ServiceChargesRevenueLedgerPage />,
      },
      {
        path: 'master/billing/revenue/overseas-consultancy',
        element: <OverseasConsultancyRevenueLedgerPage />,
      },
      {
        path: 'master/billing/revenue/hk-material',
        element: <HKMaterialRevenueLedgerPage />,
      },
      {
        path: 'master/billing/revenue/cleaning-consumable',
        element: <CleaningConsumableRevenueLedgerPage />,
      },
      {
        path: 'master/billing/revenue/deep-cleaning',
        element: <DeepCleaningRevenueLedgerPage />,
      },
      {
        path: 'master/billing/revenue/rent-on-machinery',
        element: <RentOnMachineryRevenueLedgerPage />,
      },
      {
        path: 'master/billing/revenue/manpower-services',
        element: <ManpowerServicesRevenueLedgerPage />,
      },
      {
        path: 'master/billing/revenue/pest-control',
        element: <PestControlRevenueLedgerPage />,
      },
      {
        path: 'master/billing/revenue/round-off',
        element: <RoundOffRevenueLedgerPage />,
      },
      {
        path: 'master/advance/employee-ledger',
        element: <EmployeeLedgerPage />,
      },
      {
        path: 'master/process-of-payments/vendor-ledger',
        element: <ProcessOfPaymentVendorPage />,
      },
      {
        path: 'master/tds-booking/tds-ledger',
        element: <TDSLedgerPage />,
      },
      {
        path: 'master/bank-ledger',
        element: <BankLedgerPage />,
      },
      {
        path: 'master/advance/travel-expense',
        element: <TravelExpenseLedgerPage />,
      },
      {
        path: 'master/advance/food-refreshment-expense',
        element: <FoodRefreshmentLedgerPage />,
      },
      {
        path: 'master/advance/office-supplies-expense',
        element: <OfficeSuppliesLedgerPage />,
      },
      {
        path: 'master/conveyance/payable-ledger',
        element: <ConveyancePayblePage />,
      },
      {
        path: 'master/conveyance/expense-ledger',
        element: <ConveyanceExpenseLedgerPage />,
      },
      {
        path: 'master/reliever/payment-ledger',
        element: <RelieverPaymentPage />,
      },
      {
        path: 'master/reliever/liability-ledger',
        element: <RelieverLiabilityLedgerPage />,
      },
      {
        path: 'master/rent/expense-ledger',
        element: <RentExpenseBookingLedgerPage />,
      },
      {
        path: 'master/gst/ledgers',
        element: <GSTLedgersPage />,
      },
      {
        path: 'master/gst/cgst-input',
        element: <CGSTInputLedgerPage />,
      },
      {
        path: 'master/gst/sgst-input',
        element: <SGSTInputLedgerPage />,
      },
      {
        path: 'master/gst/igst-input',
        element: <IGSTInputLedgerPage />,
      },
      {
        path: 'master/rent-vendor/ledger',
        element: <RentVendorLedgerPage />,
      },
      {
        path: 'master/hk-vendor/ledger',
        element: <HKVendorLedgerPage />,
      },
      {
        path: 'master/fixed-asset/ledger',
        element: <FixedAssetLedgerPage />,
      },
      {
        path: 'master/fa-vendor/ledger',
        element: <FAVendorLedgerPage />,
      },
      {
        path: 'master/prepaid/uniform-prepaid-expense',
        element: <UniformPrepaidExpenseLedger />,
      },
      {
        path: 'master/prepaid/uniform-expense',
        element: <UniformExpenseLedgerPage />,
      },
      {
        path: 'master/prepaid/vendor-ledger',
        element: <PrepaidUniformVendorLedgerPage />,
      },
      {
        path: 'master/unified-vendor-ledger',
        element: <UnifiedVendorLedgerPage />,
      },
      {
        path: 'master/hk-material-expense-ledger',
        element: <HKMaterialsExpenseLedgerPage />,
      },
      {
        path: 'master/tds-ledger',
        element: <TdsLedgerPage />,
      },
      {
        path: 'master/professional-fees-ledger',
        element: <GenericExpenseLedger />,
      },

      // Salary Master Ledgers
      {
        path: 'master/salary/wages-ledger',
        element: <SalaryWagesLedgerPage />,
      },
      {
        path: 'master/salary/payable-ledger',
        element: <SalaryPayableLedger />,
      },
      {
        path: 'master/salary/pf-contribution-ledger',
        element: <PFContributionLedgerPage />,
      },
      {
        path: 'master/salary/pf-payable-ledger',
        element: <PFPayableLedgerPage />,
      },
      {
        path: 'master/salary/esic-contribution-ledger',
        element: <ESICContributionLedgerPage />,
      },
      {
        path: 'master/salary/esic-payable-ledger',
        element: <ESICPayableLedgerPage />,
      },
      {
        path: 'master/salary/lwf-contribution-ledger',
        element: <LWFContributionLedgerPage />,
      },
      {
        path: 'master/salary/lwf-payable-ledger',
        element: <LWFPayableLedgerPage />,
      },
      {
        path: 'master/salary/leave-provision-expense-ledger',
        element: <LeaveProvisionExpenseLedgerPage />,
      },
      {
        path: 'master/salary/leave-encashment-provision-ledger',
        element: <LeaveEncashmentProvisionLedgerPage />,
      },
      {
        path: 'master/salary/other-deductions-ledger',
        element: <OtherDeductionsLedgerPage />,
      },
      {
        path: 'master/salary/employee-pf-payable-ledger',
        element: <EmployeePFPayableLedgerPage />,
      },
      {
        path: 'master/salary/employee-esic-payable-ledger',
        element: <EmployeeESICPayableLedgerPage />,
      },
      {
        path: 'master/salary/employee-lwf-payable-ledger',
        element: <EmployeeLWFPayableLedgerPage />,
      },
      {
        path: 'master/salary/pt-payable-ledger',
        element: <ProfessionalTaxPayableLedgerPage />,
      },
      {
        path: 'master/salary/bonus-provision-expense-ledger',
        element: <BonusProvisionExpenseLedgerPage />,
      },
      {
        path: 'master/salary/bonus-expense-ledger',
        element: <BonusExpenseLedgerPage />,
      },

      {
        path: 'master/tds-receivable-asset-ledger',
        element: <TDSReceivableAssetLedgerPage />,
      },

      // Billing Ledgers (11 Ledgers)
      {
        path: 'master/billing/hk-charges-ledger',
        element: <HKChargesLedgerPage />,
      },
      {
        path: 'master/billing/manpower-ledger',
        element: <ManpowerLedgerPage />,
      },
      {
        path: 'master/billing/hk-material-ledger',
        element: <HKMaterialLedgerPage />,
      },
      {
        path: 'master/billing/machinery-rent-ledger',
        element: <MachineryRentLedgerPage />,
      },
      {
        path: 'master/billing/cgst-ledger',
        element: <CGSTLedgerPage />,
      },
      {
        path: 'master/billing/sgst-ledger',
        element: <SGSTLedgerPage />,
      },
      {
        path: 'master/billing/igst-ledger',
        element: <IGSTLedgerPage />,
      },
      {
        path: 'master/billing/tds-payable-ledger',
        element: <TDSPayableLedgerPage />,
      },
      {
        path: 'master/billing/tds-receivable-ledger',
        element: <TDSReceivableLedgerPage />,
      },
      {
        path: 'master/billing/service-tax-ledger',
        element: <ServiceTaxLedgerPage />,
      },
      {
        path: 'master/billing/round-off-ledger',
        element: <RoundOffLedgerPage />,
      },
      {
        path: 'reports-dashboard',
        element: <ReportsDashboard />,
      },
      {
        path: 'reports/profit-loss',
        element: <PLReportPage />,
      },
      {
        path: 'reports/26as-reco',
        element: <TDS26ASRecoPage />,
      },
    ],
  },

  // ****************************AM (Account Manager)*********************************
  {
    path: '/dashboard/am',
    element: (
      <ProtectedRoute allowedRoles={['am', 'account-manager']}>
        <AccountManagerDashboard />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <AccountManagerHome />,
      },
      {
        path: 'invoice-review',
        element: <AMInvoiceReviewPage />,
      },
      {
        path: 'invoice-approval',
        element: <AMInvoiceApproval />,
      },
      {
        path: 'fixed-assets-entry',
        element: <AMFixedAssetEntryPage />,
      },
      {
        path: 'advance-settlement-approval',
        element: <AMAdvanceSettlementApproval />,
      },
    ],
  },
  {
    path: '/dashboard/account-manager',
    element: (
      <ProtectedRoute allowedRoles={['am', 'account-manager']}>
        <AccountManagerDashboard />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <AccountManagerHome />,
      },
      {
        path: 'invoice-review',
        element: <AMInvoiceReviewPage />,
      },
      {
        path: 'invoice-approval',
        element: <AMInvoiceApproval />,
      },
      {
        path: 'fixed-assets-entry',
        element: <AMFixedAssetEntryPage />,
      },
      {
        path: 'advance-settlement-approval',
        element: <AMAdvanceSettlementApproval />,
      },
    ],
  },

  // ****************************Compliance Team*********************************
  {
    path: '/dashboard/compliance-team',
    element: (
      <ProtectedRoute allowedRoles={['compliance-team', 'compliance-executive']}>
        <ComplianceTeamDashboard />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <ComplianceTeamHome />,
      },
      {
        path: 'compliance-entry',
        element: <ComplianceEntryPage />,
      },
      {
        path: 'compliance-entry-form',
        element: <ComplianceEntryPage />,
      },
      {
        path: 'my-entries',
        element: <ComplianceTeamSubmittedEntries />,
      },
      {
        path: 'advance-request',
        element: <ComplianceTeamAdvanceRequestForm />,
      },
      {
        path: 'my-advance-requests',
        element: <ComplianceTeamMyRequests />,
      },
      {
        path: 'advance-settlement',
        element: <ComplianceTeamAdvanceSettlementForm />,
      },
      {
        path: 'submit-advance-settlement',
        element: <ComplianceTeamAdvanceSettlementForm />,
      },
      {
        path: 'my-settelment-requests',
        element: <ExpenseRequestsPage />,
      },
      {
        path: 'conveyance-form',
        element: <SubmitConveyancePage />,
      },
      {
        path: 'my-conveyance-requests',
        element: <MyConveyanceRequestsPage />,
      },
      {
        path: 'reliver-form',
        element: <OperationExecutiveReliverPage />,
      },
      {
        path: 'reliever-form',
        element: <OperationExecutiveReliverPage />,
      },
      {
        path: 'my-reliver-requests',
        element: <OperationExecutiveMyRequestsPage />,
      },
      {
        path: 'my-reliever-requests',
        element: <OperationExecutiveMyRequestsPage />,
      },
    ],
  },

  // ****************************Compliance Manager*********************************
  {
    path: '/dashboard/compliance-manager',
    element: (
      <ProtectedRoute allowedRoles={['compliance-manager', 'compliance-head']}>
        <ComplianceManagerDashboard />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <ComplianceManagerHome />,
      },
      {
        path: 'compliance-approval',
        element: <ComplianceManagerApprovalPage />,
      },
      {
        path: 'statutory-compliances-requests',
        element: <ComplianceManagerApprovalPage />,
      },
      {
        path: 'advance-request',
        element: <ComplianceManagerAdvanceRequestForm />,
      },
      {
        path: 'my-advance-requests',
        element: <ComplianceManagerMyRequests />,
      },
      {
        path: 'advance-settlement',
        element: <ComplianceManagerAdvanceSettlementForm />,
      },
      {
        path: 'submit-advance-settlement',
        element: <ComplianceManagerAdvanceSettlementForm />,
      },
      {
        path: 'my-settelment-requests',
        element: <ExpenseRequestsPage />,
      },
      {
        path: 'conveyance-form',
        element: <LinemanagerConveyanceFormPage />,
      },
      {
        path: 'my-conveyance-requests',
        element: <MyConveyanceRequestsPage />,
      },
      {
        path: 'conveyance-approval',
        element: <ManagerConveyanceApprovalsPage />,
      },
      {
        path: 'reliver-form',
        element: <OperationExecutiveReliverPage />,
      },
      {
        path: 'reliever-form',
        element: <OperationExecutiveReliverPage />,
      },
      {
        path: 'my-reliver-requests',
        element: <OperationExecutiveMyRequestsPage />,
      },
      {
        path: 'my-reliever-requests',
        element: <OperationExecutiveMyRequestsPage />,
      },
      {
        path: 'reliver-approval',
        element: <LineManagerRelieverApprovalPage />,
      },
      {
        path: 'reliever-approval',
        element: <LineManagerRelieverApprovalPage />,
      },
    ],
  },

  // ****************************Payroll Team*********************************
  {
    path: '/dashboard/payroll-team',
    element: (
      <ProtectedRoute allowedRoles={['payroll-team', 'payroll-executive']}>
        <PayrollTeamDashboard />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <PayrollTeamHome />,
      },
      {
        path: 'payment-entry',
        element: <PayrollPaymentEntryPage />,
      },
      {
        path: 'payroll-payment-entry',
        element: <PayrollPaymentEntryPage />,
      },
      {
        path: 'attendence-dashboard',
        element: <AttendencePayrollDashboard />,
      },
      {
        path: 'my-entries',
        element: <PayrollTeamSubmittedEntriesPage />,
      },
      {
        path: 'advance-request',
        element: <PayrollTeamAdvanceRequestForm />,
      },
      {
        path: 'my-advance-requests',
        element: <PayrollTeamMyRequests />,
      },
      {
        path: 'advance-settlement',
        element: <EmployeeAdvanceSettlementPage />,
      },
      {
        path: 'submit-advance-settlement',
        element: <EmployeeAdvanceSettlementPage />,
      },
      {
        path: 'my-settelment-requests',
        element: <MySettlements />,
      },
      {
        path: 'conveyance-form',
        element: <SubmitConveyancePage />,
      },
      {
        path: 'my-conveyance-requests',
        element: <MyConveyanceRequestsPage />,
      },
      {
        path: 'reliver-form',
        element: <OperationExecutiveReliverPage />,
      },
      {
        path: 'reliever-form',
        element: <OperationExecutiveReliverPage />,
      },
      {
        path: 'my-reliver-requests',
        element: <OperationExecutiveMyRequestsPage />,
      },
      {
        path: 'my-reliever-requests',
        element: <OperationExecutiveMyRequestsPage />,
      },
    ],
  },

  // ****************************Operation Executive*********************************
  {
    path: '/dashboard/operation-executive',
    element: (
      <ProtectedRoute allowedRoles={['operation-executive']}>
        <OperationExecutiveDashboard />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <OperationExecutiveHome />,
      },
      {
        path: 'reliver-form',
        element: <OperationExecutiveReliverPage />,
      },
      {
        path: 'reliever-form',
        element: <OperationExecutiveReliverPage />,
      },
      {
        path: 'oe-reliver-form',
        element: <OperationExecutiveReliverPage />,
      },
      {
        path: 'my-reliver-requests',
        element: <OperationExecutiveMyRequestsPage />,
      },
      {
        path: 'my-reliever-requests',
        element: <OperationExecutiveMyRequestsPage />,
      },
      {
        path: 'advance-request',
        element: <OperationExecutiveAdvanceRequestForm />,
      },
      {
        path: 'my-advance-requests',
        element: <OperationExecutiveMyRequests />,
      },
      {
        path: 'advance-settlement',
        element: <OperationExecutiveAdvanceSettlementForm />,
      },
      {
        path: 'submit-advance-settlement',
        element: <OperationExecutiveAdvanceSettlementForm />,
      },
      {
        path: 'my-settelment-requests',
        element: <MySettlements />,
      },
      {
        path: 'conveyance-form',
        element: <SubmitConveyancePage />,
      },
      {
        path: 'my-conveyance-requests',
        element: <MyConveyanceRequestsPage />,
      },
    ],
  },

  // ****************************Financial Head*********************************
  {
    path: '/dashboard/financial-head',
    element: (
      <ProtectedRoute allowedRoles={['financial-head', 'finance-head', 'cfo']}>
        <FinancialHeadDashboard />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <FinancialHeadHome />,
      },
      {
        path: 'other-invoice-approval',
        element: <FinancialHeadInvoiceApprovalPage />,
      },
    ],
  },

  // ****************************Billing Manager Dashboard & Routes*********************************
  {
    path: '/dashboard/billing-manager',
    element: (
      <ProtectedRoute allowedRoles={['billing-manager', 'billing-head', 'billing-executive']}>
        <BillngManagerDashboard />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <BillingManagerHome />,
      },
      {
        path: 'prepaid-approval',
        element: <BillingManagerApprovalPage />,
      },
      {
        path: 'rent-expense-booking',
        element: <RentExpenseBookingPage />,
      },
    ],
  },

  // ****************************Billing Module Routes*********************************
  {
    path: '/billing',
    element: (
      <ProtectedRoute allowedRoles={['billing-manager', 'billing-head', 'billing-executive', 'ae', 'account-executive']}>
        <BillingLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <BillingDashboard />,
      },
      {
        path: 'auto-billing',
        element: <AutoBillingWizard />,
      },
      {
        path: 'proforma-invoices',
        element: <ProformaInvoices />,
      },
      {
        path: 'manual-billing',
        element: <ManualBilling />,
      },
      {
        path: 'rate-cards',
        element: <RateCardPage />,
      },
      {
        path: 'arrear-billing',
        element: <ArrearBillingPage />,
      },
      {
        path: 'arrear-billing/new',
        element: <ArrearBillingForm />,
      },
      {
        path: 'arrear-billing/preview',
        element: <ArrearBillingInvoicePreview />,
      },
      {
        path: 'bonus-leave-encashment',
        element: <BonusLeaveEncashmentList />,
      },
      {
        path: 'bonus-leave-encashment/new',
        element: <BonusLeaveEncashmentForm />,
      },
      {
        path: 'bonus-leave-encashment/calc',
        element: <BonusLeaveEncashmentCalculation />,
      },
      {
        path: 'bonus-leave-encashment/preview',
        element: <BonusLeaveEncashmentInvoicePreview />,
      },
      {
        path: 'invoices',
        element: <InvoiceListPage />,
      },
      {
        path: 'irn-invoices',
        element: <IRNInvoices />,
      },
      {
        path: 'attendance-upload',
        element: <AttendanceUploadPage />,
      },
      {
        path: 'my-uploaded-attendance',
        element: <MyUploadedAttendance />,
      },
      {
        path: 'attendance-payroll-dashboard',
        element: <AttendencePayrollDashboard />,
      },
      {
        path: 'attendance-punching-list',
        element: <AttendancePunchingList />,
      },
      {
        path: 'attendance-details',
        element: <AttendanceDetails />,
      },
    ],
  },

  {
    path: '*',
    element: <h1>Page Not Found!</h1>,
  },
])

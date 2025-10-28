// /* eslint-disable no-unused-vars */
// import React, { useEffect, useState } from 'react';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import AEFilter from '../Components/AEFilter';
// import AERequestTable from '../Components/AERequestTable';
// import AdvanceRequestPaymentEntryModal from '../Components/AdvanceRequestPaymentEntryModal';
// import AEBankSelectionModal from '../Components/AEBankSelectionModal';

// export default function AEAdvanceApprovalPage() {
//   const [requests, setRequests] = useState([]);
//   const [filter, setFilter] = useState({ name: '', empId: '', date: '', requestId: '' });
  
//   // Modal states
//   const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
//   const [isBankModalOpen, setIsBankModalOpen] = useState(false); // NEW STATE
//   const [selectedRequest, setSelectedRequest] = useState(null);
//   const [approvedRequests, setApprovedRequests] = useState([]);
//   const [pendingApprovalData, setPendingApprovalData] = useState(null); // NEW STATE - stores request until bank is selected

//   useEffect(() => {
//     const allRequests = JSON.parse(localStorage.getItem('advanceRequests')) || [];
//     const aeRequests = allRequests.filter(req => 
//       req.status === 'Pending AE Approval' || 
//       req.status === 'Approved' ||
//       req.status === 'Rejected by AE'
//     );
//     setRequests(aeRequests);
//   }, []);

//   // NEW FUNCTION - Opens bank selection modal first
//   const handleApprove = (submittedAt) => {
//     const allRequests = JSON.parse(localStorage.getItem('advanceRequests')) || [];
//     const requestIndex = allRequests.findIndex(req => req.submittedAt === submittedAt);
    
//     if (requestIndex === -1) {
//       toast.error('Request not found');
//       return;
//     }

//     const request = allRequests[requestIndex];

//     // Check VP deadline
//     if (request.isVPRequest && !request.vpApprovedBeforeDeadline) {
//       toast.error('Cannot approve: VP request was approved after 15:59 deadline');
//       return;
//     }

//     // Store request data and open bank selection modal
//     setPendingApprovalData({ type: 'single', request, requestIndex });
//     setIsBankModalOpen(true);
//   };

//   // NEW FUNCTION - Handle multiple approvals
//   const handleApproveMultiple = (requestsData) => {
//     const allRequests = JSON.parse(localStorage.getItem('advanceRequests')) || [];
    
//     const requestsToApprove = requestsData
//       .map(submittedAt => {
//         const index = allRequests.findIndex(req => req.submittedAt === submittedAt);
//         return index !== -1 ? { request: allRequests[index], index } : null;
//       })
//       .filter(item => item !== null)
//       .filter(item => !item.request.isVPRequest || item.request.vpApprovedBeforeDeadline);

//     if (requestsToApprove.length === 0) {
//       toast.error('No eligible requests to approve');
//       return;
//     }

//     // Store multiple requests and open bank selection modal
//     setPendingApprovalData({ type: 'multiple', requests: requestsToApprove });
//     setIsBankModalOpen(true);
//   };

//   // NEW FUNCTION - Called after bank is selected
//   const handleBankSelected = (bankData) => {
//     if (!pendingApprovalData) return;

//     const allRequests = JSON.parse(localStorage.getItem('advanceRequests')) || [];
//     const approvalTime = new Date();
//     const isBeforeDeadline = approvalTime.getHours() < 19 || 
//                            (approvalTime.getHours() === 19 && approvalTime.getMinutes() <= 59);

//     let updatedRequests = [...allRequests];
//     const approvedRequestsData = [];

//     if (pendingApprovalData.type === 'single') {
//       // Single approval
//       const { request, requestIndex } = pendingApprovalData;
      
//       updatedRequests[requestIndex] = {
//         ...updatedRequests[requestIndex],
//         status: 'Approved',
//         approvedAt: approvalTime.toISOString(),
//         aeApprovedBy: JSON.parse(localStorage.getItem('user')).username,
//         aeApprovedBeforeDeadline: isBeforeDeadline,
//         // Add bank details
//         bankCode: bankData.bankCode,
//         bankName: bankData.bankName,
//         bankId: bankData.bankId
//       };

//       approvedRequestsData.push(updatedRequests[requestIndex]);

//       localStorage.setItem('advanceRequests', JSON.stringify(updatedRequests));
      
//       // Update local state
//       const filteredRequests = updatedRequests.filter(req => 
//         req.status === 'Pending AE Approval' || 
//         req.status === 'Approved' ||
//         req.status === 'Rejected by AE'
//       );
//       setRequests(filteredRequests);
      
//       // Show payment modal with single request
//       setSelectedRequest(updatedRequests[requestIndex]);
//       setApprovedRequests([]);
      
//       toast.success(
//         isBeforeDeadline 
//           ? 'Request Approved - Eligible for same-day processing'
//           : 'Request Approved - Will be processed next working day'
//       );

//     } else if (pendingApprovalData.type === 'multiple') {
//       // Multiple approvals
//       pendingApprovalData.requests.forEach(({ request, index }) => {
//         updatedRequests[index] = {
//           ...updatedRequests[index],
//           status: 'Approved',
//           approvedAt: approvalTime.toISOString(),
//           aeApprovedBy: JSON.parse(localStorage.getItem('user')).username,
//           aeApprovedBeforeDeadline: isBeforeDeadline,
//           // Add bank details
//           bankCode: bankData.bankCode,
//           bankName: bankData.bankName,
//           bankId: bankData.bankId
//         };

//         approvedRequestsData.push(updatedRequests[index]);
//       });

//       localStorage.setItem('advanceRequests', JSON.stringify(updatedRequests));
      
//       // Update local state
//       const filteredRequests = updatedRequests.filter(req => 
//         req.status === 'Pending AE Approval' || 
//         req.status === 'Approved' ||
//         req.status === 'Rejected by AE'
//       );
//       setRequests(filteredRequests);
      
//       // Show payment modal with multiple requests
//       setSelectedRequest(null);
//       setApprovedRequests(approvedRequestsData);
      
//       toast.success(`${approvedRequestsData.length} requests approved successfully`);
//     }

//     // Close bank modal and open payment modal
//     setIsBankModalOpen(false);
//     setIsPaymentModalOpen(true);
//     setPendingApprovalData(null);
//   };

//   const handleReject = (submittedAt, reason) => {
//     const allRequests = JSON.parse(localStorage.getItem('advanceRequests')) || [];
//     const requestIndex = allRequests.findIndex(req => req.submittedAt === submittedAt);
    
//     if (requestIndex === -1) {
//       toast.error('Request not found');
//       return;
//     }

//     const updatedRequests = [...allRequests];
//     updatedRequests[requestIndex] = {
//       ...updatedRequests[requestIndex],
//       status: 'Rejected by AE',
//       remarks: reason,
//       rejectedAt: new Date().toISOString(),
//       aeRejectedBy: JSON.parse(localStorage.getItem('user')).username
//     };

//     localStorage.setItem('advanceRequests', JSON.stringify(updatedRequests));
    
//     const filteredRequests = updatedRequests.filter(
//       req => req.status === 'Pending AE Approval' || 
//              (req.status === 'Rejected by AE' && req.clarification) ||
//              (req.status === 'Approved' && req.currentLevel === 'account-executive')
//     );
    
//     setRequests(filteredRequests);
//     toast.error('Request Rejected');
//   };

//   const handleDownloadComplete = (downloadedRequestIds) => {
//     const allRequests = JSON.parse(localStorage.getItem('advanceRequests')) || [];
//     const remainingRequests = allRequests.filter(req => 
//       !downloadedRequestIds.includes(req.submittedAt)
//     );
    
//     localStorage.setItem('advanceRequests', JSON.stringify(remainingRequests));
    
//     const filteredRequests = remainingRequests.filter(req => 
//       req.status === 'Pending AE Approval' || 
//       req.status === 'Approved' ||
//       req.status === 'Rejected by AE'
//     );
    
//     setRequests(filteredRequests);
//     toast.success(`${downloadedRequestIds.length} approved requests downloaded and removed from table`);
//   };

//   const filteredRequests = requests.filter(r =>
//     r.employeeName.toLowerCase().includes(filter.name.toLowerCase()) &&
//     r.employeeId.toLowerCase().includes(filter.empId.toLowerCase()) &&
//     (filter.date === '' || r.requestDate.includes(filter.date)) &&
//     (filter.requestId === '' || (r.requestId && r.requestId.toLowerCase().includes(filter.requestId.toLowerCase())))
//   );

//   const getCurrentTimeStatus = () => {
//     const now = new Date();
//     const isBeforeDeadline = now.getHours() < 15 || (now.getHours() === 15 && now.getMinutes() <= 59);
//     return isBeforeDeadline;
//   };

//   const closePaymentModal = () => {
//     setIsPaymentModalOpen(false);
//     setSelectedRequest(null);
//     setApprovedRequests([]);
//   };

//   const closeBankModal = () => {
//     setIsBankModalOpen(false);
//     setPendingApprovalData(null);
//   };

//   return (
//     <div className="p-4 bg-white shadow-md rounded-md">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl font-bold text-green-600">AE Dashboard - Advance Requests</h1>
//         <div className={`text-sm px-3 py-1 rounded ${
//           getCurrentTimeStatus() 
//             ? 'bg-green-100 text-green-800' 
//             : 'bg-red-100 text-red-800'
//         }`}>
//           {getCurrentTimeStatus() 
//             ? '🟢 Before 15:59 - Same day processing' 
//             : '🔴 After 15:59 - Next day processing only'
//           }
//         </div>
//       </div>
      
//       <AEFilter filter={filter} setFilter={setFilter} />
//       <AERequestTable 
//         data={filteredRequests} 
//         onApprove={handleApprove} 
//         onReject={handleReject}
//         onDownloadComplete={handleDownloadComplete}
//         onApproveMultiple={handleApproveMultiple}
//       />

//       {/* Bank Selection Modal - Opens FIRST */}
//       <AEBankSelectionModal
//         isOpen={isBankModalOpen}
//         onClose={closeBankModal}
//         onBankSelect={handleBankSelected}
//         requestData={
//           pendingApprovalData?.type === 'single' 
//             ? pendingApprovalData.request 
//             : pendingApprovalData?.requests.map(r => r.request)
//         }
//       />

//       {/* Payment Entry Modal - Opens AFTER bank selection */}
//       <AdvanceRequestPaymentEntryModal
//         isOpen={isPaymentModalOpen}
//         onClose={closePaymentModal}
//         requestData={selectedRequest}
//         approvedRequests={approvedRequests}
//       />
//     </div>
//   );
// }

/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AEFilter from '../Components/AEFilter';
import AERequestTable from '../Components/AERequestTable';
import AdvanceRequestPaymentEntryModal from '../Components/AdvanceRequestPaymentEntryModal';
import AEBankSelectionModal from '../Components/AEBankSelectionModal';
// Import accounting helper functions
import { 
  processAdvanceApproval, 
  processMultipleAdvanceApprovals 
} from '../../Master/utils/accountingHelpers';

export default function AEAdvanceApprovalPage() {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState({ name: '', empId: '', date: '', requestId: '' });
  
  // Modal states
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [pendingApprovalData, setPendingApprovalData] = useState(null);
  const [accountingResult, setAccountingResult] = useState(null); // NEW: Store accounting processing result

  useEffect(() => {
    const allRequests = JSON.parse(localStorage.getItem('advanceRequests')) || [];
    const aeRequests = allRequests.filter(req => 
      req.status === 'Pending AE Approval' || 
      req.status === 'Approved' ||
      req.status === 'Rejected by AE'
    );
    setRequests(aeRequests);
  }, []);

  // NEW FUNCTION - Process accounting for single approval
  const processSingleAccounting = async (request, bankData) => {
  try {
    console.log('🔄 Processing accounting for single approval...');
    console.log('Original request employeeId:', request.employeeId);
    
    // Ensure we're using the correct employee ID format
    const processedRequest = {
      ...request,
      employeeId: request.employeeId // Let accountingHelpers handle the conversion
    };
    
    const result = processAdvanceApproval(processedRequest, bankData);
    
    if (result.success) {
      console.log('✅ Accounting processed successfully:', result);
      return result;
    } else {
      console.error('❌ Accounting processing failed:', result.error);
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('❌ Error in accounting processing:', error);
    throw error;
  }
};

  // NEW FUNCTION - Process accounting for multiple approvals
  const processMultipleAccounting = async (requests, bankData) => {
    try {
      console.log(`🔄 Processing accounting for ${requests.length} approvals...`);
      
      const result = processMultipleAdvanceApprovals(requests, bankData);
      
      if (result.success) {
        console.log('✅ Batch accounting processed successfully:', result);
        return result;
      } else {
        console.error('❌ Batch accounting processing failed:', result.error);
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('❌ Error in batch accounting processing:', error);
      throw error;
    }
  };

  // UPDATED FUNCTION - Opens bank selection modal first
  const handleApprove = (submittedAt) => {
    const allRequests = JSON.parse(localStorage.getItem('advanceRequests')) || [];
    const requestIndex = allRequests.findIndex(req => req.submittedAt === submittedAt);
    
    if (requestIndex === -1) {
      toast.error('Request not found');
      return;
    }

    const request = allRequests[requestIndex];

    // Check VP deadline
    if (request.isVPRequest && !request.vpApprovedBeforeDeadline) {
      toast.error('Cannot approve: VP request was approved after 15:59 deadline');
      return;
    }

    // Store request data and open bank selection modal
    setPendingApprovalData({ type: 'single', request, requestIndex });
    setIsBankModalOpen(true);
  };

  // UPDATED FUNCTION - Handle multiple approvals
  const handleApproveMultiple = (requestsData) => {
    const allRequests = JSON.parse(localStorage.getItem('advanceRequests')) || [];
    
    const requestsToApprove = requestsData
      .map(submittedAt => {
        const index = allRequests.findIndex(req => req.submittedAt === submittedAt);
        return index !== -1 ? { request: allRequests[index], index } : null;
      })
      .filter(item => item !== null)
      .filter(item => !item.request.isVPRequest || item.request.vpApprovedBeforeDeadline);

    if (requestsToApprove.length === 0) {
      toast.error('No eligible requests to approve');
      return;
    }

    // Store multiple requests and open bank selection modal
    setPendingApprovalData({ type: 'multiple', requests: requestsToApprove });
    setIsBankModalOpen(true);
  };

  // UPDATED FUNCTION - Called after bank is selected (NOW INCLUDES ACCOUNTING PROCESSING)
  // In AEAdvanceApprovalPage.jsx, update the handleBankSelected function:

// UPDATED FUNCTION - Called after bank is selected (FIXED VALIDATION ISSUE)
const handleBankSelected = async (bankData) => {
  if (!pendingApprovalData) return;

  const allRequests = JSON.parse(localStorage.getItem('advanceRequests')) || [];
  const approvalTime = new Date();
  const isBeforeDeadline = approvalTime.getHours() < 19 || 
                         (approvalTime.getHours() === 19 && approvalTime.getMinutes() <= 59);

  let updatedRequests = [...allRequests];
  const approvedRequestsData = [];
  let accountingProcessingResult = null;

  try {
    if (pendingApprovalData.type === 'single') {
      // Single approval with accounting processing
      const { request, requestIndex } = pendingApprovalData;
      
      // Create a temporary approved request for accounting processing
      const tempApprovedRequest = {
        ...request,
        status: 'Approved', // TEMPORARILY set to Approved for validation
        approvedAt: approvalTime.toISOString(),
        aeApprovedBy: JSON.parse(localStorage.getItem('user')).username,
        aeApprovedBeforeDeadline: isBeforeDeadline,
        bankCode: bankData.bankCode,
        bankName: bankData.bankName,
        bankId: bankData.bankId
      };

      // Process accounting FIRST with temporary approved request
      accountingProcessingResult = await processSingleAccounting(tempApprovedRequest, bankData);
      
      if (!accountingProcessingResult.success) {
        throw new Error(accountingProcessingResult.message);
      }

      // Update request status AFTER successful accounting with accounting details
      updatedRequests[requestIndex] = {
        ...tempApprovedRequest,
        // Add accounting details
        voucherNo: accountingProcessingResult.voucherNo,
        transactionId: accountingProcessingResult.transactionId,
        glCode: accountingProcessingResult.employeeGLCode
      };

      approvedRequestsData.push(updatedRequests[requestIndex]);

      localStorage.setItem('advanceRequests', JSON.stringify(updatedRequests));
      
      // Update local state
      const filteredRequests = updatedRequests.filter(req => 
        req.status === 'Pending AE Approval' || 
        req.status === 'Approved' ||
        req.status === 'Rejected by AE'
      );
      setRequests(filteredRequests);
      
      // Store accounting result and show payment modal
      setAccountingResult(accountingProcessingResult);
      setSelectedRequest(updatedRequests[requestIndex]);
      setApprovedRequests([]);
      
      toast.success(
        isBeforeDeadline 
          ? `Request Approved - ${accountingProcessingResult.message}`
          : `Request Approved - ${accountingProcessingResult.message} (Next working day)`
      );

    } else if (pendingApprovalData.type === 'multiple') {
      // Multiple approvals with accounting processing
      const requestsArray = pendingApprovalData.requests.map(r => {
        // Create temporary approved requests for batch processing
        return {
          ...r.request,
          status: 'Approved', // TEMPORARILY set to Approved for validation
          approvedAt: approvalTime.toISOString(),
          aeApprovedBy: JSON.parse(localStorage.getItem('user')).username,
          aeApprovedBeforeDeadline: isBeforeDeadline,
          bankCode: bankData.bankCode,
          bankName: bankData.bankName,
          bankId: bankData.bankId
        };
      });
      
      // Process batch accounting FIRST with temporary approved requests
      accountingProcessingResult = await processMultipleAccounting(requestsArray, bankData);
      
      if (!accountingProcessingResult.success) {
        throw new Error(accountingProcessingResult.message);
      }

      // Update all requests status AFTER successful accounting
      pendingApprovalData.requests.forEach(({ request, index }) => {
        updatedRequests[index] = {
          ...requestsArray.find(req => req.submittedAt === request.submittedAt),
          // Add accounting details
          voucherNo: accountingProcessingResult.voucherNo,
          transactionId: accountingProcessingResult.transactionId
        };

        approvedRequestsData.push(updatedRequests[index]);
      });

      localStorage.setItem('advanceRequests', JSON.stringify(updatedRequests));
      
      // Update local state
      const filteredRequests = updatedRequests.filter(req => 
        req.status === 'Pending AE Approval' || 
        req.status === 'Approved' ||
        req.status === 'Rejected by AE'
      );
      setRequests(filteredRequests);
      
      // Store accounting result and show payment modal
      setAccountingResult(accountingProcessingResult);
      setSelectedRequest(null);
      setApprovedRequests(approvedRequestsData);
      
      toast.success(`${approvedRequestsData.length} requests approved - ${accountingProcessingResult.message}`);
    }

    // Close bank modal and open payment modal
    setIsBankModalOpen(false);
    setIsPaymentModalOpen(true);
    setPendingApprovalData(null);

  } catch (error) {
    console.error('❌ Error during approval process:', error);
    toast.error(`Approval failed: ${error.message}`);
    
    // Reset states on error
    setIsBankModalOpen(false);
    setPendingApprovalData(null);
    setAccountingResult(null);
  }
};

  const handleReject = (submittedAt, reason) => {
    const allRequests = JSON.parse(localStorage.getItem('advanceRequests')) || [];
    const requestIndex = allRequests.findIndex(req => req.submittedAt === submittedAt);
    
    if (requestIndex === -1) {
      toast.error('Request not found');
      return;
    }

    const updatedRequests = [...allRequests];
    updatedRequests[requestIndex] = {
      ...updatedRequests[requestIndex],
      status: 'Rejected by AE',
      remarks: reason,
      rejectedAt: new Date().toISOString(),
      aeRejectedBy: JSON.parse(localStorage.getItem('user')).username
    };

    localStorage.setItem('advanceRequests', JSON.stringify(updatedRequests));
    
    const filteredRequests = updatedRequests.filter(
      req => req.status === 'Pending AE Approval' || 
             (req.status === 'Rejected by AE' && req.clarification) ||
             (req.status === 'Approved' && req.currentLevel === 'account-executive')
    );
    
    setRequests(filteredRequests);
    toast.error('Request Rejected');
  };

  const handleDownloadComplete = (downloadedRequestIds) => {
    const allRequests = JSON.parse(localStorage.getItem('advanceRequests')) || [];
    const remainingRequests = allRequests.filter(req => 
      !downloadedRequestIds.includes(req.submittedAt)
    );
    
    localStorage.setItem('advanceRequests', JSON.stringify(remainingRequests));
    
    const filteredRequests = remainingRequests.filter(req => 
      req.status === 'Pending AE Approval' || 
      req.status === 'Approved' ||
      req.status === 'Rejected by AE'
    );
    
    setRequests(filteredRequests);
    toast.success(`${downloadedRequestIds.length} approved requests downloaded and removed from table`);
  };

  const filteredRequests = requests.filter(r =>
    r.employeeName.toLowerCase().includes(filter.name.toLowerCase()) &&
    r.employeeId.toLowerCase().includes(filter.empId.toLowerCase()) &&
    (filter.date === '' || r.requestDate.includes(filter.date)) &&
    (filter.requestId === '' || (r.requestId && r.requestId.toLowerCase().includes(filter.requestId.toLowerCase())))
  );

  const getCurrentTimeStatus = () => {
    const now = new Date();
    const isBeforeDeadline = now.getHours() < 15 || (now.getHours() === 15 && now.getMinutes() <= 59);
    return isBeforeDeadline;
  };

  const closePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setSelectedRequest(null);
    setApprovedRequests([]);
    setAccountingResult(null); // Reset accounting result when modal closes
  };

  const closeBankModal = () => {
    setIsBankModalOpen(false);
    setPendingApprovalData(null);
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-green-600">AE Dashboard - Advance Requests</h1>
        <div className={`text-sm px-3 py-1 rounded ${
          getCurrentTimeStatus() 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {getCurrentTimeStatus() 
            ? '🟢 Before 15:59 - Same day processing' 
            : '🔴 After 15:59 - Next day processing only'
          }
        </div>
      </div>
      
      <AEFilter filter={filter} setFilter={setFilter} />
      <AERequestTable 
        data={filteredRequests} 
        onApprove={handleApprove} 
        onReject={handleReject}
        onDownloadComplete={handleDownloadComplete}
        onApproveMultiple={handleApproveMultiple}
      />

      {/* Bank Selection Modal - Opens FIRST */}
      <AEBankSelectionModal
        isOpen={isBankModalOpen}
        onClose={closeBankModal}
        onBankSelect={handleBankSelected}
        requestData={
          pendingApprovalData?.type === 'single' 
            ? pendingApprovalData.request 
            : pendingApprovalData?.requests.map(r => r.request)
        }
      />

      {/* Payment Entry Modal - Opens AFTER bank selection and accounting processing */}
      <AdvanceRequestPaymentEntryModal
        isOpen={isPaymentModalOpen}
        onClose={closePaymentModal}
        requestData={selectedRequest}
        approvedRequests={approvedRequests}
        accountingResult={accountingResult} // Pass accounting result to modal
      />
    </div>
  );
}
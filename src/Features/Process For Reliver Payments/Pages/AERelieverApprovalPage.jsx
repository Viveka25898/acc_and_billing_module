// pages/AERelieverApprovalPage.jsx
import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import FilterBar from "../Components/Filter";
import AEApprovalTable from "../Components/AEApprovalTable";
import AERelieverBankSelectionModal from "../Components/AERelieverBankSelectionModal";
import RelieverPaymentEntryModal from "../Components/RelieverPaymentEntryModal";
import { 
  processRelieverPaymentApproval, 
  processMultipleRelieverPayments 
} from "../../Master/utils/accountingHelpers";

export default function AERelieverApprovalPage() {
  const [requests, setRequests] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [showBankModal, setShowBankModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedApprovedRequests, setSelectedApprovedRequests] = useState([]);
  const [selectedBank, setSelectedBank] = useState(null);
  const [pendingApprovalData, setPendingApprovalData] = useState(null);
  const [accountingResult, setAccountingResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    loadRequests();
    
    return () => {
      isMounted.current = false;
    };
  }, [currentUser?.username]);

  const loadRequests = () => {
    try {
      const allRequests = JSON.parse(localStorage.getItem("relieverRequests")) || [];
      
      // Filter requests that are either pending for current user or already processed by current user
      const relevantRequests = allRequests.filter(req => {
        // Pending requests for current user
        if (req.status === "Pending Account Executive Approval" && 
            req.currentApprover === currentUser.username) {
          return true;
        }
        
        // Approved or rejected requests by current user
        if ((req.status === "Approved" || req.status.includes("Rejected by Account Executive")) &&
            req.history?.some(h => h.by === currentUser.username && 
              (h.action === "Approved by Account Executive" || h.action === "Rejected by Account Executive"))) {
          return true;
        }
        
        return false;
      });

      // Sort requests: Pending first, then Approved, then Rejected
      const sortedRequests = relevantRequests.sort((a, b) => {
        const getStatusPriority = (status) => {
          if (status === "Pending Account Executive Approval") return 1;
          if (status === "Approved") return 2;
          if (status.includes("Rejected")) return 3;
          return 4;
        };
        
        return getStatusPriority(a.status) - getStatusPriority(b.status);
      });

      if (isMounted.current) {
        setRequests(sortedRequests);
        setFiltered(sortedRequests);
      }
    } catch (error) {
      console.error("Error loading requests:", error);
      toast.error("Failed to load requests");
    }
  };

  const updateLocalStorage = (updatedRequests) => {
    const allRequests = JSON.parse(localStorage.getItem("relieverRequests")) || [];
    const updatedAllRequests = allRequests.map(req => {
      const updatedReq = updatedRequests.find(ur => ur.id === req.id);
      return updatedReq || req;
    });
    localStorage.setItem("relieverRequests", JSON.stringify(updatedAllRequests));
  };

  const handleStatusChange = (id, newStatus, reason = null) => {
  const now = new Date();
  const request = requests.find(req => req.id === id);

  if (!request) return;

  // For rejections, process immediately
  if (newStatus.includes("Rejected")) {
    const historyEntry = {
      action: "Rejected by Account Executive",
      by: currentUser.username,
      at: now.toISOString(),
      comments: reason || "Rejected"
    };

    const updatedRequest = {
      ...request,
      status: newStatus,
      currentApprover: request.submittedBy,
      history: [...request.history, historyEntry],
      rejectionReason: reason || null,
      rejectedAt: now.toISOString()
    };

    const updated = requests.map(req => 
      req.id === id ? updatedRequest : req
    );

    // Re-sort after status change
    const sortedUpdated = updated.sort((a, b) => {
      const getStatusPriority = (status) => {
        if (status === "Pending Account Executive Approval") return 1;
        if (status === "Approved") return 2;
        if (status.includes("Rejected")) return 3;
        return 4;
      };
      
      return getStatusPriority(a.status) - getStatusPriority(b.status);
    });

    setRequests(sortedUpdated);
    setFiltered(sortedUpdated);
    updateLocalStorage(sortedUpdated);

    toast.error(`Request #${id.slice(-6)} rejected`);
    return;
  }

  // For approvals - DON'T change status yet, just open bank modal
  if (newStatus === "Approved") {
    const approvedRequest = requests.find(req => req.id === id);
    setSelectedApprovedRequests([approvedRequest]);
    setPendingApprovalData({ 
      type: 'single', 
      request: approvedRequest, 
      requestIndex: requests.findIndex(req => req.id === id) 
    });
    setShowBankModal(true);
    
    // Don't show success toast yet - wait for bank selection
    // toast.success(`Request #${id.slice(-6)} approved`); // REMOVE THIS LINE
  }
};

  const handleBulkApprove = (ids) => {
  // Show bank selection modal with multiple requests WITHOUT changing status yet
  const approvedRequests = requests.filter(req => ids.includes(req.id));
  const requestsWithIndex = approvedRequests.map(req => ({
    request: req,
    index: requests.findIndex(r => r.id === req.id)
  }));
  
  setSelectedApprovedRequests(approvedRequests);
  setPendingApprovalData({ 
    type: 'multiple', 
    requests: requestsWithIndex 
  });
  setShowBankModal(true);
  
  // Don't update status or show success toast yet - wait for bank selection
  // The toast will be shown in handleBankSelected after successful processing
};

const handleBankSelected = async (bankData) => {
  if (!pendingApprovalData) return;
  
  setIsProcessing(true);
  
  try {
    const allRequests = JSON.parse(localStorage.getItem("relieverRequests")) || [];
    const approvalTime = new Date();
    const isBeforeDeadline = approvalTime.getHours() < 19 || 
                           (approvalTime.getHours() === 19 && approvalTime.getMinutes() <= 59);

    let updatedAllRequests = [...allRequests];
    const approvedRequestsData = [];
    let accountingProcessingResult = null;

    if (pendingApprovalData.type === 'single') {
      // SINGLE RELIEVER PAYMENT APPROVAL
      const { request } = pendingApprovalData;
      
      console.log('🔄 Processing single reliever payment...');
      
      // Step 1: Process accounting FIRST
      accountingProcessingResult = await processRelieverPaymentApproval(
        {
          ...request,
          status: request.status,
          approvedAt: approvalTime.toISOString(),
          aeApprovedBy: currentUser.username,
          aeApprovedBeforeDeadline: isBeforeDeadline,
          bankCode: bankData.bankCode,
          bankName: bankData.bankName,
          bankId: bankData.bankId
        },
        bankData
      );
      
      // Step 2: Check if accounting succeeded
      if (!accountingProcessingResult.success) {
        throw new Error(accountingProcessingResult.message);
      }
      
      console.log('✅ Reliever accounting processed successfully:', accountingProcessingResult);
      
      // Step 3: Update request status to Approved in ALL requests
      const requestIndexInAll = updatedAllRequests.findIndex(r => r.id === request.id);
      
      if (requestIndexInAll !== -1) {
        const historyEntry = {
          action: "Approved by Account Executive",
          by: currentUser.username,
          at: approvalTime.toISOString(),
          comments: "Approved with bank processing"
        };

        updatedAllRequests[requestIndexInAll] = {
          ...updatedAllRequests[requestIndexInAll],
          status: 'Approved', // ✅ MARK AS APPROVED
          approvedAt: approvalTime.toISOString(),
          aeApprovedBy: currentUser.username,
          aeApprovedBeforeDeadline: isBeforeDeadline,
          bankCode: bankData.bankCode,
          bankName: bankData.bankName,
          bankId: bankData.bankId,
          history: [...updatedAllRequests[requestIndexInAll].history, historyEntry],
          voucherNo: accountingProcessingResult.voucherNo,
          transactionId: accountingProcessingResult.transactionId,
          glCode: accountingProcessingResult.relieverGLCode
        };

        approvedRequestsData.push(updatedAllRequests[requestIndexInAll]);
      }

    } else if (pendingApprovalData.type === 'multiple') {
      // BATCH RELIEVER PAYMENT APPROVAL
      console.log(`🔄 Processing batch reliever payment for ${pendingApprovalData.requests.length} requests...`);
      
      // Step 1: Prepare requests for batch processing
      const requestsArray = pendingApprovalData.requests.map(r => ({
        ...r.request,
        status: r.request.status,
        approvedAt: approvalTime.toISOString(),
        aeApprovedBy: currentUser.username,
        aeApprovedBeforeDeadline: isBeforeDeadline,
        bankCode: bankData.bankCode,
        bankName: bankData.bankName,
        bankId: bankData.bankId
      }));
      
      // Step 2: Process batch accounting
      accountingProcessingResult = await processMultipleRelieverPayments(requestsArray, bankData);
      
      // Step 3: Check if batch accounting succeeded
      if (!accountingProcessingResult.success) {
        throw new Error(accountingProcessingResult.message);
      }
      
      console.log('✅ Batch reliever accounting processed:', accountingProcessingResult);
      
      // Step 4: Update all requests to Approved in ALL requests
      pendingApprovalData.requests.forEach(({ request }) => {
        const requestIndexInAll = updatedAllRequests.findIndex(r => r.id === request.id);
        
        if (requestIndexInAll !== -1) {
          const paymentResult = accountingProcessingResult.payments?.find(p => p.relieverName === request.name);
          const historyEntry = {
            action: "Approved by Account Executive",
            by: currentUser.username,
            at: approvalTime.toISOString(),
            comments: "Bulk approved with bank processing"
          };

          updatedAllRequests[requestIndexInAll] = {
            ...updatedAllRequests[requestIndexInAll],
            status: 'Approved', // ✅ MARK AS APPROVED
            approvedAt: approvalTime.toISOString(),
            aeApprovedBy: currentUser.username,
            aeApprovedBeforeDeadline: isBeforeDeadline,
            bankCode: bankData.bankCode,
            bankName: bankData.bankName,
            bankId: bankData.bankId,
            history: [...updatedAllRequests[requestIndexInAll].history, historyEntry],
            voucherNo: paymentResult?.voucherNo,
            transactionId: paymentResult?.transactionId
          };

          approvedRequestsData.push(updatedAllRequests[requestIndexInAll]);
        }
      });
    }

    // ✅ CRITICAL FIX: Save ALL requests back to localStorage
    localStorage.setItem('relieverRequests', JSON.stringify(updatedAllRequests));
    
    // ✅ CRITICAL FIX: Update local state IMMEDIATELY for UI refresh
    const updatedLocalRequests = updatedAllRequests.filter(req => 
      req.status === "Pending Account Executive Approval" || 
      req.status === "Approved" ||
      req.status.includes("Rejected by Account Executive")
    );
    
    // ✅ CRITICAL FIX: Sort the updated requests
    const sortedUpdated = updatedLocalRequests.sort((a, b) => {
      const getStatusPriority = (status) => {
        if (status === "Pending Account Executive Approval") return 1;
        if (status === "Approved") return 2;
        if (status.includes("Rejected")) return 3;
        return 4;
      };
      return getStatusPriority(a.status) - getStatusPriority(b.status);
    });

    setRequests(sortedUpdated);
    setFiltered(sortedUpdated);
    
    // Show success toast
    if (pendingApprovalData.type === 'single') {
      toast.success(
        isBeforeDeadline 
          ? `✅ ${accountingProcessingResult.message} (Same-day processing)`
          : `✅ ${accountingProcessingResult.message} (Next working day)`
      );
    } else {
      toast.success(`✅ ${approvedRequestsData.length} reliever payments approved - ${accountingProcessingResult.message}`);
    }

    // Close modals and show payment modal
    setShowBankModal(false);
    setShowPaymentModal(true);
    setPendingApprovalData(null);
    setSelectedBank(bankData);
    setAccountingResult(accountingProcessingResult);
    setSelectedApprovedRequests(approvedRequestsData);

  } catch (error) {
    console.error('❌ Error during reliever payment process:', error);
    toast.error(`Reliever payment failed: ${error.message}`);
    
    // Reset states on error
    setShowBankModal(false);
    setPendingApprovalData(null);
    setAccountingResult(null);
  } finally {
    setIsProcessing(false);
  }
}
  const handleCloseBankModal = () => {
    setShowBankModal(false);
    setSelectedApprovedRequests([]);
    setPendingApprovalData(null);
  };

  const handleClosePaymentModal = () => {
  setShowPaymentModal(false);
  setSelectedApprovedRequests([]);
  setSelectedBank(null);
  setAccountingResult(null);
  
  // Reload requests to ensure UI is in sync
  loadRequests();
};

  const downloadBankFile = () => {
  const approvedRequests = requests.filter(
    req => req.status === "Approved"
  );

  if (approvedRequests.length === 0) {
    toast.error("No approved requests to download");
    return;
  }

  // Prepare Excel data with only required columns
  const excelData = approvedRequests.map(req => ({
    "TYPE": "NEFT",
    "DEBIT BANK A/C NO": req.debitAccountNo || "123456789",
    "DEBIT AMT": req.amount,
    "CUR": "INR",
    "BENIFICARY A/C NO": req.accountNo,
    "IFSC CODE": req.ifscCode,
    "NARRTION/NAME (20 chars)": req.name.substring(0, 20)
  }));

  // Create workbook
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(excelData);
  XLSX.utils.book_append_sheet(wb, ws, "Bank Payments");

  // Generate file and download
  const fileName = `Reliever_Payments_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(wb, fileName);

  // ✅ FIX: Get ALL requests from localStorage
  const allRequests = JSON.parse(localStorage.getItem("relieverRequests")) || [];
  const approvedRequestIds = approvedRequests.map(req => req.id);
  
  // ✅ FIX: Remove ONLY downloaded approved requests from ALL requests
  const updatedAllRequests = allRequests.filter(req => !approvedRequestIds.includes(req.id));
  
  // ✅ FIX: Save back to localStorage
  localStorage.setItem("relieverRequests", JSON.stringify(updatedAllRequests));
  
  // ✅ FIX: Update local state IMMEDIATELY to remove from table
  const updatedLocalRequests = updatedAllRequests.filter(req => 
    req.status === "Pending Account Executive Approval" || 
    req.status === "Approved" ||
    req.status.includes("Rejected by Account Executive")
  );
  
  // ✅ FIX: Sort the updated requests
  const sortedUpdated = updatedLocalRequests.sort((a, b) => {
    const getStatusPriority = (status) => {
      if (status === "Pending Account Executive Approval") return 1;
      if (status === "Approved") return 2;
      if (status.includes("Rejected")) return 3;
      return 4;
    };
    return getStatusPriority(a.status) - getStatusPriority(b.status);
  });

  setRequests(sortedUpdated);
  setFiltered(sortedUpdated);
  
  toast.success(`${approvedRequests.length} payment(s) downloaded and removed`);
};

  const handleFilter = (filters) => {
    let temp = [...requests];
    if (filters.name?.trim()) {
      temp = temp.filter(req =>
        req.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }
    
    // Maintain sorting after filtering
    temp.sort((a, b) => {
      const getStatusPriority = (status) => {
        if (status === "Pending Account Executive Approval") return 1;
        if (status === "Approved") return 2;
        if (status.includes("Rejected")) return 3;
        return 4;
      };
      
      return getStatusPriority(a.status) - getStatusPriority(b.status);
    });
    
    setFiltered(temp);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 bg-white shadow-md rounded-md">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-green-600">
          Account Executive - Reliever Payment Approvals
        </h1>
        <button
          onClick={downloadBankFile}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Download Approved Payments
        </button>
      </div>

      <FilterBar onFilter={handleFilter} />
      <AEApprovalTable
        requests={filtered}
        onStatusChange={handleStatusChange}
        onBulkApprove={handleBulkApprove}
        showActions={true}
      />

      {/* Bank Selection Modal */}
      <AERelieverBankSelectionModal
        isOpen={showBankModal}
        onClose={handleCloseBankModal}
        onBankSelect={handleBankSelected}
        approvedRequests={selectedApprovedRequests}
      />

      {/* Payment Entry Modal */}
      <RelieverPaymentEntryModal
        isOpen={showPaymentModal}
        onClose={handleClosePaymentModal}
        approvedRequests={selectedApprovedRequests}
        selectedBank={selectedBank}
        accountingResult={accountingResult}
      />

      {/* Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[70] flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            <p className="text-gray-700 font-medium">Processing payment...</p>
            <p className="text-sm text-gray-500">Please wait, posting accounting entries</p>
          </div>
        </div>
      )}
    </div>
  );
}
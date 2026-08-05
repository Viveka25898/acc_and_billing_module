import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import FilterBar from "../Components/Filter";
import LineManagerApprovalTable from "../Components/LineManagerApprovalTable";
import RelieverPaymentEntryModal from "../Components/RelieverPaymentEntryModal";
import {
  fetchRelieverQueue,
  approveRelieverRequest,
  rejectRelieverRequest,
  bulkApproveRelieverRequests,
  selectRelieverQueueRequests,
  selectRelieverQueueLoading
} from "../../../store/slices/relieverSlice";

export default function AERelieverApprovalPage() {
  const dispatch = useDispatch();
  const queueRequests = useSelector(selectRelieverQueueRequests);
  const loading = useSelector(selectRelieverQueueLoading);

  const [filters, setFilters] = useState({ name: "", date: "" });
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedApprovedRequests, setSelectedApprovedRequests] = useState([]);
  const [accountingResult, setAccountingResult] = useState(null);

  useEffect(() => {
    dispatch(fetchRelieverQueue());
  }, [dispatch]);

  const handleStatusChange = async (id, newStatus, reason = null) => {
    try {
      if (newStatus.includes("Rejected")) {
        await dispatch(rejectRelieverRequest({ 
          id, 
          comments: "Rejected by Account Executive", 
          rejectionReason: reason || "Bank details mismatch"
        })).unwrap();
        toast.error(`Request #${id.slice(-6)} rejected`);
      } else {
        const res = await dispatch(approveRelieverRequest({ 
          id, 
          comments: "Approved by Account Executive" 
        })).unwrap();
        
        // Extract accounting details returned from backend response
        const apiData = res?.data || res;
        const accountingData = {
          voucherNo: apiData?.voucherNo || apiData?.accounting?.voucherNo || `PAY/AE/${new Date().getFullYear()}/${id.slice(-4)}`,
          transactionId: apiData?.transactionId || apiData?.accounting?.transactionId || `TXN_REL_${Date.now()}`,
          glEntries: apiData?.glEntries || apiData?.accounting?.glEntries || null,
          ...apiData
        };
        
        const approvedItem = queueRequests.find((r) => r.id === id) || {};
        
        setAccountingResult(accountingData);
        setSelectedApprovedRequests([approvedItem]);
        setShowPaymentModal(true);
        
        toast.success(`Request #${id.slice(-6)} approved - Liability created`);
      }
    } catch (error) {
      console.error("Action error:", error);
      toast.error(`Operation failed: ${error}`);
      throw error;
    }
  };

  const handleBulkApprove = async (ids) => {
    try {
      const res = await dispatch(bulkApproveRelieverRequests({ ids })).unwrap();
      const approvedItems = queueRequests.filter((r) => ids.includes(r.id));
      
      const apiData = res?.data || res;
      const batchAccounting = {
        voucherNo: apiData?.voucherNo || apiData?.accounting?.voucherNo || `PAY/AE/BATCH/${Date.now().toString().slice(-4)}`,
        transactionId: apiData?.transactionId || apiData?.accounting?.transactionId || `TXN_BATCH_${Date.now()}`,
        glEntries: apiData?.glEntries || apiData?.accounting?.glEntries || null,
        ...apiData
      };
      
      setAccountingResult(batchAccounting);
      setSelectedApprovedRequests(approvedItems);
      setShowPaymentModal(true);
      
      toast.success(`${ids.length} request(s) approved - Liability created`);
    } catch (error) {
      console.error("Bulk approval error:", error);
      toast.error(`Bulk approval failed: ${error}`);
    }
  };

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    setSelectedApprovedRequests([]);
    setAccountingResult(null);
    dispatch(fetchRelieverQueue());
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
  };

  const filteredRequests = queueRequests.filter((req) => {
    if (filters.name?.trim()) {
      const searchName = filters.name.trim().toLowerCase();
      const reqName = (req.name || req.relieverName || "").toLowerCase();
      if (!reqName.includes(searchName)) return false;
    }
    if (filters.date?.trim()) {
      const searchDate = filters.date.trim();
      const reqDate = req.date || "";
      if (!reqDate.includes(searchDate)) return false;
    }
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
      {/* Premium Green Header Block */}
      <div className="bg-gradient-to-r from-green-700 to-green-600 px-6 py-5 text-white shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-wide">Account Executive - Reliever Payment Approvals</h1>
          <p className="text-green-100 text-sm mt-0.5">Post liability and process reliever payment vouchers</p>
        </div>
      </div>

      <div className="p-6">
        <FilterBar onFilter={handleFilter} />
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        ) : (
          <LineManagerApprovalTable
            requests={filteredRequests}
            onStatusChange={handleStatusChange}
            onBulkApprove={handleBulkApprove}
            showActions={true}
            activeStatus="Pending Account Executive Approval"
          />
        )}
      </div>

      {/* Payment Entry Modal */}
      <RelieverPaymentEntryModal
        isOpen={showPaymentModal}
        onClose={handleClosePaymentModal}
        approvedRequests={selectedApprovedRequests}
        accountingResult={accountingResult}
      />
    </div>
  );
}

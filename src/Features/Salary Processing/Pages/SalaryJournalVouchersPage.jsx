import React, { useState, useEffect, useCallback } from "react";
import { BookOpenCheck, RefreshCw, AlertCircle } from "lucide-react";
import { salaryJVService } from "../services/salaryJVService";
import SalaryJVSummaryCards from "../Components/SalaryJVSummaryCards";
import SalaryJVFilterBar from "../Components/SalaryJVFilterBar";
import SalaryJVTable from "../Components/SalaryJVTable";
import SalaryJVDetailModal from "../Components/SalaryJVDetailModal";

export default function SalaryJournalVouchersPage() {
  // Filter state
  const [filters, setFilters] = useState({
    branch: "",
    siteId: "",
    period: "",
    fromDate: "",
    toDate: "",
  });

  // Table & Pagination state
  const [vouchers, setVouchers] = useState([]);
  const [summary, setSummary] = useState({ totalVouchers: 0, totalAmount: "0.00" });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    limit: 10,
  });
  const [loading, setLoading] = useState(false);
  const [pageError, setPageError] = useState(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [selectedVoucherDetail, setSelectedVoucherDetail] = useState(null);
  const [modalError, setModalError] = useState(null);
  const [activeLoadingVoucherNo, setActiveLoadingVoucherNo] = useState(null);

  // Fetch vouchers with current filter and pagination settings
  const loadVouchers = useCallback(
    async (pageToLoad = 1, currentLimit = pagination.limit) => {
      setLoading(true);
      setPageError(null);
      try {
        const response = await salaryJVService.fetchJournalVouchers({
          branch: filters.branch,
          siteId: filters.siteId,
          period: filters.period,
          fromDate: filters.fromDate,
          toDate: filters.toDate,
          page: pageToLoad,
          limit: currentLimit,
        });

        if (response.success && response.data) {
          setVouchers(response.data.vouchers || []);
          setPagination(response.data.pagination);
          setSummary(response.data.summary);
        } else {
          setPageError(response.message || "Failed to load journal vouchers");
        }
      } catch (err) {
        console.error("Error loading journal vouchers:", err);
        setPageError(err.message || "An unexpected error occurred while fetching vouchers");
      } finally {
        setLoading(false);
      }
    },
    [filters, pagination.limit]
  );

  // Initial load
  useEffect(() => {
    loadVouchers(1, pagination.limit);
  }, []); // Run on mount

  // Filter handlers
  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleApplyFilters = () => {
    loadVouchers(1, pagination.limit);
  };

  const handleResetFilters = () => {
    setFilters({
      branch: "",
      siteId: "",
      period: "",
      fromDate: "",
      toDate: "",
    });
    // Call service with cleared filters
    salaryJVService
      .fetchJournalVouchers({ page: 1, limit: pagination.limit })
      .then((res) => {
        if (res.success && res.data) {
          setVouchers(res.data.vouchers);
          setPagination(res.data.pagination);
          setSummary(res.data.summary);
        }
      });
  };

  // Pagination handlers
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      loadVouchers(newPage, pagination.limit);
    }
  };

  const handleLimitChange = (newLimit) => {
    setPagination((prev) => ({ ...prev, limit: newLimit }));
    loadVouchers(1, newLimit);
  };

  // View JV Handler
  const handleViewJV = async (voucherNo) => {
    setActiveLoadingVoucherNo(voucherNo);
    setModalLoading(true);
    setModalError(null);
    setIsModalOpen(true);
    try {
      const response = await salaryJVService.fetchJournalVoucherDetails(voucherNo);
      if (response.success && response.data) {
        setSelectedVoucherDetail(response.data);
      } else {
        setModalError(response.message || `Could not load voucher ${voucherNo}`);
      }
    } catch (err) {
      console.error("Error opening voucher:", err);
      setModalError(err.message || "Failed to load voucher detail");
    } finally {
      setModalLoading(false);
      setActiveLoadingVoucherNo(null);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVoucherDetail(null);
    setModalError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 lg:p-8">
      {/* Top Header with Green Background Banner */}
      <div className="bg-gradient-to-r from-green-800 via-green-700 to-emerald-800 rounded-2xl shadow-md p-5 sm:p-6 mb-6 text-white border border-green-600/30">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-white/15 backdrop-blur-md text-white rounded-xl shadow-inner border border-white/20 shrink-0">
              <BookOpenCheck className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white drop-shadow-xs">
                  Salary Journal Vouchers
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-900/60 text-emerald-100 border border-emerald-400/30">
                  Site Month Lock Auto-JV
                </span>
              </div>
              <p className="text-xs sm:text-sm text-green-100/90 mt-1 max-w-2xl font-medium leading-relaxed">
                Audit and inspect verified double-entry journal vouchers automatically posted to branch ledgers upon site payroll lock.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-center">
            <button
              type="button"
              onClick={() => loadVouchers(pagination.currentPage, pagination.limit)}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-green-900 bg-white hover:bg-green-50 active:bg-green-100 rounded-xl shadow-sm hover:shadow transition-all duration-150 cursor-pointer disabled:opacity-60"
              title="Refresh vouchers list"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-green-700" : ""}`} />
              <span>Refresh List</span>
            </button>
          </div>
        </div>
      </div>

      {/* Global Page Error Banner */}
      {pageError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-800 text-xs">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <p className="flex-1 font-medium">{pageError}</p>
          <button
            type="button"
            onClick={() => loadVouchers(pagination.currentPage, pagination.limit)}
            className="underline font-semibold hover:text-red-900 cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Summary KPI Cards */}
      <SalaryJVSummaryCards summary={summary} vouchers={vouchers} />

      {/* Filter Bar */}
      <SalaryJVFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
      />

      {/* Vouchers Table */}
      <SalaryJVTable
        vouchers={vouchers}
        loading={loading}
        pagination={pagination}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        onViewJV={handleViewJV}
        activeLoadingVoucherNo={activeLoadingVoucherNo}
      />

      {/* Voucher Detail Modal */}
      <SalaryJVDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        voucher={selectedVoucherDetail}
        loading={modalLoading}
        error={modalError}
      />
    </div>
  );
}

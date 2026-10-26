import React from "react";
import { Eye, ChevronLeft, ChevronRight, Loader2, FileSpreadsheet } from "lucide-react";

export default function SalaryJVTable({
  vouchers = [],
  loading = false,
  pagination = { currentPage: 1, totalPages: 1, totalRecords: 0, limit: 10 },
  onPageChange,
  onLimitChange,
  onViewJV,
  activeLoadingVoucherNo = null,
}) {
  const { currentPage, totalPages, totalRecords, limit } = pagination;

  const startEntry = totalRecords === 0 ? 0 : (currentPage - 1) * limit + 1;
  const endEntry = Math.min(currentPage * limit, totalRecords);

  const formatCurrency = (amount) => {
    const num = parseFloat(amount) || 0;
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(num);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "-";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
      {/* Table Container */}
      <div className="overflow-x-auto min-h-[380px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-green-800 to-green-700 text-white text-xs font-semibold uppercase tracking-wider">
              <th className="py-3 px-3.5 text-center w-14">Sr No</th>
              <th className="py-3 px-3.5">Voucher No</th>
              <th className="py-3 px-3.5">Voucher Date</th>
              <th className="py-3 px-3.5">Branch</th>
              <th className="py-3 px-3.5">Site Details</th>
              <th className="py-3 px-3.5 text-center">Period</th>
              <th className="py-3 px-3.5 text-center">Employees</th>
              <th className="py-3 px-3.5 text-right">Total Amount (₹)</th>
              <th className="py-3 px-3.5 text-center">Status</th>
              <th className="py-3 px-3.5">Posted At</th>
              <th className="py-3 px-3.5 text-center w-24">View JV</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs">
            {loading ? (
              <tr>
                <td colSpan={11} className="py-16 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <Loader2 className="w-8 h-8 text-green-700 animate-spin" />
                    <span className="font-medium text-gray-600">Loading journal vouchers...</span>
                  </div>
                </td>
              </tr>
            ) : vouchers.length === 0 ? (
              <tr>
                <td colSpan={11} className="py-16 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <FileSpreadsheet className="w-10 h-10 text-gray-300" />
                    <p className="text-sm font-semibold text-gray-700">No Journal Vouchers Found</p>
                    <p className="text-xs text-gray-400">
                      Try adjusting the filter criteria or reset filters to view all posted JVs.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              vouchers.map((v, idx) => {
                const srNo = (currentPage - 1) * limit + idx + 1;
                const isItemLoading = activeLoadingVoucherNo === v.voucherNo;

                return (
                  <tr
                    key={v.voucherNo || idx}
                    className="hover:bg-green-50/40 transition-colors group"
                  >
                    {/* Sr No */}
                    <td className="py-3 px-3.5 text-center font-medium text-gray-500">
                      {srNo}
                    </td>

                    {/* Voucher No */}
                    <td className="py-3 px-3.5">
                      <span className="font-mono font-semibold text-green-900 bg-green-50/80 px-2 py-0.5 rounded border border-green-200">
                        {v.voucherNo}
                      </span>
                    </td>

                    {/* Voucher Date */}
                    <td className="py-3 px-3.5 text-gray-700 whitespace-nowrap">
                      {formatDate(v.voucherDate)}
                    </td>

                    {/* Branch */}
                    <td className="py-3 px-3.5">
                      <span className="font-semibold text-gray-800">
                        {v.branchName}
                      </span>
                    </td>

                    {/* Site */}
                    <td className="py-3 px-3.5">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900 line-clamp-1" title={v.siteName}>
                          {v.siteName}
                        </span>
                        <span className="text-[10px] text-gray-500 font-mono">
                          ID: {v.siteId}
                        </span>
                      </div>
                    </td>

                    {/* Payroll Period */}
                    <td className="py-3 px-3.5 text-center font-medium text-gray-700 whitespace-nowrap">
                      <span className="px-2 py-0.5 bg-gray-100 rounded text-gray-700 font-mono text-[11px]">
                        {v.payrollPeriod}
                      </span>
                    </td>

                    {/* Employees */}
                    <td className="py-3 px-3.5 text-center font-semibold text-gray-700">
                      {v.employeeCount}
                    </td>

                    {/* Total Amount */}
                    <td className="py-3 px-3.5 text-right font-bold text-green-800 whitespace-nowrap">
                      {formatCurrency(v.totalAmount)}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3.5 text-center whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        ● {v.status || "POSTED"}
                      </span>
                    </td>

                    {/* Posted At */}
                    <td className="py-3 px-3.5 text-gray-500 whitespace-nowrap text-[11px]">
                      {formatDateTime(v.postedAt)}
                    </td>

                    {/* View JV Column */}
                    <td className="py-3 px-3.5 text-center">
                      <div className="relative inline-block group/btn">
                        <button
                          type="button"
                          onClick={() => onViewJV(v.voucherNo)}
                          disabled={isItemLoading}
                          className="p-1.5 rounded-lg text-green-700 hover:text-white hover:bg-green-700 bg-green-50 border border-green-200 transition-all duration-150 cursor-pointer disabled:opacity-50"
                          aria-label={`View JV ${v.voucherNo}`}
                        >
                          {isItemLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin text-green-700" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                        
                        {/* Hover Tooltip: "View JV" */}
                        <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover/btn:flex flex-col items-center z-20">
                          <span className="relative z-10 p-1.5 text-[10px] font-medium leading-none text-white whitespace-nowrap bg-gray-900 rounded shadow-lg">
                            View JV
                          </span>
                          <span className="w-2 h-2 -mt-1 rotate-45 bg-gray-900"></span>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-600">
        <div className="flex items-center gap-3">
          <span>
            Showing <strong className="text-gray-900">{startEntry}</strong> to{" "}
            <strong className="text-gray-900">{endEntry}</strong> of{" "}
            <strong className="text-gray-900">{totalRecords}</strong> entries
          </span>

          <div className="flex items-center gap-1.5 ml-2">
            <span className="text-gray-500">Rows per page:</span>
            <select
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="bg-white border border-gray-300 rounded px-2 py-1 text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-green-600 cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1 || loading}
            className="inline-flex items-center justify-center p-1.5 rounded-md border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              type="button"
              onClick={() => onPageChange(pageNum)}
              disabled={loading}
              className={`min-w-7 h-7 px-2 flex items-center justify-center rounded-md text-xs font-medium transition-colors ${
                currentPage === pageNum
                  ? "bg-green-700 text-white font-semibold"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
            >
              {pageNum}
            </button>
          ))}

          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages || loading}
            className="inline-flex items-center justify-center p-1.5 rounded-md border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

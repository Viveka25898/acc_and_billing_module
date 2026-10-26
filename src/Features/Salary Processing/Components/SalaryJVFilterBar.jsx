import React from "react";
import { Filter, RotateCcw, Search, Calendar, Building2, MapPin } from "lucide-react";
import { MOCK_BRANCHES } from "../data/salaryJVDummyData";

export default function SalaryJVFilterBar({
  filters,
  onFilterChange,
  onApply,
  onReset,
  branches = MOCK_BRANCHES,
}) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onApply?.();
    }
  };

  const hasActiveFilters = Boolean(
    filters.branch ||
    filters.siteId ||
    filters.period ||
    filters.fromDate ||
    filters.toDate
  );

  return (
    <div className="bg-white rounded-xl border border-green-100 shadow-xs p-4 sm:p-5 mb-6">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-green-50 rounded-md text-green-700">
            <Filter className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-semibold text-gray-800 tracking-wide">
            Filter Journal Vouchers
          </h3>
          {hasActiveFilters && (
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Active Filters
            </span>
          )}
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-green-700 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset All
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Branch Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Branch
          </label>
          <div className="relative">
            <select
              value={filters.branch || ""}
              onChange={(e) => onFilterChange("branch", e.target.value)}
              className="w-full text-xs bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all appearance-none cursor-pointer"
            >
              <option value="">All Branches (27)</option>
              {branches.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
            <Building2 className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>

        {/* Site ID / Name Search */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Site ID / Name
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="e.g. SITE-101 or Powai..."
              value={filters.siteId || ""}
              onChange={(e) => onFilterChange("siteId", e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full text-xs bg-gray-50 border border-gray-300 rounded-lg pl-8 pr-3 py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
            />
            <MapPin className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
          </div>
        </div>

        {/* Payroll Period */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Payroll Period
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="e.g. 10-2026 or 2026-10"
              value={filters.period || ""}
              onChange={(e) => onFilterChange("period", e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full text-xs bg-gray-50 border border-gray-300 rounded-lg pl-8 pr-3 py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
            />
            <Calendar className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
          </div>
        </div>

        {/* From Date */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            From Voucher Date
          </label>
          <input
            type="date"
            value={filters.fromDate || ""}
            onChange={(e) => onFilterChange("fromDate", e.target.value)}
            className="w-full text-xs bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all cursor-pointer"
          />
        </div>

        {/* To Date */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            To Voucher Date
          </label>
          <input
            type="date"
            value={filters.toDate || ""}
            onChange={(e) => onFilterChange("toDate", e.target.value)}
            className="w-full text-xs bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all cursor-pointer"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-2.5 mt-4 pt-3 border-t border-gray-100">
        <button
          type="button"
          onClick={onReset}
          className="px-3.5 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={onApply}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-green-700 hover:bg-green-800 active:bg-green-900 rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <Search className="w-3.5 h-3.5" />
          Apply Filters
        </button>
      </div>
    </div>
  );
}

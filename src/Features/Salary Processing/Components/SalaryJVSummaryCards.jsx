import React from "react";
import { FileText, IndianRupee, MapPin } from "lucide-react";

export default function SalaryJVSummaryCards({ summary, vouchers = [] }) {
  const totalAmountNum = parseFloat(summary?.totalAmount) || 0;
  
  // Use counts directly from backend summary if available, fallback to list
  const uniqueSites =
    summary?.totalSites !== undefined
      ? summary.totalSites
      : new Set(vouchers.map((v) => v.siteId)).size;

  const uniqueBranches =
    summary?.totalBranches !== undefined
      ? summary.totalBranches
      : new Set(vouchers.map((v) => v.branchName)).size;

  // Financial Year supplied directly from backend
  const financialYear = summary?.financialYear || "FY 2026-27";

  const formatINR = (val) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(val);
  };

  const cards = [
    {
      title: "Total Posted JVs",
      value: summary?.totalVouchers ?? vouchers.length ?? 0,
      badge: "Audited",
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
      subtext: "Auto-posted from Site Month Locks",
      icon: FileText,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-700",
      borderColor: "border-emerald-200",
    },
    {
      title: "Total Salary Booked",
      value: formatINR(totalAmountNum),
      badge: financialYear,
      badgeColor: "bg-green-100 text-green-900 border-green-300 font-bold",
      subtext: `Debited for ${financialYear} across Branch Expenses`,
      icon: IndianRupee,
      iconBg: "bg-green-50",
      iconColor: "text-green-700",
      borderColor: "border-green-300",
      highlightBorder: true,
    },
    {
      title: "Sites & Branches",
      value: `${uniqueSites} Sites / ${uniqueBranches} Branches`,
      badge: "Pan-India",
      badgeColor: "bg-teal-100 text-teal-800 border-teal-200",
      subtext: "Independent branch ledgers mapped",
      icon: MapPin,
      iconBg: "bg-teal-50",
      iconColor: "text-teal-700",
      borderColor: "border-teal-200",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {cards.map((card, idx) => {
        const IconComponent = card.icon;
        return (
          <div
            key={idx}
            className={`bg-white rounded-xl p-4 sm:p-5 border ${
              card.highlightBorder ? "border-green-300 ring-1 ring-green-100" : card.borderColor
            } shadow-xs hover:shadow-md transition-shadow relative overflow-hidden`}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {card.title}
                  </p>
                  {card.badge && (
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${card.badgeColor}`}
                    >
                      {card.badge}
                    </span>
                  )}
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                  {card.value}
                </h3>
                <p className="text-xs text-gray-500 font-medium">{card.subtext}</p>
              </div>

              <div className={`p-3 rounded-xl ${card.iconBg} ${card.iconColor} shrink-0`}>
                <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

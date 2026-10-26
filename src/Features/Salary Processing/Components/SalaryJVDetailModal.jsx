import React, { useMemo } from "react";
import { X, Loader2, AlertCircle, Building2 } from "lucide-react";
import { numberToWordsIndian } from "../data/salaryJVDummyData";

export default function SalaryJVDetailModal({
  isOpen,
  onClose,
  voucher,
  loading = false,
  error = null,
}) {
  if (!isOpen) return null;

  // Format currency with Indian locale
  const formatAmount = (amt) => {
    if (amt === null || amt === undefined || amt === "-" || amt === "") return "-";
    const num = parseFloat(amt);
    if (isNaN(num)) return "-";
    return num.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Dynamic row generator supporting both API 2 head-wise structure and flat ledger structure
  const displayRows = useMemo(() => {
    if (!voucher?.entries || !Array.isArray(voucher.entries)) return [];

    const isHeadWise = voucher.entries.some(
      (e) => e.debit?.glName || e.credit?.glName || (e.debit && e.credit)
    );

    if (isHeadWise) {
      const debits = [];
      const credits = [];

      voucher.entries.forEach((entry, idx) => {
        // Debit leg
        if (entry.debit && (parseFloat(entry.debit.amount) > 0 || entry.debit.amount)) {
          debits.push({
            id: `dr-${idx}`,
            accountName: entry.debit.glName || `${entry.head} Expense`,
            subtext: `${entry.head} for ${voucher.payrollPeriod || "Period"}${
              entry.debit.glCode ? ` • GL: ${entry.debit.glCode}` : ""
            }`,
            debit: entry.debit.amount,
            credit: null,
            head: entry.head,
          });
        }

        // Credit leg
        if (entry.credit && (parseFloat(entry.credit.amount) > 0 || entry.credit.amount)) {
          credits.push({
            id: `cr-${idx}`,
            accountName: entry.credit.glName || `${entry.head} Liability`,
            subtext: `${entry.head} for ${voucher.payrollPeriod || "Period"}${
              entry.credit.glCode ? ` • GL: ${entry.credit.glCode}` : ""
            }`,
            debit: null,
            credit: entry.credit.amount,
            head: entry.head,
          });
        }
      });

      // Combine: Debits first, followed by Credits (Standard Accounting Voucher Format)
      return [...debits, ...credits].map((r, i) => ({
        ...r,
        sNo: i + 1,
      }));
    }

    // Flat rows format
    return voucher.entries.map((entry, idx) => ({
      id: entry.id || `row-${idx}`,
      sNo: entry.lineNo || idx + 1,
      accountName: entry.accountName || entry.glName || "Account Ledger",
      subtext: entry.narration || entry.description || entry.subtext || "",
      debit: entry.debit,
      credit: entry.credit,
      head: entry.head || "",
    }));
  }, [voucher]);

  // Compute or extract balanced totals
  const totalDebit = useMemo(() => {
    if (voucher?.totals?.totalDebit !== undefined) {
      return parseFloat(voucher.totals.totalDebit) || 0;
    }
    return displayRows.reduce((sum, r) => sum + (parseFloat(r.debit) || 0), 0);
  }, [voucher, displayRows]);

  const totalCredit = useMemo(() => {
    if (voucher?.totals?.totalCredit !== undefined) {
      return parseFloat(voucher.totals.totalCredit) || 0;
    }
    return displayRows.reduce((sum, r) => sum + (parseFloat(r.credit) || 0), 0);
  }, [voucher, displayRows]);

  const rupeesInWords = useMemo(() => {
    return numberToWordsIndian(totalDebit);
  }, [totalDebit]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs transition-opacity duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Top Bar - Green Gradient with ONLY an X button */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-green-800 to-green-700 text-white shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold tracking-wide">
              Journal Voucher - Salary Payment
            </span>
            {voucher?.status && (
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-green-900/60 text-green-100 border border-green-500/30">
                {voucher.status}
              </span>
            )}
          </div>

          {/* Strictly ONLY one X close button - No print, no download button */}
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-green-100 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close Modal"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-7 bg-gray-50 flex-1">
          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-10 h-10 text-green-700 animate-spin" />
              <p className="text-sm font-medium text-gray-700">Loading Voucher Details...</p>
              <p className="text-xs text-gray-400">Fetching balanced debit and credit ledger lines</p>
            </div>
          ) : error ? (
            <div className="py-16 text-center">
              <div className="max-w-md mx-auto p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex flex-col items-center gap-2">
                <AlertCircle className="w-6 h-6 text-red-600" />
                <p className="text-sm font-semibold">{error}</p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-2 px-3 py-1 bg-white border border-red-300 rounded text-xs font-medium text-red-700 hover:bg-red-50"
                >
                  Close
                </button>
              </div>
            </div>
          ) : !voucher ? (
            <div className="py-16 text-center text-gray-500 text-sm">
              No voucher details available.
            </div>
          ) : (
            /* Printable/Auditable Voucher Document (Matching Reference Image Layout) */
            <div className="bg-white rounded-lg border border-gray-300 shadow-xs p-6 sm:p-8 max-w-3xl mx-auto text-gray-800">
              {/* Company Header */}
              <div className="text-center pb-4">
                <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-wide">
                  I SMART FACTECH PRIVATE LIMITED
                </h1>
                <p className="text-[11px] sm:text-xs text-gray-600 mt-1 uppercase font-medium">
                  317, 3RD FLOOR, J/2, NILGIRI MANDLA TRUCK TERMINAL, NEAR WADALA STD, MUMBAI - 400037
                </p>
                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-gray-500 mt-1 font-mono">
                  <span>GST No: 27AACCM328112E</span>
                  <span>•</span>
                  <span>GST State: Maharashtra (27)</span>
                  {voucher.branchName && (
                    <>
                      <span>•</span>
                      <span className="font-semibold text-green-800">
                        Branch: {voucher.branchName}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Dotted Separator */}
              <div className="border-b border-dotted border-gray-300 my-3" />

              {/* Voucher Subtitle */}
              <div className="text-center py-1">
                <h2 className="text-base sm:text-lg font-bold text-gray-900 uppercase tracking-widest">
                  Journal Voucher
                </h2>
              </div>

              {/* Voucher Metadata Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 py-3 text-xs border-t border-b border-gray-200 my-3 bg-gray-50/50 px-3 rounded">
                <div className="space-y-1.5">
                  <div className="flex">
                    <span className="w-28 text-gray-500 font-medium">Voucher No.:</span>
                    <span className="font-mono font-bold text-gray-900">
                      {voucher.voucherNo}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="w-28 text-gray-500 font-medium">Batch ID:</span>
                    <span className="font-mono text-gray-700">
                      {voucher.auditTrail?.createdBy === "SYSTEM_AUTO_TRIGGER"
                        ? `sal-${voucher.voucherNo?.replace(/[^a-zA-Z0-9]/g, "").slice(0, 14)}`
                        : "sal-auto-lock"}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="w-28 text-gray-500 font-medium">Reference:</span>
                    <span className="text-gray-800 font-medium">
                      Salary Payment - {voucher.site?.siteName || voucher.site?.siteId || "Site"} ({voucher.payrollPeriod})
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 sm:text-right">
                  <div className="flex sm:justify-end">
                    <span className="w-28 sm:w-auto sm:mr-3 text-gray-500 font-medium">Voucher Date:</span>
                    <span className="font-medium text-gray-900">
                      {voucher.voucherDate}
                    </span>
                  </div>
                  <div className="flex sm:justify-end">
                    <span className="w-28 sm:w-auto sm:mr-3 text-gray-500 font-medium">Pay Period:</span>
                    <span className="font-semibold text-gray-900">
                      {voucher.payrollPeriod}
                    </span>
                  </div>
                  <div className="flex sm:justify-end">
                    <span className="w-28 sm:w-auto sm:mr-3 text-gray-500 font-medium">Headcount:</span>
                    <span className="text-gray-800 font-medium">
                      {voucher.employeeCount ? `${voucher.employeeCount} Employees` : "-"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dynamic Line Items Table (Handles 10, 20+ lines seamlessly) */}
              <div className="overflow-x-auto mt-4">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-t-2 border-b-2 border-gray-900 font-bold text-gray-900">
                      <th className="py-2.5 px-2 text-center w-12">S.No</th>
                      <th className="py-2.5 px-3">Account Name</th>
                      <th className="py-2.5 px-3 text-right w-36">Debit</th>
                      <th className="py-2.5 px-3 text-right w-36">Credit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {displayRows.map((row) => (
                      <tr key={row.id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="py-2 px-2 text-center text-gray-500 font-medium align-top">
                          {row.sNo}
                        </td>
                        <td className="py-2 px-3 align-top">
                          <p className="font-semibold text-gray-900 leading-snug">
                            {row.accountName}
                          </p>
                          {row.subtext && (
                            <p className="text-[10px] text-gray-500 italic mt-0.5">
                              {row.subtext}
                            </p>
                          )}
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-medium text-gray-900 align-top whitespace-nowrap">
                          {formatAmount(row.debit)}
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-medium text-gray-900 align-top whitespace-nowrap">
                          {formatAmount(row.credit)}
                        </td>
                      </tr>
                    ))}

                    {/* Totals Row */}
                    <tr className="border-t-2 border-b-2 border-gray-900 bg-gray-50 font-bold text-gray-900">
                      <td colSpan={2} className="py-2.5 px-3 text-left uppercase tracking-wider font-extrabold">
                        TOTALS
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-xs font-extrabold text-green-900 whitespace-nowrap">
                        {formatAmount(totalDebit)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-xs font-extrabold text-green-900 whitespace-nowrap">
                        {formatAmount(totalCredit)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Zero-Heads Skipped Badge (System rule explanation) */}
              {voucher.zeroHeadsSkipped !== undefined && voucher.zeroHeadsSkipped > 0 && (
                <div className="mt-3 text-[11px] text-gray-500 bg-gray-50 px-3 py-1.5 rounded border border-gray-200">
                  <span className="font-semibold text-gray-700">Zero-Suppression Applied:</span>{" "}
                  {voucher.zeroHeadsSkipped} inactive salary heads with ₹0 balance were omitted from this voucher to keep the ledger clean.
                </div>
              )}

              {/* Dotted Separator */}
              <div className="border-b border-dotted border-gray-300 my-4" />

              {/* Rupees in Words & Narration */}
              <div className="space-y-1.5 text-xs">
                <div>
                  <span className="font-bold text-gray-900 uppercase">
                    RUPEES IN WORDS:{" "}
                  </span>
                  <span className="font-medium text-gray-800">
                    {rupeesInWords}
                  </span>
                </div>
                <div className="text-[11px] text-gray-500 font-mono">
                  (Amount: ₹ {formatAmount(totalDebit)})
                </div>
                <div className="pt-1">
                  <span className="font-semibold text-gray-800">Narration: </span>
                  <span className="text-gray-700 italic">
                    Salary payment booking for {voucher.payrollPeriod} - {voucher.employeeCount || "all"} employees at {voucher.site?.siteName || voucher.site?.siteId}
                  </span>
                </div>
              </div>

              {/* Dotted Separator */}
              <div className="border-b border-dotted border-gray-300 my-6" />

              {/* Signatures & Audit Trail (3 Columns) */}
              <div className="grid grid-cols-3 gap-4 pt-6 text-center text-xs">
                <div className="border-t border-gray-700 pt-2">
                  <p className="font-bold text-gray-900">Prepared By</p>
                  <p className="text-gray-500 text-[11px] mt-0.5">
                    {voucher.auditTrail?.createdBy || "System (Auto-Trigger)"}
                  </p>
                </div>
                <div className="border-t border-gray-700 pt-2">
                  <p className="font-bold text-gray-900">Checked By</p>
                  <p className="text-gray-500 text-[11px] mt-0.5">
                    {voucher.auditTrail?.lockedBy || "Pending / System"}
                  </p>
                </div>
                <div className="border-t border-gray-700 pt-2">
                  <p className="font-bold text-gray-900">Authorised By</p>
                  <p className="text-gray-500 text-[11px] mt-0.5">
                    ae1 (Account Executive)
                  </p>
                </div>
              </div>

              {/* Computer Generated Notice */}
              <div className="text-center text-[10px] text-gray-400 mt-8 font-light">
                This is a computer-generated document. No signature is required.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

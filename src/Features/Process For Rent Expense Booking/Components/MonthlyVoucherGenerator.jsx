import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  generateMonthlyVoucher,
  selectVoucherGenLoading,
} from "../../../store/slices/rentExpenseSlice";
import { toast } from "react-toastify";

const val = (v) => (v === undefined || v === null || String(v).trim() === "" ? "-" : String(v));

const MonthlyVoucherGenerator = ({ site, agreement, onSuccess, onCancel }) => {
  const dispatch = useDispatch();
  const loading = useSelector(selectVoucherGenLoading);

  const [month, setMonth] = useState("");
  const [amount, setAmount] = useState("");
  const [validationError, setValidationError] = useState("");

  // Auto-populate month to current month or agreement start month
  useEffect(() => {
    if (agreement?.startDate) {
      setMonth(agreement.startDate.slice(0, 7));
    } else {
      const now = new Date();
      const yr = now.getFullYear();
      const mo = String(now.getMonth() + 1).padStart(2, "0");
      setMonth(`${yr}-${mo}`);
    }
  }, [agreement]);

  // Auto-populate monthly total rent amount from agreement calculations or site
  useEffect(() => {
    const monthlyTotal =
      agreement?.calculations?.monthlyTotal ||
      agreement?.monthlyTotal ||
      agreement?.amount ||
      site?.monthlyRent;

    if (monthlyTotal) {
      setAmount(monthlyTotal.toString());
    }
  }, [agreement, site]);

  // Validate selected month
  const validateMonth = (selectedMonth) => {
    if (!selectedMonth) {
      setValidationError("");
      return true;
    }

    if (agreement?.startDate && agreement?.endDate) {
      const selected = new Date(selectedMonth + "-01");
      const start = new Date(agreement.startDate);
      const end = new Date(agreement.endDate);

      const selectedFirstDay = new Date(selected.getFullYear(), selected.getMonth(), 1);
      const startFirstDay = new Date(start.getFullYear(), start.getMonth(), 1);
      const endFirstDay = new Date(end.getFullYear(), end.getMonth(), 1);

      if (selectedFirstDay < startFirstDay) {
        setValidationError(`Selected month is before agreement start date (${agreement.startDate})`);
        return false;
      }

      if (selectedFirstDay > endFirstDay) {
        setValidationError(`Selected month is after agreement end date (${agreement.endDate})`);
        return false;
      }
    }

    setValidationError("");
    return true;
  };

  const handleMonthChange = (e) => {
    const selectedMonth = e.target.value;
    setMonth(selectedMonth);
    validateMonth(selectedMonth);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!site?.siteId) {
      toast.error("Site ID is missing");
      return;
    }

    const agreementId = site.currentAgreementId || agreement?.agreementId;
    if (!agreementId) {
      toast.error("Active agreement ID is missing for this site");
      return;
    }

    if (!month) {
      toast.error("Please select a month for voucher generation");
      return;
    }

    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid monthly rent amount");
      return;
    }

    if (!validateMonth(month)) {
      toast.error(validationError || "Invalid month selected");
      return;
    }

    try {
      // Construct exact JSON payload for POST /accounts/rent-expense/vouchers/generate
      const payload = {
        siteId: site.siteId,
        agreementId: agreementId,
        month: month,
        amount: parseFloat(amount),
      };

      const result = await dispatch(generateMonthlyVoucher(payload)).unwrap();
      toast.success(result?.message || `Rent voucher for ${month} generated successfully!`);

      if (onSuccess) {
        onSuccess(result?.data || result);
      }
    } catch (err) {
      console.error("❌ Failed to generate monthly voucher:", err);
      const errMsg = err?.message || err?.responseData?.message || "Failed to generate monthly voucher. Please try again.";
      toast.error(errMsg);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-2xl">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white px-6 py-5 relative overflow-hidden flex items-center justify-between shadow-md">
        <div className="absolute right-0 top-0 bottom-0 w-48 bg-white/5 transform skew-x-12 translate-x-12 pointer-events-none"></div>
        <div className="flex items-center gap-3.5 z-10">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 backdrop-blur-md flex items-center justify-center text-emerald-300 text-xl font-bold shadow-inner">
            🧾
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              Generate Monthly Rent Voucher
            </h2>
            <p className="text-xs text-emerald-100/80 font-medium mt-0.5">
              Trigger automated accounting entry for <span className="text-emerald-300 font-bold">{val(site?.siteName)}</span>
            </p>
          </div>
        </div>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="z-10 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white hover:text-red-300 transition-all flex items-center justify-center text-sm font-bold backdrop-blur-xs cursor-pointer border border-white/10"
          >
            ✕
          </button>
        )}
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="p-5 sm:p-7 space-y-5 overflow-y-auto max-h-[calc(92vh-130px)]">
        {/* Site Overview Badge */}
        {site && (
          <div className="bg-gradient-to-r from-slate-50 via-emerald-50/30 to-teal-50/20 border border-emerald-100 rounded-xl p-4 shadow-2xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs sm:text-sm">
              <div>
                <span className="text-slate-400 font-medium block text-xs uppercase tracking-wider">Site Name</span>
                <strong className="font-bold text-slate-800 text-sm">{val(site.siteName)}</strong>
              </div>
              <div>
                <span className="text-slate-400 font-medium block text-xs uppercase tracking-wider">Location</span>
                <span className="font-semibold text-slate-700 truncate block">{val(site.location)}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block text-xs uppercase tracking-wider">City / State</span>
                <span className="font-semibold text-slate-700">{val(site.city)}, {val(site.state)}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block text-xs uppercase tracking-wider">Agreement Reference</span>
                <span className="font-mono text-xs font-bold bg-emerald-100/80 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-200 inline-block mt-0.5">
                  {val(site.currentAgreementId || agreement?.agreementId)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Inputs */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
                Target Billing Month (YYYY-MM) <span className="text-red-500">*</span>
              </label>
              <input
                type="month"
                value={month}
                onChange={handleMonthChange}
                min={agreement?.startDate ? agreement.startDate.slice(0, 7) : undefined}
                max={agreement?.endDate ? agreement.endDate.slice(0, 7) : undefined}
                className={`w-full px-4 py-3 bg-slate-50/50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition-all text-sm font-bold text-slate-800 ${
                  validationError ? "border-red-500 focus:ring-red-500/30" : "border-slate-200 focus:ring-emerald-500/30 focus:border-emerald-600"
                }`}
                required
              />
              {agreement?.startDate && agreement?.endDate && (
                <p className="text-[11px] text-slate-500 font-medium mt-1">
                  Lease Term: {agreement.startDate} to {agreement.endDate}
                </p>
              )}
              {validationError && <p className="text-red-500 text-xs font-medium mt-1">⚠️ {validationError}</p>}
            </div>

            <div>
              <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
                Monthly Total Payable Amount (₹) <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center">
                <span className="bg-emerald-600 text-white font-black px-3.5 py-3 rounded-l-xl border border-r-0 border-emerald-600 text-sm flex items-center justify-center">
                  ₹
                </span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="1"
                  step="0.01"
                  placeholder="e.g. 118000"
                  className="w-full px-4 py-3 bg-slate-50/50 border rounded-r-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 transition-all text-sm font-bold text-slate-800"
                  required
                />
              </div>
              <p className="text-[11px] text-slate-500 font-medium mt-1">
                Auto-populated from agreement terms (Base Rent + GST).
              </p>
            </div>
          </div>
        </div>

        {/* Expected Accounting GL Entries Preview */}
        <div className="bg-gradient-to-br from-slate-900 via-teal-950 to-emerald-950 text-white rounded-xl p-4 sm:p-5 shadow-lg border border-emerald-700/50 space-y-3">
          <div className="flex items-center justify-between border-b border-emerald-800/80 pb-2.5">
            <h4 className="font-extrabold text-emerald-300 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <span>🏛️</span> General Ledger Entry Preview
            </h4>
            <span className="bg-emerald-500/20 text-emerald-300 font-bold px-2.5 py-0.5 rounded-full text-xs border border-emerald-400/30">
              Auto Posting
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center bg-white/5 p-2 rounded-lg border border-white/10">
              <div>
                <span className="font-bold text-emerald-300 block">DEBIT: RENT EXPENSE</span>
                <span className="text-[11px] text-slate-300">GL: X2001002002 (Branch Office Rent)</span>
              </div>
              <strong className="text-white text-sm">
                ₹{agreement?.calculations?.monthlyBaseRent ? Number(agreement.calculations.monthlyBaseRent).toLocaleString() : val(amount)}
              </strong>
            </div>

            {(agreement?.withGST || agreement?.calculations?.monthlyGST > 0) && (
              <div className="flex justify-between items-center bg-white/5 p-2 rounded-lg border border-white/10">
                <div>
                  <span className="font-bold text-amber-300 block">DEBIT: INPUT GST (CGST + SGST)</span>
                  <span className="text-[11px] text-slate-300">GL: A3007001001 / A3007001002 (18% Rate)</span>
                </div>
                <strong className="text-amber-200 text-sm">
                  ₹{agreement?.calculations?.monthlyGST ? Number(agreement.calculations.monthlyGST).toLocaleString() : "-"}
                </strong>
              </div>
            )}

            <div className="flex justify-between items-center bg-white/5 p-2 rounded-lg border border-white/10">
              <div>
                <span className="font-bold text-blue-300 block">CREDIT: VENDOR PAYABLE LEDGER</span>
                <span className="text-[11px] text-slate-300">Owner: {val(agreement?.owner || site?.owners?.[0]?.ownerName)}</span>
              </div>
              <strong className="text-emerald-400 text-sm">
                ₹{Number(amount || 0).toLocaleString()}
              </strong>
            </div>
          </div>
        </div>

        {/* Footer Action Bar */}
        <div className="pt-3 border-t border-slate-100 flex flex-col-reverse sm:flex-row gap-3 items-center justify-end">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="w-full sm:w-auto px-6 py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl font-bold text-sm transition cursor-pointer focus:outline-none"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading || !!validationError || !month || !amount}
            className="w-full sm:w-auto flex-1 sm:flex-initial px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-extrabold text-sm shadow-md hover:shadow-lg transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing Rent Voucher...
              </>
            ) : (
              "Generate Monthly Rent Voucher"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MonthlyVoucherGenerator;
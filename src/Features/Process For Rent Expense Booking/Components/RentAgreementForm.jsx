import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createRentAgreement, selectAgreementLoading } from "../../../store/slices/rentExpenseSlice";
import { toast } from "react-toastify";

export default function RentAgreementForm({ site, onSuccess, onCancel }) {
  const dispatch = useDispatch();
  const agreementLoading = useSelector(selectAgreementLoading);

  const [form, setForm] = useState({
    ownerId: "",
    file: null,
    startDate: "",
    endDate: "",
    amount: "",
    withGST: false,
  });

  const [errors, setErrors] = useState({});

  // Auto-select initial owner from site details
  useEffect(() => {
    if (site?.owners && site.owners.length > 0) {
      setForm((prev) => ({
        ...prev,
        ownerId: site.owners[0]?.ownerId || site.owners[0]?.id || "",
      }));
    }
    if (site?.rentConfig?.gstExpected === "yes") {
      setForm((prev) => ({ ...prev, withGST: true }));
    }
  }, [site]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    const val = type === "checkbox" ? checked : type === "file" ? files[0] : value;

    setForm((prev) => ({
      ...prev,
      [name]: val,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Client-side calculations preview
  const getCalculationsPreview = () => {
    if (!form.startDate || !form.endDate || !form.amount || isNaN(form.amount) || parseFloat(form.amount) <= 0) {
      return null;
    }

    const start = new Date(form.startDate);
    const end = new Date(form.endDate);

    if (end <= start) return null;

    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + 1;
    if (months <= 0) return null;

    const baseRentTotal = parseFloat(form.amount);
    const monthlyBaseRent = Math.round((baseRentTotal / months) * 100) / 100;
    const totalGST = form.withGST ? Math.round((baseRentTotal * 0.18) * 100) / 100 : 0;
    const monthlyGST = form.withGST ? Math.round((totalGST / months) * 100) / 100 : 0;
    const grandTotal = Math.round((baseRentTotal + totalGST) * 100) / 100;
    const monthlyTotal = Math.round((monthlyBaseRent + monthlyGST) * 100) / 100;

    return {
      totalMonths: months,
      baseRentTotal,
      monthlyBaseRent,
      monthlyGST,
      totalGST,
      grandTotal,
      monthlyTotal,
    };
  };

  const calculations = getCalculationsPreview();

  const validate = () => {
    const newErrors = {};

    if (!site?.siteId) {
      newErrors.site = "Site ID is missing";
    }

    if (!form.ownerId) {
      newErrors.ownerId = "Please select an owner for this agreement";
    }

    if (!form.startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!form.endDate) {
      newErrors.endDate = "End date is required";
    } else if (form.startDate && new Date(form.endDate) <= new Date(form.startDate)) {
      newErrors.endDate = "End date must be after start date";
    }

    if (!form.amount || isNaN(form.amount) || parseFloat(form.amount) <= 0) {
      newErrors.amount = "Please enter a valid monthly rent amount";
    }

    if (!form.file) {
      newErrors.file = "Signed rent agreement PDF file is required";
    } else {
      const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(form.file.type)) {
        newErrors.file = "Only PDF and image files (JPG, PNG) are allowed";
      } else if (form.file.size > 10 * 1024 * 1024) {
        newErrors.file = "File size must not exceed 10 MB";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fix all form validation errors before submitting.");
      return;
    }

    try {
      // Construct exact FormData payload matching Postman specification
      const formDataPayload = new FormData();
      formDataPayload.append("siteId", site.siteId);
      formDataPayload.append("ownerId", form.ownerId);
      formDataPayload.append("startDate", form.startDate);
      formDataPayload.append("endDate", form.endDate);
      formDataPayload.append("amount", String(parseFloat(form.amount)));
      formDataPayload.append("withGST", String(Boolean(form.withGST)));
      formDataPayload.append("agreementFile", form.file);

      const result = await dispatch(createRentAgreement(formDataPayload)).unwrap();
      toast.success(result?.message || "Rent agreement uploaded successfully!");

      if (onSuccess) {
        onSuccess(result?.data || result);
      }
    } catch (err) {
      console.error("❌ Failed to upload rent agreement:", err);
      const errMsg = err?.message || err?.responseData?.message || "Failed to upload rent agreement. Please try again.";
      toast.error(errMsg);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-2xl">
      {/* Premium Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white px-6 py-5 relative overflow-hidden flex items-center justify-between shadow-md">
        <div className="absolute right-0 top-0 bottom-0 w-48 bg-white/5 transform skew-x-12 translate-x-12 pointer-events-none"></div>
        <div className="flex items-center gap-3.5 z-10">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 backdrop-blur-md flex items-center justify-center text-emerald-300 text-xl font-bold shadow-inner">
            📋
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              Upload Rent Agreement
            </h2>
            <p className="text-xs text-emerald-100/80 font-medium mt-0.5">
              Official lease terms & monthly rent configuration for <span className="text-emerald-300 font-bold">{site?.siteName}</span>
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

      {/* Scrollable Form Body */}
      <div className="p-5 sm:p-7 space-y-5 overflow-y-auto max-h-[calc(92vh-130px)]">
        {/* Site Details Card */}
        {site && (
          <div className="bg-gradient-to-r from-slate-50 via-emerald-50/40 to-teal-50/30 border border-emerald-100 rounded-xl p-4 shadow-2xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs sm:text-sm">
              <div>
                <span className="text-slate-400 font-medium block text-xs uppercase tracking-wider">Site Name</span>
                <strong className="font-bold text-slate-800 text-sm">{site.siteName || "-"}</strong>
              </div>
              <div>
                <span className="text-slate-400 font-medium block text-xs uppercase tracking-wider">Location</span>
                <span className="font-semibold text-slate-700 truncate block">{site.location || "-"}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block text-xs uppercase tracking-wider">City & State</span>
                <span className="font-semibold text-slate-700">{site.city || "-"}, {site.state || "-"}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block text-xs uppercase tracking-wider">Site Reference ID</span>
                <span className="font-mono text-xs font-bold bg-emerald-100/80 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-200 inline-block mt-0.5">
                  {site.siteId}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Form Inputs Section */}
        <div className="space-y-4">
          {/* Owner Selection Field */}
          <div>
            <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
              Landlord / Owner <span className="text-red-500">*</span>
            </label>
            {site?.owners && site.owners.length > 1 ? (
              <select
                name="ownerId"
                value={form.ownerId}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-slate-50/50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition-all text-sm font-semibold ${
                  errors.ownerId ? "border-red-500 focus:ring-red-500/30" : "border-slate-200 focus:ring-emerald-500/30 focus:border-emerald-600"
                }`}
              >
                <option value="">Select Owner</option>
                {site.owners.map((owner) => (
                  <option key={owner.ownerId || owner.id} value={owner.ownerId || owner.id}>
                    {owner.ownerName} ({owner.glCode || owner.panNumber || "Owner"})
                  </option>
                ))}
              </select>
            ) : (
              <div className="p-3.5 bg-gradient-to-r from-blue-50/80 to-indigo-50/60 border border-blue-200/80 rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm text-blue-950 flex items-center gap-2">
                    <span>👤</span> {site?.owners?.[0]?.ownerName || site?.ownerDetails?.ownerName || "Primary Owner"}
                  </p>
                  <p className="text-xs text-blue-700 font-medium mt-0.5">
                    GL Code: <span className="font-mono font-bold text-blue-900">{site?.owners?.[0]?.glCode || "L2005"}</span> | PAN: {site?.owners?.[0]?.panNumber || "-"}
                  </p>
                </div>
                <span className="text-[11px] bg-blue-600 text-white font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-2xs">
                  Auto-Assigned
                </span>
              </div>
            )}
            {errors.ownerId && <p className="text-red-500 text-xs font-medium mt-1">⚠️ {errors.ownerId}</p>}
          </div>

          {/* Lease Start & End Date Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
                Lease Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-slate-50/50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition-all text-sm font-medium ${
                  errors.startDate ? "border-red-500 focus:ring-red-500/30" : "border-slate-200 focus:ring-emerald-500/30 focus:border-emerald-600"
                }`}
              />
              {errors.startDate && <p className="text-red-500 text-xs font-medium mt-1">⚠️ {errors.startDate}</p>}
            </div>

            <div>
              <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
                Lease End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                min={form.startDate}
                className={`w-full px-4 py-3 bg-slate-50/50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition-all text-sm font-medium ${
                  errors.endDate ? "border-red-500 focus:ring-red-500/30" : "border-slate-200 focus:ring-emerald-500/30 focus:border-emerald-600"
                }`}
              />
              {errors.endDate && <p className="text-red-500 text-xs font-medium mt-1">⚠️ {errors.endDate}</p>}
            </div>
          </div>

          {/* Monthly Rent Amount & GST Configuration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
                Total Base Rent Amount (₹) <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center">
                <span className="bg-emerald-600 text-white font-black px-3.5 py-3 rounded-l-xl border border-r-0 border-emerald-600 text-sm flex items-center justify-center">
                  ₹
                </span>
                <input
                  type="number"
                  name="amount"
                  placeholder="e.g. 25000"
                  value={form.amount}
                  onChange={handleChange}
                  min="1"
                  step="0.01"
                  className={`w-full px-4 py-3 bg-slate-50/50 border rounded-r-xl focus:bg-white focus:outline-none focus:ring-2 transition-all text-sm font-bold text-slate-800 ${
                    errors.amount ? "border-red-500 focus:ring-red-500/30" : "border-slate-200 focus:ring-emerald-500/30 focus:border-emerald-600"
                  }`}
                />
              </div>
              <p className="text-[11px] text-slate-500 font-medium mt-1">
                Total base rent for full lease term. System automatically calculates monthly breakdown.
              </p>
              {errors.amount && <p className="text-red-500 text-xs font-medium mt-1">⚠️ {errors.amount}</p>}
            </div>

            {/* GST Card Switch */}
            <div className="flex items-center">
              <div className={`w-full border rounded-xl p-3.5 transition-all ${
                form.withGST ? "bg-amber-50/90 border-amber-300 shadow-2xs" : "bg-slate-50/70 border-slate-200"
              }`}>
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    name="withGST"
                    checked={form.withGST}
                    onChange={handleChange}
                    className="h-5 w-5 text-emerald-600 border-slate-300 rounded-md focus:ring-emerald-500 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800 block">
                      Include GST (18% Applicable)
                    </span>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                      {form.withGST ? "18% GST added to base monthly amount." : "Non-GST / Exempted lease rate."}
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Agreement PDF Upload Zone */}
          <div>
            <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
              Signed Rent Agreement PDF Document <span className="text-red-500">*</span>
            </label>
            <div className={`border-2 border-dashed rounded-xl p-4 text-center transition-all ${
              form.file ? "border-emerald-500 bg-emerald-50/60" : errors.file ? "border-red-400 bg-red-50/30" : "border-emerald-300/80 bg-emerald-50/20 hover:bg-emerald-50/50 hover:border-emerald-400"
            }`}>
              <input
                type="file"
                id="agreementFileInput"
                name="file"
                onChange={handleChange}
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
              />
              <label htmlFor="agreementFileInput" className="cursor-pointer block space-y-1.5">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-lg font-bold shadow-xs">
                  📁
                </div>
                {form.file ? (
                  <div>
                    <span className="text-sm font-bold text-emerald-900 block truncate max-w-xs mx-auto">
                      ✓ {form.file.name}
                    </span>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-200/80 px-2 py-0.5 rounded-full inline-block mt-1">
                      {Math.round(form.file.size / 1024)} KB Attached
                    </span>
                  </div>
                ) : (
                  <div>
                    <span className="text-sm font-bold text-slate-700 block">
                      Click to choose or attach PDF agreement file
                    </span>
                    <span className="text-xs text-slate-400 block font-medium">
                      Supports PDF, JPG, PNG (Max size: 10 MB)
                    </span>
                  </div>
                )}
              </label>
            </div>
            {errors.file && <p className="text-red-500 text-xs font-medium mt-1">⚠️ {errors.file}</p>}
          </div>
        </div>

        {/* Financial Summary Card */}
        {calculations && (
          <div className="bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-900 text-white rounded-xl p-4 sm:p-5 shadow-lg border border-emerald-700/50 space-y-3">
            <div className="flex items-center justify-between border-b border-emerald-800/80 pb-2.5">
              <h4 className="font-extrabold text-emerald-300 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <span>📊</span> Agreement Financial Breakdown
              </h4>
              <span className="bg-emerald-500/20 text-emerald-300 font-bold px-2.5 py-0.5 rounded-full text-xs border border-emerald-400/30">
                {calculations.totalMonths} Month Lease Term
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs sm:text-sm">
              <div>
                <span className="text-emerald-200/70 block text-[11px] uppercase tracking-wider font-semibold">Monthly Base Rent</span>
                <strong className="text-white font-bold text-sm sm:text-base">₹{calculations.monthlyBaseRent.toLocaleString()}</strong>
              </div>
              {form.withGST && (
                <div>
                  <span className="text-amber-300/80 block text-[11px] uppercase tracking-wider font-semibold">Monthly GST (18%)</span>
                  <strong className="text-amber-200 font-bold text-sm sm:text-base">₹{calculations.monthlyGST.toLocaleString()}</strong>
                </div>
              )}
              <div>
                <span className="text-emerald-200/70 block text-[11px] uppercase tracking-wider font-semibold">Monthly Total Payable</span>
                <strong className="text-emerald-400 font-extrabold text-base sm:text-lg">₹{calculations.monthlyTotal.toLocaleString()}</strong>
              </div>
              <div>
                <span className="text-emerald-200/70 block text-[11px] uppercase tracking-wider font-semibold">Grand Total Lease</span>
                <strong className="text-white font-extrabold text-base sm:text-lg">₹{calculations.grandTotal.toLocaleString()}</strong>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Action Bar */}
      <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-col-reverse sm:flex-row gap-3 items-center justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={agreementLoading}
            className="w-full sm:w-auto px-6 py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl font-bold text-sm transition cursor-pointer focus:outline-none"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={agreementLoading}
          className="w-full sm:w-auto flex-1 sm:flex-initial px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-extrabold text-sm shadow-md hover:shadow-lg transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
        >
          {agreementLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading Agreement...
            </>
          ) : (
            "Save & Upload Agreement"
          )}
        </button>
      </div>
    </form>
  );
}
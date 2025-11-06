import React, { useState, useEffect } from "react";

export default function RentAgreementForm({ site, onSuccess }) {
  const [form, setForm] = useState({
    owner: "",
    file: null,
    startDate: "",
    endDate: "",
    amount: "",
    withGST: false,
  });

  const [calculations, setCalculations] = useState({
    totalVouchers: 0,
    baseRentTotal: 0,
    totalGST: 0,
    grandTotal: 0,
    monthlyBaseRent: 0,
    monthlyGST: 0,
    monthlyTotal: 0,
  });

  // ✅ NEW: Auto-populate owner if site has owner
  useEffect(() => {
    if (site?.owners && site.owners.length > 0) {
      const ownerNames = site.owners.map(o => o.ownerName).join(", ");
      setForm(prev => ({
        ...prev,
        owner: ownerNames
      }));
      
      // Pre-fill GST checkbox based on site configuration
      if (site.rentConfig?.gstExpected === "yes") {
        setForm(prev => ({ ...prev, withGST: true }));
      }
    }
  }, [site]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "file" ? files[0] : value,
    }));
  };

  // Calculate vouchers and amounts whenever dates or amount changes
  useEffect(() => {
    if (form.startDate && form.endDate && form.amount) {
      const start = new Date(form.startDate);
      const end = new Date(form.endDate);

      const months =
        (end.getFullYear() - start.getFullYear()) * 12 +
        (end.getMonth() - start.getMonth()) +
        1;

      const baseRentTotal = parseFloat(form.amount);
      const monthlyBaseRent = Math.round(baseRentTotal / months);
      
      // Calculate GST properly
      const totalGST = form.withGST ? Math.round(baseRentTotal * 0.18) : 0;
      const monthlyGST = form.withGST ? Math.round(totalGST / months) : 0;
      
      const grandTotal = baseRentTotal + totalGST;
      const monthlyTotal = monthlyBaseRent + monthlyGST;

      setCalculations({
        totalVouchers: months,
        baseRentTotal,
        totalGST,
        grandTotal,
        monthlyBaseRent,
        monthlyGST,
        monthlyTotal,
      });
    }
  }, [form.startDate, form.endDate, form.amount, form.withGST]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate dates
    if (new Date(form.endDate) <= new Date(form.startDate)) {
      alert("End date must be after start date");
      return;
    }

    if (calculations.totalVouchers <= 0) {
      alert("Invalid date range");
      return;
    }
    
    // Create agreement data with correct monthly amounts
    const agreementData = {
      agreementId: `AGR-${Date.now()}`,
      siteId: site?.siteId || null,
      siteName: site?.siteName || "",
      siteLocation: site?.location || "",
      siteCity: site?.city || "",
      siteState: site?.state || "",
      
      // Owner Information
      owner: form.owner,
      ownerDetails: site?.owners || [],
      
      // Agreement Details
      startDate: form.startDate,
      endDate: form.endDate,
      amount: parseFloat(form.amount),
      withGST: form.withGST,
      
      // File
      file: form.file,
      fileUrl: form.file ? URL.createObjectURL(form.file) : null,
      fileName: form.file?.name || "",
      
      // Calculated Amounts
      monthlyBaseRent: calculations.monthlyBaseRent,
      monthlyGST: calculations.monthlyGST,
      monthlyTotal: calculations.monthlyTotal,
      totalVouchers: calculations.totalVouchers,
      totalGST: calculations.totalGST,
      grandTotal: calculations.grandTotal,
      
      // Metadata
      status: "active",
      createdAt: new Date().toISOString(),
      createdBy: "current_user" // Replace with actual user
    };

    if (onSuccess) onSuccess(agreementData);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
      <h2 className="text-2xl font-semibold text-green-700 mb-4">Upload Rent Agreement</h2>
      
      {/* Site Information Display */}
      {site && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Site Information</h3>
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
            <div><strong>Site:</strong> {site.siteName}</div>
            <div><strong>Location:</strong> {site.location}</div>
            <div><strong>City:</strong> {site.city}</div>
            <div><strong>State:</strong> {site.state}</div>
          </div>
        </div>
      )}
      
      {/* Calculation Preview */}
      {form.startDate && form.endDate && form.amount && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6 text-sm">
          <h3 className="text-base font-semibold text-blue-800 mb-3">Agreement Summary</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-blue-700">Total Vouchers:</span>
                <span className="font-semibold text-blue-900">{calculations.totalVouchers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Base Rent (Total):</span>
                <span className="font-semibold text-blue-900">₹{calculations.baseRentTotal.toLocaleString()}</span>
              </div>
              {form.withGST && (
                <>
                  <div className="flex justify-between">
                    <span className="text-blue-700">GST @18%:</span>
                    <span className="font-semibold text-blue-900">₹{calculations.totalGST.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t border-blue-300 pt-2">
                    <span className="text-blue-700 font-semibold">Grand Total:</span>
                    <span className="font-bold text-blue-900">₹{calculations.grandTotal.toLocaleString()}</span>
                  </div>
                </>
              )}
            </div>
            
            <div className="space-y-2 sm:border-l sm:border-blue-300 sm:pl-4">
              <p className="text-xs text-blue-600 font-semibold mb-2">Per Month Breakdown:</p>
              <div className="flex justify-between">
                <span className="text-blue-700">Monthly Base Rent:</span>
                <span className="font-semibold text-blue-900">₹{calculations.monthlyBaseRent.toLocaleString()}</span>
              </div>
              {form.withGST && (
                <div className="flex justify-between">
                  <span className="text-blue-700">Monthly GST:</span>
                  <span className="font-semibold text-blue-900">₹{calculations.monthlyGST.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-blue-300 pt-2">
                <span className="text-blue-700 font-semibold">Monthly Total:</span>
                <span className="font-bold text-blue-900 text-lg">₹{calculations.monthlyTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {/* Owner Name */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Owner Name / Ledger <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="owner"
            placeholder="Enter owner name or ledger"
            value={form.owner}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          {site?.owners && site.owners.length > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              From site: {site.owners.map(o => o.ownerName).join(", ")}
            </p>
          )}
        </div>

        {/* Total Rent Amount */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Total Rent Amount <span className="text-red-500">*</span>
            <span className="text-xs text-gray-500 ml-2">
              {form.withGST ? "(Base Amount - GST will be calculated)" : "(Total Amount)"}
            </span>
          </label>
          <input
            type="number"
            name="amount"
            placeholder="Enter total rent amount for agreement period"
            value={form.amount}
            onChange={handleChange}
            required
            min="1"
            step="0.01"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          {site?.rentConfig?.expectedMinRent && site?.rentConfig?.expectedMaxRent && (
            <p className="text-xs text-gray-500 mt-1">
              Expected range: ₹{site.rentConfig.expectedMinRent.toLocaleString()} - ₹{site.rentConfig.expectedMaxRent.toLocaleString()}
            </p>
          )}
        </div>

        {/* Upload Agreement */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Upload Agreement (PDF) <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            name="file"
            onChange={handleChange}
            accept="application/pdf"
            required
            className="w-full p-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
          />
          <p className="text-xs text-gray-500 mt-1">Maximum file size: 5MB</p>
        </div>

        {/* Start and End Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Start Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              End Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              required
              min={form.startDate}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* GST Checkbox */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="withGST"
              checked={form.withGST}
              onChange={handleChange}
              className="mt-1 h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <div>
              <span className="text-sm font-medium text-gray-700">
                Include GST (18% will be added to base amount)
              </span>
              <p className="text-xs text-gray-600 mt-1">
                If checked, GST will be calculated separately and added to the base rent amount
              </p>
              {site?.rentConfig?.gstExpected && (
                <p className="text-xs text-blue-600 mt-1">
                  Site expectation: GST {site.rentConfig.gstExpected}
                </p>
              )}
            </div>
          </label>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
        <button
          type="submit"
          className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition focus:outline-none focus:ring-2 focus:ring-green-500 font-medium"
        >
          Save Agreement
        </button>
      </div>
    </form>
  );
}
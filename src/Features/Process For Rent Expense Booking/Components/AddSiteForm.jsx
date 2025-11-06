// AddSiteForm.jsx
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { createVendorLedger } from "../../Master/utils/accountingHelpers";

export default function AddSiteForm({ onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    // Site Details
    siteName: "",
    siteCode: "",
    location: "",
    city: "",
    state: "",
    pinCode: "",
    status: "active",
    
    // Owner Toggle
    addOwnerNow: false,
    ownerType: "individual",
    
    // Single Owner Details
    ownerName: "",
    panNumber: "",
    gstin: "",
    contactNumber: "",
    email: "",
    ownerAddress: "",
    
    // Multiple Owners
    primaryOwnerName: "",
    otherOwners: "",
    primaryPAN: "",
    
    // Rent Configuration (Optional)
    expectedMinRent: "",
    expectedMaxRent: "",
    gstExpected: "not_sure",
    tdsApplicable: true
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-generate site code
  useEffect(() => {
    if (formData.siteName && formData.city) {
      const code = generateSiteCode(formData.siteName, formData.city);
      setFormData(prev => ({ ...prev, siteCode: code }));
    }
  }, [formData.siteName, formData.city]);

  const generateSiteCode = (name, city) => {
    const namePrefix = name.substring(0, 3).toUpperCase();
    const cityPrefix = city.substring(0, 3).toUpperCase();
    const random = Math.floor(Math.random() * 100);
    return `${cityPrefix}-${namePrefix}-${random}`;
  };

  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Delhi", "Jammu and Kashmir", "Ladakh", "Puducherry"
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Site Details Validation
    if (!formData.siteName.trim()) {
      newErrors.siteName = "Site name is required";
    } else if (formData.siteName.length < 2) {
      newErrors.siteName = "Site name must be at least 2 characters";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.state) {
      newErrors.state = "State is required";
    }

    if (!formData.pinCode) {
      newErrors.pinCode = "PIN code is required";
    } else if (!/^\d{6}$/.test(formData.pinCode)) {
      newErrors.pinCode = "PIN code must be 6 digits";
    }

    // Owner Details Validation (if adding owner)
    if (formData.addOwnerNow) {
      if (formData.ownerType === "individual" || formData.ownerType === "company") {
        if (!formData.ownerName.trim()) {
          newErrors.ownerName = "Owner name is required";
        }

        if (!formData.panNumber) {
          newErrors.panNumber = "PAN number is required";
        } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber)) {
          newErrors.panNumber = "Invalid PAN format (e.g., ABCDE1234F)";
        }

        if (formData.gstin && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.gstin)) {
          newErrors.gstin = "Invalid GSTIN format";
        }

        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = "Invalid email format";
        }

        if (formData.contactNumber && !/^\d{10}$/.test(formData.contactNumber)) {
          newErrors.contactNumber = "Contact number must be 10 digits";
        }
      }

      if (formData.ownerType === "multiple") {
        if (!formData.primaryOwnerName.trim()) {
          newErrors.primaryOwnerName = "Primary owner name is required";
        }

        if (!formData.primaryPAN) {
          newErrors.primaryPAN = "Primary owner PAN is required";
        } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.primaryPAN)) {
          newErrors.primaryPAN = "Invalid PAN format";
        }
      }
    }

    // Rent Range Validation
    if (formData.expectedMinRent && formData.expectedMaxRent) {
      if (parseFloat(formData.expectedMinRent) > parseFloat(formData.expectedMaxRent)) {
        newErrors.expectedMaxRent = "Max rent must be greater than min rent";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix all errors before submitting");
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare site data
      const siteId = `SITE-${Date.now()}`;
      
      const siteData = {
        siteId,
        siteName: formData.siteName.trim(),
        siteCode: formData.siteCode,
        location: formData.location.trim(),
        city: formData.city.trim(),
        state: formData.state,
        pinCode: formData.pinCode,
        status: formData.status,
        isStandalone: !formData.addOwnerNow,
        owners: [],
        rentConfig: {
          expectedMinRent: formData.expectedMinRent || null,
          expectedMaxRent: formData.expectedMaxRent || null,
          gstExpected: formData.gstExpected,
          tdsApplicable: formData.tdsApplicable
        },
        createdAt: new Date().toISOString(),
        createdBy: "current_user" // Replace with actual user
      };

      // Add owner details if provided
      if (formData.addOwnerNow && formData.ownerType !== "multiple") {
  try {
    // ✅ PROPERLY CREATE VENDOR LEDGER IN COA
    const vendorGL = await createVendorLedger(
      `OWN-${Date.now()}`,
      formData.ownerName.trim()
    );
    
    siteData.owners = [{
      ownerId: `OWN-${Date.now()}`,
      ownerName: formData.ownerName.trim(),
      ownerType: formData.ownerType,
      panNumber: formData.panNumber,
      gstin: formData.gstin || null,
      contactNumber: formData.contactNumber || null,
      email: formData.email || null,
      address: formData.ownerAddress || null,
      isPrimary: true,
      glCode: vendorGL, // ✅ Use the ACTUALLY CREATED GL code
      glName: `Rent Payable - ${formData.ownerName.trim()}`,
      createdAt: new Date().toISOString()
    }];
  } catch (error) {
    console.error("Failed to create vendor ledger:", error);
    toast.error("Failed to create vendor accounting ledger");
    return;
  }
}

      // Save to local storage
      const existingSites = JSON.parse(localStorage.getItem("sites") || "[]");
      existingSites.push(siteData);
      localStorage.setItem("sites", JSON.stringify(existingSites));

      toast.success("Site added successfully!");
      onSuccess(siteData);

    } catch (error) {
      console.error("Error adding site:", error);
      toast.error("Failed to add site. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6">
      <h2 className="text-2xl font-semibold text-green-700 mb-4">Add New Site</h2>

      {/* SECTION 1: Site Information */}
      <div className="bg-gray-50 p-4 rounded-lg space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Site Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Site Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Site Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="siteName"
              value={formData.siteName}
              onChange={handleChange}
              placeholder="e.g., Mumbai Office"
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.siteName ? "border-red-500 focus:ring-red-500" : "focus:ring-green-500"
              }`}
            />
            {errors.siteName && <p className="text-red-500 text-xs mt-1">{errors.siteName}</p>}
          </div>

          {/* Site Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Site Code <span className="text-gray-400 text-xs">(Auto-generated)</span>
            </label>
            <input
              type="text"
              name="siteCode"
              value={formData.siteCode}
              onChange={handleChange}
              placeholder="AUTO"
              className="w-full p-3 border rounded-lg bg-gray-100 focus:outline-none"
              readOnly
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location/Address <span className="text-red-500">*</span>
          </label>
          <textarea
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Enter full address"
            rows="2"
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.location ? "border-red-500 focus:ring-red-500" : "focus:ring-green-500"
            }`}
          />
          {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="e.g., Mumbai"
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.city ? "border-red-500 focus:ring-red-500" : "focus:ring-green-500"
              }`}
            />
            {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
          </div>

          {/* State */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              State <span className="text-red-500">*</span>
            </label>
            <select
              name="state"
              value={formData.state}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.state ? "border-red-500 focus:ring-red-500" : "focus:ring-green-500"
              }`}
            >
              <option value="">Select State</option>
              {indianStates.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
            {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
          </div>

          {/* PIN Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              PIN Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="pinCode"
              value={formData.pinCode}
              onChange={handleChange}
              placeholder="400001"
              maxLength="6"
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.pinCode ? "border-red-500 focus:ring-red-500" : "focus:ring-green-500"
              }`}
            />
            {errors.pinCode && <p className="text-red-500 text-xs mt-1">{errors.pinCode}</p>}
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* SECTION 2: Owner Information */}
      <div className="bg-blue-50 p-4 rounded-lg space-y-4">
        <div className="flex items-center justify-between border-b pb-2">
          <h3 className="text-lg font-semibold text-gray-800">Owner Information</h3>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="addOwnerNow"
              checked={formData.addOwnerNow}
              onChange={handleChange}
              className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <span className="text-sm font-medium text-gray-700">Add Owner Details Now</span>
          </label>
        </div>

        {formData.addOwnerNow && (
          <>
            {/* Owner Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Owner Type</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="ownerType"
                    value="individual"
                    checked={formData.ownerType === "individual"}
                    onChange={handleChange}
                    className="h-4 w-4 text-green-600"
                  />
                  <span className="text-sm">Individual</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="ownerType"
                    value="company"
                    checked={formData.ownerType === "company"}
                    onChange={handleChange}
                    className="h-4 w-4 text-green-600"
                  />
                  <span className="text-sm">Company/HUF</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="ownerType"
                    value="multiple"
                    checked={formData.ownerType === "multiple"}
                    onChange={handleChange}
                    className="h-4 w-4 text-green-600"
                  />
                  <span className="text-sm">Multiple Owners</span>
                </label>
              </div>
            </div>

            {/* Single Owner or Company Fields */}
            {(formData.ownerType === "individual" || formData.ownerType === "company") && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Owner Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Owner Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="ownerName"
                      value={formData.ownerName}
                      onChange={handleChange}
                      placeholder="Enter owner name"
                      className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                        errors.ownerName ? "border-red-500 focus:ring-red-500" : "focus:ring-green-500"
                      }`}
                    />
                    {errors.ownerName && <p className="text-red-500 text-xs mt-1">{errors.ownerName}</p>}
                  </div>

                  {/* PAN Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      PAN Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="panNumber"
                      value={formData.panNumber}
                      onChange={handleChange}
                      placeholder="ABCDE1234F"
                      maxLength="10"
                      className={`w-full p-3 border rounded-lg uppercase focus:outline-none focus:ring-2 ${
                        errors.panNumber ? "border-red-500 focus:ring-red-500" : "focus:ring-green-500"
                      }`}
                    />
                    {errors.panNumber && <p className="text-red-500 text-xs mt-1">{errors.panNumber}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* GSTIN */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      GSTIN <span className="text-gray-400 text-xs">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      name="gstin"
                      value={formData.gstin}
                      onChange={handleChange}
                      placeholder="27ABCDE1234F1Z5"
                      maxLength="15"
                      className={`w-full p-3 border rounded-lg uppercase focus:outline-none focus:ring-2 ${
                        errors.gstin ? "border-red-500 focus:ring-red-500" : "focus:ring-green-500"
                      }`}
                    />
                    {errors.gstin && <p className="text-red-500 text-xs mt-1">{errors.gstin}</p>}
                  </div>

                  {/* Contact Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Number <span className="text-gray-400 text-xs">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleChange}
                      placeholder="9876543210"
                      maxLength="10"
                      className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                        errors.contactNumber ? "border-red-500 focus:ring-red-500" : "focus:ring-green-500"
                      }`}
                    />
                    {errors.contactNumber && <p className="text-red-500 text-xs mt-1">{errors.contactNumber}</p>}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-gray-400 text-xs">(Optional)</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="owner@email.com"
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.email ? "border-red-500 focus:ring-red-500" : "focus:ring-green-500"
                    }`}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                {/* Owner Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Owner Address <span className="text-gray-400 text-xs">(Optional)</span>
                  </label>
                  <textarea
                    name="ownerAddress"
                    value={formData.ownerAddress}
                    onChange={handleChange}
                    placeholder="Enter owner's address"
                    rows="2"
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            )}

            {/* Multiple Owners Fields */}
            {formData.ownerType === "multiple" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Primary Owner Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Primary Owner Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="primaryOwnerName"
                      value={formData.primaryOwnerName}
                      onChange={handleChange}
                      placeholder="Primary contact person"
                      className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                        errors.primaryOwnerName ? "border-red-500 focus:ring-red-500" : "focus:ring-green-500"
                      }`}
                    />
                    {errors.primaryOwnerName && <p className="text-red-500 text-xs mt-1">{errors.primaryOwnerName}</p>}
                  </div>

                  {/* Primary PAN */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Primary Owner PAN <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="primaryPAN"
                      value={formData.primaryPAN}
                      onChange={handleChange}
                      placeholder="ABCDE1234F"
                      maxLength="10"
                      className={`w-full p-3 border rounded-lg uppercase focus:outline-none focus:ring-2 ${
                        errors.primaryPAN ? "border-red-500 focus:ring-red-500" : "focus:ring-green-500"
                      }`}
                    />
                    {errors.primaryPAN && <p className="text-red-500 text-xs mt-1">{errors.primaryPAN}</p>}
                  </div>
                </div>

                {/* Other Owners */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Other Owners <span className="text-gray-400 text-xs">(Comma separated)</span>
                  </label>
                  <textarea
                    name="otherOwners"
                    value={formData.otherOwners}
                    onChange={handleChange}
                    placeholder="e.g., Mr. John Doe, Mrs. Jane Smith"
                    rows="2"
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">List additional owners separated by commas</p>
                </div>
              </div>
            )}
          </>
        )}

        {!formData.addOwnerNow && (
          <p className="text-sm text-gray-600 italic">
            Owner details can be added later when creating rent agreement
          </p>
        )}
      </div>

      {/* SECTION 3: Rent Configuration (Optional) */}
      <div className="bg-yellow-50 p-4 rounded-lg space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
          Rent Configuration <span className="text-gray-500 text-sm font-normal">(Optional)</span>
        </h3>
        
        <p className="text-xs text-gray-600">
          These are preliminary settings. Actual rent will be set through rent agreement.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Expected Min Rent */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expected Min Rent (₹)</label>
            <input
              type="number"
              name="expectedMinRent"
              value={formData.expectedMinRent}
              onChange={handleChange}
              placeholder="10000"
              min="0"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Expected Max Rent */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expected Max Rent (₹)</label>
            <input
              type="number"
              name="expectedMaxRent"
              value={formData.expectedMaxRent}
              onChange={handleChange}
              placeholder="50000"
              min="0"
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.expectedMaxRent ? "border-red-500 focus:ring-red-500" : "focus:ring-green-500"
              }`}
            />
            {errors.expectedMaxRent && <p className="text-red-500 text-xs mt-1">{errors.expectedMaxRent}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* GST Expected */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">GST Expected?</label>
            <select
              name="gstExpected"
              value={formData.gstExpected}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
              <option value="not_sure">Not Sure</option>
            </select>
          </div>

          {/* TDS Applicable */}
          {/* <div>
            <label className="flex items-center gap-2 cursor-pointer pt-8">
              <input
                type="checkbox"
                name="tdsApplicable"
                checked={formData.tdsApplicable}
                onChange={handleChange}
                className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <span className="text-sm font-medium text-gray-700">TDS Applicable (Section 194I)</span>
            </label>
            <p className="text-xs text-gray-500 mt-1 ml-6">Default 10% TDS on rent payments</p>
          </div> */}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`flex-1 px-6 py-3 rounded-lg font-medium text-white transition focus:outline-none focus:ring-2 focus:ring-green-500 ${
            isSubmitting 
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Adding Site...
            </span>
          ) : (
            "Add Site"
          )}
        </button>
        
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="flex-1 sm:flex-none px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
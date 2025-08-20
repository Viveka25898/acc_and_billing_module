/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const AdvanceRequestForm = () => {

  //Get the emp name from local storage
  useEffect(() => {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const allUsers = JSON.parse(localStorage.getItem("users")) || [];

  if (currentUser) {
    const fullUser = allUsers.find(u => u.username === currentUser.username);

    setFormData((prev) => ({
      ...prev,
      employeeName: fullUser?.username || '',
      employeeId: fullUser?.employeeId || fullUser?.username || '',
    }));
  }
}, []);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    employeeName: '',
    employeeId: '',
    amount: '',
    reason: [],  // Changed to array for multiple selections
    customReason: '',
    requestDate: new Date().toISOString().slice(0, 10),
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Function to generate unique request ID
  const generateRequestId = () => {
    const existingRequests = JSON.parse(localStorage.getItem('advanceRequests') || '[]');
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const nextNumber = existingRequests.length + 1;
    return `ADV-${year}${month}-${String(nextNumber).padStart(4, '0')}`;
  };

  // Available reason options
  const reasonOptions = [
    'Visit to Client',
    'Travelling Allowance',
    'Petrol Expense',
    'Office Expense',
    'Other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle reason selection
  const handleReasonSelect = (selectedReason) => {
    if (!formData.reason.includes(selectedReason)) {
      setFormData({
        ...formData,
        reason: [...formData.reason, selectedReason]
      });
    }
  };

  // Handle reason removal
  const handleReasonRemove = (reasonToRemove) => {
    setFormData({
      ...formData,
      reason: formData.reason.filter(reason => reason !== reasonToRemove)
    });
  };

  const isFormValid = () => {
    const { employeeName, employeeId, amount, reason, customReason } = formData;
    const hasOtherReason = reason.includes('Other');
    
    if (hasOtherReason) {
      return (
        employeeName.trim() &&
        employeeId.trim() &&
        amount.trim() &&
        reason.length > 0 &&
        customReason.trim()
      );
    }
    return employeeName.trim() && employeeId.trim() && amount.trim() && reason.length > 0;
  };

  const handleSubmit = (e) => {
  e.preventDefault();
  setError('');

  if (!isFormValid()) {
    setError('All fields are required.');
    return;
  }

  // Combine selected reasons with custom reason if "Other" is selected
  let finalReasons = [...formData.reason];
  if (formData.reason.includes('Other') && formData.customReason.trim()) {
    finalReasons = finalReasons.map(reason => 
      reason === 'Other' ? formData.customReason : reason
    );
  }

  // 🔹 Get current user and hierarchy info
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const allUsers = JSON.parse(localStorage.getItem("users")) || [];

  const fullUser = allUsers.find(u => u.username === currentUser.username);
  const assignedTo = fullUser?.reportsTo;

  if (!assignedTo) {
    alert("❌ No reporting manager assigned to this employee. Please set 'reportsTo' in users.");
    return;
  }

  const newRequest = {
    requestId: generateRequestId(), // Add unique request ID
    ...formData,
    reason: finalReasons, // Store as array of reasons
    status: 'Pending Manager Approval',
    remarks: '',
    submittedAt: new Date().toISOString(),
    assignedTo: assignedTo, // 🔹 Track who should review this request
    submittedBy: currentUser.username,
    currentLevel: 'line-manager', // 🔹 used to track approval level
  };

  const existingRequests = JSON.parse(localStorage.getItem('advanceRequests') || '[]');
  existingRequests.push(newRequest);
  localStorage.setItem('advanceRequests', JSON.stringify(existingRequests));

  // Store the request ID in form data to show in success message
  setFormData(prev => ({ ...prev, requestId: newRequest.requestId }));

  setSubmitted(true);
};

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-white shadow rounded-md">
      <div className="w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
          <h2 className="text-2xl font-bold text-green-600">Advance Request Form</h2>
          <NavLink to="/dashboard/employee/my-requests">
            <button className=" bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 hover:text-white transition cursor-pointer">
              My Requests
            </button>
          </NavLink>
        </div>

        {submitted ? (
          <div className="text-green-600 text-center font-medium">
            ✅ Your advance request has been submitted successfully.
            <div className="mt-2 text-sm text-gray-600">
              Request ID: <span className="font-semibold text-green-700">{formData.requestId}</span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="text-red-600 text-sm text-center">{error}</div>}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-semibold">Employee Name</label>
                <input
                  type="text"
                  name="employeeName"
                  value={formData.employeeName}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-300"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold">Employee ID</label>
                <input
                  type="text"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-300"
                  placeholder="Enter your employee ID"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block mb-1 font-semibold">Advance Amount (INR)</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-300"
                  placeholder="e.g. 5000"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block mb-1 font-semibold">Reason for Advance</label>
                
                {/* Selected Reasons Display Box */}
                {formData.reason.length > 0 && (
                  <div className="mb-3 p-3 border rounded bg-gray-50 min-h-[60px]">
                    <div className="text-sm text-gray-600 mb-2">Selected Reasons:</div>
                    <div className="flex flex-wrap gap-2">
                      {formData.reason.map((reason, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                        >
                          {reason}
                          <button
                            type="button"
                            onClick={() => handleReasonRemove(reason)}
                            className="ml-2 text-green-600 hover:text-green-800 font-bold"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reason Selection Dropdown */}
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      handleReasonSelect(e.target.value);
                      e.target.value = ''; // Reset dropdown
                    }
                  }}
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-300"
                >
                  <option value="">-- Select Reason to Add --</option>
                  {reasonOptions
                    .filter(option => !formData.reason.includes(option))
                    .map(option => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                </select>
              </div>

              {formData.reason.includes('Other') && (
                <div className="sm:col-span-2">
                  <label className="block mb-1 font-semibold">Specify Reason</label>
                  <input
                    type="text"
                    name="customReason"
                    value={formData.customReason}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-300"
                    placeholder="Enter custom reason"
                    required
                  />
                </div>
              )}

              <div className="sm:col-span-2">
                <label className="block mb-1 font-semibold">Request Date</label>
                <input
                  type="date"
                  name="requestDate"
                  value={formData.requestDate}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-300"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!isFormValid()}
              className={`w-full py-2 px-4 rounded transition font-semibold ${
                isFormValid()
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-green-200 text-green-800 cursor-not-allowed'
              }`}
            >
              Submit Request
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdvanceRequestForm;
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const ManagerAdvanceRequest = () => {
  const navigate = useNavigate();
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    employeeName: '',
    employeeId: '',
    amount: '',
    reason: '',
    customReason: '',
    requestDate: new Date().toISOString().slice(0, 10),
  });

  useEffect(() => {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const allUsers = JSON.parse(localStorage.getItem("users")) || [];

  if (currentUser) {
    const fullUser = allUsers.find(u => u.username === currentUser.username);

    setLoggedInUser(fullUser); // ✅ Set the full user object here

    setFormData(prev => ({
      ...prev,
      employeeName: fullUser?.username || '',
      employeeId: fullUser?.employeeId || fullUser?.username || '',
    }));
  }
}, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const isFormValid = () => {
    const { employeeName, employeeId, amount, reason, customReason } = formData;
    if (reason === 'Other') {
      return (
        employeeName.trim() &&
        employeeId.trim() &&
        amount.trim() &&
        customReason.trim()
      );
    }
    return employeeName.trim() && employeeId.trim() && amount.trim() && reason.trim();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!isFormValid()) {
      setError('All fields are required.');
      return;
    }

    const finalReason = formData.reason === 'Other' ? formData.customReason : formData.reason;
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
      ...formData,
      reason: finalReason,
      assignedTo:assignedTo || '',        // ✅ assigned to AE or next approver
      status: "Pending VP Approval",                     // ✅ update status
      currentLevel: "line-manager",                      // ✅ set level
      remarks: "",
      clarification: "",
      submittedAt: new Date().toISOString(),
      submittedBy: currentUser.username || '',         // ✅ track who submitted
    };


   const existingRequests = JSON.parse(localStorage.getItem('advanceRequests') || '[]');
  existingRequests.push(newRequest);
  localStorage.setItem('advanceRequests', JSON.stringify(existingRequests));

  setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-white shadow rounded-md">
      <div className="w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
          <h2 className="text-2xl font-bold text-green-600">Advance Request Form</h2>
          <NavLink to="/dashboard/line-manager/my-requests">
            <button className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 transition">
              My Requests
            </button>
          </NavLink>
        </div>

        {submitted ? (
          <div className="text-green-600 text-center font-medium">
            ✅ Your advance request has been submitted to VP for approval.
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
                  className="w-full border px-3 py-2 rounded"
                  placeholder="Your name"
                  readOnly
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold">Employee ID</label>
                <input
                  type="text"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                  placeholder="Your ID"
                  readOnly
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block mb-1 font-semibold">Advance Amount (INR)</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                  placeholder="e.g. 5000"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block mb-1 font-semibold">Reason for Advance</label>
                <select
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                >
                  <option value="">-- Select Reason --</option>
                  <option value="Visit to Client">Visit to Client</option>
                  <option value="Travelling Allowance">Travelling Allowance</option>
                  <option value="Petrol Expense">Petrol Expense</option>
                  <option value="Office Expense">Office Expense</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {formData.reason === 'Other' && (
                <div className="sm:col-span-2">
                  <label className="block mb-1 font-semibold">Specify Reason</label>
                  <input
                    type="text"
                    name="customReason"
                    value={formData.customReason}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                    placeholder="Enter custom reason"
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
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!isFormValid()}
              className={`w-full py-2 px-4 rounded font-semibold transition ${
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

export default ManagerAdvanceRequest;

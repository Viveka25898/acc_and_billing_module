// File: /src/modules/advanceRequest/pages/AdvanceRequestForm.jsx

import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const AdvanceRequestForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    employeeName: '',
    employeeId: '',
    amount: '',
    reason: '',
    requestDate: new Date().toISOString().slice(0, 10),
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const isFormValid = () => {
    const { employeeName, employeeId, amount, reason } = formData;
    return employeeName.trim() && employeeId.trim() && amount.trim() && reason.trim();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!isFormValid()) {
      setError('All fields are required.');
      return;
    }

    const existingRequests = JSON.parse(localStorage.getItem('advanceRequests') || '[]');
    const newRequest = {
      ...formData,
      status: 'Pending Manager Approval',
      remarks: '',
      submittedAt: new Date().toISOString(),
    };

    existingRequests.push(newRequest);
    localStorage.setItem('advanceRequests', JSON.stringify(existingRequests));
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-gray-50">
      <div className="w-full max-w-2xl p-6 bg-white shadow rounded-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Advance Request Form</h2>
          <button
            onClick={() => navigate('/dashboard/employee/my-requests')}
            className="text-green-600 border border-green-600 px-4 py-1 rounded hover:bg-green-600 hover:text-white transition"
          >
           <NavLink to="/dashboard/employee/my-requests">
            My Requests
           </NavLink>
          </button>
        </div>

        {submitted ? (
          <div className="text-green-600 text-center font-medium">
            ✅ Your advance request has been submitted successfully.
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
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-300"
                  placeholder="Mention the purpose of the advance"
                  rows="3"
                  required
                ></textarea>
              </div>

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

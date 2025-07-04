// File: src/components/rent/ViewVouchersModal.jsx
import React from "react";

export default function ViewVouchersModal({ site, agreement, vouchers, onClose }) {
  if (!site) return null;

  const formatDateTime = (iso) => new Date(iso).toLocaleString();

  const vouchersInAgreementPeriod = vouchers.filter((v) => {
    const voucherDate = new Date(v.month + "-01");
    const start = new Date(agreement?.startDate);
    const end = new Date(agreement?.endDate);
    return start <= voucherDate && voucherDate <= end;
  });

  const monthsBetween = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return (
      (endDate.getFullYear() - startDate.getFullYear()) * 12 +
      (endDate.getMonth() - startDate.getMonth()) + 1
    );
  };

  const totalMonths = agreement ? monthsBetween(agreement.startDate, agreement.endDate) : 0;
  const totalCreated = vouchersInAgreementPeriod.length;
  const totalRemaining = totalMonths - totalCreated;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-2">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-red-600 text-lg"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-2xl font-semibold mb-4 text-center text-green-700">
          Vouchers - {site.siteName}
        </h2>

        {agreement ? (
          <div className="mb-6">
            <p className="text-sm text-gray-600">
              <strong>Agreement Period:</strong> {agreement.startDate} to {agreement.endDate}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Total Months:</strong> {totalMonths}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Vouchers Created:</strong> {totalCreated} / {totalMonths} &nbsp;
              <span className="text-red-500">Remaining: {totalRemaining}</span>
            </p>
          </div>
        ) : (
          <p className="text-gray-600">No agreement found for this site.</p>
        )}

        {vouchersInAgreementPeriod.length === 0 ? (
          <p className="text-center text-gray-500 italic">No vouchers found within the agreement period.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {vouchersInAgreementPeriod.map((v, i) => (
              <div
                key={i}
                className="border rounded-md p-4 bg-gray-50 shadow-sm hover:shadow-md transition duration-200"
              >
                <p className="text-sm text-gray-700">
                  <strong>Month:</strong> {v.month}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Amount:</strong> ₹{v.amount}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Created By:</strong> {v.createdBy || "Admin"}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Date:</strong> {formatDateTime(v.createdAt || new Date().toISOString())}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

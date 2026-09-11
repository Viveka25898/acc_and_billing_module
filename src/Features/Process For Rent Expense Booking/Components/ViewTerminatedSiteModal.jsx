import React from 'react';

const formatCurrency = (val) => {
  if (val === null || val === undefined || val === '' || val === '-') return '-';
  const num = typeof val === 'number' ? val : parseFloat(String(val).replace(/[^\d.-]/g, ''));
  if (isNaN(num)) return String(val);
  return `₹${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const formatDate = (dateString) => {
  try {
    if (!dateString || dateString === '-') return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${String(date.getDate()).padStart(2, '0')}-${months[date.getMonth()]}-${date.getFullYear()}`;
  } catch {
    return dateString || '-';
  }
};

const formatDateTime = (isoString) => {
  try {
    if (!isoString || isoString === '-') return '-';
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return isoString || '-';
  }
};

const ViewTerminatedSiteModal = ({ siteData, isOpen, onClose }) => {
  if (!isOpen || !siteData) return null;

  const agreement = siteData.agreementDetails || {};
  const termination = siteData.terminationDetails || {};
  const audit = siteData.voucherAuditMetrics || {};
  const financials = siteData.financialActuals || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-emerald-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-700 text-white p-5 md:p-6 flex items-center justify-between relative">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-emerald-800/60 text-emerald-100 text-xs font-mono font-semibold px-2.5 py-0.5 rounded border border-emerald-400/30">
                {siteData.siteCode || siteData.siteId || '-'}
              </span>
              <span className="bg-rose-500/30 text-rose-100 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-rose-300/30 uppercase tracking-wider">
                {termination.status || 'TERMINATED'}
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
              {siteData.siteName || 'Terminated Site Details'}
            </h2>
            <p className="text-xs text-emerald-100/90 mt-1">
              {siteData.location || `${siteData.city || ''}, ${siteData.state || ''}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors focus:outline-none cursor-pointer"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800">

          {/* Section 1: Key Financial Highlights Card */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 md:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 shadow-xs">
            <div>
              <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Savings Realized</div>
              <div className="text-xl font-extrabold text-emerald-700 mt-1">
                {formatCurrency(financials.savingsFromEarlyTermination)}
              </div>
              <div className="text-[11px] text-emerald-600 font-medium mt-0.5">Early termination impact</div>
            </div>

            <div>
              <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Total Rent Booked</div>
              <div className="text-lg font-bold text-slate-900 mt-1">
                {formatCurrency(financials.totalRentBooked)}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {audit.activeMonthsCompleted ?? '-'} Months completed
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Total Amount Paid</div>
              <div className="text-lg font-bold text-emerald-600 mt-1">
                {formatCurrency(financials.totalAmountPaid)}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Vouchers settled</div>
            </div>

            <div>
              <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Pending Amount</div>
              <div className="text-lg font-bold text-amber-600 mt-1">
                {formatCurrency(financials.totalAmountPending)}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {audit.pendingPaymentVouchersCount ?? 0} Pending vouchers
              </div>
            </div>
          </div>

          {/* Section 2: Owner & Site Details */}
          <div className="border border-slate-200 rounded-xl p-4 md:p-5 bg-white shadow-2xs">
            <h3 className="text-sm font-bold text-emerald-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              Site & Property Owner Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs md:text-sm">
              <div>
                <span className="block text-slate-500 text-xs">Site ID / Code</span>
                <span className="font-semibold text-slate-900">{siteData.siteId || '-'} ({siteData.siteCode || '-'})</span>
              </div>
              <div>
                <span className="block text-slate-500 text-xs">Property Owner</span>
                <span className="font-semibold text-slate-900">{siteData.ownerName || '-'}</span>
              </div>
              <div>
                <span className="block text-slate-500 text-xs">Owner GL Code</span>
                <span className="font-mono font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block mt-0.5">
                  {siteData.ownerGLCode || '-'}
                </span>
              </div>
              <div>
                <span className="block text-slate-500 text-xs">City & State</span>
                <span className="font-medium text-slate-800">{siteData.city || '-'}, {siteData.state || '-'}</span>
              </div>
              <div>
                <span className="block text-slate-500 text-xs">Pincode</span>
                <span className="font-medium text-slate-800">{siteData.pinCode || '-'}</span>
              </div>
              <div className="sm:col-span-2 md:col-span-1">
                <span className="block text-slate-500 text-xs">Address / Location</span>
                <span className="font-medium text-slate-800">{siteData.location || '-'}</span>
              </div>
            </div>
          </div>

          {/* Section 3: Termination Details */}
          <div className="border border-rose-200 bg-rose-50/30 rounded-xl p-4 md:p-5 shadow-2xs">
            <h3 className="text-sm font-bold text-rose-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-600"></span>
              Termination Audit Record
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs md:text-sm">
              <div>
                <span className="block text-slate-500 text-xs">Termination Date</span>
                <span className="font-bold text-rose-700">{formatDate(termination.terminationDate)}</span>
              </div>
              <div>
                <span className="block text-slate-500 text-xs">Effective Month</span>
                <span className="font-semibold text-slate-900">{termination.effectiveMonth || '-'}</span>
              </div>
              <div>
                <span className="block text-slate-500 text-xs">Termination Reason</span>
                <span className="font-semibold text-slate-900">{termination.terminationReason || '-'}</span>
              </div>
              <div>
                <span className="block text-slate-500 text-xs">Terminated By</span>
                <span className="font-medium text-slate-800">
                  {termination.terminatedByName || '-'} ({termination.terminatedBy || '-'})
                </span>
              </div>
              <div className="sm:col-span-2">
                <span className="block text-slate-500 text-xs">Timestamp</span>
                <span className="font-mono text-xs text-slate-700">{formatDateTime(termination.terminatedAt)}</span>
              </div>
            </div>
          </div>

          {/* Section 4: Original Agreement & Calculations */}
          <div className="border border-slate-200 rounded-xl p-4 md:p-5 bg-white shadow-2xs">
            <h3 className="text-sm font-bold text-emerald-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              Contractual Rent Agreement Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs md:text-sm">
              <div>
                <span className="block text-slate-500 text-xs">Agreement ID</span>
                <span className="font-semibold text-emerald-800 font-mono">{agreement.agreementId || '-'}</span>
              </div>
              <div>
                <span className="block text-slate-500 text-xs">Start Date</span>
                <span className="font-medium text-slate-900">{formatDate(agreement.startDate)}</span>
              </div>
              <div>
                <span className="block text-slate-500 text-xs">End Date</span>
                <span className="font-medium text-slate-900">{formatDate(agreement.endDate)}</span>
              </div>
              <div>
                <span className="block text-slate-500 text-xs">Contract Duration</span>
                <span className="font-semibold text-slate-900">{agreement.contractualTotalMonths ?? '-'} Months</span>
              </div>
              <div>
                <span className="block text-slate-500 text-xs">Monthly Base Rent</span>
                <span className="font-medium text-slate-900">{formatCurrency(agreement.monthlyBaseRent)}</span>
              </div>
              <div>
                <span className="block text-slate-500 text-xs">Monthly GST</span>
                <span className="font-medium text-slate-900">{formatCurrency(agreement.monthlyGST)}</span>
              </div>
              <div>
                <span className="block text-slate-500 text-xs">Monthly Total</span>
                <span className="font-bold text-slate-900">{formatCurrency(agreement.monthlyTotal)}</span>
              </div>
              <div>
                <span className="block text-slate-500 text-xs">Total Contract Amount</span>
                <span className="font-extrabold text-emerald-800">{formatCurrency(agreement.contractualTotalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Section 5: Voucher Metrics Grid */}
          <div className="border border-slate-200 rounded-xl p-4 md:p-5 bg-white shadow-2xs">
            <h3 className="text-sm font-bold text-emerald-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              Voucher Generation Audit Metrics
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="text-[11px] text-slate-500">Expected Vouchers</div>
                <div className="text-base font-bold text-slate-800 mt-0.5">{audit.contractualVouchersExpected ?? 0}</div>
              </div>
              <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                <div className="text-[11px] text-emerald-700">Completed Months</div>
                <div className="text-base font-bold text-emerald-800 mt-0.5">{audit.activeMonthsCompleted ?? 0}</div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <div className="text-[11px] text-blue-700">Vouchers Generated</div>
                <div className="text-base font-bold text-blue-800 mt-0.5">{audit.totalVouchersGenerated ?? 0}</div>
              </div>
              <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                <div className="text-[11px] text-amber-700">Pending Vouchers</div>
                <div className="text-base font-bold text-amber-800 mt-0.5">{audit.pendingPaymentVouchersCount ?? 0}</div>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs md:text-sm rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            Close Details
          </button>
        </div>

      </div>
    </div>
  );
};

export default ViewTerminatedSiteModal;

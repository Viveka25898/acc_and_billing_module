import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchSiteVouchers,
  selectSiteVouchers,
  selectVouchersSummary,
  selectVouchersLoading,
  clearSiteVouchers,
} from '../../../store/slices/rentExpenseSlice';

const val = (v) => (v === undefined || v === null || String(v).trim() === '' ? '-' : String(v));

export default function ViewVouchersModal({ site, onClose, onViewVoucherDetails }) {
  const dispatch = useDispatch();
  const vouchers = useSelector(selectSiteVouchers);
  const summary = useSelector(selectVouchersSummary);
  const loading = useSelector(selectVouchersLoading);

  useEffect(() => {
    if (site?.siteId) {
      dispatch(fetchSiteVouchers({ siteId: site.siteId }));
    }
    return () => {
      dispatch(clearSiteVouchers());
    };
  }, [dispatch, site?.siteId]);

  if (!site) return null;

  const formatDateTime = (isoStr) => {
    if (!isoStr) return '-';
    try {
      return new Date(isoStr).toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoStr;
    }
  };

  const formatMonthName = (monthStr) => {
    if (!monthStr) return '-';
    try {
      const [year, month] = monthStr.split('-');
      const date = new Date(Number(year), Number(month) - 1, 1);
      return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    } catch {
      return monthStr;
    }
  };

  const formatCurrency = (amt) => {
    if (amt === undefined || amt === null || isNaN(amt)) return '₹0.00';
    return `₹${Number(amt).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto my-auto relative border border-slate-100 flex flex-col">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white px-6 py-5 sticky top-0 z-20 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 backdrop-blur-md flex items-center justify-center text-emerald-300 text-xl font-bold shadow-inner">
              📜
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
                Site Vouchers — {val(site.siteName)}
              </h2>
              <p className="text-xs text-emerald-100/80 font-medium">
                Location: {val(site.location)}, {val(site.city)} | ID: <span className="font-mono text-emerald-300">{val(site.siteId)}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white hover:text-red-300 transition-all flex items-center justify-center text-sm font-bold backdrop-blur-xs cursor-pointer border border-white/10"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 space-y-6 flex-1">
          {/* Summary KPIs */}
          {summary && (
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
              <div className="bg-gradient-to-br from-slate-50 to-slate-100/80 p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Vouchers</span>
                <span className="text-base sm:text-lg font-extrabold text-slate-800">{val(summary.totalVouchers)}</span>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50/60 p-3.5 rounded-xl border border-emerald-200/80 shadow-2xs">
                <span className="block text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Approved</span>
                <span className="text-base sm:text-lg font-extrabold text-emerald-900">{val(summary.approvedVouchers)}</span>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-orange-50/60 p-3.5 rounded-xl border border-amber-200/80 shadow-2xs">
                <span className="block text-[10px] font-bold text-amber-700 uppercase tracking-wider">Pending Payment</span>
                <span className="text-base sm:text-lg font-extrabold text-amber-900">{val(summary.pendingPayment)}</span>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50/60 p-3.5 rounded-xl border border-blue-200/80 shadow-2xs">
                <span className="block text-[10px] font-bold text-blue-700 uppercase tracking-wider">Total Amount</span>
                <span className="text-xs sm:text-sm font-black text-blue-900 block truncate">{formatCurrency(summary.totalAmount)}</span>
              </div>
              <div className="col-span-2 sm:col-span-1 bg-gradient-to-br from-rose-50 to-red-50/60 p-3.5 rounded-xl border border-rose-200/80 shadow-2xs">
                <span className="block text-[10px] font-bold text-rose-700 uppercase tracking-wider">Total Pending</span>
                <span className="text-xs sm:text-sm font-black text-rose-900 block truncate">{formatCurrency(summary.totalPending)}</span>
              </div>
            </div>
          )}

          {/* Loading Spinner */}
          {loading ? (
            <div className="py-16 text-center space-y-3">
              <div className="inline-block animate-spin w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full"></div>
              <p className="text-xs font-semibold text-slate-500">Fetching site vouchers from server...</p>
            </div>
          ) : vouchers.length === 0 ? (
            <div className="py-16 text-center bg-slate-50/60 border border-dashed border-slate-200 rounded-2xl">
              <div className="text-4xl mb-2">🧾</div>
              <p className="text-sm font-bold text-slate-700">No Vouchers Found</p>
              <p className="text-xs text-slate-400 mt-1">No rent vouchers have been generated for this site yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vouchers.map((v, i) => {
                const isPaid = v.paymentStatus === 'Paid' || v.status === 'Paid';
                const isApproved = v.status === 'Approved';

                return (
                  <div
                    key={v.voucherId || i}
                    className="bg-white border border-slate-200 hover:border-emerald-400 rounded-2xl p-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-3 group"
                  >
                    <div>
                      {/* Top Header */}
                      <div className="flex justify-between items-start gap-2 mb-2 pb-2 border-b border-slate-100">
                        <div>
                          <span className="text-sm font-extrabold text-slate-900 block">
                            {formatMonthName(v.month)}
                          </span>
                          <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 inline-block mt-0.5">
                            {val(v.voucherNo || v.voucherId)}
                          </span>
                        </div>

                        <div className="flex flex-col items-end gap-1">
                          <span
                            className={`px-2.5 py-0.5 text-[10px] font-extrabold rounded-full uppercase tracking-wider ${
                              isPaid
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : isApproved
                                  ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                  : 'bg-amber-100 text-amber-800 border border-amber-300'
                            }`}
                          >
                            {val(v.status)}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-500">
                            {val(v.paymentStatus)}
                          </span>
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="space-y-1.5 text-xs text-slate-600">
                        {v.breakdown && (
                          <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                            <div>
                              <span className="text-[10px] text-slate-400 block font-medium">Base Rent</span>
                              <strong className="text-slate-800">{formatCurrency(v.breakdown.baseRent)}</strong>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 block font-medium">GST Amount</span>
                              <strong className="text-slate-800">{formatCurrency(v.breakdown.gst)}</strong>
                            </div>
                          </div>
                        )}

                        <div className="flex justify-between pt-1">
                          <span className="text-slate-400">Due Date:</span>
                          <span className="font-semibold text-slate-700">{val(v.dueDate)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Paid Date:</span>
                          <span className="font-semibold text-slate-700">{val(v.paidDate)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">UTR / Ref:</span>
                          <span className="font-mono text-slate-700">{val(v.utr)}</span>
                        </div>
                        <div className="flex justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-50">
                          <span>Created At:</span>
                          <span>{formatDateTime(v.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Amount & Action */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Amount</span>
                        <strong className="text-base font-black text-emerald-700">
                          {formatCurrency(v.amount)}
                        </strong>
                      </div>

                      {onViewVoucherDetails && (
                        <button
                          type="button"
                          onClick={() => onViewVoucherDetails(v)}
                          className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-600 text-emerald-800 hover:text-white text-xs font-bold rounded-xl border border-emerald-200 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                        >
                          <span>📄</span> View Entry
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { useSelector } from 'react-redux';
import { selectActiveAgreementDetails, selectAgreementDetailsLoading } from '../../../store/slices/rentExpenseSlice';

export default function ViewAgreementModal({ onClose, site }) {
  const agreement = useSelector(selectActiveAgreementDetails);
  const loading = useSelector(selectAgreementDetailsLoading);

  const getFullFileUrl = (url) => {
    if (!url) return '#';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    
    const cleanPath = url.startsWith('/') ? url : `/${url}`;

    // Base URL is https://dev-int.ismart.org/api/v1/accounts
    const baseApi = 'https://dev-int.ismart.org/api/v1/accounts';
    return `${baseApi}${cleanPath}`;
  };

  const handleOpenPdf = (e) => {
    e.preventDefault();
    if (!agreement?.fileUrl) return;
    const fullUrl = getFullFileUrl(agreement.fileUrl);
    window.open(fullUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto my-auto relative border border-slate-100 divide-y divide-slate-100 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white px-6 py-5 relative overflow-hidden flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3 z-10">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 backdrop-blur-md flex items-center justify-center text-emerald-300 text-xl font-bold shadow-inner">
              📄
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                Rent Agreement Details
              </h2>
              <p className="text-xs text-emerald-100/80 font-medium mt-0.5">
                Site: <span className="text-emerald-300 font-bold">{site?.siteName || agreement?.siteName || '-'}</span> | ID: <span className="font-mono">{agreement?.agreementId || site?.currentAgreementId || '-'}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="z-10 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white hover:text-red-300 transition-all flex items-center justify-center text-sm font-bold backdrop-blur-xs cursor-pointer border border-white/10"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 space-y-6 overflow-y-auto">
          {loading ? (
            <div className="py-16 text-center space-y-3">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600 mx-auto"></div>
              <p className="text-sm font-bold text-slate-600">Fetching Agreement & Financial Calculations...</p>
            </div>
          ) : !agreement ? (
            <div className="py-12 text-center text-slate-500">
              <p className="text-sm font-semibold">Unable to load agreement details. Please try again.</p>
            </div>
          ) : (
            <>
              {/* Site & Owner Overview Grid */}
              <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Overview</span>
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-200 uppercase">
                    {agreement.status || 'Active'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs sm:text-sm">
                  <div>
                    <span className="text-slate-400 font-medium block text-[11px] uppercase">Landlord / Owner</span>
                    <strong className="text-slate-800 font-bold block">{agreement.owner || '-'}</strong>
                    {agreement.ownerGLCode && (
                      <span className="inline-block mt-0.5 bg-blue-100 text-blue-800 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded">
                        GL: {agreement.ownerGLCode}
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block text-[11px] uppercase">Start Date</span>
                    <strong className="text-slate-800 font-semibold">{agreement.startDate || '-'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block text-[11px] uppercase">End Date</span>
                    <strong className="text-slate-800 font-semibold">{agreement.endDate || '-'}</strong>
                  </div>
                </div>
              </div>

              {/* Financial Calculations Card */}
              {agreement.calculations && (
                <div className="bg-gradient-to-br from-slate-900 via-teal-950 to-emerald-950 text-white rounded-xl p-5 shadow-lg border border-emerald-700/50 space-y-4">
                  <div className="flex items-center justify-between border-b border-emerald-800/80 pb-3">
                    <h4 className="font-extrabold text-emerald-300 text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <span>📊</span> Financial & GST Breakdown
                    </h4>
                    <span className="bg-emerald-500/20 text-emerald-300 font-bold px-2.5 py-0.5 rounded-full text-xs border border-emerald-400/30">
                      {agreement.calculations.totalMonths || 12} Month Lease
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs sm:text-sm">
                    <div>
                      <span className="text-emerald-200/70 block text-[11px] uppercase font-semibold">Monthly Base Rent</span>
                      <strong className="text-white font-bold text-sm sm:text-base">
                        ₹{Number(agreement.calculations.monthlyBaseRent || 0).toLocaleString()}
                      </strong>
                    </div>

                    {agreement.withGST && (
                      <div>
                        <span className="text-amber-300/80 block text-[11px] uppercase font-semibold">Monthly GST (18%)</span>
                        <strong className="text-amber-200 font-bold text-sm sm:text-base">
                          ₹{Number(agreement.calculations.monthlyGST || 0).toLocaleString()}
                        </strong>
                      </div>
                    )}

                    <div>
                      <span className="text-emerald-200/70 block text-[11px] uppercase font-semibold">Monthly Payable</span>
                      <strong className="text-emerald-400 font-extrabold text-base sm:text-lg">
                        ₹{Number(agreement.calculations.monthlyTotal || 0).toLocaleString()}
                      </strong>
                    </div>

                    <div>
                      <span className="text-emerald-200/70 block text-[11px] uppercase font-semibold">Grand Total Lease</span>
                      <strong className="text-white font-extrabold text-base sm:text-lg">
                        ₹{Number(agreement.calculations.grandTotal || 0).toLocaleString()}
                      </strong>
                    </div>
                  </div>

                  {/* GST Breakdown details */}
                  {agreement.calculations.gstBreakdown && (
                    <div className="pt-3 border-t border-emerald-800/60 flex items-center justify-between text-xs text-emerald-200/80 font-medium">
                      <span>GST Type: <strong>{agreement.calculations.gstBreakdown.type || 'CGST+SGST'}</strong></span>
                      <span>CGST (9%): ₹{agreement.calculations.gstBreakdown.monthlyCGST} | SGST (9%): ₹{agreement.calculations.gstBreakdown.monthlySGST}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Voucher Summary Badges */}
              {agreement.voucherSummary && (
                <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 space-y-2">
                  <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">Voucher Status Summary</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-bold">
                    <div className="bg-white p-2 rounded-lg border border-amber-200">
                      <span className="text-amber-700 block text-[10px] uppercase">Total Vouchers</span>
                      <span className="text-amber-950 text-base">{agreement.voucherSummary.totalVouchers || 0}</span>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-amber-200">
                      <span className="text-blue-700 block text-[10px] uppercase">Generated</span>
                      <span className="text-blue-900 text-base">{agreement.voucherSummary.generated || 0}</span>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-amber-200">
                      <span className="text-green-700 block text-[10px] uppercase">Approved</span>
                      <span className="text-green-900 text-base">{agreement.voucherSummary.approved || 0}</span>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-amber-200">
                      <span className="text-slate-600 block text-[10px] uppercase">Pending</span>
                      <span className="text-slate-800 text-base">{agreement.voucherSummary.pending || 0}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Embedded PDF Document Viewer */}
              {agreement.fileUrl && (
                <div className="border border-emerald-200 rounded-xl overflow-hidden shadow-sm bg-slate-900 space-y-0">
                  <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white px-4 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold">
                      <span>📄</span> Document Preview: {agreement.fileName || 'Signed Agreement.pdf'}
                    </div>
                    <a
                      href={getFullFileUrl(agreement.fileUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={handleOpenPdf}
                      className="text-[11px] bg-white/15 hover:bg-white/30 text-white font-bold px-3 py-1 rounded-lg backdrop-blur-xs transition cursor-pointer flex items-center gap-1"
                    >
                      <span>↗️</span> Fullscreen
                    </a>
                  </div>

                  <div className="w-full h-80 bg-slate-100 relative">
                    <iframe
                      src={getFullFileUrl(agreement.fileUrl)}
                      title="Rent Agreement Document"
                      className="w-full h-full border-0"
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

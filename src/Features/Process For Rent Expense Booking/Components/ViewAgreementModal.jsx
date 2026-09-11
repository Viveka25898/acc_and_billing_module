import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectActiveAgreementDetails, selectAgreementDetailsLoading } from '../../../store/slices/rentExpenseSlice';
import axiosInstance from '../../../api/axiosInstance';

export default function ViewAgreementModal({ onClose, site }) {
  const agreement = useSelector(selectActiveAgreementDetails);
  const loading = useSelector(selectAgreementDetailsLoading);

  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState(false);

  // Fetch PDF file securely with Bearer token using Axios
  useEffect(() => {
    let activeUrl = null;
    const fetchPdfBlob = async () => {
      if (!agreement?.fileUrl) return;

      setPdfLoading(true);
      setPdfError(false);

      try {
        let relativePath = agreement.fileUrl;
        if (relativePath.includes('/api/v1/')) {
          relativePath = relativePath.substring(relativePath.indexOf('/api/v1/') + 7);
        }

        const response = await axiosInstance.get(relativePath, { responseType: 'blob' });
        const blob = new Blob([response.data], { type: 'application/pdf' });
        activeUrl = window.URL.createObjectURL(blob);
        setPdfBlobUrl(activeUrl);
      } catch (err) {
        console.error('⚠️ Failed to load PDF file via authenticated request:', err);
        setPdfError(true);
      } finally {
        setPdfLoading(false);
      }
    };

    fetchPdfBlob();

    return () => {
      if (activeUrl) {
        window.URL.revokeObjectURL(activeUrl);
      }
    };
  }, [agreement?.fileUrl]);

  const handleOpenPdfInNewTab = (e) => {
    e.preventDefault();
    if (pdfBlobUrl) {
      window.open(pdfBlobUrl, '_blank', 'noopener,noreferrer');
    } else if (agreement?.fileUrl) {
      window.open(agreement.fileUrl, '_blank', 'noopener,noreferrer');
    }
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
                        ₹{Number(agreement.calculations.monthlyBaseRent || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </strong>
                    </div>

                    {agreement.withGST && (
                      <div>
                        <span className="text-amber-300/80 block text-[11px] uppercase font-semibold">Monthly GST</span>
                        <strong className="text-amber-200 font-bold text-sm sm:text-base">
                          ₹{Number(agreement.calculations.monthlyGST || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </strong>
                      </div>
                    )}

                    <div>
                      <span className="text-emerald-200/70 block text-[11px] uppercase font-semibold">Monthly Payable</span>
                      <strong className="text-emerald-400 font-extrabold text-base sm:text-lg">
                        ₹{Number(agreement.calculations.monthlyTotal || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </strong>
                    </div>

                    <div>
                      <span className="text-emerald-200/70 block text-[11px] uppercase font-semibold">Grand Total Lease</span>
                      <strong className="text-white font-extrabold text-base sm:text-lg">
                        ₹{Number(agreement.calculations.grandTotal || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </strong>
                    </div>
                  </div>

                  {/* GST Breakdown details */}
                  {agreement.calculations.gstBreakdown && (
                    <div className="pt-3 border-t border-emerald-800/60 flex items-center justify-between text-xs text-emerald-200/80 font-medium">
                      <span>GST Type: <strong>{agreement.calculations.gstBreakdown.type || 'CGST+SGST'}</strong></span>
                      <span>
                        {agreement.calculations.gstBreakdown.type === 'IGST' ? (
                          <>IGST ({agreement.calculations.gstBreakdown.igstRate || 18}%): ₹{Number(agreement.calculations.gstBreakdown.monthlyIGST || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</>
                        ) : (
                          <>
                            CGST (9%): ₹{Number(agreement.calculations.gstBreakdown.monthlyCGST || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })} | SGST (9%): ₹{Number(agreement.calculations.gstBreakdown.monthlySGST || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </>
                        )}
                      </span>
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
                    <div className="flex items-center gap-2 text-xs font-bold truncate pr-2">
                      <span>📄</span> Document Preview: {agreement.fileName || 'Signed Agreement.pdf'}
                    </div>
                    <button
                      type="button"
                      onClick={handleOpenPdfInNewTab}
                      className="text-[11px] bg-white/15 hover:bg-white/30 text-white font-bold px-3 py-1 rounded-lg backdrop-blur-xs transition cursor-pointer flex items-center gap-1 shrink-0"
                    >
                      <span>↗️</span> Fullscreen / Download
                    </button>
                  </div>

                  <div className="w-full h-80 bg-slate-100 relative">
                    {pdfLoading ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 text-slate-600 space-y-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                        <p className="text-xs font-bold">Loading PDF Document...</p>
                      </div>
                    ) : pdfError || !pdfBlobUrl ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 p-6 text-center space-y-3">
                        <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xl font-bold">
                          📄
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">Preview not supported directly in iframe</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">Click below to open or download the PDF document</p>
                        </div>
                        <button
                          type="button"
                          onClick={handleOpenPdfInNewTab}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition cursor-pointer"
                        >
                          Open PDF Document
                        </button>
                      </div>
                    ) : (
                      <iframe
                        src={pdfBlobUrl}
                        title="Rent Agreement Document"
                        className="w-full h-full border-0"
                      />
                    )}
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


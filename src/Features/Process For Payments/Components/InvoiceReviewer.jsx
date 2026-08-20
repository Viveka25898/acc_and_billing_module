import React from 'react'

const InvoiceViewer = ({ selectedInvoice }) => {
  if (!selectedInvoice) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-3 border border-gray-200 shadow-sm">
          <span className="text-2xl text-gray-400">📄</span>
        </div>
        <p className="text-gray-600 font-semibold text-sm">No Invoice Selected</p>
        <p className="text-gray-400 text-xs mt-1">Select an invoice from the list to preview details.</p>
      </div>
    )
  }

  // Normalize document URLs
  const rawUrl = selectedInvoice.documentUrl ? String(selectedInvoice.documentUrl).trim() : ''
  const fileUrl = rawUrl.replace(/^\/?public\//, '/')

  const isImage = (url) => {
    if (!url) return false
    return (
      url.match(/\.(jpeg|jpg|gif|png|webp)$/i) ||
      url.startsWith('data:image') ||
      url.includes('blob:')
    )
  }

  const isPDF = (url) => {
    if (!url) return false
    return url.match(/\.(pdf)$/i) || url.startsWith('data:application/pdf')
  }

  const invoiceNum = selectedInvoice.invoiceNumber || selectedInvoice.invoiceNo || '-'
  const vendorGL = selectedInvoice.vendorGLCode || selectedInvoice.vendorGlCode || '-'
  const invType = selectedInvoice.invoiceTypeLabel || selectedInvoice.type || '-'
  const amountVal = typeof selectedInvoice.amount === 'number' ? selectedInvoice.amount : parseFloat(selectedInvoice.amount) || 0

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Header */}
      <div className="bg-green-50 border-b border-green-100 p-3 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <h3 className="font-semibold text-green-800 text-xs sm:text-sm truncate flex items-center gap-2">
          <span>📄</span>
          Invoice: {invoiceNum}
        </h3>
        {fileUrl ? (
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs bg-white text-green-700 px-2.5 py-1 rounded shadow-sm border border-green-200 hover:bg-green-100 transition-colors font-medium flex items-center gap-1"
            title="Open Document in New Tab"
          >
            <span>↗</span> Open
          </a>
        ) : null}
      </div>

      {/* Document Content / Details Viewer */}
      <div className="flex-1 overflow-auto bg-gray-50 p-4 custom-scrollbar relative">
        {!fileUrl ? (
          <div className="flex flex-col items-center justify-center py-6 text-center space-y-3">
            <div className="text-4xl text-gray-300">📎</div>
            <p className="text-xs font-semibold text-gray-500">No Document File Attached</p>
            <div className="bg-white p-4 rounded-xl shadow-sm w-full max-w-sm border border-gray-100 text-left space-y-3 relative">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-1">
                Invoice Details
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-400 block text-[10px]">Invoice Number</span>
                  <span className="font-mono font-semibold text-gray-700">{invoiceNum}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Type</span>
                  <span className="font-medium text-gray-700">{invType}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">GL Code</span>
                  <span className="font-mono text-gray-600 truncate block" title={vendorGL}>
                    {vendorGL}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Net Amount</span>
                  <span className="font-bold text-green-700">
                    ₹{amountVal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : isImage(fileUrl) ? (
          <div className="relative group rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-white p-2">
            <img
              src={fileUrl}
              alt="Invoice Document"
              className="max-w-full h-auto object-contain mx-auto transition-transform duration-300 group-hover:scale-[1.02]"
              loading="lazy"
            />
          </div>
        ) : isPDF(fileUrl) ? (
          <div className="h-full rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-white min-h-[400px]">
            <iframe
              title="PDF Viewer"
              src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
              className="w-full h-full border-none min-h-[400px]"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-3 py-8">
            <div className="text-3xl text-blue-400">💾</div>
            <p className="text-xs text-gray-600 max-w-xs">
              This document format cannot be previewed inline.
            </p>
            <a
              href={fileUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-sm font-medium text-xs flex items-center gap-1.5"
            >
              <span>⬇</span> Download File
            </a>
          </div>
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f9fafb;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #d1d5db;
          border-radius: 10px;
        }
      `}</style>
    </div>
  )
}

export default InvoiceViewer

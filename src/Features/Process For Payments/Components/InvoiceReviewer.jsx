import React from 'react'

const InvoiceViewer = ({ selectedInvoice }) => {
  if (!selectedInvoice) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 border border-gray-200 shadow-sm">
          <span className="text-2xl text-gray-400">📄</span>
        </div>
        <p className="text-gray-500 font-medium text-sm">No Invoice Selected</p>
        <p className="text-gray-400 text-xs mt-1">Select an invoice from the list to view details.</p>
      </div>
    )
  }

  // Normalize legacy document URLs that accidentally include /public/
  const rawUrl = selectedInvoice.documentUrl || ''
  const fileUrl = rawUrl.replace(/^\/?public\//, '/')

  const isImage = (url) => {
    return (
      url?.match(/\.(jpeg|jpg|gif|png)$/i) ||
      url?.startsWith('data:image') ||
      url?.includes('blob:')
    )
  }

  const isPDF = (url) => url?.match(/\.(pdf)$/i) || url?.startsWith('data:application/pdf')

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(selectedInvoice, null, 2))
    alert('Invoice details copied to clipboard!')
  }

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Header */}
      <div className="bg-green-50 border-b border-green-100 p-3 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <h3 className="font-semibold text-green-800 text-sm truncate flex items-center gap-2">
          <span>📄</span>
          Invoice: {selectedInvoice.invoiceNumber || selectedInvoice.id}
        </h3>
        {fileUrl && (
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs bg-white text-green-700 px-3 py-1.5 rounded shadow-sm border border-green-200 hover:bg-green-100 transition-colors font-medium flex items-center gap-1"
            title="Open Document in New Tab"
          >
            <span>↗</span> Open
          </a>
        )}
      </div>

      {/* Document Viewer */}
      <div className="flex-1 overflow-auto bg-gray-50 p-4 custom-scrollbar relative">
        {!fileUrl ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
            <div className="text-4xl text-gray-300">📎</div>
            <p className="text-sm font-medium text-gray-500">No document attached.</p>
            <div className="bg-white p-4 rounded-lg shadow-sm w-full max-w-sm border border-gray-100 text-left space-y-2 relative">
              <button
                onClick={copyToClipboard}
                className="absolute top-2 right-2 text-gray-400 hover:text-green-600 transition-colors"
                title="Copy Details"
              >
                📋
              </button>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Available Details
              </h4>
              <div className="text-sm border-b border-gray-50 pb-2">
                <span className="text-gray-500 text-xs block mb-0.5">Invoice Number</span>
                <span className="font-mono bg-gray-100 px-2 rounded">{selectedInvoice.invoiceNumber}</span>
              </div>
              <div className="text-sm border-b border-gray-50 pb-2">
                <span className="text-gray-500 text-xs block mb-0.5">Amount</span>
                <span className="font-semibold text-gray-800">
                  ₹{Number(selectedInvoice.amount || 0).toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-gray-500 text-xs block mb-0.5">Type</span>
                <span className="inline-block bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded border border-blue-100">
                  {selectedInvoice.type || 'N/A'}
                </span>
              </div>
              <details className="mt-4 border-t border-gray-100 pt-3">
                <summary className="text-xs text-green-600 cursor-pointer font-medium hover:underline">
                  Show Raw Data
                </summary>
                <div className="mt-2 text-[10px] bg-gray-800 text-green-400 p-3 rounded overflow-x-auto max-h-48 overflow-y-auto font-mono">
                  <pre>{JSON.stringify(selectedInvoice, null, 2)}</pre>
                </div>
              </details>
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
          <div className="h-full rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-white">
            <iframe
              title="PDF Viewer"
              src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
              className="w-full h-full border-none min-h-[500px]"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <div className="text-4xl text-blue-300">💾</div>
            <p className="text-sm text-gray-600 max-w-xs">
              This document format cannot be previewed directly in the browser.
            </p>
            <a
              href={fileUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-sm font-medium text-sm flex items-center gap-2"
            >
              <span>⬇</span> Download to View
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
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #9ca3af;
        }
      `}</style>
    </div>
  )
}

export default InvoiceViewer

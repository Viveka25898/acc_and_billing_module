import React, { useState } from 'react';

const InvoiceViewer = ({ selectedInvoice }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    if (selectedInvoice) {
      setIsLoading(true);
      setError(null);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [selectedInvoice]);

  if (!selectedInvoice) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-600 mb-2">No Invoice Selected</h3>
          <p className="text-sm text-gray-500 mb-4">
            Click on an invoice from the left table to view it here
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-600 font-medium">Loading Invoice...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-red-600 mb-2">Error Loading Invoice</h3>
          <p className="text-sm text-gray-600 mb-4">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Invoice Viewer */}
      <div className="flex-1 bg-gray-100 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white shadow-lg rounded-lg w-full max-w-2xl mx-2 h-full max-h-[480px] flex flex-col">
            {/* PDF Content Area */}
            <div className="flex-1 p-4 overflow-auto">
              <div className="bg-white border shadow-sm rounded min-h-full text-xs">
                <div className="p-4 space-y-4">
                  <div className="text-center border-b pb-2">
                    <h2 className="text-xl font-bold text-gray-800 mb-1">INVOICE</h2>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1 text-sm">Bill To:</h4>
                      <div className="text-gray-600 space-y-0.5">
                        <p>Your Company Name</p>
                        <p>123 Business Street</p>
                        <p>City, State 12345</p>
                        <p>contact@company.com</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1 text-sm">Invoice Details:</h4>
                      <div className="text-gray-600 space-y-0.5">
                        <p>Date: {new Date().toLocaleDateString()}</p>
                        <p>Due Date: {new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString()}</p>
                        <p>Amount: ₹{selectedInvoice.amount.toLocaleString()}</p>
                        <p>Status: <span className="text-orange-600 font-medium">Pending</span></p>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded overflow-hidden">
                    <table className="w-full text-xs">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-2 py-2 text-left font-medium text-gray-700">Description</th>
                          <th className="px-2 py-2 text-right font-medium text-gray-700">Qty</th>
                          <th className="px-2 py-2 text-right font-medium text-gray-700">Rate</th>
                          <th className="px-2 py-2 text-right font-medium text-gray-700">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr>
                          <td className="px-2 py-2 text-gray-800">Professional Services</td>
                          <td className="px-2 py-2 text-gray-600 text-right">1</td>
                          <td className="px-2 py-2 text-gray-600 text-right">₹{selectedInvoice.amount.toLocaleString()}</td>
                          <td className="px-2 py-2 text-gray-800 text-right font-medium">₹{selectedInvoice.amount.toLocaleString()}</td>
                        </tr>
                      </tbody>
                      <tfoot className="bg-gray-50">
                        <tr>
                          <td colSpan="3" className="px-2 py-2 font-medium text-gray-800 text-right">Total:</td>
                          <td className="px-2 py-2 font-bold text-gray-900 text-right">₹{selectedInvoice.amount.toLocaleString()}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  <div className="text-center text-[10px] text-gray-500 border-t pt-2">
                    <p>Thank you for your business!</p>
                    <p className="mt-0.5">This is a computer generated invoice.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>      
    </div>
  );
};

export default InvoiceViewer;

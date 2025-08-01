import React, { useState, useEffect } from 'react';

const VendorInvoiceTable = ({
  vendorData,
  onInvoiceSelect,
  onPaymentUpdate,
  invoicePayments,
  onInvoiceApprove
}) => {
  const [selectedVendors, setSelectedVendors] = useState({});
  const [expandedVendor, setExpandedVendor] = useState(null);
  const [localPayments, setLocalPayments] = useState({});
  
  useEffect(() => {
    setLocalPayments(invoicePayments);
  }, [invoicePayments]);

  const handleVendorClick = (vendorId) => {
    setExpandedVendor(expandedVendor === vendorId ? null : vendorId);
  };

  const handleVendorCheckbox = (vendorId) => {
    setSelectedVendors((prev) => ({
      ...prev,
      [vendorId]: !prev[vendorId],
    }));
  };

  const handleAmountChange = (invoiceId, amount) => {
    const currentPayment = localPayments[invoiceId] || {};
    const updatedPayment = {
      ...currentPayment,
      amount: Number(amount),
      paymentType: currentPayment.paymentType || 'partial',
    };
    
    setLocalPayments((prev) => ({
      ...prev,
      [invoiceId]: updatedPayment,
    }));

    // Immediately update parent component
    onPaymentUpdate?.(invoiceId, Number(amount), updatedPayment.paymentType);
  };

  const handlePaymentTypeChange = (invoiceId, paymentType, originalAmount) => {
    const amount = paymentType === 'full' 
      ? originalAmount 
      : (localPayments[invoiceId]?.amount || originalAmount);

    const updatedPayment = {
      amount: Number(amount),
      paymentType: paymentType,
    };

    setLocalPayments((prev) => ({
      ...prev,
      [invoiceId]: updatedPayment,
    }));

    // Immediately update parent component
    onPaymentUpdate?.(invoiceId, Number(amount), paymentType);
  };

  // Initialize default payment data for all invoices when component mounts
  useEffect(() => {
    const initializePayments = () => {
      const defaultPayments = {};
      vendorData.forEach(vendor => {
        vendor.invoices.forEach(invoice => {
          if (!localPayments[invoice.id]) {
            defaultPayments[invoice.id] = {
              amount: invoice.amount,
              paymentType: 'full'
            };
            // Also update parent component
            onPaymentUpdate?.(invoice.id, invoice.amount, 'full');
          }
        });
      });

      if (Object.keys(defaultPayments).length > 0) {
        setLocalPayments(prev => ({
          ...prev,
          ...defaultPayments
        }));
      }
    };

    initializePayments();
  }, [vendorData]); // Run when vendorData changes

  const handleApproveSelectedInvoices = () => {
    // Pass both selected vendors and current payment state
    onInvoiceApprove(selectedVendors, localPayments);

    // Reset selected vendors after approval
    const resetSelections = {};
    Object.keys(selectedVendors).forEach((id) => {
      resetSelections[id] = false;
    });
    setSelectedVendors(resetSelections);
  };

  const getVendorPaymentStatus = (vendor, payments) => {
    let fullyPaid = true;
    let partiallyPaidInvoices = [];

    vendor.invoices.forEach((inv) => {
      const pay = payments[inv.id];
      if (!pay) {
        fullyPaid = false;
      } else if (Number(pay.amount) < inv.amount) {
        fullyPaid = false;
        partiallyPaidInvoices.push({ ...inv, paidAmount: pay.amount });
      }
    });

    return {
      fullyPaid,
      partiallyPaidInvoices,
    };
  };

  const filteredVendors = vendorData.filter(
    (vendor) => vendor.invoices.length > 0
  );

  const renderInvoiceRow = (invoice, vendor) => {
    const payment = localPayments[invoice.id] || { amount: invoice.amount, paymentType: 'full' };
    const isPartialPayment = payment.paymentType === 'partial';
    const displayAmount = payment.amount !== undefined ? String(payment.amount) : String(invoice.amount);

    return (
      <tr key={invoice.id} className="bg-gray-100 border text-[10px] leading-tight">
        <td className="px-[2px] py-[2px] text-center border">-</td>
        <td className="px-[2px] py-[2px] text-center border">-</td>
        <td className="px-[2px] py-[2px] text-black border">└ {vendor.vendorName}</td>
        <td className="px-[2px] py-[2px] border">
          <button
            onClick={() => onInvoiceSelect?.(invoice)}
            className="text-blue-600 hover:underline font-medium text-[10px]"
          >
            {invoice.invoiceNumber}
          </button>
        </td>
        <td className="px-[2px] py-[2px] border">
          <div className="space-y-[2px]">
            <div className="flex items-center space-x-[2px]">
              <span className="text-[10px] text-black">₹</span>
              <input
                type="number"
                value={displayAmount}
                onChange={(e) => handleAmountChange(invoice.id, e.target.value)}
                disabled={!isPartialPayment}
                className={`w-[60px] px-[4px] py-[2px] text-[10px] border rounded focus:outline-none ${
                  isPartialPayment
                    ? 'bg-white border-blue-300'
                    : 'bg-gray-100 border-gray-300'
                }`}
                step="0.01"
                min="0"
                max={invoice.amount}
              />
            </div>

            <div className="flex flex-col space-y-[1px]">
              <label className="flex items-center text-[9px]">
                <input
                  type="radio"
                  name={`payment-${invoice.id}`}
                  value="full"
                  checked={payment.paymentType !== 'partial'}
                  onChange={() =>
                    handlePaymentTypeChange(invoice.id, 'full', invoice.amount)
                  }
                  className="mr-[3px] text-blue-600 scale-[0.8]"
                />
                <span className="text-green-600">Full</span>
              </label>

              <label className="flex items-center text-[9px]">
                <input
                  type="radio"
                  name={`payment-${invoice.id}`}
                  value="partial"
                  checked={payment.paymentType === 'partial'}
                  onChange={() =>
                    handlePaymentTypeChange(invoice.id, 'partial', invoice.amount)
                  }
                  className="mr-[3px] text-orange-600 scale-[0.8]"
                />
                <span className="text-orange-600">Partial</span>
              </label>
            </div>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full table-auto min-w-[650px] text-xs border">
        <thead className="bg-gray-100 sticky top-0 text-[11px] border">
          <tr className="border">
            <th className="px-2 py-2 border">Sr</th>
            <th className="px-2 py-2 border">Select</th>
            <th className="px-2 py-2 border">Vendor</th>
            <th className="px-2 py-2 border">Invoice</th>
            <th className="px-1 py-1 border">Amount</th>
          </tr>
        </thead>
        <tbody>
          {filteredVendors.map((vendor, index) => (
            <React.Fragment key={vendor.id}>
              <tr className="hover:bg-gray-50 transition-colors text-xs border">
                <td className="px-2 py-2 text-center border">{index + 1}</td>
                <td className="px-2 py-2 text-center border">
                  <input
                    type="checkbox"
                    checked={selectedVendors[vendor.id] || false}
                    onChange={() => handleVendorCheckbox(vendor.id)}
                    className="h-3 w-3 text-blue-600"
                  />
                </td>
                <td className="px-2 py-2 border">
                  <button
                    onClick={() => handleVendorClick(vendor.id)}
                    className="flex items-center space-x-1 hover:text-blue-600 font-medium"
                  >
                    <span className="text-[10px]">
                      {expandedVendor === vendor.id ? '▼' : '▶'}
                    </span>
                    <span>{vendor.vendorName}</span>
                    <span className="ml-1 text-[10px] text-gray-500 bg-gray-100 px-1 rounded-full">
                      {getVendorPaymentStatus(vendor, localPayments).fullyPaid
                        ? 'Paid'
                        : 'Pending'}
                    </span>
                    <span className="text-[10px] text-gray-500 bg-gray-100 px-1 rounded-full">
                      {vendor.invoices.length} inv
                    </span>
                  </button>
                </td>
                <td className="px-1 py-1 text-[10px] border">
                  {expandedVendor === vendor.id ? '↓ invoices below' : 'Click name'}
                </td>
                <td className="px-1 py-1 text-[10px] border">
                  ₹
                  {vendor.invoices
                    .reduce((sum, inv) => sum + inv.amount, 0)
                    .toLocaleString()}
                </td>
              </tr>
              {expandedVendor === vendor.id &&
                vendor.invoices.map((invoice) =>
                  renderInvoiceRow(invoice, vendor)
                )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {filteredVendors.length === 0 && (
        <div className="text-center py-6 text-black">
          <div className="text-sm mb-1 font-semibold">No vendors found</div>
          <div className="text-xs">Upload a payment file or add vendors</div>
        </div>
      )}

      <div className="mt-4 text-right">
        <button
          onClick={handleApproveSelectedInvoices}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2 px-4 rounded"
        >
          Approve Selected
        </button>
      </div>
    </div>
  );
};

export default VendorInvoiceTable;
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';

// TDS rates configuration
const TDS_RATES = {
  'Material': { section: '194C', rate: 1, description: 'Payments to contractors' },
  'Fixed Asset': { section: '194C', rate: 2, description: 'Payments for equipment/machinery' },
  'Procurement Prepaid': { section: '194C', rate: 1, description: 'Contract payments' },
  'Services': { section: '194C', rate: 2, description: 'Professional services' },
  'Rent': { section: '194I', rate: 10, description: 'Rent payments' },
  'Professional': { section: '194J', rate: 10, description: 'Professional/technical services' }
};

// GL Codes mapping
const GL_CODES = {
  'Material': '5100',
  'Fixed Asset': '1500',
  'Procurement Prepaid': '1300',
  'CGST': '1801',
  'SGST': '1802',
  'IGST': '1803',
  'TDS_194C': '3001',
  'TDS_194I': '3002',
  'TDS_194J': '3003',
  'Accounts_Payable': '2000'
};

const TDSDeductionModal = ({ 
  isOpen, 
  onClose, 
  invoice, 
  onTDSCalculated,
  onGenerateJV 
}) => {
  const [tdsData, setTdsData] = useState({
    section: '',
    rate: 0,
    taxableAmount: 0,
    tdsAmount: 0,
    panAvailable: true,
    higherRate: false,
    exemptionAvailable: false,
    exemptionAmount: 0
  });
  
  const [gstBreakdown, setGstBreakdown] = useState({
    cgst: 0,
    sgst: 0,
    igst: 0,
    gstRate: 18
  });

  const [showJVPreview, setShowJVPreview] = useState(false);
  const [jvData, setJvData] = useState(null);

  useEffect(() => {
    if (isOpen && invoice) {
      initializeTDSData();
    }
  }, [isOpen, invoice]);

  const initializeTDSData = () => {
    const invoiceType = invoice.type || 'Material';
    const tdsConfig = TDS_RATES[invoiceType] || TDS_RATES['Material'];
    
    // Calculate taxable amount (excluding GST)
    const totalAmount = invoice.totalAmount || 0;
    const gstRate = gstBreakdown.gstRate;
    const taxableAmount = Math.round(totalAmount / (1 + gstRate/100));
    
    // Calculate GST breakdown
    const gstAmount = totalAmount - taxableAmount;
    const cgst = Math.round(gstAmount / 2);
    const sgst = Math.round(gstAmount / 2);

    setGstBreakdown(prev => ({
      ...prev,
      cgst: cgst,
      sgst: sgst,
      igst: 0 // Assuming intra-state transaction
    }));

    setTdsData({
      section: tdsConfig.section,
      rate: tdsConfig.rate,
      taxableAmount: taxableAmount,
      tdsAmount: Math.round(taxableAmount * tdsConfig.rate / 100),
      panAvailable: true,
      higherRate: false,
      exemptionAvailable: false,
      exemptionAmount: 0
    });
  };

  const handleTDSChange = (field, value) => {
    const newTdsData = { ...tdsData, [field]: value };
    
    if (field === 'rate' || field === 'taxableAmount' || field === 'exemptionAmount') {
      const effectiveTaxable = newTdsData.taxableAmount - newTdsData.exemptionAmount;
      newTdsData.tdsAmount = Math.round(effectiveTaxable * newTdsData.rate / 100);
    }
    
    if (field === 'higherRate') {
      // Apply higher rate if PAN not available
      newTdsData.rate = value ? (tdsData.rate * 5) : TDS_RATES[invoice.type]?.rate || 1;
      const effectiveTaxable = newTdsData.taxableAmount - newTdsData.exemptionAmount;
      newTdsData.tdsAmount = Math.round(effectiveTaxable * newTdsData.rate / 100);
    }

    setTdsData(newTdsData);
  };

  const generateJournalVoucher = () => {
    const invoiceType = invoice.type || 'Material';
    const netPayable = invoice.totalAmount - tdsData.tdsAmount;
    
    const jvEntries = [];
    let entryId = 1;

    // 1. Main expense/asset entry
    jvEntries.push({
      id: entryId++,
      particulars: `${invoiceType} Expense - ${invoice.vendorName}`,
      gl: GL_CODES[invoiceType],
      costCenter: "MAIN",
      debit: tdsData.taxableAmount,
      credit: 0,
      note: `Invoice: ${invoice.invoiceNumber}`
    });

    // 2. CGST Input (if applicable)
    if (gstBreakdown.cgst > 0) {
      jvEntries.push({
        id: entryId++,
        particulars: `CGST Input (${gstBreakdown.gstRate/2}%)`,
        gl: GL_CODES.CGST,
        costCenter: "",
        debit: gstBreakdown.cgst,
        credit: 0,
        note: ""
      });
    }

    // 3. SGST Input (if applicable)
    if (gstBreakdown.sgst > 0) {
      jvEntries.push({
        id: entryId++,
        particulars: `SGST Input (${gstBreakdown.gstRate/2}%)`,
        gl: GL_CODES.SGST,
        costCenter: "",
        debit: gstBreakdown.sgst,
        credit: 0,
        note: ""
      });
    }

    // 4. TDS Deduction
    if (tdsData.tdsAmount > 0) {
      jvEntries.push({
        id: entryId++,
        particulars: `TDS ${tdsData.section} (${tdsData.rate}%)`,
        gl: GL_CODES[`TDS_${tdsData.section}`] || GL_CODES.TDS_194C,
        costCenter: "",
        debit: 0,
        credit: tdsData.tdsAmount,
        note: `PAN: ${tdsData.panAvailable ? 'Available' : 'Not Available'}`
      });
    }

    // 5. Accounts Payable
    jvEntries.push({
      id: entryId++,
      particulars: `Accounts Payable - ${invoice.vendorName}`,
      gl: GL_CODES.Accounts_Payable,
      costCenter: "",
      debit: 0,
      credit: netPayable,
      note: `Vendor: ${invoice.vendorName}, Net Amount after TDS`
    });

    const jvData = {
      header: {
        company: "Your Company Name",
        voucherNo: `JV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
        financialYear: "2025-26",
        date: new Date().toISOString().split('T')[0],
        reference: `${invoice.invoiceNumber}/PO-REF`,
        preparedBy: "Account Manager"
      },
      entries: jvEntries,
      totals: {
        debit: jvEntries.reduce((sum, entry) => sum + entry.debit, 0),
        credit: jvEntries.reduce((sum, entry) => sum + entry.credit, 0)
      },
      narration: `Invoice booking for ${invoice.vendorName} - Invoice No: ${invoice.invoiceNumber}. Amount: ₹${invoice.totalAmount.toLocaleString()}, TDS deducted: ₹${tdsData.tdsAmount.toLocaleString()} u/s ${tdsData.section}. Net payable: ₹${netPayable.toLocaleString()}.`,
      approvals: {
        preparer: "Account Manager",
        reviewer: "Pending",
        approver: "Pending",
        date: new Date().toISOString().split('T')[0]
      }
    };

    setJvData(jvData);
    return jvData;
  };

  const handleConfirmTDS = () => {
    const jv = generateJournalVoucher();
    setShowJVPreview(true);
    onTDSCalculated?.(tdsData);
  };

  const handleFinalApproval = () => {
    onGenerateJV?.(jvData);
    setShowJVPreview(false);
    onClose();
  };

  if (!isOpen) return null;

  const netPayable = invoice?.totalAmount - tdsData.tdsAmount;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
        {!showJVPreview ? (
          <>
            {/* TDS Calculation Modal */}
            <div className="sticky top-0 bg-orange-600 text-white p-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">TDS Deduction - {invoice?.invoiceNumber}</h2>
                <button onClick={onClose} className="text-white hover:text-orange-200 text-2xl">
                  &times;
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Invoice Summary */}
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <h3 className="font-semibold text-blue-800 mb-2">Invoice Details</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Vendor:</span>
                    <div className="font-medium">{invoice?.vendorName}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Invoice Amount:</span>
                    <div className="font-medium">₹{invoice?.totalAmount?.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Type:</span>
                    <div className="font-medium">{invoice?.type}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Invoice No:</span>
                    <div className="font-medium">{invoice?.invoiceNumber}</div>
                  </div>
                </div>
              </div>

              {/* GST Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3">GST Breakdown</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>GST Rate:</span>
                      <input
                        type="number"
                        value={gstBreakdown.gstRate}
                        onChange={(e) => setGstBreakdown(prev => ({...prev, gstRate: Number(e.target.value)}))}
                        className="w-16 px-2 py-1 border rounded text-right"
                      />%
                    </div>
                    <div className="flex justify-between">
                      <span>Taxable Amount:</span>
                      <span className="font-medium">₹{tdsData.taxableAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>CGST ({gstBreakdown.gstRate/2}%):</span>
                      <span className="font-medium">₹{gstBreakdown.cgst.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>SGST ({gstBreakdown.gstRate/2}%):</span>
                      <span className="font-medium">₹{gstBreakdown.sgst.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* TDS Configuration */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3">TDS Configuration</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-600">TDS Section</label>
                      <select
                        value={tdsData.section}
                        onChange={(e) => handleTDSChange('section', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                      >
                        <option value="194C">194C - Contract Payments</option>
                        <option value="194I">194I - Rent Payments</option>
                        <option value="194J">194J - Professional Services</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-600">TDS Rate (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={tdsData.rate}
                        onChange={(e) => handleTDSChange('rate', Number(e.target.value))}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>

                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={tdsData.panAvailable}
                          onChange={(e) => handleTDSChange('panAvailable', e.target.checked)}
                          className="mr-2"
                        />
                        <span className="text-sm">PAN Available</span>
                      </label>
                      
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={tdsData.higherRate}
                          onChange={(e) => handleTDSChange('higherRate', e.target.checked)}
                          className="mr-2"
                        />
                        <span className="text-sm">Higher Rate (No PAN)</span>
                      </label>
                    </div>

                    {tdsData.exemptionAvailable && (
                      <div>
                        <label className="block text-sm text-gray-600">Exemption Amount</label>
                        <input
                          type="number"
                          value={tdsData.exemptionAmount}
                          onChange={(e) => handleTDSChange('exemptionAmount', Number(e.target.value))}
                          className="w-full px-3 py-2 border rounded-md"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* TDS Calculation Summary */}
              <div className="bg-green-50 p-4 rounded-lg mb-6">
                <h3 className="font-semibold text-green-800 mb-3">TDS Calculation Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Taxable Amount:</span>
                    <div className="font-medium text-lg">₹{tdsData.taxableAmount.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">TDS @ {tdsData.rate}%:</span>
                    <div className="font-medium text-lg text-red-600">₹{tdsData.tdsAmount.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Total Invoice:</span>
                    <div className="font-medium text-lg">₹{invoice?.totalAmount?.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Net Payable:</span>
                    <div className="font-medium text-lg text-green-600">₹{netPayable.toLocaleString()}</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmTDS}
                  className="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
                >
                  Generate Journal Voucher
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* JV Preview */}
            <div className="sticky top-0 bg-indigo-600 text-white p-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Journal Voucher Preview</h2>
                <button 
                  onClick={() => setShowJVPreview(false)}
                  className="text-white hover:text-indigo-200 text-2xl"
                >
                  &times;
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* JV Header */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
                <div>
                  <span className="text-sm text-gray-600">Voucher No:</span>
                  <div className="font-medium">{jvData?.header?.voucherNo}</div>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Date:</span>
                  <div className="font-medium">{jvData?.header?.date}</div>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Reference:</span>
                  <div className="font-medium">{jvData?.header?.reference}</div>
                </div>
              </div>

              {/* JV Entries Table */}
              <div className="overflow-x-auto mb-6">
                <table className="min-w-full border border-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border">Particulars</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border">GL Code</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 border">Debit (₹)</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 border">Credit (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jvData?.entries?.map((entry, idx) => (
                      <tr key={entry.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 border text-sm">
                          <div>{entry.particulars}</div>
                          {entry.note && (
                            <div className="text-xs text-gray-500 mt-1">{entry.note}</div>
                          )}
                        </td>
                        <td className="px-4 py-3 border text-sm">{entry.gl}</td>
                        <td className="px-4 py-3 border text-right text-sm">
                          {entry.debit ? `₹${entry.debit.toLocaleString()}` : "-"}
                        </td>
                        <td className="px-4 py-3 border text-right text-sm">
                          {entry.credit ? `₹${entry.credit.toLocaleString()}` : "-"}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-indigo-50 font-bold">
                      <td colSpan={2} className="px-4 py-3 border text-right text-sm">Total</td>
                      <td className="px-4 py-3 border text-right text-sm text-green-700">
                        ₹{jvData?.totals?.debit?.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 border text-right text-sm text-red-700">
                        ₹{jvData?.totals?.credit?.toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Balance Status */}
              <div className="mb-4 p-3 rounded-lg text-center">
                {jvData?.totals?.debit === jvData?.totals?.credit ? (
                  <div className="bg-green-100 text-green-800 font-medium">
                    ✓ Journal Voucher is Balanced
                  </div>
                ) : (
                  <div className="bg-amber-100 text-amber-800 font-medium">
                    ⚠ Not Balanced - Please check entries
                  </div>
                )}
              </div>

              {/* Narration */}
              <div className="mb-6">
                <span className="text-sm text-gray-600">Narration:</span>
                <div className="bg-gray-50 p-3 rounded border text-sm">
                  {jvData?.narration}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowJVPreview(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Back to TDS
                </button>
                <button
                  onClick={handleFinalApproval}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Confirm & Book Entry
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Usage example component showing integration with your existing workflow
const IntegratedInvoiceFlow = () => {
  const [showTDSModal, setShowTDSModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [journalVoucher, setJournalVoucher] = useState(null);

  // Sample invoice for demonstration
  const sampleInvoice = {
    id: 1,
    type: "Material",
    invoiceNumber: "INV-001",
    vendorName: "ABC Enterprises",
    totalAmount: 125000,
    status: "Approved by Account Executive",
    accountManagerStatus: "Pending Final Approval"
  };

  const handleApproveInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowTDSModal(true);
  };

  const handleTDSCalculated = (tdsData) => {
    console.log('TDS Calculated:', tdsData);
  };

  const handleGenerateJV = (jvData) => {
    setJournalVoucher(jvData);
    console.log('Journal Voucher Generated:', jvData);
    // Here you would typically save to your backend
    alert('Journal Voucher generated successfully!');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Invoice Approval with TDS Integration</h1>
      
      {/* Sample Invoice Card */}
      <div className="bg-white border rounded-lg p-4 mb-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold">{sampleInvoice.invoiceNumber}</h3>
            <p className="text-sm text-gray-600">{sampleInvoice.vendorName}</p>
            <p className="text-sm">₹{sampleInvoice.totalAmount.toLocaleString()}</p>
          </div>
          <button
            onClick={() => handleApproveInvoice(sampleInvoice)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Approve with TDS
          </button>
        </div>
      </div>

      {/* TDS Modal */}
      <TDSDeductionModal
        isOpen={showTDSModal}
        onClose={() => setShowTDSModal(false)}
        invoice={selectedInvoice}
        onTDSCalculated={handleTDSCalculated}
        onGenerateJV={handleGenerateJV}
      />

      {/* JV Summary (if generated) */}
      {journalVoucher && (
        <div className="mt-6 p-4 bg-green-50 rounded-lg">
          <h3 className="font-semibold text-green-800">Latest Journal Voucher</h3>
          <p className="text-sm">Voucher No: {journalVoucher.header.voucherNo}</p>
          <p className="text-sm">Total Debit: ₹{journalVoucher.totals.debit.toLocaleString()}</p>
          <p className="text-sm">Total Credit: ₹{journalVoucher.totals.credit.toLocaleString()}</p>
        </div>
      )}
    </div>
  );
};

export default IntegratedInvoiceFlow;
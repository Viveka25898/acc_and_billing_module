// // import React, { useState, useMemo } from "react";
// // export default function JVDisplay() {
// //   const [header, setHeader] = useState({
// //     company: "ABC Enterprises",
// //     date: "2025-08-15",
// //     voucherNo: "JV-2025-001",
// //     financialYear: "2025-26",
// //     reference: "PO-2025-001/INV-789",
// //     preparedBy: "John Doe",
// //   });

// //   const [lines, setLines] = useState([
// //     {
// //       id: 1,
// //       particulars: "Office Equipment Expense",
// //       gl: "5010",
// //       costCenter: "IT",
// //       debit: 8500,
// //       credit: 0,
// //       note: "",
// //     },
// //     {
// //       id: 2,
// //       particulars: "CGST Input (9%)",
// //       gl: "1801",
// //       costCenter: "",
// //       debit: 765,
// //       credit: 0,
// //       note: "",
// //     },
// //     {
// //       id: 3,
// //       particulars: "SGST Input (9%)",
// //       gl: "1802",
// //       costCenter: "",
// //       debit: 765,
// //       credit: 0,
// //       note: "",
// //     },
// //     {
// //       id: 4,
// //       particulars: "TDS 194C (10%)",
// //       gl: "3001",
// //       costCenter: "",
// //       debit: 1000,
// //       credit: 0,
// //       note: "",
// //     },
// //     {
// //       id: 5,
// //       particulars: "Accounts Payable - Tech Solutions",
// //       gl: "2000",
// //       costCenter: "",
// //       debit: 0,
// //       credit: 10030,
// //       note: "Vendor: V001",
// //     },
// //   ]);

// //   const [narration, setNarration] = useState(
// //     "Payment against Invoice No. INV-789 for IT equipment (₹10,030), including GST (CGST+SGST 9% each). TDS @10% deducted u/s 194C."
// //   );

// //   // Helpers
// //   const addLine = () => {
// //     const nextId = lines.length ? Math.max(...lines.map((l) => l.id)) + 1 : 1;
// //     setLines([
// //       ...lines,
// //       { id: nextId, particulars: "", gl: "", costCenter: "", debit: 0, credit: 0, note: "" },
// //     ]);
// //   };

// //   const updateLine = (id, field, value) => {
// //     setLines((prev) => prev.map((l) => (l.id === id ? { ...l, [field]: value } : l)));
// //   };

// //   const removeLine = (id) => setLines((prev) => prev.filter((l) => l.id !== id));

// //   const totals = useMemo(() => {
// //     const debit = lines.reduce((s, l) => s + Number(l.debit || 0), 0);
// //     const credit = lines.reduce((s, l) => s + Number(l.credit || 0), 0);
// //     return { debit, credit, difference: Number((debit - credit).toFixed(2)) };
// //   }, [lines]);

// //   const isBalanced = totals.debit === totals.credit;

// //   const handleHeaderChange = (field, value) => setHeader((h) => ({ ...h, [field]: value }));

// //   const validateAndExport = () => {
// //     // Basic validation
// //     if (!header.company || !header.date || !header.voucherNo) {
// //       alert("Please fill company, date and voucher number in header.");
// //       return;
// //     }
// //     if (!lines.length) {
// //       alert("Add at least one line item.");
// //       return;
// //     }

// //     if (!isBalanced) {
// //       const proceed = confirm(
// //         `Journal voucher is not balanced. Debit = ₹${totals.debit}, Credit = ₹${totals.credit}. Continue?`
// //       );
// //       if (!proceed) return;
// //     }

// //     // Create printable view
// //     const payload = {
// //       header,
// //       lines,
// //       totals,
// //       narration,
// //     };

// //     const w = window.open("", "JV_PRINT");
// //     if (w) {
// //       w.document.write(`<pre>${JSON.stringify(payload, null, 2)}</pre>`);
// //       w.document.close();
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-slate-50 p-4 sm:p-8">
// //       <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-2xl overflow-hidden">
// //         <div className="p-6 md:p-8 border-b">
// //           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
// //             <div>
// //               <h2 className="text-xl md:text-2xl font-semibold">Journal Voucher</h2>
// //               <p className="text-sm text-slate-500">Company: <input
// //                 className="ml-2 border-b border-dashed border-slate-300 focus:outline-none"
// //                 value={header.company}
// //                 onChange={(e) => handleHeaderChange('company', e.target.value)}
// //               /></p>
// //             </div>

// //             <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full sm:w-auto">
// //               <div className="flex flex-col">
// //                 <label className="text-xs text-slate-500">Date</label>
// //                 <input
// //                   type="date"
// //                   value={header.date}
// //                   onChange={(e) => handleHeaderChange('date', e.target.value)}
// //                   className="mt-1 px-2 py-1 border rounded"
// //                 />
// //               </div>

// //               <div className="flex flex-col">
// //                 <label className="text-xs text-slate-500">Voucher No.</label>
// //                 <input
// //                   value={header.voucherNo}
// //                   onChange={(e) => handleHeaderChange('voucherNo', e.target.value)}
// //                   className="mt-1 px-2 py-1 border rounded"
// //                 />
// //               </div>

// //               <div className="flex flex-col">
// //                 <label className="text-xs text-slate-500">Financial Year</label>
// //                 <input
// //                   value={header.financialYear}
// //                   onChange={(e) => handleHeaderChange('financialYear', e.target.value)}
// //                   className="mt-1 px-2 py-1 border rounded"
// //                 />
// //               </div>
// //             </div>
// //           </div>

// //           <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
// //             <div className="md:col-span-2">
// //               <label className="text-xs text-slate-500">Reference</label>
// //               <input
// //                 value={header.reference}
// //                 onChange={(e) => handleHeaderChange('reference', e.target.value)}
// //                 className="w-full mt-1 px-3 py-2 border rounded"
// //               />
// //             </div>

// //             <div>
// //               <label className="text-xs text-slate-500">Prepared By</label>
// //               <input
// //                 value={header.preparedBy}
// //                 onChange={(e) => handleHeaderChange('preparedBy', e.target.value)}
// //                 className="w-full mt-1 px-3 py-2 border rounded"
// //               />
// //             </div>
// //           </div>
// //         </div>

// //         {/* Table */}
// //         <div className="p-4 md:p-6">
// //           <div className="overflow-x-auto">
// //             <table className="min-w-full divide-y">
// //               <thead>
// //                 <tr className="bg-slate-50">
// //                   <th className="px-3 py-2 text-left text-xs text-slate-600">Particulars</th>
// //                   <th className="px-3 py-2 text-left text-xs text-slate-600">GL</th>
// //                   <th className="px-3 py-2 text-left text-xs text-slate-600">Cost Center</th>
// //                   <th className="px-3 py-2 text-right text-xs text-slate-600">Debit (₹)</th>
// //                   <th className="px-3 py-2 text-right text-xs text-slate-600">Credit (₹)</th>
// //                   <th className="px-3 py-2 text-xs text-slate-600">Action</th>
// //                 </tr>
// //               </thead>

// //               <tbody className="divide-y">
// //                 {lines.map((line) => (
// //                   <tr key={line.id} className="hover:bg-slate-50">
// //                     <td className="px-3 py-2">
// //                       <input
// //                         value={line.particulars}
// //                         onChange={(e) => updateLine(line.id, 'particulars', e.target.value)}
// //                         className="w-full px-2 py-1 border rounded"
// //                       />
// //                       <div className="text-xs text-slate-400 mt-1">{line.note}</div>
// //                     </td>

// //                     <td className="px-3 py-2 w-24">
// //                       <input
// //                         value={line.gl}
// //                         onChange={(e) => updateLine(line.id, 'gl', e.target.value)}
// //                         className="w-full px-2 py-1 border rounded"
// //                       />
// //                     </td>

// //                     <td className="px-3 py-2 w-28">
// //                       <input
// //                         value={line.costCenter}
// //                         onChange={(e) => updateLine(line.id, 'costCenter', e.target.value)}
// //                         className="w-full px-2 py-1 border rounded"
// //                       />
// //                     </td>

// //                     <td className="px-3 py-2 w-28">
// //                       <input
// //                         type="number"
// //                         min="0"
// //                         value={line.debit}
// //                         onChange={(e) => updateLine(line.id, 'debit', Number(e.target.value))}
// //                         className="w-full text-right px-2 py-1 border rounded"
// //                       />
// //                     </td>

// //                     <td className="px-3 py-2 w-28">
// //                       <input
// //                         type="number"
// //                         min="0"
// //                         value={line.credit}
// //                         onChange={(e) => updateLine(line.id, 'credit', Number(e.target.value))}
// //                         className="w-full text-right px-2 py-1 border rounded"
// //                       />
// //                     </td>

// //                     <td className="px-3 py-2 w-24 text-center">
// //                       <button
// //                         onClick={() => removeLine(line.id)}
// //                         className="text-sm px-2 py-1 rounded bg-red-50 text-red-600 border border-red-100"
// //                       >
// //                         Remove
// //                       </button>
// //                     </td>
// //                   </tr>
// //                 ))}
// //               </tbody>

// //               <tfoot>
// //                 <tr className="bg-slate-100">
// //                   <td colSpan={3} className="px-3 py-2 text-right font-medium">Total</td>
// //                   <td className="px-3 py-2 text-right font-medium">₹{totals.debit.toLocaleString()}</td>
// //                   <td className="px-3 py-2 text-right font-medium">₹{totals.credit.toLocaleString()}</td>
// //                   <td className="px-3 py-2" />
// //                 </tr>
// //               </tfoot>
// //             </table>
// //           </div>

// //           <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
// //             <div className="flex items-start gap-3 flex-1">
// //               <button onClick={addLine} className="px-3 py-2 rounded bg-emerald-50 text-emerald-700 border">
// //                 + Add Line
// //               </button>

// //               <div className="text-sm text-slate-600">
// //                 {isBalanced ? (
// //                   <span className="font-medium text-emerald-700">Balanced</span>
// //                 ) : (
// //                   <span className="font-medium text-amber-600">Not Balanced (Δ ₹{Math.abs(totals.difference).toLocaleString()})</span>
// //                 )}
// //               </div>
// //             </div>

// //             <div className="flex gap-2">
// //               <button
// //                 onClick={() => {
// //                   // quick autofill net payment in vendor credit if imbalance due to TDS on debit side
// //                   if (!isBalanced) {
// //                     alert('Please correct or confirm imbalance before exporting.');
// //                   }
// //                 }}
// //                 className="px-3 py-2 rounded bg-slate-100 border"
// //               >
// //                 Fix Suggestions
// //               </button>

// //               <button onClick={validateAndExport} className="px-3 py-2 rounded bg-indigo-600 text-white">
// //                 Export / Print
// //               </button>
// //             </div>
// //           </div>

// //           <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
// //             <div>
// //               <label className="text-xs text-slate-500">Narration</label>
// //               <textarea
// //                 value={narration}
// //                 onChange={(e) => setNarration(e.target.value)}
// //                 className="w-full mt-1 px-3 py-2 border rounded h-28"
// //               />

// //               <div className="mt-3 text-sm text-slate-500">
// //                 <strong>Supporting Docs:</strong> PO, Invoice, TDS Challan
// //               </div>
// //             </div>

// //             <div className="bg-slate-50 p-4 rounded">
// //               <div className="text-sm text-slate-600">
// //                 <div><strong>Totals</strong></div>
// //                 <div className="mt-2">Debit: ₹{totals.debit.toLocaleString()}</div>
// //                 <div>Credit: ₹{totals.credit.toLocaleString()}</div>
// //                 <div className="mt-2">Net Payment (example): ₹{(totals.credit - (lines.find(l => l.particulars.toLowerCase().includes('tds'))?.debit || 0)).toLocaleString()}</div>
// //               </div>

// //               <div className="mt-4">
// //                 <div className="text-xs text-slate-500">Approvals</div>
// //                 <div className="mt-2 grid grid-cols-2 gap-2">
// //                   <input placeholder="Preparer" className="px-2 py-1 border rounded" defaultValue={header.preparedBy} />
// //                   <input placeholder="Reviewer" className="px-2 py-1 border rounded" />
// //                   <input placeholder="Approver" className="px-2 py-1 border rounded col-span-2" />
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// import React, { useMemo } from "react";

// export default function JVDisplay({ data, onClose }) {
//   // Using passed data or default values
//   const header = data?.header || {
//     company: "ABC Enterprises",
//     date: "2025-08-15",
//     voucherNo: "JV-2025-001",
//     financialYear: "2025-26",
//     reference: "PO-2025-001/INV-789",
//     preparedBy: "John Doe",
//   };

//   const lines = data?.entries || [
//     {
//       particulars: "Employee Advances",
//       gl: "2005",
//       debit: 10000,
//       credit: 0,
//     },
//     {
//       particulars: "Cash",
//       gl: "1001",
//       debit: 0,
//       credit: 10000,
//     }
//   ];

//   const narration = data?.narration || "Advance settlement for employee XYZ";

//   // Calculate totals
//   const totals = useMemo(() => {
//     const debit = lines.reduce((s, l) => s + Number(l.debit || 0), 0);
//     const credit = lines.reduce((s, l) => s + Number(l.credit || 0), 0);
//     return { debit, credit, difference: Number((debit - credit).toFixed(2)) };
//   }, [lines]);

//   const isBalanced = totals.debit === totals.credit;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//       <div className="max-w-3xl w-full bg-white rounded-lg shadow-xl overflow-hidden">
//         {/* Header with close button */}
//         <div className="flex justify-between items-center bg-indigo-600 text-white p-4">
//           <h2 className="text-xl font-semibold">Journal Voucher</h2>
//           <button 
//             onClick={onClose}
//             className="text-white hover:text-indigo-200"
//           >
//             ✕
//           </button>
//         </div>

//         {/* Header details */}
//         <div className="p-6 border-b">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//             <div>
//               <p className="text-sm text-gray-500">Company</p>
//               <p className="font-medium">{header.company}</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Voucher No.</p>
//               <p className="font-medium">{header.voucherNo}</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Date</p>
//               <p className="font-medium">{new Date(header.date).toLocaleDateString()}</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Financial Year</p>
//               <p className="font-medium">{header.financialYear}</p>
//             </div>
//             <div className="md:col-span-2">
//               <p className="text-sm text-gray-500">Reference</p>
//               <p className="font-medium">{header.reference}</p>
//             </div>
//           </div>
//         </div>

//         {/* Transaction lines */}
//         <div className="p-6">
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y">
//               <thead>
//                 <tr className="bg-gray-50">
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Particulars</th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">GL Code</th>
//                   <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Debit (₹)</th>
//                   <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Credit (₹)</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y">
//                 {lines.map((line, index) => (
//                   <tr key={index}>
//                     <td className="px-4 py-3 whitespace-nowrap">
//                       <p className="text-sm font-medium">{line.particulars}</p>
//                       {line.note && <p className="text-xs text-gray-500">{line.note}</p>}
//                     </td>
//                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
//                       {line.gl}
//                     </td>
//                     <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
//                       {line.debit > 0 ? line.debit.toLocaleString('en-IN') : '-'}
//                     </td>
//                     <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
//                       {line.credit > 0 ? line.credit.toLocaleString('en-IN') : '-'}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//               <tfoot className="bg-gray-50">
//                 <tr>
//                   <th colSpan="2" className="px-4 py-3 text-right text-sm font-medium">
//                     Total
//                   </th>
//                   <th className="px-4 py-3 text-right text-sm font-medium">
//                     ₹{totals.debit.toLocaleString('en-IN')}
//                   </th>
//                   <th className="px-4 py-3 text-right text-sm font-medium">
//                     ₹{totals.credit.toLocaleString('en-IN')}
//                   </th>
//                 </tr>
//               </tfoot>
//             </table>
//           </div>

//           {/* Narration */}
//           <div className="mt-6">
//             <p className="text-sm font-medium text-gray-700">Narration:</p>
//             <p className="mt-1 text-sm text-gray-600 bg-gray-50 p-3 rounded">
//               {narration}
//             </p>
//           </div>

//           {/* Balance status */}
//           <div className="mt-4 text-center">
//             <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
//               isBalanced 
//                 ? 'bg-green-100 text-green-800' 
//                 : 'bg-red-100 text-red-800'
//             }`}>
//               {isBalanced ? '✓ Balanced' : '✗ Not Balanced'}
//             </span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React from "react";

export default function EmployeeAdvanceSettlementJV({ data = {}, onClose }) {
  // Set default values if data is not provided
  const header = data.header || {
    company: "Ismart",
    voucherNo: "JV-0000",
    financialYear: new Date().getFullYear() + "-" + (new Date().getFullYear() + 1).toString().slice(-2),
    date: new Date().toISOString().split('T')[0],
    reference: "N/A",
    preparedBy: "System"
  };

  const lines = data.entries || [];
  const narration = data.narration || "No narration provided";
  const approvals = data.approvals || {
    preparer: "System",
    reviewer: "Pending",
    approver: "Pending",
    date: new Date().toISOString().split('T')[0]
  };

  // Calculate totals if not provided
  const totals = data.totals || {
    debit: lines.reduce((sum, line) => sum + (line.debit || 0), 0),
    credit: lines.reduce((sum, line) => sum + (line.credit || 0), 0)
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="max-w-5xl w-full bg-white rounded-lg shadow-xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Modal Header with Close Button */}
        <div className="sticky top-0 bg-green-600 text-white p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Journal Voucher</h2>
          <button 
            onClick={onClose}
            className="text-white hover:text-indigo-200 text-2xl"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Header Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-500">Company</p>
              <p className="font-medium">{header.company}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Voucher No.</p>
              <p className="font-medium">{header.voucherNo}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="font-medium">{header.date}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Financial Year</p>
              <p className="font-medium">{header.financialYear}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500">Reference</p>
              <p className="font-medium">{header.reference}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500">Prepared By</p>
              <p className="font-medium">{header.preparedBy}</p>
            </div>
          </div>

          {/* Transaction Table */}
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 border">Particulars</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 border">GL Code</th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-500 border">Debit (₹)</th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-500 border">Credit (₹)</th>
                </tr>
              </thead>
              <tbody>
                {lines.map((line, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border text-sm">{line.particulars || "N/A"}</td>
                    <td className="px-4 py-2 border text-sm">{line.gl || "N/A"}</td>
                    <td className="px-4 py-2 border text-right text-sm">
                      {line.debit ? line.debit.toLocaleString() : "-"}
                    </td>
                    <td className="px-4 py-2 border text-right text-sm">
                      {line.credit ? line.credit.toLocaleString() : "-"}
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-100 font-medium">
                  <td colSpan={2} className="px-4 py-2 border text-right text-sm">Total</td>
                  <td className="px-4 py-2 border text-right text-sm">{totals.debit.toLocaleString()}</td>
                  <td className="px-4 py-2 border text-right text-sm">{totals.credit.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Narration */}
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-1">Narration:</p>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">{narration}</p>
          </div>

          {/* Approvals */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Preparer</p>
              <p className="font-medium">{approvals.preparer}</p>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default function JVPreviewModal({ vendor, amount, onClose, onConfirm }) {
  const tds = vendor.tdsRate ? (amount * vendor.tdsRate) / 100 : 0;
  const net = amount - tds;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center px-4">
      <div className="bg-white p-6 rounded-md w-full max-w-md shadow-lg">
        <h3 className="text-lg font-bold mb-3">JV Preview - TDS Deduction</h3>
        <div className="space-y-2 text-sm">
          <p><strong>Vendor:</strong> {vendor.name}</p>
          <p><strong>Amount:</strong> ₹{amount}</p>
          <p><strong>TDS Rate:</strong> {vendor.tdsRate || "N/A"}%</p>
          <p><strong>TDS Deducted:</strong> ₹{tds.toFixed(2)}</p>
          <p><strong>Net Payable:</strong> ₹{net.toFixed(2)}</p>
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">
            Cancel
          </button>
          <button onClick={onConfirm} className="bg-green-600 text-white px-4 py-2 rounded">
            Confirm & Save
          </button>
        </div>
      </div>
    </div>
  );
}

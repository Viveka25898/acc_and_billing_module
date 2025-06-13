export default function AutoJVResultModal({ data, onClose }) {
  const tdsAmount = (data.amount * data.tdsRate) / 100;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center px-2">
      <div className="bg-white rounded-xl p-6 max-w-md w-full text-green-900">
        <h2 className="text-xl font-semibold mb-4">Auto JV Preview</h2>
        <div className="space-y-2">
          <p><strong>Vendor:</strong> {data.vendor}</p>
          <p><strong>Amount:</strong> ₹{data.amount}</p>
          <p><strong>TDS Rate:</strong> {data.tdsRate}%</p>
          <p><strong>TDS Amount:</strong> ₹{tdsAmount}</p>
          <p><strong>Net Payable:</strong> ₹{data.amount - tdsAmount}</p>
        </div>
        <div className="mt-4 text-right">
          <button
            onClick={onClose}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

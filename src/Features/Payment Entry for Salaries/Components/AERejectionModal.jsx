// src/features/salaryPayment/components/RejectionModal.jsx
export default function AERejectionModal({ isOpen, onClose, onSubmit }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">Reject Entry</h2>
        <textarea
          rows={4}
          className="w-full border rounded p-2 text-sm mb-4"
          placeholder="Enter rejection reason"
          onChange={(e) => onSubmit.reasonChange(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-1 text-sm rounded border"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit.confirm}
            className="bg-red-600 text-white px-4 py-1 text-sm rounded hover:bg-red-700"
          >
            Confirm Reject
          </button>
        </div>
      </div>
    </div>
  );
}

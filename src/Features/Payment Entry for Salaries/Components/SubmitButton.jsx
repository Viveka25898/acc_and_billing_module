// src/features/salaryPayment/components/SubmitButton.jsx
export default function SubmitButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded shadow"
    >
      ✅ Submit to Accounts Executive
    </button>
  );
}

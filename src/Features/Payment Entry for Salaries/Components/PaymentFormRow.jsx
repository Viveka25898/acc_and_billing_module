// src/features/salaryPayment/components/PaymentFormRow.jsx

export default function PaymentFormRow({ row, onChange, onDelete }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { [name]: value };

    // Automatically calculate gross total if fixed/allowance changes
    if (name === "fixed" || name === "allowance") {
      const fixed = name === "fixed" ? parseFloat(value) || 0 : parseFloat(row.fixed) || 0;
      const allowance = name === "allowance" ? parseFloat(value) || 0 : parseFloat(row.allowance) || 0;
      updated.gross = fixed + allowance;
    }

    onChange(row.id, updated);
  };

  return (
    <tr className="border">
      <td className="p-2 border">
        <input
          name="code"
          value={row.code}
          onChange={handleChange}
          className="w-full border px-2 py-1 rounded"
        />
      </td>
      <td className="p-2 border">
        <input
          name="name"
          value={row.name}
          onChange={handleChange}
          className="w-full border px-2 py-1 rounded"
        />
      </td>
      <td className="p-2 border">
        <input
        
          name="account"
          value={row.account}
          onChange={handleChange}
          className="w-full border px-2 py-1 rounded"
        />
      </td>
      <td className="p-2 border">
        <input
          name="ifsc"
          value={row.ifsc}
          onChange={handleChange}
          className="w-full border px-2 py-1 uppercase rounded"
        />
      </td>
      <td className="p-2 border">
        <input
          name="fixed"
          type="number"
          value={row.fixed}
          onChange={handleChange}
          className="w-full border px-2 py-1 rounded"
        />
      </td>
      <td className="p-2 border">
        <input
          name="allowance"
          type="number"
          value={row.allowance}
          onChange={handleChange}
          className="w-full border px-2 py-1 rounded"
        />
      </td>
      <td className="p-2 border bg-gray-50 text-center font-semibold">
        ₹ {parseFloat(row.fixed || 0) + parseFloat(row.allowance || 0)}
      </td>
      <td className="p-2 border">
        <input
          name="remarks"
          value={row.remarks}
          onChange={handleChange}
          className="w-full border px-2 py-1 rounded"
        />
      </td>
      <td className="p-2 border text-center">
        <button
          onClick={() => onDelete(row.id)}
          className="text-red-600 hover:text-red-800 font-bold"
        >
          ❌
        </button>
      </td>
    </tr>
  );
}

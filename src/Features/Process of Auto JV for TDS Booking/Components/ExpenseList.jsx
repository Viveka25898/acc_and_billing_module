export default function ExpenseList({ expenses }) {
  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-2">Booked Expenses</h2>
      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead className="bg-green-100">
            <tr>
              <th className="p-2 border">Vendor</th>
              <th className="p-2 border">Amount</th>
              <th className="p-2 border">TDS</th>
              <th className="p-2 border">Net Amount</th>
              <th className="p-2 border">Description</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((e, i) => (
              <tr key={i}>
                <td className="p-2 border">{e.vendorName}</td>
                <td className="p-2 border">₹{e.amount}</td>
                <td className="p-2 border">₹{e.tdsAmount}</td>
                <td className="p-2 border">₹{e.netAmount}</td>
                <td className="p-2 border">{e.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

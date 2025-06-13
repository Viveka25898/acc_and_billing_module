export default function VendorLedgerTable() {
  const dummyLedger = [
    { id: 1, vendor: "ABC Pvt Ltd", totalPaid: 50000, tdsDeducted: 5000 },
    { id: 2, vendor: "XYZ Ltd", totalPaid: 75000, tdsDeducted: 3750 },
  ];

  return (
    <table className="w-full border border-green-700">
      <thead>
        <tr className="bg-green-100">
          <th className="border p-2">Vendor</th>
          <th className="border p-2">Total Paid</th>
          <th className="border p-2">TDS Deducted</th>
        </tr>
      </thead>
      <tbody>
        {dummyLedger.map((entry) => (
          <tr key={entry.id}>
            <td className="border p-2">{entry.vendor}</td>
            <td className="border p-2">₹{entry.totalPaid}</td>
            <td className="border p-2">₹{entry.tdsDeducted}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
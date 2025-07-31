import React, { useState } from "react";

export default function VendorLedgerTable({ data }) {

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Filtering Logic
  // const filteredData = useMemo(() => {
  //   return data.filter((row) => {
  //     const vendorMatch = vendorFilter
  //       ? row?.vendorName?.toLowerCase().includes(vendorFilter.toLowerCase())
  //       : true;

  //     const invoiceMatch = invoiceFilter
  //       ? row?.invoiceNumber?.toLowerCase().includes(invoiceFilter.toLowerCase())
  //       : true;

  //     const dateMatch = dateFilter
  //       ? row?.paymentDate === dateFilter
  //       : true;

  //     return vendorMatch && invoiceMatch && dateMatch;
  //   });
  // }, [data, vendorFilter, invoiceFilter, dateFilter]);

  // Pagination
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(data.length / rowsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (!data || data.length === 0) {
    return <p className="text-center text-gray-500 mt-4">No vendor entries found.</p>;
  }

  return (
    <div className="mt-6">

      {/* Table */}
      <div className="overflow-auto border rounded-md">
        <table className="min-w-full text-sm border border-gray-200 table-fixed">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              {Object.keys(data[0]).map((key) => (
                <th
                  key={key}
                  className="px-2 py-2 border text-left truncate max-w-[150px] whitespace-nowrap"
                >
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentRows.map((row, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                {Object.values(row).map((val, i) => (
                  <td
                    key={i}
                    className="px-2 py-2 border truncate max-w-[150px] whitespace-nowrap"
                    title={val}
                  >
                    {val}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            disabled={currentPage === 1}
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1 ? "bg-green-500 text-white" : "bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

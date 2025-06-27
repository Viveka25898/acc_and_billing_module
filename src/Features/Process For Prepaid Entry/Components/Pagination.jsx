// File: src/features/prepaidEntry/components/Pagination.jsx
import React from "react";

export default function Pagination({ totalRows, rowsPerPage, currentPage, onPageChange }) {
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center mt-4">
      <div className="flex space-x-2">
        {[...Array(totalPages).keys()].map((num) => (
          <button
            key={num}
            onClick={() => onPageChange(num + 1)}
            className={`px-3 py-1 rounded border text-sm ${
              currentPage === num + 1
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-700 border-gray-300"
            }`}
          >
            {num + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

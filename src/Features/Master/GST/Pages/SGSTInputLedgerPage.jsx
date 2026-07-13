import React, { useState, useEffect, useMemo } from "react";
import { GSTLedgerService } from "../../utils/gstLedgerService";
import GSTHeader from "../Components/GSTHeader";
import GSTFilterSection from "../Components/GSTFilterSection";
import GSTLedgerTable from "../Components/GSTLedgerTable";

const SGSTInputLedgerPage = () => {
  const [ledger, setLedger] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    status: "All",
    search: "",
  });

  const loadLedger = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await GSTLedgerService.getLedgerFor("A3007001002", "SGST Input");
      setLedger(data);
    } catch (err) {
      setError(err.message || "Failed to fetch SGST Input Ledger. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLedger();
  }, []);

  // Compute filtered ledger entries on the fly based on filters state
  const filteredLedger = useMemo(() => {
    if (!ledger) return null;

    const filteredEntries = ledger.entries.filter((entry) => {
      // Date Range Match (originalDate is in YYYY-MM-DD format)
      let matchDate = true;
      if (entry.originalDate) {
        const entryDate = new Date(entry.originalDate);
        if (filters.fromDate) {
          const fromDate = new Date(filters.fromDate);
          if (entryDate < fromDate) matchDate = false;
        }
        if (filters.toDate) {
          const toDate = new Date(filters.toDate);
          if (entryDate > toDate) matchDate = false;
        }
      }

      // Status Match
      const matchStatus = filters.status === "All" || entry.status === filters.status;

      // Keyword Search Match
      const searchLower = filters.search.toLowerCase();
      const matchSearch =
        filters.search === "" ||
        entry.voucherNo.toLowerCase().includes(searchLower) ||
        entry.counterparty.toLowerCase().includes(searchLower) ||
        entry.description.toLowerCase().includes(searchLower);

      return matchDate && matchStatus && matchSearch;
    });

    return {
      ...ledger,
      entries: filteredEntries,
    };
  }, [ledger, filters]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            <p className="text-gray-500 font-semibold">Loading SGST Input Ledger...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-red-700 font-semibold">{error}</p>
              <button
                onClick={loadLedger}
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
              >
                Retry Fetching
              </button>
            </div>
          </div>
        )}

        {/* Success / Loaded State */}
        {!loading && !error && ledger && (
          <>
            <GSTHeader data={ledger} />
            <GSTFilterSection
              filters={filters}
              onFilterChange={setFilters}
              onPrint={() => window.print()}
            />
            <GSTLedgerTable ledger={filteredLedger} />
          </>
        )}
      </div>
    </div>
  );
};

export default SGSTInputLedgerPage;


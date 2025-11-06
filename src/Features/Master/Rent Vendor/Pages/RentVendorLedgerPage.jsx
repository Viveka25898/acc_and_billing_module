// RentVendorLedgerPage.js - UPDATED
import React, { useMemo, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { RentLedgerService } from '../../utils/rentLedgerService';
import VendorHeader from "../Component/RentVendorHeader";
import VendorFilterSection from "../Component/FilterSection";
import VendorLedgerTable from "../Component/VendorLedgerTable";

const RentVendorLedgerPage = () => {
  const { accountCode } = useParams();
  const [ledgerData, setLedgerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    entryType: "All",
    status: "All",
    search: ""
  });

  // Load real data
  useEffect(() => {
    const loadLedgerData = async () => {
      try {
        setLoading(true);
        
        const vendorInfo = RentLedgerService.getVendorAccountDetails(accountCode);
        const entries = RentLedgerService.getVendorLedgerEntries(accountCode);
        
        if (!vendorInfo) {
          setError("Vendor account not found");
          return;
        }

        setLedgerData({
          vendorInfo,
          entries
        });
        
      } catch (err) {
        console.error('Error loading vendor ledger:', err);
        setError('Failed to load vendor ledger data');
      } finally {
        setLoading(false);
      }
    };

    loadLedgerData();
  }, [accountCode]);

  // Filter entries
  const filteredEntries = useMemo(() => {
    if (!ledgerData?.entries) return [];
    
    const from = filters.fromDate ? new Date(filters.fromDate) : null;
    const to = filters.toDate ? new Date(filters.toDate) : null;
    const s = (filters.search || "").toLowerCase();

    return ledgerData.entries.filter(e => {
      const date = new Date(e.date);
      if (from && date < from) return false;
      if (to && date > to) return false;
      if (filters.entryType !== "All" && e.entryType !== filters.entryType) return false;
      if (filters.status !== "All" && e.status !== filters.status) return false;
      if (s) {
        const hay = `${e.voucherNo} ${e.narration} ${e.refNo} ${e.counterparty} ${e.siteName}`.toLowerCase();
        if (!hay.includes(s)) return false;
      }
      return true;
    });
  }, [ledgerData, filters]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading vendor ledger...</p>
        </div>
      </div>
    );
  }

  if (error || !ledgerData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="bg-white p-6 rounded shadow max-w-md text-center">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h2 className="text-lg font-semibold mb-2">Vendor Ledger Not Found</h2>
          <p className="text-gray-600 mb-4">{error || `No vendor ledger for account: ${accountCode}`}</p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <VendorHeader info={ledgerData.vendorInfo} />
        <VendorFilterSection 
          filters={filters} 
          onFilterChange={setFilters} 
          onPrint={() => window.print()} 
        />
        <VendorLedgerTable 
          ledgerInfo={ledgerData.vendorInfo} 
          entries={filteredEntries} 
        />
      </div>
    </div>
  );
};

export default RentVendorLedgerPage;
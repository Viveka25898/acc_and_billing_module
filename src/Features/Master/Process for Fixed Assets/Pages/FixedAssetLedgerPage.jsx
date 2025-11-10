import React, { useState, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FASummaryCards } from "../Components/FASummeryCard";
import { FixedAssetLedgerService } from "../../utils/fixedAssetLedgerService";
import { FAAssetHeader } from "../Components/FAAssetHeader";
import { FAFilterSection } from "../Components/FAFilterSection";
import { FALedgerTable } from "../Components/FALedgerTabe";
import { FAFooterSummary } from "../Components/FAFooterSummery";

const FixedAssetLedgerPage = () => {
  const { accountCode } = useParams();
  const [ledgerData, setLedgerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    entryType: "",
    status: "",
    assetTag: ""
  });

  // Load real data from transactions
  useEffect(() => {
    const loadLedgerData = async () => {
      try {
        setLoading(true);
        
        const assetInfo = FixedAssetLedgerService.getAssetAccountDetails(accountCode);
        const entries = FixedAssetLedgerService.getAssetLedgerEntries(accountCode);
        
        if (!assetInfo) {
          setError("Fixed Asset account not found");
          return;
        }

        setLedgerData({
          assetInfo,
          entries
        });
        
      } catch (err) {
        console.error('Error loading Fixed Asset ledger:', err);
        setError('Failed to load asset ledger data');
      } finally {
        setLoading(false);
      }
    };

    if (accountCode) {
      loadLedgerData();
    }
  }, [accountCode]);

  // Compute filtered entries
  const filteredEntries = useMemo(() => {
    if (!ledgerData?.entries) return [];
    
    return ledgerData.entries.filter((entry) => {
      const entryDate = entry.originalDate ? new Date(entry.originalDate) : FixedAssetLedgerService.parseDate(entry.date);
      const from = filters.fromDate ? new Date(filters.fromDate) : null;
      const to = filters.toDate ? new Date(filters.toDate) : null;

      const withinRange = (!from || !entryDate || entryDate >= from) && (!to || !entryDate || entryDate <= to);
      const matchesType = !filters.entryType || entry.entryType === filters.entryType;
      const matchesStatus = !filters.status || entry.status === filters.status;
      const matchesAssetTag = !filters.assetTag || entry.assetTag.toLowerCase().includes(filters.assetTag.toLowerCase());

      return withinRange && matchesType && matchesStatus && matchesAssetTag;
    });
  }, [ledgerData, filters]);

  // Compute totals dynamically
  const totals = useMemo(() => {
    if (!filteredEntries || filteredEntries.length === 0) {
      return {
        totalPurchase: "0.00",
        totalDepreciation: "0.00",
        netBookValue: "0.00"
      };
    }

    let totalPurchase = 0;
    let totalDepreciation = 0;
    let lastNBV = 0;

    filteredEntries.forEach((e) => {
      const purchaseVal = e.purchaseValue !== '-' ? parseFloat(e.purchaseValue.replace(/,/g, "")) : 0;
      const depreciationVal = e.depreciation !== '-' ? parseFloat(e.depreciation.replace(/,/g, "")) : 0;
      const nbvVal = e.netBookValue !== '-' ? parseFloat(e.netBookValue.replace(/,/g, "")) : 0;
      
      totalPurchase += purchaseVal;
      totalDepreciation += depreciationVal;
      lastNBV = nbvVal; // Keep updating to get the last NBV
    });

    return {
      totalPurchase: totalPurchase.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      totalDepreciation: totalDepreciation.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      netBookValue: lastNBV.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    };
  }, [filteredEntries]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Fixed Asset ledger...</p>
        </div>
      </div>
    );
  }

  if (error || !ledgerData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="bg-white p-6 rounded shadow max-w-md text-center">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h2 className="text-lg font-semibold mb-2">Fixed Asset Ledger Not Found</h2>
          <p className="text-gray-600 mb-4">{error || `No asset ledger for account: ${accountCode}`}</p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto my-6 bg-white shadow-lg rounded-lg overflow-hidden">
        <FAAssetHeader info={ledgerData.assetInfo} balances={ledgerData.assetInfo.balances} />
        <FASummaryCards summary={ledgerData.assetInfo.summary} />
        <FAFilterSection filters={filters} setFilters={setFilters} />
        <FALedgerTable entries={filteredEntries} />
        <FAFooterSummary totals={totals} />
      </div>
    </div>
  );
};

export default FixedAssetLedgerPage;

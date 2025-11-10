import React, { useState, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FAVendorLedgerService } from "../../utils/faVendorLedgerService";
import HKVendorHeader from "../../Process For HK Material/Components/HKVendorHeader";
import HKSummaryCards from "../../Process For HK Material/Components/HKSummeryCards";
import HKFilterSection from "../../Process For HK Material/Components/HKFilterSection";
import HKLedgerTable from "../../Process For HK Material/Components/HKLedgerTable";
import HKFooterSummary from "../../Process For HK Material/Components/HKFooterSummery";

const FAVendorLedgerPage = () => {
  const { accountCode } = useParams();
  const [ledgerData, setLedgerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    entryType: "",
    status: "",
  });

  useEffect(() => {
    const loadLedgerData = async () => {
      try {
        setLoading(true);
        
        const vendorInfo = FAVendorLedgerService.getVendorAccountDetails(accountCode);
        const entries = FAVendorLedgerService.getVendorLedgerEntries(accountCode);
        
        if (!vendorInfo) {
          setError("Fixed Asset vendor account not found");
          return;
        }

        setLedgerData({
          vendorInfo,
          entries
        });
        
      } catch (err) {
        console.error('Error loading FA vendor ledger:', err);
        setError('Failed to load vendor ledger data');
      } finally {
        setLoading(false);
      }
    };

    if (accountCode) {
      loadLedgerData();
    }
  }, [accountCode]);

  const filteredEntries = useMemo(() => {
    if (!ledgerData?.entries) return [];
    
    return ledgerData.entries.filter((entry) => {
      const entryDate = entry.originalDate ? new Date(entry.originalDate) : FAVendorLedgerService.parseDate(entry.date);
      const from = filters.fromDate ? new Date(filters.fromDate) : null;
      const to = filters.toDate ? new Date(filters.toDate) : null;

      const withinRange =
        (!from || !entryDate || entryDate >= from) && (!to || !entryDate || entryDate <= to);

      const matchesType =
        !filters.entryType || entry.entryType === filters.entryType;

      const matchesStatus =
        !filters.status || entry.status === filters.status;

      return withinRange && matchesType && matchesStatus;
    });
  }, [ledgerData, filters]);

  const totals = useMemo(() => {
    if (!filteredEntries || filteredEntries.length === 0) {
      return {
        totalDebit: "0.00",
        totalCredit: "0.00",
        closingBalance: "0.00",
        balanceType: "CR"
      };
    }

    let totalDebit = 0;
    let totalCredit = 0;
    let lastBalance = null;
    let lastBalanceType = "CR";

    filteredEntries.forEach((e) => {
      const debitVal = e.debit !== '-' ? parseFloat(e.debit.replace(/,/g, "")) : 0;
      const creditVal = e.credit !== '-' ? parseFloat(e.credit.replace(/,/g, "")) : 0;
      totalDebit += debitVal;
      totalCredit += creditVal;
      
      if (e.balance) {
        lastBalance = e.balance;
        lastBalanceType = e.balanceType || (e.balance.includes('CR') ? 'CR' : 'DR');
      }
    });

    const closingBalance = totalCredit - totalDebit;
    const closingBalanceType = closingBalance >= 0 ? 'CR' : 'DR';
    
    const finalBalance = lastBalance 
      ? lastBalance.split(' ')[0] 
      : Math.abs(closingBalance).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    
    return {
      totalDebit: totalDebit.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      totalCredit: totalCredit.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      closingBalance: finalBalance,
      balanceType: lastBalanceType || closingBalanceType
    };
  }, [filteredEntries]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Fixed Asset vendor ledger...</p>
        </div>
      </div>
    );
  }

  if (error || !ledgerData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="bg-white p-6 rounded shadow max-w-md text-center">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h2 className="text-lg font-semibold mb-2">FA Vendor Ledger Not Found</h2>
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
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-5xl mx-auto my-6 bg-white shadow-lg rounded-lg overflow-hidden">
        <HKVendorHeader info={ledgerData.vendorInfo} balances={ledgerData.vendorInfo.balances} />
        <HKSummaryCards summary={ledgerData.vendorInfo.summary} />
        <HKFilterSection filters={filters} setFilters={setFilters} />
        <HKLedgerTable entries={filteredEntries} />
        <HKFooterSummary totals={totals} />
      </div>
    </div>
  );
};

export default FAVendorLedgerPage;



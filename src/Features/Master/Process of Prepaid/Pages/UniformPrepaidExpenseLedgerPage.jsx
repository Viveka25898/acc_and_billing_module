import React, { useState, useEffect } from "react";
import { PrepaidUniformLedgerService } from "../../utils/prepaidUniformLedgerService";
import UniformLedgerHeader from "../Components/UniformLedgerHeader";
import UniformLedgerFilters from "../Components/UniformLedgerFilter";
import UniformLedgerTable from "../Components/UniformLedgerTable";
import UniformLedgerFooter from "../Components/UniformLedgerFooter";

const UniformPrepaidExpenseLedger = () => {
  const [ledgerData, setLedgerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    vendor: "All",
    entryType: "All",
  });

  // Load real data from transactions
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Get account details for header
        const accountDetails = PrepaidUniformLedgerService.getPrepaidExpenseAccountDetails("A3005001");
        
        // Get ledger entries from real transactions
        const entries = PrepaidUniformLedgerService.getPrepaidExpenseLedgerEntries("A3005001");
        
        setLedgerData({
          accountDetails,
          entries
        });
        
      } catch (error) {
        console.error('Error loading Uniform Prepaid Expense ledger:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter logic
  const filteredEntries = ledgerData?.entries.filter((entry) => {
    const entryDate = new Date(entry.originalDate || entry.date);
    const fromDate = filters.fromDate ? new Date(filters.fromDate) : null;
    const toDate = filters.toDate ? new Date(filters.toDate) : null;

    const dateMatch =
      (!fromDate || entryDate >= fromDate) &&
      (!toDate || entryDate <= toDate);

    const vendorMatch =
      filters.vendor === "All" || entry.vendor === filters.vendor;

    const typeMatch =
      filters.entryType === "All" ||
      (filters.entryType === "Purchase Only" && entry.entryType === "Purchase") ||
      (filters.entryType === "Amortization Only" && entry.entryType === "Amortization");

    return dateMatch && vendorMatch && typeMatch;
  }) || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Uniform Prepaid Expense ledger...</p>
        </div>
      </div>
    );
  }

  if (!ledgerData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No Uniform Prepaid Expense data found</p>
        </div>
      </div>
    );
  }

  // Format entries for table display
  const formattedEntries = filteredEntries.map(entry => {
    // Format debit and credit amounts
    const debitAmount = entry.debit 
      ? `₹${typeof entry.debit === 'number' ? entry.debit.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : entry.debit}`
      : '-';
    const creditAmount = entry.credit 
      ? `₹${typeof entry.credit === 'number' ? entry.credit.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : entry.credit}`
      : '-';
    
    return {
      id: entry.voucherNo || entry.refNo,
      date: entry.date,
      voucherType: entry.voucherType || entry.entryType,
      debit: debitAmount,
      credit: creditAmount,
      invoiceNumber: entry.invoiceNumber || entry.documentNo || '-',
      description: entry.description,
      vendor: entry.vendor,
      prepaidAmount: entry.prepaidAmount || '-',
      period: entry.prepaidStartMonth || '-',
      totalMonths: entry.totalMonths || entry.period || '-',
      monthlyAmort: entry.monthlyAmort || '-',
      counterparty: entry.counterparty || entry.vendor,
      customer: entry.customer || '-',
      site: entry.site || '-',
      state: entry.state || '-',
      costCenter: entry.costCenter || '-',
      approvedBy: entry.approvedBy || '-',
      cumulativeAmort: entry.cumulativeAmort || '-',
      remainingBalance: entry.remainingBalance
    };
  });

  return (
    <div className="m-6 max-w-5xl rounded-lg shadow-md bg-white overflow-hidden">
      <UniformLedgerHeader accountDetails={ledgerData.accountDetails} />
      <UniformLedgerFilters 
        filters={filters} 
        onFilterChange={setFilters}
        vendors={[...new Set(ledgerData.entries.map(e => e.vendor).filter(Boolean))]}
      />
      <UniformLedgerTable data={formattedEntries} />
      <UniformLedgerFooter 
        totalEntries={filteredEntries.length}
        totalPrepaid={ledgerData.accountDetails?.balances?.[0]?.amount || '₹0.00'}
        totalAmortized={ledgerData.accountDetails?.balances?.[1]?.amount || '₹0.00'}
        remainingBalance={ledgerData.accountDetails?.balances?.[2]?.amount || '₹0.00'}
      />
    </div>
  );
};

export default UniformPrepaidExpenseLedger;

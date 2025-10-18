import React, { useState } from 'react';
import { ledgerEntries, summaryData, vendorData } from '../data/vendorData';
import VendorHeader from '../Components/VendorHeader';
import SummaryCards from '../Components/SummeryCards';
import FilterSection from '../Components/FilterSection';
import LedgerTable from '../Components/LedgerTable';
import FooterSummary from '../Components/FooterSummary';


const VendorLedgerMasterPage = () => {
  const [filters, setFilters] = useState({
    fromDate: '2024-04-01',
    toDate: '2024-05-31',
    entryType: '',
    status: ''
  });

  // Filter entries based on current filters
  const filteredEntries = ledgerEntries.filter(entry => {
    if (filters.entryType && entry.entryType !== filters.entryType) return false;
    if (filters.status && entry.status !== filters.status) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <VendorHeader data={vendorData} />
        <SummaryCards data={summaryData} />
        <FilterSection filters={filters} setFilters={setFilters} />
        <LedgerTable entries={filteredEntries} />
        <FooterSummary entries={filteredEntries} />
      </div>
    </div>
  );
};

export default VendorLedgerMasterPage;
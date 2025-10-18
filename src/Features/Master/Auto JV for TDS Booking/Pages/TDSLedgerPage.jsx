// src/features/Process of Auto JV for TDS Booking/Pages/TDSLedgerPage.jsx
import React, { useState } from 'react';
import { tdsLedgerEntries, tdsSectionData, tdsSummaryData } from '../data/tdsData';
import TDSHeader from '../Components/TDSHeader';
import TDSSummaryCards from '../Components/TDSSummaryCards';
import TDSFilterSection from '../Components/TDSFilterSection';
import TDSLedgerTable from '../Components/TDSLedgerTable';
import TDSFooterSummary from '../Components/TDSFooterSummary';


const TDSLedgerPage = () => {
  const [filters, setFilters] = useState({
    fromDate: '2024-04-01',
    toDate: '2024-05-31',
    entryType: '',
    vendor: ''
  });

  // Filter entries based on current filters
  const filteredEntries = tdsLedgerEntries.filter(entry => {
    if (filters.entryType && entry.entryType !== filters.entryType) return false;
    if (filters.vendor && !entry.vendor.includes(filters.vendor)) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <TDSHeader data={tdsSectionData} />
        <TDSSummaryCards data={tdsSummaryData} />
        <TDSFilterSection filters={filters} setFilters={setFilters} />
        <TDSLedgerTable entries={filteredEntries} />
        <TDSFooterSummary entries={filteredEntries} />
      </div>
    </div>
  );
};

export default TDSLedgerPage;
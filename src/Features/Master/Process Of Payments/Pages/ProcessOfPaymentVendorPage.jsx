/* eslint-disable react-hooks/rules-of-hooks */
// src/Features/Master/Process Of Payments/Pages/ProcessOfPaymentVendorPage.jsx
import React, { useState, useMemo } from 'react';
import { ledgerEntries, summaryData, vendorData } from '../data/vendorData';
import VendorHeader from '../Components/VendorHeader';
import SummaryCards from '../Components/SummaryCards';
import FilterSection from '../../EmployeeAdvanceAndSettlement/Components/FilterSection';
import LedgerTable from '../Components/LedgerTable';
import FooterSummary from '../Components/FooterSummary';

const ProcessOfPaymentVendorPage = () => {
  // vendorData is a single object (the Process Of Payment vendor)
  if (!vendorData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-6 rounded shadow">Vendor data unavailable</div>
      </div>
    );
  }

  const [filters, setFilters] = useState({
    fromDate: '2024-04-01',
    toDate: '2024-05-31',
    entryType: '',
    status: ''
  });

  // Filter entries based on current filters
  const filteredEntries = useMemo(() => {
    return ledgerEntries.filter(entry => {
      if (filters.entryType && entry.entryType !== filters.entryType) return false;
      if (filters.status && entry.status !== filters.status) return false;
      return true;
    });
  }, [filters]);

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

export default ProcessOfPaymentVendorPage;

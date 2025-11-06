import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ledgerEntries, summaryData, vendorData } from '../data/vendorData';
import VendorHeader from '../Components/VendorHeader';
import SummaryCards from '../Components/SummaryCards';
import FilterSection from '../../EmployeeAdvanceAndSettlement/Components/FilterSection';
import LedgerTable from '../Components/LedgerTable';
import FooterSummary from '../Components/FooterSummary';

const ProcessOfPaymentVendorPage = () => {
  const { accountCode } = useParams(); // ✅ read from URL
  const [filters, setFilters] = useState({
    fromDate: '2024-04-01',
    toDate: '2024-05-31',
    entryType: '',
    status: ''
  });

  const [currentVendor, setCurrentVendor] = useState(vendorData); // default

  // ✅ simulate different vendors by account code
  useEffect(() => {
    // For now, just use dummy branching (later this will come from backend)
    if (accountCode === 'L2005001001') {
      setCurrentVendor({
        ...vendorData,
        name: 'Ramesh Kumar (Owner)',
        ledgerCode: 'L2005001001',
        type: 'Rent Vendor (Owner)',
      });
    } else if (accountCode === 'L2005001002') {
      setCurrentVendor({
        ...vendorData,
        name: 'Rajesh Singh (Contract Vendor)',
        ledgerCode: 'L2005001002',
        type: 'Contract Vendor',
      });
    } else {
      setCurrentVendor({
        ...vendorData,
        name: 'Generic Vendor',
        ledgerCode: accountCode,
        type: 'Other Vendor',
      });
    }
  }, [accountCode]);

  // ✅ Filter entries (just like before)
  const filteredEntries = ledgerEntries.filter(entry => {
    if (filters.entryType && entry.entryType !== filters.entryType) return false;
    if (filters.status && entry.status !== filters.status) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* ✅ Dynamic vendor info */}
        <VendorHeader data={currentVendor} />
        <SummaryCards data={summaryData} />
        <FilterSection filters={filters} setFilters={setFilters} />
        <LedgerTable entries={filteredEntries} />
        <FooterSummary entries={filteredEntries} />
      </div>
    </div>
  );
};

export default ProcessOfPaymentVendorPage;

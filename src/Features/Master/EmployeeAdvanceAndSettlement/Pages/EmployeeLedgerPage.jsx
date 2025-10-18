import React, { useState } from 'react';
import EmployeeHeader from '../Components/EmployeeHeader';
import FilterSection from '../Components/FilterSection';
import LedgerTable from '../Components/LedgerTable';
import FooterSummary from '../Components/FooterSummary';
import { employeeData } from "../data/EmployeeData";
import { ledgerEntries } from "../data/LedgerEntries";

const EmployeeLedgerPage = () => {
  const [filters, setFilters] = useState({
    fromDate: '2024-04-01',
    toDate: '2024-05-31',
    entryType: '',
    status: ''
  });

  return (
     <div className='w-full min-h-screen bg-gray-100 p-2 md:p-4'>
      <div className='max-w-5xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden'>
        <EmployeeHeader data={employeeData}/>
        <FilterSection filters={filters} setFilters={setFilters}/>
        
        {/* Table Container with Scroll */}
        <div className='p-3 md:p-5'>
          <LedgerTable entries={ledgerEntries}/>
        </div>
        
        <FooterSummary entries={ledgerEntries}/>
      </div>
    </div>
  );
};

export default EmployeeLedgerPage;
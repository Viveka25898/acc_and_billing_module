// pages/EmployeeLedgerPage.jsx - UPDATED VERSION
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import EmployeeHeader from '../Components/EmployeeHeader';
import FilterSection from '../Components/FilterSection';
import LedgerTable from '../Components/LedgerTable';
import FooterSummary from '../Components/FooterSummary';
import { LedgerService } from '../../utils/ledgerService';

const EmployeeLedgerPage = () => {
  const { accountCode } = useParams();
  const [filters, setFilters] = useState({
    fromDate: '2024-04-01',
    toDate: '2024-05-31',
    entryType: '',
    status: ''
  });
  
  const [accountData, setAccountData] = useState(null);
  const [ledgerEntries, setLedgerEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLedgerData();
  }, [accountCode]);

  const loadLedgerData = () => {
    try {
      setLoading(true);
      console.log(`🔄 Loading ledger for account: ${accountCode}`);
      
      // Get account details
      const details = LedgerService.getAccountDetails(accountCode);
      setAccountData(details);
      
      // Get ledger entries
      const entries = LedgerService.getLedgerEntries(accountCode);
      setLedgerEntries(entries);
      
      console.log(`✅ Loaded ${entries.length} entries for ${accountCode}`);
    } catch (error) {
      console.error('❌ Error loading ledger data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gray-100 p-2 md:p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading ledger data...</p>
        </div>
      </div>
    );
  }

  if (!accountData) {
    return (
      <div className="w-full min-h-screen bg-gray-100 p-2 md:p-4 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600">Account Not Found</h2>
          <p className="text-gray-600">The account {accountCode} does not exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full min-h-screen bg-gray-100 p-2 md:p-4'>
      <div className='max-w-5xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden'>
        <EmployeeHeader data={accountData}/>
        <FilterSection filters={filters} setFilters={setFilters}/>
        
        {/* Table Container with Scroll */}
        <div className='p-3 md:p-5'>
          {ledgerEntries.length > 0 ? (
            <LedgerTable entries={ledgerEntries}/>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No transactions found for this account.</p>
              <p className="text-sm mt-2">Transactions will appear here when advances are approved.</p>
            </div>
          )}
        </div>
        
        {ledgerEntries.length > 0 && (
          <FooterSummary entries={ledgerEntries}/>
        )}
      </div>
    </div>
  );
};

export default EmployeeLedgerPage;
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import LedgerHeader from '../Components/LedgerHeader';
import FilterSection from '../Components/FilterSection';
import TransactionTable from '../Components/TransactionTable';
import SummarySection from '../Components/SummerySection';

const ConveyancePayblePage = () => {
  const [filters, setFilters] = useState({
    fromDate: new Date(new Date().getFullYear(), 3, 1).toISOString().split('T')[0], // April 1 of current year
    toDate: new Date().toISOString().split('T')[0],
    entryType: 'All',
    status: 'All'
  });

  const [transactions, setTransactions] = useState([]);
  const [employeeInfo, setEmployeeInfo] = useState(null);
  const [summaryData, setSummaryData] = useState({
    totalClaims: 0,
    totalPayments: 0,
    totalVisits: 0,
    outstanding: 0
  });

  // Load real data from localStorage
  useEffect(() => {
    loadConveyanceLedgerData();
    
    // Listen for conveyance updates
    const handleConveyanceUpdate = () => {
      loadConveyanceLedgerData();
    };
    window.addEventListener('conveyanceUpdated', handleConveyanceUpdate);
    
    return () => {
      window.removeEventListener('conveyanceUpdated', handleConveyanceUpdate);
    };
  }, []);

  const loadConveyanceLedgerData = () => {
    try {
      // Get all transactions from localStorage
      const allTransactions = JSON.parse(localStorage.getItem('transactions')) || [];
      const chartOfAccounts = JSON.parse(localStorage.getItem('chartOfAccounts')) || [];
      const conveyanceRequests = JSON.parse(localStorage.getItem('conveyanceRequests')) || [];
      const ledgerBalances = JSON.parse(localStorage.getItem('ledgerBalances')) || {};

      // Find Conveyance Payable GL code (L2001001)
      const payableGLCode = 'L2001001';
      const payableAccount = chartOfAccounts.find(acc => acc.code === payableGLCode);

      // Filter transactions involving L2001001
      const conveyanceTransactions = allTransactions.filter(txn => 
        txn.entries?.some(entry => entry.glCode === payableGLCode)
      );

      // Sort by date
      conveyanceTransactions.sort((a, b) => new Date(a.date) - new Date(b.date));

      // Convert to ledger format
      const ledgerEntries = [];
      let runningBalance = 0;
      
      // Opening balance entry
      const openingBalance = ledgerBalances[payableGLCode]?.balance || 0;
      runningBalance = openingBalance;
      
      if (openingBalance !== 0 || conveyanceTransactions.length === 0) {
        ledgerEntries.push({
          id: 'opening',
          date: new Date(new Date().getFullYear(), 3, 1).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }),
          voucherNo: 'OB-' + new Date().getFullYear(),
          entryType: 'opening',
          debit: null,
          credit: null,
          balance: Math.abs(openingBalance),
          balanceType: openingBalance === 0 ? 'zero' : (openingBalance > 0 ? 'credit' : 'debit'),
          narration: `Opening Balance B/F FY ${new Date().getFullYear()}-${(new Date().getFullYear() + 1).toString().slice(-2)}`,
          claimId: '-',
          visits: '-',
          period: '-',
          counterparty: '-',
          approvedBy: '-',
          hasAttachment: false,
          status: 'posted',
          rowClass: 'opening-row'
        });
      }

      // Process each transaction
      conveyanceTransactions.forEach((txn, index) => {
        const payableEntry = txn.entries.find(entry => entry.glCode === payableGLCode);
        const expenseEntry = txn.entries.find(entry => entry.glCode.startsWith('X2001003') || entry.glCode.startsWith('X2001'));
        
        if (payableEntry) {
          const debit = payableEntry.debit || 0;
          const credit = payableEntry.credit || 0;
          runningBalance += credit - debit; // Credit increases payable, debit decreases
          
          // Find corresponding conveyance request
          const conveyanceRequest = conveyanceRequests.find(req => 
            req.transactionId === txn.id || req.voucherNumber === txn.voucherNo
          );

          const dateFormatted = new Date(txn.date).toLocaleDateString('en-GB', { 
            day: '2-digit', month: 'short', year: '2-digit' 
          });

          ledgerEntries.push({
            id: txn.id || `txn_${index}`,
            date: dateFormatted,
            voucherNo: txn.voucherNo || txn.voucherNumber,
            entryType: credit > 0 ? 'expense' : 'payment',
            debit: debit > 0 ? debit : null,
            credit: credit > 0 ? credit : null,
            balance: Math.abs(runningBalance),
            balanceType: runningBalance === 0 ? 'zero' : (runningBalance > 0 ? 'credit' : 'debit'),
            narration: payableEntry.narration || txn.narration || 'Conveyance expense',
            claimId: conveyanceRequest?.id ? `CONV-${conveyanceRequest.id.slice(-6)}` : '-',
            visits: conveyanceRequest ? 1 : '-',
            period: new Date(txn.date).toLocaleDateString('en-GB', { month: 'short', year: '2-digit' }),
            counterparty: expenseEntry?.glName || expenseEntry?.glCode || 'Expense Account',
            approvedBy: txn.approvedBy || conveyanceRequest?.aeApprovedBy || '-',
            hasAttachment: !!conveyanceRequest?.reports?.length || !!conveyanceRequest?.receipts?.length,
            status: txn.status || 'posted',
            rowClass: credit > 0 ? 'expense-row' : 'payment-row'
          });
        }
      });

      // Calculate summary
      const totalClaims = ledgerEntries
        .filter(e => e.credit > 0)
        .reduce((sum, e) => sum + (e.credit || 0), 0);
      
      const totalPayments = ledgerEntries
        .filter(e => e.debit > 0)
        .reduce((sum, e) => sum + (e.debit || 0), 0);
      
      const totalVisits = conveyanceTransactions.length;
      const outstanding = runningBalance;

      setTransactions(ledgerEntries);
      setSummaryData({
        totalClaims,
        totalPayments,
        totalVisits,
        outstanding
      });

      // Set employee info (this is a shared account, so show account info)
      setEmployeeInfo({
        name: payableAccount?.name || 'CONVEYANCE PAYABLE',
        code: payableGLCode,
        glAccount: payableGLCode,
        department: 'Finance',
        designation: 'Shared Liability Account',
        accountType: 'Current Liability',
        financialYear: `${new Date().getFullYear()}-${(new Date().getFullYear() + 1).toString().slice(-2)}`,
        period: `Apr-${new Date().getFullYear()} to ${new Date().toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}`,
        openingBalance: openingBalance === 0 
          ? '₹0.00 (No Outstanding)' 
          : `₹${Math.abs(openingBalance).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${openingBalance > 0 ? 'CR' : 'DR'}`
      });
    } catch (error) {
      console.error('Error loading conveyance ledger data:', error);
      setTransactions([]);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    // Apply filters to transactions
    loadConveyanceLedgerData();
  };

  const handleExportPDF = () => {
    console.log('Exporting PDF...');
    // PDF export logic
  };

  const handlePrint = () => {
    console.log('Printing...');
    window.print();
  };

  if (!employeeInfo) {
    return (
      <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-gray-600">Loading ledger data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <LedgerHeader employeeInfo={employeeInfo} />
          <FilterSection 
            filters={filters}
            onFilterChange={handleFilterChange}
            onExportPDF={handleExportPDF}
            onPrint={handlePrint}
          />
          <TransactionTable transactions={transactions} />
          <SummarySection summaryData={summaryData} />
        </div>
      </div>
    </div>
  );
};

export default ConveyancePayblePage;
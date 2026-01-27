import React, { useState, useEffect } from "react";
import { PrepaidUniformLedgerService } from "../../utils/prepaidUniformLedgerService";
import UniformExpenseLedgerHeader from "../Components/UniformExpenseLedgerHeader";
import UniformExpenseLedgerTable from "../Components/UniformExpenseLedgerTable";
import UniformExpenseLedgerFooter from "../Components/UniformExpenseLedgerFooter";

const UniformExpenseLedgerPage = () => {
  const [ledgerData, setLedgerData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load real data from transactions
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Get ledger entries from real transactions for X2001004 (Uniform Expense)
        const entries = PrepaidUniformLedgerService.getUniformExpenseLedgerEntries("X2001004");
        
        // Calculate totals - entries have formatted strings, so parse them
        const totalDebit = entries.reduce((sum, e) => {
          const debitStr = e.debit || '0';
          const debitNum = typeof debitStr === 'string' 
            ? parseFloat(debitStr.replace(/[₹,]/g, '')) || 0
            : debitStr || 0;
          return sum + debitNum;
        }, 0);
        const totalCredit = entries.reduce((sum, e) => {
          const creditStr = e.credit || '0';
          if (creditStr === '-') return sum;
          const creditNum = typeof creditStr === 'string' 
            ? parseFloat(creditStr.replace(/[₹,]/g, '')) || 0
            : creditStr || 0;
          return sum + creditNum;
        }, 0);
        const closingBalance = entries.length > 0 ? entries[entries.length - 1].balance : '₹0.00 DR';
        
        setLedgerData({
          entries,
          summary: {
            totalDebit,
            totalCredit,
            closingBalance,
            totalEntries: entries.length
          }
        });
        
      } catch (error) {
        console.error('Error loading Uniform Expense ledger:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Uniform Expense ledger...</p>
        </div>
      </div>
    );
  }

  if (!ledgerData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No Uniform Expense data found</p>
        </div>
      </div>
    );
  }

  // Format entries for table display
  const formattedEntries = ledgerData.entries.map((entry, idx) => ({
    id: entry.voucherNo || entry.refNo || idx,
    date: entry.date,
    voucherNo: entry.voucherNo,
    invoiceNumber: entry.invoiceNumber || entry.refNo || '-',
    documentNo: entry.voucherNo,
    entryType: entry.entryType,
    description: entry.description,
    debit: entry.debit,
    credit: entry.credit || '-',
    balance: entry.balance,
    counterparty: entry.counterparty,
    approvedBy: entry.approvedBy,
    status: entry.status,
    costCenter: entry.costCenter || '-',
    customer: entry.customer || '-',
    site: entry.site || '-',
    state: entry.state || '-'
  }));

  return (
    <div className="m-6 max-w-5xl rounded-lg shadow-md bg-white overflow-hidden">
      <UniformExpenseLedgerHeader 
        totalEntries={ledgerData.summary.totalEntries}
        totalDebit={ledgerData.summary.totalDebit}
        closingBalance={ledgerData.summary.closingBalance}
      />
      <UniformExpenseLedgerTable data={formattedEntries} />
      <UniformExpenseLedgerFooter 
        totalEntries={ledgerData.summary.totalEntries}
        totalDebit={ledgerData.summary.totalDebit}
        closingBalance={ledgerData.summary.closingBalance}
      />
    </div>
  );
};

export default UniformExpenseLedgerPage;

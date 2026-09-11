import React from 'react';

const RentLedgerHeader = ({ data }) => {
  if (!data) return null;

  const glAccount = data.glAccount || data.accountCode || 'X2001002002';
  const ledgerName = data.ledgerName || data.description || 'BRANCH OFFICE RENT';
  const parentAccount = data.parentAccount || 'OTHER BRANCH EXPENSES';
  const parentCode = data.parentCode || 'X2001002';
  const accountCategory = data.accountCategory || 'EXPENSE';
  const accountType = data.accountType || 'Operating Expense';
  const debitCreditNature = data.debitCreditNature || 'DEBIT';
  const financialYear = data.financialYear || '-';
  const period = data.period || '-';
  const costCenter = data.costCenter || 'All Cost Centers';
  const department = data.department || 'Operations & Property Management';

  const formatAmount = (val) => {
    if (val === null || val === undefined || val === '' || val === '-') return '-';
    if (typeof val === 'number') {
      return `₹${val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    const strVal = String(val);
    return strVal.startsWith('₹') ? strVal : `₹${strVal}`;
  };

  const openingStr = formatAmount(data.openingBalance);
  const periodExpensesStr = formatAmount(data.periodExpenses);
  const closingStr = formatAmount(data.closingBalance);

  const stats = data.stats || {};
  const totalTxns = stats.totalTransactions ?? '-';
  const avgTxn = stats.avgPerTransaction ? formatAmount(stats.avgPerTransaction) : '-';

  return (
    <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white p-5 md:p-7 rounded-xl shadow-lg mb-6 border border-emerald-600/30">
      {/* Header Top Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-500/30 pb-5 mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-500/30 text-emerald-100 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-400/30">
              GL Code: {glAccount}
            </span>
            <span className="bg-teal-500/30 text-teal-100 text-xs font-medium px-2.5 py-0.5 rounded-full border border-teal-400/30">
              {accountCategory} • {debitCreditNature}
            </span>
          </div>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight">
            {ledgerName}
          </h1>
          <p className="text-xs text-emerald-200 mt-1 flex items-center gap-1.5">
            <span>Parent: <strong className="text-white">{parentAccount}</strong> ({parentCode})</span>
            <span>•</span>
            <span>Type: <strong className="text-white">{accountType}</strong></span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-lg border border-white/10 text-right">
            <div className="text-[10px] text-emerald-200 uppercase tracking-wider font-semibold">Financial Year</div>
            <div className="text-xs md:text-sm font-bold text-white">{financialYear}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-lg border border-white/10 text-right">
            <div className="text-[10px] text-emerald-200 uppercase tracking-wider font-semibold">Period</div>
            <div className="text-xs md:text-sm font-bold text-white">{period}</div>
          </div>
        </div>
      </div>

      {/* Primary Financial Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-5">
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-3.5 border border-white/15">
          <div className="text-xs text-emerald-200 font-medium">Opening Balance</div>
          <div className="text-lg md:text-xl font-bold text-white mt-0.5">{openingStr}</div>
          <div className="text-[10px] text-emerald-300 mt-1">{data.openingBalanceType || 'Debit Balance'}</div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-lg p-3.5 border border-white/15">
          <div className="text-xs text-emerald-200 font-medium">Period Expenses</div>
          <div className="text-lg md:text-xl font-bold text-emerald-300 mt-0.5">{periodExpensesStr}</div>
          <div className="text-[10px] text-emerald-200 mt-1">Total booked in period</div>
        </div>

        <div className="bg-emerald-900/40 backdrop-blur-md rounded-lg p-3.5 border border-emerald-400/30">
          <div className="text-xs text-emerald-200 font-medium">Closing Balance</div>
          <div className="text-lg md:text-xl font-bold text-yellow-300 mt-0.5">{closingStr}</div>
          <div className="text-[10px] text-emerald-200 mt-1">As of current period</div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-lg p-3.5 border border-white/15">
          <div className="text-xs text-emerald-200 font-medium">Total Transactions</div>
          <div className="text-lg md:text-xl font-bold text-white mt-0.5">{totalTxns}</div>
          <div className="text-[10px] text-emerald-200 mt-1">Avg: {avgTxn}</div>
        </div>
      </div>

      {/* Meta Footer Bar */}
      <div className="flex flex-wrap items-center justify-between text-xs text-emerald-100/90 pt-3 border-t border-emerald-500/20 gap-2">
        <div className="flex items-center gap-4">
          <span>Cost Center: <strong className="text-white">{costCenter}</strong></span>
          <span>Department: <strong className="text-white">{department}</strong></span>
        </div>
        <div className="text-[11px] text-emerald-200/80">
          iSmart ERP Accounts & Billing Module
        </div>
      </div>
    </div>
  );
};

export default RentLedgerHeader;


import React from 'react';
import InfoItem from './InfoItem';

const EmployeeHeader = ({ data }) => {
  return (
    <div className='bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white p-3 md:p-5 min-w-[320px] max-w-5xl mx-auto'>
      <h1 className='text-lg md:text-xl font-bold mb-3'>Employee Ledger</h1>
      
      {/* Employee Info Container */}
      <div className='flex flex-col md:flex-row md:flex-wrap gap-2 mb-3'>
        <div className='flex-1 min-w-[calc(50%-0.5rem)] md:min-w-[calc(25%-0.5rem)]'>
          <InfoItem label="Employee ID" value={data.employeeId}/>
        </div>
        <div className='flex-1 min-w-[calc(50%-0.5rem)] md:min-w-[calc(25%-0.5rem)]'>
          <InfoItem label="Employee Name" value={data.employeeName}/>
        </div>
        <div className='flex-1 min-w-[calc(50%-0.5rem)] md:min-w-[calc(25%-0.5rem)]'>
          <InfoItem label="Department" value={data.department}/>
        </div>
        <div className='flex-1 min-w-[calc(50%-0.5rem)] md:min-w-[calc(25%-0.5rem)]'>
          <InfoItem label="Reporting Manager" value={data.reportingManager}/>
        </div>
      </div>

      {/* Account Info Container */}
      <div className='flex flex-col md:flex-row md:flex-wrap gap-2 mb-3'>
        <div className='flex-1 min-w-[calc(50%-0.5rem)] md:min-w-[calc(25%-0.5rem)]'>
          <InfoItem label="GL Account Code" value={data.glAccountCode} />
        </div>
        <div className='flex-1 min-w-[calc(50%-0.5rem)] md:min-w-[calc(25%-0.5rem)]'>
          <InfoItem label="Account Name" value={data.accountName} />
        </div>
        <div className='flex-1 min-w-[calc(50%-0.5rem)] md:min-w-[calc(25%-0.5rem)]'>
          <InfoItem label="Financial Year" value={data.financialYear} />
        </div>
        <div className='flex-1 min-w-[calc(50%-0.5rem)] md:min-w-[calc(25%-0.5rem)]'>
          <InfoItem label="Period" value={data.period} />
        </div>
      </div>

      {/* Balance Card */}
      <div className='bg-white/20 backdrop-blur-sm rounded-lg p-2.5 border border-white/30 max-w-md'>
        <div className="text-[11px] mb-0.5 opacity-90">Opening Balance ({data.openingBalance.date})</div>
        <div className="text-xl md:text-2xl font-bold mb-0.5">
          ₹{data.openingBalance.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div className="text-[11px] opacity-90">{data.openingBalance.type}</div>
      </div>
    </div>
  );
};

export default EmployeeHeader;
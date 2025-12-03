import React from 'react'
import { InfoItem } from './InfoItem'

const CompanyInfo = ({ info }) => {
  console.log(info)
  return (
    <div className="bg-gray-50 px-6 py-5 border-b-2 border-gray-200 md:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <InfoItem label="Company Name" value={'iSmart'} />
        <InfoItem label="TAN Number" value={info.tanNumber} />
        <InfoItem label="Financial Year" value={info.financialYear} />
        <InfoItem label="Quarter" value={info.quarter} />
        <InfoItem label="Report Date" value={info.reportDate} />
      </div>
    </div>
  )
}

export default CompanyInfo

import { InfoItem } from './InfoItem'

export const InfoBar = ({ info }) => {
  return (
    <section className="bg-gray-100 border-b border-gray-300 px-4 py-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
        <InfoItem label="Company Name" value={info.companyName} />
        <InfoItem label="GL Code" value={info.glCode} />
        <InfoItem label="Ledger Name" value={info.ledgerName} />
        <InfoItem label="Financial Year" value={info.financialYear} />
        <InfoItem label="Period" value={info.period} />
      </div>
    </section>
  )
}

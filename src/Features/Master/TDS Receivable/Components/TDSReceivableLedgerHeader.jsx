// TDS Receivable Ledger Header — Premium Green & White Design
const TDSReceivableLedgerHeader = () => {
  return (
    <div className="bg-gradient-to-br from-green-800 via-green-700 to-emerald-800 text-white overflow-hidden">

      {/* ── TOP BAND: Ledger Identity ── */}
      <div className="px-6 pt-5 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Left: Icon + Title */}
        <div className="flex items-center gap-3">
          {/* Ledger Icon */}
          <div className="bg-white bg-opacity-15 rounded-xl p-2.5 flex-shrink-0 shadow-inner">
            <svg className="w-7 h-7 text-green-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M9 17v-2m3 2v-4m3 4v-6M5 20h14a2 2 0 002-2V8l-5-5H5a2 2 0 00-2 2v13a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold tracking-tight text-white leading-none">
                TDS RECEIVABLE
              </h1>
              <span className="bg-green-950 bg-opacity-80 border border-green-300 border-opacity-50 text-emerald-200 text-xs font-bold px-2.5 py-0.5 rounded-full tracking-wide">
                A3006001
              </span>
            </div>
            <p className="text-green-200 text-xs mt-1 font-medium tracking-wide">
              General Ledger &nbsp;·&nbsp; Current Asset &nbsp;·&nbsp; FY 2025–26
            </p>
          </div>
        </div>

        {/* Right: Status Pills */}

      </div>

      {/* ── DIVIDER ── */}
      <div className="mx-6 border-t border-white border-opacity-15" />

      {/* ── INFO GRID ── */}
      <div className="px-6 py-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        <InfoCell label="GL Code" value="A3006001" bold />
        <InfoCell label="Ledger Name" value="TDS RECEIVABLE" bold />
        <InfoCell label="Parent Account" value="A3006" />
        <InfoCell label="Account Type" value="ACCOUNT" />
        <InfoCell label="Category" value="Current Asset" />
        <InfoCell label="Nature" value="Debit Balance" />
        <InfoCell label="Sections" value="194C / 194J / 194I" />
        <InfoCell label="Balance Method" value="Running Balance" />
      </div>

      {/* ── BOTTOM ACCENT STRIP ── */}
      <div className="h-1 bg-gradient-to-r from-emerald-400 via-green-300 to-emerald-500 opacity-60" />
    </div>
  )
}

const InfoCell = ({ label, value, bold }) => (
  <div className="flex flex-col">
    <span className="text-green-300 text-[10px] font-semibold uppercase tracking-widest mb-0.5">
      {label}
    </span>
    <span className={`text-white text-xs leading-tight ${bold ? 'font-bold' : 'font-medium'}`}>
      {value}
    </span>
  </div>
)

export default TDSReceivableLedgerHeader

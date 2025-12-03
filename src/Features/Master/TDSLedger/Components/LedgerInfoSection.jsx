export default function LedgerInfoSection({ info }) {
  return (
    <div className="bg-gray-100 border-b border-gray-300 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 p-4">
      {info.map((item, index) => (
        <div key={index} className="flex flex-col">
          <span className="text-gray-500 text-xs font-semibold">{item.label}</span>
          <span className="text-blue-900 text-sm font-bold">{item.value}</span>
        </div>
      ))}
    </div>
  )
}

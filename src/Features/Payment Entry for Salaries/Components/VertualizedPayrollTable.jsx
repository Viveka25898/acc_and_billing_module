import { TableVirtuoso } from 'react-virtuoso'
import { useMemo } from 'react'

export default function VirtualizedPayrollTable({ data, loading = false }) {
  if (!data || data.length === 0) return <p>No data available</p>

  const columns = useMemo(() => Object.keys(data[0] || {}), [data])

  // Skeleton cell component
  const Skeleton = ({ width = '80%' }) => (
    <div
      style={{
        height: 12,
        width,
        background: 'linear-gradient(90deg,#ececec,#f5f5f5,#ececec)',
        borderRadius: 6,
        opacity: 0.9,
      }}
    />
  )

  // number of skeleton rows to show while loading
  const skeletonRows = 8

  return (
    <div style={{ height: '450px', position: 'relative' }}>
      {/* Full-area loader overlay controlled by parent via 'loading' prop */}
      {loading && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(255,255,255,0.85)',
            zIndex: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <div style={{ textAlign: 'center', pointerEvents: 'none' }}>
            <div
              role="status"
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                border: '4px solid rgba(0,0,0,0.08)',
                borderTopColor: '#3b82f6',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 10px',
              }}
            />
            <div style={{ color: '#374151', fontWeight: 600 }}>Loading table…</div>
          </div>
        </div>
      )}

      <style>
        {`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}
      </style>

      <TableVirtuoso
        style={{
          opacity: loading ? 0.5 : 1,
          pointerEvents: loading ? 'none' : 'auto',
        }}
        data={loading ? new Array(skeletonRows).fill({}) : data}
        fixedHeaderContent={() => (
          <tr>
            {columns.map((col, idx) => (
              <th
                key={idx}
                style={{
                  whiteSpace: 'nowrap',
                  background: '#f3f4f6',
                  textAlign: 'left',
                  padding: '8px 12px',
                  fontSize: 12,
                }}
              >
                {col}
              </th>
            ))}
          </tr>
        )}
        itemContent={(index, row) => {
          if (loading) {
            return (
              <>
                {columns.map((col, i) => (
                  <td
                    key={i}
                    style={{
                      whiteSpace: 'nowrap',
                      padding: '8px 12px',
                      height: 36,
                      verticalAlign: 'middle',
                    }}
                  >
                    <Skeleton width={i % 5 === 0 ? '60%' : '40%'} />
                  </td>
                ))}
              </>
            )
          }

          return (
            <>
              {columns.map((key, i) => (
                <td
                  key={i}
                  style={{
                    whiteSpace: 'nowrap',
                    padding: '8px 12px',
                    verticalAlign: 'top',
                    maxWidth: 220,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {typeof row[key] === 'number' ? row[key].toLocaleString('en-IN') : row[key] ?? ''}
                </td>
              ))}
            </>
          )
        }}
      />
    </div>
  )
}
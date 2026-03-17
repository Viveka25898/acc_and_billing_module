import * as XLSX from 'xlsx'

const toSheetRows = (rows = []) => {
  if (!rows.length) return [{ message: 'No records found' }]

  return rows.map((row) => ({
    Status: row.status || '',
    Month: row.month || '',
    Deductor: row.deductorName || '',
    TAN: row.tan || '',
    Section: row.section || '',
    Quarter: row.quarter || '',
    'Books Amount': row.booksAmount ?? '',
    '26AS Amount': row.form26ASAmount ?? '',
    Difference: row.difference ?? '',
    'Books Date': row.booksDate || '',
    '26AS Date': row.form26ASDate || '',
    Reason: row.reason || '',
    Source: row.source || '',
  }))
}

const addMetaSheet = (workbook, meta) => {
  const sheet = XLSX.utils.json_to_sheet([
    { Field: 'Financial Year', Value: meta.financialYear || '' },
    { Field: 'Range Start', Value: meta.rangeStart || '' },
    { Field: 'Range End', Value: meta.rangeEnd || '' },
    { Field: 'Generated At', Value: meta.generatedAt || '' },
  ])
  XLSX.utils.book_append_sheet(workbook, sheet, 'Meta')
}

const fileSafe = (name) => name.replace(/\s+/g, '_')

export const exportSingleStatusExcel = ({ status, rows, meta }) => {
  const workbook = XLSX.utils.book_new()
  const dataSheet = XLSX.utils.json_to_sheet(toSheetRows(rows))

  XLSX.utils.book_append_sheet(workbook, dataSheet, status)
  addMetaSheet(workbook, meta)

  XLSX.writeFile(workbook, `${fileSafe(status)}_${meta.financialYear || 'FY'}.xlsx`)
}

export const exportFullReconciliationExcel = ({ grouped, summary, meta }) => {
  const workbook = XLSX.utils.book_new()

  const summarySheet = XLSX.utils.json_to_sheet([
    { Metric: 'Books Total', Value: summary.booksTotal },
    { Metric: '26AS Total', Value: summary.form26ASTotal },
    { Metric: 'Difference', Value: summary.difference },
    { Metric: 'Matched Count', Value: summary.matchedCount },
    { Metric: 'Partially Matched Count', Value: summary.partialCount },
    { Metric: 'Unmatched Count', Value: summary.unmatchedCount },
    { Metric: 'Pending Count', Value: summary.pendingCount },
  ])

  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary')
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(toSheetRows(grouped.MATCHED)), 'Matched')
  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.json_to_sheet(toSheetRows(grouped.PARTIALLY_MATCHED)),
    'PartiallyMatched'
  )
  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.json_to_sheet(toSheetRows(grouped.UNMATCHED)),
    'Unmatched'
  )
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(toSheetRows(grouped.PENDING)), 'Pending')
  addMetaSheet(workbook, meta)

  XLSX.writeFile(workbook, `TDS26AS_Reconciliation_${meta.financialYear || 'FY'}.xlsx`)
}

import { sample26ASRows, sampleBookRows } from './tds26asDummyData'

export const RECO_STATUS = {
  MATCHED: 'MATCHED',
  PARTIAL: 'PARTIALLY_MATCHED',
  UNMATCHED: 'UNMATCHED',
  PENDING: 'PENDING',
}

const toNumber = (value) => {
  if (value === null || value === undefined || value === '') return 0
  const num = Number(String(value).replace(/,/g, '').trim())
  return Number.isFinite(num) ? num : 0
}

const safeText = (value) => String(value || '').trim()

const normalizeTan = (tan) => safeText(tan).toUpperCase()

const parseDate = (input) => {
  if (!input) return null
  const date = new Date(input)
  return Number.isNaN(date.getTime()) ? null : date
}

const formatMonthKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

const getQuarter = (date) => {
  const month = date.getMonth() + 1
  if (month >= 4 && month <= 6) return 'Q1'
  if (month >= 7 && month <= 9) return 'Q2'
  if (month >= 10 && month <= 12) return 'Q3'
  return 'Q4'
}

const normalizeRecord = (record, source) => {
  const transactionDate = parseDate(record.transactionDate || record.date)
  return {
    id: record.id || `${source}-${Math.random().toString(36).slice(2, 10)}`,
    source,
    voucherNo: safeText(record.voucherNo),
    deductorName: safeText(record.deductorName),
    tan: normalizeTan(record.tan),
    section: safeText(record.section).toUpperCase(),
    amountPaid: toNumber(record.amountPaid),
    tdsAmount: toNumber(record.tdsAmount),
    transactionDate: transactionDate ? transactionDate.toISOString().slice(0, 10) : '',
  }
}

const parseCsvLine = (line) => {
  const values = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i]
    const nextChar = line[i + 1]

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"'
        i += 1
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      values.push(current)
      current = ''
    } else {
      current += char
    }
  }

  values.push(current)
  return values.map((value) => value.trim())
}

const parseCsv = (content) => {
  const lines = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  if (!lines.length) return []

  const headers = parseCsvLine(lines[0]).map((h) => h.toLowerCase())

  return lines.slice(1).map((line, idx) => {
    const values = parseCsvLine(line)
    const row = {}

    headers.forEach((header, i) => {
      row[header] = values[i] || ''
    })

    return {
      id: row.id || `26AS-UPLOAD-${idx + 1}`,
      deductorName: row.deductorname || row.deductor_name || row.deductor || '',
      tan: row.tan || '',
      section: row.section || '',
      amountPaid: row.amountpaid || row.amount_paid || 0,
      tdsAmount: row.tdsamount || row.tds_amount || 0,
      transactionDate: row.transactiondate || row.transaction_date || row.date || '',
    }
  })
}

export const TDS26ASDataGateway = {
  // Future API integration: replace this with API call; UI remains unchanged.
  async fetchBookEntries() {
    return sampleBookRows.map((row) => normalizeRecord(row, 'BOOK'))
  },

  async fetchSample26ASRows() {
    return sample26ASRows.map((row) => normalizeRecord(row, '26AS'))
  },

  async parseUploadFile(file) {
    if (!file) throw new Error('No file selected')

    const content = await file.text()
    const lowerName = file.name.toLowerCase()
    let records = []

    if (lowerName.endsWith('.json')) {
      const parsed = JSON.parse(content)
      if (!Array.isArray(parsed)) throw new Error('JSON must contain an array of rows')
      records = parsed
    } else if (lowerName.endsWith('.csv')) {
      records = parseCsv(content)
    } else {
      throw new Error('Unsupported file format. Please upload CSV or JSON.')
    }

    return records.map((row) => normalizeRecord(row, '26AS')).filter((row) => row.tan && row.transactionDate)
  },
}

const isWithinRange = (dateStr, startDate, endDate) => {
  const date = parseDate(dateStr)
  if (!date) return false
  return date >= startDate && date <= endDate
}

const getFinancialYearBoundsFromDate = (referenceDate) => {
  const month = referenceDate.getMonth() + 1
  const startYear = month >= 4 ? referenceDate.getFullYear() : referenceDate.getFullYear() - 1
  const fyStart = new Date(startYear, 3, 1)
  const fyEnd = new Date(startYear + 1, 2, 31)
  return { fyStart, fyEnd, label: `${startYear}-${String(startYear + 1).slice(-2)}` }
}

const buildPendingMonthRows = (endDate, fyEndDate) => {
  const pending = []
  const cursor = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 1)

  while (cursor <= fyEndDate) {
    pending.push({
      id: `PENDING-MONTH-${formatMonthKey(cursor)}`,
      month: cursor.toLocaleString('en-IN', { month: 'long', year: 'numeric' }),
      status: RECO_STATUS.PENDING,
      reason: 'Month is after selected reconciliation end date',
      source: 'SYSTEM',
    })
    cursor.setMonth(cursor.getMonth() + 1)
  }

  return pending
}

export const reconcile26ASData = ({ bookEntries, form26ASRows, startDate, endDate }) => {
  if (!startDate || !endDate) {
    throw new Error('Start date and end date are required')
  }

  const parsedStart = parseDate(startDate)
  const parsedEnd = parseDate(endDate)

  if (!parsedStart || !parsedEnd || parsedStart > parsedEnd) {
    throw new Error('Invalid date range selected')
  }

  const { fyStart, fyEnd, label } = getFinancialYearBoundsFromDate(parsedEnd)

  const normalizedBooks = (bookEntries || []).map((row) => normalizeRecord(row, 'BOOK'))
  const normalized26AS = (form26ASRows || []).map((row) => normalizeRecord(row, '26AS'))

  const inRangeBooks = normalizedBooks.filter((r) => isWithinRange(r.transactionDate, parsedStart, parsedEnd))
  const inRange26AS = normalized26AS.filter((r) => isWithinRange(r.transactionDate, parsedStart, parsedEnd))

  const pendingBookRows = normalizedBooks.filter((r) => {
    const date = parseDate(r.transactionDate)
    return date && date > parsedEnd && date >= fyStart && date <= fyEnd
  })

  const pending26ASRows = normalized26AS.filter((r) => {
    const date = parseDate(r.transactionDate)
    return date && date > parsedEnd && date >= fyStart && date <= fyEnd
  })

  const matchedBookIds = new Set()
  const matched26ASIds = new Set()

  const matched = []
  const partial = []
  const unmatched = []

  inRange26AS.forEach((row26AS) => {
    const row26ASDate = parseDate(row26AS.transactionDate)
    const quarter = row26ASDate ? getQuarter(row26ASDate) : ''

    const exact = inRangeBooks.find((book) => {
      if (matchedBookIds.has(book.id)) return false
      const bookDate = parseDate(book.transactionDate)
      return (
        book.tan === row26AS.tan &&
        book.section === row26AS.section &&
        getQuarter(bookDate) === quarter &&
        book.tdsAmount === row26AS.tdsAmount
      )
    })

    if (exact) {
      matched.push({
        status: RECO_STATUS.MATCHED,
        tan: row26AS.tan,
        section: row26AS.section,
        deductorName: row26AS.deductorName || exact.deductorName,
        quarter,
        booksAmount: exact.tdsAmount,
        form26ASAmount: row26AS.tdsAmount,
        difference: 0,
        booksDate: exact.transactionDate,
        form26ASDate: row26AS.transactionDate,
        reason: 'Exact match by TAN + Section + Quarter + Amount',
      })
      matchedBookIds.add(exact.id)
      matched26ASIds.add(row26AS.id)
      return
    }

    const near = inRangeBooks.find((book) => {
      if (matchedBookIds.has(book.id)) return false
      const bookDate = parseDate(book.transactionDate)
      return book.tan === row26AS.tan && getQuarter(bookDate) === quarter
    })

    if (near) {
      const reasons = []
      if (near.section !== row26AS.section) reasons.push('Section mismatch')
      if (near.tdsAmount !== row26AS.tdsAmount) reasons.push('Amount mismatch')
      if (!reasons.length) reasons.push('Near match')

      partial.push({
        status: RECO_STATUS.PARTIAL,
        tan: row26AS.tan,
        section: `${near.section} / ${row26AS.section}`,
        deductorName: row26AS.deductorName || near.deductorName,
        quarter,
        booksAmount: near.tdsAmount,
        form26ASAmount: row26AS.tdsAmount,
        difference: near.tdsAmount - row26AS.tdsAmount,
        booksDate: near.transactionDate,
        form26ASDate: row26AS.transactionDate,
        reason: reasons.join(', '),
      })
      matchedBookIds.add(near.id)
      matched26ASIds.add(row26AS.id)
      return
    }

    unmatched.push({
      status: RECO_STATUS.UNMATCHED,
      tan: row26AS.tan,
      section: row26AS.section,
      deductorName: row26AS.deductorName,
      quarter,
      booksAmount: 0,
      form26ASAmount: row26AS.tdsAmount,
      difference: -row26AS.tdsAmount,
      booksDate: '',
      form26ASDate: row26AS.transactionDate,
      reason: 'Present in 26AS, missing in books',
      unmatchedType: 'MISSING_IN_BOOKS',
    })
  })

  inRangeBooks.forEach((book) => {
    if (matchedBookIds.has(book.id)) return

    const bookDate = parseDate(book.transactionDate)
    unmatched.push({
      status: RECO_STATUS.UNMATCHED,
      tan: book.tan,
      section: book.section,
      deductorName: book.deductorName,
      quarter: bookDate ? getQuarter(bookDate) : '',
      booksAmount: book.tdsAmount,
      form26ASAmount: 0,
      difference: book.tdsAmount,
      booksDate: book.transactionDate,
      form26ASDate: '',
      reason: 'Present in books, missing in 26AS',
      unmatchedType: 'MISSING_IN_26AS',
    })
  })

  const pending = [
    ...pendingBookRows.map((row) => ({
      status: RECO_STATUS.PENDING,
      month: new Date(row.transactionDate).toLocaleString('en-IN', { month: 'long', year: 'numeric' }),
      tan: row.tan,
      section: row.section,
      deductorName: row.deductorName,
      booksAmount: row.tdsAmount,
      form26ASAmount: 0,
      difference: row.tdsAmount,
      booksDate: row.transactionDate,
      form26ASDate: '',
      reason: 'Future FY month after selected end date (Books)',
      source: 'BOOK',
    })),
    ...pending26ASRows.map((row) => ({
      status: RECO_STATUS.PENDING,
      month: new Date(row.transactionDate).toLocaleString('en-IN', { month: 'long', year: 'numeric' }),
      tan: row.tan,
      section: row.section,
      deductorName: row.deductorName,
      booksAmount: 0,
      form26ASAmount: row.tdsAmount,
      difference: -row.tdsAmount,
      booksDate: '',
      form26ASDate: row.transactionDate,
      reason: 'Future FY month after selected end date (26AS)',
      source: '26AS',
    })),
    ...buildPendingMonthRows(parsedEnd, fyEnd),
  ]

  const summary = {
    booksTotal: inRangeBooks.reduce((sum, row) => sum + row.tdsAmount, 0),
    form26ASTotal: inRange26AS.reduce((sum, row) => sum + row.tdsAmount, 0),
    difference: 0,
    matchedCount: matched.length,
    partialCount: partial.length,
    unmatchedCount: unmatched.length,
    pendingCount: pending.length,
    financialYear: label,
  }

  summary.difference = summary.booksTotal - summary.form26ASTotal

  return {
    summary,
    grouped: {
      [RECO_STATUS.MATCHED]: matched,
      [RECO_STATUS.PARTIAL]: partial,
      [RECO_STATUS.UNMATCHED]: unmatched,
      [RECO_STATUS.PENDING]: pending,
    },
    meta: {
      rangeStart: startDate,
      rangeEnd: endDate,
      generatedAt: new Date().toISOString(),
      financialYear: label,
    },
  }
}

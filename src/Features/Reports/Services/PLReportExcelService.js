/* eslint-disable no-unused-vars */
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import { getPLData, PL_KEYS } from './PLReportDataService'

/**
 * P&L Report Excel Generation Service
 * Generates Excel file with two sheets: PL and P&L Sch
 * Uses real ledger data from transactions (monthly, All/State/Client filters).
 */

/**
 * Safe numeric value for Excel: number or '-' for non-numeric.
 * @param {*} v
 * @returns {number|string}
 */
function excelNum(v) {
  if (v == null || v === '') return '-'
  const n = typeof v === 'number' ? v : parseFloat(String(v).replace(/[₹,\s]/g, ''))
  return Number.isFinite(n) ? n : '-'
}

class PLReportExcelService {
  /**
   * Generate and download P&L Excel report
   * @param {Object} periodData - { periodType, month, year, monthName, client?, state?, clientName?, stateName? }
   */
  static async generateAndDownloadPLReport(periodData) {
    try {
      if (!periodData || typeof periodData !== 'object') {
        throw new Error('Invalid period data. Please select a period again.')
      }
      // Accept monthly, quarterly, yearly
      let valid = false
      if (periodData.periodType === 'monthly') {
        const month = parseInt(periodData.month, 10)
        const year = parseInt(periodData.year, 10)
        valid = month && month >= 1 && month <= 12 && year && year >= 2000
      } else if (periodData.periodType === 'quarterly') {
        let quarter = periodData.quarter
        if (typeof quarter === 'string' && quarter.startsWith('Q')) {
          quarter = parseInt(quarter.replace('Q', ''), 10)
        } else {
          quarter = parseInt(quarter, 10)
        }
        const year = parseInt(periodData.year, 10)
        valid = quarter && quarter >= 1 && quarter <= 4 && year && year >= 2000
      } else if (periodData.periodType === 'yearly') {
        const year = parseInt(periodData.year, 10)
        valid = year && year >= 2000
      }
      if (!valid) {
        throw new Error('Invalid period selection. Please select a valid period.')
      }

      // getPLData must support all period types
      const plResult = getPLData(periodData)
      if (!plResult.success) {
        throw new Error(plResult.error || 'Failed to load P&L data from ledger.')
      }

      const workbook = new ExcelJS.Workbook()

      try {
        this.createPLSheet(workbook, periodData, plResult)
      } catch (err) {
        console.error('PLReportExcelService: createPLSheet error', err)
        throw new Error('Failed to create P&L sheet. ' + (err.message || ''))
      }

      try {
        this.createPLScheduleSheet(workbook, periodData, plResult)
      } catch (err) {
        console.error('PLReportExcelService: createPLScheduleSheet error', err)
        throw new Error('Failed to create P&L Schedule sheet. ' + (err.message || ''))
      }

      let buffer
      try {
        buffer = await workbook.xlsx.writeBuffer()
      } catch (err) {
        console.error('PLReportExcelService: writeBuffer error', err)
        throw new Error('Failed to generate Excel file.')
      }

      const filename = this.generateFilename(periodData)
      try {
        const blob = new Blob([buffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        })
        saveAs(blob, filename)
      } catch (err) {
        console.error('PLReportExcelService: saveAs error', err)
        throw new Error('Failed to download file.')
      }

      return { success: true, filename, meta: plResult.meta }
    } catch (error) {
      console.error('PLReportExcelService: generateAndDownloadPLReport error', error)
      throw error instanceof Error ? error : new Error('Failed to generate P&L report. Please try again.')
    }
  }

  /**
   * Create PL (Profit & Loss) Sheet
   * @param {object} workbook
   * @param {object} periodData
   * @param {object} plResult - { current, previous, meta } from getPLData
   */
  static createPLSheet(workbook, periodData, plResult) {
    const sheet = workbook.addWorksheet('PL')
    const cur = plResult.current || {}
    const prev = plResult.previous || {}

    // Set column widths
    sheet.getColumn('A').width = 8
    sheet.getColumn('B').width = 50
    sheet.getColumn('C').width = 10
    sheet.getColumn('D').width = 18
    sheet.getColumn('E').width = 5
    sheet.getColumn('F').width = 18

    const getPeriodLabel = () => {
      if (periodData.periodType === 'monthly') {
        return `${periodData.monthName} ${periodData.year}`
      } else if (periodData.periodType === 'quarterly') {
        return `${periodData.quarterLabel} ${periodData.year}`
      } else {
        return `FY ${periodData.year} - ${periodData.year + 1}`
      }
    }

    const currentPeriod = getPeriodLabel()
    const previousYear = parseInt(periodData.year, 10) - 1
    const previousPeriod =
      periodData.periodType === 'monthly'
        ? `${periodData.monthName} ${previousYear}`
        : periodData.periodType === 'quarterly'
          ? `${periodData.quarterLabel} ${previousYear}`
          : `FY ${previousYear} - ${periodData.year}`

    // Row 1: Company Name
    sheet.mergeCells('B1:F1')
    const companyNameCell = sheet.getCell('B1')
    companyNameCell.value = 'I SMART FACITECH PRIVATE LIMITED'
    companyNameCell.font = { bold: true, size: 14 }
    companyNameCell.alignment = { horizontal: 'center', vertical: 'middle' }

    // Row 2: Previous Names
    sheet.mergeCells('B2:F2')
    const prevNamesCell = sheet.getCell('B2')
    prevNamesCell.value =
      '(Formerly known as "Comfort Facility Management Services Private Limited")'
    prevNamesCell.font = { size: 10, italic: true }
    prevNamesCell.alignment = { horizontal: 'center', vertical: 'middle' }

    // Row 3: Previous Names 2
    sheet.mergeCells('B3:F3')
    const prevNames2Cell = sheet.getCell('B3')
    prevNames2Cell.value = '(and before that "Comfort Facility Management Services LLP")'
    prevNames2Cell.font = { size: 10, italic: true }
    prevNames2Cell.alignment = { horizontal: 'center', vertical: 'middle' }

    // Row 4: Report Title
    sheet.mergeCells('B4:F4')
    const titleCell = sheet.getCell('B4')
    titleCell.value = `Profit & Loss Account for the period ended on ${currentPeriod}`
    titleCell.font = { bold: true, size: 12 }
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' }

    // Row 6: Empty row

    // Row 7: Headers
    sheet.getCell('A7').value = 'Sr No'
    sheet.getCell('B7').value = 'Particulars'
    sheet.getCell('C7').value = 'Note No'
    sheet.mergeCells('D7:E7')
    sheet.getCell('D7').value = currentPeriod
    sheet.getCell('F7').value = previousPeriod

    // Style headers
    const headerRow = sheet.getRow(7)
    headerRow.font = { bold: true, size: 11 }
    headerRow.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }
    headerRow.height = 25
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE8F5E9' },
    }
    headerRow.border = {
      top: { style: 'medium' },
      bottom: { style: 'medium' },
      left: { style: 'thin' },
      right: { style: 'thin' },
    }

    // I. Revenue from operations
    let rowNum = 8
    const revOpsCur = excelNum(cur[PL_KEYS.REVENUE_FROM_OPS])
    const revOpsPrev = excelNum(prev[PL_KEYS.REVENUE_FROM_OPS])
    sheet.getCell(`A${rowNum}`).value = 'I'
    sheet.getCell(`B${rowNum}`).value = 'Revenue from operations'
    sheet.getCell(`C${rowNum}`).value = 15
    sheet.getCell(`D${rowNum}`).value = revOpsCur
    sheet.getCell(`E${rowNum}`).value = ''
    sheet.getCell(`F${rowNum}`).value = revOpsPrev
    sheet.getRow(rowNum).font = { bold: true }
    sheet.getCell(`A${rowNum}`).alignment = { horizontal: 'center', vertical: 'middle' }

    rowNum++
    const otherIncCur = excelNum(cur[PL_KEYS.OTHER_INCOME])
    const otherIncPrev = excelNum(prev[PL_KEYS.OTHER_INCOME])
    sheet.getCell(`B${rowNum}`).value = 'Other Income'
    sheet.getCell(`C${rowNum}`).value = 16
    sheet.getCell(`D${rowNum}`).value = otherIncCur
    sheet.getCell(`E${rowNum}`).value = ''
    sheet.getCell(`F${rowNum}`).value = otherIncPrev

    // III. Total Revenue
    rowNum++
    const totalRevenue = typeof revOpsCur === 'number' && typeof otherIncCur === 'number'
      ? revOpsCur + otherIncCur
      : (cur[PL_KEYS.TOTAL_REVENUE] ?? 0)
    const prevTotalRevenue = typeof revOpsPrev === 'number' && typeof otherIncPrev === 'number'
      ? revOpsPrev + otherIncPrev
      : (prev[PL_KEYS.TOTAL_REVENUE] ?? 0)
    sheet.getCell(`A${rowNum}`).value = 'III'
    sheet.getCell(`B${rowNum}`).value = 'Total Revenue'
    sheet.getCell(`D${rowNum}`).value = totalRevenue
    sheet.getCell(`F${rowNum}`).value = prevTotalRevenue
    const totalRevenueRow = sheet.getRow(rowNum)
    totalRevenueRow.font = { bold: true }
    totalRevenueRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFF0F0F0' },
    }
    totalRevenueRow.border = {
      top: { style: 'thin' },
      bottom: { style: 'thin' },
    }
    sheet.getCell(`A${rowNum}`).alignment = { horizontal: 'center', vertical: 'middle' }
    sheet.getCell(`D${rowNum}`).numFmt = '#,##0'
    sheet.getCell(`F${rowNum}`).numFmt = '#,##0'

    // IV. Expenses
    rowNum += 2
    sheet.getCell(`A${rowNum}`).value = 'IV'
    sheet.getCell(`B${rowNum}`).value = 'Expenses'
    sheet.getRow(rowNum).font = { bold: true }
    sheet.getCell(`A${rowNum}`).alignment = { horizontal: 'center', vertical: 'middle' }

    rowNum++
    const costMatCur = excelNum(cur[PL_KEYS.COST_OF_MATERIALS])
    const costMatPrev = excelNum(prev[PL_KEYS.COST_OF_MATERIALS])
    sheet.getCell(`B${rowNum}`).value = 'Cost of Materials Consumed'
    sheet.getCell(`C${rowNum}`).value = 17
    sheet.getCell(`D${rowNum}`).value = costMatCur
    sheet.getCell(`F${rowNum}`).value = costMatPrev
    sheet.getCell(`D${rowNum}`).numFmt = '#,##0'
    sheet.getCell(`F${rowNum}`).numFmt = '#,##0'

    rowNum++
    sheet.getCell(`B${rowNum}`).value = 'Changes in Inventories'
    sheet.getCell(`D${rowNum}`).value = '-'
    sheet.getCell(`F${rowNum}`).value = '-'

    rowNum++
    const empBenCur = excelNum(cur[PL_KEYS.EMPLOYEE_BENEFITS])
    const empBenPrev = excelNum(prev[PL_KEYS.EMPLOYEE_BENEFITS])
    sheet.getCell(`B${rowNum}`).value = 'Employee benefit expenses'
    sheet.getCell(`C${rowNum}`).value = 18
    sheet.getCell(`D${rowNum}`).value = empBenCur
    sheet.getCell(`F${rowNum}`).value = empBenPrev
    sheet.getCell(`D${rowNum}`).numFmt = '#,##0'
    sheet.getCell(`F${rowNum}`).numFmt = '#,##0'

    rowNum++
    const finCostCur = excelNum(cur[PL_KEYS.FINANCE_COSTS])
    const finCostPrev = excelNum(prev[PL_KEYS.FINANCE_COSTS])
    sheet.getCell(`B${rowNum}`).value = 'Finance Costs'
    sheet.getCell(`C${rowNum}`).value = 19
    sheet.getCell(`D${rowNum}`).value = finCostCur
    sheet.getCell(`F${rowNum}`).value = finCostPrev
    sheet.getCell(`D${rowNum}`).numFmt = '#,##0'
    sheet.getCell(`F${rowNum}`).numFmt = '#,##0'

    rowNum++
    const depCur = excelNum(cur[PL_KEYS.DEPRECIATION_AMORT])
    const depPrev = excelNum(prev[PL_KEYS.DEPRECIATION_AMORT])
    sheet.getCell(`B${rowNum}`).value = 'Depreciation and Amortization Expense'
    sheet.getCell(`C${rowNum}`).value = 9
    sheet.getCell(`D${rowNum}`).value = depCur
    sheet.getCell(`F${rowNum}`).value = depPrev
    sheet.getCell(`D${rowNum}`).numFmt = '#,##0'
    sheet.getCell(`F${rowNum}`).numFmt = '#,##0'

    rowNum++
    const otherExpCur = excelNum(cur[PL_KEYS.OTHER_EXPENSES])
    const otherExpPrev = excelNum(prev[PL_KEYS.OTHER_EXPENSES])
    sheet.getCell(`B${rowNum}`).value = 'Other expenses'
    sheet.getCell(`C${rowNum}`).value = 20
    sheet.getCell(`D${rowNum}`).value = otherExpCur
    sheet.getCell(`F${rowNum}`).value = otherExpPrev
    sheet.getCell(`D${rowNum}`).numFmt = '#,##0'
    sheet.getCell(`F${rowNum}`).numFmt = '#,##0'

    // V. Total Expenses
    rowNum++
    const totalExpenses = typeof cur[PL_KEYS.TOTAL_EXPENSES] === 'number' ? cur[PL_KEYS.TOTAL_EXPENSES] : 0
    const prevTotalExpenses = typeof prev[PL_KEYS.TOTAL_EXPENSES] === 'number' ? prev[PL_KEYS.TOTAL_EXPENSES] : 0
    sheet.getCell(`A${rowNum}`).value = 'V'
    sheet.getCell(`B${rowNum}`).value = 'Total Expenses'
    sheet.getCell(`D${rowNum}`).value = totalExpenses
    sheet.getCell(`F${rowNum}`).value = prevTotalExpenses
    const totalExpensesRow = sheet.getRow(rowNum)
    totalExpensesRow.font = { bold: true }
    totalExpensesRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFF0F0F0' },
    }
    totalExpensesRow.border = {
      top: { style: 'thin' },
      bottom: { style: 'thin' },
    }
    sheet.getCell(`A${rowNum}`).alignment = { horizontal: 'center', vertical: 'middle' }
    sheet.getCell(`D${rowNum}`).numFmt = '#,##0'
    sheet.getCell(`F${rowNum}`).numFmt = '#,##0'

    // VI. Profit before tax
    rowNum += 2
    const profitBeforeTax = typeof cur[PL_KEYS.PROFIT_BEFORE_TAX] === 'number'
      ? cur[PL_KEYS.PROFIT_BEFORE_TAX]
      : totalRevenue - totalExpenses
    const prevProfitBeforeTax = typeof prev[PL_KEYS.PROFIT_BEFORE_TAX] === 'number'
      ? prev[PL_KEYS.PROFIT_BEFORE_TAX]
      : prevTotalRevenue - prevTotalExpenses
    sheet.getCell(`A${rowNum}`).value = 'VI'
    sheet.getCell(`B${rowNum}`).value = 'Profit before tax for the year'
    sheet.getCell(`D${rowNum}`).value = profitBeforeTax
    sheet.getCell(`F${rowNum}`).value = prevProfitBeforeTax
    const profitBeforeTaxRow = sheet.getRow(rowNum)
    profitBeforeTaxRow.font = { bold: true }
    profitBeforeTaxRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE8F5E9' },
    }
    profitBeforeTaxRow.border = {
      top: { style: 'thin' },
      bottom: { style: 'thin' },
    }
    sheet.getCell(`A${rowNum}`).alignment = { horizontal: 'center', vertical: 'middle' }
    sheet.getCell(`D${rowNum}`).numFmt = '#,##0'
    sheet.getCell(`F${rowNum}`).numFmt = '#,##0'

    // VII. Tax expense
    rowNum += 2
    sheet.getCell(`A${rowNum}`).value = 'VII'
    sheet.getCell(`B${rowNum}`).value = 'Tax expense'
    sheet.getRow(rowNum).font = { bold: true }
    sheet.getCell(`A${rowNum}`).alignment = { horizontal: 'center', vertical: 'middle' }

    rowNum++
    const currTaxCur = excelNum(cur[PL_KEYS.CURRENT_TAX])
    const currTaxPrev = excelNum(prev[PL_KEYS.CURRENT_TAX])
    sheet.getCell(`B${rowNum}`).value = 'Current tax'
    sheet.getCell(`D${rowNum}`).value = currTaxCur
    sheet.getCell(`F${rowNum}`).value = currTaxPrev
    sheet.getCell(`D${rowNum}`).numFmt = '#,##0'
    sheet.getCell(`F${rowNum}`).numFmt = '#,##0'

    rowNum++
    const defTaxCur = excelNum(cur[PL_KEYS.DEFERRED_TAX])
    const defTaxPrev = excelNum(prev[PL_KEYS.DEFERRED_TAX])
    sheet.getCell(`B${rowNum}`).value = 'Deferred tax'
    sheet.getCell(`D${rowNum}`).value = defTaxCur
    sheet.getCell(`F${rowNum}`).value = defTaxPrev
    sheet.getCell(`D${rowNum}`).numFmt = '#,##0'
    sheet.getCell(`F${rowNum}`).numFmt = '#,##0'

    rowNum++
    sheet.getCell(`B${rowNum}`).value = 'Earlier Year Tax Adjustment A/c'
    sheet.getCell(`D${rowNum}`).value = '-'
    sheet.getCell(`F${rowNum}`).value = '-'

    rowNum++
    const totalTax = typeof cur[PL_KEYS.TAX_SUBTOTAL] === 'number' ? cur[PL_KEYS.TAX_SUBTOTAL] : 0
    const prevTotalTax = typeof prev[PL_KEYS.TAX_SUBTOTAL] === 'number' ? prev[PL_KEYS.TAX_SUBTOTAL] : 0
    sheet.getCell(`B${rowNum}`).value = 'Subtotal for tax expense'
    sheet.getCell(`D${rowNum}`).value = totalTax
    sheet.getCell(`F${rowNum}`).value = prevTotalTax
    const taxRow = sheet.getRow(rowNum)
    taxRow.border = {
      top: { style: 'thin' },
      bottom: { style: 'thin' },
    }
    sheet.getCell(`D${rowNum}`).numFmt = '#,##0'
    sheet.getCell(`F${rowNum}`).numFmt = '#,##0'

    // VIII. Profit after tax
    rowNum++
    const profitAfterTax = typeof cur[PL_KEYS.PROFIT_AFTER_TAX] === 'number'
      ? cur[PL_KEYS.PROFIT_AFTER_TAX]
      : profitBeforeTax - totalTax
    const prevProfitAfterTax = typeof prev[PL_KEYS.PROFIT_AFTER_TAX] === 'number'
      ? prev[PL_KEYS.PROFIT_AFTER_TAX]
      : prevProfitBeforeTax - prevTotalTax
    sheet.getCell(`A${rowNum}`).value = 'VIII'
    sheet.getCell(`B${rowNum}`).value = 'Profit after tax for the year'
    sheet.getCell(`D${rowNum}`).value = profitAfterTax
    sheet.getCell(`F${rowNum}`).value = prevProfitAfterTax
    const profitAfterTaxRow = sheet.getRow(rowNum)
    profitAfterTaxRow.font = { bold: true, size: 11 }
    profitAfterTaxRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD4E5D4' },
    }
    profitAfterTaxRow.border = {
      top: { style: 'thin' },
      bottom: { style: 'double' },
    }
    sheet.getCell(`A${rowNum}`).alignment = { horizontal: 'center', vertical: 'middle' }
    sheet.getCell(`D${rowNum}`).numFmt = '#,##0'
    sheet.getCell(`F${rowNum}`).numFmt = '#,##0'

    // IX. Earnings per equity share
    rowNum += 2
    sheet.getCell(`A${rowNum}`).value = 'IX'
    sheet.getCell(`B${rowNum}`).value = 'Earning per equity share'
    sheet.getRow(rowNum).font = { bold: true }
    sheet.getCell(`A${rowNum}`).alignment = { horizontal: 'center', vertical: 'middle' }

    rowNum++
    sheet.getCell(`B${rowNum}`).value = 'Basic'
    sheet.getCell(`D${rowNum}`).value = 0
    sheet.getCell(`F${rowNum}`).value = 0
    sheet.getCell(`D${rowNum}`).numFmt = '0.00'
    sheet.getCell(`F${rowNum}`).numFmt = '0.00'

    rowNum++
    const dilutedRowNum = rowNum
    sheet.getCell(`B${rowNum}`).value = 'Diluted'
    sheet.getCell(`D${rowNum}`).value = 0
    sheet.getCell(`F${rowNum}`).value = 0
    sheet.getCell(`D${rowNum}`).numFmt = '0.00'
    sheet.getCell(`F${rowNum}`).numFmt = '0.00'

    // Right align numeric columns and center Sr No column
    for (let i = 8; i <= dilutedRowNum; i++) {
      // Center align Sr No column
      const aCell = sheet.getCell(`A${i}`)
      if (aCell.value) {
        aCell.alignment = { horizontal: 'center', vertical: 'middle' }
      }

      // Right align numeric columns
      const dCell = sheet.getCell(`D${i}`)
      const fCell = sheet.getCell(`F${i}`)
      if (dCell.value && typeof dCell.value === 'number') {
        dCell.alignment = { horizontal: 'right', vertical: 'middle' }
      }
      if (fCell.value && typeof fCell.value === 'number') {
        fCell.alignment = { horizontal: 'right', vertical: 'middle' }
      }
    }

    // Add table borders for PL sheet (from header row 7 to Diluted row)
    const tableStartRow = 7
    const tableEndRow = dilutedRowNum

    // Apply borders to all cells in the table (columns A to F, rows 7 to dilutedRow)
    for (let row = tableStartRow; row <= tableEndRow; row++) {
      // Apply borders to each cell in columns A, B, C, D, E, F
      const columns = ['A', 'B', 'C', 'D', 'E', 'F']
      columns.forEach((col) => {
        const cell = sheet.getCell(`${col}${row}`)

        // Get existing border if any (preserve special borders like double, medium)
        const existingBorder = cell.border || {}

        // Preserve existing top/bottom styles, but add left/right borders
        const topStyle = existingBorder.top?.style || 'thin'
        const bottomStyle = existingBorder.bottom?.style || 'thin'

        // Set all borders, preserving special styles
        cell.border = {
          top: { style: topStyle },
          bottom: { style: bottomStyle },
          left: { style: 'thin' },
          right: { style: 'thin' },
        }
      })
    }

    // Add Excel grouping/outlining for better navigation
    // Group Revenue section (rows 8-10)
    sheet.getRow(8).outlineLevel = 1
    sheet.getRow(9).outlineLevel = 1
    sheet.getRow(10).outlineLevel = 0 // Total Revenue - summary level

    // Group Expenses section (rows 12-22)
    for (let i = 12; i <= 22; i++) {
      if (i === 22) {
        sheet.getRow(i).outlineLevel = 0 // Total Expenses - summary level
      } else {
        sheet.getRow(i).outlineLevel = 1
      }
    }

    // Group Tax section (rows 24-28)
    for (let i = 24; i <= 28; i++) {
      if (i === 28) {
        sheet.getRow(i).outlineLevel = 0 // Subtotal - summary level
      } else {
        sheet.getRow(i).outlineLevel = 1
      }
    }

    // Freeze header row and first column
    sheet.views = [
      {
        state: 'frozen',
        ySplit: 7, // Freeze rows 1-7
        xSplit: 1, // Freeze column A
        topLeftCell: 'B8',
        activeCell: 'B8',
      },
    ]

    // Set print area and page setup
    sheet.pageSetup = {
      printArea: `A1:F${dilutedRowNum}`,
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
      orientation: 'landscape',
      margins: {
        left: 0.5,
        right: 0.5,
        top: 0.75,
        bottom: 0.75,
        header: 0.3,
        footer: 0.3,
      },
    }

    // Add header and footer for printing
    sheet.headerFooter = {
      oddHeader: `&C&B&14${currentPeriod} - Profit & Loss Account`,
      oddFooter: '&C&P of &N',
    }
  }

  /**
   * Create P&L Schedule Sheet (Dynamic based on data)
   * @param {object} workbook
   * @param {object} periodData
   * @param {object} plResult - { current, previous, schedule, meta } from getPLData
   */
  static createPLScheduleSheet(workbook, periodData, plResult) {
    const sheet = workbook.addWorksheet('P&L Sch')
    const cur = plResult.current || {}
    const prev = plResult.previous || {}
    const schedCur = (plResult.schedule && plResult.schedule.current && plResult.schedule.current.schedule) || {}
    const schedPrev = (plResult.schedule && plResult.schedule.previous && plResult.schedule.previous.schedule) || {}

    // Column Widths
    sheet.getColumn('A').width = 8
    sheet.getColumn('B').width = 50
    sheet.getColumn('C').width = 18
    sheet.getColumn('D').width = 18

    // Helper to get formatted period label
    const getPeriodLabel = () => {
      if (periodData.periodType === 'monthly') {
        return `${periodData.monthName} ${periodData.year}`
      } else if (periodData.periodType === 'quarterly') {
        return `${periodData.quarterLabel} ${periodData.year}`
      } else {
        return `FY ${periodData.year} - ${periodData.year + 1}`
      }
    }

    const currentPeriod = getPeriodLabel()
    const previousYear = parseInt(periodData.year, 10) - 1
    const previousPeriod =
      periodData.periodType === 'monthly'
        ? `${periodData.monthName} ${previousYear}`
        : periodData.periodType === 'quarterly'
          ? `${periodData.quarterLabel} ${previousYear}`
          : `FY ${previousYear} - ${periodData.year}`

    // Row 1: Headers
    sheet.getCell('A1').value = 'Sr No'
    sheet.getCell('B1').value = 'Particulars'
    sheet.getCell('C1').value = currentPeriod
    sheet.getCell('D1').value = previousPeriod

    // Header Style
    const headerRow = sheet.getRow(1)
    headerRow.font = { bold: true, size: 11 }
    headerRow.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }
    headerRow.height = 25
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE8F5E9' },
    }
    headerRow.border = {
      top: { style: 'medium' },
      bottom: { style: 'medium' },
      left: { style: 'thin' },
      right: { style: 'thin' },
    }

    let rowNum = 2

    // Define Sections to Print in Order
    const sections = [
      { key: PL_KEYS.REVENUE_FROM_OPS, label: 'Note 15: Revenue from Operations' },
      { key: PL_KEYS.OTHER_INCOME, label: 'Note 16: Other Income' },
      { key: PL_KEYS.COST_OF_MATERIALS, label: 'Note 17: Cost of Materials Consumed' },
      { key: PL_KEYS.EMPLOYEE_BENEFITS, label: 'Note 18: Employee Benefits Expense' },
      { key: PL_KEYS.FINANCE_COSTS, label: 'Note 19: Finance Costs' },
      { key: PL_KEYS.DEPRECIATION_AMORT, label: 'Note 9: Depreciation and Amortization' },
      { key: PL_KEYS.OTHER_EXPENSES, label: 'Note 20: Other Expenses' },
    ]

    let noteIndex = 1

    sections.forEach(section => {
      const { key, label } = section
      const sectionDataCur = schedCur[key] || {}
      const sectionDataPrev = schedPrev[key] || {}

      // Get all unique ledgers (union of current & previous)
      const allLedgers = new Set([
        ...Object.keys(sectionDataCur),
        ...Object.keys(sectionDataPrev)
      ])
      const sortedLedgers = Array.from(allLedgers).sort()

      // Section Header
      sheet.getCell(`A${rowNum}`).value = noteIndex++
      sheet.getCell(`B${rowNum}`).value = label
      sheet.getRow(rowNum).font = { bold: true, underline: true, size: 11 }
      sheet.getRow(rowNum).height = 20
      sheet.getCell(`A${rowNum}`).alignment = { horizontal: 'center', vertical: 'middle' }
      rowNum++

      if (sortedLedgers.length === 0) {
        // Empty state
        sheet.getCell(`B${rowNum}`).value = '(No entries)'
        sheet.getCell(`C${rowNum}`).value = '-'
        sheet.getCell(`D${rowNum}`).value = '-'
        sheet.getCell(`C${rowNum}`).alignment = { horizontal: 'right' }
        sheet.getCell(`D${rowNum}`).alignment = { horizontal: 'right' }
        rowNum++
      } else {
        // Rows for each ledger
        sortedLedgers.forEach(ledgerName => {
          sheet.getCell(`B${rowNum}`).value = ledgerName
          const valCur = sectionDataCur[ledgerName] || 0
          const valPrev = sectionDataPrev[ledgerName] || 0

          sheet.getCell(`C${rowNum}`).value = valCur === 0 ? '-' : valCur
          sheet.getCell(`D${rowNum}`).value = valPrev === 0 ? '-' : valPrev

          sheet.getCell(`C${rowNum}`).numFmt = '#,##0'
          sheet.getCell(`D${rowNum}`).numFmt = '#,##0'
          sheet.getCell(`C${rowNum}`).alignment = { horizontal: 'right' }
          sheet.getCell(`D${rowNum}`).alignment = { horizontal: 'right' }

          rowNum++
        })
      }

      // Total Row for Section
      const totalCur = cur[key] || 0
      const totalPrev = prev[key] || 0

      sheet.getCell(`B${rowNum}`).value = 'TOTAL'
      sheet.getCell(`C${rowNum}`).value = totalCur
      sheet.getCell(`D${rowNum}`).value = totalPrev

      const totalRow = sheet.getRow(rowNum)
      totalRow.font = { bold: true }
      totalRow.border = { top: { style: 'thin' }, bottom: { style: 'double' } }
      totalRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF9FAFB' } } // Very light gray

      sheet.getCell(`C${rowNum}`).numFmt = '#,##0'
      sheet.getCell(`D${rowNum}`).numFmt = '#,##0'
      sheet.getCell(`C${rowNum}`).alignment = { horizontal: 'right' }
      sheet.getCell(`D${rowNum}`).alignment = { horizontal: 'right' }

      rowNum++
      rowNum++ // Blank row after section
    })

    // Apply borders to the whole table
    const lastRow = rowNum - 2
    for (let r = 2; r <= lastRow; r++) {
      // Skip blank rows if any (though we control rowNum)
      const cellVal = sheet.getCell(`B${r}`).value
      if (!cellVal && !sheet.getCell(`A${r}`).value) continue

      sheet.getCell(`A${r}`).border = { ...sheet.getCell(`A${r}`).border, left: { style: 'thin' }, right: { style: 'thin' } }
      sheet.getCell(`B${r}`).border = { ...sheet.getCell(`B${r}`).border, left: { style: 'thin' }, right: { style: 'thin' } }
      sheet.getCell(`C${r}`).border = { ...sheet.getCell(`C${r}`).border, left: { style: 'thin' }, right: { style: 'thin' } }
      sheet.getCell(`D${r}`).border = { ...sheet.getCell(`D${r}`).border, left: { style: 'thin' }, right: { style: 'thin' } }
    }

    // Freeze panes
    sheet.views = [{ state: 'frozen', ySplit: 1, xSplit: 0, topLeftCell: 'A2', activeCell: 'A2' }]

    // Page Setup
    sheet.pageSetup = {
      orientation: 'landscape',
      fitToPage: true,
      fitToWidth: 1,
      margins: {
        left: 0.5, right: 0.5, top: 0.75, bottom: 0.75, header: 0.3, footer: 0.3
      }
    }
    sheet.headerFooter = {
      oddHeader: `&C&B&14${currentPeriod} - P&L Schedule Details`,
      oddFooter: '&C&P of &N',
    }
  }

  /**
   * Generate filename based on period data. Includes Client/State when filtered.
   */
  static generateFilename(periodData) {
    try {
      let periodStr = ''
      if (periodData.periodType === 'monthly') {
        periodStr = `${(periodData.monthName || periodData.month || '').replace(/\s+/g, '_')}_${periodData.year}`
      } else if (periodData.periodType === 'quarterly') {
        periodStr = `Q${periodData.quarter || ''}_${periodData.year}`
      } else {
        periodStr = `FY_${periodData.year}_${(parseInt(periodData.year, 10) + 1) || ''}`
      }
      const parts = [`P&L_Report_${periodStr}`]
      const client = periodData.clientName ?? periodData.client
      const state = periodData.stateName ?? periodData.state
      if (client && String(client).toLowerCase() !== 'all') {
        parts.push(`Client_${String(client).replace(/\s+/g, '_').slice(0, 30)}`)
      }
      if (state && String(state).toLowerCase() !== 'all') {
        parts.push(`State_${String(state).replace(/\s+/g, '_').slice(0, 20)}`)
      }
      return `${parts.join('_')}.xlsx`
    } catch (e) {
      console.error('PLReportExcelService: generateFilename error', e)
      return `P&L_Report_${new Date().toISOString().slice(0, 10)}.xlsx`
    }
  }
}

export default PLReportExcelService

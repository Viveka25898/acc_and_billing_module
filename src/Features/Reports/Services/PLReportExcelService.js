import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'

/**
 * P&L Report Excel Generation Service
 * Generates Excel file with two sheets: PL and P&L Sch
 * Uses dummy data for now
 */

class PLReportExcelService {
  /**
   * Generate and download P&L Excel report
   * @param {Object} periodData - { periodType, month, quarter, year, monthName, quarterLabel }
   */
  static async generateAndDownloadPLReport(periodData) {
    try {
      const workbook = new ExcelJS.Workbook()

      // Create PL Sheet
      this.createPLSheet(workbook, periodData)

      // Create P&L Sch Sheet
      this.createPLScheduleSheet(workbook, periodData)

      // Generate Excel file buffer
      const buffer = await workbook.xlsx.writeBuffer()

      // Generate filename
      const filename = this.generateFilename(periodData)

      // Download file
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
      saveAs(blob, filename)

      return { success: true, filename }
    } catch (error) {
      console.error('PLReportExcelService: generateAndDownloadPLReport error', error)
      throw new Error('Failed to generate P&L report. Please try again.')
    }
  }

  /**
   * Create PL (Profit & Loss) Sheet
   */
  static createPLSheet(workbook, periodData) {
    const sheet = workbook.addWorksheet('PL')

    // Set column widths
    sheet.getColumn('A').width = 8 // Sr No column
    sheet.getColumn('B').width = 50 // Particulars
    sheet.getColumn('C').width = 10 // Note No
    sheet.getColumn('D').width = 18 // Current Period
    sheet.getColumn('E').width = 5 // Empty column
    sheet.getColumn('F').width = 18 // Previous Period

    // Helper function to format numbers
    const formatNumber = (num) => {
      if (num === null || num === undefined || num === '-') return '-'
      return typeof num === 'number' ? num.toLocaleString('en-IN') : num
    }

    // Helper function to get period label
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
    const previousYear = periodData.year - 1
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
    sheet.getCell(`A${rowNum}`).value = 'I'
    sheet.getCell(`B${rowNum}`).value = 'Revenue from operations'
    sheet.getCell(`C${rowNum}`).value = 15
    sheet.getCell(`D${rowNum}`).value = 707124186 // Dummy data
    sheet.getCell(`E${rowNum}`).value = ''
    sheet.getCell(`F${rowNum}`).value = 189592750 // Dummy data
    sheet.getRow(rowNum).font = { bold: true }
    sheet.getCell(`A${rowNum}`).alignment = { horizontal: 'center', vertical: 'middle' }

    rowNum++
    sheet.getCell(`B${rowNum}`).value = 'Other Income'
    sheet.getCell(`C${rowNum}`).value = 16
    sheet.getCell(`D${rowNum}`).value = 1261494 // Dummy data
    sheet.getCell(`E${rowNum}`).value = ''
    sheet.getCell(`F${rowNum}`).value = 6125719 // Dummy data

    // III. Total Revenue
    rowNum++
    const totalRevenue = 707124186 + 1261494
    const prevTotalRevenue = 189592750 + 6125719
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
    sheet.getCell(`B${rowNum}`).value = 'Cost of Materials Consumed'
    sheet.getCell(`C${rowNum}`).value = 17
    sheet.getCell(`D${rowNum}`).value = 24143804 // Dummy data
    sheet.getCell(`F${rowNum}`).value = 4957530 // Dummy data
    sheet.getCell(`D${rowNum}`).numFmt = '#,##0'
    sheet.getCell(`F${rowNum}`).numFmt = '#,##0'

    rowNum++
    sheet.getCell(`B${rowNum}`).value = 'Changes in Inventories'
    sheet.getCell(`D${rowNum}`).value = '-'
    sheet.getCell(`F${rowNum}`).value = '-'

    rowNum++
    sheet.getCell(`B${rowNum}`).value = 'Employee benefit expenses'
    sheet.getCell(`C${rowNum}`).value = 18
    sheet.getCell(`D${rowNum}`).value = 612819960 // Dummy data
    sheet.getCell(`F${rowNum}`).value = 163077243 // Dummy data
    sheet.getCell(`D${rowNum}`).numFmt = '#,##0'
    sheet.getCell(`F${rowNum}`).numFmt = '#,##0'

    rowNum++
    sheet.getCell(`B${rowNum}`).value = 'Finance Costs'
    sheet.getCell(`C${rowNum}`).value = 19
    sheet.getCell(`D${rowNum}`).value = 5320245 // Dummy data
    sheet.getCell(`F${rowNum}`).value = 2205245 // Dummy data
    sheet.getCell(`D${rowNum}`).numFmt = '#,##0'
    sheet.getCell(`F${rowNum}`).numFmt = '#,##0'

    rowNum++
    sheet.getCell(`B${rowNum}`).value = 'Depreciation and Amortization Expense'
    sheet.getCell(`C${rowNum}`).value = 9
    sheet.getCell(`D${rowNum}`).value = 3627887 // Dummy data
    sheet.getCell(`F${rowNum}`).value = 1434460 // Dummy data
    sheet.getCell(`D${rowNum}`).numFmt = '#,##0'
    sheet.getCell(`F${rowNum}`).numFmt = '#,##0'

    rowNum++
    sheet.getCell(`B${rowNum}`).value = 'Other expenses'
    sheet.getCell(`C${rowNum}`).value = 20
    sheet.getCell(`D${rowNum}`).value = 49903030 // Dummy data
    sheet.getCell(`F${rowNum}`).value = 22202914 // Dummy data
    sheet.getCell(`D${rowNum}`).numFmt = '#,##0'
    sheet.getCell(`F${rowNum}`).numFmt = '#,##0'

    // V. Total Expenses
    rowNum++
    const totalExpenses = 24143804 + 612819960 + 5320245 + 3627887 + 49903030
    const prevTotalExpenses = 4957530 + 163077243 + 2205245 + 1434460 + 22202914
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
    const profitBeforeTax = totalRevenue - totalExpenses
    const prevProfitBeforeTax = prevTotalRevenue - prevTotalExpenses
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
    sheet.getCell(`B${rowNum}`).value = 'Current tax'
    sheet.getCell(`D${rowNum}`).value = 5553903 // Dummy data
    sheet.getCell(`F${rowNum}`).value = 1437198 // Dummy data
    sheet.getCell(`D${rowNum}`).numFmt = '#,##0'
    sheet.getCell(`F${rowNum}`).numFmt = '#,##0'

    rowNum++
    sheet.getCell(`B${rowNum}`).value = 'Deferred tax'
    sheet.getCell(`D${rowNum}`).value = -463527 // Dummy data (negative)
    sheet.getCell(`F${rowNum}`).value = 15227 // Dummy data
    sheet.getCell(`D${rowNum}`).numFmt = '#,##0'
    sheet.getCell(`F${rowNum}`).numFmt = '#,##0'

    rowNum++
    sheet.getCell(`B${rowNum}`).value = 'Earlier Year Tax Adjustment A/c'
    sheet.getCell(`D${rowNum}`).value = '-'
    sheet.getCell(`F${rowNum}`).value = '-'

    rowNum++
    const totalTax = 5553903 - 463527
    const prevTotalTax = 1437198 + 15227
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
    const profitAfterTax = profitBeforeTax - totalTax
    const prevProfitAfterTax = prevProfitBeforeTax - prevTotalTax
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
    sheet.getCell(`D${rowNum}`).value = 4.53 // Dummy data
    sheet.getCell(`F${rowNum}`).value = 0.24 // Dummy data
    sheet.getCell(`D${rowNum}`).numFmt = '0.00'
    sheet.getCell(`F${rowNum}`).numFmt = '0.00'

    rowNum++
    const dilutedRowNum = rowNum // Track the Diluted row number
    sheet.getCell(`B${rowNum}`).value = 'Diluted'
    sheet.getCell(`D${rowNum}`).value = 4.53 // Dummy data
    sheet.getCell(`F${rowNum}`).value = 0.24 // Dummy data
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
   * Create P&L Schedule Sheet
   */
  static createPLScheduleSheet(workbook, periodData) {
    const sheet = workbook.addWorksheet('P&L Sch')

    // Set column widths
    sheet.getColumn('A').width = 8 // Sr No column
    sheet.getColumn('B').width = 50 // Particulars
    sheet.getColumn('C').width = 18 // Current Period
    sheet.getColumn('D').width = 18 // Previous Period

    // Helper function to get period label
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
    const previousYear = periodData.year - 1
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

    // Miscellaneous Income
    let rowNum = 2
    let srNo = 1
    sheet.getCell(`A${rowNum}`).value = srNo
    sheet.getCell(`B${rowNum}`).value = 'Miscellaneous Income'
    sheet.getRow(rowNum).font = { bold: true, underline: true }
    sheet.getCell(`A${rowNum}`).alignment = { horizontal: 'center', vertical: 'middle' }

    rowNum++
    sheet.getCell(`B${rowNum}`).value = 'Miscellaneous Income'
    sheet.getCell(`C${rowNum}`).value = 1261494 // Dummy data
    sheet.getCell(`D${rowNum}`).value = 6125719 // Dummy data
    sheet.getCell(`C${rowNum}`).numFmt = '#,##0'
    sheet.getCell(`D${rowNum}`).numFmt = '#,##0'

    rowNum++
    sheet.getCell(`B${rowNum}`).value = 'TOTAL'
    sheet.getCell(`C${rowNum}`).value = 1261494
    sheet.getCell(`D${rowNum}`).value = 6125719
    const miscTotalRow = sheet.getRow(rowNum)
    miscTotalRow.font = { bold: true }
    miscTotalRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFC6E0C6' }, // Light green
    }
    miscTotalRow.border = {
      top: { style: 'medium' },
      bottom: { style: 'medium' },
    }
    sheet.getCell(`C${rowNum}`).numFmt = '#,##0'
    sheet.getCell(`D${rowNum}`).numFmt = '#,##0'

    // Note 17: Cost of materials consumed
    rowNum += 2
    srNo++
    sheet.getCell(`A${rowNum}`).value = srNo
    sheet.getCell(`B${rowNum}`).value = 'Note 17: Cost of materials consumed'
    sheet.getRow(rowNum).font = { bold: true, underline: true }
    sheet.getCell(`A${rowNum}`).alignment = { horizontal: 'center', vertical: 'middle' }

    rowNum++
    sheet.getCell(`B${rowNum}`).value = 'Material consumed'
    sheet.getCell(`C${rowNum}`).value = 17670195 // Dummy data
    sheet.getCell(`D${rowNum}`).value = 3989920 // Dummy data
    sheet.getCell(`C${rowNum}`).numFmt = '#,##0'
    sheet.getCell(`D${rowNum}`).numFmt = '#,##0'

    rowNum++
    sheet.getCell(`B${rowNum}`).value = 'Uniform consumed'
    sheet.getCell(`C${rowNum}`).value = 6473609 // Dummy data
    sheet.getCell(`D${rowNum}`).value = 967610 // Dummy data
    sheet.getCell(`C${rowNum}`).numFmt = '#,##0'
    sheet.getCell(`D${rowNum}`).numFmt = '#,##0'

    rowNum++
    sheet.getCell(`B${rowNum}`).value = 'TOTAL'
    sheet.getCell(`C${rowNum}`).value = 24143804
    sheet.getCell(`D${rowNum}`).value = 4957530
    const costTotalRow = sheet.getRow(rowNum)
    costTotalRow.font = { bold: true }
    costTotalRow.border = {
      top: { style: 'medium' },
      bottom: { style: 'medium' },
    }
    sheet.getCell(`C${rowNum}`).numFmt = '#,##0'
    sheet.getCell(`D${rowNum}`).numFmt = '#,##0'

    // Note 18: Employee benefits expense
    rowNum += 2
    srNo++
    sheet.getCell(`A${rowNum}`).value = srNo
    sheet.getCell(`B${rowNum}`).value = 'Note 18: Employee benefits expense'
    sheet.getRow(rowNum).font = { bold: true, underline: true }
    sheet.getCell(`A${rowNum}`).alignment = { horizontal: 'center', vertical: 'middle' }

    rowNum++
    sheet.getCell(`B${rowNum}`).value = 'Salaries and wages'
    sheet.getCell(`C${rowNum}`).value = 544905102 // Dummy data
    sheet.getCell(`D${rowNum}`).value = 144445313 // Dummy data
    sheet.getCell(`C${rowNum}`).numFmt = '#,##0'
    sheet.getCell(`D${rowNum}`).numFmt = '#,##0'

    rowNum++
    sheet.getCell(`B${rowNum}`).value = 'Contributions to provident and other funds'
    sheet.getCell(`C${rowNum}`).value = 66927303 // Dummy data
    sheet.getCell(`D${rowNum}`).value = 17969817 // Dummy data
    sheet.getCell(`C${rowNum}`).numFmt = '#,##0'
    sheet.getCell(`D${rowNum}`).numFmt = '#,##0'

    rowNum++
    sheet.getCell(`B${rowNum}`).value = 'Gratuity paid'
    sheet.getCell(`C${rowNum}`).value = '-'
    sheet.getCell(`D${rowNum}`).value = '-'

    rowNum++
    sheet.getCell(`B${rowNum}`).value = 'Leave Encashment'
    sheet.getCell(`C${rowNum}`).value = '-'
    sheet.getCell(`D${rowNum}`).value = '-'

    rowNum++
    sheet.getCell(`B${rowNum}`).value = 'Bonus Paid'
    sheet.getCell(`C${rowNum}`).value = '-'
    sheet.getCell(`D${rowNum}`).value = '-'

    rowNum++
    sheet.getCell(`B${rowNum}`).value = 'Staff Welfare'
    sheet.getCell(`C${rowNum}`).value = 987555 // Dummy data
    sheet.getCell(`D${rowNum}`).value = 662113 // Dummy data
    sheet.getCell(`C${rowNum}`).numFmt = '#,##0'
    sheet.getCell(`D${rowNum}`).numFmt = '#,##0'

    rowNum++
    sheet.getCell(`B${rowNum}`).value = 'TOTAL'
    sheet.getCell(`C${rowNum}`).value = 612819960
    sheet.getCell(`D${rowNum}`).value = 163077243
    const empTotalRow = sheet.getRow(rowNum)
    empTotalRow.font = { bold: true }
    empTotalRow.border = {
      top: { style: 'medium' },
      bottom: { style: 'medium' },
    }
    sheet.getCell(`C${rowNum}`).numFmt = '#,##0'
    sheet.getCell(`D${rowNum}`).numFmt = '#,##0'

    // Note 19: Finance Cost
    rowNum += 2
    srNo++
    sheet.getCell(`A${rowNum}`).value = srNo
    sheet.getCell(`B${rowNum}`).value = 'Note 19: Finance Cost'
    sheet.getRow(rowNum).font = { bold: true, underline: true }
    sheet.getCell(`A${rowNum}`).alignment = { horizontal: 'center', vertical: 'middle' }

    rowNum++
    sheet.getCell(`B${rowNum}`).value = 'Interest expense on :-'
    sheet.getRow(rowNum).font = { italic: true }

    rowNum++
    sheet.getCell(`B${rowNum}`).value = 'Borrowings'
    sheet.getCell(`C${rowNum}`).value = 4254465 // Dummy data
    sheet.getCell(`D${rowNum}`).value = 780004 // Dummy data
    sheet.getCell(`C${rowNum}`).numFmt = '#,##0'
    sheet.getCell(`D${rowNum}`).numFmt = '#,##0'

    rowNum++
    sheet.getCell(`B${rowNum}`).value = 'Other borrowing Cost'
    sheet.getCell(`C${rowNum}`).value = 1065780 // Dummy data
    sheet.getCell(`D${rowNum}`).value = 1425241 // Dummy data
    sheet.getCell(`C${rowNum}`).numFmt = '#,##0'
    sheet.getCell(`D${rowNum}`).numFmt = '#,##0'

    rowNum++
    sheet.getCell(`B${rowNum}`).value = 'TOTAL...'
    sheet.getCell(`C${rowNum}`).value = 5320245
    sheet.getCell(`D${rowNum}`).value = 2205245
    const financeTotalRow = sheet.getRow(rowNum)
    financeTotalRow.font = { bold: true }
    financeTotalRow.border = {
      top: { style: 'medium' },
      bottom: { style: 'medium' },
    }
    sheet.getCell(`C${rowNum}`).numFmt = '#,##0'
    sheet.getCell(`D${rowNum}`).numFmt = '#,##0'

    // Note 20: Other Expenses
    rowNum += 2
    srNo++
    sheet.getCell(`A${rowNum}`).value = srNo
    sheet.getCell(`B${rowNum}`).value = 'Note 20: Other Expenses'
    sheet.getRow(rowNum).font = { bold: true, underline: true }
    sheet.getCell(`A${rowNum}`).alignment = { horizontal: 'center', vertical: 'middle' }

    const otherExpenses = [
      { name: 'Telephone & Internet Expenses', current: 123456, previous: 98765 },
      { name: 'Bad Debts', current: 0, previous: 0 },
      { name: 'Donation', current: 50000, previous: 25000 },
      { name: 'Professional Fees', current: 2500000, previous: 1200000 },
      { name: 'Audit Fees', current: 150000, previous: 0 },
      { name: 'ROC Filling Fees', current: 50000, previous: 30000 },
      { name: 'Conference & Seminar Expenses', current: 75000, previous: 50000 },
      { name: 'Loss by Business Fraud', current: 0, previous: 0 },
      { name: 'Advertisement', current: 200000, previous: 150000 },
      { name: 'Insurance', current: 500000, previous: 400000 },
      { name: 'Sub Contract Charges', current: 5000000, previous: 3000000 },
      { name: 'Electricity Charges', current: 800000, previous: 600000 },
      { name: 'Rent Expenses', current: 3000000, previous: 2500000 },
      { name: 'Office Expenses', current: 1500000, previous: 1000000 },
      { name: 'Printing & Stationery', current: 200000, previous: 150000 },
      { name: 'Repairs & Maintenance', current: 500000, previous: 400000 },
      { name: 'Travelling Expenses', current: 2000000, previous: 1500000 },
      { name: 'Commission & Brokerage', current: 1000000, previous: 800000 },
      { name: 'Business Promotion Expenses', current: 500000, previous: 300000 },
      { name: 'Penalty, Interest and late Filing fees', current: 50000, previous: 30000 },
      { name: 'Site Expenses', current: 10000000, previous: 8000000 },
      { name: 'Postage & Courier', current: 50000, previous: 40000 },
      { name: 'Registration & Renewal Fees', current: 100000, previous: 80000 },
      { name: 'Misc Expenses', current: 2000000, previous: 1500000 },
      { name: 'Computer Expenses', current: 500000, previous: 400000 },
      { name: 'Consultancy Charges - Overseas', current: 0, previous: 500000 },
    ]

    otherExpenses.forEach((expense) => {
      rowNum++
      sheet.getCell(`B${rowNum}`).value = expense.name
      if (expense.current > 0) {
        sheet.getCell(`C${rowNum}`).value = expense.current
        sheet.getCell(`C${rowNum}`).numFmt = '#,##0'
      } else {
        sheet.getCell(`C${rowNum}`).value = '-'
      }
      if (expense.previous > 0) {
        sheet.getCell(`D${rowNum}`).value = expense.previous
        sheet.getCell(`D${rowNum}`).numFmt = '#,##0'
      } else {
        sheet.getCell(`D${rowNum}`).value = '-'
      }
    })

    rowNum++
    const otherExpTotal = otherExpenses.reduce((sum, e) => sum + e.current, 0)
    const prevOtherExpTotal = otherExpenses.reduce((sum, e) => sum + e.previous, 0)
    sheet.getCell(`B${rowNum}`).value = 'TOTAL...'
    sheet.getCell(`C${rowNum}`).value = otherExpTotal
    sheet.getCell(`D${rowNum}`).value = prevOtherExpTotal
    const otherExpTotalRow = sheet.getRow(rowNum)
    otherExpTotalRow.font = { bold: true }
    otherExpTotalRow.border = {
      top: { style: 'medium' },
      bottom: { style: 'medium' },
    }
    sheet.getCell(`C${rowNum}`).numFmt = '#,##0'
    sheet.getCell(`D${rowNum}`).numFmt = '#,##0'

    // Right align numeric columns and center Sr No column
    for (let i = 2; i <= rowNum; i++) {
      // Center align Sr No column
      const aCell = sheet.getCell(`A${i}`)
      if (aCell.value) {
        aCell.alignment = { horizontal: 'center', vertical: 'middle' }
      }
      
      // Right align numeric columns
      const cCell = sheet.getCell(`C${i}`)
      const dCell = sheet.getCell(`D${i}`)
      if (cCell.value && typeof cCell.value === 'number') {
        cCell.alignment = { horizontal: 'right', vertical: 'middle' }
      }
      if (dCell.value && typeof dCell.value === 'number') {
        dCell.alignment = { horizontal: 'right', vertical: 'middle' }
      }
    }

    // Add table borders for P&L Sch sheet (from header row 1 to last data row)
    const tableStartRow = 1
    const tableEndRow = rowNum

    // Apply borders to all cells in the table (columns A, B, C, D)
    for (let row = tableStartRow; row <= tableEndRow; row++) {
      const columns = ['A', 'B', 'C', 'D']
      columns.forEach((col) => {
        const cell = sheet.getCell(`${col}${row}`)
        
        // Get existing border if any (preserve special borders like medium for totals)
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

    // Freeze header row and first column
    sheet.views = [
      {
        state: 'frozen',
        ySplit: 1, // Freeze row 1
        xSplit: 1, // Freeze column A
        topLeftCell: 'B2',
        activeCell: 'B2',
      },
    ]

    // Set print area and page setup
    sheet.pageSetup = {
      printArea: `A1:D${rowNum}`,
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
      oddHeader: `&C&B&14${currentPeriod} - P&L Schedule`,
      oddFooter: '&C&P of &N',
    }
  }

  /**
   * Generate filename based on period data
   */
  static generateFilename(periodData) {
    let periodStr = ''
    if (periodData.periodType === 'monthly') {
      periodStr = `${periodData.monthName}_${periodData.year}`
    } else if (periodData.periodType === 'quarterly') {
      periodStr = `${periodData.quarter}_${periodData.year}`
    } else {
      periodStr = `FY_${periodData.year}_${periodData.year + 1}`
    }
    return `P&L_Report_${periodStr}.xlsx`
  }
}

export default PLReportExcelService

import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const buildPlaceholderWorkbook = () => {
  const workbook = new ExcelJS.Workbook()
  workbook.creator = 'iSmart Accounts'
  workbook.created = new Date()

  const summary = workbook.addWorksheet('FDD Summary')
  summary.addRow(['Financial Due Diligence Report'])
  summary.addRow(['Generated', new Date().toLocaleString('en-IN')])
  summary.addRow(['Includes', 'FY Current + FY-1 + FY-2'])

  const fyCurrent = workbook.addWorksheet('FY Current')
  fyCurrent.addRow(['Section', 'Account Code', 'Account Name', 'Amount'])
  fyCurrent.addRow(['Revenue', 'R1001', 'Housekeeping Revenue', 0])

  const fyPrev = workbook.addWorksheet('FY Previous')
  fyPrev.addRow(['Section', 'Account Code', 'Account Name', 'Amount'])
  fyPrev.addRow(['Revenue', 'R1001', 'Housekeeping Revenue', 0])

  const fyPrev2 = workbook.addWorksheet('FY Two Years Ago')
  fyPrev2.addRow(['Section', 'Account Code', 'Account Name', 'Amount'])
  fyPrev2.addRow(['Revenue', 'R1001', 'Housekeeping Revenue', 0])

  return workbook
}

export const uploadFDDHistoricalData = async (file) => {
  try {
    if (!file) {
      throw new Error('Please select an Excel file to upload.')
    }

    await delay(800)

    return {
      success: true,
      fileName: file.name,
      uploadedAt: new Date().toISOString(),
      size: file.size,
    }
  } catch (error) {
    console.error('fddReportService: upload error', error)
    throw error instanceof Error ? error : new Error('Upload failed. Please try again.')
  }
}

export const downloadFDDReport = async () => {
  try {
    await delay(900)

    const workbook = buildPlaceholderWorkbook()
    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })

    const dateTag = new Date().toISOString().slice(0, 10)
    const filename = `FDD_Report_${dateTag}.xlsx`
    saveAs(blob, filename)

    return { success: true, filename }
  } catch (error) {
    console.error('fddReportService: download error', error)
    throw error instanceof Error ? error : new Error('Download failed. Please try again.')
  }
}

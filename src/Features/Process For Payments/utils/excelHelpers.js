// ─── excelHelpers.js ──────────────────────────────────────────────────────────
// Excel parsing utilities for all three payment types.
// These replace the inline parsing functions that were duplicated across
// RelieverPaymentSection and ConveyancePaymentsSection.
// ─────────────────────────────────────────────────────────────────────────────
import * as XLSX from 'xlsx'

/**
 * Parse a bank payment upload Excel file (vendor payments).
 * Required columns: Vendor Name, Invoice Numbers, Payment Done
 */
export const parseVendorExcelFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const workbook = XLSX.read(e.target.result, { type: 'binary' })
        const worksheet = workbook.Sheets[workbook.SheetNames[0]]
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' })

        const requiredColumns = ['Vendor Name', 'Invoice Numbers', 'Payment Done']
        const missing = requiredColumns.filter(
          (col) => !Object.keys(jsonData[0] || {}).includes(col)
        )
        if (missing.length > 0) {
          reject(new Error(`Missing required columns: ${missing.join(', ')}`))
          return
        }
        resolve(jsonData)
      } catch (err) {
        reject(new Error('Failed to parse vendor Excel file. Please check the format.'))
      }
    }
    reader.onerror = () => reject(new Error('File could not be read.'))
    reader.readAsBinaryString(file)
  })
}

// Column name aliases for reliever Excel
const RELIEVER_COLUMN_MAP = {
  'Reliever Name': 'Reliever Name',
  RelieverName: 'Reliever Name',
  Name: 'Reliever Name',
  Reliever: 'Reliever Name',
  'Employee ID': 'Employee ID',
  EmployeeID: 'Employee ID',
  'Emp ID': 'Employee ID',
  EmployeeId: 'Employee ID',
  EmpId: 'Employee ID',
  Amount: 'Amount',
  'Payment Amount': 'Amount',
  'Paid Amount': 'Amount',
  'Total Amount': 'Amount',
  'Account No': 'Account No',
  AccountNo: 'Account No',
  'Account Number': 'Account No',
  AccountNumber: 'Account No',
  'Bank Account': 'Account No',
  'Bank Account No': 'Account No',
  'IFSC Code': 'IFSC Code',
  IFSCCode: 'IFSC Code',
  IFSC: 'IFSC Code',
  'Bank Code': 'IFSC Code',
  Site: 'Site',
  Location: 'Site',
  Branch: 'Site',
  'Work Location': 'Site',
}

/**
 * Parse a reliever payment Excel file.
 * Required columns: Reliever Name, Amount, Account No, IFSC Code
 */
export const parseRelieverExcelFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const workbook = XLSX.read(e.target.result, { type: 'binary' })
        const worksheet = workbook.Sheets[workbook.SheetNames[0]]
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' })

        if (jsonData.length === 0) {
          reject(new Error('Excel file is empty.'))
          return
        }

        const normalizedData = jsonData.map((row) => {
          const out = {}
          Object.keys(row).forEach((key) => {
            out[RELIEVER_COLUMN_MAP[key] || key] = row[key]
          })
          return out
        })

        const required = ['Reliever Name', 'Amount']
        const missing = required.filter(
          (col) => !Object.keys(normalizedData[0] || {}).includes(col)
        )
        if (missing.length > 0) {
          reject(new Error(`Missing columns: ${missing.join(', ')}`))
          return
        }

        const complete = normalizedData.map((row) => ({
          'Reliever Name': row['Reliever Name'] || 'Unknown Reliever',
          'Employee ID':
            row['Employee ID'] || `EMP-${Math.random().toString(36).substr(2, 5)}`,
          Amount: parseFloat(row['Amount']) || 0,
          'Account No': row['Account No'] || 'N/A',
          'IFSC Code': row['IFSC Code'] || 'N/A',
          Site: row['Site'] || 'General',
          'Days Worked': row['Days Worked'] || row['Days'] || 1,
          'Bank Name': row['Bank Name'] || 'Unknown Bank',
          'Payment Date': row['Payment Date'] || new Date().toISOString().split('T')[0],
          UTR: row['UTR'] || '',
          Remarks: row['Remarks'] || row['Narration'] || '',
        }))

        resolve(complete)
      } catch (err) {
        reject(new Error('Failed to parse reliever Excel file. Please check the format.'))
      }
    }
    reader.onerror = () => reject(new Error('File could not be read.'))
    reader.readAsBinaryString(file)
  })
}

// Column name aliases for conveyance Excel
const CONVEYANCE_COLUMN_MAP = {
  'Employee Name': 'Employee Name',
  EmployeeName: 'Employee Name',
  Name: 'Employee Name',
  Employee: 'Employee Name',
  'Employee ID': 'Employee ID',
  EmployeeID: 'Employee ID',
  'Emp ID': 'Employee ID',
  EmployeeId: 'Employee ID',
  EmpId: 'Employee ID',
  Amount: 'Amount',
  'Payment Amount': 'Amount',
  'Paid Amount': 'Amount',
  'Total Amount': 'Amount',
  UTR: 'UTR',
  'UTR Number': 'UTR',
  'Transaction ID': 'UTR',
  TransactionID: 'UTR',
  Client: 'Client',
  'Client Name': 'Client',
  Customer: 'Client',
  Purpose: 'Purpose',
  'Visit Purpose': 'Purpose',
  Description: 'Purpose',
}

/**
 * Parse a conveyance reimbursement Excel file.
 * Required columns: Employee Name, Amount, UTR
 */
export const parseConveyanceExcelFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const workbook = XLSX.read(e.target.result, { type: 'binary' })
        const worksheet = workbook.Sheets[workbook.SheetNames[0]]
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' })

        if (jsonData.length === 0) {
          reject(new Error('Excel file is empty.'))
          return
        }

        const normalizedData = jsonData.map((row) => {
          const out = {}
          Object.keys(row).forEach((key) => {
            out[CONVEYANCE_COLUMN_MAP[key] || key] = row[key]
          })
          return out
        })

        const required = ['Employee Name', 'Amount']
        const missing = required.filter(
          (col) => !Object.keys(normalizedData[0] || {}).includes(col)
        )
        if (missing.length > 0) {
          reject(new Error(`Missing columns: ${missing.join(', ')}`))
          return
        }

        const complete = normalizedData.map((row) => ({
          'Employee Name': row['Employee Name'] || 'Unknown Employee',
          'Employee ID':
            row['Employee ID'] || `EMP-${Math.random().toString(36).substr(2, 5)}`,
          Amount: parseFloat(row['Amount']) || 0,
          UTR: row['UTR'] || '',
          Client: row['Client'] || 'N/A',
          Purpose: row['Purpose'] || 'Conveyance Reimbursement',
          'Payment Date': row['Payment Date'] || new Date().toISOString().split('T')[0],
          Remarks: row['Remarks'] || row['Narration'] || '',
        }))

        resolve(complete)
      } catch (err) {
        reject(
          new Error('Failed to parse conveyance Excel file. Please check the format.')
        )
      }
    }
    reader.onerror = () => reject(new Error('File could not be read.'))
    reader.readAsBinaryString(file)
  })
}

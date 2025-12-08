import { useNavigate } from 'react-router-dom'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import UploadPayrollFile from '../Components/UploadPayrollFile'

export default function PayrollPaymentEntryPage() {
  const navigate = useNavigate()

  const handleDownloadTemplate = () => {
    const sampleData = [
      {
        TYPE: 'NEFT',
        'DEBIT BANK A/C NO': '1234567890',
        'DEBIT AMT': 25000,
        CUR: 'INR',
        'NARRTION/NAME (NOT MORE THAN 20)': 'John Doe'.slice(0, 20),
      },
    ]

    const ws = XLSX.utils.json_to_sheet(sampleData)
    ws['!cols'] = [{ wch: 10 }, { wch: 20 }, { wch: 12 }, { wch: 8 }, { wch: 30 }]

    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'BankPaymentFormat')
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const file = new Blob([excelBuffer], { type: 'application/octet-stream' })
    saveAs(file, 'Bank_NEFT_Payment_Format.xlsx')
  }

  const handleDownloadEmployeeSample = () => {
    const sampleEmployeeData = [
      {
        TYPE: 'NEFT',
        'DEBIT BANK A/C NO': '1234567890123',
        'DEBIT AMT': 45000,
        CUR: 'INR',
        'BENEFICIARY A/C NO': '9876543210001',
        'IFSC CODE': 'HDFC0001234',
        'NARRATION/NAME (NOT MORE THAN 20)': 'John Doe',
      },
      // ... (other sample employees)
    ]

    const ws = XLSX.utils.json_to_sheet(sampleEmployeeData)
    ws['!cols'] = [
      { wch: 10 },
      { wch: 20 },
      { wch: 12 },
      { wch: 8 },
      { wch: 20 },
      { wch: 15 },
      { wch: 25 },
    ]

    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Employee_Salary_Data')
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const file = new Blob([excelBuffer], { type: 'application/octet-stream' })
    saveAs(file, 'Sample_Employee_Salary_Data.xlsx')
  }

  return (
    <div className="p-4 max-w-5xl mx-auto bg-white shadow-md rounded-md">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-green-600">Salary Payment Entry</h1>
        <button
          onClick={() => navigate('/dashboard/payroll-team/my-entries')}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          My Entries
        </button>
      </div>

      <UploadPayrollFile />
      <hr className="border-gray-400 mx-4" />

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={handleDownloadEmployeeSample}
          className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
        >
          📋 Download Sample Employee Data
        </button>
        <button
          onClick={handleDownloadTemplate}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          📄 Download Pre-Formatted File
        </button>
      </div>
    </div>
  )
}

import { useRef, useState, useEffect } from 'react'
import * as XLSX from 'xlsx'
import { toast } from 'react-toastify'

export default function UploadPayrollFile() {
  const [data, setData] = useState([])
  const [summaryData, setSummaryData] = useState(null)
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    setCurrentUser(user)
  }, [])

  // Function to generate dummy employee data with all 112 salary heads
  const generateSampleData = () => {
    const employeeCount = Math.floor(Math.random() * 3) + 2 // 2 to 4 employees
    const employees = []

    const names = [
      { first: 'Rahul', last: 'Sharma', designation: 'Software Engineer', gender: 'Male' },
      { first: 'Priya', last: 'Patel', designation: 'HR Manager', gender: 'Female' },
      { first: 'Amit', last: 'Kumar', designation: 'Accountant', gender: 'Male' },
      { first: 'Sneha', last: 'Singh', designation: 'Sales Executive', gender: 'Female' },
    ]

    const states = [
      { name: 'Maharashtra', pt: 200, lwfEmp: 6, lwfEr: 20 },
      { name: 'Karnataka', pt: 200, lwfEmp: 0, lwfEr: 0 },
      { name: 'Delhi', pt: 200, lwfEmp: 0, lwfEr: 0 },
    ]

    const branches = ['Mumbai HQ', 'Delhi Branch', 'Bangalore Office', 'Pune Branch']
    const sites = ['SITE001', 'SITE002', 'SITE003', 'SITE004']
    const clientGroups = ['CG001', 'CG002', 'CG003']

    for (let i = 0; i < employeeCount; i++) {
      const name = names[i % names.length]
      const state = states[i % states.length]
      const employee = {}

      // 1. MONTHATTENDANCEID
      employee['MONTHATTENDANCEID'] = `ATT${202512}${String(i + 1).padStart(4, '0')}`

      // 2-7. Branch and Site Info
      employee['BRANCHNAME'] = branches[i % branches.length]
      employee['CLIENTGROUPCODE'] = clientGroups[i % clientGroups.length]
      employee['CLIENTGROUPNAME'] = `Client Group ${clientGroups[i % clientGroups.length]}`
      employee['SITECODE'] = sites[i % sites.length]
      employee['SITENAME'] = `Site Name ${sites[i % sites.length]}`
      employee['STATENAME'] = state.name

      // 8-20. Employee Master Data
      employee['EMPOLDCODE'] = `OLD${1000 + i}`
      employee['EMPMASTERID'] = `MASTER${1000 + i}`
      employee['EMPCODE'] = `EMP${String(1001 + i).padStart(4, '0')}`
      employee['FULLNAME'] = `${name.first} ${name.last}`
      employee['DOJ'] = '2023-01-15'
      employee['DOB'] = '1990-05-20'
      employee['GENDERNAME'] = name.gender
      employee['DUTYMASTERID'] = `DUTY${100 + i}`
      employee['DUTYNAME'] = i % 2 === 0 ? 'Day Shift' : 'Night Shift'
      employee['GROUPMASTERID'] = `GRP${10 + i}`
      employee['GROUP'] = `Group ${String.fromCharCode(65 + i)}`
      employee['DESIGNATIONMASTERID'] = `DESIG${200 + i}`
      employee['DESIGNATIONNAME'] = name.designation

      // 21-22. Calculation Helpers
      const basicSalary = 20000 + i * 5000
      const daSalary = 5000 + i * 1000
      employee['PF WAGES'] = Math.min(basicSalary + daSalary, 15000) // Capped at 15000
      employee['ESI WAGES'] = Math.min(basicSalary + daSalary + 8000, 21000) // Capped at 21000

      // 23-29. Attendance & Leave Data
      employee['NORMALDAYS'] = 26
      employee['WEEKLYOFF'] = 4
      employee['OTHOURS'] = i === 0 ? 8 : 0
      employee['SPLOTHOURS'] = i === 1 ? 4 : 0
      employee['PL_AVAILED'] = i % 2
      employee['CL_AVAILED'] = i % 3
      employee['SL_AVAILED'] = i % 2

      // 30-48. Fixed Salary Structure (Master Values)
      employee['FIXED_BASIC'] = basicSalary
      employee['FIXED_DA'] = daSalary
      employee['FIXED_HRA'] = 8000 + i * 2000
      employee['FIXED_CONVEYANCE'] = 1600
      employee['FIXED_WASHING ALLOWANCE'] = 500
      employee['FIXED_OTHER ALLOWANCE'] = 1000
      employee['FIXED_LEAVE WITH WAGES'] = 0
      employee['FIXED_CCA'] = 800
      employee['FIXED_EDUCATIONAL ALLOWANCE'] = 500
      employee['FIXED_MEDICAL ALLOWANCE'] = 1250
      employee['FIXED_SPL ALLOWANCE'] = 2000
      employee['FIXED_BONUS'] = 0
      employee['FIXED_MEAL'] = 1000
      employee['FIXED_SITE ALLOWANCE'] = 1500
      employee['FIXED_PERFORMANCE ALLOWANCE'] = 0
      employee['FIXED_FOOD'] = 0
      employee['FIXED_METRO CITY ALLOWANCE'] = state.name === 'Maharashtra' ? 1000 : 0
      employee['FIXED_STIPEND'] = 0
      employee['FIXEDGROSS'] =
        basicSalary +
        daSalary +
        8000 +
        i * 2000 +
        1600 +
        500 +
        1000 +
        800 +
        500 +
        1250 +
        2000 +
        1000 +
        1500 +
        (state.name === 'Maharashtra' ? 1000 : 0)

      // 49-71. Actual Salary Components (EXPENSE - X2001001001)
      employee['BASIC'] = basicSalary
      employee['DA'] = daSalary
      employee['HRA'] = 8000 + i * 2000
      employee['CONVEYANCE'] = 1600
      employee['WASHING ALLOWANCE'] = 500
      employee['OTHER ALLOWANCE'] = 1000
      employee['LEAVE WITH WAGES'] = 0
      employee['CCA'] = 800
      employee['EDUCATIONAL ALLOWANCE'] = 500
      employee['MEDICAL ALLOWANCE'] = 1250
      employee['OT AMOUNT'] = i === 0 ? 1200 : 0
      employee['SPL ALLOWANCE'] = 2000
      employee['REIMBURSEMENT'] = 0
      employee['BONUS'] = 0
      employee['MEAL'] = 1000
      employee['SITE ALLOWANCE'] = 1500
      employee['CONY'] = 0
      employee['PERFORMANCE ALLOWANCE'] = 0
      employee['CASH RISK ALLOWANCE'] = 0
      employee['INCENTIVE'] = i === 3 ? 3000 : 0
      employee['FOOD'] = 0
      employee['METRO CITY ALLOWANCE'] = state.name === 'Maharashtra' ? 1000 : 0
      employee['STIPEND'] = 0

      // 72. GROSS AMT (Sum of all earnings)
      const grossAmount =
        employee['BASIC'] +
        employee['DA'] +
        employee['HRA'] +
        employee['CONVEYANCE'] +
        employee['WASHING ALLOWANCE'] +
        employee['OTHER ALLOWANCE'] +
        employee['LEAVE WITH WAGES'] +
        employee['CCA'] +
        employee['EDUCATIONAL ALLOWANCE'] +
        employee['MEDICAL ALLOWANCE'] +
        employee['OT AMOUNT'] +
        employee['SPL ALLOWANCE'] +
        employee['REIMBURSEMENT'] +
        employee['BONUS'] +
        employee['MEAL'] +
        employee['SITE ALLOWANCE'] +
        employee['CONY'] +
        employee['PERFORMANCE ALLOWANCE'] +
        employee['CASH RISK ALLOWANCE'] +
        employee['INCENTIVE'] +
        employee['FOOD'] +
        employee['METRO CITY ALLOWANCE'] +
        employee['STIPEND']
      employee['GROSS AMT'] = grossAmount

      // 73-84. Deductions (LIABILITY)
      employee['PF'] = Math.round(employee['PF WAGES'] * 0.12) // 12% of PF Wages
      employee['ESIC'] = Math.round(employee['ESI WAGES'] * 0.0075) // 0.75% of ESI Wages
      employee['PT'] = state.pt // Professional Tax (state-specific)
      employee['LWF'] = state.lwfEmp // Labour Welfare Fund (state-specific)
      employee['UNIFORM'] = 0
      employee['ADVANCE'] = i === 1 ? 2000 : 0
      employee['OTHER DEDUCTION'] = 0
      employee['MESS DEDUCTION'] = 0
      employee['UNIFORM DEDUCTION'] = 0
      employee['HRA DEDUCTION'] = 0
      employee['STAFF WELFARE FUND'] = 0
      employee['BACKGROUND VERIFICATION'] = 0

      // 85. TOTALDEDUCTION
      const totalDeduction =
        employee['PF'] +
        employee['ESIC'] +
        employee['PT'] +
        employee['LWF'] +
        employee['UNIFORM'] +
        employee['ADVANCE'] +
        employee['OTHER DEDUCTION'] +
        employee['MESS DEDUCTION'] +
        employee['UNIFORM DEDUCTION'] +
        employee['HRA DEDUCTION'] +
        employee['STAFF WELFARE FUND'] +
        employee['BACKGROUND VERIFICATION']
      employee['TOTALDEDUCTION'] = totalDeduction

      // 86. NETPAYABLE
      employee['NETPAYABLE'] = employee['GROSS AMT'] - employee['TOTALDEDUCTION']

      // 87-89. Employer Statutory Contributions (EXPENSE & LIABILITY)
      employee['PF COMPANY'] = Math.round(employee['PF WAGES'] * 0.1361) // 13.61% (12% + 1.61% admin)
      employee['ESIC COMPANY'] = Math.round(employee['ESI WAGES'] * 0.0325) // 3.25%
      employee['LWF COMPANY'] = state.lwfEr // Employer LWF (state-specific)

      // 90-92. Provisions (EXPENSE & LIABILITY)
      employee['LEAVE_PROVISION'] = Math.round(employee['BASIC'] * 0.0833) // ~8.33% (1 month / 12 months)
      employee['BONUS_PROVISION'] = Math.round(employee['BASIC'] * 0.0833) // ~8.33% (1 month bonus)
      employee['GRATUITY_PROVISION'] = Math.round(
        ((employee['BASIC'] + employee['DA']) * 15) / 26 / 12
      ) // (Basic+DA) × 15/26/12

      // 93. CTC
      employee['CTC'] =
        employee['GROSS AMT'] +
        employee['PF COMPANY'] +
        employee['ESIC COMPANY'] +
        employee['LWF COMPANY'] +
        employee['LEAVE_PROVISION'] +
        employee['BONUS_PROVISION'] +
        employee['GRATUITY_PROVISION']

      // 94-103. Bank Details
      employee['BANK NAME'] = 'HDFC Bank'
      employee['PAYMENTMODENAME'] = 'Bank Transfer'
      employee['BANK NAME AS PER EMPLOYEE'] = 'HDFC Bank'
      employee['BANK BRANCH NAME AS PER EMPLOYEE'] = 'Mumbai Main Branch'
      employee['IFS CODE AS PER EMPLOYEE'] = `HDFC000${1234 + i}`
      employee['BANK ACCOUNT NO AS PER EMPLOYEE'] = `12345678${String(900 + i).padStart(3, '0')}`
      employee['BANK NAME AS PER PAYMENT'] = 'HDFC Bank'
      employee['BANK BRANCH NAME AS PER PAYMENT'] = 'Mumbai Main Branch'
      employee['IFS CODE AS PER PAYMENT'] = `HDFC000${1234 + i}`
      employee['BANK ACCOUNT NO AS PER PAYMENT'] = `12345678${String(900 + i).padStart(3, '0')}`

      // 104-108. Statutory IDs
      employee['PF NO'] = `MH/MUM/${String(12345 + i).padStart(7, '0')}`
      employee['ESIC NO'] = `${String(1234567890 + i)}`
      employee['UAN NO'] = `${String(100123456789 + i)}`
      employee['SALARY STATUS'] = 'Processed'
      employee['AADHAR CARD'] = `${String(123456789012 + i)}`

      // 109-112. Additional Attendance/Leave
      employee['SITEDIVISIONDAYS'] = 26
      employee['PL'] = 15 - employee['PL_AVAILED']
      employee['CL'] = 7 - employee['CL_AVAILED']
      employee['SL'] = 7 - employee['SL_AVAILED']

      // Additional fields for bank payment file
      employee['DEBIT BANK A/C NO'] = '123456789012'
      employee['DEBIT AMT'] = employee['NETPAYABLE']

      employees.push(employee)
    }

    return employees
  }

  // Function to download sample data as Excel file
  const downloadSampleData = () => {
    const sampleData = generateSampleData()

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(sampleData)

    // Set column widths for better readability
    const columnWidths = []
    Object.keys(sampleData[0]).forEach(() => {
      columnWidths.push({ wch: 20 })
    })
    ws['!cols'] = columnWidths

    // Create workbook
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Payroll Data')

    // Generate Excel file
    XLSX.writeFile(wb, `Payroll_Sample_${new Date().toISOString().split('T')[0]}.xlsx`)

    toast.success('✅ Sample payroll file with all 112 salary heads downloaded!')
  }

  const processEmployeeDataToSummary = (employeeData) => {
    if (!employeeData || employeeData.length === 0) return null

    const totalAmount = employeeData.reduce((sum, employee) => {
      return sum + Number(employee['NETPAYABLE'] || employee['DEBIT AMT'] || 0)
    }, 0)

    const currentDate = new Date()
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ]
    const currentMonth = monthNames[currentDate.getMonth()]
    const currentYear = currentDate.getFullYear()

    return {
      summary: {
        TYPE: 'NEFT',
        'DEBIT BANK A/C NO': employeeData[0]['DEBIT BANK A/C NO'] || '',
        'DEBIT AMT': totalAmount,
        CUR: 'INR',
        'NARRATION/NAME': `${currentMonth} ${currentYear} Salary`,
      },
      employeeCount: employeeData.length,
      totalAmount: totalAmount,
      month: `${currentMonth} ${currentYear}`,
    }
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (evt) => {
      const bstr = evt.target.result
      const wb = XLSX.read(bstr, { type: 'binary' })
      const wsname = wb.SheetNames[0]
      const ws = wb.Sheets[wsname]
      const parsedData = XLSX.utils.sheet_to_json(ws, { defval: '' })

      setData(parsedData)
      setSummaryData(processEmployeeDataToSummary(parsedData))
      setError('')
      toast.success(`✅ File uploaded successfully! ${parsedData.length} employees found.`)
    }
    reader.readAsBinaryString(file)
  }

  const handleSubmit = () => {
    if (!summaryData) {
      setError('Please upload a valid file before submitting.')
      toast.error('❌ Please upload a valid file before submitting.')
      return
    }

    const newPayment = {
      id: `sal-${Date.now()}`,
      paymentDate: new Date().toISOString(),
      payrollPeriod: summaryData.month,
      totalAmount: summaryData.totalAmount,
      employeeCount: summaryData.employeeCount,
      bankFile: summaryData.summary,
      employeeDetails: data,
      status: 'Pending Approval',
      submittedBy: currentUser?.username || 'payroll1',
      submittedAt: new Date().toISOString(),
      assignedTo: 'ae1',
      history: [
        {
          action: 'submitted',
          by: currentUser?.username || 'payroll1',
          date: new Date().toISOString(),
          comments: '',
        },
      ],
    }

    const existingPayments = JSON.parse(localStorage.getItem('salaryPayments')) || []
    localStorage.setItem('salaryPayments', JSON.stringify([...existingPayments, newPayment]))

    setData([])
    setSummaryData(null)
    if (fileInputRef.current) fileInputRef.current.value = ''

    toast.success('✅ Salary payment submitted to Account Executive!')
  }

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-2">Upload Excel/CSV File</h2>

      {/* Download Sample Data Button */}
      <button
        onClick={downloadSampleData}
        className="mb-4 mr-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold"
      >
        📥 Download Sample Data
      </button>

      <input
        type="file"
        ref={fileInputRef}
        accept=".xlsx, .xls, .csv"
        onChange={handleFileUpload}
        className="mb-4 border p-2 rounded-2xl bg-green-400 text-white font-semibold w-56 cursor-pointer"
      />

      {error && <p className="text-red-600 text-sm">{error}</p>}

      {summaryData && (
        <>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Payroll Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">Total Employees:</span>
                <p className="text-xl font-bold text-blue-600">{summaryData.employeeCount}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Total Amount:</span>
                <p className="text-xl font-bold text-green-600">
                  ₹{summaryData.totalAmount.toLocaleString('en-IN')}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Payment Month:</span>
                <p className="text-lg font-semibold text-gray-800">{summaryData.month}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Payment Type:</span>
                <p className="text-lg font-semibold text-gray-800">NEFT</p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto border mt-4 rounded">
            <h4 className="text-md font-semibold p-3 bg-gray-100 border-b">Bank Payment Summary</h4>
            <table className="min-w-full text-sm text-left border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 border font-medium">TYPE</th>
                  <th className="p-3 border font-medium">DEBIT BANK A/C NO</th>
                  <th className="p-3 border font-medium">DEBIT AMT</th>
                  <th className="p-3 border font-medium">CUR</th>
                  <th className="p-3 border font-medium">NARRATION/NAME</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t bg-green-50">
                  <td className="p-3 border font-medium">{summaryData.summary.TYPE}</td>
                  <td className="p-3 border">{summaryData.summary['DEBIT BANK A/C NO']}</td>
                  <td className="p-3 border font-bold text-green-600">
                    ₹{summaryData.summary['DEBIT AMT'].toLocaleString('en-IN')}
                  </td>
                  <td className="p-3 border">{summaryData.summary.CUR}</td>
                  <td className="p-3 border font-medium">
                    {summaryData.summary['NARRATION/NAME']}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <details className="mt-4 border rounded">
            <summary className="cursor-pointer p-3 bg-gray-100 font-medium hover:bg-gray-200">
              📋 View Employee Details ({data.length} employees)
            </summary>
            <div className="p-3 max-h-96 overflow-y-auto overflow-x-auto">
              <table className="min-w-full text-sm text-left border-collapse">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    {Object.keys(data[0]).map((key, idx) => (
                      <th key={idx} className="p-2 border font-medium text-xs whitespace-nowrap">
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, idx) => (
                    <tr key={idx} className="border-t hover:bg-gray-50">
                      {Object.keys(data[0]).map((key, i) => (
                        <td key={i} className="p-2 border text-xs whitespace-nowrap">
                          {typeof row[key] === 'number'
                            ? row[key].toLocaleString('en-IN')
                            : row[key]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>

          <button
            onClick={handleSubmit}
            className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-semibold cursor-pointer"
          >
            ✅ Submit to Accounts Executive
          </button>
        </>
      )}
    </div>
  )
}

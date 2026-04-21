/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import * as XLSX from 'xlsx'
import ExpenseUploadForm from './ExpenseUploadForm'
import { toast } from 'react-toastify'

// ─── Role Configuration (workflow rules — not from backend) ──────────────────
const ROLE_CONFIG = {
  employee: {
    status: 'Pending Line Manager Approval',
    currentLevel: 'line-manager',
    getAssignedTo: (fullUser) => fullUser?.reportsTo,
    errorMsg: "No reporting manager assigned. Please set 'reportsTo' in users.",
  },
  'line-manager': {
    status: 'Pending VP Operations Approval',
    currentLevel: 'vp-operations',
    getAssignedTo: (fullUser) => fullUser?.reportsTo,
    errorMsg: "No VP assigned. Please set 'reportsTo' in users.",
  },
  'vp-operations': {
    status: 'Pending Account Executive Approval',
    currentLevel: 'account-executive',
    getAssignedTo: (_fullUser, allUsers) => {
      const ae = allUsers.find((u) => u.role === 'ae' || u.role === 'account-executive')
      return ae?.username
    },
    errorMsg: 'No Account Executive found in the system.',
  },
  manager: {
    status: 'Pending Account Executive Approval',
    currentLevel: 'account-executive',
    getAssignedTo: (_fullUser, allUsers) => {
      const ae = allUsers.find((u) => u.role === 'ae' || u.role === 'account-executive')
      return ae?.username
    },
    errorMsg: 'No Account Executive found in the system.',
  },
  supervisor: {
    status: 'Pending Line Manager Approval',
    currentLevel: 'line-manager',
    getAssignedTo: (fullUser) => fullUser?.reportsTo,
    errorMsg: "No reporting manager assigned.",
  },
  'compliance-team': {
    status: 'Pending VP Operations Approval',
    currentLevel: 'vp-operations',
    getAssignedTo: (fullUser) => fullUser?.reportsTo,
    errorMsg: "No VP assigned. Please set 'reportsTo' in users.",
  },
  'compliance-manager': {
    status: 'Pending VP Operations Approval',
    currentLevel: 'vp-operations',
    getAssignedTo: (fullUser) => fullUser?.reportsTo,
    errorMsg: "No VP assigned.",
  },
  'operation-executive': {
    status: 'Pending VP Operations Approval',
    currentLevel: 'vp-operations',
    getAssignedTo: (fullUser) => fullUser?.reportsTo,
    errorMsg: "No VP assigned.",
  },
}

// Exact GL code mapping
const expenseHeadsMaster = {
  Travel: {
    code: 'TRAVEL',
    name: 'Travel',
    glCode: 'X1001002001',
    category: 'DIRECT_EXPENSES',
  },
  'Food & Refreshments': {
    code: 'FOOD',
    name: 'Food & Refreshments',
    glCode: 'X1001003001',
    category: 'DIRECT_EXPENSES',
  },
  'Hotel Accommodation': {
    code: 'ACCOMMODATION',
    name: 'Hotel Accommodation',
    glCode: 'X1001002002',
    category: 'DIRECT_EXPENSES',
  },
  'Parking Charges': {
    code: 'PARKING',
    name: 'Parking Charges',
    glCode: 'X1001002003',
    category: 'DIRECT_EXPENSES',
  },
  'Office Supplies': {
    code: 'OFFICE_SUPPLIES',
    name: 'Office Supplies',
    glCode: 'X2001002001',
    category: 'BRANCH_EXPENSES',
  },
  'Client Entertainment': {
    code: 'CLIENT_ENTERTAINMENT',
    name: 'Client Entertainment',
    glCode: 'X2002002001',
    category: 'CORPORATE_EXPENSES',
  },
  'Other Expenses': {
    code: 'OTHER',
    name: 'Other Expenses',
    glCode: 'X2002002001',
    category: 'CORPORATE_EXPENSES',
  },
}

const SharedAdvanceSettlementForm = ({
  role = 'employee',
  mySettlementsPath = '/dashboard/employee/my-settelment-requests',
}) => {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [osBalance, setOsBalance] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState(null) // Holds { id } on success

  const roleConfig = ROLE_CONFIG[role] || ROLE_CONFIG['employee']

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = (error) => reject(error)
    })
  }

  const generateEmployeeGLCode = (employeeId) => {
    if (!employeeId) return null
    const normalizedId = String(employeeId).replace('emp', '')
    return `A3001001001-EMP-${normalizedId.padStart(3, '0')}`
  }

  const calculateRealOSBalance = (employeeId) => {
    try {
      const transactions = JSON.parse(localStorage.getItem('transactions')) || []
      const employeeGLCode = generateEmployeeGLCode(employeeId)
      let totalDebits = 0
      let totalCredits = 0

      transactions.forEach((txn) => {
        if (txn.entries && Array.isArray(txn.entries)) {
          txn.entries.forEach((entry) => {
            if (entry.glCode === employeeGLCode) {
              totalDebits += Number(entry.debit) || 0
              totalCredits += Number(entry.credit) || 0
            }
          })
        }
      })
      return totalDebits - totalCredits
    } catch (error) {
      console.error('❌ Error calculating O/S balance:', error)
      return 0
    }
  }

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    const allUsers = JSON.parse(localStorage.getItem('users')) || []
    const fullUser = allUsers.find((u) => u.username === user?.username)
    setCurrentUser(fullUser)

    if (!localStorage.getItem('settlements')) {
      localStorage.setItem('settlements', JSON.stringify([]))
    }
    if (!localStorage.getItem('expenseHeads')) {
      localStorage.setItem('expenseHeads', JSON.stringify(expenseHeadsMaster))
    }

    if (fullUser) {
      const realOSBalance = calculateRealOSBalance(fullUser.empId || fullUser.employeeId)
      setOsBalance(realOSBalance)
    }
  }, [])

  const exportTemplate = async () => {
    try {
      const expenseHeads = Object.keys(expenseHeadsMaster)
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Advance Expenses')

      worksheet.columns = [
        { header: 'S. No', key: 'sno', width: 10 },
        { header: 'Date (DD/MM/YYYY)', key: 'date', width: 18 },
        { header: 'Expense Head', key: 'expenseHead', width: 25 },
        { header: 'Description', key: 'description', width: 45 },
        { header: 'Amount (₹)', key: 'amount', width: 15 },
        { header: 'Remarks', key: 'remarks', width: 30 },
      ]

      worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } }
      worksheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0066CC' } }
      worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' }

      for (let i = 1; i <= 20; i++) {
        worksheet.addRow({
          sno: i.toString(), date: '', expenseHead: '', description: '', amount: '', remarks: '',
        })
      }

      for (let rowNum = 2; rowNum <= 21; rowNum++) {
        const cell = worksheet.getCell(`C${rowNum}`)
        cell.dataValidation = {
          type: 'list',
          allowBlank: false,
          formulae: [`"${expenseHeads.join(',')}"`],
          showErrorMessage: true,
          errorStyle: 'error',
          errorTitle: 'Invalid Entry',
          error: 'Please select a valid expense head from the dropdown list',
          showInputMessage: true,
          promptTitle: 'Expense Head',
          prompt: 'Click the arrow to select an expense category',
        }
      }

      for (let rowNum = 1; rowNum <= 21; rowNum++) {
        for (let colNum = 1; colNum <= 6; colNum++) {
          worksheet.getCell(rowNum, colNum).border = {
            top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' },
          }
        }
      }

      worksheet.views = [{ state: 'frozen', xSplit: 0, ySplit: 1 }]
      const instructionSheet = workbook.addWorksheet('Instructions & GL Codes')
      instructionSheet.columns = [{ header: 'EXPENSE SETTLEMENT INSTRUCTIONS', key: 'instructions', width: 80 }]

      const instructions = [
        '', '📋 HOW TO USE THIS TEMPLATE:', '',
        '1️⃣ Fill in the expense details in the "Advance Expenses" sheet',
        '   • Expense Head: CLICK THE CELL to see dropdown arrow, then select category',
        '   • Amount: Enter amount in rupees (numbers only, no ₹ symbol)',
        '', '2️⃣ Start filling data from Row 2 onwards up to 20 expenses maximum', '',
        '⚠️ IMPORTANT NOTES:',
        '   • All mandatory fields must be filled and do not change column headers',
        '', '📂 AVAILABLE EXPENSE CATEGORIES (With GL Codes):',
        ...Object.entries(expenseHeadsMaster).map(([head, details], idx) => `   ${idx + 1}. ${head} → GL: ${details.glCode}`),
      ]

      instructions.forEach((text, idx) => {
        const row = instructionSheet.getRow(idx + 1)
        row.getCell(1).value = text
        if (text.includes('📋') || text.includes('📂')) row.font = { bold: true, size: 14, color: { argb: 'FF0066CC' } }
        else if (text.includes('️⃣')) row.font = { bold: true, size: 11 }
        else if (text.includes('→ GL:')) row.font = { bold: false, size: 10, color: { argb: 'FF666666' } }
      })

      const buffer = await workbook.xlsx.writeBuffer()
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      saveAs(blob, `Advance_Settlement_Template_${new Date().getTime()}.xlsx`)

      toast.success('✅ Template downloaded with exactly mapped GL validations.')
    } catch (err) {
      console.error('Template error:', err)
      toast.error('Failed to download template.')
    }
  }

  const parseExcelFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result)
          const workbook = XLSX.read(data, { type: 'array' })
          const worksheet = workbook.Sheets[workbook.SheetNames[0]]
          const jsonData = XLSX.utils.sheet_to_json(worksheet)
          const filteredData = jsonData.filter((row) => row['S. No'] && row['Amount (₹)'] && Number(row['Amount (₹)']) > 0)
          resolve(filteredData)
        } catch (err) { reject(err) }
      }
      reader.onerror = reject
      reader.readAsArrayBuffer(file)
    })
  }

  const handleSubmitSettlement = async (excelFile, attachments) => {
    try {
      setIsSubmitting(true)
      setError('')

      if (!currentUser) {
        setError('User information not available. Please refresh the page.')
        setIsSubmitting(false)
        return false
      }

      const allUsers = JSON.parse(localStorage.getItem('users')) || []
      const assignedTo = roleConfig.getAssignedTo(currentUser, allUsers)

      if (!assignedTo) {
        setError(`❌ ${roleConfig.errorMsg}`)
        setIsSubmitting(false)
        return false
      }

      const excelData = await parseExcelFile(excelFile)
      const validExpenseHeads = Object.keys(expenseHeadsMaster)
      const invalidRows = excelData.filter((item) => item['Expense Head'] && !validExpenseHeads.includes(item['Expense Head']))

      if (invalidRows.length > 0) {
        setError(`Invalid expense heads found: ${invalidRows.map((r) => r['Expense Head']).join(', ')}.`)
        setIsSubmitting(false)
        return false
      }

      const totalAmount = excelData.reduce((sum, item) => sum + (Number(item['Amount (₹)']) || 0), 0)

      if (totalAmount > osBalance) {
        toast.warn(`Note: Settlement exceeds O/S balance by ₹${(totalAmount - osBalance).toFixed(2)}. This will create employee liability.`)
      }

      const expenseItemsWithGL = excelData.map((item) => ({
        ...item,
        glCode: expenseHeadsMaster[item['Expense Head']]?.glCode || 'X2002002001',
      }))

      const excelBase64 = await fileToBase64(excelFile)
      const attachmentsWithData = await Promise.all(
        attachments.map(async (file) => ({
          name: file.name, size: file.size, type: file.type, data: await fileToBase64(file),
        }))
      )

      const settlementId = `SET-${Date.now()}`
      const newSettlement = {
        id: settlementId,
        employeeName: currentUser.fullName || currentUser.username,
        employeeId: currentUser.empId || currentUser.employeeId,
        expenseItems: expenseItemsWithGL,
        totalAmount: totalAmount,
        excelFile: { name: excelFile.name, size: excelFile.size, type: excelFile.type, data: excelBase64 },
        attachments: attachmentsWithData,
        status: roleConfig.status,
        submittedAt: new Date().toISOString(),
        assignedTo: assignedTo,
        submittedBy: currentUser.username,
        currentLevel: roleConfig.currentLevel,
        osBalanceBefore: osBalance,
        employeeGLCode: generateEmployeeGLCode(currentUser.empId || currentUser.employeeId),
        history: [{ action: 'submitted', by: currentUser.username, date: new Date().toISOString(), comments: '' }],
      }

      const existingSettlements = JSON.parse(localStorage.getItem('settlements')) || []
      localStorage.setItem('settlements', JSON.stringify([...existingSettlements, newSettlement]))

      setSubmitResult({ id: settlementId })
      setSubmitted(true)
      setIsSubmitting(false)
      toast.success('✅ Settlement submitted successfully!')
      return true
    } catch (err) {
      console.error('Submission error:', err)
      setError('Failed to submit settlement. Please try again.')
      toast.error('Failed to submit settlement.')
      setIsSubmitting(false)
      return false
    }
  }

  const refreshOSBalance = () => {
    if (currentUser) {
      const newBalance = calculateRealOSBalance(currentUser.empId || currentUser.employeeId)
      setOsBalance(newBalance)
      toast.info(`🔄 O/S Balance refreshed: ₹${newBalance.toFixed(2)}`)
    }
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <p className="text-gray-500 font-medium tracking-wide text-sm animate-pulse">Loading context...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 flex justify-center">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl shadow-lg border border-green-100 overflow-hidden relative">

          {/* Loader Overlay */}
          {isSubmitting && (
            <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-green-100 border-t-green-600 mb-3"></div>
              <p className="text-green-800 font-medium">Validating & Uploading Payload...</p>
              <p className="text-sm text-green-600 mt-1 max-w-xs text-center">Crunching GL blocks and syncing blob attachments securely.</p>
            </div>
          )}

          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-500 px-6 py-5 flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                🧾 Advance Settlement
              </h1>
              <p className="text-green-100 text-sm mt-0.5">Automated GL validation mapped templates</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={refreshOSBalance}
                className="bg-green-700/50 text-white text-sm font-semibold px-3 py-1.5 rounded-full hover:bg-green-700 transition shadow-sm border border-green-500/30"
                title="Refresh Actual GL Balance"
              >
                🔄 Refresh
              </button>
              <NavLink to={mySettlementsPath}>
                <button className="bg-white text-green-700 text-sm font-semibold px-4 py-1.5 rounded-full hover:bg-green-50 transition shadow-sm border border-green-200">
                  My Settlements →
                </button>
              </NavLink>
            </div>
          </div>

          <div className="px-6 py-6">
            {submitResult ? (
              // ── Success State ───────────────────────────────────────────────
              <div className="text-center py-8 space-y-4">
                <div className="text-5xl drop-shadow-sm">✅</div>
                <h2 className="text-xl font-bold text-green-700">Settlement Submitted!</h2>
                <p className="text-gray-600 text-sm">Your advance settlement bundle and receipts have been routed successfully.</p>

                <div className="inline-block bg-green-50 border border-green-200 rounded-xl px-6 py-3 shadow-inner">
                  <p className="text-xs text-gray-500 mb-1">Your Settlement ID</p>
                  <p className="text-lg font-bold text-green-700 tracking-wider">
                    {submitResult.id}
                  </p>
                </div>

                <div className="flex gap-3 justify-center mt-4 flex-wrap">
                  <button
                    onClick={() => { setSubmitResult(null); setSubmitted(false); refreshOSBalance(); }}
                    className="bg-green-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-green-700 transition shadow-sm hover:shadow active:scale-[0.98]"
                  >
                    Submit Another 
                  </button>
                  <NavLink to={mySettlementsPath}>
                    <button className="bg-white border border-green-300 text-green-700 px-5 py-2 rounded-full text-sm font-semibold hover:bg-green-50 transition shadow-sm hover:shadow active:scale-[0.98]">
                      View Uploads
                    </button>
                  </NavLink>
                </div>
              </div>
            ) : (
              // ── Form State ──────────────────────────────────────────────────
              <>
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg flex items-start gap-2 mb-5">
                    <span>⚠️</span>
                    <span>{error}</span>
                  </div>
                )}

                <div className="mb-5 flex justify-between items-end flex-wrap gap-4">
                  <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex-1 shadow-sm">
                    <h3 className="font-bold text-blue-800 text-sm mb-2 flex items-center gap-1">📋 System Guidelines</h3>
                    <ul className="text-xs text-blue-700 space-y-1.5 ml-1">
                      <li className="flex items-start gap-1.5">
                        <span className="mt-0.5">•</span> 
                        <span>Click <strong>Download Template</strong> to generate the specific formatted file.</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="mt-0.5">•</span>
                        <span>Use ONLY the dropdowns in the Excel file for "Expense Head".</span>
                      </li>
                      <li className="flex items-start gap-1.5 font-medium text-blue-800">
                        <span className="mt-0.5 mt-0.5">💰</span>
                        <span>Available Tracked Limit: ₹{osBalance.toFixed(2)}</span>
                      </li>
                    </ul>
                  </div>
                  
                  <button
                    type="button"
                    onClick={exportTemplate}
                    className="bg-green-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-700 shadow flex items-center gap-2 transition active:scale-[0.98]"
                  >
                    📥 Download Template
                  </button>
                </div>

                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mb-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Employee Name</label>
                    <div className="text-sm font-medium text-gray-800 bg-white px-3 py-2 rounded-md border border-gray-200 shadow-sm">{currentUser.fullName || currentUser.username}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Employee ID</label>
                    <div className="text-sm font-medium text-gray-800 bg-white px-3 py-2 rounded-md border border-gray-200 shadow-sm">{currentUser.empId || currentUser.employeeId}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">O/S Limit</label>
                    <div className="text-sm font-bold text-green-700 bg-green-50 px-3 py-2 rounded-md border border-green-200 shadow-sm">₹{osBalance.toFixed(2)}</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <ExpenseUploadForm
                    onSubmit={handleSubmitSettlement}
                    onError={(msg) => setError(msg)}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SharedAdvanceSettlementForm

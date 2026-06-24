/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from 'react'
import { NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { saveAs } from 'file-saver'
import * as XLSX from 'xlsx'
import { toast } from 'react-toastify'

import ExpenseUploadForm from './ExpenseUploadForm'

// ── Redux Thunks & Selectors ──────────────────────────────────────────────────
import {
  fetchOsBalance,
  downloadTemplate,
  submitSettlement,
  clearSubmitResult,
} from '../../../store/slices/advanceSettlementSlice'
import {
  selectOsBalance,
  selectSubmitResult,
  selectOsBalanceLoading,
  selectOsBalanceError,
  selectSubmitLoading,
  selectSubmitError,
  selectTemplateLoading,
} from '../../../store/slices/advanceSettlementSlice'

// ── Auth Selectors ────────────────────────────────────────────────────────────
import { selectEmpId, selectEmpName } from '../../../Auth/authSlice'

// ── Constants & Helpers ───────────────────────────────────────────────────────
import { EXPENSE_HEADS_MASTER } from '../utils/settlementConstants'

// ─── Expense head list (derived from master) ──────────────────────────────────
const validExpenseHeads = Object.keys(EXPENSE_HEADS_MASTER)

// ─── Component ────────────────────────────────────────────────────────────────
const SharedAdvanceSettlementForm = ({
  mySettlementsPath = '/dashboard/employee/my-settelment-requests',
}) => {
  const dispatch = useDispatch()

  // ── Redux State ──────────────────────────────────────────────────────────────
  const empId       = useSelector(selectEmpId)
  const empName     = useSelector(selectEmpName)
  const osBalanceData   = useSelector(selectOsBalance)
  const submitResult    = useSelector(selectSubmitResult)
  const osBalanceLoading = useSelector(selectOsBalanceLoading)
  const osBalanceError  = useSelector(selectOsBalanceError)
  const isSubmitting    = useSelector(selectSubmitLoading)
  const submitError     = useSelector(selectSubmitError)
  const templateLoading = useSelector(selectTemplateLoading)

  // ── Local State (UI only) ────────────────────────────────────────────────────
  const [localError, setLocalError] = useState('')

  // ── Derived values ───────────────────────────────────────────────────────────
  const osBalance = osBalanceData?.osBalance ?? 0

  // ─── Fetch OS Balance on mount ────────────────────────────────────────────
  useEffect(() => {
    if (empId) {
      dispatch(fetchOsBalance(empId))
    }
  }, [dispatch, empId])

  // ─── Clear submit result on unmount ──────────────────────────────────────
  useEffect(() => {
    return () => {
      dispatch(clearSubmitResult())
    }
  }, [dispatch])

  // ─── Refresh OS Balance handler ───────────────────────────────────────────
  const refreshOSBalance = useCallback(() => {
    if (empId) {
      dispatch(fetchOsBalance(empId))
        .unwrap()
        .then((result) => {
          toast.info(`🔄 O/S Balance refreshed: ₹${Number(result?.osBalance || 0).toFixed(2)}`)
        })
        .catch((err) => {
          toast.error(`Failed to refresh balance: ${err}`)
        })
    }
  }, [dispatch, empId])

  // ─── Download Template handler ────────────────────────────────────────────
  // Tries backend API first. Falls back to local ExcelJS generation if API fails.
  const exportTemplate = useCallback(async () => {
    try {
      // Attempt backend download first
      const result = await dispatch(downloadTemplate()).unwrap()
      if (result?.blob) {
        saveAs(result.blob, result.fileName || `Advance_Settlement_Template_${Date.now()}.xlsx`)
        toast.success('✅ Template downloaded successfully.')
        return
      }
    } catch (apiErr) {
      // API not ready or failed — fall back to local generation
      console.warn('[Settlement] Template API failed, using local generation:', apiErr)
    }

    // ── Fallback: Generate template locally with ExcelJS ──────────────────
    try {
      const { default: ExcelJS } = await import('exceljs')
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Advance Expenses')

      worksheet.columns = [
        { header: 'S. No',             key: 'sno',         width: 10 },
        { header: 'Date (DD/MM/YYYY)', key: 'date',        width: 18 },
        { header: 'Expense Head',      key: 'expenseHead', width: 25 },
        { header: 'Description',       key: 'description', width: 45 },
        { header: 'Amount (₹)',        key: 'amount',      width: 15 },
        { header: 'Remarks',           key: 'remarks',     width: 30 },
      ]

      worksheet.getRow(1).font      = { bold: true, color: { argb: 'FFFFFFFF' } }
      worksheet.getRow(1).fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0066CC' } }
      worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' }

      for (let i = 1; i <= 20; i++) {
        worksheet.addRow({ sno: i.toString(), date: '', expenseHead: '', description: '', amount: '', remarks: '' })
      }

      for (let rowNum = 2; rowNum <= 21; rowNum++) {
        const cell = worksheet.getCell(`C${rowNum}`)
        cell.dataValidation = {
          type: 'list', allowBlank: false,
          formulae: [`"${validExpenseHeads.join(',')}"`],
          showErrorMessage: true, errorStyle: 'error',
          errorTitle: 'Invalid Entry',
          error: 'Please select a valid expense head from the dropdown list',
          showInputMessage: true, promptTitle: 'Expense Head',
          prompt: 'Click the arrow to select an expense category',
        }
      }

      for (let rowNum = 1; rowNum <= 21; rowNum++) {
        for (let colNum = 1; colNum <= 6; colNum++) {
          worksheet.getCell(rowNum, colNum).border = {
            top: { style: 'thin' }, left: { style: 'thin' },
            bottom: { style: 'thin' }, right: { style: 'thin' },
          }
        }
      }

      worksheet.views = [{ state: 'frozen', xSplit: 0, ySplit: 1 }]

      const buffer = await workbook.xlsx.writeBuffer()
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
      saveAs(blob, `Advance_Settlement_Template_${Date.now()}.xlsx`)
      toast.success('✅ Template downloaded with GL-mapped validations.')
    } catch (err) {
      console.error('Template generation error:', err)
      toast.error('Failed to download template. Please try again.')
    }
  }, [dispatch])

  // ─── Parse uploaded Excel file ────────────────────────────────────────────
  const parseExcelFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data     = new Uint8Array(e.target.result)
          const workbook = XLSX.read(data, { type: 'array' })
          const sheet    = workbook.Sheets[workbook.SheetNames[0]]
          const jsonData = XLSX.utils.sheet_to_json(sheet)
          const filtered = jsonData.filter(
            (row) => row['S. No'] && row['Amount (₹)'] && Number(row['Amount (₹)']) > 0
          )
          resolve(filtered)
        } catch (err) { reject(err) }
      }
      reader.onerror = reject
      reader.readAsArrayBuffer(file)
    })
  }

  // ─── Handle Form Submit ───────────────────────────────────────────────────
  const handleSubmitSettlement = async (excelFile, attachments) => {
    try {
      setLocalError('')

      if (!empId) {
        setLocalError('Employee information not available. Please refresh or log in again.')
        return false
      }

      // ── Parse & Validate Excel content ────────────────────────────────────
      let excelData = []
      try {
        excelData = await parseExcelFile(excelFile)
      } catch {
        setLocalError('Failed to read Excel file. Please ensure it is a valid .xlsx file.')
        return false
      }

      if (excelData.length === 0) {
        setLocalError('Excel file has no valid expense rows. Please fill in at least one row with a valid amount.')
        return false
      }

      // Validate expense heads against master list
      const invalidRows = excelData.filter(
        (item) => item['Expense Head'] && !validExpenseHeads.includes(item['Expense Head'])
      )
      if (invalidRows.length > 0) {
        setLocalError(
          `Invalid expense heads found: ${invalidRows.map((r) => r['Expense Head']).join(', ')}. ` +
          `Please use the dropdown in the Excel file.`
        )
        return false
      }

      const totalAmount = excelData.reduce((sum, item) => sum + (Number(item['Amount (₹)']) || 0), 0)
      if (totalAmount > osBalance && osBalance > 0) {
        toast.warn(
          `Settlement amount (₹${totalAmount.toFixed(2)}) exceeds your O/S balance ` +
          `(₹${osBalance.toFixed(2)}). The excess will be treated as employee liability.`
        )
      }

      // ── Dispatch to Redux (service handles multipart/form-data) ───────────
      await dispatch(submitSettlement({ excelFile, attachments })).unwrap()
      toast.success('✅ Settlement submitted successfully!')

      // Refresh OS balance to reflect the new settlement
      if (empId) {
        setTimeout(() => dispatch(fetchOsBalance(empId)), 1000)
      }

      return true
    } catch (err) {
      // unwrap() throws on rejected thunk — err is the error message string
      const msg = typeof err === 'string' ? err : err?.message || 'Failed to submit settlement.'
      setLocalError(msg)
      toast.error(msg)
      return false
    }
  }

  // ─── Handle "Submit Another" ───────────────────────────────────────────────
  const handleSubmitAnother = () => {
    dispatch(clearSubmitResult())
    setLocalError('')
    if (empId) dispatch(fetchOsBalance(empId))
  }

  // ─── Loading skeleton while OS balance is fetching on first load ──────────
  if (osBalanceLoading && !osBalanceData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
          <p className="text-gray-500 font-medium tracking-wide text-sm animate-pulse">
            Loading settlement context...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 flex justify-center">
      <div className="w-full max-w-4xl">
        <div className="bg-white rounded-2xl shadow-lg border border-green-100 overflow-hidden relative">

          {/* Loader Overlay — shown while API call is in flight */}
          {isSubmitting && (
            <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-green-100 border-t-green-600 mb-3" />
              <p className="text-green-800 font-medium">Validating & Uploading Settlement...</p>
              <p className="text-sm text-green-600 mt-1 max-w-xs text-center">
                Uploading Excel and attachments securely. Please wait.
              </p>
            </div>
          )}

          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-500 px-6 py-5 flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                🧾 Advance Settlement
              </h1>
              <p className="text-green-100 text-sm mt-0.5">
                Automated GL validation mapped templates
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={refreshOSBalance}
                disabled={osBalanceLoading}
                className="bg-green-700/50 text-white text-sm font-semibold px-3 py-1.5 rounded-full hover:bg-green-700 transition shadow-sm border border-green-500/30 disabled:opacity-60 flex items-center gap-1.5"
                title="Refresh OS Balance from server"
              >
                {osBalanceLoading ? (
                  <span className="inline-block w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : '🔄'}
                Refresh
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
                <p className="text-gray-600 text-sm">
                  Your advance settlement bundle and receipts have been routed successfully for approval.
                </p>

                <div className="inline-block bg-green-50 border border-green-200 rounded-xl px-6 py-3 shadow-inner">
                  <p className="text-xs text-gray-500 mb-1">Your Settlement ID</p>
                  <p className="text-lg font-bold text-green-700 tracking-wider font-mono">
                    {submitResult.settlementId}
                  </p>
                </div>

                {submitResult.expenseItemsCount > 0 && (
                  <p className="text-xs text-gray-500">
                    {submitResult.expenseItemsCount} expense item(s) uploaded
                  </p>
                )}

                <div className="flex gap-3 justify-center mt-4 flex-wrap">
                  <button
                    onClick={handleSubmitAnother}
                    className="bg-green-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-green-700 transition shadow-sm hover:shadow active:scale-[0.98]"
                  >
                    Submit Another
                  </button>
                  <NavLink to={mySettlementsPath}>
                    <button className="bg-white border border-green-300 text-green-700 px-5 py-2 rounded-full text-sm font-semibold hover:bg-green-50 transition shadow-sm hover:shadow active:scale-[0.98]">
                      View My Settlements
                    </button>
                  </NavLink>
                </div>
              </div>
            ) : (
              // ── Form State ──────────────────────────────────────────────────
              <>
                {/* Error Banner — only for submit errors and local validation, NOT OS balance 404 */}
                {(localError || submitError) && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg flex items-start gap-2 mb-5">
                    <span>⚠️</span>
                    <span>{localError || submitError}</span>
                  </div>
                )}

                {/* Guidelines + Download Template */}
                <div className="mb-5 flex justify-between items-end flex-wrap gap-4">
                  <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex-1 shadow-sm">
                    <h3 className="font-bold text-blue-800 text-sm mb-2 flex items-center gap-1">
                      📋 System Guidelines
                    </h3>
                    <ul className="text-xs text-blue-700 space-y-1.5 ml-1">
                      <li className="flex items-start gap-1.5">
                        <span className="mt-0.5">•</span>
                        <span>Click <strong>Download Template</strong> to get the formatted Excel file.</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="mt-0.5">•</span>
                        <span>Use ONLY the dropdowns in the Excel file for &quot;Expense Head&quot;.</span>
                      </li>
                      <li className="flex items-start gap-1.5 font-medium text-blue-800">
                        <span className="mt-0.5">💰</span>
                        <span>
                          Available O/S Balance:&nbsp;
                          {osBalanceLoading
                            ? <span className="inline-block w-16 h-4 bg-blue-200 rounded animate-pulse align-middle" />
                            : <strong>₹{Number(osBalance).toFixed(2)}</strong>
                          }
                        </span>
                      </li>
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={exportTemplate}
                    disabled={templateLoading}
                    className="bg-green-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-700 shadow flex items-center gap-2 transition active:scale-[0.98] disabled:opacity-60 shrink-0"
                  >
                    {templateLoading ? (
                      <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    ) : '📥'}
                    Download Template
                  </button>
                </div>

                {/* Employee Info (from Redux — no localStorage) */}
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mb-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">
                      Employee Name
                    </label>
                    <div className="text-sm font-medium text-gray-800 bg-white px-3 py-2 rounded-md border border-gray-200 shadow-sm truncate">
                      {empName || '—'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">
                      Employee ID
                    </label>
                    <div className="text-sm font-medium text-gray-800 bg-white px-3 py-2 rounded-md border border-gray-200 shadow-sm">
                      {empId || '—'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">
                      O/S Balance
                    </label>
                    <div className="text-sm font-bold text-green-700 bg-green-50 px-3 py-2 rounded-md border border-green-200 shadow-sm flex items-center gap-1">
                      {osBalanceLoading ? (
                        <span className="inline-block w-16 h-4 bg-green-200 rounded animate-pulse" />
                      ) : (
                        `₹${Number(osBalance).toFixed(2)}`
                      )}
                    </div>
                  </div>
                </div>

                {/* Recent Transactions (if available from OS balance response) */}
                {osBalanceData?.recentTransactions?.length > 0 && (
                  <div className="mb-5">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Recent Transactions
                    </h4>
                    <div className="overflow-x-auto rounded-lg border border-gray-100">
                      <table className="min-w-full text-xs">
                        <thead className="bg-gray-50 text-gray-600">
                          <tr>
                            <th className="p-2 text-left font-semibold">Date</th>
                            <th className="p-2 text-left font-semibold">Voucher</th>
                            <th className="p-2 text-left font-semibold">Type</th>
                            <th className="p-2 text-right font-semibold">Debit (₹)</th>
                            <th className="p-2 text-right font-semibold">Credit (₹)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {osBalanceData.recentTransactions.slice(0, 3).map((txn, i) => (
                            <tr key={i} className="bg-white hover:bg-gray-50 transition">
                              <td className="p-2 text-gray-700">{txn.date}</td>
                              <td className="p-2 text-gray-600 font-mono">{txn.voucherNo}</td>
                              <td className="p-2 text-gray-600">{txn.type}</td>
                              <td className="p-2 text-right text-red-600">{Number(txn.debit).toFixed(2)}</td>
                              <td className="p-2 text-right text-green-600">{Number(txn.credit).toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* File Upload Form */}
                <div className="pt-2 border-t border-gray-100">
                  <ExpenseUploadForm
                    onSubmit={handleSubmitSettlement}
                    onError={(msg) => setLocalError(msg)}
                    isSubmitting={isSubmitting}
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

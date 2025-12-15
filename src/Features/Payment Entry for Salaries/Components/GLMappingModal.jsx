// /* eslint-disable no-unused-vars */
// import React, { useState, useEffect, useMemo } from 'react'
// import { X, CheckCircle } from 'lucide-react'
// import { FaDownload, FaSave, FaSearch } from 'react-icons/fa'

// // GL Master Data - Same as your document
// const GL_ACCOUNTS = {
//   expense: [
//     { code: 'X2001001001', name: 'SALARIES & WAGES', type: 'Expense' },
//     { code: 'X2001001002', name: 'EMPLOYER PF CONTRIBUTION', type: 'Expense' },
//     { code: 'X2001001003', name: 'EMPLOYER ESIC CONTRIBUTION', type: 'Expense' },
//     { code: 'X2001001004', name: 'EMPLOYER LWF CONTRIBUTION', type: 'Expense' },
//     { code: 'X2001001005', name: 'LEAVE PROVISION EXPENSE', type: 'Expense' },
//     { code: 'X2001001006', name: 'BONUS PROVISION EXPENSE', type: 'Expense' },
//     { code: 'X2001001007', name: 'GRATUITY PROVISION EXPENSE', type: 'Expense' },
//   ],
//   liability: [
//     { code: 'L2001003', name: 'SALARY PAYABLE', type: 'Liability' },
//     { code: 'L2001004', name: 'PF PAYABLE - EMPLOYEE SHARE', type: 'Liability' },
//     { code: 'L2001005', name: 'PF PAYABLE - EMPLOYER SHARE', type: 'Liability' },
//     { code: 'L2001006', name: 'ESIC PAYABLE - EMPLOYEE SHARE', type: 'Liability' },
//     { code: 'L2001007', name: 'ESIC PAYABLE - EMPLOYER SHARE', type: 'Liability' },
//     { code: 'L2001008', name: 'LWF PAYABLE - EMPLOYEE SHARE', type: 'Liability' },
//     { code: 'L2001009', name: 'LWF PAYABLE - EMPLOYER SHARE', type: 'Liability' },
//     { code: 'L2001010', name: 'PROFESSIONAL TAX PAYABLE', type: 'Liability' },
//     { code: 'L2001011', name: 'OTHER DEDUCTIONS PAYABLE', type: 'Liability' },
//     { code: 'L2001012', name: 'PROVISION FOR LEAVE ENCASHMENT', type: 'Liability' },
//     { code: 'L2001013', name: 'PROVISION FOR BONUS', type: 'Liability' },
//     { code: 'L2001014', name: 'PROVISION FOR GRATUITY', type: 'Liability' },
//   ],
// }

// // Default GL Mapping - Based on your document
// const DEFAULT_GL_MAPPING = {
//   BASIC: 'X2001001001',
//   DA: 'X2001001001',
//   HRA: 'X2001001001',
//   CONVEYANCE: 'X2001001001',
//   'WASHING ALLOWANCE': 'X2001001001',
//   'OTHER ALLOWANCE': 'X2001001001',
//   'LEAVE WITH WAGES': 'X2001001001',
//   CCA: 'X2001001001',
//   'EDUCATIONAL ALLOWANCE': 'X2001001001',
//   'MEDICAL ALLOWANCE': 'X2001001001',
//   'OT AMOUNT': 'X2001001001',
//   'SPL ALLOWANCE': 'X2001001001',
//   REIMBURSEMENT: 'X2001001001',
//   BONUS: 'X2001001001',
//   MEAL: 'X2001001001',
//   'SITE ALLOWANCE': 'X2001001001',
//   CONY: 'X2001001001',
//   'PERFORMANCE ALLOWANCE': 'X2001001001',
//   'CASH RISK ALLOWANCE': 'X2001001001',
//   INCENTIVE: 'X2001001001',
//   FOOD: 'X2001001001',
//   'METRO CITY ALLOWANCE': 'X2001001001',
//   STIPEND: 'X2001001001',
//   'PF COMPANY': 'X2001001002',
//   'ESIC COMPANY': 'X2001001003',
//   'LWF COMPANY': 'X2001001004',
//   LEAVE_PROVISION: 'X2001001005',
//   BONUS_PROVISION: 'X2001001006',
//   GRATUITY_PROVISION: 'X2001001007',
//   NETPAYABLE: 'L2001003',
//   PF: 'L2001004',
//   ESIC: 'L2001006',
//   PT: 'L2001010',
//   LWF: 'L2001008',
//   UNIFORM: 'L2001011',
//   ADVANCE: 'L2001011',
//   'OTHER DEDUCTION': 'L2001011',
//   'MESS DEDUCTION': 'L2001011',
//   'UNIFORM DEDUCTION': 'L2001011',
//   'HRA DEDUCTION': 'L2001011',
//   'STAFF WELFARE FUND': 'L2001011',
//   'BACKGROUND VERIFICATION': 'L2001011',
// }

// // Helper function to extract all salary heads from batch data
// const extractSalaryHeadsFromBatches = (batches) => {
//   if (!batches || !Array.isArray(batches) || batches.length === 0) {
//     return []
//   }

//   const allHeads = new Set()

//   batches.forEach((batch) => {
//     if (batch?.employeeDetails && Array.isArray(batch.employeeDetails)) {
//       batch.employeeDetails.forEach((employee) => {
//         if (employee && typeof employee === 'object') {
//           Object.keys(employee).forEach((key) => {
//             if (key && typeof key === 'string') {
//               allHeads.add(key)
//             }
//           })
//         }
//       })
//     }
//   })

//   return Array.from(allHeads)
// }

// const filterGLRequiredHeads = (allHeads) => {
//   if (!Array.isArray(allHeads)) {
//     console.warn('allHeads is not an array:', allHeads)
//     return []
//   }

//   const nonGLHeads = [
//     'MONTHATTENDANCEID',
//     'BRANCHNAME',
//     'CLIENTGROUPCODE',
//     'CLIENTGROUPNAME',
//     'SITECODE',
//     'SITENAME',
//     'STATENAME',
//     'EMPOLDCODE',
//     'EMPMASTERID',
//     'EMPCODE',
//     'FULLNAME',
//     'DOJ',
//     'DOB',
//     'GENDERNAME',
//     'DUTYMASTERID',
//     'DUTYNAME',
//     'GROUPMASTERID',
//     'GROUP',
//     'DESIGNATIONMASTERID',
//     'DESIGNATIONNAME',
//     'PF NO',
//     'ESIC NO',
//     'UAN NO',
//     'SALARY STATUS',
//     'AADHAR CARD',
//     'PAYMENTMODENAME',
//     'BANK NAME',
//     'BANK NAME AS PER EMPLOYEE',
//     'BANK BRANCH NAME AS PER EMPLOYEE',
//     'IFS CODE AS PER EMPLOYEE',
//     'BANK ACCOUNT NO AS PER EMPLOYEE',
//     'BANK NAME AS PER PAYMENT',
//     'BANK BRANCH NAME AS PER PAYMENT',
//     'IFS CODE AS PER PAYMENT',
//     'BANK ACCOUNT NO AS PER PAYMENT',
//     'NORMALDAYS',
//     'WEEKLYOFF',
//     'OTHOURS',
//     'SPLOTHOURS',
//     'PL_AVAILED',
//     'CL_AVAILED',
//     'SL_AVAILED',
//     'SITEDIVISIONDAYS',
//     'PL',
//     'CL',
//     'SL',
//     'FIXED_BASIC',
//     'FIXED_DA',
//     'FIXED_HRA',
//     'FIXED_CONVEYANCE',
//     'FIXED_WASHING ALLOWANCE',
//     'FIXED_OTHER ALLOWANCE',
//     'FIXED_LEAVE WITH WAGES',
//     'FIXED_CCA',
//     'FIXED_EDUCATIONAL ALLOWANCE',
//     'FIXED_MEDICAL ALLOWANCE',
//     'FIXED_SPL ALLOWANCE',
//     'FIXED_BONUS',
//     'FIXED_MEAL',
//     'FIXED_SITE ALLOWANCE',
//     'FIXED_PERFORMANCE ALLOWANCE',
//     'FIXED_FOOD',
//     'FIXED_METRO CITY ALLOWANCE',
//     'FIXED_STIPEND',
//     'FIXEDGROSS',
//     'PF WAGES',
//     'ESI WAGES',
//     'GROSS AMT',
//     'TOTALDEDUCTION',
//     'CTC',
//     'DEBIT AMT',
//     'DEBIT BANK A/C NO',
//   ]

//   const nonGLSet = new Set(nonGLHeads)

//   return allHeads.filter((head) => !nonGLSet.has(head) && DEFAULT_GL_MAPPING[head] !== undefined)
// }

// const calculateHeadAmounts = (batches, glHeads) => {
//   const amounts = {}
//   if (!Array.isArray(glHeads)) return amounts

//   // helper to safely parse numeric-like values: strips commas, handles "" -> 0
//   const parseNumberSafe = (val) => {
//     if (val === null || val === undefined) return 0
//     if (typeof val === 'number') return val
//     if (typeof val === 'string') {
//       const cleaned = val.replace(/,/g, '').trim()
//       if (cleaned === '') return 0
//       const n = Number(cleaned)
//       return Number.isFinite(n) ? n : 0
//     }
//     // fallback for other types
//     const n = Number(val)
//     return Number.isFinite(n) ? n : 0
//   }

//   glHeads.forEach((head) => {
//     amounts[head] = 0
//   })

//   batches.forEach((batch) => {
//     if (!batch || !Array.isArray(batch.employeeDetails)) return
//     batch.employeeDetails.forEach((employee) => {
//       if (!employee || typeof employee !== 'object') return
//       Object.keys(amounts).forEach((head) => {
//         const raw = employee[head]
//         const v = parseNumberSafe(raw)
//         amounts[head] += v
//       })
//     })
//   })

//   // Round to 2 decimals to avoid floating point drift
//   Object.keys(amounts).forEach((h) => {
//     amounts[h] = Math.round((amounts[h] + Number.EPSILON) * 100) / 100
//   })

//   return amounts
// }

// export default function GLMappingModal({
//   isOpen,
//   onClose,
//   onApprove,
//   onSave,
//   batchData,
//   approvedBatches = [],
// }) {
//   const [glMapping, setGlMapping] = useState({})
//   const [searchTerm, setSearchTerm] = useState('')
//   const [activeTab, setActiveTab] = useState('expense')
//   const [validationErrors, setValidationErrors] = useState([])
//   const [isSaving, setIsSaving] = useState(false)
//   const [justApprovedIds, setJustApprovedIds] = useState([])

//   const batches = useMemo(() => {
//     if (approvedBatches?.length > 0) return approvedBatches
//     if (batchData) return [batchData]
//     return []
//   }, [batchData, approvedBatches])

//   const allHeads = useMemo(() => {
//     return extractSalaryHeadsFromBatches(batches)
//   }, [batches])

//   const glRequiredHeads = useMemo(() => {
//     return filterGLRequiredHeads(allHeads)
//   }, [allHeads])

//   const headAmounts = useMemo(() => {
//     return calculateHeadAmounts(batches, glRequiredHeads)
//   }, [batches, glRequiredHeads])

//   const expenseHeads = useMemo(() => {
//     const expenseGLs = GL_ACCOUNTS.expense.map((acc) => acc.code)
//     return glRequiredHeads.filter((head) => {
//       const def = DEFAULT_GL_MAPPING[head]
//       if (!def) return false
//       // def can be string (single mapping) or object { debit, credit } (dual mapping)
//       if (typeof def === 'string') {
//         return expenseGLs.includes(def) && headAmounts[head] > 0
//       }
//       // object mapping: include if debit exists and amount > 0
//       return def.debit && expenseGLs.includes(def.debit) && headAmounts[head] > 0
//     })
//   }, [glRequiredHeads, headAmounts])

//   const liabilityHeads = useMemo(() => {
//     const liabilityGLs = GL_ACCOUNTS.liability.map((acc) => acc.code)
//     return glRequiredHeads.filter((head) => {
//       const def = DEFAULT_GL_MAPPING[head]
//       if (!def) return false
//       if (typeof def === 'string') {
//         return liabilityGLs.includes(def) && headAmounts[head] > 0
//       }
//       // object mapping: include if credit exists and amount > 0
//       return def.credit && liabilityGLs.includes(def.credit) && headAmounts[head] > 0
//     })
//   }, [glRequiredHeads, headAmounts])

//   useEffect(() => {
//     if (isOpen && glRequiredHeads.length > 0) {
//       const initialMapping = {}
//       glRequiredHeads.forEach((head) => {
//         initialMapping[head] = DEFAULT_GL_MAPPING[head] || ''
//       })
//       setGlMapping(initialMapping)
//       setValidationErrors([])
//     }
//   }, [isOpen, glRequiredHeads])

//   const handleGLChange = (head, glCode) => {
//     setGlMapping((prev) => ({
//       ...prev,
//       [head]: glCode,
//     }))
//   }

//   const getGLDetails = (glCode) => {
//     const allAccounts = [...GL_ACCOUNTS.expense, ...GL_ACCOUNTS.liability]
//     return allAccounts.find((acc) => acc.code === glCode)
//   }

//   const validateMapping = () => {
//     const errors = []
//     const allHeadsWithAmount = [...expenseHeads, ...liabilityHeads]

//     allHeadsWithAmount.forEach((head) => {
//       if (!glMapping[head]) {
//         errors.push(`${head} is not mapped to any GL account`)
//       }
//     })

//     // Calculate debit and credit totals correctly
//     const journalEntries = generateJournalEntries()
//     const totalDebit = journalEntries.summary.totalDebit
//     const totalCredit = journalEntries.summary.totalCredit

//     if (Math.abs(totalDebit - totalCredit) > 1) {
//       errors.push(
//         `Debit (₹${totalDebit.toLocaleString('en-IN')}) ≠ Credit (₹${totalCredit.toLocaleString('en-IN')})`
//       )
//     }

//     setValidationErrors(errors)
//     return errors.length === 0
//   }

//   const handleSaveMapping = () => {
//     if (!validateMapping()) {
//       return
//     }

//     setIsSaving(true)

//     const journalEntries = generateJournalEntries()

//     const savedData = {
//       glMapping,
//       headAmounts,
//       journalEntries,
//       batches: batches.map((b) => ({ id: b.id, payrollPeriod: b.payrollPeriod })),
//       timestamp: new Date().toISOString(),
//     }

//     const existingMappings = JSON.parse(localStorage.getItem('glMappings') || '[]')
//     existingMappings.push(savedData)
//     localStorage.setItem('glMappings', JSON.stringify(existingMappings))

//     const allPayments = JSON.parse(localStorage.getItem('salaryPayments') || '[]')
//     const updatedPayments = allPayments.map((payment) => {
//       const batchId = payment.id
//       if (batches.some((b) => b.id === batchId)) {
//         return {
//           ...payment,
//           status: 'GL Mapped',
//           glMappedAt: new Date().toISOString(),
//           glMapping: glMapping,
//           journalEntries: journalEntries,
//           history: [
//             ...(payment.history || []),
//             {
//               action: 'gl_mapped',
//               by: JSON.parse(localStorage.getItem('user'))?.username || 'ae',
//               date: new Date().toISOString(),
//               comments: 'GL accounts mapped for accounting entry',
//             },
//           ],
//         }
//       }
//       return payment
//     })

//     localStorage.setItem('salaryPayments', JSON.stringify(updatedPayments))

//     setTimeout(() => {
//       setIsSaving(false)
//       if (typeof onSave === 'function') {
//         onSave()
//       } else {
//         onClose()
//       }
//       alert('GL Mapping saved successfully! Journal entries generated.')
//     }, 1000)
//   }

//   // Replace your existing generateJournalEntries function with this implementation.
//   // This computes all entries from headAmounts and uses Salary Payable (L2001003)
//   // as the balancing line so the JV is always balanced (subject to small rounding tolerance).

//   const generateJournalEntries = () => {
//     const entries = {
//       debit: [],
//       credit: [],
//       summary: { totalDebit: 0, totalCredit: 0, balanced: false },
//     }
//     const glGroups = {}

//     const addGroupAmount = (glCode, glName, type, head, amount) => {
//       if (!glGroups[glCode]) {
//         glGroups[glCode] = {
//           glCode,
//           glName: glName || glCode,
//           type: type || 'Unknown',
//           amount: 0,
//           heads: [],
//         }
//       }
//       glGroups[glCode].amount += amount
//       glGroups[glCode].heads.push(`${head}: ₹${amount.toLocaleString('en-IN')}`)
//     }

//     const addEntry = (side, glCode, head, amount) => {
//       if (!glCode || amount <= 0) return
//       const glDetails = getGLDetails(glCode) || {
//         code: glCode,
//         name: glCode,
//         type: side === 'debit' ? 'Expense' : 'Liability',
//       }
//       const item = { glCode, glName: glDetails.name || glCode, head, amount }
//       entries[side].push(item)
//       addGroupAmount(glCode, glDetails.name, glDetails.type, head, amount)
//     }

//     // Iterate all relevant heads and generate entries according to DEFAULT_GL_MAPPING
//     glRequiredHeads.forEach((head) => {
//       const amount = headAmounts[head] || 0
//       if (amount <= 0) return

//       const mapping = DEFAULT_GL_MAPPING[head]

//       if (!mapping) {
//         // unmapped head: skip (or you could add to a suspense GL) — leaving skip to avoid silent duplicates
//         return
//       }

//       if (typeof mapping === 'string') {
//         // single mapping: decide side by GL_ACCOUNTS membership
//         const isExpense = GL_ACCOUNTS.expense.some((a) => a.code === mapping)
//         const isLiability = GL_ACCOUNTS.liability.some((a) => a.code === mapping)
//         if (isExpense) addEntry('debit', mapping, head, amount)
//         else if (isLiability) addEntry('credit', mapping, head, amount)
//         else addEntry('debit', mapping, head, amount) // fallback: treat as expense
//       } else if (typeof mapping === 'object') {
//         // dual mapping: mapping.debit and mapping.credit both used
//         if (mapping.debit) addEntry('debit', mapping.debit, head, amount)
//         if (mapping.credit) addEntry('credit', mapping.credit, `${head} (Liability)`, amount)
//       }
//     })

//     // At this point entries.debit and entries.credit contain all lines EXCEPT Salary Payable balancing line.
//     // Compute totals and then create a balancing Salary Payable (L2001003) credit so Debit == Credit.
//     const totalDebit = entries.debit.reduce((s, e) => s + e.amount, 0)
//     const totalCredit = entries.credit.reduce((s, e) => s + e.amount, 0)

//     // Compute diff: positive means debit > credit -> need a credit to balance
//     let diff = Math.round((totalDebit - totalCredit) * 100) / 100

//     // Optionally allow a tiny tolerance (auto-round). If you prefer strict blocking, set TOLERANCE = 0.
//     const TOLERANCE = 2.0 // rupees; change to 0 if you want no auto-adjust
//     const SALARY_PAYABLE_GL = 'L2001003'

//     if (Math.abs(diff) > 0) {
//       if (Math.abs(diff) <= TOLERANCE) {
//         // Insert rounding/ balancing entry to Salary Payable
//         if (diff > 0) {
//           // debit > credit => add a credit to Salary Payable of 'diff'
//           addEntry('credit', SALARY_PAYABLE_GL, 'Salary Payable (Balancing Entry)', diff)
//         } else {
//           // credit > debit => add a debit to Salary Payable of abs(diff)
//           addEntry('debit', SALARY_PAYABLE_GL, 'Salary Payable (Balancing Entry)', Math.abs(diff))
//         }
//         // recompute totals
//       } else {
//         // Difference bigger than tolerance: still include a balancing Salary Payable entry (so JV is balanced),
//         // but also mark summary.balanced=false so save can be blocked by validation if you want.
//         // We'll add balancing entry so journal files are always balanced for ERP import.
//         if (diff > 0) {
//           addEntry(
//             'credit',
//             SALARY_PAYABLE_GL,
//             'Salary Payable (Balancing Entry - Large Diff)',
//             diff
//           )
//         } else {
//           addEntry(
//             'debit',
//             SALARY_PAYABLE_GL,
//             'Salary Payable (Balancing Entry - Large Diff)',
//             Math.abs(diff)
//           )
//         }
//       }
//     }

//     // Final totals and summary
//     entries.summary.totalDebit = entries.debit.reduce((s, e) => s + e.amount, 0)
//     entries.summary.totalCredit = entries.credit.reduce((s, e) => s + e.amount, 0)
//     entries.summary.balanced =
//       Math.abs(entries.summary.totalDebit - entries.summary.totalCredit) < 0.01
//     entries.summary.glGroups = Object.values(glGroups)

//     return entries
//   }

//   const filteredExpenseHeads = expenseHeads.filter((head) =>
//     head.toLowerCase().includes(searchTerm.toLowerCase())
//   )

//   const filteredLiabilityHeads = liabilityHeads.filter((head) =>
//     head.toLowerCase().includes(searchTerm.toLowerCase())
//   )

//   const totalDebit = useMemo(() => {
//     const entries = generateJournalEntries()
//     return entries.summary.totalDebit
//   }, [expenseHeads, headAmounts, glMapping])

//   const totalCredit = useMemo(() => {
//     const entries = generateJournalEntries()
//     return entries.summary.totalCredit
//   }, [liabilityHeads, expenseHeads, headAmounts, glMapping])

//   if (!isOpen) return null

//   const handleApproveClick = () => {
//     if (batches.length === 0) {
//       alert('No batches to approve')
//       return
//     }
//     const ids = batches.map((b) => b.id)
//     if (typeof onApprove === 'function') {
//       onApprove(ids)
//       setJustApprovedIds(ids)
//     } else {
//       const allPayments = JSON.parse(localStorage.getItem('salaryPayments') || '[]')
//       const updatedPayments = allPayments.map((payment) => {
//         if (ids.includes(payment.id)) {
//           return {
//             ...payment,
//             status: 'Approved',
//             history: [
//               ...(payment.history || []),
//               {
//                 action: 'approved',
//                 by: JSON.parse(localStorage.getItem('user'))?.username || 'ae',
//                 date: new Date().toISOString(),
//                 comments: 'Approved via GL Modal (fallback)',
//               },
//             ],
//           }
//         }
//         return payment
//       })
//       localStorage.setItem('salaryPayments', JSON.stringify(updatedPayments))
//       setJustApprovedIds(ids)
//     }
//     alert(`${batches.length} batch(es) approved. You can now save GL mapping.`)
//   }

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg shadow-2xl w-full max-w-[95vw] max-h-[98vh] flex flex-col">
//         <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 rounded-t-lg">
//           <div className="flex justify-between items-start">
//             <div>
//               <h2 className="text-lg font-semibold mb-1">General Ledger Mapping</h2>
//               <div className="text-blue-100 text-xs">
//                 {batches.length === 1 ? (
//                   <p className="text-xs">
//                     Batch: {batches[0].id} • {batches[0].payrollPeriod}
//                   </p>
//                 ) : (
//                   <p className="text-xs">
//                     {batches.length} Approved Batches •{' '}
//                     {batches.reduce((acc, b) => acc + (b.employeeDetails?.length || 0), 0)}{' '}
//                     Employees
//                   </p>
//                 )}
//               </div>
//             </div>
//             <button
//               onClick={onClose}
//               className="text-white hover:bg-blue-800 rounded-full p-1 transition-colors"
//               aria-label="Close GL mapping modal"
//             >
//               <X size={20} />
//             </button>
//           </div>
//         </div>

//         <div className="p-3 border-b bg-gray-50">
//           <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
//             <div className="relative flex-1 w-full sm:w-auto">
//               <FaSearch
//                 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
//                 size={16}
//               />
//               <input
//                 type="text"
//                 placeholder="Search salary heads..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>
//             <div className="flex gap-2 w-full sm:w-auto">
//               <button
//                 onClick={() => setActiveTab('expense')}
//                 className={`flex-1 sm:flex-none px-3 py-1.5 rounded-md font-medium text-sm transition-colors ${
//                   activeTab === 'expense'
//                     ? 'bg-blue-600 text-white'
//                     : 'bg-white text-gray-700 hover:bg-gray-100'
//                 }`}
//               >
//                 Debit Entries ({expenseHeads.length})
//               </button>
//               <button
//                 onClick={() => setActiveTab('liability')}
//                 className={`flex-1 sm:flex-none px-3 py-1.5 rounded-md font-medium text-sm transition-colors ${
//                   activeTab === 'liability'
//                     ? 'bg-blue-600 text-white'
//                     : 'bg-white text-gray-700 hover:bg-gray-100'
//                 }`}
//               >
//                 Credit Entries ({liabilityHeads.length})
//               </button>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
//             <div className="bg-green-50 border border-green-200 rounded-md p-2">
//               <p className="text-[11px] text-green-600 font-medium mb-0.5">Total Debit (Expense)</p>
//               <p className="text-lg font-bold text-green-700">
//                 ₹{totalDebit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
//               </p>
//             </div>
//             <div className="bg-orange-50 border border-orange-200 rounded-md p-2">
//               <p className="text-[11px] text-orange-600 font-medium mb-0.5">
//                 Total Credit (Liability)
//               </p>
//               <p className="text-lg font-bold text-orange-700">
//                 ₹{totalCredit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
//               </p>
//             </div>
//             <div
//               className={`border rounded-md p-2 ${
//                 Math.abs(totalDebit - totalCredit) < 1
//                   ? 'bg-green-50 border-green-200'
//                   : 'bg-red-50 border-red-200'
//               }`}
//             >
//               <p className="text-[11px] font-medium mb-0.5">Balance Status</p>
//               <p
//                 className={`text-lg font-bold ${Math.abs(totalDebit - totalCredit) < 1 ? 'text-green-700' : 'text-red-700'}`}
//               >
//                 {Math.abs(totalDebit - totalCredit) < 1 ? 'Balanced ✓' : 'Not Balanced'}
//               </p>
//               {Math.abs(totalDebit - totalCredit) >= 1 && (
//                 <p className="text-[11px] text-red-600 mt-1">
//                   Diff: ₹{Math.abs(totalDebit - totalCredit).toFixed(2)}
//                 </p>
//               )}
//             </div>
//           </div>
//         </div>

//         {validationErrors.length > 0 && (
//           <div className="mx-4 mt-3 bg-red-50 border border-red-200 rounded-md p-3 text-sm">
//             <div className="flex items-start gap-2">
//               <div className="flex-1">
//                 <h3 className="font-semibold text-red-800 mb-1">Validation Errors</h3>
//                 <ul className="text-sm text-red-700 space-y-1">
//                   {validationErrors.map((error, idx) => (
//                     <li key={idx}>• {error}</li>
//                   ))}
//                 </ul>
//               </div>
//             </div>
//           </div>
//         )}

//         <div className="flex-1 overflow-auto p-3">
//           <div className="mx-auto w-full max-w-2xl">
//             <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
//               <table className="w-full text-sm">
//                 <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
//                   <tr>
//                     <th className="text-left px-3 py-2 font-semibold text-gray-700 w-1/3 text-xs">
//                       Salary Head
//                     </th>
//                     <th className="text-right px-3 py-2 font-semibold text-gray-700 w-1/6 text-xs">
//                       Amount (₹)
//                     </th>
//                     <th className="text-left px-3 py-2 font-semibold text-gray-700 w-1/2 text-xs">
//                       GL Account Mapping
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   {activeTab === 'expense' &&
//                     filteredExpenseHeads.map((head, index) => {
//                       const amount = headAmounts[head] || 0
//                       const glDetails = getGLDetails(glMapping[head])

//                       return (
//                         <tr
//                           key={head}
//                           className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}
//                         >
//                           <td className="px-3 py-2 align-top">
//                             <div className="font-medium text-gray-900 text-sm">{head}</div>
//                             <div className="text-[11px] text-gray-500 mt-0.5">
//                               Debit • {DEFAULT_GL_MAPPING[head] ? 'Auto-mapped' : 'Manual required'}
//                             </div>
//                           </td>
//                           <td className="px-3 py-2 text-right align-top">
//                             <div className="font-bold text-green-600 text-sm">
//                               {amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
//                             </div>
//                           </td>
//                           <td className="px-3 py-2 align-top">
//                             <div className="flex flex-col gap-2">
//                               <select
//                                 value={glMapping[head] || ''}
//                                 onChange={(e) => handleGLChange(head, e.target.value)}
//                                 className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm bg-white"
//                               >
//                                 <option value="">Select GL Account</option>
//                                 <optgroup label="Expense Accounts (P&L)">
//                                   {GL_ACCOUNTS.expense.map((acc) => (
//                                     <option key={acc.code} value={acc.code}>
//                                       {acc.code} - {acc.name}
//                                     </option>
//                                   ))}
//                                 </optgroup>
//                                 <optgroup label="Liability Accounts (Balance Sheet)">
//                                   {GL_ACCOUNTS.liability.map((acc) => (
//                                     <option key={acc.code} value={acc.code}>
//                                       {acc.code} - {acc.name}
//                                     </option>
//                                   ))}
//                                 </optgroup>
//                               </select>
//                               {glDetails && (
//                                 <div className="flex items-center gap-2 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
//                                   <CheckCircle size={14} />
//                                   <span className="font-mono font-semibold">{glDetails.code}</span>
//                                   <span>•</span>
//                                   <span className="truncate">{glDetails.name}</span>
//                                   <span className="ml-auto bg-blue-100 px-2 py-0.5 rounded font-medium text-[11px]">
//                                     {glDetails.type}
//                                   </span>
//                                 </div>
//                               )}
//                             </div>
//                           </td>
//                         </tr>
//                       )
//                     })}

//                   {activeTab === 'liability' &&
//                     filteredLiabilityHeads.map((head, index) => {
//                       const amount = headAmounts[head] || 0
//                       const glDetails = getGLDetails(glMapping[head])

//                       return (
//                         <tr
//                           key={head}
//                           className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}
//                         >
//                           <td className="px-3 py-2 align-top">
//                             <div className="font-medium text-gray-900 text-sm">{head}</div>
//                             <div className="text-[11px] text-gray-500 mt-0.5">
//                               Credit •{' '}
//                               {DEFAULT_GL_MAPPING[head] ? 'Auto-mapped' : 'Manual required'}
//                             </div>
//                           </td>
//                           <td className="px-3 py-2 text-right align-top">
//                             <div className="font-bold text-orange-600 text-sm">
//                               {amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
//                             </div>
//                           </td>
//                           <td className="px-3 py-2 align-top">
//                             <div className="flex flex-col gap-2">
//                               <select
//                                 value={glMapping[head] || ''}
//                                 onChange={(e) => handleGLChange(head, e.target.value)}
//                                 className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm bg-white"
//                               >
//                                 <option value="">Select GL Account</option>
//                                 <optgroup label="Expense Accounts">
//                                   {GL_ACCOUNTS.expense.map((acc) => (
//                                     <option key={acc.code} value={acc.code}>
//                                       {acc.code} - {acc.name}
//                                     </option>
//                                   ))}
//                                 </optgroup>
//                                 <optgroup label="Liability Accounts">
//                                   {GL_ACCOUNTS.liability.map((acc) => (
//                                     <option key={acc.code} value={acc.code}>
//                                       {acc.code} - {acc.name}
//                                     </option>
//                                   ))}
//                                 </optgroup>
//                               </select>
//                               {glDetails && (
//                                 <div className="flex items-center gap-2 text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded">
//                                   <CheckCircle size={14} />
//                                   <span className="font-mono font-semibold">{glDetails.code}</span>
//                                   <span>•</span>
//                                   <span className="truncate">{glDetails.name}</span>
//                                   <span className="ml-auto bg-orange-100 px-2 py-0.5 rounded font-medium text-[11px]">
//                                     {glDetails.type}
//                                   </span>
//                                 </div>
//                               )}
//                             </div>
//                           </td>
//                         </tr>
//                       )
//                     })}

//                   {activeTab === 'expense' && filteredExpenseHeads.length === 0 && (
//                     <tr>
//                       <td colSpan="3" className="p-6 text-center text-gray-500 text-sm">
//                         {searchTerm
//                           ? 'No matching expense heads found'
//                           : 'No expense heads requiring GL mapping'}
//                       </td>
//                     </tr>
//                   )}

//                   {activeTab === 'liability' && filteredLiabilityHeads.length === 0 && (
//                     <tr>
//                       <td colSpan="3" className="p-6 text-center text-gray-500 text-sm">
//                         {searchTerm
//                           ? 'No matching liability heads found'
//                           : 'No liability heads requiring GL mapping'}
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>

//         <div className="border-t bg-gray-50 p-3 rounded-b-lg">
//           <div className="flex flex-col sm:flex-row gap-2 justify-end">
//             <button
//               onClick={onClose}
//               className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors text-sm"
//             >
//               Cancel
//             </button>

//             <button
//               onClick={handleApproveClick}
//               disabled={batches.length === 0}
//               className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               Approve
//             </button>

//             <button
//               onClick={() => {
//                 const entries = generateJournalEntries()
//                 console.log('Journal Entries:', entries)
//                 alert('Journal entries generated. Check browser console for details.')
//               }}
//               className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm flex items-center gap-2"
//             >
//               <FaDownload size={14} />
//               Preview
//             </button>
//             <button
//               onClick={handleSaveMapping}
//               disabled={isSaving}
//               className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               <FaSave size={14} />
//               {isSaving ? 'Saving...' : 'Save'}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// import React, { useState, useEffect, useMemo } from 'react'
// import { X } from 'lucide-react'

// // GL Master Data - From your accounts
// const GL_ACCOUNTS = [
//   { code: 'L2002', name: 'SALARY', type: 'SUB_FOLDER', parentAccount: 'CURRENT LIABILITIES' },
//   { code: 'L2002001', name: 'SALARY PAYABLE', type: 'ACCOUNT', parentAccount: 'SALARY' },
//   {
//     code: 'X2001001002',
//     name: 'EMPLOYER PF CONTRIBUTION',
//     type: 'ACCOUNT',
//     parentAccount: 'BRANCH MANAGEMENT SALARY COST',
//   },
//   {
//     code: 'L2002002',
//     name: 'PF PAYABLE - EMPLOYER SHARE',
//     type: 'ACCOUNT',
//     parentAccount: 'SALARY',
//   },
//   {
//     code: 'X2001001003',
//     name: 'ESIC EMPLOYEER CONTRIBUTION',
//     type: 'ACCOUNT',
//     parentAccount: 'BRANCH MANAGEMENT SALARY COST',
//   },
//   {
//     code: 'L2002003',
//     name: 'ESIC PAYABLE - EMPLOYER SHARE',
//     type: 'ACCOUNT',
//     parentAccount: 'SALARY',
//   },
//   {
//     code: 'X2001001004',
//     name: 'EMPLOYER LWF CONTRIBUTION',
//     type: 'ACCOUNT',
//     parentAccount: 'BRANCH MANAGEMENT SALARY COST',
//   },
//   {
//     code: 'L2002004',
//     name: 'LWF PAYABLE - EMPLOYER SHARE',
//     type: 'ACCOUNT',
//     parentAccount: 'SALARY',
//   },
//   {
//     code: 'X2001001005',
//     name: 'LEAVE PROVISION EXPENSE',
//     type: 'ACCOUNT',
//     parentAccount: 'BRANCH MANAGEMENT SALARY COST',
//   },
//   {
//     code: 'L2002005',
//     name: 'PROVISION FOR LEAVE ENCASHMENT',
//     type: 'ACCOUNT',
//     parentAccount: 'SALARY',
//   },
//   {
//     code: 'X2001001006',
//     name: 'OTHER DEDUCTIONS',
//     type: 'ACCOUNT',
//     parentAccount: 'BRANCH MANAGEMENT SALARY COST',
//   },
//   {
//     code: 'L2002006',
//     name: 'PF PAYABLE - EMPLOYEE SHARE',
//     type: 'ACCOUNT',
//     parentAccount: 'SALARY',
//   },
//   {
//     code: 'L2002007',
//     name: 'ESIC PAYABLE - EMPLOYEE SHARE',
//     type: 'ACCOUNT',
//     parentAccount: 'SALARY',
//   },
//   {
//     code: 'L2002008',
//     name: 'LWF PAYABLE - EMPLOYEE SHARE',
//     type: 'ACCOUNT',
//     parentAccount: 'SALARY',
//   },
//   {
//     code: 'L2002009',
//     name: 'PT PAYABLE - EMPLOYEE SHARE',
//     type: 'ACCOUNT',
//     parentAccount: 'SALARY',
//   },
//   {
//     code: 'X2001001001',
//     name: 'Salary & Wages',
//     type: 'ACCOUNT',
//     parentAccount: 'BRANCH MANAGEMENT SALARY COST',
//   },
// ]

// // Helper function to extract all salary heads from batch data
// const extractSalaryHeadsFromBatches = (batches) => {
//   if (!batches || !Array.isArray(batches) || batches.length === 0) {
//     return []
//   }

//   const allHeads = new Set()

//   batches.forEach((batch) => {
//     if (batch?.employeeDetails && Array.isArray(batch.employeeDetails)) {
//       batch.employeeDetails.forEach((employee) => {
//         if (employee && typeof employee === 'object') {
//           Object.keys(employee).forEach((key) => {
//             if (key && typeof key === 'string') {
//               allHeads.add(key)
//             }
//           })
//         }
//       })
//     }
//   })

//   return Array.from(allHeads)
// }

// const filterGLRequiredHeads = (allHeads) => {
//   if (!Array.isArray(allHeads)) {
//     return []
//   }

//   const nonGLHeads = [
//     'MONTHATTENDANCEID',
//     'BRANCHNAME',
//     'CLIENTGROUPCODE',
//     'CLIENTGROUPNAME',
//     'SITECODE',
//     'SITENAME',
//     'STATENAME',
//     'EMPOLDCODE',
//     'EMPMASTERID',
//     'EMPCODE',
//     'FULLNAME',
//     'DOJ',
//     'DOB',
//     'GENDERNAME',
//     'DUTYMASTERID',
//     'DUTYNAME',
//     'GROUPMASTERID',
//     'GROUP',
//     'DESIGNATIONMASTERID',
//     'DESIGNATIONNAME',
//     'PF NO',
//     'ESIC NO',
//     'UAN NO',
//     'SALARY STATUS',
//     'AADHAR CARD',
//     'PAYMENTMODENAME',
//     'BANK NAME',
//     'BANK NAME AS PER EMPLOYEE',
//     'BANK BRANCH NAME AS PER EMPLOYEE',
//     'IFS CODE AS PER EMPLOYEE',
//     'BANK ACCOUNT NO AS PER EMPLOYEE',
//     'BANK NAME AS PER PAYMENT',
//     'BANK BRANCH NAME AS PER PAYMENT',
//     'IFS CODE AS PER PAYMENT',
//     'BANK ACCOUNT NO AS PER PAYMENT',
//     'NORMALDAYS',
//     'WEEKLYOFF',
//     'OTHOURS',
//     'SPLOTHOURS',
//     'PL_AVAILED',
//     'CL_AVAILED',
//     'SL_AVAILED',
//     'SITEDIVISIONDAYS',
//     'PL',
//     'CL',
//     'SL',
//     'FIXED_BASIC',
//     'FIXED_DA',
//     'FIXED_HRA',
//     'FIXED_CONVEYANCE',
//     'FIXED_WASHING ALLOWANCE',
//     'FIXED_OTHER ALLOWANCE',
//     'FIXED_LEAVE WITH WAGES',
//     'FIXED_CCA',
//     'FIXED_EDUCATIONAL ALLOWANCE',
//     'FIXED_MEDICAL ALLOWANCE',
//     'FIXED_SPL ALLOWANCE',
//     'FIXED_BONUS',
//     'FIXED_MEAL',
//     'FIXED_SITE ALLOWANCE',
//     'FIXED_PERFORMANCE ALLOWANCE',
//     'FIXED_FOOD',
//     'FIXED_METRO CITY ALLOWANCE',
//     'FIXED_STIPEND',
//     'FIXEDGROSS',
//     'PF WAGES',
//     'ESI WAGES',
//     'GROSS AMT',
//     'TOTALDEDUCTION',
//     'CTC',
//     'DEBIT AMT',
//     'DEBIT BANK A/C NO',
//     'NETPAYABLE',
//   ]

//   const nonGLSet = new Set(nonGLHeads)
//   return allHeads.filter((head) => !nonGLSet.has(head))
// }

// const calculateHeadAmounts = (batches, glHeads) => {
//   const amounts = {}
//   if (!Array.isArray(glHeads)) return amounts

//   const parseNumberSafe = (val) => {
//     if (val === null || val === undefined) return 0
//     if (typeof val === 'number') return val
//     if (typeof val === 'string') {
//       const cleaned = val.replace(/,/g, '').trim()
//       if (cleaned === '') return 0
//       const n = Number(cleaned)
//       return Number.isFinite(n) ? n : 0
//     }
//     const n = Number(val)
//     return Number.isFinite(n) ? n : 0
//   }

//   glHeads.forEach((head) => {
//     amounts[head] = 0
//   })

//   batches.forEach((batch) => {
//     if (!batch || !Array.isArray(batch.employeeDetails)) return
//     batch.employeeDetails.forEach((employee) => {
//       if (!employee || typeof employee !== 'object') return
//       Object.keys(amounts).forEach((head) => {
//         const raw = employee[head]
//         const v = parseNumberSafe(raw)
//         amounts[head] += v
//       })
//     })
//   })

//   Object.keys(amounts).forEach((h) => {
//     amounts[h] = Math.round((amounts[h] + Number.EPSILON) * 100) / 100
//   })

//   return amounts
// }

// export default function GLMappingModal({
//   isOpen,
//   onClose,
//   onApprove,
//   onSave,
//   batchData,
//   approvedBatches = [],
// }) {
//   const [glMapping, setGlMapping] = useState({})
//   const [validationErrors, setValidationErrors] = useState([])
//   const [isSaving, setIsSaving] = useState(false)

//   const batches = useMemo(() => {
//     if (approvedBatches?.length > 0) return approvedBatches
//     if (batchData) return [batchData]
//     return []
//   }, [batchData, approvedBatches])

//   const allHeads = useMemo(() => {
//     return extractSalaryHeadsFromBatches(batches)
//   }, [batches])

//   const glRequiredHeads = useMemo(() => {
//     return filterGLRequiredHeads(allHeads)
//   }, [allHeads])

//   const headAmounts = useMemo(() => {
//     return calculateHeadAmounts(batches, glRequiredHeads)
//   }, [batches, glRequiredHeads])

//   useEffect(() => {
//     if (isOpen && glRequiredHeads.length > 0) {
//       const initialMapping = {}
//       glRequiredHeads.forEach((head) => {
//         initialMapping[head] = { debit: '', credit: '' }
//       })
//       setGlMapping(initialMapping)
//       setValidationErrors([])
//     }
//   }, [isOpen, glRequiredHeads])

//   const handleGLChange = (head, type, value) => {
//     setGlMapping((prev) => ({
//       ...prev,
//       [head]: {
//         ...prev[head],
//         [type]: value,
//       },
//     }))
//   }

//   const getGLDetails = (glCode) => {
//     return GL_ACCOUNTS.find((acc) => acc.code === glCode)
//   }

//   const validateMapping = () => {
//     const errors = []

//     // Check if all heads with amounts have both debit and credit mappings
//     glRequiredHeads.forEach((head) => {
//       const amount = headAmounts[head] || 0
//       if (amount > 0) {
//         if (!glMapping[head]?.debit) {
//           errors.push(`${head}: Debit GL account not selected`)
//         }
//         if (!glMapping[head]?.credit) {
//           errors.push(`${head}: Credit GL account not selected`)
//         }
//       }
//     })

//     // Calculate totals
//     let totalDebit = 0
//     let totalCredit = 0

//     glRequiredHeads.forEach((head) => {
//       const amount = headAmounts[head] || 0
//       if (amount > 0 && glMapping[head]?.debit) {
//         totalDebit += amount
//       }
//       if (amount > 0 && glMapping[head]?.credit) {
//         totalCredit += amount
//       }
//     })

//     if (Math.abs(totalDebit - totalCredit) > 1) {
//       errors.push(
//         `Debit (₹${totalDebit.toLocaleString('en-IN')}) ≠ Credit (₹${totalCredit.toLocaleString('en-IN')})`
//       )
//     }

//     setValidationErrors(errors)
//     return errors.length === 0
//   }

//   const generateJournalEntries = () => {
//     const entries = {
//       debit: [],
//       credit: [],
//       summary: { totalDebit: 0, totalCredit: 0, balanced: false },
//     }

//     glRequiredHeads.forEach((head) => {
//       const amount = headAmounts[head] || 0
//       if (amount > 0) {
//         const debitGL = glMapping[head]?.debit
//         const creditGL = glMapping[head]?.credit

//         if (debitGL) {
//           const glDetails = getGLDetails(debitGL)
//           entries.debit.push({
//             glCode: debitGL,
//             glName: glDetails?.name || debitGL,
//             head,
//             amount,
//           })
//           entries.summary.totalDebit += amount
//         }

//         if (creditGL) {
//           const glDetails = getGLDetails(creditGL)
//           entries.credit.push({
//             glCode: creditGL,
//             glName: glDetails?.name || creditGL,
//             head,
//             amount,
//           })
//           entries.summary.totalCredit += amount
//         }
//       }
//     })

//     entries.summary.totalDebit =
//       Math.round((entries.summary.totalDebit + Number.EPSILON) * 100) / 100
//     entries.summary.totalCredit =
//       Math.round((entries.summary.totalCredit + Number.EPSILON) * 100) / 100
//     entries.summary.balanced =
//       Math.abs(entries.summary.totalDebit - entries.summary.totalCredit) < 0.01

//     return entries
//   }

//   const handleSaveMapping = () => {
//     if (!validateMapping()) {
//       alert('Please fix validation errors before saving')
//       return
//     }

//     setIsSaving(true)

//     const journalEntries = generateJournalEntries()

//     const savedData = {
//       glMapping,
//       headAmounts,
//       journalEntries,
//       batches: batches.map((b) => ({ id: b.id, payrollPeriod: b.payrollPeriod })),
//       timestamp: new Date().toISOString(),
//     }

//     const existingMappings = JSON.parse(localStorage.getItem('glMappings') || '[]')
//     existingMappings.push(savedData)
//     localStorage.setItem('glMappings', JSON.stringify(existingMappings))

//     const allPayments = JSON.parse(localStorage.getItem('salaryPayments') || '[]')
//     const updatedPayments = allPayments.map((payment) => {
//       const batchId = payment.id
//       if (batches.some((b) => b.id === batchId)) {
//         return {
//           ...payment,
//           status: 'GL Mapped',
//           glMappedAt: new Date().toISOString(),
//           glMapping: glMapping,
//           journalEntries: journalEntries,
//           history: [
//             ...(payment.history || []),
//             {
//               action: 'gl_mapped',
//               by: JSON.parse(localStorage.getItem('user'))?.username || 'ae',
//               date: new Date().toISOString(),
//               comments: 'GL accounts mapped manually for accounting entry',
//             },
//           ],
//         }
//       }
//       return payment
//     })

//     localStorage.setItem('salaryPayments', JSON.stringify(updatedPayments))

//     setTimeout(() => {
//       setIsSaving(false)
//       if (typeof onSave === 'function') {
//         onSave()
//       } else {
//         onClose()
//       }
//       alert('GL Mapping saved successfully! Journal entries generated.')
//     }, 500)
//   }

//   const handleApproveClick = () => {
//     if (batches.length === 0) {
//       alert('No batches to approve')
//       return
//     }
//     const ids = batches.map((b) => b.id)
//     if (typeof onApprove === 'function') {
//       onApprove(ids)
//     }
//     alert(`${batches.length} batch(es) approved. Please complete GL mapping and save.`)
//   }

//   const journalEntries = useMemo(
//     () => generateJournalEntries(),
//     [glMapping, headAmounts, glRequiredHeads]
//   )

//   if (!isOpen) return null

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
//       <div className="bg-white rounded-lg shadow-2xl w-full max-w-[98vw] max-h-[98vh] flex flex-col">
//         {/* Header */}
//         <div className="bg-blue-600 text-white p-3 sm:p-4 rounded-t-lg">
//           <div className="flex justify-between items-start">
//             <div>
//               <h2 className="text-lg sm:text-xl font-semibold mb-1">Manual GL Mapping</h2>
//               <div className="text-blue-100 text-xs sm:text-sm">
//                 {batches.length === 1 ? (
//                   <p>
//                     Batch: {batches[0].id} • {batches[0].payrollPeriod}
//                   </p>
//                 ) : (
//                   <p>
//                     {batches.length} Batches •{' '}
//                     {batches.reduce((acc, b) => acc + (b.employeeDetails?.length || 0), 0)}{' '}
//                     Employees
//                   </p>
//                 )}
//               </div>
//             </div>
//             <button
//               onClick={onClose}
//               className="text-white hover:bg-blue-700 rounded-full p-1"
//               aria-label="Close"
//             >
//               <X size={20} />
//             </button>
//           </div>
//         </div>

//         {/* Summary Cards */}
//         <div className="p-3 sm:p-4 border-b bg-gray-50">
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
//             <div className="bg-green-50 border border-green-200 rounded-md p-2 sm:p-3">
//               <p className="text-xs text-green-600 font-medium mb-1">Total Debit</p>
//               <p className="text-base sm:text-lg font-bold text-green-700">
//                 ₹
//                 {journalEntries.summary.totalDebit.toLocaleString('en-IN', {
//                   minimumFractionDigits: 2,
//                 })}
//               </p>
//             </div>
//             <div className="bg-orange-50 border border-orange-200 rounded-md p-2 sm:p-3">
//               <p className="text-xs text-orange-600 font-medium mb-1">Total Credit</p>
//               <p className="text-base sm:text-lg font-bold text-orange-700">
//                 ₹
//                 {journalEntries.summary.totalCredit.toLocaleString('en-IN', {
//                   minimumFractionDigits: 2,
//                 })}
//               </p>
//             </div>
//             <div
//               className={`border rounded-md p-2 sm:p-3 ${
//                 Math.abs(journalEntries.summary.totalDebit - journalEntries.summary.totalCredit) < 1
//                   ? 'bg-green-50 border-green-200'
//                   : 'bg-red-50 border-red-200'
//               }`}
//             >
//               <p className="text-xs font-medium mb-1">Balance</p>
//               <p
//                 className={`text-base sm:text-lg font-bold ${
//                   Math.abs(journalEntries.summary.totalDebit - journalEntries.summary.totalCredit) <
//                   1
//                     ? 'text-green-700'
//                     : 'text-red-700'
//                 }`}
//               >
//                 {Math.abs(journalEntries.summary.totalDebit - journalEntries.summary.totalCredit) <
//                 1
//                   ? 'Balanced ✓'
//                   : 'Not Balanced'}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Validation Errors */}
//         {validationErrors.length > 0 && (
//           <div className="mx-3 sm:mx-4 mt-3 bg-red-50 border border-red-200 rounded-md p-3">
//             <h3 className="font-semibold text-red-800 text-sm mb-2">Validation Errors:</h3>
//             <ul className="text-xs sm:text-sm text-red-700 space-y-1">
//               {validationErrors.map((error, idx) => (
//                 <li key={idx}>• {error}</li>
//               ))}
//             </ul>
//           </div>
//         )}

//         {/* Main Table */}
//         <div className="flex-1 overflow-auto p-3 sm:p-4">
//           <div className="overflow-x-auto">
//             <table className="w-full text-xs sm:text-sm border-collapse border border-gray-300">
//               <thead className="bg-gray-100 sticky top-0">
//                 <tr>
//                   <th className="border border-gray-300 p-2 text-left font-semibold min-w-[120px]">
//                     Salary Head
//                   </th>
//                   <th className="border border-gray-300 p-2 text-right font-semibold min-w-[100px]">
//                     Amount (₹)
//                   </th>
//                   <th className="border border-gray-300 p-2 text-center font-semibold min-w-[200px]">
//                     Debit (Expense)
//                   </th>
//                   <th className="border border-gray-300 p-2 text-center font-semibold min-w-[200px]">
//                     Credit (Liability)
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {glRequiredHeads.map((head, index) => {
//                   const amount = headAmounts[head] || 0
//                   const debitGL = glMapping[head]?.debit
//                   const creditGL = glMapping[head]?.credit
//                   const debitDetails = debitGL ? getGLDetails(debitGL) : null
//                   const creditDetails = creditGL ? getGLDetails(creditGL) : null

//                   return (
//                     <tr key={head} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
//                       <td className="border border-gray-300 p-2 font-medium">{head}</td>
//                       <td className="border border-gray-300 p-2 text-right font-semibold">
//                         {amount > 0
//                           ? `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
//                           : '-'}
//                       </td>
//                       <td className="border border-gray-300 p-2">
//                         <select
//                           value={debitGL || ''}
//                           onChange={(e) => handleGLChange(head, 'debit', e.target.value)}
//                           className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs sm:text-sm"
//                           disabled={amount <= 0}
//                         >
//                           <option value="">Select GL Code</option>
//                           {GL_ACCOUNTS.filter((acc) => acc.type === 'ACCOUNT').map((acc) => (
//                             <option key={acc.code} value={acc.code}>
//                               {acc.code} - {acc.name}
//                             </option>
//                           ))}
//                         </select>
//                         {debitDetails && (
//                           <div className="mt-1 text-xs text-gray-600 bg-blue-50 p-1 rounded">
//                             {debitDetails.code} - {debitDetails.name}
//                           </div>
//                         )}
//                       </td>
//                       <td className="border border-gray-300 p-2">
//                         <select
//                           value={creditGL || ''}
//                           onChange={(e) => handleGLChange(head, 'credit', e.target.value)}
//                           className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs sm:text-sm"
//                           disabled={amount <= 0}
//                         >
//                           <option value="">Select GL Code</option>
//                           {GL_ACCOUNTS.filter((acc) => acc.type === 'ACCOUNT').map((acc) => (
//                             <option key={acc.code} value={acc.code}>
//                               {acc.code} - {acc.name}
//                             </option>
//                           ))}
//                         </select>
//                         {creditDetails && (
//                           <div className="mt-1 text-xs text-gray-600 bg-orange-50 p-1 rounded">
//                             {creditDetails.code} - {creditDetails.name}
//                           </div>
//                         )}
//                       </td>
//                     </tr>
//                   )
//                 })}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Footer Actions */}
//         <div className="border-t bg-gray-50 p-3 sm:p-4 rounded-b-lg">
//           <div className="flex flex-col sm:flex-row gap-2 justify-end">
//             <button
//               onClick={onClose}
//               className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 text-sm"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleApproveClick}
//               disabled={batches.length === 0}
//               className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm disabled:opacity-50"
//             >
//               Approve
//             </button>
//             <button
//               onClick={handleSaveMapping}
//               disabled={isSaving}
//               className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm disabled:opacity-50"
//             >
//               {isSaving ? 'Saving...' : 'Save GL Mapping'}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

//Working

// import React, { useState, useEffect, useMemo } from 'react'
// import { X, Download, FileText } from 'lucide-react'

// // GL Master Data - From your accounts
// const GL_ACCOUNTS = [
//   { code: 'L2002', name: 'SALARY', type: 'SUB_FOLDER', parentAccount: 'CURRENT LIABILITIES' },
//   { code: 'L2002001', name: 'SALARY PAYABLE', type: 'ACCOUNT', parentAccount: 'SALARY' },
//   {
//     code: 'X2001001002',
//     name: 'EMPLOYER PF CONTRIBUTION',
//     type: 'ACCOUNT',
//     parentAccount: 'BRANCH MANAGEMENT SALARY COST',
//   },
//   {
//     code: 'L2002002',
//     name: 'PF PAYABLE - EMPLOYER SHARE',
//     type: 'ACCOUNT',
//     parentAccount: 'SALARY',
//   },
//   {
//     code: 'X2001001003',
//     name: 'ESIC EMPLOYEER CONTRIBUTION',
//     type: 'ACCOUNT',
//     parentAccount: 'BRANCH MANAGEMENT SALARY COST',
//   },
//   {
//     code: 'L2002003',
//     name: 'ESIC PAYABLE - EMPLOYER SHARE',
//     type: 'ACCOUNT',
//     parentAccount: 'SALARY',
//   },
//   {
//     code: 'X2001001004',
//     name: 'EMPLOYER LWF CONTRIBUTION',
//     type: 'ACCOUNT',
//     parentAccount: 'BRANCH MANAGEMENT SALARY COST',
//   },
//   {
//     code: 'L2002004',
//     name: 'LWF PAYABLE - EMPLOYER SHARE',
//     type: 'ACCOUNT',
//     parentAccount: 'SALARY',
//   },
//   {
//     code: 'X2001001005',
//     name: 'LEAVE PROVISION EXPENSE',
//     type: 'ACCOUNT',
//     parentAccount: 'BRANCH MANAGEMENT SALARY COST',
//   },
//   {
//     code: 'L2002005',
//     name: 'PROVISION FOR LEAVE ENCASHMENT',
//     type: 'ACCOUNT',
//     parentAccount: 'SALARY',
//   },
//   {
//     code: 'X2001001006',
//     name: 'OTHER DEDUCTIONS',
//     type: 'ACCOUNT',
//     parentAccount: 'BRANCH MANAGEMENT SALARY COST',
//   },
//   {
//     code: 'L2002006',
//     name: 'PF PAYABLE - EMPLOYEE SHARE',
//     type: 'ACCOUNT',
//     parentAccount: 'SALARY',
//   },
//   {
//     code: 'L2002007',
//     name: 'ESIC PAYABLE - EMPLOYEE SHARE',
//     type: 'ACCOUNT',
//     parentAccount: 'SALARY',
//   },
//   {
//     code: 'L2002008',
//     name: 'LWF PAYABLE - EMPLOYEE SHARE',
//     type: 'ACCOUNT',
//     parentAccount: 'SALARY',
//   },
//   {
//     code: 'L2002009',
//     name: 'PT PAYABLE - EMPLOYEE SHARE',
//     type: 'ACCOUNT',
//     parentAccount: 'SALARY',
//   },
//   {
//     code: 'X2001001001',
//     name: 'Salary & Wages',
//     type: 'ACCOUNT',
//     parentAccount: 'BRANCH MANAGEMENT SALARY COST',
//   },
// ]

// // JV Modal Component
// function JournalVoucherModal({ isOpen, onClose, journalData }) {
//   if (!isOpen) return null

//   const totalDebit = journalData.debit.reduce((sum, entry) => sum + entry.amount, 0)
//   const totalCredit = journalData.credit.reduce((sum, entry) => sum + entry.amount, 0)

//   const numberToWords = (num) => {
//     const ones = ['', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE']
//     const tens = [
//       '',
//       '',
//       'TWENTY',
//       'THIRTY',
//       'FORTY',
//       'FIFTY',
//       'SIXTY',
//       'SEVENTY',
//       'EIGHTY',
//       'NINETY',
//     ]
//     const teens = [
//       'TEN',
//       'ELEVEN',
//       'TWELVE',
//       'THIRTEEN',
//       'FOURTEEN',
//       'FIFTEEN',
//       'SIXTEEN',
//       'SEVENTEEN',
//       'EIGHTEEN',
//       'NINETEEN',
//     ]

//     if (num === 0) return 'ZERO'

//     const crores = Math.floor(num / 10000000)
//     const lakhs = Math.floor((num % 10000000) / 100000)
//     const thousands = Math.floor((num % 100000) / 1000)
//     const hundreds = Math.floor((num % 1000) / 100)
//     const remainder = num % 100

//     let words = ''

//     if (crores > 0) words += ones[crores] + ' CRORE '
//     if (lakhs > 0) {
//       if (lakhs < 10) words += ones[lakhs] + ' LAKH '
//       else if (lakhs < 20) words += teens[lakhs - 10] + ' LAKH '
//       else words += tens[Math.floor(lakhs / 10)] + ' ' + ones[lakhs % 10] + ' LAKH '
//     }
//     if (thousands > 0) {
//       if (thousands < 10) words += ones[thousands] + ' THOUSAND '
//       else if (thousands < 20) words += teens[thousands - 10] + ' THOUSAND '
//       else words += tens[Math.floor(thousands / 10)] + ' ' + ones[thousands % 10] + ' THOUSAND '
//     }
//     if (hundreds > 0) words += ones[hundreds] + ' HUNDRED '
//     if (remainder > 0) {
//       if (remainder < 10) words += ones[remainder]
//       else if (remainder < 20) words += teens[remainder - 10]
//       else words += tens[Math.floor(remainder / 10)] + ' ' + ones[remainder % 10]
//     }

//     return words.trim() + ' ONLY'
//   }

//   const handlePrint = () => {
//     window.print()
//   }

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60] p-4">
//       <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[95vh] flex flex-col">
//         {/* Header */}
//         <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center print:hidden">
//           <div className="flex items-center gap-2">
//             <FileText size={24} />
//             <h2 className="text-xl font-bold">Journal Voucher</h2>
//           </div>
//           <div className="flex gap-2">
//             <button
//               onClick={handlePrint}
//               className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded hover:bg-blue-50"
//             >
//               <Download size={18} />
//               <span className="hidden sm:inline">Print/Download</span>
//             </button>
//             <button onClick={onClose} className="text-white hover:bg-blue-700 rounded-full p-2">
//               <X size={24} />
//             </button>
//           </div>
//         </div>

//         {/* JV Content */}
//         <div className="flex-1 overflow-auto p-6">
//           <div className="max-w-3xl mx-auto bg-white border-2 border-gray-800 p-6">
//             {/* Company Header */}
//             <div className="text-center border-b-2 border-gray-800 pb-4 mb-4">
//               <h1 className="text-xl font-bold mb-2">I SMART FACITECH PRIVATE LIMITED</h1>
//               <p className="text-sm">
//                 317, 3RD FLOOR, A/2, NILGIRI, WADALA TRUCK TERMINAL,
//                 <br />
//                 NEAR WADALA RTO, MUMBAI - 400037
//               </p>
//               <p className="text-sm mt-2">
//                 <strong>GST No:</strong> 27AAKCC4528J1ZE || <strong>GST State:</strong> Maharashtra
//                 (27)
//               </p>
//             </div>

//             {/* Voucher Info */}
//             <div className="flex justify-between mb-4 border-b border-gray-400 pb-2">
//               <div>
//                 <h2 className="text-lg font-bold">Journal Voucher</h2>
//               </div>
//               <div className="text-right">
//                 <p className="text-sm">
//                   <strong>Voucher No.:</strong> JVF{journalData.voucherNo || '00010001/2526'}
//                 </p>
//                 <p className="text-sm">
//                   <strong>Voucher Date:</strong> {new Date().toLocaleDateString('en-GB')}
//                 </p>
//               </div>
//             </div>

//             {/* Journal Entries Table */}
//             <table className="w-full text-sm border-collapse mb-4">
//               <thead>
//                 <tr className="border-b-2 border-gray-800">
//                   <th className="text-left py-2 font-bold">Account Name</th>
//                   <th className="text-right py-2 font-bold pr-4 w-28">Debit</th>
//                   <th className="text-right py-2 font-bold w-28">Credit</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {/* Debit Entries */}
//                 {journalData.debit.map((entry, index) => (
//                   <tr key={`debit-${index}`} className="border-b border-gray-300">
//                     <td className="py-2">
//                       <div className="font-semibold">
//                         {entry.glName} ({entry.glCode})
//                       </div>
//                       <div className="text-xs text-gray-600 italic">
//                         {journalData.location || 'MUMBAI'} - {entry.head} for Month of{' '}
//                         {journalData.period ||
//                           new Date().toLocaleDateString('en-US', {
//                             month: 'long',
//                             year: 'numeric',
//                           })}
//                       </div>
//                     </td>
//                     <td className="text-right py-2 pr-4 font-semibold">
//                       {entry.amount.toLocaleString('en-IN', {
//                         minimumFractionDigits: 2,
//                         maximumFractionDigits: 2,
//                       })}
//                     </td>
//                     <td className="text-right py-2"></td>
//                   </tr>
//                 ))}

//                 {/* Credit Entries */}
//                 {journalData.credit.map((entry, index) => (
//                   <tr key={`credit-${index}`} className="border-b border-gray-300">
//                     <td className="py-2">
//                       <div className="font-semibold">
//                         {entry.glName} ({entry.glCode})
//                       </div>
//                       <div className="text-xs text-gray-600 italic">
//                         {journalData.location || 'MUMBAI'} - {entry.head} for Month of{' '}
//                         {journalData.period ||
//                           new Date().toLocaleDateString('en-US', {
//                             month: 'long',
//                             year: 'numeric',
//                           })}
//                       </div>
//                     </td>
//                     <td className="text-right py-2 pr-4"></td>
//                     <td className="text-right py-2 font-semibold">
//                       {entry.amount.toLocaleString('en-IN', {
//                         minimumFractionDigits: 2,
//                         maximumFractionDigits: 2,
//                       })}
//                     </td>
//                   </tr>
//                 ))}

//                 {/* Total Row */}
//                 <tr className="border-t-2 border-gray-800 font-bold">
//                   <td className="py-2"></td>
//                   <td className="text-right py-2 pr-4 text-base">
//                     {totalDebit.toLocaleString('en-IN', {
//                       minimumFractionDigits: 2,
//                       maximumFractionDigits: 2,
//                     })}
//                   </td>
//                   <td className="text-right py-2 text-base">
//                     {totalCredit.toLocaleString('en-IN', {
//                       minimumFractionDigits: 2,
//                       maximumFractionDigits: 2,
//                     })}
//                   </td>
//                 </tr>
//               </tbody>
//             </table>

//             {/* Amount in Words */}
//             <div className="border-t border-b border-gray-400 py-2 mb-4">
//               <p className="text-sm font-semibold">
//                 RUPEES {numberToWords(Math.round(totalDebit))}
//               </p>
//             </div>

//             {/* Signatures */}
//             <div className="flex justify-between mt-8 pt-4 border-t border-gray-400">
//               <div className="text-center">
//                 <div className="border-t border-gray-800 pt-2 mt-12 w-32">
//                   <p className="text-sm">Prepared By</p>
//                 </div>
//               </div>
//               <div className="text-center">
//                 <div className="border-t border-gray-800 pt-2 mt-12 w-32">
//                   <p className="text-sm">Checked By</p>
//                 </div>
//               </div>
//               <div className="text-center">
//                 <div className="border-t border-gray-800 pt-2 mt-12 w-32">
//                   <p className="text-sm">Authorised By</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="border-t bg-gray-50 p-4 rounded-b-lg flex justify-end print:hidden">
//           <button
//             onClick={onClose}
//             className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

// // Helper function to extract all salary heads from batch data
// const extractSalaryHeadsFromBatches = (batches) => {
//   if (!batches || !Array.isArray(batches) || batches.length === 0) {
//     return []
//   }

//   const allHeads = new Set()

//   batches.forEach((batch) => {
//     if (batch?.employeeDetails && Array.isArray(batch.employeeDetails)) {
//       batch.employeeDetails.forEach((employee) => {
//         if (employee && typeof employee === 'object') {
//           Object.keys(employee).forEach((key) => {
//             if (key && typeof key === 'string') {
//               allHeads.add(key)
//             }
//           })
//         }
//       })
//     }
//   })

//   return Array.from(allHeads)
// }

// const filterGLRequiredHeads = (allHeads) => {
//   if (!Array.isArray(allHeads)) {
//     return []
//   }

//   const nonGLHeads = [
//     'MONTHATTENDANCEID',
//     'BRANCHNAME',
//     'CLIENTGROUPCODE',
//     'CLIENTGROUPNAME',
//     'SITECODE',
//     'SITENAME',
//     'STATENAME',
//     'EMPOLDCODE',
//     'EMPMASTERID',
//     'EMPCODE',
//     'FULLNAME',
//     'DOJ',
//     'DOB',
//     'GENDERNAME',
//     'DUTYMASTERID',
//     'DUTYNAME',
//     'GROUPMASTERID',
//     'GROUP',
//     'DESIGNATIONMASTERID',
//     'DESIGNATIONNAME',
//     'PF NO',
//     'ESIC NO',
//     'UAN NO',
//     'SALARY STATUS',
//     'AADHAR CARD',
//     'PAYMENTMODENAME',
//     'BANK NAME',
//     'BANK NAME AS PER EMPLOYEE',
//     'BANK BRANCH NAME AS PER EMPLOYEE',
//     'IFS CODE AS PER EMPLOYEE',
//     'BANK ACCOUNT NO AS PER EMPLOYEE',
//     'BANK NAME AS PER PAYMENT',
//     'BANK BRANCH NAME AS PER PAYMENT',
//     'IFS CODE AS PER PAYMENT',
//     'BANK ACCOUNT NO AS PER PAYMENT',
//     'NORMALDAYS',
//     'WEEKLYOFF',
//     'OTHOURS',
//     'SPLOTHOURS',
//     'PL_AVAILED',
//     'CL_AVAILED',
//     'SL_AVAILED',
//     'SITEDIVISIONDAYS',
//     'PL',
//     'CL',
//     'SL',
//     'FIXED_BASIC',
//     'FIXED_DA',
//     'FIXED_HRA',
//     'FIXED_CONVEYANCE',
//     'FIXED_WASHING ALLOWANCE',
//     'FIXED_OTHER ALLOWANCE',
//     'FIXED_LEAVE WITH WAGES',
//     'FIXED_CCA',
//     'FIXED_EDUCATIONAL ALLOWANCE',
//     'FIXED_MEDICAL ALLOWANCE',
//     'FIXED_SPL ALLOWANCE',
//     'FIXED_BONUS',
//     'FIXED_MEAL',
//     'FIXED_SITE ALLOWANCE',
//     'FIXED_PERFORMANCE ALLOWANCE',
//     'FIXED_FOOD',
//     'FIXED_METRO CITY ALLOWANCE',
//     'FIXED_STIPEND',
//     'FIXEDGROSS',
//     'PF WAGES',
//     'ESI WAGES',
//     'GROSS AMT',
//     'TOTALDEDUCTION',
//     'CTC',
//     'DEBIT AMT',
//     'DEBIT BANK A/C NO',
//     'NETPAYABLE',
//   ]

//   const nonGLSet = new Set(nonGLHeads)
//   return allHeads.filter((head) => !nonGLSet.has(head))
// }

// const calculateHeadAmounts = (batches, glHeads) => {
//   const amounts = {}
//   if (!Array.isArray(glHeads)) return amounts

//   const parseNumberSafe = (val) => {
//     if (val === null || val === undefined) return 0
//     if (typeof val === 'number') return val
//     if (typeof val === 'string') {
//       const cleaned = val.replace(/,/g, '').trim()
//       if (cleaned === '') return 0
//       const n = Number(cleaned)
//       return Number.isFinite(n) ? n : 0
//     }
//     const n = Number(val)
//     return Number.isFinite(n) ? n : 0
//   }

//   glHeads.forEach((head) => {
//     amounts[head] = 0
//   })

//   batches.forEach((batch) => {
//     if (!batch || !Array.isArray(batch.employeeDetails)) return
//     batch.employeeDetails.forEach((employee) => {
//       if (!employee || typeof employee !== 'object') return
//       Object.keys(amounts).forEach((head) => {
//         const raw = employee[head]
//         const v = parseNumberSafe(raw)
//         amounts[head] += v
//       })
//     })
//   })

//   Object.keys(amounts).forEach((h) => {
//     amounts[h] = Math.round((amounts[h] + Number.EPSILON) * 100) / 100
//   })

//   return amounts
// }

// export default function GLMappingModal({
//   isOpen,
//   onClose,
//   onApprove,
//   onSave,
//   batchData,
//   approvedBatches = [],
// }) {
//   const [glMapping, setGlMapping] = useState({})
//   const [validationErrors, setValidationErrors] = useState([])
//   const [isSaving, setIsSaving] = useState(false)
//   const [showJVModal, setShowJVModal] = useState(false)
//   const [jvData, setJvData] = useState(null)

//   const batches = useMemo(() => {
//     if (approvedBatches?.length > 0) return approvedBatches
//     if (batchData) return [batchData]
//     return []
//   }, [batchData, approvedBatches])

//   const allHeads = useMemo(() => {
//     return extractSalaryHeadsFromBatches(batches)
//   }, [batches])

//   const glRequiredHeads = useMemo(() => {
//     return filterGLRequiredHeads(allHeads)
//   }, [allHeads])

//   const headAmounts = useMemo(() => {
//     return calculateHeadAmounts(batches, glRequiredHeads)
//   }, [batches, glRequiredHeads])

//   useEffect(() => {
//     if (isOpen && glRequiredHeads.length > 0) {
//       const initialMapping = {}
//       glRequiredHeads.forEach((head) => {
//         initialMapping[head] = { debit: '', credit: '' }
//       })
//       setGlMapping(initialMapping)
//       setValidationErrors([])
//       setShowJVModal(false)
//     }
//   }, [isOpen, glRequiredHeads])

//   const handleGLChange = (head, type, value) => {
//     setGlMapping((prev) => ({
//       ...prev,
//       [head]: {
//         ...prev[head],
//         [type]: value,
//       },
//     }))
//   }

//   const getGLDetails = (glCode) => {
//     return GL_ACCOUNTS.find((acc) => acc.code === glCode)
//   }

//   const validateMapping = () => {
//     const errors = []

//     // Check if all heads with amounts have both debit and credit mappings
//     glRequiredHeads.forEach((head) => {
//       const amount = headAmounts[head] || 0
//       if (amount > 0) {
//         if (!glMapping[head]?.debit) {
//           errors.push(`${head}: Debit GL account not selected`)
//         }
//         if (!glMapping[head]?.credit) {
//           errors.push(`${head}: Credit GL account not selected`)
//         }
//       }
//     })

//     // Calculate totals
//     let totalDebit = 0
//     let totalCredit = 0

//     glRequiredHeads.forEach((head) => {
//       const amount = headAmounts[head] || 0
//       if (amount > 0 && glMapping[head]?.debit) {
//         totalDebit += amount
//       }
//       if (amount > 0 && glMapping[head]?.credit) {
//         totalCredit += amount
//       }
//     })

//     if (Math.abs(totalDebit - totalCredit) > 1) {
//       errors.push(
//         `Debit (₹${totalDebit.toLocaleString('en-IN')}) ≠ Credit (₹${totalCredit.toLocaleString('en-IN')})`
//       )
//     }

//     setValidationErrors(errors)
//     return errors.length === 0
//   }

//   const generateJournalEntries = () => {
//     const entries = {
//       debit: [],
//       credit: [],
//       summary: { totalDebit: 0, totalCredit: 0, balanced: false },
//     }

//     glRequiredHeads.forEach((head) => {
//       const amount = headAmounts[head] || 0
//       if (amount > 0) {
//         const debitGL = glMapping[head]?.debit
//         const creditGL = glMapping[head]?.credit

//         if (debitGL) {
//           const glDetails = getGLDetails(debitGL)
//           entries.debit.push({
//             glCode: debitGL,
//             glName: glDetails?.name || debitGL,
//             head,
//             amount,
//           })
//           entries.summary.totalDebit += amount
//         }

//         if (creditGL) {
//           const glDetails = getGLDetails(creditGL)
//           entries.credit.push({
//             glCode: creditGL,
//             glName: glDetails?.name || creditGL,
//             head,
//             amount,
//           })
//           entries.summary.totalCredit += amount
//         }
//       }
//     })

//     entries.summary.totalDebit =
//       Math.round((entries.summary.totalDebit + Number.EPSILON) * 100) / 100
//     entries.summary.totalCredit =
//       Math.round((entries.summary.totalCredit + Number.EPSILON) * 100) / 100
//     entries.summary.balanced =
//       Math.abs(entries.summary.totalDebit - entries.summary.totalCredit) < 0.01

//     return entries
//   }

//   const handleSaveMapping = () => {
//     if (!validateMapping()) {
//       alert('Please fix validation errors before saving')
//       return
//     }

//     setIsSaving(true)

//     const journalEntries = generateJournalEntries()

//     const savedData = {
//       glMapping,
//       headAmounts,
//       journalEntries,
//       batches: batches.map((b) => ({ id: b.id, payrollPeriod: b.payrollPeriod })),
//       timestamp: new Date().toISOString(),
//     }

//     const existingMappings = JSON.parse(localStorage.getItem('glMappings') || '[]')
//     existingMappings.push(savedData)
//     localStorage.setItem('glMappings', JSON.stringify(existingMappings))

//     const allPayments = JSON.parse(localStorage.getItem('salaryPayments') || '[]')
//     const updatedPayments = allPayments.map((payment) => {
//       const batchId = payment.id
//       if (batches.some((b) => b.id === batchId)) {
//         return {
//           ...payment,
//           status: 'GL Mapped',
//           glMappedAt: new Date().toISOString(),
//           glMapping: glMapping,
//           journalEntries: journalEntries,
//           history: [
//             ...(payment.history || []),
//             {
//               action: 'gl_mapped',
//               by: JSON.parse(localStorage.getItem('user'))?.username || 'ae',
//               date: new Date().toISOString(),
//               comments: 'GL accounts mapped manually for accounting entry',
//             },
//           ],
//         }
//       }
//       return payment
//     })

//     localStorage.setItem('salaryPayments', JSON.stringify(updatedPayments))

//     setTimeout(() => {
//       setIsSaving(false)
//       if (typeof onSave === 'function') {
//         onSave()
//       } else {
//         onClose()
//       }
//       alert('GL Mapping saved successfully! Journal entries generated.')
//     }, 500)
//   }

//   const handleApproveClick = () => {
//     // Validate before approving
//     if (!validateMapping()) {
//       alert('Cannot approve! Please complete all GL mappings and ensure the JV is balanced.')
//       return
//     }

//     if (batches.length === 0) {
//       alert('No batches to approve')
//       return
//     }

//     // Generate JV data
//     const journalEntries = generateJournalEntries()
//     const voucherNo = `00010${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}/2526`

//     // ============ DETAILED CONSOLE LOGGING ============
//     console.log('🎯 ============ GL MAPPING APPROVAL DETAILS ============')
//     console.log('📅 Approval Date:', new Date().toLocaleString('en-IN'))
//     console.log('📋 Voucher Number:', voucherNo)
//     console.log('📦 Number of Batches:', batches.length)
//     console.log('💼 Payroll Period:', batches[0]?.payrollPeriod || 'N/A')
//     console.log('🏢 Location:', 'MUMBAI')
//     console.log('\n')

//     // Log each salary head mapping in detail
//     console.log('💰 ============ SALARY HEAD TO GL MAPPING ============')
//     glRequiredHeads.forEach((head, index) => {
//       const amount = headAmounts[head] || 0
//       if (amount > 0) {
//         const debitGL = glMapping[head]?.debit
//         const creditGL = glMapping[head]?.credit
//         const debitDetails = getGLDetails(debitGL)
//         const creditDetails = getGLDetails(creditGL)

//         console.log(`\n${index + 1}. Salary Head: ${head}`)
//         console.log(`   Amount: ₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`)
//         console.log(`   `)
//         console.log(`   📗 DEBIT (Expense Side):`)
//         console.log(`      GL Code: ${debitGL}`)
//         console.log(`      GL Name: ${debitDetails?.name || 'N/A'}`)
//         console.log(`      Parent: ${debitDetails?.parentAccount || 'N/A'}`)
//         console.log(`   `)
//         console.log(`   📕 CREDIT (Liability Side):`)
//         console.log(`      GL Code: ${creditGL}`)
//         console.log(`      GL Name: ${creditDetails?.name || 'N/A'}`)
//         console.log(`      Parent: ${creditDetails?.parentAccount || 'N/A'}`)
//         console.log(`   `)
//         console.log(`   Transaction Entry:`)
//         console.log(
//           `      Dr. ${debitDetails?.name} (${debitGL})  ₹${amount.toLocaleString('en-IN')}`
//         )
//         console.log(
//           `      Cr. ${creditDetails?.name} (${creditGL})  ₹${amount.toLocaleString('en-IN')}`
//         )
//         console.log('   ' + '-'.repeat(70))
//       }
//     })

//     console.log('\n')
//     console.log('📊 ============ JOURNAL VOUCHER SUMMARY ============')
//     console.log('Total Debit Entries:', journalEntries.debit.length)
//     console.log('Total Credit Entries:', journalEntries.credit.length)
//     console.log(
//       `Total Debit Amount: ₹${journalEntries.summary.totalDebit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
//     )
//     console.log(
//       `Total Credit Amount: ₹${journalEntries.summary.totalCredit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
//     )
//     console.log('Balanced:', journalEntries.summary.balanced ? '✅ YES' : '❌ NO')
//     console.log(
//       'Difference:',
//       Math.abs(journalEntries.summary.totalDebit - journalEntries.summary.totalCredit)
//     )

//     console.log('\n')
//     console.log('📝 ============ DEBIT ENTRIES (Expense Accounts) ============')
//     journalEntries.debit.forEach((entry, idx) => {
//       console.log(`${idx + 1}. ${entry.glName} (${entry.glCode})`)
//       console.log(`   For: ${entry.head}`)
//       console.log(
//         `   Amount: ₹${entry.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
//       )
//     })

//     console.log('\n')
//     console.log('📝 ============ CREDIT ENTRIES (Liability Accounts) ============')
//     journalEntries.credit.forEach((entry, idx) => {
//       console.log(`${idx + 1}. ${entry.glName} (${entry.glCode})`)
//       console.log(`   For: ${entry.head}`)
//       console.log(
//         `   Amount: ₹${entry.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
//       )
//     })

//     console.log('\n')
//     console.log('🗂️ ============ COMPLETE GL MAPPING OBJECT ============')
//     console.log(JSON.stringify(glMapping, null, 2))

//     console.log('\n')
//     console.log('💾 ============ DATA TO BE SAVED ============')
//     const dataToSave = {
//       voucherNo,
//       date: new Date().toISOString(),
//       batchIds: batches.map((b) => b.id),
//       payrollPeriod: batches[0]?.payrollPeriod,
//       location: 'MUMBAI',
//       glMapping: glMapping,
//       headAmounts: headAmounts,
//       journalEntries: journalEntries,
//       summary: {
//         totalDebit: journalEntries.summary.totalDebit,
//         totalCredit: journalEntries.summary.totalCredit,
//         balanced: journalEntries.summary.balanced,
//       },
//     }
//     console.log(JSON.stringify(dataToSave, null, 2))

//     console.log('\n')
//     console.log('✅ ============ END OF GL MAPPING DETAILS ============')
//     // ============ END CONSOLE LOGGING ============

//     const jvDataToShow = {
//       ...journalEntries,
//       voucherNo,
//       period:
//         batches[0]?.payrollPeriod ||
//         new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
//       location: 'MUMBAI',
//     }

//     setJvData(jvDataToShow)

//     // Call parent onApprove
//     const ids = batches.map((b) => b.id)
//     if (typeof onApprove === 'function') {
//       onApprove(ids)
//     }

//     // Show JV Modal
//     setShowJVModal(true)
//   }

//   const journalEntries = useMemo(
//     () => generateJournalEntries(),
//     [glMapping, headAmounts, glRequiredHeads]
//   )

//   const isBalanced =
//     Math.abs(journalEntries.summary.totalDebit - journalEntries.summary.totalCredit) < 1
//   const allMapped = glRequiredHeads.every((head) => {
//     const amount = headAmounts[head] || 0
//     if (amount <= 0) return true
//     return glMapping[head]?.debit && glMapping[head]?.credit
//   })

//   if (!isOpen) return null

//   return (
//     <>
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
//         <div className="bg-white rounded-lg shadow-2xl w-full max-w-[98vw] max-h-[98vh] flex flex-col">
//           {/* Header */}
//           <div className="bg-blue-600 text-white p-3 sm:p-4 rounded-t-lg">
//             <div className="flex justify-between items-start">
//               <div>
//                 <h2 className="text-lg sm:text-xl font-semibold mb-1">Manual GL Mapping</h2>
//                 <div className="text-blue-100 text-xs sm:text-sm">
//                   {batches.length === 1 ? (
//                     <p>
//                       Batch: {batches[0].id} • {batches[0].payrollPeriod}
//                     </p>
//                   ) : (
//                     <p>
//                       {batches.length} Batches •{' '}
//                       {batches.reduce((acc, b) => acc + (b.employeeDetails?.length || 0), 0)}{' '}
//                       Employees
//                     </p>
//                   )}
//                 </div>
//               </div>
//               <button
//                 onClick={onClose}
//                 className="text-white hover:bg-blue-700 rounded-full p-1"
//                 aria-label="Close"
//               >
//                 <X size={20} />
//               </button>
//             </div>
//           </div>

//           {/* Summary Cards */}
//           <div className="p-3 sm:p-4 border-b bg-gray-50">
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
//               <div className="bg-green-50 border border-green-200 rounded-md p-2 sm:p-3">
//                 <p className="text-xs text-green-600 font-medium mb-1">Total Debit</p>
//                 <p className="text-base sm:text-lg font-bold text-green-700">
//                   ₹
//                   {journalEntries.summary.totalDebit.toLocaleString('en-IN', {
//                     minimumFractionDigits: 2,
//                   })}
//                 </p>
//               </div>
//               <div className="bg-orange-50 border border-orange-200 rounded-md p-2 sm:p-3">
//                 <p className="text-xs text-orange-600 font-medium mb-1">Total Credit</p>
//                 <p className="text-base sm:text-lg font-bold text-orange-700">
//                   ₹
//                   {journalEntries.summary.totalCredit.toLocaleString('en-IN', {
//                     minimumFractionDigits: 2,
//                   })}
//                 </p>
//               </div>
//               <div
//                 className={`border rounded-md p-2 sm:p-3 ${
//                   isBalanced ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
//                 }`}
//               >
//                 <p className="text-xs font-medium mb-1">Balance Status</p>
//                 <p
//                   className={`text-base sm:text-lg font-bold ${isBalanced ? 'text-green-700' : 'text-red-700'}`}
//                 >
//                   {isBalanced ? 'Balanced ✓' : 'Not Balanced'}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Validation Errors */}
//           {validationErrors.length > 0 && (
//             <div className="mx-3 sm:mx-4 mt-3 bg-red-50 border border-red-200 rounded-md p-3">
//               <h3 className="font-semibold text-red-800 text-sm mb-2">Validation Errors:</h3>
//               <ul className="text-xs sm:text-sm text-red-700 space-y-1">
//                 {validationErrors.map((error, idx) => (
//                   <li key={idx}>• {error}</li>
//                 ))}
//               </ul>
//             </div>
//           )}

//           {/* Main Table */}
//           <div className="flex-1 overflow-auto p-3 sm:p-4">
//             <div className="overflow-x-auto">
//               <table className="w-full text-xs sm:text-sm border-collapse border border-gray-300">
//                 <thead className="bg-gray-100 sticky top-0">
//                   <tr>
//                     <th className="border border-gray-300 p-2 text-left font-semibold min-w-[120px]">
//                       Salary Head
//                     </th>
//                     <th className="border border-gray-300 p-2 text-right font-semibold min-w-[100px]">
//                       Amount (₹)
//                     </th>
//                     <th className="border border-gray-300 p-2 text-center font-semibold min-w-[200px]">
//                       Debit (Expense)
//                     </th>
//                     <th className="border border-gray-300 p-2 text-center font-semibold min-w-[200px]">
//                       Credit (Liability)
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {glRequiredHeads.map((head, index) => {
//                     const amount = headAmounts[head] || 0
//                     const debitGL = glMapping[head]?.debit
//                     const creditGL = glMapping[head]?.credit
//                     const debitDetails = debitGL ? getGLDetails(debitGL) : null
//                     const creditDetails = creditGL ? getGLDetails(creditGL) : null

//                     return (
//                       <tr key={head} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
//                         <td className="border border-gray-300 p-2 font-medium">{head}</td>
//                         <td className="border border-gray-300 p-2 text-right font-semibold">
//                           {amount > 0
//                             ? `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
//                             : '-'}
//                         </td>
//                         <td className="border border-gray-300 p-2">
//                           <select
//                             value={debitGL || ''}
//                             onChange={(e) => handleGLChange(head, 'debit', e.target.value)}
//                             className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs sm:text-sm"
//                             disabled={amount <= 0}
//                           >
//                             <option value="">Select GL Code</option>
//                             {GL_ACCOUNTS.filter((acc) => acc.type === 'ACCOUNT').map((acc) => (
//                               <option key={acc.code} value={acc.code}>
//                                 {acc.code} - {acc.name}
//                               </option>
//                             ))}
//                           </select>
//                           {debitDetails && (
//                             <div className="mt-1 text-xs text-gray-600 bg-blue-50 p-1 rounded">
//                               {debitDetails.code} - {debitDetails.name}
//                             </div>
//                           )}
//                         </td>
//                         <td className="border border-gray-300 p-2">
//                           <select
//                             value={creditGL || ''}
//                             onChange={(e) => handleGLChange(head, 'credit', e.target.value)}
//                             className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs sm:text-sm"
//                             disabled={amount <= 0}
//                           >
//                             <option value="">Select GL Code</option>
//                             {GL_ACCOUNTS.filter((acc) => acc.type === 'ACCOUNT').map((acc) => (
//                               <option key={acc.code} value={acc.code}>
//                                 {acc.code} - {acc.name}
//                               </option>
//                             ))}
//                           </select>
//                           {creditDetails && (
//                             <div className="mt-1 text-xs text-gray-600 bg-orange-50 p-1 rounded">
//                               {creditDetails.code} - {creditDetails.name}
//                             </div>
//                           )}
//                         </td>
//                       </tr>
//                     )
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* Footer Actions */}
//           <div className="border-t bg-gray-50 p-3 sm:p-4 rounded-b-lg">
//             <div className="flex flex-col sm:flex-row gap-2 justify-end">
//               <button
//                 onClick={onClose}
//                 className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 text-sm"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleApproveClick}
//                 disabled={!isBalanced || !allMapped}
//                 className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
//                 title={
//                   !isBalanced || !allMapped
//                     ? 'Complete all mappings and balance JV to approve'
//                     : 'Approve and generate JV'
//                 }
//               >
//                 Approve & Generate JV
//               </button>
//               <button
//                 onClick={handleSaveMapping}
//                 disabled={isSaving || !isBalanced || !allMapped}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {isSaving ? 'Saving...' : 'Save GL Mapping'}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Journal Voucher Modal */}
//       {showJVModal && jvData && (
//         <JournalVoucherModal
//           isOpen={showJVModal}
//           onClose={() => setShowJVModal(false)}
//           journalData={jvData}
//         />
//       )}
//     </>
//   )
// }

import React, { useState, useEffect, useMemo } from 'react'
import { X, Download, FileText } from 'lucide-react'

// GL Master Data - From your accounts
const GL_ACCOUNTS = [
  { code: 'L2002', name: 'SALARY', type: 'SUB_FOLDER', parentAccount: 'CURRENT LIABILITIES' },
  { code: 'L2002001', name: 'SALARY PAYABLE', type: 'ACCOUNT', parentAccount: 'SALARY' },
  {
    code: 'X2001001002',
    name: 'EMPLOYER PF CONTRIBUTION',
    type: 'ACCOUNT',
    parentAccount: 'BRANCH MANAGEMENT SALARY COST',
  },
  {
    code: 'L2002002',
    name: 'PF PAYABLE - EMPLOYER SHARE',
    type: 'ACCOUNT',
    parentAccount: 'SALARY',
  },
  {
    code: 'X2001001003',
    name: 'ESIC EMPLOYEER CONTRIBUTION',
    type: 'ACCOUNT',
    parentAccount: 'BRANCH MANAGEMENT SALARY COST',
  },
  {
    code: 'L2002003',
    name: 'ESIC PAYABLE - EMPLOYER SHARE',
    type: 'ACCOUNT',
    parentAccount: 'SALARY',
  },
  {
    code: 'X2001001004',
    name: 'EMPLOYER LWF CONTRIBUTION',
    type: 'ACCOUNT',
    parentAccount: 'BRANCH MANAGEMENT SALARY COST',
  },
  {
    code: 'L2002004',
    name: 'LWF PAYABLE - EMPLOYER SHARE',
    type: 'ACCOUNT',
    parentAccount: 'SALARY',
  },
  {
    code: 'X2001001005',
    name: 'LEAVE PROVISION EXPENSE',
    type: 'ACCOUNT',
    parentAccount: 'BRANCH MANAGEMENT SALARY COST',
  },
  {
    code: 'L2002005',
    name: 'PROVISION FOR LEAVE ENCASHMENT',
    type: 'ACCOUNT',
    parentAccount: 'SALARY',
  },
  {
    code: 'X2001001006',
    name: 'OTHER DEDUCTIONS',
    type: 'ACCOUNT',
    parentAccount: 'BRANCH MANAGEMENT SALARY COST',
  },
  {
    code: 'L2002006',
    name: 'PF PAYABLE - EMPLOYEE SHARE',
    type: 'ACCOUNT',
    parentAccount: 'SALARY',
  },
  {
    code: 'L2002007',
    name: 'ESIC PAYABLE - EMPLOYEE SHARE',
    type: 'ACCOUNT',
    parentAccount: 'SALARY',
  },
  {
    code: 'L2002008',
    name: 'LWF PAYABLE - EMPLOYEE SHARE',
    type: 'ACCOUNT',
    parentAccount: 'SALARY',
  },
  {
    code: 'L2002009',
    name: 'PT PAYABLE - EMPLOYEE SHARE',
    type: 'ACCOUNT',
    parentAccount: 'SALARY',
  },
  {
    code: 'X2001001001',
    name: 'Salary & Wages',
    type: 'ACCOUNT',
    parentAccount: 'BRANCH MANAGEMENT SALARY COST',
  },
]

// JV Modal Component
function JournalVoucherModal({ isOpen, onClose, journalData, transactionDetails }) {
  if (!isOpen) return null

  const totalDebit = journalData.debit.reduce((sum, entry) => sum + entry.amount, 0)
  const totalCredit = journalData.credit.reduce((sum, entry) => sum + entry.amount, 0)

  const numberToWords = (num) => {
    const ones = ['', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE']
    const tens = [
      '',
      '',
      'TWENTY',
      'THIRTY',
      'FORTY',
      'FIFTY',
      'SIXTY',
      'SEVENTY',
      'EIGHTY',
      'NINETY',
    ]
    const teens = [
      'TEN',
      'ELEVEN',
      'TWELVE',
      'THIRTEEN',
      'FOURTEEN',
      'FIFTEEN',
      'SIXTEEN',
      'SEVENTEEN',
      'EIGHTEEN',
      'NINETEEN',
    ]

    if (num === 0) return 'ZERO'

    const crores = Math.floor(num / 10000000)
    const lakhs = Math.floor((num % 10000000) / 100000)
    const thousands = Math.floor((num % 100000) / 1000)
    const hundreds = Math.floor((num % 1000) / 100)
    const remainder = num % 100

    let words = ''

    if (crores > 0) words += ones[crores] + ' CRORE '
    if (lakhs > 0) {
      if (lakhs < 10) words += ones[lakhs] + ' LAKH '
      else if (lakhs < 20) words += teens[lakhs - 10] + ' LAKH '
      else words += tens[Math.floor(lakhs / 10)] + ' ' + ones[lakhs % 10] + ' LAKH '
    }
    if (thousands > 0) {
      if (thousands < 10) words += ones[thousands] + ' THOUSAND '
      else if (thousands < 20) words += teens[thousands - 10] + ' THOUSAND '
      else words += tens[Math.floor(thousands / 10)] + ' ' + ones[thousands % 10] + ' THOUSAND '
    }
    if (hundreds > 0) words += ones[hundreds] + ' HUNDRED '
    if (remainder > 0) {
      if (remainder < 10) words += ones[remainder]
      else if (remainder < 20) words += teens[remainder - 10]
      else words += tens[Math.floor(remainder / 10)] + ' ' + ones[remainder % 10]
    }

    return words.trim() + ' ONLY'
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center print:hidden">
          <div className="flex items-center gap-2">
            <FileText size={24} />
            <h2 className="text-xl font-bold">Journal Voucher</h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded hover:bg-blue-50"
            >
              <Download size={18} />
              <span className="hidden sm:inline">Print/Download</span>
            </button>
            <button onClick={onClose} className="text-white hover:bg-blue-700 rounded-full p-2">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* JV Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-3xl mx-auto bg-white border-2 border-gray-800 p-6">
            {/* Company Header */}
            <div className="text-center border-b-2 border-gray-800 pb-4 mb-4">
              <h1 className="text-xl font-bold mb-2">I SMART FACITECH PRIVATE LIMITED</h1>
              <p className="text-sm">
                317, 3RD FLOOR, A/2, NILGIRI, WADALA TRUCK TERMINAL,
                <br />
                NEAR WADALA RTO, MUMBAI - 400037
              </p>
              <p className="text-sm mt-2">
                <strong>GST No:</strong> 27AAKCC4528J1ZE || <strong>GST State:</strong> Maharashtra
                (27)
              </p>
            </div>

            {/* Voucher Info */}
            <div className="flex justify-between mb-4 border-b border-gray-400 pb-2">
              <div>
                <h2 className="text-lg font-bold">Journal Voucher</h2>
                <p className="text-sm text-gray-600">
                  <strong>Transaction ID:</strong> {transactionDetails?.transactionId}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Batch IDs:</strong> {transactionDetails?.batchIds?.join(', ')}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm">
                  <strong>Voucher No.:</strong> {journalData.voucherNo || 'JVF00010001/2526'}
                </p>
                <p className="text-sm">
                  <strong>Voucher Date:</strong> {new Date().toLocaleDateString('en-GB')}
                </p>
              </div>
            </div>

            {/* Journal Entries Table */}
            <table className="w-full text-sm border-collapse mb-4">
              <thead>
                <tr className="border-b-2 border-gray-800">
                  <th className="text-left py-2 font-bold">Account Name</th>
                  <th className="text-right py-2 font-bold pr-4 w-28">Debit</th>
                  <th className="text-right py-2 font-bold w-28">Credit</th>
                </tr>
              </thead>
              <tbody>
                {/* Debit Entries */}
                {journalData.debit.map((entry, index) => (
                  <tr key={`debit-${index}`} className="border-b border-gray-300">
                    <td className="py-2">
                      <div className="font-semibold">
                        {entry.glName} ({entry.glCode})
                      </div>
                      <div className="text-xs text-gray-600 italic">
                        {entry.salaryHead ? `Salary Head: ${entry.salaryHead}` : ''} |{' '}
                        {journalData.location || 'MUMBAI'} - {entry.head} for Month of{' '}
                        {journalData.period ||
                          new Date().toLocaleDateString('en-US', {
                            month: 'long',
                            year: 'numeric',
                          })}
                      </div>
                    </td>
                    <td className="text-right py-2 pr-4 font-semibold">
                      {entry.amount.toLocaleString('en-IN', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="text-right py-2"></td>
                  </tr>
                ))}

                {/* Credit Entries */}
                {journalData.credit.map((entry, index) => (
                  <tr key={`credit-${index}`} className="border-b border-gray-300">
                    <td className="py-2">
                      <div className="font-semibold">
                        {entry.glName} ({entry.glCode})
                      </div>
                      <div className="text-xs text-gray-600 italic">
                        {entry.salaryHead ? `Salary Head: ${entry.salaryHead}` : ''} |{' '}
                        {journalData.location || 'MUMBAI'} - {entry.head} for Month of{' '}
                        {journalData.period ||
                          new Date().toLocaleDateString('en-US', {
                            month: 'long',
                            year: 'numeric',
                          })}
                      </div>
                    </td>
                    <td className="text-right py-2 pr-4"></td>
                    <td className="text-right py-2 font-semibold">
                      {entry.amount.toLocaleString('en-IN', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                ))}

                {/* Total Row */}
                <tr className="border-t-2 border-gray-800 font-bold">
                  <td className="py-2"></td>
                  <td className="text-right py-2 pr-4 text-base">
                    {totalDebit.toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="text-right py-2 text-base">
                    {totalCredit.toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Amount in Words */}
            <div className="border-t border-b border-gray-400 py-2 mb-4">
              <p className="text-sm font-semibold">
                RUPEES {numberToWords(Math.round(totalDebit))}
              </p>
            </div>

            {/* Signatures */}
            <div className="flex justify-between mt-8 pt-4 border-t border-gray-400">
              <div className="text-center">
                <div className="border-t border-gray-800 pt-2 mt-12 w-32">
                  <p className="text-sm">Prepared By</p>
                </div>
              </div>
              <div className="text-center">
                <div className="border-t border-gray-800 pt-2 mt-12 w-32">
                  <p className="text-sm">Checked By</p>
                </div>
              </div>
              <div className="text-center">
                <div className="border-t border-gray-800 pt-2 mt-12 w-32">
                  <p className="text-sm">Authorised By</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-50 p-4 rounded-b-lg flex justify-end print:hidden">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

// Helper function to extract all salary heads from batch data
const extractSalaryHeadsFromBatches = (batches) => {
  if (!batches || !Array.isArray(batches) || batches.length === 0) {
    return []
  }

  const allHeads = new Set()

  batches.forEach((batch) => {
    if (batch?.employeeDetails && Array.isArray(batch.employeeDetails)) {
      batch.employeeDetails.forEach((employee) => {
        if (employee && typeof employee === 'object') {
          Object.keys(employee).forEach((key) => {
            if (key && typeof key === 'string') {
              allHeads.add(key)
            }
          })
        }
      })
    }
  })

  return Array.from(allHeads)
}

const filterGLRequiredHeads = (allHeads) => {
  if (!Array.isArray(allHeads)) {
    return []
  }

  const nonGLHeads = [
    'MONTHATTENDANCEID',
    'BRANCHNAME',
    'CLIENTGROUPCODE',
    'CLIENTGROUPNAME',
    'SITECODE',
    'SITENAME',
    'STATENAME',
    'EMPOLDCODE',
    'EMPMASTERID',
    'EMPCODE',
    'FULLNAME',
    'DOJ',
    'DOB',
    'GENDERNAME',
    'DUTYMASTERID',
    'DUTYNAME',
    'GROUPMASTERID',
    'GROUP',
    'DESIGNATIONMASTERID',
    'DESIGNATIONNAME',
    'PF NO',
    'ESIC NO',
    'UAN NO',
    'SALARY STATUS',
    'AADHAR CARD',
    'PAYMENTMODENAME',
    'BANK NAME',
    'BANK NAME AS PER EMPLOYEE',
    'BANK BRANCH NAME AS PER EMPLOYEE',
    'IFS CODE AS PER EMPLOYEE',
    'BANK ACCOUNT NO AS PER EMPLOYEE',
    'BANK NAME AS PER PAYMENT',
    'BANK BRANCH NAME AS PER PAYMENT',
    'IFS CODE AS PER PAYMENT',
    'BANK ACCOUNT NO AS PER PAYMENT',
    'NORMALDAYS',
    'WEEKLYOFF',
    'OTHOURS',
    'SPLOTHOURS',
    'PL_AVAILED',
    'CL_AVAILED',
    'SL_AVAILED',
    'SITEDIVISIONDAYS',
    'PL',
    'CL',
    'SL',
    'FIXED_BASIC',
    'FIXED_DA',
    'FIXED_HRA',
    'FIXED_CONVEYANCE',
    'FIXED_WASHING ALLOWANCE',
    'FIXED_OTHER ALLOWANCE',
    'FIXED_LEAVE WITH WAGES',
    'FIXED_CCA',
    'FIXED_EDUCATIONAL ALLOWANCE',
    'FIXED_MEDICAL ALLOWANCE',
    'FIXED_SPL ALLOWANCE',
    'FIXED_BONUS',
    'FIXED_MEAL',
    'FIXED_SITE ALLOWANCE',
    'FIXED_PERFORMANCE ALLOWANCE',
    'FIXED_FOOD',
    'FIXED_METRO CITY ALLOWANCE',
    'FIXED_STIPEND',
    'FIXEDGROSS',
    'PF WAGES',
    'ESI WAGES',
    'GROSS AMT',
    'TOTALDEDUCTION',
    'CTC',
    'DEBIT AMT',
    'DEBIT BANK A/C NO',
    'NETPAYABLE',
  ]

  const nonGLSet = new Set(nonGLHeads)
  return allHeads.filter((head) => !nonGLSet.has(head))
}

const calculateHeadAmounts = (batches, glHeads) => {
  const amounts = {}
  if (!Array.isArray(glHeads)) return amounts

  const parseNumberSafe = (val) => {
    if (val === null || val === undefined) return 0
    if (typeof val === 'number') return val
    if (typeof val === 'string') {
      const cleaned = val.replace(/,/g, '').trim()
      if (cleaned === '') return 0
      const n = Number(cleaned)
      return Number.isFinite(n) ? n : 0
    }
    const n = Number(val)
    return Number.isFinite(n) ? n : 0
  }

  glHeads.forEach((head) => {
    amounts[head] = 0
  })

  batches.forEach((batch) => {
    if (!batch || !Array.isArray(batch.employeeDetails)) return
    batch.employeeDetails.forEach((employee) => {
      if (!employee || typeof employee !== 'object') return
      Object.keys(amounts).forEach((head) => {
        const raw = employee[head]
        const v = parseNumberSafe(raw)
        amounts[head] += v
      })
    })
  })

  Object.keys(amounts).forEach((h) => {
    amounts[h] = Math.round((amounts[h] + Number.EPSILON) * 100) / 100
  })

  return amounts
}

export default function GLMappingModal({
  isOpen,
  onClose,
  onApprove,
  onSave,
  batchData,
  approvedBatches = [],
}) {
  const [glMapping, setGlMapping] = useState({})
  const [validationErrors, setValidationErrors] = useState([])
  const [isSaving, setIsSaving] = useState(false)
  const [showJVModal, setShowJVModal] = useState(false)
  const [jvData, setJvData] = useState(null)
  const [transactionDetails, setTransactionDetails] = useState(null)

  const batches = useMemo(() => {
    if (approvedBatches?.length > 0) return approvedBatches
    if (batchData) return [batchData]
    return []
  }, [batchData, approvedBatches])

  const allHeads = useMemo(() => {
    return extractSalaryHeadsFromBatches(batches)
  }, [batches])

  const glRequiredHeads = useMemo(() => {
    return filterGLRequiredHeads(allHeads)
  }, [allHeads])

  const headAmounts = useMemo(() => {
    return calculateHeadAmounts(batches, glRequiredHeads)
  }, [batches, glRequiredHeads])

  useEffect(() => {
    if (isOpen && glRequiredHeads.length > 0) {
      const initialMapping = {}
      glRequiredHeads.forEach((head) => {
        initialMapping[head] = { debit: '', credit: '' }
      })
      setGlMapping(initialMapping)
      setValidationErrors([])
      setShowJVModal(false)
    }
  }, [isOpen, glRequiredHeads])

  const handleGLChange = (head, type, value) => {
    setGlMapping((prev) => ({
      ...prev,
      [head]: {
        ...prev[head],
        [type]: value,
      },
    }))
  }

  const getGLDetails = (glCode) => {
    return GL_ACCOUNTS.find((acc) => acc.code === glCode)
  }

  const validateMapping = () => {
    const errors = []

    // Check if all heads with amounts have both debit and credit mappings
    glRequiredHeads.forEach((head) => {
      const amount = headAmounts[head] || 0
      if (amount > 0) {
        if (!glMapping[head]?.debit) {
          errors.push(`${head}: Debit GL account not selected`)
        }
        if (!glMapping[head]?.credit) {
          errors.push(`${head}: Credit GL account not selected`)
        }
      }
    })

    // Calculate totals
    let totalDebit = 0
    let totalCredit = 0

    glRequiredHeads.forEach((head) => {
      const amount = headAmounts[head] || 0
      if (amount > 0 && glMapping[head]?.debit) {
        totalDebit += amount
      }
      if (amount > 0 && glMapping[head]?.credit) {
        totalCredit += amount
      }
    })

    if (Math.abs(totalDebit - totalCredit) > 1) {
      errors.push(
        `Debit (₹${totalDebit.toLocaleString('en-IN')}) ≠ Credit (₹${totalCredit.toLocaleString('en-IN')})`
      )
    }

    setValidationErrors(errors)
    return errors.length === 0
  }

  const generateJournalEntries = () => {
    const entries = {
      debit: [],
      credit: [],
      summary: { totalDebit: 0, totalCredit: 0, balanced: false },
      detailedMapping: [], // NEW: Store detailed mapping for logging
    }

    glRequiredHeads.forEach((head) => {
      const amount = headAmounts[head] || 0
      if (amount > 0) {
        const debitGL = glMapping[head]?.debit
        const creditGL = glMapping[head]?.credit

        if (debitGL) {
          const glDetails = getGLDetails(debitGL)
          entries.debit.push({
            glCode: debitGL,
            glName: glDetails?.name || debitGL,
            head,
            salaryHead: head, // Add salary head name
            amount,
          })
          entries.summary.totalDebit += amount
        }

        if (creditGL) {
          const glDetails = getGLDetails(creditGL)
          entries.credit.push({
            glCode: creditGL,
            glName: glDetails?.name || creditGL,
            head,
            salaryHead: head, // Add salary head name
            amount,
          })
          entries.summary.totalCredit += amount
        }

        // Store detailed mapping
        if (debitGL && creditGL) {
          entries.detailedMapping.push({
            salaryHead: head,
            amount: amount,
            debitGL: {
              code: debitGL,
              name: getGLDetails(debitGL)?.name || debitGL,
            },
            creditGL: {
              code: creditGL,
              name: getGLDetails(creditGL)?.name || creditGL,
            },
          })
        }
      }
    })

    entries.summary.totalDebit =
      Math.round((entries.summary.totalDebit + Number.EPSILON) * 100) / 100
    entries.summary.totalCredit =
      Math.round((entries.summary.totalCredit + Number.EPSILON) * 100) / 100
    entries.summary.balanced =
      Math.abs(entries.summary.totalDebit - entries.summary.totalCredit) < 0.01

    return entries
  }

  const logDetailedMappingToConsole = (journalEntries) => {
    console.clear()
    console.log('🎯 ======== SALARY GL MAPPING DETAILS ======== 🎯')
    console.log('\n📋 BATCH INFORMATION:')
    console.table(
      batches.map((batch) => ({
        'Batch ID': batch.id,
        'Payroll Period': batch.payrollPeriod,
        Employees: batch.employeeDetails?.length || 0,
        'Net Payable': batch.totalAmount || 0,
      }))
    )

    console.log('\n💰 TOTAL AMOUNTS:')
    console.table({
      'Total Debit': `₹${journalEntries.summary.totalDebit.toLocaleString('en-IN')}`,
      'Total Credit': `₹${journalEntries.summary.totalCredit.toLocaleString('en-IN')}`,
      'Balance Status': journalEntries.summary.balanced ? '✅ BALANCED' : '❌ UNBALANCED',
      Difference: `₹${Math.abs(journalEntries.summary.totalDebit - journalEntries.summary.totalCredit).toFixed(2)}`,
    })

    console.log('\n📊 DETAILED SALARY HEAD MAPPING:')
    journalEntries.detailedMapping.forEach((mapping, index) => {
      console.group(
        `📍 ${index + 1}. ${mapping.salaryHead} - ₹${mapping.amount.toLocaleString('en-IN')}`
      )
      console.log(`   Debit Account: ${mapping.debitGL.code} - ${mapping.debitGL.name}`)
      console.log(`   Credit Account: ${mapping.creditGL.code} - ${mapping.creditGL.name}`)
      console.log(`   Amount: ₹${mapping.amount.toLocaleString('en-IN')}`)
      console.groupEnd()
    })

    console.log('\n🧾 JOURNAL ENTRY SUMMARY:')
    console.log('DEBIT ENTRIES:')
    journalEntries.debit.forEach((entry, idx) => {
      console.log(
        `  ${idx + 1}. ${entry.glCode} - ${entry.glName}: ₹${entry.amount.toLocaleString('en-IN')}`
      )
    })

    console.log('\nCREDIT ENTRIES:')
    journalEntries.credit.forEach((entry, idx) => {
      console.log(
        `  ${idx + 1}. ${entry.glCode} - ${entry.glName}: ₹${entry.amount.toLocaleString('en-IN')}`
      )
    })

    console.log('\n📝 TRANSACTION DATA FOR SAVING:')
    console.log(
      JSON.stringify(
        {
          transactionId: `TXN_SALARY_${Date.now()}`,
          voucherNo: `JVF${String(Math.floor(Math.random() * 10000)).padStart(5, '0')}/2526`,
          date: new Date().toISOString().split('T')[0],
          batches: batches.map((b) => b.id),
          totalDebit: journalEntries.summary.totalDebit,
          totalCredit: journalEntries.summary.totalCredit,
          entries: [
            ...journalEntries.debit.map((e) => ({
              glCode: e.glCode,
              glName: e.glName,
              debit: e.amount,
              credit: 0,
              narration: `Salary - ${e.salaryHead} for ${batches[0]?.payrollPeriod || 'Period'}`,
            })),
            ...journalEntries.credit.map((e) => ({
              glCode: e.glCode,
              glName: e.glName,
              debit: 0,
              credit: e.amount,
              narration: `Salary - ${e.salaryHead} for ${batches[0]?.payrollPeriod || 'Period'}`,
            })),
          ],
          balanced: journalEntries.summary.balanced,
        },
        null,
        2
      )
    )

    console.log('\n✅ GL MAPPING VALIDATION:')
    console.table(
      glRequiredHeads.map((head) => ({
        'Salary Head': head,
        Amount: `₹${headAmounts[head]?.toLocaleString('en-IN') || '0.00'}`,
        'Debit GL': glMapping[head]?.debit || '❌ Missing',
        'Credit GL': glMapping[head]?.credit || '❌ Missing',
        Status: glMapping[head]?.debit && glMapping[head]?.credit ? '✅ Mapped' : '⚠️ Incomplete',
      }))
    )

    console.log('\n🎯 ======== END OF MAPPING DETAILS ======== 🎯')
  }

  const handleSaveMapping = () => {
    if (!validateMapping()) {
      alert('Please fix validation errors before saving')
      return
    }

    setIsSaving(true)

    const journalEntries = generateJournalEntries()

    const savedData = {
      glMapping,
      headAmounts,
      journalEntries,
      batches: batches.map((b) => ({ id: b.id, payrollPeriod: b.payrollPeriod })),
      timestamp: new Date().toISOString(),
    }

    const existingMappings = JSON.parse(localStorage.getItem('glMappings') || '[]')
    existingMappings.push(savedData)
    localStorage.setItem('glMappings', JSON.stringify(existingMappings))

    const allPayments = JSON.parse(localStorage.getItem('salaryPayments') || '[]')
    const updatedPayments = allPayments.map((payment) => {
      const batchId = payment.id
      if (batches.some((b) => b.id === batchId)) {
        return {
          ...payment,
          status: 'GL Mapped',
          glMappedAt: new Date().toISOString(),
          glMapping: glMapping,
          journalEntries: journalEntries,
          history: [
            ...(payment.history || []),
            {
              action: 'gl_mapped',
              by: JSON.parse(localStorage.getItem('user'))?.username || 'ae',
              date: new Date().toISOString(),
              comments: 'GL accounts mapped manually for accounting entry',
            },
          ],
        }
      }
      return payment
    })

    localStorage.setItem('salaryPayments', JSON.stringify(updatedPayments))

    setTimeout(() => {
      setIsSaving(false)
      if (typeof onSave === 'function') {
        onSave()
      } else {
        onClose()
      }
      alert('GL Mapping saved successfully! Journal entries generated.')
    }, 500)
  }

  const handleApproveClick = () => {
    // Validate before approving
    if (!validateMapping()) {
      alert('Cannot approve! Please complete all GL mappings and ensure the JV is balanced.')
      return
    }

    if (batches.length === 0) {
      alert('No batches to approve')
      return
    }

    // Generate JV data
    const journalEntries = generateJournalEntries()

    // LOG DETAILED MAPPING TO CONSOLE
    logDetailedMappingToConsole(journalEntries)

    const voucherNo = `JVF${String(Math.floor(Math.random() * 10000)).padStart(5, '0')}/2526`
    const transactionId = `TXN_SALARY_${Date.now()}`

    const jvDataToShow = {
      ...journalEntries,
      voucherNo,
      period:
        batches[0]?.payrollPeriod ||
        new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      location: 'MUMBAI',
    }

    setJvData(jvDataToShow)
    setTransactionDetails({
      transactionId,
      batchIds: batches.map((b) => b.id),
      totalAmount: journalEntries.summary.totalDebit,
    })

    // Call parent onApprove
    const ids = batches.map((b) => b.id)
    if (typeof onApprove === 'function') {
      onApprove(ids)
    }

    // Show JV Modal
    setShowJVModal(true)
  }

  const journalEntries = useMemo(
    () => generateJournalEntries(),
    [glMapping, headAmounts, glRequiredHeads]
  )

  const isBalanced =
    Math.abs(journalEntries.summary.totalDebit - journalEntries.summary.totalCredit) < 1
  const allMapped = glRequiredHeads.every((head) => {
    const amount = headAmounts[head] || 0
    if (amount <= 0) return true
    return glMapping[head]?.debit && glMapping[head]?.credit
  })

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-[98vw] max-h-[98vh] flex flex-col">
          {/* Header */}
          <div className="bg-blue-600 text-white p-3 sm:p-4 rounded-t-lg">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold mb-1">Manual GL Mapping</h2>
                <div className="text-blue-100 text-xs sm:text-sm">
                  {batches.length === 1 ? (
                    <p>
                      Batch: {batches[0].id} • {batches[0].payrollPeriod}
                    </p>
                  ) : (
                    <p>
                      {batches.length} Batches •{' '}
                      {batches.reduce((acc, b) => acc + (b.employeeDetails?.length || 0), 0)}{' '}
                      Employees
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:bg-blue-700 rounded-full p-1"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="p-3 sm:p-4 border-b bg-gray-50">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
              <div className="bg-green-50 border border-green-200 rounded-md p-2 sm:p-3">
                <p className="text-xs text-green-600 font-medium mb-1">Total Debit</p>
                <p className="text-base sm:text-lg font-bold text-green-700">
                  ₹
                  {journalEntries.summary.totalDebit.toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-md p-2 sm:p-3">
                <p className="text-xs text-orange-600 font-medium mb-1">Total Credit</p>
                <p className="text-base sm:text-lg font-bold text-orange-700">
                  ₹
                  {journalEntries.summary.totalCredit.toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
              <div
                className={`border rounded-md p-2 sm:p-3 ${
                  isBalanced ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                }`}
              >
                <p className="text-xs font-medium mb-1">Balance Status</p>
                <p
                  className={`text-base sm:text-lg font-bold ${isBalanced ? 'text-green-700' : 'text-red-700'}`}
                >
                  {isBalanced ? 'Balanced ✓' : 'Not Balanced'}
                </p>
              </div>
            </div>
          </div>

          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div className="mx-3 sm:mx-4 mt-3 bg-red-50 border border-red-200 rounded-md p-3">
              <h3 className="font-semibold text-red-800 text-sm mb-2">Validation Errors:</h3>
              <ul className="text-xs sm:text-sm text-red-700 space-y-1">
                {validationErrors.map((error, idx) => (
                  <li key={idx}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Main Table */}
          <div className="flex-1 overflow-auto p-3 sm:p-4">
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm border-collapse border border-gray-300">
                <thead className="bg-gray-100 sticky top-0">
                  <tr>
                    <th className="border border-gray-300 p-2 text-left font-semibold min-w-[120px]">
                      Salary Head
                    </th>
                    <th className="border border-gray-300 p-2 text-right font-semibold min-w-[100px]">
                      Amount (₹)
                    </th>
                    <th className="border border-gray-300 p-2 text-center font-semibold min-w-[200px]">
                      Debit (Expense)
                    </th>
                    <th className="border border-gray-300 p-2 text-center font-semibold min-w-[200px]">
                      Credit (Liability)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {glRequiredHeads.map((head, index) => {
                    const amount = headAmounts[head] || 0
                    const debitGL = glMapping[head]?.debit
                    const creditGL = glMapping[head]?.credit
                    const debitDetails = debitGL ? getGLDetails(debitGL) : null
                    const creditDetails = creditGL ? getGLDetails(creditGL) : null

                    return (
                      <tr key={head} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="border border-gray-300 p-2 font-medium">{head}</td>
                        <td className="border border-gray-300 p-2 text-right font-semibold">
                          {amount > 0
                            ? `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
                            : '-'}
                        </td>
                        <td className="border border-gray-300 p-2">
                          <select
                            value={debitGL || ''}
                            onChange={(e) => handleGLChange(head, 'debit', e.target.value)}
                            className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs sm:text-sm"
                            disabled={amount <= 0}
                          >
                            <option value="">Select GL Code</option>
                            {GL_ACCOUNTS.filter((acc) => acc.type === 'ACCOUNT').map((acc) => (
                              <option key={acc.code} value={acc.code}>
                                {acc.code} - {acc.name}
                              </option>
                            ))}
                          </select>
                          {debitDetails && (
                            <div className="mt-1 text-xs text-gray-600 bg-blue-50 p-1 rounded">
                              {debitDetails.code} - {debitDetails.name}
                            </div>
                          )}
                        </td>
                        <td className="border border-gray-300 p-2">
                          <select
                            value={creditGL || ''}
                            onChange={(e) => handleGLChange(head, 'credit', e.target.value)}
                            className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs sm:text-sm"
                            disabled={amount <= 0}
                          >
                            <option value="">Select GL Code</option>
                            {GL_ACCOUNTS.filter((acc) => acc.type === 'ACCOUNT').map((acc) => (
                              <option key={acc.code} value={acc.code}>
                                {acc.code} - {acc.name}
                              </option>
                            ))}
                          </select>
                          {creditDetails && (
                            <div className="mt-1 text-xs text-gray-600 bg-orange-50 p-1 rounded">
                              {creditDetails.code} - {creditDetails.name}
                            </div>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-t bg-gray-50 p-3 sm:p-4 rounded-b-lg">
            <div className="flex flex-col sm:flex-row gap-2 justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleApproveClick}
                disabled={!isBalanced || !allMapped}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                title={
                  !isBalanced || !allMapped
                    ? 'Complete all mappings and balance JV to approve'
                    : 'Approve and generate JV'
                }
              >
                Approve & Generate JV
              </button>
              <button
                onClick={handleSaveMapping}
                disabled={isSaving || !isBalanced || !allMapped}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Saving...' : 'Save GL Mapping'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Journal Voucher Modal */}
      {showJVModal && jvData && (
        <JournalVoucherModal
          isOpen={showJVModal}
          onClose={() => setShowJVModal(false)}
          journalData={jvData}
          transactionDetails={transactionDetails}
        />
      )}
    </>
  )
}

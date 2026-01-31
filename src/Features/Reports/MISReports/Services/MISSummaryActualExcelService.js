// // /* eslint-disable no-unused-vars */
// // import ExcelJS from 'exceljs'
// // import { saveAs } from 'file-saver'

// // /**
// //  * MIS Summary Actual Excel Generation Service
// //  * Generates comprehensive MIS Summary report with dummy data
// //  * Matches the format from the provided image
// //  */

// // /**
// //  * Generate dummy data for MIS Summary Actual report
// //  * @param {Object} periodData - { year, month, monthName, stateName }
// //  * @returns {Object} Structured data for the report
// //  */
// // const generateDummyData = (periodData) => {
// //     try {
// //         const { year, month, monthName, stateName } = periodData

// //         // Generate 6 months of data (current month + 5 previous months)
// //         const months = []
// //         for (let i = 5; i >= 0; i--) {
// //             let m = month - i
// //             let y = year
// //             if (m <= 0) {
// //                 m += 12
// //                 y -= 1
// //             }
// //             const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
// //             months.push({
// //                 month: m,
// //                 year: y,
// //                 label: `${monthNames[m - 1]}-${y}`
// //             })
// //         }

// //         // Revenue data structure
// //         const revenueData = [
// //             { category: 'HOUSEKEEPING SERVICES', value: 4500000 },
// //             { category: 'MANPOWER SERVICES', value: 2800000 },
// //             { category: 'FACILITY MANAGEMENT', value: 1200000 },
// //             { category: 'DEEP CLEANING SERVICES', value: 450000 },
// //             { category: 'PEST CONTROL SERVICES', value: 180000 },
// //             { category: 'MATERIAL SUPPLY', value: 320000 },
// //             { category: 'MACHINERY RENTAL', value: 250000 },
// //             { category: 'OTHER SERVICES', value: 150000 }
// //         ]

// //         // Direct Expenses
// //         const directExpenses = [
// //             { category: 'SALARIES & WAGES', value: 3200000 },
// //             { category: 'EPF CONTRIBUTION', value: 384000 },
// //             { category: 'ESIC CONTRIBUTION', value: 128000 },
// //             { category: 'BONUS & INCENTIVES', value: 160000 },
// //             { category: 'STAFF WELFARE', value: 95000 },
// //             { category: 'UNIFORM EXPENSES', value: 85000 },
// //             { category: 'MATERIAL CONSUMED', value: 420000 },
// //             { category: 'CLEANING CONSUMABLES', value: 180000 },
// //             { category: 'MACHINERY MAINTENANCE', value: 125000 },
// //             { category: 'EQUIPMENT RENTAL', value: 95000 },
// //             { category: 'TRANSPORTATION', value: 145000 },
// //             { category: 'SITE EXPENSES', value: 78000 }
// //         ]

// //         // Indirect Expenses (Back Office)
// //         const indirectExpenses = [
// //             { category: 'OFFICE RENT', value: 125000 },
// //             { category: 'OFFICE SALARIES', value: 450000 },
// //             { category: 'OFFICE EPF', value: 54000 },
// //             { category: 'OFFICE ESIC', value: 18000 },
// //             { category: 'ELECTRICITY & WATER', value: 35000 },
// //             { category: 'TELEPHONE & INTERNET', value: 28000 },
// //             { category: 'OFFICE SUPPLIES', value: 22000 },
// //             { category: 'PROFESSIONAL FEES', value: 85000 },
// //             { category: 'AUDIT FEES', value: 45000 },
// //             { category: 'LEGAL FEES', value: 32000 },
// //             { category: 'BANK CHARGES', value: 18000 },
// //             { category: 'DEPRECIATION', value: 95000 },
// //             { category: 'INSURANCE', value: 42000 },
// //             { category: 'TRAVEL & CONVEYANCE', value: 55000 },
// //             { category: 'PRINTING & STATIONERY', value: 15000 },
// //             { category: 'REPAIRS & MAINTENANCE', value: 28000 },
// //             { category: 'MISCELLANEOUS EXPENSES', value: 35000 }
// //         ]

// //         // Generate monthly variations (±10% random variation)
// //         const generateMonthlyData = (baseData) => {
// //             return months.map(() => {
// //                 return baseData.map(item => ({
// //                     ...item,
// //                     value: Math.round(item.value * (0.9 + Math.random() * 0.2))
// //                 }))
// //             })
// //         }

// //         return {
// //             months,
// //             revenueData: generateMonthlyData(revenueData),
// //             directExpenses: generateMonthlyData(directExpenses),
// //             indirectExpenses: generateMonthlyData(indirectExpenses)
// //         }
// //     } catch (err) {
// //         console.error('generateDummyData error:', err)
// //         throw new Error('Failed to generate dummy data')
// //     }
// // }

// // /**
// //  * Apply header styling
// //  * @param {Object} cell - ExcelJS cell object
// //  */
// // const applyHeaderStyle = (cell) => {
// //     cell.fill = {
// //         type: 'pattern',
// //         pattern: 'solid',
// //         fgColor: { argb: 'FF0066CC' } // Blue background
// //     }
// //     cell.font = {
// //         bold: true,
// //         color: { argb: 'FFFFFFFF' }, // White text
// //         size: 11
// //     }
// //     cell.alignment = {
// //         horizontal: 'center',
// //         vertical: 'middle',
// //         wrapText: true
// //     }
// //     cell.border = {
// //         top: { style: 'thin', color: { argb: 'FF000000' } },
// //         left: { style: 'thin', color: { argb: 'FF000000' } },
// //         bottom: { style: 'thin', color: { argb: 'FF000000' } },
// //         right: { style: 'thin', color: { argb: 'FF000000' } }
// //     }
// // }

// // /**
// //  * Apply section header styling
// //  * @param {Object} cell - ExcelJS cell object
// //  */
// // const applySectionHeaderStyle = (cell) => {
// //     cell.fill = {
// //         type: 'pattern',
// //         pattern: 'solid',
// //         fgColor: { argb: 'FFD9E1F2' } // Light blue
// //     }
// //     cell.font = {
// //         bold: true,
// //         size: 10
// //     }
// //     cell.alignment = {
// //         horizontal: 'left',
// //         vertical: 'middle'
// //     }
// //     cell.border = {
// //         top: { style: 'thin', color: { argb: 'FF000000' } },
// //         left: { style: 'thin', color: { argb: 'FF000000' } },
// //         bottom: { style: 'thin', color: { argb: 'FF000000' } },
// //         right: { style: 'thin', color: { argb: 'FF000000' } }
// //     }
// // }

// // /**
// //  * Apply total row styling
// //  * @param {Object} cell - ExcelJS cell object
// //  */
// // const applyTotalStyle = (cell, isGrandTotal = false) => {
// //     cell.fill = {
// //         type: 'pattern',
// //         pattern: 'solid',
// //         fgColor: { argb: isGrandTotal ? 'FFFFD966' : 'FFFCE4D6' } // Yellow for grand total, light orange for subtotals
// //     }
// //     cell.font = {
// //         bold: true,
// //         size: 10
// //     }
// //     cell.alignment = {
// //         horizontal: cell.value && typeof cell.value === 'number' ? 'right' : 'left',
// //         vertical: 'middle'
// //     }
// //     cell.border = {
// //         top: { style: 'thin', color: { argb: 'FF000000' } },
// //         left: { style: 'thin', color: { argb: 'FF000000' } },
// //         bottom: { style: 'thin', color: { argb: 'FF000000' } },
// //         right: { style: 'thin', color: { argb: 'FF000000' } }
// //     }
// // }

// // /**
// //  * Apply data cell styling
// //  * @param {Object} cell - ExcelJS cell object
// //  */
// // const applyDataCellStyle = (cell, isNumeric = false) => {
// //     cell.alignment = {
// //         horizontal: isNumeric ? 'right' : 'left',
// //         vertical: 'middle'
// //     }
// //     cell.border = {
// //         top: { style: 'thin', color: { argb: 'FFD0D0D0' } },
// //         left: { style: 'thin', color: { argb: 'FFD0D0D0' } },
// //         bottom: { style: 'thin', color: { argb: 'FFD0D0D0' } },
// //         right: { style: 'thin', color: { argb: 'FFD0D0D0' } }
// //     }
// //     if (isNumeric) {
// //         cell.numFmt = '#,##0'
// //     }
// // }

// // /**
// //  * Generate and download MIS Summary Actual Excel report
// //  * @param {Object} periodData - { year, month, monthName, stateName }
// //  */
// // export const generateMISSummaryActualExcel = async (periodData) => {
// //     try {
// //         console.log('Generating MIS Summary Actual Excel for:', periodData)

// //         // Create workbook
// //         const workbook = new ExcelJS.Workbook()
// //         workbook.creator = 'Urban Facility Services'
// //         workbook.created = new Date()

// //         // Create worksheet
// //         const worksheet = workbook.addWorksheet('MIS Summary Actual', {
// //             pageSetup: {
// //                 paperSize: 9, // A4
// //                 orientation: 'landscape',
// //                 fitToPage: true,
// //                 fitToWidth: 1,
// //                 fitToHeight: 0
// //             }
// //         })

// //         // Generate dummy data
// //         const data = generateDummyData(periodData)

// //         // Set column widths
// //         worksheet.columns = [
// //             { width: 35 }, // Particulars
// //             { width: 12 }, // Month 1
// //             { width: 12 }, // Month 2
// //             { width: 12 }, // Month 3
// //             { width: 12 }, // Month 4
// //             { width: 12 }, // Month 5
// //             { width: 12 }, // Month 6
// //             { width: 14 }  // Total
// //         ]

// //         let currentRow = 1

// //         // Title Row
// //         const titleCell = worksheet.getCell(`A${currentRow}`)
// //         titleCell.value = 'URBAN FACILITY SERVICES PVT LTD'
// //         titleCell.font = { bold: true, size: 14, color: { argb: 'FF0066CC' } }
// //         titleCell.alignment = { horizontal: 'center', vertical: 'middle' }
// //         worksheet.mergeCells(`A${currentRow}:H${currentRow}`)
// //         currentRow++

// //         // Subtitle Row
// //         const subtitleCell = worksheet.getCell(`A${currentRow}`)
// //         subtitleCell.value = `MIS SUMMARY - ACTUAL - ${periodData.stateName || 'ALL STATES'}`
// //         subtitleCell.font = { bold: true, size: 12 }
// //         subtitleCell.alignment = { horizontal: 'center', vertical: 'middle' }
// //         worksheet.mergeCells(`A${currentRow}:H${currentRow}`)
// //         currentRow++

// //         // Period Row
// //         const periodCell = worksheet.getCell(`A${currentRow}`)
// //         periodCell.value = `Period: ${data.months[0].label} to ${data.months[5].label}`
// //         periodCell.font = { italic: true, size: 10 }
// //         periodCell.alignment = { horizontal: 'center', vertical: 'middle' }
// //         worksheet.mergeCells(`A${currentRow}:H${currentRow}`)
// //         currentRow++

// //         // Empty row
// //         currentRow++

// //         // Header Row
// //         const headerRow = worksheet.getRow(currentRow)
// //         headerRow.values = [
// //             'PARTICULARS',
// //             ...data.months.map(m => m.label),
// //             'TOTAL'
// //         ]
// //         headerRow.height = 25
// //         headerRow.eachCell((cell) => {
// //             applyHeaderStyle(cell)
// //         })
// //         currentRow++

// //         // Helper function to add data rows
// //         const addDataRows = (dataArray, monthIndex) => {
// //             return dataArray.map(item => item.value)
// //         }

// //         // Helper function to calculate row totals
// //         const calculateRowTotal = (values) => {
// //             return values.reduce((sum, val) => sum + val, 0)
// //         }

// //         // REVENUE SECTION
// //         const revenueSectionRow = worksheet.getRow(currentRow)
// //         revenueSectionRow.values = ['REVENUE']
// //         revenueSectionRow.getCell(1).value = 'REVENUE'
// //         applySectionHeaderStyle(revenueSectionRow.getCell(1))
// //         worksheet.mergeCells(`A${currentRow}:H${currentRow}`)
// //         currentRow++

// //         // Revenue line items
// //         const revenueRows = []
// //         data.revenueData[0].forEach((item, idx) => {
// //             const row = worksheet.getRow(currentRow)
// //             const monthlyValues = data.months.map((_, monthIdx) => data.revenueData[monthIdx][idx].value)
// //             const total = calculateRowTotal(monthlyValues)

// //             row.values = [
// //                 `  ${item.category}`,
// //                 ...monthlyValues,
// //                 total
// //             ]

// //             applyDataCellStyle(row.getCell(1), false)
// //             for (let i = 2; i <= 8; i++) {
// //                 applyDataCellStyle(row.getCell(i), true)
// //             }

// //             revenueRows.push(currentRow)
// //             currentRow++
// //         })

// //         // Total Revenue
// //         const totalRevenueRow = worksheet.getRow(currentRow)
// //         const totalRevenueValues = data.months.map((_, monthIdx) => {
// //             return data.revenueData[monthIdx].reduce((sum, item) => sum + item.value, 0)
// //         })
// //         const grandTotalRevenue = calculateRowTotal(totalRevenueValues)

// //         totalRevenueRow.values = [
// //             'TOTAL REVENUE',
// //             ...totalRevenueValues,
// //             grandTotalRevenue
// //         ]
// //         totalRevenueRow.eachCell((cell) => {
// //             applyTotalStyle(cell, false)
// //         })
// //         currentRow++

// //         // Empty row
// //         currentRow++

// //         // DIRECT EXPENSES SECTION
// //         const directExpSectionRow = worksheet.getRow(currentRow)
// //         directExpSectionRow.values = ['DIRECT EXPENSES']
// //         applySectionHeaderStyle(directExpSectionRow.getCell(1))
// //         worksheet.mergeCells(`A${currentRow}:H${currentRow}`)
// //         currentRow++

// //         // Direct expense line items
// //         data.directExpenses[0].forEach((item, idx) => {
// //             const row = worksheet.getRow(currentRow)
// //             const monthlyValues = data.months.map((_, monthIdx) => data.directExpenses[monthIdx][idx].value)
// //             const total = calculateRowTotal(monthlyValues)

// //             row.values = [
// //                 `  ${item.category}`,
// //                 ...monthlyValues,
// //                 total
// //             ]

// //             applyDataCellStyle(row.getCell(1), false)
// //             for (let i = 2; i <= 8; i++) {
// //                 applyDataCellStyle(row.getCell(i), true)
// //             }

// //             currentRow++
// //         })

// //         // Total Direct Expenses
// //         const totalDirectExpRow = worksheet.getRow(currentRow)
// //         const totalDirectExpValues = data.months.map((_, monthIdx) => {
// //             return data.directExpenses[monthIdx].reduce((sum, item) => sum + item.value, 0)
// //         })
// //         const grandTotalDirectExp = calculateRowTotal(totalDirectExpValues)

// //         totalDirectExpRow.values = [
// //             'TOTAL DIRECT EXPENSES',
// //             ...totalDirectExpValues,
// //             grandTotalDirectExp
// //         ]
// //         totalDirectExpRow.eachCell((cell) => {
// //             applyTotalStyle(cell, false)
// //         })
// //         currentRow++

// //         // Empty row
// //         currentRow++

// //         // GROSS PROFIT
// //         const grossProfitRow = worksheet.getRow(currentRow)
// //         const grossProfitValues = data.months.map((_, monthIdx) => {
// //             const revenue = data.revenueData[monthIdx].reduce((sum, item) => sum + item.value, 0)
// //             const directExp = data.directExpenses[monthIdx].reduce((sum, item) => sum + item.value, 0)
// //             return revenue - directExp
// //         })
// //         const grandGrossProfit = calculateRowTotal(grossProfitValues)

// //         grossProfitRow.values = [
// //             'GROSS PROFIT',
// //             ...grossProfitValues,
// //             grandGrossProfit
// //         ]
// //         grossProfitRow.eachCell((cell) => {
// //             applyTotalStyle(cell, true)
// //         })
// //         currentRow++

// //         // Empty row
// //         currentRow++

// //         // INDIRECT EXPENSES SECTION
// //         const indirectExpSectionRow = worksheet.getRow(currentRow)
// //         indirectExpSectionRow.values = ['INDIRECT EXPENSES (BACK OFFICE)']
// //         applySectionHeaderStyle(indirectExpSectionRow.getCell(1))
// //         worksheet.mergeCells(`A${currentRow}:H${currentRow}`)
// //         currentRow++

// //         // Indirect expense line items
// //         data.indirectExpenses[0].forEach((item, idx) => {
// //             const row = worksheet.getRow(currentRow)
// //             const monthlyValues = data.months.map((_, monthIdx) => data.indirectExpenses[monthIdx][idx].value)
// //             const total = calculateRowTotal(monthlyValues)

// //             row.values = [
// //                 `  ${item.category}`,
// //                 ...monthlyValues,
// //                 total
// //             ]

// //             applyDataCellStyle(row.getCell(1), false)
// //             for (let i = 2; i <= 8; i++) {
// //                 applyDataCellStyle(row.getCell(i), true)
// //             }

// //             currentRow++
// //         })

// //         // Total Indirect Expenses
// //         const totalIndirectExpRow = worksheet.getRow(currentRow)
// //         const totalIndirectExpValues = data.months.map((_, monthIdx) => {
// //             return data.indirectExpenses[monthIdx].reduce((sum, item) => sum + item.value, 0)
// //         })
// //         const grandTotalIndirectExp = calculateRowTotal(totalIndirectExpValues)

// //         totalIndirectExpRow.values = [
// //             'TOTAL INDIRECT EXPENSES',
// //             ...totalIndirectExpValues,
// //             grandTotalIndirectExp
// //         ]
// //         totalIndirectExpRow.eachCell((cell) => {
// //             applyTotalStyle(cell, false)
// //         })
// //         currentRow++

// //         // Empty row
// //         currentRow++

// //         // NET PROFIT
// //         const netProfitRow = worksheet.getRow(currentRow)
// //         const netProfitValues = grossProfitValues.map((gp, idx) => gp - totalIndirectExpValues[idx])
// //         const grandNetProfit = calculateRowTotal(netProfitValues)

// //         netProfitRow.values = [
// //             'NET PROFIT',
// //             ...netProfitValues,
// //             grandNetProfit
// //         ]
// //         netProfitRow.eachCell((cell) => {
// //             applyTotalStyle(cell, true)
// //         })
// //         currentRow++

// //         // Empty row
// //         currentRow++

// //         // NET PROFIT %
// //         const netProfitPctRow = worksheet.getRow(currentRow)
// //         const netProfitPctValues = netProfitValues.map((np, idx) => {
// //             const revenue = totalRevenueValues[idx]
// //             return revenue > 0 ? ((np / revenue) * 100).toFixed(2) + '%' : '0%'
// //         })
// //         const avgNetProfitPct = grandTotalRevenue > 0
// //             ? ((grandNetProfit / grandTotalRevenue) * 100).toFixed(2) + '%'
// //             : '0%'

// //         netProfitPctRow.values = [
// //             'NET PROFIT %',
// //             ...netProfitPctValues,
// //             avgNetProfitPct
// //         ]
// //         netProfitPctRow.eachCell((cell, colNumber) => {
// //             applyTotalStyle(cell, true)
// //             if (colNumber > 1) {
// //                 cell.alignment = { horizontal: 'right', vertical: 'middle' }
// //             }
// //         })

// //         // Generate buffer
// //         const buffer = await workbook.xlsx.writeBuffer()

// //         // Create filename
// //         const filename = `MIS_Summary_Actual_${periodData.monthName}_${periodData.year}_${periodData.stateName || 'All'}.xlsx`

// //         // Save file
// //         const blob = new Blob([buffer], {
// //             type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
// //         })
// //         saveAs(blob, filename)

// //         console.log('MIS Summary Actual Excel generated successfully:', filename)
// //         return { success: true, filename }
// //     } catch (err) {
// //         console.error('generateMISSummaryActualExcel error:', err)
// //         throw new Error(err.message || 'Failed to generate MIS Summary Actual Excel report')
// //     }
// // }

// // export default {
// //     generateMISSummaryActualExcel
// // }


// //******************************************************** */
// /* eslint-disable no-unused-vars */
// import ExcelJS from 'exceljs'
// import { saveAs } from 'file-saver'

// /**
//  * MIS Summary Actual Excel Generation Service - COMPLETE DATA
//  * Generates comprehensive MIS Summary report with actual data from uploaded file
//  * I SMART FACITECH PVT LTD - PAN INDIA MIS REPORT MONTHWISE - BIFURCATION
//  */

// /**
//  * Complete actual data structure matching the uploaded Excel file
//  * All amounts in INR, Period: Apr 25 to Oct 25
//  */
// const ACTUAL_MIS_DATA = {
//     companyName: 'I SMART FACITECH PVT LTD',
//     reportTitle: 'PAN INDIA MIS REPORT MONTHWISE - BIFURCATION',
//     period: 'Period  Apr 25 to Oct 25',

//     // Month headers
//     months: [
//         { label: "Apr'25", col: 'C' },
//         { label: "May'25", col: 'E' },
//         { label: "Jun'25", col: 'G' },
//         { label: "July'25", col: 'I' },
//         { label: "August'25", col: 'K' },
//         { label: "Sept'25", col: 'M' },
//         { label: "Oct'25", col: 'O' }
//     ],

//     // Revenue Section
//     revenue: {
//         grossSales: {
//             glCode: '',
//             description: 'Gross Sales ( excluding Other Income )',
//             apr25: 104309367.00,
//             may25: 112070774.53,
//             jun25: 112425862.31,
//             jul25: 112231913.38,
//             aug25: 105028135.93,
//             sep25: 104688444.51,
//             oct25: 135611733.07,
//             total: 786366230.73
//         },
//         breakdown: [
//             {
//                 glCode: 'R1001001',
//                 description: 'HOUSE KEEPING CHARGES(R1001001)',
//                 apr25: 104309367.00,
//                 may25: 112070774.53,
//                 jun25: 112425862.31,
//                 jul25: 112231913.38,
//                 aug25: 105028135.93,
//                 sep25: 104688444.51,
//                 oct25: 135611733.07,
//                 total: 786366230.73
//             },
//             {
//                 glCode: 'R1001004',
//                 description: 'OVERSEAS CONSULTANCY SERVICE FEES (EXPORT)(R1001004)',
//                 apr25: 0, may25: 0, jun25: 0, jul25: 0, aug25: 0, sep25: 0, oct25: 0, total: 0
//             },
//             {
//                 glCode: 'R1001002',
//                 description: 'HOUSE KEEPING CHARGES (EXEMPT)(R1001002)',
//                 apr25: 0, may25: 0, jun25: 0, jul25: 0, aug25: 0, sep25: 0, oct25: 0, total: 0
//             },
//             {
//                 glCode: 'R1001003',
//                 description: 'SERVICE CHARGES(R1001003)',
//                 apr25: 0, may25: 0, jun25: 0, jul25: 0, aug25: 0, sep25: 0, oct25: 0, total: 0
//             }
//         ]
//     },

//     // Operating Costs
//     operatingCosts: {
//         // Employee Cost FO
//         employeeCostFO: {
//             subtitle: 'Employee cost FO',
//             total: {
//                 apr25: 88377121, may25: 95992892, jun25: 95467152, jul25: 94292628,
//                 aug25: 87474777, sep25: 89317619.85, oct25: 119739239, total: 670661428.85
//             },
//             items: [
//                 {
//                     glCode: 'X1001001001001',
//                     description: 'FO - BASIC SALARIES (X1001001001001)',
//                     apr25: 42896064, may25: 44095463, jun25: 44272117, jul25: 45793431,
//                     aug25: 42437728, sep25: 41880260, oct25: 51841674, total: 313216737
//                 },
//                 {
//                     glCode: 'X1001001001002',
//                     description: 'FO - DEARNESS ALLOWANCE (DA)(X1001001001002)',
//                     apr25: 14496082, may25: 14240003, jun25: 14801833, jul25: 15072923,
//                     aug25: 12946296, sep25: 12524186, oct25: 15652080, total: 99733403
//                 },
//                 {
//                     glCode: 'X1001001001003',
//                     description: 'FO - HOUSE RENT ALLOWANCE-HRA(X1001001001003)',
//                     apr25: 3111677, may25: 3081587, jun25: 3212842, jul25: 3344618,
//                     aug25: 3020819, sep25: 3074782, oct25: 3453491, total: 22299816
//                 },
//                 {
//                     glCode: 'X1001001001004',
//                     description: 'FO - OTHER ALLOWANCE(X1001001001004)',
//                     apr25: 6736656, may25: 12885100, jun25: 10281912, jul25: 6993811,
//                     aug25: 7925356, sep25: 7387076, oct25: 8299620, total: 60509531
//                 },
//                 {
//                     glCode: 'X1001001001005',
//                     description: 'FO - EDUCATION ALLOWANCE(X1001001001005)',
//                     apr25: 1900, may25: 1900, jun25: 1900, jul25: 1900,
//                     aug25: 1900, sep25: 1900, oct25: 1900, total: 13300
//                 },
//                 {
//                     glCode: 'X1001001001006',
//                     description: 'FO - BONUS(X1001001001006)',
//                     apr25: 2441842, may25: 2711999, jun25: 2758814, jul25: 3205241,
//                     aug25: 2751630, sep25: 2767352, oct25: 19487280, total: 36124158
//                 },
//                 {
//                     glCode: 'X1001001001007',
//                     description: 'FO - MEDICAL EXP.(X1001001001007)',
//                     apr25: 83449, may25: 83808, jun25: 80537, jul25: 85653,
//                     aug25: 83756, sep25: 79890, oct25: 79342, total: 576435
//                 },
//                 {
//                     glCode: 'X1001001001008',
//                     description: 'FO - OTHER DEDUCTION/NOTICE PERIOD(X1001001001008)',
//                     apr25: -211855, may25: -201325, jun25: -151807, jul25: -246818,
//                     aug25: -166101, sep25: -151004, oct25: -179308, total: -1308218
//                 },
//                 {
//                     glCode: 'X1001001001009',
//                     description: 'FO - LEAVE ENCASHMENT(X1001001001009)',
//                     apr25: 1615913, may25: 2629043, jun25: 3766446, jul25: 2822115,
//                     aug25: 2382798, sep25: 6260033.85, oct25: 3702084, total: 23178432.85
//                 },
//                 {
//                     glCode: 'X1001001001010',
//                     description: 'FO - GRATUITY(X1001001001010)',
//                     apr25: 181446, may25: 182167, jun25: 0, jul25: 0,
//                     aug25: 0, sep25: 179138, oct25: 0, total: 542751
//                 },
//                 {
//                     glCode: 'X1001001001011',
//                     description: 'FO - LABOUR WELFARE FUND(X1001001001011)',
//                     apr25: 12531, may25: 12686, jun25: 211304, jul25: 13009,
//                     aug25: 13157, sep25: 12842, oct25: 17170, total: 292699
//                 },
//                 {
//                     glCode: 'X1001001001012',
//                     description: 'FO - INSURANCE(X1001001001012)',
//                     apr25: 0, may25: 268, jun25: 12715, jul25: 0,
//                     aug25: 37510, sep25: 14750, oct25: 0, total: 65243
//                 },
//                 {
//                     glCode: 'X1001001001013',
//                     description: 'FO - E.S.I.C.(X1001001001013)',
//                     apr25: 2125795, may25: 2188193, jun25: 2206234, jul25: 2386539,
//                     aug25: 2048537, sep25: 2016903, oct25: 2495251, total: 15467452
//                 },
//                 {
//                     glCode: 'X1001001001014',
//                     description: 'FO - PROVIDENT FUND(X1001001001014)',
//                     apr25: 7569723, may25: 7782735, jun25: 7820782, jul25: 8497306,
//                     aug25: 7431141, sep25: 7323999, oct25: 9085018, total: 55510704
//                 },
//                 {
//                     glCode: 'X1001001001015',
//                     description: 'FO - OVERTIME (X1001001001015)',
//                     apr25: 6933839, may25: 5925566, jun25: 5782199, jul25: 5843559,
//                     aug25: 6080040, sep25: 5447822, oct25: 5222706, total: 41235731
//                 },
//                 {
//                     glCode: 'X1001001001016',
//                     description: 'FO - CONVEYANCE ALLOWANCE (X1001001001016)',
//                     apr25: 286889, may25: 276845, jun25: 309313, jul25: 365355,
//                     aug25: 355151, sep25: 369140, oct25: 397454, total: 2360147
//                 },
//                 {
//                     glCode: 'X1001001001017',
//                     description: 'FO - EX-GRATIA(X1001001001017)',
//                     apr25: 0, may25: 0, jun25: 0, jul25: 0,
//                     aug25: 0, sep25: 0, oct25: 39739, total: 39739
//                 },
//                 {
//                     glCode: 'X1001001001018',
//                     description: 'FO - WASHING ALLOWANCE(X1001001001018)',
//                     apr25: 95059, may25: 93039, jun25: 100011, jul25: 101923,
//                     aug25: 101963, sep25: 102838, oct25: 98738, total: 693571
//                 },
//                 {
//                     glCode: 'X1001001001019',
//                     description: 'FO - NOTICE PAY SALARY',
//                     apr25: 0, may25: 0, jun25: 0, jul25: 0,
//                     aug25: 0, sep25: 0, oct25: 0, total: 0
//                 },
//                 {
//                     glCode: 'X1001001001021',
//                     description: 'FO - PERFORMANCE INCENTIVE',
//                     apr25: 0, may25: 0, jun25: 0, jul25: 10500,
//                     aug25: 0, sep25: 0, oct25: 45000, total: 55500
//                 },
//                 {
//                     glCode: 'X1001001001022',
//                     description: 'FO - LEAVE TRAVEL ALLOWANCE',
//                     apr25: 0, may25: 0, jun25: 0, jul25: 0,
//                     aug25: 0, sep25: 0, oct25: 0, total: 0
//                 },
//                 {
//                     glCode: 'X1001002002',
//                     description: 'FO - CONVEYANCE(X1001002002)',
//                     apr25: 0, may25: 0, jun25: 0, jul25: 1563,
//                     aug25: 23096, sep25: 25712, oct25: 0, total: 50371
//                 },
//                 {
//                     glCode: 'X1001002003',
//                     description: 'FO - TRAVELIING EXPENSES(X1001002003)',
//                     apr25: 111, may25: 3815, jun25: 0, jul25: 0,
//                     aug25: 0, sep25: 0, oct25: 0, total: 3926
//                 }
//             ]
//         },

//         // Material FO
//         materialFO: {
//             subtitle: 'Material -FO',
//             total: {
//                 apr25: 3684556.73, may25: 4016127.27, jun25: 4140597.74, jul25: 4796634.62,
//                 aug25: 4246615.03, sep25: 4162854.50, oct25: 4428653.66, total: 29476039.55
//             },
//             items: [
//                 {
//                     glCode: 'X1001003001',
//                     description: 'PURCHASES - CATERING(X1001003001)',
//                     apr25: 0, may25: 0, jun25: 0, jul25: 0,
//                     aug25: 0, sep25: 0, oct25: 0, total: 0
//                 },
//                 {
//                     glCode: 'X1001003002',
//                     description: 'PURCHASES - OVERSEAS',
//                     apr25: 0, may25: 0, jun25: 0, jul25: 0,
//                     aug25: 0, sep25: 0, oct25: 0, total: 0
//                 },
//                 {
//                     glCode: 'X1001004001',
//                     description: 'PURCHASE - HOUSEKEEPING MATERIAL(X1001004001)',
//                     apr25: 2811328.55, may25: 3180833.27, jun25: 3571064.98, jul25: 3985577.62,
//                     aug25: 3462295.03, sep25: 3361655.47, oct25: 3644237, total: 24016991.92
//                 },
//                 {
//                     glCode: 'X1001004002',
//                     description: 'PURCHASE - STAFF UNIFORM(X1001004002)',
//                     apr25: 873228.18, may25: 835294, jun25: 569532.76, jul25: 811057,
//                     aug25: 784320, sep25: 801199.03, oct25: 784416.66, total: 5459047.63
//                 }
//             ]
//         },

//         // Administration FO
//         administrationFO: {
//             subtitle: 'Administration -FO',
//             total: {
//                 apr25: 2465649.54, may25: 2579353.93, jun25: 3395206.34, jul25: 3309900.76,
//                 aug25: 3668616.18, sep25: 3499747.87, oct25: 2894165.10, total: 21812639.72
//             },
//             items: [
//                 {
//                     glCode: 'X1001001002001',
//                     description: 'SUB CONTRACTORS EXP(X1001001002001)',
//                     apr25: 289621.20, may25: 352122, jun25: 641034.40, jul25: 534664.30,
//                     aug25: 498807, sep25: 212520.30, oct25: 219843, total: 2748612.20
//                 },
//                 {
//                     glCode: 'X1001001002002',
//                     description: 'SUB CONTRACTORS - AMC VENDORS(X1001001002002)',
//                     apr25: 0, may25: 0, jun25: 0, jul25: 0,
//                     aug25: 0, sep25: 0, oct25: 0, total: 0
//                 },
//                 {
//                     glCode: 'X1001002004',
//                     description: 'REIMBURSEMENT OF TRAVEL EXP - OVS',
//                     apr25: 0, may25: 0, jun25: 0, jul25: 0,
//                     aug25: 0, sep25: 0, oct25: 0, total: 0
//                 },
//                 {
//                     glCode: 'X1001002005',
//                     description: 'GUEST HOUSE EXPENSES',
//                     apr25: 76301.34, may25: 71675.98, jun25: 70965.84, jul25: 76731,
//                     aug25: 106232.33, sep25: 133370.24, oct25: 79572.10, total: 614848.83
//                 },
//                 {
//                     glCode: 'X1001004005',
//                     description: 'LAUNDRY CHARGES(X1001004005)',
//                     apr25: 0, may25: 0, jun25: 0, jul25: 12124,
//                     aug25: 12250, sep25: 0, oct25: 0, total: 24374
//                 },
//                 {
//                     glCode: 'X1001005001',
//                     description: 'REIMBURSABLE EXPENSES(X1001005001)',
//                     apr25: 0, may25: 0, jun25: 0, jul25: 0,
//                     aug25: 0, sep25: 0, oct25: 0, total: 0
//                 },
//                 {
//                     glCode: 'X1001006001',
//                     description: 'REPAIRS & MAINTANANCE (SITE LEVEL)(X1001006001)',
//                     apr25: 26237, may25: 0, jun25: 32400, jul25: 2775,
//                     aug25: 49300, sep25: 130970.03, oct25: 14000, total: 255682.03
//                 },
//                 {
//                     glCode: 'X1001006002',
//                     description: 'REPAIRS & MAINTANANCE (SPARES)(X1001006002)',
//                     apr25: 0, may25: 0, jun25: 0, jul25: 28333,
//                     aug25: 56943, sep25: 21805, oct25: 1569, total: 108650
//                 },
//                 {
//                     glCode: 'X1001006003',
//                     description: 'LEASE RENTAL - MACHINERIES(X1001006003)',
//                     apr25: 0, may25: 0, jun25: 0, jul25: 0,
//                     aug25: 0, sep25: 28000, oct25: 0, total: 28000
//                 },
//                 {
//                     glCode: 'X1001008',
//                     description: 'LABOUR CHARGES(X1001008)',
//                     apr25: 0, may25: 0, jun25: 0, jul25: 0,
//                     aug25: 0, sep25: 0, oct25: 0, total: 0
//                 },
//                 {
//                     glCode: 'X1002001',
//                     description: 'FOODS & BEVERAGES TO EMPLOYEES(X1002001)',
//                     apr25: 66000, may25: 67400, jun25: 69090, jul25: 67900,
//                     aug25: 70710, sep25: 70713, oct25: 69112, total: 480925
//                 },
//                 {
//                     glCode: 'X1002002',
//                     description: 'OTHER PRODUCTION COSTS(X1002002)',
//                     apr25: 0, may25: 0, jun25: 0, jul25: 0,
//                     aug25: 0, sep25: 0, oct25: 0, total: 0
//                 },
//                 {
//                     glCode: 'X1002003',
//                     description: 'POLICE VERIFICATION CHARGES(X1002003)',
//                     apr25: 0, may25: 0, jun25: 0, jul25: 0,
//                     aug25: 0, sep25: 0, oct25: 0, total: 0
//                 },
//                 {
//                     glCode: 'X1002004',
//                     description: 'IDENTITY CARD EXPENSES(X1002004)',
//                     apr25: 0, may25: 0, jun25: 0, jul25: 0,
//                     aug25: 0, sep25: 0, oct25: 0, total: 0
//                 },
//                 {
//                     glCode: 'X1002005',
//                     description: 'STAFF WELFARE (SITE LEVEL)(X1002005)',
//                     apr25: 0, may25: 0, jun25: 0, jul25: 0,
//                     aug25: 0, sep25: 0, oct25: 0, total: 0
//                 },
//                 {
//                     glCode: 'X1002006',
//                     description: 'ELECTRICITY CHRGS (SITE LEVEL)(X1002006)',
//                     apr25: 7903, may25: 0, jun25: 0, jul25: 0,
//                     aug25: 0, sep25: 0, oct25: 1500, total: 9403
//                 },
//                 {
//                     glCode: 'X1002007',
//                     description: 'RENT ( SITE LEVEL)(X1002007)',
//                     apr25: 127061, may25: 108296, jun25: 97171, jul25: 104751,
//                     aug25: 100601, sep25: 104240, oct25: 104855, total: 746975
//                 },
//                 {
//                     glCode: 'X1002008',
//                     description: 'TRAINING COSTS(X1002008)',
//                     apr25: 0, may25: 0, jun25: 0, jul25: 0,
//                     aug25: 0, sep25: 0, oct25: 0, total: 0
//                 },
//                 {
//                     glCode: 'X1002009',
//                     description: 'CONVEYANCE EXP ( SITE LEVEL)(X1002009)',
//                     apr25: 0, may25: 0, jun25: 0, jul25: 0,
//                     aug25: 0, sep25: 0, oct25: 0, total: 0
//                 },
//                 {
//                     glCode: 'X1002010',
//                     description: 'BIKE RENT (SITE LEVEL)(X1002010)',
//                     apr25: 0, may25: 0, jun25: 0, jul25: 0,
//                     aug25: 0, sep25: 0, oct25: 0, total: 0
//                 },
//                 {
//                     glCode: 'X1002011',
//                     description: 'VISIT CHARGES (SITE LEVEL)(X1002011)',
//                     apr25: 0, may25: 0, jun25: 0, jul25: 0,
//                     aug25: 0, sep25: 2000, oct25: 0, total: 2000
//                 },
//                 {
//                     glCode: 'X1002012',
//                     description: 'FUEL EXPENSES (SITE LEVEL)(X1002012)',
//                     apr25: 0, may25: 0, jun25: 0, jul25: 0,
//                     aug25: 0, sep25: 0, oct25: 0, total: 0
//                 },
//                 {
//                     glCode: 'X1002013',
//                     description: 'SITE EXPENSES(X1002013)',
//                     apr25: 1126295, may25: 1535920.95, jun25: 1938064.10, jul25: 1881487.60,
//                     aug25: 2245991.85, sep25: 2249857.80, oct25: 2056100, total: 13033717.30
//                 },
//                 {
//                     glCode: 'X1002014',
//                     description: 'MOBILISATION COST(X1002014)',
//                     apr25: 0, may25: 0, jun25: 0, jul25: 0,
//                     aug25: 0, sep25: 0, oct25: 0, total: 0
//                 },
//                 {
//                     glCode: 'X1002015',
//                     description: 'PROFESSIONAL CHG - SITE',
//                     apr25: 0, may25: 46558, jun25: 0, jul25: 17953.86,
//                     aug25: 6000, sep25: 0, oct25: 0, total: 70511.86
//                 },
//                 {
//                     glCode: 'X2001002036',
//                     description: 'EMPLOYEES COMPENSATION INSURANSE POLICY(X2001002036)',
//                     apr25: 2264, may25: 2264, jun25: 2264, jul25: 2264,
//                     aug25: 2264, sep25: 2264, oct25: 2264, total: 15848
//                 },
//                 {
//                     glCode: 'X2001002038',
//                     description: 'CLEANING CHARGES(X2001002038)',
//                     apr25: 0, may25: 0, jun25: 0, jul25: 0,
//                     aug25: 0, sep25: 0, oct25: 0, total: 0
//                 },
//                 {
//                     glCode: 'X2001002039',
//                     description: 'LOUNDRY CHARGES(X2001002039)',
//                     apr25: 0, may25: 0, jun25: 0, jul25: 0,
//                     aug25: 0, sep25: 0, oct25: 0, total: 0
//                 },
//                 {
//                     glCode: 'X2001002042',
//                     description: 'PROJECT EXECUTION EXPENSES(X2001002042)',
//                     apr25: 0, may25: 0, jun25: 0, jul25: 0,
//                     aug25: 0, sep25: 0, oct25: 0, total: 0
//                 },
//                 {
//                     glCode: 'X2001002002',
//                     description: 'BUSINESS PROMOTION(X2001002002)',
//                     apr25: 743967, may25: 395117, jun25: 544217, jul25: 580917,
//                     aug25: 519517, sep25: 544007.50, oct25: 345350, total: 3673092.50
//                 },
//                 {
//                     glCode: 'X1001007003',
//                     description: 'SLA DEDUCTION',
//                     apr25: 0, may25: 0, jun25: 0, jul25: 0,
//                     aug25: 0, sep25: 0, oct25: 0, total: 0
//                 },
//                 {
//                     glCode: 'X2001002053',
//                     description: 'TRANSPORT, FUEL, TOLL & OTHER EXPENSES - OVERSEAS',
//                     apr25: 0, may25: 0, jun25: 0, jul25: 0,
//                     aug25: 0, sep25: 0, oct25: 0, total: 0
//                 }
//             ]
//         },

//         // Employee Cost OPS
//         employeeCostOPS: {
//             subtitle: 'Employee cost -OPS',
//             total: { apr25: 0, may25: 0, jun25: 0, jul25: 0, aug25: 0, sep25: 0, oct25: 0, total: 0 },
//             items: []
//         },

//         // Material & other reimb-OPS
//         materialOPS: {
//             subtitle: 'Material & other reimb-OPS',
//             total: { apr25: 0, may25: 0, jun25: 0, jul25: 0, aug25: 0, sep25: 0, oct25: 0, total: 0 },
//             items: []
//         },

//         // Administration OPS
//         administrationOPS: {
//             subtitle: 'Administration -OPS',
//             total: {
//                 apr25: 7113, may25: 3378, jun25: 1400, jul25: 4807,
//                 aug25: 3271, sep25: 11501, oct25: 1491, total: 32961
//             },
//             items: [
//                 {
//                     glCode: 'X1001002001',
//                     description: 'TRANSPORTATION (MANPOWER)(X1001002001)',
//                     apr25: 0, may25: 0, jun25: 0, jul25: 0,
//                     aug25: 0, sep25: 0, oct25: 0, total: 0
//                 },
//                 {
//                     glCode: 'X1001004003',
//                     description: 'TRANSPORTATION - HK MATERIAL(X1001004003)',
//                     apr25: 5228, may25: 3378, jun25: 1000, jul25: 4307,
//                     aug25: 3071, sep25: 9401, oct25: 1491, total: 27876
//                 },
//                 {
//                     glCode: 'X1001004004',
//                     description: 'LOADING & UNLOADING EXPENSES(X1001004004)',
//                     apr25: 1885, may25: 0, jun25: 400, jul25: 500,
//                     aug25: 200, sep25: 2100, oct25: 0, total: 5085
//                 },
//                 {
//                     glCode: 'X1001007001',
//                     description: 'PROVISION FOR BAD DEBT(X1001007001)',
//                     apr25: 0, may25: 0, jun25: 0, jul25: 0,
//                     aug25: 0, sep25: 0, oct25: 0, total: 0
//                 }
//             ]
//         }
//     },

//     // Total Operating Cost and Margins
//     totals: {
//         totalOperatingCost: {
//             apr25: 94534440.27, may25: 102591751.20, jun25: 103004356.08, jul25: 102403970.38,
//             aug25: 95393279.21, sep25: 96991723.22, oct25: 127063548.76, total: 721983069.12
//         },
//         grossOperatingMargin: {
//             apr25: 9774926.73, may25: 9479023.33, jun25: 9421506.23, jul25: 9827943.00,
//             aug25: 9634856.72, sep25: 7696721.29, oct25: 8548184.31, total: 64383161.61
//         }
//     },

//     // Non-Billable Costs
//     nonBillableCosts: {
//         // Employee Cost Management
//         employeeCostManagement: {
//             subtitle: 'Employee Cost - Management',
//             total: { apr25: 0, may25: 0, jun25: 0, jul25: 0, aug25: 0, sep25: 0, oct25: 0, total: 0 },
//             items: [
//                 { glCode: 'X2002001001', description: 'HO - BASIC SALARIES (X2002001001)', apr25: 0, may25: 0, jun25: 0, jul25: 0, aug25: 0, sep25: 0, oct25: 0, total: 0 },
//                 { glCode: 'X2002001002', description: 'HO - DEARNESS ALLOWANCE (DA)(X2002001002)', apr25: 0, may25: 0, jun25: 0, jul25: 0, aug25: 0, sep25: 0, oct25: 0, total: 0 },
//                 { glCode: 'X2002001003', description: 'HO - HOUSE RENT ALLOWANCE-HRA(X2002001003)', apr25: 0, may25: 0, jun25: 0, jul25: 0, aug25: 0, sep25: 0, oct25: 0, total: 0 },
//                 { glCode: 'X2002001004', description: 'HO - OTHER ALLOWANCE(X2002001004)', apr25: 0, may25: 0, jun25: 0, jul25: 0, aug25: 0, sep25: 0, oct25: 0, total: 0 },
//                 { glCode: 'X2002001005', description: 'HO - EDUCATION ALLOWANCE(X2002001005)', apr25: 0, may25: 0, jun25: 0, jul25: 0, aug25: 0, sep25: 0, oct25: 0, total: 0 },
//                 { glCode: 'X2002001006', description: 'HO - BONUS(X2002001006)', apr25: 0, may25: 0, jun25: 0, jul25: 0, aug25: 0, sep25: 0, oct25: 0, total: 0 },
//                 { glCode: 'X2002001007', description: 'HO - MEDICAL EXP.(X2002001007)', apr25: 0, may25: 0, jun25: 0, jul25: 0, aug25: 0, sep25: 0, oct25: 0, total: 0 },
//                 { glCode: 'X2002001008', description: 'HO - OTHER DEDUCTION/NOTICE PERIOD(X2002001008)', apr25: 0, may25: 0, jun25: 0, jul25: 0, aug25: 0, sep25: 0, oct25: 0, total: 0 },
//                 { glCode: 'X2002001009', description: 'HO - LEAVE ENCASHMENT(X2002001009)', apr25: 0, may25: 0, jun25: 0, jul25: 0, aug25: 0, sep25: 0, oct25: 0, total: 0 },
//                 { glCode: 'X2002001010', description: 'HO - GRATUITY(X2002001010)', apr25: 0, may25: 0, jun25: 0, jul25: 0, aug25: 0, sep25: 0, oct25: 0, total: 0 },
//                 { glCode: 'X2002001011', description: 'HO - LABOUR WELFARE FUND(X2002001011)', apr25: 0, may25: 0, jun25: 0, jul25: 0, aug25: 0, sep25: 0, oct25: 0, total: 0 },
//                 { glCode: 'X2002001012', description: 'HO - INSURANCE(X2002001012)', apr25: 0, may25: 0, jun25: 0, jul25: 0, aug25: 0, sep25: 0, oct25: 0, total: 0 },
//                 { glCode: 'X2002001013', description: 'HO - PROVIDENT FUND(X2002001013)', apr25: 0, may25: 0, jun25: 0, jul25: 0, aug25: 0, sep25: 0, oct25: 0, total: 0 },
//                 { glCode: 'X2002001014', description: 'HO - MEDICAL REIMBURSEMENT(X2002001014)', apr25: 0, may25: 0, jun25: 0, jul25: 0, aug25: 0, sep25: 0, oct25: 0, total: 0 },
//                 { glCode: 'X2002001015', description: 'HO - LEAVE TRAVEL ALLOWANCE(X2002001015)', apr25: 0, may25: 0, jun25: 0, jul25: 0, aug25: 0, sep25: 0, oct25: 0, total: 0 },
//                 { glCode: 'X2002001016', description: 'HO - CONVEYANCE ALLOWANCE(X2002001016)', apr25: 0, may25: 0, jun25: 0, jul25: 0, aug25: 0, sep25: 0, oct25: 0, total: 0 }
//             ]
//         },

//         // Administration Cost Management
//         administrationCostManagement: {
//             subtitle: 'Administration Cost - Management',
//             total: {
//                 apr25: 43873, may25: 45750, jun25: 31073, jul25: 32528,
//                 aug25: 22097, sep25: 28525, oct25: 147333, total: 351179
//             },
//             items: [
//                 {
//                     glCode: 'X2001002040',
//                     description: 'HOTEL EXPENSES(X2001002040)',
//                     apr25: 43873, may25: 45750, jun25: 31073, jul25: 32528,
//                     aug25: 22097, sep25: 28525, oct25: 147333, total: 351179
//                 }
//             ]
//         },

//         // Employee Cost BO
//         employeeCostBO: {
//             subtitle: 'Employee cost BO',
//             total: {
//                 apr25: 4805030, may25: 4649767, jun25: 5088100, jul25: 5068381,
//                 aug25: 4709196, sep25: 4789910, oct25: 4906626, total: 34017010
//             },
//             items: [
//                 {
//                     glCode: 'X2001001001',
//                     description: 'BR - BASIC SALARIES (X2001001001)',
//                     apr25: 1966001, may25: 1910290, jun25: 2143330, jul25: 2127091,
//                     aug25: 1968323, sep25: 1991657, oct25: 1997835, total: 14104527
//                 },
//                 {
//                     glCode: 'X2001001002',
//                     description: 'BR - DEARNESS ALLOWANCE (DA)(X2001001002)',
//                     apr25: 33322, may25: 29340, jun25: 22983, jul25: 22983,
//                     aug25: 22363, sep25: 22780, oct25: 24902, total: 178673
//                 },
//                 {
//                     glCode: 'X2001001003',
//                     description: 'BR - HOUSE RENT ALLOWANCE-HRA(X2001001003)',
//                     apr25: 586607, may25: 605566, jun25: 727843, jul25: 732964,
//                     aug25: 675717, sep25: 685543, oct25: 696184, total: 4710424
//                 },
//                 {
//                     glCode: 'X2001001004',
//                     description: 'BR - OTHER ALLOWANCE(X2001001004)',
//                     apr25: 1346343, may25: 1301070, jun25: 1370355, jul25: 1369314,
//                     aug25: 1290653, sep25: 1280606, oct25: 1319842, total: 9278183
//                 },
//                 {
//                     glCode: 'X2001001005',
//                     description: 'BR - EDUCATION ALLOWANCE(X2001001005)',
//                     apr25: 200, may25: 200, jun25: 200, jul25: 200,
//                     aug25: 200, sep25: 200, oct25: 200, total: 1400
//                 },
//                 {
//                     glCode: 'X2001001006',
//                     description: 'BR - BONUS(X2001001006)',
//                     apr25: 89387, may25: 79741, jun25: 79529, jul25: 145397,
//                     aug25: 74717, sep25: 84717, oct25: 350745, total: 904233
//                 },
//                 {
//                     glCode: 'X2001001007',
//                     description: 'BR - MEDICAL EXP.(X2001001007)',
//                     apr25: 2590, may25: 2590, jun25: 2590, jul25: 2590,
//                     aug25: 2590, sep25: 2590, oct25: 2590, total: 18130
//                 },
//                 {
//                     glCode: 'X2001001008',
//                     description: 'BR - OTHER DEDUCTION/NOTICE PERIOD(X2001001008)',
//                     apr25: -3000, may25: -1400, jun25: -10700, jul25: -15000,
//                     aug25: -1000, sep25: -16834, oct25: -231875, total: -279809
//                 },
//                 {
//                     glCode: 'X2001001009',
//                     description: 'BR - LEAVE ENCASHMENT(X2001001009)',
//                     apr25: 106788, may25: 105058, jun25: 123744, jul25: 130138,
//                     aug25: 115937, sep25: 109731, oct25: 110126, total: 801522
//                 },
//                 {
//                     glCode: 'X2001001010',
//                     description: 'BR - GRATUITY(X2001001010)',
//                     apr25: 0, may25: 0, jun25: 0, jul25: 0,
//                     aug25: 0, sep25: 0, oct25: 0, total: 0
//                 },
//                 {
//                     glCode: 'X2001001011',
//                     description: 'BR - LABOUR WELFARE FUND(X2001001011)',
//                     apr25: 70, may25: 70, jun25: 5937, jul25: 70,
//                     aug25: 70, sep25: 70, oct25: 70, total: 6357
//                 },
//                 {
//                     glCode: 'X2001001012',
//                     description: 'BR - INSURANCE(X2001001012)',
//                     apr25: 41483, may25: 41483, jun25: 41498, jul25: 0,
//                     aug25: 41350, sep25: 41350, oct25: 56100, total: 263264
//                 },
//                 {
//                     glCode: 'X2001001013',
//                     description: 'BR - E.S.I.C.(X2001001013)',
//                     apr25: 22427, may25: 21573, jun25: 23624, jul25: 21714,
//                     aug25: 19956, sep25: 83732, oct25: 17915, total: 210941
//                 },
//                 {
//                     glCode: 'X2001001014',
//                     description: 'BR - PROVIDENT FUND(X2001001014)',
//                     apr25: 230070, may25: 220463, jun25: 235241, jul25: 238214,
//                     aug25: 220228, sep25: 224716, oct25: 228523, total: 1597455
//                 },
//                 {
//                     glCode: 'X2001001015',
//                     description: 'BR - MEDICAL REIMBURSEMENT (X2001001015)',
//                     apr25: 0, may25: 0, jun25: 0, jul25: 0,
//                     aug25: 0, sep25: 0, oct25: 6709, total: 6709
//                 },
//                 {
//                     glCode: 'X2001001016',
//                     description: 'BR - LEAVE TRAVEL ALLOWANCE(X2001001016)',
//                     apr25: 0, may25: 10920, jun25: 0, jul25: 0,
//                     aug25: 0, sep25: 0, oct25: 0, total: 10920
//                 },
//                 {
//                     glCode: 'X2001001017',
//                     description: 'BR - WASHING ALLOWANCE(X2001001017)',
//                     apr25: 0, may25: 0, jun25: 0, jul25: 0,
//                     aug25: 0, sep25: 0, oct25: 0, total: 0
//                 },
//                 {
//                     glCode: 'X2001001018',
//                     description: 'BR - CONVEYANCE ALLOWANCE(X2001001018)',
//                     apr25: 382742, may25: 322803, jun25: 321926, jul25: 292706,
//                     aug25: 278092, sep25: 279052, oct25: 275752, total: 2153073
//                 },
//                 {
//                     glCode: 'X2001001019',
//                     description: 'BR - NOTICE PAY SALARY',
//                     apr25: 0, may25: 0, jun25: 0, jul25: 0,
//                     aug25: 0, sep25: 0, oct25: 51008, total: 51008
//                 }
//             ]
//         },

//         // Administration Cost BO
//         administrationCostBO: {
//             subtitle: 'Administration cost BO',
//             total: {
//                 apr25: 2662490.11, may25: 2712408.17, jun25: 2714787.98, jul25: 3044502.46,
//                 aug25: 2662526.66, sep25: 2859697.17, oct25: 2902718.21, total: 19559130.76
//             },
//             items: [
//                 {
//                     glCode: 'X2001002001',
//                     description: 'AUDIT FEES(X2001002001)',
//                     apr25: 0, may25: 0, jun25: 0, jul25: 0,
//                     aug25: 0, sep25: 0, oct25: 0, total: 0
//                 },
//                 {
//                     glCode: 'X2001002003',
//                     description: 'COMMISSION & BROKERAGE(X2001002003)',
//                     apr25: 11000, may25: 18000, jun25: 0, jul25: 72239,
//                     aug25: 0, sep25: 0, oct25: 0, total: 101239
//                 },
//                 {
//                     glCode: 'X2001002004',
//                     description: 'COMPUTER EXPENSES(X2001002004)',
//                     apr25: 137990.09, may25: 142608.53, jun25: 130735.29, jul25: 126156.59,
//                     aug25: 91224.06, sep25: 93509.78, oct25: 83094.77, total: 805319.11
//                 },
//                 {
//                     glCode: 'X2001002006',
//                     description: 'BR - CONVEYANCE (X2001002006)',
//                     apr25: 349420.75, may25: 444152.97, jun25: 338668, jul25: 276827.65,
//                     aug25: 220598.42, sep25: 226636.90, oct25: 264832, total: 2121136.69
//                 },
//                 {
//                     glCode: 'X2001002008',
//                     description: 'DONATION(X2001002008)',
//                     apr25: 0, may25: 0, jun25: 2100, jul25: 0,
//                     aug25: 5000, sep25: 100001, oct25: 6000, total: 113101
//                 },
//                 {
//                     glCode: 'X2001002009',
//                     description: 'ELECTRICITY CHARGES(X2001002009)',
//                     apr25: 101613, may25: 91602, jun25: 70349.77, jul25: 52737,
//                     aug25: 53003.83, sep25: 70894, oct25: 58494, total: 498693.60
//                 },
//                 {
//                     glCode: 'X2001002010',
//                     description: 'FESTIVAL EXPENESES(X2001002010)',
//                     apr25: 139883, may25: 139883, jun25: 139883, jul25: 139883,
//                     aug25: 139883, sep25: 139882, oct25: 136343.82, total: 975640.82
//                 },
//                 {
//                     glCode: 'X2001002011',
//                     description: 'GAIN & LOSS ON BRANCH ASSETS(X2001002011)',
//                     apr25: 0, may25: 0, jun25: 0, jul25: 0,
//                     aug25: 0, sep25: 0, oct25: 0, total: 0
//                 },
//                 {
//                     glCode: 'X2001002012',
//                     description: 'LEGAL EXPENSES(X2001002012)',
//                     apr25: 0, may25: 0, jun25: 0, jul25: 0,
//                     aug25: 0, sep25: 35000, oct25: 0, total: 35000
//                 },
//                 {
//                     glCode: 'X2001002013',
//                     description: 'MEDICAL INSURANCE(X2001002013)',
//                     apr25: 7443.58, may25: 220701.62, jun25: 231368, jul25: 231368,
//                     aug25: 256033, sep25: 256033, oct25: 259855, total: 1462802.20
//                 },
//                 {
//                     glCode: 'X2001002014',
//                     description: 'MISC. EXPENSES(X2001002014)',
//                     apr25: 0, may25: 0, jun25: 400, jul25: 0,
//                     aug25: 620, sep25: 15000, oct25: 0, total: 16020
//                 },
//                 {
//                     glCode: 'X2001002016',
//                     description: 'OFFICE EXPENSES(X2001002016)',
//                     apr25: 10772, may25: 78281.28, jun25: 34744, jul25: 39829,
//                     aug25: 45402, sep25: 14057, oct25: 27134.44, total: 250219.72
//                 },
//                 {
//                     glCode: 'X2001002017',
//                     description: 'POSTGE,TELEG & COURIER(X2001002017)',
//                     apr25: 150054.50, may25: 99780, jun25: 119036.40, jul25: 109700,
//                     aug25: 95642.20, sep25: 9007.80, oct25: 14935.60, total: 598156.50
//                 },
//                 {
//                     glCode: 'X2001002018',
//                     description: 'PRINTING & STATIONERY(X2001002018)',
//                     apr25: 110796, may25: 75985, jun25: 70258, jul25: 86361,
//                     aug25: 29208, sep25: 54233, oct25: 76661.99, total: 503502.99
//                 },
//                 {
//                     glCode: 'X2001002019',
//                     description: 'PROFESSION TAX (COMPANY)(X2001002019)',
//                     apr25: 0, may25: 0, jun25: 0, jul25: 0,
//                     aug25: 0, sep25: 0, oct25: 0, total: 0
//                 },
//                 {
//                     glCode: 'X2001002020',
//                     description: 'PROFESSIONAL CHGS.(X2001002020)',
//                     apr25: 626298, may25: 491258.96, jun25: 367016, jul25: 784060.96,
//                     aug25: 542808.92, sep25: 426304.45, oct25: 353754.14, total: 3591501.43
//                 },
//                 {
//                     glCode: 'X2001002021',
//                     description: 'RATES & TAXES(X2001002021)',
//                     apr25: 0, may25: 0, jun25: 0, jul25: 0,
//                     aug25: 0, sep25: 0, oct25: 0, total: 0
//                 },
//                 {
//                     glCode: 'X2001002022',
//                     description: 'OFFICE RENT(X2001002022)',
//                     apr25: 478555, may25: 460333, jun25: 432925, jul25: 458087,
//                     aug25: 465607, sep25: 459401, oct25: 444304, total: 3199212
//                 },
//                 {
//                     glCode: 'X2001002023',
//                     description: 'TELEPHONE EXPENSES(X2001002023)',
//                     apr25: 20018.84, may25: 14652.90, jun25: 14602.30, jul25: 14255.18,
//                     aug25: 11993, sep25: 14775.48, oct25: 14732.53, total: 105030.23
//                 },
//                 {
//                     glCode: 'X2001002024',
//                     description: 'INTERNET CHARGES(X2001002024)',
//                     apr25: 44390.82, may25: 54299.82, jun25: 56860, jul25: 59102.90,
//                     aug25: 43417.82, sep25: 58484.82, oct25: 57741, total: 374297.18
//                 },
//                 {
//                     glCode: 'X2001002025',
//                     description: 'TRAINING EXPENSES(X2001002025)',
//                     apr25: 0, may25: 2000, jun25: 7200, jul25: 0,
//                     aug25: 0, sep25: 74000, oct25: 0, total: 83200
//                 },
//                 {
//                     glCode: 'X2001002026',
//                     description: 'BR - TRAVELLING EXPENSES(X2001002026)',
//                     apr25: 214726.19, may25: 146997, jun25: 279659.60, jul25: 219679,
//                     aug25: 251703, sep25: 266127, oct25: 283731, total: 1662622.79
//                 },
//                 {
//                     glCode: 'X2001002027',
//                     description: 'ROC CHARGES(X2001002027)',
//                     apr25: 0, may25: 0, jun25: 0, jul25: 0,
//                     aug25: 0, sep25: 0, oct25: 0, total: 0
//                 },
//                 {
//                     glCode: 'X2001002028',
//                     description: 'REPAIRS & MAINTANANCE(X2001002028)',
//                     apr25: 19360, may25: 40420, jun25: 18788, jul25: 14525,
//                     aug25: 2800, sep25: 2450, oct25: 0, total: 98343
//                 },
//                 {
//                     glCode: 'X2001002031',
//                     description: 'REBATE & DISCOUNT ALLOWED(X2001002031)',
//                     apr25: 6.34, may25: -0.95, jun25: 2.18, jul25: 7.75,
//                     aug25: -621.75, sep25: -4.76, oct25: 6.34, total: -604.85
//                 },
//                 {
//                     glCode: 'X2001002032',
//                     description: 'STAFF WELFARE EXPENSES(X2001002032)',
//                     apr25: 95176, may25: 59621, jun25: 91783, jul25: 124967,
//                     aug25: 115213, sep25: 108463, oct25: 113319, total: 708542
//                 },
//                 {
//                     glCode: 'X2001002033',
//                     description: 'INTEREST ,PENALTY & LATE FILING FEES(X2001002033)',
//                     apr25: 550, may25: 12530, jun25: 71488.28, jul25: 0,
//                     aug25: 0, sep25: 152665, oct25: 5906, total: 243139.28
//                 },
//                 {
//                     glCode: 'X2001002035',
//                     description: 'STAFF RECOGNITION & DEVELOPMENT(X2001002035)',
//                     apr25: 6300, may25: 11000, jun25: 0, jul25: 3600,
//                     aug25: 0, sep25: 0, oct25: 18400, total: 39300
//                 },
//                 {
//                     glCode: 'X2001002037',
//                     description: 'TENDER CHARGES(X2001002037)',
//                     apr25: 0, may25: 0, jun25: 0, jul25: 0,
//                     aug25: 0, sep25: 85500, oct25: 0, total: 85500
//                 },
//                 {
//                     glCode: 'X2001002043',
//                     description: 'SUBSCRIPTION/REGISTRATION FEES(X2001002043)',
//                     apr25: 92975, may25: 67225.04, jun25: 43824.16, jul25: 29050.43,
//                     aug25: 26949.16, sep25: 13898.32, oct25: 21474.58, total: 295396.69
//                 },
//                 {
//                     glCode: 'X2001002044',
//                     description: 'STAMP DUTY & FRANKING CHARGES',
//                     apr25: 32971, may25: 29917, jun25: 99603, jul25: 112842,
//                     aug25: 28417, sep25: 28617, oct25: 27650, total: 360017
//                 },
//                 {
//                     glCode: 'X2001002046',
//                     description: 'INTEREST ON GST ',
//                     apr25: 2240, may25: 500, jun25: 80594, jul25: 52914,
//                     aug25: 228165, sep25: 101100, oct25: 218898, total: 684411
//                 },
//                 {
//                     glCode: 'X2001002047',
//                     description: 'GST LATE FILING FEES',
//                     apr25: 50, may25: 760, jun25: 3000, jul25: 6400,
//                     aug25: 5500, sep25: 5508, oct25: 9600, total: 30818
//                 },
//                 {
//                     glCode: 'X2001002048',
//                     description: 'BR - PERFORMANCE INCENTIVE',
//                     apr25: 0, may25: 0, jun25: 0, jul25: 0,
//                     aug25: 0, sep25: 0, oct25: 0, total: 0
//                 },
//                 {
//                     glCode: 'X2001002051',
//                     description: 'REIBURSEMENT OF ROC EXPENSES',
//                     apr25: 0, may25: 0, jun25: 0, jul25: 0,
//                     aug25: 0, sep25: 0, oct25: 0, total: 0
//                 },
//                 {
//                     glCode: 'X2001002052',
//                     description: 'CONSULTANCY CHARGES - OVERSEAS',
//                     apr25: 0, may25: 0, jun25: 0, jul25: 0,
//                     aug25: 0, sep25: 0, oct25: 0, total: 0
//                 },
//                 {
//                     glCode: 'X2001002054',
//                     description: 'MOTOR VEHICLE EXPNSES',
//                     apr25: 0, may25: 0, jun25: 0, jul25: 0,
//                     aug25: 0, sep25: 0, oct25: 0, total: 0
//                 },
//                 {
//                     glCode: 'X2001002055',
//                     description: 'FUEL EXPENSES',
//                     apr25: 0, may25: 0, jun25: 0, jul25: 0,
//                     aug25: 0, sep25: 0, oct25: 0, total: 0
//                 },
//                 {
//                     glCode: 'X2001002056',
//                     description: 'LABOUR LICENSE FEES',
//                     apr25: 0, may25: 0, jun25: 0, jul25: 21000,
//                     aug25: 0, sep25: 25450, oct25: 0, total: 46450
//                 },
//                 {
//                     glCode: 'X2001002058',
//                     description: 'INELIGIBLE GST EXPENSES',
//                     apr25: 9900, may25: 9900, jun25: 9900, jul25: 8910,
//                     aug25: 3960, sep25: 0, oct25: 6930, total: 49500
//                 },
//                 {
//                     glCode: 'X2001002059',
//                     description: 'INTEREST ON ESIC',
//                     apr25: 0, may25: 0, jun25: 0, jul25: 0,
//                     aug25: 0, sep25: 22703.38, oct25: 0, total: 22703.38
//                 },
//                 {
//                     glCode: 'X2001002060',
//                     description: 'INTEREST ON PF',
//                     apr25: 0, may25: 0, jun25: 0, jul25: 0,
//                     aug25: 0, sep25: 0, oct25: 398920, total: 398920
//                 },
//                 {
//                     glCode: 'X2001002061',
//                     description: 'DAMAGES ON PF',
//                     apr25: 0, may25: 0, jun25: 0, jul25: 0,
//                     aug25: 0, sep25: 0, oct25: 0, total: 0
//                 }
//             ]
//         },

//         // Employee Cost Sales
//         employeeCostSales: {
//             subtitle: 'Employee cost - Sales',
//             total: { apr25: 0, may25: 0, jun25: 0, jul25: 0, aug25: 0, sep25: 0, oct25: 0, total: 0 },
//             items: []
//         },

//         // Administration Cost Sales
//         administrationCostSales: {
//             subtitle: 'Administration cost - Sales',
//             total: {
//                 apr25: 0, may25: 0, jun25: 504701, jul25: 1450,
//                 aug25: 0, sep25: 0, oct25: 25000, total: 531151
//             },
//             items: [
//                 {
//                     glCode: 'X2001002005',
//                     description: 'CONFERENCE & SEMINAR EXPENSES(X2001002005)',
//                     apr25: 0, may25: 0, jun25: 504701, jul25: 0,
//                     aug25: 0, sep25: 0, oct25: 0, total: 504701
//                 },
//                 {
//                     glCode: 'X2001002015',
//                     description: 'NEWS PAPERS,BOOKS & PERIODICAL(X2001002015)',
//                     apr25: 0, may25: 0, jun25: 0, jul25: 1450,
//                     aug25: 0, sep25: 0, oct25: 0, total: 1450
//                 },
//                 {
//                     glCode: 'X2001002041',
//                     description: 'JOB WEB SERVICES(X2001002041)',
//                     apr25: 0, may25: 0, jun25: 0, jul25: 0,
//                     aug25: 0, sep25: 0, oct25: 0, total: 0
//                 },
//                 {
//                     glCode: 'X2001002045',
//                     description: 'ADVERTISEMENT EXPENSES(X2001002045)',
//                     apr25: 0, may25: 0, jun25: 0, jul25: 0,
//                     aug25: 0, sep25: 0, oct25: 25000, total: 25000
//                 }
//             ]
//         },

//         totalNonBillableCost: {
//             apr25: 7511393.11, may25: 7407925.17, jun25: 8338661.98, jul25: 8146861.46,
//             aug25: 7393819.66, sep25: 7678132.17, oct25: 7981677.21, total: 54458470.76
//         }
//     },

//     // Profit Calculations
//     profitCalculations: {
//         grossProfit: {
//             apr25: 2263533.62, may25: 2071098.16, jun25: 1082844.25, jul25: 1681081.54,
//             aug25: 2241037.06, sep25: 18589.12, oct25: 566507.10, total: 9924690.85
//         },

//         otherIncome: {
//             subtitle: 'Add : Other Income',
//             total: {
//                 apr25: 36.22, may25: 11.61, jun25: 21.61, jul25: 3.21,
//                 aug25: 1000013.92, sep25: 44.21, oct25: 15.49, total: 1000146.27
//             },
//             items: [
//                 { glCode: 'R2001001', description: 'BANK INTEREST RECEIVED(R2001001)', apr25: 0, may25: 0, jun25: 0, jul25: 0, aug25: 0, sep25: 0, oct25: 0, total: 0 },
//                 { glCode: 'R2001002', description: 'MISC INCOME(R2001002)', apr25: 0, may25: 0, jun25: 0, jul25: 0, aug25: 0, sep25: 0, oct25: 0, total: 0 },
//                 { glCode: 'R2001003', description: 'ROUND OFF(R2001003)', apr25: 5.12, may25: 2.72, jun25: 13.84, jul25: -6.41, aug25: 0.57, sep25: -0.10, oct25: 9.92, total: 25.66 },
//                 { glCode: 'R2001004', description: 'WRITTEN BACK(R2001004)', apr25: 0, may25: 0, jun25: 0, jul25: 0, aug25: 0, sep25: 0, oct25: 0, total: 0 },
//                 { glCode: 'R2001005', description: 'INTEREST ON INCOME TAX REFUND(R2001005)', apr25: 0, may25: 0, jun25: 0, jul25: 0, aug25: 0, sep25: 0, oct25: 0, total: 0 },
//                 { glCode: 'R2001006', description: 'REBATE & DISCOUNT RECD(R2001006)', apr25: 31.10, may25: 8.89, jun25: 7.77, jul25: 9.62, aug25: 13.35, sep25: 44.31, oct25: 5.57, total: 120.61 },
//                 { glCode: 'R2001007', description: 'EXCESS PROVISION WRITTEN BACK', apr25: 0, may25: 0, jun25: 0, jul25: 0, aug25: 1000000, sep25: 0, oct25: 0, total: 1000000 }
//             ]
//         },

//         ebitda: {
//             apr25: 2263569.84, may25: 2071109.77, jun25: 1082865.86, jul25: 1681084.75,
//             aug25: 3241050.98, sep25: 18633.33, oct25: 566522.59, total: 10924837.12
//         },

//         financeCost: {
//             subtitle: 'Less : Finance Cost',
//             total: {
//                 apr25: 1213176.94, may25: 1339837.87, jun25: 1289608.33, jul25: 1392554.97,
//                 aug25: 1342424.80, sep25: 1231217.91, oct25: 1161259.22, total: 8970080.04
//             },
//             items: [
//                 {
//                     glCode: 'X2002002001',
//                     description: 'INTEREST ON BANK LOAN CC A/C(X2002002001)',
//                     apr25: 1121290, may25: 1264349, jun25: 1193430, jul25: 1228498,
//                     aug25: 1236396, sep25: 1150219, oct25: 1083913, total: 8278095
//                 },
//                 {
//                     glCode: 'X2002002002',
//                     description: 'INTEREST ON BANK LOAN TERM LOAN  A/C(X2002002002)',
//                     apr25: 0, may25: 0, jun25: 0, jul25: 0,
//                     aug25: 0, sep25: 0, oct25: 0, total: 0
//                 },
//                 {
//                     glCode: 'X2002002004',
//                     description: 'INTEREST ON UNSECURED LOAN',
//                     apr25: 0, may25: 0, jun25: 0, jul25: 0,
//                     aug25: 0, sep25: 0, oct25: 0, total: 0
//                 },
//                 {
//                     glCode: 'X2002002005',
//                     description: 'LOAN PROCESSING CHARGES',
//                     apr25: 29427, may25: 29427, jun25: 68515, jul25: 68515,
//                     aug25: 68515, sep25: 68515, oct25: 68515, total: 401429
//                 },
//                 {
//                     glCode: 'X2002002006',
//                     description: 'FOREIGN REMITTANCE BANK CHG',
//                     apr25: 0, may25: 0, jun25: 0, jul25: 0,
//                     aug25: 0, sep25: 0, oct25: 0, total: 0
//                 },
//                 {
//                     glCode: 'X2002002007',
//                     description: 'LOSS ON FOREIGN EXCHANGE',
//                     apr25: 0, may25: 0, jun25: 0, jul25: 0,
//                     aug25: 0, sep25: 0, oct25: 0, total: 0
//                 },
//                 {
//                     glCode: 'X2002002003',
//                     description: 'BANK CHARGES(X2002002003)',
//                     apr25: 62459.94, may25: 46061.87, jun25: 27663.33, jul25: 95541.97,
//                     aug25: 37513.80, sep25: 12483.91, oct25: 8831.22, total: 290556.04
//                 }
//             ]
//         },

//         depreciation: {
//             subtitle: 'Less: Depreciation',
//             total: {
//                 apr25: 308793, may25: 377302, jun25: 352782, jul25: 449816,
//                 aug25: 372172, sep25: 377705, oct25: 373095, total: 2611665
//             },
//             items: [
//                 {
//                     glCode: 'X2001002007',
//                     description: 'DEPRECIATION(X2001002007)',
//                     apr25: 308793, may25: 377302, jun25: 352782, jul25: 449816,
//                     aug25: 372172, sep25: 377705, oct25: 373095, total: 2611665
//                 }
//             ]
//         },

//         netProfit: {
//             apr25: 741599.90, may25: 353969.90, jun25: -559524.47, jul25: -161286.22,
//             aug25: 1526454.18, sep25: -1590289.58, oct25: -967831.63, total: -656907.92
//         },

//         extraordinaryExpenses: {
//             subtitle: 'Less: extra ordinary exp',
//             total: {
//                 apr25: 161785, may25: 17000, jun25: 96100, jul25: 1258150,
//                 aug25: 432000, sep25: 883860, oct25: 412650, total: 3261545
//             },
//             items: [
//                 {
//                     glCode: 'X1001004006',
//                     description: 'SPECIAL PROJECT EXPENSES',
//                     apr25: 17000, may25: 17000, jun25: 96100, jul25: 1258150,
//                     aug25: 315800, sep25: 17000, oct25: 412650, total: 2133700
//                 },
//                 {
//                     glCode: 'X2001002049',
//                     description: 'SUBCONTRACT EXP - PROJECT',
//                     apr25: 0, may25: 0, jun25: 0, jul25: 0,
//                     aug25: 0, sep25: 0, oct25: 0, total: 0
//                 },
//                 {
//                     glCode: 'X2001002050',
//                     description: 'SERBIA EXPENSES',
//                     apr25: 0, may25: 0, jun25: 0, jul25: 0,
//                     aug25: 0, sep25: 0, oct25: 0, total: 0
//                 },
//                 {
//                     glCode: 'X2001002057',
//                     description: 'EVENT EXPENSES',
//                     apr25: 144785, may25: 0, jun25: 0, jul25: 0,
//                     aug25: 116200, sep25: 866860, oct25: 0, total: 1127845
//                 },
//                 {
//                     glCode: 'X2001002029',
//                     description: 'SPECIAL PROJECT MATERIAL',
//                     apr25: 0, may25: 0, jun25: 0, jul25: 0,
//                     aug25: 0, sep25: 0, oct25: 0, total: 0
//                 },
//                 {
//                     glCode: 'X2001002030',
//                     description: 'INCOME TAX ADJUSTMENT EARLIER PERIOD(X2001002030)',
//                     apr25: 0, may25: 0, jun25: 0, jul25: 0,
//                     aug25: 0, sep25: 0, oct25: 0, total: 0
//                 },
//                 {
//                     glCode: 'X1001007002',
//                     description: 'BAD DEBTS WRITTEN OFF(X1001007002)',
//                     apr25: 0, may25: 0, jun25: 0, jul25: 0,
//                     aug25: 0, sep25: 0, oct25: 0, total: 0
//                 }
//             ]
//         },

//         profitBeforeTax: {
//             apr25: 579814.90, may25: 336969.90, jun25: -655624.47, jul25: -1419436.22,
//             aug25: 1094454.18, sep25: -2474149.58, oct25: -1380481.63, total: -3918452.92
//         },

//         provisionForTax: {
//             apr25: 0, may25: 0, jun25: 0, jul25: 0,
//             aug25: 0, sep25: 0, oct25: 0, total: 0
//         },

//         profitAfterTax: {
//             apr25: 579814.90, may25: 336969.90, jun25: -655624.47, jul25: -1419436.22,
//             aug25: 1094454.18, sep25: -2474149.58, oct25: -1380481.63, total: -3918452.92
//         }
//     }
// }

// /**
//  * Apply header styling
//  */
// const applyHeaderStyle = (cell) => {
//     cell.fill = {
//         type: 'pattern',
//         pattern: 'solid',
//         fgColor: { argb: 'FF0066CC' }
//     }
//     cell.font = {
//         bold: true,
//         color: { argb: 'FFFFFFFF' },
//         size: 11
//     }
//     cell.alignment = {
//         horizontal: 'center',
//         vertical: 'middle',
//         wrapText: true
//     }
//     cell.border = {
//         top: { style: 'thin' },
//         left: { style: 'thin' },
//         bottom: { style: 'thin' },
//         right: { style: 'thin' }
//     }
// }

// /**
//  * Apply section header styling
//  */
// const applySectionHeaderStyle = (cell) => {
//     cell.fill = {
//         type: 'pattern',
//         pattern: 'solid',
//         fgColor: { argb: 'FFD9E1F2' }
//     }
//     cell.font = {
//         bold: true,
//         size: 10
//     }
//     cell.alignment = {
//         horizontal: 'left',
//         vertical: 'middle'
//     }
//     cell.border = {
//         top: { style: 'thin' },
//         left: { style: 'thin' },
//         bottom: { style: 'thin' },
//         right: { style: 'thin' }
//     }
// }

// /**
//  * Apply total row styling
//  */
// const applyTotalStyle = (cell, isGrandTotal = false) => {
//     cell.fill = {
//         type: 'pattern',
//         pattern: 'solid',
//         fgColor: { argb: isGrandTotal ? 'FFFFD966' : 'FFFCE4D6' }
//     }
//     cell.font = {
//         bold: true,
//         size: 10
//     }
//     cell.alignment = {
//         horizontal: cell.value && typeof cell.value === 'number' ? 'right' : 'left',
//         vertical: 'middle'
//     }
//     cell.border = {
//         top: { style: 'thin' },
//         left: { style: 'thin' },
//         bottom: { style: 'thin' },
//         right: { style: 'thin' }
//     }
// }

// /**
//  * Apply data cell styling
//  */
// const applyDataCellStyle = (cell, isNumeric = false) => {
//     cell.alignment = {
//         horizontal: isNumeric ? 'right' : 'left',
//         vertical: 'middle'
//     }
//     cell.border = {
//         top: { style: 'thin', color: { argb: 'FFD0D0D0' } },
//         left: { style: 'thin', color: { argb: 'FFD0D0D0' } },
//         bottom: { style: 'thin', color: { argb: 'FFD0D0D0' } },
//         right: { style: 'thin', color: { argb: 'FFD0D0D0' } }
//     }
//     if (isNumeric) {
//         cell.numFmt = '#,##0.00'
//     }
// }

// /**
//  * Generate and download Complete MIS Summary Excel report
//  */
// export const generateMISSummaryActualExcel = async (periodData) => {
//     try {
//         const workbook = new ExcelJS.Workbook()
//         workbook.creator = 'I Smart Facitech Pvt Ltd'
//         workbook.created = new Date()

//         const worksheet = workbook.addWorksheet('MIS Summary Report', {
//             pageSetup: {
//                 paperSize: 9,
//                 orientation: 'landscape',
//                 fitToPage: true
//             }
//         })

//         // Set column widths
//         worksheet.columns = [
//             { width: 10 },  // GL Code
//             { width: 45 },  // Particulars
//             { width: 15 },  // Apr
//             { width: 12 },  // %
//             { width: 15 },  // May
//             { width: 12 },  // %
//             { width: 15 },  // Jun
//             { width: 12 },  // %
//             { width: 15 },  // Jul
//             { width: 12 },  // %
//             { width: 15 },  // Aug
//             { width: 12 },  // %
//             { width: 15 },  // Sep
//             { width: 12 },  // %
//             { width: 15 },  // Oct
//             { width: 12 },  // %
//             { width: 18 },  // Total
//             { width: 12 }   // %
//         ]

//         let currentRow = 1

//         // Title rows
//         worksheet.mergeCells(`B${currentRow}:B${currentRow}`)
//         worksheet.getCell(`B${currentRow}`).value = ACTUAL_MIS_DATA.companyName
//         worksheet.getCell(`B${currentRow}`).font = { bold: true, size: 14 }
//         currentRow++

//         worksheet.mergeCells(`B${currentRow}:B${currentRow}`)
//         worksheet.getCell(`B${currentRow}`).value = ACTUAL_MIS_DATA.reportTitle
//         worksheet.getCell(`B${currentRow}`).font = { bold: true, size: 12 }
//         currentRow++

//         worksheet.mergeCells(`B${currentRow}:B${currentRow}`)
//         worksheet.getCell(`B${currentRow}`).value = ACTUAL_MIS_DATA.period
//         worksheet.getCell(`B${currentRow}`).font = { italic: true, size: 10 }
//         currentRow++

//         currentRow++ // Empty row

//         // Header row
//         const headerRow = worksheet.getRow(currentRow)
//         headerRow.values = [
//             'GL Code',
//             'PARTICULARS',
//             "Apr'25", 'Percentage',
//             "May'25", 'Percentage',
//             "Jun'25", 'Percentage',
//             "July'25", 'Percentage',
//             "August'25", 'Percentage',
//             "Sept'25", 'Percentage',
//             "Oct'25", 'Percentage',
//             'Total', 'Percentage'
//         ]
//         headerRow.height = 25
//         headerRow.eachCell((cell) => applyHeaderStyle(cell))
//         currentRow++

//         // Helper function to add line item
//         const addLineItem = (glCode, description, data, isTotal = false, isGrandTotal = false) => {
//             const row = worksheet.getRow(currentRow)
//             const grossSales = ACTUAL_MIS_DATA.revenue.grossSales

//             row.values = [
//                 glCode || '',
//                 description,
//                 data.apr25,
//                 data.apr25 / grossSales.apr25,
//                 data.may25,
//                 data.may25 / grossSales.may25,
//                 data.jun25,
//                 data.jun25 / grossSales.jun25,
//                 data.jul25,
//                 data.jul25 / grossSales.jul25,
//                 data.aug25,
//                 data.aug25 / grossSales.aug25,
//                 data.sep25,
//                 data.sep25 / grossSales.sep25,
//                 data.oct25,
//                 data.oct25 / grossSales.oct25,
//                 data.total,
//                 data.total / grossSales.total
//             ]

//             if (isTotal || isGrandTotal) {
//                 row.eachCell((cell) => applyTotalStyle(cell, isGrandTotal))
//             } else {
//                 applyDataCellStyle(row.getCell(1), false) // GL Code
//                 applyDataCellStyle(row.getCell(2), false) // Description
//                 for (let i = 3; i <= 18; i++) {
//                     applyDataCellStyle(row.getCell(i), true) // Numbers
//                 }
//             }

//             // Format percentages
//             for (let i = 4; i <= 18; i += 2) {
//                 row.getCell(i).numFmt = '0.0000%'
//             }

//             currentRow++
//         }

//         // REVENUE SECTION
//         addLineItem('', ACTUAL_MIS_DATA.revenue.grossSales.description, ACTUAL_MIS_DATA.revenue.grossSales, true, false)

//         ACTUAL_MIS_DATA.revenue.breakdown.forEach(item => {
//             if (item.total > 0) {
//                 addLineItem(item.glCode, item.description, item, false, false)
//             }
//         })

//         currentRow++ // Empty row

//         // OPERATING COSTS
//         // Employee Cost FO
//         const empFO = ACTUAL_MIS_DATA.operatingCosts.employeeCostFO
//         addLineItem('', empFO.subtitle, empFO.total, true, false)
//         empFO.items.forEach(item => {
//             addLineItem(item.glCode, item.description, item, false, false)
//         })

//         // Material FO
//         const matFO = ACTUAL_MIS_DATA.operatingCosts.materialFO
//         addLineItem('', matFO.subtitle, matFO.total, true, false)
//         matFO.items.forEach(item => {
//             if (item.total !== 0) {
//                 addLineItem(item.glCode, item.description, item, false, false)
//             }
//         })

//         // Administration FO
//         const adminFO = ACTUAL_MIS_DATA.operatingCosts.administrationFO
//         addLineItem('', adminFO.subtitle, adminFO.total, true, false)
//         adminFO.items.forEach(item => {
//             if (item.total !== 0) {
//                 addLineItem(item.glCode, item.description, item, false, false)
//             }
//         })

//         // Administration OPS
//         const adminOPS = ACTUAL_MIS_DATA.operatingCosts.administrationOPS
//         addLineItem('', adminOPS.subtitle, adminOPS.total, true, false)
//         adminOPS.items.forEach(item => {
//             if (item.total !== 0) {
//                 addLineItem(item.glCode, item.description, item, false, false)
//             }
//         })

//         // Total Operating Cost
//         addLineItem('', 'Total Operating cost', ACTUAL_MIS_DATA.totals.totalOperatingCost, true, false)

//         // Gross Operating Margin
//         addLineItem('', 'Gross Operating Margin', ACTUAL_MIS_DATA.totals.grossOperatingMargin, true, true)

//         currentRow++ // Empty row

//         // NON-BILLABLE COSTS
//         // Admin Cost Management
//         const adminMgmt = ACTUAL_MIS_DATA.nonBillableCosts.administrationCostManagement
//         addLineItem('', adminMgmt.subtitle, adminMgmt.total, true, false)
//         adminMgmt.items.forEach(item => {
//             addLineItem(item.glCode, item.description, item, false, false)
//         })

//         // Employee Cost BO
//         const empBO = ACTUAL_MIS_DATA.nonBillableCosts.employeeCostBO
//         addLineItem('', empBO.subtitle, empBO.total, true, false)
//         empBO.items.forEach(item => {
//             if (item.total !== 0) {
//                 addLineItem(item.glCode, item.description, item, false, false)
//             }
//         })

//         // Administration Cost BO
//         const adminBO = ACTUAL_MIS_DATA.nonBillableCosts.administrationCostBO
//         addLineItem('', adminBO.subtitle, adminBO.total, true, false)
//         adminBO.items.forEach(item => {
//             if (item.total !== 0) {
//                 addLineItem(item.glCode, item.description, item, false, false)
//             }
//         })

//         // Administration Cost Sales
//         const adminSales = ACTUAL_MIS_DATA.nonBillableCosts.administrationCostSales
//         if (adminSales.total.total !== 0) {
//             addLineItem('', adminSales.subtitle, adminSales.total, true, false)
//             adminSales.items.forEach(item => {
//                 if (item.total !== 0) {
//                     addLineItem(item.glCode, item.description, item, false, false)
//                 }
//             })
//         }

//         // Total Non Billable Cost
//         addLineItem('', 'Total Non Billable Cost', ACTUAL_MIS_DATA.nonBillableCosts.totalNonBillableCost, true, false)

//         // Gross Profit
//         addLineItem('', 'Gross Profit', ACTUAL_MIS_DATA.profitCalculations.grossProfit, true, true)

//         currentRow++ // Empty row

//         // Other Income
//         const otherInc = ACTUAL_MIS_DATA.profitCalculations.otherIncome
//         addLineItem('', otherInc.subtitle, otherInc.total, true, false)
//         otherInc.items.forEach(item => {
//             if (item.total !== 0) {
//                 addLineItem(item.glCode, item.description, item, false, false)
//             }
//         })

//         // EBITDA
//         addLineItem('', 'EBIDTA', ACTUAL_MIS_DATA.profitCalculations.ebitda, true, true)

//         // Finance Cost
//         const finCost = ACTUAL_MIS_DATA.profitCalculations.financeCost
//         addLineItem('', finCost.subtitle, finCost.total, true, false)
//         finCost.items.forEach(item => {
//             if (item.total !== 0) {
//                 addLineItem(item.glCode, item.description, item, false, false)
//             }
//         })

//         // Depreciation
//         const depr = ACTUAL_MIS_DATA.profitCalculations.depreciation
//         addLineItem('', depr.subtitle, depr.total, true, false)
//         depr.items.forEach(item => {
//             addLineItem(item.glCode, item.description, item, false, false)
//         })

//         // Net Profit
//         addLineItem('', 'Net Profit', ACTUAL_MIS_DATA.profitCalculations.netProfit, true, true)

//         // Extraordinary Expenses
//         const extraExp = ACTUAL_MIS_DATA.profitCalculations.extraordinaryExpenses
//         addLineItem('', extraExp.subtitle, extraExp.total, true, false)
//         extraExp.items.forEach(item => {
//             if (item.total !== 0) {
//                 addLineItem(item.glCode, item.description, item, false, false)
//             }
//         })

//         // Profit Before Tax
//         addLineItem('', 'Profit Before Tax', ACTUAL_MIS_DATA.profitCalculations.profitBeforeTax, true, true)

//         // Provision for Tax
//         addLineItem('', 'Provision for tax', ACTUAL_MIS_DATA.profitCalculations.provisionForTax, true, false)

//         // Profit After Tax
//         addLineItem('', 'Profit After Tax', ACTUAL_MIS_DATA.profitCalculations.profitAfterTax, true, true)

//         // Generate buffer
//         const buffer = await workbook.xlsx.writeBuffer()

//         // Create filename
//         const filename = `MIS_Summary_Complete_${periodData?.monthName || 'Apr-Oct'}_${periodData?.year || '2025'}.xlsx`

//         // Save file
//         const blob = new Blob([buffer], {
//             type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
//         })
//         saveAs(blob, filename)

//         console.log('Complete MIS Summary Excel generated successfully:', filename)
//         return { success: true, filename }
//     } catch (err) {
//         console.error('generateMISSummaryActualExcel error:', err)
//         throw new Error(err.message || 'Failed to generate MIS Summary Excel report')
//     }
// }

// export default {
//     generateMISSummaryActualExcel
// }





/* eslint-disable no-unused-vars */
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'

/**
 * MIS Summary Actual Excel Generation Service - COMPLETE VERSION
 * Generates comprehensive MIS Summary report with all GL codes
 * Based on I SMART FACITECH PVT LTD format
 */

/**
 * Generate complete MIS data structure
 * @param {Object} periodData - { year, month, monthName, stateName }
 * @returns {Object} Structured data for the report
 */
const generateCompleteMISData = (periodData) => {
    try {
        const { year, month, monthName, stateName } = periodData

        // Generate single month data (can be extended to multiple months)
        const monthLabel = monthName || 'Oct'
        const yearLabel = year || 2025

        // REVENUE DATA
        const revenueData = [
            { glCode: '', category: 'Gross Sales ( excluding Other Income )', value: 0 },
            { glCode: 'R1001001', category: 'HOUSE KEEPING CHARGES(R1001001)', value: 13561173 },
            { glCode: 'R1001004', category: 'OVERSEAS CONSULTANCY SERVICE FEES (EXPORT)(R1001004)', value: 0 },
            { glCode: 'R1001002', category: 'HOUSE KEEPING CHARGES (EXEMPT)(R1001002)', value: 0 },
            { glCode: 'R1001003', category: 'SERVICE CHARGES(R1001003)', value: 35000 }
        ]

        // EMPLOYEE COST - FRONT OFFICE (FO)
        const employeeCostFO = [
            { glCode: 'NON MIS PROV', category: 'NON MIS (LWW/BNS/GRT)', value: 0 },
            { glCode: 'X1001001001001', category: 'FO - BASIC SALARIES (X1001001001001)', value: 5184167 },
            { glCode: 'X1001001001002', category: 'FO - DEARNESS ALLOWANCE (DA)(X1001001001002)', value: 1565208 },
            { glCode: 'X1001001001003', category: 'FO - HOUSE RENT ALLOWANCE-HRA(X1001001001003)', value: 345349 },
            { glCode: 'X1001001001004', category: 'FO - OTHER ALLOWANCE(X1001001001004)', value: 829962 },
            { glCode: 'X1001001001005', category: 'FO - EDUCATION ALLOWANCE(X1001001001005)', value: 190 },
            { glCode: 'X1001001001006', category: 'FO - BONUS(X1001001001006)', value: 1948728 },
            { glCode: 'X1001001001007', category: 'FO - MEDICAL EXP.(X1001001001007)', value: 7934 },
            { glCode: 'X1001001001008', category: 'FO - OTHER DEDUCTION/NOTICE PERIOD(X1001001001008)', value: -17931 },
            { glCode: 'X1001001001009', category: 'FO - LEAVE ENCASHMENT(X1001001001009)', value: 95000 },
            { glCode: 'X1001001001010', category: 'FO - GRATUITY(X1001001001010)', value: 285000 },
            { glCode: 'X1001001001011', category: 'FO - LABOUR WELFARE FUND(X1001001001011)', value: 15000 },
            { glCode: 'X1001001001012', category: 'FO - INSURANCE(X1001001001012)', value: 45000 },
            { glCode: 'X1001001001013', category: 'FO - E.S.I.C.(X1001001001013)', value: 89450 },
            { glCode: 'X1001001001014', category: 'FO - PROVIDENT FUND(X1001001001014)', value: 622100 },
            { glCode: 'X1001001001015', category: 'FO - OVERTIME (X1001001001015)', value: 125000 },
            { glCode: 'X1001001001016', category: 'FO - CONVEYANCE ALLOWANCE (X1001001001016)', value: 65000 },
            { glCode: 'X1001001001017', category: 'FO - EX-GRATIA(X1001001001017)', value: 25000 },
            { glCode: 'X1001001001018', category: 'FO - WASHING ALLOWANCE(X1001001001018)', value: 12000 },
            { glCode: 'X1001001001019', category: 'FO - NOTICE PAY SALARY', value: 0 },
            { glCode: 'X1001001001021', category: 'FO - PERFORMANCE INCENTIVE', value: 150000 },
            { glCode: 'X1001001001022', category: 'FO - LEAVE TRAVEL ALLOWANCE', value: 45000 },
            { glCode: 'X1001002002', category: 'FO - CONVEYANCE(X1001002002)', value: 35000 },
            { glCode: 'X1001002003', category: 'FO - TRAVELIING EXPENSES(X1001002003)', value: 55000 }
        ]

        // MATERIAL - FO
        const materialFO = [
            { glCode: 'X1001003001', category: 'PURCHASES - CATERING(X1001003001)', value: 125000 },
            { glCode: 'X1001003002', category: 'PURCHASES - OVERSEAS', value: 0 },
            { glCode: 'X1001004001', category: 'PURCHASE - HOUSEKEEPING MATERIAL(X1001004001)', value: 285000 },
            { glCode: 'X1001004002', category: 'PURCHASE - STAFF UNIFORM(X1001004002)', value: 75000 }
        ]

        // ADMINISTRATION - FO
        const administrationFO = [
            { glCode: 'X1001001002001', category: 'SUB CONTRACTORS EXP(X1001001002001)', value: 425000 },
            { glCode: 'X1001001002002', category: 'SUB CONTRACTORS - AMC VENDORS(X1001001002002)', value: 185000 },
            { glCode: 'X1001002004', category: 'REIMBURSEMENT OF TRAVEL EXP - OVS', value: 0 },
            { glCode: 'X1001002005', category: 'GUEST HOUSE EXPENSES', value: 25000 },
            { glCode: 'X1001004005', category: 'LAUNDRY CHARGES(X1001004005)', value: 35000 },
            { glCode: 'X1001005001', category: 'REIMBURSABLE EXPENSES(X1001005001)', value: 15000 },
            { glCode: 'X1001006001', category: 'REPAIRS & MAINTANANCE (SITE LEVEL)(X1001006001)', value: 95000 },
            { glCode: 'X1001006002', category: 'REPAIRS & MAINTANANCE (SPARES)(X1001006002)', value: 45000 },
            { glCode: 'X1001006003', category: 'LEASE RENTAL - MACHINERIES(X1001006003)', value: 125000 },
            { glCode: 'X1001008', category: 'LABOUR CHARGES(X1001008)', value: 285000 },
            { glCode: 'X1002001', category: 'FOODS & BEVERAGES TO EMPLOYEES(X1002001)', value: 65000 },
            { glCode: 'X1002002', category: 'OTHER PRODUCTION COSTS(X1002002)', value: 35000 },
            { glCode: 'X1002003', category: 'POLICE VERIFICATION CHARGES(X1002003)', value: 12000 },
            { glCode: 'X1002004', category: 'IDENTITY CARD EXPENSES(X1002004)', value: 8000 },
            { glCode: 'X1002005', category: 'STAFF WELFARE (SITE LEVEL)(X1002005)', value: 45000 },
            { glCode: 'X1002006', category: 'ELECTRICITY CHRGS (SITE LEVEL)(X1002006)', value: 85000 },
            { glCode: 'X1002007', category: 'RENT ( SITE LEVEL)(X1002007)', value: 125000 },
            { glCode: 'X1002008', category: 'TRAINING COSTS(X1002008)', value: 35000 },
            { glCode: 'X1002009', category: 'CONVEYANCE EXP ( SITE LEVEL)(X1002009)', value: 25000 },
            { glCode: 'X1002010', category: 'BIKE RENT (SITE LEVEL)(X1002010)', value: 18000 },
            { glCode: 'X1002011', category: 'VISIT CHARGES (SITE LEVEL)(X1002011)', value: 15000 },
            { glCode: 'X1002012', category: 'FUEL EXPENSES (SITE LEVEL)(X1002012)', value: 45000 },
            { glCode: 'X1002013', category: 'SITE EXPENSES(X1002013)', value: 65000 },
            { glCode: 'X1002014', category: 'MOBILISATION COST(X1002014)', value: 85000 },
            { glCode: 'X1002015', category: 'PROFESSIONAL CHG - SITE', value: 25000 },
            { glCode: 'X2001002036', category: 'EMPLOYEES COMPENSATION INSURANSE POLICY(X2001002036)', value: 35000 },
            { glCode: 'X2001002038', category: 'CLEANING CHARGES(X2001002038)', value: 45000 },
            { glCode: 'X2001002039', category: 'LOUNDRY CHARGES(X2001002039)', value: 22000 },
            { glCode: 'X2001002042', category: 'PROJECT EXECUTION EXPENSES(X2001002042)', value: 125000 },
            { glCode: 'X2001002002', category: 'BUSINESS PROMOTION(X2001002002)', value: 85000 },
            { glCode: 'X1001007003', category: 'SLA DEDUCTION', value: 0 },
            { glCode: 'X2001002053', category: 'TRANSPORT, FUEL, TOLL & OTHER EXPENSES - OVERSEAS', value: 0 }
        ]

        // ADMINISTRATION - OPS
        const administrationOPS = [
            { glCode: 'X1001002001', category: 'TRANSPORTATION (MANPOWER)(X1001002001)', value: 125000 },
            { glCode: 'X1001004003', category: 'TRANSPORTATION - HK MATERIAL(X1001004003)', value: 65000 },
            { glCode: 'X1001004004', category: 'LOADING & UNLOADING EXPENSES(X1001004004)', value: 35000 },
            { glCode: 'X1001007001', category: 'PROVISION FOR BAD DEBT(X1001007001)', value: 0 }
        ]

        // EMPLOYEE COST - MANAGEMENT (HO)
        const employeeCostManagement = [
            { glCode: 'X2002001001', category: 'HO - BASIC SALARIES (X2002001001)', value: 850000 },
            { glCode: 'X2002001002', category: 'HO - DEARNESS ALLOWANCE (DA)(X2002001002)', value: 255000 },
            { glCode: 'X2002001003', category: 'HO - HOUSE RENT ALLOWANCE-HRA(X2002001003)', value: 127500 },
            { glCode: 'X2002001004', category: 'HO - OTHER ALLOWANCE(X2002001004)', value: 85000 },
            { glCode: 'X2002001005', category: 'HO - EDUCATION ALLOWANCE(X2002001005)', value: 3000 },
            { glCode: 'X2002001006', category: 'HO - BONUS(X2002001006)', value: 145000 },
            { glCode: 'X2002001007', category: 'HO - MEDICAL EXP.(X2002001007)', value: 12000 },
            { glCode: 'X2002001008', category: 'HO - OTHER DEDUCTION/NOTICE PERIOD(X2002001008)', value: 0 },
            { glCode: 'X2002001009', category: 'HO - LEAVE ENCASHMENT(X2002001009)', value: 45000 },
            { glCode: 'X2002001010', category: 'HO - GRATUITY(X2002001010)', value: 85000 },
            { glCode: 'X2002001011', category: 'HO - LABOUR WELFARE FUND(X2002001011)', value: 2500 },
            { glCode: 'X2002001012', category: 'HO - INSURANCE(X2002001012)', value: 25000 },
            { glCode: 'X2002001013', category: 'HO - PROVIDENT FUND(X2002001013)', value: 102000 },
            { glCode: 'X2002001014', category: 'HO - MEDICAL REIMBURSEMENT(X2002001014)', value: 15000 },
            { glCode: 'X2002001015', category: 'HO - LEAVE TRAVEL ALLOWANCE(X2002001015)', value: 25000 },
            { glCode: 'X2002001016', category: 'HO - CONVEYANCE ALLOWANCE(X2002001016)', value: 35000 }
        ]

        // ADMINISTRATION COST - MANAGEMENT
        const administrationManagement = [
            { glCode: 'X2001002040', category: 'HOTEL EXPENSES(X2001002040)', value: 45000 }
        ]

        // EMPLOYEE COST - BACK OFFICE (BO/BR)
        const employeeCostBO = [
            { glCode: 'X2001001001', category: 'BR - BASIC SALARIES (X2001001001)', value: 425000 },
            { glCode: 'X2001001002', category: 'BR - DEARNESS ALLOWANCE (DA)(X2001001002)', value: 127500 },
            { glCode: 'X2001001003', category: 'BR - HOUSE RENT ALLOWANCE-HRA(X2001001003)', value: 63750 },
            { glCode: 'X2001001004', category: 'BR - OTHER ALLOWANCE(X2001001004)', value: 42500 },
            { glCode: 'X2001001005', category: 'BR - EDUCATION ALLOWANCE(X2001001005)', value: 1500 },
            { glCode: 'X2001001006', category: 'BR - BONUS(X2001001006)', value: 72500 },
            { glCode: 'X2001001007', category: 'BR - MEDICAL EXP.(X2001001007)', value: 6000 },
            { glCode: 'X2001001008', category: 'BR - OTHER DEDUCTION/NOTICE PERIOD(X2001001008)', value: 0 },
            { glCode: 'X2001001009', category: 'BR - LEAVE ENCASHMENT(X2001001009)', value: 22500 },
            { glCode: 'X2001001010', category: 'BR - GRATUITY(X2001001010)', value: 42500 },
            { glCode: 'X2001001011', category: 'BR - LABOUR WELFARE FUND(X2001001011)', value: 1250 },
            { glCode: 'X2001001012', category: 'BR - INSURANCE(X2001001012)', value: 12500 },
            { glCode: 'X2001001013', category: 'BR - E.S.I.C.(X2001001013)', value: 18000 },
            { glCode: 'X2001001014', category: 'BR - PROVIDENT FUND(X2001001014)', value: 51000 },
            { glCode: 'X2001001015', category: 'BR - MEDICAL REIMBURSEMENT (X2001001015)', value: 7500 },
            { glCode: 'X2001001016', category: 'BR - LEAVE TRAVEL ALLOWANCE(X2001001016)', value: 12500 },
            { glCode: 'X2001001017', category: 'BR - WASHING ALLOWANCE(X2001001017)', value: 6000 },
            { glCode: 'X2001001018', category: 'BR - CONVEYANCE ALLOWANCE(X2001001018)', value: 17500 },
            { glCode: 'X2001001019', category: 'BR - NOTICE PAY SALARY', value: 0 }
        ]

        // ADMINISTRATION COST - BACK OFFICE
        const administrationBO = [
            { glCode: 'X2001002001', category: 'AUDIT FEES(X2001002001)', value: 45000 },
            { glCode: 'X2001002003', category: 'COMMISSION & BROKERAGE(X2001002003)', value: 125000 },
            { glCode: 'X2001002004', category: 'COMPUTER EXPENSES(X2001002004)', value: 35000 },
            { glCode: 'X2001002006', category: 'BR - CONVEYANCE (X2001002006)', value: 25000 },
            { glCode: 'X2001002008', category: 'DONATION(X2001002008)', value: 15000 },
            { glCode: 'X2001002009', category: 'ELECTRICITY CHARGES(X2001002009)', value: 65000 },
            { glCode: 'X2001002010', category: 'FESTIVAL EXPENESES(X2001002010)', value: 25000 },
            { glCode: 'X2001002011', category: 'GAIN & LOSS ON BRANCH ASSETS(X2001002011)', value: 0 },
            { glCode: 'X2001002012', category: 'LEGAL EXPENSES(X2001002012)', value: 35000 },
            { glCode: 'X2001002013', category: 'MEDICAL INSURANCE(X2001002013)', value: 45000 },
            { glCode: 'X2001002014', category: 'MISC. EXPENSES(X2001002014)', value: 18000 },
            { glCode: 'X2001002016', category: 'OFFICE EXPENSES(X2001002016)', value: 28000 },
            { glCode: 'X2001002017', category: 'POSTGE,TELEG & COURIER(X2001002017)', value: 12000 },
            { glCode: 'X2001002018', category: 'PRINTING & STATIONERY(X2001002018)', value: 22000 },
            { glCode: 'X2001002019', category: 'PROFESSION TAX (COMPANY)(X2001002019)', value: 8000 },
            { glCode: 'X2001002020', category: 'PROFESSIONAL CHGS.(X2001002020)', value: 55000 },
            { glCode: 'X2001002021', category: 'RATES & TAXES(X2001002021)', value: 15000 },
            { glCode: 'X2001002022', category: 'OFFICE RENT(X2001002022)', value: 125000 },
            { glCode: 'X2001002023', category: 'TELEPHONE EXPENSES(X2001002023)', value: 28000 },
            { glCode: 'X2001002024', category: 'INTERNET CHARGES(X2001002024)', value: 15000 },
            { glCode: 'X2001002025', category: 'TRAINING EXPENSES(X2001002025)', value: 35000 },
            { glCode: 'X2001002026', category: 'BR - TRAVELLING EXPENSES(X2001002026)', value: 45000 },
            { glCode: 'X2001002027', category: 'ROC CHARGES(X2001002027)', value: 8000 },
            { glCode: 'X2001002028', category: 'REPAIRS & MAINTANANCE(X2001002028)', value: 35000 },
            { glCode: 'X2001002031', category: 'REBATE & DISCOUNT ALLOWED(X2001002031)', value: 0 },
            { glCode: 'X2001002032', category: 'STAFF WELFARE EXPENSES(X2001002032)', value: 28000 },
            { glCode: 'X2001002033', category: 'INTEREST ,PENALTY & LATE FILING FEES(X2001002033)', value: 5000 },
            { glCode: 'X2001002035', category: 'STAFF RECOGNITION & DEVELOPMENT(X2001002035)', value: 18000 },
            { glCode: 'X2001002037', category: 'TENDER CHARGES(X2001002037)', value: 25000 },
            { glCode: 'X2001002043', category: 'SUBSCRIPTION/REGISTRATION FEES(X2001002043)', value: 15000 },
            { glCode: 'X2001002044', category: 'STAMP DUTY & FRANKING CHARGES', value: 3000 },
            { glCode: 'X2001002046', category: 'INTEREST ON GST', value: 2000 },
            { glCode: 'X2001002047', category: 'GST LATE FILING FEES', value: 1000 },
            { glCode: 'X2001002048', category: 'BR - PERFORMANCE INCENTIVE', value: 35000 },
            { glCode: 'X2001002051', category: 'REIBURSEMENT OF ROC EXPENSES', value: 5000 },
            { glCode: 'X2001002052', category: 'CONSULTANCY CHARGES - OVERSEAS', value: 0 },
            { glCode: 'X2001002054', category: 'MOTOR VEHICLE EXPNSES', value: 45000 },
            { glCode: 'X2001002055', category: 'FUEL EXPENSES', value: 35000 },
            { glCode: 'X2001002056', category: 'LABOUR LICENSE FEES', value: 8000 },
            { glCode: 'X2001002058', category: 'INELIGIBLE GST EXPENSES', value: 5000 },
            { glCode: 'X2001002059', category: 'INTEREST ON ESIC', value: 1000 },
            { glCode: 'X2001002060', category: 'INTEREST ON PF', value: 2000 },
            { glCode: 'X2001002061', category: 'DAMAGES ON PF', value: 0 }
        ]

        // ADMINISTRATION COST - SALES
        const administrationSales = [
            { glCode: 'X2001002005', category: 'CONFERENCE & SEMINAR EXPENSES(X2001002005)', value: 25000 },
            { glCode: 'X2001002015', category: 'NEWS PAPERS,BOOKS & PERIODICAL(X2001002015)', value: 8000 },
            { glCode: 'X2001002041', category: 'JOB WEB SERVICES(X2001002041)', value: 15000 },
            { glCode: 'X2001002045', category: 'ADVERTISEMENT EXPENSES(X2001002045)', value: 85000 }
        ]

        // OTHER INCOME
        const otherIncome = [
            { glCode: 'R2001001', category: 'BANK INTEREST RECEIVED(R2001001)', value: 15000 },
            { glCode: 'R2001002', category: 'MISC INCOME(R2001002)', value: 8000 },
            { glCode: 'R2001003', category: 'ROUND OFF(R2001003)', value: 125 },
            { glCode: 'R2001004', category: 'WRITTEN BACK(R2001004)', value: 0 },
            { glCode: 'R2001005', category: 'INTEREST ON INCOME TAX REFUND(R2001005)', value: 0 },
            { glCode: 'R2001006', category: 'REBATE & DISCOUNT RECD(R2001006)', value: 5000 },
            { glCode: 'R2001007', category: 'EXCESS PROVISION WRITTEN BACK', value: 0 },
            { glCode: 'X1001001001020', category: 'FO - PROVIDENT FUND (PF) PMPRY YOJANA', value: 2500 }
        ]

        // FINANCE COST
        const financeCost = [
            { glCode: 'X2002002001', category: 'INTEREST ON BANK LOAN CC A/C(X2002002001)', value: 45000 },
            { glCode: 'X2002002002', category: 'INTEREST ON BANK LOAN TERM LOAN  A/C(X2002002002)', value: 25000 },
            { glCode: 'X2002002004', category: 'INTEREST ON UNSECURED LOAN', value: 0 },
            { glCode: 'X2002002005', category: 'LOAN PROCESSING CHARGES', value: 5000 },
            { glCode: 'X2002002006', category: 'FOREIGN REMITTANCE BANK CHG', value: 2000 },
            { glCode: 'X2002002007', category: 'LOSS ON FOREIGN EXCHANGE', value: 0 },
            { glCode: 'X2002002003', category: 'BANK CHARGES(X2002002003)', value: 8000 }
        ]

        // DEPRECIATION
        const depreciation = [
            { glCode: 'X2001002007', category: 'DEPRECIATION(X2001002007)', value: 125000 }
        ]

        // EXTRAORDINARY EXPENSES
        const extraordinaryExpenses = [
            { glCode: 'X1001004006', category: 'SPECIAL PROJECT EXPENSES', value: 0 },
            { glCode: 'X2001002049', category: 'SUBCONTRACT EXP - PROJECT', value: 0 },
            { glCode: 'X2001002050', category: 'SERBIA EXPENSES', value: 0 },
            { glCode: 'X2001002057', category: 'EVENT EXPENSES', value: 0 },
            { glCode: 'X2001002029', category: 'SPECIAL PROJECT MATERIAL', value: 0 },
            { glCode: 'X2001002030', category: 'INCOME TAX ADJUSTMENT EARLIER PERIOD(X2001002030)', value: 0 },
            { glCode: 'X1001007002', category: 'BAD DEBTS WRITTEN OFF(X1001007002)', value: 0 }
        ]

        return {
            monthLabel,
            yearLabel,
            revenueData,
            employeeCostFO,
            materialFO,
            administrationFO,
            administrationOPS,
            employeeCostManagement,
            administrationManagement,
            employeeCostBO,
            administrationBO,
            administrationSales,
            otherIncome,
            financeCost,
            depreciation,
            extraordinaryExpenses
        }
    } catch (err) {
        console.error('generateCompleteMISData error:', err)
        throw new Error('Failed to generate MIS data')
    }
}

/**
 * Apply header styling
 * @param {Object} cell - ExcelJS cell object
 */
const applyHeaderStyle = (cell) => {
    cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4472C4' } // Blue background
    }
    cell.font = {
        bold: true,
        color: { argb: 'FFFFFFFF' }, // White text
        size: 11,
        name: 'Arial'
    }
    cell.alignment = {
        horizontal: 'center',
        vertical: 'middle',
        wrapText: true
    }
    cell.border = {
        top: { style: 'thin', color: { argb: 'FF000000' } },
        left: { style: 'thin', color: { argb: 'FF000000' } },
        bottom: { style: 'thin', color: { argb: 'FF000000' } },
        right: { style: 'thin', color: { argb: 'FF000000' } }
    }
}

/**
 * Apply section header styling
 * @param {Object} cell - ExcelJS cell object
 * @param {String} sectionType - 'revenue', 'employee', 'material', 'admin', 'other', 'profit'
 */
const applySectionHeaderStyle = (cell, sectionType = 'default') => {
    const colors = {
        revenue: 'FF70AD47',      // Green
        employee: 'FFC55A11',     // Orange
        material: 'FF7030A0',     // Purple
        admin: 'FF0070C0',        // Blue
        other: 'FF44546A',        // Gray
        profit: 'FF203864',       // Dark Blue
        default: 'FFD9E1F2'       // Light Blue
    }

    cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: colors[sectionType] || colors.default }
    }
    cell.font = {
        bold: true,
        color: { argb: 'FFFFFFFF' }, // White text
        size: 11,
        name: 'Arial'
    }
    cell.alignment = {
        horizontal: 'left',
        vertical: 'middle'
    }
    cell.border = {
        top: { style: 'thin', color: { argb: 'FF000000' } },
        left: { style: 'thin', color: { argb: 'FF000000' } },
        bottom: { style: 'thin', color: { argb: 'FF000000' } },
        right: { style: 'thin', color: { argb: 'FF000000' } }
    }
}

/**
 * Apply total row styling
 * @param {Object} cell - ExcelJS cell object
 * @param {Boolean} isGrandTotal - True for grand totals (darker background)
 */
const applyTotalStyle = (cell, isGrandTotal = false) => {
    cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: isGrandTotal ? 'FFFFD966' : 'FFE7E6E6' } // Yellow for grand total, light gray for subtotals
    }
    cell.font = {
        bold: true,
        size: 10,
        name: 'Arial'
    }
    cell.alignment = {
        horizontal: cell.value && typeof cell.value === 'number' ? 'right' : 'left',
        vertical: 'middle'
    }
    cell.border = {
        top: { style: 'thin', color: { argb: 'FF000000' } },
        left: { style: 'thin', color: { argb: 'FF000000' } },
        bottom: { style: 'thin', color: { argb: 'FF000000' } },
        right: { style: 'thin', color: { argb: 'FF000000' } }
    }
}

/**
 * Apply data cell styling
 * @param {Object} cell - ExcelJS cell object
 * @param {Boolean} isNumeric - True for numeric cells
 */
const applyDataCellStyle = (cell, isNumeric = false) => {
    cell.font = {
        size: 10,
        name: 'Arial'
    }
    cell.alignment = {
        horizontal: isNumeric ? 'right' : 'left',
        vertical: 'middle'
    }
    cell.border = {
        top: { style: 'thin', color: { argb: 'FFD0D0D0' } },
        left: { style: 'thin', color: { argb: 'FFD0D0D0' } },
        bottom: { style: 'thin', color: { argb: 'FFD0D0D0' } },
        right: { style: 'thin', color: { argb: 'FFD0D0D0' } }
    }
    if (isNumeric) {
        cell.numFmt = '₹#,##0;[Red](₹#,##0);-'
    }
}

/**
 * Apply percentage cell styling
 * @param {Object} cell - ExcelJS cell object
 */
const applyPercentageStyle = (cell) => {
    cell.font = {
        size: 10,
        name: 'Arial',
        color: { argb: 'FF0070C0' } // Blue color for percentages
    }
    cell.alignment = {
        horizontal: 'right',
        vertical: 'middle'
    }
    cell.border = {
        top: { style: 'thin', color: { argb: 'FFD0D0D0' } },
        left: { style: 'thin', color: { argb: 'FFD0D0D0' } },
        bottom: { style: 'thin', color: { argb: 'FFD0D0D0' } },
        right: { style: 'thin', color: { argb: 'FFD0D0D0' } }
    }
    cell.numFmt = '0.0000'
}

/**
 * Calculate sum of array values
 * @param {Array} array - Array of objects with value property
 * @returns {Number} Sum of values
 */
const sumValues = (array) => {
    return array.reduce((sum, item) => sum + item.value, 0)
}

/**
 * Generate and download Complete MIS Report Excel
 * @param {Object} periodData - { year, month, monthName, stateName }
 */
export const generateCompleteMISExcel = async (periodData) => {
    try {
        console.log('Generating Complete MIS Report Excel for:', periodData)

        // Create workbook
        const workbook = new ExcelJS.Workbook()
        workbook.creator = 'I SMART FACITECH PVT LTD'
        workbook.created = new Date()

        // Create worksheet
        const worksheet = workbook.addWorksheet('MIS Report', {
            pageSetup: {
                paperSize: 9, // A4
                orientation: 'portrait',
                fitToPage: true,
                fitToWidth: 1,
                fitToHeight: 0
            }
        })

        // Generate data
        const data = generateCompleteMISData(periodData)

        // Set column widths
        worksheet.columns = [
            { width: 18 },  // GL Code
            { width: 55 },  // Particulars
            { width: 18 },  // Amount
            { width: 15 },  // Percentage
            { width: 18 },  // Budget
            { width: 18 }   // Variance
        ]

        let currentRow = 1

        // ============= HEADER SECTION =============
        // Title Row
        const titleCell = worksheet.getCell(`A${currentRow}`)
        titleCell.value = 'I SMART FACITECH PVT LTD'
        titleCell.font = { bold: true, size: 16, color: { argb: 'FF366092' }, name: 'Arial' }
        titleCell.alignment = { horizontal: 'center', vertical: 'middle' }
        worksheet.mergeCells(`A${currentRow}:F${currentRow}`)
        currentRow++

        // Subtitle Row
        const subtitleCell = worksheet.getCell(`A${currentRow}`)
        subtitleCell.value = 'MONTHLY MIS REPORT'
        subtitleCell.font = { bold: true, size: 14, color: { argb: 'FF4472C4' }, name: 'Arial' }
        subtitleCell.alignment = { horizontal: 'center', vertical: 'middle' }
        worksheet.mergeCells(`A${currentRow}:F${currentRow}`)
        currentRow++

        // Period Row
        const periodCell = worksheet.getCell(`A${currentRow}`)
        periodCell.value = `Period: ${data.monthLabel} ${data.yearLabel}`
        periodCell.font = { bold: true, size: 11, name: 'Arial' }
        periodCell.alignment = { horizontal: 'center', vertical: 'middle' }
        worksheet.mergeCells(`A${currentRow}:F${currentRow}`)
        currentRow++

        // Empty row
        currentRow++

        // Column Headers
        const headerRow = worksheet.getRow(currentRow)
        headerRow.height = 25
        headerRow.values = [
            'GL Code',
            'PARTICULARS',
            'Amount (₹)',
            'Percentage (%)',
            'Budget (₹)',
            'Variance (₹)'
        ]
        headerRow.eachCell((cell) => {
            applyHeaderStyle(cell)
        })
        currentRow++

        // Helper function to add section
        const addSection = (sectionTitle, sectionType, items) => {
            // Section header
            const sectionRow = worksheet.getRow(currentRow)
            sectionRow.getCell(1).value = sectionTitle
            applySectionHeaderStyle(sectionRow.getCell(1), sectionType)
            worksheet.mergeCells(`A${currentRow}:F${currentRow}`)
            currentRow++

            // Add items
            items.forEach(item => {
                const row = worksheet.getRow(currentRow)
                row.values = [
                    item.glCode,
                    item.category,
                    item.value,
                    0, // Percentage placeholder
                    0, // Budget placeholder
                    0  // Variance placeholder
                ]

                applyDataCellStyle(row.getCell(1), false)
                applyDataCellStyle(row.getCell(2), false)
                applyDataCellStyle(row.getCell(3), true)
                applyPercentageStyle(row.getCell(4))
                applyDataCellStyle(row.getCell(5), true)
                applyDataCellStyle(row.getCell(6), true)

                currentRow++
            })

            return currentRow - 1
        }

        // Helper function to add total row
        const addTotalRow = (title, value, isGrandTotal = false) => {
            const row = worksheet.getRow(currentRow)
            row.values = [
                '',
                title,
                value,
                0, // Percentage
                0, // Budget
                0  // Variance
            ]

            row.eachCell((cell, colNumber) => {
                applyTotalStyle(cell, isGrandTotal)
                if (colNumber === 3 || colNumber === 5 || colNumber === 6) {
                    cell.numFmt = '₹#,##0;[Red](₹#,##0);-'
                    cell.alignment = { horizontal: 'right', vertical: 'middle' }
                } else if (colNumber === 4) {
                    cell.numFmt = '0.0000'
                    cell.font = { bold: true, size: 10, name: 'Arial', color: { argb: 'FF0070C0' } }
                    cell.alignment = { horizontal: 'right', vertical: 'middle' }
                }
            })

            currentRow++
        }

        // ============= REVENUE SECTION =============
        addSection('REVENUE', 'revenue', data.revenueData)
        const totalRevenue = sumValues(data.revenueData)
        addTotalRow('TOTAL REVENUE', totalRevenue, false)
        currentRow++ // Empty row

        // ============= EMPLOYEE COST FO =============
        addSection('Employee cost FO', 'employee', data.employeeCostFO)
        const totalEmpFO = sumValues(data.employeeCostFO)
        addTotalRow('Total Employee cost FO', totalEmpFO, false)
        currentRow++

        // ============= MATERIAL FO =============
        addSection('Material -FO', 'material', data.materialFO)
        const totalMatFO = sumValues(data.materialFO)
        addTotalRow('Total Material -FO', totalMatFO, false)
        currentRow++

        // ============= ADMINISTRATION FO =============
        addSection('Administration -FO', 'admin', data.administrationFO)
        const totalAdminFO = sumValues(data.administrationFO)
        addTotalRow('Total Administration -FO', totalAdminFO, false)
        currentRow++

        // ============= EMPLOYEE COST OPS =============
        addSection('Employee cost -OPS', 'employee', [])
        addTotalRow('Total Employee cost -OPS', 0, false)
        currentRow++

        // ============= MATERIAL OPS =============
        addSection('Material & other reimb-OPS', 'material', [])
        addTotalRow('Total Material & other reimb-OPS', 0, false)
        currentRow++

        // ============= ADMINISTRATION OPS =============
        addSection('Administration -OPS', 'admin', data.administrationOPS)
        const totalAdminOPS = sumValues(data.administrationOPS)
        addTotalRow('Total Administration -OPS', totalAdminOPS, false)
        currentRow++

        // ============= TOTAL OPERATING COST =============
        const totalOperatingCost = totalEmpFO + totalMatFO + totalAdminFO + totalAdminOPS
        addTotalRow('Total Operating cost', totalOperatingCost, false)
        currentRow++

        // ============= GROSS OPERATING MARGIN =============
        const grossOperatingMargin = totalRevenue - totalOperatingCost
        addTotalRow('Gross Operating Margin', grossOperatingMargin, true)
        currentRow++

        // ============= EMPLOYEE COST MANAGEMENT =============
        addSection('Employee Cost - Management', 'employee', data.employeeCostManagement)
        const totalEmpMgmt = sumValues(data.employeeCostManagement)
        addTotalRow('Total Employee Cost - Management', totalEmpMgmt, false)
        currentRow++

        // ============= ADMINISTRATION MANAGEMENT =============
        addSection('Administration Cost - Management', 'admin', data.administrationManagement)
        const totalAdminMgmt = sumValues(data.administrationManagement)
        addTotalRow('Total Administration Cost - Management', totalAdminMgmt, false)
        currentRow++

        // ============= EMPLOYEE COST BO =============
        addSection('Employee cost BO', 'employee', data.employeeCostBO)
        const totalEmpBO = sumValues(data.employeeCostBO)
        addTotalRow('Total Employee cost BO', totalEmpBO, false)
        currentRow++

        // ============= ADMINISTRATION BO =============
        addSection('Administration cost BO', 'admin', data.administrationBO)
        const totalAdminBO = sumValues(data.administrationBO)
        addTotalRow('Total Administration cost BO', totalAdminBO, false)
        currentRow++

        // ============= EMPLOYEE COST SALES =============
        addSection('Employee cost - Sales', 'employee', [])
        addTotalRow('Total Employee cost - Sales', 0, false)
        currentRow++

        // ============= ADMINISTRATION SALES =============
        addSection('Administration cost - Sales', 'admin', data.administrationSales)
        const totalAdminSales = sumValues(data.administrationSales)
        addTotalRow('Total Administration cost - Sales', totalAdminSales, false)
        currentRow++

        // ============= TOTAL NON BILLABLE COST =============
        const totalNonBillable = totalEmpMgmt + totalAdminMgmt + totalEmpBO + totalAdminBO + totalAdminSales
        addTotalRow('Total Non Billable Cost', totalNonBillable, false)
        currentRow++

        // ============= GROSS PROFIT =============
        const grossProfit = grossOperatingMargin - totalNonBillable
        addTotalRow('Gross Profit', grossProfit, true)
        currentRow++

        // ============= OTHER INCOME =============
        addSection('Add : Other Income', 'other', data.otherIncome)
        const totalOtherIncome = sumValues(data.otherIncome)
        addTotalRow('Total Other Income', totalOtherIncome, false)
        currentRow++

        // ============= EBITDA =============
        const ebitda = grossProfit + totalOtherIncome
        addTotalRow('EBIDTA', ebitda, true)
        currentRow++

        // ============= FINANCE COST =============
        addSection('Less : Finance Cost', 'other', data.financeCost)
        const totalFinanceCost = sumValues(data.financeCost)
        addTotalRow('Total Finance Cost', totalFinanceCost, false)
        currentRow++

        // ============= DEPRECIATION =============
        addSection('Less: Depreciation', 'other', data.depreciation)
        const totalDepreciation = sumValues(data.depreciation)
        addTotalRow('Total Depreciation', totalDepreciation, false)
        currentRow++

        // ============= NET PROFIT =============
        const netProfit = ebitda - totalFinanceCost - totalDepreciation
        addTotalRow('Net Profit', netProfit, true)
        currentRow++

        // ============= EXTRAORDINARY EXPENSES =============
        addSection('Less: extra ordinary exp', 'other', data.extraordinaryExpenses)
        const totalExtraordinary = sumValues(data.extraordinaryExpenses)
        addTotalRow('Total extra ordinary exp', totalExtraordinary, false)
        currentRow++

        // ============= PROFIT BEFORE TAX =============
        const pbt = netProfit - totalExtraordinary
        addTotalRow('Profit Before Tax', pbt, true)
        currentRow++

        // ============= PROVISION FOR TAX =============
        addSection('Provision for tax', 'other', [])
        addTotalRow('Provision for tax', 0, false)
        currentRow++

        // ============= PROFIT AFTER TAX =============
        const pat = pbt - 0 // Minus tax provision
        addTotalRow('Profit After Tax', pat, true)

        // Freeze panes at header row
        worksheet.views = [
            { state: 'frozen', xSplit: 0, ySplit: 5 }
        ]

        // Generate buffer
        const buffer = await workbook.xlsx.writeBuffer()

        // Create filename
        const filename = `Complete_MIS_Report_${data.monthLabel}_${data.yearLabel}_${periodData.stateName || 'All'}.xlsx`

        // Save file
        const blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        })
        saveAs(blob, filename)

        console.log('Complete MIS Report Excel generated successfully:', filename)
        return { success: true, filename }
    } catch (err) {
        console.error('generateCompleteMISExcel error:', err)
        throw new Error(err.message || 'Failed to generate Complete MIS Report Excel')
    }
}

export default {
    generateCompleteMISExcel
}
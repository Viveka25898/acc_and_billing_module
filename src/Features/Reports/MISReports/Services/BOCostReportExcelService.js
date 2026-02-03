/* eslint-disable no-unused-vars */
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'

/**
 * Back Office Cost Report Excel Generation Service
 * Generates comprehensive BO Cost Report with Budget vs Actual comparison
 */

/**
 * Generate BO Cost Report data structure
 * @param {Object} periodData - { year, month, monthName, stateName }
 * @returns {Object} Structured data for the report
 */
const generateBOCostData = (periodData) => {
    try {
        const { year, month, monthName, stateName } = periodData

        // Employee Costs
        const employeeCosts = [
            { subCategory: 'Salaries & Wages', budget: 4800000, actual: 4793347, variance: 36453, variancePct: 0.8 },
            { subCategory: 'Recruitment & Insurance', budget: 500000, actual: 500000, variance: 100000, variancePct: 1.0 },
            { subCategory: 'Training & Development', budget: 120000, actual: 115000, variance: 5000, variancePct: 4.2 },
            { subCategory: 'Recruitment Costs', budget: 80000, actual: 75000, variance: 5000, variancePct: 6.3 }
        ]

        // Administrative Expenses
        const administrativeExpenses = [
            { subCategory: 'Office Rent', budget: 500000, actual: 457355, variance: 2045, variancePct: 0.4 },
            { subCategory: 'Utilities Expenses', budget: 150000, actual: 140526, variance: 9672, variancePct: 6.0 },
            { subCategory: 'Office Supplies', budget: 50000, actual: 48000, variance: 2000, variancePct: 4.0 },
            { subCategory: 'Printing & Stationery', budget: 25000, actual: 22000, variance: 3000, variancePct: 12.0 },
            { subCategory: 'Postage & Courier', budget: 15000, actual: 12500, variance: 2500, variancePct: 16.7 }
        ]

        // Technology & IT
        const technologyIT = [
            { subCategory: 'Computer Equipment', budget: 450000, actual: 422370.75, variance: 27429.25, variancePct: 6.1 },
            { subCategory: 'Software Licenses', budget: 280000, actual: 275000, variance: 5000, variancePct: 1.8 },
            { subCategory: 'IT Support & Maintenance', budget: 180000, actual: 175000, variance: 5000, variancePct: 2.8 },
            { subCategory: 'Internet & Telecom', budget: 95000, actual: 90000, variance: 5000, variancePct: 5.3 },
            { subCategory: 'Cloud Services', budget: 35000, actual: 30000, variance: 5000, variancePct: 14.3 }
        ]

        // Professional Services
        const professionalServices = [
            { subCategory: 'Legal & Compliance', budget: 200000, actual: 195000, variance: 5000, variancePct: 2.5 },
            { subCategory: 'Accounting & Audit', budget: 150000, actual: 145000, variance: 5000, variancePct: 3.3 },
            { subCategory: 'Consulting Services', budget: 280000, actual: 265000, variance: 15000, variancePct: 5.4 },
            { subCategory: 'Professional Development', budget: 70000, actual: 65000, variance: 5000, variancePct: 7.1 }
        ]

        // Facilities & Operations
        const facilitiesOperations = [
            { subCategory: 'Utilities', budget: 85000, actual: 80000, variance: 5000, variancePct: 5.9 },
            { subCategory: 'Electricity Charges', budget: 105000, actual: 101613, variance: 3387, variancePct: 3.2 },
            { subCategory: 'Building Maintenance', budget: 120000, actual: 115000, variance: 5000, variancePct: 4.2 },
            { subCategory: 'Security Services', budget: 75000, actual: 72000, variance: 3000, variancePct: 4.0 },
            { subCategory: 'Cleaning Services', budget: 48000, actual: 45000, variance: 3000, variancePct: 6.3 }
        ]

        // Insurance & Compliance
        const insuranceCompliance = [
            { subCategory: 'General Insurance', budget: 95000, actual: 92000, variance: 3000, variancePct: 3.2 },
            { subCategory: 'Professional Liability', budget: 65000, actual: 62000, variance: 3000, variancePct: 4.6 },
            { subCategory: 'Compliance & Regulatory', budget: 55000, actual: 52000, variance: 3000, variancePct: 5.5 },
            { subCategory: 'License Fees', budget: 38000, actual: 35483, variance: 2517, variancePct: 6.6 }
        ]

        // Travel & Conveyance
        const travelConveyance = [
            { subCategory: 'Business Travel', budget: 220000, actual: 214726.19, variance: 5273.81, variancePct: 2.4 },
            { subCategory: 'Conveyance', budget: 155000, actual: 150054.50, variance: 4545.50, variancePct: 2.9 },
            { subCategory: 'Vehicle Maintenance', budget: 45000, actual: 42000, variance: 3000, variancePct: 6.7 },
            { subCategory: 'Fuel Costs', budget: 85000, actual: 80000, variance: 5000, variancePct: 5.9 }
        ]

        // Miscellaneous
        const miscellaneous = [
            { subCategory: 'Bank Charges', budget: 28000, actual: 25000, variance: 3000, variancePct: 10.7 },
            { subCategory: 'Subscriptions & Memberships', budget: 95000, actual: 92975, variance: 2025, variancePct: 2.1 },
            { subCategory: 'Staff Welfare', budget: 100000, actual: 95176, variance: 4824, variancePct: 4.8 },
            { subCategory: 'Festival Expenses', budget: 145000, actual: 139883, variance: 5117, variancePct: 3.5 },
            { subCategory: 'Medical Insurance', budget: 152000, actual: 140928, variance: 11072, variancePct: 7.3 },
            { subCategory: 'Late Filing Fees', budget: 5000, actual: 550, variance: 4450, variancePct: 89.0 },
            { subCategory: 'Stamp Duty', budget: 35000, actual: 32971, variance: 2029, variancePct: 5.8 },
            { subCategory: 'Recognition & Awards', budget: 25000, actual: 6300, variance: 18700, variancePct: 74.8 },
            { subCategory: 'Communication', budget: 140000, actual: 137590.82, variance: 2009.91, variancePct: 1.4 }
        ]

        return {
            monthLabel: monthName || 'October',
            yearLabel: year || 2025,
            employeeCosts,
            administrativeExpenses,
            technologyIT,
            professionalServices,
            facilitiesOperations,
            insuranceCompliance,
            travelConveyance,
            miscellaneous
        }
    } catch (err) {
        console.error('generateBOCostData error:', err)
        throw new Error('Failed to generate BO Cost data')
    }
}

/**
 * Apply header styling
 */
const applyHeaderStyle = (cell) => {
    cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF1F4E78' } // Dark Blue
    }
    cell.font = {
        bold: true,
        color: { argb: 'FFFFFFFF' },
        size: 11,
        name: 'Calibri'
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
 * Apply category header styling
 */
const applyCategoryHeaderStyle = (cell) => {
    cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4472C4' } // Medium Blue
    }
    cell.font = {
        bold: true,
        color: { argb: 'FFFFFFFF' },
        size: 11,
        name: 'Calibri'
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
 * Apply subtotal row styling
 */
const applySubtotalStyle = (cell, isNumeric = false) => {
    cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD9E1F2' } // Light Blue
    }
    cell.font = {
        bold: true,
        size: 10,
        name: 'Calibri'
    }
    cell.alignment = {
        horizontal: isNumeric ? 'right' : 'left',
        vertical: 'middle'
    }
    cell.border = {
        top: { style: 'thin', color: { argb: 'FF000000' } },
        left: { style: 'thin', color: { argb: 'FF000000' } },
        bottom: { style: 'thin', color: { argb: 'FF000000' } },
        right: { style: 'thin', color: { argb: 'FF000000' } }
    }
    if (isNumeric) {
        cell.numFmt = '₹#,##0.00'
    }
}

/**
 * Apply grand total styling
 */
const applyGrandTotalStyle = (cell, isNumeric = false) => {
    cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFC000' } // Orange
    }
    cell.font = {
        bold: true,
        size: 12,
        name: 'Calibri',
        color: { argb: 'FF000000' }
    }
    cell.alignment = {
        horizontal: isNumeric ? 'right' : 'left',
        vertical: 'middle'
    }
    cell.border = {
        top: { style: 'double', color: { argb: 'FF000000' } },
        left: { style: 'thin', color: { argb: 'FF000000' } },
        bottom: { style: 'double', color: { argb: 'FF000000' } },
        right: { style: 'thin', color: { argb: 'FF000000' } }
    }
    if (isNumeric) {
        cell.numFmt = '₹#,##0.00'
    }
}

/**
 * Apply data cell styling
 */
const applyDataCellStyle = (cell, isNumeric = false) => {
    cell.font = {
        size: 10,
        name: 'Calibri'
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
        cell.numFmt = '₹#,##0.00'
    }
}

/**
 * Apply variance percentage styling
 */
const applyVariancePctStyle = (cell, value) => {
    cell.font = {
        size: 10,
        name: 'Calibri',
        bold: true
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
    cell.numFmt = '0.0%'

    // Color code based on variance
    if (value > 10) {
        cell.font.color = { argb: 'FFFF0000' } // Red for high variance
    } else if (value > 5) {
        cell.font.color = { argb: 'FFFF9900' } // Orange for medium variance
    } else {
        cell.font.color = { argb: 'FF00B050' } // Green for low variance
    }
}

/**
 * Calculate sum of budget or actual
 */
const sumField = (array, field) => {
    return array.reduce((sum, item) => sum + item[field], 0)
}

/**
 * Generate and download BO Cost Report Excel
 * @param {Object} periodData - { year, month, monthName, stateName }
 */
export const generateBOCostReportExcel = async (periodData) => {
    try {
        console.log('Generating BO Cost Report Excel for:', periodData)

        // Create workbook
        const workbook = new ExcelJS.Workbook()
        workbook.creator = 'I SMART FACITECH PVT LTD'
        workbook.created = new Date()

        // Create worksheet
        const worksheet = workbook.addWorksheet('BO Cost Report', {
            pageSetup: {
                paperSize: 9, // A4
                orientation: 'portrait',
                fitToPage: true,
                fitToWidth: 1,
                fitToHeight: 0
            }
        })

        // Generate data
        const data = generateBOCostData(periodData)

        // Set column widths
        worksheet.columns = [
            { width: 25 },  // Cost Category
            { width: 35 },  // Sub-Category
            { width: 18 },  // Budget
            { width: 18 },  // Actual
            { width: 18 },  // Variance
            { width: 15 }   // Variance %
        ]

        let currentRow = 1

        // ============= HEADER SECTION =============
        // Title Row
        const titleCell = worksheet.getCell(`A${currentRow}`)
        titleCell.value = 'BACK OFFICE COST REPORT'
        titleCell.font = { bold: true, size: 16, color: { argb: 'FF1F4E78' }, name: 'Calibri' }
        titleCell.alignment = { horizontal: 'center', vertical: 'middle' }
        worksheet.mergeCells(`A${currentRow}:F${currentRow}`)
        currentRow++

        // Period Row
        const periodCell = worksheet.getCell(`A${currentRow}`)
        periodCell.value = `Report Period: FY ${data.yearLabel}`
        periodCell.font = { bold: true, size: 11, name: 'Calibri' }
        periodCell.alignment = { horizontal: 'center', vertical: 'middle' }
        worksheet.mergeCells(`A${currentRow}:F${currentRow}`)
        currentRow++

        // Generated Date Row
        const dateCell = worksheet.getCell(`A${currentRow}`)
        dateCell.value = `Generated: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`
        dateCell.font = { italic: true, size: 10, name: 'Calibri' }
        dateCell.alignment = { horizontal: 'center', vertical: 'middle' }
        worksheet.mergeCells(`A${currentRow}:F${currentRow}`)
        currentRow++

        // Empty row
        currentRow++

        // Column Headers
        const headerRow = worksheet.getRow(currentRow)
        headerRow.height = 30
        headerRow.values = [
            'Cost Category',
            'Sub-Category',
            'Budget',
            'Actual',
            'Variance',
            'Variance %'
        ]
        headerRow.eachCell((cell) => {
            applyHeaderStyle(cell)
        })
        currentRow++

        // Helper function to add category section
        const addCategorySection = (categoryName, items) => {
            // Category header
            const categoryRow = worksheet.getRow(currentRow)
            categoryRow.getCell(1).value = categoryName
            applyCategoryHeaderStyle(categoryRow.getCell(1))
            worksheet.mergeCells(`A${currentRow}:F${currentRow}`)
            currentRow++

            // Add items
            items.forEach(item => {
                const row = worksheet.getRow(currentRow)
                const variance = item.budget - item.actual
                const variancePct = item.budget > 0 ? (variance / item.budget) : 0

                row.values = [
                    '',
                    item.subCategory,
                    item.budget,
                    item.actual,
                    variance,
                    variancePct
                ]

                applyDataCellStyle(row.getCell(1), false)
                applyDataCellStyle(row.getCell(2), false)
                applyDataCellStyle(row.getCell(3), true)
                applyDataCellStyle(row.getCell(4), true)
                applyDataCellStyle(row.getCell(5), true)
                applyVariancePctStyle(row.getCell(6), Math.abs(variancePct * 100))

                currentRow++
            })

            // Subtotal row
            const subtotalRow = worksheet.getRow(currentRow)
            const totalBudget = sumField(items, 'budget')
            const totalActual = sumField(items, 'actual')
            const totalVariance = totalBudget - totalActual
            const totalVariancePct = totalBudget > 0 ? (totalVariance / totalBudget) : 0

            subtotalRow.values = [
                '',
                `Subtotal - ${categoryName}`,
                totalBudget,
                totalActual,
                totalVariance,
                totalVariancePct
            ]

            applySubtotalStyle(subtotalRow.getCell(1), false)
            applySubtotalStyle(subtotalRow.getCell(2), false)
            applySubtotalStyle(subtotalRow.getCell(3), true)
            applySubtotalStyle(subtotalRow.getCell(4), true)
            applySubtotalStyle(subtotalRow.getCell(5), true)
            applySubtotalStyle(subtotalRow.getCell(6), false)
            subtotalRow.getCell(6).numFmt = '0.0%'
            subtotalRow.getCell(6).font = { bold: true, size: 10, name: 'Calibri' }

            currentRow++

            return { totalBudget, totalActual, totalVariance, totalVariancePct }
        }

        // Add all categories
        const empCosts = addCategorySection('Employee Costs', data.employeeCosts)
        const adminExp = addCategorySection('Administrative Expenses', data.administrativeExpenses)
        const techIT = addCategorySection('Technology & IT', data.technologyIT)
        const profServ = addCategorySection('Professional Services', data.professionalServices)
        const facilities = addCategorySection('Facilities & Operations', data.facilitiesOperations)
        const insurance = addCategorySection('Insurance & Compliance', data.insuranceCompliance)
        const travel = addCategorySection('Travel & Conveyance', data.travelConveyance)
        const misc = addCategorySection('Miscellaneous', data.miscellaneous)

        // Empty row before grand total
        currentRow++

        // GRAND TOTAL
        const grandTotalRow = worksheet.getRow(currentRow)
        const grandTotalBudget = empCosts.totalBudget + adminExp.totalBudget + techIT.totalBudget +
            profServ.totalBudget + facilities.totalBudget + insurance.totalBudget +
            travel.totalBudget + misc.totalBudget
        const grandTotalActual = empCosts.totalActual + adminExp.totalActual + techIT.totalActual +
            profServ.totalActual + facilities.totalActual + insurance.totalActual +
            travel.totalActual + misc.totalActual
        const grandTotalVariance = grandTotalBudget - grandTotalActual
        const grandTotalVariancePct = grandTotalBudget > 0 ? (grandTotalVariance / grandTotalBudget) : 0

        grandTotalRow.values = [
            'GRAND TOTAL',
            '',
            grandTotalBudget,
            grandTotalActual,
            grandTotalVariance,
            grandTotalVariancePct
        ]

        applyGrandTotalStyle(grandTotalRow.getCell(1), false)
        applyGrandTotalStyle(grandTotalRow.getCell(2), false)
        applyGrandTotalStyle(grandTotalRow.getCell(3), true)
        applyGrandTotalStyle(grandTotalRow.getCell(4), true)
        applyGrandTotalStyle(grandTotalRow.getCell(5), true)
        applyGrandTotalStyle(grandTotalRow.getCell(6), false)
        grandTotalRow.getCell(6).numFmt = '0.0%'
        currentRow++

        // Empty rows
        currentRow += 2

        // KEY METRICS Section
        const metricsStartRow = currentRow
        const metricsHeaderRow = worksheet.getRow(currentRow)
        metricsHeaderRow.getCell(1).value = 'KEY METRICS'
        metricsHeaderRow.getCell(1).font = { bold: true, size: 12, name: 'Calibri', color: { argb: 'FF1F4E78' } }
        currentRow++

        const metrics = [
            { label: 'Total Budget Allocated:', value: grandTotalBudget },
            { label: 'Total Actual Cost:', value: grandTotalActual },
            { label: 'Total Variance:', value: grandTotalVariance },
            { label: 'Budget Utilization %:', value: grandTotalActual / grandTotalBudget },
            { label: 'Savings/Overspend %:', value: grandTotalVariancePct }
        ]

        metrics.forEach(metric => {
            const row = worksheet.getRow(currentRow)
            row.getCell(1).value = metric.label
            row.getCell(1).font = { bold: true, size: 10, name: 'Calibri' }
            row.getCell(2).value = metric.value
            row.getCell(2).font = { size: 10, name: 'Calibri' }
            row.getCell(2).alignment = { horizontal: 'right' }

            if (metric.label.includes('%')) {
                row.getCell(2).numFmt = '0.0%'
            } else {
                row.getCell(2).numFmt = '₹#,##0.00'
            }

            currentRow++
        })

        // Freeze panes at header row
        worksheet.views = [
            { state: 'frozen', xSplit: 0, ySplit: 5 }
        ]

        // Generate buffer
        const buffer = await workbook.xlsx.writeBuffer()

        // Create filename
        const filename = `BO_Cost_Report_${data.monthLabel}_${data.yearLabel}.xlsx`

        // Save file
        const blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        })
        saveAs(blob, filename)

        console.log('BO Cost Report Excel generated successfully:', filename)
        return { success: true, filename }
    } catch (err) {
        console.error('generateBOCostReportExcel error:', err)
        throw new Error(err.message || 'Failed to generate BO Cost Report Excel')
    }
}

export default {
    generateBOCostReportExcel
}

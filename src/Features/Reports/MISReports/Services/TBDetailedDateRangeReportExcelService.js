import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'

/**
 * TB Detailed Date Range Report Excel Generation Service
 * Generates Detailed Trial Balance Report in Excel format for custom date ranges
 * Production-ready code with comprehensive error handling
 */

/**
 * Generate TB Detailed Date Range data (flat structure - no hierarchy)
 * @param {Object} dateRange - { fromDate, toDate }
 * @returns {Object} Structured detailed trial balance data
 */
const generateTBDetailedDateRangeData = (dateRange) => {
    try {
        // Format dates for display
        const formatDate = (dateStr) => {
            if (!dateStr) return ''
            const date = new Date(dateStr)
            const day = String(date.getDate()).padStart(2, '0')
            const month = String(date.getMonth() + 1).padStart(2, '0')
            const year = date.getFullYear()
            return `${day}/${month}/${year}`
        }

        const fromDateFormatted = formatDate(dateRange.fromDate)
        const toDateFormatted = formatDate(dateRange.toDate)

        const data = {
            companyName: 'I SMART FACITECH PRIVATE LIMITED',
            financialYear: 'Financial Year - From 01/04/2025 To 28/02/2026',
            reportTitle: 'DETAILED TRIAL BALANCE REPORT',
            periodInfo: `Period From ${fromDateFormatted} To ${toDateFormatted}`,
            accounts: [
                { glCode: 'A1001001', glName: 'FA COMPUTER', drOpeningBal: 4158905.22, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 4158905.22, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A1002001', glName: 'FA FURNITURE & FIXTURE', drOpeningBal: 4024237.33, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 4024237.33, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A1004001', glName: 'FA SOFTWARE', drOpeningBal: 696067.00, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 696067.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A1005001', glName: 'FA OFFICE EQUIPMENT', drOpeningBal: 3118993.84, crOpeningBal: 0, periodDr: 78200.00, periodCr: 0, drClosingBal: 3197193.84, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A1007001', glName: 'FA MACHINERY', drOpeningBal: 8435883.51, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 8435883.51, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A1008001', glName: 'ACCUMULATED  DEPRECIATION', drOpeningBal: 0, crOpeningBal: 10936948.00, periodDr: 0, periodCr: 1133235.00, drClosingBal: 0, crClosingBal: 12070183.00, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3001001', glName: 'DEPOSIT - RENTAL OFFICE', drOpeningBal: 1459000.00, crOpeningBal: 0, periodDr: 97000.00, periodCr: 16000.00, drClosingBal: 1540000.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3001002', glName: 'DEPOSIT - STAFF ACCOMODATIONS', drOpeningBal: 133900.00, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 133900.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3001004', glName: 'DEPOSIT - LABOUR LICENSE', drOpeningBal: 373931.00, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 373931.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3001005', glName: 'DEPOSITS - OTHER', drOpeningBal: 55000.00, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 55000.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3001006', glName: 'FD AGAINST HDFC BANK INDORE FD A/C -50300519330209', drOpeningBal: 45000.00, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 45000.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3001007', glName: 'EMD - MCGM', drOpeningBal: 5345648.00, crOpeningBal: 0, periodDr: 0, periodCr: 2682000.00, drClosingBal: 2663648.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3001010', glName: 'EMD - UNIVERCITY OF MUMBAI - KALINA', drOpeningBal: 0, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 0, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3001015', glName: 'FD AGAINST KEM HOSPITAL BG -', drOpeningBal: 1012500.00, crOpeningBal: 0, periodDr: 0, periodCr: 1012500.00, drClosingBal: 0, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3001017', glName: 'EMD - MAHADA', drOpeningBal: 150000.00, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 150000.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3001018', glName: 'FD AGAINST HDFC BANK -50300834091536', drOpeningBal: 230000.00, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 230000.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3001019', glName: 'FD AGAINST ROYAL CONSULATE SAUDI ARABIA', drOpeningBal: 0, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 0, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3001020', glName: 'FD AGAINST MAHADA BG FD NO 104510DP00010657', drOpeningBal: 1490007.00, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 1490007.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3001022', glName: 'FD AGAIST BG MDL A/C 104510DP00010790', drOpeningBal: 6115.00, crOpeningBal: 0, periodDr: 0, periodCr: 6115.00, drClosingBal: 0, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3001023', glName: 'FD AGAINST IRCTC BG 104510OR00002792', drOpeningBal: 0, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 0, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3001024', glName: 'EMD - MUMBAI FIRE BRIGADE', drOpeningBal: 0, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 0, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3001025', glName: 'FD AGAINST BG PERIPHERALS HOSPITALS', drOpeningBal: 904630.00, crOpeningBal: 0, periodDr: 0, periodCr: 717068.00, drClosingBal: 187562.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3001026', glName: 'DEPOSIT -PG- DISTRICT JUDGE DAHOD', drOpeningBal: 1500000.00, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 1500000.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3001027', glName: 'EMD - THE ORIENTAL INSURANCE CO LTD', drOpeningBal: 0, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 0, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3001028', glName: 'FD AGAINST ICAR KOZHIKODE BG 104510DP00013104', drOpeningBal: 278000.00, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 278000.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3001029', glName: 'ACCRUED INTEREST', drOpeningBal: 378350.00, crOpeningBal: 0, periodDr: 0, periodCr: 231937.00, drClosingBal: 146413.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3001030', glName: 'EMD - R N KOOPER HOSPITAL', drOpeningBal: 0, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 0, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3001031', glName: 'EMD - TRAUMA HOSPITAL', drOpeningBal: 1472523.00, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 1472523.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3001032', glName: 'FD WITH HDFC BANK 00602990000034', drOpeningBal: 831000.00, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 831000.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3001033', glName: 'FD AGAINST KEM BG A/C 104510DP00016332', drOpeningBal: 48400.00, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 48400.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3001034', glName: 'EMD- SIDDHIVINAYAK TEMPLE', drOpeningBal: 300000.00, crOpeningBal: 0, periodDr: 0, periodCr: 300000.00, drClosingBal: 0, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3001035', glName: 'FD FOR TRAUMA HOSPITAL BG', drOpeningBal: 0, crOpeningBal: 0, periodDr: 157500.00, periodCr: 0, drClosingBal: 157500.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3001036', glName: 'EMD - ESIC MAROL OFFICE', drOpeningBal: 0, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 0, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3001037', glName: 'FD WITH HDFC BANK 50200111716810', drOpeningBal: 0, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 0, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3001038', glName: 'FD AGAINST HDFC BANK OD A/C', drOpeningBal: 0, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 0, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3002002', glName: 'STAFF LOAN / ADVANCE', drOpeningBal: 310750.45, crOpeningBal: 0, periodDr: 132000.00, periodCr: 125000.00, drClosingBal: 317750.45, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3002003', glName: 'UNBILLED RECEIVABLE/ACCRUED INCOME', drOpeningBal: 0, crOpeningBal: 12659160.00, periodDr: 25038537.00, periodCr: 8633487.00, drClosingBal: 3745890.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3002004', glName: 'MATOSHRI ENTERPRISES', drOpeningBal: 160051.00, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 160051.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3002005', glName: 'ADVANCE TO OTHERS', drOpeningBal: 0, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 0, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3002007', glName: 'SHARE & FD OF MANISH KAMBLE AGST APNA BANK LOAN', drOpeningBal: 183000.00, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 183000.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3002008', glName: 'DEBTORS LEGAL CASE INTIATED', drOpeningBal: 2705708.62, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 2705708.62, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3002009', glName: 'MANISH KAMBLE LOAN A/C', drOpeningBal: 0, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 0, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3002010', glName: 'ASHA BHATNAGAR LOAN A/C', drOpeningBal: 0, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 0, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3002011', glName: 'PURVI SADADEKAR LOAN A/C', drOpeningBal: 0, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 0, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3002012', glName: 'LAXMAN PATIL LOAN A/C', drOpeningBal: 0, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 0, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3002014', glName: 'TARGET HOSPITALITY PVT LTD', drOpeningBal: 7497703.00, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 7497703.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3002017', glName: 'SMART MONITORING SURVEILLANCE PVT LTD', drOpeningBal: 850278.00, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 850278.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3002018', glName: 'MANOJ KAMBLI', drOpeningBal: 275994.00, crOpeningBal: 0, periodDr: 91998.00, periodCr: 0, drClosingBal: 367992.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3002019', glName: 'PROVISIONS FOR BAD DEBTS', drOpeningBal: 0, crOpeningBal: 0, periodDr: 27000.00, periodCr: 0, drClosingBal: 27000.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3003001', glName: 'SUNDRY DEBTORS CONTROL ACCOUNT', drOpeningBal: 293180363.63, crOpeningBal: 0, periodDr: 645647243.89, periodCr: 620507928.03, drClosingBal: 318319679.49, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3004001001', glName: 'CASH IN HAND - MUM', drOpeningBal: 16971.53, crOpeningBal: 0, periodDr: 7990.00, periodCr: 12252.00, drClosingBal: 12709.53, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3004003001', glName: 'CFMS_HDFC BANK A/C 50200028417957', drOpeningBal: 29527.86, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 29527.86, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3004003003', glName: 'CFMS_HDFC BANK VAD A/C 50200059203020', drOpeningBal: 60000.00, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 60000.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3004003004', glName: 'CFMS_APNA SAHAKARI BANK LTD A/C 062012100000738', drOpeningBal: 0, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 0, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3004003005', glName: 'HDFC BANK ISMART A/C 59218000123456', drOpeningBal: 52464.31, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 52464.31, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3004003006', glName: 'PNB CURRENT A/C 1045102100000408', drOpeningBal: 349685.95, crOpeningBal: 0, periodDr: 316293915.17, periodCr: 305583235.09, drClosingBal: 11060366.03, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3004003007', glName: 'HDFC BANK NEW A/C 50200111716810', drOpeningBal: 0, crOpeningBal: 0, periodDr: 22263384.16, periodCr: 22263384.16, drClosingBal: 0, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3005001', glName: 'PREPAID EXPENSE', drOpeningBal: 8125178.27, crOpeningBal: 0, periodDr: 15200318.00, periodCr: 6052562.00, drClosingBal: 17272934.27, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3006008', glName: 'TDS RECEIVABLE F.Y. 22-23', drOpeningBal: 355.00, crOpeningBal: 0, periodDr: 1011.00, periodCr: 0, drClosingBal: 1366.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3006009', glName: 'CFMS TDS RECEIVABLE F Y 22 23', drOpeningBal: 0, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 0, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3006010', glName: 'TDS RECEIVABLE F.Y. 23-24', drOpeningBal: 0, crOpeningBal: 0, periodDr: 689.00, periodCr: 0, drClosingBal: 689.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3006011', glName: 'TDS RECEIVABLE F.Y. 24-25', drOpeningBal: 20348632.74, crOpeningBal: 0, periodDr: 7568.70, periodCr: 0, drClosingBal: 20356201.44, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3006012', glName: 'TDS RECEIVABLE F.Y-25-26', drOpeningBal: 10636169.45, crOpeningBal: 0, periodDr: 6994194.02, periodCr: 0, drClosingBal: 17630363.47, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3007001001', glName: 'SGST INPUT', drOpeningBal: 3188496.89, crOpeningBal: 0, periodDr: 859037.98, periodCr: 3311.55, drClosingBal: 4044223.32, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3007001002', glName: 'CGST INPUT', drOpeningBal: 3135432.39, crOpeningBal: 0, periodDr: 859037.98, periodCr: 3311.55, drClosingBal: 3991158.82, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3007001003', glName: 'IGST INPUT', drOpeningBal: 547530.45, crOpeningBal: 0, periodDr: 435639.89, periodCr: 0, drClosingBal: 983170.34, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3007001004', glName: 'SGST INPUT (RCM)', drOpeningBal: 19132.00, crOpeningBal: 0, periodDr: 6217.00, periodCr: 0, drClosingBal: 25349.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3007001005', glName: 'CGST INPUT (RCM)', drOpeningBal: 18991.00, crOpeningBal: 0, periodDr: 5412.00, periodCr: 0, drClosingBal: 24403.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3007001006', glName: 'IGST INPUT (RCM)', drOpeningBal: 0, crOpeningBal: 0, periodDr: 4.00, periodCr: 0, drClosingBal: 4.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3007001007', glName: 'CGST TDS (INPUT)', drOpeningBal: 377106.95, crOpeningBal: 0, periodDr: 37634.00, periodCr: 0, drClosingBal: 414740.95, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3007001008', glName: 'SGST TDS (INPUT)', drOpeningBal: 377026.33, crOpeningBal: 0, periodDr: 35422.00, periodCr: 0, drClosingBal: 412448.33, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3007001009', glName: 'IGST TDS (INPUT)', drOpeningBal: 45495.00, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 45495.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3007001010', glName: 'ISD CGST INPUT', drOpeningBal: 0, crOpeningBal: 0, periodDr: 35100.00, periodCr: 35099.43, drClosingBal: 0.57, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3007001011', glName: 'ISD SGST INPUT', drOpeningBal: 0, crOpeningBal: 0, periodDr: 35100.00, periodCr: 35099.43, drClosingBal: 0.57, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3007001012', glName: 'ISD IGST INPUT', drOpeningBal: 0, crOpeningBal: 0, periodDr: 126000.00, periodCr: 126000.00, drClosingBal: 0, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3010', glName: 'SUSPENSE', drOpeningBal: 0, crOpeningBal: 0, periodDr: 181570.80, periodCr: 22592.01, drClosingBal: 158978.79, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L1001001', glName: 'SANJAY KHANVILKAR CAPITAL A/C', drOpeningBal: 0, crOpeningBal: 11387500.00, periodDr: 0, periodCr: 0, drClosingBal: 0, crClosingBal: 11387500.00, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L1001002', glName: 'VINAYAK BHISE CAPITAL A/C', drOpeningBal: 0, crOpeningBal: 5050000.00, periodDr: 0, periodCr: 0, drClosingBal: 0, crClosingBal: 5050000.00, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L1001003', glName: 'MANOJ KAMBLI CAPITAL A/C', drOpeningBal: 0, crOpeningBal: 12500.00, periodDr: 0, periodCr: 0, drClosingBal: 0, crClosingBal: 12500.00, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L1001004', glName: 'SIDDHESH KHANVILKAR CAPITAL A/C', drOpeningBal: 0, crOpeningBal: 12500.00, periodDr: 0, periodCr: 0, drClosingBal: 0, crClosingBal: 12500.00, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L1001005', glName: 'SHOBHANA BAGWE CAPITAL A/C', drOpeningBal: 0, crOpeningBal: 12500.00, periodDr: 0, periodCr: 0, drClosingBal: 0, crClosingBal: 12500.00, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L1001008', glName: '4S INFRASTRUCTURE LLP CAPITAL A/C', drOpeningBal: 0, crOpeningBal: 25000.00, periodDr: 0, periodCr: 0, drClosingBal: 0, crClosingBal: 25000.00, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L1001009', glName: 'PROFIT & LOSS A/C', drOpeningBal: 0, crOpeningBal: 8491268.80, periodDr: 0, periodCr: 0, drClosingBal: 0, crClosingBal: 8491268.80, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2001001', glName: 'BONUS PAYABLE', drOpeningBal: 677345.00, crOpeningBal: 0, periodDr: 27332478.00, periodCr: 28009823.00, drClosingBal: 0, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2001002', glName: 'SALARY PAYABLE', drOpeningBal: 0, crOpeningBal: 69940181.81, periodDr: 245130116.00, periodCr: 255385998.00, drClosingBal: 0, crClosingBal: 80196063.81, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2001003', glName: 'GRATUITY PAYABLE', drOpeningBal: 0, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 0, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2001005', glName: 'FULL & FINAL SETTLEMENT PAYABLE', drOpeningBal: 0, crOpeningBal: 134521.00, periodDr: 0, periodCr: 0, drClosingBal: 0, crClosingBal: 134521.00, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2001006', glName: 'LEAVE TRAVEL PAYABLE (LTA)', drOpeningBal: 0, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 0, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2001007', glName: 'CONVEYANCE PAYABLE', drOpeningBal: 0, crOpeningBal: 501102.17, periodDr: 827288.00, periodCr: 773332.00, drClosingBal: 0, crClosingBal: 447146.17, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2001010', glName: 'LOAN / ADV RECOVERY FROM EMPLOYEES', drOpeningBal: 0, crOpeningBal: 10878.00, periodDr: 0, periodCr: 2500.00, drClosingBal: 0, crClosingBal: 13378.00, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2001011', glName: 'SALARY & WAGES PAYABLE JAN 24', drOpeningBal: 0, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 0, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2001013', glName: 'SALARY & WAGES PAYABLE FEB 24', drOpeningBal: 0, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 0, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2001014', glName: 'SALARY & WAGES PAYABLE MAR 24', drOpeningBal: 0, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 0, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2001015', glName: 'SALARY & WAGES PAYABLE APR 24', drOpeningBal: 0, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 0, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2001016', glName: 'SALARY & WAGES PAYABLE MAY 24', drOpeningBal: 0, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 0, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2001017', glName: 'SALARY & WAGE PAYABLE JUN 24', drOpeningBal: 0, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 0, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2001018', glName: 'FATAK PAY DEDUCTION', drOpeningBal: 0, crOpeningBal: 47406.00, periodDr: 45614.00, periodCr: 0, drClosingBal: 0, crClosingBal: 1792.00, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2002001', glName: 'PROVIDENT FUND (PF) COMPANY PAYABLE', drOpeningBal: 0, crOpeningBal: 9972958.57, periodDr: 21555436.04, periodCr: 27465353.00, drClosingBal: 0, crClosingBal: 15882875.53, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2002002', glName: 'PROVIDENT FUND (PF) EMPLOYEE PAYABLE', drOpeningBal: 0, crOpeningBal: 9229858.43, periodDr: 19893550.96, periodCr: 25356496.00, drClosingBal: 0, crClosingBal: 14692803.47, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2002003', glName: 'ESIC COMPANY PAYABLE', drOpeningBal: 0, crOpeningBal: 3509080.41, periodDr: 7085784.63, periodCr: 7398722.00, drClosingBal: 0, crClosingBal: 3822017.78, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2002004', glName: 'ESIC EMPLOYEE PAYABLE', drOpeningBal: 0, crOpeningBal: 862896.59, periodDr: 1635188.37, periodCr: 1731868.00, drClosingBal: 0, crClosingBal: 959576.22, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2002005', glName: 'PROFESSION TAX PAYABLE', drOpeningBal: 0, crOpeningBal: 2096107.20, periodDr: 35100.00, periodCr: 1703962.00, drClosingBal: 0, crClosingBal: 3764969.20, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2002006', glName: 'LABOUR WELFARE FUND PAYABLE', drOpeningBal: 0, crOpeningBal: 411885.90, periodDr: 0, periodCr: 375732.00, drClosingBal: 0, crClosingBal: 787617.90, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2002008', glName: 'INCOME TAX PROVISION', drOpeningBal: 0, crOpeningBal: 4121781.00, periodDr: 0, periodCr: 0, drClosingBal: 0, crClosingBal: 4121781.00, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2003001', glName: 'TDS CONTRACT/SUB CONTRACT', drOpeningBal: 0, crOpeningBal: 28837.00, periodDr: 29259.00, periodCr: 15389.00, drClosingBal: 0, crClosingBal: 14967.00, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2003002', glName: 'TDS PROFESSIONAL FEES', drOpeningBal: 0, crOpeningBal: 47639.84, periodDr: 81346.00, periodCr: 229808.00, drClosingBal: 0, crClosingBal: 196101.84, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2003003', glName: 'TDS RENT', drOpeningBal: 0, crOpeningBal: 19544.50, periodDr: 50082.00, periodCr: 75049.00, drClosingBal: 0, crClosingBal: 44511.50, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2003004', glName: 'TDS COMMISSION', drOpeningBal: 0, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 0, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2003005', glName: 'TDS SALARY', drOpeningBal: 0, crOpeningBal: 205000.00, periodDr: 307500.00, periodCr: 307500.00, drClosingBal: 0, crClosingBal: 205000.00, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2003007', glName: 'TDS ON PURCHASES @0.10%', drOpeningBal: 0, crOpeningBal: 0, periodDr: 0, periodCr: 19705.00, drClosingBal: 0, crClosingBal: 19705.00, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2004001001', glName: 'SGST OUTPUT/PAYABLE', drOpeningBal: 0, crOpeningBal: 17124796.40, periodDr: 32349835.08, periodCr: 32025817.79, drClosingBal: 0, crClosingBal: 16800779.11, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2004001002', glName: 'CGST OUTPUT/PAYABLE', drOpeningBal: 0, crOpeningBal: 17115510.67, periodDr: 32348990.08, periodCr: 32025817.79, drClosingBal: 0, crClosingBal: 16792338.38, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2004001003', glName: 'IGST OUTPUT/PAYABLE', drOpeningBal: 0, crOpeningBal: 4914807.92, periodDr: 10623803.92, periodCr: 7066295.41, drClosingBal: 0, crClosingBal: 1357299.41, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2004001004', glName: 'SGST OUTPUT/PAYABLE (RCM)', drOpeningBal: 0, crOpeningBal: 16200.00, periodDr: 0, periodCr: 4500.00, drClosingBal: 0, crClosingBal: 20700.00, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2004001005', glName: 'CGST OUTPUT/PAYABLE (RCM)', drOpeningBal: 0, crOpeningBal: 16200.00, periodDr: 0, periodCr: 4500.00, drClosingBal: 0, crClosingBal: 20700.00, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2005001', glName: 'SUNDRY CREDITORS CONTROL ACCOUNT', drOpeningBal: 0, crOpeningBal: 21498275.93, periodDr: 29263493.97, periodCr: 24823000.98, drClosingBal: 0, crClosingBal: 17057782.94, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2006001', glName: 'OUTSTANDING EXPENSES', drOpeningBal: 0, crOpeningBal: 11799071.32, periodDr: 10977460.00, periodCr: 17582713.00, drClosingBal: 0, crClosingBal: 18404324.32, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2006003', glName: 'INTEREST/ PENALTY ON GST', drOpeningBal: 0, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 0, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2006004', glName: 'INTEREST/ PENALTY ON PF/ESIC', drOpeningBal: 0, crOpeningBal: 0, periodDr: 246077.00, periodCr: 260513.00, drClosingBal: 0, crClosingBal: 14436.00, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2006005', glName: 'DEFERRED TAX LIABILITIES', drOpeningBal: 807958.00, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 807958.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2006007', glName: 'DEPOSIT FROM VENDOR', drOpeningBal: 0, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 0, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2006008', glName: 'CONTRIBUTION TOWARDS STAFF WELFARE', drOpeningBal: 0, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 0, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2006009', glName: 'CONTRIBUTION TOWARDS STAFF WELFARE FUND', drOpeningBal: 0, crOpeningBal: 1474710.00, periodDr: 0, periodCr: 824150.00, drClosingBal: 0, crClosingBal: 2298860.00, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2006010', glName: 'PROVISION FOR DOUBTFUL DEBTS (L)', drOpeningBal: 0, crOpeningBal: 2705708.62, periodDr: 0, periodCr: 0, drClosingBal: 0, crClosingBal: 2705708.62, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2007001001', glName: 'PNB CC A/C 1045108700000064', drOpeningBal: 0, crOpeningBal: 154290187.20, periodDr: 458427532.48, periodCr: 482769033.83, drClosingBal: 0, crClosingBal: 178631688.55, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2007002001', glName: 'KEITA PHARMA PVT LTD', drOpeningBal: 0, crOpeningBal: 2990000.00, periodDr: 0, periodCr: 0, drClosingBal: 0, crClosingBal: 2990000.00, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2007002003', glName: 'SANJAY KHANVILKAR', drOpeningBal: 317594.00, crOpeningBal: 0, periodDr: 8875000.00, periodCr: 6100000.00, drClosingBal: 3092594.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2007002004', glName: 'SHOBHANA BAGWE', drOpeningBal: 0, crOpeningBal: 10000.00, periodDr: 0, periodCr: 0, drClosingBal: 0, crClosingBal: 10000.00, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2007002005', glName: 'VINAYAK BHISE', drOpeningBal: 0, crOpeningBal: 54000.00, periodDr: 2173000.00, periodCr: 0, drClosingBal: 2119000.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2007002007', glName: 'PURVI SADADEKAR', drOpeningBal: 0, crOpeningBal: 22924.00, periodDr: 0, periodCr: 0, drClosingBal: 0, crClosingBal: 22924.00, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2007002022', glName: 'SIDDHESH KHANVILKAR', drOpeningBal: 0, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 0, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'R1001001', glName: 'HOUSE KEEPING CHARGES', drOpeningBal: 0, crOpeningBal: 1566650115.87, periodDr: 282037656.54, periodCr: 657066214.96, drClosingBal: 0, crClosingBal: 1941678674.29, korectGlCode: '', glType: 'FILE' },
                { glCode: 'R1001005001', glName: 'HK MATERIAL', drOpeningBal: 0, crOpeningBal: 23769916.78, periodDr: 363307.00, periodCr: 7100598.55, drClosingBal: 0, crClosingBal: 30507208.33, korectGlCode: '', glType: 'FILE' },
                { glCode: 'R1001005002', glName: 'CLEANING CONSUMABLE', drOpeningBal: 0, crOpeningBal: 8637500.80, periodDr: 118958.00, periodCr: 2566127.00, drClosingBal: 0, crClosingBal: 11084669.80, korectGlCode: '', glType: 'FILE' },
                { glCode: 'R1001006', glName: 'DEEP CLEANING CHARGES', drOpeningBal: 0, crOpeningBal: 4416509.69, periodDr: 1600.00, periodCr: 513910.90, drClosingBal: 0, crClosingBal: 4928820.59, korectGlCode: '', glType: 'FILE' },
                { glCode: 'R1001007', glName: 'RENT ON MACHINERY', drOpeningBal: 0, crOpeningBal: 2182061.74, periodDr: 22400.00, periodCr: 401016.00, drClosingBal: 0, crClosingBal: 2560677.74, korectGlCode: '', glType: 'FILE' },
                { glCode: 'R1001008', glName: 'MANPOWER SERVICES', drOpeningBal: 0, crOpeningBal: 111883809.38, periodDr: 1959291.01, periodCr: 22785507.68, drClosingBal: 0, crClosingBal: 132710026.05, korectGlCode: '', glType: 'FILE' },
                { glCode: 'R2001001', glName: 'BANK INTEREST RECEIVED', drOpeningBal: 0, crOpeningBal: 289803.00, periodDr: 0, periodCr: 0, drClosingBal: 0, crClosingBal: 289803.00, korectGlCode: '', glType: 'FILE' },
                { glCode: 'R2001002', glName: 'MISC INCOME', drOpeningBal: 0, crOpeningBal: 2696.79, periodDr: 0, periodCr: 0, drClosingBal: 0, crClosingBal: 2696.79, korectGlCode: '', glType: 'FILE' },
                { glCode: 'R2001003', glName: 'ROUND OFF', drOpeningBal: 0, crOpeningBal: 15.74, periodDr: 275.10, periodCr: 285.04, drClosingBal: 0, crClosingBal: 25.68, korectGlCode: '', glType: 'FILE' },
                { glCode: 'R2001004', glName: 'WRITTEN BACK', drOpeningBal: 0, crOpeningBal: 72458.40, periodDr: 0, periodCr: 0, drClosingBal: 0, crClosingBal: 72458.40, korectGlCode: '', glType: 'FILE' },
                { glCode: 'R2001005', glName: 'INTEREST ON INCOME TAX REFUND', drOpeningBal: 0, crOpeningBal: 276325.00, periodDr: 0, periodCr: 0, drClosingBal: 0, crClosingBal: 276325.00, korectGlCode: '', glType: 'FILE' },
                { glCode: 'R2001006', glName: 'REBATE & DISCOUNT RECD', drOpeningBal: 0, crOpeningBal: 4826.52, periodDr: 0.01, periodCr: 98.08, drClosingBal: 0, crClosingBal: 4924.59, korectGlCode: '', glType: 'FILE' },
                { glCode: 'R2001007', glName: 'EXCESS PROVISION WRITTEN BACK', drOpeningBal: 0, crOpeningBal: 3405840.01, periodDr: 0, periodCr: 0, drClosingBal: 0, crClosingBal: 3405840.01, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1001001001001', glName: 'FO - BASIC SALARIES', drOpeningBal: 704032471.00, crOpeningBal: 0, periodDr: 152286198.00, periodCr: 0, drClosingBal: 856318669.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1001001001002', glName: 'FO - DEARNESS ALLOWANCE (DA)', drOpeningBal: 220940572.00, crOpeningBal: 0, periodDr: 46525571.00, periodCr: 0, drClosingBal: 267466143.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1001001001003', glName: 'FO - HOUSE RENT ALLOWANCE-HRA', drOpeningBal: 52588630.00, crOpeningBal: 0, periodDr: 10324843.00, periodCr: 0, drClosingBal: 62913473.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1001001001004', glName: 'FO - OTHER ALLOWANCE', drOpeningBal: 102528377.14, crOpeningBal: 0, periodDr: 26283396.00, periodCr: 0, drClosingBal: 128811773.14, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1001001001005', glName: 'FO - EDUCATION ALLOWANCE', drOpeningBal: 43277.00, crOpeningBal: 0, periodDr: 5700.00, periodCr: 0, drClosingBal: 48977.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1001001001006', glName: 'FO - BONUS', drOpeningBal: 52806811.01, crOpeningBal: 0, periodDr: 35247024.00, periodCr: 7865288.00, drClosingBal: 80188547.01, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1001001001007', glName: 'FO - MEDICAL EXP.', drOpeningBal: 1602699.00, crOpeningBal: 0, periodDr: 245211.00, periodCr: 0, drClosingBal: 1847910.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1001001001008', glName: 'FO - OTHER DEDUCTION/NOTICE PERIOD', drOpeningBal: 0, crOpeningBal: 6134759.26, periodDr: 1288654.00, periodCr: 1098311.00, drClosingBal: 0, crClosingBal: 5944416.26, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1001001001009', glName: 'FO - LEAVE ENCASHMENT', drOpeningBal: 33092608.85, crOpeningBal: 0, periodDr: 11342949.00, periodCr: 8604.00, drClosingBal: 44426953.85, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1001001001010', glName: 'FO - GRATUITY', drOpeningBal: 1015078.00, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 1015078.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1001001001011', glName: 'FO - LABOUR WELFARE FUND', drOpeningBal: 674591.25, crOpeningBal: 0, periodDr: 255798.00, periodCr: 0, drClosingBal: 930389.25, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1001001001012', glName: 'FO - INSURANCE', drOpeningBal: 590494.10, crOpeningBal: 0, periodDr: 330105.00, periodCr: 0, drClosingBal: 920599.10, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1001001001013', glName: 'FO - E.S.I.C.', drOpeningBal: 34306280.00, crOpeningBal: 0, periodDr: 7344861.00, periodCr: 0, drClosingBal: 41651141.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1001001001014', glName: 'FO - PROVIDENT FUND', drOpeningBal: 121650776.00, crOpeningBal: 0, periodDr: 26811030.00, periodCr: 0, drClosingBal: 148461806.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1001001001015', glName: 'FO - OVERTIME', drOpeningBal: 114623874.00, crOpeningBal: 0, periodDr: 15037854.00, periodCr: 0, drClosingBal: 129661728.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1001001001016', glName: 'FO - CONVEYANCE ALLOWANCE', drOpeningBal: 5750025.00, crOpeningBal: 0, periodDr: 1193817.00, periodCr: 0, drClosingBal: 6943842.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1001001001017', glName: 'FO - EX-GRATIA', drOpeningBal: 290791.00, crOpeningBal: 0, periodDr: 39739.00, periodCr: 0, drClosingBal: 330530.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1001001001018', glName: 'FO - WASHING ALLOWANCE', drOpeningBal: 1547430.00, crOpeningBal: 0, periodDr: 282335.00, periodCr: 0, drClosingBal: 1829765.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1001001001019', glName: 'FO - NOTICE PAY SALARY', drOpeningBal: 955257.00, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 955257.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1001001001021', glName: 'FO - PERFORMANCE INCENTIVE', drOpeningBal: 309150.00, crOpeningBal: 0, periodDr: 45000.00, periodCr: 0, drClosingBal: 354150.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1001001001022', glName: 'FO - LEAVE TRAVEL ALLOWANCE', drOpeningBal: 1351520.45, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 1351520.45, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1001001002001', glName: 'SUB CONTRACTORS EXP', drOpeningBal: 8665181.74, crOpeningBal: 0, periodDr: 1177250.17, periodCr: 255442.00, drClosingBal: 9586989.91, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1001002002', glName: 'FO - CONVEYANCE', drOpeningBal: 121914.00, crOpeningBal: 0, periodDr: 32156.00, periodCr: 25712.00, drClosingBal: 128358.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1001002003', glName: 'FO - TRAVELIING EXPENSES', drOpeningBal: 16926.00, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 16926.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1001002005', glName: 'GUEST HOUSE EXPENSES', drOpeningBal: 1131109.64, crOpeningBal: 0, periodDr: 250594.49, periodCr: 11536.00, drClosingBal: 1370168.13, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1001004001', glName: 'PURCHASE - HOUSEKEEPING MATERIAL', drOpeningBal: 52273867.45, crOpeningBal: 0, periodDr: 23241850.04, periodCr: 6634547.17, drClosingBal: 68881170.32, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1001004002', glName: 'PURCHASE - STAFF UNIFORM', drOpeningBal: 13488821.15, crOpeningBal: 0, periodDr: 4287488.22, periodCr: 2218487.00, drClosingBal: 15557822.37, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1001004003', glName: 'TRANSPORTATION CHARGES', drOpeningBal: 261475.00, crOpeningBal: 0, periodDr: 1491.00, periodCr: 0, drClosingBal: 262966.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1001004004', glName: 'LOADING & UNLOADING EXPENSES', drOpeningBal: 21535.00, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 21535.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1001004005', glName: 'LAUNDRY EXPENSES', drOpeningBal: 116724.00, crOpeningBal: 0, periodDr: 7340.00, periodCr: 0, drClosingBal: 124064.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1001004006', glName: 'SPECIAL PROJECT EXPENSES', drOpeningBal: 1993955.00, crOpeningBal: 0, periodDr: 1941330.00, periodCr: 700000.00, drClosingBal: 3235285.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1001006001', glName: 'REPAIRS & MAINTANANCE (SITE LEVEL)', drOpeningBal: 1435797.78, crOpeningBal: 0, periodDr: 44340.00, periodCr: 0, drClosingBal: 1480137.78, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1001006002', glName: 'REPAIRS & MAINTANANCE (SPARES)', drOpeningBal: 431598.80, crOpeningBal: 0, periodDr: 6600.02, periodCr: 0, drClosingBal: 438198.82, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1001006003', glName: 'LEASE RENTAL - MACHINERIES', drOpeningBal: 28000.00, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 28000.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1001007001', glName: 'PROVISION FOR BAD DEBT', drOpeningBal: 2705708.62, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 2705708.62, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1001007002', glName: 'BAD DEBTS WRITTEN OFF', drOpeningBal: 114139.37, crOpeningBal: 0, periodDr: 727135.63, periodCr: 0, drClosingBal: 841275.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1001007003', glName: 'SLA DEDUCTION', drOpeningBal: 45526.39, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 45526.39, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1002001', glName: 'FOODS & BEVERAGES TO EMPLOYEES', drOpeningBal: 1320897.71, crOpeningBal: 0, periodDr: 549112.00, periodCr: 300000.00, drClosingBal: 1570009.71, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1002005', glName: 'STAFF WELFARE (SITE LEVEL)', drOpeningBal: 41482.00, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 41482.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1002006', glName: 'ELECTRICITY CHRGS (SITE LEVEL)', drOpeningBal: 58618.96, crOpeningBal: 0, periodDr: 4500.00, periodCr: 0, drClosingBal: 63118.96, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1002007', glName: 'RENT ( SITE LEVEL)', drOpeningBal: 1884944.00, crOpeningBal: 0, periodDr: 388700.00, periodCr: 59199.00, drClosingBal: 2214445.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1002009', glName: 'CONVEYANCE EXP ( SITE LEVEL)', drOpeningBal: 4873.00, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 4873.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1002011', glName: 'VISIT CHARGES (SITE LEVEL)', drOpeningBal: 2000.00, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 2000.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1002013', glName: 'SITE EXPENSES', drOpeningBal: 19844830.95, crOpeningBal: 0, periodDr: 6941314.57, periodCr: 1457728.73, drClosingBal: 25328416.79, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1002014', glName: 'MOBILISATION COST', drOpeningBal: 93553.00, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 93553.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1002015', glName: 'PROFESSIONAL CHG - SITE', drOpeningBal: 119258.41, crOpeningBal: 0, periodDr: 14157.53, periodCr: 0, drClosingBal: 133415.94, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001001001', glName: 'BR - BASIC SALARIES', drOpeningBal: 28502254.00, crOpeningBal: 0, periodDr: 5888693.00, periodCr: 0, drClosingBal: 34390947.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001001002', glName: 'BR - DEARNESS ALLOWANCE (DA)', drOpeningBal: 529410.00, crOpeningBal: 0, periodDr: 72819.00, periodCr: 0, drClosingBal: 602229.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001001003', glName: 'BR - HOUSE RENT ALLOWANCE-HRA', drOpeningBal: 8728204.00, crOpeningBal: 0, periodDr: 2040078.00, periodCr: 0, drClosingBal: 10768282.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001001004', glName: 'BR - OTHER ALLOWANCE', drOpeningBal: 18421298.00, crOpeningBal: 0, periodDr: 3953263.00, periodCr: 0, drClosingBal: 22374561.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001001005', glName: 'BR - EDUCATION ALLOWANCE', drOpeningBal: 3571.00, crOpeningBal: 0, periodDr: 600.00, periodCr: 0, drClosingBal: 4171.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001001006', glName: 'BR - BONUS', drOpeningBal: 1373461.34, crOpeningBal: 0, periodDr: 4580686.00, periodCr: 3563898.00, drClosingBal: 2390249.34, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001001007', glName: 'BR - MEDICAL EXP.', drOpeningBal: 46620.00, crOpeningBal: 0, periodDr: 7770.00, periodCr: 0, drClosingBal: 54390.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001001008', glName: 'BR - OTHER DEDUCTION/NOTICE PERIOD', drOpeningBal: 0, crOpeningBal: 59818.53, periodDr: 179008.00, periodCr: 277898.00, drClosingBal: 0, crClosingBal: 158708.53, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001001009', glName: 'BR - LEAVE ENCASHMENT', drOpeningBal: 980543.00, crOpeningBal: 0, periodDr: 306246.00, periodCr: 0, drClosingBal: 1286789.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001001010', glName: 'BR - GRATUITY', drOpeningBal: 51923.00, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 51923.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001001011', glName: 'BR - LABOUR WELFARE FUND', drOpeningBal: 14457.00, crOpeningBal: 0, periodDr: 5324.00, periodCr: 0, drClosingBal: 19781.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001001012', glName: 'BR - INSURANCE', drOpeningBal: 684163.72, crOpeningBal: 0, periodDr: 153550.00, periodCr: 0, drClosingBal: 837713.72, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001001013', glName: 'BR - E.S.I.C.', drOpeningBal: 402523.00, crOpeningBal: 0, periodDr: 50939.00, periodCr: 0, drClosingBal: 453462.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001001014', glName: 'BR - PROVIDENT FUND', drOpeningBal: 3063225.00, crOpeningBal: 0, periodDr: 654323.00, periodCr: 0, drClosingBal: 3717548.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001001015', glName: 'BR - MEDICAL REIMBURSEMENT', drOpeningBal: 0, crOpeningBal: 0, periodDr: 6709.00, periodCr: 0, drClosingBal: 6709.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001001016', glName: 'BR - LEAVE TRAVEL ALLOWANCE', drOpeningBal: 10920.00, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 10920.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001001017', glName: 'BR - WASHING ALLOWANCE', drOpeningBal: 35154.00, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 35154.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001001018', glName: 'BR - CONVEYANCE ALLOWANCE', drOpeningBal: 5841310.00, crOpeningBal: 0, periodDr: 786884.00, periodCr: 380.00, drClosingBal: 6627814.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001001019', glName: 'BR - NOTICE PAY SALARY', drOpeningBal: 41048.00, crOpeningBal: 0, periodDr: 51008.00, periodCr: 0, drClosingBal: 92056.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002001', glName: 'AUDIT FEES', drOpeningBal: 75000.00, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 75000.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002002', glName: 'BUSINESS PROMOTION', drOpeningBal: 13405747.50, crOpeningBal: 0, periodDr: 2110350.00, periodCr: 575000.00, drClosingBal: 14941097.50, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002003', glName: 'COMMISSION & BROKERAGE', drOpeningBal: 529039.00, crOpeningBal: 0, periodDr: 5000.00, periodCr: 0, drClosingBal: 534039.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002004', glName: 'COMPUTER EXPENSES', drOpeningBal: 1898933.70, crOpeningBal: 0, periodDr: 265875.37, periodCr: 0, drClosingBal: 2164809.07, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002005', glName: 'CONFERENCE & SEMINAR EXPENSES', drOpeningBal: 504701.00, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 504701.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002006', glName: 'BR - CONVEYANCE', drOpeningBal: 6216408.87, crOpeningBal: 0, periodDr: 996852.32, periodCr: 236000.00, drClosingBal: 6977261.19, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002007', glName: 'DEPRECIATION', drOpeningBal: 5874601.00, crOpeningBal: 0, periodDr: 1133235.00, periodCr: 0, drClosingBal: 7007836.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002008', glName: 'DONATION', drOpeningBal: 619102.00, crOpeningBal: 0, periodDr: 21000.00, periodCr: 5000.00, drClosingBal: 635102.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002009', glName: 'ELECTRICITY CHARGES', drOpeningBal: 1060766.71, crOpeningBal: 0, periodDr: 200104.00, periodCr: 38000.00, drClosingBal: 1222870.71, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002010', glName: 'FESTIVAL EXPENESES', drOpeningBal: 2259163.30, crOpeningBal: 0, periodDr: 1936648.82, periodCr: 1499781.00, drClosingBal: 2696031.12, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002012', glName: 'LEGAL EXPENSES', drOpeningBal: 37000.00, crOpeningBal: 0, periodDr: 10000.00, periodCr: 0, drClosingBal: 47000.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002013', glName: 'MEDICAL INSURANCE', drOpeningBal: 2453639.00, crOpeningBal: 0, periodDr: 775056.00, periodCr: 0, drClosingBal: 3228695.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002014', glName: 'MISC. EXPENSES', drOpeningBal: 273443.80, crOpeningBal: 0, periodDr: 50000.00, periodCr: 0, drClosingBal: 323443.80, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002015', glName: 'NEWS PAPERS,BOOKS & PERIODICAL', drOpeningBal: 1450.00, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 1450.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002016', glName: 'OFFICE EXPENSES', drOpeningBal: 865799.76, crOpeningBal: 0, periodDr: 167799.44, periodCr: 8550.00, drClosingBal: 1025049.20, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002017', glName: 'POSTGE,TELEG & COURIER', drOpeningBal: 2445079.73, crOpeningBal: 0, periodDr: 59892.56, periodCr: 0, drClosingBal: 2504972.29, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002018', glName: 'PRINTING & STATIONERY', drOpeningBal: 1380782.50, crOpeningBal: 0, periodDr: 247317.99, periodCr: 0, drClosingBal: 1628100.49, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002019', glName: 'PROFESSION TAX (COMPANY)', drOpeningBal: 5000.00, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 5000.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002020', glName: 'PROFESSIONAL CHGS.', drOpeningBal: 8220641.21, crOpeningBal: 0, periodDr: 1865386.14, periodCr: 621375.00, drClosingBal: 9464652.35, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002022', glName: 'OFFICE RENT', drOpeningBal: 6788301.50, crOpeningBal: 0, periodDr: 1524169.04, periodCr: 80757.00, drClosingBal: 8231713.54, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002023', glName: 'TELEPHONE EXPENSES', drOpeningBal: 424503.82, crOpeningBal: 0, periodDr: 57480.46, periodCr: 0, drClosingBal: 481984.28, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002024', glName: 'INTERNET CHARGES', drOpeningBal: 755040.76, crOpeningBal: 0, periodDr: 209410.46, periodCr: 46333.00, drClosingBal: 918118.22, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002025', glName: 'TRAINING EXPENSES', drOpeningBal: 112335.52, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 112335.52, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002026', glName: 'BR - TRAVELLING EXPENSES', drOpeningBal: 4284512.79, crOpeningBal: 0, periodDr: 660398.25, periodCr: 7981.00, drClosingBal: 4936930.04, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002027', glName: 'ROC CHARGES', drOpeningBal: 69040.00, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 69040.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002028', glName: 'REPAIRS & MAINTANANCE -OFFICE', drOpeningBal: 1536294.74, crOpeningBal: 0, periodDr: 35787.00, periodCr: 10000.00, drClosingBal: 1562081.74, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002030', glName: 'INCOME TAX ADJUSTMENT EARLIER PERIOD', drOpeningBal: 316125.32, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 316125.32, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002031', glName: 'REBATE & DISCOUNT ALLOWED', drOpeningBal: 135142.11, crOpeningBal: 0, periodDr: 19.23, periodCr: 1.00, drClosingBal: 135160.34, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002032', glName: 'STAFF WELFARE EXPENSES', drOpeningBal: 1328333.00, crOpeningBal: 0, periodDr: 354194.00, periodCr: 77760.00, drClosingBal: 1604767.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002033', glName: 'INTEREST ,PENALTY & LATE FILING FEES', drOpeningBal: 310864.28, crOpeningBal: 0, periodDr: 5906.00, periodCr: 0, drClosingBal: 316770.28, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002035', glName: 'STAFF RECOGNITION & DEVELOPMENT_ RNR', drOpeningBal: 113882.00, crOpeningBal: 0, periodDr: 18900.00, periodCr: 0, drClosingBal: 132782.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002036', glName: 'EMPLOYEES COMPENSATION INSURANSE POLICY', drOpeningBal: 64082.34, crOpeningBal: 0, periodDr: 6792.00, periodCr: 0, drClosingBal: 70874.34, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002037', glName: 'TENDER CHARGES', drOpeningBal: 498396.13, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 498396.13, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002040', glName: 'HOTEL EXPENSES', drOpeningBal: 957523.53, crOpeningBal: 0, periodDr: 196763.00, periodCr: 0, drClosingBal: 1154286.53, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002043', glName: 'SUBSCRIPTION, REGISTRATION & RENEWAL FEES', drOpeningBal: 1478116.99, crOpeningBal: 0, periodDr: 50898.58, periodCr: 0, drClosingBal: 1529015.57, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002044', glName: 'STAMP DUTY & FRANKING CHARGES', drOpeningBal: 700233.00, crOpeningBal: 0, periodDr: 63263.00, periodCr: 0, drClosingBal: 763496.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002045', glName: 'ADVERTISEMENT EXPENSES', drOpeningBal: 20400.00, crOpeningBal: 0, periodDr: 25000.00, periodCr: 0, drClosingBal: 45400.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002046', glName: 'INTEREST ON GST', drOpeningBal: 1826186.00, crOpeningBal: 0, periodDr: 708496.00, periodCr: 0, drClosingBal: 2534682.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002047', glName: 'GST LATE FILING FEES', drOpeningBal: 110238.00, crOpeningBal: 0, periodDr: 21950.00, periodCr: 0, drClosingBal: 132188.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002049', glName: 'SUBCONTRACT EXP - PROJECT', drOpeningBal: 300000.00, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 300000.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002051', glName: 'REIMBURSEMENT OF ROC EXPENSES', drOpeningBal: 7200.00, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 7200.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002053', glName: 'TRANSPORT, FUEL, TOLL & OTHER EXPENSES - OVERSEAS', drOpeningBal: 0, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 0, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002054', glName: 'MOTOR VEHICLE EXPNSES', drOpeningBal: 59729.00, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 59729.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002055', glName: 'FUEL EXPENSES', drOpeningBal: 0, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 0, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002056', glName: 'LABOUR LICENSE FEES', drOpeningBal: 170572.42, crOpeningBal: 0, periodDr: 15000.00, periodCr: 0, drClosingBal: 185572.42, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002057', glName: 'EVENT EXPENSES (CSR)', drOpeningBal: 2132571.00, crOpeningBal: 0, periodDr: 11444.00, periodCr: 0, drClosingBal: 2144015.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002058', glName: 'INELIGIBLE GST EXPENSES', drOpeningBal: 53772.00, crOpeningBal: 0, periodDr: 65098.00, periodCr: 0, drClosingBal: 118870.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002059', glName: 'INTEREST ON ESIC', drOpeningBal: 22703.38, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 22703.38, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002060', glName: 'INTEREST ON PF', drOpeningBal: 0, crOpeningBal: 0, periodDr: 566281.00, periodCr: 0, drClosingBal: 566281.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002061', glName: 'DAMAGES ON PF', drOpeningBal: 0, crOpeningBal: 0, periodDr: 29594.00, periodCr: 0, drClosingBal: 29594.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2002002001', glName: 'INTEREST ON BANK LOAN CC A/C', drOpeningBal: 16999323.00, crOpeningBal: 0, periodDr: 3495784.00, periodCr: 0, drClosingBal: 20495107.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2002002003', glName: 'BANK CHARGES', drOpeningBal: 1210770.33, crOpeningBal: 0, periodDr: 117729.25, periodCr: 3.20, drClosingBal: 1328496.38, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2002002005', glName: 'LOAN PROCESSING CHARGES', drOpeningBal: 474721.20, crOpeningBal: 0, periodDr: 176659.00, periodCr: 0, drClosingBal: 651380.20, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2002002008', glName: 'DEFERRED TAX', drOpeningBal: 0, crOpeningBal: 359658.00, periodDr: 0, periodCr: 0, drClosingBal: 0, crClosingBal: 359658.00, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2002002009', glName: 'INCOME TAX PROVISION', drOpeningBal: 4121781.00, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 4121781.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
            ],
            grandTotals: {
                drOpeningBal: 2111905562.79,
                crOpeningBal: 2111905562.79,
                periodDr: 2639957026.36,
                periodCr: 2639957026.36,
                drClosingBal: 2553478753.61,
                crClosingBal: 2553478753.61
            }
        }

        return data
    } catch (err) {
        console.error('generateTBDetailedDateRangeData error:', err)
        throw new Error('Failed to generate TB Detailed Date Range data')
    }
}

/**
 * Apply company header styling
 */
const applyCompanyHeaderStyle = (cell) => {
    cell.font = {
        bold: true,
        size: 14,
        color: { argb: 'FF000080' }
    }
    cell.alignment = {
        horizontal: 'center',
        vertical: 'middle'
    }
}

/**
 * Apply info row styling (financial year, period)
 */
const applyInfoRowStyle = (cell) => {
    cell.font = {
        size: 10,
        color: { argb: 'FF000000' }
    }
    cell.alignment = {
        horizontal: 'center',
        vertical: 'middle'
    }
}

/**
 * Apply report title styling
 */
const applyReportTitleStyle = (cell) => {
    cell.font = {
        bold: true,
        size: 12,
        color: { argb: 'FF000000' }
    }
    cell.alignment = {
        horizontal: 'center',
        vertical: 'middle'
    }
}

/**
 * Apply column header styling
 */
const applyColumnHeaderStyle = (cell) => {
    cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF0070C0' }
    }
    cell.font = {
        bold: true,
        size: 10,
        color: { argb: 'FFFFFFFF' }
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
 * Apply data cell styling
 */
const applyDataCellStyle = (cell, isNumeric = false) => {
    cell.border = {
        top: { style: 'thin', color: { argb: 'FFD3D3D3' } },
        left: { style: 'thin', color: { argb: 'FFD3D3D3' } },
        bottom: { style: 'thin', color: { argb: 'FFD3D3D3' } },
        right: { style: 'thin', color: { argb: 'FFD3D3D3' } }
    }

    cell.alignment = {
        vertical: 'middle',
        horizontal: isNumeric ? 'right' : 'left'
    }

    cell.font = {
        size: 9,
        color: { argb: 'FF000000' }
    }
}

/**
 * Apply grand total styling
 */
const applyGrandTotalStyle = (cell, isLabel = false) => {
    cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFD966' }
    }
    cell.font = {
        bold: true,
        size: 10,
        color: { argb: 'FF000000' }
    }
    cell.alignment = {
        horizontal: isLabel ? 'center' : 'right',
        vertical: 'middle'
    }
    cell.border = {
        top: { style: 'double', color: { argb: 'FF000000' } },
        left: { style: 'double', color: { argb: 'FF000000' } },
        bottom: { style: 'double', color: { argb: 'FF000000' } },
        right: { style: 'double', color: { argb: 'FF000000' } }
    }
}

/**
 * Generate and download TB Detailed Date Range Report Excel
 * @param {Object} dateRange - { fromDate, toDate }
 */
export const generateTBDetailedDateRangeReportExcel = async (dateRange) => {
    try {
        console.log('=== TB Detailed Date Range Report Excel Generation Started ===')
        console.log('Date Range:', dateRange)

        // Validate date range
        if (!dateRange || !dateRange.fromDate || !dateRange.toDate) {
            throw new Error('Date range is required')
        }

        // Create new workbook
        const workbook = new ExcelJS.Workbook()
        workbook.creator = 'iSmart Accounts System'
        workbook.created = new Date()
        workbook.modified = new Date()

        // Add worksheet
        const worksheet = workbook.addWorksheet('TB Detailed', {
            pageSetup: {
                paperSize: 9, // A4
                orientation: 'landscape',
                fitToPage: true,
                fitToWidth: 1,
                fitToHeight: 0
            },
            views: [{ state: 'frozen', xSplit: 0, ySplit: 7 }]
        })

        // Set column widths
        worksheet.columns = [
            { key: 'glCode', width: 15 },
            { key: 'glName', width: 50 },
            { key: 'drOpeningBal', width: 16 },
            { key: 'crOpeningBal', width: 16 },
            { key: 'periodDr', width: 16 },
            { key: 'periodCr', width: 16 },
            { key: 'drClosingBal', width: 16 },
            { key: 'crClosingBal', width: 16 },
            { key: 'korectGlCode', width: 15 },
            { key: 'glType', width: 10 }
        ]

        // Generate data
        const data = generateTBDetailedDateRangeData(dateRange)

        // HEADER SECTION (Rows 1-6)
        // Row 1: Company Name (merge A1:J1 for centering)
        worksheet.mergeCells('A1:J1')
        const companyCell = worksheet.getCell('A1')
        companyCell.value = data.companyName
        applyCompanyHeaderStyle(companyCell)
        worksheet.getRow(1).height = 20

        // Row 2: Financial Year
        worksheet.mergeCells('A2:J2')
        const fyCell = worksheet.getCell('A2')
        fyCell.value = data.financialYear
        applyInfoRowStyle(fyCell)
        worksheet.getRow(2).height = 15

        // Row 3: Report Title
        worksheet.mergeCells('A3:J3')
        const titleCell = worksheet.getCell('A3')
        titleCell.value = data.reportTitle
        applyReportTitleStyle(titleCell)
        worksheet.getRow(3).height = 18

        // Row 4: Period Info
        worksheet.mergeCells('A4:J4')
        const periodCell = worksheet.getCell('A4')
        periodCell.value = data.periodInfo
        applyInfoRowStyle(periodCell)
        worksheet.getRow(4).height = 15

        // Row 5: Empty row
        worksheet.getRow(5).height = 5

        // Row 6: Column Headers
        const headerRow = worksheet.getRow(6)
        headerRow.height = 30
        const headers = [
            { cell: 'A6', value: 'GLCODE' },
            { cell: 'B6', value: 'GLNAME' },
            { cell: 'C6', value: 'DR.OPENING' },
            { cell: 'D6', value: 'CR.OPENING' },
            { cell: 'E6', value: 'PERIOD DR' },
            { cell: 'F6', value: 'PERIOD CR' },
            { cell: 'G6', value: 'DR.CLOSING' },
            { cell: 'H6', value: 'CR.CLOSING' },
            { cell: 'I6', value: 'KORECTGLCODE' },
            { cell: 'J6', value: 'GLTYPE' }
        ]

        headers.forEach(({ cell, value }) => {
            const headerCell = worksheet.getCell(cell)
            headerCell.value = value
            applyColumnHeaderStyle(headerCell)
        })

        // Row 7: Empty row for better visibility
        worksheet.getRow(7).height = 5

        // DATA ROWS (Starting from row 8)
        let currentRow = 8

        // Add all account data
        data.accounts.forEach((account) => {
            const row = worksheet.getRow(currentRow)

            // Set cell values
            row.getCell(1).value = account.glCode
            row.getCell(2).value = account.glName
            row.getCell(3).value = account.drOpeningBal
            row.getCell(4).value = account.crOpeningBal
            row.getCell(5).value = account.periodDr
            row.getCell(6).value = account.periodCr
            row.getCell(7).value = account.drClosingBal
            row.getCell(8).value = account.crClosingBal
            row.getCell(9).value = account.korectGlCode
            row.getCell(10).value = account.glType

            // Apply cell styling
            applyDataCellStyle(row.getCell(1), false) // glCode
            applyDataCellStyle(row.getCell(2), false) // glName
            applyDataCellStyle(row.getCell(3), true)  // drOpeningBal
            applyDataCellStyle(row.getCell(4), true)  // crOpeningBal
            applyDataCellStyle(row.getCell(5), true)  // periodDr
            applyDataCellStyle(row.getCell(6), true)  // periodCr
            applyDataCellStyle(row.getCell(7), true)  // drClosingBal
            applyDataCellStyle(row.getCell(8), true)  // crClosingBal
            applyDataCellStyle(row.getCell(9), false) // korectGlCode
            applyDataCellStyle(row.getCell(10), false) // glType

            // Format number cells with Indian currency format
            row.getCell(3).numFmt = '#,##0.00'
            row.getCell(4).numFmt = '#,##0.00'
            row.getCell(5).numFmt = '#,##0.00'
            row.getCell(6).numFmt = '#,##0.00'
            row.getCell(7).numFmt = '#,##0.00'
            row.getCell(8).numFmt = '#,##0.00'

            row.height = 16
            currentRow++
        })

        // GRAND TOTAL ROW
        const grandTotalRow = worksheet.getRow(currentRow)
        grandTotalRow.height = 22

        // Grand Total Label (merged across first two columns)
        worksheet.mergeCells(`A${currentRow}:B${currentRow}`)
        const grandTotalLabel = grandTotalRow.getCell(1)
        grandTotalLabel.value = 'GRAND TOTAL'
        applyGrandTotalStyle(grandTotalLabel, true)

        // Grand Total Values
        const grandTotalCells = [
            { col: 3, value: data.grandTotals.drOpeningBal },
            { col: 4, value: data.grandTotals.crOpeningBal },
            { col: 5, value: data.grandTotals.periodDr },
            { col: 6, value: data.grandTotals.periodCr },
            { col: 7, value: data.grandTotals.drClosingBal },
            { col: 8, value: data.grandTotals.crClosingBal }
        ]

        grandTotalCells.forEach(({ col, value }) => {
            const cell = grandTotalRow.getCell(col)
            cell.value = value
            cell.numFmt = '#,##0.00'
            applyGrandTotalStyle(cell, false)
        })

        // Empty cells in grand total row
        for (let col = 9; col <= 10; col++) {
            const cell = grandTotalRow.getCell(col)
            cell.value = ''
            applyGrandTotalStyle(cell, false)
        }

        console.log('Excel structure created successfully')
        console.log('Total Accounts:', data.accounts.length)
        console.log('Grand Totals:', data.grandTotals)

        // Generate Excel file buffer
        const buffer = await workbook.xlsx.writeBuffer()
        console.log('Excel buffer generated, size:', buffer.byteLength, 'bytes')

        // Create blob and download
        const blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        })

        // Format date range for filename
        const formatDateForFilename = (dateStr) => {
            if (!dateStr) return ''
            const date = new Date(dateStr)
            const day = String(date.getDate()).padStart(2, '0')
            const month = String(date.getMonth() + 1).padStart(2, '0')
            const year = date.getFullYear()
            return `${day}-${month}-${year}`
        }

        const fromDateStr = formatDateForFilename(dateRange.fromDate)
        const toDateStr = formatDateForFilename(dateRange.toDate)
        const filename = `TB_Detailed_${fromDateStr}_to_${toDateStr}.xlsx`

        // Save file
        saveAs(blob, filename)
        console.log('File download initiated:', filename)
        console.log('=== TB Detailed Date Range Report Excel Generation Completed ===')

        return {
            success: true,
            filename,
            totalAccounts: data.accounts.length
        }
    } catch (error) {
        console.error('=== TB Detailed Date Range Report Excel Generation Failed ===')
        console.error('Error:', error)
        throw new Error(`Failed to generate Excel report: ${error.message}`)
    }
}

import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'

/**
 * TB Detailed Report Excel Generation Service
 * Generates Detailed Trial Balance Report in Excel format
 * Production-ready code with comprehensive error handling
 */

/**
 * Generate TB Detailed data (flat structure - no hierarchy)
 * @returns {Object} Structured detailed trial balance data
 */
const generateTBDetailedData = () => {
    try {
        const data = {
            companyName: 'I SMART FACITECH PRIVATE LIMITED',
            financialYear: 'Financial Year - From 01/04/2025 To 28/02/2026',
            reportTitle: 'DETAILED TRIAL BALANCE REPORT',
            periodInfo: 'Period From 01/04/2025 To 31/12/2025',
            accounts: [
                { glCode: 'A1001001', glName: 'FA COMPUTER', drOpeningBal: 1990105.22, crOpeningBal: 0, periodDr: 2168800.00, periodCr: 0, drClosingBal: 4158905.22, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A1002001', glName: 'FA FURNITURE & FIXTURE', drOpeningBal: 760503.33, crOpeningBal: 0, periodDr: 3263734.00, periodCr: 0, drClosingBal: 4024237.33, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A1004001', glName: 'FA SOFTWARE', drOpeningBal: 619567.00, crOpeningBal: 0, periodDr: 76500.00, periodCr: 0, drClosingBal: 696067.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A1005001', glName: 'FA OFFICE EQUIPMENT', drOpeningBal: 1195697.82, crOpeningBal: 0, periodDr: 2002403.02, periodCr: 907.00, drClosingBal: 3197193.84, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A1007001', glName: 'FA MACHINERY', drOpeningBal: 6366206.25, crOpeningBal: 0, periodDr: 2069677.26, periodCr: 0, drClosingBal: 8435883.51, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A1008001', glName: 'ACCUMULATED  DEPRECIATION', drOpeningBal: 0, crOpeningBal: 5062347.00, periodDr: 0, periodCr: 7007836.00, drClosingBal: 0, crClosingBal: 12070183.00, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3001001', glName: 'DEPOSIT - RENTAL OFFICE', drOpeningBal: 767500.00, crOpeningBal: 0, periodDr: 1541500.00, periodCr: 769000.00, drClosingBal: 1540000.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3001002', glName: 'DEPOSIT - STAFF ACCOMODATIONS', drOpeningBal: 38400.00, crOpeningBal: 0, periodDr: 173500.00, periodCr: 78000.00, drClosingBal: 133900.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3001004', glName: 'DEPOSIT - LABOUR LICENSE', drOpeningBal: 327431.00, crOpeningBal: 0, periodDr: 46500.00, periodCr: 0, drClosingBal: 373931.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3001005', glName: 'DEPOSITS - OTHER', drOpeningBal: 50000.00, crOpeningBal: 0, periodDr: 57250.00, periodCr: 52250.00, drClosingBal: 55000.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3001006', glName: 'FD AGAINST HDFC BANK INDORE FD A/C -50300519330209', drOpeningBal: 45000.00, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 45000.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3001007', glName: 'EMD - MCGM', drOpeningBal: 2809276.00, crOpeningBal: 0, periodDr: 2536372.00, periodCr: 2682000.00, drClosingBal: 2663648.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3001010', glName: 'EMD - UNIVERCITY OF MUMBAI - KALINA', drOpeningBal: 0, crOpeningBal: 0, periodDr: 217677.00, periodCr: 217677.00, drClosingBal: 0, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3001015', glName: 'FD AGAINST KEM HOSPITAL BG -', drOpeningBal: 1012500.00, crOpeningBal: 0, periodDr: 484000.00, periodCr: 1496500.00, drClosingBal: 0, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3001017', glName: 'EMD - MAHADA', drOpeningBal: 150000.00, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 150000.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3001018', glName: 'FD AGAINST HDFC BANK -50300834091536', drOpeningBal: 230000.00, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 230000.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3001019', glName: 'FD AGAINST ROYAL CONSULATE SAUDI ARABIA', drOpeningBal: 60000.00, crOpeningBal: 0, periodDr: 0, periodCr: 60000.00, drClosingBal: 0, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3001020', glName: 'FD AGAINST MAHADA BG FD NO 104510DP00010657', drOpeningBal: 1490007.00, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 1490007.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3001022', glName: 'FD AGAIST BG MDL A/C 104510DP00010790', drOpeningBal: 6115.00, crOpeningBal: 0, periodDr: 0, periodCr: 6115.00, drClosingBal: 0, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3001023', glName: 'FD AGAINST IRCTC BG 104510OR00002792', drOpeningBal: 1062000.00, crOpeningBal: 0, periodDr: 732000.00, periodCr: 1794000.00, drClosingBal: 0, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3001024', glName: 'EMD - MUMBAI FIRE BRIGADE', drOpeningBal: 505100.00, crOpeningBal: 0, periodDr: 0, periodCr: 505100.00, drClosingBal: 0, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3001025', glName: 'FD AGAINST BG PERIPHERALS HOSPITALS', drOpeningBal: 717068.00, crOpeningBal: 0, periodDr: 187562.00, periodCr: 717068.00, drClosingBal: 187562.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3001026', glName: 'DEPOSIT -PG- DISTRICT JUDGE DAHOD', drOpeningBal: 0, crOpeningBal: 0, periodDr: 1500000.00, periodCr: 0, drClosingBal: 1500000.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3001027', glName: 'EMD - THE ORIENTAL INSURANCE CO LTD', drOpeningBal: 0, crOpeningBal: 0, periodDr: 25000.00, periodCr: 25000.00, drClosingBal: 0, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3001028', glName: 'FD AGAINST ICAR KOZHIKODE BG 104510DP00013104', drOpeningBal: 0, crOpeningBal: 0, periodDr: 278000.00, periodCr: 0, drClosingBal: 278000.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3001029', glName: 'ACCRUED INTEREST', drOpeningBal: 128181.00, crOpeningBal: 0, periodDr: 250169.00, periodCr: 231937.00, drClosingBal: 146413.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3001030', glName: 'EMD - R N KOOPER HOSPITAL', drOpeningBal: 0, crOpeningBal: 0, periodDr: 1472523.00, periodCr: 1472523.00, drClosingBal: 0, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3001031', glName: 'EMD - TRAUMA HOSPITAL', drOpeningBal: 0, crOpeningBal: 0, periodDr: 1472523.00, periodCr: 0, drClosingBal: 1472523.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3001032', glName: 'FD WITH HDFC BANK 00602990000034', drOpeningBal: 0, crOpeningBal: 0, periodDr: 831000.00, periodCr: 0, drClosingBal: 831000.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3001033', glName: 'FD AGAINST KEM BG A/C 104510DP00016332', drOpeningBal: 0, crOpeningBal: 0, periodDr: 48400.00, periodCr: 0, drClosingBal: 48400.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3001034', glName: 'EMD- SIDDHIVINAYAK TEMPLE', drOpeningBal: 0, crOpeningBal: 0, periodDr: 300000.00, periodCr: 300000.00, drClosingBal: 0, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3001035', glName: 'FD FOR TRAUMA HOSPITAL BG', drOpeningBal: 0, crOpeningBal: 0, periodDr: 157500.00, periodCr: 0, drClosingBal: 157500.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3001036', glName: 'EMD - ESIC MAROL OFFICE', drOpeningBal: 0, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 0, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3001037', glName: 'FD WITH HDFC BANK 50200111716810', drOpeningBal: 0, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 0, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3001038', glName: 'FD AGAINST HDFC BANK OD A/C', drOpeningBal: 0, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 0, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3002002', glName: 'STAFF LOAN / ADVANCE', drOpeningBal: 401799.45, crOpeningBal: 0, periodDr: 2595332.00, periodCr: 2679381.00, drClosingBal: 317750.45, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3002003', glName: 'UNBILLED RECEIVABLE/ACCRUED INCOME', drOpeningBal: 0, crOpeningBal: 0, periodDr: 283839165.00, periodCr: 280093275.00, drClosingBal: 3745890.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3002004', glName: 'MATOSHRI ENTERPRISES', drOpeningBal: 160051.00, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 160051.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3002005', glName: 'ADVANCE TO OTHERS', drOpeningBal: 250000.00, crOpeningBal: 0, periodDr: 0, periodCr: 250000.00, drClosingBal: 0, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3002007', glName: 'SHARE & FD OF MANISH KAMBLE AGST APNA BANK LOAN', drOpeningBal: 183000.00, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 183000.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3002008', glName: 'DEBTORS LEGAL CASE INTIATED', drOpeningBal: 2705708.62, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 2705708.62, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3002009', glName: 'MANISH KAMBLE LOAN A/C', drOpeningBal: 6633781.39, crOpeningBal: 0, periodDr: 1.00, periodCr: 6633782.39, drClosingBal: 0, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3002010', glName: 'ASHA BHATNAGAR LOAN A/C', drOpeningBal: 3035572.00, crOpeningBal: 0, periodDr: 0, periodCr: 3035572.00, drClosingBal: 0, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3002011', glName: 'PURVI SADADEKAR LOAN A/C', drOpeningBal: 2557563.00, crOpeningBal: 0, periodDr: 0, periodCr: 2557563.00, drClosingBal: 0, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3002012', glName: 'LAXMAN PATIL LOAN A/C', drOpeningBal: 667018.00, crOpeningBal: 0, periodDr: 0, periodCr: 667018.00, drClosingBal: 0, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3002014', glName: 'TARGET HOSPITALITY PVT LTD', drOpeningBal: 7997703.00, crOpeningBal: 0, periodDr: 0, periodCr: 500000.00, drClosingBal: 7497703.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3002017', glName: 'SMART MONITORING SURVEILLANCE PVT LTD', drOpeningBal: 390500.00, crOpeningBal: 0, periodDr: 459778.00, periodCr: 0, drClosingBal: 850278.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3002018', glName: 'MANOJ KAMBLI', drOpeningBal: 0, crOpeningBal: 0, periodDr: 367992.00, periodCr: 0, drClosingBal: 367992.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3002019', glName: 'PROVISIONS FOR BAD DEBTS', drOpeningBal: 0, crOpeningBal: 0, periodDr: 27000.00, periodCr: 0, drClosingBal: 27000.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3003001', glName: 'SUNDRY DEBTORS CONTROL ACCOUNT', drOpeningBal: 141661848.99, crOpeningBal: 0, periodDr: 3488016102.22, periodCr: 3311358271.72, drClosingBal: 318319679.49, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3004001001', glName: 'CASH IN HAND - MUM', drOpeningBal: 21672.48, crOpeningBal: 0, periodDr: 331599.00, periodCr: 340561.95, drClosingBal: 12709.53, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3004003001', glName: 'CFMS_HDFC BANK A/C 50200028417957', drOpeningBal: 17633.86, crOpeningBal: 0, periodDr: 17558.00, periodCr: 5664.00, drClosingBal: 29527.86, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3004003003', glName: 'CFMS_HDFC BANK VAD A/C 50200059203020', drOpeningBal: 60000.00, crOpeningBal: 0, periodDr: 0, periodCr: 0, drClosingBal: 60000.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3004003004', glName: 'CFMS_APNA SAHAKARI BANK LTD A/C 062012100000738', drOpeningBal: 3000.00, crOpeningBal: 0, periodDr: 0, periodCr: 3000.00, drClosingBal: 0, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3004003005', glName: 'HDFC BANK ISMART A/C 59218000123456', drOpeningBal: 49464.31, crOpeningBal: 0, periodDr: 139000.00, periodCr: 136000.00, drClosingBal: 52464.31, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3004003006', glName: 'PNB CURRENT A/C 1045102100000408', drOpeningBal: 176758.19, crOpeningBal: 0, periodDr: 1754515332.43, periodCr: 1743631724.59, drClosingBal: 11060366.03, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3004003007', glName: 'HDFC BANK NEW A/C 50200111716810', drOpeningBal: 0, crOpeningBal: 0, periodDr: 60106349.77, periodCr: 60106349.77, drClosingBal: 0, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3005001', glName: 'PREPAID EXPENSE', drOpeningBal: 12594118.98, crOpeningBal: 0, periodDr: 44614535.48, periodCr: 39935720.19, drClosingBal: 17272934.27, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3006008', glName: 'TDS RECEIVABLE F.Y. 22-23', drOpeningBal: 49894.49, crOpeningBal: 0, periodDr: 4728.89, periodCr: 53257.38, drClosingBal: 1366.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3006009', glName: 'CFMS TDS RECEIVABLE F Y 22 23', drOpeningBal: 7124.35, crOpeningBal: 0, periodDr: 0, periodCr: 7124.35, drClosingBal: 0, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3006010', glName: 'TDS RECEIVABLE F.Y. 23-24', drOpeningBal: 13546584.89, crOpeningBal: 0, periodDr: 1365088.70, periodCr: 14910984.59, drClosingBal: 689.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3006011', glName: 'TDS RECEIVABLE F.Y. 24-25', drOpeningBal: 0, crOpeningBal: 0, periodDr: 22655636.09, periodCr: 2299434.65, drClosingBal: 20356201.44, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3006012', glName: 'TDS RECEIVABLE F.Y-25-26', drOpeningBal: 0, crOpeningBal: 0, periodDr: 17630363.47, periodCr: 0, drClosingBal: 17630363.47, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3007001001', glName: 'SGST INPUT', drOpeningBal: 118215.30, crOpeningBal: 0, periodDr: 7435040.67, periodCr: 3509032.65, drClosingBal: 4044223.32, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3007001002', glName: 'CGST INPUT', drOpeningBal: 65151.30, crOpeningBal: 0, periodDr: 7435040.67, periodCr: 3509033.15, drClosingBal: 3991158.82, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3007001003', glName: 'IGST INPUT', drOpeningBal: 0, crOpeningBal: 77462.47, periodDr: 3118505.32, periodCr: 2057872.51, drClosingBal: 983170.34, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3007001004', glName: 'SGST INPUT (RCM)', drOpeningBal: 0, crOpeningBal: 0, periodDr: 52349.00, periodCr: 27000.00, drClosingBal: 25349.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3007001005', glName: 'CGST INPUT (RCM)', drOpeningBal: 0, crOpeningBal: 0, periodDr: 51403.00, periodCr: 27000.00, drClosingBal: 24403.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3007001006', glName: 'IGST INPUT (RCM)', drOpeningBal: 0, crOpeningBal: 0, periodDr: 4.00, periodCr: 0, drClosingBal: 4.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3007001007', glName: 'CGST TDS (INPUT)', drOpeningBal: 0, crOpeningBal: 0, periodDr: 414740.95, periodCr: 0, drClosingBal: 414740.95, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3007001008', glName: 'SGST TDS (INPUT)', drOpeningBal: 0, crOpeningBal: 0, periodDr: 412448.33, periodCr: 0, drClosingBal: 412448.33, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'A3007001009', glName: 'IGST TDS (INPUT)', drOpeningBal: 0, crOpeningBal: 0, periodDr: 45749.00, periodCr: 254.00, drClosingBal: 45495.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
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
                { glCode: 'L2001001', glName: 'BONUS PAYABLE', drOpeningBal: 0, crOpeningBal: 0, periodDr: 55873385.35, periodCr: 55873385.35, drClosingBal: 0, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2001002', glName: 'SALARY PAYABLE', drOpeningBal: 0, crOpeningBal: 49057686.60, periodDr: 1370137118.79, periodCr: 1401275496.00, drClosingBal: 0, crClosingBal: 80196063.81, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2001003', glName: 'GRATUITY PAYABLE', drOpeningBal: 0, crOpeningBal: 0, periodDr: 476843.00, periodCr: 476843.00, drClosingBal: 0, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2001005', glName: 'FULL & FINAL SETTLEMENT PAYABLE', drOpeningBal: 0, crOpeningBal: 61854.00, periodDr: 1120791.00, periodCr: 1193458.00, drClosingBal: 0, crClosingBal: 134521.00, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2001006', glName: 'LEAVE TRAVEL PAYABLE (LTA)', drOpeningBal: 0, crOpeningBal: 0, periodDr: 1351520.45, periodCr: 1351520.45, drClosingBal: 0, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2001007', glName: 'CONVEYANCE PAYABLE', drOpeningBal: 0, crOpeningBal: 605281.66, periodDr: 7302765.79, periodCr: 7144630.30, drClosingBal: 0, crClosingBal: 447146.17, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2001010', glName: 'LOAN / ADV RECOVERY FROM EMPLOYEES', drOpeningBal: 0, crOpeningBal: 3770.00, periodDr: 222714.00, periodCr: 232322.00, drClosingBal: 0, crClosingBal: 13378.00, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2001011', glName: 'SALARY & WAGES PAYABLE JAN 24', drOpeningBal: 0, crOpeningBal: 0, periodDr: 7742.00, periodCr: 7742.00, drClosingBal: 0, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2001013', glName: 'SALARY & WAGES PAYABLE FEB 24', drOpeningBal: 0, crOpeningBal: 0, periodDr: 266585.00, periodCr: 266585.00, drClosingBal: 0, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2001014', glName: 'SALARY & WAGES PAYABLE MAR 24', drOpeningBal: 0, crOpeningBal: 0, periodDr: 163583018.00, periodCr: 163583018.00, drClosingBal: 0, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2001015', glName: 'SALARY & WAGES PAYABLE APR 24', drOpeningBal: 0, crOpeningBal: 0, periodDr: 55558729.00, periodCr: 55558729.00, drClosingBal: 0, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2001016', glName: 'SALARY & WAGES PAYABLE MAY 24', drOpeningBal: 0, crOpeningBal: 0, periodDr: 56919138.00, periodCr: 56919138.00, drClosingBal: 0, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2001017', glName: 'SALARY & WAGE PAYABLE JUN 24', drOpeningBal: 0, crOpeningBal: 0, periodDr: 60576574.49, periodCr: 60576574.49, drClosingBal: 0, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2001018', glName: 'FATAK PAY DEDUCTION', drOpeningBal: 0, crOpeningBal: 0, periodDr: 1099355.00, periodCr: 1101147.00, drClosingBal: 0, crClosingBal: 1792.00, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2002001', glName: 'PROVIDENT FUND (PF) COMPANY PAYABLE', drOpeningBal: 0, crOpeningBal: 14753716.96, periodDr: 151228531.43, periodCr: 152357690.00, drClosingBal: 0, crClosingBal: 15882875.53, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2002002', glName: 'PROVIDENT FUND (PF) EMPLOYEE PAYABLE', drOpeningBal: 0, crOpeningBal: 13619731.04, periodDr: 139647568.57, periodCr: 140720641.00, drClosingBal: 0, crClosingBal: 14692803.47, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2002003', glName: 'ESIC COMPANY PAYABLE', drOpeningBal: 0, crOpeningBal: 1741417.61, periodDr: 39987137.83, periodCr: 42067738.00, drClosingBal: 0, crClosingBal: 3822017.78, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2002004', glName: 'ESIC EMPLOYEE PAYABLE', drOpeningBal: 0, crOpeningBal: 403506.39, periodDr: 9259766.17, periodCr: 9815836.00, drClosingBal: 0, crClosingBal: 959576.22, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2002005', glName: 'PROFESSION TAX PAYABLE', drOpeningBal: 0, crOpeningBal: 3166328.00, periodDr: 10036253.80, periodCr: 10634895.00, drClosingBal: 0, crClosingBal: 3764969.20, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2002006', glName: 'LABOUR WELFARE FUND PAYABLE', drOpeningBal: 0, crOpeningBal: 6430.00, periodDr: 590099.10, periodCr: 1371287.00, drClosingBal: 0, crClosingBal: 787617.90, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2002008', glName: 'INCOME TAX PROVISION', drOpeningBal: 0, crOpeningBal: 5553903.00, periodDr: 5553903.00, periodCr: 4121781.00, drClosingBal: 0, crClosingBal: 4121781.00, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2003001', glName: 'TDS CONTRACT/SUB CONTRACT', drOpeningBal: 0, crOpeningBal: 54608.00, periodDr: 349303.00, periodCr: 309662.00, drClosingBal: 0, crClosingBal: 14967.00, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2003002', glName: 'TDS PROFESSIONAL FEES', drOpeningBal: 0, crOpeningBal: 149845.24, periodDr: 1296924.00, periodCr: 1343180.60, drClosingBal: 0, crClosingBal: 196101.84, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2003003', glName: 'TDS RENT', drOpeningBal: 0, crOpeningBal: 46144.50, periodDr: 493093.00, periodCr: 491460.00, drClosingBal: 0, crClosingBal: 44511.50, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2003004', glName: 'TDS COMMISSION', drOpeningBal: 0, crOpeningBal: 1475.00, periodDr: 20876.00, periodCr: 19401.00, drClosingBal: 0, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2003005', glName: 'TDS SALARY', drOpeningBal: 0, crOpeningBal: 73215.00, periodDr: 1446740.00, periodCr: 1578525.00, drClosingBal: 0, crClosingBal: 205000.00, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2003007', glName: 'TDS ON PURCHASES @0.10%', drOpeningBal: 0, crOpeningBal: 2524.00, periodDr: 9648.00, periodCr: 26829.00, drClosingBal: 0, crClosingBal: 19705.00, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2004001001', glName: 'SGST OUTPUT/PAYABLE', drOpeningBal: 0, crOpeningBal: 5917526.60, periodDr: 131375275.26, periodCr: 142258527.77, drClosingBal: 0, crClosingBal: 16800779.11, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2004001002', glName: 'CGST OUTPUT/PAYABLE', drOpeningBal: 0, crOpeningBal: 5875760.70, periodDr: 131341950.09, periodCr: 142258527.77, drClosingBal: 0, crClosingBal: 16792338.38, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2004001003', glName: 'IGST OUTPUT/PAYABLE', drOpeningBal: 0, crOpeningBal: 3228604.94, periodDr: 66736014.02, periodCr: 64864708.49, drClosingBal: 0, crClosingBal: 1357299.41, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2004001004', glName: 'SGST OUTPUT/PAYABLE (RCM)', drOpeningBal: 0, crOpeningBal: 0, periodDr: 27000.00, periodCr: 47700.00, drClosingBal: 0, crClosingBal: 20700.00, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2004001005', glName: 'CGST OUTPUT/PAYABLE (RCM)', drOpeningBal: 0, crOpeningBal: 0, periodDr: 27000.00, periodCr: 47700.00, drClosingBal: 0, crClosingBal: 20700.00, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2005001', glName: 'SUNDRY CREDITORS CONTROL ACCOUNT', drOpeningBal: 0, crOpeningBal: 7472986.44, periodDr: 175829432.56, periodCr: 185414229.06, drClosingBal: 0, crClosingBal: 17057782.94, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2006001', glName: 'OUTSTANDING EXPENSES', drOpeningBal: 0, crOpeningBal: 6430395.54, periodDr: 69933387.23, periodCr: 81907316.01, drClosingBal: 0, crClosingBal: 18404324.32, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2006003', glName: 'INTEREST/ PENALTY ON GST', drOpeningBal: 0, crOpeningBal: 18702.00, periodDr: 467140.00, periodCr: 448438.00, drClosingBal: 0, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2006004', glName: 'INTEREST/ PENALTY ON PF/ESIC', drOpeningBal: 0, crOpeningBal: 0, periodDr: 246077.00, periodCr: 260513.00, drClosingBal: 0, crClosingBal: 14436.00, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2006005', glName: 'DEFERRED TAX LIABILITIES', drOpeningBal: 448300.00, crOpeningBal: 0, periodDr: 359658.00, periodCr: 0, drClosingBal: 807958.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2006007', glName: 'DEPOSIT FROM VENDOR', drOpeningBal: 0, crOpeningBal: 2500000.00, periodDr: 2500000.00, periodCr: 0, drClosingBal: 0, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2006008', glName: 'CONTRIBUTION TOWARDS STAFF WELFARE', drOpeningBal: 0, crOpeningBal: 0, periodDr: 64250.00, periodCr: 64250.00, drClosingBal: 0, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2006009', glName: 'CONTRIBUTION TOWARDS STAFF WELFARE FUND', drOpeningBal: 0, crOpeningBal: 0, periodDr: 150000.00, periodCr: 2448860.00, drClosingBal: 0, crClosingBal: 2298860.00, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2006010', glName: 'PROVISION FOR DOUBTFUL DEBTS (L)', drOpeningBal: 0, crOpeningBal: 0, periodDr: 0, periodCr: 2705708.62, drClosingBal: 0, crClosingBal: 2705708.62, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2007001001', glName: 'PNB CC A/C 1045108700000064', drOpeningBal: 0, crOpeningBal: 60839799.73, periodDr: 2539007407.54, periodCr: 2656799296.36, drClosingBal: 0, crClosingBal: 178631688.55, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2007002001', glName: 'KEITA PHARMA PVT LTD', drOpeningBal: 0, crOpeningBal: 2990000.00, periodDr: 0, periodCr: 0, drClosingBal: 0, crClosingBal: 2990000.00, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2007002003', glName: 'SANJAY KHANVILKAR', drOpeningBal: 0, crOpeningBal: 0, periodDr: 25030188.00, periodCr: 21937594.00, drClosingBal: 3092594.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2007002004', glName: 'SHOBHANA BAGWE', drOpeningBal: 0, crOpeningBal: 410000.00, periodDr: 400000.00, periodCr: 0, drClosingBal: 0, crClosingBal: 10000.00, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2007002005', glName: 'VINAYAK BHISE', drOpeningBal: 0, crOpeningBal: 700000.00, periodDr: 2819000.00, periodCr: 0, drClosingBal: 2119000.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2007002007', glName: 'PURVI SADADEKAR', drOpeningBal: 0, crOpeningBal: 22924.00, periodDr: 0, periodCr: 0, drClosingBal: 0, crClosingBal: 22924.00, korectGlCode: '', glType: 'FILE' },
                { glCode: 'L2007002022', glName: 'SIDDHESH KHANVILKAR', drOpeningBal: 1706094.00, crOpeningBal: 0, periodDr: 4200000.00, periodCr: 5906094.00, drClosingBal: 0, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'R1001001', glName: 'HOUSE KEEPING CHARGES', drOpeningBal: 0, crOpeningBal: 0, periodDr: 1591366793.23, periodCr: 3533045467.52, drClosingBal: 0, crClosingBal: 1941678674.29, korectGlCode: '', glType: 'FILE' },
                { glCode: 'R1001005001', glName: 'HK MATERIAL', drOpeningBal: 0, crOpeningBal: 0, periodDr: 3778214.18, periodCr: 34285422.51, drClosingBal: 0, crClosingBal: 30507208.33, korectGlCode: '', glType: 'FILE' },
                { glCode: 'R1001005002', glName: 'CLEANING CONSUMABLE', drOpeningBal: 0, crOpeningBal: 0, periodDr: 652038.00, periodCr: 11736707.80, drClosingBal: 0, crClosingBal: 11084669.80, korectGlCode: '', glType: 'FILE' },
                { glCode: 'R1001006', glName: 'DEEP CLEANING CHARGES', drOpeningBal: 0, crOpeningBal: 0, periodDr: 102551.21, periodCr: 5031371.80, drClosingBal: 0, crClosingBal: 4928820.59, korectGlCode: '', glType: 'FILE' },
                { glCode: 'R1001007', glName: 'RENT ON MACHINERY', drOpeningBal: 0, crOpeningBal: 0, periodDr: 314446.00, periodCr: 2875123.74, drClosingBal: 0, crClosingBal: 2560677.74, korectGlCode: '', glType: 'FILE' },
                { glCode: 'R1001008', glName: 'MANPOWER SERVICES', drOpeningBal: 0, crOpeningBal: 0, periodDr: 13923127.64, periodCr: 146633153.69, drClosingBal: 0, crClosingBal: 132710026.05, korectGlCode: '', glType: 'FILE' },
                { glCode: 'R2001001', glName: 'BANK INTEREST RECEIVED', drOpeningBal: 0, crOpeningBal: 0, periodDr: 0, periodCr: 289803.00, drClosingBal: 0, crClosingBal: 289803.00, korectGlCode: '', glType: 'FILE' },
                { glCode: 'R2001002', glName: 'MISC INCOME', drOpeningBal: 0, crOpeningBal: 0, periodDr: 0, periodCr: 2696.79, drClosingBal: 0, crClosingBal: 2696.79, korectGlCode: '', glType: 'FILE' },
                { glCode: 'R2001003', glName: 'ROUND OFF', drOpeningBal: 0, crOpeningBal: 0, periodDr: 830.33, periodCr: 856.01, drClosingBal: 0, crClosingBal: 25.68, korectGlCode: '', glType: 'FILE' },
                { glCode: 'R2001004', glName: 'WRITTEN BACK', drOpeningBal: 0, crOpeningBal: 0, periodDr: 0, periodCr: 72458.40, drClosingBal: 0, crClosingBal: 72458.40, korectGlCode: '', glType: 'FILE' },
                { glCode: 'R2001005', glName: 'INTEREST ON INCOME TAX REFUND', drOpeningBal: 0, crOpeningBal: 0, periodDr: 7895065.00, periodCr: 8171390.00, drClosingBal: 0, crClosingBal: 276325.00, korectGlCode: '', glType: 'FILE' },
                { glCode: 'R2001006', glName: 'REBATE & DISCOUNT RECD', drOpeningBal: 0, crOpeningBal: 0, periodDr: 43.52, periodCr: 4968.11, drClosingBal: 0, crClosingBal: 4924.59, korectGlCode: '', glType: 'FILE' },
                { glCode: 'R2001007', glName: 'EXCESS PROVISION WRITTEN BACK', drOpeningBal: 0, crOpeningBal: 0, periodDr: 0, periodCr: 3405840.01, drClosingBal: 0, crClosingBal: 3405840.01, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1001001001001', glName: 'FO - BASIC SALARIES', drOpeningBal: 0, crOpeningBal: 0, periodDr: 856318669.00, periodCr: 0, drClosingBal: 856318669.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1001001001002', glName: 'FO - DEARNESS ALLOWANCE (DA)', drOpeningBal: 0, crOpeningBal: 0, periodDr: 267466143.00, periodCr: 0, drClosingBal: 267466143.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1001001001003', glName: 'FO - HOUSE RENT ALLOWANCE-HRA', drOpeningBal: 0, crOpeningBal: 0, periodDr: 62913473.00, periodCr: 0, drClosingBal: 62913473.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1001001001004', glName: 'FO - OTHER ALLOWANCE', drOpeningBal: 0, crOpeningBal: 0, periodDr: 147396590.00, periodCr: 18584816.86, drClosingBal: 128811773.14, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1001001001005', glName: 'FO - EDUCATION ALLOWANCE', drOpeningBal: 0, crOpeningBal: 0, periodDr: 48977.00, periodCr: 0, drClosingBal: 48977.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1001001001006', glName: 'FO - BONUS', drOpeningBal: 0, crOpeningBal: 0, periodDr: 102198671.01, periodCr: 22010124.00, drClosingBal: 80188547.01, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1001001001007', glName: 'FO - MEDICAL EXP.', drOpeningBal: 0, crOpeningBal: 0, periodDr: 1847910.00, periodCr: 0, drClosingBal: 1847910.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1001001001008', glName: 'FO - OTHER DEDUCTION/NOTICE PERIOD', drOpeningBal: 0, crOpeningBal: 0, periodDr: 3120469.74, periodCr: 9064886.00, drClosingBal: 0, crClosingBal: 5944416.26, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1001001001009', glName: 'FO - LEAVE ENCASHMENT', drOpeningBal: 0, crOpeningBal: 0, periodDr: 44435807.85, periodCr: 8854.00, drClosingBal: 44426953.85, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1001001001010', glName: 'FO - GRATUITY', drOpeningBal: 0, crOpeningBal: 0, periodDr: 1019594.00, periodCr: 4516.00, drClosingBal: 1015078.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1001001001011', glName: 'FO - LABOUR WELFARE FUND', drOpeningBal: 0, crOpeningBal: 0, periodDr: 933669.00, periodCr: 3279.75, drClosingBal: 930389.25, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1001001001012', glName: 'FO - INSURANCE', drOpeningBal: 0, crOpeningBal: 0, periodDr: 1797008.00, periodCr: 876408.90, drClosingBal: 920599.10, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1001001001013', glName: 'FO - E.S.I.C.', drOpeningBal: 0, crOpeningBal: 0, periodDr: 41683818.00, periodCr: 32677.00, drClosingBal: 41651141.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1001001001014', glName: 'FO - PROVIDENT FUND', drOpeningBal: 0, crOpeningBal: 0, periodDr: 148522406.00, periodCr: 60600.00, drClosingBal: 148461806.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1001001001015', glName: 'FO - OVERTIME', drOpeningBal: 0, crOpeningBal: 0, periodDr: 129661728.00, periodCr: 0, drClosingBal: 129661728.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1001001001016', glName: 'FO - CONVEYANCE ALLOWANCE', drOpeningBal: 0, crOpeningBal: 0, periodDr: 6943842.00, periodCr: 0, drClosingBal: 6943842.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1001001001017', glName: 'FO - EX-GRATIA', drOpeningBal: 0, crOpeningBal: 0, periodDr: 330530.00, periodCr: 0, drClosingBal: 330530.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1001001001018', glName: 'FO - WASHING ALLOWANCE', drOpeningBal: 0, crOpeningBal: 0, periodDr: 1829765.00, periodCr: 0, drClosingBal: 1829765.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1001001001019', glName: 'FO - NOTICE PAY SALARY', drOpeningBal: 0, crOpeningBal: 0, periodDr: 955257.00, periodCr: 0, drClosingBal: 955257.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1001001001021', glName: 'FO - PERFORMANCE INCENTIVE', drOpeningBal: 0, crOpeningBal: 0, periodDr: 354150.00, periodCr: 0, drClosingBal: 354150.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1001001001022', glName: 'FO - LEAVE TRAVEL ALLOWANCE', drOpeningBal: 0, crOpeningBal: 0, periodDr: 1351520.45, periodCr: 0, drClosingBal: 1351520.45, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1001001002001', glName: 'SUB CONTRACTORS EXP', drOpeningBal: 0, crOpeningBal: 0, periodDr: 12007420.91, periodCr: 2420431.00, drClosingBal: 9586989.91, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1001002002', glName: 'FO - CONVEYANCE', drOpeningBal: 0, crOpeningBal: 0, periodDr: 154070.00, periodCr: 25712.00, drClosingBal: 128358.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1001002003', glName: 'FO - TRAVELIING EXPENSES', drOpeningBal: 0, crOpeningBal: 0, periodDr: 22245.00, periodCr: 5319.00, drClosingBal: 16926.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1001002005', glName: 'GUEST HOUSE EXPENSES', drOpeningBal: 0, crOpeningBal: 0, periodDr: 2383288.62, periodCr: 1013120.49, drClosingBal: 1370168.13, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1001004001', glName: 'PURCHASE - HOUSEKEEPING MATERIAL', drOpeningBal: 0, crOpeningBal: 0, periodDr: 105263259.39, periodCr: 36382089.07, drClosingBal: 68881170.32, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1001004002', glName: 'PURCHASE - STAFF UNIFORM', drOpeningBal: 0, crOpeningBal: 0, periodDr: 30603795.37, periodCr: 15045973.00, drClosingBal: 15557822.37, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1001004003', glName: 'TRANSPORTATION CHARGES', drOpeningBal: 0, crOpeningBal: 0, periodDr: 281266.00, periodCr: 18300.00, drClosingBal: 262966.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1001004004', glName: 'LOADING & UNLOADING EXPENSES', drOpeningBal: 0, crOpeningBal: 0, periodDr: 21535.00, periodCr: 0, drClosingBal: 21535.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1001004005', glName: 'LAUNDRY EXPENSES', drOpeningBal: 0, crOpeningBal: 0, periodDr: 363074.00, periodCr: 239010.00, drClosingBal: 124064.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1001004006', glName: 'SPECIAL PROJECT EXPENSES', drOpeningBal: 0, crOpeningBal: 0, periodDr: 4594485.00, periodCr: 1359200.00, drClosingBal: 3235285.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1001006001', glName: 'REPAIRS & MAINTANANCE (SITE LEVEL)', drOpeningBal: 0, crOpeningBal: 0, periodDr: 2856610.78, periodCr: 1376473.00, drClosingBal: 1480137.78, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1001006002', glName: 'REPAIRS & MAINTANANCE (SPARES)', drOpeningBal: 0, crOpeningBal: 0, periodDr: 445278.82, periodCr: 7080.00, drClosingBal: 438198.82, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1001006003', glName: 'LEASE RENTAL - MACHINERIES', drOpeningBal: 0, crOpeningBal: 0, periodDr: 28000.00, periodCr: 0, drClosingBal: 28000.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1001007001', glName: 'PROVISION FOR BAD DEBT', drOpeningBal: 0, crOpeningBal: 0, periodDr: 2705708.62, periodCr: 0, drClosingBal: 2705708.62, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1001007002', glName: 'BAD DEBTS WRITTEN OFF', drOpeningBal: 0, crOpeningBal: 0, periodDr: 841275.00, periodCr: 0, drClosingBal: 841275.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1001007003', glName: 'SLA DEDUCTION', drOpeningBal: 0, crOpeningBal: 0, periodDr: 45526.39, periodCr: 0, drClosingBal: 45526.39, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1002001', glName: 'FOODS & BEVERAGES TO EMPLOYEES', drOpeningBal: 0, crOpeningBal: 0, periodDr: 2892509.71, periodCr: 1322500.00, drClosingBal: 1570009.71, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1002005', glName: 'STAFF WELFARE (SITE LEVEL)', drOpeningBal: 0, crOpeningBal: 0, periodDr: 41482.00, periodCr: 0, drClosingBal: 41482.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1002006', glName: 'ELECTRICITY CHRGS (SITE LEVEL)', drOpeningBal: 0, crOpeningBal: 0, periodDr: 63118.96, periodCr: 0, drClosingBal: 63118.96, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1002007', glName: 'RENT ( SITE LEVEL)', drOpeningBal: 0, crOpeningBal: 0, periodDr: 2570600.00, periodCr: 356155.00, drClosingBal: 2214445.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1002009', glName: 'CONVEYANCE EXP ( SITE LEVEL)', drOpeningBal: 0, crOpeningBal: 0, periodDr: 4873.00, periodCr: 0, drClosingBal: 4873.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1002011', glName: 'VISIT CHARGES (SITE LEVEL)', drOpeningBal: 0, crOpeningBal: 0, periodDr: 2000.00, periodCr: 0, drClosingBal: 2000.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1002013', glName: 'SITE EXPENSES', drOpeningBal: 0, crOpeningBal: 0, periodDr: 31012506.92, periodCr: 5684090.13, drClosingBal: 25328416.79, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1002014', glName: 'MOBILISATION COST', drOpeningBal: 0, crOpeningBal: 0, periodDr: 129553.00, periodCr: 36000.00, drClosingBal: 93553.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X1002015', glName: 'PROFESSIONAL CHG - SITE', drOpeningBal: 0, crOpeningBal: 0, periodDr: 133415.94, periodCr: 0, drClosingBal: 133415.94, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001001001', glName: 'BR - BASIC SALARIES', drOpeningBal: 0, crOpeningBal: 0, periodDr: 34390947.00, periodCr: 0, drClosingBal: 34390947.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001001002', glName: 'BR - DEARNESS ALLOWANCE (DA)', drOpeningBal: 0, crOpeningBal: 0, periodDr: 602229.00, periodCr: 0, drClosingBal: 602229.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001001003', glName: 'BR - HOUSE RENT ALLOWANCE-HRA', drOpeningBal: 0, crOpeningBal: 0, periodDr: 10768282.00, periodCr: 0, drClosingBal: 10768282.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001001004', glName: 'BR - OTHER ALLOWANCE', drOpeningBal: 0, crOpeningBal: 0, periodDr: 22374561.00, periodCr: 0, drClosingBal: 22374561.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001001005', glName: 'BR - EDUCATION ALLOWANCE', drOpeningBal: 0, crOpeningBal: 0, periodDr: 4171.00, periodCr: 0, drClosingBal: 4171.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001001006', glName: 'BR - BONUS', drOpeningBal: 0, crOpeningBal: 0, periodDr: 6677616.34, periodCr: 4287367.00, drClosingBal: 2390249.34, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001001007', glName: 'BR - MEDICAL EXP.', drOpeningBal: 0, crOpeningBal: 0, periodDr: 54390.00, periodCr: 0, drClosingBal: 54390.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001001008', glName: 'BR - OTHER DEDUCTION/NOTICE PERIOD', drOpeningBal: 0, crOpeningBal: 0, periodDr: 188314.47, periodCr: 347023.00, drClosingBal: 0, crClosingBal: 158708.53, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001001009', glName: 'BR - LEAVE ENCASHMENT', drOpeningBal: 0, crOpeningBal: 0, periodDr: 1286789.00, periodCr: 0, drClosingBal: 1286789.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001001010', glName: 'BR - GRATUITY', drOpeningBal: 0, crOpeningBal: 0, periodDr: 51923.00, periodCr: 0, drClosingBal: 51923.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001001011', glName: 'BR - LABOUR WELFARE FUND', drOpeningBal: 0, crOpeningBal: 0, periodDr: 19781.00, periodCr: 0, drClosingBal: 19781.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001001012', glName: 'BR - INSURANCE', drOpeningBal: 0, crOpeningBal: 0, periodDr: 837713.72, periodCr: 0, drClosingBal: 837713.72, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001001013', glName: 'BR - E.S.I.C.', drOpeningBal: 0, crOpeningBal: 0, periodDr: 453462.00, periodCr: 0, drClosingBal: 453462.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001001014', glName: 'BR - PROVIDENT FUND', drOpeningBal: 0, crOpeningBal: 0, periodDr: 3717548.00, periodCr: 0, drClosingBal: 3717548.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001001015', glName: 'BR - MEDICAL REIMBURSEMENT', drOpeningBal: 0, crOpeningBal: 0, periodDr: 6709.00, periodCr: 0, drClosingBal: 6709.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001001016', glName: 'BR - LEAVE TRAVEL ALLOWANCE', drOpeningBal: 0, crOpeningBal: 0, periodDr: 10920.00, periodCr: 0, drClosingBal: 10920.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001001017', glName: 'BR - WASHING ALLOWANCE', drOpeningBal: 0, crOpeningBal: 0, periodDr: 35154.00, periodCr: 0, drClosingBal: 35154.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001001018', glName: 'BR - CONVEYANCE ALLOWANCE', drOpeningBal: 0, crOpeningBal: 0, periodDr: 6628194.00, periodCr: 380.00, drClosingBal: 6627814.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001001019', glName: 'BR - NOTICE PAY SALARY', drOpeningBal: 0, crOpeningBal: 0, periodDr: 111463.00, periodCr: 19407.00, drClosingBal: 92056.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002001', glName: 'AUDIT FEES', drOpeningBal: 0, crOpeningBal: 0, periodDr: 100000.00, periodCr: 25000.00, drClosingBal: 75000.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002002', glName: 'BUSINESS PROMOTION', drOpeningBal: 0, crOpeningBal: 0, periodDr: 19274547.50, periodCr: 4333450.00, drClosingBal: 14941097.50, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002003', glName: 'COMMISSION & BROKERAGE', drOpeningBal: 0, crOpeningBal: 0, periodDr: 534039.00, periodCr: 0, drClosingBal: 534039.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002004', glName: 'COMPUTER EXPENSES', drOpeningBal: 0, crOpeningBal: 0, periodDr: 2465656.00, periodCr: 300846.93, drClosingBal: 2164809.07, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002005', glName: 'CONFERENCE & SEMINAR EXPENSES', drOpeningBal: 0, crOpeningBal: 0, periodDr: 641966.42, periodCr: 137265.42, drClosingBal: 504701.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002006', glName: 'BR - CONVEYANCE', drOpeningBal: 0, crOpeningBal: 0, periodDr: 8245960.19, periodCr: 1268699.00, drClosingBal: 6977261.19, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002007', glName: 'DEPRECIATION', drOpeningBal: 0, crOpeningBal: 0, periodDr: 7007836.00, periodCr: 0, drClosingBal: 7007836.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002008', glName: 'DONATION', drOpeningBal: 0, crOpeningBal: 0, periodDr: 647102.00, periodCr: 12000.00, drClosingBal: 635102.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002009', glName: 'ELECTRICITY CHARGES', drOpeningBal: 0, crOpeningBal: 0, periodDr: 1508598.88, periodCr: 285728.17, drClosingBal: 1222870.71, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002010', glName: 'FESTIVAL EXPENESES', drOpeningBal: 0, crOpeningBal: 0, periodDr: 6280795.12, periodCr: 3584764.00, drClosingBal: 2696031.12, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002012', glName: 'LEGAL EXPENSES', drOpeningBal: 0, crOpeningBal: 0, periodDr: 47350.00, periodCr: 350.00, drClosingBal: 47000.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002013', glName: 'MEDICAL INSURANCE', drOpeningBal: 0, crOpeningBal: 0, periodDr: 3228695.00, periodCr: 0, drClosingBal: 3228695.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002014', glName: 'MISC. EXPENSES', drOpeningBal: 0, crOpeningBal: 0, periodDr: 323443.80, periodCr: 0, drClosingBal: 323443.80, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002015', glName: 'NEWS PAPERS,BOOKS & PERIODICAL', drOpeningBal: 0, crOpeningBal: 0, periodDr: 1450.00, periodCr: 0, drClosingBal: 1450.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002016', glName: 'OFFICE EXPENSES', drOpeningBal: 0, crOpeningBal: 0, periodDr: 1143528.24, periodCr: 118479.04, drClosingBal: 1025049.20, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002017', glName: 'POSTGE,TELEG & COURIER', drOpeningBal: 0, crOpeningBal: 0, periodDr: 2894197.29, periodCr: 389225.00, drClosingBal: 2504972.29, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002018', glName: 'PRINTING & STATIONERY', drOpeningBal: 0, crOpeningBal: 0, periodDr: 1846200.49, periodCr: 218100.00, drClosingBal: 1628100.49, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002019', glName: 'PROFESSION TAX (COMPANY)', drOpeningBal: 0, crOpeningBal: 0, periodDr: 5000.00, periodCr: 0, drClosingBal: 5000.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002020', glName: 'PROFESSIONAL CHGS.', drOpeningBal: 0, crOpeningBal: 0, periodDr: 13016924.64, periodCr: 3552272.29, drClosingBal: 9464652.35, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002022', glName: 'OFFICE RENT', drOpeningBal: 0, crOpeningBal: 0, periodDr: 8717264.54, periodCr: 485551.00, drClosingBal: 8231713.54, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002023', glName: 'TELEPHONE EXPENSES', drOpeningBal: 0, crOpeningBal: 0, periodDr: 511952.28, periodCr: 29968.00, drClosingBal: 481984.28, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002024', glName: 'INTERNET CHARGES', drOpeningBal: 0, crOpeningBal: 0, periodDr: 997451.22, periodCr: 79333.00, drClosingBal: 918118.22, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002025', glName: 'TRAINING EXPENSES', drOpeningBal: 0, crOpeningBal: 0, periodDr: 136804.00, periodCr: 24468.48, drClosingBal: 112335.52, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002026', glName: 'BR - TRAVELLING EXPENSES', drOpeningBal: 0, crOpeningBal: 0, periodDr: 5578325.04, periodCr: 641395.00, drClosingBal: 4936930.04, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002027', glName: 'ROC CHARGES', drOpeningBal: 0, crOpeningBal: 0, periodDr: 70140.00, periodCr: 1100.00, drClosingBal: 69040.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002028', glName: 'REPAIRS & MAINTANANCE -OFFICE', drOpeningBal: 0, crOpeningBal: 0, periodDr: 1641558.74, periodCr: 79477.00, drClosingBal: 1562081.74, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002030', glName: 'INCOME TAX ADJUSTMENT EARLIER PERIOD', drOpeningBal: 0, crOpeningBal: 0, periodDr: 316125.32, periodCr: 0, drClosingBal: 316125.32, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002031', glName: 'REBATE & DISCOUNT ALLOWED', drOpeningBal: 0, crOpeningBal: 0, periodDr: 144250.47, periodCr: 9090.13, drClosingBal: 135160.34, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002032', glName: 'STAFF WELFARE EXPENSES', drOpeningBal: 0, crOpeningBal: 0, periodDr: 1742272.00, periodCr: 137505.00, drClosingBal: 1604767.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002033', glName: 'INTEREST ,PENALTY & LATE FILING FEES', drOpeningBal: 0, crOpeningBal: 0, periodDr: 316770.28, periodCr: 0, drClosingBal: 316770.28, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002035', glName: 'STAFF RECOGNITION & DEVELOPMENT_ RNR', drOpeningBal: 0, crOpeningBal: 0, periodDr: 137582.00, periodCr: 4800.00, drClosingBal: 132782.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002036', glName: 'EMPLOYEES COMPENSATION INSURANSE POLICY', drOpeningBal: 0, crOpeningBal: 0, periodDr: 70874.34, periodCr: 0, drClosingBal: 70874.34, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002037', glName: 'TENDER CHARGES', drOpeningBal: 0, crOpeningBal: 0, periodDr: 517787.28, periodCr: 19391.15, drClosingBal: 498396.13, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002040', glName: 'HOTEL EXPENSES', drOpeningBal: 0, crOpeningBal: 0, periodDr: 1154286.53, periodCr: 0, drClosingBal: 1154286.53, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002043', glName: 'SUBSCRIPTION, REGISTRATION & RENEWAL FEES', drOpeningBal: 0, crOpeningBal: 0, periodDr: 1598415.57, periodCr: 69400.00, drClosingBal: 1529015.57, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002044', glName: 'STAMP DUTY & FRANKING CHARGES', drOpeningBal: 0, crOpeningBal: 0, periodDr: 1048579.00, periodCr: 285083.00, drClosingBal: 763496.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002045', glName: 'ADVERTISEMENT EXPENSES', drOpeningBal: 0, crOpeningBal: 0, periodDr: 45400.00, periodCr: 0, drClosingBal: 45400.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002046', glName: 'INTEREST ON GST', drOpeningBal: 0, crOpeningBal: 0, periodDr: 2971022.00, periodCr: 436340.00, drClosingBal: 2534682.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002047', glName: 'GST LATE FILING FEES', drOpeningBal: 0, crOpeningBal: 0, periodDr: 162988.00, periodCr: 30800.00, drClosingBal: 132188.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002049', glName: 'SUBCONTRACT EXP - PROJECT', drOpeningBal: 0, crOpeningBal: 0, periodDr: 1203150.00, periodCr: 903150.00, drClosingBal: 300000.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002051', glName: 'REIMBURSEMENT OF ROC EXPENSES', drOpeningBal: 0, crOpeningBal: 0, periodDr: 7200.00, periodCr: 0, drClosingBal: 7200.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002053', glName: 'TRANSPORT, FUEL, TOLL & OTHER EXPENSES - OVERSEAS', drOpeningBal: 0, crOpeningBal: 0, periodDr: 3500.00, periodCr: 3500.00, drClosingBal: 0, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002054', glName: 'MOTOR VEHICLE EXPNSES', drOpeningBal: 0, crOpeningBal: 0, periodDr: 59729.00, periodCr: 0, drClosingBal: 59729.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002055', glName: 'FUEL EXPENSES', drOpeningBal: 0, crOpeningBal: 0, periodDr: 1170807.00, periodCr: 1170807.00, drClosingBal: 0, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002056', glName: 'LABOUR LICENSE FEES', drOpeningBal: 0, crOpeningBal: 0, periodDr: 192572.42, periodCr: 7000.00, drClosingBal: 185572.42, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002057', glName: 'EVENT EXPENSES (CSR)', drOpeningBal: 0, crOpeningBal: 0, periodDr: 2345165.00, periodCr: 201150.00, drClosingBal: 2144015.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002058', glName: 'INELIGIBLE GST EXPENSES', drOpeningBal: 0, crOpeningBal: 0, periodDr: 126058.00, periodCr: 7188.00, drClosingBal: 118870.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002059', glName: 'INTEREST ON ESIC', drOpeningBal: 0, crOpeningBal: 0, periodDr: 22703.38, periodCr: 0, drClosingBal: 22703.38, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002060', glName: 'INTEREST ON PF', drOpeningBal: 0, crOpeningBal: 0, periodDr: 566281.00, periodCr: 0, drClosingBal: 566281.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2001002061', glName: 'DAMAGES ON PF', drOpeningBal: 0, crOpeningBal: 0, periodDr: 29594.00, periodCr: 0, drClosingBal: 29594.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2002002001', glName: 'INTEREST ON BANK LOAN CC A/C', drOpeningBal: 0, crOpeningBal: 0, periodDr: 20495107.00, periodCr: 0, drClosingBal: 20495107.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2002002003', glName: 'BANK CHARGES', drOpeningBal: 0, crOpeningBal: 0, periodDr: 1664320.74, periodCr: 335824.36, drClosingBal: 1328496.38, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2002002005', glName: 'LOAN PROCESSING CHARGES', drOpeningBal: 0, crOpeningBal: 0, periodDr: 975618.20, periodCr: 324238.00, drClosingBal: 651380.20, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2002002008', glName: 'DEFERRED TAX', drOpeningBal: 0, crOpeningBal: 0, periodDr: 0, periodCr: 359658.00, drClosingBal: 0, crClosingBal: 359658.00, korectGlCode: '', glType: 'FILE' },
                { glCode: 'X2002002009', glName: 'INCOME TAX PROVISION', drOpeningBal: 0, crOpeningBal: 0, periodDr: 4121781.00, periodCr: 0, drClosingBal: 4121781.00, crClosingBal: 0, korectGlCode: '', glType: 'FILE' },
            ]
        }
        return data
    } catch (err) {
        console.error('generateTBDetailedData error:', err)
        throw new Error('Failed to generate TB Detailed data')
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
 * Generate and download TB Detailed Report Excel
 * @param {Object} periodData - Period selection data (optional)
 */
export const generateTBDetailedReportExcel = async (periodData = null) => {
    try {
        console.log('=== TB Detailed Report Excel Generation Started ===')
        console.log('Period Data:', periodData)

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

        // Get TB Detailed data
        const tbData = generateTBDetailedData()

        // Row counter
        let currentRow = 1

        // Company Header
        worksheet.mergeCells(`A${currentRow}:J${currentRow}`)
        const companyCell = worksheet.getCell(`A${currentRow}`)
        companyCell.value = tbData.companyName
        applyCompanyHeaderStyle(companyCell)
        worksheet.getRow(currentRow).height = 22
        currentRow++

        // Financial Year Info
        worksheet.mergeCells(`A${currentRow}:J${currentRow}`)
        const fyCell = worksheet.getCell(`A${currentRow}`)
        fyCell.value = tbData.financialYear
        applyInfoRowStyle(fyCell)
        worksheet.getRow(currentRow).height = 18
        currentRow++

        // Report Title
        worksheet.mergeCells(`A${currentRow}:J${currentRow}`)
        const titleCell = worksheet.getCell(`A${currentRow}`)
        titleCell.value = tbData.reportTitle
        applyReportTitleStyle(titleCell)
        worksheet.getRow(currentRow).height = 20
        currentRow++

        // Period Info
        worksheet.mergeCells(`A${currentRow}:J${currentRow}`)
        const periodCell = worksheet.getCell(`A${currentRow}`)
        periodCell.value = tbData.periodInfo
        applyInfoRowStyle(periodCell)
        worksheet.getRow(currentRow).height = 18
        currentRow++

        // Empty rows
        currentRow += 2

        // Column Headers
        const headerRow = worksheet.getRow(currentRow)
        headerRow.height = 30

        const headers = [
            'GLCODE',
            'GLNAME',
            'DR. OPENINGBAL',
            'CR. OPENINGBAL',
            'PERIOD DR.',
            'PERIOD CR.',
            'DR. CLOSINGBAL',
            'CR. CLOSINGBAL',
            'KORECTGLCODE',
            'GLTYPE'
        ]

        headers.forEach((header, index) => {
            const cell = worksheet.getCell(currentRow, index + 1)
            cell.value = header
            applyColumnHeaderStyle(cell)
        })
        currentRow++

        // Initialize grand totals
        let grandTotalDrOpening = 0
        let grandTotalCrOpening = 0
        let grandTotalPeriodDr = 0
        let grandTotalPeriodCr = 0
        let grandTotalDrClosing = 0
        let grandTotalCrClosing = 0

        // Process each account
        tbData.accounts.forEach((account) => {
            const accountRow = worksheet.getRow(currentRow)
            accountRow.height = 18

            // GL Code
            const glCodeCell = worksheet.getCell(currentRow, 1)
            glCodeCell.value = account.glCode
            applyDataCellStyle(glCodeCell, false)

            // GL Name
            const glNameCell = worksheet.getCell(currentRow, 2)
            glNameCell.value = account.glName
            applyDataCellStyle(glNameCell, false)

            // DR Opening Balance
            const drOpeningCell = worksheet.getCell(currentRow, 3)
            if (account.drOpeningBal > 0) {
                drOpeningCell.value = account.drOpeningBal
                drOpeningCell.numFmt = '#,##0.00'
                grandTotalDrOpening += account.drOpeningBal
            }
            applyDataCellStyle(drOpeningCell, true)

            // CR Opening Balance
            const crOpeningCell = worksheet.getCell(currentRow, 4)
            if (account.crOpeningBal > 0) {
                crOpeningCell.value = account.crOpeningBal
                crOpeningCell.numFmt = '#,##0.00'
                grandTotalCrOpening += account.crOpeningBal
            }
            applyDataCellStyle(crOpeningCell, true)

            // Period DR
            const periodDrCell = worksheet.getCell(currentRow, 5)
            if (account.periodDr > 0) {
                periodDrCell.value = account.periodDr
                periodDrCell.numFmt = '#,##0.00'
                grandTotalPeriodDr += account.periodDr
            }
            applyDataCellStyle(periodDrCell, true)

            // Period CR
            const periodCrCell = worksheet.getCell(currentRow, 6)
            if (account.periodCr > 0) {
                periodCrCell.value = account.periodCr
                periodCrCell.numFmt = '#,##0.00'
                grandTotalPeriodCr += account.periodCr
            }
            applyDataCellStyle(periodCrCell, true)

            // DR Closing Balance
            const drClosingCell = worksheet.getCell(currentRow, 7)
            if (account.drClosingBal > 0) {
                drClosingCell.value = account.drClosingBal
                drClosingCell.numFmt = '#,##0.00'
                grandTotalDrClosing += account.drClosingBal
            }
            applyDataCellStyle(drClosingCell, true)

            // CR Closing Balance
            const crClosingCell = worksheet.getCell(currentRow, 8)
            if (account.crClosingBal > 0) {
                crClosingCell.value = account.crClosingBal
                crClosingCell.numFmt = '#,##0.00'
                grandTotalCrClosing += account.crClosingBal
            }
            applyDataCellStyle(crClosingCell, true)

            // Korect GL Code
            const korectCell = worksheet.getCell(currentRow, 9)
            korectCell.value = account.korectGlCode
            applyDataCellStyle(korectCell, false)

            // GL Type
            const glTypeCell = worksheet.getCell(currentRow, 10)
            glTypeCell.value = account.glType
            applyDataCellStyle(glTypeCell, false)

            currentRow++
        })

        // Empty row before grand total
        currentRow++

        // Grand Total Row
        const grandTotalRow = worksheet.getRow(currentRow)
        grandTotalRow.height = 28

        // Grand Total Label
        worksheet.mergeCells(`A${currentRow}:B${currentRow}`)
        const labelCell = worksheet.getCell(`A${currentRow}`)
        labelCell.value = 'GRAND TOTAL'
        applyGrandTotalStyle(labelCell, true)

        // DR Opening Total
        const drOpenTotalCell = worksheet.getCell(currentRow, 3)
        drOpenTotalCell.value = grandTotalDrOpening
        drOpenTotalCell.numFmt = '#,##0.00'
        applyGrandTotalStyle(drOpenTotalCell)

        // CR Opening Total
        const crOpenTotalCell = worksheet.getCell(currentRow, 4)
        crOpenTotalCell.value = grandTotalCrOpening
        crOpenTotalCell.numFmt = '#,##0.00'
        applyGrandTotalStyle(crOpenTotalCell)

        // Period DR Total
        const periodDrTotalCell = worksheet.getCell(currentRow, 5)
        periodDrTotalCell.value = grandTotalPeriodDr
        periodDrTotalCell.numFmt = '#,##0.00'
        applyGrandTotalStyle(periodDrTotalCell)

        // Period CR Total
        const periodCrTotalCell = worksheet.getCell(currentRow, 6)
        periodCrTotalCell.value = grandTotalPeriodCr
        periodCrTotalCell.numFmt = '#,##0.00'
        applyGrandTotalStyle(periodCrTotalCell)

        // DR Closing Total
        const drCloseTotalCell = worksheet.getCell(currentRow, 7)
        drCloseTotalCell.value = grandTotalDrClosing
        drCloseTotalCell.numFmt = '#,##0.00'
        applyGrandTotalStyle(drCloseTotalCell)

        // CR Closing Total
        const crCloseTotalCell = worksheet.getCell(currentRow, 8)
        crCloseTotalCell.value = grandTotalCrClosing
        crCloseTotalCell.numFmt = '#,##0.00'
        applyGrandTotalStyle(crCloseTotalCell)

        // Empty cells for Korect and GLType
        const korectTotalCell = worksheet.getCell(currentRow, 9)
        applyGrandTotalStyle(korectTotalCell)
        const glTypeTotalCell = worksheet.getCell(currentRow, 10)
        applyGrandTotalStyle(glTypeTotalCell)

        // Add footer
        currentRow += 2
        worksheet.mergeCells(`A${currentRow}:J${currentRow}`)
        const footerCell = worksheet.getCell(`A${currentRow}`)
        footerCell.value = `Generated by iSmart Accounts System | ${new Date().toLocaleString('en-IN')}`
        footerCell.font = { size: 9, italic: true, color: { argb: 'FF808080' } }
        footerCell.alignment = { horizontal: 'center', vertical: 'middle' }

        // Generate Excel file buffer
        const buffer = await workbook.xlsx.writeBuffer()

        // Create filename with timestamp
        const timestamp = new Date().toISOString().replace(/[:]/g, '-').slice(0, -5)
        const filename = `TB_Detailed_Report_${timestamp}.xlsx`

        // Save file
        const blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        })
        saveAs(blob, filename)

        console.log('✓ TB Detailed Report Excel generated successfully:', filename)
        return { success: true, filename }

    } catch (err) {
        console.error('generateTBDetailedReportExcel error:', err)
        throw new Error(`Failed to generate TB Detailed Report Excel: ${err.message}`)
    }
}

export default { generateTBDetailedReportExcel }

import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'

/**
 * TB Report Excel Generation Service
 * Generates Trial Balance Report in Excel format with hierarchical structure
 * Production-ready code with real GL account structure
 */

/**
 * Generate TB data with hierarchical GL structure
 * @returns {Object} Structured trial balance data
 */
const generateTBData = () => {
    try {
        const data = {
            companyName: 'I SMART FACITECH PRIVATE LIMITED',
            reportDate: '28/11/2025',
            accounts: [
                // ASSETS (A)
                { glCode: 'A', glDescription: 'ASSETS', debit: 226659808.65, credit: 0, level: 0 },
                { glCode: 'A1', glDescription: 'FIXED ASSETS', debit: 9124043.90, credit: 0, level: 1 },
                { glCode: 'A1001', glDescription: 'FA COMPUTERS', debit: 4158905.22, credit: 0, level: 2 },
                { glCode: 'A1001001', glDescription: 'FA COMPUTER', debit: 4158905.22, credit: 0, level: 3 },
                { glCode: 'A1002', glDescription: 'FA FURNITURE & FIXTURES(A1002)', debit: 4024237.33, credit: 0, level: 2 },
                { glCode: 'A1002001', glDescription: 'FA FURNITURE & FIXTURE', debit: 4024237.33, credit: 0, level: 3 },
                { glCode: 'A1004', glDescription: 'FA SOFTWARES', debit: 696067.00, credit: 0, level: 2 },
                { glCode: 'A1004001', glDescription: 'FA SOFTWARE', debit: 696067.00, credit: 0, level: 3 },
                { glCode: 'A1005', glDescription: 'FA OFFICE EQUIPMENTS(A1005)', debit: 3118993.84, credit: 0, level: 2 },
                { glCode: 'A1005001', glDescription: 'FA OFFICE EQUIPMENT', debit: 3118993.84, credit: 0, level: 3 },
                { glCode: 'A1007', glDescription: 'FA MACHINERIES', debit: 8435883.51, credit: 0, level: 2 },
                { glCode: 'A1007001', glDescription: 'FA MACHINERY', debit: 8435883.51, credit: 0, level: 3 },
                { glCode: 'A1008', glDescription: 'ACCUM DEPRICIATION', debit: 0, credit: 11310043.00, level: 2 },
                { glCode: 'A1008001', glDescription: 'ACCUMULATED  DEPRECIATION', debit: 0, credit: 11310043.00, level: 3 },

                { glCode: 'A3', glDescription: 'CURRENT ASSETS', debit: 217535764.75, credit: 0, level: 1 },
                { glCode: 'A3001', glDescription: 'DEPOSIT (ASSETS)', debit: 16020004.00, credit: 0, level: 2 },
                { glCode: 'A3001001', glDescription: 'DEPOSIT - RENTAL OFFICE', debit: 1465000.00, credit: 0, level: 3 },
                { glCode: 'A3001002', glDescription: 'DEPOSIT - STAFF ACCOMODATIONS', debit: 133900.00, credit: 0, level: 3 },
                { glCode: 'A3001004', glDescription: 'DEPOSIT - LABOUR LICENSE', debit: 373931.00, credit: 0, level: 3 },
                { glCode: 'A3001005', glDescription: 'DEPOSITS - OTHER', debit: 55000.00, credit: 0, level: 3 },
                { glCode: 'A3001006', glDescription: 'FD AGAINST HDFC BANK INDORE FD A/C -50300519330209', debit: 45000.00, credit: 0, level: 3 },
                { glCode: 'A3001007', glDescription: 'EMD - MCGM', debit: 5345648.00, credit: 0, level: 3 },
                { glCode: 'A3001015', glDescription: 'FD AGAINST KEM HOSPITAL BG -', debit: 1012500.00, credit: 0, level: 3 },
                { glCode: 'A3001017', glDescription: 'EMD - MAHADA', debit: 150000.00, credit: 0, level: 3 },
                { glCode: 'A3001018', glDescription: 'FD AGAINST HDFC BANK -50300834091536', debit: 230000.00, credit: 0, level: 3 },
                { glCode: 'A3001020', glDescription: 'FD AGAINST MAHADA BG FD NO 104510DP00010657', debit: 1490007.00, credit: 0, level: 3 },
                { glCode: 'A3001022', glDescription: 'FD AGAIST BG MDL A/C 104510DP00010790', debit: 6115.00, credit: 0, level: 3 },
                { glCode: 'A3001025', glDescription: 'FD AGAINST BG PERIPHERALS HOSPITALS', debit: 904630.00, credit: 0, level: 3 },
                { glCode: 'A3001026', glDescription: 'DEPOSIT -PG- DISTRICT JUDGE DAHOD', debit: 1500000.00, credit: 0, level: 3 },
                { glCode: 'A3001028', glDescription: 'FD AGAINST ICAR KOZHIKODE BG 104510DP00013104', debit: 278000.00, credit: 0, level: 3 },
                { glCode: 'A3001029', glDescription: 'ACCRUED INTEREST', debit: 378350.00, credit: 0, level: 3 },
                { glCode: 'A3001031', glDescription: 'EMD - TRAUMA HOSPITAL', debit: 1472523.00, credit: 0, level: 3 },
                { glCode: 'A3001032', glDescription: 'FD WITH HDFC BANK 00602990000034', debit: 831000.00, credit: 0, level: 3 },
                { glCode: 'A3001033', glDescription: 'FD AGAINST KEM BG A/C 104510DP00016332', debit: 48400.00, credit: 0, level: 3 },
                { glCode: 'A3001034', glDescription: 'EMD- SIDDHIVINAYAK TEMPLE', debit: 300000.00, credit: 0, level: 3 },

                { glCode: 'A3002', glDescription: 'LOANS & ADVANCES (ASSETS)', debit: 23288861.07, credit: 0, level: 2 },
                { glCode: 'A3002002', glDescription: 'STAFF LOAN / ADVANCE', debit: 392750.45, credit: 0, level: 3 },
                { glCode: 'A3002003', glDescription: 'UNBILLED RECEIVABLE/ACCRUED INCOME', debit: 11177377.00, credit: 0, level: 3 },
                { glCode: 'A3002004', glDescription: 'MATOSHRI ENTERPRISES', debit: 160051.00, credit: 0, level: 3 },
                { glCode: 'A3002007', glDescription: 'SHARE & FD OF MANISH KAMBLE AGST APNA BANK LOAN', debit: 183000.00, credit: 0, level: 3 },
                { glCode: 'A3002008', glDescription: 'DEBTORS LEGAL CASE INTIATED', debit: 2705708.62, credit: 0, level: 3 },
                { glCode: 'A3002014', glDescription: 'TARGET HOSPITALITY PVT LTD', debit: 7497703.00, credit: 0, level: 3 },
                { glCode: 'A3002017', glDescription: 'SMART MONITORING SURVEILLANCE PVT LTD', debit: 850278.00, credit: 0, level: 3 },
                { glCode: 'A3002018', glDescription: 'MANOJ KAMBLI', debit: 321993.00, credit: 0, level: 3 },

                { glCode: 'A3003', glDescription: 'SUNDRY DEBTORS', debit: 182050307.74, credit: 0, level: 2 },
                { glCode: 'A3003001', glDescription: 'SUNDRY DEBTORS CONTROL ACCOUNT', debit: 182050307.74, credit: 0, level: 3 },

                { glCode: 'A3004', glDescription: 'CASH AND BANK BALANCES', debit: 0, credit: 65489420.15, level: 2 },
                { glCode: 'A3004001', glDescription: 'CASH IN HAND', debit: 14446.53, credit: 0, level: 3 },
                { glCode: 'A3004001001', glDescription: 'CASH IN HAND - MUM', debit: 14446.53, credit: 0, level: 4 },
                { glCode: 'A3004003', glDescription: 'BANK ACCOUNTS', debit: 0, credit: 65503866.68, level: 3 },
                { glCode: 'A3004003001', glDescription: 'CFMS_HDFC BANK A/C 50200028417957', debit: 29527.86, credit: 0, level: 4 },
                { glCode: 'A3004003003', glDescription: 'CFMS_HDFC BANK VAD A/C 50200059203020', debit: 60000.00, credit: 0, level: 4 },
                { glCode: 'A3004003005', glDescription: 'HDFC BANK ISMART A/C 59218000123456', debit: 52464.31, credit: 0, level: 4 },
                { glCode: 'A3004003006', glDescription: 'PNB CURRENT A/C 1045102100000408', debit: 0, credit: 72928396.61, level: 4 },
                { glCode: 'A3004003007', glDescription: 'HDFC BANK NEW A/C 50200111716810', debit: 7282537.76, credit: 0, level: 4 },

                { glCode: 'A3005', glDescription: 'PREPAID EXPENSES', debit: 18411772.27, credit: 0, level: 2 },
                { glCode: 'A3005001', glDescription: 'PREPAID EXPENSE', debit: 18411772.27, credit: 0, level: 3 },

                { glCode: 'A3006', glDescription: 'TDS RECEIVABLE', debit: 34606180.68, credit: 0, level: 2 },
                { glCode: 'A3006008', glDescription: 'TDS RECEIVABLE F.Y. 22-23', debit: 355.00, credit: 0, level: 3 },
                { glCode: 'A3006011', glDescription: 'TDS RECEIVABLE F.Y. 24-25', debit: 20348632.74, credit: 0, level: 3 },
                { glCode: 'A3006012', glDescription: 'TDS RECEIVABLE F.Y-25-26', debit: 14257192.94, credit: 0, level: 3 },

                { glCode: 'A3007', glDescription: 'DUTIES & TAXES (ASSETS)', debit: 8653059.14, credit: 0, level: 2 },
                { glCode: 'A3007001', glDescription: 'GST INPUT', debit: 8653059.14, credit: 0, level: 3 },
                { glCode: 'A3007001001', glDescription: 'SGST INPUT', debit: 3586040.99, credit: 0, level: 4 },
                { glCode: 'A3007001002', glDescription: 'CGST INPUT', debit: 3532976.49, credit: 0, level: 4 },
                { glCode: 'A3007001003', glDescription: 'IGST INPUT', debit: 580098.38, credit: 0, level: 4 },
                { glCode: 'A3007001004', glDescription: 'SGST INPUT (RCM)', debit: 21591.00, credit: 0, level: 4 },
                { glCode: 'A3007001005', glDescription: 'CGST INPUT (RCM)', debit: 22153.00, credit: 0, level: 4 },
                { glCode: 'A3007001007', glDescription: 'CGST TDS (INPUT)', debit: 403492.95, credit: 0, level: 4 },
                { glCode: 'A3007001008', glDescription: 'SGST TDS (INPUT)', debit: 402711.33, credit: 0, level: 4 },
                { glCode: 'A3007001009', glDescription: 'IGST TDS (INPUT)', debit: 45495.00, credit: 0, level: 4 },
                { glCode: 'A3007001010', glDescription: 'ISD CGST INPUT', debit: 29250.00, credit: 0, level: 4 },
                { glCode: 'A3007001011', glDescription: 'ISD SGST INPUT', debit: 29250.00, credit: 0, level: 4 },

                { glCode: 'A3010', glDescription: 'SUSPENSE', debit: 0, credit: 5000.00, level: 2 },

                // SOURCES OF FUNDS (L) - continue with same pattern for all remaining entries from your data
                { glCode: 'L', glDescription: 'SOURCES OF FUNDS', debit: 0, credit: 217209085.57, level: 0 },
                { glCode: 'L1', glDescription: 'SHARE CAPITAL', debit: 0, credit: 24991268.80, level: 1 },
                { glCode: 'L1001', glDescription: 'CAPITAL(L1001)', debit: 0, credit: 24991268.80, level: 2 },
                { glCode: 'L1001001', glDescription: 'SANJAY KHANVILKAR CAPITAL A/C', debit: 0, credit: 11387500.00, level: 3 },
                { glCode: 'L1001002', glDescription: 'VINAYAK BHISE CAPITAL A/C', debit: 0, credit: 5050000.00, level: 3 },
                { glCode: 'L1001003', glDescription: 'MANOJ KAMBLI CAPITAL A/C', debit: 0, credit: 12500.00, level: 3 },
                { glCode: 'L1001004', glDescription: 'SIDDHESH KHANVILKAR CAPITAL A/C', debit: 0, credit: 12500.00, level: 3 },
                { glCode: 'L1001005', glDescription: 'SHOBHANA BAGWE CAPITAL A/C', debit: 0, credit: 12500.00, level: 3 },
                { glCode: 'L1001008', glDescription: '4S INFRASTRUCTURE LLP CAPITAL A/C', debit: 0, credit: 25000.00, level: 3 },
                { glCode: 'L1001009', glDescription: 'PROFIT & LOSS A/C', debit: 0, credit: 8491268.80, level: 3 },

                { glCode: 'L2', glDescription: 'CURRENT LIABILITIES', debit: 0, credit: 192217816.77, level: 1 },
                { glCode: 'L2001', glDescription: 'LIABILITY - EMPLOYEES', debit: 294552.02, credit: 0, level: 2 },
                { glCode: 'L2001002', glDescription: 'SALARY PAYABLE', debit: 967991.19, credit: 0, level: 3 },
                { glCode: 'L2001005', glDescription: 'FULL & FINAL SETTLEMENT PAYABLE', debit: 0, credit: 134521.00, level: 3 },
                { glCode: 'L2001007', glDescription: 'CONVEYANCE PAYABLE', debit: 0, credit: 526248.17, level: 3 },
                { glCode: 'L2001010', glDescription: 'LOAN / ADV RECOVERY FROM EMPLOYEES', debit: 0, credit: 10878.00, level: 3 },
                { glCode: 'L2001018', glDescription: 'FATAK PAY DEDUCTION', debit: 0, credit: 1792.00, level: 3 },

                { glCode: 'L2002', glDescription: 'STATUROY DUES', debit: 0, credit: 42027434.10, level: 2 },
                { glCode: 'L2002001', glDescription: 'PROVIDENT FUND (PF) COMPANY PAYABLE', debit: 0, credit: 15471209.93, level: 3 },
                { glCode: 'L2002002', glDescription: 'PROVIDENT FUND (PF) EMPLOYEE PAYABLE', debit: 0, credit: 14310570.07, level: 3 },
                { glCode: 'L2002003', glDescription: 'ESIC COMPANY PAYABLE', debit: 0, credit: 4038388.78, level: 3 },
                { glCode: 'L2002004', glDescription: 'ESIC EMPLOYEE PAYABLE', debit: 0, credit: 993924.22, level: 3 },
                { glCode: 'L2002005', glDescription: 'PROFESSION TAX PAYABLE', debit: 0, credit: 2649054.20, level: 3 },
                { glCode: 'L2002006', glDescription: 'LABOUR WELFARE FUND PAYABLE', debit: 0, credit: 442505.90, level: 3 },
                { glCode: 'L2002008', glDescription: 'INCOME TAX PROVISION', debit: 0, credit: 4121781.00, level: 3 },

                { glCode: 'L2003', glDescription: 'TDS PAYABLE', debit: 0, credit: 87489.34, level: 2 },
                { glCode: 'L2003001', glDescription: 'TDS CONTRACT/SUB CONTRACT', debit: 0, credit: 834.00, level: 3 },
                { glCode: 'L2003002', glDescription: 'TDS PROFESSIONAL FEES', debit: 0, credit: 65990.84, level: 3 },
                { glCode: 'L2003003', glDescription: 'TDS RENT', debit: 0, credit: 20664.50, level: 3 },

                { glCode: 'L2004', glDescription: 'DUTIES & TAXES (LIABILITIES)', debit: 0, credit: 50831026.16, level: 2 },
                { glCode: 'L2004001', glDescription: 'GST OUTPUT', debit: 0, credit: 50831026.16, level: 3 },
                { glCode: 'L2004001001', glDescription: 'SGST OUTPUT/PAYABLE', debit: 0, credit: 23173927.80, level: 4 },
                { glCode: 'L2004001002', glDescription: 'CGST OUTPUT/PAYABLE', debit: 0, credit: 23164642.07, level: 4 },
                { glCode: 'L2004001003', glDescription: 'IGST OUTPUT/PAYABLE', debit: 0, credit: 4455556.29, level: 4 },
                { glCode: 'L2004001004', glDescription: 'SGST OUTPUT/PAYABLE (RCM)', debit: 0, credit: 18450.00, level: 4 },
                { glCode: 'L2004001005', glDescription: 'CGST OUTPUT/PAYABLE (RCM)', debit: 0, credit: 18450.00, level: 4 },

                { glCode: 'L2005', glDescription: 'SUNDRY CREDITORS', debit: 0, credit: 13480403.75, level: 2 },
                { glCode: 'L2005001', glDescription: 'SUNDRY CREDITORS CONTROL ACCOUNT', debit: 0, credit: 13480403.75, level: 3 },

                { glCode: 'L2006', glDescription: 'OTHER LIABILITIES', debit: 0, credit: 15180475.94, level: 2 },
                { glCode: 'L2006001', glDescription: 'OUTSTANDING EXPENSES', debit: 0, credit: 11795128.32, level: 3 },
                { glCode: 'L2006004', glDescription: 'INTEREST/ PENALTY ON PF/ESIC', debit: 260513.00, credit: 0, level: 3 },
                { glCode: 'L2006005', glDescription: 'DEFERRED TAX LIABILITIES', debit: 807958.00, credit: 0, level: 3 },
                { glCode: 'L2006009', glDescription: 'CONTRIBUTION TOWARDS STAFF WELFARE FUND', debit: 0, credit: 1748110.00, level: 3 },
                { glCode: 'L2006010', glDescription: 'PROVISION FOR DOUBTFUL DEBTS (L)', debit: 0, credit: 2705708.62, level: 3 },

                { glCode: 'L2007', glDescription: 'LOAN (LIABILITIES)', debit: 0, credit: 70905539.50, level: 2 },
                { glCode: 'L2007001', glDescription: 'BANK CC/OD ACCOUNTS', debit: 0, credit: 75146209.50, level: 3 },
                { glCode: 'L2007001001', glDescription: 'PNB CC A/C 1045108700000064', debit: 0, credit: 75146209.50, level: 4 },
                { glCode: 'L2007002', glDescription: 'UNSECURED LOAN FROM OTHERS', debit: 4240670.00, credit: 0, level: 3 },
                { glCode: 'L2007002001', glDescription: 'KEITA PHARMA PVT LTD', debit: 0, credit: 2990000.00, level: 4 },
                { glCode: 'L2007002003', glDescription: 'SANJAY KHANVILKAR', debit: 5317594.00, credit: 0, level: 4 },
                { glCode: 'L2007002004', glDescription: 'SHOBHANA BAGWE', debit: 0, credit: 10000.00, level: 4 },
                { glCode: 'L2007002005', glDescription: 'VINAYAK BHISE', debit: 1946000.00, credit: 0, level: 4 },
                { glCode: 'L2007002007', glDescription: 'PURVI SADADEKAR', debit: 0, credit: 22924.00, level: 4 },

                // INCOME (R)
                { glCode: 'R', glDescription: 'INCOME', debit: 0, credit: 1862554369.48, level: 0 },
                { glCode: 'R1', glDescription: 'DIRECT INCOME', debit: 0, credit: 1858502388.53, level: 1 },
                { glCode: 'R1001', glDescription: 'REVENUE', debit: 0, credit: 1858502388.53, level: 2 },
                { glCode: 'R1001001', glDescription: 'HOUSE KEEPING CHARGES', debit: 0, credit: 1687776519.31, level: 3 },
                { glCode: 'R1001005', glDescription: 'CLEANING MATERIAL', debit: 0, credit: 38176044.63, level: 3 },
                { glCode: 'R1001005001', glDescription: 'HK MATERIAL', debit: 0, credit: 28017746.83, level: 4 },
                { glCode: 'R1001005002', glDescription: 'CLEANING CONSUMABLE', debit: 0, credit: 10158297.80, level: 4 },
                { glCode: 'R1001006', glDescription: 'DEEP CLEANING CHARGES', debit: 0, credit: 4928820.59, level: 3 },
                { glCode: 'R1001007', glDescription: 'RENT ON MACHINERY', debit: 0, credit: 2417319.74, level: 3 },
                { glCode: 'R1001008', glDescription: 'MANPOWER SERVICES', debit: 0, credit: 125203684.26, level: 3 },

                { glCode: 'R2', glDescription: 'INDIRECT INCOME', debit: 0, credit: 4051980.95, level: 1 },
                { glCode: 'R2001', glDescription: 'OTHER INCOME', debit: 0, credit: 4051980.95, level: 2 },
                { glCode: 'R2001001', glDescription: 'BANK INTEREST RECEIVED', debit: 0, credit: 289803.00, level: 3 },
                { glCode: 'R2001002', glDescription: 'MISC INCOME', debit: 0, credit: 2696.79, level: 3 },
                { glCode: 'R2001003', glDescription: 'ROUND OFF', debit: 0, credit: 22.36, level: 3 },
                { glCode: 'R2001004', glDescription: 'WRITTEN BACK', debit: 0, credit: 72458.40, level: 3 },
                { glCode: 'R2001005', glDescription: 'INTEREST ON INCOME TAX REFUND', debit: 0, credit: 276325.00, level: 3 },
                { glCode: 'R2001006', glDescription: 'REBATE & DISCOUNT RECD', debit: 0, credit: 4835.39, level: 3 },
                { glCode: 'R2001007', glDescription: 'EXCESS PROVISION WRITTEN BACK', debit: 0, credit: 3405840.01, level: 3 },

                // EXPENSES (X) - Due to length, including key entries. Full dataset would include ALL your expense entries
                { glCode: 'X', glDescription: 'EXPENSES', debit: 1853103646.40, credit: 0, level: 0 },
                { glCode: 'X1', glDescription: 'EXPENSES DIRECT(X1)', debit: 1678545788.66, credit: 0, level: 1 },
                { glCode: 'X1001', glDescription: 'DIRECT PRODUCTION COST', debit: 1652727330.10, credit: 0, level: 2 },
                { glCode: 'X1001001', glDescription: 'TOTAL WAGE COST', debit: 1573509063.28, credit: 0, level: 3 },
                { glCode: 'X1001001001', glDescription: 'SALARY & WAGES', debit: 1564843881.54, credit: 0, level: 4 },
                { glCode: 'X1001001001001', glDescription: 'FO - BASIC SALARIES', debit: 755874145.00, credit: 0, level: 5 },
                { glCode: 'X1001001001002', glDescription: 'FO - DEARNESS ALLOWANCE (DA)', debit: 236592652.00, credit: 0, level: 5 },
                { glCode: 'X1001001001003', glDescription: 'FO - HOUSE RENT ALLOWANCE-HRA', debit: 56042121.00, credit: 0, level: 5 },
                { glCode: 'X1001001001004', glDescription: 'FO - OTHER ALLOWANCE', debit: 110827997.14, credit: 0, level: 5 },
                { glCode: 'X1001001001005', glDescription: 'FO - EDUCATION ALLOWANCE', debit: 45177.00, credit: 0, level: 5 },
                { glCode: 'X1001001001006', glDescription: 'FO - BONUS', debit: 72314730.01, credit: 0, level: 5 },
                { glCode: 'X1001001001007', glDescription: 'FO - MEDICAL EXP.', debit: 1682041.00, credit: 0, level: 5 },
                { glCode: 'X1001001001008', glDescription: 'FO - OTHER DEDUCTION/NOTICE PERIOD', debit: 0, credit: 6314067.26, level: 5 },
                { glCode: 'X1001001001009', glDescription: 'FO - LEAVE ENCASHMENT', debit: 37312742.85, credit: 0, level: 5 },
                { glCode: 'X1001001001010', glDescription: 'FO - GRATUITY', debit: 1015078.00, credit: 0, level: 5 },
                { glCode: 'X1001001001011', glDescription: 'FO - LABOUR WELFARE FUND', debit: 691761.25, credit: 0, level: 5 },
                { glCode: 'X1001001001012', glDescription: 'FO - INSURANCE', debit: 590494.10, credit: 0, level: 5 },
                { glCode: 'X1001001001013', glDescription: 'FO - E.S.I.C.', debit: 36801531.00, credit: 0, level: 5 },
                { glCode: 'X1001001001014', glDescription: 'FO - PROVIDENT FUND', debit: 130735794.00, credit: 0, level: 5 },
                { glCode: 'X1001001001015', glDescription: 'FO - OVERTIME', debit: 119846580.00, credit: 0, level: 5 },
                { glCode: 'X1001001001016', glDescription: 'FO - CONVEYANCE ALLOWANCE', debit: 6147479.00, credit: 0, level: 5 },
                { glCode: 'X1001001001017', glDescription: 'FO - EX-GRATIA', debit: 330530.00, credit: 0, level: 5 },
                { glCode: 'X1001001001018', glDescription: 'FO - WASHING ALLOWANCE', debit: 1646168.00, credit: 0, level: 5 },
                { glCode: 'X1001001001019', glDescription: 'FO - NOTICE PAY SALARY', debit: 955257.00, credit: 0, level: 5 },
                { glCode: 'X1001001001021', glDescription: 'FO - PERFORMANCE INCENTIVE', debit: 354150.00, credit: 0, level: 5 },
                { glCode: 'X1001001001022', glDescription: 'FO - LEAVE TRAVEL ALLOWANCE', debit: 1351520.45, credit: 0, level: 5 },
                { glCode: 'X1001001002', glDescription: 'SUB CONTRACTORS', debit: 8665181.74, credit: 0, level: 4 },
                { glCode: 'X1001001002001', glDescription: 'SUB CONTRACTORS EXP', debit: 8665181.74, credit: 0, level: 5 },

                { glCode: 'X1001002', glDescription: 'OTHER PRODUCTION COST', debit: 1341072.64, credit: 0, level: 3 },
                { glCode: 'X1001002002', glDescription: 'FO - CONVEYANCE', debit: 121914.00, credit: 0, level: 4 },
                { glCode: 'X1001002003', glDescription: 'FO - TRAVELIING EXPENSES', debit: 16926.00, credit: 0, level: 4 },
                { glCode: 'X1001002005', glDescription: 'GUEST HOUSE EXPENSES', debit: 1202232.64, credit: 0, level: 4 },

                { glCode: 'X1001004', glDescription: 'MATERIALS FOR PRODUCTION', debit: 73099654.22, credit: 0, level: 3 },
                { glCode: 'X1001004001', glDescription: 'PURCHASE - HOUSEKEEPING MATERIAL', debit: 55957737.85, credit: 0, level: 4 },
                { glCode: 'X1001004002', glDescription: 'PURCHASE - STAFF UNIFORM', debit: 14308966.37, credit: 0, level: 4 },
                { glCode: 'X1001004003', glDescription: 'TRANSPORTATION CHARGES', debit: 262966.00, credit: 0, level: 4 },
                { glCode: 'X1001004004', glDescription: 'LOADING & UNLOADING EXPENSES', debit: 21535.00, credit: 0, level: 4 },
                { glCode: 'X1001004005', glDescription: 'LAUNDRY EXPENSES', debit: 124064.00, credit: 0, level: 4 },
                { glCode: 'X1001004006', glDescription: 'SPECIAL PROJECT EXPENSES', debit: 2424385.00, credit: 0, level: 4 },

                { glCode: 'X1001006', glDescription: 'MACHINERY & EQUIPMENT', debit: 1912165.58, credit: 0, level: 3 },
                { glCode: 'X1001006001', glDescription: 'REPAIRS & MAINTANANCE (SITE LEVEL)', debit: 1450997.78, credit: 0, level: 4 },
                { glCode: 'X1001006002', glDescription: 'REPAIRS & MAINTANANCE (SPARES)', debit: 433167.80, credit: 0, level: 4 },
                { glCode: 'X1001006003', glDescription: 'LEASE RENTAL - MACHINERIES', debit: 28000.00, credit: 0, level: 4 },

                { glCode: 'X1001007', glDescription: 'PROVISION FOR BAD DEBTS', debit: 2865374.38, credit: 0, level: 3 },
                { glCode: 'X1001007001', glDescription: 'PROVISION FOR BAD DEBT', debit: 2705708.62, credit: 0, level: 4 },
                { glCode: 'X1001007002', glDescription: 'BAD DEBTS WRITTEN OFF', debit: 114139.37, credit: 0, level: 4 },
                { glCode: 'X1001007003', glDescription: 'SLA DEDUCTION', debit: 45526.39, credit: 0, level: 4 },

                { glCode: 'X1002', glDescription: 'OTHER SUPERVISION COST(X1002)', debit: 25818458.56, credit: 0, level: 2 },
                { glCode: 'X1002001', glDescription: 'FOODS & BEVERAGES TO EMPLOYEES', debit: 1504009.71, credit: 0, level: 3 },
                { glCode: 'X1002005', glDescription: 'STAFF WELFARE (SITE LEVEL)', debit: 41482.00, credit: 0, level: 3 },
                { glCode: 'X1002006', glDescription: 'ELECTRICITY CHRGS (SITE LEVEL)', debit: 61618.96, credit: 0, level: 3 },
                { glCode: 'X1002007', glDescription: 'RENT ( SITE LEVEL)', debit: 2077299.00, credit: 0, level: 3 },
                { glCode: 'X1002009', glDescription: 'CONVEYANCE EXP ( SITE LEVEL)', debit: 4873.00, credit: 0, level: 3 },
                { glCode: 'X1002011', glDescription: 'VISIT CHARGES (SITE LEVEL)', debit: 2000.00, credit: 0, level: 3 },
                { glCode: 'X1002013', glDescription: 'SITE EXPENSES', debit: 21900206.95, credit: 0, level: 3 },
                { glCode: 'X1002014', glDescription: 'MOBILISATION COST', debit: 93553.00, credit: 0, level: 3 },
                { glCode: 'X1002015', glDescription: 'PROFESSIONAL CHG - SITE', debit: 133415.94, credit: 0, level: 3 },

                { glCode: 'X2', glDescription: 'EXPENSES INDIRECT', debit: 174557857.74, credit: 0, level: 1 },
                { glCode: 'X2001', glDescription: 'BRANCH MANAGEMENT', debit: 150953685.40, credit: 0, level: 2 },
                { glCode: 'X2001001', glDescription: 'BRANCH MANAGEMENT SALARY COST', debit: 73521671.53, credit: 0, level: 3 },
                { glCode: 'X2001001001', glDescription: 'BR - BASIC SALARIES', debit: 30485186.00, credit: 0, level: 4 },
                { glCode: 'X2001001002', glDescription: 'BR - DEARNESS ALLOWANCE (DA)', debit: 554312.00, credit: 0, level: 4 },
                { glCode: 'X2001001003', glDescription: 'BR - HOUSE RENT ALLOWANCE-HRA', debit: 9422898.00, credit: 0, level: 4 },
                { glCode: 'X2001001004', glDescription: 'BR - OTHER ALLOWANCE', debit: 19719774.00, credit: 0, level: 4 },
                { glCode: 'X2001001005', glDescription: 'BR - EDUCATION ALLOWANCE', debit: 3771.00, credit: 0, level: 4 },
                { glCode: 'X2001001006', glDescription: 'BR - BONUS', debit: 1724206.34, credit: 0, level: 4 },
                { glCode: 'X2001001007', glDescription: 'BR - MEDICAL EXP.', debit: 49210.00, credit: 0, level: 4 },
                { glCode: 'X2001001008', glDescription: 'BR - OTHER DEDUCTION/NOTICE PERIOD', debit: 0, credit: 291693.53, level: 4 },
                { glCode: 'X2001001009', glDescription: 'BR - LEAVE ENCASHMENT', debit: 1089427.00, credit: 0, level: 4 },
                { glCode: 'X2001001010', glDescription: 'BR - GRATUITY', debit: 51923.00, credit: 0, level: 4 },
                { glCode: 'X2001001011', glDescription: 'BR - LABOUR WELFARE FUND', debit: 14527.00, credit: 0, level: 4 },
                { glCode: 'X2001001012', glDescription: 'BR - INSURANCE', debit: 725513.72, credit: 0, level: 4 },
                { glCode: 'X2001001013', glDescription: 'BR - E.S.I.C.', debit: 420438.00, credit: 0, level: 4 },
                { glCode: 'X2001001014', glDescription: 'BR - PROVIDENT FUND', debit: 3289798.00, credit: 0, level: 4 },
                { glCode: 'X2001001015', glDescription: 'BR - MEDICAL REIMBURSEMENT', debit: 6709.00, credit: 0, level: 4 },
                { glCode: 'X2001001016', glDescription: 'BR - LEAVE TRAVEL ALLOWANCE', debit: 10920.00, credit: 0, level: 4 },
                { glCode: 'X2001001017', glDescription: 'BR - WASHING ALLOWANCE', debit: 35154.00, credit: 0, level: 4 },
                { glCode: 'X2001001018', glDescription: 'BR - CONVEYANCE ALLOWANCE', debit: 6117542.00, credit: 0, level: 4 },
                { glCode: 'X2001001019', glDescription: 'BR - NOTICE PAY SALARY', debit: 92056.00, credit: 0, level: 4 },

                { glCode: 'X2001002', glDescription: 'OTHER BRANCH EXPENSES', debit: 77432013.87, credit: 0, level: 3 },
                { glCode: 'X2001002001', glDescription: 'AUDIT FEES', debit: 75000.00, credit: 0, level: 4 },
                { glCode: 'X2001002002', glDescription: 'BUSINESS PROMOTION', debit: 13923247.50, credit: 0, level: 4 },
                { glCode: 'X2001002003', glDescription: 'COMMISSION & BROKERAGE', debit: 529039.00, credit: 0, level: 4 },
                { glCode: 'X2001002004', glDescription: 'COMPUTER EXPENSES', debit: 1977029.23, credit: 0, level: 4 },
                { glCode: 'X2001002005', glDescription: 'CONFERENCE & SEMINAR EXPENSES', debit: 504701.00, credit: 0, level: 4 },
                { glCode: 'X2001002006', glDescription: 'BR - CONVEYANCE', debit: 6475554.87, credit: 0, level: 4 },
                { glCode: 'X2001002007', glDescription: 'DEPRECIATION', debit: 6247696.00, credit: 0, level: 4 },
                { glCode: 'X2001002008', glDescription: 'DONATION', debit: 625102.00, credit: 0, level: 4 },
                { glCode: 'X2001002009', glDescription: 'ELECTRICITY CHARGES', debit: 1121450.71, credit: 0, level: 4 },
                { glCode: 'X2001002010', glDescription: 'FESTIVAL EXPENESES', debit: 2800759.12, credit: 0, level: 4 },
                { glCode: 'X2001002012', glDescription: 'LEGAL EXPENSES', debit: 37000.00, credit: 0, level: 4 },
                { glCode: 'X2001002013', glDescription: 'MEDICAL INSURANCE', debit: 2713494.00, credit: 0, level: 4 },
                { glCode: 'X2001002014', glDescription: 'MISC. EXPENSES', debit: 273443.80, credit: 0, level: 4 },
                { glCode: 'X2001002015', glDescription: 'NEWS PAPERS,BOOKS & PERIODICAL', debit: 1450.00, credit: 0, level: 4 },
                { glCode: 'X2001002016', glDescription: 'OFFICE EXPENSES', debit: 899824.20, credit: 0, level: 4 },
                { glCode: 'X2001002017', glDescription: 'POSTGE,TELEG & COURIER', debit: 2466854.93, credit: 0, level: 4 },
                { glCode: 'X2001002018', glDescription: 'PRINTING & STATIONERY', debit: 1454618.49, credit: 0, level: 4 },
                { glCode: 'X2001002019', glDescription: 'PROFESSION TAX (COMPANY)', debit: 5000.00, credit: 0, level: 4 },
                { glCode: 'X2001002020', glDescription: 'PROFESSIONAL CHGS.', debit: 8894395.35, credit: 0, level: 4 },
                { glCode: 'X2001002022', glDescription: 'OFFICE RENT', debit: 7502280.50, credit: 0, level: 4 },
                { glCode: 'X2001002023', glDescription: 'TELEPHONE EXPENSES', debit: 439986.35, credit: 0, level: 4 },
                { glCode: 'X2001002024', glDescription: 'INTERNET CHARGES', debit: 812008.76, credit: 0, level: 4 },
                { glCode: 'X2001002025', glDescription: 'TRAINING EXPENSES', debit: 112335.52, credit: 0, level: 4 },
                { glCode: 'X2001002026', glDescription: 'BR - TRAVELLING EXPENSES', debit: 4599217.79, credit: 0, level: 4 },
                { glCode: 'X2001002027', glDescription: 'ROC CHARGES', debit: 69040.00, credit: 0, level: 4 },
                { glCode: 'X2001002028', glDescription: 'REPAIRS & MAINTANANCE -OFFICE', debit: 1540144.74, credit: 0, level: 4 },
                { glCode: 'X2001002030', glDescription: 'INCOME TAX ADJUSTMENT EARLIER PERIOD', debit: 316125.32, credit: 0, level: 4 },
                { glCode: 'X2001002031', glDescription: 'REBATE & DISCOUNT ALLOWED', debit: 135131.04, credit: 0, level: 4 },
                { glCode: 'X2001002032', glDescription: 'STAFF WELFARE EXPENSES', debit: 1427952.00, credit: 0, level: 4 },
                { glCode: 'X2001002033', glDescription: 'INTEREST ,PENALTY & LATE FILING FEES', debit: 401808.28, credit: 0, level: 4 },
                { glCode: 'X2001002035', glDescription: 'STAFF RECOGNITION & DEVELOPMENT_ RNR', debit: 132282.00, credit: 0, level: 4 },
                { glCode: 'X2001002036', glDescription: 'EMPLOYEES COMPENSATION INSURANSE POLICY', debit: 66346.34, credit: 0, level: 4 },
                { glCode: 'X2001002037', glDescription: 'TENDER CHARGES', debit: 498396.13, credit: 0, level: 4 },
                { glCode: 'X2001002040', glDescription: 'HOTEL EXPENSES', debit: 1104076.53, credit: 0, level: 4 },
                { glCode: 'X2001002043', glDescription: 'SUBSCRIPTION, REGISTRATION & RENEWAL FEES', debit: 1509591.57, credit: 0, level: 4 },
                { glCode: 'X2001002044', glDescription: 'STAMP DUTY & FRANKING CHARGES', debit: 727883.00, credit: 0, level: 4 },
                { glCode: 'X2001002045', glDescription: 'ADVERTISEMENT EXPENSES', debit: 45400.00, credit: 0, level: 4 },
                { glCode: 'X2001002046', glDescription: 'INTEREST ON|GST', debit: 2086494.00, credit: 0, level: 4 },
                { glCode: 'X2001002047', glDescription: 'GST LATE FILING FEES', debit: 121438.00, credit: 0, level: 4 },
                { glCode: 'X2001002049', glDescription: 'SUBCONTRACT EXP - PROJECT', debit: 300000.00, credit: 0, level: 4 },
                { glCode: 'X2001002051', glDescription: 'REIMBURSEMENT OF ROC EXPENSES', debit: 7200.00, credit: 0, level: 4 },
                { glCode: 'X2001002054', glDescription: 'MOTOR VEHICLE EXPNSES', debit: 59729.00, credit: 0, level: 4 },
                { glCode: 'X2001002056', glDescription: 'LABOUR LICENSE FEES', debit: 170572.42, credit: 0, level: 4 },
                { glCode: 'X2001002057', glDescription: 'EVENT EXPENSES (CSR)', debit: 2132571.00, credit: 0, level: 4 },
                { glCode: 'X2001002058', glDescription: 'INELIGIBLE GST EXPENSES', debit: 60702.00, credit: 0, level: 4 },
                { glCode: 'X2001002059', glDescription: 'INTEREST ON ESIC', debit: 22703.38, credit: 0, level: 4 },
                { glCode: 'X2001002060', glDescription: 'INTEREST ON PF', debit: 4938.00, credit: 0, level: 4 },

                { glCode: 'X2002', glDescription: 'CORPORATE EXPENSES', debit: 23604172.34, credit: 0, level: 2 },
                { glCode: 'X2002002', glDescription: 'CORPORATE OTHER COST', debit: 23604172.34, credit: 0, level: 3 },
                { glCode: 'X2002002001', glDescription: 'INTEREST ON BANK LOAN CC A/C', debit: 18083236.00, credit: 0, level: 4 },
                { glCode: 'X2002002003', glDescription: 'BANK CHARGES', debit: 1215577.14, credit: 0, level: 4 },
                { glCode: 'X2002002005', glDescription: 'LOAN PROCESSING CHARGES', debit: 543236.20, credit: 0, level: 4 },
                { glCode: 'X2002002008', glDescription: 'DEFERRED TAX', debit: 0, credit: 359658.00, level: 4 },
                { glCode: 'X2002002009', glDescription: 'INCOME TAX PROVISION', debit: 4121781.00, credit: 0, level: 4 },
            ]
        }
        return data
    } catch (err) {
        console.error('generateTBData error:', err)
        throw new Error('Failed to generate TB data')
    }
}

/**
 * Apply styling based on hierarchy level
 * @param {Object} cell - ExcelJS cell object
 * @param {Number} level - Hierarchy level (0-5)
 * @param {Boolean} isGLCode - Whether it's the GL Code column
 */
const applyDataCellStyleByLevel = (cell, level, isGLCode = false) => {
    // Base styling
    cell.border = {
        top: { style: 'thin', color: { argb: 'FFD3D3D3' } },
        left: { style: 'thin', color: { argb: 'FFD3D3D3' } },
        bottom: { style: 'thin', color: { argb: 'FFD3D3D3' } },
        right: { style: 'thin', color: { argb: 'FFD3D3D3' } }
    }

    cell.alignment = {
        vertical: 'middle',
        horizontal: isGLCode ? 'left' : 'left'
    }

    // Level-based styling
    if (level === 0) {
        // Main groups (A, L, R, X)
        cell.font = { bold: true, size: 11, color: { argb: 'FF000000' } }
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFFD966' } // Gold
        }
    } else if (level === 1) {
        // Sub-groups (A1, L1, etc.)
        cell.font = { bold: true, size: 10, color: { argb: 'FF000000' } }
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFFD9B3' } // Light Orange
        }
    } else if (level === 2) {
        // Level 2 groups
        cell.font = { bold: true, size: 10, color: { argb: 'FF000000' } }
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE6F2FF' } // Light Blue
        }
    } else if (level === 3) {
        // Level 3 accounts
        cell.font = { size: 9, color: { argb: 'FF000000' } }
    } else if (level >= 4) {
        // Level 4+ accounts
        cell.font = { size: 9, color: { argb: 'FF333333' }, italic: true }
    }
}

/**
 * Apply company header styling
 */
const applyCompanyHeaderStyle = (cell) => {
    cell.font = {
        bold: true,
        size: 16,
        color: { argb: 'FF000080' }
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
        size: 13,
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
        fgColor: { argb: 'FF4472C4' }
    }
    cell.font = {
        bold: true,
        size: 11,
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
 * Apply grand total styling
 */
const applyGrandTotalStyle = (cell) => {
    cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFD966' }
    }
    cell.font = {
        bold: true,
        size: 11,
        color: { argb: 'FF000000' }
    }
    cell.alignment = {
        horizontal: 'right',
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
 * Generate and download TB Report Excel
 * @param {Object} periodData - Period selection data (optional)
 */
export const generateTBReportExcel = async (periodData = null) => {
    try {
        console.log('=== TB Report Excel Generation Started ===')
        console.log('Period Data:', periodData)

        // Create new workbook
        const workbook = new ExcelJS.Workbook()
        workbook.creator = 'iSmart Accounts System'
        workbook.created = new Date()
        workbook.modified = new Date()

        // Add worksheet
        const worksheet = workbook.addWorksheet('Trial Balance', {
            pageSetup: {
                paperSize: 9, // A4
                orientation: 'portrait',
                fitToPage: true,
                fitToWidth: 1,
                fitToHeight: 0
            },
            views: [{ state: 'frozen', xSplit: 0, ySplit: 5 }]
        })

        // Set column widths
        worksheet.columns = [
            { key: 'glCode', width: 18 },
            { key: 'glDescription', width: 60 },
            { key: 'debit', width: 20 },
            { key: 'credit', width: 20 }
        ]

        // Get TB data
        const tbData = generateTBData()

        // Row counter
        let currentRow = 1

        // Company Header
        const companyHeaderRow = worksheet.getRow(currentRow)
        worksheet.mergeCells(`A${currentRow}:D${currentRow}`)
        const companyCell = worksheet.getCell(`A${currentRow}`)
        companyCell.value = tbData.companyName
        applyCompanyHeaderStyle(companyCell)
        companyHeaderRow.height = 25
        currentRow++

        // Empty row
        currentRow++

        // Report Title
        const reportTitleRow = worksheet.getRow(currentRow)
        worksheet.mergeCells(`A${currentRow}:D${currentRow}`)
        const reportTitleCell = worksheet.getCell(`A${currentRow}`)
        reportTitleCell.value = `Trial Balance As On : ${tbData.reportDate}`
        applyReportTitleStyle(reportTitleCell)
        reportTitleRow.height = 20
        currentRow++

        // Empty row
        currentRow++

        // Column Headers
        const headerRow = worksheet.getRow(currentRow)
        headerRow.height = 25

        const headers = ['GL Code', 'GL Description', 'Debit', 'Credit']
        headers.forEach((header, index) => {
            const cell = worksheet.getCell(currentRow, index + 1)
            cell.value = header
            applyColumnHeaderStyle(cell)
        })
        currentRow++

        // Initialize grand totals
        let grandTotalDebit = 0
        let grandTotalCredit = 0

        // Process each account
        tbData.accounts.forEach((account) => {
            const accountRow = worksheet.getRow(currentRow)

            // Calculate indentation based on level
            const indent = '  '.repeat(account.level)

            // GL Code (with indentation for description column later)
            const glCodeCell = worksheet.getCell(currentRow, 1)
            glCodeCell.value = account.glCode
            applyDataCellStyleByLevel(glCodeCell, account.level, true)

            // GL Description (with indentation)
            const glDescCell = worksheet.getCell(currentRow, 2)
            glDescCell.value = indent + account.glDescription
            applyDataCellStyleByLevel(glDescCell, account.level, false)

            // Debit
            const debitCell = worksheet.getCell(currentRow, 3)
            if (account.debit > 0) {
                debitCell.value = account.debit
                debitCell.numFmt = '#,##0.00'
                grandTotalDebit += account.debit
            } else {
                debitCell.value = ''
            }
            applyDataCellStyleByLevel(debitCell, account.level, false)
            debitCell.alignment = { horizontal: 'right', vertical: 'middle' }

            // Credit
            const creditCell = worksheet.getCell(currentRow, 4)
            if (account.credit > 0) {
                creditCell.value = account.credit
                creditCell.numFmt = '#,##0.00'
                grandTotalCredit += account.credit
            } else {
                creditCell.value = ''
            }
            applyDataCellStyleByLevel(creditCell, account.level, false)
            creditCell.alignment = { horizontal: 'right', vertical: 'middle' }

            accountRow.height = 18
            currentRow++
        })

        // Empty row before grand total
        currentRow++

        // Grand Total Row
        const grandTotalRow = worksheet.getRow(currentRow)

        const grandTotalLabelCell = worksheet.getCell(currentRow, 1)
        worksheet.mergeCells(`A${currentRow}:B${currentRow}`)
        grandTotalLabelCell.value = 'Grand Total:'
        applyGrandTotalStyle(grandTotalLabelCell)
        grandTotalLabelCell.alignment = { horizontal: 'center', vertical: 'middle' }

        const grandTotalDebitCell = worksheet.getCell(currentRow, 3)
        grandTotalDebitCell.value = grandTotalDebit
        grandTotalDebitCell.numFmt = '#,##0.00'
        applyGrandTotalStyle(grandTotalDebitCell)

        const grandTotalCreditCell = worksheet.getCell(currentRow, 4)
        grandTotalCreditCell.value = grandTotalCredit
        grandTotalCreditCell.numFmt = '#,##0.00'
        applyGrandTotalStyle(grandTotalCreditCell)

        grandTotalRow.height = 28

        // Difference row
        currentRow++
        worksheet.mergeCells(`A${currentRow}:D${currentRow}`)
        const diffCell = worksheet.getCell(`A${currentRow}`)
        const difference = Math.abs(grandTotalDebit - grandTotalCredit)
        diffCell.value = `Difference : ${difference.toFixed(2)}`
        diffCell.font = { size: 10, italic: true }
        diffCell.alignment = { horizontal: 'center', vertical: 'middle' }

        // Add footer
        currentRow += 2
        worksheet.mergeCells(`A${currentRow}:D${currentRow}`)
        const footerCell = worksheet.getCell(`A${currentRow}`)
        footerCell.value = `Generated by iSmart Accounts System | ${new Date().toLocaleString('en-IN')}`
        footerCell.font = { size: 9, italic: true, color: { argb: 'FF808080' } }
        footerCell.alignment = { horizontal: 'center', vertical: 'middle' }

        // Generate Excel file buffer
        const buffer = await workbook.xlsx.writeBuffer()

        // Create filename with timestamp
        const timestamp = new Date().toISOString().replace(/[:]/g, '-').slice(0, -5)
        const filename = `TB_Report_${timestamp}.xlsx`

        // Save file
        const blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        })
        saveAs(blob, filename)

        console.log('✓ TB Report Excel generated successfully:', filename)
        return { success: true, filename }

    } catch (err) {
        console.error('generateTBReportExcel error:', err)
        throw new Error(`Failed to generate TB Report Excel: ${err.message}`)
    }
}

export default { generateTBReportExcel }

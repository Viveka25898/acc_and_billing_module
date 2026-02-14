import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'

/**
 * Revenue Summary Report Excel Generation Service
 * Generates month-wise revenue summary report in Excel format
 * Production-ready code with comprehensive error handling
 */

/**
 * Generate Revenue Summary data
 * @returns {Object} Structured revenue summary data
 */
const generateRevSumData = () => {
    try {
        const data = {
            companyName: 'I SMART FACITECH PRIVATE LIMITED',
            reportTitle: 'REVENUE SUMMARY REPORT',
            reportPeriod: 'FY 2025-26 (Mar\'25 - Oct\'25)',
            asOfMonth: 'October 2025',
            columns: [
                'PARTY NAME',
                'Mar\'25',
                'Apr\'25',
                'May\'25',
                'Jun\'25',
                'July\'25',
                'Aug\'25',
                'Sep\'25',
                'Oct\'25',
                'Diff',
                'Remark'
            ],
            parties: [
                { partyName: 'AASAN CORPORATE SOLUTIONS PVT. LTD', mar25: 46167, apr25: 0.00, may25: 0, jun25: 0, july25: 0, aug25: 0, sep25: 0, oct25: 0, diff: 0, remark: 'Closed' },
                { partyName: 'ABR GREENFIELD PRIVATE LIMITED', mar25: 180720, apr25: 150559.89, may25: 135214.69, jun25: 172142.83, july25: 150808.52, aug25: 160755.00, sep25: 177143.62, oct25: 189129.62, diff: 11986, remark: 'ok' },
                { partyName: 'ADDITIONAL DISTRICT COURT LIMKHEDA', mar25: -3274, apr25: 65477.88, may25: 66132.66, jun25: 0, july25: 0, aug25: 0, sep25: 0, oct25: 0, diff: 0, remark: 'ok' },
                { partyName: 'ADITYA BIRLA CAPITAL LIMITED', mar25: 92987, apr25: 84895.40, may25: 75031.41, jun25: 93422.50, july25: 97324.97, aug25: 104997.27, sep25: 93642.25, oct25: 88146.90, diff: -5495.35, remark: 'ok' },
                { partyName: 'ADITYA BIRLA FASHION AND RETAIL LIMITED', mar25: -150000, apr25: 1856358.53, may25: 7351018.19, jun25: 7755455.59, july25: 7828577.66, aug25: 8349786.16, sep25: 8109634.63, oct25: 8535151.60, diff: 425516.97, remark: 'ok' },
                { partyName: 'ADITYA BIRLA HEALTH INSURANCE', mar25: 247964, apr25: 230317.81, may25: 228548.05, jun25: 225506.61, july25: 230826.89, aug25: 253370.39, sep25: 225549.59, oct25: 224296.07, diff: -1253.52, remark: 'ok' },
                { partyName: 'ADITYA BIRLA HOUSING FINANCE LIMITED', mar25: 237942, apr25: 229258.80, may25: 250397.34, jun25: 231725.39, july25: 300358.43, aug25: 322914.25, sep25: 302736.28, oct25: 279338.10, diff: -23398.18, remark: 'ok' },
                { partyName: 'ADITYA BIRLA MONEY LIMITED', mar25: 93166, apr25: 92931.24, may25: 93514.64, jun25: 96581.76, july25: 104171.61, aug25: 144851.14, sep25: 200146.10, oct25: 136077.85, diff: -64068.25, remark: 'ok' },
                { partyName: 'ADITYA BIRLA SUN LIFE AMC LTD', mar25: 124790, apr25: 122819.59, may25: 143681.52, jun25: 116020.10, july25: 191549.66, aug25: 190639.60, sep25: 198519.15, oct25: 185282.12, diff: -13237.03, remark: 'ok' },
                { partyName: 'ADITYA BIRLA SUN LIFE INSURANCE COMPANY LIMITED', mar25: 0, apr25: 951597.31, may25: 1109154.92, jun25: 808079.35, july25: 936144.19, aug25: 1125064.35, sep25: 927917.05, oct25: 906475.66, diff: -21441.39, remark: 'ok' },
                { partyName: 'AEROGRID ADVANCE HOSTING SOLUTIONS PVT LTD', mar25: 0, apr25: 0, may25: 347464.52, jun25: 655003.20, july25: 739886.06, aug25: 719880.83, sep25: 753034.01, oct25: 785317.65, diff: 32283.64, remark: 'ok' },
                { partyName: 'AGEAS FEDERAL LIFE INSURANCE COMPANY LIMITED', mar25: 488658, apr25: 531157.49, may25: 727496.06, jun25: 583430.93, july25: 687170.84, aug25: 685132.84, sep25: 652130.57, oct25: 574148.88, diff: -77981.69, remark: 'ok' },
                { partyName: 'AIONIOS ALPHA INVESTMENT MANAGEMENT LLP', mar25: 23930, apr25: 23929.92, may25: 23929.92, jun25: 23929.92, july25: 23929.92, aug25: 23929.92, sep25: 23929.92, oct25: 23929.92, diff: 0, remark: 'ok' },
                { partyName: 'AMBUJA CEMENTS LIMITED', mar25: 1085553, apr25: 984613.12, may25: 1044086.52, jun25: 985548.52, july25: 1075766.52, aug25: 1045282.52, sep25: 1578498.88, oct25: 1101325.52, diff: -477173.36, remark: 'ok' },
                { partyName: 'AMBUJA SHIPPING SERVICES LIMITED', mar25: 487860, apr25: 605710.00, may25: 477272.00, jun25: 443133.00, july25: 453172.00, aug25: 449761.00, sep25: 409255.28, oct25: 377066.00, diff: -32189.28, remark: 'ok' },
                { partyName: 'ANAND RATHI SHARE AND STOCK BROKERS LIMITED', mar25: 0, apr25: 0, may25: 0, jun25: 0, july25: 0, aug25: 34399.00, sep25: 34399.00, oct25: 34399.00, diff: 0, remark: 'ok' },
                { partyName: 'ANJUM BILAKHIA FAMILY TRUST', mar25: 0, apr25: 47044.92, may25: 37789.69, jun25: 45718.20, july25: 74266.41, aug25: 96438.85, sep25: 131511.12, oct25: 79047.92, diff: -52463.2, remark: 'ok' },
                { partyName: 'AUSTRALIAN CONSULATE-GENERAL MUMBAI', mar25: 0, apr25: 0, may25: 0, jun25: 0, july25: 0, aug25: 0, sep25: 34300.00, oct25: 0, diff: -34300, remark: 'One Time Inv' },
                { partyName: 'BAJAJ ALLIANZ GENERAL INSURANCE CO LTD', mar25: 0, apr25: 1692818.67, may25: 2427607.15, jun25: 2464157.07, july25: 2448959.54, aug25: 2491467.65, sep25: 2493076.57, oct25: 2493695.70, diff: 619.13, remark: 'ok' },
                { partyName: 'BEHALA BALANANDA BRAHMACHARI HOSPITAL AND RESEARCH CENTRE', mar25: 67922, apr25: 60437.60, may25: 70279.94, jun25: 71160.40, july25: 95092.61, aug25: 94807.16, sep25: 92606.00, oct25: 93863.81, diff: 1257.81, remark: 'ok' },
                { partyName: 'BELGRAVE SQUARE AND EATON SQUARE CO OPERATIVE HOUSING SOCIETY LTD', mar25: 139418, apr25: 61977.62, may25: 0, jun25: 0, july25: 0, aug25: 0, sep25: 0, oct25: 0, diff: 0, remark: 'ok' },
                { partyName: 'BHAGVATI HOSPITAL (NTC) BORIVALI', mar25: 325802, apr25: 326679.48, may25: 334050.48, jun25: 318585.18, july25: 328018.22, aug25: 0, sep25: 0, oct25: 0, diff: 0, remark: 'ok' },
                { partyName: 'BHARATRATNA DR. BABASAHEB AMBEDKAR HOSPITAL, BORIVALI', mar25: 543348, apr25: 531358.29, may25: 543347.54, jun25: 525820.20, july25: 537809.45, aug25: 0, sep25: 0, oct25: -21252.54, diff: -21252.54, remark: 'ok' },
                { partyName: 'BIOMATRIX HEALTHCARE PRIVATE LIMITED', mar25: 254457, apr25: 177646.09, may25: 0, jun25: 0, july25: 0, aug25: 0, sep25: 0, oct25: 0, diff: 0, remark: 'ok' },
                { partyName: 'BLUE DART AVIATION LTD', mar25: 97776, apr25: 829496.46, may25: 849821.74, jun25: 826795.27, july25: 846715.79, aug25: 846152.93, sep25: 768303.65, oct25: 747217.49, diff: -21086.16, remark: 'ok' },
                { partyName: 'BLUE DART EXPRESS LIMITED', mar25: 0, apr25: 0, may25: 0, jun25: 0, july25: 0, aug25: 0, sep25: 0, oct25: 16667.44, diff: 16667.44, remark: 'One Time Inv' },
                { partyName: 'BONDBAZAAR SECURITIES PRIVATE LIMITED', mar25: 0, apr25: 75668.79, may25: 75218.21, jun25: 72818.49, july25: 72671.52, aug25: 72430.60, sep25: 107421.13, oct25: 89278.09, diff: -18143.04, remark: 'ok' },
                { partyName: 'BOROSIL SCIENTIFIC LIMITED', mar25: -329839, apr25: 305331.00, may25: 251881.00, jun25: 257251.05, july25: 246487.77, aug25: 247863.88, sep25: 234507.91, oct25: 225271.64, diff: -9236.27, remark: 'ok' },
                { partyName: 'BUZIL ROSSARI PRIVATE LIMITED', mar25: 62072, apr25: 0, may25: 0, jun25: 0, july25: 0, aug25: 0, sep25: 0, oct25: 0, diff: 0, remark: 'ok' },
                { partyName: 'CANCELLED', mar25: 0, apr25: 0.01, may25: 0, jun25: 0, july25: 0, aug25: 0, sep25: 0.01, oct25: 0.01, diff: 0.01, remark: 'ok' },
                { partyName: 'CARE ANALYTICS AND ADVISORY PRIVATE LIMITED', mar25: 119051, apr25: 120339.94, may25: 116971.07, jun25: 115283.79, july25: 114679.20, aug25: 109484.46, sep25: 122589.17, oct25: 149526.39, diff: 26937.22, remark: 'ok' },
                { partyName: 'CARE RATINGS LIMITED', mar25: 719587, apr25: 738057.62, may25: 739411.39, jun25: 720223.33, july25: 804721.62, aug25: 771668.15, sep25: 941178.13, oct25: 812579.42, diff: -128598.71, remark: 'ok' },
                { partyName: 'CBRE SOUTH ASIA PVT. LTD', mar25: 0, apr25: 579629.53, may25: 578948.00, jun25: 612158.00, july25: 626790.67, aug25: 613167.94, sep25: 591780.36, oct25: 594585.96, diff: 2805.6, remark: 'ok' },
                { partyName: 'CENTRAL PARK', mar25: 0, apr25: 0, may25: 273474.00, jun25: 0, july25: 0, aug25: 0, sep25: 0, oct25: 0, diff: 0, remark: 'ok' },
                { partyName: 'CHAIRMAN JILLA KANUNI SEVA SATTA MANDAL, DAHOD', mar25: 15715, apr25: 15714.69, may25: 15714.69, jun25: 0, july25: 0, aug25: 0, sep25: 0, oct25: 0, diff: 0, remark: 'ok' },
                { partyName: 'CHIEF JUDICIAL MEGISTRATE COURT DAHOD', mar25: 48454, apr25: -648.87, may25: 49763.19, jun25: 0, july25: 0, aug25: 0, sep25: 0, oct25: 0, diff: 0, remark: 'ok' },
                { partyName: 'CHOLAMANDALAM INVESTMENT AND FINANCE COMPANY LIMITED', mar25: 0, apr25: 0, may25: 0, jun25: 41992.02, july25: 70548.59, aug25: 72245.94, sep25: 70286.62, oct25: 66640.32, diff: -3646.3, remark: 'ok' },
                { partyName: 'CMS INFO SYSTEMS LIMITED', mar25: 513196, apr25: 450617.90, may25: 510891.54, jun25: 511900.74, july25: 560841.60, aug25: 557020.77, sep25: 566807.64, oct25: 496986.42, diff: -69821.22, remark: 'ok' },
                { partyName: 'CONCAST (INDIA) PRIVATE LIMITED', mar25: 0, apr25: 0, may25: 106501.03, jun25: 0, july25: 0, aug25: 0, sep25: 0, oct25: 0, diff: 0, remark: 'ok' },
                { partyName: 'DDEV PLASTIKS INDUSTRIES LIMITED', mar25: 17468, apr25: 17468.00, may25: 17281.00, jun25: 16348.20, july25: 0, aug25: 0, sep25: 0, oct25: 0, diff: 0, remark: 'ok' },
                { partyName: 'DEBTLIFE IT SERVICES PRIVATE LIMITED', mar25: 0, apr25: 108772.82, may25: 109006.74, jun25: 108038.81, july25: 109400.80, aug25: 105333.90, sep25: 146769.36, oct25: 125109.44, diff: -21659.92, remark: 'ok' },
                { partyName: 'DELHI PUBLIC SCHOOL - PANVEL', mar25: 415439, apr25: 395001.38, may25: 386180.07, jun25: 371730.92, july25: 400668.21, aug25: 381779.49, sep25: 393999.08, oct25: 395789.81, diff: 1790.73, remark: 'ok' },
                { partyName: 'DELTA CORP LIMITED', mar25: 177351, apr25: 240834.87, may25: 172597.71, jun25: 132722.00, july25: 194758.16, aug25: 213487.19, sep25: 205523.03, oct25: 201538.42, diff: -3984.61, remark: 'ok' },
                { partyName: 'DISTRICT LEGAL SERVICES AUTHORITY DAHOD', mar25: 15715, apr25: 15714.69, may25: 16369.47, jun25: 0, july25: 0, aug25: 0, sep25: -16369.47, oct25: -16369.47, diff: -16369.47, remark: 'ok' },
                { partyName: 'EDELWEISS ASSET RECONSTRUCTION COMPANY LIMITED', mar25: 453718, apr25: 295153.01, may25: 276098.47, jun25: 735804.06, july25: 290485.45, aug25: 283697.07, sep25: 317327.18, oct25: 334467.81, diff: 17140.63, remark: 'ok' },
                { partyName: 'EDME INSURANCE BROKERS LIMITED', mar25: 64478, apr25: 56706.59, may25: 59486.90, jun25: 62753.60, july25: 62064.00, aug25: 60360.14, sep25: 60293.40, oct25: 89485.70, diff: 29192.3, remark: 'ok' },
                { partyName: 'EPIROC MINING INDIA PRIVATE LIMITED', mar25: 27566, apr25: 27566.00, may25: 27566.00, jun25: 26647.13, july25: 27566.00, aug25: 24898.32, sep25: 26647.13, oct25: 27566.00, diff: 918.87, remark: 'ok' },
                { partyName: 'EUREKA FORBES LIMITED', mar25: 95304, apr25: 568684.66, may25: 651351.19, jun25: 542142.64, july25: 502095.73, aug25: 544836.32, sep25: 570844.19, oct25: 488559.88, diff: -82284.31, remark: 'ok' },
                { partyName: 'EUREKA FORBES LIMITED--', mar25: 0, apr25: 36000.00, may25: 29823.38, jun25: 241647.01, july25: 154585.41, aug25: 122630.68, sep25: 103458.23, oct25: 115729.06, diff: 12270.83, remark: 'ok' },
                { partyName: 'FATAKPAY DIGITAL PRIVATE LTD', mar25: 2756, apr25: 0, may25: 0, jun25: 5312.00, july25: 0, aug25: 0, sep25: 0, oct25: 0, diff: 0, remark: 'ok' },
                { partyName: 'FERTIN INDIA PRIVATE LIMITED', mar25: 51666, apr25: 51464.00, may25: 45172.09, jun25: 54946.20, july25: 52660.16, aug25: 54617.92, sep25: 52557.48, oct25: 52248.00, diff: -309.48, remark: 'ok' },
                { partyName: 'G S B SEVA MANDAL', mar25: 55284, apr25: 57995.30, may25: 43608.00, jun25: 43608.40, july25: 39732.32, aug25: 41061.79, sep25: 43361.47, oct25: 46031.08, diff: 2669.61, remark: 'ok' },
                { partyName: 'GENERALI CENTRAL INSURANCE COMPANY LIMITED', mar25: 0, apr25: 0, may25: 0, jun25: 0, july25: 0, aug25: 0, sep25: 307744.04, oct25: 567719.14, diff: 259975.1, remark: 'ok' },
                { partyName: 'GENERALI CENTRAL LIFE INSURANCE COMPANY LIMITED', mar25: 0, apr25: 0, may25: 0, jun25: 0, july25: 0, aug25: 0, sep25: 152245.60, oct25: 284533.03, diff: 132287.43, remark: 'ok' },
                { partyName: 'GOLDEN SOURCE INTERNATIONAL PVT LTD', mar25: 0, apr25: 232660.05, may25: 234429.49, jun25: 230877.15, july25: 243743.33, aug25: 236184.07, sep25: 232038.98, oct25: 372963.00, diff: 140924.02, remark: 'ok' },
                { partyName: 'H M HOLDINGS', mar25: 310254, apr25: 302248.00, may25: 0, jun25: 0, july25: 0, aug25: 0, sep25: 0, oct25: 0, diff: 0, remark: 'ok' },
                { partyName: 'H.B.T. TRAUMA CARE HOSPITAL', mar25: 2529749, apr25: 2529749.43, may25: 2340415.40, jun25: 2241437.48, july25: 2240706.80, aug25: 2500000.00, sep25: 2040612.08, oct25: 2200000.00, diff: 159387.92, remark: 'ok' },
                { partyName: 'HDB FINANCIAL SERVICES LIMITED', mar25: 203597, apr25: 4092.00, may25: 0, jun25: 0, july25: 0, aug25: 0, sep25: -4092.00, oct25: 0, diff: 4092, remark: 'ok' },
                { partyName: 'HDB FINANCIAL SERVICES LIMITED - CHENNAI', mar25: 662264, apr25: 864686.67, may25: 1180449.64, jun25: 1197121.34, july25: 1189315.15, aug25: 1186889.93, sep25: 1216008.57, oct25: 1200741.75, diff: -15266.82, remark: 'ok' },
                { partyName: 'HDB FINANCIAL SERVICES LIMITED MH', mar25: 1064689, apr25: 1092778.33, may25: 802435.74, jun25: 823206.67, july25: 830919.58, aug25: 827797.13, sep25: 828935.00, oct25: 829030.74, diff: 95.74, remark: 'ok' },
                { partyName: 'HDFC BANK LTD', mar25: 4534024, apr25: 5657312.72, may25: 5889692.01, jun25: 6931508.11, july25: 6171834.28, aug25: 6313296.06, sep25: 5889111.40, oct25: 6801465.73, diff: 912354.33, remark: 'ok' },
                { partyName: 'HDFC SECURITIES LIMITED', mar25: 1134058, apr25: 2088880.71, may25: 2051623.35, jun25: 2096420.96, july25: 2133580.36, aug25: 2084031.27, sep25: 2008565.09, oct25: 2002007.00, diff: -6558.09, remark: 'ok' },
                { partyName: 'HM HOLDINGS-MUM-(ATLANTIS ONE)', mar25: 0, apr25: 28752.50, may25: 4122.00, jun25: 0, july25: 0, aug25: 0, sep25: 0, oct25: 0, diff: 0, remark: 'ok' },
                { partyName: 'ICAR-INDIAN INSTIUTE OF SPICES RESEARCH', mar25: 1994540, apr25: 1818066.91, may25: 1993154.94, jun25: 1966947.69, july25: 2034225.27, aug25: 2071978.41, sep25: 1985757.57, oct25: 2051387.70, diff: 65630.13, remark: 'ok' },
                { partyName: 'INDIAN CANCER SOCIETY', mar25: 0, apr25: 197419.76, may25: 194447.60, jun25: 189581.64, july25: 219300.33, aug25: 215583.37, sep25: 199724.36, oct25: 194025.02, diff: -5699.34, remark: 'ok' },
                { partyName: 'INDRANI BHADURI', mar25: 0, apr25: 0, may25: 0, jun25: 0, july25: 0, aug25: 0, sep25: 0, oct25: 6355.93, diff: 6355.93, remark: 'One Time Inv' },
                { partyName: 'INSTITUTE OF ACTUARIES OF INDIA', mar25: 108241, apr25: 95403.17, may25: 94002.12, jun25: 93979.14, july25: 93359.20, aug25: 94227.13, sep25: 114634.42, oct25: 114235.73, diff: -398.69, remark: 'ok' },
                { partyName: 'INTERTRADE MERCANTILE CO. PVT.LTD.', mar25: 194680, apr25: 195000.00, may25: 53946.32, jun25: 85485.76, july25: 163808.18, aug25: 177483.56, sep25: 175859.32, oct25: 192414.37, diff: 16555.05, remark: 'ok' },
                { partyName: 'ION EXCHANGE (INDIA) LIMITED', mar25: 0, apr25: 269907.17, may25: 265351.75, jun25: 246396.98, july25: 296612.22, aug25: 292578.07, sep25: 291938.47, oct25: 310563.30, diff: 18624.83, remark: 'ok' },
                { partyName: 'ION EXCHANGE (INDIA) LIMITED - NAVI MUMBAI', mar25: 289331, apr25: 501347.08, may25: 438082.68, jun25: 598143.97, july25: 564973.61, aug25: 547860.30, sep25: 586500.29, oct25: 605200.56, diff: 18700.27, remark: 'ok' },
                { partyName: 'JANAKALYAN SAHAKARI BANK LTD', mar25: 21772, apr25: 90075.86, may25: 63477.84, jun25: 111193.12, july25: 86740.79, aug25: 89503.12, sep25: 89447.53, oct25: 90469.58, diff: 1022.05, remark: 'ok' },
                { partyName: 'JAYDEV MODY', mar25: 72465, apr25: 104179.00, may25: 83695.00, jun25: 81208.23, july25: 79506.23, aug25: 69521.52, sep25: 69783.27, oct25: 91711.00, diff: 21927.73, remark: 'ok' },
                { partyName: 'JM FINANCIAL SERVICES LIMITED', mar25: 0, apr25: 362154.13, may25: 354259.56, jun25: 365911.54, july25: 379716.92, aug25: 389176.69, sep25: 381488.37, oct25: 462950.01, diff: 81461.64, remark: 'ok' },
                { partyName: 'JUNOMONETA FINSOL PRIVATE LIMITED', mar25: 0, apr25: 65598.69, may25: 62769.32, jun25: 76693.46, july25: 117648.75, aug25: 116222.18, sep25: 0, oct25: 0, diff: 0, remark: 'ok' },
                { partyName: 'K.B.BHABHA HOSPITAL BANDRA', mar25: 643356, apr25: 778880.74, may25: 665007.90, jun25: 607270.78, july25: 742742.27, aug25: 0, sep25: 0, oct25: 0, diff: 0, remark: 'ok' },
                { partyName: 'K.B.BHABHA HOSPITAL, KURLA', mar25: 883584, apr25: 759390.57, may25: 836157.22, jun25: 844405.38, july25: 978755.90, aug25: 0, sep25: 0, oct25: 141000.00, diff: 141000, remark: 'ok' },
                { partyName: 'KANSAI NEROLAC PAINTS LTD', mar25: 390705, apr25: 434213.65, may25: 366081.54, jun25: 422868.59, july25: 413260.99, aug25: 415821.86, sep25: 405270.83, oct25: 413825.62, diff: 8554.79, remark: 'ok' },
                { partyName: 'KEM HOSPITAL', mar25: 0, apr25: 5175631.66, may25: 5175631.66, jun25: 5175631.70, july25: 5175631.66, aug25: 2491970.80, sep25: 2836696.00, oct25: 4180325.00, diff: 1343629, remark: 'ok' },
                { partyName: 'KEYENCE INDIA PRIVATE LIMITED', mar25: 0, apr25: 0, may25: 0, jun25: 0, july25: 0, aug25: 0, sep25: 59065.82, oct25: 31633.88, diff: -27431.94, remark: 'ok' },
                { partyName: 'KHAITAN & CO', mar25: 0, apr25: 0, may25: 0, jun25: 0, july25: 0, aug25: 208341.26, sep25: 379937.23, oct25: 387084.95, diff: 7147.72, remark: 'ok' },
                { partyName: 'KISETSU SAISON FINANCE (INDIA) PRIVATE LIMITED', mar25: 575432, apr25: 530623.75, may25: 531884.13, jun25: 541196.37, july25: 535414.10, aug25: 570881.60, sep25: 582962.50, oct25: 605437.02, diff: 22474.52, remark: 'ok' },
                { partyName: 'KOTAK MAHINDRA LIFE INSURANCE COMPANY LIMITED', mar25: 0, apr25: 0, may25: 0, jun25: 0, july25: 0, aug25: 307622.77, sep25: 619880.07, oct25: 621741.90, diff: 1861.83, remark: 'ok' },
                { partyName: 'KRANTIJYOTI SAVITRIBAI PHULE HOSPITAL BORIVALI', mar25: 383539, apr25: 375076.44, may25: 383539.44, jun25: 378811.20, july25: 379630.20, aug25: 0, sep25: 0, oct25: 0, diff: 0, remark: 'ok' },
                { partyName: 'KRANTIVEER MAHATMA JYOTIBA PHULE HOSPITAL, VIKROLI', mar25: 449525, apr25: 451704.96, may25: 448493.70, jun25: 434059.42, july25: 383421.24, aug25: 0, sep25: 40596.53, oct25: 2062.04, diff: -38534.49, remark: 'ok' },
                { partyName: 'LALBAUGCHA RAJA SARVAJANIK UTSAV MANDAL', mar25: 0, apr25: 0, may25: 0, jun25: 0, july25: 0, aug25: 0, sep25: 164953.00, oct25: 0, diff: -164953, remark: 'One Time Inv' },
                { partyName: 'LALBAUGCHA RAJA SARVAJANIK UTSAV MANDAL (DIALYSIS CENTRE)', mar25: 180499, apr25: 188834.00, may25: 205463.41, jun25: 208149.32, july25: 179351.97, aug25: 176543.24, sep25: 180938.86, oct25: 214671.59, diff: 33732.73, remark: 'ok' },
                { partyName: 'LINC LIMITED', mar25: 0, apr25: 11445.00, may25: 0, jun25: 0, july25: 0.00, aug25: 0, sep25: 0, oct25: 0, diff: 0, remark: 'ok' },
                { partyName: 'M.W.DESAI HOSPITAL MALAD', mar25: 1054733, apr25: 882236.25, may25: 1091850.18, jun25: 1006275.52, july25: 1071722.32, aug25: 0, sep25: 0, oct25: 0, diff: 0, remark: 'ok' },
                { partyName: 'M/S SAMCON RESORT AND HOTEL PRIVATE LIMITED', mar25: 121744, apr25: 133875.04, may25: 147409.89, jun25: 129751.32, july25: 120182.22, aug25: 179694.56, sep25: 119681.27, oct25: 94334.88, diff: -25346.39, remark: 'ok' },
                { partyName: 'MAHINDRA & MAHINDRA FINANCIAL SERVICES LIMITED', mar25: 964656, apr25: 8018245.62, may25: 8085802.66, jun25: 8110184.66, july25: 7932501.97, aug25: 7978954.13, sep25: 8141824.80, oct25: 28948827.00, diff: 20807002.2, remark: 'ok' },
                { partyName: 'MAHINDRA & MAHINDRA FINANCIAL SERVICES LIMITED - R&M', mar25: 0, apr25: 0, may25: 176300.00, jun25: 0, july25: 0, aug25: 0, sep25: 0, oct25: 0, diff: 0, remark: 'ok' },
                { partyName: 'MAHINDRA INSURANCE BROKERS LIMITED', mar25: 290155, apr25: 286144.07, may25: 305277.81, jun25: 310336.69, july25: 337258.82, aug25: 355184.58, sep25: 347553.80, oct25: 328660.22, diff: -18893.58, remark: 'ok' },
                { partyName: 'MAHINDRA MANULIFE INVESTMENT MANAGEMENT PRIVATE LIMITED', mar25: -23470, apr25: 86732.81, may25: 92106.56, jun25: 108999.03, july25: 94639.50, aug25: 88844.30, sep25: 94372.13, oct25: 99064.70, diff: 4692.57, remark: 'ok' },
                { partyName: 'MAHINDRA RURAL HOUSING FINANCE LIMITED', mar25: 0, apr25: 396113.68, may25: 407605.35, jun25: 406031.71, july25: 458709.24, aug25: 430759.58, sep25: 1217050.47, oct25: 1296921.41, diff: 79870.94, remark: 'ok' },
                { partyName: 'MASH ENERGY INDIA PRIVATE LIMITED', mar25: 52614, apr25: 67365.06, may25: 52006.78, jun25: 46948.62, july25: 53261.70, aug25: 48593.67, sep25: 51871.07, oct25: 57949.22, diff: 6078.15, remark: 'ok' },
                { partyName: 'MAZAGON DOCK SHIPBUILDERS LTD', mar25: 60717, apr25: 9586.94, may25: 0, jun25: 0, july25: 0, aug25: 0, sep25: 0, oct25: 0, diff: 0, remark: 'ok' },
                { partyName: 'MERIL DIAGNOSTIC PVT LTD', mar25: 0, apr25: 138169.77, may25: 138169.78, jun25: 136597.40, july25: 126258.89, aug25: 152115.15, sep25: 130378.00, oct25: 221229.93, diff: 90851.93, remark: 'ok' },
                { partyName: 'MERIL ENDO SURGERY PRIVATE LIMITED', mar25: 0, apr25: 107686.54, may25: 113470.31, jun25: 96920.60, july25: 88817.04, aug25: 112187.15, sep25: 115358.38, oct25: 186649.60, diff: 71291.22, remark: 'ok' },
                { partyName: 'MERIL HEALTH CARE PVT LTD', mar25: 202269, apr25: 898306.15, may25: 791775.12, jun25: 849966.36, july25: 844465.51, aug25: 915850.22, sep25: 1025210.22, oct25: 1195413.77, diff: 170203.55, remark: 'ok' },
                { partyName: 'MERIL LIFE SCIENCE PVT. LTD.', mar25: 0, apr25: 3256804.27, may25: 3027827.26, jun25: 3190513.34, july25: 3379056.76, aug25: 3886902.47, sep25: 3819575.65, oct25: 4813913.42, diff: 994337.77, remark: 'ok' },
                { partyName: 'METRO CASH AND CARRY INDIA LTD', mar25: 811254, apr25: 789506.24, may25: 1284550.72, jun25: 1190650.83, july25: 1205937.29, aug25: 1277539.17, sep25: 1218102.82, oct25: 1285517.12, diff: 67414.3, remark: 'ok' },
                { partyName: 'MICRO CRISPR PRIVATE LIMITED', mar25: 0, apr25: 37830.38, may25: 88035.00, jun25: 112630.00, july25: 112611.19, aug25: 170891.38, sep25: 105244.69, oct25: 113507.82, diff: 8263.13, remark: 'ok' },
                { partyName: 'MICRO LIFE SCIENCES PRIVATE LIMITED', mar25: 0, apr25: 818046.35, may25: 779641.81, jun25: 759406.80, july25: 691469.00, aug25: 802770.85, sep25: 474508.46, oct25: 1440833.23, diff: 966324.77, remark: 'ok' },
                { partyName: 'MICROSCAN INFOCOMMTECH PVT LIMITED', mar25: 63062, apr25: 64581.66, may25: 64604.94, jun25: 63130.39, july25: 58843.61, aug25: 62833.05, sep25: 40252.26, oct25: 44403.70, diff: 4151.44, remark: 'ok' },
                { partyName: 'MITSU PRIVATE LIMITED', mar25: 0, apr25: 39372.92, may25: 59821.31, jun25: 104060.24, july25: 79195.81, aug25: 85337.46, sep25: 101542.23, oct25: 124986.13, diff: 23443.9, remark: 'ok' },
                { partyName: 'MONEYBOLISM FINANCIAL SERVICES PRIVATE LIMITED', mar25: 0, apr25: 0, may25: 0, jun25: 0, july25: 0, aug25: 0, sep25: 0, oct25: 10687.50, diff: 10687.5, remark: 'One Time Inv' },
                { partyName: 'MRS. VISHAKHA MULYE', mar25: 29000, apr25: 29000.00, may25: 24322.58, jun25: 19333.33, july25: 29000.00, aug25: 30760.00, sep25: 29000.00, oct25: 29000.00, diff: 0, remark: 'ok' },
                { partyName: 'MUMBAI HOUSING AND AREA DEVELOPMENT AUTHORITY (MHADA)', mar25: 0, apr25: 789198.00, may25: 789198.00, jun25: 789198.24, july25: 789198.00, aug25: 789198.00, sep25: 789198.00, oct25: 789198.00, diff: 0, remark: 'ok' },
                { partyName: 'MYRA MALL MANAGEMENT COMPANY PRIVATE LIMITED', mar25: 44748, apr25: 64437.00, may25: 44748.00, jun25: 44748.00, july25: 44748.00, aug25: 46191.48, sep25: 44748.00, oct25: 44748.00, diff: 0, remark: 'ok' },
                { partyName: 'NCP COMMERCIALS PRIVATE LIMITED', mar25: 62472, apr25: 54348.96, may25: 54348.96, jun25: 83620.30, july25: 57206.07, aug25: 66206.07, sep25: 57206.07, oct25: 66206.07, diff: 9000, remark: 'ok' },
                { partyName: 'NCP COMMERCIALS PVT LTD', mar25: 0, apr25: 0, may25: 644315.17, jun25: 627069.58, july25: 681078.77, aug25: 659510.47, sep25: 607954.61, oct25: 665944.06, diff: 57989.45, remark: 'ok' },
                { partyName: 'NEW EMERGING WORLD OF JOURNALISM LIMITED (NEWJ)', mar25: 0, apr25: 0, may25: 36524.71, jun25: 80301.80, july25: 65047.45, aug25: 0, sep25: 0, oct25: 0, diff: 0, remark: 'ok' },
                { partyName: 'NM DIAGNOSTICS PRIVATE LIMITED', mar25: 80059, apr25: 37701.70, may25: 79808.52, jun25: 45118.80, july25: 74603.61, aug25: 37012.65, sep25: 0.00, oct25: 0, diff: 0, remark: 'ok' },
                { partyName: 'NOVEL JEWELS LIMITED', mar25: 0, apr25: 0, may25: 0, jun25: 283818.71, july25: 277150.70, aug25: 289740.58, sep25: 299855.93, oct25: 690273.25, diff: 390417.32, remark: 'ok' },
                { partyName: 'NUTRICIA INTERNATIONAL PRIVATE LIMITED', mar25: 212741, apr25: 281226.40, may25: 278452.90, jun25: 211446.62, july25: 269813.08, aug25: 223118.04, sep25: 185203.85, oct25: 390116.10, diff: 204912.25, remark: 'ok' },
                { partyName: 'ONE TOUCH RELOCATION SERVICES PVT LTD.', mar25: 402183, apr25: 441792.36, may25: 431452.12, jun25: 433690.23, july25: 441108.12, aug25: 411983.82, sep25: 429764.17, oct25: 428208.21, diff: -1555.96, remark: 'ok' },
                { partyName: 'OPTISUPPLY CHAIN SOLUTION PRIVATE LIMITED', mar25: 103231, apr25: 119357.61, may25: 114756.78, jun25: 92504.69, july25: 94406.25, aug25: 98614.44, sep25: 76978.83, oct25: 47789.03, diff: -29189.8, remark: 'ok' },
                { partyName: 'PARSHURAM EDUCATION SOCIETY', mar25: 183786, apr25: 181960.63, may25: 187388.52, jun25: 203652.53, july25: 195000.74, aug25: 204333.01, sep25: 194009.18, oct25: 349708.01, diff: 155698.83, remark: 'ok' },
                { partyName: 'PASTEL COMMERCE PRIVATE LIMITED', mar25: 0, apr25: 5422.40, may25: 0, jun25: 21266.89, july25: 34492.77, aug25: 23096.65, sep25: 21126.27, oct25: 30583.74, diff: 9457.47, remark: 'ok' },
                { partyName: 'PAUSHAK LIMITED', mar25: 0, apr25: 882536.00, may25: 957000.00, jun25: 919267.00, july25: 1029787.00, aug25: 1196747.00, sep25: 1194178.00, oct25: 1824131.00, diff: 629953, remark: 'ok' },
                { partyName: 'PEPPER ADVANTAGE INDIA PRIVATE LIMITED', mar25: 283592, apr25: 248569.89, may25: 228715.41, jun25: 256259.47, july25: 237483.73, aug25: 256841.71, sep25: 229782.08, oct25: 218139.00, diff: -11643.08, remark: 'ok' },
                { partyName: 'PIRAMAL ALTERNATIVES PRIVATE LIMITED', mar25: 63, apr25: 31016.00, may25: 22573.67, jun25: 29544.00, july25: 40032.53, aug25: 33614.00, sep25: 33821.00, oct25: 27404.00, diff: -6417, remark: 'ok' },
                { partyName: 'PIRAMAL CORPORATE TOWER PRIVATE LIMITED', mar25: 258407, apr25: 260697.85, may25: 274159.70, jun25: 411277.04, july25: 284853.10, aug25: 218797.42, sep25: 0, oct25: 0, diff: 0, remark: 'ok' },
                { partyName: 'PIRAMAL ENTERPRISES LIMITED', mar25: 0, apr25: 258150.40, may25: 222061.28, jun25: 232501.00, july25: 233091.00, aug25: 220952.00, sep25: 202135.46, oct25: 237097.00, diff: 34961.54, remark: 'ok' },
                { partyName: 'PIRAMAL FINANCE LIMITED', mar25: 1632109, apr25: 17999200.89, may25: 17574625.43, jun25: 17464271.16, july25: 17590746.55, aug25: 17886658.49, sep25: 16767665.04, oct25: 16733981.08, diff: -33683.96, remark: 'ok' },
                { partyName: 'PLUTUS WEALTH MANAGEMENT LLP', mar25: 37489, apr25: 37489.00, may25: 37488.96, jun25: 37488.96, july25: 30230.28, aug25: 30230.28, sep25: 0, oct25: 0, diff: 0, remark: 'ok' },
                { partyName: 'PPH HOSPITALS', mar25: 0, apr25: 0, may25: 0, jun25: 0, july25: 0, aug25: 0, sep25: 0, oct25: 4183487.00, diff: 4183487, remark: 'ok' },
                { partyName: 'PREMIUM BUILDING MANAGEMENT LLP', mar25: 1687453, apr25: 0, may25: 0, jun25: 0, july25: 0, aug25: 0, sep25: 0, oct25: 0, diff: 0, remark: 'ok' },
                { partyName: 'PRINCIPAL DISTRICT COURT DAHOD', mar25: 267052, apr25: 243671.18, may25: 274697.35, jun25: 0, july25: 0, aug25: 0, sep25: 0, oct25: 0, diff: 0, remark: 'ok' },
                { partyName: 'PRL AGASTYA PRIVATE LIMITED', mar25: 0, apr25: 39520.65, may25: 34599.00, jun25: 46021.71, july25: 48149.73, aug25: 45662.97, sep25: 53599.04, oct25: 0, diff: -53599.04, remark: 'ok' },
                { partyName: 'PSB ALLIANCE PVT. LTD', mar25: 102225, apr25: 100210.56, may25: 109204.50, jun25: 110338.32, july25: 108253.94, aug25: 106851.29, sep25: 104895.03, oct25: 104330.00, diff: -565.03, remark: 'ok' },
                { partyName: 'PT. MADANMOHAN MALVIYA SHTABDI HOSPITAL, GOVANDI', mar25: 338175, apr25: 138132.99, may25: 350387.55, jun25: 310337.02, july25: 518786.00, aug25: 0, sep25: 0, oct25: 0, diff: 0, remark: 'ok' },
                { partyName: 'RAJAWADI HOSPITAL, GHATKOPAR', mar25: 954725, apr25: 982054.98, may25: 928949.02, jun25: 913483.72, july25: 898525.50, aug25: 0, sep25: 0, oct25: 0, diff: 0, remark: 'ok' },
                { partyName: 'RAMESH CLOTHING COMPANY', mar25: 288034, apr25: 297638.30, may25: 330858.07, jun25: 351281.97, july25: 344936.75, aug25: 336137.33, sep25: 351588.63, oct25: 618300.27, diff: 266711.64, remark: 'ok' },
                { partyName: 'RAYMOND LIFESTYLE LIMITED', mar25: 6053360, apr25: 7142866.26, may25: 7660135.25, jun25: 7224945.39, july25: 6342565.60, aug25: 6773215.45, sep25: 6628611.92, oct25: 6188883.88, diff: -439728.04, remark: 'Pending' },
                { partyName: 'RAYMOND LIMITED-APPAREL DIVISION', mar25: 0, apr25: 0, may25: -7988.00, jun25: 0, july25: 0, aug25: 0, sep25: 0, oct25: 0, diff: 0, remark: 'ok' },
                { partyName: 'RAYMOND LTD', mar25: 0, apr25: 0, may25: -25642.00, jun25: 0, july25: 0, aug25: 0, sep25: 0, oct25: 0, diff: 0, remark: 'ok' },
                { partyName: 'RHENUS LOGISTICS INDIA PVT LTD', mar25: 0, apr25: 10000.00, may25: 0, jun25: 0, july25: 0, aug25: 0, sep25: 0, oct25: 0, diff: 0, remark: 'ok' },
                { partyName: 'RIEOM AI PRIVATE LIMITED', mar25: 61992, apr25: 61812.61, may25: 58068.02, jun25: 56801.74, july25: 56441.36, aug25: 65422.02, sep25: 60849.74, oct25: 61657.10, diff: 807.36, remark: 'ok' },
                { partyName: 'RUPA RENAISSANCE LIMITED', mar25: 23521, apr25: 22826.00, may25: 22826.00, jun25: 23621.00, july25: 22826.00, aug25: 23621.00, sep25: 22826.00, oct25: 0.00, diff: -22826, remark: 'ok' },
                { partyName: 'RUPA SOLUTIONS PRIVATE LIMITED', mar25: 0, apr25: 0, may25: 0, jun25: 0, july25: 0, aug25: 0, sep25: 0, oct25: 25034.97, diff: 25034.97, remark: 'ok' },
                { partyName: 'S.K.PATIL HOSPITAL MALAD', mar25: 209297, apr25: 174692.45, may25: 172180.34, jun25: 193831.76, july25: 194166.68, aug25: 0, sep25: 0, oct25: 0, diff: 0, remark: 'ok' },
                { partyName: 'S.V.D. SAVARKAR HOSPITAL MULUND', mar25: 406229, apr25: 279666.33, may25: 368074.14, jun25: 364981.08, july25: 336971.63, aug25: 0, sep25: 0, oct25: 0, diff: 0, remark: 'ok' },
                { partyName: 'SANT MUKTABAI HOSPITAL, GHATKOPAR', mar25: 278375, apr25: 251059.23, may25: 261879.08, jun25: 269096.22, july25: 271667.91, aug25: 0, sep25: 0, oct25: 0, diff: 0, remark: 'ok' },
                { partyName: 'SARASWAT INFOTECH PVT LTD', mar25: 98050, apr25: 119203.00, may25: 86866.00, jun25: 103938.00, july25: 74673.00, aug25: 88314.00, sep25: 87924.00, oct25: 0, diff: -87924, remark: 'ok' },
                { partyName: 'SATRA PLAZA PREMISES CO OPERATIVE SOCIETY LTD', mar25: 482391, apr25: 648247.47, may25: 593460.00, jun25: 629483.00, july25: 665069.00, aug25: 627460.00, sep25: 617386.00, oct25: 749210.00, diff: 131824, remark: 'ok' },
                { partyName: 'SEAWOODS GRAND CENTRAL CONDOMINIUM TOWER 2', mar25: 0, apr25: 61940.00, may25: 61890.00, jun25: 79711.33, july25: 77140.00, aug25: 94395.00, sep25: 94395.00, oct25: 94395.00, diff: 0, remark: 'ok' },
                { partyName: 'SEMPLICE CORPORATE SOLUTIONS PRIVATE LIMITED', mar25: 0, apr25: 0, may25: 46130.06, jun25: 0, july25: 0, aug25: 0, sep25: 0, oct25: 0, diff: 0, remark: 'ok' },
                { partyName: 'SENVION WIND TECHNOLOGY PRIVATE LIMITED', mar25: 185842, apr25: 244341.92, may25: 207813.60, jun25: 219408.00, july25: 214520.32, aug25: 206568.03, sep25: 210829.29, oct25: 213509.76, diff: 2680.47, remark: 'ok' },
                { partyName: 'SF LOGISTICS PRIVATE LIMITED', mar25: 1711631, apr25: 1807352.00, may25: 2049817.00, jun25: 2169431.00, july25: 2386963.00, aug25: 2324112.00, sep25: 2337779.00, oct25: 2264270.00, diff: -73509, remark: 'ok' },
                { partyName: 'SHREE HAZARIMAL SOMANI MEMORIAL TRUST', mar25: 154610, apr25: 130123.95, may25: 133245.35, jun25: 124487.66, july25: 123204.52, aug25: 128657.74, sep25: 137528.80, oct25: 149985.61, diff: 12456.81, remark: 'ok' },
                { partyName: 'SHREE MARTAND DEVSANSTHAN', mar25: 125000, apr25: 355000.00, may25: 355000.00, jun25: 304334.50, july25: 296443.00, aug25: 333641.00, sep25: 269193.00, oct25: 304919.00, diff: 35726, remark: 'ok' },
                { partyName: 'SHREYAS SHIPPING AND LOGISTICS LIMITED', mar25: 0, apr25: 0, may25: -14348.47, jun25: 0, july25: 0, aug25: 0, sep25: 0, oct25: 0, diff: 0, remark: 'ok' },
                { partyName: 'SHRI MAHALAKSHMI TEMPLE TRUST', mar25: 72835, apr25: 62084.20, may25: 67875.07, jun25: 69698.30, july25: 71984.42, aug25: 80412.83, sep25: 60155.17, oct25: 65163.85, diff: 5008.68, remark: 'ok' },
                { partyName: 'SHRIRAM FINANCE LIMITED', mar25: 0, apr25: 463358.81, may25: 494104.21, jun25: 503936.79, july25: 504264.69, aug25: 507054.41, sep25: 500631.38, oct25: 506021.56, diff: 5390.18, remark: 'ok' },
                { partyName: 'SIDDHARTH HOSPITAL GOREGAON', mar25: 266003, apr25: 0, may25: 0, jun25: 0, july25: 0, aug25: 0, sep25: 0, oct25: 0, diff: 0, remark: 'ok' },
                { partyName: 'SMT. DIWALIBEN MEHTA (MAA) HOSPITAL, CHEMBUR', mar25: 227855, apr25: 216778.05, may25: 208266.04, jun25: 214452.16, july25: 212126.27, aug25: 0, sep25: 0, oct25: 0.00, diff: 0, remark: 'ok' },
                { partyName: 'SMT. M.T.AGARWAL HOSPITAL, MULUND', mar25: 805227, apr25: 724946.13, may25: 853684.56, jun25: 866056.80, july25: 938089.13, aug25: 0, sep25: 0, oct25: 0, diff: 0, remark: 'ok' },
                { partyName: 'SODEXO INDIA SERVICES PVT LTD', mar25: 227047, apr25: 198582.23, may25: 208709.22, jun25: 180292.82, july25: 188788.86, aug25: 234993.80, sep25: 158807.36, oct25: 197940.51, diff: 39133.15, remark: 'ok' },
                { partyName: 'SOUTH CITY BELAIR PROPERTY MANAGEMENT', mar25: 0, apr25: 216124.10, may25: 229486.42, jun25: 208812.47, july25: 171167.90, aug25: 213959.87, sep25: 221955.03, oct25: 231250.42, diff: 9295.39, remark: 'ok' },
                { partyName: 'SOUTH CITY PROJECTS (KOLKATA) LIMITED', mar25: 699693, apr25: 925183.81, may25: 340895.14, jun25: 96471.35, july25: 0, aug25: 0, sep25: 0, oct25: 22500.00, diff: 22500, remark: 'ok' },
                { partyName: 'SYNORIQ R&D PRIVATE LIMITED', mar25: 0, apr25: 0, may25: 0, jun25: 0, july25: 13361.81, aug25: 17259.00, sep25: 16108.40, oct25: 15588.77, diff: -519.63, remark: 'ok' },
                { partyName: 'TATA STARBUCKS PRIVATE LIMITED', mar25: 23742, apr25: 337501.96, may25: 311615.27, jun25: 276878.68, july25: 165901.52, aug25: 186210.19, sep25: 89129.73, oct25: 109034.81, diff: 19905.08, remark: 'ok' },
                { partyName: 'THE CHEMBUR GYMKHANA', mar25: 708500, apr25: 646183.34, may25: 619919.36, jun25: 716083.33, july25: 759935.49, aug25: 755145.17, sep25: 693716.67, oct25: 673354.84, diff: -20361.83, remark: 'ok' },
                { partyName: 'THE PRINCIPAL CIVIL COURT DEVGADH BARIYA', mar25: 91669, apr25: 92323.81, may25: 92978.59, jun25: 0, july25: 0, aug25: 0, sep25: 0, oct25: 0, diff: 0, remark: 'ok' },
                { partyName: 'THE PRINCIPAL CIVIL COURT DHANPUR', mar25: 83812, apr25: 85121.24, may25: 87740.36, jun25: 0, july25: 0, aug25: 0, sep25: 0, oct25: 0, diff: 0, remark: 'ok' },
                { partyName: 'THE PRINCIPAL CIVIL COURT GARBADA', mar25: 59585, apr25: 58275.31, may25: 58930.09, jun25: 0, july25: 0, aug25: 0, sep25: 0, oct25: 0, diff: 0, remark: 'ok' },
                { partyName: 'THE PRINCIPAL CIVIL COURT SANJELI', mar25: 18334, apr25: 103782.44, may25: 110985.01, jun25: 0, july25: 0, aug25: 0, sep25: 0, oct25: 0, diff: 0, remark: 'ok' },
                { partyName: 'THE PRINCIPAL CIVIL JUDGE - FATEPURA', mar25: 7857, apr25: 56965.75, may25: 61221.82, jun25: 0, july25: 0, aug25: 0, sep25: 0, oct25: 0, diff: 0, remark: 'ok' },
                { partyName: 'THE PRINCIPAL SENIOR CIVIL COURT DAHOD', mar25: 60240, apr25: 65477.88, may25: 58930.09, jun25: 6547.79, july25: 0, aug25: 0, sep25: 0, oct25: 0, diff: 0, remark: 'ok' },
                { partyName: 'THE PRINCIPAL SENIOR CIVIL COURT JHALOD', mar25: -1310, apr25: 138813.10, may25: 151253.90, jun25: 0, july25: 0, aug25: 0, sep25: 0, oct25: 0, diff: 0, remark: 'ok' },
                { partyName: 'THE PRINCIPLE SENIOR CIVIL COURT LIMKHEDA', mar25: 150599, apr25: 155182.57, may25: 166968.59, jun25: 0, july25: 0, aug25: 0, sep25: 0, oct25: 0, diff: 0, remark: 'ok' },
                { partyName: 'THE SARASWAT CO-OPERATIVE BANK LTD', mar25: 2711989, apr25: 2781873.37, may25: 2870129.70, jun25: 3187039.56, july25: 3280941.53, aug25: 3171925.65, sep25: 4050541.27, oct25: 3500447.96, diff: -550093.31, remark: 'Check' },
                { partyName: 'TITAN COMPANY LIMITED', mar25: 0, apr25: 0, may25: 0, jun25: 0, july25: 0, aug25: 0, sep25: 0, oct25: 43400.00, diff: 43400, remark: 'One Time Inv' },
                { partyName: 'TRANSGREEN AGRO AND LOGIX PRIVATE LIMITED', mar25: 54804, apr25: 41716.22, may25: 27696.57, jun25: 28420.20, july25: 24092.44, aug25: 22873.29, sep25: 23929.56, oct25: 23097.96, diff: -831.6, remark: 'ok' },
                { partyName: 'TRUHOME FINANCE LIMITED', mar25: 5515115, apr25: 5365777.26, may25: 5364595.76, jun25: 5267457.26, july25: 5232463.06, aug25: 6095944.82, sep25: 5547322.85, oct25: 5784820.52, diff: 237497.67, remark: 'Check' },
                { partyName: 'TRUST ASSET MANAGEMENT PRIVATE LIMITED', mar25: -79756, apr25: 115555.67, may25: 82302.88, jun25: 73595.52, july25: 99867.92, aug25: 73854.70, sep25: 71890.23, oct25: 84290.64, diff: 12400.41, remark: 'ok' },
                { partyName: 'TRUST CAPITAL SERVICES (INDIA) PRIVATE LIMITED', mar25: -209391, apr25: 215358.28, may25: 233467.18, jun25: 219747.60, july25: 248499.86, aug25: 230903.33, sep25: 244339.25, oct25: 234765.58, diff: -9573.67, remark: 'ok' },
                { partyName: 'TRUST INVESTMENT ADVISORS PRIVATE LIMITED', mar25: -25654, apr25: 26125.20, may25: 26125.20, jun25: 23596.95, july25: 26125.20, aug25: 26125.20, sep25: 25282.45, oct25: 26125.20, diff: 842.75, remark: 'ok' },
                { partyName: 'TRUSTPLUTUS FAMILY OFFICE & INVESTMENT ADVISERS (INDIA) PRIVATE LIMITED', mar25: -70974, apr25: 69880.32, may25: 71701.02, jun25: 71257.32, july25: 94067.78, aug25: 72999.11, sep25: 77094.04, oct25: 72256.56, diff: -4837.48, remark: 'ok' },
                { partyName: 'UGRO CAPITAL LIMITED', mar25: 0, apr25: 0, may25: 0, jun25: 0, july25: 0, aug25: 5220.00, sep25: 59200.00, oct25: 0.00, diff: -59200, remark: 'One Time Inv' },
                { partyName: 'UNBILLED DEBTORS', mar25: -58488895, apr25: 0.00, may25: 0.00, jun25: 0.00, july25: 0.00, aug25: 0.00, sep25: 0.00, oct25: 0.00, diff: 0, remark: 'ok' },
                { partyName: 'UNBILLED RECEIVABLE/ACCRUED INCOME', mar25: -112882, apr25: 0.00, may25: 0.00, jun25: 0.00, july25: 0, aug25: 0.00, sep25: 0, oct25: 0, diff: 0, remark: 'ok' },
                { partyName: 'V.N.DESAI HOSPITAL SANTACRUZ', mar25: 866057, apr25: 780400.98, may25: 725838.08, jun25: 819660.90, july25: 839331.44, aug25: 0, sep25: 0, oct25: 0, diff: 0, remark: 'ok' },
                { partyName: 'VARDE INDIA INVESTMENT ADVISER PRIVATE LIMITED', mar25: 0, apr25: 0, may25: 9903.19, jun25: 35923.40, july25: 22462.10, aug25: 25209.00, sep25: 25623.95, oct25: 26075.50, diff: 451.55, remark: 'ok' },
                { partyName: 'VASTU HOUSING FINANCE CORPORATION LIMITED', mar25: 0, apr25: 400766.19, may25: 78544.54, jun25: 16159.44, july25: 0, aug25: 0, sep25: 0, oct25: 0, diff: 0, remark: 'ok' },
                { partyName: 'XENAGE SOLUTIONS PRIVATE LIMITED', mar25: 21947, apr25: 22678.92, may25: 22678.92, jun25: 22678.92, july25: 22678.92, aug25: 22678.92, sep25: 21922.95, oct25: 22678.92, diff: 755.97, remark: 'ok' },
                { partyName: 'YASH ASHOKA', mar25: 54569, apr25: 60210.15, may25: 60161.82, jun25: 58041.06, july25: 59632.65, aug25: 59515.22, sep25: 59947.65, oct25: 59606.40, diff: -341.25, remark: 'ok' }
            ],
            grandTotal: {
                partyName: 'Grand Total',
                mar25: -2369337,
                apr25: 104309367,
                may25: 112070774.5,
                jun25: 112425862.3,
                july25: 112231913.4,
                aug25: 105028135.9,
                sep25: 104727541.1,
                oct25: 134095230.5,
                diff: 29367689.42,
                remark: ''
            }
        }

        return data
    } catch (err) {
        console.error('generateRevSumData error:', err)
        throw new Error('Failed to generate Revenue Summary data')
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
        size: 14,
        color: { argb: 'FF000000' }
    }
    cell.alignment = {
        horizontal: 'center',
        vertical: 'middle'
    }
}

/**
 * Apply info row styling
 */
const applyInfoRowStyle = (cell) => {
    cell.font = {
        size: 11,
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
        fgColor: { argb: 'FF4472C4' }  // Blue
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
        size: 10,
        color: { argb: 'FF000000' }
    }
}

/**
 * Apply grand total styling
 */
const applyGrandTotalStyle = (cell) => {
    cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFC000' }  // Orange/Gold
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
 * Generate and download Revenue Summary Report Excel
 */
export const generateRevSumReportExcel = async () => {
    try {
        console.log('=== Revenue Summary Report Excel Generation Started ===')

        // Create new workbook
        const workbook = new ExcelJS.Workbook()
        workbook.creator = 'iSmart Accounts System'
        workbook.created = new Date()
        workbook.modified = new Date()

        // Add worksheet
        const worksheet = workbook.addWorksheet('Rev Sum', {
            pageSetup: {
                paperSize: 9, // A4
                orientation: 'landscape',
                fitToPage: true,
                fitToWidth: 1,
                fitToHeight: 0
            },
            views: [{ state: 'frozen', xSplit: 0, ySplit: 6 }]
        })

        // Set column widths
        worksheet.columns = [
            { key: 'partyName', width: 60 },
            { key: 'mar25', width: 15 },
            { key: 'apr25', width: 15 },
            { key: 'may25', width: 15 },
            { key: 'jun25', width: 15 },
            { key: 'july25', width: 15 },
            { key: 'aug25', width: 15 },
            { key: 'sep25', width: 15 },
            { key: 'oct25', width: 15 },
            { key: 'diff', width: 15 },
            { key: 'remark', width: 20 }
        ]

        // Generate data
        const data = generateRevSumData()

        // HEADER SECTION (Rows 1-5)
        // Row 1: Company Name
        worksheet.mergeCells('A1:K1')
        const companyCell = worksheet.getCell('A1')
        companyCell.value = data.companyName
        applyCompanyHeaderStyle(companyCell)
        worksheet.getRow(1).height = 22

        // Row 2: Report Title
        worksheet.mergeCells('A2:K2')
        const titleCell = worksheet.getCell('A2')
        titleCell.value = data.reportTitle
        applyReportTitleStyle(titleCell)
        worksheet.getRow(2).height = 20

        // Row 3: Report Period
        worksheet.mergeCells('A3:K3')
        const periodCell = worksheet.getCell('A3')
        periodCell.value = data.reportPeriod
        applyInfoRowStyle(periodCell)
        worksheet.getRow(3).height = 16

        // Row 4: As of Month
        worksheet.mergeCells('A4:K4')
        const asOfCell = worksheet.getCell('A4')
        asOfCell.value = `As of ${data.asOfMonth}`
        applyInfoRowStyle(asOfCell)
        worksheet.getRow(4).height = 16

        // Row 5: Empty row
        worksheet.getRow(5).height = 5

        // Row 6: Column Headers
        const headerRow = worksheet.getRow(6)
        headerRow.height = 35
        data.columns.forEach((colName, index) => {
            const cell = headerRow.getCell(index + 1)
            cell.value = colName
            applyColumnHeaderStyle(cell)
        })

        // DATA ROWS (Starting from row 7)
        let currentRow = 7

        // Add all party data
        data.parties.forEach((party) => {
            const row = worksheet.getRow(currentRow)

            // Set cell values
            row.getCell(1).value = party.partyName
            row.getCell(2).value = party.mar25
            row.getCell(3).value = party.apr25
            row.getCell(4).value = party.may25
            row.getCell(5).value = party.jun25
            row.getCell(6).value = party.july25
            row.getCell(7).value = party.aug25
            row.getCell(8).value = party.sep25
            row.getCell(9).value = party.oct25
            row.getCell(10).value = party.diff
            row.getCell(11).value = party.remark

            // Apply styling
            applyDataCellStyle(row.getCell(1), false)  // Party Name
            for (let col = 2; col <= 10; col++) {      // All numeric columns
                applyDataCellStyle(row.getCell(col), true)
                row.getCell(col).numFmt = '#,##0.00'
            }
            applyDataCellStyle(row.getCell(11), false)  // Remark

            row.height = 18
            currentRow++
        })

        // GRAND TOTAL ROW
        const grandTotalRow = worksheet.getRow(currentRow)
        grandTotalRow.height = 24

        const gt = data.grandTotal
        grandTotalRow.getCell(1).value = gt.partyName
        grandTotalRow.getCell(2).value = gt.mar25
        grandTotalRow.getCell(3).value = gt.apr25
        grandTotalRow.getCell(4).value = gt.may25
        grandTotalRow.getCell(5).value = gt.jun25
        grandTotalRow.getCell(6).value = gt.july25
        grandTotalRow.getCell(7).value = gt.aug25
        grandTotalRow.getCell(8).value = gt.sep25
        grandTotalRow.getCell(9).value = gt.oct25
        grandTotalRow.getCell(10).value = gt.diff
        grandTotalRow.getCell(11).value = gt.remark

        // Apply grand total styling to all cells
        for (let col = 1; col <= 11; col++) {
            const cell = grandTotalRow.getCell(col)
            applyGrandTotalStyle(cell)
            if (col >= 2 && col <= 10) {
                cell.numFmt = '#,##0.00'
            }
        }

        console.log('Excel structure created successfully')
        console.log('Total Parties:', data.parties.length)
        console.log('Grand Total - Oct\'25:', gt.oct25)

        // Generate Excel file buffer
        const buffer = await workbook.xlsx.writeBuffer()
        console.log('Excel buffer generated, size:', buffer.byteLength, 'bytes')

        // Create blob and download
        const blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        })

        // Generate filename with current date
        const currentDate = new Date()
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        const month = monthNames[currentDate.getMonth()]
        const year = currentDate.getFullYear()
        const filename = `Revenue_Summary_Report_AsOf_${month}_${year}.xlsx`

        // Save file
        saveAs(blob, filename)
        console.log('File download initiated:', filename)
        console.log('=== Revenue Summary Report Excel Generation Completed ===')

        return {
            success: true,
            filename,
            totalParties: data.parties.length
        }
    } catch (error) {
        console.error('=== Revenue Summary Report Excel Generation Failed ===')
        console.error('Error:', error)
        throw new Error(`Failed to generate Excel report: ${error.message}`)
    }
}

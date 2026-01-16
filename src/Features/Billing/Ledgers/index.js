// ========================================
// BILLING LEDGERS - COMPLETE INDEX
// Total Ledgers: 11 (4 Primary + 7 Statutory)
// ========================================

// ========================================
// PRIMARY POSTING LEDGERS (4)
// ========================================
export { default as HKChargesLedgerPage } from './HouseKeepingCharges/Pages/HKChargesLedgerPage';
export { default as ManpowerLedgerPage } from './ManpowerServices/Pages/ManpowerLedgerPage';
export { default as HKMaterialLedgerPage } from './HKMaterial/Pages/HKMaterialLedgerPage';
export { default as MachineryRentLedgerPage } from './RentOnMachinery/Pages/MachineryRentLedgerPage';

// ========================================
// GST STATUTORY LEDGERS (3)
// ========================================
export { default as CGSTLedgerPage } from './GSTLedgers/CGST/Pages/CGSTLedgerPage';
export { default as SGSTLedgerPage } from './GSTLedgers/SGST/Pages/SGSTLedgerPage';
export { default as IGSTLedgerPage } from './GSTLedgers/IGST/Pages/IGSTLedgerPage';

// ========================================
// TDS STATUTORY LEDGERS (2)
// ========================================
export { default as TDSPayableLedgerPage } from './TDSLedgers/Pages/TDSPayableLedgerPage';
export { default as TDSReceivableLedgerPage } from './TDSLedgers/Pages/TDSReceivableLedgerPage';

// ========================================
// SERVICE TAX LEDGERS (1)
// ========================================
export { default as ServiceTaxLedgerPage } from './ServiceTaxLedger/Pages/ServiceTaxLedgerPage';

// ========================================
// OTHER STATUTORY LEDGERS (1)
// ========================================
export { default as RoundOffLedgerPage } from './OtherStatutory/Pages/RoundOffLedgerPage';

// ========================================
// SHARED SERVICES & COMPONENTS
// ========================================
export { default as ProductGLMappingService } from './Services/ProductGLMappingService';
export { default as Badge } from './Components/Badge';

// ========================================
// DATA FILES (for testing/debugging)
// ========================================
export { hkChargesLedgerData } from './HouseKeepingCharges/data/hkChargesLedgerData';
export { manpowerLedgerData } from './ManpowerServices/data/manpowerLedgerData';
export { hkMaterialLedgerData } from './HKMaterial/data/hkMaterialLedgerData';
export { machineryRentLedgerData } from './RentOnMachinery/data/machineryRentLedgerData';
export { cgstLedgerData } from './GSTLedgers/CGST/data/cgstLedgerData';
export { sgstLedgerData } from './GSTLedgers/SGST/data/sgstLedgerData';
export { igstLedgerData } from './GSTLedgers/IGST/data/igstLedgerData';
export { tdsPayableLedgerData } from './TDSLedgers/data/tdsPayableLedgerData';
export { tdsReceivableLedgerData } from './TDSLedgers/data/tdsReceivableLedgerData';
export { serviceTaxLedgerData } from './ServiceTaxLedger/data/serviceTaxLedgerData';
export { roundOffLedgerData } from './OtherStatutory/data/roundOffLedgerData';

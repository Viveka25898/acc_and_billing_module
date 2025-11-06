import React, { useMemo } from "react";
import { GSTLedgerService } from "../../utils/gstLedgerService";
import GSTHeader from "../Components/GSTHeader";
import GSTFilterSection from "../Components/GSTFilterSection";
import GSTLedgerTable from "../Components/GSTLedgerTable";

const IGSTInputLedgerPage = () => {
  const igstLedger = useMemo(() => (
    GSTLedgerService.getLedgerFor("A3007001003", "IGST Input")
  ), []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <GSTHeader data={igstLedger} />
        <GSTFilterSection
          filters={{ fromDate: "", toDate: "", status: "All", search: "" }}
          onFilterChange={() => {}}
          onPrint={() => window.print()}
        />
        <GSTLedgerTable ledger={igstLedger} />
      </div>
    </div>
  );
};

export default IGSTInputLedgerPage;

import React from "react";
import RentLedgerTable from "./RentLedgerTable";

const RentLedgerCard = ({ ledger, footerInfo }) => {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden mb-8">
      {/* Table */}
      <RentLedgerTable ledger={ledger} footerInfo={footerInfo} />
    </div>
  );
};

export default RentLedgerCard;


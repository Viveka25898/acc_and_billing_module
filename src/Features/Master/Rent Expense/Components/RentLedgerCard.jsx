import React from "react";
import RentLedgerTable from "./RentLedgerTable";

const RentLedgerCard = ({ ledger }) => {
  return (
    <div className="bg-white rounded-md shadow-md overflow-hidden mb-8">
      {/* Table */}
      <RentLedgerTable ledger={ledger} />
    </div>
  );
};

export default RentLedgerCard;

import React from 'react';

const InfoItem = ({ label, value }) => {
  return (
    <div className="flex flex-col">
      <span className="text-[11px] opacity-90 mb-1">{label}</span>
      <span className="text-sm font-semibold">{value}</span>
    </div>
  );
};

export default InfoItem;
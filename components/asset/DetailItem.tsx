import React from "react";

// Item component for displaying asset properties
const DetailItem = ({ 
  label, 
  value, 
  highlight = false,
  icon
}: {
  label: string;
  value: React.ReactNode;
  highlight?: boolean;
  icon?: React.ReactNode;
}) => (
  <div className="flex items-start gap-3 py-3 border-b border-gray-100 group">
    {icon && <div className="text-gray-400 mt-0.5">{icon}</div>}
    <div className="flex-grow">
      <dt className="text-xs font-medium text-gray-500 mb-1">{label}</dt>
      <dd className={`${highlight ? "text-blue-600 font-semibold" : "text-gray-800"} text-sm`}>
        {value || "—"}
      </dd>
    </div>
  </div>
);

export default DetailItem; 
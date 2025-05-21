import React, { ReactNode } from "react";
import { motion } from "framer-motion";

interface DetailItemProps {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  highlight?: boolean;
  className?: string;
}

const DetailItem: React.FC<DetailItemProps> = ({
  label,
  value,
  icon,
  highlight = false,
  className = ""
}) => {
  return (
    <motion.div 
      className={`py-2.5 transition-all ${
        highlight 
          ? "bg-slate-50/70 px-3 rounded-md border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5" 
          : ""
      } ${className}`}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center gap-2 mb-1.5">
        {icon && <div className="text-gray-500">{icon}</div>}
        <span className="text-xs font-medium text-gray-500">{label}</span>
      </div>
      <div className={`ml-7 ${typeof value !== "object" ? "text-gray-800" : ""} ${highlight ? "font-medium" : ""}`}>
        {value}
      </div>
    </motion.div>
  );
};

export default DetailItem; 
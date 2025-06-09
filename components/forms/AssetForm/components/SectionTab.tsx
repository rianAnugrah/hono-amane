import { motion } from "framer-motion";
import { SectionTabProps } from '../types';
import { CheckCircle, AlertTriangle } from "lucide-react";

export const SectionTab = ({
  label,
  isActive,
  status,
  onClick
}: SectionTabProps) => {
  let statusIcon;
  if (status === "complete") {
    statusIcon = (
      <motion.span 
        className="ml-2 text-green-500"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <CheckCircle size={16} />
      </motion.span>
    );
  } else if (status === "error") {
    statusIcon = (
      <motion.span 
        className="ml-2 text-red-500"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <AlertTriangle size={16} />
      </motion.span>
    );
  }
  
  return (
    <motion.button
      onClick={onClick}
      className={`
        px-4 py-2 text-sm font-medium 
        rounded-t-lg flex items-center relative
        transition-colors duration-200
        ${isActive
          ? "bg-white text-blue-600 shadow-sm"
          : "bg-gray-50 text-gray-700 hover:bg-gray-100"
        }
      `}
      whileHover={!isActive ? { backgroundColor: "rgb(243 244 246)" } : {}}
    >
      {label}
      {statusIcon}
      {isActive && (
        <motion.div
          className="h-0.5 bg-blue-500 absolute bottom-0 left-0 right-0"
          layoutId="activeTab"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </motion.button>
  );
};
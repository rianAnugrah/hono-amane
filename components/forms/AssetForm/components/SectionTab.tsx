import { motion } from "framer-motion";
import { SectionTabProps } from '../types';

export const SectionTab = ({
  id,
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
        transition={{ type: "spring" }}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
        </svg>
      </motion.span>
    );
  } else if (status === "error") {
    statusIcon = (
      <motion.span 
        className="ml-2 text-red-500"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring" }}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
        </svg>
      </motion.span>
    );
  }
  
  return (
    <motion.button
      onClick={onClick}
      className={`px-4 py-2 font-medium rounded-t-lg flex items-center ${
        isActive
          ? "bg-white text-blue-600"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
      // whileTap={{ scale: 0.95 }}
    >
      {label}
      {statusIcon}
      {isActive && (
        <motion.div
          className="h-0.5 bg-blue-600 mt-1 absolute bottom-0 left-0 right-0"
          layoutId="activeTab"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </motion.button>
  );
};
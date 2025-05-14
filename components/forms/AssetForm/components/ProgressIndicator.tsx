import { motion } from "framer-motion";
import { ProgressIndicatorProps } from '../types';

export const ProgressIndicator = ({
  sections,
  activeSection,
  sectionStatus,
  onSectionClick
}: ProgressIndicatorProps) => {
  const getProgressColor = (section: string) => {
    const status = sectionStatus[section as keyof typeof sectionStatus];
    if (status === "complete") return "bg-green-500";
    if (status === "error") return "bg-red-500";
    return section === activeSection ? "bg-blue-500" : "bg-gray-200";
  };

  const getProgressSize = (section: string) => {
    return section === activeSection ? "w-4 h-4" : "w-3 h-3";
  };

  return (
    <div className="flex items-center py-4">
      {sections.map((section, index) => (
        <div key={section} className="flex items-center">
          <motion.div 
            className={`${getProgressSize(section)} rounded-full cursor-pointer ${getProgressColor(section)} shadow-sm`}
            whileHover={{ scale: 1.2 }}
            onClick={() => onSectionClick(section)}
            animate={section === activeSection ? { scale: [1, 1.15, 1] } : {}}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            initial={{ scale: 1 }}
          />
          {index < sections.length - 1 && (
            <div className="relative px-2 flex items-center">
              <motion.div 
                className="w-10 h-0.5 bg-gray-200"
                initial={{ scale: 1 }} 
              />
              <motion.div 
                className={`absolute left-2 top-0 h-0.5 ${
                  sectionStatus[section as keyof typeof sectionStatus] === "complete" 
                    ? "bg-green-500" 
                    : "bg-transparent"
                }`}
                initial={{ width: 0 }}
                animate={{ 
                  width: sectionStatus[section as keyof typeof sectionStatus] === "complete" ? "100%" : 0 
                }}
                transition={{ duration: 0.4 }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
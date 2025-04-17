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
    return section === activeSection ? "bg-blue-600" : "bg-gray-300";
  };

  return (
    <div className="flex items-center space-x-1">
      {sections.map((section, index) => (
        <div key={section} className="flex items-center">
          <motion.div 
            className={`w-3 h-3 rounded-full cursor-pointer ${getProgressColor(section)}`}
            whileHover={{ scale: 1.2 }}
            onClick={() => onSectionClick(section)}
            animate={section === activeSection ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.5 }}
          />
          {index < sections.length - 1 && (
            <motion.div 
              className={`w-8 h-0.5 ${
                sectionStatus[section as keyof typeof sectionStatus] === "complete" 
                  ? "bg-green-500" 
                  : "bg-gray-300"
              }`} 
            />
          )}
        </div>
      ))}
    </div>
  );
};
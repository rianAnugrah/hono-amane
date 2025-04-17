import { motion } from "framer-motion";
import { NavigationButtonsProps } from '../types';

export const NavigationButtons = ({
  activeSection,
  isFormValid,
  onPrevious,
  onNext,
  onSubmit,
  onCancel,
  editingId
}: NavigationButtonsProps) => {
  return (
    <motion.div 
      className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="flex space-x-3">
        {activeSection !== "basic" && (
          <motion.button
            onClick={onPrevious}
            className="flex-1 bg-gray-200 text-gray-700 px-4 py-3 rounded-xl font-medium active:bg-gray-300"
            whileTap={{ scale: 0.95 }}
          >
            Previous
          </motion.button>
        )}
        
        {activeSection !== "dates" && (
          <motion.button
            onClick={onNext}
            className="flex-1 bg-gray-200 text-gray-700 px-4 py-3 rounded-xl font-medium active:bg-gray-300"
            whileTap={{ scale: 0.95 }}
          >
            Next
          </motion.button>
        )}
      </div>
      
      <div className="flex space-x-3 flex-1">
        {activeSection === "dates" && (
          <motion.button
            onClick={onSubmit}
            disabled={!isFormValid}
            className={`flex-1 px-4 py-3 rounded-xl font-medium ${
              isFormValid 
                ? "bg-blue-500 text-white hover:bg-blue-600" 
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            whileTap={isFormValid ? { scale: 0.95 } : {}}
          >
            {editingId ? "Update" : "Create"} Asset
          </motion.button>
        )}
        
        <motion.button
          onClick={onCancel}
          className="flex-1 bg-gray-200 text-gray-700 px-4 py-3 rounded-xl font-medium"
          whileTap={{ scale: 0.95 }}
        >
          Cancel
        </motion.button>
      </div>
    </motion.div>
  );
};
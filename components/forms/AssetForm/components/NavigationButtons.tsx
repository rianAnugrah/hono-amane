import { motion } from "framer-motion";
import { NavigationButtonsProps } from "../types";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const NavigationButtons = ({
  activeSection,
  isFormValid,
  onPrevious,
  onNext,
  onSubmit,
  onCancel,
  editingId,
}: NavigationButtonsProps) => {
  return (
    <motion.div
      className="grid grid-cols-2 gap-2 "
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      {activeSection !== "basic" ? (
        <motion.button
          onClick={onPrevious}
          className="flex items-center btn btn-ghost"
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft/> Previous
        </motion.button>
      ) : (
        <motion.button className="block">&nbsp;</motion.button>
      )}

      {activeSection !== "dates" && (
        <motion.button
          onClick={onNext}
           className="flex items-center btn btn-ghost"
          whileTap={{ scale: 0.95 }}
        >
          Next <ChevronRight />
        </motion.button>
      )}

      {activeSection === "dates" && (
        <motion.button
          onClick={onSubmit}
          disabled={!isFormValid}
          className={`btn btn-ghost ${
            isFormValid
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          whileTap={isFormValid ? { scale: 0.95 } : {}}
        >
           {editingId ? "Update Asset" : "Create Asset"} 
        </motion.button>
      )}
    </motion.div>
  );
};

import { motion } from "framer-motion";
import { NavigationButtonsProps } from "../types";
import { ChevronLeft, ChevronRight, Save } from "lucide-react";
import Button from "../../../ui/button";

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
      className="grid grid-cols-2 gap-4 mt-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {activeSection !== "basic" ? (
        <Button 
          onClick={onPrevious}
          variant="secondary"
          icon={<ChevronLeft size={16} />}
          iconPosition="left"
        >
          Previous
        </Button>
      ) : (
        <Button 
          onClick={onCancel}
          variant="tertiary"
        >
          Cancel
        </Button>
      )}

      {activeSection !== "dates" ? (
        <Button
          onClick={onNext}
          variant="primary"
          icon={<ChevronRight size={16} />}
          iconPosition="right"
        >
          Next
        </Button>
      ) : (
        <Button
          onClick={onSubmit}
          disabled={!isFormValid}
          variant={isFormValid ? "success" : "secondary"}
          icon={<Save size={16} />}
          iconPosition="left"
        >
          {editingId ? "Update Asset" : "Create Asset"}
        </Button>
      )}
    </motion.div>
  );
};

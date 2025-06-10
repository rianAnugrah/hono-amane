import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import AssetForm from "@/components/forms/AssetForm";
import { AssetFormValues } from "@/components/forms/AssetForm/types";

interface AssetFormModalProps {
  showForm: boolean;
  editingId: string | null;
  form: AssetFormValues;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | { target: { value: string | number | string[]; name: string }; currentTarget?: { value: string | number | string[]; name: string } }) => void;
  handleSubmit: () => void;
  handleCancel: () => void;
}

export default function AssetFormModal({
  showForm,
  editingId,
  form,
  handleChange,
  handleSubmit,
  handleCancel
}: AssetFormModalProps) {
  return (
    <AnimatePresence>
      {showForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm p-6"
        >
          <AssetForm
            editingId={editingId}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            handleCancel={handleCancel}
            form={form}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
} 
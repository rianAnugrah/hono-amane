import React from "react";
import { XCircle } from "lucide-react";
import { motion } from "framer-motion";
import AuditForm from "@/components/audit/AuditForm";

interface InspectionFormData {
  assetId?: string;
  condition?: string;
  notes?: string;
  inspectorId?: string;
  [key: string]: unknown;
}

// New Inspection Form component
const NewInspectionForm = ({
  assetId,
  onSubmit,
  onCancel,
}: {
  assetId?: string;
  onSubmit: (formData: InspectionFormData) => Promise<void>;
  onCancel: () => void;
}) => (
  <motion.div 
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-lg"
  >
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-sm font-medium text-blue-800">New Inspection Entry</h3>
      <button onClick={onCancel} className="text-blue-600 p-1 hover:bg-blue-100 rounded-full">
        <XCircle size={16} />
      </button>
    </div>
    
    <AuditForm 
      assetId={assetId}
      onSubmit={async (formData) => {
        try {
          const res = await fetch("/api/asset-audit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          });
          
          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || "Unknown error");
          }
          
          await onSubmit(formData as InspectionFormData);
        } catch (error) {
          console.error("Error submitting audit:", error);
          throw error;
        }
      }}
      onCancel={onCancel}
      showAssetSelector={false}
      isCompact={true}
      submitButtonText="Save Inspection"
    />
  </motion.div>
);

export default NewInspectionForm; 
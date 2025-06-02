import { useState } from "react";
import { navigate } from "vike/client/router";
import AuditForm from "@/components/audit/AuditForm";

interface AuditFormData {
  assetId: string;
  condition: string;
  notes?: string;
  images?: string[];
}

export default function NewAssetAuditPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: AuditFormData) => {
    setIsSubmitting(true);
    
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
      
      navigate("/audit");
    } catch (error) {
      console.error("Error submitting audit:", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">New Asset Audit</h1>
      <AuditForm 
        onSubmit={handleSubmit}
        submitButtonText="Create Audit"
        isLoading={isSubmitting}
      />
    </div>
  );
}

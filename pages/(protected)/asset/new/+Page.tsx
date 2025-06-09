import { useEffect } from "react";
import { navigate } from "vike/client/router";
import { useAssetForm } from "@/hooks/useAssetForm";
import AssetForm from "@/components/forms/AssetForm";
import { ArrowLeft, Save } from "lucide-react";

export default function Page() {
  // Use the asset form hook for handling form state and operations
  const {
    form,
    editingId,
    handleChange,
    handleSubmit,
    startCreate,
    isSubmitting
  } = useAssetForm({
    onSuccess: () => {
      // Navigate back to the asset list after successful submission
      navigate("/asset");
    }
  });

  // Initialize the create form when the component mounts
  useEffect(() => {
    startCreate();
  }, []);

  // Handle navigating back to the asset list
  const handleBack = () => {
    navigate("/asset");
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={handleBack} 
          className="btn btn-ghost flex items-center gap-2"
        >
          <ArrowLeft size={16} /> Back to Assets
        </button>
        
        <button 
          onClick={handleSubmit} 
          disabled={isSubmitting}
          className="btn btn-primary flex items-center gap-2"
        >
          <Save size={16} />
          {isSubmitting ? "Creating..." : "Create Asset"}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Create New Asset</h1>
        
        <AssetForm
          editingId={editingId}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          handleCancel={handleBack}
          form={form}
        />
      </div>
    </div>
  );
} 
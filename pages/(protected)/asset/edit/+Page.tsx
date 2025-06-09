import { useEffect, useState } from "react";
import axios from "axios";
import { navigate } from "vike/client/router";
import { usePageContext } from "vike-react/usePageContext";
import { useAssetForm } from "@/hooks/useAssetForm";
import AssetForm from "@/components/forms/AssetForm";
import { ArrowLeft, Save } from "lucide-react";

export default function Page() {
  const pageContext = usePageContext();
  const { id } = pageContext.routeParams || {};
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use the asset form hook for handling form state and operations
  const {
    form,
    editingId,
    handleChange,
    handleSubmit,
    startEdit,
    isSubmitting
  } = useAssetForm({
    onSuccess: () => {
      // Navigate back to the asset list after successful submission
      navigate("/asset");
    }
  });

  // Load the asset data when the component mounts
  useEffect(() => {
    const fetchAsset = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        setError(null);
        const { data } = await axios.get(`/api/assets/${id}`);
        
        // Load the asset data into the form for editing
        startEdit(data);
      } catch (error) {
        console.error("Failed to fetch asset:", error);
        setError("Failed to load asset data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAsset();
  }, [id]);

  // Handle navigating back to the asset list
  const handleBack = () => {
    navigate("/asset");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-red-500">{error}</p>
        <button 
          onClick={handleBack} 
          className="btn btn-primary"
        >
          Back to Asset List
        </button>
      </div>
    );
  }

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
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">
          {editingId ? "Edit Asset" : "New Asset"}
        </h1>
        
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
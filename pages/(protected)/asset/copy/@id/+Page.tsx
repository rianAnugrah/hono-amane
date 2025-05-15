import { useEffect, useState } from "react";
import axios from "axios";
import { navigate } from "vike/client/router";
import { usePageContext } from "@/renderer/usePageContext";
import { Asset } from "../../types";
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
    setForm,
    handleChange,
    handleSubmit,
    startCreate,
    handleCancel,
    isSubmitting
  } = useAssetForm({
    onSuccess: () => {
      // Navigate back to the asset list after successful submission
      navigate("/asset");
    }
  });

  // Load the asset data to copy when the component mounts
  useEffect(() => {
    const fetchAssetToCopy = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        setError(null);
        const { data } = await axios.get(`/api/assets/${id}`);
        
        // Initialize the form for a new asset but with data from the existing one
        startCreate();
        
        // Copy most fields but clear unique identifiers
        setForm({
          ...form,
          assetNo: `COPY-${data.assetNo || ""}`,
          lineNo: `COPY-${data.lineNo || ""}`,
          assetName: `Copy of ${data.assetName || ""}`,
          projectCode_id: data.projectCode_id,
          locationDesc_id: data.locationDesc_id,
          detailsLocation_id: data.detailsLocation_id,
          condition: data.condition,
          acqValue: data.acqValue,
          acqValueIdr: data.acqValueIdr,
          bookValue: data.bookValue,
          accumDepre: data.accumDepre,
          adjustedDepre: data.adjustedDepre,
          ytdDepre: data.ytdDepre,
          pisDate: data.pisDate,
          transDate: data.transDate,
          categoryCode: data.categoryCode,
          images: []  // Don't copy images
        });
      } catch (error) {
        console.error("Failed to fetch asset:", error);
        setError("Failed to load source asset data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssetToCopy();
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
          {isSubmitting ? "Creating..." : "Create Copy"}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Create Asset Copy</h1>
        <p className="text-gray-500 mb-6">
          You are creating a copy of an existing asset. Review and modify the details below before saving.
        </p>
        
        <AssetForm
          editingId={null}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          handleCancel={handleBack}
          form={form}
        />
      </div>
    </div>
  );
} 
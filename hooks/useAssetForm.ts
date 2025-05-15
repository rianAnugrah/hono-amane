import { useState } from "react";
import axios from "axios";
import { Asset } from "@/pages/(protected)/asset/types";
import { AssetFormValues } from "@/components/forms/AssetForm/types";

const defaultFormValues: AssetFormValues = {
  assetNo: "",
  lineNo: "",
  assetName: "",
  projectCode_id: null,
  locationDesc_id: null,
  detailsLocation_id: null,
  condition: "",
  acqValue: null,
  acqValueIdr: null,
  bookValue: null,
  accumDepre: null,
  adjustedDepre: null,
  ytdDepre: null,
  pisDate: "",
  transDate: "",
  categoryCode: "",
  images: []
};

interface UseAssetFormProps {
  onSuccess?: (asset: Asset) => void;
}

export function useAssetForm({ onSuccess }: UseAssetFormProps = {}) {
  const [form, setForm] = useState<AssetFormValues>(defaultFormValues);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Reset form to default values
  const resetForm = () => {
    setForm(defaultFormValues);
    setEditingId(null);
  };

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Handle array values (like images)
    if (name === 'images') {
      setForm(prev => ({ ...prev, [name]: Array.isArray(value) ? value : [] }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  // Submit form data to API
  const handleSubmit = async () => {
    try {
      console.log("handleSubmit called with editingId:", editingId, "and form:", form);
      setIsSubmitting(true);
      let updatedAsset = null;
      
      if (editingId) {
        console.log("Updating asset with ID:", editingId);
        const response = await axios.put(`/api/assets/${editingId}`, form);
        console.log("Update response:", response.data);
        updatedAsset = response.data;
        
        // Fetch the latest version of the asset to ensure we have all fields
        try {
          console.log("Fetching latest asset version after update");
          const refreshResponse = await axios.get(`/api/assets/${response.data.id}`);
          updatedAsset = refreshResponse.data;
          console.log("Got latest asset version:", updatedAsset);
        } catch (refreshError) {
          console.error("Error fetching latest asset version:", refreshError);
          // Continue with the response data we have
        }
      } else {
        console.log("Creating new asset");
        const response = await axios.post("/api/assets", form);
        console.log("Create response:", response.data);
        updatedAsset = response.data;
      }
      
      resetForm();
      setShowForm(false);
      
      // Call the onSuccess callback if provided
      if (onSuccess) {
        console.log("Calling onSuccess callback with updated asset:", updatedAsset);
        onSuccess(updatedAsset);
      }
    } catch (error) {
      console.error("Failed to save asset:", error);
      if (axios.isAxiosError(error) && error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Load asset data into form for editing
  const startEdit = (asset: Asset) => {
    // Convert the Asset object to the expected AssetFormValues structure
    const formValues: AssetFormValues = {
      assetNo: asset.assetNo || "",
      lineNo: asset.lineNo || "",
      assetName: asset.assetName || "",
      projectCode_id: asset.projectCode_id || null,
      locationDesc_id: asset.locationDesc_id || null,
      detailsLocation_id: asset.detailsLocation_id || null,
      condition: asset.condition || "",
      acqValue: asset.acqValue || null,
      acqValueIdr: asset.acqValueIdr || null,
      bookValue: asset.bookValue || null,
      accumDepre: asset.accumDepre || null,
      adjustedDepre: asset.adjustedDepre || null,
      ytdDepre: asset.ytdDepre || null,
      pisDate: asset.pisDate || "",
      transDate: asset.transDate || "",
      categoryCode: asset.categoryCode || "",
      images: asset.images || []
    };
    
    setForm(formValues);
    setEditingId(asset.id);
    setShowForm(true);
  };

  // Start new asset creation
  const startCreate = () => {
    resetForm();
    setShowForm(true);
  };

  // Cancel editing/creating and close form
  const handleCancel = () => {
    resetForm();
    setShowForm(false);
  };

  return {
    form,
    editingId,
    showForm,
    isSubmitting,
    setForm,
    setShowForm,
    handleChange,
    handleSubmit,
    startEdit,
    startCreate,
    handleCancel
  };
} 
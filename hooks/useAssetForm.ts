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
  onSuccess?: () => void;
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
      setIsSubmitting(true);
      if (editingId) {
        await axios.put(`/api/assets/${editingId}`, form);
      } else {
        await axios.post("/api/assets", form);
      }
      
      resetForm();
      setShowForm(false);
      
      // Call the onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Failed to save asset:", error);
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
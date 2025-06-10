import { useEffect, useState, useMemo, useCallback, memo } from "react";
import { AssetFormValues } from "./types";
import { useZodValidation } from "./hooks/useZodValidation";
import { FormField } from "./components/FormField";
import { SelectField } from "./components/SelectField";
import { DatePickerFields } from "./components/DatepickerFields";
import { InputUpload } from "@/components/ui/input-upload";
import axios from "axios";
import { X } from "lucide-react";

// Define interfaces for location and project code data
interface LocationOption {
  id: number;
  description: string;
}

interface ProjectCode {
  id: number;
  code: string;
}

interface AssetFormProps {
  editingId: string | null;
  form: AssetFormValues;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | { target: { value: string | number | string[]; name: string }; currentTarget?: { value: string | number | string[]; name: string } }) => void;
  handleSubmit: () => void;
  handleCancel: () => void;
  hasToolbar?: boolean;
}

// Static options
const categoryCodeOptions = [
  { label: "Select", value: "" },
  { label: "A", value: "A" },
  { label: "B", value: "B" },
  { label: "C", value: "C" },
  { label: "D", value: "D" },
  { label: "E", value: "E" },
  { label: "F", value: "F" },
  { label: "G", value: "G" },
];

const typeOptions = [
  { label: "Select", value: "" },
  { label: "HBI", value: "HBI" },
  { label: "HBM", value: "HBM" },
];

const conditionOptions = [
  { value: "", label: "Select" },
  { value: "Good", label: "Good" },
  { value: "Broken", label: "Broken" },
  { value: "X", label: "X" },
  { value: "poor", label: "Poor" },
];

function AssetForm({
  editingId,
  form,
  handleChange,
  handleSubmit,
  handleCancel,
  hasToolbar = true,
}: AssetFormProps) {
  const [locationOptions, setLocationOptions] = useState<LocationOption[]>([]);
  const [projectCodes, setProjectCodes] = useState<ProjectCode[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { 
    validateOnSubmit, 
    getFieldError, 
    hasFieldError, 
    isFormValid,
    clearErrors 
  } = useZodValidation(form);

  // Simple change handler without validation
  const handleChangeWithClearErrors = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | { target: { value: string | number | string[]; name: string }; currentTarget?: { value: string | number | string[]; name: string } }) => {
    handleChange(e);
    // Optional: Clear errors when user starts typing after a failed submit
    // clearErrors();
  }, [handleChange]);



  // Enhanced submit handler with validation
  const handleSubmitWithValidation = useCallback(() => {
    if (validateOnSubmit()) {
      handleSubmit();
    }
    // If validation fails, errors will be shown automatically
  }, [validateOnSubmit, handleSubmit]);

  // Fetch data functions
  const fetchLocations = useCallback(async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const res = await axios.get("/api/locations");
      setLocationOptions(res.data);
    } catch (error) {
      console.error("Failed to fetch locations:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  const fetchProjectCode = useCallback(async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const res = await axios.get("/api/project-codes");
      setProjectCodes(res.data);
    } catch (error) {
      console.error("Failed to fetch project codes:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  // Fetch data on mount
  useEffect(() => {
    fetchLocations();
    fetchProjectCode();
  }, []);

  // Memoize select options
  const locationSelectOptions = useMemo(() => [
    { label: "Select", value: "" },
    ...locationOptions.map((loc) => ({
      label: loc.description,
      value: loc.id,
    })),
  ], [locationOptions]);

  const projectCodeSelectOptions = useMemo(() => [
    { label: "Select", value: "" },
    ...projectCodes.map((pc) => ({
      label: pc.code,
      value: pc.id,
    })),
  ], [projectCodes]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-900">
          {editingId ? "Edit Asset" : "Create New Asset"}
        </h2>
        {hasToolbar && (
          <button 
            onClick={handleCancel}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Form Content */}
      <div className="p-6 space-y-8 h-[calc(100vh-14rem)] flex flex-col overflow-y-auto">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
            Basic Information
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <SelectField
              name="projectCode_id"
              label="Project Code"
              placeholder="Select project code"
              value={form.projectCode_id}
              onChange={handleChangeWithClearErrors}
              onBlur={validateOnSubmit}
              options={projectCodeSelectOptions}
              validation={hasFieldError("projectCode_id") ? "invalid" : "valid"}
              touched={hasFieldError("projectCode_id")}
              errorMessage={getFieldError("projectCode_id")}
            />
            <SelectField
              name="type"
              label="Asset Type"
              placeholder="Select asset type"
              value={form.type}
              onChange={handleChangeWithClearErrors}
              onBlur={validateOnSubmit}
              options={typeOptions}
              validation={hasFieldError("type") ? "invalid" : "valid"}
              touched={hasFieldError("type")}
              errorMessage={getFieldError("type")}
            />
            <FormField
              name="assetNo"
              label="Asset Number"
              placeholder="Enter asset number"
              value={form.assetNo}
              onChange={handleChangeWithClearErrors}
              onBlur={validateOnSubmit}
              validation={hasFieldError("assetNo") ? "invalid" : "valid"}
              touched={hasFieldError("assetNo")}
              errorMessage={getFieldError("assetNo")}
            />
            <FormField
              name="lineNo"
              label="Line Number"
              placeholder="Enter line number"
              value={form.lineNo}
              onChange={handleChangeWithClearErrors}
              onBlur={validateOnSubmit}
              validation={hasFieldError("lineNo") ? "invalid" : "valid"}
              touched={hasFieldError("lineNo")}
              errorMessage={getFieldError("lineNo")}
            />
            <div className="lg:col-span-2">
              <FormField
                name="assetName"
                label="Asset Name"
                placeholder="Enter asset name"
                value={form.assetName}
                onChange={handleChangeWithClearErrors}
                onBlur={validateOnSubmit}
                validation={hasFieldError("assetName") ? "invalid" : "valid"}
                touched={hasFieldError("assetName")}
                errorMessage={getFieldError("assetName")}
              />
            </div>
          </div>
        </div>

        {/* Location Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
            Location Information
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <SelectField
              name="categoryCode"
              label="Category Code"
              placeholder="Select category code"
              value={form.categoryCode}
              onChange={handleChangeWithClearErrors}
              onBlur={validateOnSubmit}
              validation={hasFieldError("categoryCode") ? "invalid" : "valid"}
              options={categoryCodeOptions}
              touched={hasFieldError("categoryCode")}
              errorMessage={getFieldError("categoryCode")}
            />
            <SelectField
              name="locationDesc_id"
              label="Location"
              placeholder="Select location"
              value={form.locationDesc_id}
              onChange={handleChangeWithClearErrors}
              onBlur={validateOnSubmit}
              options={locationSelectOptions}
              searchable={true}
              searchPlaceholder="Search locations..."
              validation={hasFieldError("locationDesc_id") ? "invalid" : "valid"}
              touched={hasFieldError("locationDesc_id")}
              errorMessage={getFieldError("locationDesc_id")}
            />
            <SelectField
              name="condition"
              label="Asset Condition"
              placeholder="Select condition"
              value={form.condition}
              onChange={handleChangeWithClearErrors}
              onBlur={validateOnSubmit}
              options={conditionOptions}
              validation={hasFieldError("condition") ? "invalid" : "valid"}
              touched={hasFieldError("condition")}
              errorMessage={getFieldError("condition")}
            />
          </div>
        </div>

        {/* Financial Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
            Financial Information
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <FormField
              name="acqValue"
              label="Acquisition Value"
              placeholder="Enter acquisition value"
              type="number"
              value={form.acqValue}
              onChange={handleChangeWithClearErrors}
              onBlur={validateOnSubmit}
              validation={hasFieldError("acqValue") ? "invalid" : "valid"}
              touched={hasFieldError("acqValue")}
              errorMessage={getFieldError("acqValue")}
            />
            <FormField
              name="acqValueIdr"
              label="Acquisition Value (IDR)"
              placeholder="Enter IDR value"
              type="number"
              value={form.acqValueIdr}
              onChange={handleChangeWithClearErrors}
              onBlur={validateOnSubmit}
              validation={hasFieldError("acqValueIdr") ? "invalid" : "valid"}
              touched={hasFieldError("acqValueIdr")}
              errorMessage={getFieldError("acqValueIdr")}
            />
            <FormField
              name="bookValue"
              label="Book Value"
              placeholder="Enter book value"
              type="number"
              value={form.bookValue}
              onChange={handleChangeWithClearErrors}
              onBlur={validateOnSubmit}
              validation={hasFieldError("bookValue") ? "invalid" : "valid"}
              touched={hasFieldError("bookValue")}
              errorMessage={getFieldError("bookValue")}
            />
          </div>
        </div>

        {/* Depreciation Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
            Depreciation Information
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <FormField
              name="accumDepre"
              label="Accumulated Depreciation"
              placeholder="Enter accumulated depreciation"
              type="number"
              value={form.accumDepre}
              onChange={handleChangeWithClearErrors}
              onBlur={validateOnSubmit}
              validation={hasFieldError("accumDepre") ? "invalid" : "valid"}
              touched={hasFieldError("accumDepre")}
              errorMessage={getFieldError("accumDepre")}
            />
            <FormField
              name="adjustedDepre"
              label="Adjusted Depreciation"
              placeholder="Enter adjusted depreciation"
              type="number"
              value={form.adjustedDepre}
              onChange={handleChangeWithClearErrors}
              onBlur={validateOnSubmit}
              validation={hasFieldError("adjustedDepre") ? "invalid" : "valid"}
              touched={hasFieldError("adjustedDepre")}
              errorMessage={getFieldError("adjustedDepre")}
            />
            <FormField
              name="ytdDepre"
              label="YTD Depreciation"
              placeholder="Enter YTD depreciation"
              type="number"
              value={form.ytdDepre}
              onChange={handleChangeWithClearErrors}
              onBlur={validateOnSubmit}
              validation={hasFieldError("ytdDepre") ? "invalid" : "valid"}
              touched={hasFieldError("ytdDepre")}
              errorMessage={getFieldError("ytdDepre")}
            />
          </div>
        </div>

        {/* Date Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
            Important Dates
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <DatePickerFields
              name="pisDate"
              label="PIS Date"
              placeholder="YYYY-MM-DD"
              value={form.pisDate}
              onChange={handleChangeWithClearErrors}
              onBlur={validateOnSubmit}
              validation={hasFieldError("pisDate") ? "invalid" : "valid"}
              touched={hasFieldError("pisDate")}
              errorMessage={getFieldError("pisDate")}
            />
            <DatePickerFields
              name="transDate"
              label="Transaction Date"
              placeholder="YYYY-MM-DD"
              value={form.transDate}
              onChange={handleChangeWithClearErrors}
              onBlur={validateOnSubmit}
              validation={hasFieldError("transDate") ? "invalid" : "valid"}
              touched={hasFieldError("transDate")}
              errorMessage={getFieldError("transDate")}
            />
          </div>
        </div>

        {/* Asset Images */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
            Asset Images
          </h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <InputUpload
              useCamera={true} 
              value={form.images || []}
              onChange={(newImages) => {
                const syntheticEvent = {
                  target: {
                    name: 'images',
                    value: newImages
                  }
                } as unknown as React.ChangeEvent<HTMLInputElement>;
                handleChange(syntheticEvent);
              }}
            />
            <p className="text-sm text-gray-600 mt-2">
              Upload images of the asset for documentation purposes. You can use your camera or upload existing files.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end items-center gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
        <button
          onClick={handleCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmitWithValidation}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          {editingId ? "Update Asset" : "Create Asset"}
        </button>
      </div>
    </div>
  );
}

export default memo(AssetForm);
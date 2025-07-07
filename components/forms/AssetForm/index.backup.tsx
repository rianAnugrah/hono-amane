import { useEffect, useState, useMemo, useCallback, memo } from "react";
import { AnimatePresence } from "framer-motion";
import { AssetFormValues } from "./types";
import { getErrorMessage } from "./validation";
import { useFormValidation } from "./hooks/useFormValidation";
import { FormField } from "./components/FormField";
import { SectionTab } from "./components/SectionTab";
import { ProgressIndicator } from "./components/ProgressIndicator";
import { NavigationButtons } from "./components/NavigationButtons";
import { FormSection } from "./components/FormSection";
import { SelectField } from "./components/SelectField";
import { DatePickerFields } from "./components/DatepickerFields";
import { InputUpload } from "@/components/ui/input-upload";
import axios from "axios";
import { X, Layers, ScrollText } from "lucide-react";

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

// Memoize static options to prevent recreation
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

const sections = ["basic", "location", "financial", "depreciation", "dates", "images"];

function AssetForm({
  editingId,
  form,
  handleChange,
  handleSubmit,
  handleCancel,
  hasToolbar = true,
}: AssetFormProps) {
  const [activeSection, setActiveSection] = useState("basic");
  const [direction, setDirection] = useState(0);
  const [locationOptions, setLocationOptions] = useState<LocationOption[]>([]);
  const [projectCodes, setProjectCodes] = useState<ProjectCode[]>([]);
  const [isVerticalMode, setIsVerticalMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const { touchedFields, validation, sectionStatus, markFieldTouched, isFormValid, validateAllFields } =
    useFormValidation(form);

  // Create a simple blur handler that always works
  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLSelectElement> | { target: { name: string } }) => {
    const fieldName = e.target.name;
    
    // Always trigger validation using the simplified method
    markFieldTouched(fieldName);
  }, [markFieldTouched]);

  // Enhanced change handler that includes validation for better UX
  const handleChangeWithValidation = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | { target: { value: string | number | string[]; name: string }; currentTarget?: { value: string | number | string[]; name: string } }) => {
    const fieldName = e.target.name;
    
    // Call the original change handler
    handleChange(e);
    
    // If field has been touched before, validate immediately for responsive feedback
    if (touchedFields.has(fieldName)) {
      // Small delay to ensure form state is updated first
      setTimeout(() => {
        markFieldTouched(fieldName);
      }, 50);
    }
  }, [handleChange, touchedFields, markFieldTouched]);

  // Memoize navigation functions
  const navigateSection = useCallback((next: boolean) => {
    const currentIndex = sections.indexOf(activeSection);
    const newIndex = next ? currentIndex + 1 : currentIndex - 1;

    if (newIndex >= 0 && newIndex < sections.length) {
      setDirection(next ? 1 : -1);
      setActiveSection(sections[newIndex]);
    }
  }, [activeSection]);

  const handleSectionClick = useCallback((section: string) => {
    const currentIndex = sections.indexOf(activeSection);
    const newIndex = sections.indexOf(section);
    setDirection(newIndex > currentIndex ? 1 : -1);
    setActiveSection(section);
  }, [activeSection]);

  // Optimize data fetching with useCallback
  const fetchLocations = useCallback(async () => {
    if (isLoading) return; // Prevent multiple simultaneous requests
    
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
    if (isLoading) return; // Prevent multiple simultaneous requests
    
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

  // Fetch data only once
  useEffect(() => {
    fetchLocations();
    fetchProjectCode();
  }, []); // Remove dependencies to fetch only once

  // Validate all fields when in edit mode
  useEffect(() => {
    if (editingId) {
      validateAllFields();
    }
  }, [editingId, validateAllFields]);

  const toggleViewMode = useCallback(() => {
    setIsVerticalMode(!isVerticalMode);
  }, [isVerticalMode]);

  // Memoize location and project code options
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
    <div className="bg-white p-6 rounded-lg shadow-sm mb-6 h-full overflow-y-auto relative">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">
        {editingId ? "Edit" : "Create"} Asset
      </h2>

      {hasToolbar && (
        <div className="absolute right-8 top-6 flex items-center gap-2">
          <button 
          className={`btn btn-sm ${isVerticalMode ? 'btn-ghost' : 'btn-primary'}`} 
          onClick={toggleViewMode} 
          title="Slide View"
        >
          <Layers size={18} />
        </button>
        <button 
          className={`btn btn-sm ${isVerticalMode ? 'btn-primary' : 'btn-ghost'}`} 
          onClick={toggleViewMode} 
          title="Vertical View"
        >
          <ScrollText size={18} />
        </button>
          <button className="btn btn-ghost" onClick={handleCancel}><X /></button>
        </div>
      )}
      
      {/* Navigation Tabs - only show in slide mode */}
      {!isVerticalMode && (
        <div className="flex space-x-1 mb-4 overflow-x-auto relative">
          {sections.map((section) => (
            <SectionTab
              key={section}
              id={section}
              label={section.charAt(0).toUpperCase() + section.slice(1)}
              isActive={activeSection === section}
              status={sectionStatus[section as keyof typeof sectionStatus]}
              onClick={() => handleSectionClick(section)}
            />
          ))}
        </div>
      )}

      {/* Form Sections */}
      <div
        className="relative overflow-hidden mb-6 flex"
        style={{ minHeight: isVerticalMode ? "auto" : "calc(100% - 220px)" }}
      >
        <div className="w-full relative">
          {isVerticalMode ? (
            // Vertical scroll mode - show all sections
            <div className="space-y-8">
              <div id="basic-section">
                <h3 className="text-lg font-medium mb-4 text-gray-700">Basic Information</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <SelectField
                    name="projectCode_id"
                    label="Project Code"
                    placeholder="Enter project code"
                    value={form.projectCode_id}
                    onChange={handleChangeWithValidation}
                    onBlur={handleBlur}
                    options={projectCodeSelectOptions}
                    validation={validation.projectCode_id}
                    touched={touchedFields.has("projectCode_id")}
                    errorMessage={getErrorMessage(
                      "projectCode_id",
                      validation.projectCode_id
                    )}
                  />
                    <SelectField
                    name="type"
                    label="Asset Type"
                    placeholder="Select asset type"
                    value={form.type}
                    onChange={handleChangeWithValidation}
                    onBlur={handleBlur}
                    options={typeOptions}
                    validation={validation.type}
                    touched={touchedFields.has("type")}
                    errorMessage={getErrorMessage("type", validation.type)}
                  />
                  <FormField
                    name="assetNo"
                    label="Asset No"
                    placeholder="Enter asset number"
                    value={form.assetNo}
                    onChange={handleChangeWithValidation}
                    onBlur={handleBlur}
                    validation={validation.assetNo}
                    touched={touchedFields.has("assetNo")}
                    errorMessage={getErrorMessage("assetNo", validation.assetNo)}
                  />
                  <FormField
                    name="lineNo"
                    label="Line No"
                    placeholder="Enter line number"
                    value={form.lineNo}
                    onChange={handleChangeWithValidation}
                    onBlur={handleBlur}
                    validation={validation.lineNo}
                    touched={touchedFields.has("lineNo")}
                    errorMessage={getErrorMessage("lineNo", validation.lineNo)}
                  />
                  <FormField
                    name="assetName"
                    label="Asset Name"
                    placeholder="Enter asset name"
                    value={form.assetName}
                    onChange={handleChangeWithValidation}
                    onBlur={handleBlur}
                    validation={validation.assetName}
                    touched={touchedFields.has("assetName")}
                    errorMessage={getErrorMessage(
                      "assetName",
                      validation.assetName
                    )}
                  />
                
                </div>
              </div>

              <div id="location-section">
                <h3 className="text-lg font-medium mb-4 text-gray-700">Location</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <SelectField
                    name="categoryCode"
                    label="Category Code"
                    placeholder="Enter category code"
                    value={form.categoryCode}
                    onChange={handleChangeWithValidation}
                    onBlur={handleBlur}
                    validation={validation.categoryCode}
                    options={categoryCodeOptions}
                    touched={touchedFields.has("categoryCode")}
                    errorMessage={getErrorMessage(
                      "categoryCode",
                      validation.categoryCode
                    )}
                  />
                  <SelectField
                    name="locationDesc_id"
                    label="Location"
                    placeholder="Enter location description"
                    value={form.locationDesc_id}
                    onChange={handleChangeWithValidation}
                    onBlur={handleBlur}
                    options={locationSelectOptions}
                    searchable={true}
                    searchPlaceholder="Search locations..."
                    validation={validation.locationDesc_id}
                    touched={touchedFields.has("locationDesc_id")}
                    errorMessage={getErrorMessage(
                      "locationDesc_id",
                      validation.locationDesc_id
                    )}
                  />
                  <SelectField
                    name="condition"
                    label="Condition"
                    placeholder="Enter asset condition"
                    value={form.condition}
                    onChange={handleChangeWithValidation}
                    options={conditionOptions}
                    onBlur={handleBlur}
                    validation={validation.condition}
                    touched={touchedFields.has("condition")}
                    errorMessage={getErrorMessage(
                      "condition",
                      validation.condition
                    )}
                  />
                </div>
              </div>

              <div id="financial-section">
                <h3 className="text-lg font-medium mb-4 text-gray-700">Financial Information</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <FormField
                    name="acqValue"
                    label="Acquisition Value"
                    placeholder="Enter acquisition value"
                    type="number"
                    value={form.acqValue}
                    onChange={handleChangeWithValidation}
                    onBlur={handleBlur}
                    validation={validation.acqValue}
                    touched={touchedFields.has("acqValue")}
                    errorMessage={getErrorMessage("acqValue", validation.acqValue)}
                  />
                  <FormField
                    name="acqValueIdr"
                    label="Acquisition Value (IDR)"
                    placeholder="Enter IDR value"
                    type="number"
                    value={form.acqValueIdr}
                    onChange={handleChangeWithValidation}
                    onBlur={handleBlur}
                    validation={validation.acqValueIdr}
                    touched={touchedFields.has("acqValueIdr")}
                    errorMessage={getErrorMessage(
                      "acqValueIdr",
                      validation.acqValueIdr
                    )}
                  />
                  <FormField
                    name="bookValue"
                    label="Book Value"
                    placeholder="Enter book value"
                    type="number"
                    value={form.bookValue}
                    onChange={handleChangeWithValidation}
                    onBlur={handleBlur}
                    validation={validation.bookValue}
                    touched={touchedFields.has("bookValue")}
                    errorMessage={getErrorMessage(
                      "bookValue",
                      validation.bookValue
                    )}
                  />
                </div>
              </div>

              <div id="depreciation-section">
                <h3 className="text-lg font-medium mb-4 text-gray-700">Depreciation</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <FormField
                    name="accumDepre"
                    label="Accumulated Depreciation"
                    placeholder="Enter accumulated depreciation"
                    type="number"
                    value={form.accumDepre}
                    onChange={handleChangeWithValidation}
                    onBlur={handleBlur}
                    validation={validation.accumDepre}
                    touched={touchedFields.has("accumDepre")}
                    errorMessage={getErrorMessage(
                      "accumDepre",
                      validation.accumDepre
                    )}
                  />
                  <FormField
                    name="adjustedDepre"
                    label="Adjusted Depreciation"
                    placeholder="Enter adjusted depreciation"
                    type="number"
                    value={form.adjustedDepre}
                    onChange={handleChangeWithValidation}
                    onBlur={handleBlur}
                    validation={validation.adjustedDepre}
                    touched={touchedFields.has("adjustedDepre")}
                    errorMessage={getErrorMessage(
                      "adjustedDepre",
                      validation.adjustedDepre
                    )}
                  />
                  <FormField
                    name="ytdDepre"
                    label="YTD Depreciation"
                    placeholder="Enter YTD depreciation"
                    type="number"
                    value={form.ytdDepre}
                    onChange={handleChangeWithValidation}
                    onBlur={handleBlur}
                    validation={validation.ytdDepre}
                    touched={touchedFields.has("ytdDepre")}
                    errorMessage={getErrorMessage("ytdDepre", validation.ytdDepre)}
                  />
                </div>
              </div>

              <div id="dates-section">
                <h3 className="text-lg font-medium mb-4 text-gray-700">Important Dates</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <DatePickerFields
                    name="pisDate"
                    label="PIS Date"
                    placeholder="YYYY-MM-DD"
                    value={form.pisDate}
                    onChange={handleChangeWithValidation}
                    onBlur={handleBlur}
                    validation={validation.pisDate}
                    touched={touchedFields.has("pisDate")}
                    errorMessage={getErrorMessage("pisDate", validation.pisDate)}
                  />
                  <DatePickerFields
                    name="transDate"
                    label="Transaction Date"
                    placeholder="YYYY-MM-DD"
                    value={form.transDate}
                    onChange={handleChangeWithValidation}
                    onBlur={handleBlur}
                    validation={validation.transDate}
                    touched={touchedFields.has("transDate")}
                    errorMessage={getErrorMessage(
                      "transDate",
                      validation.transDate
                    )}
                  />
                </div>
              </div>

              <div id="images-section">
                <h3 className="text-lg font-medium mb-4 text-gray-700">Asset Images</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="mt-1">
                    <InputUpload
                      useCamera={true} 
                      value={form.images || []}
                      onChange={(newImages) => {
                        if (handleChange && typeof handleChange === 'function') {
                          // Create a synthetic event to match the handler's expected signature
                          const syntheticEvent = {
                            target: {
                              name: 'images',
                              value: newImages
                            }
                          } as unknown as React.ChangeEvent<HTMLInputElement>;
                          handleChange(syntheticEvent);
                        }
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Upload images of the asset for documentation purposes. You can use your camera or upload existing files.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            // Slide mode - show only active section with animations
            <AnimatePresence initial={false} custom={direction} mode="wait">
              {activeSection === "basic" && (
                <FormSection direction={direction}>
                  <SelectField
                    name="projectCode_id"
                    label="Project Code"
                    placeholder="Enter project code"
                    value={form.projectCode_id}
                    onChange={handleChangeWithValidation}
                    onBlur={handleBlur}
                    options={projectCodeSelectOptions}
                    validation={validation.projectCode_id}
                    touched={touchedFields.has("projectCode_id")}
                    errorMessage={getErrorMessage(
                      "projectCode_id",
                      validation.projectCode_id
                    )}
                  />
                   <SelectField
                    name="type"
                    label="Asset Type"
                    placeholder="Select asset type"
                    value={form.type}
                    onChange={handleChangeWithValidation}
                    onBlur={handleBlur}
                    options={typeOptions}
                    validation={validation.type}
                    touched={touchedFields.has("type")}
                    errorMessage={getErrorMessage("type", validation.type)}
                  />
                  <FormField
                    name="assetNo"
                    label="Asset No"
                    placeholder="Enter asset number"
                    value={form.assetNo}
                    onChange={handleChangeWithValidation}
                    onBlur={handleBlur}
                    validation={validation.assetNo}
                    touched={touchedFields.has("assetNo")}
                    errorMessage={getErrorMessage("assetNo", validation.assetNo)}
                  />
                  <FormField
                    name="lineNo"
                    label="Line No"
                    placeholder="Enter line number"
                    value={form.lineNo}
                    onChange={handleChangeWithValidation}
                    onBlur={handleBlur}
                    validation={validation.lineNo}
                    touched={touchedFields.has("lineNo")}
                    errorMessage={getErrorMessage("lineNo", validation.lineNo)}
                  />
                  <FormField
                    name="assetName"
                    label="Asset Name"
                    placeholder="Enter asset name"
                    value={form.assetName}
                    onChange={handleChangeWithValidation}
                    onBlur={handleBlur}
                    validation={validation.assetName}
                    touched={touchedFields.has("assetName")}
                    errorMessage={getErrorMessage(
                      "assetName",
                      validation.assetName
                    )}
                  />
                 
                </FormSection>
              )}

              {activeSection === "location" && (
                <FormSection direction={direction}>
                  <SelectField
                    name="categoryCode"
                    label="Category Code"
                    placeholder="Enter category code"
                    value={form.categoryCode}
                    onChange={handleChangeWithValidation}
                    onBlur={handleBlur}
                    validation={validation.categoryCode}
                    options={categoryCodeOptions}
                    touched={touchedFields.has("categoryCode")}
                    errorMessage={getErrorMessage(
                      "categoryCode",
                      validation.categoryCode
                    )}
                  />
                  <SelectField
                    name="locationDesc_id"
                    label="Location"
                    placeholder="Enter location description"
                    value={form.locationDesc_id}
                    onChange={handleChangeWithValidation}
                    onBlur={handleBlur}
                    options={locationSelectOptions}
                    searchable={true}
                    searchPlaceholder="Search locations..."
                    validation={validation.locationDesc_id}
                    touched={touchedFields.has("locationDesc_id")}
                    errorMessage={getErrorMessage(
                      "locationDesc_id",
                      validation.locationDesc_id
                    )}
                  />
                  <SelectField
                    name="condition"
                    label="Condition"
                    placeholder="Enter asset condition"
                    value={form.condition}
                    onChange={handleChangeWithValidation}
                    options={conditionOptions}
                    onBlur={handleBlur}
                    validation={validation.condition}
                    touched={touchedFields.has("condition")}
                    errorMessage={getErrorMessage(
                      "condition",
                      validation.condition
                    )}
                  />
                </FormSection>
              )}

              {activeSection === "financial" && (
                <FormSection direction={direction}>
                  <FormField
                    name="acqValue"
                    label="Acquisition Value"
                    placeholder="Enter acquisition value"
                    type="number"
                    value={form.acqValue}
                    onChange={handleChangeWithValidation}
                    onBlur={handleBlur}
                    validation={validation.acqValue}
                    touched={touchedFields.has("acqValue")}
                    errorMessage={getErrorMessage("acqValue", validation.acqValue)}
                  />
                  <FormField
                    name="acqValueIdr"
                    label="Acquisition Value (IDR)"
                    placeholder="Enter IDR value"
                    type="number"
                    value={form.acqValueIdr}
                    onChange={handleChangeWithValidation}
                    onBlur={handleBlur}
                    validation={validation.acqValueIdr}
                    touched={touchedFields.has("acqValueIdr")}
                    errorMessage={getErrorMessage(
                      "acqValueIdr",
                      validation.acqValueIdr
                    )}
                  />
                  <FormField
                    name="bookValue"
                    label="Book Value"
                    placeholder="Enter book value"
                    type="number"
                    value={form.bookValue}
                    onChange={handleChangeWithValidation}
                    onBlur={handleBlur}
                    validation={validation.bookValue}
                    touched={touchedFields.has("bookValue")}
                    errorMessage={getErrorMessage(
                      "bookValue",
                      validation.bookValue
                    )}
                  />
                </FormSection>
              )}

              {activeSection === "depreciation" && (
                <FormSection direction={direction}>
                  <FormField
                    name="accumDepre"
                    label="Accumulated Depreciation"
                    placeholder="Enter accumulated depreciation"
                    type="number"
                    value={form.accumDepre}
                    onChange={handleChangeWithValidation}
                    onBlur={handleBlur}
                    validation={validation.accumDepre}
                    touched={touchedFields.has("accumDepre")}
                    errorMessage={getErrorMessage(
                      "accumDepre",
                      validation.accumDepre
                    )}
                  />
                  <FormField
                    name="adjustedDepre"
                    label="Adjusted Depreciation"
                    placeholder="Enter adjusted depreciation"
                    type="number"
                    value={form.adjustedDepre}
                    onChange={handleChangeWithValidation}
                    onBlur={handleBlur}
                    validation={validation.adjustedDepre}
                    touched={touchedFields.has("adjustedDepre")}
                    errorMessage={getErrorMessage(
                      "adjustedDepre",
                      validation.adjustedDepre
                    )}
                  />
                  <FormField
                    name="ytdDepre"
                    label="YTD Depreciation"
                    placeholder="Enter YTD depreciation"
                    type="number"
                    value={form.ytdDepre}
                    onChange={handleChangeWithValidation}
                    onBlur={handleBlur}
                    validation={validation.ytdDepre}
                    touched={touchedFields.has("ytdDepre")}
                    errorMessage={getErrorMessage("ytdDepre", validation.ytdDepre)}
                  />
                </FormSection>
              )}

              {activeSection === "dates" && (
                <FormSection direction={direction}>
                  <DatePickerFields
                    name="pisDate"
                    label="PIS Date"
                    placeholder="YYYY-MM-DD"
                    value={form.pisDate}
                    onChange={handleChangeWithValidation}
                    onBlur={handleBlur}
                    validation={validation.pisDate}
                    touched={touchedFields.has("pisDate")}
                    errorMessage={getErrorMessage("pisDate", validation.pisDate)}
                  />
                  <DatePickerFields
                    name="transDate"
                    label="Transaction Date"
                    placeholder="YYYY-MM-DD"
                    value={form.transDate}
                    onChange={handleChangeWithValidation}
                    onBlur={handleBlur}
                    validation={validation.transDate}
                    touched={touchedFields.has("transDate")}
                    errorMessage={getErrorMessage(
                      "transDate",
                      validation.transDate
                    )}
                  />
                </FormSection>
              )}

              {activeSection === "images" && (
                <FormSection direction={direction}>
                  <div className="bg-gray-50 rounded-xl p-3 relative">
                    <label className="block text-sm text-gray-500 mb-2">Asset Images</label>
                    <div className="mt-1">
                      <InputUpload
                        useCamera={true} 
                        value={form.images || []}
                        onChange={(newImages) => {
                          if (handleChange && typeof handleChange === 'function') {
                            // Create a synthetic event to match the handler's expected signature
                            const syntheticEvent = {
                              target: {
                                name: 'images',
                                value: newImages
                              }
                            } as unknown as React.ChangeEvent<HTMLInputElement>;
                            handleChange(syntheticEvent);
                          }
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Upload images of the asset for documentation purposes. You can use your camera or upload existing files.
                    </p>
                  </div>
                </FormSection>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Progress Indicator - only show in slide mode */}
      {!isVerticalMode && (
        <div className="flex justify-center mb-6">
          <ProgressIndicator
            sections={sections}
            activeSection={activeSection}
            sectionStatus={sectionStatus}
            onSectionClick={handleSectionClick}
          />
        </div>
      )}

      {/* Navigation and Submit Buttons */}
      <div className="flex justify-between mt-6">
        {!isVerticalMode ? (
          <NavigationButtons
            activeSection={activeSection}
            isFormValid={isFormValid()}
            onPrevious={() => navigateSection(false)}
            onNext={() => navigateSection(true)}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            editingId={editingId}
          />
        ) : (
          <div className="flex justify-end w-full">
            <button
              className="btn btn-ghost mr-2"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={!isFormValid()}
            >
              {editingId ? "Update" : "Create"} Asset
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(AssetForm); 
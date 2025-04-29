import { useState } from "react";
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

interface AssetFormProps {
  editingId: string | null;
  form: AssetFormValues;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: () => void;
  handleCancel: () => void;
}

export default function AssetForm({
  editingId,
  form,
  handleChange,
  handleSubmit,
  handleCancel,
}: AssetFormProps) {
  const [activeSection, setActiveSection] = useState("basic");
  const [direction, setDirection] = useState(0);

  const { touchedFields, validation, sectionStatus, handleBlur, isFormValid } =
    useFormValidation(form);

  const sections = ["basic", "location", "financial", "depreciation", "dates"];

  const navigateSection = (next: boolean) => {
    const currentIndex = sections.indexOf(activeSection);
    const newIndex = next ? currentIndex + 1 : currentIndex - 1;

    if (newIndex >= 0 && newIndex < sections.length) {
      setDirection(next ? 1 : -1);
      setActiveSection(sections[newIndex]);
    }
  };

  const handleSectionClick = (section: string) => {
    const currentIndex = sections.indexOf(activeSection);
    const newIndex = sections.indexOf(section);
    setDirection(newIndex > currentIndex ? 1 : -1);
    setActiveSection(section);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm mb-6 h-full overflow-y-auto">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">
        {editingId ? "Edit" : "Create"} Asset
      </h2>

      {/* Navigation Tabs */}
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

      {/* Form Sections */}
      <div
        className="relative overflow-hidden mb-6"
        style={{ minHeight: "calc(100% - 300px)" }}
      >
        <AnimatePresence initial={false} custom={direction} mode="wait">
          {activeSection === "basic" && (
            <FormSection direction={direction}>
              <FormField
                name="projectCode"
                label="Project Code"
                placeholder="Enter project code"
                value={form.projectCode}
                onChange={handleChange}
                onBlur={handleBlur}
                validation={validation.projectCode}
                touched={touchedFields.has("projectCode")}
                errorMessage={getErrorMessage(
                  "projectCode",
                  validation.projectCode
                )}
              />
              <FormField
                name="assetNo"
                label="Asset No"
                placeholder="Enter asset number"
                value={form.assetNo}
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
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
              <FormField
                name="categoryCode"
                label="Category Code"
                placeholder="Enter category code"
                value={form.categoryCode}
                onChange={handleChange}
                onBlur={handleBlur}
                validation={validation.categoryCode}
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
                onChange={handleChange}
                onBlur={handleBlur}
                options={[
                  {
                    label: "Jakarta",
                    value: 1,
                  },
                  {
                    label: "Surabaya",
                    value: 2,
                  },
                  {
                    label: "Pasuruan",
                    value: 3,
                  },
                ]}
                validation={validation.locationDesc}
                touched={touchedFields.has("locationDesc")}
                errorMessage={getErrorMessage(
                  "locationDesc",
                  validation.locationDesc
                )}
              />
              <FormField
                name="condition"
                label="Condition"
                placeholder="Enter asset condition"
                value={form.condition}
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
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
                type="date"
                value={form.pisDate}
                onChange={handleChange}
                onBlur={handleBlur}
                validation={validation.pisDate}
                touched={touchedFields.has("pisDate")}
                errorMessage={getErrorMessage("pisDate", validation.pisDate)}
              />
              <DatePickerFields
                name="transDate"
                label="Transaction Date"
                placeholder="YYYY-MM-DD"
                type="date"
                value={form.transDate}
                onChange={handleChange}
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
        </AnimatePresence>
      </div>

      {/* Progress Indicator */}
      <div className="flex justify-center mb-6">
        <ProgressIndicator
          sections={sections}
          activeSection={activeSection}
          sectionStatus={sectionStatus}
          onSectionClick={handleSectionClick}
        />
      </div>

      {/* Navigation and Submit Buttons */}
      <NavigationButtons
        activeSection={activeSection}
        isFormValid={isFormValid()}
        onPrevious={() => navigateSection(false)}
        onNext={() => navigateSection(true)}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        editingId={editingId}
      />
    </div>
  );
}

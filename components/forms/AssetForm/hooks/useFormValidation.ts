import { useState, useEffect } from 'react';
import { ValidationState, AssetFormValues, SectionStatusState } from '../types';
import { validateField } from '../validation';

export const useFormValidation = (form: AssetFormValues) => {
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  const [validation, setValidation] = useState<ValidationState>({
    projectCode: "untouched",
    assetNo: "untouched",
    lineNo: "untouched",
    assetName: "untouched", 
    categoryCode: "untouched",
    locationDesc: "untouched",
    condition: "untouched",
    acqValue: "untouched",
    acqValueIdr: "untouched",
    bookValue: "untouched",
    accumDepre: "untouched",
    adjustedDepre: "untouched",
    ytdDepre: "untouched",
    pisDate: "untouched",
    transDate: "untouched",
  });

  const [sectionStatus, setSectionStatus] = useState<SectionStatusState>({
    basic: "incomplete",
    location: "incomplete",
    financial: "incomplete",
    depreciation: "incomplete",
    dates: "incomplete",
  });

  // Handle field blur
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouchedFields(prev => new Set(prev).add(name));
    
    // Validate the field
    setValidation(prev => ({
      ...prev,
      [name]: validateField(name, form[name])
    }));
  };

  // Update validation when form changes
  useEffect(() => {
    const newValidation = { ...validation };
    touchedFields.forEach(fieldName => {
      newValidation[fieldName] = validateField(fieldName, form[fieldName as keyof AssetFormValues]);
    });
    setValidation(newValidation);
  }, [form, touchedFields]);

  // Update section status when validation changes
  useEffect(() => {
    const sections = {
      basic: ["projectCode", "assetNo", "lineNo", "assetName"],
      location: ["categoryCode", "locationDesc", "condition"],
      financial: ["acqValue", "acqValueIdr", "bookValue"],
      depreciation: ["accumDepre", "adjustedDepre", "ytdDepre"],
      dates: ["pisDate", "transDate"]
    };

    const newSectionStatus = Object.entries(sections).reduce((acc, [section, fields]) => {
      const isComplete = fields.every(field => validation[field] === "valid");
      const hasError = fields.some(field => 
        (validation[field] === "invalid" || validation[field] === "empty") && 
        touchedFields.has(field)
      );
      
      return {
        ...acc,
        [section]: hasError ? "error" : isComplete ? "complete" : "incomplete"
      };
    }, {} as SectionStatusState);

    setSectionStatus(newSectionStatus);
  }, [validation, touchedFields]);

  const isFormValid = () => {
    return Object.values(sectionStatus).every(status => status === "complete");
  };

  return {
    touchedFields,
    validation,
    sectionStatus,
    handleBlur,
    isFormValid,
  };
};
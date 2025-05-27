import { useState, useEffect, useMemo, useCallback } from 'react';
import { ValidationState, AssetFormValues, SectionStatusState } from '../types';
import { validateField } from '../validation';

export const useFormValidation = (form: AssetFormValues) => {
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  const [validation, setValidation] = useState<ValidationState>({
    projectCode_id: "untouched",
    assetNo: "untouched",
    lineNo: "untouched",
    assetName: "untouched", 
    categoryCode: "untouched",
    type: "valid", // Type is optional, so it's always valid
    locationDesc_id: "untouched",
    condition: "untouched",
    acqValue: "untouched",
    acqValueIdr: "untouched",
    bookValue: "untouched",
    accumDepre: "untouched",
    adjustedDepre: "untouched",
    ytdDepre: "untouched",
    pisDate: "untouched",
    transDate: "untouched",
    images: "valid", // Images are optional, so they're always valid
  });

  // Memoize section definitions to avoid recreating on every render
  const sections = useMemo(() => ({
    basic: ["projectCode_id", "assetNo", "lineNo", "assetName"],
    location: ["categoryCode", "locationDesc_id", "condition"],
    financial: ["acqValue", "acqValueIdr", "bookValue"],
    depreciation: ["accumDepre", "adjustedDepre", "ytdDepre"],
    dates: ["pisDate", "transDate"],
    images: ["images"]
  }), []);

  // Memoize section status calculation
  const sectionStatus = useMemo<SectionStatusState>(() => {
    return Object.entries(sections).reduce((acc, [section, fields]) => {
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
  }, [validation, touchedFields, sections]);

  // Handle field blur with useCallback to prevent recreation
  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouchedFields(prev => new Set(prev).add(name));
    
    // Validate the field
    setValidation(prev => ({
      ...prev,
      [name]: validateField(name, form[name])
    }));
  }, [form]);

  // Update validation when form changes (debounced effect)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const newValidation = { ...validation };
      let hasChanges = false;
      
      touchedFields.forEach(fieldName => {
        const newValue = validateField(fieldName, form[fieldName as keyof AssetFormValues]);
        if (newValidation[fieldName] !== newValue) {
          newValidation[fieldName] = newValue;
          hasChanges = true;
        }
      });
      
      if (hasChanges) {
        setValidation(newValidation);
      }
    }, 100); // Debounce validation updates

    return () => clearTimeout(timeoutId);
  }, [form, touchedFields]);

  const isFormValid = useCallback(() => {
    return Object.values(sectionStatus).every(status => status === "complete");
  }, [sectionStatus]);

  // Validate all fields for edit mode
  const validateAllFields = useCallback(() => {
    // Mark all fields as touched
    const allFieldNames = Object.keys(form);
    const allTouchedFields = new Set<string>(allFieldNames);
    setTouchedFields(allTouchedFields);
    
    // Validate all fields
    const newValidation = { ...validation };
    allFieldNames.forEach(fieldName => {
      newValidation[fieldName] = validateField(fieldName, form[fieldName as keyof AssetFormValues]);
    });
    
    // Update validation state
    setValidation(newValidation);
  }, [form, validation]);

  return {
    touchedFields,
    validation,
    sectionStatus,
    handleBlur,
    isFormValid,
    validateAllFields,
  };
};
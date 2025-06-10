import { useState, useCallback } from 'react';
import { validateForm, transformFormValues, AssetFormData } from '../validation.zod';
import { AssetFormValues } from '../types';

export type ValidationErrors = {
  [key: string]: string;
};

export const useZodValidation = (form: AssetFormValues) => {
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  // Validate form on submit
  const validateOnSubmit = useCallback(() => {
    setHasAttemptedSubmit(true);
    const transformedForm = transformFormValues(form);
    const result = validateForm(transformedForm);
    
    if (!result.isValid) {
      setValidationErrors(result.errors);
      return false;
    }
    
    setValidationErrors({});
    return true;
  }, [form]);

  // Clear errors when form changes (optional - only if you want to clear errors as user types)
  const clearErrors = useCallback(() => {
    setValidationErrors({});
    setHasAttemptedSubmit(false);
  }, []);

  // Get error message for a field
  const getFieldError = useCallback((fieldName: string) => {
    return hasAttemptedSubmit ? validationErrors[fieldName] || '' : '';
  }, [validationErrors, hasAttemptedSubmit]);

  // Check if field has error
  const hasFieldError = useCallback((fieldName: string) => {
    return hasAttemptedSubmit && !!validationErrors[fieldName];
  }, [validationErrors, hasAttemptedSubmit]);

  // Check if form is valid (only after submit attempt)
  const isFormValid = useCallback(() => {
    if (!hasAttemptedSubmit) return true; // Don't show invalid state before submit
    return Object.keys(validationErrors).length === 0;
  }, [validationErrors, hasAttemptedSubmit]);

  return {
    validateOnSubmit,
    clearErrors,
    getFieldError,
    hasFieldError,
    isFormValid,
    hasAttemptedSubmit,
    validationErrors,
  };
}; 
import { ValidationStatus, AssetFormValues } from './types';

// Validation rules
export const validateField = (name: string, value: string | number | null | string[]): ValidationStatus => {
  // Check for empty or null values first
  if (value === null || value === undefined) return "empty";

  // Handle array type for images field
  if (name === "images" && Array.isArray(value)) {
    return "valid"; // Images are optional, so an array (even empty) is valid
  }
  
  // Handle empty string
  if (value === "") return "empty";
  
  // Special handling for ID fields
  if ((name === "locationDesc_id" || name === "projectCode_id" || name === "detailsLocation_id") && 
      (typeof value === 'number' || (!isNaN(Number(value)) && String(value).trim() !== ""))) {
    return "valid"; // IDs are valid as numbers or numeric strings
  }
  
  // Convert value to string for length checks (for non-array values)
  const strValue = String(value).trim();
  if (strValue === "") return "empty";
  
  switch (name) {
    case "projectCode_id":
    case "assetNo":
    case "lineNo":
    case "categoryCode":
      // Required and should follow format (alphanumeric)
      return /^[a-zA-Z0-9-]+$/.test(strValue) ? "valid" : "invalid";
    
    case "assetName":
    case "condition":
      // Required and should be at least 3 characters
      return strValue.length >= 3 ? "valid" : "invalid";
    
    case "acqValue":
    case "acqValueIdr":
    case "bookValue":
    case "accumDepre":
    case "adjustedDepre":
    case "ytdDepre": {
      // Required and should be a number greater than or equal to 0
      const numValue = Number(value);
      return !isNaN(numValue) && numValue >= 0 ? "valid" : "invalid";
    }
    
    case "pisDate":
    case "transDate": {
      // Required and should be a valid date
      try {
        const date = new Date(strValue);
        return !isNaN(date.getTime()) && /^\d{4}-\d{2}-\d{2}$/.test(strValue) ? "valid" : "invalid";
      } catch {
        return "invalid";
      }
    }
    
    default:
      return "valid";
  }
};

// Get error message for a field
export const getErrorMessage = (name: string, status: ValidationStatus): string => {
  if (status === "empty") return "This field is required";
  if (status !== "invalid") return "";
  
  // Special handling for ID fields
  if (name === "locationDesc_id" || name === "projectCode_id" || name === "detailsLocation_id") {
    return "Please select a valid option";
  }
  
  switch (name) {
    case "assetNo":
    case "lineNo":
    case "categoryCode":
      return "Only alphanumeric characters and hyphens allowed";
    
    case "assetName":
    case "condition":
      return "Minimum 3 characters required";
    
    case "acqValue":
    case "acqValueIdr":
    case "bookValue":
    case "accumDepre":
    case "adjustedDepre":
    case "ytdDepre":
      return "Must be a valid number greater than or equal to 0";
    
    case "pisDate":
    case "transDate":
      return "Please enter a valid date (YYYY-MM-DD)";
    
    default:
      return "Invalid input";
  }
};
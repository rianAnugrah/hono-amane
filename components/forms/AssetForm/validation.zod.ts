import { z } from 'zod';

// Zod schema for asset form validation
export const assetFormSchema = z.object({
  projectCode_id: z.number({
    required_error: "Project code is required",
    invalid_type_error: "Please select a valid project code",
  }).min(1, "Please select a project code"),
  
  type: z.string().optional().nullable(),
  
  assetNo: z.string({
    required_error: "Asset number is required",
  })
  .min(1, "Asset number is required")
  .regex(/^[a-zA-Z0-9-]+$/, "Only alphanumeric characters and hyphens allowed"),
  
  lineNo: z.string({
    required_error: "Line number is required",
  })
  .min(1, "Line number is required")
  .regex(/^[a-zA-Z0-9-]+$/, "Only alphanumeric characters and hyphens allowed"),
  
  assetName: z.string({
    required_error: "Asset name is required",
  })
  .min(3, "Asset name must be at least 3 characters"),
  
  categoryCode: z.string({
    required_error: "Category code is required",
  })
  .min(1, "Please select a category code"),
  
  locationDesc_id: z.number({
    required_error: "Location is required",
    invalid_type_error: "Please select a valid location",
  }).min(1, "Please select a location"),
  
  detailsLocation_id: z.number().optional().nullable(),
  
  condition: z.string({
    required_error: "Asset condition is required",
  })
  .min(1, "Please select asset condition"),
  
  acqValue: z.number({
    required_error: "Acquisition value is required",
    invalid_type_error: "Acquisition value must be a number",
  })
  .min(0, "Acquisition value must be greater than or equal to 0"),
  
  acqValueIdr: z.number({
    required_error: "Acquisition value (IDR) is required",
    invalid_type_error: "Acquisition value (IDR) must be a number",
  })
  .min(0, "Acquisition value (IDR) must be greater than or equal to 0"),
  
  bookValue: z.number({
    required_error: "Book value is required",
    invalid_type_error: "Book value must be a number",
  })
  .min(0, "Book value must be greater than or equal to 0"),
  
  accumDepre: z.number({
    required_error: "Accumulated depreciation is required",
    invalid_type_error: "Accumulated depreciation must be a number",
  })
  .min(0, "Accumulated depreciation must be greater than or equal to 0"),
  
  adjustedDepre: z.number({
    required_error: "Adjusted depreciation is required",
    invalid_type_error: "Adjusted depreciation must be a number",
  })
  .min(0, "Adjusted depreciation must be greater than or equal to 0"),
  
  ytdDepre: z.number({
    required_error: "YTD depreciation is required",
    invalid_type_error: "YTD depreciation must be a number",
  })
  .min(0, "YTD depreciation must be greater than or equal to 0"),
  
  pisDate: z.string({
    required_error: "PIS date is required",
  })
  .min(1, "PIS date is required")
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Please enter a valid date (YYYY-MM-DD)")
  .refine((date) => {
    const dateObj = new Date(date);
    return !isNaN(dateObj.getTime());
  }, "Please enter a valid date"),
  
  transDate: z.string({
    required_error: "Transaction date is required",
  })
  .min(1, "Transaction date is required")
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Please enter a valid date (YYYY-MM-DD)")
  .refine((date) => {
    const dateObj = new Date(date);
    return !isNaN(dateObj.getTime());
  }, "Please enter a valid date"),
  
  images: z.array(z.string()).optional().default([]),
});

// Type inference from schema
export type AssetFormData = z.infer<typeof assetFormSchema>;

// Validation function for individual fields
export const validateField = (fieldName: keyof AssetFormData, value: unknown) => {
  try {
    // Create a partial schema for the specific field
    const fieldSchema = assetFormSchema.shape[fieldName];
    fieldSchema.parse(value);
    return { isValid: true, error: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        isValid: false, 
        error: error.errors[0]?.message || 'Invalid input' 
      };
    }
    return { isValid: false, error: 'Invalid input' };
  }
};

// Validation function for the entire form
export const validateForm = (data: Partial<AssetFormData>) => {
  try {
    assetFormSchema.parse(data);
    return { isValid: true, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        const path = err.path.join('.');
        errors[path] = err.message;
      });
      return { isValid: false, errors };
    }
    return { isValid: false, errors: { general: 'Validation failed' } };
  }
};

// Helper function to transform form values for validation
export const transformFormValues = (formValues: Record<string, unknown>): Partial<AssetFormData> => {
  const transformed: Record<string, unknown> = { ...formValues };
  
  // Convert string numbers to actual numbers for numeric fields
  const numericFields = [
    'projectCode_id', 'locationDesc_id', 'detailsLocation_id',
    'acqValue', 'acqValueIdr', 'bookValue', 
    'accumDepre', 'adjustedDepre', 'ytdDepre'
  ];
  
  numericFields.forEach(field => {
    if (transformed[field] !== null && transformed[field] !== undefined && transformed[field] !== '') {
      const num = Number(transformed[field]);
      if (!isNaN(num)) {
        transformed[field] = num;
      }
    }
  });
  
  // Ensure images is an array
  if (!Array.isArray(transformed.images)) {
    transformed.images = [];
  }
  
  return transformed as Partial<AssetFormData>;
}; 
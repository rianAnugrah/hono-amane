import { ReactNode } from 'react';

// Define validation types
export type ValidationStatus = "empty" | "invalid" | "valid" | "untouched";

// Interface for form values with proper typing
export interface AssetFormValues {
  [key: string]: string | number | null | string[];
  projectCode_id: number | null;
  assetNo: string;
  lineNo: string;
  assetName: string;
  categoryCode: string;
  type: string | null;
  locationDesc_id: number | null;
  detailsLocation_id: number | null;
  condition: string;
  acqValue: number | null;
  acqValueIdr: number | null;
  bookValue: number | null;
  accumDepre: number | null;
  adjustedDepre: number | null;
  ytdDepre: number | null;
  pisDate: string;
  transDate: string;
  images: string[];
}

// Interface for validation state
export interface ValidationState {
  [key: string]: ValidationStatus;
}

// Section status type
export type SectionStatus = "incomplete" | "complete" | "error";

// Section status state interface
export interface SectionStatusState {
  basic: SectionStatus;
  location: SectionStatus;
  financial: SectionStatus;
  depreciation: SectionStatus;
  dates: SectionStatus;
  images: SectionStatus;
}

// Props for the form field component
export interface FormFieldProps {
  name: string;
  label: string;
  placeholder: string;
  type?: string;
  value: string | number | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  validation: ValidationStatus;
  touched: boolean;
  errorMessage: string;
  icon?: ReactNode;
}

// Props for the section tab component
export interface SectionTabProps {
  id: string;
  label: string;
  isActive: boolean;
  status: SectionStatus;
  onClick: () => void;
}

// Props for the progress indicator component
export interface ProgressIndicatorProps {
  sections: string[];
  activeSection: string;
  sectionStatus: SectionStatusState;
  onSectionClick: (section: string) => void;
}

// Props for the navigation buttons component
export interface NavigationButtonsProps {
  activeSection: string;
  isFormValid: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  onCancel: () => void;
  editingId: string | null;
}

// Props for the form section component
export interface FormSectionProps {
  children: ReactNode;
  direction: number;
}

export interface FormSectionStatus {
  [key: string]: "incomplete" | "complete" | "error";
  basic: "incomplete" | "complete" | "error";
  location: "incomplete" | "complete" | "error";
  financial: "incomplete" | "complete" | "error";
  depreciation: "incomplete" | "complete" | "error";
  dates: "incomplete" | "complete" | "error";
  images: "incomplete" | "complete" | "error";
}
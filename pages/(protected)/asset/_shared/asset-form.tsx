import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Box, FormInput } from "lucide-react";

// Define validation types
type ValidationStatus = "empty" | "invalid" | "valid" | "untouched";

// Interface for form values with proper typing
interface AssetFormValues {
  [key: string]: string | number | null;
  projectCode: string;
  assetNo: string;
  lineNo: string;
  assetName: string;
  categoryCode: string;
  locationDesc: string;
  condition: string;
  acqValue: number | null;
  acqValueIdr: number | null;
  bookValue: number | null;
  accumDepre: number | null;
  adjustedDepre: number | null;
  ytdDepre: number | null;
  pisDate: string;
  transDate: string;
}

// Interface for validation state
interface ValidationState {
  [key: string]: ValidationStatus;
}

export default function AssetForm({
  editingId,
  form,
  handleChange,
  handleSubmit,
  handleCancel,
}: {
  editingId: string | null;
  form: AssetFormValues;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: () => void;
  handleCancel: () => void;
}) {
  // Track which section is currently active
  const [activeSection, setActiveSection] = useState("basic");
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  
  // Track touched fields
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  
  // Track validation state
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

  // Track section completion status
  const [sectionStatus, setSectionStatus] = useState({
    basic: "incomplete" as "incomplete" | "complete" | "error",
    location: "incomplete" as "incomplete" | "complete" | "error",
    financial: "incomplete" as "incomplete" | "complete" | "error",
    depreciation: "incomplete" as "incomplete" | "complete" | "error",
    dates: "incomplete" as "incomplete" | "complete" | "error",
  });

  // Validation rules
  const validateField = (name: string, value: string | number | null): ValidationStatus => {
    if (value === null || value === "") return "empty";
    
    switch (name) {
      case "projectCode":
      case "assetNo":
      case "lineNo":
      case "categoryCode":
        // Required and should follow format (alphanumeric)
        return /^[a-zA-Z0-9-]+$/.test(String(value)) ? "valid" : "invalid";
      
      case "assetName":
      case "locationDesc":
      case "condition":
        // Required and should be at least 3 characters
        return String(value).length >= 3 ? "valid" : "invalid";
      
      case "acqValue":
      case "acqValueIdr":
      case "bookValue":
      case "accumDepre":
      case "adjustedDepre":
      case "ytdDepre":
        // Required and should be a number greater than 0
        return Number(value) >= 0 ? "valid" : "invalid";
      
      case "pisDate":
      case "transDate":
        // Required and should be a valid date
        return /^\d{4}-\d{2}-\d{2}$/.test(String(value)) ? "valid" : "invalid";
      
      default:
        return "valid";
    }
  };

  // Get error message for a field
  const getErrorMessage = (name: string, status: ValidationStatus): string => {
    if (status !== "invalid") return "";
    
    switch (name) {
      case "projectCode":
      case "assetNo":
      case "lineNo":
      case "categoryCode":
        return "Only alphanumeric characters allowed";
      
      case "assetName":
      case "locationDesc":
      case "condition":
        return "Minimum 3 characters required";
      
      case "acqValue":
      case "acqValueIdr":
      case "bookValue":
      case "accumDepre":
      case "adjustedDepre":
      case "ytdDepre":
        return "Must be a positive number";
      
      case "pisDate":
      case "transDate":
        return "Please enter a valid date";
      
      default:
        return "Invalid input";
    }
  };

  // Handle field blur
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    const newTouchedFields = new Set(touchedFields);
    newTouchedFields.add(name);
    setTouchedFields(newTouchedFields);
    
    // Validate the field
    setValidation(prev => ({
      ...prev,
      [name]: validateField(name, form[name])
    }));
  };

  // Update section status when validation changes
  useEffect(() => {
    const updateSectionStatus = () => {
      // Basic section
      const basicFields = ["projectCode", "assetNo", "lineNo", "assetName"];
      const basicComplete = basicFields.every(field => validation[field] === "valid");
      const basicError = basicFields.some(field => validation[field] === "invalid" && touchedFields.has(field));
      
      // Location section
      const locationFields = ["categoryCode", "locationDesc", "condition"];
      const locationComplete = locationFields.every(field => validation[field] === "valid");
      const locationError = locationFields.some(field => validation[field] === "invalid" && touchedFields.has(field));
      
      // Financial section
      const financialFields = ["acqValue", "acqValueIdr", "bookValue"];
      const financialComplete = financialFields.every(field => validation[field] === "valid");
      const financialError = financialFields.some(field => validation[field] === "invalid" && touchedFields.has(field));
      
      // Depreciation section
      const depreciationFields = ["accumDepre", "adjustedDepre", "ytdDepre"];
      const depreciationComplete = depreciationFields.every(field => validation[field] === "valid");
      const depreciationError = depreciationFields.some(field => validation[field] === "invalid" && touchedFields.has(field));
      
      // Dates section
      const datesFields = ["pisDate", "transDate"];
      const datesComplete = datesFields.every(field => validation[field] === "valid");
      const datesError = datesFields.some(field => validation[field] === "invalid" && touchedFields.has(field));
      
      setSectionStatus({
        basic: basicError ? "error" : basicComplete ? "complete" : "incomplete",
        location: locationError ? "error" : locationComplete ? "complete" : "incomplete",
        financial: financialError ? "error" : financialComplete ? "complete" : "incomplete",
        depreciation: depreciationError ? "error" : depreciationComplete ? "complete" : "incomplete",
        dates: datesError ? "error" : datesComplete ? "complete" : "incomplete",
      });
    };
    
    updateSectionStatus();
  }, [validation, touchedFields]);

  // Helper function to render a form field with validation
  const renderField = (name: string, label: string, placeholder: string, type: string = "text") => {
    const status = touchedFields.has(name) ? validation[name] : "untouched";
    const isValid = status === "valid";
    const isInvalid = status === "invalid";
    const errorMessage = getErrorMessage(name, status);
    
    return (
      <motion.div 
        className="bg-gray-50 rounded-xl p-3 relative"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex justify-between items-center mb-1">
          <label className="block text-sm text-gray-500">{label}</label>
          {touchedFields.has(name) && (
            <AnimatePresence>
              {isValid && (
                <motion.span 
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="text-green-500 text-sm flex items-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Valid
                </motion.span>
              )}
              {isInvalid && (
                <motion.span 
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="text-red-500 text-sm flex items-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                  Invalid
                </motion.span>
              )}
            </AnimatePresence>
          )}
        </div>
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          className={`w-full bg-transparent focus:outline-none border-b ${
            isInvalid 
              ? "border-red-500" 
              : isValid 
                ? "border-green-500" 
                : "border-transparent"
          }`}
          value={form[name] || ""}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <AnimatePresence>
          {isInvalid && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="text-red-500 text-xs mt-1"
            >
              {errorMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  // Helper function to render a section tab
  const renderTab = (id: string, label: string) => {
    const isActive = activeSection === id;
    const status = sectionStatus[id as keyof typeof sectionStatus];
    
    let statusIcon;
    if (status === "complete") {
      statusIcon = (
        <motion.span 
          className="ml-2 text-green-500"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring" }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </motion.span>
      );
    } else if (status === "error") {
      statusIcon = (
        <motion.span 
          className="ml-2 text-red-500"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring" }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
        </motion.span>
      );
    }
    
    return (
      <motion.button
        onClick={() => {
          const sections = ["basic", "location", "financial", "depreciation", "dates"];
          const currentIndex = sections.indexOf(activeSection);
          const newIndex = sections.indexOf(id);
          setDirection(newIndex > currentIndex ? 1 : -1);
          setActiveSection(id);
        }}
        className={`px-4 py-2 font-medium rounded-t-lg flex items-center ${
          isActive
            ? "bg-white text-blue-600"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
        // whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {label}
        {statusIcon}
        {isActive && (
          <motion.div
            className="h-0.5 bg-blue-600 mt-1 absolute bottom-0 left-0 right-0"
            layoutId="activeTab"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
      </motion.button>
    );
  };

  // Section variants for animations
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 250 : -250,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 250 : -250,
      opacity: 0,
    }),
  };

  // Section navigation
  const navigateSection = (next: boolean) => {
    const sections = ["basic", "location", "financial", "depreciation", "dates"];
    const currentIndex = sections.indexOf(activeSection);
    const newIndex = next ? currentIndex + 1 : currentIndex - 1;
    
    if (newIndex >= 0 && newIndex < sections.length) {
      setDirection(next ? 1 : -1);
      setActiveSection(sections[newIndex]);
    }
  };

  // Check if all sections are valid for form submission
  const isFormValid = () => {
    return Object.values(sectionStatus).every(status => status === "complete");
  };

  // Get the color for progress indicator
  const getProgressColor = (section: string) => {
    const status = sectionStatus[section as keyof typeof sectionStatus];
    if (status === "complete") return "bg-green-500";
    if (status === "error") return "bg-red-500";
    return section === activeSection ? "bg-blue-600" : "bg-gray-300";
  };

  return (
    <motion.div 
      className="bg-white p-6 rounded-2xl shadow-sm mb-6 h-full overflow-y-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.h2 
        className="text-xl font-semibold mb-6 text-gray-800"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {editingId ? "Edit" : "Create"} Asset
      </motion.h2>
      
      {/* Navigation Tabs */}
      <motion.div 
        className="flex space-x-1 mb-4 overflow-x-auto relative"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {renderTab("basic", "Basic")}
        {renderTab("location", "Category")}
        {renderTab("financial", "Values")}
        {renderTab("depreciation", "Depreciation")}
        {renderTab("dates", "Dates")}
      </motion.div>
      
      {/* Form Sections */}
      <div className="relative overflow-hidden mb-6 " style={{ minHeight: "calc(100% - 300px)" }}>
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={activeSection}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="space-y-4 absolute w-full"
          >
            {/* Basic Info Section */}
            {activeSection === "basic" && (
              <div className="space-y-4">
                {renderField("projectCode", "Project Code", "Project Code")}
                {renderField("assetNo", "Asset No", "Asset No")}
                {renderField("lineNo", "Line No", "Line No")}
                {renderField("assetName", "Asset Name", "Asset Name")}
              </div>
            )}
            
            {/* Category & Location Section */}
            {activeSection === "location" && (
              <div className="space-y-4">
                {renderField("categoryCode", "Category Code", "Category Code")}
                {renderField("locationDesc", "Location", "Location Description")}
                {renderField("condition", "Condition", "Condition")}
              </div>
            )}
            
            {/* Financial Values Section */}
            {activeSection === "financial" && (
              <div className="space-y-4">
                {renderField("acqValue", "Acquisition Value", "Acquisition Value", "number")}
                {renderField("acqValueIdr", "Acquisition Value (IDR)", "Acquisition Value (IDR)", "number")}
                {renderField("bookValue", "Book Value", "Book Value", "number")}
              </div>
            )}
            
            {/* Depreciation Section */}
            {activeSection === "depreciation" && (
              <div className="space-y-4">
                {renderField("accumDepre", "Accumulated Depreciation", "Accumulated Depreciation", "number")}
                {renderField("adjustedDepre", "Adjusted Depreciation", "Adjusted Depreciation", "number")}
                {renderField("ytdDepre", "YTD Depreciation", "YTD Depreciation", "number")}
                {renderField("pisDate", "PIS Date", "PIS Date", "date")}
                {renderField("transDate", "Transaction Date", "Transaction Date", "date")}
              </div>
            )}
            
            {/* Dates Section */}
            {activeSection === "dates" && (
              <div className="space-y-4">
                {renderField("pisDate", "PIS Date", "PIS Date", "date")}
                {renderField("transDate", "Transaction Date", "Transaction Date", "date")}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Progress Indicator */}
      <motion.div 
        className="flex justify-center mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center space-x-1">
          {["basic", "location", "financial", "depreciation", "dates"].map((section, index) => (
            <div key={section} className="flex items-center">
              <motion.div 
                className={`w-3 h-3 rounded-full cursor-pointer ${getProgressColor(section)}`}
                whileHover={{ scale: 1.2 }}
                onClick={() => {
                  const sections = ["basic", "location", "financial", "depreciation", "dates"];
                  const currentIndex = sections.indexOf(activeSection);
                  const newIndex = sections.indexOf(section);
                  setDirection(newIndex > currentIndex ? 1 : -1);
                  setActiveSection(section);
                }}
                animate={section === activeSection ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.5 }}
              />
              {index < 4 && (
                <motion.div 
                  className={`w-8 h-0.5 ${
                    sectionStatus[section as keyof typeof sectionStatus] === "complete" 
                      ? "bg-green-500" 
                      : "bg-gray-300"
                  }`} 
                />
              )}
            </div>
          ))}
        </div>
      </motion.div>
      
      {/* Navigation and Submit Buttons */}
      <motion.div 
        className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex space-x-3">
          {activeSection !== "basic" && (
            <motion.button
              onClick={() => navigateSection(false)}
              className="flex-1 bg-gray-200 text-gray-700 px-4 py-3 rounded-xl font-medium active:bg-gray-300"
              whileHover={{ scale: 1 }}
              whileTap={{ scale: 0.95 }}
            >
              Previous
            </motion.button>
          )}
          
          {activeSection !== "dates" && (
            <motion.button
              onClick={() => navigateSection(true)}
              className="flex-1 bg-gray-200 text-gray-700 px-4 py-3 rounded-xl font-medium active:bg-gray-300"
              whileHover={{ scale: 1 }}
              whileTap={{ scale: 0.95 }}
            >
              Next
            </motion.button>
          )}
        </div>
        
        <div className="flex space-x-3 flex-1">
          {activeSection === "dates" && (
            <motion.button
              onClick={handleSubmit}
              disabled={!isFormValid()}
              className={`flex-1 px-4 py-3 rounded-xl font-medium ${
                isFormValid() 
                  ? "bg-blue-500 text-white hover:bg-blue-600" 
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              whileHover={isFormValid() ? { scale: 1 } : {}}
              whileTap={isFormValid() ? { scale: 0.95 } : {}}
            >
              {editingId ? "Update" : "Create"} Asset
            </motion.button>
          )}
          
          <motion.button
            onClick={handleCancel}
            className="flex-1 bg-gray-200 text-gray-700 px-4 py-3 rounded-xl font-medium"
            // whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Cancel
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
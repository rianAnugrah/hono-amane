import { useState, memo } from "react";
import { FormFieldProps } from '../types';
import { Check, X } from "lucide-react";

const FormField = memo(({
  name,
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  onBlur,
  validation,
  touched,
  errorMessage,
  icon,
  onClear
}: FormFieldProps) => {
  const isValid = validation === "valid";
  const isInvalid = validation === "invalid" || validation === "empty";
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const hasValue = value !== null && value !== undefined && value !== "";
  const showClearButton = hasValue && onClear && (isFocused || isHovered);
  
  const handleClear = () => {
    if (onClear) {
      onClear();
    }
  };
  
  return (
    <div className="relative mb-4">
      <div className="flex flex-col w-full">
        <div 
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <input
            type={type}
            name={name}
            className={`
              w-full px-4 py-2.5 
              ${showClearButton ? "pr-10" : "pr-4"}
              bg-gray-50 
              border 
              ${isInvalid ? "border-red-500" : isValid ? "border-green-500" : isFocused ? "border-blue-500" : "border-gray-200"} 
              rounded-lg
              transition-colors duration-150
              focus:outline-none
            `}
            value={value ?? ""}
            onChange={onChange}
            onBlur={(e) => {
              setIsFocused(false);
              if (onBlur) onBlur(e);
            }}
            onFocus={() => setIsFocused(true)}
          />
          <label
            className={`
              absolute pointer-events-none
              transition-all duration-150 ease-out
              flex items-center gap-1.5
              ${value || isFocused
                ? "text-xs -top-2.5 left-2 bg-white px-1 font-medium " + 
                  (isInvalid 
                    ? "text-red-500" 
                    : isValid 
                      ? "text-green-500" 
                      : "text-blue-500")
                : "text-gray-500 top-1/2 -translate-y-1/2 left-4 text-sm"
              }
            `}
          >
            {icon && (
              <span className="w-4 h-4 flex items-center justify-center">
                {icon}
              </span>
            )}
            {placeholder || label}
          </label>
          
          {/* Clear button */}
          {showClearButton && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors duration-150 z-10"
              tabIndex={-1}
            >
              <X size={16} />
            </button>
          )}
          
          {/* Validation icons */}
          {touched && !showClearButton && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {isValid && (
                <span className="text-green-500 flex items-center opacity-100 transition-opacity duration-150">
                  <Check size={16} />
                </span>
              )}
              {isInvalid && (
                <span className="text-red-500 flex items-center opacity-100 transition-opacity duration-150">
                  <X size={16} />
                </span>
              )}
            </div>
          )}
        </div>
      </div>
      
      {isInvalid && (
        <div className="text-red-500 text-xs mt-1 pl-1 transition-opacity duration-150">
          {errorMessage}
        </div>
      )}
    </div>
  );
});

FormField.displayName = 'FormField';

export { FormField };
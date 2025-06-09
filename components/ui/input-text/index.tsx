import { useState } from "react";

interface InputTextProps {
  value: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: React.ReactNode;
  type?: string;
  name?: string;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  error?: string;
  helperText?: string;
  ariaLabel?: string;
  fullWidth?: boolean;
}

export default function InputText({
  value,
  onChange,
  placeholder = "Placeholder",
  type = "text",
  label,
  name,
  disabled = false,
  required = false,
  error,
  helperText,
  ariaLabel,
  fullWidth = true,
}: InputTextProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`flex flex-col ${fullWidth ? "w-full" : ""}`}>
      <div className="relative ">
        {/* Label */}
        {label && (
          <label
            className={`text-sm font-medium mb-1 block ${
              error ? "text-red-500" : "text-gray-700"
            } ${disabled ? "opacity-50" : ""}`}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          className={`
            w-full px-4 py-2.5 
            bg-gray-50 
            border ${
              error
                ? "border-red-500"
                : isFocused
                ? "border-blue-500"
                : "border-gray-200"
            } 
            rounded-lg
            transition-colors duration-200
            focus:outline-none
            ${disabled ? "bg-gray-100 text-gray-400 cursor-not-allowed" : ""}
          `}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          required={required}
          aria-label={ariaLabel || placeholder}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${name}-error` : helperText ? `${name}-helper` : undefined
          }
        />
        {/* <label
          className={`
            absolute pointer-events-none
            transition-all duration-200 ease-in-out
            flex items-center gap-1.5
            ${value || isFocused || true
              ? "text-xs -top-2.5 left-2 bg-white px-1 text-blue-500 font-medium"
              : "text-gray-500 top-1/2 -translate-y-1/2 left-4 text-sm"
            }
            ${error ? '!text-red-500' : ''}
            ${disabled ? 'text-gray-400' : ''}
          `}
        >
          {icon && <span className="w-4 h-4 flex items-center justify-center">{icon}</span>}
          {placeholder}
          {required && !value && !isFocused && <span className="text-red-500 ml-1">*</span>}
        </label> */}

       
      </div>

      {(error || helperText) && (
        <div
          className={`text-xs mt-1 ${error ? "text-red-500" : "text-gray-500"}`}
          id={error ? `${name}-error` : `${name}-helper`}
        >
          {error || helperText}
        </div>
      )}
    </div>
  );
}

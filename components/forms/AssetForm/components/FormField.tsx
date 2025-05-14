import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { FormFieldProps } from '../types';
import { Check, X } from "lucide-react";

export const FormField = ({
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
  icon
}: FormFieldProps) => {
  const isValid = validation === "valid";
  const isInvalid = validation === "invalid" || validation === "empty";
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <motion.div 
      className="relative mb-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex flex-col w-full">
        <div className="relative">
          <input
            type={type}
            name={name}
            className={`
              w-full px-4 py-2.5 
              bg-gray-50 
              border 
              ${isInvalid ? "border-red-500" : isValid ? "border-green-500" : isFocused ? "border-blue-500" : "border-gray-200"} 
              rounded-lg
              transition-colors duration-200
              focus:outline-none
            `}
            value={value ?? ""}
            onChange={onChange}
            onBlur={(e) => {
              setIsFocused(false);
              onBlur && onBlur(e);
            }}
            onFocus={() => setIsFocused(true)}
          />
          <label
            className={`
              absolute pointer-events-none
              transition-all duration-200 ease-in-out
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
          
          {touched && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <AnimatePresence>
                {isValid && (
                  <motion.span 
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    className="text-green-500 flex items-center"
                  >
                    <Check size={16} />
                  </motion.span>
                )}
                {isInvalid && (
                  <motion.span 
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    className="text-red-500 flex items-center"
                  >
                    <X size={16} />
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
      
      <AnimatePresence>
        {isInvalid && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="text-red-500 text-xs mt-1 pl-1"
          >
            {errorMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
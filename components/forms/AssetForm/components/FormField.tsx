import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { FormFieldProps } from '../types';

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
      <div className="flex items-center relative flex-grow my-4">
        <div className="relative w-full">
          <input
            type={type}
            name={name}
            className={`w-full pl-4 pr-4 py-2 bg-white border rounded-lg focus:outline-none ${
              isInvalid 
                ? "border-red-500" 
                : isValid 
                  ? "border-green-500" 
                  : "border-gray-300 focus:border-gray-700"
            }`}
            value={value ?? ""}
            onChange={onChange}
            onBlur={(e) => {
              setIsFocused(false);
              onBlur && onBlur(e);
            }}
            onFocus={() => setIsFocused(true)}
          />
          <label
            className={`absolute pointer-events-none items-center rounded-full h-6 flex gap-0 transition-all duration-200 ${
              value || isFocused
                ? "text-xs -top-3 bg-white px-2 left-2 " + (isInvalid ? "text-red-500" : isValid ? "text-green-500" : "text-gray-800")
                : "text-gray-400 top-1/2 -translate-y-1/2 px-4 left-0"
            }`}
          >
            {icon && (
              <div className="w-4 h-4 mr-2 text-gray-500 inset-y-0 left-0 flex items-center">
                {icon}
              </div>
            )}
            {placeholder || label}
          </label>
          
          {touched && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <AnimatePresence>
                {isValid && (
                  <motion.span 
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="text-green-500 flex items-center"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </motion.span>
                )}
                {isInvalid && (
                  <motion.span 
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="text-red-500 flex items-center"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
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
            className="text-red-500 text-xs mt-1 pl-4"
          >
            {errorMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
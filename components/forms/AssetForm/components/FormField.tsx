import { motion, AnimatePresence } from "framer-motion";
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
  errorMessage
}: FormFieldProps) => {
  const isValid = validation === "valid";
  const isInvalid = validation === "invalid" || validation === "empty";
  
  return (
    <motion.div 
      className="bg-gray-50 rounded-xl p-3 relative"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex justify-between items-center mb-1">
        <label className="block text-sm text-gray-500">{label}</label>
        {touched && (
          <AnimatePresence>
            {isValid && (
              <motion.span 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="text-green-500 text-sm flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              : "border-gray-300"
        }`}
        value={value ?? ""}
        onChange={onChange}
        onBlur={onBlur}
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
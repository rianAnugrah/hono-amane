import { motion, AnimatePresence } from "framer-motion";

interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
  label?: string;
  disabled?: boolean;
  name?: string;
  error?: string;
  id?: string;
  ariaLabel?: string;
}

export default function Checkbox({
  checked,
  onChange,
  label,
  disabled = false,
  name,
  error,
  id,
  ariaLabel,
}: CheckboxProps) {
  return (
    <div className="flex items-start">
      <button
        onClick={disabled ? undefined : onChange}
        role="checkbox"
        aria-checked={checked}
        aria-label={ariaLabel || label || "Checkbox"}
        aria-disabled={disabled}
        id={id}
        name={name}
        className={`
          relative w-5 h-5 rounded 
          flex-shrink-0 mt-0.5
          transition-colors duration-200
          ${checked ? "bg-blue-500" : "bg-white"}
          ${error ? "border-2 border-red-500" : "border border-gray-300"}
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50
        `}
        tabIndex={disabled ? -1 : 0}
      >
        <AnimatePresence>
          {checked && (
            <motion.svg
              key="check"
              className="absolute inset-0 w-full h-full text-white"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              fill="none"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              stroke="currentColor"
              strokeWidth={3}
            >
              <motion.path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                exit={{ pathLength: 0 }}
                transition={{ duration: 0.2 }}
              />
            </motion.svg>
          )}
        </AnimatePresence>
      </button>
      
      {label && (
        <label 
          className={`ml-2 text-sm ${disabled ? 'text-gray-400' : 'text-gray-700'} ${error ? 'text-red-500' : ''}`}
          onClick={disabled ? undefined : onChange}
        >
          {label}
        </label>
      )}
      
      {error && !label && (
        <span className="ml-2 text-xs text-red-500">{error}</span>
      )}
    </div>
  );
}

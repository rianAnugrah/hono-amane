import { motion } from "framer-motion";

interface SwitchProps {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  label?: string;
  name?: string;
  ariaLabel?: string;
}

export default function Switch({
  checked,
  onChange,
  disabled = false,
  label,
  name,
  ariaLabel,
}: SwitchProps) {
  return (
    <div className="flex items-center">
      <button
        onClick={disabled ? undefined : onChange}
        role="switch"
        aria-checked={checked}
        aria-label={ariaLabel || label || "Toggle setting"}
        aria-disabled={disabled}
        name={name}
        className={`
          relative w-[51px] h-[31px] rounded-full 
          transition-colors duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50
          ${checked ? "bg-green-500" : "bg-gray-200"}
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        `}
        tabIndex={disabled ? -1 : 0}
      >
        <motion.div
          className="absolute top-[2px] left-[2px] w-[27px] h-[27px] rounded-full bg-white shadow-sm"
          animate={{ 
            x: checked ? 20 : 0,
            boxShadow: checked 
              ? "0 2px 4px rgba(0, 0, 0, 0.1)"
              : "0 1px 2px rgba(0, 0, 0, 0.1)"
          }}
          transition={{ 
            type: "spring", 
            stiffness: 500, 
            damping: 30
          }}
        />
      </button>
      
      {label && (
        <label className="ml-3 text-sm text-gray-700 cursor-pointer" onClick={disabled ? undefined : onChange}>
          {label}
        </label>
      )}
    </div>
  );
}

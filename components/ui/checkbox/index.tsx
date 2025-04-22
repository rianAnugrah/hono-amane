import { motion, AnimatePresence } from "framer-motion";

export default function Checkbox({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      onClick={onChange}
      role="checkbox"
      aria-checked={checked}
      aria-label="Checkbox"
      className={`relative w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors duration-300 ${
        checked ? "bg-blue-500 border-blue-500" : "bg-white border-gray-400"
      } focus:outline-none focus:ring-2 focus:ring-blue-400`}
    >
      <AnimatePresence>
        {checked && (
          <motion.svg
            key="check"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="w-4 h-4 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </motion.svg>
        )}
      </AnimatePresence>
    </button>
  );
}

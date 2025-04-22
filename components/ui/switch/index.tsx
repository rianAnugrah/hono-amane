import { motion } from "framer-motion";

export default function Switch({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      role="switch"
      aria-checked={checked}
      aria-label="Toggle setting"
      className={`relative w-11 h-6 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        checked ? "bg-blue-500" : "bg-gray-300"
      }`}
    >
      <motion.div
        className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow"
        animate={{ x: checked ? 20 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 20 }}
      />
    </button>
  );
}

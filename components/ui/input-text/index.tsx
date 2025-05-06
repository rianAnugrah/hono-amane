import { useState } from "react";

interface inputTextProps {
  value: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: React.ReactNode;
}

export default function InputText({
  value,
  onChange,
  icon,
  placeholder = "Placeholder",
}: inputTextProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="flex items-center relative flex-grow">
      <div className="relative w-full">
        <input
          type="text"
          className="w-full pl-4 pr-4 py-2 bg-white border border-gray-300 rounded focus:outline-none focus:border-gray-700"
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <label
          className={`absolute  pointer-events-none items-center rounded-full h-6 flex  gap-0 transition-all duration-200 ${
            value || isFocused
              ? "text-xs -top-3 bg-white  text-gray-800 px-2 left-2"
              : "text-gray-400 top-1/2 -translate-y-1/2 px-3 left-0"
          }`}
        >
          <div className="w-3 h-3 mr-2  text-gray-500 inset-y-0 left-0 flex items-center">
            {icon && icon}
          </div>
          {placeholder}
        </label>
      </div>
    </div>
  );
}

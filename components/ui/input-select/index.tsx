import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface InputSelectProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  label?: string;
}

export default function InputSelect({ value, onChange, options, label = "Condition" }: InputSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(() => {
    return options.find(option => option.value === value) || options[0];
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const selectRef = useRef<HTMLSelectElement>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Update selected option when value changes externally
  useEffect(() => {
    const matchingOption = options.find(option => option.value === value);
    if (matchingOption) {
      setSelectedOption(matchingOption);
    }
  }, [value, options]);

  const handleSelect = (option: { value: string; label: string }) => {
    setSelectedOption(option);
    setIsOpen(false);
    
    // Create a synthetic event-like object for compatibility
    if (selectRef.current) {
      // Set the native select value
      selectRef.current.value = option.value;
      
      // Create a custom change event
      const event = {
        target: {
          value: option.value,
          name: selectRef.current.name
        },
        currentTarget: {
          value: option.value,
          name: selectRef.current.name
        }
      } as unknown as React.ChangeEvent<HTMLSelectElement>;
      
      // Call the original onChange
      onChange(event);
    } else {
      // Fallback direct value passing if select element is not available
      onChange(option.value);
    }
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Hidden native select for form compatibility */}
      <select 
        ref={selectRef}
        value={selectedOption.value} 
        onChange={(e) => onChange(e)}
        className="sr-only"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {/* Custom select UI */}
      <div className="flex items-center relative mb-1">
        <label className="text-xs font-medium absolute rounded-full -top-2 left-2 px-2 text-gray-500 bg-white z-10">
          {label}
        </label>
        
        <div 
          className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer flex justify-between items-center"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="text-gray-800">{selectedOption.label}</span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={18} className="text-gray-500" />
          </motion.div>
        </div>
      </div>
      
      {/* Dropdown options with animation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
          >
            <div className="max-h-60 overflow-y-auto py-1">
              {options.map((option) => (
                <motion.div
                  key={option.value}
                  whileHover={{ backgroundColor: '#f3f4f6' }}
                  className={`px-4 py-2 cursor-pointer ${selectedOption.value === option.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                  onClick={() => handleSelect(option)}
                >
                  {option.label}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
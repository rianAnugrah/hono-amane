import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface SelectFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  value: string | number | null;
  options: { value: string | number; label: string }[];
  onChange: (e: any) => void;
  onBlur?: (e: any) => void;
  validation?: "valid" | "invalid" | "empty" | "untouched" | undefined;
  touched?: boolean;
  errorMessage?: string;
  icon?: React.ReactNode;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchInput?:any;
}

export const SelectField = ({
  name,
  label,
  placeholder,
  value,
  options = [],
  onChange,
  onBlur,
  validation,
  touched,
  errorMessage,
  icon,
  searchInput,
  searchable = false,
  searchPlaceholder = "Search..."
}: SelectFieldProps) => {
  const isValid = validation === "valid";
  const isInvalid = validation === "invalid" || validation === "empty";
  const isUntouched = validation === "untouched" || validation === undefined;
  
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOption, setSelectedOption] = useState(() => {
    return options.find(option => option.value === value) || (options.length > 0 ? options[0] : null);
  });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const selectRef = useRef<HTMLSelectElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        onBlur && onBlur({ target: { name } });
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [name, onBlur]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  // Update selected option when value changes externally
  useEffect(() => {
    const matchingOption = options.find(option => option.value === value);
    if (matchingOption) {
      setSelectedOption(matchingOption);
    }
  }, [value, options]);

  const handleSelect = (option: { value: string | number; label: string }) => {
    setSelectedOption(option);
    setIsOpen(false);
    setSearchTerm(''); // Clear search term after selection
    
    // Create a synthetic event-like object
    const event = {
      target: {
        value: option.value,
        name: name
      },
      currentTarget: {
        value: option.value,
        name: name
      }
    };
    
    // Call the onChange handler
    onChange(event);
    
    // Also trigger blur for validation
    onBlur && onBlur(event);
  };

  // Filter options based on search term
  const filteredOptions = searchTerm
    ? options.filter(option => 
        option.label.toLowerCase().includes(searchTerm.toLowerCase()))
    : options;

  // Determine display text
  const displayText = selectedOption 
    ? selectedOption.label 
    : placeholder || "Select an option";

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle dropdown toggle
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Reset search when opening dropdown
      setSearchTerm('');
    } else {
      // Trigger blur validation when closing
      onBlur && onBlur({ target: { name } });
    }
  };

  return (
    <motion.div 
      className="relative mb-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      ref={containerRef}
    >
      {/* Hidden native select for form compatibility */}
      <select 
        ref={selectRef}
        name={name}
        value={value !== null ? String(value) : ''} 
        onChange={onChange}
        onBlur={onBlur}
        className="sr-only"
      >
        <option value="" disabled>{placeholder || "Select an option"}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {/* Custom select UI */}
      <div className="flex items-center relative flex-grow">
        <div 
          className={`w-full pl-4 pr-10 py-2 bg-white border rounded-lg focus:outline-none cursor-pointer flex items-center ${
            isInvalid 
              ? "border-red-500" 
              : isValid 
                ? "border-green-500" 
                : "border-gray-300"
          }`}
          onClick={toggleDropdown}
        >
          <span className={`block truncate ${selectedOption ? "text-gray-800" : "text-gray-400"}`}>
            {displayText}
          </span>
        </div>
        
        {/* Custom dropdown arrow */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={18} className="text-gray-500" />
          </motion.div>
        </div>
        
        {(label || placeholder) && (        
          <label
            className={`absolute pointer-events-none items-center rounded-full h-6 flex gap-0 transition-all duration-200 ${
              true
                ? "text-xs -top-3 bg-white px-2 left-2 " + (isInvalid ? "text-red-500" : isValid ? "text-green-500" : "text-gray-800")
                : "text-gray-400 top-1/2 -translate-y-1/2 px-4 left-0"
            }`}
          >
            {icon && (
              <div className="w-4 h-4 mr-2 text-gray-500 inset-y-0 left-0 flex items-center">
                {icon}
              </div>
            )}
            {label || placeholder}
          </label>
        )}
        
        <div className="absolute right-8 top-1/2 -translate-y-1/2">
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
      </div>
      
      {/* Dropdown with search and options */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
          >
            <div className="max-h-60 overflow-y-auto py-0 relative">
              {searchable && (
                <div className="sticky top-0 w-full bg-white p-2 border-b border-gray-100">
                  <input
                    ref={searchInputRef}
                    type="text"
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder={searchPlaceholder}
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              )}
              
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <motion.div
                    key={option.value}
                    whileHover={{ backgroundColor: '#f3f4f6' }}
                    className={`px-4 py-2 cursor-pointer ${
                      selectedOption && selectedOption.value === option.value 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'text-gray-700'
                    }`}
                    onClick={() => handleSelect(option)}
                  >
                    {option.label}
                  </motion.div>
                ))
              ) : (
                <div className="px-4 py-2 text-gray-500 text-sm">No options found</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Error message */}
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
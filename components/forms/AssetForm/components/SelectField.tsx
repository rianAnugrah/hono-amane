import { useState, useRef, useEffect, memo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, X, Search } from 'lucide-react';

interface SelectFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  value: string | number | null;
  options: { value: string | number; label: string }[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement> | { target: { value: string | number; name: string }; currentTarget: { value: string | number; name: string } }) => void;
  onBlur?: (e: React.FocusEvent<HTMLSelectElement> | { target: { name: string } }) => void;
  validation?: "valid" | "invalid" | "empty" | "untouched" | undefined;
  touched?: boolean;
  errorMessage?: string;
  icon?: React.ReactNode;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchInput?: string;
  disabled?: boolean;
}

const SelectField = memo(({
  name,
  label,
  placeholder = "Select an option",
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
  searchPlaceholder = "Search...",
  disabled = false,
}: SelectFieldProps) => {
  const isValid = validation === "valid";
  const isInvalid = validation === "invalid" || validation === "empty";
  const isUntouched = validation === "untouched" || validation === undefined;
  
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const [selectedOption, setSelectedOption] = useState(() => {
    return options.find(option => option.value === value) || null;
  });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const selectRef = useRef<HTMLSelectElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        if (onBlur) {
          onBlur({ target: { name } });
        }
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
    } else {
      setSelectedOption(null);
    }
  }, [value, options]);

  // Calculate dropdown position when opening
  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 4, // Add 4px spacing
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  }, [isOpen]);

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
    if (onBlur) {
      onBlur(event);
    }
  };

  // Filter options based on search term
  const filteredOptions = searchTerm
    ? options.filter(option => 
        option.label.toLowerCase().includes(searchTerm.toLowerCase()))
    : options;

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle dropdown toggle
  const toggleDropdown = () => {
    if (disabled) return;
    
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Reset search when opening dropdown
      setSearchTerm('');
    } else {
      // Trigger blur validation when closing
      if (onBlur) {
        onBlur({ target: { name } });
      }
    }
  };

  return (
    <div 
      className="relative mb-4"
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
        disabled={disabled}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {/* Label */}
      {label && (
        <label 
          className={`text-sm font-medium mb-1 block ${isInvalid ? 'text-red-500' : isValid ? 'text-green-500' : 'text-gray-700'} ${disabled ? 'opacity-50' : ''}`}
          htmlFor={name}
        >
          {label}
        </label>
      )}
      
      {/* Custom select UI */}
      <div className="relative">
        <div 
          className={`
            relative w-full px-3 py-2.5 
            bg-gray-50 border
            ${isInvalid ? 'border-red-500' : isValid ? 'border-green-500' : isOpen ? 'border-blue-400 ring-2 ring-blue-100' : 'border-gray-200'} 
            ${disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'cursor-pointer'}
            rounded-lg transition-all duration-150
          `}
          onClick={toggleDropdown}
        >
          <div className="flex justify-between items-center">
            <span className={selectedOption ? 'text-gray-900' : 'text-gray-500'}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <div
              className={`ml-2 transition-transform duration-150 ${isOpen ? 'rotate-180' : 'rotate-0'} ${disabled ? 'opacity-50' : ''}`}
            >
              <ChevronDown size={18} className="text-gray-500" />
            </div>
          </div>
          
          {touched && !isOpen && (
            <div className="absolute right-8 top-1/2 -translate-y-1/2">
              {isValid && (
                <span className="text-green-500 flex items-center opacity-100 transition-opacity duration-150">
                  <Check size={16} />
                </span>
              )}
              {isInvalid && (
                <span className="text-red-500 flex items-center opacity-100 transition-opacity duration-150">
                  <X size={16} />
                </span>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Error message */}
      {isInvalid && errorMessage && (
        <div className="text-red-500 text-xs mt-1 pl-1 transition-opacity duration-150">
          {errorMessage}
        </div>
      )}
      
      {/* Dropdown rendered via portal */}
      {typeof window !== 'undefined' && createPortal(
        <AnimatePresence>
          {isOpen && !disabled && (
            <motion.div 
              initial={{ opacity: 0, y: -5, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -5, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="fixed z-[9999] bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
              style={{ 
                top: dropdownPosition.top,
                left: dropdownPosition.left,
                width: dropdownPosition.width,
                maxHeight: '250px'
              }}
            >
              <div className="max-h-60 overflow-y-auto relative">
                {searchable && (
                  <div className='sticky top-0 w-full bg-white p-2 border-b border-gray-100'>
                    <div className="relative">
                      <input
                        ref={searchInputRef}
                        type="text"
                        className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
                        placeholder={searchPlaceholder}
                        value={searchTerm}
                        onChange={handleSearchChange}
                      />
                      <Search size={14} className="absolute left-2.5 top-2 text-gray-400" />
                    </div>
                  </div>
                )}
                
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option) => (
                    <div
                      key={option.value}
                      className={`
                        px-4 py-2.5 cursor-pointer transition-colors duration-150 hover:bg-gray-100
                        ${selectedOption?.value === option.value ? 'bg-blue-50 text-blue-700' : 'text-gray-800'}
                      `}
                      onClick={() => handleSelect(option)}
                    >
                      {option.label}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-3 text-gray-500 text-sm italic">No options available</div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
});

SelectField.displayName = 'SelectField';

export { SelectField };
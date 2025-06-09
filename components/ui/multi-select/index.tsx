import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, X } from 'lucide-react';

// Define the types for our props
interface MultiSelectProps {
  values: (string | number)[];
  onChange: (values: (string | number)[]) => void;
  options: { value: string | number; label: string }[];
  label?: string;
  placeholder?: string;
  searchPlaceholder?: string;
}

export default function MultiSelect({ 
  values = [], 
  onChange, 
  options, 
  label = "Select items",
  placeholder = "Select options...",
  searchPlaceholder = "Search..."
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<{ value: string | number; label: string }[]>([]);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const isOutsideContainer = containerRef.current && !containerRef.current.contains(target);
      const isOutsideDropdown = dropdownRef.current && !dropdownRef.current.contains(target);
      
      if (isOutsideContainer && isOutsideDropdown) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const matched = options.filter(option =>
      values.map(String).includes(String(option.value))
    );
    setSelectedOptions(matched);
  }, [values, options]);

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

  // Filter options based on search term
  const filteredOptions = options.filter(option => 
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (option: { value: string | number; label: string }) => {
    const isSelected = selectedOptions.some(item => item.value === option.value);
    let newSelectedOptions;
    
    if (isSelected) {
      // Remove option if already selected
      newSelectedOptions = selectedOptions.filter(item => item.value !== option.value);
    } else {
      // Add option if not selected
      newSelectedOptions = [...selectedOptions, option];
    }
    
    setSelectedOptions(newSelectedOptions);
    
    // Call onChange with just the values
    const newValues = newSelectedOptions.map(option => option.value);
    onChange(newValues);
  };

  const removeOption = (optionToRemove: { value: string | number; label: string }, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent the dropdown from toggling
    
    const newSelectedOptions = selectedOptions.filter(
      option => option.value !== optionToRemove.value
    );
    
    setSelectedOptions(newSelectedOptions);
    onChange(newSelectedOptions.map(option => option.value));
  };

  // Search input component
  const SearchInput = (
    <div className="p-2 border-b border-gray-200">
      <input
        type="text"
        placeholder={searchPlaceholder}
        className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="flex items-center relative mb-1">
        <label className="text-xs font-medium absolute rounded-full -top-2 left-2 px-2 text-gray-500 bg-white z-10">
          {label}
         
        </label>
        
        <div 
          className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex flex-wrap items-center gap-1">
            {selectedOptions.length > 0 ? (
              <>
                {selectedOptions.map((option) => (
                  <div 
                    key={option.value}
                    className="flex items-center gap-1 px-2 py-1 text-sm bg-blue-100 text-blue-700 rounded-full"
                  >
                    <span>{option.label}</span>
                    <button 
                      className="text-blue-700 focus:outline-none hover:text-blue-900"
                      onClick={(e) => removeOption(option, e)}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </>
            ) : (
              <span className="text-gray-500">{placeholder}</span>
            )}
          </div>
          
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={18} className="text-gray-500" />
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Dropdown options rendered via portal */}
      {typeof window !== 'undefined' && createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              ref={dropdownRef}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed z-[9999] bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
              style={{ 
                top: dropdownPosition.top,
                left: dropdownPosition.left,
                width: dropdownPosition.width
              }}
            >
              <div className="max-h-60 overflow-y-auto py-0">
                <div className="sticky top-0 w-full bg-white">
                  {SearchInput}
                </div>
                
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option) => {
                    const isSelected = selectedOptions.some(item => item.value === option.value);
                    
                    return (
                      <motion.div
                        key={option.value}
                        whileHover={{ backgroundColor: '#f3f4f6' }}
                        className={`px-4 py-2 cursor-pointer flex items-center gap-2 ${
                          isSelected ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                        }`}
                        onClick={() => handleSelect(option)}
                      >
                        <div className={`w-4 h-4 border rounded flex items-center justify-center ${
                          isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                        }`}>
                          {isSelected && (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          )}
                        </div>
                        <span>{option.label}</span>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="px-4 py-3 text-sm text-gray-500">
                    No options found
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
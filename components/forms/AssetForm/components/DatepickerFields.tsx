import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface DatePickerProps {
  name: string;
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (e: any) => void;
  onBlur?: (e: any) => void;
  validation?: "valid" | "invalid" | "empty" | "untouched" | undefined;
  touched?: boolean;
  errorMessage?: string;
  icon?: React.ReactNode;
  min?: string;
  max?: string;
  format?: string;
  /**
   * If true, the component will mark values with placeholders (like YYYY-MM-DD) as invalid
   */
  validatePlaceholders?: boolean;
}

// Helper functions for date manipulation
const formatDate = (date: Date, format: string = 'yyyy-MM-dd'): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return format
    .replace('yyyy', String(year))
    .replace('MM', month)
    .replace('dd', day);
};

const parseDate = (dateString: string): Date | null => {
  if (!dateString) return null;
  
  // Check for placeholder values like "YYYY-04-14"
  if (dateString.includes('YYYY') || dateString.includes('yyyy')) {
    return null;
  }
  
  // Handle ISO date strings from API (e.g., "2025-05-16T00:00:00.000Z")
  if (dateString.includes('T')) {
    const parsedDate = new Date(dateString);
    return isNaN(parsedDate.getTime()) ? null : parsedDate;
  }
  
  // Handle different date formats (yyyy-MM-dd, MM/dd/yyyy, etc.)
  const parsedDate = new Date(dateString);
  return isNaN(parsedDate.getTime()) ? null : parsedDate;
};

const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year: number, month: number): number => {
  return new Date(year, month, 1).getDay();
};

const generateCalendarDays = (year: number, month: number): Array<{ date: Date; isCurrentMonth: boolean }> => {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);
  const days = [];
  
  // Previous month days
  const prevMonthDays = firstDayOfMonth;
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevMonthYear = month === 0 ? year - 1 : year;
  const daysInPrevMonth = getDaysInMonth(prevMonthYear, prevMonth);
  
  for (let i = prevMonthDays - 1; i >= 0; i--) {
    days.push({
      date: new Date(prevMonthYear, prevMonth, daysInPrevMonth - i),
      isCurrentMonth: false
    });
  }
  
  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      date: new Date(year, month, i),
      isCurrentMonth: true
    });
  }
  
  // Next month days
  const remainingCells = 42 - days.length; // 6 rows of 7 days
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextMonthYear = month === 11 ? year + 1 : year;
  
  for (let i = 1; i <= remainingCells; i++) {
    days.push({
      date: new Date(nextMonthYear, nextMonth, i),
      isCurrentMonth: false
    });
  }
  
  return days;
};

export const DatePickerFields = ({
  name,
  label,
  placeholder = "Select date",
  value,
  onChange,
  onBlur,
  validation,
  touched,
  errorMessage,
  icon = <Calendar size={16} />,
  min,
  max,
  format = 'yyyy-MM-dd',
  validatePlaceholders = true
}: DatePickerProps) => {
  // Format ISO date to YYYY-MM-DD if needed
  const formatISODate = (dateStr: string): string => {
    if (!dateStr) return '';
    if (dateStr.includes('T')) {
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        return formatDate(date, 'yyyy-MM-dd');
      }
    }
    return dateStr;
  };

  // Auto-format ISO date when component receives value
  useEffect(() => {
    if (value && value.includes('T')) {
      const formattedDate = formatISODate(value);
      if (formattedDate !== value) {
        // Update value if it's an ISO date
        const event = {
          target: {
            name,
            value: formattedDate
          }
        };
        onChange(event);
      }
    }
  }, [value, name]);

  // Check if value contains placeholder patterns
  const hasPlaceholder = value && (
    value.includes('YYYY') || 
    value.includes('yyyy') || 
    value.includes('MM') || 
    value.includes('DD') || 
    value.includes('dd')
  );
  
  // Override validation if we have placeholder values
  const effectiveValidation = validatePlaceholders && hasPlaceholder ? "invalid" : validation;
  
  const isValid = effectiveValidation === "valid";
  const isInvalid = effectiveValidation === "invalid" || effectiveValidation === "empty";
  
  const [isOpen, setIsOpen] = useState(false);
  const [displayValue, setDisplayValue] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewYear, setViewYear] = useState(currentDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(currentDate.getMonth());
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Format date for display and validate
  useEffect(() => {
    if (value) {
      // Check for placeholder values like "YYYY-04-14"
      const hasYearPlaceholder = value.includes('YYYY');
      
      if (hasYearPlaceholder) {
        // If placeholder is present, display as is but don't treat as valid date
        setDisplayValue(value);
      } else {
        const date = parseDate(value);
        if (date) {
          setDisplayValue(formatDate(date, format));
          setViewMonth(date.getMonth());
          setViewYear(date.getFullYear());
        } else {
          // For invalid date format, still show the value
          setDisplayValue(value);
        }
      }
    } else {
      setDisplayValue('');
    }
  }, [value, format]);
  
  // Close calendar when clicking outside
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
  
  // Generate calendar days
  const calendarDays = generateCalendarDays(viewYear, viewMonth);
  
  // Handle date selection
  const handleSelectDate = (date: Date) => {
    const formattedDate = formatDate(date, 'yyyy-MM-dd');
    
    // Check if date is within allowed range
    if ((min && formattedDate < min) || (max && formattedDate > max)) {
      return;
    }
    
    // Create synthetic event
    const event = {
      target: {
        name,
        value: formattedDate
      }
    };
    
    onChange(event);
    setIsOpen(false);
    
    if (onBlur) {
      onBlur(event);
    }
  };
  
  // Navigation functions
  const goToPreviousMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };
  
  const goToNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };
  
  const clearDate = (e: React.MouseEvent) => {
    e.stopPropagation();
    const event = {
      target: {
        name,
        value: ''
      }
    };
    onChange(event);
  };
  
  // Month and day names
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  
  // Check if a date is selected
  const isDateSelected = (date: Date): boolean => {
    if (!value) return false;
    const selectedDate = parseDate(value);
    if (!selectedDate) return false;
    
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };
  
  // Check if a date is today
  const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };
  
  return (
    <motion.div 
      className="relative mb-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      ref={containerRef}
    >
      {/* Label */}
      {label && (
        <label 
          className={`text-sm font-medium mb-1 block ${isInvalid ? 'text-red-500' : isValid ? 'text-green-500' : 'text-gray-700'}`}
          htmlFor={name}
        >
          {label}
        </label>
      )}
      
      {/* Custom input UI */}
      <div className="relative">
        <input
          type="text"
          ref={inputRef}
          name={name}
          value={displayValue}
          placeholder={placeholder}
          onChange={onChange}
          className={`
            w-full px-4 py-2.5 pl-9
            bg-gray-50 
            border ${isInvalid ? 'border-red-500' : isValid ? 'border-green-500' : 'border-gray-200'} 
            rounded-lg
            transition-colors duration-200
            focus:outline-none focus:border-blue-500
          `}
          readOnly
          onClick={() => setIsOpen(!isOpen)}
        />
        
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
          {icon}
        </div>
        
        {displayValue && (
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            onClick={clearDate}
            aria-label="Clear date"
          >
            <X size={16} />
          </button>
        )}
      </div>
      
      {/* Error message */}
      <AnimatePresence>
        {isInvalid && errorMessage && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="text-red-500 text-xs mt-1 pl-1"
          >
            {errorMessage}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Calendar dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -5, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -5, height: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute z-30 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden w-64"
          >
            {/* Calendar header */}
            <div className="flex items-center justify-between border-b border-gray-100 p-2">
              <button
                type="button"
                onClick={goToPreviousMonth}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Previous month"
              >
                <ChevronLeft size={18} className="text-gray-600" />
              </button>
              
              <h3 className="text-sm font-medium text-gray-800">
                {new Date(viewYear, viewMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h3>
              
              <button
                type="button"
                onClick={goToNextMonth}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Next month"
              >
                <ChevronRight size={18} className="text-gray-600" />
              </button>
            </div>
            
            {/* Day names */}
            <div className="grid grid-cols-7 text-center border-b border-gray-100">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day, index) => (
                <div key={day} className="text-xs font-medium text-gray-500 py-2">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-1 p-2">
              {calendarDays.map((day, index) => {
                const isSelectable = !(
                  (min && formatDate(day.date) < min) || 
                  (max && formatDate(day.date) > max)
                );
                
                return (
                  <motion.button
                    key={index}
                    type="button"
                    className={`
                      w-8 h-8 flex items-center justify-center text-sm rounded-full
                      ${!day.isCurrentMonth && 'text-gray-400'} 
                      ${!isSelectable && 'opacity-30 cursor-not-allowed'}
                      ${isDateSelected(day.date) ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}
                      ${isToday(day.date) && !isDateSelected(day.date) ? 'border border-blue-400' : ''}
                    `}
                    onClick={() => isSelectable && handleSelectDate(day.date)}
                    disabled={!isSelectable}
                    whileHover={isSelectable ? { scale: 1.05 } : {}}
                    whileTap={isSelectable ? { scale: 0.95 } : {}}
                  >
                    {day.date.getDate()}
                  </motion.button>
                );
              })}
            </div>
            
            {/* Footer with today button */}
            <div className="border-t border-gray-100 p-2 flex justify-end">
              <button
                type="button"
                className="text-xs font-medium text-blue-500 hover:text-blue-700 transition-colors py-1 px-2"
                onClick={() => handleSelectDate(new Date())}
              >
                Today
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
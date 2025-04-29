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
  validation?: "valid" | "invalid" | "empty" | undefined;
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
      <div className="flex items-center relative flex-grow">
        <div className="relative w-full">
          <input
            ref={inputRef}
            type="text"
            name={name}
            className={`w-full pl-4 pr-10 py-2 bg-white border rounded-lg focus:outline-none cursor-pointer ${
              isInvalid 
                ? "border-red-500" 
                : isValid 
                  ? "border-green-500" 
                  : "border-gray-300"
            }`}
            placeholder={placeholder}
            value={displayValue}
            readOnly
            onClick={() => setIsOpen(!isOpen)}
          />
          
          {/* Clear button */}
          {value && (
            <button
              type="button"
              className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={clearDate}
            >
              <X size={16} />
            </button>
          )}
          
          {/* Calendar icon */}
          <div 
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Calendar size={16} />
          </div>
          
          <label
            className={`absolute pointer-events-none items-center rounded-full h-6 flex gap-0 transition-all duration-200 ${
              value || isOpen
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
          
          {touched && (
            <div className="absolute right-16 top-1/2 -translate-y-1/2">
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
          )}
        </div>
      </div>
      
      {/* Calendar dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-3"
          >
            {/* Calendar header */}
            <div className="flex items-center justify-between mb-2">
              <button 
                type="button"
                className="p-1 rounded-full hover:bg-gray-100"
                onClick={goToPreviousMonth}
              >
                <ChevronLeft size={20} className="text-gray-600" />
              </button>
              <div className="font-medium">
                {monthNames[viewMonth]} {viewYear}
              </div>
              <button 
                type="button"
                className="p-1 rounded-full hover:bg-gray-100"
                onClick={goToNextMonth}
              >
                <ChevronRight size={20} className="text-gray-600" />
              </button>
            </div>
            
            {/* Day names */}
            <div className="grid grid-cols-7 gap-1 mb-1">
              {dayNames.map((day, index) => (
                <div key={index} className="text-center text-xs font-medium text-gray-500 py-1">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((item, index) => {
                const { date, isCurrentMonth } = item;
                const isSelected = isDateSelected(date);
                const isTodayDate = isToday(date);
                
                // Check if date is outside allowed range
                const formattedDate = formatDate(date, 'yyyy-MM-dd');
                const isDisabled = (min && formattedDate < min) || (max && formattedDate > max);
                
                return (
                  <motion.div
                    key={index}
                    whileHover={!isDisabled ? { backgroundColor: '#f3f4f6' } : {}}
                    className={`
                      text-center py-1 rounded-full text-sm cursor-pointer
                      ${!isCurrentMonth ? 'text-gray-300' : 'text-gray-700'}
                      ${isSelected ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}
                      ${isTodayDate && !isSelected ? 'border border-blue-500' : ''}
                      ${isDisabled ? 'cursor-not-allowed opacity-50' : ''}
                    `}
                    onClick={() => !isDisabled && handleSelectDate(date)}
                  >
                    {date.getDate()}
                  </motion.div>
                );
              })}
            </div>
            
            {/* Today button */}
            <div className="mt-2 text-center">
              <button
                type="button"
                className="text-xs text-blue-600 hover:text-blue-800"
                onClick={() => handleSelectDate(new Date())}
              >
                Today
              </button>
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
            {hasPlaceholder ? "Please enter a valid date" : errorMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
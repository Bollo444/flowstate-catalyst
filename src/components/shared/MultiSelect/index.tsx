import React, { useState, useRef, useEffect } from "react";
import clsx from 'clsx'; // Use clsx for conditional classes

// Interface remains the same, ensure Option is exported or defined if used elsewhere
interface Option {
  value: string;
  label: string;
  icon?: string; // Assuming icon is a string identifier or path, not a ReactNode yet
}

interface MultiSelectProps {
  options: Option[];
  value: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string; // Allow passing external classes
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  value, // This is the array of selected values
  onChange,
  placeholder = "Select options...",
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [containerRef]);

  const selectedOptions = options.filter(opt => value.includes(opt.value));

  return (
    <div className={clsx("relative w-full", className)} ref={containerRef}>
      {/* Select Header */}
      <div
        className="flex cursor-pointer items-center justify-between rounded-md border border-border-light bg-background-light px-3 py-2 dark:border-border-dark dark:bg-background-dark"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedOptions.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {selectedOptions.map((option) => (
              <span
                key={option.value}
                className="flex items-center gap-1 rounded bg-background-light-secondary px-2 py-0.5 text-sm dark:bg-background-dark-secondary"
              >
                {/* Optionally display icon here if needed */}
                {option.label}
                <button
                  className="ml-1 p-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent opening dropdown
                    onChange(value.filter((v) => v !== option.value));
                  }}
                  title={`Remove ${option.label}`}
                >
                  &times; {/* Simple 'x' character */}
                </button>
              </span>
            ))}
          </div>
        ) : (
          <span className="text-foreground-light-secondary dark:text-foreground-dark-secondary">{placeholder}</span>
        )}
        {/* Arrow Icon */}
        <span className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </div>

      {/* Options List */}
      {isOpen && (
        <div className="absolute left-0 right-0 z-10 mt-1 max-h-52 overflow-y-auto rounded-md border border-border-light bg-background-light shadow-lg dark:border-border-dark dark:bg-background-dark">
          {options.map((option) => (
            <div
              key={option.value}
              className={clsx(
                "flex cursor-pointer items-center gap-2 px-3 py-2 hover:bg-background-light-secondary dark:hover:bg-background-dark-secondary",
                value.includes(option.value) && "bg-secondary-light/20 dark:bg-secondary-dark/30" // Subtle selected background indicator
              )}
              onClick={() => {
                const newValue = value.includes(option.value)
                  ? value.filter((v) => v !== option.value)
                  : [...value, option.value];
                onChange(newValue);
                // Optionally close dropdown after selection: setIsOpen(false);
              }}
            >
              {/* Optional icon */}
              {option.icon && <span className="inline-flex h-5 w-5 items-center justify-center">{option.icon}</span>}
              {option.label}
              {/* Add checkmark for selected items */}
              {value.includes(option.value) && <span className="ml-auto text-secondary-light dark:text-secondary-dark">✓</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

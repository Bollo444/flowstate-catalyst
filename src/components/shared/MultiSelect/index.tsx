import React, { useState } from 'react';
import styles from './styles.module.css';

interface Option {
  value: string;
  label: string;
  icon?: string;
}

interface MultiSelectProps {
  options: Option[];
  value: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select metrics...'
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.multiSelect}>
      <div 
        className={styles.selectHeader}
        onClick={() => setIsOpen(!isOpen)}
      >
        {value.length > 0 ? (
          <div className={styles.selectedItems}>
            {value.map(v => (
              <span key={v} className={styles.selectedItem}>
                {options.find(opt => opt.value === v)?.label}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(value.filter(val => val !== v));
                  }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        ) : (
          <span className={styles.placeholder}>{placeholder}</span>
        )}
        <span className={styles.arrow}>▼</span>
      </div>

      {isOpen && (
        <div className={styles.optionsList}>
          {options.map(option => (
            <div
              key={option.value}
              className={`${styles.option} ${
                value.includes(option.value) ? styles.selected : ''
              }`}
              onClick={() => {
                const newValue = value.includes(option.value)
                  ? value.filter(v => v !== option.value)
                  : [...value, option.value];
                onChange(newValue);
              }}
            >
              {option.icon && (
                <span className={styles.optionIcon}>{option.icon}</span>
              )}
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
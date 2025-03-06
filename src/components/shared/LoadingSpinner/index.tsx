import React from 'react';
import { CircularProgress } from '@mui/material';
import styles from './styles.module.css';

export interface SpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  message?: string;
  className?: string;
}

const spinnerSizes = {
  small: 24,
  medium: 40,
  large: 56
};

export const LoadingSpinner: React.FC<SpinnerProps> = ({
  size = 'medium',
  color = '#4A9EFF',
  message,
  className
}) => {
  return (
    <div className={`${styles.spinner} ${className || ''}`}>
      <CircularProgress
        size={spinnerSizes[size]}
        style={{ color }}
      />
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
};
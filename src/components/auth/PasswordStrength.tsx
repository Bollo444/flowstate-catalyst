'use client';

import { useMemo } from 'react';
import styles from './Auth.module.css';

interface PasswordStrengthProps {
  password: string;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const strength = useMemo(() => {
    if (!password) return 0;
    
    let score = 0;
    
    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    
    // Character variety checks
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    // Pattern checks (subtract points for common patterns)
    if (/(.)\1{2,}/.test(password)) score -= 1; // Repeated characters
    if (/^(?:123|abc|qwerty)/i.test(password)) score -= 1; // Common sequences

    // Ensure score is between 0 and 4
    return Math.max(0, Math.min(4, score));
  }, [password]);

  const strengthLabel = useMemo(() => {
    if (!password) return '';
    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    return labels[strength];
  }, [password, strength]);

  const strengthClass = useMemo(() => {
    const classes = ['none', 'weak', 'fair', 'good', 'strong'];
    return classes[strength];
  }, [strength]);

  if (!password) return null;

  return (
    <div className={styles.passwordStrength}>
      <div className={styles.strengthBars}>
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className={`${styles.strengthBar} ${
              i < strength ? styles[strengthClass] : ''
            }`}
          />
        ))}
      </div>
      <span className={`${styles.strengthLabel} ${styles[strengthClass]}`}>
        {strengthLabel}
      </span>
    </div>
  );
}

export default PasswordStrength;

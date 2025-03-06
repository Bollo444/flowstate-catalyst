import React from 'react';
import styles from './styles.module.css';

interface AvatarProps {
  src: string | null;
  alt: string;
  size?: number;
  className?: string;
}

export function Avatar({ src, alt, size = 40, className = '' }: AvatarProps) {
  const initials = alt
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const style = {
    width: `${size}px`,
    height: `${size}px`,
    fontSize: `${size * 0.4}px`,
  };

  if (!src) {
    return (
      <div 
        className={`${styles.initialsAvatar} ${className}`}
        style={style}
        title={alt}
        data-testid="avatar-initials"
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`${styles.avatar} ${className}`}
      style={style}
      data-testid="avatar-image"
    />
  );
}

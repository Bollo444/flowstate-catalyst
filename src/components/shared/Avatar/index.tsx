import React from "react";
import clsx from 'clsx'; // Import clsx

interface AvatarProps {
  src: string | null | undefined; // Allow undefined for src
  alt: string;
  size?: number;
  className?: string;
}

export function Avatar({ src, alt, size = 40, className = "" }: AvatarProps) {
  const initials = alt
    ?.split(" ")
    ?.map((word) => word[0] || '') // Handle potential null/undefined alt and empty words
    ?.join("")
    ?.toUpperCase()
    ?.slice(0, 2) || '??'; // Fallback initials

  const style = {
    width: `${size}px`,
    height: `${size}px`,
    fontSize: `${size * 0.4}px`, // Keep dynamic sizing
  };

  // Base classes for both types of avatars
  const baseClasses = "rounded-full flex items-center justify-center border-2 border-border-light dark:border-border-dark transition-transform duration-200 ease-in-out hover:scale-105";

  if (!src) {
    // Initials Avatar
    return (
      <div
        className={clsx(
           baseClasses,
           "bg-secondary-light dark:bg-secondary-dark text-white font-semibold", // Use secondary theme color for initials background
           className // Allow merging external classes
        )}
        style={style}
        title={alt} // Tooltip shows full name
        data-testid="avatar-initials"
      >
        {initials}
      </div>
    );
  }

  // Image Avatar
  return (
    <img
      src={src}
      alt={alt}
      className={clsx(
          baseClasses,
          "object-cover bg-background-light-secondary dark:bg-background-dark", // object-cover, themed fallback bg
          className // Allow merging external classes
      )}
      style={style}
      data-testid="avatar-image"
      // Add error handling in case the image fails to load
      onError={(e) => {
         // Optional: Replace with initials on error, requires state or different approach
         (e.target as HTMLImageElement).style.display = 'none'; // Hide broken image
         // Consider rendering initials fallback here instead
      }}
    />
  );
}

// Optional: Add a loading state variation if needed
/*
export function AvatarLoading({ size = 40, className = "" }: Pick<AvatarProps, 'size' | 'className'>) {
  const style = { width: `${size}px`, height: `${size}px` };
  const baseClasses = "rounded-full border-2 border-border-light dark:border-border-dark";
  return (
      <div
        className={clsx(
            baseClasses,
            "bg-background-light-secondary dark:bg-background-dark animate-pulse", // Pulse animation for loading
            className
        )}
        style={style}
        data-testid="avatar-loading"
      ></div>
  );
}
*/

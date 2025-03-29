import type { Config } from "tailwindcss";

const config: Config = {
  // Specifies files Tailwind should scan for classes
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // Defines theme customizations
  theme: {
    // Extends the default Tailwind theme
    extend: {
      // Defines custom color palette
      colors: {
        // Using a flat structure, light mode colors are default
        background: {
          light: '#ffffff',
          'light-secondary': '#f8f9fa',
          dark: '#1a1a1a',
          'dark-secondary': '#262626',
        },
        foreground: {
          light: '#1a1a1a',
          'light-secondary': '#666666',
          dark: '#ffffff',
          'dark-secondary': '#a3a3a3',
        },
        primary: {
          light: '#ff7700', // Orange from theme.css
          DEFAULT: '#ff7700', // Default to light mode color
          dark: '#ff8c33', // Slightly adjusted for dark background
        },
        secondary: {
          light: '#4a9eff', // Blue from theme.css
          DEFAULT: '#4a9eff',
          dark: '#77b5ff', // Slightly adjusted for dark background
        },
        accent: { // For highlights, based on original globals.css
          light: '#3b82f6',
          'light-muted': '#dbeafe',
          DEFAULT: '#3b82f6',
          dark: '#60a5fa',
          'dark-muted': 'rgba(59, 130, 246, 0.2)',
        },
        success: { // Status colors, from original globals.css
          light: '#22c55e',
          'light-muted': '#dcfce7',
          DEFAULT: '#22c55e',
          dark: '#4ade80',
          'dark-muted': 'rgba(34, 197, 94, 0.2)',
        },
        warning: {
          light: '#f59e0b',
          'light-muted': '#fef3c7',
          DEFAULT: '#f59e0b',
          dark: '#fbbf24',
          'dark-muted': 'rgba(245, 158, 11, 0.2)',
        },
        error: {
          light: '#ef4444',
          'light-muted': '#fee2e2',
          DEFAULT: '#ef4444',
          dark: '#f87171',
          'dark-muted': 'rgba(239, 68, 68, 0.2)',
        },
        info: { // Reuse accent for info state
          light: '#3b82f6',
          'light-muted': '#dbeafe',
          DEFAULT: '#3b82f6',
          dark: '#60a5fa',
          'dark-muted': 'rgba(59, 130, 246, 0.2)',
        },
        border: { // Border colors
          light: '#e0e0e0', // Light border from theme.css attempt
          DEFAULT: '#e0e0e0',
          dark: '#404040', // Dark border from theme.css
        },
      },
      // Add typography settings
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'Cantarell',
          'Fira Sans',
          'Droid Sans',
          'Helvetica Neue',
          'sans-serif',
        ],
        // Add other font families if needed (e.g., mono, serif)
      },
      fontSize: {
        // Add custom sizes or override defaults if needed
        // Example: 'xs': '.75rem', 'sm': '.875rem', 'base': '1rem', ...
      },
      lineHeight: {
        // Add custom line heights or override defaults if needed
        // Example: 'tight': '1.25', 'normal': '1.5', ...
      },
    },
  },
  // Enables dark mode based on OS preference
  darkMode: 'media',
  // No Tailwind plugins currently used
  plugins: [],
};

export default config;


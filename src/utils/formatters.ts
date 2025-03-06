// src/utils/formatters.ts
export const formatTimestamp = (timestamp: string, timeframe: string): string => {
  const date = new Date(timestamp);
  switch (timeframe) {
    case 'day':
      return date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    case 'week':
      return date.toLocaleDateString([], { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    case 'month':
      return date.toLocaleDateString([], { 
        month: 'short', 
        day: 'numeric' 
      });
    default:
      return date.toLocaleDateString();
  }
};
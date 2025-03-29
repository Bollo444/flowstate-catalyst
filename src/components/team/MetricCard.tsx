// src/components/team/MetricCard.tsx
import React from "react";
import clsx from 'clsx';
import { ArrowUp, ArrowDown } from 'lucide-react'; // Import icons for trend

interface MetricCardProps {
  title: string;
  value: number | string;
  trend?: {
    direction: "up" | "down";
    percentage: number;
  };
  className?: string; // Allow external classes
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, trend, className }) => {
  const trendColorClasses = trend?.direction === "up"
      ? "bg-success-light-muted text-success-light dark:bg-success-dark-muted dark:text-success-dark"
      : "bg-error-light-muted text-error-light dark:bg-error-dark-muted dark:text-error-dark";

  return (
    // Card Container: Themed background, rounded, padding, text alignment, shadow
    <div className={clsx(
        "rounded-lg p-4 text-center",
        "bg-background-light dark:bg-background-dark-secondary", // Use theme colors
        "shadow-md", // Add shadow
        className
    )}>
      {/* Title */}
      <h4 className="mb-2 text-sm font-medium text-foreground-light-secondary dark:text-foreground-dark-secondary"> {/* Adjusted size/color */}
        {title}
      </h4>
      {/* Value */}
      <div className="my-2 text-3xl font-bold text-primary-light dark:text-primary-dark"> {/* Adjusted size/color */}
        {value}
      </div>
      {/* Trend Indicator */}
      {trend && (
        <div className={clsx(
            "inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs", // Layout and sizing
            trendColorClasses // Apply conditional theme colors
        )}>
           {trend.direction === "up" ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
           <span>{trend.percentage}%</span>
        </div>
      )}
    </div>
  );
};

export default MetricCard;

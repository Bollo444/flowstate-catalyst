// src/components/dashboard/QuickActions.tsx
import React, { useState } from "react";
import { useFlowStore } from "@/stores/flowStore"; // Corrected path
import {
  Play,
  Focus,
  Users,
  BarChart2,
  CheckCircle, // Keep if needed elsewhere, not used in this simplified version
  Loader,
} from "lucide-react";
import clsx from 'clsx'; // Import clsx

interface ActionButton {
  icon: React.ReactNode;
  label: string;
  action: () => Promise<void>;
  colorClass: string; // Use a class name reference instead of color string
}

export const QuickActions: React.FC<{ onActionComplete?: () => void }> = ({
  onActionComplete,
}) => {
  const [loading, setLoading] = useState<string | null>(null);
  const { startFlowSession, toggleFocusMode } = useFlowStore();

  const actions: ActionButton[] = [
    {
      icon: <Play size={20} />,
      label: "Start Flow",
      action: async () => {
        await startFlowSession();
      },
      colorClass: "bg-primary-light dark:bg-primary-dark", // Use theme primary color
    },
    {
      icon: <Focus size={20} />,
      label: "Focus Mode",
      action: async () => {
        await toggleFocusMode();
      },
      colorClass: "bg-secondary-light dark:bg-secondary-dark", // Use theme secondary color
    },
    {
      icon: <Users size={20} />,
      label: "Team Sync",
      action: async () => {
        // Implement team sync logic
        console.warn("Team Sync action not implemented.");
      },
      colorClass: "bg-accent-light dark:bg-accent-dark", // Use theme accent color
    },
    {
      icon: <BarChart2 size={20} />,
      label: "Metrics",
      action: async () => {
        // Implement metrics export
        console.warn("Metrics action not implemented.");
      },
      colorClass: "bg-success-light dark:bg-success-dark", // Use theme success color
    },
  ];

  const handleAction = async (action: ActionButton) => {
    setLoading(action.label);
    try {
      await action.action();
      onActionComplete?.();
    } catch (error) {
      console.error("Quick action failed:", error); // Improved error logging
    } finally {
      setLoading(null);
    }
  };

  return (
    // Container: Themed background, rounded, padding, shadow
    <div className="bg-background-light dark:bg-background-dark-secondary rounded-lg p-4 shadow-md">
       <h3 className="text-md font-semibold mb-3 text-foreground-light dark:text-foreground-dark">Quick Actions</h3>
       {/* Actions Grid: Responsive grid layout, gap */}
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          // Action Button: Flex column, centered, themed background/text, hover, rounded, padding, transition
          <button
            key={action.label}
            onClick={() => handleAction(action)}
            className={clsx(
              "flex flex-col items-center justify-center p-3 rounded-md text-white hover:bg-opacity-80 dark:hover:bg-opacity-80 transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed",
              action.colorClass // Apply background color class
            )}
            disabled={loading === action.label}
          >
            {loading === action.label ? (
              <Loader className="animate-spin h-5 w-5" /> // Use Tailwind spin animation
            ) : (
              action.icon
            )}
            <span className="text-xs mt-1">{action.label}</span> {/* Adjusted text size/margin */}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions; // Add default export if needed, though named export is used in DashboardLayout

"use client"; // Ensure this is a client component to use hooks

import React, { useState, useCallback } from "react";
import styles from "./styles.module.css";

// Import components using correct export type (default or named)
import FlowNavigation from "./FlowNavigation";
import FlowLogo from "./FlowLogo";
import NavItems from "./NavItems";
import FlowMenuItem from "./FlowMenuItem";
import FlowContent from "./FlowContent";
import FlowHeader from "./FlowHeader";
import { FlowStateIndicator } from "@/components/flow/FlowStateIndicator"; // Named import
import { QuickActions } from "@/components/flow/QuickActions";
import TeamPresence from "./TeamPresence";
import FlowWorkspace from "./FlowWorkspace";
import FlowTabs from "./FlowTabs"; // Default import, assumes props handling below
import { ContentArea } from "@/components/flow/ContentArea";
import FlowSidebar from "./FlowSidebar";

// Import context and types
import { useFlowContext } from "@/context/FlowContext";
import { ActivityMetrics } from "@/types/flow";

export const FlowInterface: React.FC = () => {
  // State for active tab (needed by FlowTabs)
  const [activeTab, setActiveTab] = useState<string>("tasks"); // Default to 'tasks' or similar

  // Get flowState from context (needed by FlowStateIndicator)
  // Provide default state if context is not yet ready or for safety
  const flowContext = useFlowContext();
  const safeFlowState = flowContext?.flowState ?? {
    userId: "",
    score: 0,
    intensity: 0,
    status: "rest",
    activeTime: 0,
    lastUpdated: "",
  };

  // Placeholder metrics for FlowStateIndicator (replace with actual metrics source if available)
  const placeholderMetrics: ActivityMetrics = {
    activeTime: safeFlowState.activeTime,
    taskCompletions: 0,
    contextSwitches: 0,
    dayProgress: new Date().getHours() / 24,
    interruptions: 0,
    interruptedTime: 0,
  };

  // Placeholder handler for interrupts (needed by FlowStateIndicator)
  const handleInterrupt = useCallback(() => {
    console.log("Interrupt recorded!");
    // Add actual interrupt handling logic here
  }, []);

  // Handler for tab changes (needed by FlowTabs)
  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId);
  }, []);

  return (
    <div className={styles.flowContainer}>
      {/* Render Navigation - It handles its internal Logo and NavItems */}
      <FlowNavigation />

      <FlowContent>
        <FlowHeader>
          {/* Provide required props to FlowStateIndicator */}
          <FlowStateIndicator
            flowState={safeFlowState}
            metrics={placeholderMetrics}
            onInterrupt={handleInterrupt}
          />
          <QuickActions />
          <TeamPresence />
        </FlowHeader>

        <FlowWorkspace>
          {/* Provide required props to FlowTabs */}
          <FlowTabs activeTab={activeTab} onTabChange={handleTabChange} />
          {/* ContentArea might display content based on activeTab */}
          <ContentArea /* Pass props based on activeTab if needed */ />
          <FlowSidebar />
        </FlowWorkspace>
      </FlowContent>
    </div>
  );
};

export default FlowInterface; // Add default export if this is the main component export

"use client";

import { createContext, useContext } from "react";
import { useFlowContext } from "@/hooks/useFlowContext";

const FlowContext = createContext<FlowContextValue | null>(null);

export function FlowContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const contextValue = useFlowContext();

  return (
    <FlowContext.Provider value={contextValue}>{children}</FlowContext.Provider>
  );
}

export function useFlow() {
  const context = useContext(FlowContext);
  if (!context) {
    throw new Error("useFlow must be used within FlowContextProvider");
  }
  return context;
}

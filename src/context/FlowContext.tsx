"use client";

import React, { createContext, useReducer, useContext, ReactNode } from "react";

import { FlowStatus } from "@/types/supabase";

export interface FlowState {
  userId: string;
  score: number;
  intensity: number;
  status: FlowStatus;
  activeTime: number;
  sessionStart?: string;
  lastUpdated: string;
}

interface FlowContextType {
  flowState: FlowState;
  updateFlowState: (updates: Partial<FlowState>) => void;
}

interface FlowAction {
  type: "UPDATE_FLOW_STATE";
  payload: Partial<FlowState>;
}

const initialState: FlowState = {
  userId: "",
  score: 0,
  intensity: 0,
  status: "rest",
  activeTime: 0,
  lastUpdated: new Date().toISOString(),
};

export const FlowContext = createContext<FlowContextType | null>(null);

function flowReducer(state: FlowState, action: FlowAction): FlowState {
  switch (action.type) {
    case "UPDATE_FLOW_STATE":
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}
``;
interface FlowContextProviderProps {
  children: React.ReactNode;
  initialFlowState?: Partial<FlowState>;
}

export const FlowContextProvider: React.FC<FlowContextProviderProps> = ({
  children,
  initialFlowState = {},
}) => {
  const [flowState, dispatch] = useReducer(flowReducer, {
    ...initialState,
    ...initialFlowState,
    lastUpdated: new Date().toISOString(),
  });

  const updateFlowState = (updates: Partial<FlowState>) => {
    dispatch({
      type: "UPDATE_FLOW_STATE",
      payload: updates,
    });
  };

  return (
    <FlowContext.Provider
      value={{
        flowState,
        updateFlowState,
      }}
    >
      {children}
    </FlowContext.Provider>
  );
};

export function useFlowContext() {
  const context = useContext(FlowContext);
  if (!context) {
    throw new Error("useFlowContext must be used within a FlowProvider");
  }
  return context;
}

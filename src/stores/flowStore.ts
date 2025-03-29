import { create } from "zustand";

interface FlowState {
  isFlowActive: boolean;
  isFocusMode: boolean;
  currentSession: string | null;
  startFlowSession: () => Promise<void>;
  endFlowSession: () => Promise<void>;
  toggleFocusMode: () => Promise<void>;
}

export const useFlowStore = create<FlowState>((set) => ({
  isFlowActive: false,
  isFocusMode: false,
  currentSession: null,
  startFlowSession: async () => {
    set({ isFlowActive: true, currentSession: new Date().toISOString() });
  },
  endFlowSession: async () => {
    set({ isFlowActive: false, currentSession: null });
  },
  toggleFocusMode: async () => {
    set((state) => ({ isFocusMode: !state.isFocusMode }));
  },
}));

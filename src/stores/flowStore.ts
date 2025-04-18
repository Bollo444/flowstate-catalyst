import { create } from "zustand";

interface FlowState {
  isFlowActive: boolean;
  isFocusMode: boolean;
   activeView: string; // Added state for the active view
  currentSession: string | null;
  startFlowSession: () => Promise<void>;
  endFlowSession: () => Promise<void>;
  toggleFocusMode: () => Promise<void>;
   setActiveView: (view: string) => void; // Added action to set view
}

export const useFlowStore = create<FlowState>((set) => ({
  isFlowActive: false,
  isFocusMode: false,
   activeView: 'dashboard', // Default view
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
   setActiveView: (view) => set({ activeView: view }), // Implementation for setActiveView
}));

import { create } from 'zustand';

export type FlowStatus = 'inactive' | 'optimal' | 'moderate' | 'low';

interface Task {
  id: string;
  title: string;
  status: string;
}

interface TeamMember {
  id: string;
  name: string;
  currentFlow: {
    score: number;
    status: FlowStatus;
  };
}

interface FlowMetrics {
  focusTime: number;
  flowScore: number;
  completedTasks: number;
  history: Array<{
    timestamp: string;
    score: number;
  }>;
}

interface FlowState {
  currentFlow: {
    score: number;
    status: FlowStatus;
    history: Array<{
      timestamp: string;
      score: number;
      status: FlowStatus;
    }>;
  };
  activeView: 'dashboard' | 'team';
  tasks: Task[];
  teamSync: {
    active: boolean;
  };
  teamMembers: TeamMember[];
  teamFlow: {
    history: Array<{
      timestamp: string;
      score: number;
    }>;
  };
  metrics: FlowMetrics;
  startFlowSession: () => void;
  toggleFocusMode: () => void;
  startTeamSync: () => Promise<void>;
}

export const useFlowStore = create<FlowState>((set) => ({
  currentFlow: {
    score: 0,
    status: 'inactive',
    history: []
  },
  activeView: 'dashboard',
  tasks: [],
  teamSync: {
    active: false
  },
  teamMembers: [],
  teamFlow: {
    history: []
  },
  metrics: {
    focusTime: 0,
    flowScore: 0,
    completedTasks: 0,
    history: []
  },
  startFlowSession: () => {
    set(state => ({
      currentFlow: {
        ...state.currentFlow,
        status: 'optimal',
        score: 75
      }
    }));
  },
  toggleFocusMode: () => {
    // Implement focus mode toggle logic
  },
  startTeamSync: async () => {
    set(state => ({
      teamSync: {
        ...state.teamSync,
        active: true
      }
    }));
  }
}));
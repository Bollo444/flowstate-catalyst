import create from 'zustand';

type FlowStatus = 'peak' | 'flow' | 'rest' | 'building';
interface TeamMember {
  id: string;
  name: string;
  role: string;
  status: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

interface FlowStore {
  currentFlow: {
    score: number;
    status: FlowStatus;
    energy: number;
  };
  team: {
    members: TeamMember[];
    syncStatus: string;
  };
  tasks: {
    active: Task[];
    suggested: Task[];
    completed: Task[];
  };
  actions: {
    updateFlow: (flow: Partial<FlowState>) => void;
    syncTeam: (status: string) => void;
    manageTask: (task: Task) => void;
  };
}

export const useFlowStore = create<FlowStore>((set) => ({
  currentFlow: {
    score: 85,
    status: 'flow',
    energy: 100
  },
  team: {
    members: [],
    syncStatus: 'idle'
  },
  tasks: {
    active: [],
    suggested: [],
    completed: []
  },
  actions: {
    updateFlow: (flow) => set(state => ({ currentFlow: { ...state.currentFlow, ...flow } })),
    syncTeam: (syncStatus) => set(state => ({ team: { ...state.team, syncStatus } })),
    manageTask: (task) => set(state => ({ tasks: { ...state.tasks, active: [...state.tasks.active, task] } })),
  }
}));
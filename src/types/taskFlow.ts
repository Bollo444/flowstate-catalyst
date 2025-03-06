export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'completed';
  created_at: string;
  user_id: string;
  priority?: number;
  flowOptimal?: boolean;
  contextCost?: number;
  completed?: boolean;
  progress?: number;
  completionMetrics?: any; // TODO: Define a proper interface for completionMetrics
  dependencies?: string[]; // Assuming dependencies are strings (task IDs)
  estimatedDuration: number; // Add estimatedDuration
  estimated_duration: number; // Add estimated_duration (with underscore - to handle both cases for now)
}

export interface TaskFlowMetrics {
  focus_duration: number;
  interruptions: number;
  completion_time: number | null;
  flow_score: number;
  productivity_score: number;
}

export interface TaskUpdate {
  id: string;
  flow_metrics: TaskFlowMetrics;
}

export interface TaskFlowSession {
  tasks: string[]; // Array of task IDs
  interruptions: number;
  start_time: string;
  end_time?: string; // Optional end time
  flow_score: number;
  completed_tasks: string[]; // Array of completed task IDs
}

export interface TaskPriorityFactors { // <--- ADDED TaskPriorityFactors interface
  urgency: number;
  importance: number;
  flowAlignment: number;
  complexity: number;
}

export interface TaskPriorityScore {
  score: number;
  factors: TaskPriorityFactors; 
}

export interface TaskAssignmentMatch {
  userId: string;
  score: number;
  flowScore: number;
  workloadScore: number;
  expertiseScore: number;
  reasons: string[];
}

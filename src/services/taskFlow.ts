import { FlowState } from '@/types/flow';
import { supabase } from '@/lib/supabaseClient';

export type TaskStatus = 'active' | 'completed' | 'archived';

export interface CreateTaskInput {
  title: string;
  description?: string;
  priority?: number;
  flowOptimal?: boolean;
  contextCost?: number;
  estimatedDuration: number;
  userId: string;
  teamId?: string;
  projectId?: string;
  dueDate?: string;
  status?: TaskStatus;
}

export const DEFAULT_TASK_VALUES: Partial<Task> = {
  priority: 50,
  flowOptimal: false,
  contextCost: 0,
  completed: false,
  status: 'active',
  progress: 0,
  completionMetrics: {
    flowScore: 0,
    completionTime: 0,
    progress: 0,
    lastUpdate: new Date().toISOString()
  },
  dependencies: []
};

export interface TaskMetrics {
  lastUpdate: string;
  lastNote?: string;
  progress: number;
  flowScore: number;
  completionTime: number;
}

export interface TaskDependency {
  id: string;
  taskId: string;
  dependsOnId: string;
  createdAt: string;
}

export interface CompletionMetrics {
  flowScore: number;
  completionTime: number;
  progress: number;
  lastNote?: string;
  lastUpdate: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: number;
  flowOptimal: boolean;
  contextCost: number;
  estimatedDuration: number;
  completed: boolean;
  userId: string;
  teamId?: string;
  projectId?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  status: TaskStatus;
  completionMetrics: CompletionMetrics;
  dependencies: TaskDependency[];
  progress: number;
}

export interface TaskUpdateInput {
  title?: string;
  description?: string;
  priority?: number;
  flowOptimal?: boolean;
  contextCost?: number;
  estimatedDuration?: number;
  completed?: boolean;
  teamId?: string;
  projectId?: string;
  dueDate?: string;
  status?: TaskStatus;
  completionMetrics?: Partial<CompletionMetrics>;
}

interface TaskContext {
  previousTaskId?: string;
  currentFlowState: FlowState;
  activeTaskTime: number;
  taskSwitches: number;
}

export class TaskFlowService {
  private static readonly CONTEXT_SWITCH_THRESHOLD = 0.3; // 30% flow score impact
  private static readonly FLOW_OPTIMAL_BONUS = 20;
  private static readonly TASK_SWITCH_PENALTY = 15;

  /**
   * Calculate task priority based on flow state and context
   */
  static calculateTaskPriority(task: Task, context: TaskContext): number {
    let priority = task.priority;

    // Adjust priority based on flow state
    if (context.currentFlowState.status === 'peak') {
      priority += this.FLOW_OPTIMAL_BONUS;
    } else if (context.currentFlowState.status === 'rest') {
      priority -= 10;
    }

    // Apply context switching penalty
    if (context.previousTaskId && task.contextCost > this.CONTEXT_SWITCH_THRESHOLD) {
      priority -= this.TASK_SWITCH_PENALTY * task.contextCost;
    }

    // Consider task duration vs current flow state
    const flowTimeRemaining = Math.max(90 - context.activeTaskTime, 0);
    if (task.estimatedDuration > flowTimeRemaining) {
      priority -= 15;
    }

    return Math.max(0, Math.min(100, priority));
  }

  /**
   * Get optimal tasks for current flow state
   */
  static async createTask(input: CreateTaskInput): Promise<Task> {
    const taskData = {
      ...DEFAULT_TASK_VALUES,
      ...input,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('tasks')
      .insert(taskData)
      .single();

    if (error) throw error;
    return data;
  }

  static async getOptimalTasks(userId: string, flowState: FlowState): Promise<Task[]> {
    const { data: tasks, error } = await supabase
      .from('tasks')
      .select(`
        *,
        dependencies: task_dependencies (
          id,
          depends_on_id
        )
      `)
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('priority', { ascending: false });

    if (error) throw error;

    const context: TaskContext = {
      currentFlowState: flowState,
      activeTaskTime: flowState.activeTime,
      taskSwitches: 0
    };

    return tasks
      .map(task => ({
        ...task,
        priority: this.calculateTaskPriority(task as Task, context)
      }))
      .sort((a, b) => b.priority - a.priority);
  }

  /**
   * Update task flow optimality based on completion metrics
   */
  static async updateTaskFlowMetrics(
    taskId: string,
    update: Partial<TaskMetrics>
  ): Promise<void> {
    const { data: task } = await supabase
      .from('tasks')
      .select('completion_metrics, estimated_duration')
      .eq('id', taskId)
      .single();
    
    if (!task) {
      throw new Error('Task not found');
    }

    const flowOptimal = (update.flowScore ?? 0) >= 70 && 
      (update.completionTime ?? 0) <= task.estimated_duration;
    
    await supabase
      .from('tasks')
      .update({
        flow_optimal: flowOptimal,
        completion_metrics: {
          ...(task?.completion_metrics || {}),
          ...update,
          lastUpdate: new Date().toISOString()
        }
      })
      .eq('id', taskId);
  }

  static async updateTask(
    taskId: string,
    update: TaskUpdateInput
  ): Promise<void> {
    const { completionMetrics, ...taskUpdate } = update;
    
    if (completionMetrics) {
      await this.updateTaskFlowMetrics(taskId, completionMetrics);
    }
    
    if (Object.keys(taskUpdate).length > 0) {
      await supabase
        .from('tasks')
        .update(taskUpdate)
        .eq('id', taskId);
    }
  }

  /**
   * Calculate context switch impact between tasks
   */
  static calculateContextSwitch(
    currentTaskId: string,
    nextTaskId: string,
    flowState: FlowState
  ): number {
    // Return value between 0-1 representing context switch cost
    return Math.min(
      1,
      Math.max(
        0,
        (flowState.score / 100) * // Higher flow score = higher switch cost
        (flowState.activeTime / 90) // Longer active time = higher switch cost
      )
    );
  }

  /**
   * Suggest optimal break timing based on flow state
   */
  static suggestBreak(flowState: FlowState): boolean {
    const needsBreak = 
      flowState.activeTime > 90 || // Over recommended max time
      flowState.score < 40 || // Low flow score
      flowState.status === 'rest'; // Already in rest state
    
    return needsBreak;
  }

  /**
   * Get task completion probability based on current state
   */
  static predictTaskSuccess(task: Task, flowState: FlowState): number {
    const baseScore = flowState.score / 100;
    const timeFactor = Math.min(1, (90 - flowState.activeTime) / task.estimatedDuration);
    const contextPenalty = task.contextCost * this.CONTEXT_SWITCH_THRESHOLD;

    return Math.max(0, Math.min(1, 
      baseScore * timeFactor * (1 - contextPenalty)
    ));
  }
}

import { FlowState } from '@/types/flow';
import { supabase } from '@/lib/supabaseClient';
import { Task } from '@/types/taskFlow'; // Import Task from src/types/taskFlow.ts

const CONTEXT_SWITCH_THRESHOLD = 0.5; // Define the constant here

export type TaskStatus = 'active' | 'completed' | 'archived' | 'todo' | 'in_progress';

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
  status: 'todo',
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

/**
 * Calculate context switch impact between tasks
 */
export function calculateContextSwitch( // ADDED export
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
export function suggestBreak( // ADDED export
  flowState: FlowState): boolean {
  const needsBreak =
    flowState.activeTime > 90 || // Over recommended max time
    flowState.score < 40 || // Low flow score
    flowState.status === 'rest'; // Already in rest state

  return needsBreak;
}

/**
 * Get task completion probability based on current state
 */
export function predictTaskSuccess( // ADDED export
  task: Task,
  flowState: FlowState): number {
  const baseScore = flowState.score / 100;
  const timeFactor = Math.min(1, (90 - flowState.activeTime) / task.estimatedDuration);
  // Handle optional contextCost and default to 0 if undefined
  const contextPenalty = (task.contextCost || 0) * CONTEXT_SWITCH_THRESHOLD; // Use the constant here

  return Math.max(0, Math.min(1,
    baseScore * timeFactor * (1 - contextPenalty)
  ));
}

/**
 * Delete a task by ID
 */
export async function deleteTask(taskId: string): Promise<void> {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId);

  if (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
}

/**
 * Get a task by ID
 */
async function getTaskById(taskId: string): Promise<Task | null> {
  const { data: task, error } = await supabase
    .from('tasks')
    .select(`
      *,
      dependencies: task_dependencies (
        id,
        depends_on_id
      )
    `)
    .eq('id', taskId)
    .single();

  if (error) {
    console.error('Error getting task:', error);
    throw error;
  }

    return task as Task | null;
  }

export async function updateTaskFlowMetrics(
  taskId: string,
  update: TaskMetrics
): Promise<void> {
    const task = await getTaskById(taskId);

    if (!task) {
      console.error(`Task with id ${taskId} not found`);
      return; // Or throw an error: throw new Error(`Task with id ${taskId} not found`);
    }

    const flowOptimal = (update.flowScore ?? 0) >= 70 &&
      (update.completionTime ?? 0) <= task.estimated_duration;

    await supabase
      .from('tasks')
      .update({
        flow_optimal: flowOptimal,
        completionMetrics: { // Correct typo here
          ...(task?.completionMetrics || {}), // Correct typo here
          ...update,
          lastUpdate: new Date().toISOString()
        }
      })
      .eq('id', taskId);
  }

export async function updateTask(
    taskId: string,
    update: any // TaskUpdateInput
  ): Promise<void> {
    const { completionMetrics, ...taskUpdate } = update;

    if (completionMetrics) {
      await updateTaskFlowMetrics(taskId, completionMetrics);
    }

    if (Object.keys(taskUpdate).length > 0) {
      await supabase
        .from('tasks')
        .update(taskUpdate)
        .eq('id', taskId);
    }
  }

/**
 * Create a new task
 */
export async function createTask(taskInput: CreateTaskInput): Promise<Task | null> {
  const { data: task, error } = await supabase
    .from('tasks')
    .insert([taskInput])
    .select()
    .single();

  if (error) {
    console.error('Error creating task:', error);
    throw error;
  }

  return task as Task | null;
}

export async function getOptimalTasks(userId: string, flowState: FlowState): Promise<Task[]> { // ADDED export
  try {
    const { data: tasks, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }

    return tasks || [];
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
}

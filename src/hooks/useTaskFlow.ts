import { useState, useEffect, useCallback } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { TaskFlowManager } from "../features/taskFlow/TaskFlowManager";
import { Task, TeamMemberStatus } from "../types/database";
import { TaskPriorityScore, TaskAssignmentMatch } from "../types/taskFlow";

interface TaskFlowError extends Error {
  code: string; // Should be union type of specific error codes
  details?: unknown; // Should be more specific type
}

interface UseTaskFlowResult {
  loading: boolean;
  error: TaskFlowError | null;
  pendingTasks: Task[];
  flowOptimizedTasks: Task[];
  calculateTaskPriority: (
    task: Task,
    userFlowState: TeamMemberStatus
  ) => Promise<TaskPriorityScore>;
  planWorkSession: (
    duration: number,
    userFlowState: TeamMemberStatus
  ) => Promise<Task[]>;
  suggestTaskAssignments: (
    tasks: Task[],
    teamMembers: TeamMemberStatus[]
  ) => Promise<TaskAssignmentMatch[]>;
  updateTaskProgress: (taskId: string, progress: number) => Promise<void>;
  refreshTasks: () => Promise<void>;
}

export function useTaskFlow(userId: string, teamId: string) {
  const [taskState, setTaskState] = useState<TaskFlowState>({
    currentTask: null,
    suggestedTasks: [],
    flowOptimal: false,
    routingFactors: null,
  });

  const { flowState } = useFlowState();
  const taskRouter = useMemo(() => new TaskRouter(flowState), [flowState]);
  const taskManager = useMemo(() => new TaskFlowManager(userId), [userId]);

  const updateTaskRouting = useCallback(async () => {
    const tasks = await fetchUserTasks(userId, teamId);
    const routingResult = taskRouter.routeTasks(
      tasks,
      taskState.currentTask?.id
    );

    setTaskState((prev) => ({
      ...prev,
      suggestedTasks: routingResult.suggestedTasks,
      routingFactors: routingResult.routingFactors,
      flowOptimal: isFlowOptimal(routingResult, flowState),
    }));
  }, [userId, teamId, taskRouter, flowState, taskState.currentTask]);

  const startTask = useCallback(
    async (taskId: string) => {
      const task = await TaskService.startTask(taskId);
      setTaskState((prev) => ({ ...prev, currentTask: task }));
      await updateTaskRouting();
    },
    [updateTaskRouting]
  );

  const completeTask = useCallback(
    async (taskId: string) => {
      await TaskService.completeTask(taskId);
      setTaskState((prev) => ({ ...prev, currentTask: null }));
      await updateTaskRouting();
    },
    [updateTaskRouting]
  );

  useEffect(() => {
    updateTaskRouting();
  }, [flowState.status, updateTaskRouting]);

  return {
    taskState,
    startTask,
    completeTask,
    updateTaskRouting,
  };
}

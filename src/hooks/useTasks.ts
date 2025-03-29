import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Task } from "../types/database";
import { handleSupabaseError } from "../utils/errorHandling";
import { useLoadingState } from "./useLoadingState";
import { TaskSearchFilters } from "../components/tasks/TaskSearch";
import { AppError } from "../types/error";

interface TaskError extends AppError {
  code: "TASK_CREATE_ERROR" | "TASK_UPDATE_ERROR" | "TASK_DELETE_ERROR";
  details?: unknown;
}

export const useTasks = () => {
  const supabase = useSupabaseClient();
  const { setError, startLoading, stopLoading } = useLoadingState();

  const getTasks = async (
    projectId: string,
    filters?: TaskSearchFilters
  ): Promise<Task[]> => {
    startLoading();
    try {
      let query = supabase
        .from("tasks")
        .select(
          `
          *,
          progress_updates (
            id,
            progress,
            note,
            created_at,
            user:users (id, full_name, email, avatar_url)
          )
        `
        )
        .eq("project_id", projectId);

      if (filters) {
        // Apply text search
        if (filters.query) {
          query = query.or(
            `title.ilike.%${filters.query}%,description.ilike.%${filters.query}%`
          );
        }

        // Apply status filter
        if (filters.status) {
          query = query.eq("status", filters.status);
        }

        // Apply priority filter
        if (filters.priority) {
          query = query.eq("priority", filters.priority);
        }

        // Apply date range filter
        if (filters.dateRange) {
          if (filters.dateRange.start) {
            query = query.gte("due_date", filters.dateRange.start);
          }
          if (filters.dateRange.end) {
            query = query.lte("due_date", filters.dateRange.end);
          }
        }

        // Apply progress range filter
        if (filters.progressRange) {
          if (filters.progressRange.min > 0) {
            query = query.gte("progress", filters.progressRange.min);
          }
          if (filters.progressRange.max < 100) {
            query = query.lte("progress", filters.progressRange.max);
          }
        }

        // Apply assignee filter
        if (filters.assignee) {
          query = query.eq("assignee_id", filters.assignee);
        }
      }

      const { data, error } = await query.order("created_at", {
        ascending: false,
      });

      if (error) {
        setError({
          code: "TASKS_LOAD_FAILED",
          message: "Failed to load tasks",
          details: handleSupabaseError(error),
        });
        return [];
      }

      return data as Task[];
    } catch (error) {
      setError({
        code: "TASKS_LOAD_ERROR",
        message: "Error loading tasks",
        details: error,
      });
      return [];
    } finally {
      stopLoading();
    }
  };

  const createTask = async (
    task: Omit<Task, "id" | "created_at" | "updated_at">
  ) => {
    try {
      const { data, error } = await supabase
        .from("tasks")
        .insert(task)
        .select()
        .single();

      if (error) throw handleSupabaseError(error);
      return data as Task;
    } catch (error: unknown) {
      const taskError: TaskError = {
        code: "TASK_CREATE_ERROR",
        message: "Failed to create task",
        details: error,
      };
      setError(taskError);
      throw taskError;
    }
  };

  const updateTask = async (
    taskId: string,
    updates: Partial<Omit<Task, "id" | "created_at" | "updated_at">>
  ) => {
    try {
      const { data, error } = await supabase
        .from("tasks")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", taskId)
        .select()
        .single();

      if (error) throw handleSupabaseError(error);
      return data as Task;
    } catch (error) {
      setError({
        code: "TASK_UPDATE_ERROR",
        message: "Failed to update task",
        details: error,
      });
      throw error;
    }
  };

  const updateTaskStatus = async (taskId: string, status: Task["status"]) => {
    return updateTask(taskId, { status });
  };

  const deleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase.from("tasks").delete().eq("id", taskId);

      if (error) throw handleSupabaseError(error);
    } catch (error) {
      setError({
        code: "TASK_DELETE_ERROR",
        message: "Failed to delete task",
        details: error,
      });
      throw error;
    }
  };

  const getTaskProgress = async (taskId: string) => {
    try {
      const { data, error } = await supabase
        .from("progress_updates")
        .select(
          `
          *,
          user:users (id, full_name, email, avatar_url)
        `
        )
        .eq("task_id", taskId)
        .order("created_at", { ascending: false });

      if (error) throw handleSupabaseError(error);
      return data;
    } catch (error) {
      setError({
        code: "PROGRESS_FETCH_ERROR",
        message: "Failed to fetch task progress",
        details: error,
      });
      throw error;
    }
  };

  return {
    getTasks,
    createTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
    getTaskProgress,
  };
};

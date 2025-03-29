"use client";

import React, { createContext, useState, useContext } from "react";
import { Task } from "../types/database";
import { TaskRoutingResult } from "../features/taskFlow/types";
import { AppError } from "../types/error";

interface TaskRoutingContextType {
  currentSequence: Task[];
  routingResult: TaskRoutingResult | null;
  isRouting: boolean;
  error: AppError | null;
  startNextTask: (taskId?: string) => Promise<void>;
  routeTasks: (tasks: Task[]) => Promise<void>;
  setError: (error: AppError | null) => void;
}

const TaskRoutingContext = createContext<TaskRoutingContextType | null>(null);

interface TaskRoutingProviderProps {
  children: React.ReactNode;
  initialTasks?: Task[];
  // Add these props for testing
  mockStartNextTask?: jest.Mock;
  mockRouteTasks?: jest.Mock;
  mockIsRouting?: boolean;
  mockRoutingResult?: TaskRoutingResult;
  mockError?: AppError | null;
}

export const TaskRoutingProvider: React.FC<TaskRoutingProviderProps> = ({
  children,
  initialTasks = [],
  // Use these mock values in tests
  mockStartNextTask,
  mockRouteTasks,
  mockIsRouting = false,
  mockRoutingResult = null,
  mockError = null,
}) => {
  // For testing, use the mock values if provided
  const [currentSequence, setCurrentSequence] = useState<Task[]>(initialTasks);
  const [routingResult, setRoutingResult] = useState<TaskRoutingResult | null>(
    mockRoutingResult
  );
  const [isRouting, setIsRouting] = useState<boolean>(mockIsRouting);
  const [error, setError] = useState<AppError | null>(mockError);

  // Reset error when routing tasks
  const resetError = () => {
    if (error) setError(null);
  };

  // Use mock functions in tests if provided
  const startNextTask =
    mockStartNextTask ||
    (async (taskId?: string) => {
      try {
        setIsRouting(true);
        resetError();

        // If a specific task ID is provided, find that task
        const targetTask = taskId
          ? currentSequence.find((task) => task.id === taskId)
          : currentSequence[0];

        if (!targetTask) {
          throw new Error("Task not found");
        }

        // In a real implementation, you would update the task status in your database
        // and potentially fetch the next task in the sequence

        // For now, we'll just simulate a successful task start
        // In a real app, you might want to update the current sequence here

        setIsRouting(false);
      } catch (err) {
        setIsRouting(false);
        setError({
          code: "TASK_START_ERROR",
          message: "Failed to start task",
          details: err instanceof Error ? err : new Error(String(err)),
        });
      }
    });

  const routeTasks =
    mockRouteTasks ||
    (async (tasks: Task[]) => {
      try {
        setIsRouting(true);
        resetError();

        // In a real implementation, you would call your task routing algorithm here
        // and update the routing result based on the current flow state

        // For now, we'll just update the current sequence with the provided tasks
        setCurrentSequence(tasks);

        // Simulate a routing result based on the tasks
        // In a real app, this would come from your routing algorithm
        const mockResult: TaskRoutingResult = {
          suggestedSequence: tasks,
          routingFactors: {
            flowAlignment: 0.85,
            timingOptimality: 0.9,
            workloadBalance: 0.8,
            contextContinuity: 0.75,
            taskScores: tasks.reduce(
              (acc, task, index) => {
                acc[task.id] = 0.9 - index * 0.1;
                return acc;
              },
              {} as Record<string, number>
            ),
          },
          recommendations: ["Focus on the first task in the sequence"],
          metadata: {
            routingTimestamp: new Date().toISOString(),
            flowScore: 85,
            sequenceScore: 0.85,
          },
        };

        setRoutingResult(mockResult);
        setIsRouting(false);
      } catch (err) {
        setIsRouting(false);
        setError({
          code: "TASK_ROUTING_ERROR",
          message: "Failed to route tasks",
          details: err instanceof Error ? err : new Error(String(err)),
        });
      }
    });

  return (
    <TaskRoutingContext.Provider
      value={{
        currentSequence,
        routingResult,
        isRouting,
        error,
        startNextTask,
        routeTasks,
        setError,
      }}
    >
      {children}
    </TaskRoutingContext.Provider>
  );
};

export function useTaskRouting() {
  const context = useContext(TaskRoutingContext);
  if (!context) {
    throw new Error("useTaskRouting must be used within a TaskRoutingProvider");
  }
  return context;
}

import React from "react";
import { screen, fireEvent, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { jest, describe, beforeEach, test, expect } from "@jest/globals";
import { TaskFlow } from "../index";
import type { Task } from "../../../../types/database";
import type { TaskRoutingResult } from "../../../../features/taskFlow/types";
import type { FlowState } from "../../../../types/flow";
import { renderWithProviders } from "../../../../__tests__/test-utils";

// Create mock functions
const mockStartNextTask = jest.fn();
const mockRouteTasks = jest.fn();

// Mock data
const mockFlowState: FlowState = {
  userId: "test-user",
  score: 85,
  intensity: 85,
  status: "flow",
  activeTime: 1800,
  lastUpdated: new Date().toISOString(),
};

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Test Task 1",
    description: "Description 1",
    status: "pending",
    priority: "high",
    due_date: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: "user-1",
    project_id: "project-1",
    assignee_id: "user-1",
    dependencies: [],
    progress: 0,
    estimated_time: 3600,
    actual_time: 0,
    complexity_score: 75,
    tags: ["test"],
  },
  {
    id: "2",
    title: "Test Task 2",
    description: "Description 2",
    status: "pending",
    priority: "medium",
    due_date: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: "user-1",
    project_id: "project-1",
    assignee_id: "user-1",
    dependencies: [],
    progress: 0,
    estimated_time: 7200,
    actual_time: 0,
    complexity_score: 60,
    tags: ["test"],
  },
];

const mockRoutingResult: TaskRoutingResult = {
  suggestedSequence: mockTasks,
  routingFactors: {
    flowAlignment: 0.85,
    timingOptimality: 0.9,
    workloadBalance: 0.8,
    contextContinuity: 0.75,
    taskScores: {
      "1": 0.9,
      "2": 0.8,
    },
  },
  recommendations: ["Focus on Task 1 first"],
  metadata: {
    routingTimestamp: new Date().toISOString(),
    flowScore: 85,
    sequenceScore: 0.85,
  },
};

describe("TaskFlow", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock error handling to prevent test failures
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  test("renders task list correctly", () => {
    renderWithProviders(<TaskFlow />, {
      taskRoutingProps: {
        initialTasks: mockTasks,
        mockRoutingResult: mockRoutingResult,
        mockStartNextTask: mockStartNextTask,
      },
      flowContextProps: {
        initialFlowState: mockFlowState,
      },
    });

    expect(screen.getByText("Test Task 1")).toBeInTheDocument();
    expect(screen.getByText("Test Task 2")).toBeInTheDocument();
    expect(screen.getByText("Description 1")).toBeInTheDocument();
  });

  test("shows loading state when routing", () => {
    renderWithProviders(<TaskFlow />, {
      taskRoutingProps: {
        initialTasks: mockTasks,
        mockRoutingResult: mockRoutingResult,
        mockStartNextTask: mockStartNextTask,
        mockIsRouting: true,
      },
      flowContextProps: {
        initialFlowState: mockFlowState,
      },
    });

    expect(screen.getByText("Optimizing task sequence...")).toBeInTheDocument();
  });

  test("shows empty state when no tasks", () => {
    renderWithProviders(<TaskFlow />, {
      taskRoutingProps: {
        initialTasks: [],
        mockRoutingResult: mockRoutingResult,
        mockStartNextTask: mockStartNextTask,
        mockIsRouting: false,
      },
      flowContextProps: {
        initialFlowState: mockFlowState,
      },
    });

    expect(screen.getByText("No Tasks Available")).toBeInTheDocument();
  });

  test("calls startNextTask when clicking a task", () => {
    renderWithProviders(<TaskFlow />, {
      taskRoutingProps: {
        initialTasks: mockTasks,
        mockRoutingResult: mockRoutingResult,
        mockStartNextTask: mockStartNextTask,
        mockIsRouting: false,
      },
      flowContextProps: {
        initialFlowState: mockFlowState,
      },
    });

    fireEvent.click(screen.getByText("Test Task 1"));
    expect(mockStartNextTask).toHaveBeenCalled();
  });

  test("displays flow metrics correctly", () => {
    renderWithProviders(<TaskFlow />, {
      taskRoutingProps: {
        initialTasks: mockTasks,
        mockRoutingResult: mockRoutingResult,
        mockStartNextTask: mockStartNextTask,
        mockIsRouting: false,
      },
      flowContextProps: {
        initialFlowState: mockFlowState,
      },
    });

    const flowInfo = screen
      .getByText("Current Flow Score")
      .closest(".flowInfo");
    expect(flowInfo).toBeInTheDocument();

    // Use within to scope the queries to the flowInfo element
    if (flowInfo) {
      const flowScoreMetric = within(flowInfo)
        .getByText("Current Flow Score")
        .closest(".flowMetric");
      const taskAlignmentMetric = within(flowInfo)
        .getByText("Task Alignment")
        .closest(".flowMetric");

      expect(flowScoreMetric).toBeInTheDocument();
      expect(taskAlignmentMetric).toBeInTheDocument();

      // Check that each metric contains the expected percentage
      expect(within(flowScoreMetric!).getByText(/85%/)).toBeInTheDocument();
      expect(within(taskAlignmentMetric!).getByText(/85%/)).toBeInTheDocument();
    }
  });

  test("calculates and displays decreasing flow scores for tasks in sequence", () => {
    renderWithProviders(<TaskFlow />, {
      taskRoutingProps: {
        initialTasks: mockTasks,
        mockRoutingResult: mockRoutingResult,
        mockStartNextTask: mockStartNextTask,
        mockIsRouting: false,
      },
      flowContextProps: {
        initialFlowState: mockFlowState,
      },
    });

    const tasks = screen.getAllByTestId(/task-item/);
    const firstTaskScore = parseFloat(
      tasks[0]
        .querySelector('[title^="Flow alignment"]')
        ?.getAttribute("title")
        ?.match(/\d+/)?.[0] || "0"
    );
    const secondTaskScore = parseFloat(
      tasks[1]
        .querySelector('[title^="Flow alignment"]')
        ?.getAttribute("title")
        ?.match(/\d+/)?.[0] || "0"
    );

    expect(firstTaskScore).toBeGreaterThan(secondTaskScore);
  });
});

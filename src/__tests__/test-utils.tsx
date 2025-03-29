import React, { ReactNode } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { TaskRoutingProvider } from "../context/TaskRoutingContext";
import { FlowContextProvider } from "../context/FlowContext";
import type { Task } from "../types/database";
import type { TaskRoutingResult } from "../features/taskFlow/types";
import type { FlowState } from "../types/flow";
import type { AppError } from "../types/error";

interface TestProviderProps {
  children: ReactNode;
  taskRoutingProps?: {
    initialTasks?: Task[];
    mockStartNextTask?: jest.Mock;
    mockRouteTasks?: jest.Mock;
    mockIsRouting?: boolean;
    mockRoutingResult?: TaskRoutingResult | null;
    mockError?: AppError | null;
  };
  flowContextProps?: {
    initialFlowState?: Partial<FlowState>;
  };
}

// A wrapper component that provides both contexts for testing
export const TestProviders: React.FC<TestProviderProps> = ({
  children,
  taskRoutingProps = {},
  flowContextProps = {},
}) => {
  return (
    <FlowContextProvider initialFlowState={flowContextProps.initialFlowState}>
      <TaskRoutingProvider
        initialTasks={taskRoutingProps.initialTasks || []}
        mockStartNextTask={taskRoutingProps.mockStartNextTask}
        mockRouteTasks={taskRoutingProps.mockRouteTasks}
        mockIsRouting={taskRoutingProps.mockIsRouting}
        mockRoutingResult={taskRoutingProps.mockRoutingResult}
        mockError={taskRoutingProps.mockError}
      >
        {children}
      </TaskRoutingProvider>
    </FlowContextProvider>
  );
};

// Custom render function that wraps the component with test providers
interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  taskRoutingProps?: TestProviderProps["taskRoutingProps"];
  flowContextProps?: TestProviderProps["flowContextProps"];
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    taskRoutingProps = {},
    flowContextProps = {},
    ...renderOptions
  }: CustomRenderOptions = {}
) {
  return render(ui, {
    wrapper: ({ children }) => (
      <TestProviders
        taskRoutingProps={taskRoutingProps}
        flowContextProps={flowContextProps}
      >
        {children}
      </TestProviders>
    ),
    ...renderOptions,
  });
}

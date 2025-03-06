import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import FlowManager from '../flow-manager';
import { useTaskRouting } from '../../../context/TaskRoutingContext';
import { useFlowContext } from '../../../context/FlowContext';
import type { Task } from '../../../types/database';
import type { FlowState } from '../../../types/flow';
import type { AppError } from '../../../types/error';

// Mock the hooks
jest.mock('../../../context/TaskRoutingContext');
jest.mock('../../../context/FlowContext');

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Test Task 1',
    description: 'Description 1',
    status: 'pending',
    priority: 'high',
    due_date: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: 'user-1',
    project_id: 'project-1',
    assignee_id: 'user-1',
    dependencies: [],
    progress: 0,
    estimated_time: 3600,
    actual_time: 0,
    complexity_score: 75,
    tags: ['test']
  }
];

const mockFlowState: FlowState = {
  score: 85,
  intensity: 85,
  status: 'flowing',
  focus_duration: 1800,
  interruption_count: 0,
  session_start: new Date().toISOString()
};

const mockRoutingResult = {
  suggestedSequence: mockTasks,
  routingFactors: {
    flowAlignment: 0.85,
    timingOptimality: 0.9,
    workloadBalance: 0.8,
    contextContinuity: 0.75,
    taskScores: {
      '1': 0.9
    }
  },
  recommendations: ['Focus on Task 1 first'],
  metadata: {
    routingTimestamp: new Date().toISOString(),
    flowScore: 85,
    sequenceScore: 0.85
  }
};

describe('FlowManager', () => {
  const mockStartNextTask = jest.fn();
  const mockRouteTasks = jest.fn();
  const mockSetError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useTaskRouting as jest.Mock).mockReturnValue({
      currentSequence: mockTasks,
      routingResult: mockRoutingResult,
      isRouting: false,
      error: null,
      startNextTask: mockStartNextTask,
      routeTasks: mockRouteTasks,
      setError: mockSetError
    });

    (useFlowContext as jest.Mock).mockReturnValue({
      flowState: mockFlowState
    });
  });

  it('renders the component with flow stats', () => {
    render(<FlowManager />);
    
    expect(screen.getByText('Flow-Optimized Tasks')).toBeInTheDocument();
    expect(screen.getByText('Current Flow Score')).toBeInTheDocument();
    expect(screen.getByText('85%')).toBeInTheDocument();
  });

  it('shows loading state when routing', () => {
    (useTaskRouting as jest.Mock).mockReturnValue({
      currentSequence: mockTasks,
      routingResult: mockRoutingResult,
      isRouting: true,
      error: null,
      startNextTask: mockStartNextTask,
      routeTasks: mockRouteTasks,
      setError: mockSetError
    });

    render(<FlowManager />);
    
    expect(screen.getByText('Optimizing your flow state...')).toBeInTheDocument();
  });

  it('shows error state when there is an error', () => {
    const testError: AppError = {
      code: 'TEST_ERROR',
      message: 'Test error message',
      details: new Error('Test error details')
    };

    (useTaskRouting as jest.Mock).mockReturnValue({
      currentSequence: mockTasks,
      routingResult: mockRoutingResult,
      isRouting: false,
      error: testError,
      startNextTask: mockStartNextTask,
      routeTasks: mockRouteTasks,
      setError: mockSetError
    });

    render(<FlowManager />);
    
    expect(screen.getByText('Test error message')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Retry'));
    expect(mockSetError).toHaveBeenCalledWith(null);
    expect(mockRouteTasks).toHaveBeenCalledWith(mockTasks);
  });

  it('handles starting next task', () => {
    render(<FlowManager />);
    
    fireEvent.click(screen.getByText('Start Next Task'));
    expect(mockStartNextTask).toHaveBeenCalled();
  });

  it('re-routes tasks when flow state changes significantly', async () => {
    const { rerender } = render(<FlowManager />);

    // Update flow state to trigger re-routing
    (useFlowContext as jest.Mock).mockReturnValue({
      flowState: { 
        ...mockFlowState, 
        score: 50 // Big change in score
      }
    });

    rerender(<FlowManager />);
    
    await waitFor(() => {
      expect(mockRouteTasks).toHaveBeenCalledWith(mockTasks);
    });
  });
});
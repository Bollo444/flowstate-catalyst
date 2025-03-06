import React, { createContext, useContext, useState, useCallback } from 'react';
import { Task } from '../types/database';

interface TaskSelectionContextType {
  selectedTasks: Set<string>;
  isSelected: (taskId: string) => boolean;
  toggleTask: (taskId: string) => void;
  selectAll: (taskIds: string[]) => void;
  clearSelection: () => void;
  selectedCount: number;
  hasSelection: boolean;
}

const TaskSelectionContext = createContext<TaskSelectionContextType | undefined>(undefined);

export const TaskSelectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());

  const isSelected = useCallback((taskId: string) => {
    return selectedTasks.has(taskId);
  }, [selectedTasks]);

  const toggleTask = useCallback((taskId: string) => {
    setSelectedTasks(prev => {
      const next = new Set(prev);
      if (next.has(taskId)) {
        next.delete(taskId);
      } else {
        next.add(taskId);
      }
      return next;
    });
  }, []);

  const selectAll = useCallback((taskIds: string[]) => {
    setSelectedTasks(new Set(taskIds));
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedTasks(new Set());
  }, []);

  const value = {
    selectedTasks,
    isSelected,
    toggleTask,
    selectAll,
    clearSelection,
    selectedCount: selectedTasks.size,
    hasSelection: selectedTasks.size > 0,
  };

  return (
    <TaskSelectionContext.Provider value={value}>
      {children}
    </TaskSelectionContext.Provider>
  );
};

export const useTaskSelection = () => {
  const context = useContext(TaskSelectionContext);
  if (context === undefined) {
    throw new Error('useTaskSelection must be used within a TaskSelectionProvider');
  }
  return context;
};
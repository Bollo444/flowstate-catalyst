import { useContext } from 'react';
import { FlowContext } from '../context/FlowContext';

export function useFlowState() {
  const context = useContext(FlowContext);
  if (!context) {
    throw new Error('useFlowState must be used within a FlowProvider');
  }
  return context;
}
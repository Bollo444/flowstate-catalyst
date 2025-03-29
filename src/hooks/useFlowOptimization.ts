export function useFlowOptimization() {
  const { flowState } = useFlowState();
  const { analytics } = useFlowAnalytics();
  const { tasks } = useFlowTasks();
  const optimizer = useMemo(() => new FlowOptimizer(), []);

  const [schedule, setSchedule] = useState<OptimizedSchedule>({
    blocks: [],
    predictions: {},
    suggestions: [],
  });

  const optimizeSchedule = useCallback(() => {
    const optimizedBlocks = optimizer.generateBlocks({
      flowState,
      tasks,
      analytics,
    });

    const predictions = optimizer.predictOutcomes(optimizedBlocks);
    const suggestions = optimizer.generateSuggestions(predictions);

    setSchedule({
      blocks: optimizedBlocks,
      predictions,
      suggestions,
    });
  }, [flowState, tasks, analytics, optimizer]);

  useEffect(() => {
    optimizeSchedule();
  }, [flowState.score, tasks.length, optimizeSchedule]);

  return {
    schedule,
    refreshSchedule: optimizeSchedule,
  };
}

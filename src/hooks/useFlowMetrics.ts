export function useFlowMetrics(userId: string, timeRange: TimeRange = "day") {
  const [metrics, setMetrics] = useState<FlowMetricsData>({
    flowScores: [],
    productivity: 0,
    focusTime: 0,
    interruptions: [],
    trends: null,
  });

  const [isLoading, setIsLoading] = useState(true);
  const calculator = useMemo(() => new FlowCalculator(), []);

  const fetchMetrics = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await FlowMetricsService.getUserMetrics(userId, timeRange);
      const trends = calculator.analyzeTrends(data);

      setMetrics({
        flowScores: data.flowScores,
        productivity: calculateProductivity(data),
        focusTime: data.totalFocusTime,
        interruptions: data.interruptions,
        trends,
      });
    } finally {
      setIsLoading(false);
    }
  }, [userId, timeRange, calculator]);

  useEffect(() => {
    fetchMetrics();

    const subscription = FlowMetricsService.subscribeToUpdates(userId, () => {
      fetchMetrics();
    });

    return () => subscription.unsubscribe();
  }, [userId, timeRange, fetchMetrics]);

  return {
    metrics,
    isLoading,
    refreshMetrics: fetchMetrics,
  };
}

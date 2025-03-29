export function useFlowSession() {
  const [session, setSession] = useState<FlowSession | null>(null);
  const [transitions, setTransitions] = useState<FlowTransition[]>([]);
  const { flowState } = useFlowState();
  const { analytics } = useFlowAnalytics(session?.userId || "");

  const startSession = useCallback(
    async (config: FlowSessionConfig) => {
      const newSession = await FlowSessionService.create({
        ...config,
        startTime: new Date(),
        initialState: flowState,
      });

      setSession(newSession);
      setTransitions([
        {
          from: "inactive",
          to: flowState.status,
          timestamp: new Date(),
        },
      ]);

      return newSession;
    },
    [flowState]
  );

  const endSession = useCallback(async () => {
    if (!session) return;

    const summary = await FlowSessionService.end(session.id, {
      finalState: flowState,
      transitions,
      analytics,
    });

    setSession(null);
    setTransitions([]);

    return summary;
  }, [session, flowState, transitions, analytics]);

  useEffect(() => {
    if (
      session &&
      flowState.status !== transitions[transitions.length - 1]?.to
    ) {
      setTransitions((prev) => [
        ...prev,
        {
          from: prev[prev.length - 1]?.to || "inactive",
          to: flowState.status,
          timestamp: new Date(),
        },
      ]);
    }
  }, [flowState.status, session]);

  return {
    session,
    transitions,
    startSession,
    endSession,
  };
}

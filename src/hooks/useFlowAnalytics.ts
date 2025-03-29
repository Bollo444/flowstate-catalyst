import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useFlowTasks } from "./useFlowTasks";
import { Task } from "@/services/taskFlow";
import {
  AnalyticsMetrics,
  FlowHistoryEntry,
  TaskHistoryEntry,
  TimeRangeOption,
  TaskCompletionDataPoint,
} from "@/types/analytics";

interface UseFlowAnalyticsProps {
  userId: string;
  teamId?: string;
  timeRange?: TimeRangeOption;
}

export function useFlowAnalytics(userId: string) {
  const [analytics, setAnalytics] = useState<FlowAnalytics>({
    patterns: [],
    insights: [],
    recommendations: [],
    optimizationScore: 0,
  });

  const [timeRange, setTimeRange] = useState<AnalyticsTimeRange>("week");
  const { flowState } = useFlowState();
  const { metrics } = useFlowMetrics(userId, timeRange);

  const analyzeFlowPatterns = useCallback(() => {
    const patterns = FlowAnalyzer.detectPatterns(metrics.flowScores);
    const insights = FlowAnalyzer.generateInsights(patterns, flowState);
    const recommendations = FlowAnalyzer.getRecommendations(insights);
    const optimizationScore = FlowAnalyzer.calculateOptimizationScore(patterns);

    setAnalytics({
      patterns,
      insights,
      recommendations,
      optimizationScore,
    });
  }, [metrics, flowState]);

  useEffect(() => {
    analyzeFlowPatterns();
  }, [metrics, analyzeFlowPatterns]);

  return {
    analytics,
    timeRange,
    setTimeRange,
    refreshAnalytics: analyzeFlowPatterns,
  };
}

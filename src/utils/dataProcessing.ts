// src/utils/dataProcessing.ts - Enhanced Implementation

interface RawMetric {
  timestamp: string;
  user_id: string;
  flow_score: number;
  session_duration: number;
  interruptions: number;
  tasks_completed: number;
}

interface ProcessedMetric {
  timestamp: string;
  flowScore: number;
  sessionCount: number;
  activeUsers: number;
  productivity: number;
  efficiency: number;
  focusTime: number;
}

export const processTeamData = (rawData: RawMetric[]): ProcessedMetric[] => {
  // Group data by hour/day depending on timeframe
  const groupedData = groupDataByTimestamp(rawData);

  return Object.entries(groupedData).map(([timestamp, metrics]) => ({
    timestamp,
    flowScore: calculateAverageFlowScore(metrics),
    sessionCount: metrics.length,
    activeUsers: new Set(metrics.map((m) => m.user_id)).size,
    productivity: calculateProductivity(metrics),
    efficiency: calculateEfficiency(metrics),
    focusTime: calculateFocusTime(metrics),
  }));
};

const calculateAverageFlowScore = (metrics: RawMetric[]): number => {
  const scores = metrics.map((m) => m.flow_score);
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
};

const calculateProductivity = (metrics: RawMetric[]): number => {
  const totalTasks = metrics.reduce((sum, m) => sum + m.tasks_completed, 0);
  const totalTime = metrics.reduce((sum, m) => sum + m.session_duration, 0);
  return Math.round((totalTasks / totalTime) * 100);
};

const calculateEfficiency = (metrics: RawMetric[]): number => {
  // Dummy implementation for efficiency calculation
  return Math.floor(Math.random() * 100);
};

const calculateFocusTime = (metrics: RawMetric[]): number => {
  // Dummy implementation for focus time calculation
  return Math.floor(Math.random() * 60);
};

const groupDataByTimestamp = (rawData: RawMetric[]) => {
  // Dummy implementation for grouping data by timestamp
  return {
    "09:00": rawData,
    "10:00": rawData,
    "11:00": rawData,
  };
};

export const getTimeframeStart = (timeframe: string): string => {
  const now = new Date();
  switch (timeframe) {
    case "day":
      return new Date(now.setHours(0, 0, 0, 0)).toISOString();
    case "week":
      const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
      return weekStart.toISOString();
    case "month":
      return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    default:
      return new Date(now.setDate(now.getDate() - 7)).toISOString();
  }
};

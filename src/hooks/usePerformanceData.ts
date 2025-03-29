import { useState, useEffect } from "react";

// Define interfaces for the data structure (adjust as needed)
interface PerformanceInsight {
  id: string;
  title: string;
  value: string | number;
  change?: number; // Optional change indicator (e.g., percentage)
  trend?: "up" | "down" | "stable"; // Optional trend indicator
}

interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
}

interface PerformanceData {
  insights: PerformanceInsight[];
  metrics: PerformanceMetric[];
  // Add other data structures as needed, e.g., for TrendAnalysis
}

// Placeholder function to simulate fetching data
const fetchPerformanceData = async (): Promise<PerformanceData> => {
  console.log("Fetching performance data...");
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Replace with actual data fetching logic (e.g., from /api/analytics/performance)
  const mockData: PerformanceData = {
    insights: [
      {
        id: "pi1",
        title: "Tasks Completed (Last 7d)",
        value: 125,
        change: 15,
        trend: "up",
      },
      {
        id: "pi2",
        title: "Avg. Task Duration",
        value: "2.5 days",
        change: -0.2,
        trend: "down",
      },
      {
        id: "pi3",
        title: "On-Time Completion Rate",
        value: "88%",
        trend: "stable",
      },
    ],
    metrics: [
      { id: "pm1", name: "CPU Usage", value: 45, unit: "%" },
      { id: "pm2", name: "Memory Usage", value: 60, unit: "%" },
      { id: "pm3", name: "API Response Time (avg)", value: 150, unit: "ms" },
      { id: "pm4", name: "Error Rate", value: 1.2, unit: "%" },
    ],
  };
  console.log("Performance data fetched:", mockData);
  return mockData;
};

/**
 * Custom hook to fetch and manage performance analytics data.
 */
export const usePerformanceData = () => {
  const [data, setData] = useState<PerformanceData>({
    insights: [],
    metrics: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedData = await fetchPerformanceData();
        setData(fetchedData);
      } catch (err) {
        console.error("Failed to fetch performance data:", err);
        setError(
          err instanceof Error ? err : new Error("An unknown error occurred")
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []); // Empty dependency array means this runs once on mount

  // Add functions for refreshing data, etc., if needed

  return { ...data, loading, error };
};

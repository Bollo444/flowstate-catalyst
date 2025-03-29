// src/utils/chartUtils.ts

export const chartConfigs = {
  flowScore: {
    color: "#2E3192",
    label: "Flow Score",
    formatter: (value: number) => `${value}%`,
  },
  sessionCount: {
    color: "#1BFFFF",
    label: "Sessions",
    formatter: (value: number) => value.toString(),
  },
  activeUsers: {
    color: "#10B981",
    label: "Active Users",
    formatter: (value: number) => value.toString(),
  },
  productivity: {
    color: "#7C3AED",
    label: "Productivity",
    formatter: (value: number) => `${value}%`,
  },
};

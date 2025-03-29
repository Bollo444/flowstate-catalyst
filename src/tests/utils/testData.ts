export const generateTestData = (count: number) => {
  const now = new Date();
  const data = [];

  for (let i = 0; i < count; i++) {
    data.push({
      id: `test-${i}`,
      timestamp: new Date(now.getTime() - i * 60000),
      flowScore: Math.random() * 100,
      activeUsers: Math.floor(Math.random() * 50),
      sessionCount: Math.floor(Math.random() * 20),
    });
  }

  return data;
};

export const generateMetric = () => {
  return {
    timestamp: new Date().toISOString(),
    flowScore: Math.random() * 100,
    activeUsers: Math.floor(Math.random() * 50),
    sessionCount: Math.floor(Math.random() * 20),
  };
};

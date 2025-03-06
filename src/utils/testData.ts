export const generateTestData = (count: number) => {
  const now = new Date();
  const data = [];
  
  for (let i = 0; i < count; i++) {
    data.push({
      timestamp: new Date(now.getTime() - i * 3600000).toISOString(),
      flowScore: Math.round(Math.random() * 100),
      sessionCount: Math.floor(Math.random() * 20),
      activeUsers: Math.floor(Math.random() * 50)
    });
  }
  
  return data;
};
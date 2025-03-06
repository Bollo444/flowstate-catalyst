describe('Flow Performance Tests', () => {
  test('Dashboard maintains performance under heavy data load', async () => {
    const startTime = performance.now();
    
    // Simulate heavy data load
    const heavyData = generateTestData(1000); // 1000 data points
    
    render(<TeamFlowDashboard initialData={heavyData} />);
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    expect(renderTime).toBeLessThan(1000); // Should render in less than 1 second
  });

  test('Real-time updates handle high frequency', async () => {
    const { getByTestId } = render(<TeamFlowDashboard />);
    
    // Simulate rapid updates
    for (let i = 0; i < 100; i++) {
      await supabase
        .from('team_metrics')
        .insert([generateMetric()]);
      
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    
    // Verify UI remains responsive
    const chart = getByTestId('metrics-chart');
    expect(chart).toMatchSnapshot();
  });
});

const generateTestData = (count: number) => {
  const now = new Date();
  const data = [];
  
  for (let i = 0; i < count; i++) {
    data.push({
      id: `test-${i}`,
      timestamp: new Date(now.getTime() - i * 60000),
      flowScore: Math.random() * 100,
      activeUsers: Math.floor(Math.random() * 50),
      sessionCount: Math.floor(Math.random() * 20)
    });
  }
  
  return data;
};

const generateMetric = () => {
  return {
      timestamp: new Date().toISOString(),
      flowScore: Math.random() * 100,
      activeUsers: Math.floor(Math.random() * 50),
      sessionCount: Math.floor(Math.random() * 20)
    };
}
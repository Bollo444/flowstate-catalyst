describe('Flow Component Unit Tests', () => {
  test('MetricsChart handles all data types', () => {
    const testData = {
      numerical: [1, 2, 3],
      categorical: ['A', 'B', 'C'],
      temporal: [new Date(), new Date(), new Date()]
    };
    
    const { getByTestId } = render(<MetricsChart data={testData} selectedMetrics={[]} timeframe="day" />);
    expect(getByTestId('metrics-chart')).toMatchSnapshot();
  });

  test('ActivityFeed properly sorts and displays items', () => {
    const activities = [
      { id: '1', timestamp: new Date(), type: 'update', description: 'Activity 1' },
      { id: '2', timestamp: new Date(), type: 'create', description: 'Activity 2' }
    ];
    
    const { getAllByTestId } = render(<ActivityFeed activities={activities} teamId="test-team-id" />);
    const feedItems = getAllByTestId('activity-item');
    
    expect(feedItems).toHaveLength(2);
    expect(feedItems[0]).toHaveTextContent('update');
  });
});
export interface MetricsAggregator {
  getHistoricalPerformance(userId: string): Promise<number>;
  calculateEnergyLevel(userId: string): Promise<number>;
  trackTaskCompletion(taskId: string): Promise<void>;
}

export class BasicMetrics implements MetricsAggregator {
  async getHistoricalPerformance(userId: string): Promise<number> {
    // TODO: Implement actual metrics
    return 75; // Default performance score
  }

  async calculateEnergyLevel(userId: string): Promise<number> {
    // TODO: Implement energy calculation
    return 100; // Default energy level
  }

  async trackTaskCompletion(taskId: string): Promise<void> {
    // TODO: Implement tracking
  }
}

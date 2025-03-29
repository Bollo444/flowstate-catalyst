export class FlowMetricsService {
  private readonly supabase = getClient();
  private readonly METRICS_TABLE = "flow_metrics";
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private metricsCache = new Map<string, CachedMetrics>();

  async getUserMetrics(
    userId: string,
    timeRange: TimeRange
  ): Promise<FlowMetricsData> {
    const cacheKey = `${userId}-${timeRange}`;
    const cached = this.metricsCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    const { data } = await this.supabase
      .from(this.METRICS_TABLE)
      .select("*")
      .eq("user_id", userId)
      .gte("timestamp", this.getTimeRangeStart(timeRange))
      .order("timestamp", { ascending: true });

    const metrics = this.processMetricsData(data || []);
    this.metricsCache.set(cacheKey, {
      data: metrics,
      timestamp: Date.now(),
    });

    return metrics;
  }

  subscribeToUpdates(
    userId: string,
    callback: (metrics: FlowMetricsData) => void
  ) {
    return this.supabase
      .channel(`metrics:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: this.METRICS_TABLE,
          filter: `user_id=eq.${userId}`,
        },
        async () => {
          const metrics = await this.getUserMetrics(userId, "day");
          callback(metrics);
        }
      )
      .subscribe();
  }

  async recordMetrics(metrics: FlowMetricsInput): Promise<void> {
    await this.supabase
      .from(this.METRICS_TABLE)
      .insert(this.prepareMetricsForStorage(metrics));

    this.invalidateCache(metrics.userId);
  }

  private processMetricsData(rawData: any[]): FlowMetricsData {
    return {
      flowScores: this.calculateFlowScores(rawData),
      productivity: this.calculateProductivity(rawData),
      focusTime: this.calculateFocusTime(rawData),
      interruptions: this.processInterruptions(rawData),
      trends: this.analyzeTrends(rawData),
    };
  }

  private invalidateCache(userId: string): void {
    for (const [key] of this.metricsCache) {
      if (key.startsWith(userId)) {
        this.metricsCache.delete(key);
      }
    }
  }
}

export class ApiLoadBalancer {
  private readonly loadMetrics = new Map<string, LoadMetric>();
  private readonly balancer: LoadBalancer;

  balanceLoad(requests: ApiRequest[]): BalanceResult {
    const distribution = this.distributeLoad(requests);
    return this.generateBalanceResponse(distribution);
  }
}

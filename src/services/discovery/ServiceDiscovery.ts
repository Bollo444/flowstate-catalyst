export class ServiceDiscovery {
  private readonly discoverers = new Map<string, Discoverer>();
  private readonly manager: DiscoveryManager;

  discoverService(query: DiscoveryQuery): DiscoveryResult {
    const discovered = this.processDiscovery(query);
    return this.generateDiscoveryReport(discovered);
  }
}

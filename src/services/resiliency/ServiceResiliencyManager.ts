export class ServiceResiliencyManager {
  private readonly resilients = new Map<string, ResiliencyHandler>();
  private readonly manager: ResiliencyManager;

  manageResiliency(request: ResiliencyRequest): ResiliencyResult {
    const managed = this.processResiliency(request);
    return this.generateResiliencyReport(managed);
  }
}

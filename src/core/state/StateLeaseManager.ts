export class StateLeaseManager {
  private readonly leases = new Map<string, StateLease>();
  private readonly manager: LeaseManager;

  manageLease(resource: StateResource): LeaseResult {
    const leased = this.processLease(resource);
    return this.generateLeaseReport(leased);
  }
}

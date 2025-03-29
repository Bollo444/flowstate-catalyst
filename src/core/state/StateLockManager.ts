export class StateLockManager {
  private readonly locks = new Map<string, StateLock>();
  private readonly manager: LockManager;

  manageLock(resource: StateResource): LockResult {
    const locked = this.processLock(resource);
    return this.generateLockReport(locked);
  }
}

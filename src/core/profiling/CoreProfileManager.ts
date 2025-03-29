export class CoreProfileManager {
  private readonly profilers = new Map<string, ProfileHandler>();
  private readonly manager: ProfileManager;

  manageProfile(request: ProfileRequest): ProfileResult {
    const managed = this.processProfile(request);
    return this.generateProfileReport(managed);
  }
}

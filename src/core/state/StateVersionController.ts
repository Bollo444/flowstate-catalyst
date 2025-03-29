export class StateVersionController {
  private readonly versions = new Map<string, StateVersion>();
  private readonly controller: VersionController;

  manageVersion(state: State): VersionResult {
    const versioned = this.processVersion(state);
    return this.generateVersionReport(versioned);
  }
}

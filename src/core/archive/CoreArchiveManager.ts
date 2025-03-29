export class CoreArchiveManager {
  private readonly archivers = new Map<string, ArchiveHandler>();
  private readonly manager: ArchiveManager;

  manageArchive(request: ArchiveRequest): ArchiveResult {
    const managed = this.processArchive(request);
    return this.generateArchiveReport(managed);
  }
}

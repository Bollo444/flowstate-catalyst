export class DataArchivalManager {
  private readonly archivers = new Map<string, ArchivalHandler>();
  private readonly manager: ArchivalSystem;

  archiveData(data: ArchivableData): ArchivalResult {
    const archived = this.processArchival(data);
    return this.generateArchivalReport(archived);
  }
}

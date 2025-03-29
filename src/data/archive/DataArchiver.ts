export class DataArchiver {
  private readonly archives = new Map<string, Archive>();
  private readonly engine: ArchiveEngine;

  archiveData(data: ArchivableData): ArchiveResult {
    const archived = this.processArchiving(data);
    return this.generateArchiveReport(archived);
  }
}

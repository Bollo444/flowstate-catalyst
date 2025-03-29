export class DataCleansingEngine {
  private readonly cleansers = new Map<string, DataCleanser>();
  private readonly engine: CleansingEngine;

  cleanseData(data: CleanseableData): CleansingResult {
    const cleansed = this.processCleansing(data);
    return this.generateCleansingReport(cleansed);
  }
}

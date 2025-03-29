export class CoreJournalManager {
  private readonly journals = new Map<string, Journal>();
  private readonly manager: JournalManager;

  manageJournal(entries: JournalEntry[]): JournalResult {
    const journaled = this.processJournal(entries);
    return this.generateJournalReport(journaled);
  }
}

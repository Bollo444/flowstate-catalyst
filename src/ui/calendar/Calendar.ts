export class Calendar {
  private readonly calendarData = new Map<string, CalendarConfig>();
  private readonly manager: UIManager;

  renderCalendar(config: UIConfig): UIResult {
    const rendered = this.processCalendar(config);
    return this.generateCalendarReport(rendered);
  }
}

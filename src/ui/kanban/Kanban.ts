export class Kanban {
  private readonly kanbanData = new Map<string, KanbanConfig>();
  private readonly manager: UIManager;

  renderKanban(config: UIConfig): UIResult {
    const rendered = this.processKanban(config);
    return this.generateKanbanReport(rendered);
  }
}

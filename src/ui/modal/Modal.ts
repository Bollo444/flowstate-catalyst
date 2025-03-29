export class Modal {
  private readonly modalData = new Map<string, ModalConfig>();
  private readonly manager: UIManager;

  renderModal(config: UIConfig): UIResult {
    const rendered = this.processModal(config);
    return this.generateModalReport(rendered);
  }
}

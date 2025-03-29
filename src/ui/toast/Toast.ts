export class Toast {
  private readonly toastData = new Map<string, ToastConfig>();
  private readonly manager: UIManager;

  renderToast(config: UIConfig): UIResult {
    const rendered = this.processToast(config);
    return this.generateToastReport(rendered);
  }
}

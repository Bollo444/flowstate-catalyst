export class ColorPicker {
  private readonly colorPickerData = new Map<string, ColorPickerConfig>();
  private readonly manager: UIManager;

  renderColorPicker(config: UIConfig): UIResult {
    const rendered = this.processColorPicker(config);
    return this.generateColorPickerReport(rendered);
  }
}

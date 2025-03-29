import { UILayer } from "../../ui/UILayer";

describe("UI Layer Tests", () => {
  test("UI Components", () => {
    const ui = new UILayer();
    expect(ui).toBeDefined();
    expect(ui.render).toBeDefined();
  });
});

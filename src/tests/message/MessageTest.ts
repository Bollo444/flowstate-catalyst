import { MessageManager } from "../../systems/message/MessageManager";

describe("Message Tests", () => {
  test("Message Operations", () => {
    const message = new MessageManager();
    expect(message).toBeDefined();
    expect(message.manageMessage).toBeDefined();
  });
});

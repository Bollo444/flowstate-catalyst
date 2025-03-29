describe("Flow Experience E2E Tests", () => {
  test("Complete user flow journey", async () => {
    // Test user journey through all main features
    await page.goto("/dashboard");

    // Test metric selection
    await page.click('[data-testid="metric-selector"]');
    await page.click("text=Flow Score");

    // Test timeframe adjustment
    await page.click('[data-testid="timeframe-selector"]');
    await page.click("text=Week");

    // Test interactions
    await page.click('[data-testid="chart-point"]');

    // Verify tooltips and interactions
    const tooltip = await page.waitForSelector(".tooltip");
    expect(await tooltip.innerText()).toContain("Flow Score");
  });
});

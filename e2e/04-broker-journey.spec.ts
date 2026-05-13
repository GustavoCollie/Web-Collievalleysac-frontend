import { test, expect } from "@playwright/test";
import { registerUser, loginUser, expectDashboard, uniqueEmail } from "./helpers";

const email = uniqueEmail("broker");
const password = "TestPass123!";

test.describe("Broker Journey: Register → Login → Brokerage Request → Market", () => {
  test("1. Register as exportador_broker", async ({ page }) => {
    await registerUser(page, {
      fullName: "Ana Exportadora",
      email,
      password,
      role: "exportador_broker",
    });
  });

  test("2. Login and see broker dashboard", async ({ page }) => {
    await loginUser(page, email, password);
    await expectDashboard(page, "Dashboard Broker");

    await expect(page.getByText("Nueva Solicitud")).toBeVisible();
    await expect(page.getByText("Indicadores de Mercado")).toBeVisible();
  });

  test("3. Navigate to brokerage request form", async ({ page }) => {
    await loginUser(page, email, password);
    await expectDashboard(page, "Dashboard Broker");

    await page.getByText("Nueva Solicitud").click();
    await expect(page.getByRole("heading", { name: "Nueva Solicitud de Broker" })).toBeVisible();

    // Verify form fields exist
    await expect(page.getByLabel("País de origen")).toBeVisible();
    await expect(page.getByLabel("País de destino")).toBeVisible();
    await expect(page.getByLabel("Volumen (Kg)")).toBeVisible();
  });

  test("4. Navigate to market indicators", async ({ page }) => {
    await loginUser(page, email, password);
    await page.goto("/broker/market");
    await expect(page.getByRole("heading", { name: "Indicadores de Mercado" })).toBeVisible();

    // Should see FOB prices
    await expect(page.getByText("palta hass")).toBeVisible();
  });
});

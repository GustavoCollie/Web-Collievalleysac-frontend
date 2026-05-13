import { test, expect } from "@playwright/test";
import { registerUser, loginUser, expectDashboard, uniqueEmail } from "./helpers";

const email = uniqueEmail("farmer");
const password = "TestPass123!";

test.describe("Farmer Journey: Register → Login → Advisory → Articles", () => {
  test("1. Register as agricultor", async ({ page }) => {
    await registerUser(page, {
      fullName: "Pedro Agricultor",
      email,
      password,
      role: "agricultor",
    });
  });

  test("2. Login and see farmer dashboard", async ({ page }) => {
    await loginUser(page, email, password);
    await expectDashboard(page, "Dashboard Agricultor");

    await expect(page.getByText("Solicitar Asesoría")).toBeVisible();
    await expect(page.getByText("Artículos Técnicos")).toBeVisible();
    await expect(page.getByText("Calendario")).toBeVisible();
  });

  test("3. Navigate to advisory request page", async ({ page }) => {
    await loginUser(page, email, password);
    await expectDashboard(page, "Dashboard Agricultor");

    await page.getByText("Solicitar Asesoría").click();
    await expect(page.getByRole("heading", { name: "Asesorías Agronómicas" })).toBeVisible();
  });

  test("4. Navigate to technical articles", async ({ page }) => {
    await loginUser(page, email, password);
    await page.goto("/farmer/articles");
    await expect(page.getByRole("heading", { name: "Artículos Técnicos" })).toBeVisible();
  });

  test("5. Navigate to crop calendar", async ({ page }) => {
    await loginUser(page, email, password);
    await page.goto("/farmer/calendar");
    await expect(page.getByRole("heading", { name: "Calendario de Buenas Prácticas" })).toBeVisible();
  });
});

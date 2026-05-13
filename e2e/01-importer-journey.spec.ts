import { test, expect } from "@playwright/test";
import { registerUser, loginUser, expectDashboard, uniqueEmail } from "./helpers";

const email = uniqueEmail("importer");
const password = "TestPass123!";

test.describe("Importer Journey: Register → Login → Dashboard → Create Order", () => {
  test("1. Register as importador", async ({ page }) => {
    await registerUser(page, {
      fullName: "Carlos Importador",
      email,
      password,
      role: "importador",
    });
  });

  test("2. Login and see importer dashboard", async ({ page }) => {
    await loginUser(page, email, password);
    await expectDashboard(page, "Dashboard Importador");

    // Should see quick action links
    await expect(page.getByText("Ver Catálogo")).toBeVisible();
    await expect(page.getByText("Nuevo Pedido")).toBeVisible();
  });

  test("3. Navigate to product catalog", async ({ page }) => {
    await loginUser(page, email, password);
    await expectDashboard(page, "Dashboard Importador");

    await page.getByText("Ver Catálogo").click();
    await expect(page.getByRole("heading", { name: "Catálogo de Productos" })).toBeVisible();
  });

  test("4. Navigate to create order page", async ({ page }) => {
    await loginUser(page, email, password);
    await expectDashboard(page, "Dashboard Importador");

    await page.getByText("Nuevo Pedido").click();
    await expect(page.getByRole("heading", { name: "Nuevo Pedido" })).toBeVisible();
  });

  test("5. Navigate to order history", async ({ page }) => {
    await loginUser(page, email, password);
    await page.goto("/importer/orders");
    await expect(page.getByRole("heading", { name: "Mis Pedidos" })).toBeVisible();
  });
});

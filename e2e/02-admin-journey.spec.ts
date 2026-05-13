import { test, expect } from "@playwright/test";
import { loginUser, expectDashboard } from "./helpers";

// Uses seed admin credentials
const ADMIN_EMAIL = "admin@collievalley.com";
const ADMIN_PASSWORD = "admin12345";

test.describe("Admin Journey: Login → Dashboard → Edit Landing → Manage Users", () => {
  test("1. Login as admin and see dashboard with metrics", async ({ page }) => {
    await loginUser(page, ADMIN_EMAIL, ADMIN_PASSWORD);
    await expectDashboard(page, "Panel de Administración");

    // Should see metric cards
    await expect(page.getByText("Usuarios activos")).toBeVisible();
    await expect(page.getByText("Pedidos totales")).toBeVisible();
  });

  test("2. Navigate to user management", async ({ page }) => {
    await loginUser(page, ADMIN_EMAIL, ADMIN_PASSWORD);
    await expectDashboard(page, "Panel de Administración");

    await page.getByText("Gestionar Usuarios").click();
    await expect(page.getByRole("heading", { name: "Gestión de Usuarios" })).toBeVisible();

    // Should see the users table
    await expect(page.getByText("Nombre")).toBeVisible();
    await expect(page.getByText("Email")).toBeVisible();
  });

  test("3. Navigate to landing editor", async ({ page }) => {
    await loginUser(page, ADMIN_EMAIL, ADMIN_PASSWORD);
    await expectDashboard(page, "Panel de Administración");

    await page.getByText("Editar Landing Page").click();
    await expect(page.getByRole("heading", { name: "Editor de Landing Page" })).toBeVisible();
  });

  test("4. Verify landing page loads publicly", async ({ page }) => {
    await page.goto("/");
    // Hero section
    await expect(page.getByRole("heading").first()).toBeVisible();
    // Products section
    await expect(page.getByText("Productos")).toBeVisible();
    // Services section
    await expect(page.getByText("Servicios")).toBeVisible();
  });
});

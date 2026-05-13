import { type Page, expect } from "@playwright/test";

/**
 * Register a new user via the UI.
 */
export async function registerUser(
  page: Page,
  data: {
    fullName: string;
    email: string;
    password: string;
    role: string;
  },
) {
  await page.goto("/register");
  await page.getByLabel("Nombre completo").fill(data.fullName);
  await page.getByLabel("Correo electrónico").fill(data.email);
  await page.getByLabel("Teléfono").fill("+51999000001");
  await page.locator('select[name="role"]').selectOption(data.role);
  await page.getByLabel("Contraseña", { exact: false }).first().fill(data.password);
  await page.getByLabel("Confirmar contraseña").fill(data.password);
  await page.getByRole("button", { name: "Registrarse" }).click();
  // Should redirect to login
  await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
}

/**
 * Login an existing user via the UI.
 */
export async function loginUser(
  page: Page,
  email: string,
  password: string,
) {
  await page.goto("/login");
  await page.getByLabel("Correo electrónico").fill(email);
  await page.getByLabel("Contraseña").fill(password);
  await page.getByRole("button", { name: "Ingresar" }).click();
}

/**
 * Verify that the dashboard loaded correctly.
 */
export async function expectDashboard(page: Page, heading: string) {
  await expect(page.getByRole("heading", { name: heading })).toBeVisible({
    timeout: 10000,
  });
}

/**
 * Unique email generator for test isolation.
 */
export function uniqueEmail(prefix: string): string {
  const ts = Date.now();
  return `${prefix}-${ts}@test.collievalley.com`;
}

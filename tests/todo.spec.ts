import { test, expect } from "@playwright/test"

test("shows sign-in page when not authenticated", async ({ page }) => {
  await page.goto("/")
  await expect(page.getByTestId("sign-in-btn")).toBeVisible()
  await expect(page.getByText("Sign in with GitHub")).toBeVisible()
})

test("sign-in button is clickable", async ({ page }) => {
  await page.goto("/")
  const btn = page.getByTestId("sign-in-btn")
  await expect(btn).toBeEnabled()
})

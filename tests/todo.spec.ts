import { test, expect } from "@playwright/test"

test.beforeEach(async ({ page, request }) => {
  await request.delete("http://localhost:3001/api/todos")
  await page.goto("/")
})

test("shows empty state", async ({ page }) => {
  await expect(page.getByTestId("empty-state")).toBeVisible()
})

test("adds a todo", async ({ page }) => {
  await page.getByTestId("todo-input").fill("Buy groceries")
  await page.getByTestId("add-btn").click()

  await expect(page.getByTestId("todo-item")).toHaveCount(1)
  await expect(page.getByText("Buy groceries")).toBeVisible()
})

test("toggles a todo", async ({ page }) => {
  await page.getByTestId("todo-input").fill("Walk the dog")
  await page.getByTestId("add-btn").click()

  await page.getByTestId("todo-checkbox").click()

  const todoText = page.getByTestId("todo-text")
  await expect(todoText).toHaveClass(/line-through/)
})

test("deletes a todo", async ({ page }) => {
  await page.getByTestId("todo-input").fill("Clean the house")
  await page.getByTestId("add-btn").click()

  await expect(page.getByTestId("todo-item")).toHaveCount(1)

  await page.getByTestId("delete-btn").click()

  await expect(page.getByTestId("empty-state")).toBeVisible()
})

test("adds multiple todos", async ({ page }) => {
  const items = ["Task 1", "Task 2", "Task 3"]

  for (const item of items) {
    await page.getByTestId("todo-input").fill(item)
    await page.getByTestId("add-btn").click()
  }

  await expect(page.getByTestId("todo-item")).toHaveCount(3)
})

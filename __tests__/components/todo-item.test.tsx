import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { TodoItem } from "@/components/todo-item"

const mockTodo = {
  id: "1",
  text: "Buy groceries",
  completed: false,
}

const completedTodo = {
  id: "2",
  text: "Walk the dog",
  completed: true,
}

describe("TodoItem", () => {
  it("renders todo text", () => {
    render(
      <TodoItem todo={mockTodo} onToggle={vi.fn()} onDelete={vi.fn()} />
    )
    expect(screen.getByText("Buy groceries")).toBeInTheDocument()
  })

  it("renders unchecked checkbox for incomplete todo", () => {
    render(
      <TodoItem todo={mockTodo} onToggle={vi.fn()} onDelete={vi.fn()} />
    )
    const checkbox = screen.getByTestId("todo-checkbox")
    expect(checkbox).toHaveAttribute("data-state", "unchecked")
  })

  it("renders checked checkbox for completed todo", () => {
    render(
      <TodoItem todo={completedTodo} onToggle={vi.fn()} onDelete={vi.fn()} />
    )
    const checkbox = screen.getByTestId("todo-checkbox")
    expect(checkbox).toHaveAttribute("data-state", "checked")
  })

  it("applies line-through style for completed todo", () => {
    render(
      <TodoItem todo={completedTodo} onToggle={vi.fn()} onDelete={vi.fn()} />
    )
    const text = screen.getByTestId("todo-text")
    expect(text.className).toContain("line-through")
  })

  it("calls onToggle when checkbox is clicked", async () => {
    const onToggle = vi.fn()
    render(
      <TodoItem todo={mockTodo} onToggle={onToggle} onDelete={vi.fn()} />
    )
    await userEvent.click(screen.getByTestId("todo-checkbox"))
    expect(onToggle).toHaveBeenCalledWith("1", true)
  })

  it("calls onDelete when delete button is clicked", async () => {
    const onDelete = vi.fn()
    render(
      <TodoItem todo={mockTodo} onToggle={vi.fn()} onDelete={onDelete} />
    )
    await userEvent.click(screen.getByTestId("delete-btn"))
    expect(onDelete).toHaveBeenCalledWith("1")
  })
})

import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { AddTodo } from "@/components/add-todo"

describe("AddTodo", () => {
  it("renders input and button", () => {
    render(<AddTodo onAdd={vi.fn()} />)
    expect(screen.getByTestId("todo-input")).toBeInTheDocument()
    expect(screen.getByTestId("add-btn")).toBeInTheDocument()
  })

  it("calls onAdd with trimmed text on submit", async () => {
    const onAdd = vi.fn()
    render(<AddTodo onAdd={onAdd} />)

    await userEvent.type(screen.getByTestId("todo-input"), "  Buy milk  ")
    await userEvent.click(screen.getByTestId("add-btn"))

    expect(onAdd).toHaveBeenCalledWith("Buy milk")
  })

  it("clears input after submit", async () => {
    render(<AddTodo onAdd={vi.fn()} />)

    const input = screen.getByTestId("todo-input") as HTMLInputElement
    await userEvent.type(input, "Test todo")
    await userEvent.click(screen.getByTestId("add-btn"))

    expect(input.value).toBe("")
  })

  it("does not call onAdd with empty text", async () => {
    const onAdd = vi.fn()
    render(<AddTodo onAdd={onAdd} />)

    await userEvent.click(screen.getByTestId("add-btn"))

    expect(onAdd).not.toHaveBeenCalled()
  })

  it("does not call onAdd with whitespace-only text", async () => {
    const onAdd = vi.fn()
    render(<AddTodo onAdd={onAdd} />)

    await userEvent.type(screen.getByTestId("todo-input"), "   ")
    await userEvent.click(screen.getByTestId("add-btn"))

    expect(onAdd).not.toHaveBeenCalled()
  })
})

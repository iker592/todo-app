"use client"

import { useEffect, useState, useCallback } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AddTodo } from "@/components/add-todo"
import { TodoItem, type Todo } from "@/components/todo-item"

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])

  const refresh = useCallback(async () => {
    const res = await fetch("/api/todos")
    if (res.ok) setTodos(await res.json())
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const handleAdd = async (text: string) => {
    await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    })
    await refresh()
  }

  const handleToggle = async (id: string, completed: boolean) => {
    await fetch(`/api/todos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed }),
    })
    await refresh()
  }

  const handleDelete = async (id: string) => {
    await fetch(`/api/todos/${id}`, { method: "DELETE" })
    await refresh()
  }

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Todo List</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <AddTodo onAdd={handleAdd} />
        <div className="divide-y">
          {todos.length === 0 && (
            <p className="text-muted-foreground text-center py-8" data-testid="empty-state">
              No todos yet. Add one above!
            </p>
          )}
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
